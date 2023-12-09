const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
require("dotenv").config();
const db = require("./config/mongoose");
const PORT = process.env.PORT;
const app = express();
const passport = require("passport");

app.use(express.json());
const MongoStore = require("connect-mongo");

// console.log(process.env.FRONT_END_URL);

app.use(
  cors({
    credentials: true,
    origin: process.env.FRONT_END_URL,
  })
);

app.use(
  session({
    name: "formify",
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    // saveUninitialized: false,
    // resave: false,
    resave: true,
    cookie: {
      // sameSite: "none", //allow cross-site requests from different origin
      // secure: true,
      maxAge: 1000 * 60 * 100 * 600,
    },
    store: MongoStore.create(
      {
        mongoUrl: process.env.MONGODB_URI,
        autoRemove: "disabled",
      },
      function (err) {
        console.log(err || "connect-mongoDB setup");
      }
    ),
  })
);

const passportGoogle = require("./config/passport");

app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use("/uploads", express.static(__dirname + "/uploads"));

// using express Routes
app.use("/api", require("./routes"));

app.listen(PORT, () => {
  console.log("Server started!");
});
