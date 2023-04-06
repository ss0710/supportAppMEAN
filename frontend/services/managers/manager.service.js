///<reference path="../../controllers/app.js" />

app.service("managerService", function ($http) {
  var token = localStorage.getItem("token");

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

  //get brand by Id
  this.getBrandById = function (brandName, cb) {
    $http
      .get("http://localhost:3000/getbrandbyid/" + brandName)
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  //get manager notification
  this.getManagerNotification = function (managerName, cb) {
    $http
      .get("http://localhost:3000/managernotification/" + managerName)
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  //mark one notifiaction seen
  this.markOneNotifSeen = function (notId, cb) {
    $http
      .put("http://localhost:3000/marknotseen/" + notId, {})
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  //mark all notification seen
  this.markAllNotificationSeen = function (cb) {
    $http
      .put("http://localhost:3000/markallmanagernotseen", {})
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  //to get agents
  this.getAgents = function (brandName, pageNumber, pageSize, cb) {
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

  //to add agents
  this.addAgents = function (data, cb) {
    $http
      .post("http://localhost:3000/addagents", data)
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  //to get tickets
  //this api is dynamic i.e. we can filter is dynamically by passing two ids
  this.getTickets = function (brandId, cb) {
    $http
      .get("http://localhost:3000/getticketsbybrand/" + brandId)
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

  //add comments
  this.addComments = function (ticketId, comment, brandManagerDetails, cb) {
    var commentData = {
      ticketId: ticketId,
      content: comment,
      sentByUserEmail: brandManagerDetails.email,
      sentByUserName: brandManagerDetails.userName,
      sentByUserType: "manager",
      brandEmail: brandManagerDetails.brand.email,
      brandName: brandManagerDetails.brand.name,
      brandCategory: brandManagerDetails.brand.category,
      isDeleted: "false",
    };
    $http
      .post("http://localhost:3000/addcomment", commentData)
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  //to add ticket
  this.addTickets = function (subject, query, brandManagerDetails, cb) {
    var ticketData = {
      brandName: brandManagerDetails.brand.name,
      brandEmail: brandManagerDetails.brand.email,
      subject: subject,
      query: query,
      createdByUserName: brandManagerDetails.userName,
      createdByUserEmail: brandManagerDetails.email,
      userType: "manager",
    };
    $http
      .post("http://localhost:3000/addticket", ticketData)
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  //to get logs
  this.getLogs = function (ticketId, cb) {
    $http
      .get("http://localhost:3000/getlogsbyticket/" + ticketId)
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  this.getFiles = function (ticketId, cb) {
    $http
      .get("http://localhost:3000/getticketfiles/" + ticketId)
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  //to load agent for modal
  this.loadAgentforModal = function (brandId, cb) {
    $http
      .get(`http://localhost:3000/getagents/${brandId}`)
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  //to assign tickets
  this.assignTicketToAgentService = function (
    ticketId,
    agentName,
    agentEmail,
    brandManagerDetails,
    cb
  ) {
    var agentData = {
      agentName: agentName,
      agentEmail: agentEmail,
      brandName: brandManagerDetails.brand.name,
      brandEmail: brandManagerDetails.brand.email,
      ticketId: ticketId,
      brandManagerName: brandManagerDetails.userName,
      brandManagerId: brandManagerDetails._id,
      agentName: agentName,
      userType: "manager",
    };
    $http
      .put(`http://localhost:3000/updateticket/${ticketId}`, agentData)
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  //inprocess ticket
  this.inProcessTicketFunction = function (ticketId, cb) {
    $http
      .put("http://localhost:3000/inprocessticket/" + ticketId, {})
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  //resolve ticket
  this.resolveTicketFunction = function (ticketId, userName, email, cb) {
    $http
      .put(
        "http://localhost:3000/resolveTicket?ticketId=" +
          ticketId +
          "&name=" +
          userName +
          "&email=" +
          email,
        {}
      )
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  //closed ticket
  this.closeTicketFunction = function (ticketId, cb) {
    $http
      .put("http://localhost:3000/closeticket/" + ticketId, {})
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  //to assign tickets
  this.getTicketsByBrandIdAndManagerId = function (
    brandName,
    managerName,
    pageNumber,
    pageSize,
    status,
    cb
  ) {
    $http
      .get(
        `http://localhost:3000/getticketbybrandandmanager?brandName=` +
          brandName +
          "&managerName=" +
          managerName +
          "&status=" +
          status +
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

  //to add file
  this.addFilesToTicket = function (image, ticketId, managerDetails, cb) {
    var formData = new FormData();
    formData.append("image", image);
    formData.append("ticketId", ticketId);
    formData.append("brandName", managerDetails.brand.name);
    formData.append("userName", managerDetails.userName);
    formData.append("type", "manager");

    $http({
      method: "POST",
      url: "http://localhost:3000/addfile",
      headers: {
        "Content-Type": undefined,
        Authorization: `Bearer ${token}`,
      },
      data: formData,
    }).then(
      function (response) {
        cb(response, null);
      },
      function (error) {
        cb(null, error);
      }
    );
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

  this.updateAgentNameService = function (brandId, agentId, updatedName, cb) {
    $http
      .put(
        "http://localhost:3000/updateagentname?brandId=" +
          brandId +
          "&userId=" +
          agentId,
        { userName: updatedName }
      )
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  this.disableBrandAgents = function (agentId, cb) {
    $http
      .put("http://localhost:3000/disableagent/" + agentId, {})
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  this.enableBrandAgent = function (agentId, cb) {
    $http
      .put("http://localhost:3000/enableagent/" + agentId, {})
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  this.deleteAgent = function (agentId, cb) {
    $http
      .put("http://localhost:3000/deleteagent/" + agentId, {})
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  this.addBrandAgents = function (agent, image, brand, cb) {
    var formData = new FormData();
    formData.append("image", image);
    formData.append("email", agent.email);
    formData.append("userName", agent.userName);
    formData.append("firstName", agent.firstName);
    formData.append("lastName", agent.lastName);
    formData.append("phoneNumber", agent.phoneNumber);
    formData.append("password", agent.password);
    formData.append("brandId", brand.brand.brandId);
    formData.append("brandEmail", brand.brand.email);
    formData.append("brandName", brand.brand.name);
    formData.append("brandCategory", brand.brand.category);
    formData.append("brandPhoneNumber", brand.brand.phoneNumber);
    formData.append("brandAddress", brand.brand.address);
    $http({
      method: "POST",
      url: "http://localhost:3000/addagents",
      headers: {
        "Content-Type": undefined,
        Authorization: `Bearer ${token}`,
      },
      data: formData,
    }).then(
      function (response) {
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
});
