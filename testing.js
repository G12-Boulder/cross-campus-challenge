function probabilityOfLowerThan(opponentArray, number) {
  function go(array, num, probability) {
    if (array.length == 0) { return (probability / opponentArray.length); }

    if (array[0] < num) { probability += 1; }
    return go(array.slice(1), num, probability)
  }
  return go(opponentArray, number, 0);
};

//console.log(probabilityOfLowerThan([1,2,7,9], 4)); // 0.5
//console.log(probabilityOfLowerThan([3,5,1,8], 4)); // 0.5


