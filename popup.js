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
    const arabic = document.getElementById('arabic');
    const flipRtl = document.getElementById('flipRtl');
    const indicateScript = document.getElementById('indicateScript');
    const showStats = document.getElementById('showStats');
    const schemeRadios = document.querySelectorAll('input[name="scheme"]');

    // Load saved settings (defaults to true, except stats which defaults to false)
    chrome.storage.sync.get(['bengali', 'devanagari', 'gujarati', 'kannada', 'malayalam', 'odia', 'telugu', 'arabic', 'flipRtl', 'indicateScript', 'showStats', 'scheme'], (result) => {
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
        arabic.checked = result.arabic !== false;
        flipRtl.checked = result.flipRtl !== false;
        indicateScript.checked = result.indicateScript !== false;
        showStats.checked = result.showStats === true;
        const scheme = result.scheme || 'itrans';
        schemeRadios.forEach(r => { r.checked = r.value === scheme; });
    });

    // Save settings and notify tabs
    const updateSettings = () => {
        const scheme = Array.from(schemeRadios).find(r => r.checked)?.value || 'itrans';
        const settings = {
            scheme,
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
            arabic: arabic.checked,
            flipRtl: flipRtl.checked,
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
    arabic.addEventListener('change', updateSettings);
    schemeRadios.forEach(r => r.addEventListener('change', updateSettings));
    flipRtl.addEventListener('change', updateSettings);
    indicateScript.addEventListener('change', updateSettings);
    showStats.addEventListener('change', updateSettings);
});
