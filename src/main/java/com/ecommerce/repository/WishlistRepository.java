package com.ecommerce.repository;

import com.ecommerce.entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WishlistRepository
        extends JpaRepository<Wishlist, Integer> {

    List<Wishlist> findByCustomer_UserId(
            Integer customerId
    );

    Optional<Wishlist>
    findByCustomer_UserIdAndProduct_ProductId(
            Integer customerId,
            Integer productId
    );

}