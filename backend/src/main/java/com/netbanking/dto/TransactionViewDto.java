package com.netbanking.dto;

import java.math.BigDecimal;

public class TransactionViewDto {
    private Long id;
    private String transactionReference;
    private BigDecimal amount;
    private String transactionType;
    private String status;
    private String description;
    // Epoch milliseconds for robust frontend parsing
    private Long transactionDateEpoch;
    private String fromAccountNumber;
    private String toAccountNumber;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTransactionReference() { return transactionReference; }
    public void setTransactionReference(String transactionReference) { this.transactionReference = transactionReference; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getTransactionType() { return transactionType; }
    public void setTransactionType(String transactionType) { this.transactionType = transactionType; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Long getTransactionDateEpoch() { return transactionDateEpoch; }
    public void setTransactionDateEpoch(Long transactionDateEpoch) { this.transactionDateEpoch = transactionDateEpoch; }

    public String getFromAccountNumber() { return fromAccountNumber; }
    public void setFromAccountNumber(String fromAccountNumber) { this.fromAccountNumber = fromAccountNumber; }

    public String getToAccountNumber() { return toAccountNumber; }
    public void setToAccountNumber(String toAccountNumber) { this.toAccountNumber = toAccountNumber; }
}


