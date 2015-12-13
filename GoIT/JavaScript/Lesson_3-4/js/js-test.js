var app = {

  createElement: function(params) {
    var element = document.createElement(params.tagName);
    if (params.inputType){
      element.setAttribute('type', params.inputType);
    }

    if (params.className){
      element.className = params.className;
    }

    if (params.content){
      element.innerHTML = params.content;
    }
    if (params.parentElement){
      params.parentElement.appendChild(element);
    }

    return element;
  },
    
    
    
    
    generateQuestions: function(questionsAmount, answersAmount) {

    for (var i = 0; i < questionsAmount; i++) {

      this.createElement({
        tagName: 'h3',
        content: (i + 1 + ' . ') +' Вопрос №' + (i + 1 ),
        parentElement: form
      });

      for (var j = 0; j < answersAmount; j++) {

        var label = this.createElement({
          tagName: 'label',
          content: 'Вариант ответа №' + (j + 1),
          parentElement: form
        });

        var checkbox = this.createElement({
          tagName: 'input',
          inputType: 'checkbox',
            className: 'test'
        });

        label.insertAdjacentElement('afterBegin', checkbox);
      }

    };

  }

}
var sss = {
    renderSubmit : function(submit) {
		var f = document.createElement('input');
		f.setAttribute('type', 'submit');
		f.value = this.submit;
		//f.setAttribute('value', this.submit);
		
		return f;	
	}
    
}

var body = document.querySelector('body');


app.createElement({
  tagName: 'h2',
  content: 'Тест по программированию',
  parentElement: body
});

var form = app.createElement({
  tagName: 'form',
  parentElement: body
});

app.generateQuestions(3, 3);

app.createElement({
  
  tagName: 'input',
  inputType: 'submit',
  submit: 'Проверить мои результаты',
  parentElement: form
});