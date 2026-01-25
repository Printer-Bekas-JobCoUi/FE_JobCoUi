import axios from "axios";

const API_BASE_URL = "http://localhost:3001/api";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add a request interceptor to add the auth token to headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("admin_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const auth = {
    login: async (email: string, passwordHash: string) => {
        // Note: The backend uses 'passwordHash' in the login controller
        const response = await api.post("/auth/login", { email, password: passwordHash });
        if (response.data.success) {
            localStorage.setItem("admin_token", response.data.data.token);
            localStorage.setItem("admin_user", JSON.stringify(response.data.data.user));
        }
        return response;
    },
    logout: () => {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
    },
    getUser: () => {
        const user = localStorage.getItem("admin_user");
        return user ? JSON.parse(user) : null;
    },
};

export const admin = {
    getUsers: (params?: any) => api.get("/admin/users", { params }),
    getUserDetail: (id: string | number) => api.get(`/admin/users/${id}`),
    verifyKyc: (id: string | number, status: string) =>
        api.post(`/admin/users/${id}/verify`, { status }),
    getJobs: (params?: any) => api.get("/admin/jobs", { params }),
    getContracts: (params?: any) => api.get("/admin/contracts", { params }),
    getPayments: (params?: any) => api.get("/admin/payments", { params }),
    getRatings: (params?: any) => api.get("/admin/ratings", { params }),
    getStats: () => api.get("/admin/stats"),
};

export default api;
