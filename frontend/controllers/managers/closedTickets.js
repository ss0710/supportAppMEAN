///<reference path="../app.js" />
///<reference path="../../services/managers/manager.service.js" />

app.controller("ClosedTickets", [
  "$scope",
  "$location",
  "managerService",
  function ($scope, $location, managerService) {
    $scope.Created = "Created";
    $scope.Resolved = "resolved";

    //getting managers details
    managerService.getUserType(function (result, error) {
      if (result) {
        console.log(result.data);
        if (result.data.role != "manager") {
          $location.path("/noaccess");
        } else {
          $scope.brandManagerDetails = result.data;
          console.log($scope.brandManagerDetails);
          managerService.getTicketsByBrandIdAndManagerId(
            $scope.brandManagerDetails.brand.name,
            $scope.brandManagerDetails.userName,
            1,
            20,
            "Closed",
            function (result, error) {
              if (result) {
                console.log(result);
                $scope.tickets = result.data.data;
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

    //update for ticket modal
    $scope.updateTicketDetailsDashboard = function (item) {
      $scope.ticketDetails = item;
      //gettings logs
      managerService.getLogs(
        $scope.ticketDetails.ticketId,
        function (result, error) {
          if (result) {
            $scope.logs = result.data;
            console.log("log data");
            console.log($scope.logs);
          } else {
            console.log(error);
          }
        }
      );

      //gettings files
      managerService.getFiles(
        $scope.ticketDetails.ticketId,
        function (result, error) {
          if (result) {
            $scope.files = result.data;
            console.log("file data");
            console.log($scope.files);
          } else {
            console.log("loading file error");
            console.log(error);
          }
        }
      );

      //get comments
      managerService.getComments(
        $scope.ticketDetails.ticketId,
        function (result, error) {
          if (result) {
            console.log(result.data);
            $scope.ticketComments = result.data;
          } else {
            console.log(error);
          }
        }
      );
    };
  },
]);
