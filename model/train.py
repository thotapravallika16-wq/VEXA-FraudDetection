# ─── VEXA Fraud Detection — train.py (with SHAP) ───

import numpy as np
import pickle
import shap
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

print("\n VEXA — Model Training")
print("="*40)

# ── Step 1: Create Training Data ──
print("[1/5] Creating training data...")

np.random.seed(42)
n = 500

amounts   = np.random.randint(100, 150000, n)
merchants = np.random.randint(0, 2, n)
devices   = np.random.randint(0, 2, n)
hours     = np.random.randint(0, 24, n)

labels = []
for i in range(n):
    score = 0
    if amounts[i] > 50000:  score += 1
    if merchants[i] == 0:   score += 1
    if devices[i] == 1:     score += 1
    if hours[i] < 5:        score += 1
    labels.append(1 if score >= 2 else 0)

X = np.column_stack([amounts, merchants, devices, hours])
y = np.array(labels)

print(f"      Total  : {n} transactions")
print(f"      Fraud  : {sum(y)}")
print(f"      Safe   : {n - sum(y)}")

# ── Step 2: Split ──
print("\n[2/5] Splitting data...")
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# ── Step 3: Train ──
print("\n[3/5] Training RandomForest model...")
model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)
model.fit(X_train, y_train)
print("      Done!")

# ── Step 4: Evaluate ──
print("\n[4/5] Evaluating model...")
y_pred = model.predict(X_test)
print(classification_report(
    y_test, y_pred,
    target_names=["Safe", "Fraud"]
))

# ── Step 5: Save model + SHAP explainer ──
print("[5/5] Saving model and SHAP explainer...")

with open("fraud_model.pkl", "wb") as f:
    pickle.dump(model, f)
print("      fraud_model.pkl saved!")

shap_explainer = shap.TreeExplainer(model)
with open("shap_explainer.pkl", "wb") as f:
    pickle.dump(shap_explainer, f)
print("      shap_explainer.pkl saved!")

print("\n All files saved!")
print(" VEXA model is ready with real SHAP explainability!")
print("="*40)