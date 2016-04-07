requirejs.config({
	paths: {  
        'jquery': 'https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min'
    }
});
require(
	[
       'model',
		'view',
		'controller',
	],
    function(model, view, controller) {
        $(function () {
	var model_test = new model.init(['task_1', 'task_2', 'task_3']);
	var view_test = new view.init(model_test);
	var controller_test = new controller.init(model_test, view_test);

});
    }
);