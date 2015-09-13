var computerMovesLeft = [1,2,8,4,5];
var playerMovesLeft = [1,2,7,4,10];
var weightArray = computerMovesLeft.map(function(element) {
  return {
    numberInComputerHand : element,
    ltRatio: makeRatio(playerMovesLeft, element, isLt),
    gtRatio: makeRatio(playerMovesLeft, element, isGt)
  };
})

console.log("**TESTING** current weight array:", weightArray);
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
