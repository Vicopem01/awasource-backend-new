require('dotenv').config();
const Admin = require('./models/admin.model');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/fuck");
    console.log("Connected to mongodb");
  } catch (error) {
    console.log(error);
  }
};

connectDB();

const insertData = async () => {
  await Admin.deleteMany({});
  const data = [
    {
      email: "admin@yopmail.com",
      password: "Victor11.",
      phone_number: "09030553580", //
    },
    {
      email: "abayomiogunnusi@gmail.com",
      password: "Bassguitar1#",
      phone_number: "08168623014", //
    },
  ];
  try {
    for (var i = 0; i < data.length; i++) {
      const salt = 10;
      const hashedPassword = await bcrypt.hash(data[i].password, salt);
      const admin = await Admin.create({
        email: data[i].email,
        password: hashedPassword,
      });
    }
    console.log("Data inserted successfully");
  } catch (err) {
    console.error(err);
  }
};

insertData();
