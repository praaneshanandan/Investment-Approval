import { useState } from "react";
import { useNavigate } from "react-router";
import { InvestmentFormData } from "@/lib/types";
import { investmentsAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

const InvestmentForm = () => {
  const [formData, setFormData] = useState<InvestmentFormData>({
    title: "",
    description: "",
    amount: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate amount is a number
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        toast.error("Please enter a valid positive amount");
        return;
      }

      await investmentsAPI.createInvestmentRequest({
        title: formData.title,
        description: formData.description,
        amount,
      });

      toast.success("Your investment request has been submitted successfully");
      navigate("/investments");
    } catch (error) {
      console.error("Error creating investment request:", error);
      toast.error(
        "There was an error submitting your request. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>New Investment Request</CardTitle>
        <CardDescription>
          Fill out the form to submit a new investment request
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Investment title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your investment request"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={handleChange}
              required
              placeholder="0.00"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default InvestmentForm;
