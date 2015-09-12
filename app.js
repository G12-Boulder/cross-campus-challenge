var isNode=new Function("try {return this===global;}catch(e){return false;}");
var isBrowser=new Function("try {return this===window;}catch(e){ return false;}");

if (isNode) {
  var readlineSync = require('readline-sync');
}
var playerMoves = [],
    computerMoves = [],
    playerMovesLeft = [1,2,3,4,5,6,7,8,9,10],
    computerMovesLeft = [1,2,3,4,5,6,7,8,9,10],
    playerPoints = 0,
    computerPoints = 0,
    pointsToWin = 5,

    //Algorithm weight modifiers
    computerGets2 = 5,
    playerGets2 = 2,
    playerGets1 = 1,
    computerGets1 = 0;



function play(){
  var playerNum = chooseANumber();
  var computerNum = computerLogic();
  compare(playerNum, computerNum);
  updateMoves(playerMoves, playerMovesLeft, playerNum);
  updateMoves(computerMoves, computerMovesLeft, computerNum);
  updateScoreboard(playerNum, computerNum);
  if (playerPoints >= pointsToWin || computerPoints >= pointsToWin || playerMovesLeft.length === 0){
    gameOver();
    return;
  }
  play();
}

function updateMoves(moves, movesLeft, chosenNumber){
  moves.push(chosenNumber);
  movesLeft.splice(movesLeft.indexOf(chosenNumber), 1);
}

function chooseANumber(){
  var playerNum = 0;
  if (isNode) {
    playerNum = Number(readlineSync.question("Pick a number that isn't one of the following: " + playerMoves + "\n"));
  }
  else if (isBrowser) {
    playerNum = Number(prompt('Pick a number, bitch\nYour current score is ' + playerPoints + '\nThe computer\'s current score is ' + computerPoints));
  }
  if (playerNum > 10 || playerNum < 1 || !playerNum || playerMoves.indexOf(playerNum) > -1 || playerNum == undefined) {
    console.log('Your number is out of range');
    chooseANumber();
  } else {
    return playerNum;
  }
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

// function computerLogic(){
//   if (computerMoves.length === 0){
//     return 10;
//   };
//   if (playerPoints - computerPoints < 2){ //defensive strategy
//     if (computerMovesLeft.indexOf(playerMoves[playerMoves.length - 1] - 1) > -1){
//       return playerMoves[playerMoves.length - 1] - 1;
//     } else {
//       return computerMovesLeft[computerMovesLeft.length - 1];
//     }
//   } else { //offensive
//     return computerMovesLeft[0];
//   }
// }

function computerLogic(){
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
      else if (playerMovesLeft[j] > computerMovesLeft[i]) {
        thisMove += computerGets1;
      }
    }
    moveWeights.push(thisMove);
  }
  var bestMove = moveWeights.indexOf(Math.max.apply(Math, moveWeights))
  return computerMovesLeft[bestMove];
}

// Sooooo here's some spec:
// the data-structure I've built my functions to return and work with
// is an Object, with 3 fields guaranteed (and others can be added or not)
// { number: numberInHand, ltRatio: (double between 0 and 1),
//   gtRatio: (double between 0 and 1) }
//   where ltRatio is . . .(quantOfOpponentsHandGreaterThanNumber/opponentsHand.length)
//   and gtRatio is . . .(quantOfOpponentsHandLessThanNumber/opponentsHand.length)

function weightArray () {
  return computerMovesLeft.map(function(element) {
    return {
      numberInComputerHand : element,
      ltRatio: makeRatio(playerMovesLeft, element, isGt),
      gtRatio: makeRatio(playerMovesLeft, element, isLt)
    };
  })
}

//console.log("***TESTING*** Weight Array Changes with each turn?");
//console.log(weightArray());

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



function gameOver(){
  if (playerPoints >= pointsToWin){
    console.log('Player wins');
  } else if (computerPoints >= pointsToWin) {
    console.log('Computer wins')
  } else if (playerMovesLeft.length === 0) {
    console.log('Tie game.')
  }
  playerMoves = [];
  computerMoves = [];
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
  console.log(weightArray());
}

var playNow = '';
if (isNode) {
  playNow = readlineSync.question('Do you want to play?').toLowerCase();
} else if(isBrowser) {
  playNow = confirm('Do you want to play?').toLowerCase();
}
if (playNow == 'yes'){
  play();
}

