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
