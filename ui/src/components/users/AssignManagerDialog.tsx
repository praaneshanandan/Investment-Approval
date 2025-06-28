import { useEffect, useState } from "react";
import { User, usersAPI, UserManager } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface AssignManagerDialogProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AssignManagerDialog = ({
  user,
  isOpen,
  onClose,
  onSuccess,
}: AssignManagerDialogProps) => {
  const [selectedManagerId, setSelectedManagerId] = useState<number | null>(
    null
  );
  const [availableManagers, setAvailableManagers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load available managers
  useEffect(() => {
    if (isOpen) {
      const fetchManagers = async () => {
        try {
          const managers = await usersAPI.getAllUsers();
          // Filter only users with manager role
          const onlyManagers = managers.filter(
            (u) => u.roles.includes("ROLE_MANAGER") && u.id !== user?.id
          );
          setAvailableManagers(onlyManagers);

          // Set current manager if exists
          if (user?.managerId) {
            setSelectedManagerId(user.managerId);
          } else {
            setSelectedManagerId(null);
          }
        } catch (error) {
          console.error("Error fetching managers:", error);
        }
      };

      fetchManagers();
    }
  }, [isOpen, user]);

  const handleSubmit = async () => {
    if (!user) return;

    setIsLoading(true);

    try {
      const data: UserManager = {
        userId: user.id,
        managerId: selectedManagerId || 0, // If null, send 0 to remove manager
      };

      await usersAPI.assignManager(data);

      if (selectedManagerId) {
        toast.success(`Manager has been assigned to ${user.username}`);
      } else {
        toast.success(`Manager has been removed from ${user.username}`);
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error assigning manager:", error);
      toast.error("There was an error assigning the manager.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign Manager</DialogTitle>
          <DialogDescription>
            Assign a manager to {user?.username}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="manager" className="text-right">
              Manager
            </Label>
            <Select
              value={selectedManagerId?.toString() || "no-manager"}
              onValueChange={(value) =>
                setSelectedManagerId(
                  value !== "no-manager" ? parseInt(value) : null
                )
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a manager" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no-manager">No Manager</SelectItem>
                {availableManagers.map((manager) => (
                  <SelectItem key={manager.id} value={manager.id.toString()}>
                    {manager.username} ({manager.firstName} {manager.lastName})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignManagerDialog;
