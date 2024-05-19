import axios from 'axios';

const axiosClient = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`
});

axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('ACCESS_TOKEN');
    config.headers.Authorization = `Bearer ${token}`
    return config;
});

axiosClient.interceptors.response.use((response) => {
    return response;
}, (error) => {
    try {
        // const {response} = error;
        if(error.response && error.response.status === 401){
            localStorage.removeItem('ACCESS_TOKEN');
        }
        console.error('Response Interceptor Error:' , error)
    } catch (e) {
        console.error('Error in Resposne Interceptor', e);
    }

    throw error;
});

export default axiosClient;