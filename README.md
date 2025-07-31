AI-Powered Financial Report Deconstructor & Anomaly Detector
(Coming Soon: Link to the live deployed application and an animated GIF of the workflow will be added here.)

The Problem: The Analyst's Bottleneck
Financial analysts at institutions like J.P. Morgan spend thousands of hours manually reading dense, 50+ page quarterly (10-Q) and annual (10-K) reports. This process is time-consuming, prone to human error, and makes it difficult to spot subtle but critical changes between reporting periods. Key data extraction, tone analysis, and risk identification are manual, repetitive tasks that form a significant bottleneck in the financial analysis workflow.

The Solution: An AI-Driven Analytical Co-Pilot
This project is a professional-grade, full-stack web platform designed to solve this exact problem. It empowers an analyst to upload SEC reports and instantly receive a multi-faceted, structured dashboard that provides deep, AI-driven insights. This tool transforms unstructured PDF data into actionable financial intelligence, allowing analysts to focus on high-level strategy instead of low-level data extraction.

Features
AI Co-Pilot & Synthesis
AI-Generated Executive Summary: A "Blink" report that synthesizes all other analyses into a concise, high-level summary, as if an analyst were briefing a portfolio manager.

Anomaly & Red Flag Detection: An AI function that acts as a forensic accountant, scanning the report for anomalies, inconsistencies, or potential red flags (e.g., unusual accounting changes, vague language).

Interactive Data Visualization
Key Metrics Dashboard: Displays core financial data (Revenue, Net Income, EPS) in clean, professional "stat cards."

Bar Chart Analysis: A dynamic bar chart for at-a-glance comparison of Revenue vs. Net Income.

Sentiment Gauge: A radial gauge chart that visually represents the "cautiousness score" of the management's tone.

Historical Trend Analysis: Leverages a persistent MongoDB database to display line charts of key metrics and sentiment scores over time.

Interactive Financials: Allows users to click on line items in the financial statements to see their historical trends charted instantly.

Deep Dive AI Analysis Suite
Financial Statement Deconstruction: An advanced AI module that parses and converts the core financial statements (Income, Balance Sheet, Cash Flow) from the PDF into structured, machine-readable JSON data.

Financial Ratio Analysis: Automatically calculates key financial ratios (e.g., Gross Margin %, Debt-to-Equity) from the deconstructed statements.

Industry Benchmarking: Provides an AI-generated comparison of the company's financial ratios against typical industry averages.

Competitor Intelligence: Scans the report to identify mentions of competing companies and summarizes the strategic context.

Legal Proceedings Summary: Finds and summarizes key lawsuits and government investigations.

Guidance & Outlook: Identifies and classifies forward-looking statements about future performance as Positive, Neutral, or Negative.

Debt & Covenant Deconstruction: Extracts specific details about the company's debt schedule and any associated rules (covenants).

ESG Mention Analysis: Finds and summarizes the company's statements on Environmental, Social, and Governance (ESG) topics.

Interactive Footnote Explorer: Creates a summarized, clickable index of the dense "Notes to Consolidated Financial Statements" section.

Professional UI/UX
A sleek, dark-themed dashboard built with React and MUI, designed with a "Bloomberg Terminal" aesthetic.

A responsive side-by-side Diff Viewer that highlights word-level changes in the "Risk Factors" section between two reports.

Tech Stack & Architecture
This project is built with a modern, scalable microservice architecture.

Frontend: React (with Vite), MUI, Recharts, Zustand, Axios, React-Dropzone, React-Diff-Viewer.

Backend Gateway: A Node.js server using Express.js that manages client traffic, orchestrates the analysis workflow, and handles all database interactions with Mongoose.

AI / Parsing Service: A high-performance Python microservice built with FastAPI. Its responsibilities are robust PDF text extraction using PyMuPDF and performing all AI-driven analysis.

Database: MongoDB Atlas is used as a scalable, cloud-based NoSQL database.

AI Engine: Powered by Google Gemini Pro.

System Workflow
[User's Browser (React Frontend)]
       |
       | 1. Uploads two PDF files
       v
[Node.js API Gateway (Express)]
       |
       | 2. Receives files, sends them one-by-one to Python
       v
[Python AI/Parsing Service (FastAPI)]  <-- (Calls Google Gemini API)
       |
       | 3. Parses PDF, runs AI analysis, returns structured JSON
       v
[Node.js API Gateway (Express)]
       |
       | 4. Receives JSON, saves it to MongoDB
       v
[MongoDB Atlas (Database)]
       |
       | 5. Node.js sends the final JSON back to the frontend
       v
[User's Browser (React Frontend)]
       |
       | 6. Displays the data in the dashboard
       v
[Analyst Makes Informed Decision]

Getting Started
To run this project locally, you will need Node.js, Python, and a MongoDB Atlas account.

Prerequisites:
Node.js (v18 or later)

Python (v3.9 or later)

A free MongoDB Atlas account and connection string.

A Google AI Studio API key for the Gemini API.

Installation & Setup:
Clone the repository:

git clone https://github.com/YourUsername/ai-financial-report-deconstructor.git
cd ai-financial-report-deconstructor

Setup the Python AI Service:

cd backend/ai-service-python
python -m venv venv
# On Windows: venv\Scripts\activate
# On Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
# Create a .env file and add your GOOGLE_API_KEY

Setup the Node.js API Gateway:

cd ../api-gateway-node
npm install
# Create a .env file and add your PORT, MONGO_URI, and PYTHON_SERVICE_URL

Setup the React Frontend:

cd ../../frontend
npm install

Running the Application:
You will need to have three separate terminals open.

Run the Python Service:

# In backend/ai-service-python
uvicorn main:app --reload

Run the Node.js Service:

# In backend/api-gateway-node
node server.js

Run the React Frontend:

# In frontend
npm run dev

Open your browser to http://localhost:5173 (or whatever port the React server indicates).