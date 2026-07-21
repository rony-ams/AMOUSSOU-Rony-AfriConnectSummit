/* ==========================================================================
   AFRICONNECT SUMMIT 2026 — SCRIPT PRINCIPAL (JavaScript vanilla)
   Sommaire :
   1. Dark mode / Light mode (localStorage)
   2. Navbar dynamique + menu hamburger
   3. Bouton retour en haut
   4. Année dynamique dans le footer
   5. Compte à rebours en temps réel
   6. Compteurs animés (chiffres clés)
   7. Animations au scroll (IntersectionObserver)
   8. Onglets du programme (page programme.html)
   9. Filtrage des intervenants (page intervenants.html)
   10. Validation du formulaire de contact (page contact.html)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {

  /* ------------------------------------------------------------------
     1. DARK MODE / LIGHT MODE
     ------------------------------------------------------------------ */
  const themeToggleButtons = document.querySelectorAll(".theme-toggle");
  const htmlElement = document.documentElement;

  // On récupère le thème déjà choisi (sinon on garde le mode sombre par défaut)
  const savedTheme = localStorage.getItem("theme") || "dark";
  applyTheme(savedTheme);

  function applyTheme(theme) {
    if (theme === "light") {
      htmlElement.setAttribute("data-theme", "light");
    } else {
      htmlElement.removeAttribute("data-theme");
    }
    // On met à jour l'icône de tous les boutons toggle (si plusieurs présents)
    themeToggleButtons.forEach(function (btn) {
      btn.innerHTML = theme === "light"
        ? '<i class="bi bi-moon-stars"></i>'
        : '<i class="bi bi-sun"></i>';
    });
  }

  themeToggleButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const isLight = htmlElement.getAttribute("data-theme") === "light";
      const newTheme = isLight ? "dark" : "light";
      localStorage.setItem("theme", newTheme);
      applyTheme(newTheme);
    });
  });

  /* ------------------------------------------------------------------
     2. NAVBAR DYNAMIQUE + MENU HAMBURGER
     ------------------------------------------------------------------ */
  const navbar = document.querySelector(".navbar");
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  window.addEventListener("scroll", function () {
    if (window.scrollY > 80) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", function () {
      hamburger.classList.toggle("open");
      navLinks.classList.toggle("open");
    });

    // On ferme le menu mobile automatiquement après un clic sur un lien
    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        hamburger.classList.remove("open");
        navLinks.classList.remove("open");
      });
    });
  }

  /* ------------------------------------------------------------------
     3. BOUTON RETOUR EN HAUT
     ------------------------------------------------------------------ */
  const backToTopBtn = document.querySelector(".back-to-top");

  if (backToTopBtn) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add("visible");
      } else {
        backToTopBtn.classList.remove("visible");
      }
    });

    backToTopBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ------------------------------------------------------------------
     4. ANNÉE DYNAMIQUE DANS LE FOOTER
     ------------------------------------------------------------------ */
  document.querySelectorAll(".current-year").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ------------------------------------------------------------------
     5. COMPTE À REBOURS EN TEMPS RÉEL
     ------------------------------------------------------------------ */
  const countdownEl = document.querySelector(".countdown");

  if (countdownEl) {
    // Date fictive de la conférence : 18 novembre 2026, 9h00
    const targetDate = new Date("2026-11-18T09:00:00").getTime();

    const daysEl = document.getElementById("cd-days");
    const hoursEl = document.getElementById("cd-hours");
    const minutesEl = document.getElementById("cd-minutes");
    const secondsEl = document.getElementById("cd-seconds");

    function updateCountdown() {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance <= 0) {
        countdownEl.innerHTML = "<p>L'événement a commencé !</p>";
        clearInterval(countdownInterval);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      daysEl.textContent = String(days).padStart(2, "0");
      hoursEl.textContent = String(hours).padStart(2, "0");
      minutesEl.textContent = String(minutes).padStart(2, "0");
      secondsEl.textContent = String(seconds).padStart(2, "0");
    }

    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);
  }

  /* ------------------------------------------------------------------
     6. COMPTEURS ANIMÉS (chiffres clés) — se déclenchent au scroll
     ------------------------------------------------------------------ */
  const counters = document.querySelectorAll(".stat-number");

  function animateCounter(el) {
    const target = parseInt(el.getAttribute("data-target"), 10);
    const duration = 1500; // durée totale de l'animation en ms
    const startTime = performance.now();

    function step(currentTime) {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const value = Math.floor(progress * target);
      el.textContent = value.toLocaleString("fr-FR") + (el.getAttribute("data-suffix") || "");

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString("fr-FR") + (el.getAttribute("data-suffix") || "");
      }
    }
    requestAnimationFrame(step);
  }

  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target); // on ne joue l'animation qu'une seule fois
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (counter) {
      counterObserver.observe(counter);
    });
  }

  /* ------------------------------------------------------------------
     7. ANIMATIONS AU SCROLL (fade-in / slide-in / zoom-in)
     ------------------------------------------------------------------ */
  const revealElements = document.querySelectorAll(".reveal");

  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  /* ------------------------------------------------------------------
     8. ONGLETS DU PROGRAMME (page programme.html)
     ------------------------------------------------------------------ */
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabPanels = document.querySelectorAll(".tab-panel");

  tabButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const targetTab = button.getAttribute("data-tab");

      // On désactive tous les onglets et panneaux
      tabButtons.forEach(function (btn) { btn.classList.remove("active"); });
      tabPanels.forEach(function (panel) { panel.classList.remove("active"); });

      // On active seulement l'onglet cliqué et son panneau correspondant
      button.classList.add("active");
      document.getElementById(targetTab).classList.add("active");
    });
  });

  /* ------------------------------------------------------------------
     9. FILTRAGE DYNAMIQUE DES INTERVENANTS (page intervenants.html)
     ------------------------------------------------------------------ */
  const filterButtons = document.querySelectorAll(".filter-btn");
  const speakerCards = document.querySelectorAll(".speaker-card");

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const filterValue = button.getAttribute("data-filter");

      filterButtons.forEach(function (btn) { btn.classList.remove("active"); });
      button.classList.add("active");

      speakerCards.forEach(function (card) {
        const category = card.getAttribute("data-category");
        if (filterValue === "tous" || category === filterValue) {
          card.classList.remove("hidden");
        } else {
          card.classList.add("hidden");
        }
      });
    });
  });
