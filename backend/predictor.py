# ─── VEXA Fraud Detection — predictor.py ───

import pickle
import numpy as np
from trusted import is_trusted

MERCHANT_RISK = {
    "Crypto Exchange": 0.90,
    "Unknown":         0.85,
    "Wire Transfer":   0.75,
    "Online Gaming":   0.65,
    "International":   0.60,
    "Food Delivery":   0.10,
    "Grocery":         0.08,
    "E-Commerce":      0.15,
    "Utility":         0.05,
    "Medical":         0.10,
}

_model = None


def _load_model():
    global _model
    if _model is None:
        try:
            with open("fraud_model.pkl", "rb") as f:
                _model = pickle.load(f)
        except Exception:
            _model = None
    return _model


def predict(amount: float, merchant: str, device: str = "known", hour: int = 12) -> float:

    model = _load_model()

    # ── Merchant risk score ──
    merchant_score = MERCHANT_RISK.get(merchant, 0.30)
    if is_trusted(merchant):
        merchant_score = min(merchant_score * 0.3, 0.10)

    # ── Rule-based score (always calculated) ──
    rule_score = 0.0
    if amount > 50000:    rule_score += 0.40
    elif amount > 20000:  rule_score += 0.25
    elif amount > 9999:   rule_score += 0.15
    rule_score += merchant_score * 0.40
    if 0 <= hour < 5:     rule_score += 0.15
    if device.lower() in ("unknown", "new device", "unregistered"):
        rule_score += 0.10

    # ── ML model score (secondary weight) ──
    if model is not None:
        try:
            merchant_map = {m: i for i, m in enumerate(MERCHANT_RISK.keys())}
            merchant_num = merchant_map.get(merchant, len(merchant_map))
            device_num   = 1 if device.lower() in ("unknown", "new device", "unregistered") else 0
            features     = np.array([[amount, merchant_num, device_num, hour]])
            ml_score     = model.predict_proba(features)[0][1]

            # ── Blend: 60% rules + 40% ML ──
            final_score = (rule_score * 0.6) + (ml_score * 0.4)
            return round(min(final_score, 1.0), 3)
        except Exception:
            pass

    return round(min(rule_score, 1.0), 3)