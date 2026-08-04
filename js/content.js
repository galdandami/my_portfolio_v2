"use strict";

window.SITE_DEFAULTS = {
  meta: {
    title: { en: "Danis — Web Developer", ru: "Данис — Веб-разработчик" },
    desc: {
      en: "Frontend developer with 4+ years of experience. Building fast, reliable and beautiful websites and web apps — from landing pages to complex web applications.",
      ru: "Фронтенд-разработчик с 4+ годами опыта. Создаю сайты и веб-приложения, которые решают задачи бизнеса."
    }
  },

  badge: {
    en: "Open to new projects",
    ru: "Открыт для новых проектов"
  },

  "hero.line1": {
    en: "I build websites and web apps,",
    ru: "Создаю сайты и веб-приложения,"
  },
  "hero.line2": {
    en: "that solve business problems",
    ru: "которые решают задачи бизнеса"
  },
  "hero.sub": {
    en: "Frontend developer with 4+ years of experience. Turning ideas into fast, reliable and beautiful digital products — from landing pages to complex web applications.",
    ru: "Фронтенд-разработчик с 4+ годами опыта. Превращаю идеи в быстрые, надёжные и красивые цифровые продукты — от лендингов до сложных веб-приложений."
  },

  "cta.works": { en: "View my work", ru: "Смотреть работы" },
  "cta.contact": { en: "Contact", ru: "Связаться" },

  code: {
    name: { en: "Danis", ru: "Данис" },
    role: { en: '"Frontend Developer"', ru: '"Фронтенд-разработчик"' },
    stack: '["React", "TypeScript", "Next.js"]',
    experience: { en: '"4+ years"', ru: '"4+ года"' },
    available: true,
    status: { en: '"Open to new projects"', ru: '"Открыт для новых проектов"' },
    comment: { en: "// portfolio.js — main config", ru: "// portfolio.js — основной конфиг" },
    log: { en: '"Let\'s build something great!"', ru: '"Давайте создадим что-то великое!"' },
    aria: { en: "developer.js code example", ru: "пример кода developer.js" }
  },

  nav: {
    works: { en: "Works", ru: "Работы" },
    about: { en: "About", ru: "Обо мне" },
    stack: { en: "Stack", ru: "Стек" },
    contact: { en: "Contact", ru: "Контакты" },
    cta: { en: "Contact me", ru: "Связаться" },
    home: { en: "Danis — home", ru: "Данис — главная" },
    menu: { en: "Main navigation", ru: "Основная навигация" },
    open: { en: "Open menu", ru: "Открыть меню" },
    lang: { en: "Language", ru: "Язык" }
  },

  stats: [
    { value: 4, suffix: "+", label: { en: "years of experience", ru: "года опыта" } },
    { value: 38, suffix: "", label: { en: "projects in portfolio", ru: "проектов в портфолио" } },
    { value: 22, suffix: "", label: { en: "happy clients", ru: "довольных клиента" } },
    { value: 100, suffix: "%", label: { en: "projects delivered on time", ru: "проектов сдано в срок" } }
  ],

  proj: {
    kicker: { en: "// Portfolio", ru: "// Портфолио" },
    title: { en: "Featured work", ru: "Избранные работы" },
    sub: { en: "A few projects I'm proud of", ru: "Несколько проектов, которыми я горжусь" },
    all: { en: "All projects", ru: "Все проекты" }
  },

  projects: [
    {
      title: { en: "Nova — e-commerce store", ru: "Nova — интернет-магазин" },
      desc: {
        en: "E-commerce built with Next.js: cart, Stripe payments and a personal account. After the redesign, conversion grew by 32%.",
        ru: "E-commerce на Next.js: корзина, оплата через Stripe и личный кабинет. После редизайна конверсия выросла на 32%."
      },
      tags: ["Next.js", "Stripe", "PostgreSQL"],
      image: "https://images.unsplash.com/photo-1657812159075-7f0abd98f7b8?q=80&w=1080&auto=format&fit=crop",
      url: ""
    },
    {
      title: { en: "Pulse — SaaS analytics", ru: "Pulse — аналитика для SaaS" },
      desc: {
        en: "A real-time dashboard with reports and charts for 500+ users. Data updates without a page reload.",
        ru: "Дашборд реального времени с отчётами и графиками для 500+ пользователей. Данные обновляются без перезагрузки страницы."
      },
      tags: ["React", "TypeScript", "D3.js"],
      image: "https://images.unsplash.com/photo-1745270917331-787c80129680?q=80&w=1080&auto=format&fit=crop",
      url: ""
    },
    {
      title: { en: "Stellar — startup landing page", ru: "Stellar — лендинг стартапа" },
      desc: {
        en: "A conversion-focused one-pager with animations and a dark theme. Performance — 98/100 on Lighthouse.",
        ru: "Продающий одностраничник с анимациями и тёмной темой. Производительность — 98/100 по Lighthouse."
      },
      tags: ["Next.js", "Tailwind", "Vercel"],
      image: "https://images.unsplash.com/photo-1763568258143-904ea924ac53?q=80&w=1080&auto=format&fit=crop",
      url: ""
    }
  ],

  skills: {
    kicker: { en: "// Tech stack", ru: "// Технологии" },
    title: { en: "My stack", ru: "Мой стек" },
    columns: [
      {
        name: { en: "Frontend", ru: "Frontend" },
        items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Redux Toolkit", "Vue.js"]
      },
      {
        name: { en: "Backend", ru: "Backend" },
        items: ["Node.js", "Express", "PostgreSQL", "MongoDB", "REST & GraphQL", "WebSockets"]
      },
      {
        name: { en: "Tools", ru: "Инструменты" },
        items: ["Git & GitHub", "Docker", "CI/CD", "Figma", "Vite", "Jest"]
      }
    ]
  },

  contact: {
    kicker: { en: "// Contacts", ru: "// Контакты" },
    title: { en: "Have a project? Let's talk", ru: "Есть проект? Давайте обсудим" },
    sub: {
      en: "Tell me about your task — I'll reply within a day with a work plan and timeline.",
      ru: "Расскажите о своей задаче — отвечу в течение дня и предложу план работ и сроки."
    },
    cta: { en: "Send a message", ru: "Написать мне" },
    email: "hello@danis.dev"
  },

  footer: {
    copyright: { en: "© 2026 Danis — Web Developer", ru: "© 2026 Данис — Веб-разработчик" },
    socials: [
      { label: "GitHub", url: "https://github.com" },
      { label: "Telegram", url: "https://t.me" },
      { label: "Email", url: "mailto:hello@danis.dev" }
    ]
  }
};
