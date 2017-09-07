/*
step 0) create a utility function that accepts an array and a function then runs the function on each array value
1) define an elements array (in this case, the array of all dom elements where the class name is 'point')
2) create a style function that changes the css property values of an element to their final post-animation style
3) create a animation function that inputs the elements array and the style function into the utility function
4) call the animation function correctly when the window loads (either when the right amount of scrolling has occured or if the window is 950px high)
*/


var pointsArray = document.getElementsByClassName('point');

function revealPoint(arrayValue) {
  arrayValue.style.opacity = 1;
  arrayValue.style.transform = "scaleX(1) translateY(0)";
  arrayValue.style.msTransform = "scaleX(1) translateY(0)";
  arrayValue.style.WebkitTransform = "scaleX(1) translateY(0)";
}

function animatePoints(array) {
  forEach(array, revealPoint);  // for each value in the array, run the function "revealPoint"
};

window.onload = function() {
  if (window.innerHeight > 950) {
    animatePoints(pointsArray);
  }

  var sellingPoints = document.getElementsByClassName('selling-points')[0];
  var scrollDistance = sellingPoints.getBoundingClientRect().top - window.innerHeight + 200;

  window.addEventListener('scroll', function(event) {
    if (document.documentElement.scrolltop || document.body.scrollTop >= scrollDistance) {
      animatePoints(pointsArray);
    }
  });
}


// on load or during scroll, I'm calling the function 'animatePoints' with the
