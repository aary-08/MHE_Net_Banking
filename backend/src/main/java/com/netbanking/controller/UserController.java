package com.netbanking.controller;

import com.netbanking.dto.UserRegistrationDto;
import com.netbanking.entity.User;
import com.netbanking.security.UserPrincipal;
import com.netbanking.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();

            User user = userService.findById(principal.getId())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Map<String, Object> dto = new HashMap<>();
            dto.put("id", user.getId());
            dto.put("username", user.getUsername());
            dto.put("firstName", user.getFirstName());
            dto.put("lastName", user.getLastName());
            dto.put("email", user.getEmail());
            dto.put("phoneNumber", user.getPhoneNumber());
            dto.put("address", user.getAddress());
            dto.put("status", "ACTIVE");
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateCurrentUser(@RequestBody UserRegistrationDto updateDto) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();

            User updated = userService.updateUser(principal.getId(), updateDto);

            Map<String, Object> dto = new HashMap<>();
            dto.put("id", updated.getId());
            dto.put("username", updated.getUsername());
            dto.put("firstName", updated.getFirstName());
            dto.put("lastName", updated.getLastName());
            dto.put("email", updated.getEmail());
            dto.put("phoneNumber", updated.getPhoneNumber());
            dto.put("address", updated.getAddress());
            dto.put("status", "ACTIVE");
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}


