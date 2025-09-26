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
        // User is already logged in, redirect to dashboard
        if (confirm('আপনি ইতিমধ্যে লগইন আছেন। ড্যাশবোর্ডে যেতে চান?')) {
            window.location.href = 'admin-dashboard.html';
        }
    }
}

// Setup multi-step form
function setupMultiStepForm() {
    updateStepIndicator();
    showStep(currentStep);
    
    // Setup navigation buttons
    const nextButtons = document.querySelectorAll('.btn-next');
    const prevButtons = document.querySelectorAll('.btn-prev');
    
    nextButtons.forEach(btn => {
        btn.addEventListener('click', handleNextStep);
    });
    
    prevButtons.forEach(btn => {
        btn.addEventListener('click', handlePrevStep);
    });
    
    // Setup form submission
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        registrationForm.addEventListener('submit', handleRegistration);
    }
}

// Handle next step
async function handleNextStep(e) {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    // Validate current step
    const isValid = await validateCurrentStep();
    
    if (isValid) {
        // Save current step data
        saveStepData();
        
        // Move to next step
        if (currentStep < totalSteps) {
            currentStep++;
            showStep(currentStep);
            updateStepIndicator();
            scrollToTop();
        }
    }
}

// Handle previous step
function handlePrevStep(e) {
    e.preventDefault();
    
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
        updateStepIndicator();
        scrollToTop();
    }
}

// Show specific step
function showStep(step) {
    // Hide all steps
    const steps = document.querySelectorAll('.form-step');
    steps.forEach((stepEl, index) => {
        if (index + 1 === step) {
            stepEl.classList.add('active');
            stepEl.style.display = 'block';
        } else {
            stepEl.classList.remove('active');
            stepEl.style.display = 'none';
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

// Validate current step
async function validateCurrentStep() {
    switch (currentStep) {
        case 1:
            return validateStep1();
        case 2:
            return validateStep2();
        case 3:
            return validateStep3();
        case 4:
            return validateStep4();
        default:
            return true;
    }
}

// Validate Step 1: Pharmacy Information
function validateStep1() {
    let isValid = true;
    
    // Clear previous errors
    clearStepErrors();
    
    // Required fields
    const requiredFields = [
        'pharmacyName',
        'pharmacyAddress',
        'pharmacyPhone',
        'openTime',
        'closeTime'
    ];
    
    requiredFields.forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (!field || !field.value.trim()) {
            showFieldError(fieldName, 'এই ক্ষেত্রটি পূরণ করুন');
            isValid = false;
        }
    });
    
    // Validate phone number
    const phone = document.getElementById('pharmacyPhone').value.trim();
    const phoneRegex = /^01[3-9]\d{8}$/;
    
    if (phone && !phoneRegex.test(phone)) {
        showFieldError('pharmacyPhone', 'সঠিক ফোন নম্বর দিন (যেমন: 01712345678)');
        isValid = false;
    }
    
    // Validate email if provided
    const email = document.getElementById('pharmacyEmail').value.trim();
    if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showFieldError('pharmacyEmail', 'সঠিক ইমেইল ঠিকানা দিন');
            isValid = false;
        }
    }
    
    // Validate time
    const openTime = document.getElementById('openTime').value;
    const closeTime = document.getElementById('closeTime').value;
    
    if (openTime && closeTime && openTime >= closeTime) {
        showFieldError('closeTime', 'বন্ধের সময় খোলার সময়ের পরে হতে হবে');
        isValid = false;
    }
    
    return isValid;
}

// Validate Step 2: Owner Information
function validateStep2() {
    let isValid = true;
    
    clearStepErrors();
    
    // Required fields
    const requiredFields = [
        'ownerName',
        'ownerPhone',
        'ownerNID',
        'username',
        'password',
        'confirmPassword'
    ];
    
    requiredFields.forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (!field || !field.value.trim()) {
            showFieldError(fieldName, 'এই ক্ষেত্রটি পূরণ করুন');
            isValid = false;
        }
    });
    
    // Validate owner phone
    const ownerPhone = document.getElementById('ownerPhone').value.trim();
    const phoneRegex = /^01[3-9]\d{8}$/;
    
    if (ownerPhone && !phoneRegex.test(ownerPhone)) {
        showFieldError('ownerPhone', 'সঠিক ফোন নম্বর দিন');
        isValid = false;
    }
    
    // Validate NID
    const nid = document.getElementById('ownerNID').value.trim();
    if (nid && (nid.length < 10 || nid.length > 17)) {
        showFieldError('ownerNID', 'সঠিক জাতীয় পরিচয়পত্র নম্বর দিন');
        isValid = false;
    }
    
    // Validate username
    const username = document.getElementById('username').value.trim();
    if (username) {
        if (username.length < 3) {
            showFieldError('username', 'ইউজারনেম কমপক্ষে ৩ অক্ষরের হতে হবে');
            isValid = false;
        } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            showFieldError('username', 'ইউজারনেমে শুধু ইংরেজি অক্ষর, সংখ্যা এবং আন্ডারস্কোর ব্যবহার করুন');
            isValid = false;
        }
    }
    
    // Validate password
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password) {
        if (password.length < 6) {
            showFieldError('password', 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে');
            isValid = false;
        }
        
        if (password !== confirmPassword) {
            showFieldError('confirmPassword', 'পাসওয়ার্ড মিলছে না');
            isValid = false;
        }
    }
    
    // Check username availability
    if (username && isValid) {
        return checkUsernameAvailability(username);
    }
    
    return isValid;
}

// Check username availability
async function checkUsernameAvailability(username) {
    try {
        // Show checking indicator
        const usernameField = document.getElementById('username');
        const originalPlaceholder = usernameField.placeholder;
        usernameField.placeholder = 'চেক করা হচ্ছে...';
        
        // Check with Firebase/localStorage
        let existingPharmacy = null;
        
        if (window.MediMapDB && window.MediMapDB.PharmacyDB) {
            existingPharmacy = await window.MediMapDB.PharmacyDB.getPharmacyByUsername(username);
        } else {
            // Check locally
            const storedPharmacies = JSON.parse(localStorage.getItem('pharmacies') || '[]');
            existingPharmacy = storedPharmacies.find(p => p.username === username);
        }
        
        // Restore placeholder
        usernameField.placeholder = originalPlaceholder;
        
        if (existingPharmacy) {
            showFieldError('username', 'এই ইউজারনেম ইতিমধ্যে ব্যবহৃত হয়েছে');
            return false;
        }
        
        // Show availability
        clearFieldError('username');
        showFieldSuccess('username', 'ইউজারনেম উপলব্ধ');
        
        return true;
        
    } catch (error) {
        console.error('Error checking username:', error);
        showFieldError('username', 'ইউজারনেম চেক করতে সমস্যা হয়েছে');
        return false;
    }
}

// Validate Step 3: Medicine Selection
function validateStep3() {
    if (selectedMedicines.length === 0) {
        showAlert('কমপক্ষে একটি ওষুধ নির্বাচন করুন', 'error');
        return false;
    }
    
    if (selectedMedicines.length < 5) {
        return confirm('আপনি ৫টির কম ওষুধ নির্বাচন করেছেন। এটি কাস্টমারদের জন্য সীমিত বিকল্প হতে পারে। এগিয়ে যেতে চান?');
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
    
    // Handle file uploads
    const ownerPhotoFile = document.getElementById('ownerPhoto').files[0];
    const pharmacyLicenseFile = document.getElementById('pharmacyLicense').files[0];
    
    if (ownerPhotoFile) {
        formData.ownerPhotoFile = ownerPhotoFile;
    }
    
    if (pharmacyLicenseFile) {
        formData.pharmacyLicenseFile = pharmacyLicenseFile;
    }
}

// Save Step 3 data
function saveStep3Data() {
    formData.selectedMedicines = [...selectedMedicines];
}

// Load step data
function loadStepData(step) {
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
    // Update selected medicines UI
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

// Handle final registration
async function handleRegistration(e) {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    // Final validation
    if (!validateStep4()) {
        return;
    }
    
    // Show loading
    showSubmittingState();
    
    try {
        // Prepare registration data
        const registrationData = await prepareRegistrationData();
        
        // Submit to Firebase/localStorage
        const result = await submitRegistration(registrationData);
        
        if (result.success) {
            showSuccessMessage();
            
            // Auto-login after registration
            setTimeout(async () => {
                await autoLogin(formData.username, formData.password);
            }, 3000);
            
        } else {
            showAlert(result.message || 'নিবন্ধন ব্যর্থ হয়েছে', 'error');
        }
        
    } catch (error) {
        console.error('Registration error:', error);
        showAlert('নিবন্ধনে সমস্যা হয়েছে। আবার চেষ্টা করুন।', 'error');
    } finally {
        hideSubmittingState();
    }
}

// Prepare registration data
async function prepareRegistrationData() {
    const data = {
        ...formData,
        medicines: selectedMedicines,
        coordinates: userLocation || getDefaultLocation(),
        registeredAt: new Date().toISOString(),
        isActive: true,
        isVerified: false
    };
    
    // Handle file uploads
    if (formData.ownerPhotoFile) {
        data.ownerPhoto = await convertFileToBase64(formData.ownerPhotoFile);
    }
    
    if (formData.pharmacyLicenseFile) {
        data.pharmacyLicense = await convertFileToBase64(formData.pharmacyLicenseFile);
    }
    
    // Remove password from data (will be stored separately)
    const { password, ...publicData } = data;
    
    return {
        publicData,
        credentials: {
            username: formData.username,
            password: formData.password
        }
    };
}

// Submit registration
async function submitRegistration(data) {
    try {
        if (window.MediMapDB && window.MediMapDB.PharmacyDB) {
            // Submit to Firebase
            return await window.MediMapDB.PharmacyDB.createPharmacy(data.publicData);
        } else {
            // Submit to localStorage
            return submitRegistrationLocal(data);
        }
    } catch (error) {
        console.error('Submit registration error:', error);
        return { success: false, message: 'নিবন্ধনে সমস্যা হয়েছে' };
    }
}

// Submit to localStorage (fallback)
function submitRegistrationLocal(data) {
    try {
        const pharmacies = JSON.parse(localStorage.getItem('pharmacies') || '[]');
        
        const newPharmacy = {
            id: 'pharmacy_' + Date.now(),
            ...data.publicData,
            username: data.credentials.username,
            password: data.credentials.password
        };
        
        pharmacies.push(newPharmacy);
        localStorage.setItem('pharmacies', JSON.stringify(pharmacies));
        
        return { success: true, id: newPharmacy.id };
    } catch (error) {
        console.error('Local registration error:', error);
        return { success: false, message: 'স্থানীয় সংরক্ষণে সমস্যা' };
    }
}

// Convert file to base64
function convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Auto-login after registration
async function autoLogin(username, password) {
    try {
        // Simulate login process
        if (window.MediMapDB && window.MediMapDB.PharmacyDB) {
            const pharmacy = await window.MediMapDB.PharmacyDB.getPharmacyByUsername(username);
            
            if (pharmacy) {
                localStorage.setItem('loggedInPharmacy', JSON.stringify(pharmacy));
                window.location.href = 'admin-dashboard.html';
            }
        } else {
            // Local login
            const pharmacies = JSON.parse(localStorage.getItem('pharmacies') || '[]');
            const pharmacy = pharmacies.find(p => p.username === username);
            
            if (pharmacy) {
                localStorage.setItem('loggedInPharmacy', JSON.stringify(pharmacy));
                window.location.href = 'admin-dashboard.html';
            }
        }
    } catch (error) {
        console.error('Auto-login error:', error);
        // Redirect to login page
        setTimeout(() => {
            window.location.href = 'pharmacy-login.html';
        }, 2000);
    }
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
        selectedMedicines.push(medicineData);
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
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
        alert('শুধুমাত্র JPG, PNG, GIF বা PDF ফাইল আপলোড করুন');
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
    
    // Try to get location automatically
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
                
                // Update UI
                const locationStatus = document.getElementById('locationStatus');
                if (locationStatus) {
                    locationStatus.innerHTML = `
                        <i class="fas fa-check-circle" style="color: green;"></i>
                        অবস্থান পাওয়া গেছে
                    `;
                }
            },
            (error) => {
                console.log('Location not available:', error);
            },
            { timeout: 10000 }
        );
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
                    অবস্থান পাওয়া গেছে (${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)})
                `;
            }
            
            // Reset button
            if (locationBtn) {
                locationBtn.disabled = false;
                locationBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> অবস্থান পাওয়া গেছে';
                locationBtn.classList.add('success');
            }
        },
        (error) => {
            alert('অবস্থান খুঁজে পাওয়া যায়নি। ম্যানুয়ালি ঠিকানা দিন।');
            
            // Reset button
            if (locationBtn) {
                locationBtn.disabled = false;
                locationBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> আবার চেষ্টা করুন';
            }
        },
        { timeout: 15000, enableHighAccuracy: true }
    );
}

// Get default location (Mirpur-1)
function getDefaultLocation() {
    return {
        latitude: 23.7956,
        longitude: 90.3537
    };
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
    
    // Phone number formatting
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', formatPhoneNumber);
    });
}

// Real-time username validation
async function validateUsernameRealTime() {
    const username = document.getElementById('username').value.trim();
    
    if (username.length < 3) {
        return;
    }
    
    // Check availability
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

// Format phone number
function formatPhoneNumber(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    // Bangladesh phone number format
    if (value.startsWith('880')) {
        value = value.substring(3);
    }
    
    if (value.startsWith('0')) {
        // Keep as is
    } else if (value.length >= 10) {
        value = '0' + value;
    }
    
    e.target.value = value;
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
        errorElement.className = 'form-error';
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
        errorElement.className = 'form-success';
    }
    
    if (inputElement) {
        inputElement.classList.remove('error');
        inputElement.classList.add('success');
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
        inputElement.classList.remove('error', 'success');
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
        el.classList.remove('error', 'success');
    });
}

function showAlert(message, type = 'error') {
    const alertBox = document.getElementById('alertBox');
    const alertMessage = document.getElementById('alertMessage');
    
    if (alertBox && alertMessage) {
        alertBox.className = `alert alert-${type}`;
        alertMessage.textContent = message;
        alertBox.style.display = 'flex';
        
        // Auto hide success messages
        if (type === 'success') {
            setTimeout(() => {
                alertBox.style.display = 'none';
            }, 5000);
        }
    } else {
        // Fallback to alert
        alert(message);
    }
}

function convertTo12Hour(time24) {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'রাত' : 'সকাল';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    if (successMessage) {
        successMessage.classList.remove('hidden');
        
        // Hide form
        const registrationForm = document.getElementById('registrationForm');
        if (registrationForm) {
            registrationForm.style.display = 'none';
        }
    } else {
        showAlert('নিবন্ধন সফল হয়েছে! আপনি শীঘ্রই ড্যাশবোর্ডে নিয়ে যাওয়া হবেন।', 'success');
    }
}

// Setup UI enhancements
function setupUIEnhancements() {
    // Add step animations
    const steps = document.querySelectorAll('.form-step');
    steps.forEach((step, index) => {
        if (index === 0) {
            step.classList.add('fade-in');
        }
    });
    
    // 24-hour toggle handler
    const is24HoursCheckbox = document.getElementById('is24Hours');
    if (is24HoursCheckbox) {
        is24HoursCheckbox.addEventListener('change', (e) => {
            const timeInputs = document.querySelectorAll('#openTime, #closeTime');
            timeInputs.forEach(input => {
                input.disabled = e.target.checked;
                if (e.target.checked) {
                    input.value = '';
                }
            });
        });
    }
    
    // Setup keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            // Ctrl+Enter to go to next step
            if (currentStep < totalSteps) {
                document.querySelector('.btn-next')?.click();
            } else {
                document.querySelector('.btn-submit')?.click();
            }
        }
    });
    
    // Setup tooltips
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

// Tooltip functions
function showTooltip(e) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = e.target.getAttribute('data-tooltip');
    document.body.appendChild(tooltip);
    
    const rect = e.target.getBoundingClientRect();
    tooltip.style.left = rect.left + 'px';
    tooltip.style.top = (rect.top - tooltip.offsetHeight - 5) + 'px';
}

function hideTooltip() {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

// Form data persistence (save to localStorage on page unload)
window.addEventListener('beforeunload', () => {
    if (Object.keys(formData).length > 0) {
        localStorage.setItem('registrationFormData', JSON.stringify({
            formData,
            selectedMedicines,
            currentStep
        }));
    }
});

// Restore form data on page load
window.addEventListener('load', () => {
    const savedData = localStorage.getItem('registrationFormData');
    if (savedData) {
        try {
            const parsed = JSON.parse(savedData);
            formData = parsed.formData || {};
            selectedMedicines = parsed.selectedMedicines || [];
            
            // Ask user if they want to restore
            if (Object.keys(formData).length > 0) {
                if (confirm('আপনার আগের ফর্মের তথ্য পাওয়া গেছে। এটি পুনরুদ্ধার করতে চান?')) {
                    currentStep = parsed.currentStep || 1;
                    showStep(currentStep);
                    updateStepIndicator();
                } else {
                    localStorage.removeItem('registrationFormData');
                }
            }
        } catch (error) {
            console.error('Error restoring form data:', error);
        }
    }
});

// Clear saved data on successful registration
function clearSavedFormData() {
    localStorage.removeItem('registrationFormData');
}

// Development helpers
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // Add development shortcuts
    window.mediMapDev = {
        fillDemoData: () => {
            formData = {
                pharmacyName: 'টেস্ট ফার্মাসি',
                pharmacyAddress: 'মিরপুর-১, ঢাকা',
                pharmacyPhone: '01712345678',
                pharmacyEmail: 'test@pharmacy.com',
                openTime: '08:00',
                closeTime: '22:00',
                ownerName: 'জনাব টেস্ট',
                ownerPhone: '01787654321',
                ownerNID: '1234567890123',
                username: 'test_pharmacy_' + Date.now(),
                password: '123456'
            };
            selectedMedicines = [
                { name: 'নাপা', category: 'fever', uses: ['জ্বর', 'ব্যথা'] },
                { name: 'হিস্টাসিন', category: 'allergy', uses: ['এলার্জি', 'সর্দি'] }
            ];
            loadStepData(currentStep);
            console.log('Demo data filled');
        },
        
        goToStep: (step) => {
            currentStep = step;
            showStep(currentStep);
            updateStepIndicator();
        },
        
        skipToEnd: () => {
            currentStep = 4;
            showStep(currentStep);
            updateStepIndicator();
        }
    };
    
    console.log('Development helpers available: window.mediMapDev');
}