///<reference path="../../controllers/app.js" />

app.service("superadminService", function ($http) {
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

  //getting brand details
  this.getActiveBrands = function (pageNumber, pageSize, cb) {
    return $http
      .get(
        "http://localhost:3000/getactivebrands?pageNumber=" +
          pageNumber +
          "&pageSize=" +
          pageSize
      )
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  //getting brand details
  this.getInActiveBrands = function (pageNumber, pageSize, cb) {
    return $http
      .get(
        "http://localhost:3000/getinactivebrands?pageNumber=" +
          pageNumber +
          "&pageSize=" +
          pageSize
      )
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  //add brand
  var token = localStorage.getItem("token");
  this.addBrand = function (image, brand, cb) {
    var formData = new FormData();
    formData.append("image", image);
    formData.append("email", brand.email);
    formData.append("name", brand.name);
    formData.append("category", brand.category);
    formData.append("phoneNumber", brand.phoneNumber);
    formData.append("address", brand.address);

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
        console.log("handling response");
        // handle server response
        cb(response, null);
      },
      function (error) {
        // handle error
        if (error.status == 409) {
          var error_msg = error.data.value + " already exist";
          cb(null, error_msg);
        } else {
          cb(null, error.data);
        }
      }
    );
  };

  //add brand admin
  this.addBrandAdmin = function (admin, brandDetails, cb) {
    var data = {
      email: admin.email,
      userName: admin.name,
      firstName: admin.firstName,
      lastName: admin.lastName,
      phoneNumber: admin.phoneNumber1,
      password: admin.password,
      brandId: brandDetails.brandId,
      brandEmail: brandDetails.email,
      brandName: brandDetails.name,
      brandCategory: brandDetails.category,
      brandPhoneNumber: brandDetails.phoneNumber,
      brandAddress: brandDetails.address,
    };
    $http
      .post("http://localhost:3000/addbrandadmin", data)
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        if (error.data.keyPattern) {
          if (error.data.keyPattern.email) {
            cb(null, "email already exists");
          } else if (error.data.keyPattern.userName) {
            cb(null, "user name already exist");
          }
        } else {
          cb(null, "something went wrong!!");
        }
      });
  };

  //update brand admin
  this.updateBrandAdmin = function (brandDetails, cb) {
    var updatedBrandData = {
      brandId: brandDetails.brandId,
      email: brandDetails.email,
      name: brandDetails.name,
      category: brandDetails.category,
      address: brandDetails.address,
      isAdminCreated: true,
      isFirstLogin: false,
      isDisabled: false,
      isDeleted: false,
    };
    $http
      .put("http://localhost:3000/updatebrand", updatedBrandData)
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  //deleteBrand
  this.deleteBrand = function (brandId, cb) {
    $http
      .put("http://localhost:3000/deletebrand/" + brandId, {})
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  //Disable Brand
  this.disableBrand = function (brandId, cb) {
    $http
      .put("http://localhost:3000/disablebrand/" + brandId, {})
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  //Enable Brand
  this.enableBrand = function (brandId, cb) {
    $http
      .put("http://localhost:3000/enablebrand/" + brandId, {})
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };
  this.LastPageNumber = function (totalCount, pageSize, cb) {
    if (totalCount % pageSize == 0) {
      cb(totalCount / pageSize);
    } else {
      var r = totalCount / pageSize;
      cb(Math.ceil(r - 0.1));
    }
  };
});
