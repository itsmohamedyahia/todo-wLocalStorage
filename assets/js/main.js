//=================================
// Select the required DOM elements
const [col_NS, col_IP, col_Comp] = document.querySelectorAll(
  ".notStarted, .inProgress, .completed"
);
export const addBtn_NS = col_NS.querySelector("button");
export const addBtn_IP = col_IP.querySelector("button ");
export const addBtn_Comp = col_Comp.querySelector("button");
const dropArea = document.querySelectorAll(".col-container > .col");
let drag = null;
let taskIncrementer = 1;
// ==============================
// Add a task to a column

function addBtnHandler(loc) {
  const card = createTaskElement();
  loc.before(card, loc);
  dragCard();
  // Update the task's data when the input field value is changed
  const inputField = card.querySelector("#input-card");
  inputField.addEventListener("input", function (e) {
    inputField.textContent = e.target.value;
    inputField.value = e.target.value;
  });
  // Store the task's data when the input field loses focus
  inputField.addEventListener("blur", function (e) {
    inputField.setAttribute("readonly", true);
    storeData(loc);
  });
  // Enable editing the task's data when the edit icon is clicked
  const iconEdit = card.querySelector(".edit");
  iconEdit.addEventListener("click", function () {
    inputField.removeAttribute("readonly");
    editCard(card.parentElement, card, inputField);
  });
  // Delete the task's data when the delete icon is clicked
  const iconRemove = card.querySelector(".remove");
  delCard(card.parentElement, card, inputField);
}
// ===============================================
// Add drag and drop functionality to the tasks
export function dragCard() {
  let cards = document.querySelectorAll(".card");
  cards.forEach((item) => {
    item.addEventListener("dragstart", (event) => {
      item.style.opacity = ".5";
      drag = item;
    });
    item.addEventListener("dragend", (event) => {
      item.style.opacity = "1";
      drag = null;
    });
    dropArea.forEach((area) => {
      area.addEventListener("dragover", (event) => {
        event.preventDefault();
      });

      area.addEventListener("drop", (event) => {
        area.lastElementChild.before(drag, area.lastElementChild);
        renderEv(drag);
        dragUpdate();
      });
    });
  });
}

// =================================
// store data in local storage based on the item's location.
function storeData(loc) {
  const listNames = {
    notStarted: [],
    inProgress: [],
    completed: [],
  };
  Object.keys(listNames).forEach((listName) => {
    const listContent = JSON.parse(localStorage.getItem(listName));
    if (listContent !== null) {
      listNames[listName] = listContent;
    }
  });
  // Based on the item's location, add the item to the appropriate array and store it in local storage.
  const listName = loc.parentElement.classList[0];
  const item = loc.previousElementSibling.querySelector("input");
  if (item && item.value.trim().length > 0) {
    listNames[listName].push(item.value);
    localStorage.setItem(listName, JSON.stringify(listNames[listName]));
  }
}

//=================================================================
// UPDATE THE DATA IN LOCAL STORAGE AFTER A DRAG AND DROP OPERATION.
function dragUpdate() {
  const lists = {
    notStarted: [],
    inProgress: [],
    completed: [],
  };

  document.querySelectorAll(".col").forEach((list) => {
    const cards = list.querySelectorAll(".card input");
    const listName = list.classList[0];

    cards.forEach((item) => {
      if (item && item.value.trim().length > 0) {
        lists[listName].push(item.value);
      }
    });

    localStorage.setItem(listName, JSON.stringify(lists[listName]));
  });
}
//=====================================
// DISPLAY DATA UPON WINDOW LOAD
window.onload = () => {
  renderData();
};

// Retrieves data from local storage and renders it on the screen.
function renderData() {
  const notStartedContent = JSON.parse(localStorage.getItem("notStarted"));
  const inProgressContent = JSON.parse(localStorage.getItem("inProgress"));
  const completeContent = JSON.parse(localStorage.getItem("completed"));
  renderDisplay(notStartedContent, addBtn_NS);
  renderDisplay(inProgressContent, addBtn_IP);
  renderDisplay(completeContent, addBtn_Comp);
  // Set all input fields as readonly
  const inputFields = document.querySelectorAll(".card input");
  inputFields.forEach((input) => {
    input.setAttribute("readonly", true);
  });
  dragCard();
}
//======================================
// RENDERS A TASK ON THE SCREEN

function createCard(task) {
  const card = createTaskElement();
  const inputField = card.querySelector("#input-card");
  inputField.value = task;
  return { card, inputField };
}

export function createTaskElement() {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <input id="input-card" type="text" placeholder="Task ${setTaskNom()}" draggable="true"/>
    <ion-icon class="edit" name="create-outline"></ion-icon>
    <ion-icon class="trash remove" name="trash-outline"></ion-icon>
  `;
  return card;
}

function setTaskNom() {
  return taskIncrementer++;
}

function renderDisplay(target, append) {
  if (target !== null) {
    target.forEach((task) => {
      if (task) {
        const { card, inputField } = createCard(task);
        append.before(card, append);
        renderEv(card);
      }
    });
  }
}

// ===============================
// RENDER EVENTS FOR EACH ELEMENT IN LOCAL STORAGE
function renderEv(card) {
  const inputField = card.querySelector("#input-card");
  card.addEventListener("blur", (e) => {
    inputField.setAttribute("readonly", true);
    storeData(loc);
  });
  const iconEdit = card.querySelector(".edit");
  iconEdit.addEventListener("click", () => {
    inputField.removeAttribute("readonly");
  });
  delCard(card.parentElement, card, inputField);
  editCard(card.parentElement, card, inputField);
}
// ===============================
// DELETES AN ITEM FROM LOCAL STORAGE AND THE DOM
function delCard(loc, card, inputField) {
  const iconRemove = card.querySelector(".remove");
  const listName = loc.classList[0];

  iconRemove.addEventListener("click", function () {
    let listItems = JSON.parse(localStorage.getItem(listName));
    listItems = listItems.filter((item) => item !== inputField.value);
    localStorage.setItem(listName, JSON.stringify(listItems));
    card.remove();
  });
}

// ===============================
// UPDATE LOCAL STORAGE
function updateCard(loc, oldTxt, newTxt) {
  const listName = loc.classList[0];
  let listItems = JSON.parse(localStorage.getItem(listName));
  listItems = listItems.map((item) => (item === oldTxt ? newTxt : item));
  localStorage.setItem(listName, JSON.stringify(listItems));
}

function editCard(loc, card, inputField) {
  const oldTxt = inputField.value;

  inputField.addEventListener("blur", function (e) {
    const newTxt = inputField.value;
    updateCard(loc, oldTxt, newTxt);
  });
}

// ============================================
// EVENT LISTENERS
addBtn_NS.addEventListener(
  "click",
  function () {
    addBtnHandler(addBtn_NS);
  },
  false
);
addBtn_IP.addEventListener(
  "click",
  function () {
    addBtnHandler(addBtn_IP);
  },
  false
);
addBtn_Comp.addEventListener(
  "click",
  function () {
    addBtnHandler(addBtn_Comp);
  },
  false
);
