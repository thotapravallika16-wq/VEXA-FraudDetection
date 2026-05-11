VEXA — Fraudulent Transaction Detection System

Real-time UPI fraud detection with Explainable AI, Velocity Freeze, and Live Simulation
Hackathon Project | Problem Statement: FF-02-S3


TEAM MEMBERS:
      Name                             GitHub
M.HANSIKA SRI RAJ                   hansikamadhyala-ops
THOTA PRAVALLIKA                    thotapravallika16-wq
(Both members are actively contributing to all parts of the project — frontend, backend, ML, and documentation.)

The Problem:
India processes over 10 billion UPI transactions every month. Fraudsters exploit this volume to push unauthorized payments through in seconds — often before the user notices. Rule-based systems fail to adapt and flag too many legitimate transactions.

OUR SOLUTION — VEXA:
VEXA is a real-time fraud detection system that:

Scores every UPI/IMPS/NEFT transaction the moment it occurs
Explains WHY it's flagged — not just yes/no (Explainable AI via SHAP)
Freezes accounts automatically on velocity attacks (3+ txns in 60 seconds)
Lets analysts interact via a live simulation panel


MAGIC FEATURES:
FeatureDescription
Explainable AISHAP values explain every fraud decision in plain English
Velocity DetectorAuto-freeze if 3+ transactions fire within 60 seconds
Live Simulation"Fire Test Transaction" button — real system, not mocked🇮🇳 India-First DesignBuilt for UPI/IMPS/NEFT with ₹ thresholds IEEE-CIS Training DataTrained on 590,000 real anonymized transactions

TECH STACK:
LayerTechnologyTransaction CaptureJava + Spring BootML Backend + APIPython 3.11 + FastAPIExplainable AISHAP + scikit-learnClass Imbalanceimbalanced-learn (SMOTE)Frontend DashboardHTML + CSS + Vanilla JS + Chart.jsDatabaseMySQL 8.0AnalyticsMicrosoft Power BI

FOLDER STRUCTURE:
VEXA-FraudDetection/
├── frontend/
│   ├── index.html          ← Live analyst dashboard
│   ├── style.css
│   └── app.js
├── backend/
│   ├── main.py             ← FastAPI entry point
│   ├── predictor.py        ← ML fraud scoring
│   ├── explainer.py        ← SHAP explanations
│   ├── velocity.py         ← Velocity freeze logic
│   └── requirements.txt
├── model/
│   ├── train.py            ← Model training script
│   └── fraud_model.pkl     ← Trained model
├── data/
│   └── sample_transactions.csv
└── README.md

HOW TO RUN:
Backend
bashcd backend
pip install -r requirements.txt
uvicorn main:app --reload
Frontend
bash# Just open in browser
open frontend/index.html

HOW IT WORKS:
UPI Payment Made
      ↓
Java Spring Boot (validates + queues)
      ↓
Python FastAPI + scikit-learn (scores fraud probability)
      ↓
SHAP (generates "Why" explanation)
      ↓
Fraud? → Velocity Check → Auto Freeze + SMS Alert
Safe?  → Pass + Log to MySQL
      ↓
HTML Dashboard (live feed) + Power BI (analytics)

 PROJECT STATUS:
 Week 1 — Blueprint & Tech Stack ✅ 
 Week 2 — Core Logic + UI
 Week 3 — Full Integration
 Final — Demo Ready
