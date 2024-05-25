const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = async () => {
  try {
    // mongodb+srv://naingmoekhant098765:UCz7OowhlugjXFC8@keichat.wwc6fo2.mongodb.net/
    await mongoose
      .connect(process.env.mongodb_str)
      .then((res) => {
        console.log("mongodb sever is connected");
      })
      .catch((err) => {
        console.log(err.message);
      });
  } catch (error) {
    console.log(error.message);
  }
};
