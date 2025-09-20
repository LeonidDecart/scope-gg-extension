// Popup script for Scope.gg Helper extension

document.addEventListener('DOMContentLoaded', function() {
    const statusDiv = document.getElementById('status');
    const openHelperBtn = document.getElementById('openHelper');
    const viewCompilationsBtn = document.getElementById('viewCompilations');
    const newCompilationBtn = document.getElementById('newCompilation');

    // Check if current tab is scope.gg
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const currentTab = tabs[0];
        
        if (currentTab.url && currentTab.url.includes('scope.gg')) {
            statusDiv.textContent = '✅ На scope.gg';
            statusDiv.className = 'status on-scope';
            
            openHelperBtn.disabled = false;
            viewCompilationsBtn.disabled = false;
            newCompilationBtn.disabled = false;
        } else {
            statusDiv.textContent = '❌ Не на scope.gg';
            statusDiv.className = 'status not-on-scope';
            
            openHelperBtn.disabled = true;
            viewCompilationsBtn.disabled = true;
            newCompilationBtn.disabled = true;
        }
    });

    // Open helper button
    openHelperBtn.addEventListener('click', function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {action: 'showMainReport'});
            window.close();
        });
    });

    // View compilations button
    viewCompilationsBtn.addEventListener('click', function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {action: 'showMainReport'});
            window.close();
        });
    });

    // New compilation button
    newCompilationBtn.addEventListener('click', function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {action: 'startNewCompilation'});
            window.close();
        });
    });
});
