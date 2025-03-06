document.addEventListener('DOMContentLoaded', function () {
    // Load saved settings
    chrome.storage.sync.get({
        convertAll: true,
        showOriginal: true
    }, function (items) {
        document.getElementById('convertAll').checked = items.convertAll;
        document.getElementById('showOriginal').checked = items.showOriginal;
    });

    // Save settings when changed
    document.getElementById('convertAll').addEventListener('change', function () {
        chrome.storage.sync.set({
            convertAll: this.checked
        });
        // Notify content script to update
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                action: "updateSettings",
                convertAll: document.getElementById('convertAll').checked,
                showOriginal: document.getElementById('showOriginal').checked
            });
        });
    });

    document.getElementById('showOriginal').addEventListener('change', function () {
        chrome.storage.sync.set({
            showOriginal: this.checked
        });
        // Notify content script to update
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                action: "updateSettings",
                convertAll: document.getElementById('convertAll').checked,
                showOriginal: document.getElementById('showOriginal').checked
            });
        });
    });
});
