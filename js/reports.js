
// =======================================
// SMART ATTENDANCE TRACKER
// REPORTS AND CALCULATORS
// =======================================

const subjects = getData(STORAGE_KEYS.SUBJECTS);

const attendanceRecords = getData(STORAGE_KEYS.ATTENDANCE);


// =======================================
// GET SUBJECT ATTENDANCE
// =======================================

function getSubjectAttendance(subject) {

    const record = attendanceRecords.find(
        item => item.subjectId === subject.id
    );

    if (!record) return null;

    const total = record.attended + record.missed;

    if (total === 0) return null;

    const percentage = (record.attended / total) * 100;

    return {
        attended: record.attended,
        missed: record.missed,
        total,
        percentage
    };

}


// =======================================
// GET ATTENDANCE STATUS
// =======================================

function getStatus(percentage, target) {

    if (percentage >= target) return "Safe";

    if (percentage >= target - 5) return "Warning";

    return "Low";

}


// =======================================
// DISPLAY REPORTS
// =======================================

function displayReports() {

    const tableBody = document.getElementById("reportTableBody");

    const emptyMessage = document.getElementById(
        "reportEmptyMessage"
    );

    tableBody.innerHTML = "";

    const recordedSubjects = subjects.filter(subject =>
        getSubjectAttendance(subject) !== null
    );

    emptyMessage.style.display =
        recordedSubjects.length === 0 ? "block" : "none";

    recordedSubjects.forEach(subject => {

        const data = getSubjectAttendance(subject);

        const row = document.createElement("tr");

        const values = [
            subject.name,
            data.attended,
            data.missed,
            data.total,
            data.percentage.toFixed(2) + "%",
            getStatus(data.percentage, subject.requiredPercentage)
        ];

        values.forEach(value => {

            const cell = document.createElement("td");

            cell.textContent = value;

            row.appendChild(cell);

        });

        tableBody.appendChild(row);

    });

}


// =======================================
// LOAD SUBJECT DROPDOWNS
// =======================================

function loadCalculatorSubjects() {

    const dropdowns = [
        document.getElementById("requiredSubject"),
        document.getElementById("bunkSubject")
    ];

    dropdowns.forEach(dropdown => {

        subjects.forEach(subject => {

            const option = document.createElement("option");

            option.value = subject.id;

            option.textContent = subject.name;

            dropdown.appendChild(option);

        });

    });

}


// =======================================
// REQUIRED CLASSES CALCULATOR
// =======================================

document.getElementById("calculateRequired")
    .addEventListener("click", function() {

        const subjectId = Number(
            document.getElementById("requiredSubject").value
        );

        const result = document.getElementById("requiredResult");

        const subject = subjects.find(
            item => item.id === subjectId
        );

        if (!subject) {

            result.textContent = "Please select a subject.";

            return;

        }

        const data = getSubjectAttendance(subject);

        if (!data) {

            result.textContent =
                "No attendance record exists for this subject.";

            return;

        }

        const target = subject.requiredPercentage / 100;

        if (data.percentage >= subject.requiredPercentage) {

            result.textContent =
                "You have already reached your attendance target.";

            return;

        }

        const requiredClasses = Math.ceil(
            (target * data.total - data.attended) / (1 - target)
        );

        result.textContent =
            "You must attend the next " +
            requiredClasses +
            " consecutive classes to reach " +
            subject.requiredPercentage +
            "% attendance.";

    });


// =======================================
// MAXIMUM ADDITIONAL ABSENCES CALCULATOR
// =======================================

document.getElementById("calculateBunk")
    .addEventListener("click", function() {

        const subjectId = Number(
            document.getElementById("bunkSubject").value
        );

        const result = document.getElementById("bunkResult");

        const subject = subjects.find(
            item => item.id === subjectId
        );

        if (!subject) {

            result.textContent = "Please select a subject.";

            return;

        }

        const data = getSubjectAttendance(subject);

        if (!data) {

            result.textContent =
                "No attendance record exists for this subject.";

            return;

        }

        const target = subject.requiredPercentage / 100;

        if (data.percentage < subject.requiredPercentage) {

            result.textContent =
                "Your attendance is already below the required target. You cannot miss additional classes.";

            return;

        }

        const maximumAbsences = Math.floor(
            (data.attended / target) - data.total
        );

        result.textContent =
            "You can miss a maximum of " +
            maximumAbsences +
            " additional classes while maintaining " +
            subject.requiredPercentage +
            "% attendance.";

    });


// =======================================
// CSV EXPORT
// =======================================

document.getElementById("exportCSV")
    .addEventListener("click", function() {

        const rows = [
            [
                "Subject",
                "Subject Code",
                "Classes Attended",
                "Classes Missed",
                "Total Classes",
                "Attendance Percentage",
                "Required Percentage",
                "Status"
            ]
        ];

        subjects.forEach(subject => {

            const data = getSubjectAttendance(subject);

            if (!data) return;

            rows.push([
                subject.name,
                subject.code || "",
                data.attended,
                data.missed,
                data.total,
                data.percentage.toFixed(2) + "%",
                subject.requiredPercentage + "%",
                getStatus(data.percentage, subject.requiredPercentage)
            ]);

        });

        if (rows.length === 1) {

            alert("There are no attendance records to export.");

            return;

        }

        const escapeCSV = value => {

            const text = String(value);

            return '"' + text.replace(/"/g, '""') + '"';

        };

        const csvContent = rows
            .map(row => row.map(escapeCSV).join(","))
            .join("\r\n");

        const blob = new Blob(
            ["\uFEFF" + csvContent],
            { type: "text/csv;charset=utf-8;" }
        );

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;

        link.download = "attendance-report.csv";

        document.body.appendChild(link);

        link.click();

        link.remove();

        URL.revokeObjectURL(url);

    });


// =======================================
// INITIALIZE
// =======================================

displayReports();

loadCalculatorSubjects();
