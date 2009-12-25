function stateCallback(callback, opt_context){

}

function init() {
	$(document).ready(function(){
			$("#add_row").click(function(){
					alert('bla');
				});
		});

	if(wave && wave.isInWaveContainer()) {				
		wave.setStateCallback(stateCallback);
	}
}
gadgets.util.registerOnLoadHandler(init);
