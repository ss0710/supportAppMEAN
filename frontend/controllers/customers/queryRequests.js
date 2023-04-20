///<reference path="../app.js" />
///<reference path="../../services/customer/customer.service.js" />
///<reference path="../../factory/ticket/ticket.js" />

app.controller("customerQueryRequests", [
  "$scope",
  "$location",
  "customerService",
  "ticketFactory",
  function ($scope, $location, customerService, ticketFactory) {
    $scope.testing = "test Query requests passed";

    customerService.getUserType(function (result) {
      if (result) {
        console.log(result);
        $scope.customerData = result.data;

        customerService.getRequestedQueries(
          $scope.customerData.userName,
          function (result, error) {
            if (result) {
              $scope.queriesList = result.data;
              console.log($scope.queriesList);
            } else {
              console.log(error);
            }
          }
        );
      } else {
        console.log(error);
      }
    });

    $scope.addQueryHandler = function () {
      ticketFactory.addQueryFactory(
        $scope.query,
        $scope.customerData,
        function (result, error) {
          if (result) {
            console.log("query added successfully");
          } else {
            console.log(error);
          }
        }
      );
    };

    $scope.getStatus = function (status) {
      return ticketFactory.getStatus(status);
    };
  },
]);
