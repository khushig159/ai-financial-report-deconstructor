import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Grid,
} from "@mui/material";
import { Treemap, ResponsiveContainer, Tooltip } from "recharts";
import ExplainChartModal from "./ExplainChartModal";
// Helper to get a color for each ESG category
const COLORS = {
  Environmental: "#4caf50", // green
  Social: "#2196f3", // blue
  Governance: "#ffc107", // yellow
};

const getCategoryChipColor = (category) => {
  if (!category) return "default";
  const cat = category.toLowerCase();
  if (cat.includes("environmental")) return "success";
  if (cat.includes("social")) return "info";
  if (cat.includes("governance")) return "warning";
  return "default";
};

function EsgAnalysis({ data }) {
  const [modalOpen, setModalOpen] = useState(false);

  const mentions = data?.esg_mentions;

  if (!mentions || mentions.length === 0) {
    return (
      <Paper sx={{ p: 3, backgroundColor: "#2a2a2a" }}>
        <Typography variant="h6" gutterBottom>
          ESG (Environmental, Social, and Governance)
        </Typography>
        <Typography>
          No specific ESG-related statements were identified in this report.
        </Typography>
      </Paper>
    );
  }

  // Calculate the category counts for the Treemap
  const categoryCounts = mentions.reduce((acc, item) => {
    const category = item.category || "Uncategorized";
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.keys(categoryCounts).map((key) => ({
    name: key,
    size: categoryCounts[key],
    fill: COLORS[key] || "#8884d8",
  }));

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        ESG Mention Analysis
      </Typography>
      <Grid container spacing={4}>
        {/* Treemap Chart Section */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 2, backgroundColor: "#2a2a2a", height: 400 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" align="center" gutterBottom>
                ESG Focus Areas by Mention Count
              </Typography>
              <Button
                startIcon={<HelpOutlineIcon />}
                onClick={() => setModalOpen(true)}
                size="small"
              >
                Explain this Tree Map
              </Button>
            </Box>
            <ResponsiveContainer width="100%" height="90%">
              <Treemap
                data={chartData}
                dataKey="size"
                ratio={4 / 3}
                stroke="#fff"
                fill="#8884d8"
              >
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#333",
                    border: "1px solid #555",
                  }}
                  labelStyle={{ color: "#fff" }}
                />
              </Treemap>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Statement List Section */}
        <Grid item xs={12} md={7}>
          <Paper
            sx={{
              p: 2,
              backgroundColor: "#2a2a2a",
              height: 400,
              overflowY: "auto",
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ p: 1 }}>
              All Identified Statements
            </Typography>
            <List>
              {mentions.map((item, index) => (
                <ListItem key={index} alignItems="flex-start">
                  <ListItemText
                    primary={item.statement}
                    secondary={
                      <Chip
                        label={item.category}
                        color={getCategoryChipColor(item.category)}
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
      <ExplainChartModal
        open={modalOpen}
        handleClose={() => setModalOpen(false)}
        chartTitle="ESG Focus Areas by Mention Count"
        chartData={chartData}
        context={JSON.stringify(data)}
      />
    </Box>
  );
}

export default EsgAnalysis;
