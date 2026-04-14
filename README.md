# 🇿🇦 MzansiBuilds  
### Build in Public. Connect. Collaborate. Celebrate.

<p align="center">
  🚀 A community platform for South African developers  
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React%20%2B%20Vite-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Backend-Supabase-green?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Auth-Supabase%20Auth-orange?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Deployment-Vercel-black?style=for-the-badge" />
</p>

---

## ✨ Overview

**MzansiBuilds** is a platform where developers can **build in public**, showcase their progress, and connect with others in the South African tech community.

> Think: *“LinkedIn meets GitHub — but focused on building, not just showcasing.”*

---

## 🎯 Features

- 👤 Developer Profiles  
- 🛠️ Project Creation & Management  
- 📰 Live Project Feed  
- 💬 Comments & Collaboration Requests  
- 📈 Milestone Tracking  
- 🎉 Celebration Wall for Completed Projects  

---

## 🧠 Problem

South African developers lack a **centralized, community-driven platform** to:
- Share what they are building  
- Find collaborators  
- Celebrate completed work  

Existing tools like GitHub and LinkedIn are not optimized for **ongoing project visibility and interaction**.

---

## 💡 Solution

MzansiBuilds provides:

- A **live feed** of projects  
- **Collaboration-first interactions**  
- **Milestone-based progress tracking**  
- A **Celebration Wall** to highlight completed work  

---

## 🧱 Tech Stack

| Layer        | Technology              |
|-------------|------------------------|
| Frontend    | React + Vite           |
| Backend     | Supabase               |
| Auth        | Supabase Auth          |
| Database    | PostgreSQL (Supabase)  |
| Storage     | Supabase Storage       |
| Testing     | Vitest + React Testing Library |
| CI/CD       | GitHub Actions         |
| Hosting     | Vercel                 |

---

## 🏗️ Architecture
src/
├── pages/ # Route-level views
├── components/ # Reusable UI components
├── hooks/ # Data fetching (Supabase)
├── context/ # Global state (Auth)
├── utils/ # Helper functions
└── tests/ # Test files


### 🔑 Design Principles
- **Pages** → Orchestrate logic  
- **Hooks** → Handle data fetching  
- **Components** → Render UI  
- **Utils** → Pure computation  

---

## 👥 User Stories

### 🔐 Authentication
- Register account  
- Login via Google  
- Login via email/password  
- Secure logout  

### 🛠️ Projects
- Create projects  
- Edit project details  
- Mark projects as complete  

### 📰 Feed
- Browse live projects  
- Search projects  
- Filter by stage  

### 🤝 Social
- Comment on projects  
- Request collaboration  
- Receive collaboration requests  

### 📈 Progress
- Add milestones  
- View timeline of progress  

### 🎉 Celebration Wall
- Automatic feature when project completes  
- Browse completed projects  

### 👤 Profile
- View personal profile  
- Edit bio, username, avatar  

---

## ⚙️ Assumptions

- 🔐 Authentication required for all interactions  
- ✅ Projects can only be completed once (irreversible)  
- ⚡ Celebration entries are auto-generated via DB trigger  
- 📊 Project stages:
  - `idea`
  - `in progress`
  - `completed`
- 📧 Email confirmation disabled during development  

---

## 📄 Pages & Routes

| Page                | Route                | Access        |
|---------------------|---------------------|--------------|
| Auth                | /login, /register   | Public       |
| Feed                | /feed               | Protected    |
| Project Detail      | /project/:id        | Protected    |
| Create Project      | /create-project     | Protected    |
| Edit Project        | /project/:id/edit   | Owner Only   |
| Profile             | /profile            | Protected    |
| Edit Profile        | /edit-profile       | Protected    |
| Celebration Wall    | /celebration-wall   | Protected    |

---

## 🧪 Testing

- Unit + component testing using:
  - Vitest  
  - React Testing Library  

---

## 🚀 Deployment

- Hosted on **Vercel**  
- CI/CD powered by **GitHub Actions**  


---

## 🤝 Contributing

Contributions are welcome!

```bash
# Clone repo
git clone https://github.com/hyker24/MzansiBuilds.git
