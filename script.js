document.addEventListener("DOMContentLoaded", () => {
  // --- Tabs ---
  const tabs = Array.from(document.querySelectorAll(".tab-button"));
  const contents = Array.from(document.querySelectorAll(".tab-content"));

  function activateTab(tabBtn) {
    contents.forEach(c => c.classList.remove("active"));
    tabs.forEach(t => t.classList.remove("active"));
    const id = tabBtn.dataset.tab;
    const el = document.getElementById(id);
    if (el) el.classList.add("active");
    tabBtn.classList.add("active");
  }

  tabs.forEach(t => t.addEventListener("click", () => activateTab(t)));

  // --- Gallery ---
  const imageInput = document.getElementById("imageInput");
  const galleryContainer = document.getElementById("galleryContainer");
  let galleryImages = JSON.parse(localStorage.getItem("gallery") || "[]");

  function renderGallery() {
    if (!galleryContainer) return;
    galleryContainer.innerHTML = "";
    galleryImages.forEach((src, i) => {
      const img = document.createElement("img");
      img.src = src;
      img.alt = `image-${i}`;
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
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        galleryImages.push(reader.result);
        localStorage.setItem("gallery", JSON.stringify(galleryImages));
        renderGallery();
      };
      reader.readAsDataURL(file);
      // clear input to allow same file re-upload if needed
      imageInput.value = "";
    });
  }
  renderGallery();

  // --- Competitions ---
  const compForm = document.getElementById("competitionForm");
  const compListDiv = document.getElementById("competitionList");
  let competitions = JSON.parse(localStorage.getItem("competitions") || "[]");

  function renderCompetitions() {
    if (!compListDiv) return;
    compListDiv.innerHTML = "";
    competitions.forEach((c, i) => {
      const card = document.createElement("div");
      card.className = "card";

      const left = document.createElement("div");
      left.textContent = `${c.name} — ${c.winner} (${c.points} pts)`;
      card.appendChild(left);

      const btnWrap = document.createElement("div");
      const edit = document.createElement("button");
      edit.textContent = "✏️";
      edit.addEventListener("click", () => editCompetition(i));
      const del = document.createElement("button");
      del.textContent = "🗑️";
      del.addEventListener("click", () => deleteCompetition(i));
      btnWrap.appendChild(edit);
      btnWrap.appendChild(del);
      card.appendChild(btnWrap);

      compListDiv.appendChild(card);
    });
    updateTopScores();
  }

  if (compForm) {
    compForm.addEventListener("submit", e => {
      e.preventDefault();
      const name = (document.getElementById("compName") || {}).value?.trim();
      const winner = (document.getElementById("compWinner") || {}).value?.trim(
