let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filterType = "all"; // all, completed, pending

const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");

window.onload = () => {
  renderTasks();
};

// Add task
function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;

  const newTask = {
    id: Date.now(),
    text,
    completed: false,
    createdAt: new Date().toLocaleString(),
  };

  tasks.push(newTask);
  taskInput.value = "";
  saveTasks();
  renderTasks();
}

// Save to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Render tasks
function renderTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks;
  if (filterType === "completed") {
    filteredTasks = tasks.filter((t) => t.completed);
  } else if (filterType === "pending") {
    filteredTasks = tasks.filter((t) => !t.completed);
  }

  filteredTasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = "task-item";

    const left = document.createElement("div");
    left.className = "task-left" + (task.completed ? " completed" : "");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.onchange = () => toggleTask(task.id);

    const span = document.createElement("span");
    span.className = "text";
    span.innerText = task.text;

    const timestamp = document.createElement("div");
    timestamp.className = "timestamp";
    timestamp.innerText = task.createdAt;

    left.appendChild(checkbox);
    left.appendChild(span);
    left.appendChild(timestamp);

    const right = document.createElement("div");
    right.className = "task-right";

    const editIcon = document.createElement("i");
    editIcon.className = "fas fa-edit edit";
    editIcon.title = "Edit";
    editIcon.onclick = () => editTask(task.id);

    const deleteIcon = document.createElement("i");
    deleteIcon.className = "fas fa-trash delete";
    deleteIcon.title = "Delete";
    deleteIcon.onclick = () => deleteTask(task.id);

    right.appendChild(editIcon);
    right.appendChild(deleteIcon);

    li.appendChild(left);
    li.appendChild(right);

    taskList.appendChild(li);
  });
}

// Toggle complete
function toggleTask(id) {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  renderTasks();
}

// Delete
function deleteTask(id) {
  if (confirm("Are you sure you want to delete this task?")) {
    tasks = tasks.filter((task) => task.id !== id);
    saveTasks();
    renderTasks();
  }
}

// Edit
function editTask(id) {
  const task = tasks.find((t) => t.id === id);
  const newText = prompt("Edit Task", task.text);
  if (newText && newText.trim() !== "") {
    task.text = newText.trim();
    saveTasks();
    renderTasks();
  }
}

// Filter
function filterTasks(type) {
  filterType = type;
  document
    .querySelectorAll(".filter-section button")
    .forEach((btn) => btn.classList.remove("active"));
  event.target.classList.add("active");
  renderTasks();
}

// Add task on Enter
taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTask();
  }
});
