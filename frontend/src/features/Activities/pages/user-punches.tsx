// "use client";

// import { DataTable3 } from "@/components/data-table";
// import PageHeaderTitle from "@/components/page-header/title";
// import PageHeader from "@/components/page-header/wrapper";
// import type { OutletContextType } from "@/layouts/main-layout";
// import { useEffect, useMemo, useState } from "react";
// import { useOutletContext } from "react-router";
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

// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { Calendar } from "@/components/ui/calendar";
// import { CalendarIcon, X } from "lucide-react";
// import {
//   format,
//   startOfDay,
//   endOfDay,
//   startOfMonth,
//   endOfMonth,
//   subDays,
//   startOfWeek,
//   endOfWeek,
// } from "date-fns";
// import type { DateRange } from "react-day-picker";
// import {
//   userPunchColumns,
//   type Punches,
// } from "../components/table/user-punch-columns";
// import { useAuth } from "@/context/auth-context";
// import { toast } from "sonner";

// const filterSchema = z.object({
//   employeeId: z.string().min(1, "Employee ID is required"),
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

// function UserPunchesPage() {
//   const { setBreadcrumb } = useOutletContext<OutletContextType>();
//   const [data, setData] = useState<Punches[]>([]);
//   const [open, setOpen] = useState(false);
//   const isMobile = useIsMobile();
//   const { user } = useAuth();

//   const form = useForm<FilterFormValues>({
//     resolver: zodResolver(filterSchema),
//     defaultValues: {
//       dateRange: undefined,
//     },
//   });

//   const onSubmit = async (values: FilterFormValues) => {
//     form.clearErrors("root.serverError");

//     try {
//       let query = user?.employeeId + "";
//       if (values.dateRange?.from && values.dateRange?.to) {
//         query = `?from=${values.dateRange.from.toISOString()}&to=${values.dateRange.to.toISOString()}`;
//       } else if (values.dateRange?.from) {
//         query = `?date=${values.dateRange.from.toISOString()}`;
//       }

//       const res = await api.get(`/punches/${query}`);
//       setData(res.data);
//     } catch (error: any) {
//       form.setError("root.serverError", {
//         type: "server",
//         message: "Failed to fetch punches",
//       });
//       toast.error(error?.response?.data?.message || "Failed to fetch punches");
//     }
//   };

//   const fetchPunches = async () => {
//     try {
//       const res = await api.get(
//         `/punches/latest?employeeId=${user?.employeeId}`
//       );
//       setData(res.data);
//     } catch (error: any) {
//       toast.error(error?.response?.data?.message || "Failed to fetch punches");
//     }
//   };

//   useEffect(() => {
//     setBreadcrumb(["Activity", "Punches"]);
//     fetchPunches();
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
//             </form>
//           </Form>

//           <div className="mt-8">
//             <DataTable3 columns={userPunchColumns} data={data} />
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default UserPunchesPage;
"use client";

import { DataTable3 } from "@/components/data-table";
import PageHeaderTitle from "@/components/page-header/title";
import PageHeader from "@/components/page-header/wrapper";
import type { OutletContextType } from "@/layouts/main-layout";
import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router";
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
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // Added Card components
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, X } from "lucide-react";
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
import {
  userPunchColumns,
  type Punches,
} from "../components/table/user-punch-columns";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";

// This schema isn't fully utilized by the form, but we'll keep it as is.
const filterSchema = z.object({
  employeeId: z.string().min(1, "Employee ID is required"),
  dateRange: z
    .object({
      from: z.date().nullable().optional(),
      to: z.date().nullable().optional(),
    })
    .optional(),
});

export type User = {
  id: string;
  name: string;
  email?: string;
  epfNo?: string;
  nic?: string;
  jobPosition?: string;
  currentUserId: number | undefined;
};

type FilterFormValues = z.infer<typeof filterSchema>;

// This hook is well-implemented and useful for the calendar.
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 640px)"); // sm breakpoint
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener?.("change", update);
    return () => mql.removeEventListener?.("change", update);
  }, []);
  return isMobile;
}

function UserPunchesPage() {
  const { setBreadcrumb } = useOutletContext<OutletContextType>();
  const [data, setData] = useState<Punches[]>([]);
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  const { user } = useAuth();

  const form = useForm<FilterFormValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      dateRange: undefined,
      employeeId: user?.employeeId || "", // Pre-fill from context
    },
  });

  // Update default employeeId when user context changes
  useEffect(() => {
    if (user?.employeeId) {
      form.setValue("employeeId", user.employeeId);
    }
  }, [user, form]);

  const onSubmit = async (values: FilterFormValues) => {
    form.clearErrors("root.serverError");

    try {
      // **REFACTORED/FIXED API CALL**
      // Use a params object to build the query string correctly.
      // This fixes the bug where employeeId was lost when a date was set.
      const params: { employeeId: string; from?: string; to?: string; date?: string } = {
        employeeId: String(user?.employeeId),
      };

      if (values.dateRange?.from && values.dateRange?.to) {
        params.from = values.dateRange.from.toISOString();
        params.to = values.dateRange.to.toISOString();
      } else if (values.dateRange?.from) {
        // Handle single date selection (as in original logic)
        params.date = values.dateRange.from.toISOString();
      }
      
      // Assuming the search endpoint is /punches
      // If no date is selected, it will just search by employeeId
      const res = await api.get("/punches", { params });
      setData(res.data);
    } catch (error: any) {
      form.setError("root.serverError", {
        type: "server",
        message: "Failed to fetch punches",
      });
      toast.error(error?.response?.data?.message || "Failed to fetch punches");
    }
  };

  const fetchPunches = async () => {
    if (!user?.employeeId) return; // Don't fetch if no user
    try {
      const res = await api.get(
        `/punches/latest?employeeId=${user?.employeeId}`
      );
      setData(res.data);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to fetch punches");
    }
  };
  
  // New handler for the Reset button
  const handleReset = () => {
    form.reset({ dateRange: undefined, employeeId: user?.employeeId || "" });
    fetchPunches(); // Re-fetch the initial "latest" data
  };

  useEffect(() => {
    setBreadcrumb(["Activity", "Punches"]);
    fetchPunches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        <div>
          <PageHeaderTitle value="Punches" />
        </div>
      </PageHeader>

      {/* New responsive layout wrapper */}
      <div className="p-4 md:p-6 space-y-6">
        {/* Card for Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Search Punches</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                // **UPDATED FOR RESPONSIVENESS**
                // Stacks vertically on mobile, horizontal on sm+
                className="flex flex-col sm:flex-row sm:items-end gap-4"
              >
                <FormField
                  control={form.control}
                  name="dateRange"
                  render={({ field }) => (
                    // flex-grow makes the date picker take available space
                    <FormItem className="flex-grow"> 
                      <FormLabel>Date / Date Range</FormLabel>
                      <FormControl>
                        <Popover open={open} onOpenChange={setOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              // w-full on mobile, 360px on sm+
                              className="w-full sm:w-[360px] justify-start text-left font-normal"
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
                              {/* Left: Calendar */}
                              <div className="p-3">
                                <Calendar
                                  initialFocus
                                  mode="range"
                                  numberOfMonths={isMobile ? 1 : 2}
                                  selected={field.value as DateRange | undefined}
                                  onSelect={(range) => {
                                    field.onChange(range);
                                    // auto-close when a full range is set
                                    if (range?.from && range?.to) {
                                      // small delay so the UI updates before closing
                                      setTimeout(() => setOpen(false), 50);
                                    }
                                  }}
                                  className="rounded-md" // Removed redundant border
                                  classNames={{
                                    day_selected:
                                      "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                                    day_today:
                                      "bg-accent text-accent-foreground font-semibold",
                                    day_outside:
                                      "text-muted-foreground opacity-50",
                                  }}
                                />
                              </div>

                              {/* Right: Presets & actions */}
                              <div className="flex flex-col w-full sm:w-[240px] p-3 space-y-3">
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

                                <div className="flex-grow" /> {/* Pushes actions to bottom */}
                                
                                <div className="flex items-center justify-between pt-2 border-t border-border -mx-3 px-3">
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

                {/* Group buttons for better responsive layout */}
                <div className="flex items-center gap-2">
                  <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    className="w-full sm:w-auto" // Full width on mobile
                  >
                    {form.formState.isSubmitting ? "Loading..." : "Search"}
                  </Button>
                  
                  {/* New Reset Button */}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleReset}
                    disabled={form.formState.isSubmitting}
                    className="w-full sm:w-auto" // Full width on mobile
                  >
                    Reset
                  </Button>
                </div>

                {form.formState.errors.root?.serverError && (
                  <div className="text-center text-xs text-destructive sm:col-span-full">
                    {form.formState.errors.root.serverError.message}
                  </div>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Card for Data Table */}
        <Card>
          <CardHeader>
            <CardTitle>Punch History</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Removed mt-8, spacing is handled by Card and space-y-6 */}
            <DataTable3 columns={userPunchColumns} data={data} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default UserPunchesPage;