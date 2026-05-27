// MediMap Admin Dashboard JavaScript

// Global variables
let currentPharmacy = null;
let medicines = [];
let orders = [];
let activities = [];

// Initialize admin dashboard
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    checkAuthentication();
    
    // Load pharmacy data
    loadPharmacyData();
    
    // Setup navigation
    setupNavigation();
    
    // Setup forms
    setupForms();
    
    // Load dashboard data
    loadDashboardData();
    
    // Start real-time updates
    startRealTimeUpdates();
});

// Authentication check
function checkAuthentication() {
    const loggedInPharmacy = localStorage.getItem('loggedInPharmacy');
    
    if (!loggedInPharmacy) {
        alert('অনুগ্রহ করে প্রথমে লগইন করুন');
        window.location.href = 'pharmacy-login.html';
        return;
    }
    
    try {
        currentPharmacy = JSON.parse(loggedInPharmacy);
        updateUserInfo();
    } catch (error) {
        console.error('Error parsing pharmacy data:', error);
        localStorage.removeItem('loggedInPharmacy');
        window.location.href = 'pharmacy-login.html';
    }
}

// Update user info in header
function updateUserInfo() {
    if (!currentPharmacy) return;
    
    document.getElementById('pharmacyName').textContent = currentPharmacy.name || 'ফার্মাসি';
    
    // Update avatar if available
    const userAvatar = document.getElementById('userAvatar');
    if (currentPharmacy.ownerPhoto) {
        userAvatar.src = currentPharmacy.ownerPhoto;
        userAvatar.style.display = 'block';
        userAvatar.nextElementSibling.style.display = 'none';
    }
}

// Load pharmacy data
function loadPharmacyData() {
    if (!currentPharmacy) return;
    
    // Load medicines from localStorage or use sample data
    const savedMedicines = localStorage.getItem(`medicines_${currentPharmacy.id}`);
    if (savedMedicines) {
        medicines = JSON.parse(savedMedicines);
    } else {
        // Sample medicines data
        medicines = [
            {
                id: 1,
                name: 'নাপা',
                price: 2.5,
                stock: 50,
                category: 'fever',
                uses: ['fever', 'headache'],
                lastUpdated: new Date().toISOString()
            },
            {
                id: 2,
                name: 'হিস্টাসিন',
                price: 8.5,
                stock: 5,
                category: 'allergy',
                uses: ['cold', 'allergy'],
                lastUpdated: new Date().toISOString()
            },
            {
                id: 3,
                name: 'সার্জেল',
                price: 12,
                stock: 20,
                category: 'pain',
                uses: ['headache', 'body-pain'],
                lastUpdated: new Date().toISOString()
            }
        ];
        saveMedicines();
    }
    
    // Load orders
    const savedOrders = localStorage.getItem(`orders_${currentPharmacy.id}`);
    if (savedOrders) {
        orders = JSON.parse(savedOrders);
    } else {
        orders = generateSampleOrders();
        saveOrders();
    }
    
    // Load activities
    loadActivities();
}

// Generate sample orders
function generateSampleOrders() {
    return [
        {
            id: 'ORD001',
            customerName: 'রহিম উদ্দিন',
            phone: '01711-123456',
            medicines: [
                {name: 'নাপা', quantity: 2, price: 2.5},
                {name: 'হিস্টাসিন', quantity: 1, price: 8.5}
            ],
            total: 13.5,
            status: 'pending',
            orderTime: new Date().toISOString(),
            address: 'মিরপুর-১, ঢাকা'
        },
        {
            id: 'ORD002',
            customerName: 'করিম আলী',
            phone: '01811-234567',
            medicines: [
                {name: 'সার্জেল', quantity: 1, price: 12}
            ],
            total: 12,
            status: 'completed',
            orderTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            address: 'কাজীপাড়া, মিরপুর-১'
        }
    ];
}

// Setup navigation
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetSection = link.getAttribute('data-section');
            showSection(targetSection);
            
            // Update active nav item
            document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
            link.parentElement.classList.add('active');
        });
    });
}

// Show section
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Load section-specific data
        switch(sectionName) {
            case 'dashboard':
                loadDashboardData();
                break;
            case 'inventory':
                loadInventoryTable();
                break;
            case 'orders':
                loadOrdersList();
                break;
            case 'profile':
                loadProfileData();
                break;
        }
    }
}

// Load dashboard data
function loadDashboardData() {
    // Update stats
    document.getElementById('totalMedicines').textContent = medicines.length;
    document.getElementById('lowStockItems').textContent = medicines.filter(m => m.stock <= 10).length;
    document.getElementById('todayOrders').textContent = orders.filter(o => isToday(new Date(o.orderTime))).length;
    
    const todayRevenue = orders
        .filter(o => isToday(new Date(o.orderTime)) && o.status === 'completed')
        .reduce((sum, o) => sum + o.total, 0);
    document.getElementById('todayRevenue').textContent = `৳${todayRevenue}`;
    
    // Load recent activities
    loadRecentActivities();
}

// Check if date is today
function isToday(date) {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
}

// Load recent activities
function loadRecentActivities() {
    const activityList = document.getElementById('activityList');
    
    if (activities.length === 0) {
        activities = [
            {
                type: 'medicine_added',
                text: 'নতুন ওষুধ "নাপা" যোগ করা হয়েছে',
                time: '২ মিনিট আগে',
                icon: 'fa-plus'
            },
            {
                type: 'order_received',
                text: 'নতুন অর্ডার পাওয়া গেছে (#ORD001)',
                time: '১৫ মিনিট আগে',
                icon: 'fa-shopping-cart'
            },
            {
                type: 'stock_low',
                text: 'হিস্টাসিনের স্টক কম (৫টি বাকি)',
                time: '১ ঘন্টা আগে',
                icon: 'fa-exclamation-triangle'
            }
        ];
    }
    
    activityList.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon">
                <i class="fas ${activity.icon}"></i>
            </div>
            <div class="activity-info">
                <div class="activity-text">${activity.text}</div>
                <div class="activity-time">${activity.time}</div>
            </div>
        </div>
    `).join('');
}

// Load inventory table
function loadInventoryTable() {
    const tableBody = document.getElementById('inventoryTableBody');
    const searchInput = document.getElementById('medicineSearch');
    
    let filteredMedicines = medicines;
    
    // Apply search filter
    if (searchInput && searchInput.value) {
        const searchTerm = searchInput.value.toLowerCase();
        filteredMedicines = medicines.filter(m => 
            m.name.toLowerCase().includes(searchTerm)
        );
    }
    
    tableBody.innerHTML = filteredMedicines.map(medicine => {
        let stockStatus = 'in-stock';
        let stockText = 'স্টক আছে';
        
        if (medicine.stock === 0) {
            stockStatus = 'out-of-stock';
            stockText = 'স্টক শেষ';
        } else if (medicine.stock <= 10) {
            stockStatus = 'low-stock';
            stockText = 'কম স্টক';
        }
        
        return `
            <tr>
                <td>${medicine.name}</td>
                <td>৳${medicine.price}</td>
                <td>${medicine.stock}</td>
                <td><span class="stock-status ${stockStatus}">${stockText}</span></td>
                <td>${formatDate(medicine.lastUpdated)}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-primary btn-sm" onclick="editMedicine(${medicine.id})">
                            <i class="fas fa-edit"></i> সম্পাদনা
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="deleteMedicine(${medicine.id})">
                            <i class="fas fa-trash"></i> মুছুন
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
    
    // Setup search functionality
    if (searchInput) {
        searchInput.oninput = () => loadInventoryTable();
    }
}

// Load orders list
function loadOrdersList() {
    const ordersList = document.getElementById('ordersList');
    const orderFilter = document.getElementById('orderFilter');
    
    let filteredOrders = orders;
    
    // Apply filter
    if (orderFilter && orderFilter.value !== 'all') {
        filteredOrders = orders.filter(o => o.status === orderFilter.value);
    }
    
    if (filteredOrders.length === 0) {
        ordersList.innerHTML = `
            <div class="order-card" style="text-align: center; color: #64748b;">
                <i class="fas fa-shopping-cart" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                <p>কোন অর্ডার পাওয়া যায়নি</p>
            </div>
        `;
        return;
    }
    
    ordersList.innerHTML = filteredOrders.map(order => `
        <div class="order-card">
            <div class="order-info">
                <div class="order-id">অর্ডার #${order.id}</div>
                <div class="order-details">
                    <strong>${order.customerName}</strong> - ${order.phone}<br>
                    ${order.medicines.map(m => `${m.name} (${m.quantity}টি)`).join(', ')}<br>
                    <strong>মোট: ৳${order.total}</strong>
                </div>
                <span class="order-status ${order.status}">${getStatusText(order.status)}</span>
            </div>
            <div class="order-actions">
                ${order.status === 'pending' ? `
                    <button class="btn btn-success btn-sm" onclick="updateOrderStatus('${order.id}', 'completed')">
                        <i class="fas fa-check"></i> সম্পন্ন
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="updateOrderStatus('${order.id}', 'cancelled')">
                        <i class="fas fa-times"></i> বাতিল
                    </button>
                ` : ''}
                <button class="btn btn-outline btn-sm" onclick="viewOrderDetails('${order.id}')">
                    <i class="fas fa-eye"></i> বিস্তারিত
                </button>
            </div>
        </div>
    `).join('');
    
    // Setup filter functionality
    if (orderFilter) {
        orderFilter.onchange = () => loadOrdersList();
    }
}

// Load profile data
function loadProfileData() {
    if (!currentPharmacy) return;
    
    document.getElementById('profilePharmacyName').value = currentPharmacy.name || '';
    document.getElementById('ownerName').value = currentPharmacy.ownerName || '';
    document.getElementById('pharmacyAddress').value = currentPharmacy.address || '';
    document.getElementById('pharmacyPhone').value = currentPharmacy.phone || '';
    document.getElementById('pharmacyEmail').value = currentPharmacy.email || '';
    
    // Parse opening hours
    if (currentPharmacy.openingHours) {
        const hours = currentPharmacy.openingHours;
        // Example: "সকাল ৮টা - রাত ১০টা" 
        // This is simplified - in real app you'd parse this properly
        document.getElementById('openTime').value = '08:00';
        document.getElementById('closeTime').value = '22:00';
    }
    
    // Set services
    document.getElementById('service24h').checked = currentPharmacy.is24Hours || false;
    document.getElementById('serviceDelivery').checked = currentPharmacy.hasDelivery || false;
    document.getElementById('serviceOxygen').checked = currentPharmacy.hasOxygen || false;
    document.getElementById('serviceEmergency').checked = currentPharmacy.hasEmergency || false;
}

// Setup forms
function setupForms() {
    // Add medicine form
    const addMedicineForm = document.getElementById('addMedicineForm');
    if (addMedicineForm) {
        addMedicineForm.addEventListener('submit', handleAddMedicine);
    }
    
    // Edit medicine form
    const editMedicineForm = document.getElementById('editMedicineForm');
    if (editMedicineForm) {
        editMedicineForm.addEventListener('submit', handleEditMedicine);
    }
    
    // Profile form
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileUpdate);
    }
    
    // Password form
    const passwordForm = document.getElementById('passwordForm');
    if (passwordForm) {
        passwordForm.addEventListener('submit', handlePasswordChange);
    }
}

// Handle add medicine
function handleAddMedicine(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const uses = [];
    
    // Get selected uses
    document.querySelectorAll('input[name="uses"]:checked').forEach(checkbox => {
        uses.push(checkbox.value);
    });
    
    const newMedicine = {
        id: medicines.length > 0 ? Math.max(...medicines.map(m => m.id)) + 1 : 1,
        name: formData.get('medicineName') || document.getElementById('medicineName').value,
        price: parseFloat(document.getElementById('medicinePrice').value),
        stock: parseInt(document.getElementById('medicineStock').value),
        category: document.getElementById('medicineCategory').value,
        uses: uses,
        lastUpdated: new Date().toISOString()
    };
    
    medicines.push(newMedicine);
    saveMedicines();
    
    // Add activity
    addActivity('medicine_added', `নতুন ওষুধ "${newMedicine.name}" যোগ করা হয়েছে`, 'fa-plus');
    
    // Reset form
    e.target.reset();
    
    // Show success message
    alert('ওষুধ সফলভাবে যোগ করা হয়েছে!');
    
    // Refresh inventory if on that page
    if (document.getElementById('inventory').classList.contains('active')) {
        loadInventoryTable();
    }
    
    // Update dashboard stats
    loadDashboardData();
}

// Handle edit medicine
function handleEditMedicine(e) {
    e.preventDefault();
    
    const medicineId = parseInt(document.getElementById('editMedicineId').value);
    const name = document.getElementById('editMedicineName').value;
    const price = parseFloat(document.getElementById('editMedicinePrice').value);
    const stock = parseInt(document.getElementById('editMedicineStock').value);
    
    const medicineIndex = medicines.findIndex(m => m.id === medicineId);
    if (medicineIndex !== -1) {
        medicines[medicineIndex] = {
            ...medicines[medicineIndex],
            name,
            price,
            stock,
            lastUpdated: new Date().toISOString()
        };
        
        saveMedicines();
        
        // Add activity
        addActivity('medicine_updated', `ওষুধ "${name}" আপডেট করা হয়েছে`, 'fa-edit');
        
        closeModal('editMedicineModal');
        loadInventoryTable();
        loadDashboardData();
        
        alert('ওষুধের তথ্য আপডেট করা হয়েছে!');
    }
}

// Handle profile update
function handleProfileUpdate(e) {
    e.preventDefault();
    
    currentPharmacy = {
        ...currentPharmacy,
        name: document.getElementById('profilePharmacyName').value,
        ownerName: document.getElementById('ownerName').value,
        address: document.getElementById('pharmacyAddress').value,
        phone: document.getElementById('pharmacyPhone').value,
        email: document.getElementById('pharmacyEmail').value,
        openTime: document.getElementById('openTime').value,
        closeTime: document.getElementById('closeTime').value,
        is24Hours: document.getElementById('service24h').checked,
        hasDelivery: document.getElementById('serviceDelivery').checked,
        hasOxygen: document.getElementById('serviceOxygen').checked,
        hasEmergency: document.getElementById('serviceEmergency').checked
    };
    
    // Update opening hours text
    if (currentPharmacy.is24Hours) {
        currentPharmacy.openingHours = '২৪ ঘন্টা খোলা';
    } else {
        const openTime = currentPharmacy.openTime || '08:00';
        const closeTime = currentPharmacy.closeTime || '22:00';
        currentPharmacy.openingHours = `সকাল ${convertTo12Hour(openTime)} - ${convertTo12Hour(closeTime)}`;
    }
    
    // Save to localStorage
    localStorage.setItem('loggedInPharmacy', JSON.stringify(currentPharmacy));
    
    // Update user info
    updateUserInfo();
    
    // Add activity
    addActivity('profile_updated', 'ফার্মাসির তথ্য আপডেট করা হয়েছে', 'fa-user');
    
    alert('ফার্মাসির তথ্য আপডেট করা হয়েছে!');
}

// Handle password change
function handlePasswordChange(e) {
    e.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validate current password (in real app, verify with server)
    if (currentPassword !== currentPharmacy.password) {
        alert('বর্তমান পাসওয়ার্ড সঠিক নয়');
        return;
    }
    
    // Validate new password
    if (newPassword !== confirmPassword) {
        alert('নতুন পাসওয়ার্ড মিলছে না');
        return;
    }
    
    if (newPassword.length < 6) {
        alert('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে');
        return;
    }
    
    // Update password
    currentPharmacy.password = newPassword;
    localStorage.setItem('loggedInPharmacy', JSON.stringify(currentPharmacy));
    
    // Reset form
    e.target.reset();
    
    alert('পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!');
}

// Edit medicine
function editMedicine(id) {
    const medicine = medicines.find(m => m.id === id);
    if (!medicine) return;
    
    document.getElementById('editMedicineId').value = medicine.id;
    document.getElementById('editMedicineName').value = medicine.name;
    document.getElementById('editMedicinePrice').value = medicine.price;
    document.getElementById('editMedicineStock').value = medicine.stock;
    
    openModal('editMedicineModal');
}

// Delete medicine
function deleteMedicine(id) {
    if (!confirm('আপনি কি নিশ্চিত যে এই ওষুধটি মুছে ফেলতে চান?')) {
        return;
    }
    
    const medicineIndex = medicines.findIndex(m => m.id === id);
    if (medicineIndex !== -1) {
        const medicineName = medicines[medicineIndex].name;
        medicines.splice(medicineIndex, 1);
        saveMedicines();
        
        // Add activity
        addActivity('medicine_deleted', `ওষুধ "${medicineName}" মুছে ফেলা হয়েছে`, 'fa-trash');
        
        loadInventoryTable();
        loadDashboardData();
        
        alert('ওষুধ মুছে ফেলা হয়েছে!');
    }
}

// Update order status
function updateOrderStatus(orderId, newStatus) {
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
        orders[orderIndex].status = newStatus;
        saveOrders();
        
        // Add activity
        const statusText = getStatusText(newStatus);
        addActivity('order_updated', `অর্ডার #${orderId} ${statusText} করা হয়েছে`, 'fa-shopping-cart');
        
        loadOrdersList();
        loadDashboardData();
        
        alert(`অর্ডার ${statusText} করা হয়েছে!`);
    }
}

// View order details
function viewOrderDetails(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    const medicinesList = order.medicines.map(m => 
        `${m.name}: ${m.quantity}টি × ৳${m.price} = ৳${m.quantity * m.price}`
    ).join('\n');
    
    alert(`অর্ডার #${order.id}\n\nকাস্টমার: ${order.customerName}\nফোন: ${order.phone}\nঠিকানা: ${order.address}\n\nওষুধের তালিকা:\n${medicinesList}\n\nমোট: ৳${order.total}\nঅবস্থা: ${getStatusText(order.status)}\nসময়: ${formatDate(order.orderTime)}`);
}

// Get status text
function getStatusText(status) {
    const statusMap = {
        'pending': 'অপেক্ষমাণ',
        'completed': 'সম্পন্ন',
        'cancelled': 'বাতিল'
    };
    return statusMap[status] || status;
}

// Reset form
function resetForm() {
    document.getElementById('addMedicineForm').reset();
    // Uncheck all checkboxes
    document.querySelectorAll('input[name="uses"]').forEach(checkbox => {
        checkbox.checked = false;
    });
}

// Upload image
function uploadImage() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageUrl = e.target.result;
                document.getElementById('pharmacyImage').src = imageUrl;
                document.getElementById('pharmacyImage').style.display = 'block';
                document.getElementById('pharmacyImage').nextElementSibling.style.display = 'none';
                
                // Save to pharmacy data
                currentPharmacy.ownerPhoto = imageUrl;
                localStorage.setItem('loggedInPharmacy', JSON.stringify(currentPharmacy));
                
                // Update header avatar
                updateUserInfo();
            };
            reader.readAsDataURL(file);
        }
    };
    
    input.click();
}

// Modal functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// Utility functions
function saveMedicines() {
    if (currentPharmacy) {
        localStorage.setItem(`medicines_${currentPharmacy.id}`, JSON.stringify(medicines));
    }
}

function saveOrders() {
    if (currentPharmacy) {
        localStorage.setItem(`orders_${currentPharmacy.id}`, JSON.stringify(orders));
    }
}

function addActivity(type, text, icon) {
    activities.unshift({
        type,
        text,
        time: 'এইমাত্র',
        icon
    });
    
    // Keep only last 10 activities
    if (activities.length > 10) {
        activities = activities.slice(0, 10);
    }
    
    // Save activities
    if (currentPharmacy) {
        localStorage.setItem(`activities_${currentPharmacy.id}`, JSON.stringify(activities));
    }
}

function loadActivities() {
    if (currentPharmacy) {
        const savedActivities = localStorage.getItem(`activities_${currentPharmacy.id}`);
        if (savedActivities) {
            activities = JSON.parse(savedActivities);
        }
    }
}

function formatDate(dateString) {
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
    } else {
        return date.toLocaleDateString('bn-BD');
    }
}

function convertTo12Hour(time24) {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'রাত' : 'সকাল';
    const hour12 = hour % 12 || 12;
    return `${hour12}টা`;
}

// Refresh data
function refreshData() {
    loadDashboardData();
    if (document.getElementById('inventory').classList.contains('active')) {
        loadInventoryTable();
    }
    if (document.getElementById('orders').classList.contains('active')) {
        loadOrdersList();
    }
    
    alert('ডেটা রিফ্রেশ করা হয়েছে!');
}

// Toggle notifications
function toggleNotifications() {
    // This would open a notification panel in a real app
    alert('নোটিফিকেশন ফিচার শীঘ্রই আসছে!');
}

// Logout
function logout() {
    if (confirm('আপনি কি লগ আউট করতে চান?')) {
        localStorage.removeItem('loggedInPharmacy');
        window.location.href = 'pharmacy-login.html';
    }
}

// Start real-time updates
function startRealTimeUpdates() {
    // Simulate real-time updates every 30 seconds
    setInterval(() => {
        // Check for low stock items
        const lowStockItems = medicines.filter(m => m.stock <= 5 && m.stock > 0);
        
        lowStockItems.forEach(medicine => {
            // Check if we already have a recent low stock activity for this medicine
            const recentActivity = activities.find(a => 
                a.type === 'stock_low' && a.text.includes(medicine.name)
            );
            
            if (!recentActivity) {
                addActivity('stock_low', `${medicine.name}এর স্টক কম (${medicine.stock}টি বাকি)`, 'fa-exclamation-triangle');
                
                // Update notification badge
                const badge = document.querySelector('.notification-badge');
                if (badge) {
                    const currentCount = parseInt(badge.textContent) || 0;
                    badge.textContent = currentCount + 1;
                }
            }
        });
        
        // Refresh dashboard if active
        if (document.getElementById('dashboard').classList.contains('active')) {
            loadDashboardData();
        }
    }, 30000); // 30 seconds
}