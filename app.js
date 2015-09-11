var playerMoves = [],
    computerMoves = [],
    playerPoints = 0,
    computerPoints = 0,
    numberOfGames = 0;


function play(){
  var playerNum = chooseANumber();
  var computerNum = computerLogic();
  compare(playerNum, computerNum);
  playerMoves.push(playerNum);
  computerMoves.push(computerNum);
  updateScoreboard(playerNum, computerNum);
  if (playerPoints >= 5 || computerPoints >= 5){
    gameOver();
    return;
  }
  play();
}

function chooseANumber(){
  var playerNum = Number(prompt('Pick a number, bitch\nNot any of these [' + playerMoves + ']'));
  if (playerMoves.indexOf(playerNum) > -1){
    chooseANumber();
  } else {
    return playerNum;
  }
}

function compare(playerNum, computerNum){
  if (playerNum - computerNum == 1){
    playerPoints += 2;
    console.log('Player recieved 2 points');
  }
  else if (computerNum - playerNum == 1){
    computerPoints += 2;
    console.log('Computer recieved 2 points');
  }
  else if (playerNum < computerNum){
    playerPoints++;
    console.log('Player recieved 1 point');
  }
  else if (computerNum < playerNum){
    computerPoints++;
    console.log('Computer recieved 1 point');
  }
  else {
    console.log('It\'s a tie');
  }
  
}

function computerLogic(){
  function randomize() {
    var random = (Math.ceil(Math.random() * 9));
    if (computerMoves.indexOf(random) > -1){
      return randomize();
    } else { 
      return random;
    }
  }
  return randomize();
}

function gameOver(){
  if (playerPoints >= 5){
    console.log('Player wins');
  }
  if (computerPoints >= 5){
    console.log('Computer wins')
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
}

var playNow = prompt('Do you want to play?').toLowerCase();
if (playNow == 'yes'){
  play();
}














