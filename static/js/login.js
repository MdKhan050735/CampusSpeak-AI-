/* ═══════════════════════════════════════════════════════════════════════════
   LOGIN PAGE - JAVASCRIPT INTERACTIONS
   ═══════════════════════════════════════════════════════════════════════════ */

// ────────────────────────────────────────────────────────────────────────────
// PARTICLE ANIMATION SYSTEM
// ────────────────────────────────────────────────────────────────────────────

class ParticleSystem {
    constructor(containerId, particleCount = 50) {
        this.container = document.getElementById(containerId);
        this.particles = [];
        this.particleCount = particleCount;
        this.mouseX = 0;
        this.mouseY = 0;
        this.init();
    }

    init() {
        // Create particles
        for (let i = 0; i < this.particleCount; i++) {
            this.createParticle();
        }

        // Track mouse movement
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
    }

    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 3 + 1;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        
        const duration = Math.random() * 3 + 2;
        particle.style.animationDuration = duration + 's';
        particle.style.animationDelay = Math.random() * 1 + 's';

        this.container.appendChild(particle);
        
        this.particles.push({
            element: particle,
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            opacity: Math.random() * 0.5 + 0.3
        });
    }

    animate() {
        this.particles.forEach((particle, index) => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Bounce off edges
            if (particle.x < 0 || particle.x > window.innerWidth) particle.vx *= -1;
            if (particle.y < 0 || particle.y > window.innerHeight) particle.vy *= -1;

            // Keep within bounds
            particle.x = Math.max(0, Math.min(window.innerWidth, particle.x));
            particle.y = Math.max(0, Math.min(window.innerHeight, particle.y));

            // Calculate distance to mouse
            const dx = this.mouseX - particle.x;
            const dy = this.mouseY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Gravity effect - pull particles toward cursor
            const maxDistance = 200;
            if (distance < maxDistance) {
                const force = (1 - distance / maxDistance) * 0.15;
                particle.vx += (dx / distance) * force;
                particle.vy += (dy / distance) * force;

                // Increase glow near cursor
                const glowIntensity = 1 - (distance / maxDistance);
                particle.element.style.opacity = particle.opacity + glowIntensity * 0.7;
                particle.element.style.boxShadow = `0 0 ${10 + glowIntensity * 15}px rgba(14, 165, 233, ${0.8 + glowIntensity * 0.4})`;
            } else {
                particle.element.style.opacity = particle.opacity;
                particle.element.style.boxShadow = '0 0 10px rgba(14, 165, 233, 0.8)';
            }

            // Apply friction
            particle.vx *= 0.98;
            particle.vy *= 0.98;

            // Update element position
            particle.element.style.left = particle.x + 'px';
            particle.element.style.top = particle.y + 'px';
        });

        requestAnimationFrame(() => this.animate());
    }
}

// ────────────────────────────────────────────────────────────────────────────
// CURSOR-FOLLOWING GLOW
// ────────────────────────────────────────────────────────────────────────────

class CursorGlow {
    constructor(elementId) {
        this.element = document.getElementById(elementId);
        if (!this.element) return;

        this.mouseX = window.innerWidth / 2;
        this.mouseY = window.innerHeight / 2;
        this.glowX = this.mouseX;
        this.glowY = this.mouseY;
        this.isVisible = true;

        this.init();
    }

    init() {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;

            if (!this.isVisible) {
                this.element.style.opacity = '0.5';
                this.isVisible = true;
            }
        });

        document.addEventListener('mouseleave', () => {
            this.element.style.opacity = '0';
            this.isVisible = false;
        });

        document.addEventListener('mouseenter', () => {
            this.element.style.opacity = '0.5';
            this.isVisible = true;
        });

        this.animate();
    }

    animate() {
        const easing = 0.1;
        this.glowX += (this.mouseX - this.glowX) * easing;
        this.glowY += (this.mouseY - this.glowY) * easing;

        this.element.style.left = this.glowX - 150 + 'px';
        this.element.style.top = this.glowY - 150 + 'px';

        requestAnimationFrame(() => this.animate());
    }
}

// ────────────────────────────────────────────────────────────────────────────
// FORM HANDLER
// ────────────────────────────────────────────────────────────────────────────

class LoginForm {
    constructor() {
        this.form = document.getElementById('loginForm');
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.togglePasswordBtn = document.getElementById('togglePassword');
        this.errorMessageDiv = document.getElementById('errorMessage');
        this.loadingIndicator = document.getElementById('loadingIndicator');

        this.init();
    }

    init() {
        // Password toggle
        this.togglePasswordBtn.addEventListener('click', () => this.togglePasswordVisibility());

        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Real-time validation
        this.emailInput.addEventListener('blur', () => this.validateEmail());
        this.passwordInput.addEventListener('blur', () => this.validatePassword());
    }

    togglePasswordVisibility() {
        const isPassword = this.passwordInput.type === 'password';
        this.passwordInput.type = isPassword ? 'text' : 'password';

        const icon = this.togglePasswordBtn.querySelector('i');
        icon.className = isPassword ? 'fas fa-eye-slash' : 'fas fa-eye';
    }

    validateEmail() {
        const email = this.emailInput.value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email) {
            this.showError('Email is required');
            return false;
        }
        
        if (!emailRegex.test(email)) {
            this.showError('Invalid email address');
            return false;
        }
        
        this.clearError();
        return true;
    }

    validatePassword() {
        const password = this.passwordInput.value;
        
        if (!password) {
            this.showError('Password is required');
            return false;
        }
        
        if (password.length < 6) {
            this.showError('Password must be at least 6 characters');
            return false;
        }
        
        this.clearError();
        return true;
    }

    handleSubmit(e) {
        e.preventDefault();

        // Validate both fields
        const isEmailValid = this.validateEmail();
        const isPasswordValid = this.validatePassword();

        if (!isEmailValid || !isPasswordValid) {
            return;
        }

        // Show loading indicator
        this.loadingIndicator.classList.add('show');

        const formData = {
            email: this.emailInput.value,
            password: this.passwordInput.value,
            remember_me: document.getElementById('remember').checked
        };

        // Send login request to backend
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            this.loadingIndicator.classList.remove('show');
            
            if (data.success) {
                this.showSuccess('Login successful! Redirecting...');
                
                // Redirect after 1 second
                setTimeout(() => {
                    window.location.href = '/app';
                }, 1000);
            } else {
                this.showError(data.error || 'Login failed. Please try again.');
            }
        })
        .catch(error => {
            console.error('Login error:', error);
            this.loadingIndicator.classList.remove('show');
            this.showError('Connection error. Please try again.');
        });
    }

    showError(message) {
        this.errorMessageDiv.textContent = message;
        this.errorMessageDiv.classList.add('show');
    }

    clearError() {
        this.errorMessageDiv.classList.remove('show');
        this.errorMessageDiv.textContent = '';
    }

    showSuccess(message) {
        this.errorMessageDiv.textContent = message;
        this.errorMessageDiv.style.background = 'rgba(16, 185, 129, 0.1)';
        this.errorMessageDiv.style.borderColor = 'rgba(16, 185, 129, 0.3)';
        this.errorMessageDiv.style.color = '#a7f3d0';
        this.errorMessageDiv.classList.add('show');
    }
}

// ────────────────────────────────────────────────────────────────────────────
// SOCIAL LOGIN HANDLERS
// ────────────────────────────────────────────────────────────────────────────

class SocialLogin {
    constructor() {
        this.googleBtn = document.getElementById('googleBtn');
        this.githubBtn = document.getElementById('githubBtn');
        this.loadingIndicator = document.getElementById('loadingIndicator');

        this.init();
    }

    init() {
        this.googleBtn.addEventListener('click', () => this.handleGoogleLogin());
        this.githubBtn.addEventListener('click', () => this.handleGithubLogin());
    }

    handleGoogleLogin() {
        console.log('Google login clicked - Coming soon');
        // Google OAuth integration - coming soon
        return false;
    }

    handleGithubLogin() {
        console.log('GitHub login clicked - Coming soon');
        // GitHub OAuth integration - coming soon
        return false;
    }
}

// ────────────────────────────────────────────────────────────────────────────
// INITIALIZE ON PAGE LOAD
// ────────────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    // Initialize particle system
    const particleSystem = new ParticleSystem('particlesContainer', 60);
    particleSystem.animate();

    // Initialize cursor glow
    new CursorGlow('cursorGlow');

    // Initialize login form
    new LoginForm();

    // Initialize social login
    new SocialLogin();

    // Add some magic: tilt effect on particles container on mouse move
    document.addEventListener('mousemove', (e) => {
        const container = document.querySelector('.login-container');
        const x = (e.clientX / window.innerWidth) - 0.5;
        const y = (e.clientY / window.innerHeight) - 0.5;
        
        const rotateX = y * 5;
        const rotateY = x * 5;

        container.style.perspective = '1000px';
    });
});

// ────────────────────────────────────────────────────────────────────────────
// UTILITY: Add ripple effect on button clicks
// ────────────────────────────────────────────────────────────────────────────

document.addEventListener('click', (e) => {
    const button = e.target.closest('button, a.link-text');
    if (!button) return;

    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';

    if (button.classList.contains('social-btn')) {
        ripple.style.background = 'rgba(255, 255, 255, 0.5)';
    } else {
        ripple.style.background = 'rgba(255, 255, 255, 0.3)';
    }

    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.pointerEvents = 'none';
    ripple.style.animation = 'ripple 0.6s ease-out';

    if (!button.style.position || button.style.position === 'static') {
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
    }

    button.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
});

// Add ripple animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
