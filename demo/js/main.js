	
	$(document).ready(function() {
		// Init pronto
		$.pronto();
		
		// Bind pronto events
		$(window).on("pronto.render", initPage)
				 .on("pronto.load", destroyPage);
		
		// Remember to init first page
		initPage();
	});
	
	function initPage() {
		// bind events and initialize plugins
	}
	
	function destroyPage() {
		// unbind events and remove plugins
	}