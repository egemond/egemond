const mongoose = require("mongoose");
const Activity = mongoose.model("Activity");
const User = mongoose.model("User");

const getUser = (req, res) => {
  const userId = req.params.userId;
  if (userId) {
    if (userId === req.auth._id) {
      User.findById(userId)
        .select("-randomValue -hashValue -twoFactorAuthentication.secret -twoFactorAuthentication.recoveryCodes")
        .exec((error, result) => {
          if (!result) {
            return res.status(404).json({
              message: "The user with this identifier doesn't exist.",
            });
          } else if (error) {
            return res.status(500).json({
              message: "The data could not be retrieved.",
            });
          } else {
            return res.status(200).json(result);
          }
        });
    } else {
      return res.status(403).json({
        message: "You do not have permission to access this resource.",
      });
    }
  } else {
    return res.status(404).json({
      message: "Required parameter missing.",
    });
  }
};

const updateUser = (req, res) => {
  const userId = req.params.userId;
  if (userId) {
    if (!req.body.language || !req.body.email) {
      return res.status(400).json({
        message: "Required data missing.",
      });
    } else {
      if (userId === req.auth._id) {
        User.findById(userId)
          .select("-randomValue -hashValue -twoFactorAuthentication.secret -twoFactorAuthentication.recoveryCodes")
          .exec((error, user) => {
            if (!user) {
              return res.status(404).json({
                message: "The user with this identifier doesn't exist.",
              });
            } else if (error) {
              return res.status(500).json({
                message: "The action could not be completed.",
              });
            } else {
              User.findOne({
                email: req.body.email
              }).exec((error, result) => {
                if (result && result._id != req.auth._id) {
                  return res.status(400).json({
                    message: "The user with this email already exists.",
                  });
                } else if (error) {
                  return res.status(500).json({
                    message: "The data could not be retrieved.",
                  });
                } else {
                  user.email = req.body.email;
                  user.language = req.body.language;
                  user.theme = req.body.theme;
                  user.updated = Date.now();

                  if (req.body.password) {
                    user.password = user.setPassword(req.body.password);
                  }

                  user.save((error, result) => {
                    if (error) {
                      return res.status(500).json({
                        message: "The action could not be completed.",
                      });
                    } else {
                      return res.status(200).json(result);
                    }
                  });
                }
              });
            }
          });
      } else {
        return res.status(403).json({
          message: "You do not have permission to access this resource.",
        });
      }
    }
  } else {
    return res.status(401).json({
      message: "Please sign in to access this resource.",
    });
  }
};

const deleteUser = (req, res) => {
  const userId = req.params.userId;
  if (userId) {
    if (userId === req.auth._id) {
      User.findById(userId)
        .exec((error, result) => {
          if (!result) {
            return res.status(404).json({
              message: "The user with this identifier doesn't exist.",
            });
          } else if (error) {
            return res.status(500).json({
              message: "The action could not be completed.",
            });
          } else {
            Activity.deleteMany({
              user: req.auth._id
            }).exec((error, result) => {
                if (error) {
                  return res.status(500).json({
                    message: "The data could not be retrieved.",
                  });
                } else {
                  User.findByIdAndRemove(req.auth._id)
                    .exec(error => {
                      if (error) {
                        return res.status(500).json({
                          message: "The action could not be completed.",
                        });
                      } else {
                        return res.status(204).json(null);
                      }
                    });
                }
              });
          }
        });
    } else {
      return res.status(403).json({
        message: "You do not have permission to access this resource.",
      });
    }
  } else {
    return res.status(401).json({
      message: "Please sign in to access this resource.",
    });
  }
};

module.exports = {
  getUser,
  updateUser,
  deleteUser,
};