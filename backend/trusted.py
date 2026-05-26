# ─── VEXA Fraud Detection — trusted.py ───

import json
import os

TRUSTED_FILE = "trusted_store.json"


def _load():
    if os.path.exists(TRUSTED_FILE):
        with open(TRUSTED_FILE) as f:
            return json.load(f)
    return {}


def _save(store):
    with open(TRUSTED_FILE, "w") as f:
        json.dump(store, f, indent=2)


def is_trusted(merchant: str) -> bool:
    store = _load()
    return merchant.lower().strip() in store


def mark_trusted(merchant: str, marked_by: str = "analyst") -> dict:
    store = _load()
    key = merchant.lower().strip()
    store[key] = {"merchant": merchant, "marked_by": marked_by}
    _save(store)
    return {"status": "trusted", "merchant": merchant}


def remove_trusted(merchant: str) -> dict:
    store = _load()
    key = merchant.lower().strip()
    if key in store:
        del store[key]
        _save(store)
        return {"status": "removed", "merchant": merchant}
    return {"status": "not_found", "merchant": merchant}


def get_all_trusted() -> list:
    store = _load()
    return list(store.values())