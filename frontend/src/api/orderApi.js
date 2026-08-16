import axios from "axios";

const API_URL = "http://localhost:8080/api/orders";

export const getOrders = () => {
    return axios.get(API_URL);
};

export const getOrderById = (orderId) => {
    return axios.get(`${API_URL}/${orderId}`);
};

export const getOrdersByStatus = (orderStatus) => {
    return axios.get(
        `${API_URL}/status/${orderStatus}`
    );
};

export const getOrdersByCustomer = (customerId) => {
    return axios.get(
        `${API_URL}/customer/${customerId}`
    );
};

export const createOrder = (order) => {
    return axios.post(API_URL, order);
};

export const updateOrderStatus = (
    orderId,
    orderStatus
) => {
    return axios.put(
        `${API_URL}/${orderId}/status`,
        null,
        {
            params: {
                orderStatus
            }
        }
    );
};

export const cancelOrder = (orderId) => {
    return axios.put(
        `${API_URL}/${orderId}/cancel`
    );
};