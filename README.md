# 🚀 Smart To-Do & Task Management Application

A modern, responsive, beginner-friendly full-stack web application built with the **MERN** stack (React.js, Node.js, Express.js, and MongoDB). Designed with a **desktop-style viewport interface (no unnecessary browser page scrolling)**, internally scrollable task lists, dynamic statistics, and intelligent features such as automated overdue detection, priority tracking, and today's tasks focus.

---

## 📋 Table of Contents
1. [Main Objective](#-main-objective)
2. [Key Features](#-key-features)
3. [Smart Features](#-smart-features)
4. [Technology Stack](#-technology-stack)
5. [Project Architecture](#-project-architecture)
6. [Project Structure](#-project-structure)
7. [Prerequisites & Requirements](#-prerequisites--requirements)
8. [Getting Started (VS Code Setup)](#-getting-started-vs-code-setup)
9. [Environment Variables](#-environment-variables)
10. [REST API Documentation](#-rest-api-documentation)
11. [Deployment Guide](#-deployment-guide)
    - [MongoDB Atlas Setup](#1-mongodb-atlas-setup)
    - [Railway Backend Deployment](#2-railway-backend-deployment)
    - [Frontend Deployment (Vercel / Netlify / Railway)](#3-frontend-deployment)
12. [How This Project Works (Viva-Friendly Explanation)](#-how-this-project-works-viva-friendly-explanation)
13. [Folder & File Descriptions](#-folder--file-descriptions)
14. [Future Improvements](#-future-improvements)

---

## 🎯 Main Objective

The primary objective of this project is to provide a clean, complete, and easy-to-understand full-stack web application that demonstrates:
* Clean separation of concerns between Frontend (React), REST API (Express), and Database (MongoDB).
* Standard CRUD (Create, Read, Update, Delete) operations.
* Real-time dynamic search, multi-criteria filtering, and sorting.
* Viewport-constrained desktop-like dashboard UX with internal scrolling.
* Production readiness for deployment on platforms like Railway and MongoDB Atlas.

---

## ✨ Key Features

* **Task Management (CRUD):** Create, view, edit, delete, and mark tasks as completed.
* **No-Page-Scroll Viewport Layout:** Designed to fit cleanly within standard desktop/laptop viewports without unnecessary vertical window scrolling.
* **Internal Task-List Scrolling:** As tasks accumulate, only the task list scrolls smoothly within its dedicated container.
* **Real-Time Search:** Search tasks dynamically by title or description.
* **Multi-Filter System:** Filter by Status (*Pending, In Progress, Completed*), Priority (*High, Medium, Low*), and Category (*Personal, College, Work, Shopping, Other*).
* **Sorting Capabilities:** Sort by Due Date (Earliest/Latest), Priority, Recently Added, and Alphabetical.
* **Responsive Design:** Optimized for Desktop (1920x1080, 1366x768), Tablets, and Mobile screens.
* **Interactive Modals:** Compact two-column desktop / single-column mobile Add/Edit modals, plus safe delete confirmation dialogs.
* **State Management & Feedback:** Informative loading spinners, empty states with call-to-action buttons, and non-blocking toast notifications.

---

## 🧠 Smart Features

1. **Smart Overdue Detection:** Automatically computes if `dueDate < currentDate` and `status !== 'Completed'`, displaying an alert badge (`OVERDUE`) and updating dashboard metrics in real time.
2. **Visual Priority Indicators:** Color-coded priority badges (🔴 High, 🟡 Medium, 🟢 Low) with custom left borders on task cards.
3. **Dynamic Progress Tracking:** Calculates overall completion rate percentage and displays a live progress bar:
   ```text
   Overall Progress: [████████░░] 80% (8 of 10 tasks completed)
   ```
4. **Today's Focus Pane:** Dedicated sidebar highlighting tasks due on the current day for instant focus.

---

## 🛠 Technology Stack

### Frontend
* **React.js** (Vite build tool)
* **JavaScript (ES6+)**
* **React Hooks** (`useState`, `useEffect`, `useCallback`)
* **React Router DOM v6** (Client-side routing)
* **Axios** (HTTP client for REST API communication)
* **Lucide React** (Clean, lightweight icons)
* **CSS3** (Flexbox, Grid, CSS Variables, Responsive Media Queries)

### Backend
* **Node.js** (JavaScript Runtime)
* **Express.js** (REST API Web Framework)
* **CORS** (Cross-Origin Resource Sharing)
* **Dotenv** (Environment variable management)

### Database
* **MongoDB** (NoSQL Database)
* **Mongoose** (Object Data Modeling / ODM)

---

## 🏛 Project Architecture

```text
+-------------------------------------------------------------+
|                         USER DEVICE                         |
|                     (Browser / Mobile)                      |
+-------------------------------------------------------------+
                              |
                              ↓ HTTP Requests (Axios)
+-------------------------------------------------------------+
|                       REACT FRONTEND                        |
|   (Navbar, StatCards, FilterBar, TaskList, Modals, Pages)   |
+-------------------------------------------------------------+
                              |
                              ↓ REST API JSON Endpoints
+-------------------------------------------------------------+
|                   EXPRESS BACKEND SERVER                    |
|       (Routes, Controllers, ErrorHandler, Middleware)       |
+-------------------------------------------------------------+
                              |
                              ↓ Mongoose ODM Queries
+-------------------------------------------------------------+
|                      MONGODB DATABASE                       |
|           (Local Database or MongoDB Atlas Cloud)           |
+-------------------------------------------------------------+
```

---

## 📂 Project Structure

```text
smart-todo-app/
│
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection logic
│   ├── controllers/
│   │   └── taskController.js     # Task CRUD & stats business logic
│   ├── middleware/
│   │   └── errorHandler.js       # Centralized error handler
│   ├── models/
│   │   └── Task.js               # Mongoose Task schema
│   ├── routes/
│   │   └── taskRoutes.js         # REST API route mappings
│   ├── .env.example              # Sample backend environment file
│   ├── package.json              # Backend dependencies & scripts
│   └── server.js                 # Express server entry point
│
├── frontend/
│   ├── public/
│   │   └── favicon.svg           # Application icon
│   ├── src/
│   │   ├── components/
│   │   │   ├── DeleteModal.jsx   # Delete confirmation modal
│   │   │   ├── FilterBar.jsx     # Search, filter chips, sort options
│   │   │   ├── Navbar.jsx        # Responsive navigation bar
│   │   │   ├── ProgressBar.jsx   # Dynamic progress bar
│   │   │   ├── StatCards.jsx     # Statistics metric cards
│   │   │   ├── TaskCard.jsx      # Individual task card component
│   │   │   ├── TaskFormModal.jsx # Compact Add / Edit task modal
│   │   │   └── TodayTasksWidget.jsx # Today's tasks sidebar widget
│   │   ├── pages/
│   │   │   ├── AboutPage.jsx     # Project overview & viva guide
│   │   │   ├── DashboardPage.jsx # No-page-scroll dashboard
│   │   │   └── HomePage.jsx      # Landing hero page
│   │   ├── services/
│   │   │   └── taskService.js    # Axios API service layer
│   │   ├── styles/
│   │   │   ├── app.css           # Component layouts & media queries
│   │   │   └── index.css         # Theme variables & reset
│   │   ├── App.jsx               # Main React component & router
│   │   └── main.jsx              # React DOM render entry
│   ├── .env.example              # Sample frontend environment file
│   ├── index.html                # Vite HTML template
│   ├── package.json              # Frontend dependencies & scripts
│   └── vite.config.js            # Vite configuration
│
├── .gitignore                    # Ignored files (node_modules, .env)
├── package.json                  # Root runner script (runs both servers)
└── README.md                     # Project documentation
```

---

## ⚙️ Prerequisites & Requirements

* **Node.js** (v16.0 or higher) - [Download Node.js](https://nodejs.org/)
* **npm** (comes bundled with Node.js)
* **MongoDB** (either installed locally or free MongoDB Atlas account)
* **Visual Studio Code** (recommended editor)

---

## 💻 Getting Started (VS Code Setup)

### Option 1: Quick Start (Run Both Frontend & Backend Concurrently)

1. Open the project root folder in **Visual Studio Code**.
2. Install all dependencies:
   ```bash
   npm run install-all
   ```
3. Start both the Backend (Port 5000) and Frontend (Port 5173) simultaneously:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to:
   ```text
   http://localhost:5173
   ```

---

### Option 2: Running Separately in Two Terminals

#### Terminal 1 — Backend Server:
```bash
cd backend
npm install
npm run dev
```
*Backend runs on `http://localhost:5000`.*

#### Terminal 2 — Frontend Client:
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## 🔐 Environment Variables

### Backend (`backend/.env`)
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/smart_todo_db
CLIENT_URL=http://localhost:5173
```

### Frontend (`frontend/.env`)
Create a `.env` file in the `frontend/` directory:
```env
VITE_API_URL=http://localhost:5000
```
*(In production, set `VITE_API_URL` to your deployed Railway backend URL).*

---

## 📡 REST API Documentation

| Method | Endpoint | Description | Request Body Example |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/tasks` | Fetch all tasks with optional search/filter/sort queries | None |
| **GET** | `/api/tasks/stats` | Fetch aggregated counts (Total, Completed, Pending, Overdue) | None |
| **GET** | `/api/tasks/:id` | Fetch single task details by ID | None |
| **POST** | `/api/tasks` | Create a new task | `{"title": "DBMS Lab", "dueDate": "2026-10-10", "priority": "High"}` |
| **PUT** | `/api/tasks/:id` | Update task details or toggle status | `{"status": "Completed"}` |
| **DELETE** | `/api/tasks/:id` | Delete task by ID | None |
| **POST** | `/api/tasks/seed` | Populate database with sample tasks for demo/testing | None |

---

## ☁️ Deployment Guide

> **Public app warning:** This project has no user accounts or authorization. Anyone who can open the deployed site can view, create, edit, and delete tasks in the same database. Do not store private or personal information.

### 1. Push the project to GitHub
1. Create a repository on [GitHub](https://github.com/new). Choose **Public** if you want the source code to be public; the deployed website can be public either way. Do not initialize the repository with a README, license, or `.gitignore` because this project already has those files.
2. Open the project root folder in the VS Code terminal. Confirm your real `.env` files are ignored before staging:
   ```powershell
   git check-ignore backend/.env frontend/.env
   ```
   Both paths should be printed. Never commit `.env` files or paste secrets into GitHub.
3. Initialize Git and make the first commit:
   ```powershell
   git init
   git add .
   git status
   git commit -m "Initial project commit"
   git branch -M main
   ```
4. Copy the HTTPS URL shown on your new GitHub repository and connect/push (replace the placeholders):
   ```powershell
   git remote add origin https://github.com/USERNAME/REPOSITORY.git
   git push -u origin main
   ```
   GitHub may open a browser window for sign-in. For later changes, run `git add .`, `git commit -m "Describe your changes"`, and `git push`.

### 2. MongoDB Atlas Setup
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free account.
2. Create a new free **M0 Shared Cluster**.
3. Under **Database Access**, create a database user (e.g. `todo_admin`) with a secure password.
4. Under **Network Access**, click **Add IP Address** and select **Allow Access from Anywhere (`0.0.0.0/0`)**.
5. Go to your cluster, click **Connect** → **Drivers** (Node.js), and copy your connection string:
   ```text
   mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/smart_todo_db?retryWrites=true&w=majority
   ```

---

### 3. Deploy the backend to Railway
1. Sign in to [Railway](https://railway.app/) and create a project from your GitHub repository.
2. Set the service's **Root Directory** to `/backend`. The start command is `npm start`; Railway installs dependencies from `backend/package.json`.
3. Add a Railway **Variable** named `MONGODB_URI` with your MongoDB Atlas connection string. Replace the username/password placeholders, URL-encoding special characters in the password if needed. Do not commit this value.
4. Do not set `PORT` manually; Railway supplies it. Leave `CLIENT_URL` unset for the first deployment so the frontend can connect while you create it.
5. Deploy the service. In Railway's service **Settings**, generate a public domain. Your backend URL will look like `https://your-service.up.railway.app`.
6. Verify it by opening `https://your-service.up.railway.app/api/health`; the response should contain `"success":true`.

### 4. Deploy the frontend to Netlify
1. Sign in to [Netlify](https://www.netlify.com/) and choose **Add new site** → **Import an existing project** → **GitHub**. Authorize Netlify and select this repository.
2. The root `netlify.toml` configures the base directory (`frontend`), build command, output directory, and route fallback. Confirm Netlify shows `npm run build` and `dist` if it asks for build settings.
3. In the site's **Environment variables**, add `VITE_API_URL` with the Railway URL from step 3, without a trailing slash; for example `https://your-service.up.railway.app`.
4. Deploy or trigger a new deploy after adding the variable. Netlify provides a public URL such as `https://your-site.netlify.app`. Open it, then refresh `/dashboard` directly to verify routing and API access.
5. Copy the Netlify site origin (the URL without a path) and add it to Railway as `CLIENT_URL`, for example `https://your-site.netlify.app`. Railway will redeploy with browser requests limited to that origin. If you later add a custom domain, update `CLIENT_URL` to that origin too.
6. Test adding a task and refreshing the page. The task should remain because it is stored in MongoDB Atlas.

The site URL is shareable with anyone. If you change frontend code later, push the commit to GitHub and Netlify will build/deploy it automatically. Backend changes are also redeployed by Railway when connected to the same repository.

---

## 🎓 How This Project Works (Viva-Friendly Explanation)

### High-Level Summary
> "This project is a 3-tier MERN web application. The presentation tier is built in React using hooks for state management and Axios for asynchronous HTTP communication. When a user interacts with the UI (for example, creating a task or marking it completed), React dispatches a REST API call to our Express.js server. The server controller validates the payload and performs the corresponding database operation using Mongoose. MongoDB updates the persistent document, and Express returns a structured JSON response to React, which updates the UI without full-page reloads."

### What is CRUD?
* **C (Create):** Uses HTTP **`POST`** to insert a new document into MongoDB.
* **R (Read):** Uses HTTP **`GET`** to retrieve task collections and calculate statistics.
* **U (Update):** Uses HTTP **`PUT`** to modify existing tasks or toggle completion status.
* **D (Delete):** Uses HTTP **`DELETE`** to remove a task from the database.

### Why Viewport Layout (No Page Scroll)?
> "Traditional web pages force users to scroll down as lists grow longer. In our dashboard, the outer frame is locked to the browser viewport (`height: calc(100vh - 60px)`), and internal flexbox scrolling is applied only to the task list container. This provides a sleek, desktop-software experience where navigation, statistics, and filters remain pinned in view."

---

## 📁 Folder & File Descriptions

* **`backend/server.js`**: Initializes Express, connects to MongoDB, mounts routes, and starts the HTTP server.
* **`backend/config/db.js`**: Handles MongoDB connection via Mongoose with error catching.
* **`backend/models/Task.js`**: Defines the task schema (title, description, category, priority, dueDate, status).
* **`backend/controllers/taskController.js`**: Contains business logic for querying, filtering, and updating tasks.
* **`backend/routes/taskRoutes.js`**: Maps REST endpoints to their respective controller functions.
* **`frontend/src/services/taskService.js`**: Centralized Axios functions communicating with the backend.
* **`frontend/src/pages/DashboardPage.jsx`**: The core interactive viewport dashboard.
* **`frontend/src/components/TaskFormModal.jsx`**: Compact form modal for adding and updating tasks.
* **`frontend/src/components/StatCards.jsx`**: Real-time counter cards with quick-filter clickability.
* **`frontend/src/components/TodayTasksWidget.jsx`**: Sidebar widget focusing on tasks due today.

---

## 🔮 Future Improvements

While this project is intentionally kept clean and student-friendly, future enhancements could include:
* User Authentication with JWT (JSON Web Tokens)
* Multi-user task separation
* Email or browser push notification reminders
* Dark mode theme toggle
* Drag-and-drop Kanban task board

---

## 👨‍💻 Author & License
Developed as a Full-Stack College Web Development Project. Open-source under the MIT License.
