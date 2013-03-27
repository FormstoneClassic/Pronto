/*
 * Pronto Plugin
 * @author Ben Plum
 * @version 0.6.0
 *
 * Copyright © 2013 Ben Plum <mr@benplum.com>
 * Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
 */
 
if (jQuery) (function($) {
	
	var $window = $(window),
		supported = window.history && window.history.pushState && window.history.replaceState,
		currentURL = '',
		currentGUID = 0,
		totalStates = 0;
	
	// Default Options
	var options = {
		selector: "a",
		requestKey: "pronto",
		target: { 
			title: "title", 
			content: "#pronto"
		} //key is JSON key, value is HTML selector
	};
	
	// Public Methods
	var pub = {
		
		supported: function() {
			return supported;
		}
	};
	
	// Private Methods
	
	// Init 
	function _init(opts) {
		$.extend(options, opts || {});
		options.$body = $("body");
		options.$container = $(options.container);
		
		// Check for push/pop support
		if (!supported) {
			return;
		}
		
		// Capture current url & state
		currentURL = window.location.href;
		currentGUID = 0;
		
		// Set initial state
		_saveState();
		
		// Bind state events
		$window.on("popstate", _onPop);
		
		options.$body.on("click.pronto", options.selector, _click);
	}
	
	// Handle link clicks 
	function _click(e) {
		var link = e.currentTarget;
		
		// Ignore everything but normal click
		if (  (e.which > 1 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
		   || (window.location.protocol !== link.protocol || window.location.host !== link.host)
		   ) {
			return;
		}
		
		// Update state on hash change
		if (currentURL == link.href || link.hash && link.href.replace(link.hash, '') === window.location.href.replace(location.hash, '') || link.href === window.location.href + '#') {
			_saveState();
			return;
		}
		
		e.preventDefault();
		e.stopPropagation();
		
		_request(link.href);
	}
	
	// Request new url
	function _request(url) {
		// Fire request event
		$window.trigger("pronto.request");
		
		// Request new content
		$.ajax({
			url: url + ((url.indexOf("?") > -1) ? "&"+options.requestKey+"=true" : "?"+options.requestKey+"=true"),
			dataType: "json",
			success: function(response) {
				if (typeof response == "String") {
					response = $.parseJSON(response);
				}
				_render(url, response, 0, currentGUID+1);
				totalStates++;
			},
			error: function(response) {
				window.location.href = url;
			}
		});
	}
	
	// Handle back/forward navigation
	function _onPop(e) {
		var data = e.originalEvent.state;
		
		// Check if data exists
		if (data !== null && data.url !== currentURL) {
			_render(data.url, data.data, data.scroll, data.guid);
		}
	}
	
	// Render HTML
	function _render(url, response, scrollTop, guid) {
		// Fire load event
		$window.trigger("pronto.load");
		
		// Trigger analytics page view
		_gaCaptureView(url);
		
		// Update current state
		_saveState();
		
		// Update DOM
		for (var key in options.target) {
			if (response.hasOwnProperty(key)) {
				$(options.target[key]).html(response[key]);
			}
		}
		
		// Update current url & guid
		currentURL = url;
		currentGUID = guid;
		
		// Push new states to the stack on new url
		if (guid > totalStates) {
			history.pushState({
				guid: currentGUID,
				url: currentURL,
				data: response,
				scroll: 0
			}, "state-"+currentURL, currentURL);
		} else {
			// Set state if moving back/forward
			_saveState();
		}
		
		// Fire render event
		$window.trigger("pronto.render");
		
		//Set Scroll position
		$window.scrollTop(scrollTop);
	}
	
	// Save current state
	function _saveState() {
		// Save data in object before history
		var stateObj = []; 
		for (var key in options.target) {
			stateObj[key] = $(options.target[key]).html();
		}
		
		// Update state
		history.replaceState({
			guid: currentGUID,
			url: currentURL,
			data: stateObj,
			scroll: $window.scrollTop()
		}, "state-"+currentURL, currentURL);
	}
	
	// Unescape Utility
	function _unescapeHTML(unsafe) {
		return unsafe.replace(/&lt;/g, "<")
					 .replace(/&gt;/g, ">")
					 .replace(/&nbsp;/g, " ")
					 .replace(/&amp;/g, "&")
					 .replace(/&quot;/g, '"')
					 .replace(/&#039;/g, "'");
	}
	
	// Google Analytics support
	function _gaCaptureView(url) {
		if (typeof _gaq === "undefined") _gaq = [];
		_gaq.push(['_trackPageview'], url);
	}
	
	// Define Plugin
	$.pronto = function(method) {
		if (pub[method]) {
			return pub[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return _init.apply(this, arguments);
		}
		return this;
	};
})(jQuery);
