var currentTab = -1;
var url = "full qualify url";
var localObj = {};

function getCurrentTab() {
    return new Promise(function (resolve, reject) {
        chrome.tabs.query({
            active: true, // Select active tabs
            lastFocusedWindow: true // In the current window
        }, function (tabs) {
            resolve(tabs[0]);
        });
    });
}
var getRequest = (function () {
    var s = "start";
    return function (text) {
        s += "--;" + text + "--@";
        return s;
    }
})();

function main(tabid) {
    this.tabid = tabid;
    this.getRequestboolvalues = (function (s) {
        return function (text, param) {
            if (param == 'add') {
                s.push(text)
            }
            else if (param == 'remove') {
                (function removearray() {
                    return new Promise(function (resolve, reject) {
                        (function waitForFoo() {
                            if (s.indexOf(text) > -1) return resolve(s.indexOf(text));
                            setTimeout(waitForFoo, 30);
                        })();
                    });
                })().then((res) => s.splice(res, 1));
            }
            return s;
        }
    })([]);
}
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    
   
    if (request.input == "getRequests") {
        sendResponse({
            requestCount: localObj['func' + sender.tab.id].getRequestboolvalues().length
            , keys: sender.tab.id
        });
    }else if (request.input == "getTab") {
        
        sendResponse({
            keys: sender.tab.id
        });
      }  

});

chrome.runtime.onMessageExternal.addListener(function (request, sender, sendResponse) {
    
    if (request.input == "getTab") {
        
        sendResponse({
            keys: sender.tab.id
            
        });

    }else if (request.input == "getRequests") {
        sendResponse({
            requestCount: localObj['func' + sender.tab.id].getRequestboolvalues().length
           
        });
    }
    
});



function updateTabListener(tabId,info,tab){
    if (tab.url == 'data:,' && tab.index == 0 && tab.status == 'complete') {

    currentTab = tab.id;
    localObj['func' + currentTab] = new main(tab.id);
    
    chrome.webRequest.onCompleted.addListener(function (details) {
        
        localObj['func' + currentTab].getRequestboolvalues(JSON.stringify(details.requestId), 'remove');
    }, {
        urls: [url]
        , tabId: currentTab
    }, ["responseHeaders"]);
    chrome.webRequest.onBeforeRequest.addListener(function (details) {
        
        localObj['func' + currentTab].getRequestboolvalues(JSON.stringify(details.requestId), 'add');
        
    }, {
        urls: [url]
        , tabId: currentTab
    }, ["requestBody"]);
       chrome.tabs.onUpdated.removeListener(updateTabListener);
       return;
       
    }
}
chrome.tabs.onUpdated.addListener(updateTabListener);

chrome.tabs.onCreated.addListener(function (tab) {
    currentTab = tab.id;
    localObj['func' + currentTab] = new main(tab.id);
    
    chrome.webRequest.onCompleted.addListener(function (details) {        
        localObj['func' + currentTab].getRequestboolvalues(JSON.stringify(details.requestId), 'remove');
    }, {
        urls: [url]
        , tabId: currentTab
    }, ["responseHeaders"]);
    chrome.webRequest.onBeforeRequest.addListener(function (details) {        
        localObj['func' + currentTab].getRequestboolvalues(JSON.stringify(details.requestId), 'add');        
    }, {
        urls: [url]
        , tabId: currentTab
    }, ["requestBody"]);
});