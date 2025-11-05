
// import { useEffect, useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Input } from "@/components/ui/input";
// import { Loader2, Search } from "lucide-react";
// import axios from "axios";

// interface Employee {
//   id: number;
//   name: string;
//   epfNo: string;
//   jobPosition: string;
//   basicSalary: number;
//   otRate: number;
//   allowance: number;
//   deduction: number;
// }

// export default function EmployeesSalary() {
//   const [employees, setEmployees] = useState<Employee[]>([]);
//   const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [savingId, setSavingId] = useState<number | null>(null);
  
//   // Search and Pagination states
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);

//   useEffect(() => {
//     const fetchEmployees = async () => {
//       try {
//         console.log('🔄 [Frontend] Starting to fetch employees from API...');
        
//         // ✅ Temporary fix: Use direct backend URL
//         const res = await axios.get("https://leave-and-account-managment-system.onrender.com/salary/employees");
        
//         console.log('📨 [Frontend] Full API Response:', res);
//         console.log('📊 [Frontend] Response data:', res.data);
        
//         const employeesData = Array.isArray(res?.data) ? res.data : [];
//         console.log(`👥 [Frontend] Employees data length:`, employeesData.length);
        
//         const mappedEmployees = employeesData.map(emp => ({
//           id: emp.id,
//           name: emp.name || 'Unknown',
//           epfNo: emp.epfNo || '-' ,//
//           jobPosition: emp.jobPosition || '—',
//           basicSalary: emp.basicSalary || 0,
//           otRate: emp.otRate || 0,
//           allowance: emp.allowance || 0,
//           deduction: emp.deduction || 0,
//         }));
        
//         console.log('✅ [Frontend] Final mapped employees:', mappedEmployees);
//         setEmployees(mappedEmployees);
//         setFilteredEmployees(mappedEmployees);
//       } catch (err) {
//         console.error("❌ [Frontend] Failed to load employees:", err);
//               setEmployees([]);
//         setFilteredEmployees([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEmployees();
//   }, []);

//   // Filter employees based on search term
//   useEffect(() => {
//     if (searchTerm.trim() === "") {
//       setFilteredEmployees(employees);
//     } else {
//       const filtered = employees.filter(emp =>
//         emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//          emp.epfNo.toLowerCase().includes(searchTerm.toLowerCase()) ||// ✅ 
//         emp.jobPosition.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//       setFilteredEmployees(filtered);
//     }
//     setCurrentPage(1); // Reset to first page when searching
//   }, [searchTerm, employees]);

//   // Pagination calculations
//   const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;
//   const currentEmployees = filteredEmployees.slice(startIndex, endIndex);

//   const handleChange = (id: number, field: keyof Employee, value: number) => {
//     setEmployees((prev) =>
//       prev.map((emp) => (emp.id === id ? { ...emp, [field]: value } : emp))
//     );
//     // Also update filtered employees to reflect changes
//     setFilteredEmployees((prev) =>
//       prev.map((emp) => (emp.id === id ? { ...emp, [field]: value } : emp))
//     );
//   };

//   const saveSalaryConfig = async (employee: Employee) => {
//     setSaving(true);
//     setSavingId(employee.id);
//     try {
//       // ✅ Also use direct URL for POST requests
//       await axios.post("https://leave-and-account-managment-system.onrender.com/salary/config", {
//         userId: employee.id,
//         basicSalary: employee.basicSalary,
//         otRate: employee.otRate,
//         allowance: employee.allowance,
//         deduction: employee.deduction,
//       });
//       alert("Salary config saved!");
//     } catch (err) {
//       console.error("Failed to save salary config:", err);
//       alert("Failed to save salary config. Please try again.");
//     } finally {
//       setSaving(false);
//       setSavingId(null);
//     }
//   };

//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchTerm(e.target.value);
//   };

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//   };

//   const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setItemsPerPage(Number(e.target.value));
//     setCurrentPage(1);
//   };

//   const goToFirstPage = () => setCurrentPage(1);
//   const goToLastPage = () => setCurrentPage(totalPages);
//   const goToPrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
//   const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

//   return (
//     <div className="p-6 space-y-6">
//       <Card>
//         <CardHeader>
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//             <CardTitle className="text-xl font-semibold">Employee Salary Setup</CardTitle>
            
//             {/* Search Bar */}
//             <div className="relative w-full sm:w-64">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//               <Input
//                 type="text"
//                 placeholder="Search by name,  EPF No or position..."
//                 value={searchTerm}
//                 onChange={handleSearchChange}
//                 className="pl-10"
//               />
//             </div>
//           </div>
//         </CardHeader>
//         <CardContent>
//           {loading ? (
//             <div className="flex justify-center py-10">
//               <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
//             </div>
//           ) : !filteredEmployees || filteredEmployees.length === 0 ? (
//             <div className="text-center py-10">
//               <p className="text-gray-500">
//                 {searchTerm ? "No employees found matching your search." : "No employees found."}
//               </p>
//               {searchTerm && (
//                 <Button
//                   variant="outline"
//                   onClick={() => setSearchTerm("")}
//                   className="mt-2"
//                 >
//                   Clear Search
//                 </Button>
//               )}
//             </div>
//           ) : (
//             <>
//               {/* Items per page selector */}
//               <div className="flex justify-between items-center mb-4">
//                 <div className="text-sm text-gray-600">
//                   Showing {startIndex + 1}-{Math.min(endIndex, filteredEmployees.length)} of{" "}
//                   {filteredEmployees.length} employees
//                   {searchTerm && ` (filtered from ${employees.length} total)`}
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <label htmlFor="itemsPerPage" className="text-sm text-gray-600">
//                     Show:
//                   </label>
//                   <select
//                     id="itemsPerPage"
//                     value={itemsPerPage}
//                     onChange={handleItemsPerPageChange}
//                     className="border rounded px-2 py-1 text-sm"
//                   >
//                     <option value={5}>5</option>
//                     <option value={10}>10</option>
//                     <option value={20}>20</option>
//                     <option value={50}>50</option>
//                   </select>
//                 </div>
//               </div>

//               {/* Employees Table */}
//               <div className="border rounded-lg">
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>#</TableHead>
//                       <TableHead>Name</TableHead>
//                       <TableHead>EPF NO</TableHead>
//                       <TableHead>Job Position</TableHead>
//                       <TableHead>Basic Salary</TableHead>
//                       <TableHead>OT Rate</TableHead>
//                       <TableHead>Allowance</TableHead>
//                       <TableHead>Deduction</TableHead>
//                       <TableHead>Action</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {currentEmployees.map((emp, idx) => (
//                       <TableRow key={emp.id}>
//                         <TableCell>{startIndex + idx + 1}</TableCell>
//                         <TableCell className="font-medium">{emp.name}</TableCell>
//                         <TableCell className="font-mono text-sm">{emp.epfNo}</TableCell> {/* ✅ Show EPF No */}
//                         <TableCell>{emp.jobPosition}</TableCell>
//                         <TableCell>
//                           <Input
//                             type="number"
//                             value={emp.basicSalary}
//                             onChange={(e) => handleChange(emp.id, "basicSalary", Number(e.target.value))}
//                             min="0"
//                             step="0.01"
//                           />
//                         </TableCell>
//                         <TableCell>
//                           <Input
//                             type="number"
//                             value={emp.otRate}
//                             onChange={(e) => handleChange(emp.id, "otRate", Number(e.target.value))}
//                             min="0"
//                             step="0.01"
//                           />
//                         </TableCell>
//                         <TableCell>
//                           <Input
//                             type="number"
//                             value={emp.allowance}
//                             onChange={(e) => handleChange(emp.id, "allowance", Number(e.target.value))}
//                             min="0"
//                             step="0.01"
//                           />
//                         </TableCell>
//                         <TableCell>
//                           <Input
//                             type="number"
//                             value={emp.deduction}
//                             onChange={(e) => handleChange(emp.id, "deduction", Number(e.target.value))}
//                             min="0"
//                             step="0.01"
//                           />
//                         </TableCell>
//                         <TableCell>
//                           <Button
//                             size="sm"
//                             variant="outline"
//                             onClick={() => saveSalaryConfig(emp)}
//                             disabled={saving && savingId === emp.id}
//                           >
//                             {saving && savingId === emp.id ? (
//                               <>
//                                 <Loader2 className="h-4 w-4 animate-spin mr-2" />
//                                 Saving...
//                               </>
//                             ) : (
//                               "Save"
//                             )}
//                           </Button>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </div>

//               {/* Pagination Controls */}
//               {totalPages > 1 && (
//                 <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4 pt-4 border-t">
//                   <div className="text-sm text-gray-600">
//                     Page {currentPage} of {totalPages}
//                   </div>
                  
//                   <div className="flex items-center gap-2">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={goToFirstPage}
//                       disabled={currentPage === 1}
//                     >
//                       First
//                     </Button>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={goToPrevPage}
//                       disabled={currentPage === 1}
//                     >
//                       Previous
//                     </Button>
                    
//                     {/* Page Numbers */}
//                     <div className="flex gap-1">
//                       {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                         let pageNum;
//                         if (totalPages <= 5) {
//                           pageNum = i + 1;
//                         } else if (currentPage <= 3) {
//                           pageNum = i + 1;
//                         } else if (currentPage >= totalPages - 2) {
//                           pageNum = totalPages - 4 + i;
//                         } else {
//                           pageNum = currentPage - 2 + i;
//                         }
                        
//                         return (
//                           <Button
//                             key={pageNum}
//                             variant={currentPage === pageNum ? "default" : "outline"}
//                             size="sm"
//                             onClick={() => handlePageChange(pageNum)}
//                             className="w-8 h-8 p-0"
//                           >
//                             {pageNum}
//                           </Button>
//                         );
//                       })}
//                     </div>
                    
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={goToNextPage}
//                       disabled={currentPage === totalPages}
//                     >
//                       Next
//                     </Button>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={goToLastPage}
//                       disabled={currentPage === totalPages}
//                     >
//                       Last
//                     </Button>
//                   </div>
//                 </div>
//               )}
//             </>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, 
  Search, 
  Settings, 
  DollarSign, 
  Calendar,
  Download,
  Eye,
  Edit
} from "lucide-react";
import axios from "axios";

// Base Employee Interface
interface Employee {
  id: number;
  name: string;
  epfNo: string;
  jobPosition: string;
  basicSalary: number;
  otRate: number;
  allowance: number;
  deduction: number;
}

// Comprehensive Salary Setup Interface
interface EmployeeSalarySetup {
  id: number;
  name: string;
  epfNo: string;
  jobPosition: string;
  basicSalary: number;
  otRate: number;
  regulatoryAllowance: number;
  tasksAllowance1: number;
  tasksAllowance2: number;
  tasksAllowance3: number;
  tasksAllowance4: number;
  tasksAllowance5: number;
  perDayRate: number;
  latePerDayRate: number;
  paymentMethod: string;
  paymentFrequency: string;
  salaryDaysCalculation: string;
  epfPercentage: number;
  etfPercentage: number;
  taxPercentage: number;
  totalAllowances: number;
  grossSalary: number;
}

export default function EmployeesSalary() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [comprehensiveEmployees, setComprehensiveEmployees] = useState<EmployeeSalarySetup[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'basic' | 'comprehensive'>('basic');
  
  // Search and Pagination states
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const BASE_URL = "https://leave-and-account-managment-system.onrender.com";

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      console.log('🔄 [Frontend] Starting to fetch employees from API...');
      setLoading(true);

      if (viewMode === 'basic') {
        const res = await axios.get(`${BASE_URL}/salary/employees`);
        console.log('📨 [Frontend] Basic API Response:', res);
        
        const employeesData = Array.isArray(res?.data) ? res.data : [];
        console.log(`👥 [Frontend] Basic employees data length:`, employeesData.length);
        
        const mappedEmployees = employeesData.map(emp => ({
          id: emp.id,
          name: emp.name || 'Unknown',
          epfNo: emp.epfNo || '-',
          jobPosition: emp.jobPosition || '—',
          basicSalary: emp.basicSalary || 0,
          otRate: emp.otRate || 0,
          allowance: emp.allowance || 0,
          deduction: emp.deduction || 0,
        }));
        
        console.log('✅ [Frontend] Final mapped basic employees:', mappedEmployees);
        setEmployees(mappedEmployees);
        setFilteredEmployees(mappedEmployees);
      } else {
        const res = await axios.get(`${BASE_URL}/salary/employees/setup`);
        console.log('📨 [Frontend] Comprehensive API Response:', res);
        
        const employeesData = Array.isArray(res?.data?.data) ? res.data.data : [];
        console.log(`👥 [Frontend] Comprehensive employees data length:`, employeesData.length);
        
        setComprehensiveEmployees(employeesData);
        
        // Also update basic employees for filtering
        const basicEmployees = employeesData.map(emp => ({
          id: emp.id,
          name: emp.name,
          epfNo: emp.epfNo,
          jobPosition: emp.jobPosition,
          basicSalary: emp.basicSalary,
          otRate: emp.otRate,
          allowance: emp.regulatoryAllowance, // Map to regulatory allowance
          deduction: 0, // Default for basic view
        }));
        
        setEmployees(basicEmployees);
        setFilteredEmployees(basicEmployees);
      }
    } catch (err) {
      console.error("❌ [Frontend] Failed to load employees:", err);
      setEmployees([]);
      setFilteredEmployees([]);
      setComprehensiveEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter employees based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredEmployees(employees);
    } else {
      const filtered = employees.filter(emp =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.epfNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.jobPosition.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEmployees(filtered);
    }
    setCurrentPage(1); // Reset to first page when searching
  }, [searchTerm, employees]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEmployees = filteredEmployees.slice(startIndex, endIndex);

  const handleChange = (id: number, field: keyof Employee, value: number) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === id ? { ...emp, [field]: value } : emp))
    );
    setFilteredEmployees((prev) =>
      prev.map((emp) => (emp.id === id ? { ...emp, [field]: value } : emp))
    );
  };

  const saveSalaryConfig = async (employee: Employee) => {
    setSaving(true);
    setSavingId(employee.id);
    try {
      if (viewMode === 'basic') {
        await axios.post(`${BASE_URL}/salary/config`, {
          userId: employee.id,
          basicSalary: employee.basicSalary,
          otRate: employee.otRate,
          allowance: employee.allowance,
          deduction: employee.deduction,
        });
        alert("Basic salary config saved!");
      } else {
        // For comprehensive mode, we need to get the full setup first
        const comprehensiveEmp = comprehensiveEmployees.find(emp => emp.id === employee.id);
        if (comprehensiveEmp) {
          await axios.post(`${BASE_URL}/salary/setup`, {
            userId: employee.id,
            basicSalary: employee.basicSalary,
            otRate: employee.otRate,
            regulatoryAllowance: comprehensiveEmp.regulatoryAllowance,
            tasksAllowance1: comprehensiveEmp.tasksAllowance1,
            tasksAllowance2: comprehensiveEmp.tasksAllowance2,
            tasksAllowance3: comprehensiveEmp.tasksAllowance3,
            tasksAllowance4: comprehensiveEmp.tasksAllowance4,
            tasksAllowance5: comprehensiveEmp.tasksAllowance5,
            perDayRate: comprehensiveEmp.perDayRate,
            latePerDayRate: comprehensiveEmp.latePerDayRate,
            paymentMethod: comprehensiveEmp.paymentMethod,
            paymentFrequency: comprehensiveEmp.paymentFrequency,
            salaryDaysCalculation: comprehensiveEmp.salaryDaysCalculation,
            epfPercentage: comprehensiveEmp.epfPercentage,
            etfPercentage: comprehensiveEmp.etfPercentage,
            taxPercentage: comprehensiveEmp.taxPercentage,
          });
          alert("Comprehensive salary setup saved!");
        }
      }
    } catch (err) {
      console.error("Failed to save salary config:", err);
      alert("Failed to save salary config. Please try again.");
    } finally {
      setSaving(false);
      setSavingId(null);
    }
  };

  const handleViewModeChange = (mode: 'basic' | 'comprehensive') => {
    setViewMode(mode);
    setLoading(true);
    setTimeout(() => {
      fetchEmployees();
    }, 100);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

  const openComprehensiveSetup = (employeeId: number) => {
    // Navigate to comprehensive setup page or open modal
    window.open(`/salary/setup/${employeeId}`, '_blank');
  };

  const downloadSalarySheet = async () => {
    try {
      const currentDate = new Date();
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      
      const response = await axios.get(`${BASE_URL}/salary/download/${month}/${year}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `salary-sheet-${month}-${year}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Failed to download salary sheet:", err);
      alert("Failed to download salary sheet. Please try again.");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center gap-4">
              <CardTitle className="text-xl font-semibold">Employee Salary Management</CardTitle>
              
              {/* View Mode Toggle */}
              <div className="flex border rounded-lg p-1">
                <Button
                  variant={viewMode === 'basic' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handleViewModeChange('basic')}
                  className="px-3"
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Basic
                </Button>
                <Button
                  variant={viewMode === 'comprehensive' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handleViewModeChange('comprehensive')}
                  className="px-3"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Comprehensive
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Download Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={downloadSalarySheet}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
              
              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search by name, EPF No or position..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
              <span className="ml-2 text-gray-600">Loading employees...</span>
            </div>
          ) : !filteredEmployees || filteredEmployees.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">
                {searchTerm ? "No employees found matching your search." : "No employees found."}
              </p>
              {searchTerm && (
                <Button
                  variant="outline"
                  onClick={() => setSearchTerm("")}
                  className="mt-2"
                >
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            <>
              {/* View Mode Info */}
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant={viewMode === 'basic' ? 'default' : 'secondary'}>
                      {viewMode === 'basic' ? 'Basic View' : 'Comprehensive View'}
                    </Badge>
                    <span className="text-sm text-blue-700">
                      {viewMode === 'basic' 
                        ? 'Editing basic salary components only' 
                        : 'Viewing comprehensive salary setup - click "Setup" for full configuration'
                      }
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Total: {filteredEmployees.length} employees
                  </div>
                </div>
              </div>

              {/* Items per page selector */}
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm text-gray-600">
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredEmployees.length)} of{" "}
                  {filteredEmployees.length} employees
                  {searchTerm && ` (filtered from ${employees.length} total)`}
                </div>
                <div className="flex items-center gap-2">
                  <label htmlFor="itemsPerPage" className="text-sm text-gray-600">
                    Show:
                  </label>
                  <select
                    id="itemsPerPage"
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              </div>

              {/* Employees Table */}
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>EPF No</TableHead>
                      <TableHead>Job Position</TableHead>
                      <TableHead>Basic Salary</TableHead>
                      <TableHead>OT Rate</TableHead>
                      {viewMode === 'comprehensive' && (
                        <>
                          <TableHead>Allowances</TableHead>
                          <TableHead>Gross Salary</TableHead>
                        </>
                      )}
                      {viewMode === 'basic' && (
                        <>
                          <TableHead>Allowance</TableHead>
                          <TableHead>Deduction</TableHead>
                        </>
                      )}
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentEmployees.map((emp, idx) => {
                      const comprehensiveEmp = comprehensiveEmployees.find(compEmp => compEmp.id === emp.id);
                      
                      return (
                        <TableRow key={emp.id}>
                          <TableCell className="font-medium">{startIndex + idx + 1}</TableCell>
                          <TableCell className="font-medium">{emp.name}</TableCell>
                          <TableCell className="font-mono text-sm">{emp.epfNo}</TableCell>
                          <TableCell>{emp.jobPosition}</TableCell>
                          
                          {/* Basic Salary */}
                          <TableCell>
                            <Input
                              type="number"
                              value={emp.basicSalary}
                              onChange={(e) => handleChange(emp.id, "basicSalary", Number(e.target.value))}
                              min="0"
                              step="0.01"
                              className="w-24"
                            />
                          </TableCell>
                          
                          {/* OT Rate */}
                          <TableCell>
                            <Input
                              type="number"
                              value={emp.otRate}
                              onChange={(e) => handleChange(emp.id, "otRate", Number(e.target.value))}
                              min="0"
                              step="0.01"
                              className="w-20"
                            />
                          </TableCell>

                          {/* Comprehensive View Columns */}
                          {viewMode === 'comprehensive' && comprehensiveEmp && (
                            <>
                              <TableCell>
                                <Badge variant="outline" className="text-xs">
                                  LKR {comprehensiveEmp.totalAllowances.toFixed(2)}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="font-semibold text-green-600">
                                  LKR {comprehensiveEmp.grossSalary.toFixed(2)}
                                </div>
                              </TableCell>
                            </>
                          )}

                          {/* Basic View Columns */}
                          {viewMode === 'basic' && (
                            <>
                              <TableCell>
                                <Input
                                  type="number"
                                  value={emp.allowance}
                                  onChange={(e) => handleChange(emp.id, "allowance", Number(e.target.value))}
                                  min="0"
                                  step="0.01"
                                  className="w-20"
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  value={emp.deduction}
                                  onChange={(e) => handleChange(emp.id, "deduction", Number(e.target.value))}
                                  min="0"
                                  step="0.01"
                                  className="w-20"
                                />
                              </TableCell>
                            </>
                          )}

                          {/* Actions */}
                          <TableCell>
                            <div className="flex gap-2">
                              {viewMode === 'comprehensive' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => openComprehensiveSetup(emp.id)}
                                  className="flex items-center gap-1"
                                >
                                  <Settings className="h-3 w-3" />
                                  Setup
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => saveSalaryConfig(emp)}
                                disabled={saving && savingId === emp.id}
                                className="flex items-center gap-1"
                              >
                                {saving && savingId === emp.id ? (
                                  <>
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                    Saving...
                                  </>
                                ) : (
                                  <>
                                    <Edit className="h-3 w-3" />
                                    Save
                                  </>
                                )}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4 pt-4 border-t">
                  <div className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToFirstPage}
                      disabled={currentPage === 1}
                    >
                      First
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToPrevPage}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    
                    {/* Page Numbers */}
                    <div className="flex gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
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
                            size="sm"
                            onClick={() => handlePageChange(pageNum)}
                            className="w-8 h-8 p-0"
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToLastPage}
                      disabled={currentPage === totalPages}
                    >
                      Last
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}