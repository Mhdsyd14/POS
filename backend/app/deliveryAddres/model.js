const { Schema, model } = require("mongoose");

const deliveryAddressSchema = Schema(
  {
    name: {
      type: String,
      required: [true, "Nama alamat harus diisi"],
      maxlength: [255, "Panjang maksimal nama alamat adalah 255 karakter"],
    },
    kelurahan: {
      type: String,
      required: [true, "Nama kelurahan harus diisi"],
      maxlength: [255, "Panjang maksimal nama kelurahan adalah 255 karakter"],
    },
    kecamatan: {
      type: String,
      required: [true, "Nama kecamatan harus diisi"],
      maxlength: [255, "Panjang maksimal nama kecamatan adalah 255 karakter"],
    },
    kabupaten: {
      type: String,
      required: [true, "Nama kabupaten harus diisi"],
      maxlength: [255, "Panjang maksimal nama kabupaten adalah 255 karakter"],
    },
    provinsi: {
      type: String,
      required: [true, "Nama provinsi harus diisi"],
      maxlength: [255, "Panjang maksimal nama provinsi adalah 255 karakter"],
    },
    detail: {
      type: String,
      required: [true, "Detail Alamat harus diisi"],
      maxlength: [255, "Panjang maksimal detail alamat adalah 255 karakter"],
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = model("DeliveryAddress", deliveryAddressSchema);
