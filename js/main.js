// MediMap Main JavaScript - Common Functions

// Global Configuration
const MEDIMAP_CONFIG = {
    APP_NAME: 'MediMap',
    VERSION: '1.0.0',
    API_TIMEOUT: 10000,
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
    SUPPORTED_FILE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'],
    DEFAULT_LOCATION: {
        latitude: 23.7956,
        longitude: 90.3537,
        address: 'মিরপুর-১, ঢাকা'
    },
    PHONE_REGEX: /^01[3-9]\d{8}$/,
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    USERNAME_REGEX: /^[a-zA-Z0-9_]{3,}$/,
    NID_REGEX: /^[0-9]{10,17}$/
};

// Utility Functions
const MediMapUtils = {
    
    // Date and Time Utilities
    formatDate(dateString, locale = 'bn-BD') {
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffTime = Math.abs(now - date);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
                return 'আজ';
            } else if (diffDays === 2) {
                return 'গতকাল';
            } else if (diffDays < 7) {
                return `${diffDays - 1} দিন আগে`;
            } else if (diffDays < 30) {
                const weeks = Math.floor(diffDays / 7);
                return `${weeks} সপ্তাহ আগে`;
            } else {
                return date.toLocaleDateString(locale);
            }
        } catch (error) {
            return dateString;
        }
    },
    
    formatTime(timeString) {
        try {
            const [hours, minutes] = timeString.split(':');
            const hour = parseInt(hours);
            const ampm = hour >= 12 ? 'রাত' : 'সকাল';
            const hour12 = hour % 12 || 12;
            return `${hour12}:${minutes} ${ampm}`;
        } catch (error) {
            return timeString;
        }
    },
    
    getCurrentTimestamp() {
        return new Date().toISOString();
    },
    
    // String Utilities
    sanitizeString(str) {
        if (!str) return '';
        return str.trim().replace(/[<>]/g, '');
    },
    
    capitalize(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    },
    
    generateId(prefix = '') {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substr(2, 9);
        return `${prefix}${prefix ? '_' : ''}${timestamp}_${random}`;
    },
    
    // Number Utilities
    formatPrice(price) {
        if (typeof price !== 'number') return '০';
        return `৳${price.toFixed(2)}`;
    },
    
    formatDistance(distance) {
        if (distance < 1) {
            return `${Math.round(distance * 1000)} মিটার`;
        } else {
            return `${distance.toFixed(1)} কিমি`;
        }
    },
    
    // Validation Utilities
    validatePhone(phone) {
        return MEDIMAP_CONFIG.PHONE_REGEX.test(phone);
    },
    
    validateEmail(email) {
        return MEDIMAP_CONFIG.EMAIL_REGEX.test(email);
    },
    
    validateUsername(username) {
        return MEDIMAP_CONFIG.USERNAME_REGEX.test(username);
    },
    
    validateNID(nid) {
        return MEDIMAP_CONFIG.NID_REGEX.test(nid);
    },
    
    validateFile(file, allowedTypes = MEDIMAP_CONFIG.SUPPORTED_FILE_TYPES, maxSize = MEDIMAP_CONFIG.MAX_FILE_SIZE) {
        const errors = [];
        
        if (!file) {
            errors.push('কোন ফাইল নির্বাচন করা হয়নি');
            return { valid: false, errors };
        }
        
        if (!allowedTypes.includes(file.type)) {
            errors.push('এই ধরনের ফাইল সাপোর্ট করা হয় না');
        }
        
        if (file.size > maxSize) {
            const maxSizeMB = maxSize / (1024 * 1024);
            errors.push(`ফাইলের সাইজ ${maxSizeMB} MB এর বেশি হতে পারবে না`);
        }
        
        return {
            valid: errors.length === 0,
            errors
        };
    },
    
    // Location Utilities
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Earth radius in km
        const dLat = this.deg2rad(lat2 - lat1);
        const dLon = this.deg2rad(lon2 - lon1);
        
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        
        return R * c; // Distance in km
    },
    
    deg2rad(deg) {
        return deg * (Math.PI/180);
    },
    
    // File Utilities
    convertFileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    },
    
    downloadFile(content, filename, contentType = 'text/plain') {
        const blob = new Blob([content], { type: contentType });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    },
    
    // URL Utilities
    getQueryParams() {
        const params = new URLSearchParams(window.location.search);
        const result = {};
        for (const [key, value] of params) {
            result[key] = value;
        }
        return result;
    },
    
    updateURL(params, replace = false) {
        const url = new URL(window.location);
        Object.keys(params).forEach(key => {
            if (params[key] !== null && params[key] !== undefined) {
                url.searchParams.set(key, params[key]);
            } else {
                url.searchParams.delete(key);
            }
        });
        
        if (replace) {
            window.history.replaceState({}, '', url);
        } else {
            window.history.pushState({}, '', url);
        }
    }
};

// Local Storage Manager
const StorageManager = {
    
    set(key, value, expiry = null) {
        try {
            const data = {
                value,
                timestamp: Date.now(),
                expiry: expiry ? Date.now() + expiry : null
            };
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Storage set error:', error);
            return false;
        }
    },
    
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            if (!item) return defaultValue;
            
            const data = JSON.parse(item);
            
            // Check expiry
            if (data.expiry && Date.now() > data.expiry) {
                this.remove(key);
                return defaultValue;
            }
            
            return data.value;
        } catch (error) {
            console.error('Storage get error:', error);
            return defaultValue;
        }
    },
    
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Storage remove error:', error);
            return false;
        }
    },
    
    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Storage clear error:', error);
            return false;
        }
    },
    
    // Pharmacy specific storage
    savePharmacyData(pharmacyId, data) {
        return this.set(`pharmacy_${pharmacyId}`, data);
    },
    
    getPharmacyData(pharmacyId) {
        return this.get(`pharmacy_${pharmacyId}`, {});
    },
    
    // User preferences
    saveUserPreference(key, value) {
        const prefs = this.get('user_preferences', {});
        prefs[key] = value;
        return this.set('user_preferences', prefs);
    },
    
    getUserPreference(key, defaultValue = null) {
        const prefs = this.get('user_preferences', {});
        return prefs[key] !== undefined ? prefs[key] : defaultValue;
    }
};

// UI Utilities
const UIUtils = {
    
    // Loading states
    showLoading(element, text = 'লোড হচ্ছে...') {
        if (!element) return;
        
        element.disabled = true;
        element.dataset.originalText = element.innerHTML;
        element.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${text}`;
    },
    
    hideLoading(element) {
        if (!element) return;
        
        element.disabled = false;
        if (element.dataset.originalText) {
            element.innerHTML = element.dataset.originalText;
        }
    },
    
    // Notifications
    showNotification(message, type = 'info', duration = 5000) {
        // Remove existing notifications
        const existing = document.querySelector('.medimap-notification');
        if (existing) {
            existing.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `medimap-notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // Add styles if not exists
        if (!document.querySelector('#medimap-notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'medimap-notification-styles';
            styles.textContent = `
                .medimap-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 9999;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                    max-width: 400px;
                    animation: slideInRight 0.3s ease-out;
                }
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 16px;
                }
                .notification-success { border-left: 4px solid #10b981; }
                .notification-error { border-left: 4px solid #ef4444; }
                .notification-warning { border-left: 4px solid #f59e0b; }
                .notification-info { border-left: 4px solid #3b82f6; }
                .notification-close {
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: #64748b;
                    margin-left: auto;
                }
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(styles);
        }
        
        document.body.appendChild(notification);
        
        // Auto remove
        if (duration > 0) {
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, duration);
        }
    },
    
    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    },
    
    // Modal utilities
    createModal(title, content, actions = []) {
        const modal = document.createElement('div');
        modal.className = 'medimap-modal';
        modal.innerHTML = `
            <div class="modal-backdrop"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
                <div class="modal-footer">
                    ${actions.map(action => 
                        `<button class="btn ${action.class || 'btn-primary'}" onclick="${action.onclick || ''}">${action.text}</button>`
                    ).join('')}
                </div>
            </div>
        `;
        
        // Add modal styles if not exists
        if (!document.querySelector('#medimap-modal-styles')) {
            const styles = document.createElement('style');
            styles.id = 'medimap-modal-styles';
            styles.textContent = `
                .medimap-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .modal-backdrop {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.5);
                    backdrop-filter: blur(5px);
                }
                .modal-content {
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                    max-width: 500px;
                    width: 90%;
                    max-height: 90vh;
                    overflow-y: auto;
                    position: relative;
                    z-index: 1;
                }
                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 20px 24px;
                    border-bottom: 1px solid #e2e8f0;
                }
                .modal-header h3 {
                    margin: 0;
                    color: #1e293b;
                }
                .modal-close {
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 8px;
                    border-radius: 4px;
                    color: #64748b;
                }
                .modal-close:hover {
                    background: #f1f5f9;
                }
                .modal-body {
                    padding: 24px;
                }
                .modal-footer {
                    padding: 20px 24px;
                    border-top: 1px solid #e2e8f0;
                    display: flex;
                    gap: 12px;
                    justify-content: flex-end;
                }
            `;
            document.head.appendChild(styles);
        }
        
        // Close functionality
        modal.querySelector('.modal-close').onclick = () => modal.remove();
        modal.querySelector('.modal-backdrop').onclick = () => modal.remove();
        
        document.body.appendChild(modal);
        return modal;
    },
    
    // Form utilities
    collectFormData(formElement) {
        const formData = new FormData(formElement);
        const data = {};
        
        for (const [key, value] of formData.entries()) {
            if (data[key]) {
                // Handle multiple values (checkboxes)
                if (Array.isArray(data[key])) {
                    data[key].push(value);
                } else {
                    data[key] = [data[key], value];
                }
            } else {
                data[key] = value;
            }
        }
        
        return data;
    },
    
    validateForm(formElement, rules = {}) {
        const data = this.collectFormData(formElement);
        const errors = {};
        
        Object.keys(rules).forEach(field => {
            const rule = rules[field];
            const value = data[field];
            
            if (rule.required && (!value || value.trim() === '')) {
                errors[field] = rule.requiredMessage || 'এই ক্ষেত্রটি পূরণ করুন';
                return;
            }
            
            if (value && rule.validator && !rule.validator(value)) {
                errors[field] = rule.message || 'সঠিক তথ্য দিন';
            }
        });
        
        return {
            valid: Object.keys(errors).length === 0,
            errors,
            data
        };
    },
    
    // Animation utilities
    fadeIn(element, duration = 300) {
        element.style.opacity = '0';
        element.style.display = 'block';
        
        let start = null;
        
        function animate(timestamp) {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const opacity = Math.min(progress / duration, 1);
            
            element.style.opacity = opacity;
            
            if (progress < duration) {
                requestAnimationFrame(animate);
            }
        }
        
        requestAnimationFrame(animate);
    },
    
    fadeOut(element, duration = 300) {
        let start = null;
        
        function animate(timestamp) {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const opacity = Math.max(1 - (progress / duration), 0);
            
            element.style.opacity = opacity;
            
            if (progress < duration) {
                requestAnimationFrame(animate);
            } else {
                element.style.display = 'none';
            }
        }
        
        requestAnimationFrame(animate);
    },
    
    // Scroll utilities
    scrollToTop(smooth = true) {
        window.scrollTo({
            top: 0,
            behavior: smooth ? 'smooth' : 'auto'
        });
    },
    
    scrollToElement(element, offset = 0) {
        const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
            top: elementTop - offset,
            behavior: 'smooth'
        });
    }
};

// Error Handler
const ErrorHandler = {
    
    log(error, context = '') {
        console.error(`[MediMap Error] ${context}:`, error);
        
        // Store error for debugging
        const errors = StorageManager.get('error_logs', []);
        errors.push({
            error: error.toString(),
            context,
            timestamp: MediMapUtils.getCurrentTimestamp(),
            url: window.location.href,
            userAgent: navigator.userAgent
        });
        
        // Keep only last 50 errors
        if (errors.length > 50) {
            errors.splice(0, errors.length - 50);
        }
        
        StorageManager.set('error_logs', errors);
    },
    
    handle(error, context = '', showToUser = false) {
        this.log(error, context);
        
        if (showToUser) {
            UIUtils.showNotification(
                'একটি সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
                'error'
            );
        }
    },
    
    getErrorLogs() {
        return StorageManager.get('error_logs', []);
    },
    
    clearErrorLogs() {
        return StorageManager.remove('error_logs');
    }
};

// Performance Monitor
const PerformanceMonitor = {
    
    startTimer(name) {
        performance.mark(`${name}_start`);
    },
    
    endTimer(name) {
        performance.mark(`${name}_end`);
        performance.measure(name, `${name}_start`, `${name}_end`);
        
        const measure = performance.getEntriesByName(name, 'measure')[0];
        console.log(`[Performance] ${name}: ${measure.duration.toFixed(2)}ms`);
        
        return measure.duration;
    },
    
    measurePageLoad() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const navigation = performance.getEntriesByType('navigation')[0];
                console.log('[Performance] Page Load Time:', {
                    domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                    loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
                    totalTime: navigation.loadEventEnd - navigation.navigationStart
                });
            }, 0);
        });
    }
};

// Initialize common functionality
document.addEventListener('DOMContentLoaded', () => {
    // Start performance monitoring
    PerformanceMonitor.measurePageLoad();
    
    // Setup global error handling
    window.addEventListener('error', (event) => {
        ErrorHandler.handle(event.error, 'Global Error', false);
    });
    
    window.addEventListener('unhandledrejection', (event) => {
        ErrorHandler.handle(event.reason, 'Unhandled Promise Rejection', false);
    });
    
    // Setup common UI enhancements
    setupCommonUI();
    
    // Setup keyboard shortcuts
    setupKeyboardShortcuts();
    
    // Setup offline detection
    setupOfflineDetection();
});

// Common UI Setup
function setupCommonUI() {
    // Add loading classes to buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.type === 'submit' || this.classList.contains('btn-loading')) {
                UIUtils.showLoading(this);
                
                // Auto-restore after 30 seconds (failsafe)
                setTimeout(() => {
                    UIUtils.hideLoading(this);
                }, 30000);
            }
        });
    });
    
    // Add smooth scrolling to anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                UIUtils.scrollToElement(target, 70);
            }
        });
    });
    
    // Add form validation indicators
    document.querySelectorAll('.form-input').forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value && this.checkValidity()) {
                this.classList.add('valid');
                this.classList.remove('invalid');
            } else if (this.value && !this.checkValidity()) {
                this.classList.add('invalid');
                this.classList.remove('valid');
            } else {
                this.classList.remove('valid', 'invalid');
            }
        });
    });
}

// Keyboard Shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.querySelector('input[type="search"], .search-input');
            if (searchInput) {
                searchInput.focus();
            }
        }
        
        // Escape key to close modals
        if (e.key === 'Escape') {
            const modal = document.querySelector('.medimap-modal, .modal.active');
            if (modal) {
                modal.remove ? modal.remove() : modal.classList.remove('active');
            }
        }
        
        // Alt + H for home
        if (e.altKey && e.key === 'h') {
            e.preventDefault();
            window.location.href = 'index.html';
        }
    });
}

// Offline Detection
function setupOfflineDetection() {
    function updateOnlineStatus() {
        const isOnline = navigator.onLine;
        
        if (!isOnline) {
            UIUtils.showNotification(
                'ইন্টারনেট সংযোগ নেই। কিছু ফিচার কাজ নাও করতে পারে।',
                'warning',
                0 // Don't auto-hide
            );
        } else {
            // Remove offline notification
            const notification = document.querySelector('.notification-warning');
            if (notification) {
                notification.remove();
            }
        }
    }
    
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    // Initial check
    updateOnlineStatus();
}

// Password Toggle Function (Global)
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = input.nextElementSibling?.querySelector('i');
    
    if (!input || !icon) return;
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Phone Number Formatter (Global)
function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
    
    // Bangladesh phone number format
    if (value.startsWith('880')) {
        value = value.substring(3);
    }
    
    if (!value.startsWith('0') && value.length >= 10) {
        value = '0' + value;
    }
    
    input.value = value;
}

// Export for global use
window.MediMapUtils = MediMapUtils;
window.StorageManager = StorageManager;
window.UIUtils = UIUtils;
window.ErrorHandler = ErrorHandler;
window.PerformanceMonitor = PerformanceMonitor;
window.MEDIMAP_CONFIG = MEDIMAP_CONFIG;

// Export functions for backward compatibility
window.togglePassword = togglePassword;
window.formatPhoneNumber = formatPhoneNumber;

console.log(`[MediMap] Main.js loaded - Version ${MEDIMAP_CONFIG.VERSION}`);