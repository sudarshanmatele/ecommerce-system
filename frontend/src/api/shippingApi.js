import axios from "axios";

const API_URL = "http://localhost:8080/api/shipping";

// Get all shipping records
export const getAllShipping = () => {
    return axios.get(API_URL);
};

// Get shipping by ID
export const getShippingById = (shippingId) => {
    return axios.get(
        `${API_URL}/${shippingId}`
    );
};

// Get shipping by order ID
export const getShippingByOrderId = (orderId) => {
    return axios.get(
        `${API_URL}/order/${orderId}`
    );
};

// Track shipment
export const trackShipment = (trackingNumber) => {
    return axios.get(
        `${API_URL}/track/${trackingNumber}`
    );
};

// Get shipping by status
export const getShippingByStatus = (shippingStatus) => {
    return axios.get(
        `${API_URL}/status/${shippingStatus}`
    );
};

// Create shipping
export const createShipping = (
    orderId,
    courierService,
    trackingNumber,
    shippingStatus,
    shippingCost
) => {

    return axios.post(
        API_URL,
        null,
        {
            params: {
                orderId,
                courierService,
                trackingNumber,
                shippingStatus,
                shippingCost
            }
        }
    );
};

// Update shipping
export const updateShipping = (
    shippingId,
    courierService,
    trackingNumber,
    shippingStatus,
    shippingCost
) => {

    return axios.put(
        `${API_URL}/${shippingId}`,
        null,
        {
            params: {
                courierService,
                trackingNumber,
                shippingStatus,
                shippingCost
            }
        }
    );
};

// Delete shipping
export const deleteShipping = (shippingId) => {
    return axios.delete(
        `${API_URL}/${shippingId}`
    );
};