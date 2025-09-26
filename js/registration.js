// MediMap Pharmacy Registration JavaScript

// Global variables
let currentStep = 1;
let totalSteps = 4;
let isSubmitting = false;
let formData = {};
let selectedMedicines = [];
let userLocation = null;

// Initialize registration page
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Starting registration setup');

    // Check if already logged in
    checkExistingLogin();

    // Setup multi-step form
    setupMultiStepForm();
    
    // Setup form validation
    setupFormValidation();
    
    // Setup file uploads
    setupFileUploads();
    
    // Setup medicine selection
    setupMedicineSelection();
    
    // Setup location services
    setupLocationServices();
    
    // Setup UI enhancements
    setupUIEnhancements();
});

// Check if user is already logged in
function checkExistingLogin() {
    const loggedInPharmacy = localStorage.getItem('loggedInPharmacy');
    
    if (loggedInPharmacy) {
        if (confirm('আপনি ইতিমধ্যে লগইন আছেন। ড্যাশবোর্ডে যেতে চান?')) {
            window.location.href = 'admin-dashboard.html';
        }
    }
}

// Setup multi-step form
function setupMultiStepForm() {
    updateStepIndicator();
    showStep(currentStep);
    
    // Improved event delegation for navigation buttons
    document.addEventListener('click', function(e) {
        // Handle next button clicks
        if (e.target.classList.contains('btn-next') || e.target.closest('.btn-next')) {
            e.preventDefault();
            handleNextStep(e);
        }
        
        // Handle previous button clicks
        if (e.target.classList.contains('btn-prev') || e.target.closest('.btn-prev')) {
            e.preventDefault();
            handlePrevStep(e);
        }
    });
    
    // Setup form submission
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        registrationForm.addEventListener('submit', handleRegistration);
    }
}

// Handle next step - SIMPLIFIED VERSION
async function handleNextStep(e) {
    console.log('=== NEXT BUTTON CLICKED ===');
    console.log('Current step:', currentStep);
    
    if (isSubmitting) {
        console.log('Already submitting, returning');
        return;
    }

    // Validate current step
    const isValid = await validateCurrentStep();
    console.log('Validation result:', isValid);

    if (isValid) {
        // Save current step data
        saveStepData();

        // Move to next step
        if (currentStep < totalSteps) {
            currentStep++;
            console.log('Moving to step:', currentStep);
            showStep(currentStep);
            updateStepIndicator();
            scrollToTop();
        } else {
            console.log('Already at last step');
        }
    } else {
        console.log('Validation failed for step:', currentStep);
        // Show first error message prominently
        const firstError = document.querySelector('.form-error:not([style*="display: none"])');
        if (firstError) {
            showAlert(firstError.textContent, 'error');
        }
    }
}

// Handle previous step
function handlePrevStep(e) {
    console.log('Previous button clicked');
    
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
        updateStepIndicator();
        scrollToTop();
    }
}

// Show specific step
function showStep(step) {
    console.log('Showing step:', step);
    
    // Hide all steps
    const steps = document.querySelectorAll('.form-step');
    steps.forEach((stepEl, index) => {
        if (index + 1 === step) {
            stepEl.style.display = 'block';
            stepEl.classList.add('active');
        } else {
            stepEl.style.display = 'none';
            stepEl.classList.remove('active');
        }
    });
    
    // Update step title
    const stepTitles = [
        'ফার্মাসি তথ্য',
        'মালিকের তথ্য',
        'ওষুধ নির্বাচন',
        'নিশ্চিতকরণ'
    ];
    
    const stepTitle = document.querySelector('.step-title');
    if (stepTitle) {
        stepTitle.textContent = `ধাপ ${step}: ${stepTitles[step - 1]}`;
    }
    
    // Load step-specific data
    loadStepData(step);
}

// Update step indicator
function updateStepIndicator() {
    const indicators = document.querySelectorAll('.step-indicator');
    
    indicators.forEach((indicator, index) => {
        const stepNumber = index + 1;
        
        if (stepNumber < currentStep) {
            indicator.classList.add('completed');
            indicator.classList.remove('active');
        } else if (stepNumber === currentStep) {
            indicator.classList.add('active');
            indicator.classList.remove('completed');
        } else {
            indicator.classList.remove('active', 'completed');
        }
    });
    
    // Update progress bar
    const progressBar = document.querySelector('.progress-fill');
    if (progressBar) {
        const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;
        progressBar.style.width = `${progress}%`;
    }
}

// Validate current step - SIMPLIFIED
async function validateCurrentStep() {
    console.log('Validating step:', currentStep);
    
    let isValid = false;
    
    switch (currentStep) {
        case 1:
            isValid = validateStep1();
            break;
        case 2:
            isValid = await validateStep2();
            break;
        case 3:
            isValid = validateStep3();
            break;
        case 4:
            isValid = validateStep4();
            break;
        default:
            isValid = true;
    }
    
    console.log('Step validation result:', isValid);
    return isValid;
}

// Validate Step 1: Pharmacy Information - SIMPLIFIED
function validateStep1() {
    console.log('Validating step 1');
    
    // Clear previous errors
    clearStepErrors();
    
    // Required fields with simple validation
    const requiredFields = [
        { id: 'pharmacyName', name: 'ফার্মাসির নাম' },
        { id: 'pharmacyAddress', name: 'ঠিকানা' },
        { id: 'pharmacyPhone', name: 'ফোন নম্বর' }
    ];
    
    let isValid = true;
    
    // Check required fields
    requiredFields.forEach(field => {
        const input = document.getElementById(field.id);
        if (!input || !input.value.trim()) {
            showFieldError(field.id, `${field.name} প্রয়োজন`);
            isValid = false;
            return;
        }
    });
    
    if (!isValid) return false;
    
    // Validate phone number format
    const phone = document.getElementById('pharmacyPhone').value.trim();
    const phoneRegex = /^01[3-9]\d{8}$/;
    if (!phoneRegex.test(phone)) {
        showFieldError('pharmacyPhone', 'সঠিক ফোন নম্বর দিন (যেমন: 01712345678)');
        isValid = false;
    }
    
    // Validate time if not 24 hours
    const is24Hours = document.getElementById('is24Hours').checked;
    if (!is24Hours) {
        const openTime = document.getElementById('openTime').value;
        const closeTime = document.getElementById('closeTime').value;
        
        if (!openTime || !closeTime) {
            showFieldError('openTime', 'খোলা এবং বন্ধের সময় প্রয়োজন');
            isValid = false;
        } else if (openTime >= closeTime) {
            showFieldError('closeTime', 'বন্ধের সময় খোলার সময়ের পরে হতে হবে');
            isValid = false;
        }
    }
    
    console.log('Step 1 validation result:', isValid);
    return isValid;
}

// Validate Step 2: Owner Information - SIMPLIFIED
async function validateStep2() {
    console.log('Validating step 2');
    
    clearStepErrors();
    
    // Required fields
    const requiredFields = [
        { id: 'ownerName', name: 'মালিকের নাম' },
        { id: 'ownerPhone', name: 'মালিকের ফোন' },
        { id: 'ownerNID', name: 'এনআইডি নম্বর' },
        { id: 'username', name: 'ইউজারনেম' },
        { id: 'password', name: 'পাসওয়ার্ড' },
        { id: 'confirmPassword', name: 'পাসওয়ার্ড নিশ্চিতকরণ' }
    ];
    
    let isValid = true;
    
    // Check required fields
    requiredFields.forEach(field => {
        const input = document.getElementById(field.id);
        if (!input || !input.value.trim()) {
            showFieldError(field.id, `${field.name} প্রয়োজন`);
            isValid = false;
        }
    });
    
    if (!isValid) return false;
    
    // Validate phone number
    const ownerPhone = document.getElementById('ownerPhone').value.trim();
    const phoneRegex = /^01[3-9]\d{8}$/;
    if (!phoneRegex.test(ownerPhone)) {
        showFieldError('ownerPhone', 'সঠিক ফোন নম্বর দিন');
        isValid = false;
    }
    
    // Validate NID
    const nid = document.getElementById('ownerNID').value.trim();
    if (nid.length < 10 || nid.length > 17) {
        showFieldError('ownerNID', 'সঠিক জাতীয় পরিচয়পত্র নম্বর দিন (১০-১৭ ডিজিট)');
        isValid = false;
    }
    
    // Validate username
    const username = document.getElementById('username').value.trim();
    if (username.length < 3) {
        showFieldError('username', 'ইউজারনেম কমপক্ষে ৩ অক্ষরের হতে হবে');
        isValid = false;
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        showFieldError('username', 'ইউজারনেমে শুধু ইংরেজি অক্ষর, সংখ্যা এবং আন্ডারস্কোর ব্যবহার করুন');
        isValid = false;
    }
    
    // Validate password
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password.length < 6) {
        showFieldError('password', 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে');
        isValid = false;
    }
    
    if (password !== confirmPassword) {
        showFieldError('confirmPassword', 'পাসওয়ার্ড মিলছে না');
        isValid = false;
    }
    
    // If basic validation passed, check username availability
    if (isValid && username) {
        const usernameAvailable = await checkUsernameAvailability(username);
        if (!usernameAvailable) {
            isValid = false;
        }
    }
    
    console.log('Step 2 validation result:', isValid);
    return isValid;
}

// Check username availability
async function checkUsernameAvailability(username) {
    return new Promise((resolve) => {
        console.log('Checking username availability:', username);
        
        // Simulate API call with timeout
        setTimeout(() => {
            // Simple local check - in real app, this would be an API call
            const storedPharmacies = JSON.parse(localStorage.getItem('pharmacies') || '[]');
            const existingPharmacy = storedPharmacies.find(p => p.username === username);
            
            if (existingPharmacy) {
                showFieldError('username', 'এই ইউজারনেম ইতিমধ্যে ব্যবহৃত হয়েছে');
                resolve(false);
            } else {
                clearFieldError('username');
                showFieldSuccess('username', 'ইউজারনেম উপলব্ধ');
                resolve(true);
            }
        }, 500);
    });
}

// Validate Step 3: Medicine Selection
function validateStep3() {
    console.log('Validating step 3 - Selected medicines:', selectedMedicines.length);
    
    if (selectedMedicines.length === 0) {
        showAlert('কমপক্ষে একটি ওষুধ নির্বাচন করুন', 'error');
        return false;
    }
    
    if (selectedMedicines.length < 5) {
        const proceed = confirm('আপনি ৫টির কম ওষুধ নির্বাচন করেছেন। এটি কাস্টমারদের জন্য সীমিত বিকল্প হতে পারে। এগিয়ে যেতে চান?');
        return proceed;
    }
    
    return true;
}

// Validate Step 4: Confirmation
function validateStep4() {
    const agreementCheck = document.getElementById('agreement');
    
    if (!agreementCheck || !agreementCheck.checked) {
        showAlert('শর্তাবলী স্বীকার করুন', 'error');
        return false;
    }
    
    return true;
}

// Save current step data
function saveStepData() {
    console.log('Saving step data for step:', currentStep);
    
    switch (currentStep) {
        case 1:
            saveStep1Data();
            break;
        case 2:
            saveStep2Data();
            break;
        case 3:
            saveStep3Data();
            break;
    }
}

// Save Step 1 data
function saveStep1Data() {
    formData = {
        ...formData,
        pharmacyName: document.getElementById('pharmacyName').value.trim(),
        pharmacyAddress: document.getElementById('pharmacyAddress').value.trim(),
        pharmacyPhone: document.getElementById('pharmacyPhone').value.trim(),
        pharmacyEmail: document.getElementById('pharmacyEmail').value.trim(),
        openTime: document.getElementById('openTime').value,
        closeTime: document.getElementById('closeTime').value,
        is24Hours: document.getElementById('is24Hours').checked,
        hasDelivery: document.getElementById('hasDelivery').checked,
        hasOxygen: document.getElementById('hasOxygen').checked,
        hasEmergency: document.getElementById('hasEmergency').checked
    };
    
    // Generate opening hours text
    if (formData.is24Hours) {
        formData.openingHours = '২৪ ঘন্টা খোলা';
    } else {
        formData.openingHours = `সকাল ${convertTo12Hour(formData.openTime)} - ${convertTo12Hour(formData.closeTime)}`;
    }
}

// Save Step 2 data
function saveStep2Data() {
    formData = {
        ...formData,
        ownerName: document.getElementById('ownerName').value.trim(),
        ownerPhone: document.getElementById('ownerPhone').value.trim(),
        ownerNID: document.getElementById('ownerNID').value.trim(),
        ownerEmail: document.getElementById('ownerEmail').value.trim(),
        username: document.getElementById('username').value.trim(),
        password: document.getElementById('password').value
    };
}

// Save Step 3 data
function saveStep3Data() {
    formData.selectedMedicines = [...selectedMedicines];
}

// Load step data
function loadStepData(step) {
    console.log('Loading data for step:', step);
    
    switch (step) {
        case 1:
            loadStep1Data();
            break;
        case 2:
            loadStep2Data();
            break;
        case 3:
            loadStep3Data();
            break;
        case 4:
            loadStep4Data();
            break;
    }
}

// Load Step 1 data
function loadStep1Data() {
    if (formData.pharmacyName) {
        document.getElementById('pharmacyName').value = formData.pharmacyName;
        document.getElementById('pharmacyAddress').value = formData.pharmacyAddress || '';
        document.getElementById('pharmacyPhone').value = formData.pharmacyPhone || '';
        document.getElementById('pharmacyEmail').value = formData.pharmacyEmail || '';
        document.getElementById('openTime').value = formData.openTime || '';
        document.getElementById('closeTime').value = formData.closeTime || '';
        document.getElementById('is24Hours').checked = formData.is24Hours || false;
        document.getElementById('hasDelivery').checked = formData.hasDelivery || false;
        document.getElementById('hasOxygen').checked = formData.hasOxygen || false;
        document.getElementById('hasEmergency').checked = formData.hasEmergency || false;
    }
}

// Load Step 2 data
function loadStep2Data() {
    if (formData.ownerName) {
        document.getElementById('ownerName').value = formData.ownerName;
        document.getElementById('ownerPhone').value = formData.ownerPhone || '';
        document.getElementById('ownerNID').value = formData.ownerNID || '';
        document.getElementById('ownerEmail').value = formData.ownerEmail || '';
        document.getElementById('username').value = formData.username || '';
        document.getElementById('password').value = formData.password || '';
        document.getElementById('confirmPassword').value = formData.password || '';
    }
}

// Load Step 3 data
function loadStep3Data() {
    updateMedicineSelection();
}

// Load Step 4 data - Show summary
function loadStep4Data() {
    const summary = document.getElementById('registrationSummary');
    if (!summary) return;
    
    summary.innerHTML = `
        <div class="summary-section">
            <h4><i class="fas fa-store"></i> ফার্মাসি তথ্য</h4>
            <div class="summary-item">
                <strong>নাম:</strong> ${formData.pharmacyName}
            </div>
            <div class="summary-item">
                <strong>ঠিকানা:</strong> ${formData.pharmacyAddress}
            </div>
            <div class="summary-item">
                <strong>ফোন:</strong> ${formData.pharmacyPhone}
            </div>
            <div class="summary-item">
                <strong>সময়:</strong> ${formData.openingHours}
            </div>
        </div>
        
        <div class="summary-section">
            <h4><i class="fas fa-user"></i> মালিকের তথ্য</h4>
            <div class="summary-item">
                <strong>নাম:</strong> ${formData.ownerName}
            </div>
            <div class="summary-item">
                <strong>ফোন:</strong> ${formData.ownerPhone}
            </div>
            <div class="summary-item">
                <strong>ইউজারনেম:</strong> ${formData.username}
            </div>
        </div>
        
        <div class="summary-section">
            <h4><i class="fas fa-pills"></i> নির্বাচিত ওষুধ</h4>
            <div class="summary-item">
                <strong>মোট:</strong> ${selectedMedicines.length}টি ওষুধ
            </div>
            <div class="medicine-summary">
                ${selectedMedicines.slice(0, 10).map(med => `<span class="medicine-tag">${med.name}</span>`).join('')}
                ${selectedMedicines.length > 10 ? `<span class="more-medicines">+${selectedMedicines.length - 10} আরও</span>` : ''}
            </div>
        </div>
    `;
}

// Setup medicine selection
function setupMedicineSelection() {
    // Common medicines with categories
    const medicines = [
        { name: 'নাপা', category: 'fever', uses: ['জ্বর', 'ব্যথা'] },
        { name: 'নাপা এক্সট্রা', category: 'fever', uses: ['জ্বর', 'ব্যথা'] },
        { name: 'হিস্টাসিন', category: 'allergy', uses: ['এলার্জি', 'সর্দি'] },
        { name: 'ফেক্সো', category: 'allergy', uses: ['এলার্জি'] },
        { name: 'সার্জেল', category: 'pain', uses: ['মাথা ব্যথা', 'ব্যথা'] },
        { name: 'এসি', category: 'fever', uses: ['জ্বর', 'ব্যথা'] },
        { name: 'ওরস্যালাইন', category: 'gastric', uses: ['ডায়রিয়া'] },
        { name: 'ফ্লেক্সি', category: 'pain', uses: ['শরীর ব্যথা'] },
        { name: 'অ্যান্টাসিড', category: 'gastric', uses: ['গ্যাস্ট্রিক'] },
        { name: 'ওমিপ্রাজল', category: 'gastric', uses: ['গ্যাস্ট্রিক'] }
    ];
    
    // Create medicine grid
    const medicineGrid = document.getElementById('medicineGrid');
    if (medicineGrid) {
        medicineGrid.innerHTML = medicines.map(medicine => `
            <div class="medicine-card" data-medicine='${JSON.stringify(medicine)}'>
                <div class="medicine-icon">
                    <i class="fas fa-pills"></i>
                </div>
                <div class="medicine-info">
                    <h4>${medicine.name}</h4>
                    <p>${medicine.uses.join(', ')}</p>
                </div>
                <div class="medicine-checkbox">
                    <input type="checkbox" id="med_${medicine.name}" value="${medicine.name}">
                    <label for="med_${medicine.name}"></label>
                </div>
            </div>
        `).join('');
        
        // Add click handlers
        const medicineCards = medicineGrid.querySelectorAll('.medicine-card');
        medicineCards.forEach(card => {
            card.addEventListener('click', toggleMedicineSelection);
        });
    }
    
    // Setup search functionality
    const medicineSearch = document.getElementById('medicineSearch');
    if (medicineSearch) {
        medicineSearch.addEventListener('input', filterMedicines);
    }
    
    // Setup category filter
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterMedicines);
    }
}

// Toggle medicine selection
function toggleMedicineSelection(e) {
    const card = e.currentTarget;
    const checkbox = card.querySelector('input[type="checkbox"]');
    const medicineData = JSON.parse(card.dataset.medicine);
    
    // Prevent double toggle when clicking checkbox directly
    if (e.target.type !== 'checkbox') {
        checkbox.checked = !checkbox.checked;
    }
    
    if (checkbox.checked) {
        card.classList.add('selected');
        if (!selectedMedicines.some(m => m.name === medicineData.name)) {
            selectedMedicines.push(medicineData);
        }
    } else {
        card.classList.remove('selected');
        selectedMedicines = selectedMedicines.filter(m => m.name !== medicineData.name);
    }
    
    updateMedicineCount();
}

// Update medicine selection UI
function updateMedicineSelection() {
    const medicineCards = document.querySelectorAll('.medicine-card');
    
    medicineCards.forEach(card => {
        const medicineData = JSON.parse(card.dataset.medicine);
        const checkbox = card.querySelector('input[type="checkbox"]');
        
        const isSelected = selectedMedicines.some(m => m.name === medicineData.name);
        
        if (isSelected) {
            card.classList.add('selected');
            checkbox.checked = true;
        } else {
            card.classList.remove('selected');
            checkbox.checked = false;
        }
    });
    
    updateMedicineCount();
}

// Update medicine count
function updateMedicineCount() {
    const countElement = document.getElementById('selectedMedicineCount');
    if (countElement) {
        countElement.textContent = selectedMedicines.length;
    }
}

// Filter medicines
function filterMedicines() {
    const searchTerm = document.getElementById('medicineSearch').value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value;
    const medicineCards = document.querySelectorAll('.medicine-card');
    
    medicineCards.forEach(card => {
        const medicineData = JSON.parse(card.dataset.medicine);
        const matchesSearch = medicineData.name.toLowerCase().includes(searchTerm) ||
                            medicineData.uses.some(use => use.toLowerCase().includes(searchTerm));
        const matchesCategory = !categoryFilter || medicineData.category === categoryFilter;
        
        if (matchesSearch && matchesCategory) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Setup file uploads
function setupFileUploads() {
    // Owner photo upload
    const ownerPhotoInput = document.getElementById('ownerPhoto');
    const ownerPhotoPreview = document.getElementById('ownerPhotoPreview');
    
    if (ownerPhotoInput) {
        ownerPhotoInput.addEventListener('change', (e) => {
            handleFilePreview(e, ownerPhotoPreview);
        });
    }
    
    // License upload
    const licenseInput = document.getElementById('pharmacyLicense');
    const licensePreview = document.getElementById('licensePreview');
    
    if (licenseInput) {
        licenseInput.addEventListener('change', (e) => {
            handleFilePreview(e, licensePreview);
        });
    }
}

// Handle file preview
function handleFilePreview(event, previewElement) {
    const file = event.target.files[0];
    
    if (!file) return;
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('ফাইলের সাইজ ৫ MB এর বেশি হতে পারবে না');
        event.target.value = '';
        return;
    }
    
    // Show preview for images
    if (file.type.startsWith('image/') && previewElement) {
        const reader = new FileReader();
        reader.onload = (e) => {
            previewElement.innerHTML = `
                <img src="${e.target.result}" alt="Preview" style="max-width: 200px; max-height: 200px; border-radius: 8px;">
                <p>${file.name}</p>
            `;
        };
        reader.readAsDataURL(file);
    } else if (previewElement) {
        // Show file info for non-images
        previewElement.innerHTML = `
            <div class="file-info">
                <i class="fas fa-file"></i>
                <p>${file.name}</p>
                <small>${(file.size / 1024 / 1024).toFixed(2)} MB</small>
            </div>
        `;
    }
}

// Setup location services
function setupLocationServices() {
    const getLocationBtn = document.getElementById('getLocationBtn');
    
    if (getLocationBtn) {
        getLocationBtn.addEventListener('click', getCurrentLocation);
    }
}

// Get current location
function getCurrentLocation() {
    const locationBtn = document.getElementById('getLocationBtn');
    const locationStatus = document.getElementById('locationStatus');
    
    if (!navigator.geolocation) {
        alert('আপনার ব্রাউজার জিও-লোকেশন সাপোর্ট করে না');
        return;
    }
    
    // Show loading
    if (locationBtn) {
        locationBtn.disabled = true;
        locationBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> খুঁজছি...';
    }
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            userLocation = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            };
            
            // Update UI
            if (locationStatus) {
                locationStatus.innerHTML = `
                    <i class="fas fa-check-circle" style="color: green;"></i>
                    অবস্থান পাওয়া গেছে
                `;
            }
            
            // Reset button
            if (locationBtn) {
                locationBtn.disabled = false;
                locationBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> অবস্থান পাওয়া গেছে';
            }
        },
        (error) => {
            alert('অবস্থান খুঁজে পাওয়া যায়নি। ম্যানুয়ালি ঠিকানা দিন।');
            
            // Reset button
            if (locationBtn) {
                locationBtn.disabled = false;
                locationBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> আবার চেষ্টা করুন';
            }
        }
    );
}

// Setup form validation
function setupFormValidation() {
    // Real-time validation for username
    const usernameInput = document.getElementById('username');
    if (usernameInput) {
        usernameInput.addEventListener('input', debounce(validateUsernameRealTime, 500));
    }
    
    // Password strength indicator
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('input', showPasswordStrength);
    }
    
    // Confirm password validation
    const confirmPasswordInput = document.getElementById('confirmPassword');
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', validatePasswordMatch);
    }
}

// Real-time username validation
async function validateUsernameRealTime() {
    const username = document.getElementById('username').value.trim();
    
    if (username.length < 3) {
        return;
    }
    
    await checkUsernameAvailability(username);
}

// Show password strength
function showPasswordStrength() {
    const password = document.getElementById('password').value;
    const strengthIndicator = document.getElementById('passwordStrength');
    
    if (!strengthIndicator) return;
    
    let strength = 0;
    let message = '';
    let color = '';
    
    if (password.length >= 6) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    switch (strength) {
        case 0:
        case 1:
            message = 'দুর্বল';
            color = '#ef4444';
            break;
        case 2:
            message = 'মধ্যম';
            color = '#f59e0b';
            break;
        case 3:
            message = 'ভাল';
            color = '#10b981';
            break;
        case 4:
            message = 'চমৎকার';
            color = '#059669';
            break;
    }
    
    strengthIndicator.innerHTML = `
        <div class="strength-bar" style="background: ${color}; width: ${(strength / 4) * 100}%;"></div>
        <span style="color: ${color};">${message}</span>
    `;
}

// Validate password match
function validatePasswordMatch() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (confirmPassword && password !== confirmPassword) {
        showFieldError('confirmPassword', 'পাসওয়ার্ড মিলছে না');
    } else {
        clearFieldError('confirmPassword');
    }
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showFieldError(fieldName, message) {
    const errorElement = document.getElementById(fieldName + 'Error');
    const inputElement = document.getElementById(fieldName);
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    
    if (inputElement) {
        inputElement.classList.add('error');
    }
}

function showFieldSuccess(fieldName, message) {
    const errorElement = document.getElementById(fieldName + 'Error');
    const inputElement = document.getElementById(fieldName);
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        errorElement.style.color = 'green';
    }
    
    if (inputElement) {
        inputElement.classList.remove('error');
    }
}

function clearFieldError(fieldName) {
    const errorElement = document.getElementById(fieldName + 'Error');
    const inputElement = document.getElementById(fieldName);
    
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
    
    if (inputElement) {
        inputElement.classList.remove('error');
    }
}

function clearStepErrors() {
    const errorElements = document.querySelectorAll('.form-error');
    errorElements.forEach(el => {
        el.textContent = '';
        el.style.display = 'none';
    });
    
    const inputElements = document.querySelectorAll('.error');
    inputElements.forEach(el => {
        el.classList.remove('error');
    });
}

function showAlert(message, type = 'error') {
    // Simple alert for now
    alert(message);
}

function convertTo12Hour(time24) {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'রাত' : 'সকাল';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Handle final registration
async function handleRegistration(e) {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    // Final validation
    if (!validateStep4()) {
        return;
    }
    
    showSubmittingState();
    
    try {
        // Simple registration for demo
        const registrationData = {
            ...formData,
            medicines: selectedMedicines,
            registeredAt: new Date().toISOString()
        };
        
        // Store in localStorage
        const pharmacies = JSON.parse(localStorage.getItem('pharmacies') || '[]');
        const newPharmacy = {
            id: 'pharmacy_' + Date.now(),
            ...registrationData
        };
        
        pharmacies.push(newPharmacy);
        localStorage.setItem('pharmacies', JSON.stringify(pharmacies));
        
        // Auto login
        localStorage.setItem('loggedInPharmacy', JSON.stringify(newPharmacy));
        
        showSuccessMessage();
        
    } catch (error) {
        console.error('Registration error:', error);
        showAlert('নিবন্ধনে সমস্যা হয়েছে। আবার চেষ্টা করুন।', 'error');
    } finally {
        hideSubmittingState();
    }
}

// Loading states
function showSubmittingState() {
    isSubmitting = true;
    
    const submitBtn = document.querySelector('.btn-submit');
    const loadingOverlay = document.getElementById('loadingOverlay');
    
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> নিবন্ধন করা হচ্ছে...';
    }
    
    if (loadingOverlay) {
        loadingOverlay.classList.remove('hidden');
    }
}

function hideSubmittingState() {
    isSubmitting = false;
    
    const submitBtn = document.querySelector('.btn-submit');
    const loadingOverlay = document.getElementById('loadingOverlay');
    
    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-check"></i> নিবন্ধন সম্পন্ন করুন';
    }
    
    if (loadingOverlay) {
        loadingOverlay.classList.add('hidden');
    }
}

function showSuccessMessage() {
    const successMessage = document.getElementById('successMessage');
    const registrationForm = document.getElementById('registrationForm');
    
    if (successMessage && registrationForm) {
        successMessage.classList.remove('hidden');
        registrationForm.style.display = 'none';
    }
}

// Setup UI enhancements
function setupUIEnhancements() {
    // 24-hour toggle handler
    const is24HoursCheckbox = document.getElementById('is24Hours');
    if (is24HoursCheckbox) {
        is24HoursCheckbox.addEventListener('change', (e) => {
            const timeInputs = document.querySelectorAll('#openTime, #closeTime');
            timeInputs.forEach(input => {
                input.disabled = e.target.checked;
            });
        });
    }
}

// Password toggle function
function togglePassword(fieldId) {
    const input = document.getElementById(fieldId);
    const icon = input.nextElementSibling.querySelector('i');
    
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

// Debug functions
window.debugRegistration = {
    nextStep: handleNextStep,
    setStep: (step) => { 
        currentStep = step; 
        showStep(currentStep);
        updateStepIndicator();
    },
    currentStep: () => currentStep,
    formData: () => formData,
    selectedMedicines: () => selectedMedicines
};

// Emergency navigation functions
window.forceNextStep = function() {
    if (currentStep < totalSteps) {
        currentStep++;
        showStep(currentStep);
        updateStepIndicator();
        scrollToTop();
    }
};

window.forcePrevStep = function() {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
        updateStepIndicator();
        scrollToTop();
    }
};

console.log('Registration script loaded successfully');
// Handle 24-hour checkbox
function handle24HourToggle() {
  const is24HoursCheckbox = document.getElementById('is24Hours');
  const timeInputs = document.querySelectorAll('#openTime, #closeTime');
  const timeContainer = document.querySelector('.time-inputs');
  
  if (is24HoursCheckbox) {
    is24HoursCheckbox.addEventListener('change', (e) => {
      // Toggle time input visibility
      if (timeContainer) {
        timeContainer.style.display = e.target.checked ? 'none' : 'block';
      }
      
      // Disable/enable time inputs
      timeInputs.forEach(input => {
        input.disabled = e.target.checked;
        if (e.target.checked) {
          input.value = ''; // Clear values when disabled
        }
      });
    });
  }
}

// Enhanced location display 
function updateLocationDisplay(position) {
  const locationStatus = document.getElementById('locationStatus');
  
  if (locationStatus) {
    // Try to get location name using reverse geocoding
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=YOUR_API_KEY`)
      .then(response => response.json())
      .then(data => {
        if (data.results && data.results[0]) {
          const address = data.results[0].formatted_address;
          locationStatus.innerHTML = `
            <i class="fas fa-check-circle" style="color: green"></i>
            অবস্থান পাওয়া গেছে:
            <br>
            <strong>${address}</strong>
            <br>
            <small>(${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)})</small>
          `;
        } else {
          // Fallback to coordinates only
          locationStatus.innerHTML = `
            <i class="fas fa-check-circle" style="color: green"></i>
            অবস্থান পাওয়া গেছে:
            <br>
            <strong>অক্ষাংশ: ${position.coords.latitude.toFixed(4)}</strong>
            <br>
            <strong>দ্রাঘিমাংশ: ${position.coords.longitude.toFixed(4)}</strong>
          `;
        }
      })
      .catch(err => {
        // Fallback on error
        locationStatus.innerHTML = `
          <i class="fas fa-check-circle" style="color: green"></i>
          অবস্থান পাওয়া গেছে
          <br>
          (${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)})
        `;
      });
  }
}

// Enhanced location services setup
function setupLocationServices() {
  const getLocationBtn = document.getElementById('getLocationBtn');
  const locationStatus = document.getElementById('locationStatus');

  if (getLocationBtn) {
    getLocationBtn.addEventListener('click', () => {
      if (!navigator.geolocation) {
        showAlert('আপনার ব্রাউজার লোকেশন সাপোর্ট করে না', 'error');
        return;
      }

      // Show loading state
      getLocationBtn.disabled = true;
      getLocationBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> অবস্থান খোঁজা হচ্ছে...';

      if (locationStatus) {
        locationStatus.innerHTML = `
          <i class="fas fa-spinner fa-spin"></i>
          অবস্থান খোঁজা হচ্ছে...
        `;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          userLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };

          // Update location display with address
          updateLocationDisplay(position);

          // Update button state
          getLocationBtn.disabled = false;
          getLocationBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> অবস্থান পাওয়া গেছে';
          getLocationBtn.classList.add('success');
        },
        (error) => {
          console.error('Location error:', error);
          
          if (locationStatus) {
            locationStatus.innerHTML = `
              <i class="fas fa-exclamation-triangle" style="color: #ef4444"></i>
              অবস্থান পাওয়া যায়নি
            `;
          }

          getLocationBtn.disabled = false;
          getLocationBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> আবার চেষ্টা করুন';
          
          let errorMsg = 'অবস্থান পাওয়া যায়নি।';
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMsg += ' অনুমতি প্রয়োজন।';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMsg += ' অবস্থান তথ্য পাওয়া যায়নি।';
              break;
            case error.TIMEOUT:
              errorMsg += ' সময়সীমা শেষ।';
              break;
          }
          showAlert(errorMsg, 'error');
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  }

  // Try to get location automatically on page load
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        userLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        updateLocationDisplay(position);
      },
      (error) => console.log('Auto location failed:', error),
      {enableHighAccuracy: true}
    );
  }
}

// Call this in your initialization code
document.addEventListener('DOMContentLoaded', () => {
  handle24HourToggle();
  setupLocationServices();
  // ... other initialization code
});

// Enhance form validation 
function validateStep1() {
  console.log('Validating step 1');
  let isValid = true;
  clearStepErrors();

  const is24Hours = document.getElementById('is24Hours').checked;
  const requiredFields = [
    'pharmacyName',
    'pharmacyAddress',
    'pharmacyPhone'
  ];

  // Add time fields if not 24 hours
  if (!is24Hours) {
    requiredFields.push('openTime', 'closeTime');
  }

  requiredFields.forEach(fieldName => {
    const field = document.getElementById(fieldName);
    if (!field || !field.value.trim()) {
      showFieldError(fieldName, 'এই তথ্যটি প্রয়োজন');
      isValid = false;
    }
  });

  // Validate phone format
  const phone = document.getElementById('pharmacyPhone').value.trim();
  const phoneRegex = /^01[3-9]\d{8}$/;
  if (phone && !phoneRegex.test(phone)) {
    showFieldError('pharmacyPhone', 'সঠিক ফোন নম্বর দিন (যেমন: 01712345678)');
    isValid = false;
  }

  // Validate time if not 24 hours
  if (!is24Hours) {
    const openTime = document.getElementById('openTime').value;
    const closeTime = document.getElementById('closeTime').value;
    
    if (openTime && closeTime && openTime >= closeTime) {
      showFieldError('closeTime', 'বন্ধের সময় খোলার সময়ের পরে হতে হবে');
      isValid = false;
    }
  }

  return isValid;
}

// Enhanced step transitions
function showStep(step) {
  const steps = document.querySelectorAll('.form-step');
  const stepTitles = [
    'ফার্মাসি তথ্য',
    'মালিকের তথ্য', 
    'ওষুধ নির্বাচন',
    'নিশ্চিতকরণ'
  ];

  // Hide all steps first
  steps.forEach(s => {
    s.style.display = 'none';
    s.classList.remove('active');
  });

  // Show current step with animation
  const currentStep = steps[step - 1];
  if (currentStep) {
    currentStep.style.display = 'block';
    setTimeout(() => {
      currentStep.classList.add('active');
    }, 10);
  }

  // Update title
  const stepTitle = document.querySelector('.step-title');
  if (stepTitle) {
    stepTitle.textContent = `ধাপ ${step}: ${stepTitles[step - 1]}`;
    
    // Add animation
    stepTitle.classList.add('title-change');
    setTimeout(() => {
      stepTitle.classList.remove('title-change');
    }, 500);
  }

  // Load step data
  loadStepData(step);
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
  .form-step {
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.3s ease-out;
  }

  .form-step.active {
    opacity: 1;
    transform: translateY(0);
  }

  .title-change {
    animation: titleFade 0.5s ease-out;
  }

  @keyframes titleFade {
    0% {
      opacity: 0;
      transform: translateY(-10px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);