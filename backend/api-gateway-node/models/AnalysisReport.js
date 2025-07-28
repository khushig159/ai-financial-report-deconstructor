const mongoose = require('mongoose');

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
});

module.exports = mongoose.model('AnalysisReport', AnalysisReportSchema);