
// =======================================
// SMART ATTENDANCE TRACKER
// SUBJECT MANAGEMENT
// =======================================

let subjects = getData(STORAGE_KEYS.SUBJECTS);

let editingSubjectId = null;

const subjectForm = document.getElementById("subjectForm");

const subjectTableBody = document.getElementById("subjectTableBody");


// =======================================
// DISPLAY SUBJECTS
// =======================================

function displaySubjects() {

    subjectTableBody.innerHTML = "";

    if (subjects.length === 0) {

        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.colSpan = 4;
        cell.textContent = "No subjects added yet.";

        row.appendChild(cell);
        subjectTableBody.appendChild(row);

        return;
    }

    subjects.forEach(subject => {

        const row = document.createElement("tr");

        const nameCell = document.createElement("td");
        nameCell.textContent = subject.name;

        const codeCell = document.createElement("td");
        codeCell.textContent = subject.code || "-";

        const targetCell = document.createElement("td");
        targetCell.textContent = subject.requiredPercentage + "%";

        const actionCell = document.createElement("td");

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.className = "btn btn-secondary";

        editButton.addEventListener("click", () => {
            editSubject(subject.id);
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "btn btn-primary";
        deleteButton.style.marginLeft = "8px";

        deleteButton.addEventListener("click", () => {
            deleteSubject(subject.id);
        });

        actionCell.append(editButton, deleteButton);

        row.append(nameCell, codeCell, targetCell, actionCell);

        subjectTableBody.appendChild(row);

    });
}


// =======================================
// ADD / UPDATE SUBJECT
// =======================================

subjectForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const name = document.getElementById("subjectName").value.trim();

    const code = document.getElementById("subjectCode").value.trim();

    const target = Number(
        document.getElementById("targetPercentage").value
    );

    if (
        !name ||
        !Number.isFinite(target) ||
        target < 1 ||
        target > 100
    ) {
        alert("Enter valid subject details.");
        return;
    }

    const duplicate = subjects.some(subject =>
        subject.name.toLowerCase() === name.toLowerCase() &&
        subject.id !== editingSubjectId
    );

    if (duplicate) {
        alert("This subject already exists.");
        return;
    }

    let updatedSubjects;

    if (editingSubjectId !== null) {

        updatedSubjects = subjects.map(subject =>
            subject.id === editingSubjectId
                ? {
                    ...subject,
                    name,
                    code,
                    requiredPercentage: target
                }
                : subject
        );

    } else {

        updatedSubjects = [
            ...subjects,
            {
                id: Date.now(),
                name,
                code,
                requiredPercentage: target
            }
        ];

    }

    if (!saveData(STORAGE_KEYS.SUBJECTS, updatedSubjects)) {
        return;
    }

    subjects = updatedSubjects;

    resetSubjectForm();

    displaySubjects();

});


// =======================================
// EDIT SUBJECT
// =======================================

function editSubject(id) {

    const subject = subjects.find(item => item.id === id);

    if (!subject) return;

    document.getElementById("subjectName").value = subject.name;

    document.getElementById("subjectCode").value = subject.code || "";

    document.getElementById("targetPercentage").value =
        subject.requiredPercentage;

    editingSubjectId = id;

    subjectForm.querySelector(
        "button[type='submit']"
    ).textContent = "Update Subject";

}


// =======================================
// DELETE SUBJECT AND ATTENDANCE
// =======================================

function deleteSubject(id) {

    const confirmed = confirm(
        "Delete this subject and its attendance record?"
    );

    if (!confirmed) return;

    const updatedSubjects = subjects.filter(
        subject => subject.id !== id
    );

    const attendanceRecords = getData(STORAGE_KEYS.ATTENDANCE);

    const updatedAttendance = attendanceRecords.filter(
        record => record.subjectId !== id
    );

    if (!saveData(STORAGE_KEYS.ATTENDANCE, updatedAttendance)) {
        return;
    }

    if (!saveData(STORAGE_KEYS.SUBJECTS, updatedSubjects)) {
        return;
    }

    subjects = updatedSubjects;

    if (editingSubjectId === id) {
        resetSubjectForm();
    }

    displaySubjects();

}


// =======================================
// RESET FORM
// =======================================

function resetSubjectForm() {

    subjectForm.reset();

    editingSubjectId = null;

    document.getElementById("targetPercentage").value = 75;

    subjectForm.querySelector(
        "button[type='submit']"
    ).textContent = "Add Subject";

}


// =======================================
// INITIALIZE
// =======================================

displaySubjects();
