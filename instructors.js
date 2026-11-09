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
    document.querySelectorAll(".ins-reveal").forEach(el => revealObs.observe(el));

    /* ---------- Animated counters ---------- */
    const countObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = +el.dataset.count;
            const duration = 1700;
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
    document.querySelectorAll("[data-count]").forEach(c => countObs.observe(c));

    /* ---------- Toast ---------- */
    const toast = document.getElementById("insToast");
    const toastMsg = document.getElementById("insToastMsg");
    let toastTimer;
    const showToast = (msg) => {
        toastMsg.textContent = msg;
        toast.classList.add("show");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove("show"), 3000);
    };

    /* =====================================================
       TEACHER DATA (used by the grid and the profile modal)
       ===================================================== */
    const teachers = [
        {
            name: "Aanya Rao", role: "Hatha & Yin · 500-hr RYT", tags: ["hatha"], years: 12,
            img: "https://i.pravatar.cc/700?img=47",
            bio: "Aanya's teaching is gentle, detailed and deeply attentive. She helps students move with awareness, ease tension and build a practice that supports everyday life.",
            certs: ["500-hour Registered Yoga Teacher", "Yin Yoga certification", "Anatomy and injury-aware teaching"],
            classes: ["Hatha Yoga", "Yin Yoga", "Gentle Hatha"]
        },
        {
            name: "Kabir Mehta", role: "Vinyasa & Power · 300-hr RYT", tags: ["vinyasa"], years: 9,
            img: "https://i.pravatar.cc/700?img=12",
            bio: "Kabir blends energising sequences with thoughtful cues so every student feels strong and safe. His classes are playful, challenging and always breath-led.",
            certs: ["300-hour Registered Yoga Teacher", "Power and arm-balance workshop leader", "First Aid & CPR"],
            classes: ["Vinyasa Flow", "Power Yoga", "Morning Flow"]
        },
        {
            name: "Meera Nair", role: "Meditation & Breathwork", tags: ["meditation", "breathwork"], years: 10,
            img: "https://i.pravatar.cc/700?img=49",
            bio: "Meera makes stillness approachable. Her sessions combine mindfulness, body scans and simple breathing techniques anyone can carry into a busy day.",
            certs: ["Mindfulness teacher training", "Pranayama practitioner", "Restorative yoga certification"],
            classes: ["Mindful Meditation", "Breathwork Basics", "Restorative Evening"]
        },
        {
            name: "Rohan Iyer", role: "Ashtanga · 500-hr RYT", tags: ["vinyasa"], years: 11,
            img: "https://i.pravatar.cc/700?img=33",
            bio: "Rohan teaches the traditional Ashtanga method with patience and humour, breaking the sequence into clear, achievable steps for new and returning students.",
            certs: ["500-hour Registered Yoga Teacher", "Ashtanga method training", "Inversions and arm-balance mentor"],
            classes: ["Ashtanga Basics", "Arm Balance & Inversions"]
        },
        {
            name: "Sana Khan", role: "Restorative & Prenatal", tags: ["hatha"], years: 8,
            img: "https://randomuser.me/api/portraits/women/44.jpg",
            bio: "Sana specialises in slow, supported practice. Her restorative and prenatal classes offer rest, reassurance and community during demanding seasons of life.",
            certs: ["Prenatal yoga certification", "Restorative yoga training", "Yoga Alliance RYT-200"],
            classes: ["Restorative Evening", "Prenatal Yoga"]
        },
        {
            name: "Vikram Desai", role: "Hatha & Alignment", tags: ["hatha"], years: 14,
            img: "https://randomuser.me/api/portraits/men/52.jpg",
            bio: "With more than a decade on the mat, Vikram focuses on precise, sustainable alignment, helping students build a strong foundation and practice pain-free.",
            certs: ["Yoga Alliance RYT-500", "Therapeutic alignment training", "First Aid & CPR"],
            classes: ["Hatha Yoga", "Foundations Workshop"]
        },
        {
            name: "Priya Menon", role: "Vinyasa & Yoga Nidra", tags: ["vinyasa", "meditation"], years: 7,
            img: "https://randomuser.me/api/portraits/women/65.jpg",
            bio: "Priya pairs flowing Vinyasa with deep Yoga Nidra rest, a combination her students describe as the perfect reset for body and mind.",
            certs: ["Yoga Alliance RYT-300", "Yoga Nidra facilitator", "Mindfulness teacher training"],
            classes: ["Vinyasa Flow", "Yoga Nidra"]
        },
        {
            name: "Arjun Reddy", role: "Breathwork & Pranayama", tags: ["breathwork"], years: 6,
            img: "https://randomuser.me/api/portraits/men/75.jpg",
            bio: "Arjun leads energising and calming breathwork sessions rooted in traditional pranayama, helping students manage stress, focus and sleep better.",
            certs: ["Pranayama teacher training", "Breathwork facilitator", "Yoga Alliance RYT-200"],
            classes: ["Breathwork Basics", "Pranayama Workshop"]
        }
    ];

    /* ---------- Render grid ---------- */
    const grid = document.getElementById("insGrid");
    grid.innerHTML = teachers.map((t, i) => `
        <article class="ins-card" data-tags="${t.tags.join(" ")}" style="animation-delay:${i * 70}ms">
            <div class="ins-card-img">
                <img src="${t.img}" alt="Portrait of instructor ${t.name}" loading="lazy" onerror="this.style.display='none'" />
                <div class="ins-card-over"><span>
                    <i data-lucide="instagram"></i><i data-lucide="linkedin"></i><i data-lucide="mail"></i>
                </span></div>
            </div>
            <h3>${t.name}</h3>
            <span class="ins-card-role">${t.role}</span>
            <button class="ins-card-btn" data-open="${i}">View profile <i data-lucide="arrow-right" class="flip"></i></button>
        </article>`).join("");
    lucide.createIcons();

    /* ---------- Filter chips ---------- */
    const chips = document.querySelectorAll(".ins-chip");
    chips.forEach(chip => chip.addEventListener("click", () => {
        chips.forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        const f = chip.dataset.filter;
        let n = 0;
        grid.querySelectorAll(".ins-card").forEach(card => {
            const show = f === "all" || card.dataset.tags.split(" ").includes(f);
            card.classList.toggle("hide", !show);
            if (show) {
                card.style.animation = "none";
                void card.offsetHeight;
                card.style.animation = "";
                card.style.animationDelay = (n++ * 70) + "ms";
            }
        });
    }));

    /* =====================================================
       HERO PANELS (hover on desktop, click / focus on touch)
       ===================================================== */
    const panels = [...document.querySelectorAll(".ins-panel")];
    const activate = (p) => {
        panels.forEach(x => x.classList.toggle("active", x === p));
    };
    panels.forEach(p => {
        p.addEventListener("mouseenter", () => {
            if (window.matchMedia("(hover: hover)").matches) activate(p);
        });
        p.addEventListener("click", () => activate(p));
        p.addEventListener("focus", () => activate(p));
    });

    /* =====================================================
       PROFILE MODAL
       ===================================================== */
    const modal = document.getElementById("insModal");
    const mImg = document.getElementById("mImg");
    const mName = document.getElementById("mName");
    const mRole = document.getElementById("mRole");
    const mYears = document.getElementById("mYears");
    const mBio = document.getElementById("mBio");
    const mCerts = document.getElementById("mCerts");
    const mClasses = document.getElementById("mClasses");
    let lastFocus = null;

    const openModal = (i) => {
        const t = teachers[i];
        if (!t) return;
        lastFocus = document.activeElement;
        mImg.style.display = "";
        mImg.src = t.img;
        mImg.alt = `Portrait of instructor ${t.name}`;
        mImg.onerror = () => { mImg.style.display = "none"; };
        mName.textContent = t.name;
        mRole.textContent = t.role;
        mYears.textContent = `${t.years} years of teaching experience`;
        mBio.textContent = t.bio;
        mCerts.innerHTML = t.certs.map(c => `<li><i data-lucide="badge-check"></i>${c}</li>`).join("");
        mClasses.innerHTML = t.classes.map(c => `<span>${c}</span>`).join("");
        lucide.createIcons();
        modal.classList.add("open");
        modal.setAttribute("aria-hidden", "false");
        document.body.classList.add("no-scroll");
        modal.querySelector(".ins-modal-close").focus();
    };

    const closeModal = () => {
        modal.classList.remove("open");
        modal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("no-scroll");
        if (lastFocus) lastFocus.focus();
    };

    document.addEventListener("click", (e) => {
        const opener = e.target.closest("[data-open]");
        if (opener) { e.stopPropagation(); openModal(+opener.dataset.open); return; }
        if (e.target.closest("[data-close]")) closeModal();
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
    });

    /* =====================================================
       TESTIMONIAL SLIDER
       ===================================================== */
    const slides = [...document.querySelectorAll(".ins-slide")];
    const dotsWrap = document.getElementById("insDots");
    const slider = document.getElementById("insSlider");
    let current = 0, auto;

    dotsWrap.innerHTML = slides.map((_, i) => `<button class="ins-dot ${i === 0 ? "active" : ""}" aria-label="Show testimonial ${i + 1}"></button>`).join("");
    const dots = [...dotsWrap.children];

    const go = (n) => {
        current = (n + slides.length) % slides.length;
        slides.forEach((s, i) => s.classList.toggle("active", i === current));
        dots.forEach((d, i) => d.classList.toggle("active", i === current));
    };
    const startAuto = () => { stopAuto(); auto = setInterval(() => go(current + 1), 6000); };
    const stopAuto = () => clearInterval(auto);

    document.getElementById("insNext").addEventListener("click", () => { go(current + 1); startAuto(); });
    document.getElementById("insPrev").addEventListener("click", () => { go(current - 1); startAuto(); });
    dots.forEach((d, i) => d.addEventListener("click", () => { go(i); startAuto(); }));
    slider.addEventListener("mouseenter", stopAuto);
    slider.addEventListener("mouseleave", startAuto);
    startAuto();

    /* =====================================================
       BOOKING FORM (front-end validation only)
       ===================================================== */
    const form = document.getElementById("insForm");
    const fName = document.getElementById("fName");
    const fEmail = document.getElementById("fEmail");
    const fTeacher = document.getElementById("fTeacher");
    const fError = document.getElementById("fError");

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        [fName, fEmail].forEach(f => f.classList.remove("invalid"));
        fError.hidden = true;

        const name = fName.value.trim();
        const email = fEmail.value.trim();
        const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        if (!name) {
            fName.classList.add("invalid");
            fError.textContent = "Please enter your name.";
            fError.hidden = false;
            fName.focus();
            return;
        }
        if (!emailOk) {
            fEmail.classList.add("invalid");
            fError.textContent = "Please enter a valid email address.";
            fError.hidden = false;
            fEmail.focus();
            return;
        }

        showToast(`Thanks ${name.split(" ")[0]}! We will contact you about ${fTeacher.value === "Any teacher" ? "a matching teacher" : fTeacher.value}.`);
        form.reset();
    });

    /* ---------- Footer year ---------- */
    document.getElementById("year").textContent = new Date().getFullYear();
});