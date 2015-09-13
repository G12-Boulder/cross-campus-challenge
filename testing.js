
var computerMovesLeft = [1,2,4,5];
var playerMovesLeft = [1,7,4,10];

function computerLogic(){
  myLateWeightArray = sortWeightArray(weightArray(), 'ltRatio');
  myEarlyWeightArray = sortWeightArray(weightArray(), 'gtRatio');

  return myEarlyWeightArray;
}
console.log(computerLogic());
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
    return a[prop] - b[prop];
  })
}

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



function GameState() {
  return {
    myObject: "My object prop",
    theOtherObj: "The other object"
  }
}

myGS = GameState();
console.log(myGS);


