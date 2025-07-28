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

Tech Stack & Architecture
This project is built with a modern, scalable microservice architecture, separating the web-facing API from the heavy-duty AI processing.

The Frontend is built with React (using Vite for a fast development environment) and MUI for a professional, data-dense user interface. State management is handled by Zustand, with Axios for API calls, React-Dropzone for file uploads, and React-Diff-Viewer for the comparison view.

The Backend Gateway is a Node.js server using the Express.js framework. It manages all client-facing traffic, orchestrates the analysis workflow, and handles all database interactions with Mongoose.

The dedicated AI / Parsing Service is a high-performance Python microservice built with FastAPI. Its sole responsibilities are robust PDF text extraction using PyMuPDF and performing all AI-driven analysis.

For the Database, the application uses MongoDB Atlas, a scalable, cloud-based NoSQL database, to store all final analysis results for historical tracking and retrieval.

The AI Engine is powered by Google Gemini Pro, which is leveraged for all complex natural language processing tasks, including KPI extraction, linguistic tone analysis, and risk summarization.