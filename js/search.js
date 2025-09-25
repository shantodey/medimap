 // MediMap Search Results JavaScript

    // Sample pharmacy data for Mirpur-1
    const pharmaciesData = [
        {
            id: 1,
            name: "Popular Pharmacy",
            address: "শপিং সেন্টার, মিরপুর-১, ঢাকা",
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
            }
        },
        {
            id: 2,
            name: "Square Pharmacy",
            address: "কাজীপাড়া মোড়, মিরপুর-১, ঢাকা",
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
            }
        },
        {
            id: 3,
            name: "Lazz Pharmacy",
            address: "ব্লক-সি, মিরপুর-১, ঢাকা",
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
            }
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
            }
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
            }
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
            }
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
            }
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

    // Initialize page when DOM loads
    document.addEventListener('DOMContentLoaded', () => {
        loadSearchData();
        displayResults();
        setupFilters();
        initializeMap();
    });

    // Load search data from localStorage
    function loadSearchData() {
        searchType = localStorage.getItem('searchType') || 'medicine';
        searchQuery = localStorage.getItem('searchQuery') || '';
        
        // Update search query display
        const searchQueryElement = document.getElementById('searchQuery');
        
        if (searchType === 'medicine') {
            searchQueryElement.textContent = searchQuery;
        } else if (searchType === 'symptom') {
            const symptoms = JSON.parse(searchQuery);
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
            const displaySymptoms = symptoms.map(s => symptomNames[s]).join(', ');
            searchQueryElement.textContent = displaySymptoms;
        } else if (searchType === 'emergency') {
            searchQueryElement.textContent = 'অক্সিজেন সিলিন্ডার';
        }
    }

    // Display search results
    function displayResults() {
        const resultsList = document.getElementById('resultsList');
        filteredResults = filterPharmacies();
        
        // Sort results
        sortResults();
        
        // Update results count
        document.getElementById('resultsCount').textContent = filteredResults.length;
        
        if (filteredResults.length === 0) {
            resultsList.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search no-results-icon"></i>
                    <h3>কোন ফার্মাসি পাওয়া যায়নি</h3>
                    <p>দুঃখিত, আপনার খোঁজা ওষুধটি এই এলাকায় পাওয়া যাচ্ছে না।</p>
                    <a href="index.html" class="btn btn-primary" style="margin-top: 20px;">
                        নতুন খোঁজ শুরু করুন
                    </a>
                </div>
            `;
            return;
        }
        
        resultsList.innerHTML = filteredResults.map(pharmacy => {
            const relevantMedicines = getRelevantMedicines(pharmacy);
            
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
                                <div style="margin-bottom: 10px;">
                                    <div class="medicine-name">
                                        <i class="fas fa-pills" style="margin-right: 8px;"></i>
                                        ${med.name}
                                    </div>
                                    <div class="medicine-price">৳ ${med.price} টাকা</div>
                                    <div class="medicine-stock">স্টক: ${med.stock} টি</div>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                    
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
                        <button class="btn btn-primary" onclick="getDirections(${pharmacy.id})">
                            <i class="fas fa-directions"></i>
                            দিক-নির্দেশনা
                        </button>
                        <button class="btn btn-success" onclick="callPharmacy('${pharmacy.phone}')">
                            <i class="fas fa-phone"></i>
                            ফোন করুন
                        </button>
                        <button class="btn btn-outline" onclick="viewDetails(${pharmacy.id})">
                            <i class="fas fa-info-circle"></i>
                            বিস্তারিত
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Filter pharmacies based on search criteria
    function filterPharmacies() {
        let results = [...pharmaciesData];
        
        // Filter based on search type
        if (searchType === 'medicine') {
            results = results.filter(pharmacy => {
                return Object.keys(pharmacy.medicines).some(medicine => 
                    medicine.toLowerCase().includes(searchQuery.toLowerCase())
                );
            });
        } else if (searchType === 'symptom') {
            const symptoms = JSON.parse(searchQuery);
            const relevantMedicines = symptoms.flatMap(symptom => symptomMedicineMap[symptom] || []);
            
            results = results.filter(pharmacy => {
                return Object.keys(pharmacy.medicines).some(medicine => 
                    relevantMedicines.includes(medicine)
                );
            });
        } else if (searchType === 'emergency') {
            results = results.filter(pharmacy => {
                return Object.keys(pharmacy.medicines).some(medicine => 
                    medicine.includes('অক্সিজেন')
                );
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
        
        return results;
    }

    // Get relevant medicines for a pharmacy
    function getRelevantMedicines(pharmacy) {
        let relevantMedicines = [];
        
        if (searchType === 'medicine') {
            Object.entries(pharmacy.medicines).forEach(([name, details]) => {
                if (name.toLowerCase().includes(searchQuery.toLowerCase())) {
                    relevantMedicines.push({name, ...details});
                }
            });
        } else if (searchType === 'symptom') {
            const symptoms = JSON.parse(searchQuery);
            const targetMedicines = symptoms.flatMap(symptom => symptomMedicineMap[symptom] || []);
            
            Object.entries(pharmacy.medicines).forEach(([name, details]) => {
                if (targetMedicines.includes(name)) {
                    relevantMedicines.push({name, ...details});
                }
            });
        } else if (searchType === 'emergency') {
            Object.entries(pharmacy.medicines).forEach(([name, details]) => {
                if (name.includes('অক্সিজেন')) {
                    relevantMedicines.push({name, ...details});
                }
            });
        }
        
        return relevantMedicines;
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
        document.getElementById('sortFilter').addEventListener('change', (e) => {
            currentSort = e.target.value;
            displayResults();
        });
        
        document.getElementById('statusFilter').addEventListener('change', (e) => {
            currentStatusFilter = e.target.value;
            displayResults();
        });
        
        document.getElementById('distanceFilter').addEventListener('change', (e) => {
            currentDistanceFilter = e.target.value;
            displayResults();
        });
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