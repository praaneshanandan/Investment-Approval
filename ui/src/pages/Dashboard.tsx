import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "@/contexts/AuthContext";
import { investmentsAPI, InvestmentResponse } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import InvestmentCard from "@/components/investments/InvestmentCard";
import {
  PlusCircle,
  FileText,
  Users,
  AlertCircle,
  LayoutDashboard,
} from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const [recentInvestments, setRecentInvestments] = useState<
    InvestmentResponse[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  const isAdmin = user?.roles.includes("ROLE_ADMIN");
  const isManager = user?.roles.includes("ROLE_MANAGER");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const investments = await investmentsAPI.getUserInvestmentRequests();
        setRecentInvestments(investments.slice(0, 3)); // Only show 3 most recent
      } catch (error) {
        console.error("Error fetching investment requests:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="bg-gradient-to-r from-primary/20 to-accent/20 p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold tracking-tight mb-1 text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
          Welcome, {user?.firstName}!
        </h1>
        <p className="text-muted-foreground">
          {isAdmin
            ? "Administrator Dashboard"
            : isManager
            ? "Manager Dashboard"
            : "User Dashboard"}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-card/80 backdrop-blur-sm border border-border/50 shadow-lg card-hover-effect">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <FileText className="h-5 w-5 mr-2 text-primary" />
              My Investments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Submit new investment requests and track their status
            </p>
            <Button asChild className="w-full mt-2 gap-2 bg-gradient-to-r from-primary to-accent">
              <Link to="/investments/new">
                <PlusCircle className="h-4 w-4" />
                New Investment Request
              </Link>
            </Button>
          </CardContent>
        </Card>

        {(isManager || isAdmin) && (
          <Card className="bg-card/80 backdrop-blur-sm border border-border/50 shadow-lg card-hover-effect">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <LayoutDashboard className="h-5 w-5 mr-2 text-primary" />
                Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Review and process investment requests from your team members
              </p>
              <Button 
                asChild 
                variant="outline" 
                className="w-full mt-2 border-primary/50 hover:border-primary"
              >
                <Link to="/managed-requests">View Managed Requests</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {isAdmin && (
          <Card className="bg-card/80 backdrop-blur-sm border border-border/50 shadow-lg card-hover-effect">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <Users className="h-5 w-5 mr-2 text-primary" />
                Administration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Manage users, roles, and escalated investment requests
              </p>
              <div className="grid grid-cols-2 gap-3 mt-2">
                <Button asChild className="bg-gradient-to-r from-primary to-accent">
                  <Link to="/users">Manage Users</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="flex items-center gap-1 border-primary/50 hover:border-primary"
                >
                  <Link to="/escalated-requests">
                    <AlertCircle className="h-4 w-4" />
                    Escalated
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="mt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
            Recent Investment Requests
          </h2>
          <Button asChild variant="ghost" size="sm" className="hover:text-primary">
            <Link to="/investments">View All</Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : recentInvestments.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recentInvestments.map((investment, index) => (
              <div key={investment.id} className="animate-fadeInUp" style={{ animationDelay: `${index * 150}ms` }}>
                <InvestmentCard
                  investment={investment}
                  canModerate={false}
                />
              </div>
            ))}
          </div>
        ) : (
          <Card className="bg-card/80 backdrop-blur-sm border border-border/50 shadow-lg">
            <CardContent className="py-10 text-center">
              <CardDescription className="text-base">
                You don't have any investment requests yet.
              </CardDescription>
              <div className="flex justify-center mt-4">
                <Button asChild className="bg-gradient-to-r from-primary to-accent">
                  <Link to="/investments/new">Create Your First Request</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
