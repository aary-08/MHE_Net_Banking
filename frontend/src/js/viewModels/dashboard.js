/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/*
 * Your dashboard ViewModel code goes here
 */
define(['../accUtils', 'knockout'],
  function (accUtils, ko) {
    function DashboardViewModel(params) {
      var self = this;

      // Get router from global app controller
      self.router = null;
      // Try to get router from parent if available, otherwise get from global
      if (params && params.parentRouter) {
        self.router = params.parentRouter;
      } else {
        // Get router from the global app controller
        const appElement = document.querySelector('[data-bind]');
        if (appElement && ko.dataFor(appElement)) {
          const appController = ko.dataFor(appElement);
          self.router = appController.router;
        }
      }

      // Observable properties for the dashboard
      self.currentUser = ko.observable(localStorage.getItem('username') || 'Guest');
      self.currentPage = ko.observable('overview');
      self.totalBalance = ko.observable('₹1000.00');
      self.activeCards = ko.observable(0);
      self.totalAccounts = ko.observable(1);
      self.recentActivity = ko.observable(0);

      // Account data
      self.accounts = ko.observableArray([
        {
          type: 'SAVINGS Account',
          number: 'XXXXXXXX7834',
          balance: '₹1000.00',
          status: 'Active'
        }
      ]);

      // Quick actions
      self.quickActions = ko.observableArray([
        { icon: '💸', text: 'Transfer Funds', action: 'transfer' },
        { icon: '➕', text: 'Open Account', action: 'newAccount' },
        { icon: '💳', text: 'Apply for Card', action: 'applyCard' },
        { icon: '📄', text: 'View Statements', action: 'statements' }
      ]);

      // Navigation function
      self.selectPage = function (page) {
        self.currentPage(page);
        console.log('Navigating to:', page);

        // Update page content based on selection
        self.updatePageContent(page);
      };

      // Update page content
      self.updatePageContent = function (page) {
        // This function can be extended to load different content
        // based on the selected page
        switch (page) {
          case 'overview':
            // Load overview data
            break;
          case 'accounts':
            // Load accounts data
            break;
          case 'cards':
            // Load cards data
            break;
          case 'transfer':
            // Load transfer form
            break;
          case 'transactions':
            // Load transaction history
            break;
          case 'profile':
            // Load profile data
            break;
        }
      };

      // Navigate to Overview (stay on dashboard)
      self.navigateToOverview = function () {
        console.log('navigateToOverview called');
        // Stay on dashboard, just update the current page
        self.currentPage('overview');
      };

      // Navigate to Accounts module
      self.navigateToAccounts = function () {
        console.log('navigateToAccounts called, router:', self.router);
        if (self.router) {
          console.log('Navigating to accounts...');
          self.router.go({ path: 'accounts' });
        } else {
          console.warn('Router not available to navigate to accounts');
          // Fallback to hash navigation
          window.location.hash = '#/accounts';
        }
      };


      // Navigate to Cards module
      self.navigateToCard = function () {
        console.log('navigateToCard called, router:', self.router);
        if (self.router) {
          console.log('Navigating to card...');
          self.router.go({ path: 'card' });
        } else {
          console.warn('Router not available to navigate to card');
          window.location.hash = '#/card';
        }
      };

      // Navigate to Profile
      self.navigateToProfile = function () {
        if (self.router) {
          self.router.go({ path: 'profile' });
        } else {
          window.location.hash = '#/profile';
        }
      };
      
      // Navigate to Transactions module
      self.navigateToTransactions = function () {
        console.log('navigateToTransactions called, router:', self.router);
        if (self.router) {
          console.log('Navigating to transactions...');
          self.router.go({ path: 'transactions' });
        } else {
          console.warn('Router not available to navigate to transactions');
          window.location.hash = '#/transactions';
        }
      };
      // Navigate to New Account
      self.navigateToNewAccount = function () {
        console.log('navigateToNewAccount called, router:', self.router);
        if (self.router) {
          console.log('Navigating to newaccount...');
          self.router.go({ path: 'newaccount' });
        } else {
          console.warn('Router not available to navigate to newaccount');
          window.location.hash = '#/newaccount';
        }
      };

      // Navigate to Fund Transfer
      self.navigateToTransfer = function () {
        console.log('navigateToTransfer called, router:', self.router);
        if (self.router) {
          console.log('Navigating to fundtransfer...');
          self.router.go({ path: 'fundtransfer' });
        } else {
          console.warn('Router not available to navigate to fundtransfer');
          window.location.hash = '#/fundtransfer';
        }
      };



      // Quick action handlers
      self.performQuickAction = function (action) {
        switch (action) {
          case 'transfer':
            self.navigateToTransfer();
            break;
          case 'newAccount':
            self.navigateToNewAccount();
            break;
          case 'applyCard':
            self.navigateToCard();
            break;
          case 'statements':
            self.navigateToTransactions();
            //console.log('Loading statements');
            // Add logic to view statements
            break;
        }
      };

      // Refresh dashboard data
      self.refreshDashboard = function () {
        console.log('Refreshing dashboard data...');

        const token = localStorage.getItem('jwt_token');
        const tokenType = localStorage.getItem('token_type') || 'Bearer';

        console.log(token);

        if (!token) {
          console.error('No token found!');
          return;
        }

        const headers = {
          'Authorization': `${tokenType} ${token}`,
          'Content-Type': 'application/json'
        };

        // Step 1: Fetch Accounts
        fetch('http://localhost:8080/api/accounts/user', { method: 'GET', headers })
          .then(res => {
            if (!res.ok) throw new Error('Failed to fetch accounts');
            return res.json();
          })
          .then(accountData => {
            self.totalAccounts(accountData.length);
            self.accounts(accountData.map(account => ({
              type: account.accountType + ' Account',
              number: account.accountNumber,
              balance: `₹${account.balance.toFixed(2)}`,
              status: 'Active'
            })));

            // Calculate total balance
            const total = accountData.reduce((sum, acc) => sum + parseFloat(acc.balance), 0);
            self.totalBalance(`₹${total.toFixed(2)}`);

            // Step 2: Fetch Recent Transactions (for first account)
            if (accountData.length > 0) {
              const firstAccountId = accountData[0].id;
              return fetch(`http://localhost:8080/api/transactions/account/${firstAccountId}`, { method: 'GET', headers });
            } else {
              return Promise.resolve({ json: () => [], ok: true });
            }
          })
          .then(res => {
            if (!res.ok) throw new Error('Failed to fetch transactions');
            return res.json();
          })
          .then(transactions => {
            const last5 = transactions.slice(0, 5);
            self.recentActivity(last5.length);
          })
          .catch(err => {
            console.error('Dashboard data load failed:', err);
            alert('Failed to load dashboard data.');
          });

        // Step 3: Fetch Cards
        fetch('http://localhost:8080/api/cards/user', { method: 'GET', headers })
          .then(res => {
            if (!res.ok) throw new Error('Failed to fetch cards');
            return res.json();
          })
          .then(cardsData => {
            const active = cardsData.filter(card => card.status === 'ACTIVE').length;
            self.activeCards(active);
          })
          .catch(err => {
            console.error('Cards data fetch error:', err);
          });
      };


      this.connected = () => {
        accUtils.announce('Dashboard page loaded.', 'assertive');
        document.title = "Net Banking Dashboard";

        // Initialize dashboard
        console.log('Dashboard connected');
        self.refreshDashboard();
      };

      /**
       * Optional ViewModel method invoked after the View is disconnected from the DOM.
       */
      this.disconnected = () => {
        console.log('Dashboard disconnected');
        // Cleanup if needed
      };

      /**
       * Optional ViewModel method invoked after transition to the new View is complete.
       * That includes any possible animation between the old and the new View.
       */
      this.transitionCompleted = () => {
        console.log('Dashboard transition completed');
        // Animation or transition logic here
      };
    }

    /*
     * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
     * return a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.
     */
    return DashboardViewModel;
  }
);