function getLastRowValue(type){
	return $('table.sheet tbody tr:last input.' + type).val();
}

function appendRow(){
	var lastEnd = getLastRowValue('end');
	if(!lastEnd){
		lastEnd = '';
		}

	function renderElement(element, content){
		var e = '';
		e += '<';
		e += element;
		e += '>';
		e += content;
		e += '</';
		e += element;
		e += '>';

		return e;
	}

	var html = '';
	html += '<tr>';
	// TODO escape lastEnd
	html += renderElement('td', '<input type="text" class="begin" value="' + lastEnd + '"/>');
	html += renderElement('td', '<input type="text" class="end"/>');
	html += renderElement('td', '<input type="text" />');
	html += renderElement('td', '<input type="text" />');
	html += renderElement('td', '<input type="text" />');
	html += renderElement('td', '<input value="-" type="button" />');
	html += '</tr>';

	$('table.sheet tbody').append(html);
}

function stateCallback(callback, opt_context){

}

function init() {
	$(document).ready(function(){
			$('#add_row').click(function(){
					appendRow();
				});
		});

	if(wave && wave.isInWaveContainer()) {				
		wave.setStateCallback(stateCallback);
	}
}
gadgets.util.registerOnLoadHandler(init);
