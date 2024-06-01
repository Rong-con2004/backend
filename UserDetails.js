const mongoose = require("mongoose");

const UserDetailSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true },
    phone_number: { type: String, unique: true },
    password: String,
  },
  {
    collection: "Users",
  }
);

mongoose.model("Users", UserDetailSchema);
