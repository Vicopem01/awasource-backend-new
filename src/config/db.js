const mongoose = require('mongoose');
require('dotenv').config();

const URI = process.env.MONGO_URL;

mongoose.set("strictQuery", true);
const connectDB = () => {
  mongoose
    .connect(URI)
    .then((result) => console.log("Awasource Database Connected"))
    .catch((err) => console.log(err));
};

module.exports = connectDB;
