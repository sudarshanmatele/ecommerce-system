import axios from "axios";

const API_URL = "http://localhost:8080/api/reviews";

// Get all reviews
export const getAllReviews = () => {
    return axios.get(API_URL);
};

// Get review by ID
export const getReviewById = (reviewId) => {
    return axios.get(
        `${API_URL}/${reviewId}`
    );
};

// Get all reviews for a product
export const getProductReviews = (productId) => {
    return axios.get(
        `${API_URL}/product/${productId}`
    );
};

// Get approved reviews for a product
export const getApprovedProductReviews = (productId) => {
    return axios.get(
        `${API_URL}/product/${productId}/approved`
    );
};

// Get reviews by customer
export const getCustomerReviews = (customerId) => {
    return axios.get(
        `${API_URL}/customer/${customerId}`
    );
};

// Add review
export const addReview = (
    productId,
    customerId,
    rating,
    reviewText
) => {

    return axios.post(
        API_URL,
        null,
        {
            params: {
                productId,
                customerId,
                rating,
                reviewText
            }
        }
    );

};

// Update review
export const updateReview = (
    reviewId,
    rating,
    reviewText
) => {

    return axios.put(
        `${API_URL}/${reviewId}`,
        null,
        {
            params: {
                rating,
                reviewText
            }
        }
    );

};

// Approve / Reject review
export const moderateReview = (
    reviewId,
    status
) => {

    return axios.put(
        `${API_URL}/${reviewId}/moderate`,
        null,
        {
            params: {
                status
            }
        }
    );

};

// Delete review
export const deleteReview = (
    reviewId
) => {

    return axios.delete(
        `${API_URL}/${reviewId}`
    );

};