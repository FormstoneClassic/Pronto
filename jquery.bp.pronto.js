/*
 * Pronto Plugin
 * @author Ben Plum
 * @version 0.5.3
 *
 * Copyright © 2012 Ben Plum <mr@benplum.com>
 * Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
 */
 
if (jQuery) (function($) {
	
	var supported = window.history && window.history.pushState && window.history.replaceState;
	
	var $window = $(window);
	
	var currentURL = '';
	
	// Default Options
	var options = {
		selector: "a",
		ajax_key: "pronto",
		container: { title : 'title', content : '#content'}, //key is JSON key, value is HTML selector
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
		options.$ajax_key = $(options.ajax_key);
		
		// Check for push/pop support
		if (!supported) {
			return;
		}
		
		//Save data in object before history
		var jsonObj = []; 
		$.each(options.$container, function(key, value){
		    $.each(value, function(key, value){
			if(key=='title'){
				jsonObj["title"] = $("head").find("title").text();
			} else {
				jsonObj[key] = $(value).html();
			}
		    });
		});

		//Push history
		history.replaceState({
			url: window.location.href,
			data: jsonObj
		}, "state-"+window.location.href, window.location.href);
		
		currentURL = window.location.href;
		
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
		   || (link.hash && link.href.replace(link.hash, '') === window.location.href.replace(location.hash, '') || link.href === window.location.href + '#')
		   ) {
			return;
		}
		
		e.preventDefault();
		e.stopPropagation();
		
		_request(link.href);
	}
	
	// Request new url
	function _request(url) {
		$window.trigger("pronto.request");
		
		// Call new content
		$.ajax({
			url: url + ((url.indexOf("?") > -1) ? "&"+options.ajax_key+"=true" : "?"+options.ajax_key+"=true"),
			dataType: "json",
			success: function(response) {
				response = $.parseJSON(response);
				_render(url, response, true);
			},
			error: function(response) {
				//window.location.href = url;
				console.log(response);
			}
		});
	}
	
	// Handle back button
	function _onPop(e) {
		var data = e.originalEvent.state;
		
		// Check if data exists
		if (data !== null && (data.url !== currentURL)) {
			_render(data.url, data.data, false);
		}
	}
	
	// Render HTML
	function _render(url, response, doPush) {
		// Reset scrollbar
		$window.trigger("pronto.load")
			   .scrollTop(0);
		
		// Trigger analytics page view
		_gaCaptureView(url);
		
		// Update DOM
		$.each(options.$container, function(key, value){
		    $.each(value, function(key, value){
			if(response.hasOwnProperty(key))
			{
				if(key=='title'){
					document.title = _unescapeHTML(response[key]);
				} else {
					$(value).html(response[key]);
				}
			}
		    });
		});
		
		// Push new states to the stack
		if (doPush) {
			history.pushState({
				url: url,
				data: response
			}, "state-"+url, url);
		}
		
		currentURL = url;
		
		$window.trigger("pronto.render");
	}
	
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
