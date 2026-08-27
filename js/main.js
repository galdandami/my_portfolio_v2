"use strict";

(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ============ Interactive background particles ============ */
  const bgCanvas = document.getElementById("bgCanvas");

  if (bgCanvas && finePointer && !reduceMotion) {
    const ctx = bgCanvas.getContext("2d");
    let w = 0, h = 0;
    let targetX = -9999, targetY = -9999;
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
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: Math.random() * 1.6 + 0.8,
        c: PALETTE[Math.floor(Math.random() * PALETTE.length)]
      }));
    }

    function step() {
      ctx.clearRect(0, 0, w, h);

      const LINK = 130;
      const MOUSE_RADIUS = 240;
      mouseX += (targetX - mouseX) * 0.3;
      mouseY += (targetY - mouseY) * 0.3;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.vx += (Math.random() - 0.5) * 0.02;
        p.vy += (Math.random() - 0.5) * 0.02;

        const dxm = p.x - mouseX;
        const dym = p.y - mouseY;
        const dm = Math.hypot(dxm, dym);
        if (dm < MOUSE_RADIUS && dm > 0.001) {
          const force = (1 - dm / MOUSE_RADIUS) * 0.85;
          p.vx += (dxm / dm) * force;
          p.vy += (dym / dm) * force;
        }

        const speed = Math.hypot(p.vx, p.vy);
        if (speed > 1.2) {
          p.vx = (p.vx / speed) * 1.2;
          p.vy = (p.vy / speed) * 1.2;
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

    const setMouse = (x, y) => {
      targetX = x;
      targetY = y;
    };

    window.addEventListener("pointermove", (e) => setMouse(e.clientX, e.clientY), { passive: true });
    document.addEventListener("mouseleave", () => {
      targetX = -9999;
      targetY = -9999;
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

    const interactive = "a, button, .tilt, input, textarea";
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
  const progress = document.getElementById("scrollProgress");

  const onScroll = () => {
    nav.classList.toggle("is-scrolled", window.scrollY > 24);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
    if (progress) progress.style.transform = "scaleX(" + p + ")";
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ============ Button ripple ============ */
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn");
    if (!btn || reduceMotion) return;
    const r = btn.getBoundingClientRect();
    const d = Math.max(r.width, r.height);
    const span = document.createElement("span");
    span.className = "ripple";
    span.style.width = span.style.height = d + "px";
    span.style.left = e.clientX - r.left - d / 2 + "px";
    span.style.top = e.clientY - r.top - d / 2 + "px";
    btn.appendChild(span);
    setTimeout(() => span.remove(), 650);
  });

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

  /* ============ Dynamic renders (build once, update texts on lang change) ============ */
  function renderProjects() {
    const grid = document.getElementById("projectsGrid");
    if (!grid) return;
    if (grid.children.length) {
      CONTENT.projects.forEach((p, i) => {
        const card = grid.children[i];
        if (!card) return;
        const titleEl = card.querySelector(".card-title");
        const descEl = card.querySelector(".card-desc");
        if (titleEl) titleEl.textContent = p.title[currentLang];
        if (descEl) descEl.textContent = p.desc[currentLang];
      });
      return;
    }
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
        card.addEventListener("click", () => window.open(p.url, "_blank", "noopener"));
      }

      card.appendChild(cover);
      card.appendChild(content);
      grid.appendChild(card);
    });
    initReveal();
    bindTilt();
    bindSpotlight();
  }

  const SKILL_MARKS = ["", "mark-pink", "mark-cyan"];

  function renderSkills() {
    const columns = document.getElementById("skillsColumns");
    if (!columns) return;
    if (columns.children.length) {
      CONTENT.skills.columns.forEach((c, i) => {
        const nameEl = columns.children[i] && columns.children[i].querySelector(".column-name");
        if (nameEl) nameEl.textContent = c.name[currentLang];
      });
      return;
    }
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
    bindSpotlight();
  }

  function renderStats() {
    const row = document.getElementById("statsRow");
    if (!row) return;
    const counts = row.querySelectorAll(".count");
    const labels = row.querySelectorAll(".stat-label");
    CONTENT.stats.forEach((s, i) => {
      const el = counts[i];
      if (el) {
        el.dataset.target = String(s.value);
        el.dataset.suffix = s.suffix || "";
      }
      if (labels[i]) labels[i].textContent = s.label[currentLang];
    });
  }

  function renderSocials() {
    const links = document.getElementById("footerLinks");
    if (!links) return;
    const SOCIAL_LABELS = {
      "Email": { en: "Email", ru: "Почта" }
    };
    if (links.children.length) {
      CONTENT.footer.socials.forEach((s, i) => {
        const el = links.children[i];
        if (!el) return;
        const label = (SOCIAL_LABELS[s.label] && SOCIAL_LABELS[s.label][currentLang]) || s.label;
        if (el.dataset.busy !== "1") el.textContent = label;
      });
      return;
    }
    const SAFE_SCHEMES = /^(https?:|mailto:|tel:)/i;
    CONTENT.footer.socials.forEach((s) => {
      const isEmail = s.label === "Email" || s.label.toLowerCase().includes("email") || s.url.startsWith("mailto:");
      const el = document.createElement(isEmail ? "button" : "a");
      el.type = isEmail ? "button" : undefined;
      el.className = "footer-link";
      el.textContent = (SOCIAL_LABELS[s.label] && SOCIAL_LABELS[s.label][currentLang]) || s.label;
      if (isEmail) {
        el.addEventListener("click", async () => {
          const label = el.textContent;
          try {
            await navigator.clipboard.writeText(CONTENT.contact.email);
            el.dataset.busy = "1";
            el.textContent = "Copied!";
            setTimeout(() => {
              el.textContent = label;
              el.dataset.busy = "";
            }, 1600);
          } catch (err) {
            window.location.href = "mailto:" + CONTENT.contact.email;
          }
        });
      } else if (SAFE_SCHEMES.test(s.url)) {
        el.href = s.url;
        if (!s.url.startsWith("mailto:") && !s.url.startsWith("tel:")) {
          el.target = "_blank";
          el.rel = "noopener";
        }
      }
      links.appendChild(el);
    });
  }

  function renderContact() {
    const email = document.getElementById("contactEmail");
    const cta = document.getElementById("contactCta");
    const href = "mailto:" + CONTENT.contact.email;
    if (email) {
      email.textContent = CONTENT.contact.email;
      email.href = href;
      if (!email.dataset.bound) {
        email.dataset.bound = "1";
        email.addEventListener("click", async (e) => {
          e.preventDefault();
          try {
            await navigator.clipboard.writeText(CONTENT.contact.email);
            email.classList.add("is-copied");
            const label = email.textContent;
            email.textContent = "Copied!";
            setTimeout(() => {
              email.textContent = label;
              email.classList.remove("is-copied");
            }, 1600);
          } catch (err) {
            window.location.href = href;
          }
        });
      }
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

  function bindSpotlight() {
    if (!finePointer || reduceMotion) return;
    document.querySelectorAll(".project-card, .skill-column").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", (e.clientX - r.left) + "px");
        el.style.setProperty("--my", (e.clientY - r.top) + "px");
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
            }, 40 + i * 60);
          });
          if (caret) setTimeout(() => caret.classList.add("is-visible"), 150);
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
    try {
      const url = window.SB_CONFIG && window.SB_CONFIG.url;
      const anonKey = window.SB_CONFIG && window.SB_CONFIG.anonKey;
      if (url && anonKey && url.startsWith("https://") && !anonKey.includes("PASTE")) {
        const res = await fetch(url + "/rest/v1/site_content?id=eq.1&select=content", {
          headers: {
            apikey: anonKey,
            Authorization: "Bearer " + anonKey
          }
        });
        if (res.ok) {
          const rows = await res.json();
          const data = Array.isArray(rows) && rows[0];
          if (data && data.content && typeof data.content === "object" && Object.keys(data.content).length > 0) {
            CONTENT = Object.assign({}, DEFAULTS, data.content);
          }
        }
      }
    } catch (e) {
      /* fallback to defaults */
    }
    buildMarquee();
    setLang(currentLang);
    initCounters();
  }

  function buildMarquee() {
    const track = document.getElementById("marqueeTrack");
    if (!track || track.children.length) return;
    const items = [];
    ((CONTENT.skills && CONTENT.skills.columns) || []).forEach((c) => {
      (c.items || []).forEach((it) => items.push(it));
    });
    if (!items.length) return;
    const makeGroup = () => {
      const g = document.createElement("div");
      g.className = "marquee-group";
      items.forEach((it) => {
        const s = document.createElement("span");
        s.className = "marquee-item";
        s.textContent = it;
        g.appendChild(s);
      });
      return g;
    };
    track.appendChild(makeGroup());
    track.appendChild(makeGroup());
  }

  /* ============ Hero entrance trigger ============ */
  const addLoaded = () => document.body.classList.add("is-loaded");
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", addLoaded);
  else addLoaded();

  /* ============ Contact modal ============ */
  const contactModal = document.getElementById("contactModal");
  const contactChannels = document.getElementById("contactChannels");
  const contactForm = document.getElementById("contactForm");

  function openContactModal() {
    if (!contactModal) return;
    contactModal.classList.add("is-open");
    contactModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  }

  function closeContactModal() {
    if (!contactModal) return;
    contactModal.classList.remove("is-open");
    contactModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }

  function renderChannels() {
    if (!contactChannels || contactChannels.children.length) return;
    const icons = {
      Max: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v3.3M12 18.2v3.3M2.5 12h3.3M18.2 12h3.3M5.3 5.3l2.4 2.4M16.3 16.3l2.4 2.4M18.7 5.3l-2.4 2.4M7.7 16.3l-2.4 2.4"/></svg>',
      Telegram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4Z"/></svg>',
      Email: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h9c1.1 0 2 .9 2 2"/><path d="m16 3-5 5 5 5"/><path d="m16 3v6.5"/><path d="m12 8h4"/></svg>'
    };
    CONTENT.footer.socials.forEach((s) => {
      const isEmail = s.label === "Email" || s.label.toLowerCase().includes("email") || s.url.startsWith("mailto:");
      const el = document.createElement(isEmail ? "button" : "a");
      el.type = isEmail ? "button" : undefined;
      const key = Object.keys(icons).find((k) => s.label === k || s.label.toLowerCase().includes(k.toLowerCase())) || "Max";
      el.className = "contact-channel is-" + key.toLowerCase();
      if (isEmail) {
        el.dataset.copyEmail = "1";
      } else {
        if (/^https?:\/\//i.test(s.url)) {
          el.href = s.url;
          el.target = "_blank";
          el.rel = "noopener";
        }
      }
      el.innerHTML = icons[key] + `<span class="channel-label">${escapeHtml(s.label)}</span>`;
      contactChannels.appendChild(el);
    });
  }

  if (contactChannels) contactChannels.addEventListener("click", async (e) => {
    const btn = e.target.closest("[data-copy-email]");
    if (!btn) return;
    const email = CONTENT.contact.email;
    try {
      await navigator.clipboard.writeText(email);
      const label = btn.querySelector(".channel-label");
      if (label) label.textContent = "Copied!";
      btn.classList.add("is-copied");
      setTimeout(() => {
        if (label) label.textContent = "Email";
        btn.classList.remove("is-copied");
      }, 1600);
    } catch (err) {
      window.location.href = "mailto:" + email;
    }
  });

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function markInvalid(input) {
    if (!input) return;
    input.classList.add("is-invalid");
  }

  function clearInvalid(input) {
    if (!input) return;
    input.classList.remove("is-invalid");
  }

  async function handleContactSubmit(e) {
    e.preventDefault();
    const name = document.getElementById("contactName");
    const channel = document.getElementById("contactChannel");
    const contact = document.getElementById("contactContact");
    const title = document.getElementById("contactTitle");
    const msg = document.getElementById("contactMsg");
    const note = document.getElementById("contactNote");
    const submitBtn = contactForm.querySelector(".contact-form-btn");
    if (!submitBtn) return;
    const originalLabel = submitBtn.textContent;

    const nameVal = (name && name.value || "").trim();
    const channelVal = (channel && channel.value || "").trim();
    const contactVal = (contact && contact.value || "").trim();
    if (!nameVal) {
      markInvalid(name);
      name && name.focus();
      return;
    }
    if (!channelVal) {
      markInvalid(channel);
      channel && channel.focus();
      return;
    }
    if (!contactVal) {
      markInvalid(contact);
      contact && contact.focus();
      return;
    }
    clearInvalid(name);
    clearInvalid(channel);
    clearInvalid(contact);

    submitBtn.disabled = true;
    submitBtn.textContent = "…";
    const payload = {
      name: nameVal,
      contact: channelVal + ": " + contactVal,
      title: (title && title.value || "").trim(),
      message: (msg && msg.value || "").trim(),
      note: (note && note.value || "").trim()
    };
    const sendViaBot = async () => {
      const res = await fetch(window.SB_CONFIG.leadUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("bot failed");
      return res.json();
    };
    const sendToSupabase = async () => {
      const res = await fetch(window.SB_CONFIG.url + "/rest/v1/leads", {
        method: "POST",
        headers: {
          "apikey": window.SB_CONFIG.anonKey,
          "Authorization": "Bearer " + window.SB_CONFIG.anonKey,
          "Content-Type": "application/json",
          "Prefer": "return=minimal"
        },
        body: JSON.stringify({
          name: payload.name,
          contact: payload.contact,
          title: payload.title,
          message: payload.message,
          note: payload.note
        })
      });
      if (!res.ok) throw new Error("supabase failed");
    };
    try {
      await Promise.allSettled([sendViaBot(), sendToSupabase()]);
      submitBtn.textContent = "✓";
      setTimeout(closeContactModal, 900);
    } catch (err) {
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
    }
  }

  ["contactName", "contactChannel", "contactContact"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", () => clearInvalid(el));
    if (el) el.addEventListener("change", () => clearInvalid(el));
  });

  const modalTriggers = document.querySelectorAll(".modal-trigger");
  modalTriggers.forEach((t) => t.addEventListener("click", (e) => {
    e.preventDefault();
    openContactModal();
  }));

  const contactModalClose = document.getElementById("contactModalClose");
  if (contactModalClose) contactModalClose.addEventListener("click", closeContactModal);
  if (contactModal) contactModal.addEventListener("click", (e) => {
    if (e.target === contactModal) closeContactModal();
  });
  if (contactForm) contactForm.addEventListener("submit", handleContactSubmit);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeContactModal();
  });

  init();
  renderChannels();
})();
