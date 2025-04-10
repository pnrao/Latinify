document.addEventListener('DOMContentLoaded', () => {
    const devanagari = document.getElementById('devanagari');
    const kannada = document.getElementById('kannada');
    const telugu = document.getElementById('telugu');

    // Load saved settings (defaults to true)
    chrome.storage.sync.get(['devanagari', 'kannada', 'telugu'], (result) => {
        devanagari.checked = result.devanagari !== false;
        kannada.checked = result.kannada !== false;
        telugu.checked = result.telugu !== false;
    });

    // Save settings and notify tabs
    devanagari.addEventListener('change', () => {
        chrome.storage.sync.set({ devanagari: devanagari.checked });
        chrome.tabs.query({ active: true }, (tabs) => {
            tabs.forEach(tab => {
                chrome.tabs.sendMessage(tab.id, {
                    type: 'settingsChanged',
                    settings: {
                        devanagari: devanagari.checked,
                        kannada: kannada.checked,
                        telugu: telugu.checked
                    }
                });
            });
        });
    });

    kannada.addEventListener('change', () => {
        chrome.storage.sync.set({ kannada: kannada.checked });
        chrome.tabs.query({ active: true }, (tabs) => {
            tabs.forEach(tab => {
                chrome.tabs.sendMessage(tab.id, {
                    type: 'settingsChanged',
                    settings: {
                        devanagari: devanagari.checked,
                        kannada: kannada.checked,
                        telugu: telugu.checked
                    }
                });
            });
        });
    });

    telugu.addEventListener('change', () => {
        chrome.storage.sync.set({ telugu: telugu.checked });
        chrome.tabs.query({ active: true }, (tabs) => {
            tabs.forEach(tab => {
                chrome.tabs.sendMessage(tab.id, {
                    type: 'settingsChanged',
                    settings: {
                        devanagari: devanagari.checked,
                        kannada: kannada.checked,
                        telugu: telugu.checked
                    }
                });
            });
        });
    });
});
