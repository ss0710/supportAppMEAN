var app = angular.module("myApp", ["ui.router"]);

app.config([
  "$stateProvider",
  "$urlRouterProvider",
  function ($stateProvider, $urlRouterProvider) {
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
      .state("admin.superadminsettings", {
        url: "/superadminsettings",
        templateUrl: "./views/superadmin/settings.html",
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
      .state("brandmanager.managercustomers", {
        url: "/managercustomers",
        templateUrl: "./views/managers/customers.html",
      })
      .state("brandmanager.managersettings", {
        url: "/managersettings",
        templateUrl: "./views/managers/settings.html",
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
      .state("brandadmin.customers", {
        url: "/customers",
        templateUrl: "./views/brand/customers.html",
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
      .state("brandagent.agentcustomers", {
        url: "/agentcustomers",
        templateUrl: "./views/agents/agentCustomers.html",
      })
      .state("brandagent.agentsettings", {
        url: "/agentsettings",
        templateUrl: "./views/agents/agentSettings.html",
      })
      .state("noaccess", {
        //no access
        url: "/noaccess",
        templateUrl: "./views/unAuthorisedAccess.html",
      });

    $urlRouterProvider.otherwise("/login");
  },
]);

app.controller("index", function () {});
