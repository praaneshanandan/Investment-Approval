import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, UserPlus } from "lucide-react";
import { RegisterFormData } from "@/lib/types";

const Register = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    username: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    designation: "",
    phoneNumber: "",
  });

  const [validationError, setValidationError] = useState<string | null>(null);
  const { register, isLoading, error } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError(null);

    if (formData.password !== formData.confirmPassword) {
      setValidationError("Passwords do not match");
      return;
    }

    await register(formData);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
          Create an Account
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your information to create an account
        </p>
      </div>

      {(error || validationError) && (
        <Alert variant="destructive" className="border border-destructive/20 bg-destructive/10">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{validationError || error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-foreground/80">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              placeholder="John"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="border-border/50 focus:border-primary bg-card/70 backdrop-blur-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-foreground/80">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              placeholder="Doe"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="border-border/50 focus:border-primary bg-card/70 backdrop-blur-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="username" className="text-foreground/80">Username</Label>
          <Input
            id="username"
            name="username"
            placeholder="johndoe"
            value={formData.username}
            onChange={handleChange}
            required
            className="border-border/50 focus:border-primary bg-card/70 backdrop-blur-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground/80">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              className="border-border/50 focus:border-primary bg-card/70 backdrop-blur-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-foreground/80">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="border-border/50 focus:border-primary bg-card/70 backdrop-blur-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="designation" className="text-foreground/80">Designation</Label>
          <Input
            id="designation"
            name="designation"
            placeholder="Software Engineer"
            value={formData.designation}
            onChange={handleChange}
            required
            className="border-border/50 focus:border-primary bg-card/70 backdrop-blur-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber" className="text-foreground/80">Phone Number</Label>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            placeholder="+1234567890"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className="border-border/50 focus:border-primary bg-card/70 backdrop-blur-sm"
          />
        </div>

        <Button 
          type="submit" 
          className="w-full mt-6 bg-gradient-to-r from-primary to-accent hover:opacity-90 flex items-center gap-2" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
              Creating Account...
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4" /> Create Account
            </>
          )}
        </Button>
      </form>

      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link to="/login" className="text-primary hover:text-accent transition-colors">
          Log in
        </Link>
      </div>
    </div>
  );
};

export default Register;
