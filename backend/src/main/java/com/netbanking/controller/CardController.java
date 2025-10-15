package com.netbanking.controller;

import com.netbanking.entity.Card;
import com.netbanking.service.CardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.netbanking.security.UserPrincipal;
@RestController
@RequestMapping("/api/cards")
@CrossOrigin(origins = "*")
public class CardController {
    
    @Autowired
    private CardService cardService;
    
    @PostMapping("/create")
    public ResponseEntity<?> createCard(@RequestParam String cardType, @RequestParam(required = false) Long accountId) {
        try {
            // Get current user ID from security context
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
            Long userId = principal.getId();
            
            Card card = cardService.createCard(userId, cardType, accountId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Card created successfully");
            response.put("cardNumber", card.getCardNumber());
            response.put("cardType", card.getCardType());
            response.put("cardHolderName", card.getCardHolderName());
            response.put("expiryDate", card.getExpiryDate());
            response.put("status", card.getStatus());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/user")
    public ResponseEntity<?> getUserCards() {
        try {
            // Get current user ID from security context
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
            Long userId = principal.getId();
            
            List<Card> cards = cardService.getUserCards(userId);
            
            return ResponseEntity.ok(cards);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/{cardNumber}")
    public ResponseEntity<?> getCardByNumber(@PathVariable String cardNumber) {
        try {
            Card card = cardService.getCardByNumber(cardNumber)
                    .orElseThrow(() -> new RuntimeException("Card not found"));
            
            return ResponseEntity.ok(card);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PutMapping("/{cardId}/status")
    public ResponseEntity<?> updateCardStatus(@PathVariable Long cardId, @RequestParam String status) {
        try {
            Card card = cardService.updateCardStatus(cardId, status);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Card status updated successfully");
            response.put("cardNumber", card.getCardNumber());
            response.put("status", card.getStatus());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @DeleteMapping("/{cardId}")
    public ResponseEntity<?> deleteCard(@PathVariable Long cardId) {
        try {
            cardService.deleteCard(cardId);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Card deleted successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
