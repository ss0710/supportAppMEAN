var express = require("express");
var router = express.Router();
var passport = require("passport");

//controllers
var loginController = require("./auth/login.controller");
var brandController = require("./api/brands/brand.controller");
var userController = require("./api/users/user.controller");
var managerController = require("./api/managers/manager.controller");
var agentController = require("./api/agents/agent.controller");
var ticketController = require("./api/tickets/ticket.controller");
var commentController = require("./api/comments/comment.controller");

//auth routes
router.post("/login", passport.authenticate("local"), loginController);

//user routes
router.post("/addbrandadmin", brandController.addBrandAdmin);
//api for user-type
router.get("/usertype", userController.getUserType);

//brand routes
router.get("/getbrands", brandController.getBrand);
router.post("/addbrand", brandController.addBrand);
router.put("/updatebrand", brandController.updateBrand);
router.put("/deletebrand/:id", brandController.deleteBrand);

//Brand Managers Routes
router.get("/getmanager", managerController.getBrandManager);
router.post("/addmanager", managerController.addBrandManager);
router.put("/disablemanager/:id", managerController.disableBrandManager);
router.put("/permitmanager/:id", managerController.permitBrandManager);

//Brand agents routes
router.post("/addagents", agentController.addBrandAgent);
router.get("/getagents", agentController.getBrandAgents);

//tickets routes
router.post("/addticket", ticketController.addTicket);
router.get("/gettickets/:id", ticketController.getTickets);

//Customers routes
router.post("/addcomment", commentController.addComment);
router.get("/getcomments/:id", commentController.getComments);

//comments routes

module.exports = router;
