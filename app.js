let txnCounter = 9000;

let securityState = {
  transactionsBlocked: false,
  requireOtp: true,
  deviceVerification: true
};

let reportsStorage = [];

function saveReport(report) {
  reportsStorage.unshift(report);
  if (reportsStorage.length > 120) reportsStorage.pop();
  updateStatusCards();
  updateAnalyticsView();
  updateReportsUi();
}

function updateStatusCards() {
  const fraud = reportsStorage.filter(item => item.status === 'fraud').length;
  const safe = reportsStorage.filter(item => item.status === 'safe').length;
  const review = reportsStorage.filter(item => item.status === 'review').length;
  document.getElementById('s-total').textContent = reportsStorage.length.toLocaleString('en-IN');
  document.getElementById('s-fraud').textContent = fraud;
  document.getElementById('s-safe').textContent = safe;
}

function updateAnalyticsView() {
  const fraud = reportsStorage.filter(item => item.status === 'fraud').length;
  const safe = reportsStorage.filter(item => item.status === 'safe').length;
  const review = reportsStorage.filter(item => item.status === 'review').length;
  const total = Math.max(1, reportsStorage.length);
  document.getElementById('analytics-total').textContent = reportsStorage.length;
  document.getElementById('analytics-fraud').textContent = fraud;
  document.getElementById('analytics-safe').textContent = safe;
  document.getElementById('analytics-review').textContent = review;
  document.getElementById('analytics-safe-label').textContent = safe;
  document.getElementById('analytics-fraud-label').textContent = fraud;
  document.getElementById('analytics-review-label').textContent = review;
  document.getElementById('safe-chart-bar').style.width = `${Math.round((safe / total) * 100)}%`;
  document.getElementById('fraud-chart-bar').style.width = `${Math.round((fraud / total) * 100)}%`;
  document.getElementById('review-chart-bar').style.width = `${Math.round((review / total) * 100)}%`;
}

function updateReportsUi() {
  const body = document.getElementById('reports-table-body');
  const countLabel = document.getElementById('reports-count');
  if (!body || !countLabel) return;
  body.innerHTML = reportsStorage.map(report => `
    <tr>
      <td>${report.time}</td>
      <td><span class="badge ${report.status}"><span class="bdot"></span>${report.status.toUpperCase()}</span></td>
      <td>₹${report.amount.toLocaleString('en-IN')}</td>
      <td>${report.merchantName}</td>
      <td>${report.score}</td>
    </tr>
  `).join('');
  countLabel.textContent = `${reportsStorage.length} reports stored`;
}

function switchView(view) {
  const dashboard = document.getElementById('dashboard-view');
  const analytics = document.getElementById('analytics-view');
  const reports = document.getElementById('reports-view');
  const tabs = {
    dashboard: document.getElementById('tab-dashboard'),
    analytics: document.getElementById('tab-analytics'),
    reports: document.getElementById('tab-reports')
  };
  dashboard.style.display = view === 'dashboard' ? 'grid' : 'none';
  analytics.style.display = view === 'analytics' ? 'block' : 'none';
  reports.style.display = view === 'reports' ? 'block' : 'none';
  Object.keys(tabs).forEach(key => {
    if (!tabs[key]) return;
    tabs[key].classList.toggle('active', key === view);
  });
  updateAnalyticsView();
  updateReportsUi();
}

function filterTransactions(filter) {
  document.querySelectorAll('.fpill').forEach(pill => {
    pill.classList.toggle('active', pill.dataset.filter === filter);
  });
  document.querySelectorAll('#txn-body tr').forEach(row => {
    if (filter === 'all') {
      row.style.display = '';
      return;
    }
    const badge = row.querySelector('.badge');
    if (!badge) return;
    const statusText = badge.textContent.trim().toLowerCase();
    row.style.display = statusText === filter ? '' : 'none';
  });
}

function updateSecurityUi() {
  const blockBtn = document.getElementById('block-txn-btn');
  const otpBtn = document.getElementById('otp-toggle-btn');
  const deviceBtn = document.getElementById('device-sec-btn');
  const statusText = document.getElementById('security-status-text');
  const runBtn = document.querySelector('.sim-box .run-btn');
  const batchBtn = document.getElementById('batch-run-btn');

  if (blockBtn) {
    blockBtn.textContent = securityState.transactionsBlocked ? 'Disable Block' : 'Enable Block';
  }
  if (otpBtn) {
    otpBtn.textContent = securityState.requireOtp ? 'OTP On' : 'OTP Off';
  }
  if (deviceBtn) {
    deviceBtn.textContent = securityState.deviceVerification ? 'Device Verify On' : 'Device Verify Off';
  }
  if (runBtn) {
    runBtn.disabled = securityState.transactionsBlocked;
    runBtn.style.opacity = securityState.transactionsBlocked ? '0.6' : '1';
  }
  if (batchBtn) {
    batchBtn.disabled = securityState.transactionsBlocked;
    batchBtn.style.opacity = securityState.transactionsBlocked ? '0.6' : '1';
  }
  if (statusText) {
    statusText.textContent = securityState.transactionsBlocked
      ? 'All outgoing transactions are blocked by account security.'
      : `Advanced security active. OTP ${securityState.requireOtp ? 'required' : 'disabled'}; device verification ${securityState.deviceVerification ? 'enabled' : 'disabled'}.`;
  }
}

async function runCheck() {

  const amount = parseInt(document.getElementById('s-amount').value) || 75000;

  const merchantRaw = document.getElementById('s-merchant').value;
  const deviceRaw = document.getElementById('s-device').value;
  const timeRaw = document.getElementById('s-time').value;

  const merchant =
    merchantRaw === 'unknown' || merchantRaw === 'crypto'
      ? 'Unknown'
      : 'Known';

  const device =
    deviceRaw === 'new'
      ? 'New'
      : 'Old';

  const time =
    timeRaw === 'night'
      ? 'Night'
      : 'Day';

  if (securityState.transactionsBlocked) {
    showAlert('Transaction blocked by advanced security. Disable block mode to continue.');
    return;
  }

  try {

    const response = await fetch('http://127.0.0.1:5000/check_fraud', {

      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({
        amount,
        merchant,
        device,
        time
      })
    });

    const data = await response.json();

    const score = data.score;

    const isFraud = data.result === "FRAUD";
    const isReview = score > 0.35 && score <= 0.60;

    if (securityState.requireOtp && isReview) {
      showAlert(`Advanced security: OTP required for review-risk transaction (${score}).`);
    } else if (securityState.deviceVerification && device === 'New') {
      showAlert('Advanced security: new device verification required for this transaction.');
    }

    const status = isFraud ? 'fraud' : isReview ? 'review' : 'safe';

    const label = isFraud ? 'FRAUD' : isReview ? 'REVIEW' : 'SAFE';

    const color = isFraud ? '#f87171' : isReview ? '#fbbf24' : '#4ade80';

    const barColor = isFraud ? '#ef4444' : isReview ? '#f59e0b' : '#22c55e';

    const merchantNames = {
      unknown: 'UnknownMerch',
      crypto: 'CryptoEx',
      food: 'Swiggy',
      ecomm: 'Amazon'
    };

    const tbody = document.getElementById('txn-body');

    const row = document.createElement('tr');

    row.className =
      (isFraud ? 'row-fraud' : isReview ? 'row-review' : '') + ' new-row';

    row.innerHTML = `
      <td class="txn-id ${isFraud ? 'fraud-id' : isReview ? 'review-id' : ''}">
        #TXN${txnCounter}
      </td>

      <td>usr_${Math.floor(Math.random() * 9000 + 1000)}</td>

      <td class="amount">₹${amount.toLocaleString('en-IN')}</td>

      <td>${merchantNames[merchantRaw]}</td>

      <td>${time}</td>

      <td>
        <div class="score-wrap">
          <div class="score-track">
            <div class="score-fill"
              style="width:${Math.round(score * 100)}%;background:${barColor}">
            </div>
          </div>

          <span class="score-num" style="color:${color}">
            ${score}
          </span>
        </div>
      </td>

      <td>
        <span class="badge ${status}">
          <span class="bdot"></span>${label}
        </span>
      </td>
    `;

    tbody.insertBefore(row, tbody.firstChild);

    if (tbody.children.length > 8) {
      tbody.removeChild(tbody.lastChild);
    }

    txnCounter++;

    saveReport({
      time: new Date().toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
      amount,
      merchantName: merchantNames[merchantRaw],
      status,
      score,
      device,
      reason: data.reasons.join(', ')
    });

    document.getElementById('big-score').textContent = score;

    document.getElementById('big-score').style.color = color;

    // WHY CARD

    const body = document.getElementById('why-body');

    body.innerHTML = data.reasons.map(reason => `
      <div class="why-item">
        <div class="why-icon warn">!</div>

        <div class="why-content">
          <div class="why-name">${reason}</div>
        </div>
      </div>
    `).join('');

    if (isFraud) {
      showAlert(`FRAUD DETECTED — Score ${score} — TXN Flagged`);
    }

  } catch (error) {

    console.error(error);

    alert("Backend connection failed");
  }
}

function showAlert(message) {
  const banner = document.getElementById('alert-banner');
  const text = document.getElementById('alert-text');
  text.textContent = message;
  banner.classList.add('show');
  setTimeout(() => {
    banner.classList.remove('show');
  }, 4000);
}

function freezeAccount() {
  const btn = document.getElementById('freeze-btn');
  btn.classList.add('frozen');
  btn.innerHTML = '✓ Account Frozen + OTP Sent';
}

function toggleBlockTransactions() {
  securityState.transactionsBlocked = !securityState.transactionsBlocked;
  updateSecurityUi();
  showAlert(securityState.transactionsBlocked ? 'Block mode enabled: all outgoing transactions are paused.' : 'Block mode disabled: transactions may proceed.');
}

function toggleOtpRequirement() {
  securityState.requireOtp = !securityState.requireOtp;
  updateSecurityUi();
  showAlert(securityState.requireOtp ? 'OTP requirement enabled.' : 'OTP requirement disabled.');
}

function toggleDeviceVerification() {
  securityState.deviceVerification = !securityState.deviceVerification;
  updateSecurityUi();
  showAlert(securityState.deviceVerification ? 'Device verification enabled.' : 'Device verification disabled.');
}

updateSecurityUi();

/* ─── BATCH IMPORT ─── */

let parsedBatchTxns = [];

function openBatchPanel() {
  document.getElementById('batch-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  setTimeout(() => document.getElementById('batch-input').focus(), 300);
}

function closeBatchPanel(e) {
  if (e && e.target !== document.getElementById('batch-overlay')) return;
  document.getElementById('batch-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

async function runBatchImport() {
  if (securityState.transactionsBlocked) {
    showAlert('Transaction block mode is enabled. Disable it before running batch checks.');
    return;
  }

  const raw = document.getElementById('batch-input').value.trim();
  if (!raw) return;

  const runBtn = document.getElementById('batch-run-btn');
  runBtn.disabled = true;
  runBtn.textContent = 'Parsing...';

  document.getElementById('batch-results').style.display = 'none';
  document.getElementById('batch-error').style.display = 'none';
  document.getElementById('batch-progress').style.display = 'block';
  document.getElementById('batch-status-text').textContent = 'Sending to Claude for parsing...';
  document.getElementById('batch-count-text').textContent = '';

  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: `You are a fraud detection data parser. Extract all transactions from the text below and return ONLY a JSON array (no markdown, no preamble).

Each transaction object must have:
- amount: number (in INR, just the number)
- merchant: "Unknown" or "Known" (Unknown for crypto exchanges, unknown merchants, suspicious; Known for food delivery, e-commerce, regular merchants)
- device: "New" or "Old"
- time: "Night" or "Day" (Night = late night / odd hours 10pm-6am; Day = normal hours)
- merchantName: short display name (e.g. "Swiggy", "CryptoEx", "UnknownMerch", "Amazon")

Return ONLY valid JSON array. Example: [{"amount":82500,"merchant":"Unknown","device":"New","time":"Night","merchantName":"UnknownMerch"}]

Text to parse:
${raw}`
        }]
      })
    });

    if (!resp.ok) throw new Error(`Parser API request failed: ${resp.status}`);

    const data = await resp.json();
    const text = (data.content || []).map(b => b.text || '').join('');
    const clean = text.replace(/```json|```/g, '').trim();
    const txns = JSON.parse(clean);

    if (!Array.isArray(txns) || txns.length === 0) throw new Error('No transactions found');

    processParsedTxns(txns);

  } catch (err) {
    console.warn('Remote parser failed, attempting local fallback:', err);

    try {
      const txns = localParseTransactions(raw);
      if (!Array.isArray(txns) || txns.length === 0) throw new Error('Local parser found no transactions');
      processParsedTxns(txns);
    } catch (err2) {
      document.getElementById('batch-progress').style.display = 'none';
      document.getElementById('batch-error').style.display = 'flex';
      document.getElementById('batch-error-text').textContent =
        'Failed to parse: ' + (err2.message || 'Unknown error');
      console.error(err2);
    }
  }

  runBtn.disabled = false;
  runBtn.textContent = 'Parse & Run Fraud Check →';
}

function processParsedTxns(txns) {
  document.getElementById('batch-status-text').textContent = `Scoring ${txns.length} transactions...`;
  document.getElementById('batch-count-text').textContent = `0 / ${txns.length}`;

  parsedBatchTxns = [];
  const list = document.getElementById('batch-results-list');
  list.innerHTML = '';

  (async function () {
    for (let i = 0; i < txns.length; i++) {
      const t = txns[i];
      document.getElementById('batch-count-text').textContent = `${i + 1} / ${txns.length}`;

      let score, result;
      try {
        const r = await fetch('http://127.0.0.1:5000/check_fraud', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: t.amount, merchant: t.merchant, device: t.device, time: t.time })
        });
        if (!r.ok) throw new Error('Local scoring failed');
        const d = await r.json();
        score = d.score;
        result = d.result;
      } catch (e) {
        score = computeScoreLocally(t);
        result = score >= 0.6 ? 'FRAUD' : 'SAFE';
      }

      const isReview = score > 0.35 && score <= 0.60;
      const status = result === 'FRAUD' ? 'fraud' : isReview ? 'review' : 'safe';
      const color = status === 'fraud' ? '#f87171' : status === 'review' ? '#fbbf24' : '#4ade80';

      parsedBatchTxns.push({ ...t, score, result, status });
      saveReport({
        time: new Date().toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
        amount: t.amount,
        merchantName: t.merchantName,
        status,
        score,
        device: t.device,
        reason: ''
      });

      const row = document.createElement('div');
      row.className = `batch-result-row ${status}-row`;
      row.innerHTML = `
        <div class="batch-result-amount">₹${t.amount.toLocaleString('en-IN')}</div>
        <div class="batch-result-meta">
          <div style="color:var(--text-muted);font-size:12px;">${t.merchantName}</div>
          <div>${t.device} device · ${t.time}</div>
        </div>
        <div>
          <span class="badge ${status}" style="margin-bottom:4px;display:inline-flex;">
            <span class="bdot"></span>${status.toUpperCase()}
          </span>
        </div>
        <div class="batch-result-score" style="color:${color};min-width:32px;text-align:right;">${score}</div>
      `;
      list.appendChild(row);
    }

    document.getElementById('batch-progress').style.display = 'none';
    document.getElementById('batch-results').style.display = 'block';
    document.getElementById('batch-result-count').textContent =
      `${parsedBatchTxns.length} transactions parsed`;
  })();
}

function localParseTransactions(raw) {
  const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const txns = [];

  for (const line of lines) {
    const amtMatch = line.match(/(₹|INR)?\s*([0-9,]+)(?:\.\d+)?/i);
    if (!amtMatch) continue;
    const amount = parseInt(amtMatch[2].replace(/,/g, ''), 10);

    const merchantName = /swiggy/i.test(line) ? 'Swiggy' : /amazon/i.test(line) ? 'Amazon' : /crypto|binance|coinbase/i.test(line) ? 'CryptoEx' : 'UnknownMerch';
    const merchant = /crypto|binance|coinbase/i.test(line) || merchantName === 'UnknownMerch' ? 'Unknown' : 'Known';
    const device = /new phone|new device|new/i.test(line) ? 'New' : 'Old';
    const time = /\b(\d{1,2}:?\d{0,2}\s*(am|pm)|night|late)\b/i.test(line) ? 'Night' : 'Day';

    txns.push({ amount, merchant, device, time, merchantName });
  }

  return txns;
}

function computeScoreLocally(t) {
  let s = 0;
  if (t.amount > 50000) s += 0.4;
  if (t.merchant === 'Unknown') s += 0.3;
  if (t.device === 'New') s += 0.2;
  if (t.time === 'Night') s += 0.2;
  return Math.min(parseFloat(s.toFixed(2)), 1.0);
}

function addBatchToFeed() {
  if (securityState.transactionsBlocked) {
    showAlert('Cannot add batch transactions while transaction block mode is enabled.');
    return;
  }

  const tbody = document.getElementById('txn-body');
  let fraudAdded = 0;

  for (const t of [...parsedBatchTxns].reverse()) {
    const color = t.status === 'fraud' ? '#f87171' : t.status === 'review' ? '#fbbf24' : '#4ade80';
    const barColor = t.status === 'fraud' ? '#ef4444' : t.status === 'review' ? '#f59e0b' : '#22c55e';
    const idClass = t.status === 'fraud' ? 'fraud-id' : t.status === 'review' ? 'review-id' : '';
    const rowClass = t.status === 'fraud' ? 'row-fraud' : t.status === 'review' ? 'row-review' : '';

    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

    const row = document.createElement('tr');
    row.className = (rowClass + ' new-row').trim();
    row.innerHTML = `
      <td class="txn-id ${idClass}">#TXN${txnCounter}</td>
      <td>usr_${Math.floor(Math.random() * 9000 + 1000)}</td>
      <td class="amount">₹${t.amount.toLocaleString('en-IN')}</td>
      <td>${t.merchantName}</td>
      <td>${timeStr}</td>
      <td>
        <div class="score-wrap">
          <div class="score-track">
            <div class="score-fill" style="width:${Math.round(t.score * 100)}%;background:${barColor}"></div>
          </div>
          <span class="score-num" style="color:${color}">${t.score}</span>
        </div>
      </td>
      <td><span class="badge ${t.status}"><span class="bdot"></span>${t.status.toUpperCase()}</span></td>
    `;
    tbody.insertBefore(row, tbody.firstChild);
    if (tbody.children.length > 8) tbody.removeChild(tbody.lastChild);
    txnCounter++;

    if (t.status === 'fraud') fraudAdded++;
  }

  if (fraudAdded > 0) {
    showAlert(`${fraudAdded} FRAUD transaction${fraudAdded > 1 ? 's' : ''} added from batch import`);
  }

  closeBatchPanel();
  document.getElementById('batch-input').value = '';
  parsedBatchTxns = [];
  document.getElementById('batch-results').style.display = 'none';
}
