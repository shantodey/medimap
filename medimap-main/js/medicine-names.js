// Medicine names mapping between English and Bangla
const medicineNamesMapping = {
    // Common Pain Relievers
    'napa': 'নাপা',
    'paracetamol': 'প্যারাসিটামল',
    'ace': 'এস',
    'sergel': 'সার্জেল',
    'tufnil': 'টাফনিল',
    'aspirin': 'এসপিরিন',
    'brufen': 'ব্রুফেন',
    'ibuprofen': 'আইবুপ্রোফেন',

    // Antibiotics
    'amoxicillin': 'অ্যামক্সিসিলিন',
    'ciprocin': 'সিপ্রোসিন',
    'doxycycline': 'ডক্সিসাইক্লিন',
    'azithromycin': 'অ্যাজিথ্রোমাইসিন',

    // Antihistamines
    'histacin': 'হিস্টাসিন',
    'alatrol': 'এলাট্রল',
    'fenadin': 'ফেনাডিন',
    'xoral': 'জরাল',

    // Antacids
    'seclo': 'সেকলো',
    'losectil': 'লোসেকটিল',
    'nexium': 'নেক্সিয়াম',
    'pantonix': 'প্যান্টনিক্স',

    // Vitamins
    'calbo-d': 'ক্যালবো-ডি',
    'jarjina': 'জারজিনা',
    'nutrivit-gold': 'নিউট্রিভিট-গোল্ড',
    
    // Cough Medicines
    'procap': 'প্রোক্যাপ',
    'pulmonil': 'পালমোনিল',
    'tusca': 'টাস্কা',
    
    // Antiallergics
    'allermine': 'এলারমিন',
    'monas': 'মোনাস',
    'cetirizine': 'সিটিরিজিন',

    // Add more medicine names as needed
};

// Function to normalize text for searching (remove spaces, make lowercase)
function normalizeText(text) {
    return text.toLowerCase().replace(/\s+/g, '');
}

// Function to create a searchable index with variations
const searchableIndex = {};

// Initialize searchable index
function initializeSearchIndex() {
    // Process each medicine name
    Object.entries(medicineNamesMapping).forEach(([english, bangla]) => {
        // Add original entries
        searchableIndex[normalizeText(english)] = { en: english, bn: bangla };
        searchableIndex[normalizeText(bangla)] = { en: english, bn: bangla };
        
        // Add phonetic variations for English names
        // Example: 'napa' could also be searched as 'nappa' or 'napaa'
        if (english.length > 3) {
            const variations = generateVariations(english);
            variations.forEach(variation => {
                searchableIndex[normalizeText(variation)] = { en: english, bn: bangla };
            });
        }
    });
}

// Function to generate common spelling variations
function generateVariations(word) {
    const variations = new Set([word]);
    const normalized = word.toLowerCase();
    
    // Common letter duplications
    for (let i = 0; i < normalized.length - 1; i++) {
        variations.add(normalized.slice(0, i) + normalized[i] + normalized[i] + normalized.slice(i + 1));
    }
    
    // Common vowel variations
    const vowelMap = {
        'a': ['e'],
        'e': ['a', 'i'],
        'i': ['e', 'y'],
        'o': ['u'],
        'u': ['o']
    };
    
    for (let i = 0; i < normalized.length; i++) {
        const alternatives = vowelMap[normalized[i]];
        if (alternatives) {
            alternatives.forEach(alt => {
                variations.add(normalized.slice(0, i) + alt + normalized.slice(i + 1));
            });
        }
    }
    
    return [...variations];
}

// Function to search medicine names
function searchMedicineName(query) {
    const normalizedQuery = normalizeText(query);
    const results = [];
    const seenMedicines = new Set();
    
    // Direct match
    if (searchableIndex[normalizedQuery]) {
        const match = searchableIndex[normalizedQuery];
        results.push(match);
        seenMedicines.add(match.en);
    }
    
    // Partial matches
    Object.entries(searchableIndex).forEach(([indexKey, medicine]) => {
        if (!seenMedicines.has(medicine.en) && 
            (indexKey.includes(normalizedQuery) || normalizedQuery.includes(indexKey))) {
            results.push(medicine);
            seenMedicines.add(medicine.en);
        }
    });
    
    return results;
}

// Initialize the search index when the file loads
initializeSearchIndex();