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

var PORT = process.env.PORT || 3000;
var app = express();
// const http = require("http").Server(app);
// const io = require("socket.io")(http);

//database connection
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

// app.get("/", function (req, res) {
//   res.send("hello world");
// });
//routes
app.use(Routes);

// io.on("connection", (socket) => {
//   console.log("a user connected");

//   socket.on("disconnect", () => {
//     console.log("user disconnected");
//   });

//   socket.on("chat message", (msg) => {
//     console.log("message: " + msg);
//     io.emit("chat message", msg);
//   });
// });

var server = app.listen(PORT, function () {
  console.log(`Server is reunning on PORT ${PORT}`);
});

var io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", function (socket) {
  console.log("connection made");
  console.log(socket.id);
});
