import express from "express";
import { isAuthenticated } from "../services/middlewares/isAuthenticated";
import { isAdmin } from "../services/middlewares/isAdmin";
import { body, validationResult } from "express-validator";
import { Product } from "../services/mongodb/schema";
const router = express.Router();

/*
type : POST
path : /product/add
body : (name, description, sticherPrice, markedPrice, category, image, stock, color, compatibleWith)
query: none
description : Route to add a product 
*/

router.post(
  "/add",
  isAuthenticated,
  isAdmin,
  body("name").isLength({ min: 1 }),
  body("description").isLength({ min: 5 }),
  body("stickerPrice").isNumeric(),
  body("markedPrice").isNumeric(),
  body("image").isLength({ min: 5 }),
  body("stock").isNumeric(),
  body("color").isLength({ min: 1 }),
  async (req, res) => {
    try {
      const { errors } = validationResult(req);
      console.log(errors);
      if (errors.length > 0)
        // validation
        return res.json({
          data: {
            category: null,
          },
          success: false,
          message: "Validation failed",
        });

      const {
        name,
        description,
        stickerPrice,
        markedPrice,
        category,
        image,
        stock,
        color,
        compatibleWith,
      } = req.body;

      console.log(req.user);
      const products = new Product({
        name,
        description,
        stickerPrice,
        markedPrice,
        category,
        image,
        stock,
        color,
        compatibleWith,
      });
      await products.save();
      return res.json({
        data: {
          products,
        },
        success: true,
        message: "products added succesfully",
      });
    } catch (error) {
      console.log(error);
      return res.json({
        data: {
          products: null,
        },
        success: false,
        message: error.message,
      });
    }
  }
);

/*
type : GET
path : /product/all
body : none
query: none
description : Route to fetch all product 
*/

router.get("/all", async (req, res) => {
  try {
    const products = await Product.find({}).populate("category");
    return res.json({
      data: {
        products,
      },
      success: true,
      message: "products fetched succesfully",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      data: {
        products: [],
      },
      success: false,
      message: error.message,
    });
  }
});

/*
type : DELETE
path : /product/:id
body : none
query: none
description : Route to delete a product 
*/

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOneAndDelete({ _id: id });
    return res.json({
      data: {
        product,
      },
      success: true,
      message: "products deleted succesfully",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      data: {
        product: [],
      },
      success: false,
      message: error.message,
    });
  }
});

export default router;