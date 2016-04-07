define(
	'view',
	['tmpl'],
	function() {
		function View(model) {
	var self = this;

	function init() {
		var wrapper = tmpl($('#wrapper-template').html());

		$('body').append(wrapper);
		self.elements = {
			input: $('.item-value'),
			addBtn: $('.item-add'),
			listContainer: $('.item-list')
		};
		self.renderList(model.data);
	}

	self.renderList = function (data) {
		var list = 	tmpl($('#list-template').html(), {data: data});
		self.elements.listContainer.html(list);	
	};

	init();
	self.elements.listContainer.on('focus', '.item-input', function () {
		$(this).siblings('.item-delete').fadeOut( 200, function () {
			$(this).siblings('.item-edit').fadeIn(200).css({'display': 'inline-block'});
		});
		
	});
	self.elements.listContainer.on('focusout', '.item-input', function () {
		$(this).siblings('.item-edit').fadeOut( 200, function () {
			$(this).siblings('.item-delete').fadeIn(200);
		});
	});

};
        
		return {
			init: View,
		}
	}
);