package com.ecommerce.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ecommerce.entity.Cart;

@Repository
public interface CartRepository extends JpaRepository<Cart, Integer> {

    List<Cart> findByCustomerId(Integer customerId);

    Optional<Cart> findByCustomerIdAndProductId(
            Integer customerId,
            Integer productId
    );
}