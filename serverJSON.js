// USAGE: node serverJSON.js <port #>
// JSON server, this file is to be run in node only.
// It uses the game logic copy pasta'd from web version unless someone
// decides that the game logic can be modularized
// route something like /api/gamestate?move=#

// if we give different bots a server, they should be able to play against
// eachother with GET requests and query strings

var http = require('http');
var url = require('url');

var server = http.createServer(function (req, res) {
  if(req.method != 'GET') {
    res.end("Send me a GET request please.  If you would like to make a move")
  }
  var urlKeys = url.parse(req.url, true);
  var jsonResponse = {};
  res.writeHead(200, {'Content-Type':'application/json'});
    if (urlKeys.pathname == '/api/gamestate') {
      console.log(urlKeys);
      if (urlKeys.query.move != null) {
        jsonResponse.TEST = "move value was " + urlKeys.query.move
          + " Would run play() with it here to generate rest of response"
        //play();
      }
      jsonResponse.playerHand = 'playerhand';
      jsonResponse.computerHand = 'computerhand';
      jsonResponse.playerScore = 'playerscore';
      jsonResponse.computerScore = 'cmputerscore';
      jsonResponse.howto = "If you wish to make a move, "
        + "use a query string, in the form /api/gamestate?move=#";
      res.end(JSON.stringify(jsonResponse));
  }
  else {
    res.writeHead(404);
    res.end("Your request is unknown to this server.");
  }
})

server.listen(Number(process.argv[2]));
