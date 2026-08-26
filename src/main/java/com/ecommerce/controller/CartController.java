package com.ecommerce.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ecommerce.entity.Cart;
import com.ecommerce.service.CartService;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:5174")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    // Add product to cart
    @PostMapping
    public ResponseEntity<Cart> addToCart(
            @RequestParam Integer customerId,
            @RequestParam Integer productId,
            @RequestParam Integer quantity) {

        Cart cart = cartService.addToCart(
                customerId,
                productId,
                quantity
        );

        return new ResponseEntity<>(
                cart,
                HttpStatus.CREATED
        );
    }

    // Get all cart items
    @GetMapping
    public ResponseEntity<List<Cart>> getAllCartItems() {

        return ResponseEntity.ok(
                cartService.getAllCartItems()
        );
    }

    // Get cart by customer ID
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Cart>> getCartByCustomerId(
            @PathVariable Integer customerId) {

        return ResponseEntity.ok(
                cartService.getCartByCustomerId(
                        customerId
                )
        );
    }

    // Update cart quantity
    @PutMapping("/{cartId}")
    public ResponseEntity<Cart> updateCartQuantity(
            @PathVariable Integer cartId,
            @RequestParam Integer quantity) {

        return ResponseEntity.ok(
                cartService.updateCartQuantity(
                        cartId,
                        quantity
                )
        );
    }

    // Remove item from cart
    @DeleteMapping("/{cartId}")
    public ResponseEntity<String> removeCartItem(
            @PathVariable Integer cartId) {

        cartService.removeCartItem(cartId);

        return ResponseEntity.ok(
                "Cart item removed successfully"
        );
    }
}