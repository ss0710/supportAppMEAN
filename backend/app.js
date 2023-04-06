require("dotenv").config();
var express = require("express");
var session = require("express-session");
var cors = require("cors");
var connect = require("./database/db");
var Routes = require("./routes");
var passportAuth = require("./api/passport/passport.controller");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var bodyParser = require("body-parser");
var SocketFile = require("./services/socket/socket");

var PORT = process.env.PORT || 3000;
var app = express();
connect();
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);

app.use(express.json());
app.use(cors());

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(new LocalStrategy(passportAuth.passportAuth));

var server = app.listen(PORT, function () {
  console.log(`Server is reunning on PORT ${PORT}`);
});

app.use(Routes);

SocketFile.socketConnection(server);
