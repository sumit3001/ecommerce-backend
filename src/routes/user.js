import express from "express";
import {User} from '../services/mongodb/schema';
import bcryptjs from "bcryptjs"; // used to make password hashed
import { validationResult, body } from "express-validator"; // used to for validation
import { singJWT, verifyJWT } from "../utils/index";
import { isAuthenticated } from "../services/middlewares/isAuthenticated";
import { isAdmin } from '../services/middlewares/isAdmin';

const router = express.Router();

/*
type : POST
path : /user/signup
body : (firstName, lastName, email, password)
query: none
description : Route for signup a new user
*/

router.post(
  "/signup",
  body("firstName").isLength({ min: 1 }), // middleware
  body("lastName").isLength({ min: 1 }),
  body("email").isEmail(),
  body("password").isLength({ min: 4 }),
  async (req, res) => {
    try {
      const { errors } = validationResult(req);
      console.log(errors);
      if (errors.length > 0)
        // validation
        return res.json({
          data: {
            user: null,
          },
          success: false,
          message: "Validation failed",
        });

      const { firstName, lastName, email, password } = req.body;

      const salt = await bcryptjs.genSalt(5);
      const hashedPassword = await bcryptjs.hash(password, salt);

      const user = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });

      await user.save();

      return res.json({
        data: {
          user,
        },
        success: true,
        message: "User saved successfully",
      });
    } catch (error) {
      console.log(error);
      return res.json({
        data: {
          user: null,
        },
        success: false,
        message: error.message,
      });
    }
  }
);

/*
type : POST
path : /user/login
body : (email, password)
query: none
description : Route for login a new user
*/

router.post(
  "/signin",
  body("email").isEmail(),
  body("password").isLength({ min: 4 }),
  async (req, res) => {
    try {
      const { errors } = validationResult(req);
      console.log(errors);
      if (errors.length > 0)
        // validation
        return res.json({
          data: {
            token: null,
          },
          success: false,
          message: "Validation failed",
        });

      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user)
        return res.json({
          data: {
            user: null,
          },
          success: false,
          message: "User does not exist",
        });

      const isVarified = await bcryptjs.compare(password, user.password);

      if (!isVarified)
        return res.json({
          data: {
            user: null,
          },
          success: false,
          message: "Invalid password",
        });

      // varified user create jwt

      const token = singJWT({
        id: user._id,
        email: user.email,
        role: user.role,
      })

      return res.json({
        data: {
          token,
        },
        success: true,
        message: "User logged in successfully",
      });
    } catch (error) {
      console.log(error);
      return res.json({
        data: {
          token: null,
        },
        success: false,
        message: error.message,
      });
    }
  }
);

/*
type : GET
path : /user/all
body : none
query: none
description : Route to get all user
*/

router.get(
  "/all",
  isAuthenticated,
  isAdmin,
  // make sure only admin can acces this route
  async (req, res) => {
    try {
      const users = await User.findOne({ }).select("firstName lastName email addresses orders");

      return res.json({
        data: {
          users,
        },
        success: true,
        message: "User fetched successfully",
      });
    } catch (error) {
      console.log(error);
      return res.json({
        data: {
          users: [],
        },
        success: false,
        message: error.message,
      });
    }
  }
);

/*
type : POST
path : /user/profile/me
body : none
query: none
description : Route for user's profile
header: authorization = bearer token
*/

router.get(
  "/profile/me",
  isAuthenticated,
  async (req, res) => {
    try {
      const token = req.headers['authorization'].split(' ')[1];
      const {id} = verifyJWT(token);
      const user = await User.findOne({ _id:id }).populate('addresses');

      return res.json({
        data: {
          user,
        },
        success: true,
        message: "User profile fetched successfully",
      });
    } catch (error) {
      console.log(error);
      return res.json({
        data: {
          user: null,
        },
        success: false,
        message: error.message,
      });
    }
  }
);

export default router;