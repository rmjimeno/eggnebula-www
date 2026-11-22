(function () {
  const form = document.getElementById("contact-form");
  if (!form) return;
  const note = document.getElementById("contact-note");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Same Apps Script web app as the newsletter (the const lives in js/main.js).
    const endpoint = typeof NEWSLETTER_ENDPOINT !== "undefined" ? NEWSLETTER_ENDPOINT : "";

    const missing = [...form.querySelectorAll("[required]")].filter((el) => !el.value.trim() || !el.checkValidity());
    form.querySelectorAll("[aria-invalid]").forEach((el) => el.removeAttribute("aria-invalid"));
    if (missing.length) {
      missing.forEach((el) => el.setAttribute("aria-invalid", "true"));
      missing[0].focus();
      note.textContent = "Please fill in the highlighted fields.";
      return;
    }
    if (!endpoint) { note.textContent = "The contact form isn't open yet. Please check back soon."; return; }

    const button = form.querySelector("button[type='submit']");
    button.disabled = true;
    note.textContent = "Sending…";
    try {
      const res = await fetch(endpoint, { method: "POST", body: new FormData(form) });
      const data = await res.json();
      if (data.result !== "success") throw new Error(data.error || "rejected");
      form.reset();
      note.textContent = "Thanks! Your message is in. A reply is on its way soon.";
    } catch {
      note.textContent = "That didn't go through. Please try again in a bit.";
    } finally {
      button.disabled = false;
    }
  });
})();
