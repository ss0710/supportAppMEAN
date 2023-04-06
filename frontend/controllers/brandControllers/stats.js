///<reference path="../app.js" />
///<reference path="../../services/brands/brand.service.js" />

app.controller("agentStats", [
  "$scope",
  "$location",
  "statsService",
  "$timeout",
  function ($scope, $location, statsService, $timeout) {
    var token = localStorage.getItem("token");
    $scope.userListShow = false;
    $scope.prevString = "<<";
    $scope.nextString = ">>";

    var config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json;odata=verbose",
      },
    };

    statsService.getUserType(function (result, error) {
      if (result) {
        if (result.data.role != "brandAdmin") {
          $location.path("/noaccess");
        } else {
          console.log("access granted");
          $scope.brandAdminDetails = result.data;
        }

        //getting manager and agent count
        statsService.getManagerAndAgentCount(
          $scope.brandAdminDetails.brand.name,
          function (result, error) {
            if (result) {
              data = result.data;
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
          $scope.brandAdminDetails.brand.name,
          function (result, error) {
            if (result) {
              $scope.managerDetails = result.data;
            } else {
              console.log(error);
            }
          }
        );

        statsService.getTicketActivity(
          $scope.brandAdminDetails.brand.name,
          function (result, error) {
            if (result) {
              $scope.ticketsActivity = result.data;
              $scope.onMonthChange(3);
            } else {
              console.log(error);
            }
          }
        );

        statsService.getTicketStats(
          $scope.brandAdminDetails.brand.name,
          function (result, error) {
            if (result) {
              $scope.ticketStats = result.data;
              $scope.avgSolvingTimeInString = $scope.msToTime(
                $scope.ticketStats[0][0].averageSolvingTime
              );
            } else {
              console.log(error);
            }
          }
        );
      } else {
        console.log(error);
      }
    });

    $scope.msToTime = function (duration) {
      var milliseconds = parseInt(duration % 1000);
      var seconds = parseInt((duration / 1000) % 60);
      var minutes = parseInt((duration / (1000 * 60)) % 60);
      var hours = parseInt((duration / (1000 * 60 * 60)) % 24);
      hours = hours < 10 ? "0" + hours : hours;
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;
      return hours + ":" + minutes + ":" + seconds;
    };

    $scope.calculateEfficiency = function (ticketsClosed, ticketsCreated) {
      var percentage = (ticketsClosed / ticketsCreated) * 100;
      return percentage.toFixed(2);
    };

    var monthDetails = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var MonthNames = [
      "",
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

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
              rs = elem.count;
              closeValues.push(elem.count);
              a = true;
            }
            if (elem.type == "resolve") {
              resolveValues.push(elem.count);
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

    var currentDate = new Date();
    var currentYear = currentDate.getFullYear();
    var formattedYear = currentYear.toString().substring(2, 4);
    $scope.currentYear = "20" + formattedYear;
    $scope.userActArr = [];

    $scope.generateHeatMap = function () {
      $scope.activeArray = [];
      $scope.totalActivities = 0;
      $scope.totalActiveDays = 0;

      for (var i = 1; i <= 12; i++) {
        var obj = {
          mohthName: MonthNames[i],
          daysStats: [],
        };
        var arr = [];
        for (var j = 1; j <= monthDetails[i]; j++) {
          var daySt = {
            className: "heat-map-box",
            date: j + " " + MonthNames[i],
            activity: 0,
          };
          var counter = 0;
          $scope.userActArr.forEach(function (elem) {
            counter++;
            if (
              elem._id.year == $scope.currentYear &&
              elem._id.month == i &&
              elem._id.day == j
            ) {
              $scope.totalActivities = $scope.totalActivities + elem.count;
              $scope.totalActiveDays++;
              if (elem.count <= 3) {
                daySt.className = "heat-map-box-lg";
                daySt.activity = elem.count;
              } else if (elem.count > 3 && elem.count <= 7) {
                daySt.className = "heat-map-box-mg";
                daySt.activity = elem.count;
              } else if (elem.count >= 8) {
                daySt.className = "heat-map-box-dg";
                daySt.activity = elem.count;
              }
            }
            if (counter == $scope.userActArr.length) {
              arr.push(daySt);
            }
          });
          if ($scope.userActArr.length == 0) {
            arr.push(daySt);
          }
        }
        obj.daysStats = arr;
        $scope.activeArray.push(obj);
      }
    };

    $scope.nextYearNavigate = function () {
      var next_year = +$scope.currentYear + 1;
      $scope.currentYear = next_year;
      $scope.generateHeatMap();
    };

    $scope.previousNavigate = function () {
      var next_year = +$scope.currentYear - 1;
      $scope.currentYear = next_year;
      $scope.generateHeatMap();
    };

    $scope.selectUserHandler = function (user) {
      $scope.searchUserName = user.userName;
      $scope.userListShow = false;
    };

    var timeout;
    $scope.onUserChangeHandler = function () {
      console.log("function called");
      $scope.userListShow = true;
      if (timeout) {
        $timeout.cancel(timeout);
      }
      timeout = $timeout(function () {
        statsService.searchUsers(
          $scope.brandAdminDetails.brand.name,
          $scope.searchUserName,
          function (result, error) {
            if (result) {
              $scope.currentUsers = result.data;
            } else {
              console.log(error);
            }
          }
        );
      }, 500);
    };

    $scope.showActivityStat = function () {
      statsService.getUserActivityStats(
        $scope.brandAdminDetails.brand.name,
        $scope.searchUserName,
        function (result, error) {
          if (result) {
            $scope.userActArr = result.data;
            $scope.generateHeatMap();
          } else {
            console.log(error);
          }
        }
      );

      statsService.getProfileStats(
        $scope.brandAdminDetails.brand.name,
        $scope.searchUserName,
        function (result, error) {
          if (result) {
            $scope.modalUser = result.data;
            console.log("modal User");
            console.log($scope.modalUser);
          } else {
            console.log(error);
          }
        }
      );
    };
  },
]);
