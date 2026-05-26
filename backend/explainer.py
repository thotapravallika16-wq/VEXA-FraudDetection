# ─── VEXA Fraud Detection — explainer.py (Real SHAP) ───

import pickle
import numpy as np

_shap_explainer = None

def _load_shap():
    global _shap_explainer
    if _shap_explainer is None:
        try:
            with open("shap_explainer.pkl", "rb") as f:
                _shap_explainer = pickle.load(f)
        except Exception:
            _shap_explainer = None
    return _shap_explainer


def explain(amount, merchant, score, device="unknown", hour=12):

    reasons  = []
    weights  = {}
    used_ai  = False
    ai_explanation = ""

    # ── Try REAL SHAP explanation ──
    shap_exp = _load_shap()

    if shap_exp is not None:
        try:
            from predictor import MERCHANT_RISK
            merchant_map = {m: i for i, m in enumerate(MERCHANT_RISK.keys())}
            merchant_num = merchant_map.get(merchant, len(merchant_map))
            device_num   = 1 if device.lower() in ("unknown", "new device", "unregistered") else 0
            features     = np.array([[amount, merchant_num, device_num, hour]])

            shap_vals = shap_exp.shap_values(features)[1][0]

            feature_names = ["amount", "merchant", "device", "hour"]

            for name, val in zip(feature_names, shap_vals):
                weights[name] = round(abs(float(val)), 3)

            sorted_features = sorted(
                zip(feature_names, shap_vals),
                key=lambda x: abs(x[1]),
                reverse=True
            )

            for name, val in sorted_features:
                if abs(val) < 0.01:
                    continue
                direction = "increased" if val > 0 else "decreased"
                if name == "amount":
                    reasons.append(
                        f"Transaction amount ₹{amount:,} {direction} fraud risk"
                    )
                elif name == "merchant":
                    reasons.append(
                        f"Merchant '{merchant}' {direction} fraud risk"
                    )
                elif name == "device":
                    reasons.append(
                        f"Device type {direction} fraud risk"
                    )
                elif name == "hour":
                    reasons.append(
                        f"Transaction at hour {hour} {direction} fraud risk"
                    )

            top = sorted_features[0]
            ai_explanation = (
                f"SHAP analysis: primary risk factor was '{top[0]}' "
                f"contributing {abs(top[1]):.3f} to the fraud score of {score:.3f}."
            )
            used_ai = True

        except Exception:
            pass

    # ── Fallback to rules if SHAP fails ──
    if not reasons:
        if amount > 50000:
            reasons.append(
                f"High amount ₹{amount:,} exceeds ₹50,000 threshold"
            )
            weights["amount"] = 0.40
        if merchant in ["Crypto Exchange", "Unknown", "Wire Transfer"]:
            reasons.append(
                f"{merchant} is a high-risk merchant category"
            )
            weights["merchant"] = 0.35
        if device.lower() in ("unknown", "new device", "unregistered"):
            reasons.append(
                "Unregistered device detected"
            )
            weights["device"] = 0.20
        if 0 <= hour < 5:
            reasons.append(
                "Transaction at high-risk hour 2AM-4AM"
            )
            weights["hour"] = 0.15

        ai_explanation = (
            f"Rule-based score {score:.3f} — "
            f"{len(reasons)} risk factor(s) detected."
        )

    if not reasons:
        reasons.append("No suspicious signals detected")
        ai_explanation = "Transaction within normal parameters."

    return {
        "score":          round(score, 3),
        "is_fraud":       score >= 0.5,
        "reasons":        reasons,
        "weights":        weights,
        "ai_explanation": ai_explanation,
        "used_ai":        used_ai
    }