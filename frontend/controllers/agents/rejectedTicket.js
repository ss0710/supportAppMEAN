///<reference path="../app.js" />
///<reference path="../../services/agents/agent.service.js" />

app.controller("rejectedTicket", [
  "$scope",
  "$location",
  "agentService",
  function ($scope, $location, agentService) {
    $scope.tickets = [];
    agentService.getUserType(function (result, error) {
      if (result) {
        console.log(result.data);
        if (result.data.role != "agent") {
          $location.path("/noaccess");
        } else {
          $scope.brandAgentDetails = result.data;
          console.log($scope.brandAgentDetails);

          //get rejected tickets
          agentService.getRejectedTickets(
            $scope.brandAgentDetails.brand.name,
            $scope.brandAgentDetails.userName,
            function (result, error) {
              if (result) {
                $scope.tickets = result.data;
              } else {
                console.log(error);
              }
            }
          );
        }
      } else {
        console.log(error);
      }
    });

    //function to accept the tickets
    $scope.acceptTicketHandler = function (ticketId) {
      agentService.acceptTickets(ticketId, function (result, error) {
        if (result) {
          alert("Ticket accepted");
          var arr = $scope.tickets.filter(function (elem) {
            return elem.ticketId != ticketId;
          });
          $scope.tickets = arr;
        } else {
          console.log(error.data);
        }
      });
    };

    $scope.loadCommentAndDetails = function (ticketDetails) {
      $scope.activeTicketDetails = ticketDetails;
      agentService.getCommentsByTicketId(
        ticketDetails.ticketId,
        function (result, error) {
          if (result) {
            $scope.ticketComments = result.data;
          } else {
            console.log(error);
          }
        }
      );
    };
  },
]);
