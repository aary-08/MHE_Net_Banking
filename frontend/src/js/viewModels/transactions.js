/**
 * @license
 */
define(['../accUtils', 'knockout'],
  function (accUtils, ko) {
    function TransactionsViewModel(params) {
      var self = this;
      self.router = params && params.parentRouter ? params.parentRouter : null;

      self.accounts = ko.observableArray([]);
      self.selectedAccount = ko.observable('');
      self.limit = ko.observable(10);
      self.loading = ko.observable(false);
      self.errorMessage = ko.observable('');
      self.transactions = ko.observableArray([]);

      self.tokenHeader = function () {
        const token = localStorage.getItem('jwt_token');
        const tokenType = localStorage.getItem('token_type') || 'Bearer';
        return token ? { 'Authorization': `${tokenType} ${token}`, 'Content-Type': 'application/json' } : null;
      };

      self.loadAccounts = function () {
        const headers = self.tokenHeader();
        if (!headers) { self.errorMessage('You are not logged in.'); return; }
        return fetch('http://localhost:8080/api/accounts/user', { method: 'GET', headers })
          .then(r => { if (!r.ok) throw new Error('Failed to fetch accounts'); return r.json(); })
          .then(data => {
            const mapped = (data || []).map(a => ({ id: a.id, number: a.accountNumber, label: `${a.accountType} - ${a.accountNumber} (₹${parseFloat(a.balance).toFixed(2)})` }));
            self.accounts(mapped);
            if (mapped.length > 0) self.selectedAccount(mapped[0].id);
          })
          .catch(err => { self.errorMessage(err.message || 'Accounts load failed'); });
      };

      self.fetchTransactions = function () {
        self.errorMessage('');
        const headers = self.tokenHeader();
        if (!headers) { self.errorMessage('You are not logged in.'); return; }
        const accountId = self.selectedAccount();
        if (!accountId) { self.transactions([]); return; }
        self.loading(true);
        fetch(`http://localhost:8080/api/transactions/account/${accountId}`, { method: 'GET', headers })
          .then(r => { if (!r.ok) throw new Error('Failed to fetch transactions'); return r.json(); })
          .then(list => {
            const lim = parseInt(self.limit() || 10, 10);
            const sliced = (list || []).slice(0, lim);
            self.transactions(sliced);
          })
          .catch(err => { self.errorMessage(err.message || 'Failed to load transactions'); self.transactions([]); })
          .finally(() => self.loading(false));
      };

      self.onAccountChange = function () { self.fetchTransactions(); };
      self.onLimitChange = function () { self.fetchTransactions(); };

      self.formatDate = function (epoch) {
        if (!epoch) return '';
        try { return new Date(epoch).toLocaleString(); } catch (e) { return ''; }
      };

      this.connected = () => {
        accUtils.announce('Transactions page loaded.', 'assertive');
        document.title = 'Transaction History';
        self.loadAccounts().then(self.fetchTransactions);
      };

      // Back to dashboard via router (no hash fragment)
      self.goBackToDashboard = function () {
        if (self.router) {
          self.router.go({ path: 'dashboard' });
        } else if (window && window.location) {
          const url = new URL(window.location.href);
          url.searchParams.set('ojr', 'dashboard');
          url.hash = '';
          window.location.href = url.toString();
        }
      };
    }

    return TransactionsViewModel;
  }
);


