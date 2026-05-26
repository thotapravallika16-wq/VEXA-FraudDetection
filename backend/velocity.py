# ─── VEXA Fraud Detection — velocity.py ───

import time

velocity_store  = {}
frozen_accounts = {}

VELOCITY_WINDOW = 60
VELOCITY_LIMIT  = 3
FREEZE_DURATION = 300


def is_frozen(user_id):
    if user_id in frozen_accounts:
        if time.time() < frozen_accounts[user_id]:
            remaining = int(frozen_accounts[user_id] - time.time())
            return True, remaining
        else:
            del frozen_accounts[user_id]
    return False, 0


def freeze_account(user_id):
    frozen_accounts[user_id] = time.time() + FREEZE_DURATION
    return f"Account {user_id} frozen for 5 mins. OTP sent."


def record_transaction(user_id):
    now = time.time()
    if user_id not in velocity_store:
        velocity_store[user_id] = []
    velocity_store[user_id] = [
        t for t in velocity_store[user_id]
        if now - t < VELOCITY_WINDOW
    ]
    velocity_store[user_id].append(now)


def check_velocity(user_id):
    now = time.time()

    # ── Check if already frozen ──
    frozen, remaining = is_frozen(user_id)
    if frozen:
        return {
            "velocity_attack": True,
            "already_frozen":  True,
            "txn_count":       VELOCITY_LIMIT,
            "action":          "BLOCKED",
            "message":         f"Account frozen. {remaining}s remaining."
        }

    # ── Initialize if new user ──
    if user_id not in velocity_store:
        velocity_store[user_id] = []

    # ── Only READ here — record_transaction handles appending ──
    recent = [
        t for t in velocity_store[user_id]
        if now - t < VELOCITY_WINDOW
    ]
    count = len(recent)

    # ── Check velocity limit ──
    if count >= VELOCITY_LIMIT:
        msg = freeze_account(user_id)
        return {
            "velocity_attack": True,
            "already_frozen":  False,
            "txn_count":       count,
            "action":          "FREEZE",
            "message":         f"VELOCITY ATTACK! {count} txns in 60s. {msg}"
        }

    return {
        "velocity_attack": False,
        "txn_count":       count,
        "action":          "ALLOW",
        "message":         f"OK — {count}/{VELOCITY_LIMIT} transactions in window"
    }