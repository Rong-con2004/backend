const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 5001;
const bcrypt = require("bcryptjs");
const cryto = require("crypto");
const jwt = require("jsonwebtoken");
const JWT_SECRET = cryto.randomBytes(64).toString("hex");

app.use(express.json());

const mongoUrl = "mongodb://localhost:27017/app";

mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("Connected to database");
  })
  .catch((e) => {
    console.log(e);
  });

require("./UserDetails");
const User = mongoose.model("Users");

app.get("/", (req, res) => {
  res.send({ status: "success", message: "Server is running" });
});

app.post("/signup", async (req, res) => {
  const { email, phone_number, password } = req.body;

  const oldUser = await User.findOne({ email: email });
  if (oldUser) {
    return res.send({ data: "User already exists!!!" });
  }

  const encryptedPassword = await bcrypt.hash(password, 10);

  try {
    await User.create({
      email: email,
      phone_number: phone_number,
      password: encryptedPassword,
    });
    res.send({ status: "ok", data: "User created successfully!" });
  } catch (error) {
    res.send({ status: "error", data: error });
  }
});

app.post("/login", async (req, res) => {
  const { phone_number, password } = req.body;
  const oldUser = await User.findOne({ phone_number: phone_number });
  if (!oldUser) {
    return res.send({ status: "error", data: "User does not exist!!!" });
  }

  if (await bcrypt.compare(password, oldUser.password)) {
    const token = jwt.sign({ email: oldUser.email }, JWT_SECRET);

    if (res.status(201)) {
      return res.send({ status: "ok", data: token });
    } else {
      return res.send({ error: "error", data: "Invalid password!!!" });
    }
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
