///<reference path="../app.js" />
///<reference path="../../services/brands/brand.service.js" />

app.controller("agentStats", [
  "$scope",
  "$http",
  "$location",
  "statsService",
  function ($scope, $http, $location, statsService) {
    var token = localStorage.getItem("token");

    var config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json;odata=verbose",
      },
    };
    statsService.getUserType(function (result, error) {
      if (result) {
        console.log("stats page");
        console.log(result.data);
        if (result.data.role != "brandAdmin") {
          $location.path("/noaccess");
        } else {
          console.log("access granted");
          $scope.brandAdminDetails = result.data;
        }

        //getting manager and agent count
        statsService.getManagerAndAgentCount(
          $scope.brandAdminDetails.brand.brandId,
          function (result, error) {
            if (result) {
              var data = result.data;
              data.forEach(function (elem) {
                if (elem._id == "manager") {
                  $scope.managerCounts = elem.count;
                } else if (elem._id == "agent") {
                  $scope.agentCounts = elem.count;
                }
              });
              console.log(data);
            } else {
              console.log(error.data);
            }
          }
        );

        //getting managers details
        statsService.getManagerStats(
          $scope.brandAdminDetails.brand.brandId,
          function (result, error) {
            if (result) {
              $scope.managerDetails = result.data;
              console.log($scope.managerDetails);
            } else {
              console.log(error);
            }
          }
        );

        $http
          .get(
            "http://localhost:3000/ticketactivity/" +
              $scope.brandAdminDetails.brand.brandId,
            config
          )
          .then(function (result) {
            $scope.ticketsActivity = result.data;
            console.log("ticket Activity");
            console.log($scope.ticketsActivity);
            $scope.onMonthChange(3);
          })
          .catch(function (error) {
            console.log(error);
          });
      } else {
        console.log(error);
      }
    });

    var monthDetails = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    $scope.onMonthChange = function (monthNumber) {
      xvalues = [];
      createValues = [];
      resolveValues = [];
      closeValues = [];
      $scope.successRate = 0;
      var ticketCreateDay = 0;
      for (var i = 1; i <= monthDetails[monthNumber]; i++) {
        xvalues.push(i);
        var a = false;
        var b = false;
        var c = false;
        var cr = 0,
          rs = 0;
        $scope.ticketsActivity.forEach(function (elem) {
          if (elem.month == monthNumber && elem.day == i) {
            if (elem.type == "close") {
              closeValues.push(elem.count);
              a = true;
            }
            if (elem.type == "resolve") {
              resolveValues.push(elem.count);
              rs = elem.count;
              b = true;
            }
            if (elem.type == "create") {
              createValues.push(elem.count);
              cr = elem.count;
              ticketCreateDay++;
              c = true;
            }
          }
        });
        if (!a) closeValues.push(0);
        if (!b) resolveValues.push(0);
        if (!c) createValues.push(0);
        var cal = 0;
        if (cr != 0) cal = (rs / cr) * 100;
        if (cr != 0) $scope.successRate = $scope.successRate + cal;
        if (i == monthDetails[monthNumber]) {
          $scope.successRate = $scope.successRate / ticketCreateDay;
          $scope.successRate.toFixed(2);
          console.log(createValues);
          console.log(resolveValues);
          console.log(closeValues);
          console.log(xvalues);
          new Chart("myChart", {
            type: "line",
            data: {
              labels: xvalues,
              datasets: [
                {
                  data: closeValues,
                  borderColor: "red",
                  fill: false,
                },
                {
                  data: resolveValues,
                  borderColor: "green",
                  fill: false,
                },
                {
                  data: createValues,
                  borderColor: "blue",
                  fill: false,
                },
              ],
            },
            options: {
              legend: { display: false },
            },
          });
        }
      }
    };
  },
]);
