///<reference path="../../controllers/app.js" />

app.service("customerService", function ($http) {
  //to get user type
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

  //to add customers
  this.addCustomers = function (userData, cb) {
    $http
      .post("http://localhost:3000/addcustomer", userData)
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        if (error.status == 409) {
          if (error.data.keyPattern.email) {
            cb(null, "Email already exists!!");
          } else if (error.data.keyPattern.userName) {
            cb(null, "User name already exists!!");
          }
        } else {
          cb(null, "Something went wrong!! Try again after sometime!!");
        }
      });
  };

  this.addQueryService = function (data, cb) {
    $http
      .post("http://localhost:3000/raisequery", data)
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  this.getRequestedQueries = function (customerName, cb) {
    $http
      .get("http://localhost:3000/getrequestedqueries/" + customerName)
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  //get solved quries
  this.getCustomerSolvedQueries = function (brandName, cb) {
    $http
      .get(`http://localhost:3000/solvedqueries/${brandName}`)
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };
});
