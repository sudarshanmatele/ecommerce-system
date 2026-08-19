import axios from "axios";

const API_URL = "http://localhost:8080/api/users";

export const getCustomers = () => {
    return axios.get(API_URL);
};

export const getCustomerById = (userId) => {
    return axios.get(`${API_URL}/${userId}`);
};

export const createCustomer = (customer) => {
    return axios.post(API_URL, customer);
};

export const updateCustomer = (userId, customer) => {
    return axios.put(`${API_URL}/${userId}`, customer);
};

export const deactivateCustomer = (userId) => {
    return axios.put(`${API_URL}/${userId}/deactivate`);
};