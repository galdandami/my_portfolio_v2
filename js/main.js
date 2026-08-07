"use strict";

(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ============ Interactive background particles ============ */
  const bgCanvas = document.getElementById("bgCanvas");

  if (bgCanvas && finePointer && !reduceMotion) {
    const ctx = bgCanvas.getContext("2d");
    let w = 0, h = 0;
    let mouseX = -9999, mouseY = -9999;
    let rafId = null;
    const PALETTE = [
      [168, 85, 247],
      [236, 72, 153],
      [34, 211, 238]
    ];
    let particles = [];

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      bgCanvas.width = Math.round(w * dpr);
      bgCanvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(Math.round((w * h) / 16000), 110);
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.6 + 0.8,
        c: PALETTE[Math.floor(Math.random() * PALETTE.length)]
      }));
    }

    function step() {
      ctx.clearRect(0, 0, w, h);

      const LINK = 130;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.vx += (Math.random() - 0.5) * 0.03;
        p.vy += (Math.random() - 0.5) * 0.03;

        const dxm = p.x - mouseX;
        const dym = p.y - mouseY;
        const dm = Math.hypot(dxm, dym);
        if (dm < 150 && dm > 0.001) {
          const force = (1 - dm / 150) * 1.1;
          p.vx += (dxm / dm) * force;
          p.vy += (dym / dm) * force;
        }

        const speed = Math.hypot(p.vx, p.vy);
        if (speed > 1.4) {
          p.vx = (p.vx / speed) * 1.4;
          p.vy = (p.vy / speed) * 1.4;
        }
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const d = Math.hypot(dx, dy);
          if (d < LINK) {
            const alpha = (1 - d / LINK) * 0.28;
            ctx.strokeStyle = `rgba(${p.c[0]}, ${p.c[1]}, ${p.c[2]}, ${alpha})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }

      for (const p of particles) {
        ctx.fillStyle = `rgba(${p.c[0]}, ${p.c[1]}, ${p.c[2]}, 0.8)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      rafId = requestAnimationFrame(step);
    }

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    document.addEventListener("mouseleave", () => {
      mouseX = -9999;
      mouseY = -9999;
    });
    window.addEventListener("resize", resize);

    resize();
    step();
    window.addEventListener("beforeunload", () => {
      if (rafId) cancelAnimationFrame(rafId);
    });
  } else if (bgCanvas) {
    bgCanvas.style.display = "none";
  }

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
  let currentLang = new URLSearchParams(location.search).get("lang") || localStorage.getItem("danis-lang") || "en";
  const langBtns = document.querySelectorAll(".lang-btn");

  function buildDict(lang) {
    const d = {};
    function walk(prefix, node) {
      if (node === null || typeof node !== "object") {
        if (prefix) d[prefix] = typeof node === "string" ? node : String(node);
        return;
      }
      if (Array.isArray(node)) return;
      if (typeof node.en === "string" && typeof node.ru === "string") {
        d[prefix] = node[lang];
        return;
      }
      for (const [k, v] of Object.entries(node)) {
        walk(prefix ? prefix + "." + k : k, v);
      }
    }
    walk("", CONTENT);
    CONTENT.stats.forEach((s, i) => {
      d["stat." + (i + 1)] = s.label[lang];
    });
    CONTENT.projects.forEach((p, i) => {
      d["proj." + (i + 1) + ".title"] = p.title[lang];
      d["proj." + (i + 1) + ".desc"] = p.desc[lang];
    });
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
    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      const key = el.getAttribute("data-i18n-aria");
      if (dict[key] !== undefined) el.setAttribute("aria-label", dict[key]);
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

      if (p.url && /^https?:\/\//i.test(p.url)) {
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
    const SOCIAL_LABELS = {
      "Email": { en: "Email", ru: "Почта" }
    };
    const SAFE_SCHEMES = /^(https?:|mailto:|tel:)/i;
    CONTENT.footer.socials.forEach((s) => {
      const a = document.createElement("a");
      a.className = "footer-link";
      a.textContent = (SOCIAL_LABELS[s.label] && SOCIAL_LABELS[s.label][currentLang]) || s.label;
      if (SAFE_SCHEMES.test(s.url)) {
        a.href = s.url;
        if (!s.url.startsWith("mailto:") && !s.url.startsWith("tel:")) {
          a.target = "_blank";
          a.rel = "noopener";
        }
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
