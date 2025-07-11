// === Scroll Progress ===
window.onscroll = () => {
  const scroll = document.documentElement.scrollTop || document.body.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (scroll / height) * 100;
  document.getElementById("scrollProgress").style.width = scrolled + "%";
};

// === Theme Picker ===
const themePicker = document.getElementById("themePicker");
const themes = ["neon", "earth", "dark", "analog", "pastel", "crt"];

const themeParticles = {
  default: {
    color: "#6666ff",
    shape: "circle",
    direction: "top",
    speed: 1.2,
    size: 8,
    opacity: 0.3,
    amount: 100000
  },
  neon: {
    color: "#00ffff",
    shape: "star",
    direction: "none",
    speed: 3,
    size: 10,
    opacity: 0.4,
    amount: 100000000
  },
  earth: {
    color: "#5a3f1d",
    shape: "triangle",
    direction: "bottom",
    speed: 0.8,
    size: 9,
    opacity: 0.25
  },
  dark: {
    color: "#ffffff",
    shape: "circle",
    direction: "none",
    speed: 0.5,
    size: 6,
    opacity: 0.2
  },
  analog: {
    color: "#85603f",
    shape: "edge",
    direction: "none",
    speed: 1,
    size: 10,
    opacity: 0.2
  },
  pastel: {
    color: "#ff69b4",
    shape: "polygon",
    direction: "top",
    speed: 1.5,
    size: 10,
    opacity: 0.4
  },

  crt: {
  color: "#00ff99",
  shape: "circle",
  direction: "none",
  speed: 0.5,
  size: 6,
  opacity: 0.2
}

};

const savedTheme = localStorage.getItem("theme");

if (savedTheme && themes.includes(savedTheme)) {
  document.body.classList.add(savedTheme);
  themePicker.value = savedTheme;
  loadParticles(themeParticles[savedTheme]);
} else {
  loadParticles(themeParticles.default);
}

themePicker.addEventListener("change", () => {
  document.body.classList.remove(...themes);
  const selected = themePicker.value;
  if (themes.includes(selected)) {
    document.body.classList.add(selected);
    localStorage.setItem("theme", selected);
    loadParticles(themeParticles[selected]);
  } else {
    localStorage.removeItem("theme");
    loadParticles(themeParticles.default);
  }
});

// === Mobile Menu Toggle ===
document.getElementById("menuToggle").onclick = () => {
  document.querySelector(".nav-links").classList.toggle("active");
};

// === Like Button ===
document.querySelectorAll(".like-btn").forEach(button => {
  const count = button.querySelector(".like-count");
  const img = button.closest(".gallery-item").querySelector("img");
  const key = "likes-" + img.src;
  const saved = localStorage.getItem(key);
  if (saved) {
    count.textContent = saved;
    button.classList.add("liked");
  }

  button.addEventListener("click", () => {
    let value = parseInt(count.textContent);
    value++;
    count.textContent = value;
    button.classList.add("liked", "pulse");
    localStorage.setItem(key, value);
    setTimeout(() => button.classList.remove("pulse"), 300);
  });
});

// === Filter & Sort ===
const filterButtons = document.querySelectorAll(".filter-btns button");
const galleryItems = document.querySelectorAll(".gallery-item");
let currentTag = "all";

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    currentTag = button.dataset.filter;
    updateVisibleItems();
  });
});

document.getElementById("sort").addEventListener("change", () => {
  const items = Array.from(galleryItems);
  const container = document.querySelector(".gallery-masonry");
  const value = document.getElementById("sort").value;

  const sorted = items.sort((a, b) => {
    if (value === "newest") return new Date(b.dataset.date) - new Date(a.dataset.date);
    if (value === "oldest") return new Date(a.dataset.date) - new Date(b.dataset.date);
    if (value === "popular") return b.dataset.likes - a.dataset.likes;
  });

  container.innerHTML = "";
  sorted.forEach(item => container.appendChild(item));
  updateVisibleItems();
});

// === Load More ===
const allItems = Array.from(galleryItems);
const loadBtn = document.getElementById("loadMore");
let visibleCount = 3;
let allShown = false;

function updateVisibleItems() {
  let count = 0;
  allItems.forEach(item => {
    const tags = item.dataset.tags.toLowerCase().split(",");
    const show = currentTag === "all" || tags.includes(currentTag);
    item.style.display = (show && count++ < visibleCount) ? "block" : "none";
  });

  const match = allItems.filter(i => currentTag === "all" || i.dataset.tags.toLowerCase().split(",").includes(currentTag));
  loadBtn.textContent = visibleCount >= match.length ? "Load Less" : "Load More";
  allShown = visibleCount >= match.length;
  loadBtn.style.display = match.length > 3 ? "block" : "none";
}

loadBtn.addEventListener("click", () => {
  visibleCount = allShown ? 3 : allItems.length;
  updateVisibleItems();
});

// === Quote ===
const quotes = [
  "Capture the moment before it disappears.",
  "Every picture tells a story.",
  "Shoot what you feel.",
  "Life is blurry without focus."
];
document.getElementById("quote").textContent = quotes[Math.floor(Math.random() * quotes.length)];

updateVisibleItems();

// === Musik Toggle ===
const music = document.getElementById("bgMusic");
const toggleBtn = document.getElementById("toggleMusic");
let isPlaying = false;

if (music && toggleBtn) {
  document.body.addEventListener("click", () => {
    if (!isPlaying) {
      music.play().then(() => {
        isPlaying = true;
        toggleBtn.textContent = "🔊";
      }).catch(err => {
        console.warn("Autoplay diblokir:", err);
      });
    }
  }, { once: true });

  toggleBtn.addEventListener("click", () => {
    if (isPlaying) {
      music.pause();
      toggleBtn.textContent = "🔇";
      isPlaying = false;
    } else {
      music.play().then(() => {
        toggleBtn.textContent = "🔊";
        isPlaying = true;
      }).catch(err => {
        console.warn("Tidak bisa memutar musik:", err);
      });
    }
  });
}

// === Partikel Dinamis per Tema ===
function loadParticles(config) {
  const canvas = document.querySelector("#particles-js canvas");
  if (canvas) canvas.remove(); // hapus canvas lama jika ada

  particlesJS("particles-js", {
    particles: {
      number: {
        value: config.number || 35,
        density: { enable: true, value_area: 800 }
      },
      color: { value: config.color },
      shape: { type: config.shape || "circle" },
      opacity: {
        value: config.opacity || 0.3,
        random: true
      },
      size: {
        value: config.size || 8,
        random: true
      },
      move: {
        enable: true,
        speed: config.speed || 1.5,
        direction: config.direction || "top",
        straight: false,
        out_mode: "out"
      }
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: { enable: true, mode: "repulse" },
        onclick: { enable: false }
      }
    },
    retina_detect: true
  });
}



// === MODAL PREVIEW ===
const modal = document.getElementById("presetModal");
const modalText = document.getElementById("modalText");
const modalClose = document.querySelector(".modal-close");
const beforeImg = document.getElementById("beforeImg");
const afterImg = document.getElementById("afterImg");
const afterWrapper = document.getElementById("afterWrapper");
const slider = document.getElementById("baSlider");

document.querySelectorAll(".preset-card").forEach(card => {
  const btn = card.querySelector(".preview-btn");
  btn.addEventListener("click", () => {
    const before = card.getAttribute("data-before");
    const after = card.getAttribute("data-after");
    const desc = card.getAttribute("data-description");

    beforeImg.src = before;
    afterImg.src = after;
    modalText.textContent = desc;
    slider.value = 50;
    afterWrapper.style.width = "50%";
    modal.style.display = "flex";
  });
});

slider.addEventListener("input", () => {
  afterWrapper.style.width = slider.value + "%";
});

modalClose.addEventListener("click", () => {
  modal.style.display = "none";
});

modal.addEventListener("click", e => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});


// toggle hamburger otomatis tertutup saat sudah di klik
document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    const nav = document.querySelector(".nav-links");
    if (nav.classList.contains("active")) {
      nav.classList.remove("active");
    }
  });
});

// === IMAGE MODAL ===
const imageModal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");
const closeBtn = document.querySelector(".image-modal .close-btn");

document.querySelectorAll(".gallery-item img").forEach(img => {
  img.addEventListener("click", () => {
    modalImage.src = img.src;
    imageModal.style.display = "flex";
  });
});

closeBtn.addEventListener("click", () => {
  imageModal.style.display = "none";
});

imageModal.addEventListener("click", (e) => {
  if (e.target === imageModal) {
    imageModal.style.display = "none";
  }
});
