///<reference path="../../controllers/app.js" />

app.service("toastService", function () {
  this.information = function (message) {
    toastr.info(message);
  };

  this.successMessage = function (message) {
    toastr.success(message);
  };

  this.warningMessage = function (message) {
    toastr.warning(message);
  };

  this.errorMessage = function (message) {
    toastr.error(message);
  };
});
