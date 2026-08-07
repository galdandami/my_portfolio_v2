"use strict";

(function () {
  const AUTH_EMAIL = "galdandami@gmail.com";

  const loginScreen = document.getElementById("loginScreen");
  const emailInput = document.getElementById("loginEmail");
  const passInput = document.getElementById("loginPassword");
  const loginBtn = document.getElementById("loginBtn");
  const loginError = document.getElementById("loginError");

  const client = window.supabaseClient;

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

  async function applySession() {
    let hasSession = false;
    if (client) {
      try {
        const { data } = await client.auth.getSession();
        hasSession = Boolean(data.session);
      } catch (e) { /* ignore */ }
    }
    if (hasSession) hideLogin();
    else showLogin();
  }

  async function tryLogin() {
    const email = emailInput.value.trim().toLowerCase();
    const pass = passInput.value;
    if (!email || !pass) {
      showError();
      return;
    }
    if (email !== AUTH_EMAIL) {
      showError();
      return;
    }
    if (!client) {
      showError();
      return;
    }
    loginBtn.disabled = true;
    try {
      const { error } = await client.auth.signInWithPassword({
        email: email,
        password: pass
      });
      if (error) throw error;
      passInput.value = "";
      emailInput.value = "";
      hideLogin();
    } catch (e) {
      showError();
    } finally {
      loginBtn.disabled = false;
    }
  }

  function logout() {
    if (client) {
      client.auth.signOut().catch(() => {});
    }
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
    isAuthed: async () => {
      if (!client) return false;
      const { data } = await client.auth.getSession();
      return Boolean(data.session);
    },
    logout: logout
  };

  document.addEventListener("DOMContentLoaded", applySession);
  applySession();
})();