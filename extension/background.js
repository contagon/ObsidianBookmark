
chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.executeScript(null, { file: "lib/rangy.js" }, function() {
        chrome.tabs.executeScript(null, { file: "lib/turndown.js" }, function() {
            chrome.tabs.executeScript(tab.ib, {file: 'clip.js'});
        });
    });   

});
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    fetch(request.input, request.init).then(function(response) {
      return response.text().then(function(text) {
        sendResponse([{
          body: text,
          status: response.status,
          statusText: response.statusText,
        }, null]);
      });
    }, function(error) {
      sendResponse([null, error]);
    });
    return true;
  });

var ping = setInterval(()=>{
    checkServer();
},5000)
var state;
var lastState;
function checkServer(){
    fetch("http://localhost:43110/").then(status=>{
        state = 1;
    }).catch(error=>{
        state = 0;
    })

    if(state != lastState){ //network change
    let newPath;
        if(state){
            newPath = "./icons/favicon-128x128.png"
        }else{
            newPath = "./icons/favicon-128x128_error.png"
        }
        chrome.browserAction.setIcon({path:newPath})
    }

    lastState = state;
}
