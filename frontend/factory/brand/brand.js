///<reference path="../../controllers/app.js" />
///<reference path="../../services/superadmin/superadmin.service.js" />

app.factory("brandFactory", function (superadminService) {
  return {
    addBrandFactory: function (image, brand, cb) {
      var formData = new FormData();
      formData.append("image", image);
      formData.append("email", brand.email);
      formData.append("name", brand.name);
      formData.append("category", brand.category);
      formData.append("phoneNumber", brand.phoneNumber);
      formData.append("address", brand.address);

      superadminService.addBrand(formData, function (result, error) {
        if (result) {
          cb(result, null);
        } else {
          cb(null, error);
        }
      });
    },
    addBrandAdminFactory: function (admin, brandDetails, cb) {
      var data = {
        email: admin.email,
        userName: admin.name,
        firstName: admin.firstName,
        lastName: admin.lastName,
        phoneNumber: admin.phoneNumber1,
        password: admin.password,
        brandId: brandDetails.brandId,
        brandEmail: brandDetails.email,
        brandName: brandDetails.name,
        brandCategory: brandDetails.category,
        brandPhoneNumber: brandDetails.phoneNumber,
        brandAddress: brandDetails.address,
      };

      superadminService.addBrandAdmin(data, function (result, error) {
        if (result) {
          cb(result, null);
        } else {
          cb(null, error);
        }
      });
    },
  };
});
