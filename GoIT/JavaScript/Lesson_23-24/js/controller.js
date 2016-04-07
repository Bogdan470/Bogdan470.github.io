define(
	'controller',
	[],
	function() {
		function Controller(model, view) {
	var self = this;

	view.elements.addBtn.on('click', addItem);
	view.elements.listContainer.on('click', '.item-delete', removeItem);
	view.elements.listContainer.on('focus', '.item-input', getItemValue);
	view.elements.listContainer.on('click', '.item-edit', editItem);
	
	function addItem() {
		var newItem = view.elements.input.val();

		model.addItem(newItem);
		view.renderList(model.data);
		view.elements.input.val('');
	}

	function removeItem() {
		var item = $(this).attr('data-value');

		model.removeItem(item);
		view.renderList(model.data);
	}

	function getItemValue () {
		self.itemValue = $( this ).val();
	}

	function editItem () {
		self.editedValue = $(this).siblings('input').val();
		model.editItem(self.itemValue, self.editedValue);
		view.renderList(model.data);
	}
};
        return{
			init: Controller,
		}
	}
);