# 👥 User Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [Login Page](#login-page)
3. [Main Dashboard](#main-dashboard)
4. [Recording & Analysis](#recording--analysis)
5. [AI Coach Feedback](#ai-coach-feedback)
6. [Teleprompter Mode](#teleprompter-mode)
7. [File Import](#file-import)
8. [Settings & Profile](#settings--profile)
9. [Tips & Best Practices](#tips--best-practices)

---

## 🚀 Getting Started

### First-Time Access

1. **Open your browser** and navigate to:
   ```
   http://127.0.0.1:5000
   ```

2. **You'll see the Login Page** with:
   - Animated background with particle effects
   - Email and password input fields
   - "Remember me" checkbox
   - Sign In button
   - Try Demo button

### Login Options

#### Option A: Sign In with Credentials
```
Email: test@example.com
Password: password123
```
Click **Sign In** → Redirects to main app

#### Option B: Try Demo (No Login Required)
Click **Try Demo** button → Direct access to main app without authentication

---

## 🔐 Login Page

### Features

**Email Input**
- Accepts valid email format
- Auto-validated on blur
- Placeholder: `you@example.com`

**Password Input**
- Shows/hides password with eye icon toggle
- Auto-validated on blur
- Minimum 6 characters

**Remember Me Checkbox**
- Optional
- If checked: Session extends to 30 days
- Stores secure token in browser

**Sign In Button**
- Disabled until both fields are valid
- Shows loading spinner during submission
- Displays error messages if login fails

**Try Demo Button**
- Skips authentication
- Perfect for quick testing
- Suitable for presentations

### Error Messages

```
❌ "Email is required" — Email field empty
❌ "Invalid email address" — Email format wrong
❌ "Password is required" — Password field empty
❌ "Password must be at least 6 characters" — Password too short
❌ "Invalid email or password" — Credentials don't match
❌ "Connection error. Please try again." — Server not responding
```

### Visual Feedback

- **Animated Background:** Particle effects follow your cursor
- **Loading Indicator:** Spinner shows during authentication
- **Success Message:** Green confirmation on successful login
- **Error Alert:** Red error message display

---

## 🎯 Main Dashboard

### Dashboard Sections

```
┌─────────────────────────────────────────────────────────┐
│  CAMPUSSPEAK AI - Main Dashboard                 │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────────┐        ┌────────────────────┐ │
│  │  HEADER              │        │  USER MENU         │ │
│  │  • App Title         │        │  • Profile         │ │
│  │  • Navigation        │        │  • Settings        │ │
│  │                      │        │  • Logout          │ │
│  └──────────────────────┘        └────────────────────┘ │
│                                                          │
│  ┌─────────────────────────────────────────────────────┐ │
│  │  MAIN CONTENT AREA                                  │ │
│  │                                                      │ │
│  │  Tab 1: RECORDING & ANALYSIS                        │ │
│  │  - Microphone button to start recording             │ │
│  │  - Real-time transcription display                  │ │
│  │  - Live metrics tracking                            │ │
│  │  - Analysis results                                 │ │
│  │  - Filler word highlighting                         │ │
│  │                                                      │ │
│  │  Tab 2: CHAT WITH ZOIEE (AI Coach)                  │ │
│  │  - Chat message input                               │ │
│  │  - Conversation history                             │ │
│  │  - Zoiee avatar responses                           │ │
│  │                                                      │ │
│  │  Tab 3: TELEPROMPTER                                │ │
│  │  - Script text display                              │ │
│  │  - Progress tracking                                │ │
│  │  - Font size controls                               │ │
│  │                                                      │ │
│  │  Tab 4: IMPORT SCRIPT                               │ │
│  │  - File upload area                                 │ │
│  │  - Supported formats (.pdf, .docx, .pptx)           │ │
│  │  - Extracted text preview                           │ │
│  │                                                      │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌─────────────────────────────────────────────────────┐ │
│  │  SIDEBAR / METRICS PANEL                            │ │
│  │  • Current WPM                                      │ │
│  │  • Clarity Score                                    │ │
│  │  • Filler Words Count                               │ │
│  │  • Session Duration                                 │ │
│  │                                                      │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                          │ 
└─────────────────────────────────────────────────────────┘
```

### Key UI Elements

**Microphone Button**
- Click to start recording
- Changes to "Stop Recording" after started
- Red indicator shows active recording

**Transcription Area**
- Shows real-time speech-to-text
- Filler words highlighted in orange/red
- Auto-scrolls with new content
- Editable before submitting

**Metrics Panel**
- **WPM:** Words per minute (target: 120-150)
- **Clarity:** 0-100 score (higher is better)
- **Filler Words:** Count and breakdown
- **Duration:** Recording time in seconds

**Chat Interface**
- Message input at bottom
- Conversation scrolls up
- Zoiee responses in distinct styling

---

## 🎙️ Recording & Analysis

### Step-by-Step Recording Process

#### Step 1: Click Microphone Button
```
Status: Ready to record
Button shows: "Click to Record"
```

#### Step 2: Allow Browser Permissions
```
Browser asks: "Allow access to microphone?"
Click: "Allow" or "Allow and remember"
```

#### Step 3: Start Speaking
```
Live transcription appears as you speak
Filler words highlighted automatically
Duration timer running in background
```

#### Step 4: Stop Recording
```
Click "Stop Recording" button
OR wait for automatic timeout
```

#### Step 5: Review Results
```
Metrics calculated and displayed:
• Exact WPM and pace rating
• Clarity percentage
• Filler word breakdown
• Personalized suggestions
```

### Recording Tips

**Optimal Settings**
- Quiet environment (minimize background noise)
- Clear microphone (test before recording)
- Normal speaking volume
- Natural pace and tone

**Best Results**
- Record at least 30 seconds for meaningful analysis
- Speak as you would in actual presentation
- Use natural pauses (not filler words)
- Vary your tone and pace

**Common Issues**

| Issue | Solution |
|-------|----------|
| "Microphone not detected" | Check browser permissions, plug in microphone |
| "Transcription incomplete" | Speak more clearly, louder volume |
| "No audio captured" | Allow microphone permission, try again |
| "Analysis takes long" | Wait - processing may take 1-2 seconds |

### Interpreting Results

**WPM (Words Per Minute)**
- **< 100:** Too slow (loses audience attention)
- **100-150:** ✅ **GOOD** (optimal range)
- **150-170:** Slightly fast (still acceptable)
- **> 170:** Too fast (hard to follow)

**Clarity Score (0-100)**
- **90-100:** Excellent (very clean speech)
- **75-89:** Good (acceptable for presentation)
- **60-74:** Fair (filler words detected)
- **< 60:** Poor (many filler words or irregular pace)

**Filler Word Detection**
Common filler words detected:
```
um, uh, like, you know, basically, actually,
literally, so, well, right, I mean, kind of,
sort of, you see
```

**Suggestions**
- Actionable coaching tips
- Specific improvements recommended
- Based on your unique metrics
- Progressive difficulty

### Sample Analysis Results

```json
{
    "word_count": 156,
    "wpm": 124,
    "filler_count": 2,
    "filler_details": {
        "like": 1,
        "um": 1
    },
    "clarity": 88,
    "pace": "Good",
    "duration": 75.5,
    "suggestions": [
        "Excellent pace! You're right in the sweet spot at 124 WPM.",
        "Only 2 filler words detected - fantastic job!",
        "Your clarity score is 88/100 - very clean speaking!",
        "Keep practicing this level of precision!"
    ]
}
```

---

## 💬 AI Coach Feedback

### Zoiee - Your AI Coach

Meet **Zoiee** - your friendly CampusSpeak AI coach! She's here to:
- Provide personalized coaching
- Answer your presentation questions
- Give real-time feedback
- Build your confidence

### Using the Chat Interface

#### Starting a Conversation

1. **Open Chat Tab** in the dashboard
2. **Type your question** in the message input:
   ```
   "How can I improve my pace?"
   "What's causing these filler words?"
   "Tips for better clarity?"
   ```
3. **Press Enter** or click **Send**
4. **Wait for Zoiee's response** (1-2 seconds)

#### Chat Features

**Context-Aware Responses**
- Zoiee knows your current metrics
- References your WPM, clarity, filler words
- Tailors advice to your performance

**Conversation History**
- Previous messages shown in the chat
- See full context of discussions
- Up to 10 messages maintained

**Real-Time Metrics**
- If recording during chat:
  - Zoiee sees live metrics
  - Provides real-time coaching
  - Adjusts advice based on performance

### Example Conversations

**Conversation 1: Pace Issues**
```
You: "I'm speaking too fast, what should I do?"

Zoiee: "Great self-awareness! Your current WPM is 165, 
which is slightly above the optimal 120-150 range. 
Try these techniques: add strategic pauses between 
sentences, speak from your diaphragm, and practice 
with a metronome. Record again to see improvement!"
```

**Conversation 2: Filler Word Help**
```
You: "I keep using 'like' too much"

Zoiee: "You're identified 3 instances of 'like' in your 
last recording. A great technique is to replace filler 
words with purposeful pauses. When you feel like saying 
'like,' take a breath instead. This also gives your 
audience time to absorb your message!"
```

**Conversation 3: General Tips**
```
You: "Any overall tips for me?"

Zoiee: "You're doing fantastic! Your clarity is 88/100 
and your pace is perfect. For your next session, focus 
on reducing those filler words by 50%. Practice makes 
perfect - keep recording!"
```

### Zoiee's Personality

- **Tone:** Warm, encouraging, supportive
- **Response Length:** 2-3 sentences (concise)
- **Focus:** Public speaking and presentations only
- **Expertise:** Speech analysis and coaching
- **Goals:** Build confidence and improve skills

### Tips for Best Results

1. **Ask Specific Questions**
   - Instead of: "How am I doing?"
   - Try: "Why am I using so many filler words?"

2. **Reference Metrics**
   - "My WPM is 165, how can I slow down?"
   - Helps Zoiee give targeted advice

3. **Request Specific Tips**
   - "Give me 3 tips to improve clarity"
   - "How do I handle nervousness?"

4. **Practice & Follow Up**
   - Record → Analyze → Chat → Record again
   - Track your improvement over time

---

## 📝 Teleprompter Mode

### What is Teleprompter?

A tool to:
- Practice presentations while following your script
- Track progress through presentation
- Maintain eye contact (with script visible)
- Get comfortable with content flow

### How to Use

#### Step 1: Import Your Script
```
1. Click "Import Script" tab
2. Upload .pdf, .docx, or .pptx file
3. Text automatically extracted and displayed
4. Click "Load into Teleprompter"
```

#### Step 2: Start Teleprompter
```
1. Click "Start Teleprompter" button
2. Full-screen mode activates
3. Script displayed in large, easy-to-read text
4. Progress bar shows your position
```

#### Step 3: Practice with Script
```
1. Read from the teleprompter
2. Progress bar follows your reading
3. Click next section or scroll to advance
4. Can pause anytime
```

#### Step 4: Paired with Recording
```
1. Start recording simultaneously
2. Practice while being analyzed
3. Get metrics + script guidance
4. Review results after
```

### Teleprompter Features

**Font Size Control**
- Increase/decrease text size
- Supports accessibility needs
- Easy on the eyes

**Progress Tracking**
- Visual progress bar
- Percentage completion
- Current section highlight

**Full-Screen Mode**
- Minimal distractions
- Large readable text
- Easy navigation controls

**Keyboard Controls**
- **Space:** Next section
- **Backspace:** Previous section
- **Esc:** Exit full-screen

### Tips for Effective Practice

1. **Read Naturally**
   - Don't just read words
   - Practice intonation and pacing
   - Look at audience, not screen

2. **Use Marking**
   - Add emphasis notes to script
   - Bold important points
   - Mark pauses in text

3. **Progressive Training**
   - Session 1: Just read
   - Session 2: Check metrics
   - Session 3: Record + analyze

4. **Multiple Runs**
   - Record multiple takes
   - Compare results
   - Track improvement

---

## 📁 File Import

### Supported Formats

| Format | Use Case | Max Size |
|--------|----------|----------|
| **.txt** | Plain text scripts | 10 MB |
| **.pdf** | Presentation slides | 10 MB |
| **.docx** | Word documents | 10 MB |
| **.pptx** | PowerPoint slides | 10 MB |
| **.ppt** | PowerPoint 97-2003 | 10 MB |

**❌ NOT Supported:** `.doc` (legacy Word) - convert to `.docx`

### How to Import

#### Step 1: Navigate to Import
```
Click "Import Script" tab in dashboard
```

#### Step 2: Select File
```
Click upload area or drag-and-drop file
Browser opens file picker
Select your presentation file
```

#### Step 3: Wait for Processing
```
File uploads and processes
Shows "Extracting text..."
Processing time: 1-5 seconds (depending on file size)
```

#### Step 4: Review Extracted Text
```
Text appears in editor
Can edit/modify content
Copy or save as needed
```

#### Step 5: Load to Teleprompter
```
Click "Load to Teleprompter"
Text ready for practice
OR continue editing first
```

### Tips for File Import

**Best Practices**
- ✅ Use clean, well-formatted documents
- ✅ Ensure text is readable (not image-based)
- ✅ Use simple fonts for clarity
- ✅ Organize content logically

**Avoid Issues**
- ❌ Scanned PDFs (image-based, not text)
- ❌ Extremely complex formatting
- ❌ Multiple columns or nested tables
- ❌ Files > 10 MB

**Optimization**
- For PDFs: Ensure they're text-based, not scanned images
- For PowerPoint: Use "Export as PDF" then import if issues
- For DOCX: Save in modern format (2016+)
- Test small file first

### File Processing Examples

**Text File (.txt)**
```
Input:
Introduction to AI
AI is transforming the world...
Benefits:
1. Automation
2. Efficiency

Output:
[Same text extracted cleanly]
```

**PowerPoint (.pptx)**
```
Input:
[Slide 1: Title]
[Slide 2: Content]
[Slide 3: Bullet points]

Output:
--- Slide 1 ---
Title of Presentation

--- Slide 2 ---
Main content text from slide...

--- Slide 3 ---
• Bullet point 1
• Bullet point 2
```

---

## ⚙️ Settings & Profile

### User Profile

**Access Profile**
```
Click username in top-right corner
Select "Profile"
OR click profile icon
```

**Profile Information**
```
• Username
• Email address
• Full name
• Account creation date
• Last login time
• Email verification status
```

**Profile Options**
- Edit profile information (coming soon)
- Change password (coming soon)
- Security settings (coming soon)
- Two-factor authentication (coming soon)

### Settings

**Language & Preferences**
- Select language (coming soon)
- Theme (dark/light) - currently dark
- Notification preferences (coming soon)

**Privacy & Security**
- Data privacy policy
- Session timeout settings
- Remember me duration (30 days)

### Account Management

**Logout**
```
Click username → Select "Logout"
OR click "Logout" button anywhere
Confirms you want to logout
Redirects to login page
All sessions cleared
```

**Password Reset**
```
On login page: "Forgot?"
Enter email address
Check email for reset link
Click link (expires in 1 hour)
Enter new password (min 8 chars)
Login with new password
```

---

## 💡 Tips & Best Practices

### Recording Best Practices

**Environment**
- ✅ Quiet room (minimize echo/background noise)
- ✅ Good lighting (if using camera)
- ✅ Professional background
- ❌ Avoid noisy environments

**Audio Quality**
- ✅ Microphone positioned 6-12 inches from mouth
- ✅ Speak clearly and naturally
- ✅ Use moderate volume
- ❌ Don't whisper or shout

**Content**
- ✅ Record actual presentation content
- ✅ Include natural pauses
- ✅ Vary tone and pace
- ❌ Don't rush through material

### Achieving Good Metrics

**Optimal WPM: 120-150**
- Practice at this pace
- Use metronome apps to calibrate
- Record 3-5 minute segments
- Aim for consistency

**High Clarity: 75+ Score**
- Replace filler words with pauses
- Breathe at sentence boundaries
- Enunciate clearly
- Avoid run-on sentences

**Minimal Fillers: < 2%**
- Become aware of personal habits
- Practice replacing with silence
- Record frequently for feedback
- Celebrate improvements

### Progressive Improvement

**Week 1: Awareness**
- Record and analyze
- Identify filler word patterns
- Note pace issues
- Get baseline metrics

**Week 2: Focused Practice**
- Target specific fillers
- Practice pace control
- Record multiple takes
- Track incremental changes

**Week 3: Refinement**
- Combine improvements
- Practice full presentations
- Get consistent results
- Master your speech

**Week 4: Mastery**
- Maintain improvements
- Practice different content
- Build confidence
- Ready for live presentation

### Real-World Application

**Before Your Talk**
1. Record your presentation
2. Review metrics with Zoiee
3. Practice teleprompter mode
4. Make final adjustments
5. Record again to confirm

**During Your Talk**
- Apply learned pacing
- Remember to pause (not fill)
- Maintain eye contact
- Breathe at logical breaks

**After Your Talk**
- Record again to verify improvements
- Use AI feedback for next presentation
- Share success with team
- Continue practicing

### Troubleshooting

| Problem | Solution |
|---------|----------|
| Recording starts but no audio captured | Check microphone permission in browser |
| Transcription has errors | Speak more clearly, check background noise |
| Chat responses slow | Wait for API response, check connection |
| File import fails | Ensure correct format, file < 10 MB, text-based (not scanned) |
| Metrics don't update | Refresh page, ensure at least 30 seconds recorded |

### Getting Help

- **Chat with Zoiee** — Ask questions about your presentation
- **Review Documentation** — Check `/docs` folder on server
- **Check Metrics** — Understand what each metric means
- **Practice** — The more you use it, the better the results!

---

## 🎉 You're Ready!

You now have everything you need to:
- ✅ Record and analyze your speech
- ✅ Get AI-powered coaching
- ✅ Practice with teleprompter
- ✅ Import your presentations
- ✅ Track improvement

**Start recording and become the presentation expert you're meant to be!**

For technical documentation, see the other files in the `/docs` folder.
