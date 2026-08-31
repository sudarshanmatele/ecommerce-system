package com.ecommerce.service;

import com.ecommerce.entity.Review;

import java.util.List;

public interface ReviewService {

    Review addReview(
            Integer productId,
            Integer customerId,
            Integer rating,
            String reviewText
    );

    List<Review> getAllReviews();

    List<Review> getProductReviews(
            Integer productId
    );

    List<Review> getApprovedProductReviews(
            Integer productId
    );

    List<Review> getCustomerReviews(
            Integer customerId
    );

    Review getReviewById(
            Integer reviewId
    );

    Review updateReview(
            Integer reviewId,
            Integer rating,
            String reviewText
    );

    Review moderateReview(
            Integer reviewId,
            Boolean status
    );

    void deleteReview(
            Integer reviewId
    );
}