///<reference path="../app.js" />
///<reference path="../../services/agents/agent.service.js" />

app.controller("closedTicket", [
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
          //get rejected tickets
          agentService.getClosedTickets(
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
