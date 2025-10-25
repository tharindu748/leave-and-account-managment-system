// import api from "@/api/axios";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Save, X } from "lucide-react";
// import { useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import type { User } from "../pages";

// // ✅ Fixed schema - all fields optional except name
// const userSchema = z.object({
//   name: z.string().min(1, "User Name is Required"),
//   email: z.string().email("Invalid email format").optional().or(z.literal("")),
//   epfNo: z.string().optional().or(z.literal("")),
//   nic: z.string().optional().or(z.literal("")),
//   jobPosition: z.string().optional().or(z.literal("")),
// });

// type UserFormValues = z.infer<typeof userSchema>;

// interface EditUserDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   user: User | null;
//   onSaved?: (updated: UserFormValues) => void;
// }

// export default function EditUserDialog({
//   open,
//   onOpenChange,
//   user,
//   onSaved,
// }: EditUserDialogProps) {
//   const form = useForm<UserFormValues>({
//     resolver: zodResolver(userSchema),
//     defaultValues: {
//       name: "",
//       email: "",
//       epfNo: "",
//       nic: "",
//       jobPosition: "",
//     },
//   });

//   useEffect(() => {
//     if (open && user) {
//       console.log("Setting form values for user:", user);
//       form.reset({
//         name: user.name || "",
//         email: user.email || "",
//         epfNo: user.epfNo || "",
//         nic: user.nic || "",
//         jobPosition: user.jobPosition || "",
//       });
//     }
//   }, [open, user, form]);

//   const onSubmit = async (values: UserFormValues) => {
//     if (!user?.id) {
//       console.error("No user ID available");
//       form.setError("root", { 
//         message: "No user selected for editing" 
//       });
//       return;
//     }

//     console.log("🔄 Updating user ID:", user.id);
//     console.log("📝 Update data:", values);

//     try {
//       // ✅ Clean up empty strings to null
//       const cleanedValues = {
//         name: values.name,
//         email: values.email || null,
//         epfNo: values.epfNo || null,
//         nic: values.nic || null,
//         jobPosition: values.jobPosition || null,
//       };

//       console.log("🧹 Cleaned data:", cleanedValues);

//       const response = await api.patch(`/users/${user.id}`, cleanedValues);
//       console.log("✅ Update successful:", response.data);
      
//       onSaved?.(values);
//       onOpenChange(false);
//     } catch (error: any) {
//       console.error("❌ Update failed:");
//       console.error("Status:", error.response?.status);
//       console.error("Data:", error.response?.data);
//       console.error("Message:", error.message);
      
//       form.setError("root", {
//         type: "manual",
//         message: error.response?.data?.message || "Failed to update user. Please try again.",
//       });
//     }
//   };

//   if (!user) {
//     return null;
//   }

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-2xl [&>button]:hidden p-6 overflow-hidden">
//         <DialogHeader>
//           <div className="flex items-center justify-between gap-4">
//             <div>
//               <DialogTitle>Edit User</DialogTitle>
//               <p className="text-sm text-gray-500">Editing: {user.name} (ID: {user.id})</p>
//             </div>
//             <div className="flex items-center gap-2">
//               <Button
//                 variant="outline"
//                 onClick={() => onOpenChange(false)}
//                 className="gap-2"
//                 type="button"
//               >
//                 <X className="h-4 w-4" />
//                 Close
//               </Button>
//               <Button
//                 className="gap-2 bg-gray-800 hover:bg-black text-white"
//                 type="submit"
//                 form="user-form"
//                 disabled={form.formState.isSubmitting}
//               >
//                 <Save className="h-4 w-4" />
//                 {form.formState.isSubmitting ? "Saving..." : "Save User"}
//               </Button>
//             </div>
//           </div>
//         </DialogHeader>

//         <div className="p-4">
//           <Form {...form}>
//             <form
//               id="user-form"
//               onSubmit={form.handleSubmit(onSubmit)}
//               className="space-y-6"
//             >
//               <div className="grid gap-4">
//                 <FormField
//                   control={form.control}
//                   name="name"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>User Name *</FormLabel>
//                       <FormControl>
//                         <Input
//                           placeholder="Enter user name"
//                           type="text"
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage className="text-xs" />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="email"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Email</FormLabel>
//                       <FormControl>
//                         <Input
//                           placeholder="Enter email address"
//                           type="email"
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage className="text-xs" />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="epfNo"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>EPF No</FormLabel>
//                       <FormControl>
//                         <Input
//                           placeholder="Enter EPF number"
//                           type="text"
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage className="text-xs" />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="nic"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>NIC</FormLabel>
//                       <FormControl>
//                         <Input
//                           placeholder="Enter NIC number"
//                           type="text"
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage className="text-xs" />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="jobPosition"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Job Position</FormLabel>
//                       <FormControl>
//                         <Input
//                           placeholder="Enter job position"
//                           type="text"
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage className="text-xs" />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               {form.formState.errors.root && (
//                 <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
//                   {form.formState.errors.root.message}
//                 </div>
//               )}
//             </form>
//           </Form>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }
import api from "@/api/axios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Add Textarea import
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, X, Calendar, MapPin } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { User } from "../pages";

// ✅ Updated schema with join date and address
const userSchema = z.object({
  name: z.string().min(1, "User Name is Required"),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  epfNo: z.string().optional().or(z.literal("")),
  nic: z.string().optional().or(z.literal("")),
  jobPosition: z.string().optional().or(z.literal("")),
  joinDate: z.string().optional().or(z.literal("")), // ✅ Add join date
  address: z.string().optional().or(z.literal("")), // ✅ Add address
});

type UserFormValues = z.infer<typeof userSchema>;

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onSaved?: (updated: UserFormValues) => void;
}

export default function EditUserDialog({
  open,
  onOpenChange,
  user,
  onSaved,
}: EditUserDialogProps) {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      epfNo: "",
      nic: "",
      jobPosition: "",
      joinDate: "", // ✅ Add default value
      address: "", // ✅ Add default value
    },
  });

  useEffect(() => {
    if (open && user) {
      console.log("Setting form values for user:", user);
      
      // Format join date for input field (YYYY-MM-DD)
      const formatJoinDate = (dateString: string | undefined) => {
        if (!dateString) return "";
        try {
          const date = new Date(dateString);
          return date.toISOString().split('T')[0];
        } catch {
          return "";
        }
      };

      form.reset({
        name: user.name || "",
        email: user.email || "",
        epfNo: user.epfNo || "",
        nic: user.nic || "",
        jobPosition: user.jobPosition || "",
        joinDate: formatJoinDate(user.joinDate), // ✅ Set join date
        address: user.address || "", // ✅ Set address
      });
    }
  }, [open, user, form]);

  // In your frontend EditUserDialog
const onSubmit = async (values: UserFormValues) => {
  if (!user?.id) {
    console.error("No user ID available");
    form.setError("root", { 
      message: "No user selected for editing" 
    });
    return;
  }

  console.log("🔄 Updating user ID:", user.id);
  console.log("📝 Update data:", values);

  try {
    // ✅ TEMPORARY: Use simple endpoint or remove new fields
    const cleanedValues = {
      name: values.name,
      email: values.email || null,
      epfNo: values.epfNo || null,
      nic: values.nic || null,
      jobPosition: values.jobPosition || null,
      joinDate: values.joinDate ? new Date(values.joinDate).toISOString() : null, // ❌ Remove temporarily
      address: values.address || null, // ❌ Remove temporarily
    };

    console.log("🧹 Cleaned data (temporary):", cleanedValues);

    // Option 1: Use regular endpoint without new fields
    const response = await api.patch(`/users/${user.id}`, cleanedValues);
    
    // Option 2: Use simple endpoint (if you add it)
    // const response = await api.patch(`/users/${user.id}/simple`, cleanedValues);
    
    console.log("✅ Update successful:", response.data);
    
    onSaved?.(values);
    onOpenChange(false);
  } catch (error: any) {
    console.error("❌ Update failed:");
    console.error("Status:", error.response?.status);
    console.error("Data:", error.response?.data);
    console.error("Message:", error.message);
    
    form.setError("root", {
      type: "manual",
      message: error.response?.data?.message || "Failed to update user. Please try again.",
    });
  }
};

  if (!user) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl [&>button]:hidden p-6 overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <DialogTitle>Edit User</DialogTitle>
              <p className="text-sm text-gray-500">Editing: {user.name} (ID: {user.id})</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="gap-2"
                type="button"
              >
                <X className="h-4 w-4" />
                Close
              </Button>
              <Button
                className="gap-2 bg-gray-800 hover:bg-black text-white"
                type="submit"
                form="user-form"
                disabled={form.formState.isSubmitting}
              >
                <Save className="h-4 w-4" />
                {form.formState.isSubmitting ? "Saving..." : "Save User"}
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="p-4">
          <Form {...form}>
            <form
              id="user-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name Field */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter user name"
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter email address"
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* EPF No Field */}
                <FormField
                  control={form.control}
                  name="epfNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>EPF No</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter EPF number"
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* NIC Field */}
                <FormField
                  control={form.control}
                  name="nic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>NIC</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter NIC number"
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Job Position Field */}
                <FormField
                  control={form.control}
                  name="jobPosition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Position</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter job position"
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* ✅ Join Date Field */}
                <FormField
                  control={form.control}
                  name="joinDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Company Join Date
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              {/* ✅ Address Field - Full Width */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Address
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter full address"
                        rows={3}
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {form.formState.errors.root && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
                  {form.formState.errors.root.message}
                </div>
              )}
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}