document.addEventListener("DOMContentLoaded", () => {
    const addPlayerBtn = document.getElementById("add-player");
    const submitPlayersBtn = document.getElementById("submit-players");
    const resetBtn = document.getElementById("reset-game");
    const playersField = document.getElementById("players");
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
  
    function savePlayers(players) {
      localStorage.setItem(STORAGE_KEYS.players, JSON.stringify(players));
    }
  
    function isLocked() {
      return localStorage.getItem(STORAGE_KEYS.locked) === "true";
    }
  
    function setLocked(val) {
      localStorage.setItem(STORAGE_KEYS.locked, String(val));
    }
  
    function resetGame() {
      Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
      setStatus("Game reset.");
      renderPlayers();
    }
  
    function validatePlayers(players) {
      for (const p of players) {
        const name = (p.name ?? "").trim();
        const guess = Number(p.guess);
  
        if (!name) return "Each player needs a name.";
        if (!Number.isFinite(guess)) return "Each player needs a numeric guess.";
        if (guess < 0) return "Guesses must be 0 or higher.";
      }
      return null;
    }
  
    function createPlayerRow(index, player) {
      const fieldset = document.createElement("fieldset");
      const legend = document.createElement("legend");
      const nameInput = document.createElement("input");
      const guessInput = document.createElement("input");
  
      fieldset.classList.add("new-player");
      legend.textContent = `Player ${index + 1}`;
  
      nameInput.classList.add("player-name");
      nameInput.type = "text";
      nameInput.placeholder = "Name";
      nameInput.value = player.name ?? "";
  
      guessInput.classList.add("player-guess");
      guessInput.type = "number";
      guessInput.placeholder = "#";
      guessInput.value = player.guess ?? "";
      guessInput.min = 0;
      guessInput.inputMode = "numeric";
  
      const locked = isLocked();
      nameInput.disabled = locked;
      guessInput.disabled = locked;
  
      nameInput.addEventListener("input", () => {
        const players = getPlayers();
        players[index].name = nameInput.value;
        savePlayers(players);
      });
  
      guessInput.addEventListener("input", () => {
        const players = getPlayers();
        players[index].guess = guessInput.value;
        savePlayers(players);
      });
  
      playersField.append(fieldset);
      fieldset.append(legend, nameInput, guessInput);
    }
  
    function renderPlayers() {
      const players = getPlayers();
      playersField.innerHTML = "";
  
      if (players.length === 0) {
        players.push({ name: "", guess: "" });
        savePlayers(players);
      }
  
      players.forEach((p, i) => createPlayerRow(i, p));
  
      setStatus(isLocked()
        ? "Players submitted (locked)."
        : ""
      );
    }
  
    addPlayerBtn.addEventListener("click", () => {
      if (isLocked()) return setStatus("Players are locked. Reset game to edit.");
  
      const players = getPlayers();
      players.push({ name: "", guess: "" });
      savePlayers(players);
      renderPlayers();
    });
  
    submitPlayersBtn.addEventListener("click", () => {
      const players = getPlayers();
      const err = validatePlayers(players);
      if (err) return setStatus(err);
  
      setLocked(true);
  
      localStorage.setItem(STORAGE_KEYS.count, "0");
      localStorage.removeItem(STORAGE_KEYS.finalTotal);
      localStorage.removeItem(STORAGE_KEYS.winner);
  
      setStatus("Players submitted. Opening counter…");
  
      // ✅ WEB preview (StackBlitz): open counter.html in a new tab
      window.open("counter.html", "_blank");
  
      renderPlayers();
    });
  
    resetBtn.addEventListener("click", resetGame);
  
    renderPlayers();
  });
  