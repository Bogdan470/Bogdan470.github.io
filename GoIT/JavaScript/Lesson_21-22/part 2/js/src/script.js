$(() => {

   
    let test = [
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
                          
 
let localTest =JSON.stringify( test );
localStorage.setItem("test", localTest);

let recievedTest = localStorage.getItem( "test" );
let readyTest =JSON.parse( recievedTest );

let $html =$('#my_page').html();
let content =tmpl($html, {
    data : readyTest
});
$('#form_id').prepend( content );
    
    let $inputs =$('input:checkbox');
    $inputs.on('click' , function(){
        $(this).parent().siblings().children().each(function(){
            if($(this).attr('disabled')){
                $(this).attr('disabled', false);
            } else {
                $(this).attr('disabled' , true);
            }
        });
        
    });
let checkResults = function(e) {
  e.preventDefault();
  let rightAnswers = [];
  let getRightAnswers = function() {
    for ( let i = 0; i < readyTest.length; i++ ) {
      let testAnswers = readyTest[i].answers;
      for (let j = 0; j < testAnswers.length; j++) {
        let currentAnswer = readyTest[i].answers[j].right;
        rightAnswers.push(currentAnswer);
      }
    }
  };
        let givenAnswers = [];
  let getGivenAnswers = function() {
    $inputs.each(function () {
      if ( $(this).prop('checked') ) {
        givenAnswers.push(true);
      } else {
        givenAnswers.push(false);
      }
    });
  };

  let answered = 0;
  let check = function () {
    for (let i = 0; i < rightAnswers.length; i++) {
      if ( rightAnswers[i] === true ) {
        if ( rightAnswers[i] === givenAnswers[i] ) {
        answered++;
        }
      }
    }
  };
        let questionsQuantity = 0;
  let sumQuestions = function () {
    for (let i = 0; i < readyTest.length; i++) {
      questionsQuantity++;
    }
  };

  let passed = 0;
  let testOK= false;
  let testPassed = function () {
    passed = answered /questionsQuantity;
    if ( passed === 1) {
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

  let $modal;
  let $body = $('#modal_form');
  if ( testOK ){
    $modal = ('<div class="mymodal_green reset_my_modal"><div><h2 class="text_test_zdan">Тест успешно сдан!</h2><div class="text_answered">Правильно '+
    answered +', с '+ questionsQuantity +' вопросов </div></div></div>');
  } else {
    $modal = ('<div class="mymodal_red reset_my_modal"><h2 class="text_test_zdan">Тест сдан плохо.</h2> <div class="text_answered">Правильно '+
    answered +' , с '+ questionsQuantity +' вопросов </div></div>');
  }


  $body.append($modal);
        
  }
 let $exit = $( '#modal_close' );
  let reset = function() {
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