define([
  "knockout",
  "ojs/ojknockout",
  "ojs/ojinputtext",   // includes both oj-input-text and oj-text-area
  "ojs/ojlabel",
  "ojs/ojbutton",
  "ojs/ojformlayout"
], function (ko) {
  function RegisterViewModel(params) {
    var self = this;

    // If router is passed via params from appController
    self.router = params && params.parentRouter ? params.parentRouter : null;

    // Form observables
    self.firstName = ko.observable('');
    self.lastName = ko.observable('');
    self.username = ko.observable('');
    self.email = ko.observable('');
    self.phone = ko.observable('');
    self.address = ko.observable('');
    self.password = ko.observable('');
    self.confirmPassword = ko.observable('');

    // Email validator
    self.emailValidator = ko.observableArray([
      {
        validate: function (value) {
          let pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!pattern.test(value)) {
            throw new Error('Please enter a valid email address');
          }
        }
      }
    ]);

    // Handle Register
    self.handleRegister = function () {
      if (!self.firstName() || !self.lastName() || !self.username() || !self.email() ||
          !self.phone() || !self.address() || !self.password() || !self.confirmPassword()) {
        alert('Please fill all required fields');
        return;
      }

      if (self.password() !== self.confirmPassword()) {
        alert('Passwords do not match');
        return;
      }

      // Example payload
      let payload = {
        firstName: self.firstName(),
        lastName: self.lastName(),
        username: self.username(),
        email: self.email(),
        phoneNumber: self.phone(),
        address: self.address(),
        password: self.password()
      };

      console.log("Register Payload: ", payload);

      let apiUrl = "http://localhost:8080/api/auth/register"; 

        fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      console.log("API Response:", data);
      alert("User registered successfully! 🎉");
      // Optionally redirect
    //   oj.Router.rootInstance.go("dashboard");
    if (self.router) {
        self.router.go({ path: 'login' }); 
      }
    })
    .catch(error => {
      console.error("API Error:", error);
      alert("Something went wrong while registering user.");
    });
    };

    // Go back
    self.goHome = function () {
      if (self.router) {
        self.router.go({ path: 'dashboard' }); // CoreRouter navigation
      }
    };
    
    // Go to Login
    self.goToLogin = function () {
      if (self.router) {
        self.router.go({ path: 'login' });
      }
    };
  }
  return RegisterViewModel;
});
