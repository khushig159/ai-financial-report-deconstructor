import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Button
} from "@mui/material";
import styles from '../module/metrics.module.css'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import GavelIcon from "@mui/icons-material/Gavel";
import ExplainChartModal from "./ExplainChartModal";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';


const parseDebtValue = (value) => {
  if (value === null || value === undefined) return 0;

  if (typeof value === "number") return value;

  if (typeof value === "string") {
    const numberPart = parseFloat(value.replace(/[$,a-zA-Z]/g, ""));
    return isNaN(numberPart) ? 0 : numberPart;
  }

  return 0;
};

function DebtSchedule({ data, context }) {
  const [modalOpen, setModalOpen] = useState(false);
  const schedule = data?.debt_schedule;
  const covenants = data?.covenants;
  console.log(schedule);

  const hasSchedule = schedule && schedule.length > 0;
  const hasCovenants = covenants && covenants.length > 0;
  console.log(hasSchedule)

  if (!hasSchedule && !hasCovenants) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Debt & Covenants
        </Typography>
        <Typography>
          No specific debt schedule or covenant information was extracted from
          this report.
        </Typography>
      </Paper>
    );
  }
  const chartData = hasSchedule
    ? schedule
        .filter((item) => item.principal_due !== null)
        .map((item) => ({
          name: item.year,
          "Principal Due (in Millions)": parseDebtValue(item.principal_due),
        }))
    : [];
  console.log(chartData);

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Debt & Covenant Deconstruction
      </Typography>

      {hasSchedule && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
      <Typography variant="h6" sx={{fontFamily:'DM sans',fontSize:'25px',marginBottom:'30px'}}>
              Debt Maturity Schedule
            </Typography>
            <button className={styles.bu}
              startIcon={<HelpOutlineIcon />}
              onClick={() => setModalOpen(true)}
              size="small"
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
                <CartesianGrid strokeDasharray="3 3" stroke="#b4b0b0ff" />
                <XAxis dataKey="name" tick={{ fill: "#646161ff" }} />
                <YAxis tick={{ fill: "#6d6d6dff" }} />
                <Tooltip
                  contentStyle={{
                    // backgroundColor: "#333",
                    // border: "1px solid #555",
                  }}
                  labelStyle={{ color: "#fff" }}
                />
                {/* <Legend wrapperStyle={{ color: "#ccc" }} /> */}
                <Bar dataKey="Principal Due (in Millions)" fill="#ec382bff" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      )}

      {hasCovenants && (
        <Paper sx={{ p: 2}}>
      <Typography variant="h6" sx={{fontFamily:'DM sans',fontSize:'25px'}}>
            Identified Debt Covenants
          </Typography>
          <List>
            {covenants.map((item, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <GavelIcon color="warning" />
                </ListItemIcon>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
      <ExplainChartModal
        open={modalOpen}
        handleClose={() => setModalOpen(false)}
        chartTitle="Debt Maturity Schedule"
        chartData={chartData}
        context={context}
      />
    </Box>
  );
}

export default DebtSchedule;
