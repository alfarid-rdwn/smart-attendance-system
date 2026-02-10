// Protect dashboard (must login first)
if (localStorage.getItem("loggedIn") !== "true") {
    window.location.href = "index.html";
}

function logout() {
    localStorage.removeItem("loggedIn");
    window.location.href = "index.html";
}
