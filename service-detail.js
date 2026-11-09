document.addEventListener("DOMContentLoaded", () => {
    const html = document.documentElement;

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

    /* =====================================================
       IMAGE HELPERS (all photos are online sources)
       ===================================================== */
    const px = (id, w) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;
    const us = (id, w) => `https://unsplash.com/photos/${id}/download?force=true&w=${w}`;
    const IMG = {
        flow: (w) => px("4534605", w),
        woman: (w) => px("3822139", w),
        hatha: (w) => us("UbZ1je0X33Q", w),
        studio: (w) => us("5Io0sH2XEdk", w),
        plants: (w) => us("bHEoayA42qg", w),
        power: (w) => us("ETKSPU06AGI", w)
    };

    /* =====================================================
       SERVICE DATA – one entry per service (6 services)
       The page is chosen with ?service=<slug>
       ===================================================== */
    const SERVICES = {
        "group-classes": {
            name: "Group Classes", icon: "users",
            tagline: "Move, breathe and connect in a warm, welcoming group, every day of the week.",
            hero: "images/group class1.jpg", second: IMG.woman, third: IMG.hatha,
            badges: ["All levels welcome", "45+ weekly classes", "Mats & props included"],
            facts: [
                { icon: "clock", label: "Duration", value: "45 – 75 minutes" },
                { icon: "users", label: "Group size", value: "8 – 16 students" },
                { icon: "gauge", label: "Level", value: "Beginner to advanced" }
            ],
            ovTitle: "A class for every mood, body and level",
            ovChip: "New classes added every season",
            overview: [
                "Our group classes are the heart of Zenora. From slow Yin evenings to energising Vinyasa mornings, each session is thoughtfully sequenced and taught by a certified instructor who guides you with clear cues and kind adjustments.",
                "You will practice alongside people who are on the same journey, which makes it easier to show up, stay consistent and enjoy the shared energy of a room breathing together."
            ],
            highlights: ["Hatha, Vinyasa, Yin and Ashtanga", "Modifications for every body", "Small, calm class sizes", "Easy online booking"],
            stats: [{ v: 45, s: "+", l: "Weekly classes" }, { v: 12, s: "", l: "Teachers" }, { v: 6, s: "am", l: "First class" }],
            whyTitle: "Why practice in a group at Zenora",
            whyIntro: "Consistency is easier when you are supported by great teachers and a warm community.",
            why: [
                { icon: "calendar-check", t: "Plenty of choice", d: "More than 45 classes a week, from early mornings to late evenings, so there is always one that fits." },
                { icon: "heart", t: "Judgement-free space", d: "Beginners and experienced students practice side by side, with options offered for every pose." },
                { icon: "shield-check", t: "Safe, skilled teaching", d: "Certified teachers keep groups small enough to notice and adjust your alignment." },
                { icon: "users", t: "Real community", d: "Practice becomes a habit when you feel part of something. Our members become friends." }
            ],
            priceTitle: "Simple pricing for group classes",
            priceNote: "Sample prices. Mats, props and tea are always included.",
            plans: [
                { n: "Drop-In", d: "Try one class, no commitment", p: "18", per: "/ class", f: ["Any group class", "Mat and props included", "Book up to 7 days ahead"] },
                { n: "10-Class Pack", d: "Valid for 3 months", p: "140", per: "/ pack", f: ["Save $40 versus drop-in", "Share with a friend", "Track usage online"], pop: true },
                { n: "Unlimited", d: "Every class, every month", p: "95", per: "/ month", f: ["Unlimited group classes", "Priority slot booking", "1 free guest pass monthly"] }
            ],
            faqs: [
                { q: "Do I need experience to join a group class?", a: "Not at all. Our Beginner-tagged classes are made for first-timers, and every teacher offers simple modifications." },
                { q: "What should I bring?", a: "Just water and comfortable clothes. We provide mats, blocks, straps and bolsters." },
                { q: "How early should I arrive?", a: "Arrive about 10 minutes early for your first class so you can settle in and meet your teacher." },
                { q: "Can I cancel a booking?", a: "Yes. You can cancel free of charge up to 4 hours before the class begins." }
            ],
            ctaTitle: "Find your class and roll out your mat",
            ctaText: "Browse the timetable, pick a time and book your spot in seconds."
        },

        "private-sessions": {
            name: "Private Sessions", icon: "user-round",
            tagline: "One-to-one practice shaped around your goals, your body and your pace.",
            hero: "images/group.jpg", second: IMG.studio, third: IMG.woman,
            badges: ["Fully personalised", "In studio or online", "Flexible scheduling"],
            facts: [
                { icon: "clock", label: "Duration", value: "60 minutes" },
                { icon: "user-round", label: "Format", value: "One-to-one" },
                { icon: "map-pin", label: "Location", value: "Studio or online" }
            ],
            ovTitle: "Your practice, designed just for you",
            ovChip: "Matched with the right teacher",
            overview: [
                "A private session gives you a teacher's complete attention. Together you will set clear goals, whether that is building strength, easing back tension, deepening a pose or simply learning the basics with confidence.",
                "Each session is adapted in real time to how you feel on the day, and you will leave with a short home practice so progress continues between visits."
            ],
            highlights: ["Personal goal setting", "Injury-aware adaptations", "Home practice plan", "Choose your teacher"],
            stats: [{ v: 100, s: "%", l: "Personalised" }, { v: 60, s: "", l: "Minutes" }, { v: 12, s: "", l: "Teachers" }],
            whyTitle: "Why choose a private session",
            whyIntro: "Sometimes the fastest way forward is with someone who is fully focused on you.",
            why: [
                { icon: "target", t: "Goal-focused", d: "Every minute is spent on what matters most to you, from flexibility to stress relief." },
                { icon: "stethoscope", t: "Safe and adaptive", d: "Perfect if you are returning from injury, pregnant or simply want careful guidance." },
                { icon: "zap", t: "Faster progress", d: "Detailed feedback on alignment and breath helps you improve quickly and safely." },
                { icon: "calendar-clock", t: "On your schedule", d: "Book at a time that suits you, in the studio or from the comfort of home." }
            ],
            priceTitle: "Private session pricing",
            priceNote: "Sample prices. Your first consultation is included.",
            plans: [
                { n: "Single Session", d: "One 60 minute session", p: "70", per: "/ session", f: ["Personal consultation", "Choose your teacher", "Studio or online"] },
                { n: "5-Session Pack", d: "Build momentum", p: "325", per: "/ pack", f: ["Save $25", "Written home practice", "Priority scheduling"], pop: true },
                { n: "10-Session Pack", d: "Committed transformation", p: "600", per: "/ pack", f: ["Save $100", "Progress check-ins", "Flexible rescheduling"] }
            ],
            faqs: [
                { q: "How do I choose a teacher?", a: "Tell us your goals and we will recommend the best match, or you can request a teacher you already love." },
                { q: "Can private sessions be online?", a: "Yes. Sessions can be held in our studio or live over video, whichever suits you." },
                { q: "Is it suitable if I am injured or pregnant?", a: "Often yes. Your teacher will adapt the practice, and we advise checking with your doctor first." },
                { q: "What is the cancellation policy?", a: "Please give 24 hours notice to reschedule or cancel without a charge." }
            ],
            ctaTitle: "Ready for practice made just for you?",
            ctaText: "Tell us a little about your goals and we will match you with the perfect teacher."
        },

        "guided-meditation": {
            name: "Guided Meditation", icon: "flower-2",
            tagline: "Learn to quiet the mind with mindfulness, body scans and compassion practices.",
            hero: "images/meditation.jpg", second: IMG.plants, third: IMG.hatha,
            badges: ["Beginner friendly", "Seated or lying down", "Stress relief"],
            facts: [
                { icon: "clock", label: "Duration", value: "30 – 45 minutes" },
                { icon: "users", label: "Group size", value: "Up to 16 people" },
                { icon: "gauge", label: "Level", value: "No experience needed" }
            ],
            ovTitle: "Stillness you can take anywhere",
            ovChip: "Gentle, step-by-step guidance",
            overview: [
                "Guided meditation at Zenora is simple, practical and kind. Each session is led by an experienced teacher who walks you through breath awareness, body scans, loving-kindness and mindful listening.",
                "There is nothing to get right. You will learn techniques you can use at your desk, in traffic or before sleep, building a calmer baseline one session at a time."
            ],
            highlights: ["Mindfulness and body scans", "Loving-kindness practice", "Techniques for daily life", "Cushions and blankets provided"],
            stats: [{ v: 45, s: "", l: "Minute sessions" }, { v: 16, s: "", l: "Max group size" }, { v: 10, s: "+", l: "Years teaching" }],
            whyTitle: "Why meditate with us",
            whyIntro: "A calm mind is a skill. We help you build it in a supportive, distraction-free room.",
            why: [
                { icon: "brain", t: "Clearer focus", d: "Regular practice sharpens attention and helps you respond instead of react." },
                { icon: "moon", t: "Better sleep", d: "Evening sessions teach you to wind down and let go of the day." },
                { icon: "smile", t: "Lower stress", d: "Simple tools to settle your nervous system when life feels heavy." },
                { icon: "hand-heart", t: "No pressure", d: "Sit, lie down or use a chair. Every way of meditating is welcome." }
            ],
            priceTitle: "Meditation pricing",
            priceNote: "Sample prices. Cushions, blankets and tea are provided.",
            plans: [
                { n: "Single Session", d: "Drop in anytime", p: "15", per: "/ session", f: ["Any guided meditation", "No experience needed", "Props provided"] },
                { n: "4-Week Series", d: "Build a steady habit", p: "50", per: "/ series", f: ["Weekly guided sessions", "Audio practices to take home", "Small supportive group"], pop: true },
                { n: "Monthly Unlimited", d: "Meditate as often as you like", p: "35", per: "/ month", f: ["All meditation sessions", "Priority booking", "Seasonal workshops"] }
            ],
            faqs: [
                { q: "I have never meditated. Is that okay?", a: "Absolutely. Our sessions are designed for beginners and every instruction is explained clearly." },
                { q: "What if my mind keeps wandering?", a: "That is completely normal. Meditation is the practice of noticing and gently returning, not stopping thoughts." },
                { q: "Do I have to sit on the floor?", a: "No. You can sit on a cushion, a chair or even lie down." },
                { q: "Will I get recordings to practice at home?", a: "Series participants receive short audio practices to continue between sessions." }
            ],
            ctaTitle: "Give your mind a moment of peace",
            ctaText: "Join a guided session this week and feel the difference."
        },

        "breathwork": {
            name: "Breathwork", icon: "wind",
            tagline: "Simple, powerful breathing techniques to reduce stress and restore your energy.",
            hero: "images/breathwork.jpg", second: IMG.studio, third: IMG.power,
            badges: ["Pranayama based", "40 minute sessions", "Better sleep"],
            facts: [
                { icon: "clock", label: "Duration", value: "40 minutes" },
                { icon: "users", label: "Group size", value: "Up to 16 people" },
                { icon: "gauge", label: "Level", value: "All levels" }
            ],
            ovTitle: "Change how you feel with your breath",
            ovChip: "Techniques you can use anywhere",
            overview: [
                "Breathwork is one of the quickest ways to shift your state. Using traditional pranayama and modern breath techniques, our teachers help you calm anxiety, boost energy or prepare for deep rest.",
                "Each session combines guided practice, gentle movement and relaxation, and every technique is explained so you can safely use it on your own."
            ],
            highlights: ["Calming and energising techniques", "Safe, step-by-step instruction", "Guided relaxation", "Take-home practices"],
            stats: [{ v: 40, s: "", l: "Minute sessions" }, { v: 8, s: "+", l: "Techniques" }, { v: 98, s: "%", l: "Feel calmer" }],
            whyTitle: "Why try breathwork",
            whyIntro: "Your breath is always with you. Learn to use it with confidence.",
            why: [
                { icon: "wind", t: "Instant calm", d: "Slow, rhythmic breathing signals safety to your body within minutes." },
                { icon: "battery-charging", t: "Natural energy", d: "Energising patterns wake you up without caffeine or crashes." },
                { icon: "bed", t: "Deeper rest", d: "Evening techniques help you fall asleep faster and wake refreshed." },
                { icon: "shield-check", t: "Taught safely", d: "Certified teachers guide every round and offer gentle alternatives." }
            ],
            priceTitle: "Breathwork pricing",
            priceNote: "Sample prices. Props and blankets are provided.",
            plans: [
                { n: "Single Session", d: "One group session", p: "20", per: "/ session", f: ["40 minute guided class", "All levels", "Props provided"] },
                { n: "6-Session Series", d: "Learn the foundations", p: "100", per: "/ series", f: ["Weekly sessions", "Technique handbook", "Small group support"], pop: true },
                { n: "Private Breathwork", d: "Tailored one-to-one", p: "60", per: "/ session", f: ["Personal assessment", "Custom technique plan", "Studio or online"] }
            ],
            faqs: [
                { q: "Is breathwork safe for everyone?", a: "It is gentle and adaptable, but please tell your teacher about any heart conditions, pregnancy or asthma first." },
                { q: "What will I feel?", a: "Most people feel calm, clear and lighter. Some feel tingling or deep relaxation, which is normal." },
                { q: "Do I need to wear anything special?", a: "Just comfortable clothing that lets you breathe and move freely." },
                { q: "How often should I practice?", a: "Even 5 to 10 minutes a day makes a difference. We will give you simple routines to follow." }
            ],
            ctaTitle: "Take a deep breath and begin",
            ctaText: "Book a breathwork session and learn techniques that work in real life."
        },

        "workshops-retreats": {
            name: "Workshops & Retreats", icon: "calendar-days",
            tagline: "Weekend deep-dives and seasonal retreats to reset, recharge and learn something new.",
            hero: "https://images.pexels.com/photos/3822139/pexels-photo-3822139.jpeg?auto=compress&cs=tinysrgb&w=800", second: IMG.plants, third: IMG.flow,
            badges: ["Small groups", "Seasonal retreats", "Expert-led"],
            facts: [
                { icon: "calendar-days", label: "Format", value: "Half-day to weekend" },
                { icon: "users", label: "Group size", value: "Up to 20 people" },
                { icon: "sparkles", label: "Frequency", value: "Every season" }
            ],
            ovTitle: "Go deeper, away from the everyday",
            ovChip: "Fresh themes every season",
            overview: [
                "Our workshops and retreats give you uninterrupted time to learn, practice and rest. Topics range from arm balances and inversions to restorative practice, breathwork intensives and mindful living.",
                "Seasonal retreats combine yoga, meditation, nourishing meals and free time in beautiful surroundings, so you return home refreshed and inspired."
            ],
            highlights: ["Technique-focused workshops", "Weekend and seasonal retreats", "Nourishing vegetarian meals", "Take-home practice guides"],
            stats: [{ v: 4, s: "", l: "Retreats a year" }, { v: 20, s: "", l: "Max group size" }, { v: 24, s: "+", l: "Workshops a year" }],
            whyTitle: "Why join a workshop or retreat",
            whyIntro: "Extended time unlocks learning that a single class rarely can.",
            why: [
                { icon: "book-open", t: "Learn in depth", d: "Dedicated time to break down techniques and ask all your questions." },
                { icon: "mountain", t: "True reset", d: "Step away from screens and schedules and give yourself room to recover." },
                { icon: "users", t: "Small groups", d: "Intimate numbers mean personal attention and meaningful connection." },
                { icon: "award", t: "Expert guidance", d: "Led by senior teachers and carefully chosen guest specialists." }
            ],
            priceTitle: "Workshop & retreat pricing",
            priceNote: "Sample prices. Members receive workshop discounts.",
            plans: [
                { n: "Half-Day Workshop", d: "Focused 3 hour deep-dive", p: "65", per: "/ person", f: ["Expert-led learning", "Handouts and notes", "Members save 10%"] },
                { n: "Full-Day Intensive", d: "Immersive Saturday or Sunday", p: "120", per: "/ person", f: ["Morning and afternoon sessions", "Healthy lunch included", "Members save 10%"], pop: true },
                { n: "Weekend Retreat", d: "Reset for two days", p: "350", per: "/ person", f: ["Yoga and meditation daily", "Meals included", "Limited spaces"] }
            ],
            faqs: [
                { q: "Do I need experience for a retreat?", a: "No. Most of our retreats welcome all levels, and any specialist workshops will clearly state the level required." },
                { q: "Are meals included?", a: "Full-day intensives include lunch and retreats include all meals, which are vegetarian and freshly prepared." },
                { q: "How do I reserve a spot?", a: "Book through the member portal or contact us. A small deposit holds your place." },
                { q: "Can I get a refund?", a: "Deposits are transferable to another event if you notify us at least 14 days before the start." }
            ],
            ctaTitle: "Make time for a proper reset",
            ctaText: "See what is coming up this season and reserve your place early."
        },

        "corporate-wellness": {
            name: "Corporate Wellness", icon: "heart-handshake",
            tagline: "On-site and in-studio programs that bring calm and focus to your team.",
            hero: "images/wellness.jpg", second: IMG.flow, third: IMG.studio,
            badges: ["On-site or in-studio", "Customised programs", "Team focused"],
            facts: [
                { icon: "building-2", label: "Format", value: "On-site or studio" },
                { icon: "users", label: "Team size", value: "5 – 100 people" },
                { icon: "calendar-clock", label: "Schedule", value: "One-off or recurring" }
            ],
            ovTitle: "Healthier, calmer and more focused teams",
            ovChip: "Programs built around your workday",
            overview: [
                "Our corporate wellness programs bring the benefits of yoga, meditation and breathwork to the workplace. Sessions are practical, chair-friendly if needed and designed to fit around meetings and deadlines.",
                "We work with you to understand your team's needs, whether that is reducing stress, improving posture, boosting morale or building healthy habits, and craft a program that delivers."
            ],
            highlights: ["Desk-friendly movement", "Stress management workshops", "Team-building sessions", "Monthly and quarterly programs"],
            stats: [{ v: 50, s: "+", l: "Teams supported" }, { v: 30, s: "", l: "Minute sessions" }, { v: 95, s: "%", l: "Would rebook" }],
            whyTitle: "Why invest in team wellness",
            whyIntro: "Teams that feel good perform better. Small, regular practices add up.",
            why: [
                { icon: "trending-up", t: "Better focus", d: "Short mindful breaks improve concentration and reduce burnout." },
                { icon: "smile", t: "Higher morale", d: "Shared, positive experiences strengthen culture and connection." },
                { icon: "settings-2", t: "Fully customised", d: "Programs tailored to your space, schedule, goals and team size." },
                { icon: "briefcase", t: "Easy to run", d: "We bring everything needed and handle the logistics for you." }
            ],
            priceTitle: "Corporate program pricing",
            priceNote: "Sample prices. We will prepare a tailored quote for your team.",
            plans: [
                { n: "On-Site Session", d: "A single team session", p: "250", per: "/ session", f: ["Up to 25 participants", "30 to 60 minute session", "All equipment provided"] },
                { n: "Monthly Program", d: "Weekly sessions at work", p: "800", per: "/ month", f: ["4 sessions a month", "Custom themes", "Progress feedback"], pop: true },
                { n: "Quarterly Partnership", d: "A full wellness plan", p: "2,200", per: "/ quarter", f: ["12 sessions", "Workshops and challenges", "Dedicated coordinator"] }
            ],
            faqs: [
                { q: "Do you come to our office?", a: "Yes. We can run sessions on-site, or host your team at our studio in Banjara Hills." },
                { q: "Do people need to change clothes?", a: "No. We offer chair-based and desk-friendly options so everyone can join in work clothes." },
                { q: "Can the program be customised?", a: "Definitely. We tailor topics, timing and intensity to your team's needs." },
                { q: "How do we get a quote?", a: "Email or call us with your team size and goals and we will send a proposal within two working days." }
            ],
            ctaTitle: "Bring calm and focus to your team",
            ctaText: "Tell us about your workplace and we will design the right wellness program."
        }
    };

    const ORDER = Object.keys(SERVICES);

    /* ---------- Pick the service from the URL ---------- */
    const params = new URLSearchParams(window.location.search);
    let slug = (params.get("service") || window.location.hash.replace("#", "")).trim().toLowerCase();
    if (!SERVICES[slug]) slug = ORDER[0];
    const S = SERVICES[slug];

    /* =====================================================
       RENDER
       ===================================================== */
    const $ = (id) => document.getElementById(id);
    const setText = (id, txt) => { $(id).textContent = txt; };

    document.title = `${S.name} | Zenora Yoga & Meditation Studio`;
    $("metaDesc").setAttribute("content", `${S.name} at Zenora. ${S.tagline}`);

    /* Hero */
    const heroImg = $("sdHeroImg");
    heroImg.src = S.hero;
    heroImg.alt = `${S.name} at Zenora`;
    $("sdHeroIcon").setAttribute("data-lucide", S.icon);
    setText("sdTitle", S.name);
    setText("sdTagline", S.tagline);
    $("sdBadges").innerHTML = S.badges.map(b => `<li><i data-lucide="check-circle-2"></i>${b}</li>`).join("");
    $("sdFacts").innerHTML = S.facts.map(f => `
        <div class="sd-fact"><i data-lucide="${f.icon}"></i>
            <div><small>${f.label}</small><strong>${f.value}</strong></div></div>`).join("");

    /* Other services (names only, current one is left out) */
    $("sdOthers").innerHTML = ORDER.filter(k => k !== slug).map(k =>
        `<a href="service-detail.html?service=${k}"><i data-lucide="${SERVICES[k].icon}"></i>${SERVICES[k].name}</a>`).join("");

    /* Overview */
    const ovImg = $("sdOvImg");
    ovImg.src = S.hero;
    ovImg.alt = `${S.name} experience`;
    setText("sdOvChip", S.ovChip);
    setText("sdOvTitle", S.ovTitle);
    $("sdOvParas").innerHTML = S.overview.map(p => `<p>${p}</p>`).join("");
    $("sdHighlights").innerHTML = S.highlights.map(h => `<li><i data-lucide="check"></i>${h}</li>`).join("");
    $("sdStats").innerHTML = S.stats.map(s => `
        <div class="sd-stat"><strong><span data-count="${s.v}">0</span>${s.s}</strong><span>${s.l}</span></div>`).join("");

    /* Why choose */
    setText("sdWhyTitle", S.whyTitle);
    setText("sdWhyIntro", S.whyIntro);
    $("sdWhy").innerHTML = S.why.map((w, i) => `
        <article class="sd-why-card sd-reveal" style="--d:${i * 0.1}s">
            <span class="sd-why-no">0${i + 1}</span>
            <span class="sd-why-icon"><i data-lucide="${w.icon}"></i></span>
            <h3>${w.t}</h3><p>${w.d}</p>
        </article>`).join("");

    /* Pricing */
    setText("sdPriceTitle", S.priceTitle);
    setText("sdPriceNote", S.priceNote);
    $("sdPlans").innerHTML = S.plans.map((p, i) => `
        <article class="sd-plan ${p.pop ? "pop" : ""} sd-reveal" style="--d:${i * 0.12}s">
            ${p.pop ? `<span class="sd-plan-flag"><i data-lucide="star"></i> Most popular</span>` : ""}
            <h3>${p.n}</h3>
            <p class="sd-plan-desc">${p.d}</p>
            <div class="sd-price"><span>$</span>${p.p}<small>${p.per}</small></div>
            <ul>${p.f.map(x => `<li><i data-lucide="check"></i>${x}</li>`).join("")}</ul>
            <a href="login.html" class="btn ${p.pop ? "btn-primary" : "btn-secondary"}">Choose Plan</a>
        </article>`).join("");

    /* FAQs */
    setText("sdFaqTitle", `${S.name}: your questions answered`);
    $("sdFaq").innerHTML = S.faqs.map((f, i) => `
        <div class="sd-faq ${i === 0 ? "open" : ""} sd-reveal" style="--d:${i * 0.08}s">
            <button class="sd-faq-q" aria-expanded="${i === 0}"><em>0${i + 1}</em><span>${f.q}</span><i data-lucide="plus"></i></button>
            <div class="sd-faq-a"><div><p>${f.a}</p></div></div>
        </div>`).join("");

    /* CTA */
    const ctaImg = $("sdCtaImg");
    ctaImg.src = S.third(900);
    ctaImg.alt = `${S.name} at Zenora`;
    $("sdCtaIcon").setAttribute("data-lucide", S.icon);
    setText("sdCtaTitle", S.ctaTitle);
    setText("sdCtaText", S.ctaText);

    /* Icons (after all HTML has been written) */
    if (window.lucide) lucide.createIcons();

    /* =====================================================
       INTERACTIONS (after render)
       ===================================================== */
    /* Scroll reveal */
    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add("in"); revealObs.unobserve(e.target); }
        });
    }, { threshold: 0.12 });
    document.querySelectorAll(".sd-reveal").forEach(el => revealObs.observe(el));

    /* Animated counters */
    const countObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = +el.dataset.count;
            const start = performance.now();
            const tick = (now) => {
                const p = Math.min((now - start) / 1600, 1);
                el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target).toLocaleString();
                if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            countObs.unobserve(el);
        });
    }, { threshold: 0.6 });
    document.querySelectorAll("[data-count]").forEach(c => countObs.observe(c));

    /* FAQ accordion (one open at a time) */
    const faqItems = document.querySelectorAll(".sd-faq");
    faqItems.forEach(item => {
        item.querySelector(".sd-faq-q").addEventListener("click", () => {
            const open = item.classList.contains("open");
            faqItems.forEach(i => {
                i.classList.remove("open");
                i.querySelector(".sd-faq-q").setAttribute("aria-expanded", "false");
            });
            if (!open) {
                item.classList.add("open");
                item.querySelector(".sd-faq-q").setAttribute("aria-expanded", "true");
            }
        });
    });

    /* ---------- Footer year ---------- */
    document.getElementById("year").textContent = new Date().getFullYear();
});