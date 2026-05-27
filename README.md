<div align="center">

<pre>
██╗   ██╗███████╗██╗  ██╗ █████╗
██║   ██║██╔════╝╚██╗██╔╝██╔══██╗
██║   ██║█████╗   ╚███╔╝ ███████║
╚██╗ ██╔╝██╔══╝   ██╔██╗ ██╔══██║
 ╚████╔╝ ███████╗██╔╝ ██╗██║  ██║
  ╚═══╝  ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝
</pre>

### Fraudulent Transaction Detection System

*Real-time UPI fraud detection · Explainable AI · Velocity Freeze · Trusted Registry*

**Hackathon Project · Problem Statement: FF-02-S3 · Team VEXA**

---

[![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-4.0-000000?style=flat-square&logo=flask&logoColor=white)](https://flask.palletsprojects.com)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-latest-F7931E?style=flat-square&logo=scikit-learn&logoColor=white)](https://scikit-learn.org)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-22c55e?style=flat-square)]()
[![SDG](https://img.shields.io/badge/UN%20SDG-16%20%7C%208%20%7C%2011-blue?style=flat-square)]()
[![Week](https://img.shields.io/badge/Week%204-Complete-7c3aed?style=flat-square)]()

</div>

---

## 🌍 Product Overview & UN SDG Global Impact

VEXA is a **real-time fraud detection system** built specifically for Indian digital payments (UPI, IMPS, NEFT). Every incoming transaction is scored the moment it occurs using a blend of ML and rule-based logic, explained using AI-generated insights, and monitored for velocity attacks — with a live analyst dashboard for simulation and full control.

**UN SDG Alignment:**

| Goal | How VEXA Contributes |
|:---|:---|
| ⚖️ **SDG 16** — Peace, Justice & Strong Institutions | Supports RBI compliance, audit trails, and transparent fraud decisions with explainable AI |
| 💼 **SDG 8** — Decent Work & Economic Growth | Protects individuals and businesses from financial fraud, preserving economic stability across India |
| 🏙️ **SDG 11** — Sustainable Cities | Enables safe digital payment infrastructure for both urban and rural UPI users |

---

## 👥 Team Members

| Name | GitHub |
|------|--------|
| M. Hansika Sri Raj | [@hansikamadhyala-ops](https://github.com/hansikamadhyala-ops) |
| Thota Pravallika | [@thotapravallika16-wq](https://github.com/thotapravallika16-wq) |

> Both members actively contributed across frontend, backend, ML, and documentation across all 4 weeks.

---

## 🚨 The Problem

India processes over **10 billion UPI transactions** every month. Fraudsters exploit this volume to push unauthorized payments through in seconds — often before the user notices. Rule-based systems fail to adapt and generate too many false positives, causing friction for genuine users while letting sophisticated fraud slip through.

**VEXA solves this with three layers of defence** — ML scoring, velocity detection, and a trusted merchant registry — all explained in plain English, in real time.

---

## 🧠 Key Features

| Feature | Description |
|:---|:---|
| 🔍 **Explainable AI** | Every fraud decision comes with plain-English reasons and risk factor weights — not just a score |
| ⚡ **Velocity Detector** | Auto-freeze triggers on 3+ transactions from the same user within 60 seconds |
| ⭐ **Trusted Registry** | Analyst-managed merchant list — auto-clears verified merchants instantly with score 0.0 |
| 🎮 **Live Simulation** | Fraud Detection Console — hits the real Flask backend, not mocked data |
| 🇮🇳 **India-First Design** | Built for UPI/IMPS/NEFT with ₹-based thresholds and RBI-aware merchant categories |
| 📊 **ML + Rules Blend** | RandomForest model combined with rule-based scoring — best of both worlds |

---

## 🛠️ Tech Stack

| Layer | Technology |
|:---|:---|
| ML Backend + API | Python 3.11 + Flask + Flask-CORS |
| Fraud Scoring | scikit-learn RandomForestClassifier + MERCHANT_RISK rules |
| Explainability | AI-powered explainer with rule-based fallback |
| Velocity Detection | In-memory sliding window tracker (60 seconds) |
| Trusted Registry | JSON-backed analyst-managed merchant store |
| Frontend Dashboard | HTML5 + CSS3 + Vanilla JavaScript |

---

## 📁 Project Structure

```
VEXA-FraudDetection/
│
├── frontend/
│   ├── index.html              # Fraud Detection Console UI
│   ├── style.css               # Dark fintech theme
│   └── app.js                  # API calls + live updates
│
├── backend/
│   ├── main.py                 # Flask API — entry point
│   ├── predictor.py            # ML + rules fraud scoring engine
│   ├── explainer.py            # AI-powered explainability
│   ├── velocity.py             # Velocity attack detector
│   ├── trusted.py              # Trusted merchant registry
│   ├── trusted_store.json      # Persisted trusted merchants
│   └── requirements.txt        # All dependencies
│
├── model/
│   └── train.py                # Model training script
│
├── data/
│   └── sample_transactions.csv
│
├── docs/
│   ├── VEXA_W1_C1.docx         # Blueprint
│   ├── VEXA_W1_C2.docx         # Tech stack justification
│   ├── VEXA_W3_C2.pdf          # UN SDG mapping
│   ├── VEXA_W3_C4.pdf          # Optimization report
│   └── VEXA_W4_C3.pdf          # SDLC lifecycle mapping
│
├── assets/
│   ├── dashboard.png           # Console overview
│   ├── fraud_detection.png     # Fraud result + explainability
│   ├── review_detection.png    # Review result
│   ├── trusted_registry.png    # Trusted auto-clear
│   └── VEXA_W4_C2.png          # Shark Tank poster
│
├── README.md
└── .gitignore
```

---

## 🚀 How To Run

### Step 1 — Install dependencies

```bash
pip install -r backend/requirements.txt
```

### Step 2 — Train the model *(first time only)*

```bash
python model/train.py
```

Expected output:
```
 VEXA — Model Training
════════════════════════════════════════
[1/4] Creating training data...
      Total  : 500 transactions
      Fraud  : 187  |  Safe : 313
[2/4] Splitting data...
[3/4] Training model... Done!
[4/4] Saving fraud_model.pkl...
 fraud_model.pkl saved!
```

### Step 3 — Start the backend

```bash
python backend/main.py
```

Expected output:
```
✅ VEXA Backend Ready
 * Running on http://127.0.0.1:5000
```

> ⚠️ Keep this terminal open — the backend must stay running while using the dashboard.

### Step 4 — Open the dashboard

Double-click `frontend/index.html` in your file explorer — it opens directly in your browser.

Click **Run Fraud Check →** to start testing live transactions.

---

## 🏗️ Visual Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        VEXA System                           │
│                                                              │
│   Browser — Fraud Detection Console (index.html)            │
│                      │                                       │
│                       POST /check_fraud                      │
│                      ▼                                       │
│          Flask API — backend/main.py (:5000)                │
│                      │                                       │
│         ┌────────────┼────────────────┐                     │
│         ▼            ▼                ▼                     │
│     trusted.py   velocity.py     predictor.py               │
│     (registry)   (rate limit)    (ML + rules)               │
│                                       │                     │
│                                  explainer.py               │
│                                  (AI reasons)               │
│                                       │                     │
│         ┌─────────────────────────────┘                     │
│         ▼                                                    │
│   FRAUD · REVIEW · SAFE · TRUSTED · BLOCKED                 │
│         │                                                    │
│         ▼                                                    │
│   Console updates live — alert fires if FRAUD               │
└──────────────────────────────────────────────────────────────┘
```

---

## 📊 How It Works

### Fraud Scoring Engine

| Signal | Condition | Score Added |
|--------|-----------|-------------|
| 💰 High amount | > ₹50,000 | +0.40 |
| 💰 Moderate amount | ₹20,000 – ₹50,000 | +0.25 |
| 🏪 High-risk merchant | Crypto, Unknown, Wire Transfer | +0.30 – 0.36 |
| 📱 Unknown device | Unregistered / new device | +0.10 |
| 🌙 Night window | Hour 0 – 4 AM | +0.15 |
| ⭐ Trusted merchant | In analyst registry | Score × 0.30 |

### Verdict Thresholds

```
Score ≥ 0.60  →  🔴 FRAUD    — Block + alert analyst immediately
Score ≥ 0.35  →  🟡 REVIEW   — Flag for manual review
Score < 0.35  →  🟢 SAFE     — Clear instantly
Trusted hit   →  ⭐ TRUSTED  — Auto-cleared, score = 0.00
Velocity hit  →  🔴 BLOCKED  — Account frozen for 5 minutes
```

### Velocity Detection

| Metric | Value |
|--------|-------|
| Tracking window | 60 seconds |
| Transaction limit | 3 per window |
| Freeze duration | 5 minutes |
| Action on freeze | Account blocked + OTP alert |

---

## 🌐 API Reference

| Endpoint | Method | Description |
|:---|:---|:---|
| `/check_fraud` | POST | Score a transaction |
| `/mark_trusted` | POST | Add merchant to trusted registry |
| `/remove_trusted` | POST | Remove merchant from trusted registry |
| `/trusted_list` | GET | List all trusted merchants |
| `/health` | GET | Check API status |

**Example Request:**

```json
POST /check_fraud
{
  "amount":   500000,
  "merchant": "Crypto Exchange",
  "device":   "known",
  "hour":     12,
  "user_id":  "user_001"
}
```

**Example Response:**

```json
{
  "result":  "FRAUD",
  "score":   0.76,
  "trusted": false,
  "reasons": [
    "High amount ₹5,00,000 exceeds ₹50,000 threshold",
    "Crypto Exchange is a high-risk merchant category"
  ]
}
```

---

## 🖼️ Final Gallery

### 🖥️ Fraud Detection Console — Overview
> Clean analyst dashboard on startup — 5 live stat cards, transaction log with filter pills, and the New Transaction panel.

https://github.com/TeamVEXA/VEXA-FraudDetection/blob/main/assets/dashboard.png.png?raw=true

---

### 🔴 Fraud Detection in Action
> Amount ₹5,00,000 + Crypto Exchange → Score 0.76 → **FRAUD** flagged with explainability panel showing exact risk factor weights.

https://github.com/TeamVEXA/VEXA-FraudDetection/blob/main/assets/fraud_detection.png.png?raw=true

---

### 🟡 Manual Review Triggered
> Amount ₹50,000 + Crypto Exchange → Score 0.61 → **REVIEW** flagged for manual analyst action. Alert banner fires automatically.

https://github.com/TeamVEXA/VEXA-FraudDetection/blob/main/assets/review_detection.png.png?raw=true

---

### ⭐ Trusted Registry — Auto-Clear
> After marking Crypto Exchange as trusted — same transaction returns score 0.00, status **TRUSTED**, accuracy 100%. Zero false positives.

https://github.com/TeamVEXA/VEXA-FraudDetection/blob/main/assets/trusted_registry.png.png?raw=true

---

### 🦈 Shark Tank Poster

[Open Shark Tank File](assets/VEXA_W4_C2.html)

---

## 📌 Project Status

- [x] Week 1 — Blueprint & Tech Stack
- [x] Week 2 — Core Logic + Live Dashboard
- [x] Week 3 — Error Handling + Optimization + Trusted Registry
- [x] Week 4 — Production Ready + Master README + Shark Tank Pitch

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

<div align="center">

*Built with 🔥 by Team VEXA · Hackathon 2026*

**"Every second, ₹10 crore is stolen in India. We stop it before it leaves the account."**

</div>
