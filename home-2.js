document.addEventListener("DOMContentLoaded", () => {
    const html = document.documentElement;
    const $ = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => [...r.querySelectorAll(s)];

    /* ---------- Icons ---------- */
    if (window.lucide) lucide.createIcons();

    /* ---------- Dark / Light mode ---------- */
    $("#themeToggle").addEventListener("click", () => {
        const dark = html.getAttribute("data-theme") === "dark";
        if (dark) html.removeAttribute("data-theme");
        else html.setAttribute("data-theme", "dark");
        try { localStorage.setItem("zenora-theme", dark ? "light" : "dark"); } catch (e) { }
    });

    /* ---------- RTL / LTR ---------- */
    $("#rtlToggle").addEventListener("click", () => {
        const next = html.getAttribute("dir") === "rtl" ? "ltr" : "rtl";
        html.setAttribute("dir", next);
        try { localStorage.setItem("zenora-dir", next); } catch (e) { }
    });

    /* ---------- Mobile menu ---------- */
    const burger = $("#burger");
    const nav = $("#nav");
    const dropdownItem = $(".has-dropdown");
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

    /* ---------- Home dropdown (click on mobile/touch, hover on desktop) ---------- */
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
    const header = $("#header");
    const heroBg = $("#heroBg");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const onScroll = () => {
        header.classList.toggle("scrolled", window.scrollY > 10);
        /* hero parallax */
        if (heroBg && !reduceMotion && window.scrollY < window.innerHeight) {
            heroBg.style.transform = `translateY(${window.scrollY * 0.25}px)`;
        }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    /* ---------- Scroll reveal ---------- */
    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add("in"); revealObs.unobserve(e.target); }
        });
    }, { threshold: 0.15 });
    $$(".reveal").forEach(el => revealObs.observe(el));

    /* ---------- Hero rotating word ---------- */
    const words = $$("#rotator span");
    if (words.length > 1) {
        let w = 0;
        setInterval(() => {
            words[w].classList.remove("active");
            w = (w + 1) % words.length;
            words[w].classList.add("active");
        }, 2600);
    }

    /* ---------- Services: expanding panels ---------- */
    const panels = $$(".panel");
    const activatePanel = (p) => {
        panels.forEach(x => x.classList.remove("active"));
        p.classList.add("active");
    };
    panels.forEach(p => {
        p.addEventListener("mouseenter", () => {
            if (window.matchMedia("(hover: hover) and (min-width: 981px)").matches) activatePanel(p);
        });
        p.addEventListener("click", () => activatePanel(p));
        p.addEventListener("focus", () => activatePanel(p));
    });

    /* ---------- Weekly schedule ---------- */
    const week = [
        { d: "Mon", n: 3, c: [
            ["6:30 AM", "Morning Flow", "Beginner", "Aanya Rao", "60 min"],
            ["12:30 PM", "Lunchtime Breathwork", "Beginner", "Meera Nair", "30 min"],
            ["6:00 PM", "Vinyasa Flow", "Intermediate", "Kabir Mehta", "60 min"],
            ["7:30 PM", "Yin Yoga", "Beginner", "Aanya Rao", "75 min"]] },
        { d: "Tue", n: 4, c: [
            ["6:30 AM", "Hatha Yoga", "Beginner", "Aanya Rao", "60 min"],
            ["5:30 PM", "Power Yoga", "Advanced", "Kabir Mehta", "60 min"],
            ["7:00 PM", "Mindful Meditation", "Beginner", "Meera Nair", "45 min"]] },
        { d: "Wed", n: 5, c: [
            ["6:30 AM", "Ashtanga Basics", "Intermediate", "Rohan Iyer", "75 min"],
            ["12:30 PM", "Hatha Yoga", "Beginner", "Aanya Rao", "60 min"],
            ["6:00 PM", "Vinyasa Flow", "Intermediate", "Kabir Mehta", "60 min"],
            ["7:30 PM", "Guided Meditation", "Beginner", "Meera Nair", "45 min"]] },
        { d: "Thu", n: 6, c: [
            ["6:30 AM", "Morning Flow", "Beginner", "Aanya Rao", "60 min"],
            ["5:30 PM", "Power Yoga", "Advanced", "Kabir Mehta", "60 min"],
            ["7:00 PM", "Yin Yoga", "Beginner", "Aanya Rao", "75 min"]] },
        { d: "Fri", n: 7, c: [
            ["6:30 AM", "Ashtanga Basics", "Intermediate", "Rohan Iyer", "75 min"],
            ["12:30 PM", "Lunchtime Breathwork", "Beginner", "Meera Nair", "30 min"],
            ["6:00 PM", "Vinyasa Flow", "Intermediate", "Kabir Mehta", "60 min"]] },
        { d: "Sat", n: 8, c: [
            ["8:00 AM", "Hatha Yoga", "Beginner", "Aanya Rao", "60 min"],
            ["10:00 AM", "Power Yoga", "Advanced", "Kabir Mehta", "60 min"],
            ["12:00 PM", "Mindful Meditation", "Beginner", "Meera Nair", "45 min"],
            ["4:00 PM", "Workshop: Breath & Balance", "Beginner", "Meera Nair", "90 min"]] },
        { d: "Sun", n: 9, c: [
            ["8:30 AM", "Gentle Flow", "Beginner", "Aanya Rao", "60 min"],
            ["10:30 AM", "Ashtanga Basics", "Intermediate", "Rohan Iyer", "75 min"],
            ["12:00 PM", "Guided Meditation", "Beginner", "Meera Nair", "45 min"]] }
    ];

    const daysEl = $("#days");
    const listEl = $("#schedule-list");

    const renderDay = (i) => {
        $$(".day", daysEl).forEach((b, k) => {
            b.classList.toggle("active", k === i);
            b.setAttribute("aria-selected", k === i);
        });
        listEl.innerHTML = week[i].c.map((s, k) => {
            const [time, name, lvl, teacher, dur] = s;
            const [t, ap] = time.split(" ");
            return `
            <article class="slot" style="animation-delay:${k * 0.08}s">
                <div class="slot-time">${t} ${ap}<small>${dur}</small></div>
                <div class="slot-main"><h3>${name}</h3><span>with ${teacher}</span></div>
                <span class="lvl">${lvl}</span>
                <a href="login.html" class="btn btn-primary">Book</a>
            </article>`;
        }).join("");
    };

    week.forEach((w, i) => {
        const b = document.createElement("button");
        b.className = "day";
        b.setAttribute("role", "tab");
        b.innerHTML = `<small>${w.d}</small><strong>${w.n}</strong>`;
        b.addEventListener("click", () => renderDay(i));
        daysEl.appendChild(b);
    });
    renderDay(0);

    /* ---------- Animated counters ---------- */
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
    $$("[data-count]").forEach(c => countObs.observe(c));

    /* ---------- Pricing toggle ---------- */
    const sw = $("#billSwitch");
    const priceEl = $("#unlimitedPrice");
    const unitEl = $("#unlimitedUnit");
    const descEl = $("#unlimitedDesc");
    const tM = $("#tMonthly");
    const tY = $("#tYearly");

    const setBilling = (yearly) => {
        sw.setAttribute("aria-checked", yearly);
        tM.classList.toggle("active", !yearly);
        tY.classList.toggle("active", yearly);
        priceEl.textContent = yearly ? "899" : "95";
        unitEl.textContent = yearly ? "/ year" : "/ month";
        descEl.textContent = yearly ? "Unlimited classes, billed yearly" : "Unlimited classes, billed monthly";
        priceEl.classList.remove("pop");
        void priceEl.offsetWidth;
        priceEl.classList.add("pop");
    };
    sw.addEventListener("click", () => setBilling(sw.getAttribute("aria-checked") !== "true"));
    tM.addEventListener("click", () => setBilling(false));
    tY.addEventListener("click", () => setBilling(true));

    /* ---------- Testimonial slider ---------- */
    const slides = $$(".slide");
    const dotsEl = $("#dots");
    let cur = 0, timer;

    slides.forEach((_, i) => {
        const d = document.createElement("button");
        d.className = "dot";
        d.setAttribute("aria-label", `Go to testimonial ${i + 1}`);
        d.addEventListener("click", () => { go(i); restart(); });
        dotsEl.appendChild(d);
    });
    const dots = $$(".dot", dotsEl);

    function go(i) {
        cur = (i + slides.length) % slides.length;
        slides.forEach((s, k) => s.classList.toggle("active", k === cur));
        dots.forEach((d, k) => d.classList.toggle("active", k === cur));
    }
    function restart() {
        clearInterval(timer);
        timer = setInterval(() => go(cur + 1), 6000);
    }
    $("#prevSlide").addEventListener("click", () => { go(cur - 1); restart(); });
    $("#nextSlide").addEventListener("click", () => { go(cur + 1); restart(); });
    $("#slider").addEventListener("mouseenter", () => clearInterval(timer));
    $("#slider").addEventListener("mouseleave", restart);
    go(0);
    restart();

    /* ---------- Newsletter form ---------- */
    const form = $("#newsForm");
    const msg = $("#newsMsg");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const v = $("#newsEmail").value.trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
            msg.textContent = "Please enter a valid email address.";
            return;
        }
        msg.textContent = "Thank you! You are on the list.";
        form.reset();
    });

    /* ---------- Tap state for touch devices (replaces hover) ---------- */
    const tapCards = $$(".tap-card");
    if (window.matchMedia("(hover: none)").matches) {
        tapCards.forEach(card => card.addEventListener("click", (e) => {
            if (e.target.closest("a, button")) return;
            const was = card.classList.contains("is-tapped");
            tapCards.forEach(c => c.classList.remove("is-tapped"));
            if (!was) card.classList.add("is-tapped");
        }));
    }

    /* ---------- Footer year ---------- */
    $("#year").textContent = new Date().getFullYear();
});