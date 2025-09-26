// MediMap Pharmacy Login JavaScript

// Global variables
let isLoading = false;

// Initialize login page
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing login page');

    // Check if already logged in
    checkExistingLogin();

    // Setup form handlers
    setupLoginForm();
    setupForgotPasswordForm();

    // Setup UI enhancements
    setupUIEnhancements();

    // Load remembered username
    loadRememberedUsername();

    // Add debug info
    console.log('Login page initialization complete');

    // Add global test function for debugging
    window.testLogin = async function() {
        console.log('Manual login test started');
        const result = await loginPharmacy('popular_pharmacy', '123456');
        console.log('Manual test result:', result);
        if (result && result.success) {
            localStorage.setItem('loggedInPharmacy', JSON.stringify(result.pharmacy));
            window.location.href = 'admin-dashboard.html';
        }
    };

    // Add global login click handler
    window.handleLoginClick = function(event) {
        console.log('Login button clicked directly');
        event.preventDefault();
        event.stopPropagation();
        handleLogin(event);
    };
});

// Check if user is already logged in
function checkExistingLogin() {
    const loggedInPharmacy = localStorage.getItem('loggedInPharmacy');
    
    if (loggedInPharmacy) {
        // User is already logged in, redirect to dashboard
        window.location.href = 'admin-dashboard.html';
    }
}

// Setup login form
function setupLoginForm() {
    const loginForm = document.getElementById('loginForm');
    const loginButton = document.querySelector('.btn-login');

    if (loginForm) {
        console.log('Login form found, attaching event listener');
        loginForm.addEventListener('submit', handleLogin);

        // Also add listener to button as fallback
        if (loginButton) {
            console.log('Login button found, adding click handler');
            loginButton.addEventListener('click', function(e) {
                console.log('Button click detected');
                if (e.target.type === 'submit') {
                    // Let form submit handle it
                    return;
                }
                e.preventDefault();
                handleLogin(e);
            });
        }
    } else {
        console.error('Login form not found!');
    }

    // Real-time validation
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    if (usernameInput) {
        console.log('Username input found');
        usernameInput.addEventListener('input', validateUsername);
        usernameInput.addEventListener('blur', validateUsername);
    } else {
        console.error('Username input not found!');
    }

    if (passwordInput) {
        console.log('Password input found');
        passwordInput.addEventListener('input', validatePassword);
        passwordInput.addEventListener('blur', validatePassword);
    } else {
        console.error('Password input not found!');
    }
}

// Handle login form submission
async function handleLogin(e) {
    e.preventDefault();
    console.log('Login form submitted');

    if (isLoading) {
        console.log('Already loading, ignoring submission');
        return;
    }

    // Get form data
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    console.log('Form data:', { username, password: password ? '***' : 'empty', rememberMe });

    // Validate inputs
    if (!validateLoginForm(username, password)) {
        console.log('Form validation failed');
        return;
    }

    console.log('Form validation passed, starting login process');

    // Show loading state
    showLoadingState();
    
    try {
        // Attempt to login
        console.log('Attempting login for:', username);
        const result = await loginPharmacy(username, password);
        console.log('Login result:', result);

        if (result && result.success) {
            // Login successful
            console.log('Login successful, redirecting...');
            console.log('Pharmacy data:', result.pharmacy);

            showAlert('সফলভাবে লগইন হয়েছে!', 'success');

            // Save login state
            localStorage.setItem('loggedInPharmacy', JSON.stringify(result.pharmacy));
            console.log('Login data saved to localStorage');

            // Remember username if requested
            if (rememberMe) {
                localStorage.setItem('rememberedUsername', username);
            } else {
                localStorage.removeItem('rememberedUsername');
            }

            // Add login activity
            try {
                addLoginActivity(result.pharmacy.id);
                console.log('Login activity added');
            } catch (activityError) {
                console.error('Error adding activity:', activityError);
            }

            // Redirect immediately instead of delay
            console.log('Redirecting to dashboard now...');
            hideLoadingState();
            window.location.href = 'admin-dashboard.html';

        } else {
            // Login failed
            console.log('Login failed:', result);
            showAlert(result?.message || 'লগইন ব্যর্থ হয়েছে', 'error');
            hideLoadingState();
        }

    } catch (error) {
        console.error('Login error:', error);
        showAlert('একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।', 'error');
        hideLoadingState();
    }
}

// Login pharmacy function
async function loginPharmacy(username, password) {
    console.log('=== Starting login process for:', username, '===');

    try {
        // First check if we have Firebase available and can connect
        if (window.MediMapDB && window.MediMapDB.FirebaseUtils && window.MediMapDB.FirebaseUtils.isFirebaseAvailable()) {
            console.log('Firebase available, attempting Firebase login...');

            try {
                // Try Firebase login with timeout
                console.log('Creating Firebase promise...');
                const pharmacyPromise = window.MediMapDB.PharmacyDB.getPharmacyByUsername(username);
                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Firebase timeout')), 3000)
                );

                console.log('Waiting for Firebase response...');
                const pharmacy = await Promise.race([pharmacyPromise, timeoutPromise]);
                console.log('Firebase response received:', pharmacy);

                if (pharmacy) {
                    console.log('Found pharmacy in Firebase:', pharmacy.username);

                    // Validate password
                    if (pharmacy.password === password && pharmacy.isActive !== false) {
                        console.log('Firebase login successful');
                        return { success: true, pharmacy: pharmacy };
                    } else {
                        console.log('Firebase password/status validation failed');
                        return {
                            success: false,
                            message: pharmacy.password !== password ? 'পাসওয়ার্ড সঠিক নয়' : 'আপনার অ্যাকাউন্ট নিষ্ক্রিয় রয়েছে'
                        };
                    }
                } else {
                    console.log('No pharmacy found in Firebase');
                }
            } catch (firebaseError) {
                console.log('Firebase error, trying local fallback:', firebaseError.message);
            }
        } else {
            console.log('Firebase not available or not initialized');
        }

        // Fallback to local demo accounts
        console.log('Using local demo accounts fallback');
        const localResult = loginPharmacyLocal(username, password);
        console.log('Local login result:', localResult);
        return localResult;

    } catch (error) {
        console.error('Login error:', error);
        // Final fallback to local
        console.log('Final fallback to local');
        return loginPharmacyLocal(username, password);
    }
}

// Fallback local login
function loginPharmacyLocal(username, password) {
    console.log('Using local fallback login for:', username);

    // Demo accounts for testing
    const demoAccounts = [
        {
            id: 'pharmacy_1',
            username: 'demo',
            password: '123456',
            name: 'Popular Pharmacy',
            ownerName: 'মো. করিম উদ্দিন',
            address: 'শপিং সেন্টার, মিরপুর-১, ঢাকা',
            phone: '01711-123456',
            email: 'popular@pharmacy.com',
            coordinates: {lat: 23.7956, lng: 90.3537},
            openingHours: 'সকাল ৮টা - রাত ১০টা',
            isActive: true,
            createdAt: new Date().toISOString()
        },
        {
            id: 'pharmacy_2',
            username: 'square_pharmacy',
            password: '123456',
            name: 'Square Pharmacy',
            ownerName: 'ডা. রহিম আলী',
            address: 'কাজীপাড়া মোড়, মিরপুর-১, ঢাকা',
            phone: '01811-234567',
            email: 'square@pharmacy.com',
            coordinates: {lat: 23.7966, lng: 90.3547},
            openingHours: '২৪ ঘন্টা খোলা',
            isActive: true,
            createdAt: new Date().toISOString()
        }
    ];

    // Check stored pharmacies
    const storedPharmacies = JSON.parse(localStorage.getItem('pharmacies') || '[]');
    const allPharmacies = [...demoAccounts, ...storedPharmacies];

    console.log('Available accounts:', allPharmacies.map(p => p.username));

    const pharmacy = allPharmacies.find(p => p.username === username);

    if (!pharmacy) {
        console.log('Pharmacy not found for username:', username);
        return {
            success: false,
            message: 'এই ইউজারনেম দিয়ে কোন ফার্মাসি পাওয়া যায়নি'
        };
    }

    if (pharmacy.password !== password) {
        console.log('Password mismatch for:', username);
        return {
            success: false,
            message: 'পাসওয়ার্ড সঠিক নয়'
        };
    }

    if (pharmacy.isActive === false) {
        console.log('Account inactive for:', username);
        return {
            success: false,
            message: 'আপনার অ্যাকাউন্ট নিষ্ক্রিয় রয়েছে'
        };
    }

    console.log('Local login successful for:', username);
    return {
        success: true,
        pharmacy: pharmacy
    };
}

// Validate login form
function validateLoginForm(username, password) {
    let isValid = true;
    
    // Clear previous errors
    clearFieldError('username');
    clearFieldError('password');
    hideAlert();
    
    // Validate username
    if (!username) {
        showFieldError('username', 'ইউজারনেম দিন');
        isValid = false;
    } else if (username.length < 3) {
        showFieldError('username', 'ইউজারনেম কমপক্ষে ৩ অক্ষরের হতে হবে');
        isValid = false;
    }
    
    // Validate password
    if (!password) {
        showFieldError('password', 'পাসওয়ার্ড দিন');
        isValid = false;
    } else if (password.length < 6) {
        showFieldError('password', 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে');
        isValid = false;
    }
    
    return isValid;
}

// Real-time validation functions
function validateUsername() {
    const username = document.getElementById('username').value.trim();
    const errorElement = document.getElementById('usernameError');
    
    if (username && username.length < 3) {
        showFieldError('username', 'ইউজারনেম কমপক্ষে ৩ অক্ষরের হতে হবে');
    } else {
        clearFieldError('username');
    }
}

function validatePassword() {
    const password = document.getElementById('password').value;
    
    if (password && password.length < 6) {
        showFieldError('password', 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে');
    } else {
        clearFieldError('password');
    }
}

// Show field error
function showFieldError(fieldName, message) {
    const errorElement = document.getElementById(fieldName + 'Error');
    const inputElement = document.getElementById(fieldName);

    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }

    if (inputElement) {
        inputElement.classList.add('error');
        // Add shake animation
        inputElement.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            inputElement.style.animation = '';
        }, 500);
    }
}

// Clear field error
function clearFieldError(fieldName) {
    const errorElement = document.getElementById(fieldName + 'Error');
    const inputElement = document.getElementById(fieldName);

    if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.remove('show');
    }

    if (inputElement) {
        inputElement.classList.remove('error');
    }
}

// Toggle password visibility (login specific)
function toggleLoginPassword() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('passwordToggleIcon');

    if (!passwordInput || !toggleIcon) {
        console.error('Password input or toggle icon not found');
        return;
    }

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
}

// Show/hide alert
function showAlert(message, type = 'error') {
    const alertBox = document.getElementById('alertBox');
    const alertMessage = document.getElementById('alertMessage');
    
    if (alertBox && alertMessage) {
        // Remove existing classes
        alertBox.classList.remove('alert-error', 'alert-success', 'alert-warning');
        
        // Add appropriate class
        alertBox.classList.add(`alert-${type}`);
        
        // Set message
        alertMessage.textContent = message;
        
        // Show alert
        alertBox.classList.remove('hidden');
        
        // Auto hide after 5 seconds for success messages
        if (type === 'success') {
            setTimeout(() => {
                hideAlert();
            }, 5000);
        }
    }
}

function hideAlert() {
    const alertBox = document.getElementById('alertBox');
    if (alertBox) {
        alertBox.classList.add('hidden');
    }
}

// Loading state management
function showLoadingState() {
    isLoading = true;
    
    const loginButton = document.querySelector('.btn-login');
    const buttonText = document.getElementById('loginButtonText');
    const loadingOverlay = document.getElementById('loadingOverlay');
    
    // Disable form
    if (loginButton) {
        loginButton.disabled = true;
    }
    
    if (buttonText) {
        buttonText.innerHTML = '<i class="fas fa-spinner fa-spin"></i> লগইন হচ্ছে...';
    }
    
    // Show loading overlay
    if (loadingOverlay) {
        loadingOverlay.classList.remove('hidden');
    }
}

function hideLoadingState() {
    isLoading = false;
    
    const loginButton = document.querySelector('.btn-login');
    const buttonText = document.getElementById('loginButtonText');
    const loadingOverlay = document.getElementById('loadingOverlay');
    
    // Enable form
    if (loginButton) {
        loginButton.disabled = false;
    }
    
    if (buttonText) {
        buttonText.innerHTML = '<i class="fas fa-sign-in-alt"></i> লগইন করুন';
    }
    
    // Hide loading overlay
    if (loadingOverlay) {
        loadingOverlay.classList.add('hidden');
    }
}

// Forgot password modal
function showForgotPassword() {
    const modal = document.getElementById('forgotPasswordModal');
    if (modal) {
        modal.classList.add('active');
        
        // Focus on input
        setTimeout(() => {
            const input = document.getElementById('resetContact');
            if (input) input.focus();
        }, 300);
    }
}

function closeForgotPassword() {
    const modal = document.getElementById('forgotPasswordModal');
    if (modal) {
        modal.classList.remove('active');
        
        // Reset form
        const form = document.getElementById('forgotPasswordForm');
        if (form) form.reset();
    }
}

// Setup forgot password form
function setupForgotPasswordForm() {
    const form = document.getElementById('forgotPasswordForm');
    
    if (form) {
        form.addEventListener('submit', handleForgotPassword);
    }
}

// Handle forgot password
async function handleForgotPassword(e) {
    e.preventDefault();
    
    const contact = document.getElementById('resetContact').value.trim();
    
    if (!contact) {
        alert('অনুগ্রহ করে ফোন নম্বর বা ইমেইল দিন');
        return;
    }
    
    // Validate contact (simple validation)
    const phoneRegex = /^01[3-9]\d{8}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!phoneRegex.test(contact) && !emailRegex.test(contact)) {
        alert('সঠিক ফোন নম্বর বা ইমেইল দিন');
        return;
    }
    
    // Simulate password reset (in real app, send to server)
    try {
        // Show loading
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'পাঠানো হচ্ছে...';
        submitBtn.disabled = true;
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        alert('পাসওয়ার্ড রিসেট লিংক পাঠানো হয়েছে! অনুগ্রহ করে আপনার ফোন বা ইমেইল চেক করুন।');
        
        closeForgotPassword();
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
    } catch (error) {
        alert('সমস্যা হয়েছে। আবার চেষ্টা করুন।');
        
        // Reset button
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.textContent = 'রিসেট লিংক পাঠান';
        submitBtn.disabled = false;
    }
}

// Open WhatsApp support
function openWhatsApp() {
    const phoneNumber = '8801600000000'; // Replace with actual support number
    const message = 'MediMap ফার্মাসি লগইন সাহায্য প্রয়োজন';
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// Load remembered username
function loadRememberedUsername() {
    const rememberedUsername = localStorage.getItem('rememberedUsername');
    const usernameInput = document.getElementById('username');
    const rememberCheckbox = document.getElementById('rememberMe');
    
    if (rememberedUsername && usernameInput) {
        usernameInput.value = rememberedUsername;
        
        if (rememberCheckbox) {
            rememberCheckbox.checked = true;
        }
        
        // Focus on password field
        const passwordInput = document.getElementById('password');
        if (passwordInput) {
            passwordInput.focus();
        }
    }
}

// Add login activity
function addLoginActivity(pharmacyId) {
    try {
        const activities = JSON.parse(localStorage.getItem(`activities_${pharmacyId}`) || '[]');
        
        const loginActivity = {
            type: 'login',
            text: 'অ্যাকাউন্টে লগইন করেছেন',
            time: 'এইমাত্র',
            icon: 'fa-sign-in-alt'
        };
        
        activities.unshift(loginActivity);
        
        // Keep only last 10 activities
        if (activities.length > 10) {
            activities.splice(10);
        }
        
        localStorage.setItem(`activities_${pharmacyId}`, JSON.stringify(activities));
    } catch (error) {
        console.error('Error adding login activity:', error);
    }
}

// Setup UI enhancements
function setupUIEnhancements() {
    // Add entrance animations
    const loginCard = document.querySelector('.login-card');
    const loginInfo = document.querySelector('.login-info');
    
    if (loginCard) {
        loginCard.classList.add('fade-in');
    }
    
    if (loginInfo) {
        setTimeout(() => {
            loginInfo.classList.add('slide-up');
        }, 200);
    }
    
    // Setup form input animations
    const inputs = document.querySelectorAll('.form-input');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
        
        // Check if already has value
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });
    
    // Click outside modal to close
    const modal = document.getElementById('forgotPasswordModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeForgotPassword();
            }
        });
    }
    
    // ESC key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeForgotPassword();
        }
    });
}

// Demo login helper (for development)
function demoLogin(username = 'popular_pharmacy') {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        document.getElementById('username').value = username;
        document.getElementById('password').value = '123456';
        console.log('Demo login credentials filled. Username: ' + username + ', Password: 123456');
    }
}

// Auto-fill demo credentials on double-click (for development)
document.addEventListener('dblclick', (e) => {
    if (e.target.classList.contains('login-card')) {
        demoLogin();
    }
});

// Handle form submission with Enter key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        const activeElement = document.activeElement;
        
        if (activeElement && activeElement.classList.contains('form-input')) {
            const form = activeElement.closest('form');
            if (form && form.id === 'loginForm') {
                e.preventDefault();
                handleLogin(e);
            }
        }
    }
});


// Cleanup function
window.addEventListener('beforeunload', () => {
    // Clean up any pending operations
    if (isLoading) {
        hideLoadingState();
    }
});