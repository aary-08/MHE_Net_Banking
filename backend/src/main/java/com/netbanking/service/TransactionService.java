package com.netbanking.service;

import com.netbanking.dto.FundTransferDto;
import com.netbanking.entity.Account;
import com.netbanking.entity.Transaction;
import com.netbanking.repository.AccountRepository;
import com.netbanking.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
public class TransactionService {
    
    @Autowired
    private TransactionRepository transactionRepository;
    
    @Autowired
    private AccountRepository accountRepository;
    
    @Transactional
    public Transaction transferFunds(FundTransferDto transferDto) {
        // Get source account
        Account fromAccount = accountRepository.findByAccountNumber(transferDto.getFromAccountNumber())
                .orElseThrow(() -> new RuntimeException("Source account not found"));
        
        // Get destination account
        Account toAccount = accountRepository.findByAccountNumber(transferDto.getToAccountNumber())
                .orElseThrow(() -> new RuntimeException("Destination account not found"));
        
        // Check if source account has sufficient balance
        if (fromAccount.getBalance().compareTo(transferDto.getAmount()) < 0) {
            throw new RuntimeException("Insufficient balance");
        }
        
        // Check if accounts are different
        if (fromAccount.getId().equals(toAccount.getId())) {
            throw new RuntimeException("Cannot transfer to same account");
        }
        
        // Generate transaction reference
        String transactionRef = generateTransactionReference();
        
        // Create transaction
        Transaction transaction = new Transaction();
        transaction.setTransactionReference(transactionRef);
        transaction.setAmount(transferDto.getAmount());
        transaction.setTransactionType("TRANSFER");
        transaction.setStatus("COMPLETED");
        transaction.setDescription(transferDto.getDescription());
        transaction.setFromAccount(fromAccount);
        transaction.setToAccount(toAccount);
        
        // Update account balances
        fromAccount.setBalance(fromAccount.getBalance().subtract(transferDto.getAmount()));
        toAccount.setBalance(toAccount.getBalance().add(transferDto.getAmount()));
        
        // Save accounts
        accountRepository.save(fromAccount);
        accountRepository.save(toAccount);
        
        // Save transaction
        return transactionRepository.save(transaction);
    }
    
    public List<Transaction> getAccountTransactions(Long accountId) {
        return transactionRepository.findByFromAccountIdOrToAccountId(accountId, accountId);
    }
    
    public List<Transaction> getOutgoingTransactions(Long accountId) {
        return transactionRepository.findByFromAccountId(accountId);
    }
    
    public List<Transaction> getIncomingTransactions(Long accountId) {
        return transactionRepository.findByToAccountId(accountId);
    }
    
    public Optional<Transaction> getTransactionById(Long transactionId) {
        return transactionRepository.findById(transactionId);
    }
    
    private String generateTransactionReference() {
        Random random = new Random();
        StringBuilder ref = new StringBuilder("TXN");
        
        // Add timestamp
        ref.append(System.currentTimeMillis());
        
        // Add random 4-digit number
        ref.append(String.format("%04d", random.nextInt(10000)));
        
        return ref.toString();
    }
}
