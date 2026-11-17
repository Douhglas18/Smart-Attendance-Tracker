
// =======================================
// SMART ATTENDANCE TRACKER
// DASHBOARD MODULE
// =======================================

function loadDashboard() {

    const subjects = getData(STORAGE_KEYS.SUBJECTS);

    const attendanceRecords = getData(
        STORAGE_KEYS.ATTENDANCE
    );

    let totalAttended = 0;
    let totalMissed = 0;

    // Calculate overall statistics

    attendanceRecords.forEach(record => {

        const subjectExists = subjects.some(
            subject => subject.id === record.subjectId
        );

        if (!subjectExists) return;

        totalAttended += record.attended;
        totalMissed += record.missed;

    });

    const totalClasses = totalAttended + totalMissed;

    const overallPercentage = totalClasses > 0
        ? (totalAttended / totalClasses) * 100
        : null;

    // Update statistic cards

    document.getElementById("totalSubjects").textContent =
        subjects.length;

    document.getElementById("overallAttendance").textContent =
        overallPercentage === null
            ? "N/A"
            : overallPercentage.toFixed(2) + "%";

    document.getElementById("totalAttended").textContent =
        totalAttended;

    document.getElementById("totalMissed").textContent =
        totalMissed;

    // Update subject progress

    displaySubjectProgress(subjects, attendanceRecords);

    // Update alerts

    displayAttendanceAlerts(subjects, attendanceRecords);

}


// =======================================
// SUBJECT PROGRESS
// =======================================

function displaySubjectProgress(subjects, records) {

    const container = document.getElementById("subjectProgress");

    container.innerHTML = "";

    const subjectsWithRecords = subjects.filter(subject =>
        records.some(record => record.subjectId === subject.id)
    );

    if (subjectsWithRecords.length === 0) {

        container.textContent =
            "No attendance records available.";

        return;

    }

    subjectsWithRecords.forEach(subject => {

        const record = records.find(
            item => item.subjectId === subject.id
        );

        const total = record.attended + record.missed;

        const percentage = (record.attended / total) * 100;

        let progressClass = "progress-good";

        if (percentage < subject.requiredPercentage - 5) {
            progressClass = "progress-danger";
        } else if (percentage < subject.requiredPercentage) {
            progressClass = "progress-warning";
        }

        const item = document.createElement("div");

        item.className = "progress-item";

        const header = document.createElement("div");

        header.className = "progress-header";

        const name = document.createElement("span");

        name.textContent = subject.name;

        const value = document.createElement("strong");

        value.textContent = percentage.toFixed(2) + "%";

        header.append(name, value);

        const track = document.createElement("div");

        track.className = "progress-track";

        const fill = document.createElement("div");

        fill.className = "progress-fill " + progressClass;

        fill.style.width = percentage + "%";

        track.appendChild(fill);

        item.append(header, track);

        container.appendChild(item);

    });

}


// =======================================
// ATTENDANCE ALERTS
// =======================================

function displayAttendanceAlerts(subjects, records) {

    const container = document.getElementById("attendanceAlerts");

    container.innerHTML = "";

    let alertCount = 0;

    subjects.forEach(subject => {

        const record = records.find(
            item => item.subjectId === subject.id
        );

        if (!record) return;

        const total = record.attended + record.missed;

        if (total === 0) return;

        const percentage = (record.attended / total) * 100;

        let message = "";

        let alertClass = "";

        if (percentage < subject.requiredPercentage - 5) {

            message = subject.name +
                ": Attendance is critically low (" +
                percentage.toFixed(2) + "%).";

            alertClass = "alert-danger";

        } else if (percentage < subject.requiredPercentage) {

            message = subject.name +
                ": Attendance is below the required " +
                subject.requiredPercentage + "%.";

            alertClass = "alert-warning";

        } else {

            return;

        }

        const alert = document.createElement("div");

        alert.className = "alert-item " + alertClass;

        alert.textContent = message;

        container.appendChild(alert);

        alertCount++;

    });

    if (alertCount === 0) {

        const message = document.createElement("p");

        message.className = "text-muted";

        message.textContent = "All recorded subjects meet their attendance targets.";

        container.appendChild(message);

    }

}


// =======================================
// INITIALIZE DASHBOARD
// =======================================

loadDashboard();
