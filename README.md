# BetterAttendance project

## 1. The Problem
Traditional attendance methods like roll call or answering questions to confirm presence are often cumbersome, time-consuming, and prone to errors and cheating. Calling out names or marking attendance on lists wastes valuable class time, especially in short sessions. Human errors, such as mispronouncing names or mishearing responses, can lead to inaccurate records. Moreover, students can sometimes mark absent peers as present, undermining the purpose of attendance tracking.

## 2. The Objective
The project aims to minimize these issues and make attendance-taking more efficient and engaging. BetterAttendance is a user-friendly web application accessible on computers, laptops, and mobile devices. It streamlines and automates attendance, reducing errors and cheating while enhancing the experience for students and educators. With BetterAttendance, traditional time-consuming methods are replaced, freeing more class time for productive activities.

## 3. Key Features
The app includes features like a user-based session system, automatic QR code generation for easy session joining, synchronized sessions, and downloadable attendance data in CSV format. Socket.IO enables live interactions between clients and the server, enhancing engagement. The app generates interactive game questions for attendees, making attendance fun.

Using the React library `qrcode.react`, the app quickly generates a QR code for the session URL, allowing attendees to join by scanning the code without manually entering the session ID.

The Question Generator creates three types of questions based on random integers: number matching, string/object matching, and picture matching. After the quiz, results are sent to the host, distinguishing between attendees who answered at least three questions correctly and those who did not. The host can then generate a CSV file of the results.

## 4. Basic structure, frameworks, and libraries
This web application uses object-oriented patterns like observer, visitor, and provider. We used Next.js for the front end and Express.js for the backend. Key libraries include `Socket.IO`, `Tailwind CSS`, `qrcode-react`, `react-icons`, `react-hot-toast`, `nanoid`, and `CSV`.

## 5. Project Demo
Demo link: https://youtu.be/_lvAKGVC55Y
