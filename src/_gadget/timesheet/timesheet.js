function stateCallback(callback, opt_context){

}

function init() {
	$("#add_row").onClick(function(){
			alert('bla');
		});

	if(wave && wave.isInWaveContainer()) {				
		wave.setStateCallback(stateCallback);
	}
}
gadgets.util.registerOnLoadHandler(init);
