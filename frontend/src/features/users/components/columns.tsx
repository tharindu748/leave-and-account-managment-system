import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import type { User } from "../pages";
import { User as UserIcon } from "lucide-react";

// ✅ Updated type with new fields
export type Employee = {
  id: number;
  name: string;
  email: string;
  epfNo: string | null;
  nic: string | null;
  jobPosition: string | null;
  employeeId?: string | null;
  imagePath?: string | null;
  joinDate?: string | null; // ✅ Company join date
  address?: string | null; // ✅ Address field
};

export const columns = (
  onEdit: (user: User) => void
): ColumnDef<Employee>[] => [
  {
    id: "image",
    header: "Image",
    cell: ({ row }) => {
      const employee = row.original;
      const imageUrl = employee.imagePath?.startsWith('http') 
        ? employee.imagePath 
        : employee.imagePath 
          ? `${import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"}/${employee.imagePath.replace(/^\//, '')}`
          : null;

      return (
        <div className="flex justify-center">
          <div className="w-10 h-10 rounded-full border border-gray-200 overflow-hidden bg-gray-50">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={employee.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <UserIcon className="w-5 h-5 text-gray-400" />
              </div>
            )}
          </div>
        </div>
      );
    },
  },
  { 
    accessorKey: "id",
    header: "ID" 
  },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  { 
    accessorKey: "epfNo", 
    header: "EPF No",
    cell: ({ row }) => row.original.epfNo || "—"
  },
  { 
    accessorKey: "nic", 
    header: "NIC",
    cell: ({ row }) => row.original.nic || "—"
  },
  { 
    accessorKey: "jobPosition", 
    header: "Job Position",
    cell: ({ row }) => row.original.jobPosition || "—"
  },
  {
    id: "joinDate",
    header: "Join Date",
    cell: ({ row }) => {
      const joinDate = row.original.joinDate;
      if (!joinDate) return "—";
      
      // Format date for display
      return new Date(joinDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },
  },
  {
    id: "address",
    header: "Address",
    cell: ({ row }) => {
      const address = row.original.address;
      if (!address) return "—";
      
      // Truncate long addresses for table display
      return address.length > 30 ? `${address.substring(0, 30)}...` : address;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const r = row.original;
      
      console.log("Employee data for editing:", r);
      
      return (
        <Button
          size="sm"
          className="bg-black text-white"
          onClick={() =>
            onEdit({
              id: r.id,
              name: r.name,
              email: r.email,
              epfNo: r.epfNo || "",
              nic: r.nic || "",
              jobPosition: r.jobPosition || "",
              imagePath: r.imagePath || "",
              joinDate: r.joinDate || "", // ✅ Pass join date
              address: r.address || "", // ✅ Pass address
            })
          }
        >
          Edit
        </Button>
      );
    },
  },
];