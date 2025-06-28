import React, { createContext, useState, useContext, useEffect } from "react";
import { authAPI, LoginRequest, RegisterRequest, User } from "@/lib/api";
import { AuthContextType, RegisterFormData } from "@/lib/types";
import { useNavigate } from "react-router";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Initialize user from localStorage when app loads
  useEffect(() => {
    const storedUser = authAPI.getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const loginData: LoginRequest = { username, password };
      const response = await authAPI.login(loginData);
      setUser(response.user);
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (formData: RegisterFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const { confirmPassword, ...registerData } = formData;
      await authAPI.register(registerData as RegisterRequest);
      navigate("/login");
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
    navigate("/login");
  };

  const value = {
    user,
    login,
    register,
    logout,
    isLoading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
