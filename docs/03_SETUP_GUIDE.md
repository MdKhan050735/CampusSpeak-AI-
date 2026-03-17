# 🚀 Setup & Installation Guide

## Prerequisites

Before starting, ensure you have the following installed:

- **Python 3.8+** — Download from [python.org](https://www.python.org/downloads/)
- **Git** — For version control (optional)
- **pip** — Python package manager (included with Python)
- **Modern Web Browser** — Chrome, Edge, or Firefox recommended

---

## Step-by-Step Installation

### Step 1: Clone or Download Project

#### Option A: Using Git
```bash
git clone https://github.com/your-repo/presentation_coach.git
cd presentation_coach
```

#### Option B: Manual Download
1. Download the project folder
2. Extract to your desired location
3. Open terminal/command prompt in the project directory

---

### Step 2: Create Virtual Environment

A virtual environment isolates project dependencies from your system Python.

#### Windows
```bash
# Create virtual environment
python -m venv venv

# Activate it
.\venv\Scripts\activate
```

#### Mac/Linux
```bash
# Create virtual environment
python3 -m venv venv

# Activate it
source venv/bin/activate
```

**You should see `(venv)` prefix in your terminal after activation.**

---

### Step 3: Install Dependencies

With the virtual environment activated, install all required packages:

```bash
pip install -r requirements.txt
```

**Expected output:** Multiple packages installing (Flask, SQLAlchemy, PyPDF2, etc.)

---

### Step 4: Set Up Environment Variables

Create a `.env` file in the project root:

```bash
# Windows
type nul > .env

# Mac/Linux
touch .env
```

Edit `.env` and add:

```env
# Required for Flask
SECRET_KEY=your_random_secret_key_here_min_32_chars

# Required for AI coaching (primary - get from Google AI Studio)
GEMINI_API_KEY=your_gemini_api_key_here

# Optional fallback provider (get from OpenRouter.ai)
OPENROUTER_API_KEY=your_openrouter_api_key_here

# Optional configuration
FLASK_ENV=development
FLASK_DEBUG=true
PORT=5000
```

### Getting API Keys

#### Gemini API Key (Primary)
1. Visit [aistudio.google.com](https://aistudio.google.com)
2. Sign in with your Google account
3. Create an API key
4. Copy your API key to `GEMINI_API_KEY` in `.env`

#### OpenRouter API Key (Optional Fallback)
1. Visit [openrouter.ai](https://openrouter.ai)
2. Sign up for free account
3. Go to API keys section
4. Copy your API key to `OPENROUTER_API_KEY` in `.env`

#### Flask Secret Key
Generate a secure random key:
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```
Copy the output to `SECRET_KEY` in `.env`

---

### Step 5: Initialize Database

The database creates automatically on first run, but you can pre-initialize it:

```bash
python
```

Then in Python shell:
```python
from app import app, db

with app.app_context():
    db.create_all()
    print("Database initialized!")
```

Exit with `exit()` or `Ctrl+D`

---

### Step 6: Run the Application

```bash
python app.py
```

**Expected output:**
```
 * Serving Flask app 'app'
 * Debug mode: on
 * Running on http://127.0.0.1:5000
 * Press CTRL+C to quit
```

---

### Step 7: Access the Application

1. Open your web browser
2. Navigate to **http://127.0.0.1:5000**
3. You should see the **Login Page** with animated background

---

## 🎯 First-Time User Setup

### Create a Test User

You have two options:

#### Option 1: Via Demo Button
1. On login page, click **"Try Demo"** button
2. Goes directly to app without authentication

#### Option 2: Manual Database Entry

Open Python shell in project directory:

```python
from app import app, db
from models import User

with app.app_context():
    # Check if user exists
    user = User.query.filter_by(email='test@example.com').first()
    
    if not user:
        # Create new user
        user = User(
            email='test@example.com',
            username='testuser',
            full_name='Test User',
            email_verified=True
        )
        user.set_password('password123')  # min 8 chars
        
        db.session.add(user)
        db.session.commit()
        print("User created successfully!")
    else:
        print("User already exists!")
```

**Login Credentials:**
- Email: `test@example.com`
- Password: `password123`

---

## 📁 Project Structure After Installation

```
presentation_coach/
├── app.py                      # Main Flask application
├── models.py                   # Database models
├── requirements.txt            # Python dependencies
├── .env                        # Environment variables (you created)
├── .gitignore
│
├── static/                     # Static files (not processed)
│   ├── css/
│   │   ├── login.css
│   │   ├── style.css
│   │   └── style_backup.css
│   ├── js/
│   │   ├── login.js
│   │   └── script.js
│   └── assets/
│
├── templates/                  # HTML templates (Jinja2)
│   ├── login.html
│   ├── index.html
│   └── h1.html
│
├── instance/                   # Instance folder (created at runtime)
│   └── presentation_coach.db   # SQLite database
│
├── venv/                       # Virtual environment (created by you)
│   ├── Scripts/
│   ├── Lib/
│   └── pyvenv.cfg
│
└── docs/                       # Documentation (you're reading this!)
    ├── 01_PROJECT_OVERVIEW.md
    ├── 02_TECH_STACK.md
    ├── 03_SETUP_GUIDE.md
    ├── 04_ARCHITECTURE_FLOW.md
    ├── 05_API_DOCUMENTATION.md
    └── 06_USER_GUIDE.md
```

---

## 🧪 Verification Checklist

After setup, verify everything is working:

- [ ] Virtual environment activated (see `(venv)` in terminal)
- [ ] Dependencies installed (`pip list` shows all packages)
- [ ] `.env` file created with API keys
- [ ] Database initialized (no errors on `python app.py`)
- [ ] Flask app running on http://127.0.0.1:5000
- [ ] Login page loads with animated background
- [ ] Can view source code without errors

---

## ⚠️ Troubleshooting

### Issue: `ModuleNotFoundError: No module named 'flask'`

**Solution:** Virtual environment not activated or dependencies not installed
```bash
# Activate venv
.\venv\Scripts\activate  # Windows
source venv/bin/activate # Mac/Linux

# Install dependencies
pip install -r requirements.txt
```

---

### Issue: `ModuleNotFoundError: No module named 'dotenv'`

**Solution:** Reinstall requirements
```bash
pip install --upgrade pip
pip install -r requirements.txt --force-reinstall
```

---

### Issue: Port 5000 already in use

**Solution 1:** Stop the process using port 5000
```bash
# Windows
netstat -ano | findstr :5000

# Kill the process (replace PID with the actual ID)
taskkill /PID <PID> /F
```

**Solution 2:** Use different port
```bash
# In .env, change:
PORT=5001

# Then run:
python app.py
```

---

### Issue: `OPENROUTER_API_KEY not found`

**Solution:** 
1. Make sure `.env` file exists in project root
2. Add valid API key: `OPENROUTER_API_KEY=sk-xxx...`
3. Restart Flask app
4. Only AI chat features will be disabled without this

---

### Issue: Database locked error

**Solution:**
```bash
# Remove old database
rm instance/presentation_coach.db

# Restart Flask - new database will be created
python app.py
```

---

## 🔄 Running After Initial Setup

Every time you want to run the project:

```bash
# 1. Navigate to project directory
cd presentation_coach

# 2. Activate virtual environment
.\venv\Scripts\activate  # Windows
# or
source venv/bin/activate # Mac/Linux

# 3. Run the app
python app.py

# 4. Open browser to http://127.0.0.1:5000
```

---

## 🛑 Stopping the Application

In your terminal, press:
```
Ctrl + C
```

This will gracefully shutdown the Flask development server.

---

## 📝 Quick Reference Commands

| Command | Purpose |
|---------|---------|
| `python app.py` | Start Flask development server |
| `pip install -r requirements.txt` | Install all dependencies |
| `python` | Open Python interactive shell |
| `pip list` | Show installed packages |
| `pip freeze` | Show installed packages with versions |
| `deactivate` | Exit virtual environment |
| `python -m pytest` | Run tests (if available) |

---

## 🌍 For Production Deployment

When you're ready to deploy:

1. **Use Gunicorn** instead of Flask dev server
   ```bash
   pip install gunicorn
   gunicorn -w 4 app:app
   ```

2. **Use PostgreSQL** instead of SQLite
   ```env
   SQLALCHEMY_DATABASE_URI=postgresql://user:password@localhost/presentation_coach
   ```

3. **Use environment variables** from your hosting provider
   - Don't commit `.env` to Git
   - Set variables in production dashboard

4. **Use HTTPS** with SSL certificates

See `02_TECH_STACK.md` for more production recommendations.

---

## ✅ Setup Complete!

You're all set! Proceed to `04_ARCHITECTURE_FLOW.md` to understand how the application works internally.

For user guide, see `06_USER_GUIDE.md`.
