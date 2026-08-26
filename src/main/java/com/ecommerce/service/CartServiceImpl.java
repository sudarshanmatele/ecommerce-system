package com.ecommerce.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;

import com.ecommerce.entity.Cart;
import com.ecommerce.entity.Product;
import com.ecommerce.repository.CartRepository;
import com.ecommerce.repository.ProductRepository;

@Service
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;

    public CartServiceImpl(
            CartRepository cartRepository,
            ProductRepository productRepository) {

        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
    }

    @Override
    public Cart addToCart(
            Integer customerId,
            Integer productId,
            Integer quantity) {

        if (quantity == null || quantity <= 0) {
            throw new RuntimeException(
                    "Quantity must be greater than 0"
            );
        }

        Product product = productRepository
                .findById(productId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Product not found with ID: "
                                        + productId
                        )
                );

        if (product.getInventoryCount() < quantity) {
            throw new RuntimeException(
                    "Insufficient product stock"
            );
        }

        Cart cart = cartRepository
                .findByCustomerIdAndProductId(
                        customerId,
                        productId
                )
                .orElse(null);

        if (cart != null) {

            int newQuantity =
                    cart.getQuantity() + quantity;

            if (product.getInventoryCount() < newQuantity) {
                throw new RuntimeException(
                        "Insufficient product stock"
                );
            }

            cart.setQuantity(newQuantity);

            cart.setTotalPrice(
                    product.getPrice()
                            .multiply(
                                    BigDecimal.valueOf(
                                            newQuantity
                                    )
                            )
            );

        } else {

            cart = new Cart();

            cart.setCustomerId(customerId);
            cart.setProductId(productId);
            cart.setQuantity(quantity);

            cart.setTotalPrice(
                    product.getPrice()
                            .multiply(
                                    BigDecimal.valueOf(quantity)
                            )
            );
        }

        return cartRepository.save(cart);
    }

    @Override
    public List<Cart> getAllCartItems() {

        return cartRepository.findAll();
    }

    @Override
    public List<Cart> getCartByCustomerId(
            Integer customerId) {

        return cartRepository.findByCustomerId(
                customerId
        );
    }

    @Override
    public Cart updateCartQuantity(
            Integer cartId,
            Integer quantity) {

        if (quantity == null || quantity <= 0) {
            throw new RuntimeException(
                    "Quantity must be greater than 0"
            );
        }

        Cart cart = cartRepository
                .findById(cartId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Cart item not found with ID: "
                                        + cartId
                        )
                );

        Product product = productRepository
                .findById(cart.getProductId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Product not found"
                        )
                );

        if (product.getInventoryCount() < quantity) {
            throw new RuntimeException(
                    "Insufficient product stock"
            );
        }

        cart.setQuantity(quantity);

        cart.setTotalPrice(
                product.getPrice()
                        .multiply(
                                BigDecimal.valueOf(quantity)
                        )
        );

        return cartRepository.save(cart);
    }

    @Override
    public void removeCartItem(Integer cartId) {

        Cart cart = cartRepository
                .findById(cartId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Cart item not found with ID: "
                                        + cartId
                        )
                );

        cartRepository.delete(cart);
    }
}