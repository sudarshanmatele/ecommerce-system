import axios from "axios";

const API_URL = "http://localhost:8080/api/wishlist";

export const getAllWishlistItems = () => {
    return axios.get(API_URL);
};

export const getWishlistByCustomerId = (
    customerId
) => {
    return axios.get(
        `${API_URL}/customer/${customerId}`
    );
};

export const addToWishlist = (
    customerId,
    productId
) => {
    return axios.post(
        API_URL,
        null,
        {
            params: {
                customerId,
                productId
            }
        }
    );
};

export const removeWishlistItem = (
    wishlistId
) => {
    return axios.delete(
        `${API_URL}/${wishlistId}`
    );
};

export const moveWishlistToCart = (
    wishlistId,
    quantity
) => {
    return axios.post(
        `${API_URL}/${wishlistId}/move-to-cart`,
        null,
        {
            params: {
                quantity
            }
        }
    );
};