document.addEventListener("DOMContentLoaded", () => {
  /* READING PROGRESS */
  const progressBar =
    document.getElementById("readingProgress") ||
    document.querySelector(".reading-progress");

  function updateReadingProgress() {
    if (!progressBar) return;

    const scrollable =
      document.documentElement.scrollHeight - window.innerHeight;

    const progress =
      scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;

    progressBar.style.width = `${Math.min(100, progress)}%`;
  }

  window.addEventListener("scroll", updateReadingProgress, {
    passive: true
  });

  updateReadingProgress();


  /* STORY CONTENT DETECTION */
  const story =
    document.querySelector("#story") ||
    document.querySelector(".story-content") ||
    document.querySelector(".story") ||
    document.querySelector("main");

  if (!story) return;

  const paragraphs = [...story.querySelectorAll("p")];

  /*
   * Do not automatically highlight every name.
   * Only selected narrative moments receive effects.
   * Story text itself remains unchanged.
   */
  const dramaticLines = [
    "A ship.",
    "BANG!",
    "James Anderson.",
    "I never believed you.",
    "David Harris?"
  ];

  function cleanText(text) {
    return text
      .replace(/[“”]/g, '"')
      .replace(/[‘’]/g, "'")
      .replace(/\s+/g, " ")
      .trim();
  }

  dramaticLines.forEach((line) => {
    const target = cleanText(line);

    const paragraph = paragraphs.find(
      (p) => cleanText(p.textContent) === target
    );

    if (paragraph) {
      paragraph.classList.add("impact");
    }
  });


  /* DRAMATIC FINAL REVEAL */
  const davidReveal = paragraphs.find((p) => {
    return cleanText(p.textContent).includes("David Harris?");
  });

  if (davidReveal) {
    davidReveal.classList.add("david-reveal");
  }


  /* CHARACTER ENTRANCES — ONLY THE FIRST INTRODUCTION */
  const characterNames = [
    "James Anderson",
    "Michael Brooks",
    "Daniel Carter",
    "Jack Wilson",
    "David Harris",
    "Ryan"
  ];

  characterNames.forEach((name) => {
    const firstMention = paragraphs.find((p) => {
      return new RegExp(
        `\\b${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
        "i"
      ).test(p.textContent);
    });

    if (firstMention) {
      firstMention.classList.add("character-entry");
    }
  });


  /* SCROLL-TRIGGERED STORY ENTRANCE */
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (!reducedMotion && "IntersectionObserver" in window) {
    paragraphs.forEach((paragraph) => {
      paragraph.classList.add("reveal");
    });

    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            currentObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -30px 0px"
      }
    );

    paragraphs.forEach((paragraph) => observer.observe(paragraph));
  }


  /* OPTIONAL HERO RADAR DECORATION */
  const hero = document.querySelector(".hero");

  if (hero && !hero.querySelector(".radar")) {
    const radar = document.createElement("div");
    radar.className = "radar";
    radar.setAttribute("aria-hidden", "true");

    const radarSweep = document.createElement("span");
    radar.appendChild(radarSweep);
    hero.appendChild(radar);
  }
});