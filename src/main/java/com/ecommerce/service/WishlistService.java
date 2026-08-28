package com.ecommerce.service;

import com.ecommerce.entity.Wishlist;

import java.util.List;

public interface WishlistService {

    Wishlist addToWishlist(
            Integer customerId,
            Integer productId
    );

    List<Wishlist> getAllWishlistItems();

    List<Wishlist> getWishlistByCustomer(
            Integer customerId
    );

    void removeWishlistItem(
            Integer wishlistId
    );

    void moveToCart(
            Integer wishlistId,
            Integer quantity
    );

}