const mongoose = require('mongoose');

// This schema defines the structure for every analysis report we save in the database.
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
    top_risks: [String],
  },
  raw_risk_factors: { type: String },
  raw_management_discussion: { type: String },
});

// Export the model so other parts of our application can use it
module.exports = mongoose.model('AnalysisReport', AnalysisReportSchema);
