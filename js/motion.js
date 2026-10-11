// Motion layer: GSAP animations and microinteractions.
// Everything here is decoration. If GSAP fails to load, or the visitor prefers
// reduced motion, the page works exactly the same without it.
//
// One vocabulary throughout: things rise a short distance on a long, soft ease.
// Headlines rise out of a mask line by line; eyebrows draw their pink tick first.
(() => {
  const root = document.documentElement;
  if (!window.gsap || !window.ScrollTrigger) {
    root.classList.remove("has-motion");
    return;
  }

  const hasSplit = Boolean(window.SplitText);
  gsap.registerPlugin(ScrollTrigger, ...(hasSplit ? [SplitText] : []));
  gsap.defaults({ ease: "expo.out", duration: 1.2 });

  const $ = (sel, scope = document) => scope.querySelector(sel);
  const $$ = (sel, scope = document) => [...scope.querySelectorAll(sel)];
  const canHover = matchMedia("(hover: hover) and (pointer: fine)").matches;

  // Header gets a soft glassy backdrop once the page moves.
  const header = $(".site-header");
  if (header) {
    ScrollTrigger.create({
      start: 8,
      onToggle: (self) => header.classList.toggle("is-scrolled", self.isActive),
    });
  }

  const mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    const cleanups = [];
    const on = (el, type, fn, opts) => {
      el.addEventListener(type, fn, opts);
      cleanups.push(() => el.removeEventListener(type, fn, opts));
    };

    // One tween per element, so a hover tween's overwrite on one element
    // can't cancel the reveal of its siblings.
    const fromEach = (targets, { stagger = 0.08, ...vars }, tl = gsap.timeline(), at = 0) => {
      gsap.utils.toArray(targets).forEach((el, i) => tl.from(el, vars, at + i * stagger));
      return tl;
    };

    const onScroll = (trigger, start = "top 86%") => ({ trigger, start, once: true });

    // Fade-and-rise as things scroll into view.
    const reveal = (targets, { trigger, ...vars } = {}) => {
      const list = gsap.utils.toArray(targets);
      if (!list.length) return;
      fromEach(list, { y: 28, autoAlpha: 0, ...vars }, gsap.timeline({ scrollTrigger: onScroll(trigger || list[0]) }));
    };

    // Headlines rise line by line out of a clipping mask. autoSplit re-splits
    // when fonts load or the width changes, and keeps the animation in step.
    const riseLines = (el, { delay = 0, scroll = true } = {}) => {
      if (!hasSplit) return reveal(el);
      SplitText.create(el, {
        type: "lines",
        mask: "lines",
        linesClass: "split-line",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 105,
            duration: 1.3,
            stagger: 0.09,
            delay,
            scrollTrigger: scroll ? onScroll(el) : undefined,
          }),
      });
    };

    // Eyebrows: the pink tick draws, then the label slides in after it.
    const drawEyebrow = (el, tl = gsap.timeline({ scrollTrigger: onScroll(el) }), at = 0) =>
      tl
        .fromTo(el, { "--tick": 0 }, { "--tick": 1, duration: 0.9, ease: "power3.inOut" }, at)
        .from(el, { x: -10, autoAlpha: 0, duration: 1 }, at);

    /* ---------- Page transitions ---------- */

    // Fade the night in over the page, then reveal it. The curtain is the
    // html::before overlay in styles.css, driven by --curtain.
    gsap.to(root, { "--curtain": 0, duration: 0.8, ease: "power2.out" });

    on(document, "click", (e) => {
      const link = e.target.closest("a[href]");
      if (!link || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (link.target || link.hasAttribute("download")) return;
      const url = new URL(link.href, location.href);
      if (url.origin !== location.origin || (url.pathname === location.pathname && url.hash)) return;
      e.preventDefault();
      gsap.to(root, { "--curtain": 1, duration: 0.45, ease: "power2.in", onComplete: () => (location.href = url.href) });
    });
    // Coming back via the back button restores a cached page with the curtain down.
    on(window, "pageshow", (e) => {
      if (e.persisted) gsap.to(root, { "--curtain": 0, duration: 0.5 });
    });

    // A hairline under the header tracks how far down the page you are.
    if (header) {
      const bar = document.createElement("span");
      bar.className = "scroll-progress";
      bar.setAttribute("aria-hidden", "true");
      header.appendChild(bar);
      gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.4 } });
      cleanups.push(() => bar.remove());
    }

    /* ---------- Hero ---------- */

    const hero = $(".hero");
    if (hero) {
      gsap.set([".hero-copy", ".hero-scene"], { visibility: "visible" });
      riseLines($(".hero h1"), { delay: 0.35, scroll: false });

      const intro = gsap.timeline({ delay: 0.15 });
      drawEyebrow($(".hero .eyebrow"), intro, 0);
      intro.from(".hero .lead", { y: 18, autoAlpha: 0 }, 0.7);
      fromEach(".hero-actions .btn", { y: 16, autoAlpha: 0, stagger: 0.08 }, intro, 0.85);
      intro
        .from(".hero-scene .nilly", { y: 90, autoAlpha: 0, duration: 1.6, ease: "elastic.out(0.7, 0.75)" }, 0.45)
        .from(".hero-scene .sunny", { y: 70, rotation: -10, autoAlpha: 0, duration: 1.6, ease: "elastic.out(0.7, 0.75)" }, 0.65)
        .from(".hero-scene .sparkle", { scale: 0, rotation: -90, stagger: 0.15, duration: 1, ease: "back.out(2)" }, 1)
        .from(".hero .stars", { autoAlpha: 0, duration: 2.4, ease: "power1.out" }, 0);

      // Depth on scroll: copy lifts away fastest, mascots slower, stars slowest.
      const depth = { trigger: hero, start: "top top", end: "bottom top", scrub: true };
      gsap.to(".hero-copy", { y: -60, autoAlpha: 0.25, ease: "none", scrollTrigger: depth });
      gsap.to(".hero-scene", { y: 50, ease: "none", scrollTrigger: depth });
      gsap.to(".hero .stars", { y: 30, ease: "none", scrollTrigger: depth });

      // A gentle pointer parallax: scene leans toward the cursor, stars away from it.
      if (canHover) {
        const scene = $(".hero-scene");
        const stars = $(".hero .stars");
        const sx = gsap.quickTo(scene, "x", { duration: 1.4, ease: "power3.out" });
        const sr = gsap.quickTo(scene, "rotation", { duration: 1.4, ease: "power3.out" });
        const tx = gsap.quickTo(stars, "x", { duration: 2, ease: "power3.out" });
        on(hero, "pointermove", (e) => {
          const r = hero.getBoundingClientRect();
          const nx = (e.clientX - r.left) / r.width - 0.5;
          sx(nx * 16);
          sr(nx * 1.2);
          tx(nx * -12);
        });
        on(hero, "pointerleave", () => { sx(0); sr(0); tx(0); });
      }

      // The occasional shooting star.
      const sky = $(".hero .stars");
      if (sky) {
        let next;
        const shoot = () => {
          const streak = document.createElement("span");
          streak.className = "shooting-star";
          sky.appendChild(streak);
          const angle = gsap.utils.random(16, 28);
          const dist = gsap.utils.random(240, 380);
          const rad = (angle * Math.PI) / 180;
          gsap
            .timeline({ onComplete: () => streak.remove() })
            .set(streak, { x: gsap.utils.random(sky.clientWidth * 0.1, sky.clientWidth * 0.7), y: gsap.utils.random(0, sky.clientHeight * 0.35), rotation: angle, autoAlpha: 0 })
            .to(streak, { autoAlpha: 1, duration: 0.2, ease: "none" })
            .to(streak, { x: `+=${Math.cos(rad) * dist}`, y: `+=${Math.sin(rad) * dist}`, duration: 1.1, ease: "power1.in" }, 0)
            .to(streak, { autoAlpha: 0, scaleX: 0.3, duration: 0.5, ease: "power1.in" }, 0.6);
          next = gsap.delayedCall(gsap.utils.random(6, 12), shoot);
        };
        next = gsap.delayedCall(3.5, shoot);
        cleanups.push(() => next.kill());
      }
    }

    /* ---------- Page head (resources) ---------- */

    const pageHead = $(".page-head");
    if (pageHead) {
      gsap.set(".page-head .wrap", { visibility: "visible" });
      riseLines($("h1", pageHead), { delay: 0.3, scroll: false });
      const intro = gsap.timeline({ delay: 0.15 });
      drawEyebrow($(".eyebrow", pageHead), intro, 0);
      intro.from($(".lead", pageHead), { y: 18, autoAlpha: 0 }, 0.6);
      fromEach($$(".jump li", pageHead), { y: 12, autoAlpha: 0, stagger: 0.06 }, intro, 0.75);
      intro.from($(".sparkle", pageHead), { scale: 0, rotation: -90, duration: 1, ease: "back.out(2)" }, 0.9);
    }

    /* ---------- Section reveals ---------- */

    $$(".eyebrow").forEach((el) => {
      if (!el.closest(".hero, .page-head")) drawEyebrow(el);
    });
    $$("main h2").forEach((h2) => riseLines(h2));
    $$(".section-head .lead, .resource-section > .wrap > .lead").forEach((el) => reveal(el, { delay: 0.25 }));

    // About pins (CSS sticky) while its story plays: each paragraph rises in,
    // holds, then lifts away as the next arrives. The quote stays until the
    // Lab section slides over, at which point the page beneath sinks back.
    const about = $(".about");
    if (about) {
      const story = $$(".about-story > *");
      const pinnedLength = () => about.offsetHeight - 2 * innerHeight;
      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut", duration: 1 },
        scrollTrigger: { trigger: about, start: "top 40%", end: () => `top+=${pinnedLength()} top`, scrub: 0.8, invalidateOnRefresh: true },
      });
      story.forEach((el, i) => {
        tl.fromTo(el, { autoAlpha: 0, y: 48, filter: "blur(8px)" }, { autoAlpha: 1, y: 0, filter: "blur(0px)", ease: "power3.out" }, i * 2.4);
        if (i < story.length - 1) {
          tl.to(el, { autoAlpha: 0, y: -48, filter: "blur(8px)", ease: "power2.in" }, i * 2.4 + 1.6);
        }
      });
      tl.to({}, { duration: 0.6 }); // a beat of stillness on the quote

      gsap.to(".about-pin .wrap", {
        scale: 0.92,
        autoAlpha: 0.35,
        ease: "none",
        scrollTrigger: { trigger: "#lab", start: "top bottom", end: "top top", scrub: true },
      });
    }

    // Cards rise in sequence; their art settles from a slight zoom.
    ScrollTrigger.batch(".cards .card", {
      start: "top 88%",
      once: true,
      onEnter: (batch) => {
        const tl = fromEach(batch, { y: 48, autoAlpha: 0, duration: 1.4, stagger: 0.12 });
        fromEach(batch.map((card) => $(".card-art img, .card-art svg", card)), { scale: 1.18, duration: 1.8, stagger: 0.12 }, tl, 0);
      },
    });

    /* ---------- Resources card swap (home) ---------- */

    // A skewed 3D stack of guides. js/main.js owns the order and fires a
    // "swap" event; this animates it. Forward: the front card drops away, the
    // rest step up with a soft elastic settle, and it rises back in behind.
    // Back: the rear card slips out below, the rest step back, and it rises
    // into the front. Autoplay pauses on hover/focus and while off-screen.
    const swap = $(".card-swap");
    if (swap && swap.step) {
      const cards = $$(".swap-card", swap);
      const settle = { duration: 1.5, ease: "elastic.out(0.6, 0.9)" };
      let tl;
      let timer;
      let inView = false;
      let held = false;

      const slot = (i) => {
        const w = cards[0].offsetWidth;
        return { x: i * w * 0.09, y: -i * w * 0.1, z: -i * w * 0.135, zIndex: cards.length - i };
      };
      const placeAll = (order) =>
        order.forEach((card, i) =>
          gsap.set(cards[card], { ...slot(i), xPercent: -50, yPercent: -50, skewY: 5, transformOrigin: "50% 50%", force3D: true })
        );

      // Move every card except `mover` to its new slot, starting at `at`.
      const shuffle = (order, mover, at) =>
        order.forEach((card, i) => {
          if (card === mover) return;
          const s = slot(i);
          tl.set(cards[card], { zIndex: s.zIndex }, at);
          tl.to(cards[card], { x: s.x, y: s.y, z: s.z, ...settle }, `${at}+=${i * 0.08}`);
        });

      on(swap, "swap", ({ detail: { dir, order } }) => {
        tl?.progress(1);
        tl = gsap.timeline();
        if (dir > 0) {
          const el = cards[order.at(-1)];
          const back = slot(cards.length - 1);
          tl.to(el, { y: "+=520", duration: 0.8, ease: "power3.in" }).addLabel("move", "-=0.3");
          shuffle(order, order.at(-1), "move");
          tl.set(el, { zIndex: back.zIndex }, "move+=0.15");
          tl.to(el, { x: back.x, y: back.y, z: back.z, ...settle }, "move+=0.15");
        } else {
          const el = cards[order[0]];
          const front = slot(0);
          tl.to(el, { y: "+=520", duration: 0.7, ease: "power3.in" }).addLabel("move", "-=0.25");
          shuffle(order, order[0], "move");
          tl.set(el, { zIndex: front.zIndex }, "move+=0.2");
          tl.to(el, { x: front.x, y: front.y, z: front.z, ...settle }, "move+=0.2");
        }
        timer?.restart(true); // a manual step resets the autoplay countdown
      });

      const sync = () => timer.paused(!(inView && !held));
      // Queue the next tick before stepping, so the step's restart() resets
      // the fresh timer rather than re-firing the one that just finished.
      const tick = () => {
        timer = gsap.delayedCall(4.5, tick);
        sync();
        swap.step(1);
      };
      timer = gsap.delayedCall(4.5, tick);

      const currentOrder = () => cards.map((_, i) => i).sort((a, b) => cards[a].style.getPropertyValue("--i") - cards[b].style.getPropertyValue("--i"));
      placeAll(currentOrder());
      gsap.from(cards, {
        y: "+=140",
        autoAlpha: 0,
        duration: 1.4,
        stagger: { each: 0.1, from: "end" },
        scrollTrigger: onScroll(swap, "top 80%"),
      });

      ScrollTrigger.create({
        trigger: swap,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => { inView = self.isActive; sync(); },
      });
      sync();
      const hold = (value) => () => { held = value; sync(); };
      on(swap, "pointerenter", hold(true));
      on(swap, "pointerleave", hold(false));
      on(swap, "focusin", hold(true));
      on(swap, "focusout", hold(false));
      let lastWidth = innerWidth; // ignore mobile URL-bar height changes
      on(window, "resize", () => {
        if (innerWidth === lastWidth) return;
        lastWidth = innerWidth;
        tl?.progress(1);
        placeAll(currentOrder());
      });
      cleanups.push(() => timer?.kill());
    }

    reveal(".section-foot");
    reveal(".newsletter-form > *:not(.form-note)", { y: 18, stagger: 0.08 });
    reveal(".site-footer .wrap > *", { y: 18, stagger: 0.1, trigger: ".site-footer" });

    // Resources page pieces: the drawing unveils from the top, the text follows.
    $$(".piece").forEach((piece) => {
      const tl = gsap.timeline({ scrollTrigger: onScroll(piece, "top 82%") });
      tl.from($(".zoom", piece), { clipPath: "inset(0 0 100% 0 round 18px)", duration: 1.6, ease: "expo.inOut" })
        .from($(".zoom img", piece), { scale: 1.15, duration: 2, ease: "expo.out" }, 0.3);
      fromEach($(".piece-text", piece).children, { y: 20, autoAlpha: 0 }, tl, 0.5);
    });
    ScrollTrigger.batch(".gallery li", {
      start: "top 90%",
      once: true,
      onEnter: (batch) => fromEach(batch, { y: 28, autoAlpha: 0, duration: 1.2, stagger: 0.07 }),
    });

    /* ---------- Lab card art ---------- */

    // Sky Stories: the constellation draws itself in, star by star.
    const constellation = $(".card--soon svg path");
    if (constellation) {
      const len = constellation.getTotalLength();
      gsap
        .timeline({ scrollTrigger: onScroll(constellation.closest(".card"), "top 75%"), delay: 0.4 })
        .fromTo(constellation, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 2.4, ease: "power2.inOut" })
        .from($$(".card--soon svg circle"), { scale: 0, transformOrigin: "50% 50%", stagger: 0.32, duration: 0.7, ease: "back.out(3)" }, 0.05);
    }

    /* ---------- Newsletter scene ---------- */

    const ground = $(".ground");
    if (ground) {
      gsap
        .timeline({ scrollTrigger: onScroll(ground, "top 95%") })
        .from(".ground .nilly", { y: 90, autoAlpha: 0, duration: 1.4 })
        .from(".stargazers .sunny", { y: 70, autoAlpha: 0, duration: 1.4 }, 0.2)
        .from(".stargazers .telescope", { y: 40, autoAlpha: 0, duration: 1.4 }, 0.4);
    }

    // Status messages under the form ease in instead of popping.
    const note = $(".form-note");
    if (note) {
      const observer = new MutationObserver(() => {
        if (note.textContent) gsap.fromTo(note, { y: 8, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8 });
      });
      observer.observe(note, { childList: true, characterData: true, subtree: true });
      cleanups.push(() => observer.disconnect());
    }

    /* ---------- Microinteractions ---------- */

    // Buttons: a slight magnetic pull; the label travels a touch further than
    // the pill, which gives it a sense of depth. A soft squish on press.
    $$(".btn").forEach((btn) => {
      let label = $(".btn-label", btn);
      if (!label) {
        label = document.createElement("span");
        label.className = "btn-label";
        label.append(...btn.childNodes);
        btn.append(label);
      }
      const bx = gsap.quickTo(btn, "x", { duration: 0.6, ease: "power3.out" });
      const by = gsap.quickTo(btn, "y", { duration: 0.6, ease: "power3.out" });
      const lx = gsap.quickTo(label, "x", { duration: 0.6, ease: "power3.out" });
      const ly = gsap.quickTo(label, "y", { duration: 0.6, ease: "power3.out" });
      if (canHover) {
        on(btn, "pointermove", (e) => {
          const r = btn.getBoundingClientRect();
          const dx = e.clientX - r.left - r.width / 2;
          const dy = e.clientY - r.top - r.height / 2;
          bx(dx * 0.14);
          by(dy * 0.22);
          lx(dx * 0.08);
          ly(dy * 0.12);
        });
        on(btn, "pointerleave", () => {
          gsap.to([btn, label], { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.5)", overwrite: "auto" });
        });
      }
      on(btn, "pointerdown", () => gsap.to(btn, { scale: 0.95, duration: 0.2, ease: "power2.out" }));
      on(btn, "pointerup", () => gsap.to(btn, { scale: 1, duration: 0.6, ease: "back.out(3)" }));
      on(btn, "pointercancel", () => gsap.to(btn, { scale: 1, duration: 0.3 }));
    });

    // Cards: lift and tilt a touch toward the cursor, with a soft pink glow
    // that follows it (the .card::after spotlight in styles.css).
    if (canHover) {
      $$("a.card").forEach((card) => {
        gsap.set(card, { transformPerspective: 1000 });
        const art = $(".card-art img, .card-art svg", card);
        const rx = gsap.quickTo(card, "rotationX", { duration: 0.8, ease: "power3.out" });
        const ry = gsap.quickTo(card, "rotationY", { duration: 0.8, ease: "power3.out" });
        const planets = $$(".card-art svg circle", card).slice(-2);

        on(card, "pointerenter", () => {
          gsap.to(card, { y: -6, "--glow": 1, duration: 0.8, ease: "power3.out", overwrite: "auto" });
          gsap.to(art, { scale: 1.04, duration: 1.2, ease: "power3.out" });
          if (planets.length) gsap.to(planets, { y: -5, stagger: 0.1, duration: 0.7, ease: "sine.inOut", yoyo: true, repeat: 1 });
        });
        on(card, "pointermove", (e) => {
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width;
          const py = (e.clientY - r.top) / r.height;
          card.style.setProperty("--mx", `${px * 100}%`);
          card.style.setProperty("--my", `${py * 100}%`);
          ry((px - 0.5) * 4);
          rx((py - 0.5) * -4);
        });
        on(card, "pointerleave", () => {
          rx(0);
          ry(0);
          gsap.to(card, { y: 0, "--glow": 0, duration: 0.9, ease: "power3.out", overwrite: "auto" });
          gsap.to(art, { scale: 1, duration: 1.2, ease: "power3.out" });
        });
      });

    }

    // Lightbox: each image eases in when it loads (on open and when stepping).
    const lightbox = $(".lightbox");
    if (lightbox) {
      const img = $("img", lightbox);
      on(img, "load", () => gsap.fromTo(img, { autoAlpha: 0, scale: 0.97 }, { autoAlpha: 1, scale: 1, duration: 0.9 }));
      const observer = new MutationObserver(() => {
        if (lightbox.open) gsap.from($(".lightbox-bar", lightbox), { y: 12, autoAlpha: 0, duration: 0.9, delay: 0.15 });
      });
      observer.observe(lightbox, { attributes: true, attributeFilter: ["open"] });
      cleanups.push(() => observer.disconnect());
    }

    return () => cleanups.forEach((fn) => fn());
  });

  root.classList.add("motion-ready");
})();