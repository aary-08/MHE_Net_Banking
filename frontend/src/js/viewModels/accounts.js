define([
  'ojs/ojcore',
  'knockout',
  'jquery',
  'ojs/ojarraydataprovider',
  'ojs/ojtable',
  'ojs/ojbutton',
  'ojs/ojdialog',
  'ojs/ojformlayout',
  'ojs/ojselectsingle',
  'ojs/ojinputtext',
  'ojs/ojlabel'
], function (oj, ko, $, ArrayDataProvider) {

  function AccountsViewModel(params) {
    var self = this;
    self.router = null;

    self.getRouter = function () {
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
    self.accounts = ko.observableArray([]);
    self.accountsDP = new ArrayDataProvider(self.accounts, {
      keyAttributes: 'accountNumber'
    });

    self.newAccountType = ko.observable('SAVINGS');
    self.creating = ko.observable(false);
    self.loading = ko.observable(true);

    // Get token
    const getToken = function () {
      return (
        localStorage.getItem('jwt_token')
      );
    };

    console.log('getToken:', getToken()); 

    // ✅ Load accounts
    self.loadAccounts = function () {
      self.loading(true);
      $.ajax({
        url: 'http://localhost:8080/api/accounts/user',
        type: 'GET',
        headers: {
          Authorization: 'Bearer ' + getToken(),
          'Content-Type': 'application/json'
        },
        success: function (data) {
          console.log('✅ Accounts loaded:', data);
          let formatted = data.map(function (acc, index) {
            return {
              serial: acc.id || (index + 1), // Use backend ID if available, fallback to index
              id: acc.id, // Store the actual backend ID
              accountType: acc.accountType,
              accountNumber: acc.accountNumber,
              balance:
                '₹' +
                parseFloat(acc.balance).toLocaleString('en-IN', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                }),
              currency: acc.currency,
              status: acc.status || 'Active'
            };
          });
          self.accounts(formatted);
        },
        error: function (xhr, status, error) {
          console.error('❌ Error loading accounts:', xhr.responseText);
          // Demo fallback
          self.loadMockData();
          alert('⚠️ Could not fetch accounts, showing demo data.');
        },
        complete: function () {
          self.loading(false);
        }
      });
    };

    // ✅ Demo accounts for fallback
    self.loadMockData = function () {
      self.accounts([
        {
          serial: 1,
          id: 1,
          accountType: 'SAVINGS',
          accountNumber: '366698477834',
          balance: '₹1,000.00',
          currency: 'INR',
          status: 'Active'
        },
        {
          serial: 2,
          id: 2,
          accountType: 'CURRENT',
          accountNumber: '366698477835',
          balance: '₹5,250.75',
          currency: 'INR',
          status: 'Active'
        }
      ]);
    };

    // ✅ Open dialog
    self.openCreateDialog = function () {
      document.querySelector('#createAccountDialog').open();
    };

    // ✅ Close dialog
    self.closeCreateDialog = function () {
      document.querySelector('#createAccountDialog').close();
      self.newAccountType('SAVINGS');
      self.creating(false);
    };

    // ✅ Create account
    self.createAccount = function () {
      if (!self.newAccountType()) {
        alert('Please select an account type.');
        return;
      }

      self.creating(true);
      $.ajax({
        url:
          'http://localhost:8080/api/accounts/create?accountType=' +
          self.newAccountType(),
        type: 'POST',
        contentType: 'application/json',
        headers: {
          Authorization: 'Bearer ' + getToken()
        },
        data: JSON.stringify({
          accountType: self.newAccountType(),
          balance: 1000.0,
          currency: 'INR'
        }),
        success: function (res) {
          console.log('✅ Account created:', res);
          alert('🎉 Account created successfully!');

          self.closeCreateDialog();
          self.loadAccounts();
        },
        error: function (xhr) {
          console.error('❌ Error creating account:', xhr.responseText);
          alert('⚠️ Failed to create account.');
        },
        complete: function () {
          self.creating(false);
        }
      });
    };

    // ✅ Delete account using serial number
    self.deleteAccount = function (serial) {
      console.log('Delete account called with serial:', serial);
      console.log('Current accounts:', self.accounts());

      // Prevent multiple simultaneous delete operations
      if (self.loading()) {
        console.log('Delete operation already in progress, ignoring request');
        return;
      }

      // Find the account by serial number to get the account details for confirmation
      const accountToDelete = self.accounts().find(acc => acc.serial == serial);
      console.log('Account to delete:', accountToDelete);

      if (!accountToDelete) {
        console.error('Account not found for serial:', serial);
        alert('Account not found!');
        return;
      }

      const accountNumber = accountToDelete.accountNumber;
      console.log('Deleting account with serial:', serial, 'and account number:', accountNumber);

      if (confirm("Are you sure you want to delete account " + accountNumber + "?")) {
        // Show loading state
        self.loading(true);

        $.ajax({
          url: 'http://localhost:8080/api/accounts/' + serial,
          type: 'DELETE',
          headers: {
            Authorization: 'Bearer ' + getToken()
          },
          timeout: 10000, // 10 second timeout
          success: function (response) {
            console.log('Delete successful:', response);
            alert('✅ Account deleted successfully!');

            // Remove the account from local array immediately to prevent UI issues
            const updatedAccounts = self.accounts().filter(acc => acc.serial != serial);
            self.accounts(updatedAccounts);

            // Reload accounts to get fresh data from server
            self.loadAccounts();
          },
          error: function (xhr) {
            console.error('❌ Error deleting account:', xhr);
            console.error('Response text:', xhr.responseText);
            console.error('Status:', xhr.status);

            let errorMessage = 'Unknown error';
            if (xhr.responseJSON && xhr.responseJSON.message) {
              errorMessage = xhr.responseJSON.message;
            } else if (xhr.responseText) {
              errorMessage = xhr.responseText;
            } else if (xhr.status === 0) {
              errorMessage = 'Network error - please check your connection';
            } else if (xhr.status === 404) {
              errorMessage = 'Account not found on server';
            } else if (xhr.status === 401) {
              errorMessage = 'Authentication failed - please login again';
            } else if (xhr.status === 403) {
              errorMessage = 'You do not have permission to delete this account';
            } else if (xhr.status >= 500) {
              errorMessage = 'Server error - please try again later';
            }

            alert('⚠️ Failed to delete account: ' + errorMessage);
            self.loading(false);
          },
          complete: function () {
            // Ensure loading state is always reset
            self.loading(false);
          }
        });
      }
    };

    // Navigate to new account page
    self.navigateToNewAccount = function () {
      console.log('navigateToNewAccount called');

      const router = self.getRouter();
      console.log('Router found:', router);

      if (router && typeof router.go === 'function') {
        try {
          console.log('Navigating to newaccount using router...');
          router.go({ path: 'newaccount' });
        } catch (error) {
          console.error('Router navigation failed:', error);
          // Fallback to hash navigation
          window.location.hash = '#/newaccount';
        }
      } else {
        console.warn('Router not available, using hash navigation');
        window.location.hash = '#/newaccount';
      }
    };

    window.deleteAccount = self.deleteAccount;

    // ✅ Lifecycle hook
    self.connected = function () {
      self.loadAccounts();
    };
  }

  return AccountsViewModel;
});
