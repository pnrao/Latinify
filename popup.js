document.addEventListener('DOMContentLoaded', () => {
    const devanagari = document.getElementById('devanagari');
    const gujarati = document.getElementById('gujarati');
    const kannada = document.getElementById('kannada');
    const malayalam = document.getElementById('malayalam');
    const odia = document.getElementById('odia');
    const telugu = document.getElementById('telugu');
    const indicateScript = document.getElementById('indicateScript');
    const showStats = document.getElementById('showStats');

    // Load saved settings (defaults to true, except stats which defaults to false)
    chrome.storage.sync.get(['devanagari', 'gujarati', 'kannada', 'malayalam', 'odia', 'telugu', 'indicateScript', 'showStats'], (result) => {
        devanagari.checked = result.devanagari !== false;
        gujarati.checked = result.gujarati !== false;
        kannada.checked = result.kannada !== false;
        malayalam.checked = result.malayalam !== false;
        odia.checked = result.odia !== false;
        telugu.checked = result.telugu !== false;
        indicateScript.checked = result.indicateScript !== false;
        showStats.checked = result.showStats === true;
    });

    // Save settings and notify tabs
    const updateSettings = () => {
        const settings = {
            devanagari: devanagari.checked,
            gujarati: gujarati.checked,
            kannada: kannada.checked,
            malayalam: malayalam.checked,
            odia: odia.checked,
            telugu: telugu.checked,
            indicateScript: indicateScript.checked,
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
    gujarati.addEventListener('change', updateSettings);
    kannada.addEventListener('change', updateSettings);
    malayalam.addEventListener('change', updateSettings);
    odia.addEventListener('change', updateSettings);
    telugu.addEventListener('change', updateSettings);
    indicateScript.addEventListener('change', updateSettings);
    showStats.addEventListener('change', updateSettings);
});
