document.addEventListener("DOMContentLoaded", () => {
    const html = document.documentElement;

    /* ---------- Icons ---------- */
    if (window.lucide) lucide.createIcons();

    /* ---------- Dark / Light mode ---------- */
    document.getElementById("themeToggle").addEventListener("click", () => {
        const dark = html.getAttribute("data-theme") === "dark";
        if (dark) html.removeAttribute("data-theme");
        else html.setAttribute("data-theme", "dark");
        try { localStorage.setItem("zenora-theme", dark ? "light" : "dark"); } catch (e) { }
    });

    /* ---------- RTL / LTR ---------- */
    document.getElementById("rtlToggle").addEventListener("click", () => {
        const next = html.getAttribute("dir") === "rtl" ? "ltr" : "rtl";
        html.setAttribute("dir", next);
        try { localStorage.setItem("zenora-dir", next); } catch (e) { }
    });

    /* ---------- Mobile menu ---------- */
    const burger = document.getElementById("burger");
    const nav = document.getElementById("nav");
    const dropdownItem = document.querySelector(".has-dropdown");
    const dropdownLink = dropdownItem.querySelector(":scope > a");

    const closeMenu = () => {
        nav.classList.remove("open");
        dropdownItem.classList.remove("open");
        burger.setAttribute("aria-expanded", false);
        burger.innerHTML = `<i data-lucide="menu"></i>`;
        lucide.createIcons();
    };

    burger.addEventListener("click", () => {
        const open = nav.classList.toggle("open");
        burger.setAttribute("aria-expanded", open);
        burger.innerHTML = `<i data-lucide="${open ? "x" : "menu"}"></i>`;
        lucide.createIcons();
        if (!open) dropdownItem.classList.remove("open");
    });

    /* ---------- Home dropdown (click on mobile / touch, hover on desktop) ---------- */
    const useClickDropdown = window.matchMedia("(max-width: 1280px), (hover: none)");
    dropdownLink.addEventListener("click", (e) => {
        if (useClickDropdown.matches) {
            e.preventDefault();
            dropdownItem.classList.toggle("open");
        }
    });
    document.addEventListener("click", (e) => {
        if (!dropdownItem.contains(e.target) && !nav.classList.contains("open")) {
            dropdownItem.classList.remove("open");
        }
    });

    nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
        if (a === dropdownLink && useClickDropdown.matches) return;
        closeMenu();
    }));

    /* ---------- Header shadow on scroll ---------- */
    const header = document.getElementById("header");
    const heroBg = document.getElementById("abHeroBg");
    const tlWrap = document.getElementById("abTimeline");
    const tlFill = document.getElementById("abTlFill");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onScroll = () => {
        const y = window.scrollY;
        header.classList.toggle("scrolled", y > 10);

        /* hero parallax */
        if (heroBg && !reduceMotion && y < window.innerHeight) {
            heroBg.style.transform = `translateY(${y * 0.25}px)`;
        }

        /* timeline progress line */
        if (tlWrap && tlFill) {
            const r = tlWrap.getBoundingClientRect();
            const vh = window.innerHeight;
            const progress = (vh * 0.6 - r.top) / r.height;
            tlFill.style.height = Math.max(0, Math.min(1, progress)) * 100 + "%";
        }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    /* ---------- Scroll reveal ---------- */
    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add("in"); revealObs.unobserve(e.target); }
        });
    }, { threshold: 0.15 });
    document.querySelectorAll(".ab-reveal").forEach(el => revealObs.observe(el));

    /* ---------- Animated counters ---------- */
    const counters = document.querySelectorAll("[data-count]");
    const countObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = +el.dataset.count;
            const duration = 1800;
            const start = performance.now();
            const tick = (now) => {
                const p = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - p, 3);
                el.textContent = Math.floor(eased * target).toLocaleString();
                if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            countObs.unobserve(el);
        });
    }, { threshold: 0.6 });
    counters.forEach(c => countObs.observe(c));

    /* ---------- Subtle 3D tilt on mission cards (desktop only) ---------- */
    if (window.matchMedia("(hover: hover)").matches && !reduceMotion) {
        document.querySelectorAll(".ab-mv-card").forEach(card => {
            card.addEventListener("mousemove", (e) => {
                const r = card.getBoundingClientRect();
                const x = (e.clientX - r.left) / r.width - 0.5;
                const y = (e.clientY - r.top) / r.height - 0.5;
                card.style.transform = `translateY(-10px) perspective(900px) rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 5).toFixed(2)}deg)`;
            });
            card.addEventListener("mouseleave", () => { card.style.transform = ""; });
        });
    }

    /* ---------- Tap state for touch devices (replaces hover on team cards) ---------- */
    if (window.matchMedia("(hover: none)").matches) {
        const members = document.querySelectorAll(".ab-member");
        members.forEach(m => m.addEventListener("click", () => {
            const was = m.classList.contains("is-tapped");
            members.forEach(x => x.classList.remove("is-tapped"));
            if (!was) m.classList.add("is-tapped");
        }));
    }

    /* ---------- Footer year ---------- */
    document.getElementById("year").textContent = new Date().getFullYear();
});