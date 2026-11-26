// Views for the Marlowe household budget: hash routing, rendering and the
// small interactions (add/delete transactions, pay bills, add to goals).
// State lives in localStorage under one key; the seed in data.js fills it first.

import { CATEGORIES, HOUSEHOLD, INCOME, MONTHLY_TOTALS, seedState } from './data.js';

const STORE_KEY = 'marlowe-budget-v1';
const app = document.getElementById('app');

function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* a private window falls back to the seed */ }
  const seed = seedState();
  saveState(seed);
  return seed;
}

function saveState(state) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch { /* ignore */ }
}

let state = loadState();

const money = (n) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const money0 = (n) => '$' + Math.round(n).toLocaleString('en-US');
const catOf = (id) => CATEGORIES.find((c) => c.id === id) || CATEGORIES[CATEGORIES.length - 1];
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function totals() {
  const income = INCOME.reduce((s, i) => s + i.amount, 0);
  const spent = state.transactions.filter((t) => t.kind === 'expense')
    .reduce((s, t) => s + t.amount, 0);
  return { income, spent, left: income - spent };
}

function spentByCategory() {
  const map = new Map(CATEGORIES.map((c) => [c.id, 0]));
  for (const t of state.transactions) {
    if (t.kind === 'expense' && map.has(t.category)) map.set(t.category, map.get(t.category) + t.amount);
  }
  return CATEGORIES.map((c) => ({ ...c, spent: map.get(c.id) })).filter((c) => c.spent > 0)
    .sort((a, b) => b.spent - a.spent);
}

// A donut chart drawn as inline SVG: one arc per spending category.
function donutChart(rows) {
  const total = rows.reduce((s, r) => s + r.spent, 0);
  const r = 70, cx = 90, cy = 90;
  let angle = -Math.PI / 2;
  const arcs = rows.map((row) => {
    const frac = row.spent / total;
    const a0 = angle, a1 = angle + frac * Math.PI * 2;
    angle = a1;
    const large = frac > 0.5 ? 1 : 0;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    return `<path d="M ${cx} ${cy} L ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} Z" fill="${row.color}"/>`;
  }).join('');
  const legend = rows.map((row) =>
    `<li><span class="dot" style="background:${row.color}"></span>${esc(row.label)}<span class="amt">${money(row.spent)}</span></li>`).join('');
  return `<div class="donut-wrap">
    <svg width="180" height="180" viewBox="0 0 180 180" role="img" aria-label="Spending by category, November 2026">
      ${arcs}<circle cx="${cx}" cy="${cy}" r="42" fill="#fffdf7"/>
      <text x="${cx}" y="86" text-anchor="middle" font-size="15" font-weight="700" fill="#22302a">${money0(total)}</text>
      <text x="${cx}" y="104" text-anchor="middle" font-size="11" fill="#5b6b62">spent in Nov</text>
    </svg>
    <ul class="legend">${legend}</ul>
  </div>`;
}

// Six-month income vs spending bars, drawn as inline SVG.
function trendChart() {
  const w = 640, h = 210, pad = 34, max = 8500;
  const bw = 26, gap = 12;
  const bars = MONTHLY_TOTALS.map((m, i) => {
    const x = pad + i * ((w - pad * 2) / MONTHLY_TOTALS.length);
    const ih = (m.income / max) * (h - pad - 30);
    const sh = (m.spending / max) * (h - pad - 30);
    const y = h - 30;
    return `<rect x="${(x).toFixed(0)}" y="${(y - ih).toFixed(0)}" width="${bw}" height="${ih.toFixed(0)}" rx="3" fill="#2e7d5b"/>
      <rect x="${(x + bw + 4).toFixed(0)}" y="${(y - sh).toFixed(0)}" width="${bw}" height="${sh.toFixed(0)}" rx="3" fill="#c2703d"/>
      <text x="${(x + bw).toFixed(0)}" y="${h - 10}" text-anchor="middle" font-size="12" fill="#5b6b62">${m.month}</text>`;
  }).join('');
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" role="img" aria-label="Income versus spending, June to November 2026">
    ${bars}
    <text x="${w - 8}" y="16" text-anchor="end" font-size="12" fill="#5b6b62">green = income, orange = spending</text>
  </svg>`;
}

function transactionRows(list) {
  return list.map((t) => {
    const cat = catOf(t.category);
    const sign = t.kind === 'income' ? '+' : '−';
    const cls = t.kind === 'income' ? 'pos' : 'neg';
    const del = t.kind === 'expense'
      ? `<td><button class="danger" data-delete="${t.id}" type="button">Delete</button></td>` : '<td></td>';
    return `<tr><td>${esc(t.date.slice(5))} Nov</td><td>${esc(t.description)}</td>
      <td><span class="chip">${esc(cat.label)}</span></td>
      <td class="num"><span class="${cls}">${sign}${money(t.amount)}</span></td>${del}</tr>`;
  }).join('');
}

function viewDashboard() {
  const t = totals();
  const byCat = spentByCategory();
  const saved = state.goals.reduce((s, g) => s + g.saved, 0);
  const recent = [...state.transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8);
  const upcoming = state.bills.filter((b) => !b.paid).sort((a, b) => a.due.localeCompare(b.due));
  const dueSoon = upcoming.slice(0, 3);
  const pct = Math.round((t.spent / t.income) * 100);
  app.innerHTML = `
    <h1>November at a glance</h1>
    <p class="lede">Maya and Tom bring home ${money0(t.income)} this month. After ${money0(t.spent)} of spending,
    ${money0(t.left)} is still unspent — enough to cover the bills still due and put money toward the family holiday.</p>
    <section class="cards" aria-label="Month summary">
      <div class="card"><div class="label">Income</div><div class="big">${money0(t.income)}</div><div class="sub">3 paydays in November</div></div>
      <div class="card"><div class="label">Spent so far</div><div class="big">${money0(t.spent)}</div><div class="sub">${pct}% of income</div></div>
      <div class="card"><div class="label">Left to spend</div><div class="big">${money0(t.left)}</div><div class="sub ${t.left >= 0 ? 'good' : 'warn'}">${t.left >= 0 ? 'On track' : 'Over budget'}</div></div>
      <div class="card"><div class="label">Saved in goals</div><div class="big">${money0(saved)}</div><div class="sub">across ${state.goals.length} savings goals</div></div>
    </section>
    <div class="grid2">
      <section class="panel"><h2>Where the money went</h2>${donutChart(byCat)}</section>
      <section class="panel"><h2>Income vs spending — last 6 months</h2>${trendChart()}
        <p class="sub" style="color:var(--ink-soft);font-size:13px;margin:8px 0 0">November is the family's cheapest month so far this half-year: no car repairs and one fewer takeaway week.</p></section>
    </div>
    <div class="grid2">
      <section class="panel"><h2>Recent transactions</h2>
        <table><thead><tr><th>Date</th><th>What</th><th>Category</th><th class="num">Amount</th><th></th></tr></thead>
        <tbody>${transactionRows(recent)}</tbody></table>
        <p style="margin:12px 0 0"><a href="#/transactions">See all ${state.transactions.length} transactions &rarr;</a></p></section>
      <section class="panel"><h2>Bills still to pay</h2>
        ${dueSoon.length ? dueSoon.map((b) => `<div class="bill"><div><div class="name">${esc(b.name)}</div><div class="note">Due ${esc(b.due.slice(5))} Nov &middot; ${esc(b.note)}</div></div><div class="amount">${money(b.amount)}</div></div>`).join('') : '<p>All bills paid — well done.</p>'}
        <p style="margin:12px 0 0"><a href="#/bills">See all bills &rarr;</a></p>
        <div class="tip" style="margin-top:16px"><strong>Tip of the month:</strong> groceries are ${money0(byCat.find((c) => c.id === 'groceries')?.spent || 0)} of a ${money0(720)} budget with a week to go — the Saturday market stall covers the last shop.</div></section>
    </div>`;
}

function viewTransactions() {
  const params = new URLSearchParams(location.hash.split('?')[1] || '');
  const filter = params.get('cat') || 'all';
  const list = [...state.transactions].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
  const shown = filter === 'all' ? list : list.filter((t) => t.category === filter);
  const spent = shown.filter((t) => t.kind === 'expense').reduce((s, t) => s + t.amount, 0);
  app.innerHTML = `
    <h1>Transactions</h1>
    <p class="lede">Every dollar in and out for November 2026 — ${state.transactions.length} entries.
    Add a new one below; it is saved in this browser.</p>
    <form class="inline-form" id="add-form">
      <label>Date<input type="date" name="date" value="2026-11-26" required></label>
      <label>Description<input type="text" name="description" placeholder="e.g. Green Mart shop" required maxlength="80"></label>
      <label>Category<select name="category">${CATEGORIES.map((c) => `<option value="${c.id}">${esc(c.label)}</option>`).join('')}</select></label>
      <label>Amount ($)<input type="number" name="amount" min="0.01" step="0.01" placeholder="0.00" required></label>
      <button type="submit">Add expense</button>
    </form>
    <div class="filter-row">
      <label for="cat-filter"><strong>Filter by category:</strong></label>
      <select id="cat-filter">
        <option value="all">All categories</option>
        ${CATEGORIES.map((c) => `<option value="${c.id}" ${c.id === filter ? 'selected' : ''}>${esc(c.label)}</option>`).join('')}
      </select>
      <span>Showing ${shown.length} &middot; ${money(spent)} spent in this view</span>
    </div>
    <section class="panel"><table>
      <thead><tr><th>Date</th><th>What</th><th>Category</th><th class="num">Amount</th><th></th></tr></thead>
      <tbody>${transactionRows(shown)}</tbody></table></section>
    <p style="margin-top:16px"><button class="ghost small" id="reset-data" type="button">Reset to the family's November figures</button>
    <span style="color:var(--ink-soft);font-size:13px"> Clears your edits and restores the original November data.</span></p>`;
  document.getElementById('reset-data').addEventListener('click', () => {
    try { localStorage.removeItem(STORE_KEY); } catch { /* ignore */ }
    state = seedState();
    saveState(state);
    render();
  });
  document.getElementById('cat-filter').addEventListener('change', (e) => {
    location.hash = '#/transactions' + (e.target.value === 'all' ? '' : '?cat=' + e.target.value);
  });
  document.getElementById('add-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    state.transactions.push({
      id: 't' + Date.now().toString(36),
      date: String(f.get('date')),
      description: String(f.get('description')).trim(),
      category: String(f.get('category')),
      amount: Math.round(Number(f.get('amount')) * 100) / 100,
      kind: 'expense',
    });
    saveState(state);
    render();
  });
}

function viewBudget() {
  const t = totals();
  const rows = state.budgets.map((b) => {
    const cat = catOf(b.category);
    const spent = state.transactions.filter((x) => x.kind === 'expense' && x.category === b.category)
      .reduce((s, x) => s + x.amount, 0);
    const pct = Math.round((spent / b.limit) * 100);
    const left = b.limit - spent;
    const cls = pct >= 100 ? 'over' : pct >= 80 ? 'near' : '';
    const note = pct >= 100 ? `Over by ${money(-left)} — move money from another pot or hold off.`
      : pct >= 80 ? `${money(left)} left — nearly there, spend carefully.`
      : `${money(left)} left of ${money(b.limit)}.`;
    return `<div class="budget-row">
      <div class="budget-head"><span>${esc(cat.label)}</span><span class="left">${money(spent)} / ${money(b.limit)} (${pct}%)</span></div>
      <div class="budget-sub">${note}</div>
      <div class="progress" role="progressbar" aria-valuenow="${Math.min(pct, 100)}" aria-valuemin="0" aria-valuemax="100" aria-label="${esc(cat.label)} budget used"><span class="${cls}" style="width:${Math.min(pct, 100)}%"></span></div>
    </div>`;
  }).join('');
  const totalLimit = state.budgets.reduce((s, b) => s + b.limit, 0);
  const totalPct = Math.round((t.spent / totalLimit) * 100);
  app.innerHTML = `
    <h1>Budget — November 2026</h1>
    <p class="lede">The family plans ${money0(totalLimit)} of spending against ${money0(t.income)} of income,
    keeping ${money0(t.income - totalLimit)} for savings and surprises. ${money0(t.spent)} spent so far (${totalPct}% of the plan).</p>
    <section class="panel">${rows}</section>
    <div class="tip" style="margin-top:16px"><strong>How the Marlowes set it:</strong> housing and utilities are fixed,
    groceries get a weekly envelope of $180, and whatever is left in dining out on the 25th rolls into the holiday goal.</div>`;
}

function viewBills() {
  const unpaid = state.bills.filter((b) => !b.paid).reduce((s, b) => s + b.amount, 0);
  const paid = state.bills.filter((b) => b.paid).reduce((s, b) => s + b.amount, 0);
  const sorted = [...state.bills].sort((a, b) => a.due.localeCompare(b.due));
  const today = '2026-11-26';
  app.innerHTML = `
    <h1>Bills</h1>
    <p class="lede">Eight regular bills this month. ${money(unpaid)} still to pay, ${money(paid)} already paid.
    Tap a bill to mark it paid — or unpaid again if it was a mistake.</p>
    <section class="cards" style="grid-template-columns:repeat(3,1fr)">
      <div class="card"><div class="label">Still to pay</div><div class="big">${money(unpaid)}</div><div class="sub">${state.bills.filter((b) => !b.paid).length} bills</div></div>
      <div class="card"><div class="label">Already paid</div><div class="big">${money(paid)}</div><div class="sub">${state.bills.filter((b) => b.paid).length} bills</div></div>
      <div class="card"><div class="label">Next due</div><div class="big">${(() => { const d = state.bills.filter((b) => !b.paid).sort((a, b) => a.due.localeCompare(b.due))[0]?.due; return d ? d.slice(8) + ' Nov' : '—'; })()}</div><div class="sub">November</div></div>
    </section>
    <section class="panel">${sorted.map((b) => {
      const overdue = !b.paid && b.due < today;
      const chip = b.paid ? '<span class="chip paid">Paid</span>'
        : overdue ? '<span class="chip overdue">Overdue</span>' : '<span class="chip due">Due ' + esc(b.due.slice(5)) + ' Nov</span>';
      return `<div class="bill"><div><div class="name">${esc(b.name)} ${chip}</div><div class="note">Due ${esc(b.due)} &middot; ${esc(b.note)}</div></div>
        <div style="display:flex;gap:12px;align-items:center"><span class="amount">${money(b.amount)}</span>
        <button class="${b.paid ? 'ghost' : ''} small" data-bill="${b.id}" type="button">${b.paid ? 'Mark unpaid' : 'Mark paid'}</button></div></div>`;
    }).join('')}</section>`;
}

function viewGoals() {
  const saved = state.goals.reduce((s, g) => s + g.saved, 0);
  const target = state.goals.reduce((s, g) => s + g.target, 0);
  const pct = Math.round((saved / target) * 100);
  app.innerHTML = `
    <h1>Savings goals</h1>
    <p class="lede">${money0(saved)} saved toward ${money0(target)} of goals (${pct}%). Add a contribution to any goal —
    it updates the progress bar straight away and is saved in this browser.</p>
    <section class="panel">${state.goals.map((g) => {
      const p = Math.round((g.saved / g.target) * 100);
      const left = g.target - g.saved;
      return `<div class="goal">
        <div class="goal-head"><span>${esc(g.name)}</span><span>${money(g.saved)} / ${money(g.target)} (${p}%)</span></div>
        <p class="goal-note">${esc(g.note)} ${left > 0 ? `${money(left)} still to go.` : 'Goal reached!'}</p>
        <div class="progress" role="progressbar" aria-valuenow="${p}" aria-valuemin="0" aria-valuemax="100" aria-label="${esc(g.name)} progress"><span style="width:${Math.min(p, 100)}%"></span></div>
        <div class="goal-actions">
          <label>Add $ <input type="number" min="1" step="1" value="25" data-amount-for="${g.id}" aria-label="Amount to add to ${esc(g.name)}"></label>
          <button class="small" data-contribute="${g.id}" type="button">Add to goal</button>
          ${left > 0 ? `<button class="ghost small" data-contribute-all="${g.id}" type="button">Add ${money(left)} to finish it</button>` : ''}
        </div>
      </div>`;
    }).join('')}</section>
    <div class="tip" style="margin-top:16px"><strong>The family rule:</strong> on payday, $150 goes straight to the emergency fund before anything else is spent.
    The holiday goal gets whatever is left in dining out at the end of the month.</div>`;
}

const ROUTES = {
  '': viewDashboard,
  'transactions': viewTransactions,
  'budget': viewBudget,
  'bills': viewBills,
  'goals': viewGoals,
};

export function render() {
  const route = (location.hash.replace(/^#\/?/, '').split('?')[0] || '');
  document.querySelectorAll('.nav a').forEach((a) => {
    a.classList.toggle('active', (a.dataset.route || '') === route);
  });
  (ROUTES[route] || viewDashboard)();
  window.scrollTo(0, 0);
}

app.addEventListener('click', (e) => {
  const del = e.target.closest('[data-delete]');
  if (del) {
    state.transactions = state.transactions.filter((t) => t.id !== del.dataset.delete);
    saveState(state);
    render();
    return;
  }
  const billBtn = e.target.closest('[data-bill]');
  if (billBtn) {
    const bill = state.bills.find((b) => b.id === billBtn.dataset.bill);
    if (bill) { bill.paid = !bill.paid; saveState(state); render(); }
    return;
  }
  const add = e.target.closest('[data-contribute]');
  if (add) {
    const goal = state.goals.find((g) => g.id === add.dataset.contribute);
    const input = app.querySelector(`[data-amount-for="${add.dataset.contribute}"]`);
    const amount = Math.max(0, Math.round(Number(input?.value || 0)));
    if (goal && amount > 0) { goal.saved += amount; saveState(state); render(); }
    return;
  }
  const finish = e.target.closest('[data-contribute-all]');
  if (finish) {
    const goal = state.goals.find((g) => g.id === finish.dataset.contributeAll);
    if (goal) { goal.saved = goal.target; saveState(state); render(); }
  }
});
