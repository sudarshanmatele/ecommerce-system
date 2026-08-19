package com.ecommerce.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ecommerce.entity.User;
import com.ecommerce.service.UserService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5174")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Create customer
    @PostMapping
    public ResponseEntity<User> createUser(
            @RequestBody User user) {

        User createdUser = userService.createUser(user);

        return new ResponseEntity<>(
                createdUser,
                HttpStatus.CREATED
        );
    }

    // Get all customers
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {

        return ResponseEntity.ok(
                userService.getAllUsers()
        );
    }

    // Get customer by ID
    @GetMapping("/{userId}")
    public ResponseEntity<User> getUserById(
            @PathVariable Integer userId) {

        return ResponseEntity.ok(
                userService.getUserById(userId)
        );
    }

    // Update customer
    @PutMapping("/{userId}")
    public ResponseEntity<User> updateUser(
            @PathVariable Integer userId,
            @RequestBody User user) {

        return ResponseEntity.ok(
                userService.updateUser(userId, user)
        );
    }

    // Deactivate customer
    @PutMapping("/{userId}/deactivate")
    public ResponseEntity<User> deactivateUser(
            @PathVariable Integer userId) {

        return ResponseEntity.ok(
                userService.deactivateUser(userId)
        );
    }
}