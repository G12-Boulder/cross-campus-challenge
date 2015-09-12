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
  if ( playerMovesLeft.length = 0 ) {
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
  var playerNum = Number(prompt('Pick a number, bitch\nYour current score is ' + playerPoints + '\nThe computer\'s current score is ' + computerPoints));
<<<<<<< HEAD
  if (playerMoves.indexOf(playerNum) > -1){
    chooseANumber();
  }
  else if (playerNum > 10 || playerNum < 1 || !playerNum) {
=======
  if (playerNum > 10 || playerNum < 1 || !playerNum || playerMoves.indexOf(playerNum) > -1 || playerNum == undefined) {
>>>>>>> 5565c9955b48f68aaa98f07c67b749a7d5bc46a8
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
<<<<<<< HEAD
        playerMovesLeft[j] !== computerMovesLeft[i]-1 ? thisMove -= numbersLessThanComputerMove : thisMove += computerBoost;
      }
=======
        playerMovesLeft[j] !== computerMovesLeft[i]-1 ? thisMove -= playerGets1 : thisMove += computerGets2;
      } 
>>>>>>> 5565c9955b48f68aaa98f07c67b749a7d5bc46a8
      else if (playerMovesLeft[j] > computerMovesLeft[i]){
        thisMove += computerGets1;
      }
    }
  } else { //offensive
    return computerMovesLeft[0];
  }
    moveWeights.push(thisMove);
  }
  var bestMove = moveWeights.indexOf(Math.max.apply(Math, moveWeights))
  return computerMovesLeft[bestMove];
}

// first part, determine which P(x) where P(x) is probability of x occuring.
// In our case, x is the probability of getting a point.
// The way to do that, is to compare each currently available number
// on the computers side, to the availalbe numbers in the opponents "hand"
// So, for example . . .
// If the remaining numbers of the opponent are [1, 4, 7]
// and our computers remaining numbers are [3, 8, 5] . . .
// the possibility of 3 getting a point is 2/3.
// multiplied by (2 out of opponents 3 numbers);  So 2/3.
// The P(X) for 8 is 0, we have 0 chance of 8 being lower than the opponents
// number.  Which does not make it a bad choice while the opponents score
// is below 3...
// the P(X) for 5 is 1/3.  So we should prob. choose 3.

function probabilityOfLowerThan(opponentArray, number) {
  // returns the "random" chance of the number being lower than the numbers
  // in the oppponentArray as a ratio.
  function go(array, num, probability) {
    if (array.length == 0) { return (probability / opponentArray.length); }

    if (array[0] < num) { probability += 1; }
    return go(array.slice(1), num, probability)
  }
  return go(opponentArray, number, 0);
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
}

var playNow = confirm('Are you ready to play?');
if (playNow == true){
  play();
}

