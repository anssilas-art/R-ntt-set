document.addEventListener("DOMContentLoaded", () => {
  // Tabs
  const tabs = document.querySelectorAll(".tab-button");
  const contents = document.querySelectorAll(".tab-content");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      contents.forEach(c => c.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById(tab.dataset.tab).classList.add("active");
    });
  });

  // Gallery
  const imageInput = document.getElementById("imageInput");
  const galleryContainer = document.getElementById("galleryContainer");
  let galleryImages = JSON.parse(localStorage.getItem("gallery") || "[]");

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

  if (imageInput) {
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
      e.target.value = "";
    });
  }
  renderGallery();

  // Competitions
  const compForm = document.getElementById("competitionForm");
  const compList = document.getElementById("competitionList");
  let competitions = JSON.parse(localStorage.getItem("competitions") || "[]");

  function renderCompetitions() {
    compList.innerHTML = "";
    competitions.forEach((c, i) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <div>${c.name} — ${c.winner} (${c.points} pts)</div>
        <div>
          <button data-action="edit">✏️</button>
          <button data-action="delete">🗑️</button>
        </div>
      `;
      card.querySelector("[data-action='edit']").addEventListener("click", () => {
        document.getElementById("compName").value = c.name;
        document.getElementById("compWinner").value = c.winner;
        document.getElementById("compPoints").value = c.points;
      });
      card.querySelector("[data-action='delete']").addEventListener("click", () => {
        competitions.splice(i, 1);
        localStorage.setItem("competitions", JSON.stringify(competitions));
        renderCompetitions();
      });
      compList.appendChild(card);
    });
    updateTopScores();
  }

  compForm.addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("compName").value.trim();
    const winner = document.getElementById("compWinner").value.trim();
    const points = Number(document.getElementById("compPoints").value);
    if (!name || !winner || isNaN(points)) return;
    const idx = competitions.findIndex(x => x.name === name);
    if (idx >= 0) competitions[idx] = { name, winner, points };
    else competitions.push({ name, winner, points });
    localStorage.setItem("competitions", JSON.stringify(competitions));
    compForm.reset();
    renderCompetitions();
  });
  renderCompetitions();

  // Events
  const eventForm = document.getElementById("eventForm");
  const eventList = document.getElementById("eventList");
  let events = JSON.parse(localStorage.getItem("events") || "[]");

  function renderEvents() {
    eventList.innerHTML = "";
    events.forEach((ev, i) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <div>${ev.name} — ${ev.date}</div>
        <div>
          <button data-action="edit">✏️</button>
          <button data-action="delete">🗑️</button>
        </div>
      `;
      card.querySelector("[data-action='edit']").addEventListener("click", () => {
        document.getElementById("eventName").value = ev.name;
        document.getElementById("eventDate").value = ev.date;
      });
      card.querySelector("[data-action='delete']").addEventListener("click", () => {
        events.splice(i, 1);
        localStorage.setItem("events", JSON.stringify(events));
        renderEvents();
      });
      eventList.appendChild(card);
    });
  }

  eventForm.addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("eventName").value.trim();
    const date = document.getElementById("eventDate").value;
    if (!name || !date) return;
    const idx = events.findIndex(x => x.name === name);
    if (idx >= 0) events[idx] = { name, date };
    else events.push({ name, date });
    localStorage.setItem("events", JSON.stringify(events));
    eventForm.reset();
    renderEvents();
  });
  renderEvents();

  // Top scores
  const topScoresBody = document.querySelector("#topScoresTable tbody");
  function updateTopScores() {
    topScoresBody.innerHTML = "";
    const sorted = [...competitions].sort((a, b) => b.points - a.points);
    sorted.slice(0, 10).forEach(c => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${c.name}</td><td>${c.winner}</td><td>${c.points}</td>`;
      topScoresBody.appendChild(tr);
    });
  }

  // Export / Import
  document.getElementById("exportData").addEventListener("click", () => {
    const data = { gallery: galleryImages, competitions, events };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ronttoset_backup.json";
    a.click();
    URL.revokeObjectURL(url);
  });

  document.getElementById("importData").addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const d = JSON.parse(reader.result);
        galleryImages = d.gallery || [];
        competitions = d.competitions || [];
        events = d.events || [];
        localStorage.setItem("gallery", JSON.stringify(galleryImages));
        localStorage.setItem("competitions", JSON.stringify(competitions));
        localStorage.setItem("events", JSON.stringify(events));
        renderGallery();
        renderCompetitions();
        renderEvents();
        alert("Data imported successfully!");
      } catch {
        alert("Invalid file!");
      }
    };
    reader.readAsText(file);
  });
});
