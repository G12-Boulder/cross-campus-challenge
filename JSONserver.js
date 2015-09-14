// USAGE: node serverJSON.js <port #>
// JSON server, this file is to be run in node only.
// It uses the game logic copy pasta'd from web version unless someone
// decides that the game logic can be modularized
// route something like /api/gamestate?move=#

// if we give different bots a server, they should be able to play against
// eachother with GET requests and query strings

var http = require('http');
var url = require('url');
var firstState = new GameState();
var server = http.createServer(function (req, res) {
  if(req.method != 'GET') {
    res.end("Send me a GET request please.  If you would like to make a move "
        + "please include a query string in the form /api/gamestate?move=#");
  }
  var urlKeys = url.parse(req.url, true);
  var jsonResponse = {};
  var currentState = firstState;
  res.writeHead(200, {'Content-Type':'application/json'});
    if (urlKeys.pathname == '/api/gamestate') {
      if (currentState.playerScore >= 5) {
        currentState.playerHand = [1,2,3,4,5,6,7,8,9,10];
        currentState.computerHand = [1,2,3,4,5,6,7,8,9,10];
        currentState.playerScore = 0;
        currentState.computerScore = 0;
        currentState.playerChoice = -1;
        currentState.computerChoice = -1;
        currentState.lastWinner = 'Player';
      }
      if (currentState.computerScore >= 5) {
        currentState.playerHand = [1,2,3,4,5,6,7,8,9,10];
        currentState.computerHand = [1,2,3,4,5,6,7,8,9,10];
        currentState.playerScore = 0;
        currentState.computerScore = 0;
        currentState.playerChoice = -1;
        currentState.computerChoice = -1;
        currentState.lastWinner = 'Player';
        currentState.lastWinner = "Computer";
      }
      if (urlKeys.query.move != null) {
        currentState.playerChoice = urlKeys.query.move;
        currentState.computerChoice = generateComputerChoice(currentState);
        currentState = play(currentState); // play(currstate) does most state modification.
      }
      jsonResponse.playerHand = currentState.playerHand;
      jsonResponse.computerHand = currentState.computerHand;
      jsonResponse.playerScore = currentState.playerScore;
      jsonResponse.computerScore = currentState.computerScore;
      jsonResponse.playerLastMove = currentState.playerChoice;
      jsonResponse.computerLastMove = currentState.computerChoice;
      jsonResponse.howto = "If you wish to make a move, "
        + "use a query string, in the form /api/gamestate?move=#";
      jsonResponse.lastWinner = currentState.lastWinner;

      res.end(JSON.stringify(jsonResponse));
  }
  else {
    res.writeHead(404);
    res.end("Your request is unknown to this server.");
  }
})

server.listen(Number(process.argv[2]));

function GameState() {  // GameState is the TYPE that all functions operate on
  return {
    playerHand:  [1,2,3,4,5,6,7,8,9,10],
    computerHand:  [1,2,3,4,5,6,7,8,9,10],
    playerScore:  0,
    computerScore:  0,
    playerChoice:  -1,
    computerChoice:  -1,
    lastWinner: ''
  };
  // it either returns a fresh game state, or any current state passed into it!
}

function play(currentState) {
  if (currentState.playerChoice > 0) {
    scoreRound(currentState);
    updateHand(currentState);
  }
  return currentState;
}

// side effects onto currentState
function scoreRound(currentState) { // each result is mutually exclusive
  if (currentState.playerChoice - currentState.computerChoice == 1) {
    currentState.playerScore += 2;
  }
  else if (currentState.playerChoice - currentState.computerChoice == -1) {
    currentState.computerScore += 2;
  }
  else if (currentState.playerChoice < currentState.computerChoice) {
    currentState.playerScore++;
  }
  else if (currentState.playerChoice > currentState.computerChoice) {
    currentState.computerScore++;
  }
  return currentState;
} // ty to whoever wrote the logic for this.


function updateHand(currentState) {
  currentState.playerHand.splice(
      currentState.playerHand.indexOf(Number(currentState.playerChoice)), 1);

  currentState.computerHand.splice(
      currentState.computerHand.indexOf(Number(currentState.computerChoice)), 1);

  return currentState;
}

function generateComputerChoice(currentState) {
  var myLateWeightArray = sortWeightArray(weightArray(currentState), 'ltRatio');
  var myEarlyWeightArray = sortWeightArray(weightArray(currentState), 'gtRatio');
  var randMax = (myLateWeightArray.length > 1) ? 2 : 0;
  if (currentState.computerHand.length == 10) {
    return [6,7,8][randomOf(3)] // aka, 6 7 or 8 randomly
  }
  else if (currentState.playerHand.length > 7) {
    return myLateWeightArray[randomOf(randMax)].numberInComputerHand;
  }
  else {
    return myEarlyWeightArray[randomOf(randMax)].numberInComputerHand;
  }
  function randomOf(max) {
    return Math.floor(Math.random()*max);  // choose between 0 and 2
  }
}

function sortWeightArray(arr, prop) { // wrapper
  //usage example sortWeightArray(weightArray(), ltRatio)
  return arr.sort(function (a,b) {
    return a[prop] - b[prop];
  })
}

function weightArray (currentState) {
  return currentState.computerHand.map(function(element) {
    return {
      numberInComputerHand: element,
      ltRatio: makeRatio(currentState.playerHand, element, isGt),
      gtRatio: makeRatio(currentState.playerHand, element, isLt)
    };
  })
  function isLt(a, b) { // pronounced a is Less than b
    return (a < b);
  }
  function isGt(a, b) {
    return (a > b);
  }
}  // yaaaay closure.  Functions declared in this scope, used in makeRatio.

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
