(function($) {
$(function() {

  $('ul.tabs_menu').on('click', 'li:not(.active)', function() {
    $(this)
      .addClass('active').siblings().removeClass('active')    .closest('div.tabs').find('div.tabs_content').removeClass('active').eq($(this).index()).addClass('active');
 $('div.tabs_content').css({opacity:"0"}).animate({opacity:"1"}, 2000);
      return false;
  });
});
 
  $(function(){
    $("input").hover(function() {
        $(this).next(".mess").animate({opacity: "1"}, 1000);
    }, function() {
        $(this).next(".mess").animate({opacity: "0"}, 800);
    });
});
    $(function(){
        $(".btn_show_help").on("click", function(){
            $(".mess").animate({opacity: "1"}, 1000);
            
    });
        });

})(jQuery);