import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  phone_number: {
    type: Number,
    required: true,
  },
  priority: {
    type: Number,
    default: null
  },
});

const User = mongoose.model("User", userSchema);

export default User;
