# 🛠️ Technology Stack Documentation

## Complete Tech Stack Overview

```
┌─────────────────────────────────────────────────────────────┐
│             CAMPUSSPEAK AI - TECH STACK              │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  FRONTEND                    BACKEND            DATABASE      │
│  ───────                     ───────            ────────      │
│  • HTML5                   • Python 3.x        • SQLite       │
│  • CSS3 (Tailwind CSS)     • Flask 2.3.3       • SQLAlchemy   │
│  • Vanilla JavaScript      • Flask-Login       • ORM          │
│  • Font Awesome            • Flask-SQLAlchemy                │
│  • Google Fonts            • Flask-WTF                        │
│  • Web Speech API          • Werkzeug          EXTERNAL APIS  │
│                            • Flask-CORS        ─────────────  │
│  OTHER LIBRARIES           • python-dotenv     • OpenRouter   │
│  ───────────────          • requests           • Web Speech   │
│  • Chart.js (planned)      • PyPDF2                            │
│  • Animations              • python-docx                       │
│  • Particle Engine         • python-pptx                       │
│                            • email-validator                   │
│                            • Werkzeug                          │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Backend Dependencies (Python)

### Framework & Web Server
| Package | Version | Purpose |
|---------|---------|---------|
| **Flask** | 2.3.3 | Core web framework |
| **Werkzeug** | 2.3.7 | WSGI utilities & HTTP server |
| **python-dotenv** | 1.0.0 | Environment variable management |

### Authentication & Security
| Package | Version | Purpose |
|---------|---------|---------|
| **Flask-Login** | 0.6.2 | User session management |
| **Flask-SQLAlchemy** | 3.0.5 | ORM for database operations |
| **Flask-WTF** | 1.1.1 | Form handling & CSRF protection |
| **WTForms** | 3.0.1 | Form validation |
| **email-validator** | 2.0.0 | Email validation |

### Data Processing & File Handling
| Package | Version | Purpose |
|---------|---------|---------|
| **PyPDF2** | 3.0.1 | PDF file parsing |
| **python-docx** | 1.2.0 | DOCX file parsing |
| **python-pptx** | 1.0.2 | PowerPoint file parsing |
| **requests** | 2.31+ | HTTP requests for external APIs |

### Database
| Package | Version | Purpose |
|---------|---------|---------|
| **SQLAlchemy** | 2.0.48 | SQL toolkit & ORM |

---

## 🎨 Frontend Technologies

### Core Technologies
```
HTML5          - Semantic markup and structure
CSS3           - Modern styling with Tailwind utilities
JavaScript ES6 - DOM manipulation and event handling
```

### Frontend Libraries
| Library | Purpose | CDN/Method |
|---------|---------|-----------|
| **Tailwind CSS** | Utility-first CSS framework | CDN included |
| **Font Awesome 6.4.0** | Icon library | CDN included |
| **Google Fonts** | Typography (Inter font family) | CDN included |

### Browser APIs Used
```
1. Web Speech API       - Speech recognition & synthesis
2. LocalStorage API     - Client-side data persistence
3. Fetch API            - Async HTTP requests
4. Canvas API           - Particle animation rendering
5. Timer/Promise APIs   - Animations & async operations
```

---

## 🗄️ Database Architecture

### Database Type
- **SQLite** — Lightweight, file-based database
- **Location** — `instance/presentation_coach.db`
- **ORM** — SQLAlchemy

### Database Models
```
┌──────────────────────────────────────────┐
│            DATABASE SCHEMA                │
├──────────────────────────────────────────┤
│                                           │
│  ┌─────────────────────────────────────┐ │
│  │           USERS TABLE               │ │
│  ├─────────────────────────────────────┤ │
│  │ • id (PK)                           │ │
│  │ • username                          │ │
│  │ • email                             │ │
│  │ • password_hash                     │ │
│  │ • full_name                         │ │
│  │ • email_verified                    │ │
│  │ • two_fa_enabled                    │ │
│  │ • remember_token                    │ │
│  │ • reset_token                       │ │
│  │ • created_at, updated_at, last_login│ │
│  └─────────────────────────────────────┘ │
│                                           │
│  ┌─────────────────────────────────────┐ │
│  │        SESSIONS TABLE               │ │
│  ├─────────────────────────────────────┤ │
│  │ • id (PK)                           │ │
│  │ • user_id (FK)                      │ │
│  │ • token                             │ │
│  │ • user_agent                        │ │
│  │ • ip_address                        │ │
│  │ • created_at, expires_at            │ │
│  │ • is_active                         │ │
│  └─────────────────────────────────────┘ │
│                                           │
└──────────────────────────────────────────┘
```

---

## 🔗 External APIs & Services

### OpenRouter API
- **Purpose** — AI-powered coaching responses
- **Model** — `nvidia/nemotron-3-super-120b-a12b:free`
- **Endpoint** — `https://openrouter.ai/api/v1/chat/completions`
- **Auth** — Bearer token (API key)
- **Use Case** — Real-time AI feedback from Zoiee chatbot

### Web Speech API
- **Purpose** — Browser-based speech recognition
- **Provider** — Browser native (Google Chrome/Edge)
- **Capabilities** — Real-time transcription, language detection
- **No Authentication** — Built into browser

---

## 🏗️ Architecture Pattern

```
MVC (Model-View-Controller) Pattern
───────────────────────────────────

Models (app.py + models.py)
└─ User Model
└─ Session Model
└─ Database queries & ORM

View (templates/)
└─ login.html      (Login page template)
└─ index.html      (Main app interface)
└─ h1.html         (Helper template)

Controller (app.py)
└─ Route handlers (@app.route)
└─ Request processing
└─ Response generation
```

---

## 🔄 Data Flow & Communication

### Frontend → Backend Communication
```
1. User interacts with UI (speech recognition)
2. JavaScript captures data & validates
3. Fetch API sends JSON to backend endpoint
4. Flask route processes request
5. Business logic processes data (speech analysis)
6. JSON response returned to frontend
7. JavaScript updates DOM with results
```

### External API Communication
```
Frontend (Chat Request)
        ↓
Backend (Flask /chat endpoint)
        ↓
OpenRouter API (LLM request)
        ↓
AI Response
        ↓
Backend processes response
        ↓
Frontend receives & displays via Zoiee chatbot
```

---

## 📊 Performance Considerations

| Component | Optimization |
|-----------|--------------|
| **Database** | SQLite with indexing on email/username |
| **Frontend** | Vanilla JS (no heavy frameworks) |
| **Speech Analysis** | Local regex processing (no API call) |
| **File Import** | Streaming with size limit (10MB max) |
| **Caching** | Browser cache for static assets (v=1 versioning) |

---

## 🔐 Security Technologies

| Security Feature | Implementation |
|------------------|-----------------|
| **Password Hashing** | Werkzeug's `generate_password_hash` |
| **Session Management** | Flask-Login with secure cookies |
| **CSRF Protection** | Flask-WTF token validation |
| **Email Validation** | email-validator library |
| **Token Generation** | Python `secrets` module |
| **HTTPS Ready** | Environment-based configuration |

---

## 📋 Environment Variables

```env
SECRET_KEY=your_flask_secret_key_here
OPENROUTER_API_KEY=your_openrouter_api_key_here
DATABASE_URL=sqlite:///presentation_coach.db
FLASK_ENV=development
FLASK_DEBUG=true
PORT=5000
```

---

## 🚀 Deployment Stack (Ready-to-Deploy)

| Component | Recommendation |
|-----------|-----------------|
| **WSGI Server** | Gunicorn or uWSGI |
| **Web Server** | Nginx or Apache |
| **Database** | PostgreSQL (production) |
| **Hosting** | Heroku, Railway, or AWS |
| **CDN** | CloudFlare or AWS CloudFront |
| **Storage** | AWS S3 for file uploads |

---

## 📦 Dependency Management

### Install All Dependencies
```bash
pip install -r requirements.txt
```

### Virtual Environment Setup
```bash
# Create
python -m venv venv

# Activate (Windows)
.\venv\Scripts\activate

# Activate (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Version Pinning
All versions in `requirements.txt` are pinned for reproducibility and stability.

---

## 🔧 Development vs Production

| Aspect | Development | Production |
|--------|-------------|-----------|
| **Framework Debug** | True | False |
| **Reload Mode** | Auto-reload on changes | Disabled |
| **Server** | Flask development server | Gunicorn/uWSGI |
| **Database** | SQLite (local file) | PostgreSQL (remote) |
| **API Keys** | Stored in .env | Environment variables |
| **Logging** | Console output | File-based logging |
| **Static Files** | Served by Flask | Served by reverse proxy |

---

## 📚 Additional Resources

- [Flask Official Docs](https://flask.palletsprojects.com/)
- [SQLAlchemy ORM](https://docs.sqlalchemy.org/)
- [Web Speech API Docs](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
