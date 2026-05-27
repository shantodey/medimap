# MediMap - Medicine Availability Tracking System

![MediMap Banner](assets/banner-placeholder.png)

**Find medicines near you. Fast. Easy. Reliable.**

MediMap is a location-based medicine availability tracking system designed for Bangladesh that helps users find medicines from nearby pharmacies by medicine name or symptoms. It bridges the gap between patients seeking medications and pharmacy owners managing inventory.

---

## 🎯 Project Overview

| Aspect | Details |
|--------|---------|
| **Purpose** | Help users find medicines by symptoms or medicine names from nearby pharmacies |
| **Target Area** | Mirpur-1, Dhaka (Expandable to entire Dhaka) |
| **Target Users** | General public seeking medicines + Pharmacy owners |
| **Timeline** | Competitive hackathon project |
| **Languages** | Bangla + English (Dual language support) |

---

## ✨ Core Features

### 1. **Public User Interface (No Registration Required)**

#### Homepage (`index.html`)
- 🔍 **Dual Search Functionality**
  - Medicine name search (Bangla/English)
  - Symptom-based search (জ্বর, সর্দি, মাথা ব্যথা, etc.)
- 🚨 **Emergency Section** - Quick oxygen availability checker
- 📱 **Responsive Design** - Perfect on mobile, tablet, and desktop

#### Search Results Page (`search-results.html`)
- 📍 **Pharmacy Listings** (within 2km radius)
- ℹ️ **Detailed Pharmacy Cards** showing:
  - Pharmacy name
  - Available medicine + price
  - Opening hours (exact timing)
  - Phone number
  - Distance from user
  - Open/Closed status indicator
- 🗺️ **Get Directions** - Google Maps integration
- 💰 **Price Comparison** - View prices across pharmacies

### 2. **Pharmacy Registration & Authentication**

#### Pharmacy Registration (`pharmacy-registration.html`)
```
Required Information:
├── Pharmacy Details
│   ├── Name
│   ├── Location/Address
│   └── Phone Number
├── Operating Hours
├── Owner Information
│   ├── Name
│   └── Photo Upload
├── Medicine Inventory Selection
│   ├── Disease Category Grid
│   └── Medicine Selection UI
├── Legal Agreement
└── Credentials (Username/Password)
```

#### Pharmacy Admin Panel (`pharmacy-login.html` + `admin-dashboard.html`)
- 🔐 **Secure Login** - Individual pharmacy authentication
- 📊 **Inventory Management**
  - View current stock
  - Add/Update/Delete medicines
  - Update quantities and prices
- ⏰ **Update Operating Hours**
- 👤 **Profile Management**
- 🔑 **Password Change**

---

## 💊 Medicine Database

### Symptom-to-Medicine Mapping

| Symptom | Medicines | Bangla |
|---------|-----------|--------|
| Fever | Napa, Napa Extra, Paracetamol, Ace | জ্বর |
| Cold/Cough | Histacin, Fexo, Allerin | সর্দি |
| Headache | Napa, Sergel, Maxpro | মাথা ব্যথা |
| Diarrhea | Orsaline, Imodium, Flagyl | পাতলা পায়খানা |
| Body/Joint Pain | Napa, Ace Plus, Flexi | হাত/পায়ে ব্যথা |
| Allergies | Histacin, Fexo, Cetrizin | এলার্জি |
| Gastric Issues | Omeprazole, Antacid, Seclo | গ্যাস্ট্রিক |
| Asthma | Salbutamol, Ventolin | এজমা |
| Toothache | Ketorolac, Dental gel | দাঁতের ব্যথা |
| Nasal Congestion | Otrivin, Naselin | নাক বন্ধ |

### Sample Medicine Pricing (Realistic)
- Napa: 2-3 টাকা
- Histacin: 8-10 টাকা
- Paracetamol: 2-3 টাকা
- Orsaline: 15-20 টাকা

---

## 🗺️ Location & Coverage

### Geographic Details
- **Base Location**: Mirpur-1, Dhaka
- **Search Radius**: 2km
- **Sample Data**: 15-20 realistic pharmacies with Mirpur-1 addresses
- **Mapping**: Google Maps API integration with directions

### Distance Calculation
- Real-time distance from user location to pharmacy
- Sorted results by proximity
- GPS-based location tracking

---

## 🏗️ Technology Stack

### Frontend
```
HTML5          - Page structure and semantics
CSS3           - Responsive design, animations, modern styling
JavaScript ES6 - Interactive features, search logic, real-time updates
Google Maps API - Location and direction features
```

### Backend & Database
```
Firebase Firestore - NoSQL database (Real-time updates)
              OR
Firebase Realtime Database - Alternative option
Firebase Authentication - Secure admin login
```

### Additional Libraries/Services
- **Location Services**: Google Maps API, Geolocation API
- **Icons**: Medical-themed icon library
- **Language**: i18n/Internationalization library (optional)

---

## 📁 Project Structure

```
medimap/
├── index.html                          # Public homepage
├── search-results.html                 # Search results page
├── pharmacy-registration.html          # Pharmacy sign-up form
├── pharmacy-login.html                 # Pharmacy login
├── admin-dashboard.html                # Pharmacy admin panel
├── test-features.html                  # Feature testing page
├── setup-firebase-demo.html            # Firebase setup guide
│
├── css/
│   ├── style.css                       # Main styling
│   ├── responsive.css                  # Mobile optimization
│   ├── admin.css                       # Admin panel styling
│   ├── pharmacy_login.css              # Login page styling
│   ├── registration.css                # Registration form styling
│   ├── search_results.css              # Search results styling
│   └── responsive/                     # Responsive breakpoints
│
├── js/
│   ├── firebase-config.js              # Firebase initialization
│   ├── main.js                         # Public user functions
│   ├── search.js                       # Search functionality
│   ├── admin.js                        # Admin panel functions
│   ├── pharmacy_login.js               # Login logic
│   ├── registration.js                 # Registration logic
│   ├── maps.js                         # Google Maps integration
│   ├── language.js                     # Bangla/English translation
│   ├── medicine-names.js               # Medicine database
│   └── transliteration.js              # Bangla transliteration
│
├── assets/
│   ├── images/                         # Medicine icons, UI elements
│   ├── logo/                           # Logo files
│   └── demo-data/                      # Sample pharmacies & medicines
│
├── README.md                           # This file
├── DEPLOYMENT.md                       # Deployment guide
├── USER_MANUAL.md                      # User guide for pharmacy owners
└── DEMO_SCRIPT.md                      # Competition presentation script
```

---

## 📊 Firebase Firestore Database Schema

### Collections & Documents

#### `pharmacies` Collection
```javascript
{
  id: "pharmacy_001",
  name: "Square Pharmacy",
  banglaName: "স্কোয়ার ফার্মেসি",
  location: "Mirpur-1, Dhaka",
  coordinates: {
    lat: 23.8103,
    lng: 90.3563
  },
  phone: "+880123456789",
  openingHours: "8:00 AM - 10:00 PM",
  isOpen: true,
  ownerName: "Ahmed Hassan",
  ownerPhoto: "url/to/photo.jpg",
  username: "square_pharmacy",
  passwordHash: "hashed_password",
  createdAt: timestamp,
  email: "owner@example.com"
}
```

#### `medicines` Collection
```javascript
{
  id: "med_001",
  name: "Napa",
  banglaName: "নাপা",
  uses: ["Fever", "Headache", "Body Pain"],
  symptoms: ["জ্বর", "মাথা ব্যথা", "হাত/পায়ে ব্যথা"],
  category: "Painkiller",
  description: "Paracetamol based pain reliever"
}
```

#### `inventory` Collection
```javascript
{
  id: "inv_001",
  pharmacyId: "pharmacy_001",
  medicineId: "med_001",
  quantity: 50,
  price: 2.50,
  unit: "tablet/strip",
  lastUpdated: timestamp
}
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js 14+ (if using local development)
- Google Chrome/Firefox browser
- Firebase account (Free tier works fine)
- Google Maps API key

### Step 1: Clone Repository
```bash
git clone https://github.com/yourusername/medimap.git
cd medimap
```

### Step 2: Firebase Setup
1. Create Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable Firestore Database (Start in test mode)
3. Copy Firebase config to `js/firebase-config.js`
4. Enable Authentication (Email/Password)

### Step 3: Google Maps Setup
1. Get API key from [Google Cloud Console](https://console.cloud.google.com)
2. Add to `js/maps.js`:
```javascript
const GOOGLE_MAPS_API_KEY = "YOUR_API_KEY_HERE";
```

### Step 4: Local Testing
```bash
# Using Python's built-in server (Python 3)
python -m http.server 8000

# OR using Node.js http-server
npm install -g http-server
http-server
```
Access at: `http://localhost:8000`

### Step 5: Load Demo Data
Run the setup script to populate sample pharmacies and medicines:
- Open `setup-firebase-demo.html` in browser
- Click "Load Demo Data" button
- Wait for completion

---

## 💡 Real-World Usage Scenarios

### Scenario 1: Patient Finding Medicine
```
1. User opens MediMap
2. Feels fever symptoms
3. Clicks "Search by Symptoms"
4. Selects "জ্বর" (Fever)
5. Gets list of nearby pharmacies with Napa availability
6. Clicks "Get Directions"
7. Google Maps opens with route
8. Successfully finds medicine
```

### Scenario 2: Pharmacy Stock Management
```
1. Pharmacy owner logs in
2. Checks inventory dashboard
3. Napa stock is low
4. Updates quantity to 100
5. Adjusts price to 2.75 টাকা
6. Changes opening hours to 24-hour
7. Changes are live immediately
8. Patients see updated info
```

### Scenario 3: Emergency Medicine Search
```
1. User needs oxygen urgently
2. Clicks "Emergency" section
3. Gets pharmacies with oxygen availability
4. Calls nearby pharmacy
5. Gets directions
6. Reaches within minutes
```

### Scenario 4: Price Comparison
```
1. Patient needs Histacin
2. Searches "Histacin"
3. Sees 8 pharmacies selling it
4. Compares prices: 8, 8.50, 9, 8.25 টাকা
5. Chooses cheapest option
6. Gets directions
```

---

## ✅ Advantages

### For Patients/Public Users
- ✨ **Fast Medicine Finding** - No phone calls, get instant results
- 📍 **Location-Based** - Find nearest pharmacies
- 💰 **Price Transparency** - Compare prices across stores
- 🏥 **Symptom Search** - Find medicines without knowing exact name
- 🚨 **Emergency Support** - Quick access to critical medicines
- 📱 **Mobile-First** - Optimized for smartphones (primary user device)
- 🌍 **Dual Language** - Bangla and English support
- ⚡ **Offline Capable** - Works with slow internet

### For Pharmacy Owners
- 📊 **Inventory Control** - Real-time stock management
- 💼 **Business Visibility** - Free visibility on MediMap
- ⏰ **Hours Management** - Update opening hours instantly
- 👥 **Customer Reach** - Accessible to thousands of users
- 💹 **Price Control** - Set competitive prices easily
- 📈 **Business Insights** - Track popular medicines
- 🔒 **Secure Login** - Individual pharmacy authentication

### For Society
- 🏥 **Healthcare Access** - Easier medicine availability
- 📚 **Symptom Education** - Learn which medicines treat symptoms
- 💊 **Counterfeit Prevention** - Registered pharmacies only
- 🌱 **Economic Benefit** - Reduced travel time, fuel savings
- 👨‍⚕️ **Emergency Preparedness** - Quick critical medicine access

---

## ⚠️ Disadvantages & Limitations

### Current Limitations
1. **Geographic Limitation**
   - Currently covers only Mirpur-1, Dhaka
   - Requires manual expansion to other areas
   - Limited to pharmacies who register

2. **Internet Dependency**
   - Requires active internet connection
   - GPS-based location may be inaccurate indoors
   - Real-time data needs Firebase connectivity

3. **Manual Data Management**
   - Pharmacy owners must manually update inventory
   - No automatic stock sync from POS systems
   - Potential for outdated information

4. **Pharmacy Participation**
   - Only registered pharmacies appear in system
   - Requires owner willingness to register
   - Need for ongoing training/support

5. **Database Limitations**
   - Firebase free tier has usage limits
   - Scaling costs increase with data
   - No traditional backend for complex queries

6. **Security Concerns**
   - Requires strong password policies
   - Risk of account takeovers
   - No 2FA initially
   - Personal data (pharmacy locations) is public

7. **Device Requirements**
   - Requires modern smartphone
   - GPS/Location services must be enabled
   - May drain battery with GPS on

8. **Accuracy Issues**
   - GPS accuracy varies (±5-10 meters)
   - Manual price updates can be outdated
   - Stock information not real-time integrated

---

## 🔧 What Needs to Be Done

### Phase 1: Core Functionality (Weeks 1-2)
- [ ] Complete responsive design (mobile-first)
- [ ] Implement Firebase Firestore setup
- [ ] Build medicine database (100+ medicines)
- [ ] Create symptom-to-medicine mapping
- [ ] Develop search algorithm
- [ ] Implement Google Maps integration
- [ ] Pharmacy registration form validation
- [ ] Admin login authentication
- [ ] Admin dashboard CRUD operations

### Phase 2: Testing & Optimization (Weeks 3-4)
- [ ] Load testing (performance optimization)
- [ ] Security testing (penetration testing)
- [ ] Cross-browser compatibility
- [ ] Mobile device testing
- [ ] GPS accuracy testing
- [ ] Database query optimization
- [ ] Bug fixes and refinement
- [ ] Demo data population (20+ pharmacies)

### Phase 3: Enhancement (Weeks 5+)
- [ ] Pharmacy rating/review system
- [ ] User bookmarking/favorites
- [ ] Push notifications for stock updates
- [ ] SMS notifications
- [ ] Advanced analytics for pharmacy owners
- [ ] Medicine barcode scanning
- [ ] AI-powered recommendation system
- [ ] Multi-language support beyond Bangla/English
- [ ] Integration with real POS systems
- [ ] Mobile app (React Native/Flutter)

### Phase 4: Scaling (Future)
- [ ] Expand to entire Dhaka
- [ ] Expand to other cities
- [ ] Government partnership for data accuracy
- [ ] Integration with online pharmacy delivery
- [ ] Doctor consultation integration
- [ ] Medicine prescription upload
- [ ] Insurance integration
- [ ] Revenue model implementation

### Known Bugs/Issues to Fix
- [ ] Search result sorting by distance accuracy
- [ ] Responsive design glitches on iPad
- [ ] Firebase authentication error handling
- [ ] Memory leaks in map rendering
- [ ] Session timeout issues
- [ ] Password reset functionality

---

## 📋 Quick Start: Demo Data

### Sample Pharmacies (Pre-loaded)
```
1. Square Pharmacy - Mirpur-1, Dhaka
2. Popular Pharmacy - Mirpur-1, Dhaka
3. Apollo Pharmacy - Mirpur-1, Dhaka
4. Labaid Pharmacy - Mirpur-1, Dhaka
5. Metro Pharmacy - Mirpur-1, Dhaka
... (15-20 total)
```

### Sample Medicines (Pre-loaded)
- **Fever**: Napa (2-3৳), Paracetamol (2-3৳)
- **Cold**: Histacin (8-10৳), Fexo (10-12৳)
- **Headache**: Napa (2-3৳), Sergel (15-20৳)
- **Emergency**: Oxygen, Salbutamol, Epinephrine

### Test Credentials
```
Admin Test Login:
Username: demo@pharmacy.com
Password: demo123456

(Note: Change in production!)
```

---

## 🔐 Security Features

### Implemented
- ✅ Password hashing (bcrypt/Firebase)
- ✅ Input sanitization & validation
- ✅ XSS protection (Content Security Policy)
- ✅ CSRF token protection
- ✅ Firebase security rules
- ✅ HTTPS only (deployment requirement)
- ✅ Secure session management

### Recommended Implementation
- 🔄 Two-factor authentication (2FA)
- 🔔 Email verification for registration
- 🛡️ Rate limiting on login attempts
- 📊 Audit logging for admin actions
- 🔐 API rate limiting
- 🚨 Anomaly detection
- 🔑 API key rotation

---

## 📱 Mobile Optimization

### Performance Metrics
- Target: Page load < 3 seconds on 4G
- JavaScript bundle: < 200KB
- Images: Optimized WEBP format
- CSS: Minified and critical path optimized

### Touch Optimization
- Buttons: 48x48px minimum tap target
- Spacing: 8px minimum between interactive elements
- Swipe gestures: Support left/right swiping
- Thumb-friendly navigation

### Mobile Features
- GPS auto-detection
- Mobile-optimized maps
- Fast 3G compatible
- Offline caching capability

---

## 🎯 Competition Presentation

### What Makes It Special
1. **Social Impact** - Easy medicine access for common people
2. **Real Problem Solving** - Addresses actual healthcare access issues
3. **Emergency Preparedness** - Quick critical medicine finder
4. **User-Centric Design** - Built for mobile-first Bangladesh
5. **Scalability** - Can expand city-wide with minimal changes
6. **Economic Benefit** - Time and money savings for users
7. **Transparency** - Price comparison reduces overcharging
8. **Symptom Education** - Learn about medicines via symptoms

### Demonstration Flow (5 minutes)
1. Show homepage with dual search (1 min)
2. Demo symptom search → results (1 min)
3. Demo medicine search → Google Maps (1 min)
4. Show pharmacy admin login and inventory update (1 min)
5. Live results update in customer view (1 min)

---

## 📚 Documentation Files

- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Complete deployment guide
- **[USER_MANUAL.md](USER_MANUAL.md)** - Pharmacy owner training manual
- **[DEMO_SCRIPT.md](DEMO_SCRIPT.md)** - Competition presentation script
- **[API_DOCS.md](API_DOCS.md)** - Firebase endpoints documentation
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Contribution guidelines

---

## 🚀 Deployment

### Live on Firebase Hosting (Recommended)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

### Alternative Deployments
- GitHub Pages (Static files only)
- Netlify (Recommended for frontend)
- Vercel (If using Node.js backend)
- Docker container deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

---

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        User Browser                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           MediMap Frontend Application               │  │
│  │  (HTML/CSS/JavaScript - Responsive Web App)          │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────┬──────────────────────────┬──────────────────┘
               │                          │
        ┌──────▼──────────┐      ┌───────▼──────────┐
        │ Google Maps API │      │ Firebase Firestore│
        │ (Maps & Routing)│      │ (Database)        │
        └─────────────────┘      └───────────────────┘
                                        │
                         ┌──────────────┼──────────────┐
                         │              │              │
                    ┌────▼────┐  ┌─────▼────┐  ┌─────▼────┐
                    │Pharmacies│  │ Medicines│  │Inventory │
                    │Collection│  │Collection│  │Collection│
                    └──────────┘  └──────────┘  └──────────┘
```

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Areas for Contribution
- Bug fixes and optimizations
- New language support
- UI/UX improvements
- Documentation translation
- Feature development
- Testing and QA

---

## 📈 Performance Benchmarks

| Metric | Target | Current |
|--------|--------|---------|
| Homepage Load Time | < 2s | TBD |
| Search Results Load | < 1s | TBD |
| Admin Dashboard Load | < 2s | TBD |
| Lighthouse Score | > 90 | TBD |
| Mobile Responsiveness | 100% | TBD |

---

## 📝 License

This project is licensed under the **MIT License** - see [LICENSE](LICENSE) file for details.

---

## 👨‍💼 Team

- **Project Lead**: [Your Name]
- **Frontend Developer**: [Name]
- **Backend Developer**: [Name]
- **UI/UX Designer**: [Name]
- **Quality Assurance**: [Name]

---

## 📞 Support & Contact

- 📧 Email: support@medimap.bd
- 💬 Chat: Available 24/7 on website
- 🐛 Bug Reports: [GitHub Issues](https://github.com/yourusername/medimap/issues)
- 💡 Feature Requests: [GitHub Discussions](https://github.com/yourusername/medimap/discussions)

---

## 🙏 Acknowledgments

- Firebase for backend infrastructure
- Google Maps API for location services
- Bangladesh healthcare system inspiration
- Community feedback and testing

---

## 🎓 Learning Resources

### Frontend Development
- [MDN Web Docs](https://developer.mozilla.org)
- [Firebase Web Guide](https://firebase.google.com/docs/web)
- [Google Maps API](https://developers.google.com/maps)

### Bangla Localization
- [Unicode Bangla](https://en.wikipedia.org/wiki/Bengali_script)
- [i18n Implementation](https://www.i18next.com/)

---

## 📊 Roadmap

### Q1 2026
- ✅ Alpha release (Mirpur-1)
- ✅ Community testing and feedback

### Q2 2026
- 🔄 Beta expansion to Dhaka
- 🔄 Pharmacy rating system
- 🔄 Mobile app launch

### Q3 2026
- 🔄 National expansion
- 🔄 Government integration
- 🔄 API partnerships

### Q4 2026
- 🔄 Advanced AI features
- 🔄 POS system integration
- 🔄 International expansion

---

**Made with ❤️ for Better Healthcare Access in Bangladesh**

---

*Last Updated: May 2026*  
*Version: 1.0 (Beta)*

