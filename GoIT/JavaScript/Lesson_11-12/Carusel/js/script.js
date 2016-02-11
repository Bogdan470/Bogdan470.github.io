$(document).ready(function() {
    var leftUIEl = $('.carousel-arrow-left');
    var rightUIEl = $('.carousel-arrow-right');
  var elementsList = $('.carousel-list');
     var pixelsOffset = 300;
    var currentLeftValue = 0;
    var elementsCount = elementsList.find('li').length;
    var minimumOffset = - ((elementsCount - 3) * pixelsOffset);
    var maximumOffset = 0;
    leftUIEl.click(function() {
        if (currentLeftValue != maximumOffset){
        currentLeftValue += 300;
        elementsList.animate({ left : currentLeftValue + "px"}, 2800, 'easeInOutQuart');
            }
    });
 
    rightUIEl.click(function() {
        if (currentLeftValue != minimumOffset){
        currentLeftValue -= 300;
        elementsList.animate({ left : currentLeftValue + "px"}, 2800, 'easeInOutQuart');
            }
    });
 
});