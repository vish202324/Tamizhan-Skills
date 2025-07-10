let students = JSON.parse(localStorage.getItem("students")) || [];
let editIndex = -1;

const form = document.getElementById("student-form");
const searchInput = document.getElementById("search");
const studentList = document.getElementById("student-list");

// Render on load
window.onload = renderStudents;

// Save to localStorage
function saveToLocal() {
  localStorage.setItem("students", JSON.stringify(students));
}

// Add or update student
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const student = {
    name: document.getElementById("name").value.trim(),
    regNo: document.getElementById("regNo").value.trim(),
    dept: document.getElementById("dept").value.trim(),
    year: document.getElementById("year").value.trim(),
    marks: document.getElementById("marks").value.trim(),
  };

  if (Object.values(student).some((value) => value === ""))
    return alert("Fill all fields!");

  if (editIndex === -1) {
    students.push(student);
  } else {
    students[editIndex] = student;
    editIndex = -1;
  }

  form.reset();
  saveToLocal();
  renderStudents();
});

// Render all students
function renderStudents() {
  studentList.innerHTML = "";

  const filtered = students.filter((s) => {
    const term = searchInput.value.toLowerCase();
    return (
      s.name.toLowerCase().includes(term) ||
      s.regNo.toLowerCase().includes(term)
    );
  });

  filtered.forEach((student, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${student.name}</td>
      <td>${student.regNo}</td>
      <td>${student.dept}</td>
      <td>${student.year}</td>
      <td>${student.marks}</td>
      <td class="actions">
        <button class="edit-btn" onclick="editStudent(${index})">Edit</button>
        <button class="delete-btn" onclick="deleteStudent(${index})">Delete</button>
      </td>
    `;

    studentList.appendChild(row);
  });
}

// Edit student
function editStudent(index) {
  const student = students[index];
  document.getElementById("name").value = student.name;
  document.getElementById("regNo").value = student.regNo;
  document.getElementById("dept").value = student.dept;
  document.getElementById("year").value = student.year;
  document.getElementById("marks").value = student.marks;
  editIndex = index;
}

// Delete student
function deleteStudent(index) {
  if (confirm("Are you sure you want to delete this student?")) {
    students.splice(index, 1);
    saveToLocal();
    renderStudents();
  }
}

// Live search
searchInput.addEventListener("input", renderStudents);
