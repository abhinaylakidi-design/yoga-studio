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
    document.querySelectorAll(".cl-reveal").forEach(el => revealObs.observe(el));

    /* ---------- Toast helper ---------- */
    const toast = document.getElementById("clToast");
    const toastMsg = document.getElementById("clToastMsg");
    let toastTimer;
    const showToast = (msg) => {
        toastMsg.textContent = msg;
        toast.classList.add("show");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
    };

    /* =====================================================
       CLASS FINDER (level + type + search)
       ===================================================== */
    const cards = [...document.querySelectorAll(".cl-card")];
    const levelChips = [...document.querySelectorAll("#levelChips .cl-chip")];
    const typeChips = [...document.querySelectorAll("#typeChips .cl-chip")];
    const searchInput = document.getElementById("clSearch");
    const countEl = document.getElementById("clCount");
    const emptyEl = document.getElementById("clEmpty");
    const state = { level: "all", type: "all", q: "" };

    const applyFilters = () => {
        let shown = 0;
        cards.forEach(card => {
            const ok =
                (state.level === "all" || card.dataset.level === state.level) &&
                (state.type === "all" || card.dataset.type === state.type) &&
                (!state.q || card.dataset.name.includes(state.q));
            card.classList.toggle("hide", !ok);
            if (ok) {
                shown++;
                card.style.animation = "none";
                void card.offsetHeight;
                card.style.animation = "";
                card.style.animationDelay = (shown * 60) + "ms";
            }
        });
        countEl.textContent = shown === 1 ? "Showing 1 class" : `Showing ${shown} classes`;
        emptyEl.hidden = shown !== 0;
    };

    const setActive = (chips, el) => {
        chips.forEach(c => c.classList.remove("active"));
        el.classList.add("active");
    };

    levelChips.forEach(chip => chip.addEventListener("click", () => {
        setActive(levelChips, chip);
        state.level = chip.dataset.level;
        applyFilters();
    }));
    typeChips.forEach(chip => chip.addEventListener("click", () => {
        setActive(typeChips, chip);
        state.type = chip.dataset.type;
        applyFilters();
    }));
    searchInput.addEventListener("input", () => {
        state.q = searchInput.value.trim().toLowerCase();
        applyFilters();
    });

    const resetFilters = () => {
        state.level = "all"; state.type = "all"; state.q = "";
        searchInput.value = "";
        setActive(levelChips, levelChips[0]);
        setActive(typeChips, typeChips[0]);
        applyFilters();
    };
    document.getElementById("clReset").addEventListener("click", resetFilters);

    /* Hero quick-jump buttons: filter by type then scroll to finder */
    document.querySelectorAll("[data-jump]").forEach(btn => btn.addEventListener("click", () => {
        const type = btn.dataset.jump;
        const chip = typeChips.find(c => c.dataset.type === type);
        if (chip) chip.click();
        document.getElementById("finder").scrollIntoView({ behavior: "smooth" });
    }));

    /* Goal cards: map to a filter by names */
    const goalMap = {
        relax: ["yin yoga", "restorative evening", "breathwork basics pranayama"],
        strength: ["power yoga", "vinyasa flow", "ashtanga basics", "arm balance and inversions"],
        focus: ["mindful meditation", "breathwork basics pranayama"]
    };
    document.querySelectorAll("[data-goal]").forEach(link => link.addEventListener("click", (e) => {
        e.preventDefault();
        const names = goalMap[link.dataset.goal] || [];
        state.level = "all"; state.type = "all"; state.q = "";
        searchInput.value = "";
        setActive(levelChips, levelChips[0]);
        setActive(typeChips, typeChips[0]);
        let shown = 0;
        cards.forEach(card => {
            const ok = names.includes(card.dataset.name);
            card.classList.toggle("hide", !ok);
            if (ok) {
                shown++;
                card.style.animation = "none";
                void card.offsetHeight;
                card.style.animation = "";
                card.style.animationDelay = (shown * 60) + "ms";
            }
        });
        countEl.textContent = `Showing ${shown} classes for this goal`;
        emptyEl.hidden = shown !== 0;
        document.getElementById("finder").scrollIntoView({ behavior: "smooth" });
    }));

    applyFilters();

    /* Favourite hearts */
    document.querySelectorAll(".cl-fav").forEach(btn => btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const on = btn.classList.toggle("on");
        btn.setAttribute("aria-pressed", on);
        showToast(on ? "Saved to your favourites" : "Removed from favourites");
    }));

    /* "Book now" on a card: jump to timetable */
    document.querySelectorAll(".cl-book").forEach(link => link.addEventListener("click", () => {
        showToast(`Pick a time for ${link.dataset.class}`);
    }));

    /* =====================================================
       TIMETABLE
       ===================================================== */
    const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const schedule = {
        0: [
            { t: "06:30", ap: "AM", n: "Morning Flow", l: "Intermediate", w: "Kabir Mehta", d: 60, s: 4, c: 14 },
            { t: "09:00", ap: "AM", n: "Hatha Yoga", l: "Beginner", w: "Aanya Rao", d: 60, s: 6, c: 12 },
            { t: "12:30", ap: "PM", n: "Mindful Meditation", l: "Beginner", w: "Meera Nair", d: 45, s: 9, c: 16 },
            { t: "06:00", ap: "PM", n: "Power Yoga", l: "Advanced", w: "Kabir Mehta", d: 60, s: 0, c: 10 },
            { t: "07:45", ap: "PM", n: "Restorative Evening", l: "Beginner", w: "Meera Nair", d: 60, s: 8, c: 12 }
        ],
        1: [
            { t: "06:30", ap: "AM", n: "Ashtanga Basics", l: "Intermediate", w: "Rohan Iyer", d: 75, s: 3, c: 10 },
            { t: "10:00", ap: "AM", n: "Yin Yoga", l: "Beginner", w: "Aanya Rao", d: 75, s: 7, c: 12 },
            { t: "05:30", ap: "PM", n: "Breathwork Basics", l: "Beginner", w: "Meera Nair", d: 40, s: 11, c: 16 },
            { t: "07:00", ap: "PM", n: "Vinyasa Flow", l: "Intermediate", w: "Kabir Mehta", d: 60, s: 5, c: 14 }
        ],
        2: [
            { t: "06:30", ap: "AM", n: "Morning Flow", l: "Intermediate", w: "Kabir Mehta", d: 60, s: 6, c: 14 },
            { t: "09:30", ap: "AM", n: "Hatha Yoga", l: "Beginner", w: "Aanya Rao", d: 60, s: 2, c: 12 },
            { t: "12:30", ap: "PM", n: "Mindful Meditation", l: "Beginner", w: "Meera Nair", d: 45, s: 10, c: 16 },
            { t: "06:30", ap: "PM", n: "Arm Balance & Inversions", l: "Advanced", w: "Rohan Iyer", d: 90, s: 4, c: 8 }
        ],
        3: [
            { t: "06:30", ap: "AM", n: "Ashtanga Basics", l: "Intermediate", w: "Rohan Iyer", d: 75, s: 5, c: 10 },
            { t: "09:00", ap: "AM", n: "Vinyasa Flow", l: "Intermediate", w: "Kabir Mehta", d: 60, s: 8, c: 14 },
            { t: "05:30", ap: "PM", n: "Yin Yoga", l: "Beginner", w: "Aanya Rao", d: 75, s: 0, c: 12 },
            { t: "07:30", ap: "PM", n: "Breathwork Basics", l: "Beginner", w: "Meera Nair", d: 40, s: 12, c: 16 }
        ],
        4: [
            { t: "06:30", ap: "AM", n: "Morning Flow", l: "Intermediate", w: "Kabir Mehta", d: 60, s: 7, c: 14 },
            { t: "12:00", ap: "PM", n: "Hatha Yoga", l: "Beginner", w: "Aanya Rao", d: 60, s: 9, c: 12 },
            { t: "06:00", ap: "PM", n: "Power Yoga", l: "Advanced", w: "Kabir Mehta", d: 60, s: 3, c: 10 },
            { t: "07:30", ap: "PM", n: "Restorative Evening", l: "Beginner", w: "Meera Nair", d: 60, s: 10, c: 12 }
        ],
        5: [
            { t: "07:30", ap: "AM", n: "Vinyasa Flow", l: "Intermediate", w: "Kabir Mehta", d: 60, s: 6, c: 14 },
            { t: "09:30", ap: "AM", n: "Hatha Yoga", l: "Beginner", w: "Aanya Rao", d: 60, s: 1, c: 12 },
            { t: "11:30", ap: "AM", n: "Mindful Meditation", l: "Beginner", w: "Meera Nair", d: 45, s: 12, c: 16 },
            { t: "04:00", ap: "PM", n: "Yin Yoga", l: "Beginner", w: "Aanya Rao", d: 75, s: 8, c: 12 }
        ],
        6: [
            { t: "08:30", ap: "AM", n: "Gentle Hatha", l: "Beginner", w: "Aanya Rao", d: 60, s: 10, c: 12 },
            { t: "10:00", ap: "AM", n: "Breathwork Basics", l: "Beginner", w: "Meera Nair", d: 40, s: 13, c: 16 },
            { t: "11:30", ap: "AM", n: "Ashtanga Basics", l: "Intermediate", w: "Rohan Iyer", d: 75, s: 4, c: 10 }
        ]
    };

    const daysEl = document.getElementById("clDays");
    const tableEl = document.getElementById("clTable");
    const booked = new Set();
    const waitlist = new Set();

    /* real calendar dates starting from today (Mon-first week) */
    const today = new Date();
    const jsDay = today.getDay();                  // 0 Sun .. 6 Sat
    const todayIdx = (jsDay + 6) % 7;              // 0 Mon .. 6 Sun
    const monday = new Date(today);
    monday.setDate(today.getDate() - todayIdx);
    const fmt = (d) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

    let activeDay = todayIdx;

    const renderDays = () => {
        daysEl.innerHTML = dayNames.map((n, i) => {
            const d = new Date(monday); d.setDate(monday.getDate() + i);
            return `<button class="cl-day ${i === activeDay ? "active" : ""}" role="tab" aria-selected="${i === activeDay}" data-day="${i}">
                <strong>${n}</strong><small>${fmt(d)}</small></button>`;
        }).join("");
    };

    const renderTable = () => {
        tableEl.innerHTML = (schedule[activeDay] || []).map((s, i) => {
            const key = `${activeDay}-${i}`;
            const full = s.s === 0;
            const pct = Math.max(6, Math.round(((s.c - s.s) / s.c) * 100));
            let label = "Book", icon = "calendar-plus", cls = "";
            if (booked.has(key)) { label = "Booked"; icon = "check"; cls = "booked"; }
            else if (full && waitlist.has(key)) { label = "On waitlist"; icon = "check"; cls = "wait booked"; }
            else if (full) { label = "Join waitlist"; icon = "bell"; cls = "wait"; }
            const spotsTxt = full ? "Class full" : `${s.s} spot${s.s === 1 ? "" : "s"} left`;
            return `<div class="cl-row" style="--i:${i}">
                <div class="cl-time">${s.t}<small>${s.ap} · ${s.d} min</small></div>
                <div class="cl-what"><strong>${s.n}</strong><span>${s.l}</span></div>
                <div class="cl-who"><i data-lucide="user-round"></i>${s.w}</div>
                <div class="cl-spots ${s.s <= 3 ? "low" : ""}">${spotsTxt}
                    <div class="cl-bar"><span style="--w:${pct}%"></span></div></div>
                <button class="cl-act ${cls}" data-key="${key}" data-name="${s.n}" data-full="${full}">
                    <i data-lucide="${icon}"></i>${label}</button>
            </div>`;
        }).join("") || `<p style="text-align:center;color:var(--text-muted)">No classes scheduled.</p>`;
        lucide.createIcons();
    };

    daysEl.addEventListener("click", (e) => {
        const btn = e.target.closest(".cl-day");
        if (!btn) return;
        activeDay = +btn.dataset.day;
        renderDays();
        renderTable();
    });

    tableEl.addEventListener("click", (e) => {
        const btn = e.target.closest(".cl-act");
        if (!btn) return;
        const { key, name } = btn.dataset;
        const full = btn.dataset.full === "true";
        if (full) {
            if (waitlist.has(key)) { waitlist.delete(key); showToast(`Removed from ${name} waitlist`); }
            else { waitlist.add(key); showToast(`You are on the ${name} waitlist`); }
        } else {
            if (booked.has(key)) { booked.delete(key); showToast(`Booking cancelled for ${name}`); }
            else { booked.add(key); showToast(`Booked: ${name}. See you on the mat!`); }
        }
        renderTable();
    });

    renderDays();
    renderTable();

    /* =====================================================
       FAQ ACCORDION
       ===================================================== */
    const faqItems = document.querySelectorAll(".cl-faq-item");
    faqItems.forEach(item => {
        item.querySelector(".cl-faq-q").addEventListener("click", () => {
            const open = item.classList.contains("open");
            faqItems.forEach(i => {
                i.classList.remove("open");
                i.querySelector(".cl-faq-q").setAttribute("aria-expanded", "false");
            });
            if (!open) {
                item.classList.add("open");
                item.querySelector(".cl-faq-q").setAttribute("aria-expanded", "true");
            }
        });
    });

    /* ---------- Footer year ---------- */
    document.getElementById("year").textContent = new Date().getFullYear();
});