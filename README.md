# 🛡️ VEXA — Fraudulent Transaction Detection System

> Real-time UPI fraud detection with Explainable AI, Velocity Freeze, and Live Simulation
>
> **Hackathon Project | Problem Statement: FF-02-S3**

---

## 👥 Team Members

| Name | GitHub |
|------|--------|
| M. Hansika Sri Raj | [@hansikamadhyala-ops](https://github.com/hansikamadhyala-ops) |
| Thota Pravallika | [@thotapravallika16-wq](https://github.com/thotapravallika16-wq) |

> Both members are actively contributing to all parts of the project — frontend, backend, ML, and documentation.

---

## 🚨 The Problem

India processes over **10 billion UPI transactions** every month. Fraudsters exploit this volume to push unauthorized payments through in seconds — often before the user notices. Rule-based systems fail to adapt and flag too many legitimate transactions.

---

## ✅ Our Solution — VEXA

VEXA is a **real-time fraud detection system** that:

- Scores every UPI/IMPS/NEFT transaction the moment it occurs
- Explains **WHY** it is flagged — not just yes/no *(Explainable AI via SHAP)*
- Freezes accounts automatically on **velocity attacks** *(3+ txns in 60 seconds)*
- Lets analysts interact via a **live simulation panel**

---

## 🧠 Magic Features

| Feature | Description |
| :--- | :--- |
| 🔍 Explainable AI | SHAP values explain every fraud decision in plain English |
| ⚡ Velocity Detector | Auto-freeze if 3+ transactions fire within 60 seconds |
| 🎮 Live Simulation | Fire Test Transaction button — real system, not mocked |
| 🇮🇳 India-First Design | Built for UPI/IMPS/NEFT with ₹ thresholds |
| 📊 IEEE-CIS Training Data | Trained on 590,000 real anonymized transactions |

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| Transaction Capture | Java + Spring Boot |
| ML Backend + API | Python 3.11 + FastAPI |
| Explainable AI | SHAP + scikit-learn |
| Class Imbalance | imbalanced-learn (SMOTE) |
| Frontend Dashboard | HTML + CSS + Vanilla JS + Chart.js |
| Database | MySQL 8.0 |
| Analytics | Microsoft Power BI |

---

## 📁 Folder Structure

```
VEXA-FraudDetection/
│
├── frontend/
│   ├── index.html          ← Live analyst dashboard
│   ├── style.css
│   └── app.js
│
├── backend/
│   ├── main.py             ← FastAPI entry point
│   ├── predictor.py        ← ML fraud scoring
│   ├── explainer.py        ← SHAP explanations
│   ├── velocity.py         ← Velocity freeze logic
│   └── requirements.txt
│
├── model/
│   ├── train.py            ← Model training script
│   └── fraud_model.pkl     ← Trained model
│
├── data/
│   └── sample_transactions.csv
│
└── README.md
```

---

## 🚀 How To Run

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend

```bash
# Just open in browser
open frontend/index.html
```

---

## 📊 How It Works

```
UPI Payment Made
       ↓
Java Spring Boot (validates + queues)
       ↓
Python FastAPI + scikit-learn (scores fraud probability)
       ↓
SHAP (generates "Why" explanation)
       ↓
Fraud?  →  Velocity Check  →  Auto Freeze + SMS Alert
Safe?   →  Pass + Log to MySQL
       ↓
HTML Dashboard (live feed) + Power BI (analytics)
```

---

## 📌 Project Status

- [x] Week 1 — Blueprint & Tech Stack
- [ ] Week 2 — Core Logic + UI
- [ ] Week 3 — Full Integration
- [ ] Final — Demo Ready

---

*Built with 🔥 by Team VEXA | Hackathon 2025*
