const mongoose = require("mongoose");
const Activity = mongoose.model("Activity");

const getActivities = (req, res) => {
  let query = {
    user: req.auth._id
  };

  let tag = req.query.tag;
  if (tag != null) {
    query.tags = tag;
  }

  let from = req.query.from;
  if (from != null) {
    if ("date" in query) {
      query.date.$gte = from;
    } else {
      query.date = {
        $gte: from
      };
    }
  }

  let to = req.query.to;
  if (to != null) {
    if ("date" in query) {
      query.date.$lt = to;
    } else {
      query.date = {
        $lt: to
      };
    }
  }

  Activity.find(query)
    .sort("-date -created")
    .populate("category")
    .populate("currency")
    .exec((error, result) => {
      if (error) {
        return res.status(500).json({
          message: "The data could not be retrieved.",
        });
      } else {
        return res.status(200).json(result);
      }
    });
};

const getActivity = (req, res) => {
  const activityId = req.params.activityId;
  if (activityId) {
    Activity.findOne({
        $and: [{
          _id: activityId
        }, {
          user: req.auth._id
        }]
      })
      .populate("category")
      .populate("currency")
      .exec((error, result) => {
        if (!result) {
          return res.status(404).json({
            message: "The activity with this identifier doesn't exist.",
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
    return res.status(404).json({
      message: "Required parameter missing.",
    });
  }
};

const createActivity = (req, res) => {
  if (!req.body.amount || !req.body.category || !req.body.currency || !req.body.date || !req.body.title) {
    return res.status(400).json({
      message: "Required data missing.",
    });
  } else {
    Activity.create({
        amount: req.body.amount,
        category: req.body.category,
        currency: req.body.currency,
        date: req.body.date,
        description: req.body.description,
        isExcluded: req.body.isExcluded,
        tags: req.body.tags,
        title: req.body.title,
        user: req.auth._id,
        created: Date.now(),
        updated: Date.now(),
      },
      (error, result) => {
        if (error) {
          return res.status(400).json({
            message: "Required data missing.",
          });
        } else {
          return res.status(201).json(result);
        }
      }
    );
  }
};

const updateActivity = (req, res) => {
  const activityId = req.params.activityId;
  if (activityId) {
    if (!req.body.amount || !req.body.category || !req.body.currency || !req.body.date || !req.body.title) {
      return res.status(400).json({
        message: "Required data missing.",
      });
    } else {
      Activity.findById(activityId).exec((error, result) => {
        if (!result) {
          return res.status(404).json({
            message: "The activity with this identifier doesn't exist.",
          });
        } else if (error) {
          return res.status(500).json({
            message: "The action could not be completed.",
          });
        } else {
          if (result.user == req.auth._id) {
            result.amount = req.body.amount;
            result.category = req.body.category;
            result.currency = req.body.currency;
            result.date = req.body.date;
            result.description = req.body.description;
            result.isExcluded = req.body.isExcluded;
            result.tags = req.body.tags;
            result.title = req.body.title;
            result.updated = Date.now();

            result.save((error, result) => {
              if (error) {
                return res.status(500).json({
                  message: "The action could not be completed.",
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
        }
      });
    }
  } else {
    return res.status(404).json({
      message: "Required parameter missing.",
    });
  }
};

const deleteActivity = (req, res) => {
  const activityId = req.params.activityId;
  if (activityId) {
    Activity.findById(activityId).exec((error, result) => {
      if (!result) {
        return res.status(404).json({
          message: "The activity with this identifier doesn't exist.",
        });
      } else if (error) {
        return res.status(500).json({
          message: "The action could not be completed.",
        });
      } else {
        if (result.user == req.auth._id) {
          Activity.findByIdAndRemove(activityId)
            .exec(error => {
              if (error) {
                return res.status(500).json({
                  message: "The action could not be completed.",
                });
              } else {
                return res.status(204).json(null);
              }
            });
        } else {
          return res.status(403).json({
            message: "You do not have permission to access this resource.",
          });
        }
      }
    });
  } else {
    return res.status(404).json({
      message: "Required parameter missing.",
    });
  }
};

module.exports = {
  getActivities,
  getActivity,
  createActivity,
  updateActivity,
  deleteActivity,
};