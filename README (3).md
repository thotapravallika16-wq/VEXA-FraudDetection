<div align="center">

```
██╗   ██╗███████╗██╗  ██╗ █████╗
██║   ██║██╔════╝╚██╗██╔╝██╔══██╗
██║   ██║█████╗   ╚███╔╝ ███████║
╚██╗ ██╔╝██╔══╝   ██╔██╗ ██╔══██║
 ╚████╔╝ ███████╗██╔╝ ██╗██║  ██║
  ╚═══╝  ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝
```

### Fraudulent Transaction Detection System

*Real-time UPI fraud detection · Explainable AI · Velocity Freeze · Live Simulation*

**Hackathon Project · Problem Statement: FF-02-S3**

---

[![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-3.0-000000?style=flat-square&logo=flask&logoColor=white)](https://flask.palletsprojects.com)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-latest-F7931E?style=flat-square&logo=scikit-learn&logoColor=white)](https://scikit-learn.org)
[![Status](https://img.shields.io/badge/Status-Active-22c55e?style=flat-square)]()
[![Week](https://img.shields.io/badge/Week-2%20Complete-7c3aed?style=flat-square)]()

</div>

---

## 👥 Team Members

| Name | GitHub |
|------|--------|
| M. Hansika Sri Raj | [@hansikamadhyala-ops](https://github.com/hansikamadhyala-ops) |
| Thota Pravallika | [@thotapravallika16-wq](https://github.com/thotapravallika16-wq) |

> Both members are actively contributing across frontend, backend, ML, and documentation.

---

## 🚨 The Problem

India processes over **10 billion UPI transactions** every month. Fraudsters exploit this volume to push unauthorized payments through in seconds — often before the user notices. Rule-based systems fail to adapt and flag too many legitimate transactions, causing friction for genuine users while letting sophisticated fraud slip through.

---

## ✅ Our Solution — VEXA

VEXA is a **real-time fraud detection system** that:

- Scores every UPI/IMPS/NEFT transaction the moment it occurs
- Explains **WHY** it was flagged — not just a yes/no verdict *(Explainable AI)*
- Freezes accounts automatically on **velocity attacks** *(3+ transactions in 60 seconds)*
- Lets analysts interact and test via a **live simulation panel**

---

## 🧠 Key Features

| Feature | Description |
|:---|:---|
| 🔍 Explainable AI | Every fraud decision comes with plain-English reasons |
| ⚡ Velocity Detector | Auto-freeze triggers on 3+ transactions within 60 seconds |
| 🎮 Live Simulation | Fire Test Transaction panel — hits the real backend, not mocked data |
| 🇮🇳 India-First Design | Built for UPI/IMPS/NEFT with ₹-based thresholds |
| 📊 ML Scoring | RandomForest model trained on synthetic fraud pattern data |

---

## 🛠️ Tech Stack

| Layer | Technology |
|:---|:---|
| ML Backend + API | Python 3.11 + Flask + Flask-CORS |
| Fraud Scoring | scikit-learn — RandomForestClassifier |
| Explainability | Custom rule-based explainer engine |
| Velocity Detection | In-memory sliding window tracker |
| Frontend Dashboard | HTML5 + CSS3 + Vanilla JavaScript |

---

## 📁 Project Structure

```
VEXA-UI/
│
├── 🌐  Frontend
│   ├── index.html              # Live analyst dashboard
│   ├── style.css               # Dark theme styling
│   └── app.js                  # API calls + live feed updates
│
├── ⚙️  Backend
│   ├── main.py                 # Flask API — entry point
│   ├── predictor.py            # Fraud scoring engine + reasons
│   ├── explainer.py            # Explainability logic
│   └── velocity.py             # Velocity freeze logic
│
├── 🤖  ML
│   ├── train.py                # Model training script
│   └── fraud_model.pkl         # Trained RandomForestClassifier
│
└── 📦  Config
    ├── requirements.txt
    └── sample_transactions.csv
```

---

## 🚀 How To Run

### 1 — Install dependencies

```bash
pip install flask flask-cors scikit-learn pandas numpy imbalanced-learn
```

### 2 — Train the model *(first time only)*

```bash
python train.py
```

Expected output:
```
 VEXA — Model Training
════════════════════════════════════════
[1/4] Creating training data...
[2/4] Splitting data...
[3/4] Training model...
[4/4] Saving fraud_model.pkl...

 fraud_model.pkl saved!
```

### 3 — Start the backend

```bash
python main.py
```

Expected output:
```
✅ VEXA Backend Ready
 * Running on http://127.0.0.1:5000
```

> ⚠️ Keep this terminal open — the backend must stay running while you use the dashboard.

### 4 — Open the dashboard

Open `index.html` in your browser and click **Run Fraud Check →**

---

## 📊 How It Works

```
UPI Payment Initiated
        ↓
Flask API receives transaction details
        ↓
Velocity Check — has this user fired 3+ txns in 60s?
        ↓
predictor.py — scores fraud probability (0.00 – 0.99)
        ↓
explainer.py — generates "Why Flagged" reasons
        ↓
FRAUD (≥0.60) → Flag + Alert     SAFE (<0.35) → Clear + Log
REVIEW (≥0.35) → Hold for manual check
        ↓
Live dashboard updates instantly
```

---

## 🔍 Fraud Scoring Engine

### Signal Weights

| Signal | Condition | Score Added |
|--------|-----------|-------------|
| 💰 High amount | > ₹50,000 | +0.40 |
| 💰 Moderate amount | ₹20,000 – ₹50,000 | +0.10 |
| 🏪 Unknown merchant | Not in registry | +0.30 |
| 📱 New device | First transaction from device | +0.20 |
| 🌙 Night window | 2 AM – 4 AM | +0.20 |

### Verdict Thresholds

```
Score ≥ 0.60  →  🔴 FRAUD   — Block transaction
Score ≥ 0.35  →  🟡 REVIEW  — Flag for manual review
Score < 0.35  →  🟢 SAFE    — Clear instantly
```

---

## ⚡ Velocity Detection

| Metric | Value |
|--------|-------|
| Tracking window | 60 seconds |
| Transaction limit | 3 per window |
| Freeze duration | 5 minutes |
| Action on freeze | Account blocked + OTP alert |

```
Transaction 1  →  ✅ OK  (1/3)
Transaction 2  →  ✅ OK  (2/3)
Transaction 3  →  ⚠️  VELOCITY ATTACK — Account frozen 5 mins
Transaction 4  →  🔴  BLOCKED — Try again in 284s
```

---

## 🌐 API Reference

### `POST /check_fraud`

```json
Request:
{
  "amount":   82500,
  "merchant": "Unknown",
  "device":   "New",
  "time":     "Night",
  "user_id":  "usr_4412"
}

Response:
{
  "result": "FRAUD",
  "score":  0.87,
  "reasons": [
    "High transaction amount — ₹82,500 exceeds ₹50,000 threshold",
    "Unknown merchant — not in RBI verified registry",
    "New device detected — first transaction from this phone",
    "Unusual transaction hour — peak fraud window (2AM–4AM)"
  ]
}
```

### `GET /health`

```json
{ "status": "ok" }
```

---

## 📌 Project Status

- [x] Week 1 — Blueprint & Tech Stack
- [x] Week 2 — Core Logic + UI + Live Dashboard
- [ ] Week 3 — Full Integration + Analytics
- [ ] Final — Demo Ready

---

<div align="center">

</div>
