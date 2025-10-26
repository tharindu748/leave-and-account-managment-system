
import React, { useEffect, useState } from "react";
import PageHeader from "@/components/page-header/wrapper";
import PageHeaderTitle from "@/components/page-header/title";
import { Card, CardContent, CardHeader } from "@/components/ui/card"; // ✅ Import Card components
import { toDateKey, pad } from "../components/utils/time";
import type { Mode } from "../components/types/types";
import { useAttendance } from "../components/hooks/useAttendance";
// import Toolbar from "../components/Toolbar";
import DayTable from "../components/Table/day-table";
import MonthTable from "../components/Table/month-table";
import { useOutletContext } from "react-router";
import type { OutletContextType } from "@/layouts/main-layout";
import { Loader2 } from "lucide-react"; // ✅ Import a loader for a better UI

export default function TimeCalcPage() {
  const { setBreadcrumb } = useOutletContext<OutletContextType>();
  const today = new Date();
  const [mode, setMode] = useState<Mode>("day");
  const [selectedDate, setSelectedDate] = useState<string>(toDateKey(today));
  const [selectedMonth, setSelectedMonth] = useState<string>(
    `${today.getFullYear()}-${pad(today.getMonth() + 1)}`
  );
  const [search, setSearch] = useState("");

  const { monthData, dayData, loading, error } = useAttendance(
    mode,
    selectedDate,
    selectedMonth
  );

  // Keep month in sync when day changes month
  useEffect(() => {
    setBreadcrumb(["Attendance", "Time Calculation"]);
    if (mode !== "day") return;
    const d = new Date(selectedDate + "T00:00:00");
    const monthStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
    if (monthStr !== selectedMonth) setSelectedMonth(monthStr);
  }, [mode, selectedDate, setBreadcrumb, selectedMonth]); // ✅ Added missing dependencies

  return (
    // ✅ Added padding to the root for consistency
    <div className="space-y-6 p-4 md:p-6">
      <PageHeader>
        <PageHeaderTitle value="Time Calculation" />
      </PageHeader>

      {/* ✅ Replaced the generic div with a Card for better structure */}
      <Card>
        <CardHeader>
          {/* ✅ This wrapper makes the toolbar container responsive.
            - It stacks on mobile (flex-col)
            - It becomes a row on medium screens+ (md:flex-row)
            - It justifies to the end on medium screens+ (md:justify-end)
            - It ensures the Toolbar component itself takes full width on mobile
          */}
          {/* <div className="flex flex-col md:flex-row md:justify-end w-full">


////i comment
            <Toolbar
              mode={mode}
              setMode={setMode}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              search={search}
              setSearch={setSearch}
            />
          </div> */}
        </CardHeader>

        {/* ✅ Table/loading state moved to CardContent for correct padding */}
        <CardContent>
          {loading ? (
            <div className="flex flex-col items-center justify-center p-10 space-y-2">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Loading data...</p>
            </div>
          ) : error ? (
            <div className="p-6 text-sm text-destructive">{error}</div>
          ) : mode === "day" ? (
            <DayTable data={dayData} search={search} />
          ) : (
            <MonthTable
              data={monthData}
              search={search}
              selectedMonth={selectedMonth}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}