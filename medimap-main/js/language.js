// Language management for MediMap
const translations = {
    bn: {
        // Common elements
        title: "MediMap - ওষুধ খুঁজুন সহজেই",
        languageText: "English",
        pharmacyLogin: "ফার্মাসি লগইন",

        // Login/Registration Forms
        email: "Email",
        password: "Password",
        loginBtn: "Login",
        forgotPassword: "Forgot Password?",
        noAccount: "Don't have an account?",
        createAccount: "Create Account",
        pharmacyName: "Pharmacy Name",
        ownerName: "Owner Name",
        phoneNumber: "Phone Number",
        tradeLicense: "Trade License",
        location: "Location",
        registrationBtn: "Register",
        hasAccount: "Already have an account?",
        loginHere: "Login here",le: "MediMap - ওষুধ খুঁজুন সহজেই",
        languageText: "English",
        pharmacyLogin: "ফার্মাসি লগইন",
        pharmacyRegistration: "ফার্মাসি নিবন্ধন",
        pharmacyDashboard: "ফার্মাসি ড্যাশবোর্ড",
        searchResults: "খোঁজার ফলাফল",
        loading: "লোড হচ্ছে...",
        pharmacyOwner: "ফার্মাসি মালিক",
        admin: "অ্যাডমিন",

        // Login/Registration Forms
        email: "ইমেইল",
        password: "পাসওয়ার্ড",
        loginBtn: "লগইন করুন",
        forgotPassword: "পাসওয়ার্ড ভুলে গেছেন?",
        noAccount: "অ্যাকাউন্ট নেই?",
        createAccount: "নিবন্ধন করুন",
        pharmacyName: "ফার্মাসির নাম",
        ownerName: "মালিকের নাম",
        phoneNumber: "ফোন নাম্বার",
        tradeLicense: "ট্রেড লাইসেন্স",
        location: "অবস্থান",
        registrationBtn: "নিবন্ধন করুন",
        hasAccount: "অ্যাকাউন্ট আছে?",
        loginHere: "লগইন করুন",
        // Hero section
        heroTitle: "আপনার প্রয়োজনীয় ওষুধ খুঁজুন সহজেই",
        heroSubtitle: "আপনার এলাকার সব ফার্মাসির ওষুধের তথ্য এক জায়গায়",
        // Search section
        medicineTab: "ওষুধের নাম",
        symptomTab: "লক্ষণ অনুযায়ী",
        searchPlaceholder: "ওষুধের নাম লিখুন (যেমন: নাপা, হিস্টাসিন, সার্জেল)",
        searchBtn: "খুঁজুন",
        symptomSearchBtn: "নির্বাচিত লক্ষণ অনুযায়ী ওষুধ খুঁজুন",
        // Emergency section
        emergencyTitle: "জরুরি সেবা",
        emergencySubtitle: "অক্সিজেন সিলিন্ডার এবং জরুরি ওষুধের জন্য",
        emergencyBtn: "জরুরি ওষুধ খুঁজুন",
        // Services section
        servicesTitle: "আমাদের সেবা",
        servicesSubtitle: "আপনার স্বাস্থ্যসেবা আরও সহজ করতে আমাদের বিশেষ সুবিধা",
        nearbyPharmacy: "নিকটতম ফার্মাসি",
        nearbyPharmacyDesc: "আপনার অবস্থানের সবচেয়ে কাছের ফার্মাসি খুঁজে পান",
        realTimeInfo: "রিয়েল-টাইম তথ্য",
        realTimeInfoDesc: "ওষুধের প্রাপ্যতা এবং দাম সর্বদা আপডেটেড",
        directContact: "সরাসরি যোগাযোগ",
        directContactDesc: "ফার্মাসির সাথে সরাসরি ফোনে কথা বলুন",
        // Footer
        footerDesc: "স্বাস্থ্যসেবা সহজ করা আমাদের লক্ষ্য",
        copyright: "© 2024 MediMap. সকল অধিকার সংরক্ষিত।",
        // Alert messages
        alertMedicineName: "অনুগ্রহ করে ওষুধের নাম লিখুন",
        alertSelectSymptom: "অনুগ্রহ করে কমপক্ষে একটি লক্ষণ নির্বাচন করুন",
        // Symptoms
        symptoms: {
            fever: {
                name: "জ্বর",
                desc: "Fever"
            },
            cold: {
                name: "সর্দি",
                desc: "Cold"
            },
            headache: {
                name: "মাথা ব্যথা",
                desc: "Headache"
            },
            diarrhea: {
                name: "পাতলা পায়খানা",
                desc: "Diarrhea"
            },
            "body-pain": {
                name: "হাত/পায়ে ব্যথা",
                desc: "Body Pain"
            },
            allergy: {
                name: "এলার্জি",
                desc: "Allergy"
            },
            gastric: {
                name: "গ্যাস্ট্রিক",
                desc: "Gastric"
            },
            asthma: {
                name: "এজমা",
                desc: "Asthma"
            },
            toothache: {
                name: "দাঁতের ব্যথা",
                desc: "Toothache"
            },
            "nasal-congestion": {
                name: "নাক বন্ধ",
                desc: "Nasal Congestion"
            }
        }
    },
    en: {
        // Common elements
        title: "MediMap - Find Medicines Easily",
        languageText: "বাংলা",
        pharmacyLogin: "Pharmacy Login",
        // Hero section
        heroTitle: "Find Your Required Medicines Easily",
        heroSubtitle: "Information about medicines from all pharmacies in your area in one place",
        // Search section
        medicineTab: "Medicine Name",
        symptomTab: "By Symptoms",
        searchPlaceholder: "Enter medicine name (e.g.: Napa, Histacin, Sergel)",
        searchBtn: "Search",
        symptomSearchBtn: "Search medicines by selected symptoms",
        // Emergency section
        emergencyTitle: "Emergency Service",
        emergencySubtitle: "For oxygen cylinders and emergency medicines",
        emergencyBtn: "Find Emergency Medicines",
        // Services section
        servicesTitle: "Our Services",
        servicesSubtitle: "Special facilities to make your healthcare easier",
        nearbyPharmacy: "Nearby Pharmacy",
        nearbyPharmacyDesc: "Find the closest pharmacy to your location",
        realTimeInfo: "Real-Time Information",
        realTimeInfoDesc: "Medicine availability and prices always updated",
        directContact: "Direct Contact",
        directContactDesc: "Speak directly with the pharmacy by phone",
        // Footer
        footerDesc: "Making healthcare simple is our goal",
        copyright: "© 2024 MediMap. All rights reserved.",
        // Alert messages
        alertMedicineName: "Please enter a medicine name",
        alertSelectSymptom: "Please select at least one symptom",
        // Symptoms
        symptoms: {
            fever: {
                name: "Fever",
                desc: "High Temperature"
            },
            cold: {
                name: "Cold",
                desc: "Common Cold"
            },
            headache: {
                name: "Headache",
                desc: "Head Pain"
            },
            diarrhea: {
                name: "Diarrhea",
                desc: "Loose Stool"
            },
            "body-pain": {
                name: "Body Pain",
                desc: "Muscle/Joint Pain"
            },
            allergy: {
                name: "Allergy",
                desc: "Allergic Reaction"
            },
            gastric: {
                name: "Gastric",
                desc: "Stomach Pain"
            },
            asthma: {
                name: "Asthma",
                desc: "Breathing Problem"
            },
            toothache: {
                name: "Toothache",
                desc: "Dental Pain"
            },
            "nasal-congestion": {
                name: "Nasal Congestion",
                desc: "Blocked Nose"
            }
        }
    }
};

// Get current language from localStorage or default to Bengali
let currentLanguage = localStorage.getItem("language") || "bn";

// Function to update page content based on selected language
function updateContent() {
    const t = translations[currentLanguage];
    
    // Update HTML lang attribute
    document.documentElement.lang = currentLanguage;
    
    // Update page title
    document.title = t.title;

    // Update language toggle button
    const langText = document.getElementById("languageText");
    if (langText) langText.textContent = t.languageText;

    // Update pharmacy login button
    const loginBtn = document.querySelector(".nav-buttons .btn-primary");
    if (loginBtn) {
        loginBtn.innerHTML = `<i class="fas fa-store"></i> ${t.pharmacyLogin}`;
    }

    // Update hero section
    const heroTitle = document.querySelector(".hero h2");
    const heroSubtitle = document.querySelector(".hero p");
    if (heroTitle) heroTitle.textContent = t.heroTitle;
    if (heroSubtitle) heroSubtitle.textContent = t.heroSubtitle;

    // Update search tabs
    const medicineTabs = document.querySelector("[data-tab=\'medicine\']");
    const symptomTabs = document.querySelector("[data-tab=\'symptom\']");
    if (medicineTabs) medicineTabs.innerHTML = `<i class="fas fa-pills"></i> ${t.medicineTab}`;
    if (symptomTabs) symptomTabs.innerHTML = `<i class="fas fa-stethoscope"></i> ${t.symptomTab}`;

    // Update search elements
    const searchInput = document.querySelector(".search-input");
    const searchBtn = document.querySelector("#medicine-search .search-btn");
    const symptomSearchBtn = document.querySelector("#symptom-search .search-btn");
    if (searchInput) searchInput.placeholder = t.searchPlaceholder;
    if (searchBtn) searchBtn.innerHTML = `<i class="fas fa-search"></i> ${t.searchBtn}`;
    if (symptomSearchBtn) symptomSearchBtn.innerHTML = `<i class="fas fa-search"></i> ${t.symptomSearchBtn}`;

    // Update symptom cards
    document.querySelectorAll(".symptom-card").forEach(card => {
        const symptom = card.dataset.symptom;
        if (symptom && t.symptoms[symptom]) {
            const name = card.querySelector("h4");
            const desc = card.querySelector("p");
            if (name) name.textContent = t.symptoms[symptom].name;
            if (desc) desc.textContent = t.symptoms[symptom].desc;
        }
    });

    // Update emergency section
    const emergencyTitle = document.querySelector(".emergency-section h3");
    const emergencySubtitle = document.querySelector(".emergency-section p");
    const emergencyButton = document.querySelector(".emergency-btn");
    if (emergencyTitle) emergencyTitle.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${t.emergencyTitle}`;
    if (emergencySubtitle) emergencySubtitle.textContent = t.emergencySubtitle;
    if (emergencyButton) emergencyButton.innerHTML = `<i class="fas fa-ambulance"></i> ${t.emergencyBtn}`;

    // Update services section
    const servicesTitle = document.querySelector(".features h2");
    const servicesSubtitle = document.querySelector(".features > p");
    if (servicesTitle) servicesTitle.textContent = t.servicesTitle;
    if (servicesSubtitle) servicesSubtitle.textContent = t.servicesSubtitle;

    // Update feature cards
    const featureCards = document.querySelectorAll(".feature-card");
    if (featureCards.length >= 3) {
        featureCards[0].querySelector("h3").textContent = t.nearbyPharmacy;
        featureCards[0].querySelector("p").textContent = t.nearbyPharmacyDesc;
        featureCards[1].querySelector("h3").textContent = t.realTimeInfo;
        featureCards[1].querySelector("p").textContent = t.realTimeInfoDesc;
        featureCards[2].querySelector("h3").textContent = t.directContact;
        featureCards[2].querySelector("p").textContent = t.directContactDesc;
    }

    // Update footer
    const footerDesc = document.querySelector(".footer p");
    const copyright = document.querySelector(".footer p:last-child");
    if (footerDesc) footerDesc.textContent = t.footerDesc;
    if (copyright) copyright.textContent = t.copyright;
}

// Function to toggle language
function toggleLanguage() {
    currentLanguage = currentLanguage === "bn" ? "en" : "bn";
    localStorage.setItem("language", currentLanguage);
    updateContent();
}

// Initialize language on page load
document.addEventListener("DOMContentLoaded", () => {
    updateContent();
});

// Listen for language changes from other tabs/windows
window.addEventListener("storage", (event) => {
    if (event.key === "language") {
        currentLanguage = event.newValue;
        updateContent();
    }
});
