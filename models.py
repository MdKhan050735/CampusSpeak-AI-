"""
Database models for CampusSpeak AI
User authentication and account management
"""

from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import secrets

db = SQLAlchemy()


class PracticeSession(db.Model):
    """Stores individual practice session metrics for progress tracking."""
    __tablename__ = 'practice_sessions'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Core speech metrics
    duration = db.Column(db.Float, default=0)
    word_count = db.Column(db.Integer, default=0)
    wpm = db.Column(db.Integer, default=0)
    filler_count = db.Column(db.Integer, default=0)
    clarity = db.Column(db.Integer, default=0)
    confidence_score = db.Column(db.Integer, default=0)
    pace = db.Column(db.String(20), default='N/A')

    # Personality / Communication type
    personality_type = db.Column(db.String(80), default='')
    improvement_area = db.Column(db.String(120), default='')

    # Context (e.g. Free Speaking, HR Interview)
    mode = db.Column(db.String(50), default='Free Speaking')

    def to_dict(self):
        return {
            'id': self.id,
            'created_at': self.created_at.isoformat(),
            'duration': self.duration,
            'word_count': self.word_count,
            'wpm': self.wpm,
            'filler_count': self.filler_count,
            'clarity': self.clarity,
            'confidence_score': self.confidence_score,
            'pace': self.pace,
            'personality_type': self.personality_type,
            'improvement_area': self.improvement_area,
            'mode': self.mode,
        }

    def __repr__(self):
        return f'<PracticeSession user_id={self.user_id} confidence={self.confidence_score}>'

class User(UserMixin, db.Model):
    """User model with authentication fields."""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    full_name = db.Column(db.String(120), default='')
    
    # Account status
    is_active = db.Column(db.Boolean, default=True)
    email_verified = db.Column(db.Boolean, default=False)
    verification_token = db.Column(db.String(255), unique=True, nullable=True)
    verification_token_expires = db.Column(db.DateTime, nullable=True)
    
    # Two-factor authentication
    two_fa_enabled = db.Column(db.Boolean, default=False)
    two_fa_secret = db.Column(db.String(255), nullable=True)
    
    # Remember me
    remember_token = db.Column(db.String(255), unique=True, nullable=True)
    remember_token_expires = db.Column(db.DateTime, nullable=True)
    
    # Password reset
    reset_token = db.Column(db.String(255), unique=True, nullable=True)
    reset_token_expires = db.Column(db.DateTime, nullable=True)
    
    # Account timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login = db.Column(db.DateTime, nullable=True)
    
    # Social login
    google_id = db.Column(db.String(255), unique=True, nullable=True)
    github_id = db.Column(db.String(255), unique=True, nullable=True)
    
    def set_password(self, password):
        """Hash and set password."""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """Verify password against hash."""
        return check_password_hash(self.password_hash, password)
    
    def generate_verification_token(self):
        """Generate email verification token."""
        self.verification_token = secrets.token_urlsafe(32)
        self.verification_token_expires = datetime.utcnow() + timedelta(hours=24)
        return self.verification_token
    
    def verify_email(self):
        """Mark email as verified."""
        self.email_verified = True
        self.verification_token = None
        self.verification_token_expires = None
    
    def generate_reset_token(self):
        """Generate password reset token."""
        self.reset_token = secrets.token_urlsafe(32)
        self.reset_token_expires = datetime.utcnow() + timedelta(hours=1)
        return self.reset_token
    
    def verify_reset_token(self, token):
        """Verify password reset token is valid."""
        if self.reset_token != token:
            return False
        if datetime.utcnow() > self.reset_token_expires:
            return False
        return True
    
    def reset_password(self, new_password):
        """Reset password and clear reset token."""
        self.set_password(new_password)
        self.reset_token = None
        self.reset_token_expires = None
    
    def generate_remember_token(self):
        """Generate remember me token."""
        self.remember_token = secrets.token_urlsafe(32)
        self.remember_token_expires = datetime.utcnow() + timedelta(days=30)
        return self.remember_token
    
    def verify_remember_token(self, token):
        """Verify remember token is valid."""
        if self.remember_token != token:
            return False
        if datetime.utcnow() > self.remember_token_expires:
            return False
        return True
    
    def clear_remember_token(self):
        """Clear remember token."""
        self.remember_token = None
        self.remember_token_expires = None
    
    def update_last_login(self):
        """Update last login timestamp."""
        self.last_login = datetime.utcnow()
    
    def to_dict(self):
        """Convert user to dictionary."""
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'full_name': self.full_name,
            'email_verified': self.email_verified,
            'two_fa_enabled': self.two_fa_enabled,
            'created_at': self.created_at.isoformat(),
            'last_login': self.last_login.isoformat() if self.last_login else None
        }
    
    def __repr__(self):
        return f'<User {self.username}>'


class Session(db.Model):
    """User session tracking."""
    __tablename__ = 'sessions'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    token = db.Column(db.String(255), unique=True, nullable=False)
    user_agent = db.Column(db.String(500), default='')
    ip_address = db.Column(db.String(45), default='')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    expires_at = db.Column(db.DateTime, nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    
    def is_expired(self):
        """Check if session is expired."""
        return datetime.utcnow() > self.expires_at
    
    def __repr__(self):
        return f'<Session user_id={self.user_id}>'
