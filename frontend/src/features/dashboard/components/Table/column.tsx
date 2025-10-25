import { type ColumnDef } from "@tanstack/react-table";

export type LeaveRequest = {
  name: string;
  late: number;
  workingDays: number;
};

export const columns: ColumnDef<LeaveRequest>[] = [
  {
    accessorFn: (row) => row.name,
    id: "name",
    header: "Name",
    cell: ({ getValue }) => <div>{getValue<string>()}</div>,
  },
  {
    accessorFn: (row) => row.late,
    id: "late",
    header: "Late",
    cell: ({ getValue }) => <div>{getValue<string>()}</div>,
  },
  {
    accessorFn: (row) => row.workingDays,
    id: "workingDays",
    header: "Working Days",
    cell: ({ getValue }) => <div>{getValue<string>()}</div>,
  },
];




// import * as React from "react";
// import {
//   useReactTable,
//   getCoreRowModel,
//   flexRender,
//   ColumnDef,
// } from "@tanstack/react-table";

// export type LeaveRequest = {
//   name: string;
//   late: number;
//   workingDays: number;
// };

// export const columns: ColumnDef<LeaveRequest>[] = [
//   {
//     accessorKey: "name",
//     header: "Name",
//     cell: (info) => <span>{info.getValue() as string}</span>,
//   },
//   {
//     accessorKey: "late",
//     header: "Late",
//     cell: (info) => <span>{info.getValue() as number}</span>,
//   },
//   {
//     accessorKey: "workingDays",
//     header: "Working Days",
//     cell: (info) => <span>{info.getValue() as number}</span>,
//   },
// ];

// const data: LeaveRequest[] = [
//   { name: "John", late: 2, workingDays: 20 },
//   { name: "Kavindu", late: 0, workingDays: 22 },
//   { name: "Nimali", late: 1, workingDays: 21 },
// ];

// export default function ResponsiveLeaveTable() {
//   const table = useReactTable({
//     data,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//   });

//   return (
//     <div className="w-full overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
//       <table className="min-w-full text-sm text-gray-800">
//         <thead className="bg-gray-100 text-left text-gray-700">
//           {table.getHeaderGroups().map((headerGroup) => (
//             <tr key={headerGroup.id}>
//               {headerGroup.headers.map((header) => (
//                 <th key={header.id} className="px-4 py-2 font-semibold">
//                   {flexRender(header.column.columnDef.header, header.getContext())}
//                 </th>
//               ))}
//             </tr>
//           ))}
//         </thead>
//         <tbody>
//           {table.getRowModel().rows.map((row) => (
//             <tr
//               key={row.id}
//               className="border-t hover:bg-gray-50 transition-colors duration-150"
//             >
//               {row.getVisibleCells().map((cell) => (
//                 <td key={cell.id} className="px-4 py-2 whitespace-nowrap">
//                   {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }
