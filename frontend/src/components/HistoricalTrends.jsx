import React, { useState, useEffect } from "react";
import styles from '../module/metrics.module.css'
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  Button
} from "@mui/material";
// import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import ExplainChartModal from "./ExplainChartModal";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import RedFlagDisplay from "./RedFlagDisplay";
import RiskSummary from "./RiskSummary";

// Helper function to parse financial strings into numbers
const parseFinancialValue = (valueStr) => {
  if (typeof valueStr !== "string" || valueStr === "N/A") {
    return null;
  }

  const isBillion = valueStr.toLowerCase().includes("b");
  // const isMillion = valueStr.toLowerCase().includes("m");

  let numberPart = parseFloat(valueStr.replace(/[$,a-zA-Z]/g, ""));
  if (isNaN(numberPart)) return null;

  if (isBillion) {
    numberPart *= 1000; // Convert billions to millions
  }

  return numberPart;
};
const formatYAxis = (tickItem) => {
  if (tickItem >= 1000) {
    return `${tickItem / 1000}k`;
  }
  return tickItem;
};

// Helper function to format dates for the chart's X-axis
// const formatDate = (dateString) => {
//     const options = { year: 'numeric', month: 'short', day: 'numeric' };
//     return new Date(dateString).toLocaleDateString(undefined, options);
// };

function HistoricalTrends({ analysisResult,context,redFlagsData,data }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [history, setHistory] = useState([]);
  // const [isLoading, setIsLoading] = useState(true);
  // const [error, setError] = useState(null);

  useEffect(() => {
    if (analysisResult) {
      const formattedData = [];
      if (
        analysisResult.previous_key_metrics &&
        analysisResult.previous_management_tone
      ) {
        formattedData.push({
          date: "Previous Report",
          Revenue: parseFinancialValue(
            analysisResult.previous_key_metrics.revenue
          ),
          "Net Income": parseFinancialValue(
            analysisResult.previous_key_metrics.netIncome
          ),
          "Cautiousness Score":
            analysisResult.previous_management_tone.cautiousness_score,
        });
      }
      if (analysisResult.key_metrics && analysisResult.management_tone) {
        formattedData.push({
          date: "Current Report",
          Revenue: parseFinancialValue(analysisResult.key_metrics.revenue),
          "Net Income": parseFinancialValue(
            analysisResult.key_metrics.netIncome
          ),
          "Cautiousness Score":
            analysisResult.management_tone.cautiousness_score,
        });
      }
      setHistory(formattedData);
    }
  }, [analysisResult]); 


  if (history.length < 2) {
    return (
      <Typography>
        At least two reports for this file must be analyzed to show a trend.
      </Typography>
    );
  }

  return (
    <div style={{marginLeft:'320px',marginRight:'30px'}}>
      <RiskSummary data={data} redFlagsData={redFlagsData}/>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Historical Trend Analysis for: {analysisResult.companyTicker}
      </Typography>

      {/* <Grid container spacing={5}> */}
        {/* Financial Trends Chart */}
        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 2,height: 400 }}>
            <Typography variant="h6" gutterBottom sx={{ ml: 2, mt: 1,fontFamily:'DM sans',fontWeight:'500',color:'#363636ff' }}>
              Revenue & Net Income (in Millions)
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <LineChart
                data={history}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#b1b1b1ff" />
                <XAxis dataKey="date" tick={{ fill: "#ccc" }} />
                <YAxis tick={{ fill: "#ccc" }} tickFormatter={formatYAxis} />
                <Tooltip
                  contentStyle={{
                    // backgroundColor: "#333",
                    // border: "1px solid #555",
                  }}
                />
                <Legend wrapperStyle={{ color: "#ccc" }} />
                <Line
                  type="monotone"
                  dataKey="Revenue"
                  strokeWidth={2}
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
                <Line type="monotone" dataKey="Net Income" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom sx={{ ml: 2, mt: 1 ,fontFamily:'DM sans',fontWeight:'500',color:'#363636ff' }}>
              Management Tone Over Time
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <LineChart
                data={history}
                margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#b1b1b1ff" />
                <XAxis dataKey="date" tick={{ fill: "#ccc" }} />
                <YAxis domain={[0, 10]} tick={{ fill: "#ccc" }} />
                <Tooltip
                  contentStyle={{
                    // backgroundColor: "#333",
                    // border: "1px solid #555",
                  }}
                  formatter={(value, name) => [value, name]} // ✅ No "M" here
                />

                <Legend wrapperStyle={{ color: "#ccc" }} />
                <Line
                  type="monotone"
                  dataKey="Cautiousness Score"
                  stroke="#ff9800"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      {/* </Grid> */}
      <button className={styles.bu} style={{marginTop:'10px',textAlign:'right'}}
              onClick={() => setModalOpen(true)}
              size="small"
            >
              Explain this Chart
            </button>
      <ExplainChartModal
            handleClose={() => setModalOpen(false)}
            open={modalOpen}
            chartTitle='Revenue & Net Income over time and Management Tone Over Time'
            chartData={history}
            context={context}
       />
    </div>
  );
}


export default HistoricalTrends;
