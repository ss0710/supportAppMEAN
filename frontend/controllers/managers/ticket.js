///<reference path="../app.js" />
///<reference path="../../services/managers/manager.service.js" />

app.controller("Tickets", [
  "$scope",
  "$http",
  "$location",
  "managerService",
  function ($scope, $http, $location, managerService) {
    //global variables
    $scope.globaltickets = [];
    $scope.tickets = [];
    $scope.Created = "Created";

    //to get brandmanager informations
    $scope.brandManagerId,
      $scope.brandManagerName,
      $scope.brandManagerEmail,
      $scope.brandId,
      $scope.brandName,
      $scope.brandEmail,
      $scope.brandPhoneNumber,
      $scope.brandCategory,
      $scope.brandAddress;

    //getting token from local storage
    var token = localStorage.getItem("token");
    var config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json;odata=verbose",
      },
    };

    //getting managers details

    managerService.getUserType(function (result, error) {
      if (result) {
        console.log(result.data);
        if (result.data.role != "manager") {
          $location.path("/noaccess");
        } else {
          $scope.brandManagerId = result.data._id;
          $scope.brandManagerName = result.data.userName;
          $scope.brandManagerEmail = result.data.email;
          $scope.brandId = result.data.brand.brandId;
          $scope.brandName = result.data.brand.name;
          $scope.brandEmail = result.data.brand.email;
          $scope.brandPhoneNumber = result.data.brand.phoneNumber;
          $scope.brandCategory = result.data.brand.category;
          $scope.brandAddress = result.data.brand.address;

          //gettings tickets of this particular brand
          var config1 = {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json;odata=verbose",
            },
            params: {
              id1: "brandId",
              id2: $scope.brandId,
            },
          };

          managerService.getTickets($scope.brandId, function (result, error) {
            if (result) {
              $scope.globaltickets = result.data;
              $scope.tickets = result.data;
            } else {
              console.log(error.data);
            }
          });
        }
      } else {
        console.log(error);
      }
    });

    //filter methods
    $scope.allTickets = function () {
      $scope.tickets = $scope.globaltickets;
    };

    $scope.notAssignedTickets = function () {
      $scope.tickets = $scope.globaltickets.filter(function (data) {
        return data.status == "Created";
      });
    };

    $scope.assignedTickets = function () {
      $scope.tickets = $scope.globaltickets.filter(function (data) {
        return data.status == "Assigned";
      });
    };

    $scope.inProcessTickets = function () {
      $scope.tickets = $scope.globaltickets.filter(function (data) {
        return data.status == "inProcess";
      });
    };

    $scope.resolvedTickets = function () {
      $scope.tickets = $scope.globaltickets.filter(function (data) {
        return data.status == "resolved";
      });
    };

    //global variables to be used for Modal
    $scope.ticketId,
      $scope.ticketStatus,
      $scope.assignedTo,
      $scope.tickedSubject,
      $scope.ticketQuery,
      $scope.createdAt,
      $scope.createdByUserName,
      $scope.BrandName,
      $scope.BrandId;

    //to get tickets comments
    $scope.ticketComments = [];
    $scope.getTicketComments = function (
      ticketId,
      status,
      agentName,
      subject,
      query,
      createdAt,
      createdByUserName,
      brandName,
      brandId,
      agentId
    ) {
      $scope.ticketId = ticketId;
      $scope.ticketStatus = status;
      $scope.assignedTo = agentName;
      $scope.assignedToId = agentId;
      $scope.tickedSubject = subject;
      $scope.ticketQuery = query;
      $scope.createdAt = createdAt;
      $scope.createdByUserName = createdByUserName;
      $scope.BrandName = brandName;
      $scope.BrandId = brandId;
      //getting comments

      managerService.getComments($scope.ticketId, function (result, error) {
        if (result) {
          console.log(result.data);
          $scope.ticketComments = result.data;
          $scope.ticketComments.sort(function (a, b) {
            return a.dateAndTime - b.dateAndTime;
          });
        } else {
          console.log(error);
        }
      });
    };

    $scope.updateTicketDetailsForModal = function (
      ticketId,
      status,
      agentName,
      subject,
      query,
      createdAt,
      createdByUserName,
      brandName,
      brandId
    ) {
      $scope.ticketId = ticketId;
      $scope.ticketStatus = status;
      $scope.assignedTo = agentName;
      $scope.tickedSubject = subject;
      $scope.ticketQuery = query;
      $scope.createdAt = createdAt;
      $scope.createdByUserName = createdByUserName;
      $scope.BrandName = brandName;
      $scope.BrandId = brandId;
    };

    //to comment
    $scope.addcommentHandler = function () {
      console.log("comment Handler called");
      var commentData = {
        ticketId: $scope.ticketId,
        ticketSubject: $scope.ticketSubject,
        ticketQuery: $scope.ticketQuery,
        content: $scope.comment,
        sentByUserId: $scope.brandManagerId,
        sentByUserName: $scope.brandManagerName,
        sentByUserType: "manager",
        brandId: $scope.brandId,
        brandEmail: $scope.brandEmail,
        brandName: $scope.brandName,
        brandCategory: $scope.brandCategory,
        isDeleted: "false",
      };

      managerService.addComments(commentData, function (result, error) {
        if (result) {
          alert("comment added successfully");
          $scope.comment = "";
          console.log(result);
          var not_data = {
            notificationType: "agent",
            brandId: $scope.brandId,
            ticketId: result.data.ticketId,
            message:
              $scope.brandManagerName +
              " has commented on ticket " +
              result.data.ticketId,
            creator: {
              id: $scope.brandManagerId,
              name: $scope.brandManagerName,
              time: Date.now(),
            },
            receiver: {
              id: $scope.assignedToId,
              name: $scope.assignedTo,
            },
            isSeen: false,
          };
          $http
            .post("http://localhost:3000/addnotification", not_data, config)
            .then(function (result) {
              console.log("successfully created notofication");
            })
            .catch(function (error) {
              console.log(error);
            });
        } else {
          console.log(error);
        }
      });
    };

    //create tickets handler
    $scope.createTicketsHandler = function () {
      var ticketData = {
        brandId: $scope.brandId,
        brandName: $scope.brandName,
        subject: $scope.subject,
        query: $scope.query,
        createdByUserID: $scope.brandManagerId,
        createdByUserName: $scope.brandManagerName,
      };

      managerService.addTickets(ticketData, function (result, error) {
        if (result) {
          alert("Succefully Created Ticket");
          console.log(result);
          var not_data = {
            notificationType: "agent",
            brandId: $scope.brandId,
            ticketId: result.data.ticketId,
            message:
              $scope.brandManagerName +
              " created a ticket with Id " +
              result.data.ticketId,
            creator: {
              id: $scope.brandManagerId,
              name: $scope.brandManagerName,
              time: Date.now(),
            },
            receiver: {
              id: "",
              name: "",
            },
            isSeen: false,
          };
          $http
            .post("http://localhost:3000/addnotification", not_data, config)
            .then(function (result) {
              console.log("successfully created notofication");
            })
            .catch(function (error) {
              console.log(error);
            });
        } else {
          console.log(error);
        }
      });
    };

    //loading agents
    $scope.globalAgents = [];
    $scope.agents = [];
    $scope.loadAgents = function (ticketId) {
      console.log("load agents called");
      $scope.ticketId = ticketId;

      managerService.loadAgentforModal(
        $scope.brandId,
        function (result, error) {
          if (result) {
            $scope.globalAgents = result.data;
            $scope.agents = $scope.globalAgents;
            console.log($scope.agents);
          } else {
            console.log(error);
          }
        }
      );
    };

    //function to assign ticket
    $scope.assignTicketToAgent = function (agentId, agentName) {
      var agentData = {
        agentId: agentId,
        agentName: agentName,
      };

      managerService.assignTicketToAgentService(
        $scope.ticketId,
        agentData,
        function (result, error) {
          if (result) {
            alert("Successfully assigned tickets");

            $http
              .put(
                "http://localhost:3000/assignnotification/" + $scope.ticketId,
                agentData,
                config
              )
              .then(function (result) {
                console.log("successfully updated notification");
              })
              .catch(function (error) {
                console.log(error);
              });
          } else {
            console.log(error);
          }
        }
      );
    };
  },
]);
