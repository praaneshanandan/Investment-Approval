import { useEffect, useState } from "react";
import { investmentsAPI, InvestmentResponse } from "@/lib/api";
import InvestmentCard from "@/components/investments/InvestmentCard";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, AlertTriangle } from "lucide-react";

const EscalatedRequests = () => {
  const [investments, setInvestments] = useState<InvestmentResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchInvestments = async () => {
      setIsLoading(true);
      try {
        const data = await investmentsAPI.getEscalatedInvestmentRequests();
        setInvestments(data);
      } catch (error) {
        console.error("Error fetching escalated requests:", error);
        toast.error("Failed to load escalated investment requests");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvestments();
  }, [refreshKey]);

  const handleApprove = async (id: number) => {
    try {
      await investmentsAPI.approveInvestmentRequest(id);
      toast.success("Escalated request approved successfully");
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("Error approving request:", error);
      toast.error("Failed to approve escalated request");
    }
  };

  const handleReject = async (id: number) => {
    try {
      await investmentsAPI.rejectInvestmentRequest(id);
      toast.success("Escalated request rejected successfully");
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("Error rejecting request:", error);
      toast.error("Failed to reject escalated request");
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-gradient-to-r from-primary/20 to-accent/20 p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
          <AlertTriangle className="h-8 w-8 text-primary" />
          Escalated Requests
        </h1>
        <p className="text-muted-foreground">
          Review and process requests that have been escalated by managers
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : investments.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {investments.map((investment, index) => (
            <div key={investment.id} className="animate-fadeInUp" style={{ animationDelay: `${index * 100}ms` }}>
              <InvestmentCard
                investment={investment}
                onApprove={handleApprove}
                onReject={handleReject}
                canModerate={true}
              />
            </div>
          ))}
        </div>
      ) : (
        <Alert className="border-primary/30 bg-card/50 backdrop-blur-sm shadow-md">
          <InfoIcon className="h-4 w-4 text-primary" />
          <AlertTitle>No escalated requests</AlertTitle>
          <AlertDescription>
            There are no escalated investment requests requiring your attention.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default EscalatedRequests;
