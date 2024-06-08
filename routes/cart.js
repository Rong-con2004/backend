const cartController = require("../controller/cartController");

const router = require("express").Router();

//add cart
router.post("/add", cartController.addCart);

//get cart
router.get("/:id", cartController.getCart);
//delete cart
router.delete("/delete/:id", cartController.deleteCart);

//update cart
router.put("/update/:id", cartController.updateCart);

//get total cart
router.get("/total", cartController.totalCart);

module.exports = router;