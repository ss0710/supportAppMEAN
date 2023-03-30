///<reference path="../app.js" />
///<reference path="../../services/managers/manager.service.js" />

app.controller("Tickets", [
  "$scope",
  "$http",
  "$location",
  "managerService",
  function ($scope, $http, $location, managerService) {
    $scope.Created = "Created";
    $scope.Resolved = "resolved";

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
      // $scope.brandManagerDetails.brand.name = brandName;
      $scope.brandManagerDetails.brand.brandId = brandId;
      //getting comments
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

    //to comment
    $scope.addcommentHandler = function () {
      console.log("comment Handler called this");
      var commentData = {
        ticketId: $scope.ticketId,
        content: $scope.comment,
        sentByUserEmail: $scope.brandManagerDetails.email,
        sentByUserName: $scope.brandManagerDetails.userName,
        sentByUserType: "manager",
        brandEmail: $scope.brandManagerDetails.brand.email,
        brandName: $scope.brandManagerDetails.brand.name,
        brandCategory: $scope.brandManagerDetails.brand.category,
        isDeleted: "false",
      };

      console.log($scope.brandManagerDetails.brand.name);
      console.log(commentData);

      managerService.addComments(commentData, function (result, error) {
        if (result) {
          alert("comment added successfully");
        } else {
          console.log(error);
        }
      });
    };

    //update details for modal
    $scope.updateTicketDetailsDashboard = function (ticketDetails) {
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
      $http
        .get(
          "http://localhost:3000/getlogsbyticket/" +
            $scope.ticketDetails.ticketId,
          config
        )
        .then(function (result) {
          $scope.logs = result.data;
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
        })
        .catch(function (error) {
          console.log("loading file error");
          console.log(error);
        });
    };

    $scope.commentDashboardHandler = function () {
      console.log("dashboard comment called");
      var commentData = {
        ticketId: $scope.ticketDetails.ticketId,
        content: $scope.detailsComment,
        sentByUserEmail: $scope.brandManagerDetails.email,
        sentByUserName: $scope.brandManagerDetails.userName,
        sentByUserType: "manager",
        brandEmail: $scope.brandManagerDetails.brand.email,
        brandName: $scope.brandManagerDetails.brand.name,
        brandCategory: $scope.brandManagerDetails.brand.category,
        isDeleted: "false",
      };

      managerService.addComments(commentData, function (result, error) {
        if (result) {
          alert("comment added successfully");
        } else {
          console.log(error);
        }
      });
    };

    $scope.statusChangeHandler = function () {
      if ($scope.currentStatus == "inProcess") {
        $http
          .put(
            "http://localhost:3000/inprocessticket/" +
              $scope.ticketDetails.ticketId,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json;odata=verbose",
              },
            }
          )
          .then(function (result) {
            alert("status changed successfully");
            console.log(result);
          })
          .catch(function (error) {
            console.log(error.data);
          });
      } else if ($scope.currentStatus == "resolved") {
        console.log("resolved called");
        $http
          .put(
            "http://localhost:3000/resolveTicket?ticketId=" +
              $scope.ticketDetails.ticketId +
              "&name=" +
              $scope.brandManagerDetails.userName +
              "&email=" +
              $scope.brandManagerDetails.email,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json;odata=verbose",
              },
            }
          )
          .then(function (result) {
            alert("Ticket resolved");
          })
          .catch(function (error) {
            console.log(error.data);
          });
      } else if ($scope.currentStatus == "closed") {
        $http
          .put(
            "http://localhost:3000/closeticket/" +
              $scope.ticketDetails.ticketId,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json;odata=verbose",
              },
            }
          )
          .then(function (result) {
            alert("Ticket closed");
          })
          .catch(function (error) {
            console.log(error.data);
          });
      }
    };

    $scope.addFile = function (ticketId) {
      console.log("function called");
      var formData = new FormData();
      formData.append("image", $scope.formData.image);
      formData.append("ticketId", ticketId);
      formData.append("brandName", $scope.brandManagerDetails.brand.name);
      formData.append("userName", $scope.brandManagerDetails.userName);
      formData.append("type", "manager");

      $http({
        method: "POST",
        url: "http://localhost:3000/addfile",
        headers: {
          "Content-Type": undefined,
          Authorization: `Bearer ${token}`,
        },
        data: formData,
      }).then(
        function (response) {
          // handle server response
          alert("Successfully  uploaded");
        },
        function (error) {
          console.log(error.data);
          alert(error.data);
        }
      );
    };

    $scope.updateForFileModal = function (fileDetails) {
      $scope.fileDetails = fileDetails;
    };
  },
]);
