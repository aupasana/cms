import { devToIAST } from './transliterate.js';

export function getCurrentVerses(gitaText) {
    const start = document.getElementById('startVerse').value?.trim() || "12";
    let end = document.getElementById('endVerse').value?.trim() || start;
    if (!gitaText) return;

    const lines = gitaText.split('\n');
    let startIdx = lines.findIndex(line => line.startsWith(start + "."));
    // let endIdx = lines.findIndex(line => line.startsWith(end));
    let endIdx = lines.findLastIndex(line => line.startsWith(end + "."));
    if (startIdx === -1 || endIdx === -1 || startIdx > endIdx) {
        document.getElementById('mulam').textContent = 'Invalid verse range';
        currentVerses = [];
        document.getElementById('mulam').style.display = 'block'; // Show mulam even for error
        return;
    }
    // Only include up to (but not including) endIdx
    let currentVerses = lines.slice(startIdx, endIdx + 1);
    return currentVerses;
}

function transliterateIfNeeded(text) {
    const shouldTransliterate = document.getElementById('transliterateCheckBox').checked;
    if (shouldTransliterate) {
        return devToIAST(text);
    } else {
        return text;
    }
}

function renderMulamLineHighlight(mulam, regexText) {
    if (!regexText) return mulam;
    const regex = new RegExp(regexText, 'g');
    const spanText = mulam.replace(regex, match => `<span style="background: yellow">${match}</span>`);
    return transliterateIfNeeded(spanText);
}

function renderMulamLineHighlightInline(mulam, regexText, rule) {
    if (!regexText) return null;
    const regex = new RegExp(regexText, 'g');

    if (!regex.test(mulam)) return null;
    const replaced = mulam.replace(regex, match => `<span style="background: yellow">${match}</span>`);
    const spanText = `<span class='rule-inline'>${replaced} -- ${rule.id}</span>`;
    return transliterateIfNeeded(spanText);
}


export function renderMulamLine(line, rulesList, rule = null) {
    // Match lines like 5.12.2,<text>,<audio>

    const showsRulesInline = document.getElementById('showRulesInlineCheckBox').checked;

    const match = line.match(/^(\d+\.\d+\.\d+),([^,]+),([^,]+)$/);
    if (match) {
        const verseRef = match[1];
        let text = match[2];
        const audioUrl = match[3];
        if (rule && rule.regex) {
            text = renderMulamLineHighlight(text, rule.regex);
        }

        let inlineTextHighlighted = [];
        let inlineTextHighlightedJoined = '';
        if (showsRulesInline && rulesList) {
            for (const singleRule of rulesList) {
                if (singleRule.regex) {
                    const inlineText = renderMulamLineHighlightInline(text, singleRule.regex, singleRule);
                    if (inlineText != null && inlineText != '') {
                        inlineTextHighlighted.push(inlineText);
                    }
                }
            }

        inlineTextHighlightedJoined = inlineTextHighlighted.length > 0 ? inlineTextHighlighted.join('<br/>') : null;

        }



        // Show audio first, then text, then verseRef
        const showAudio = document.getElementById('showAudioCheckBox').checked;
        let pText = '';
        if (showAudio) {
            pText = `<p><a style="cursor:pointer" onclick="this.firstChild.play()"><audio preload="none" src="${audioUrl}"></audio>🔈</a> ${text} <span class="verse-number">(${verseRef})</span></p>${inlineTextHighlightedJoined}`;
        } else {
            pText = `<p>${text} <span class="verse-number">(${verseRef})</span></p>${inlineTextHighlightedJoined}`;
        }
        return transliterateIfNeeded(pText);

    } else {
        console.log('Error: ill-formated line: ' + line);
    }
}

export function renderMulamReplaceLine(line, rule = null) {
    const match = line.match(/^(\d+\.\d+\.\d+),([^,]+),([^,]+)$/);
    if (match) {
        const verseRef = match[1];
        let text = match[2].replace(rule.regex, rule.replace);
        // Highlight replaced portion
        if (rule.replace) {
            const highlightRegex = new RegExp(rule.replace, 'g');
            text = text.replace(highlightRegex, match => `<span style="background: yellow">${match}</span>`);
        }
        const audioUrl = match[3];

        const showAudio = document.getElementById('showAudioCheckBox').checked;
        if (showAudio) {
            return `<p><a style="cursor:pointer" onclick="this.firstChild.play()"><audio preload="none" src="${audioUrl}"></audio>🔈</a> ${text} <span class="verse-number">(${verseRef})</span></p>`;
        } else {
            return `<p>${text} <span class="verse-number">(${verseRef})</span></p>`;
        }
    } else {
        return `<p>${line}</p>`;
    }
}

export function getRelevantRules(rulesList, currentVerses) {
    const relevantRules = rulesList.filter(rule => {
        if (!rule.regex) return false;
        const regex = new RegExp(rule.regex, 'g');
        // Only match against the second field of each line
        return currentVerses.some(line => {
            const match = line.match(/^(\d+\.\d+\.\d+),([^,]+),([^,]+)$/);
            return match && regex.test(match[2]);
        });
    });

    return relevantRules;
}
