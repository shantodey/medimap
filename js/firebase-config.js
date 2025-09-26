// MediMap Firebase Configuration

// Firebase configuration object
const firebaseConfig = {
    apiKey: "AIzaSyDemoKey123456789", // Replace with your actual API key
    authDomain: "medimap-bd.firebaseapp.com", // Replace with your project domain
    databaseURL: "https://medimap-bd-default-rtdb.firebaseio.com", // Replace with your database URL
    projectId: "medimap-bd", // Replace with your project ID
    storageBucket: "medimap-bd.appspot.com", // Replace with your storage bucket
    messagingSenderId: "123456789012", // Replace with your sender ID
    appId: "1:123456789012:web:abcdef123456789" // Replace with your app ID
};

// Initialize Firebase
let app, db, auth, storage;

try {
    // Initialize Firebase App
    app = firebase.initializeApp(firebaseConfig);
    
    // Initialize Firestore Database
    db = firebase.firestore();
    
    // Initialize Firebase Authentication
    auth = firebase.auth();
    
    // Initialize Firebase Storage
    storage = firebase.storage();
    
    console.log('Firebase initialized successfully');
} catch (error) {
    console.error('Firebase initialization error:', error);
    // Fallback to localStorage if Firebase fails
    console.log('Using localStorage as fallback');
}

// Database Collections
const Collections = {
    PHARMACIES: 'pharmacies',
    MEDICINES: 'medicines',
    INVENTORY: 'inventory',
    ORDERS: 'orders',
    USERS: 'users'
};

// Pharmacy Database Operations
class PharmacyDB {
    // Create a new pharmacy
    static async createPharmacy(pharmacyData) {
        try {
            if (!db) {
                throw new Error('Firebase not available');
            }
            
            const pharmacyRef = await db.collection(Collections.PHARMACIES).add({
                ...pharmacyData,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                isActive: true
            });
            
            return { success: true, id: pharmacyRef.id };
        } catch (error) {
            console.error('Error creating pharmacy:', error);
            
            // Fallback to localStorage
            return this.createPharmacyLocal(pharmacyData);
        }
    }
    
    // Fallback: Create pharmacy in localStorage
    static createPharmacyLocal(pharmacyData) {
        try {
            const pharmacies = JSON.parse(localStorage.getItem('pharmacies') || '[]');
            const newPharmacy = {
                ...pharmacyData,
                id: 'pharmacy_' + Date.now(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                isActive: true
            };
            
            pharmacies.push(newPharmacy);
            localStorage.setItem('pharmacies', JSON.stringify(pharmacies));
            
            return { success: true, id: newPharmacy.id };
        } catch (error) {
            console.error('Error creating pharmacy locally:', error);
            return { success: false, error: error.message };
        }
    }
    
    // Get pharmacy by username
    static async getPharmacyByUsername(username) {
        try {
            if (!db) {
                throw new Error('Firebase not available');
            }
            
            const querySnapshot = await db.collection(Collections.PHARMACIES)
                .where('username', '==', username)
                .limit(1)
                .get();
            
            if (querySnapshot.empty) {
                return null;
            }
            
            const doc = querySnapshot.docs[0];
            return { id: doc.id, ...doc.data() };
        } catch (error) {
            console.error('Error getting pharmacy:', error);
            
            // Fallback to localStorage
            return this.getPharmacyByUsernameLocal(username);
        }
    }
    
    // Fallback: Get pharmacy from localStorage
    static getPharmacyByUsernameLocal(username) {
        try {
            const pharmacies = JSON.parse(localStorage.getItem('pharmacies') || '[]');
            return pharmacies.find(pharmacy => pharmacy.username === username) || null;
        } catch (error) {
            console.error('Error getting pharmacy locally:', error);
            return null;
        }
    }
    
    // Update pharmacy information
    static async updatePharmacy(pharmacyId, updateData) {
        try {
            if (!db) {
                throw new Error('Firebase not available');
            }
            
            await db.collection(Collections.PHARMACIES).doc(pharmacyId).update({
                ...updateData,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            return { success: true };
        } catch (error) {
            console.error('Error updating pharmacy:', error);
            
            // Fallback to localStorage
            return this.updatePharmacyLocal(pharmacyId, updateData);
        }
    }
    
    // Fallback: Update pharmacy in localStorage
    static updatePharmacyLocal(pharmacyId, updateData) {
        try {
            const pharmacies = JSON.parse(localStorage.getItem('pharmacies') || '[]');
            const pharmacyIndex = pharmacies.findIndex(p => p.id === pharmacyId);
            
            if (pharmacyIndex !== -1) {
                pharmacies[pharmacyIndex] = {
                    ...pharmacies[pharmacyIndex],
                    ...updateData,
                    updatedAt: new Date().toISOString()
                };
                
                localStorage.setItem('pharmacies', JSON.stringify(pharmacies));
                return { success: true };
            }
            
            return { success: false, error: 'Pharmacy not found' };
        } catch (error) {
            console.error('Error updating pharmacy locally:', error);
            return { success: false, error: error.message };
        }
    }
    
    // Get all pharmacies in a location
    static async getPharmaciesInLocation(latitude, longitude, radius = 2) {
        try {
            if (!db) {
                throw new Error('Firebase not available');
            }
            
            // Note: For accurate geo-queries, you'd use GeoFirestore
            // This is a simplified version
            const querySnapshot = await db.collection(Collections.PHARMACIES)
                .where('isActive', '==', true)
                .get();
            
            const pharmacies = [];
            querySnapshot.forEach(doc => {
                const data = { id: doc.id, ...doc.data() };
                
                // Simple distance calculation (in a real app, use proper geo-queries)
                if (data.coordinates) {
                    const distance = this.calculateDistance(
                        latitude, longitude,
                        data.coordinates.lat, data.coordinates.lng
                    );
                    
                    if (distance <= radius) {
                        data.distance = distance;
                        pharmacies.push(data);
                    }
                }
            });
            
            return pharmacies.sort((a, b) => a.distance - b.distance);
        } catch (error) {
            console.error('Error getting pharmacies:', error);
            
            // Fallback to localStorage
            return this.getPharmaciesInLocationLocal(latitude, longitude, radius);
        }
    }
    
    // Fallback: Get pharmacies from localStorage
    static getPharmaciesInLocationLocal(latitude, longitude, radius) {
        try {
            const pharmacies = JSON.parse(localStorage.getItem('pharmacies') || '[]');
            
            return pharmacies
                .filter(pharmacy => pharmacy.isActive && pharmacy.coordinates)
                .map(pharmacy => ({
                    ...pharmacy,
                    distance: this.calculateDistance(
                        latitude, longitude,
                        pharmacy.coordinates.lat, pharmacy.coordinates.lng
                    )
                }))
                .filter(pharmacy => pharmacy.distance <= radius)
                .sort((a, b) => a.distance - b.distance);
        } catch (error) {
            console.error('Error getting pharmacies locally:', error);
            return [];
        }
    }
    
    // Calculate distance between two coordinates (Haversine formula)
    static calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Earth's radius in kilometers
        const dLat = this.toRad(lat2 - lat1);
        const dLon = this.toRad(lon2 - lon1);
        
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        
        return R * c;
    }
    
    static toRad(deg) {
        return deg * (Math.PI/180);
    }
}

// Medicine Database Operations
class MedicineDB {
    // Get all medicines
    static async getAllMedicines() {
        try {
            if (!db) {
                throw new Error('Firebase not available');
            }
            
            const querySnapshot = await db.collection(Collections.MEDICINES).get();
            const medicines = [];
            
            querySnapshot.forEach(doc => {
                medicines.push({ id: doc.id, ...doc.data() });
            });
            
            return medicines;
        } catch (error) {
            console.error('Error getting medicines:', error);
            return this.getAllMedicinesLocal();
        }
    }
    
    // Fallback: Get medicines from localStorage
    static getAllMedicinesLocal() {
        try {
            return JSON.parse(localStorage.getItem('allMedicines') || '[]');
        } catch (error) {
            console.error('Error getting medicines locally:', error);
            return [];
        }
    }
    
    // Search medicines by name or symptoms
    static async searchMedicines(query, type = 'name') {
        try {
            const allMedicines = await this.getAllMedicines();
            
            if (type === 'name') {
                return allMedicines.filter(medicine =>
                    medicine.name.toLowerCase().includes(query.toLowerCase()) ||
                    (medicine.banglaName && medicine.banglaName.toLowerCase().includes(query.toLowerCase()))
                );
            } else if (type === 'symptom') {
                return allMedicines.filter(medicine =>
                    medicine.symptoms && medicine.symptoms.includes(query)
                );
            }
            
            return [];
        } catch (error) {
            console.error('Error searching medicines:', error);
            return [];
        }
    }
}

// Inventory Database Operations
class InventoryDB {
    // Add or update medicine in pharmacy inventory
    static async updateInventory(pharmacyId, medicineId, inventoryData) {
        try {
            if (!db) {
                throw new Error('Firebase not available');
            }
            
            const inventoryRef = db.collection(Collections.INVENTORY).doc(`${pharmacyId}_${medicineId}`);
            
            await inventoryRef.set({
                pharmacyId,
                medicineId,
                ...inventoryData,
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
            
            return { success: true };
        } catch (error) {
            console.error('Error updating inventory:', error);
            return this.updateInventoryLocal(pharmacyId, medicineId, inventoryData);
        }
    }
    
    // Fallback: Update inventory in localStorage
    static updateInventoryLocal(pharmacyId, medicineId, inventoryData) {
        try {
            const inventory = JSON.parse(localStorage.getItem(`inventory_${pharmacyId}`) || '[]');
            const existingIndex = inventory.findIndex(item => item.medicineId === medicineId);
            
            const inventoryItem = {
                pharmacyId,
                medicineId,
                ...inventoryData,
                lastUpdated: new Date().toISOString()
            };
            
            if (existingIndex !== -1) {
                inventory[existingIndex] = inventoryItem;
            } else {
                inventory.push(inventoryItem);
            }
            
            localStorage.setItem(`inventory_${pharmacyId}`, JSON.stringify(inventory));
            return { success: true };
        } catch (error) {
            console.error('Error updating inventory locally:', error);
            return { success: false, error: error.message };
        }
    }
    
    // Get pharmacy inventory
    static async getPharmacyInventory(pharmacyId) {
        try {
            if (!db) {
                throw new Error('Firebase not available');
            }
            
            const querySnapshot = await db.collection(Collections.INVENTORY)
                .where('pharmacyId', '==', pharmacyId)
                .get();
            
            const inventory = [];
            querySnapshot.forEach(doc => {
                inventory.push({ id: doc.id, ...doc.data() });
            });
            
            return inventory;
        } catch (error) {
            console.error('Error getting inventory:', error);
            return this.getPharmacyInventoryLocal(pharmacyId);
        }
    }
    
    // Fallback: Get inventory from localStorage
    static getPharmacyInventoryLocal(pharmacyId) {
        try {
            return JSON.parse(localStorage.getItem(`inventory_${pharmacyId}`) || '[]');
        } catch (error) {
            console.error('Error getting inventory locally:', error);
            return [];
        }
    }
    
    // Find medicine availability across pharmacies
    static async findMedicineAvailability(medicineName, location) {
        try {
            if (!db) {
                throw new Error('Firebase not available');
            }
            
            // Get all pharmacies in location
            const pharmacies = await PharmacyDB.getPharmaciesInLocation(
                location.latitude, location.longitude
            );
            
            const availability = [];
            
            // Check inventory for each pharmacy
            for (const pharmacy of pharmacies) {
                const inventory = await this.getPharmacyInventory(pharmacy.id);
                const medicineItem = inventory.find(item => 
                    item.medicineName && item.medicineName.toLowerCase() === medicineName.toLowerCase()
                );
                
                if (medicineItem && medicineItem.quantity > 0) {
                    availability.push({
                        pharmacy,
                        medicine: medicineItem,
                        distance: pharmacy.distance
                    });
                }
            }
            
            return availability.sort((a, b) => a.distance - b.distance);
        } catch (error) {
            console.error('Error finding medicine availability:', error);
            return this.findMedicineAvailabilityLocal(medicineName, location);
        }
    }
    
    // Fallback: Find availability locally
    static findMedicineAvailabilityLocal(medicineName, location) {
        try {
            const pharmacies = PharmacyDB.getPharmaciesInLocationLocal(
                location.latitude, location.longitude, 5
            );
            
            const availability = [];
            
            pharmacies.forEach(pharmacy => {
                const inventory = this.getPharmacyInventoryLocal(pharmacy.id);
                const medicineItem = inventory.find(item => 
                    item.medicineName && item.medicineName.toLowerCase() === medicineName.toLowerCase()
                );
                
                if (medicineItem && medicineItem.quantity > 0) {
                    availability.push({
                        pharmacy,
                        medicine: medicineItem,
                        distance: pharmacy.distance
                    });
                }
            });
            
            return availability.sort((a, b) => a.distance - b.distance);
        } catch (error) {
            console.error('Error finding medicine availability locally:', error);
            return [];
        }
    }
}

// Order Database Operations
class OrderDB {
    // Create new order
    static async createOrder(orderData) {
        try {
            if (!db) {
                throw new Error('Firebase not available');
            }
            
            const orderRef = await db.collection(Collections.ORDERS).add({
                ...orderData,
                status: 'pending',
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            return { success: true, id: orderRef.id };
        } catch (error) {
            console.error('Error creating order:', error);
            return this.createOrderLocal(orderData);
        }
    }
    
    // Fallback: Create order locally
    static createOrderLocal(orderData) {
        try {
            const orders = JSON.parse(localStorage.getItem('orders') || '[]');
            const newOrder = {
                ...orderData,
                id: 'order_' + Date.now(),
                status: 'pending',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            orders.push(newOrder);
            localStorage.setItem('orders', JSON.stringify(orders));
            
            return { success: true, id: newOrder.id };
        } catch (error) {
            console.error('Error creating order locally:', error);
            return { success: false, error: error.message };
        }
    }
    
    // Get orders for a pharmacy
    static async getPharmacyOrders(pharmacyId) {
        try {
            if (!db) {
                throw new Error('Firebase not available');
            }
            
            const querySnapshot = await db.collection(Collections.ORDERS)
                .where('pharmacyId', '==', pharmacyId)
                .orderBy('createdAt', 'desc')
                .get();
            
            const orders = [];
            querySnapshot.forEach(doc => {
                orders.push({ id: doc.id, ...doc.data() });
            });
            
            return orders;
        } catch (error) {
            console.error('Error getting orders:', error);
            return this.getPharmacyOrdersLocal(pharmacyId);
        }
    }
    
    // Fallback: Get orders locally
    static getPharmacyOrdersLocal(pharmacyId) {
        try {
            const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
            return allOrders
                .filter(order => order.pharmacyId === pharmacyId)
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } catch (error) {
            console.error('Error getting orders locally:', error);
            return [];
        }
    }
    
    // Update order status
    static async updateOrderStatus(orderId, status) {
        try {
            if (!db) {
                throw new Error('Firebase not available');
            }
            
            await db.collection(Collections.ORDERS).doc(orderId).update({
                status,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            return { success: true };
        } catch (error) {
            console.error('Error updating order:', error);
            return this.updateOrderStatusLocal(orderId, status);
        }
    }
    
    // Fallback: Update order status locally
    static updateOrderStatusLocal(orderId, status) {
        try {
            const orders = JSON.parse(localStorage.getItem('orders') || '[]');
            const orderIndex = orders.findIndex(order => order.id === orderId);
            
            if (orderIndex !== -1) {
                orders[orderIndex].status = status;
                orders[orderIndex].updatedAt = new Date().toISOString();
                localStorage.setItem('orders', JSON.stringify(orders));
                return { success: true };
            }
            
            return { success: false, error: 'Order not found' };
        } catch (error) {
            console.error('Error updating order locally:', error);
            return { success: false, error: error.message };
        }
    }
}

// Utility Functions
const FirebaseUtils = {
    // Check if Firebase is available
    isFirebaseAvailable() {
        return !!(app && db && auth);
    },
    
    // Get current timestamp
    getTimestamp() {
        if (this.isFirebaseAvailable()) {
            return firebase.firestore.FieldValue.serverTimestamp();
        } else {
            return new Date().toISOString();
        }
    },
    
    // Initialize sample data (for development)
    async initSampleData() {
        try {
            // Sample medicines data
            const sampleMedicines = [
                {
                    name: 'নাপা',
                    banglaName: 'নাপা',
                    uses: ['fever', 'headache', 'body-pain'],
                    symptoms: ['জ্বর', 'মাথা ব্যথা', 'শরীর ব্যথা'],
                    category: 'painkiller'
                },
                {
                    name: 'হিস্টাসিন',
                    banglaName: 'হিস্টাসিন',
                    uses: ['cold', 'allergy'],
                    symptoms: ['সর্দি', 'এলার্জি'],
                    category: 'antihistamine'
                },
                // Add more sample medicines...
            ];
            
            // Save to localStorage as fallback
            localStorage.setItem('allMedicines', JSON.stringify(sampleMedicines));
            
            console.log('Sample data initialized');
        } catch (error) {
            console.error('Error initializing sample data:', error);
        }
    },
    
    // Clear all local data (for testing)
    clearLocalData() {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith('medicines_') || 
                key.startsWith('inventory_') || 
                key.startsWith('orders_') || 
                key.startsWith('activities_') ||
                key === 'pharmacies' ||
                key === 'allMedicines' ||
                key === 'loggedInPharmacy') {
                localStorage.removeItem(key);
            }
        });
        console.log('Local data cleared');
    }
};

// Initialize sample data on load
document.addEventListener('DOMContentLoaded', () => {
    FirebaseUtils.initSampleData();
});

// Export for use in other files
window.MediMapDB = {
    PharmacyDB,
    MedicineDB,
    InventoryDB,
    OrderDB,
    FirebaseUtils
};