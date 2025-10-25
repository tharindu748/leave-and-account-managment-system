import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, ChevronLeft, ChevronRight, X, User, Loader2, RefreshCw } from "lucide-react";
import { useMemo, useState, useEffect } from "react";

// Configuration - Use Vite environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Types based on your backend
interface Leave {
  id: string;
  date: string;
  status: "pending" | "approved" | "rejected";
  userId: string;
  userName: string;
  leaveType: string;
  reason: string;
  department?: string;
  isHalfDay?: boolean;
  halfDayType?: string;
}

interface CalendarData {
  leaves: Leave[];
  stats: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
  };
}

interface CalendarProps {
  open?: boolean;
  onOpenChange: (open: boolean) => void;
  onDayClick?: (date: Date) => void;
  selectedDates?: Date[];
}

const WEEKDAYS_MON_FIRST = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface LeavePopupProps {
  date: Date;
  leaves: Leave[];
  onClose: () => void;
}

const LeavePopup = ({ date, leaves, onClose }: LeavePopupProps) => {
  const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  const dayLeaves = leaves.filter((leave) => leave.date === dateStr);

  const counts = {
    approved: dayLeaves.filter((l) => l.status === "approved").length,
    pending: dayLeaves.filter((l) => l.status === "pending").length,
    rejected: dayLeaves.filter((l) => l.status === "rejected").length,
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      approved: "bg-green-100 text-green-800 border-green-200",
      pending: "bg-blue-100 text-blue-800 border-blue-200",
      rejected: "bg-red-100 text-red-800 border-red-200",
    };
    return `px-2 py-1 rounded-full text-xs font-medium border ${
      styles[status as keyof typeof styles]
    }`;
  };

  const getHalfDayBadge = (isHalfDay: boolean, halfDayType?: string) => {
    if (!isHalfDay) return null;
    
    return (
      <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full border border-purple-200">
        {halfDayType === 'MORNING' ? 'Morning' : 'Afternoon'}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden mx-2 sm:mx-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1 sm:p-2 bg-white/10 rounded-lg">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white">Leave Details</h3>
                <p className="text-slate-300 text-xs sm:text-sm">{formatDate(date)}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 sm:h-10 sm:w-10 text-white border-white/20 hover:bg-white/10"
            >
              <X className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          </div>
        </div>

        {/* Summary */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b bg-slate-50">
          <div className="flex gap-4 sm:gap-6 justify-center">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-green-600">
                {counts.approved}
              </div>
              <div className="text-xs sm:text-sm text-slate-600">Approved</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-blue-600">
                {counts.pending}
              </div>
              <div className="text-xs sm:text-sm text-slate-600">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-red-600">
                {counts.rejected}
              </div>
              <div className="text-xs sm:text-sm text-slate-600">Rejected</div>
            </div>
          </div>
        </div>

        {/* Leave List */}
        <div className="max-h-96 overflow-y-auto">
          {dayLeaves.length === 0 ? (
            <div className="p-4 sm:p-6 text-center text-slate-500">
              <User className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 opacity-50" />
              <p className="text-sm sm:text-base">No leave applications for this date</p>
            </div>
          ) : (
            <div className="p-3 sm:p-4 space-y-3">
              {dayLeaves.map((leave) => (
                <div
                  key={leave.id}
                  className="bg-white border border-slate-200 rounded-lg p-3 sm:p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 sm:gap-3 mb-2">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-3 h-3 sm:w-4 sm:h-4 text-slate-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-slate-900 text-sm sm:text-base truncate">
                            {leave.userName}
                          </h4>
                          <p className="text-xs sm:text-sm text-slate-500 truncate">
                            {leave.leaveType} Leave {leave.department && `• ${leave.department}`}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 ml-8 sm:ml-11 break-words">
                        {leave.reason}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <span className={getStatusBadge(leave.status)}>
                        {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                      </span>
                      {getHalfDayBadge(leave.isHalfDay || false, leave.halfDayType)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Mock data for fallback
const mockLeaves: Leave[] = [
  {
    id: "1",
    date: "2025-09-15",
    status: "approved",
    userId: "1",
    userName: "John Smith",
    leaveType: "ANNUAL",
    reason: "Family vacation",
    department: "Engineering"
  },
  {
    id: "2",
    date: "2025-09-15",
    status: "pending",
    userId: "2",
    userName: "Sarah Johnson",
    leaveType: "CASUAL",
    reason: "Medical appointment",
    department: "Marketing"
  },
  {
    id: "3",
    date: "2025-09-16",
    status: "rejected",
    userId: "3",
    userName: "Mike Wilson",
    leaveType: "ANNUAL",
    reason: "Personal matters",
    department: "Sales"
  },
  {
    id: "4",
    date: "2025-09-18",
    status: "approved",
    userId: "4",
    userName: "Emma Davis",
    leaveType: "CASUAL",
    reason: "Wedding anniversary",
    department: "HR"
  },
];

const mockCalendarData: CalendarData = {
  leaves: mockLeaves,
  stats: {
    total: mockLeaves.length,
    approved: mockLeaves.filter(l => l.status === 'approved').length,
    pending: mockLeaves.filter(l => l.status === 'pending').length,
    rejected: mockLeaves.filter(l => l.status === 'rejected').length,
  }
};

const AdminCalendar = ({
  open,
  onOpenChange,
  onDayClick,
  selectedDates = [],
}: CalendarProps) => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState<Date>(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [calendarData, setCalendarData] = useState<CalendarData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useMockData, setUseMockData] = useState(false);

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  // Fetch calendar data from backend
  useEffect(() => {
    if (open) {
      fetchCalendarData();
    }
  }, [open, currentDate]);

  const fetchCalendarData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching calendar data from:', `${API_BASE_URL}/leave/calendar?year=${year}&month=${month + 1}`);
      
      const response = await fetch(
        `${API_BASE_URL}/leave/calendar?year=${year}&month=${month + 1}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Calendar data received:', data);
      setCalendarData(data);
      setUseMockData(false);
    } catch (err) {
      console.error('Error fetching calendar data:', err);
      setError(`Cannot connect to server at ${API_BASE_URL}. Using demo data.`);
      setCalendarData(mockCalendarData);
      setUseMockData(true);
    } finally {
      setLoading(false);
    }
  };

  // Build a lookup for leaves by date with counts
  const leavesByDate = useMemo(() => {
    const map = new Map<
      string,
      {
        approved: number;
        pending: number;
        rejected: number;
        total: number;
      }
    >();

    if (calendarData?.leaves) {
      for (const leave of calendarData.leaves) {
        const existing = map.get(leave.date) || {
          approved: 0,
          pending: 0,
          rejected: 0,
          total: 0,
        };
        existing[leave.status]++;
        existing.total++;
        map.set(leave.date, existing);
      }
    }

    return map;
  }, [calendarData]);

  // Compute grid start (Monday-first)
  const gridStart = useMemo(() => {
    const firstOfMonth = new Date(year, month, 1);
    const jsDay = firstOfMonth.getDay();
    const mondayIndex = (jsDay + 6) % 7;
    const start = new Date(firstOfMonth);
    start.setDate(firstOfMonth.getDate() - mondayIndex);
    return start;
  }, [year, month]);

  // 35 calendar cells (5 rows)
  const cells: Date[] = useMemo(
    () =>
      Array.from({ length: 35 }, (_, i) => {
        const d = new Date(gridStart);
        d.setDate(gridStart.getDate() + i);
        return d;
      }),
    [gridStart]
  );

  const goToPreviousMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const goToNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const formatKey = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;

  const isToday = (d: Date) =>
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear();

  const monthName = currentDate.toLocaleString("default", { month: "long" });

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    onDayClick?.(date);
  };

  const closePopup = () => {
    setSelectedDate(null);
  };

  const leaves = calendarData?.leaves || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-full max-h-[95vh] overflow-y-auto sm:max-w-4xl p-2 sm:p-4 md:p-6">
        <DialogHeader className="px-2 sm:px-0">
          <div className="flex items-center justify-between gap-3">
            <DialogTitle className="text-lg sm:text-xl">Admin Calendar</DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={fetchCalendarData}
                disabled={loading}
                className="h-8 sm:h-9 gap-1 sm:gap-2"
                size="sm"
              >
                {loading ? (
                  <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4" />
                )}
                <span className="text-xs sm:text-sm">Refresh</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="h-8 sm:h-9 gap-1 sm:gap-2"
                type="button"
              >
                <X className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm">Close</span>
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="mt-2 bg-white rounded-lg shadow-md p-3 sm:p-4 md:p-6 w-full overflow-x-auto">
          {error && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-yellow-800 text-sm">{error}</span>
                {useMockData && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchCalendarData}
                    className="h-6 text-xs"
                  >
                    Retry
                  </Button>
                )}
              </div>
            </div>
          )}

          {useMockData && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-sm">
                📋 Using demo data. Start your backend server to see real data.
              </p>
              <p className="text-blue-700 text-xs mt-1">
                Backend URL: {API_BASE_URL}
              </p>
            </div>
          )}

          {/* Header Card */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 overflow-hidden mb-4 sm:mb-6">
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-1 sm:p-2 bg-white/10 rounded-lg backdrop-blur">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                      Leave Calendar
                    </h2>
                    <p className="text-slate-300 text-xs sm:text-sm mt-0.5 sm:mt-1">
                      Monitor team leave applications
                    </p>
                  </div>
                </div>
                {loading && (
                  <div className="flex items-center gap-2 text-white">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Loading...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Month Navigation */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6">
              <div className="flex items-center justify-center">
                <div className="flex items-center bg-white/10 rounded-lg backdrop-blur w-full max-w-xs sm:max-w-sm">
                  <Button
                    variant="outline"
                    size="icon"
                    className="p-1 sm:p-2 hover:bg-white/10 text-white rounded-l-lg transition-all duration-200 border-white/20"
                    onClick={goToPreviousMonth}
                    aria-label="Previous month"
                    disabled={loading}
                  >
                    <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                  </Button>
                  <span className="px-2 sm:px-3 md:px-4 font-semibold text-sm sm:text-base md:text-lg text-white text-center flex-1 min-w-0 truncate">
                    {monthName} {year}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="p-1 sm:p-2 hover:bg-white/10 text-white rounded-r-lg transition-all duration-200 border-white/20"
                    onClick={goToNextMonth}
                    aria-label="Next month"
                    disabled={loading}
                  >
                    <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="min-w-[280px]">
            {/* Week header */}
            <div className="grid grid-cols-7 mb-1 sm:mb-2">
              {WEEKDAYS_MON_FIRST.map((label, index) => (
                <div
                  key={label}
                  className={`text-center py-2 sm:py-3 text-xs font-semibold uppercase tracking-wider ${
                    index >= 5 ? "text-slate-500" : "text-slate-700"
                  }`}
                >
                  {label}
                </div>
              ))}
            </div>

            {/* Calendar cells */}
            <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
              {cells.map((d, i) => {
                const inCurrentMonth = d.getMonth() === month;
                const key = formatKey(d);
                const leaveCounts = leavesByDate.get(key);
                const clickable = inCurrentMonth && !loading;

                const borderClass = isToday(d)
                  ? "border-2 border-blue-500"
                  : "border border-gray-200";

                const baseBg = inCurrentMonth ? "bg-white" : "bg-slate-50";
                const hoverClass = clickable ? "hover:bg-gray-50" : "";

                const textClass = inCurrentMonth
                  ? "text-gray-800"
                  : "text-slate-400";

                return (
                  <div
                    key={i}
                    className={[
                      "aspect-square flex flex-col items-center justify-center relative p-0.5 sm:p-1",
                      borderClass,
                      baseBg,
                      clickable
                        ? `${hoverClass} cursor-pointer transition-colors`
                        : "cursor-default",
                      loading ? "opacity-50" : "",
                    ].join(" ")}
                    onClick={() => clickable && handleDayClick(d)}
                    aria-disabled={!clickable}
                    role="button"
                    tabIndex={clickable ? 0 : -1}
                  >
                    <span className={`font-medium text-sm sm:text-base ${textClass} mb-0.5 sm:mb-1`}>
                      {d.getDate()}
                    </span>

                    {/* Enhanced Leave counts display */}
                    {leaveCounts && inCurrentMonth && (
                      <div className="flex flex-col gap-0.5 w-full px-0.5">
                        {leaveCounts.approved > 0 && (
                          <div className="flex items-center justify-between w-full">
                            <span className="bg-green-600 text-white text-[8px] sm:text-[10px] px-1 py-0.5 rounded font-bold min-w-[14px] sm:min-w-[16px] text-center">
                              {leaveCounts.approved}
                            </span>
                            <span className="text-[6px] sm:text-[8px] text-green-600 font-medium hidden sm:inline truncate flex-1 ml-1">
                              Approved
                            </span>
                          </div>
                        )}
                        {leaveCounts.pending > 0 && (
                          <div className="flex items-center justify-between w-full">
                            <span className="bg-blue-600 text-white text-[8px] sm:text-[10px] px-1 py-0.5 rounded font-bold min-w-[14px] sm:min-w-[16px] text-center">
                              {leaveCounts.pending}
                            </span>
                            <span className="text-[6px] sm:text-[8px] text-blue-600 font-medium hidden sm:inline truncate flex-1 ml-1">
                              Pending
                            </span>
                          </div>
                        )}
                        {leaveCounts.rejected > 0 && (
                          <div className="flex items-center justify-between w-full">
                            <span className="bg-red-600 text-white text-[8px] sm:text-[10px] px-1 py-0.5 rounded font-bold min-w-[14px] sm:min-w-[16px] text-center">
                              {leaveCounts.rejected}
                            </span>
                            <span className="text-[6px] sm:text-[8px] text-red-600 font-medium hidden sm:inline truncate flex-1 ml-1">
                              Rejected
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Enhanced Legend */}
          <div className="flex flex-wrap gap-3 sm:gap-4 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-200 justify-center">
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-600 rounded-full flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-slate-600 whitespace-nowrap">
                Approved ({calendarData?.stats.approved || 0})
              </span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-600 rounded-full flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-slate-600 whitespace-nowrap">
                Pending ({calendarData?.stats.pending || 0})
              </span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-600 rounded-full flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-slate-600 whitespace-nowrap">
                Rejected ({calendarData?.stats.rejected || 0})
              </span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-blue-500 rounded flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-slate-600 whitespace-nowrap">
                Today
              </span>
            </div>
          </div>

          {/* Quick Stats */}
          {calendarData && (
            <div className="mt-4 p-3 sm:p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div>
                  <div className="text-lg sm:text-xl font-bold text-slate-800">
                    {calendarData.stats.total}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-600">Total Leaves</div>
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-bold text-green-600">
                    {calendarData.stats.approved}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-600">Approved</div>
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-bold text-blue-600">
                    {calendarData.stats.pending}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-600">Pending</div>
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-bold text-red-600">
                    {calendarData.stats.rejected}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-600">Rejected</div>
                </div>
              </div>
              {useMockData && (
                <div className="mt-3 text-center">
                  <p className="text-xs text-slate-500">
                    Demo data • Start backend server for real data
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Popup */}
        {selectedDate && (
          <LeavePopup
            date={selectedDate}
            leaves={leaves}
            onClose={closePopup}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AdminCalendar;