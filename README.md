# AI Job Application Tracker

An **end-to-end AI-powered system** that automates job application tracking by extracting structured job data directly from postings and organizing it in a searchable dashboard.

Designed to demonstrate **LLM integration, browser automation, and full-stack system design**.

---

## Why This Project

Manually copying job details into trackers is repetitive and error-prone.  
This project removes that friction by using an **LLM to convert unstructured job postings into structured, persistent data** — in one click.

---

## Key Capabilities

- **LLM-powered information extraction**
  - Converts raw job posting content into structured JSON
  - Extracts company name, role, and full job description
- **Chrome Extension Automation**
  - One-click job capture from any job posting
  - Extracts visible page content directly from the browser
- **Robust Backend Processing**
  - Flask API validates and sanitizes LLM responses
  - Handles malformed or partial outputs gracefully
- **Persistent Job Tracking**
  - Stores applications in Firebase Firestore
  - Supports status tracking (Applied / Interviewing / Rejected)
- **Searchable React Dashboard**
  - Filter by company or role
  - Expand rows to view full job descriptions
  - Real-time UI updates

---

