# ─── VEXA Fraud Detection — main.py v4 ───

import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s'
)
logger = logging.getLogger(__name__)

from flask import Flask, request, jsonify
from flask_cors import CORS
from predictor import predict
from explainer import explain
from velocity import check_velocity, record_transaction
from trusted import is_trusted, mark_trusted, remove_trusted, get_all_trusted

app = Flask(__name__)
CORS(app)

# ── Load check ──────────────────────────────────────────────
try:
    from predictor import _load_model
    _load_model()
    logger.info("VEXA Backend Ready — v4 with Real SHAP + Trusted Fix + Logging")
except Exception as e:
    logger.warning(f"Model load warning: {e} — rule-based fallback active")


# ── Fraud prediction ─────────────────────────────────────────
@app.route("/predict", methods=["POST"])
def predict_route():
    try:
        data     = request.get_json(force=True)
        amount   = data.get("amount")
        merchant = data.get("merchant", "Unknown").strip()
        device   = data.get("device", "known").strip()
        hour     = data.get("hour", 12)
        user_id  = data.get("user_id", "user_default")

        # ── Input validation ──
        if amount is None:
            return jsonify({"error": "Missing required field: amount"}), 400
        try:
            amount = float(amount)
            hour   = int(hour)
        except (ValueError, TypeError):
            return jsonify({"error": "Invalid amount or hour value"}), 400
        if amount <= 0:
            return jsonify({"error": "Amount must be greater than 0"}), 400
        if not merchant:
            return jsonify({"error": "Merchant name cannot be empty"}), 400

        # ── Trusted check — reduces score, never fully bypasses ──
        trusted            = is_trusted(merchant)
        trusted_multiplier = 0.3 if trusted else 1.0

        # ── Velocity check ──
        vel = check_velocity(user_id)
        if vel["velocity_attack"]:
            logger.warning(f"Velocity attack: {user_id} — {vel['message']}")
            return jsonify({
                "score":          1.0,
                "verdict":        "BLOCKED",
                "trusted":        False,
                "reasons":        [vel["message"]],
                "weights":        {"velocity": 1.0},
                "velocity":       vel,
                "ai_explanation": vel["message"],
                "used_ai":        False,
            })

        record_transaction(user_id)

        # ── Predict + explain ──
        score   = round(predict(amount, merchant, device, hour) * trusted_multiplier, 3)
        details = explain(amount, merchant, score, device, hour)

        # ── Verdict ──
        if trusted and score < 0.3:
            verdict = "TRUSTED"
        elif score >= 0.7:
            verdict = "FRAUD"
        elif score >= 0.4:
            verdict = "REVIEW"
        else:
            verdict = "SAFE"

        logger.info(f"TXN | user={user_id} amount={amount} merchant={merchant} score={score} verdict={verdict}")

        return jsonify({
            "score":          details["score"],
            "verdict":        verdict,
            "trusted":        trusted,
            "reasons":        details["reasons"],
            "weights":        details["weights"],
            "velocity":       vel,
            "ai_explanation": details["ai_explanation"],
            "used_ai":        details["used_ai"],
        })

    except Exception as e:
        logger.error(f"Prediction error: {e}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500


# ── Trusted endpoints ─────────────────────────────────────────
@app.route("/mark_trusted", methods=["POST"])
def mark_trusted_route():
    try:
        data     = request.get_json(force=True)
        merchant = data.get("merchant", "").strip()
        if not merchant:
            return jsonify({"error": "Merchant name required"}), 400
        result = mark_trusted(merchant, marked_by="analyst")
        logger.info(f"Merchant marked trusted: {merchant}")
        return jsonify(result)
    except Exception as e:
        logger.error(f"mark_trusted error: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/remove_trusted", methods=["POST"])
def remove_trusted_route():
    try:
        data     = request.get_json(force=True)
        merchant = data.get("merchant", "").strip()
        result   = remove_trusted(merchant)
        logger.info(f"Merchant removed from trusted: {merchant}")
        return jsonify(result)
    except Exception as e:
        logger.error(f"remove_trusted error: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/trusted_list", methods=["GET"])
def trusted_list_route():
    try:
        return jsonify({"trusted": get_all_trusted()})
    except Exception as e:
        logger.error(f"trusted_list error: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status":   "ok",
        "version":  "4.0",
        "modules":  ["predictor", "explainer", "velocity", "trusted"],
        "shap":     "enabled"
    })


if __name__ == "__main__":
    logger.info("Starting VEXA Fraud Detection API v4")
    app.run(debug=True, port=5000)