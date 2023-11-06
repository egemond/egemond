const crypto = require("crypto");
const bcrypt = require("bcrypt");
const otpauth = require("otpauth");

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
        return res.status(401).json({
          message: "Email or password is incorrect.",
        });
      } else if (error) {
        return res.status(500).json({
          message: "The data could not be retrieved.",
        });
      } else {
        if (!result.checkPassword(password)) {
          return res.status(403).json({
            message: "Email or password is incorrect.",
          });
        } else {
          if (result.twoFactorAuthentication.enabled) {
            return res.status(401).json({
              message: "Two-factor authentication is required.",
            });
          } else {
            return res.status(200).json({
              token: result.generateToken(),
              language: result.language,
              currency: result.currency,
              theme: result.theme,
            });
          }
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
          return res.status(400).json({
            message: "The user with this email already exists.",
          });
        } else if (error) {
          return res.status(500).json({
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
                return res.status(500).json({
                  message: "The action could not be completed.",
                });
              } else {
                return res.status(201).json({
                  token: user.generateToken(),
                  language: user.language,
                  currency: user.currency,
                  theme: user.theme,
                });
              }
            });
          } else {
            return res.status(403).json({
              message: "Master password is incorrect.",
            });
          }
        }
      });
    }
  } else {
    return res.status(400).json({
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
          return res.status(400).json({
            message: "The user with this email already exists.",
          });
        } else if (error) {
          return res.status(500).json({
            message: "The data could not be retrieved.",
          });
        } else {
          if (req.body.masterPassword === process.env.MASTER_PASSWORD) {
            return res.status(204).json(null);
          } else {
            return res.status(403).json({
              message: "Master password is incorrect.",
            });
          }
        }
      });
    }
  } else {
    return res.status(400).json({
      message: "This action is disabled.",
    });
  }
};

/* Two-factor authentication */
/* Generate a secret for setting up two-factor authentication */
const configure2FA = (req, res) => {
  const userId = req.auth._id;
  User.findById(userId)
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
        if (!result.twoFactorAuthentication.enabled) {
          const secret = new otpauth.Secret();
          const totp = new otpauth.TOTP({
            algorithm: process.env.TOTP_ALGORITHM || "SHA1",
            digits: 6,
            period: 30,
            secret: secret,
          });

          result.twoFactorAuthentication = {
            enabled: false,
            secret: secret.base32,
          };

          result.save((error, result) => {
            if (error) {
              return res.status(500).json({
                message: "The action could not be completed.",
              });
            } else {
              return res.status(200).json({
                secret: secret.base32,
                url: totp.toString(),
              });
            }
          });
        } else {
          return res.status(400).json({
            message: "Two-factor authentication is already activated for your account.",
          });
        }
      }
    });
};

/* Disable two-factor authentication */
const remove2FA = (req, res) => {
  User.findById(req.auth._id)
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
        result.twoFactorAuthentication.enabled = false;
        delete result.twoFactorAuthentication.secret;

        result.save((error, result) => {
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
};

/* Verify the authentication code, enable two-factor authentication and generate recovery codes */
const activate2FA = (req, res) => {
  if (!req.body.token) {
    return res.status(400).json({
      message: "Required data missing.",
    });
  } else {
    const userId = req.auth._id;
    User.findById(userId)
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
          if (!result.twoFactorAuthentication.token) {
            if (!result.twoFactorAuthentication.enabled) {
              try {
                const token = req.body.token;
                const totp = new otpauth.TOTP({
                  algorithm: process.env.TOTP_ALGORITHM || "SHA1",
                  digits: 6,
                  period: 30,
                  secret: otpauth.Secret.fromBase32(result.twoFactorAuthentication.secret),
                });
          
                const validate = totp.validate({
                  token: token,
                  window: 1,
                });
          
                if (validate === 0) {
                  const recoveryCodes = [];
                  const recoveryCodesHashed = [];
                  for (var i = 0; i < 8; i++) {
                    const recoveryCode = crypto.randomBytes(6).toString("hex");
                    const recoveryCodeHashed = bcrypt.hashSync(recoveryCode, bcrypt.genSaltSync(10));
                    
                    recoveryCodes.push(recoveryCode);
                    recoveryCodesHashed.push(recoveryCodeHashed);
                  }

                  result.twoFactorAuthentication = {
                    enabled: true,
                    secret: result.twoFactorAuthentication.secret,
                    recoveryCodes: recoveryCodesHashed,
                  };
        
                  result.save((error, result) => {
                    if (error) {
                      return res.status(500).json({
                        message: "The action could not be completed.",
                      });
                    } else {
                      return res.status(200).json(recoveryCodes);
                    }
                  });
                } else {
                  return res.status(403).json({
                    message: "The provided authentication code is invalid.",
                  });
                }
              } catch (error) {
                return res.status(500).json({
                  message: "The action could not be completed.",
                });
              }
            } else {
              return res.status(400).json({
                message: "Two-factor authentication is already configured for your account.",
              });
            }
          } else {
            return res.status(400).json({
              message: "Two-factor authentication has not been configured yet.",
            });
          }
        }
      });
  }
};

/* Validate the authentication code and generate a JWT */
const verify2FA = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const token = req.body.token;

  if (!req.body.email || !req.body.password || !req.body.token) {
    return res.status(400).json({
      message: "Required data missing.",
    });
  } else {
    User.findOne({
      email: email
    }).exec((error, result) => {
      if (!result) {
        return res.status(401).json({
          message: "Email or password is incorrect.",
        });
      } else if (error) {
        return res.status(500).json({
          message: "The data could not be retrieved.",
        });
      } else {
        if (!result.checkPassword(password)) {
          return res.status(403).json({
            message: "Email or password is incorrect.",
          });
        } else {
          if (result.twoFactorAuthentication.enabled) {
            try {
              const totp = new otpauth.TOTP({
                algorithm: process.env.TOTP_ALGORITHM || "SHA1",
                digits: 6,
                period: 30,
                secret: otpauth.Secret.fromBase32(result.twoFactorAuthentication.secret),
              });
        
              const validate = totp.validate({
                token: token,
                window: 1,
              });
        
              if (validate === 0) {
                return res.status(200).json({
                  token: result.generateToken(),
                  language: result.language,
                  currency: result.currency,
                  theme: result.theme,
                });
              } else {
                return res.status(403).json({
                  message: "The provided authentication code is invalid.",
                });
              }
            } catch (error) {
              return res.status(500).json({
                message: "The action could not be completed.",
              });
            }
          } else {
            return res.status(400).json({
              message: "Two-factor authentication is not enabled for your account.",
            });
          }
        }
      }
    });
  }
};

/* Validate the recovery code and generate a JWT */
const verifyRecoveryCode = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const recoveryCode = req.body.recoveryCode;

  if (!req.body.email || !req.body.password || !req.body.recoveryCode) {
    return res.status(400).json({
      message: "Required data missing.",
    });
  } else {
    User.findOne({
      email: email
    }).exec((error, result) => {
      if (!result) {
        return res.status(401).json({
          message: "Email or password is incorrect.",
        });
      } else if (error) {
        return res.status(500).json({
          message: "The data could not be retrieved.",
        });
      } else {
        if (!result.checkPassword(password)) {
          return res.status(403).json({
            message: "Email or password is incorrect.",
          });
        } else {
          if (result.twoFactorAuthentication.enabled) {
            let recoveryCodeIndex = -1;
            result.twoFactorAuthentication.recoveryCodes.some((hashedRecoveryCode, i) => {
              if (bcrypt.compareSync(recoveryCode, hashedRecoveryCode)) {
                recoveryCodeIndex = i;
                return true;
              }
              return false;
            });

            if (recoveryCodeIndex >= 0) {
              result.twoFactorAuthentication.recoveryCodes.splice(recoveryCodeIndex, 1);
              result.save((error, result) => {
                if (error) {
                  return res.status(500).json({
                    message: "The action could not be completed.",
                  });
                } else {
                  return res.status(200).json({
                    token: result.generateToken(),
                    language: result.language,
                    currency: result.currency,
                    theme: result.theme,
                  });
                }
              });
            } else {
              return res.status(400).json({
                message: "The provided recovery code is invalid.",
              });
            }
          } else {
            return res.status(400).json({
              message: "Two-factor authentication is not enabled for your account.",
            });
          }
        }
      }
    });
  }
};

module.exports = {
  signIn,
  signUp,
  signUpAttempt,
  configure2FA,
  remove2FA,
  activate2FA,
  verify2FA,
  verifyRecoveryCode,
};