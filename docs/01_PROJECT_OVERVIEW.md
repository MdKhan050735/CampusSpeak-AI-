# 🎤 CampusSpeak AI - Project Overview

## Project Description

**CampusSpeak AI** is an intelligent, real-time presentation feedback platform that helps users improve their public speaking and presentation skills. The application uses Web Speech API for live speech recognition and AI-powered analysis to provide instant, actionable feedback.

This is a full-stack web application built for the hackathon, combining modern frontend technologies with Python backend services.

---

## 🎯 Project Objectives

1. **Real-Time Speech Analysis** — Analyze spoken content as the user presents
2. **Smart Feedback System** — Detect filler words, measure speaking pace, and calculate clarity
3. **AI Coaching** — Provide personalized coaching suggestions via AI chatbot (Zoiee)
4. **User Authentication** — Secure login system with user account management
5. **Script Management** — Import and practice with presentation scripts
6. **Teleprompter Mode** — Guide users through presentations with script-based practice
7. **Beautiful UI** — Modern, interactive interface with particle effects and animations

---

## ✨ Key Features

### 🔐 Authentication System
- Secure user login/registration
- Email verification (future enhancement)
- Password reset functionality
- "Remember me" for 30 days
- Social login buttons (Google/GitHub - coming soon)

### 🎙️ Speech Recognition & Analysis
- **Real-time transcription** using Web Speech API
- **Filler word detection** (um, uh, like, you know, etc.)
- **Pace analysis** — Words per minute (WPM)
- **Clarity scoring** — 0-100 scale based on filler ratio and pace
- **Session metrics** — Duration, word count, speaking patterns

### 💬 AI Coaching
- **Smart AI Assistant (Zoiee)** — Friendly robot avatar
- **Context-aware feedback** — Uses speech metrics to provide advice
- **Conversational mode** — Users can ask questions
- **Coaching suggestions** — Actionable tips to improve speaking

### 📁 Script Import
- **Multi-format support** — `.txt`, `.pdf`, `.docx`, `.ppt`, `.pptx`
- **Automatic text extraction** — Extracts content from documents
- **Legacy format handling** — `.doc` files require conversion to `.docx`

### 📝 Teleprompter Mode
- **Synchronized tracking** — Follows user position in script
- **Progress visualization** — Shows current and completed sections
- **Practice sessions** — Full presentations with script guidance

### 🎨 UI/UX Features
- **Glassmorphism design** — Modern semi-transparent components
- **Particle effects** — Animated background with gravity physics
- **Cursor-following glow** — Interactive hover effects
- **Responsive layout** — Works on desktop and tablets
- **Dark theme** — Eye-friendly presentation-focused interface

---

## 📊 Project Statistics

| Metric | Value |
|--------|-------|
| **Framework** | Flask 2.3.3 |
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **Database** | SQLite |
| **APIs Used** | Web Speech API, OpenRouter AI API |
| **Total Dependencies** | 12 packages |
| **Main Routes** | 9 endpoints |
| **Estimated LOC** | ~2000 |

---

## 🎯 Use Cases

### For Students
- Practice presentations before class
- Improve speaking pace and clarity
- Get instant feedback on presentation skills

### For Professionals
- Prepare for important talks
- Reduce filler words in speeches
- Build confidence with guided practice

### For Educators
- Help students develop speaking skills
- Track improvement over time
- Provide data-driven feedback

---

## 🚀 Project Status

- ✅ Core Features Implemented
- ✅ Database & Authentication Setup
- ✅ Real-time Speech Recognition
- ✅ AI Coaching System
- ✅ File Import Functionality
- 🔄 Script Verification & UI Polish
- ⏳ Email Notifications (TODO)
- ⏳ Analytics Dashboard (TODO)
- ⏳ Presentation History (TODO)

---

## 📋 Next Steps

1. **User Testing** — Gather feedback from test users
2. **Performance Optimization** — Improve analysis speed
3. **Enhanced Analytics** — Add historical tracking
4. **Mobile App** — React Native version
5. **Multiplayer Mode** — Get feedback from other users

---

## 👥 Contributors

- Built during Hackathon 2026
- Team: AI/ML & Frontend Developers

---

## 📞 Contact & Support

For issues, questions, or feature requests, please refer to the project documentation in the `/docs` folder.
