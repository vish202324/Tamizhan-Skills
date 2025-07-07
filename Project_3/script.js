function addEducation() {
  const container = document.getElementById("education-section");
  const group = document.createElement("div");
  group.className = "edu-group";
  group.innerHTML = `
    <input type="text" placeholder="Degree" class="degree" />
    <input type="text" placeholder="Institute" class="institute" />
    <input type="text" placeholder="Year" class="year" />
    <input type="text" placeholder="CGPA / %" class="score" />
  `;
  container.appendChild(group);
}

function addExperience() {
  const container = document.getElementById("experience-section");
  const group = document.createElement("div");
  group.className = "exp-group";
  group.innerHTML = `
    <input type="text" placeholder="Job Title" class="role" />
    <input type="text" placeholder="Company" class="company" />
    <input type="text" placeholder="Duration" class="duration" />
    <textarea placeholder="Responsibilities" class="desc"></textarea>
  `;
  container.appendChild(group);
}

function addProject() {
  const container = document.getElementById("projects-section");
  const group = document.createElement("div");
  group.className = "project-group";
  group.innerHTML = `
    <input type="text" placeholder="Project Title" class="project-title" />
    <textarea placeholder="Project Description" class="project-desc"></textarea>
    <input type="text" placeholder="Project Link (optional)" class="project-link" />
  `;
  container.appendChild(group);
}

function addCert() {
  const container = document.getElementById("cert-section");
  const group = document.createElement("div");
  group.className = "cert-group";
  group.innerHTML = `
    <input type="text" placeholder="Certificate Name" class="cert-name" />
    <input type="text" placeholder="Issuer" class="cert-issuer" />
    <input type="text" placeholder="Year" class="cert-year" />
  `;
  container.appendChild(group);
}

function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setProperties({
    title: "Curriculum Vitae",
  });

  // Personal Info
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text(document.getElementById("name").value.toUpperCase(), 20, 20);

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Email: ${document.getElementById("email").value}`, 20, 30);
  doc.text(`Phone: ${document.getElementById("phone").value}`, 20, 38);
  doc.text(`Location: ${document.getElementById("location").value}`, 20, 46);

  function cleanURL(url) {
    return url.startsWith("http") ? url : `https://${url}`;
  }

  const linkedin = cleanURL(document.getElementById("linkedin").value);
  const github = cleanURL(document.getElementById("github").value);
  doc.setTextColor(0, 0, 255);
  doc.textWithLink("LinkedIn", 20, 54, { url: linkedin });
  doc.textWithLink("GitHub", 20, 62, { url: github });
  doc.setTextColor(0, 0, 0);

  // Summary
  let y = 70;
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Career Objective:", 20, y);
  y += 6;
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  const summaryLines = doc.splitTextToSize(
    document.getElementById("summary").value,
    170
  );
  doc.text(summaryLines, 20, y);
  y += summaryLines.length * 6 + 10;

  // Education Table
  const eduData = [...document.querySelectorAll(".edu-group")].map((group) => [
    group.querySelector(".degree").value,
    group.querySelector(".institute").value,
    group.querySelector(".year").value,
    group.querySelector(".score").value,
  ]);
  doc.setFont("helvetica", "bold");
  doc.text("Education:", 20, y);
  doc.autoTable({
    head: [["Degree", "Institute", "Year", "Score"]],
    body: eduData,
    startY: y + 5,
  });
  y = doc.lastAutoTable.finalY + 10;

  // Experience Table
  const expData = [...document.querySelectorAll(".exp-group")].map((group) => [
    group.querySelector(".role").value,
    group.querySelector(".company").value,
    group.querySelector(".duration").value,
    group.querySelector(".desc").value,
  ]);
  doc.text("Experience:", 20, y);
  doc.autoTable({
    head: [["Role", "Company", "Duration", "Responsibilities"]],
    body: expData,
    startY: y + 5,
  });
  y = doc.lastAutoTable.finalY + 10;

  // Projects
  const projData = [...document.querySelectorAll(".project-group")].map(
    (group) => [
      group.querySelector(".project-title").value,
      group.querySelector(".project-desc").value,
      group.querySelector(".project-link").value,
    ]
  );
  doc.text("Projects:", 20, y);
  doc.autoTable({
    head: [["Title", "Description", "Link"]],
    body: projData,
    startY: y + 5,
  });
  y = doc.lastAutoTable.finalY + 10;

  // Certifications
  const certData = [...document.querySelectorAll(".cert-group")].map(
    (group) => [
      group.querySelector(".cert-name").value,
      group.querySelector(".cert-issuer").value,
      group.querySelector(".cert-year").value,
    ]
  );
  doc.text("Certifications:", 20, y);
  doc.autoTable({
    head: [["Certificate", "Issuer", "Year"]],
    body: certData,
    startY: y + 5,
  });

  // Declaration Section
  y = doc.lastAutoTable.finalY + 15;
  const fullName = document.getElementById("name").value;
  const today = new Date().toLocaleDateString();

  doc.setFont("helvetica", "bold");
  doc.text("Declaration:", 20, y);

  doc.setFont("helvetica", "normal");
  const declarationText = `I, ${fullName}, hereby declare that the above information is true to the best of my knowledge and belief.`;
  const declarationLines = doc.splitTextToSize(declarationText, 170);
  doc.text(declarationLines, 20, y + 6);

  // Signature Block
  doc.setFont("helvetica", "normal");
  doc.text(`Date: ${today}`, 20, y + 30);
  doc.text(`Signature:`, 160, y + 30);
  doc.text(fullName, 160, y + 36);

  doc.save("My_Resume.pdf");
}
