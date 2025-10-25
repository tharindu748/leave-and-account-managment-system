// import { useEffect, useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Input } from "@/components/ui/input";
// import { Loader2 } from "lucide-react";
// import axios from "axios";

// interface Employee {
//   id: number;
//   name: string;
//   jobPosition: string;
//   basicSalary: number;
//   otRate: number;
//   allowance: number;
//   deduction: number;
// }

// export default function EmployeesSalary() {
//   const [employees, setEmployees] = useState<Employee[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [savingId, setSavingId] = useState<number | null>(null);

//   useEffect(() => {
//     const fetchEmployees = async () => {
//       try {
//         console.log('🔄 [Frontend] Starting to fetch employees from API...');
        
//         // ✅ Temporary fix: Use direct backend URL
//         const res = await axios.get("http://localhost:3000/salary/employees");
        
//         console.log('📨 [Frontend] Full API Response:', res);
//         console.log('📊 [Frontend] Response data:', res.data);
        
//         const employeesData = Array.isArray(res?.data) ? res.data : [];
//         console.log(`👥 [Frontend] Employees data length:`, employeesData.length);
        
//         const mappedEmployees = employeesData.map(emp => ({
//           id: emp.id,
//           name: emp.name || 'Unknown',
//           jobPosition: emp.jobPosition || '—',
//           basicSalary: emp.basicSalary || 0,
//           otRate: emp.otRate || 0,
//           allowance: emp.allowance || 0,
//           deduction: emp.deduction || 0,
//         }));
        
//         console.log('✅ [Frontend] Final mapped employees:', mappedEmployees);
//         setEmployees(mappedEmployees);
//       } catch (err) {
//         console.error("❌ [Frontend] Failed to load employees:", err);
//         console.error("❌ [Frontend] Error details:", err.response?.data || err.message);
//         setEmployees([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEmployees();
//   }, []);

//   const handleChange = (id: number, field: keyof Employee, value: number) => {
//     setEmployees((prev) =>
//       prev.map((emp) => (emp.id === id ? { ...emp, [field]: value } : emp))
//     );
//   };

//   const saveSalaryConfig = async (employee: Employee) => {
//     setSaving(true);
//     setSavingId(employee.id);
//     try {
//       // ✅ Also use direct URL for POST requests
//       await axios.post("http://localhost:3000/salary/config", {
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

//   return (
//     <div className="p-6 space-y-6">
//       <Card>
//         <CardHeader>
//           <CardTitle className="text-xl font-semibold">Employee Salary Setup</CardTitle>
//         </CardHeader>
//         <CardContent>
//           {loading ? (
//             <div className="flex justify-center py-10">
//               <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
//             </div>
//           ) : !employees || employees.length === 0 ? (
//             <p className="text-gray-500 text-center py-10">No employees found.</p>
//           ) : (
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>#</TableHead>
//                   <TableHead>Name</TableHead>
//                   <TableHead>Job Position</TableHead>
//                   <TableHead>Basic Salary</TableHead>
//                   <TableHead>OT Rate</TableHead>
//                   <TableHead>Allowance</TableHead>
//                   <TableHead>Deduction</TableHead>
//                   <TableHead>Action</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {employees.map((emp, idx) => (
//                   <TableRow key={emp.id}>
//                     <TableCell>{idx + 1}</TableCell>
//                     <TableCell>{emp.name}</TableCell>
//                     <TableCell>{emp.jobPosition}</TableCell>
//                     <TableCell>
//                       <Input
//                         type="number"
//                         value={emp.basicSalary}
//                         onChange={(e) => handleChange(emp.id, "basicSalary", Number(e.target.value))}
//                         min="0"
//                         step="0.01"
//                       />
//                     </TableCell>
//                     <TableCell>
//                       <Input
//                         type="number"
//                         value={emp.otRate}
//                         onChange={(e) => handleChange(emp.id, "otRate", Number(e.target.value))}
//                         min="0"
//                         step="0.01"
//                       />
//                     </TableCell>
//                     <TableCell>
//                       <Input
//                         type="number"
//                         value={emp.allowance}
//                         onChange={(e) => handleChange(emp.id, "allowance", Number(e.target.value))}
//                         min="0"
//                         step="0.01"
//                       />
//                     </TableCell>
//                     <TableCell>
//                       <Input
//                         type="number"
//                         value={emp.deduction}
//                         onChange={(e) => handleChange(emp.id, "deduction", Number(e.target.value))}
//                         min="0"
//                         step="0.01"
//                       />
//                     </TableCell>
//                     <TableCell>
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         onClick={() => saveSalaryConfig(emp)}
//                         disabled={saving && savingId === emp.id}
//                       >
//                         {saving && savingId === emp.id ? (
//                           <>
//                             <Loader2 className="h-4 w-4 animate-spin mr-2" />
//                             Saving...
//                           </>
//                         ) : (
//                           "Save"
//                         )}
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
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
import { Loader2, Search } from "lucide-react";
import axios from "axios";

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

export default function EmployeesSalary() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingId, setSavingId] = useState<number | null>(null);
  
  // Search and Pagination states
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        console.log('🔄 [Frontend] Starting to fetch employees from API...');
        
        // ✅ Temporary fix: Use direct backend URL
        const res = await axios.get("http://localhost:3000/salary/employees");
        
        console.log('📨 [Frontend] Full API Response:', res);
        console.log('📊 [Frontend] Response data:', res.data);
        
        const employeesData = Array.isArray(res?.data) ? res.data : [];
        console.log(`👥 [Frontend] Employees data length:`, employeesData.length);
        
        const mappedEmployees = employeesData.map(emp => ({
          id: emp.id,
          name: emp.name || 'Unknown',
          epfNo: emp.epfNo || '-' ,//
          jobPosition: emp.jobPosition || '—',
          basicSalary: emp.basicSalary || 0,
          otRate: emp.otRate || 0,
          allowance: emp.allowance || 0,
          deduction: emp.deduction || 0,
        }));
        
        console.log('✅ [Frontend] Final mapped employees:', mappedEmployees);
        setEmployees(mappedEmployees);
        setFilteredEmployees(mappedEmployees);
      } catch (err) {
        console.error("❌ [Frontend] Failed to load employees:", err);
        console.error("❌ [Frontend] Error details:", err.response?.data || err.message);
        setEmployees([]);
        setFilteredEmployees([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Filter employees based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredEmployees(employees);
    } else {
      const filtered = employees.filter(emp =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         emp.epfNo.toLowerCase().includes(searchTerm.toLowerCase()) ||// ✅ 
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
    // Also update filtered employees to reflect changes
    setFilteredEmployees((prev) =>
      prev.map((emp) => (emp.id === id ? { ...emp, [field]: value } : emp))
    );
  };

  const saveSalaryConfig = async (employee: Employee) => {
    setSaving(true);
    setSavingId(employee.id);
    try {
      // ✅ Also use direct URL for POST requests
      await axios.post("http://localhost:3000/salary/config", {
        userId: employee.id,
        basicSalary: employee.basicSalary,
        otRate: employee.otRate,
        allowance: employee.allowance,
        deduction: employee.deduction,
      });
      alert("Salary config saved!");
    } catch (err) {
      console.error("Failed to save salary config:", err);
      alert("Failed to save salary config. Please try again.");
    } finally {
      setSaving(false);
      setSavingId(null);
    }
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

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-xl font-semibold">Employee Salary Setup</CardTitle>
            
            {/* Search Bar */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search by name,  EPF No or position..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
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
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>EPF NO</TableHead>
                      <TableHead>Job Position</TableHead>
                      <TableHead>Basic Salary</TableHead>
                      <TableHead>OT Rate</TableHead>
                      <TableHead>Allowance</TableHead>
                      <TableHead>Deduction</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentEmployees.map((emp, idx) => (
                      <TableRow key={emp.id}>
                        <TableCell>{startIndex + idx + 1}</TableCell>
                        <TableCell className="font-medium">{emp.name}</TableCell>
                        <TableCell className="font-mono text-sm">{emp.epfNo}</TableCell> {/* ✅ Show EPF No */}
                        <TableCell>{emp.jobPosition}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={emp.basicSalary}
                            onChange={(e) => handleChange(emp.id, "basicSalary", Number(e.target.value))}
                            min="0"
                            step="0.01"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={emp.otRate}
                            onChange={(e) => handleChange(emp.id, "otRate", Number(e.target.value))}
                            min="0"
                            step="0.01"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={emp.allowance}
                            onChange={(e) => handleChange(emp.id, "allowance", Number(e.target.value))}
                            min="0"
                            step="0.01"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={emp.deduction}
                            onChange={(e) => handleChange(emp.id, "deduction", Number(e.target.value))}
                            min="0"
                            step="0.01"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => saveSalaryConfig(emp)}
                            disabled={saving && savingId === emp.id}
                          >
                            {saving && savingId === emp.id ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                Saving...
                              </>
                            ) : (
                              "Save"
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
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