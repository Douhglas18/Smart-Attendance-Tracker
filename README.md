# Smart Attendance Tracker

## 1. Project Overview

Smart Attendance Tracker is a web-based application designed to help students manage and monitor their subject-wise attendance. It calculates attendance percentages, tracks attendance targets, and generates reports to help students understand their attendance status.

## 2. Features

- Add, edit and delete subjects.
- Set a required attendance percentage for each subject.
- Enter attended and missed class totals.
- Automatically calculate subject-wise attendance percentages.
- Display overall attendance on the dashboard.
- Show attendance warnings when a subject falls below its target.
- Calculate the additional classes required to reach the attendance target.
- Calculate how many additional classes can be missed.
- Generate and download attendance reports in CSV format.
- Save information using browser LocalStorage.

## 3. Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Structure of web pages |
| CSS3 | Styling and responsive design |
| JavaScript | Application logic and calculations |
| LocalStorage | Storing data in the browser |

## 4. Project Structure

```text
Smart-Attendance-Tracker/
│
├── index.html
├── subjects.html
├── attendance.html
├── reports.html
├── README.md
│
├── assets/
│   └── icons/
│
├── css/
│   ├── style.css
│   ├── dashboard.css
│   └── responsive.css
│
└── js/
    ├── app.js
    ├── storage.js
    ├── subjects.js
    ├── attendance.js
    ├── dashboard.js
    └── reports.js
```

## 5. How to Run the Project

1. Download or copy the project folder to your computer.
2. Open the folder in Visual Studio Code.
3. Install the Live Server extension if it is not already installed.
4. Right-click `index.html`.
5. Select **Open with Live Server**.
6. The application opens in your default browser.

## 6. Attendance Calculation

Attendance percentage is calculated using:

**Attendance Percentage = (Classes Attended / Total Classes) × 100**

Where:

**Total Classes = Classes Attended + Classes Missed**

The overall attendance percentage is calculated using total attended classes divided by total classes across all subjects.

## 7. Storage

The application uses browser LocalStorage to save subjects and attendance records. No external database or backend server is required.

## 8. Limitations

- Attendance is entered using cumulative totals.
- Individual daily attendance history is not maintained.
- Data is stored in the browser and is not automatically synchronized across devices.
- Clearing browser data may remove saved attendance information.

## 9. Future Enhancements

- Daily attendance entry.
- User login and authentication.
- Cloud database integration.
- Attendance reminders and notifications.
- Graphical attendance analytics.

## 10. Conclusion

Smart Attendance Tracker provides a simple and convenient way to manage subject-wise attendance. It reduces manual calculations, displays attendance status clearly, and helps students monitor their progress toward required attendance targets.