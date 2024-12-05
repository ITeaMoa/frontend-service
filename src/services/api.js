// frontend-service/src/services/api.js
import axios from 'axios';
import { isTokenExpired, refreshAccessToken, clearTokens } from './auth';

const apiClient = axios.create({
    baseURL: 'http://localhost:8000', //process.env.REACT_APP_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(async (config) => {
    const publicEndpoints = ['/signup', '/verify/verify-email', '/verify/confirm-email'];

    // Skip adding Authorization header for these endpoints
    if (publicEndpoints.some(endpoint => config.url.includes(endpoint))) {
        console.log(`Skipping interceptor for ${config.url}`);
        return config;
    }

    let accessToken = sessionStorage.getItem('accessToken');
    const refreshToken = document.cookie.split('; ').find(row => row.startsWith('refreshToken='))
                        ?.split('=')[1];

    console.log('Current Access Token:', accessToken);
    console.log('Current Refresh Token:', refreshToken);

    if (!accessToken || isTokenExpired(accessToken)) {
        if (!refreshToken) {
            console.error('No refresh token found, redirecting to login...');
            clearTokens();
            window.location.href = '/LoginPage';
            return Promise.reject(new Error('No refresh token found.'));
        }

        try {
            console.log('Refreshing Access Token...');
            accessToken = await refreshAccessToken(refreshToken);
        } catch (error) {
            console.error('Token refresh failed, redirecting to login...');
            clearTokens();
            window.location.href = '/LoginPage';
            return Promise.reject(error);
        }
    }

    config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
});

export default apiClient;
