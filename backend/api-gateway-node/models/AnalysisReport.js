const mongoose = require('mongoose');

const StatementItemSchema=new mongoose.Schema({
  item:String,
  current_period:String,
  previous_period:String,
})

const AnalysisReportSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
  key_metrics: {
    revenue: String,
    netIncome: String,
    eps: String,
  },
  management_tone: {
    summary: String,
    cautiousness_score: Number,
  },
  risk_summary: {
    top_risks: [String]
  },
  // --- THE CRITICAL FIX IS HERE ---
  // It is now correctly defined to accept an object containing an array of strings.
  risk_comparison: {
    comparison_summary: [String]
  },
  raw_risk_factors: { type: String },
  previous_raw_risk_factors: { type: String },
  raw_management_discussion: { type: String },
  competitor_analysis: {
    competitors: [{
      name: String,
      context: String,
    }]
  },
  guidance_analysis: {
    guidance: [{
      statement: String,
      sentiment: String,
    }]
  },
  legal_summary: { legal_summary: [String] },
  financial_statements:{
    income_statement:[StatementItemSchema],
    balance_sheet:[StatementItemSchema],
    cash_flow_statement:[StatementItemSchema]
  }
});

module.exports = mongoose.model('AnalysisReport', AnalysisReportSchema);