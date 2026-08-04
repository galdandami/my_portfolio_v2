"use strict";

window.SB_CONFIG = {
  url: "https://udozteluyreuhfdgjiqq.supabase.co",
  anonKey: "sb_publishable_594WMbRbwJNRKmURHKPK-A_ZjvklqWO"
};

(function () {
  const ready =
    typeof window.supabase !== "undefined" &&
    window.SB_CONFIG &&
    window.SB_CONFIG.url.startsWith("https://") &&
    !window.SB_CONFIG.anonKey.includes("PASTE");

  window.supabaseClient = ready
    ? window.supabase.createClient(window.SB_CONFIG.url, window.SB_CONFIG.anonKey)
    : null;
})();
