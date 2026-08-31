package com.ecommerce.service;

import com.ecommerce.entity.Product;
import com.ecommerce.entity.Review;
import com.ecommerce.entity.User;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.ReviewRepository;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.service.ReviewService;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public ReviewServiceImpl(
            ReviewRepository reviewRepository,
            ProductRepository productRepository,
            UserRepository userRepository
    ) {
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }


    // ============================================================
    // ADD REVIEW
    // ============================================================

    @Override
    public Review addReview(
            Integer productId,
            Integer customerId,
            Integer rating,
            String reviewText
    ) {

        if (rating == null || rating < 1 || rating > 5) {
            throw new RuntimeException(
                    "Rating must be between 1 and 5"
            );
        }

        if (reviewRepository
                .existsByProduct_ProductIdAndCustomer_UserId(
                        productId,
                        customerId
                )) {

            throw new RuntimeException(
                    "Customer has already reviewed this product"
            );
        }

        Product product = productRepository
                .findById(productId)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Product not found with ID: "
                                        + productId
                        )
                );

        User customer = userRepository
                .findById(customerId)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Customer not found with ID: "
                                        + customerId
                        )
                );

        Review review = new Review();

        review.setProduct(product);
        review.setCustomer(customer);
        review.setRating(rating);
        review.setReviewText(reviewText);

        // New reviews require admin approval
        review.setStatus(false);

        return reviewRepository.save(review);
    }


    // ============================================================
    // GET ALL REVIEWS
    // ============================================================

    @Override
    public List<Review> getAllReviews() {

        return reviewRepository.findAll();

    }


    // ============================================================
    // GET PRODUCT REVIEWS
    // ============================================================

    @Override
    public List<Review> getProductReviews(
            Integer productId
    ) {

        return reviewRepository
                .findByProduct_ProductId(productId);

    }


    // ============================================================
    // GET APPROVED PRODUCT REVIEWS
    // ============================================================

    @Override
    public List<Review> getApprovedProductReviews(
            Integer productId
    ) {

        return reviewRepository
                .findByProduct_ProductIdAndStatus(
                        productId,
                        true
                );

    }


    // ============================================================
    // GET CUSTOMER REVIEWS
    // ============================================================

    @Override
    public List<Review> getCustomerReviews(
            Integer customerId
    ) {

        return reviewRepository
                .findByCustomer_UserId(customerId);

    }


    // ============================================================
    // GET REVIEW BY ID
    // ============================================================

    @Override
    public Review getReviewById(
            Integer reviewId
    ) {

        return reviewRepository
                .findById(reviewId)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Review not found with ID: "
                                        + reviewId
                        )
                );

    }


    // ============================================================
    // UPDATE REVIEW
    // ============================================================

    @Override
    public Review updateReview(
            Integer reviewId,
            Integer rating,
            String reviewText
    ) {

        if (rating == null || rating < 1 || rating > 5) {
            throw new RuntimeException(
                    "Rating must be between 1 and 5"
            );
        }

        Review review = reviewRepository
                .findById(reviewId)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Review not found with ID: "
                                        + reviewId
                        )
                );

        review.setRating(rating);
        review.setReviewText(reviewText);

        // Updated review requires moderation again
        review.setStatus(false);

        return reviewRepository.save(review);
    }


    // ============================================================
    // MODERATE REVIEW
    // ============================================================

    @Override
    public Review moderateReview(
            Integer reviewId,
            Boolean status
    ) {

        Review review = reviewRepository
                .findById(reviewId)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Review not found with ID: "
                                        + reviewId
                        )
                );

        review.setStatus(status);

        return reviewRepository.save(review);
    }


    // ============================================================
    // DELETE REVIEW
    // ============================================================

    @Override
    public void deleteReview(
            Integer reviewId
    ) {

        Review review = reviewRepository
                .findById(reviewId)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Review not found with ID: "
                                        + reviewId
                        )
                );

        reviewRepository.delete(review);

    }

}