const User = require("../Models/UserModel");
const jwt = require("jsonwebtoken");

exports.logInGoogle = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        profile: req.body.profile,
      });

      const resUser = await newUser.save();

      const token = jwt.sign({ userId: resUser._id }, process.env.json_str);
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json({
          message: "success",
          user: resUser,
        });
    } else {
      const token = jwt.sign({ userId: user._id }, process.env.json_str);
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json({
          message: "success",
          user,
        });
    }
  } catch (error) {
    console.log(error.message);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    res.status(200).json({
      message: "success",
      user,
    });
  } catch (error) {}
};

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({
      ...(req.query.username && { username: req.query.username }),
    });

    res.status(200).json({
      message: "success",
      users,
    });
  } catch (error) {}
};
