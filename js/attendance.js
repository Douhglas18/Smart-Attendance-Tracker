
// =======================================
// SMART ATTENDANCE TRACKER
// BULK ATTENDANCE MANAGEMENT
// =======================================

let subjects = getData(STORAGE_KEYS.SUBJECTS);
let attendanceRecords = getData(STORAGE_KEYS.ATTENDANCE);

let editingAttendanceId = null;

const attendanceForm = document.getElementById("attendanceForm");

const subjectSelect = document.getElementById("subjectSelect");

const attendedInput = document.getElementById("attendedClasses");

const missedInput = document.getElementById("missedClasses");

const tableBody = document.getElementById("attendanceTableBody");

const emptyMessage = document.getElementById("emptyMessage");

const cancelEditButton = document.getElementById("cancelEdit");


// =======================================
// LOAD SUBJECTS INTO DROPDOWN
// =======================================

function loadSubjects() {

    subjectSelect.innerHTML =
        '<option value="">Choose a subject</option>';

    subjects.forEach(subject => {

        const option = document.createElement("option");

        option.value = subject.id;

        option.textContent = subject.name;

        subjectSelect.appendChild(option);

    });

}


// =======================================
// CALCULATE ATTENDANCE
// =======================================

function calculatePercentage(attended, missed) {

    const total = attended + missed;

    if (total === 0) {
        return null;
    }

    return (attended / total) * 100;

}


// =======================================
// GET ATTENDANCE STATUS
// =======================================

function getAttendanceStatus(percentage, target) {

    if (percentage >= target) {
        return {
            text: "Safe",
            className: "status-good"
        };
    }

    if (percentage >= target - 5) {
        return {
            text: "Warning",
            className: "status-warning"
        };
    }

    return {
        text: "Low",
        className: "status-danger"
    };

}


// =======================================
// DISPLAY ATTENDANCE RECORDS
// =======================================

function displayAttendance() {

    tableBody.innerHTML = "";

    emptyMessage.style.display =
        attendanceRecords.length === 0 ? "block" : "none";

    attendanceRecords.forEach(record => {

        const subject = subjects.find(
            item => item.id === record.subjectId
        );

        if (!subject) return;

        const total = record.attended + record.missed;

        const percentage = calculatePercentage(
            record.attended,
            record.missed
        );

        const status = getAttendanceStatus(
            percentage,
            subject.requiredPercentage
        );

        const row = document.createElement("tr");

        const values = [
            subject.name,
            record.attended,
            record.missed,
            total,
            percentage.toFixed(2) + "%"
        ];

        values.forEach(value => {

            const cell = document.createElement("td");

            cell.textContent = value;

            row.appendChild(cell);

        });

        // Status column

        const statusCell = document.createElement("td");

        const badge = document.createElement("span");

        badge.className = "status " + status.className;

        badge.textContent = status.text;

        statusCell.appendChild(badge);

        row.appendChild(statusCell);

        // Action buttons

        const actionCell = document.createElement("td");

        const editButton = document.createElement("button");

        editButton.className = "btn btn-secondary";

        editButton.textContent = "Edit";

        editButton.addEventListener("click", () => {
            editAttendance(record.id);
        });

        const deleteButton = document.createElement("button");

        deleteButton.className = "btn btn-primary";

        deleteButton.textContent = "Delete";

        deleteButton.style.marginLeft = "6px";

        deleteButton.addEventListener("click", () => {
            deleteAttendance(record.id);
        });

        actionCell.append(editButton, deleteButton);

        row.appendChild(actionCell);

        tableBody.appendChild(row);

    });

}


// =======================================
// SAVE ATTENDANCE
// =======================================

attendanceForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const subjectId = Number(subjectSelect.value);

    const attended = Number(attendedInput.value);

    const missed = Number(missedInput.value);

    if (!subjectId || !subjects.some(s => s.id === subjectId)) {
        alert("Please select a valid subject.");
        return;
    }

    if (
        !Number.isSafeInteger(attended) ||
        !Number.isSafeInteger(missed) ||
        attended < 0 ||
        missed < 0 ||
        attended + missed <= 0 ||
        !Number.isSafeInteger(attended + missed)
    ) {
        alert("Enter valid non-negative whole numbers. Total classes must be greater than zero.");
        return;
    }

    // Check whether a record already exists

    const existingRecord = attendanceRecords.find(record =>
        record.subjectId === subjectId &&
        record.id !== editingAttendanceId
    );

    if (existingRecord) {

        alert(
            "Attendance already exists for this subject. Please edit the existing record."
        );

        return;

    }

    if (editingAttendanceId !== null) {

        attendanceRecords = attendanceRecords.map(record => {

            if (record.id === editingAttendanceId) {

                return {
                    ...record,
                    subjectId,
                    attended,
                    missed
                };

            }

            return record;

        });

    } else {

        attendanceRecords.push({

            id: Date.now(),

            subjectId,

            attended,

            missed

        });

    }

    if (!saveData(STORAGE_KEYS.ATTENDANCE, attendanceRecords)) {
        return;
    }

    resetForm();

    displayAttendance();

});


// =======================================
// EDIT ATTENDANCE
// =======================================

function editAttendance(id) {

    const record = attendanceRecords.find(
        item => item.id === id
    );

    if (!record) return;

    subjectSelect.value = record.subjectId;

    attendedInput.value = record.attended;

    missedInput.value = record.missed;

    editingAttendanceId = id;

    attendanceForm.querySelector(
        "button[type='submit']"
    ).textContent = "Update Attendance";

    cancelEditButton.classList.remove("hidden");

}


// =======================================
// DELETE ATTENDANCE
// =======================================

function deleteAttendance(id) {

    if (!confirm("Are you sure you want to delete this record?")) {
        return;
    }

    attendanceRecords = attendanceRecords.filter(
        record => record.id !== id
    );

    if (!saveData(STORAGE_KEYS.ATTENDANCE, attendanceRecords)) {
        return;
    }

    displayAttendance();

    if (editingAttendanceId === id) {
        resetForm();
    }

}


// =======================================
// RESET FORM
// =======================================

function resetForm() {

    attendanceForm.reset();

    editingAttendanceId = null;

    attendanceForm.querySelector(
        "button[type='submit']"
    ).textContent = "Save Attendance";

    cancelEditButton.classList.add("hidden");

}


// =======================================
// CANCEL EDIT
// =======================================

cancelEditButton.addEventListener("click", resetForm);


// =======================================
// INITIALIZE PAGE
// =======================================

loadSubjects();

displayAttendance();
