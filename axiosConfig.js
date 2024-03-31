import axios from "axios";
import { toast } from "react-toastify";
import { apiUrl } from "./apiUrl";

const logout = async () => {
    console.log("logout");
    try {
        await axios.get(`${apiUrl}/logout`, {
            withCredentials: true,
        });
        localStorage.removeItem('userRegistration');
        window.location.reload()
    } catch (error) {
        console.log(error);
        localStorage.removeItem('userRegistration');
        window.location.reload()
    }
}


const refreshToken = async () => {
    try {
        const response = await axios.get(`${apiUrl}/refreshToken`, {
            withCredentials: true,
        });
        toast.info("تم تحديث الجلسة الخاص بك بنجاح!");
        setTimeout(() => {
            window.location.reload()
        }, 2000)
        if (response.status === 401) {
            logout();
        }
    } catch (error) {
        console.log(error);
        logout();
    }
}


// Create an instance of Axios
export const mainRequest = axios.create({
    baseURL: "https://top-foon-server.onrender.com",
    withCredentials: true,
    'Access-Control-Allow-Credentials': true,
    headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
    credentials: 'include',
});

// Add a request interceptor
mainRequest.interceptors.request.use(
    (config) => {
        // Modify the request config if needed (e.g., add headers, authentication tokens, etc.)
        return config;
    },
    (error) => {
        // Handle request error
        return Promise.reject(error);
    }
);

// Add a response interceptor
mainRequest.interceptors.response.use(
    (response) => {
        // Handle successful responses
        return response;
    },
    (error) => {
        // Handle error responses
        if (error.response && error.response.status === 401) {
            refreshToken();
            console.log('Unauthorized request');
        }
        return Promise.reject(error);
    }
);
