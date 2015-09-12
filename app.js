var playerMoves = [],
    computerMoves = [],
    playerMovesLeft = [1,2,3,4,5,6,7,8,9,10],
    computerMovesLeft = [1,2,3,4,5,6,7,8,9,10],
    playerPoints = 0,
    computerPoints = 0,
    pointsToWin = 5,
    
    //Algorithm weight modifiers
    computerBoost = 5,
    playerBoost = 2,
    numbersLessThanComputerMove = 1,
    numbersMoreThanComputerMove = 0;



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
  var playerNum = Number(prompt('Pick a number, bitch\nYour current score is ' + playerPoints + '\nThe computer\'s current score is ' + computerPoints));
  if (playerMoves.indexOf(playerNum) > -1){
    chooseANumber();
  } 
  else if (playerNum > 10 || playerNum < 1 || !playerNum) {
    console.log('Your number is out of range');
    chooseANumber();
  }
    else {
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
    console.log('ran ' + i + ' times')
    var thisMove = 0;
    if (playerMovesLeft.indexOf(computerMovesLeft[i] + 1) > -1){
      thisMove -= playerBoost;
    }
    for (var j=0;j<playerMovesLeft.length;j++){
      if (playerMovesLeft[j] < computerMovesLeft[i]){
        playerMovesLeft[j] !== computerMovesLeft[i]-1 ? thisMove -= numbersLessThanComputerMove : thisMove += computerBoost;
      } 
      else if (playerMovesLeft[j] > computerMovesLeft[i]){
        thisMove += numbersMoreThanComputerMove;
      }
    }
    moveWeights.push(thisMove);
  }
  var bestMove = moveWeights.indexOf(Math.max.apply(Math, moveWeights))
  return computerMovesLeft[bestMove];
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
  console.log('Player moves so far  ' + playerMoves);
  console.log('Computer chose ' + computerNum);
  console.log('Computer moves so far ' + computerMoves);
  console.log('player moves left: ' + playerMovesLeft);
  console.log('computerMovesLeft: ' + computerMovesLeft);
}

var playNow = confirm('Are you ready to play?');
if (playNow == true){
  play();
}














