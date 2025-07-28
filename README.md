AI-Powered Financial Report Deconstructor & Anomaly Detector
The Problem: The Analyst's Bottleneck
Financial analysts at institutions like J.P. Morgan spend thousands of hours manually reading dense, 50+ page quarterly (10-Q) and annual (10-K) reports. This process is time-consuming, prone to human error, and makes it difficult to spot subtle but critical changes between reporting periods. Key data extraction is a manual copy-paste task, and identifying shifts in management tone or emerging risks requires a level of meticulous, repetitive reading that is a significant bottleneck in the financial analysis workflow.

The Solution: Automated Financial Intelligence
This project is a professional-grade, full-stack web platform designed to solve this exact problem. It empowers an analyst to upload two SEC reports (a current and a previous one) and instantly receive a structured, deconstructed dashboard.

The application automates the most painful parts of the analyst's job by using a sophisticated backend to:

Parse complex PDF documents to extract raw text.

Analyze the text with targeted AI calls to extract key financial metrics (KPIs), assess the linguistic tone of management's discussion, and summarize the most significant risks.

Compare the "Risk Factors" sections between the two periods to instantly flag new, removed, or altered risks.

The result is a high-value analytical tool that transforms unstructured, dense reports into actionable financial intelligence, allowing analysts to focus on high-level strategy instead of low-level data extraction.

Live Demo & Features
(Coming Soon: Link to the live deployed application and an animated GIF of the workflow will be added here after deployment.)

Dual PDF Upload: A clean, drag-and-drop interface for uploading the current and previous financial reports.

Automated Parsing: A robust backend parser that intelligently identifies and extracts the "Risk Factors" and "Management's Discussion & Analysis" sections from any standard 10-K or 10-Q file.

AI-Powered KPI Extraction: Automatically finds and displays key metrics like Total Revenue, Net Income, and EPS from the report.

Linguistic Tone Analysis: Provides a qualitative summary and a quantitative "cautiousness score" (1-10) based on the language used in the MD&A section.

Risk & Anomaly Flagging: Summarizes the top 3 most significant risks identified in the current report.

Side-by-Side Diff Viewer: A professional, color-coded comparison of the "Risk Factors" sections from both reports, visually highlighting additions and deletions to instantly spot changes.

Professional Dark-Themed UI: A dashboard designed with a "Bloomberg Terminal" aesthetic, built for serious financial analysis.

Tech Stack & Architecture
This project is built with a modern, scalable microservice architecture, separating the web-facing API from the heavy-duty AI processing.

Frontend: Built with React (using Vite) and MUI for a professional UI. State management is handled by Zustand, with Axios for API calls, React-Dropzone for file uploads, and React-Diff-Viewer for the comparison view.

Backend Gateway: A Node.js server using Express.js that manages all client-facing traffic, orchestrates the analysis workflow, and handles all database interactions with Mongoose.

AI / Parsing Service: A high-performance Python microservice built with FastAPI. Its responsibilities are robust PDF text extraction using PyMuPDF and performing all AI-driven analysis.

Database: MongoDB Atlas is used as a scalable, cloud-based NoSQL database to store all final analysis results.

AI Engine: Powered by Google Gemini Pro, which is leveraged for all complex natural language processing tasks.

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