///<reference path="../../controllers/app.js" />

app.service("brandService", function ($http) {
  var token = localStorage.getItem("token");
  var config = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json;odata=verbose",
    },
  };

  //to get user type
  this.getUserType = function (cb) {
    console.log("get user type running");
    $http
      .get("http://localhost:3000/usertype", config)
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  //getting comments
  this.getComments = function (ticketId, cb) {
    $http
      .get(`http://localhost:3000/getcomments/${ticketId}`, config)
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  //get Brand Details
  this.getBrandDetails = function (brandName, cb) {
    $http
      .get("http://localhost:3000/getbrandbyid/" + brandName, config)
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  //to get managers
  this.getManager = function (cb) {
    $http
      .get("http://localhost:3000/getmanager", config)
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  //to add brand managers
  this.addManager = function (data, cb) {
    $http
      .post("http://localhost:3000/addmanager", data, config)
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  //to get brand agent
  this.getBrandAgents = function (brandName, pageNumber, pageSize, cb) {
    console.log("fetch Api called");
    $http
      .get(
        "http://localhost:3000/getagents?brandName=" +
          brandName +
          "&pageNumber=" +
          pageNumber +
          "&pageSize=" +
          pageSize,
        config
      )
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  this.getManagers = function (brandName, pageNumber, pageSize, cb) {
    $http
      .get(
        "http://localhost:3000/getmanager?brandName=" +
          brandName +
          "&pageNumber=" +
          pageNumber +
          "&pageSize=" +
          pageSize,
        config
      )
      .then(function (result) {
        console.log(result.data);
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  this.LastPageNum = function (totalCount, pageSize) {
    if (totalCount % pageSize == 0) {
      return totalCount / pageSize;
    } else {
      var r = totalCount / pageSize;
      return Math.ceil(r - 0.1);
    }
  };

  this.searchAgent = function (brandId, searchAgentName, cb) {
    $http
      .get(
        "http://localhost:3000/searchagent?brandId=" +
          brandId +
          "&name=" +
          searchAgentName,
        config
      )
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  this.disableAgents = function (agentId, cb) {
    $http
      .put("http://localhost:3000/disableagent/" + agentId, {}, config)
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  this.enableAgents = function (agentId, cb) {
    $http
      .put("http://localhost:3000/disableagent/" + agentId, {}, config)
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  this.deleteAgents = function (agentId, cb) {
    $http
      .put("http://localhost:3000/disableagent/" + agentId, {}, config)
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  this.searchManager = function (brandId, managerName, cb) {
    $http
      .get(
        "http://localhost:3000/searchmanager?brandId=" +
          brandId +
          "&name=" +
          managerName,
        config
      )
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  this.LastPageNumber = function (totalCount, pageSize) {
    if (totalCount % pageSize == 0) {
      return totalCount / pageSize;
    } else {
      var r = totalCount / pageSize;
      return Math.ceil(r - 0.1);
    }
  };

  this.addBrandManagers = function (
    image,
    managerEmail,
    managerName,
    firstName,
    lastName,
    phoneNumber,
    password,
    brandId,
    brandEmail,
    brandName,
    brandCategory,
    brandPhoneNumber,
    brandAddress,
    cb
  ) {
    var formData = new FormData();
    formData.append("image", image);
    formData.append("email", managerEmail);
    formData.append("userName", managerName);
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("phoneNumber", phoneNumber);
    formData.append("password", password);
    formData.append("brandId", brandId);
    formData.append("brandEmail", brandEmail);
    formData.append("brandName", brandName);
    formData.append("brandCategory", brandCategory);
    formData.append("brandPhoneNumber", brandPhoneNumber);
    formData.append("brandAddress", brandAddress);

    $http({
      method: "POST",
      url: "http://localhost:3000/addmanager",
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
        cb(null, error);
      }
    );
  };

  this.disableManagers = function (managerId, cb) {
    $http
      .put("http://localhost:3000/disablemanager/" + managerId, {}, config)
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  this.permitManagers = function (managerId, cb) {
    $http
      .put("http://localhost:3000/permitmanager/" + managerId, {}, config)
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  this.deleteManagers = function (managerId, cb) {
    $http
      .put("http://localhost:3000/deletemanager/" + managerId, {}, config)
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };
});
