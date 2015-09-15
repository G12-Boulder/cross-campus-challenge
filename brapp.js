function computerChoice(ourMovesUsed, theirMovesUsed) {
  var computerMovesLeft = invertMovesArray(ourMovesUsed);
  var playerMovesLeft = invertMovesArray(theirMovesUsed);
  var myLateWeightArray = sortWeightArray(weightArray(), 'ltRatio');
  var myEarlyWeightArray = sortWeightArray(weightArray(), 'gtRatio');
  var randMax = (myLateWeightArray.length > 1) ? 2 : 0;
  //used for making decision less deterministicly vs. humans; tweakable

  if (computerMovesLeft.length == 10) {
    return [6,7,8][randomOf(3)]; // aka, 6 7 or 8 randomly
  }
  else if (playerMovesLeft.length > 7) {
    return myLateWeightArray[randomOf(randMax)].numberInComputerHand;
  }
  else {
    return myEarlyWeightArray[0].numberInComputerHand;
  }
  function randomOf(max) {
    return Math.floor(Math.random()*max);  // choose between 0 and 2
  }

  // Sooooo here's some spec:
  // the data-structure I've built my functions to return and work with
  // is an Object, with 3 fields guaranteed (and others can be added or not)
  // { number: numberInHand, ltRatio: (double between 0 and 1),
  //   gtRatio: (double between 0 and 1) }
  //   where ltRatio is . . .(quantOfOpponentsHandGreaterThanNumber/opponentsHand.length)
  //   and gtRatio is . . .(quantOfOpponentsHandLessThanNumber/opponentsHand.length)
  // anyone else working on the ai algo can use this someone
  // might have use for it that I do not yet realize.

  function sortWeightArray(arr, prop) {
    //usage example sortWeightArray(weightArray(), ltRatio)
    return arr.sort(function (a,b) {

      // I may include secondary sorting, so if prop = ltRatio, and
      // a[prop] - b[prop] are ==, sort by a[otherprop] - b[otherprop]
      return a[prop] - b[prop];
    })
  }

  function weightArray () {
    return computerMovesLeft.map(function(element) {
      return {
        numberInComputerHand: element,
        ltRatio: makeRatio(playerMovesLeft, element, isGt),
        gtRatio: makeRatio(playerMovesLeft, element, isLt)
      };
    })
  }

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

  function invertMovesArray(moves) {
    // given an array of the remaining moves,
    // returns an array of the moves that have already been made
    function go(movesCollection, counter) {
      if (counter == 11) { return movesCollection; }
      if (moves.indexOf(counter) == -1) {
        movesCollection.push(counter);
      }
      return go(movesCollection, ++counter);
    }
    return go([], 1);
  }
}

function getBrappPick() {
  return computerChoice;
}

module.exports = getBrappPick;
