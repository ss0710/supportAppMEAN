///<reference path="../../controllers/app.js" />
///<reference path="../../services/brands/brand.service.js" />
///<reference path="../../services/customer/customer.service.js" />
///<reference path="../../services/managers/manager.service.js" />

app.factory(
  "ticketFactory",
  function (brandService, managerService, customerService) {
    return {
      addTicketFactory: function (subject, query, brandManagerDetails, cb) {
        var ticketData = {
          brandName: brandManagerDetails.brand.name,
          brandEmail: brandManagerDetails.brand.email,
          subject: subject,
          query: query,
          createdByUserName: brandManagerDetails.userName,
          createdByUserEmail: brandManagerDetails.email,
          userType: "manager",
        };

        managerService.addTickets(ticketData, function (result, error) {
          if (result) {
            cb(result, null);
          } else {
            cb(null, error);
          }
        });
      },
      addQueryFactory: function (query, customerData, cb) {
        var data = {
          brandName: customerData.brand.name,
          brandEmail: customerData.brand.email,
          subject: query.subject,
          query: query.query,
          customerName: customerData.userName,
          customerEmail: customerData.email,
        };

        customerService.addQueryService(data, function (result, error) {
          if (result) {
            cb(result, null);
          } else {
            cb(null, error);
          }
        });
      },
      getStatus: function (status) {
        if (status == "Created" || status == "Rejected") {
          return "query sent";
        } else if (status == "Assigned") {
          return "Assigned to Agent";
        } else if (status == "Accepted" || status == "inProcess") {
          return "In process";
        } else if (status == "resolved") {
          return "Query resolved";
        } else if (status == "Closed") {
          return "Query Closed";
        }
      },
      assignQueryToAgents: function (
        managerDetails,
        agentDetails,
        ticketDetails,
        cb
      ) {
        var data = {
          brandName: managerDetails.brand.name,
          customerName: ticketDetails.customer.name,
          managerName: managerDetails.userName,
          managerEmail: managerDetails.email,
          agentName: agentDetails.userName,
          agentEmail: agentDetails.email,
        };

        managerService.assignCustomerQueryToAgents(
          data,
          function (result, error) {
            if (result) {
              cb(result, null);
            } else {
              cb(null, error);
            }
          }
        );
      },
    };
  }
);
