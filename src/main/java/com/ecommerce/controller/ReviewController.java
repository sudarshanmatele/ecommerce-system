package com.ecommerce.controller;

import com.ecommerce.entity.Review;
import com.ecommerce.service.ReviewService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "http://localhost:5173")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(
            ReviewService reviewService
    ) {
        this.reviewService = reviewService;
    }


    // ============================================================
    // ADD REVIEW
    // ============================================================

    @PostMapping
    public ResponseEntity<Review> addReview(

            @RequestParam Integer productId,

            @RequestParam Integer customerId,

            @RequestParam Integer rating,

            @RequestParam String reviewText

    ) {

        Review review = reviewService.addReview(
                productId,
                customerId,
                rating,
                reviewText
        );

        return ResponseEntity.ok(review);
    }


    // ============================================================
    // GET ALL REVIEWS
    // ============================================================

    @GetMapping
    public ResponseEntity<List<Review>> getAllReviews() {

        return ResponseEntity.ok(
                reviewService.getAllReviews()
        );
    }


    // ============================================================
    // GET REVIEW BY ID
    // ============================================================

    @GetMapping("/{reviewId}")
    public ResponseEntity<Review> getReviewById(
            @PathVariable Integer reviewId
    ) {

        return ResponseEntity.ok(
                reviewService.getReviewById(
                        reviewId
                )
        );
    }


    // ============================================================
    // GET ALL REVIEWS FOR PRODUCT
    // ============================================================

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Review>> getProductReviews(
            @PathVariable Integer productId
    ) {

        return ResponseEntity.ok(
                reviewService.getProductReviews(
                        productId
                )
        );
    }


    // ============================================================
    // GET APPROVED REVIEWS FOR PRODUCT
    // ============================================================

    @GetMapping("/product/{productId}/approved")
    public ResponseEntity<List<Review>> getApprovedProductReviews(
            @PathVariable Integer productId
    ) {

        return ResponseEntity.ok(
                reviewService.getApprovedProductReviews(
                        productId
                )
        );
    }


    // ============================================================
    // GET CUSTOMER REVIEWS
    // ============================================================

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Review>> getCustomerReviews(
            @PathVariable Integer customerId
    ) {

        return ResponseEntity.ok(
                reviewService.getCustomerReviews(
                        customerId
                )
        );
    }


    // ============================================================
    // UPDATE REVIEW
    // ============================================================

    @PutMapping("/{reviewId}")
    public ResponseEntity<Review> updateReview(

            @PathVariable Integer reviewId,

            @RequestParam Integer rating,

            @RequestParam String reviewText

    ) {

        Review review = reviewService.updateReview(
                reviewId,
                rating,
                reviewText
        );

        return ResponseEntity.ok(review);
    }


    // ============================================================
    // MODERATE REVIEW
    // ============================================================

    @PutMapping("/{reviewId}/moderate")
    public ResponseEntity<Review> moderateReview(

            @PathVariable Integer reviewId,

            @RequestParam Boolean status

    ) {

        Review review = reviewService.moderateReview(
                reviewId,
                status
        );

        return ResponseEntity.ok(review);
    }


    // ============================================================
    // DELETE REVIEW
    // ============================================================

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<String> deleteReview(

            @PathVariable Integer reviewId

    ) {

        reviewService.deleteReview(
                reviewId
        );

        return ResponseEntity.ok(
                "Review deleted successfully"
        );
    }

}