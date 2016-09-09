
document.addEventListener('send', function () {
    chrome.runtime.sendMessage({
        input: "getRequests"
    }, function (response) {        
        localStorage.setItem(response.keys, response.requestCount);
    });
});
