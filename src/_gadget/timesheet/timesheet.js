/*
 * Copyright 2009 Markus Pielmeier
 *
 * This file is part of timesheet.
 *
 * timesheet is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * timesheet is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with timesheet.  If not, see <http://www.gnu.org/licenses/>.
 */

TIME_PATTERN = /\s*(\d+)\s*:\s*(\d+)\s*/;

/*
 * contains the currently visible rows. keys are the row ids.
 */
visibleRows = {};

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

function generateUID(){
	return 'id' + wave.getTime();
}

function submitValue(element, type){
	var row = $(element).closest('tr');
	var rowId = getValue('id', row);
	var value = $(element).val();
	var key = rowId + '#' + type;

	var d = {};
	d[key] = value;

	wave.getState().submitDelta(d);
}

function appendRowHtml(rowId){
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

	function getStateValue(type, defaultValue){
		if(typeof defaultValue == 'undefined'){
			defaultValue = '';
		}

		var v = wave.getState().get(rowId + '#' + type);

		if(!v){
			return defaultValue;
		}

		return v;
	}

	// append row in html dom
	var html = '';
	html += '<tr>';
	// TODO escape lastEnd
	html += renderElement('td', '<input type="text" class="begin" size="6" value="' + getStateValue('begin', lastEnd) + '" onchange="javascript:updateDuration(this);submitValue(this, \'begin\');"/>');
	html += renderElement('td', '<input type="text" class="end" size="6" onchange="javascript:updateDuration(this);submitValue(this, \'end\');" value="' + getStateValue('end') + '"/>');
	html += renderElement('td', '<input type="text" class="duration" size="5" readonly/>');
	html += renderElement('td', '<input type="text" class="category" size="10" onchange="javascript:submitValue(this, \'category\');" value="' + getStateValue('category') + '"/>');
	html += renderElement('td', '<textarea type="text" class="description" cols="20" rows="3" onchange="javascript:submitValue(this, \'description\');" value="' + getStateValue('description') + '"/>');
	html += renderElement('td', '<input value="-" type="button" onclick="javascript:removeRow(this);"/><input type="hidden" class="id" value="' + rowId + '"/>');
	html += '</tr>';

	visibleRows[rowId] = true;

	$('table.sheet tbody').append(html);
}

function appendRow(){
	var rowId = generateUID();

	appendRowHtml(rowId);

	// append row in wave state
	var rowIds = wave.getState().get('rows');

	if(!rowIds){
		rowIds = '';
	}
	if(rowIds.length > 0){
		rowIds += ',';
	}
	rowIds += rowId;

	wave.getState().submitDelta({'rows': rowIds});
}

function removeRow(button){
	var row = $(button).closest('tr');
	var removedRowId = getValue('id', row);

	row.remove();

	var rowIdsValue = wave.getState().get('rows');
	if(!rowIdsValue){
		rowIdsValue = '';
	}

	var newRowIds = '';
	var rowIds = rowIdsValue.split(',');
	var i;
	for(i in rowIds){
		var rowId = rowIds[i];

		if(rowId == removedRowId){
			continue;
		}

		if(newRowIds.length > 0){
			newRowIds += ',';
		}

		newRowIds += rowId;
	}

	var d = {};
	d['rows'] = newRowIds;

	var TYPES = ['begin', 'end', 'category', 'description'];
	for(i in TYPES){
		var type = TYPES[i];

		d[removedRowId + '#' + type] = null;
	}

	wave.getState().submitDelta(d);
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

function onRowsChanged(newRows){
	var rowIds = newRows.split(',');
	var i;
	for(i in rowIds){
		var rowId = rowIds[i];

		if(rowId in visibleRows){
			// row already exists => ignore it
		}
		else{
			appendRowHtml(rowId);
		}
	}
}

function stateCallback(newState){
	var i;
	var keys = newState.getKeys();
	for(i in keys){
		var key = keys[i];

		switch(key){
		case 'rows':
			onRowsChanged(newState.get(key));
			break;
		}
	}
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
