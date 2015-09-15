function computerLogic(computerMovesUsed, playerMovesUsed, computerPoints, playerPoints){
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
  function remainingMoves(usedMoves) {
   // given an array of the remaining moves,
   // returns an array of the moves that have already been made
    function go(movesCollection, counter) {

       if (counter == 11) { return movesCollection; }
       if (usedMoves.indexOf(counter) == -1) {
         movesCollection.push(counter);
       }
       return go(movesCollection, ++counter);
     }
     return go([], 1);
  }
  var computerMovesLeft = remainingMoves(computerMovesUsed);
  var playerMovesLeft = remainingMoves(playerMovesUsed);
  var expectedPlayerChoice;
  var computerWeights = weights(computerMovesLeft, playerMovesLeft);
  var playerWeights = weights(playerMovesLeft, computerMovesLeft); //not needed, but can be used if expected player choice becomes more complex
  if (computerMovesLeft.length === 10){  //first move is 10
    return 10;
  };
  if (computerMovesLeft.length === 9){ //second move random choice between 6-9
    return Math.floor(Math.random()*(9-6+1)+6);
  }
  var aggroChoice = computerWeights.filter(function(each){
    return each.win1 > each.lose1;
  })
  if (aggroChoice.length){
    if (aggroChoice[0].number === 1 && playerMovesLeft.indexOf(2) > -1 && aggroChoice.length > 1){ //it won't choose 1 if the player can choose 2
      aggroChoice.shift();
    }
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

function getComputerLogic() {
  return computerLogic;
}

module.exports = getComputerLogic;
