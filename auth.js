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

    /* ---------- Show / hide password (eye icon) ---------- */
    document.querySelectorAll(".eye-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const input = document.getElementById(btn.dataset.eye);
            const show = input.type === "password";
            input.type = show ? "text" : "password";
            btn.setAttribute("aria-label", show ? "Hide password" : "Show password");
            btn.innerHTML = `<i data-lucide="${show ? "eye-off" : "eye"}"></i>`;
            lucide.createIcons();
        });
    });

    /* ---------- Helpers ---------- */
    const msg = document.getElementById("formMsg");
    const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

    const showMsg = (text, ok = false, field = null) => {
        msg.textContent = text;
        msg.classList.toggle("ok", ok);
        document.querySelectorAll(".input-wrap input").forEach(i => i.classList.remove("invalid"));
        if (field) field.classList.add("invalid");
    };

    document.querySelectorAll(".input-wrap input").forEach(i =>
        i.addEventListener("input", () => { i.classList.remove("invalid"); if (!msg.classList.contains("ok")) msg.textContent = ""; })
    );

    /* ---------- Login ---------- */
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        try {
            const saved = localStorage.getItem("zenora-remember");
            if (saved) {
                document.getElementById("email").value = saved;
                document.getElementById("remember").checked = true;
            }
        } catch (e) { }

        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = document.getElementById("email");
            const pass = document.getElementById("password");

            if (!emailOk(email.value.trim())) return showMsg("Please enter a valid email address.", false, email);
            if (!pass.value) return showMsg("Please enter your password.", false, pass);

            // Demo credentials check – replace with your real authentication
            if (email.value.trim().toLowerCase() === "member@zenora.com" && pass.value === "Zenora@123") {
                try {
                    if (document.getElementById("remember").checked) localStorage.setItem("zenora-remember", email.value.trim());
                    else localStorage.removeItem("zenora-remember");
                } catch (err) { }
                showMsg("Login successful. Redirecting…", true);
                setTimeout(() => (window.location.href = "dashboard.html"), 700);
            } else {
                showMsg("Incorrect email or password.", false, pass);
            }
        });
    }

    /* ---------- Sign up ---------- */
    const signupForm = document.getElementById("signupForm");
    if (signupForm) {
        signupForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("name");
            const email = document.getElementById("email");
            const pass = document.getElementById("password");
            const confirm = document.getElementById("confirm");
            const terms = document.getElementById("terms");

            if (name.value.trim().length < 2) return showMsg("Please enter your full name.", false, name);
            if (!emailOk(email.value.trim())) return showMsg("Please enter a valid email address.", false, email);
            if (pass.value.length < 8) return showMsg("Password must be at least 8 characters.", false, pass);
            if (pass.value !== confirm.value) return showMsg("Passwords do not match.", false, confirm);
            if (!terms.checked) return showMsg("Please accept the Terms & Privacy Policy.");

            showMsg("Account created. Redirecting to login…", true);
            setTimeout(() => (window.location.href = "login.html"), 900);
        });
    }
});