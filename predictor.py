def detect_fraud(amount, merchant, device, time):

    fraud_score = 0
    reasons = []

    if amount > 50000:
        fraud_score += 0.4
        reasons.append("High transaction amount")

    if merchant == "Unknown":
        fraud_score += 0.3
        reasons.append("Unknown merchant")

    if device == "New":
        fraud_score += 0.2
        reasons.append("New device detected")

    if time == "Night":
        fraud_score += 0.2
        reasons.append("Odd transaction time")

    if fraud_score >= 0.6:
        result = "FRAUD"
    else:
        result = "SAFE"

    return {
        "result": result,
        "score": round(fraud_score, 2),
        "reasons": reasons
    }