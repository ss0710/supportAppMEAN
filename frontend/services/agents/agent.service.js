///<reference path="../../controllers/app.js" />

app.service("agentService", function ($http) {
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

  //get Brand by Name
  this.getBrandByName = function (brandName, cb) {
    $http
      .get("http://localhost:3000/getbrandbyid/" + brandName, config)
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  //get Agent notification
  this.getAgentNotification = function (brandAgentName, cb) {
    $http
      .get("http://localhost:3000/agentnotification/" + brandAgentName, config)
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  //mark one notification as seen
  this.markNotificationSeen = function (notId, cb) {
    $http
      .put("http://localhost:3000/marknotseen/" + notId, {}, config)
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  //mark all notifiaction as seen
  this.markAllNotificationSeen = function () {
    $http
      .put("http://localhost:3000/markallagentnotseen", {}, config)
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  //getting comments by ticketId
  this.getCommentsByTicketId = function (ticketId, cb) {
    $http
      .get(`http://localhost:3000/getcomments/${ticketId}`, config)
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(error, null);
      });
  };

  //getting ticket logs
  this.getTicketLogs = function (ticketId, cb) {
    $http
      .get("http://localhost:3000/getlogsbyticket/" + ticketId, config)
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  //getting ticket files
  this.getTicketFiles = function (ticketId, cb) {
    $http
      .get("http://localhost:3000/getticketfiles/" + ticketId, config)
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  //adding comments
  this.addComments = function (
    ticketId,
    comment,
    brandAgentEmail,
    brandAgentName,
    type,
    brandEmail,
    brandName,
    brandCategory,
    cb
  ) {
    var commentData = {
      ticketId: ticketId,
      content: comment,
      sentByUserEmail: brandAgentEmail,
      sentByUserName: brandAgentName,
      sentByUserType: type,
      brandEmail: brandEmail,
      brandName: brandName,
      brandCategory: brandCategory,
    };
    $http
      .post("http://localhost:3000/addcomment", commentData, config)
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  //to accept the tickets
  this.acceptTickets = function (ticketId, cb) {
    $http
      .put(
        `http://localhost:3000/acceptTicket/${ticketId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json;odata=verbose",
          },
        }
      )
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  //to resolve tickets
  this.resolveTickets = function (
    ticketId,
    brandAgentEmail,
    brandAgentName,
    cb
  ) {
    $http
      .put(
        `http://localhost:3000/resolveTicketbyagent?ticketId=` +
          ticketId +
          "&name=" +
          brandAgentName +
          "&email=" +
          brandAgentEmail,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json;odata=verbose",
          },
        }
      )
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  //get ticket by agent
  this.getAgentTickets = function (brandAgentName, cb) {
    $http
      .get(`http://localhost:3000/getticketsbyagent/${brandAgentName}`, config)
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  //In Process Ticket by Id
  this.inProcessTicketById = function (ticketId, cb) {
    $http
      .put(
        "http://localhost:3000/inprocessticketbyagent/" + ticketId,
        {},
        config
      )
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  //add attachments to ticket
  this.addFileToTicket = function (
    Image,
    ticketId,
    brandName,
    brandAgentName,
    type,
    cb
  ) {
    var formData = new FormData();
    formData.append("image", Image);
    formData.append("ticketId", ticketId);
    formData.append("brandName", brandName);
    formData.append("userName", brandAgentName);
    formData.append("type", type);

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
        cb(result, null);
      },
      function (error) {
        cb(null, result);
      }
    );
  };

  //reject ticket
  this.rejectTickets = function (ticketId, cb) {
    $http
      .put("http://localhost:3000/rejectticket/" + ticketId, {}, config)
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  //  **CLOSED TICKET PAGE SERVICES**

  //get closed Tickets
  this.getClosedTickets = function (brandName, agentName, cb) {
    $http
      .get(
        "http://localhost:3000/getagentclosedtickets?brandName=" +
          brandName +
          "&agentName=" +
          agentName,
        config
      )
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, result);
      });
  };

  //  **REJECTED TICKET PAGE SERVICES**

  //get rejected tickets
  this.getRejectedTickets = function (brandName, agentName, cb) {
    $http
      .get(
        "http://localhost:3000/agentrejectedtickets?brandName=" +
          brandName +
          "&agentName=" +
          agentName,
        config
      )
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };
});
