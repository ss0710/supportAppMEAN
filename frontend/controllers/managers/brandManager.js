///<reference path="../app.js" />
///<reference path="../../services/managers/manager.service.js" />
///<reference path="../../services/socket/socket.service.js" />

app.controller("brandManager", [
  "$scope",
  "$location",
  "managerService",
  "$timeout",
  "socketService",
  function ($scope, $location, managerService, $timeout, socketService) {
    //toggle handler
    $scope.onlineStatus = "online";

    var socket = socketService.getSocketInstance();
    socket.on("notification", (data) => {
      if (data.receiver.userName == $scope.managerDetails.userName) {
        $scope.$apply(function () {
          $scope.managerNotification.unshift(data);
          $scope.notificationLenght = $scope.managerNotification.length;
        });
      }
    });

    $scope.toggleHandler = function () {
      console.log($scope.onlineStatus);
      if ($scope.onlineStatus == "online") {
        $scope.onlineStatus = "offline";
      } else {
        $scope.onlineStatus = "online";
      }
    };

    //to get brandmanager informations
    managerService.getUserType(function (result, error) {
      if (result) {
        console.log(result.data);
        if (result.data.role != "manager") {
          $location.path("/noaccess");
        } else {
          $scope.managerDetails = result.data;
          managerService.getBrandById(
            $scope.managerDetails.brand.name,
            function (result, error) {
              if (result) {
                $scope.brandlogo = result.data[0].brandLogo;
              } else {
                console.log(error);
              }
            }
          );

          $scope.managerNotification;
          managerService.getManagerNotification(
            $scope.managerDetails.userName,
            function (result, error) {
              if (result) {
                $scope.managerNotification = result.data;
                $scope.notificationLenght = $scope.managerNotification.length;
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

    //to mark one notification seen
    $scope.markSeen = function (notId) {
      managerService.markOneNotifSeen(notId, function (result, error) {
        if (result) {
          console.log(result);
          $timeout(function () {
            var arr = $scope.managerNotification.filter(function (elem) {
              return elem._id != notId;
            });
            $scope.managerNotification = arr;
            $scope.notificationLenght = $scope.managerNotification.length;
          }, 1000);
        } else {
          console.log(error);
        }
      });
    };

    //to mark all notification seen
    $scope.markAllNotSeen = function () {
      if ($scope.managerNotification.length != 0) {
        managerService.markAllNotificationSeen(function (result, error) {
          if (result) {
            $scope.managerNotification = [];
            $scope.notificationLenght = $scope.managerNotification.length;
          } else {
            console.log(error);
          }
        });
      }
    };

    //logout function
    $scope.logout = function () {
      localStorage.removeItem("token");
      $location.path("/login");
    };
  },
]);
