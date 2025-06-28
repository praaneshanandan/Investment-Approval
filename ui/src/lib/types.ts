import { User } from "./api";

export type RoleName = "ROLE_REGULAR" | "ROLE_MANAGER" | "ROLE_ADMIN";

export type InvestmentStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "ESCALATED";

// For context usage
export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  register: (formData: RegisterFormData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

export interface RegisterFormData {
  username: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  designation: string;
  phoneNumber: string;
}

export interface InvestmentFormData {
  title: string;
  description: string;
  amount: string;
}
