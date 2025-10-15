# Net Banking Backend

A comprehensive Spring Boot backend application for a net banking system with user management, account management, card management, and fund transfer capabilities.

## Features

- **User Management**: User registration, authentication, and profile management
- **Account Management**: Create and manage different types of accounts (Savings, Current, Fixed Deposit)
- **Card Management**: Create and manage debit/credit cards
- **Fund Transfer**: Secure fund transfers between accounts
- **JWT Authentication**: Secure API endpoints with JWT tokens
- **Transaction History**: Track all financial transactions

## Technology Stack

- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Security** with JWT
- **Spring Data JPA**
- **MySQL Database**
- **Maven**

## Prerequisites

- Java 17 or higher
- MySQL 8.0 or higher
- Maven 3.6 or higher

## Database Setup

1. Create a MySQL database named `netbanking`
2. Update the database credentials in `src/main/resources/application.properties` if needed

## Running the Application

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd net-banking-app/backend
   ```

2. **Build the project**
   ```bash
   mvn clean install
   ```

3. **Run the application**
   ```bash
   mvn spring-boot:run
   ```

The application will start on `http://localhost:8080`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Accounts
- `POST /api/accounts/create` - Create new account
- `GET /api/accounts/user` - Get user accounts
- `GET /api/accounts/{accountNumber}` - Get account by number
- `DELETE /api/accounts/{accountId}` - Delete account

### Cards
- `POST /api/cards/create` - Create new card
- `GET /api/cards/user` - Get user cards
- `GET /api/cards/{cardNumber}` - Get card by number
- `PUT /api/cards/{cardId}/status` - Update card status
- `DELETE /api/cards/{cardId}` - Delete card

### Transactions
- `POST /api/transactions/transfer` - Transfer funds
- `GET /api/transactions/account/{accountId}` - Get account transactions
- `GET /api/transactions/outgoing/{accountId}` - Get outgoing transactions
- `GET /api/transactions/incoming/{accountId}` - Get incoming transactions
- `GET /api/transactions/{transactionId}` - Get transaction by ID

## Security

- JWT-based authentication
- Password encryption using BCrypt
- Role-based access control
- CORS configuration for frontend integration

## Database Schema

The application automatically creates the following tables:
- `users` - User information
- `accounts` - Account details
- `cards` - Card information
- `transactions` - Transaction records

## Testing

Run tests using:
```bash
mvn test
```

## Configuration

Key configuration properties in `application.properties`:
- Database connection details
- JWT secret and expiration
- Server port
- Logging levels

## Troubleshooting

1. **Database Connection Issues**: Ensure MySQL is running and credentials are correct
2. **Port Conflicts**: Change server.port in application.properties if 8080 is occupied
3. **JWT Issues**: Verify jwt.secret is properly set in application.properties
