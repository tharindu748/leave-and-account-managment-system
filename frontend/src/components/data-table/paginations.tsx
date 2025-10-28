// import { type Table } from "@tanstack/react-table";
// import {
//   ChevronLeft,
//   ChevronRight,
//   ChevronsLeft,
//   ChevronsRight,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// interface DataTablePaginationProps<TData> {
//   table: Table<TData>;
// }

// export function DataTablePagination<TData>({
//   table,
// }: DataTablePaginationProps<TData>) {
//   return (
//     <div className="flex items-center justify-between px-2">
//       <div className="text-muted-foreground flex-1 text-sm">
//         {table.getFilteredSelectedRowModel().rows.length} of{" "}
//         {table.getFilteredRowModel().rows.length} row(s) selected.
//       </div>
//       <div className="flex items-center space-x-6 lg:space-x-8">
//         <div className="flex items-center space-x-2">
//           <p className="text-sm font-medium">Rows per page</p>
//           <Select
//             value={`${table.getState().pagination.pageSize}`}
//             onValueChange={(value) => {
//               table.setPageSize(Number(value));
//             }}
//           >
//             <SelectTrigger className="h-8 w-[70px]">
//               <SelectValue placeholder={table.getState().pagination.pageSize} />
//             </SelectTrigger>
//             <SelectContent side="top">
//               {[10, 20, 25, 30, 40, 50].map((pageSize) => (
//                 <SelectItem key={pageSize} value={`${pageSize}`}>
//                   {pageSize}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>
//         <div className="flex w-[100px] items-center justify-center text-sm font-medium">
//           Page {table.getState().pagination.pageIndex + 1} of{" "}
//           {table.getPageCount()}
//         </div>
//         <div className="flex items-center space-x-2">
//           <Button
//             variant="outline"
//             size="icon"
//             className="hidden size-8 lg:flex"
//             onClick={() => table.setPageIndex(0)}
//             disabled={!table.getCanPreviousPage()}
//           >
//             <span className="sr-only">Go to first page</span>
//             <ChevronsLeft />
//           </Button>
//           <Button
//             variant="outline"
//             size="icon"
//             className="size-8"
//             onClick={() => table.previousPage()}
//             disabled={!table.getCanPreviousPage()}
//           >
//             <span className="sr-only">Go to previous page</span>
//             <ChevronLeft />
//           </Button>
//           <Button
//             variant="outline"
//             size="icon"
//             className="size-8"
//             onClick={() => table.nextPage()}
//             disabled={!table.getCanNextPage()}
//           >
//             <span className="sr-only">Go to next page</span>
//             <ChevronRight />
//           </Button>
//           <Button
//             variant="outline"
//             size="icon"
//             className="hidden size-8 lg:flex"
//             onClick={() => table.setPageIndex(table.getPageCount() - 1)}
//             disabled={!table.getCanNextPage()}
//           >
//             <span className="sr-only">Go to last page</span>
//             <ChevronsRight />
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }
import { type Table } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  // Don't show pagination if there are no rows
  if (table.getRowModel().rows.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-4">
      {/* Selected rows info - top on mobile, left on desktop */}
      <div className="text-muted-foreground text-sm order-1 sm:order-none">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      
      {/* Pagination controls */}
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 lg:gap-8 order-2 sm:order-none w-full sm:w-auto">
        {/* Rows per page - full width on mobile */}
        <div className="flex items-center justify-between w-full sm:w-auto sm:justify-start gap-2">
          <p className="text-sm font-medium whitespace-nowrap">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[5,10, 20, 25, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Page info and navigation */}
        <div className="flex items-center justify-between w-full sm:w-auto gap-4">
          {/* Page info */}
          <div className="flex items-center justify-center text-sm font-medium min-w-[100px]">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}