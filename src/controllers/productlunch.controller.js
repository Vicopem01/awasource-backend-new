const ProductLaunch = require("../models/productlaunch.model");
const { errorResMsg, successResMsg } = require("../lib/response");
const catchAsync = require("../lib/catchAsync");
const sendEmail = require("../utils/emailSender");
const {
  productLaunchTemp,
} = require("../utils/template/productLaunchTemplate");

exports.registerProductLaunch = catchAsync(async (req, res, next) => {
  const { email, fullName, company } = req.body;
  const productLaunch = new ProductLaunch({ email, fullName, company });
  await productLaunch.save();
  if (!productLaunch) {
    return errorResMsg(res, 400, "Product launch not created");
  }

  // send email
  await sendEmail({
    email: email,
    subject: "Product Launch",
    message: await productLaunchTemp(),
  });
  const dataInfo = {
    message: "Product launch created successfully",
  };
  return successResMsg(res, 201, dataInfo);
});
