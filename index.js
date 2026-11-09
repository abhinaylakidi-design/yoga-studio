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

    /* close the mobile menu when a real link is chosen (not the dropdown toggle) */
    nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
        if (a === dropdownLink && useClickDropdown.matches) return;
        closeMenu();
    }));

    /* ---------- Header shadow on scroll ---------- */
    const header = document.getElementById("header");
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    /* ---------- Scroll reveal ---------- */
    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add("in"); revealObs.unobserve(e.target); }
        });
    }, { threshold: 0.15 });
    document.querySelectorAll(".reveal").forEach(el => revealObs.observe(el));

    /* ---------- Animated counters ---------- */
    const counters = document.querySelectorAll("[data-count]");
    const countObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = +el.dataset.count;
            const duration = 1600;
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

    /* ---------- Class filter ---------- */
    const chips = document.querySelectorAll(".chip");
    const classCards = document.querySelectorAll(".class-card");
    chips.forEach(chip => chip.addEventListener("click", () => {
        chips.forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        const f = chip.dataset.filter;
        classCards.forEach(card => {
            const show = f === "all" || card.dataset.level === f;
            card.classList.toggle("hide", !show);
            if (show) { card.style.animation = "none"; card.offsetHeight; card.style.animation = ""; }
        });
    }));

    /* ---------- Tap state for touch devices (replaces hover) ---------- */
    const tapCards = document.querySelectorAll(".tap-card");
    if (window.matchMedia("(hover: none)").matches) {
        tapCards.forEach(card => card.addEventListener("click", (e) => {
            if (e.target.closest("a, button")) return;
            const was = card.classList.contains("is-tapped");
            tapCards.forEach(c => c.classList.remove("is-tapped"));
            if (!was) card.classList.add("is-tapped");
        }));
    }

    /* ---------- Footer year ---------- */
    document.getElementById("year").textContent = new Date().getFullYear();
});