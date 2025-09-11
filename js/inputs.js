document.getElementById('nextBtn').onclick = function() {
    function incrementVerse(verse) {
        // Split by dot, increment last part
        let parts = verse.split('.');
        if (parts.length === 0) return verse;
        let last = parts.pop();
        let num = parseInt(last, 10);
        if (isNaN(num)) return verse;
        parts.push((num + 1).toString());
        return parts.join('.');
    }
    const startInput = document.getElementById('startVerse');
    const endInput = document.getElementById('endVerse');
    startInput.value = incrementVerse(startInput.value.trim());
    endInput.value = incrementVerse(endInput.value.trim());
    document.getElementById('applyBtn').click(); // Trigger apply after updating
};

document.getElementById('prevBtn').onclick = function() {
    function decrementVerse(verse) {
        let parts = verse.split('.');
        if (parts.length === 0) return verse;
        let last = parts.pop();
        let num = parseInt(last, 10);
        if (isNaN(num) || num <= 1) return verse; // Prevent going below 1
        parts.push((num - 1).toString());
        return parts.join('.');
    }
    const startInput = document.getElementById('startVerse');
    const endInput = document.getElementById('endVerse');
    startInput.value = decrementVerse(startInput.value.trim());
    endInput.value = decrementVerse(endInput.value.trim());
    document.getElementById('applyBtn').click(); // Trigger apply after updating
};

document.getElementById('rulesNextBtn').onclick = function() {
    const rulesDropdown = document.getElementById('rulesDropdown');
    // Only advance if not already at the last option
    if (rulesDropdown.selectedIndex < rulesDropdown.options.length - 1) {
        rulesDropdown.selectedIndex += 1;

        // Trigger the change event so any listeners run
        rulesDropdown.dispatchEvent(new Event("change", { bubbles: true }));
    } else {
        const nextBtn = document.getElementById('nextBtn');
        nextBtn.dispatchEvent(new Event("click", { bubbles: true }));        
    }
};

document.getElementById('rulesPrevBtn').onclick = function() {
    const rulesDropdown = document.getElementById('rulesDropdown');
    // Only advance if not already at the last option
    if (rulesDropdown.selectedIndex > 0) {
        rulesDropdown.selectedIndex -= 1;

        // Trigger the change event so any listeners run
        rulesDropdown.dispatchEvent(new Event("change", { bubbles: true }));
    } else {
        const prevBtn = document.getElementById('prevBtn');
        prevBtn.dispatchEvent(new Event("click", { bubbles: true }));
    }
};
