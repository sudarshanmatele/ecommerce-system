import axios from "axios";

const API_URL = "http://localhost:8080/api/payments";

export const getPayments = () => {
    return axios.get(API_URL);
};

export const getPaymentById = (paymentId) => {
    return axios.get(`${API_URL}/${paymentId}`);
};

export const getPaymentsByStatus = (paymentStatus) => {
    return axios.get(
        `${API_URL}/status/${paymentStatus}`
    );
};

export const getPaymentsByOrderId = (orderId) => {
    return axios.get(
        `${API_URL}/order/${orderId}`
    );
};

export const createPayment = (paymentData) => {
    return axios.post(API_URL, paymentData);
};

export const updatePaymentStatus = (
    paymentId,
    paymentStatus
) => {
    return axios.put(
        `${API_URL}/${paymentId}/status`,
        null,
        {
            params: {
                paymentStatus
            }
        }
    );
};

export const refundPayment = (paymentId) => {
    return axios.put(
        `${API_URL}/${paymentId}/refund`
    );
};