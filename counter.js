// counter.js
const countEl = document.getElementById("count");
const plusOneBtn = document.getElementById("plus-one");
const undoBtn = document.getElementById("undo");
const submitTotalBtn = document.getElementById("submit-total");
const resetBtn = document.getElementById("reset-game");
const resultEl = document.getElementById("result");
const statusEl = document.getElementById("status");

const STORAGE_KEYS = {
  players: "players",
  locked: "playersLocked",
  count: "count",
  finalTotal: "finalTotal",
  winner: "winner",
};

function setStatus(msg) {
  statusEl.textContent = msg || "";
}

function getPlayers() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.players)) || [];
}

function isLocked() {
  return localStorage.getItem(STORAGE_KEYS.locked) === "true";
}

function getCount() {
  const raw = localStorage.getItem(STORAGE_KEYS.count);
  const n = Number(raw);
  return Number.isFinite(n) ? n : 0;
}

function setCount(n) {
  localStorage.setItem(STORAGE_KEYS.count, String(n));
  countEl.textContent = String(n);
}

function resetGame() {
  Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
  setStatus("Game reset.");
  setCount(0);
  resultEl.hidden = true;
  resultEl.innerHTML = "";
}

function computeWinner(players, total) {
  // Price is Right rules: closest WITHOUT going over.
  const eligible = players
    .map((p) => ({
      name: (p.name ?? "").trim(),
      guess: Number(p.guess),
    }))
    .filter((p) => p.name && Number.isFinite(p.guess) && p.guess <= total);

  if (eligible.length === 0) {
    return { type: "none", winners: [], total };
  }

  const bestGuess = Math.max(...eligible.map((p) => p.guess));
  const winners = eligible.filter((p) => p.guess === bestGuess);

  return winners.length > 1
    ? { type: "tie", winners, total }
    : { type: "single", winners, total };
}

function renderResult(outcome) {
  resultEl.hidden = false;

  if (outcome.type === "none") {
    resultEl.innerHTML = `
      <h2>No Winner</h2>
      <div class="line">Total: <strong>${outcome.total}</strong></div>
      <div class="line">Everyone went over the total.</div>
    `;
    return;
  }

  if (outcome.type === "tie") {
    const lines = outcome.winners
      .map((w) => `<div class="line">🏁 ${w.name} — Guess: <strong>${w.guess}</strong></div>`)
      .join("");

    resultEl.innerHTML = `
      <h2>Tie!</h2>
      <div class="line">Total: <strong>${outcome.total}</strong></div>
      ${lines}
    `;
    return;
  }

  const w = outcome.winners[0];
  resultEl.innerHTML = `
    <h2>Winner</h2>
    <div class="line">Total: <strong>${outcome.total}</strong></div>
    <div class="line">🏆 ${w.name} — Guess: <strong>${w.guess}</strong></div>
  `;
}

function init() {
  if (!isLocked()) {
    setStatus("Players not submitted yet. Go to the Add Players page first.");
  } else {
    setStatus("");
  }

  setCount(getCount());

  const finalTotalRaw = localStorage.getItem(STORAGE_KEYS.finalTotal);
  const finalTotal = Number(finalTotalRaw);
  if (Number.isFinite(finalTotalRaw && finalTotal)) {
    // if already submitted, show result
    const outcome = JSON.parse(localStorage.getItem(STORAGE_KEYS.winner) || "null");
    if (outcome) renderResult(outcome);
  }
}

plusOneBtn.addEventListener("click", () => {
  if (!isLocked()) return setStatus("Submit players first.");
  setStatus("");
  setCount(getCount() + 1);
});

undoBtn.addEventListener("click", () => {
  if (!isLocked()) return setStatus("Submit players first.");
  setStatus("");
  setCount(Math.max(0, getCount() - 1));
});

submitTotalBtn.addEventListener("click", () => {
  if (!isLocked()) return setStatus("Submit players first.");

  const total = getCount();
  const players = getPlayers();

  if (!players.length) {
    setStatus("No players found. Go back and add players.");
    return;
  }

  const outcome = computeWinner(players, total);

  localStorage.setItem(STORAGE_KEYS.finalTotal, String(total));
  localStorage.setItem(STORAGE_KEYS.winner, JSON.stringify(outcome));

  setStatus("Total submitted.");
  renderResult(outcome);
});

resetBtn.addEventListener("click", resetGame);

document.addEventListener("DOMContentLoaded", init);
init();
