// frontend-service/src/services/auth.js
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';

// Check if the token is expired
export const isTokenExpired = (token) => {
    if (!token) {
        console.error('Invalid token format:', token);
        return true; // Consider invalid tokens as expired
    }

    try {
        const { exp } = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);
        return exp < currentTime;
    } catch (error) {
        console.error('Error decoding token:', error);
        return true; // Treat decoding errors as expired tokens
    }
};

// Store tokens securely
export const storeTokens = (accessToken, idToken, refreshToken, rememberMe = false) => {
    console.log('Storing tokens...', { accessToken, idToken, refreshToken });
    if (rememberMe) {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('idToken', idToken);
    } else {
        sessionStorage.setItem('accessToken', accessToken);
        sessionStorage.setItem('idToken', idToken);
    }

    // console.log('Stored Access Token:', sessionStorage.getItem('accessToken'));
    // console.log('Stored ID Token:', sessionStorage.getItem('idToken'));

    // If the backend does not set the cookie, fallback to this (not HttpOnly)
    if (refreshToken) {
        // console.log('Storing refresh token in cookie:', refreshToken);
        document.cookie = `refreshToken=${refreshToken}; Secure; SameSite=Strict; Path=/;`;
      } else {
        console.warn('No refresh token provided!');
      }
};

// Refresh tokens
export const refreshAccessToken = async (email, refreshToken) => {
    try {
        const response = await axios.post(
            '/refresh',
            { email, refresh_token: refreshToken }, // Include email and refresh_token in the request body
            // { withCredentials: true } // Include credentials if required
        );

        const { accessToken, idToken } = response.data;

        // Update tokens in storage
        sessionStorage.setItem('accessToken', accessToken);
        sessionStorage.setItem('idToken', idToken);

        return accessToken; // Return the new access token
    } catch (error) {
        console.error('Token refresh failed', error);
        throw error; // Propagate the error for the caller to handle
    }
};

export const clearTokens = () => {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('idToken');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('idToken');

    document.cookie = 'refreshToken=; Max-Age=0; Secure; SameSite=Strict';
};