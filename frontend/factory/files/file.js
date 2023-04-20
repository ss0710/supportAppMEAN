///<reference path="../../controllers/app.js" />
///<reference path="../../services/agents/agent.service.js" />
///<reference path="../../services/managers/manager.service.js" />

app.factory("fileFactory", function (agentService, managerService) {
  return {
    addFileByManagerFactory: function (image, ticketId, managerDetails, cb) {
      var formData = new FormData();
      formData.append("image", image);
      formData.append("ticketId", ticketId);
      formData.append("brandName", managerDetails.brand.name);
      formData.append("userName", managerDetails.userName);
      formData.append("type", "manager");

      managerService.addFilesToTicket(formData, function (result, error) {
        if (result) {
          cb(result, null);
        } else {
          cb(null, error);
        }
      });
    },
    addFileByAgentFactory: function (
      Image,
      ticketId,
      brandName,
      brandAgentName,
      type,
      cb
    ) {
      var formData = new FormData();
      formData.append("image", Image);
      formData.append("ticketId", ticketId);
      formData.append("brandName", brandName);
      formData.append("userName", brandAgentName);
      formData.append("type", type);

      agentService.addFileToTicket(formData, function (result, error) {
        if (result) {
          cb(result, null);
        } else {
          cb(null, error);
        }
      });
    },
  };
});
