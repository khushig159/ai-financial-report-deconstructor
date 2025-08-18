#  AI-Powered Financial Report Deconstructor & Analytical Co-Pilot

##  TL;DR – Why This Project Stands Out
- **AI-Powered Financial Analyst Co-Pilot** → Automates deep analysis of 10-K/10-Q filings, saving analysts hours of manual review.  
- **Interactive Dashboard + PDF Export** → Rich visualizations (graphs, ratios, trends) with one-click export to professional-grade reports.  
- **Differential Analysis Engine** → Compares current vs. previous filings (or cross-company) to surface meaningful changes instantly.  
- **Enterprise-Ready Foundation** → Secure Firebase auth, scalable Node + FastAPI backend, MongoDB persistence — designed with institutional use in mind.  

---

##  The Problem: The Analyst’s Bottleneck
Financial analysts at institutions like **J.P. Morgan** spend thousands of hours manually combing through 50+ page quarterly (10-Q) and annual (10-K) reports.  
This workflow is:  
-  Time-consuming  
-  Prone to human error  
-  Makes it difficult to catch subtle but critical changes between reporting periods  

Key data extraction, ratio calculations, risk identification, and tone analysis are **manual repetitive tasks** that slow down the entire financial decision-making process.

---

##  The Solution: An AI-Driven Analytical Co-Pilot
This project is a **professional-grade, full-stack web platform** that solves this bottleneck.  
It transforms **unstructured PDF data into structured, actionable insights** in minutes, freeing analysts to focus on strategy instead of low-level report parsing.  

---

##  User Workflow  

1. **Authentication** → Secure login/signup with Email/Password or Google   
2. **Upload** → Choose one of two modes:  
   - **Single Report Upload** → Upload a company’s latest 10-K/10-Q.  
   - **Dual Report Upload** → Upload two reports (same company or competitors) for **side-by-side diff analysis**.  
   - If you upload only one report but uploaded others before → system automatically finds the last report for historical comparison.  
3. **Processing** → AI engine parses PDFs, extracts structured data, and runs analysis.  
4. **Interactive Dashboard** → Get a clean, multi-tab interface with **metrics, visualizations, AI insights, and comparisons**.  
5. **Export** → Download a **professionally formatted PDF report** with executive summary, financials, and risks.

**Note** -> Demo Video has been provided in file named Finacial_Analyzer.mp4


---

##  Key Features  

###  Core Analysis  
- **Executive Summary & Key Takeaways** → AI-generated “blink report” for quick digestion.  
- **Keyword & Change Detection** → Highlights **word-level differences** between current and previous reports.  
- **Financial Statements Parser** → Income Statement, Balance Sheet, and Cash Flow are deconstructed into structured, clickable tables.  

###  Visualization Everywhere  
- **Metrics Dashboard** → Stat cards for Revenue, Net Income, EPS, Gross Margin, Debt Ratio, etc.  
- **Bar & Line Charts** → Revenue vs Net Income bar chart; Historical trends for any metric.  
- **Interactive Statements** → Click a line item to instantly see its historical trend chart.  
- **Explain This Chart** → Every visualization has an **AI text explanation** that interprets the chart.  

###  Deep Insights  
- **Management Tone Analysis** → Sentiment + cautiousness score of earnings call language.  
- **Risk & Red Flags** → Automated detection of unusual accounting shifts, vague wording, or anomalies.  
- **Strategic & Legal Overview** → Competitors mentioned, governance changes, lawsuits & investigations.  
- **Guidance & Outlook** → Identifies forward-looking statements and classifies as Positive / Neutral / Negative.  
- **Debt Explorer** → Full debt schedule with principal due by year.  
- **Footnote Explorer** → Summarized, searchable view of dense accounting notes.  
- **Sustainability (ESG)** → Extraction & summarization of Environmental, Social, and Governance mentions.  

###  Export & Reporting  
- **PDF Export** → Clean, text-based, structured PDF with all sections.  
- **Smart History** → Every report uploaded is stored in MongoDB and linked to a ticker. Enables auto-comparison with past filings.  

---

## 🛠️ Tech Stack  

**Frontend** → React (Vite) · MUI · Recharts · Zustand · Axios · React-Dropzone · React-Diff-Viewer  
**Backend Gateway** → Node.js · Express · Mongoose  
**AI Service** → Python · FastAPI · PyMuPDF · Google Gemini Pro  
**Auth** → Firebase Authentication (Email/Password + Google SSO)  
**Database** → MongoDB Atlas (NoSQL, cloud-based)  

##  Future Enhancements

- Advanced Time-Series Modeling → Predictive analytics on financial metrics using ML models.
-  Multi-Company Peer Benchmarking → Compare any company’s results vs. sector/industry peers.
-   Advanced Risk NLP → Detect hidden legal/operational risks using fine-tuned LLMs.
-   Analyst Collaboration Tools → Shared dashboards, annotations, and team discussions.
-   Scenario Simulation → “What if” stress testing on financials under macroeconomic changes.
-   Global Filing Support → Extend parsing for non-SEC filings (India MCA, EU ESMA, etc.).
-  Smart Alerts → Automated notifications when new filings are released or anomalies detected.
-   Mobile Dashboard → Lightweight version for analysts on the go.
-   Personalised ChatBot -> Based on the contents of the provided 10K/10Q report, system instructions can be give to the ai agent so that it can solve any query of the user related to the report

*NOTE* -> This website is not responsive yet, future enhancements yet to be done, BUT it is fully functional so you can use it without any hesitation 


---

##  Getting Started  

### Prerequisites  
- Node.js (v18+)  
- Python (v3.9+)  
- Firebase Project (Authentication enabled)  
- MongoDB Atlas account  
- Google AI Studio API key  

### Installation  

```bash
# 1. Clone repo
git clone <repo-url>

# 2. Python AI Service
cd backend/ai-service-python
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
echo "GOOGLE_API_KEY=your_api_key" > .env
uvicorn main:app --reload

# 3. Node.js API Gateway
cd ../api-gateway-node
npm install
echo "PORT=5000
MONGO_URI=your_mongo_uri
PYTHON_SERVICE_URL=http://localhost:8000
GOOGLE_API_KEY=your_api_key" > .env
node server.js

# 4. React Frontend
cd ../../frontend
npm install
echo "VITE_API_GATEWAY_URL=http://localhost:5000" > .env
npm run dev


##  System Architecture  

[User's Browser (React Frontend)]
|
|---> Login / Signup (Firebase Auth)
|---> Upload SEC PDF(s)
v
[Node.js API Gateway (Express)]
|---> Validates Auth
|---> Sends PDFs to Python AI Service
v
[Python AI/Parsing Service (FastAPI)]
|---> Extracts raw text (PyMuPDF)
|---> Calls Google Gemini for AI Analysis
|---> Returns structured JSON
v
[Node.js API Gateway]
|---> Stores in MongoDB Atlas
|---> Sends JSON to frontend
v
[React Frontend Dashboard]
|---> Visualizations + Explanations
|---> Export to PDF



