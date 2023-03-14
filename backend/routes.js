require("dotenv").config();
var express = require("express");
var router = express.Router();
var passport = require("passport");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
var Brand = require("./api/brands/brand.model");
var User = require("./api/users/user.model");

var fs = require("fs");
var S3 = require("aws-sdk/clients/s3");

var bucketName = process.env.AWS_BUCKET_NAME;
var region = process.env.AWS_BUCKET_REGION;
var accessKeyId = process.env.AWS_ACCESS_KEY;
var secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

//controllers
var loginController = require("./auth/login.controller");
var brandController = require("./api/brands/brand.controller");
var userController = require("./api/users/user.controller");
var managerController = require("./api/managers/manager.controller");
var agentController = require("./api/agents/agent.controller");
var ticketController = require("./api/tickets/ticket.controller");
var commentController = require("./api/comments/comment.controller");
var notificationController = require("./api/notifications/notification.controller");
var logController = require("./api/logs/logs.controller");
var statsController = require("./api/stats/stats.controller");

//auth routes
router.post("/login", passport.authenticate("local"), loginController);

//user routes
router.post("/addbrandadmin", brandController.addBrandAdmin);
//api for user-type
router.get("/usertype", userController.getUserType);

//brand routes
router.get("/getbrands", brandController.getBrand);
router.get("/getbrandbyid/:id", brandController.getBrandById);
router.put("/updatebrand", brandController.updateBrand);
router.put("/disablebrand/:id", brandController.disableBrand);
router.put("/enablebrand/:id", brandController.enableBrand);
router.put("/deletebrand/:id", brandController.deleteBrand);

var s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

function uploadFile(file, cb) {
  console.log("upload File called");
  var fileStream = fs.createReadStream(file.path);

  var uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename,
  };

  s3.upload(uploadParams)
    .promise()
    .then(function (result) {
      console.log("success upload");
      cb(result, null);
    })
    .catch(function (error) {
      console.log(error);
      console.log("unsuccess upload");
      cb(null, error);
    });
}

router.post("/addbrand", upload.single("image"), function (req, res) {
  console.log("add brand route called");
  console.log(req.file);
  console.log(req.body);
  uploadFile(req.file, function (result, error) {
    if (result) {
      var brandId = "brand" + Date.now();
      var brandData = {
        brandId: brandId,
        email: req.body.email,
        name: req.body.name,
        brandLogo: result.Location,
        brandLogoKey: result.key,
        category: req.body.category,
        phoneNumber: req.body.phoneNumber,
        address: req.body.address,
      };
      var brand = new Brand(brandData);
      brand
        .save()
        .then(function (result) {
          console.log("saving data");
          res.status(200).json(result);
        })
        .catch(function (error) {
          console.log("not able to save data");
          res.status(403).json(error);
        });
    } else {
      res.status(400).json(error);
    }
  });
});

//Brand Managers Routes
router.get("/getmanager/:id", managerController.getBrandManager);
router.put("/disablemanager/:id", managerController.disableBrandManager);
router.put("/permitmanager/:id", managerController.permitBrandManager);

router.post("/addmanager", upload.single("image"), function (req, res) {
  console.log("add manager route called");
  console.log(req.file);
  console.log(req.body);
  uploadFile(req.file, function (result, error) {
    if (result) {
      var userData = {
        role: "manager",
        email: req.body.email,
        userName: req.body.userName,
        password: req.body.password,
        profileImage: result.Location,
        profileImageKey: result.key,
        brand: {
          brandId: req.body.brandId,
          email: req.body.brandEmail,
          name: req.body.brandName,
          category: req.body.brandCategory,
          phoneNumber: req.body.brandPhoneNumber,
          address: req.body.brandAddress,
        },
        isOnline: req.body.isOnline,
        isDisabled: req.body.isDisabled,
        isDeleted: req.body.isDeleted,
      };
      var user = new User(userData);
      user
        .save()
        .then(function (result) {
          console.log("succesffully saved to database");
          res.status(200).json(result);
        })
        .catch(function (error) {
          console.log("not able to saved to database");
          console.log(error);
          res.status(403).json(error);
        });
    } else {
      res.status(400).json(error);
    }
  });
});

//Brand agents routes
router.get("/getagents/:id", agentController.getBrandAgents);
router.put("/disableagent/:id", agentController.disableAgent);
router.put("/enableagent/:id", agentController.enableAgents);
router.put("/deleteagent/:id", agentController.deleteAgents);
router.post("/addagents", upload.single("image"), function (req, res) {
  console.log("add agent route called");
  console.log(req.file);
  console.log(req.body);
  uploadFile(req.file, function (result, error) {
    if (result) {
      var userData = {
        role: "agent",
        email: req.body.email,
        userName: req.body.userName,
        password: req.body.password,
        brandId: req.body.brandId,
        profileImage: result.Location,
        profileImageKey: result.key,
        brand: {
          brandId: req.body.brandId,
          email: req.body.brandEmail,
          name: req.body.brandName,
          category: req.body.brandCategory,
          phoneNumber: req.body.brandPhoneNumber,
          address: req.body.brandAddress,
        },
        isOnline: req.body.isOnline,
        isDisabled: false,
        isDeleted: false,
      };
      var user = new User(userData);
      user
        .save()
        .then(function (result) {
          console.log("succesffully saved to database");
          res.status(200).json(result);
        })
        .catch(function (error) {
          console.log("not able to saved to database");
          console.log(error);
          res.status(403).json(error);
        });
    } else {
      res.status(403).json(error);
    }
  });
});

//tickets routes
router.post("/addticket", ticketController.addTicket);
router.get("/getticketsbybrand/:id", ticketController.getTicketsByBrandId);
router.get("/getticketsbyagent/:id", ticketController.getTicketsByAgentId);
router.put("/updateticket/:id", ticketController.updateTicket);
router.put("/acceptTicket/:id", ticketController.acceptTicket);
router.put("/inprocessticket/:id", ticketController.inProcessTicket);
router.put("/resolveTicket/:id", ticketController.resolveTicket);
router.put("/closeticket/:id", ticketController.closeTicket);

//comments routes
router.post("/addcomment", commentController.addComment);
router.get("/getcomments/:id", commentController.getComments);

//notification routes
router.post("/addnotification", notificationController.addNotification);
router.get(
  "/getnotifications/:id",
  notificationController.getNotificationByBrandId
);
router.put(
  "/assignnotification/:id",
  notificationController.assignNotification
);
router.get(
  "/agentnotification/:id",
  notificationController.getAgentNotification
);
router.get(
  "/managernotification/:id",
  notificationController.getManagerNotification
);

//log history routes
router.post("/addlog", logController.addLogHistory);
router.get("/getlogsbyticket/:id", logController.getLogsByTicketId);

//stats routes
router.get("/countManagerAgent/:id", userController.countMangerandAgent);
router.get("/managerstats/:id", statsController.getManagerStats);
router.get("/ticketactivity/:id", statsController.getTicketActivityDetails);

module.exports = router;
