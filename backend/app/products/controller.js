const path = require("path");
const fs = require("fs");
const config = require("../config");
const Product = require("./model");
const Category = require("../category/model");
const Tag = require("../tag/model");

// Untuk menambahkan product
const store = async (req, res, next) => {
  try {
    let payload = req.body;

    // Update karena relasi dengan category
    if (payload.category) {
      let category = await Category.findOne({
        name: { $regex: payload.category, $options: "i" },
      });
      if (category) {
        payload = { ...payload, category: category._id };
      } else {
        delete payload.category;
      }
    }

    if (payload.tags && payload.tags.length > 0) {
      let tags = await Tag.find({
        name: { $in: payload.tags.map((tag) => new RegExp(tag, "i")) },
      });
      if (tags.length) {
        payload = { ...payload, tags: tags.map((tag) => tag._id) };
      } else {
        delete payload.tags; // Corrected to delete tags instead of category
      }
    }

    if (req.file) {
      let tmp_path = req.file.path;
      let originalExt =
        req.file.originalname.split(".")[
          req.file.originalname.split(".").length - 1
        ];
      let filename = req.file.filename + "." + originalExt;
      let target_path = path.resolve(
        config.rootPath,
        `public/images/products/${filename}`
      );

      const src = fs.createReadStream(tmp_path);
      const dest = fs.createWriteStream(target_path);
      src.pipe(dest);

      src.on("end", async () => {
        try {
          let product = new Product({
            ...payload,
            image_url: filename,
          });
          await product.save();
          return res.json(product);
        } catch (err) {
          fs.unlinkSync(target_path);
          if (err && err.name === "ValidationError") {
            return res.json({
              error: 1,
              message: err.message,
              fields: err.errors,
            });
          }
          next(err);
        }
      });
    } else {
      let product = new Product(payload);
      await product.save();
      return res.json(product);
    }
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

// Get data products
const index = async (req, res, next) => {
  try {
    let { skip = 0, limit = 0, q = "", category = "", tags = [] } = req.query;

    let criteria = {};

    if (q.length) {
      criteria = {
        ...criteria,
        name: {
          $regex: `${q}`,
          $options: "i",
        },
      };
    }

    if (category.length) {
      let categoryResults = await Category.findOne({
        name: { $regex: `${category}`, $options: "i" },
      });

      if (categoryResults) {
        criteria = {
          ...criteria,
          category: categoryResults._id,
        };
      }
    }

    if (tags.length) {
      let tagsResults = await Tag.find({ name: { $in: tags } });

      if (tagsResults > 0) {
        criteria = {
          ...criteria,
          tags: { $in: tagsResults.map((tag) => tag._id) },
        };
      }
    }

    let count = await Product.find().countDocuments();

    const product = await Product.find(criteria)
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .populate("category")
      .populate("tags");

    const productsWithImages = product.map((product) => ({
      ...product.toJSON(),
      imageUrl: `public/images/products/${product.image_url}`,
    }));

    return res.json({
      data: productsWithImages,
      count,
    });
  } catch (error) {
    next(error);
  }
};

// Update data products
const update = async (req, res, next) => {
  try {
    let payload = req.body;
    let { id } = req.params;

    if (payload.category) {
      let category = await Category.findOne({
        name: { $regex: payload.category, $options: "i" },
      });
      if (category) {
        payload = { ...payload, category: category._id };
      } else {
        delete payload.category;
      }
    }

    if (payload.tags && payload.tags.length > 0) {
      let tags = await Tag.find({ name: { $in: payload.tags } });
      if (tags.length) {
        payload = { ...payload, tags: tags.map((tag) => tag._id) };
      } else {
        delete payload.tags;
      }
    }

    if (req.file) {
      let tmp_path = req.file.path;
      let originalExt =
        req.file.originalname.split(".")[
          req.file.originalname.split(".").length - 1
        ];
      let filename = req.file.filename + "." + originalExt;
      let target_path = path.resolve(
        config.rootPath,
        `public/images/products/${filename}`
      );

      const src = fs.createReadStream(tmp_path);
      const dest = fs.createWriteStream(target_path);
      src.pipe(dest);

      src.on("end", async () => {
        try {
          let product = await Product.findById(id);
          let currentImage = `${config.rootPath}/public/images/products/${product.image_url}`;

          if (fs.existsSync(currentImage)) {
            fs.unlinkSync(currentImage);
          }

          product = await Product.findByIdAndUpdate(id, payload, {
            new: true,
            runValidators: true,
          });
          return res.json(product);
        } catch (err) {
          fs.unlinkSync(target_path);
          if (err && err.name === "ValidationError") {
            return res.json({
              error: 1,
              message: err.message,
              fields: err.errors,
            });
          }
          next(err);
        }
      });
    } else {
      let product = Product.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
      });
      return res.json(product);
    }
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

const destroy = async (req, res, next) => {
  try {
    let product = await Product.findOneAndDelete(req.params.id);
    let currentImage = `${config.rootPath}/public/images/products/${product.image_url}`;

    if (fs.existsSync(currentImage)) {
      fs.unlinkSync(currentImage);
    }

    return res.json(product);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  store,
  index,
  update,
  destroy,
};
