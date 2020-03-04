const express = require("express");
const router = express.Router();
//? Require our route controllers
const mainController = require("../controllers/mainController");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const sellerController = require("../controllers/sellerController");
//? error handeling import
const { catchErrors } = require("../handlers/errorHandlers");

//? Start of routes
//? Redirecting for homepage and first show
router.get("/", mainController.homepage);
router.get("/homepage", mainController.homepage);
//! back routing
router.get("/back", mainController.back);
//? Routing for the register form
router.get("/register", userController.registerForm);
//! Actually loggin the user in
router.get("/login", authController.login);
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
//? Log the user out
router.get("/logout", authController.logout);
//? APP - Getting around the app
router.get("/app/home", catchErrors(userController.explore));
router.get("/app/explore", catchErrors(userController.explore));
router.get("/app/favourites", catchErrors(userController.favourites));
router.get("/app/bookings", catchErrors(userController.bookings));
//? route to getting account need to be loggin in

router.get(
  "/user/account",
  authController.userAccount
);

//* account password reset
router.get('/user/forgot', catchErrors(authController.forgotPassword));
//* post request - submit form
router.post('/user/forgot/post', catchErrors(authController.forgot));
// //* handle the incoming token request 
router.get('/account/reset/:token', catchErrors(authController.reset));

router.post(
  "/account/reset/:token",
  authController.confirmedPasswords,
  catchErrors(authController.update)
);

//? route to updating account need to be loggin in
router.post("/userUpdate", catchErrors(authController.userUpdate));


//! Seller Routing

router.get(
  "/app/seller/create",
  authController.isLoggedIn,
  sellerController.createStore
);
//?  POST to create the new store
router.post("/createListing",
  sellerController.upload,
  catchErrors(sellerController.resize),
  catchErrors(sellerController.createListing));
//? Get request to list the owners store
router.get("/app/:id/edit",
  sellerController.editStore);
//? POST request to update stote
router.post("/app/:id/edit",
  sellerController.upload,
  catchErrors(sellerController.resize),
  catchErrors(sellerController.updateStore));

//? get store by slug -- visit the store

router.get("/app/explore/:id", catchErrors(sellerController.getStoreBySlug));

//? API end points

router.get('/api/v1/search', catchErrors(sellerController.searchStores));


module.exports = router;
