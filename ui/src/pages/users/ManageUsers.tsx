import { useEffect, useState } from "react";
import { User, usersAPI } from "@/lib/api";
import UserTable from "@/components/users/UserTable";
import EditRoleDialog from "@/components/users/EditRoleDialog";
import AssignManagerDialog from "@/components/users/AssignManagerDialog";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, Users as UsersIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const ManageUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isManagerDialogOpen, setIsManagerDialogOpen] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await usersAPI.getAllUsers();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        (user) =>
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const handleEditRole = (user: User) => {
    setSelectedUser(user);
    setIsRoleDialogOpen(true);
  };

  const handleAssignManager = (user: User) => {
    setSelectedUser(user);
    setIsManagerDialogOpen(true);
  };

  const regularUsers = filteredUsers.filter((u) =>
    u.roles.some((r) => r === "ROLE_REGULAR")
  );

  const managerUsers = filteredUsers.filter((u) =>
    u.roles.some((r) => r === "ROLE_MANAGER")
  );

  const adminUsers = filteredUsers.filter((u) =>
    u.roles.some((r) => r === "ROLE_ADMIN")
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-gradient-to-r from-primary/20 to-accent/20 p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3 text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
          <UsersIcon className="h-7 w-7 text-primary" />
          Manage Users
        </h1>
        <p className="text-muted-foreground mt-1">
          View and manage user accounts and roles
        </p>
      </div>

      <Card className="p-4 bg-card/80 backdrop-blur-sm border border-border/50 shadow-lg">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-primary" />
          <Input
            placeholder="Search users by name or username..."
            className="pl-9 border-primary/30 focus:border-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </Card>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg shadow-lg p-6">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-6 bg-muted/50">
              <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                All Users{" "}
                <Badge variant="outline" className="ml-2 bg-primary/20">
                  {filteredUsers.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="regular" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Regular{" "}
                <Badge variant="outline" className="ml-2 bg-primary/20">
                  {regularUsers.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="managers" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Managers{" "}
                <Badge variant="outline" className="ml-2 bg-primary/20">
                  {managerUsers.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="admins" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Admins{" "}
                <Badge variant="outline" className="ml-2 bg-primary/20">
                  {adminUsers.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <UserTable
                users={filteredUsers}
                onEditRole={handleEditRole}
                onAssignManager={handleAssignManager}
              />
            </TabsContent>

            <TabsContent value="regular">
              <UserTable
                users={regularUsers}
                onEditRole={handleEditRole}
                onAssignManager={handleAssignManager}
              />
            </TabsContent>

            <TabsContent value="managers">
              <UserTable
                users={managerUsers}
                onEditRole={handleEditRole}
                onAssignManager={handleAssignManager}
              />
            </TabsContent>

            <TabsContent value="admins">
              <UserTable
                users={adminUsers}
                onEditRole={handleEditRole}
                onAssignManager={handleAssignManager}
              />
            </TabsContent>
          </Tabs>
        </div>
      )}

      <EditRoleDialog
        user={selectedUser}
        isOpen={isRoleDialogOpen}
        onClose={() => setIsRoleDialogOpen(false)}
        onSuccess={fetchUsers}
      />

      <AssignManagerDialog
        user={selectedUser}
        isOpen={isManagerDialogOpen}
        onClose={() => setIsManagerDialogOpen(false)}
        onSuccess={fetchUsers}
      />
    </div>
  );
};

export default ManageUsers;
