TIME_PATTERN = /\s*(\d+)\s*:\s*(\d+)\s*/;

function getLastRowValue(type){
	return $('table.sheet tbody tr:last input.' + type).val();
}

function getValue(type, row){
	return $('input.' + type, row).val();
}

function setValue(type, row, value){
	$('input.' + type, row).val(value);
}

function getTime(type, row){
	var s = getValue(type, row);

	var matcher = TIME_PATTERN.exec(s);

	if(matcher){
		return {
			'h': matcher[1],
			'm': matcher[2]
		};
	}

	return null;
}

function deltaTime(from, until){
	var dh = until.h - from.h;

	if(dh < 0){
		return null;
	}

	var dm = until.m - from.m;

	var dmo = Math.floor(dm / 60);
	if(dmo != 0){
		dh += dmo;
		dm -= dmo * 60;
	}

	return {
		'h': dh,
		'm': dm
	};
}

function formatTime(t){
	if(!t){
		return '';
	}

	var s = '';

	s += t.h;
	s += ':';

	if(t.m < 10){
		s += '0';
	}

	s += t.m;

	return s;
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
	html += renderElement('td', '<input type="text" class="begin" size="6" value="' + lastEnd + '" onchange="javascript:updateDuration(this);"/>');
	html += renderElement('td', '<input type="text" class="end" size="6" onchange="javascript:updateDuration(this);"/>');
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

function updateDuration(rowElement){
	var row = $(rowElement).closest('tr');
	var begin = getTime('begin', row);
	var end = getTime('end', row);

	if(begin && end){
		var dt = deltaTime(begin, end);
		
		setValue('duration', row, formatTime(dt));
	}
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
