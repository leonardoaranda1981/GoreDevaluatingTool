

//console.log("ejercicio 1");



const URL = chrome.runtime.getURL("model");
  // Model URL
//let imageModelURL = './my_model/';
let model, webcam, labelContainer, maxPredictions;
var docH = document.documentElement.scrollHeight;
var contImg = 0; 

window.addEventListener("scroll", function(o) {
	let nH = document.documentElement.scrollHeight;
     
    if(nH > docH){
    	docH = nH; 
    	scrapImages();
    }
});

init();
/*
let imgs = document.getElementsByTagName('img');
for (imgElt of imgs){
	console.log(imgElt.src);
	//imgElt.src  = url;

}*/



 async function init() {
        const modelURL =  chrome.runtime.getURL("model/model.json");
        const metadataURL =  chrome.runtime.getURL("model/metadata.json");;

        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
        scrapImages();
            
 }

async function scrapImages(){
	let imgs = document.getElementsByTagName('img');
	for (i = contImg; i<imgs.length; i++){
			//console.log(imgElt.src);
			//imgElt.src  = url;
		await loadImage(imgs[i]);
	} 
	contImg = imgs.length;
}

/*
async function loop() {
       // webcam.update(); // update the webcam frame
        //await predict();
        //window.requestAnimationFrame(loop);
}	
*/
 async function loadImage(ele) {
      		//console.log(ele);
            //console.log("image loaded:"+imgLoaded(ele));
    if(imgLoaded(ele) == true){
        ele.setAttribute('crossOrigin', 'anonymous');
        
              // predict can take in an image, video or canvas html element
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = function(){predict(this, ele);}
        img.src = ele.src;  
    }
        	
}
async function predict(img, ele) {
	if(imgLoaded(img)==true){
        var idEtiqueta = 0; 
        var maxVal = 0; 
        const prediction = await model.predict(img);
        for (let i = 0; i < maxPredictions; i++) {
            var pred = prediction[i].probability.toFixed(2); 
            if(pred > maxVal){
                maxVal = pred; 
                idEtiqueta = i; 
            }       
                    //ele.childNodes[i].innerHTML = classPrediction;
        }
     	//const classPrediction = img.src+": "+prediction[idEtiqueta].className + ": " + maxVal;
        //console.log(classPrediction);
        if (maxVal > .7){
            const classPrediction = img.src+": "+prediction[idEtiqueta].className + ": " + maxVal;
           // console.log(classPrediction);
            replaceImage(idEtiqueta, ele);
        }
    }
}
function replaceImage(id, ele){
    var nImagen = chrome.runtime.getURL('remplazo/'+ id+'.jpg');;
    ele.src = nImagen; 
}
function imgLoaded(imgElement) {
    return imgElement.complete && imgElement.naturalHeight !== 0;
}


/* P5js
function preload() {
    classifier = ml5.imageClassifier(imageModelURL + 'model.json');
 }


function classifyVideo() {
    flippedVideo = ml5.flipImage(video)
    classifier.classify(flippedVideo, gotResult);
  }

  // When we get a result
 function gotResult(error, results) {
    // If there is an error
    if (error) {
      console.error(error);
      return;
    }
    // The results are in an array ordered by confidence.
    // console.log(results[0]);
    label = results[0].label;
    // Classifiy again!
    classifyVideo();
  }

*/

/*
chrome.runtime.onInstalled.addListener(function() {   
	chrome.storage.sync.set({color: '#3aa757'}, function() {
      console.log("The color is green.");
    });
	chrome.webNavigation.onCompleted.addListener(function() {
		console.log("Página cargada");
		tab = chrome.tabs.getCurrent();
		chrome.tabs.executeScript(tab.id,{file:"encuentrImagenes.js"});
	});

});

chrome.runtime.onMessage.addListener(function(message){
  //In case you want to do other things too this is a simple way to handle it
  
    message.images.forEach(function(v){
      allImages.push(v);
    });
    alert(allImages[0]);
  
});*/