// MediMap Google Maps Integration

// Maps Configuration
const MAPS_CONFIG = {
    API_KEY: 'YOUR_GOOGLE_MAPS_API_KEY', // Replace with actual API key
    DEFAULT_CENTER: {
        lat: 23.7956, // Mirpur-1 coordinates
        lng: 90.3537
    },
    DEFAULT_ZOOM: 15,
    SEARCH_RADIUS: 2000, // 2km in meters
    MARKER_COLORS: {
        pharmacy: '#10b981',
        user: '#2563eb',
        selected: '#dc2626'
    }
};

// Global Maps Variables
let map = null;
let mapMarkers = [];
let userMarker = null;
let directionsService = null;
let directionsRenderer = null;
let geocoder = null;
let placesService = null;
let currentInfoWindow = null;

// Maps Manager
const MapsManager = {
    
    // Initialize Google Maps
    async initializeMap(containerId, options = {}) {
        try {
            // Check if Google Maps API is loaded
            if (typeof google === 'undefined') {
                await this.loadGoogleMapsAPI();
            }
            
            const container = document.getElementById(containerId);
            if (!container) {
                throw new Error(`Map container with ID '${containerId}' not found`);
            }
            
            // Map options
            const mapOptions = {
                center: options.center || MAPS_CONFIG.DEFAULT_CENTER,
                zoom: options.zoom || MAPS_CONFIG.DEFAULT_ZOOM,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                zoomControl: true,
                mapTypeControl: false,
                scaleControl: true,
                streetViewControl: false,
                rotateControl: false,
                fullscreenControl: true,
                gestureHandling: 'cooperative',
                styles: this.getMapStyles()
            };
            
            // Create map
            map = new google.maps.Map(container, mapOptions);
            
            // Initialize services
            directionsService = new google.maps.DirectionsService();
            directionsRenderer = new google.maps.DirectionsRenderer({
                suppressMarkers: false,
                draggable: false
            });
            directionsRenderer.setMap(map);
            
            geocoder = new google.maps.Geocoder();
            placesService = new google.maps.places.PlacesService(map);
            
            // Setup event listeners
            this.setupMapEventListeners();
            
            console.log('[Maps] Google Maps initialized successfully');
            return map;
            
        } catch (error) {
            console.error('[Maps] Failed to initialize Google Maps:', error);
            this.showMapFallback(containerId);
            throw error;
        }
    },
    
    // Load Google Maps API dynamically
    loadGoogleMapsAPI() {
        return new Promise((resolve, reject) => {
            // Check if already loaded
            if (typeof google !== 'undefined' && google.maps) {
                resolve();
                return;
            }
            
            // Create script tag
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_CONFIG.API_KEY}&libraries=places,geometry`;
            script.async = true;
            script.defer = true;
            
            script.onload = () => {
                console.log('[Maps] Google Maps API loaded');
                resolve();
            };
            
            script.onerror = () => {
                const error = new Error('Failed to load Google Maps API');
                console.error('[Maps]', error);
                reject(error);
            };
            
            document.head.appendChild(script);
        });
    },
    
    // Get custom map styles
    getMapStyles() {
        return [
            {
                "featureType": "poi",
                "elementType": "labels",
                "stylers": [{"visibility": "off"}]
            },
            {
                "featureType": "transit",
                "elementType": "labels",
                "stylers": [{"visibility": "off"}]
            }
        ];
    },
    
    // Setup map event listeners
    setupMapEventListeners() {
        if (!map) return;
        
        // Map click event
        map.addListener('click', (event) => {
            console.log('Map clicked:', event.latLng.toJSON());
        });
        
        // Map bounds change
        map.addListener('bounds_changed', () => {
            // Update visible pharmacies based on new bounds
            this.updateVisiblePharmacies();
        });
    },
    
    // Add pharmacy markers
    addPharmacyMarkers(pharmacies) {
        if (!map || !Array.isArray(pharmacies)) return;
        
        // Clear existing markers
        this.clearMarkers();
        
        pharmacies.forEach(pharmacy => {
            if (!pharmacy.coordinates) return;
            
            const marker = new google.maps.Marker({
                position: {
                    lat: pharmacy.coordinates.lat,
                    lng: pharmacy.coordinates.lng
                },
                map: map,
                title: pharmacy.name,
                icon: this.getPharmacyIcon(pharmacy),
                animation: google.maps.Animation.DROP
            });
            
            // Create info window content
            const infoWindow = new google.maps.InfoWindow({
                content: this.createPharmacyInfoWindow(pharmacy)
            });
            
            // Add click listener
            marker.addListener('click', () => {
                // Close previous info window
                if (currentInfoWindow) {
                    currentInfoWindow.close();
                }
                
                infoWindow.open(map, marker);
                currentInfoWindow = infoWindow;
                
                // Highlight pharmacy in list (if exists)
                this.highlightPharmacyInList(pharmacy.id);
            });
            
            // Store marker reference
            marker.pharmacyId = pharmacy.id;
            mapMarkers.push(marker);
        });
        
        // Fit bounds to show all markers
        if (mapMarkers.length > 0) {
            this.fitBoundsToMarkers();
        }
    },
    
    // Create pharmacy icon
    getPharmacyIcon(pharmacy) {
        const color = pharmacy.isOpen ? MAPS_CONFIG.MARKER_COLORS.pharmacy : '#64748b';
        
        return {
            url: `data:image/svg+xml;base64,${btoa(`
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
                    <circle cx="12" cy="12" r="10" fill="${color}" stroke="white" stroke-width="2"/>
                    <text x="12" y="16" text-anchor="middle" fill="white" font-family="Arial" font-size="12" font-weight="bold">+</text>
                </svg>
            `)}`,
            scaledSize: new google.maps.Size(32, 32),
            anchor: new google.maps.Point(16, 16)
        };
    },
    
    // Create info window content for pharmacy
    createPharmacyInfoWindow(pharmacy) {
        const status = pharmacy.isOpen ? 
            '<span style="color: #10b981; font-weight: bold;">খোলা</span>' : 
            '<span style="color: #dc2626; font-weight: bold;">বন্ধ</span>';
            
        return `
            <div style="max-width: 300px; font-family: Arial, sans-serif;">
                <h3 style="margin: 0 0 10px 0; color: #1e293b;">${pharmacy.name}</h3>
                <div style="margin-bottom: 8px;">
                    <strong>ঠিকানা:</strong> ${pharmacy.address}
                </div>
                <div style="margin-bottom: 8px;">
                    <strong>ফোন:</strong> <a href="tel:${pharmacy.phone}">${pharmacy.phone}</a>
                </div>
                <div style="margin-bottom: 8px;">
                    <strong>সময়:</strong> ${pharmacy.openingHours}
                </div>
                <div style="margin-bottom: 12px;">
                    <strong>অবস্থা:</strong> ${status}
                </div>
                <div style="display: flex; gap: 8px;">
                    <button onclick="MapsManager.getDirections({lat: ${pharmacy.coordinates.lat}, lng: ${pharmacy.coordinates.lng}})" 
                            style="background: #2563eb; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                        দিক-নির্দেশনা
                    </button>
                    <button onclick="window.open('tel:${pharmacy.phone}')" 
                            style="background: #10b981; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                        কল করুন
                    </button>
                </div>
            </div>
        `;
    },
    
    // Add user location marker
    addUserMarker(position) {
        if (!map) return;
        
        // Remove existing user marker
        if (userMarker) {
            userMarker.setMap(null);
        }
        
        userMarker = new google.maps.Marker({
            position: position,
            map: map,
            title: 'আপনার অবস্থান',
            icon: {
                url: `data:image/svg+xml;base64,${btoa(`
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                        <circle cx="12" cy="12" r="8" fill="${MAPS_CONFIG.MARKER_COLORS.user}" stroke="white" stroke-width="3"/>
                        <circle cx="12" cy="12" r="3" fill="white"/>
                    </svg>
                `)}`,
                scaledSize: new google.maps.Size(24, 24),
                anchor: new google.maps.Point(12, 12)
            },
            zIndex: 1000
        });
        
        // Add click listener
        const infoWindow = new google.maps.InfoWindow({
            content: '<div style="text-align: center; padding: 10px;"><strong>আপনার অবস্থান</strong></div>'
        });
        
        userMarker.addListener('click', () => {
            if (currentInfoWindow) currentInfoWindow.close();
            infoWindow.open(map, userMarker);
            currentInfoWindow = infoWindow;
        });
    },
    
    // Get user's current location
    async getCurrentLocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported'));
                return;
            }
            
            const options = {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000 // 5 minutes
            };
            
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userPosition = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    
                    console.log('[Maps] User location obtained:', userPosition);
                    
                    // Add user marker
                    this.addUserMarker(userPosition);
                    
                    // Center map on user location
                    if (map) {
                        map.setCenter(userPosition);
                    }
                    
                    resolve(userPosition);
                },
                (error) => {
                    console.error('[Maps] Geolocation error:', error);
                    reject(error);
                },
                options
            );
        });
    },
    
    // Get directions to a location
    getDirections(destination, origin = null) {
        if (!map || !directionsService || !directionsRenderer) {
            console.error('[Maps] Directions service not initialized');
            return;
        }
        
        // Use current location as origin if not provided
        if (!origin) {
            this.getCurrentLocation()
                .then(position => {
                    this.calculateAndDisplayRoute(position, destination);
                })
                .catch(error => {
                    console.error('[Maps] Could not get user location for directions:', error);
                    // Fallback to default location
                    this.calculateAndDisplayRoute(MAPS_CONFIG.DEFAULT_CENTER, destination);
                });
        } else {
            this.calculateAndDisplayRoute(origin, destination);
        }
    },
    
    // Calculate and display route
    calculateAndDisplayRoute(origin, destination) {
        const request = {
            origin: origin,
            destination: destination,
            travelMode: google.maps.TravelMode.DRIVING,
            unitSystem: google.maps.UnitSystem.METRIC,
            avoidHighways: false,
            avoidTolls: false
        };
        
        directionsService.route(request, (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
                directionsRenderer.setDirections(result);
                
                // Show route info
                const route = result.routes[0];
                const leg = route.legs[0];
                
                UIUtils.showNotification(
                    `দূরত্ব: ${leg.distance.text}, সময়: ${leg.duration.text}`,
                    'info',
                    8000
                );
                
                console.log('[Maps] Route calculated:', {
                    distance: leg.distance.text,
                    duration: leg.duration.text
                });
            } else {
                console.error('[Maps] Directions request failed:', status);
                UIUtils.showNotification('রুট খুঁজে পাওয়া যায়নি', 'error');
            }
        });
    },
    
    // Clear all markers
    clearMarkers() {
        mapMarkers.forEach(marker => {
            marker.setMap(null);
        });
        mapMarkers = [];
    },
    
    // Clear directions
    clearDirections() {
        if (directionsRenderer) {
            directionsRenderer.setDirections({routes: []});
        }
    },
    
    // Fit bounds to show all markers
    fitBoundsToMarkers() {
        if (mapMarkers.length === 0) return;
        
        const bounds = new google.maps.LatLngBounds();
        
        // Include all pharmacy markers
        mapMarkers.forEach(marker => {
            bounds.extend(marker.getPosition());
        });
        
        // Include user marker if exists
        if (userMarker) {
            bounds.extend(userMarker.getPosition());
        }
        
        map.fitBounds(bounds);
        
        // Ensure minimum zoom level
        google.maps.event.addListenerOnce(map, 'bounds_changed', () => {
            if (map.getZoom() > 16) {
                map.setZoom(16);
            }
        });
    },
    
    // Search nearby places
    searchNearbyPharmacies(location, radius = MAPS_CONFIG.SEARCH_RADIUS) {
        if (!placesService) {
            console.error('[Maps] Places service not initialized');
            return Promise.reject(new Error('Places service not available'));
        }
        
        return new Promise((resolve, reject) => {
            const request = {
                location: location,
                radius: radius,
                keyword: 'pharmacy medicine store',
                type: 'pharmacy'
            };
            
            placesService.nearbySearch(request, (results, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    console.log('[Maps] Found nearby pharmacies:', results.length);
                    resolve(results);
                } else {
                    console.error('[Maps] Places search failed:', status);
                    reject(new Error(`Places search failed: ${status}`));
                }
            });
        });
    },
    
    // Geocode address
    geocodeAddress(address) {
        if (!geocoder) {
            return Promise.reject(new Error('Geocoder not initialized'));
        }
        
        return new Promise((resolve, reject) => {
            geocoder.geocode({address: address}, (results, status) => {
                if (status === google.maps.GeocoderStatus.OK) {
                    const location = results[0].geometry.location;
                    resolve({
                        lat: location.lat(),
                        lng: location.lng(),
                        formatted_address: results[0].formatted_address
                    });
                } else {
                    reject(new Error(`Geocoding failed: ${status}`));
                }
            });
        });
    },
    
    // Reverse geocode (get address from coordinates)
    reverseGeocode(lat, lng) {
        if (!geocoder) {
            return Promise.reject(new Error('Geocoder not initialized'));
        }
        
        return new Promise((resolve, reject) => {
            const latlng = {lat: parseFloat(lat), lng: parseFloat(lng)};
            
            geocoder.geocode({location: latlng}, (results, status) => {
                if (status === google.maps.GeocoderStatus.OK) {
                    if (results[0]) {
                        resolve({
                            formatted_address: results[0].formatted_address,
                            components: results[0].address_components
                        });
                    } else {
                        reject(new Error('No results found'));
                    }
                } else {
                    reject(new Error(`Reverse geocoding failed: ${status}`));
                }
            });
        });
    },
    
    // Update visible pharmacies based on map bounds
    updateVisiblePharmacies() {
        if (!map) return;
        
        const bounds = map.getBounds();
        if (!bounds) return;
        
        // Filter markers within bounds
        const visibleMarkers = mapMarkers.filter(marker => {
            return bounds.contains(marker.getPosition());
        });
        
        console.log(`[Maps] ${visibleMarkers.length} pharmacies visible in current view`);
    },
    
    // Highlight pharmacy in list
    highlightPharmacyInList(pharmacyId) {
        // Remove existing highlights
        document.querySelectorAll('.pharmacy-card.highlighted').forEach(card => {
            card.classList.remove('highlighted');
        });
        
        // Highlight target pharmacy
        const pharmacyCard = document.querySelector(`[data-pharmacy-id="${pharmacyId}"]`);
        if (pharmacyCard) {
            pharmacyCard.classList.add('highlighted');
            pharmacyCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    },
    
    // Center map on pharmacy
    centerOnPharmacy(pharmacyId) {
        const marker = mapMarkers.find(m => m.pharmacyId === pharmacyId);
        if (marker && map) {
            map.setCenter(marker.getPosition());
            map.setZoom(17);
            
            // Trigger click to show info window
            google.maps.event.trigger(marker, 'click');
        }
    },
    
    // Show map fallback when Google Maps fails
    showMapFallback(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = `
            <div style="
                width: 100%; 
                height: 400px; 
                background: #f1f5f9; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                border-radius: 10px; 
                flex-direction: column; 
                color: #64748b;
                border: 2px dashed #cbd5e1;
            ">
                <i class="fas fa-map" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                <h3 style="margin-bottom: 0.5rem;">ম্যাপ লোড হচ্ছে না</h3>
                <p style="text-align: center; margin-bottom: 1rem;">Google Maps API key প্রয়োজন</p>
                <button onclick="location.reload()" style="
                    background: #2563eb; 
                    color: white; 
                    border: none; 
                    padding: 10px 20px; 
                    border-radius: 5px; 
                    cursor: pointer;
                ">
                    আবার চেষ্টা করুন
                </button>
            </div>
        `;
    },
    
    // Cleanup function
    cleanup() {
        // Clear markers
        this.clearMarkers();
        
        // Clear directions
        this.clearDirections();
        
        // Remove user marker
        if (userMarker) {
            userMarker.setMap(null);
            userMarker = null;
        }
        
        // Close info windows
        if (currentInfoWindow) {
            currentInfoWindow.close();
            currentInfoWindow = null;
        }
        
        // Reset services
        map = null;
        directionsService = null;
        directionsRenderer = null;
        geocoder = null;
        placesService = null;
    }
};

// Street View Manager
const StreetViewManager = {
    
    // Show street view for a location
    showStreetView(lat, lng, containerId) {
        if (typeof google === 'undefined') {
            console.error('[Maps] Google Maps not loaded');
            return;
        }
        
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`[Maps] Container ${containerId} not found`);
            return;
        }
        
        const panorama = new google.maps.StreetViewPanorama(container, {
            position: {lat, lng},
            pov: {heading: 34, pitch: 10},
            enableCloseButton: true
        });
        
        // Check if street view is available
        const streetViewService = new google.maps.StreetViewService();
        streetViewService.getPanorama({
            location: {lat, lng},
            radius: 50
        }, (data, status) => {
            if (status !== google.maps.StreetViewStatus.OK) {
                container.innerHTML = `
                    <div style="padding: 2rem; text-align: center; color: #64748b;">
                        <i class="fas fa-road" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                        <p>এই স্থানের জন্য স্ট্রিট ভিউ উপলব্ধ নেই</p>
                    </div>
                `;
            }
        });
    }
};

// Initialize maps when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Auto-initialize maps if container exists
    const mapContainer = document.getElementById('map');
    if (mapContainer) {
        MapsManager.initializeMap('map').catch(error => {
            console.error('[Maps] Auto-initialization failed:', error);
        });
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    MapsManager.cleanup();
});

// Export for global use
window.MapsManager = MapsManager;
window.StreetViewManager = StreetViewManager;
window.MAPS_CONFIG = MAPS_CONFIG;

console.log('[MediMap] Maps.js loaded');