# PeopleIQ — AI-Powered HR Analytics Dashboard


> Turning workforce data into actionable insights.

---

## Overview

PeopleIQ is a full-stack HR analytics application that helps organizations understand their workforce, identify patterns in employee turnover, and make data-driven decisions. Built with React, Python (Flask), and SQL, it features an AI-powered prediction engine that identifies employees at risk of leaving — before they do.

---

## Features

- **Employee Overview Dashboard** — headcount, department breakdown, tenure analysis
- **Turnover Analytics** — track voluntary and involuntary departures over time
- **AI Churn Prediction** — machine learning model that predicts which employees are at risk
- **Hiring Trends** — visualise recruitment patterns and time-to-fill metrics
- **Department Performance** — compare departments across key HR metrics
- **Export Reports** — download insights as PDF or CSV for management reporting

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Chart.js, Tailwind CSS |
| Backend | Python, Flask, REST API |
| Database | SQLite / SQL Server |
| AI/ML | scikit-learn (Random Forest Classifier) |
| Data | Pandas, NumPy |
| Version Control | Git / GitHub |

---

## Project Structure

```
PeopleIQ/
├── frontend/
│   └── src/
│       ├── components/     # Reusable UI components
│       ├── pages/          # Dashboard pages
│       └── utils/          # Helper functions
├── backend/
│   ├── routes/             # API endpoints
│   ├── models/             # ML models and DB models
│   └── utils/              # Data processing utilities
├── data/
│   └── sample_hr_data.csv  # Sample dataset
└── docs/
    └── README.md
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- Python 3.10+
- pip

### Installation

```bash
# Clone the repository
git clone https://github.com/mowoo-987/PeopleIQ.git
cd PeopleIQ

# Install backend dependencies
cd backend
pip install -r requirements.txt

# Install frontend dependencies
cd ../frontend
npm install

# Run the application
# Terminal 1 - Backend
cd backend && python app.py

# Terminal 2 - Frontend
cd frontend && npm start
```

---

## Screenshots

*Coming soon*

---

## About the Developer

**Myra Owoo**
Business Information Systems Graduate — Saskatchewan Polytechnic
Regina, Saskatchewan

[LinkedIn](https://www.linkedin.com/in/myra-o-4054b6398) | [GitHub](https://github.com/mowoo-987)

---

## License

This project is for portfolio and demonstration purposes.

