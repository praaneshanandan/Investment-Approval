import { useState } from "react";
import { User, usersAPI, UserRole } from "@/lib/api";
import { RoleName } from "@/lib/types";
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

interface EditRoleDialogProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const EditRoleDialog = ({
  user,
  isOpen,
  onClose,
  onSuccess,
}: EditRoleDialogProps) => {
  const [selectedRole, setSelectedRole] = useState<RoleName | "">("");
  const [isLoading, setIsLoading] = useState(false);

  // Extract current role as first in the array
  const currentRole = user?.roles[0]?.replace("ROLE_", "") || "";

  const handleSubmit = async () => {
    if (!user || !selectedRole) return;

    setIsLoading(true);

    try {
      const data: UserRole = {
        userId: user.id,
        roleName: selectedRole,
      };

      await usersAPI.updateUserRole(data);

      toast.success(
        `${user.username}'s role has been updated to ${selectedRole.replace(
          "ROLE_",
          ""
        )}`
      );

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("There was an error updating the user's role.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit User Role</DialogTitle>
          <DialogDescription>
            Change the role for user {user?.username}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              Role
            </Label>
            <Select
              value={selectedRole || ""}
              onValueChange={(value) => setSelectedRole(value as RoleName)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder={`Current: ${currentRole}`} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ROLE_REGULAR">REGULAR</SelectItem>
                <SelectItem value="ROLE_MANAGER">MANAGER</SelectItem>
                <SelectItem value="ROLE_ADMIN">ADMIN</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!selectedRole || isLoading}>
            {isLoading ? "Updating..." : "Update Role"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditRoleDialog;
