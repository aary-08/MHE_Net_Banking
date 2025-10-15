define([
  'ojs/ojcore',
  'knockout',
  'jquery',
  'ojs/ojarraydataprovider',
  'ojs/ojinputtext',
  'ojs/ojinputnumber',
  'ojs/ojselectsingle',
  'ojs/ojcheckboxset',
  'ojs/ojbutton',
  'ojs/ojformlayout',
  'ojs/ojlabel'
], function (oj, ko, $, ArrayDataProvider) {
  function NewAccountViewModel(params) {  // FIXED: Accept params to get router
    var self = this;

    // FIXED: Get router properly
    self.router = null;
    
    // Method to get router reliably
    self.getRouter = function() {
      if (self.router) {
        return self.router;
      }
      
      // Try to get router from params first
      if (params && params.parentRouter) {
        self.router = params.parentRouter;
        return self.router;
      }
      
      // Try to get from global app controller
      try {
        const appElement = document.querySelector('[data-bind]');
        if (appElement && ko.dataFor(appElement)) {
          const appController = ko.dataFor(appElement);
          if (appController && appController.router) {
            self.router = appController.router;
            return self.router;
          }
        }
      } catch (error) {
        console.warn('Could not get router from app controller:', error);
      }
      
      return null;
    };

    // Observables
    self.newAccountType = ko.observable('SAVINGS');
    self.initialDeposit = ko.observable(1000);
    self.selectedCurrency = ko.observable('INR');
    self.termsAccepted = ko.observableArray([]);
    self.creating = ko.observable(false);
    self.accountCreated = ko.observable(false);
    
    // ✅ Added for oj-select-single data binding with ArrayDataProvider
    const accountTypeData = [
      { value: 'SAVINGS', label: '💰 Savings Account' },
      { value: 'CURRENT', label: '🏢 Current Account' }
    ];
    
    const currencyData = [
      { value: 'INR', label: '🇮🇳 Indian Rupee (INR)' }
    ];
    
    self.accountTypeOptions = new ArrayDataProvider(accountTypeData, {
      keyAttributes: 'value'
    });
    
    self.currencyOptions = new ArrayDataProvider(currencyData, {
      keyAttributes: 'value'
    });

    self.createdAccountNumber = ko.observable('');
    self.createdAccountType = ko.observable('');
    self.createdAccountBalance = ko.observable(0);

    // Get token
    const getToken = function () {
      return (
        localStorage.getItem('jwt_token') ||
        localStorage.getItem('token') ||
        "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiaWF0IjoxNzU2OTc5NDQxLCJleHAiOjE3NTcwNjU4NDF9.OTXSfwZJWeDfawDBaj_8LCDAgK_RzniIOvv4p1Subd8"
      );
    };

    // Get account type label
    self.getAccountTypeLabel = function (type) {
      const labels = {
        'SAVINGS': 'Savings Account',
        'CURRENT': 'Current Account'
      };
      return labels[type] || type;
    };

    // Check if can create account
    self.canCreateAccount = ko.computed(function () {
      return self.initialDeposit() >= 1000 && 
             self.termsAccepted().length === 2 &&
             !self.creating();
    });

    // Create account
    self.createAccount = function () {
      if (!self.canCreateAccount()) {
        alert('Please fill all required fields and accept terms.');
        return;
      }

      self.creating(true);
      
      // Build URL with accountType as query parameter
      const url = `http://localhost:8080/api/accounts/create?accountType=${self.newAccountType()}`;
      
      $.ajax({
        url: url,
        type: 'POST',
        contentType: 'application/json',
        headers: {
          'Authorization': 'Bearer ' + getToken()
        },
        data: JSON.stringify({
          balance: parseFloat(self.initialDeposit())
        }),
        success: function (response) {
          console.log('Account created successfully:', response);
          
          // Store created account details
          self.createdAccountNumber(response.accountNumber || response.id || 'Generated');
          self.createdAccountType(self.newAccountType());
          self.createdAccountBalance(self.initialDeposit());
          
          // Show success alert
          alert('Account Created Successfully!\n\n' +
                'Account Number: ' + self.createdAccountNumber() + '\n' +
                'Account Type: ' + self.getAccountTypeLabel(self.createdAccountType()) + '\n' +
                'Initial Balance: ₹' + self.initialDeposit().toLocaleString('en-IN') + '\n\n' +
                'Your account is now active and ready to use!');
          
          // Show success message
          self.accountCreated(true);
          self.creating(false);
        },
        error: function (xhr) {
          console.error('Error creating account:', xhr);
          console.error('Response text:', xhr.responseText);
          console.error('Status:', xhr.status);
          
          let errorMessage = 'Failed to create account. Please try again.';
          if (xhr.responseJSON && xhr.responseJSON.message) {
            errorMessage = xhr.responseJSON.message;
          } else if (xhr.responseText) {
            errorMessage = xhr.responseText;
          } else if (xhr.status === 401) {
            errorMessage = 'Authentication failed. Please login again.';
          } else if (xhr.status === 400) {
            errorMessage = 'Invalid account details. Please check your input.';
          }
          
          alert('Error: ' + errorMessage);
          self.creating(false);
        }
      });
    };

    // Reset form
    self.resetForm = function () {
      self.newAccountType('SAVINGS');
      self.initialDeposit(1000);
      self.selectedCurrency('INR');
      self.termsAccepted([]);
      self.accountCreated(false);
      self.createdAccountNumber('');
      self.createdAccountType('');
      self.createdAccountBalance(0);
    };

    // FIXED: Navigate back to dashboard
    self.goBackToDashboard = function () {
      console.log('goBackToDashboard called');
      
      const router = self.getRouter();
      console.log('Router found:', router);
      
      if (router && typeof router.go === 'function') {
        try {
          console.log('Navigating to dashboard using router...');
          router.go({ path: 'dashboard' });
        } catch (error) {
          console.error('Router navigation failed:', error);
          // Fallback to hash navigation
          window.location.hash = '#/dashboard';
        }
      } else {
        console.warn('Router not available, using hash navigation');
        window.location.hash = '#/dashboard';
      }
    };

    // FIXED: Navigate back to accounts (for compatibility) - also goes to dashboard
    self.goBackToAccounts = function () {
      console.log('goBackToAccounts called - redirecting to dashboard');
      self.goBackToDashboard();
    };

    // FIXED: Cancel function - same as going back to dashboard
    self.cancelAccountCreation = function () {
      console.log('cancelAccountCreation called');
      
      // Ask for confirmation if form has been filled
      if (self.initialDeposit() !== 1000 || self.termsAccepted().length > 0) {
        if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
          self.goBackToDashboard();
        }
      } else {
        self.goBackToDashboard();
      }
    };

    // Lifecycle hook
    self.connected = function () {
      console.log('New Account page connected');
      // Initialize router when connected
      self.getRouter();
    };

    self.disconnected = function () {
      console.log('New Account page disconnected');
    };

    self.transitionCompleted = function () {
      console.log('New Account page transition completed');
    };
  }

  // FIXED: Return constructor function instead of instance
  return NewAccountViewModel;
});