var algo1 = require(process.argv[2])();
var algo2 = require(process.argv[3])();

var iterations = 1000;
var wins1 = 0;
var wins2 = 0;
var ties = 0;
var score1 = 0;
var score2 = 0;
var roundCounter = 0;
var algo1Used = [];
var algo2Used = [];

function computeScore(answer1, answer2) {
  if (answer1 + 1 === answer2) {
    score1 += 2;
  } else if (answer2 + 1 === answer1) {
    score2 += 2;
  } else if (answer1 < answer2) {
    score1++;
  } else if (answer1 > answer2) {
    score2++;
  }
}

function resetBoard() {
  score1 = 0;
  score2 = 0;
  roundCounter = 0;
  algo1Used = [];
  algo2Used = [];
}

function calculateWinner() {
  if (score1 > score2) {
    wins1++;
    //console.log('Algorithm 1 wins!');
  } else if (score2 > score1) {
    wins2++;
    //console.log('Algorithm 2 wins!');
  } else {
    ties++;
    //console.log('Tie!');
  }
}

for (var i = 0; i < iterations; i++) {
  while (score1 < 5 && score2 < 5 && roundCounter < 10) {
    var answer1 = algo1(algo1Used, algo2Used, score1, score2);
    var answer2 = algo2(algo2Used, algo1Used, score2, score1);
    algo1Used.push(answer1);
    algo2Used.push(answer2);
    computeScore(answer1, answer2);
    roundCounter++;
  }
  calculateWinner();
  resetBoard();
}

console.log('Wins for algorithm 1: ' + wins1);
console.log('Wins for algorithm 2: ' + wins2);
console.log('Ties: ' + ties);

