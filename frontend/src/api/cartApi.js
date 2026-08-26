import axios from "axios";

const API_URL = "http://localhost:8080/api/cart";

export const getAllCartItems = () => {
    return axios.get(API_URL);
};

export const getCartByCustomerId = (customerId) => {
    return axios.get(
        `${API_URL}/customer/${customerId}`
    );
};

export const addToCart = (
    customerId,
    productId,
    quantity
) => {
    return axios.post(API_URL, null, {
        params: {
            customerId,
            productId,
            quantity
        }
    });
};

export const updateCartQuantity = (
    cartId,
    quantity
) => {
    return axios.put(
        `${API_URL}/${cartId}`,
        null,
        {
            params: {
                quantity
            }
        }
    );
};

export const removeCartItem = (cartId) => {
    return axios.delete(
        `${API_URL}/${cartId}`
    );
};