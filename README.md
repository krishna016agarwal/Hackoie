# 🚀 Hackoie – Smart Hackathon Team Matching Platform

Hackoie is a **collaborative hackathon team-building platform** that helps participants find the right teammates based on **skills, requirements, and intent**.  
It removes randomness from team formation and enables **structured, secure, and intelligent collaboration** for hackathons and innovation challenges.

***website*** - https://hackoie-d4oo.vercel.app

---

## 🌟 About Hackoie

Hackoie connects **idea owners** with **skilled collaborators** using requirement-based matching and controlled team invitations.

Instead of spamming groups or relying on luck, Hackoie ensures:
- The right people join the right ideas
- Teams remain balanced and fair
- Hackathon rules are automatically enforced

---

## 🎯 Main Objective

**To simplify and optimize hackathon team formation using intelligent matching, secure workflows, and fair participation rules.**

---

## 🧠 Core Features

### 🔐 Secure Authentication
- OTP-based email verification
- JWT-based authentication
- Protected routes and actions
- No fake or duplicate accounts

---

### 🎫 Ticket-Based Idea System
- Users create **tickets** describing:
  - Hackathon / competition
  - Idea overview
  - Required skills
  - Preferred college & academic year
- Each ticket represents **one team opportunity**

---

### 🤝 Intelligent Team Matching
- On ticket creation:
  - System identifies **Top 10 most relevant users**
  - Matching based on:
    - Skills
    - College
    - Academic year
    - Profile strength
- Admin can:
  - Review suggested profiles
  - Send team join requests

---

### 📩 Team Invite Workflow
- Admin sends invite → stored securely
- Users receive **incoming team requests**
- Users can **accept or reject**
- On acceptance:
  - User is automatically added to the team
- Duplicate invites and misuse are prevented

---

### 📊 Response Dashboard
Each user gets a personalized dashboard showing:
- Total tickets created
- Incoming requests
- Sent requests
- Joined teams

---

## 🛡️ Security & Fair Usage

- One team per hackathon per user
- Team size limits strictly enforced
- Profile completion required
- IP-based rate limiting
- Bot and abuse protection
- Free plan limits on ticket creation

---

## 🖥️ Frontend Experience

- Built with **React.js**
- Clean, product-grade UI
  - Background: White / Light Green
  - Text: Black / Green
- Responsive and accessible design
- Popup-based auth enforcement
- Dynamic navbar based on login state

---

## ⚙️ Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios
- React Router

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- OTP Verification

---

## 🧩 Database Models

- User
- Ticket
- TeamInvite
- OTP / Verification
- Request & Response tracking

All schemas are **indexed, scalable, and conflict-safe**.

---

## 🔄 Platform Workflow

User Signup → OTP Verification → Home Page  
Create Ticket → Smart User Matching  
Admin Sends Invites → Users Respond  
Accepted Users Join the Team



---

## 🎯 Use Cases

- Hackathon team formation
- College innovation events
- Startup idea collaboration
- Competitive programming teams
- Community-driven tech projects

---

## 🏆 Why Hackoie?

- Requirement-based teammate matching
- Controlled and secure team invitations
- Anti-spam and fair-play enforcement
- Clean, professional product UX
- Scalable backend architecture

---

## 🔮 Future Enhancements

- AI-powered deep skill matching
- In-app team chat
- Notifications and email alerts
- Organizer dashboards
- Participation analytics

---

## 👨‍💻 Author

**Krishna Agarwal**  
B.Tech CSE | MERN Stack Developer  
Focused on building **real-world, scalable platforms**

---

## 📄 License

This project is licensed under the **MIT License**.

