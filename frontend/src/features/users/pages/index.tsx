import { DataTable } from "@/components/data-table";
import PageHeaderTitle from "@/components/page-header/title";
import PageHeader from "@/components/page-header/wrapper";
import type { OutletContextType } from "@/layouts/main-layout";
import { useEffect, useState } from "react"; 
import { useOutletContext } from "react-router";
import api from "@/api/axios";
import { columns, type Employee } from "../components/columns";
import EditUserDialog from "../components/edit-user-dialog";
import { toast } from "sonner";

export type User = {
  id: number;
  name: string;
  email: string;
  employeeId?: string;
  epfNo?: string;
  nic?: string;
  jobPosition?: string;
  imagePath?: string;
  joinDate?: string;
  address?: string;
};

function UsersPage1() {
  const { setBreadcrumb } = useOutletContext<OutletContextType>();
  const [data, setData] = useState<Employee[]>([]);
  const [editUserToggle, setEditUserToggle] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await api.get(`/users`);
      setData(res.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch users");
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setEditUserToggle(true);
  };

  const handleDeleteUser = async (user: User) => {
    if (!window.confirm(`Are you sure you want to delete user "${user.name}"?`)) {
      return;
    }

    try {
      console.log("🗑️ Deleting user:", user.id);
      
      // Call your delete API endpoint
      await api.delete(`/users/${user.id}`);
      
      console.log("✅ User deleted successfully");
      
      // Refresh the users list
      fetchUsers();
      
      // Show success message
      toast.success(`User "${user.name}" deleted successfully`);
    } catch (error: any) {
      console.error("❌ Error deleting user:", error);
      toast.error(`Failed to delete user: ${error.response?.data?.message || error.message}`);
    }
  };

  useEffect(() => {
    setBreadcrumb(["Users"]);
    fetchUsers();
  }, [setBreadcrumb]);

  return (
    <>
      <PageHeader>
        <div>
          <PageHeaderTitle value="Users" />
        </div>
      </PageHeader>

      <div className="rounded-lg border p-6">
        <div className="rounded-lg border p-6 mt-3">
          <h2 className="mb-4 font-semibold">Registered Users</h2>
          {/* ✅ Use only one DataTable with both handlers */}
          <DataTable 
            columns={columns(handleEdit, handleDeleteUser)} 
            data={data} 
          />
        </div>
      </div>

      {editUserToggle && selectedUser && (
        <EditUserDialog
          open={editUserToggle}
          onOpenChange={(v) => {
            setEditUserToggle(v);
            if (!v) setSelectedUser(null);
          }}
          onSaved={fetchUsers}
          user={selectedUser}
        />
      )}
    </>
  );
}

export default UsersPage1;