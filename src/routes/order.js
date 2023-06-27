import express from "express";
const router = express.Router();
import { isAuthenticated } from "../services/middlewares/isAuthenticated.js";
import { isAdmin } from "../services/middlewares/isAdmin.js";
import { body, validationResult } from "express-validator";
import { Order, User } from "../services/mongodb/schema.js";

/*
type : POST
path : /order/create
body : (address, user, products, total, status)
query: none
description : Route to create order
*/

router.post(
  "/create",
  isAuthenticated,
  body("total").isNumeric(),
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

      const user = req.user;
      const { address, products, total, status } = req.body;

      const order = new Order({
        address,
        user,
        products,
        total,
        status,
      });
      await order.save();

      await User.findOneAndUpdate(
        {
          _id: user,
        },
        {
          $addToSet: { orders: order._id },
        }
      );
      // addToSet:- this add new entity to the set

      return res.json({
        data: {
          order,
        },
        success: true,
        message: "address added succesfully",
      });
    } catch (error) {
      console.log(error);
      return res.json({
        data: {
          order: null,
        },
        success: false,
        message: error.message,
      });
    }
  }
);

/*
type : GET
path : /order/all
body : none
query: none
description : Route to get all orders
*/

router.post("/all", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find({});

    return res.json({
      data: {
        orders,
      },
      success: true,
      message: "Orders fetched successfully",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      data: {
        orders: null,
      },
      success: false,
      message: error.message,
    });
  }
});

/*
type : GET
path : /order/me
body : none
query: none
description : Route to get users orders
*/

router.post("/me", isAuthenticated, async (req, res) => {
  try {
    const user = req.user;
    const orders = await Order.find({ _id: user });

    return res.json({
      data: {
        orders,
      },
      success: true,
      message: "Orders fetched successfully",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      data: {
        orders: null,
      },
      success: false,
      message: error.message,
    });
  }
});

export default router;
