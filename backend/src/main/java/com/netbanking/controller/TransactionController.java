package com.netbanking.controller;

import com.netbanking.dto.FundTransferDto;
import com.netbanking.entity.Transaction;
import com.netbanking.dto.TransactionViewDto;
import com.netbanking.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "*")
public class TransactionController {
    
    @Autowired
    private TransactionService transactionService;
    
    @PostMapping("/transfer")
    public ResponseEntity<?> transferFunds(@Valid @RequestBody FundTransferDto transferDto) {
        try {
            Transaction transaction = transactionService.transferFunds(transferDto);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Fund transfer completed successfully");
            response.put("transactionReference", transaction.getTransactionReference());
            response.put("amount", transaction.getAmount());
            response.put("status", transaction.getStatus());
            response.put("fromAccount", transaction.getFromAccount().getAccountNumber());
            response.put("toAccount", transaction.getToAccount().getAccountNumber());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/account/{accountId}")
    public ResponseEntity<?> getAccountTransactions(@PathVariable Long accountId) {
        try {
            List<Transaction> transactions = transactionService.getAccountTransactions(accountId);
            // Map to lightweight DTO with explicit fields
            List<TransactionViewDto> result = transactions.stream().map(t -> {
                TransactionViewDto dto = new TransactionViewDto();
                dto.setId(t.getId());
                dto.setTransactionReference(t.getTransactionReference());
                dto.setAmount(t.getAmount());
                dto.setTransactionType(t.getTransactionType());
                dto.setStatus(t.getStatus());
                dto.setDescription(t.getDescription());
                if (t.getTransactionDate() != null) {
                    dto.setTransactionDateEpoch(java.sql.Timestamp.valueOf(t.getTransactionDate()).getTime());
                }
                if (t.getFromAccount() != null) {
                    dto.setFromAccountNumber(t.getFromAccount().getAccountNumber());
                }
                if (t.getToAccount() != null) {
                    dto.setToAccountNumber(t.getToAccount().getAccountNumber());
                }
                return dto;
            }).toList();
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/outgoing/{accountId}")
    public ResponseEntity<?> getOutgoingTransactions(@PathVariable Long accountId) {
        try {
            List<Transaction> transactions = transactionService.getOutgoingTransactions(accountId);
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/incoming/{accountId}")
    public ResponseEntity<?> getIncomingTransactions(@PathVariable Long accountId) {
        try {
            List<Transaction> transactions = transactionService.getIncomingTransactions(accountId);
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/{transactionId}")
    public ResponseEntity<?> getTransactionById(@PathVariable Long transactionId) {
        try {
            Transaction transaction = transactionService.getTransactionById(transactionId)
                    .orElseThrow(() -> new RuntimeException("Transaction not found"));
            
            return ResponseEntity.ok(transaction);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
