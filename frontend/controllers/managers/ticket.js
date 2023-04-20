///<reference path="../app.js" />
///<reference path="../../services/managers/manager.service.js" />
///<reference path="../../services/socket/socket.service.js" />
///<reference path="../../factory/files/file.js" />

app.controller("Tickets", [
  "$scope",
  "$location",
  "managerService",
  "socketService",
  "fileFactory",
  function ($scope, $location, managerService, socketService, fileFactory) {
    $scope.Created = "Created";
    $scope.Resolved = "resolved";
    $scope.listenTicketId = null;

    var socket = socketService.getSocketInstance();
    socket.on("comment", (data) => {
      if (data.ticketId == $scope.listenTicketId) {
        $scope.$apply(function () {
          $scope.ticketComments.push(data);
          console.log($scope.ticketComments);
        });
      }
    });

    //getting managers details
    managerService.getUserType(function (result, error) {
      if (result) {
        console.log(result.data);
        if (result.data.role != "manager") {
          $location.path("/noaccess");
        } else {
          $scope.brandManagerDetails = result.data;
          console.log($scope.brandManagerDetails.brand.name);
          $scope.loadInprocessAndResolvedTickets(1, 10, "inProcess");
        }
      } else {
        console.log(error);
      }
    });

    $scope.ticketType = "inProcess";
    $scope.changeTicketType = function (type) {
      if (type == 1) {
        $scope.ticketType = "inProcess";
      } else {
        $scope.ticketType = "resolved";
      }
      console.log("calling function with " + $scope.ticketType);
      $scope.loadInprocessAndResolvedTickets(
        $scope.pageNumber,
        $scope.pageSize,
        $scope.ticketType
      );
    };

    $scope.loadInprocessAndResolvedTickets = function (
      pageNumber,
      pageSize,
      status
    ) {
      managerService.getTicketsByBrandIdAndManagerId(
        $scope.brandManagerDetails.brand.name,
        $scope.brandManagerDetails.userName,
        pageNumber,
        pageSize,
        status,
        function (result, error) {
          if (result) {
            $scope.tickets = result.data.data;
            console.log($scope.tickets);
            $scope.pageNumber = result.data.pageNumber;
            $scope.pageSize = result.data.pageSize;
            $scope.totalCount = result.data.totalCount;
            $scope.lastPageNumber($scope.totalCount, $scope.pageSize);
          } else {
            console.log(error.data);
          }
        }
      );
    };

    $scope.getPages = function () {
      var pages = [];
      var pageCount = Math.ceil($scope.totalCount / $scope.pageSize);
      for (var i = 1; i <= pageCount; i++) {
        pages.push(i);
      }
      return pages;
    };

    $scope.lastPageNumber = function (totalCount, pageSize) {
      if (totalCount % pageSize == 0) {
        $scope.lastPage = totalCount / pageSize;
      } else {
        var r = totalCount / pageSize;
        $scope.lastPage = Math.ceil(r - 0.1);
      }
    };

    //to comment
    $scope.addcommentHandler = function () {
      managerService.addComments(
        $scope.ticketId,
        $scope.comment,
        $scope.brandManagerDetails,
        function (result, error) {
          if (result) {
            alert("comment added successfully");
          } else {
            console.log(error);
          }
        }
      );
    };

    //update details for modal
    $scope.updateTicketDetailsDashboard = function (ticketDetails) {
      $scope.listenTicketId = ticketDetails.ticketId;
      $scope.ticketDetails = ticketDetails;
      managerService.getComments(
        $scope.ticketDetails.ticketId,
        function (result, error) {
          if (result) {
            console.log(result.data);
            $scope.ticketComments = result.data;
            $scope.ticketComments.sort(function (a, b) {
              return a.dateAndTime - b.dateAndTime;
            });
          } else {
            console.log(error);
          }
        }
      );

      //gettings logs
      managerService.getLogs(
        $scope.ticketDetails.ticketId,
        function (result, error) {
          if (result) {
            $scope.logs = result.data;
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
          } else {
            console.log(error);
          }
        }
      );
    };

    $scope.commentDashboardHandler = function () {
      managerService.addComments(
        $scope.ticketDetails.ticketId,
        $scope.detailsComment,
        $scope.brandManagerDetails,
        function (result, error) {
          if (result) {
            alert("comment added successfully");
          } else {
            console.log(error);
          }
        }
      );
    };

    $scope.statusChangeHandler = function () {
      if ($scope.currentStatus == "inProcess") {
        managerService.inProcessTicketFunction(
          $scope.ticketDetails.ticketId,
          function (result, error) {
            if (result) {
              alert("status changed successfully");
              console.log(result);
            } else {
              console.log(error.data);
            }
          }
        );
      } else if ($scope.currentStatus == "resolved") {
        managerService.resolveTicketFunction(
          $scope.ticketDetails.ticketId,
          $scope.brandManagerDetails.userName,
          $scope.brandManagerDetails.email,
          function (result, error) {
            if (result) {
              alert("Ticket resolved");
            } else {
              console.log(error.data);
            }
          }
        );
      } else if ($scope.currentStatus == "closed") {
        managerService.closeTicketFunction(
          $scope.ticketDetails.ticketId,
          function (result, error) {
            if (result) {
              alert("Ticket closed");
            } else {
              console.log(error.data);
            }
          }
        );
      }
    };

    $scope.addFile = function (ticketId) {
      fileFactory.addFileByManagerFactory(
        $scope.formData.image,
        ticketId,
        $scope.brandManagerDetails,
        function (result, error) {
          if (result) {
            alert("Successfully  uploaded");
          } else {
            alert(error.data);
          }
        }
      );
    };

    $scope.updateForFileModal = function (fileDetails) {
      $scope.fileDetails = fileDetails;
    };

    $scope.updateTicketDetailsForModal = function (
      ticketId,
      status,
      agentName,
      subject,
      query,
      createdAt,
      createdByUserName
    ) {
      $scope.ticketId = ticketId;
      $scope.ticketStatus = status;
      $scope.assignedTo = agentName;
      $scope.tickedSubject = subject;
      $scope.ticketQuery = query;
      $scope.createdAt = createdAt;
      $scope.createdByUserName = createdByUserName;
    };

    //to get tickets comments
    $scope.ticketComments = [];
    $scope.getTicketComments = function (
      ticketId,
      status,
      agentName,
      subject,
      query,
      createdAt,
      createdByUserName,
      brandName,
      brandId,
      agentId
    ) {
      $scope.ticketId = ticketId;
      $scope.ticketStatus = status;
      $scope.assignedTo = agentName;
      $scope.assignedToId = agentId;
      $scope.tickedSubject = subject;
      $scope.ticketQuery = query;
      $scope.createdAt = createdAt;
      $scope.createdByUserName = createdByUserName;
      $scope.brandManagerDetails.brand.brandId = brandId;
      $scope.listenTicketId = $scope.ticketId;
      managerService.getComments($scope.ticketId, function (result, error) {
        if (result) {
          console.log(result.data);
          $scope.ticketComments = result.data;
          $scope.ticketComments.sort(function (a, b) {
            return a.dateAndTime - b.dateAndTime;
          });
        } else {
          console.log(error);
        }
      });
    };
  },
]);
