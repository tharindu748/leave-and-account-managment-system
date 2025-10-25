// import * as React from "react";
// import { ChartContainer } from "@mui/x-charts/ChartContainer";
// import { BarPlot } from "@mui/x-charts/BarChart";
// import { ChartsXAxis } from "@mui/x-charts/ChartsXAxis";
// import { ChartsYAxis } from "@mui/x-charts/ChartsYAxis";

// const uData: number[] = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
// const xLabels: string[] = [
//   "Page A",
//   "Page B",
//   "Page C",
//   "Page D",
//   "Page E",
//   "Page F",
//   "Page G",
// ];

// const BarChart: React.FC = () => {
//   return (
//     <ChartContainer
//       width={500}
//       height={300}
//       series={[
//         {
//           data: uData,
//           label: "UV",
//           type: "bar",
//           color: "#4CAF50", // ✅ keep bar color
//         },
//       ]}
//       xAxis={[
//         {
//           scaleType: "band",
//           data: xLabels,
//           label: "Pages",
//           tickLabelStyle: {
//             fontSize: 12,
//             fill: "#555",
//             fontWeight: 500,
//           },
//         },
//       ]}
//       yAxis={[
//         {
//           label: "Users",
//           tickLabelStyle: {
//             fontSize: 12,
//             fill: "#333",
//             fontWeight: 500,
//           },
//         },
//       ]}
//     >
//       <BarPlot />
//       <ChartsXAxis />
//       <ChartsYAxis />
//     </ChartContainer>
//   );
// };

// export default BarChart;
import * as React from "react";
import { ChartContainer } from "@mui/x-charts/ChartContainer";
import { BarPlot } from "@mui/x-charts/BarChart";
import { ChartsXAxis } from "@mui/x-charts/ChartsXAxis";
import { ChartsYAxis } from "@mui/x-charts/ChartsYAxis";

const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
const xLabels = ["Page A", "Page B", "Page C", "Page D", "Page E", "Page F", "Page G"];

const ResponsiveBarChart: React.FC = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [size, setSize] = React.useState({ width: 500, height: 300 });

  React.useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver(entries => {
      const entry = entries[0];
      setSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100%", minHeight: 300 }}
    >
      <ChartContainer
        width={size.width}
        height={size.height}
        series={[
          {
            data: uData,
            label: "UV",
            type: "bar",
            color: "#4CAF50",
          },
        ]}
        xAxis={[
          {
            scaleType: "band",
            data: xLabels,
            label: "Pages",
            tickLabelStyle: {
              fontSize: 12,
              fill: "#555",
              fontWeight: 500,
            },
          },
        ]}
        yAxis={[
          {
            label: "Users",
            tickLabelStyle: {
              fontSize: 12,
              fill: "#333",
              fontWeight: 500,
            },
          },
        ]}
      >
        <BarPlot />
        <ChartsXAxis />
        <ChartsYAxis />
      </ChartContainer>
    </div>
  );
};

export default ResponsiveBarChart;
