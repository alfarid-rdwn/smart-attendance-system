// ===== AUTH GUARD =====
if (localStorage.getItem("loggedIn") !== "true") {
    window.location.href = "index.html";
}

function logout() {
    localStorage.removeItem("loggedIn");
    window.location.href = "index.html";
}

// ===== ATTENDANCE CRUD =====
const STORAGE_KEY = "attendanceData";

function getAttendance() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

function saveAttendance(records) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

// ===== RENDER TABLE =====
function loadAttendance() {
    const records = getAttendance();
    const tbody = document.getElementById("attendanceBody");
    const emptyState = document.getElementById("emptyState");
    const btnDeleteAll = document.getElementById("btnDeleteAll");

    tbody.innerHTML = "";

    if (records.length === 0) {
        emptyState.classList.add("show");
        btnDeleteAll.style.display = "none";
        document.getElementById("attendanceTable").style.display = "none";
    } else {
        emptyState.classList.remove("show");
        btnDeleteAll.style.display = "inline-block";
        document.getElementById("attendanceTable").style.display = "table";

        records.forEach(function (record, index) {
            const tr = document.createElement("tr");
            const badgeClass = "badge-" + record.status.toLowerCase();

            tr.innerHTML =
                "<td>" + (index + 1) + "</td>" +
                "<td>" + escapeHtml(record.name) + "</td>" +
                "<td>" + escapeHtml(record.kelas) + "</td>" +
                "<td>" + record.date + "</td>" +
                '<td><span class="badge ' + badgeClass + '">' + record.status + "</span></td>" +
                '<td><button class="btn-delete" onclick="deleteAttendance(' + index + ')">🗑️ Delete</button></td>';

            tbody.appendChild(tr);
        });
    }

    updateStats(records);
}

// ===== STATS =====
function updateStats(records) {
    document.getElementById("statTotal").textContent = records.length;
    document.getElementById("statHadir").textContent = records.filter(function (r) { return r.status === "Present"; }).length;
    document.getElementById("statIzin").textContent = records.filter(function (r) { return r.status === "Permit"; }).length;
    document.getElementById("statSakit").textContent = records.filter(function (r) { return r.status === "Sick"; }).length;
    document.getElementById("statAlpha").textContent = records.filter(function (r) { return r.status === "Absent"; }).length;
}

// ===== ADD =====
document.getElementById("attendanceForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const kelas = document.getElementById("kelas").value.trim();
    const date = document.getElementById("date").value;
    const status = document.getElementById("status").value;

    if (!name || !kelas || !date || !status) return;

    const records = getAttendance();
    records.push({ name: name, kelas: kelas, date: date, status: status });
    saveAttendance(records);

    // Reset form but keep date
    document.getElementById("name").value = "";
    document.getElementById("kelas").value = "";
    document.getElementById("status").value = "";

    showToast("✅ Attendance saved successfully!");
    loadAttendance();
});

// ===== DELETE ONE =====
function deleteAttendance(index) {
    if (!confirm("Delete this attendance record?")) return;

    const records = getAttendance();
    records.splice(index, 1);
    saveAttendance(records);

    showToast("🗑️ Record deleted.", true);
    loadAttendance();
}

// ===== DELETE ALL =====
function deleteAllAttendance() {
    if (!confirm("Delete ALL attendance records? This action cannot be undone.")) return;

    saveAttendance([]);
    showToast("🗑️ All records deleted.", true);
    loadAttendance();
}

// ===== TOAST =====
function showToast(message, isDelete) {
    // Remove existing toast
    const existing = document.querySelector(".toast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.className = "toast" + (isDelete ? " toast-delete" : "");
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(function () {
        if (toast.parentNode) toast.remove();
    }, 2600);
}

// ===== ESCAPE HTML =====
function escapeHtml(text) {
    var div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

// ===== INIT =====
(function init() {
    // Set default date to today
    var today = new Date().toISOString().split("T")[0];
    document.getElementById("date").value = today;

    loadAttendance();
})();
