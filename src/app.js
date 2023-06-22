const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const cookieparser = require('cookie-parser');
const clientRoute = require('./routes/clientRoutes');
const adminRoute = require('./routes/adminRoutes');
const talentRoute = require('./routes/talentRoutes');
const productLaunchRoute = require("./routes/productLaunchRoutes");
const globalErrorHandler = require("./utils/errors/errors.controller");
const path = require("path");

const app = express();
app.use(express.static(path.join(__dirname, "public")));

//Timezone
process.env.TZ = "Africa/Lagos";

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());

app.get("/", (req, res) => {
  return res.status(200).json({ message: "Awasource Home Page.." });
});

app.use("/api/client", clientRoute);
app.use("/api/admin", adminRoute);
app.use("/api/talent", talentRoute);
app.use("/api/launch", productLaunchRoute);

// UnKnown Routes
app.all('*', (req, res, next) => {
  const err = new Error(`Route ${req.originalUrl} not found`);
  err.statusCode = 404;
  next(err);
});

// Global Error Handler
app.use(globalErrorHandler);

module.exports = app;
