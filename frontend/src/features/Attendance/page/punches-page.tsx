// "use client";

// import { DataTable3 } from "@/components/data-table";
// import PageHeaderTitle from "@/components/page-header/title";
// import PageHeader from "@/components/page-header/wrapper";
// import type { OutletContextType } from "@/layouts/main-layout";
// import { useEffect, useMemo, useState, useRef } from "react"; // Added useRef
// import { useOutletContext } from "react-router";
// import { columns, type Punches } from "../components/Table/columns";
// import api from "@/api/axios";

// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Button } from "@/components/ui/button";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { Input } from "@/components/ui/input";

// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { Calendar } from "@/components/ui/calendar";
// import { CalendarIcon, X } from "lucide-react";
// import {
//   format,
//   addDays,
//   startOfDay,
//   endOfDay,
//   startOfMonth,
//   endOfMonth,
//   subDays,
//   startOfWeek,
//   endOfWeek,
//   set,
// } from "date-fns";
// import type { DateRange } from "react-day-picker";
// import AddManualPunchDialog from "../components/add-manual-punch-dialog";
// import { useAuth } from "@/context/auth-context";

// const filterSchema = z.object({
//   employeeId: z.string().optional(),
//   name: z.string().optional(),
//   dateRange: z
//     .object({
//       from: z.date().nullable().optional(),
//       to: z.date().nullable().optional(),
//     })
//     .optional(),
// });

// export type User = {
//   id: string;
//   name: string;
//   email?: string;
//   epfNo?: string;
//   nic?: string;
//   jobPosition?: string;
//   currentUserId: number | undefined;
// };

// type FilterFormValues = z.infer<typeof filterSchema>;

// function useIsMobile() {
//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {
//     const mql = window.matchMedia("(max-width: 640px)");
//     const update = () => setIsMobile(mql.matches);
//     update();
//     mql.addEventListener?.("change", update);
//     return () => mql.removeEventListener?.("change", update);
//   }, []);
//   return isMobile;
// }

// function PunchesPage() {
//   const { user } = useAuth();
//   const { setBreadcrumb } = useOutletContext<OutletContextType>();
//   const [data, setData] = useState<Punches[]>([]);
//   const [open, setOpen] = useState(false);
//   const [addPunchToggle, setAddPunchToggle] = useState(false);
//   const isMobile = useIsMobile();
//   const currentUserId = user?.id;

//   const form = useForm<FilterFormValues>({
//     resolver: zodResolver(filterSchema),
//     defaultValues: {
//       employeeId: "",
//       name: "",
//       dateRange: undefined,
//     },
//   });

//   const onSubmit = async (values: FilterFormValues) => {
//     form.clearErrors("root.serverError");

//     try {
//       const params = new URLSearchParams();

//       const employeeId = values.employeeId?.trim();
//       if (employeeId) params.set("employeeId", employeeId);

//       const name = values.name?.trim();
//       if (name) params.set("name", name);

//       if (values.dateRange?.from && values.dateRange?.to) {
//         params.set("from", values.dateRange.from.toISOString());
//         params.set("to", values.dateRange.to.toISOString());
//       } else if (values.dateRange?.from) {
//         params.set("date", values.dateRange.from.toISOString());
//       }

//       const res = await api.get(`/punches?${params.toString()}`);
//       setData(res.data);
//     } catch (err: any) {
//       form.setError("root.serverError", {
//         type: "server",
//         message: "Failed to fetch punches",
//       });
//     }
//   };

//   const fetchPunches = async () => {
//     try {
//       const res = await api.get(`/punches/latest?limit=10`);
//       setData(res.data);
//       console.log(res.data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     fetchPunches();
//   }, []);

//   const handleDelete = async (requestId: number) => {
//     try {
//       await api.put(`/punches/${requestId}`);
//       fetchPunches();
//     } catch (error) {
//       console.error("Error approving request:", error);
//     }
//   };

//   useEffect(() => {
//     setBreadcrumb(["Attendance", "Punches"]);
//   }, []);

//   const today = new Date();
//   const presets: { label: string; range: DateRange }[] = useMemo(
//     () => [
//       {
//         label: "Today",
//         range: { from: startOfDay(today), to: endOfDay(today) },
//       },
//       {
//         label: "Yesterday",
//         range: {
//           from: startOfDay(subDays(today, 1)),
//           to: endOfDay(subDays(today, 1)),
//         },
//       },
//       {
//         label: "Last 7 days",
//         range: { from: startOfDay(subDays(today, 6)), to: endOfDay(today) },
//       },
//       {
//         label: "This week",
//         range: {
//           from: startOfWeek(today),
//           to: endOfWeek(today),
//         },
//       },
//       {
//         label: "This month",
//         range: { from: startOfMonth(today), to: endOfMonth(today) },
//       },
//     ],
//     [today]
//   );

//   const prettyLabel = (range?: DateRange) => {
//     if (!range?.from) return "Pick a date or range";
//     if (range.from && range.to) {
//       return `${format(range.from, "PPP")} – ${format(range.to, "PPP")}`;
//     }
//     return format(range.from, "PPP");
//   };

//   const applyAndClose = async () => {
//     await onSubmit(form.getValues());
//     setOpen(false);
//   };

//   return (
//     <>
//       <PageHeader>
//         <div>
//           <PageHeaderTitle value="Punches" />
//         </div>
//       </PageHeader>

//       <div className="rounded-lg border p-6">
//         <div className="rounded-lg border p-6 mt-3">
//           <h2 className="mb-4 font-semibold">Search Punches</h2>

//           <Form {...form}>
//             <form
//               onSubmit={form.handleSubmit(onSubmit)}
//               className="flex items-end space-x-4"
//             >
//               <FormField
//                 control={form.control}
//                 name="employeeId"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Employee ID</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Enter employee id" {...field} />
//                     </FormControl>
//                     <FormMessage className="text-xs" />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="name"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Employee Name</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Enter employee id" {...field} />
//                     </FormControl>
//                     <FormMessage className="text-xs" />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="dateRange"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Date / Date Range</FormLabel>
//                     <FormControl>
//                       <Popover open={open} onOpenChange={setOpen}>
//                         <PopoverTrigger asChild>
//                           <Button
//                             variant="outline"
//                             className="w-full sm:w-[360px] justify-start text-left font-normal"
//                           >
//                             <CalendarIcon className="mr-2 h-4 w-4" />
//                             <span className="truncate">
//                               {prettyLabel(
//                                 field.value as DateRange | undefined
//                               )}
//                             </span>
//                             {field.value?.from && (
//                               <X
//                                 className="ml-auto h-4 w-4 opacity-50 hover:opacity-100"
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   field.onChange(undefined);
//                                 }}
//                               />
//                             )}
//                           </Button>
//                         </PopoverTrigger>

//                         <PopoverContent
//                           align="start"
//                           sideOffset={8}
//                           className="w-[calc(100vw-2rem)] max-w-[720px] p-0"
//                         >
//                           <div className="flex flex-col sm:flex-row sm:divide-x">
//                             {/* Left: Calendar */}
//                             <div className="p-3">
//                               <Calendar
//                                 initialFocus
//                                 mode="range"
//                                 numberOfMonths={isMobile ? 1 : 2}
//                                 selected={field.value as DateRange | undefined}
//                                 onSelect={(range) => {
//                                   field.onChange(range);
//                                   // auto-close when a full range is set
//                                   if (range?.from && range?.to) {
//                                     // small delay so the UI updates before closing
//                                     setTimeout(() => setOpen(false), 50);
//                                   }
//                                 }}
//                                 className="rounded-md border"
//                                 // nicer day states (optional)
//                                 classNames={{
//                                   day_selected:
//                                     "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
//                                   day_today: "font-semibold",
//                                   day_outside:
//                                     "text-muted-foreground opacity-50",
//                                 }}
//                               />
//                             </div>

//                             {/* Right: Presets & actions */}
//                             <div className="w-full sm:w-[240px] p-3 space-y-3">
//                               <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
//                                 Quick presets
//                               </div>
//                               <div className="grid grid-cols-2 gap-2">
//                                 {presets.map((p) => (
//                                   <Button
//                                     key={p.label}
//                                     type="button"
//                                     variant="secondary"
//                                     size="sm"
//                                     onClick={() => {
//                                       form.setValue("dateRange", p.range);
//                                       // immediately submit and close for faster UX
//                                       applyAndClose();
//                                     }}
//                                   >
//                                     {p.label}
//                                   </Button>
//                                 ))}
//                               </div>

//                               <div className="flex items-center justify-between pt-2">
//                                 <Button
//                                   type="button"
//                                   variant="ghost"
//                                   size="sm"
//                                   onClick={() =>
//                                     form.setValue("dateRange", undefined)
//                                   }
//                                 >
//                                   Clear
//                                 </Button>
//                                 <Button
//                                   type="button"
//                                   size="sm"
//                                   onClick={applyAndClose}
//                                   disabled={!form.getValues().dateRange?.from}
//                                 >
//                                   Apply
//                                 </Button>
//                               </div>
//                             </div>
//                           </div>
//                         </PopoverContent>
//                       </Popover>
//                     </FormControl>
//                     <FormMessage className="text-xs" />
//                   </FormItem>
//                 )}
//               />

//               {form.formState.errors.root?.serverError && (
//                 <div className="text-center text-xs text-destructive">
//                   {form.formState.errors.root.serverError.message}
//                 </div>
//               )}

//               <Button
//                 type="submit"
//                 className=""
//                 disabled={form.formState.isSubmitting}
//               >
//                 {form.formState.isSubmitting ? "Loading..." : "Search"}
//               </Button>

//               <Button type="button" onClick={() => setAddPunchToggle(true)}>
//                 Add Manual Punch
//               </Button>
//             </form>
//           </Form>

//           <div className="mt-8">
//             <DataTable3 columns={columns(handleDelete)} data={data} />
//           </div>
//         </div>
//       </div>
//       {addPunchToggle && (
//         <AddManualPunchDialog
//           open={addPunchToggle}
//           onOpenChange={setAddPunchToggle}
//           onSaved={fetchPunches}
//           currentUserId={currentUserId}
//         />
//       )}
//     </>
//   );
// }

// export default PunchesPage;
"use client";

import { DataTable3 } from "@/components/data-table";
import PageHeaderTitle from "@/components/page-header/title";
import PageHeader from "@/components/page-header/wrapper";
import type { OutletContextType } from "@/layouts/main-layout";
import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router";
import { columns, type Punches } from "../components/Table/columns";
import api from "@/api/axios";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, PlusCircle, X, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import {
  format,
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
  subDays,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import type { DateRange } from "react-day-picker";
import AddManualPunchDialog from "../components/add-manual-punch-dialog";
import { useAuth } from "@/context/auth-context";

// --- Zod Schema ---
const filterSchema = z.object({
  employeeId: z.string().optional(),
  name: z.string().optional(),
  dateRange: z
    .object({
      from: z.date().nullable().optional(),
      to: z.date().nullable().optional(),
    })
    .optional(),
});

type FilterFormValues = z.infer<typeof filterSchema>;

// --- User Type ---
export type User = {
  id: string;
  name: string;
  email?: string;
  epfNo?: string;
  nic?: string;
  jobPosition?: string;
  currentUserId: number | undefined;
};

// --- Mobile Hook ---
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 768px)"); // md breakpoint
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener?.("change", update);
    return () => mql.removeEventListener?.("change", update);
  }, []);
  return isMobile;
}

// --- Custom Pagination Component ---
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

function MobileResponsivePagination({ 
  currentPage, 
  totalPages, 
  onPageChange,
  className = "" 
}: PaginationProps) {
  const isMobile = useIsMobile();

  if (totalPages <= 1) return null;

  // Generate page numbers to show
  const getPageNumbers = () => {
    if (isMobile) {
      // Mobile: Show current page and ellipsis if needed
      if (totalPages <= 3) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
      }
      
      if (currentPage <= 2) {
        return [1, 2, 3];
      } else if (currentPage >= totalPages - 1) {
        return [totalPages - 2, totalPages - 1, totalPages];
      } else {
        return [currentPage - 1, currentPage, currentPage + 1];
      }
    } else {
      // Desktop: Show more pages
      const pages = [];
      const showPages = 5;
      
      let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
      let endPage = Math.min(totalPages, startPage + showPages - 1);
      
      if (endPage - startPage + 1 < showPages) {
        startPage = Math.max(1, endPage - showPages + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      return pages;
    }
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className={`flex items-center justify-between ${className}`}>
      {/* Mobile: Compact pagination */}
      {isMobile ? (
        <div className="flex items-center gap-2 w-full justify-between">
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-sm text-muted-foreground px-2">
              {currentPage} of {totalPages}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        // Desktop: Full pagination
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-1">
            {pageNumbers[0] > 1 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(1)}
                  className="h-8 w-8 p-0"
                >
                  1
                </Button>
                {pageNumbers[0] > 2 && (
                  <span className="px-1 text-muted-foreground">...</span>
                )}
              </>
            )}
            
            {pageNumbers.map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(page)}
                className="h-8 w-8 p-0"
              >
                {page}
              </Button>
            ))}
            
            {pageNumbers[pageNumbers.length - 1] < totalPages && (
              <>
                {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                  <span className="px-1 text-muted-foreground">...</span>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(totalPages)}
                  className="h-8 w-8 p-0"
                >
                  {totalPages}
                </Button>
              </>
            )}
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Page Component ---
function PunchesPage() {
  const { user } = useAuth();
  const { setBreadcrumb } = useOutletContext<OutletContextType>();
  const [data, setData] = useState<Punches[]>([]);
  const [open, setOpen] = useState(false);
  const [addPunchToggle, setAddPunchToggle] = useState(false);
  const isMobile = useIsMobile();
  const currentUserId = user?.id;

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const form = useForm<FilterFormValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      employeeId: "",
      name: "",
      dateRange: undefined,
    },
  });

  const onSubmit = async (values: FilterFormValues) => {
    form.clearErrors("root.serverError");
    try {
      const params = new URLSearchParams();
      const { employeeId, name, dateRange } = values;

      if (employeeId?.trim()) params.set("employeeId", employeeId.trim());
      if (name?.trim()) params.set("name", name.trim());
      if (dateRange?.from) params.set("from", dateRange.from.toISOString());
      if (dateRange?.to) params.set("to", dateRange.to.toISOString());

      const res = await api.get(`/punches?${params.toString()}`);
      setData(res.data);
      setCurrentPage(1); // Reset to first page on new search
    } catch (err: any) {
      form.setError("root.serverError", {
        type: "server",
        message: "Failed to fetch punches",
      });
    }
  };

  const fetchPunches = async () => {
    try {
      const res = await api.get(`/punches/latest?limit=100`); // Fetch more for pagination
      setData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPunches();
    setBreadcrumb(["Attendance", "Punches"]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setBreadcrumb]);

  const handleDelete = async (requestId: number) => {
    try {
      await api.put(`/punches/${requestId}`);
      fetchPunches(); // Refetch data after deletion
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  // --- Date Presets ---
  const today = new Date();
  const presets: { label: string; range: DateRange }[] = useMemo(
    () => [
      {
        label: "Today",
        range: { from: startOfDay(today), to: endOfDay(today) },
      },
      {
        label: "Yesterday",
        range: {
          from: startOfDay(subDays(today, 1)),
          to: endOfDay(subDays(today, 1)),
        },
      },
      {
        label: "Last 7 days",
        range: { from: startOfDay(subDays(today, 6)), to: endOfDay(today) },
      },
      {
        label: "This week",
        range: {
          from: startOfWeek(today),
          to: endOfWeek(today),
        },
      },
      {
        label: "This month",
        range: { from: startOfMonth(today), to: endOfMonth(today) },
      },
    ],
    [today]
  );

  const prettyLabel = (range?: DateRange) => {
    if (!range?.from) return "Pick a date or range";
    if (range.from && range.to) {
      return `${format(range.from, "PPP")} – ${format(range.to, "PPP")}`;
    }
    return format(range.from, "PPP");
  };

  const applyAndClose = async () => {
    await onSubmit(form.getValues());
    setOpen(false);
  };

  return (
    <>
      <PageHeader>
        <PageHeaderTitle value="Punches" />
        <Button onClick={() => setAddPunchToggle(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Manual Punch
        </Button>
      </PageHeader>

      {/* ✅ Added padding for mobile (p-4) and desktop (md:p-6) */}
      <div className="p-4 md:p-6 space-y-6">
        {/* --- Filter Card --- */}
        <Card>
          <CardHeader>
            <CardTitle>Search Punches</CardTitle>
            <CardDescription>
              Filter punches by employee or date range.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col md:flex-row md:flex-wrap md:items-end gap-4"
              >
                <FormField
                  control={form.control}
                  name="employeeId"
                  render={({ field }) => (
                    <FormItem className="flex-1 min-w-[200px]">
                      <FormLabel>Employee ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter employee id" {...field} />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex-1 min-w-[200px]">
                      <FormLabel>Employee Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter employee name" {...field} />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateRange"
                  render={({ field }) => (
                    <FormItem className="flex-1 min-w-[240px]">
                      <FormLabel>Date / Date Range</FormLabel>
                      <FormControl>
                        <Popover open={open} onOpenChange={setOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              <span className="truncate">
                                {prettyLabel(
                                  field.value as DateRange | undefined
                                )}
                              </span>
                              {field.value?.from && (
                                <X
                                  className="ml-auto h-4 w-4 opacity-50 hover:opacity-100"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    field.onChange(undefined);
                                  }}
                                />
                              )}
                            </Button>
                          </PopoverTrigger>

                          <PopoverContent
                            align="start"
                            sideOffset={8}
                            className="w-[calc(100vw-2rem)] max-w-[720px] p-0"
                          >
                            <div className="flex flex-col sm:flex-row sm:divide-x">
                              <div className="p-3">
                                <Calendar
                                  initialFocus
                                  mode="range"
                                  numberOfMonths={isMobile ? 1 : 2}
                                  selected={field.value as DateRange | undefined}
                                  onSelect={(range) => {
                                    field.onChange(range);
                                    if (range?.from && range?.to) {
                                      setTimeout(() => setOpen(false), 50);
                                    }
                                  }}
                                  className="rounded-md"
                                />
                              </div>
                              <div className="w-full sm:w-[240px] p-3 space-y-3">
                                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                  Quick presets
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  {presets.map((p) => (
                                    <Button
                                      key={p.label}
                                      type="button"
                                      variant="secondary"
                                      size="sm"
                                      onClick={() => {
                                        form.setValue("dateRange", p.range);
                                        applyAndClose();
                                      }}
                                    >
                                      {p.label}
                                    </Button>
                                  ))}
                                </div>
                                <div className="flex items-center justify-between pt-2">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      form.setValue("dateRange", undefined)
                                    }
                                  >
                                    Clear
                                  </Button>
                                  <Button
                                    type="button"
                                    size="sm"
                                    onClick={applyAndClose}
                                    disabled={!form.getValues().dateRange?.from}
                                  >
                                    Apply
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {form.formState.errors.root?.serverError && (
                  <div className="w-full text-center text-xs text-destructive">
                    {form.formState.errors.root.serverError.message}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full md:w-auto"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? "Loading..." : "Search"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* --- Results Card --- */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Punch History</CardTitle>
                <CardDescription>
                  Showing {startIndex + 1}-{Math.min(endIndex, data.length)} of {data.length} records
                </CardDescription>
              </div>
              
              {/* Items per page selector */}
              <div className="flex items-center gap-2">
                <label htmlFor="itemsPerPage" className="text-sm text-muted-foreground whitespace-nowrap">
                  Rows per page:
                </label>
                <select
                  id="itemsPerPage"
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="border rounded px-2 py-1 text-sm bg-background"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <DataTable3 columns={columns(handleDelete)} data={currentData} />
            
            {/* Mobile Responsive Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </div>
                
                <MobileResponsivePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  className="w-full sm:w-auto"
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* --- Dialog --- */}
      {addPunchToggle && (
        <AddManualPunchDialog
          open={addPunchToggle}
          onOpenChange={setAddPunchToggle}
          onSaved={fetchPunches}
          currentUserId={currentUserId}
        />
      )}
    </>
  );
}

export default PunchesPage;