$(function(){
    
    'use strict'
    var test = [
        { 
            
            title: 'За что отвечает фронтенд?',
           
            answers: [
                {
                answer : 'Cоздание пользовательского интерфейса' ,
                right : true
            },
            
                    { answer : 'Работа с базой данных' ,
                     right : false
                    },
                         
                    { answer : 'Поиск необходимых продуктов в базе данных' ,
                         right :false 
            }],
        },
        
          { 
            
            title: 'Какие основные языки программирования используются во фронтенд-разработке?',
            
            answers: [
                {
                
             answer : 'html, css, javascript',
                right : true 
            },
             { answer : 'xml, css, javascript' ,
                     right : false
                    },
                       { answer : 'html, xss, typescript' ,
                     right : false
                    }]
          },
                      
        
          { 
            
            title: 'Что такое html',
           
            answers: [
                {
               answer : 'Язык гипертекстовой разметки',
                right : true 
            }, 
            
              { answer : 'Язык для создания анимаций' ,
                     right : false
                    },
                       { answer : 'Язык для отображения товаров на сайте' ,
                     right : false
                    }]
          }
        ];
                          
 
var localTest =JSON.stringify( test );
localStorage.setItem("test", localTest);

var recievedTest = localStorage.getItem( "test" );
var readyTest =JSON.parse( recievedTest );

var $html =$('#my_page').html();
var content =tmpl($html, {
    data : readyTest
});
$('#form_id').prepend( content );
    
    var $inputs =$('input:checkbox');
    $inputs.on('click' , function(){
        $(this).parent().siblings().children().each(function(){
            if($(this).attr('disabled')){
                $(this).attr('disabled', false);
            } else {
                $(this).attr('disabled' , true);
            }
        });
        
    });
var checkResults = function(e) {
  e.preventDefault();
  var rightAnswers = [];
  var getRightAnswers = function() {
    for ( var i = 0; i < readyTest.length; i++ ) {
      var testAnswers = readyTest[i].answers;
      for (var j = 0; j < testAnswers.length; j++) {
        var currentAnswer = readyTest[i].answers[j].right;
        rightAnswers.push(currentAnswer);
      }
    }
  };
        var givenAnswers = [];
  var getGivenAnswers = function() {
    $inputs.each(function () {
      if ( $(this).prop('checked') ) {
        givenAnswers.push(true);
      } else {
        givenAnswers.push(false);
      }
    });
  };

  var answered = 0;
  var check = function () {
    for (var i = 0; i < rightAnswers.length; i++) {
      if ( rightAnswers[i] === true ) {
        if ( rightAnswers[i] === givenAnswers[i] ) {
        answered++;
        }
      }
    }
  };
        var questionsQuantity = 0;
  var sumQuestions = function () {
    for (var i = 0; i < readyTest.length; i++) {
      questionsQuantity++;
    }
  };

  var passed = 0;
  var testOK= false;
  var testPassed = function () {
    passed = answered /questionsQuantity;
    if ( passed > 0.5 ) {
    testOK = true;
    }
  };
  getRightAnswers();
  console.log('rightAnswers = ', rightAnswers);

  getGivenAnswers();
  console.log('givenAnswers = ', givenAnswers);

  check();
  console.log('answered = ', answered);

  sumQuestions();

  testPassed();
  console.log('passed = ', passed);

  console.log('testOK = ', testOK);

  var $modal;
  var $body = $('#modal_form');
  if ( testOK ){
    $modal = ('<div class="mymodal_green reset_my_modal"><div><h2 class="text_test_zdan">Тест успешно сдан!</h2><div class="text_answered">Правильно '+
    answered +', с '+ questionsQuantity +' вопросов </div></div></div>');
  } else {
    $modal = ('<div class="mymodal_red reset_my_modal"><h2 class="text_test_zdan">Тест сдан плохо.</h2> <div class="text_answered">Правильно '+
    answered +' , с '+ questionsQuantity +' вопросов </div></div>');
  }


  $body.append($modal);
        
  }
 var $exit = $( '#modal_close' );
  var reset = function() {
    $inputs.prop( 'checked', false ).prop( 'disabled', false );
       $( '.reset_my_modal' ).remove();
    return false;
  };
$exit.on( 'click', reset );
	$('#go').click(checkResults).click( function(event){ 
		event.preventDefault(); 
		$('#overlay').fadeIn(400,
		 	function(){ 
				$('#modal_form') 
					.css('display', 'block') 
					.animate({opacity: 1, top: '50%'}, 200); 
		});
        
        
	});
	$('#modal_close, #overlay' ).click( function(){ 
        $('#overlay').fadeOut(400).each(reset);
        
		$('#modal_form')
			.animate({opacity: 0, top: '45%'}, 200, 
				function(){ 
					$(this).css('display', 'none');
					 

				}
    
			);
        
	});
   
});