$(function() {

$(".mask").hide();
$(".update").hide();

var playerMoves = [],
    computerMoves = [],
    playerMovesLeft = [1,2,3,4,5,6,7,8,9,10],
    computerMovesLeft = [1,2,3,4,5,6,7,8,9,10],
    playerPoints = 0,
    computerPoints = 0,
    numberOfGames = 0,
        //Algorithm weight modifiers
    // computerGets2  = the importance of trying to get a going for a move that might give the computer 2 points
    // playerGets2 =  the importance of trying to get prevent the player from getting 2 points
    // playerGets1 = the importance of preventing the player from getting 1 point
    // computerGets1 = the importance of trying to get one point
    computerGets2 = 5,
    playerGets2 = 2,
    playerGets1 = 1,
    computerGets1 = 0;

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
  $(this).addClass("clicked");
 
  var playerNum = $(this).data("user");
  var computerNum = computerLogic();
  var previousCompPoints = computerPoints;
  var $computerSelection = $("[data-comp=" + computerNum + "]");
  
  $computerSelection.addClass("clicked");

  compare(playerNum, computerNum);
  updateMoves(playerMoves, playerMovesLeft, playerNum);
  updateMoves(computerMoves, computerMovesLeft, computerNum);
  // updateScoreboard(playerNum, computerNum);

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

function weights(array1, array2){  //this creates an array of objects for each possible move left
  var output = [];
  for (var i = 0; i < array1.length; i++){
    var temp = {
      number: array1[i],
      win1: 0,
      lose1: 0,
      lose2: false,
      win2: false
    };
    for (var j = 0; j < array2.length; j++){
      if (array2[j] > array1[i] + 1){
        temp.win1++;
      };
      if (array2[j] < array1[i] - 1){
        temp.lose1++;
      };
      if (array2[j] === array1[i] + 1){
        temp.lose2 = true;
        temp.lose1 += 2;
      };
      if (array2[j] === array1[i] - 1){
        temp.win2 = true;
        temp.win1 += 2;
      }
    }
    output.push(temp);
  }
  return output;
}

function computerLogic(){
  var expectedPlayerChoice;
  var computerWeights = weights(computerMovesLeft, playerMovesLeft);
  console.log(computerWeights);
  var playerWeights = weights(playerMovesLeft, computerMovesLeft); //not needed, but can be used if expected player choice becomes more complex
  if (computerMovesLeft.length === 10){  //first move is 10
    return 10;
  };
  if (computerMovesLeft.length === 9){ //second move random choice between 6-9
    return Math.floor(Math.random()*(9-6+1)+6);
  }
  var safeChoice = computerWeights.filter(function(each){
    return each.lose2 === false;
  })
  var aggroChoice = computerWeights.filter(function(each){
    return each.win1 > each.lose1;
  })
  if (playerPoints >= computerPoints && playerPoints > 2){
    console.log("Defensive Mode")
    if (safeChoice.length){  //if there are options that don't risk a -2, pick lowest of those options
      return safeChoice[0].number;
    } else {  //otherwise, assume the player will play the lowest number they have, and figure out the best response 
      expectedPlayerChoice = playerMovesLeft[0];
      if (computerMovesLeft.indexOf(expectedPlayerChoice + 1) > -1){ //play the number directly above it for a +2
        console.log("expected Player choice: " + expectedPlayerChoice);
        return expectedPlayerChoice + 1;
      } else if (playerPoints >= 3){
        return computerMovesLeft[0];
      } else {  //otherwise, ditch the highest number it has
        console.log("expected Player choice: " + expectedPlayerChoice);
        return computerMovesLeft[computerMovesLeft.length - 1];
      }
    }
  } else {
    if (aggroChoice.length){
      console.log(aggroChoice)
      var max = aggroChoice.length > 3 ? 3 : aggroChoice.length - 1;
      var index = Math.floor(Math.random() * max)
      return aggroChoice[index].number;
    } else {
      expectedPlayerChoice = playerMovesLeft[0];
      if (computerMovesLeft.indexOf(expectedPlayerChoice + 1) > -1){ //play the number directly above it for a +2
        return expectedPlayerChoice + 1;
      } else if (playerPoints >= 3){
        return computerMovesLeft[0];
      } else {  //otherwise, ditch the highest number it has
        return computerMovesLeft[computerMovesLeft.length - 1];
      }
    }
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

$(".user-selection").hover(function() {
  $(this).toggleClass("hover");
});


});












