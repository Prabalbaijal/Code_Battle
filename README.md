# ⚔️ Coding Battle - Real-Time 1v1 DSA Code Battle Platform

**Live App:** [https://code-battle-wheat.vercel.app](https://code-battle-wheat.vercel.app)

**Coding Battle** is a real-time web application where users engage in **1 v/s 1 coding battles** by solving DSA problems with live code evaluation, scoring, and social features.

---

## 🚀 Features

- 🔁 **Real-Time Battles** – Face off against another user in a coding challenge with live synchronization powered by **Socket.IO**.
- ⚙️ **Judge0 Integration** – Secure, sandboxed code execution with support for **4+ programming languages**, along with custom logic to handle:
  - Time Limit Exceeded (TLE)
  - Runtime Errors
- ⚙️ **Code-editor with auto complete support for 4+ languages.
- 👥 **User Presence & Status** – Used **Socket.IO** to:
  - Show **online/offline** status of users
  - Display **in-contest** status in real time
  - Handle **friend request acceptance/rejection** instantly
- 🤝 **Social System** – Add friends, send/accept friend requests, and challenge your friends in coding battles.
- 🏆 **Gamification** – Includes:
  - Coins and level system
  - Dynamic **leaderboard** showing top 50 users
- 💾 **Reliable Data Handling** – Uses **MongoDB transactions** to ensure:
  - Consistent contest creation and result updates
  - No race conditions or partial writes

---

## 🛠️ Tech Stack

- **Frontend:** React, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (with Mongoose)
- **Real-time:** Socket.IO
- **Code Execution:** Judge0 API
- **Deployment:** Render

---

## 📬 Try it Live

🔗 **[Visit the Deployed App](https://code-battle-wheat.vercel.app)** and challenge your friends now!

---
