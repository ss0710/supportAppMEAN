///<reference path="../app.js" />
///<reference path="../../services/managers/manager.service.js" />

app.controller("ClosedTickets", [
  "$scope",
  "$http",
  "$location",
  "managerService",
  function ($scope, $http, $location, managerService) {
    $scope.Created = "Created";
    $scope.Resolved = "resolved";

    $scope.checking = "askjfndjs";

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

    $scope.updateTicketDetailsDashboard = function (item) {
      $scope.ticketDetails = item;
      console.log("ticket details");
      console.log($scope.ticketDetails);

      //gettings logs
      $http
        .get(
          "http://localhost:3000/getlogsbyticket/" +
            $scope.ticketDetails.ticketId,
          config
        )
        .then(function (result) {
          $scope.logs = result.data;
          console.log("log data");
          console.log($scope.logs);
        })
        .catch(function (error) {
          console.log(error);
        });

      //gettings files
      $http
        .get(
          "http://localhost:3000/getticketfiles/" +
            $scope.ticketDetails.ticketId,
          config
        )
        .then(function (result) {
          $scope.files = result.data;
          console.log("file data");
          console.log($scope.files);
        })
        .catch(function (error) {
          console.log("loading file error");
          console.log(error);
        });

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
