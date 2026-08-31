package com.ecommerce.repository;

import com.ecommerce.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Integer> {

    List<Review> findByProduct_ProductId(Integer productId);

    List<Review> findByProduct_ProductIdAndStatus(
            Integer productId,
            Boolean status
    );

    List<Review> findByCustomer_UserId(Integer customerId);

    boolean existsByProduct_ProductIdAndCustomer_UserId(
            Integer productId,
            Integer customerId
    );

    List<Review> findByStatus(Boolean status);
}