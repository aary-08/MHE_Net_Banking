
import java.io.*;
import java.net.*;
import java.util.*;
import java.util.concurrent.*;
import java.util.ArrayList;

class Account {
    private String accountType;
    private String accountNumber;
    private double balance;
    private String currency;
    private String status;
    private String id;
    
    public Account(String accountType, String accountNumber, double balance, String currency, String status) {
        this.accountType = accountType;
        this.accountNumber = accountNumber;
        this.balance = balance;
        this.currency = currency;
        this.status = status;
        this.id = "acc_" + System.currentTimeMillis() + "_" + (int)(Math.random() * 1000);
    }
    
    // Getters
    public String getAccountType() { return accountType; }
    public String getAccountNumber() { return accountNumber; }
    public double getBalance() { return balance; }
    public String getCurrency() { return currency; }
    public String getStatus() { return status; }
    public String getId() { return id; }
    
    // Setters
    public void setBalance(double balance) { this.balance = balance; }
    
    // Convert to JSON
    public String toJson() {
        return String.format(
            "{\"id\":\"%s\",\"accountType\":\"%s\",\"accountNumber\":\"%s\",\"balance\":%.2f,\"currency\":\"%s\",\"status\":\"%s\"}",
            id, accountType, accountNumber, balance, currency, status
        );
    }
}

class Card {
    private String cardType;
    private String cardNumber;
    private String accountId;
    private String status;
    private String id;
    private String expiryDate;
    
    public Card(String cardType, String accountId) {
        this.cardType = cardType;
        this.accountId = accountId;
        this.cardNumber = generateCardNumber();
        this.status = "ACTIVE";
        this.id = "card_" + System.currentTimeMillis() + "_" + (int)(Math.random() * 1000);
        this.expiryDate = generateExpiryDate();
    }
    
    // Getters
    public String getCardType() { return cardType; }
    public String getCardNumber() { return cardNumber; }
    public String getAccountId() { return accountId; }
    public String getStatus() { return status; }
    public String getId() { return id; }
    public String getExpiryDate() { return expiryDate; }
    
    // Convert to JSON
    public String toJson() {
        return String.format(
            "{\"id\":\"%s\",\"cardType\":\"%s\",\"cardNumber\":\"%s\",\"accountId\":\"%s\",\"status\":\"%s\",\"expiryDate\":\"%s\"}",
            id, cardType, cardNumber, accountId, status, expiryDate
        );
    }
    
    private String generateCardNumber() {
        return String.valueOf(4000000000000000L + (long)(Math.random() * 999999999999999L));
    }
    
    private String generateExpiryDate() {
        // Generate expiry date 3 years from now
        java.time.LocalDate now = java.time.LocalDate.now();
        java.time.LocalDate expiry = now.plusYears(3);
        return expiry.format(java.time.format.DateTimeFormatter.ofPattern("MM/yy"));
    }
}

class Transaction {
    private String id;
    private String accountId;
    private String type;
    private double amount;
    private String description;
    private String timestamp;
    private String status;
    
    public Transaction(String accountId, String type, double amount, String description) {
        this.accountId = accountId;
        this.type = type;
        this.amount = amount;
        this.description = description;
        this.id = "txn_" + System.currentTimeMillis() + "_" + (int)(Math.random() * 1000);
        this.timestamp = java.time.LocalDateTime.now().toString();
        this.status = "COMPLETED";
    }
    
    // Getters
    public String getId() { return id; }
    public String getAccountId() { return accountId; }
    public String getType() { return type; }
    public double getAmount() { return amount; }
    public String getDescription() { return description; }
    public String getTimestamp() { return timestamp; }
    public String getStatus() { return status; }
    
    // Convert to JSON
    public String toJson() {
        return String.format(
            "{\"id\":\"%s\",\"accountId\":\"%s\",\"type\":\"%s\",\"amount\":%.2f,\"description\":\"%s\",\"timestamp\":\"%s\",\"status\":\"%s\"}",
            id, accountId, type, amount, description, timestamp, status
        );
    }
}

public class SimpleServer {
    private static final int PORT = 8080;
    private static final Map<String, String> users = new ConcurrentHashMap<>();
    private static final Map<String, List<Account>> userAccounts = new ConcurrentHashMap<>();
    private static final Map<String, List<Card>> userCards = new ConcurrentHashMap<>();
    private static final Map<String, List<Transaction>> userTransactions = new ConcurrentHashMap<>();
    private static final String JWT_SECRET = "netbankingsecretkey2024";
    
    static {
        // Add some test users
        users.put("admin", "password123");
        users.put("user1", "password123");
        users.put("test", "test");
        
        // Add some test accounts
        addTestAccounts();
    }
    
    private static void addTestAccounts() {
        // Add accounts for admin user
        List<Account> adminAccounts = new ArrayList<>();
        Account adminSavings = new Account("SAVINGS", "1001", 5000.0, "USD", "ACTIVE");
        Account adminCurrent = new Account("CURRENT", "1002", 15000.0, "USD", "ACTIVE");
        adminAccounts.add(adminSavings);
        adminAccounts.add(adminCurrent);
        userAccounts.put("admin", adminAccounts);
        
        // Add accounts for user1
        List<Account> user1Accounts = new ArrayList<>();
        Account user1Savings = new Account("SAVINGS", "2001", 2500.0, "USD", "ACTIVE");
        user1Accounts.add(user1Savings);
        userAccounts.put("user1", user1Accounts);
        
        // Add sample transactions
        addSampleTransactions();
    }
    
    private static void addSampleTransactions() {
        // Sample transactions for admin
        List<Transaction> adminTransactions = new ArrayList<>();
        adminTransactions.add(new Transaction("acc_1001", "CREDIT", 5000.0, "Initial deposit"));
        adminTransactions.add(new Transaction("acc_1002", "CREDIT", 15000.0, "Initial deposit"));
        adminTransactions.add(new Transaction("acc_1001", "DEBIT", -150.0, "ATM withdrawal"));
        adminTransactions.add(new Transaction("acc_1002", "CREDIT", 2500.0, "Salary deposit"));
        userTransactions.put("admin", adminTransactions);
        
        // Sample transactions for user1
        List<Transaction> user1Transactions = new ArrayList<>();
        user1Transactions.add(new Transaction("acc_2001", "CREDIT", 2500.0, "Initial deposit"));
        user1Transactions.add(new Transaction("acc_2001", "DEBIT", -75.0, "Online purchase"));
        userTransactions.put("user1", user1Transactions);
    }
    
    public static void main(String[] args) {
        try (ServerSocket serverSocket = new ServerSocket(PORT)) {
            System.out.println("Simple Net Banking Server started on port " + PORT);
            System.out.println("Test users: admin/password123, user1/password123, test/test");
            
            while (true) {
                Socket clientSocket = serverSocket.accept();
                new Thread(() -> handleClient(clientSocket)).start();
            }
        } catch (IOException e) {
            System.err.println("Server error: " + e.getMessage());
        }
    }
    
    private static void handleClient(Socket clientSocket) {
        try (BufferedReader in = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));
             PrintWriter out = new PrintWriter(clientSocket.getOutputStream(), true)) {
            
            String requestLine = in.readLine();
            if (requestLine == null) return;
            
            String[] parts = requestLine.split(" ");
            String method = parts[0];
            String fullPath = parts[1];
            
            // Extract just the path part (remove query parameters)
            String path = fullPath.split("\\?")[0];
            
            // Debug logging
            System.out.println("Received request: " + method + " " + fullPath);
            System.out.println("Extracted path: " + path);
            
            // Read headers
            Map<String, String> headers = new HashMap<>();
            String line;
            while ((line = in.readLine()) != null && !line.isEmpty()) {
                if (line.contains(":")) {
                    String[] header = line.split(":", 2);
                    headers.put(header[0].trim().toLowerCase(), header[1].trim());
                }
            }
            
            // Read body if present
            StringBuilder body = new StringBuilder();
            if (headers.containsKey("content-length")) {
                int contentLength = Integer.parseInt(headers.get("content-length"));
                char[] buffer = new char[contentLength];
                in.read(buffer, 0, contentLength);
                body.append(buffer);
            }
            
            // Handle OPTIONS requests for CORS preflight
            if (method.equals("OPTIONS")) {
                sendCorsResponse(out);
                return;
            }
            
            // Handle requests
            System.out.println("Matching endpoint for: " + method + " " + path);
            
            if (method.equals("POST") && path.equals("/api/auth/login")) {
                System.out.println("Handling login request");
                handleLogin(out, body.toString());
            } else if (method.equals("POST") && path.equals("/api/auth/register")) {
                System.out.println("Handling register request");
                handleRegister(out, body.toString());
            } else if (method.equals("GET") && path.equals("/api/health")) {
                System.out.println("Handling health check");
                handleHealth(out);
            } else if (method.equals("GET") && (path.equals("/api/accounts") || path.equals("/api/accounts/user"))) {
                System.out.println("Handling get accounts request");
                handleGetAccounts(out, headers);
            } else if (method.equals("POST") && path.equals("/api/accounts/create")) {
                System.out.println("Handling create account request");
                handleCreateAccount(out, headers);
            } else if (method.equals("DELETE") && path.startsWith("/api/accounts/")) {
                String accountId = path.substring("/api/accounts/".length());
                System.out.println("Handling delete account request for ID: " + accountId);
                handleDeleteAccount(out, accountId, headers);
            } else if (method.equals("GET") && path.equals("/api/cards/user")) {
                System.out.println("Handling get cards request");
                handleGetCards(out, headers);
            } else if (method.equals("POST") && path.equals("/api/cards/create")) {
                System.out.println("Handling create card request");
                handleCreateCard(out, headers);
            } else if (method.equals("GET") && path.startsWith("/api/transactions/account/")) {
                String accountId = path.substring("/api/transactions/account/".length());
                System.out.println("Handling get transactions for account: " + accountId);
                handleGetTransactions(out, headers, accountId);
            } else if (method.equals("POST") && path.equals("/api/transactions/transfer")) {
                System.out.println("Handling fund transfer request");
                handleFundTransfer(out, headers, body.toString());
            } else {
                System.out.println("No matching endpoint found, returning 404");
                sendResponse(out, 404, "Not Found", "{\"error\":\"Endpoint not found\"}");
            }
            
        } catch (IOException e) {
            System.err.println("Error handling client: " + e.getMessage());
        } finally {
            try {
                clientSocket.close();
            } catch (IOException e) {
                System.err.println("Error closing client socket: " + e.getMessage());
            }
        }
    }
    
    private static void handleLogin(PrintWriter out, String body) {
        try {
            // Simple JSON parsing
            String username = extractValue(body, "username");
            String password = extractValue(body, "password");
            
            if (username == null || password == null) {
                sendResponse(out, 400, "Bad Request", "{\"error\":\"Username and password required\"}");
                return;
            }
            
            if (users.containsKey(username) && users.get(username).equals(password)) {
                // Generate simple token (not real JWT, just for demo)
                String token = "demo_token_" + username + "_" + System.currentTimeMillis();
                String response = String.format(
                    "{\"token\":\"%s\",\"type\":\"Bearer\",\"username\":\"%s\"}", 
                    token, username
                );
                sendResponse(out, 200, "OK", response);
                System.out.println("Login successful for user: " + username);
            } else {
                sendResponse(out, 401, "Unauthorized", "{\"error\":\"Invalid username or password\"}");
                System.out.println("Login failed for user: " + username);
            }
        } catch (Exception e) {
            sendResponse(out, 500, "Internal Server Error", "{\"error\":\"Server error\"}");
        }
    }
    
    private static void handleRegister(PrintWriter out, String body) {
        try {
            String username = extractValue(body, "username");
            String password = extractValue(body, "password");
            
            if (username == null || password == null) {
                sendResponse(out, 400, "Bad Request", "{\"error\":\"Username and password required\"}");
                return;
            }
            
            if (users.containsKey(username)) {
                sendResponse(out, 400, "Bad Request", "{\"error\":\"Username already exists\"}");
                return;
            }
            
            users.put(username, password);
            String response = String.format(
                "{\"message\":\"User registered successfully\",\"username\":\"%s\"}", 
                username
            );
            sendResponse(out, 200, "OK", response);
            System.out.println("User registered: " + username);
        } catch (Exception e) {
            sendResponse(out, 500, "Internal Server Error", "{\"error\":\"Server error\"}");
        }
    }
    
    private static void handleHealth(PrintWriter out) {
        sendResponse(out, 200, "OK", "{\"status\":\"UP\",\"service\":\"Net Banking API\"}");
    }
    
    private static void handleGetAccounts(PrintWriter out, Map<String, String> headers) {
        try {
            String username = extractUsernameFromToken(headers);
            if (username == null) {
                sendResponse(out, 401, "Unauthorized", "{\"error\":\"Invalid or missing token\"}");
                return;
            }
            
            List<Account> accounts = userAccounts.getOrDefault(username, new ArrayList<>());
            String accountsJson = "[" + accounts.stream()
                .map(Account::toJson)
                .collect(java.util.stream.Collectors.joining(",")) + "]";
            
            sendResponse(out, 200, "OK", accountsJson);
        } catch (Exception e) {
            sendResponse(out, 500, "Internal Server Error", "{\"error\":\"Server error\"}");
        }
    }
    
    private static void handleCreateAccount(PrintWriter out, Map<String, String> headers) {
        try {
            String username = extractUsernameFromToken(headers);
            if (username == null) {
                sendResponse(out, 401, "Unauthorized", "{\"error\":\"Invalid or missing token\"}");
                return;
            }
            
            // Generate new account number
            String accountNumber = generateAccountNumber();
            double initialBalance = 1000.0; // Add $1000 for demonstration purposes
            String currency = "USD";
            String status = "ACTIVE";
            
            Account newAccount = new Account("SAVINGS", accountNumber, initialBalance, currency, status);
            
            // Add to user's accounts
            userAccounts.computeIfAbsent(username, k -> new ArrayList<>()).add(newAccount);
            
            // Add initial transaction for the $1000 deposit
            Transaction initialTransaction = new Transaction(newAccount.getId(), "CREDIT", initialBalance, "Initial account opening deposit");
            userTransactions.computeIfAbsent(username, k -> new ArrayList<>()).add(initialTransaction);
            
            sendResponse(out, 200, "OK", newAccount.toJson());
            System.out.println("Account created for user: " + username + ", Account: " + accountNumber + " with balance: $" + initialBalance);
        } catch (Exception e) {
            sendResponse(out, 500, "Internal Server Error", "{\"error\":\"Server error\"}");
        }
    }
    
    private static void handleDeleteAccount(PrintWriter out, String accountId, Map<String, String> headers) {
        try {
            String username = extractUsernameFromToken(headers);
            if (username == null) {
                sendResponse(out, 401, "Unauthorized", "{\"error\":\"Invalid or missing token\"}");
                return;
            }
            
            List<Account> accounts = userAccounts.get(username);
            if (accounts == null) {
                sendResponse(out, 404, "Not Found", "{\"error\":\"No accounts found\"}");
                return;
            }
            
            boolean removed = accounts.removeIf(acc -> acc.getId().equals(accountId));
            if (removed) {
                sendResponse(out, 200, "OK", "{\"message\":\"Account deleted successfully\"}");
                System.out.println("Account deleted for user: " + username + ", Account ID: " + accountId);
            } else {
                sendResponse(out, 404, "Not Found", "{\"error\":\"Account not found\"}");
            }
        } catch (Exception e) {
            sendResponse(out, 500, "Internal Server Error", "{\"error\":\"Server error\"}");
        }
    }
    
    private static void handleGetCards(PrintWriter out, Map<String, String> headers) {
        try {
            String username = extractUsernameFromToken(headers);
            if (username == null) {
                sendResponse(out, 401, "Unauthorized", "{\"error\":\"Invalid or missing token\"}");
                return;
            }
            
            List<Card> cards = userCards.getOrDefault(username, new ArrayList<>());
            String cardsJson = "[" + cards.stream()
                .map(Card::toJson)
                .collect(java.util.stream.Collectors.joining(",")) + "]";
            
            sendResponse(out, 200, "OK", cardsJson);
        } catch (Exception e) {
            sendResponse(out, 500, "Internal Server Error", "{\"error\":\"Server error\"}");
        }
    }
    
    private static void handleCreateCard(PrintWriter out, Map<String, String> headers) {
        try {
            String username = extractUsernameFromToken(headers);
            if (username == null) {
                sendResponse(out, 401, "Unauthorized", "{\"error\":\"Invalid or missing token\"}");
                return;
            }
            
            // For now, create a DEBIT card (you can extract cardType from query params later)
            String cardType = "DEBIT"; // Default to DEBIT
            String accountId = "default"; // Default account ID
            
            Card newCard = new Card(cardType, accountId);
            
            // Add to user's cards
            userCards.computeIfAbsent(username, k -> new ArrayList<>()).add(newCard);
            
            sendResponse(out, 200, "OK", newCard.toJson());
            System.out.println("Card created for user: " + username + ", Card: " + newCard.getCardNumber());
        } catch (Exception e) {
            sendResponse(out, 500, "Internal Server Error", "{\"error\":\"Server error\"}");
        }
    }
    
    private static void handleGetTransactions(PrintWriter out, Map<String, String> headers, String accountId) {
        try {
            String username = extractUsernameFromToken(headers);
            if (username == null) {
                sendResponse(out, 401, "Unauthorized", "{\"error\":\"Invalid or missing token\"}");
                return;
            }
            
            List<Transaction> transactions = userTransactions.getOrDefault(username, new ArrayList<>());
            
            // Filter transactions by account ID if provided
            if (accountId != null && !accountId.isEmpty()) {
                transactions = transactions.stream()
                    .filter(txn -> txn.getAccountId().equals(accountId))
                    .collect(java.util.stream.Collectors.toList());
            }
            
            String transactionsJson = "[" + transactions.stream()
                .map(Transaction::toJson)
                .collect(java.util.stream.Collectors.joining(",")) + "]";
            
            sendResponse(out, 200, "OK", transactionsJson);
        } catch (Exception e) {
            sendResponse(out, 500, "Internal Server Error", "{\"error\":\"Server error\"}");
        }
    }
    
    private static void handleFundTransfer(PrintWriter out, Map<String, String> headers, String body) {
        try {
            String username = extractUsernameFromToken(headers);
            if (username == null) {
                sendResponse(out, 401, "Unauthorized", "{\"error\":\"Invalid or missing token\"}");
                return;
            }
            
            // Debug logging
            System.out.println("Fund transfer request body: " + body);
            
            // Parse transfer request body - frontend sends account numbers, not IDs
            String fromAccountNumber = extractValue(body, "fromAccountNumber");
            String toAccountNumber = extractValue(body, "toAccountNumber");
            String amountStr = extractValue(body, "amount");
            String description = extractValue(body, "description");
            
            System.out.println("Parsed values - fromAccountNumber: " + fromAccountNumber + ", toAccountNumber: " + toAccountNumber + ", amount: " + amountStr);
            
            if (fromAccountNumber == null || toAccountNumber == null || amountStr == null) {
                sendResponse(out, 400, "Bad Request", "{\"error\":\"Missing required fields: fromAccountNumber, toAccountNumber, amount. Received: " + body + "\"}");
                return;
            }
            
            double amount;
            try {
                amount = Double.parseDouble(amountStr);
            } catch (NumberFormatException e) {
                sendResponse(out, 400, "Bad Request", "{\"error\":\"Invalid amount format\"}");
                return;
            }
            
            if (amount <= 0) {
                sendResponse(out, 400, "Bad Request", "{\"error\":\"Amount must be greater than 0\"}");
                return;
            }
            
            // Get user's accounts
            List<Account> userAccountList = userAccounts.get(username);
            if (userAccountList == null) {
                sendResponse(out, 404, "Not Found", "{\"error\":\"No accounts found\"}");
                return;
            }
            
            // Find source account by account number
            Account sourceAccount = null;
            for (Account acc : userAccountList) {
                if (acc.getAccountNumber().equals(fromAccountNumber)) {
                    sourceAccount = acc;
                    break;
                }
            }
                
            if (sourceAccount == null) {
                sendResponse(out, 404, "Not Found", "{\"error\":\"Source account not found\"}");
                return;
            }
            
            // Check if source account has sufficient balance
            if (sourceAccount.getBalance() < amount) {
                sendResponse(out, 400, "Bad Request", "{\"error\":\"Insufficient balance\"}");
                return;
            }
            
            // Find destination account by account number (could be same user or different user)
            Account destAccount = null;
            String destUsername = username; // Default to same user
            
            // First check if it's the same user's account
            for (Account acc : userAccountList) {
                if (acc.getAccountNumber().equals(toAccountNumber)) {
                    destAccount = acc;
                    break;
                }
            }
            
            // If not found in same user, check other users (for demo purposes)
            if (destAccount == null) {
                for (Map.Entry<String, List<Account>> entry : userAccounts.entrySet()) {
                    if (!entry.getKey().equals(username)) {
                        for (Account acc : entry.getValue()) {
                            if (acc.getAccountNumber().equals(toAccountNumber)) {
                                destAccount = acc;
                                destUsername = entry.getKey();
                                break;
                            }
                        }
                        if (destAccount != null) break;
                    }
                }
            }
            
            if (destAccount == null) {
                sendResponse(out, 404, "Not Found", "{\"error\":\"Destination account not found\"}");
                return;
            }
            
            // Perform the transfer
            sourceAccount.setBalance(sourceAccount.getBalance() - amount);
            destAccount.setBalance(destAccount.getBalance() + amount);
            
            // Create transaction records
            Transaction debitTransaction = new Transaction(sourceAccount.getId(), "DEBIT", -amount, 
                "Transfer to " + destAccount.getAccountNumber() + " - " + (description != null ? description : ""));
            Transaction creditTransaction = new Transaction(destAccount.getId(), "CREDIT", amount, 
                "Transfer from " + sourceAccount.getAccountNumber() + " - " + (description != null ? description : ""));
            
            // Add transactions to both users
            userTransactions.computeIfAbsent(username, k -> new ArrayList<>()).add(debitTransaction);
            userTransactions.computeIfAbsent(destUsername, k -> new ArrayList<>()).add(creditTransaction);
            
            // Create response
            String response = String.format(
                "{\"message\":\"Transfer successful\",\"transactionId\":\"%s\",\"amount\":%.2f,\"fromAccount\":\"%s\",\"toAccount\":\"%s\"}",
                debitTransaction.getId(), amount, sourceAccount.getAccountNumber(), destAccount.getAccountNumber()
            );
            
            sendResponse(out, 200, "OK", response);
            System.out.println("Fund transfer completed: $" + amount + " from " + sourceAccount.getAccountNumber() + " to " + destAccount.getAccountNumber());
            
        } catch (Exception e) {
            System.err.println("Error in fund transfer: " + e.getMessage());
            sendResponse(out, 500, "Internal Server Error", "{\"error\":\"Server error during transfer\"}");
        }
    }
    
    private static String generateAccountNumber() {
        return String.valueOf(1000000 + (int)(Math.random() * 9000000));
    }
    
    private static String extractUsernameFromToken(Map<String, String> headers) {
        String authHeader = headers.get("authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return null;
        }
        
        String token = authHeader.substring(7);
        // Simple token parsing - extract username from demo_token_username_timestamp
        if (token.startsWith("demo_token_")) {
            String[] parts = token.split("_");
            if (parts.length >= 3) {
                return parts[2];
            }
        }
        return null;
    }
    
    private static String extractValue(String json, String key) {
        // Try to extract quoted string value first
        String pattern = "\"" + key + "\"\\s*:\\s*\"([^\"]+)\"";
        java.util.regex.Pattern p = java.util.regex.Pattern.compile(pattern);
        java.util.regex.Matcher m = p.matcher(json);
        if (m.find()) {
            return m.group(1);
        }
        
        // Try to extract unquoted string value
        pattern = "\"" + key + "\"\\s*:\\s*([^,\\}\\s]+)";
        p = java.util.regex.Pattern.compile(pattern);
        m = p.matcher(json);
        if (m.find()) {
            return m.group(1);
        }
        
        // Try to extract numeric value
        pattern = "\"" + key + "\"\\s*:\\s*([0-9]+(?:\\.[0-9]+)?)";
        p = java.util.regex.Pattern.compile(pattern);
        m = p.matcher(json);
        if (m.find()) {
            return m.group(1);
        }
        
        return null;
    }
    
    private static void sendCorsResponse(PrintWriter out) {
        out.println("HTTP/1.1 200 OK");
        out.println("Access-Control-Allow-Origin: http://localhost:3000");
        out.println("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
        out.println("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
        out.println("Access-Control-Allow-Credentials: true");
        out.println("Content-Length: 0");
        out.println();
    }
    
    private static void sendResponse(PrintWriter out, int status, String statusText, String body) {
        out.println("HTTP/1.1 " + status + " " + statusText);
        out.println("Content-Type: application/json");
        out.println("Access-Control-Allow-Origin: http://localhost:3000");
        out.println("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
        out.println("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
        out.println("Access-Control-Allow-Credentials: true");
        out.println("Content-Length: " + body.length());
        out.println();
        out.println(body);
    }
}
