var isRecording = false;


chrome.runtime.sendMessage({"message": "page_load", "value": {}});


function setIsRecording(recording) {
  console.log('setIsRecording', recording, isRecording);
  isRecording = recording;
}


function logImages(images) {
  // TODO: Work out why this isn't working. For some reason Chrome doesn't want
  // to send an object inside a message
  console.log('logImages', images);
}


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log('message received', request);
    var HANDLER = {
      "toggle_recording": setIsRecording,
      // "log_images": logImages,
    };
    return HANDLER[request.message](request.value);
  }
);


document.addEventListener("click", function(evt) {
  if(!isRecording) {
    console.log('Not recording, so not listening');
    // If we're not recording a prototype, don't listen to events
    // TODO: Is it better to attach / detach the listener when recording is
    // toggled on / off respectively?
    return;
  }

  if(evt.target.tagName === "A") {
    var hotspot = {
      'x1': evt.screenX - 5,
      'x2': evt.screenX + 5,
      'y1': evt.screenY - 5,
      'y2': evt.screenY + 5,
    }
    chrome.runtime.sendMessage({
      "message": "click_event",
      "value": {
        "href": window.location.href,
        "hotspot": hotspot,
      }
    });
    // TODO:
    // - Screenshot entire page -> upload image (or send URL to upload server a la Bob Ross)
    // - Record path of page and image ID to avoid uploading the same page twice
    // - Record x, y -> create hotspot at those coordinates + buffer zone
  }
}, false);
