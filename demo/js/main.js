	$(document).ready(function() {
		// Bind pronto events
		$(window).on("pronto.request", requestPage)
				 .on("pronto.load", destroyPage)
				 .on("pronto.render", initPage)
				 .on("pronto.error", errorPage);

		// Init pronto
		$.pronto({
			selector: "a:not(.no-pronto)"
		});

		// Remember to init first page
		initPage();
	});

	function requestPage() {
		console.log("Request new page");
	}

	function initPage() {
		// bind events and initialize plugins
		console.log("Render new page");
	}

	function destroyPage() {
		// unbind events and remove plugins
		console.log("Destroy old page");
	}

	function errorPage() {
		console.error("Error loading page");
	}