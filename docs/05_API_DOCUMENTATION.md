# 📚 API Documentation

## Overview

The CampusSpeak AI provides a comprehensive REST API for frontend-backend communication. All endpoints use JSON for request/response bodies.

---

## Base URL

```
http://localhost:5000
```

### Headers
All POST requests should include:
```
Content-Type: application/json
```

### Authentication
Some endpoints require user authentication via Flask-Login. The app uses secure session cookies.

---

## 🔐 Authentication Endpoints

### 1. Login

**Endpoint:** `POST /login`

**Purpose:** Authenticate user with email and password

**Request Body:**
```json
{
    "email": "user@example.com",
    "password": "password123",
    "remember_me": true
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| email | string | Yes | User email address (lowercase) |
| password | string | Yes | User password |
| remember_me | boolean | No | 30-day remember token (default: false) |

**Response - Success (200):**
```json
{
    "success": true,
    "message": "Login successful"
}
```

**Response - Error (401):**
```json
{
    "error": "Invalid email or password"
}
```

**Response - Error (400):**
```json
{
    "error": "Email and password required"
}
```

**Logic:**
1. Validate email and password are provided
2. Query User table by email
3. Check password hash match
4. Update last_login timestamp
5. Create Flask session
6. Store remember token if requested

**Frontend Usage:**
```javascript
const response = await fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        email: 'user@example.com',
        password: 'password123',
        remember_me: true
    })
});
const data = await response.json();
if (data.success) {
    window.location.href = '/app';
}
```

---

### 2. Register

**Endpoint:** `POST /register`

**Purpose:** Create new user account

**Request Body:**
```json
{
    "email": "newuser@example.com",
    "username": "newuser",
    "full_name": "New User",
    "password": "securepass123"
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| email | string | Yes | User email (must be unique) |
| username | string | Yes | Username (must be unique, no spaces) |
| full_name | string | Yes | User's full name |
| password | string | Yes | Min 8 characters |

**Response - Success (201):**
```json
{
    "success": true,
    "message": "Registration successful! Please verify your email."
}
```

**Response - Error (400):**
```json
{
    "error": "All fields required"
}
// or
{
    "error": "Password must be at least 8 characters"
}
```

**Response - Error (409):**
```json
{
    "error": "Email already registered"
}
// or
{
    "error": "Username already taken"
}
```

**Validations:**
- All fields must be provided
- Email must be valid format
- Username must be unique
- Email must be unique
- Password minimum 8 characters

**Database Operations:**
1. Create User record
2. Hash password
3. Generate verification token (24hr expiry)
4. Save to database

---

### 3. Logout

**Endpoint:** `GET /logout` or `POST /logout`

**Purpose:** Clear user session and logout

**Authentication:** Required (login_required)

**Response - Always (302 Redirect):**
```
Redirects to: /login
```

**Logic:**
1. Call logout_user() from Flask-Login
2. Clear session
3. Redirect to login page

---

### 4. Forgot Password

**Endpoint:** `POST /forgot-password`

**Purpose:** Request password reset token

**Request Body:**
```json
{
    "email": "user@example.com"
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| email | string | Yes | User email address |

**Response - Always (200):**
```json
{
    "success": true,
    "message": "Password reset link sent to email"
}
```

**Note:** Response always shows success for security (doesn't confirm email exists)

**Backend Logic:**
1. Find user by email
2. Generate reset token (1hr expiry)
3. TODO: Send reset email with token
4. Return success

---

### 5. Reset Password

**Endpoint:** `POST /reset-password`

**Purpose:** Reset password with valid token

**Request Body:**
```json
{
    "token": "reset_token_from_email",
    "new_password": "newpassword123"
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| token | string | Yes | Reset token from email |
| new_password | string | Yes | New password (min 8 chars) |

**Response - Success (200):**
```json
{
    "success": true,
    "message": "Password reset successful"
}
```

**Response - Error (400):**
```json
{
    "error": "Password must be at least 8 characters"
}
// or
{
    "error": "Invalid reset token"
}
// or
{
    "error": "Reset token expired"
}
```

**Validations:**
- Token must be valid
- Token must not be expired (1 hour)
- Password must be 8+ characters

---

## 📊 Analysis Endpoints

### 1. Analyze Speech

**Endpoint:** `POST /analyze`

**Purpose:** Analyze recorded speech and return metrics

**Authentication:** Not required (for demo access)

**Request Body:**
```json
{
    "text": "I mean, uh, this presentation is about public speaking skills...",
    "duration": 45.5
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| text | string | Yes | Transcribed speech text |
| duration | number | Yes | Recording duration in seconds |

**Response - Success (200):**
```json
{
    "word_count": 87,
    "wpm": 115,
    "filler_count": 2,
    "filler_details": {
        "like": 1,
        "uh": 1
    },
    "clarity": 87,
    "pace": "Good",
    "duration": 45.5,
    "suggestions": [
        "Great job avoiding filler words! Keep it up.",
        "Your pace is near-perfect for audience engagement.",
        "Your speech is clean and well-paced."
    ]
}
```

**Response Fields:**
| Field | Type | Description |
|-------|------|-------------|
| word_count | int | Total words spoken |
| wpm | int | Words per minute |
| filler_count | int | Total filler words detected |
| filler_details | object | Breakdown by filler word type |
| clarity | int | 0-100 clarity score |
| pace | string | "Good" / "Too Fast" / "Too Slow" / "N/A" |
| duration | number | Recording duration (seconds) |
| suggestions | string[] | Personalized coaching tips |

**Analysis Logic:**
```
1. Split text into words
2. Calculate WPM = (word_count / duration) * 60
3. Count filler words using regex
4. Calculate clarity = 100 - (filler_ratio * 500) - pace_penalty
5. Determine pace based on WPM ranges
6. Generate contextual suggestions
```

**Filler Words Detected:**
```
um, uh, like, you know, basically, actually, literally, so,
well, right, I mean, kind of, sort of, you see
```

**WPM Ranges:**
- **< 100 WPM:** Too Slow (penalty)
- **100-150 WPM:** Good (optimal)
- **150-170 WPM:** Slightly Fast
- **> 170 WPM:** Too Fast (penalty)

**Clarity Calculation:**
- Base: 100
- Filler penalty: (filler_count / word_count) * 500
- Speed penalty: 15 if WPM > 180
- Speed penalty: 10 if WPM < 100

---

### 2. Chat / AI Feedback

**Endpoint:** `POST /chat`

**Purpose:** Get AI coaching feedback and answer questions

**Authentication:** Not required (for demo access)

**Request Body:**
```json
{
    "message": "How can I improve my speaking pace?",
    "context": {
        "isRecording": true,
        "wpm": 120,
        "clarity": 85,
        "fillers": 3
    },
    "history": [
        {
            "role": "user",
            "content": "How am I doing so far?"
        },
        {
            "role": "assistant",
            "content": "You're doing great! Your pace is perfect."
        }
    ]
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| message | string | Yes | User question/message (max 1000 chars) |
| context | object | No | Current session metrics |
| history | array | No | Previous messages (max 10 maintained) |

**Context Object:**
| Field | Type | Description |
|-------|------|-------------|
| isRecording | bool | Currently recording? |
| wpm | number | Current WPM |
| clarity | number | Current clarity score |
| fillers | number | Current filler count |

**History Array Items:**
```json
{
    "role": "user" or "assistant",
    "content": "Message text"
}
```

**Response - Success (200):**
```json
{
    "reply": "Great question! To improve your speaking pace, try: 1) Practice pausing between sentences, 2) Speak from your diaphragm, 3) Use strategic silences for emphasis."
}
```

**Response - Error (400):**
```json
{
    "error": "Message is required"
}
```

**Response - Providers Missing (200 with fallback):**
```json
{
    "reply": "No AI provider configured. Please set GEMINI_API_KEY or OPENROUTER_API_KEY in your .env file."
}
```

**AI Coach Characteristics:**
- **Name:** Zoiee
- **Personality:** Friendly, encouraging, supportive
- **Responses:** 2-3 sentences max
- **Format:** No markdown formatting
- **Focus:** Public speaking and presentations
- **Primary Model:** Gemini 2.0 Flash
- **Fallback Model:** Nvidia Nemotron 3 Super 120B (via OpenRouter)

**System Prompt:**
```
You are Zoiee, a friendly and encouraging CampusSpeak AI coach robot.
You help users improve their public speaking and presentation skills.
Keep responses concise (2-3 sentences max).
Use a warm, supportive tone.
When given speech metrics (WPM, clarity, filler words), provide specific,
actionable advice.
If the user asks something unrelated to presentations,
gently steer back to coaching.
Never use markdown formatting in responses.
```

---

## 📁 File Import Endpoint

### Import File

**Endpoint:** `POST /import-file`

**Purpose:** Upload and parse presentation files

**Authentication:** Not required (for demo access)

**Request:**
- **Method:** POST
- **Content-Type:** multipart/form-data
- **Form Data:** 
```
file: [binary file data]
```

**Supported File Types:**
| Extension | Parser | Max Size |
|-----------|--------|----------|
| .txt | Text read | 10 MB |
| .pdf | PyPDF2 | 10 MB |
| .docx | python-docx | 10 MB |
| .ppt | python-pptx | 10 MB |
| .pptx | python-pptx | 10 MB |

**Request Example (JavaScript):**
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('/import-file', {
    method: 'POST',
    body: formData
});
const data = await response.json();
console.log(data.text); // Extracted text
```

**Response - Success (200):**
```json
{
    "text": "Slide 1: Introduction to AI\n\nThis presentation covers...\n\n--- Slide 2 ---\nAI Applications..."
}
```

**Response - Error (400):**
```json
{
    "error": "No file uploaded"
}
// or
{
    "error": "Empty filename"
}
// or
{
    "error": "Legacy .doc files are not supported. Please convert to .docx first."
}
// or
{
    "error": "Unsupported file type: .xyz"
}
// or
{
    "error": "File too large (max 10 MB)"
}
```

**Response - Error (500):**
```json
{
    "error": "Failed to parse file: [error details]"
}
```

**File Processing Logic:**
1. Check file exists
2. Validate file extension
3. Check file size (< 10 MB)
4. Reject .doc files (recommend .docx)
5. Read file binary
6. Parse based on type:
   - **.txt:** Direct text read
   - **.pdf:** Extract text from all pages
   - **.docx:** Extract all paragraph text
   - **.pptx:** Extract text from all slides with slide markers
7. Return extracted text

**PowerPoint Output Format:**
```
--- Slide 1 ---
[text from slide 1]

--- Slide 2 ---
[text from slide 2]
```

---

## 👤 User Profile Endpoint

### Get Profile

**Endpoint:** `GET /profile`

**Purpose:** Get current authenticated user's profile

**Authentication:** Required (login_required)

**Response - Success (200):**
```json
{
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "full_name": "John Doe",
    "email_verified": true,
    "two_fa_enabled": false,
    "created_at": "2026-03-01T10:30:00",
    "last_login": "2026-03-16T05:14:55"
}
```

**Response Fields:**
| Field | Type | Description |
|-------|------|-------------|
| id | int | User ID |
| username | string | Username |
| email | string | Email address |
| full_name | string | User's full name |
| email_verified | bool | Email verified status |
| two_fa_enabled | bool | Two-factor auth enabled |
| created_at | string | ISO timestamp of account creation |
| last_login | string | ISO timestamp of last login |

**Response - Not Authenticated (401):**
Redirects to login page (handled by @login_required decorator)

---

## 🏠 Dashboard Endpoint

### Get Dashboard

**Endpoint:** `GET /app`

**Purpose:** Serve main presentation coach interface

**Authentication:** Required (login_required)

**Response - Success (200):**
HTML content (index.html rendered with Jinja2)

**Response - Not Authenticated (302 Redirect):**
Redirects to `/login` with message: "Please log in to access this page"

---

## 🏠 Other Endpoints

### Home / Root

**Endpoint:** `GET /`

**Purpose:** Redirect to login

**Response:** 302 Redirect to `/login`

---

## 🔄 Error Handling

### Standard Error Response Format
```json
{
    "error": "Error message describing what went wrong"
}
```

### HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | Successful request |
| 201 | Created | User registered successfully |
| 302 | Redirect | Redirect to login/home |
| 400 | Bad Request | Missing required fields |
| 401 | Unauthorized | Invalid credentials or not logged in |
| 409 | Conflict | Email/username already exists |
| 500 | Server Error | Database or processing error |
| 503 | Service Unavailable | External API unreachable |

---

## 🔑 Security Considerations

### API Security
1. **Authentication:** Flask-Login with secure sessions
2. **Password Storage:** Werkzeug password hashing
3. **CSRF Protection:** Flask-WTF tokens
4. **Rate Limiting:** Monitor for abuse
5. **API Keys:** Stored in environment variables
6. **Input Validation:** All inputs validated
7. **File Upload Security:** Extension and size validation

### Best Practices
- Never expose sensitive data in JSON responses
- Always validate user input
- Use HTTPS in production
- Implement rate limiting
- Monitor API usage
- Keep API keys secure
- Log security events

---

## 📌 Example Workflows

### Complete User Journey

```bash
# 1. User logs in
POST /login
Request: {email, password, remember_me}
Response: {success: true}

# 2. Get user profile
GET /profile
Response: {id, username, email, ...}

# 3. Import presentation file
POST /import-file
Request: FormData {file}
Response: {text: "..."}

# 4. Analyze speech
POST /analyze
Request: {text: "...", duration: 45.5}
Response: {wpm, clarity, suggestions, ...}

# 5. Get AI feedback
POST /chat
Request: {message: "How can I improve?", context: {wpm, clarity, ...}}
Response: {reply: "Great question..."}

# 6. Logout
GET /logout
Response: Redirect to /login
```

---

## 🚀 API Testing Tools

### Using Curl
```bash
# Login
curl -X POST http://localhost:5000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Analyze speech
curl -X POST http://localhost:5000/analyze \
  -H "Content-Type: application/json" \
  -d '{"text":"I mean uh this is a test","duration":10.5}'

# Chat
curl -X POST http://localhost:5000/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"How am I doing?"}'
```

### Using Postman
1. Import endpoints into Postman collection
2. Set environment variables for `base_url`, `email`, `password`
3. Use pre-request scripts to handle authentication
4. Test each endpoint sequentially

### Using Python Requests
```python
import requests

session = requests.Session()

# Login
response = session.post('http://localhost:5000/login', json={
    'email': 'test@example.com',
    'password': 'password123'
})

# Analyze
response = session.post('http://localhost:5000/analyze', json={
    'text': 'I mean this is a test',
    'duration': 10.5
})
print(response.json())
```

---

For more information, see other documentation files in the `/docs` folder.
