const Order = require("../model/orderModel");
const Cart= require("../model/cartModel")

const orderController = {
    getOrderHistory: async(req,res)=>{
        try {
            const order = await Order.find({customer: req.params.id});
            res.status(200).json(order);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    payOrder: async(req,res) => {
        try {
            const order = new Order(req.body);
            const save = await order.save();
            if(order){
                await Cart.deleteMany({user: req.params.id})
            }
            res.status(200).json("Order successfuly");
        } catch (error) {
            res.status(500).json(error);
        }
    }

};

module.exports = orderController;