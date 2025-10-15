package com.netbanking.service;

import com.netbanking.entity.Card;
import com.netbanking.entity.User;
import com.netbanking.entity.Account;
import com.netbanking.repository.CardRepository;
import com.netbanking.repository.UserRepository;
import com.netbanking.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
public class CardService {
    
    @Autowired
    private CardRepository cardRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private AccountRepository accountRepository;
    
    public Card createCard(Long userId, String cardType, Long accountId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Account account = null;
        if (accountId != null) {
            account = accountRepository.findById(accountId)
                    .orElseThrow(() -> new RuntimeException("Account not found"));
        }
        
        // Generate unique card number
        String cardNumber = generateCardNumber();
        
        // Generate CVV
        String cvv = generateCVV();
        
        // Set expiry date (5 years from now)
        LocalDate expiryDate = LocalDate.now().plusYears(5);
        
        // Create card
        Card card = new Card();
        card.setCardNumber(cardNumber);
        card.setCardType(cardType);
        card.setCardHolderName(user.getFirstName() + " " + user.getLastName());
        card.setExpiryDate(expiryDate);
        card.setCvv(cvv);
        card.setUser(user);
        card.setLinkedAccount(account);
        
        return cardRepository.save(card);
    }
    
    public List<Card> getUserCards(Long userId) {
        return cardRepository.findByUserId(userId);
    }
    
    public Optional<Card> getCardByNumber(String cardNumber) {
        return cardRepository.findByCardNumber(cardNumber);
    }
    
    public Card updateCardStatus(Long cardId, String status) {
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new RuntimeException("Card not found"));
        
        card.setStatus(status);
        return cardRepository.save(card);
    }
    
    public void deleteCard(Long cardId) {
        cardRepository.deleteById(cardId);
    }
    
    private String generateCardNumber() {
        Random random = new Random();
        StringBuilder cardNumber = new StringBuilder();
        
        // Generate 16-digit card number
        for (int i = 0; i < 16; i++) {
            cardNumber.append(random.nextInt(10));
        }
        
        // Check if card number already exists
        while (cardRepository.existsByCardNumber(cardNumber.toString())) {
            cardNumber = new StringBuilder();
            for (int i = 0; i < 16; i++) {
                cardNumber.append(random.nextInt(10));
            }
        }
        
        return cardNumber.toString();
    }
    
    private String generateCVV() {
        Random random = new Random();
        return String.format("%03d", random.nextInt(1000));
    }
}
