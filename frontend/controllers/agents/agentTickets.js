///<reference path="../app.js" />

app.controller("agentTickets", [
  "$scope",
  "$http",
  "$location",
  function ($scope, $http, $location) {
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

    $http
      .get("http://localhost:3000/usertype", config)
      .then(function (result) {
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

          var config1 = {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json;odata=verbose",
            },
            params: {
              id1: "agentUserId",
              id2: $scope.brandAgentId,
            },
          };

          $http
            .get(`http://localhost:3000/gettickets`, config1)
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
            })
            .catch(function (error) {
              console.log(error.data);
            });
        }
      })
      .catch(function (error) {
        console.log(error);
      });

    //to update global ticket details
    $scope.ticketComments = [];
    $scope.updateTicketDetails = function (id, subject, query) {
      $scope.ticketId = id;
      $scope.ticketSubject = subject;
      $scope.ticketQuery = query;

      //getting comments
      $http
        .get(`http://localhost:3000/getcomments/${$scope.ticketId}`, config)
        .then(function (result) {
          $scope.ticketComments = result.data;
          $scope.ticketComments.sort(function (a, b) {
            return a.dateAndTime - b.dateAndTime;
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    };

    //to comment
    $scope.addcommentHandler = function () {
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

      $http
        .post("http://localhost:3000/addcomment", commentData, config)
        .then(function (result) {
          alert("comment added successfully");
          $scope.comment = "";
        })
        .catch(function (error) {
          console.log(error);
        });
    };

    //function to accept the tickets
    $scope.acceptTicketHandler = function (ticketId) {
      console.log(ticketId);
      console.log(config);
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
          alert("Ticket accepted");
        })
        .catch(function (error) {
          console.log(error.data);
        });
    };

    $scope.resolveTicketHandler = function (ticketId) {
      console.log(ticketId);
      console.log(config);
      $http
        .put(
          `http://localhost:3000/resolveTicket/${ticketId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json;odata=verbose",
            },
          }
        )
        .then(function (result) {
          alert("Ticket resolved");
        })
        .catch(function (error) {
          console.log(error.data);
        });
    };
  },
]);
