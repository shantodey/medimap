// MediMap Search Results JavaScript
// Load Google Maps API if not already loaded
if (!document.querySelector('script[src*="maps.googleapis.com"]')) {
    const mapsScript = document.createElement('script');
    mapsScript.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCV4yFyJgyoLZfkFwPMH-KPXqRVQukWbDQ&libraries=places,geometry';
    mapsScript.async = true;
    mapsScript.defer = true;
    document.head.appendChild(mapsScript);
}

// Load maps.js file if not already loaded
if (!document.querySelector('script[src="js/maps.js"]')) {
    const mapsDep = document.createElement('script');
    mapsDep.src = 'js/maps.js';
    document.head.appendChild(mapsDep);
}
// Add medicine-names.js script to the page if not already added

if (!document.querySelector('script[src="js/medicine-names.js"]')) {
    const script = document.createElement('script');
    script.src = 'js/medicine-names.js';
    document.head.appendChild(script);
}

// Sample pharmacy data for Mirpur-1 and Mirpur-12, 
const pharmaciesData = [
    {
        id: 1,
        name: "Popular Medicine Corner",
        address: "শপিং সেন্টার, মিরপুর-১২, ঢাকা",
        phone: "01711-123456",
        coordinates: {lat: 23.827176225013428, lng: 90.36621429873858},
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
        name: "Asia Pharmacy and Surgical Center",
        address: " পল্লবী শপিং সেন্টার, মিরপুর , ঢাকা-১২১৬",
        phone: "01946326690",
        coordinates: {lat: 23.82495139292639, lng: 90.36398381000784},
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
        phone: "01799400603",
        coordinates: {lat: 23.829760440991578, lng: 90.36359757190692},
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
        coordinates: {lat: 23.824960865429414, lng: 90.36443441964458},
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
        address: "ব্লক সি, রোড নাম্বার ৩৬/৫. মিরপুর -১২",
        phone: "01711-567890",
        coordinates: {lat: 23.828772993082932, lng: 90.36805814373362},
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
        address: " ব্লক এ, প্লট ১২, মিরপুর-১০",
        phone: "01511-678901",
        coordinates: {lat: 23.810158551525635, lng: 90.3687760309106},
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
        name: "Life Pharma",
        address: " সেক্টর-৬, মিরপুর ৬, ঢাকা",
        phone: "01846550879",
        coordinates: {lat: 23.814604155480037, lng: 90.36357131278284},
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
    },
    {
        id: 8,
        name: "Aalok Healthcare Ltd.",
        address: " আলবা টাওয়ার, ২/৬ পল্লবী, মিরপুর",
        phone: "01769969860",
        coordinates: {lat: 23.824279982497746, lng: 90.36408246102691},
        openingHours: "২৪ ঘন্টা খোলা",
        isOpen: true,
        distance: "২.০ কিমি",
        distanceValue: 2.0,
        medicines: {
            "অ্যাভিল": {price: 38, stock: 20},
            "নিওবিয়ন": {price: 130, stock: 15},
            "রোক্সাডেক্স": {price: 145, stock: 10},
            "আইবিউপ্রোফেন": {price: 5, stock: 75},
        },
        type: 'hospital',
        visitType: 'open'
    },
    {
        id: 9,
        name: "Ibn Sina Homoeo Pharmacy",
        address: " গ্রাউন্ড ফ্লোর, ১২/৭ পল্লবী , মিরপুর ১২ ",
        phone: "01711152960",
        coordinates: {lat: 23.823609275931226, lng: 90.36316216219846},
        openingHours: "সকাল ৯টা - রাত ৯টা",
        isOpen: true,
        distance: "১.৭ কিমি",
        distanceValue: 1.7,
        medicines: {
            "সেরজেল": {price: 7, stock: 50},
            "এসি পাওয়ার": {price: 23, stock: 30},
            "অ্যাসমাফেন": {price: 150, stock: 15},
            "কমফিট গ্লাভস": {price: 60, stock: 40},
        },
        type: 'pharmacy',
        visitType: 'open'
    },
    {
        id: 10,
        name: "M/S Manik Pharmacy",
        address: "দারুস সালাম রোড, মিরপুর-১, ঢাকা",
        phone: "01914-031712",
        coordinates: {lat: 23.794745440595683, lng: 90.35331724296715},
        openingHours: "সকাল ১০টা - রাত ১০টা",
        isOpen: true,
        distance: "১.৯ কিমি",
        distanceValue: 1.9,
        medicines: {
            "মেটফরমিন": {price: 5, stock: 70},
            "রেনিটিডিন": {price: 2, stock: 90},
            "ওমিডন": {price: 1, stock: 120}
        },
        type: 'pharmacy',
        visitType: 'open'
    },
    {
        id: 11,
        name: "Ayesha medicine center",
        address: " পল্লবী শপিং সেন্টার, মিরপুর ১২, ঢাকা",
        phone: "01729798888",
        coordinates: {lat: 23.82453878839274, lng: 90.36392949500313},
        openingHours: "সকাল ৮টা - রাত ১২টা",
        isOpen: true,
        distance: "0.১ কিমি",
        distanceValue: 2.1,
        medicines: {
            "অ্যালজিন": {price: 10, stock: 50},
            "ভিকটাস": {price: 25, stock: 30},
            "ওমেপ্রাজল": {price: 8, stock: 80}
        },
        type: 'pharmacy',
        visitType: 'open'
    },
    {
        id: 12,
        name: "Docyor' Pharma",
        address: "শপ-২০ পল্লবী শপিং সেন্টার, মিরপুর ১২, ঢাকা",
        phone: "01319-864049",
        coordinates: {lat: 23.824558196289843, lng:  90.36371391265232},
        openingHours: "সকাল ৯:৩০ - রাত ১০:০০",
        isOpen: true,
        distance: "0.1 কিমি",
        distanceValue: 0.1,
        medicines: {
            "নাপা": {price: 3, stock: 75},
            "হিস্টাসিন": {price: 0.29, stock: 150},
            "এসি": {price: 1.2, stock: 90},
            "ফ্লুক্লক্স": {price: 14, stock: 25},
            "মেটফরমিন": {price: 5, stock: 40}
        },
        type: 'pharmacy',
        visitType: 'open'
    },
    {
        id: 13,
        name: "YEAMIN MEDICIN SHOP",
        address: "রোড নম্বর ৯, হাউস নাম্বার ১৩, পল্লবী, মিরপুর ১২ ",
        phone: "01319-864049",
        coordinates: {lat: 23.824280320253532, lng:  90.36207441239182}, 
        openingHours: "সকাল ৯:০০ - রাত ৯:০০",
        isOpen: true,
        distance: "৪০০ মিটার",
        distanceValue: 0.400,
        medicines: {
            "সার্জেল": {price: 6, stock: 60},
            "ওমিপ্রাজল": {price: 6, stock: 80},
            "নাপা এক্সট্রা": {price: 4, stock: 50},
            "ব্রোফেক্স": {price: 40.13, stock: 30},
            "এন্টাজল": {price: 18, stock: 45}
        },
        type: 'pharmacy',
        visitType: 'open'
    },
    {
        id: 14,
        name: "Mahmud Pharmacy",
        address: " রূপনগর রোড, পল্লবী, মিরপুর ১২",
        phone: "01711671619", 
        coordinates: {lat: 23.8224810335163, lng: 90.35705872264872},
        openingHours: "সকাল ৯:০০ - রাত ৯:০০",
        isOpen: true,
        distance: "১.1 কিমি",
        distanceValue: 1.1,
        medicines: {
            "সার্জেল": {price: 6, stock: 30},
            "ওমিপ্রাজল": {price: 6, stock: 40},
            "নাপা এক্সট্রা": {price: 4, stock: 25},
            "ব্রোফেক্স": {price: 40.13, stock: 10},
            "এন্টাজল": {price: 18, stock: 5}
        },
        type: 'pharmacy',
        visitType: 'open',
    }
];

// Medicine symptoms mapping
const symptomMedicineMap = {
    "fever": ["নাপা", "napa", "নাপা এক্সট্রা", "প্যারাসিটামল", "এসি", "অ্যাসমাফেন", "এসি পাওয়ার"],
    "cold": ["হিস্টাসিন", "ফেক্সো", "অ্যালারিন", "সেট্রিজিন", "অ্যাভিল", "রোক্সাডেক্স"],
    "headache": ["নাপা", "সার্জেল", "ম্যাক্সপ্রো", "এসি প্লাস", "সেরজেল"],
    "diarrhea": ["ওরস্যালাইন", "ইমোডিয়াম", "ফ্ল্যাজিল", "অ্যান্টাসিড"],
    "body-pain": ["নাপা", "এসি প্লাস", "ফ্লেক্সি", "আইবিউপ্রোফেন"],
    "allergy": ["হিস্টাসিন", "ফেক্সো", "সেট্রিজিন", "অ্যাভিল"],
    "gastric": ["ওমিপ্রাজল", "অ্যান্টাসিড", "সেরজেল", "মেটফরমিন", "ওমিডন", "ওমেপ্রাজল", "রেনিটিডিন"],
    "asthma": ["অ্যাসমাফেন"],
    "oxygen": ["অক্সিজেন সিলিন্ডার"],
    "wound-care": ["কমফিট গ্লাভস"],
    "diabetes": ["মেটফরমিন"],
    "vitamin-deficiency": ["নিওবিয়ন"],
    "general-pain": ["অ্যালজিন", "ভিকটাস"],
    "stomach-pain": ["ওমেপ্রাজল", "ওমিডন", "ওমেপ্রাজল"],
    "toothache": ["নাপা", "সার্জেল", "আইবিউপ্রোফেন"],
    "nasal-congestion": ["হিস্টাসিন", "রোক্সাডেক্স"]
};

// Global variables
let searchType, searchQuery, filteredResults = [];
let currentSort = 'distance';
let currentStatusFilter = 'all';
let currentDistanceFilter = 'all';
let currentClinicTypeFilter = 'all';
let currentVisitTypeFilter = 'all';

// Get current location - MOVED TO GLOBAL SCOPE
function getCurrentLocation() {
    // Wait for MapsManager to be available
    if (typeof MapsManager === 'undefined') {
        setTimeout(getCurrentLocation, 500);
        return;
    }

    const loading = document.querySelector('.map-placeholder');
    if (loading) {
        loading.innerHTML = '<i class="fas fa-spinner fa-spin"></i><br>অবস্থান খুঁজছি...';
    }

    // Use MapsManager's proper geolocation
    MapsManager.getCurrentLocation()
        .then(position => {
            console.log('[Search] Real location obtained:', position);
            
            // Store globally for search filtering
            window.userLocation = position;
            userLocation = position;
            
            // Update UI
            const locationEl = document.querySelector('.current-location');
            if (locationEl) {
                locationEl.innerHTML = `
                    <i class="fas fa-location-arrow"></i>
                    আপনার অবস্থান পাওয়া গেছে
                `;
            }
            
            // Refresh search results with real location
            if (typeof displayResults === 'function') {
                displayResults();
            }
        })
        .catch(error => {
            console.error('[Search] Location error:', error);
            alert('অবস্থান খুঁজে পাওয়া যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।');
            
            if (loading) {
                loading.innerHTML = '<i class="fas fa-map"></i><br>Google Maps<br>লোড হচ্ছে...';
            }
        });
}
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
      <div class="card">
        <div class="card-content">
          <div class="card-header">
            <h2 >${pharmacy.name}</h2>
            <span class="status" style="color:${pharmacy.isOpen ? 'green' : 'red'};">
              ${pharmacy.isOpen ? 'খোলা' : 'বন্ধ'}
            </span>
          </div>

          <div class="info"> ${pharmacy.address} · ${pharmacy.distance}</div>

          <div class="medicine-list">
            ${relevantMedicines.length > 0 ? relevantMedicines.map(med => `
              <div class="medicine-item">
                <span>💊 ${med.name}</span>
                <span>৳ ${med.price} টাকা | স্টক: ${med.stock}</span>
              </div>
            `).join('') : `
              <div class="info">এই ফার্মাসিতে আপনার খোঁজা ওষুধ নেই।</div>
            `}
          </div>

          <div class="info">⏰ ${pharmacy.openingHours}</div>
          <div class="contact"> <i class="fa-solid fa-phone"></i><a href="">${pharmacy.phone}</a> </div>

          <div class="buttons">
            <button class="map-btn" onclick="viewOnMap(${pharmacy.id})">📍 ম্যাপে দেখুন</button>
            <button class="dir-btn" onclick="getDirections(${pharmacy.id})">দিক-নির্দেশনা</button>
          </div>
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
    // Wait for MapsManager to be available
    if (typeof MapsManager === 'undefined') {
        setTimeout(getCurrentLocation, 500);
        return;
    }

    const loading = document.querySelector('.map-placeholder');
    if (loading) {
        loading.innerHTML = '<i class="fas fa-spinner fa-spin"></i><br>অবস্থান খুঁজছি...';
    }

    // Use MapsManager's proper geolocation
    MapsManager.getCurrentLocation()
        .then(position => {
            console.log('[Search] Real location obtained:', position);
            
            // Store globally for search filtering
            window.userLocation = position;
            userLocation = position;
            
            // Update UI
            const locationEl = document.querySelector('.current-location');
            if (locationEl) {
                locationEl.innerHTML = `
                    <i class="fas fa-location-arrow"></i>
                    আপনার অবস্থান পাওয়া গেছে
                `;
            }
            
            // Refresh search results with real location
            if (typeof displayResults === 'function') {
                displayResults();
            }
        })
        .catch(error => {
            console.error('[Search] Location error:', error);
            alert('অবস্থান খুঁজে পাওয়া যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।');
            
            if (loading) {
                loading.innerHTML = '<i class="fas fa-map"></i><br>Google Maps<br>লোড হচ্ছে...';
            }
        });
}

// Initialize Google Maps
function initializeMap() {
    // Wait for MapsManager to be available
    if (typeof MapsManager === 'undefined') {
        setTimeout(initializeMap, 500);
        return;
    }

    // Initialize real Google Map
    MapsManager.initializeMap('map')
        .then(map => {
            console.log('[Search] Map initialized successfully');
            
            // Add pharmacy markers if results are available
            if (filteredResults && filteredResults.length > 0) {
                MapsManager.addPharmacyMarkers(filteredResults);
            }
        })
        .catch(error => {
            console.error('[Search] Map initialization failed:', error);
            showMapFallback();
        });
}

// Initialize map with user location
function initializeMapWithLocation(lat, lng) {
    // Use MapsManager to create real map
    if (typeof MapsManager !== 'undefined') {
        MapsManager.initializeMap('map', {
            center: { lat, lng },
            zoom: 16
        }).then(() => {
            // Add pharmacy markers to map
            if (filteredResults && filteredResults.length > 0) {
                MapsManager.addPharmacyMarkers(filteredResults);
            }
        }).catch(error => {
            console.error('[Search] Map initialization failed:', error);
            showMapFallback();
        });
    } else {
        showMapFallback();
    }
}

function showMapFallback() {
    const mapPlaceholder = document.querySelector('.map-placeholder');
    if (mapPlaceholder) {
        mapPlaceholder.innerHTML = `
            <div style="width: 100%; height: 100%; background: #e5e7eb; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-direction: column;">
                <i class="fas fa-map" style="font-size: 3rem; color: #9ca3af; margin-bottom: 1rem;"></i>
                <p style="color: #6b7280;">মানচিত্র লোড করা যাচ্ছে না</p>
            </div>
        `;
    }
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


function viewOnMap(pharmacyId) {

    const pharmacy = pharmaciesData.find(p => p.id === pharmacyId);
    if (!pharmacy) {
        alert('ফার্মাসি খুঁজে পাওয়া যায়নি');
        return;
    }

    // Center the map on the pharmacy's coordinates
    if (typeof map !== 'undefined' && map) {
        // Create a new LatLng object for the pharmacy location
        const pharmacyLocation = new google.maps.LatLng(
            pharmacy.coordinates.lat, 
            pharmacy.coordinates.lng
        );
        
        // Center the map on this location
        map.setCenter(pharmacyLocation);
        
        // Optionally zoom in a bit
        map.setZoom(16);
        
        // Find and highlight the marker for this pharmacy
        if (typeof markers !== 'undefined' && markers) {
            markers.forEach(marker => {
                if (marker.pharmacyId === pharmacyId) {
                    // Make this marker bounce or change color
                    marker.setAnimation(google.maps.Animation.BOUNCE);
                    
                    // Stop animation after 2 seconds
                    setTimeout(() => {
                        marker.setAnimation(null);
                    }, 2000);
                    
                    // Open info window if it exists
                    if (marker.infoWindow) {
                        marker.infoWindow.open(map, marker);
                    }
                }
            });
        }
        
        // Show success message
        if (typeof UIUtils !== 'undefined' && UIUtils.showNotification) {
            UIUtils.showNotification(`${pharmacy.name} ম্যাপে দেখানো হচ্ছে`, 'success');
        }
        
    } else {
        // Fallback: open in Google Maps if integrated map is not available
        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${pharmacy.coordinates.lat},${pharmacy.coordinates.lng}`;
        window.open(googleMapsUrl, '_blank');
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









