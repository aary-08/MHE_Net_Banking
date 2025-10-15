/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl
 * @ignore
 */
/*
 * Your card ViewModel code goes here
 */
define([
  '../accUtils',
  'knockout',
  'ojs/ojcore',
  'ojs/ojbutton',
  'ojs/ojformlayout',
  'ojs/ojradioset',
  'ojs/ojselectsingle',
  'ojs/ojdialog',
  'ojs/ojarraydataprovider',
  'ojs/ojknockout',
  'jquery'
], function (accUtils, ko, oj, ArrayDataProvider, $) {
  function CardViewModel(params) {
    var self = this;
    self.router = params && params.parentRouter ? params.parentRouter : null;

    // Observable properties
    self.cards = ko.observableArray([]);
    self.showApplyDialog = ko.observable(false);
    self.showDetailsDialog = ko.observable(false);
    self.selectedCard = ko.observable(null);
    self.selectedCardType = ko.observable('');
    self.selectedAccountId = ko.observable('');
    self.accounts = ko.observableArray([]);
    self.accountOptions = ko.observableArray([]);
    self.accountDataProvider = ko.observable();
    self.selectedAccountNumber = ko.observable('');
    self.loading = ko.observable(false);
    self.errorMessage = ko.observable('');

    // JWT Token from localStorage
    self.getAuthToken = function () {
      var type = localStorage.getItem('token_type') || 'Bearer';
      var token = localStorage.getItem('jwt_token');
      return token ? type + ' ' + token : null;
    };

    // API Base URL
    self.apiBaseUrl = 'http://localhost:8080/api';

    // Load user cards
    self.loadUserCards = function () {
      self.loading(true);
      self.errorMessage('');

      var authHeader = self.getAuthToken();
      if (!authHeader) {
        self.errorMessage('Please login to view your cards');
        self.loading(false);
        return;
      }

      fetch(self.apiBaseUrl + '/cards/user', {
        method: 'GET',
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/json'
        }
      })
        .then(function (response) {
          if (!response.ok) {
            throw new Error('Failed to fetch cards: ' + response.statusText);
          }
          return response.json();
        })
        .then(function (data) {
          // Process cards data and add masked card number
          var processedCards = data.map(function (card) {
            return {
              id: card.id,
              maskedCardNumber: self.maskCardNumber(card.cardNumber),
              cardType: ko.observable(card.cardType),
              status: ko.observable(card.status),
              cardNumber: ko.observable(card.cardNumber),
              cardHolderName: ko.observable(card.cardHolderName),
              expiryDate: ko.observable(card.expiryDate),
              accountId: ko.observable(card.accountId)
            };
          });
          self.cards(processedCards);
        })
        .catch(function (error) {
          console.error('Error loading cards:', error);
          self.errorMessage('Failed to load cards: ' + error.message);
        })
        .finally(function () {
          self.loading(false);
        });
    };

    // Mask card number for display
    self.maskCardNumber = function (cardNumber) {
      if (!cardNumber) return '';
      var cleaned = ('' + cardNumber).replace(/\s/g, '');
      if (cleaned.length >= 4) {
        return '**** **** **** ' + cleaned.slice(-4);
      }
      return cardNumber;
    };

    // Load user accounts for linking
    self.loadAccounts = function () {
      var authHeader = self.getAuthToken();
      if (!authHeader) {
        return;
      }
      return fetch(self.apiBaseUrl + '/accounts/user', {
        method: 'GET',
        headers: { Authorization: authHeader, 'Content-Type': 'application/json' }
      })
        .then(function (r) {
          if (!r.ok) throw new Error('Failed to fetch accounts');
          return r.json();
        })
        .then(function (data) {
          var list = (data || []).map(function (acc) {
            return {
              id: String(acc.id),
              accountNumber: acc.accountNumber,
              accountType: acc.accountType
            };
          });
          self.accounts(list);
          self.accountOptions(
            list.map(function (acc) {
              return { value: acc.id, label: acc.accountType + ' - ' + acc.accountNumber };
            })
          );

          // ✅ Use ArrayDataProvider correctly
          self.accountDataProvider(
            new ArrayDataProvider(self.accountOptions(), { keyAttributes: 'value' })
          );
        })
        .catch(function (err) {
          console.warn('Accounts fetch failed', err);
        });
    };

    // Show apply card dialog
    self.showApplyCardDialog = function () {
      self.selectedCardType('');
      self.selectedAccountId('');
      self.loadAccounts().then(function () {
        if (!self.accountOptions() || self.accountOptions().length === 0) {
          alert('No accounts found. Please open an account first.');
          return;
        }
        var dlg = document.getElementById('applyCardDialog');
        if (dlg && typeof dlg.open === 'function') {
          dlg.open();
        }
      });
    };

    // Close apply card dialog
    self.closeApplyDialog = function () {
      var dlg = document.getElementById('applyCardDialog');
      if (dlg && typeof dlg.close === 'function') {
        dlg.close();
      }
    };

    // Apply for new card
    self.applyForCard = function () {
      var cardType = self.selectedCardType();
      var accountId = self.selectedAccountId();
      var accountNumber = (self.selectedAccountNumber() || '').trim();

      if (!cardType) {
        alert('Please select a card type');
        return;
      }

      if (!accountId && !accountNumber) {
        alert('Please enter your account number to link this card');
        return;
      }

      self.loading(true);
      var authHeader = self.getAuthToken();

      if (!authHeader) {
        alert('Please login to apply for a card');
        self.loading(false);
        return;
      }

      var requestBody = new URLSearchParams();
      requestBody.append('cardType', cardType);

      if (accountId) {
        requestBody.append('accountId', accountId);
      } else if (accountNumber) {
        // Resolve account number to id first
        return fetch(self.apiBaseUrl + '/accounts/' + encodeURIComponent(accountNumber), {
          method: 'GET',
          headers: { Authorization: authHeader, 'Content-Type': 'application/json' }
        })
          .then(function (resp) {
            if (!resp.ok) throw new Error('Account not found');
            return resp.json();
          })
          .then(function (acc) {
            const id = acc && (acc.id || acc.accountId);
            if (!id) throw new Error('Invalid account response');
            requestBody.append('accountId', id);
            return fetch(self.apiBaseUrl + '/cards/create', {
              method: 'POST',
              headers: {
                Authorization: authHeader,
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              body: requestBody
            });
          })
          .then(function (response) {
            if (!response.ok) {
              throw new Error('Failed to create card: ' + response.statusText);
            }
            return response.json();
          })
          .then(function () {
            alert('Card created successfully!');
            self.closeApplyDialog();
            self.loadUserCards();
          })
          .catch(function (err) {
            console.error('Card creation failed:', err);
            alert('Card creation failed: ' + err.message);
          })
          .finally(function () {
            self.loading(false);
          });
      }

      fetch(self.apiBaseUrl + '/cards/create', {
        method: 'POST',
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: requestBody
      })
        .then(function (response) {
          if (!response.ok) {
            throw new Error('Failed to create card: ' + response.statusText);
          }
          return response.json();
        })
        .then(function () {
          alert('Card created successfully!');
          self.closeApplyDialog();
          self.loadUserCards(); // Refresh the cards list
        })
        .catch(function (error) {
          console.error('Error creating card:', error);
          alert('Failed to create card: ' + error.message);
        })
        .finally(function () {
          self.loading(false);
        });
    };

    // View card details
    self.viewCardDetails = function (event) {
      var cardId = event.currentTarget.getAttribute('data-card-id');
      var card = self.cards().find(function (c) {
        return c.id == cardId;
      });
      if (card) {
        self.selectedCard(card);
        var dlg = document.getElementById('cardDetailsDialog');
        if (dlg && typeof dlg.open === 'function') {
          dlg.open();
        }
      }
    };

    // Close details dialog
    self.closeDetailsDialog = function () {
      var dlg = document.getElementById('cardDetailsDialog');
      if (dlg && typeof dlg.close === 'function') {
        dlg.close();
      }
      self.selectedCard(null);
    };

    // Toggle card status
    self.toggleCardStatus = function (event) {
      var cardId = event.currentTarget.getAttribute('data-card-id');
      var card = self.cards().find(function (c) {
        return c.id == cardId;
      });

      if (!card) return;

      var newStatus = card.status() === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      var confirmMessage = 'Are you sure you want to ' + newStatus.toLowerCase() + ' this card?';

      if (!confirm(confirmMessage)) {
        return;
      }

      self.loading(true);
      var authHeader = self.getAuthToken();

      fetch(self.apiBaseUrl + '/cards/' + cardId + '/status?status=' + newStatus, {
        method: 'PUT',
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/json'
        }
      })
        .then(function (response) {
          if (!response.ok) {
            throw new Error('Failed to update card status: ' + response.statusText);
          }
          return response.json();
        })
        .then(function () {
          card.status(newStatus);
          alert('Card ' + newStatus.toLowerCase() + 'd successfully!');
        })
        .catch(function (error) {
          console.error('Error updating card status:', error);
          alert('Failed to update card status: ' + error.message);
        })
        .finally(function () {
          self.loading(false);
        });
    };

    // Delete card
    self.deleteCard = function (event) {
      var cardId = event.currentTarget.getAttribute('data-card-id');
      if (!cardId) return;
      if (!confirm('Are you sure you want to delete this card?')) return;

      self.loading(true);
      var authHeader = self.getAuthToken();

      fetch(self.apiBaseUrl + '/cards/' + cardId, {
        method: 'DELETE',
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/json'
        }
      })
        .then(function (response) {
          if (!response.ok) {
            throw new Error('Failed to delete card: ' + response.statusText);
          }
          return response.json();
        })
        .then(function () {
          // Remove from list
          self.cards(
            self.cards().filter(function (c) {
              return String(c.id) !== String(cardId);
            })
          );
          alert('Card deleted successfully');
        })
        .catch(function (error) {
          console.error('Delete card error:', error);
          alert('Failed to delete card: ' + error.message);
        })
        .finally(function () {
          self.loading(false);
        });
    };

    this.connected = function () {
      accUtils.announce('Cards page loaded.', 'assertive');
      document.title = 'My Cards';
      self.loadUserCards();
    };

    this.disconnected = function () {};
    this.transitionCompleted = function () {};

    // Navigate back to dashboard
    self.goBackToDashboard = function () {
      if (self.router) {
        self.router.go({ path: 'dashboard' });
      } else if (window && window.location) {
        // Fallback
        const url = new URL(window.location.href);
        url.searchParams.set('ojr', 'dashboard');
        url.hash = '';
        window.location.href = url.toString();
      }
    };
  }

  return CardViewModel;
});
