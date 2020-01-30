const express = require("express");
const router = express.Router();
//? Require our route controllers
const mainController = require("../controllers/mainController");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
//? error handeling import
const { catchErrors } = require("../handlers/errorHandlers");

//? Start of routes
//? Redirecting for homepage and first show
router.get("/", mainController.homepage);
router.get('/homepage', mainController.homepage)
//? Routing for the register form
router.get("/registerForm", userController.registerForm);
//! Actually loggin the user in
router.get("/login", authController.login);
//? Routing to get to the user login
router.get('/userLogin', mainController.userLogin);
//? Registering the user
router.post(
  "/register",
  //! First Validate the data
  userController.validateRegister,
  //! Register the user
  catchErrors(userController.register),
  //! Log the user in
  authController.login
);
//? POST request to login
router.post("/login", authController.login);
//? IF login is successful then it will send you to the app homepage 
router.get("/success", userController.success);
//? Log the user out
router.get("/logout", authController.logout);
//? APP - Getting around the app
router.get("/app/home", userController.appHome);
router.get("/app/explore", userController.explore);
router.get("/app/favourites", userController.favourites);
router.get("/app/bookings", userController.bookings);
//? route to getting account need to be loggin in
router.get(
  "/user/account",
  authController.isLoggedIn,
  authController.userAccount
);
//? route to updating account need to be loggin in
router.post("/userUpdate", catchErrors(authController.userUpdate));

module.exports = router;
