var playerMovesLeft = [1,2,3,4,5,6,7,8,9,10],
    computerMovesLeft = [1,2,3,4,5,6,7,8,9,10],
    playerPoints = 0,
    computerPoints = 0,
    pointsToWin = 5,

    //Algorithm weight modifiers
    // computerGets2  = the importance of trying to get a going for a move that might give the computer 2 points
    // playerGets2 =  the importance of trying to get prevent the player from getting 2 points
    // playerGets1 = the importance of preventing the player from getting 1 point
    // computerGets1 = the importance of trying to get one point
    computerGets2 = 5,
    playerGets2 = 2,
    playerGets1 = 1,
    computerGets1 = 0;

function previousMoves(remainingMoves) {
  // given an array of the remaining moves,
  // returns an array of the moves that have already been made
  function go(movesCollection, counter) {
    if (counter == 11) { return movesCollection; }
    if (remainingMoves.indexOf(counter) == -1) {
      movesCollection.push(counter);
    }
    return go(movesCollection, ++counter);
  }
  return go([], 1);
}


function play(){
  var playerNum = chooseANumber();
  var computerNum = computerLogic();
  compare(playerNum, computerNum);
  updateMoves(playerMovesLeft, playerNum);
  updateMoves(computerMovesLeft, computerNum);
  updateScoreboard(playerNum, computerNum);
  if (playerPoints >= pointsToWin || computerPoints >= pointsToWin || playerMovesLeft.length === 0){
    gameOver();
  }
  play();
}

function updateMoves(movesSoFar, movesLeft, chosenNumber){
  movesLeft.splice(movesLeft.indexOf(chosenNumber), 1);
}

function chooseANumber(){
  var playerNum = Number(prompt('Pick a number, puny human\nYour current score is ' + playerPoints + '\nThe computer\'s current score is ' + computerPoints));

  if (playerMoves.indexOf(playerNum) > -1){
    chooseANumber();
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
  return;
}

function updateScoreboard(playerNum, computerNum){
  console.log('Player chose ' + playerNum);
  console.log('Computer chose ' + computerNum);
  console.log('Player moves so far  ' + previousMoves(playerMovesLeft));
  console.log('Computer moves so far ' + previousMoves(computerMovesLeft));
  console.log('player moves left: ' + playerMovesLeft);
  console.log('computer moves left: ' + computerMovesLeft);
}

var playNow = confirm('Are you ready to play?');
if (playNow == true){
  play();
}

