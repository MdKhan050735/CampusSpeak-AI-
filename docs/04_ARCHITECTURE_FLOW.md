# 🏗️ Architecture & Application Flow

## System Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                        CLIENT BROWSER                            │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────┐         ┌─────────────────────┐          │
│  │   LOGIN PAGE       │         │    MAIN APP         │          │
│  │ ────────────────── │         │ ───────────────────  │          │
│  │ • Email input      │         │ • Microphone        │          │
│  │ • Password input   │         │ • Recording UI      │          │
│  │ • Particle effects │         │ • Chat interface    │          │
│  │ • Auth form        │         │ • Teleprompter      │          │
│  └────────────────────┘         │ • Results display   │          │
│           ↕                      │ • Metrics charts    │          │
│      Fetch API                   └─────────────────────┘          │
│    (JSON POST)                         ↕                          │
│           ↓                    (Fetch API, Web Speech API)        │
│                                        ↓                          │
├──────────────────────────────────────────────────────────────────┤
│                      FLASK BACKEND (Python)                       │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │              ROUTE HANDLERS (@app.route)                    │ │
│  │  ──────────────────────────────────────────────────────────  │ │
│  │  • GET /              → Redirect to /login                  │ │
│  │  • GET/POST /login    → Handle authentication               │ │
│  │  • GET /logout        → Clear session                       │ │
│  │  • GET /app           → Serve main dashboard                │ │
│  │  • POST /analyze      → Speech analysis API                 │ │
│  │  • POST /chat         → AI coaching API                     │ │
│  │  • POST /import-file  → File upload & parsing               │ │
│  │  • POST /register     → User registration                   │ │
│  │  • POST /profile      → User profile endpoint               │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                           ↓                                       │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │            BUSINESS LOGIC LAYER                             │ │
│  │  ──────────────────────────────────────────────────────────  │ │
│  │  • Speech Analysis Engine                                   │ │
│  │    - Filler word detection                                  │ │
│  │    - WPM calculation                                        │ │
│  │    - Clarity scoring                                        │ │
│  │                                                              │ │
│  │  • Authentication System                                    │ │
│  │    - Password hashing/verification                          │ │
│  │    - Session management (Flask-Login)                       │ │
│  │    - Token generation                                       │ │
│  │                                                              │ │
│  │  • File Processing                                          │ │
│  │    - PDF extraction (PyPDF2)                                │ │
│  │    - DOCX parsing (python-docx)                             │ │
│  │    - PPTX extraction (python-pptx)                          │ │
│  │                                                              │ │
│  │  • API Integration                                          │ │
│  │    - OpenRouter LLM requests                                │ │
│  │    - Response processing                                    │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                           ↓                                       │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │          DATABASE LAYER (SQLAlchemy ORM)                    │ │
│  │  ──────────────────────────────────────────────────────────  │ │
│  │  • User Model         ↔  SQLite Database                    │ │
│  │  • Session Model      ↔  presentation_coach.db              │ │
│  │  • Query operations                                          │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│              EXTERNAL SERVICES (via HTTP Requests)               │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────┐     ┌──────────────────────┐  │
│  │      OPENROUTER API          │     │  WEB SPEECH API      │  │
│  │  (AI Coach responses)         │     │  (Browser native)    │  │
│  │ ───────────────────────────── │     │ ──────────────────── │  │
│  │ • Prompt: user message        │     │ • Transcription      │  │
│  │ • Context: speech metrics     │     │ • Language detection │  │
│  │ • Model: Nemotron 3 Super     │     │ • Built-in browser   │  │
│  │ • Response: coaching advice   │     │ • No API key needed  │  │
│  └──────────────────────────────┘     └──────────────────────┘  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## Request/Response Flow Diagram

### User Login Flow
```
┌─────────┐
│  User   │
└────┬────┘
     │ 1. Enter email & password → Click "Sign In"
     ↓
┌──────────────────────────────┐
│   Login.js (Frontend)        │
│                              │
│ 1. Validate email & password │
│ 2. Show loading indicator    │
└──────┬───────────────────────┘
       │ 3. POST /login (JSON)
       │ {email, password, remember_me}
       ↓
┌──────────────────────────────────┐
│  app.py: login() Route Handler   │
│                                  │
│ 1. Extract email & password      │
│ 2. Query User by email           │
│ 3. Check password hash           │
└──────┬───────────────────────────┘
       │ 4. Password matches?
       ├─ YES: Update last_login
       │       Generate remember token
       │       Create Flask session
       ↓
   ┌────────────────────────────┐
   │  Response: 200 OK          │
   │ {success: true}            │
   └────────────┬───────────────┘
                │ 5. Redirect to /app
                ↓
           ┌─────────────────┐
           │  Main Dashboard │
           └─────────────────┘

       ├─ NO: Invalid password
       ↓
   ┌────────────────────────────┐
   │  Response: 401             │
   │ {error: "Invalid..."}      │
   └────────────┬───────────────┘
                │ Show error message
                ↓
           ┌─────────────────────┐
           │  Stay on Login Page │
           └─────────────────────┘
```

### Speech Analysis Flow
```
┌──────────────────┐
│  User Recording  │
│  (Audio captured)│
└────────┬─────────┘
         │ 1. Web Speech API
         │    Real-time transcription
         ↓
┌─────────────────────────────────┐
│  script.js (Frontend)           │
│                                 │
│ 1. Capture transcribed text     │
│ 2. Capture duration (seconds)   │
│ 3. Stop recording               │
└────────┬────────────────────────┘
         │ 4. POST /analyze (JSON)
         │ {text, duration}
         ↓
┌────────────────────────────────────┐
│  app.py: analyze_speech()          │
│                                    │
│ 1. Split text into words           │
│ 2. Count total words               │
│ 3. Calculate WPM                   │
│ 4. Count filler words (regex)      │
│ 5. Generate filler details         │
│ 6. Calculate clarity score (0-100) │
│ 7. Determine pace rating           │
│ 8. Generate suggestions            │
└────────┬───────────────────────────┘
         │ 9. Response: 200 OK
         ↓
┌──────────────────────────────────────────┐
│  Response JSON:                          │
│ {                                        │
│   word_count: 150,                       │
│   wpm: 120,                              │
│   filler_count: 3,                       │
│   filler_details: {like: 2, um: 1},      │
│   clarity: 85,                           │
│   pace: "Good",                          │
│   duration: 75.5,                        │
│   suggestions: [...]                     │
│ }                                        │
└────────┬───────────────────────────────┘
         │ 10. Receive metrics
         ↓
┌──────────────────────────────────────────┐
│  script.js (Frontend)                    │
│                                          │
│ 1. Update metrics display                │
│ 2. Highlight filler words in transcript  │
│ 3. Display clarity score chart           │
│ 4. Show suggestions                      │
│ 5. Pass metrics to AI chat               │
└──────────────────────────────────────────┘
```

### AI Chat/Feedback Flow
```
┌──────────────────┐
│  User Question   │
│  (via chatbot)   │
└────────┬─────────┘
         │ 1. User types message
         ↓
┌───────────────────────────────────┐
│  script.js (Frontend)             │
│                                   │
│ 1. Get user message               │
│ 2. Get speech metrics (context)   │
│ 3. Get chat history               │
│ 4. Show loading indicator         │
└────────┬────────────────────────┘
         │ 5. POST /chat (JSON)
         │ {message, context, history}
         ↓
┌────────────────────────────────────┐
│  app.py: chat() Route Handler      │
│                                    │
│ 1. Check API key exists            │
│ 2. Build message array             │
│ 3. Add system prompt               │
│ 4. Add metrics context (if active) │
│ 5. Add conversation history        │
│ 6. Add user message                │
└────────┬───────────────────────────┘
         │ 7. POST to OpenRouter API
         │ (Bearer token auth)
         ↓
┌──────────────────────────────────┐
│  OpenRouter LLM Service          │
│                                  │
│ Model: Nemotron 3 Super 120B     │
│                                  │
│ Processing:                      │
│ 1. Parse system prompt           │
│ 2. Analyze user message context  │
│ 3. Include speech metrics        │
│ 4. Generate response             │
└────────┬──────────────────────────┘
         │ 8. Response: {choices[0].message.content}
         ↓
┌──────────────────────────────────┐
│  app.py: chat() Response Handler  │
│                                  │
│ 1. Extract AI response text      │
│ 2. Validate response status      │
│ 3. Return JSON response          │
└────────┬──────────────────────────┘
         │ 9. Response: 200 OK
         │ {reply: "Your feedback..."}
         ↓
┌────────────────────────────────────────────┐
│  script.js (Frontend)                      │
│                                            │
│ 1. Display AI response in chatbot          │
│ 2. Trigger Zoiee animation                 │
│ 3. Add to chat history                     │
│ 4. Allow user to continue conversation     │
└────────────────────────────────────────────┘
```

---

## Data Structure & Models

### User Model
```python
User {
    id: int (Primary Key)
    username: str (unique)
    email: str (unique)
    password_hash: str
    full_name: str
    
    # Email verification
    email_verified: bool
    verification_token: str
    verification_token_expires: datetime
    
    # Two-factor auth
    two_fa_enabled: bool
    two_fa_secret: str
    
    # Remember me token
    remember_token: str
    remember_token_expires: datetime
    
    # Password reset
    reset_token: str
    reset_token_expires: datetime
    
    # Timestamps
    created_at: datetime
    updated_at: datetime
    last_login: datetime (nullable)
    
    # Social login
    google_id: str (nullable)
    github_id: str (nullable)
}
```

### Session Model
```python
Session {
    id: int (Primary Key)
    user_id: int (Foreign Key → User.id)
    token: str (unique)
    user_agent: str
    ip_address: str
    created_at: datetime
    expires_at: datetime
    is_active: bool
}
```

### Speech Analysis Result
```javascript
{
    word_count: 150,           // Total words spoken
    wpm: 120,                  // Words per minute
    filler_count: 3,           // Total filler words
    filler_details: {          // Breakdown by word
        "like": 2,
        "um": 1
    },
    clarity: 85,               // 0-100 score
    pace: "Good",              // Good/Too Fast/Too Slow
    duration: 75.5,            // Seconds
    suggestions: [             // Array of tips
        "Great job avoiding filler words!",
        "Your pace is excellent!"
    ]
}
```

---

## Application State Management

### Frontend State (Client-side)
```javascript
{
    // User state
    currentUser: null or {id, username, email},
    isAuthenticated: bool,
    
    // Recording state
    isRecording: bool,
    recordingDuration: int,
    transcript: string,
    
    // Analysis state
    currentMetrics: {
        wpm, clarity, filler_count, ...
    },
    suggestions: string[],
    
    // Chat state
    chatHistory: [{role, content}, ...],
    isChatOpen: bool,
    isLoadingResponse: bool,
    
    // UI state
    currentTab: string,
    isLoadingIndicatorVisible: bool,
    particles: Particle[]
}
```

### Backend State (Session)
```python
flask.session {
    'user_id': int,
    'remember_token': str (optional),
    '_permanent': bool,
    # Additional Flask-Login managed properties
}
```

---

## File Processing Pipeline

```
┌──────────────────────────────┐
│  User Uploads File           │
│  (.pdf, .docx, .ppt, .pptx)  │
└──────────┬───────────────────┘
           │ POST /import-file
           ↓
┌──────────────────────────────────┐
│  Validation Layer                │
│                                  │
│ 1. Check file extension          │
│ 2. Check file size (< 10MB)      │
│ 3. Reject .doc files             │
└──────────┬───────────────────────┘
           │ Valid?
           ├─ YES ↓
           │
           ├─ NO → Error response
           │
┌──────────────────────────────┐
│  File Type Router            │
└──────────┬───────────────────┘
           │
    ┌──────┼──────┬────────┐
    │      │      │        │
    ↓      ↓      ↓        ↓
  .pdf   .docx  .ppt    .pptx
    │      │      │        │
    ↓      ↓      ↓        ↓
┌──────────────────────────┐
│ Use specific parser:     │
│ • PyPDF2 (.pdf)          │
│ • python-docx (.docx)    │
│ • python-pptx (.ppt/.pptx)
└──────────┬───────────────┘
           │
           ↓
┌──────────────────────────┐
│  Extract Text            │
│  Clean & format          │
└──────────┬───────────────┘
           │
           ↓
┌──────────────────────────┐
│  Return JSON Response    │
│ {text: extracted_content}│
└──────────┬───────────────┘
           │
           ↓
┌──────────────────────────────┐
│  Frontend: script.js         │
│                              │
│ 1. Display extracted text    │
│ 2. User can edit/refine      │
│ 3. Load into teleprompter    │
└──────────────────────────────┘
```

---

## Navigation Flow

```
                    ┌─────────────┐
                    │   START     │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │ http://5000  │
                    └──────┬──────┘
                           │ Redirect
                           ↓
                    ┌──────────────┐
                    │ LOGIN PAGE   │
                    │ /login       │
                    └──┬───┬───┬──┘
                       │   │   │
        ┌──────────────┘   │   └───────────────┐
        │                  │                   │
   Sign In          Try Demo            Sign Up
        │                  │                   │
        ↓                  ↓                   ↓
   Authenticate      Skip Auth        Registration
   (if valid)       (direct access)    (future)
        │                  │                   │
        └──────────────┬───┴──────────────────┘
                       │
                    ┌──▼─────────────┐
                    │ MAIN APP       │
                    │ /app           │
                    │ (@login_req)   │
                    └──┬────┬──────┬─┘
                       │    │      │
    ┌──────────────────┘    │      └────────────────┐
    │                       │                       │
 Chat/AI              Recording               Teleprompter
    │                       │                       │
    ├─ Open Chatbot    ├─ Click Record        ├─ Load Script
    ├─ Ask Questions   ├─ Transcription       ├─ Follow mode
    ├─ Get Feedback    ├─ Stop & Analyze      ├─ Progress bar
    └─ Continue chat   ├─ View Metrics        └─ Complete
                       └─ Get Suggestions


                    ┌──────────┐
                    │  LOGOUT  │
                    │ /logout  │
                    └────┬─────┘
                         │ Clear session
                         ↓
                    ┌──────────┐
                    │ LOGIN    │
                    │ /login   │
                    └──────────┘
```

---

## Error Handling Flow

```
User Action
    │
    ↓
Request to Backend
    │
    ↓
Route Handler Receives Request
    │
    ├─ Input Validation Failed?
    │  │ YES → Return 400 Bad Request
    │  │       {error: "validation message"}
    │  │
    │  NO → Continue
    │
    ├─ Authentication Required but User Not Logged In?
    │  │ YES → Return 401 Unauthorized
    │  │       {error: "Login required"}
    │  │
    │  NO → Continue
    │
    ├─ Database Error?
    │  │ YES → Return 500 Internal Server Error
    │  │       {error: "Database error"}
    │  │
    │  NO → Continue
    │
    ├─ External API Error (OpenRouter)?
    │  │ YES → Return 503 Service Unavailable
    │  │       {reply: "Service temporarily unavailable"}
    │  │
    │  NO → Continue
    │
    ├─ File Processing Error?
    │  │ YES → Return 400/500
    │  │       {error: "Could not parse file"}
    │  │
    │  NO → Continue
    │
    ↓
Success Response → Return 200 OK
                   {data: results}
    │
    ↓
Frontend Receives Response
    │
    ├─ Status 200-299?
    │  │ YES → Display data
    │  │
    │  NO → Display error message
    │
    ↓
User Sees Result
```

---

## Caching & Performance Optimization

```
BROWSER CACHING
├─ Static CSS files (v=1 versioning)
├─ Static JS files (v=1 versioning)
├─ Font resources (Google Fonts)
├─ Icon resources (Font Awesome CDN)
└─ Session cookies (30 days if "Remember me")

DATABASE OPTIMIZATION
├─ Indexes on: email, username, user_id
├─ Lazy-loaded relationships
├─ Query result caching (session-level)
└─ Connection pooling (SQLAlchemy)

API OPTIMIZATION
├─ No caching for analyses (real-time)
├─ Request batching for chat history
├─ Rate limiting on file uploads (10MB)
└─ Timeout on external API calls (30s)
```

---

## Security Architecture

```
AUTHENTICATION LAYER
├─ Password hashing (Werkzeug generate_password_hash)
├─ Session management (Flask-Login)
├─ CSRF protection (Flask-WTF)
└─ Secure cookies (HTTPOnly, SameSite)

DATA VALIDATION
├─ Email format validation
├─ Password length requirements (min 8)
├─ File type whitelisting
├─ File size limits
└─ Input sanitization

TOKEN MANAGEMENT
├─ Remember tokens (secrets.token_urlsafe)
├─ Reset tokens (secrets.token_urlsafe)
├─ Verification tokens (secrets.token_urlsafe)
└─ Token expiration (time-based)

API SECURITY
├─ Bearer token auth (OpenRouter)
├─ Environment variables (API keys)
├─ HTTPS ready (production)
└─ CORS headers (if needed)
```

---

This architecture ensures scalability, security, and optimal performance for the CampusSpeak AI application.
