import axios from "axios"

const axiosClient =  axios.create({
    baseURL: 'https://algonest-mczt.onrender.com',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});


axiosClient.interceptors.request.use(
  (config) => {
    config.withCredentials = true;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // If logout endpoint, just redirect
      if (originalRequest.url.includes('/logout')) {
        window.location.href = '/';
        return Promise.reject(error);
      }
      
      // For other 401s, redirect to login
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default axiosClient;
