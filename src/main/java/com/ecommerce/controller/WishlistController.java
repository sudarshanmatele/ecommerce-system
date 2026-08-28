package com.ecommerce.controller;

import com.ecommerce.entity.Wishlist;
import com.ecommerce.service.WishlistService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@CrossOrigin(origins = "http://localhost:5173")
public class WishlistController {

    private final WishlistService wishlistService;


    public WishlistController(
            WishlistService wishlistService
    ) {

        this.wishlistService =
                wishlistService;

    }


    @PostMapping
    public ResponseEntity<Wishlist>
    addToWishlist(

            @RequestParam
            Integer customerId,

            @RequestParam
            Integer productId
    ) {

        return ResponseEntity.ok(

                wishlistService.addToWishlist(
                        customerId,
                        productId
                )

        );

    }


    @GetMapping
    public ResponseEntity<List<Wishlist>>
    getAllWishlistItems() {

        return ResponseEntity.ok(

                wishlistService
                        .getAllWishlistItems()

        );

    }


    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Wishlist>>
    getWishlistByCustomer(

            @PathVariable
            Integer customerId
    ) {

        return ResponseEntity.ok(

                wishlistService
                        .getWishlistByCustomer(
                                customerId
                        )

        );

    }


    @DeleteMapping("/{wishlistId}")
    public ResponseEntity<String>
    removeWishlistItem(

            @PathVariable
            Integer wishlistId
    ) {

        wishlistService.removeWishlistItem(
                wishlistId
        );

        return ResponseEntity.ok(
                "Wishlist item removed successfully"
        );

    }


    @PostMapping("/{wishlistId}/move-to-cart")
    public ResponseEntity<String>
    moveToCart(

            @PathVariable
            Integer wishlistId,

            @RequestParam
            Integer quantity
    ) {

        wishlistService.moveToCart(
                wishlistId,
                quantity
        );

        return ResponseEntity.ok(
                "Product moved to cart successfully"
        );

    }

}