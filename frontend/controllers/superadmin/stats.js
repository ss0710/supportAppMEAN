///<reference path="../app.js" />
///<reference path="../../services/superadmin/superadmin.service.js"/>
///<reference path="../../services/stats/stats.service.js"/>

app.controller("superAdminStats", [
  "$scope",
  "superadminService",
  "$timeout",
  "statsService",
  function ($scope, superadminService, $timeout, statsService) {
    $scope.checking = "checking";

    var token = localStorage.getItem("token");
    var config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json;odata=verbose",
      },
    };

    statsService.getBrandStatsAdmin(function (result, error) {
      if (result) {
        $scope.statsDetails = result.data;
        console.log($scope.statsDetails);
        $scope.categoryWithMostBrand = $scope.statsDetails[1][0]._id;
        $scope.formCategoryData($scope.statsDetails);
        $scope.formEmployeeData($scope.statsDetails);
        $scope.formBrandTicketData($scope.statsDetails[3]);
      } else {
        console.log(error);
      }
    });

    $scope.formEmployeeData = function (statsDetails) {
      var Colors = ["#b91d47", "#00aba9", "#2b5797", "#e8c3b9", "#1e7145"];
      $scope.xValuesEmployee = [];
      $scope.yValuesEmployee = [];
      $scope.barColors2 = [];
      var ind = 0;
      var empLen = 0;
      statsDetails[2].forEach(function (elem) {
        if (elem.brandName != null) {
          $scope.xValuesEmployee.push(elem.brandName);
          $scope.yValuesEmployee.push(elem.count);
          $scope.barColors2.push(Colors[ind % 5]);
          ind++;
          empLen++;
        }
      });
      $scope.formEmployeeGraph(empLen);
    };

    $scope.formCategoryData = function (statsDetails) {
      var Colors = ["red", "green", "blue", "orange", "brown"];
      $scope.xValuesCategory = [];
      $scope.yValuesCategory = [];
      $scope.barColors = [];
      var ind = 0;
      $scope.totalBrands = 0;
      statsDetails[0].forEach(function (elem) {
        $scope.xValuesCategory.push(elem._id);
        $scope.yValuesCategory.push(elem.count);
        $scope.totalBrands = $scope.totalBrands + elem.count;
        $scope.barColors.push(Colors[ind % 5]);
        ind++;
      });
      $scope.formCategoryGraph();
    };

    $scope.formBrandTicketData = function (brandTicketStats) {
      $scope.xValuesTickets = [];
      $scope.yValuesTickets = [];
      $scope.barColorsTickets = [
        "#b91d47",
        "#00aba9",
        "#2b5797",
        "#e8c3b9",
        "#1e7145",
      ];

      brandTicketStats.forEach(function (elem) {
        $scope.xValuesTickets.push(elem._id);
        $scope.yValuesTickets.push(elem.count);
      });
      $scope.formBrandTicketsGraph();
    };

    $scope.formBrandTicketsGraph = function () {
      new Chart("myChart2", {
        type: "doughnut",
        data: {
          labels: $scope.xValuesTickets,
          datasets: [
            {
              backgroundColor: $scope.barColorsTickets,
              data: $scope.yValuesTickets,
            },
          ],
        },
        options: {
          title: {
            display: true,
            text: "Top Brands With Maximum Tickets Processed",
          },
        },
      });
    };

    $scope.formEmployeeGraph = function (len) {
      new Chart("myChart1", {
        type: "pie",
        data: {
          labels: $scope.xValuesEmployee,
          datasets: [
            {
              backgroundColor: $scope.barColors2,
              data: $scope.yValuesEmployee,
            },
          ],
        },
        options: {
          title: {
            display: true,
            text: "Top " + len + " Brands With Most No. Of Employees",
          },
        },
      });
    };

    $scope.formCategoryGraph = function () {
      new Chart("myChart", {
        type: "bar",
        data: {
          labels: $scope.xValuesCategory,
          datasets: [
            {
              backgroundColor: $scope.barColors,
              data: $scope.yValuesCategory,
            },
          ],
        },
        options: {
          legend: { display: false },
          title: {
            display: true,
            text: "Categories With Numbers Of Brands",
          },
        },
      });
    };

    var timeout = null;
    $scope.showBrandList = false;
    $scope.isSearchAllowed = true;
    $scope.brandNameChangeHandler = function () {
      $scope.isSearchAllowed = true;
      $scope.showBrandList = true;
      console.log($scope.brandSearchName);
      if (timeout) {
        $timeout.cancel(timeout);
      }
      timeout = $timeout(function () {
        statsService.searchBrandfromAdmin(
          $scope.brandSearchName,
          function (result, error) {
            if (result) {
              console.log(result.data);
              $scope.brandList = result.data;
            } else {
              console.log(error);
            }
          }
        );
      }, 500);
    };

    $scope.selectBrand = function (brandDetails) {
      $scope.brandSearchName = brandDetails.name;
      $scope.currentDashboardBrand = brandDetails;
      $scope.showBrandList = false;
      $scope.isSearchAllowed = false;
    };

    $scope.updateBrandForDashboard = function () {
      statsService.getBrandDashboard(
        $scope.currentDashboardBrand.name,
        function (result, error) {
          if (result) {
            $scope.fetchedBrandDetails = result.data;
            console.log($scope.fetchedBrandDetails);
          } else {
            console.log(error);
          }
        }
      );

      statsService.adminTicketActiviyStats(
        $scope.currentDashboardBrand.name,
        function (result, error) {
          if (result) {
            $scope.ticketsActivity = result.data;
            console.log($scope.ticketsActivity);
            $scope.formDashboardProgressGraph();
          } else {
            console.log(error);
          }
        }
      );
    };

    $scope.formDashboardProgressGraph = function () {
      var XValues = [];
      var YValues = [];
      $scope.ticketsActivity.forEach(function (elem) {
        var date = elem.day + "-" + elem.month;
        XValues.push(date);
        YValues.push(elem.count);
      });

      new Chart("line-chart1", {
        type: "line",
        data: {
          labels: XValues,
          datasets: [
            {
              data: YValues,
              label: "Tickets",
              borderColor: "#3cba9f",
              fill: true,
            },
          ],
        },
        options: {
          legend: { display: false },
          title: {
            display: true,
            text: "Company's Growth",
          },
        },
      });
    };
  },
]);
