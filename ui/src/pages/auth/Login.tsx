import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, LogIn } from "lucide-react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await login(username, password);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
          Welcome Back
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your credentials to access your account
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="border border-destructive/20 bg-destructive/10">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username" className="text-foreground/80">Username</Label>
          <Input
            id="username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="border-border/50 focus:border-primary bg-card/70 backdrop-blur-sm"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-foreground/80">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
              Logging in...
            </>
          ) : (
            <>
              <LogIn className="h-4 w-4" /> Login
            </>
          )}
        </Button>
      </form>

      <div className="text-center text-sm">
        Don't have an account?{" "}
        <Link to="/register" className="text-primary hover:text-accent transition-colors">
          Sign up
        </Link>
      </div>
    </div>
  );
};

export default Login;
