import React,{useEffect,useState} from 'react';
// import axios from 'axios'
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid,ResponsiveContainer } from 'recharts';
// import { Alert } from '@mui/material';
import {
  Box, Paper, Typography, Accordion, AccordionSummary, AccordionDetails,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,CircularProgress
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


const parseFinancialValue = (valueStr) => {
  if (typeof valueStr !== 'string' || valueStr === 'N/A') return null;
  const isNegative = valueStr.includes('(') && valueStr.includes(')');
  const numberPart = parseFloat(valueStr.replace(/[$,a-zA-Z()]/g, ''));
  if (isNaN(numberPart)) return null;
  return isNegative ? -numberPart : numberPart;
};


const formatDate = (dateString) => new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'short' });

// A reusable component to render a single financial statement table
const StatementTable = ({ title, data ,onRowClick}) => {
  if (!data || data.length === 0) {
    return <Typography sx={{ p: 2 }}>Data for {title} not available in this report.</Typography>;
  }

  return (
    <TableContainer>
      <Table stickyHeader size="small" aria-label={`${title} table`}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#333' }}>Line Item</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold', backgroundColor: '#333' }}>Current Period</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold', backgroundColor: '#333' }}>Previous Period</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index} 
            onClick={()=>onRowClick(row.item,title)}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                {row.item}
              </TableCell>
              <TableCell align="right">{row.current_period}</TableCell>
              <TableCell align="right">{row.previous_period}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

function FinancialStatements({ data ,analysisResult}) {
  const [history,setHistory]=useState([])
  // const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  // const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [chartData, setChartData] = useState([]);
 console.log(analysisResult)
  useEffect(()=>{
    if (analysisResult){
          const history = [];
      // console.log(analysisResult)
      // const fetchHistory=async()=>{
      //   setIsLoadingHistory(true)
      //   try{
      //     const response = await axios.get(`http://localhost:5000/api/history/${filename}`);
      //     setHistory(response.data) 
      //     console.log(history)
      //   }
      //   catch(err){
      //     setError(`Failed to fetch historical data for trend analysis. ${err}`);
      //   }
      //   finally{
      //     setIsLoadingHistory(false)
      //   }
      // }
      // fetchHistory()
     

    if (analysisResult.financial_statements) {
      history.push({
        uploadDate: "Current Report",
        financial_statements: analysisResult.financial_statements,
      });
    }
     if (analysisResult.previous_financial_statements) {
      history.push({
        uploadDate: "Previous Report",
        financial_statements: analysisResult.previous_financial_statements,
      });
    }

    setHistory(history);
    }
  },[analysisResult])
  console.log(history)

  const handleRowClick=(itemName,statementType)=>{
    setSelectedItem(itemName)

const statementKey = statementType.toLowerCase().replace(/\s+/g, '_');
  console.log(statementKey)

    const newChartData=history.map(report=>{
      const statement=report.financial_statements?.[statementKey];
      console.log(statement)
      if (!statement) return null;
      const itemData=statement.find(i=>i.item===itemName)
      console.log(itemData)
      if (!itemData) return null;

      return {
        label:report.uploadDate,
        value:parseFinancialValue(itemData.current_period)
      }
    }).filter(Boolean).reverse();
        setChartData(newChartData);

  }
  console.log(chartData)
  if (!data) {
    return (
      <Paper sx={{ p: 3, backgroundColor: '#2a2a2a' }}>
        <Typography variant="h6" gutterBottom>
          Financial Statements
        </Typography>
        <Typography>
          No financial statement data was extracted from this report.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Deconstructed Financial Statements
      </Typography>
      
      {/* Accordion for Income Statement */}
      <Accordion defaultExpanded sx={{ backgroundColor: '#2a2a2a', mb: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontWeight: 'bold' }}>Income Statement</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <StatementTable title="Income Statement" data={data.income_statement} onRowClick={handleRowClick}/>
        </AccordionDetails>
      </Accordion>

      {/* Accordion for Balance Sheet */}
      <Accordion sx={{ backgroundColor: '#2a2a2a', mb: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontWeight: 'bold' }}>Balance Sheet</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <StatementTable title="Balance Sheet" data={data.balance_sheet} onRowClick={handleRowClick}/>
        </AccordionDetails>
      </Accordion>

      {/* Accordion for Cash Flow Statement */}
      <Accordion sx={{ backgroundColor: '#2a2a2a' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontWeight: 'bold' }}>Cash Flow Statement</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <StatementTable title="Cash Flow Statement" data={data.cash_flow_statement} onRowClick={handleRowClick}/>
        </AccordionDetails>
      </Accordion>

      {selectedItem && (
        <Paper sx={{ p: 2, mt: 4, backgroundColor: '#2a2a2a' }}>
          <Typography variant="h6" gutterBottom sx={{ ml: 2, mt: 1 }}>
            Historical Trend for: {selectedItem}
          </Typography>
          {/* {isLoadingHistory ? <CircularProgress /> : error ? <Alert severity="error">{error}</Alert> : ( */}
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="label" tick={{ fill: '#ccc' }} />
                  <YAxis tick={{ fill: '#ccc' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#333', border: '1px solid #555' }} />
                  <Legend wrapperStyle={{ color: '#ccc' }} />
                  <Line type="monotone" dataKey="value" name={selectedItem} stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          {/* )} */}
        </Paper>
      )}
    </Box>
  );
}

export default FinancialStatements;