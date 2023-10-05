function dragstart_handler (ev){
    console.log("dragstart");
    ev.dataTransfer.setData("text/plain", ev.target.id);
    ev.dataTransfer.dropEffect = "move";
}
function dragover_handler (ev) {
    console.log("dragOver");
    ev.preventDefault();
}
function drop_handler (ev) {
    console.log("drag");
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text/plain");
    const store = document.getElementById(data);
    const target = ev.target;

    if (isAdjacent(store, target) && target.classList.contains("empty")) {
        target.innerText = store.innerText;
        target.classList.remove("empty");
        store.innerText = "";
        store.classList.add("empty");
        moveCount++;
        console.log(moveCount)
        moveCounter.textContent = moveCount;

        if (isSolved()) {
            displayWinPopup(); 
            clearInterval(timer);   
        }
    }
}
function dragend_handler (ev)  {
    console.log("dragEnd");
    ev.dataTransfer.clearData();
    setDroppable();
    setDraggable();
}

const blocks = document.querySelectorAll('.block');
const letters = ["A", "B", "C", "D", "E", "F", "G", "H", ""];

function setUp() {
    fillGrid(blocks, letters);
    setId(blocks);
    setDroppable();
    setDraggable();
}
const state = {};
state.content = letters;

function setDroppable () {
    blocks.forEach((item, i) => {
        if (!item.innerText) {
            item.setAttribute("ondrop", "drop_handler(event);");
            item.setAttribute("ondragover", "dragover_handler(event);");
            item.classList.add("empty");
        }
    });
}
function setDraggable () {
    blocks.forEach(item => {
        item.setAttribute("draggable", "true");
        item.setAttribute("ondragstart", "dragstart_handler(event)");
        item.setAttribute("ondragend", "dragend_handler(event)");

    });
}
function setId  (items) {
    for (let i = 0; i < items.length; i++) {
        items[i].setAttribute("id", `block${i}`);
    }
}
function fillGrid(items, letters) {
    let shuffled = shuffle(letters);
    items.forEach((item, i) => {
        item.innerText = shuffled[i];
    });
}
function shuffle (arr){
    const copy = [...arr];
    for (let i = 0; i < copy.length; i++) {
        let j = parseInt(Math.random() * copy.length);
        let temp = copy[i];
        copy[i] = copy[j];
        copy[j] = temp;
    }
    return copy;
}

let moveCount = 0;
const moveCounter = document.querySelector("#movenum");
 
function isAdjacent (bl1, bl2) {
    if (bl1 && bl2) {
        const index1 = Array.from(bl1.parentElement.children).indexOf(bl1);
        const index2 = Array.from(bl2.parentElement.children).indexOf(bl2);
        const diff = Math.abs(index1 - index2);
        console.log("checking adjacent diff", diff)
        return diff === 1 || diff === 3;
    }
    return false;
}

setUp();

const modalButton = document.getElementById("modal-start-button");
const startGameModal = document.getElementById("startGameModal");
modalButton.addEventListener("click", () => {
    startGameModal.style.display = "none";
});

let timer;
let sec = 0;
let min = 0;
const timecount = document.getElementById("timecount");

function startTimer() {
    timer = setInterval(() => {
        sec++;
        if (sec === 60) {
            sec = 0;
            min++;
        }
        const formattedTime = `${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`;
        timecount.textContent = formattedTime;
    }, 1000);
}

modalButton.addEventListener("click", () => {
    startGameModal.style.display = "none";
    startTimer();
});

function isSolved() {
    const blocks = document.querySelectorAll('.block');
    for (let i = 0; i < blocks.length; i++) {
        if (blocks[i].innerText !== letters[i]) {
            return false;
        }
    }
    return true;
}
function displayWinPopup  () {
    const winPopup = document.getElementById("winPopup");
    const winTime = document.getElementById("winTime");
    const formattedTime = `${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`;
    winTime.textContent = formattedTime;
    const winMove=document.getElementById("winMove");
    winMove.textContent=moveCount;
    winPopup.style.display = "block";
}

