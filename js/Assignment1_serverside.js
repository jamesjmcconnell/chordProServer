var fs = require('fs');
var song = {};
song.chords = [];
song.lyrics = [];
song.splitLyrics = [];
song.splitChords = [];

function fileRead(nameOfFile, callback) {
  console.log("reading " + nameOfFile);
  song.title = nameOfFile;
  fs.readFile(nameOfFile + ".txt", function(err, data) {

  if(err) throw err; 
  var array = data.toString().split("\n"); 
  //get rid of any return characters
  for(i in array)    
     array[i] = array[i].replace(/(\r\n|\n|\r)/gm,"");

  var chordLine = '';
  var lyricLine = '';

  for(var i=0; i<array.length; i++) { 
     var line = array[i];
     var isReadingChord = false;
     chordLine = '';
     lyricLine = '';
     var chordLength = 0; //length of chord symbol 

   for(var charIndex = 0; charIndex < line.length; charIndex++) {
      var ch = line.charAt(charIndex);
      if(ch === '['){isReadingChord = true; chordLength = 0;}
      if(ch === ']'){isReadingChord = false;}
      if(!isReadingChord && ch != ']'){
           lyricLine = lyricLine + ch;
         if(chordLength > 0) chordLength--;
         else chordLine = chordLine + " ";
      }
      if(isReadingChord && ch != '['){
         chordLine = chordLine + ch;
         chordLength++;
      }
   }
   song.lyrics.push(lyricLine);
   song.chords.push(chordLine);
 }
   callback();
})};
 
var peacefulEasyFeeling = {};

var sisterGoldenHair = {};

var brownEyedGirl = {};

var songs = {"Peaceful Easy Feeling" : peacefulEasyFeeling,
             "Sister Golden Hair" : sisterGoldenHair,
             "Brown Eyed Girl" : brownEyedGirl};


//Server Code
var http = require('http'); //need to http
var fs = require('fs'); //need to read static files
var url = require('url');  //to parse url strings

var counter = 1000; //to count invocations of function(req,res)


var ROOT_DIR = 'html'; //dir to serve static files from

var MIME_TYPES = {
    'css': 'text/css',
    'gif': 'image/gif',
    'htm': 'text/html',
    'html': 'text/html',
    'ico': 'image/x-icon',
    'jpeg': 'image/jpeg',
    'jpg': 'image/jpeg',
    'js': 'text/javascript', //should really be application/javascript
    'json': 'application/json',
    'png': 'image/png',
    'txt': 'text/text'
};

var get_mime = function(filename) {
    var ext, type;
    for (ext in MIME_TYPES) {
        type = MIME_TYPES[ext];
        if (filename.indexOf(ext, filename.length - ext.length) !== -1) {
            return type;
        }
    }
    return MIME_TYPES['txt'];
};

http.createServer(function (request,response){
     var urlObj = url.parse(request.url, true, false);
     console.log('\n============================');
     console.log("PATHNAME: " + urlObj.pathname);
     console.log("REQUEST: " + ROOT_DIR + urlObj.pathname);
     console.log("METHOD: " + request.method);
   
     var receivedData = '';

     //attached event handlers to collect the message data
     request.on('data', function(chunk) {
        receivedData += chunk;
     });
   
     //event handler for the end of the message
     request.on('end', function(){
        console.log('received data: ', receivedData);
        console.log('type: ', typeof receivedData);
    
    //if it is a POST request then echo back the data.
    if(request.method == "POST"){
       var dataObj = JSON.parse(receivedData);
           console.log('received data object: ', dataObj);
           console.log('type: ', typeof dataObj);
       

       console.log("USER REQUEST: " + dataObj.text );      
       var returnObj = {};
       returnObj.lyrics = [];

      fileRead(dataObj.text.toString(), function(err) {

        if(err) {
          returnObj.text = 'NOT FOUND: ' + dataObj.text;
          return;
        }
        else {
          returnObj.text = 'FOUND: ' + dataObj.text;


             // var splitLyrics = lyricLine.split(" ");
             // var splitChords = chordLine.split(" ");

             for(var i = 0; i < song.lyrics.length; i++) {
              var s = song.lyrics[i].split(" ");
              for(var j = 0; j < s.length; j++) {
                song.splitLyrics.push(s[j]);
              }
             }

             for(var i = 0; i < song.chords.length; i++) {
              var s = song.chords[i].split(" ");
              for(var j = 0; j < s.length; j++) {
                song.splitChords.push(s[j]);
              }
             }
            }

          returnObj.lyrics = song.splitLyrics;
          returnObj.chords = song.splitChords;


          console.log("Lyrics " + "\n" + returnObj.lyrics + "\n");
          console.log("Chords " + "\n" + returnObj.chords + "\n");

        response.writeHead(200, {'Content-Type': MIME_TYPES["text"]});  
        response.end(JSON.stringify(returnObj)); //send just the JSON object
        // console.log("returnObj: " + JSON.stringify(returnObj));
      });
      }
     });
   
     if(request.method == "GET"){
   //handle GET requests as static file requests
   var filePath = ROOT_DIR + urlObj.pathname;
   if(urlObj.pathname === '/') filePath = ROOT_DIR + '/index.html';

     fs.readFile(filePath, function(err,data){
       if(err){
      //report error to console
          console.log('ERROR: ' + JSON.stringify(err));
      //respond with not found 404 to client
          response.writeHead(404);
          response.end(JSON.stringify(err));
          return;
         }
         response.writeHead(200, {'Content-Type': get_mime(filePath)});
         response.end(data);
       });
   }


 }).listen(3001);

console.log('Server Running at http://127.0.0.1:3001  CNTL-C to quit');