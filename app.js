var playerMoves = [],
    computerMoves = [],
    playerMovesLeft = [1,2,3,4,5,6,7,8,9,10],
    computerMovesLeft = [1,2,3,4,5,6,7,8,9,10],
    playerPoints = 0,
    computerPoints = 0,
    numberOfGames = 0;


function play(){
  var playerNum = chooseANumber();
  var computerNum = computerLogic();
  compare(playerNum, computerNum);
  updateMoves(playerMoves, playerMovesLeft, playerNum);
  updateMoves(computerMoves, computerMovesLeft, computerNum);
  updateScoreboard(playerNum, computerNum);
  if (playerPoints >= 5 || computerPoints >= 5){
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
  var playerNum = Number(prompt('Pick a number, bitch\nNot any of these [' + playerMoves + ']'));
  if (playerMoves.indexOf(playerNum) > -1){
    chooseANumber();
  } 
  else if (playerNum > 10 || playerNum < 1) {
    console.log('Your number is out of range');
    chooseANumber();
  }
    else {
    return playerNum;
  }
}

function compare(playerNum, computerNum){
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
  if (computerMoves.length === 0){
    return 10;
  };
  if (computerMovesLeft.indexOf(playerMoves[playerMoves.length - 1] - 1) > -1){
    return playerMoves[playerMoves.length - 1] - 1;
  } else {
    return computerMovesLeft[computerMovesLeft.length - 1];
  }
}

function gameOver(){
  if (playerPoints >= 5){
    console.log('Player wins');
  }
  if (computerPoints >= 5){
    console.log('Computer wins')
  }
  if (playerMovesLeft.length === 0){
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

var playNow = prompt('Do you want to play?').toLowerCase();
if (playNow == 'yes'){
  play();
}














