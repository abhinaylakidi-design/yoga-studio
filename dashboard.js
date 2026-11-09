document.addEventListener("DOMContentLoaded", () => {
    const html = document.documentElement;
    const $ = (id) => document.getElementById(id);
    const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
    const icons = () => { if (window.lucide) lucide.createIcons(); };
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* =====================================================
       DATE HELPERS
       ===================================================== */
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
    const fmt = (d, o) => d.toLocaleDateString("en-US", o);
    const longDate = (d) => fmt(d, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    const shortDate = (d) => fmt(d, { day: "numeric", month: "short", year: "numeric" });
    const dayName = (off) => off === 0 ? "Today" : off === 1 ? "Tomorrow" : fmt(addDays(today, off), { weekday: "long" });

    /* =====================================================
       STATE (sample data; replace with your real API data)
       ===================================================== */
    const TEACHERS = [
        { name: "Aanya Rao", role: "Hatha & Yin · 500-hr RYT", img: 47, rating: 4.9, yrs: 12, classes: 14 },
        { name: "Kabir Mehta", role: "Vinyasa & Power · 300-hr RYT", img: 12, rating: 4.8, yrs: 9, classes: 9 },
        { name: "Meera Nair", role: "Meditation & Breathwork", img: 49, rating: 5.0, yrs: 10, classes: 8 },
        { name: "Rohan Iyer", role: "Ashtanga · 500-hr RYT", img: 33, rating: 4.9, yrs: 11, classes: 5 }
    ];

    const SCHED = {
        1: [["06:30 AM", "Morning Flow", "Intermediate", "Kabir Mehta", 4, 14], ["09:00 AM", "Hatha Yoga", "Beginner", "Aanya Rao", 6, 12], ["12:30 PM", "Mindful Meditation", "Beginner", "Meera Nair", 9, 16], ["06:00 PM", "Power Yoga", "Advanced", "Kabir Mehta", 0, 10], ["07:45 PM", "Restorative Evening", "Beginner", "Meera Nair", 8, 12]],
        2: [["06:30 AM", "Ashtanga Basics", "Intermediate", "Rohan Iyer", 3, 10], ["10:00 AM", "Yin Yoga", "Beginner", "Aanya Rao", 7, 12], ["05:30 PM", "Breathwork Basics", "Beginner", "Meera Nair", 11, 16], ["07:00 PM", "Vinyasa Flow", "Intermediate", "Kabir Mehta", 5, 14]],
        3: [["06:30 AM", "Morning Flow", "Intermediate", "Kabir Mehta", 6, 14], ["09:30 AM", "Hatha Yoga", "Beginner", "Aanya Rao", 2, 12], ["12:30 PM", "Mindful Meditation", "Beginner", "Meera Nair", 10, 16], ["06:30 PM", "Arm Balance & Inversions", "Advanced", "Rohan Iyer", 4, 8]],
        4: [["06:30 AM", "Ashtanga Basics", "Intermediate", "Rohan Iyer", 5, 10], ["09:00 AM", "Vinyasa Flow", "Intermediate", "Kabir Mehta", 8, 14], ["05:30 PM", "Yin Yoga", "Beginner", "Aanya Rao", 0, 12], ["07:30 PM", "Breathwork Basics", "Beginner", "Meera Nair", 12, 16]],
        5: [["06:30 AM", "Morning Flow", "Intermediate", "Kabir Mehta", 7, 14], ["12:00 PM", "Hatha Yoga", "Beginner", "Aanya Rao", 9, 12], ["06:00 PM", "Power Yoga", "Advanced", "Kabir Mehta", 3, 10], ["07:30 PM", "Restorative Evening", "Beginner", "Meera Nair", 10, 12]],
        6: [["07:30 AM", "Vinyasa Flow", "Intermediate", "Kabir Mehta", 6, 14], ["09:30 AM", "Hatha Yoga", "Beginner", "Aanya Rao", 1, 12], ["11:30 AM", "Mindful Meditation", "Beginner", "Meera Nair", 12, 16], ["04:00 PM", "Yin Yoga", "Beginner", "Aanya Rao", 8, 12]],
        0: [["08:30 AM", "Gentle Hatha", "Beginner", "Aanya Rao", 10, 12], ["10:00 AM", "Breathwork Basics", "Beginner", "Meera Nair", 13, 16], ["11:30 AM", "Ashtanga Basics", "Intermediate", "Rohan Iyer", 4, 10]]
    };

    const state = {
        user: { first: "Sneha", last: "Patel", email: "sneha.patel@example.com", phone: "+91 98765 43210" },
        pack: { total: 10, used: 6, expiresIn: 45 },
        autoRenew: false,
        streak: 5,
        bookings: [
            { key: "1|06:30 AM|Morning Flow", off: 1, time: "06:30 AM", name: "Morning Flow", level: "Intermediate", teacher: "Kabir Mehta" },
            { key: "3|05:30 PM|Yin Yoga", off: 3, time: "05:30 PM", name: "Yin Yoga", level: "Beginner", teacher: "Aanya Rao" }
        ],
        past: [
            { off: -2, time: "09:00 AM", name: "Hatha Yoga", teacher: "Aanya Rao", rating: 5 },
            { off: -4, time: "06:30 AM", name: "Vinyasa Flow", teacher: "Kabir Mehta", rating: 4 },
            { off: -6, time: "12:30 PM", name: "Mindful Meditation", teacher: "Meera Nair", rating: 5 },
            { off: -9, time: "05:30 PM", name: "Yin Yoga", teacher: "Aanya Rao", rating: 0 },
            { off: -11, time: "07:00 PM", name: "Ashtanga Basics", teacher: "Rohan Iyer", rating: 4 },
            { off: -14, time: "09:00 AM", name: "Hatha Yoga", teacher: "Aanya Rao", rating: 5 }
        ],
        waitlist: new Set(),
        notifications: [
            { id: 1, type: "booking", tone: "ok", icon: "calendar-check", title: "Booking confirmed", text: "Morning Flow with Kabir is reserved for tomorrow at 6:30 AM.", time: "10 min ago", unread: true },
            { id: 2, type: "booking", tone: "", icon: "alarm-clock", title: "Class reminder", text: "Yin Yoga starts in 3 days. Remember to arrive 10 minutes early.", time: "2 hours ago", unread: true },
            { id: 3, type: "studio", tone: "warn", icon: "triangle-alert", title: "Pack expiring soon", text: "Your 10-class pack expires in 45 days. Renew to keep your rate.", time: "Yesterday", unread: true },
            { id: 4, type: "studio", tone: "", icon: "megaphone", title: "New workshop announced", text: "Arm Balance & Inversions intensive opens for booking this Saturday.", time: "2 days ago", unread: false },
            { id: 5, type: "studio", tone: "ok", icon: "badge-check", title: "Payment received", text: "We received your payment of $140 for the 10-Class Pack. Thank you!", time: "5 days ago", unread: false },
            { id: 6, type: "booking", tone: "", icon: "message-circle", title: "Message from Aanya", text: "Great progress in Hatha this month. Try Yin on Thursday for balance.", time: "1 week ago", unread: false }
        ],
        invoices: [
            { id: "INV-1050", desc: "Autumn Retreat deposit", date: -3, amount: 100, status: "Pending" },
            { id: "INV-1042", desc: "10-Class Pack", date: -30, amount: 140, status: "Paid" },
            { id: "INV-1031", desc: "Breathwork Workshop", date: -52, amount: 65, status: "Paid" },
            { id: "INV-1020", desc: "Private Session", date: -70, amount: 70, status: "Paid" },
            { id: "INV-1014", desc: "10-Class Pack", date: -118, amount: 140, status: "Paid" }
        ],
        favs: new Set([0, 1, 2, 3]),
        bookDay: 0,
        bookTab: "upcoming",
        nfFilter: "all"
    };

    /* try to restore profile saved in this browser */
    try {
        const saved = JSON.parse(localStorage.getItem("zenora-user") || "null");
        if (saved && saved.first) Object.assign(state.user, saved);
    } catch (e) { }

    const remaining = () => Math.max(0, state.pack.total - state.pack.used - state.bookings.length);
    const initials = () => (state.user.first[0] + (state.user.last[0] || "")).toUpperCase();

    /* =====================================================
       TOAST
       ===================================================== */
    const toastEl = $("toast"), toastMsg = $("toastMsg");
    let toastTimer;
    const toast = (msg) => {
        toastMsg.textContent = msg;
        toastEl.classList.add("show");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2800);
    };

    /* =====================================================
       THEME / RTL
       ===================================================== */
    $("themeToggle").addEventListener("click", () => {
        const dark = html.getAttribute("data-theme") === "dark";
        if (dark) html.removeAttribute("data-theme"); else html.setAttribute("data-theme", "dark");
        try { localStorage.setItem("zenora-theme", dark ? "light" : "dark"); } catch (e) { }
    });
    $("rtlToggle").addEventListener("click", () => {
        const next = html.getAttribute("dir") === "rtl" ? "ltr" : "rtl";
        html.setAttribute("dir", next);
        try { localStorage.setItem("zenora-dir", next); } catch (e) { }
    });

    /* =====================================================
       COUNTERS + RINGS (replay on every view)
       ===================================================== */
    const countUp = (el, target) => {
        if (reduceMotion) { el.textContent = target.toLocaleString(); return; }
        const start = performance.now();
        const tick = (now) => {
            const p = Math.min((now - start) / 1100, 1);
            el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target).toLocaleString();
            if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    };
    const setRing = (id, fraction) => {
        const el = $(id);
        if (!el) return;
        const C = 2 * Math.PI * 56;
        el.style.strokeDasharray = C;
        el.style.strokeDashoffset = C;
        requestAnimationFrame(() => requestAnimationFrame(() => {
            el.style.strokeDashoffset = C * (1 - Math.max(0, Math.min(1, fraction)));
        }));
    };
    const setBar = (id, pct) => {
        const el = $(id);
        if (!el) return;
        el.style.width = "0";
        requestAnimationFrame(() => requestAnimationFrame(() => { el.style.width = pct + "%"; }));
    };

    /* =====================================================
       SHARED UI (sidebar, header names, notifications bell)
       ===================================================== */
    const unreadCount = () => state.notifications.filter(n => n.unread).length;

    const renderShell = () => {
        const left = remaining();
        $("sidePackTxt").textContent = `${left} left`;
        $("sidePackSub").textContent = `Expires ${fmt(addDays(today, state.pack.expiresIn), { day: "numeric", month: "short" })}`;
        setBar("sidePackBar", (left / state.pack.total) * 100);

        const b = $("navBookings"), n = $("navNotifs");
        b.textContent = state.bookings.length; b.dataset.zero = state.bookings.length === 0;
        n.textContent = unreadCount(); n.dataset.zero = unreadCount() === 0;
        $("bellDot").classList.toggle("off", unreadCount() === 0);

        const full = `${state.user.first} ${state.user.last}`;
        ["topAvatar", "ppAvatar", "profAvatar"].forEach(id => $(id).textContent = initials());
        ["topName", "ppName", "profName", "memName", "cardHolder"].forEach(id => $(id).textContent = full);
        ["ppEmail", "profEmail"].forEach(id => $(id).textContent = state.user.email);

        renderMiniNotifs();
    };

    const renderMiniNotifs = () => {
        const list = state.notifications.slice(0, 4);
        $("notifMini").innerHTML = list.length ? list.map(n => `
            <li class="mini-n ${n.unread ? "unread" : ""}" data-id="${n.id}">
                <i data-lucide="${n.icon}"></i>
                <div><b>${n.title}</b><small>${n.time}</small></div>
            </li>`).join("") : `<li class="empty"><i data-lucide="bell-off"></i>You are all caught up</li>`;
        icons();
    };

    /* =====================================================
       VIEW ROUTER
       ===================================================== */
    const TITLES = {
        overview: "Overview", book: "Book a Class", bookings: "My Bookings", membership: "Membership",
        progress: "My Progress", instructors: "My Teachers", payments: "Payments",
        notifications: "Notifications", profile: "Profile & Settings"
    };
    const RENDER = {
        overview: () => renderOverview(), book: () => renderBook(), bookings: () => renderBookings(),
        membership: () => renderMembership(), progress: () => renderProgress(), instructors: () => renderTeachers(),
        payments: () => renderPayments(), notifications: () => renderNotifications(), profile: () => renderProfile()
    };
    let current = "overview";

    const show = (name, push = true) => {
        if (!TITLES[name]) name = "overview";
        current = name;
        $$(".view").forEach(v => v.classList.toggle("active", v.id === "view-" + name));
        $$(".nav-item").forEach(b => b.classList.toggle("active", b.dataset.view === name));
        $("pageTitle").textContent = TITLES[name];
        document.title = `${TITLES[name]} | User Dashboard | Zenora`;
        if (push) { try { history.replaceState(null, "", "#" + name); } catch (e) { } }
        RENDER[name]();
        icons();
        closeSidebar();
        closePanels();
        $("content").scrollTop = 0;
    };

    document.addEventListener("click", (e) => {
        const trigger = e.target.closest("[data-view]");
        if (trigger) { e.preventDefault(); show(trigger.dataset.view); }
    });
    window.addEventListener("hashchange", () => show(location.hash.replace("#", ""), false));

    /* =====================================================
       SIDEBAR (mobile drawer)
       ===================================================== */
    const sidebar = $("sidebar"), scrim = $("scrim");
    const openSidebar = () => { sidebar.classList.add("open"); scrim.classList.add("show"); };
    function closeSidebar() { sidebar.classList.remove("open"); scrim.classList.remove("show"); }
    $("burger").addEventListener("click", openSidebar);
    scrim.addEventListener("click", closeSidebar);

    /* =====================================================
       DROPDOWNS (notifications + profile)
       ===================================================== */
    const panels = [
        { btn: $("bellBtn"), panel: $("notifPanel") },
        { btn: $("profileBtn"), panel: $("profilePanel") }
    ];
    function closePanels() {
        panels.forEach(p => { p.panel.classList.remove("open"); p.btn.setAttribute("aria-expanded", "false"); });
    }
    panels.forEach(p => p.btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const willOpen = !p.panel.classList.contains("open");
        closePanels();
        if (willOpen) { p.panel.classList.add("open"); p.btn.setAttribute("aria-expanded", "true"); }
    }));
    document.addEventListener("click", (e) => {
        if (!e.target.closest(".dd-wrap")) closePanels();
    });
    $("notifMini").addEventListener("click", (e) => {
        const li = e.target.closest(".mini-n");
        if (!li) return;
        const n = state.notifications.find(x => x.id === +li.dataset.id);
        if (n) n.unread = false;
        renderShell();
        show("notifications");
    });
    $("markAllMini").addEventListener("click", () => { markAllRead(); });

    /* =====================================================
       LOGOUT
       ===================================================== */
    const modal = $("logoutModal");
    const openLogout = () => { closePanels(); closeSidebar(); modal.classList.add("open"); modal.setAttribute("aria-hidden", "false"); modal.querySelector("#confirmLogout").focus(); };
    const closeLogout = () => { modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true"); };
    $("logoutBtn").addEventListener("click", openLogout);
    $("ppLogout").addEventListener("click", openLogout);
    modal.querySelectorAll("[data-close]").forEach(el => el.addEventListener("click", closeLogout));
    $("confirmLogout").addEventListener("click", () => {
        toast("You have been logged out. See you soon!");
        closeLogout();
        setTimeout(() => { window.location.href = "login.html"; }, 1100);
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") { closeLogout(); closePanels(); closeSidebar(); }
    });

    /* =====================================================
       1. OVERVIEW
       ===================================================== */
    const bookingItem = (b, i, extra = "") => {
        const d = addDays(today, b.off);
        return `<li class="item" style="--i:${i}">
            <div class="date-block"><b>${d.getDate()}</b><small>${fmt(d, { month: "short" })}</small></div>
            <div class="item-main"><b>${b.name}</b>
                <small><span><i data-lucide="clock"></i>${b.time}</span><span><i data-lucide="user-round"></i>${b.teacher}</span></small></div>
            ${extra}</li>`;
    };

    function renderOverview() {
        const h = new Date().getHours();
        const greet = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
        $("welcomeTitle").textContent = `${greet}, ${state.user.first}`;
        $("todayLabel").textContent = longDate(new Date());

        const next = [...state.bookings].sort((a, b) => a.off - b.off)[0];
        $("welcomeMsg").textContent = next
            ? `Welcome back to Zenora. Your next class is ${next.name} ${next.off === 0 ? "today" : next.off === 1 ? "tomorrow" : "on " + fmt(addDays(today, next.off), { weekday: "long" })} at ${next.time} with ${next.teacher.split(" ")[0]}.`
            : "Welcome back to Zenora. You have no upcoming classes, so why not book one?";

        $("wStreak").textContent = state.streak;
        $("wMonth").textContent = state.past.length;

        const left = remaining();
        $("mLeftSub").innerHTML = left <= 2 ? `<span style="color:var(--warn)">Running low</span>` : `of ${state.pack.total} in pack`;
        $("mUpSub").textContent = next ? `Next: ${next.name}` : "Nothing booked";
        countUp($("mLeft"), left);
        countUp($("mMonth"), state.past.length);
        countUp($("mStreak"), state.streak);
        countUp($("mUpcoming"), state.bookings.length);

        const sorted = [...state.bookings].sort((a, b) => a.off - b.off);
        $("ovUpcoming").innerHTML = sorted.length
            ? sorted.map((b, i) => bookingItem(b, i, `<span class="status"><i data-lucide="check"></i>Confirmed</span>`)).join("")
            : `<li class="empty"><i data-lucide="calendar-x"></i><b>No upcoming sessions</b><button class="btn btn-primary sm" data-view="book">Book a class</button></li>`;

        /* weekly bars */
        const week = [1, 0, 2, 1, 1, 1, 0];
        const todayIdx = (new Date().getDay() + 6) % 7;
        const names = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        $("ovBars").innerHTML = week.map((v, i) => `
            <div class="bar-col ${i === todayIdx ? "today" : ""}" style="--i:${i}">
                <div class="bar-track"><b>${v}</b><div class="bar-fill" data-h="${(v / 3) * 100}" style="--i:${i}"></div></div>${names[i]}
            </div>`).join("");
        requestAnimationFrame(() => requestAnimationFrame(() => $$("#ovBars .bar-fill").forEach(f => f.style.height = Math.max(6, +f.dataset.h) + "%")));

        $("ovRingTxt").textContent = `${state.pack.used}/${state.pack.total}`;
        $("ovRingNote").textContent = `${left} classes available, ${state.bookings.length} reserved.`;
        setRing("ovRing", state.pack.used / state.pack.total);
    }

    /* =====================================================
       2. BOOK A CLASS
       ===================================================== */
    const slotsFor = (off) => (SCHED[addDays(today, off).getDay()] || []);
    const keyOf = (off, s) => `${off}|${s[0]}|${s[1]}`;

    function renderBook() {
        $("dayTabs").innerHTML = Array.from({ length: 7 }, (_, i) => {
            const d = addDays(today, i);
            return `<button class="${i === state.bookDay ? "active" : ""}" data-day="${i}"><b>${i === 0 ? "Today" : fmt(d, { weekday: "short" })}</b><small>${fmt(d, { day: "numeric", month: "short" })}</small></button>`;
        }).join("");

        const slots = slotsFor(state.bookDay);
        $("slotHeading").textContent = `${dayName(state.bookDay)}, ${fmt(addDays(today, state.bookDay), { day: "numeric", month: "long" })}`;
        $("slotCount").textContent = `${slots.length} classes`;
        $("slotList").innerHTML = slots.map((s, i) => {
            const key = keyOf(state.bookDay, s);
            const booked = state.bookings.some(b => b.key === key);
            const full = s[4] === 0;
            const waiting = state.waitlist.has(key);
            let label = "Book", icon = "calendar-plus", cls = "";
            if (booked) { label = "Booked"; icon = "check"; cls = "booked"; }
            else if (full && waiting) { label = "On waitlist"; icon = "bell-ring"; cls = "wait booked"; }
            else if (full) { label = "Join waitlist"; icon = "bell"; cls = "wait"; }
            const [t, ap] = s[0].split(" ");
            return `<div class="slot" style="--i:${i}">
                <div class="slot-time">${t}<small>${ap}</small></div>
                <div class="slot-name"><b>${s[1]}</b><span class="level">${s[2]}</span></div>
                <div class="slot-teacher">${s[3]}<small class="${s[4] > 0 && s[4] <= 3 ? "low" : ""}">${full ? "Class full" : s[4] + " spots left"}</small></div>
                <button class="act ${cls}" data-slot="${i}"><i data-lucide="${icon}"></i>${label}</button>
            </div>`;
        }).join("") || `<div class="empty"><i data-lucide="calendar-x"></i><b>No classes scheduled</b></div>`;

        const left = remaining();
        $("bkLeft").textContent = left;
        $("bkNote").textContent = left === 0 ? "You have no classes left. Renew your pack to keep booking." : `${state.bookings.length} reserved · ${state.pack.used} used of ${state.pack.total}`;
        setBar("bkBar", (left / state.pack.total) * 100);

        $("bkReservedCount").textContent = `${state.bookings.length}`;
        $("bkReserved").innerHTML = state.bookings.length
            ? [...state.bookings].sort((a, b) => a.off - b.off).map((b, i) => bookingItem(b, i)).join("")
            : `<li class="empty"><i data-lucide="ticket"></i>Nothing reserved yet</li>`;
        icons();
    }

    $("dayTabs").addEventListener("click", (e) => {
        const b = e.target.closest("[data-day]");
        if (!b) return;
        state.bookDay = +b.dataset.day;
        renderBook();
    });

    $("slotList").addEventListener("click", (e) => {
        const btn = e.target.closest("[data-slot]");
        if (!btn) return;
        const s = slotsFor(state.bookDay)[+btn.dataset.slot];
        const key = keyOf(state.bookDay, s);
        const idx = state.bookings.findIndex(b => b.key === key);
        if (idx > -1) {
            state.bookings.splice(idx, 1);
            toast(`Booking cancelled for ${s[1]}`);
        } else if (s[4] === 0) {
            if (state.waitlist.has(key)) { state.waitlist.delete(key); toast(`Removed from ${s[1]} waitlist`); }
            else { state.waitlist.add(key); toast(`You are on the ${s[1]} waitlist`); }
        } else {
            if (remaining() <= 0) { toast("No classes left. Please renew your pack."); return; }
            state.bookings.push({ key, off: state.bookDay, time: s[0], name: s[1], level: s[2], teacher: s[3] });
            state.notifications.unshift({ id: Date.now(), type: "booking", tone: "ok", icon: "calendar-check", title: "Booking confirmed", text: `${s[1]} with ${s[3].split(" ")[0]} on ${dayName(state.bookDay)} at ${s[0]}.`, time: "Just now", unread: true });
            toast(`Booked: ${s[1]}. See you on the mat!`);
        }
        renderShell();
        renderBook();
    });

    /* =====================================================
       3. MY BOOKINGS
       ===================================================== */
    function renderBookings() {
        $$("#bkTabs button").forEach(b => b.classList.toggle("active", b.dataset.tab === state.bookTab));
        const up = state.bookTab === "upcoming";
        $("bkListTitle").textContent = up ? "Upcoming sessions" : "Attended classes";

        if (up) {
            const list = [...state.bookings].sort((a, b) => a.off - b.off);
            $("bkListCount").textContent = `${list.length} booked`;
            $("bkList").innerHTML = list.length ? list.map((b, i) => bookingItem(b, i,
                `<span class="status"><i data-lucide="check"></i>Confirmed</span>
                 <button class="act danger sm" data-cancel="${b.key}"><i data-lucide="x"></i>Cancel</button>`)).join("")
                : `<div class="empty"><i data-lucide="calendar-x"></i><b>No upcoming sessions</b><button class="btn btn-primary sm" data-view="book">Book a class</button></div>`;
        } else {
            $("bkListCount").textContent = `${state.past.length} attended`;
            $("bkList").innerHTML = state.past.map((b, i) => bookingItem(b, i, `
                <div class="stars" data-past="${i}" aria-label="Rate this class">
                    ${[1, 2, 3, 4, 5].map(n => `<button class="${n <= b.rating ? "on" : ""}" data-star="${n}" aria-label="${n} stars"><i data-lucide="star"></i></button>`).join("")}
                </div>`)).join("");
        }
        $("attPct").textContent = "92%";
        setRing("attRing", .92);
        icons();
    }

    $("bkTabs").addEventListener("click", (e) => {
        const b = e.target.closest("[data-tab]");
        if (!b) return;
        state.bookTab = b.dataset.tab;
        renderBookings();
    });

    $("bkList").addEventListener("click", (e) => {
        const cancel = e.target.closest("[data-cancel]");
        if (cancel) {
            const i = state.bookings.findIndex(b => b.key === cancel.dataset.cancel);
            if (i > -1) {
                const [b] = state.bookings.splice(i, 1);
                toast(`Cancelled ${b.name}. Your class was returned to your pack.`);
                renderShell(); renderBookings();
            }
            return;
        }
        const star = e.target.closest("[data-star]");
        if (star) {
            const idx = +star.closest("[data-past]").dataset.past;
            state.past[idx].rating = +star.dataset.star;
            toast("Thanks for your feedback!");
            renderBookings();
        }
    });

    /* =====================================================
       4. MEMBERSHIP
       ===================================================== */
    function renderMembership() {
        const left = remaining();
        const exp = addDays(today, state.pack.expiresIn);
        $("memExpiry").textContent = `Valid until ${shortDate(exp)}`;
        $("memRingTxt").textContent = left;
        $("memUsed").textContent = `${state.pack.used} / ${state.pack.total}`;
        $("memRenew").textContent = shortDate(exp);
        $("memNext").textContent = "$140";
        $("autoRenew").checked = state.autoRenew;
        setRing("memRing", left / state.pack.total);
    }

    $("autoRenew").addEventListener("change", (e) => {
        state.autoRenew = e.target.checked;
        toast(state.autoRenew ? "Auto-renew turned on" : "Auto-renew turned off");
    });

    $("renewBtn").addEventListener("click", () => {
        state.pack.total = 10; state.pack.used = 0; state.pack.expiresIn = 90;
        state.invoices.unshift({ id: "INV-" + (1051 + state.invoices.length), desc: "10-Class Pack (renewal)", date: 0, amount: 140, status: "Paid" });
        state.notifications.unshift({ id: Date.now(), type: "studio", tone: "ok", icon: "badge-check", title: "Pack renewed", text: "Your new 10-class pack is active for 3 months.", time: "Just now", unread: true });
        toast("Pack renewed: 10 new classes added");
        renderShell(); renderMembership();
    });

    $$("[data-upgrade]").forEach(btn => btn.addEventListener("click", () => {
        state.notifications.unshift({ id: Date.now(), type: "studio", tone: "", icon: "crown", title: "Upgrade requested", text: `We received your request to upgrade to ${btn.dataset.upgrade}. Our team will confirm shortly.`, time: "Just now", unread: true });
        toast(`Upgrade to ${btn.dataset.upgrade} requested`);
        renderShell();
    }));

    /* =====================================================
       5. PROGRESS
       ===================================================== */
    function renderProgress() {
        $$("#view-progress [data-count]").forEach(el => countUp(el, +el.dataset.n));

        /* line chart */
        const months = [], vals = [4, 6, 5, 8, 7, state.past.length];
        for (let i = 5; i >= 0; i--) months.push(fmt(new Date(today.getFullYear(), today.getMonth() - i, 1), { month: "short" }));
        const W = 560, H = 230, padL = 30, padR = 20, padT = 28, padB = 34, max = 10;
        const x = (i) => padL + (i * (W - padL - padR)) / (vals.length - 1);
        const y = (v) => padT + (1 - v / max) * (H - padT - padB);
        const pts = vals.map((v, i) => [x(i), y(v)]);
        const path = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
        const area = `${path} L ${x(vals.length - 1)} ${H - padB} L ${x(0)} ${H - padB} Z`;
        $("lineChart").innerHTML = `
            <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="Monthly attendance">
                <defs><linearGradient id="lg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stop-color="var(--secondary)" stop-opacity=".55"/><stop offset="1" stop-color="var(--secondary)" stop-opacity="0"/></linearGradient></defs>
                ${[0, 5, 10].map(g => `<line class="grid-line" x1="${padL}" x2="${W - padR}" y1="${y(g)}" y2="${y(g)}"/><text class="axis-txt" x="0" y="${y(g) + 4}">${g}</text>`).join("")}
                <path class="line-area" d="${area}" fill="url(#lg)"/>
                <path class="line-path" d="${path}"/>
                ${pts.map((p, i) => `<circle class="line-dot" style="animation-delay:${0.5 + i * 0.18}s" cx="${p[0]}" cy="${p[1]}" r="6"><title>${months[i]}: ${vals[i]} classes</title></circle>
                    <text class="val-txt" x="${p[0]}" y="${p[1] - 14}" text-anchor="middle">${vals[i]}</text>
                    <text class="axis-txt" x="${p[0]}" y="${H - 8}" text-anchor="middle">${months[i]}</text>`).join("")}
            </svg>`;

        /* donut */
        const data = [["Hatha", 35, "#3F6655"], ["Vinyasa", 25, "#D9C6A3"], ["Yin", 22, "#7FA894"], ["Meditation", 18, "#B8995F"]];
        const R = 54, C = 2 * Math.PI * R;
        let acc = 0;
        $("donut").innerHTML = `<svg viewBox="0 0 150 150">
            ${data.map(d => {
            const len = (d[1] / 100) * C;
            const c = `<circle cx="75" cy="75" r="${R}" stroke="${d[2]}" stroke-dasharray="0 ${C}" data-len="${len}" stroke-dashoffset="${-acc}"><title>${d[0]}: ${d[1]}%</title></circle>`;
            acc += len; return c;
        }).join("")}</svg>
            <div class="donut-center"><b>36</b><small>classes</small></div>`;
        requestAnimationFrame(() => requestAnimationFrame(() => $$("#donut circle").forEach(c => c.style.strokeDasharray = `${c.dataset.len - 3} ${C}`)));
        $("donutLegend").innerHTML = data.map(d => `<li><i style="background:${d[2]}"></i>${d[0]}<b>${d[1]}%</b></li>`).join("");

        /* goals */
        const goals = [
            ["Classes this month", state.past.length, 12],
            ["Try a new style", 1, 2],
            ["Meditate weekly", 3, 4]
        ];
        $("goalList").innerHTML = goals.map((g, i) => `
            <li><div class="goal-top"><span>${g[0]}</span><b>${g[1]} / ${g[2]}</b></div>
            <div class="bar"><i id="goal${i}"></i></div></li>`).join("");
        goals.forEach((g, i) => setBar("goal" + i, Math.min(100, (g[1] / g[2]) * 100)));

        /* heatmap (12 weeks x 7 days, deterministic) */
        let seed = 7;
        const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
        $("heat").innerHTML = Array.from({ length: 84 }, (_, i) => {
            const r = rnd();
            const lvl = r > .86 ? 3 : r > .66 ? 2 : r > .45 ? 1 : 0;
            return `<i class="l${lvl}" style="--i:${i}" title="${lvl ? lvl + (lvl > 1 ? " classes" : " class") : "Rest day"}"></i>`;
        }).join("");
    }

    /* =====================================================
       6. MY TEACHERS
       ===================================================== */
    function renderTeachers() {
        $("teacherGrid").innerHTML = TEACHERS.map((t, i) => `
            <article class="t-card" style="--i:${i}">
                <div class="t-img">
                    <img src="https://i.pravatar.cc/500?img=${t.img}" alt="Portrait of ${t.name}" loading="lazy" onerror="this.style.display='none'" />
                    <button class="t-fav ${state.favs.has(i) ? "" : "off"}" data-fav="${i}" aria-label="Favourite"><i data-lucide="heart"></i></button>
                    <span class="t-rate"><i data-lucide="star"></i>${t.rating.toFixed(1)}</span>
                </div>
                <h3>${t.name}</h3>
                <p class="t-role">${t.role}</p>
                <div class="t-meta"><span><i data-lucide="award"></i>${t.yrs} yrs</span><span><i data-lucide="calendar-check"></i>${t.classes} with you</span></div>
                <div class="t-btns">
                    <button class="act" data-t-book="${i}"><i data-lucide="calendar-plus"></i>Book</button>
                    <button class="act wait" data-t-msg="${i}"><i data-lucide="message-circle"></i>Message</button>
                </div>
            </article>`).join("");
        icons();
    }

    $("teacherGrid").addEventListener("click", (e) => {
        const fav = e.target.closest("[data-fav]");
        const book = e.target.closest("[data-t-book]");
        const msg = e.target.closest("[data-t-msg]");
        if (fav) {
            const i = +fav.dataset.fav;
            if (state.favs.has(i)) { state.favs.delete(i); toast(`Removed ${TEACHERS[i].name} from favourites`); }
            else { state.favs.add(i); toast(`${TEACHERS[i].name} added to favourites`); }
            fav.classList.toggle("off", !state.favs.has(i));
        }
        if (book) { toast(`Choose a class with ${TEACHERS[+book.dataset.tBook].name.split(" ")[0]}`); show("book"); }
        if (msg) toast(`Message sent to ${TEACHERS[+msg.dataset.tMsg].name}`);
    });

    /* =====================================================
       7. PAYMENTS
       ===================================================== */
    function renderPayments() {
        const paid = state.invoices.filter(i => i.status === "Paid").reduce((s, i) => s + i.amount, 0);
        const pend = state.invoices.filter(i => i.status === "Pending").reduce((s, i) => s + i.amount, 0);
        $("payTotal").textContent = "$" + paid.toLocaleString();
        $("payPending").textContent = "$" + pend.toLocaleString();
        $("payNext").textContent = fmt(addDays(today, state.pack.expiresIn), { day: "numeric", month: "short" });
        $("invCount").textContent = `${state.invoices.length} invoices`;
        $("invBody").innerHTML = state.invoices.map((inv, i) => `
            <tr style="--i:${i}">
                <td><b>${inv.id}</b></td>
                <td>${inv.desc}</td>
                <td>${shortDate(addDays(today, inv.date))}</td>
                <td><b>$${inv.amount}</b></td>
                <td><span class="status ${inv.status === "Paid" ? "" : "warn"}"><i data-lucide="${inv.status === "Paid" ? "check" : "clock"}"></i>${inv.status}</span></td>
                <td>${inv.status === "Paid"
                ? `<button class="act sm wait" data-dl="${inv.id}"><i data-lucide="download"></i>Receipt</button>`
                : `<button class="act sm" data-pay="${inv.id}"><i data-lucide="credit-card"></i>Pay now</button>`}</td>
            </tr>`).join("");
        icons();
    }

    $("invBody").addEventListener("click", (e) => {
        const dl = e.target.closest("[data-dl]");
        const pay = e.target.closest("[data-pay]");
        if (dl) toast(`Receipt ${dl.dataset.dl} downloaded`);
        if (pay) {
            const inv = state.invoices.find(i => i.id === pay.dataset.pay);
            if (inv) { inv.status = "Paid"; toast(`Payment of $${inv.amount} successful`); renderPayments(); }
        }
    });
    $("updateCard").addEventListener("click", () => toast("Secure card update link sent to your email"));

    /* =====================================================
       8. NOTIFICATIONS
       ===================================================== */
    function renderNotifications() {
        $$("#nfTabs button").forEach(b => b.classList.toggle("active", b.dataset.nf === state.nfFilter));
        const f = state.nfFilter;
        const list = state.notifications.filter(n => f === "all" || (f === "unread" ? n.unread : n.type === f));
        $("nfList").innerHTML = list.length ? list.map((n, i) => `
            <li class="nf ${n.unread ? "unread" : ""} ${n.tone}" style="--i:${i}" data-id="${n.id}">
                <span class="nf-icon"><i data-lucide="${n.icon}"></i></span>
                <div class="nf-body"><b>${n.title}</b><p>${n.text}</p></div>
                <span class="nf-time">${n.time}</span>
                <div class="nf-actions">
                    ${n.unread ? `<button data-read="${n.id}" aria-label="Mark as read" title="Mark as read"><i data-lucide="check"></i></button>` : ""}
                    <button class="del" data-del="${n.id}" aria-label="Delete" title="Delete"><i data-lucide="trash-2"></i></button>
                </div>
            </li>`).join("") : `<li class="empty"><i data-lucide="bell-off"></i><b>Nothing here</b>You are all caught up.</li>`;
        icons();
    }

    function markAllRead() {
        state.notifications.forEach(n => n.unread = false);
        renderShell();
        if (current === "notifications") renderNotifications();
        toast("All notifications marked as read");
    }
    $("markAll").addEventListener("click", markAllRead);

    $("nfTabs").addEventListener("click", (e) => {
        const b = e.target.closest("[data-nf]");
        if (!b) return;
        state.nfFilter = b.dataset.nf;
        renderNotifications();
    });

    $("nfList").addEventListener("click", (e) => {
        const read = e.target.closest("[data-read]");
        const del = e.target.closest("[data-del]");
        if (read) {
            const n = state.notifications.find(x => x.id === +read.dataset.read);
            if (n) n.unread = false;
            renderShell(); renderNotifications();
        }
        if (del) {
            const id = +del.dataset.del;
            const li = del.closest(".nf");
            li.classList.add("removing");
            setTimeout(() => {
                state.notifications = state.notifications.filter(x => x.id !== id);
                renderShell(); renderNotifications();
                toast("Notification deleted");
            }, 350);
        }
    });

    /* =====================================================
       9. PROFILE & SETTINGS
       ===================================================== */
    function renderProfile() {
        $("fFirst").value = state.user.first;
        $("fLast").value = state.user.last;
        $("fEmail").value = state.user.email;
        $("fPhone").value = state.user.phone;
        $("fErr").hidden = true;
        $$("#profileForm input").forEach(i => i.classList.remove("invalid"));
    }

    $("saveProfile").addEventListener("click", () => {
        const first = $("fFirst").value.trim(), last = $("fLast").value.trim();
        const email = $("fEmail").value.trim(), phone = $("fPhone").value.trim();
        const err = $("fErr");
        $$("#profileForm input").forEach(i => i.classList.remove("invalid"));
        err.hidden = true;

        const fail = (field, msg) => { $(field).classList.add("invalid"); err.textContent = msg; err.hidden = false; $(field).focus(); };
        if (!first) return fail("fFirst", "Please enter your first name.");
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail("fEmail", "Please enter a valid email address.");
        if (phone && !/^[+\d][\d\s-]{6,}$/.test(phone)) return fail("fPhone", "Please enter a valid phone number.");

        state.user = { first, last, email, phone };
        try { localStorage.setItem("zenora-user", JSON.stringify(state.user)); } catch (e) { }
        renderShell();
        toast("Profile saved successfully");
    });

    $("changePw").addEventListener("click", () => toast("Password reset link sent to your email"));
    $$("#view-profile .prefs-card input").forEach(inp => inp.addEventListener("change", () => toast("Preference updated")));

    /* =====================================================
       INIT
       ===================================================== */
    renderShell();
    const start = location.hash.replace("#", "");
    show(TITLES[start] ? start : "overview", false);
    icons();
});