"use strict";

/* =====================================
   PORTFOLIO INTERACTIONS
===================================== */

document.addEventListener("DOMContentLoaded", function () {

  const body = document.body;

  /* ---------------------------------
     NOTIFIKASI
  --------------------------------- */

  const toast = document.getElementById("toast");
  let toastTimeout;

  function showToast(message) {
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimeout);

    toastTimeout = setTimeout(function () {
      toast.classList.remove("show");
    }, 2400);
  }


  /* ---------------------------------
     NAVIGASI MOBILE
  --------------------------------- */

  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav-link");

  function closeMenu() {
    if (!menuToggle || !navMenu) return;

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Buka navigasi");

    navMenu.classList.remove("open");
    body.classList.remove("menu-open");
  }

  if (menuToggle && navMenu) {

    menuToggle.addEventListener("click", function () {
      const isOpen =
        menuToggle.getAttribute("aria-expanded") === "true";

      menuToggle.setAttribute("aria-expanded", String(!isOpen));

      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Buka navigasi" : "Tutup navigasi"
      );

      navMenu.classList.toggle("open", !isOpen);
      body.classList.toggle("menu-open", !isOpen);
    });

    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        closeMenu();
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 760) {
        closeMenu();
      }
    });
  }


  /* ---------------------------------
     FILTER PROYEK
  --------------------------------- */

  const filterButtons = document.querySelectorAll(".filter-btn");

  const projectGroups = document.querySelectorAll(
    ".project-category[data-category-group]"
  );

  function filterProjects(category) {

    projectGroups.forEach(function (group) {

      const groupCategory = group.dataset.categoryGroup;

      const cards = group.querySelectorAll(
        "[data-project-type]"
      );

      let visibleCount = 0;

      cards.forEach(function (card) {

        const matches =
          category === "semua" ||
          card.dataset.projectType === category;

        card.hidden = !matches;

        if (matches) {
          visibleCount++;
        }

      });

      group.hidden = visibleCount === 0;

    });

    filterButtons.forEach(function (button) {

      const isActive = button.dataset.filter === category;

      button.classList.toggle("aktif", isActive);

      button.setAttribute(
        "aria-pressed",
        String(isActive)
      );

    });

  }

  filterButtons.forEach(function (button) {

    button.addEventListener("click", function () {

      const category = button.dataset.filter;

      filterProjects(category);

    });

  });

  // Tampilkan semua proyek saat pertama kali dibuka.
  filterProjects("semua");


  /* ---------------------------------
     ANIMASI SCROLL
  --------------------------------- */

  const revealElements = document.querySelectorAll(".reveal");

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if ("IntersectionObserver" in window && !reducedMotion) {

    const revealObserver = new IntersectionObserver(
      function (entries, observer) {

        entries.forEach(function (entry) {

          if (entry.isIntersecting) {

            entry.target.classList.add("is-visible");

            observer.unobserve(entry.target);

          }

        });

      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -25px 0px"
      }
    );

    // Aktifkan animasi hanya setelah observer siap.
    body.classList.add("js-ready");

    revealElements.forEach(function (element) {

      revealObserver.observe(element);

    });

  } else {

    revealElements.forEach(function (element) {

      element.classList.add("is-visible");

    });

  }


  /* ---------------------------------
     NAVIGASI AKTIF SAAT SCROLL
  --------------------------------- */

  const sections = document.querySelectorAll(
    "main section[id]"
  );

  if ("IntersectionObserver" in window) {

    const sectionObserver = new IntersectionObserver(
      function (entries) {

        entries.forEach(function (entry) {

          if (!entry.isIntersecting) return;

          navLinks.forEach(function (link) {

            const isCurrent =
              link.getAttribute("href") ===
              "#" + entry.target.id;

            link.classList.toggle("aktif", isCurrent);

          });

        });

      },
      {
        rootMargin: "-25% 0px -60% 0px",
        threshold: 0
      }
    );

    sections.forEach(function (section) {

      sectionObserver.observe(section);

    });

  }


  /* ---------------------------------
     LIGHTBOX DESAIN GRAFIS
  --------------------------------- */

  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxClose = document.getElementById("lightboxClose");

  const designButtons = document.querySelectorAll(
    "[data-lightbox]"
  );

  let previousFocus = null;

  function openLightbox(button) {

    if (!lightbox || !lightboxImage) return;

    const imagePath = button.dataset.lightbox;

    const imageAlt =
      button.dataset.lightboxAlt || "Pratinjau desain";

    const image = button.querySelector("img");

    // Jangan membuka gambar yang belum tersedia.
    if (
      image &&
      image.complete &&
      image.naturalWidth === 0
    ) {
      showToast("Gambar belum tersedia. Periksa nama file.");
      return;
    }

    previousFocus = button;

    lightboxImage.src = imagePath;
    lightboxImage.alt = imageAlt;

    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");

    body.style.overflow = "hidden";

    if (lightboxClose) {
      lightboxClose.focus();
    }

  }

  function closeLightbox() {

    if (!lightbox) return;

    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");

    body.style.overflow = "";

    if (previousFocus) {
      previousFocus.focus();
    }

  }

  designButtons.forEach(function (button) {

    button.addEventListener("click", function () {

      openLightbox(button);

    });

  });

  if (lightboxClose) {

    lightboxClose.addEventListener("click", closeLightbox);

  }

  if (lightbox) {

    lightbox.addEventListener("click", function (event) {

      if (event.target === lightbox) {
        closeLightbox();
      }

    });

  }

  document.addEventListener("keydown", function (event) {

    if (
      event.key === "Escape" &&
      lightbox &&
      lightbox.classList.contains("open")
    ) {
      closeLightbox();
    }

  });


  /* ---------------------------------
     SALIN EMAIL
  --------------------------------- */

  const copyEmailButton = document.getElementById("copyEmail");
  const copyLabel = document.getElementById("copyLabel");

  if (copyEmailButton) {

    copyEmailButton.addEventListener("click", async function () {

      const email = copyEmailButton.dataset.email;

      try {

        await navigator.clipboard.writeText(email);

        if (copyLabel) {
          copyLabel.textContent = "TERSALIN";
        }

        showToast("Alamat email berhasil disalin.");

      } catch (error) {

        // Fallback jika clipboard tidak tersedia.
        const temporaryInput = document.createElement("textarea");

        temporaryInput.value = email;
        temporaryInput.setAttribute("readonly", "");
        temporaryInput.style.position = "fixed";
        temporaryInput.style.opacity = "0";

        document.body.appendChild(temporaryInput);

        temporaryInput.select();

        let copied = false;

        try {
          copied = document.execCommand("copy");
        } catch (copyError) {
          copied = false;
        }

        temporaryInput.remove();

        if (copied) {

          if (copyLabel) {
            copyLabel.textContent = "TERSALIN";
          }

          showToast("Alamat email berhasil disalin.");

        } else {

          showToast("Salin email secara manual: " + email);

        }

      }

      setTimeout(function () {

        if (copyLabel) {
          copyLabel.textContent = "SALIN";
        }

      }, 2400);

    });

  }

});