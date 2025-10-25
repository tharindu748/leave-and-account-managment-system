// import PageHeaderTitle from "@/components/page-header/title";
// import PageHeader from "@/components/page-header/wrapper";
// import type { OutletContextType } from "@/layouts/main-layout";
// import { useEffect, useState } from "react";
// import { useOutletContext } from "react-router";
// import AdminCalendar from "../components/admin-calendar";
// import { DataTable } from "@/components/data-table";
// import {
//   leaveManageColumns,
//   type LeaveRequest,
// } from "../components/Table/leave-manage-column";
// import api from "@/api/axios";
// import { Button } from "@/components/ui/button";
// import { useAuth } from "@/context/auth-context";
// import { toast } from "sonner";

// function LeaveManagementPage() {
//   const { setBreadcrumb } = useOutletContext<OutletContextType>();
//   const [data, setData] = useState<LeaveRequest[]>([]);
//   const [calendarToggle, setCalendarToggle] = useState(false);
//   const { user } = useAuth();
//   const currentUserId = user?.id;

// const fetchLeaveRequest = async () => {
//   try {
//     const res = await api.get(`/leave/requests`);
    
//     // Debug: Check if imagePath is in the response
//     console.log('Full API response:', res.data);
    
//     if (res.data && res.data.length > 0) {
//       console.log('First user data:', res.data[0].user);
//       console.log('Image path for first user:', res.data[0].user.imagePath);
//     }
    
//     setData(res.data);
//   } catch (error: any) {
//     toast.error(
//       error?.response?.data?.message || "Failed to fetch leave requests"
//     );
//   }
// };

//   const handleApprove = async (requestId: number) => {
//     try {
//       await api.post(`/leave/approve`, {
//         requestId,
//         approvedBy: currentUserId,
//       });
//       fetchLeaveRequest();
//       toast.success("Request approved successfully");
//     } catch (error: any) {
//       toast.error(
//         error?.response?.data?.message || "Failed to approve request"
//       );
//     }
//   };

//   const handleCancel = async (requestId: number) => {
//     try {
//       await api.post(`/leave/rejected`, {
//         requestId,
//         approvedBy: currentUserId,
//       });
//       fetchLeaveRequest();
//       toast.success("Request cancelled successfully");
//     } catch (error: any) {
//       toast.error(error?.response?.data?.message || "Failed to cancel request");
//     }
//   };

//   useEffect(() => {
//     setBreadcrumb(["Attendance", "Leave Management"]);
//     fetchLeaveRequest();
//   }, []);
//   return (
//     <>
//       <PageHeader>
//         <div>
//           <PageHeaderTitle value="Leave Management" />
//         </div>
//       </PageHeader>
//       <div className="rounded-lg border p-6">
//         <Button onClick={() => setCalendarToggle(true)}>View calendar</Button>

//         <DataTable
//           columns={leaveManageColumns(handleApprove, handleCancel)}
//           data={data}
//         />
//       </div>
//       {calendarToggle && (
//         <AdminCalendar open={calendarToggle} onOpenChange={setCalendarToggle} />
//       )}
//     </>
//   );
// }

// export default LeaveManagementPage;
import PageHeaderTitle from "@/components/page-header/title";
import PageHeader from "@/components/page-header/wrapper";
import type { OutletContextType } from "@/layouts/main-layout";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router";
import AdminCalendar from "../components/admin-calendar";
import { DataTable } from "@/components/data-table";
import {
  leaveManageColumns,
  type LeaveRequest,
} from "../components/Table/leave-manage-column";
import api from "@/api/axios";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Clock, CheckCircle, XCircle, Filter } from "lucide-react";

function LeaveManagementPage() {
  const { setBreadcrumb } = useOutletContext<OutletContextType>();
  const [data, setData] = useState<LeaveRequest[]>([]);
  const [calendarToggle, setCalendarToggle] = useState(false);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const { user } = useAuth();
  const currentUserId = user?.id;

  const fetchLeaveRequest = async () => {
    try {
      const res = await api.get(`/leave/requests`);
      
      // Debug: Check if imagePath is in the response
      console.log('Full API response:', res.data);
      
      if (res.data && res.data.length > 0) {
        console.log('First user data:', res.data[0].user);
        console.log('Image path for first user:', res.data[0].user.imagePath);
      }
      
      setData(res.data);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to fetch leave requests"
      );
    }
  };

  const handleApprove = async (requestId: number) => {
    try {
      await api.post(`/leave/approve`, {
        requestId,
        approvedBy: currentUserId,
      });
      fetchLeaveRequest();
      toast.success("Request approved successfully");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to approve request"
      );
    }
  };

  const handleReject = async (requestId: number) => {
    try {
      await api.post(`/leave/rejected`, {
        requestId,
        approvedBy: currentUserId,
      });
      fetchLeaveRequest();
      toast.success("Request rejected successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to reject request");
    }
  };

  // Filter data by status
  const pendingRequests = data.filter(request => request.status === "PENDING");
  const approvedRequests = data.filter(request => request.status === "APPROVED");
  const rejectedRequests = data.filter(request => request.status === "REJECTED");

  // Statistics
  const stats = {
    total: data.length,
    pending: pendingRequests.length,
    approved: approvedRequests.length,
    rejected: rejectedRequests.length,
  };

  // Get current data based on active tab
  const getCurrentData = () => {
    switch (activeTab) {
      case 'pending': return pendingRequests;
      case 'approved': return approvedRequests;
      case 'rejected': return rejectedRequests;
      default: return pendingRequests;
    }
  };

  // Get tab configuration
  const tabs = [
    {
      id: 'pending' as const,
      label: 'Pending',
      icon: Clock,
      count: stats.pending,
      color: 'amber',
      data: pendingRequests
    },
    {
      id: 'approved' as const,
      label: 'Approved',
      icon: CheckCircle,
      count: stats.approved,
      color: 'green',
      data: approvedRequests
    },
    {
      id: 'rejected' as const,
      label: 'Rejected',
      icon: XCircle,
      count: stats.rejected,
      color: 'red',
      data: rejectedRequests
    }
  ];

  useEffect(() => {
    setBreadcrumb(["Attendance", "Leave Management"]);
    fetchLeaveRequest();
  }, []);

  return (
    <>
      <PageHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <PageHeaderTitle value="Leave Management" />
            <p className="text-muted-foreground mt-1">
              Manage and review employee leave requests
            </p>
          </div>
          <Button 
            onClick={() => setCalendarToggle(true)} 
            className="flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            View Calendar
          </Button>
        </div>
      </PageHeader>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Requests</p>
                <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card 
          className={`bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 hover:shadow-md transition-shadow cursor-pointer ${
            activeTab === 'pending' ? 'ring-2 ring-amber-300' : ''
          }`}
          onClick={() => setActiveTab('pending')}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600">Pending</p>
                <p className="text-2xl font-bold text-amber-900">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>

        <Card 
          className={`bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-md transition-shadow cursor-pointer ${
            activeTab === 'approved' ? 'ring-2 ring-green-300' : ''
          }`}
          onClick={() => setActiveTab('approved')}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Approved</p>
                <p className="text-2xl font-bold text-green-900">{stats.approved}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card 
          className={`bg-gradient-to-br from-red-50 to-red-100 border-red-200 hover:shadow-md transition-shadow cursor-pointer ${
            activeTab === 'rejected' ? 'ring-2 ring-red-300' : ''
          }`}
          onClick={() => setActiveTab('rejected')}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Rejected</p>
                <p className="text-2xl font-bold text-red-900">{stats.rejected}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Custom Tab Navigation */}
      <Card className="shadow-lg border-0">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-2xl font-bold">Leave Requests</CardTitle>
              <CardDescription>
                Review and manage all employee leave applications
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="w-4 h-4" />
              <span>Filtered by: </span>
              <Badge variant="outline" className="capitalize">
                {activeTab}
              </Badge>
            </div>
          </div>
        </CardHeader>

        {/* Tab Buttons */}
        <div className="px-6 pb-4">
          <div className="flex flex-wrap gap-2 border-b pb-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const colorClasses = {
                amber: isActive ? 'bg-amber-500 text-white border-amber-500' : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100',
                green: isActive ? 'bg-green-500 text-white border-green-500' : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100',
                red: isActive ? 'bg-red-500 text-white border-red-500' : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
              };

              return (
                <Button
                  key={tab.id}
                  variant={isActive ? "default" : "outline"}
                  className={`flex items-center gap-2 transition-all ${
                    colorClasses[tab.color as keyof typeof colorClasses]
                  } ${isActive ? 'shadow-md' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  <Badge 
                    variant="secondary" 
                    className={`ml-1 ${
                      isActive 
                        ? 'bg-white text-gray-800' 
                        : tab.color === 'amber' ? 'bg-amber-100 text-amber-800' :
                          tab.color === 'green' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                    }`}
                  >
                    {tab.count}
                  </Badge>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <CardContent className="pt-0">
          {getCurrentData().length > 0 ? (
            <DataTable
              columns={leaveManageColumns(handleApprove, handleReject)}
              data={getCurrentData()}
            />
          ) : (
            <div className="text-center py-12 px-6">
              <div className={`w-16 h-16 ${
                activeTab === 'pending' ? 'bg-amber-100' :
                activeTab === 'approved' ? 'bg-green-100' :
                'bg-red-100'
              } rounded-full flex items-center justify-center mx-auto mb-4`}>
                {activeTab === 'pending' && <Clock className="w-8 h-8 text-amber-600" />}
                {activeTab === 'approved' && <CheckCircle className="w-8 h-8 text-green-600" />}
                {activeTab === 'rejected' && <XCircle className="w-8 h-8 text-red-600" />}
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${
                activeTab === 'pending' ? 'text-amber-800' :
                activeTab === 'approved' ? 'text-green-800' :
                'text-red-800'
              }`}>
                No {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Requests
              </h3>
              <p className={`max-w-md mx-auto ${
                activeTab === 'pending' ? 'text-amber-600' :
                activeTab === 'approved' ? 'text-green-600' :
                'text-red-600'
              }`}>
                {activeTab === 'pending' && "All leave requests have been processed. New requests will appear here."}
                {activeTab === 'approved' && "No leave requests have been approved yet. Approved requests will appear here."}
                {activeTab === 'rejected' && "No leave requests have been rejected. Rejected requests will appear here."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {calendarToggle && (
        <AdminCalendar open={calendarToggle} onOpenChange={setCalendarToggle} />
      )}
    </>
  );
}

export default LeaveManagementPage;