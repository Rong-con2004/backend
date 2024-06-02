const cartController = require("../controller/cartController");

const router = require("express").Router();

//post
router.post("/add", cartController.addCart);

//get all product



module.exports = router;