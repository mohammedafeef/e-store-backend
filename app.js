const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const cartRoutes = require("./routes/cartRoutes");
const productRoutes = require("./routes/productRoutes");
const globalErrHandler = require("./controllers/errorController");
const RouteError = require("./utils/RouteError");
const app = express();

// Allow Cross-Origin requests
app.use(cors());

// // Set security HTTP headers
// app.use(helmet());

//Using bodyparser through middleware to format the req body
app.use(bodyParser.json());

// // Data sanitization against Nosql query injection
// app.use(mongoSanitize());

// // Data sanitization against XSS(clean user input from malicious HTML code)
// app.use(xss());

// // Prevent parameter pollution
// app.use(hpp());

// Routes
app.use("/user", userRoutes);
app.use("/cart", cartRoutes);
app.use("/product", productRoutes);

// handle undefined Routes
app.use("*", (req, res, next) => {
  const err = new RouteError(404, "fail", "undefined route");
  next(err, req, res, next);
});

app.use(globalErrHandler);

module.exports = app;
