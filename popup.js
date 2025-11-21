document.addEventListener('DOMContentLoaded', () => {
    const devanagari = document.getElementById('devanagari');
    const kannada = document.getElementById('kannada');
    const telugu = document.getElementById('telugu');
    const showSquiggly = document.getElementById('showSquiggly');
    const showStats = document.getElementById('showStats');

    // Load saved settings (defaults to true, except stats which defaults to false)
    chrome.storage.sync.get(['devanagari', 'kannada', 'telugu', 'showSquiggly', 'showStats'], (result) => {
        devanagari.checked = result.devanagari !== false;
        kannada.checked = result.kannada !== false;
        telugu.checked = result.telugu !== false;
        showSquiggly.checked = result.showSquiggly !== false;
        showStats.checked = result.showStats === true;
    });

    // Save settings and notify tabs
    const updateSettings = () => {
        const settings = {
            devanagari: devanagari.checked,
            kannada: kannada.checked,
            telugu: telugu.checked,
            showSquiggly: showSquiggly.checked,
            showStats: showStats.checked
        };

        chrome.storage.sync.set(settings);

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            tabs.forEach(tab => {
                // Use a callback to handle potential errors if the content script isn't loaded
                chrome.tabs.sendMessage(tab.id, {
                    type: 'settingsChanged',
                    settings: settings
                }, (response) => {
                    if (chrome.runtime.lastError) {
                        // Content script might not be loaded on this tab (e.g. chrome:// pages)
                        // We can safely ignore this error
                        console.debug('Could not update settings on tab:', chrome.runtime.lastError.message);
                    }
                });
            });
        });
    };

    devanagari.addEventListener('change', updateSettings);
    kannada.addEventListener('change', updateSettings);
    telugu.addEventListener('change', updateSettings);
    showSquiggly.addEventListener('change', updateSettings);
    showStats.addEventListener('change', updateSettings);
});
