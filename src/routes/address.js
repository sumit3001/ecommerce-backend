import express from "express";
const router = express.Router();
import { isAuthenticated } from "../services/middlewares/isAuthenticated.js";
import { body, validationResult } from "express-validator";
import { Address, User } from "../services/mongodb/schema.js";

/*
type : POST
path : /address/add
body : (houseNumber, fullAddress, landMark)
query: none
description : Route to add a address
*/

router.post(
  "/add",
  isAuthenticated,
  body("houseNumber").isLength({ min: 1 }),
  body("fullAddress").isLength({ min: 5 }),
  body("landMark").isLength({ min: 5 }),
  body("pincode").isPostalCode("IN"),
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

      const { houseNumber, fullAddress, landMark, pincode } = req.body;
      const user = req.user;

      const address = new Address({
        user,
        houseNumber,
        fullAddress,
        landMark,
        pincode,
      });
      await address.save();

      await User.findOneAndUpdate(
        {
          _id: user,
        },
        {
          $addToSet: { addresses: address._id },
        }
      );
      // addToSet:- this add new entity to the set

      return res.json({
        data: {
          address,
        },
        success: true,
        message: "address added succesfully",
      });
    } catch (error) {
      console.log(error);
      return res.json({
        data: {
          address: null,
        },
        success: false,
        message: error.message,
      });
    }
  }
);

/*
type : DELETE
path : /address/:id
body : none
query: none
description : Route to delete a address 
*/

router.delete("/:id", isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;
    const address = await Address.findOneAndUpdate(
      { _id: user },
      {
        $pull: { addresses: { _id: id } },
      }
    );
    // $pull :- pull puls the address of id

    await Address.findOneAndDelete(address);

    return res.json({
      data: {
        address,
      },
      success: true,
      message: "address deleted succesfully",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      data: {
        address: [],
      },
      success: false,
      message: error.message,
    });
  }
});

export default router;
