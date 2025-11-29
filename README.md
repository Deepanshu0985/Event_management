# Event Management System (EMS)

A full-stack web application for managing users and events across different timezones. This application allows you to create profiles, schedule events with specific timezones, and view them converted to your local time.

## 🚀 Features

-   **User Management**: Create user profiles.
-   **Event Scheduling**: Create events with start/end times and specific timezones (IST, EST, GMT, etc.).
-   **Timezone Support**: Automatically handles timezone conversions using `dayjs`.
-   **Event Dashboard**: View all events or filter by specific users.
-   **Edit Events**: Update existing event details.
-   **Responsive Design**: Built with Tailwind CSS for a modern, responsive UI.

## 🛠️ Tech Stack

### Frontend
-   **React.js**: UI Library
-   **Tailwind CSS**: Styling
-   **Zustand**: State Management
-   **Axios**: API Requests
-   **Day.js**: Date & Timezone Manipulation
-   **React Select**: Dropdown components

### Backend
-   **Node.js & Express**: Server framework
-   **MongoDB & Mongoose**: Database
-   **Dotenv**: Environment variable management
-   **Cors**: Cross-Origin Resource Sharing

## 📂 Project Structure

```
SKAILLAMA/
├── frontend/          # React Client
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/           # Express Server
│   ├── server.js
│   └── package.json
└── README.md          # Project Documentation
```

## ⚡️ Getting Started

### Prerequisites
-   Node.js installed
-   MongoDB Atlas URI (or local MongoDB)

### 1. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in `backend/` and add your MongoDB URI:
```env
MONGODB_URI=your_mongodb_connection_string
```

Start the server:
```bash
npm run dev
```
The server will run on `http://localhost:5001`.

### 2. Frontend Setup
Navigate to the frontend directory and install dependencies:
```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/` (optional for local, required for custom API URL):
```env
REACT_APP_API_URL=http://localhost:5001
```

Start the React app:
```bash
npm start
```
The app will run on `http://localhost:3000`.

## 🔌 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/users` | Get all users |
| `POST` | `/api/users` | Create a new user |
| `GET` | `/api/events` | Get all events |
| `POST` | `/api/events` | Create a new event |
| `GET` | `/api/events/:id` | Get event by ID |
| `PUT` | `/api/events/:id` | Update event by ID |
| `GET` | `/api/events/user/:userId` | Get events for a specific user |

## 📝 License
This project is open source.
# Event_management
