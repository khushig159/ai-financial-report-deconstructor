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
  Button
} from "@mui/material";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { Treemap, ResponsiveContainer, Tooltip } from "recharts";
import ExplainChartModal from "./ExplainChartModal";
import DebtSchedule from "./DebtSchedule";
import styles from '../module/metrics.module.css'
const COLORS = {
  Environmental: "#57b45aff", // green
  Social: "#5caef2ff", // blue
  Governance: "#e8bb33ff", // yellow
};

const getCategoryChipColor = (category) => {
  if (!category) return "default";
  const cat = category.toLowerCase();
  if (cat.includes("environmental")) return "success";
  if (cat.includes("social")) return "info";
  if (cat.includes("governance")) return "warning";
  return "default";
};

function EsgAnalysis({ data,context,debt}) {
  const [modalOpen, setModalOpen] = useState(false);

  const mentions = data?.esg_mentions;

  if (!mentions || mentions.length === 0) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{fontFamily:'DM sans'}}>
          ESG (Environmental, Social, and Governance)
        </Typography>
        <Typography sx={{fontFamily:'DM sans'}}>
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
    <div style={{marginLeft:'320px',marginRight:'30px'}}>
      <Typography variant="h6" gutterBottom sx={{ mb: 2,fontFamily:'DM sans',color:'black',fontSize:'25px' }} >
        ESG Mention Analysis
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={5} sx={{width:'95%'}}>
          <Paper sx={{width:'100%', p: 3, height: 400 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" align="center" gutterBottom sx={{fontFamily:'DM sans',marginBottom:'30px'}}>
                ESG Focus Areas by Mention Count
              </Typography>
              <button className={styles.bu}
                startIcon={<HelpOutlineIcon />}
                onClick={() => setModalOpen(true)}
                size="small"
              >
                Explain this Tree Map
              </button>
            </Box>
            <ResponsiveContainer width="100%" height="83%">
              <Treemap
                data={chartData}
                dataKey="size"
                ratio={4 / 3}
                stroke="#fff"
                fill="#d2d0edff"
              >
                <Tooltip
                  contentStyle={{
                    // border: "1px solid #555",
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
              // height: 400,
              overflowY: "auto",
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ p: 1,fontFamily:'DM sans',fontSize:'25px' }}>
              All Identified Statements
            </Typography>
            <List>
              {mentions.map((item, index) => (
                <ListItem key={index} alignItems="flex-start">
                  <ListItemText 
                  primary={
                      <Chip
                        label={item.category}
                        color={getCategoryChipColor(item.category)}
                        size="small"
                        sx={{ mt: 1 ,fontFamily:'DM sans', padding:'10px', marginBottom:'10px'}}
                      />
                    }
                  secondary={item.statement} 
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
      <DebtSchedule data={debt} context={context}/>
    </div>
  );
}

export default EsgAnalysis;
