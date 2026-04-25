# 🚦 CivicPath AI

An AI-powered civic issue reporting and resolution platform that enables citizens to report infrastructure problems (roads, garbage, water leaks, etc.) and intelligently routes them to the correct authorities.

---

## 📌 Overview

CivicPath AI bridges the gap between citizens and municipal authorities by streamlining how civic issues are reported, processed, and resolved.

Instead of scattered complaints and delayed responses, this system:
- Collects civic issues from users
- Uses AI to classify and prioritize them
- Routes them to the appropriate department
- Tracks resolution status in real-time

---

## 🚀 Key Features

- 🧠 AI-based issue classification  
- 📍 Location-aware complaint mapping  
- ⚡ Smart routing to relevant departments  
- 📊 Dashboard for tracking complaints  
- 🔔 Real-time updates and notifications  
- 🗂️ Complaint history and analytics  

---

## 🏗️ Architecture


User → Frontend → Backend API → AI Model → Database → Admin Dashboard


### Breakdown:
- **Frontend** → User interface for complaint submission  
- **Backend** → Handles API requests and routing logic  
- **AI Engine** → Classifies and prioritizes issues  
- **Database** → Stores complaints and user data  
- **Admin Panel** → Used by authorities for resolution tracking  

---

## 🧠 AI Workflow

1. User submits complaint (text/image/location)  
2. AI processes input  
3. Classifies issue category:
   - Roads  
   - Waste  
   - Water  
   - Electricity  
4. Assigns priority level  
5. Routes to relevant authority  

---

## 📂 Project Structure


CivicPath-AI/
│
├── frontend/ # UI components
├── backend/ # API and server logic
├── models/ # AI/ML models
├── database/ # DB schemas and configs
├── utils/ # Helper functions
├── assets/ # Images and static files
└── README.md


---

## ⚙️ Tech Stack

### Frontend
- React / HTML / CSS / JavaScript  

### Backend
- Node.js / Express  

### AI / ML
- Python  
- NLP / Classification models  

### Database
- Firebase / MongoDB  

### Integrations
- Google Maps API (location tracking)  
- Notification services  

---

## 🔧 Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/Hemkumar247/CivicPath-Ai.git
cd CivicPath-Ai
2. Install dependencies
# frontend
cd frontend
npm install

# backend
cd ../backend
npm install
3. Run the application
# start backend
npm start

# start frontend
npm run dev
