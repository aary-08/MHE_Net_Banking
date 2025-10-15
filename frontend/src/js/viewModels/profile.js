
define(['../accUtils', 'knockout'],
  function (accUtils, ko) {
    function ProfileViewModel(params) {
      var self = this;
      self.router = params && params.parentRouter ? params.parentRouter : null;

      // Profile data observables
      self.username = ko.observable('');
      self.firstName = ko.observable('');
      self.lastName = ko.observable('');
      self.email = ko.observable('');
      self.phoneNumber = ko.observable('');
      self.address = ko.observable('');
      self.dateOfBirth = ko.observable('');
      self.accountStatus = ko.observable('ACTIVE');
      self.memberSince = ko.observable('');
      self.lastLogin = ko.observable('');

      // Form data for editing
      self.formData = {
        firstName: ko.observable(''),
        lastName: ko.observable(''),
        email: ko.observable(''),
        phoneNumber: ko.observable(''),
        address: ko.observable(''),
        dateOfBirth: ko.observable('')
      };

      // UI state observables
      self.loading = ko.observable(false);
      self.editing = ko.observable(false);
      self.saving = ko.observable(false);
      self.errorMessage = ko.observable('');
      self.successMessage = ko.observable('');

      // JWT headers helper
      const headers = function () {
        const token = localStorage.getItem('jwt_token');
        const type = localStorage.getItem('token_type') || 'Bearer';
        return token ? { 'Authorization': `${type} ${token}`, 'Content-Type': 'application/json' } : null;
      };

      // Load profile data
      self.loadProfile = function () {
        const h = headers();
        if (!h) { 
          self.errorMessage('You are not logged in.'); 
          return; 
        }
        
        self.loading(true);
        self.errorMessage('');
        
        // Try /api/users/me first, fallback to /api/auth/me
        fetch('http://localhost:8080/api/users/me', { method: 'GET', headers: h })
          .then(async r => {
            if (!r.ok) {
              const alt = await fetch('http://localhost:8080/api/auth/me', { method: 'GET', headers: h });
              if (!alt.ok) throw new Error('Failed to load profile');
              return alt.json();
            }
            return r.json();
          })
          .then(user => {
            // Update profile data
            self.username(user.username || '');
            self.firstName(user.firstName || '');
            self.lastName(user.lastName || '');
            self.email(user.email || '');
            self.phoneNumber(user.phoneNumber || '');
            self.address(user.address || '');
            self.dateOfBirth(user.dateOfBirth || '');
            self.accountStatus(user.accountStatus || user.status || 'ACTIVE');
            self.memberSince(user.memberSince || '');
            self.lastLogin(user.lastLogin || '');

            // Update form data
            self.formData.firstName(user.firstName || '');
            self.formData.lastName(user.lastName || '');
            self.formData.email(user.email || '');
            self.formData.phoneNumber(user.phoneNumber || '');
            self.formData.address(user.address || '');
            self.formData.dateOfBirth(user.dateOfBirth || '');
          })
          .catch(err => {
            console.error('Profile load error:', err);
            self.errorMessage(err.message || 'Failed to load profile');
          })
          .finally(() => self.loading(false));
      };

      // Handle form field changes
      self.handleChange = function (field, value) {
        self.formData[field](value);
      };

      // Toggle edit mode
      self.toggleEdit = function () {
        self.editing(!self.editing());
        self.errorMessage('');
        self.successMessage('');
        
        if (!self.editing()) {
          // Reset form data to original values
          self.formData.firstName(self.firstName());
          self.formData.lastName(self.lastName());
          self.formData.email(self.email());
          self.formData.phoneNumber(self.phoneNumber());
          self.formData.address(self.address());
          self.formData.dateOfBirth(self.dateOfBirth());
        }
      };

      // Save profile changes
      self.saveProfile = function () {
        const h = headers();
        if (!h) { 
          self.errorMessage('You are not logged in.'); 
          return; 
        }

        self.saving(true);
        self.errorMessage('');
        self.successMessage('');

        const payload = {
          firstName: self.formData.firstName(),
          lastName: self.formData.lastName(),
          email: self.formData.email(),
          phoneNumber: self.formData.phoneNumber(),
          address: self.formData.address(),
          dateOfBirth: self.formData.dateOfBirth()
        };

        fetch('http://localhost:8080/api/users/me', { 
          method: 'PUT', 
          headers: h, 
          body: JSON.stringify(payload) 
        })
          .then(async r => {
            const data = await r.json().catch(() => ({}));
            if (!r.ok) {
              throw new Error(data.error || data.message || 'Save failed');
            }
            return data;
          })
          .then(() => {
            // Update profile data with form data
            self.firstName(self.formData.firstName());
            self.lastName(self.formData.lastName());
            self.email(self.formData.email());
            self.phoneNumber(self.formData.phoneNumber());
            self.address(self.formData.address());
            self.dateOfBirth(self.formData.dateOfBirth());
            
            self.editing(false);
            self.successMessage('Profile updated successfully!');
          })
          .catch(err => {
            console.error('Profile save error:', err);
            self.errorMessage(err.message || 'Failed to update profile');
          })
          .finally(() => self.saving(false));
      };

      // Format date for display
      self.formatDate = function (dateString) {
        if (!dateString) return 'N/A';
        try {
          return new Date(dateString).toLocaleDateString();
        } catch (e) {
          return dateString;
        }
      };

      // Format datetime for display
      self.formatDateTime = function (dateString) {
        if (!dateString) return 'N/A';
        try {
          return new Date(dateString).toLocaleString();
        } catch (e) {
          return dateString;
        }
      };

      // Back to dashboard
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

      // Page connected
      this.connected = function () {
        accUtils.announce('Profile page loaded.', 'assertive');
        document.title = 'My Profile';
        self.loadProfile();
      };
    }

    return ProfileViewModel;
  }
);
