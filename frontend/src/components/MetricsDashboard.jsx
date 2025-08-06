import React, { useState, useEffect } from "react";
import { Box, Paper, Typography, Grid, Button } from "@mui/material";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import ExplainChartModal from "./ExplainChartModal";
// import useAnalysisStore from "../stores/useAnalysisStore";
// import axios from 'axios';

const parseFinancialValue = (valueStr) => {
  if (typeof valueStr !== "string" || valueStr === "N/A") {
    return 0;
  }
  // This reliably removes all non-numeric characters except the decimal point.
  const numberPart = parseFloat(valueStr.replace(/[$,a-zA-Z]/g, ""));
  return isNaN(numberPart) ? 0 : numberPart;
};

const formatYAxis = (tickItem) => {
  if (tickItem >= 1000) {
    return `${tickItem / 1000}k`;
  }
  return tickItem;
};

function MetricCard({ title, value, data }) {
  const trendColor =
    data && data.length > 1
      ? data[data.length - 1].value > data[0].value
        ? "#4caf50"
        : data[data.length - 1].value < data[0].value
        ? "#f44336"
        : "#ccc" // neutral gray if same
      : "#ccc";
  console.log(data);

  return (
    <Paper
      elevation={4}
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "150px", // Fixed height for alignment
        backgroundColor: "#2a2a2a",
      }}
    >
      <Box>
        <Typography variant="subtitle1" color="text.secondary">
          {title}
        </Typography>
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", color: "primary.main", mt: 1 }}
        >
          {value}
        </Typography>
      </Box>
      <Box sx={{ height: "40px", width: "100%" }}>
        {data && data.length >= 1 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#333",
                  border: "1px solid #555",
                }}
                labelStyle={{ color: "#fff" }}
                formatter={(value) => [`${value.toLocaleString()}`, "Value"]}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={trendColor}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <Typography variant="caption" color="text.secondary" align="center">
            Not enough data to show trend
          </Typography>
        )}
      </Box>
    </Paper>
  );
}

function MetricsDashboard({ data, analysisResult ,context}) {
  const[modalOpen,setModalOpen]=useState(false)
  const [chartUnit, setChartUnit] = useState("Millions");
  const [history, setHistory] = useState([]);
  console.log(analysisResult);

  useEffect(() => {
    if (analysisResult) {
      // const fetchHistory = async () => {
      //   try {
      //     const API_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:5000';
      //     const response = await axios.get(`${API_URL}/api/history/${filename}`);
      //     setHistory(response.data);
      //   } catch (err) {
      //     console.error("Failed to fetch history for sparklines:", err);
      //   }
      // };
      // fetchHistory();
      if (!analysisResult?.key_metrics) return;
      const reports = [];

      // Add current report
      reports.push({
        key_metrics: {
          revenue: analysisResult.key_metrics.revenue || "N/A",
          netIncome: analysisResult.key_metrics.netIncome || "N/A",
          eps: analysisResult.key_metrics.eps || "N/A",
        },
      });
      if (analysisResult.previous_key_metrics) {
        reports.push({
          key_metrics: {
            revenue: analysisResult.previous_key_metrics.revenue || "N/A",
            netIncome: analysisResult.previous_key_metrics.netIncome || "N/A",
            eps: analysisResult.previous_key_metrics.eps || "N/A",
          },
        });
      }
      setHistory(reports);
    }
  }, [analysisResult]);
  console.log(history);

  useEffect(() => {
    if (data && data.revenue && typeof data.revenue === "string") {
      if (data.revenue.toLowerCase().includes("billion")) {
        setChartUnit("Billions");
      } else {
        setChartUnit("Millions");
      }
    }
  }, [data]); // Dependency array: this code runs whenever 'data' changes.

  if (!data) {
    return <Typography>No key metrics data available.</Typography>;
  }

  const revenueHistory = history
    .map((report) => ({
      value: parseFinancialValue(report.key_metrics.revenue),
    }))
    .filter((item) => item.value !== 0)
    .reverse();

  const netIncomeHistory = history
    .map((report) => ({
      value: parseFinancialValue(report.key_metrics.netIncome),
    }))
    .filter((item) => item.value !== 0)
    .reverse();

  const epsHistory = history
    .map((report) => ({ value: parseFinancialValue(report.key_metrics.eps) }))
    .filter((item) => item.value !== 0)
    .reverse();
  console.log(revenueHistory);
  console.log(netIncomeHistory);
  console.log(epsHistory);

  // Prepare the data for the chart
  const chartData = [
    {
      name: "Metrics",
      Revenue: parseFinancialValue(data.revenue),
      "Net Income": parseFinancialValue(data.netIncome),
    },
  ];
// function handleExplain(){
//   setModalOpen(true)
//   setchartData(chartData)
//   setchartTitle()
// }
  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Key Financial Metrics
      </Typography>

      {/* Stat Cards (Unchanged) */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
          gap: 2,
          mb: 4,
        }}
      >
        <MetricCard
          title="Total Revenue"
          value={data.revenue || "N/A"}
          data={revenueHistory}
        />
        <MetricCard
          title="Net Income"
          value={data.netIncome || "N/A"}
          data={netIncomeHistory}
        />
        <MetricCard
          title="Diluted EPS"
          value={data.eps || "N/A"}
          data={epsHistory}
        />
      </Box>

      {/* Bar Chart Visualization */}
      <Paper sx={{ p: 2, mt: 3, backgroundColor: "#2a2a2a" }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" gutterBottom sx={{ ml: 2, mt: 1 }}>Revenue vs. Net Income ( in {chartUnit})</Typography>
            {/* --- NEW: Explain Button --- */}
            <Button startIcon={<HelpOutlineIcon />} onClick={()=>setModalOpen(true)} size="small">
                Explain this Chart
            </Button>
        </Box>
        <Box sx={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="name" tick={{ fill: "#ccc" }} />
              {/* The Y-axis now uses our formatter */}
              <YAxis tick={{ fill: "#ccc" }} tickFormatter={formatYAxis} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#333",
                  border: "1px solid #555",
                }}
                labelStyle={{ color: "#fff" }}
              />
              <Legend wrapperStyle={{ color: "#ccc" }} />
              <Bar dataKey="Revenue" fill="#8884d8" />
              <Bar dataKey="Net Income" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
      <ExplainChartModal
      open={modalOpen}
      handleClose={() => setModalOpen(false)}
      chartTitle='Revenue vs. Net Income'
      chartData={chartData}
      context={context}
      />
    </Box>
  );
}

export default MetricsDashboard;
