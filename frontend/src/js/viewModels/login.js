define(['ojs/ojcore', 'knockout', 'ojs/ojbutton', 'ojs/ojformlayout', 'ojs/ojinputtext'],
    function (oj, ko) {
        function LoginViewModel(params) {
            var self = this;

            self.router = params && params.parentRouter ? params.parentRouter : null;


            self.username = ko.observable('');
            self.password = ko.observable('');

            self.handleLogin = function () {
                var username = self.username();
                var password = self.password();

                if (!username || !password) {
                    alert('Please enter both username and password.');
                    return;
                }

                console.log('Username:', username);
                console.log('Password:', password);

                var apiUrl = 'http://localhost:8080/api/auth/login';

                // Prepare payload
                var payload = {
                    username: username,
                    password: password
                };

                // Call login API
                fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Login failed: ' + response.statusText);
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log('Login successful:', data);
                        if (!data.token || !data.type) {
                            throw new Error("Missing token or type in login response.");
                        }
                        
                        localStorage.setItem('jwt_token', data.token);
                        localStorage.setItem('token_type', data.type);
                        localStorage.setItem('username', data.username);

                        alert('Login successful!');
                        if (self.router) {
                            self.router.go({ path: 'dashboard' });
                        }

                    })
                    .catch(error => {
                        console.error('Login error:', error);
                        alert('Login failed: ' + error.message);
                    });
            };

            self.goToRegester = function () {
                if (self.router) {
                    self.router.go({ path: 'register' });
                }
            };
        }

        return LoginViewModel;
    });
