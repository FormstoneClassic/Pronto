
	// Define transitiond deferred
	var transitionDeferred;

	$(document).ready(function() {
		// Bind pronto events
		$(window).on("pronto.request", pageRequested)
				 .on("pronto.progress", pageLoadProgress)
				 .on("pronto.load", pageLoaded)
				 .on("pronto.render", pageRendered)
				 .on("pronto.error", pageLoadError);

		// Init pronto
		$.pronto({
			selector: "a:not(.no-pronto)",
			transitionOut: getTransitionOutDeferred
		});

		// Remember to init first page
		pageRendered();
	});

	function getTransitionOutDeferred() {
		// Reject active deferred
		if (transitionDeferred) {
			transitionDeferred.reject();
		}

		// Create new timing deferred
		transitionDeferred = $.Deferred();

		// Animate content out
		$("#pronto").animate({ opacity: 0 }, 500, function() {
			// Resolve active deferred
			transitionDeferred.resolve();
		});

		// Return active deferred
		return transitionDeferred;
	}

	function pageRequested(e) {
		// Update state to reflect loading
		console.log("Request new page");
	}

	function pageLoadProgress(e, percent) {
		// Update progress to reflect loading
		console.log("New page load progress", percent);
	}

	function pageLoaded(e) {
		// Unbind old events and remove plugins
		console.log("Destroy old page");
	}

	function pageRendered(e) {
		// Bind new events and initialize plugins
		console.log("Render new page");

		// Animate content in
		$("#pronto").animate({ opacity: 1 });
	}

	function pageLoadError(e, error) {
		// Watch for load errors
		console.error("Error loading page", error);
	}