///<reference path="../app.js" />
///<reference path="../../services/agents/agent.service.js" />

app.controller("brandAgents", [
  "$scope",
  "$location",
  "agentService",
  "$timeout",
  function ($scope, $location, agentService, $timeout) {
    //Handling sidebar button css
    $scope.activeClassname =
      "btn btn-outline-primary brandAdmin-sidebar-buttons-active";
    $scope.classname = "btn btn-outline-primary brandAdmin-sidebar-buttons";
    $scope.classname1 = $scope.activeClassname;
    $scope.classname2 = $scope.classname;
    $scope.classname3 = $scope.classname;
    $scope.handleActiveButton = function (id) {
      if (id == 1) {
        $scope.classname1 = $scope.activeClassname;
        $scope.classname2 = $scope.classname;
        $scope.classname3 = $scope.classname;
      } else if (id == 2) {
        $scope.classname1 = $scope.classname;
        $scope.classname2 = $scope.activeClassname;
        $scope.classname3 = $scope.classname;
      } else if (id == 3) {
        $scope.classname1 = $scope.classname;
        $scope.classname2 = $scope.classname;
        $scope.classname3 = $scope.activeClassname;
      }
    };

    $scope.notificationLenght = 0;
    //to get brandmanager informations
    agentService.getUserType(function (result, error) {
      if (result) {
        if (result.data.role != "agent") {
          $location.path("/noaccess");
        } else {
          $scope.brandAgentDetails = result.data;
          console.log("brandagentdetails");
          console.log($scope.brandAgentDetails);

          //get brand Information
          agentService.getBrandByName(
            $scope.brandAgentDetails.brand.name,
            function (result, error) {
              if (result) {
                $scope.brandlogo = result.data[0].brandLogo;
              } else {
                console.log(error);
              }
            }
          );

          //get Agent notification
          $scope.agentNotification;
          agentService.getAgentNotification(
            $scope.brandAgentDetails.userName,
            function (result, error) {
              if (result) {
                $scope.agentNotification = result.data;
                $scope.notificationLenght = $scope.agentNotification.length;
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

    //mark one notification as seen
    $scope.markSeen = function (notId) {
      agentService.markNotificationSeen(notId, function (result, error) {
        if (result) {
          console.log(result);
          $timeout(function () {
            var arr = $scope.agentNotification.filter(function (elem) {
              return elem._id != notId;
            });
            $scope.agentNotification = arr;
            $scope.notificationLenght = $scope.agentNotification.length;
          }, 1000);
        } else {
          console.log(error);
        }
      });
    };

    //mark all notification as seen
    $scope.markAllNotSeen = function () {
      if ($scope.agentNotification.length != 0) {
        agentService.markAllNotificationSeen(function (result, error) {
          if (result) {
            $scope.agentNotification = [];
            $scope.notificationLenght = $scope.agentNotification.length;
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
