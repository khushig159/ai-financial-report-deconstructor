import React, { useState, useEffect } from "react";
import { Box, Paper, Typography, Grid, Button, Divider } from "@mui/material";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
} from "recharts";
import { Tooltip } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import ExplainChartModal from "./ExplainChartModal";
// import useAnalysisStore from "../stores/useAnalysisStore";
// import axios from 'axios';
import BenchmarkDisplay from "./BenchmarkDisplay";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import styles from '../module/metrics.module.css'

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
      }}
    >
      <div className={styles.cardd}>
        <p>
          {title}
        </p>
        <h2
        >
          {value}
        </h2>
      </div>
      <Box sx={{ height: "40px", width: "100%" }}>
        {data && data.length >= 1 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <RechartsTooltip
                contentStyle={{
                  // backgroundColor: "#333",
                  // border: "1px solid #555",
                }}
                labelStyle={{ color: "#fff" }}
                formatter={(value) => [`${value.toLocaleString()}`, "Value"]}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={trendColor}
                strokeWidth={3}
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
const getBenchMarkStyle = (comparisonText) => {
  if (!comparisonText)
    return { color: "text.secondary", icon: <TrendingFlatIcon /> };
  const text = comparisonText.toLowerCase();
  if (
    text.includes("strong") ||
    text.includes("above average") ||
    text.includes("healthy") ||
    text.includes("better")
  ) {
    return { color: "success.main", icon: <TrendingUpIcon /> };
  }
  if (
    text.includes("weak") ||
    text.includes("below average") ||
    text.includes("concerning") ||
    text.includes("worse")
  ) {
    return { color: "error.main", icon: <TrendingDownIcon /> };
  }
  return { color: "warning.main", icon: <TrendingFlatIcon /> };
};
function RatioGauge({ title, value, benchMark }) {
  const style = getBenchMarkStyle(benchMark);
  const numericValue = parseFloat(value?.replace("%", "")) || 0;
  return (
    <Tooltip
      title={benchMark || "No benchmark available"}
      placement="top"
      arrow
    >
      <Paper
        elevation={4}
        sx={{
          p: 2,
          height: "100%",
          width:'90%',
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{display:'flex', alignItems:'start', gap:'20px'}}>
          <p style={{fontSize:'14px'}}>
            {title}
          </p>
          {React.cloneElement(style.icon, { sx: { color: style.color } })}</div>
        </Box>
        <h2
          style={{fontSize:'36px', fontWeight:'600'}}
        >
          {value}
        </h2>

        <Box
          sx={{
            width: "100%",
            height: "8px",
            backgroundColor: "grey.300",
            borderRadius: "4px",
          }}
        >
          <Box
            sx={{
              width: `${Math.min(numericValue, 100)}%`,
              height: "100%",
              backgroundColor: style.color,
              borderRadius: "4px",
            }}
          />
        </Box>
      </Paper>
    </Tooltip>
  );
}
function MetricsDashboard({
  data,
  ratios,
  benchmarkData,
  analysisResult,
  context,
}) {
  const ratio = ratios?.ratios;
  const [modalOpen, setModalOpen] = useState(false);
  const [chartUnit, setChartUnit] = useState("Millions");
  const [history, setHistory] = useState([]);
  console.log(analysisResult);

  useEffect(() => {
    if (analysisResult) {
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
    <>
    <div className={styles.container}>
      <div>
        <h2>
          Key Financial Metrics
        </h2>

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
        <Paper sx={{ p: 2, mt: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <p className={styles.p}>
              Revenue vs. Net Income ( in {chartUnit})
            </p>
            <button className={styles.bu}
              onClick={() => setModalOpen(true)}
            >
              Explain this Chart
            </button>
          </Box>
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="5 5" stroke="#cdccccff" />
                <XAxis dataKey="name" tick={{ fill: "#7d7d7dff" }} />
                {/* The Y-axis now uses our formatter */}
                <YAxis tick={{ fill: "#7d7d7dff" }} tickFormatter={formatYAxis} />
                <RechartsTooltip
                  contentStyle={{
                    // backgroundColor: "#333",
                    // border: "1px solid #a4a3a3ff",
                  }}
                  labelStyle={{ color: "#fff" }}
                />
                <Legend wrapperStyle={{ color: "#ccc" }} />
                <Bar dataKey="Revenue" fill="#5eaad0d8" />
                <Bar dataKey="Net Income" fill="#59d287ff" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
        <ExplainChartModal
          open={modalOpen}
          handleClose={() => setModalOpen(false)}
          chartTitle="Revenue vs. Net Income"
          chartData={chartData}
          context={context}
        />
      </div>
      <Box>
        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
          Key Financial Ratios
        </Typography>
        <div className={styles.grid}>
          {ratio.map((rat, index) => {
            const benchmark = benchmarkData?.benchmarks?.find(
              (b) => b.name === rat.name
            );
            return (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <RatioGauge
                  title={rat.name}
                  value={rat.value}
                  benchMark={benchmark?.comparison}
                />
              </Grid>
            );
          })}
        </div>

        <Divider sx={{ my: 4 }} />

        <BenchmarkDisplay data={benchmarkData} />
      </Box>
      </div>
    </>
  );
}

export default MetricsDashboard;
