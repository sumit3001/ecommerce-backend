import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User"
    },
    houseNumber: {
      type: Number,
      required: true
    },
    fullAddress: {
      type: String,
      minlength: 5,
      maxlength: 100,
      required: true
    },
    landMark: {
      type: String,
      required: true,
    },
    pincode: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true,
  }
);

export const Address = new mongoose.model("Address", AddressSchema);