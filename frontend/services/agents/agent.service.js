///<reference path="../../controllers/app.js" />

app.service("agentService", function ($http) {
  var token = localStorage.getItem("token");

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

  //get Brand by Name
  this.getBrandByName = function (brandName, cb) {
    $http
      .get("http://localhost:3000/getbrandbyid/" + brandName)
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
      .get("http://localhost:3000/agentnotification/" + brandAgentName)
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
      .put("http://localhost:3000/marknotseen/" + notId, {})
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
      .put("http://localhost:3000/markallagentnotseen", {})
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
      .get(`http://localhost:3000/getcomments/${ticketId}`)
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
      .get("http://localhost:3000/getlogsbyticket/" + ticketId)
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
      .get("http://localhost:3000/getticketfiles/" + ticketId)
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
      .post("http://localhost:3000/addcomment", commentData)
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
      .get(`http://localhost:3000/getticketsbyagent/${brandAgentName}`)
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
      .put("http://localhost:3000/inprocessticketbyagent/" + ticketId, {})
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  //add attachments to ticket
  this.addFileToTicket = function (formData, cb) {
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
        cb(null, result);
      }
    );
  };

  //reject ticket
  this.rejectTickets = function (ticketId, cb) {
    $http
      .put("http://localhost:3000/rejectticket/" + ticketId, {})
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
          agentName
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
          agentName
      )
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };
});
