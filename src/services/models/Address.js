import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema(
  {
    houseNumber: {
      type: Number,
      required: true
    },
    fullAddress: {
      type: String,
      minlength: 50,
      maxlength: 100,
      required: true
    },
    landMark: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

const Address = new mongoose.model("Address", AddressSchema);

export default Address;