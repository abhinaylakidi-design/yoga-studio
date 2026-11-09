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
    document.querySelectorAll(".mb-reveal").forEach(el => revealObs.observe(el));

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* =====================================================
       HERO: 3D member card (tilt + plan switcher)
       ===================================================== */
    const tiers = {
        pack: {
            badge: "Class Pack", plan: "10 classes", valid: "3 months", price: "$140", per: "/ pack",
            perks: ["Any group class", "Easy online booking", "Share with a friend"]
        },
        unlimited: {
            badge: "Unlimited", plan: "Unlimited classes", valid: "Monthly", price: "$95", per: "/ month",
            perks: ["Unlimited classes", "Priority booking", "1 free guest pass"]
        },
        annual: {
            badge: "Annual", plan: "Unlimited + 2 private", valid: "12 months", price: "$899", per: "/ year",
            perks: ["2 private sessions", "Workshop discounts", "Pause up to 30 days"]
        }
    };

    const card = document.getElementById("mbCard");
    const tilt = document.getElementById("mbTilt");
    const stage = document.getElementById("mbStage");
    const wrap = document.querySelector(".mb-card-wrap");
    const tierBtns = [...document.querySelectorAll(".mb-tier")];
    const perksEl = document.getElementById("mbPerks");
    const ui = {
        badge: document.getElementById("mbBadge"),
        plan: document.getElementById("mbPlan"),
        valid: document.getElementById("mbValid"),
        price: document.getElementById("mbPrice"),
        per: document.getElementById("mbPer")
    };

    const renderPerks = (key) => {
        perksEl.innerHTML = tiers[key].perks.map((p, i) =>
            `<li style="--i:${i}"><i data-lucide="check-circle-2"></i>${p}</li>`).join("");
        lucide.createIcons();
    };

    const setTier = (key, animate = true) => {
        const t = tiers[key];
        tierBtns.forEach(b => {
            const on = b.dataset.tier === key;
            b.classList.toggle("active", on);
            b.setAttribute("aria-selected", on);
        });
        const apply = () => {
            card.dataset.tier = key;
            ui.badge.textContent = t.badge;
            ui.plan.textContent = t.plan;
            ui.valid.textContent = t.valid;
            ui.price.textContent = t.price;
            ui.per.textContent = t.per;
            renderPerks(key);
        };
        if (animate && !reduceMotion) {
            card.classList.remove("swap");
            void card.offsetWidth;
            card.classList.add("swap");
            setTimeout(apply, 330);
            setTimeout(() => card.classList.remove("swap"), 720);
        } else {
            apply();
        }
    };

    let order = ["pack", "unlimited", "annual"];
    let idx = 0, autoTimer = null;
    const startAuto = () => {
        stopAuto();
        autoTimer = setInterval(() => { idx = (idx + 1) % order.length; setTier(order[idx]); }, 5000);
    };
    const stopAuto = () => clearInterval(autoTimer);

    tierBtns.forEach(b => b.addEventListener("click", () => {
        idx = order.indexOf(b.dataset.tier);
        setTier(b.dataset.tier);
        startAuto();
    }));

    setTier("pack", false);
    if (!reduceMotion) startAuto();

    /* Mouse tilt + moving sheen */
    if (window.matchMedia("(hover: hover)").matches && !reduceMotion) {
        wrap.addEventListener("mousemove", (e) => {
            const r = wrap.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width;
            const y = (e.clientY - r.top) / r.height;
            tilt.classList.remove("reset");
            tilt.style.setProperty("--ry", ((x - 0.5) * 16).toFixed(2) + "deg");
            tilt.style.setProperty("--rx", ((0.5 - y) * 14).toFixed(2) + "deg");
            card.style.setProperty("--mx", (x * 100).toFixed(1) + "%");
            card.style.setProperty("--my", (y * 100).toFixed(1) + "%");
        });
        wrap.addEventListener("mouseleave", () => {
            tilt.classList.add("reset");
            tilt.style.setProperty("--ry", "0deg");
            tilt.style.setProperty("--rx", "0deg");
        });
    }

    /* =====================================================
       PLAN FINDER
       ===================================================== */
    const range = document.getElementById("mbRange");
    const weeklyEl = document.getElementById("mbWeekly");
    const monthlyEl = document.getElementById("mbMonthly");
    const adviceEl = document.getElementById("mbAdvice");
    const results = [...document.querySelectorAll(".mb-result")];

    const PACK_PRICE = 140, PACK_CLASSES = 10;
    const UNLIMITED = 95;
    const ANNUAL_TOTAL = 899;
    const WEEKS_PER_MONTH = 4.33;
    const money = (n) => "$" + Math.round(n).toLocaleString();
    const money2 = (n) => "$" + n.toFixed(2).replace(/\.00$/, "");

    const updateFinder = () => {
        const perWeek = +range.value;
        const perMonth = perWeek * WEEKS_PER_MONTH;

        weeklyEl.textContent = perWeek;
        monthlyEl.textContent = `≈ ${Math.round(perMonth)} classes / month`;
        range.style.setProperty("--fill", ((perWeek - 1) / 6 * 100) + "%");

        const packMonthly = perMonth * (PACK_PRICE / PACK_CLASSES);
        const annualMonthly = ANNUAL_TOTAL / 12;
        const costs = { pack: packMonthly, unlimited: UNLIMITED, annual: annualMonthly };

        document.getElementById("rPack").textContent = money(packMonthly);
        document.getElementById("rUnl").textContent = money(UNLIMITED);
        document.getElementById("rAnn").textContent = money(annualMonthly);

        document.getElementById("cPack").textContent = money2(PACK_PRICE / PACK_CLASSES);
        document.getElementById("cUnl").textContent = money2(UNLIMITED / perMonth);
        document.getElementById("cAnn").textContent = money2(annualMonthly / perMonth);

        const maxCost = Math.max(...Object.values(costs));
        document.getElementById("bPack").style.width = (packMonthly / maxCost * 100) + "%";
        document.getElementById("bUnl").style.width = (UNLIMITED / maxCost * 100) + "%";
        document.getElementById("bAnn").style.width = (annualMonthly / maxCost * 100) + "%";

        const best = Object.keys(costs).reduce((a, b) => costs[a] <= costs[b] ? a : b);
        results.forEach(r => r.classList.toggle("best", r.dataset.plan === best));

        const names = { pack: "Class Pack", unlimited: "Unlimited Monthly", annual: "Annual Member" };
        let msg;
        if (best === "pack") {
            msg = `At ${perWeek} class per week, the Class Pack is your best value, and it needs no commitment.`;
        } else {
            const saved = packMonthly - costs[best];
            msg = `At ${perWeek} classes per week, ${names[best]} is your best value, saving about ${money(saved)} a month compared with buying packs.`;
            if (best === "annual") msg += " Prefer flexibility? Unlimited Monthly is the next best choice.";
        }
        adviceEl.textContent = msg;
    };
    range.addEventListener("input", updateFinder);
    updateFinder();

    /* =====================================================
       FAQ ACCORDION
       ===================================================== */
    const faqItems = document.querySelectorAll(".mb-faq-item");
    faqItems.forEach(item => {
        item.querySelector(".mb-faq-q").addEventListener("click", () => {
            const open = item.classList.contains("open");
            faqItems.forEach(i => {
                i.classList.remove("open");
                i.querySelector(".mb-faq-q").setAttribute("aria-expanded", "false");
            });
            if (!open) {
                item.classList.add("open");
                item.querySelector(".mb-faq-q").setAttribute("aria-expanded", "true");
            }
        });
    });

    /* ---------- Footer year ---------- */
    document.getElementById("year").textContent = new Date().getFullYear();
});