import { useEffect, useState } from "react";
import { investmentsAPI, InvestmentResponse } from "@/lib/api";
import InvestmentCard from "@/components/investments/InvestmentCard";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, ClipboardList } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";

const ManagedRequests = () => {
  const [investments, setInvestments] = useState<InvestmentResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const { user } = useAuth();

  const isAdmin = user?.roles.includes("ROLE_ADMIN");

  useEffect(() => {
    const fetchInvestments = async () => {
      setIsLoading(true);
      try {
        let data: InvestmentResponse[];

        if (isAdmin) {
          try {
            data = await investmentsAPI.getAllInvestmentRequests();
          } catch (error) {
            const escalated =
              await investmentsAPI.getEscalatedInvestmentRequests();
            const managed = await investmentsAPI.getManagedInvestmentRequests();

            const combined = [...escalated, ...managed];
            const uniqueIds = new Set(combined.map((item) => item.id));
            data = Array.from(uniqueIds).map(
              (id) => combined.find((item) => item.id === id)!
            );
          }
        } else {
          data = await investmentsAPI.getManagedInvestmentRequests();
        }

        setInvestments(data);
      } catch (error) {
        console.error("Error fetching managed requests:", error);
        toast.error("Failed to load managed investment requests");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvestments();
  }, [refreshKey, isAdmin]);

  const handleApprove = async (id: number) => {
    try {
      await investmentsAPI.approveInvestmentRequest(id);
      toast.success("Investment request approved successfully");
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("Error approving request:", error);
      toast.error("Failed to approve investment request");
    }
  };

  const handleReject = async (id: number) => {
    try {
      await investmentsAPI.rejectInvestmentRequest(id);
      toast.success("Investment request rejected successfully");
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("Error rejecting request:", error);
      toast.error("Failed to reject investment request");
    }
  };

  const handleEscalate = async (id: number) => {
    try {
      await investmentsAPI.escalateInvestmentRequest(id);
      toast.success("Investment request escalated to admin successfully");
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("Error escalating request:", error);
      toast.error("Failed to escalate investment request");
    }
  };

  const pendingRequests = investments.filter((inv) => inv.status === "PENDING");
  const processedRequests = investments.filter(
    (inv) => inv.status === "APPROVED" || inv.status === "REJECTED"
  );
  const escalatedRequests = investments.filter(
    (inv) => inv.status === "ESCALATED"
  );

  const canModerateRequest = (request: InvestmentResponse) => {
    if (isAdmin) {
      return request.status === "ESCALATED";
    } else {
      return request.status === "PENDING";
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-gradient-to-r from-primary/20 to-accent/20 p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
          <ClipboardList className="h-8 w-8 text-primary" />
          Managed Investment Requests
        </h1>
        <p className="text-muted-foreground">
          {isAdmin
            ? "Review and manage all investment requests in the system"
            : "Review and manage investment requests from your team members"}
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg shadow-lg p-6">
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="mb-6 bg-muted/50">
              <TabsTrigger value="pending" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Pending Requests 
                <Badge variant="outline" className="ml-2 bg-primary/20">
                  {pendingRequests.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="processed" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Processed Requests 
                <Badge variant="outline" className="ml-2 bg-primary/20">
                  {processedRequests.length}
                </Badge>
              </TabsTrigger>
              {isAdmin && (
                <TabsTrigger value="escalated" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Escalated Requests 
                  <Badge variant="outline" className="ml-2 bg-primary/20">
                    {escalatedRequests.length}
                  </Badge>
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="pending">
              {pendingRequests.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
                  {pendingRequests.map((investment, index) => (
                    <div key={investment.id} className="animate-fadeInUp" style={{ animationDelay: `${index * 100}ms` }}>
                      <InvestmentCard
                        investment={investment}
                        onApprove={!isAdmin ? handleApprove : undefined}
                        onReject={!isAdmin ? handleReject : undefined}
                        onEscalate={!isAdmin ? handleEscalate : undefined}
                        canModerate={canModerateRequest(investment)}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <Alert className="mt-6 border-primary/30 bg-card/50">
                  <InfoIcon className="h-4 w-4 text-primary" />
                  <AlertTitle>No pending requests</AlertTitle>
                  <AlertDescription>
                    {isAdmin
                      ? "There are no pending investment requests in the system."
                      : "You don't have any pending investment requests to review."}
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>

            <TabsContent value="processed">
              {processedRequests.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
                  {processedRequests.map((investment, index) => (
                    <div key={investment.id} className="animate-fadeInUp" style={{ animationDelay: `${index * 100}ms` }}>
                      <InvestmentCard
                        investment={investment}
                        canModerate={false}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <Alert className="mt-6 border-primary/30 bg-card/50">
                  <InfoIcon className="h-4 w-4 text-primary" />
                  <AlertTitle>No processed requests</AlertTitle>
                  <AlertDescription>
                    {isAdmin
                      ? "There are no processed investment requests in the system."
                      : "You haven't processed any investment requests yet."}
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>

            {isAdmin && (
              <TabsContent value="escalated">
                {escalatedRequests.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
                    {escalatedRequests.map((investment, index) => (
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
                  <Alert className="mt-6 border-primary/30 bg-card/50">
                    <InfoIcon className="h-4 w-4 text-primary" />
                    <AlertTitle>No escalated requests</AlertTitle>
                    <AlertDescription>
                      There are no escalated investment requests requiring your
                      attention.
                    </AlertDescription>
                  </Alert>
                )}
              </TabsContent>
            )}
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default ManagedRequests;
