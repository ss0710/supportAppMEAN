///<reference path="../services/socket/socket.service.js" />
var app = angular.module("myApp", ["ui.router"]);

app.controller("index", function ($scope) {
  console.log("app controller called");
});

app.factory("MyInterceptor", function () {
  return {
    request: function (config) {
      config.headers = config.headers || {};
      var token = localStorage.getItem("token");
      config.headers["Authorization"] = "Bearer " + token;
      config.headers["Accept"] = "application/json;odata=verbose";
      return config;
    },
  };
});

app.config([
  "$stateProvider",
  "$urlRouterProvider",
  "$httpProvider",
  function ($stateProvider, $urlRouterProvider, httpProvider) {
    httpProvider.interceptors.push("MyInterceptor");
    $urlRouterProvider.when("/admin", "/admin/superadminbrands");
    $urlRouterProvider.when("/brandadmin", "/brandadmin/managers");
    $urlRouterProvider.when("/brandmanager", "/brandmanager/manageragents");
    $urlRouterProvider.when("/brandagent", "/brandagent/agenttickets");

    $stateProvider
      .state("login", {
        url: "/login",
        templateUrl: "./views/auth/login.html",
      })
      .state("admin", {
        url: "/admin",
        templateUrl: "./views/superadmin/superadmin.html",
      })
      .state("admin.superadminbrands", {
        url: "/superadminbrands",
        templateUrl: "./views/superadmin/brands.html",
      })
      .state("admin.superadminstats", {
        url: "/superadminstats",
        templateUrl: "./views/superadmin/stats.html",
      })
      .state("admin.inactivebrands", {
        url: "/inactivebrands",
        templateUrl: "./views/superadmin/inActiveBrands.html",
      })
      .state("brandmanager", {
        url: "/brandmanager",
        templateUrl: "./views/managers/brandManager.html",
      })
      .state("brandmanager.manageragents", {
        url: "/manageragents",
        templateUrl: "./views/managers/agents.html",
      })
      .state("brandmanager.managertickets", {
        url: "/managertickets",
        templateUrl: "./views/managers/tickets.html",
      })
      .state("brandmanager.ticketrequests", {
        url: "/ticketrequests",
        templateUrl: "./views/managers/ticketrequests.html",
      })
      .state("brandmanager.closedtickets", {
        url: "/closedtickets",
        templateUrl: "./views/managers/closedtickets.html",
      })
      .state("brandadmin", {
        url: "/brandadmin",
        templateUrl: "./views/brand/brandAdmin.html",
      })
      .state("brandadmin.activity", {
        url: "/activity",
        templateUrl: "./views/brand/activity.html",
      })
      .state("brandadmin.managers", {
        url: "/managers",
        templateUrl: "./views/brand/managers.html",
      })
      .state("brandadmin.agents", {
        url: "/agents",
        templateUrl: "./views/brand/agents.html",
      })
      .state("brandadmin.brandTickets", {
        url: "/brandTickets",
        templateUrl: "./views/brand/brandTickets.html",
      })
      .state("brandadmin.stats", {
        url: "/stats",
        templateUrl: "./views/brand/stats.html",
      })
      .state("brandadmin.brandSettings", {
        url: "/brandSettings",
        templateUrl: "./views/brand/brandSettings.html",
      })
      .state("brandagent", {
        //agents
        url: "/brandagent",
        templateUrl: "./views/agents/brandAgent.html",
      })
      .state("brandagent.agenttickets", {
        url: "/agenttickets",
        templateUrl: "./views/agents/agentTickets.html",
      })
      .state("brandagent.rejectedtickets", {
        url: "/rejectedtickets",
        templateUrl: "./views/agents/rejectedTickets.html",
      })
      .state("brandagent.closedtickets", {
        url: "/closedtickets",
        templateUrl: "./views/agents/closedTickets.html",
      })
      .state("noaccess", {
        //no access
        url: "/noaccess",
        templateUrl: "./views/unAuthorisedAccess.html",
      });

    $urlRouterProvider.otherwise("/login");
  },
]);
