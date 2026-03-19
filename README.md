# 🚀 Hackoie – Smart Hackathon Team Matching Platform

Hackoie is a **collaborative hackathon team-building platform** that helps participants find the right teammates based on **skills, requirements, and intent**.  
It removes randomness from team formation and enables **structured, secure, and intelligent collaboration** for hackathons and innovation challenges.


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
- Role-gap awareness:
  - Recommends candidates that complete missing roles (AI / Frontend / Backend / Designer / Pitch)
  - Avoids over-indexing on already-covered skills
- Admin can:
  - Review suggested profiles
  - Send team join requests

---

### GitHub Skill Proofreading (New)
- Users can run **GitHub verification** from profile
- System analyzes public repositories, languages, topics, stars, activity recency
- Generates:
  - Verification score (0-100)
  - Confidence level (low/medium/high)
  - Inferred skills
  - Summary insight for team leaders
- Team leaders can view this signal inside profile popups while shortlisting teammates

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

## 🔧 Environment Setup

Create a `.env` file inside `backend/` with:

```bash
cd backend
cp .env.example .env
```

- `MONGODB_URL=<your_mongodb_connection_string>`
- `JWT_SECRET=<your_jwt_secret>`
- `PORT=3000` (optional)
- `GITHUB_TOKEN=<optional_personal_access_token_for_higher_rate_limits>`
- `MONGO_DNS_SERVERS=8.8.8.8,1.1.1.1` (optional; helps on networks where SRV DNS is blocked)

Without `MONGODB_URL`, backend startup will fail by design.

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

- Eliminates manual outreach across multiple platforms
- Requirement-based teammate matching
- Role-gap matching to build balanced teams
- Context-aware personalized discovery feed
- Skill-verified candidate discovery using GitHub proof signals
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

