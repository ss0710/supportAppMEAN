///<reference path="../../controllers/app.js" />

app.service("brandService", function ($http) {
  var token = localStorage.getItem("token");

  //to get user type
  this.getUserType = function (cb) {
    console.log("get user type running");
    $http
      .get("http://localhost:3000/usertype")
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
      .get(`http://localhost:3000/getcomments/${ticketId}`)
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
      .get("http://localhost:3000/getbrandbyid/" + brandName)
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
      .get("http://localhost:3000/getmanager")
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
      .post("http://localhost:3000/addmanager", data)
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
          pageSize
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
          pageSize
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
          searchAgentName
      )
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  this.filterTicketFunction = function (
    brandName,
    selectedStatus,
    managerName,
    agentName,
    pageNumber,
    pageSize,
    cb
  ) {
    $http
      .get(
        "http://localhost:3000/filtertickets?brandName=" +
          brandName +
          "&status=" +
          selectedStatus +
          "&managername=" +
          managerName +
          "&agentname=" +
          agentName +
          "&pageNumber=" +
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

  this.getLogsByTIckets = function (ticketId, cb) {
    $http
      .get("http://localhost:3000/getlogsbyticket/" + ticketId)
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  this.disableAgents = function (agentId, cb) {
    $http
      .put("http://localhost:3000/disableagent/" + agentId, {})
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  this.enableAgents = function (agentId, cb) {
    $http
      .put("http://localhost:3000/disableagent/" + agentId, {})
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  this.deleteAgents = function (agentId, cb) {
    $http
      .put("http://localhost:3000/disableagent/" + agentId, {})
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
          managerName
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
    user,
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
    formData.append("email", user.email);
    formData.append("userName", user.userName);
    formData.append("firstName", user.firstName);
    formData.append("lastName", user.lastName);
    formData.append("phoneNumber", user.phoneNumber);
    formData.append("password", user.password);
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
        if (error.data.keyPattern) {
          if (error.data.keyPattern.email) {
            cb(null, "Email already exists");
          }
          if (error.data.keyPattern.userName) {
            cb(null, "User name already exists");
          }
        } else {
          cb(null, "Something went Wrong");
        }
      }
    );
  };

  this.disableManagers = function (managerId, cb) {
    $http
      .put("http://localhost:3000/disablemanager/" + managerId, {})
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  this.permitManagers = function (managerId, cb) {
    $http
      .put("http://localhost:3000/permitmanager/" + managerId, {})
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  this.deleteManagers = function (managerId, cb) {
    $http
      .put("http://localhost:3000/deletemanager/" + managerId, {})
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  this.getActivityNotification = function (brandId, cb) {
    $http
      .get("http://localhost:3000/getnotifications/" + brandId)
      .then(function (result) {
        cb(result, null);
      })
      .then(function (error) {
        cb(null, error);
      });
  };
});
