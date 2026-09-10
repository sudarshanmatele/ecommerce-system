import axios from "axios";

const API_URL = "http://localhost:8080/api/coupons";

export const getAllCoupons = () => axios.get(API_URL);

export const getActiveCoupons = () =>
    axios.get(`${API_URL}/active`);

export const getCouponById = (couponId) =>
    axios.get(`${API_URL}/${couponId}`);

export const getCouponByCode = (couponCode) =>
    axios.get(`${API_URL}/code/${couponCode}`);

export const createCoupon = (coupon) =>
    axios.post(API_URL, coupon);

export const updateCoupon = (couponId, coupon) =>
    axios.put(`${API_URL}/${couponId}`, coupon);

export const deactivateCoupon = (couponId) =>
    axios.put(`${API_URL}/${couponId}/deactivate`);

export const deleteCoupon = (couponId) =>
    axios.delete(`${API_URL}/${couponId}`);

export const applyCoupon = (couponCode, orderTotal) =>
    axios.post(`${API_URL}/apply`, null, {
        params: {
            couponCode,
            orderTotal
        }
    });