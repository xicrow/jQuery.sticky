// Sticky plugin
(function ($, window) {
	$.fn.sticky = function (options) {
		// Get window element
		var $window = $(window);

		// Array for elements
		var elements = [];

		// Default options
		var optionsDefault = {
			useDummy: true,
			cssSticky: {},
			cssDefault: {},
			classSticky: 'is-sticky',
			onChange : null
		};

		// Extend options
		options = $.extend(optionsDefault, options);

		// Update function
		var stickyUpdateAll = function() {
			// Loop through elements
			for (var i = 0, len = elements.length; i < len; i++) {
				// Get element
				var $elm = elements[i];

				stickyUpdate($elm);
			}
		};

		var stickyUpdate = function($elm){
			// Get window scroll top
			var windowScrollTop = $window.scrollTop();

			// Get elements original offset
			var elementOffsetOriginal = $elm.data('sticky.offset');

			// If element is not sticky, and window scroll is larger than element offset
			if (!$elm.data('sticky.status') && windowScrollTop >= elementOffsetOriginal.top) {
				stickyOn($elm);
			} else if ($elm.data('sticky.status') && windowScrollTop < elementOffsetOriginal.top) {
				stickyOff($elm);
			}
		};

		var stickyRecalculate = function($elm){
			// Remove sticky from element
			stickyOff($elm);

			// Hide after recalculation is done
			var hideAfter = false;

			// If element is not visible
			if (!$elm.is(':visible')) {
				// Remember to hide after
				hideAfter = true;

				// Show element, need visible element
				$elm.show();
			}

			// Save offset (might have changed during resize)
			$elm.data('sticky.offset', $elm.offset());

			// Should we hide the element
			if (hideAfter) {
				// Hide the element
				$elm.hide();
			}

			// Update sticky on the element
			stickyUpdate($elm);
		};

		var stickyOn = function($elm){
			if (options.useDummy) {
				// Show the dummy
				$elm.data('sticky.dummy')
					.css({
						width: $elm.width(),
						height: $elm.height()
					})
					.show();
			}

			// Set CSS for sticky element
			var css = $.extend(options.cssSticky, {
				margin: '0 auto',
				position: 'fixed',
				top: 0,
				right: 0,
				left: 0,
				width: $elm.width()
			});
			$elm.css(css);

			// Add sticky class
			$elm.addClass(options.classSticky);

			// Element is now sticky, save status
			$elm.data('sticky.status', true);

			// Check for "onChange" callback
			if (options.onChange && typeof(options.onChange) === 'function') {
				// Call the callback
				options.onChange(true);
			}
		};

		var stickyOff = function($elm){
			if (options.useDummy) {
				// Hide the dummy
				$elm.data('sticky.dummy').hide();
			}

			// Remove inline styles
			$elm.removeAttr('style');

			// Set CSS for non-sticky element
			$elm.css(options.cssDefault);

			// Remove sticky class
			$elm.removeClass(options.classSticky);

			// Element is now not-sticky, save status
			$elm.data('sticky.status', false);

			// Check for "onChange" callback
			if (options.onChange && typeof(options.onChange) === 'function') {
				// Call the callback
				options.onChange(false);
			}
		};

		// Loop through each matched element
		this.each(function () {
			// Get element
			var $elm = $(this);

			// If data is not set on the element
			if (typeof($elm.data('sticky.status')) == 'undefined'){
				var $dummy = false;
				if (options.useDummy) {
					// Create dummy for the element
					$dummy = $('<div>')
						.css({
							width: $elm.width(),
							height: $elm.height()
						})
						.insertBefore($elm)
						.hide();
				}

				// Set data
				$elm.data('sticky.status', false);
				$elm.data('sticky.offset', $elm.offset());
				$elm.data('sticky.dummy', $dummy);

				// Set default CSS to the element
				$elm.css(options.cssDefault);

				// Add to elements
				elements.push($elm);
			}
		});

		// On window ready
		$window.ready(function(){
			// Update elements
			stickyUpdateAll();
		});

		// On window scroll
		$window.scroll(function(){
			// Update elements
			stickyUpdateAll();
		});

		// On window resize
		$window.resize(function(){
			// Loop through elements
			for (var i = 0, len = elements.length; i < len; i++) {
				// Get element
				var $elm = elements[i];

				stickyRecalculate($elm);
			}

			// Update elements
			stickyUpdateAll();
		});

		return this;
	};
}(jQuery, window));
