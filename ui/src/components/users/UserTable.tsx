import { User } from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Pencil, UserCog } from "lucide-react";

interface UserTableProps {
  users: User[];
  onEditRole?: (user: User) => void;
  onAssignManager?: (user: User) => void;
}

const UserTable = ({ users, onEditRole, onAssignManager }: UserTableProps) => {
  const { user: currentUser } = useAuth();
  const isAdmin = currentUser?.roles.includes("ROLE_ADMIN");

  return (
    <div className="rounded-md border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-medium">Username</TableHead>
              <TableHead className="font-medium">Name</TableHead>
              <TableHead className="font-medium hidden md:table-cell">
                Designation
              </TableHead>
              <TableHead className="font-medium hidden md:table-cell">
                Phone
              </TableHead>
              <TableHead className="font-medium">Role</TableHead>
              <TableHead className="font-medium hidden lg:table-cell">
                Manager
              </TableHead>
              {isAdmin && (
                <TableHead className="font-medium text-right">
                  Actions
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-6 text-muted-foreground"
                >
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>
                    {user.firstName} {user.lastName}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {user.designation}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {user.phoneNumber}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.roles.map((role, index) => (
                        <Badge
                          key={index}
                          variant={
                            role === "ROLE_ADMIN"
                              ? "default"
                              : role === "ROLE_MANAGER"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {role.replace("ROLE_", "")}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {user.managerName ? (
                      <span className="inline-flex items-center gap-1.5">
                        <UserCog className="h-3.5 w-3.5" />
                        {user.managerName}
                      </span>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  {isAdmin && (
                    <TableCell>
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEditRole?.(user)}
                          disabled={user.id === currentUser?.id}
                          className="h-8 px-2"
                        >
                          <Pencil className="h-3.5 w-3.5 mr-1" /> Role
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onAssignManager?.(user)}
                          disabled={!user.roles.includes("ROLE_REGULAR")}
                          className="h-8 px-2"
                        >
                          <UserCog className="h-3.5 w-3.5 mr-1" /> Manager
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UserTable;
