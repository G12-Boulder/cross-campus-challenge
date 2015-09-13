var isNode = new Function("try {return this===global;}catch(e){return false;}")();
var isBrowser = new Function("try {return this===window;}catch(e){return false;}")();

if (isNode) {
  var readlineSync = require('readline-sync');
}
var playerMovesLeft = [1,2,3,4,5,6,7,8,9,10],
    computerMovesLeft = [1,2,3,4,5,6,7,8,9,10],
    playerScore = 0,
    computerScore = 0,
    pointsToWin = 5,

    //Algorithm weight modifiers
    computerGets2 = 5,
    playerGets2 = 2,
    playerGets1 = 1,
    computerGets1 = 0;


function play(){
  var playerNum = brettsComputerLogic();
  var computerNum = andrewsComputerLogic();
  compare(playerNum, computerNum);
  updateMoves(playerMovesLeft, playerNum);
  updateMoves(computerMovesLeft, computerNum);
  printScoreboard(playerNum, computerNum);
  if (playerScore >= pointsToWin || computerScore >= pointsToWin || playerMovesLeft.length === 0){
    gameOver();
    return;
  }
  play();
}

function updateMoves(movesLeft, chosenNumber){
  movesLeft.splice(movesLeft.indexOf(chosenNumber), 1);
}

function chooseANumber(){
  var playerNum = 0;
  while(playerMovesLeft.indexOf(playerNum) == -1)  {
    if (isNode) {
      playerNum = Number(readlineSync.question("Pick a number that isn't one of the following: "
          + previousMoves(playerMovesLeft) + "\n"
          + "Your current score is "
          + playerScore + "\n"
          + "The computer's current score is "
          + computerScore + "\n"));
    }
    else if (isBrowser) {
      playerNum = Number(prompt('Pick a number, bitch\n'
            + 'other than'
            + previousMoves(playerMovesLeft) + "\n"
            + 'Your current score is '
            + playerScore
            + '\nThe computer\'s current score is '
            + computerScore));
    }
  }
  return playerNum;
}


function compare(playerNum, computerNum){
  console.log('-------------------------------------------------------')
  if (playerNum - computerNum == 1){
    playerScore += 2;
    console.log('Player received 2 points.  Total points: ' + playerScore);
  }
  else if (computerNum - playerNum == 1){
    computerScore += 2;
    console.log('Computer received 2 points. Total points: ' + computerScore);
  }
  else if (playerNum < computerNum){
    playerScore++;
    console.log('Player received 1 point.  Total points: ' + playerScore);
  }
  else if (computerNum < playerNum){
    computerScore++;
    console.log('Computer received 1 point. Total points: ' + computerScore);
  }
  else {
    console.log('It\'s a tie');
  }
}

// function computerLogic(){
//   if (computerMoves.length === 0){
//     return 10;
//   };
//   if (playerScore - computerScore < 2){ //defensive strategy
//     if (computerMovesLeft.indexOf(playerMoves[playerMoves.length - 1] - 1) > -1){
//       return playerMoves[playerMoves.length - 1] - 1;
//     } else {
//       return computerMovesLeft[computerMovesLeft.length - 1];
//     }
//   } else { //offensive
//     return computerMovesLeft[0];
//   }
// }

function andrewsComputerLogic(){
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



function brettsComputerLogic(){
  var myLateWeightArray = sortWeightArray(weightArray(), 'ltRatio');
  var myEarlyWeightArray = sortWeightArray(weightArray(), 'gtRatio');
  if (playerMovesLeft.length == 10) {
    return [6,7,8][randomOf()] // aka, 6 7 or 8 randomly
  }
  else if (playerMovesLeft.length > 7) {
    console.log(myLateWeightArray[0]);
    return myLateWeightArray[0].numberInComputerHand;
  }
  else {
    console.log(myEarlyWeightArray[0])
    return myEarlyWeightArray[0].numberInComputerHand;
  }
  function randomOf() {
    return Math.round(Math.random());  // choose between 0 and 1
  }
}

// Sooooo here's some spec:
// the data-structure I've built my functions to return and work with
// is an Object, with 3 fields guaranteed (and others can be added or not)
// { number: numberInHand, ltRatio: (double between 0 and 1),
//   gtRatio: (double between 0 and 1) }
//   where ltRatio is . . .(quantOfOpponentsHandGreaterThanNumber/opponentsHand.length)
//   and gtRatio is . . .(quantOfOpponentsHandLessThanNumber/opponentsHand.length)

function sortWeightArray(arr, prop) {
  //usage example sortWeightArray(weightArray(), ltRatio)
  return arr.sort(function (a,b) {

    // I may include secondary sorting, so if prop = ltRatio, and
    // a[prop] - b[prop] are ==, sort by a[otherprop] - b[otherprop]
    return a[prop] - b[prop];
  })
}

function weightArray () {
  return playerMovesLeft.map(function(element) {
    return {
      numberInComputerHand : element,
      ltRatio: makeRatio(computerMovesLeft, element, isGt),
      gtRatio: makeRatio(computerMovesLeft, element, isLt)
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
  if (playerScore >= pointsToWin){
    console.log('Player wins');
  } else if (computerScore >= pointsToWin) {
    console.log('Computer wins')
  } else if (playerMovesLeft.length === 0) {
    console.log('Tie game.')
  }
  playerScore = 0;
  computerScore = 0;
}

function previousMoves(remainingMoves) {
  // given an array of the remaining moves,
  // returns an array of the moves that have already been made
  function go(movesCollection, counter) {
    if (counter == 11) { return movesCollection; }
    if (remainingMoves.indexOf(counter) == - 1) {
      movesCollection.push(counter);
    }
    return go(movesCollection, ++counter);
  }
  return go([], 1);
}

function printScoreboard(playerNum, computerNum){
  console.log('BrettsAI chose   ' + playerNum + "\t\t"
            + 'AndrewsAI chose ' + computerNum);
  console.log('Availalbe AI 1 moves:   ' + playerMovesLeft);
  console.log('Available AI 2 moves: ' + computerMovesLeft);
  //console.log(weightArray());
}

var playNow = '';
if (isNode) {
  playNow = readlineSync.question('play?').toLowerCase();
} else if(isBrowser) {
  playNow = confirm('Do you want to play?');
}
if (playNow != 'no' || playNow){
  play();
}

