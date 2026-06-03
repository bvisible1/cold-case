// claude-shim.js
// In Claude's artifact sandbox, window.claude.complete exists natively.
// Anywhere else (local, Railway), we define it here to call our own backend
// proxy at /api/complete. This lets api.js and all screens stay unchanged.
(function () {
  if (window.claude && typeof window.claude.complete === "function") {
    // Already provided by the host environment; don't override.
    return;
  }

  window.claude = {
    // Accepts either a string prompt or an object like { messages: [...] }.
    complete: async function (input) {
      const payload =
        typeof input === "string" ? { prompt: input } : input;

      const res = await fetch("/api/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let detail = "";
        try {
          detail = JSON.stringify(await res.json());
        } catch (e) {}
        throw new Error("Backend /api/complete error " + res.status + " " + detail);
      }

      const data = await res.json();
      return data.text || "";
    },
  };
})();
