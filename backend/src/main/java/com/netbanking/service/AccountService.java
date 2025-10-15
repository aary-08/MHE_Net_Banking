package com.netbanking.service;

import com.netbanking.entity.Account;
import com.netbanking.entity.User;
import com.netbanking.repository.AccountRepository;
import com.netbanking.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
public class AccountService {
    
    @Autowired
    private AccountRepository accountRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public Account createAccount(Long userId, String accountType) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Generate unique account number
        String accountNumber = generateAccountNumber();
        
        // Create account with initial balance
        Account account = new Account();
        account.setAccountNumber(accountNumber);
        account.setAccountType(accountType);
        account.setBalance(new BigDecimal("1000.00")); // Initial balance
        account.setUser(user);
        
        return accountRepository.save(account);
    }
    
    public List<Account> getUserAccounts(Long userId) {
        return accountRepository.findByUserId(userId);
    }
    
    public Optional<Account> getAccountByNumber(String accountNumber) {
        return accountRepository.findByAccountNumber(accountNumber);
    }
    
    public Account updateBalance(String accountNumber, BigDecimal newBalance) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        
        account.setBalance(newBalance);
        return accountRepository.save(account);
    }
    
    public void deleteAccount(Long accountId) {
        accountRepository.deleteById(accountId);
    }
    
    private String generateAccountNumber() {
        Random random = new Random();
        StringBuilder accountNumber = new StringBuilder();
        
        // Generate 12-digit account number
        for (int i = 0; i < 12; i++) {
            accountNumber.append(random.nextInt(10));
        }
        
        // Check if account number already exists
        while (accountRepository.existsByAccountNumber(accountNumber.toString())) {
            accountNumber = new StringBuilder();
            for (int i = 0; i < 12; i++) {
                accountNumber.append(random.nextInt(10));
            }
        }
        
        return accountNumber.toString();
    }
}
