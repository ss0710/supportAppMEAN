///<reference path="../app.js" />
///<reference path="../../services/agents/agent.service.js" />

app.controller("agentTickets", [
  "$scope",
  "$http",
  "$location",
  "agentService",
  function ($scope, $http, $location, agentService) {
    $scope.tickets = [];
    var token = localStorage.getItem("token");
    var config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json;odata=verbose",
      },
    };

    //to get brandagent informations
    $scope.brandAgentId,
      $scope.brandAgentName,
      $scope.brandAgentEmail,
      $scope.brandId,
      $scope.brandName,
      $scope.brandEmail,
      $scope.brandPhoneNumber,
      $scope.brandCategory,
      $scope.brandAddress;
    $scope.ticketId;
    $scope.ticketSubject;
    $scope.ticketQuery;

    agentService.getUserType(function (result, error) {
      if (result) {
        console.log(result.data);
        if (result.data.role != "agent") {
          $location.path("/noaccess");
        } else {
          console.log("get tickets called");
          $scope.brandAgentId = result.data._id;
          $scope.brandAgentName = result.data.userName;
          $scope.brandAgentEmail = result.data.email;
          $scope.brandId = result.data.brand.brandId;
          $scope.brandName = result.data.brand.name;
          $scope.brandEmail = result.data.brand.email;
          $scope.brandPhoneNumber = result.data.brand.phoneNumber;
          $scope.brandCategory = result.data.brand.category;
          $scope.brandAddress = result.data.brand.address;

          console.log("brandAgent Id = " + $scope.brandAgentId);

          $http
            .get(
              `http://localhost:3000/getticketsbyagent/${$scope.brandAgentId}`,
              config
            )
            .then(function (result) {
              $scope.tickets = result.data;
              console.log("ticets");
              $scope.notAcceptedTickets = $scope.tickets.filter(function (
                elem
              ) {
                return elem.status == "Assigned";
              });
              $scope.AcceptedTickets = $scope.tickets.filter(function (elem) {
                return elem.status == "inProcess";
              });
              $scope.ResolvedTickets = $scope.tickets.filter(function (elem) {
                return elem.status == "resolved";
              });
              console.log($scope.notAcceptedTickets);
              $scope.length1 = $scope.notAcceptedTickets.length;
              $scope.length2 = $scope.AcceptedTickets.length;
              $scope.length3 = $scope.ResolvedTickets.length;
            })
            .catch(function (error) {
              console.log(error.data);
            });
        }
      } else {
        console.log(error);
      }
    });

    //to update ticket id details for modal
    $scope.updateTicketForModal = function (
      ticketId,
      status,
      assignedTo,
      subject,
      query,
      createdAt,
      CreatedBy
    ) {
      $scope.ticketId = ticketId;
      $scope.ticketStatus = status;
      $scope.assignedTo = assignedTo;
      $scope.tickedSubject = subject;
      $scope.ticketQuery = query;
      $scope.createdAt = createdAt;
      $scope.createdByUserName = CreatedBy;
    };

    //to update global ticket details
    $scope.ticketComments = [];
    $scope.updateTicketDetails = function (id, subject, query) {
      $scope.ticketId = id;
      $scope.ticketSubject = subject;
      $scope.ticketQuery = query;

      console.log("update ticket function called");

      //getting comments
      agentService.getCommentsByTicketId(
        $scope.ticketId,
        function (result, error) {
          if (result) {
            $scope.ticketComments = result.data;
            $scope.ticketComments.sort(function (a, b) {
              return a.dateAndTime - b.dateAndTime;
            });
          } else {
            console.log(error);
          }
        }
      );
    };

    //to comment
    $scope.addcommentHandler = function (
      throughCommentModal,
      throughDetailsModal
    ) {
      if (throughCommentModal) {
        var commentData = {
          ticketId: $scope.ticketId,
          ticketSubject: $scope.ticketSubject,
          ticketQuery: $scope.ticketQuery,
          content: $scope.comment,
          sentByUserId: $scope.brandAgentId,
          sentByUserName: $scope.brandAgentName,
          sentByUserType: "agent",
          brandId: $scope.brandId,
          brandEmail: $scope.brandEmail,
          brandName: $scope.brandName,
          brandCategory: $scope.brandCategory,
          isDeleted: "false",
        };

        agentService.addComments(commentData, function (result, error) {
          if (result) {
            alert("comment added successfully");
            $scope.comment = "";
          } else {
            console.log(error);
          }
        });
      } else {
        if ($scope.detailsComment) {
          var commentData = {
            ticketId: $scope.ticketDetails.ticketId,
            ticketSubject: $scope.ticketDetails.ticketSubject,
            ticketQuery: $scope.ticketDetails.ticketQuery,
            content: $scope.detailsComment,
            sentByUserId: $scope.brandAgentId,
            sentByUserName: $scope.brandAgentName,
            sentByUserType: "agent",
            brandId: $scope.brandId,
            brandEmail: $scope.brandEmail,
            brandName: $scope.brandName,
            brandCategory: $scope.brandCategory,
            isDeleted: "false",
          };

          agentService.addComments(commentData, function (result, error) {
            if (result) {
              alert("comment added successfully");
              $scope.detailsComment = "";
            } else {
              console.log(error.data);
            }
          });
        } else {
          alert("type something to comment");
        }
      }
    };

    //function to accept the tickets
    $scope.acceptTicketHandler = function (ticketId) {
      agentService.acceptTickets(ticketId, function (result, error) {
        console.log(ticketId);
        console.log(config);
        if (result) {
          alert("Ticket accepted");
        } else {
          console.log(error.data);
        }
      });
    };

    $scope.resolveTicketHandler = function (ticketId) {
      console.log(ticketId);
      console.log(config);

      agentService.resolveTickets(ticketId, function (result, error) {
        if (result) {
          alert("Ticket resolved");
        } else {
          console.log(error.data);
        }
      });
    };

    $scope.ticketEditModal = function (ticketDetails) {
      $scope.ticketDetails = ticketDetails;
      console.log($scope.ticketDetails);
      //getting comments
      agentService.getCommentsByTicketId(
        $scope.ticketDetails.ticketId,
        function (result, error) {
          if (result) {
            $scope.ticketComments = result.data;
            $scope.ticketComments.sort(function (a, b) {
              return a.dateAndTime - b.dateAndTime;
            });
            console.log($scope.ticketComments);
          } else {
            console.log(error);
          }
        }
      );

      //gettings logs
      $http
        .get(
          "http://localhost:3000/getlogsbyticket/" +
            $scope.ticketDetails.ticketId,
          config
        )
        .then(function (result) {
          $scope.logs = result.data;
        })
        .cath(function (error) {
          console.log(error);
        });
    };
  },
]);
