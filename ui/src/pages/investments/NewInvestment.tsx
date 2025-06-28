import InvestmentForm from "@/components/investments/InvestmentForm";
import { PlusCircle } from "lucide-react";

const NewInvestment = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-gradient-to-r from-primary/20 to-accent/20 p-6 rounded-xl shadow-lg mb-8">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
          <PlusCircle className="h-8 w-8 text-primary" />
          Create Investment Request
        </h1>
        <p className="text-muted-foreground">
          Fill out the form to submit a new investment request.
        </p>
      </div>

      <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg shadow-lg p-6">
        <InvestmentForm />
      </div>
    </div>
  );
};

export default NewInvestment;
