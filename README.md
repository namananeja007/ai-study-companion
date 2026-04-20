# 🧠 AI Study Companion

A production-level React web application to help students plan, track, and improve their study habits using structured planning, analytics, and smart recommendations.

---

## 🚀 Tech Stack

| Technology | Purpose |
|---|---|
| **React 18** | UI framework (functional components + hooks) |
| **Vite** | Build tool & dev server |
| **Tailwind CSS v4** | Utility-first styling |
| **Firebase Auth** | User authentication (email/password) |
| **Cloud Firestore** | Real-time NoSQL database |
| **React Router v6** | Client-side routing |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.jsx          # Responsive sticky navbar
│   ├── ProtectedRoute.jsx  # Auth-guard for routes
│   ├── TaskForm.jsx        # Controlled form for task CRUD
│   └── TaskItem.jsx        # Individual task display
├── context/
│   └── AuthContext.jsx     # Global auth state (Context API)
├── hooks/                  # (ready for custom hooks)
├── pages/
│   ├── Dashboard.jsx       # Analytics dashboard
│   ├── Login.jsx           # Firebase login
│   ├── Planner.jsx         # Study planner (CRUD)
│   ├── Signup.jsx          # Firebase signup
│   └── Timer.jsx           # Pomodoro focus timer
└── services/
    ├── analyticsService.js # Pure analytics computation
    ├── firebase.js         # Firebase init & exports
    ├── sessionService.js   # Firestore sessions CRUD
    └── taskService.js      # Firestore tasks CRUD
```

---

## ✨ Features

### 📋 Study Planner (CRUD)
- Add, edit, delete study tasks
- Mark tasks as complete/incomplete
- Priority levels (High / Medium / Low)
- Due date tracking with overdue detection
- Filter by All / Pending / Completed
- Real-time sync via Firestore

### ⏱️ Focus Timer (Pomodoro)
- 25-minute focus sessions + 5-minute breaks
- Circular SVG progress ring
- Start / Pause / Reset controls
- Subject selection per session
- Auto-saves completed sessions to Firestore

### 🏠 Dashboard (Analytics)
- Total study time (hours + minutes)
- Tasks completed vs. pending count
- Total Pomodoro sessions
- Weekly bar chart (last 7 days)
- Subject-wise time breakdown with progress bars

### 📉 Weak Area Detection
- Identifies subjects studied below average
- Flags subjects with pending tasks but zero study time

### 🤖 Smart Suggestions (Logic-based)
- Highlights overdue and high-priority tasks
- Suggests neglected subjects
- Reminds you to start if no study today

---

## 🔐 Authentication

- Email + Password via Firebase Authentication
- `AuthContext` manages global user state
- `onAuthStateChanged` listener for session persistence
- `ProtectedRoute` redirects unauthenticated users to `/login`
- Auth pages redirect logged-in users to dashboard

---

## ⚛️ React Concepts Used

| Concept | Where Used |
|---|---|
| `useState` | All forms, timers, local state |
| `useEffect` | Firestore subscriptions, timer logic |
| `useRef` | Pomodoro interval reference |
| `useMemo` | Analytics computation in Dashboard |
| `useCallback` | Event handlers in Planner/Timer |
| Context API | `AuthContext` for global user state |
| React Router | All navigation and protected routes |
| `React.lazy` + `Suspense` | Lazy-loaded page components |
| Controlled Components | All forms (TaskForm, Login, Signup) |
| Lists & Keys | Task list rendering |
| Conditional Rendering | Loading states, auth state, overdue tasks |
| Component Composition | Dashboard composed of sub-components |
| Lifting State Up | Task editing state in Planner |

---

## 🛠️ Setup & Installation

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd "End term project"
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Firebase
Create a `.env.local` file in the root:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Firebase Console Setup
1. Enable **Email/Password** in Authentication → Sign-in methods
2. Create a **Firestore Database** in production or test mode
3. Add Firestore composite indexes when prompted in the browser console

### 5. Run the app
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173)

---

## 🚢 Deployment (Vercel)

1. Run `npm run build` to test the production build locally
2. Push code to GitHub (ensure `.env.local` is in `.gitignore`)
3. Go to [vercel.com](https://vercel.com) → New Project → Import repo
4. Add all `VITE_FIREBASE_*` variables under **Project Settings → Environment Variables**
5. Click Deploy ✅

---

## 🔮 Future Improvements

- 🤖 AI-powered suggestions via OpenAI / Gemini API
- 🔥 Study streak tracker & daily goals
- 🔔 Browser push notifications for due tasks
- 📊 Export study reports as PDF
- 🌙 Dark mode toggle
- 👥 Study group / collaboration features
- 📱 PWA support for mobile offline use

---

## 📄 License

MIT © 2024 — Built as an End-Term Project
