"use strict";

(function () {
  const ADMIN_EMAIL = "galdandami@gmail.com";
  const ADMIN_PASS_HASH = "bb0804c8d329950b92ea1fcda8066f1a6fbeb890fef01677dff1c53ce7c5271b";
  const AUTH_KEY = "danis-admin-auth";

  const loginScreen = document.getElementById("loginScreen");
  const emailInput = document.getElementById("loginEmail");
  const passInput = document.getElementById("loginPassword");
  const loginBtn = document.getElementById("loginBtn");
  const loginError = document.getElementById("loginError");
  const loginRemember = document.getElementById("loginRemember");

  const MEM_KEY = "danis-admin-auth-remember";
  const SESSION_KEY = "danis-admin-auth";

  async function sha256(text) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  function storage() {
    try {
      return loginRemember.checked ? localStorage : sessionStorage;
    } catch (e) {
      return null;
    }
  }

  function isAuthed() {
    try {
      return (
        sessionStorage.getItem(SESSION_KEY) === "1" ||
        localStorage.getItem(MEM_KEY) === "1"
      );
    } catch (e) {
      return false;
    }
  }

  function showLogin() {
    loginScreen.classList.remove("is-hidden");
  }

  function hideLogin() {
    loginScreen.classList.add("is-hidden");
  }

  function showError() {
    loginError.hidden = false;
    clearTimeout(showError.timer);
    showError.timer = setTimeout(() => { loginError.hidden = true; }, 3000);
  }

  async function tryLogin() {
    const email = emailInput.value.trim().toLowerCase();
    const pass = passInput.value;
    if (!email || !pass) {
      showError();
      return;
    }
    if (email !== ADMIN_EMAIL) {
      showError();
      return;
    }
    let hash = "";
    try {
      hash = await sha256(pass);
    } catch (e) {
      showError();
      return;
    }
    if (hash !== ADMIN_PASS_HASH) {
      showError();
      return;
    }
    try {
      const store = storage();
      if (!store) return;
      store.setItem(store === localStorage ? MEM_KEY : SESSION_KEY, "1");
    } catch (e) { /* ignore */ }
    passInput.value = "";
    hideLogin();
    emailInput.value = "";
  }

  function logout() {
    try {
      sessionStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(MEM_KEY);
    } catch (e) { /* ignore */ }
    passInput.value = "";
    showLogin();
    passInput.focus();
  }

  loginBtn.addEventListener("click", tryLogin);
  loginScreen.addEventListener("keydown", (e) => {
    if (e.key === "Enter") tryLogin();
  });

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) logoutBtn.addEventListener("click", logout);

  window.adminAuth = {
    isAuthed: isAuthed,
    logout: logout
  };

  if (!isAuthed()) showLogin();
})();
