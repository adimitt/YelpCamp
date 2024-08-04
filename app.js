if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utilis/ExpressError");
const methodOverride = require("method-override");
const User = require("./models/user.js");
const campRouter = require("./routes/campgrounds");
const reviewRouter = require("./routes/reviews");
const userRouter = require("./routes/users");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const MongoStore = require("connect-mongo");

const dbUrl =
  process.env.DB_URL ||
  "mongodb://127.0.0.1:27017/yelp-camp";
mongoose.connect(dbUrl);
const db = mongoose.connection;
db.on(
  "error",
  console.error.bind(console, "connection error")
);
db.once("open", () => {
  console.log("Database Connected");
});

const app = express();
const secret =
  process.env.SECRET || "thisshouldbeabettersecret!";

const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60,
  crypto: {
    secret: secret,
  },
});

const sessionConfig = {
  store,
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.engine("ejs", ejsMate);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(
  mongoSanitize({
    replaceWith: "_",
  })
);
app.use(helmet({ contentSecurityPolicy: false }));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

app.use("/", userRouter);
app.use("/campgrounds/:id/reviews", reviewRouter);
app.use("/campgrounds", campRouter);

app.get("/", (req, res) => {
  res.render("home");
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something Wrong!";
  res.render("error", { err });
});

const port = process.env.PORT || 3000;
app.listen("3000", () => {
  console.log(`Serving on port ${port}`);
});
