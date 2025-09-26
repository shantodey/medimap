// MediMap Search Results JavaScript

// Add medicine-names.js script to the page if not already added
if (!document.querySelector('script[src="js/medicine-names.js"]')) {
    const script = document.createElement('script');
    script.src = 'js/medicine-names.js';
    document.head.appendChild(script);
}

// Sample pharmacy data for Mirpur-1
const pharmaciesData = [
    {
        id: 1,
        name: "Popular Pharmacy",
        address: "শপিং সেন্টার, মিরপুর-১২, ঢাকা",
        phone: "01711-123456",
        coordinates: {lat: 23.7956, lng: 90.3537},
        openingHours: "সকাল ৮টা - রাত ১০টা",
        isOpen: true,
        distance: "০.৩ কিমি",
        distanceValue: 0.3,
        medicines: {
            "নাপা": {price: 2.5, stock: 50},
            "হিস্টাসিন": {price: 8.5, stock: 30},
            "সার্জেল": {price: 12, stock: 20},
            "প্যারাসিটামল": {price: 2, stock: 100}
        },
        type: 'pharmacy',
        visitType: 'open'
    },
    {
        id: 2,
        name: "Square Pharmacy",
        address: "কাজীপাড়া মোড়, মিরপুর-১২, ঢাকা",
        phone: "01811-234567",
        coordinates: {lat: 23.7966, lng: 90.3547},
        openingHours: "২৪ ঘন্টা খোলা",
        isOpen: true,
        distance: "০.৫ কিমি",
        distanceValue: 0.5,
        medicines: {
            "নাপা": {price: 3, stock: 100},
            "প্যারাসিটামল": {price: 2, stock: 80},
            "এসি": {price: 4.5, stock: 60},
            "নাপা এক্সট্রা": {price: 4, stock: 40}
        },
        type: 'hospital',
        visitType: 'open'
    },
    {
        id: 3,
        name: "Lazz Pharmacy",
        address: "ব্লক-সি, মিরপুর-১২, ঢাকা",
        phone: "01911-345678",
        coordinates: {lat: 23.7946, lng: 90.3527},
        openingHours: "সকাল ৯টা - রাত ৯টা",
        isOpen: false,
        distance: "০.৭ কিমি",
        distanceValue: 0.7,
        medicines: {
            "নাপা এক্সট্রা": {price: 4, stock: 25},
            "ফ্লেক্সি": {price: 15, stock: 40},
            "হিস্টাসিন": {price: 9, stock: 35}
        },
        type: 'pharmacy',
        visitType: 'closed'
    },
    {
        id: 4,
        name: "City Pharmacy",
        address: "সিটি কলেজ রোড, মিরপুর-১, ঢাকা",
        phone: "01611-456789",
        coordinates: {lat: 23.7976, lng: 90.3517},
        openingHours: "সকাল ৮টা - রাত ১১টা",
        isOpen: true,
        distance: "০.৯ কিমি",
        distanceValue: 0.9,
        medicines: {
            "হিস্টাসিন": {price: 9, stock: 35},
            "ফেক্সো": {price: 11, stock: 28},
            "অ্যালারিন": {price: 10, stock: 22},
            "সেট্রিজিন": {price: 8, stock: 45}
        },
        type: 'hospital',
        visitType: 'open'
    },
    {
        id: 5,
        name: "Modern Pharmacy",
        address: "পূর্ব কাজীপাড়া, মিরপুর-১, ঢাকা",
        phone: "01711-567890",
        coordinates: {lat: 23.7936, lng: 90.3557},
        openingHours: "সকাল ৭টা - রাত ১০টা",
        isOpen: true,
        distance: "১.২ কিমি",
        distanceValue: 1.2,
        medicines: {
            "অক্সিজেন সিলিন্ডার": {price: 500, stock: 5},
            "ওরস্যালাইন": {price: 6, stock: 100},
            "ইমোডিয়াম": {price: 12, stock: 30}
        },
        type: 'specialist',
        visitType: 'open'
    },
    {
        id: 6,
        name: "Health Plus Pharmacy",
        address: "মিরপুর-১ বাস স্ট্যান্ড, ঢাকা",
        phone: "01511-678901",
        coordinates: {lat: 23.7986, lng: 90.3567},
        openingHours: "সকাল ৮টা - রাত ৯টা",
        isOpen: true,
        distance: "১.৫ কিমি",
        distanceValue: 1.5,
        medicines: {
            "ম্যাক্সপ্রো": {price: 15, stock: 25},
            "সার্জেল": {price: 12, stock: 30},
            "এসি প্লাস": {price: 6, stock: 50}
        },
        type: 'pharmacy',
        visitType: 'open'
    },
    {
        id: 7,
        name: "Life Care Pharmacy",
        address: "শাহ আলী মার্কেট, মিরপুর-১, ঢাকা",
        phone: "01411-789012",
        coordinates: {lat: 23.7926, lng: 90.3507},
        openingHours: "সকাল ৯টা - রাত ১০টা",
        isOpen: true,
        distance: "১.৮ কিমি",
        distanceValue: 1.8,
        medicines: {
            "ফ্ল্যাজিল": {price: 8, stock: 40},
            "ওমিপ্রাজল": {price: 10, stock: 35},
            "অ্যান্টাসিড": {price: 5, stock: 60}
        },
        type: 'hospital',
        visitType: 'open'
    }
];

// Medicine symptoms mapping
const symptomMedicineMap = {
    "fever": ["নাপা", "নাপা এক্সট্রা", "প্যারাসিটামল", "এসি"],
    "cold": ["হিস্টাসিন", "ফেক্সো", "অ্যালারিন", "সেট্রিজিন"],
    "headache": ["নাপা", "সার্জেল", "ম্যাক্সপ্রো"],
    "diarrhea": ["ওরস্যালাইন", "ইমোডিয়াম", "ফ্ল্যাজিল"],
    "body-pain": ["নাপা", "এসি প্লাস", "ফ্লেক্সি"],
    "allergy": ["হিস্টাসিন", "ফেক্সো", "সেট্রিজিন"],
    "gastric": ["ওমিপ্রাজল", "অ্যান্টাসিড", "সেক্লো"],
    "asthma": ["সালবুটামল", "ভেন্টোলিন"],
    "toothache": ["কেটোরোল্যাক", "ডেন্টাল জেল"],
    "nasal-congestion": ["অট্রিভিন", "নাসেলিন"]
};

// Global variables
let searchType, searchQuery, filteredResults = [];
let currentSort = 'distance';
let currentStatusFilter = 'all';
let currentDistanceFilter = 'all';
let currentClinicTypeFilter = 'all';
let currentVisitTypeFilter = 'all';
// currentRadius is defined in maps.js

// Debug function to check DOM elements
function validateDOMElements() {
    const requiredElements = [
        { id: 'searchQuery', name: 'Search Query Display' },
        { id: 'resultsList', name: 'Results List' },
        { id: 'resultsCount', name: 'Results Count' }
    ];

    console.log('[Search] Validating DOM elements...');
    let allFound = true;

    requiredElements.forEach(element => {
        const domElement = document.getElementById(element.id);
        const found = !!domElement;
        console.log(`[Search] ${element.name} (${element.id}):`, found ? 'FOUND' : 'MISSING');
        if (!found) {
            allFound = false;
            // Show user-friendly error if missing
            if (!document.getElementById('search-error-message')) {
                const errorDiv = document.createElement('div');
                errorDiv.id = 'search-error-message';
                errorDiv.style = 'color: red; font-weight: bold; margin: 20px;';
                errorDiv.innerHTML = `
                    <div class="no-results">
                        <i class="fas fa-exclamation-triangle no-results-icon"></i>
                        <h3>পেজের কিছু অংশ লোড হয়নি</h3>
                        <p>সমস্যা: ${element.name} (${element.id}) খুঁজে পাওয়া যায়নি।<br>দয়া করে পেজ রিফ্রেশ করুন অথবা ডেভেলপারকে জানান।</p>
                    </div>
                `;
                document.body.prepend(errorDiv);
            }
        }
    });
    return allFound;
}

// Check localStorage data
function validateSearchData() {
    console.log('[Search] Validating search data...');
    const searchType = localStorage.getItem('searchType');
    const searchQuery = localStorage.getItem('searchQuery');

    console.log('[Search] localStorage searchType:', searchType);
    console.log('[Search] localStorage searchQuery:', searchQuery);

    if (!searchType && !searchQuery) {
        console.warn('[Search] No search data found in localStorage - user may have navigated directly to results page');
        // Set default test data for debugging
        localStorage.setItem('searchType', 'symptom');
        localStorage.setItem('searchQuery', '["fever"]');
        console.log('[Search] Set default fever search for testing');
        return true;
    }

    return !!(searchType && searchQuery);
}

// Initialize page when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('[Search] ==================== SEARCH RESULTS PAGE STARTING ====================');
    console.log('[Search] Current URL:', window.location.href);
    console.log('[Search] Current time:', new Date().toISOString());

    // Validate basic data availability
    console.log('[Search] Pharmacy data available:', Array.isArray(pharmaciesData), pharmaciesData.length || 0, 'pharmacies');
    console.log('[Search] Symptom mapping available:', typeof symptomMedicineMap, Object.keys(symptomMedicineMap || {}).length, 'symptoms');

    // Validate DOM elements first
    if (!validateDOMElements()) {
        console.error('[Search] CRITICAL: Required DOM elements are missing!');
        // Error message is already shown by validateDOMElements
        return;
    }

    // Validate search data
    if (!validateSearchData()) {
        // Force default test data for demo/debug
        localStorage.setItem('searchType', 'symptom');
        localStorage.setItem('searchQuery', '["fever"]');
        console.warn('[Search] No search data found, setting default fever search and reloading...');
        location.reload();
        return;
    }

    console.log('[Search] All validations passed. Starting initialization...');

    // Call the main initialization function
    const success = initializeSearchPage();

    if (success) {
        try {
            // Load search data first
            loadSearchData();
            setupFilters();
            initializeMap();
        } catch (setupError) {
            console.error('[Search] Error in setup functions:', setupError);
        }
    }
});

// Emergency fallback - try to initialize immediately if DOM is already ready
if (document.readyState === 'loading') {
    console.log('[Search] DOM still loading, waiting for DOMContentLoaded...');
} else {
    console.log('[Search] DOM already loaded, initializing immediately...');
    setTimeout(() => {
        console.log('[Search] Emergency initialization attempt...');
        if (initializeSearchPage()) {
            try {
                loadSearchData();
                setupFilters();
                initializeMap();
            } catch (setupError) {
                console.error('[Search] Error in emergency setup functions:', setupError);
            }
        }
    }, 50);
}

// Main initialization function
function initializeSearchPage() {
    console.log('[Search] ==================== INITIALIZING SEARCH PAGE ====================');

    try {
        // Quick check if page elements exist
        const searchQueryEl = document.getElementById('searchQuery');
        const resultsListEl = document.getElementById('resultsList');
        const resultsCountEl = document.getElementById('resultsCount');
        if (!searchQueryEl || !resultsListEl || !resultsCountEl) {
            console.error('[Search] Critical DOM elements missing!');
            if (resultsListEl) {
                resultsListEl.innerHTML = '<div class="loading">পেজ লোড হচ্ছে... (কিছু অংশ পাওয়া যায়নি)</div>';
            }
            if (!document.getElementById('search-error-message')) {
                const errorDiv = document.createElement('div');
                errorDiv.id = 'search-error-message';
                errorDiv.style = 'color: red; font-weight: bold; margin: 20px;';
                errorDiv.innerHTML = `
                    <div class="no-results">
                        <i class="fas fa-exclamation-triangle no-results-icon"></i>
                        <h3>পেজের কিছু অংশ লোড হয়নি</h3>
                        <p>সমস্যা: searchQuery/resultsList/resultsCount DOM এলিমেন্ট খুঁজে পাওয়া যায়নি।<br>দয়া করে পেজ রিফ্রেশ করুন অথবা ডেভেলপারকে জানান।</p>
                    </div>
                `;
                document.body.prepend(errorDiv);
            }
            return false;
        }

        // Load and display search data
        const searchType = localStorage.getItem('searchType') || 'symptom';
        const searchQuery = localStorage.getItem('searchQuery') || '["fever"]';

        console.log('[Search] Quick init - Type:', searchType, 'Query:', searchQuery);

        // Set defaults if empty (for testing)
        if (!localStorage.getItem('searchType')) {
            localStorage.setItem('searchType', 'symptom');
            localStorage.setItem('searchQuery', '["fever"]');
            console.log('[Search] Set default test search data');
        }

        // Show loading initially
        resultsListEl.innerHTML = '<div class="loading" style="text-align:center; padding:40px;">ফলাফল লোড হচ্ছে...</div>';
        searchQueryEl.textContent = 'অনুসন্ধান চলছে...';
        resultsCountEl.textContent = '0';

        // Load search data first before displaying results
        try {
            loadSearchData();
        } catch (loadError) {
            console.error('[Search] Load search data failed:', loadError);
        }

        // Try to display results immediately
        setTimeout(() => {
            try {
                displayResults();
            } catch (displayError) {
                console.error('[Search] Display results failed, using fallback:', displayError);

                // Emergency fallback - show basic results
                showEmergencyResults(searchType, searchQuery, resultsListEl, searchQueryEl, resultsCountEl);
            }
        }, 200);

        return true;
    } catch (error) {
        console.error('[Search] Emergency initialization failed:', error);
        return false;
    }
}

// Emergency fallback to show basic results
function showEmergencyResults(searchType, searchQuery, resultsListEl, searchQueryEl, resultsCountEl) {
    console.log('[Search] Using emergency fallback display');

    try {
        // Set search query display
        if (searchType === 'symptom') {
            searchQueryEl.textContent = 'জ্বর';
        } else if (searchType === 'medicine') {
            searchQueryEl.textContent = searchQuery || 'ওষুধ অনুসন্ধান';
        } else {
            searchQueryEl.textContent = 'জরুরি ওষুধ';
        }

        // Show basic pharmacy results
        const feverPharmacies = [
            { name: 'Popular Pharmacy', address: 'মিরপুর-১২, ঢাকা', phone: '01711-123456', medicine: 'নাপা - ২.৫ টাকা' },
            { name: 'Square Pharmacy', address: 'কাজীপাড়া মোড়, মিরপুর-১২, ঢাকা', phone: '01811-234567', medicine: 'নাপা - ৩ টাকা' }
        ];

        resultsCountEl.textContent = feverPharmacies.length;

        resultsListEl.innerHTML = feverPharmacies.map(pharmacy => `
            <div class="pharmacy-card" style="border: 1px solid #ddd; margin: 10px 0; padding: 15px; border-radius: 8px;">
                <h3 style="color: #2563eb; margin: 0 0 10px 0;">${pharmacy.name}</h3>
                <p style="margin: 5px 0;"><i class="fas fa-map-marker-alt"></i> ${pharmacy.address}</p>
                <p style="margin: 5px 0;"><i class="fas fa-pills"></i> ${pharmacy.medicine}</p>
                <p style="margin: 5px 0;"><i class="fas fa-phone"></i> ${pharmacy.phone}</p>
                <div style="margin-top: 10px;">
                    <button onclick="window.location.href='tel:${pharmacy.phone}'" class="btn btn-success" style="margin-right: 10px;">
                        <i class="fas fa-phone"></i> ফোন করুন
                    </button>
                </div>
            </div>
        `).join('');

        console.log('[Search] Emergency results displayed successfully');
    } catch (emergencyError) {
        console.error('[Search] Even emergency fallback failed:', emergencyError);
        resultsListEl.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <h3>জ্বরের ওষুধের জন্য যোগাযোগ করুন:</h3>
                <p><strong>Popular Pharmacy:</strong> 01711-123456</p>
                <p><strong>Square Pharmacy:</strong> 01811-234567</p>
                <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px;">
                    আবার চেষ্টা করুন
                </button>
            </div>
        `;
    }
}

// Load search data from localStorage
function loadSearchData() {
    try {
        console.log('[Search] Loading search data from localStorage...');

        searchType = localStorage.getItem('searchType') || 'medicine';
        searchQuery = localStorage.getItem('searchQuery') || '';

        console.log('[Search] Search type:', searchType);
        console.log('[Search] Search query:', searchQuery);

        // Update search query display
        const searchQueryElement = document.getElementById('searchQuery');

        if (!searchQueryElement) {
            console.warn('[Search] Search query element not found!');
            return;
        }

        if (searchType === 'medicine') {
            searchQueryElement.textContent = searchQuery || 'কোন ওষুধ নির্বাচিত হয়নি';
        } else if (searchType === 'symptom') {
            try {
                const symptoms = searchQuery ? JSON.parse(searchQuery) : [];
                console.log('[Search] Parsed symptoms:', symptoms);

                const symptomNames = {
                    'fever': 'জ্বর',
                    'cold': 'সর্দি',
                    'headache': 'মাথা ব্যথা',
                    'diarrhea': 'পাতলা পায়খানা',
                    'body-pain': 'হাত/পায়ে ব্যথা',
                    'allergy': 'এলার্জি',
                    'gastric': 'গ্যাস্ট্রিক',
                    'asthma': 'এজমা',
                    'toothache': 'দাঁতের ব্যথা',
                    'nasal-congestion': 'নাক বন্ধ'
                };

                if (symptoms.length > 0) {
                    const displaySymptoms = symptoms.map(s => symptomNames[s] || s).join(', ');
                    searchQueryElement.textContent = displaySymptoms;
                } else {
                    searchQueryElement.textContent = 'কোন লক্ষণ নির্বাচিত হয়নি';
                }
            } catch (parseError) {
                console.error('[Search] Error parsing symptoms:', parseError);
                searchQueryElement.textContent = 'লক্ষণ পার্স করতে সমস্যা হয়েছে';
            }
        } else if (searchType === 'emergency') {
            searchQueryElement.textContent = 'অক্সিজেন সিলিন্ডার';
        } else {
            searchQueryElement.textContent = 'অজানা খোঁজের ধরন';
        }

        console.log('[Search] Search data loaded successfully');
    } catch (error) {
        console.error('[Search] Error loading search data:', error);

        // Fallback values
        searchType = 'medicine';
        searchQuery = '';

        const searchQueryElement = document.getElementById('searchQuery');
        if (searchQueryElement) {
            searchQueryElement.textContent = 'খোঁজার তথ্য লোড করতে সমস্যা হয়েছে';
        }
    }
}

// Display search results
function displayResults() {
    try {
        console.log('[Search] Displaying search results...');
        const resultsList = document.getElementById('resultsList');
        const resultsCountElement = document.getElementById('resultsCount');
        if (!resultsList) {
            console.error('[Search] Results list element not found!');
            if (!document.getElementById('search-error-message')) {
                const errorDiv = document.createElement('div');
                errorDiv.id = 'search-error-message';
                errorDiv.style = 'color: red; font-weight: bold; margin: 20px;';
                errorDiv.innerHTML = `
                    <div class="no-results">
                        <i class="fas fa-exclamation-triangle no-results-icon"></i>
                        <h3>ফলাফল দেখাতে সমস্যা হয়েছে</h3>
                        <p>সমস্যা: Results List DOM এলিমেন্ট খুঁজে পাওয়া যায়নি।</p>
                    </div>
                `;
                document.body.prepend(errorDiv);
            }
            return;
        }
        if (!resultsCountElement) {
            console.error('[Search] Results count element not found!');
        }

        console.log('[Search] Filtering pharmacies...');
        try {
            filteredResults = filterPharmacies();
        } catch (err) {
            filteredResults = [];
            console.error('[Search] filterPharmacies threw error:', err);
        }
        console.log('[Search] Filtered results:', filteredResults.length, 'pharmacies found');

        // Sort results
        console.log('[Search] Sorting results...');
        try {
            sortResults();
        } catch (err) {
            console.error('[Search] sortResults threw error:', err);
        }

        // Update results count
        if (resultsCountElement) {
            resultsCountElement.textContent = filteredResults.length;
        }

        console.log('[Search] Final results count:', filteredResults.length);

    if (!Array.isArray(filteredResults) || filteredResults.length === 0) {
        console.log('[Search] No results found, showing appropriate message.');

        // Show no results message instead of forcing demo data
        if (resultsCountElement) resultsCountElement.textContent = '0';
        resultsList.innerHTML = `
            <div class="no-results" style="text-align: center; padding: 40px; color: #6b7280;">
                <i class="fas fa-search" style="font-size: 4rem; color: #d1d5db; margin-bottom: 1rem;"></i>
                <h3 style="color: #374151; margin-bottom: 1rem;">কোন ফার্মাসি পাওয়া যায়নি</h3>
                <p style="margin-bottom: 2rem;">আপনার অনুসন্ধানের জন্য কোন ফার্মাসি খুঁজে পাওয়া যায়নি।</p>
                <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                    <button onclick="location.reload()" class="btn btn-secondary">
                        <i class="fas fa-sync"></i> আবার চেষ্টা করুন
                    </button>
                    <a href="index.html" class="btn btn-primary">
                        <i class="fas fa-search"></i> নতুন অনুসন্ধান
                    </a>
                </div>
                <div style="margin-top: 20px; text-align: left; max-width: 400px; margin-left: auto; margin-right: auto;">
                    <p style="color: #6b7280; font-size: 0.9rem; margin-bottom: 0.5rem;"><strong>পরামর্শ:</strong></p>
                    <ul style="color: #6b7280; font-size: 0.9rem; text-align: left;">
                        <li>ভিন্ন ওষুধের নাম খোঁজ করুন</li>
                        <li>ভিন্ন এলাকায় খোঁজ করুন</li>
                        <li>ফিল্টার পরিবর্তন করুন</li>
                    </ul>
                </div>
            </div>
        `;
        return;
    }

        console.log('[Search] Generating HTML for', filteredResults.length, 'pharmacies');
        resultsList.innerHTML = filteredResults.map(pharmacy => {
            let relevantMedicines = [];
            try {
                relevantMedicines = getRelevantMedicines(pharmacy);
            } catch (err) {
                relevantMedicines = [];
                console.error('[Search] getRelevantMedicines threw error:', err);
            }
            return `
                <div class="pharmacy-card">
                    <div class="pharmacy-header">
                        <div class="pharmacy-info">
                            <h3 class="pharmacy-name">${pharmacy.name}</h3>
                            <div class="pharmacy-address">
                                <i class="fas fa-map-marker-alt"></i>
                                ${pharmacy.address}
                            </div>
                            <span class="distance-badge">
                                <i class="fas fa-route"></i>
                                ${pharmacy.distance}
                            </span>
                        </div>
                        <div class="pharmacy-status ${pharmacy.isOpen ? 'status-open' : 'status-closed'}">
                            ${pharmacy.isOpen ? 'খোলা' : 'বন্ধ'}
                        </div>
                    </div>
                    ${relevantMedicines.length > 0 ? `
                        <div class="medicine-info">
                            ${relevantMedicines.map(med => `
                                <div class="" style="margin-bottom: 10px;">
                                    <div class="medicine-name">
                                        <i class="fas fa-pills" style="margin-right: 8px;"></i>
                                        ${med.name}
                                    </div>
                                    <div class="medicine-price">৳ ${med.price} টাকা</div>
                                    <div class="medicine-stock">স্টক: ${med.stock} টি</div>
                                </div>
                            `).join('')}
                        </div>
                    ` : `
                      <p>এই ফার্মাসিতে আপনার খোঁজা ওষুধ নেই।</p>
                    `}
                    <div class="pharmacy-details">
                        <div class="detail-item">
                            <i class="fas fa-clock"></i>
                            <span>${pharmacy.openingHours}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-phone"></i>
                            <span>${pharmacy.phone}</span>
                        </div>
                    </div>
                    <div class="pharmacy-actions">
                        <button class="btn btn-primary" onclick="viewOnMap(${pharmacy.id})" data-pharmacy-id="${pharmacy.id}">
                            <i class="fas fa-map-marker-alt"></i>
                            ম্যাপে দেখুন
                        </button>
                        <button class="btn btn-success" onclick="callPharmacy('${pharmacy.phone}')">
                            <i class="fas fa-phone"></i>
                            ফোন করুন
                        </button>
                        <button class="btn btn-secondary" onclick="getDirections(${pharmacy.id})">
                            <i class="fas fa-directions"></i>
                            দিক-নির্দেশনা
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        console.log('[Search] Results displayed successfully');
    } catch (error) {
        console.error('[Search] Error displaying results:', error);

        const resultsList = document.getElementById('resultsList');
        const resultsCountElement = document.getElementById('resultsCount');

        if (resultsList) {
            resultsList.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-exclamation-triangle no-results-icon"></i>
                    <h3>ফলাফল দেখাতে সমস্যা হয়েছে</h3>
                    <p>দুঃখিত, অনুসন্ধানের ফলাফল প্রদর্শন করতে সমস্যা হয়েছে।</p>
                    <div style="margin: 20px 0;">
                        <button onclick="location.reload()" class="btn btn-secondary" style="margin-right: 10px;">
                            <i class="fas fa-sync"></i>
                            আবার চেষ্টা করুন
                        </button>
                        <a href="index.html" class="btn btn-primary">
                            নতুন খোঁজ শুরু করুন
                        </a>
                    </div>
                </div>
            `;
        }

        if (resultsCountElement) {
            resultsCountElement.textContent = '0';
        }
    }
}

// Filter pharmacies based on search criteria
function filterPharmacies() {
    try {
        console.log('[Search] Filtering pharmacies with type:', searchType, 'query:', searchQuery);

        if (!Array.isArray(pharmaciesData) || pharmaciesData.length === 0) {
            console.warn('[Search] No pharmacy data available');
            return [];
        }

        let results = [...pharmaciesData];
        console.log('[Search] Starting with', results.length, 'total pharmacies');

        // Filter based on search type
        if (searchType === 'medicine') {
            if (!searchQuery) {
                console.warn('[Search] Empty medicine search query, showing all pharmacies');
                // Don't return empty array, show all pharmacies instead
            } else {
                results = results.filter(pharmacy => {
                    if (!pharmacy.medicines || typeof pharmacy.medicines !== 'object') {
                        return false;
                    }
                    return Object.keys(pharmacy.medicines).some(medicine =>
                        medicine.toLowerCase().includes(searchQuery.toLowerCase())
                    );
                });
                console.log('[Search] Medicine search filtered to', results.length, 'pharmacies');
            }
        } else if (searchType === 'symptom') {
            try {
                if (!searchQuery) {
                    console.warn('[Search] Empty symptom search query, showing all pharmacies');
                    // Don't return empty array, show all pharmacies instead
                } else {
                    const symptoms = JSON.parse(searchQuery);
                    console.log('[Search] Searching for symptoms:', symptoms);

                    if (!Array.isArray(symptoms) || symptoms.length === 0) {
                        console.warn('[Search] No symptoms to search for, showing all pharmacies');
                        // Don't return empty array, show all pharmacies instead
                    } else {
                        const relevantMedicines = symptoms.flatMap(symptom => {
                            const medicines = symptomMedicineMap[symptom];
                            console.log(`[Search] Symptom "${symptom}" maps to medicines:`, medicines);
                            return medicines || [];
                        });

                        console.log('[Search] All relevant medicines for symptoms:', relevantMedicines);

                        if (relevantMedicines.length === 0) {
                            console.warn('[Search] No medicines found for selected symptoms, showing all pharmacies');
                            // Don't return empty array, show all pharmacies instead
                        } else {
                            results = results.filter(pharmacy => {
                                if (!pharmacy.medicines || typeof pharmacy.medicines !== 'object') {
                                    return false;
                                }
                                const hasRelevantMedicine = Object.keys(pharmacy.medicines).some(medicine =>
                                    relevantMedicines.includes(medicine)
                                );

                                if (hasRelevantMedicine) {
                                    console.log(`[Search] Pharmacy "${pharmacy.name}" has relevant medicines:`,
                                              Object.keys(pharmacy.medicines).filter(m => relevantMedicines.includes(m)));
                                }

                                return hasRelevantMedicine;
                            });

                            console.log('[Search] Symptom search filtered to', results.length, 'pharmacies');
                        }
                    }
                }
            } catch (parseError) {
                console.error('[Search] Error parsing symptoms:', parseError);
                return [];
            }
        } else if (searchType === 'emergency') {
            results = results.filter(pharmacy => {
                if (!pharmacy.medicines || typeof pharmacy.medicines !== 'object') {
                    return false;
                }
                return Object.keys(pharmacy.medicines).some(medicine =>
                    medicine.includes('অক্সিজেন')
                );
            });

            console.log('[Search] Emergency search filtered to', results.length, 'pharmacies');
        } else {
            console.warn('[Search] Unknown search type:', searchType);
        }

    // Apply location-based filtering if user location is available
    if (window.userLocation && typeof MapsManager !== 'undefined' && MapsManager.filterPharmaciesByLocation) {
        results = MapsManager.filterPharmaciesByLocation(
            results,
            window.userLocation.lat,
            window.userLocation.lng,
            window.currentRadius
        );

        // Update distance display for each pharmacy
        results.forEach(pharmacy => {
            if (pharmacy.distanceFromUser !== undefined) {
                pharmacy.distance = `${pharmacy.distanceFromUser.toFixed(1)} কিমি`;
                pharmacy.distanceValue = pharmacy.distanceFromUser;
            }
        });
    }

    // Apply status filter
    if (currentStatusFilter === 'open') {
        results = results.filter(pharmacy => pharmacy.isOpen);
    } else if (currentStatusFilter === 'closed') {
        results = results.filter(pharmacy => !pharmacy.isOpen);
    }

    // Apply distance filter
    if (currentDistanceFilter !== 'all') {
        const maxDistance = parseFloat(currentDistanceFilter.replace('km', '').replace('m', ''));
        const isMeters = currentDistanceFilter.includes('m');
        const maxDistanceKm = isMeters ? maxDistance / 1000 : maxDistance;

        results = results.filter(pharmacy => pharmacy.distanceValue <= maxDistanceKm);
    }

    // Apply clinic type filter
    if (currentClinicTypeFilter !== 'all') {
        results = results.filter(pharmacy => pharmacy.type === currentClinicTypeFilter);
    }

     // Apply visit type filter
    if (currentVisitTypeFilter !== 'all') {
        // Ensure visitType is handled as a boolean
        if (currentVisitTypeFilter === 'open') {
            results = results.filter(pharmacy => pharmacy.visitType === 'open');
        } else if (currentVisitTypeFilter === 'closed') {
            results = results.filter(pharmacy => pharmacy.visitType === 'closed');
        }
    }

        console.log('[Search] Final filtered results:', results.length, 'pharmacies');
        return results;
    } catch (error) {
        console.error('[Search] Error filtering pharmacies:', error);
        return []; // Return empty array on error
    }
}


// Get relevant medicines for a pharmacy
function getRelevantMedicines(pharmacy) {
    try {
        if (!pharmacy || !pharmacy.medicines || typeof pharmacy.medicines !== 'object') {
            console.warn('[Search] Invalid pharmacy data for getRelevantMedicines:', pharmacy);
            return [];
        }

        let relevantMedicines = [];

        if (searchType === 'medicine') {
            if (!searchQuery) {
                return [];
            }

            Object.entries(pharmacy.medicines).forEach(([name, details]) => {
                if (name.toLowerCase().includes(searchQuery.toLowerCase())) {
                    relevantMedicines.push({name, ...details});
                }
            });
        } else if (searchType === 'symptom') {
            try {
                if (!searchQuery) {
                    return [];
                }

                const symptoms = JSON.parse(searchQuery);
                const targetMedicines = symptoms.flatMap(symptom => symptomMedicineMap[symptom] || []);

                Object.entries(pharmacy.medicines).forEach(([name, details]) => {
                    if (targetMedicines.includes(name)) {
                        relevantMedicines.push({name, ...details});
                    }
                });
            } catch (parseError) {
                console.error('[Search] Error parsing symptoms in getRelevantMedicines:', parseError);
                return [];
            }
        } else if (searchType === 'emergency') {
            Object.entries(pharmacy.medicines).forEach(([name, details]) => {
                if (name.includes('অক্সিজেন')) {
                    relevantMedicines.push({name, ...details});
                }
            });
        }

        return relevantMedicines;
    } catch (error) {
        console.error('[Search] Error getting relevant medicines:', error);
        return [];
    }
}


// Sort results based on current sort criteria
function sortResults() {
    filteredResults.sort((a, b) => {
        switch (currentSort) {
            case 'distance':
                return a.distanceValue - b.distanceValue;
            case 'price':
                const aPrice = getMinPrice(a);
                const bPrice = getMinPrice(b);
                return aPrice - bPrice;
            case 'availability':
                if (a.isOpen && !b.isOpen) return -1;
                if (!a.isOpen && b.isOpen) return 1;
                return a.distanceValue - b.distanceValue;
            default:
                return 0;
        }
    });
}

// Get minimum price of relevant medicines in pharmacy
function getMinPrice(pharmacy) {
    const relevantMedicines = getRelevantMedicines(pharmacy);
    if (relevantMedicines.length === 0) return Infinity;
    return Math.min(...relevantMedicines.map(med => med.price));
}

// Setup filter event listeners
function setupFilters() {
    // Add null checks for all filter elements
    const sortFilter = document.getElementById('sortFilter');
    if (sortFilter) {
        sortFilter.addEventListener('change', (e) => {
            currentSort = e.target.value === 'bestMatch' ? 'distance' : e.target.value;
            displayResults();
        });
    }

    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', (e) => {
            currentStatusFilter = e.target.value;
            displayResults();
        });
    }

    const distanceFilter = document.getElementById('distanceFilter');
    if (distanceFilter) {
        distanceFilter.addEventListener('change', (e) => {
            currentDistanceFilter = e.target.value;
            displayResults();
        });
    }

    const clinicTypeFilter = document.getElementById('clinicTypeFilter');
    if (clinicTypeFilter) {
        clinicTypeFilter.addEventListener('change', (e) => {
            currentClinicTypeFilter = e.target.value;
            displayResults();
        });
    }

    const visitTypeFilter = document.getElementById('visitTypeFilter');
    if (visitTypeFilter) {
        visitTypeFilter.addEventListener('change', (e) => {
            currentVisitTypeFilter = e.target.value;
            displayResults();
        });
    }

    // Add radius filter listener
    const radiusFilter = document.getElementById('radiusFilter');
    if (radiusFilter) {
        radiusFilter.addEventListener('change', (e) => {
            window.currentRadius = parseInt(e.target.value);
        if (typeof MapsManager !== 'undefined' && MapsManager.setSearchRadius) {
            MapsManager.setSearchRadius(window.currentRadius);
        }
        displayResults();
    });

    document.getElementById('availabilityFilter')?.addEventListener('change', displayResults);
}

// Get directions to pharmacy
function getDirections(pharmacyId) {
    const pharmacy = pharmaciesData.find(p => p.id === pharmacyId);
    if (!pharmacy) return;

    const destination = `${pharmacy.coordinates.lat},${pharmacy.coordinates.lng}`;
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}&destination_place_id=${pharmacy.name}`;

    window.open(googleMapsUrl, '_blank');
}

// Call pharmacy
function callPharmacy(phoneNumber) {
    if (confirm(`${phoneNumber} নম্বরে কল করবেন?`)) {
        window.location.href = `tel:${phoneNumber}`;
    }
}

// View pharmacy details
function viewDetails(pharmacyId) {
    const pharmacy = pharmaciesData.find(p => p.id === pharmacyId);
    if (!pharmacy) return;

    const medicines = Object.entries(pharmacy.medicines)
        .map(([name, details]) => `${name}: ৳${details.price} (স্টক: ${details.stock})`)
        .join('\n');

    alert(`${pharmacy.name}\n\n${pharmacy.address}\n${pharmacy.phone}\n${pharmacy.openingHours}\n\nসব ওষুধ:\n${medicines}`);
}

// Get current location
function getCurrentLocation() {
    if (!navigator.geolocation) {
        alert('আপনার ব্রাউজার জিও-লোকেশন সাপোর্ট করে না।');
        return;
    }

    const loading = document.querySelector('.map-placeholder');
    loading.innerHTML = '<i class="fas fa-spinner fa-spin"></i><br>অবস্থান খুঁজছি...';

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            // Update location info
            document.querySelector('.current-location').innerHTML = `
                <i class="fas fa-location-arrow"></i>
                আপনার অবস্থান পাওয়া গেছে
            `;

            // Initialize map with user location
            initializeMapWithLocation(lat, lng);
        },
        (error) => {
            alert('অবস্থান খুঁজে পাওয়া যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।');
            loading.innerHTML = '<i class="fas fa-map"></i><br>Google Maps<br>লোড হচ্ছে...';
        }
    );
}

// Initialize Google Maps
function initializeMap() {
    // Simulate map loading
    setTimeout(() => {
        const mapPlaceholder = document.querySelector('.map-placeholder');
        mapPlaceholder.innerHTML = `
            <div style="width: 100%; height: 100%; background: #e5e7eb; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-direction: column;">
                <i class="fas fa-map" style="font-size: 3rem; color: #9ca3af; margin-bottom: 1rem;"></i>
                <p style="color: #6b7280;">Google Maps API প্রয়োজন</p>
                <small style="color: #9ca3af;">API key যোগ করার পর ম্যাপ দেখা যাবে</small>
            </div>
        `;
    }, 1000);
}

// Initialize map with user location
function initializeMapWithLocation(lat, lng) {
    const mapPlaceholder = document.querySelector('.map-placeholder');
    mapPlaceholder.innerHTML = `
        <div style="width: 100%; height: 100%; background: #e5e7eb; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-direction: column;">
            <i class="fas fa-map-marked-alt" style="font-size: 3rem; color: #2563eb; margin-bottom: 1rem;"></i>
            <p style="color: #2563eb; font-weight: 600;">আপনার অবস্থান পাওয়া গেছে</p>
            <small style="color: #6b7280;">Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}</small>
        </div>
    `;
}

// Search functionality for quick search on results page
function quickSearch() {
    const query = document.getElementById('quickSearchInput')?.value;
    if (!query) return;

    localStorage.setItem('searchType', 'medicine');
    localStorage.setItem('searchQuery', query);
    location.reload();
}

// Add pharmacy to favorites (future feature)
function addToFavorites(pharmacyId) {
    const favorites = JSON.parse(localStorage.getItem('favoritePharmacies') || '[]');
    if (!favorites.includes(pharmacyId)) {
        favorites.push(pharmacyId);
        localStorage.setItem('favoritePharmacies', JSON.stringify(favorites));
        alert('ফার্মাসি পছন্দের তালিকায় যোগ করা হয়েছে!');
    } else {
        alert('এই ফার্মাসি ইতিমধ্যে পছন্দের তালিকায় আছে।');
    }
}

// Report pharmacy (future feature)
function reportPharmacy(pharmacyId) {
    const reason = prompt('রিপোর্টের কারণ লিখুন:');
    if (reason) {
        alert('আপনার রিপোর্ট পাঠানো হয়েছে। ধন্যবাদ!');
        // Here you would send the report to your backend
    }
}

// Share pharmacy info
function sharePharmacy(pharmacyId) {
    const pharmacy = pharmaciesData.find(p => p.id === pharmacyId);
    if (!pharmacy) return;

    const shareText = `${pharmacy.name}\n${pharmacy.address}\nফোন: ${pharmacy.phone}\nখোলার সময়: ${pharmacy.openingHours}`;

    if (navigator.share) {
        navigator.share({
            title: pharmacy.name,
            text: shareText,
            url: window.location.href
        });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(shareText).then(() => {
            alert('ফার্মাসির তথ্য কপি করা হয়েছে!');
        });
    }
}

// Initialize tooltips and other UI enhancements
function initializeUIEnhancements() {
    // Add loading animations
    const cards = document.querySelectorAll('.pharmacy-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'all 0.5s ease';

            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        }, index * 100);
    });
}

// Call UI enhancements after results are displayed
setTimeout(initializeUIEnhancements, 500);

// View pharmacy on map
function viewOnMap(pharmacyId) {
    if (typeof MapsManager === 'undefined' || !MapsManager.centerOnPharmacy) {
        if (typeof UIUtils !== 'undefined') {
            UIUtils.showNotification('ম্যাপ সেবা উপলব্ধ নেই', 'error');
        } else {
            alert('ম্যাপ সেবা উপলব্ধ নেই');
        }
        return;
    }

    // Find the pharmacy
    const pharmacy = pharmaciesData.find(p => p.id === pharmacyId);
    if (!pharmacy) {
        if (typeof UIUtils !== 'undefined') {
            UIUtils.showNotification('ফার্মাসি খুঁজে পাওয়া যায়নি', 'error');
        } else {
            alert('ফার্মাসি খুঁজে পাওয়া যায়নি');
        }
        return;
    }

    // Center map on pharmacy and highlight
    MapsManager.centerOnPharmacy(pharmacyId);

    // Scroll to map
    const mapContainer = document.getElementById('map');
    if (mapContainer) {
        mapContainer.scrollIntoView({ behavior: 'smooth' });
    }

    // Show notification
    if (typeof UIUtils !== 'undefined') {
        UIUtils.showNotification(`${pharmacy.name} ম্যাপে দেখানো হচ্ছে`, 'success', 3000);
    }
}

// Increase search radius when no results found
function increaseSearchRadius() {
    // Fallback radius options if MAPS_CONFIG is not available
    const radiusOptions = (typeof MAPS_CONFIG !== 'undefined' && MAPS_CONFIG.RADIUS_OPTIONS) ?
        MAPS_CONFIG.RADIUS_OPTIONS :
        [
            { value: 1000, label: '১ কিমি' },
            { value: 2000, label: '২ কিমি' },
            { value: 3000, label: '৩ কিমি' },
            { value: 5000, label: '৫ কিমি' }
        ];

    const currentIndex = radiusOptions.findIndex(option => option.value === window.currentRadius);
    if (currentIndex < radiusOptions.length - 1) {
        const newRadius = radiusOptions[currentIndex + 1].value;
        window.currentRadius = newRadius;

        // Update UI
        const radiusSelect = document.getElementById('radiusFilter');
        if (radiusSelect) {
            radiusSelect.value = newRadius;
        }

        // Update maps manager
        if (typeof MapsManager !== 'undefined' && MapsManager.setSearchRadius) {
            MapsManager.setSearchRadius(newRadius);
        }

        // Refresh results
        displayResults();

        if (typeof UIUtils !== 'undefined') {
            UIUtils.showNotification(`খোঁজার পরিসীমা ${newRadius/1000} কিমি করা হয়েছে`, 'info');
        }
    } else {
        if (typeof UIUtils !== 'undefined') {
            UIUtils.showNotification('সর্বোচ্চ খোঁজার পরিসীমায় পৌঁছে গেছেন', 'warning');
        }
    }
}

// Update map markers when results change
function updateMapWithResults() {
    if (typeof MapsManager !== 'undefined' && MapsManager.addPharmacyMarkers && filteredResults) {
        MapsManager.addPharmacyMarkers(filteredResults);
    }
}

// Make functions available globally
window.viewOnMap = viewOnMap;
window.increaseSearchRadius = increaseSearchRadius;
window.updateMapWithResults = updateMapWithResults;

// Defensive: Only override displayResults if updateMapWithResults is defined
if (typeof updateMapWithResults === 'function') {
    const originalDisplayResults = displayResults;
    displayResults = function() {
        try {
            originalDisplayResults();
        } catch (err) {
            console.error('[Search] displayResults error:', err);
        }
        try {
            updateMapWithResults();
        } catch (err) {
            console.error('[Search] updateMapWithResults error:', err);
        }
    };
}}
