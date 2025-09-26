// Bangla transliteration mapping
const banglaTransliteration = {
    'a': 'আ',
    'aa': 'া',
    'i': 'ই',
    'ii': 'ী',
    'u': 'উ',
    'uu': 'ু',
    'e': 'এ',
    'ee': 'ী',
    'o': 'ও',
    'oo': 'ু',
    'k': 'ক',
    'kh': 'খ',
    'g': 'গ',
    'gh': 'ঘ',
    'n': 'ন',
    'c': 'চ',
    'ch': 'ছ',
    'j': 'জ',
    'jh': 'ঝ',
    't': 'ত',
    'th': 'থ',
    'd': 'দ',
    'dh': 'ধ',
    'p': 'প',
    'ph': 'ফ',
    'b': 'ব',
    'bh': 'ভ',
    'm': 'm',
    'r': 'র',
    'l': 'ল',
    's': 'স',
    'sh': 'শ',
    'h': 'হ',
    'y': 'য়',
    'ng': 'ং'
};

// Function to transliterate English to Bangla
function transliterateEnglishToBangla(text) {
    // Convert text to lowercase for consistent matching
    text = text.toLowerCase();
    
    // First, try to find direct medicine name mapping
    const directMatch = medicineNamesMapping[text];
    if (directMatch) return directMatch;

    let result = '';
    let i = 0;
    
    while (i < text.length) {
        let found = false;
        
        // Try to match two-character combinations first
        if (i < text.length - 1) {
            const twoChars = text.slice(i, i + 2);
            if (banglaTransliteration[twoChars]) {
                result += banglaTransliteration[twoChars];
                i += 2;
                found = true;
                continue;
            }
        }
        
        // Try to match single characters
        if (banglaTransliteration[text[i]]) {
            result += banglaTransliteration[text[i]];
            found = true;
        } else {
            // If no match found, keep the original character
            result += text[i];
        }
        i++;
    }
    
    return result;
}

// Function to process search input
function processSearchInput(input) {
    const results = [];
    const transliteratedInput = transliterateEnglishToBangla(input);
    
    // Search through pharmacy data
    pharmaciesData.forEach(pharmacy => {
        Object.keys(pharmacy.medicines).forEach(medicineName => {
            // Check original medicine name
            if (medicineName.toLowerCase().includes(input.toLowerCase()) ||
                medicineName.includes(transliteratedInput)) {
                
                // Create result object with both English and Bangla names
                const resultObj = {
                    banglaName: medicineName,
                    englishName: Object.keys(medicineNamesMapping).find(
                        key => medicineNamesMapping[key] === medicineName
                    ) || medicineName,
                    pharmacy: pharmacy
                };
                
                // Add to results if not already present
                if (!results.some(r => r.banglaName === resultObj.banglaName)) {
                    results.push(resultObj);
                }
            }
        });
    });
    
    return results;
}

// Function to display search results
function displaySearchResults(results) {
    const resultsContainer = document.querySelector('.search-results');
    const currentLang = localStorage.getItem('language') || 'bn';
    
    if (results.length === 0) {
        resultsContainer.innerHTML = `
            <div class="no-results">
                <p>${currentLang === 'bn' ? 'কোন ফলাফল পাওয়া যায়নি' : 'No results found'}</p>
            </div>
        `;
        return;
    }
    
    const resultsList = results.map(result => `
        <div class="medicine-item" onclick="showPharmacyDetails('${result.pharmacy.id}', '${result.banglaName}')">
            <div class="medicine-name">
                <strong>${currentLang === 'bn' ? result.banglaName : result.englishName}</strong>
                <span class="alternate-name">
                    (${currentLang === 'bn' ? result.englishName : result.banglaName})
                </span>
            </div>
            <div class="availability">
                ${currentLang === 'bn' ? 'উপলব্ধ' : 'Available'}: ${result.pharmacy.name}
            </div>
            <div class="medicine-info">
                <span class="price">৳${result.pharmacy.medicines[result.banglaName].price}</span>
                <span class="stock">${result.pharmacy.medicines[result.banglaName].stock} ${currentLang === 'bn' ? 'পিস' : 'pcs'}</span>
            </div>
        </div>
    `).join('');
    
    resultsContainer.innerHTML = `
        <div class="results-list">
            ${resultsList}
        </div>
    `;
}

// Event listener for search input
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const query = e.target.value.trim();
            if (query.length >= 2) {
                const results = processSearchInput(query);
                displaySearchResults(results);
            } else {
                document.querySelector('.search-results').innerHTML = '';
            }
        });
    }
});