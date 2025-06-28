import axios from "axios";

const API_URL = "/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add authorization token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  designation: string;
  phoneNumber: string;
}

export interface UserRole {
  userId: number;
  roleName: string;
}

export interface UserManager {
  userId: number;
  managerId: number;
}

export interface InvestmentRequest {
  title: string;
  description: string;
  amount: number;
}

export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  designation: string;
  phoneNumber: string;
  roles: string[];
  managerId?: number;
  managerName?: string;
}

export interface InvestmentResponse {
  id: number;
  title: string;
  description: string;
  amount: number;
  status: string;
  createdAt: string;
  moderatedAt: string | null;
  userId: number;
  username: string;
  moderatorId?: number;
  moderatorName?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  user: User;
}

// Auth API
export const authAPI = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post("/auth/login", data);
    const authData = response.data;
    localStorage.setItem("token", authData.accessToken);
    localStorage.setItem("user", JSON.stringify(authData.user));
    return authData;
  },

  register: async (data: RegisterRequest): Promise<ApiResponse<User>> => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  logout: (): void => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getCurrentUser: (): User | null => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: (): boolean => {
    return localStorage.getItem("token") !== null;
  },
};

// Users API
export const usersAPI = {
  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get("/users");
    return response.data;
  },

  getSubordinates: async (): Promise<User[]> => {
    const response = await api.get("/users/subordinates");
    return response.data;
  },

  getUserById: async (id: number): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  updateUserRole: async (data: UserRole): Promise<ApiResponse> => {
    const response = await api.put("/users/role", data);
    return response.data;
  },

  assignManager: async (data: UserManager): Promise<ApiResponse> => {
    const response = await api.put("/users/manager", data);
    return response.data;
  },
};

// Investments API
export const investmentsAPI = {
  createInvestmentRequest: async (
    data: InvestmentRequest
  ): Promise<InvestmentResponse> => {
    const response = await api.post("/investments", data);
    return response.data;
  },

  getUserInvestmentRequests: async (): Promise<InvestmentResponse[]> => {
    const response = await api.get("/investments/my-requests");
    return response.data;
  },

  getManagedInvestmentRequests: async (): Promise<InvestmentResponse[]> => {
    const response = await api.get("/investments/managed-requests");
    return response.data;
  },

  getEscalatedInvestmentRequests: async (): Promise<InvestmentResponse[]> => {
    const response = await api.get("/investments/escalated-requests");
    return response.data;
  },

  // New method for admins to get all requests (if the backend supports it)
  getAllInvestmentRequests: async (): Promise<InvestmentResponse[]> => {
    const response = await api.get("/investments/all");
    return response.data;
  },

  approveInvestmentRequest: async (id: number): Promise<InvestmentResponse> => {
    const response = await api.put(`/investments/${id}/approve`);
    return response.data;
  },

  rejectInvestmentRequest: async (id: number): Promise<InvestmentResponse> => {
    const response = await api.put(`/investments/${id}/reject`);
    return response.data;
  },

  escalateInvestmentRequest: async (
    id: number
  ): Promise<InvestmentResponse> => {
    const response = await api.put(`/investments/${id}/escalate`);
    return response.data;
  },
};

export default api;
