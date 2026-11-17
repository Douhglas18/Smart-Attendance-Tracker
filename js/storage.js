
const STORAGE_KEYS = {
    SUBJECTS: "subjects",
    ATTENDANCE: "attendanceRecords"
};

function getData(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error("Unable to read saved data:", error);
        return [];
    }
}

function saveData(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error("Unable to save data:", error);
        alert("Unable to save data. Check browser storage.");
        return false;
    }
}
