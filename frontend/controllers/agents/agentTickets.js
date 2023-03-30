///<reference path="../app.js" />
///<reference path="../../services/agents/agent.service.js" />

app.controller("agentTickets", [
  "$scope",
  "$http",
  "$location",
  "agentService",
  function ($scope, $http, $location, agentService) {
    $scope.tickets = [];
    $scope.ticketComments = [];
    $scope.ticketStatusChangeDetails;

    agentService.getUserType(function (result, error) {
      if (result) {
        console.log(result.data);
        if (result.data.role != "agent") {
          $location.path("/noaccess");
        } else {
          console.log("get tickets called");
          $scope.brandAgentId = result.data._id;
          $scope.brandAgentName = result.data.userName;
          $scope.brandAgentEmail = result.data.email;
          $scope.brandId = result.data.brand.brandId;
          $scope.brandName = result.data.brand.name;
          $scope.brandEmail = result.data.brand.email;
          $scope.brandPhoneNumber = result.data.brand.phoneNumber;
          $scope.brandCategory = result.data.brand.category;
          $scope.brandAddress = result.data.brand.address;

          agentService.getAgentTickets(
            $scope.brandAgentName,
            function (result, error) {
              if (result) {
                $scope.tickets = result.data;
                console.log("ticets");
                $scope.notAcceptedTickets = $scope.tickets.filter(function (
                  elem
                ) {
                  return elem.status == "Assigned";
                });
                $scope.AcceptedTickets = $scope.tickets.filter(function (elem) {
                  return (
                    elem.status == "Accepted" || elem.status == "inProcess"
                  );
                });
                $scope.ResolvedTickets = $scope.tickets.filter(function (elem) {
                  return elem.status == "resolved";
                });
                console.log($scope.notAcceptedTickets);
                $scope.length1 = $scope.notAcceptedTickets.length;
                $scope.length2 = $scope.AcceptedTickets.length;
                $scope.length3 = $scope.ResolvedTickets.length;
              } else {
                console.log(error.data);
              }
            }
          );
        }
      } else {
        console.log(error);
      }
    });

    //to update ticket id details for modal
    $scope.updateTicketForModal = function (
      ticketId,
      status,
      assignedTo,
      subject,
      query,
      createdAt,
      CreatedBy
    ) {
      $scope.ticketId = ticketId;
      $scope.ticketStatus = status;
      $scope.assignedTo = assignedTo;
      $scope.tickedSubject = subject;
      $scope.ticketQuery = query;
      $scope.createdAt = createdAt;
      $scope.createdByUserName = CreatedBy;
    };

    //to update global ticket details
    $scope.updateTicketDetails = function (id, subject, query) {
      $scope.ticketId = id;
      $scope.ticketSubject = subject;
      $scope.ticketQuery = query;
      //getting comments
      agentService.getCommentsByTicketId(
        $scope.ticketId,
        function (result, error) {
          if (result) {
            $scope.ticketComments = result.data;
            $scope.ticketComments.sort(function (a, b) {
              return a.dateAndTime - b.dateAndTime;
            });
            console.log($scope.ticketComments);
          } else {
            console.log(error);
          }
        }
      );
    };

    //to comment
    $scope.addcommentHandler = function (throughCommentModal, ticketId) {
      if (throughCommentModal) {
        agentService.addComments(
          $scope.ticketId,
          $scope.comment,
          $scope.brandAgentEmail,
          $scope.brandAgentName,
          "agent",
          $scope.brandEmail,
          $scope.brandName,
          $scope.brandCategory,
          function (result, error) {
            if (result) {
              alert("comment added successfully");
            } else {
              console.log(error);
            }
          }
        );
      } else {
        if ($scope.detailsComment) {
          agentService.addComments(
            ticketId,
            $scope.detailsComment,
            $scope.brandAgentEmail,
            $scope.brandAgentName,
            "agent",
            $scope.brandEmail,
            $scope.brandName,
            $scope.brandCategory,
            function (result, error) {
              if (result) {
                alert("comment added succesfully");
              } else {
                console.log(error.data);
              }
            }
          );
        } else {
          alert("type something to comment");
        }
      }
    };

    //function to accept the tickets
    $scope.acceptTicketHandler = function (ticketId) {
      agentService.acceptTickets(ticketId, function (result, error) {
        if (result) {
          alert("Ticket accepted");
          var arr = $scope.notAcceptedTickets.filter(function (elem) {
            if (elem.ticketId == ticketId) {
              elem.status = "inProcess";
              $scope.AcceptedTickets.unshift(elem);
            }
            return elem.ticketId != ticketId;
          });
          $scope.notAcceptedTickets = arr;
        } else {
          console.log(error.data);
        }
      });
    };

    //to resolve ticket
    $scope.resolveTicketHandler = function (ticketId) {
      agentService.resolveTickets(
        ticketId,
        $scope.brandAgentId,
        $scope.brandAgentName,
        function (result, error) {
          if (result) {
            alert("Ticket resolved");
            var arr = $scope.AcceptedTickets.filter(function (elem) {
              if (elem.ticketId == ticketId) {
                elem.status = "resolved";
                $scope.ResolvedTickets.unshift(elem);
              }
              return elem.ticketId != ticketId;
            });
            $scope.AcceptedTickets = arr;
          } else {
            console.log(error.data);
          }
        }
      );
    };

    $scope.ticketEditModal = function (ticketDetails) {
      $scope.ticketStatusChangeDetails = ticketDetails;
      $scope.ticketDetails = ticketDetails;
      //getting comments
      agentService.getCommentsByTicketId(
        $scope.ticketDetails.ticketId,
        function (result, error) {
          if (result) {
            $scope.ticketComments = result.data;
            $scope.ticketComments.sort(function (a, b) {
              return a.dateAndTime - b.dateAndTime;
            });
            console.log($scope.ticketComments);
          } else {
            console.log(error);
          }
        }
      );

      //gettings logs
      agentService.getTicketLogs(
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
      agentService.getTicketFiles(
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

    //status change handler
    $scope.statusChangeHandler = function () {
      if ($scope.currentStatus == "inProcess") {
        agentService.inProcessTicketById(
          $scope.ticketStatusChangeDetails.ticketId,
          function (result, error) {
            if (result) {
              alert("status changed successfully");
              var arr = $scope.ResolvedTickets.filter(function (elem) {
                if (
                  elem.ticketId == $scope.ticketStatusChangeDetails.ticketId
                ) {
                  elem.status = "Accepted";
                  $scope.AcceptedTickets.unshift(elem);
                }
                return (
                  elem.ticketId != $scope.ticketStatusChangeDetails.ticketId
                );
              });
              $scope.ResolvedTickets = arr;
            } else {
              console.log(error.data);
            }
          }
        );
      } else if ($scope.currentStatus == "Accepted") {
        agentService.acceptTickets(
          $scope.ticketStatusChangeDetails.ticketId,
          function (result, error) {
            if (result) {
              alert("Ticket accepted");
              console.log("running filter method this");
              var arr = $scope.ResolvedTickets.filter(function (elem) {
                if (
                  elem.ticketId == $scope.ticketStatusChangeDetails.ticketId
                ) {
                  elem.status = "Accepted";
                  $scope.AcceptedTickets.unshift(elem);
                }
                return (
                  elem.ticketId != $scope.ticketStatusChangeDetails.ticketId
                );
              });
              $scope.ResolvedTickets = arr;
            } else {
              console.log(error.data);
            }
          }
        );
      } else if ($scope.currentStatus == "resolved") {
        console.log("resolved called");
        agentService.resolveTickets(
          $scope.ticketStatusChangeDetails.ticketId,
          $scope.brandAgentEmail,
          $scope.brandAgentName,
          function (result, error) {
            if (result) {
              alert("Ticket resolved");
              var arr = $scope.AcceptedTickets.filter(function (elem) {
                if (
                  elem.ticketId == $scope.ticketStatusChangeDetails.ticketId
                ) {
                  elem.status = "resolved";
                  $scope.ResolvedTickets.unshift(elem);
                }
                return (
                  elem.ticketId != $scope.ticketStatusChangeDetails.ticketId
                );
              });
              $scope.AcceptedTickets = arr;
            } else {
              console.log(error.data);
            }
          }
        );
      }
    };

    //function to add File
    $scope.addFile = function (ticketId) {
      agentService.addFileToTicket(
        $scope.formData.image,
        ticketId,
        $scope.brandName,
        $scope.brandAgentName,
        "manager",
        function (result, error) {
          if (result) {
            alert("Successfully  uploaded");
          } else {
            console.log(error.data);
          }
        }
      );
    };

    //function to update File Modal
    $scope.updateForFileModal = function (fileDetails) {
      $scope.fileDetails = fileDetails;
    };

    //function to reject Ticket
    $scope.rejectTicket = function (ticketId) {
      agentService.rejectTickets(ticketId, function (result, error) {
        if (result) {
          alert("ticket rejected");
          var arr = $scope.notAcceptedTickets.filter(function (elem) {
            return elem.ticketId != ticketId;
          });
          $scope.notAcceptedTickets = arr;
        } else {
          console.log(error);
        }
      });
    };
  },
]);
