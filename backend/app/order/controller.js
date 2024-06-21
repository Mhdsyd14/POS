const CartItem = require("../cart-item/model");
const DeliveryAddress = require("../deliveryAddres/model");
const Order = require("../order/model");
const { Types } = require("mongoose");
const OrderItem = require("../order-item/model");

const store = async (req, res, next) => {
  try {
    let { delivery_fee, delivery_address } = req.body;
    let items = await CartItem.find({ user: req.user._id }).populate("product");

    if (!items || items.length === 0) {
      return res.json({
        error: 1,
        message:
          "You cannot create an order because you have no items in your cart.",
      });
    }

    let address = await DeliveryAddress.findById(delivery_address);
    if (!address) {
      return res.json({
        error: 1,
        message: "Invalid delivery address. Please provide a valid address.",
      });
    }

    // Create the order object
    let order = new Order({
      _id: new Types.ObjectId(),
      status: "waiting_payment",
      delivery_fee: delivery_fee,
      delivery_address: {
        provinsi: address.provinsi,
        kabupaten: address.kabupaten,
        kecamatan: address.kecamatan,
        kelurahan: address.kelurahan,
        detail: address.detail,
      },
      user: req.user._id,
    });

    // Save order items
    let orderItems = await OrderItem.insertMany(
      items.map((item) => ({
        ...item,
        name: item.product.name,
        qty: parseInt(item.qty),
        price: parseInt(item.product.price),
        order: order._id,
        product: item.product._id,
      }))
    );

    // Add order items to the order object
    orderItems.forEach((item) => order.order_items.push(item));

    // Save the order with populated order items
    await order.save();

    // Clear cart items after order is successfully created
    await CartItem.deleteMany({ user: req.user._id });

    return res.json(order); // Return the saved order
  } catch (err) {
    if (err && err.name === "ValidationError") {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    next(err);
  }
};

const index = async (req, res, next) => {
  try {
    let { skip = 0, limit = 10 } = req.query;
    let count = await Order.find({ user: req.user._id }).countDocuments();
    let orders = await Order.find({ user: req.user._id })
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .populate("order_items")
      .sort("-createdAt");

    return res.json({
      data: orders.map((order) => order.toJSON({ virtuals: true })),
      count,
    });
  } catch (err) {
    if (err && err.name === "ValidationError") {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    next(err);
  }
};

module.exports = {
  store,
  index,
};
