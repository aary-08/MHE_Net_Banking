/**
 * @license
 */
define(['../accUtils', 'knockout'],
  function (accUtils, ko) {
    function FundTransferViewModel(params) {
      var self = this;

      self.router = params && params.parentRouter ? params.parentRouter : null;

      self.fromAccounts = ko.observableArray([]);
      self.selectedFromAccount = ko.observable('');
      self.toAccountNumber = ko.observable('');
      self.amount = ko.observable('');
      self.description = ko.observable('');

      self.isSubmitting = ko.observable(false);
      self.errorMessage = ko.observable('');
      self.successMessage = ko.observable('');

      self.resetMessages = function () {
        self.errorMessage('');
        self.successMessage('');
      };

      self.loadAccounts = function () {
        const token = localStorage.getItem('jwt_token');
        const tokenType = localStorage.getItem('token_type') || 'Bearer';
        if (!token) {
          self.errorMessage('You are not logged in.');
          return;
        }
        const headers = {
          'Authorization': `${tokenType} ${token}`,
          'Content-Type': 'application/json'
        };
        fetch('http://localhost:8080/api/accounts/user', { method: 'GET', headers })
          .then(res => { if (!res.ok) throw new Error('Failed to load accounts'); return res.json(); })
          .then(data => {
            const mapped = data.map(a => ({ id: a.id, number: a.accountNumber, label: `${a.accountType} - ${a.accountNumber}` }));
            self.fromAccounts(mapped);
            if (mapped.length > 0) self.selectedFromAccount(mapped[0].number);
          })
          .catch(err => { self.errorMessage(err.message || 'Unable to load accounts'); });
      };

      self.submitTransfer = function () {
        self.resetMessages();
        if (!self.selectedFromAccount() || !self.toAccountNumber() || !self.amount()) {
          self.errorMessage('Please fill all required fields.');
          return;
        }
        const amountVal = parseFloat(self.amount());
        if (isNaN(amountVal) || amountVal <= 0) {
          self.errorMessage('Enter a valid amount greater than 0.');
          return;
        }

        const token = localStorage.getItem('jwt_token');
        const tokenType = localStorage.getItem('token_type') || 'Bearer';
        if (!token) {
          self.errorMessage('You are not logged in.');
          return;
        }

        const payload = {
          fromAccountNumber: self.selectedFromAccount(),
          toAccountNumber: self.toAccountNumber(),
          amount: amountVal,
          description: self.description()
        };

        self.isSubmitting(true);
        fetch('http://localhost:8080/api/transactions/transfer', {
          method: 'POST',
          headers: {
            'Authorization': `${tokenType} ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        })
          .then(async res => {
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
              const msg = data && (data.error || data.message);
              throw new Error(msg || 'Transfer failed');
            }
            return data;
          })
          .then(data => {
            self.successMessage(`Transfer successful. Ref: ${data.transactionReference}`);
            self.toAccountNumber('');
            self.amount('');
            self.description('');
          })
          .catch(err => {
            self.errorMessage(err.message || 'Transfer failed');
          })
          .finally(() => self.isSubmitting(false));
      };

      self.goBack = function () { if (self.router) self.router.go({ path: 'dashboard' }); };

      this.connected = () => { accUtils.announce('Fund Transfer page loaded.', 'assertive'); document.title = 'Fund Transfer'; self.loadAccounts(); };
      this.disconnected = () => {};
      this.transitionCompleted = () => {};
    }

    return FundTransferViewModel;
  }
);


