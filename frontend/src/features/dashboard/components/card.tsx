// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { PieChart } from "@mui/x-charts/PieChart";

// interface StatProps {
//   title: string;
//   percentage: number;
//   count: number;
//   color?: string;
// }

// const StatCard = ({ title, percentage, count, color }: StatProps) => {
//   return (
//     <Card>
//       <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//         <CardTitle className="text-sm font-medium text-gray-600">
//           {title}
//         </CardTitle>
//         <span className="text-sm text-gray-500">{percentage}%</span>
//       </CardHeader>
//       <CardContent>
//         <div className="flex items-center justify-between">
//           {/* Left side: Number */}
//           <div className={`text-2xl font-bold ${color ?? "text-gray-800"}`}>
//             {count}
//           </div>

//           {/* Right side: Donut chart */}
//           <div className="w-16 h-16">
//             <PieChart
//               width={64}
//               height={64}
//               series={[
//                 {
//                   innerRadius: 20, // makes it donut
//                   outerRadius: 30,
//                   data: [
//                     { id: 0, value: percentage, color: color ?? "#4CAF50" },
//                     { id: 1, value: 100 - percentage, color: "#E5E7EB" },
//                   ],
//                 },
//               ]}
//               // ✅ TS-safe way to remove legend
//               slotProps={{
//                 legend: { hidden: true } as any,
//               }}
//             />
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default StatCard;
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription, // Import CardDescription
} from "@/components/ui/card";
import { PieChart } from "@mui/x-charts/PieChart";

interface StatProps {
  title: string;
  percentage: number;
  count: number;
  color?: string;
}

const StatCard = ({ title, percentage, count, color }: StatProps) => {
  const chartColor = color ?? "#4CAF50"; // Use a default color

  return (
    <Card>
      <CardHeader>
        {/* ✅ Responsive Header:
          - Stacks vertically on mobile (flex-col)
          - Becomes horizontal on tablet+ (sm:flex-row)
        */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between sm:space-x-2">
          <CardTitle className="text-base font-medium text-gray-800">
            {title}
          </CardTitle>
          <CardDescription
            className="text-sm text-gray-500 pt-1 sm:pt-0"
            style={{ color: chartColor }} // Use the color for the percentage
          >
            {percentage}% of Total
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {/* ✅ Responsive Content:
          - Stacks vertically on mobile (flex-col)
          - Becomes horizontal on tablet+ (sm:flex-row)
          - Uses 'gap-2' for spacing
        */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          {/* Left side: Number */}
          <div
            className={`text-3xl font-bold ${color ?? "text-gray-900"}`}
            style={{ color: chartColor }} // Use the color for the count
          >
            {count}
          </div>

          {/* Right side: Donut chart */}
          {/* Use a negative margin to visually align chart */}
          <div className="w-16 h-16 -m-2 sm:m-0">
            <PieChart
              width={64}
              height={64}
              series={[
                {
                  innerRadius: 20,
                  outerRadius: 30,
                  data: [
                    { id: 0, value: percentage, color: chartColor },
                    { id: 1, value: 100 - percentage, color: "#E5E7EB" },
                  ],
                  // Remove arcs padding for a smoother look
                  paddingAngle: 0, 
                },
              ]}
              // ✅ Simpler and type-safe way to remove legend
              legend={{ hidden: true }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;