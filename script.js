"use strict";

/* =========================================================
   CHAOS REALM FORGE
   SCRIPT.JS
   Cinematic intro, stars, navigation, reveals, and effects
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  const intro = document.getElementById("cinematic-intro");
  const website = document.getElementById("website");
  const enterButton = document.getElementById("enter-realm-button");

  const header = document.getElementById("site-header");
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mainNavigation = document.getElementById("main-navigation");

  const dropdown = document.querySelector(".navigation-dropdown");
  const dropdownButton = document.querySelector(".dropdown-button");

  const currentYear = document.getElementById("current-year");

  const introCanvas = document.getElementById("intro-star-canvas");
  const backgroundCanvas = document.getElementById(
    "background-star-canvas"
  );

  const revealElements = document.querySelectorAll(".reveal");
  const navigationLinks = document.querySelectorAll(
    '.main-navigation a[href^="#"]'
  );

  const sections = document.querySelectorAll("main section[id]");

  let introClosed = false;

  /* =======================================================
     CURRENT YEAR
  ======================================================= */

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  /* =======================================================
     CINEMATIC INTRO
  ======================================================= */

  function openWebsite() {
    if (introClosed) {
      return;
    }

    introClosed = true;

    if (intro) {
      intro.classList.add("intro-hidden");
    }

    if (website) {
      website.classList.add("website-visible");
      website.setAttribute("aria-hidden", "false");
    }

    body.classList.remove("intro-active");

    window.setTimeout(() => {
      if (intro) {
        intro.style.display = "none";
      }
    }, 1200);

    window.setTimeout(() => {
      revealVisibleElements();
    }, 250);
  }

  if (enterButton) {
    enterButton.addEventListener("click", openWebsite);
  }

  document.addEventListener("keydown", (event) => {
    if (
      !introClosed &&
      (event.key === "Enter" ||
        event.key === " " ||
        event.key === "Escape")
    ) {
      openWebsite();
    }
  });

  /* =======================================================
     MOBILE NAVIGATION
  ======================================================= */

  function closeMobileNavigation() {
    if (!mobileMenuButton || !mainNavigation) {
      return;
    }

    mobileMenuButton.classList.remove("menu-open");
    mainNavigation.classList.remove("navigation-open");

    mobileMenuButton.setAttribute("aria-expanded", "false");
    mobileMenuButton.setAttribute(
      "aria-label",
      "Open navigation menu"
    );
  }

  function toggleMobileNavigation() {
    if (!mobileMenuButton || !mainNavigation) {
      return;
    }

    const isOpen = mainNavigation.classList.toggle(
      "navigation-open"
    );

    mobileMenuButton.classList.toggle("menu-open", isOpen);

    mobileMenuButton.setAttribute(
      "aria-expanded",
      String(isOpen)
    );

    mobileMenuButton.setAttribute(
      "aria-label",
      isOpen
        ? "Close navigation menu"
        : "Open navigation menu"
    );
  }

  if (mobileMenuButton) {
    mobileMenuButton.addEventListener(
      "click",
      toggleMobileNavigation
    );
  }

  /* =======================================================
     CODEX DROPDOWN
  ======================================================= */

  function closeDropdown() {
    if (!dropdown || !dropdownButton) {
      return;
    }

    dropdown.classList.remove("dropdown-open");
    dropdownButton.setAttribute("aria-expanded", "false");
  }

  function toggleDropdown(event) {
    if (!dropdown || !dropdownButton) {
      return;
    }

    event.stopPropagation();

    const isOpen = dropdown.classList.toggle("dropdown-open");

    dropdownButton.setAttribute(
      "aria-expanded",
      String(isOpen)
    );
  }

  if (dropdownButton) {
    dropdownButton.addEventListener("click", toggleDropdown);
  }

  document.addEventListener("click", (event) => {
    if (
      dropdown &&
      !dropdown.contains(event.target)
    ) {
      closeDropdown();
    }

    if (
      mainNavigation &&
      mobileMenuButton &&
      !mainNavigation.contains(event.target) &&
      !mobileMenuButton.contains(event.target)
    ) {
      closeMobileNavigation();
    }
  });

  /* =======================================================
     SMOOTH NAVIGATION
  ======================================================= */

  navigationLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (
        !targetId ||
        !targetId.startsWith("#") ||
        targetId === "#"
      ) {
        return;
      }

      const target = document.querySelector(targetId);

      if (!target) {
        return;
      }

      event.preventDefault();

      closeMobileNavigation();
      closeDropdown();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  });

  document
    .querySelectorAll('a[href^="#"]')
    .forEach((link) => {
      link.addEventListener("click", (event) => {
        const targetId = link.getAttribute("href");

        if (
          !targetId ||
          targetId === "#" ||
          !targetId.startsWith("#")
        ) {
          return;
        }

        const target = document.querySelector(targetId);

        if (!target) {
          return;
        }

        event.preventDefault();

        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      });
    });

  /* =======================================================
     HEADER SCROLL EFFECT
  ======================================================= */

  function updateHeader() {
    if (!header) {
      return;
    }

    header.classList.toggle(
      "header-scrolled",
      window.scrollY > 35
    );
  }

  window.addEventListener("scroll", updateHeader, {
    passive: true
  });

  updateHeader();

  /* =======================================================
     SECTION REVEALS
  ======================================================= */

  function revealVisibleElements() {
    revealElements.forEach((element) => {
      const rect = element.getBoundingClientRect();

      if (rect.top < window.innerHeight * 0.92) {
        element.classList.add("reveal-visible");
      }
    });
  }

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("reveal-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      root: null,
      rootMargin: "0px 0px -8% 0px",
      threshold: 0.08
    }
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });

  /* =======================================================
     ACTIVE NAVIGATION LINK
  ======================================================= */

  const navigationMap = new Map();

  navigationLinks.forEach((link) => {
    const targetId = link.getAttribute("href");

    if (targetId && targetId.startsWith("#")) {
      navigationMap.set(targetId.slice(1), link);
    }
  });

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visibleSections = entries
        .filter((entry) => entry.isIntersecting)
        .sort(
          (first, second) =>
            second.intersectionRatio -
            first.intersectionRatio
        );

      if (!visibleSections.length) {
        return;
      }

      const activeSection = visibleSections[0].target.id;

      navigationLinks.forEach((link) => {
        link.classList.remove("navigation-active");
      });

      const activeLink = navigationMap.get(activeSection);

      if (activeLink) {
        activeLink.classList.add("navigation-active");
      }
    },
    {
      threshold: [0.18, 0.35, 0.55],
      rootMargin: "-20% 0px -55% 0px"
    }
  );

  sections.forEach((section) => {
    sectionObserver.observe(section);
  });

  /* =======================================================
     BROKEN IMAGE HANDLING
  ======================================================= */

  document.querySelectorAll("img").forEach((image) => {
    image.addEventListener("error", () => {
      image.classList.add("image-error");

      const originalAlt =
        image.getAttribute("alt") || "Artwork";

      image.setAttribute(
        "alt",
        `${originalAlt} could not be loaded`
      );
    });
  });

  /* =======================================================
     STAR CANVAS
  ======================================================= */

  class StarField {
    constructor(canvas, options = {}) {
      this.canvas = canvas;
      this.context = canvas
        ? canvas.getContext("2d")
        : null;

      this.stars = [];
      this.animationFrame = null;

      this.density = options.density || 0.00011;
      this.minimumStars = options.minimumStars || 70;
      this.maximumStars = options.maximumStars || 240;

      this.minimumSpeed = options.minimumSpeed || 0.015;
      this.maximumSpeed = options.maximumSpeed || 0.06;

      this.minimumSize = options.minimumSize || 0.35;
      this.maximumSize = options.maximumSize || 1.6;

      this.twinkle = options.twinkle ?? true;
      this.drift = options.drift ?? true;

      this.pixelRatio = Math.min(
        window.devicePixelRatio || 1,
        2
      );

      this.resizeHandler = this.resize.bind(this);
      this.animateHandler = this.animate.bind(this);
    }

    start() {
      if (!this.canvas || !this.context) {
        return;
      }

      this.resize();

      window.addEventListener(
        "resize",
        this.resizeHandler
      );

      this.animationFrame = requestAnimationFrame(
        this.animateHandler
      );
    }

    resize() {
      if (!this.canvas || !this.context) {
        return;
      }

      const width = this.canvas.clientWidth;
      const height = this.canvas.clientHeight;

      this.pixelRatio = Math.min(
        window.devicePixelRatio || 1,
        2
      );

      this.canvas.width = Math.floor(
        width * this.pixelRatio
      );

      this.canvas.height = Math.floor(
        height * this.pixelRatio
      );

      this.context.setTransform(
        this.pixelRatio,
        0,
        0,
        this.pixelRatio,
        0,
        0
      );

      const targetCount = Math.max(
        this.minimumStars,
        Math.min(
          this.maximumStars,
          Math.round(width * height * this.density)
        )
      );

      this.stars = Array.from(
        { length: targetCount },
        () => this.createStar(width, height)
      );
    }

    createStar(width, height) {
      return {
        x: Math.random() * width,
        y: Math.random() * height,

        radius:
          this.minimumSize +
          Math.random() *
            (this.maximumSize - this.minimumSize),

        alpha: 0.22 + Math.random() * 0.72,

        twinkleSpeed:
          0.004 + Math.random() * 0.017,

        twinkleOffset:
          Math.random() * Math.PI * 2,

        speed:
          this.minimumSpeed +
          Math.random() *
            (this.maximumSpeed - this.minimumSpeed),

        blueTint:
          Math.random() > 0.72
      };
    }

    drawStar(star, time) {
      if (!this.context) {
        return;
      }

      let alpha = star.alpha;

      if (this.twinkle) {
        alpha +=
          Math.sin(
            time * star.twinkleSpeed +
              star.twinkleOffset
          ) * 0.17;
      }

      alpha = Math.max(0.08, Math.min(1, alpha));

      this.context.beginPath();

      this.context.arc(
        star.x,
        star.y,
        star.radius,
        0,
        Math.PI * 2
      );

      this.context.fillStyle = star.blueTint
        ? `rgba(185, 242, 255, ${alpha})`
        : `rgba(255, 255, 255, ${alpha})`;

      this.context.fill();

      if (star.radius > 1.15) {
        this.context.beginPath();

        this.context.arc(
          star.x,
          star.y,
          star.radius * 3.4,
          0,
          Math.PI * 2
        );

        this.context.fillStyle = star.blueTint
          ? `rgba(103, 216, 255, ${alpha * 0.07})`
          : `rgba(255, 255, 255, ${alpha * 0.045})`;

        this.context.fill();
      }
    }

    updateStar(star, width, height) {
      if (!this.drift) {
        return;
      }

      star.y += star.speed;
      star.x += star.speed * 0.08;

      if (star.y > height + 5) {
        star.y = -5;
        star.x = Math.random() * width;
      }

      if (star.x > width + 5) {
        star.x = -5;
      }
    }

    animate(time) {
      if (!this.canvas || !this.context) {
        return;
      }

      const width = this.canvas.clientWidth;
      const height = this.canvas.clientHeight;

      this.context.clearRect(0, 0, width, height);

      this.stars.forEach((star) => {
        this.updateStar(star, width, height);
        this.drawStar(star, time);
      });

      this.animationFrame = requestAnimationFrame(
        this.animateHandler
      );
    }

    stop() {
      window.removeEventListener(
        "resize",
        this.resizeHandler
      );

      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame);
      }
    }
  }

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (!reducedMotion) {
    const introStars = new StarField(introCanvas, {
      density: 0.00014,
      minimumStars: 90,
      maximumStars: 280,
      minimumSpeed: 0.012,
      maximumSpeed: 0.045,
      minimumSize: 0.35,
      maximumSize: 1.75,
      twinkle: true,
      drift: true
    });

    const websiteStars = new StarField(backgroundCanvas, {
      density: 0.00008,
      minimumStars: 60,
      maximumStars: 190,
      minimumSpeed: 0.007,
      maximumSpeed: 0.026,
      minimumSize: 0.3,
      maximumSize: 1.25,
      twinkle: true,
      drift: true
    });

    introStars.start();
    websiteStars.start();
  }

  /* =======================================================
     WINDOW RESIZE CLEANUP
  ======================================================= */

  window.addEventListener("resize", () => {
    if (window.innerWidth > 980) {
      closeMobileNavigation();
      closeDropdown();
    }
  });

  /* =======================================================
     INITIAL STATE
  ======================================================= */

  revealVisibleElements();
});
