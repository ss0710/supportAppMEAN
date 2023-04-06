///<reference path="../app.js" />
///<reference path="../../services/managers/manager.service.js" />

app.controller("TicketRequests", [
  "$scope",
  "$location",
  "managerService",
  function ($scope, $location, managerService) {
    $scope.Created = "Created";
    $scope.Assigned = "Assigned";
    $scope.Resolved = "resolved";
    $scope.Accepted = "Accepted";
    $scope.Rejected = "Rejected";

    //getting managers details
    managerService.getUserType(function (result, error) {
      if (result) {
        if (result.data.role != "manager") {
          $location.path("/noaccess");
        } else {
          $scope.brandManagerDetails = result.data;
          $scope.getCreatedTickets(1, 5);
        }
      } else {
        console.log(error);
      }
    });

    $scope.incrementByOne = function () {
      $scope.pageNumber++;
      $scope.getCreatedTickets($scope.pageNumber, 5);
    };

    $scope.getCreatedTickets = function (pageNumber, pageSize) {
      managerService.getTicketsByBrandIdAndManagerId(
        $scope.brandManagerDetails.brand.name,
        $scope.brandManagerDetails.userName,
        pageNumber,
        pageSize,
        "Created",
        function (result, error) {
          if (result) {
            $scope.ticketsrequested = result.data.data;
            $scope.pageNumber = result.data.pageNumber;
            $scope.pageSize = result.data.pageSize;
            $scope.totalCount = result.data.totalCount;
            $scope.lastPage = $scope.lastPageNumber(
              $scope.totalCount,
              $scope.pageSize
            );
            console.log($scope.ticketsrequested);
          } else {
            console.log(error);
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
        return totalCount / pageSize;
      } else {
        var r = totalCount / pageSize;
        return Math.ceil(r - 0.1);
      }
    };

    //loading agents
    $scope.loadAgents = function (ticketId, pageNumber, pageSize) {
      $scope.ticketId = ticketId;
      managerService.getAgents(
        $scope.brandManagerDetails.brand.name,
        pageNumber,
        pageSize,
        function (result, error) {
          if (result) {
            $scope.globalAgents = result.data.data;
            $scope.agents = $scope.globalAgents;
            $scope.pageNumber1 = result.data.pageNumber;
            $scope.pageSize1 = result.data.pageSize;
            $scope.totalCount1 = result.data.totalCount;
            $scope.lastPage1 = $scope.lastPageNumber(
              $scope.totalCount1,
              $scope.pageSize1
            );
          } else {
            console.log(error);
          }
        }
      );
    };

    $scope.getPages1 = function () {
      var pages = [];
      var pageCount = Math.ceil($scope.totalCount1 / $scope.pageSize1);
      for (var i = 1; i <= pageCount; i++) {
        pages.push(i);
      }
      return pages;
    };

    //function to assign ticket
    $scope.assignTicketToAgent = function (agentName, agentEmail) {
      managerService.assignTicketToAgentService(
        $scope.ticketId,
        agentName,
        agentEmail,
        $scope.brandManagerDetails,
        function (result, error) {
          if (result) {
            alert("Successfully assigned tickets");
            $(function () {
              $("#exampleModalCenter").modal("hide");
            });
            console.log($scope.ticketsrequested);
            $scope.ticketsrequested.forEach(function (elem) {
              if (elem.ticketId == $scope.ticketId) {
                elem.status = "Assigned";
              }
            });
            console.log($scope.ticketsrequested);
            // console.log(result);
          } else {
            console.log(error);
          }
        }
      );
    };

    //create tickets handler
    $scope.createTicketsHandler = function () {
      managerService.addTickets(
        $scope.subject,
        $scope.query,
        $scope.brandManagerDetails,
        function (result, error) {
          if (result) {
            alert("Succefully Created Ticket");
            console.log(result);
            $scope.ticketsrequested.unshift(result.data.ticketResult);
            $(function () {
              $("#addTicketModal").modal("hide");
            });
          } else {
            console.log(error.data);
          }
        }
      );
    };
  },
]);
