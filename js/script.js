document.addEventListener("DOMContentLoaded", () => {
  // --- Language Toggle & Persistence ---
  const langBtn = document.getElementById("langToggle");
  const enText = langBtn?.querySelector(".en-text");
  const esText = langBtn?.querySelector(".es-text");

  // Variables for captcha
  let num1, num2, captchaAnswer;

  // Load saved language
  const savedLang = localStorage.getItem("site_language") || "en";
  if (savedLang === "es") {
    setLanguage("es");
  }

  function updateCaptchaLanguage() {
    const captchaLabel = document.getElementById("captchaLabel");
    const captchaInput = document.getElementById("captchaInput");
    if (captchaLabel && typeof captchaAnswer !== "undefined") {
      const isEs = document.body.classList.contains("lang-es-active");
      captchaLabel.innerHTML = isEs
        ? `Demuestra que eres humano: ${num1} + ${num2} = ?`
        : `Prove you are human: ${num1} + ${num2} = ?`;
      if (captchaInput) {
        captchaInput.placeholder = isEs ? "Resultado" : "Result";
      }
    }
  }

  function setLanguage(lang) {
    if (!langBtn) return;
    if (lang === "es") {
      document.body.classList.remove("lang-en-active");
      document.body.classList.add("lang-es-active");
      enText.classList.remove("active");
      esText.classList.add("active");
    } else {
      document.body.classList.remove("lang-es-active");
      document.body.classList.add("lang-en-active");
      esText.classList.remove("active");
      enText.classList.add("active");
    }
    localStorage.setItem("site_language", lang);
    updateCaptchaLanguage();
  }

  if (langBtn) {
    langBtn.addEventListener("click", () => {
      if (document.body.classList.contains("lang-en-active")) {
        setLanguage("es");
      } else {
        setLanguage("en");
      }
    });
  }

  // --- Mobile Hamburger Menu ---
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const sideNav = document.querySelector(".side-nav");
  const navLinks = document.querySelectorAll(".side-nav a");

  if (mobileMenuBtn && sideNav) {
    mobileMenuBtn.addEventListener("click", () => {
      const isOpen = sideNav.classList.toggle("active");
      const icon = mobileMenuBtn.querySelector("i");
      if (icon) {
        icon.className = isOpen ? "fas fa-times" : "fas fa-bars";
      }
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= 768) {
          sideNav.classList.remove("active");
          const icon = mobileMenuBtn.querySelector("i");
          if (icon) icon.className = "fas fa-bars";
        }
      });
    });
  }

  // --- Scroll Active Menu Link ---
  const sections = document.querySelectorAll("section");

  window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;

      // Adjust threshold as needed
      if (pageYOffset >= sectionTop - 200) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href").includes(current)) {
        link.classList.add("active");
      }
    });
  });

  // --- Form Submission & Anti-Spam Logic ---
  const contactForm = document.getElementById("contactForm");
  const captchaLabel = document.getElementById("captchaLabel");
  const captchaInput = document.getElementById("captchaInput");

  function generateCaptcha() {
    num1 = Math.floor(Math.random() * 10) + 1;
    num2 = Math.floor(Math.random() * 10) + 1;
    captchaAnswer = num1 + num2;
    updateCaptchaLanguage();
  }

  if (contactForm) {
    // Initial generation
    generateCaptcha();

    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Honeypot check
      const honeypot = contactForm.querySelector('input[name="_honey"]');
      if (honeypot && honeypot.value !== "") {
        console.warn("Bot detected via honeypot");
        return; // Silently abort
      }

      // Math captcha check
      if (parseInt(captchaInput.value) !== captchaAnswer) {
        const isEs = document.body.classList.contains("lang-es-active");
        alert(
          isEs
            ? "El resultado matemático es incorrecto."
            : "The math result is incorrect.",
        );
        generateCaptcha();
        captchaInput.value = "";
        return;
      }

      const btn = contactForm.querySelector("button");
      const originalHTML = btn.innerHTML;

      // Extract form data
      const name = contactForm.querySelector('input[name="name"]').value;
      const email = contactForm.querySelector('input[name="email"]').value;
      const message = contactForm.querySelector(
        'textarea[name="message"]',
      ).value;

      // Build Gmail compose link
      const subject = encodeURIComponent(`Contact from portfolio: ${name}`);
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      );

      // Open Gmail specifically in a new tab
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=dev.tiziana@gmail.com&su=${subject}&body=${body}`;
      window.open(gmailUrl, "_blank");

      btn.innerHTML = "Opening Client... / Abriendo...";
      btn.style.backgroundColor = "#10b981"; // Success green

      setTimeout(() => {
        contactForm.reset();
        generateCaptcha();
        btn.innerHTML = originalHTML;
        btn.style.backgroundColor = "";
      }, 3000);
    });
  }

  // --- Cookie Banner Logic ---
  const cookieBanner = document.getElementById("cookieBanner");
  const acceptCookiesBtn = document.getElementById("acceptCookies");

  if (cookieBanner && acceptCookiesBtn) {
    // Check if user already accepted
    if (!localStorage.getItem("cookies_accepted")) {
      // Show banner after a short delay
      setTimeout(() => {
        cookieBanner.classList.add("show");
      }, 1000);
    }

    acceptCookiesBtn.addEventListener("click", () => {
      localStorage.setItem("cookies_accepted", "true");
      cookieBanner.classList.remove("show");
    });
  }

  // --- Back to Top ---
  const backToTopBtn = document.getElementById("backToTop");

  if (backToTopBtn) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add("visible");
      } else {
        backToTopBtn.classList.remove("visible");
      }
    });

    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});
