const addPlayerBtn = document.getElementById("add-player");
const playersField = document.getElementById("players");

addPlayerBtn.addEventListener("click", addPlayer)
    
function addPlayer(){
    const fieldset = document.createElement("fieldset");
    const nameInput = document.createElement("input");
    const guessInput = document.createElement("input");
    const legend = document.createElement("legend");

    fieldset.classList.add("new-player");
    nameInput.classList.add("player-name");
    guessInput.classList.add("player-guess");
    legend.textContent = "Player"

    nameInput.type = "text";
    nameInput.placeholder = "Name"
    guessInput.type = "number";

    playersField.append(fieldset);
    fieldset.append(nameInput);
    fieldset.append(guessInput);
    fieldset.append(legend);
}