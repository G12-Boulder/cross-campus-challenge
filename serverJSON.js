// USAGE: node serverJSON.js <port #>
// JSON server, this file is to be run in node only.
// It uses the game logic copy pasta'd from web version unless someone
// decides that the game logic can be modularized
// routes will be something like /api/chooseNumber
// and /api/currentGameState
//
// if we give different bots a server, they should be able to play against
// eachother with requests.

var http = require('http');
var url = require('url');

var server = http.createServer(function (req, res) {
  if(req.method == 'GET'){ }
  if (req.method == 'POST') { }
  res.writeHead(200, {'Content-Type':'application/json'});
  var urlKeys = url.parse(req.url, true);
  // so I want the pathname of /api/gameState
  // and query of {iso: 'string to be split'}
  //console.log(urlKeys.query.iso);
  // and also to respond differently to /api/chooseMove
  var jsonResponse = {};

  if (urlKeys.pathname == '/api/chooseMove') {
    jsonResponse.yourMove =
    //console.log(jsonResponse);
    res.end(JSON.stringify(jsonResponse));
  }
  if (urlKeys.pathname == '/api/unixtime') {
    var tmpDate = new Date(urlKeys.query.iso);
    jsonResponse.unixtime = tmpDate.getTime();
    res.end(JSON.stringify(jsonResponse));
  }
  else {
    res.writeHead(404);
    res.end("Your request is unknown to this server.");
  }
})

server.listen(Number(process.argv[2]));
