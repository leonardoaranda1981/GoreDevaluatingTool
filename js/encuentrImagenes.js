var images = [];
for(var i = 0; i < document.images.length; i++){
  images.push(document.images[i].src);
}
chrome.runtime.sendMessage({method:"downloadImages",images:images});