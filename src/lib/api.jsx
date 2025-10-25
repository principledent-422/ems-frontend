import axios from 'axios';
import {config} from './config';

function isTokenExpired(expiryTimestamp) {
    const currentTime = Math.floor(Date.now() / 1000);
    return currentTime > expiryTimestamp;
}

const api = axios.create({
    baseURL: config.apiBaseUrl,
});

// Separate axios instance to avoid interceptor loops
const refreshApi = axios.create({
    baseURL: config.apiBaseUrl,
});

refreshApi.interceptors.request.use(
    async (conf) => {
        let token = localStorage.getItem('access_token');

        if (token) {
            conf.headers.Authorization = `Bearer ${token}`;
        }

        return conf
    },
    (error) => Promise.reject(error)
)

api.interceptors.request.use(
    async (conf) => {
        let token = localStorage.getItem('access_token');
        const expiry = Number(localStorage.getItem('expiry'));

        // if (isTokenExpired(expiry)) {
        //     try {
        //         const response = await refreshApi.post('/auth/refresh');
        //         const result = response.data;

        //         if (!result.error) {
        //             token = result?.tokens?.access;
        //             localStorage.setItem('access_token', token);
        //             localStorage.setItem('expiry', result?.expiry);
        //         } else {
        //             console.warn('Token refresh failed:', result.error);
        //         }
        //     } catch (err) {
        //         console.error('Token refresh request failed', err);
        //     }
        // }

        if (token) {
            conf.headers.Authorization = `Bearer ${token}`;
        }

        return conf;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.warn('Unauthorized!');
        }
        return Promise.reject(error);
    }
);

export default api;
