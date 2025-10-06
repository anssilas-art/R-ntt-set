// --- Tab Navigation ---
const tabs = document.querySelectorAll(".tab-button");
const contents = document.querySelectorAll(".tab-content");

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    contents.forEach(c => c.classList.remove("active"));
    tabs.forEach(t => t.classList.remove("active"));
    document.getElementById(tab.dataset.tab).classList.add("active");
    tab.classList.add("active");
  });
});

// --- Gallery ---
const imageInput = document.getElementById("imageInput");
const galleryContainer = document.getElementById("galleryContainer");
let galleryImages = JSON.parse(localStorage.getItem("gallery")) || [];

function renderGallery() {
  galleryContainer.innerHTML = "";
  galleryImages.forEach((src, i) => {
    const img = document.createElement("img");
    img.src = src;
    img.title = "Click to remove";
    img.addEventListener("click", () => {
      galleryImages.splice(i, 1);
      localStorage.setItem("gallery", JSON.stringify(galleryImages));
      renderGallery();
    });
    galleryContainer.appendChild(img);
  });
}

imageInput.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    galleryImages.push(reader.result);
    localStorage.setItem("gallery", JSON.stringify(galleryImages));
    renderGallery();
  };
  reader.readAsDataURL(file);
});

renderGallery();

// --- Competitions ---
const compForm = document.getElementById("competitionForm");
const compListDiv = document.getElementById("competitionList");
let competitions = JSON.parse(localStorage.getItem("competitions")) || [];

function renderCompetitions() {
  compListDiv.innerHTML = "";
  competitions.forEach((c, i) => {
    const div = document.createElement("div");
    div.className = "card";
    const span = document.createElement("span");
    span.textContent = `${c.name} — ${c.winner} (${c.points} pts)`;
    div.appendChild(span);

    const btnContainer = document.createElement("div");
    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️";
    editBtn.addEventListener("click", () => editCompetition(i));
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️";
    deleteBtn.addEventListener("click", () => deleteCompetition(i));

    btnContainer.appendChild(editBtn);
    btnContainer.appendChild(deleteBtn);
    div.appendChild(btn
