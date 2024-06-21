const { subject } = require("@casl/ability");
const { policyFor } = require("../../utils/index");
const Invoice = require("../invoice/model");

const show = async (req, res, next) => {
  try {
    let { order_id } = req.params;

    console.log(`Fetching invoice for order_id: ${order_id}`);

    // Cari invoice berdasarkan order_id
    let invoice = await Invoice.findOne({ order: order_id })
      .populate("order")
      .populate("user");

    // Periksa apakah invoice ditemukan
    if (!invoice) {
      console.error("Invoice not found");
      return res.status(404).json({
        error: 1,
        message: "Invoice tidak ditemukan",
      });
    }

    console.log(`Invoice found: ${invoice}`);

    // Tentukan kebijakan akses
    let policy = policyFor(req.user);
    let subjectInvoice = subject("Invoice", {
      ...invoice,
      user_id: invoice.user._id,
    });

    console.log(`Policy for user: ${req.user}`);
    console.log(`Subject invoice: ${subjectInvoice}`);

    // Periksa akses
    if (!policy.can("read", subjectInvoice)) {
      console.error("Access denied for this invoice");
      return res.status(403).json({
        error: 1,
        message: "Anda tidak memiliki akses untuk melihat invoice ini",
      });
    }

    // Kirim data invoice beserta informasi pengguna
    return res.json({
      data: invoice,
      user: req.user,
    });
  } catch (err) {
    console.error("Error fetching invoice:", err);
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

module.exports = {
  show,
};
