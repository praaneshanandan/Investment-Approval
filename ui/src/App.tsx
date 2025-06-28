import { Route, Routes, BrowserRouter } from "react-router";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

// Layouts
import AppLayout from "@/components/layout/AppLayout";
import AuthLayout from "@/components/layout/AuthLayout";

// Auth Pages
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";

// Main Pages
import Dashboard from "@/pages/Dashboard";
import NewInvestment from "@/pages/investments/NewInvestment";
import MyInvestments from "@/pages/investments/MyInvestments";
import ManagedRequests from "@/pages/investments/ManagedRequests";
import EscalatedRequests from "@/pages/investments/EscalatedRequests";
import ManageUsers from "@/pages/users/ManageUsers";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="investment-ui-theme">
      <BrowserRouter>
        <AuthProvider>
          <div className="transition-colors duration-300">
            <Routes>
              {/* Auth Routes */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Route>

              {/* App Routes */}
              <Route element={<AppLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/investments/new" element={<NewInvestment />} />
                <Route path="/investments" element={<MyInvestments />} />
                <Route path="/managed-requests" element={<ManagedRequests />} />
                <Route
                  path="/escalated-requests"
                  element={<EscalatedRequests />}
                />
                <Route path="/users" element={<ManageUsers />} />
              </Route>
            </Routes>

            <Toaster position="top-right" theme="dark" />
          </div>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
