/*
 * Pronto Plugin [jQuery + CMS push state integration; Based on pjax and turbolinks]
 * @author Ben Plum
 * @version 0.1
 *
 * Copyright © 2012 Ben Plum <mr@benplum.com>
 * Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
 */
 
if (jQuery) (function($) {
	
	var supported = window.history && window.history.pushState && window.history.replaceState;
	// && !navigator.userAgent.match(/((iPod|iPhone|iPad).+\bOS\s+[1-4]|WebApps\/.+CFNetwork)/);
	
	// Default Options
	var options = {
		container: "#pronto",
		selector: "a"
	};
	
	// Public Methods
	var pub = {
		
		supported: function() {
			return supported
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
		
		history.replaceState({
			url: window.location.href,
			data: {
				"title": $("head").find("title").text(),
				"content": $(options.container).html()
			}
		}, "state-"+window.location.href, window.location.href);
		
		// Bind state events
		$(window).on("popstate", _onPop);
		
		options.$body.on("click.pronto", options.selector, _click);
	}
	
	// Handle link clicks 
	function _click(e) {
		var link = e.currentTarget;
		
		// Ignore everything but normal click
		if (  (e.which > 1 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
		   || (location.protocol !== link.protocol || location.host !== link.host)
		   || (link.hash && link.href.replace(link.hash, '') === location.href.replace(location.hash, '') || link.href === location.href + '#')
		   ) {
			return;
		}
		
		e.preventDefault();
		e.stopPropagation();
		
		_load(link.href);
	}
	
	// Load new url
	function _load(url) {
		options.$container.trigger("pronto.beforeLoad");
		
		// Call new content
		$.ajax({
			url: url + (url.indexOf("?") ? "?pronto=true" : "&pronto=true"),
			dataType: "json",
			success: function(response) {
				_render(url, response, true);
			},
			error: function(response) {
				window.location.href = url;
			}
		});
	}
	
	// Handle back button
	function _onPop(e) {
		var data = e.originalEvent.state;
				
		// Check if data exists
		if (data !== null) {
			_render(data.url, data.data, false);
		}
	}
	
	// Render HTML
	function _render(url, response, doPush) {
		// Reset scrollbar
		$(window).scrollTop(0);
		
		// Trigger analytics page view
		_gaCaptureView(url);
		
		// Update DOM
		document.title = response.title.replace(/&nbsp;/g, " ");
		options.$container.trigger("pronto.onLoad")
						  .html(response.content)
						  .trigger("pronto.onRender");
		
		// Push new states to the stack
		if (doPush) {
			history.pushState({
				url: url,
				data: response
			}, "state-"+url, url);
		}
	}
	
	// Google Analytics support
	function _gaCaptureView(url) {
		if (typeof _gaq == undefined) _gaq = [];
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