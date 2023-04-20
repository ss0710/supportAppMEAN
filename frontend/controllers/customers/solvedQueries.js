///<reference path="../app.js" />
///<reference path="../../services/customer/customer.service.js" />

app.controller("customerSolvedQueries", [
  "$scope",
  "$location",
  "customerService",
  function ($scope, $location, customerService) {
    customerService.getUserType(function (result) {
      if (result) {
        console.log(result);
        $scope.customerData = result.data;

        customerService.getCustomerSolvedQueries(
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
  },
]);
