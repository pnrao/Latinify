document.addEventListener('DOMContentLoaded', () => {
    const bengali = document.getElementById('bengali');
    const devanagari = document.getElementById('devanagari');
    const gujarati = document.getElementById('gujarati');
    const gurmukhi = document.getElementById('gurmukhi');
    const kannada = document.getElementById('kannada');
    const malayalam = document.getElementById('malayalam');
    const odia = document.getElementById('odia');
    const sinhala = document.getElementById('sinhala');
    const tamil = document.getElementById('tamil');
    const telugu = document.getElementById('telugu');
    const indicateScript = document.getElementById('indicateScript');
    const showStats = document.getElementById('showStats');

    // Load saved settings (defaults to true, except stats which defaults to false)
    chrome.storage.sync.get(['bengali', 'devanagari', 'gujarati', 'kannada', 'malayalam', 'odia', 'telugu', 'indicateScript', 'showStats'], (result) => {
        bengali.checked = result.bengali !== false;
        devanagari.checked = result.devanagari !== false;
        gujarati.checked = result.gujarati !== false;
        gurmukhi.checked = result.gurmukhi !== false;
        kannada.checked = result.kannada !== false;
        malayalam.checked = result.malayalam !== false;
        odia.checked = result.odia !== false;
        sinhala.checked = result.sinhala !== false;
        tamil.checked = result.tamil !== false;
        telugu.checked = result.telugu !== false;
        indicateScript.checked = result.indicateScript !== false;
        showStats.checked = result.showStats === true;
    });

    // Save settings and notify tabs
    const updateSettings = () => {
        const settings = {
            bengali: bengali.checked,
            devanagari: devanagari.checked,
            gujarati: gujarati.checked,
            gurmukhi: gurmukhi.checked,
            kannada: kannada.checked,
            malayalam: malayalam.checked,
            odia: odia.checked,
            sinhala: sinhala.checked,
            tamil: tamil.checked,
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

    bengali.addEventListener('change', updateSettings);
    devanagari.addEventListener('change', updateSettings);
    gujarati.addEventListener('change', updateSettings);
    gurmukhi.addEventListener('change', updateSettings);
    kannada.addEventListener('change', updateSettings);
    malayalam.addEventListener('change', updateSettings);
    odia.addEventListener('change', updateSettings);
    sinhala.addEventListener('change', updateSettings);
    tamil.addEventListener('change', updateSettings);
    telugu.addEventListener('change', updateSettings);
    indicateScript.addEventListener('change', updateSettings);
    showStats.addEventListener('change', updateSettings);
});
