///<reference path="../../controllers/app.js" />

app.service("statsService", function ($http) {
  var token = localStorage.getItem("token");
  var config = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json;odata=verbose",
    },
  };

  //getting user type
  this.getUserType = function (cb) {
    $http
      .get("http://localhost:3000/usertype")
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  //getting manager and agent count
  this.getManagerAndAgentCount = function (brandId, cb) {
    $http
      .get("http://localhost:3000/countManagerAgent/" + brandId)
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, result);
      });
  };

  //getting managers details
  this.getManagerStats = function (brandId, cb) {
    $http
      .get("http://localhost:3000/managerstats/" + brandId)
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  //search user
  this.searchUsers = function (brandName, userName, cb) {
    $http
      .get(
        "http://localhost:3000/searchuser?brandName=" +
          brandName +
          "&userName=" +
          userName
      )
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  this.getTicketActivity = function (brandName, cb) {
    $http
      .get("http://localhost:3000/ticketactivity/" + brandName)
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  this.getTicketStats = function (brandName, cb) {
    $http
      .get("http://localhost:3000/ticketstats/" + brandName)
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  this.getUserActivityStats = function (brandName, agentName, cb) {
    $http
      .get(
        "http://localhost:3000/useractivity?brandName=" +
          brandName +
          "&userName=" +
          agentName
      )
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  this.getProfileStats = function (brandName, userName, cb) {
    $http
      .get(
        "http://localhost:3000/userprofilestats?brandName=" +
          brandName +
          "&userName=" +
          userName
      )
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  this.getBrandStatsAdmin = function (cb) {
    $http
      .get("http://localhost:3000/brandstats")
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  this.searchBrandfromAdmin = function (searchName, cb) {
    $http
      .get("http://localhost:3000/searchbrand/" + searchName)
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  this.getBrandDashboard = function (brandName, cb) {
    $http
      .get("http://localhost:3000/branddashboard/" + brandName)
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  this.adminTicketActiviyStats = function (brandName, cb) {
    $http
      .get("http://localhost:3000/ticketactivity/" + brandName)
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };
});
