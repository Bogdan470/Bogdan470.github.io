
// Карусель
(function($) {
    $(function() {
        $('.jcarousel').jcarousel();

        $('.jcarousel-control-prev')
             .on('jcarouselcontrol:active', function() {
                 $(this).removeClass('inactive');
             })
             .on('jcarouselcontrol:inactive', function() {
                 $(this).addClass('inactive');
             })
            .jcarouselControl({
                target: '-=1'
            });

        $('.jcarousel-control-next')
             .on('jcarouselcontrol:active', function() {
                 $(this).removeClass('inactive');
             })
             .on('jcarouselcontrol:inactive', function() {
                 $(this).addClass('inactive');
             })
            .jcarouselControl({
                target: '+=1'
            });

        $('.jcarousel-pagination')
            .on('jcarouselpagination:active', 'a', function() {
                $(this).addClass('active');
            })
            .on('jcarouselpagination:inactive', 'a', function() {
                $(this).removeClass('active');
            })
            .jcarouselPagination({
                'item': function(page, carouselItems) {
                return '<a href="#' + page + '" ' + page + '</a>';
                }
            });
          
    });
// /Карусель
    
//        $(function() {
//    $( ".dropdown" ).hover(function() {
//  $( ".dropdown-menu" ).slideToggle( "slow" );
//});
//            });
    
    //  Выпадающее меню
     $(document).ready(function() {
        $( '.dropdown' ).hover(
            function(){
                $(this).find('.sub-menu').stop(true, true);
                $(this).children('.sub-menu').slideDown(500);
                $('.backgrond_sub_menu_1 > li').animate({backgroundColor: "#abcdef"}, 1000);
                $('.backgrond_sub_menu_1 > li').mouseover(
                function(){
                    $(this).css("backgroundColor" , "red").find($('.backgrond_sub_menu_1 > li > a')).css("color" , "white")
                    
                }).mouseout(function(){
                    $(this).css("backgroundColor" , "#abcdef").find($('.backgrond_sub_menu_1 > li > a')).css("color" , "dimgray")
                });
            },
           
            function(){
                $(this).children('.sub-menu').slideUp(500);
                $('.backgrond_sub_menu_1 > li').animate({backgroundColor: "#ccbacb"}, 0);
            }
            
        );     
         $( '.dropdown_2' ).hover(
            function(){
                $(this).children('.sub-menu').slideDown(500);
                $('.backgrond_sub_menu_2 > li').animate({backgroundColor: "#03fc78"}, 1000);
                $('.backgrond_sub_menu_2 > li').mouseover(
                function(){
                    $(this).css("backgroundColor" , "red").find($('.backgrond_sub_menu_2 > li > a')).css("color" , "white")
                    
                }).mouseout(function(){
                    $(this).css("backgroundColor" , "#03fc78").find($('.backgrond_sub_menu_2 > li > a')).css("color" , "dimgray")
                });
            },
            function(){
                $(this).children('.sub-menu').slideUp(500);
                $('.backgrond_sub_menu_2 > li').animate({backgroundColor: "#ccbacb"}, 0);
            }
            
        );
         $( '.dropdown_3' ).hover(
            function(){
                $(this).children('.sub-menu').slideDown(500);
                $('.backgrond_sub_menu_3 > li').animate({backgroundColor: "#e8fd02"}, 1000);
                $('.backgrond_sub_menu_3 > li').mouseover(
                function(){
                    $(this).css("backgroundColor" , "red").find($('.backgrond_sub_menu_3 > li > a')).css("color" , "white")
                    
                }).mouseout(function(){
                    $(this).css("backgroundColor" , "#e8fd02").find($('.backgrond_sub_menu_3 > li >a')).css("color" , "dimgray")
                });
                
            },
            function(){
                $(this).children('.sub-menu').slideUp(500);
                $('.backgrond_sub_menu_3 > li').animate({backgroundColor: "#ccbacb"}, 0);
            }
            
        );
    });
    // /Выпадающее меню
    
    // Селект 
  $(document).ready(function(){
    $(function () {
        $("#country_id").selectbox();
    });
    }); 
    
    // Checkbox_js
   
    
    
})(jQuery);
function changeCheck(el)
/* 
	функция смены вида и значения чекбокса
	el - span контейнер дял обычного чекбокса
	input - чекбокс
*/
{
     var el = el,
          input = el.getElementsByTagName("input")[0];
		
     if(input.checked)
     {
	     el.style.backgroundPosition="-37px 0"; 
		 input.checked=false;
     }
     else
     {
          el.style.backgroundPosition="0 0px"; 
		  input.checked=true;
     }
     return true;
}
function startChangeCheck(el)
/*
	если значение установлено в on, меняем вид чекбокса на включенный
*/
{
	var el = el,
          input = el.getElementsByTagName("input")[0];
     if(input.checked)
     {
          el.style.backgroundPosition="0 0px";     
      }
     return true;
}

function startCheck()
{
	/*
		 при загрузке страницы заменяем проверяем значение чекбокса в указанном контенере.
		 если чекбоксов несколько, нужно будет несколько раз вызвать функциую с нужными id
	 */
	startChangeCheck(document.getElementById("niceCheckbox1"));
	startChangeCheck(document.getElementById("niceCheckbox2"));
}

window.onload=startCheck;
