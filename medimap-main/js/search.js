// MediMap Search Results JavaScript - COMPLETELY REWRITTEN
console.log('[Search] Starting search.js initialization...');

// ===========================
// 1. GLOBAL VARIABLES
// ===========================
let searchType, searchQuery, filteredResults = [];
let currentSort = 'distance';
let currentStatusFilter = 'all';
let currentDistanceFilter = 'all';
let currentClinicTypeFilter = 'all';
let currentVisitTypeFilter = 'all';
let isScriptsLoaded = false;

// ===========================
// 2. DEPENDENCY LOADING SYSTEM
// ===========================
function loadScript(src, callback) {
    console.log('[Search] Loading script:', src);
    if (document.querySelector(`script[src="${src}"]`) || document.querySelector(`script[src*="${src.split('/').pop().split('?')[0]}"]`)) {
        console.log('[Search] Script already loaded:', src);
        if (callback) callback();
        return;
    }
    
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => {
        console.log('[Search] Script loaded successfully:', src);
        if (callback) callback();
    };
    script.onerror = () => {
        console.error('[Search] Failed to load script:', src);
        if (callback) callback(); // Continue even if failed
    };
    document.head.appendChild(script);
}

function loadAllDependencies(callback) {
    console.log('[Search] Loading all dependencies...');
    
    // Load Google Maps API first
    loadScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyCV4yFyJgyoLZfkFwPMH-KPXqRVQukWbDQ&libraries=places,geometry', () => {
        console.log('[Search] Google Maps API loaded');
        
        // Then load maps.js
        loadScript('js/maps.js', () => {
            console.log('[Search] maps.js loaded');
            
            // Then load medicine-names.js
            loadScript('js/medicine-names.js', () => {
                console.log('[Search] medicine-names.js loaded');
                
                // Wait a bit for all scripts to initialize
                setTimeout(() => {
                    isScriptsLoaded = true;
                    console.log('[Search] All dependencies loaded');
                    if (callback) callback();
                }, 100);
            });
        });
    });
}

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
// ===========================
// 4. CORE FUNCTIONS
// ===========================

// Get current location with proper error handling
function getCurrentLocation() {
    console.log('[Search] getCurrentLocation called');
    
    const locationEl = document.querySelector('.current-location');
    const locationText = document.getElementById('locationText');
    
    // Show loading state
    if (locationEl) {
        locationEl.innerHTML = '<i class="fas fa-spinner fa-spin"></i> অবস্থান খুঁজছি...';
    }
    if (locationText) {
        locationText.innerHTML = '<i class="fas fa-spinner fa-spin"></i> অবস্থান খুঁজছি...';
    }

    // Check if dependencies are loaded
    if (!isScriptsLoaded || typeof MapsManager === 'undefined') {
        console.log('[Search] Dependencies not ready, waiting...');
        setTimeout(getCurrentLocation, 500);
        return;
    }

    // Use MapsManager geolocation
    MapsManager.getCurrentLocation()
        .then(position => {
            console.log('[Search] Location obtained:', position);
            
            // Store globally
            window.userLocation = position;
            
            // Update UI
            if (locationEl) {
                locationEl.innerHTML = `
                    <i class="fas fa-check-circle" style="color: green;"></i>
                    অবস্থান পাওয়া গেছে
                `;
            }
            
            if (locationText) {
                locationText.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}`;
            }
            
            // Recenter map on user location
            if (typeof MapsManager !== 'undefined' && MapsManager.initializeMap) {
                MapsManager.initializeMap('map', {
                    center: position,
                    zoom: 16
                }).then(() => {
                    // Add pharmacy markers
                    if (filteredResults && filteredResults.length > 0) {
                        MapsManager.addPharmacyMarkers(filteredResults);
                    }
                    // Add user marker
                    MapsManager.addUserMarker(position);
                });
            }

            displayResults();
        })
        .catch(error => {
            console.error('[Search] Location error:', error);
            
            let errorMessage = 'অবস্থান পাওয়া যায়নি';
            if (error.code === 1) {
                errorMessage = 'অবস্থানের অনুমতি দিন';
            } else if (error.code === 2) {
                errorMessage = 'অবস্থান সেবা উপলব্ধ নেই';
            } else if (error.code === 3) {
                errorMessage = 'সময় শেষ';
            }
            
            if (locationEl) {
                locationEl.innerHTML = `<i class="fas fa-exclamation-triangle" style="color: red;"></i> ${errorMessage}`;
            }
            if (locationText) {
                locationText.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${errorMessage}`;
            }
        });
}

// Get directions to pharmacy
function getDirections(pharmacyId) {
    console.log('[Search] getDirections called for pharmacy:', pharmacyId);
    
    const pharmacy = pharmaciesData.find(p => p.id === pharmacyId);
    if (!pharmacy) {
        alert('ফার্মেসি খুঁজে পাওয়া যায়নি');
        return;
    }

    const destination = {
        lat: pharmacy.coordinates.lat,
        lng: pharmacy.coordinates.lng
    };

    // Get origin (user location or default)
    let origin = window.userLocation;
    
    if (!origin) {
        // Use default Mirpur coordinates as fallback
        origin = { lat: 23.8223, lng: 90.3654 };
        console.log('[Search] Using default origin:', origin);
    } else {
        console.log('[Search] Using user location as origin:', origin);
    }

    // Open Google Maps directions
    const googleMapsUrl = `https://www.google.com/maps/dir/${origin.lat},${origin.lng}/${destination.lat},${destination.lng}`;
    console.log('[Search] Opening directions URL:', googleMapsUrl);
    
    window.open(googleMapsUrl, '_blank');
}

// View pharmacy on map
function viewOnMap(pharmacyId) {
    console.log('[Search] viewOnMap called for pharmacy:', pharmacyId);
    
    const pharmacy = pharmaciesData.find(p => p.id === pharmacyId);
    if (!pharmacy) {
        alert('ফার্মেসি খুঁজে পাওয়া যায়নি');
        return;
    }

    // Try to use integrated map if available
    if (typeof MapsManager !== 'undefined' && MapsManager.centerOnPharmacy) {
        MapsManager.centerOnPharmacy(pharmacyId);
    } else {
        // Fallback: Open in Google Maps
        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${pharmacy.coordinates.lat},${pharmacy.coordinates.lng}`;
        window.open(googleMapsUrl, '_blank');
    }
}

// ===========================
// 5. SEARCH AND FILTER FUNCTIONS
// ===========================

function filterPharmacies() {
    try {
        console.log('[Search] Filtering pharmacies with type:', searchType, 'query:', searchQuery);

        let results = [...pharmaciesData];
        console.log('[Search] Starting with', results.length, 'total pharmacies');

        // Filter based on search type
        if (searchType === 'medicine') {
            if (searchQuery) {
                results = results.filter(pharmacy => {
                    return pharmacy.medicines && Object.keys(pharmacy.medicines).some(medicine =>
                        medicine.toLowerCase().includes(searchQuery.toLowerCase())
                    );
                });
            }
        } else if (searchType === 'symptom') {
            try {
                const symptoms = JSON.parse(searchQuery || '[]');
                if (symptoms.length > 0) {
                    const relevantMedicines = symptoms.flatMap(symptom => 
                        symptomMedicineMap[symptom] || []
                    );
                    
                    if (relevantMedicines.length > 0) {
                        results = results.filter(pharmacy => {
                            return pharmacy.medicines && Object.keys(pharmacy.medicines).some(medicine =>
                                relevantMedicines.includes(medicine)
                            );
                        });
                    }
                }
            } catch (parseError) {
                console.error('[Search] Error parsing symptoms:', parseError);
            }
        }

        // Apply location-based filtering if user location is available
        if (window.userLocation && typeof MapsManager !== 'undefined' && MapsManager.calculateDistance) {
            results.forEach(pharmacy => {
                const distance = MapsManager.calculateDistance(
                    window.userLocation.lat, window.userLocation.lng,
                    pharmacy.coordinates.lat, pharmacy.coordinates.lng
                );
                pharmacy.distanceFromUser = distance;
                pharmacy.distance = `${distance.toFixed(1)} কিমি`;
                pharmacy.distanceValue = distance;
            });

            // Filter by current radius
            const radius = window.currentRadius || 2000; // 2km default
            results = results.filter(pharmacy => (pharmacy.distanceFromUser * 1000) <= radius);
        }

        // Apply other filters
        if (currentStatusFilter === 'open') {
            results = results.filter(pharmacy => pharmacy.isOpen);
        } else if (currentStatusFilter === 'closed') {
            results = results.filter(pharmacy => !pharmacy.isOpen);
        }

        console.log('[Search] Final filtered results:', results.length, 'pharmacies');
        return results;
    } catch (error) {
        console.error('[Search] Error filtering pharmacies:', error);
        return [];
    }
}

function getRelevantMedicines(pharmacy) {
    try {
        if (!pharmacy?.medicines) return [];

        let relevantMedicines = [];

        if (searchType === 'medicine' && searchQuery) {
            Object.entries(pharmacy.medicines).forEach(([name, details]) => {
                if (name.toLowerCase().includes(searchQuery.toLowerCase())) {
                    relevantMedicines.push({name, ...details});
                }
            });
        } else if (searchType === 'symptom') {
            try {
                const symptoms = JSON.parse(searchQuery || '[]');
                const targetMedicines = symptoms.flatMap(symptom => symptomMedicineMap[symptom] || []);

                Object.entries(pharmacy.medicines).forEach(([name, details]) => {
                    if (targetMedicines.includes(name)) {
                        relevantMedicines.push({name, ...details});
                    }
                });
            } catch (parseError) {
                console.error('[Search] Error parsing symptoms in getRelevantMedicines:', parseError);
            }
        }

        return relevantMedicines;
    } catch (error) {
        console.error('[Search] Error getting relevant medicines:', error);
        return [];
    }
}

function sortResults() {
    if (!Array.isArray(filteredResults)) return;
    
    filteredResults.sort((a, b) => {
        switch (currentSort) {
            case 'distance':
                return (a.distanceValue || 0) - (b.distanceValue || 0);
            case 'availability':
                if (a.isOpen && !b.isOpen) return -1;
                if (!a.isOpen && b.isOpen) return 1;
                return (a.distanceValue || 0) - (b.distanceValue || 0);
            default:
                return 0;
        }
    });
}

// ===========================
// 6. DISPLAY FUNCTIONS
// ===========================

function displayResults() {
    try {
        console.log('[Search] Displaying search results...');
        
        const resultsList = document.getElementById('resultsList');
        const resultsCountElement = document.getElementById('resultsCount');
        
        if (!resultsList) {
            console.error('[Search] Results list element not found!');
            return;
        }

        // Filter and sort pharmacies
        filteredResults = filterPharmacies();
        sortResults();

        // Update results count
        if (resultsCountElement) {
            resultsCountElement.textContent = filteredResults.length;
        }

        if (filteredResults.length === 0) {
            resultsList.innerHTML = `
                <div class="no-results" style="text-align: center; padding: 40px; color: #6b7280;">
                    <i class="fas fa-search" style="font-size: 4rem; color: #d1d5db; margin-bottom: 1rem;"></i>
                    <h3 style="color: #374151; margin-bottom: 1rem;">কোন ফার্মেসি পাওয়া যায়নি</h3>
                    <p style="margin-bottom: 2rem;">আপনার অনুসন্ধানের জন্য কোন ফার্মেসি খুঁজে পাওয়া যায়নি।</p>
                    <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                        <button onclick="location.reload()" class="btn btn-secondary">
                            <i class="fas fa-sync"></i> আবার চেষ্টা করুন
                        </button>
                        <a href="index.html" class="btn btn-primary">
                            <i class="fas fa-search"></i> নতুন অনুসন্ধান
                        </a>
                    </div>
                </div>
            `;
            return;
        }

        // Generate HTML for pharmacy cards
        resultsList.innerHTML = filteredResults.map(pharmacy => {
            const relevantMedicines = getRelevantMedicines(pharmacy);
            
            return `
                <div class="card">
                    <div class="card-content">
                        <div class="card-header">
                            <h2>${pharmacy.name}</h2>
                            <span class="status" style="color:${pharmacy.isOpen ? 'green' : 'red'};">
                                ${pharmacy.isOpen ? 'খোলা' : 'বন্ধ'}
                            </span>
                        </div>

                        <div class="info">${pharmacy.address} · ${pharmacy.distance}</div>

                        <div class="medicine-list">
                            ${relevantMedicines.length > 0 ? relevantMedicines.map(med => `
                                <div class="medicine-item">
                                    <span>💊 ${med.name}</span>
                                    <span>৳ ${med.price} টাকা | স্টক: ${med.stock}</span>
                                </div>
                            `).join('') : `
                                <div class="info">এই ফার্মেসিতে আপনার খোঁজা ওষুধ নেই।</div>
                            `}
                        </div>

                        <div class="info">⏰ ${pharmacy.openingHours}</div>
                        <div class="contact">
                            <i class="fa-solid fa-phone"></i>
                            <a href="tel:${pharmacy.phone}">${pharmacy.phone}</a>
                        </div>

                        <div class="buttons">
                            <button class="map-btn" onclick="viewOnMap(${pharmacy.id})">
                                🗺 ম্যাপে দেখুন
                            </button>
                            <button class="dir-btn" onclick="getDirections(${pharmacy.id})">
                                দিক-নির্দেশনা
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Update map markers if available
        if (typeof MapsManager !== 'undefined' && MapsManager.addPharmacyMarkers && filteredResults.length > 0) {
            MapsManager.addPharmacyMarkers(filteredResults);
        }

        console.log('[Search] Results displayed successfully');
    } catch (error) {
        console.error('[Search] Error displaying results:', error);
    }
}

function loadSearchData() {
    try {
        console.log('[Search] Loading search data from localStorage...');

        searchType = localStorage.getItem('searchType') || 'medicine';
        searchQuery = localStorage.getItem('searchQuery') || '';

        console.log('[Search] Search type:', searchType);
        console.log('[Search] Search query:', searchQuery);

        const searchQueryElement = document.getElementById('searchQuery');
        if (!searchQueryElement) return;

        if (searchType === 'medicine') {
            searchQueryElement.textContent = searchQuery || 'কোন ওষুধ নির্বাচিত হয়নি';
        } else if (searchType === 'symptom') {
            try {
                const symptoms = searchQuery ? JSON.parse(searchQuery) : [];
                const symptomNames = {
                    'fever': 'জ্বর',
                    'cold': 'সর্দি',
                    'headache': 'মাথা ব্যথা',
                    'gastric': 'গ্যাস্ট্রিক',
                    'body-pain': 'হাত/পায়ে ব্যথা'
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
        } else {
            searchQueryElement.textContent = 'অজানা খোঁজের ধরন';
        }
    } catch (error) {
        console.error('[Search] Error loading search data:', error);
    }
}

function setupFilters() {
    // Setup filter event listeners
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

    const radiusFilter = document.getElementById('radiusFilter');
    if (radiusFilter) {
        radiusFilter.addEventListener('change', (e) => {
            window.currentRadius = parseInt(e.target.value);
            displayResults();
        });
    }
}

function initializeMap() {
    if (typeof MapsManager === 'undefined') {
        console.log('[Search] MapsManager not available, retrying...');
        setTimeout(initializeMap, 500);
        return;
    }

    MapsManager.initializeMap('map')
        .then(map => {
            console.log('[Search] Map initialized successfully');
            if (filteredResults && filteredResults.length > 0) {
                MapsManager.addPharmacyMarkers(filteredResults);
            }
        })
        .catch(error => {
            console.error('[Search] Map initialization failed:', error);
        });
}

// ===========================
// 7. INITIALIZATION
// ===========================

function initializeSearchPage() {
    console.log('[Search] Initializing search page...');

    // Validate DOM elements
    const searchQueryEl = document.getElementById('searchQuery');
    const resultsListEl = document.getElementById('resultsList');
    const resultsCountEl = document.getElementById('resultsCount');

    if (!searchQueryEl || !resultsListEl || !resultsCountEl) {
        console.error('[Search] Critical DOM elements missing!');
        return false;
    }

    // Set default search data if none exists
    if (!localStorage.getItem('searchType')) {
        localStorage.setItem('searchType', 'symptom');
        localStorage.setItem('searchQuery', '["fever"]');
    }

    // Show loading initially
    resultsListEl.innerHTML = '<div class="loading" style="text-align:center; padding:40px;">ফলাফল লোড হচ্ছে...</div>';
    searchQueryEl.textContent = 'অনুসন্ধান চলছে...';
    resultsCountEl.textContent = '0';

    // Load search data and display results
    loadSearchData();
    setupFilters();
    
    // Initialize map
    if (isScriptsLoaded) {
        initializeMap();
        displayResults();
    } else {
        // Wait for scripts to load
        setTimeout(() => {
            initializeMap();
            displayResults();
        }, 1000);
    }

    return true;
}

// ===========================
// 8. GLOBAL EXPORTS
// ===========================
// Export functions to global scope immediately
window.getCurrentLocation = getCurrentLocation;
window.getDirections = getDirections;
window.viewOnMap = viewOnMap;

// ===========================
// 9. DOM READY INITIALIZATION
// ===========================

// Load dependencies first, then initialize
loadAllDependencies(() => {
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeSearchPage);
    } else {
        initializeSearchPage();
    }
});

console.log('[Search] search.js loaded and ready');