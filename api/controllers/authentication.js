const mongoose = require("mongoose");
const User = mongoose.model("User");

const signIn = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!req.body.email || !req.body.password) {
    return res.status(400).json({
      message: "Required data missing.",
    });
  } else {
    User.findOne({
      email: email
    }).exec((error, result) => {
      if (!result) {
        res.status(401).json({
          message: "Email or password is incorrect.",
        });
      } else if (error) {
        res.status(500).json({
          message: "The data could not be retrieved.",
        });
      } else {
        if (!result.checkPassword(password)) {
          res.status(403).json({
            message: "Email or password is incorrect.",
          });
        } else {
          res.status(200).json({
            token: result.generateToken(),
            language: result.language,
            currency: result.currency,
          });
        }
      }
    });
  }
};

const signUp = (req, res) => {
  if (process.env.ENABLE_SIGNUP === "true") {
    if (!req.body.email || !req.body.password || !req.body.masterPassword || !req.body.currency) {
      return res.status(400).json({
        message: "Required data missing.",
      });
    } else {
      User.findOne({
        email: req.body.email
      }).exec((error, result) => {
        if (result) {
          res.status(400).json({
            message: "The user with this email already exists.",
          });
        } else if (error) {
          res.status(500).json({
            message: "The data could not be retrieved.",
          });
        } else {
          if (req.body.masterPassword === process.env.MASTER_PASSWORD) {
            const user = new User();
            user.email = req.body.email;
            user.language = req.body.language;
            user.currency = req.body.currency;
            user.created = Date.now();
            user.updated = Date.now();
            user.setPassword(req.body.password);
            user.save((error) => {
              if (error) {
                res.status(500).json({
                  message: "The action could not be completed.",
                });
              } else {
                res.status(201).json({
                  token: user.generateToken(),
                  language: user.language,
                  currency: user.currency,
                });
              }
            });
          } else {
            res.status(403).json({
              message: "Master password is incorrect.",
            });
          }
        }
      });
    }
  } else {
    res.status(400).json({
      message: "This action is disabled.",
    });
  }
};

const signUpAttempt = (req, res) => {
  if (process.env.ENABLE_SIGNUP === "true") {
    if (!req.body.email || !req.body.password || !req.body.masterPassword) {
      return res.status(400).json({
        message: "Required data missing.",
      });
    } else {
      User.findOne({
        email: req.body.email
      }).exec((error, result) => {
        if (result) {
          res.status(400).json({
            message: "The user with this email already exists.",
          });
        } else if (error) {
          res.status(500).json({
            message: "The data could not be retrieved.",
          });
        } else {
          if (req.body.masterPassword === process.env.MASTER_PASSWORD) {
            res.status(204).json(null);
          } else {
            res.status(403).json({
              message: "Master password is incorrect.",
            });
          }
        }
      });
    }
  } else {
    res.status(400).json({
      message: "This action is disabled.",
    });
  }
};

module.exports = {
  signIn,
  signUp,
  signUpAttempt,
};