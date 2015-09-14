$(function() {

$(".mask").hide();
$(".update").hide();

var playerMoves = [],
    computerMoves = [],
    playerMovesLeft = [1,2,3,4,5,6,7,8,9,10],
    computerMovesLeft = [1,2,3,4,5,6,7,8,9,10],
    playerPoints = 0,
    computerPoints = 0,
    numberOfGames = 0;

var smacks = {
  win: [
    "Booo Yahh!",
    "Oh Yeahhhh!",
    "Shouldn't you just quit right now?",
    "You know you can't beat me right?",
    "I'm pretty sure I have more processors than you...",
    "Take It!",
    "You lose compadre!"
  ],
  lose: [
    "Umm that's like your opinion man.",
    "Dude! Not cool.",
    "You are entering a world of pain!",
    "Here comes the pain!",
    "You think you're special?!",
    "I hope you get a papercut!",
    "You think you're better than me?!",   
    "mkdir I_HATE_U"  ]
}

$(".user-selection").on("click", function() {
  $(".update").show();
  $(".scoreboard").show();
  $(this).addClass("clicked");
 
  var playerNum = $(this).data("user");
  var computerNum = computerLogic();
  var previousCompPoints = computerPoints;
  var $computerSelection = $("[data-comp=" + computerNum + "]");
  
  $computerSelection.addClass("clicked");

  compare(playerNum, computerNum);
  updateMoves(playerMoves, playerMovesLeft, playerNum);
  updateMoves(computerMoves, computerMovesLeft, computerNum);
  updateScoreboard(playerNum, computerNum);

  $(".comp-score").html(computerPoints);
  $(".user-score").html(playerPoints);
  
  if (playerPoints >= 5 || computerPoints >= 5){
    gameOver();
    return;
  }
  var computerWin = computerPoints > previousCompPoints;
  $('.comp-icon').qtip({
    content: smackTalk(computerWin),
    show: {
        effect: function() {
            $(this).fadeTo(500, 1);
        }
    },
    hide: false,
    show: true,
    position: {
      my: 'top left',  // Position my top left...
      at: 'bottom left', // at the bottom right of...
      target: $('.comp-icon') // my target
    },
    style: {
      width: 185,
      classes: 'qtip-bootstrap'
    }
  });
});

function smackTalk(win){
  var talk = win ? 'win' : 'lose';
  var statements = smacks[talk];
  var index = Math.floor(Math.random() * (statements.length - 0 + 1)) + 0;
  var statement = statements[index];
  return statement;
}


function updateMoves(moves, movesLeft, chosenNumber){
  moves.push(chosenNumber);
  movesLeft.splice(movesLeft.indexOf(chosenNumber), 1);
}



function compare(playerNum, computerNum){

  if (playerNum - computerNum == 1){
    playerPoints += 2;
    $(".announcements").prepend('<p>Challenger chose ' + playerNum + ' and computer chose ' + computerNum + '. Challenger received 2 points.</p>');
  }
  else if (computerNum - playerNum == 1){
    computerPoints += 2;
    $(".announcements").prepend('<p>Challenger chose ' + playerNum + ' and computer chose ' + computerNum + '. Computer received 2 points.</p>');
  }
  else if (playerNum < computerNum){
    playerPoints++;
    $(".announcements").prepend('<p>Challenger chose ' + playerNum + ' and computer chose ' + computerNum + '. Challenger received 1 point.</p>');
  }
  else if (computerNum < playerNum){
    computerPoints++;
    $(".announcements").prepend('<p>Challenger chose ' + playerNum + ' and computer chose ' + computerNum + '. Computer received 1 point.</p>');
  }
  else {
    $(".announcements").prepend('<p>It\'s a tie; no points awarded</p>');
  }
  
}

function computerLogic(){
  if (computerMoves.length === 0){
    return 10;
  };
  if (playerPoints - computerPoints < 2){ //defensive strategy
    if (computerMovesLeft.indexOf(playerMoves[playerMoves.length - 1] - 1) > -1){
      return playerMoves[playerMoves.length - 1] - 1;
    } else {
      return computerMovesLeft[computerMovesLeft.length - 1];
    }
  } else { //offensive
    return computerMovesLeft[0];
  }   
}

function gameOver(){
  if (playerPoints >= 5){
    $(".restart").prepend('<h3>Challenger wins</h3>');
    $(".mask").fadeIn("slow");
  }
  if (computerPoints >= 5){
    $(".restart").prepend('<h3>Computer wins, of course</h3>');
    $(".mask").fadeIn("slow");
  }
  if (playerMovesLeft.length === 0){
    $(".restart").prepend('<h3>Tie game...</h3>');
    $(".mask").fadeIn("slow");
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


$(".user-selection").hover(function() {
  $(this).toggleClass("hover");
});


});












