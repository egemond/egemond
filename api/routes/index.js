var express = require("express");
var router = express.Router();

var jwt = require("express-jwt");

var authentication = jwt.expressjwt({
  secret: process.env.JWT_SECRET,
  userProperty: "payload",
  algorithms: [
    "HS512",
  ],
});

var activitiesController = require("../controllers/activities");
var authenticationController = require("../controllers/authentication");
var categoriesController = require("../controllers/categories");
var currenciesController = require("../controllers/currencies");
var usersController = require("../controllers/users");

/* Activities */
router.get("/activities", authentication, activitiesController.getActivities);
router.get("/activities/:activityId", authentication, activitiesController.getActivity);
router.post("/activities", authentication, activitiesController.createActivity);
router.put("/activities/:activityId", authentication, activitiesController.updateActivity);
router.delete("/activities/:activityId", authentication, activitiesController.deleteActivity);

/* Authentication */
router.post("/auth/signin", authenticationController.signIn);
router.post("/auth/signup", authenticationController.signUp);
router.post("/auth/signup/attempt", authenticationController.signUpAttempt);
router.get("/auth/2fa/configure", authentication, authenticationController.configure2FA);
router.post("/auth/2fa/activate", authentication, authenticationController.activate2FA);
router.delete("/auth/2fa/remove", authentication, authenticationController.remove2FA);
router.post("/auth/2fa/verify", authenticationController.verify2FA);
router.post("/auth/2fa/recovery/verify", authenticationController.verifyRecoveryCode);

/* Categories */
router.get("/categories", categoriesController.getCategories);

/* Currencies */
router.get("/currencies", currenciesController.getCurrencies);
router.get("/currencies/:currencyId", currenciesController.getCurrency);

/* Users */
router.get("/users/:userId", authentication, usersController.getUser);
router.put("/users/:userId", authentication, usersController.updateUser);
router.delete("/users/:userId", authentication, usersController.deleteUser);

router.use((req, res, next) => {
  if (req.method != "OPTIONS" && !req.route) {
    return res.status(404).json({
      message: "This resource doesn't exist.",
    });
  }
  next();
});

module.exports = router;