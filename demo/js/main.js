	$(document).ready(function() {
		// Bind pronto events
		$(window).on("pronto.request", requestPage)
				 .on("pronto.load", destroyPage)
				 .on("pronto.render", initPage);

		// Init pronto
		$.pronto({
			selector: "a:not(.no-pronto)"
		});

		// Remember to init first page
		initPage();
	});

	function requestPage() {
		console.log("load");
	}

	function initPage() {
		// bind events and initialize plugins
		console.log("init");
	}

	function destroyPage() {
		// unbind events and remove plugins
		console.log("destroy");
	}