const enterBtn = document.getElementById("enterBtn");
const splash = document.getElementById("splash");
const gallery = document.getElementById("gallery");

enterBtn?.addEventListener("click", () => {
  splash.classList.add("hidden");
  gallery.classList.remove("hidden");

  // Avvia tutti i video preview nella galleria
  document.querySelectorAll("video[data-preview-duration]").forEach((video) => {
    video.currentTime = 0;
    video.play().catch(() => {});
  });
});

// Gestione loop limitato per ogni video preview
document.querySelectorAll("video[data-preview-duration]").forEach((video) => {
  const limit = Number(video.dataset.previewDuration || 5);

  video.addEventListener("loadedmetadata", () => {
    video.currentTime = 0;
  });

  video.addEventListener("timeupdate", () => {
    if (video.currentTime >= limit) {
      video.currentTime = 0;
      video.play().catch(() => {});
    }
  });
});
