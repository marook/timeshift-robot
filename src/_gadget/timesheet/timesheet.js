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
	html += renderElement('td', '<input type="text" class="begin" size="6" value="' + lastEnd + '"/>');
	html += renderElement('td', '<input type="text" class="end" size="6"/>');
	html += renderElement('td', '<input type="text" class="duration" size="5" readonly/>');
	html += renderElement('td', '<input type="text" class="category" size="10"/>');
	html += renderElement('td', '<textarea type="text" class="description" cols="20" rows="3"/>');
	html += renderElement('td', '<input value="-" type="button" onclick="javascript:removeRow(this);"/>');
	html += '</tr>';

	$('table.sheet tbody').append(html);
}

function removeRow(button){
	$(button).closest('tr').remove();
}

function updateDuration(){
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
