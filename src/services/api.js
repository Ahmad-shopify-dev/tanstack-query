import axios from "axios";



const api = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
  timeout: 10000,
  headers: {"Content-Type": "application/json"}
});


// USE THE REQUEST INTERCEPTOR
api.interceptors.request.use(
    (configs) => {
        const token = localStorage.getItem("token");
        if(token) {
            configs.headers.Authorization = `Bearer ${token}`;
        }
        console.log("Request sending with token configurations");
        return configs;
    },
    (error) => {
        return Promise.reject(error)
    }
);

// USE INTERCEPTOR FOR RESPONSE
api.interceptors.response.use(
    (response) => {
        console.log(`[Response] Received from ${response.config.url}`);
        return response.data;
    },
    (error) => {
        if (error.response) {
          if (error.response.status === 401) {
            console.error("Unauthorized! Redirecting to login...");
          } else if (error.response.status === 500) {
            console.error("Server error. Please try again later.");
          }
        } else if (error.request) {
          console.error("Network error. Check your internet connection.");
        } else {
          console.error("Error setting up the request:", error.message);
        }

        return Promise.reject(error);
    }
)



export default api;



