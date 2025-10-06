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
  galleryImages.forEach((src, index) => {
    const img = document.createElement("img");
    img.src = src;
    img.title = "Click to remove";
    img.addEventListener("click", () => {
      galleryImages.splice(index, 1);
      localStorage.setItem("gallery", JSON.stringify(galleryImages));
      renderGallery();
    });
    galleryContainer.appendChild(img);
  });
}

imageInput.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) {
    return;
  }
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
    div.innerHTML = `
      <span>${c.name} — ${c.winner} (${c.points} pts)</span>
      <div>
        <button onclick="editCompetition(${i})">✏️</button>
        <button onclick="deleteCompetition(${i})">🗑️</button>
      </div>`;
    compListDiv.appendChild(div);
  });
  updateTopScores();
}

compForm.addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("compName").value.trim();
  const winner = document.getElementById("compWinner").value.trim();
  const points = document.getElementById("compPoints").value;
  if (!name || !winner || !points) return;

  const existing = competitions.findIndex(c => c.name === name);
  if (existing >= 0) competitions[existing] = { name, winner, points };
  else competitions.push({ name, winner, points });

  localStorage.setItem("competitions", JSON.stringify(competitions));
  compForm.reset();
  renderCompetitions();
});

function editCompetition(i) {
  const c = competitions[i];
  document.getElementById("compName").value = c.name;
  document.getElementById("compWinner").value = c.winner;
  document.getElementById("compPoints").value = c.points;
}

function deleteCompetition(i) {
  competitions.splice(i, 1);
  localStorage.setItem("competitions", JSON.stringify(competitions));
  renderCompetitions();
}

renderCompetitions();

// --- Events ---
const eventForm = document.getElementById("eventForm");
const eventListDiv = document.getElementById("eventList");
let events = JSON.parse(localStorage.getItem("events")) || [];

function renderEvents() {
  eventListDiv.innerHTML = "";
  events.forEach((ev, i) => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <span>${ev.name} — ${ev.date}</span>
      <div>
        <button onclick="editEvent(${i})">✏️</button>
        <button onclick="deleteEvent(${i})">🗑️</button>
      </div>`;
    eventListDiv.appendChild(div);
  });
}

eventForm.addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("eventName").value.t
