"use strict";

(function () {
  const $ = (id) => document.getElementById(id);
  const deepCopy = (o) => JSON.parse(JSON.stringify(o));

  /* ============ i18n ============ */
  const I18N = {
    en: {
      "label.content": "CONTENT",
      "label.general": "General",
      "label.hero": "Hero",
      "label.stats": "Stats",
      "label.projects": "Projects",
      "label.skills": "Skills",
      "label.contact": "Contact",
      "page.general.kicker": "// General",
      "page.hero.kicker": "// Hero",
      "page.stats.kicker": "// Stats",
      "page.projects.kicker": "// Projects",
      "page.skills.kicker": "// Skills",
      "page.contact.kicker": "// Contact",
      "page.general.title": "General",
      "page.hero.title": "Hero",
      "page.stats.title": "Stats",
      "page.projects.title": "Projects",
      "page.skills.title": "Skills",
      "page.contact.title": "Contact",
      "user.role": "Administrator",
      "site.link": "open site →",
      "login.title": "Sign in",
      "login.sub": "Only the site owner can access the editor",
      "login.email": "Email",
      "login.password": "Password",
      "login.btn": "Sign in",
      "login.error": "Wrong email or password",
      "login.remember": "Remember me",
      "login.logout": "Log out",
      "status.loading": "Loading...",
      "status.ok": "Connected",
      "status.notconf": "Not configured",
      "status.offline": "Offline",
      "status.last": "Last published: {{time}}",
      "status.never": "Never published",
      "btn.save": "Save changes",
      "btn.saving": "Saving...",
      "btn.reset": "Reset to defaults",
      "btn.add": "+ Add project",
      "btn.addSocial": "+ Add link",
      "grp.meta": "Site meta",
      "grp.nav": "Navigation",
      "grp.footer": "Footer",
      "grp.hero": "Hero text",
      "grp.code": "Code window",
      "grp.stats": "Stat numbers",
      "grp.projHeader": "Section header",
      "grp.projects": "Projects",
      "grp.skillsHeader": "Section header",
      "grp.skills": "Skill groups",
      "grp.contactHeader": "Section header",
      "grp.contactInfo": "Contact details",
      "lbl.title": "Title",
      "lbl.desc": "Description",
      "lbl.badge": "Badge text",
      "lbl.line1": "Headline, line 1",
      "lbl.line2": "Headline, line 2",
      "lbl.sub": "Subtitle",
      "lbl.ctaWorks": "CTA \"View my work\"",
      "lbl.ctaContact": "CTA \"Contact\"",
      "lbl.name": "Name",
      "lbl.role": "Role",
      "lbl.stack": "Stack",
      "lbl.experience": "Experience",
      "lbl.available": "Available",
      "lbl.status": "Status",
      "lbl.cta": "Button text",
      "lbl.works": "Works",
      "lbl.about": "About",
      "lbl.stack": "Stack",
      "lbl.contact": "Contact",
      "lbl.copyright": "Copyright",
      "lbl.socials": "Social links",
      "lbl.label": "Label",
      "lbl.url": "URL",
      "lbl.value": "Value",
      "lbl.suffix": "Suffix",
      "lbl.image": "Cover image URL",
      "lbl.tags": "Tags (comma separated)",
      "lbl.link": "Link (optional)",
      "lbl.items": "Items (one per line)",
      "lbl.kicker": "Kicker",
      "lbl.all": "\"All projects\" link",
      "lbl.email": "Email",
      "item.project": "Project {{n}}",
      "item.stat": "Stat {{n}}",
      "item.skill": "Group {{n}}",
      "item.social": "Link {{n}}",
      "act.remove": "Remove",
      "act.up": "Move up",
      "act.down": "Move down",
      "modal.cancel": "Cancel",
      "modal.confirm": "Confirm",
      "confirm.title": "Are you sure?",
      "confirm.discard": "Unsaved changes will be lost.",
      "confirm.deleteProject": "This project will be removed.",
      "confirm.deleteSocial": "This link will be removed.",
      "confirm.reset": "All fields will be restored to the default content.",
      "toast.saved": "Changes published",
      "toast.reset": "Defaults loaded — press Save to publish",
      "toast.notconf": "Set your Supabase URL and anon key in js/config.js",
      "toast.saveError": "Save failed: {{msg}}",
      "toast.loadError": "Could not load content: {{msg}}"
    },
    ru: {
      "label.content": "КОНТЕНТ",
      "label.general": "Общее",
      "label.hero": "Главный экран",
      "label.stats": "Статистика",
      "label.projects": "Проекты",
      "label.skills": "Навыки",
      "label.contact": "Контакты",
      "page.general.kicker": "// Общее",
      "page.hero.kicker": "// Главный экран",
      "page.stats.kicker": "// Статистика",
      "page.projects.kicker": "// Проекты",
      "page.skills.kicker": "// Навыки",
      "page.contact.kicker": "// Контакты",
      "page.general.title": "Общее",
      "page.hero.title": "Главный экран",
      "page.stats.title": "Статистика",
      "page.projects.title": "Проекты",
      "page.skills.title": "Навыки",
      "page.contact.title": "Контакты",
      "user.role": "Администратор",
      "site.link": "открыть сайт →",
      "login.title": "Вход",
      "login.sub": "Доступ к редактору только у владельца сайта",
      "login.email": "Email",
      "login.password": "Пароль",
      "login.btn": "Войти",
      "login.error": "Неверный email или пароль",
      "login.remember": "Запомнить меня",
      "login.logout": "Выйти",
      "status.loading": "Загрузка...",
      "status.ok": "Подключено",
      "status.notconf": "Не настроено",
      "status.offline": "Офлайн",
      "status.last": "Опубликовано: {{time}}",
      "status.never": "Ещё не публиковалось",
      "btn.save": "Сохранить",
      "btn.saving": "Сохранение...",
      "btn.reset": "Сбросить к умолчанию",
      "btn.add": "+ Добавить проект",
      "btn.addSocial": "+ Добавить ссылку",
      "grp.meta": "Мета сайта",
      "grp.nav": "Навигация",
      "grp.footer": "Подвал",
      "grp.hero": "Текст главного экрана",
      "grp.code": "Окно кода",
      "grp.stats": "Цифры статистики",
      "grp.projHeader": "Заголовок секции",
      "grp.projects": "Проекты",
      "grp.skillsHeader": "Заголовок секции",
      "grp.skills": "Группы навыков",
      "grp.contactHeader": "Заголовок секции",
      "grp.contactInfo": "Контактные данные",
      "lbl.title": "Заголовок",
      "lbl.desc": "Описание",
      "lbl.badge": "Текст бейджа",
      "lbl.line1": "Заголовок, строка 1",
      "lbl.line2": "Заголовок, строка 2",
      "lbl.sub": "Подзаголовок",
      "lbl.ctaWorks": "Кнопка «Смотреть работы»",
      "lbl.ctaContact": "Кнопка «Связаться»",
      "lbl.name": "Имя",
      "lbl.role": "Роль",
      "lbl.stack": "Стек",
      "lbl.experience": "Опыт",
      "lbl.available": "Доступен",
      "lbl.status": "Статус",
      "lbl.cta": "Текст кнопки",
      "lbl.works": "Работы",
      "lbl.about": "Обо мне",
      "lbl.contact": "Контакты",
      "lbl.copyright": "Копирайт",
      "lbl.socials": "Соцссылки",
      "lbl.label": "Название",
      "lbl.url": "URL",
      "lbl.value": "Значение",
      "lbl.suffix": "Суффикс",
      "lbl.image": "URL обложки",
      "lbl.tags": "Теги (через запятую)",
      "lbl.link": "Ссылка (необязательно)",
      "lbl.items": "Навыки (по одному в строке)",
      "lbl.kicker": "Корочка (kicker)",
      "lbl.all": "Ссылка «Все проекты»",
      "lbl.email": "Email",
      "item.project": "Проект {{n}}",
      "item.stat": "Показатель {{n}}",
      "item.skill": "Группа {{n}}",
      "item.social": "Ссылка {{n}}",
      "act.remove": "Удалить",
      "act.up": "Выше",
      "act.down": "Ниже",
      "modal.cancel": "Отмена",
      "modal.confirm": "Подтвердить",
      "confirm.title": "Вы уверены?",
      "confirm.discard": "Несохранённые изменения будут потеряны.",
      "confirm.deleteProject": "Этот проект будет удалён.",
      "confirm.deleteSocial": "Эта ссылка будет удалена.",
      "confirm.reset": "Все поля вернутся к контенту по умолчанию.",
      "toast.saved": "Изменения опубликованы",
      "toast.reset": "Загружены значения по умолчанию — нажмите «Сохранить»",
      "toast.notconf": "Вставьте URL и anon-ключ Supabase в js/config.js",
      "toast.saveError": "Ошибка сохранения: {{msg}}",
      "toast.loadError": "Не удалось загрузить контент: {{msg}}"
    }
  };

  let currentLang = localStorage.getItem("danis-admin-lang") || "en";
  const langBtns = document.querySelectorAll(".lang-btn");

  function t(key, params) {
    let value = (I18N[currentLang] && I18N[currentLang][key]) ?? I18N.en[key];
    if (value !== undefined && params) {
      for (const name of Object.keys(params)) {
        value = value.split("{{" + name + "}}").join(String(params[name]));
      }
    }
    return value;
  }

  function setLang(lang) {
    currentLang = lang;
    localStorage.setItem("danis-admin-lang", lang);
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      el.textContent = t(el.dataset.i18n);
    });
    langBtns.forEach((b) => b.classList.toggle("is-active", b.dataset.lang === lang));
    state.working = collect();
    fill(state.working);
    applyPageMeta();
  }

  langBtns.forEach((b) => b.addEventListener("click", () => setLang(b.dataset.lang)));

  /* ============ Toast ============ */
  const toastEl = $("toast");
  let toastTimer = null;

  function toast(message) {
    toastEl.textContent = message;
    toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toastEl.hidden = true; }, 3200);
  }

  /* ============ Sidebar & sections ============ */
  const sidebar = $("sidebar");
  const burger = $("burger");
  const backdrop = $("sidebarBackdrop");
  const pageKicker = $("pageKicker");
  const pageTitle = $("pageTitle");
  let activeSection = "general";

  function applyPageMeta() {
    pageKicker.textContent = t("page." + activeSection + ".kicker");
    pageTitle.textContent = t("page." + activeSection + ".title");
    document.title = "Pulse Admin — " + t("page." + activeSection + ".title");
  }

  function closeSidebar() {
    sidebar.classList.remove("is-open");
    burger.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    backdrop.hidden = true;
    backdrop.classList.remove("is-visible");
  }

  burger.addEventListener("click", () => {
    const open = sidebar.classList.toggle("is-open");
    burger.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    backdrop.hidden = !open;
    if (open) requestAnimationFrame(() => backdrop.classList.add("is-visible"));
  });

  backdrop.addEventListener("click", closeSidebar);

  document.querySelectorAll(".side-item").forEach((item) => {
    item.addEventListener("click", () => {
      document.querySelectorAll(".side-item").forEach((el) => el.classList.remove("is-active"));
      item.classList.add("is-active");
      activeSection = item.dataset.nav;
      document.querySelectorAll(".editor-section").forEach((sec) => {
        sec.hidden = sec.dataset.section !== activeSection;
      });
      applyPageMeta();
      closeSidebar();
    });
  });

  /* ============ Confirm modal ============ */
  const modalBackdrop = $("modalBackdrop");
  const modalText = $("modalText");
  const modalCancel = $("modalCancel");
  const modalConfirm = $("modalConfirm");
  let modalAction = null;

  function askConfirm(messageKey, onConfirm) {
    modalText.textContent = t(messageKey);
    modalAction = onConfirm;
    modalBackdrop.hidden = false;
    requestAnimationFrame(() => modalBackdrop.classList.add("is-visible"));
  }

  function closeModal() {
    modalBackdrop.classList.remove("is-visible");
    setTimeout(() => { modalBackdrop.hidden = true; }, 250);
    modalAction = null;
  }

  modalCancel.addEventListener("click", closeModal);
  modalBackdrop.addEventListener("click", (e) => {
    if (e.target === modalBackdrop) closeModal();
  });
  modalConfirm.addEventListener("click", () => {
    const action = modalAction;
    closeModal();
    if (action) action();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modalBackdrop.hidden) closeModal();
  });

  /* ============ Content state ============ */
  const state = { working: deepCopy(window.SITE_DEFAULTS) };
  let lastPublished = null;

  const pair = (p) => ({ en: p["-en"].value.trim(), ru: p["-ru"].value.trim() });
  const val = (p) => p.value.trim();
  const pairVal = (prefix) => pair({ "-en": $(prefix + "-en"), "-ru": $(prefix + "-ru") });

  /* ============ Repeaters: projects ============ */
  const projectsList = $("projectsList");

  function renderProjects() {
    projectsList.innerHTML = "";
    state.working.projects.forEach((p, i) => {
      const card = document.createElement("div");
      card.className = "item-card";
      card.dataset.index = String(i);

      const head = document.createElement("div");
      head.className = "item-head";
      const title = document.createElement("span");
      title.className = "item-title";
      title.textContent = t("item.project", { n: i + 1 });
      const actions = document.createElement("div");
      actions.className = "item-actions";
      actions.innerHTML =
        '<button class="mini-btn" data-act="up" title="' + t("act.up") + '">↑</button>' +
        '<button class="mini-btn" data-act="down" title="' + t("act.down") + '">↓</button>' +
        '<button class="mini-btn is-danger" data-act="remove" title="' + t("act.remove") + '">×</button>';
      head.appendChild(title);
      head.appendChild(actions);

      const imgField = document.createElement("div");
      imgField.className = "field";
      const imgLabel = document.createElement("span");
      imgLabel.className = "field-label";
      imgLabel.textContent = t("lbl.image");
      const imgInput = document.createElement("input");
      imgInput.type = "text";
      imgInput.id = "f-proj-" + i + "-image";
      imgInput.value = p.image;
      imgInput.autocomplete = "off";
      const preview = document.createElement("img");
      preview.className = "img-preview" + (p.image ? " is-visible" : "");
      preview.id = "preview-" + i;
      preview.alt = "";
      if (p.image) preview.src = p.image;
      imgField.appendChild(imgLabel);
      imgField.appendChild(imgInput);
      imgField.appendChild(preview);

      const rowTitle = fieldRow([
        fieldPair("title", "f-proj-" + i + "-title", p.title),
      ]);

      const rowDesc = fieldRow([
        fieldPair("desc", "f-proj-" + i + "-desc", p.desc, true),
      ]);

      const rowMeta = fieldRow([
        fieldSingle("tags", "f-proj-" + i + "-tags", p.tags.join(", ")),
        fieldSingle("link", "f-proj-" + i + "-link", p.url),
      ]);

      card.appendChild(head);
      card.appendChild(imgField);
      card.appendChild(rowTitle);
      card.appendChild(rowDesc);
      card.appendChild(rowMeta);
      projectsList.appendChild(card);
    });
  }

  /* ============ Repeaters: stats ============ */
  const statsList = $("statsList");

  function renderStats() {
    statsList.innerHTML = "";
    state.working.stats.forEach((s, i) => {
      const card = document.createElement("div");
      card.className = "item-card";

      const head = document.createElement("div");
      head.className = "item-head";
      const title = document.createElement("span");
      title.className = "item-title";
      title.textContent = t("item.stat", { n: i + 1 });
      head.appendChild(title);

      const rowNum = fieldRow([
        {
          label: t("lbl.value"),
          el: numberInput("f-stat-" + i + "-value", s.value)
        },
        {
          label: t("lbl.suffix"),
          el: textInput("f-stat-" + i + "-suffix", s.suffix)
        }
      ]);

      const rowLabel = fieldRow([
        fieldPair("label", "f-stat-" + i + "-label", s.label),
      ]);

      card.appendChild(head);
      card.appendChild(rowNum);
      card.appendChild(rowLabel);
      statsList.appendChild(card);
    });
  }

  /* ============ Repeaters: skills ============ */
  const skillsList = $("skillsList");

  function renderSkills() {
    skillsList.innerHTML = "";
    state.working.skills.columns.forEach((c, i) => {
      const card = document.createElement("div");
      card.className = "item-card";

      const head = document.createElement("div");
      head.className = "item-head";
      const title = document.createElement("span");
      title.className = "item-title";
      title.textContent = t("item.skill", { n: i + 1 });
      head.appendChild(title);

      const rowName = fieldRow([
        fieldPair("name", "f-skill-" + i + "-name", c.name),
      ]);

      const itemsField = document.createElement("div");
      itemsField.className = "field";
      const itemsLabel = document.createElement("span");
      itemsLabel.className = "field-label";
      itemsLabel.textContent = t("lbl.items");
      const itemsTa = document.createElement("textarea");
      itemsTa.id = "f-skill-" + i + "-items";
      itemsTa.rows = 6;
      itemsTa.value = c.items.join("\n");
      itemsField.appendChild(itemsLabel);
      itemsField.appendChild(itemsTa);

      card.appendChild(head);
      card.appendChild(rowName);
      card.appendChild(itemsField);
      skillsList.appendChild(card);
    });
  }

  /* ============ Repeaters: socials ============ */
  const socialsList = $("socialsList");

  function renderSocials() {
    socialsList.innerHTML = "";
    state.working.footer.socials.forEach((s, i) => {
      const card = document.createElement("div");
      card.className = "item-card";
      card.dataset.index = String(i);

      const head = document.createElement("div");
      head.className = "item-head";
      const title = document.createElement("span");
      title.className = "item-title";
      title.textContent = t("item.social", { n: i + 1 });
      const actions = document.createElement("div");
      actions.className = "item-actions";
      actions.innerHTML = '<button class="mini-btn is-danger" data-act="remove" title="' + t("act.remove") + '">×</button>';
      head.appendChild(title);
      head.appendChild(actions);

      const row = fieldRow([
        {
          label: t("lbl.label"),
          el: textInput("f-social-" + i + "-label", s.label)
        },
        {
          label: t("lbl.url"),
          el: textInput("f-social-" + i + "-url", s.url)
        }
      ]);

      card.appendChild(head);
      card.appendChild(row);
      socialsList.appendChild(card);
    });
  }

  /* ============ Field builders ============ */
  function fieldRow(items) {
    const flat = items.flat();
    const row = document.createElement("div");
    row.className = "field-row";
    flat.forEach((it) => {
      const field = document.createElement("div");
      field.className = "field";
      const label = document.createElement("span");
      label.className = "field-label";
      if (it.badge) {
        const badge = document.createElement("span");
        badge.className = "lang-badge" + (it.badge === "ru" ? " lang-badge-ru" : "");
        badge.textContent = it.badge;
        label.appendChild(badge);
      }
      label.appendChild(document.createTextNode(it.label));
      field.appendChild(label);
      field.appendChild(it.el);
      row.appendChild(field);
    });
    return row;
  }

  function textInput(id, value) {
    const input = document.createElement("input");
    input.type = "text";
    input.id = id;
    input.value = value;
    input.autocomplete = "off";
    return input;
  }

  function numberInput(id, value) {
    const input = document.createElement("input");
    input.type = "number";
    input.id = id;
    input.min = "0";
    input.value = value;
    return input;
  }

  function taInput(id, value) {
    const ta = document.createElement("textarea");
    ta.id = id;
    ta.rows = 3;
    ta.value = value;
    return ta;
  }

  function fieldPair(labelKey, prefix, value, textarea) {
    const label = t(labelKey);
    const mk = (badge, id, v) => ({
      badge: badge,
      label: label,
      el: textarea ? taInput(id, v) : textInput(id, v)
    });
    return [
      mk("en", prefix + "-en", value.en),
      mk("ru", prefix + "-ru", value.ru)
    ];
  }

  function fieldSingle(labelKey, id, value) {
    return { label: t(labelKey), el: textInput(id, value) };
  }

  /* ============ Collect & fill ============ */
  function collectProjects() {
    return state.working.projects.map((p, i) => ({
      title: { en: $(("f-proj-" + i + "-title-en")).value.trim(), ru: $("f-proj-" + i + "-title-ru").value.trim() },
      desc: { en: $("f-proj-" + i + "-desc-en").value.trim(), ru: $("f-proj-" + i + "-desc-ru").value.trim() },
      tags: $("f-proj-" + i + "-tags").value.split(",").map((s) => s.trim()).filter(Boolean),
      image: $("f-proj-" + i + "-image").value.trim(),
      url: $("f-proj-" + i + "-link").value.trim()
    }));
  }

  function collectStats() {
    return state.working.stats.map((s, i) => ({
      value: Math.max(0, Number($("f-stat-" + i + "-value").value) || 0),
      suffix: $("f-stat-" + i + "-suffix").value.trim(),
      label: { en: $("f-stat-" + i + "-label-en").value.trim(), ru: $("f-stat-" + i + "-label-ru").value.trim() }
    }));
  }

  function collectSkills() {
    return state.working.skills.columns.map((c, i) => ({
      name: { en: $("f-skill-" + i + "-name-en").value.trim(), ru: $("f-skill-" + i + "-name-ru").value.trim() },
      items: $("f-skill-" + i + "-items").value.split("\n").map((s) => s.trim()).filter(Boolean)
    }));
  }

  function collectSocials() {
    return state.working.footer.socials.map((s, i) => ({
      label: $("f-social-" + i + "-label").value.trim(),
      url: $("f-social-" + i + "-url").value.trim()
    }));
  }

  function collect() {
    return {
      meta: { title: pairVal("f-meta-title"), desc: pairVal("f-meta-desc") },
      badge: pairVal("f-hero-badge"),
      "hero.line1": pairVal("f-hero-line1"),
      "hero.line2": pairVal("f-hero-line2"),
      "hero.sub": pairVal("f-hero-sub"),
      "cta.works": pairVal("f-hero-cta-works"),
      "cta.contact": pairVal("f-hero-cta-contact"),
      code: {
        name: pairVal("f-code-name"),
        role: val($("f-code-role")),
        stack: val($("f-code-stack")),
        experience: val($("f-code-exp")),
        available: $("f-code-avail").checked,
        status: pairVal("f-code-status")
      },
      nav: {
        works: pairVal("f-nav-works"),
        about: pairVal("f-nav-about"),
        stack: pairVal("f-nav-stack"),
        contact: pairVal("f-nav-contact"),
        cta: pairVal("f-nav-cta")
      },
      stats: collectStats(),
      proj: {
        kicker: pairVal("f-proj-kicker"),
        title: pairVal("f-proj-title"),
        sub: pairVal("f-proj-sub"),
        all: pairVal("f-proj-all")
      },
      projects: collectProjects(),
      skills: {
        kicker: pairVal("f-skills-kicker"),
        title: pairVal("f-skills-title"),
        columns: collectSkills()
      },
      contact: {
        kicker: pairVal("f-contact-kicker"),
        title: pairVal("f-contact-title"),
        sub: pairVal("f-contact-sub"),
        cta: pairVal("f-contact-cta"),
        email: val($("f-contact-email"))
      },
      footer: {
        copyright: pairVal("f-footer-copy"),
        socials: collectSocials()
      }
    };
  }

  function fill(c) {
    const set = (id, v) => { $(id).value = v; };
    set("f-meta-title-en", c.meta.title.en); set("f-meta-title-ru", c.meta.title.ru);
    set("f-meta-desc-en", c.meta.desc.en); set("f-meta-desc-ru", c.meta.desc.ru);
    set("f-hero-badge-en", c.badge.en); set("f-hero-badge-ru", c.badge.ru);
    set("f-hero-line1-en", c["hero.line1"].en); set("f-hero-line1-ru", c["hero.line1"].ru);
    set("f-hero-line2-en", c["hero.line2"].en); set("f-hero-line2-ru", c["hero.line2"].ru);
    set("f-hero-sub-en", c["hero.sub"].en); set("f-hero-sub-ru", c["hero.sub"].ru);
    set("f-hero-cta-works-en", c["cta.works"].en); set("f-hero-cta-works-ru", c["cta.works"].ru);
    set("f-hero-cta-contact-en", c["cta.contact"].en); set("f-hero-cta-contact-ru", c["cta.contact"].ru);
    set("f-code-name-en", c.code.name.en); set("f-code-name-ru", c.code.name.ru);
    set("f-code-role", c.code.role);
    set("f-code-stack", c.code.stack);
    set("f-code-exp", c.code.experience);
    $("f-code-avail").checked = Boolean(c.code.available);
    set("f-code-status-en", c.code.status.en); set("f-code-status-ru", c.code.status.ru);
    set("f-nav-works-en", c.nav.works.en); set("f-nav-works-ru", c.nav.works.ru);
    set("f-nav-about-en", c.nav.about.en); set("f-nav-about-ru", c.nav.about.ru);
    set("f-nav-stack-en", c.nav.stack.en); set("f-nav-stack-ru", c.nav.stack.ru);
    set("f-nav-contact-en", c.nav.contact.en); set("f-nav-contact-ru", c.nav.contact.ru);
    set("f-nav-cta-en", c.nav.cta.en); set("f-nav-cta-ru", c.nav.cta.ru);
    set("f-proj-kicker-en", c.proj.kicker.en); set("f-proj-kicker-ru", c.proj.kicker.ru);
    set("f-proj-title-en", c.proj.title.en); set("f-proj-title-ru", c.proj.title.ru);
    set("f-proj-sub-en", c.proj.sub.en); set("f-proj-sub-ru", c.proj.sub.ru);
    set("f-proj-all-en", c.proj.all.en); set("f-proj-all-ru", c.proj.all.ru);
    set("f-skills-kicker-en", c.skills.kicker.en); set("f-skills-kicker-ru", c.skills.kicker.ru);
    set("f-skills-title-en", c.skills.title.en); set("f-skills-title-ru", c.skills.title.ru);
    set("f-contact-kicker-en", c.contact.kicker.en); set("f-contact-kicker-ru", c.contact.kicker.ru);
    set("f-contact-title-en", c.contact.title.en); set("f-contact-title-ru", c.contact.title.ru);
    set("f-contact-sub-en", c.contact.sub.en); set("f-contact-sub-ru", c.contact.sub.ru);
    set("f-contact-cta-en", c.contact.cta.en); set("f-contact-cta-ru", c.contact.cta.ru);
    set("f-contact-email", c.contact.email);
    set("f-footer-copy-en", c.footer.copyright.en); set("f-footer-copy-ru", c.footer.copyright.ru);
    renderProjects();
    renderStats();
    renderSkills();
    renderSocials();
  }

  /* ============ Delegate events on repeaters ============ */
  function moveItem(list, index, delta) {
    const target = index + delta;
    if (target < 0 || target >= list.length) return;
    const tmp = list[index];
    list[index] = list[target];
    list[target] = tmp;
  }

  projectsList.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-act]");
    if (!btn) return;
    const card = btn.closest(".item-card");
    const i = Number(card.dataset.index);
    const act = btn.dataset.act;
    if (act === "remove") {
      askConfirm("confirm.deleteProject", () => {
        state.working.projects.splice(i, 1);
        fill(state.working);
      });
    } else if (act === "up") {
      moveItem(state.working.projects, i, -1);
      fill(state.working);
    } else if (act === "down") {
      moveItem(state.working.projects, i, 1);
      fill(state.working);
    }
  });

  socialsList.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-act]");
    if (!btn) return;
    const card = btn.closest(".item-card");
    const i = Number(card.dataset.index);
    if (btn.dataset.act === "remove") {
      askConfirm("confirm.deleteSocial", () => {
        state.working.footer.socials.splice(i, 1);
        fill(state.working);
      });
    }
  });

  projectsList.addEventListener("input", (e) => {
    if (e.target.id && e.target.id.startsWith("f-proj-") && e.target.id.endsWith("-image")) {
      const i = Number(e.target.id.slice("f-proj-".length, -"-image".length));
      const preview = $("preview-" + i);
      if (preview) {
        preview.src = e.target.value.trim();
        preview.classList.toggle("is-visible", Boolean(e.target.value.trim()));
      }
    }
  });

  $("addProjectBtn").addEventListener("click", () => {
    state.working.projects.push({
      title: { en: "", ru: "" },
      desc: { en: "", ru: "" },
      tags: [],
      image: "",
      url: ""
    });
    fill(state.working);
  });

  $("addSocialBtn").addEventListener("click", () => {
    state.working.footer.socials.push({ label: "", url: "" });
    fill(state.working);
  });

  /* ============ Normalization ============ */
  function normPair(v, fallback) {
    if (!v || typeof v !== "object") return fallback || { en: "", ru: "" };
    return { en: String(v.en || ""), ru: String(v.ru || "") };
  }

  function normalize(c) {
    const d = window.SITE_DEFAULTS;
    const n = {
      meta: { title: normPair(c.meta && c.meta.title, d.meta.title), desc: normPair(c.meta && c.meta.desc, d.meta.desc) },
      badge: normPair(c.badge, d.badge),
      "hero.line1": normPair(c["hero.line1"], d["hero.line1"]),
      "hero.line2": normPair(c["hero.line2"], d["hero.line2"]),
      "hero.sub": normPair(c["hero.sub"], d["hero.sub"]),
      "cta.works": normPair(c["cta.works"], d["cta.works"]),
      "cta.contact": normPair(c["cta.contact"], d["cta.contact"]),
      code: {
        name: normPair(c.code && c.code.name, d.code.name),
        role: c.code && typeof c.code.role === "string" ? c.code.role : d.code.role,
        stack: c.code && typeof c.code.stack === "string" ? c.code.stack : d.code.stack,
        experience: c.code && typeof c.code.experience === "string" ? c.code.experience : d.code.experience,
        available: c.code ? Boolean(c.code.available) : d.code.available,
        status: normPair(c.code && c.code.status, d.code.status)
      },
      nav: {
        works: normPair(c.nav && c.nav.works, d.nav.works),
        about: normPair(c.nav && c.nav.about, d.nav.about),
        stack: normPair(c.nav && c.nav.stack, d.nav.stack),
        contact: normPair(c.nav && c.nav.contact, d.nav.contact),
        cta: normPair(c.nav && c.nav.cta, d.nav.cta)
      },
      stats: Array.isArray(c.stats) ? c.stats.map((s) => ({
        value: Number(s && s.value) || 0,
        suffix: s && typeof s.suffix === "string" ? s.suffix : "",
        label: normPair(s && s.label, { en: "", ru: "" })
      })) : deepCopy(d.stats),
      proj: {
        kicker: normPair(c.proj && c.proj.kicker, d.proj.kicker),
        title: normPair(c.proj && c.proj.title, d.proj.title),
        sub: normPair(c.proj && c.proj.sub, d.proj.sub),
        all: normPair(c.proj && c.proj.all, d.proj.all)
      },
      projects: Array.isArray(c.projects) ? c.projects.map((p) => ({
        title: normPair(p && p.title, { en: "", ru: "" }),
        desc: normPair(p && p.desc, { en: "", ru: "" }),
        tags: Array.isArray(p && p.tags) ? p.tags.map(String) : [],
        image: p && typeof p.image === "string" ? p.image : "",
        url: p && typeof p.url === "string" ? p.url : ""
      })) : deepCopy(d.projects),
      skills: {
        kicker: normPair(c.skills && c.skills.kicker, d.skills.kicker),
        title: normPair(c.skills && c.skills.title, d.skills.title),
        columns: Array.isArray(c.skills && c.skills.columns) ? c.skills.columns.map((col) => ({
          name: normPair(col && col.name, { en: "", ru: "" }),
          items: Array.isArray(col && col.items) ? col.items.map(String) : []
        })) : deepCopy(d.skills.columns)
      },
      contact: {
        kicker: normPair(c.contact && c.contact.kicker, d.contact.kicker),
        title: normPair(c.contact && c.contact.title, d.contact.title),
        sub: normPair(c.contact && c.contact.sub, d.contact.sub),
        cta: normPair(c.contact && c.contact.cta, d.contact.cta),
        email: c.contact && typeof c.contact.email === "string" ? c.contact.email : d.contact.email
      },
      footer: {
        copyright: normPair(c.footer && c.footer.copyright, d.footer.copyright),
        socials: Array.isArray(c.footer && c.footer.socials) ? c.footer.socials.map((s) => ({
          label: s && typeof s.label === "string" ? s.label : "",
          url: s && typeof s.url === "string" ? s.url : ""
        })) : deepCopy(d.footer.socials)
      }
    };
    return n;
  }

  /* ============ Status ============ */
  const statusDot = $("statusDot");
  const statusText = $("statusText");
  const statusLast = $("statusLast");
  const chipDot = $("chipDot");
  const chipText = $("chipText");

  function updateStatus(mode, key, showLast) {
    statusDot.className = "status-dot is-" + mode;
    chipDot.className = "status-dot is-" + mode;
    const label = t(key);
    statusText.textContent = label;
    chipText.textContent = label;
    if (showLast) {
      statusLast.textContent = lastPublished
        ? t("status.last", { time: fmtTime(lastPublished) })
        : t("status.never");
    } else {
      statusLast.textContent = "";
    }
  }

  function fmtTime(iso) {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return String(iso);
    return d.toLocaleString(currentLang === "ru" ? "ru-RU" : "en-US", {
      day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
    });
  }

  /* ============ Load & save ============ */
  const saveBtn = $("saveBtn");
  const saveLabel = $("saveLabel");

  function setSaveState(saving) {
    saveBtn.disabled = saving;
    saveLabel.textContent = t(saving ? "btn.saving" : "btn.save");
  }

  async function load() {
    if (!window.supabaseClient) {
      state.working = deepCopy(window.SITE_DEFAULTS);
      fill(state.working);
      updateStatus("warn", "status.notconf", false);
      return;
    }
    updateStatus("warn", "status.loading", false);
    try {
      const { data, error } = await window.supabaseClient
        .from("site_content")
        .select("content, updated_at")
        .eq("id", 1)
        .maybeSingle();
      if (error) throw error;
      if (data && data.content && Object.keys(data.content).length > 0) {
        state.working = normalize(data.content);
      } else {
        state.working = deepCopy(window.SITE_DEFAULTS);
      }
      lastPublished = (data && data.updated_at) ? data.updated_at : null;
      fill(state.working);
      updateStatus("ok", "status.ok", true);
    } catch (err) {
      state.working = deepCopy(window.SITE_DEFAULTS);
      fill(state.working);
      updateStatus("err", "status.offline", false);
      toast(t("toast.loadError", { msg: err.message || String(err) }));
    }
  }

  async function save() {
    if (!window.supabaseClient) {
      toast(t("toast.notconf"));
      return;
    }
    const payload = collect();
    setSaveState(true);
    try {
      const { error } = await window.supabaseClient
        .from("site_content")
        .upsert(
          { id: 1, content: payload, updated_at: new Date().toISOString() },
          { onConflict: "id" }
        );
      if (error) throw error;
      state.working = normalize(payload);
      lastPublished = new Date();
      toast(t("toast.saved"));
      updateStatus("ok", "status.ok", true);
    } catch (err) {
      toast(t("toast.saveError", { msg: err.message || String(err) }));
      updateStatus("err", "status.offline", false);
    } finally {
      setSaveState(false);
    }
  }

  saveBtn.addEventListener("click", save);

  $("resetBtn").addEventListener("click", () => {
    askConfirm("confirm.reset", () => {
      state.working = deepCopy(window.SITE_DEFAULTS);
      fill(state.working);
      toast(t("toast.reset"));
    });
  });

  /* ============ Init ============ */
  fill(state.working);
  setLang(currentLang);
  load();
})();
