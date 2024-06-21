const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const { decodeToken } = require("./middlewares");

const AuthRouter = require("./app/auth/routes");
const ProductRouter = require("./app/products/routes");
const CategoriesRouter = require("./app/category/routes");
const TagRouter = require("./app/tag/routes");
const deliverAddressRouter = require("./app/deliveryAddres/routes");
const cartRouter = require("./app/cart/routes");
const orderRouter = require("./app/order/routes");
const invoiceRouter = require("./app/invoice/routes");

const app = express();

app.use("/public", express.static(path.join(__dirname, "public")));
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(decodeToken());

// Router tiap endpoint
app.use("/auth", AuthRouter);
app.use("/api", ProductRouter);
app.use("/api", CategoriesRouter);
app.use("/api", TagRouter);
app.use("/api", deliverAddressRouter);
app.use("/api", cartRouter);
app.use("/api", orderRouter);
app.use("/api", invoiceRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
