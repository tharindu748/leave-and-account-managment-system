// import { type ColumnDef } from "@tanstack/react-table";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Button } from "@/components/ui/button";
// import { MoreHorizontal } from "lucide-react";

// export type LeaveRequest = {
//   id: number;
//   userId: number;
//   user: {
//     id: number;
//     name: string;
//     email: string;
//   };
//   leaveType: string;
//   reason: string;
//   status: string;
//   dates: {
//     id: number;
//     requestId: number;
//     leaveDate: string;
//     isHalfDay: boolean;
//     halfdayType: string | null;
//   }[];
//   requestedAt: string;
//   approvedAt?: string | null;
//   approvedBy: number;
//   rejectedAt?: string | null;
// };

// export const leaveManageColumns = (
//   handleApprove: (id: number) => void,
//   handleCancel: (id: number) => void
// ): ColumnDef<LeaveRequest>[] => [
//   {
//     accessorFn: (row) => row.user?.name,
//     id: "name",
//     header: "Employee Name",
//     cell: ({ getValue }) => <div>{getValue<string>()}</div>,
//   },
//   {
//     accessorFn: (row) => row.user?.email,
//     id: "email",
//     header: "Email",
//     cell: ({ getValue }) => <div>{getValue<string>()}</div>,
//   },
//   {
//     accessorFn: (row) => row.dates.map((d) => d.leaveDate).join(", "),
//     id: "leaveDates",
//     header: "Leave Dates",
//     cell: ({ getValue }) => {
//       const dates = (getValue<string>() || "").split(", ");
//       return (
//         <div className="flex flex-col gap-1">
//           {dates.map((date, i) => (
//             <span key={i}>{new Date(date).toLocaleDateString()}</span>
//           ))}
//         </div>
//       );
//     },
//   },
//   {
//     accessorFn: (row) =>
//       row.dates.some((d) => d.isHalfDay)
//         ? "Half Day (" +
//           row.dates
//             .filter((d) => d.isHalfDay)
//             .map((d) => d.halfdayType)
//             .join(", ") +
//           ")"
//         : "Full Day",
//     id: "dayType",
//     header: "Half/Full Day",
//     cell: ({ getValue }) => <div>{getValue<string>()}</div>,
//   },
//   {
//     accessorKey: "leaveType",
//     header: "Leave Type",
//     cell: ({ getValue }) => <div>{getValue<string>()}</div>,
//   },
//   {
//     accessorKey: "reason",
//     header: "Reason",
//     cell: ({ getValue }) => <div>{getValue<string>()}</div>,
//   },
//   {
//     accessorKey: "status",
//     header: "Status",
//     cell: ({ getValue }) => <div>{getValue<string>()}</div>,
//   },
//   {
//     accessorFn: (row) => row.requestedAt,
//     id: "requestedAt",
//     header: "Requested At",
//     cell: ({ getValue }) => (
//       <div>{new Date(getValue<string>()).toLocaleString()}</div>
//     ),
//   },
//   {
//     id: "actions",
//     cell: ({ row }) => {
//       const request = row.original;
//       return (
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="ghost" className="h-8 w-8 p-0 float-right">
//               <span className="sr-only">Open menu</span>
//               <MoreHorizontal className="h-4 w-4" />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             <DropdownMenuItem onClick={() => handleApprove(request.id)}>
//               Approve
//             </DropdownMenuItem>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem onClick={() => handleCancel(request.id)}>
//               Reject
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       );
//     },
//     enableHiding: false,
//   },
// ];



import { type ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export type LeaveRequest = {
  id: number;
  userId: number;
  user: {
    imagePath?: string;
    id: number;
    name: string;
    email: string;
    jobPosition?: string;
  };
  leaveType: string;
  reason: string;
  status: string;
  dates: {
    id: number;
    requestId: number;
    leaveDate: string;
    isHalfDay: boolean;
    halfdayType: string | null;
  }[];
  requestedAt: string;
  approvedAt?: string | null;
  approvedBy: number;
  rejectedAt?: string | null;
};

export const leaveManageColumns = (
  handleApprove: (id: number) => void,
  handleCancel: (id: number) => void
): ColumnDef<LeaveRequest>[] => [
  {
    accessorKey: "user",
    header: "Employee",
    cell: ({ row }) => {
      const user = row.original.user;
      
      // Fix: Use accessorKey: "user" instead of "user.imagePath"
      // and construct the image URL properly
      let imageUrl = user.imagePath;
      
      // If imagePath exists and is not already a full URL, construct it
      if (user.imagePath) {
        if (user.imagePath.startsWith('http')) {
          imageUrl = user.imagePath;
        } else {
          // Remove leading slash if present to avoid double slashes
          const cleanImagePath = user.imagePath.startsWith('/') 
            ? user.imagePath.slice(1) 
            : user.imagePath;
          imageUrl = `${import.meta.env.VITE_API_BASE_URL}/${cleanImagePath}`;
        }
      }
      
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage 
              src={imageUrl} 
              alt={user.name}
              className="object-cover"
              onError={(e) => {
                // Image failed to load - AvatarFallback will automatically show
                console.warn('Failed to load user image:', imageUrl);
              }}
            />
            <AvatarFallback className="bg-slate-100 text-slate-600">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="font-medium text-sm">{user.name}</div>
            <div className="text-xs text-muted-foreground">{user.email}</div>
            {user.jobPosition && (
              <div className="text-xs text-slate-400 mt-0.5">{user.jobPosition}</div>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.dates.map((d) => d.leaveDate).join(", "),
    id: "leaveDates",
    header: "Leave Dates",
    cell: ({ getValue }) => {
      const dates = (getValue<string>() || "").split(", ");
      return (
        <div className="flex flex-col gap-1">
          {dates.map((date, i) => (
            <span key={i} className="text-sm">
              {new Date(date).toLocaleDateString()}
            </span>
          ))}
        </div>
      );
    },
  },
  {
    accessorFn: (row) =>
      row.dates.some((d) => d.isHalfDay)
        ? "Half Day (" +
          row.dates
            .filter((d) => d.isHalfDay)
            .map((d) => d.halfdayType || 'Unknown')
            .join(", ") +
          ")"
        : "Full Day",
    id: "dayType",
    header: "Half/Full Day",
    cell: ({ getValue }) => (
      <div className="text-sm">{getValue<string>()}</div>
    ),
  },
  {
    accessorKey: "leaveType",
    header: "Leave Type",
    cell: ({ getValue }) => (
      <div className="text-sm capitalize">{getValue<string>().toLowerCase()}</div>
    ),
  },
  {
    accessorKey: "reason",
    header: "Reason",
    cell: ({ getValue }) => (
      <div 
        className="max-w-[200px] truncate text-sm" 
        title={getValue<string>() || "No reason provided"}
      >
        {getValue<string>() || "No reason provided"}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const status = getValue<string>();
      const statusColors = {
        PENDING: "text-yellow-600 bg-yellow-100",
        APPROVED: "text-green-600 bg-green-100",
        REJECTED: "text-red-600 bg-red-100",
        CANCELLED: "text-gray-600 bg-gray-100",
      };
      
      const colorClass = statusColors[status as keyof typeof statusColors] || "text-gray-600 bg-gray-100";
      
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
          {status}
        </span>
      );
    },
  },
  {
    accessorFn: (row) => row.requestedAt,
    id: "requestedAt",
    header: "Requested At",
    cell: ({ getValue }) => (
      <div className="text-sm">{new Date(getValue<string>()).toLocaleDateString()}</div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const request = row.original;
      const isPending = request.status === "PENDING";
      const isApproved = request.status === "APPROVED";

      return (
        <div className="flex items-center gap-2">
          {isPending && (
            <>
              <Button
                size="sm"
                onClick={() => handleApprove(request.id)}
                className="h-8 bg-green-600 hover:bg-green-700 text-white"
              >
                Approve
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleCancel(request.id)}
                className="h-8"
              >
                Reject
              </Button>
            </>
          )}
          {isApproved && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleCancel(request.id)}
              className="h-8"
            >
              Cancel
            </Button>
          )}
          {!isPending && !isApproved && (
            <span className="text-xs text-slate-500">No actions</span>
          )}
        </div>
      );
    },
  },
];