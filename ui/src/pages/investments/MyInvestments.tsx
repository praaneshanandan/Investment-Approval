import { useEffect, useState } from "react";
import { Link } from "react-router";
import { investmentsAPI, InvestmentResponse } from "@/lib/api";
import { Button } from "@/components/ui/button";
import InvestmentCard from "@/components/investments/InvestmentCard";
import { Plus, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MyInvestments = () => {
  const [investments, setInvestments] = useState<InvestmentResponse[]>([]);
  const [filteredInvestments, setFilteredInvestments] = useState<
    InvestmentResponse[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const data = await investmentsAPI.getUserInvestmentRequests();
        setInvestments(data);
        setFilteredInvestments(data);
      } catch (error) {
        console.error("Error fetching investment requests:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvestments();
  }, []);

  useEffect(() => {
    if (statusFilter === "ALL") {
      setFilteredInvestments(investments);
    } else {
      setFilteredInvestments(
        investments.filter((inv) => inv.status === statusFilter)
      );
    }
  }, [statusFilter, investments]);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-gradient-to-r from-primary/20 to-accent/20 p-6 rounded-xl shadow-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
            My Investment Requests
          </h1>
          <p className="text-muted-foreground mt-1">
            View and manage your investment requests
          </p>
        </div>
        <Button 
          asChild 
          className="self-start sm:self-auto bg-gradient-to-r from-primary to-accent hover:opacity-90"
        >
          <Link to="/investments/new" className="gap-2">
            <Plus className="h-4 w-4" /> New Request
          </Link>
        </Button>
      </div>

      {investments.length > 0 && (
        <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm p-4 rounded-lg border border-border/50 shadow-md">
          <Filter className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Filter:</span>
          <div className="w-[180px]">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="border-primary/30 focus:border-primary">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Requests</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
                <SelectItem value="ESCALATED">Escalated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredInvestments.length > 0 ? (
            filteredInvestments.map((investment, index) => (
              <div key={investment.id} className="animate-fadeInUp" style={{ animationDelay: `${index * 100}ms` }}>
                <InvestmentCard
                  investment={investment}
                  canModerate={false}
                />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-16 bg-card/80 backdrop-blur-sm rounded-lg border border-border/50 shadow-md">
              {statusFilter !== "ALL" ? (
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    No investment requests with the selected status.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setStatusFilter("ALL")}
                    className="border-primary/50 hover:border-primary"
                  >
                    Show All Requests
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    You don't have any investment requests yet.
                  </p>
                  <Button asChild className="bg-gradient-to-r from-primary to-accent">
                    <Link to="/investments/new">Create Your First Request</Link>
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyInvestments;
