import axios from 'axios';
import { API_BASE_URL } from './endpoints';

// In-memory token storage (accessible module-wide)
let currentToken = null;

export const setAuthToken = (token) => {
    currentToken = token;
};

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        if (currentToken) {
            config.headers['Authorization'] = `Bearer ${currentToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
