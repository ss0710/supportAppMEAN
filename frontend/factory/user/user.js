///<reference path="../../controllers/app.js" />
///<reference path="../../services/brands/brand.service.js" />
///<reference path="../../services/managers/manager.service.js" />
///<reference path="../../services/customer/customer.service.js" />

app.factory(
  "UserFactory",
  function (brandService, managerService, customerService) {
    return {
      addBrandManagerFactory: function (
        image,
        user,
        brandId,
        brandEmail,
        brandName,
        brandCategory,
        brandPhoneNumber,
        brandAddress,
        cb
      ) {
        var formData = new FormData();
        formData.append("image", image);
        formData.append("email", user.email);
        formData.append("userName", user.userName);
        formData.append("firstName", user.firstName);
        formData.append("lastName", user.lastName);
        formData.append("phoneNumber", user.phoneNumber);
        formData.append("password", user.password);
        formData.append("brandId", brandId);
        formData.append("brandEmail", brandEmail);
        formData.append("brandName", brandName);
        formData.append("brandCategory", brandCategory);
        formData.append("brandPhoneNumber", brandPhoneNumber);
        formData.append("brandAddress", brandAddress);

        brandService.addBrandManagers(formData, function (result, error) {
          if (result) {
            cb(result, null);
          } else {
            cb(null, error);
          }
        });
      },
      addBrandAgentFactory: function (agent, image, brand, cb) {
        var formData = new FormData();
        formData.append("image", image);
        formData.append("email", agent.email);
        formData.append("userName", agent.userName);
        formData.append("firstName", agent.firstName);
        formData.append("lastName", agent.lastName);
        formData.append("phoneNumber", agent.phoneNumber);
        formData.append("password", agent.password);
        formData.append("brandId", brand.brand.brandId);
        formData.append("brandEmail", brand.brand.email);
        formData.append("brandName", brand.brand.name);
        formData.append("brandCategory", brand.brand.category);
        formData.append("brandPhoneNumber", brand.brand.phoneNumber);
        formData.append("brandAddress", brand.brand.address);

        managerService.addBrandAgents(formData, function (result, error) {
          if (result) {
            cb(result, null);
          } else {
            cb(null, error);
          }
        });
      },
      addCustomerFactory: function (brand, user, cb) {
        var userData = {
          email: user.email,
          userName: user.name,
          name: {
            firstName: user.firstName,
            lastName: user.lastName,
          },
          phoneNumber: user.phoneNumber1,
          password: user.password,
          profileImage: "",
          profileImageKey: "",
          brand: {
            email: brand.email,
            name: brand.name,
            category: brand.category,
            phoneNumber: brand.phoneNumber,
            address: brand.address,
          },
        };

        customerService.addCustomers(userData, function (result, error) {
          if (result) {
            cb(result, null);
          } else {
            cb(null, error);
          }
        });
      },
    };
  }
);
