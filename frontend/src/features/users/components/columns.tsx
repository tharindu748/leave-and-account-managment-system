import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import type { User } from "../pages";
import { User as UserIcon, Calendar, MapPin, Trash2, Edit } from "lucide-react";

export type Employee = {
  id: number;
  name: string;
  email: string;
  epfNo: string | null;
  nic: string | null;
  jobPosition: string | null;
  employeeId?: string | null;
  imagePath?: string | null;
  joinDate?: string | null;
  address?: string | null;
};

export const columns = (
  onEdit: (user: User) => void,
  onDelete: (user: User) => void // ✅ Accept delete handler
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
          <div className="w-10 h-10 rounded-full border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={employee.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    const fallback = parent.querySelector('.image-fallback') as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                    e.currentTarget.style.display = 'none';
                  }
                }}
              />
            ) : null}
            <div className={`image-fallback w-full h-full flex items-center justify-center bg-gray-100 ${imageUrl ? 'hidden' : 'flex'}`}>
              <UserIcon className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>
      );
    },
  },
  { 
    accessorKey: "id",
    header: "Employee ID",
    size: 80,
  },
  { 
    accessorKey: "employeeId",
    header: "ID",
    cell: ({ row }) => row.original.employeeId || "—"
  },
  { 
    accessorKey: "name", 
    header: "Name",
    size: 150,
  },
  { 
    accessorKey: "email", 
    header: "Email",
    size: 200,
  },
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
    header: () => (
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4" />
        Join Date
      </div>
    ),
    cell: ({ row }) => {
      const joinDate = row.original.joinDate;
      if (!joinDate) return "—";
      
      try {
        return new Date(joinDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      } catch {
        return "Invalid Date";
      }
    },
  },
  {
    id: "address",
    header: () => (
      <div className="flex items-center gap-2">
        <MapPin className="w-4 h-4" />
        Address
      </div>
    ),
    cell: ({ row }) => {
      const address = row.original.address;
      if (!address) return "—";
      
      return address.length > 30 ? `${address.substring(0, 30)}...` : address;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const employee = row.original;
      
      return (
        <div className="flex items-center gap-2">
          {/* Edit Button */}
          <Button
            size="sm"
            variant="outline"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() =>
              onEdit({
                id: employee.id,
                name: employee.name,
                email: employee.email,
                employeeId: employee.employeeId || "",
                epfNo: employee.epfNo || "",
                nic: employee.nic || "",
                jobPosition: employee.jobPosition || "",
                imagePath: employee.imagePath || "",
                joinDate: employee.joinDate || "",
                address: employee.address || "",
              })
            }
          >
            <Edit className="w-4 h-4" />
          </Button>
          
          {/* Delete Button */}
          <Button
            size="sm"
            variant="outline"
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={() =>
              onDelete({
                id: employee.id,
                name: employee.name,
                email: employee.email,
                employeeId: employee.employeeId || "",
                epfNo: employee.epfNo || "",
                nic: employee.nic || "",
                jobPosition: employee.jobPosition || "",
                imagePath: employee.imagePath || "",
                joinDate: employee.joinDate || "",
                address: employee.address || "",
              })
            }
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      );
    },
  },
];