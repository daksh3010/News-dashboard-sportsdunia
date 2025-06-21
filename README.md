# 📰 SportsDunia News Dashboard

A responsive full-stack dashboard that provides a unified view of news and blog articles. Built as a part of the SportsDunia frontend assignment using **React**, **Tailwind CSS**, **Firebase Authentication**, and multiple public APIs.

---

## 🚀 Features

### 🔐 Authentication
- Firebase Email/Password-based login
- Predefined Admin access (`admin@gmail.com / 123456`)

### 📥 Data Integration
- Fetched **News** from [NewsAPI](https://newsapi.org/)
- Fetched **Blogs** from [Dev.to API](https://dev.to/api/articles)

### 🧰 Admin Dashboard
Only visible to admin users:
- Set global payout rate per article
- Real-time calculation of total payouts
- Tabular summary of article count & payout per author
- Export data to **CSV** and **PDF**

### 📊 Visualization
- Pie chart visualization of article distribution per author

### 🔍 Filtering & Search
- Filter by **Author**
- Filter by **Article Type** (News / Blog)
- Filter by **Date Range**
- Full-text **Search** in article titles

### ⚠️ Error Handling
- Displays user-friendly message if API fetch fails

---

## 📸 Screenshots

![Dashboard Screenshot](./screenshots/dashboard.png)
![Admin View](./screenshots/admin-panel.png)

---

## 🧪 Test Credentials

| Role     | Email               | Password |
|----------|---------------------|----------|
| Admin    | `admin@gmail.com`   | `123456` |
| Viewer   | *Sign up directly*  | –        |

---

## 🛠 Tech Stack

- **React** with **Vite**
- **Tailwind CSS**
- **Firebase Auth**
- **Chart.js** (via react-chartjs-2)
- **jsPDF** + **jspdf-autotable** (for PDF export)
- **FileSaver** & Blob API (for CSV export)

---

## 📂 Folder Structure

src/
│
├── assets/                  # Static files like images, icons, etc.
│
├── components/
│   └── NewsChart.jsx        # Chart component for articles by author
│
├── context/
│   └── AuthContext.jsx      # Firebase Auth context provider
│
├── pages/                   # Route-based page components
│   ├── Dashboard.jsx
│   ├── Login.jsx
│   ├── News.jsx
│   └── Signup.jsx
│
├── utils/
│   └── adminList.js         # Admin email whitelist
│
├── App.jsx                  # Main application wrapper
├── App.css
├── index.css                # Global Tailwind styles
├── main.jsx                 # Root entry point
├── firebase.js              # Firebase config



---

## 📦 Setup & Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/sportsdunia-dashboard.git
   cd sportsdunia-dashboard

2. Install dependencies:
    npm install

3. Create a .env file and include all the environment variables:
    VITE_FIREBASE_API_KEY=your_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_APP_ID=your_app_id
    VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    VITE_GUARDIAN_API_KEY=your_guardianapi_key_here

4. Start the development server:
    npm run dev


---

Let me know if you'd like:
- Daksh , (https://github.com/daksh3010)