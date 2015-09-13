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
    res.end("Send me a GET request please.  If you would like to make a move "
        + "please include a query string in the form /api/gamestate?move = #");
  }
  var urlKeys = url.parse(req.url, true);
  var jsonResponse = {};
  res.writeHead(200, {'Content-Type':'application/json'});
    if (urlKeys.pathname == '/api/gamestate') {
      console.log(urlKeys);
      if (urlKeys.query.move != null) {
        jsonResponse.move = urlKeys.query.move;
        play(urlKeys.query);
      }
      jsonResponse.playerHand = playerMovesLeft;
      jsonResponse.computerHand = computerMovesLeft;
      jsonResponse.playerScore = playerPoints;
      jsonResponse.computerScore = computerPoints;
      jsonResponse.playerLastMove = playerMoves[playerMoves.length - 1];
      jsonResponse.computerLastMove = computerMoves[playerMoves.length - 1];
      jsonResponse.howto = "If you wish to make a move, "
        + "use a query string, in the form /api/gamestate?move=#";
      jsonResponse.lastWinner = lastWinner;

      res.end(JSON.stringify(jsonResponse));

  }
  else {
    res.writeHead(404);
    res.end("Your request is unknown to this server.");
  }
})

server.listen(Number(process.argv[2]));


// game logic . . . .
//


var playerMoves = [],
    computerMoves = [],
    playerMovesLeft = [1,2,3,4,5,6,7,8,9,10],
    computerMovesLeft = [1,2,3,4,5,6,7,8,9,10],
    playerPoints = 0,
    computerPoints = 0,
    pointsToWin = 5,
    lastWinner = "",

    //Algorithm weight modifiers
    // computerGets2  = the importance of trying to get a going for a move that might give the computer 2 points
    // playerGets2 =  the importance of trying to get prevent the player from getting 2 points
    // playerGets1 = the importance of preventing the player from getting 1 point
    // computerGets1 = the importance of trying to get one point
    computerGets2 = 5,
    playerGets2 = 2,
    playerGets1 = 1,
    computerGets1 = 0;



function play(urlMoveQuery){
  var playerNum = numberChosen(urlMoveQuery);
  var computerNum = computerLogic();
  compare(playerNum, computerNum);
  updateMoves(playerMoves, playerMovesLeft, playerNum);
  updateMoves(computerMoves, computerMovesLeft, computerNum);
  updateScoreboard(playerNum, computerNum);
  if (playerPoints >= pointsToWin || computerPoints >= pointsToWin || playerMovesLeft.length === 0){

    resetGame();
  }
}

function updateMoves(movesSoFar, movesLeft, chosenNumber){
  movesSoFar.push(chosenNumber);
  movesLeft.splice(movesLeft.indexOf(chosenNumber), 1);
}
function numberChosen(urlQuery) {
  return Number(urlQuery.move);
}

function compare(playerNum, computerNum){
  console.log('-------------------------------------------------------')
  if (playerNum - computerNum == 1){
    playerPoints += 2;
    console.log('Player received 2 points.  Total points: ' + playerPoints);
  }
  else if (computerNum - playerNum == 1){
    computerPoints += 2;
    console.log('Computer received 2 points. Total points: ' + computerPoints);
  }
  else if (playerNum < computerNum){
    playerPoints++;
    console.log('Player received 1 point.  Total points: ' + playerPoints);
  }
  else if (computerNum < playerNum){
    computerPoints++;
    console.log('Computer received 1 point. Total points: ' + computerPoints);
  }
  else {
    console.log('It\'s a tie');
  }

}

function computerLogic(){
  console.log(weightArray());
  var moveWeights = [];
  for (var i=0;i<computerMovesLeft.length;i++){
    var thisMove = 0;
    if (playerMovesLeft.indexOf(computerMovesLeft[i] + 1) > -1){
      thisMove -= playerGets2;
    }
    for (var j=0;j<playerMovesLeft.length;j++){
      if (playerMovesLeft[j] < computerMovesLeft[i]){
        playerMovesLeft[j] !== computerMovesLeft[i]-1 ? thisMove -= playerGets1 : thisMove += computerGets2;
      }
      else if (playerMovesLeft[j] > computerMovesLeft[i]){
        thisMove += computerGets1;
      }
    }
    moveWeights.push(thisMove);
  }
  var bestMove = moveWeights.indexOf(Math.max.apply(Math, moveWeights))
  return computerMovesLeft[bestMove];
}

function compare(playerNum, computerNum){
  console.log('-------------------------------------------------------')
  if (playerNum - computerNum == 1){
    playerPoints += 2;
    console.log('Player received 2 points.  Total points: ' + playerPoints);
  }
  else if (computerNum - playerNum == 1){
    computerPoints += 2;
    console.log('Computer received 2 points. Total points: ' + computerPoints);
  }
  else if (playerNum < computerNum){
    playerPoints++;
    console.log('Player received 1 point.  Total points: ' + playerPoints);
  }
  else if (computerNum < playerNum){
    computerPoints++;
    console.log('Computer received 1 point. Total points: ' + computerPoints);
  }
  else {
    console.log('It\'s a tie');
  }
}

// Sooooo here's some spec:
// the data-structure I've built my functions to return and work with
// is an Object, with 3 fields guaranteed (and others can be added or not)
// { number: numberInHand, ltRatio: (double between 0 and 1),
//   gtRatio: (double between 0 and 1) }
//   where ltRatio is . . .(quantOfOpponentsHandGreaterThanNumber/opponentsHand.length)
//   and gtRatio is . . .(quantOfOpponentsHandLessThanNumber/opponentsHand.length)
// anyone else working on the ai algo can use this someone
// might have use for it that I do not yet realize.

function weightArray () {
  return computerMovesLeft.map(function(element) {
    return {
      numberInComputerHand : element,
      ltRatio: makeRatio(playerMovesLeft, element, isGt),
      gtRatio: makeRatio(playerMovesLeft, element, isLt)
    };
  })
}

function makeRatio(opponentArray, number, comparisonFn) {
  // returns the percentage of the numbers lower than the numbers
  // in the oppponentArray as a ratio. comparisonFn is either isLt or isGt.
  function go(array, num, ratioNumer) {
    if (array.length == 0) { return (ratioNumer / opponentArray.length); }

    if (comparisonFn(array[0], num)) { ratioNumer += 1; }
    return go(array.slice(1), num, ratioNumer)
  }
  return go(opponentArray, number, 0);
}
function isLt(a, b) { // pronounced a is Less than b
  return (a < b);
}
function isGt(a, b) {
  return (a > b);
}

function resetGame(){
  if (playerPoints >= pointsToWin){
    lastWinner = "Player";
    console.log('Player wins');
  } else if (computerPoints >= pointsToWin) {
    lastWinner = "Computer";
    console.log('Computer wins')
  } else if (playerMovesLeft.length === 0) {
    lastWinner = "Neither";
    console.log('Tie game.')
  }
  playerMoves = [];
  computerMoves = [];
  playerMovesLeft = [1,2,3,4,5,6,7,8,9,10];
  computerMovesLeft = [1,2,3,4,5,6,7,8,9,10];
  playerPoints = 0;
  computerPoints = 0;
}

function updateScoreboard(playerNum, computerNum){
  console.log('Player chose ' + playerNum);
  console.log('Computer chose ' + computerNum);
  console.log('Player moves so far  ' + playerMoves);
  console.log('Computer moves so far ' + computerMoves);
  console.log('player moves left: ' + playerMovesLeft);
  console.log('computer moves left: ' + computerMovesLeft);
}







