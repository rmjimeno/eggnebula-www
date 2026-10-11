// TODO: paste your Google Apps Script web app URL here (ends in /exec).
// Setup steps: apps-script/README.md. It sends sign-ups to a Google Sheet.
// While this is empty, the form tells visitors honestly that sign-ups aren't open yet.
const NEWSLETTER_ENDPOINT = "https://script.google.com/macros/s/AKfycbzIBVGyAoSh5LOwjOp01F8YMt8VelikoJfoTOvxZbNGyD5EgneAMcr_GfAa-VwcMoVF/exec";

// Mobile nav
const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");
if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(open));
  });
  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) {
      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

// Scatter small background stars into any .stars container
document.querySelectorAll(".stars").forEach((box) => {
  const count = Number(box.dataset.count) || 60;
  for (let i = 0; i < count; i++) {
    const star = document.createElement("i");
    const size = Math.random() < 0.85 ? 2 : 3.5;
    star.style.width = star.style.height = `${size}px`;
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.opacity = (0.4 + Math.random() * 0.6).toFixed(2);
    if (Math.random() < 0.25) {
      star.classList.add("twinkle");
      star.style.animationDelay = `${(Math.random() * 5).toFixed(1)}s`;
    }
    box.appendChild(star);
  }
});

// Resources card stack. This owns the order (slot 0 is the front card): it
// sets each card's --i slot for the CSS layout, keeps only the front card in
// the tab order, and fires a "swap" event that js/motion.js animates.
const swap = document.querySelector(".card-swap");
if (swap) {
  const cards = [...swap.querySelectorAll(".swap-card")];
  const counter = document.querySelector(".swap-count");
  let order = cards.map((_, i) => i);

  const render = () => {
    order.forEach((card, slot) => {
      cards[card].style.setProperty("--i", slot);
      cards[card].tabIndex = slot === 0 ? 0 : -1;
    });
    if (counter) counter.textContent = `${order[0] + 1} / ${cards.length}`;
  };

  const step = (dir) => {
    const from = order;
    order = dir > 0 ? [...order.slice(1), order[0]] : [order.at(-1), ...order.slice(0, -1)];
    render();
    // Keyboard users stepping with arrow keys follow the new front card.
    if (swap.contains(document.activeElement)) cards[order[0]].focus({ preventScroll: true });
    swap.dispatchEvent(new CustomEvent("swap", { detail: { dir, from, order } }));
  };

  document.querySelectorAll("[data-swap]").forEach((btn) => {
    btn.addEventListener("click", () => step(Number(btn.dataset.swap)));
  });
  swap.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });

  swap.step = step;
  render();
}

// Telescope: drag it (or use the arrow keys) to aim the tube. --tilt is the
// angle in degrees above horizontal; the CSS pivots the tube on the tripod head.
const scope = document.querySelector(".telescope");
if (scope) {
  const MIN = 5;
  const MAX = 70;
  const pivot = { x: 82 / 160, y: 84 / 180 }; // tripod head, as a fraction of the viewBox
  let tilt = 30;

  const setTilt = (deg) => {
    tilt = Math.min(MAX, Math.max(MIN, deg));
    scope.style.setProperty("--tilt", tilt);
    scope.setAttribute("aria-valuenow", Math.round(tilt));
    scope.setAttribute("aria-valuetext", `${Math.round(tilt)} degrees up`);
  };

  const aimAt = (e) => {
    const r = scope.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width * pivot.x);
    const dy = e.clientY - (r.top + r.height * pivot.y);
    // The tube points up and to the left of the head, so measure from the left horizontal.
    setTilt((Math.atan2(-dy, -dx) * 180) / Math.PI);
  };

  scope.addEventListener("pointerdown", (e) => {
    scope.setPointerCapture(e.pointerId);
    scope.classList.add("is-dragging");
    aimAt(e);
  });
  scope.addEventListener("pointermove", (e) => {
    if (scope.classList.contains("is-dragging")) aimAt(e);
  });
  const release = () => scope.classList.remove("is-dragging");
  scope.addEventListener("pointerup", release);
  scope.addEventListener("pointercancel", release);

  scope.addEventListener("keydown", (e) => {
    const step = e.shiftKey ? 10 : 4;
    if (e.key === "ArrowUp" || e.key === "ArrowRight") setTilt(tilt + step);
    else if (e.key === "ArrowDown" || e.key === "ArrowLeft") setTilt(tilt - step);
    else if (e.key === "Home") setTilt(MIN);
    else if (e.key === "End") setTilt(MAX);
    else return;
    e.preventDefault();
  });

  setTilt(tilt);
}

// Newsletter
const form = document.querySelector(".newsletter-form");
if (form) {
  const note = form.querySelector(".form-note");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!NEWSLETTER_ENDPOINT) {
      note.textContent = "Sign-ups aren't open yet. Please check back soon.";
      return;
    }
    const button = form.querySelector("button[type='submit']");
    button.disabled = true;
    note.textContent = "Sending…";
    try {
      // Sent as a plain form post, which Apps Script accepts without a CORS preflight.
      const res = await fetch(NEWSLETTER_ENDPOINT, { method: "POST", body: new FormData(form) });
      const data = await res.json();
      if (data.result !== "success") throw new Error(data.error || "rejected");
      form.reset();
      note.textContent = "You're on the list. Salamat!";
    } catch {
      note.textContent = "That didn't go through. Please try again in a bit.";
    } finally {
      button.disabled = false;
    }
  });
}

// Lightbox for infographics. Buttons with the same data-group can be stepped through.
const lightbox = document.querySelector(".lightbox");
if (lightbox) {
  const img = lightbox.querySelector("img");
  const count = lightbox.querySelector(".lightbox-count");
  const prev = lightbox.querySelector("[data-step='-1']");
  const next = lightbox.querySelector("[data-step='1']");
  let group = [];
  let index = 0;

  const show = () => {
    const thumb = group[index].querySelector("img");
    img.src = group[index].dataset.full;
    img.alt = thumb.alt;
    const many = group.length > 1;
    prev.hidden = next.hidden = count.hidden = !many;
    count.textContent = `${index + 1} of ${group.length}`;
  };

  const step = (by) => {
    index = (index + by + group.length) % group.length;
    show();
  };

  document.querySelectorAll(".zoom").forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.group;
      group = name ? [...document.querySelectorAll(`.zoom[data-group="${name}"]`)] : [btn];
      index = group.indexOf(btn);
      show();
      lightbox.showModal();
    });
  });

  prev.addEventListener("click", () => step(-1));
  next.addEventListener("click", () => step(1));
  lightbox.querySelector(".lightbox-close").addEventListener("click", () => lightbox.close());
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) lightbox.close();
  });
  lightbox.addEventListener("keydown", (e) => {
    if (group.length < 2) return;
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });
}
