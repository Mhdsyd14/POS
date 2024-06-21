const router = require("express").Router();
const authController = require("./controller");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;

passport.use(
  new localStrategy({ usernameField: "email" }, authController.localStrategy)
);
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/me", authController.me);

module.exports = router;
