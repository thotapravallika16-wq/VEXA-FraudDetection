// ─── VEXA app.js v3 ─────────────────────────────────────

const API = "http://127.0.0.1:5000";
let txnCounter = 0;
let stats = { fraud: 0, safe: 0, review: 0, trusted: 0, total: 0 };
let allRows = [];
let currentFilter = "all";

// ── Tab switching ─────────────────────────────────────────
document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const tab = btn.dataset.tab;
    document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(t => t.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(`tab-${tab}`).classList.add("active");
    if (tab === "trusted") loadTrustedTab();
  });
});

// ── Filter pills ──────────────────────────────────────────
document.querySelectorAll(".filter-pill").forEach(pill => {
  pill.addEventListener("click", () => {
    document.querySelectorAll(".filter-pill").forEach(p => p.classList.remove("active"));
    pill.classList.add("active");
    currentFilter = pill.dataset.filter;
    renderLog();
  });
});

// ── Main fraud check ──────────────────────────────────────
async function runCheck() {
  const amount   = document.getElementById("inp-amount").value;
  const merchant = document.getElementById("inp-merchant").value;
  const device   = document.getElementById("inp-device").value;
  const hour     = document.getElementById("inp-hour").value;
  const userId   = document.getElementById("inp-user").value || "user_001";

  if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
    showBanner("fraud", "Please enter a valid amount greater than 0.");
    return;
  }

  setLoading(true);
  hideAllBanners();

  try {
    const res = await fetch(`${API}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount:   parseFloat(amount),
        merchant, device,
        hour:     parseInt(hour) || 12,
        user_id:  userId
      })
    });

    if (!res.ok) {
      const err = await res.json();
      showBanner("fraud", `Error: ${err.error || "Server error"}`);
      setLoading(false);
      return;
    }

    const data = await res.json();
    handleResult(data, { amount, merchant, device, hour });

  } catch (e) {
    document.getElementById("modal-overlay").classList.remove("hidden");
  }

  setLoading(false);
}

function handleResult(data, input) {
  const { score, verdict, reasons, weights, ai_explanation, used_ai } = data;

  // Banners
  if (verdict === "FRAUD" || verdict === "BLOCKED") {
    showBanner("fraud", `⚠ ${verdict} — ${reasons[0] || "High-risk transaction detected"}`);
  } else if (verdict === "TRUSTED") {
    showBanner("trust", `✦ AUTO-CLEARED — ${input.merchant} is a verified trusted merchant`);
  } else if (verdict === "SAFE") {
    showBanner("safe", `✓ SAFE — Transaction cleared (score: ${score})`);
  } else {
    showBanner("fraud", `⚠ REVIEW — Transaction flagged for manual review (score: ${score})`);
  }

  // Explainability panel
  updateExplainPanel(score, verdict, reasons, weights, ai_explanation, used_ai);

  // Stats
  stats.total++;
  if (verdict === "FRAUD" || verdict === "BLOCKED") stats.fraud++;
  else if (verdict === "SAFE")    stats.safe++;
  else if (verdict === "REVIEW")  stats.review++;
  else if (verdict === "TRUSTED") stats.trusted++;
  updateStats();

  // Log entry
  txnCounter++;
  const txnId = `TXN${String(txnCounter).padStart(4, "0")}`;
  allRows.unshift({ txnId, input, data, verdict, score });
  renderLog();
}

// ── Explainability panel ──────────────────────────────────
function updateExplainPanel(score, verdict, reasons, weights, aiText, usedAI) {
  const card = document.getElementById("explain-card");
  card.classList.remove("hidden");

  // Score ring
  const arc       = document.getElementById("score-arc");
  const scoreNum  = document.getElementById("score-num");
  const scoreLabel = document.getElementById("score-label");
  const circumference = 251.2;
  const offset    = circumference - (score * circumference);
  arc.style.strokeDashoffset = offset;

  // Color ring
  arc.className = "";
  if (verdict === "TRUSTED") arc.classList.add("arc-trusted");
  else if (score >= 0.7)     arc.classList.add("arc-fraud");
  else if (score >= 0.4)     arc.classList.add("arc-review");
  else                       arc.classList.add("arc-safe");

  scoreNum.textContent  = verdict === "TRUSTED" ? "—" : score.toFixed(2);
  scoreLabel.textContent = verdict;

  // AI badge
  const aiBadge = document.getElementById("ai-badge");
  if (usedAI) aiBadge.classList.remove("hidden");
  else aiBadge.classList.add("hidden");

  // AI explanation
  document.getElementById("explain-ai").textContent = aiText || "No explanation available.";

  // Reasons
  const reasonEl = document.getElementById("reason-list");
  reasonEl.innerHTML = (reasons || []).map(r =>
    `<div class="reason-item">${r}</div>`
  ).join("");

  // Weight bars
  const wBars = document.getElementById("weight-bars");
  wBars.innerHTML = Object.entries(weights || {}).map(([k, v]) => `
    <div class="weight-row">
      <span class="weight-name">${k}</span>
      <div class="weight-track"><div class="weight-fill" style="width:${Math.round(v * 100)}%"></div></div>
      <span class="weight-val">${Math.round(v * 100)}%</span>
    </div>
  `).join("");
}

// ── Log rendering ─────────────────────────────────────────
function renderLog() {
  const tbody = document.getElementById("log-body");
  let rows = currentFilter === "all"
    ? allRows
    : allRows.filter(r => r.verdict === currentFilter);

  if (!rows.length) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="7">No transactions${currentFilter !== "all" ? ` with status "${currentFilter}"` : " yet"}</td></tr>`;
    return;
  }

  tbody.innerHTML = rows.map(r => {
    const { txnId, input, verdict, score } = r;
    const rowClass = `row-${verdict.toLowerCase()}`;
    const scoreClass = verdict === "TRUSTED" ? "score-zero"
      : score >= 0.7 ? "score-high"
      : score >= 0.4 ? "score-mid"
      : "score-low";

    const actionCell = verdict === "TRUSTED"
      ? `<span class="trusted-tag">⭐ TRUSTED</span>`
      : `<button class="trust-btn" onclick="trustMerchant('${input.merchant}', this)">✓ Trust</button>`;

    return `
      <tr class="${rowClass}">
        <td>${txnId}</td>
        <td>₹${parseFloat(input.amount).toLocaleString("en-IN")}</td>
        <td>${input.merchant}</td>
        <td>${input.device}</td>
        <td class="${scoreClass}">${verdict === "TRUSTED" ? "0.00" : score.toFixed(3)}</td>
        <td><span class="verdict verdict-${verdict}">${verdict}</span></td>
        <td>${actionCell}</td>
      </tr>
    `;
  }).join("");
}

// ── Trust action ──────────────────────────────────────────
async function trustMerchant(merchant, btn) {
  try {
    await fetch(`${API}/mark_trusted`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ merchant })
    });
    showBanner("trust", `✦ ${merchant} added to Trusted Registry — auto-cleared going forward`);
    // Update the row button
    btn.parentElement.innerHTML = `<span class="trusted-tag">⭐ TRUSTED</span>`;
    // Update stat
    stats.trusted++;
    updateStats();
  } catch (e) {
    showBanner("fraud", "Could not reach backend to mark trusted.");
  }
}

// ── Trusted registry tab ──────────────────────────────────
async function loadTrustedTab() {
  try {
    const res  = await fetch(`${API}/trusted_list`);
    const data = await res.json();
    const list = data.trusted || [];
    const grid = document.getElementById("trusted-grid");
    const countEl = document.getElementById("trusted-count");

    countEl.textContent = `${list.length} merchant${list.length !== 1 ? "s" : ""}`;

    if (!list.length) {
      grid.innerHTML = `<p class="empty-trust">No trusted merchants yet. Mark one from the dashboard.</p>`;
      return;
    }

    grid.innerHTML = list.map(item => `
      <div class="trusted-card">
        <div class="trusted-card-name">✦ ${item.merchant}</div>
        <div class="trusted-card-sub">Added by: ${item.marked_by || "analyst"}</div>
        <button class="remove-btn" onclick="removeTrusted('${item.merchant}', this)">✕ Remove</button>
      </div>
    `).join("");
  } catch (e) {
    document.getElementById("trusted-grid").innerHTML =
      `<p class="empty-trust">Could not load — is the backend running?</p>`;
  }
}

async function removeTrusted(merchant, btn) {
  try {
    await fetch(`${API}/remove_trusted`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ merchant })
    });
    btn.closest(".trusted-card").remove();
    const remaining = document.querySelectorAll(".trusted-card").length;
    document.getElementById("trusted-count").textContent = `${remaining} merchant${remaining !== 1 ? "s" : ""}`;
    if (!remaining) {
      document.getElementById("trusted-grid").innerHTML =
        `<p class="empty-trust">No trusted merchants yet.</p>`;
    }
  } catch (e) {
    alert("Could not remove — is the backend running?");
  }
}

// ── Helpers ───────────────────────────────────────────────
function setLoading(on) {
  document.getElementById("loading").classList.toggle("hidden", !on);
  document.getElementById("run-btn").disabled = on;
}

function hideAllBanners() {
  ["fraud-banner", "trust-banner", "safe-banner"].forEach(id =>
    document.getElementById(id).classList.add("hidden")
  );
}

function showBanner(type, msg) {
  hideAllBanners();
  const map = { fraud: "fraud-banner", trust: "trust-banner", safe: "safe-banner" };
  const textMap = { fraud: "fraud-text", trust: "trust-text", safe: "safe-text" };
  document.getElementById(textMap[type]).textContent = msg;
  document.getElementById(map[type]).classList.remove("hidden");
}

function updateStats() {
  document.getElementById("stat-fraud").textContent   = stats.fraud;
  document.getElementById("stat-safe").textContent    = stats.safe;
  document.getElementById("stat-review").textContent  = stats.review;
  document.getElementById("stat-trusted").textContent = stats.trusted;
  if (stats.total > 0) {
    const acc = Math.round(((stats.safe + stats.trusted) / stats.total) * 100);
    document.getElementById("stat-accuracy").textContent = `${acc}%`;
  }
}