const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const orderItemSchema = Schema({
  name: {
    type: String,
    minlength: [5, "Panjang nama makanan maksimal 50 karakter"],
    required: [true, "name must be filled"],
  },

  price: {
    type: Number,
    required: [true, "Harga item harus diisi"],
  },

  qty: {
    type: Number,
    required: [true, "kuantitas harus diisi"],
    min: [1, "kuantitas minimal 1"],
  },

  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },

  order: {
    type: Schema.Types.ObjectId,
    ref: "Order",
  },
});

module.exports = model("OrderItem", orderItemSchema);
