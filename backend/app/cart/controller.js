const Product = require("../products/model");
const CartItem = require("../cart-item/model");

// const update = async (req, res, next) => {
//   try {
//     const { items } = req.body;
//     console.log("Received Data :", items);

//     const productIds = items.map((item) => item.product._id);
//     console.log("Product Ids:", productIds);
//     const products = await Product.find({ _id: { $in: productIds } });
//     console.log("Products:", products);

//     let cartItems = items.map((item) => {
//       let relatedProduct = products.find(
//         (product) => product._id.toString() === item.product._id
//       );
//       return {
//         product: relatedProduct._id,
//         price: relatedProduct.price,
//         image_url: relatedProduct.image_url,
//         name: relatedProduct.name,
//         user: req.user._id,
//         qty: item.qty,
//       };
//     });

//     await CartItem.deleteMany({ user: req.user._id });
//     await CartItem.bulkWrite(
//       cartItems.map((item) => {
//         return {
//           updateOne: {
//             filter: {
//               user: req.user._id,
//               product: item.product,
//             },
//             update: item,
//             upsert: true,
//           },
//         };
//       })
//     );

//     return res.json(cartItems);
//   } catch (err) {
//     console.error("Error occurred:", err);

//     if (err && err.name === "ValidationError") {
//       return res.json({
//         error: 1,
//         message: err.message,
//         fields: err.errors,
//       });
//     }
//     next(err);
//   }
// };

const update = async (req, res, next) => {
  try {
    const { items } = req.body;
    console.log("Received Data :", items);

    const productIds = items.map((item) => item.product._id);
    console.log("Product Ids:", productIds);
    const products = await Product.find({ _id: { $in: productIds } });
    console.log("Products:", products);

    // Membuat array untuk operasi bulkWrite
    const bulkOps = items.map((item) => {
      const relatedProduct = products.find(
        (product) => product._id.toString() == item.product._id
      );
      console.log("Related Product:", relatedProduct);

      return {
        updateOne: {
          filter: {
            user: req.user._id,
            product: item.product,
          },
          update: {
            $setOnInsert: {
              product: item.product,
              price: relatedProduct ? relatedProduct.price : item.price,
              image_url: relatedProduct
                ? relatedProduct.image_url
                : item.image_url,
              name: relatedProduct ? relatedProduct.name : item.name,
              user: req.user._id,
            },
            $inc: { qty: item.qty },
          },
          upsert: true,
        },
      };
    });

    const result = await CartItem.bulkWrite(bulkOps);

    return res.json(result);
  } catch (err) {
    console.error("Error occurred:", err);

    // Menangani error dengan baik, misalnya untuk validasi atau error lainnya
    if (err && err.name === "ValidationError") {
      return res.status(400).json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    next(err);
  }
};

//menampilkan semua data
const index = async (req, res, next) => {
  try {
    let items = await CartItem.find({
      user: req.user._id,
    }).populate("product");

    return res.json(items);
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
  update,
  index,
};
