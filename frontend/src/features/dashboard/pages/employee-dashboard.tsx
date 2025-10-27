import React, { useEffect, useState } from "react";
import {
  User,
  Calendar,
  Clock,
  Mail,
  Briefcase,
  Hash,
  Camera,
  Loader2,
} from "lucide-react";
import PageHeader from "@/components/page-header/wrapper";
import PageHeaderTitle from "@/components/page-header/title";
import type { OutletContextType } from "@/layouts/main-layout";
import { useOutletContext } from "react-router";
import api from "@/api/axios";
import { useAuth } from "@/context/auth-context";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/firebaseConfig";

interface Employee {
  id: string;
  name: string;
  email: string;
  position: string;
  epfNo: string;
  image: string | null; // This should be the Firebase URL stored in PostgreSQL
  workedSinceJoining: number;
  totalLeaveCount: number;
  leaveTaken: {
    sick: number;
    annual: number;
  };
  remainingHolidays: number;
  workHoursThisMonth: number;
}

const EmployeeDashboard: React.FC = () => {
  const { setBreadcrumb } = useOutletContext<OutletContextType>();
  const [data, setData] = useState<Employee | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const userId = user?.id;

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!userId) {
        throw new Error("User ID not found. Please ensure you are logged in.");
      }

      console.log("Fetching dashboard data for user ID:", userId);
      
      // ✅ FIXED: Use the new dashboard endpoint
      const res = await api.get(`/users/${userId}/dashboard`);
      console.log("Dashboard data received:", res.data);
      
      // Transform the data to match your Employee interface
      const userData = res.data;
      const transformedData: Employee = {
        id: userData.id.toString(),
        name: userData.name,
        email: userData.email,
        position: userData.position || userData.jobPosition || "Employee",
        epfNo: userData.epfNo || "N/A",
        image: userData.imagePath, // Use imagePath from backend
        workedSinceJoining: userData.workedSinceJoining || 0,
        totalLeaveCount: userData.totalLeaveCount || 0,
        leaveTaken: userData.leaveTaken || { sick: 0, annual: 0 },
        remainingHolidays: userData.remainingHolidays || 0,
        workHoursThisMonth: userData.workHoursThisMonth || 0
      };
      
      setData(transformedData);
    } catch (error: any) {
      console.error("Error fetching dashboard data:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to load dashboard data";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    setBreadcrumb(["Dashboard"]);
    
    if (userId) {
      fetchData();
    } else {
      console.log("No user ID available");
      setIsLoading(false);
      setError("Unable to load user information. Please log in again.");
    }
  }, [userId, setBreadcrumb]);

  // SIMPLIFIED: Directly use the Firebase URL from PostgreSQL
  const imageUrl = data?.image;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;
    
    // Reset file input
    e.target.value = '';

    // Validate file type
    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validImageTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Create a reference to the file location in Firebase Storage
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop();
      const fileName = `profile_${timestamp}.${fileExtension}`;
      const storageRef = ref(storage, `users/${userId}/${fileName}`);
      
      console.log("📤 Uploading to Firebase Storage...");

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
          console.log(`Upload progress: ${progress}%`);
        },
        (error) => {
          console.error("❌ Upload failed:", error);
          setIsUploading(false);
          setUploadProgress(0);
          alert('Image upload failed. Please try again.');
        },
        async () => {
          try {
            // Get the download URL from Firebase
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log("✅ File uploaded to Firebase:", downloadURL);

            // Save the Firebase URL to PostgreSQL
            console.log("💾 Saving Firebase URL to PostgreSQL...");
            // const response = await api.put(`/employees/${userId}/update-image`, {
            //   imagePath: downloadURL
            // });

            // ✅ TO:
              const response = await api.patch(`/users/${userId}/simple`, {
                imagePath: downloadURL
              });

            console.log("✅ PostgreSQL update response:", response.data);

            // IMPORTANT: Update local state immediately with the new URL
            if (data) {
              setData({
                ...data,
                image: downloadURL
              });
            }

            // Also refetch to ensure data is consistent
            await fetchData();

            console.log("✅ Image update completed successfully!");
            alert('Profile image updated successfully!');
          } catch (error: any) {
            console.error("❌ Error updating user image:", error);
            console.error("Error details:", error.response?.data);
            alert('Error updating profile image. Please try again.');
          } finally {
            setIsUploading(false);
            setUploadProgress(0);
          }
        }
      );
    } catch (error) {
      console.error("❌ Error starting upload:", error);
      setIsUploading(false);
      setUploadProgress(0);
      alert('Failed to start upload. Please try again.');
    }
  };

  // Debug function to check current state
  const debugImageState = () => {
    console.log('=== DEBUG IMAGE STATE ===');
    console.log('Data:', data);
    console.log('Image URL:', imageUrl);
    console.log('Image field in data:', data?.image);
    console.log('========================');
  };

  // Loading state
  if (isLoading) {
    return (
      <>
        <PageHeader>
          <div className="flex items-center gap-4">
            <PageHeaderTitle value="Dashboard" />
          </div>
        </PageHeader>
        <div className="p-4">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading dashboard...</span>
          </div>
        </div>
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <PageHeader>
          <div className="flex items-center gap-4">
            <PageHeaderTitle value="Dashboard" />
          </div>
        </PageHeader>
        <div className="p-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-red-600 mb-2">{error}</div>
            <button
              onClick={fetchData}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader>
        <div className="flex items-center gap-4">
          <PageHeaderTitle value="Dashboard" />
        </div>
        
        {/* Debug buttons - remove in production */}
        <button 
          onClick={debugImageState}
          className="bg-gray-500 text-white px-3 py-1 rounded text-sm"
        >
          Debug Image
        </button>
        <button 
          onClick={fetchData}
          className="bg-green-500 text-white px-3 py-1 rounded text-sm"
        >
          Refresh Data
        </button>
      </PageHeader>
      
      <div className="p-4">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Employee Profile Section */}
            <div className="rounded-lg p-6 border bg-white shadow-sm">
              <div className="flex flex-col items-center mb-6">
                <div className="relative group mb-4">
                  <div className="w-32 h-32 rounded-full flex items-center justify-center border-2 border-gray-200 overflow-hidden bg-gray-50">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={data?.name || "Profile image"}
                        className="w-full h-full object-cover"
                        onLoad={() => console.log('✅ Image loaded successfully!')}
                        onError={(e) => {
                          console.error('❌ Image failed to load:', imageUrl);
                          const target = e.currentTarget;
                          target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <User className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  {/* Upload Overlay */}
                  <label
                    htmlFor="image-upload"
                    className={`absolute inset-0 w-32 h-32 rounded-full bg-black bg-opacity-40 flex items-center justify-center transition-opacity cursor-pointer ${
                      isUploading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}
                    title="Change profile picture"
                  >
                    {isUploading ? (
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                    ) : (
                      <Camera className="w-6 h-6 text-white" />
                    )}
                  </label>
                  
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="hidden"
                  />
                </div>

                {/* Upload Progress */}
                {isUploading && (
                  <div className="w-full max-w-xs mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 text-center mt-2">
                      Uploading... {Math.round(uploadProgress)}%
                    </p>
                  </div>
                )}

                <div className="w-full space-y-4">
                  <div className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center text-gray-700 mb-2">
                      <User className="w-4 h-4 mr-2 text-blue-600" />
                      <span className="text-sm font-medium text-blue-600">
                        Name
                      </span>
                    </div>
                    <p className="font-semibold text-gray-900">{data?.name || "N/A"}</p>
                  </div>

                  <div className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center text-gray-700 mb-2">
                      <Mail className="w-4 h-4 mr-2 text-blue-600" />
                      <span className="text-sm font-medium text-blue-600">
                        Email
                      </span>
                    </div>
                    <p className="text-gray-900 break-all">{data?.email || "N/A"}</p>
                  </div>

                  <div className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center text-gray-700 mb-2">
                      <Briefcase className="w-4 h-4 mr-2 text-blue-600" />
                      <span className="text-sm font-medium text-blue-600">
                        Position
                      </span>
                    </div>
                    <p className="text-gray-900">{data?.position || "N/A"}</p>
                  </div>

                  <div className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center text-gray-700 mb-2">
                      <Hash className="w-4 h-4 mr-2 text-blue-600" />
                      <span className="text-sm font-medium text-blue-600">
                        EPF No
                      </span>
                    </div>
                    <p className="text-gray-900">{data?.epfNo || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Stats and Leave Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Worked Since Joining */}
              <div className="rounded-lg p-6 border bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <Clock className="w-6 h-6 mr-3 text-green-600" />
                  <h2 className="text-xl font-semibold text-green-600">
                    Worked Since Joining
                  </h2>
                </div>
                <div className="text-4xl font-bold text-gray-900">
                  {data?.workedSinceJoining?.toLocaleString() || "0"}
                  <span className="text-lg font-normal text-gray-600 ml-2">
                    days
                  </span>
                </div>
              </div>

              {/* Total Leave Count */}
              <div className="rounded-lg p-6 border bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <Calendar className="w-6 h-6 mr-3 text-purple-600" />
                  <h2 className="text-xl font-semibold text-purple-600">
                    Total Leave Count
                  </h2>
                </div>
                <div className="text-4xl font-bold text-gray-900">
                  {data?.totalLeaveCount?.toLocaleString() || "0"}
                  <span className="text-lg font-normal text-gray-600 ml-2">
                    days
                  </span>
                </div>
              </div>

              {/* Leave Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Leave Taken */}
                <div className="rounded-lg p-6 border bg-white shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-semibold text-orange-600 mb-4">
                    Leave Taken
                  </h3>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4 bg-orange-50 hover:bg-orange-100 transition-colors">
                      <div className="flex justify-between items-center">
                        <span className="text-orange-700 font-medium">Sick Leave</span>
                        <span className="text-2xl font-bold text-gray-900">
                          {data?.leaveTaken?.sick || "0"}
                        </span>
                      </div>
                    </div>
                    <div className="border rounded-lg p-4 bg-blue-50 hover:bg-blue-100 transition-colors">
                      <div className="flex justify-between items-center">
                        <span className="text-blue-700 font-medium">Annual Leave</span>
                        <span className="text-2xl font-bold text-gray-900">
                          {data?.leaveTaken?.annual || "0"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Remaining Holidays and Work Hours */}
                <div className="space-y-6">
                  <div className="bg-white rounded-lg p-6 border shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-semibold text-red-600 mb-2">
                      Remaining Holidays
                    </h3>
                    <div className="text-3xl font-bold text-gray-900">
                      {data?.remainingHolidays || "0"}
                      <span className="text-base font-normal text-gray-600 ml-2">
                        days
                      </span>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-6 border shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-semibold text-indigo-600 mb-2">
                      This Month Work Hours
                    </h3>
                    <div className="text-3xl font-bold text-gray-900">
                      {data?.workHoursThisMonth?.toLocaleString() || "0"}
                      <span className="text-base font-normal text-gray-600 ml-2">
                        hours
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeeDashboard;