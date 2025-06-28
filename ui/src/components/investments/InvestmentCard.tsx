import { InvestmentResponse } from "@/lib/api";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { InvestmentStatus } from "@/lib/types";
import { Check, X, ArrowUpRight, Calendar, User, Clock } from "lucide-react";

interface InvestmentCardProps {
  investment: InvestmentResponse;
  onApprove?: (id: number) => void;
  onReject?: (id: number) => void;
  onEscalate?: (id: number) => void;
  canModerate: boolean;
}

const StatusBadge = ({ status }: { status: string }) => {
  const statusMap: Record<
    InvestmentStatus,
    {
      label: string;
      variant: "default" | "secondary" | "destructive" | "outline";
    }
  > = {
    PENDING: { label: "Pending", variant: "outline" },
    APPROVED: { label: "Approved", variant: "default" },
    REJECTED: { label: "Rejected", variant: "destructive" },
    ESCALATED: { label: "Escalated", variant: "secondary" },
  };

  const { label, variant } = statusMap[status as InvestmentStatus] || {
    label: status,
    variant: "outline",
  };

  return <Badge variant={variant}>{label}</Badge>;
};

// Helper function to format amount in Indian currency format
const formatIndianCurrency = (amount: number): string => {
  const formatted = amount.toFixed(2);
  const [wholePart, decimalPart] = formatted.split(".");

  const lastThree =
    wholePart.length > 3 ? wholePart.substr(wholePart.length - 3) : wholePart;
  const otherNumbers =
    wholePart.length > 3 ? wholePart.substr(0, wholePart.length - 3) : "";

  const formattedWholePart =
    otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") +
    (otherNumbers ? "," : "") +
    lastThree;

  return `₹${formattedWholePart}.${decimalPart}`;
};

const InvestmentCard = ({
  investment,
  onApprove,
  onReject,
  onEscalate,
  canModerate,
}: InvestmentCardProps) => {
  const formattedCreatedAt = format(new Date(investment.createdAt), "PPP p");
  const formattedModeratedAt = investment.moderatedAt
    ? format(new Date(investment.moderatedAt), "PPP p")
    : null;

  const isPending = investment.status === "PENDING";
  const isEscalated = investment.status === "ESCALATED";

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg line-clamp-1">
            {investment.title}
          </CardTitle>
          <StatusBadge status={investment.status} />
        </div>
        <div className="text-sm font-medium text-primary mt-1">
          {formatIndianCurrency(investment.amount)}
        </div>
      </CardHeader>
      <CardContent className="py-2 flex-grow">
        <p className="text-sm mb-4 line-clamp-3">{investment.description}</p>
        <div className="text-xs text-muted-foreground space-y-1.5 mt-auto">
          <div className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5" />
            <span>{investment.username}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formattedCreatedAt}</span>
          </div>
          {formattedModeratedAt && (
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>{formattedModeratedAt}</span>
            </div>
          )}
          {investment.moderatorName && (
            <div className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              <span>Moderator: {investment.moderatorName}</span>
            </div>
          )}
        </div>
      </CardContent>
      {canModerate && (isPending || isEscalated) && (
        <CardFooter className="pt-3 pb-4 flex gap-2">
          <Button
            size="sm"
            variant="default"
            className="flex-1"
            onClick={() => onApprove?.(investment.id)}
          >
            <Check className="h-3.5 w-3.5 mr-1" /> Approve
          </Button>
          <Button
            size="sm"
            variant="destructive"
            className="flex-1"
            onClick={() => onReject?.(investment.id)}
          >
            <X className="h-3.5 w-3.5 mr-1" /> Reject
          </Button>
          {isPending && onEscalate && (
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={() => onEscalate(investment.id)}
            >
              <ArrowUpRight className="h-3.5 w-3.5 mr-1" /> Escalate
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default InvestmentCard;
