var isRecording = false;
var images = [];


// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
  // Record the state change
  isRecording = !isRecording;

  if (isRecording) {
    // Reset images list
    images = [];
  } else {
    console.log('Stopping recording', images);
  }

  // Send a message to the active tab
  sendToggleRecordingMessage();
});


function sendToggleRecordingMessage() {
  sendMessage("toggle_recording", isRecording);
}


function sendLogImages() {
  console.log('sendLogImages', images);
  sendMessage("log_images", images);
}


function sendMessage(messageName, value) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    if (typeof activeTab === "undefined") {
      // Only send a message if there's an active tab to listen to it
      return;
    }

    chrome.tabs.sendMessage(
      activeTab.id,
      {
        "message": messageName,
        "value": value,
      }
    );
  });
}


function handleClick(data) {
  var href = data.href;
  var hotspot = data.hotspot;

  try {
    console.log('Creating new record for', href);
    images[href] = [hotspot];
  } catch(err) {
    console.log('Adding hotspot to', href);
    images[href].push(hotspot);
  }
}


function handlePageLoad(data) {
  sendToggleRecordingMessage();
}


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log('message received', request);
    var HANDLER = {
      "click_event": handleClick,
      "page_load": handlePageLoad,
    };
    return HANDLER[request.message](request.value);
  }
);
