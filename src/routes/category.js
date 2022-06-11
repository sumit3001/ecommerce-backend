import express from "express";
const router = express.Router();
import { isAuthenticated } from "../services/middlewares/isAuthenticated";
import { isAdmin } from "../services/middlewares/isAdmin";
import { body, validationResult } from "express-validator";
import { Category, Product } from "../services/mongodb/schema";

/*
type : POST
path : /category/add
body : (name, description)
query: none
description : Route to add a category 
*/

router.post(
  "/add",
  isAuthenticated,
  isAdmin,
  body("name").isLength({ min: 1 }),
  body("description").isLength({ min: 5 }),
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

      const { name, description } = req.body;

      console.log(req.user);
      const category = new Category({ name, description });
      await category.save();
      return res.json({
        data: {
          category,
        },
        success: true,
        message: "category added succesfully",
      });
    } catch (error) {
      console.log(error);
      return res.json({
        data: {
          category: null,
        },
        success: false,
        message: error.message,
      });
    }
  }
);

/*
type : GET
path : /category
body : none
query: none
description : Route to fetch all category 
*/

router.get("/all", async (req, res) => {
  try {
    const categories = await Category.find();
    return res.json({
      data: {
        categories,
      },
      success: true,
      message: "categories fetched succesfully",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      data: {
        categories: [],
      },
      success: false,
      message: error.message,
    });
  }
});

/*
type : DELETE
path : /category/:id
body : none
query: none
description : Route to delete a product 
*/

router.delete("/:id", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // check if products using category

    const products = await Product.find({ category: id });

    if (products.length > 0)
      return res.json({
        data: {
          category: null,
        },
        success: false,
        message: "Category could not deleted",
      });
    const category = await Category.findOneAndDelete({ _id: id });

    return res.json({
      data: {
        category,
      },
      success: true,
      message: "Category deleted succesfully",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      data: {
        category: [],
      },
      success: false,
      message: error.message,
    });
  }
});

// update api remaining

export default router;
