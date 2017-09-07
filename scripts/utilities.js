function forEach(array, callbackFunction) {
  for (var i = 0; i < array.length; i++) {
    callbackFunction(array[i]);
  }
}
