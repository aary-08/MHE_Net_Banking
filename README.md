# 🏦 Net Banking Application

A comprehensive, full-stack net banking application built with **Spring Boot** backend and **OJET** frontend, featuring user management, account management, card management, and secure fund transfers.

## ✨ Features

- **🔐 Secure Authentication**: JWT-based authentication with Spring Security
- **👤 User Management**: User registration, login, and profile management
- **🏦 Account Management**: Create and manage different types of accounts (Savings, Current, Fixed Deposit)
- **💳 Card Management**: Debit and credit card creation and management
- **💸 Fund Transfer**: Secure fund transfers between accounts with real-time validation
- **📊 Transaction History**: Comprehensive transaction tracking and reporting
- **🎨 Modern UI**: Beautiful, responsive OJET frontend with Bootstrap
- **🔒 Security**: Password encryption, JWT tokens, and secure API endpoints

## 🏗️ Architecture

```
net-banking-app/
├── backend/                 # Spring Boot Backend
│   ├── src/main/java/
│   │   └── com/netbanking/
│   │       ├── controller/  # REST API Controllers
│   │       ├── service/     # Business Logic Services
│   │       ├── repository/  # Data Access Layer
│   │       ├── entity/      # JPA Entities
│   │       ├── dto/         # Data Transfer Objects
│   │       └── security/    # Security Configuration
│   └── src/main/resources/
│       └── application.properties
├── frontend/                # OJET Frontend
│   ├── src/
│   │   ├── components/      # OJET Components
│   │   ├── contexts/        # OJET Contexts
│   │   └── ...
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- **Java 17** or higher
- **MySQL 8.0** or higher
- **Node.js 16.0** or higher
- **Maven 3.6** or higher

### 1. Database Setup

1. **Start MySQL server**
2. **Create database**:
   ```sql
   CREATE DATABASE netbanking;
   ```
3. **Update credentials** in `backend/src/main/resources/application.properties` if needed

### 2. Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Build and run**:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

   The backend will start on `http://localhost:8080`

### 3. Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm start
   ```

   The frontend will open at `http://localhost:3000`

## 📱 Demo Credentials

For testing purposes, you can:
1. **Register a new account** with any valid information
2. **Login** with your credentials
3. **Create accounts and cards** to test the functionality
4. **Transfer funds** between accounts (dummy money)

## 🔧 Configuration

### Backend Configuration

Key properties in `backend/src/main/resources/application.properties`:

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/netbanking
spring.datasource.username=root
spring.datasource.password=Ananth.2003

# JWT
jwt.secret=netbankingsecretkey2024
jwt.expiration=86400000

# Server
server.port=8080
```

### Frontend Configuration

The frontend is configured to proxy API requests to `http://localhost:8080` (set in `package.json`).

## 🛠️ API Endpoints

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
- `PUT /api/cards/{cardId}/status` - Update card status
- `DELETE /api/cards/{cardId}` - Delete card

### Transactions
- `POST /api/transactions/transfer` - Transfer funds
- `GET /api/transactions/account/{accountId}` - Get account transactions
- `GET /api/transactions/outgoing/{accountId}` - Get outgoing transactions
- `GET /api/transactions/incoming/{accountId}` - Get incoming transactions

## 🎨 Frontend Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Beautiful gradients, animations, and Bootstrap components
- **Real-time Updates**: Live data updates and notifications
- **Form Validation**: Comprehensive client-side and server-side validation
- **Toast Notifications**: User-friendly feedback messages
- **Protected Routes**: Secure navigation with authentication

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Encryption**: BCrypt password hashing
- **CORS Configuration**: Cross-origin resource sharing setup
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Protection**: JPA/Hibernate protection
- **XSS Protection**: Content Security Policy headers

## 📊 Database Schema

The application automatically creates these tables:

- **users**: User information and credentials
- **accounts**: Account details and balances
- **cards**: Card information and status
- **transactions**: Transaction records and history

## 🧪 Testing

### Backend Testing
```bash
cd backend
mvn test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 🚀 Deployment

### Backend Deployment
1. Build the JAR file: `mvn clean package`
2. Deploy the JAR to your server
3. Configure environment variables
4. Run: `java -jar net-banking-backend-1.0.0.jar`

### Frontend Deployment
1. Build the app: `npm run build`
2. Deploy the `build` folder to your web server
3. Configure the backend API URL

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection**
   - Ensure MySQL is running
   - Verify credentials in `application.properties`
   - Check database exists: `netbanking`

2. **Port Conflicts**
   - Backend: Change `server.port` in `application.properties`
   - Frontend: Change port in `package.json` scripts

3. **JWT Issues**
   - Verify `jwt.secret` is set in `application.properties`
   - Check token expiration settings

4. **CORS Issues**
   - Backend CORS is configured for `http://localhost:3000`
   - Update CORS configuration for production

### Performance Tips

- Use connection pooling for database connections
- Implement caching for frequently accessed data
- Optimize JPA queries with proper indexing
- Use OJET.memo for expensive components
- Implement lazy loading for large datasets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add proper error handling and validation
5. Test thoroughly
6. Submit a pull request

## 📝 License

This project is created for educational and demonstration purposes.

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- OJET team for the amazing frontend library
- Bootstrap team for the responsive CSS framework
- All open-source contributors whose libraries made this possible

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Review the API documentation
3. Check the console logs for errors
4. Verify database connectivity

---

**Happy Banking! 🎉**
