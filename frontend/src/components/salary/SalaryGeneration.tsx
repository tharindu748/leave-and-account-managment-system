
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Download,
  Calculator,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import axios from "axios";
import { cn } from "@/lib/utils";

// --- Interfaces ---

interface EmployeeSalary {
  id: number;
  name: string;
  epfNo: string;
  jobPosition: string;
  basicSalary: number;
  otRate: number;
  allowance: number;
  deduction: number;
  totalLeaveDays: number;
  netSalary: number;
}

interface GeneratedSalary {
  id: number;
  userId: number;
  month: number;
  year: number;
  basicSalary: number;
  totalLeave: number;
  leaveDeductions: number;
  overtimePay: number;
  allowance?: number;
  netSalary: number;
  generatedAt: string;
  user?: {
    name: string;
    epfNo: string;
    jobPosition: string;
  } | null; // Allow user to be null
}

// --- Pagination Component ---

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  if (totalPages <= 1) return null;

  return (
    <div className={cn("flex items-center justify-between px-2", className)}>
      <div className="flex-1 text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(1)}
          disabled={!canGoPrevious}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canGoPrevious}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        {/* Page numbers */}
        <div className="flex items-center space-x-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum: number;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }

            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? "default" : "outline"}
                size="icon"
                className="w-8 h-8"
                onClick={() => onPageChange(pageNum)}
              >
                {pageNum}
              </Button>
            );
          })}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoNext}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(totalPages)}
          disabled={!canGoNext}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// --- Main Component ---

export default function SalaryGeneration() {
  const [employees, setEmployees] = useState<EmployeeSalary[]>([]);
  const [generatedSalaries, setGeneratedSalaries] = useState<GeneratedSalary[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Form states
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [selectedEmployee, setSelectedEmployee] = useState<string>("all");

  // Pagination states
  const [salariesCurrentPage, setSalariesCurrentPage] = useState(1);
  const [employeesCurrentPage, setEmployeesCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const years = Array.from(
    { length: 10 },
    (_, i) => new Date().getFullYear() - 5 + i
  );

  useEffect(() => {
    fetchEmployees();
    fetchGeneratedSalaries(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear]);

  // Reset pagination when search term changes
  useEffect(() => {
    setSalariesCurrentPage(1);
    setEmployeesCurrentPage(1);
  }, [searchTerm]);

  // --- Data Fetching ---

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://leave-and-account-managment-system.onrender.com/salary/employees");
      setEmployees(res.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGeneratedSalaries = async (month?: number, year?: number) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (month) params.append("month", month.toString());
      if (year) params.append("year", year.toString());

      const res = await axios.get(
        `https://leave-and-account-managment-system.onrender.com/salary/period?${params}`
      );

      const salaries = Array.isArray(res.data) ? res.data : res.data.data;
      setGeneratedSalaries(salaries || []);
    } catch (error) {
      console.error("Error fetching generated salaries:", error);
      setGeneratedSalaries([]);
    } finally {
      setLoading(false);
    }
  };

  // --- Actions ---

  const generateSalary = async (employeeId?: number) => {
    try {
      setGenerating(true);
      const generationData = {
        month: selectedMonth,
        year: selectedYear,
      };

      if (employeeId) {
        await axios.post("https://leave-and-account-managment-system.onrender.com/salary/generate", {
          ...generationData,
          userId: employeeId,
        });
      } else {
        const promises = employees.map((employee) =>
          axios.post("https://leave-and-account-managment-system.onrender.com/salary/generate", {
            ...generationData,
            userId: employee.id,
          })
        );
        await Promise.all(promises);
      }

      alert("Salary generated successfully!");
      fetchGeneratedSalaries(selectedMonth, selectedYear);
    } catch (error) {
      console.error("Error generating salary:", error);
      alert("Failed to generate salary. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const downloadSalarySheet = async () => {
    try {
      const params = new URLSearchParams();
      params.append("month", selectedMonth.toString());
      params.append("year", selectedYear.toString());

      const res = await axios.get(
        `https://leave-and-account-managment-system.onrender.com/salary/period?${params}`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `salary-sheet-${selectedMonth}-${selectedYear}.csv`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading salary sheet:", error);
      alert("Failed to download salary sheet.");
    }
  };

  // --- Filtering & Pagination Logic ---

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.epfNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.jobPosition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fixed: Added null checks for salary.user
  const filteredSalaries = generatedSalaries.filter((salary) => {
    const userName = salary.user?.name || "";
    const userEpfNo = salary.user?.epfNo || "";
    
    return (
      userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userEpfNo.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Calculate pagination for salaries
  const salariesTotalPages = Math.ceil(filteredSalaries.length / itemsPerPage);
  const salariesStartIndex = (salariesCurrentPage - 1) * itemsPerPage;
  const salariesEndIndex = salariesStartIndex + itemsPerPage;
  const paginatedSalaries = filteredSalaries.slice(salariesStartIndex, salariesEndIndex);

  // Calculate pagination for employees
  const employeesTotalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const employeesStartIndex = (employeesCurrentPage - 1) * itemsPerPage;
  const employeesEndIndex = employeesStartIndex + itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(employeesStartIndex, employeesEndIndex);

  // Helper function to safely get user data
  const getUserDisplayName = (salary: GeneratedSalary) => {
    return salary.user?.name || "Unknown Employee";
  };

  const getUserEpfNo = (salary: GeneratedSalary) => {
    return salary.user?.epfNo || "N/A";
  };

  const getUserJobPosition = (salary: GeneratedSalary) => {
    return salary.user?.jobPosition || "N/A";
  };

  // --- Render ---

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
        <h1 className="text-3xl font-bold">Salary Generation</h1>
      </div>

      {/* Generation Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Generate Salary</CardTitle>
          <CardDescription>
            Select a period and employee to generate salaries.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:flex-wrap gap-4 md:items-end">
            <div className="flex-1 min-w-[180px]">
              <Label htmlFor="month">Month</Label>
              <Select
                value={selectedMonth.toString()}
                onValueChange={(value) => setSelectedMonth(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value.toString()}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 min-w-[180px]">
              <Label htmlFor="year">Year</Label>
              <Select
                value={selectedYear.toString()}
                onValueChange={(value) => setSelectedYear(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 min-w-[180px]">
              <Label htmlFor="employee">Employee</Label>
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger>
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Employees</SelectItem>
                  {employees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id.toString()}>
                      {emp.name} ({emp.epfNo})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 min-w-[180px]">
              <Label htmlFor="itemsPerPage">Items Per Page</Label>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => setItemsPerPage(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Items per page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={() =>
                generateSalary(
                  selectedEmployee === "all" ? undefined : Number(selectedEmployee)
                )
              }
              disabled={generating}
              className="w-full md:w-auto"
            >
              {generating ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Calculator className="h-4 w-4 mr-2" />
              )}
              {generating
                ? "Generating..."
                : `Generate ${selectedEmployee === "all" ? "All" : ""}`}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Toolbar for Generated Salaries */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search salaries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          onClick={downloadSalarySheet}
          variant="outline"
          className="w-full md:w-auto"
        >
          <Download className="h-4 w-4 mr-2" />
          Download Sheet
        </Button>
      </div>

      {/* Generated Salaries List */}
      <Card>
        <CardHeader>
          <CardTitle>
            Generated Salaries - {months.find((m) => m.value === selectedMonth)?.label}{" "}
            {selectedYear}
            <span className="text-sm font-normal text-muted-foreground ml-2">
              ({filteredSalaries.length} records)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          ) : filteredSalaries.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No salaries generated for this period.
            </div>
          ) : (
            <div>
              {/* --- Desktop Table View --- */}
              <div className="border rounded-lg hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>EPF No</TableHead>
                      <TableHead className="hidden lg:table-cell">
                        Position
                      </TableHead>
                      <TableHead>Basic</TableHead>
                      <TableHead>Overtime</TableHead>
                      <TableHead>Allowance</TableHead>
                      <TableHead>Deductions</TableHead>
                      <TableHead>Leave</TableHead>
                      <TableHead>Net Salary</TableHead>
                      <TableHead className="hidden lg:table-cell">
                        Generated
                      </TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedSalaries.map((salary) => (
                      <TableRow key={salary.id}>
                        <TableCell className="font-medium">
                          {getUserDisplayName(salary)}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {getUserEpfNo(salary)}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {getUserJobPosition(salary)}
                        </TableCell>
                        <TableCell>
                          LKR {salary.basicSalary.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          LKR {salary.overtimePay.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          LKR {(salary.allowance || 0).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          LKR {salary.leaveDeductions.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              salary.totalLeave > 0 ? "destructive" : "default"
                            }
                          >
                            {salary.totalLeave}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-bold text-green-600">
                          LKR {salary.netSalary.toFixed(2)}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-sm text-gray-500">
                          {new Date(salary.generatedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant="default">Generated</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* --- Mobile Card View --- */}
              <div className="block md:hidden space-y-4">
                {paginatedSalaries.map((salary) => (
                  <Card key={salary.id}>
                    <CardHeader>
                      <CardTitle>{getUserDisplayName(salary)}</CardTitle>
                      <CardDescription>
                        {getUserEpfNo(salary)} | {getUserJobPosition(salary)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-xl font-bold text-green-600">
                        LKR {salary.netSalary.toFixed(2)}
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Basic:</span>
                          <span>LKR {salary.basicSalary.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Overtime:</span>
                          <span>LKR {salary.overtimePay.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Allowance:</span>
                          <span>LKR {(salary.allowance || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Deductions:
                          </span>
                          <span className="text-red-600">
                            -LKR {salary.leaveDeductions.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <Badge
                          variant={
                            salary.totalLeave > 0 ? "destructive" : "default"
                          }
                        >
                          {salary.totalLeave} Leave Days
                        </Badge>
                        <Badge variant="default">Generated</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination for Salaries */}
              <Pagination
                currentPage={salariesCurrentPage}
                totalPages={salariesTotalPages}
                onPageChange={setSalariesCurrentPage}
                className="mt-4"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Employee List for Reference */}
      <Card>
        <CardHeader>
          <CardTitle>
            Employee Reference List
            <span className="text-sm font-normal text-muted-foreground ml-2">
              ({filteredEmployees.length} employees)
            </span>
          </CardTitle>
          <CardDescription>
            Base salary information for all employees.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* --- Desktop Table View --- */}
          <div className="border rounded-lg hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>EPF No</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Basic</TableHead>
                  <TableHead className="hidden lg:table-cell">OT Rate</TableHead>
                  <TableHead>Allowance</TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Deduction
                  </TableHead>
                  <TableHead>Net Salary</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedEmployees.map((emp) => (
                  <TableRow key={emp.id}>
                    <TableCell className="font-medium">{emp.name}</TableCell>
                    <TableCell className="font-mono text-sm">
                      {emp.epfNo}
                    </TableCell>
                    <TableCell>{emp.jobPosition}</TableCell>
                    <TableCell>LKR {emp.basicSalary.toFixed(2)}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      LKR {emp.otRate.toFixed(2)}/hr
                    </TableCell>
                    <TableCell>LKR {emp.allowance.toFixed(2)}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      LKR {emp.deduction.toFixed(2)}
                    </TableCell>
                    <TableCell className="font-semibold">
                      LKR {emp.netSalary.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* --- Mobile Card View --- */}
          <div className="block md:hidden space-y-4">
            {paginatedEmployees.map((emp) => (
              <Card key={emp.id}>
                <CardHeader>
                  <CardTitle>{emp.name}</CardTitle>
                  <CardDescription>
                    {emp.epfNo} | {emp.jobPosition}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-lg font-semibold">
                    Net: LKR {emp.netSalary.toFixed(2)}
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Basic:</span>
                      <span>LKR {emp.basicSalary.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Allowance:</span>
                      <span>LKR {emp.allowance.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">OT Rate:</span>
                      <span>LKR {emp.otRate.toFixed(2)}/hr</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination for Employees */}
          <Pagination
            currentPage={employeesCurrentPage}
            totalPages={employeesTotalPages}
            onPageChange={setEmployeesCurrentPage}
            className="mt-4"
          />
        </CardContent>
      </Card>
    </div>
  );
}