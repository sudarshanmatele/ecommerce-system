package com.ecommerce.service;

import com.ecommerce.entity.Product;
import com.ecommerce.entity.User;
import com.ecommerce.entity.Wishlist;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.repository.WishlistRepository;
import com.ecommerce.service.CartService;
import com.ecommerce.service.WishlistService;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WishlistServiceImpl
        implements WishlistService {

    private final WishlistRepository wishlistRepository;

    private final UserRepository userRepository;

    private final ProductRepository productRepository;

    private final CartService cartService;


    public WishlistServiceImpl(
            WishlistRepository wishlistRepository,
            UserRepository userRepository,
            ProductRepository productRepository,
            CartService cartService
    ) {

        this.wishlistRepository =
                wishlistRepository;

        this.userRepository =
                userRepository;

        this.productRepository =
                productRepository;

        this.cartService =
                cartService;

    }


    @Override
    public Wishlist addToWishlist(
            Integer customerId,
            Integer productId
    ) {

        if (
                wishlistRepository
                        .findByCustomer_UserIdAndProduct_ProductId(
                                customerId,
                                productId
                        )
                        .isPresent()
        ) {

            throw new RuntimeException(
                    "Product already exists in wishlist"
            );

        }


        User customer =
                userRepository
                        .findById(customerId)
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "Customer not found"
                                        )
                        );


        Product product =
                productRepository
                        .findById(productId)
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "Product not found"
                                        )
                        );


        Wishlist wishlist =
                new Wishlist();

        wishlist.setCustomer(customer);

        wishlist.setProduct(product);


        return wishlistRepository.save(
                wishlist
        );

    }


    @Override
    public List<Wishlist>
    getAllWishlistItems() {

        return wishlistRepository.findAll();

    }


    @Override
    public List<Wishlist>
    getWishlistByCustomer(
            Integer customerId
    ) {

        return wishlistRepository
                .findByCustomer_UserId(
                        customerId
                );

    }


    @Override
    public void removeWishlistItem(
            Integer wishlistId
    ) {

        Wishlist wishlist =
                wishlistRepository
                        .findById(wishlistId)
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "Wishlist item not found"
                                        )
                        );


        wishlistRepository.delete(
                wishlist
        );

    }


    @Override
    public void moveToCart(
            Integer wishlistId,
            Integer quantity
    ) {

        Wishlist wishlist =
                wishlistRepository
                        .findById(wishlistId)
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "Wishlist item not found"
                                        )
                        );


        if (
                quantity == null ||
                quantity <= 0
        ) {

            throw new RuntimeException(
                    "Quantity must be greater than 0"
            );

        }


        cartService.addToCart(
                wishlist
                        .getCustomer()
                        .getUserId(),

                wishlist
                        .getProduct()
                        .getProductId(),

                quantity
        );


        wishlistRepository.delete(
                wishlist
        );

    }

}