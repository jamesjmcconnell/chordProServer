var song = {};
song.lyrics = [];
song.chords = [];
var formattedWords = [];
var formattedChords = [];
var words = [];

var movingString = {word: "Moving", 
                    x: 100, 
					y:100, 
					xDirection: 1, //+1 for leftwards, -1 for rightwards
					yDirection: 1, //+1 for downwards, -1 for upwards
					stringWidth: 50, //will be updated when drawn
					stringHeight: 24}; //assumed height based on drawing point size
				
var timer;

var wordBeingMoved;

var deltaX, deltaY; //location where mouse is pressed
var canvas = document.getElementById('canvas1'); //our drawing canvas
var context = canvas.getContext('2d');

function getWordAtLocation(aCanvasX, aCanvasY){
	
	  for(var i=0; i<formattedWords.length; i++){
		 if(Math.abs(formattedWords[i].x - aCanvasX) < 100 && 
		    Math.abs(formattedWords[i].y - aCanvasY) < 20) return formattedWords[i];
	  }
	  return null;
}

/*i was having problems with calling more than one song without restarting the server,
the chords and lyrics were being appended to the ends of their respective arrays
*/
var resetGlobals = function(){
	song.lyrics = [];
	song.chords = [];
	var formattedWords = [];
	var formattedChords = [];
	var words = [];
}

var formatWords = function (lyrics){
	formattedWords = [];
	var currWidth  = 10; // to start a litle off the side
	var currHeight = 50; // to start a little off the top, still under chords
	var prevWidth = 10; // so the first word starts off the side when it += currWidth

	for(var i = 0; i < song.lyrics.length; i++) {
		var formattedWord     = {};
		formattedWord.content = song.lyrics[i];
		formattedWord.type    = "lyric";

		if (currWidth > 1100){ // 1200 is the hardcoded width of the canvas, stop before the end
			currHeight += 50; //go 50 down to start a new line
			currWidth = 0;
			prevWidth = 0;
		}

		if(i > 0) {
			prevWidth = context.measureText(song.lyrics[i-1]).width;
			formattedWord.width = context.measureText(song.lyrics[i]).width;
		}
		else
			formattedWord.x = 10;

		currWidth += (prevWidth + 10);
		formattedWord.x     = currWidth;
		formattedWord.y     = currHeight;
		formattedWords.push(formattedWord);
	}

	
}

var formatChords = function (chords){

	formattedChords = [];
	var currWidth  = 10; // to start a litle off the side
	var currHeight = 25; // to start a little off the top
	var prevWidth = 10;

	for(var i = 0; i < song.chords.length; i++) {
	var formattedChord    = {};
	formattedChord.content = song.chords[i];
	formattedChord.type    = "chord";

	if (currWidth > 1100){ // 1200 is the hardcoded width of the canvas, stop before the end
		currHeight += 50; //go 50 down to start a new line
		currWidth = 10;
		prevWidth = 0;
	}

	if(i > 0) {
		prevWidth = context.measureText(song.chords[i-1]).width;
		formattedChord.width = context.measureText(song.chords[i]).width;
	}
	else
		formattedChord.x = 10;

	currWidth += (prevWidth + 10);
	formattedChord.x     = currWidth;
	formattedChord.y     = currHeight;
	formattedChords.push(formattedChord);
}

}


var drawCanvas = function(){
	
    context.fillStyle = 'white';
    context.fillRect(0,0,canvas.width,canvas.height); //erase canvas
   
    context.font = '20pt Arial';
    context.fillStyle = 'cornflowerblue';
    context.strokeStyle = 'blue';

    for(var i=0; i< formattedWords.length; i++){  //note i declared as var
		    
		var word = formattedWords[i];
		context.fillText(word.content, word.x , word.y);
	    context.strokeText(word.content, word.x , word.y);
		
	}
	for(var i=0; i< formattedChords.length; i++){  //note i declared as var
		    
		var word = formattedChords[i];
		context.fillText(word.content, word.x , word.y);
	    context.strokeText(word.content, word.x , word.y);
		
	}

    movingString.stringWidth = context.measureText(movingString.word).width;
    context.fillText(movingString.word, movingString.x, movingString.y);
}


function handleMouseDown(e){

	var rect = canvas.getBoundingClientRect();
    var canvasX = e.pageX - rect.left; //use jQuery event object pageX and pageY
    var canvasY = e.pageY - rect.top;
	console.log("mouse down:" + canvasX + ", " + canvasY);	
	wordBeingMoved = getWordAtLocation(canvasX, canvasY);
	if(wordBeingMoved != null ){
	   deltaX = wordBeingMoved.x - canvasX; 
	   deltaY = wordBeingMoved.y - canvasY;
	$("#canvas1").mousemove(handleMouseMove);
	$("#canvas1").mouseup(handleMouseUp);
	   
	}
    e.stopPropagation();
    e.preventDefault();
	
	drawCanvas();
	}
	
function handleMouseMove(e){
	
	console.log("mouse move");
	//get mouse location relative to canvas top left
	var rect = canvas.getBoundingClientRect();
    var canvasX = e.pageX - rect.left;
    var canvasY = e.pageY - rect.top;
	wordBeingMoved.x = canvasX + deltaX;
	wordBeingMoved.y = canvasY + deltaY;
	e.stopPropagation();
	drawCanvas();
	}
	
function handleMouseUp(e){
	console.log("mouse up");
  		
	e.stopPropagation();
	//remove mouse move and mouse up handlers but leave mouse down handler
    $("#canvas1").off("mousemove", handleMouseMove); //remove mouse move handler
    $("#canvas1").off("mouseup", handleMouseUp); //remove mouse up handler
		
	drawCanvas(); //redraw the canvas
	}

function handleTimer(){
	movingString.x = (movingString.x + 5*movingString.xDirection); 
	movingString.y = (movingString.y + 5*movingString.yDirection); 
	
	//keep inbounds of canvas	
	if(movingString.x + movingString.stringWidth > canvas.width) movingString.xDirection = -1;
	if(movingString.x < 0) movingString.xDirection = 1;
	if(movingString.y > canvas.height) movingString.yDirection = -1;
	if(movingString.y - movingString.stringHeight < 0) movingString.yDirection = 1;
	
	drawCanvas()
}

    //KEY CODES
	//should clean up these hard coded key codes
	var ENTER = 13;
	var RIGHT_ARROW = 39;
	var LEFT_ARROW = 37;
	var UP_ARROW = 38;
	var DOWN_ARROW = 40;


function handleKeyDown(e){

	var dXY = 5; //amount to move in both X and Y direction
	if(e.which == UP_ARROW && movingBox.y >= dXY) 
	   movingBox.y -= dXY;  //up arrow
	if(e.which == RIGHT_ARROW && movingBox.x + movingBox.width + dXY <= canvas.width) 
	   movingBox.x += dXY;  //right arrow
	if(e.which == LEFT_ARROW && movingBox.x >= dXY) 
	   movingBox.x -= dXY;  //left arrow
	if(e.which == DOWN_ARROW && movingBox.y + movingBox.height + dXY <= canvas.height) 
	   movingBox.y += dXY;  //down arrow
	
    var keyCode = e.which;
    if(keyCode == UP_ARROW | keyCode == DOWN_ARROW){
       //prevent browser from using these with text input drop downs	
       e.stopPropagation();
       e.preventDefault();
	}

}

function handleKeyUp(e){
	console.log("key UP: " + e.which);
	if(e.which == RIGHT_ARROW | e.which == LEFT_ARROW | e.which == UP_ARROW | e.which == DOWN_ARROW){
	var dataObj = {x: movingBox.x, y: movingBox.y}; 
	//create a JSON string representation of the data object
	var jsonString = JSON.stringify(dataObj);

 t
	$.post("positionData", jsonString, function(data, status){
			// console.log("data: " + data);
			// console.log("typeof: " + typeof responseObj.lyrics = lyrics;data);
			var wayPoint = JSON.parse(data);
			wayPoints.push(wayPoint);
			for(i in wayPoints) console.log(wayPoints[i]);
			});
	}
	
	if(e.which == ENTER){		  
	   handleSubmitButton(); //treat ENTER key like you would a submit
	   $('#userTextField').val(''); //clear the user text field
	}

	e.stopPropagation();console.log
    e.preventDefault();


}

// this function was for before i gave up the update functionality
// function handleUpdateButton () {

// 	var userText = $('#userTextField').val();
// 	console.log("update text: " + userText)

// }

function handleSubmitButton () {
	resetGlobals();
	song.lyrics = [];
	song.chords = [];
    var userText = $('#userTextField').val(); //get text from user text input field
	if(userText && userText != ''){
	   var userRequestObj = {text: userText};
       var userRequestJSON = JSON.stringify(userRequestObj);
	   $('#userTextField').val(''); //clear the user text field

       //alert ("You typed: " + userText);
	   $.post("userText", userRequestJSON, function(data, status){
			var responseObj = JSON.parse(data);
			// console.log(data);
			song.lyrics = responseObj.lyrics;
			song.chords = responseObj.chords;

			formatWords(song.lyrics);
		    formatChords(song.chords);

		    // console.log("formatted words: " + JSON.stringify(formattedWords));
			
			movingString.word = responseObj.text;
			});
	}
							
}


$(document).ready(function(){
	//This is called after the browser has loaded the web page
	
	//add mouse down listener to our canvas object
	$("#canvas1").mousedown(handleMouseDown);
	
	//add key handler for the document as a whole, not separate elements.	
	$(document).keydown(handleKeyDown);
	$(document).keyup(handleKeyUp);
		
	timer = setInterval(handleTimer, 100);
    //timer.clearInterval(); //to stop
	
	drawCanvas();
});

