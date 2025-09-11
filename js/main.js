import { 
    getCurrentVerses,
    getRelevantRules,
    renderMulamLine,
    renderMulamReplaceLine
} from './functions.js';

let gitaText = '';
let rulesList = [];

fetch('gita.csv')
.then(response => response.text())
.then(text => {
    gitaText = text;
    document.getElementById('mulam').textContent = text;
})
.catch(error => {
    document.getElementById('mulam').textContent = 'Error loading gita.csv';
    document.getElementById('mulam').style.display = ''; // Show mulam even for error
});

document.getElementById('mulam').style.display = 'none'; // Hide mulam on initial load


function renderMulam(lines, rule = null) {
    document.getElementById('mulam').innerHTML = lines
        .map(line => renderMulamLine(line, rulesList, rule))
        .join('');
}

function renderMulamReplace(filteredLines, rule) {
    // Show replaced lines in mulamReplace (if replace is present)
    if (rule.replace) {
        document.getElementById('mulamReplace').innerHTML = filteredLines
            .map(line => renderMulamReplaceLine(line, rule))
            .join('');
        document.getElementById('mulamReplace').style.display = ''; // Show mulamReplace
    } else {
        document.getElementById('mulamReplace').innerHTML = "";
        document.getElementById('mulamReplace').style.display = 'none';
    }    
}

function updateRulesDropdown(relevantRules) {
    // Update the dropdown with only relevant rules
    const rulesDropdown = document.getElementById('rulesDropdown');
    rulesDropdown.innerHTML = ''; // Clear previous options
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = '-- Select a rule --';
    rulesDropdown.appendChild(defaultOption);
    relevantRules.forEach(rule => {
        const option = document.createElement('option');
        option.value = rule.id;
        option.textContent = rule.id;
        rulesDropdown.appendChild(option);
    });
}

function rulesDropdownOnChange(rulesDropdown) {
    document.getElementById('ruleNumber').textContent = ''; // Clear rule number display

    updateStyling();


    let currentVerses = getCurrentVerses(gitaText);
    if (currentVerses.length === 0) return;

    const selectedId = rulesDropdown.value;
    if (!selectedId) {
        document.getElementById('ruleExplanation').textContent = ""; // Clear rule explanation
        document.getElementById('applyBtn').click();
        renderMulam(currentVerses);
        document.getElementById('mulamReplace').style.display = 'none';
        return;
    }


    const rule = rulesList.find(r => r.id === selectedId);
    if (!rule || !rule.regex)  {
        renderMulam(currentVerses)
    }

    // Update rule number display
    const ruleNumber = document.getElementById('ruleNumber');
    const index = rulesDropdown.selectedIndex; // selectedIndex is 0-based
    const total = rulesDropdown.options.length - 1;
    ruleNumber.textContent = `${index}/${total}`;    

    // Show rule explanation
    document.getElementById('ruleExplanation').innerHTML = rule.body;

    const regex = new RegExp(rule.regex, 'g');

    var filteredLines = currentVerses;

    if (! document.getElementById('showAllLinesCheckBox').checked) {
        console.log('not checked');
        // Filter lines where the second field matches the regex
        filteredLines = currentVerses.filter(line => {
            const match = line.match(/^(\d+\.\d+\.\d+),([^,]+),([^,]+)$/);
            return match && regex.test(match[2]);
        });
    }

    renderMulam(filteredLines, rule);
    renderMulamReplace(filteredLines, rule);
}

document.getElementById('rulesDropdown').onchange = function() {
    rulesDropdownOnChange(this);
}

document.getElementById('applyBtn').onclick = function() {
    if (!gitaText) return;

    let currentVerses = getCurrentVerses(gitaText);
    let relevantRules = getRelevantRules(rulesList, currentVerses);

    updateRulesDropdown(relevantRules);
    rulesDropdownOnChange(document.getElementById('rulesDropdown'));
    document.getElementById('mulam').style.display = ''; // Show mulam when apply is clicked
    document.getElementById('output').style.display = ''; // Show output when apply is clicked
};


function updateStyling() {
    const transliterate = document.getElementById('transliterateCheckBox').checked;
    if (transliterate) {
        document.getElementById('mulam').classList.remove('skt');
        document.getElementById('mulamReplace').classList.remove('skt');

        document.getElementById('mulam').classList.add('eng');
        document.getElementById('mulamReplace').classList.add('eng');

    } else {
        document.getElementById('mulam').classList.remove('eng');
        document.getElementById('mulamReplace').classList.remove('eng');

        document.getElementById('mulam').classList.add('skt');
        document.getElementById('mulamReplace').classList.add('skt');
    }

    if (document.getElementById('rulesDropdown').selectedIndex == 0) {
        document.getElementById('mulam').classList.remove('output-half');
        document.getElementById('mulam').classList.add('output-full');
    } else {
        document.getElementById('mulam').classList.remove('output-full');
        document.getElementById('mulam').classList.add('output-half');
    }
}

function refreshAll () {
    rulesDropdownOnChange(document.getElementById('rulesDropdown'));
}

document.getElementById('showAllLinesCheckBox').onchange = function() {
    refreshAll();
};

document.getElementById('showRulesInlineCheckBox').onchange = function() {
    refreshAll();
};

document.getElementById('transliterateCheckBox').onchange = function() {
    refreshAll();
};

document.getElementById('showAudioCheckBox').onchange = function() {
    refreshAll();
};

// Populate rules dropdown from rules.json
fetch('rules.json')
.then(response => response.json())
.then(rules => {
    rulesList = rules;
})
.catch(error => {
    document.getElementById('rules').textContent = 'Error loading rules.json';
});
