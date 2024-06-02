const {Cart} = require("../model/cartModel");


const cartController = {
    //add cart
    addCart: async(req,res) => {
        try {
            const cart = await Cart.findOne({ user: req.body.user, product: req.body.product});
            if(cart){
            const Quantity = cart.quantity + req.body.quantity;
            const Price = Quantity * req.body.price
            await cart.updateOne({$set: {quantity: Quantity, price: Price}})
            }else{
                
const Price = req.body.price * req.body.quantity;
                const cart = new Cart({user: req.body.user, product: req.body.product, quantity: req.body.quantity, price: Price});
                await cart.save();
            }
            res.status(200).json("Add successefully!")

        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }
};

module.exports = cartController;