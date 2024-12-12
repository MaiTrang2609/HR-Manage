const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const cookieParser = require("cookie-parser");

const corsOptions = require("./src/config/corsOptions");
const credentials = require("./src/middleware/credentials");

const globalErrorHandler = require("./src/middleware/errorHandle");

const AppError = require("./src/utils/appError");

const annualLeaveRoute = require("./src/routes/annualLeaveRoute");
const cvRoute = require("./src/routes/cvRoute");
const divisionRoute = require("./src/routes/divisionRoute");
const jobRoute = require("./src/routes/jobRoute");
const payCheckRoute = require("./src/routes/payCheckRoute");
const timeOffRoute = require("./src/routes/timeOffRoute");
const userRoute = require("./src/routes/userRoute");
const positionRoute = require("./src/routes/positionRoute");
const emailRoute = require("./src/routes/emailRoute");

const eventRoute = require("./src/routes/eventRoute");
const roomRoute = require("./src/routes/roomRoute");

const app = express();

app.use(credentials);
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(cookieParser());

app.use(morgan("common"));

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour.",
});
app.use("/api", limiter);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

app.use(mongoSanitize());

app.use(xss());

app.use((req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  req.page = (page - 1) * limit;
  req.limit = limit;
  delete req.query.limit;
  delete req.query.page;
  next();
});

app.use("/api/annual-leave", annualLeaveRoute);
app.use("/api/cv", cvRoute);
app.use("/api/division", divisionRoute);
app.use("/api/job", jobRoute);
app.use("/api/pay-check", payCheckRoute);
app.use("/api/time-off", timeOffRoute);
app.use("/api/user", userRoute);
app.use("/api/position", positionRoute);
app.use("/api/email", emailRoute);

app.use("/api/event", eventRoute);
app.use("/api/room", roomRoute);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
