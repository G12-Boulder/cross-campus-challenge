var _ = require('underscore');

function metaPick(evaluatedArr, otherArr) {
  var best = randomizeBestPick(evaluatedArr, otherArr);
  evaluatedArr.forEach(function(item) {
    if (item == best + 1) {
      return item;
    }
  });

  evaluatedArr.forEach(function(item) {
    if (item < best - 1) {
      return item;
    }
  });

  return getHighPick(evaluatedArr);
}

function getHighPick(skynet) {
 var high = Math.ceil(skynet.length / 3);
 var highpicks = [];

  if (high === 1) {
    highpicks.push(skynet[skynet.length - 1]);
  } else {
    for (var i = skynet.length; i >= high; i--) {
      highpicks.push(skynet[i]);
    }
  }

  return _.sample(_.compact(highpicks));
}

function randomizeBestPick(array1, array2) {
  var results;
  var bestPick;
  var bestWeight = 100;
  var currentWeight;
  var bestPickArray = [];//array of best picks.
  var randomIndex;
  var selection;

  //for loop gets the lowest weight guess
  for (var i = 0; i < array2.length; ++i) {
    results = prob(array1, array2[i]);
    currentWeight = results[1];
    if (results[2]) {
      ++currentWeight;
    }

    if (currentWeight <= bestWeight) {
      bestWeight = currentWeight;
    }
  }

  //for loop pushes all values that match the lowest weight guess or one more:
  for (var k = 0; k < array2.length; ++k) {
    results = prob(array1, array2[k]);
    currentWeight = results[1];//set current weight to the chanceToLoss number.
    if (results[2]) {//if we can lose 2 points add one to the current weight.
      ++currentWeight;
    }

    if (currentWeight <= bestWeight + 1) {
      bestPickArray.push(array2[k]);
    }
  }

  selection = _.sample(bestPickArray);
  return selection;
}

function getBestPick(array1, array2, player1score) {
  var results;
  var bestPick;
  var bestWeight = 100;
  var currentWeight;
  var win = false;
  for (var i = 0; i < array2.length; ++i) {
    results = prob(array1, array2[i]);
    if (results[1] == 0) {
      win = true;
    }

    currentWeight = results[1];
    if (results[2]) {
      ++currentWeight;
    }

    if (currentWeight < bestWeight) {
      bestWeight = currentWeight;
      bestPick = array2[i];
    }

    //if chances to lose is not 0,or opponent does not have 4 points pick next best number?
  }

  if (player1score < 3 && !win) {
    return getHighPick(array2);
  }

  return bestPick;
}

function skynetComputer(skynetpick, player1pick, skynetscore, player1score) {
  var player1 = makePlayerArray(player1pick);
  var skynet = makePlayerArray(skynetpick);
  var pick;
  if (skynet.length > 9) {
    pick = getRandomPick();
  } else if (skynetscore === 4) {
    pick = getBestPick(player1, skynet, player1score, skynetscore);
  } else if (skynetscore - 3 >= player1score) {
    pick = metaPick(skynet, player1);
  } else {
    pick = randomizeBestPick(player1, skynet);
  }

  return pick;
}

function makePlayerArray(playerPicks) {
  var player = [1,2,3,4,5,6,7,8,9,10];
  player = _.filter(player, function(elem) {
    return !(_.contains(playerPicks, elem));
  })
  return player;
}

function getRandomPick() {
  var randomPickArr = [1,2,3,3,4,4,4,5,5,5,6,6,6,7,7,7,8,8,9,10];
  var randomPick = _.sample(randomPickArr);
  randomPickArr = _.filter(randomPickArr, function(num) {
    return num != randomPick;
  });

  return randomPick;
}

function prob(arr, x) {
  var resultsArr = [];
  var results = 0;
  var chanceToLoss = 0;
  var chanceToWin = 0;
  var twoPointsLost = false;
  var twoPointsWon = false;
  for (var i = 0; i < arr.length; i++) {
    if ((x + 1) === arr[i]) {
      results = results - 2;
      chanceToLoss++;
      twoPointsLost = true;
    } else if (x === (arr[i] + 1)) {
      results = results + 2;
      chanceToWin++;
      twoPointsWon = true;
    } else if (x > arr[i]) {
      results--;
      chanceToLoss++;
    } else {
      results++;
      chanceToWin++;
    }
  }

  resultsArr = [results, chanceToLoss, twoPointsLost, chanceToWin, twoPointsWon];
  return resultsArr;
}

function getSkynetsPick() {
  return skynetComputer;
}

module.exports = getSkynetsPick;
