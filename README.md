# 📱 Expense Tracker — User App

## 🎯 Overview

This is the **user-facing version** of my Expense Tracker system.

Unlike the admin app, this application is designed with **restricted permissions**.  
Users can view project data and add new expenses, but they cannot edit or delete existing data.

I designed it this way to simulate a real-world scenario where different roles have different responsibilities.

---

## 🚀 Features

- 📂 View all projects (read-only)
- 💸 View expenses for each project
- ➕ Add a new expense
- 🔍 Search and filter projects
- ❌ Cannot edit or delete projects
- ❌ Cannot edit or delete expenses

---

## 💡 Design Decisions

### 1. Separation of Roles
I separated the system into an Admin app and a User app.  
The admin is responsible for managing data, while the user can only view and contribute data.

### 2. State Management (Zustand)
I chose Zustand for global state management because it is lightweight and simple to use.  
It avoids the boilerplate of Redux and is suitable for this project size.

### 3. Separation of Logic and UI
I separated logic into hooks and services:
- Hooks handle business logic (e.g. form handling, validation)
- Services handle communication with Firebase

This keeps components clean and improves maintainability.

### 4. Optimistic UI Updates
When a user adds an expense, the UI updates immediately without waiting for Firebase.  
This improves performance and provides a smoother user experience.

---

## 🔄 Data Flow

The main flow when adding an expense:

1. User submits the form
2. Hook validates the input
3. Service sends data to Firebase
4. Global store updates local state
5. UI re-renders automatically

Flow summary:

UI → Hook → Service → Firebase → Store → UI

---

## 📂 Project Structure

- `app/` → Screens and navigation (Expo Router)
- `components/` → Reusable UI components
- `hooks/` → Business logic (e.g. add expense logic)
- `services/` → Firebase interaction and global state (Zustand)
- `types/` → Data models and interfaces

---

## ⚙️ Technologies Used

- React Native (Expo)
- TypeScript
- Firebase Firestore
- Zustand (state management)
- Expo Router

---

## 📌 Limitations

- No authentication implemented
- Users cannot edit or delete data
- Data fetching may occur multiple times in some screens

---

## 🔮 Future Improvements

- Add authentication and role-based access
- Improve data synchronization between apps
- Optimize data fetching to reduce duplicate requests
- Add more advanced filtering and sorting

---

## 👨‍💻 Author

Le Minh Thanh