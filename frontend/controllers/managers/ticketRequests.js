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
        console.log(result.data);
        if (result.data.role != "manager") {
          $location.path("/noaccess");
        } else {
          $scope.brandManagerDetails = result.data;
          console.log($scope.brandManagerDetails);
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
      console.log(pageNumber);
      managerService.getTicketsByBrandIdAndManagerId(
        $scope.brandManagerDetails.brand.name,
        $scope.brandManagerDetails.userName,
        pageNumber,
        pageSize,
        "Created",
        function (result, error) {
          if (result) {
            console.log(result.data);
            $scope.ticketsrequested = result.data.data;
            $scope.pageNumber = result.data.pageNumber;
            $scope.pageSize = result.data.pageSize;
            $scope.totalCount = result.data.totalCount;
            $scope.lastPageNumber($scope.totalCount, $scope.pageSize);
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
        $scope.lastPage = totalCount / pageSize;
      } else {
        var r = totalCount / pageSize;
        $scope.lastPage = Math.ceil(r - 0.1);
      }
    };

    //loading agents
    $scope.loadAgents = function (ticketId, pageNumber, pageSize) {
      console.log("load agents called");
      $scope.ticketId = ticketId;

      managerService.getAgents(
        $scope.brandManagerDetails.brand.name,
        pageNumber,
        pageSize,
        function (result, error) {
          if (result) {
            $scope.globalAgents = result.data.data;
            $scope.agents = $scope.globalAgents;
            console.log($scope.agents);
            $scope.pageNumber = result.data.pageNumber;
            $scope.pageSize = result.data.pageSize;
            $scope.totalCount = result.data.totalCount;

            $scope.lastPageNumber($scope.totalCount, $scope.pageSize);
          } else {
            console.log(error);
          }
        }
      );
    };

    //function to assign ticket
    $scope.assignTicketToAgent = function (agentName, agentEmail) {
      var agentData = {
        agentName: agentName,
        agentEmail: agentEmail,
        brandName: $scope.brandManagerDetails.brand.name,
        brandEmail: $scope.brandManagerDetails.brand.email,
        ticketId: $scope.ticketId,
        brandManagerName: $scope.brandManagerDetails.userName,
        brandManagerId: $scope.brandManagerDetails._id,
        agentName: agentName,
        userType: "manager",
      };

      console.log(agentData);

      managerService.assignTicketToAgentService(
        $scope.ticketId,
        agentData,
        function (result, error) {
          if (result) {
            alert("Successfully assigned tickets");
            $(function () {
              $("#exampleModalCenter").modal("hide");
            });
            $scope.ticketsrequested.forEach(function (elem) {
              if (elem.ticketId == $scope.ticketId) {
                elem.status = "Assigned";
              }
            });
            console.log(result);
          } else {
            console.log(error);
          }
        }
      );
    };

    //create tickets handler
    $scope.createTicketsHandler = function () {
      var ticketData = {
        brandName: $scope.brandManagerDetails.brand.name,
        brandEmail: $scope.brandManagerDetails.brand.email,
        subject: $scope.subject,
        query: $scope.query,
        createdByUserName: $scope.brandManagerDetails.userName,
        createdByUserEmail: $scope.brandManagerDetails.email,
        userType: "manager",
      };
      console.log(ticketData);
      managerService.addTickets(ticketData, function (result, error) {
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
      });
    };
  },
]);
