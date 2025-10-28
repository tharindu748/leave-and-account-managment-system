import React, { useEffect, useState } from "react";
import { useLeave, type LeaveStatus, type LeaveType } from "../hooks/use-leave";
import LeaveCard from "../components/leave-card";
import LeaveSidePanel from "../components/LeaveSidePanel";
import LeaveModal from "../components/leave-model";
import type { OutletContextType } from "@/layouts/main-layout";
import { useOutletContext } from "react-router";
import api from "@/api/axios";
import Calendar from "../components/calendar";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";

type DayDuration = "FULL" | "MORNING" | "AFTERNOON";

const formatDate = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const CalendarLeave: React.FC = () => {
  const { user } = useAuth();
  const { setBreadcrumb } = useOutletContext<OutletContextType>();
  const { leaves, applyLeave } = useLeave();

  const [leaveType, setLeaveType] = useState<LeaveType | "">("");
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [dayDurations, setDayDurations] = useState<Record<string, DayDuration>>({});
  const [isModalOpen, setModalOpen] = useState(false);
  const [clickedDate, setClickedDate] = useState<Date | null>(null);

  // ✅ REAL LEAVE DATA STATE
  const [realLeaveData, setRealLeaveData] = useState({
    annualLeave: { total: 0, available: 0 },
    casualSickLeave: { total: 0, available: 0 }
  });

  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // ✅ FETCH REAL LEAVE DATA FROM BACKEND
  const fetchRealLeaveData = async () => {
    if (!user?.id) {
      console.log("❌ No user ID available");
      setIsLoading(false);
      return;
    }

    try {
      console.log("🔄 Fetching real leave data for user:", user.id);
      setIsLoading(true);
      
      const response = await api.get(`/leave/balance/user/${user.id}?t=${Date.now()}`);
      console.log("✅ Real leave data received:", response.data);
      
      setRealLeaveData(response.data);
      setLastRefresh(new Date()); // Update last refresh time
    } catch (error: any) {
      console.error("❌ Failed to fetch leave balances:", error);
      toast.error("Failed to load leave balances");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ FETCH ON COMPONENT MOUNT
  useEffect(() => {
    setBreadcrumb(["Calendar"]);
    fetchRealLeaveData(); // Fetch real data on component mount
  }, [setBreadcrumb, user?.id]);

  // ✅ LISTEN FOR POLICY UPDATES ONLY
  useEffect(() => {
    const handlePolicyUpdate = () => {
      console.log("🔄 Leave policy updated - refreshing data");
      fetchRealLeaveData();
    };

    window.addEventListener('leavePolicyUpdated', handlePolicyUpdate);
    return () => window.removeEventListener('leavePolicyUpdated', handlePolicyUpdate);
  }, []);

  // ✅ OPTIONAL: Refresh every 5 minutes (instead of 10 seconds)
  useEffect(() => {
    const interval = setInterval(fetchRealLeaveData, 300000); // 5 minutes
    return () => clearInterval(interval);
  }, [user?.id]);

  // ... rest of your functions remain exactly the same ...
  const handleDayClick = (date: Date) => {
    const key = formatDate(date);
    const isLeaveTypeSelectedInPanel = !!leaveType;

    if (!isLeaveTypeSelectedInPanel) {
      setClickedDate(date);
      setModalOpen(true);
    } else {
      if (!selectedDates.some((d) => formatDate(d) === key)) {
        setSelectedDates([...selectedDates, date]);
        setDayDurations({ ...dayDurations, [key]: "FULL" });
      } else {
        setSelectedDates(selectedDates.filter((d) => formatDate(d) !== key));
        const copy = { ...dayDurations };
        delete copy[key];
        setDayDurations(copy);
      }
    }
  };

  const handleLeaveTypeChange = (type: LeaveType | "") => {
    setLeaveType(type);
  };

  const handleDurationChange = (date: Date, value: DayDuration) => {
    const key = formatDate(date);
    setDayDurations((prev) => ({ ...prev, [key]: value }));
  };

  const removeDate = (date: Date) => {
    const key = formatDate(date);
    setSelectedDates(selectedDates.filter((d) => formatDate(d) !== key));
    const copy = { ...dayDurations };
    delete copy[key];
    setDayDurations(copy);
  };

  const submitLeave = async (
    dates: Date[],
    type: LeaveType,
    reason: string,
    durationsMap: Record<string, DayDuration>
  ) => {
    const datesPayload = dates.map((d) => {
      const key = formatDate(d);
      const duration = durationsMap[key] ?? "FULL";
      return {
        date: key,
        isHalfDay: duration !== "FULL",
        halfDayType:
          duration === "MORNING"
            ? "MORNING"
            : duration === "AFTERNOON"
            ? "AFTERNOON"
            : null,
      };
    });

    const body = {
      userId: user?.id,
      leaveType: type,
      reason: reason || null,
      dates: datesPayload,
    };

    try {
      const res = await api.post("/leave/request", body);

      const newLeaves = dates.map((d) => {
        const key = formatDate(d);
        const duration = durationsMap[key] ?? "FULL";
        const isHalfDay = duration !== "FULL";
        return {
          id: Date.now() + Math.random(),
          date: key,
          type,
          status: "PENDING" as LeaveStatus,
          isHalfDay,
        };
      });

      const deduction = dates.reduce((sum, d) => {
        const key = formatDate(d);
        const isHalfDay = durationsMap[key] !== "FULL";
        return sum + (isHalfDay ? 0.5 : 1);
      }, 0);

      applyLeave(newLeaves, type, deduction);

      // ✅ REFRESH DATA AFTER SUCCESSFUL LEAVE APPLICATION
      await fetchRealLeaveData();

      toast.success("Leave request submitted successfully");
      return res.data;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to submit leave request"
      );
      setSelectedDates([]);
      setDayDurations({});
    }
  };

  // --- Modal apply (single date) ---
  const handleApplyLeaveFromModal = async (
    date: Date | null,
    type: LeaveType,
    duration: DayDuration,
    reason: string
  ) => {
    if (!date) return;
    await submitLeave([date], type, reason, { [formatDate(date)]: duration });
    setClickedDate(null);
    setModalOpen(false);
  };

  // --- Side panel apply (multiple dates) ---
  const handleApplyLeaveFromSidePanel = async (reason: string) => {
    if (!leaveType) return;
    await submitLeave(selectedDates, leaveType, reason, dayDurations);
    setSelectedDates([]);
    setDayDurations({});
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        {/* ✅ DEBUG INFO */}
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded">
          <h3 className="font-semibold text-green-800">Data Status</h3>
          <div className="text-sm text-green-700">
            <p>✅ Backend Data: Annual {realLeaveData.annualLeave.available}/{realLeaveData.annualLeave.total}, 
            Casual {realLeaveData.casualSickLeave.available}/{realLeaveData.casualSickLeave.total}</p>
            <p>Loading: {isLoading ? "Yes" : "No"}</p>
            <p>Last refresh: {lastRefresh.toLocaleTimeString()}</p>
          </div>
        </div>

        {/* ✅ USE REAL DATA FROM BACKEND */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {isLoading ? (
            // Loading state
            <>
              <div className="bg-white rounded-lg shadow p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
              <div className="bg-white rounded-lg shadow p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            </>
          ) : (
            // Real data
            <>
              <LeaveCard
                title="ANNUAL LEAVE"
                total={realLeaveData.annualLeave.total}
                available={realLeaveData.annualLeave.available}
                color="text-blue-500"
              />
              <LeaveCard
                title="CASUAL & SICK LEAVE"
                total={realLeaveData.casualSickLeave.total}
                available={realLeaveData.casualSickLeave.available}
                color="text-cyan-500"
              />
            </>
          )}
        </div>

        {/* Debug/Refresh button */}
        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={fetchRealLeaveData}
            className="bg-green-500 text-white px-4 py-2 rounded text-sm hover:bg-green-600 disabled:bg-gray-400"
            disabled={isLoading}
          >
            {isLoading ? "🔄 Refreshing..." : "🔄 Refresh Leave Data"}
          </button>
          <div className="text-sm text-gray-600">
            Auto-refresh: 5 minutes
          </div>
        </div>

        {/* --- Main layout --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Left: Calendar */}
          <div className="md:col-span-3">
            <Calendar
              onDayClick={handleDayClick}
              leaves={leaves.leaves}
              selectedDates={selectedDates}
            />
          </div>

          {/* Right: Side Panel */}
          <div className="md:col-span-1">
            <LeaveSidePanel
              leaveType={leaveType}
              setLeaveType={handleLeaveTypeChange}
              selectedDates={selectedDates}
              dayDurations={dayDurations}
              handleDurationChange={handleDurationChange}
              handleApplyLeave={handleApplyLeaveFromSidePanel}
              removeDate={removeDate}
            />
          </div>
        </div>
      </div>

      <LeaveModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        selectedDate={clickedDate}
        onApplyLeave={handleApplyLeaveFromModal}
      />
    </div>
  );
};

export default CalendarLeave;