"use strict";

(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ============ Custom cursor ============ */
  const dot = document.querySelector(".cursor-dot");
  const ring = document.querySelector(".cursor-ring");
  const glow = document.querySelector(".cursor-glow");

  if (dot && ring && glow && finePointer && !reduceMotion) {
    let mouseX = -100, mouseY = -100;
    let dotX = -100, dotY = -100;
    let ringX = -100, ringY = -100;
    let glowX = -100, glowY = -100;
    let visible = false;
    let outside = true;
    let idleTimer = null;

    const show = () => {
      visible = true;
      dot.style.opacity = "1";
      ring.style.opacity = "1";
      glow.style.opacity = "1";
    };

    const hide = () => {
      visible = false;
      dot.style.opacity = "0";
      ring.style.opacity = "0";
      glow.style.opacity = "0";
    };

    window.addEventListener("mousemove", (e) => {
      const px = e.clientX;
      const py = e.clientY;

      if (!visible) show();

      if (outside) {
        outside = false;
        const dL = px, dR = window.innerWidth - px;
        const dT = py, dB = window.innerHeight - py;
        const min = Math.min(dL, dR, dT, dB);
        let sx = px, sy = py;
        if (min === dL) sx = -46;
        else if (min === dR) sx = window.innerWidth + 46;
        else if (min === dT) sy = -46;
        else sy = window.innerHeight + 46;
        ringX = sx; ringY = sy;
        glowX = sx; glowY = sy;
        ring.style.translate = `${sx}px ${sy}px`;
        glow.style.translate = `${sx}px ${sy}px`;
      }

      mouseX = px;
      mouseY = py;
      clearTimeout(idleTimer);
      idleTimer = setTimeout(hide, 2500);
    });

    document.addEventListener("mouseout", (e) => {
      if (!e.relatedTarget) outside = true;
    });

    window.addEventListener("blur", () => { outside = true; });

    document.addEventListener("mouseleave", hide);

    const interactive = "a, button, .tilt, input, textarea, [data-cursor]";
    document.addEventListener("mouseover", (e) => {
      if (e.target.closest(interactive)) {
        ring.classList.add("is-hover");
      }
    });
    document.addEventListener("mouseout", (e) => {
      if (e.target.closest(interactive)) {
        ring.classList.remove("is-hover");
      }
    });

    function raf() {
      if (visible) {
        dotX += (mouseX - dotX) * 0.85;
        dotY += (mouseY - dotY) * 0.85;
        ringX += (mouseX - ringX) * 0.22;
        ringY += (mouseY - ringY) * 0.22;
        glowX += (mouseX - glowX) * 0.08;
        glowY += (mouseY - glowY) * 0.08;
      } else {
        dotX += (mouseX - dotX) * 0.12;
        dotY += (mouseY - dotY) * 0.12;
        ringX += (mouseX - ringX) * 0.12;
        ringY += (mouseY - ringY) * 0.12;
        glowX += (mouseX - glowX) * 0.08;
        glowY += (mouseY - glowY) * 0.08;
      }
      dot.style.translate = `${dotX}px ${dotY}px`;
      ring.style.translate = `${ringX}px ${ringY}px`;
      glow.style.translate = `${glowX}px ${glowY}px`;
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  } else if (dot && ring && glow) {
    dot.style.display = "none";
    ring.style.display = "none";
    glow.style.display = "none";
  }

  /* ============ Magnetic buttons ============ */
  if (finePointer && !reduceMotion) {
    document.querySelectorAll(".magnetic").forEach((el) => {
      const strength = 0.3;
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * strength;
        const y = (e.clientY - r.top - r.height / 2) * strength;
        el.style.transform = `translate(${x}px, ${y}px)`;
      });
      el.addEventListener("mouseleave", () => {
        el.style.transition = "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)";
        el.style.transform = "translate(0, 0)";
        setTimeout(() => {
          el.style.transition = "";
        }, 500);
      });
    });
  }

  /* ============ Nav on scroll ============ */
  const nav = document.getElementById("nav");
  const onScroll = () => {
    nav.classList.toggle("is-scrolled", window.scrollY > 24);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ============ Burger menu ============ */
  const burger = document.getElementById("burger");
  const navLinks = document.getElementById("navLinks");

  function closeMenu() {
    burger.classList.remove("is-open");
    navLinks.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
  }

  burger.addEventListener("click", () => {
    const open = navLinks.classList.toggle("is-open");
    burger.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
  });

  navLinks.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));
  document.addEventListener("click", (e) => {
    if (navLinks.classList.contains("is-open") && !navLinks.contains(e.target) && !burger.contains(e.target)) {
      closeMenu();
    }
  });

  /* ============ Content & i18n ============ */
  const DEFAULTS = window.SITE_DEFAULTS;
  let CONTENT = DEFAULTS;
  let currentLang = localStorage.getItem("danis-lang") || "en";
  const langBtns = document.querySelectorAll(".lang-btn");

  function buildDict(lang) {
    const d = {};
    for (const [k, v] of Object.entries(CONTENT)) {
      if (v && typeof v === "object" && typeof v.en === "string" && typeof v.ru === "string") {
        d[k] = v[lang];
      } else if (typeof v === "string") {
        d[k] = v;
      }
    }
    CONTENT.stats.forEach((s, i) => {
      d["stat." + (i + 1)] = s.label[lang];
    });
    CONTENT.projects.forEach((p, i) => {
      d["proj." + (i + 1) + ".title"] = p.title[lang];
      d["proj." + (i + 1) + ".desc"] = p.desc[lang];
    });
    d["code.available"] = CONTENT.code.available ? "true" : "false";
    return d;
  }

  function setLang(lang) {
    currentLang = lang;
    localStorage.setItem("danis-lang", lang);
    document.documentElement.lang = lang;
    const dict = buildDict(lang);
    document.title = CONTENT.meta.title[lang];
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", CONTENT.meta.desc[lang]);
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (dict[key] !== undefined) el.textContent = dict[key];
    });
    langBtns.forEach((b) => b.classList.toggle("is-active", b.dataset.lang === lang));
    renderProjects();
    renderSkills();
    renderStats();
    renderSocials();
    renderContact();
  }

  langBtns.forEach((b) => b.addEventListener("click", () => setLang(b.dataset.lang)));

  /* ============ Dynamic renders ============ */
  function renderProjects() {
    const grid = document.getElementById("projectsGrid");
    if (!grid) return;
    grid.innerHTML = "";
    CONTENT.projects.forEach((p, i) => {
      const card = document.createElement("article");
      card.className = "project-card tilt reveal";
      card.style.transitionDelay = (i * 0.12) + "s";

      const cover = document.createElement("div");
      cover.className = "card-cover";
      const img = document.createElement("img");
      img.src = p.image;
      img.alt = p.title[currentLang];
      img.loading = "lazy";
      cover.appendChild(img);

      const content = document.createElement("div");
      content.className = "card-content";
      const h = document.createElement("h3");
      h.className = "card-title";
      h.textContent = p.title[currentLang];
      const desc = document.createElement("p");
      desc.className = "card-desc";
      desc.textContent = p.desc[currentLang];
      const tags = document.createElement("div");
      tags.className = "tags";
      p.tags.forEach((tag) => {
        const span = document.createElement("span");
        span.className = "tag";
        span.textContent = tag;
        tags.appendChild(span);
      });
      content.appendChild(h);
      content.appendChild(desc);
      content.appendChild(tags);

      if (p.url) {
        card.classList.add("is-linked");
        card.addEventListener("click", () => window.open(p.url, "_blank", "noopener"));
      }

      card.appendChild(cover);
      card.appendChild(content);
      grid.appendChild(card);
    });
    initReveal();
    bindTilt();
  }

  const SKILL_MARKS = ["", "mark-pink", "mark-cyan"];

  function renderSkills() {
    const columns = document.getElementById("skillsColumns");
    if (!columns) return;
    columns.innerHTML = "";
    CONTENT.skills.columns.forEach((c, i) => {
      const col = document.createElement("div");
      col.className = "skill-column reveal";
      col.style.transitionDelay = (i * 0.12) + "s";

      const header = document.createElement("div");
      header.className = "column-header";
      const mark = document.createElement("span");
      mark.className = "column-mark" + (SKILL_MARKS[i % SKILL_MARKS.length] ? " " + SKILL_MARKS[i % SKILL_MARKS.length] : "");
      const name = document.createElement("span");
      name.className = "column-name";
      name.textContent = c.name[currentLang];
      header.appendChild(mark);
      header.appendChild(name);

      col.appendChild(header);
      c.items.forEach((item) => {
        const row = document.createElement("div");
        row.className = "skill-item";
        const bullet = document.createElement("span");
        bullet.className = "bullet";
        bullet.textContent = "▹";
        const label = document.createElement("span");
        label.className = "skill-label";
        label.textContent = item;
        row.appendChild(bullet);
        row.appendChild(label);
        col.appendChild(row);
      });

      columns.appendChild(col);
    });
    initReveal();
  }

  function renderStats() {
    const row = document.getElementById("statsRow");
    if (!row) return;
    const counts = row.querySelectorAll(".count");
    CONTENT.stats.forEach((s, i) => {
      const el = counts[i];
      if (!el) return;
      el.dataset.target = String(s.value);
      el.dataset.suffix = s.suffix || "";
      el.textContent = "0";
      const label = row.querySelectorAll(".stat-label")[i];
      if (label) label.textContent = s.label[currentLang];
    });
    initCounters();
  }

  function renderSocials() {
    const links = document.getElementById("footerLinks");
    if (!links) return;
    links.innerHTML = "";
    CONTENT.footer.socials.forEach((s) => {
      const a = document.createElement("a");
      a.className = "footer-link";
      a.href = s.url;
      a.textContent = s.label;
      if (s.url && s.url.startsWith("http")) {
        a.target = "_blank";
        a.rel = "noopener";
      }
      links.appendChild(a);
    });
  }

  function renderContact() {
    const email = document.getElementById("contactEmail");
    const cta = document.getElementById("contactCta");
    const href = "mailto:" + CONTENT.contact.email;
    if (email) {
      email.textContent = CONTENT.contact.email;
      email.href = href;
    }
    if (cta) cta.href = href;
  }

  /* ============ Reveal / counters / tilt (dynamic) ============ */
  let revealObserver = null;
  let countObserver = null;
  const tilted = new WeakSet();

  function initReveal() {
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-in-view");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
      );
    }
    document.querySelectorAll(".reveal:not(.is-in-view)").forEach((el) => revealObserver.observe(el));
  }

  function initCounters() {
    if (!countObserver) {
      countObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            countObserver.unobserve(el);
            const target = parseInt(el.dataset.target, 10);
            const suffix = el.dataset.suffix || "";
            const duration = 1600;
            const start = performance.now();

            function tick(now) {
              const p = Math.min((now - start) / duration, 1);
              const eased = 1 - Math.pow(1 - p, 3);
              el.textContent = Math.round(target * eased) + suffix;
              if (p < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
          });
        },
        { threshold: 0.6 }
      );
    }
    document.querySelectorAll(".count").forEach((el) => countObserver.observe(el));
  }

  function bindTilt() {
    if (!finePointer || reduceMotion) return;
    document.querySelectorAll(".tilt").forEach((card) => {
      if (tilted.has(card)) return;
      tilted.add(card);
      const maxTilt = 6;
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(900px) rotateX(${(-py * maxTilt).toFixed(2)}deg) rotateY(${(px * maxTilt).toFixed(2)}deg) translateY(-4px)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transition = "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)";
        card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)";
        setTimeout(() => {
          card.style.transition = "";
        }, 600);
      });
    });
  }

  /* ============ Code window typing ============ */
  const codeWindow = document.getElementById("codeWindow");
  const codeLines = codeWindow ? Array.from(codeWindow.querySelectorAll(".code-line")) : [];
  const caret = codeWindow ? codeWindow.querySelector(".code-caret") : null;

  if (codeLines.length) {
    const codeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          codeObserver.unobserve(entry.target);
          codeLines.forEach((line, i) => {
            setTimeout(() => {
              line.classList.add("is-typed");
              if (caret) {
                caret.style.bottom = "auto";
                caret.style.top = `${line.offsetTop + line.offsetHeight / 2 - 8}px`;
              }
            }, 180 + i * 220);
          });
          if (caret) setTimeout(() => caret.classList.add("is-visible"), 400);
        });
      },
      { threshold: 0.3 }
    );
    codeObserver.observe(codeWindow);
  }

  /* ============ Init ============ */
  initReveal();
  initCounters();

  async function init() {
    if (window.supabaseClient) {
      try {
        const { data, error } = await window.supabaseClient
          .from("site_content")
          .select("content")
          .eq("id", 1)
          .maybeSingle();
        if (!error && data && data.content && Object.keys(data.content).length > 0) {
          CONTENT = Object.assign({}, DEFAULTS, data.content);
        }
      } catch (e) {
        /* fallback to defaults */
      }
    }
    setLang(currentLang);
  }

  init();
})();
