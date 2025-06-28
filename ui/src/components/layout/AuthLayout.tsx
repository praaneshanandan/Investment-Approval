import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Outlet } from "react-router";

const AuthLayout = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && user) {
      navigate("/dashboard");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-background px-4">
      <div className="w-full max-w-md p-6 md:p-8 space-y-6 bg-card rounded-lg shadow-lg border">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Investment System</h1>
          <div className="h-1 w-16 bg-primary mx-auto mt-2 rounded"></div>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
