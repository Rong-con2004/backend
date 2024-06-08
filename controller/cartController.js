const Cart = require("../model/cartModel");


const cartController = {
    //add cart
    addCart: async (req, res) => {
        try {
            const cart = await Cart.findOne({ user: req.body.user, product: req.body.product });
            if (cart) {
                const Quantity = cart.quantity + req.body.quantity;
                const Price = Quantity * req.body.price
                await cart.updateOne({ $set: { quantity: Quantity, price: Price } })
            } else {

                const Price = req.body.price * req.body.quantity;
                const cart = new Cart({ user: req.body.user, product: req.body.product, quantity: req.body.quantity, price: Price });
                await cart.save();
            }
            res.status(200).json("Add successefully!")

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    deleteCart: async (req, res) => {
        try {
            await Cart.findByIdAndDelete(req.params.id);
            res.status(200).json("Deleted successfuly");
        } catch (error) {
            res.status(500).json(error)
        }
    },
    getCart: async (req, res) => {
        try {
            const cart = await Cart.find({user: req.params.id}).populate("product", "name");
            res.status(200).json(cart);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    updateCart: async (req, res) => {
        try {
            const product = await Cart.findById(req.params.id);
            const action = req.body.action;
            if (product) {
                if (action == "plus") {
                    const initPrice = Math.round((req.body.price / req.body.quantity) * 10) / 10;

                    const quantity = req.body.quantity + 1;
                    const price = initPrice * quantity;

                    await product.updateOne({ $set: { quantity: quantity, price: price } })
                }
                if (action == "minus") {
                    const initPrice = Math.round((req.body.price / req.body.quantity) * 10) / 10;


                    if (req.body.quantity <= 0) {
                        const quantity = 0;
                        const price = 0;

                        await product.updateOne({ $set: { quantity: quantity, price: price } })
                    } else {
                        const quantity = req.body.quantity - 1;
                        const price = initPrice * quantity;

                        await product.updateOne({ $set: { quantity: quantity, price: price } })
                    }
                    
                }
            }
            res.status(200).json("Updated successfuly!!")
        } catch (error) {
            res.status(500).json({error: error.message})
        }
    },
    totalCart: async(req,res) => {
        try {
   
            const aggregateResult = await Cart.aggregate([
                {
                  $group: {
                    _id: null,
                    totalPrice: { $sum: '$price' },
                    totalQuantity: { $sum: 1 }
                  }
                }
              ]);
          
              const totalCart = {
                total: aggregateResult[0].totalPrice,
                quantity: aggregateResult[0].totalQuantity
              };
            res.status(200).json(totalCart);
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }
};

module.exports = cartController;