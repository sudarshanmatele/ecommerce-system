package com.ecommerce.service;

import java.util.List;

import com.ecommerce.entity.Cart;

public interface CartService {

    Cart addToCart(
            Integer customerId,
            Integer productId,
            Integer quantity
    );

    List<Cart> getAllCartItems();

    List<Cart> getCartByCustomerId(Integer customerId);

    Cart updateCartQuantity(
            Integer cartId,
            Integer quantity
    );

    void removeCartItem(Integer cartId);

}