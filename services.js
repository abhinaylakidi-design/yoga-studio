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
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    /* ---------- Scroll reveal ---------- */
    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add("in"); revealObs.unobserve(e.target); }
        });
    }, { threshold: 0.12 });
    document.querySelectorAll(".sv-reveal").forEach(el => revealObs.observe(el));

    /* =====================================================
       SERVICE CARDS: the whole card opens its detail page
       (each card links to service-detail.html?service=<slug>)
       ===================================================== */
    document.querySelectorAll(".sv-card").forEach(card => {
        card.addEventListener("click", (e) => {
            if (e.target.closest("a")) return;           // let the real link work
            const link = card.querySelector(".sv-view");
            if (link) window.location.href = link.getAttribute("href");
        });
    });

    /* =====================================================
       FAQ ACCORDION (independent, several can stay open)
       ===================================================== */
    document.querySelectorAll(".sv-faq").forEach(item => {
        item.querySelector(".sv-faq-q").addEventListener("click", () => {
            const open = item.classList.toggle("open");
            item.querySelector(".sv-faq-q").setAttribute("aria-expanded", open);
        });
    });

    /* ---------- Footer year ---------- */
    document.getElementById("year").textContent = new Date().getFullYear();
});