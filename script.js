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

imageInput?.addEventListener("change", e => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      galleryImages.push(reader.result);
      localStorage.setItem("gallery", JSON.stringify(galleryImages));
      renderGallery();
    };
    reader.readAsDataURL(file);
  }
});

renderGallery();

// --- Competitions ---
const compForm = document.getElementById("competitionForm");
const compList = document.getElementById("competitionList");
let competitions = JSON.parse(localStorage.getItem("competitions")) || [];

function renderCompetitions() {
  compList.innerHTML = "";
  competitions.forEach((c, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${c.name} — <strong>${c.winner}</strong> (${c.points} pts)</span>
      <div>
        <button onclick="editCompetition(${index})">✏️</button>
        <button onclick="deleteCompetition(${index})">🗑️</button>
      </div>`;
    compList.appendChild(li);
  });
  updateTopScores();
}

compForm?.addEventListener("submit", e => {
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
const eventList = document.getElementById("eventList");
let events = JSON.parse(localStorage.getItem("events")) || [];

function renderEvents() {
  eventList.innerHTML = "";
  events.forEach((ev, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${ev.name} — ${ev.date}</span>
      <div>
        <button onclick="editEvent(${index})">✏️</button>
        <button onclick="deleteEvent(${index})">🗑️</button>
      </div>`;
    eventList.appendChild(li);
  });
}

eventForm?.addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("eventName").value.trim();
  const date = document.getElementById("eventDate").value;
  if (!name || !date) return;

  const existing = events.findIndex(ev => ev.name === name);
  if (existing >= 0) events[existing] = { name, date };
  else events.push({ name, date });

  localStorage.setItem("events", JSON.stringify(events));
  eventForm.reset();
  renderEvents();
});

function editEvent(i) {
  const ev = events[i];
  document.getElementById("eventName").value = ev.name;
  document.getElementById("eventDate").value = ev.date;
}

function deleteEvent(i) {
  events.splice(i, 1);
  localStorage.setItem("events", JSON.stringify(events));
  renderEvents();
}

renderEvents();

// --- Top Scores ---
const topScoresTable = document.querySelector("#topScoresTable tbody");

function updateTopScores() {
  topScoresTable.innerHTML = "";
  const sorted = [...competitions].sort((a, b) => b.points - a.points);
  sorted.slice(0, 10).forEach(c => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${c.name}</td>
      <td>${c.winner}</td>
      <td>${c.points}</td>
    `;
    topScoresTable.appendChild(row);
  });
}

updateTopScores();

// --- Export / Import Data ---
const exportBtn = document.getElementById("exportData");
const importInput = document.getElementById("importData");

exportBtn?.addEventListener("click", () => {
  const data = { gallery: galleryImages, competitions, events };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "ronttoset_backup.json";
  a.click();
  URL.revokeObjectURL(url);
});

importInput?.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (data.gallery && data.competitions && data.events) {
        galleryImages = data.gallery;
        competitions = data.competitions;
        events = data.events;
        localStorage.setItem("gallery", JSON.stringify(galleryImages));
        localStorage.setItem("competitions", JSON.stringify(competitions));
        localStorage.setItem("events", JSON.stringify(events));
        renderGallery();
        renderCompetitions();
        renderEvents();
        alert("✅ Data imported successfully!");
      } else {
        alert("❌ Invalid backup file.");
      }
    } catch {
      alert("❌ Failed to read file.");
    }
  };
  reader.readAsText(file);
});
