///<reference path="../../controllers/app.js" />

app.service("superadminService", function ($http) {
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
      .get("http://localhost:3000/usertype", config)
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  //getting brand details
  this.getBrands = function (cb) {
    return $http
      .get("http://localhost:3000/getbrands", config)
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  //add brand
  this.addBrand = function (formData, cb) {
    console.log("received form data");
    console.log(formData);

    // $http
    //   .post("http://localhost:3000/addbrand", formData, {
    //     "Content-Type": "multipart/form-data; boundary=webki",
    //     Authorization: `Bearer ${token}`,
    //   })
    //   .then(
    //     function (response) {
    //       // handle server response
    //       cb(response, null);
    //     },
    //     function (error) {
    //       // handle error
    //       cb(null, error);
    //     }
    //   );

    $http({
      method: "POST",
      url: "http://localhost:3000/addbrand",
      headers: {
        "Content-Type": undefined,
        Authorization: `Bearer ${token}`,
      },
      data: formData,
    }).then(
      function (response) {
        // handle server response
        cb(response, null);
      },
      function (error) {
        // handle error
        cb(null, error);
      }
    );
  };

  //add brand admin
  this.addBrandAdmin = function (data, cb) {
    $http
      .post("http://localhost:3000/addbrandadmin", data, config)
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  //update brand admin
  this.updateBrandAdmin = function (updatedBrandData, cb) {
    $http
      .put("http://localhost:3000/updatebrand", updatedBrandData, config)
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };
});
