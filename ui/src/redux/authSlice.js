import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'universal-cookie';
import { isTokenPresent } from './authToken';

// Initial state of the authentication slice
const initialState = {
    user: null,             // The 'user' property holds the authenticated user's data, initially null.
    isAuthenticated: !!isTokenPresent, // 'isAuthenticated' will be true if the token exists (i.e., user is authenticated), otherwise false.
    loading: false,         // 'loading' state indicates whether authentication is in progress, initially false.
    isVerified: false,      // 'isVerified' indicates whether the user is verified, initially false.
    error: null,            // 'error' will hold any error message or details in case of a failed request.
};

// Create the authSlice using the `createSlice` method from Redux Toolkit
const authSlice = createSlice({
    name: 'auth',             // The name of the slice. It helps identify this slice in the Redux store.
    initialState,             // The initial state of the slice.
    reducers: {
        // This action is dispatched when an authentication request is made.
        authRequest: (state) => {
            state.loading = true;  // Set loading to true indicating the authentication request is in progress.
            state.error = null;    // Clear any previous error messages.
        },
        
        // This action is dispatched when the authentication is successful.
        authSuccess: (state, action) => {
            const user = action.payload; // The user data received from the successful authentication.
            state.user = user;           // Set the user data in the state.
            state.isAuthenticated = true; // Mark the user as authenticated.
            state.isVerified = user.isVerified; // Set 'isVerified' based on the user's verification status.
            state.loading = false;         // Set loading to false indicating authentication is complete.
        },
        
        // This action is dispatched when the OTP verification is successful.
        verifyOtpSuccess: (state) => {
            state.isVerified = true;  // Set 'isVerified' to true since the OTP verification is successful.
            if (state.user) {
                state.user.isVerified = true; // Also update the 'isVerified' status in the user object.
            }
        },

        // This action is dispatched when authentication fails.
        authFailure: (state, action) => {
            state.error = action.payload; // Set the error message from the action payload.
            state.loading = false;         // Set loading to false since authentication has failed.
        },

        // This action is dispatched when the user logs out.
        logoutSuccess: (state) => {
            state.user = null;               // Clear the user data.
            state.isAuthenticated = false;   // Mark the user as not authenticated.
        },
    },
});

// Export the actions generated by createSlice, which can be dispatched in components.
export const {
    authFailure,        // Action to handle authentication failure.
    authRequest,        // Action to handle authentication request.
    logoutSuccess,      // Action to handle logout success.
    verifyOtpSuccess,   // Action to handle successful OTP verification.
    authSuccess,        // Action to handle successful authentication.
} = authSlice.actions;

// Export the reducer to be used in the Redux store.
export default authSlice.reducer;