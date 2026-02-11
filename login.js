// ===== TOAST FUNCTION =====
function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = "toast" + (type === "error" ? " toast-delete" : "");
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 2600);
}


// ================= LOGIN =================
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();

        let users = JSON.parse(localStorage.getItem("users")) || [];

        const validUser = users.find(
            user => user.username === username && user.password === password
        );

        if (!validUser) {
            showToast("Invalid username or password", "error");
            return;
        }

        showToast("Login successful!");

        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("username", username);

        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 1200);
    });
}


// ================= REGISTER =================
const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!username || !password) {
            showToast("Username and password are required", "error");
            return;
        }

        let users = JSON.parse(localStorage.getItem("users")) || [];

        const userExists = users.find(user => user.username === username);
        if (userExists) {
            showToast("Username already exists", "error");
            return;
        }

        users.push({ username, password });
        localStorage.setItem("users", JSON.stringify(users));

        showToast("Registration successful! Redirecting to login...");

        setTimeout(() => {
            window.location.href = "index.html";
        }, 2000);
    });
}

// ================= RESET USERS =================
const resetBtn = document.getElementById("resetUsersBtn");

if (resetBtn) {
    resetBtn.addEventListener("click", function () {
        const confirmReset = confirm(
            "Are you sure you want to delete ALL registered users?"
        );

        if (!confirmReset) return;

        localStorage.removeItem("users");
        localStorage.removeItem("loggedIn");
        localStorage.removeItem("username");

        showToast("All users have been reset", "error");
    });
}

