/*!
 infusion - v2.0.0-dev.20160911T222604Z.b86ecbb
 Friday, September 16th, 2016, 10:02:42 AM
 branch:  revision: */
/*!
 * jQuery UI Core 1.10.4
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/category/ui-core/
 */
(function( $, undefined ) {

var uuid = 0,
	runiqueId = /^ui-id-\d+$/;

// $.ui might exist from components with no dependencies, e.g., $.ui.position
$.ui = $.ui || {};

$.extend( $.ui, {
	version: "1.10.4",

	keyCode: {
		BACKSPACE: 8,
		COMMA: 188,
		DELETE: 46,
		DOWN: 40,
		END: 35,
		ENTER: 13,
		ESCAPE: 27,
		HOME: 36,
		LEFT: 37,
		NUMPAD_ADD: 107,
		NUMPAD_DECIMAL: 110,
		NUMPAD_DIVIDE: 111,
		NUMPAD_ENTER: 108,
		NUMPAD_MULTIPLY: 106,
		NUMPAD_SUBTRACT: 109,
		PAGE_DOWN: 34,
		PAGE_UP: 33,
		PERIOD: 190,
		RIGHT: 39,
		SPACE: 32,
		TAB: 9,
		UP: 38
	}
});

// plugins
$.fn.extend({
	focus: (function( orig ) {
		return function( delay, fn ) {
			return typeof delay === "number" ?
				this.each(function() {
					var elem = this;
					setTimeout(function() {
						$( elem ).focus();
						if ( fn ) {
							fn.call( elem );
						}
					}, delay );
				}) :
				orig.apply( this, arguments );
		};
	})( $.fn.focus ),

	scrollParent: function() {
		var scrollParent;
		if (($.ui.ie && (/(static|relative)/).test(this.css("position"))) || (/absolute/).test(this.css("position"))) {
			scrollParent = this.parents().filter(function() {
				return (/(relative|absolute|fixed)/).test($.css(this,"position")) && (/(auto|scroll)/).test($.css(this,"overflow")+$.css(this,"overflow-y")+$.css(this,"overflow-x"));
			}).eq(0);
		} else {
			scrollParent = this.parents().filter(function() {
				return (/(auto|scroll)/).test($.css(this,"overflow")+$.css(this,"overflow-y")+$.css(this,"overflow-x"));
			}).eq(0);
		}

		return (/fixed/).test(this.css("position")) || !scrollParent.length ? $(document) : scrollParent;
	},

	zIndex: function( zIndex ) {
		if ( zIndex !== undefined ) {
			return this.css( "zIndex", zIndex );
		}

		if ( this.length ) {
			var elem = $( this[ 0 ] ), position, value;
			while ( elem.length && elem[ 0 ] !== document ) {
				// Ignore z-index if position is set to a value where z-index is ignored by the browser
				// This makes behavior of this function consistent across browsers
				// WebKit always returns auto if the element is positioned
				position = elem.css( "position" );
				if ( position === "absolute" || position === "relative" || position === "fixed" ) {
					// IE returns 0 when zIndex is not specified
					// other browsers return a string
					// we ignore the case of nested elements with an explicit value of 0
					// <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
					value = parseInt( elem.css( "zIndex" ), 10 );
					if ( !isNaN( value ) && value !== 0 ) {
						return value;
					}
				}
				elem = elem.parent();
			}
		}

		return 0;
	},

	uniqueId: function() {
		return this.each(function() {
			if ( !this.id ) {
				this.id = "ui-id-" + (++uuid);
			}
		});
	},

	removeUniqueId: function() {
		return this.each(function() {
			if ( runiqueId.test( this.id ) ) {
				$( this ).removeAttr( "id" );
			}
		});
	}
});

// selectors
function focusable( element, isTabIndexNotNaN ) {
	var map, mapName, img,
		nodeName = element.nodeName.toLowerCase();
	if ( "area" === nodeName ) {
		map = element.parentNode;
		mapName = map.name;
		if ( !element.href || !mapName || map.nodeName.toLowerCase() !== "map" ) {
			return false;
		}
		img = $( "img[usemap=#" + mapName + "]" )[0];
		return !!img && visible( img );
	}
	return ( /input|select|textarea|button|object/.test( nodeName ) ?
		!element.disabled :
		"a" === nodeName ?
			element.href || isTabIndexNotNaN :
			isTabIndexNotNaN) &&
		// the element and all of its ancestors must be visible
		visible( element );
}

function visible( element ) {
	return $.expr.filters.visible( element ) &&
		!$( element ).parents().addBack().filter(function() {
			return $.css( this, "visibility" ) === "hidden";
		}).length;
}

$.extend( $.expr[ ":" ], {
	data: $.expr.createPseudo ?
		$.expr.createPseudo(function( dataName ) {
			return function( elem ) {
				return !!$.data( elem, dataName );
			};
		}) :
		// support: jQuery <1.8
		function( elem, i, match ) {
			return !!$.data( elem, match[ 3 ] );
		},

	focusable: function( element ) {
		return focusable( element, !isNaN( $.attr( element, "tabindex" ) ) );
	},

	tabbable: function( element ) {
		var tabIndex = $.attr( element, "tabindex" ),
			isTabIndexNaN = isNaN( tabIndex );
		return ( isTabIndexNaN || tabIndex >= 0 ) && focusable( element, !isTabIndexNaN );
	}
});

// support: jQuery <1.8
if ( !$( "<a>" ).outerWidth( 1 ).jquery ) {
	$.each( [ "Width", "Height" ], function( i, name ) {
		var side = name === "Width" ? [ "Left", "Right" ] : [ "Top", "Bottom" ],
			type = name.toLowerCase(),
			orig = {
				innerWidth: $.fn.innerWidth,
				innerHeight: $.fn.innerHeight,
				outerWidth: $.fn.outerWidth,
				outerHeight: $.fn.outerHeight
			};

		function reduce( elem, size, border, margin ) {
			$.each( side, function() {
				size -= parseFloat( $.css( elem, "padding" + this ) ) || 0;
				if ( border ) {
					size -= parseFloat( $.css( elem, "border" + this + "Width" ) ) || 0;
				}
				if ( margin ) {
					size -= parseFloat( $.css( elem, "margin" + this ) ) || 0;
				}
			});
			return size;
		}

		$.fn[ "inner" + name ] = function( size ) {
			if ( size === undefined ) {
				return orig[ "inner" + name ].call( this );
			}

			return this.each(function() {
				$( this ).css( type, reduce( this, size ) + "px" );
			});
		};

		$.fn[ "outer" + name] = function( size, margin ) {
			if ( typeof size !== "number" ) {
				return orig[ "outer" + name ].call( this, size );
			}

			return this.each(function() {
				$( this).css( type, reduce( this, size, true, margin ) + "px" );
			});
		};
	});
}

// support: jQuery <1.8
if ( !$.fn.addBack ) {
	$.fn.addBack = function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	};
}

// support: jQuery 1.6.1, 1.6.2 (http://bugs.jquery.com/ticket/9413)
if ( $( "<a>" ).data( "a-b", "a" ).removeData( "a-b" ).data( "a-b" ) ) {
	$.fn.removeData = (function( removeData ) {
		return function( key ) {
			if ( arguments.length ) {
				return removeData.call( this, $.camelCase( key ) );
			} else {
				return removeData.call( this );
			}
		};
	})( $.fn.removeData );
}





// deprecated
$.ui.ie = !!/msie [\w.]+/.exec( navigator.userAgent.toLowerCase() );

$.support.selectstart = "onselectstart" in document.createElement( "div" );
$.fn.extend({
	disableSelection: function() {
		return this.bind( ( $.support.selectstart ? "selectstart" : "mousedown" ) +
			".ui-disableSelection", function( event ) {
				event.preventDefault();
			});
	},

	enableSelection: function() {
		return this.unbind( ".ui-disableSelection" );
	}
});

$.extend( $.ui, {
	// $.ui.plugin is deprecated. Use $.widget() extensions instead.
	plugin: {
		add: function( module, option, set ) {
			var i,
				proto = $.ui[ module ].prototype;
			for ( i in set ) {
				proto.plugins[ i ] = proto.plugins[ i ] || [];
				proto.plugins[ i ].push( [ option, set[ i ] ] );
			}
		},
		call: function( instance, name, args ) {
			var i,
				set = instance.plugins[ name ];
			if ( !set || !instance.element[ 0 ].parentNode || instance.element[ 0 ].parentNode.nodeType === 11 ) {
				return;
			}

			for ( i = 0; i < set.length; i++ ) {
				if ( instance.options[ set[ i ][ 0 ] ] ) {
					set[ i ][ 1 ].apply( instance.element, args );
				}
			}
		}
	},

	// only used by resizable
	hasScroll: function( el, a ) {

		//If overflow is hidden, the element might have extra content, but the user wants to hide it
		if ( $( el ).css( "overflow" ) === "hidden") {
			return false;
		}

		var scroll = ( a && a === "left" ) ? "scrollLeft" : "scrollTop",
			has = false;

		if ( el[ scroll ] > 0 ) {
			return true;
		}

		// TODO: determine which cases actually cause this to happen
		// if the element doesn't have the scroll set, see if it's possible to
		// set the scroll
		el[ scroll ] = 1;
		has = ( el[ scroll ] > 0 );
		el[ scroll ] = 0;
		return has;
	}
});

})( jQuery );
;
/*!
 * jQuery UI Widget 1.10.4
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/jQuery.widget/
 */
(function( $, undefined ) {

var uuid = 0,
	slice = Array.prototype.slice,
	_cleanData = $.cleanData;
$.cleanData = function( elems ) {
	for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
		try {
			$( elem ).triggerHandler( "remove" );
		// http://bugs.jquery.com/ticket/8235
		} catch( e ) {}
	}
	_cleanData( elems );
};

$.widget = function( name, base, prototype ) {
	var fullName, existingConstructor, constructor, basePrototype,
		// proxiedPrototype allows the provided prototype to remain unmodified
		// so that it can be used as a mixin for multiple widgets (#8876)
		proxiedPrototype = {},
		namespace = name.split( "." )[ 0 ];

	name = name.split( "." )[ 1 ];
	fullName = namespace + "-" + name;

	if ( !prototype ) {
		prototype = base;
		base = $.Widget;
	}

	// create selector for plugin
	$.expr[ ":" ][ fullName.toLowerCase() ] = function( elem ) {
		return !!$.data( elem, fullName );
	};

	$[ namespace ] = $[ namespace ] || {};
	existingConstructor = $[ namespace ][ name ];
	constructor = $[ namespace ][ name ] = function( options, element ) {
		// allow instantiation without "new" keyword
		if ( !this._createWidget ) {
			return new constructor( options, element );
		}

		// allow instantiation without initializing for simple inheritance
		// must use "new" keyword (the code above always passes args)
		if ( arguments.length ) {
			this._createWidget( options, element );
		}
	};
	// extend with the existing constructor to carry over any static properties
	$.extend( constructor, existingConstructor, {
		version: prototype.version,
		// copy the object used to create the prototype in case we need to
		// redefine the widget later
		_proto: $.extend( {}, prototype ),
		// track widgets that inherit from this widget in case this widget is
		// redefined after a widget inherits from it
		_childConstructors: []
	});

	basePrototype = new base();
	// we need to make the options hash a property directly on the new instance
	// otherwise we'll modify the options hash on the prototype that we're
	// inheriting from
	basePrototype.options = $.widget.extend( {}, basePrototype.options );
	$.each( prototype, function( prop, value ) {
		if ( !$.isFunction( value ) ) {
			proxiedPrototype[ prop ] = value;
			return;
		}
		proxiedPrototype[ prop ] = (function() {
			var _super = function() {
					return base.prototype[ prop ].apply( this, arguments );
				},
				_superApply = function( args ) {
					return base.prototype[ prop ].apply( this, args );
				};
			return function() {
				var __super = this._super,
					__superApply = this._superApply,
					returnValue;

				this._super = _super;
				this._superApply = _superApply;

				returnValue = value.apply( this, arguments );

				this._super = __super;
				this._superApply = __superApply;

				return returnValue;
			};
		})();
	});
	constructor.prototype = $.widget.extend( basePrototype, {
		// TODO: remove support for widgetEventPrefix
		// always use the name + a colon as the prefix, e.g., draggable:start
		// don't prefix for widgets that aren't DOM-based
		widgetEventPrefix: existingConstructor ? (basePrototype.widgetEventPrefix || name) : name
	}, proxiedPrototype, {
		constructor: constructor,
		namespace: namespace,
		widgetName: name,
		widgetFullName: fullName
	});

	// If this widget is being redefined then we need to find all widgets that
	// are inheriting from it and redefine all of them so that they inherit from
	// the new version of this widget. We're essentially trying to replace one
	// level in the prototype chain.
	if ( existingConstructor ) {
		$.each( existingConstructor._childConstructors, function( i, child ) {
			var childPrototype = child.prototype;

			// redefine the child widget using the same prototype that was
			// originally used, but inherit from the new version of the base
			$.widget( childPrototype.namespace + "." + childPrototype.widgetName, constructor, child._proto );
		});
		// remove the list of existing child constructors from the old constructor
		// so the old child constructors can be garbage collected
		delete existingConstructor._childConstructors;
	} else {
		base._childConstructors.push( constructor );
	}

	$.widget.bridge( name, constructor );
};

$.widget.extend = function( target ) {
	var input = slice.call( arguments, 1 ),
		inputIndex = 0,
		inputLength = input.length,
		key,
		value;
	for ( ; inputIndex < inputLength; inputIndex++ ) {
		for ( key in input[ inputIndex ] ) {
			value = input[ inputIndex ][ key ];
			if ( input[ inputIndex ].hasOwnProperty( key ) && value !== undefined ) {
				// Clone objects
				if ( $.isPlainObject( value ) ) {
					target[ key ] = $.isPlainObject( target[ key ] ) ?
						$.widget.extend( {}, target[ key ], value ) :
						// Don't extend strings, arrays, etc. with objects
						$.widget.extend( {}, value );
				// Copy everything else by reference
				} else {
					target[ key ] = value;
				}
			}
		}
	}
	return target;
};

$.widget.bridge = function( name, object ) {
	var fullName = object.prototype.widgetFullName || name;
	$.fn[ name ] = function( options ) {
		var isMethodCall = typeof options === "string",
			args = slice.call( arguments, 1 ),
			returnValue = this;

		// allow multiple hashes to be passed on init
		options = !isMethodCall && args.length ?
			$.widget.extend.apply( null, [ options ].concat(args) ) :
			options;

		if ( isMethodCall ) {
			this.each(function() {
				var methodValue,
					instance = $.data( this, fullName );
				if ( !instance ) {
					return $.error( "cannot call methods on " + name + " prior to initialization; " +
						"attempted to call method '" + options + "'" );
				}
				if ( !$.isFunction( instance[options] ) || options.charAt( 0 ) === "_" ) {
					return $.error( "no such method '" + options + "' for " + name + " widget instance" );
				}
				methodValue = instance[ options ].apply( instance, args );
				if ( methodValue !== instance && methodValue !== undefined ) {
					returnValue = methodValue && methodValue.jquery ?
						returnValue.pushStack( methodValue.get() ) :
						methodValue;
					return false;
				}
			});
		} else {
			this.each(function() {
				var instance = $.data( this, fullName );
				if ( instance ) {
					instance.option( options || {} )._init();
				} else {
					$.data( this, fullName, new object( options, this ) );
				}
			});
		}

		return returnValue;
	};
};

$.Widget = function( /* options, element */ ) {};
$.Widget._childConstructors = [];

$.Widget.prototype = {
	widgetName: "widget",
	widgetEventPrefix: "",
	defaultElement: "<div>",
	options: {
		disabled: false,

		// callbacks
		create: null
	},
	_createWidget: function( options, element ) {
		element = $( element || this.defaultElement || this )[ 0 ];
		this.element = $( element );
		this.uuid = uuid++;
		this.eventNamespace = "." + this.widgetName + this.uuid;
		this.options = $.widget.extend( {},
			this.options,
			this._getCreateOptions(),
			options );

		this.bindings = $();
		this.hoverable = $();
		this.focusable = $();

		if ( element !== this ) {
			$.data( element, this.widgetFullName, this );
			this._on( true, this.element, {
				remove: function( event ) {
					if ( event.target === element ) {
						this.destroy();
					}
				}
			});
			this.document = $( element.style ?
				// element within the document
				element.ownerDocument :
				// element is window or document
				element.document || element );
			this.window = $( this.document[0].defaultView || this.document[0].parentWindow );
		}

		this._create();
		this._trigger( "create", null, this._getCreateEventData() );
		this._init();
	},
	_getCreateOptions: $.noop,
	_getCreateEventData: $.noop,
	_create: $.noop,
	_init: $.noop,

	destroy: function() {
		this._destroy();
		// we can probably remove the unbind calls in 2.0
		// all event bindings should go through this._on()
		this.element
			.unbind( this.eventNamespace )
			// 1.9 BC for #7810
			// TODO remove dual storage
			.removeData( this.widgetName )
			.removeData( this.widgetFullName )
			// support: jquery <1.6.3
			// http://bugs.jquery.com/ticket/9413
			.removeData( $.camelCase( this.widgetFullName ) );
		this.widget()
			.unbind( this.eventNamespace )
			.removeAttr( "aria-disabled" )
			.removeClass(
				this.widgetFullName + "-disabled " +
				"ui-state-disabled" );

		// clean up events and states
		this.bindings.unbind( this.eventNamespace );
		this.hoverable.removeClass( "ui-state-hover" );
		this.focusable.removeClass( "ui-state-focus" );
	},
	_destroy: $.noop,

	widget: function() {
		return this.element;
	},

	option: function( key, value ) {
		var options = key,
			parts,
			curOption,
			i;

		if ( arguments.length === 0 ) {
			// don't return a reference to the internal hash
			return $.widget.extend( {}, this.options );
		}

		if ( typeof key === "string" ) {
			// handle nested keys, e.g., "foo.bar" => { foo: { bar: ___ } }
			options = {};
			parts = key.split( "." );
			key = parts.shift();
			if ( parts.length ) {
				curOption = options[ key ] = $.widget.extend( {}, this.options[ key ] );
				for ( i = 0; i < parts.length - 1; i++ ) {
					curOption[ parts[ i ] ] = curOption[ parts[ i ] ] || {};
					curOption = curOption[ parts[ i ] ];
				}
				key = parts.pop();
				if ( arguments.length === 1 ) {
					return curOption[ key ] === undefined ? null : curOption[ key ];
				}
				curOption[ key ] = value;
			} else {
				if ( arguments.length === 1 ) {
					return this.options[ key ] === undefined ? null : this.options[ key ];
				}
				options[ key ] = value;
			}
		}

		this._setOptions( options );

		return this;
	},
	_setOptions: function( options ) {
		var key;

		for ( key in options ) {
			this._setOption( key, options[ key ] );
		}

		return this;
	},
	_setOption: function( key, value ) {
		this.options[ key ] = value;

		if ( key === "disabled" ) {
			this.widget()
				.toggleClass( this.widgetFullName + "-disabled ui-state-disabled", !!value )
				.attr( "aria-disabled", value );
			this.hoverable.removeClass( "ui-state-hover" );
			this.focusable.removeClass( "ui-state-focus" );
		}

		return this;
	},

	enable: function() {
		return this._setOption( "disabled", false );
	},
	disable: function() {
		return this._setOption( "disabled", true );
	},

	_on: function( suppressDisabledCheck, element, handlers ) {
		var delegateElement,
			instance = this;

		// no suppressDisabledCheck flag, shuffle arguments
		if ( typeof suppressDisabledCheck !== "boolean" ) {
			handlers = element;
			element = suppressDisabledCheck;
			suppressDisabledCheck = false;
		}

		// no element argument, shuffle and use this.element
		if ( !handlers ) {
			handlers = element;
			element = this.element;
			delegateElement = this.widget();
		} else {
			// accept selectors, DOM elements
			element = delegateElement = $( element );
			this.bindings = this.bindings.add( element );
		}

		$.each( handlers, function( event, handler ) {
			function handlerProxy() {
				// allow widgets to customize the disabled handling
				// - disabled as an array instead of boolean
				// - disabled class as method for disabling individual parts
				if ( !suppressDisabledCheck &&
						( instance.options.disabled === true ||
							$( this ).hasClass( "ui-state-disabled" ) ) ) {
					return;
				}
				return ( typeof handler === "string" ? instance[ handler ] : handler )
					.apply( instance, arguments );
			}

			// copy the guid so direct unbinding works
			if ( typeof handler !== "string" ) {
				handlerProxy.guid = handler.guid =
					handler.guid || handlerProxy.guid || $.guid++;
			}

			var match = event.match( /^(\w+)\s*(.*)$/ ),
				eventName = match[1] + instance.eventNamespace,
				selector = match[2];
			if ( selector ) {
				delegateElement.delegate( selector, eventName, handlerProxy );
			} else {
				element.bind( eventName, handlerProxy );
			}
		});
	},

	_off: function( element, eventName ) {
		eventName = (eventName || "").split( " " ).join( this.eventNamespace + " " ) + this.eventNamespace;
		element.unbind( eventName ).undelegate( eventName );
	},

	_delay: function( handler, delay ) {
		function handlerProxy() {
			return ( typeof handler === "string" ? instance[ handler ] : handler )
				.apply( instance, arguments );
		}
		var instance = this;
		return setTimeout( handlerProxy, delay || 0 );
	},

	_hoverable: function( element ) {
		this.hoverable = this.hoverable.add( element );
		this._on( element, {
			mouseenter: function( event ) {
				$( event.currentTarget ).addClass( "ui-state-hover" );
			},
			mouseleave: function( event ) {
				$( event.currentTarget ).removeClass( "ui-state-hover" );
			}
		});
	},

	_focusable: function( element ) {
		this.focusable = this.focusable.add( element );
		this._on( element, {
			focusin: function( event ) {
				$( event.currentTarget ).addClass( "ui-state-focus" );
			},
			focusout: function( event ) {
				$( event.currentTarget ).removeClass( "ui-state-focus" );
			}
		});
	},

	_trigger: function( type, event, data ) {
		var prop, orig,
			callback = this.options[ type ];

		data = data || {};
		event = $.Event( event );
		event.type = ( type === this.widgetEventPrefix ?
			type :
			this.widgetEventPrefix + type ).toLowerCase();
		// the original event may come from any element
		// so we need to reset the target on the new event
		event.target = this.element[ 0 ];

		// copy original event properties over to the new event
		orig = event.originalEvent;
		if ( orig ) {
			for ( prop in orig ) {
				if ( !( prop in event ) ) {
					event[ prop ] = orig[ prop ];
				}
			}
		}

		this.element.trigger( event, data );
		return !( $.isFunction( callback ) &&
			callback.apply( this.element[0], [ event ].concat( data ) ) === false ||
			event.isDefaultPrevented() );
	}
};

$.each( { show: "fadeIn", hide: "fadeOut" }, function( method, defaultEffect ) {
	$.Widget.prototype[ "_" + method ] = function( element, options, callback ) {
		if ( typeof options === "string" ) {
			options = { effect: options };
		}
		var hasOptions,
			effectName = !options ?
				method :
				options === true || typeof options === "number" ?
					defaultEffect :
					options.effect || defaultEffect;
		options = options || {};
		if ( typeof options === "number" ) {
			options = { duration: options };
		}
		hasOptions = !$.isEmptyObject( options );
		options.complete = callback;
		if ( options.delay ) {
			element.delay( options.delay );
		}
		if ( hasOptions && $.effects && $.effects.effect[ effectName ] ) {
			element[ method ]( options );
		} else if ( effectName !== method && element[ effectName ] ) {
			element[ effectName ]( options.duration, options.easing, callback );
		} else {
			element.queue(function( next ) {
				$( this )[ method ]();
				if ( callback ) {
					callback.call( element[ 0 ] );
				}
				next();
			});
		}
	};
});

})( jQuery );
;
/*!
 * jQuery UI Mouse 1.10.4
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/mouse/
 *
 * Depends:
 *	jquery.ui.widget.js
 */
(function( $, undefined ) {

var mouseHandled = false;
$( document ).mouseup( function() {
	mouseHandled = false;
});

$.widget("ui.mouse", {
	version: "1.10.4",
	options: {
		cancel: "input,textarea,button,select,option",
		distance: 1,
		delay: 0
	},
	_mouseInit: function() {
		var that = this;

		this.element
			.bind("mousedown."+this.widgetName, function(event) {
				return that._mouseDown(event);
			})
			.bind("click."+this.widgetName, function(event) {
				if (true === $.data(event.target, that.widgetName + ".preventClickEvent")) {
					$.removeData(event.target, that.widgetName + ".preventClickEvent");
					event.stopImmediatePropagation();
					return false;
				}
			});

		this.started = false;
	},

	// TODO: make sure destroying one instance of mouse doesn't mess with
	// other instances of mouse
	_mouseDestroy: function() {
		this.element.unbind("."+this.widgetName);
		if ( this._mouseMoveDelegate ) {
			$(document)
				.unbind("mousemove."+this.widgetName, this._mouseMoveDelegate)
				.unbind("mouseup."+this.widgetName, this._mouseUpDelegate);
		}
	},

	_mouseDown: function(event) {
		// don't let more than one widget handle mouseStart
		if( mouseHandled ) { return; }

		// we may have missed mouseup (out of window)
		(this._mouseStarted && this._mouseUp(event));

		this._mouseDownEvent = event;

		var that = this,
			btnIsLeft = (event.which === 1),
			// event.target.nodeName works around a bug in IE 8 with
			// disabled inputs (#7620)
			elIsCancel = (typeof this.options.cancel === "string" && event.target.nodeName ? $(event.target).closest(this.options.cancel).length : false);
		if (!btnIsLeft || elIsCancel || !this._mouseCapture(event)) {
			return true;
		}

		this.mouseDelayMet = !this.options.delay;
		if (!this.mouseDelayMet) {
			this._mouseDelayTimer = setTimeout(function() {
				that.mouseDelayMet = true;
			}, this.options.delay);
		}

		if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
			this._mouseStarted = (this._mouseStart(event) !== false);
			if (!this._mouseStarted) {
				event.preventDefault();
				return true;
			}
		}

		// Click event may never have fired (Gecko & Opera)
		if (true === $.data(event.target, this.widgetName + ".preventClickEvent")) {
			$.removeData(event.target, this.widgetName + ".preventClickEvent");
		}

		// these delegates are required to keep context
		this._mouseMoveDelegate = function(event) {
			return that._mouseMove(event);
		};
		this._mouseUpDelegate = function(event) {
			return that._mouseUp(event);
		};
		$(document)
			.bind("mousemove."+this.widgetName, this._mouseMoveDelegate)
			.bind("mouseup."+this.widgetName, this._mouseUpDelegate);

		event.preventDefault();

		mouseHandled = true;
		return true;
	},

	_mouseMove: function(event) {
		// IE mouseup check - mouseup happened when mouse was out of window
		if ($.ui.ie && ( !document.documentMode || document.documentMode < 9 ) && !event.button) {
			return this._mouseUp(event);
		}

		if (this._mouseStarted) {
			this._mouseDrag(event);
			return event.preventDefault();
		}

		if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
			this._mouseStarted =
				(this._mouseStart(this._mouseDownEvent, event) !== false);
			(this._mouseStarted ? this._mouseDrag(event) : this._mouseUp(event));
		}

		return !this._mouseStarted;
	},

	_mouseUp: function(event) {
		$(document)
			.unbind("mousemove."+this.widgetName, this._mouseMoveDelegate)
			.unbind("mouseup."+this.widgetName, this._mouseUpDelegate);

		if (this._mouseStarted) {
			this._mouseStarted = false;

			if (event.target === this._mouseDownEvent.target) {
				$.data(event.target, this.widgetName + ".preventClickEvent", true);
			}

			this._mouseStop(event);
		}

		return false;
	},

	_mouseDistanceMet: function(event) {
		return (Math.max(
				Math.abs(this._mouseDownEvent.pageX - event.pageX),
				Math.abs(this._mouseDownEvent.pageY - event.pageY)
			) >= this.options.distance
		);
	},

	_mouseDelayMet: function(/* event */) {
		return this.mouseDelayMet;
	},

	// These are placeholder methods, to be overriden by extending plugin
	_mouseStart: function(/* event */) {},
	_mouseDrag: function(/* event */) {},
	_mouseStop: function(/* event */) {},
	_mouseCapture: function(/* event */) { return true; }
});

})(jQuery);
;
/*!
 * jQuery UI Position 1.10.4
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/position/
 */
(function( $, undefined ) {

$.ui = $.ui || {};

var cachedScrollbarWidth,
	max = Math.max,
	abs = Math.abs,
	round = Math.round,
	rhorizontal = /left|center|right/,
	rvertical = /top|center|bottom/,
	roffset = /[\+\-]\d+(\.[\d]+)?%?/,
	rposition = /^\w+/,
	rpercent = /%$/,
	_position = $.fn.position;

function getOffsets( offsets, width, height ) {
	return [
		parseFloat( offsets[ 0 ] ) * ( rpercent.test( offsets[ 0 ] ) ? width / 100 : 1 ),
		parseFloat( offsets[ 1 ] ) * ( rpercent.test( offsets[ 1 ] ) ? height / 100 : 1 )
	];
}

function parseCss( element, property ) {
	return parseInt( $.css( element, property ), 10 ) || 0;
}

function getDimensions( elem ) {
	var raw = elem[0];
	if ( raw.nodeType === 9 ) {
		return {
			width: elem.width(),
			height: elem.height(),
			offset: { top: 0, left: 0 }
		};
	}
	if ( $.isWindow( raw ) ) {
		return {
			width: elem.width(),
			height: elem.height(),
			offset: { top: elem.scrollTop(), left: elem.scrollLeft() }
		};
	}
	if ( raw.preventDefault ) {
		return {
			width: 0,
			height: 0,
			offset: { top: raw.pageY, left: raw.pageX }
		};
	}
	return {
		width: elem.outerWidth(),
		height: elem.outerHeight(),
		offset: elem.offset()
	};
}

$.position = {
	scrollbarWidth: function() {
		if ( cachedScrollbarWidth !== undefined ) {
			return cachedScrollbarWidth;
		}
		var w1, w2,
			div = $( "<div style='display:block;position:absolute;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>" ),
			innerDiv = div.children()[0];

		$( "body" ).append( div );
		w1 = innerDiv.offsetWidth;
		div.css( "overflow", "scroll" );

		w2 = innerDiv.offsetWidth;

		if ( w1 === w2 ) {
			w2 = div[0].clientWidth;
		}

		div.remove();

		return (cachedScrollbarWidth = w1 - w2);
	},
	getScrollInfo: function( within ) {
		var overflowX = within.isWindow || within.isDocument ? "" :
				within.element.css( "overflow-x" ),
			overflowY = within.isWindow || within.isDocument ? "" :
				within.element.css( "overflow-y" ),
			hasOverflowX = overflowX === "scroll" ||
				( overflowX === "auto" && within.width < within.element[0].scrollWidth ),
			hasOverflowY = overflowY === "scroll" ||
				( overflowY === "auto" && within.height < within.element[0].scrollHeight );
		return {
			width: hasOverflowY ? $.position.scrollbarWidth() : 0,
			height: hasOverflowX ? $.position.scrollbarWidth() : 0
		};
	},
	getWithinInfo: function( element ) {
		var withinElement = $( element || window ),
			isWindow = $.isWindow( withinElement[0] ),
			isDocument = !!withinElement[ 0 ] && withinElement[ 0 ].nodeType === 9;
		return {
			element: withinElement,
			isWindow: isWindow,
			isDocument: isDocument,
			offset: withinElement.offset() || { left: 0, top: 0 },
			scrollLeft: withinElement.scrollLeft(),
			scrollTop: withinElement.scrollTop(),
			width: isWindow ? withinElement.width() : withinElement.outerWidth(),
			height: isWindow ? withinElement.height() : withinElement.outerHeight()
		};
	}
};

$.fn.position = function( options ) {
	if ( !options || !options.of ) {
		return _position.apply( this, arguments );
	}

	// make a copy, we don't want to modify arguments
	options = $.extend( {}, options );

	var atOffset, targetWidth, targetHeight, targetOffset, basePosition, dimensions,
		target = $( options.of ),
		within = $.position.getWithinInfo( options.within ),
		scrollInfo = $.position.getScrollInfo( within ),
		collision = ( options.collision || "flip" ).split( " " ),
		offsets = {};

	dimensions = getDimensions( target );
	if ( target[0].preventDefault ) {
		// force left top to allow flipping
		options.at = "left top";
	}
	targetWidth = dimensions.width;
	targetHeight = dimensions.height;
	targetOffset = dimensions.offset;
	// clone to reuse original targetOffset later
	basePosition = $.extend( {}, targetOffset );

	// force my and at to have valid horizontal and vertical positions
	// if a value is missing or invalid, it will be converted to center
	$.each( [ "my", "at" ], function() {
		var pos = ( options[ this ] || "" ).split( " " ),
			horizontalOffset,
			verticalOffset;

		if ( pos.length === 1) {
			pos = rhorizontal.test( pos[ 0 ] ) ?
				pos.concat( [ "center" ] ) :
				rvertical.test( pos[ 0 ] ) ?
					[ "center" ].concat( pos ) :
					[ "center", "center" ];
		}
		pos[ 0 ] = rhorizontal.test( pos[ 0 ] ) ? pos[ 0 ] : "center";
		pos[ 1 ] = rvertical.test( pos[ 1 ] ) ? pos[ 1 ] : "center";

		// calculate offsets
		horizontalOffset = roffset.exec( pos[ 0 ] );
		verticalOffset = roffset.exec( pos[ 1 ] );
		offsets[ this ] = [
			horizontalOffset ? horizontalOffset[ 0 ] : 0,
			verticalOffset ? verticalOffset[ 0 ] : 0
		];

		// reduce to just the positions without the offsets
		options[ this ] = [
			rposition.exec( pos[ 0 ] )[ 0 ],
			rposition.exec( pos[ 1 ] )[ 0 ]
		];
	});

	// normalize collision option
	if ( collision.length === 1 ) {
		collision[ 1 ] = collision[ 0 ];
	}

	if ( options.at[ 0 ] === "right" ) {
		basePosition.left += targetWidth;
	} else if ( options.at[ 0 ] === "center" ) {
		basePosition.left += targetWidth / 2;
	}

	if ( options.at[ 1 ] === "bottom" ) {
		basePosition.top += targetHeight;
	} else if ( options.at[ 1 ] === "center" ) {
		basePosition.top += targetHeight / 2;
	}

	atOffset = getOffsets( offsets.at, targetWidth, targetHeight );
	basePosition.left += atOffset[ 0 ];
	basePosition.top += atOffset[ 1 ];

	return this.each(function() {
		var collisionPosition, using,
			elem = $( this ),
			elemWidth = elem.outerWidth(),
			elemHeight = elem.outerHeight(),
			marginLeft = parseCss( this, "marginLeft" ),
			marginTop = parseCss( this, "marginTop" ),
			collisionWidth = elemWidth + marginLeft + parseCss( this, "marginRight" ) + scrollInfo.width,
			collisionHeight = elemHeight + marginTop + parseCss( this, "marginBottom" ) + scrollInfo.height,
			position = $.extend( {}, basePosition ),
			myOffset = getOffsets( offsets.my, elem.outerWidth(), elem.outerHeight() );

		if ( options.my[ 0 ] === "right" ) {
			position.left -= elemWidth;
		} else if ( options.my[ 0 ] === "center" ) {
			position.left -= elemWidth / 2;
		}

		if ( options.my[ 1 ] === "bottom" ) {
			position.top -= elemHeight;
		} else if ( options.my[ 1 ] === "center" ) {
			position.top -= elemHeight / 2;
		}

		position.left += myOffset[ 0 ];
		position.top += myOffset[ 1 ];

		// if the browser doesn't support fractions, then round for consistent results
		if ( !$.support.offsetFractions ) {
			position.left = round( position.left );
			position.top = round( position.top );
		}

		collisionPosition = {
			marginLeft: marginLeft,
			marginTop: marginTop
		};

		$.each( [ "left", "top" ], function( i, dir ) {
			if ( $.ui.position[ collision[ i ] ] ) {
				$.ui.position[ collision[ i ] ][ dir ]( position, {
					targetWidth: targetWidth,
					targetHeight: targetHeight,
					elemWidth: elemWidth,
					elemHeight: elemHeight,
					collisionPosition: collisionPosition,
					collisionWidth: collisionWidth,
					collisionHeight: collisionHeight,
					offset: [ atOffset[ 0 ] + myOffset[ 0 ], atOffset [ 1 ] + myOffset[ 1 ] ],
					my: options.my,
					at: options.at,
					within: within,
					elem : elem
				});
			}
		});

		if ( options.using ) {
			// adds feedback as second argument to using callback, if present
			using = function( props ) {
				var left = targetOffset.left - position.left,
					right = left + targetWidth - elemWidth,
					top = targetOffset.top - position.top,
					bottom = top + targetHeight - elemHeight,
					feedback = {
						target: {
							element: target,
							left: targetOffset.left,
							top: targetOffset.top,
							width: targetWidth,
							height: targetHeight
						},
						element: {
							element: elem,
							left: position.left,
							top: position.top,
							width: elemWidth,
							height: elemHeight
						},
						horizontal: right < 0 ? "left" : left > 0 ? "right" : "center",
						vertical: bottom < 0 ? "top" : top > 0 ? "bottom" : "middle"
					};
				if ( targetWidth < elemWidth && abs( left + right ) < targetWidth ) {
					feedback.horizontal = "center";
				}
				if ( targetHeight < elemHeight && abs( top + bottom ) < targetHeight ) {
					feedback.vertical = "middle";
				}
				if ( max( abs( left ), abs( right ) ) > max( abs( top ), abs( bottom ) ) ) {
					feedback.important = "horizontal";
				} else {
					feedback.important = "vertical";
				}
				options.using.call( this, props, feedback );
			};
		}

		elem.offset( $.extend( position, { using: using } ) );
	});
};

$.ui.position = {
	fit: {
		left: function( position, data ) {
			var within = data.within,
				withinOffset = within.isWindow ? within.scrollLeft : within.offset.left,
				outerWidth = within.width,
				collisionPosLeft = position.left - data.collisionPosition.marginLeft,
				overLeft = withinOffset - collisionPosLeft,
				overRight = collisionPosLeft + data.collisionWidth - outerWidth - withinOffset,
				newOverRight;

			// element is wider than within
			if ( data.collisionWidth > outerWidth ) {
				// element is initially over the left side of within
				if ( overLeft > 0 && overRight <= 0 ) {
					newOverRight = position.left + overLeft + data.collisionWidth - outerWidth - withinOffset;
					position.left += overLeft - newOverRight;
				// element is initially over right side of within
				} else if ( overRight > 0 && overLeft <= 0 ) {
					position.left = withinOffset;
				// element is initially over both left and right sides of within
				} else {
					if ( overLeft > overRight ) {
						position.left = withinOffset + outerWidth - data.collisionWidth;
					} else {
						position.left = withinOffset;
					}
				}
			// too far left -> align with left edge
			} else if ( overLeft > 0 ) {
				position.left += overLeft;
			// too far right -> align with right edge
			} else if ( overRight > 0 ) {
				position.left -= overRight;
			// adjust based on position and margin
			} else {
				position.left = max( position.left - collisionPosLeft, position.left );
			}
		},
		top: function( position, data ) {
			var within = data.within,
				withinOffset = within.isWindow ? within.scrollTop : within.offset.top,
				outerHeight = data.within.height,
				collisionPosTop = position.top - data.collisionPosition.marginTop,
				overTop = withinOffset - collisionPosTop,
				overBottom = collisionPosTop + data.collisionHeight - outerHeight - withinOffset,
				newOverBottom;

			// element is taller than within
			if ( data.collisionHeight > outerHeight ) {
				// element is initially over the top of within
				if ( overTop > 0 && overBottom <= 0 ) {
					newOverBottom = position.top + overTop + data.collisionHeight - outerHeight - withinOffset;
					position.top += overTop - newOverBottom;
				// element is initially over bottom of within
				} else if ( overBottom > 0 && overTop <= 0 ) {
					position.top = withinOffset;
				// element is initially over both top and bottom of within
				} else {
					if ( overTop > overBottom ) {
						position.top = withinOffset + outerHeight - data.collisionHeight;
					} else {
						position.top = withinOffset;
					}
				}
			// too far up -> align with top
			} else if ( overTop > 0 ) {
				position.top += overTop;
			// too far down -> align with bottom edge
			} else if ( overBottom > 0 ) {
				position.top -= overBottom;
			// adjust based on position and margin
			} else {
				position.top = max( position.top - collisionPosTop, position.top );
			}
		}
	},
	flip: {
		left: function( position, data ) {
			var within = data.within,
				withinOffset = within.offset.left + within.scrollLeft,
				outerWidth = within.width,
				offsetLeft = within.isWindow ? within.scrollLeft : within.offset.left,
				collisionPosLeft = position.left - data.collisionPosition.marginLeft,
				overLeft = collisionPosLeft - offsetLeft,
				overRight = collisionPosLeft + data.collisionWidth - outerWidth - offsetLeft,
				myOffset = data.my[ 0 ] === "left" ?
					-data.elemWidth :
					data.my[ 0 ] === "right" ?
						data.elemWidth :
						0,
				atOffset = data.at[ 0 ] === "left" ?
					data.targetWidth :
					data.at[ 0 ] === "right" ?
						-data.targetWidth :
						0,
				offset = -2 * data.offset[ 0 ],
				newOverRight,
				newOverLeft;

			if ( overLeft < 0 ) {
				newOverRight = position.left + myOffset + atOffset + offset + data.collisionWidth - outerWidth - withinOffset;
				if ( newOverRight < 0 || newOverRight < abs( overLeft ) ) {
					position.left += myOffset + atOffset + offset;
				}
			}
			else if ( overRight > 0 ) {
				newOverLeft = position.left - data.collisionPosition.marginLeft + myOffset + atOffset + offset - offsetLeft;
				if ( newOverLeft > 0 || abs( newOverLeft ) < overRight ) {
					position.left += myOffset + atOffset + offset;
				}
			}
		},
		top: function( position, data ) {
			var within = data.within,
				withinOffset = within.offset.top + within.scrollTop,
				outerHeight = within.height,
				offsetTop = within.isWindow ? within.scrollTop : within.offset.top,
				collisionPosTop = position.top - data.collisionPosition.marginTop,
				overTop = collisionPosTop - offsetTop,
				overBottom = collisionPosTop + data.collisionHeight - outerHeight - offsetTop,
				top = data.my[ 1 ] === "top",
				myOffset = top ?
					-data.elemHeight :
					data.my[ 1 ] === "bottom" ?
						data.elemHeight :
						0,
				atOffset = data.at[ 1 ] === "top" ?
					data.targetHeight :
					data.at[ 1 ] === "bottom" ?
						-data.targetHeight :
						0,
				offset = -2 * data.offset[ 1 ],
				newOverTop,
				newOverBottom;
			if ( overTop < 0 ) {
				newOverBottom = position.top + myOffset + atOffset + offset + data.collisionHeight - outerHeight - withinOffset;
				if ( ( position.top + myOffset + atOffset + offset) > overTop && ( newOverBottom < 0 || newOverBottom < abs( overTop ) ) ) {
					position.top += myOffset + atOffset + offset;
				}
			}
			else if ( overBottom > 0 ) {
				newOverTop = position.top - data.collisionPosition.marginTop + myOffset + atOffset + offset - offsetTop;
				if ( ( position.top + myOffset + atOffset + offset) > overBottom && ( newOverTop > 0 || abs( newOverTop ) < overBottom ) ) {
					position.top += myOffset + atOffset + offset;
				}
			}
		}
	},
	flipfit: {
		left: function() {
			$.ui.position.flip.left.apply( this, arguments );
			$.ui.position.fit.left.apply( this, arguments );
		},
		top: function() {
			$.ui.position.flip.top.apply( this, arguments );
			$.ui.position.fit.top.apply( this, arguments );
		}
	}
};

// fraction support test
(function () {
	var testElement, testElementParent, testElementStyle, offsetLeft, i,
		body = document.getElementsByTagName( "body" )[ 0 ],
		div = document.createElement( "div" );

	//Create a "fake body" for testing based on method used in jQuery.support
	testElement = document.createElement( body ? "div" : "body" );
	testElementStyle = {
		visibility: "hidden",
		width: 0,
		height: 0,
		border: 0,
		margin: 0,
		background: "none"
	};
	if ( body ) {
		$.extend( testElementStyle, {
			position: "absolute",
			left: "-1000px",
			top: "-1000px"
		});
	}
	for ( i in testElementStyle ) {
		testElement.style[ i ] = testElementStyle[ i ];
	}
	testElement.appendChild( div );
	testElementParent = body || document.documentElement;
	testElementParent.insertBefore( testElement, testElementParent.firstChild );

	div.style.cssText = "position: absolute; left: 10.7432222px;";

	offsetLeft = $( div ).offset().left;
	$.support.offsetFractions = offsetLeft > 10 && offsetLeft < 11;

	testElement.innerHTML = "";
	testElementParent.removeChild( testElement );
})();

}( jQuery ) );
;
/*!
 * Fluid Infusion v2.0
 *
 * Infusion is distributed under the Educational Community License 2.0 and new BSD licenses:
 * http://wiki.fluidproject.org/display/fluid/Fluid+Licensing
 *
 * For information on copyright, see the individual Infusion source code files:
 * https://github.com/fluid-project/infusion/
 */
/*
Copyright 2007-2010 University of Cambridge
Copyright 2007-2009 University of Toronto
Copyright 2007-2009 University of California, Berkeley
Copyright 2010-2011 Lucendo Development Ltd.
Copyright 2010 OCAD University
Copyright 2011 Charly Molter
Copyright 2014-2015 Raising the Floor - International

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

/* global console */

var fluid_2_0_0 = fluid_2_0_0 || {};
var fluid = fluid || fluid_2_0_0;

(function ($, fluid) {
    "use strict";

    fluid.version = "Infusion 2.0.0";

    // Export this for use in environments like node.js, where it is useful for
    // configuring stack trace behaviour
    fluid.Error = Error;

    fluid.environment = {
        fluid: fluid
    };

    fluid.global = fluid.global || typeof window !== "undefined" ?
        window : typeof self !== "undefined" ? self : {};

    // A standard utility to schedule the invocation of a function after the current
    // stack returns. On browsers this defaults to setTimeout(func, 1) but in
    // other environments can be customised - e.g. to process.nextTick in node.js
    // In future, this could be optimised in the browser to not dispatch into the event queue
    fluid.invokeLater = function (func) {
        return setTimeout(func, 1);
    };

    // The following flag defeats all logging/tracing activities in the most performance-critical parts of the framework.
    // This should really be performed by a build-time step which eliminates calls to pushActivity/popActivity and fluid.log.
    fluid.defeatLogging = true;

    // This flag enables the accumulating of all "activity" records generated by pushActivity into a running trace, rather
    // than removing them from the stack record permanently when receiving popActivity. This trace will be consumed by
    // visual debugging tools.
    fluid.activityTracing = false;
    fluid.activityTrace = [];

    var activityParser = /(%\w+)/g;

    // Renders a single activity element in a form suitable to be sent to a modern browser's console
    // unsupported, non-API function
    fluid.renderOneActivity = function (activity, nowhile) {
        var togo = nowhile === true ? [] : ["    while "];
        var message = activity.message;
        var index = activityParser.lastIndex = 0;
        while (true) {
            var match = activityParser.exec(message);
            if (match) {
                var key = match[1].substring(1);
                togo.push(message.substring(index, match.index));
                togo.push(activity.args[key]);
                index = activityParser.lastIndex;
            }
            else {
                break;
            }
        }
        if (index < message.length) {
            togo.push(message.substring(index));
        }
        return togo;
    };

    // Renders an activity stack in a form suitable to be sent to a modern browser's console
    // unsupported, non-API function
    fluid.renderActivity = function (activityStack, renderer) {
        renderer = renderer || fluid.renderOneActivity;
        return fluid.transform(activityStack, renderer);
    };

    // Definitions for ThreadLocals - lifted here from
    // FluidIoC.js so that we can issue calls to fluid.describeActivity for debugging purposes
    // in the core framework

    // unsupported, non-API function
    fluid.singleThreadLocal = function (initFunc) {
        var value = initFunc();
        return function (newValue) {
            return newValue === undefined ? value : value = newValue;
        };
    };

    // Currently we only support single-threaded environments - ensure that this function
    // is not used on startup so it can be successfully monkey-patched
    // only remaining uses of threadLocals are for activity reporting and in the renderer utilities
    // unsupported, non-API function
    fluid.threadLocal = fluid.singleThreadLocal;

    // unsupported, non-API function
    fluid.globalThreadLocal = fluid.threadLocal(function () {
        return {};
    });

    // Return an array of objects describing the current activity
    // unsupported, non-API function
    fluid.getActivityStack = function () {
        var root = fluid.globalThreadLocal();
        if (!root.activityStack) {
            root.activityStack = [];
        }
        return root.activityStack;
    };

    // Return an array of objects describing the current activity
    // unsupported, non-API function
    fluid.describeActivity = fluid.getActivityStack;

    // Renders either the current activity or the supplied activity to the console
    fluid.logActivity = function (activity) {
        activity = activity || fluid.describeActivity();
        var rendered = fluid.renderActivity(activity).reverse();
        fluid.log("Current activity: ");
        fluid.each(rendered, function (args) {
            fluid.doLog(args);
        });
    };

    // Execute the supplied function with the specified activity description pushed onto the stack
    // unsupported, non-API function
    fluid.pushActivity = function (type, message, args) {
        var record = {type: type, message: message, args: args, time: new Date().getTime()};
        if (fluid.activityTracing) {
            fluid.activityTrace.push(record);
        }
        if (fluid.passLogLevel(fluid.logLevel.TRACE)) {
            fluid.doLog(fluid.renderOneActivity(record, true));
        }
        var activityStack = fluid.getActivityStack();
        activityStack.push(record);
    };

    // Undo the effect of the most recent pushActivity, or multiple frames if an argument is supplied
    fluid.popActivity = function (popframes) {
        popframes = popframes || 1;
        if (fluid.activityTracing) {
            fluid.activityTrace.push({pop: popframes});
        }
        var activityStack = fluid.getActivityStack();
        var popped = activityStack.length - popframes;
        activityStack.length = popped < 0 ? 0 : popped;
    };
    // "this-ist" style Error so that we can distinguish framework errors whilst still retaining access to platform Error features
    // Solution taken from http://stackoverflow.com/questions/8802845/inheriting-from-the-error-object-where-is-the-message-property#answer-17936621
    fluid.FluidError = function (/*message*/) {
        var togo = Error.apply(this, arguments);
        this.message = togo.message;
        try { // This technique is necessary on IE11 since otherwise the stack entry is not filled in
            throw togo;
        } catch (togo) {
            this.stack = togo.stack;
        }
        return this;
    };
    fluid.FluidError.prototype = Object.create(Error.prototype);

    // The framework's built-in "log" failure handler - this logs the supplied message as well as any framework activity in progress via fluid.log
    fluid.logFailure = function (args, activity) {
        fluid.log.apply(null, [fluid.logLevel.FAIL, "ASSERTION FAILED: "].concat(args));
        fluid.logActivity(activity);
    };

    fluid.renderLoggingArg = function (arg) {
        return fluid.isPrimitive(arg) || !fluid.isPlainObject(arg) ? arg : JSON.stringify(arg);
    };

    // The framework's built-in "fail" failure handler - this throws an exception of type <code>fluid.FluidError</code>
    fluid.builtinFail = function (args /*, activity*/) {
        var message = fluid.transform(args, fluid.renderLoggingArg).join("");
        throw new fluid.FluidError("Assertion failure - check console for more details: " + message);
    };

    /**
     * Signals an error to the framework. The default behaviour is to log a structured error message and throw an exception. This strategy may be configured using the legacy
     * API <code>fluid.pushSoftFailure</code> or else by adding and removing suitably namespaced listeners to the special event <code>fluid.failureEvent</code>
     *
     * @param {String} message the error message to log
     * @param ... Additional arguments, suitable for being sent to the native console.log function
     */
    fluid.fail = function (/* message, ... */) {
        var args = fluid.makeArray(arguments);
        var activity = fluid.makeArray(fluid.describeActivity()); // Take copy since we will destructively modify
        fluid.popActivity(activity.length); // clear any current activity - TODO: the framework currently has no exception handlers, although it will in time
        if (fluid.failureEvent) { // notify any framework failure prior to successfully setting up the failure event below
            fluid.failureEvent.fire(args, activity);
        } else {
            fluid.logFailure(args, activity);
            fluid.builtinFail(args, activity);
        }
    };

    // TODO: rescued from kettleCouchDB.js - clean up in time
    fluid.expect = function (name, target, members) {
        fluid.transform(fluid.makeArray(members), function (key) {
            if (typeof target[key] === "undefined") {
                fluid.fail(name + " missing required parameter " + key);
            }
        });
    };

    // Logging

    /** Returns whether logging is enabled **/
    fluid.isLogging = function () {
        return logLevelStack[0].priority > fluid.logLevel.IMPORTANT.priority;
    };

    /** Determines whether the supplied argument is a valid logLevel marker **/
    fluid.isLogLevel = function (arg) {
        return fluid.isMarker(arg) && arg.priority !== undefined;
    };

    /** Accepts one of the members of the <code>fluid.logLevel</code> structure. Returns <code>true</code> if
     *  a message supplied at that log priority would be accepted at the current logging level. Clients who
     *  issue particularly expensive log payload arguments are recommended to guard their logging statements with this
     *  function */

    fluid.passLogLevel = function (testLogLevel) {
        return testLogLevel.priority <= logLevelStack[0].priority;
    };

    /** Method to allow user to control the logging level. Accepts either a boolean, for which <code>true</code>
      * represents <code>fluid.logLevel.INFO</code> and <code>false</code> represents <code>fluid.logLevel.IMPORTANT</code> (the default),
      * or else any other member of the structure <code>fluid.logLevel</code>
      * Messages whose priority is strictly less than the current logging level will not be shown*/
    fluid.setLogging = function (enabled) {
        var logLevel;
        if (typeof enabled === "boolean") {
            logLevel = fluid.logLevel[enabled ? "INFO" : "IMPORTANT"];
        } else if (fluid.isLogLevel(enabled)) {
            logLevel = enabled;
        } else {
            fluid.fail("Unrecognised fluid logging level ", enabled);
        }
        logLevelStack.unshift(logLevel);
        fluid.defeatLogging = !fluid.isLogging();
    };

    fluid.setLogLevel = fluid.setLogging;

    /** Undo the effect of the most recent "setLogging", returning the logging system to its previous state **/
    fluid.popLogging = function () {
        var togo = logLevelStack.length === 1 ? logLevelStack[0] : logLevelStack.shift();
        fluid.defeatLogging = !fluid.isLogging();
        return togo;
    };

    /** Actually do the work of logging <code>args</code> to the environment's console. If the standard "console"
     * stream is available, the message will be sent there.
     */
    fluid.doLog = function (args) {
        if (typeof (console) !== "undefined") {
            if (console.debug) {
                console.debug.apply(console, args);
            } else if (typeof (console.log) === "function") {
                console.log.apply(console, args);
            }
        }
    };

    /** Log a message to a suitable environmental console. If the first argument to fluid.log is
     * one of the members of the <code>fluid.logLevel</code> structure, this will be taken as the priority
     * of the logged message - else if will default to <code>fluid.logLevel.INFO</code>. If the logged message
     * priority does not exceed that set by the most recent call to the <code>fluid.setLogging</code> function,
     * the message will not appear.
     */
    fluid.log = function (/* message /*, ... */) {
        var directArgs = fluid.makeArray(arguments);
        var userLogLevel = fluid.logLevel.INFO;
        if (fluid.isLogLevel(directArgs[0])) {
            userLogLevel = directArgs.shift();
        }
        if (fluid.passLogLevel(userLogLevel)) {
            var arg0 = fluid.renderTimestamp(new Date()) + ":  ";
            var args = [arg0].concat(directArgs);
            fluid.doLog(args);
        }
    };

    // Functional programming utilities.

    // Type checking functions

    /** Returns true if the argument is a value other than null or undefined **/
    fluid.isValue = function (value) {
        return value !== undefined && value !== null;
    };

    /** Returns true if the argument is a primitive type **/
    fluid.isPrimitive = function (value) {
        var valueType = typeof (value);
        return !value || valueType === "string" || valueType === "boolean" || valueType === "number" || valueType === "function";
    };

    /** Determines whether the supplied object is an array. The strategy used is an optimised
     * approach taken from an earlier version of jQuery - detecting whether the toString() version
     * of the object agrees with the textual form [object Array], or else whether the object is a
     * jQuery object (the most common source of "fake arrays").
     */
    fluid.isArrayable = function (totest) {
        return totest && (totest.jquery || Object.prototype.toString.call(totest) === "[object Array]");
    };

    /** Determines whether the supplied object is a plain JSON-forming container - that is, it is either a plain Object
     * or a plain Array. Note that this differs from jQuery's isPlainObject which does not pass Arrays.
     * @param totest {Any} The object to be tested
     * @param strict {Boolean} (optional) If `true`, plain Arrays will fail the test rather than passing.
     */
    fluid.isPlainObject = function (totest, strict) {
        var string = Object.prototype.toString.call(totest);
        if (string === "[object Array]") {
            return !strict;
        } else if (string !== "[object Object]") {
            return false;
        } // FLUID-5226: This inventive strategy taken from jQuery detects whether the object's prototype is directly Object.prototype by virtue of having an "isPrototypeOf" direct member
        return !totest.constructor || !totest.constructor.prototype || Object.prototype.hasOwnProperty.call(totest.constructor.prototype, "isPrototypeOf");
    };

    /** Returns <code>primitive</code>, <code>array</code> or <code>object</code> depending on whether the supplied object has
     * one of those types, by use of the <code>fluid.isPrimitive</code>, <code>fluid.isPlainObject</code> and <code>fluid.isArrayable</code> utilities
     */
    fluid.typeCode = function (totest) {
        return fluid.isPrimitive(totest) || !fluid.isPlainObject(totest) ? "primitive" :
            fluid.isArrayable(totest) ? "array" : "object";
    };

    fluid.isIoCReference = function (ref) {
        return typeof(ref) === "string" && ref.charAt(0) === "{" && ref.indexOf("}") > 0;
    };

    fluid.isDOMNode = function (obj) {
      // This could be more sound, but messy:
      // http://stackoverflow.com/questions/384286/javascript-isdom-how-do-you-check-if-a-javascript-object-is-a-dom-object
      // The real problem is browsers like IE6, 7 and 8 which still do not feature a "constructor" property on DOM nodes
        return obj && typeof (obj.nodeType) === "number";
    };

    fluid.isComponent = function (obj) {
        return obj && obj.constructor === fluid.componentConstructor;
    };

    /** A basic utility that returns its argument unchanged */

    fluid.identity = function (arg) {
        return arg;
    };

    /** A function which raises a failure if executed */

    fluid.notImplemented = function () {
        fluid.fail("This operation is not implemented");
    };

    /** Return an empty container as the same type as the argument (either an
     * array or hash */
    fluid.freshContainer = function (tocopy) {
        return fluid.isArrayable(tocopy) ? [] : {};
    };

    fluid.isUncopyable = function (totest) {
        return fluid.isPrimitive(totest) || !fluid.isPlainObject(totest);
    };

    fluid.isApplicable = function (totest) {
        return totest.apply && typeof(totest.apply) === "function";
    };

    fluid.copyRecurse = function (tocopy, segs) {
        if (segs.length > fluid.strategyRecursionBailout) {
            fluid.fail("Runaway recursion encountered in fluid.copy - reached path depth of " + fluid.strategyRecursionBailout + " via path of " + segs.join(".") +
                "this object is probably circularly connected. Either adjust your object structure to remove the circularity or increase fluid.strategyRecursionBailout");
        }
        if (fluid.isUncopyable(tocopy)) {
            return tocopy;
        } else {
            return fluid.transform(tocopy, function (value, key) {
                segs.push(key);
                var togo = fluid.copyRecurse(value, segs);
                segs.pop();
                return togo;
            });
        }
    };

    /** Performs a deep copy (clone) of its argument. This will guard against cloning a circular object by terminating if it reaches a path depth
     * greater than <code>fluid.strategyRecursionBailout</code>
     **/

    fluid.copy = function (tocopy) {
        return fluid.copyRecurse(tocopy, []);
    };

    // TODO: Coming soon - reimplementation of $.extend using strategyRecursionBailout
    fluid.extend = $.extend;

    /** Corrected version of jQuery makeArray that returns an empty array on undefined rather than crashing.
      * We don't deal with as many pathological cases as jQuery **/
    fluid.makeArray = function (arg) {
        var togo = [];
        if (arg !== null && arg !== undefined) {
            if (fluid.isPrimitive(arg) || typeof(arg.length) !== "number") {
                togo.push(arg);
            }
            else {
                for (var i = 0; i < arg.length; ++i) {
                    togo[i] = arg[i];
                }
            }
        }
        return togo;
    };

    /** Pushes an element or elements onto an array, initialising the array as a member of a holding object if it is
     * not already allocated.
     * @param holder {Array or Object} The holding object whose member is to receive the pushed element(s).
     * @param member {String} The member of the <code>holder</code> onto which the element(s) are to be pushed
     * @param topush {Array or Object} If an array, these elements will be added to the end of the array using Array.push.apply. If an object, it will be pushed to the end of the array using Array.push.
     */
    fluid.pushArray = function (holder, member, topush) {
        var array = holder[member] ? holder[member] : (holder[member] = []);
        if (fluid.isArrayable(topush)) {
            array.push.apply(array, topush);
        } else {
            array.push(topush);
        }
    };

    function transformInternal(source, togo, key, args) {
        var transit = source[key];
        for (var j = 0; j < args.length - 1; ++j) {
            transit = args[j + 1](transit, key);
        }
        togo[key] = transit;
    }

    /** Return an array or hash of objects, transformed by one or more functions. Similar to
     * jQuery.map, only will accept an arbitrary list of transformation functions and also
     * works on non-arrays.
     * @param source {Array or Object} The initial container of objects to be transformed. If the source is
     * neither an array nor an object, it will be returned untransformed
     * @param fn1, fn2, etc. {Function} An arbitrary number of optional further arguments,
     * all of type Function, accepting the signature (object, index), where object is the
     * structure member to be transformed, and index is its key or index. Each function will be
     * applied in turn to each structure member, which will be replaced by the return value
     * from the function.
     * @return The finally transformed list, where each member has been replaced by the
     * original member acted on by the function or functions.
     */
    fluid.transform = function (source) {
        if (fluid.isPrimitive(source)) {
            return source;
        }
        var togo = fluid.freshContainer(source);
        if (fluid.isArrayable(source)) {
            for (var i = 0; i < source.length; ++i) {
                transformInternal(source, togo, i, arguments);
            }
        } else {
            for (var key in source) {
                transformInternal(source, togo, key, arguments);
            }
        }
        return togo;
    };

    /** Better jQuery.each which works on hashes as well as having the arguments
     * the right way round.
     * @param source {Arrayable or Object} The container to be iterated over
     * @param func {Function} A function accepting (value, key) for each iterated
     * object.
     */
    fluid.each = function (source, func) {
        if (fluid.isArrayable(source)) {
            for (var i = 0; i < source.length; ++i) {
                func(source[i], i);
            }
        } else {
            for (var key in source) {
                func(source[key], key);
            }
        }
    };

    fluid.make_find = function (find_if) {
        var target = find_if ? false : undefined;
        return function (source, func, deffolt) {
            var disp;
            if (fluid.isArrayable(source)) {
                for (var i = 0; i < source.length; ++i) {
                    disp = func(source[i], i);
                    if (disp !== target) {
                        return find_if ? source[i] : disp;
                    }
                }
            } else {
                for (var key in source) {
                    disp = func(source[key], key);
                    if (disp !== target) {
                        return find_if ? source[key] : disp;
                    }
                }
            }
            return deffolt;
        };
    };

    /** Scan through an array or hash of objects, terminating on the first member which
     * matches a predicate function.
     * @param source {Arrayable or Object} The array or hash of objects to be searched.
     * @param func {Function} A predicate function, acting on a member. A predicate which
     * returns any value which is not <code>undefined</code> will terminate
     * the search. The function accepts (object, index).
     * @param deflt {Object} A value to be returned in the case no predicate function matches
     * a structure member. The default will be the natural value of <code>undefined</code>
     * @return The first return value from the predicate function which is not <code>undefined</code>
     */
    fluid.find = fluid.make_find(false);
    /** The same signature as fluid.find, only the return value is the actual element for which the
     * predicate returns a value different from <code>false</code>
     */
    fluid.find_if = fluid.make_find(true);

    /** Scan through an array of objects, "accumulating" a value over them
     * (may be a straightforward "sum" or some other chained computation). "accumulate" is the name derived
     * from the C++ STL, other names for this algorithm are "reduce" or "fold".
     * @param list {Array} The list of objects to be accumulated over.
     * @param fn {Function} An "accumulation function" accepting the signature (object, total, index) where
     * object is the list member, total is the "running total" object (which is the return value from the previous function),
     * and index is the index number.
     * @param arg {Object} The initial value for the "running total" object.
     * @return {Object} the final running total object as returned from the final invocation of the function on the last list member.
     */
    fluid.accumulate = function (list, fn, arg) {
        for (var i = 0; i < list.length; ++i) {
            arg = fn(list[i], arg, i);
        }
        return arg;
    };

    /** Returns the sum of its two arguments. A useful utility to combine with fluid.accumulate to compute totals
     * @param a {Number|Boolean} The first operand to be added
     * @param b {Number|Boolean} The second operand to be added
     * @return {Number} The sum of the two operands
     **/
    fluid.add = function (a, b) {
        return a + b;
    };

    /** Scan through an array or hash of objects, removing those which match a predicate. Similar to
     * jQuery.grep, only acts on the list in-place by removal, rather than by creating
     * a new list by inclusion.
     * @param source {Array|Object} The array or hash of objects to be scanned over. Note that in the case this is an array,
     * the iteration will proceed from the end of the array towards the front.
     * @param fn {Function} A predicate function determining whether an element should be
     * removed. This accepts the standard signature (object, index) and returns a "truthy"
     * result in order to determine that the supplied object should be removed from the structure.
     * @param target {Array|Object} (optional) A target object of the same type as <code>source</code>, which will
     * receive any objects removed from it.
     * @return <code>target</code>, containing the removed elements, if it was supplied, or else <code>source</code>
     * modified by the operation of removing the matched elements.
     */
    fluid.remove_if = function (source, fn, target) {
        if (fluid.isArrayable(source)) {
            for (var i = source.length - 1; i >= 0; --i) {
                if (fn(source[i], i)) {
                    if (target) {
                        target.unshift(source[i]);
                    }
                    source.splice(i, 1);
                }
            }
        } else {
            for (var key in source) {
                if (fn(source[key], key)) {
                    if (target) {
                        target[key] = source[key];
                    }
                    delete source[key];
                }
            }
        }
        return target || source;
    };

    /** Fills an array of given size with copies of a value or result of a function invocation
     * @param n {Number} The size of the array to be filled
     * @param generator {Object|Function} Either a value to be replicated or function to be called
     * @param applyFunc {Boolean} If true, treat the generator value as a function to be invoked with
     * argument equal to the index position
     */

    fluid.generate = function (n, generator, applyFunc) {
        var togo = [];
        for (var i = 0; i < n; ++i) {
            togo[i] = applyFunc ? generator(i) : generator;
        }
        return togo;
    };

    /** Returns an array of size count, filled with increasing integers, starting at 0 or at the index specified by first.
     * @param count {Number} Size of the filled array to be returned
     * @param first {Number} (optional, defaults to 0) First element to appear in the array
     */

    fluid.iota = function (count, first) {
        first = first || 0;
        var togo = [];
        for (var i = 0; i < count; ++i) {
            togo[togo.length] = first++;
        }
        return togo;
    };

    /** Extracts a particular member from each top-level member of a container, returning a new container of the same type
     * @param holder {Array|Object} The container to be filtered
     * @param name {String|Array of String} An EL path to be fetched from each top-level member
     */

    fluid.getMembers = function (holder, name) {
        return fluid.transform(holder, function (member) {
            return fluid.get(member, name);
        });
    };

    /** Accepts an object to be filtered, and an array of keys. Either all keys not present in
     * the array are removed, or only keys present in the array are returned.
     * @param toFilter {Array|Object} The object to be filtered - this will be NOT modified by the operation (current implementation
     * passes through $.extend shallow algorithm)
     * @param keys {Array of String} The array of keys to operate with
     * @param exclude {boolean} If <code>true</code>, the keys listed are removed rather than included
     * @return the filtered object (the same object that was supplied as <code>toFilter</code>
     */

    fluid.filterKeys = function (toFilter, keys, exclude) {
        return fluid.remove_if($.extend({}, toFilter), function (value, key) {
            return exclude ^ (keys.indexOf(key) === -1);
        });
    };

    /** A convenience wrapper for <code>fluid.filterKeys</code> with the parameter <code>exclude</code> set to <code>true</code>
     *  Returns the supplied object with listed keys removed */

    fluid.censorKeys = function (toCensor, keys) {
        return fluid.filterKeys(toCensor, keys, true);
    };

    // TODO: This is not as clever an idea as we think it is - this typically inner-loop function will optimise badly due to closure
    fluid.makeFlatten = function (index) {
        return function (obj) {
            var togo = [];
            fluid.each(obj, function (/* value, key */) {
                togo.push(arguments[index]);
            });
            return togo;
        };
    };

    /** Return the keys in the supplied object as an array. Note that this will return keys found in the prototype chain as well as "own properties", unlike Object.keys() **/
    fluid.keys = fluid.makeFlatten(1);

    /** Return the values in the supplied object as an array **/
    fluid.values = fluid.makeFlatten(0);

    /**
     * Searches through the supplied object, and returns <code>true</code> if the supplied value
     * can be found
     */
    fluid.contains = function (obj, value) {
        return obj ? (fluid.isArrayable(obj) ? obj.indexOf(value) !== -1 : fluid.find(obj, function (thisValue) {
            if (value === thisValue) {
                return true;
            }
        })) : undefined;
    };

    /**
     * Searches through the supplied object for the first value which matches the one supplied.
     * @param obj {Object} the Object to be searched through
     * @param value {Object} the value to be found. This will be compared against the object's
     * member using === equality.
     * @return {String} The first key whose value matches the one supplied
     */
    fluid.keyForValue = function (obj, value) {
        return fluid.find(obj, function (thisValue, key) {
            if (value === thisValue) {
                return key;
            }
        });
    };

    /** Converts an array into an object whose keys are the elements of the array, each with the value "true"
     * @param array {Array of String} The array to be converted to a hash
     * @return hash {Object} An object with value <code>true</code> for each key taken from a member of <code>array</code>
     */

    fluid.arrayToHash = function (array) {
        var togo = {};
        fluid.each(array, function (el) {
            togo[el] = true;
        });
        return togo;
    };

    /** Applies a stable sorting algorithm to the supplied array and comparator (note that Array.sort in JavaScript is not specified
     * to be stable). The algorithm used will be an insertion sort, which whilst quadratic in time, will perform well
     * on small array sizes.
     * @param array {Array} The array to be sorted. This input array will be modified in place.
     * @param func {Function} A comparator returning >0, 0, or <0 on pairs of elements representing their sort order (same contract as Array.sort comparator)
     */

    fluid.stableSort = function (array, func) {
        for (var i = 0; i < array.length; i++) {
            var j, k = array[i];
            for (j = i; j > 0 && func(k, array[j - 1]) < 0; j--) {
                array[j] = array[j - 1];
            }
            array[j] = k;
        }
    };

    /** Converts a hash into an object by hoisting out the object's keys into an array element via the supplied String "key", and then transforming via an optional further function, which receives the signature
     * (newElement, oldElement, key) where newElement is the freshly cloned element, oldElement is the original hash's element, and key is the key of the element.
     * If the function is not supplied, the old element is simply deep-cloned onto the new element (same effect as transform fluid.transforms.deindexIntoArrayByKey).
     * The supplied hash will not be modified, unless the supplied function explicitly does so by modifying its 2nd argument.
     */
    fluid.hashToArray = function (hash, keyName, func) {
        var togo = [];
        fluid.each(hash, function (el, key) {
            var newEl = {};
            newEl[keyName] = key;
            if (func) {
                newEl = func(newEl, el, key) || newEl;
            } else {
                $.extend(true, newEl, el);
            }
            togo.push(newEl);
        });
        return togo;
    };

    /** Converts an array consisting of a mixture of arrays and non-arrays into the concatenation of any inner arrays
     * with the non-array elements
     */
    fluid.flatten = function (array) {
        var togo = [];
        fluid.each(array, function (element) {
            if (fluid.isArrayable(element)) {
                togo = togo.concat(element);
            } else {
                togo.push(element);
            }
        });
        return togo;
    };

    /**
     * Clears an object or array of its contents. For objects, each property is deleted.
     *
     * @param {Object|Array} target the target to be cleared
     */
    fluid.clear = function (target) {
        if (fluid.isArrayable(target)) {
            target.length = 0;
        } else {
            for (var i in target) {
                delete target[i];
            }
        }
    };

   /**
    * @param boolean ascending <code>true</code> if a comparator is to be returned which
    * sorts strings in descending order of length
    */
    fluid.compareStringLength = function (ascending) {
        return ascending ? function (a, b) {
            return a.length - b.length;
        } : function (a, b) {
            return b.length - a.length;
        };
    };

    /**
     * Returns the converted integer if the input string can be converted to an integer. Otherwise, return NaN.
     * @param {String} a string to be returned in integer
     */
    fluid.parseInteger = function (string) {
        return isFinite(string) && ((string % 1) === 0) ? Number(string) : NaN;
    };

    /** Calls Object.freeze at each level of containment of the supplied object
     * @return The supplied argument, recursively frozen
     */
    fluid.freezeRecursive = function (tofreeze) {
        if (fluid.isPlainObject(tofreeze)) {
            fluid.each(tofreeze, function (value) {
                fluid.freezeRecursive(value);
            });
            return Object.freeze(tofreeze);
        } else {
            return tofreeze;
        }
    };

    /** A set of special "marker values" used in signalling in function arguments and return values,
      * to partially compensate for JavaScript's lack of distinguished types. These should never appear
      * in JSON structures or other kinds of static configuration. An API specifically documents if it
      * accepts or returns any of these values, and if so, what its semantic is  - most are of private
      * use internal to the framework **/

    fluid.marker = function () {};

    fluid.makeMarker = function (value, extra) {
        var togo = Object.create(fluid.marker.prototype);
        togo.value = value;
        $.extend(togo, extra);
        return Object.freeze(togo);
    };

    /** A special "marker object" representing that a distinguished
     * (probably context-dependent) value should be substituted.
     */
    fluid.VALUE = fluid.makeMarker("VALUE");

    /** A special "marker object" representing that no value is present (where
     * signalling using the value "undefined" is not possible - e.g. the return value from a "strategy") */
    fluid.NO_VALUE = fluid.makeMarker("NO_VALUE");

    /** A marker indicating that a value requires to be expanded after component construction begins **/
    fluid.EXPAND = fluid.makeMarker("EXPAND");

    /** Determine whether an object is any marker, or a particular marker - omit the
     * 2nd argument to detect any marker
     */
    fluid.isMarker = function (totest, type) {
        if (!(totest instanceof fluid.marker)) {
            return false;
        }
        if (!type) {
            return true;
        }
        return totest.value === type.value;
    };

    fluid.logLevelsSpec = {
        "FATAL":      0,
        "FAIL":       5,
        "WARN":      10,
        "IMPORTANT": 12, // The default logging "off" level - corresponds to the old "false"
        "INFO":      15, // The default logging "on" level - corresponds to the old "true"
        "TRACE":     20
    };

    /** A structure holding all supported log levels as supplied as a possible first argument to fluid.log
     * Members with a higher value of the "priority" field represent lower priority logging levels */
    // Moved down here since it uses fluid.transform and fluid.makeMarker on startup
    fluid.logLevel = fluid.transform(fluid.logLevelsSpec, function (value, key) {
        return fluid.makeMarker(key, {priority: value});
    });
    var logLevelStack = [fluid.logLevel.IMPORTANT]; // The stack of active logging levels, with the current level at index 0


    // Model functions
    fluid.model = {}; // cannot call registerNamespace yet since it depends on fluid.model

    /** Copy a source "model" onto a target **/
    fluid.model.copyModel = function (target, source) {
        fluid.clear(target);
        $.extend(true, target, source);
    };

    /** Parse an EL expression separated by periods (.) into its component segments.
     * @param {String} EL The EL expression to be split
     * @return {Array of String} the component path expressions.
     * TODO: This needs to be upgraded to handle (the same) escaping rules (as RSF), so that
     * path segments containing periods and backslashes etc. can be processed, and be harmonised
     * with the more complex implementations in fluid.pathUtil(data binding).
     */
    fluid.model.parseEL = function (EL) {
        return EL === "" ? [] : String(EL).split(".");
    };

    /** Compose an EL expression from two separate EL expressions. The returned
     * expression will be the one that will navigate the first expression, and then
     * the second, from the value reached by the first. Either prefix or suffix may be
     * the empty string **/

    fluid.model.composePath = function (prefix, suffix) {
        return prefix === "" ? suffix : (suffix === "" ? prefix : prefix + "." + suffix);
    };

    /** Compose any number of path segments, none of which may be empty **/
    fluid.model.composeSegments = function () {
        return fluid.makeArray(arguments).join(".");
    };

    /** Returns the index of the last occurrence of the period character . in the supplied string */
    fluid.lastDotIndex = function (path) {
        return path.lastIndexOf(".");
    };

    /** Returns all of an EL path minus its final segment - if the path consists of just one segment, returns "" -
     * WARNING - this method does not follow escaping rules */
    fluid.model.getToTailPath = function (path) {
        var lastdot = fluid.lastDotIndex(path);
        return lastdot === -1 ? "" : path.substring(0, lastdot);
    };

    /** Returns the very last path component of an EL path
     * WARNING - this method does not follow escaping rules */
    fluid.model.getTailPath = function (path) {
        var lastdot = fluid.lastDotIndex(path);
        return path.substring(lastdot + 1);
    };

    /** Helpful alias for old-style API **/
    fluid.path = fluid.model.composeSegments;
    fluid.composePath = fluid.model.composePath;


    // unsupported, NON-API function
    fluid.requireDataBinding = function () {
        fluid.fail("Please include DataBinding.js in order to operate complex model accessor configuration");
    };

    fluid.model.setWithStrategy = fluid.model.getWithStrategy = fluid.requireDataBinding;

    // unsupported, NON-API function
    fluid.model.resolvePathSegment = function (root, segment, create, origEnv) {
        if (!origEnv && root.resolvePathSegment) {
            return root.resolvePathSegment(segment);
        }
        if (create && root[segment] === undefined) {
            // This optimisation in this heavily used function has a fair effect
            return root[segment] = {};
        }
        return root[segment];
    };

    // unsupported, NON-API function
    fluid.model.parseToSegments = function (EL, parseEL, copy) {
        return typeof(EL) === "number" || typeof(EL) === "string" ? parseEL(EL) : (copy ? fluid.makeArray(EL) : EL);
    };

    // unsupported, NON-API function
    fluid.model.pathToSegments = function (EL, config) {
        var parser = config && config.parser ? config.parser.parse : fluid.model.parseEL;
        return fluid.model.parseToSegments(EL, parser);
    };

    // Overall strategy skeleton for all implementations of fluid.get/set
    fluid.model.accessImpl = function (root, EL, newValue, config, initSegs, returnSegs, traverser) {
        var segs = fluid.model.pathToSegments(EL, config);
        var initPos = 0;
        if (initSegs) {
            initPos = initSegs.length;
            segs = initSegs.concat(segs);
        }
        var uncess = newValue === fluid.NO_VALUE ? 0 : 1;
        root = traverser(root, segs, initPos, config, uncess);
        if (newValue === fluid.NO_VALUE || newValue === fluid.VALUE) { // get or custom
            return returnSegs ? {root: root, segs: segs} : root;
        }
        else { // set
            root[segs[segs.length - 1]] = newValue;
        }
    };

    // unsupported, NON-API function
    fluid.model.accessSimple = function (root, EL, newValue, environment, initSegs, returnSegs) {
        return fluid.model.accessImpl(root, EL, newValue, environment, initSegs, returnSegs, fluid.model.traverseSimple);
    };

    // unsupported, NON-API function
    fluid.model.traverseSimple = function (root, segs, initPos, environment, uncess) {
        var origEnv = environment;
        var limit = segs.length - uncess;
        for (var i = 0; i < limit; ++i) {
            if (!root) {
                return root;
            }
            var segment = segs[i];
            if (environment && environment[segment]) {
                root = environment[segment];
            } else {
                root = fluid.model.resolvePathSegment(root, segment, uncess === 1, origEnv);
            }
            environment = null;
        }
        return root;
    };

    fluid.model.setSimple = function (root, EL, newValue, environment, initSegs) {
        fluid.model.accessSimple(root, EL, newValue, environment, initSegs, false);
    };

    /** Optimised version of fluid.get for uncustomised configurations **/

    fluid.model.getSimple = function (root, EL, environment, initSegs) {
        if (EL === null || EL === undefined || EL.length === 0) {
            return root;
        }
        return fluid.model.accessSimple(root, EL, fluid.NO_VALUE, environment, initSegs, false);
    };

    /** Even more optimised version which assumes segs are parsed and no configuration **/
    fluid.getImmediate = function (root, segs, i) {
        var limit = (i === undefined ? segs.length : i + 1);
        for (var j = 0; j < limit; ++j) {
            root = root ? root[segs[j]] : undefined;
        }
        return root;
    };

    // unsupported, NON-API function
    // Returns undefined to signal complex configuration which needs to be farmed out to DataBinding.js
    // any other return represents an environment value AND a simple configuration we can handle here
    fluid.decodeAccessorArg = function (arg3) {
        return (!arg3 || arg3 === fluid.model.defaultGetConfig || arg3 === fluid.model.defaultSetConfig) ?
            null : (arg3.type === "environment" ? arg3.value : undefined);
    };

    fluid.set = function (root, EL, newValue, config, initSegs) {
        var env = fluid.decodeAccessorArg(config);
        if (env === undefined) {
            fluid.model.setWithStrategy(root, EL, newValue, config, initSegs);
        } else {
            fluid.model.setSimple(root, EL, newValue, env, initSegs);
        }
    };

    /** Evaluates an EL expression by fetching a dot-separated list of members
     * recursively from a provided root.
     * @param root The root data structure in which the EL expression is to be evaluated
     * @param {string/array} EL The EL expression to be evaluated, or an array of path segments
     * @param config An optional configuration or environment structure which can customise the fetch operation
     * @return The fetched data value.
     */

    fluid.get = function (root, EL, config, initSegs) {
        var env = fluid.decodeAccessorArg(config);
        return env === undefined ?
            fluid.model.getWithStrategy(root, EL, config, initSegs)
            : fluid.model.accessImpl(root, EL, fluid.NO_VALUE, env, null, false, fluid.model.traverseSimple);
    };

    fluid.getGlobalValue = function (path, env) {
        if (path) {
            env = env || fluid.environment;
            return fluid.get(fluid.global, path, {type: "environment", value: env});
        }
    };

    /**
     * Allows for the binding to a "this-ist" function
     * @param {Object} obj, "this-ist" object to bind to
     * @param {Object} fnName, the name of the function to call
     * @param {Object} args, arguments to call the function with
     */
    fluid.bind = function (obj, fnName, args) {
        return obj[fnName].apply(obj, fluid.makeArray(args));
    };

    /**
     * Allows for the calling of a function from an EL expression "functionPath", with the arguments "args", scoped to an framework version "environment".
     * @param {Object} functionPath - An EL expression
     * @param {Object} args - An array of arguments to be applied to the function, specified in functionPath
     * @param {Object} environment - (optional) The object to scope the functionPath to  (typically the framework root for version control)
     */
    fluid.invokeGlobalFunction = function (functionPath, args, environment) {
        var func = fluid.getGlobalValue(functionPath, environment);
        if (!func) {
            fluid.fail("Error invoking global function: " + functionPath + " could not be located");
        } else {
            return func.apply(null, fluid.isArrayable(args) ? args : fluid.makeArray(args));
        }
    };

    /** Registers a new global function at a given path
     */

    fluid.registerGlobalFunction = function (functionPath, func, env) {
        env = env || fluid.environment;
        fluid.set(fluid.global, functionPath, func, {type: "environment", value: env});
    };

    fluid.setGlobalValue = fluid.registerGlobalFunction;

    /** Ensures that an entry in the global namespace exists. If it does not, a new entry is created as {} and returned. If an existing
     * value is found, it is returned instead **/
    fluid.registerNamespace = function (naimspace, env) {
        env = env || fluid.environment;
        var existing = fluid.getGlobalValue(naimspace, env);
        if (!existing) {
            existing = {};
            fluid.setGlobalValue(naimspace, existing, env);
        }
        return existing;
    };

    // stubs for two functions in FluidDebugging.js
    fluid.dumpEl = fluid.identity;
    fluid.renderTimestamp = fluid.identity;

    /*** The Fluid instance id ***/

    // unsupported, NON-API function
    fluid.generateUniquePrefix = function () {
        return (Math.floor(Math.random() * 1e12)).toString(36) + "-";
    };

    var fluid_prefix = fluid.generateUniquePrefix();

    fluid.fluidInstance = fluid_prefix;

    var fluid_guid = 1;

    /** Allocate a string value that will be unique within this Infusion instance (frame or process), and
     * globally unique with high probability (50% chance of collision after a million trials) **/

    fluid.allocateGuid = function () {
        return fluid_prefix + (fluid_guid++);
    };

    /*** The Fluid Event system. ***/

    fluid.registerNamespace("fluid.event");

    // Fluid priority system for encoding relative positions of, e.g. listeners, transforms, options, in lists

    fluid.extremePriority = 4e9; // around 2^32 - allows headroom of 21 fractional bits for sub-priorities
    fluid.priorityTypes = {
        first: -1,
        last: 1,
        before: 0,
        after: 0
    };
    // TODO: This should be properly done with defaults blocks and a much more performant fluid.indexDefaults
    fluid.extremalPriorities = {
        // a built-in definition to allow test infrastructure "last" listeners to sort after all impl listeners, and authoring/debugging listeners to sort after those
        // these are "priority intensities", and will be flipped for "first" listeners
        none: 0,
        testing: 10,
        authoring: 20
    };

    // unsupported, NON-API function
    // TODO: Note - no "fixedOnly = true" sites remain in the framework
    fluid.parsePriorityConstraint = function (constraint, fixedOnly, site) {
        var segs = constraint.split(":");
        var type = segs[0];
        var lookup = fluid.priorityTypes[type];
        if (lookup === undefined) {
            fluid.fail("Invalid constraint type in priority field " + constraint + ": the only supported values are " + fluid.keys(fluid.priorityTypes).join(", ") + " or numeric");
        }
        if (fixedOnly && lookup === 0) {
            fluid.fail("Constraint type in priority field " + constraint + " is not supported in a " + site + " record - you must use either a numeric value or first, last");
        }
        return {
            type: segs[0],
            target: segs[1]
        };
    };

    // unsupported, NON-API function
    fluid.parsePriority = function (priority, count, fixedOnly, site) {
        priority = priority || 0;
        var togo = {
            count: count || 0,
            fixed: null,
            constraint: null,
            site: site
        };
        if (typeof(priority) === "number") {
            togo.fixed = -priority;
        } else {
            togo.constraint = fluid.parsePriorityConstraint(priority, fixedOnly, site);
        }
        var multiplier = togo.constraint ? fluid.priorityTypes[togo.constraint.type] : 0;
        if (multiplier !== 0) {
            var target = togo.constraint.target || "none";
            var extremal = fluid.extremalPriorities[target];
            if (extremal === undefined) {
                fluid.fail("Unrecognised extremal priority target " + target + ": the currently supported values are " + fluid.keys(fluid.extremalPriorities).join(", ") + ": register your value in fluid.extremalPriorities");
            }
            togo.fixed = multiplier * (fluid.extremePriority + extremal);
        }
        if (togo.fixed !== null) {
            togo.fixed += togo.count / 1024; // use some fractional bits to encode count bias
        }

        return togo;
    };

    fluid.renderPriority = function (parsed) {
        return parsed.constraint ? (parsed.constraint.target ? parsed.constraint.type + ":" + parsed.constraint.target : parsed.constraint.type ) : Math.floor(parsed.fixed);
    };

    // unsupported, NON-API function
    fluid.compareByPriority = function (recA, recB) {
        if (recA.priority.fixed !== null && recB.priority.fixed !== null) {
            return recA.priority.fixed - recB.priority.fixed;
        } else { // sort constraint records to the end
            // relies on JavaScript boolean coercion rules (ECMA 9.3 toNumber)
            return (recA.priority.fixed === null) - (recB.priority.fixed === null);
        }
    };

    fluid.honourConstraint = function (array, firstConstraint, c) {
        var constraint = array[c].priority.constraint;
        var matchIndex = fluid.find(array, function (element, index) {
            return element.namespace === constraint.target ? index : undefined;
        }, -1);
        if (matchIndex === -1) { // TODO: We should report an error during firing if this condition persists until then
            return true;
        } else if (matchIndex >= firstConstraint) {
            return false;
        } else {
            var offset = constraint.type === "after" ? 1 : 0;
            var target = matchIndex + offset;
            var temp = array[c];
            for (var shift = c; shift >= target; --shift) {
                array[shift] = array[shift - 1];
            }
            array[target] = temp;
            return true;
        }
    };

    // unsupported, NON-API function
    // Priorities accepted from users have higher numbers representing high priority (sort first) -
    fluid.sortByPriority = function (array) {
        fluid.stableSort(array, fluid.compareByPriority);

        var firstConstraint = fluid.find(array, function (element, index) {
            return element.priority.constraint && fluid.priorityTypes[element.priority.constraint.type] === 0 ? index : undefined;
        }, array.length);

        while (true) {
            if (firstConstraint === array.length) {
                return array;
            }
            var oldFirstConstraint = firstConstraint;
            for (var c = firstConstraint; c < array.length; ++c) {
                var applied = fluid.honourConstraint(array, firstConstraint, c);
                if (applied) {
                    ++firstConstraint;
                }
            }
            if (firstConstraint === oldFirstConstraint) {
                var holders = array.slice(firstConstraint);
                fluid.fail("Could not find targets for any constraints in " + holders[0].priority.site + " ", holders, ": none of the targets (" + fluid.getMembers(holders, "priority.constraint.target").join(", ") +
                    ") matched any namespaces of the elements in (", array.slice(0, firstConstraint) + ") - this is caused by either an invalid or circular reference");
            }
        }
    };

    /** Parse a hash containing prioritised records (for example, as found in a ContextAwareness record) and return a sorted array of these records in priority order.
     * @param records {Object} A hash of key names to prioritised records. Each record may contain an member `namespace` - if it does not, the namespace will be taken from the
     * record's key. It may also contain a `String` member `priority` encoding a priority with respect to these namespaces as document at http://docs.fluidproject.org/infusion/development/Priorities.html .
     * @param name {String} A human-readable name describing the supplied records, which will be incorporated into the message of any error encountered when resolving the priorities
     * @return [Array] An array of the same elements supplied to `records`, sorted into priority order. The supplied argument `records` will not be modified.
     */
    fluid.parsePriorityRecords = function (records, name) {
        var array = fluid.hashToArray(records, "namespace", function (newElement, oldElement, index) {
            $.extend(newElement, oldElement);
            newElement.priority = fluid.parsePriority(oldElement.priority, index, false, name);
        });
        fluid.sortByPriority(array);
        return array;
    };

    fluid.event.identifyListener = function (listener, soft) {
        if (typeof(listener) !== "string" && !listener.$$fluid_guid && !soft) {
            listener.$$fluid_guid = fluid.allocateGuid();
        }
        return listener.$$fluid_guid;
    };

    // unsupported, NON-API function
    fluid.event.impersonateListener = function (origListener, newListener) {
        fluid.event.identifyListener(origListener);
        newListener.$$fluid_guid = origListener.$$fluid_guid;
    };


    // unsupported, NON-API function
    fluid.event.sortListeners = function (listeners) {
        var togo = [];
        fluid.each(listeners, function (oneNamespace) {
            var headHard; // notify only the first listener with hard namespace - or else all if all are soft
            for (var i = 0; i < oneNamespace.length; ++i) {
                var thisListener = oneNamespace[i];
                if (!thisListener.softNamespace && !headHard) {
                    headHard = thisListener;
                }
            }
            if (headHard) {
                togo.push(headHard);
            } else {
                togo = togo.concat(oneNamespace);
            }
        });
        return fluid.sortByPriority(togo);
    };

    // unsupported, NON-API function
    fluid.event.resolveListener = function (listener) {
        var listenerName = listener.globalName || (typeof(listener) === "string" ? listener : null);
        if (listenerName) {
            var listenerFunc = fluid.getGlobalValue(listenerName);
            if (!listenerFunc) {
                fluid.fail("Unable to look up name " + listenerName + " as a global function");
            } else {
                listener = listenerFunc;
            }
        }
        return listener;
    };

    /** Generate a name for a component for debugging purposes */
    fluid.nameComponent = function (that) {
        return that ? "component with typename " + that.typeName + " and id " + that.id : "[unknown component]";
    };

    fluid.event.nameEvent = function (that, eventName) {
        return eventName + " of " + fluid.nameComponent(that);
    };

    /** Construct an "event firer" object which can be used to register and deregister
     * listeners, to which "events" can be fired. These events consist of an arbitrary
     * function signature. General documentation on the Fluid events system is at
     * http://docs.fluidproject.org/infusion/development/InfusionEventSystem.html .
     * @param {Object} options - A structure to configure this event firer. Supported fields:
     *     {String} name - a readable name for this firer to be used in diagnostics and debugging
     *     {Boolean} preventable - If <code>true</code> the return value of each handler will
     * be checked for <code>false</code> in which case further listeners will be shortcircuited, and this
     * will be the return value of fire()
     */
    fluid.makeEventFirer = function (options) {
        options = options || {};
        var name = options.name || "<anonymous>";
        var that;

        var lazyInit = function () { // Lazy init function to economise on object references for events which are never listened to
            that.listeners = {};
            that.byId = {};
            that.sortedListeners = [];
            // arguments after 3rd are not part of public API
            // listener as Object is used only by ChangeApplier to tunnel path, segs, etc as part of its "spec"
            /** Adds a listener to this event.
              * @param listener {Function|String} The listener function to be added, or a global name resolving to a function. The signature of the function is arbitrary and matches that sent to event.fire()
              * @param namespace {String} (Optional) A namespace for this listener. At most one listener with a particular namespace can be active on an event at one time. Removing successively added listeners with a particular
              * namespace will expose previously added ones in a stack idiom
              * @param priority {String|Number} A priority for the listener relative to others, perhaps expressed with a constraint relative to the namespace of another - see
              * http://docs.fluidproject.org/infusion/development/Priorities.html
              */
            that.addListener = function (listener, namespace, priority, softNamespace, listenerId) {
                var record;
                if (that.destroyed) {
                    fluid.fail("Cannot add listener to destroyed event firer " + that.name);
                }
                if (!listener) {
                    return;
                }
                if (fluid.isPlainObject(listener, true) && !fluid.isApplicable(listener)) {
                    record = listener;
                    listener = record.listener;
                    namespace = record.namespace;
                    priority = record.priority;
                    softNamespace = record.softNamespace;
                    listenerId = record.listenerId;
                }
                if (typeof(listener) === "string") {
                    listener = {globalName: listener};
                }
                var id = listenerId || fluid.event.identifyListener(listener);
                namespace = namespace || id;
                record = $.extend(record || {}, {
                    namespace: namespace,
                    listener: listener,
                    softNamespace: softNamespace,
                    listenerId: listenerId,
                    priority: fluid.parsePriority(priority, that.sortedListeners.length, false, "listeners")
                });
                that.byId[id] = record;

                var thisListeners = (that.listeners[namespace] = fluid.makeArray(that.listeners[namespace]));
                thisListeners[softNamespace ? "push" : "unshift"] (record);

                that.sortedListeners = fluid.event.sortListeners(that.listeners);
            };
            that.addListener.apply(null, arguments);
        };
        that = {
            eventId: fluid.allocateGuid(),
            name: name,
            ownerId: options.ownerId,
            typeName: "fluid.event.firer",
            destroy: function () {
                that.destroyed = true;
            },
            addListener: function () {
                lazyInit.apply(null, arguments);
            },
            /** Removes a listener previously registered with this event.
              * @param toremove {Function|String} Either the listener function, the namespace of a listener (in which case a previous listener with that namespace may be uncovered) or an id sent to the undocumented
              * `listenerId` argument of `addListener
              */
            // Can be supplied either listener, namespace, or id (which may match either listener function's guid or original listenerId argument)
            removeListener: function (listener) {
                if (!that.listeners) { return; }
                var namespace, id, record;
                if (typeof (listener) === "string") {
                    namespace = listener;
                    record = that.listeners[namespace];
                    if (!record) { // it was an id and not a namespace - take the namespace from its record later
                        id = namespace;
                        namespace = null;
                    }
                }
                else if (typeof(listener) === "function") {
                    id = fluid.event.identifyListener(listener, true);
                    if (!id) {
                        fluid.fail("Cannot remove unregistered listener function ", listener, " from event " + that.name);
                    }
                }
                var rec = that.byId[id];
                var softNamespace = rec && rec.softNamespace;
                namespace = namespace || (rec && rec.namespace) || id;
                delete that.byId[id];
                record = that.listeners[namespace];
                if (record) {
                    if (softNamespace) {
                        fluid.remove_if(record, function (thisLis) {
                            return thisLis.listener.$$fluid_guid === id || thisLis.listenerId === id;
                        });
                    } else {
                        record.shift();
                    }
                    if (record.length === 0) {
                        delete that.listeners[namespace];
                    }
                }
                that.sortedListeners = fluid.event.sortListeners(that.listeners);
            },
            /** Fires this event to all listeners which are active. They will be notified in order of priority. The signature of this method is free **/
            fire: function () {
                var listeners = that.sortedListeners;
                if (!listeners || that.destroyed) { return; }
                fluid.log(fluid.logLevel.TRACE, "Firing event " + name + " to list of " + listeners.length + " listeners");
                for (var i = 0; i < listeners.length; ++i) {
                    var lisrec = listeners[i];
                    lisrec.listener = fluid.event.resolveListener(lisrec.listener);
                    var listener = lisrec.listener;
                    var ret = listener.apply(null, arguments);
                    var value;
                    if (options.preventable && ret === false || that.destroyed) {
                        value = false;
                    }
                    if (value !== undefined) {
                        return value;
                    }
                }
            }
        };
        return that;
    };

    // unsupported, NON-API function
    // Fires to an event which may not be instantiated (in which case no-op) - primary modern usage is to resolve FLUID-5904
    fluid.fireEvent = function (component, eventName, args) {
        var firer = component.events[eventName];
        if (firer) {
            firer.fire.apply(null, fluid.makeArray(args));
        }
    };

    // unsupported, NON-API function
    fluid.event.addListenerToFirer = function (firer, value, namespace, wrapper) {
        wrapper = wrapper || fluid.identity;
        if (fluid.isArrayable(value)) {
            for (var i = 0; i < value.length; ++i) {
                fluid.event.addListenerToFirer(firer, value[i], namespace, wrapper);
            }
        } else if (typeof (value) === "function" || typeof (value) === "string") {
            wrapper(firer).addListener(value, namespace);
        } else if (value && typeof (value) === "object") {
            wrapper(firer).addListener(value.listener, namespace || value.namespace, value.priority, value.softNamespace, value.listenerId);
        }
    };

    // unsupported, NON-API function - non-IOC passthrough
    fluid.event.resolveListenerRecord = function (records) {
        return { records: records };
    };

    fluid.expandImmediate = function (material) {
        fluid.fail("fluid.expandImmediate could not be loaded - please include FluidIoC.js in order to operate IoC-driven event with descriptor " + material);
    };

    // unsupported, NON-API function
    fluid.mergeListeners = function (that, events, listeners) {
        fluid.each(listeners, function (value, key) {
            var firer, namespace;
            if (fluid.isIoCReference(key)) {
                firer = fluid.expandImmediate(key, that);
                if (!firer) {
                    fluid.fail("Error in listener record: key " + key + " could not be looked up to an event firer - did you miss out \"events.\" when referring to an event firer?");
                }
            } else {
                var keydot = key.indexOf(".");

                if (keydot !== -1) {
                    namespace = key.substring(keydot + 1);
                    key = key.substring(0, keydot);
                }
                if (!events[key]) {
                    fluid.fail("Listener registered for event " + key + " which is not defined for this component");
                }
                firer = events[key];
            }
            var record = fluid.event.resolveListenerRecord(value, that, key, namespace, true);
            fluid.event.addListenerToFirer(firer, record.records, namespace, record.adderWrapper);
        });
    };

    // unsupported, NON-API function
    fluid.eventFromRecord = function (eventSpec, eventKey, that) {
        var isIoCEvent = eventSpec && (typeof (eventSpec) !== "string" || fluid.isIoCReference(eventSpec));
        var event;
        if (isIoCEvent) {
            if (!fluid.event.resolveEvent) {
                fluid.fail("fluid.event.resolveEvent could not be loaded - please include FluidIoC.js in order to operate IoC-driven event with descriptor ",
                    eventSpec);
            } else {
                event = fluid.event.resolveEvent(that, eventKey, eventSpec);
            }
        } else {
            event = fluid.makeEventFirer({
                name: fluid.event.nameEvent(that, eventKey),
                preventable: eventSpec === "preventable",
                ownerId: that.id
            });
        }
        return event;
    };

    // unsupported, NON-API function - this is patched from FluidIoC.js
    fluid.instantiateFirers = function (that, options) {
        fluid.each(options.events, function (eventSpec, eventKey) {
            that.events[eventKey] = fluid.eventFromRecord(eventSpec, eventKey, that);
        });
    };

    // unsupported, NON-API function
    fluid.mergeListenerPolicy = function (target, source, key) {
        if (typeof (key) !== "string") {
            fluid.fail("Error in listeners declaration - the keys in this structure must resolve to event names - got " + key + " from ", source);
        }
        // cf. triage in mergeListeners
        var hasNamespace = !fluid.isIoCReference(key) && key.indexOf(".") !== -1;
        return hasNamespace ? (source || target) : fluid.arrayConcatPolicy(target, source);
    };

    // unsupported, NON-API function
    fluid.makeMergeListenersPolicy = function (merger, modelRelay) {
        return function (target, source) {
            target = target || {};
            if (modelRelay && (fluid.isArrayable(source) || typeof(source.target) === "string")) { // This form allowed for modelRelay
                target[""] = merger(target[""], source, "");
            } else {
                fluid.each(source, function (listeners, key) {
                    target[key] = merger(target[key], listeners, key);
                });
            }
            return target;
        };
    };

    fluid.validateListenersImplemented = function (that) {
        var errors = [];
        fluid.each(that.events, function (event, name) {
            fluid.each(event.sortedListeners, function (lisrec) {
                if (lisrec.listener === fluid.notImplemented || lisrec.listener.globalName === "fluid.notImplemented") {
                    errors.push({name: name, namespace: lisrec.namespace, componentSource: fluid.model.getSimple(that.options.listeners, [name + "." + lisrec.namespace, 0, "componentSource"])});
                }
            });
        });
        return errors;
    };

    /** Removes duplicated and empty elements from an already sorted array **/
    fluid.unique = function (array) {
        return fluid.remove_if(array, function (element, i) {
            return !element || i > 0 && element === array[i - 1];
        });
    };

    fluid.arrayConcatPolicy = function (target, source) {
        return fluid.makeArray(target).concat(fluid.makeArray(source));
    };

    /*** FLUID ERROR SYSTEM ***/

    fluid.failureEvent = fluid.makeEventFirer({name: "failure event"});

    fluid.failureEvent.addListener(fluid.builtinFail, "fail");
    fluid.failureEvent.addListener(fluid.logFailure, "log", "before:fail");

    /**
     * Configure the behaviour of fluid.fail by pushing or popping a disposition record onto a stack.
     * @param {Number|Function} condition
     & Supply either a function, which will be called with two arguments, args (the complete arguments to
     * fluid.fail) and activity, an array of strings describing the current framework invocation state.
     * Or, the argument may be the number <code>-1</code> indicating that the previously supplied disposition should
     * be popped off the stack
     */
    fluid.pushSoftFailure = function (condition) {
        if (typeof (condition) === "function") {
            fluid.failureEvent.addListener(condition, "fail");
        } else if (condition === -1) {
            fluid.failureEvent.removeListener("fail");
        } else if (typeof(condition) === "boolean") {
            fluid.fail("pushSoftFailure with boolean value is no longer supported");
        }
    };

    /*** DEFAULTS AND OPTIONS MERGING SYSTEM ***/

    // A function to tag the types of all Fluid components
    fluid.componentConstructor = function () {};

    /** Create a "type tag" component with no state but simply a type name and id. The most
     *  minimal form of Fluid component */
    // No longer a publically supported function - we don't abolish this because it is too annoying to prevent
    // circularity during the bootup of the IoC system if we try to construct full components before it is complete
    // unsupported, non-API function
    fluid.typeTag = function (name) {
        var that = Object.create(fluid.componentConstructor.prototype);
        that.typeName = name;
        that.id = fluid.allocateGuid();
        return that;
    };

    var gradeTick = 1; // tick counter for managing grade cache invalidation
    var gradeTickStore = {};

    fluid.defaultsStore = {};

    // unsupported, NON-API function
    // Recursively builds up "gradeStructure" in first argument. 2nd arg receives gradeNames to be resolved, with stronger grades at right (defaults order)
    // builds up gradeStructure.gradeChain pushed from strongest to weakest (reverse defaults order)
    fluid.resolveGradesImpl = function (gs, gradeNames) {
        gradeNames = fluid.makeArray(gradeNames);
        for (var i = gradeNames.length - 1; i >= 0; --i) { // from stronger to weaker
            var gradeName = gradeNames[i];
            if (gradeName && !gs.gradeHash[gradeName]) {
                var isDynamic = fluid.isIoCReference(gradeName);
                var options = (isDynamic ? null : fluid.rawDefaults(gradeName)) || {};
                var thisTick = gradeTickStore[gradeName] || (gradeTick - 1); // a nonexistent grade is recorded as just previous to current
                gs.lastTick = Math.max(gs.lastTick, thisTick);
                gs.gradeHash[gradeName] = true;
                gs.gradeChain.push(gradeName);
                var oGradeNames = fluid.makeArray(options.gradeNames);
                for (var j = oGradeNames.length - 1; j >= 0; --j) { // from stronger to weaker grades
                    // TODO: in future, perhaps restore mergedDefaultsCache function of storing resolved gradeNames for bare grades
                    fluid.resolveGradesImpl(gs, oGradeNames[j]);
                }
            }
        }
        return gs;
    };

    // unsupported, NON-API function
    fluid.resolveGradeStructure = function (defaultName, gradeNames) {
        var gradeStruct = {
            lastTick: 0,
            gradeChain: [],
            gradeHash: {}
        };
        // stronger grades appear to the right in defaults - dynamic grades are stronger still - FLUID-5085
        // we supply these to resolveGradesImpl with strong grades at the right
        fluid.resolveGradesImpl(gradeStruct, [defaultName].concat(fluid.makeArray(gradeNames)));
        gradeStruct.gradeChain.reverse(); // reverse into defaults order
        return gradeStruct;
    };

    fluid.hasGrade = function (options, gradeName) {
        return !options || !options.gradeNames ? false : fluid.contains(options.gradeNames, gradeName);
    };

    // unsupported, NON-API function
    fluid.resolveGrade = function (defaults, defaultName, gradeNames) {
        var gradeStruct = fluid.resolveGradeStructure(defaultName, gradeNames);
        var mergeArgs = fluid.transform(gradeStruct.gradeChain, fluid.rawDefaults);
        fluid.remove_if(mergeArgs, function (options) {
            return !options;
        });
        var mergePolicy = {};
        for (var i = 0; i < mergeArgs.length; ++i) {
            if (mergeArgs[i] && mergeArgs[i].mergePolicy) {
                mergePolicy = $.extend(true, mergePolicy, mergeArgs[i].mergePolicy);
            }
        }
        mergeArgs = [mergePolicy, {}].concat(mergeArgs);
        var mergedDefaults = fluid.merge.apply(null, mergeArgs);
        mergedDefaults.gradeNames = gradeStruct.gradeChain; // replace these since mergePolicy version is inadequate
        fluid.freezeRecursive(mergedDefaults);
        return {defaults: mergedDefaults, lastTick: gradeStruct.lastTick};
    };

    fluid.mergedDefaultsCache = {};

    // unsupported, NON-API function
    fluid.gradeNamesToKey = function (defaultName, gradeNames) {
        return defaultName + "|" + gradeNames.join("|");
    };

    // unsupported, NON-API function
    // The main entry point to acquire the fully merged defaults for a combination of defaults plus mixin grades - from FluidIoC.js as well as recursively within itself
    fluid.getMergedDefaults = function (defaultName, gradeNames) {
        gradeNames = fluid.makeArray(gradeNames);
        var key = fluid.gradeNamesToKey(defaultName, gradeNames);
        var mergedDefaults = fluid.mergedDefaultsCache[key];
        if (mergedDefaults) {
            var lastTick = 0; // check if cache should be invalidated through real latest tick being later than the one stored
            var searchGrades = mergedDefaults.defaults.gradeNames || [];
            for (var i = 0; i < searchGrades.length; ++i) {
                lastTick = Math.max(lastTick, gradeTickStore[searchGrades[i]] || 0);
            }
            if (lastTick > mergedDefaults.lastTick) {
                fluid.log("Clearing cache for component " + defaultName + " with gradeNames ", searchGrades);
                mergedDefaults = null;
            }
        }
        if (!mergedDefaults) {
            var defaults = fluid.rawDefaults(defaultName);
            if (!defaults) {
                return defaults;
            }
            mergedDefaults = fluid.mergedDefaultsCache[key] = fluid.resolveGrade(defaults, defaultName, gradeNames);
        }
        return mergedDefaults.defaults;
    };

    // unsupported, NON-API function
    fluid.upgradePrimitiveFunc = function (rec, key) {
        if (rec && fluid.isPrimitive(rec)) {
            var togo = {};
            togo[key || (typeof(rec) === "string" && rec.charAt(0) !== "{" ? "funcName" : "func")] = rec;
            togo.args = fluid.NO_VALUE;
            return togo;
        } else {
            return rec;
        }
    };

    // unsupported, NON-API function
    // Modify supplied options record to include "componentSource" annotation required by FLUID-5082
    // TODO: This function really needs to act recursively in order to catch listeners registered for subcomponents - fix with FLUID-5614
    fluid.annotateListeners = function (componentName, options) {
        options.listeners = fluid.transform(options.listeners, function (record) {
            var togo = fluid.makeArray(record);
            return fluid.transform(togo, function (onerec) {
                onerec = fluid.upgradePrimitiveFunc(onerec, "listener");
                onerec.componentSource = componentName;
                return onerec;
            });
        });
        options.invokers = fluid.transform(options.invokers, function (record) {
            record = fluid.upgradePrimitiveFunc(record);
            if (record) {
                record.componentSource = componentName;
            }
            return record;
        });
    };

    // unsupported, NON-API function
    fluid.rawDefaults = function (componentName) {
        var entry = fluid.defaultsStore[componentName];
        return entry && entry.options;
    };

    // unsupported, NON-API function
    fluid.registerRawDefaults = function (componentName, options) {
        fluid.pushActivity("registerRawDefaults", "registering defaults for grade %componentName with options %options",
            {componentName: componentName, options: options});
        var optionsCopy = fluid.expandCompact ? fluid.expandCompact(options) : fluid.copy(options);
        fluid.annotateListeners(componentName, optionsCopy);
        var callerInfo = fluid.getCallerInfo && fluid.getCallerInfo(6);
        fluid.defaultsStore[componentName] = {
            options: optionsCopy,
            callerInfo: callerInfo
        };
        gradeTickStore[componentName] = gradeTick++;
        fluid.popActivity();
    };

    // unsupported, NON-API function
    fluid.doIndexDefaults = function (defaultName, defaults, index, indexSpec) {
        var requiredGrades = fluid.makeArray(indexSpec.gradeNames);
        for (var i = 0; i < requiredGrades.length; ++i) {
            if (!fluid.hasGrade(defaults, requiredGrades[i])) { return; }
        }
        var indexFunc = typeof(indexSpec.indexFunc) === "function" ? indexSpec.indexFunc : fluid.getGlobalValue(indexSpec.indexFunc);
        var keys = indexFunc(defaults) || [];
        for (var j = 0; j < keys.length; ++j) {
            fluid.pushArray(index, keys[j], defaultName);
        }
    };

    /** Evaluates an index specification over all the defaults records registered into the system.
     * @param indexName {String} The name of this index record (currently ignored)
     * @param indexSpec {Object} Specification of the index to be performed - fields:
     *     gradeNames: {String/Array of String} List of grades that must be matched by this indexer
     *     indexFunc:  {String/Function} An index function which accepts a defaults record and returns an array of keys
     * @return A structure indexing keys to arrays of matched gradenames
     */
    // The expectation is that this function is extremely rarely used with respect to registration of defaults
    // in the system, so currently we do not make any attempts to cache the results. The field "indexName" is
    // supplied in case a future implementation chooses to implement caching
    fluid.indexDefaults = function (indexName, indexSpec) {
        var index = {};
        for (var defaultName in fluid.defaultsStore) {
            var defaults = fluid.getMergedDefaults(defaultName);
            fluid.doIndexDefaults(defaultName, defaults, index, indexSpec);
        }
        return index;
    };

    /**
     * Retrieves and stores a grade's configuration centrally.
     * @param {String} gradeName the name of the grade whose options are to be read or written
     * @param {Object} (optional) an object containing the options to be set
     */

    fluid.defaults = function (componentName, options) {
        if (options === undefined) {
            return fluid.getMergedDefaults(componentName);
        }
        else {
            if (options && options.options) {
                fluid.fail("Probable error in options structure for " + componentName +
                    " with option named \"options\" - perhaps you meant to write these options at top level in fluid.defaults? - ", options);
            }
            fluid.registerRawDefaults(componentName, options);
            var gradedDefaults = fluid.getMergedDefaults(componentName);
            if (!fluid.hasGrade(gradedDefaults, "fluid.function")) {
                fluid.makeComponentCreator(componentName);
            }
        }
    };

    fluid.makeComponentCreator = function (componentName) {
        var creator = function () {
            var defaults = fluid.getMergedDefaults(componentName);
            if (!defaults.gradeNames || defaults.gradeNames.length === 0) {
                fluid.fail("Cannot make component creator for type " + componentName + " which does not have any gradeNames defined");
            } else if (!defaults.initFunction) {
                var blankGrades = [];
                for (var i = 0; i < defaults.gradeNames.length; ++i) {
                    var gradeName = defaults.gradeNames[i];
                    var rawDefaults = fluid.rawDefaults(gradeName);
                    if (!rawDefaults) {
                        blankGrades.push(gradeName);
                    }
                }
                if (blankGrades.length === 0) {
                    fluid.fail("Cannot make component creator for type " + componentName + " which does not have an initFunction defined");
                } else {
                    fluid.fail("The grade hierarchy of component with type " + componentName + " is incomplete - it inherits from the following grade(s): " +
                     blankGrades.join(", ") + " for which the grade definitions are corrupt or missing. Please check the files which might include these " +
                     "grades and ensure they are readable and have been loaded by this instance of Infusion");
                }
            } else {
                return fluid.initComponent(componentName, arguments);
            }
        };
        var existing = fluid.getGlobalValue(componentName);
        if (existing) {
            $.extend(creator, existing);
        }
        fluid.setGlobalValue(componentName, creator);
    };

    var emptyPolicy = {};
    // unsupported, NON-API function
    fluid.derefMergePolicy = function (policy) {
        return (policy ? policy["*"] : emptyPolicy) || emptyPolicy;
    };

    // unsupported, NON-API function
    fluid.compileMergePolicy = function (mergePolicy) {
        var builtins = {}, defaultValues = {};
        var togo = {builtins: builtins, defaultValues: defaultValues};

        if (!mergePolicy) {
            return togo;
        }
        fluid.each(mergePolicy, function (value, key) {
            var parsed = {}, builtin = true;
            if (typeof(value) === "function") {
                parsed.func = value;
            }
            else if (typeof(value) === "object") {
                parsed = value;
            }
            else if (!fluid.isDefaultValueMergePolicy(value)) {
                var split = value.split(/\s*,\s*/);
                for (var i = 0; i < split.length; ++i) {
                    parsed[split[i]] = true;
                }
            }
            else {
                // Convert to ginger self-reference - NB, this can only be parsed by IoC
                fluid.set(defaultValues, key, "{that}.options." + value);
                togo.hasDefaults = true;
                builtin = false;
            }
            if (builtin) {
                fluid.set(builtins, fluid.composePath(key, "*"), parsed);
            }
        });
        return togo;
    };

    // TODO: deprecate this method of detecting default value merge policies before 1.6 in favour of
    // explicit typed records a la ModelTransformations
    // unsupported, NON-API function
    fluid.isDefaultValueMergePolicy = function (policy) {
        return typeof(policy) === "string" &&
            (policy.indexOf(",") === -1 && !/replace|nomerge|noexpand/.test(policy));
    };

    // unsupported, NON-API function
    fluid.mergeOneImpl = function (thisTarget, thisSource, j, sources, newPolicy, i, segs) {
        var togo = thisTarget;

        var primitiveTarget = fluid.isPrimitive(thisTarget);

        if (thisSource !== undefined) {
            if (!newPolicy.func && thisSource !== null && fluid.isPlainObject(thisSource) && !newPolicy.nomerge) {
                if (primitiveTarget) {
                    togo = thisTarget = fluid.freshContainer(thisSource);
                }
                // recursion is now external? We can't do it from here since sources are not all known
                // options.recurse(thisTarget, i + 1, segs, sources, newPolicyHolder, options);
            } else {
                sources[j] = undefined;
                if (newPolicy.func) {
                    togo = newPolicy.func.call(null, thisTarget, thisSource, segs[i - 1], segs, i); // NB - change in this mostly unused argument
                } else {
                    togo = thisSource;
                }
            }
        }
        return togo;
    };
    // NB - same quadratic worry about these as in FluidIoC in the case the RHS trundler is live -
    // since at each regeneration step driving the RHS we are discarding the "cursor arguments" these
    // would have to be regenerated at each step - although in practice this can only happen once for
    // each object for all time, since after first resolution it will be concrete.
    function regenerateCursor(source, segs, limit, sourceStrategy) {
        for (var i = 0; i < limit; ++i) {
            source = sourceStrategy(source, segs[i], i, fluid.makeArray(segs)); // copy for FLUID-5243
        }
        return source;
    }

    function regenerateSources(sources, segs, limit, sourceStrategies) {
        var togo = [];
        for (var i = 0; i < sources.length; ++i) {
            var thisSource = regenerateCursor(sources[i], segs, limit, sourceStrategies[i]);
            if (thisSource !== undefined) {
                togo.push(thisSource);
            }
        }
        return togo;
    }

    // unsupported, NON-API function
    fluid.fetchMergeChildren = function (target, i, segs, sources, mergePolicy, options) {
        var thisPolicy = fluid.derefMergePolicy(mergePolicy);
        for (var j = sources.length - 1; j >= 0; --j) { // this direction now irrelevant - control is in the strategy
            var source = sources[j];
            // NB - this detection relies on strategy return being complete objects - which they are
            // although we need to set up the roots separately. We need to START the process of evaluating each
            // object root (sources) COMPLETELY, before we even begin! Even if the effect of this is to cause a
            // dispatch into ourselves almost immediately. We can do this because we can take control over our
            // TARGET objects and construct them early. Even if there is a self-dispatch, it will be fine since it is
            // DIRECTED and so will not trouble our "slow" detection of properties. After all self-dispatches end, control
            // will THEN return to "evaluation of arguments" (expander blocks) and only then FINALLY to this "slow"
            // traversal of concrete properties to do the final merge.
            if (source !== undefined) {
                fluid.each(source, function (newSource, name) {
                    if (!(name in target)) { // only request each new target key once -- all sources will be queried per strategy
                        segs[i] = name;
                        if (!fluid.getImmediate(options.exceptions, segs, i)) {
                            options.strategy(target, name, i + 1, segs, sources, mergePolicy);
                        }
                    }
                });
                if (thisPolicy.replace) { // this branch primarily deals with a policy of replace at the root
                    break;
                }
            }
        }
        return target;
    };

    // A special marker object which will be placed at a current evaluation point in the tree in order
    // to protect against circular evaluation
    fluid.inEvaluationMarker = Object.freeze({"__CURRENTLY_IN_EVALUATION__": true});

    // A path depth above which the core "process strategies" will bail out, assuming that the
    // structure has become circularly linked. Helpful in environments such as Firebug which will
    // kill the browser process if they happen to be open when a stack overflow occurs. Also provides
    // a more helpful diagnostic.
    fluid.strategyRecursionBailout = 50;

    // unsupported, NON-API function
    fluid.makeMergeStrategy = function (options) {
        var strategy = function (target, name, i, segs, sources, policy) {
            if (i > fluid.strategyRecursionBailout) {
                fluid.fail("Overflow/circularity in options merging, current path is ", segs, " at depth " , i, " - please protect components from merging using the \"nomerge\" merge policy");
            }
            if (fluid.isPrimitive(target)) { // For "use strict"
                return undefined; // Review this after FLUID-4925 since the only trigger is in slow component lookahead
            }
            if (fluid.isTracing) {
                fluid.tracing.pathCount.push(fluid.path(segs.slice(0, i)));
            }

            var oldTarget;
            if (name in target) { // bail out if our work has already been done
                oldTarget = target[name];
                if (!options.evaluateFully) { // see notes on this hack in "initter" - early attempt to deal with FLUID-4930
                    return oldTarget;
                }
            }
            else {
                if (target !== fluid.inEvaluationMarker) { // TODO: blatant "coding to the test" - this enables the simplest "re-trunking" in
                    // FluidIoCTests to function. In practice, we need to throw away this implementation entirely in favour of the
                    // "iterative deepening" model coming with FLUID-4925
                    target[name] = fluid.inEvaluationMarker;
                }
            }
            if (sources === undefined) { // recover our state in case this is an external entry point
                segs = fluid.makeArray(segs); // avoid trashing caller's segs
                sources = regenerateSources(options.sources, segs, i - 1, options.sourceStrategies);
                policy = regenerateCursor(options.mergePolicy, segs, i - 1, fluid.concreteTrundler);
            }
            // var thisPolicy = fluid.derefMergePolicy(policy);
            var newPolicyHolder = fluid.concreteTrundler(policy, name);
            var newPolicy = fluid.derefMergePolicy(newPolicyHolder);

            var start, limit, mul;
            if (newPolicy.replace) {
                start = 1 - sources.length; limit = 0; mul = -1;
            }
            else {
                start = 0; limit = sources.length - 1; mul = +1;
            }
            var newSources = [];
            var thisTarget;

            for (var j = start; j <= limit; ++j) { // TODO: try to economise on this array and on gaps
                var k = mul * j;
                var thisSource = options.sourceStrategies[k](sources[k], name, i, segs); // Run the RH algorithm in "driving" mode
                if (thisSource !== undefined) {
                    newSources[k] = thisSource;
                    if (oldTarget === undefined) {
                        if (mul === -1) { // if we are going backwards, it is "replace"
                            thisTarget = target[name] = thisSource;
                            break;
                        }
                        else {
                            // write this in early, since early expansions may generate a trunk object which is written in to by later ones
                            thisTarget = fluid.mergeOneImpl(thisTarget, thisSource, j, newSources, newPolicy, i, segs, options);
                            if (target !== fluid.inEvaluationMarker) {
                                target[name] = thisTarget;
                            }
                        }
                    }
                }
            }
            if (oldTarget !== undefined) {
                thisTarget = oldTarget;
            }
            if (newSources.length > 0) {
                if (fluid.isPlainObject(thisTarget)) {
                    fluid.fetchMergeChildren(thisTarget, i, segs, newSources, newPolicyHolder, options);
                }
            }
            if (oldTarget === undefined && newSources.length === 0) {
                delete target[name]; // remove the evaluation marker - nothing to evaluate
            }
            return thisTarget;
        };
        options.strategy = strategy;
        return strategy;
    };

    // A simple stand-in for "fluid.get" where the material is covered by a single strategy
    fluid.driveStrategy = function (root, pathSegs, strategy) {
        pathSegs = fluid.makeArray(pathSegs);
        for (var i = 0; i < pathSegs.length; ++i) {
            if (!root) {
                return undefined;
            }
            root = strategy(root, pathSegs[i], i + 1, pathSegs);
        }
        return root;
    };

    // A very simple "new inner trundler" that just performs concrete property access
    // Note that every "strategy" is also a "trundler" of this type, considering just the first two arguments
    fluid.concreteTrundler = function (source, seg) {
        return !source ? undefined : source[seg];
    };

    /** Merge a collection of options structures onto a target, following an optional policy.
     * This method is now used only for the purpose of merging "dead" option documents in order to
     * cache graded component defaults. Component option merging is now performed by the
     * fluid.makeMergeOptions pathway which sets up a deferred merging process. This function
     * will not be removed in the Fluid 2.0 release but it is recommended that users not call it
     * directly.
     * The behaviour of this function is explained more fully on
     * the page http://wiki.fluidproject.org/display/fluid/Options+Merging+for+Fluid+Components .
     * @param policy {Object/String} A "policy object" specifiying the type of merge to be performed.
     * If policy is of type {String} it should take on the value "replace" representing
     * a static policy. If it is an
     * Object, it should contain a mapping of EL paths onto these String values, representing a
     * fine-grained policy. If it is an Object, the values may also themselves be EL paths
     * representing that a default value is to be taken from that path.
     * @param options1, options2, .... {Object} an arbitrary list of options structure which are to
     * be merged together. These will not be modified.
     */

    fluid.merge = function (policy /*, ... sources */) {
        var sources = Array.prototype.slice.call(arguments, 1);
        var compiled = fluid.compileMergePolicy(policy).builtins;
        var options = fluid.makeMergeOptions(compiled, sources, {});
        options.initter();
        return options.target;
    };

    // unsupported, NON-API function
    fluid.simpleGingerBlock = function (source, recordType) {
        var block = {
            target: source,
            simple: true,
            strategy: fluid.concreteTrundler,
            initter: fluid.identity,
            recordType: recordType,
            priority: fluid.mergeRecordTypes[recordType]
        };
        return block;
    };

    // unsupported, NON-API function
    fluid.makeMergeOptions = function (policy, sources, userOptions) {
        // note - we close over the supplied policy as a shared object reference - it will be updated during discovery
        var options = {
            mergePolicy: policy,
            sources: sources
        };
        options = $.extend(options, userOptions);
        options.target = options.target || fluid.freshContainer(options.sources[0]);
        options.sourceStrategies = options.sourceStrategies || fluid.generate(options.sources.length, fluid.concreteTrundler);
        options.initter = function () {
            // This hack is necessary to ensure that the FINAL evaluation doesn't balk when discovering a trunk path which was already
            // visited during self-driving via the expander. This bi-modality is sort of rubbish, but we currently don't have "room"
            // in the strategy API to express when full evaluation is required - and the "flooding API" is not standardised. See FLUID-4930
            options.evaluateFully = true;
            fluid.fetchMergeChildren(options.target, 0, [], options.sources, options.mergePolicy, options);
        };
        fluid.makeMergeStrategy(options);
        return options;
    };

    // unsupported, NON-API function
    fluid.transformOptions = function (options, transRec) {
        fluid.expect("Options transformation record", transRec, ["transformer", "config"]);
        var transFunc = fluid.getGlobalValue(transRec.transformer);
        return transFunc.call(null, options, transRec.config);
    };

    // unsupported, NON-API function
    fluid.findMergeBlocks = function (mergeBlocks, recordType) {
        return fluid.remove_if(fluid.makeArray(mergeBlocks), function (block) { return block.recordType !== recordType; });
    };

    // unsupported, NON-API function
    fluid.transformOptionsBlocks = function (mergeBlocks, transformOptions, recordTypes) {
        fluid.each(recordTypes, function (recordType) {
            var blocks = fluid.findMergeBlocks(mergeBlocks, recordType);
            fluid.each(blocks, function (block) {
                var source = block.source ? "source" : "target"; // TODO: Problem here with irregular presentation of options which consist of a reference in their entirety
                block[block.simple || source === "target" ? "target" : "source"] = fluid.transformOptions(block[source], transformOptions);
            });
        });
    };

    // unsupported, NON-API function
    fluid.dedupeDistributionNamespaces = function (mergeBlocks) { // to implement FLUID-5824
        var byNamespace = {};
        fluid.remove_if(mergeBlocks, function (mergeBlock) {
            var ns = mergeBlock.namespace;
            if (ns) {
                if (byNamespace[ns] && byNamespace[ns] !== mergeBlock.contextThat.id) {  // source check for FLUID-5835
                    return true;
                } else {
                    byNamespace[ns] = mergeBlock.contextThat.id;
                }
            }
        });
    };

    // unsupported, NON-API function
    fluid.deliverOptionsStrategy = fluid.identity;
    fluid.computeComponentAccessor = fluid.identity;
    fluid.computeDynamicComponents = fluid.identity;

    // The types of merge record the system supports, with the weakest records first
    fluid.mergeRecordTypes = {
        defaults:           1000,
        defaultValueMerge:  900,
        subcomponentRecord: 800,
        user:               700,
        distribution:       100 // and above
    };

    // Utility used in the framework (primarily with distribution assembly), unconnected with new ChangeApplier
    // unsupported, NON-API function
    fluid.model.applyChangeRequest = function (model, request) {
        var segs = request.segs;
        if (segs.length === 0) {
            if (request.type === "ADD") {
                $.extend(true, model, request.value);
            } else {
                fluid.clear(model);
            }
        } else if (request.type === "ADD") {
            fluid.model.setSimple(model, request.segs, request.value);
        } else {
            for (var i = 0; i < segs.length - 1; ++i) {
                model = model[segs[i]];
                if (!model) {
                    return;
                }
            }
            var last = segs[segs.length - 1];
            delete model[last];
        }
    };

    /** Delete the value in the supplied object held at the specified path
     * @param target {Object} The object holding the value to be deleted (possibly empty)
     * @param segs {Array of String} the path of the value to be deleted
     */
    // unsupported, NON-API function
    fluid.destroyValue = function (target, segs) {
        if (target) {
            fluid.model.applyChangeRequest(target, {type: "DELETE", segs: segs});
        }
    };

    /**
     * Merges the component's declared defaults, as obtained from fluid.defaults(),
     * with the user's specified overrides.
     *
     * @param {Object} that the instance to attach the options to
     * @param {String} componentName the unique "name" of the component, which will be used
     * to fetch the default options from store. By recommendation, this should be the global
     * name of the component's creator function.
     * @param {Object} userOptions the user-specified configuration options for this component
     */
    // unsupported, NON-API function
    fluid.mergeComponentOptions = function (that, componentName, userOptions, localOptions) {
        var rawDefaults = fluid.rawDefaults(componentName);
        var defaults = fluid.getMergedDefaults(componentName, rawDefaults && rawDefaults.gradeNames ? null : localOptions.gradeNames);
        var sharedMergePolicy = {};

        var mergeBlocks = [];

        if (fluid.expandComponentOptions) {
            mergeBlocks = mergeBlocks.concat(fluid.expandComponentOptions(sharedMergePolicy, defaults, userOptions, that));
        }
        else {
            mergeBlocks = mergeBlocks.concat([fluid.simpleGingerBlock(defaults, "defaults"),
                                              fluid.simpleGingerBlock(userOptions, "user")]);
        }
        var options = {}; // ultimate target
        var sourceStrategies = [], sources = [];
        var baseMergeOptions = {
            target: options,
            sourceStrategies: sourceStrategies
        };
        // Called both from here and from IoC whenever there is a change of block content or arguments which
        // requires them to be resorted and rebound
        var updateBlocks = function () {
            fluid.each(mergeBlocks, function (block) {
                if (fluid.isPrimitive(block.priority)) {
                    block.priority = fluid.parsePriority(block.priority, 0, false, "options distribution");
                }
            });
            fluid.sortByPriority(mergeBlocks);
            fluid.dedupeDistributionNamespaces(mergeBlocks);
            sourceStrategies.length = 0;
            sources.length = 0;
            fluid.each(mergeBlocks, function (block) {
                sourceStrategies.push(block.strategy);
                sources.push(block.target);
            });
        };
        updateBlocks();
        var mergeOptions = fluid.makeMergeOptions(sharedMergePolicy, sources, baseMergeOptions);
        mergeOptions.mergeBlocks = mergeBlocks;
        mergeOptions.updateBlocks = updateBlocks;
        mergeOptions.destroyValue = function (segs) { // This method is a temporary hack to assist FLUID-5091
            for (var i = 0; i < mergeBlocks.length; ++i) {
                fluid.destroyValue(mergeBlocks[i].target, segs);
            }
            fluid.destroyValue(baseMergeOptions.target, segs);
        };

        var compiledPolicy;
        var mergePolicy;
        function computeMergePolicy() {
            // Decode the now available mergePolicy
            mergePolicy = fluid.driveStrategy(options, "mergePolicy", mergeOptions.strategy);
            mergePolicy = $.extend({}, fluid.rootMergePolicy, mergePolicy);
            compiledPolicy = fluid.compileMergePolicy(mergePolicy);
            // TODO: expandComponentOptions has already put some builtins here - performance implications of the now huge
            // default mergePolicy material need to be investigated as well as this deep merge
            $.extend(true, sharedMergePolicy, compiledPolicy.builtins); // ensure it gets broadcast to all sharers
        }
        computeMergePolicy();
        mergeOptions.computeMergePolicy = computeMergePolicy;

        if (compiledPolicy.hasDefaults) {
            if (fluid.generateExpandBlock) {
                mergeBlocks.push(fluid.generateExpandBlock({
                    options: compiledPolicy.defaultValues,
                    recordType: "defaultValueMerge",
                    priority: fluid.mergeRecordTypes.defaultValueMerge
                }, that, {}));
                updateBlocks();
            }
            else {
                fluid.fail("Cannot operate mergePolicy ", mergePolicy, " for component ", that, " without including FluidIoC.js");
            }
        }
        that.options = options;
        fluid.driveStrategy(options, "gradeNames", mergeOptions.strategy);

        fluid.deliverOptionsStrategy(that, options, mergeOptions); // do this early to broadcast and receive "distributeOptions"

        fluid.computeComponentAccessor(that, userOptions && userOptions.localRecord);

        var transformOptions = fluid.driveStrategy(options, "transformOptions", mergeOptions.strategy);
        if (transformOptions) {
            fluid.transformOptionsBlocks(mergeBlocks, transformOptions, ["user", "subcomponentRecord"]);
            updateBlocks(); // because the possibly simple blocks may have changed target
        }

        if (!baseMergeOptions.target.mergePolicy) {
            computeMergePolicy();
        }

        return mergeOptions;
    };

    // The Fluid Component System proper

    // The base system grade definitions

    fluid.defaults("fluid.function", {});

    /** Invoke a global function by name and named arguments. A courtesy to allow declaratively encoded function calls
     * to use named arguments rather than bare arrays.
     * @param name {String} A global name which can be resolved to a Function. The defaults for this name must
     * resolve onto a grade including "fluid.function". The defaults record should also contain an entry
     * <code>argumentMap</code>, a hash of argument names onto indexes.
     * @param spec {Object} A named hash holding the argument values to be sent to the function. These will be looked
     * up in the <code>argumentMap</code> and resolved into a flat list of arguments.
     * @return {Any} The return value from the function
     */

    fluid.invokeGradedFunction = function (name, spec) {
        var defaults = fluid.defaults(name);
        if (!defaults || !defaults.argumentMap || !fluid.hasGrade(defaults, "fluid.function")) {
            fluid.fail("Cannot look up name " + name +
                " to a function with registered argumentMap - got defaults ", defaults);
        }
        var args = [];
        fluid.each(defaults.argumentMap, function (value, key) {
            args[value] = spec[key];
        });
        return fluid.invokeGlobalFunction(name, args);
    };

    fluid.noNamespaceDistributionPrefix = "no-namespace-distribution-";

    fluid.mergeOneDistribution = function (target, source, key) {
        var namespace = source.namespace || key || fluid.noNamespaceDistributionPrefix + fluid.allocateGuid();
        source.namespace = namespace;
        target[namespace] = $.extend(true, {}, target[namespace], source);
    };

    fluid.distributeOptionsPolicy = function (target, source) {
        target = target || {};
        if (fluid.isArrayable(source)) {
            for (var i = 0; i < source.length; ++i) {
                fluid.mergeOneDistribution(target, source[i]);
            }
        } else if (typeof(source.target) === "string") {
            fluid.mergeOneDistribution(target, source);
        } else {
            fluid.each(source, function (oneSource, key) {
                fluid.mergeOneDistribution(target, oneSource, key);
            });
        }
        return target;
    };

    fluid.mergingArray = function () {};
    fluid.mergingArray.prototype = [];

    // Defer all evaluation of all nested members to resolve FLUID-5668
    fluid.membersMergePolicy = function (target, source) {
        target = target || {};
        fluid.each(source, function (oneSource, key) {
            if (!target[key]) {
                target[key] = new fluid.mergingArray();
            }
            if (oneSource instanceof fluid.mergingArray) {
                target[key].push.apply(target[key], oneSource);
            } else if (oneSource !== undefined) {
                target[key].push(oneSource);
            }
        });
        return target;
    };

    fluid.invokerStrategies = fluid.arrayToHash(["func", "funcName", "listener", "this", "method"]);

    // Resolve FLUID-5741, FLUID-5184 by ensuring that we avoid mixing incompatible invoker strategies
    fluid.invokersMergePolicy = function (target, source) {
        target = target || {};
        fluid.each(source, function (oneInvoker, name) {
            if (!oneInvoker) {
                target[name] = oneInvoker;
                return;
            } else {
                oneInvoker = fluid.upgradePrimitiveFunc(oneInvoker);
            }
            var oneT = target[name];
            if (!oneT) {
                oneT = target[name] = {};
            }
            for (var key in fluid.invokerStrategies) {
                if (key in oneInvoker) {
                    for (var key2 in fluid.invokerStrategies) {
                        oneT[key2] = undefined; // can't delete since stupid driveStrategy bug from recordStrategy reinstates them
                    }
                }
            }
            $.extend(oneT, oneInvoker);
        });
        return target;
    };

    fluid.rootMergePolicy = {
        gradeNames: fluid.arrayConcatPolicy,
        distributeOptions: fluid.distributeOptionsPolicy,
        members: {
            noexpand: true,
            func: fluid.membersMergePolicy
        },
        invokers: {
            noexpand: true,
            func: fluid.invokersMergePolicy
        },
        transformOptions: "replace",
        listeners: fluid.makeMergeListenersPolicy(fluid.mergeListenerPolicy)
    };

    fluid.defaults("fluid.component", {
        initFunction: "fluid.initLittleComponent",
        mergePolicy: fluid.rootMergePolicy,
        argumentMap: {
            options: 0
        },
        events: { // Three standard lifecycle points common to all components
            onCreate:     null,
            onDestroy:    null,
            afterDestroy: null
        }
    });

    fluid.defaults("fluid.emptySubcomponent", {
        gradeNames: ["fluid.component"]
    });

    /** Compute a "nickname" given a fully qualified typename, by returning the last path
     * segment.
     */

    fluid.computeNickName = function (typeName) {
        var segs = fluid.model.parseEL(typeName);
        return segs[segs.length - 1];
    };

    /** A specially recognised grade tag which directs the IoC framework to instantiate this component first amongst
     * its set of siblings, since it is likely to bear a context-forming type name. This will be removed from the framework
     * once we have implemented FLUID-4925 "wave of explosions" */

    fluid.defaults("fluid.typeFount", {
        gradeNames: ["fluid.component"]
    });

    /**
     * Creates a new "little component": a that-ist object with options merged into it by the framework.
     * This method is a convenience for creating small objects that have options but don't require full
     * View-like features such as the DOM Binder or events
     *
     * @param {Object} name the name of the little component to create
     * @param {Object} options user-supplied options to merge with the defaults
     */
    // NOTE: the 3rd argument localOptions is NOT to be advertised as part of the stable API, it is present
    // just to allow backward compatibility whilst grade specifications are not mandatory - similarly for 4th arg "receiver"
    // NOTE historical name to avoid confusion with fluid.initComponent below - this will all be refactored with FLUID-4925
    fluid.initLittleComponent = function (name, userOptions, localOptions, receiver) {
        var that = fluid.typeTag(name);
        that.lifecycleStatus = "constructing";
        localOptions = localOptions || {gradeNames: "fluid.component"};

        that.destroy = fluid.makeRootDestroy(that); // overwritten by FluidIoC for constructed subcomponents
        var mergeOptions = fluid.mergeComponentOptions(that, name, userOptions, localOptions);
        mergeOptions.exceptions = {members: {model: true, modelRelay: true}}; // don't evaluate these in "early flooding" - they must be fetched explicitly
        var options = that.options;
        that.events = {};
        // deliver to a non-IoC side early receiver of the component (currently only initView)
        (receiver || fluid.identity)(that, options, mergeOptions.strategy);
        fluid.computeDynamicComponents(that, mergeOptions);

        // TODO: ****THIS**** is the point we must deliver and suspend!! Construct the "component skeleton" first, and then continue
        // for as long as we can continue to find components.
        for (var i = 0; i < mergeOptions.mergeBlocks.length; ++i) {
            mergeOptions.mergeBlocks[i].initter();
        }
        mergeOptions.initter();
        delete options.mergePolicy;

        fluid.instantiateFirers(that, options);
        fluid.mergeListeners(that, that.events, options.listeners);

        return that;
    };

    fluid.diagnoseFailedView = fluid.identity;

    // unsupported, NON-API function
    fluid.makeRootDestroy = function (that) {
        return function () {
            fluid.doDestroy(that);
            fluid.fireEvent(that, "afterDestroy", [that, "", null]);
        };
    };

    /** Returns <code>true</code> if the supplied reference holds a component which has been destroyed **/

    fluid.isDestroyed = function (that) {
        return that.lifecycleStatus === "destroyed";
    };

    // unsupported, NON-API function
    fluid.doDestroy = function (that, name, parent) {
        fluid.fireEvent(that, "onDestroy", [that, name || "", parent]);
        that.lifecycleStatus = "destroyed";
        for (var key in that.events) {
            if (key !== "afterDestroy" && typeof(that.events[key].destroy) === "function") {
                that.events[key].destroy();
            }
        }
        if (that.applier) { // TODO: Break this out into the grade's destroyer
            that.applier.destroy();
        }
    };

    // unsupported, NON-API function
    fluid.initComponent = function (componentName, initArgs) {
        var options = fluid.defaults(componentName);
        if (!options.gradeNames) {
            fluid.fail("Cannot initialise component " + componentName + " which has no gradeName registered");
        }
        var args = [componentName].concat(fluid.makeArray(initArgs));
        var that;
        fluid.pushActivity("initComponent", "constructing component of type %componentName with arguments %initArgs",
            {componentName: componentName, initArgs: initArgs});
        that = fluid.invokeGlobalFunction(options.initFunction, args);
        fluid.diagnoseFailedView(componentName, that, options, args);
        if (fluid.initDependents) {
            fluid.initDependents(that);
        }
        var errors = fluid.validateListenersImplemented(that);
        if (errors.length > 0) {
            fluid.fail(fluid.transform(errors, function (error) {
                return ["Error constructing component ", that, " - the listener for event " + error.name + " with namespace " + error.namespace + (
                    (error.componentSource ? " which was defined in grade " + error.componentSource : "") + " needs to be overridden with a concrete implementation")];
            })).join("\n");
        }
        if (that.lifecycleStatus === "constructing") {
            that.lifecycleStatus = "constructed";
        }
        that.events.onCreate.fire(that);
        fluid.popActivity();
        return that;
    };

    // unsupported, NON-API function
    fluid.initSubcomponentImpl = function (that, entry, args) {
        var togo;
        if (typeof (entry) !== "function") {
            var entryType = typeof (entry) === "string" ? entry : entry.type;
            togo = entryType === "fluid.emptySubcomponent" ?
                null : fluid.invokeGlobalFunction(entryType, args);
        } else {
            togo = entry.apply(null, args);
        }
        return togo;
    };

    // ******* SELECTOR ENGINE *********

    // selector regexps copied from jQuery - recent versions correct the range to start C0
    // The initial portion of the main character selector: "just add water" to add on extra
    // accepted characters, as well as the "\\\\." -> "\." portion necessary for matching
    // period characters escaped in selectors
    var charStart = "(?:[\\w\\u00c0-\\uFFFF*_-";

    fluid.simpleCSSMatcher = {
        regexp: new RegExp("([#.]?)(" + charStart + "]|\\\\.)+)", "g"),
        charToTag: {
            "": "tag",
            "#": "id",
            ".": "clazz"
        }
    };

    fluid.IoCSSMatcher = {
        regexp: new RegExp("([&#]?)(" + charStart + "]|\\.|\\/)+)", "g"),
        charToTag: {
            "": "context",
            "&": "context",
            "#": "id"
        }
    };

    var childSeg = new RegExp("\\s*(>)?\\s*", "g");
//    var whiteSpace = new RegExp("^\\w*$");

    // Parses a selector expression into a data structure holding a list of predicates
    // 2nd argument is a "strategy" structure, e.g.  fluid.simpleCSSMatcher or fluid.IoCSSMatcher
    // unsupported, non-API function
    fluid.parseSelector = function (selstring, strategy) {
        var togo = [];
        selstring = selstring.trim();
        //ws-(ss*)[ws/>]
        var regexp = strategy.regexp;
        regexp.lastIndex = 0;
        var lastIndex = 0;
        while (true) {
            var atNode = []; // a list of predicates at a particular node
            var first = true;
            while (true) {
                var segMatch = regexp.exec(selstring);
                if (!segMatch) {
                    break;
                }
                if (segMatch.index !== lastIndex) {
                    if (first) {
                        fluid.fail("Error in selector string - cannot match child selector expression starting at " + selstring.substring(lastIndex));
                    }
                    else {
                        break;
                    }
                }
                var thisNode = {};
                var text = segMatch[2];
                var targetTag = strategy.charToTag[segMatch[1]];
                if (targetTag) {
                    thisNode[targetTag] = text;
                }
                atNode[atNode.length] = thisNode;
                lastIndex = regexp.lastIndex;
                first = false;
            }
            childSeg.lastIndex = lastIndex;
            var fullAtNode = {predList: atNode};
            var childMatch = childSeg.exec(selstring);
            if (!childMatch || childMatch.index !== lastIndex) {
                fluid.fail("Error in selector string - can not match child selector expression at " + selstring.substring(lastIndex));
            }
            if (childMatch[1] === ">") {
                fullAtNode.child = true;
            }
            togo[togo.length] = fullAtNode;
            // >= test here to compensate for IE bug http://blog.stevenlevithan.com/archives/exec-bugs
            if (childSeg.lastIndex >= selstring.length) {
                break;
            }
            lastIndex = childSeg.lastIndex;
            regexp.lastIndex = childSeg.lastIndex;
        }
        return togo;
    };

    // Message resolution and templating

   /**
    * Converts a string to a regexp with the specified flags given in parameters
    * @param {String} a string that has to be turned into a regular expression
    * @param {String} the flags to provide to the reg exp
    */
    // TODO: this is an abominably inefficient technique for something that could simply be done by means of indexOf and slice
    fluid.stringToRegExp = function (str, flags) {
        return new RegExp(str.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&"), flags);
    };

    /**
     * Simple string template system.
     * Takes a template string containing tokens in the form of "%value".
     * Returns a new string with the tokens replaced by the specified values.
     * Keys and values can be of any data type that can be coerced into a string.
     *
     * @param {String}    template    a string (can be HTML) that contains tokens embedded into it
     * @param {object}    values      a collection of token keys and values
     */
    fluid.stringTemplate = function (template, values) {
        var keys = fluid.keys(values);
        keys = keys.sort(fluid.compareStringLength());
        for (var i = 0; i < keys.length; ++i) {
            var key = keys[i];
            var re = fluid.stringToRegExp("%" + key, "g");
            template = template.replace(re, values[key]);
        }
        return template;
    };

})(jQuery, fluid_2_0_0);
;
/*!
 Copyright unscriptable.com / John Hann 2011
 Copyright Lucendo Development Ltd. 2014

 License MIT
*/

var fluid_2_0_0 = fluid_2_0_0 || {};

(function ($, fluid) {
    "use strict";

// Light fluidification of minimal promises library. See original gist at
// https://gist.github.com/unscriptable/814052 for limitations and commentary

// This implementation provides what could be described as "flat promises" with
// no support for structured programming idioms involving promise composition.
// It provides what a proponent of mainstream promises would describe as
// a "glorified callback aggregator"

    fluid.promise = function () {
        var that = {
            onResolve: [],
            onReject: []
            // disposition
            // value
        };
        that.then = function (onResolve, onReject) {
            if (onResolve) {
                if (that.disposition === "resolve") {
                    onResolve(that.value);
                } else {
                    that.onResolve.push(onResolve);
                }
            }
            if (onReject) {
                if (that.disposition === "reject") {
                    onReject(that.value);
                } else {
                    that.onReject.push(onReject);
                }
            }
            return that;
        };
        that.resolve = function (value) {
            if (that.disposition) {
                fluid.fail("Error: resolving promise ", that,
                    " which has already received \"" + that.disposition + "\"");
            } else {
                that.complete("resolve", that.onResolve, value);
            }
            return that;
        };
        that.reject = function (reason) {
            if (that.disposition) {
                fluid.fail("Error: rejecting promise ", that,
                    "which has already received \"" + that.disposition + "\"");
            } else {
                that.complete("reject", that.onReject, reason);
            }
            return that;
        };
        // PRIVATE, NON-API METHOD
        that.complete = function (which, queue, arg) {
            that.disposition = which;
            that.value = arg;
            for (var i = 0; i < queue.length; ++i) {
                queue[i](arg);
            }
        };
        return that;
    };

    /** Any object with a member <code>then</code> of type <code>function</code> passes this test.
     * This includes essentially every known variety, including jQuery promises.
     */
    fluid.isPromise = function (totest) {
        return totest && typeof(totest.then) === "function";
    };

    /** Coerces any value to a promise
     * @param promiseOrValue The value to be coerced
     * @return If the supplied value is already a promise, it is returned unchanged. Otherwise a fresh promise is created with the value as resolution and returned
     */
    fluid.toPromise = function (promiseOrValue) {
        if (fluid.isPromise(promiseOrValue)) {
            return promiseOrValue;
        } else {
            var togo = fluid.promise();
            togo.resolve(promiseOrValue);
            return togo;
        }
    };

    /** Chains the resolution methods of one promise (target) so that they follow those of another (source).
      * That is, whenever source resolves, target will resolve, or when source rejects, target will reject, with the
      * same payloads in each case.
      */
    fluid.promise.follow = function (source, target) {
        source.then(target.resolve, target.reject);
    };

    /** Returns a promise whose resolved value is mapped from the source promise or value by the supplied function.
     * @param source {Object|Promise} An object or promise whose value is to be mapped
     * @param func {Function} A function which will map the resolved promise value
     * @return {Promise} A promise for the resolved mapped value.
     */
    fluid.promise.map = function (source, func) {
        var promise = fluid.toPromise(source);
        var togo = fluid.promise();
        promise.then(function (value) {
            var mapped = func(value);
            togo.resolve(mapped);
        }, function (error) {
            togo.reject(error);
        });
        return togo;
    };

    /* General skeleton for all sequential promise algorithms, e.g. transform, reduce, sequence, etc.
     * These accept a variable "strategy" pair to customise the interchange of values and final return
     */

    fluid.promise.makeSequencer = function (sources, options, strategy) {
        if (!fluid.isArrayable(sources)) {
            fluid.fail("fluid.promise sequence algorithms must be supplied an array as source");
        }
        return {
            sources: sources,
            resolvedSources: [], // the values of "sources" only with functions invoked (an array of promises or values)
            index: 0,
            strategy: strategy,
            options: options, // available to be supplied to each listener
            returns: [],
            promise: fluid.promise() // the final return value
        };
    };

    fluid.promise.progressSequence = function (that, retValue) {
        that.returns.push(retValue);
        that.index++;
        // No we dun't have no tail recursion elimination
        fluid.promise.resumeSequence(that);
    };

    fluid.promise.processSequenceReject = function (that, error) { // Allow earlier promises in the sequence to wrap the rejection supplied by later ones (FLUID-5584)
        for (var i = that.index - 1; i >= 0; --i) {
            var resolved = that.resolvedSources[i];
            var accumulator = fluid.isPromise(resolved) && typeof(resolved.accumulateRejectionReason) === "function" ? resolved.accumulateRejectionReason : fluid.identity;
            error = accumulator(error);
        }
        that.promise.reject(error);
    };

    fluid.promise.resumeSequence = function (that) {
        if (that.index === that.sources.length) {
            that.promise.resolve(that.strategy.resolveResult(that));
        } else {
            var value = that.strategy.invokeNext(that);
            that.resolvedSources[that.index] = value;
            if (fluid.isPromise(value)) {
                value.then(function (retValue) {
                    fluid.promise.progressSequence(that, retValue);
                }, function (error) {
                    fluid.promise.processSequenceReject(that, error);
                });
            } else {
                fluid.promise.progressSequence(that, value);
            }
        }
    };

    // SEQUENCE ALGORITHM APPLYING PROMISES

    fluid.promise.makeSequenceStrategy = function () {
        return {
            invokeNext: function (that) {
                var source = that.sources[that.index];
                return typeof(source) === "function" ? source(that.options) : source;
            },
            resolveResult: function (that) {
                return that.returns;
            }
        };
    };

    // accepts an array of values, promises or functions returning promises - in the case of functions returning promises,
    // will assure that at most one of these is "in flight" at a time - that is, the succeeding function will not be invoked
    // until the promise at the preceding position has resolved
    fluid.promise.sequence = function (sources, options) {
        var sequencer = fluid.promise.makeSequencer(sources, options, fluid.promise.makeSequenceStrategy());
        fluid.promise.resumeSequence(sequencer);
        return sequencer.promise;
    };

    // TRANSFORM ALGORITHM APPLYING PROMISES

    fluid.promise.makeTransformerStrategy = function () {
        return {
            invokeNext: function (that) {
                var lisrec = that.sources[that.index];
                lisrec.listener = fluid.event.resolveListener(lisrec.listener);
                var value = lisrec.listener(that.returns[that.index], that.options);
                return value;
            },
            resolveResult: function (that) {
                return that.returns[that.index];
            }
        };
    };

    // Construct a "mini-object" managing the process of a sequence of transforms,
    // each of which may be synchronous or return a promise
    fluid.promise.makeTransformer = function (listeners, payload, options) {
        listeners.unshift({listener:
            function () {
                return payload;
            }
        });
        var sequencer = fluid.promise.makeSequencer(listeners, options, fluid.promise.makeTransformerStrategy());
        sequencer.returns.push(null); // first dummy return from initial entry
        fluid.promise.resumeSequence(sequencer);
        return sequencer;
    };

    fluid.promise.filterNamespaces = function (listeners, namespaces) {
        if (!namespaces) {
            return listeners;
        }
        return fluid.remove_if(fluid.makeArray(listeners), function (element) {
            return element.namespace && !element.softNamespace && !fluid.contains(namespaces, element.namespace);
        });
    };

   /** Top-level API to operate a Fluid event which manages a sequence of
     * chained transforms. Rather than being a standard listener accepting the
     * same payload, each listener to the event accepts the payload returned by the
     * previous listener, and returns either a transformed payload or else a promise
     * yielding such a payload.
     * @param event {fluid.eventFirer} A Fluid event to which the listeners are to be interpreted as
     * elements cooperating in a chained transform. Each listener will receive arguments <code>(payload, options)</code> where <code>payload</code>
     * is the (successful, resolved) return value of the previous listener, and <code>options</code> is the final argument to this function
     * @param payload {Object|Promise} The initial payload input to the transform chain
     * @param options {Object} A free object containing options governing the transform. Fields interpreted at this top level are:
     *     reverse {Boolean}: <code>true</code> if the listeners are to be called in reverse order of priority (typically the case for an inverse transform)
     *     filterTransforms {Array}: An array of listener namespaces. If this field is set, only the transform elements whose listener namespaces listed in this array will be applied.
     * @return {fluid.promise} A promise which will yield either the final transformed value, or the response of the first transform which fails.
     */

    fluid.promise.fireTransformEvent = function (event, payload, options) {
        options = options || {};
        var listeners = options.reverse ? fluid.makeArray(event.sortedListeners).reverse() :
                fluid.makeArray(event.sortedListeners);
        listeners = fluid.promise.filterNamespaces(listeners, options.filterNamespaces);
        var transformer = fluid.promise.makeTransformer(listeners, payload, options);
        return transformer.promise;
    };


})(jQuery, fluid_2_0_0);
;
/*
Copyright 2007-2010 University of Cambridge
Copyright 2007-2009 University of Toronto
Copyright 2010-2011 Lucendo Development Ltd.
Copyright 2010 OCAD University
Copyright 2005-2013 jQuery Foundation, Inc. and other contributors

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

/** This file contains functions which depend on the presence of a DOM document
 * but which do not depend on the contents of Fluid.js **/

var fluid_2_0_0 = fluid_2_0_0 || {};

(function ($, fluid) {
    "use strict";

    // polyfill for $.browser which was removed in jQuery 1.9 and later
    // Taken from jquery-migrate-1.2.1.js,
    // jQuery Migrate - v1.2.1 - 2013-05-08
    // https://github.com/jquery/jquery-migrate
    // Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors; Licensed MIT

    fluid.uaMatch = function (ua) {
        ua = ua.toLowerCase();

        var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
            /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
            /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
            /(msie) ([\w.]+)/.exec( ua ) ||
        ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) || [];

        return {
            browser: match[ 1 ] || "",
            version: match[ 2 ] || "0"
        };
    };

    var matched, browser;

    // Don't clobber any existing jQuery.browser in case it's different
    if (!$.browser) {
        if (!!navigator.userAgent.match(/Trident\/7\./)) {
            browser = { // From http://stackoverflow.com/questions/18684099/jquery-fail-to-detect-ie-11
                msie: true,
                version: 11
            };
        } else {
            matched = fluid.uaMatch(navigator.userAgent);
            browser = {};

            if (matched.browser) {
                browser[matched.browser] = true;
                browser.version = matched.version;
            }
            // Chrome is Webkit, but Webkit is also Safari.
            if (browser.chrome) {
                browser.webkit = true;
            } else if (browser.webkit) {
                browser.safari = true;
            }
        }
        $.browser = browser;
    }

    // Private constants.
    var NAMESPACE_KEY = "fluid-scoped-data";

    /**
     * Gets stored state from the jQuery instance's data map.
     * This function is unsupported: It is not really intended for use by implementors.
     */
    fluid.getScopedData = function (target, key) {
        var data = $(target).data(NAMESPACE_KEY);
        return data ? data[key] : undefined;
    };

    /**
     * Stores state in the jQuery instance's data map. Unlike jQuery's version,
     * accepts multiple-element jQueries.
     * This function is unsupported: It is not really intended for use by implementors.
     */
    fluid.setScopedData = function (target, key, value) {
        $(target).each(function () {
            var data = $.data(this, NAMESPACE_KEY) || {};
            data[key] = value;

            $.data(this, NAMESPACE_KEY, data);
        });
    };

    /** Global focus manager - makes use of "focusin" event supported in jquery 1.4.2 or later.
     */

    var lastFocusedElement = null;

    $(document).bind("focusin", function (event) {
        lastFocusedElement = event.target;
    });

    fluid.getLastFocusedElement = function () {
        return lastFocusedElement;
    };


    var ENABLEMENT_KEY = "enablement";

    /** Queries or sets the enabled status of a control. An activatable node
     * may be "disabled" in which case its keyboard bindings will be inoperable
     * (but still stored) until it is reenabled again.
     * This function is unsupported: It is not really intended for use by implementors.
     */

    fluid.enabled = function (target, state) {
        target = $(target);
        if (state === undefined) {
            return fluid.getScopedData(target, ENABLEMENT_KEY) !== false;
        }
        else {
            $("*", target).add(target).each(function () {
                if (fluid.getScopedData(this, ENABLEMENT_KEY) !== undefined) {
                    fluid.setScopedData(this, ENABLEMENT_KEY, state);
                }
                else if (/select|textarea|input/i.test(this.nodeName)) {
                    $(this).prop("disabled", !state);
                }
            });
            fluid.setScopedData(target, ENABLEMENT_KEY, state);
        }
    };

    fluid.initEnablement = function (target) {
        fluid.setScopedData(target, ENABLEMENT_KEY, true);
    };

    // This utility is required through the use of newer versions of jQuery which will obscure the original
    // event responsible for interaction with a target. This is currently use in Tooltip.js and FluidView.js
    // "dead man's blur" but would be of general utility

    fluid.resolveEventTarget = function (event) {
        while (event.originalEvent && event.originalEvent.target) {
            event = event.originalEvent;
        }
        return event.target;
    };

    // These function (fluid.focus() and fluid.blur()) serve several functions. They should be used by
    // all implementation both in test cases and component implementation which require to trigger a focus
    // event. Firstly, they restore the old behaviour in jQuery versions prior to 1.10 in which a focus
    // trigger synchronously relays to a focus handler. In newer jQueries this defers to the real browser
    // relay with numerous platform and timing-dependent effects.
    // Secondly, they are necessary since simulation of focus events by jQuery under IE
    // is not sufficiently good to intercept the "focusin" binding. Any code which triggers
    // focus or blur synthetically throughout the framework and client code must use this function,
    // especially if correct cross-platform interaction is required with the "deadMansBlur" function.

    function applyOp(node, func) {
        node = $(node);
        node.trigger("fluid-" + func);
        node.triggerHandler(func);
        node[func]();
        return node;
    }

    $.each(["focus", "blur"], function (i, name) {
        fluid[name] = function (elem) {
            return applyOp(elem, name);
        };
    });

    /* Sets the value to the DOM element and triggers the change event on the element.
     * Note: when using jQuery val() function to change the node value, the change event would
     * not be fired automatically, it requires to be initiated by the user.
     *
     * @param node {A jQueryable DOM element} A selector, a DOM node, or a jQuery instance
     * @param value {String|Number|Array} A string of text, a number, or an array of strings
     * corresponding to the value of each matched element to set in the node
     */
    fluid.changeElementValue = function (node, value) {
        node = $(node);
        node.val(value).change();
    };

})(jQuery, fluid_2_0_0);
;
/*
Copyright 2008-2010 University of Cambridge
Copyright 2008-2009 University of Toronto

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

var fluid_2_0_0 = fluid_2_0_0 || {};

(function ($, fluid) {
    "use strict";

    fluid.dom = fluid.dom || {};

    // Node walker function for iterateDom.
    var getNextNode = function (iterator) {
        if (iterator.node.firstChild) {
            iterator.node = iterator.node.firstChild;
            iterator.depth += 1;
            return iterator;
        }
        while (iterator.node) {
            if (iterator.node.nextSibling) {
                iterator.node = iterator.node.nextSibling;
                return iterator;
            }
            iterator.node = iterator.node.parentNode;
            iterator.depth -= 1;
        }
        return iterator;
    };

    /**
     * Walks the DOM, applying the specified acceptor function to each element.
     * There is a special case for the acceptor, allowing for quick deletion of elements and their children.
     * Return "delete" from your acceptor function if you want to delete the element in question.
     * Return "stop" to terminate iteration.

     * Implementation note - this utility exists mainly for performance reasons. It was last tested
     * carefully some time ago (around jQuery 1.2) but at that time was around 3-4x faster at raw DOM
     * filtration tasks than the jQuery equivalents, which was an important source of performance loss in the
     * Reorderer component. General clients of the framework should use this method with caution if at all, and
     * the performance issues should be reassessed when we have time.
     *
     * @param {Element} node the node to start walking from
     * @param {Function} acceptor the function to invoke with each DOM element
     * @param {Boolean} allnodes Use <code>true</code> to call acceptor on all nodes,
     * rather than just element nodes (type 1)
     */
    fluid.dom.iterateDom = function (node, acceptor, allNodes) {
        var currentNode = {node: node, depth: 0};
        var prevNode = node;
        var condition;
        while (currentNode.node !== null && currentNode.depth >= 0 && currentNode.depth < fluid.dom.iterateDom.DOM_BAIL_DEPTH) {
            condition = null;
            if (currentNode.node.nodeType === 1 || allNodes) {
                condition = acceptor(currentNode.node, currentNode.depth);
            }
            if (condition) {
                if (condition === "delete") {
                    currentNode.node.parentNode.removeChild(currentNode.node);
                    currentNode.node = prevNode;
                }
                else if (condition === "stop") {
                    return currentNode.node;
                }
            }
            prevNode = currentNode.node;
            currentNode = getNextNode(currentNode);
        }
    };

    // Work around IE circular DOM issue. This is the default max DOM depth on IE.
    // http://msdn2.microsoft.com/en-us/library/ms761392(VS.85).aspx
    fluid.dom.iterateDom.DOM_BAIL_DEPTH = 256;

    /**
     * Checks if the specified container is actually the parent of containee.
     *
     * @param {Element} container the potential parent
     * @param {Element} containee the child in question
     */
    fluid.dom.isContainer = function (container, containee) {
        for (; containee; containee = containee.parentNode) {
            if (container === containee) {
                return true;
            }
        }
        return false;
    };

    /** Return the element text from the supplied DOM node as a single String.
     * Implementation note - this is a special-purpose utility used in the framework in just one
     * position in the Reorderer. It only performs a "shallow" traversal of the text and was intended
     * as a quick and dirty means of extracting element labels where the user had not explicitly provided one.
     * It should not be used by general users of the framework and its presence here needs to be
     * reassessed.
     */
    fluid.dom.getElementText = function (element) {
        var nodes = element.childNodes;
        var text = "";
        for (var i = 0; i < nodes.length; ++i) {
            var child = nodes[i];
            if (child.nodeType === 3) {
                text = text + child.nodeValue;
            }
        }
        return text;
    };

})(jQuery, fluid_2_0_0);
;
/*
Copyright 2008-2010 University of Cambridge
Copyright 2008-2009 University of Toronto
Copyright 2010 Lucendo Development Ltd.

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

fluid_2_0_0 = fluid_2_0_0 || {};

(function ($, fluid) {
    "use strict";

    var unUnicode = /(\\u[\dabcdef]{4}|\\x[\dabcdef]{2})/g;

    fluid.unescapeProperties = function (string) {
        string = string.replace(unUnicode, function (match) {
            var code = match.substring(2);
            var parsed = parseInt(code, 16);
            return String.fromCharCode(parsed);
        });
        var pos = 0;
        while (true) {
            var backpos = string.indexOf("\\", pos);
            if (backpos === -1) {
                break;
            }
            if (backpos === string.length - 1) {
                return [string.substring(0, string.length - 1), true];
            }
            var replace = string.charAt(backpos + 1);
            if (replace === "n") { replace = "\n"; }
            if (replace === "r") { replace = "\r"; }
            if (replace === "t") { replace = "\t"; }
            string = string.substring(0, backpos) + replace + string.substring(backpos + 2);
            pos = backpos + 1;
        }
        return [string, false];
    };

    var breakPos = /[^\\][\s:=]/;

    fluid.parseJavaProperties = function (text) {
        // File format described at http://java.sun.com/javase/6/docs/api/java/util/Properties.html#load(java.io.Reader)
        var togo = {};
        text = text.replace(/\r\n/g, "\n");
        text = text.replace(/\r/g, "\n");
        var lines = text.split("\n");
        var contin, key, valueComp, valueRaw, valueEsc;
        for (var i = 0; i < lines.length; ++i) {
            var line = $.trim(lines[i]);
            if (!line || line.charAt(0) === "#" || line.charAt(0) === "!") {
                continue;
            }
            if (!contin) {
                valueComp = "";
                var breakpos = line.search(breakPos);
                if (breakpos === -1) {
                    key = line;
                    valueRaw = "";
                }
                else {
                    key = $.trim(line.substring(0, breakpos + 1)); // +1 since first char is escape exclusion
                    valueRaw = $.trim(line.substring(breakpos + 2));
                    if (valueRaw.charAt(0) === ":" || valueRaw.charAt(0) === "=") {
                        valueRaw = $.trim(valueRaw.substring(1));
                    }
                }

                key = fluid.unescapeProperties(key)[0];
                valueEsc = fluid.unescapeProperties(valueRaw);
            }
            else {
                valueEsc = fluid.unescapeProperties(line);
            }

            contin = valueEsc[1];
            if (!valueEsc[1]) { // this line was not a continuation line - store the value
                togo[key] = valueComp + valueEsc[0];
            }
            else {
                valueComp += valueEsc[0];
            }
        }
        return togo;
    };

    /**
    * Expand a message string with respect to a set of arguments, following a basic
    * subset of the Java MessageFormat rules.
    * http://java.sun.com/j2se/1.4.2/docs/api/java/text/MessageFormat.html
    *
    * The message string is expected to contain replacement specifications such
    * as {0}, {1}, {2}, etc.
    * @param messageString {String} The message key to be expanded
    * @param args {String/Array of String} An array of arguments to be substituted into the message.
    * @return The expanded message string.
    */
    fluid.formatMessage = function (messageString, args) {
        if (!args) {
            return messageString;
        }
        if (typeof(args) === "string") {
            args = [args];
        }
        for (var i = 0; i < args.length; ++i) {
            messageString = messageString.replace("{" + i + "}", args[i]);
        }
        return messageString;
    };

})(jQuery, fluid_2_0_0);
;
/*
Copyright 2007-2010 University of Cambridge
Copyright 2007-2009 University of Toronto
Copyright 2007-2009 University of California, Berkeley
Copyright 2010 OCAD University
Copyright 2010-2011 Lucendo Development Ltd.

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

var fluid_2_0_0 = fluid_2_0_0 || {};
var fluid = fluid || fluid_2_0_0;

(function ($, fluid) {
    "use strict";

    /** Render a timestamp from a Date object into a helpful fixed format for debug logs to millisecond accuracy
     * @param date {Date} The date to be rendered
     * @return {String} A string format consisting of hours:minutes:seconds.millis for the datestamp padded to fixed with
     */

    fluid.renderTimestamp = function (date) {
        var zeropad = function (num, width) {
            if (!width) { width = 2; }
            var numstr = (num === undefined ? "" : num.toString());
            return "00000".substring(5 - width + numstr.length) + numstr;
        };
        return zeropad(date.getHours()) + ":" + zeropad(date.getMinutes()) + ":" + zeropad(date.getSeconds()) + "." + zeropad(date.getMilliseconds(), 3);
    };

    fluid.isTracing = false;

    fluid.registerNamespace("fluid.tracing");

    fluid.tracing.pathCount = [];

    fluid.tracing.summarisePathCount = function (pathCount) {
        pathCount = pathCount || fluid.tracing.pathCount;
        var togo = {};
        for (var i = 0; i < pathCount.length; ++i) {
            var path = pathCount[i];
            if (!togo[path]) {
                togo[path] = 1;
            }
            else {
                ++togo[path];
            }
        }
        var toReallyGo = [];
        fluid.each(togo, function (el, path) {
            toReallyGo.push({path: path, count: el});
        });
        toReallyGo.sort(function (a, b) {return b.count - a.count;});
        return toReallyGo;
    };

    fluid.tracing.condensePathCount = function (prefixes, pathCount) {
        prefixes = fluid.makeArray(prefixes);
        var prefixCount = {};
        fluid.each(prefixes, function (prefix) {
            prefixCount[prefix] = 0;
        });
        var togo = [];
        fluid.each(pathCount, function (el) {
            var path = el.path;
            if (!fluid.find(prefixes, function (prefix) {
                if (path.indexOf(prefix) === 0) {
                    prefixCount[prefix] += el.count;
                    return true;
                }
            })) {
                togo.push(el);
            }
        });
        fluid.each(prefixCount, function (count, path) {
            togo.unshift({path: path, count: count});
        });
        return togo;
    };

    // Exception stripping code taken from https://github.com/emwendelin/javascript-stacktrace/blob/master/stacktrace.js
    // BSD licence, see header

    fluid.detectStackStyle = function (e) {
        var style = "other";
        var stackStyle = {
            offset: 0
        };
        if (e.arguments) {
            style = "chrome";
        } else if (typeof window !== "undefined" && window.opera && e.stacktrace) {
            style = "opera10";
        } else if (e.stack) {
            style = "firefox";
            // Detect FireFox 4-style stacks which are 1 level less deep
            stackStyle.offset = e.stack.indexOf("Trace exception") === -1 ? 1 : 0;
        } else if (typeof window !== "undefined" && window.opera && !("stacktrace" in e)) { //Opera 9-
            style = "opera";
        }
        stackStyle.style = style;
        return stackStyle;
    };

    fluid.obtainException = function () {
        try {
            throw new Error("Trace exception");
        }
        catch (e) {
            return e;
        }
    };

    var stackStyle = fluid.detectStackStyle(fluid.obtainException());

    fluid.registerNamespace("fluid.exceptionDecoders");

    fluid.decodeStack = function () {
        if (stackStyle.style !== "firefox") {
            return null;
        }
        var e = fluid.obtainException();
        return fluid.exceptionDecoders[stackStyle.style](e);
    };

    fluid.exceptionDecoders.firefox = function (e) {
        var delimiter = "at ";
        var lines = e.stack.replace(/(?:\n@:0)?\s+$/m, "").replace(/^\(/gm, "{anonymous}(").split("\n");
        return fluid.transform(lines, function (line) {
            line = line.replace(/\)/g, "");
            var atind = line.indexOf(delimiter);
            return atind === -1 ? [line] : [line.substring(atind + delimiter.length), line.substring(0, atind)];
        });
    };

    // Main entry point for callers.
    fluid.getCallerInfo = function (atDepth) {
        atDepth = (atDepth || 3) - stackStyle.offset;
        var stack = fluid.decodeStack();
        var element = stack && stack[atDepth][0];
        if (element) {
            var lastslash = element.lastIndexOf("/");
            if (lastslash === -1) {
                lastslash = 0;
            }
            var nextColon = element.indexOf(":", lastslash);
            return {
                path: element.substring(0, lastslash),
                filename: element.substring(lastslash + 1, nextColon),
                index: element.substring(nextColon + 1)
            };
        } else {
            return null;
        }
    };

    /** Generates a string for padding purposes by replicating a character a given number of times
     * @param c {Character} A character to be used for padding
     * @param count {Integer} The number of times to repeat the character
     * @return A string of length <code>count</code> consisting of repetitions of the supplied character
     */
    // UNOPTIMISED
    fluid.generatePadding = function (c, count) {
        var togo = "";
        for (var i = 0; i < count; ++i) {
            togo += c;
        }
        return togo;
    };

    // Marker so that we can render a custom string for properties which are not direct and concrete
    fluid.SYNTHETIC_PROPERTY = {};

    // utility to avoid triggering custom getter code which could throw an exception - e.g. express 3.x's request object
    fluid.getSafeProperty = function (obj, key) {
        var desc = Object.getOwnPropertyDescriptor(obj, key); // supported on all of our environments - is broken on IE8
        return desc && !desc.get ? obj[key] : fluid.SYNTHETIC_PROPERTY;
    };

    function printImpl(obj, small, options) {
        function out(str) {
            options.output += str;
        }
        var big = small + options.indentChars, isFunction = typeof(obj) === "function";
        if (options.maxRenderChars !== undefined && options.output.length > options.maxRenderChars) {
            return true;
        }
        if (obj === null) {
            out("null");
        } else if (obj === undefined) {
            out("undefined"); // NB - object invalid for JSON interchange
        } else if (obj === fluid.SYNTHETIC_PROPERTY) {
            out("[Synthetic property]");
        } else if (fluid.isPrimitive(obj) && !isFunction) {
            out(JSON.stringify(obj));
        }
        else {
            if (options.stack.indexOf(obj) !== -1) {
                out("(CIRCULAR)"); // NB - object invalid for JSON interchange
                return;
            }
            options.stack.push(obj);
            var i;
            if (fluid.isArrayable(obj)) {
                if (obj.length === 0) {
                    out("[]");
                } else {
                    out("[\n" + big);
                    for (i = 0; i < obj.length; ++i) {
                        if (printImpl(obj[i], big, options)) {
                            return true;
                        }
                        if (i !== obj.length - 1) {
                            out(",\n" + big);
                        }
                    }
                    out("\n" + small + "]");
                }
            }
            else {
                out("{" + (isFunction ? " Function" : "") + "\n" + big); // NB - Function object invalid for JSON interchange
                var keys = fluid.keys(obj);
                for (i = 0; i < keys.length; ++i) {
                    var key = keys[i];
                    var value = fluid.getSafeProperty(obj, key);
                    out(JSON.stringify(key) + ": ");
                    if (printImpl(value, big, options)) {
                        return true;
                    }
                    if (i !== keys.length - 1) {
                        out(",\n" + big);
                    }
                }
                out("\n" + small + "}");
            }
            options.stack.pop();
        }
        return;
    }

    /** Render a complex JSON object into a nicely indented format suitable for human readability.
     * @param obj {Object} The object to be rendered
     * @param options {Object} An options structure governing the rendering process. This supports the following options:
     *     <code>indent</code> {Integer} the number of space characters to be used to indent each level of containment (default value: 4)
     *     <code>maxRenderChars</code> {Integer} rendering the object will cease once this number of characters has been generated
     */
    fluid.prettyPrintJSON = function (obj, options) {
        options = $.extend({indent: 4, stack: [], output: ""}, options);
        options.indentChars = fluid.generatePadding(" ", options.indent);
        printImpl(obj, "", options);
        return options.output;
    };

    /**
     * Dumps a DOM element into a readily recognisable form for debugging - produces a
     * "semi-selector" summarising its tag name, class and id, whichever are set.
     *
     * @param {jQueryable} element The element to be dumped
     * @return A string representing the element.
     */
    fluid.dumpEl = function (element) {
        var togo;

        if (!element) {
            return "null";
        }
        if (element.nodeType === 3 || element.nodeType === 8) {
            return "[data: " + element.data + "]";
        }
        if (element.nodeType === 9) {
            return "[document: location " + element.location + "]";
        }
        if (!element.nodeType && fluid.isArrayable(element)) {
            togo = "[";
            for (var i = 0; i < element.length; ++i) {
                togo += fluid.dumpEl(element[i]);
                if (i < element.length - 1) {
                    togo += ", ";
                }
            }
            return togo + "]";
        }
        element = $(element);
        togo = element.get(0).tagName;
        if (element.id) {
            togo += "#" + element.id;
        }
        if (element.attr("class")) {
            togo += "." + element.attr("class");
        }
        return togo;
    };

})(jQuery, fluid_2_0_0);
;
/*
Copyright 2011-2013 OCAD University
Copyright 2010-2015 Lucendo Development Ltd.

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

var fluid_2_0_0 = fluid_2_0_0 || {};

(function ($, fluid) {
    "use strict";

    /** NOTE: The contents of this file are by default NOT PART OF THE PUBLIC FLUID API unless explicitly annotated before the function **/

    /** The Fluid "IoC System proper" - resolution of references and
     * completely automated instantiation of declaratively defined
     * component trees */

    // Currently still uses manual traversal - once we ban manually instantiated components,
    // it will use the instantiator's records instead.
    fluid.visitComponentChildren = function (that, visitor, options, segs) {
        segs = segs || [];
        for (var name in that) {
            var component = that[name];
            // This entire algorithm is primitive and expensive and will be removed once we can abolish manual init components
            if (!fluid.isComponent(component) || (options.visited && options.visited[component.id])) {
                continue;
            }
            segs.push(name);
            if (options.visited) { // recall that this is here because we may run into a component that has been cross-injected which might otherwise cause cyclicity
                options.visited[component.id] = true;
            }
            if (visitor(component, name, segs, segs.length - 1)) {
                return true;
            }
            if (!options.flat) {
                fluid.visitComponentChildren(component, visitor, options, segs);
            }
            segs.pop();
        }
    };

    fluid.getContextHash = function (instantiator, that) {
        var shadow = instantiator.idToShadow[that.id];
        return shadow && shadow.contextHash;
    };

    fluid.componentHasGrade = function (that, gradeName) {
        var contextHash = fluid.getContextHash(fluid.globalInstantiator, that);
        return !!(contextHash && contextHash[gradeName]);
    };

    // A variant of fluid.visitComponentChildren that supplies the signature expected for fluid.matchIoCSelector
    // this is: thatStack, contextHashes, memberNames, i - note, the supplied arrays are NOT writeable and shared through the iteration
    fluid.visitComponentsForMatching = function (that, options, visitor) {
        var instantiator = fluid.getInstantiator(that);
        options = $.extend({
            visited: {},
            instantiator: instantiator
        }, options);
        var thatStack = [that];
        var contextHashes = [fluid.getContextHash(instantiator, that)];
        var visitorWrapper = function (component, name, segs) {
            thatStack.length = 1;
            contextHashes.length = 1;
            for (var i = 0; i < segs.length; ++i) {
                var child = thatStack[i][segs[i]];
                thatStack[i + 1] = child;
                contextHashes[i + 1] = fluid.getContextHash(instantiator, child) || {};
            }
            return visitor(component, thatStack, contextHashes, segs, segs.length);
        };
        fluid.visitComponentChildren(that, visitorWrapper, options, []);
    };

    fluid.getMemberNames = function (instantiator, thatStack) {
        var path = instantiator.idToPath(thatStack[thatStack.length - 1].id);
        var segs = instantiator.parseEL(path);
            // TODO: we should now have no longer shortness in the stack
        segs.unshift.apply(segs, fluid.generate(thatStack.length - segs.length, ""));

        return segs;
    };

    // thatStack contains an increasing list of MORE SPECIFIC thats.
    // this visits all components starting from the current location (end of stack)
    // in visibility order UP the tree.
    fluid.visitComponentsForVisibility = function (instantiator, thatStack, visitor, options) {
        options = options || {
            visited: {},
            flat: true,
            instantiator: instantiator
        };
        var memberNames = fluid.getMemberNames(instantiator, thatStack);
        for (var i = thatStack.length - 1; i >= 0; --i) {
            var that = thatStack[i];

            // explicitly visit the direct parent first
            options.visited[that.id] = true;
            if (visitor(that, memberNames[i], memberNames, i)) {
                return;
            }

            if (fluid.visitComponentChildren(that, visitor, options, memberNames)) {
                return;
            }
            memberNames.pop();
        }
    };

    fluid.mountStrategy = function (prefix, root, toMount) {
        var offset = prefix.length;
        return function (target, name, i, segs) {
            if (i <= prefix.length) { // Avoid OOB to not trigger deoptimisation!
                return;
            }
            for (var j = 0; j < prefix.length; ++j) {
                if (segs[j] !== prefix[j]) {
                    return;
                }
            }
            return toMount(target, name, i - prefix.length, segs.slice(offset));
        };
    };

    fluid.invokerFromRecord = function (invokerec, name, that) {
        fluid.pushActivity("makeInvoker", "beginning instantiation of invoker with name %name and record %record as child of %that",
            {name: name, record: invokerec, that: that});
        var invoker = invokerec ? fluid.makeInvoker(that, invokerec, name) : undefined;
        fluid.popActivity();
        return invoker;
    };

    fluid.memberFromRecord = function (memberrecs, name, that) {
        var togo;
        for (var i = 0; i < memberrecs.length; ++i) { // memberrecs is the special "fluid.mergingArray" type which is not Arrayable
            var expanded = fluid.expandImmediate(memberrecs[i], that);
            if (!fluid.isPlainObject(togo)) { // poor man's "merge" algorithm to hack FLUID-5668 for now
                togo = expanded;
            } else {
                togo = $.extend(true, togo, expanded);
            }
        }
        return togo;
    };

    fluid.recordStrategy = function (that, options, optionsStrategy, recordPath, recordMaker, prefix, exceptions) {
        prefix = prefix || [];
        return {
            strategy: function (target, name, i) {
                if (i !== 1) {
                    return;
                }
                var record = fluid.driveStrategy(options, [recordPath, name], optionsStrategy);
                if (record === undefined) {
                    return;
                }
                fluid.set(target, [name], fluid.inEvaluationMarker);
                var member = recordMaker(record, name, that);
                fluid.set(target, [name], member);
                return member;
            },
            initter: function () {
                var records = fluid.driveStrategy(options, recordPath, optionsStrategy) || {};
                for (var name in records) {
                    if (!exceptions || !exceptions[name]) {
                        fluid.getForComponent(that, prefix.concat([name]));
                    }
                }
            }
        };
    };

    // patch Fluid.js version for timing
    fluid.instantiateFirers = function (that) {
        var shadow = fluid.shadowForComponent(that);
        var initter = fluid.get(shadow, ["eventStrategyBlock", "initter"]) || fluid.identity;
        initter();
    };

    fluid.makeDistributionRecord = function (contextThat, sourceRecord, sourcePath, targetSegs, exclusions, sourceType) {
        sourceType = sourceType || "distribution";
        fluid.pushActivity("makeDistributionRecord", "Making distribution record from source record %sourceRecord path %sourcePath to target path %targetSegs", {sourceRecord: sourceRecord, sourcePath: sourcePath, targetSegs: targetSegs});

        var source = fluid.copy(fluid.get(sourceRecord, sourcePath));
        fluid.each(exclusions, function (exclusion) {
            fluid.model.applyChangeRequest(source, {segs: exclusion, type: "DELETE"});
        });

        var record = {options: {}};
        fluid.model.applyChangeRequest(record, {segs: targetSegs, type: "ADD", value: source});
        fluid.checkComponentRecord(record);
        fluid.popActivity();
        return $.extend(record, {contextThat: contextThat, recordType: sourceType});
    };

    // Part of the early "distributeOptions" workflow. Given the description of the blocks to be distributed, assembles "canned" records
    // suitable to be either registered into the shadow record for later or directly pushed to an existing component, as well as honouring
    // any "removeSource" annotations by removing these options from the source block.
    fluid.filterBlocks = function (contextThat, sourceBlocks, sourceSegs, targetSegs, exclusions, removeSource) {
        var togo = [];
        fluid.each(sourceBlocks, function (block) {
            var source = fluid.get(block.source, sourceSegs);
            if (source) {
                togo.push(fluid.makeDistributionRecord(contextThat, block.source, sourceSegs, targetSegs, exclusions, block.recordType));
                var rescued = $.extend({}, source);
                if (removeSource) {
                    fluid.model.applyChangeRequest(block.source, {segs: sourceSegs, type: "DELETE"});
                }
                fluid.each(exclusions, function (exclusion) {
                    var orig = fluid.get(rescued, exclusion);
                    fluid.set(block.source, sourceSegs.concat(exclusion), orig);
                });
            }
        });
        return togo;
    };

    // Use this peculiar signature since the actual component and shadow itself may not exist yet. Perhaps clean up with FLUID-4925
    fluid.noteCollectedDistribution = function (parentShadow, memberName, distribution) {
        fluid.model.setSimple(parentShadow, ["collectedDistributions", memberName, distribution.id], true);
    };

    fluid.isCollectedDistribution = function (parentShadow, memberName, distribution) {
        return fluid.model.getSimple(parentShadow, ["collectedDistributions", memberName, distribution.id]);
    };

    fluid.clearCollectedDistributions = function (parentShadow, memberName) {
        fluid.model.applyChangeRequest(parentShadow, {segs: ["collectedDistributions", memberName], type: "DELETE"});
    };

    fluid.collectDistributions = function (distributedBlocks, parentShadow, distribution, thatStack, contextHashes, memberNames, i) {
        var lastMember = memberNames[memberNames.length - 1];
        if (!fluid.isCollectedDistribution(parentShadow, lastMember, distribution) &&
                fluid.matchIoCSelector(distribution.selector, thatStack, contextHashes, memberNames, i)) {
            distributedBlocks.push.apply(distributedBlocks, distribution.blocks);
            fluid.noteCollectedDistribution(parentShadow, lastMember, distribution);
        }
    };

    // Slightly silly function to clean up the "appliedDistributions" records. In general we need to be much more aggressive both
    // about clearing instantiation garbage (e.g. onCreate and most of the shadow)
    // as well as caching frequently-used records such as the "thatStack" which
    // would mean this function could be written in a sensible way
    fluid.registerCollectedClearer = function (shadow, parentShadow, memberName) {
        if (!shadow.collectedClearer && parentShadow) {
            shadow.collectedClearer = function () {
                fluid.clearCollectedDistributions(parentShadow, memberName);
            };
        }
    };

    fluid.receiveDistributions = function (parentThat, gradeNames, memberName, that) {
        var instantiator = fluid.getInstantiator(parentThat || that);
        var thatStack = instantiator.getThatStack(parentThat || that); // most specific is at end
        thatStack.unshift(fluid.rootComponent);
        var memberNames = fluid.getMemberNames(instantiator, thatStack);
        var shadows = fluid.transform(thatStack, function (thisThat) {
            return instantiator.idToShadow[thisThat.id];
        });
        var parentShadow = shadows[shadows.length - (parentThat ? 1 : 2)];
        var contextHashes = fluid.getMembers(shadows, "contextHash");
        if (parentThat) { // if called before construction of component from assembleCreatorArguments - NB this path will be abolished/amalgamated
            memberNames.push(memberName);
            contextHashes.push(fluid.gradeNamesToHash(gradeNames));
            thatStack.push(that);
        } else {
            fluid.registerCollectedClearer(shadows[shadows.length - 1], parentShadow, memberNames[memberNames.length - 1]);
        }
        var distributedBlocks = [];
        for (var i = 0; i < thatStack.length - 1; ++i) {
            fluid.each(shadows[i].distributions, function (distribution) { // eslint-disable-line no-loop-func
                fluid.collectDistributions(distributedBlocks, parentShadow, distribution, thatStack, contextHashes, memberNames, i);
            });
        }
        return distributedBlocks;
    };

    fluid.computeTreeDistance = function (path1, path2) {
        var i = 0;
        while (i < path1.length && i < path2.length && path1[i] === path2[i]) {
            ++i;
        }
        return path1.length + path2.length - 2*i; // eslint-disable-line space-infix-ops
    };

    // Called from applyDistributions (immediate application route) as well as mergeRecordsToList (pre-instantiation route) AS WELL AS assembleCreatorArguments (pre-pre-instantiation route)
    fluid.computeDistributionPriority = function (targetThat, distributedBlock) {
        if (!distributedBlock.priority) {
            var instantiator = fluid.getInstantiator(targetThat);
            var targetStack = instantiator.getThatStack(targetThat);
            var targetPath = fluid.getMemberNames(instantiator, targetStack);
            var sourceStack = instantiator.getThatStack(distributedBlock.contextThat);
            var sourcePath = fluid.getMemberNames(instantiator, sourceStack);
            var distance = fluid.computeTreeDistance(targetPath, sourcePath);
            distributedBlock.priority = fluid.mergeRecordTypes.distribution - distance;
        }
        return distributedBlock;
    };

    // convert "preBlocks" as produced from fluid.filterBlocks into "real blocks" suitable to be used by the expansion machinery.
    fluid.applyDistributions = function (that, preBlocks, targetShadow) {
        var distributedBlocks = fluid.transform(preBlocks, function (preBlock) {
            return fluid.generateExpandBlock(preBlock, that, targetShadow.mergePolicy);
        }, function (distributedBlock) {
            return fluid.computeDistributionPriority(that, distributedBlock);
        });
        var mergeOptions = targetShadow.mergeOptions;
        mergeOptions.mergeBlocks.push.apply(mergeOptions.mergeBlocks, distributedBlocks);
        mergeOptions.updateBlocks();
        return distributedBlocks;
    };

    // TODO: This implementation is obviously poor and has numerous flaws - in particular it does no backtracking as well as matching backwards through the selector
    fluid.matchIoCSelector = function (selector, thatStack, contextHashes, memberNames, i) {
        var thatpos = thatStack.length - 1;
        var selpos = selector.length - 1;
        while (true) {
            var mustMatchHere = thatpos === thatStack.length - 1 || selector[selpos].child;

            var that = thatStack[thatpos];
            var selel = selector[selpos];
            var match = true;
            for (var j = 0; j < selel.predList.length; ++j) {
                var pred = selel.predList[j];
                if (pred.context && !(contextHashes[thatpos][pred.context] || memberNames[thatpos] === pred.context)) {
                    match = false;
                    break;
                }
                if (pred.id && that.id !== pred.id) {
                    match = false;
                    break;
                }
            }
            if (selpos === 0 && thatpos > i && mustMatchHere) {
                match = false; // child selector must exhaust stack completely - FLUID-5029
            }
            if (match) {
                if (selpos === 0) {
                    return true;
                }
                --thatpos;
                --selpos;
            }
            else {
                if (mustMatchHere) {
                    return false;
                }
                else {
                    --thatpos;
                }
            }
            if (thatpos < i) {
                return false;
            }
        }
    };

    /** Query for all components matching a selector in a particular tree
     * @param root {Component} The root component at which to start the search
     * @param selector {String} An IoCSS selector, in form of a string. Note that since selectors supplied to this function implicitly
     * match downwards, they need not contain the "head context" followed by whitespace required in the distributeOptions form. E.g.
     * simply <code>"fluid.viewComponent"</code> will match all viewComponents below the root.
     * @param flat {Boolean} [Optional] <code>true</code> if the search should just be performed at top level of the component tree
     * Note that with <code>flat=true</code> this search will scan every component in the tree and may well be very slow.
     */
    // supported, PUBLIC API function
    fluid.queryIoCSelector = function (root, selector, flat) {
        var parsed = fluid.parseSelector(selector, fluid.IoCSSMatcher);
        var togo = [];

        fluid.visitComponentsForMatching(root, {flat: flat}, function (that, thatStack, contextHashes, memberNames, i) {
            if (fluid.matchIoCSelector(parsed, thatStack, contextHashes, memberNames, i)) {
                togo.push(that);
            }
        });
        return togo;
    };

    fluid.isIoCSSSelector = function (context) {
        return context.indexOf(" ") !== -1; // simple-minded check for an IoCSS reference
    };

    fluid.pushDistributions = function (targetHead, selector, target, blocks) {
        var targetShadow = fluid.shadowForComponent(targetHead);
        var id = fluid.allocateGuid();
        var distribution = {
            id: id, // This id is used in clearDistributions
            target: target, // Here for improved debuggability - info is duplicated in "selector"
            selector: selector,
            blocks: blocks
        };
        Object.freeze(distribution);
        Object.freeze(distribution.blocks);
        fluid.pushArray(targetShadow, "distributions", distribution);
        return id;
    };

    fluid.clearDistribution = function (targetHead, id) {
        var targetShadow = fluid.shadowForComponent(targetHead);
        fluid.remove_if(targetShadow.distributions, function (distribution) {
            return distribution.id === id;
        });
    };

    fluid.clearDistributions = function (shadow) {
        fluid.each(shadow.outDistributions, function (outDist) {
            fluid.clearDistribution(outDist.targetComponent, outDist.distributionId);
        });
    };

    // Modifies a parsed selector to extract and remove its head context which will be matched upwards
    fluid.extractSelectorHead = function (parsedSelector) {
        var predList = parsedSelector[0].predList;
        var context = predList[0].context;
        predList.length = 0;
        return context;
    };

    fluid.parseExpectedOptionsPath = function (path, role) {
        var segs = fluid.model.parseEL(path);
        if (segs[0] !== "options") {
            fluid.fail("Error in options distribution path ", path, " - only " + role + " paths beginning with \"options\" are supported");
        }
        return segs.slice(1);
    };

    fluid.replicateProperty = function (source, property, targets) {
        if (source[property] !== undefined) {
            fluid.each(targets, function (target) {
                target[property] = source[property];
            });
        }
    };

    fluid.undistributableOptions = ["gradeNames", "distributeOptions", "argumentMap", "initFunction", "mergePolicy", "progressiveCheckerOptions"]; // automatically added to "exclusions" of every distribution

    fluid.distributeOptions = function (that, optionsStrategy) {
        var thatShadow = fluid.shadowForComponent(that);
        var records = fluid.driveStrategy(that.options, "distributeOptions", optionsStrategy);
        fluid.each(records, function distributeOptionsOne(record) {
            fluid.pushActivity("distributeOptions", "parsing distributeOptions block %record %that ", {that: that, record: record});
            if (typeof(record.target) !== "string") {
                fluid.fail("Error in options distribution record ", record, " a member named \"target\" must be supplied holding an IoC reference");
            }
            if (typeof(record.source) === "string" ^ record.record === undefined) {
                fluid.fail("Error in options distribution record ", record, ": must supply either a member \"source\" holding an IoC reference or a member \"record\" holding a literal record");
            }
            var targetRef = fluid.parseContextReference(record.target);
            var targetComp, selector, context;
            if (fluid.isIoCSSSelector(targetRef.context)) {
                selector = fluid.parseSelector(targetRef.context, fluid.IoCSSMatcher);
                var headContext = fluid.extractSelectorHead(selector);
                if (headContext === "/") {
                    targetComp = fluid.rootComponent;
                } else {
                    context = headContext;
                }
            }
            else {
                context = targetRef.context;
            }
            targetComp = targetComp || fluid.resolveContext(context, that);
            if (!targetComp) {
                fluid.fail("Error in options distribution record ", record, " - could not resolve context {" + context + "} to a root component");
            }
            var targetSegs = fluid.model.parseEL(targetRef.path);
            var preBlocks;
            if (record.record !== undefined) {
                preBlocks = [(fluid.makeDistributionRecord(that, record.record, [], targetSegs, []))];
            }
            else {
                var source = fluid.parseContextReference(record.source);
                if (source.context !== "that") {
                    fluid.fail("Error in options distribution record ", record, " only a context of {that} is supported");
                }
                var sourceSegs = fluid.parseExpectedOptionsPath(source.path, "source");
                var fullExclusions = fluid.makeArray(record.exclusions).concat(sourceSegs.length === 0 ? fluid.undistributableOptions : []);

                var exclusions = fluid.transform(fullExclusions, function (exclusion) {
                    return fluid.model.parseEL(exclusion);
                });

                preBlocks = fluid.filterBlocks(that, thatShadow.mergeOptions.mergeBlocks, sourceSegs, targetSegs, exclusions, record.removeSource);
                thatShadow.mergeOptions.updateBlocks(); // perhaps unnecessary
            }
            fluid.replicateProperty(record, "priority", preBlocks);
            fluid.replicateProperty(record, "namespace", preBlocks);
            // TODO: inline material has to be expanded in its original context!

            if (selector) {
                var distributionId = fluid.pushDistributions(targetComp, selector, record.target, preBlocks);
                thatShadow.outDistributions = thatShadow.outDistributions || [];
                thatShadow.outDistributions.push({
                    targetComponent: targetComp,
                    distributionId: distributionId
                });
            }
            else { // The component exists now, we must rebalance it
                var targetShadow = fluid.shadowForComponent(targetComp);
                fluid.applyDistributions(that, preBlocks, targetShadow);
            }
            fluid.popActivity();
        });
    };

    fluid.gradeNamesToHash = function (gradeNames) {
        var contextHash = {};
        fluid.each(gradeNames, function (gradeName) {
            contextHash[gradeName] = true;
            contextHash[fluid.computeNickName(gradeName)] = true;
        });
        return contextHash;
    };

    fluid.cacheShadowGrades = function (that, shadow) {
        var contextHash = fluid.gradeNamesToHash(that.options.gradeNames);
        if (!contextHash[shadow.memberName]) {
            contextHash[shadow.memberName] = "memberName"; // This is filtered out again in recordComponent - TODO: Ensure that ALL resolution uses the scope chain eventually
        }
        shadow.contextHash = contextHash;
        fluid.each(contextHash, function (troo, context) {
            shadow.ownScope[context] = that;
            if (shadow.parentShadow && shadow.parentShadow.that.type !== "fluid.rootComponent") {
                shadow.parentShadow.childrenScope[context] = that;
            }
        });
    };

    // First sequence point where the mergeOptions strategy is delivered from Fluid.js - here we take care
    // of both receiving and transmitting options distributions
    fluid.deliverOptionsStrategy = function (that, target, mergeOptions) {
        var shadow = fluid.shadowForComponent(that, shadow);
        fluid.cacheShadowGrades(that, shadow);
        shadow.mergeOptions = mergeOptions;
    };

    /** Dynamic grade closure algorithm - the following 4 functions share access to a small record structure "rec" which is
     * constructed at the start of fluid.computeDynamicGrades
     */

    fluid.collectDistributedGrades = function (rec) {
        // Receive distributions first since these may cause arrival of more contextAwareness blocks.
        var distributedBlocks = fluid.receiveDistributions(null, null, null, rec.that);
        if (distributedBlocks.length > 0) {
            var readyBlocks = fluid.applyDistributions(rec.that, distributedBlocks, rec.shadow);
            var gradeNamesList = fluid.transform(fluid.getMembers(readyBlocks, ["source", "gradeNames"]), fluid.makeArray);
            fluid.accumulateDynamicGrades(rec, fluid.flatten(gradeNamesList));
        }
    };

    // Apply a batch of freshly acquired plain dynamic grades to the target component and recompute its options
    fluid.applyDynamicGrades = function (rec) {
        rec.oldGradeNames = fluid.makeArray(rec.gradeNames);
        // Note that this crude algorithm doesn't allow us to determine which grades are "new" and which not // TODO: can no longer interpret comment
        var newDefaults = fluid.copy(fluid.getMergedDefaults(rec.that.typeName, rec.gradeNames));
        rec.gradeNames.length = 0; // acquire derivatives of dynamic grades (FLUID-5054)
        rec.gradeNames.push.apply(rec.gradeNames, newDefaults.gradeNames);

        fluid.each(rec.gradeNames, function (gradeName) {
            if (!fluid.isIoCReference(gradeName)) {
                rec.seenGrades[gradeName] = true;
            }
        });

        var shadow = rec.shadow;
        fluid.cacheShadowGrades(rec.that, shadow);
        // This cheap strategy patches FLUID-5091 for now - some more sophisticated activity will take place
        // at this site when we have a full fix for FLUID-5028
        shadow.mergeOptions.destroyValue(["mergePolicy"]);
        shadow.mergeOptions.destroyValue(["components"]);
        shadow.mergeOptions.destroyValue(["invokers"]);

        rec.defaultsBlock.source = newDefaults;
        shadow.mergeOptions.updateBlocks();
        shadow.mergeOptions.computeMergePolicy(); // TODO: we should really only do this if its content changed - this implies moving all options evaluation over to some (cheap) variety of the ChangeApplier

        fluid.accumulateDynamicGrades(rec, newDefaults.gradeNames);
    };

    // Filter some newly discovered grades into their plain and dynamic queues
    fluid.accumulateDynamicGrades = function (rec, newGradeNames) {
        fluid.each(newGradeNames, function (gradeName) {
            if (!rec.seenGrades[gradeName]) {
                if (fluid.isIoCReference(gradeName)) {
                    rec.rawDynamic.push(gradeName);
                    rec.seenGrades[gradeName] = true;
                } else if (!fluid.contains(rec.oldGradeNames, gradeName)) {
                    rec.plainDynamic.push(gradeName);
                }
            }
        });
    };

    fluid.computeDynamicGrades = function (that, shadow, strategy) {
        delete that.options.gradeNames; // Recompute gradeNames for FLUID-5012 and others
        var gradeNames = fluid.driveStrategy(that.options, "gradeNames", strategy); // Just acquire the reference and force eval of mergeBlocks "target", contents are wrong
        gradeNames.length = 0;
        // TODO: In complex distribution cases, a component might end up with multiple default blocks
        var defaultsBlock = fluid.findMergeBlocks(shadow.mergeOptions.mergeBlocks, "defaults")[0];

        var rec = {
            that: that,
            shadow: shadow,
            defaultsBlock: defaultsBlock,
            gradeNames: gradeNames, // remember that this array is globally shared
            seenGrades: {},
            plainDynamic: [],
            rawDynamic: []
        };
        fluid.each(shadow.mergeOptions.mergeBlocks, function (block) { // acquire parents of earlier blocks before applying later ones
            gradeNames.push.apply(gradeNames, fluid.makeArray(block.target && block.target.gradeNames));
            fluid.applyDynamicGrades(rec);
        });
        fluid.collectDistributedGrades(rec);
        while (true) {
            while (rec.plainDynamic.length > 0) {
                gradeNames.push.apply(gradeNames, rec.plainDynamic);
                rec.plainDynamic.length = 0;
                fluid.applyDynamicGrades(rec);
                fluid.collectDistributedGrades(rec);
            }
            if (rec.rawDynamic.length > 0) {
                var expanded = fluid.expandImmediate(rec.rawDynamic.shift(), that, shadow.localDynamic);
                if (typeof(expanded) === "function") {
                    expanded = expanded();
                }
                if (expanded) {
                    rec.plainDynamic = rec.plainDynamic.concat(expanded);
                }
            } else {
                break;
            }
        }

        if (shadow.collectedClearer) {
            shadow.collectedClearer();
            delete shadow.collectedClearer;
        }
    };

    fluid.computeDynamicComponentKey = function (recordKey, sourceKey) {
        return recordKey + (sourceKey === 0 ? "" : "-" + sourceKey); // TODO: configurable name strategies
    };

    fluid.registerDynamicRecord = function (that, recordKey, sourceKey, record, toCensor) {
        var key = fluid.computeDynamicComponentKey(recordKey, sourceKey);
        var cRecord = fluid.copy(record);
        delete cRecord[toCensor];
        fluid.set(that.options, ["components", key], cRecord);
        return key;
    };

    fluid.computeDynamicComponents = function (that, mergeOptions) {
        var shadow = fluid.shadowForComponent(that);
        var localSub = shadow.subcomponentLocal = {};
        var records = fluid.driveStrategy(that.options, "dynamicComponents", mergeOptions.strategy);
        fluid.each(records, function (record, recordKey) {
            if (!record.sources && !record.createOnEvent) {
                fluid.fail("Cannot process dynamicComponents record ", record, " without a \"sources\" or \"createOnEvent\" entry");
            }
            if (record.sources) {
                var sources = fluid.expandOptions(record.sources, that);
                fluid.each(sources, function (source, sourceKey) {
                    var key = fluid.registerDynamicRecord(that, recordKey, sourceKey, record, "sources");
                    localSub[key] = {"source": source, "sourcePath": sourceKey};
                });
            }
            else if (record.createOnEvent) {
                var event = fluid.event.expandOneEvent(that, record.createOnEvent);
                fluid.set(shadow, ["dynamicComponentCount", recordKey], 0);
                var listener = function () {
                    var key = fluid.registerDynamicRecord(that, recordKey, shadow.dynamicComponentCount[recordKey]++, record, "createOnEvent");
                    var localRecord = {"arguments": fluid.makeArray(arguments)};
                    fluid.initDependent(that, key, localRecord);
                };
                event.addListener(listener);
                fluid.recordListener(event, listener, shadow);
            }
        });
    };

    // Second sequence point for mergeOptions from Fluid.js - here we construct all further
    // strategies required on the IoC side and mount them into the shadow's getConfig for universal use
    fluid.computeComponentAccessor = function (that, localRecord) {
        var instantiator = fluid.globalInstantiator;
        var shadow = fluid.shadowForComponent(that);
        shadow.localDynamic = localRecord; // for signalling to dynamic grades from dynamic components
        var options = that.options;
        var strategy = shadow.mergeOptions.strategy;
        var optionsStrategy = fluid.mountStrategy(["options"], options, strategy);
        shadow.invokerStrategy = fluid.recordStrategy(that, options, strategy, "invokers", fluid.invokerFromRecord);
        shadow.eventStrategyBlock = fluid.recordStrategy(that, options, strategy, "events", fluid.eventFromRecord, ["events"]);
        var eventStrategy = fluid.mountStrategy(["events"], that, shadow.eventStrategyBlock.strategy, ["events"]);
        shadow.memberStrategy = fluid.recordStrategy(that, options, strategy, "members", fluid.memberFromRecord, null, {model: true, modelRelay: true});
        // NB - ginger strategy handles concrete, rationalise
        shadow.getConfig = {strategies: [fluid.model.funcResolverStrategy, fluid.makeGingerStrategy(that),
            optionsStrategy, shadow.invokerStrategy.strategy, shadow.memberStrategy.strategy, eventStrategy]};

        fluid.computeDynamicGrades(that, shadow, strategy, shadow.mergeOptions.mergeBlocks);
        fluid.distributeOptions(that, strategy);
        if (shadow.contextHash["fluid.resolveRoot"]) {
            var memberName;
            if (shadow.contextHash["fluid.resolveRootSingle"]) {
                var singleRootType = fluid.getForComponent(that, ["options", "singleRootType"]);
                if (!singleRootType) {
                    fluid.fail("Cannot register object with grades " + Object.keys(shadow.contextHash).join(", ") + " as fluid.resolveRootSingle since it has not defined option singleRootType");
                }
                memberName = fluid.typeNameToMemberName(singleRootType);
            } else {
                memberName = fluid.computeGlobalMemberName(that);
            }
            var parent = fluid.resolveRootComponent;
            if (parent[memberName]) {
                instantiator.clearComponent(parent, memberName);
            }
            instantiator.recordKnownComponent(parent, that, memberName, false);
        }

        return shadow.getConfig;
    };

    // About the SHADOW:
    // Allocated at: instantiator's "recordComponent"
    // Contents:
    //     path {String} Principal allocated path (point of construction) in tree
    //     that {Component} The component itself
    //     contextHash {String to Boolean} Map of context names which this component matches
    //     mergePolicy, mergeOptions: Machinery for last phase of options merging
    //     invokerStrategy, eventStrategyBlock, memberStrategy, getConfig: Junk required to operate the accessor
    //     listeners: Listeners registered during this component's construction, to be cleared during clearListeners
    //     distributions, collectedClearer: Managing options distributions
    //     outDistributions: A list of distributions registered from this component, signalling from distributeOptions to clearDistributions
    //     subcomponentLocal: Signalling local record from computeDynamicComponents to assembleCreatorArguments
    //     dynamicLocal: Local signalling for dynamic grades
    //     ownScope: A hash of names to components which are in scope from this component - populated in cacheShadowGrades
    //     childrenScope: A hash of names to components which are in scope because they are children of this component (BELOW own ownScope in resolution order)

    fluid.shadowForComponent = function (component) {
        var instantiator = fluid.getInstantiator(component);
        return instantiator && component ? instantiator.idToShadow[component.id] : null;
    };

    // Access the member at a particular path in a component, forcing it to be constructed gingerly if necessary
    // supported, PUBLIC API function
    fluid.getForComponent = function (component, path) {
        var shadow = fluid.shadowForComponent(component);
        var getConfig = shadow ? shadow.getConfig : undefined;
        return fluid.get(component, path, getConfig);
    };

    // An EL segment resolver strategy that will attempt to trigger creation of
    // components that it discovers along the EL path, if they have been defined but not yet
    // constructed.
    fluid.makeGingerStrategy = function (that) {
        var instantiator = fluid.getInstantiator(that);
        return function (component, thisSeg, index, segs) {
            var atval = component[thisSeg];
            if (atval === fluid.inEvaluationMarker && index === segs.length) {
                fluid.fail("Error in component configuration - a circular reference was found during evaluation of path segment \"" + thisSeg +
                    "\": for more details, see the activity records following this message in the console, or issue fluid.setLogging(fluid.logLevel.TRACE) when running your application");
            }
            if (index > 1) {
                return atval;
            }
            if (atval === undefined && component.hasOwnProperty(thisSeg)) { // avoid recomputing properties that have been explicitly evaluated to undefined
                return fluid.NO_VALUE;
            }
            if (atval === undefined) { // pick up components in instantiation here - we can cut this branch by attaching early
                var parentPath = instantiator.idToShadow[component.id].path;
                var childPath = instantiator.composePath(parentPath, thisSeg);
                atval = instantiator.pathToComponent[childPath];
            }
            if (atval === undefined) {
                // TODO: This check is very expensive - once gingerness is stable, we ought to be able to
                // eagerly compute and cache the value of options.components - check is also incorrect and will miss injections
                var subRecord = fluid.getForComponent(component, ["options", "components", thisSeg]);
                if (subRecord) {
                    if (subRecord.createOnEvent) {
                        fluid.fail("Error resolving path segment \"" + thisSeg + "\" of path " + segs.join(".") + " since component with record ", subRecord,
                            " has annotation \"createOnEvent\" - this very likely represents an implementation error. Either alter the reference so it does not " +
                            " match this component, or alter your workflow to ensure that the component is instantiated by the time this reference resolves");
                    }
                    fluid.initDependent(component, thisSeg);
                    atval = component[thisSeg];
                }
            }
            return atval;
        };
    };

    // Listed in dependence order
    fluid.frameworkGrades = ["fluid.component", "fluid.modelComponent", "fluid.viewComponent", "fluid.rendererComponent"];

    fluid.filterBuiltinGrades = function (gradeNames) {
        return fluid.remove_if(fluid.makeArray(gradeNames), function (gradeName) {
            return fluid.frameworkGrades.indexOf(gradeName) !== -1;
        });
    };

    fluid.dumpGradeNames = function (that) {
        return that.options && that.options.gradeNames ?
            " gradeNames: " + JSON.stringify(fluid.filterBuiltinGrades(that.options.gradeNames)) : "";
    };

    fluid.dumpThat = function (that) {
        return "{ typeName: \"" + that.typeName + "\"" + fluid.dumpGradeNames(that) + " id: " + that.id + "}";
    };

    fluid.dumpThatStack = function (thatStack, instantiator) {
        var togo = fluid.transform(thatStack, function (that) {
            var path = instantiator.idToPath(that.id);
            return fluid.dumpThat(that) + (path ? (" - path: " + path) : "");
        });
        return togo.join("\n");
    };

    fluid.resolveContext = function (context, that, fast) {
        if (context === "that") {
            return that;
        }
        var foundComponent;
        var instantiator = fluid.globalInstantiator; // fluid.getInstantiator(that); // this hash lookup takes over 1us!
        if (fast) {
            var shadow = instantiator.idToShadow[that.id];
            return shadow.ownScope[context];
        } else {
            var thatStack = instantiator.getFullStack(that);
            fluid.visitComponentsForVisibility(instantiator, thatStack, function (component, name) {
                var shadow = fluid.shadowForComponent(component);
                // TODO: Some components, e.g. the static environment and typeTags do not have a shadow, which slows us down here
                if (context === name || shadow && shadow.contextHash && shadow.contextHash[context] || context === component.typeName) {
                    foundComponent = component;
                    return true; // YOUR VISIT IS AT AN END!!
                }
                if (fluid.getForComponent(component, ["options", "components", context]) && !component[context]) {
      // This is an expensive guess since we make it for every component up the stack - must apply the WAVE OF EXPLOSIONS (FLUID-4925) to discover all components first
      // This line attempts a hopeful construction of components that could be guessed by nickname through finding them unconstructed
      // in options. In the near future we should eagerly BEGIN the process of constructing components, discovering their
      // types and then attaching them to the tree VERY EARLY so that we get consistent results from different strategies.
                    foundComponent = fluid.getForComponent(component, context);
                    return true;
                }
            });
            return foundComponent;
        }
    };

    fluid.triggerMismatchedPathError = function (parsed, parentThat) {
        var ref = fluid.renderContextReference(parsed);
        fluid.fail("Failed to resolve reference " + ref + " - could not match context with name " +
            parsed.context + " from component " + fluid.dumpThat(parentThat) + " at path " + fluid.pathForComponent(parentThat).join(".") + " component: " , parentThat);
    };

    fluid.makeStackFetcher = function (parentThat, localRecord, fast) {
        var fetcher = function (parsed) {
            if (parentThat && parentThat.lifecycleStatus === "destroyed") {
                fluid.fail("Cannot resolve reference " + fluid.renderContextReference(parsed) + " from component " + fluid.dumpThat(parentThat) + " which has been destroyed");
            }
            var context = parsed.context;
            if (localRecord && context in localRecord) {
                return fluid.get(localRecord[context], parsed.path);
            }
            var foundComponent = fluid.resolveContext(context, parentThat, fast);
            if (!foundComponent && parsed.path !== "") {
                fluid.triggerMismatchedPathError(parsed, parentThat);
            }
            return fluid.getForComponent(foundComponent, parsed.path);
        };
        return fetcher;
    };

    fluid.makeStackResolverOptions = function (parentThat, localRecord, fast) {
        return $.extend(fluid.copy(fluid.rawDefaults("fluid.makeExpandOptions")), {
            localRecord: localRecord || {},
            fetcher: fluid.makeStackFetcher(parentThat, localRecord, fast),
            contextThat: parentThat,
            exceptions: {members: {model: true, modelRelay: true}}
        });
    };

    fluid.clearListeners = function (shadow) {
        // TODO: bug here - "afterDestroy" listeners will be unregistered already unless they come from this component
        fluid.each(shadow.listeners, function (rec) {
            rec.event.removeListener(rec.listenerId || rec.listener);
        });
        delete shadow.listeners;
    };

    fluid.recordListener = function (event, listener, shadow, listenerId) {
        if (event.ownerId !== shadow.that.id) { // don't bother recording listeners registered from this component itself
            fluid.pushArray(shadow, "listeners", {event: event, listener: listener, listenerId: listenerId});
        }
    };

    fluid.constructScopeObjects = function (instantiator, parent, child, childShadow) {
        var parentShadow = parent ? instantiator.idToShadow[parent.id] : null;
        childShadow.childrenScope = parentShadow ? Object.create(parentShadow.ownScope) : {};
        childShadow.ownScope = Object.create(childShadow.childrenScope);
        childShadow.parentShadow = parentShadow;
    };

    fluid.clearChildrenScope = function (instantiator, parentShadow, child, childShadow) {
        fluid.each(childShadow.contextHash, function (troo, context) {
            if (parentShadow.childrenScope[context] === child) {
                delete parentShadow.childrenScope[context]; // TODO: ambiguous resolution
            }
        });
    };

    // unsupported, non-API function - however, this structure is of considerable interest to those debugging
    // into IoC issues. The structures idToShadow and pathToComponent contain a complete map of the component tree
    // forming the surrounding scope
    fluid.instantiator = function () {
        var that = fluid.typeTag("instantiator");
        $.extend(that, {
            lifecycleStatus: "constructed",
            pathToComponent: {},
            idToShadow: {},
            modelTransactions: {init: {}}, // a map of transaction id to map of component id to records of components enlisted in a current model initialisation transaction
            composePath: fluid.model.composePath, // For speed, we declare that no component's name may contain a period
            composeSegments: fluid.model.composeSegments,
            parseEL: fluid.model.parseEL,
            events: {
                onComponentAttach: fluid.makeEventFirer({name: "instantiator's onComponentAttach event"}),
                onComponentClear: fluid.makeEventFirer({name: "instantiator's onComponentClear event"})
            }
        });
        // TODO: this API can shortly be removed
        that.idToPath = function (id) {
            var shadow = that.idToShadow[id];
            return shadow ? shadow.path : "";
        };
        // Note - the returned stack is assumed writeable and does not include the root
        that.getThatStack = function (component) {
            var shadow = that.idToShadow[component.id];
            if (shadow) {
                var path = shadow.path;
                var parsed = that.parseEL(path);
                var root = that.pathToComponent[""], togo = [];
                for (var i = 0; i < parsed.length; ++i) {
                    root = root[parsed[i]];
                    togo.push(root);
                }
                return togo;
            }
            else { return [];}
        };
        that.getFullStack = function (component) {
            var thatStack = component ? that.getThatStack(component) : [];
            thatStack.unshift(fluid.resolveRootComponent);
            return thatStack;
        };
        function recordComponent(parent, component, path, name, created) {
            var shadow;
            if (created) {
                shadow = that.idToShadow[component.id] = {};
                shadow.that = component;
                shadow.path = path;
                shadow.memberName = name;
                fluid.constructScopeObjects(that, parent, component, shadow);
            } else {
                shadow = that.idToShadow[component.id];
                shadow.injectedPaths = shadow.injectedPaths || {}; // a hash since we will modify whilst iterating
                shadow.injectedPaths[path] = true;
                var parentShadow = that.idToShadow[parent.id]; // structural parent shadow - e.g. resolveRootComponent
                var keys = fluid.keys(shadow.contextHash);
                fluid.remove_if(keys, function (key) {
                    return shadow.contextHash && shadow.contextHash[key] === "memberName";
                });
                keys.push(name); // add local name - FLUID-5696 and FLUID-5820
                fluid.each(keys, function (context) {
                    if (!parentShadow.childrenScope[context]) {
                        parentShadow.childrenScope[context] = component;
                    }
                });
            }
            if (that.pathToComponent[path]) {
                fluid.fail("Error during instantiation - path " + path + " which has just created component " + fluid.dumpThat(component) +
                    " has already been used for component " + fluid.dumpThat(that.pathToComponent[path]) + " - this is a circular instantiation or other oversight." +
                    " Please clear the component using instantiator.clearComponent() before reusing the path.");
            }
            that.pathToComponent[path] = component;
        }
        that.recordRoot = function (component) {
            recordComponent(null, component, "", "", true);
        };
        that.recordKnownComponent = function (parent, component, name, created) {
            parent[name] = component;
            if (fluid.isComponent(component) || component.type === "instantiator") {
                var parentPath = that.idToShadow[parent.id].path;
                var path = that.composePath(parentPath, name);
                recordComponent(parent, component, path, name, created);
                that.events.onComponentAttach.fire(component, path, that, created);
            } else {
                fluid.fail("Cannot record non-component with value ", component, " at path \"" + name + "\" of parent ", parent);
            }
        };
        that.clearComponent = function (component, name, child, options, noModTree, path) {
            // options are visitor options for recursive driving
            var shadow = that.idToShadow[component.id];
            // use flat recursion since we want to use our own recursion rather than rely on "visited" records
            options = options || {flat: true, instantiator: that};
            child = child || component[name];
            path = path || shadow.path;
            if (path === undefined) {
                fluid.fail("Cannot clear component " + name + " from component ", component,
                    " which was not created by this instantiator");
            }

            var childPath = that.composePath(path, name);
            var childShadow = that.idToShadow[child.id];
            if (!childShadow) { // Explicit FLUID-5812 check - this can be eliminated once we move visitComponentChildren to instantiator's records
                return;
            }
            var created = childShadow.path === childPath;
            that.events.onComponentClear.fire(child, childPath, component, created);

            // only recurse on components which were created in place - if the id record disagrees with the
            // recurse path, it must have been injected
            if (created) {
                // Clear injected instance of this component from all other paths - historically we didn't bother
                // to do this since injecting into a shorter scope is an error - but now we have resolveRoot area
                fluid.each(childShadow.injectedPaths, function (troo, injectedPath) {
                    var parentPath = fluid.model.getToTailPath(injectedPath);
                    var otherParent = that.pathToComponent[parentPath];
                    that.clearComponent(otherParent, fluid.model.getTailPath(injectedPath), child);
                });
                fluid.visitComponentChildren(child, function (gchild, gchildname, segs, i) {
                    var parentPath = that.composeSegments.apply(null, segs.slice(0, i));
                    that.clearComponent(child, gchildname, null, options, true, parentPath);
                }, options, that.parseEL(childPath));
                fluid.doDestroy(child, name, component);
                fluid.clearDistributions(childShadow);
                fluid.clearListeners(childShadow);
                fluid.fireEvent(child, "afterDestroy", [child, name, component]);
                delete that.idToShadow[child.id];
            } else {
                fluid.remove_if(childShadow.injectedPaths, function (troo, path) {
                    return path === childPath;
                });
            }
            fluid.clearChildrenScope(that, shadow, child, childShadow);
            delete that.pathToComponent[childPath];
            if (!noModTree) {
                delete component[name]; // there may be no entry - if creation is not concluded
            }
        };
        return that;
    };

    // The global instantiator, holding all components instantiated in this context (instance of Infusion)
    fluid.globalInstantiator = fluid.instantiator();

    // Look up the globally registered instantiator for a particular component - we now only really support a
    // single, global instantiator, but this method is left as a notation point in case this ever reverts
    // Returns null if argument is a noncomponent or has no shadow
    fluid.getInstantiator = function (component) {
        var instantiator = fluid.globalInstantiator;
        return component && instantiator.idToShadow[component.id] ? instantiator : null;
    };

    // The grade supplied to components which will be resolvable from all parts of the component tree
    fluid.defaults("fluid.resolveRoot");
    // In addition to being resolvable at the root, "resolveRootSingle" component will have just a single instance available. Fresh
    // instances will displace older ones.
    fluid.defaults("fluid.resolveRootSingle", {
        gradeNames: "fluid.resolveRoot"
    });

    fluid.constructRootComponents = function (instantiator) {
        // Instantiate the primordial components at the root of each context tree
        fluid.rootComponent = instantiator.rootComponent = fluid.typeTag("fluid.rootComponent");
        instantiator.recordRoot(fluid.rootComponent);

        // The component which for convenience holds injected instances of all components with fluid.resolveRoot grade
        fluid.resolveRootComponent = instantiator.resolveRootComponent = fluid.typeTag("fluid.resolveRootComponent");
        instantiator.recordKnownComponent(fluid.rootComponent, fluid.resolveRootComponent, "resolveRootComponent", true);

        // obliterate resolveRoot's scope objects and replace by the real root scope - which is unused by its own children
        var rootShadow = instantiator.idToShadow[fluid.rootComponent.id];
        var resolveRootShadow = instantiator.idToShadow[fluid.resolveRootComponent.id];
        resolveRootShadow.ownScope = rootShadow.ownScope;
        resolveRootShadow.childrenScope = rootShadow.childrenScope;

        instantiator.recordKnownComponent(fluid.resolveRootComponent, instantiator, "instantiator", true); // needs to have a shadow so it can be injected
        resolveRootShadow.childrenScope.instantiator = instantiator; // needs to be mounted since it never passes through cacheShadowGrades
    };

    fluid.constructRootComponents(fluid.globalInstantiator); // currently a singleton - in future, alternative instantiators might come back

    /** Expand a set of component options either immediately, or with deferred effect.
     *  The current policy is to expand immediately function arguments within fluid.assembleCreatorArguments which are not the main options of a
     *  component. The component's own options take <code>{defer: true}</code> as part of
     *  <code>outerExpandOptions</code> which produces an "expandOptions" structure holding the "strategy" and "initter" pattern
     *  common to ginger participants.
     *  Probably not to be advertised as part of a public API, but is considerably more stable than most of the rest
     *  of the IoC API structure especially with respect to the first arguments.
     */

// TODO: Can we move outerExpandOptions to 2nd place? only user of 3 and 4 is fluid.makeExpandBlock
    fluid.expandOptions = function (args, that, mergePolicy, localRecord, outerExpandOptions) {
        if (!args) {
            return args;
        }
        fluid.pushActivity("expandOptions", "expanding options %args for component %that ", {that: that, args: args});
        var expandOptions = fluid.makeStackResolverOptions(that, localRecord);
        expandOptions.mergePolicy = mergePolicy;
        var expanded = outerExpandOptions && outerExpandOptions.defer ?
            fluid.makeExpandOptions(args, expandOptions) : fluid.expand(args, expandOptions);
        fluid.popActivity();
        return expanded;
    };

    fluid.localRecordExpected = fluid.arrayToHash(["type", "options", "container", "createOnEvent", "priority", "recordType"]); // last element unavoidably polluting

    fluid.checkComponentRecord = function (localRecord) {
        fluid.each(localRecord, function (value, key) {
            if (!fluid.localRecordExpected[key]) {
                fluid.fail("Probable error in subcomponent record ", localRecord, " - key \"" + key +
                    "\" found, where the only legal options are " +
                    fluid.keys(fluid.localRecordExpected).join(", "));
            }
        });
    };

    fluid.mergeRecordsToList = function (that, mergeRecords) {
        var list = [];
        fluid.each(mergeRecords, function (value, key) {
            value.recordType = key;
            if (key === "distributions") {
                list.push.apply(list, fluid.transform(value, function (distributedBlock) {
                    return fluid.computeDistributionPriority(that, distributedBlock);
                }));
            }
            else {
                if (!value.options) { return; }
                value.priority = fluid.mergeRecordTypes[key];
                if (value.priority === undefined) {
                    fluid.fail("Merge record with unrecognised type " + key + ": ", value);
                }
                list.push(value);
            }
        });
        return list;
    };

    // TODO: overall efficiency could huge be improved by resorting to the hated PROTOTYPALISM as an optimisation
    // for this mergePolicy which occurs in every component. Although it is a deep structure, the root keys are all we need
    var addPolicyBuiltins = function (policy) {
        fluid.each(["gradeNames", "mergePolicy", "argumentMap", "components", "dynamicComponents", "events", "listeners", "modelListeners", "modelRelay", "distributeOptions", "transformOptions"], function (key) {
            fluid.set(policy, [key, "*", "noexpand"], true);
        });
        return policy;
    };

    // used from Fluid.js
    fluid.generateExpandBlock = function (record, that, mergePolicy, localRecord) {
        var expanded = fluid.expandOptions(record.options, record.contextThat || that, mergePolicy, localRecord, {defer: true});
        expanded.priority = record.priority;
        expanded.namespace = record.namespace;
        expanded.recordType = record.recordType;
        return expanded;
    };

    var expandComponentOptionsImpl = function (mergePolicy, defaults, initRecord, that) {
        var defaultCopy = fluid.copy(defaults);
        addPolicyBuiltins(mergePolicy);
        var shadow = fluid.shadowForComponent(that);
        shadow.mergePolicy = mergePolicy;
        var mergeRecords = {
            defaults: {options: defaultCopy}
        };

        $.extend(mergeRecords, initRecord.mergeRecords);
        // Do this here for gradeless components that were corrected by "localOptions"
        if (mergeRecords.subcomponentRecord) {
            fluid.checkComponentRecord(mergeRecords.subcomponentRecord);
        }

        var expandList = fluid.mergeRecordsToList(that, mergeRecords);

        var togo = fluid.transform(expandList, function (value) {
            return fluid.generateExpandBlock(value, that, mergePolicy, initRecord.localRecord);
        });
        return togo;
    };

    fluid.fabricateDestroyMethod = function (that, name, instantiator, child) {
        return function () {
            instantiator.clearComponent(that, name, child);
        };
    };

    // Computes a name for a component appearing at the global root which is globally unique, from its nickName and id
    fluid.computeGlobalMemberName = function (that) {
        var nickName = fluid.computeNickName(that.typeName);
        return nickName + "-" + that.id;
    };

    // Maps a type name to the member name to be used for it at a particular path level where it is intended to be unique
    // Note that "." is still not supported within a member name
    // supported, PUBLIC API function
    fluid.typeNameToMemberName = function (typeName) {
        return typeName.replace(/\./g, "_");
    };

    // This is the initial entry point from the non-IoC side reporting the first presence of a new component - called from fluid.mergeComponentOptions
    fluid.expandComponentOptions = function (mergePolicy, defaults, userOptions, that) {
        var initRecord = userOptions; // might have been tunnelled through "userOptions" from "assembleCreatorArguments"
        var instantiator = userOptions && userOptions.marker === fluid.EXPAND ? userOptions.instantiator : null;
        fluid.pushActivity("expandComponentOptions", "expanding component options %options with record %record for component %that",
            {options: instantiator ? userOptions.mergeRecords.user : userOptions, record: initRecord, that: that});
        if (!instantiator) { // it is a top-level component which needs to be attached to the global root
            instantiator = fluid.globalInstantiator;
            initRecord = { // upgrade "userOptions" to the same format produced by fluid.assembleCreatorArguments via the subcomponent route
                mergeRecords: {user: {options: fluid.expandCompact(userOptions, true)}},
                memberName: fluid.computeGlobalMemberName(that),
                instantiator: instantiator,
                parentThat: fluid.rootComponent
            };
        }
        that.destroy = fluid.fabricateDestroyMethod(initRecord.parentThat, initRecord.memberName, instantiator, that);

        instantiator.recordKnownComponent(initRecord.parentThat, that, initRecord.memberName, true);
        var togo = expandComponentOptionsImpl(mergePolicy, defaults, initRecord, that);

        fluid.popActivity();
        return togo;
    };

    /** Given a typeName, determine the final concrete
     * "invocation specification" consisting of a concrete global function name
     * and argument list which is suitable to be executed directly by fluid.invokeGlobalFunction.
     */
    // options is just a disposition record containing memberName, componentRecord
    fluid.assembleCreatorArguments = function (parentThat, typeName, options) {
        var upDefaults = fluid.defaults(typeName); // we're not responsive to dynamic changes in argMap, but we don't believe in these anyway
        if (!upDefaults || !upDefaults.argumentMap) {
            fluid.fail("Error in assembleCreatorArguments: cannot look up component type name " + typeName + " to a component creator grade with an argumentMap");
        }

        var fakeThat = {}; // fake "that" for receiveDistributions since we try to match selectors before creation for FLUID-5013
        var distributions = parentThat ? fluid.receiveDistributions(parentThat, upDefaults.gradeNames, options.memberName, fakeThat) : [];
        fluid.each(distributions, function (distribution) { // TODO: The duplicated route for this is in fluid.mergeComponentOptions
            fluid.computeDistributionPriority(parentThat, distribution);
            if (fluid.isPrimitive(distribution.priority)) { // TODO: These should be immutable and parsed just once on registration - but we can't because of crazy target-dependent distance system
                distribution.priority = fluid.parsePriority(distribution.priority, 0, false, "options distribution");
            }
        });
        fluid.sortByPriority(distributions);

        var localDynamic = options.localDynamic;
        var localRecord = $.extend({}, fluid.censorKeys(options.componentRecord, ["type"]), localDynamic);

        var argMap = upDefaults.argumentMap;
        var findKeys = Object.keys(argMap).concat(["type"]);

        fluid.each(findKeys, function (name) {
            for (var i = 0; i < distributions.length; ++i) { // Apply non-options material from distributions (FLUID-5013)
                if (distributions[i][name] !== undefined) {
                    localRecord[name] = distributions[i][name];
                }
            }
        });
        typeName = localRecord.type || typeName;

        delete localRecord.type;
        delete localRecord.options;

        var mergeRecords = {distributions: distributions};

        if (options.componentRecord !== undefined) {
            // Deliberately put too many things here so they can be checked in expandComponentOptions (FLUID-4285)
            mergeRecords.subcomponentRecord = $.extend({}, options.componentRecord);
        }
        var args = [];
        fluid.each(argMap, function (index, name) {
            var arg;
            if (name === "options") {
                arg = {marker: fluid.EXPAND,
                           localRecord: localDynamic,
                           mergeRecords: mergeRecords,
                           instantiator: fluid.getInstantiator(parentThat),
                           parentThat: parentThat,
                           memberName: options.memberName};
            } else {
                var value = localRecord[name];
                arg = fluid.expandImmediate(value, parentThat, localRecord);
            }
            args[index] = arg;
        });

        var togo = {
            args: args,
            funcName: typeName
        };
        return togo;
    };

    /** Instantiate the subcomponent with the supplied name of the supplied top-level component. Although this method
     * is published as part of the Fluid API, it should not be called by general users and may not remain stable. It is
     * currently the only mechanism provided for instantiating components whose definitions are dynamic, and will be
     * replaced in time by dedicated declarative framework described by FLUID-5022.
     * @param that {Component} the parent component for which the subcomponent is to be instantiated
     * @param name {String} the name of the component - the index of the options block which configures it as part of the
     * <code>components</code> section of its parent's options
     */
    fluid.initDependent = function (that, name, localRecord) {
        if (that[name]) { return; } // TODO: move this into strategy
        var component = that.options.components[name];
        var instance;
        var instantiator = fluid.globalInstantiator;
        var shadow = instantiator.idToShadow[that.id];
        var localDynamic = localRecord || shadow.subcomponentLocal && shadow.subcomponentLocal[name];
        fluid.pushActivity("initDependent", "instantiating dependent component at path \"%path\" with record %record as child of %parent",
            {path: shadow.path + "." + name, record: component, parent: that});

        if (typeof(component) === "string") {
            that[name] = fluid.inEvaluationMarker;
            instance = fluid.expandImmediate(component, that);
            if (instance) {
                instantiator.recordKnownComponent(that, instance, name, false);
            } else {
                delete that[name];
            }
        }
        else if (component.type) {
            var type = fluid.expandImmediate(component.type, that, localDynamic);
            if (!type) {
                fluid.fail("Error in subcomponent record: ", component.type, " could not be resolved to a type for component ", name,
                    " of parent ", that);
            }
            var invokeSpec = fluid.assembleCreatorArguments(that, type, {componentRecord: component, memberName: name, localDynamic: localDynamic});
            instance = fluid.initSubcomponentImpl(that, {type: invokeSpec.funcName}, invokeSpec.args);
        }
        else {
            fluid.fail("Unrecognised material in place of subcomponent " + name + " - no \"type\" field found");
        }
        fluid.popActivity();
        return instance;
    };

    fluid.bindDeferredComponent = function (that, componentName, component) {
        var events = fluid.makeArray(component.createOnEvent);
        fluid.each(events, function (eventName) {
            var event = fluid.isIoCReference(eventName) ? fluid.expandOptions(eventName, that) : that.events[eventName];
            if (!event || !event.addListener) {
                fluid.fail("Error instantiating createOnEvent component with name " + componentName + " of parent ", that, " since event specification " +
                    eventName + " could not be expanded to an event - got ", event);
            }
            event.addListener(function () {
                fluid.pushActivity("initDeferred", "instantiating deferred component %componentName of parent %that due to event %eventName",
                 {componentName: componentName, that: that, eventName: eventName});
                if (that[componentName]) {
                    fluid.globalInstantiator.clearComponent(that, componentName);
                }
                fluid.initDependent(that, componentName);
                fluid.popActivity();
            }, null, component.priority);
        });
    };

    fluid.priorityForComponent = function (component) {
        return component.priority ? component.priority :
            (component.type === "fluid.typeFount" || fluid.hasGrade(fluid.defaults(component.type), "fluid.typeFount")) ?
            "first" : undefined;
    };

    fluid.initDependents = function (that) {
        fluid.pushActivity("initDependents", "instantiating dependent components for component %that", {that: that});
        var shadow = fluid.shadowForComponent(that);
        shadow.memberStrategy.initter();
        shadow.invokerStrategy.initter();

        fluid.getForComponent(that, "modelRelay");
        fluid.getForComponent(that, "model"); // trigger this as late as possible - but must be before components so that child component has model on its onCreate
        if (fluid.isDestroyed(that)) {
            return; // Further fix for FLUID-5869 - if we managed to destroy ourselves through some bizarre model self-reaction, bail out here
        }

        var options = that.options;
        var components = options.components || {};
        var componentSort = [];

        fluid.each(components, function (component, name) {
            if (!component.createOnEvent) {
                var priority = fluid.priorityForComponent(component);
                componentSort.push({namespace: name, priority: fluid.parsePriority(priority)});
            }
            else {
                fluid.bindDeferredComponent(that, name, component);
            }
        });
        fluid.sortByPriority(componentSort);
        fluid.each(componentSort, function (entry) {
            fluid.initDependent(that, entry.namespace);
        });
        if (shadow.subcomponentLocal) {
            fluid.clear(shadow.subcomponentLocal); // still need repo for event-driven dynamic components - abolish these in time
        }
        that.lifecycleStatus = "constructed";
        fluid.assessTreeConstruction(that, shadow);

        fluid.popActivity();
    };

    fluid.assessTreeConstruction = function (that, shadow) {
        var instantiator = fluid.globalInstantiator;
        var thatStack = instantiator.getThatStack(that);
        var unstableUp = fluid.find_if(thatStack, function (that) {
            return that.lifecycleStatus === "constructing";
        });
        if (unstableUp) {
            that.lifecycleStatus = "constructed";
        } else {
            fluid.markSubtree(instantiator, that, shadow.path, "treeConstructed");
        }
    };

    fluid.markSubtree = function (instantiator, that, path, state) {
        that.lifecycleStatus = state;
        fluid.visitComponentChildren(that, function (child, name) {
            var childPath = instantiator.composePath(path, name);
            var childShadow = instantiator.idToShadow[child.id];
            var created = childShadow && childShadow.path === childPath;
            if (created) {
                fluid.markSubtree(instantiator, child, childPath, state);
            }
        }, {flat: true});
    };


    /** BEGIN NEXUS METHODS **/

    fluid.pathForComponent = function (component, instantiator) {
        instantiator = instantiator || fluid.getInstantiator(component);
        var shadow = instantiator.idToShadow[component.id];
        if (!shadow) {
            fluid.fail("Cannot get path for ", component, " which is not a component");
        }
        return instantiator.parseEL(shadow.path);
    };

    /** Construct a component with the supplied options at the specified path in the component tree. The parent path of the location must already be a component.
     * @param path {String|Array of String} Path where the new component is to be constructed, represented as a string or array of segments
     * @param options {Object} Top-level options supplied to the component - must at the very least include a field <code>type</code> holding the component's type
     * @param instantiator {Instantiator} [optional] The instantiator holding the component to be created - if blank, the global instantiator will be used
     */
    fluid.construct = function (path, options, instantiator) {
        var record = fluid.destroy(path, instantiator);
        // TODO: We must construct a more principled scheme for designating child components than this - especially once options become immutable
        fluid.set(record.parent, ["options", "components", record.memberName], {
            type: options.type,
            options: options
        });
        return fluid.initDependent(record.parent, record.memberName);
    };

    /** Destroys a component held at the specified path. The parent path must represent a component, although the component itself may be nonexistent
     * @param path {String|Array of String} Path where the new component is to be destroyed, represented as a string or array of segments
     * @param instantiator {Instantiator} [optional] The instantiator holding the component to be destroyed - if blank, the global instantiator will be used
     */
    fluid.destroy = function (path, instantiator) {
        instantiator = instantiator || fluid.globalInstantiator;
        var segs = fluid.model.parseToSegments(path, instantiator.parseEL, true);
        if (segs.length === 0) {
            fluid.fail("Cannot destroy the root component");
        }
        var memberName = segs.pop(), parentPath = instantiator.composeSegments.apply(null, segs);
        var parent = instantiator.pathToComponent[parentPath];
        if (!parent) {
            fluid.fail("Cannot modify component with nonexistent parent at path ", path);
        }
        if (parent[memberName]) {
            parent[memberName].destroy();
        }
        return {
            parent: parent,
            memberName: memberName
        };
    };

   /** Construct an instance of a component as a child of the specified parent, with a well-known, unique name derived from its typeName
    * @param parentPath {String|Array of String} Parent of path where the new component is to be constructed, represented as a string or array of segments
    * @param options {String|Object} Options encoding the component to be constructed. If this is of type String, it is assumed to represent the component's typeName with no options
    * @param instantiator {Instantiator} [optional] The instantiator holding the component to be created - if blank, the global instantiator will be used
    */
    fluid.constructSingle = function (parentPath, options, instantiator) {
        instantiator = instantiator || fluid.globalInstantiator;
        parentPath = parentPath || "";
        var segs = fluid.model.parseToSegments(parentPath, instantiator.parseEL, true);
        if (typeof(options) === "string") {
            options = {type: options};
        }
        var type = options.type;
        if (!type) {
            fluid.fail("Cannot construct singleton object without a type entry");
        }
        options = $.extend({}, options);
        var gradeNames = options.gradeNames = fluid.makeArray(options.gradeNames);
        gradeNames.unshift(type); // principal type may be noninstantiable
        options.type = "fluid.component";
        var root = segs.length === 0;
        if (root) {
            gradeNames.push("fluid.resolveRoot");
        }
        var memberName = fluid.typeNameToMemberName(options.singleRootType || type);
        segs.push(memberName);
        fluid.construct(segs, options, instantiator);
    };

    /** Destroy an instance created by `fluid.constructSingle`
     * @param parentPath {String|Array of String} Parent of path where the new component is to be constructed, represented as a string or array of segments
     * @param typeName {String} The type name used to construct the component (either `type` or `singleRootType` of the `options` argument to `fluid.constructSingle`
     * @param instantiator {Instantiator} [optional] The instantiator holding the component to be created - if blank, the global instantiator will be used
    */
    fluid.destroySingle = function (parentPath, typeName, instantiator) {
        instantiator = instantiator || fluid.globalInstantiator;
        var segs = fluid.model.parseToSegments(parentPath, instantiator.parseEL, true);
        var memberName = fluid.typeNameToMemberName(typeName);
        segs.push(memberName);
        fluid.destroy(segs, instantiator);
    };

    /** Registers and constructs a "linkage distribution" which will ensure that wherever a set of "input grades" co-occur, they will
     * always result in a supplied "output grades" in the component where they co-occur.
     * @param linkageName {String} The name of the grade which will broadcast the resulting linkage. If required, this linkage can be destroyed by supplying this name to `fluid.destroySingle`.
     * @param inputNames {Array of String} An array of grade names which will be tested globally for co-occurrence
     * @param outputNames {String|Array of String} A single name or array of grade names which will be output into the co-occuring component
     */
    fluid.makeGradeLinkage = function (linkageName, inputNames, outputNames) {
        fluid.defaults(linkageName, {
            gradeNames: "fluid.component",
            distributeOptions: {
                record: outputNames,
                target: "{/ " + inputNames.join("&") + "}.options.gradeNames"
            }
        });
        fluid.constructSingle([], linkageName);
    };

    /** Retrieves a component by global path.
    * @param path {String|Array of String} The global path of the component to look up
    * @return The component at the specified path, or undefined if none is found
    */
    fluid.componentForPath = function (path) {
        return fluid.globalInstantiator.pathToComponent[fluid.isArrayable(path) ? path.join(".") : path];
    };

    /** END NEXUS METHODS **/

    /** BEGIN IOC DEBUGGING METHODS **/
    fluid["debugger"] = function () {
        debugger; // eslint-disable-line no-debugger
    };

    fluid.defaults("fluid.debuggingProbe", {
        gradeNames: ["fluid.component"]
    });

    // probe looks like:
    // target: {preview other}.listeners.eventName
    // priority: first/last
    // func: console.log/fluid.log/fluid.debugger
    fluid.probeToDistribution = function (probe) {
        var instantiator = fluid.globalInstantiator;
        var parsed = fluid.parseContextReference(probe.target);
        var segs = fluid.model.parseToSegments(parsed.path, instantiator.parseEL, true);
        if (segs[0] !== "options") {
            segs.unshift("options"); // compensate for this insanity until we have the great options flattening
        }
        var parsedPriority = fluid.parsePriority(probe.priority);
        if (parsedPriority.constraint && !parsedPriority.constraint.target) {
            parsedPriority.constraint.target = "authoring";
        }
        return {
            target: "{/ " + parsed.context + "}." + instantiator.composeSegments.apply(null, segs),
            record: {
                func: probe.func,
                funcName: probe.funcName,
                args: probe.args,
                priority: fluid.renderPriority(parsedPriority)
            }
        };
    };

    fluid.registerProbes = function (probes) {
        var probeDistribution = fluid.transform(probes, fluid.probeToDistribution);
        var memberName = "fluid_debuggingProbe_" + fluid.allocateGuid();
        fluid.construct([memberName], {
            type: "fluid.debuggingProbe",
            distributeOptions: probeDistribution
        });
        return memberName;
    };

    fluid.deregisterProbes = function (probeName) {
        fluid.destroy([probeName]);
    };

    /** END IOC DEBUGGING METHODS **/

    fluid.thisistToApplicable = function (record, recthis, that) {
        return {
            apply: function (noThis, args) {
                // Resolve this material late, to deal with cases where the target has only just been brought into existence
                // (e.g. a jQuery target for rendered material) - TODO: Possibly implement cached versions of these as we might do for invokers
                var resolvedThis = fluid.expandOptions(recthis, that);
                if (typeof(resolvedThis) === "string") {
                    resolvedThis = fluid.getGlobalValue(resolvedThis);
                }
                if (!resolvedThis) {
                    fluid.fail("Could not resolve reference " + recthis + " to a value");
                }
                var resolvedFunc = resolvedThis[record.method];
                if (typeof(resolvedFunc) !== "function") {
                    fluid.fail("Object ", resolvedThis, " at reference " + recthis + " has no member named " + record.method + " which is a function ");
                }
                fluid.log("Applying arguments ", args, " to method " + record.method + " of instance ", resolvedThis);
                return resolvedFunc.apply(resolvedThis, args);
            }
        };
    };

    fluid.changeToApplicable = function (record, that) {
        return {
            apply: function (noThis, args, localRecord, mergeRecord) {
                var parsed = fluid.parseValidModelReference(that, "changePath listener record", record.changePath);
                var value = fluid.expandOptions(record.value, that, {}, fluid.extend(localRecord, {"arguments": args}));
                var sources = mergeRecord && mergeRecord.source && mergeRecord.source.length ? fluid.makeArray(record.source).concat(mergeRecord.source) : record.source;
                parsed.applier.change(parsed.modelSegs, value, record.type, sources); // FLUID-5586 now resolved
            }
        };
    };

    // Convert "exotic records" into an applicable form ("this/method" for FLUID-4878 or "changePath" for FLUID-3674)
    fluid.recordToApplicable = function (record, that, standard) {
        if (record.changePath !== undefined) { // Allow falsy paths for FLUID-5586
            return fluid.changeToApplicable(record, that, standard);
        }
        var recthis = record["this"];
        if (record.method ^ recthis) {
            fluid.fail("Record ", that, " must contain both entries \"method\" and \"this\" if it contains either");
        }
        return record.method ? fluid.thisistToApplicable(record, recthis, that) : null;
    };

    fluid.getGlobalValueNonComponent = function (funcName, context) { // TODO: Guard this in listeners as well
        var defaults = fluid.defaults(funcName);
        if (defaults && fluid.hasGrade(defaults, "fluid.component")) {
            fluid.fail("Error in function specification - cannot invoke function " + funcName + " in the context of " + context + ": component creator functions can only be used as subcomponents");
        }
        return fluid.getGlobalValue(funcName);
    };

    fluid.makeInvoker = function (that, invokerec, name) {
        invokerec = fluid.upgradePrimitiveFunc(invokerec); // shorthand case for direct function invokers (FLUID-4926)
        if (invokerec.args !== undefined && invokerec.args !== fluid.NO_VALUE && !fluid.isArrayable(invokerec.args)) {
            invokerec.args = fluid.makeArray(invokerec.args);
        }
        var func = fluid.recordToApplicable(invokerec, that);
        var invokePre = fluid.preExpand(invokerec.args);
        var localRecord = {};
        var expandOptions = fluid.makeStackResolverOptions(that, localRecord, true);
        func = func || (invokerec.funcName ? fluid.getGlobalValueNonComponent(invokerec.funcName, "an invoker") : fluid.expandImmediate(invokerec.func, that));
        if (!func || !func.apply) {
            fluid.fail("Error in invoker record: could not resolve members func, funcName or method to a function implementation - got " + func + " from ", invokerec);
        } else if (func === fluid.notImplemented) {
            fluid.fail("Error constructing component ", that, " - the invoker named " + name + " which was defined in grade " + invokerec.componentSource + " needs to be overridden with a concrete implementation");
        }
        return function invokeInvoker() {
            if (fluid.defeatLogging === false) {
                fluid.pushActivity("invokeInvoker", "invoking invoker with name %name and record %record from component %that", {name: name, record: invokerec, that: that});
            }
            var togo, finalArgs;
            localRecord.arguments = arguments;
            if (invokerec.args === undefined || invokerec.args === fluid.NO_VALUE) {
                finalArgs = arguments;
            } else {
                fluid.expandImmediateImpl(invokePre, expandOptions);
                finalArgs = invokePre.source;
            }
            togo = func.apply(null, finalArgs);
            if (fluid.defeatLogging === false) {
                fluid.popActivity();
            }
            return togo;
        };
    };

    // weird higher-order function so that we can staightforwardly dispatch original args back onto listener
    fluid.event.makeTrackedListenerAdder = function (source) {
        var shadow = fluid.shadowForComponent(source);
        return function (event) {
            return {addListener: function (listener, namespace, priority, softNamespace, listenerId) {
                fluid.recordListener(event, listener, shadow, listenerId);
                event.addListener.apply(null, arguments);
            }};
        };
    };

    fluid.event.listenerEngine = function (eventSpec, callback, adder) {
        var argstruc = {};
        function checkFire() {
            var notall = fluid.find(eventSpec, function (value, key) {
                if (argstruc[key] === undefined) {
                    return true;
                }
            });
            if (!notall) {
                var oldstruc = argstruc;
                argstruc = {}; // guard against the case the callback perversely fires one of its prerequisites (FLUID-5112)
                callback(oldstruc);
            }
        }
        fluid.each(eventSpec, function (event, eventName) {
            adder(event).addListener(function () {
                argstruc[eventName] = fluid.makeArray(arguments);
                checkFire();
            });
        });
    };

    fluid.event.dispatchListener = function (that, listener, eventName, eventSpec, indirectArgs) {
        if (eventSpec.args !== undefined && eventSpec.args !== fluid.NO_VALUE && !fluid.isArrayable(eventSpec.args)) {
            eventSpec.args = fluid.makeArray(eventSpec.args);
        }
        listener = fluid.event.resolveListener(listener); // In theory this optimisation is too aggressive if global name is not defined yet
        var dispatchPre = fluid.preExpand(eventSpec.args);
        var localRecord = {};
        var expandOptions = fluid.makeStackResolverOptions(that, localRecord, true);
        var togo = function () {
            if (fluid.defeatLogging === false) {
                fluid.pushActivity("dispatchListener", "firing to listener to event named %eventName of component %that",
                    {eventName: eventName, that: that});
            }

            var args = indirectArgs ? arguments[0] : arguments, finalArgs;
            localRecord.arguments = args;
            if (eventSpec.args !== undefined && eventSpec.args !== fluid.NO_VALUE) {
                fluid.expandImmediateImpl(dispatchPre, expandOptions);
                finalArgs = dispatchPre.source;
            } else {
                finalArgs = args;
            }
            var togo = listener.apply(null, finalArgs);
            if (fluid.defeatLogging === false) {
                fluid.popActivity();
            }
            return togo;
        };
        fluid.event.impersonateListener(listener, togo); // still necessary for FLUID-5254 even though framework's listeners now get explicit guids
        return togo;
    };

    fluid.event.resolveSoftNamespace = function (key) {
        if (typeof(key) !== "string") {
            return null;
        } else {
            var lastpos = Math.max(key.lastIndexOf("."), key.lastIndexOf("}"));
            return key.substring(lastpos + 1);
        }
    };

    fluid.event.resolveListenerRecord = function (lisrec, that, eventName, namespace, standard) {
        var badRec = function (record, extra) {
            fluid.fail("Error in listener record - could not resolve reference ", record, " to a listener or firer. " +
                "Did you miss out \"events.\" when referring to an event firer?" + extra);
        };
        fluid.pushActivity("resolveListenerRecord", "resolving listener record for event named %eventName for component %that",
            {eventName: eventName, that: that});
        var records = fluid.makeArray(lisrec);
        var transRecs = fluid.transform(records, function (record) {
            // TODO: FLUID-5242 fix - we copy here since distributeOptions does not copy options blocks that it distributes and we can hence corrupt them.
            // need to clarify policy on options sharing - for slightly better efficiency, copy should happen during distribution and not here
            // Note that fluid.mergeModelListeners expects to write to these too
            var expanded = fluid.isPrimitive(record) || record.expander ? {listener: record} : fluid.copy(record);
            var methodist = fluid.recordToApplicable(record, that, standard);
            if (methodist) {
                expanded.listener = methodist;
            }
            else {
                expanded.listener = expanded.listener || expanded.func || expanded.funcName;
            }
            if (!expanded.listener) {
                badRec(record, " Listener record must contain a member named \"listener\", \"func\", \"funcName\" or \"method\"");
            }
            var softNamespace = record.method ?
                fluid.event.resolveSoftNamespace(record["this"]) + "." + record.method :
                fluid.event.resolveSoftNamespace(expanded.listener);
            if (!expanded.namespace && !namespace && softNamespace) {
                expanded.softNamespace = true;
                expanded.namespace = (record.componentSource ? record.componentSource : that.typeName) + "." + softNamespace;
            }
            var listener = expanded.listener = fluid.expandOptions(expanded.listener, that);
            if (!listener) {
                badRec(record, "");
            }
            var firer = false;
            if (listener.typeName === "fluid.event.firer") {
                listener = listener.fire;
                firer = true;
            }
            expanded.listener = (standard && (expanded.args && listener !== "fluid.notImplemented" || firer)) ? fluid.event.dispatchListener(that, listener, eventName, expanded) : listener;
            expanded.listenerId = fluid.allocateGuid();
            return expanded;
        });
        var togo = {
            records: transRecs,
            adderWrapper: standard ? fluid.event.makeTrackedListenerAdder(that) : null
        };
        fluid.popActivity();
        return togo;
    };

    fluid.event.expandOneEvent = function (that, event) {
        var origin;
        if (typeof(event) === "string" && event.charAt(0) !== "{") {
            // Shorthand for resolving onto our own events, but with GINGER WORLD!
            origin = fluid.getForComponent(that, ["events", event]);
        }
        else {
            origin = fluid.expandOptions(event, that);
        }
        if (!origin || origin.typeName !== "fluid.event.firer") {
            fluid.fail("Error in event specification - could not resolve base event reference ", event, " to an event firer: got ", origin);
        }
        return origin;
    };

    fluid.event.expandEvents = function (that, event) {
        return typeof(event) === "string" ?
            fluid.event.expandOneEvent(that, event) :
            fluid.transform(event, function (oneEvent) {
                return fluid.event.expandOneEvent(that, oneEvent);
            });
    };

    fluid.event.resolveEvent = function (that, eventName, eventSpec) {
        fluid.pushActivity("resolveEvent", "resolving event with name %eventName attached to component %that",
            {eventName: eventName, that: that});
        var adder = fluid.event.makeTrackedListenerAdder(that);
        if (typeof(eventSpec) === "string") {
            eventSpec = {event: eventSpec};
        }
        var event = eventSpec.typeName === "fluid.event.firer" ? eventSpec : eventSpec.event || eventSpec.events;
        if (!event) {
            fluid.fail("Event specification for event with name " + eventName + " does not include a base event specification: ", eventSpec);
        }

        var origin = event.typeName === "fluid.event.firer" ? event : fluid.event.expandEvents(that, event);

        var isMultiple = origin.typeName !== "fluid.event.firer";
        var isComposite = eventSpec.args || isMultiple;
        // If "event" is not composite, we want to share the listener list and FIRE method with the original
        // If "event" is composite, we need to create a new firer. "composite" includes case where any boiling
        // occurred - this was implemented wrongly in 1.4.
        var firer;
        if (isComposite) {
            firer = fluid.makeEventFirer({name: " [composite] " + fluid.event.nameEvent(that, eventName)});
            var dispatcher = fluid.event.dispatchListener(that, firer.fire, eventName, eventSpec, isMultiple);
            if (isMultiple) {
                fluid.event.listenerEngine(origin, dispatcher, adder);
            }
            else {
                adder(origin).addListener(dispatcher);
            }
        }
        else {
            firer = {typeName: "fluid.event.firer"};
            firer.fire = function () {
                var outerArgs = fluid.makeArray(arguments);
                fluid.pushActivity("fireSynthetic", "firing synthetic event %eventName ", {eventName: eventName});
                var togo = origin.fire.apply(null, outerArgs);
                fluid.popActivity();
                return togo;
            };
            firer.addListener = function (listener, namespace, priority, softNamespace, listenerId) {
                var dispatcher = fluid.event.dispatchListener(that, listener, eventName, eventSpec);
                adder(origin).addListener(dispatcher, namespace, priority, softNamespace, listenerId);
            };
            firer.removeListener = function (listener) {
                origin.removeListener(listener);
            };
        }
        fluid.popActivity();
        return firer;
    };

    /** BEGIN unofficial IoC material **/
    // The following three functions are unsupported ane only used in the renderer expander.
    // The material they produce is no longer recognised for component resolution.

    fluid.withEnvironment = function (envAdd, func, root) {
        var key;
        root = root || fluid.globalThreadLocal();
        try {
            for (key in envAdd) {
                root[key] = envAdd[key];
            }
            $.extend(root, envAdd);
            return func();
        } finally {
            for (key in envAdd) {
                delete root[key]; // TODO: users may want a recursive "scoping" model
            }
        }
    };

    fluid.fetchContextReference = function (parsed, directModel, env, elResolver, externalFetcher) {
        // The "elResolver" is a hack to make certain common idioms in protoTrees work correctly, where a contextualised EL
        // path actually resolves onto a further EL reference rather than directly onto a value target
        if (elResolver) {
            parsed = elResolver(parsed, env);
        }
        var base = parsed.context ? env[parsed.context] : directModel;
        if (!base) {
            var resolveExternal = externalFetcher && externalFetcher(parsed);
            return resolveExternal || base;
        }
        return parsed.noDereference ? parsed.path : fluid.get(base, parsed.path);
    };

    fluid.makeEnvironmentFetcher = function (directModel, elResolver, envGetter, externalFetcher) {
        envGetter = envGetter || fluid.globalThreadLocal;
        return function (parsed) {
            var env = envGetter();
            return fluid.fetchContextReference(parsed, directModel, env, elResolver, externalFetcher);
        };
    };

    /** END of unofficial IoC material **/

    /* Compact expansion machinery - for short form invoker and expander references such as @expand:func(arg) and func(arg) */

    fluid.coerceToPrimitive = function (string) {
        return string === "false" ? false : (string === "true" ? true :
            (isFinite(string) ? Number(string) : string));
    };

    fluid.compactStringToRec = function (string, type) {
        var openPos = string.indexOf("(");
        var closePos = string.indexOf(")");
        if (openPos === -1 ^ closePos === -1 || openPos > closePos) {
            fluid.fail("Badly-formed compact " + type + " record without matching parentheses: " + string);
        }
        if (openPos !== -1 && closePos !== -1) {
            var trail = string.substring(closePos + 1);
            if ($.trim(trail) !== "") {
                fluid.fail("Badly-formed compact " + type + " record " + string + " - unexpected material following close parenthesis: " + trail);
            }
            var prefix = string.substring(0, openPos);
            var body = string.substring(openPos + 1, closePos);
            var args = fluid.transform(body.split(","), $.trim, fluid.coerceToPrimitive);
            var togo = fluid.upgradePrimitiveFunc(prefix, null);
            togo.args = args;
            return togo;
        }
        else if (type === "expander") {
            fluid.fail("Badly-formed compact expander record without parentheses: " + string);
        }
        return string;
    };

    fluid.expandPrefix = "@expand:";

    fluid.expandCompactString = function (string, active) {
        var rec = string;
        if (string.indexOf(fluid.expandPrefix) === 0) {
            var rem = string.substring(fluid.expandPrefix.length);
            rec = {
                expander: fluid.compactStringToRec(rem, "expander")
            };
        }
        else if (active) {
            rec = fluid.compactStringToRec(string, active);
        }
        return rec;
    };

    var singularPenRecord = {
        listeners: "listener",
        modelListeners: "modelListener"
    };

    var singularRecord = $.extend({
        invokers: "invoker"
    }, singularPenRecord);

    fluid.expandCompactRec = function (segs, target, source) {
        fluid.guardCircularExpansion(segs, segs.length);
        var pen = segs.length > 0 ? segs[segs.length - 1] : "";
        var active = singularRecord[pen];
        if (!active && segs.length > 1) {
            active = singularPenRecord[segs[segs.length - 2]]; // support array of listeners and modelListeners
        }
        fluid.each(source, function (value, key) {
            if (fluid.isPlainObject(value)) {
                target[key] = fluid.freshContainer(value);
                segs.push(key);
                fluid.expandCompactRec(segs, target[key], value);
                segs.pop();
                return;
            }
            else if (typeof(value) === "string") {
                value = fluid.expandCompactString(value, active);
            }
            target[key] = value;
        });
    };

    fluid.expandCompact = function (options) {
        var togo = {};
        fluid.expandCompactRec([], togo, options);
        return togo;
    };

    /** End compact record expansion machinery **/

    fluid.extractEL = function (string, options) {
        if (options.ELstyle === "ALL") {
            return string;
        }
        else if (options.ELstyle.length === 1) {
            if (string.charAt(0) === options.ELstyle) {
                return string.substring(1);
            }
        }
        else if (options.ELstyle === "${}") {
            var i1 = string.indexOf("${");
            var i2 = string.lastIndexOf("}");
            if (i1 === 0 && i2 !== -1) {
                return string.substring(2, i2);
            }
        }
    };

    fluid.extractELWithContext = function (string, options) {
        var EL = fluid.extractEL(string, options);
        if (fluid.isIoCReference(EL)) {
            return fluid.parseContextReference(EL);
        }
        return EL ? {path: EL} : EL;
    };

    fluid.parseContextReference = function (reference, index, delimiter) {
        index = index || 0;
        var endcpos = reference.indexOf("}", index + 1);
        if (endcpos === -1) {
            fluid.fail("Cannot parse context reference \"" + reference + "\": Malformed context reference without }");
        }
        var context = reference.substring(index + 1, endcpos);
        var endpos = delimiter ? reference.indexOf(delimiter, endcpos + 1) : reference.length;
        var path = reference.substring(endcpos + 1, endpos);
        if (path.charAt(0) === ".") {
            path = path.substring(1);
        }
        return {context: context, path: path, endpos: endpos};
    };

    fluid.renderContextReference = function (parsed) {
        return "{" + parsed.context + "}" + (parsed.path ? "." + parsed.path : "");
    };

    // TODO: Once we eliminate expandSource, all of this tree of functions can be hived off to RendererUtilities
    fluid.resolveContextValue = function (string, options) {
        function fetch(parsed) {
            fluid.pushActivity("resolveContextValue", "resolving context value %string", {string: string});
            var togo = options.fetcher(parsed);
            fluid.pushActivity("resolvedContextValue", "resolved value %string to value %value", {string: string, value: togo});
            fluid.popActivity(2);
            return togo;
        }
        var parsed;
        if (options.bareContextRefs && fluid.isIoCReference(string)) {
            parsed = fluid.parseContextReference(string);
            return fetch(parsed);
        }
        else if (options.ELstyle && options.ELstyle !== "${}") {
            parsed = fluid.extractELWithContext(string, options);
            if (parsed) {
                return fetch(parsed);
            }
        }
        while (typeof(string) === "string") {
            var i1 = string.indexOf("${");
            var i2 = string.indexOf("}", i1 + 2);
            if (i1 !== -1 && i2 !== -1) {
                if (string.charAt(i1 + 2) === "{") {
                    parsed = fluid.parseContextReference(string, i1 + 2, "}");
                    i2 = parsed.endpos;
                }
                else {
                    parsed = {path: string.substring(i1 + 2, i2)};
                }
                var subs = fetch(parsed);
                var all = (i1 === 0 && i2 === string.length - 1);
                // TODO: test case for all undefined substitution
                if (subs === undefined || subs === null) {
                    return subs;
                }
                string = all ? subs : string.substring(0, i1) + subs + string.substring(i2 + 1);
            }
            else {
                break;
            }
        }
        return string;
    };

    // This function appears somewhat reusable, but not entirely - it probably needs to be packaged
    // along with the particular "strategy". Very similar to the old "filter"... the "outer driver" needs
    // to execute it to get the first recursion going at top level. This was one of the most odd results
    // of the reorganisation, since the "old work" seemed much more naturally expressed in terms of values
    // and what happened to them. The "new work" is expressed in terms of paths and how to move amongst them.
    fluid.fetchExpandChildren = function (target, i, segs, source, mergePolicy, options) {
        if (source.expander) { // possible expander at top level
            var expanded = fluid.expandExpander(target, source, options);
            if (fluid.isPrimitive(expanded) || !fluid.isPlainObject(expanded) || (fluid.isArrayable(expanded) ^ fluid.isArrayable(target))) {
                return expanded;
            }
            else { // make an attempt to preserve the root reference if possible
                $.extend(true, target, expanded);
            }
        }
        // NOTE! This expects that RHS is concrete! For material input to "expansion" this happens to be the case, but is not
        // true for other algorithms. Inconsistently, this algorithm uses "sourceStrategy" below. In fact, this "fetchChildren"
        // operation looks like it is a fundamental primitive of the system. We do call "deliverer" early which enables correct
        // reference to parent nodes up the tree - however, anyone processing a tree IN THE CHAIN requires that it is produced
        // concretely at the point STRATEGY returns. Which in fact it is...............
        fluid.each(source, function (newSource, key) {
            if (newSource === undefined) {
                target[key] = undefined; // avoid ever dispatching to ourselves with undefined source
            }
            else if (key !== "expander") {
                segs[i] = key;
                if (fluid.getImmediate(options.exceptions, segs, i) !== true) {
                    options.strategy(target, key, i + 1, segs, source, mergePolicy);
                }
            }
        });
        return target;
    };

    // TODO: This method is unnecessary and will quadratic inefficiency if RHS block is not concrete.
    // The driver should detect "homogeneous uni-strategy trundling" and agree to preserve the extra
    // "cursor arguments" which should be advertised somehow (at least their number)
    function regenerateCursor(source, segs, limit, sourceStrategy) {
        for (var i = 0; i < limit; ++i) {
            // copy segs to avoid aliasing with FLUID-5243
            source = sourceStrategy(source, segs[i], i, fluid.makeArray(segs));
        }
        return source;
    }

    fluid.isUnexpandable = function (source) { // slightly more efficient compound of fluid.isCopyable and fluid.isComponent - review performance
        return fluid.isPrimitive(source) || !fluid.isPlainObject(source);
    };

    fluid.expandSource = function (options, target, i, segs, deliverer, source, policy, recurse) {
        var expanded, isTrunk;
        var thisPolicy = fluid.derefMergePolicy(policy);
        if (typeof (source) === "string" && !thisPolicy.noexpand) {
            if (!options.defaultEL || source.charAt(0) === "{") { // hard-code this for performance
                fluid.pushActivity("expandContextValue", "expanding context value %source held at path %path", {source: source, path: fluid.path.apply(null, segs.slice(0, i))});
                expanded = fluid.resolveContextValue(source, options);
                fluid.popActivity(1);
            } else {
                expanded = source;
            }
        }
        else if (thisPolicy.noexpand || fluid.isUnexpandable(source)) {
            expanded = source;
        }
        else if (source.expander) {
            expanded = fluid.expandExpander(deliverer, source, options);
        }
        else {
            expanded = fluid.freshContainer(source);
            isTrunk = true;
        }
        if (expanded !== fluid.NO_VALUE) {
            deliverer(expanded);
        }
        if (isTrunk) {
            recurse(expanded, source, i, segs, policy);
        }
        return expanded;
    };

    fluid.guardCircularExpansion = function (segs, i) {
        if (i > fluid.strategyRecursionBailout) {
            fluid.fail("Overflow/circularity in options expansion, current path is ", segs, " at depth " , i, " - please ensure options are not circularly connected, or protect from expansion using the \"noexpand\" policy or expander");
        }
    };

    fluid.makeExpandStrategy = function (options) {
        var recurse = function (target, source, i, segs, policy) {
            return fluid.fetchExpandChildren(target, i || 0, segs || [], source, policy, options);
        };
        var strategy = function (target, name, i, segs, source, policy) {
            fluid.guardCircularExpansion(segs, i);
            if (!target) {
                return;
            }
            if (target.hasOwnProperty(name)) { // bail out if our work has already been done
                return target[name];
            }
            if (source === undefined) { // recover our state in case this is an external entry point
                source = regenerateCursor(options.source, segs, i - 1, options.sourceStrategy);
                policy = regenerateCursor(options.mergePolicy, segs, i - 1, fluid.concreteTrundler);
            }
            var thisSource = options.sourceStrategy(source, name, i, segs);
            var thisPolicy = fluid.concreteTrundler(policy, name);
            function deliverer(value) {
                target[name] = value;
            }
            return fluid.expandSource(options, target, i, segs, deliverer, thisSource, thisPolicy, recurse);
        };
        options.recurse = recurse;
        options.strategy = strategy;
        return strategy;
    };

    fluid.defaults("fluid.makeExpandOptions", {
        ELstyle:          "${}",
        bareContextRefs:  true,
        target:           fluid.inCreationMarker
    });

    fluid.makeExpandOptions = function (source, options) {
        options = $.extend({}, fluid.rawDefaults("fluid.makeExpandOptions"), options);
        options.defaultEL = options.ELStyle === "${}" && options.bareContextRefs; // optimisation to help expander
        options.expandSource = function (source) {
            return fluid.expandSource(options, null, 0, [], fluid.identity, source, options.mergePolicy, false);
        };
        if (!fluid.isUnexpandable(source)) {
            options.source = source;
            options.target = fluid.freshContainer(source);
            options.sourceStrategy = options.sourceStrategy || fluid.concreteTrundler;
            fluid.makeExpandStrategy(options);
            options.initter = function () {
                options.target = fluid.fetchExpandChildren(options.target, 0, [], options.source, options.mergePolicy, options);
            };
        }
        else { // these init immediately since we must deliver a valid root target
            options.strategy = fluid.concreteTrundler;
            options.initter = fluid.identity;
            if (typeof(source) === "string") {
                options.target = options.expandSource(source);
            }
            else {
                options.target = source;
            }
        }
        return options;
    };

    // supported, PUBLIC API function
    fluid.expand = function (source, options) {
        var expandOptions = fluid.makeExpandOptions(source, options);
        expandOptions.initter();
        return expandOptions.target;
    };

    fluid.preExpandRecurse = function (root, source, holder, member, rootSegs) { // on entry, holder[member] = source
        fluid.guardCircularExpansion(rootSegs, rootSegs.length);
        function pushExpander(expander) {
            root.expanders.push({expander: expander, holder: holder, member: member});
            delete holder[member];
        }
        if (fluid.isIoCReference(source)) {
            var parsed = fluid.parseContextReference(source);
            var segs = fluid.model.parseEL(parsed.path);
            pushExpander({
                typeFunc: fluid.expander.fetch,
                context: parsed.context,
                segs: segs
            });
        } else if (fluid.isPlainObject(source)) {
            if (source.expander) {
                source.expander.typeFunc = fluid.getGlobalValue(source.expander.type || "fluid.invokeFunc");
                pushExpander(source.expander);
            } else {
                fluid.each(source, function (value, key) {
                    rootSegs.push(key);
                    fluid.preExpandRecurse(root, value, source, key, rootSegs);
                    rootSegs.pop();
                });
            }
        }
    };

    fluid.preExpand = function (source) {
        var root = {
            expanders: [],
            source: fluid.isUnexpandable(source) ? source : fluid.copy(source)
        };
        fluid.preExpandRecurse(root, root.source, root, "source", []);
        return root;
    };

    // Main pathway for freestanding material that is not part of a component's options
    fluid.expandImmediate = function (source, that, localRecord) {
        var options = fluid.makeStackResolverOptions(that, localRecord, true); // TODO: ELstyle and target are now ignored
        var root = fluid.preExpand(source);
        fluid.expandImmediateImpl(root, options);
        return root.source;
    };

    // High performance expander for situations such as invokers, listeners, where raw materials can be cached - consumes "root" structure produced by preExpand
    fluid.expandImmediateImpl = function (root, options) {
        var expanders = root.expanders;
        for (var i = 0; i < expanders.length; ++i) {
            var expander = expanders[i];
            expander.holder[expander.member] = expander.expander.typeFunc(null, expander, options);
        }
    };

    fluid.expandExpander = function (deliverer, source, options) {
        var expander = fluid.getGlobalValue(source.expander.type || "fluid.invokeFunc");
        if (!expander) {
            fluid.fail("Unknown expander with type " + source.expander.type);
        }
        return expander(deliverer, source, options);
    };

    fluid.registerNamespace("fluid.expander");

    fluid.expander.fetch = function (deliverer, source, options) {
        var localRecord = options.localRecord, context = source.expander.context, segs = source.expander.segs;
        var inLocal = localRecord[context] !== undefined;
        // somewhat hack to anticipate "fits" for FLUID-4925 - we assume that if THIS component is in construction, its reference target might be too
        var component = inLocal ? localRecord[context] : fluid.resolveContext(context, options.contextThat, options.contextThat.lifecycleStatus === "treeConstructed");
        if (component) {
            var root = component;
            if (inLocal || component.lifecycleStatus === "constructed" || component.lifecycleStatus === "treeConstructed") {
                for (var i = 0; i < segs.length; ++i) {
                    root = root ? root[segs[i]] : undefined;
                }
            } else if (component.lifecycleStatus !== "destroyed") {
                root = fluid.getForComponent(component, segs);
            } else {
                fluid.fail("Cannot resolve path " + segs.join(".") + " into component ", component, " which has been destroyed");
            }
            if (root === undefined && !inLocal) { // last-ditch attempt to get exotic EL value from component
                root = fluid.getForComponent(component, segs);
            }
            return root;
        } else if (segs.length > 0) {
            fluid.triggerMismatchedPathError(source.expander, options.contextThat);
        }
    };

    /** "light" expanders, starting with the default expander invokeFunc,
         which makes an arbitrary function call (after expanding arguments) and are then replaced in
         the configuration with the call results. These will probably be abolished and replaced with
         equivalent model transformation machinery **/

    // This one is now positioned as the "universal expander" - default if no type supplied
    fluid.invokeFunc = function (deliverer, source, options) {
        var expander = source.expander;
        var args = fluid.makeArray(expander.args);
        expander.args = args; // head off case where args is an EL reference which resolves to an array
        if (options.recurse) { // only available in the path from fluid.expandOptions - this will be abolished in the end
            args = options.recurse([], args);
        } else {
            expander = fluid.expandImmediate(expander, options.contextThat, options.localRecord);
            args = expander.args;
        }
        var funcEntry = expander.func || expander.funcName;
        var func = (options.expandSource ? options.expandSource(funcEntry) : funcEntry) || fluid.recordToApplicable(expander, options.contextThat);
        if (typeof(func) === "string") {
            func = fluid.getGlobalValue(func);
        }
        if (!func) {
            fluid.fail("Error in expander record ", expander, ": " + funcEntry + " could not be resolved to a function for component ", options.contextThat);
        }
        return func.apply(null, args);
    };

    // The "noexpand" expander which simply unwraps one level of expansion and ceases.
    fluid.noexpand = function (deliverer, source) {
        return source.expander.value ? source.expander.value : source.expander.tree;
    };

})(jQuery, fluid_2_0_0);
;
/*
Copyright 2008-2010 University of Cambridge
Copyright 2008-2009 University of Toronto
Copyright 2010-2011 Lucendo Development Ltd.
Copyright 2010-2014 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

var fluid_2_0_0 = fluid_2_0_0 || {};

(function ($, fluid) {
    "use strict";

    /** NOTE: The contents of this file are by default NOT PART OF THE PUBLIC FLUID API unless explicitly annotated before the function **/

    /** MODEL ACCESSOR ENGINE **/

    /** Standard strategies for resolving path segments **/

    fluid.model.makeEnvironmentStrategy = function (environment) {
        return function (root, segment, index) {
            return index === 0 && environment[segment] ?
                environment[segment] : undefined;
        };
    };

    fluid.model.defaultCreatorStrategy = function (root, segment) {
        if (root[segment] === undefined) {
            root[segment] = {};
            return root[segment];
        }
    };

    fluid.model.defaultFetchStrategy = function (root, segment) {
        return root[segment];
    };

    fluid.model.funcResolverStrategy = function (root, segment) {
        if (root.resolvePathSegment) {
            return root.resolvePathSegment(segment);
        }
    };

    fluid.model.traverseWithStrategy = function (root, segs, initPos, config, uncess) {
        var strategies = config.strategies;
        var limit = segs.length - uncess;
        for (var i = initPos; i < limit; ++i) {
            if (!root) {
                return root;
            }
            var accepted;
            for (var j = 0; j < strategies.length; ++j) {
                accepted = strategies[j](root, segs[i], i + 1, segs);
                if (accepted !== undefined) {
                    break; // May now short-circuit with stateless strategies
                }
            }
            if (accepted === fluid.NO_VALUE) {
                accepted = undefined;
            }
            root = accepted;
        }
        return root;
    };

    /** Returns both the value and the path of the value held at the supplied EL path **/
    fluid.model.getValueAndSegments = function (root, EL, config, initSegs) {
        return fluid.model.accessWithStrategy(root, EL, fluid.NO_VALUE, config, initSegs, true);
    };

    // Very lightweight remnant of trundler, only used in resolvers
    fluid.model.makeTrundler = function (config) {
        return function (valueSeg, EL) {
            return fluid.model.getValueAndSegments(valueSeg.root, EL, config, valueSeg.segs);
        };
    };

    fluid.model.getWithStrategy = function (root, EL, config, initSegs) {
        return fluid.model.accessWithStrategy(root, EL, fluid.NO_VALUE, config, initSegs);
    };

    fluid.model.setWithStrategy = function (root, EL, newValue, config, initSegs) {
        fluid.model.accessWithStrategy(root, EL, newValue, config, initSegs);
    };

    fluid.model.accessWithStrategy = function (root, EL, newValue, config, initSegs, returnSegs) {
        // This function is written in this unfortunate style largely for efficiency reasons. In many cases
        // it should be capable of running with 0 allocations (EL is preparsed, initSegs is empty)
        if (!fluid.isPrimitive(EL) && !fluid.isArrayable(EL)) {
            var key = EL.type || "default";
            var resolver = config.resolvers[key];
            if (!resolver) {
                fluid.fail("Unable to find resolver of type " + key);
            }
            var trundler = fluid.model.makeTrundler(config); // very lightweight trundler for resolvers
            var valueSeg = {root: root, segs: initSegs};
            valueSeg = resolver(valueSeg, EL, trundler);
            if (EL.path && valueSeg) { // every resolver supports this piece of output resolution
                valueSeg = trundler(valueSeg, EL.path);
            }
            return returnSegs ? valueSeg : (valueSeg ? valueSeg.root : undefined);
        }
        else {
            return fluid.model.accessImpl(root, EL, newValue, config, initSegs, returnSegs, fluid.model.traverseWithStrategy);
        }
    };

    // Implementation notes: The EL path manipulation utilities here are equivalents of the simpler ones
    // that are provided in Fluid.js and elsewhere - they apply escaping rules to parse characters .
    // as \. and \ as \\ - allowing us to process member names containing periods. These versions are mostly
    // in use within model machinery, whereas the cheaper versions based on String.split(".") are mostly used
    // within the IoC machinery.
    // Performance testing in early 2015 suggests that modern browsers now allow these to execute slightly faster
    // than the equivalent machinery written using complex regexps - therefore they will continue to be maintained
    // here. However, there is still a significant performance gap with respect to the performance of String.split(".")
    // especially on Chrome, so we will continue to insist that component member names do not contain a "." character
    // for the time being.
    // See http://jsperf.com/parsing-escaped-el for some experiments

    fluid.registerNamespace("fluid.pathUtil");

    fluid.pathUtil.getPathSegmentImpl = function (accept, path, i) {
        var segment = null;
        if (accept) {
            segment = "";
        }
        var escaped = false;
        var limit = path.length;
        for (; i < limit; ++i) {
            var c = path.charAt(i);
            if (!escaped) {
                if (c === ".") {
                    break;
                }
                else if (c === "\\") {
                    escaped = true;
                }
                else if (segment !== null) {
                    segment += c;
                }
            }
            else {
                escaped = false;
                if (segment !== null) {
                    segment += c;
                }
            }
        }
        if (segment !== null) {
            accept[0] = segment;
        }
        return i;
    };

    var globalAccept = []; // TODO: reentrancy risk here. This holder is here to allow parseEL to make two returns without an allocation.

    /** A version of fluid.model.parseEL that apples escaping rules - this allows path segments
     * to contain period characters . - characters "\" and "}" will also be escaped. WARNING -
     * this current implementation is EXTREMELY slow compared to fluid.model.parseEL and should
     * not be used in performance-sensitive applications */
    // supported, PUBLIC API function
    fluid.pathUtil.parseEL = function (path) {
        var togo = [];
        var index = 0;
        var limit = path.length;
        while (index < limit) {
            var firstdot = fluid.pathUtil.getPathSegmentImpl(globalAccept, path, index);
            togo.push(globalAccept[0]);
            index = firstdot + 1;
        }
        return togo;
    };

    // supported, PUBLIC API function
    fluid.pathUtil.composeSegment = function (prefix, toappend) {
        toappend = toappend.toString();
        for (var i = 0; i < toappend.length; ++i) {
            var c = toappend.charAt(i);
            if (c === "." || c === "\\" || c === "}") {
                prefix += "\\";
            }
            prefix += c;
        }
        return prefix;
    };

    /** Escapes a single path segment by replacing any character ".", "\" or "}" with
     * itself prepended by \
     */
    // supported, PUBLIC API function
    fluid.pathUtil.escapeSegment = function (segment) {
        return fluid.pathUtil.composeSegment("", segment);
    };

    /**
     * Compose a prefix and suffix EL path, where the prefix is already escaped.
     * Prefix may be empty, but not null. The suffix will become escaped.
     */
    // supported, PUBLIC API function
    fluid.pathUtil.composePath = function (prefix, suffix) {
        if (prefix.length !== 0) {
            prefix += ".";
        }
        return fluid.pathUtil.composeSegment(prefix, suffix);
    };

    /**
     * Compose a set of path segments supplied as arguments into an escaped EL expression. Escaped version
     * of fluid.model.composeSegments
     */

    // supported, PUBLIC API function
    fluid.pathUtil.composeSegments = function () {
        var path = "";
        for (var i = 0; i < arguments.length; ++i) {
            path = fluid.pathUtil.composePath(path, arguments[i]);
        }
        return path;
    };

    /** Helpful utility for use in resolvers - matches a path which has already been
     * parsed into segments **/

    fluid.pathUtil.matchSegments = function (toMatch, segs, start, end) {
        if (end - start !== toMatch.length) {
            return false;
        }
        for (var i = start; i < end; ++i) {
            if (segs[i] !== toMatch[i - start]) {
                return false;
            }
        }
        return true;
    };

    fluid.model.unescapedParser = {
        parse: fluid.model.parseEL,
        compose: fluid.model.composeSegments
    };

    // supported, PUBLIC API record
    fluid.model.defaultGetConfig = {
        parser: fluid.model.unescapedParser,
        strategies: [fluid.model.funcResolverStrategy, fluid.model.defaultFetchStrategy]
    };

    // supported, PUBLIC API record
    fluid.model.defaultSetConfig = {
        parser: fluid.model.unescapedParser,
        strategies: [fluid.model.funcResolverStrategy, fluid.model.defaultFetchStrategy, fluid.model.defaultCreatorStrategy]
    };

    fluid.model.escapedParser = {
        parse: fluid.pathUtil.parseEL,
        compose: fluid.pathUtil.composeSegments
    };

    // supported, PUBLIC API record
    fluid.model.escapedGetConfig = {
        parser: fluid.model.escapedParser,
        strategies: [fluid.model.defaultFetchStrategy]
    };

    // supported, PUBLIC API record
    fluid.model.escapedSetConfig = {
        parser: fluid.model.escapedParser,
        strategies: [fluid.model.defaultFetchStrategy, fluid.model.defaultCreatorStrategy]
    };

    /** MODEL COMPONENT HIERARCHY AND RELAY SYSTEM **/

    fluid.initRelayModel = function (that) {
        fluid.deenlistModelComponent(that);
        return that.model;
    };

    // TODO: This utility compensates for our lack of control over "wave of explosions" initialisation - we may
    // catch a model when it is apparently "completely initialised" and that's the best we can do, since we have
    // missed its own initial transaction

    fluid.isModelComplete = function (that) {
        return "model" in that && that.model !== fluid.inEvaluationMarker;
    };

    // Enlist this model component as part of the "initial transaction" wave - note that "special transaction" init
    // is indexed by component, not by applier, and has special record type (complete + initModel), not transaction
    fluid.enlistModelComponent = function (that) {
        var instantiator = fluid.getInstantiator(that);
        var enlist = instantiator.modelTransactions.init[that.id];
        if (!enlist) {
            enlist = {
                that: that,
                applier: fluid.getForComponent(that, "applier"), // required for FLUID-5504 even though currently unused
                complete: fluid.isModelComplete(that)
            };
            instantiator.modelTransactions.init[that.id] = enlist;
        }
        return enlist;
    };

    fluid.clearTransactions = function () {
        var instantiator = fluid.globalInstantiator;
        fluid.clear(instantiator.modelTransactions);
        instantiator.modelTransactions.init = {};
    };

    fluid.failureEvent.addListener(fluid.clearTransactions, "clearTransactions", "before:fail");

    // Utility to coordinate with our crude "oscillation prevention system" which limits each link to 2 updates (presumably
    // in opposite directions). In the case of the initial transaction, we need to reset the count given that genuine
    // changes are arising in the system with each new enlisted model. TODO: if we ever get users operating their own
    // transactions, think of a way to incorporate this into that workflow
    fluid.clearLinkCounts = function (transRec, relaysAlso) {
        // TODO: Separate this record out into different types of records (relays are already in their own area)
        fluid.each(transRec, function (value, key) {
            if (typeof(value) === "number") {
                transRec[key] = 0;
            } else if (relaysAlso && value.options && typeof(value.relayCount) === "number") {
                value.relayCount = 0;
            }
        });
    };

    fluid.sortCompleteLast = function (reca, recb) {
        return (reca.completeOnInit ? 1 : 0) - (recb.completeOnInit ? 1 : 0);
    };

    // Operate all coordinated transactions by bringing models to their respective initial values, and then commit them all
    fluid.operateInitialTransaction = function (that, mrec) {
        var transId = fluid.allocateGuid();
        var transRec = fluid.getModelTransactionRec(that, transId);
        var transac;
        var transacs = fluid.transform(mrec, function (recel) {
            transac = recel.that.applier.initiate(null, "init", transId);
            transRec[recel.that.applier.applierId] = {transaction: transac};
            return transac;
        });
        // TODO: This sort has very little effect in any current test (can be replaced by no-op - see FLUID-5339) - but
        // at least can't be performed in reverse order ("FLUID-3674 event coordination test" will fail) - need more cases
        var recs = fluid.values(mrec).sort(fluid.sortCompleteLast);
        fluid.each(recs, function (recel) {
            var that = recel.that;
            var transac = transacs[that.id];
            if (recel.completeOnInit) {
                fluid.initModelEvent(that, that.applier, transac, that.applier.listeners.sortedListeners);
            } else {
                fluid.each(recel.initModels, function (initModel) {
                    transac.fireChangeRequest({type: "ADD", segs: [], value: initModel});
                    fluid.clearLinkCounts(transRec, true);
                });
            }
            var shadow = fluid.shadowForComponent(that);
            if (shadow) { // Fix for FLUID-5869 - the component may have been destroyed during its own init transaction
                shadow.modelComplete = true; // technically this is a little early, but this flag is only read in fluid.connectModelRelay
            }
        });

        transac.commit(); // committing one representative transaction will commit them all
    };

    // This modelComponent has now concluded initialisation - commit its initialisation transaction if it is the last such in the wave
    fluid.deenlistModelComponent = function (that) {
        var instantiator = fluid.getInstantiator(that);
        var mrec = instantiator.modelTransactions.init;
        if (!mrec[that.id]) { // avoid double evaluation through currently hacked "members" implementation
            return;
        }
        that.model = undefined; // Abuse of the ginger system - in fact it is "currently in evaluation" - we need to return a proper initial model value even if no init occurred yet
        mrec[that.id].complete = true; // flag means - "complete as in ready to participate in this transaction"
        var incomplete = fluid.find_if(mrec, function (recel) {
            return recel.complete !== true;
        });
        if (!incomplete) {
            fluid.operateInitialTransaction(that, mrec);
            // NB: Don't call fluid.concludeTransaction since "init" is not a standard record - this occurs in commitRelays for the corresponding genuine record as usual
            instantiator.modelTransactions.init = {};
        }
    };

    fluid.parseModelReference = function (that, ref) {
        var parsed = fluid.parseContextReference(ref);
        parsed.segs = that.applier.parseEL(parsed.path);
        return parsed;
    };

    /** Given a string which may represent a reference into a model, parses it into a structure holding the coordinates for resolving the reference. It specially
     * detects "references into model material" by looking for the first path segment in the path reference which holds the value "model". Some of its workflow is bypassed
     * in the special case of a reference representing an implicit model relay. In this case, ref will definitely be a String, and if it does not refer to model material, rather than
     * raising an error, the return structure will include a field <code>nonModel: true</code>
     * @param that {Component} The component holding the reference
     * @param name {String} A human-readable string representing the type of block holding the reference - e.g. "modelListeners"
     * @param ref {String|ModelReference} The model reference to be parsed. This may have already been partially parsed at the original site - that is, a ModelReference is a
     * structure containing
     *     segs: {Array of String} An array of model path segments to be dereferenced in the target component (will become `modelSegs` in the final return)
     *     context: {String} An IoC reference to the component holding the model
     * @param implicitRelay {Boolean} <code>true</code> if the reference was being resolved for an implicit model relay - that is,
     * whether it occured within the `model` block itself. In this case, references to non-model material are not a failure and will simply be resolved
     * (by the caller) onto their targets (as constants). Otherwise, this function will issue a failure on discovering a reference to non-model material.
     * @return A structure holding:
     *    that {Component} The component whose model is the target of the reference. This may end up being constructed as part of the act of resolving the reference
     *    applier {Component} The changeApplier for the component <code>that</code>. This may end up being constructed as part of the act of resolving the reference
     *    modelSegs {Array of String} An array of path segments into the model of the component
     *    path {String} the value of <code>modelSegs</code> encoded as an EL path (remove client uses of this in time)
     *    nonModel {Boolean} Set if <code>implicitRelay</code> was true and the reference was not into a model (modelSegs/path will not be set in this case)
     *    segs {Array of String} Holds the full array of path segments found by parsing the original reference - only useful in <code>nonModel</code> case
     */
    fluid.parseValidModelReference = function (that, name, ref, implicitRelay) {
        var reject = function (message) {
            fluid.fail("Error in " + name + ": ", ref, message);
        };
        var parsed; // resolve ref into context and modelSegs
        if (typeof(ref) === "string") {
            if (fluid.isIoCReference(ref)) {
                parsed = fluid.parseModelReference(that, ref);
                var modelPoint = parsed.segs.indexOf("model");
                if (modelPoint === -1) {
                    if (implicitRelay) {
                        parsed.nonModel = true;
                    } else {
                        reject(" must be a reference into a component model via a path including the segment \"model\"");
                    }
                } else {
                    parsed.modelSegs = parsed.segs.slice(modelPoint + 1);
                    parsed.contextSegs = parsed.segs.slice(0, modelPoint);
                    delete parsed.path;
                }

            } else {
                parsed = {
                    path: ref,
                    modelSegs: that.applier.parseEL(ref)
                };
            }
        } else {
            if (!fluid.isArrayable(ref.segs)) {
                reject(" must contain an entry \"segs\" holding path segments referring a model path within a component");
            }
            parsed = {
                context: ref.context,
                modelSegs: fluid.expandOptions(ref.segs, that)
            };
        }
        var target; // resolve target component, which defaults to "that"
        if (parsed.context) {
            target = fluid.resolveContext(parsed.context, that);
            if (!target) {
                reject(" must be a reference to an existing component");
            }
            if (parsed.contextSegs) {
                target = fluid.getForComponent(target, parsed.contextSegs);
            }
        } else {
            target = that;
        }
        if (!parsed.nonModel) {
            if (!target.applier) {
                fluid.getForComponent(target, ["applier"]);
            }
            if (!target.applier) {
                reject(" must be a reference to a component with a ChangeApplier (descended from fluid.modelComponent)");
            }
        }
        parsed.that = target;
        parsed.applier = target.applier;
        if (!parsed.path) { // ChangeToApplicable amongst others rely on this
            parsed.path = target.applier.composeSegments.apply(null, parsed.modelSegs);
        }
        return parsed;
    };

    // Gets global record for a particular transaction id, allocating if necessary - looks up applier id to transaction,
    // as well as looking up source id (linkId in below) to count/true
    // Through poor implementation quality, not every access passes through this function - some look up instantiator.modelTransactions directly
    fluid.getModelTransactionRec = function (that, transId) {
        var instantiator = fluid.getInstantiator(that);
        if (!transId) {
            fluid.fail("Cannot get transaction record without transaction id");
        }
        if (!instantiator) {
            return null;
        }
        var transRec = instantiator.modelTransactions[transId];
        if (!transRec) {
            transRec = instantiator.modelTransactions[transId] = {
                relays: [], // sorted array of relay elements (also appear at top level index by transaction id)
                sources: {}, // hash of the global transaction sources (includes "init" but excludes "relay" and "local")
                externalChanges: {} // index by applierId to changePath to listener record
            };
        }
        return transRec;
    };

    fluid.recordChangeListener = function (component, applier, sourceListener, listenerId) {
        var shadow = fluid.shadowForComponent(component);
        fluid.recordListener(applier.modelChanged, sourceListener, shadow, listenerId);
    };

    fluid.registerRelayTransaction = function (transRec, targetApplier, transId, options, npOptions) {
        var newTrans = targetApplier.initiate("relay", null, transId); // non-top-level transaction will defeat postCommit
        var transEl = transRec[targetApplier.applierId] = {transaction: newTrans, relayCount: 0, namespace: npOptions.namespace, priority: npOptions.priority, options: options};
        transEl.priority = fluid.parsePriority(transEl.priority, transRec.relays.length, false, "model relay");
        transRec.relays.push(transEl);
        return transEl;
    };

    // Configure this parameter to tweak the number of relays the model will attempt per transaction before bailing out with an error
    fluid.relayRecursionBailout = 100;

    // Used with various arg combinations from different sources. For standard "implicit relay" or fully lensed relay,
    // the first 4 args will be set, and "options" will be empty

    // For a model-dependent relay, this will be used in two halves - firstly, all of the model
    // sources will bind to the relay transform document itself. In this case the argument "targetApplier" within "options" will be set.
    // In this case, the component known as "target" is really the source - it is a component reference discovered by parsing the
    // relay document.

    // Secondly, the relay itself will schedule an invalidation (as if receiving change to "*" of its source - which may in most
    // cases actually be empty) and play through its transducer. "Source" component itself is never empty, since it is used for listener
    // degistration on destruction (check this is correct for external model relay). However, "sourceSegs" may be empty in the case
    // there is no "source" component registered for the link. This change is played in a "half-transactional" way - that is, we wait
    // for all other changes in the system to settle before playing the relay document, in order to minimise the chances of multiple
    // firing and corruption. This is done via the "preCommit" hook registered at top level in establishModelRelay. This listener
    // is transactional but it does not require the transaction to conclude in order to fire - it may be reused as many times as
    // required within the "overall" transaction whilst genuine (external) changes continue to arrive.

    // TODO: Vast overcomplication and generation of closure garbage. SURELY we should be able to convert this into an externalised, arg-ist form
    fluid.registerDirectChangeRelay = function (target, targetSegs, source, sourceSegs, linkId, transducer, options, npOptions) {
        var targetApplier = options.targetApplier || target.applier; // implies the target is a relay document
        var sourceApplier = options.sourceApplier || source.applier; // implies the source is a relay document - listener will be transactional
        var applierId = targetApplier.applierId;
        targetSegs = fluid.makeArray(targetSegs);
        sourceSegs = sourceSegs ? fluid.makeArray(sourceSegs) : sourceSegs; // take copies since originals will be trashed
        var sourceListener = function (newValue, oldValue, path, changeRequest, trans, applier) {
            var transId = trans.id;
            var transRec = fluid.getModelTransactionRec(target, transId);
            if (applier && trans && !transRec[applier.applierId]) { // don't trash existing record which may contain "options" (FLUID-5397)
                transRec[applier.applierId] = {transaction: trans}; // enlist the outer user's original transaction
            }
            var existing = transRec[applierId];
            transRec[linkId] = transRec[linkId] || 0;
            // Crude "oscillation prevention" system limits each link to maximum of 2 operations per cycle (presumably in opposite directions)
            var relay = true; // TODO: See FLUID-5303 - we currently disable this check entirely to solve FLUID-5293 - perhaps we might remove link counts entirely
            if (relay) {
                ++transRec[linkId];
                if (transRec[linkId] > fluid.relayRecursionBailout) {
                    fluid.fail("Error in model relay specification at component ", target, " - operated more than " + fluid.relayRecursionBailout + " relays without model value settling - current model contents are ", trans.newHolder.model);
                }
                if (!existing) {
                    existing = fluid.registerRelayTransaction(transRec, targetApplier, transId, options, npOptions);
                }
                if (transducer && !options.targetApplier) {
                    // TODO: This is just for safety but is still unusual and now abused. The transducer doesn't need the "newValue" since all the transform information
                    // has been baked into the transform document itself. However, we now rely on this special signalling value to make sure we regenerate transforms in
                    // the "forwardAdapter"
                    transducer(existing.transaction, options.sourceApplier ? undefined : newValue, sourceSegs, targetSegs);
                } else if (newValue !== undefined) {
                    existing.transaction.fireChangeRequest({type: "ADD", segs: targetSegs, value: newValue});
                }
            }
        };
        var spec;
        if (sourceSegs) {
            spec = sourceApplier.modelChanged.addListener({
                isRelay: true,
                segs: sourceSegs,
                transactional: options.transactional
            }, sourceListener);
            fluid.log(fluid.logLevel.TRACE, "Adding relay listener with listenerId " + spec.listenerId + " to source applier with id " +
                sourceApplier.applierId + " from target applier with id " + applierId + " for target component with id " + target.id);
        }
        if (source) { // TODO - we actually may require to register on THREE sources in the case modelRelay is attached to a
            // component which is neither source nor target. Note there will be problems if source, say, is destroyed and recreated,
            // and holder is not - relay will in that case be lost. Need to integrate relay expressions with IoCSS.
            fluid.recordChangeListener(source, sourceApplier, sourceListener, spec.listenerId);
            if (target !== source) {
                fluid.recordChangeListener(target, sourceApplier, sourceListener, spec.listenerId);
            }
        }
    };

    // When called during parsing a contextualised model relay document, these arguments are reversed - "source" refers to the
    // current component, and "target" refers successively to the various "source" components.
    // "options" will be transformPackage
    fluid.connectModelRelay = function (source, sourceSegs, target, targetSegs, options) {
        var linkId = fluid.allocateGuid();
        function enlistComponent(component) {
            var enlist = fluid.enlistModelComponent(component);

            if (enlist.complete) {
                var shadow = fluid.shadowForComponent(component);
                if (shadow.modelComplete) {
                    enlist.completeOnInit = true;
                }
            }
        }
        enlistComponent(target);
        enlistComponent(source); // role of "source" and "target" may have been swapped in a modelRelay document
        var npOptions = fluid.filterKeys(options, ["namespace", "priority"]);

        if (options.update) { // it is a call via parseImplicitRelay for a relay document
            if (options.targetApplier) {
                // register changes from the model onto changes to the model relay document
                fluid.registerDirectChangeRelay(source, sourceSegs, target, targetSegs, linkId, null, {
                    transactional: false,
                    targetApplier: options.targetApplier,
                    update: options.update
                }, npOptions);
            } else {
                // We are in the middle of parsing a contextualised relay, and this call has arrived via its parseImplicitRelay.
                // Rather than bind source-source, instead register the "half-transactional" listener which binds changes
                // from the relay itself onto the target
                fluid.registerDirectChangeRelay(target, targetSegs, source, [], linkId + "-transform", options.forwardAdapter, {transactional: true, sourceApplier: options.forwardApplier}, npOptions);
            }
        } else { // more efficient branch where relay is uncontextualised
            fluid.registerDirectChangeRelay(target, targetSegs, source, sourceSegs, linkId, options.forwardAdapter, {transactional: false}, npOptions);
            if (sourceSegs) {
                fluid.registerDirectChangeRelay(source, sourceSegs, target, targetSegs, linkId, options.backwardAdapter, {transactional: false}, npOptions);
            }
        }
    };

    fluid.parseSourceExclusionSpec = function (targetSpec, sourceSpec) {
        targetSpec.excludeSource = fluid.arrayToHash(fluid.makeArray(sourceSpec.excludeSource || (sourceSpec.includeSource ? "*" : undefined)));
        targetSpec.includeSource = fluid.arrayToHash(fluid.makeArray(sourceSpec.includeSource));
        return targetSpec;
    };

    fluid.isExcludedChangeSource = function (transaction, spec) {
        if (!spec || !spec.excludeSource) { // mergeModelListeners initModelEvent fabricates a fake spec that bypasses processing
            return false;
        }
        var excluded = spec.excludeSource["*"];
        for (var source in transaction.fullSources) {
            if (spec.excludeSource[source]) {
                excluded = true;
            }
            if (spec.includeSource[source]) {
                excluded = false;
            }
        }
        return excluded;
    };

    fluid.model.guardedAdapter = function (transaction, cond, func, args) {
        if (!fluid.isExcludedChangeSource(transaction, cond)) {
            func.apply(null, args);
        }
    };

    // TODO: This rather crummy function is the only site with a hard use of "path" as String
    fluid.transformToAdapter = function (transform, targetPath) {
        var basedTransform = {};
        basedTransform[targetPath] = transform;
        return function (trans, newValue /*, sourceSegs, targetSegs */) {
            // TODO: More efficient model that can only run invalidated portion of transform (need to access changeMap of source transaction)
            fluid.model.transformWithRules(newValue, basedTransform, {finalApplier: trans});
        };
    };

    // TODO: sourcePath and targetPath should really be converted to segs to avoid excess work in parseValidModelReference
    fluid.makeTransformPackage = function (componentThat, transform, sourcePath, targetPath, forwardCond, backwardCond, namespace, priority) {
        var that = {
            forwardHolder: {model: transform},
            backwardHolder: {model: null}
        };
        that.generateAdapters = function (trans) {
            // can't commit "half-transaction" or events will fire - violate encapsulation in this way
            that.forwardAdapterImpl = fluid.transformToAdapter(trans ? trans.newHolder.model : that.forwardHolder.model, targetPath);
            if (sourcePath !== null) {
                that.backwardHolder.model = fluid.model.transform.invertConfiguration(transform);
                that.backwardAdapterImpl = fluid.transformToAdapter(that.backwardHolder.model, sourcePath);
            }
        };
        that.forwardAdapter = function (transaction, newValue) { // create a stable function reference for this possibly changing adapter
            if (newValue === undefined) {
                that.generateAdapters(); // TODO: Quick fix for incorrect scheduling of invalidation/transducing
                // "it so happens" that fluid.registerDirectChangeRelay invokes us with empty newValue in the case of invalidation -> transduction
            }
            fluid.model.guardedAdapter(transaction, forwardCond, that.forwardAdapterImpl, arguments);
        };
        // fired from fluid.model.updateRelays via invalidator event
        that.runTransform = function (trans) {
            trans.commit(); // this will reach the special "half-transactional listener" registered in fluid.connectModelRelay,
            // branch with options.targetApplier - by committing the transaction, we update the relay document in bulk and then cause
            // it to execute (via "transducer")
            trans.reset();
        };
        that.forwardApplier = fluid.makeHolderChangeApplier(that.forwardHolder);
        that.forwardApplier.isRelayApplier = true; // special annotation so these can be discovered in the transaction record
        that.invalidator = fluid.makeEventFirer({name: "Invalidator for model relay with applier " + that.forwardApplier.applierId});
        if (sourcePath !== null) {
            that.backwardApplier = fluid.makeHolderChangeApplier(that.backwardHolder);
            that.backwardAdapter = function (transaction) {
                fluid.model.guardedAdapter(transaction, backwardCond, that.backwardAdapterImpl, arguments);
            };
        }
        that.update = that.invalidator.fire; // necessary so that both routes to fluid.connectModelRelay from here hit the first branch
        var implicitOptions = {
            targetApplier: that.forwardApplier, // this special field identifies us to fluid.connectModelRelay
            update: that.update,
            namespace: namespace,
            priority: priority,
            refCount: 0
        };
        that.forwardHolder.model = fluid.parseImplicitRelay(componentThat, transform, [], implicitOptions);
        that.refCount = implicitOptions.refCount;
        that.namespace = namespace;
        that.priority = priority;
        that.generateAdapters();
        that.invalidator.addListener(that.generateAdapters);
        that.invalidator.addListener(that.runTransform);
        return that;
    };

    fluid.singleTransformToFull = function (singleTransform) {
        var withPath = $.extend(true, {inputPath: ""}, singleTransform);
        return {
            "": {
                transform: withPath
            }
        };
    };

    // Convert old-style "relay conditions" to source includes/excludes as used in model listeners
    fluid.model.relayConditions = {
        initOnly: {includeSource: "init"},
        liveOnly: {excludeSource: "init"},
        never:    {includeSource: []},
        always:   {}
    };

    fluid.model.parseRelayCondition = function (condition) {
        if (condition === "initOnly") {
            fluid.log(fluid.logLevel.WARN, "The relay condition \"initOnly\" is deprecated: Please use the form 'includeSource: \"init\"' instead");
        } else if (condition === "liveOnly") {
            fluid.log(fluid.logLevel.WARN, "The relay condition \"initOnly\" is deprecated: Please use the form 'excludeSource: \"init\"' instead");
        }
        var exclusionRec;
        if (!condition) {
            exclusionRec = {};
        } else if (typeof(condition) === "string") {
            exclusionRec = fluid.model.relayConditions[condition];
            if (!exclusionRec) {
                fluid.fail("Unrecognised model relay condition string \"" + condition + "\": the supported values are \"never\" or a record with members \"includeSource\" and/or \"excludeSource\"");
            }
        } else {
            exclusionRec = condition;
        }
        return fluid.parseSourceExclusionSpec({}, exclusionRec);
    };

    fluid.parseModelRelay = function (that, mrrec, key) {
        var parsedSource = mrrec.source ? fluid.parseValidModelReference(that, "modelRelay record member \"source\"", mrrec.source) :
            {path: null, modelSegs: null};
        var parsedTarget = fluid.parseValidModelReference(that, "modelRelay record member \"target\"", mrrec.target);
        var namespace = mrrec.namespace || key;

        var transform = mrrec.singleTransform ? fluid.singleTransformToFull(mrrec.singleTransform) : mrrec.transform;
        if (!transform) {
            fluid.fail("Cannot parse modelRelay record without element \"singleTransform\" or \"transform\":", mrrec);
        }
        var forwardCond = fluid.model.parseRelayCondition(mrrec.forward), backwardCond = fluid.model.parseRelayCondition(mrrec.backward);
        var transformPackage = fluid.makeTransformPackage(that, transform, parsedSource.path, parsedTarget.path, forwardCond, backwardCond, namespace, mrrec.priority);
        if (transformPackage.refCount === 0) { // There were no implicit relay elements found in the relay document - it can be relayed directly
            // This first call binds changes emitted from the relay ends to each other, synchronously
            fluid.connectModelRelay(parsedSource.that || that, parsedSource.modelSegs, parsedTarget.that, parsedTarget.modelSegs,
                fluid.filterKeys(transformPackage, ["forwardAdapter", "backwardAdapter", "namespace", "priority"]));
            // Primarily, here, we want to get rid of "update" which is what signals to connectModelRelay that this is a invalidatable relay
        } else {
            if (parsedSource.modelSegs) {
                fluid.fail("Error in model relay definition: If a relay transform has a model dependency, you can not specify a \"source\" entry - please instead enter this as \"input\" in the transform specification. Definition was ", mrrec, " for component ", that);
            }
            // This second call binds changes emitted from the relay document itself onto the relay ends (using the "half-transactional system")
            fluid.connectModelRelay(parsedSource.that || that, parsedSource.modelSegs, parsedTarget.that, parsedTarget.modelSegs, transformPackage);
        }
    };

    fluid.parseImplicitRelay = function (that, modelRec, segs, options) {
        var value;
        if (fluid.isIoCReference(modelRec)) {
            var parsed = fluid.parseValidModelReference(that, "model reference from model (implicit relay)", modelRec, true);
            if (parsed.nonModel) {
                value = fluid.getForComponent(parsed.that, parsed.segs);
            } else {
                ++options.refCount; // This count is used from within fluid.makeTransformPackage
                fluid.connectModelRelay(that, segs, parsed.that, parsed.modelSegs, options);
            }
        } else if (fluid.isPrimitive(modelRec) || !fluid.isPlainObject(modelRec)) {
            value = modelRec;
        } else if (modelRec.expander && fluid.isPlainObject(modelRec.expander)) {
            value = fluid.expandOptions(modelRec, that);
        } else {
            value = fluid.freshContainer(modelRec);
            fluid.each(modelRec, function (innerValue, key) {
                segs.push(key);
                var innerTrans = fluid.parseImplicitRelay(that, innerValue, segs, options);
                if (innerTrans !== undefined) {
                    value[key] = innerTrans;
                }
                segs.pop();
            });
        }
        return value;
    };


    // Conclude the transaction by firing to all external listeners in priority order
    fluid.model.notifyExternal = function (transRec) {
        var allChanges = transRec ? fluid.values(transRec.externalChanges) : [];
        fluid.sortByPriority(allChanges);
        for (var i = 0; i < allChanges.length; ++i) {
            var change = allChanges[i];
            var targetApplier = change.args[5]; // NOTE: This argument gets here via fluid.model.storeExternalChange from fluid.notifyModelChanges
            if (!targetApplier.destroyed) { // 3rd point of guarding for FLUID-5592
                change.listener.apply(null, change.args);
            }
        }
        fluid.clearLinkCounts(transRec, true); // "options" structures for relayCount are aliased
    };

    fluid.model.commitRelays = function (instantiator, transactionId) {
        var transRec = instantiator.modelTransactions[transactionId];
        fluid.each(transRec, function (transEl) {
        // EXPLAIN: This must commit ALL current transactions, not just those for relays - why?
            if (transEl.transaction) { // some entries are links
                transEl.transaction.commit("relay");
                transEl.transaction.reset();
            }
        });
    };

    // Listens to all invalidation to relays, and reruns/applies them if they have been invalidated
    fluid.model.updateRelays = function (instantiator, transactionId) {
        var transRec = instantiator.modelTransactions[transactionId];
        var updates = 0;
        fluid.sortByPriority(transRec.relays);
        fluid.each(transRec.relays, function (transEl) {
            // TODO: We have a bit of a problem here in that we only process updatable relays by priority - plain relays get to act non-transactionally
            if (transEl.transaction.changeRecord.changes > 0 && transEl.relayCount < 2 && transEl.options.update) {
                transEl.relayCount++;
                fluid.clearLinkCounts(transRec);
                transEl.options.update(transEl.transaction, transRec);
                ++updates;
            }
        });
        return updates;
    };

    fluid.establishModelRelay = function (that, optionsModel, optionsML, optionsMR, applier) {
        var shadow = fluid.shadowForComponent(that);
        if (!shadow.modelRelayEstablished) {
            shadow.modelRelayEstablished = true;
        } else {
            fluid.fail("FLUID-5887 failure: Model relay initialised twice on component", that);
        }
        fluid.mergeModelListeners(that, optionsML);

        var enlist = fluid.enlistModelComponent(that);
        fluid.each(optionsMR, function (mrrec, key) {
            for (var i = 0; i < mrrec.length; ++i) {
                fluid.parseModelRelay(that, mrrec[i], key);
            }
        });

        // Note: this particular instance of "refCount" is disused. We only use the count made within fluid.makeTransformPackge
        var initModels = fluid.transform(optionsModel, function (modelRec) {
            return fluid.parseImplicitRelay(that, modelRec, [], {refCount: 0, priority: "first"});
        });
        enlist.initModels = initModels;

        var instantiator = fluid.getInstantiator(that);

        function updateRelays(transaction) {
            while (fluid.model.updateRelays(instantiator, transaction.id) > 0) {} // eslint-disable-line no-empty
        }

        function commitRelays(transaction, applier, code) {
            if (code !== "relay") { // don't commit relays if this commit is already a relay commit
                fluid.model.commitRelays(instantiator, transaction.id);
            }
        }

        function concludeTransaction(transaction, applier, code) {
            if (code !== "relay") {
                fluid.model.notifyExternal(instantiator.modelTransactions[transaction.id]);
                delete instantiator.modelTransactions[transaction.id];
            }
        }

        applier.preCommit.addListener(updateRelays);
        applier.preCommit.addListener(commitRelays);
        applier.postCommit.addListener(concludeTransaction);

        return null;
    };

    // supported, PUBLIC API grade
    fluid.defaults("fluid.modelComponent", {
        gradeNames: ["fluid.component"],
        changeApplierOptions: {
            relayStyle: true,
            cullUnchanged: true
        },
        members: {
            model: "@expand:fluid.initRelayModel({that}, {that}.modelRelay)",
            applier: "@expand:fluid.makeHolderChangeApplier({that}, {that}.options.changeApplierOptions)",
            modelRelay: "@expand:fluid.establishModelRelay({that}, {that}.options.model, {that}.options.modelListeners, {that}.options.modelRelay, {that}.applier)"
        },
        mergePolicy: {
            model: {
                noexpand: true,
                func: fluid.arrayConcatPolicy // TODO: bug here in case a model consists of an array
            },
            modelListeners: fluid.makeMergeListenersPolicy(fluid.arrayConcatPolicy),
            modelRelay: fluid.makeMergeListenersPolicy(fluid.arrayConcatPolicy, true)
        }
    });

    fluid.modelChangedToChange = function (args) {
        return {
            value: args[0],
            oldValue: args[1],
            path: args[2],
            transaction: args[4]
        };
    };

    // Note - has only one call, from resolveModelListener
    fluid.event.invokeListener = function (listener, args, localRecord, mergeRecord) {
        if (typeof(listener) === "string") {
            listener = fluid.event.resolveListener(listener); // just resolves globals
        }
        return listener.apply(null, args, localRecord, mergeRecord); // can be "false apply" that requires extra context for expansion
    };

    fluid.resolveModelListener = function (that, record) {
        var togo = function () {
            if (fluid.isDestroyed(that)) { // first guarding point to resolve FLUID-5592
                return;
            }
            var change = fluid.modelChangedToChange(arguments);
            var args = arguments;
            var localRecord = {change: change, "arguments": args};
            var mergeRecord = {source: Object.keys(change.transaction.sources)}; // cascade for FLUID-5490
            if (record.args) {
                args = fluid.expandOptions(record.args, that, {}, localRecord);
            }
            fluid.event.invokeListener(record.listener, fluid.makeArray(args), localRecord, mergeRecord);
        };
        fluid.event.impersonateListener(record.listener, togo);
        return togo;
    };

    fluid.registerModelListeners = function (that, record, paths, namespace) {
        var func = fluid.resolveModelListener(that, record);
        fluid.each(record.byTarget, function (parsedArray) {
            var parsed = parsedArray[0]; // that, applier are common across all these elements
            var spec = {
                listener: func, // for initModelEvent
                listenerId: fluid.allocateGuid(), // external declarative listeners may often share listener handle, identify here
                segsArray: fluid.getMembers(parsedArray, "modelSegs"),
                pathArray: fluid.getMembers(parsedArray, "path"),
                includeSource: record.includeSource,
                excludeSource: record.excludeSource,
                priority: fluid.expandOptions(record.priority, that),
                transactional: true
            };
            // update "spec" so that we parse priority information just once
            spec = parsed.applier.modelChanged.addListener(spec, func, namespace, record.softNamespace);

            fluid.recordChangeListener(that, parsed.applier, func, spec.listenerId);
            function initModelEvent() {
                if (fluid.isModelComplete(parsed.that)) {
                    var trans = parsed.applier.initiate(null, "init");
                    fluid.initModelEvent(that, parsed.applier, trans, [spec]);
                    trans.commit();
                }
            }
            if (that !== parsed.that && !fluid.isModelComplete(that)) { // TODO: Use FLUID-4883 "latched events" when available
                // Don't confuse the end user by firing their listener before the component is constructed
                // TODO: Better detection than this is requred - we assume that the target component will not be discovered as part
                // of the initial transaction wave, but if it is, it will get a double notification - we really need "wave of explosions"
                // since we are currently too early in initialisation of THIS component in order to tell if other will be found
                // independently.
                var onCreate = fluid.getForComponent(that, ["events", "onCreate"]);
                onCreate.addListener(initModelEvent);
            }
        });
    };

    fluid.mergeModelListeners = function (that, listeners) {
        fluid.each(listeners, function (value, key) {
            if (typeof(value) === "string") {
                value = {
                    funcName: value
                };
            }
            // Bypass fluid.event.dispatchListener by means of "standard = false" and enter our custom workflow including expanding "change":
            var records = fluid.event.resolveListenerRecord(value, that, "modelListeners", null, false).records;
            fluid.each(records, function (record) {
                // Aggregate model listeners into groups referring to the same component target.
                // We do this so that a single entry will appear in its modelListeners so that they may
                // be notified just once per transaction, and also displaced by namespace
                record.byTarget = {};
                var paths = fluid.makeArray(record.path === undefined ? key : record.path);
                fluid.each(paths, function (path) {
                    var parsed = fluid.parseValidModelReference(that, "modelListeners entry", path);
                    fluid.pushArray(record.byTarget, parsed.that.id, parsed);
                });
                var namespace = (record.namespace && !record.softNamespace ? record.namespace : null) || (record.path !== undefined ? key : null);
                fluid.registerModelListeners(that, record, paths, namespace);
            });
        });
    };


    /** CHANGE APPLIER **/

    /** Add a listener to a ChangeApplier event that only acts in the case the event
     * has not come from the specified source (typically ourself)
     * @param modelEvent An model event held by a changeApplier (typically applier.modelChanged)
     * @param path The path specification to listen to
     * @param source The source value to exclude (direct equality used)
     * @param func The listener to be notified of a change
     * @param [eventName] - optional - the event name to be listened to - defaults to "modelChanged"
     * @param [namespace] - optional - the event namespace
     */

    /** Dispatches a list of changes to the supplied applier */
    fluid.fireChanges = function (applier, changes) {
        for (var i = 0; i < changes.length; ++i) {
            applier.fireChangeRequest(changes[i]);
        }
    };

    fluid.model.isChangedPath = function (changeMap, segs) {
        for (var i = 0; i <= segs.length; ++i) {
            if (typeof(changeMap) === "string") {
                return true;
            }
            if (i < segs.length && changeMap) {
                changeMap = changeMap[segs[i]];
            }
        }
        return false;
    };

    fluid.model.setChangedPath = function (options, segs, value) {
        var notePath = function (record) {
            segs.unshift(record);
            fluid.model.setSimple(options, segs, value);
            segs.shift();
        };
        if (!fluid.model.isChangedPath(options.changeMap, segs)) {
            ++options.changes;
            notePath("changeMap");
        }
        if (!fluid.model.isChangedPath(options.deltaMap, segs)) {
            ++options.deltas;
            notePath("deltaMap");
        }
    };

    fluid.model.fetchChangeChildren = function (target, i, segs, source, options) {
        fluid.each(source, function (value, key) {
            segs[i] = key;
            fluid.model.applyChangeStrategy(target, key, i, segs, value, options);
            segs.length = i;
        });
    };

    // Called with two primitives which are compared for equality. This takes account of "floating point slop" to avoid
    // continuing to propagate inverted values as changes
    // TODO: replace with a pluggable implementation
    fluid.model.isSameValue = function (a, b) {
        if (typeof(a) !== "number" || typeof(b) !== "number") {
            return a === b;
        } else {
            // Don't use isNaN because of https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/isNaN#Confusing_special-case_behavior
            if (a === b || a !== a && b !== b) { // Either the same concrete number or both NaN
                return true;
            } else {
                var relError = Math.abs((a - b) / b);
                return relError < 1e-12; // 64-bit floats have approx 16 digits accuracy, this should deal with most reasonable transforms
            }
        }
    };

    fluid.model.applyChangeStrategy = function (target, name, i, segs, source, options) {
        var targetSlot = target[name];
        var sourceCode = fluid.typeCode(source);
        var targetCode = fluid.typeCode(targetSlot);
        var changedValue = fluid.NO_VALUE;
        if (sourceCode === "primitive") {
            if (!fluid.model.isSameValue(targetSlot, source)) {
                changedValue = source;
                ++options.unchanged;
            }
        } else if (targetCode !== sourceCode || sourceCode === "array" && source.length !== targetSlot.length) {
            // RH is not primitive - array or object and mismatching or any array rewrite
            changedValue = fluid.freshContainer(source);
        }
        if (changedValue !== fluid.NO_VALUE) {
            target[name] = changedValue;
            if (options.changeMap) {
                fluid.model.setChangedPath(options, segs, options.inverse ? "DELETE" : "ADD");
            }
        }
        if (sourceCode !== "primitive") {
            fluid.model.fetchChangeChildren(target[name], i + 1, segs, source, options);
        }
    };

    fluid.model.stepTargetAccess = function (target, type, segs, startpos, endpos, options) {
        for (var i = startpos; i < endpos; ++i) {
            if (!target) {
                continue;
            }
            var oldTrunk = target[segs[i]];
            target = fluid.model.traverseWithStrategy(target, segs, i, options[type === "ADD" ? "resolverSetConfig" : "resolverGetConfig"],
                segs.length - i - 1);
            if (oldTrunk !== target && options.changeMap) {
                fluid.model.setChangedPath(options, segs.slice(0, i + 1), "ADD");
            }
        }
        return {root: target, last: segs[endpos]};
    };

    fluid.model.defaultAccessorConfig = function (options) {
        options = options || {};
        options.resolverSetConfig = options.resolverSetConfig || fluid.model.escapedSetConfig;
        options.resolverGetConfig = options.resolverGetConfig || fluid.model.escapedGetConfig;
        return options;
    };

    // Changes: "MERGE" action abolished
    // ADD/DELETE at root can be destructive
    // changes tracked in optional final argument holding "changeMap: {}, changes: 0, unchanged: 0"
    fluid.model.applyHolderChangeRequest = function (holder, request, options) {
        options = fluid.model.defaultAccessorConfig(options);
        options.deltaMap = options.changeMap ? {} : null;
        options.deltas = 0;
        var length = request.segs.length;
        var pen, atRoot = length === 0;
        if (atRoot) {
            pen = {root: holder, last: "model"};
        } else {
            if (!holder.model) {
                holder.model = {};
                fluid.model.setChangedPath(options, [], options.inverse ? "DELETE" : "ADD");
            }
            pen = fluid.model.stepTargetAccess(holder.model, request.type, request.segs, 0, length - 1, options);
        }
        if (request.type === "ADD") {
            var value = request.value;
            var segs = fluid.makeArray(request.segs);
            fluid.model.applyChangeStrategy(pen.root, pen.last, length - 1, segs, value, options, atRoot);
        } else if (request.type === "DELETE") {
            if (pen.root && pen.root[pen.last] !== undefined) {
                delete pen.root[pen.last];
                if (options.changeMap) {
                    fluid.model.setChangedPath(options, request.segs, "DELETE");
                }
            }
        } else {
            fluid.fail("Unrecognised change type of " + request.type);
        }
        return options.deltas ? options.deltaMap : null;
    };

    /** Compare two models for equality using a deep algorithm. It is assumed that both models are JSON-equivalent and do
     * not contain circular links.
     * @param modela The first model to be compared
     * @param modelb The second model to be compared
     * @param options {Object} If supplied, will receive a map and summary of the change content between the objects. Structure is:
     *     changeMap: {Object/String} An isomorphic map of the object structures to values "ADD" or "DELETE" indicating
     * that values have been added/removed at that location. Note that in the case the object structure differs at the root, <code>changeMap</code> will hold
     * the plain String value "ADD" or "DELETE"
     *     changes: {Integer} Counts the number of changes between the objects - The two objects are identical iff <code>changes === 0</code>.
     *     unchanged: {Integer} Counts the number of leaf (primitive) values at which the two objects are identical. Note that the current implementation will
     * double-count, this summary should be considered indicative rather than precise.
     * @return <code>true</code> if the models are identical
     */
    // TODO: This algorithm is quite inefficient in that both models will be copied once each
    // supported, PUBLIC API function
    fluid.model.diff = function (modela, modelb, options) {
        options = options || {changes: 0, unchanged: 0, changeMap: {}}; // current algorithm can't avoid the expense of changeMap
        var typea = fluid.typeCode(modela);
        var typeb = fluid.typeCode(modelb);
        var togo;
        if (typea === "primitive" && typeb === "primitive") {
            togo = fluid.model.isSameValue(modela, modelb);
        } else if (typea === "primitive" ^ typeb === "primitive") {
            togo = false;
        } else {
            // Apply both forward and reverse changes - if no changes either way, models are identical
            // "ADD" reported in the reverse direction must be accounted as a "DELETE"
            var holdera = {
                model: fluid.copy(modela)
            };
            fluid.model.applyHolderChangeRequest(holdera, {value: modelb, segs: [], type: "ADD"}, options);
            var holderb = {
                model: fluid.copy(modelb)
            };
            options.inverse = true;
            fluid.model.applyHolderChangeRequest(holderb, {value: modela, segs: [], type: "ADD"}, options);
            togo = options.changes === 0;
        }
        if (togo === false && options.changes === 0) { // catch all primitive cases
            options.changes = 1;
            options.changeMap = modelb === undefined ? "DELETE" : "ADD";
        } else if (togo === true && options.unchanged === 0) {
            options.unchanged = 1;
        }
        return togo;
    };

    // Here we only support for now very simple expressions which have at most one
    // wildcard which must appear in the final segment
    fluid.matchChanges = function (changeMap, specSegs, newHolder) {
        var root = newHolder.model;
        var map = changeMap;
        var outSegs = ["model"];
        var wildcard = false;
        var togo = [];
        for (var i = 0; i < specSegs.length; ++i) {
            var seg = specSegs[i];
            if (seg === "*") {
                if (i === specSegs.length - 1) {
                    wildcard = true;
                } else {
                    fluid.fail("Wildcard specification in modelChanged listener is only supported for the final path segment: " + specSegs.join("."));
                }
            } else {
                outSegs.push(seg);
                map = fluid.isPrimitive(map) ? map : map[seg];
                root = root ? root[seg] : undefined;
            }
        }
        if (map) {
            if (wildcard) {
                fluid.each(root, function (value, key) {
                    togo.push(outSegs.concat(key));
                });
            } else {
                togo.push(outSegs);
            }
        }
        return togo;
    };

    fluid.storeExternalChange = function (transRec, applier, invalidPath, spec, args) {
        var pathString = applier.composeSegments.apply(null, invalidPath);
        var keySegs = [applier.holder.id, spec.listenerId, (spec.wildcard ? pathString : "")];
        var keyString = keySegs.join("|");
        // TODO: We think we probably have a bug in that notifications destined for end of transaction are actually continuously emitted during the transaction
        // These are unbottled in fluid.concludeTransaction
        transRec.externalChanges[keyString] = {listener: spec.listener, namespace: spec.namespace, priority: spec.priority, args: args};
    };

    fluid.notifyModelChanges = function (listeners, changeMap, newHolder, oldHolder, changeRequest, transaction, applier, that) {
        if (!listeners) {
            return;
        }
        var transRec = transaction && fluid.getModelTransactionRec(that, transaction.id);
        for (var i = 0; i < listeners.length; ++i) {
            var spec = listeners[i];
            var multiplePaths = spec.segsArray.length > 1; // does this spec listen on multiple paths? If so, don't rebase arguments and just report once per transaction
            for (var j = 0; j < spec.segsArray.length; ++j) {
                var invalidPaths = fluid.matchChanges(changeMap, spec.segsArray[j], newHolder);
                // We only have multiple invalidPaths here if there is a wildcard
                for (var k = 0; k < invalidPaths.length; ++k) {
                    if (applier.destroyed) { // 2nd guarding point for FLUID-5592
                        return;
                    }
                    var invalidPath = invalidPaths[k];
                    spec.listener = fluid.event.resolveListener(spec.listener);
                    var args = [multiplePaths ? newHolder.model : fluid.model.getSimple(newHolder, invalidPath),
                                multiplePaths ? oldHolder.model : fluid.model.getSimple(oldHolder, invalidPath),
                                multiplePaths ? [] : invalidPath.slice(1), changeRequest, transaction, applier];
                    // FLUID-5489: Do not notify of null changes which were reported as a result of invalidating a higher path
                    // TODO: We can improve greatly on efficiency by i) reporting a special code from fluid.matchChanges which signals the difference between invalidating a higher and lower path,
                    // ii) improving fluid.model.diff to create fewer intermediate structures and no copies
                    // TODO: The relay invalidation system is broken and must always be notified (branch 1) - since our old/new value detection is based on the wrong (global) timepoints in the transaction here,
                    // rather than the "last received model" by the holder of the transform document
                    if (!spec.isRelay) {
                        var isNull = fluid.model.diff(args[0], args[1]);
                        if (isNull) {
                            continue;
                        }
                        var sourceExcluded = fluid.isExcludedChangeSource(transaction, spec);
                        if (sourceExcluded) {
                            continue;
                        }
                    }
                    if (transRec && !spec.isRelay && spec.transactional) { // bottle up genuine external changes so we can sort and dedupe them later
                        fluid.storeExternalChange(transRec, applier, invalidPath, spec, args);
                    } else {
                        spec.listener.apply(null, args);
                    }
                }
            }
        }
    };

    fluid.bindELMethods = function (applier) {
        applier.parseEL = function (EL) {
            return fluid.model.pathToSegments(EL, applier.options.resolverSetConfig);
        };
        applier.composeSegments = function () {
            return applier.options.resolverSetConfig.parser.compose.apply(null, arguments);
        };
    };

    fluid.initModelEvent = function (that, applier, trans, listeners) {
        fluid.notifyModelChanges(listeners, "ADD", trans.oldHolder, fluid.emptyHolder, null, trans, applier, that);
    };

    // A standard "empty model" for the purposes of comparing initial state during the primordial transaction
    fluid.emptyHolder = fluid.freezeRecursive({ model: undefined });

    fluid.preFireChangeRequest = function (applier, changeRequest) {
        if (!changeRequest.type) {
            changeRequest.type = "ADD";
        }
        changeRequest.segs = changeRequest.segs || applier.parseEL(changeRequest.path);
    };

    // Automatically adapts change onto fireChangeRequest
    fluid.bindRequestChange = function (that) {
        that.change = function (path, value, type, source) {
            var changeRequest = {
                path: path,
                value: value,
                type: type,
                source: source
            };
            that.fireChangeRequest(changeRequest);
        };
    };

    // Quick n dirty test to cheaply detect Object versus other JSON types
    fluid.isObjectSimple = function (totest) {
        return Object.prototype.toString.call(totest) === "[object Object]";
    };

    fluid.mergeChangeSources = function (target, globalSources) {
        if (fluid.isObjectSimple(globalSources)) { // TODO: No test for this branch!
            fluid.extend(target, globalSources);
        } else {
            fluid.each(fluid.makeArray(globalSources), function (globalSource) {
                target[globalSource] = true;
            });
        }
    };

    fluid.ChangeApplier = function () {};

    fluid.makeHolderChangeApplier = function (holder, options) {
        options = fluid.model.defaultAccessorConfig(options);
        var applierId = fluid.allocateGuid();
        var that = new fluid.ChangeApplier();
        var name = fluid.isComponent(holder) ? "ChangeApplier for component " + fluid.dumpThat(holder) : "ChangeApplier with id " + applierId;
        $.extend(that, {
            applierId: applierId,
            holder: holder,
            listeners: fluid.makeEventFirer({name: "Internal change listeners for " + name}),
            transListeners: fluid.makeEventFirer({name: "External change listeners for " + name}),
            options: options,
            modelChanged: {},
            preCommit: fluid.makeEventFirer({name: "preCommit event for " + name}),
            postCommit: fluid.makeEventFirer({name: "postCommit event for " + name})
        });
        that.destroy = function () {
            that.preCommit.destroy();
            that.postCommit.destroy();
            that.destroyed = true;
        };
        that.modelChanged.addListener = function (spec, listener, namespace, softNamespace) {
            if (typeof(spec) === "string") {
                spec = {
                    path: spec
                };
            } else {
                spec = fluid.copy(spec);
            }
            spec.listenerId = spec.listenerId || fluid.allocateGuid(); // FLUID-5151: don't use identifyListener since event.addListener will use this as a namespace
            spec.namespace = namespace;
            spec.softNamespace = softNamespace;
            if (typeof(listener) === "string") { // The reason for "globalName" is so that listener names can be resolved on first use and not on registration
                listener = {globalName: listener};
            }
            spec.listener = listener;
            if (spec.transactional !== false) {
                spec.transactional = true;
            }
            if (!spec.segsArray) { // It's a manual registration
                if (spec.path !== undefined) {
                    spec.segs = spec.segs || that.parseEL(spec.path);
                }
                if (!spec.segsArray) {
                    spec.segsArray = [spec.segs];
                }
            }
            fluid.parseSourceExclusionSpec(spec, spec);
            spec.wildcard = fluid.accumulate(fluid.transform(spec.segsArray, function (segs) {
                return fluid.contains(segs, "*");
            }), fluid.add, 0);
            if (spec.wildcard && spec.segsArray.length > 1) {
                fluid.fail("Error in model listener specification ", spec, " - you may not supply a wildcard pattern as one of a set of multiple paths to be matched");
            }
            var firer = that[spec.transactional ? "transListeners" : "listeners"];
            firer.addListener(spec);
            return spec; // return is used in registerModelListeners
        };
        that.modelChanged.removeListener = function (listener) {
            that.listeners.removeListener(listener);
            that.transListeners.removeListener(listener);
        };
        that.fireChangeRequest = function (changeRequest) {
            var ation = that.initiate("local", changeRequest.source);
            ation.fireChangeRequest(changeRequest);
            ation.commit();
        };
        /**
         * Initiate a fresh transaction on this applier, perhaps coordinated with other transactions sharing the same id across the component tree
         * Arguments all optional
         * localSource {String}: "local", "relay" or null Local source identifiers only good for transaction's representative on this applier
         *  globalSources: {String|Array of String|Object String->true} Global source identifiers common across this transaction
         *  transactionId: {String} Global transaction id to enlist with
         */
        that.initiate = function (localSource, globalSources, transactionId) {
            localSource = globalSources === "init" ? null : (localSource || "local"); // supported values for localSource are "local" and "relay" - globalSource of "init" defeats defaulting of localSource to "local"
            var defeatPost = localSource === "relay"; // defeatPost is supplied for all non-top-level transactions
            var trans = {
                instanceId: fluid.allocateGuid(), // for debugging only - the representative of this transction on this applier
                id: transactionId || fluid.allocateGuid(), // The global transaction id across all appliers - allocate here if this is the starting point
                changeRecord: {
                    resolverSetConfig: options.resolverSetConfig, // here to act as "options" in applyHolderChangeRequest
                    resolverGetConfig: options.resolverGetConfig
                },
                reset: function () {
                    trans.oldHolder = holder;
                    trans.newHolder = { model: fluid.copy(holder.model) };
                    trans.changeRecord.changes = 0;
                    trans.changeRecord.unchanged = 0; // just for type consistency - we don't use these values in the ChangeApplier
                    trans.changeRecord.changeMap = {};
                },
                commit: function (code) {
                    that.preCommit.fire(trans, that, code);
                    if (trans.changeRecord.changes > 0) {
                        var oldHolder = {model: holder.model};
                        holder.model = trans.newHolder.model;
                        fluid.notifyModelChanges(that.transListeners.sortedListeners, trans.changeRecord.changeMap, holder, oldHolder, null, trans, that, holder);
                    }
                    if (!defeatPost) {
                        that.postCommit.fire(trans, that, code);
                    }
                },
                fireChangeRequest: function (changeRequest) {
                    fluid.preFireChangeRequest(that, changeRequest);
                    changeRequest.transactionId = trans.id;
                    var deltaMap = fluid.model.applyHolderChangeRequest(trans.newHolder, changeRequest, trans.changeRecord);
                    fluid.notifyModelChanges(that.listeners.sortedListeners, deltaMap, trans.newHolder, holder, changeRequest, trans, that, holder);
                },
                hasChangeSource: function (source) {
                    return trans.fullSources[source];
                }
            };
            var transRec = fluid.getModelTransactionRec(holder, trans.id);
            if (transRec) {
                fluid.mergeChangeSources(transRec.sources, globalSources);
                trans.sources = transRec.sources;
                trans.fullSources = Object.create(transRec.sources);
                trans.fullSources[localSource] = true;
            }
            trans.reset();
            fluid.bindRequestChange(trans);
            return trans;
        };

        fluid.bindRequestChange(that);
        fluid.bindELMethods(that);
        return that;
    };

})(jQuery, fluid_2_0_0);
;
/*
Copyright 2010 University of Toronto
Copyright 2010-2011 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

var fluid_2_0_0 = fluid_2_0_0 || {};
var fluid = fluid || fluid_2_0_0;

(function ($, fluid) {
    "use strict";

    fluid.registerNamespace("fluid.model.transform");

    /** Grade definitions for standard transformation function hierarchy **/

    fluid.defaults("fluid.transformFunction", {
        gradeNames: "fluid.function"
    });

    // uses standard layout and workflow involving inputPath - an undefined input value
    // will short-circuit the evaluation
    fluid.defaults("fluid.standardInputTransformFunction", {
        gradeNames: "fluid.transformFunction"
    });

    fluid.defaults("fluid.standardOutputTransformFunction", {
        gradeNames: "fluid.transformFunction"
    });

    // defines a set of options "inputVariables" referring to its inputs, which are converted
    // to functions that the transform may explicitly use to demand the input value
    fluid.defaults("fluid.multiInputTransformFunction", {
        gradeNames: "fluid.transformFunction"
    });

    // uses the standard layout and workflow involving inputPath and outputPath
    fluid.defaults("fluid.standardTransformFunction", {
        gradeNames: ["fluid.standardInputTransformFunction", "fluid.standardOutputTransformFunction"]
    });

    fluid.defaults("fluid.lens", {
        gradeNames: "fluid.transformFunction",
        invertConfiguration: null
        // this function method returns "inverted configuration" rather than actually performing inversion
        // TODO: harmonise with strategy used in VideoPlayer_framework.js
    });

    /***********************************
     * Base utilities for transformers *
     ***********************************/

    // unsupported, NON-API function
    fluid.model.transform.pathToRule = function (inputPath) {
        return {
            transform: {
                type: "fluid.transforms.value",
                inputPath: inputPath
            }
        };
    };

    // unsupported, NON-API function
    fluid.model.transform.literalValueToRule = function (input) {
        return {
            transform: {
                type: "fluid.transforms.literalValue",
                input: input
            }
        };
    };

    /** Accepts two fully escaped paths, either of which may be empty or null **/
    fluid.model.composePaths = function (prefix, suffix) {
        prefix = prefix === 0 ? "0" : prefix || "";
        suffix = suffix === 0 ? "0" : suffix || "";
        return !prefix ? suffix : (!suffix ? prefix : prefix + "." + suffix);
    };

    fluid.model.transform.accumulateInputPath = function (inputPath, transformer, paths) {
        if (inputPath !== undefined) {
            paths.push(fluid.model.composePaths(transformer.inputPrefix, inputPath));
        }
    };

    fluid.model.transform.accumulateStandardInputPath = function (input, transformSpec, transformer, paths) {
        fluid.model.transform.getValue(undefined, transformSpec[input], transformer);
        fluid.model.transform.accumulateInputPath(transformSpec[input + "Path"], transformer, paths);
    };

    fluid.model.transform.accumulateMultiInputPaths = function (inputVariables, transformSpec, transformer, paths) {
        fluid.each(inputVariables, function (v, k) {
            fluid.model.transform.accumulateStandardInputPath(k, transformSpec, transformer, paths);
        });
    };

    fluid.model.transform.getValue = function (inputPath, value, transformer) {
        var togo;
        if (inputPath !== undefined) { // NB: We may one day want to reverse the crazy jQuery-like convention that "no path means root path"
            togo = fluid.get(transformer.source, fluid.model.composePaths(transformer.inputPrefix, inputPath), transformer.resolverGetConfig);
        }
        if (togo === undefined) {
            // FLUID-5867 - actually helpful behaviour here rather than the insane original default of expecting a short-form value document
            togo = fluid.isPrimitive(value) ? value :
                ("literalValue" in value ? value.literalValue :
                (value.transform === undefined ? value : transformer.expand(value)));
        }
        return togo;
    };

    // distinguished value which indicates that a transformation rule supplied a
    // non-default output path, and so the user should be prevented from making use of it
    // in a compound transform definition
    fluid.model.transform.NONDEFAULT_OUTPUT_PATH_RETURN = {};

    fluid.model.transform.setValue = function (userOutputPath, value, transformer) {
        // avoid crosslinking to input object - this might be controlled by a "nocopy" option in future
        var toset = fluid.copy(value);
        var outputPath = fluid.model.composePaths(transformer.outputPrefix, userOutputPath);
        // TODO: custom resolver config here to create non-hash output model structure
        if (toset !== undefined) {
            transformer.applier.change(outputPath, toset);
        }
        return userOutputPath ? fluid.model.transform.NONDEFAULT_OUTPUT_PATH_RETURN : toset;
    };

    /* Resolves the <key> given as parameter by looking up the path <key>Path in the object
     * to be transformed. If not present, it resolves the <key> by using the literal value if primitive,
     * or expanding otherwise. <def> defines the default value if unableto resolve the key. If no
     * default value is given undefined is returned
     */
    fluid.model.transform.resolveParam = function (transformSpec, transformer, key, def) {
        var val = fluid.model.transform.getValue(transformSpec[key + "Path"], transformSpec[key], transformer);
        return (val !== undefined) ? val : def;
    };

    // Compute a "match score" between two pieces of model material, with 0 indicating a complete mismatch, and
    // higher values indicating increasingly good matches
    fluid.model.transform.matchValue = function (expected, actual, partialMatches) {
        var stats = {changes: 0, unchanged: 0, changeMap: {}};
        fluid.model.diff(expected, actual, stats);
        // i) a pair with 0 matches counts for 0 in all cases
        // ii) without "partial match mode" (the default), we simply count matches, with any mismatch giving 0
        // iii) with "partial match mode", a "perfect score" in the top 24 bits is
        // penalised for each mismatch, with a positive score of matches store in the bottom 24 bits
        return stats.unchanged === 0 ? 0
            : (partialMatches ? 0xffffff000000 - 0x1000000 * stats.changes + stats.unchanged :
            (stats.changes ? 0 : 0xffffff000000 + stats.unchanged));
    };

    fluid.firstDefined = function (a, b) {
        return a === undefined ? b : a;
    };

    fluid.model.transform.invertPaths = function (transformSpec, transformer) {
        // TODO: this will not behave correctly in the face of compound "input" which contains
        // further transforms
        var oldOutput = fluid.model.composePaths(transformer.outputPrefix, transformSpec.outputPath);
        transformSpec.outputPath = fluid.model.composePaths(transformer.inputPrefix, transformSpec.inputPath);
        transformSpec.inputPath = oldOutput;
        return transformSpec;
    };


    // TODO: prefixApplier is a transform which is currently unused and untested
    fluid.model.transform.prefixApplier = function (transformSpec, transformer) {
        if (transformSpec.inputPrefix) {
            transformer.inputPrefixOp.push(transformSpec.inputPrefix);
        }
        if (transformSpec.outputPrefix) {
            transformer.outputPrefixOp.push(transformSpec.outputPrefix);
        }
        transformer.expand(transformSpec.input);
        if (transformSpec.inputPrefix) {
            transformer.inputPrefixOp.pop();
        }
        if (transformSpec.outputPrefix) {
            transformer.outputPrefixOp.pop();
        }
    };

    fluid.defaults("fluid.model.transform.prefixApplier", {
        gradeNames: ["fluid.transformFunction"]
    });

    // unsupported, NON-API function
    fluid.model.makePathStack = function (transform, prefixName) {
        var stack = transform[prefixName + "Stack"] = [];
        transform[prefixName] = "";
        return {
            push: function (prefix) {
                var newPath = fluid.model.composePaths(transform[prefixName], prefix);
                stack.push(transform[prefixName]);
                transform[prefixName] = newPath;
            },
            pop: function () {
                transform[prefixName] = stack.pop();
            }
        };
    };

    // unsupported, NON-API function
    fluid.model.transform.doTransform = function (transformSpec, transformer, transformOpts) {
        var expdef = transformOpts.defaults;
        var transformFn = fluid.getGlobalValue(transformOpts.typeName);
        if (typeof(transformFn) !== "function") {
            fluid.fail("Transformation record specifies transformation function with name " +
                transformSpec.type + " which is not a function - ", transformFn);
        }
        if (!fluid.hasGrade(expdef, "fluid.transformFunction")) {
            // If no suitable grade is set up, assume that it is intended to be used as a standardTransformFunction
            expdef = fluid.defaults("fluid.standardTransformFunction");
        }
        var transformArgs = [transformSpec, transformer];
        if (fluid.hasGrade(expdef, "fluid.multiInputTransformFunction")) {
            var inputs = {};
            fluid.each(expdef.inputVariables, function (v, k) {
                inputs[k] = function () {
                    var input = fluid.model.transform.getValue(transformSpec[k + "Path"], transformSpec[k], transformer);
                    // TODO: This is a mess, null might perfectly well be a possible default
                    // if no match, assign default if one exists (v != null)
                    input = (input === undefined && v !== null) ? v : input;
                    return input;
                };
            });
            transformArgs.unshift(inputs);
        }
        if (fluid.hasGrade(expdef, "fluid.standardInputTransformFunction")) {
            if (!("input" in transformSpec) && !("inputPath" in transformSpec)) {
                fluid.fail("Error in transform specification. Either \"input\" or \"inputPath\" must be specified for a standardInputTransformFunction: received ", transformSpec);
            }
            var expanded = fluid.model.transform.getValue(transformSpec.inputPath, transformSpec.input, transformer);

            transformArgs.unshift(expanded);
            // if the function has no input, the result is considered undefined, and this is returned
            if (expanded === undefined) {
                return undefined;
            }
        }
        var transformed = transformFn.apply(null, transformArgs);
        if (fluid.hasGrade(expdef, "fluid.standardOutputTransformFunction")) {
            // "doOutput" flag is currently set nowhere, but could be used in future
            var outputPath = transformSpec.outputPath !== undefined ? transformSpec.outputPath : (transformOpts.doOutput ? "" : undefined);
            if (outputPath !== undefined && transformed !== undefined) {
                //If outputPath is given in the expander we want to:
                // (1) output to the document
                // (2) return undefined, to ensure that expanders higher up in the hierarchy doesn't attempt to output it again
                fluid.model.transform.setValue(transformSpec.outputPath, transformed, transformer);
                transformed = undefined;
            }
        }
        return transformed;
    };

    // OLD PATHUTIL utilities: Rescued from old DataBinding implementation to support obsolete "schema" scheme for transforms - all of this needs to be rethought
    var globalAccept = [];

    fluid.registerNamespace("fluid.pathUtil");

    /** Parses a path segment, following escaping rules, starting from character index i in the supplied path */
    fluid.pathUtil.getPathSegment = function (path, i) {
        fluid.pathUtil.getPathSegmentImpl(globalAccept, path, i);
        return globalAccept[0];
    };
    /** Returns just the head segment of an EL path */
    fluid.pathUtil.getHeadPath = function (path) {
        return fluid.pathUtil.getPathSegment(path, 0);
    };

    /** Returns all of an EL path minus its first segment - if the path consists of just one segment, returns "" */
    fluid.pathUtil.getFromHeadPath = function (path) {
        var firstdot = fluid.pathUtil.getPathSegmentImpl(null, path, 0);
        return firstdot === path.length ? "" : path.substring(firstdot + 1);
    };
    /** Determines whether a particular EL path matches a given path specification.
     * The specification consists of a path with optional wildcard segments represented by "*".
     * @param spec (string) The specification to be matched
     * @param path (string) The path to be tested
     * @param exact (boolean) Whether the path must exactly match the length of the specification in
     * terms of path segments in order to count as match. If exact is falsy, short specifications will
     * match all longer paths as if they were padded out with "*" segments
     * @return (array of string) The path segments which matched the specification, or <code>null</code> if there was no match
     */

    fluid.pathUtil.matchPath = function (spec, path, exact) {
        var togo = [];
        while (true) {
            if (((path === "") ^ (spec === "")) && exact) {
                return null;
            }
            // FLUID-4625 - symmetry on spec and path is actually undesirable, but this
            // quickly avoids at least missed notifications - improved (but slower)
            // implementation should explode composite changes
            if (!spec || !path) {
                break;
            }
            var spechead = fluid.pathUtil.getHeadPath(spec);
            var pathhead = fluid.pathUtil.getHeadPath(path);
            // if we fail to match on a specific component, fail.
            if (spechead !== "*" && spechead !== pathhead) {
                return null;
            }
            togo.push(pathhead);
            spec = fluid.pathUtil.getFromHeadPath(spec);
            path = fluid.pathUtil.getFromHeadPath(path);
        }
        return togo;
    };

    // unsupported, NON-API function
    fluid.model.transform.expandWildcards = function (transformer, source) {
        fluid.each(source, function (value, key) {
            var q = transformer.queuedTransforms;
            transformer.pathOp.push(fluid.pathUtil.escapeSegment(key.toString()));
            for (var i = 0; i < q.length; ++i) {
                if (fluid.pathUtil.matchPath(q[i].matchPath, transformer.path, true)) {
                    var esCopy = fluid.copy(q[i].transformSpec);
                    if (esCopy.inputPath === undefined || fluid.model.transform.hasWildcard(esCopy.inputPath)) {
                        esCopy.inputPath = "";
                    }
                    // TODO: allow some kind of interpolation for output path
                    // TODO: Also, we now require outputPath to be specified in these cases for output to be produced as well.. Is that something we want to continue with?
                    transformer.inputPrefixOp.push(transformer.path);
                    transformer.outputPrefixOp.push(transformer.path);
                    var transformOpts = fluid.model.transform.lookupType(esCopy.type);
                    var result = fluid.model.transform.doTransform(esCopy, transformer, transformOpts);
                    if (result !== undefined) {
                        fluid.model.transform.setValue(null, result, transformer);
                    }
                    transformer.outputPrefixOp.pop();
                    transformer.inputPrefixOp.pop();
                }
            }
            if (!fluid.isPrimitive(value)) {
                fluid.model.transform.expandWildcards(transformer, value);
            }
            transformer.pathOp.pop();
        });
    };

    // unsupported, NON-API function
    fluid.model.transform.hasWildcard = function (path) {
        return typeof(path) === "string" && path.indexOf("*") !== -1;
    };

    // unsupported, NON-API function
    fluid.model.transform.maybePushWildcard = function (transformSpec, transformer) {
        var hw = fluid.model.transform.hasWildcard;
        var matchPath;
        if (hw(transformSpec.inputPath)) {
            matchPath = fluid.model.composePaths(transformer.inputPrefix, transformSpec.inputPath);
        }
        else if (hw(transformer.outputPrefix) || hw(transformSpec.outputPath)) {
            matchPath = fluid.model.composePaths(transformer.outputPrefix, transformSpec.outputPath);
        }

        if (matchPath) {
            transformer.queuedTransforms.push({transformSpec: transformSpec, outputPrefix: transformer.outputPrefix, inputPrefix: transformer.inputPrefix, matchPath: matchPath});
            return true;
        }
        return false;
    };

    fluid.model.sortByKeyLength = function (inObject) {
        var keys = fluid.keys(inObject);
        return keys.sort(fluid.compareStringLength(true));
    };

    // Three handler functions operating the (currently) three different processing modes
    // unsupported, NON-API function
    fluid.model.transform.handleTransformStrategy = function (transformSpec, transformer, transformOpts) {
        if (fluid.model.transform.maybePushWildcard(transformSpec, transformer)) {
            return;
        }
        else {
            return fluid.model.transform.doTransform(transformSpec, transformer, transformOpts);
        }
    };
    // unsupported, NON-API function
    fluid.model.transform.handleInvertStrategy = function (transformSpec, transformer, transformOpts) {
        transformSpec = fluid.copy(transformSpec);
        // if we have a standardTransformFunction we can switch input and output arguments:
        if (fluid.hasGrade(transformOpts.defaults, "fluid.standardTransformFunction")) {
            transformSpec = fluid.model.transform.invertPaths(transformSpec, transformer);
        }
        var invertor = transformOpts.defaults && transformOpts.defaults.invertConfiguration;
        if (invertor) {
            var inverted = fluid.invokeGlobalFunction(invertor, [transformSpec, transformer]);
            transformer.inverted.push(inverted);
        }
    };

    // unsupported, NON-API function
    fluid.model.transform.handleCollectStrategy = function (transformSpec, transformer, transformOpts) {
        var defaults = transformOpts.defaults;
        var standardInput = fluid.hasGrade(defaults, "fluid.standardInputTransformFunction");
        var multiInput = fluid.hasGrade(defaults, "fluid.multiInputTransformFunction");

        if (standardInput) {
            fluid.model.transform.accumulateStandardInputPath("input", transformSpec, transformer, transformer.inputPaths);
        }
        if (multiInput) {
            fluid.model.transform.accumulateMultiInputPaths(defaults.inputVariables, transformSpec, transformer, transformer.inputPaths);
        }
        if (!multiInput && !standardInput) {
            var collector = defaults.collectInputPaths;
            if (collector) {
                var collected = fluid.makeArray(fluid.invokeGlobalFunction(collector, [transformSpec, transformer]));
                transformer.inputPaths = transformer.inputPaths.concat(collected);
            }
        }
    };

    fluid.model.transform.lookupType = function (typeName, transformSpec) {
        if (!typeName) {
            fluid.fail("Transformation record is missing a type name: ", transformSpec);
        }
        if (typeName.indexOf(".") === -1) {
            typeName = "fluid.transforms." + typeName;
        }
        var defaults = fluid.defaults(typeName);
        return { defaults: defaults, typeName: typeName};
    };

    // unsupported, NON-API function
    fluid.model.transform.processRule = function (rule, transformer) {
        if (typeof(rule) === "string") {
            rule = fluid.model.transform.pathToRule(rule);
        }
        // special dispensation to allow "literalValue" to escape any value
        else if (rule.literalValue !== undefined) {
            rule = fluid.model.transform.literalValueToRule(rule.literalValue);
        }
        var togo;
        if (rule.transform) {
            var transformSpec, transformOpts;
            if (fluid.isArrayable(rule.transform)) {
                // if the transform holds an array, each transformer within that is responsible for its own output
                var transforms = rule.transform;
                togo = undefined;
                for (var i = 0; i < transforms.length; ++i) {
                    transformSpec = transforms[i];
                    transformOpts = fluid.model.transform.lookupType(transformSpec.type);
                    transformer.transformHandler(transformSpec, transformer, transformOpts);
                }
            } else {
                // else we just have a normal single transform which will return 'undefined' as a flag to defeat cascading output
                transformSpec = rule.transform;
                transformOpts = fluid.model.transform.lookupType(transformSpec.type);
                togo = transformer.transformHandler(transformSpec, transformer, transformOpts);
            }
        }
        // if rule is an array, save path for later use in schema strategy on final applier (so output will be interpreted as array)
        if (fluid.isArrayable(rule)) {
            transformer.collectedFlatSchemaOpts = transformer.collectedFlatSchemaOpts || {};
            transformer.collectedFlatSchemaOpts[transformer.outputPrefix] = "array";
        }
        fluid.each(rule, function (value, key) {
            if (key !== "transform") {
                transformer.outputPrefixOp.push(key);
                var togo = transformer.expand(value, transformer);
                // Value expanders and arrays as rules implicitly output, unless they have nothing (undefined) to output
                if (togo !== undefined) {
                    fluid.model.transform.setValue(null, togo, transformer);
                    // ensure that expanders further up does not try to output this value as well.
                    togo = undefined;
                }
                transformer.outputPrefixOp.pop();
            }
        });
        return togo;
    };

    // unsupported, NON-API function
    // 3rd arg is disused by the framework and always defaults to fluid.model.transform.processRule
    fluid.model.transform.makeStrategy = function (transformer, handleFn, transformFn) {
        transformFn = transformFn || fluid.model.transform.processRule;
        transformer.expand = function (rules) {
            return transformFn(rules, transformer);
        };
        transformer.outputPrefixOp = fluid.model.makePathStack(transformer, "outputPrefix");
        transformer.inputPrefixOp = fluid.model.makePathStack(transformer, "inputPrefix");
        transformer.transformHandler = handleFn;
    };

    fluid.model.transform.invertConfiguration = function (rules) {
        var transformer = {
            inverted: []
        };
        fluid.model.transform.makeStrategy(transformer, fluid.model.transform.handleInvertStrategy);
        transformer.expand(rules);
        return {
            transform: transformer.inverted
        };
    };

    fluid.model.transform.collectInputPaths = function (rules) {
        var transformer = {
            inputPaths: []
        };
        fluid.model.transform.makeStrategy(transformer, fluid.model.transform.handleCollectStrategy);
        transformer.expand(rules);
        return transformer.inputPaths;
    };

    // unsupported, NON-API function
    fluid.model.transform.flatSchemaStrategy = function (flatSchema, getConfig) {
        var keys = fluid.model.sortByKeyLength(flatSchema);
        return function (root, segment, index, segs) {
            var path = getConfig.parser.compose.apply(null, segs.slice(0, index));
          // TODO: clearly this implementation could be much more efficient
            for (var i = 0; i < keys.length; ++i) {
                var key = keys[i];
                if (fluid.pathUtil.matchPath(key, path, true) !== null) {
                    return flatSchema[key];
                }
            }
        };
    };

    // unsupported, NON-API function
    fluid.model.transform.defaultSchemaValue = function (schemaValue) {
        var type = fluid.isPrimitive(schemaValue) ? schemaValue : schemaValue.type;
        return type === "array" ? [] : {};
    };

    // unsupported, NON-API function
    fluid.model.transform.isomorphicSchemaStrategy = function (source, getConfig) {
        return function (root, segment, index, segs) {
            var existing = fluid.get(source, segs.slice(0, index), getConfig);
            return fluid.isArrayable(existing) ? "array" : "object";
        };
    };

    // unsupported, NON-API function
    fluid.model.transform.decodeStrategy = function (source, options, getConfig) {
        if (options.isomorphic) {
            return fluid.model.transform.isomorphicSchemaStrategy(source, getConfig);
        }
        else if (options.flatSchema) {
            return fluid.model.transform.flatSchemaStrategy(options.flatSchema, getConfig);
        }
    };

    // unsupported, NON-API function
    fluid.model.transform.schemaToCreatorStrategy = function (strategy) {
        return function (root, segment, index, segs) {
            if (root[segment] === undefined) {
                var schemaValue = strategy(root, segment, index, segs);
                root[segment] = fluid.model.transform.defaultSchemaValue(schemaValue);
                return root[segment];
            }
        };
    };

    /** Transforms a model by a sequence of rules. Parameters as for fluid.model.transform,
     * only with an array accepted for "rules"
     */
    fluid.model.transform.sequence = function (source, rules, options) {
        for (var i = 0; i < rules.length; ++i) {
            source = fluid.model.transform(source, rules[i], options);
        }
        return source;
    };

    fluid.model.compareByPathLength = function (changea, changeb) {
        var pdiff = changea.path.length - changeb.path.length;
        return pdiff === 0 ? changea.sequence - changeb.sequence : pdiff;
    };

   /** Fires an accumulated set of change requests in increasing order of target pathlength
     */
    fluid.model.fireSortedChanges = function (changes, applier) {
        changes.sort(fluid.model.compareByPathLength);
        fluid.fireChanges(applier, changes);
    };

    /**
     * Transforms a model based on a specified expansion rules objects.
     * Rules objects take the form of:
     *   {
     *       "target.path": "value.el.path" || {
     *          transform: {
     *              type: "transform.function.path",
     *               ...
     *           }
     *       }
     *   }
     *
     * @param {Object} source the model to transform
     * @param {Object} rules a rules object containing instructions on how to transform the model
     * @param {Object} options a set of rules governing the transformations. At present this may contain
     * the values <code>isomorphic: true</code> indicating that the output model is to be governed by the
     * same schema found in the input model, or <code>flatSchema</code> holding a flat schema object which
     * consists of a hash of EL path specifications with wildcards, to the values "array"/"object" defining
     * the schema to be used to construct missing trunk values.
     */
    fluid.model.transformWithRules = function (source, rules, options) {
        options = options || {};

        var getConfig = fluid.model.escapedGetConfig;
        var setConfig = fluid.model.escapedSetConfig;

        var schemaStrategy = fluid.model.transform.decodeStrategy(source, options, getConfig);

        var transformer = {
            source: source,
            target: {
                // TODO: This should default to undefined to allow return of primitives, etc.
                model: schemaStrategy ? fluid.model.transform.defaultSchemaValue(schemaStrategy(null, "", 0, [""])) : {}
            },
            resolverGetConfig: getConfig,
            resolverSetConfig: setConfig,
            collectedFlatSchemaOpts: undefined, // to hold options for flat schema collected during transforms
            queuedChanges: [],
            queuedTransforms: [] // TODO: This is used only by wildcard applier - explain its operation
        };
        fluid.model.transform.makeStrategy(transformer, fluid.model.transform.handleTransformStrategy);
        transformer.applier = {
            fireChangeRequest: function (changeRequest) {
                changeRequest.sequence = transformer.queuedChanges.length;
                transformer.queuedChanges.push(changeRequest);
            }
        };
        fluid.bindRequestChange(transformer.applier);

        transformer.expand(rules);

        var rootSetConfig = fluid.copy(setConfig);
        // Modify schemaStrategy if we collected flat schema options for the setConfig of finalApplier
        if (transformer.collectedFlatSchemaOpts !== undefined) {
            $.extend(transformer.collectedFlatSchemaOpts, options.flatSchema);
            schemaStrategy = fluid.model.transform.flatSchemaStrategy(transformer.collectedFlatSchemaOpts, getConfig);
        }
        rootSetConfig.strategies = [fluid.model.defaultFetchStrategy, schemaStrategy ? fluid.model.transform.schemaToCreatorStrategy(schemaStrategy)
                : fluid.model.defaultCreatorStrategy];
        transformer.finalApplier = options.finalApplier || fluid.makeHolderChangeApplier(transformer.target, {resolverSetConfig: rootSetConfig});

        if (transformer.queuedTransforms.length > 0) {
            transformer.typeStack = [];
            transformer.pathOp = fluid.model.makePathStack(transformer, "path");
            fluid.model.transform.expandWildcards(transformer, source);
        }
        fluid.model.fireSortedChanges(transformer.queuedChanges, transformer.finalApplier);
        return transformer.target.model;
    };

    $.extend(fluid.model.transformWithRules, fluid.model.transform);
    fluid.model.transform = fluid.model.transformWithRules;

    /** Utility function to produce a standard options transformation record for a single set of rules **/
    fluid.transformOne = function (rules) {
        return {
            transformOptions: {
                transformer: "fluid.model.transformWithRules",
                config: rules
            }
        };
    };

    /** Utility function to produce a standard options transformation record for multiple rules to be applied in sequence **/
    fluid.transformMany = function (rules) {
        return {
            transformOptions: {
                transformer: "fluid.model.transform.sequence",
                config: rules
            }
        };
    };

})(jQuery, fluid_2_0_0);
;
/*
Copyright 2010 University of Toronto
Copyright 2010-2011 OCAD University
Copyright 2013, 2016 Raising the Floor - International

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

var fluid_2_0_0 = fluid_2_0_0 || {};
var fluid = fluid || fluid_2_0_0;

(function ($, fluid) {
    "use strict";

    fluid.registerNamespace("fluid.model.transform");
    fluid.registerNamespace("fluid.transforms");

    /**********************************
     * Standard transformer functions *
     **********************************/

    fluid.defaults("fluid.transforms.value", {
        gradeNames: "fluid.standardTransformFunction",
        invertConfiguration: "fluid.identity"
    });

    fluid.transforms.value = fluid.identity;

    // Export the use of the "value" transform under the "identity" name for FLUID-5293
    fluid.transforms.identity = fluid.transforms.value;
    fluid.defaults("fluid.transforms.identity", {
        gradeNames: "fluid.transforms.value"
    });

    // A helpful utility function to be used when a transform's inverse is the identity
    fluid.transforms.invertToIdentity = function (transformSpec) {
        transformSpec.type = "fluid.transforms.identity";
        return transformSpec;
    };

    fluid.defaults("fluid.transforms.literalValue", {
        gradeNames: "fluid.standardOutputTransformFunction"
    });

    fluid.transforms.literalValue = function (transformSpec) {
        return transformSpec.input;
    };

    fluid.defaults("fluid.transforms.stringToNumber", {
        gradeNames: ["fluid.standardTransformFunction", "fluid.lens"],
        invertConfiguration: "fluid.transforms.stringToNumber.invert"
    });

    fluid.transforms.stringToNumber = function (value) {
        var newValue = Number(value);
        return isNaN(newValue) ? undefined : newValue;
    };

    fluid.transforms.stringToNumber.invert = function (transformSpec) {
        transformSpec.type = "fluid.transforms.numberToString";
        return transformSpec;
    };

    fluid.defaults("fluid.transforms.numberToString", {
        gradeNames: ["fluid.standardTransformFunction", "fluid.lens"],
        invertConfiguration: "fluid.transforms.numberToString.invert"
    });

    fluid.transforms.numberToString = function (value) {
        return (typeof value !== "number") ? undefined : "" + value;
    };

    fluid.transforms.numberToString.invert = function (transformSpec) {
        transformSpec.type = "fluid.transforms.stringToNumber";
        return transformSpec;
    };

    fluid.defaults("fluid.transforms.count", {
        gradeNames: "fluid.standardTransformFunction"
    });

    fluid.transforms.count = function (value) {
        return fluid.makeArray(value).length;
    };


    fluid.defaults("fluid.transforms.round", {
        gradeNames: ["fluid.standardTransformFunction", "fluid.lens"],
        invertConfiguration: "fluid.transforms.invertToIdentity"
    });

    fluid.transforms.round = function (value) {
        return Math.round(value);
    };


    fluid.defaults("fluid.transforms.delete", {
        gradeNames: "fluid.transformFunction"
    });

    fluid.transforms["delete"] = function (transformSpec, transformer) {
        var outputPath = fluid.model.composePaths(transformer.outputPrefix, transformSpec.outputPath);
        transformer.applier.change(outputPath, null, "DELETE");
    };


    fluid.defaults("fluid.transforms.firstValue", {
        gradeNames: "fluid.standardOutputTransformFunction"
    });

    fluid.transforms.firstValue = function (transformSpec, transformer) {
        if (!transformSpec.values || !transformSpec.values.length) {
            fluid.fail("firstValue transformer requires an array of values at path named \"values\", supplied", transformSpec);
        }
        for (var i = 0; i < transformSpec.values.length; i++) {
            var value = transformSpec.values[i];
            // TODO: problem here - all of these transforms will have their side-effects (setValue) even if only one is chosen
            var expanded = transformer.expand(value);
            if (expanded !== undefined) {
                return expanded;
            }
        }
    };

    fluid.defaults("fluid.transforms.linearScale", {
        gradeNames: ["fluid.multiInputTransformFunction",
                     "fluid.standardTransformFunction",
                     "fluid.lens" ],
        invertConfiguration: "fluid.transforms.linearScale.invert",
        inputVariables: {
            factor: 1,
            offset: 0
        }
    });

    /* simple linear transformation */
    fluid.transforms.linearScale = function (input, extraInputs) {
        var factor = extraInputs.factor();
        var offset = extraInputs.offset();

        if (typeof(input) !== "number" || typeof(factor) !== "number" || typeof(offset) !== "number") {
            return undefined;
        }
        return input * factor + offset;
    };

    /* TODO: This inversion doesn't work if the value and factors are given as paths in the source model */
    fluid.transforms.linearScale.invert = function (transformSpec) {
        // delete the factor and offset paths if present
        delete transformSpec.factorPath;
        delete transformSpec.offsetPath;

        if (transformSpec.factor !== undefined) {
            transformSpec.factor = (transformSpec.factor === 0) ? 0 : 1 / transformSpec.factor;
        }
        if (transformSpec.offset !== undefined) {
            transformSpec.offset = -transformSpec.offset * (transformSpec.factor !== undefined ? transformSpec.factor : 1);
        }
        return transformSpec;
    };

    fluid.defaults("fluid.transforms.binaryOp", {
        gradeNames: [ "fluid.multiInputTransformFunction", "fluid.standardOutputTransformFunction" ],
        inputVariables: {
            left: null,
            right: null
        }
    });

    fluid.transforms.binaryLookup = {
        "===": function (a, b) { return fluid.model.isSameValue(a, b); },
        "!==": function (a, b) { return !fluid.model.isSameValue(a, b); },
        "<=": function (a, b) { return a <= b; },
        "<": function (a, b) { return a < b; },
        ">=": function (a, b) { return a >= b; },
        ">": function (a, b) { return a > b; },
        "+": function (a, b) { return a + b; },
        "-": function (a, b) { return a - b; },
        "*": function (a, b) { return a * b; },
        "/": function (a, b) { return a / b; },
        "%": function (a, b) { return a % b; },
        "&&": function (a, b) { return a && b; },
        "||": function (a, b) { return a || b; }
    };

    fluid.transforms.binaryOp = function (inputs, transformSpec, transformer) {
        var left = inputs.left();
        var right = inputs.right();

        var operator = fluid.model.transform.getValue(undefined, transformSpec.operator, transformer);

        var fun = fluid.transforms.binaryLookup[operator];
        return (fun === undefined || left === undefined || right === undefined) ?
            undefined : fun(left, right);
    };

    fluid.defaults("fluid.transforms.condition", {
        gradeNames: [ "fluid.multiInputTransformFunction", "fluid.standardOutputTransformFunction" ],
        inputVariables: {
            "true": null,
            "false": null,
            "condition": null
        }
    });

    fluid.transforms.condition = function (inputs) {
        var condition = inputs.condition();
        if (condition === null) {
            return undefined;
        }

        return inputs[condition ? "true" : "false"]();
    };

    fluid.defaults("fluid.transforms.valueMapper", {
        gradeNames: ["fluid.transformFunction", "fluid.lens"],
        invertConfiguration: "fluid.transforms.valueMapper.invert",
        collectInputPaths: "fluid.transforms.valueMapper.collect"
    });

    /* unsupported, NON-API function
     * sorts by the object's 'matchValue' property, where higher is better.
     * Tiebreaking is done via the `index` property, where a lower index takes priority
     */
    fluid.model.transform.compareMatches = function (speca, specb) {
        var matchDiff = specb.matchValue - speca.matchValue;
        return matchDiff === 0 ? speca.index - specb.index : matchDiff; // tiebreak using 'index'
    };

    fluid.transforms.valueMapper = function (transformSpec, transformer) {
        if (!transformSpec.match) {
            fluid.fail("valueMapper requires an array or hash of matches at path named \"matches\", supplied ", transformSpec);
        }
        var value = fluid.model.transform.getValue(transformSpec.defaultInputPath, undefined, transformer);

        var matchedEntry = (fluid.isArrayable(transformSpec.match)) ? // long form with array of records?
            fluid.transforms.valueMapper.longFormMatch(value, transformSpec, transformer) :
            transformSpec.match[value];

        if (matchedEntry === undefined) { // if no matches found, default to noMatch
            matchedEntry = transformSpec.noMatch;
        }

        if (matchedEntry === undefined) { // if there was no noMatch directive, return undefined
            return;
        }

        var outputPath = matchedEntry.outputPath === undefined ? transformSpec.defaultOutputPath : matchedEntry.outputPath;
        transformer.outputPrefixOp.push(outputPath);

        var outputValue;
        if (fluid.isPrimitive(matchedEntry)) {
            outputValue = matchedEntry;
        } else if (matchedEntry.outputUndefinedValue) { // if outputUndefinedValue is set, outputValue `undefined`
            outputValue = undefined;
        } else {
            // get value from outputValue. If none is found set the outputValue to be that of defaultOutputValue (or undefined)
            outputValue = fluid.model.transform.resolveParam(matchedEntry, transformer, "outputValue", undefined);
            outputValue = (outputValue === undefined) ? transformSpec.defaultOutputValue : outputValue;
        }
        // output if we have a path and something to output
        if (typeof(outputPath) === "string" && outputValue !== undefined) {
            fluid.model.transform.setValue(undefined, outputValue, transformer, transformSpec.merge);
            outputValue = undefined; // make sure we don't also return value
        }
        transformer.outputPrefixOp.pop();
        return outputValue;
    };

    // unsupported, NON-API function
    fluid.transforms.valueMapper.longFormMatch = function (valueFromDefaultPath, transformSpec, transformer) {
        var o = transformSpec.match;
        if (o.length === 0) {
            fluid.fail("valueMapper supplied empty list of matches: ", transformSpec);
        }
        var matchPower = [];
        for (var i = 0; i < o.length; ++i) {
            var option = o[i];
            var value = option.inputPath ?
                fluid.model.transform.getValue(option.inputPath, undefined, transformer) : valueFromDefaultPath;

            var matchValue = fluid.model.transform.matchValue(option.inputValue, value, option.partialMatches);
            matchPower[i] = {index: i, matchValue: matchValue};
        }
        matchPower.sort(fluid.model.transform.compareMatches);
        return matchPower[0].matchValue <= 0 ? undefined : o[matchPower[0].index];
    };

    fluid.transforms.valueMapper.invert = function (transformSpec, transformer) {
        var match = [];
        var togo = {
            type: "fluid.transforms.valueMapper",
            match: match
        };
        var isArray = fluid.isArrayable(transformSpec.match);

        togo.defaultInputPath = fluid.model.composePaths(transformer.outputPrefix, transformSpec.defaultOutputPath);
        togo.defaultOutputPath = fluid.model.composePaths(transformer.inputPrefix, transformSpec.defaultInputPath);

        var def = fluid.firstDefined;
        fluid.each(transformSpec.match, function (option, key) {
            if (option.outputUndefinedValue === true) {
                return; // don't attempt to invert undefined output value entries
            }
            var outOption = {};
            var origInputValue = def(isArray ? option.inputValue : key, transformSpec.defaultInputValue);
            if (origInputValue === undefined) {
                fluid.fail("Failure inverting configuration for valueMapper - inputValue could not be resolved for record " + key + ": ", transformSpec);
            }
            outOption.outputValue = origInputValue;
            outOption.inputValue = !isArray && fluid.isPrimitive(option) ?
                option : def(option.outputValue, transformSpec.defaultOutputValue);

            if (option.outputPath) {
                outOption.inputPath = fluid.model.composePaths(transformer.outputPrefix, def(option.outputPath, transformSpec.outputPath));
            }
            if (option.inputPath) {
                outOption.outputPath = fluid.model.composePaths(transformer.inputPrefix, def(option.inputPath, transformSpec.inputPath));
            }
            match.push(outOption);
        });
        return togo;
    };

    fluid.transforms.valueMapper.collect = function (transformSpec, transformer) {
        var togo = [];
        fluid.model.transform.accumulateInputPath(transformSpec.defaultInputPath, transformer, togo);
        fluid.each(transformSpec.match, function (option) {
            fluid.model.transform.accumulateInputPath(option.inputPath, transformer, togo);
        });
        return togo;
    };

    /* -------- arrayToSetMembership and setMembershipToArray ---------------- */

    fluid.defaults("fluid.transforms.arrayToSetMembership", {
        gradeNames: ["fluid.standardTransformFunction", "fluid.lens"],
        invertConfiguration: "fluid.transforms.arrayToSetMembership.invert"
    });


    fluid.transforms.arrayToSetMembership = function (value, transformSpec, transformer) {
        var output = {};
        var options = transformSpec.options;

        if (!value || !fluid.isArrayable(value)) {
            fluid.fail("arrayToSetMembership didn't find array at inputPath nor passed as value.", transformSpec);
        }
        if (!options) {
            fluid.fail("arrayToSetMembership requires an options block set");
        }

        if (transformSpec.presentValue === undefined) {
            transformSpec.presentValue = true;
        }

        if (transformSpec.missingValue === undefined) {
            transformSpec.missingValue = false;
        }

        fluid.each(options, function (outPath, key) {
            // write to output object the value <presentValue> or <missingValue> depending on whether key is found in user input
            var outVal = (value.indexOf(key) !== -1) ? transformSpec.presentValue : transformSpec.missingValue;
            fluid.set(output, outPath, outVal, transformer.resolverSetConfig);
        });
        return output;
    };

    /**
     * NON-API function; Copies the entire transformSpec with the following modifications:
     * * A new type is set (from argument)
     * * each [key]=value entry in the options is swapped to be: [value]=key
     */
    fluid.transforms.arrayToSetMembership.invertWithType = function (transformSpec, transformer, newType) {
        transformSpec.type = newType;
        var newOptions = {};
        fluid.each(transformSpec.options, function (path, oldKey) {
            newOptions[path] = oldKey;
        });
        transformSpec.options = newOptions;
        return transformSpec;
    };

    fluid.transforms.arrayToSetMembership.invert = function (transformSpec, transformer) {
        return fluid.transforms.arrayToSetMembership.invertWithType(transformSpec, transformer,
            "fluid.transforms.setMembershipToArray");
    };

    fluid.defaults("fluid.transforms.setMembershipToArray", {
        gradeNames: ["fluid.standardTransformFunction", "fluid.lens"],
        invertConfiguration: "fluid.transforms.setMembershipToArray.invert"
    });

    fluid.transforms.setMembershipToArray = function (input, transformSpec, transformer) {
        var options = transformSpec.options;

        if (!options) {
            fluid.fail("setMembershipToArray requires an options block specified");
        }

        if (transformSpec.presentValue === undefined) {
            transformSpec.presentValue = true;
        }

        if (transformSpec.missingValue === undefined) {
            transformSpec.missingValue = false;
        }

        var outputArr = [];
        fluid.each(options, function (outputVal, key) {
            var value = fluid.get(input, key, transformer.resolverGetConfig);
            if (value === transformSpec.presentValue) {
                outputArr.push(outputVal);
            }
        });
        return outputArr;
    };

    fluid.transforms.setMembershipToArray.invert = function (transformSpec, transformer) {
        return fluid.transforms.arrayToSetMembership.invertWithType(transformSpec, transformer,
            "fluid.transforms.arrayToSetMembership");
    };

    /* -------- deindexIntoArrayByKey and indexArrayByKey -------------------- */

    /**
     * Transforms the given array to an object.
     * Uses the transformSpec.options.key values from each object within the array as new keys.
     *
     * For example, with transformSpec.key = "name" and an input object like this:
     *
     * {
     *   b: [
     *     { name: b1, v: v1 },
     *     { name: b2, v: v2 }
     *   ]
     * }
     *
     * The output will be:
     * {
     *   b: {
     *     b1: {
     *       v: v1
     *     }
     *   },
     *   {
     *     b2: {
     *       v: v2
     *     }
     *   }
     * }
     */
    fluid.model.transform.applyPaths = function (operation, pathOp, paths) {
        for (var i = 0; i < paths.length; ++i) {
            if (operation === "push") {
                pathOp.push(paths[i]);
            } else {
                pathOp.pop();
            }
        }
    };

    fluid.model.transform.expandInnerValues = function (inputPath, outputPath, transformer, innerValues) {
        var inputPrefixOp = transformer.inputPrefixOp;
        var outputPrefixOp = transformer.outputPrefixOp;
        var apply = fluid.model.transform.applyPaths;

        apply("push", inputPrefixOp, inputPath);
        apply("push", outputPrefixOp, outputPath);
        var expanded = {};
        fluid.each(innerValues, function (innerValue) {
            var expandedInner = transformer.expand(innerValue);
            if (!fluid.isPrimitive(expandedInner)) {
                $.extend(true, expanded, expandedInner);
            } else {
                expanded = expandedInner;
            }
        });
        apply("pop", outputPrefixOp, outputPath);
        apply("pop", inputPrefixOp, inputPath);

        return expanded;
    };


    fluid.defaults("fluid.transforms.indexArrayByKey", {
        gradeNames: ["fluid.standardTransformFunction", "fluid.lens" ],
        invertConfiguration: "fluid.transforms.indexArrayByKey.invert"
    });

    /** Transforms an array of objects into an object of objects, by indexing using the option "key" which must be supplied within the transform specification.
    * The key of each element will be taken from the value held in each each original object's member derived from the option value in "key" - this member should
    * exist in each array element. The member with name agreeing with "key" and its value will be removed from each original object before inserting into the returned
    * object.
    * For example,
    * <code>fluid.transforms.indexArrayByKey([{k: "e1", b: 1, c: 2}, {k: "e2", b: 2: c: 3}], {key: "k"})</code> will output the object
    * <code>{e1: {b: 1, c: 2}, e2: {b: 2: c, 3}</code>
    * Note: This transform frequently arises in the context of data which arose in XML form, which often represents "morally indexed" data in repeating array-like
    * constructs where the indexing key is held, for example, in an attribute.
    */
    fluid.transforms.indexArrayByKey = function (arr, transformSpec, transformer) {
        if (transformSpec.key === undefined) {
            fluid.fail("indexArrayByKey requires a 'key' option.", transformSpec);
        }
        if (!fluid.isArrayable(arr)) {
            fluid.fail("indexArrayByKey didn't find array at inputPath.", transformSpec);
        }
        var newHash = {};
        var pivot = transformSpec.key;

        fluid.each(arr, function (v, k) {
            // check that we have a pivot entry in the object and it's a valid type:
            var newKey = v[pivot];
            var keyType = typeof(newKey);
            if (keyType !== "string" && keyType !== "boolean" && keyType !== "number") {
                fluid.fail("indexArrayByKey encountered untransformable array due to missing or invalid key", v);
            }
            // use the value of the key element as key and use the remaining content as value
            var content = fluid.copy(v);
            delete content[pivot];
            // fix sub Arrays if needed:
            if (transformSpec.innerValue) {
                content = fluid.model.transform.expandInnerValues([transformer.inputPrefix, transformSpec.inputPath, k.toString()],
                    [transformSpec.outputPath, newKey], transformer, transformSpec.innerValue);
            }
            newHash[newKey] = content;
        });
        return newHash;
    };

    fluid.transforms.indexArrayByKey.invert = function (transformSpec) {
        transformSpec.type = "fluid.transforms.deindexIntoArrayByKey";
        // invert transforms from innerValue as well:
        // TODO: The Model Transformations framework should be capable of this, but right now the
        // issue is that we use a "private contract" to operate the "innerValue" slot. We need to
        // spend time thinking of how this should be formalised
        if (transformSpec.innerValue) {
            var innerValue = transformSpec.innerValue;
            for (var i = 0; i < innerValue.length; ++i) {
                innerValue[i] = fluid.model.transform.invertConfiguration(innerValue[i]);
            }
        }
        return transformSpec;
    };


    fluid.defaults("fluid.transforms.deindexIntoArrayByKey", {
        gradeNames: [ "fluid.standardTransformFunction", "fluid.lens" ],
        invertConfiguration: "fluid.transforms.deindexIntoArrayByKey.invert"
    });

    /**
     * Transforms an object of objects into an array of objects, by deindexing by the option "key" which must be supplied within the transform specification.
     * The key of each object will become split out into a fresh value in each array element which will be given the key held in the transformSpec option "key".
     * For example:
     * <code>fluid.transforms.deindexIntoArrayByKey({e1: {b: 1, c: 2}, e2: {b: 2: c, 3}, {key: "k"})</code> will output the array
     * <code>[{k: "e1", b: 1, c: 2}, {k: "e2", b: 2: c: 3}]</code>
     *
     * This performs the inverse transform of fluid.transforms.indexArrayByKey.
     */
    fluid.transforms.deindexIntoArrayByKey = function (hash, transformSpec, transformer) {
        if (transformSpec.key === undefined) {
            fluid.fail("deindexIntoArrayByKey requires a \"key\" option.", transformSpec);
        }

        var newArray = [];
        var pivot = transformSpec.key;

        fluid.each(hash, function (v, k) {
            var content = {};
            content[pivot] = k;
            if (transformSpec.innerValue) {
                v = fluid.model.transform.expandInnerValues([transformSpec.inputPath, k], [transformSpec.outputPath, newArray.length.toString()],
                    transformer, transformSpec.innerValue);
            }
            $.extend(true, content, v);
            newArray.push(content);
        });
        return newArray;
    };

    fluid.transforms.deindexIntoArrayByKey.invert = function (transformSpec) {
        transformSpec.type = "fluid.transforms.indexArrayByKey";
        // invert transforms from innerValue as well:
        // TODO: The Model Transformations framework should be capable of this, but right now the
        // issue is that we use a "private contract" to operate the "innerValue" slot. We need to
        // spend time thinking of how this should be formalised
        if (transformSpec.innerValue) {
            var innerValue = transformSpec.innerValue;
            for (var i = 0; i < innerValue.length; ++i) {
                innerValue[i] = fluid.model.transform.invertConfiguration(innerValue[i]);
            }
        }
        return transformSpec;
    };

    fluid.defaults("fluid.transforms.limitRange", {
        gradeNames: "fluid.standardTransformFunction"
    });

    fluid.transforms.limitRange = function (value, transformSpec) {
        var min = transformSpec.min;
        if (min !== undefined) {
            var excludeMin = transformSpec.excludeMin || 0;
            min += excludeMin;
            if (value < min) {
                value = min;
            }
        }
        var max = transformSpec.max;
        if (max !== undefined) {
            var excludeMax = transformSpec.excludeMax || 0;
            max -= excludeMax;
            if (value > max) {
                value = max;
            }
        }
        return value;
    };

    fluid.defaults("fluid.transforms.indexOf", {
        gradeNames: ["fluid.standardTransformFunction", "fluid.lens"],
        invertConfiguration: "fluid.transforms.indexOf.invert"
    });

    fluid.transforms.indexOf = function (value, transformSpec) {
        // We do not allow a positive number as 'notFound' value, as it threatens invertibility
        if (typeof (transformSpec.notFound) === "number" && transformSpec.notFound >= 0) {
            fluid.fail("A positive number is not allowed as 'notFound' value for indexOf");
        }
        var offset = fluid.transforms.parseIndexationOffset(transformSpec.offset, "indexOf");
        var array = fluid.makeArray(transformSpec.array);
        var originalIndex = array.indexOf(value);
        return originalIndex === -1 && transformSpec.notFound ? transformSpec.notFound : originalIndex + offset;
    };

    fluid.transforms.indexOf.invert = function (transformSpec, transformer) {
        var togo = fluid.transforms.invertArrayIndexation(transformSpec, transformer);
        togo.type = "fluid.transforms.dereference";
        return togo;
    };

    fluid.defaults("fluid.transforms.dereference", {
        gradeNames: ["fluid.standardTransformFunction", "fluid.lens"],
        invertConfiguration: "fluid.transforms.dereference.invert"
    });

    fluid.transforms.dereference = function (value, transformSpec) {
        if (typeof (value) !== "number") {
            return undefined;
        }
        var offset = fluid.transforms.parseIndexationOffset(transformSpec.offset, "dereference");
        var array = fluid.makeArray(transformSpec.array);
        var index = value + offset;
        return array[index];
    };

    fluid.transforms.dereference.invert = function (transformSpec, transformer) {
        var togo = fluid.transforms.invertArrayIndexation(transformSpec, transformer);
        togo.type = "fluid.transforms.indexOf";
        return togo;
    };

    fluid.transforms.parseIndexationOffset = function (offset, transformName) {
        var parsedOffset = 0;
        if (offset !== undefined) {
            parsedOffset = fluid.parseInteger(offset);
            if (isNaN(parsedOffset)) {
                fluid.fail(transformName + " requires the value of \"offset\" to be an integer or a string that can be converted to an integer. " + offset + " is invalid.");
            }
        }
        return parsedOffset;
    };

    fluid.transforms.invertArrayIndexation = function (transformSpec) {
        if (!isNaN(Number(transformSpec.offset))) {
            transformSpec.offset = Number(transformSpec.offset) * (-1);
        }
        return transformSpec;
    };

    fluid.defaults("fluid.transforms.stringTemplate", {
        gradeNames: "fluid.standardOutputTransformFunction"
    });

    fluid.transforms.stringTemplate = function (transformSpec) {
        return fluid.stringTemplate(transformSpec.template, transformSpec.terms);
    };

    fluid.defaults("fluid.transforms.free", {
        gradeNames: "fluid.transformFunction"
    });

    fluid.transforms.free = function (transformSpec) {
        var args = fluid.makeArray(transformSpec.args);
        return fluid.invokeGlobalFunction(transformSpec.func, args);
    };

    fluid.defaults("fluid.transforms.quantize", {
        gradeNames: "fluid.standardTransformFunction"
    });

    /**
     * Quantize function maps a continuous range into discrete values. Given an input, it will
     * be matched into a discrete bucket and the corresponding output will be done.
     */
    fluid.transforms.quantize = function (value, transformSpec, transform) {
        if (!transformSpec.ranges || !transformSpec.ranges.length) {
            fluid.fail("fluid.transforms.quantize should have a key called ranges containing an array defining ranges to quantize");
        }
        // TODO: error checking that upper bounds are all numbers and increasing
        for (var i = 0; i < transformSpec.ranges.length; i++) {
            var rangeSpec = transformSpec.ranges[i];
            if (value <= rangeSpec.upperBound || rangeSpec.upperBound === undefined && value >= Number.NEGATIVE_INFINITY) {
                return fluid.isPrimitive(rangeSpec.output) ? rangeSpec.output : transform.expand(rangeSpec.output);
            }
        }
    };

    /**
     * inRange transformer checks whether a value is within a given range and returns true if it is,
     * and false if it's not.
     *
     * The range is defined by the two inputs: "min" and "max" (both inclusive). If one of these inputs
     * is not present it is considered -infinite and +infinite, respectively - In other words, if no
     * `min` value is defined, any value below or equal to the given "max" value will result in true.
     */
    fluid.defaults("fluid.transforms.inRange", {
        gradeNames: "fluid.standardTransformFunction"
    });

    fluid.transforms.inRange = function (value, transformSpec) {
        return (transformSpec.min === undefined || transformSpec.min <= value) &&
            (transformSpec.max === undefined ||  transformSpec.max >= value) ? true : false;
    };

})(jQuery, fluid_2_0_0);
;
/*
Copyright 2008-2010 University of Cambridge
Copyright 2008-2010 University of Toronto
Copyright 2010-2011 Lucendo Development Ltd.
Copyright 2010-2011 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

var fluid_2_0_0 = fluid_2_0_0 || {};
var fluid = fluid || fluid_2_0_0;

(function ($, fluid) {
    "use strict";

    // $().fluid("selectable", args)
    // $().fluid("selectable".that()
    // $().fluid("pager.pagerBar", args)
    // $().fluid("reorderer", options)

    /** Create a "bridge" from code written in the Fluid standard "that-ist" style,
     *  to the standard JQuery UI plugin architecture specified at http://docs.jquery.com/UI/Guidelines .
     *  Every Fluid component corresponding to the top-level standard signature (JQueryable, options)
     *  will automatically convert idiomatically to the JQuery UI standard via this adapter.
     *  Any return value which is a primitive or array type will become the return value
     *  of the "bridged" function - however, where this function returns a general hash
     *  (object) this is interpreted as forming part of the Fluid "return that" pattern,
     *  and the function will instead be bridged to "return this" as per JQuery standard,
     *  permitting chaining to occur. However, as a courtesy, the particular "this" returned
     *  will be augmented with a function that() which will allow the original return
     *  value to be retrieved if desired.
     *  @param {String} name The name under which the "plugin space" is to be injected into
     *  JQuery
     *  @param {Object} peer The root of the namespace corresponding to the peer object.
     */

    fluid.thatistBridge = function (name, peer) {

        var togo = function (funcname) {
            var segs = funcname.split(".");
            var move = peer;
            for (var i = 0; i < segs.length; ++i) {
                move = move[segs[i]];
            }
            var args = [this];
            if (arguments.length === 2) {
                args = args.concat($.makeArray(arguments[1]));
            }
            var ret = move.apply(null, args);
            this.that = function () {
                return ret;
            };
            var type = typeof(ret);
            return !ret || type === "string" || type === "number" || type === "boolean" ||
                (ret && ret.length !== undefined) ? ret : this;
        };
        $.fn[name] = togo;
        return togo;
    };

    fluid.thatistBridge("fluid", fluid);
    fluid.thatistBridge("fluid_2_0_0", fluid_2_0_0);

/*************************************************************************
 * Tabindex normalization - compensate for browser differences in naming
 * and function of "tabindex" attribute and tabbing order.
 */

    // -- Private functions --


    var normalizeTabindexName = function () {
        return $.browser.msie ? "tabIndex" : "tabindex";
    };

    var canHaveDefaultTabindex = function (elements) {
        if (elements.length <= 0) {
            return false;
        }

        return $(elements[0]).is("a, input, button, select, area, textarea, object");
    };

    var getValue = function (elements) {
        if (elements.length <= 0) {
            return undefined;
        }

        if (!fluid.tabindex.hasAttr(elements)) {
            return canHaveDefaultTabindex(elements) ? Number(0) : undefined;
        }

        // Get the attribute and return it as a number value.
        var value = elements.attr(normalizeTabindexName());
        return Number(value);
    };

    var setValue = function (elements, toIndex) {
        return elements.each(function (i, item) {
            $(item).attr(normalizeTabindexName(), toIndex);
        });
    };

    // -- Public API --

    /**
     * Gets the value of the tabindex attribute for the first item, or sets the tabindex value of all elements
     * if toIndex is specified.
     *
     * @param {String|Number} toIndex
     */
    fluid.tabindex = function (target, toIndex) {
        target = $(target);
        if (toIndex !== null && toIndex !== undefined) {
            return setValue(target, toIndex);
        } else {
            return getValue(target);
        }
    };

    /**
     * Removes the tabindex attribute altogether from each element.
     */
    fluid.tabindex.remove = function (target) {
        target = $(target);
        return target.each(function (i, item) {
            $(item).removeAttr(normalizeTabindexName());
        });
    };

    /**
     * Determines if an element actually has a tabindex attribute present.
     */
    fluid.tabindex.hasAttr = function (target) {
        target = $(target);
        if (target.length <= 0) {
            return false;
        }
        var togo = target.map(
            function () {
                var attributeNode = this.getAttributeNode(normalizeTabindexName());
                return attributeNode ? attributeNode.specified : false;
            }
        );
        return togo.length === 1 ? togo[0] : togo;
    };

    /**
     * Determines if an element either has a tabindex attribute or is naturally tab-focussable.
     */
    fluid.tabindex.has = function (target) {
        target = $(target);
        return fluid.tabindex.hasAttr(target) || canHaveDefaultTabindex(target);
    };

    // Keyboard navigation
    // Public, static constants needed by the rest of the library.
    fluid.a11y = $.a11y || {};

    fluid.a11y.orientation = {
        HORIZONTAL: 0,
        VERTICAL: 1,
        BOTH: 2
    };

    var UP_DOWN_KEYMAP = {
        next: $.ui.keyCode.DOWN,
        previous: $.ui.keyCode.UP
    };

    var LEFT_RIGHT_KEYMAP = {
        next: $.ui.keyCode.RIGHT,
        previous: $.ui.keyCode.LEFT
    };

    // Private functions.
    var unwrap = function (element) {
        return element.jquery ? element[0] : element; // Unwrap the element if it's a jQuery.
    };


    var makeElementsTabFocussable = function (elements) {
        // If each element doesn't have a tabindex, or has one set to a negative value, set it to 0.
        elements.each(function (idx, item) {
            item = $(item);
            if (!item.fluid("tabindex.has") || item.fluid("tabindex") < 0) {
                item.fluid("tabindex", 0);
            }
        });
    };

    // Public API.
    /**
     * Makes all matched elements available in the tab order by setting their tabindices to "0".
     */
    fluid.tabbable = function (target) {
        target = $(target);
        makeElementsTabFocussable(target);
    };

    /***********************************************************************
     * Selectable functionality - geometrising a set of nodes such that they
     * can be navigated (by setting focus) using a set of directional keys
     */

    var CONTEXT_KEY = "selectionContext";
    var NO_SELECTION = -32768;

    var cleanUpWhenLeavingContainer = function (selectionContext) {
        if (selectionContext.activeItemIndex !== NO_SELECTION) {
            if (selectionContext.options.onLeaveContainer) {
                selectionContext.options.onLeaveContainer(
                    selectionContext.selectables[selectionContext.activeItemIndex]
                );
            } else if (selectionContext.options.onUnselect) {
                selectionContext.options.onUnselect(
                    selectionContext.selectables[selectionContext.activeItemIndex]
                );
            }
        }

        if (!selectionContext.options.rememberSelectionState) {
            selectionContext.activeItemIndex = NO_SELECTION;
        }
    };

    /**
     * Does the work of selecting an element and delegating to the client handler.
     */
    var drawSelection = function (elementToSelect, handler) {
        if (handler) {
            handler(elementToSelect);
        }
    };

    /**
     * Does does the work of unselecting an element and delegating to the client handler.
     */
    var eraseSelection = function (selectedElement, handler) {
        if (handler && selectedElement) {
            handler(selectedElement);
        }
    };

    var unselectElement = function (selectedElement, selectionContext) {
        eraseSelection(selectedElement, selectionContext.options.onUnselect);
    };

    var selectElement = function (elementToSelect, selectionContext) {
        // It's possible that we're being called programmatically, in which case we should clear any previous selection.
        unselectElement(selectionContext.selectedElement(), selectionContext);

        elementToSelect = unwrap(elementToSelect);
        var newIndex = selectionContext.selectables.index(elementToSelect);

        // Next check if the element is a known selectable. If not, do nothing.
        if (newIndex === -1) {
            return;
        }

        // Select the new element.
        selectionContext.activeItemIndex = newIndex;
        drawSelection(elementToSelect, selectionContext.options.onSelect);
    };

    var selectableFocusHandler = function (selectionContext) {
        return function (evt) {
            // FLUID-3590: newer browsers (FF 3.6, Webkit 4) have a form of "bug" in that they will go bananas
            // on attempting to move focus off an element which has tabindex dynamically set to -1.
            $(evt.target).fluid("tabindex", 0);
            selectElement(evt.target, selectionContext);

            // Force focus not to bubble on some browsers.
            return evt.stopPropagation();
        };
    };

    var selectableBlurHandler = function (selectionContext) {
        return function (evt) {
            $(evt.target).fluid("tabindex", selectionContext.options.selectablesTabindex);
            unselectElement(evt.target, selectionContext);

            // Force blur not to bubble on some browsers.
            return evt.stopPropagation();
        };
    };

    var reifyIndex = function (sc_that) {
        var elements = sc_that.selectables;
        if (sc_that.activeItemIndex >= elements.length) {
            sc_that.activeItemIndex = (sc_that.options.noWrap ? elements.length - 1 : 0);
        }
        if (sc_that.activeItemIndex < 0 && sc_that.activeItemIndex !== NO_SELECTION) {
            sc_that.activeItemIndex = (sc_that.options.noWrap ? 0 : elements.length - 1);
        }
        if (sc_that.activeItemIndex >= 0) {
            fluid.focus(elements[sc_that.activeItemIndex]);
        }
    };

    var prepareShift = function (selectionContext) {
        // FLUID-3590: FF 3.6 and Safari 4.x won't fire blur() when programmatically moving focus.
        var selElm = selectionContext.selectedElement();
        if (selElm) {
            fluid.blur(selElm);
        }

        unselectElement(selectionContext.selectedElement(), selectionContext);
        if (selectionContext.activeItemIndex === NO_SELECTION) {
            selectionContext.activeItemIndex = -1;
        }
    };

    var focusNextElement = function (selectionContext) {
        prepareShift(selectionContext);
        ++selectionContext.activeItemIndex;
        reifyIndex(selectionContext);
    };

    var focusPreviousElement = function (selectionContext) {
        prepareShift(selectionContext);
        --selectionContext.activeItemIndex;
        reifyIndex(selectionContext);
    };

    var arrowKeyHandler = function (selectionContext, keyMap) {
        return function (evt) {
            if (evt.which === keyMap.next) {
                focusNextElement(selectionContext);
                evt.preventDefault();
            } else if (evt.which === keyMap.previous) {
                focusPreviousElement(selectionContext);
                evt.preventDefault();
            }
        };
    };

    var getKeyMapForDirection = function (direction) {
        // Determine the appropriate mapping for next and previous based on the specified direction.
        var keyMap;
        if (direction === fluid.a11y.orientation.HORIZONTAL) {
            keyMap = LEFT_RIGHT_KEYMAP;
        }
        else if (direction === fluid.a11y.orientation.VERTICAL) {
            // Assume vertical in any other case.
            keyMap = UP_DOWN_KEYMAP;
        }

        return keyMap;
    };

    var tabKeyHandler = function (selectionContext) {
        return function (evt) {
            if (evt.which !== $.ui.keyCode.TAB) {
                return;
            }
            cleanUpWhenLeavingContainer(selectionContext);

            // Catch Shift-Tab and note that focus is on its way out of the container.
            if (evt.shiftKey) {
                selectionContext.focusIsLeavingContainer = true;
            }
        };
    };

    var containerFocusHandler = function (selectionContext) {
        return function (evt) {
            var shouldOrig = selectionContext.options.autoSelectFirstItem;
            var shouldSelect = typeof(shouldOrig) === "function" ? shouldOrig() : shouldOrig;

            // Override the autoselection if we're on the way out of the container.
            if (selectionContext.focusIsLeavingContainer) {
                shouldSelect = false;
            }

            // This target check works around the fact that sometimes focus bubbles, even though it shouldn't.
            if (shouldSelect && evt.target === selectionContext.container.get(0)) {
                if (selectionContext.activeItemIndex === NO_SELECTION) {
                    selectionContext.activeItemIndex = 0;
                }
                fluid.focus(selectionContext.selectables[selectionContext.activeItemIndex]);
            }

            // Force focus not to bubble on some browsers.
            return evt.stopPropagation();
        };
    };

    var containerBlurHandler = function (selectionContext) {
        return function (evt) {
            selectionContext.focusIsLeavingContainer = false;

            // Force blur not to bubble on some browsers.
            return evt.stopPropagation();
        };
    };

    var makeElementsSelectable = function (container, defaults, userOptions) {

        var options = $.extend(true, {}, defaults, userOptions);

        var keyMap = getKeyMapForDirection(options.direction);

        var selectableElements = options.selectableElements ? options.selectableElements :
            container.find(options.selectableSelector);

        // Context stores the currently active item(undefined to start) and list of selectables.
        var that = {
            container: container,
            activeItemIndex: NO_SELECTION,
            selectables: selectableElements,
            focusIsLeavingContainer: false,
            options: options
        };

        that.selectablesUpdated = function (focusedItem) {
          // Remove selectables from the tab order and add focus/blur handlers
            if (typeof(that.options.selectablesTabindex) === "number") {
                that.selectables.fluid("tabindex", that.options.selectablesTabindex);
            }
            that.selectables.unbind("focus." + CONTEXT_KEY);
            that.selectables.unbind("blur." + CONTEXT_KEY);
            that.selectables.bind("focus." + CONTEXT_KEY, selectableFocusHandler(that));
            that.selectables.bind("blur."  + CONTEXT_KEY, selectableBlurHandler(that));
            if (keyMap && that.options.noBubbleListeners) {
                that.selectables.unbind("keydown." + CONTEXT_KEY);
                that.selectables.bind("keydown." + CONTEXT_KEY, arrowKeyHandler(that, keyMap));
            }
            if (focusedItem) {
                selectElement(focusedItem, that);
            }
            else {
                reifyIndex(that);
            }
        };

        that.refresh = function () {
            if (!that.options.selectableSelector) {
                fluid.fail("Cannot refresh selectable context which was not initialised by a selector");
            }
            that.selectables = container.find(options.selectableSelector);
            that.selectablesUpdated();
        };

        that.selectedElement = function () {
            return that.activeItemIndex < 0 ? null : that.selectables[that.activeItemIndex];
        };

        // Add various handlers to the container.
        if (keyMap && !that.options.noBubbleListeners) {
            container.keydown(arrowKeyHandler(that, keyMap));
        }
        container.keydown(tabKeyHandler(that));
        container.focus(containerFocusHandler(that));
        container.blur(containerBlurHandler(that));

        that.selectablesUpdated();

        return that;
    };

    /**
     * Makes all matched elements selectable with the arrow keys.
     * Supply your own handlers object with onSelect: and onUnselect: properties for custom behaviour.
     * Options provide configurability, including direction: and autoSelectFirstItem:
     * Currently supported directions are jQuery.a11y.directions.HORIZONTAL and VERTICAL.
     */
    fluid.selectable = function (target, options) {
        target = $(target);
        var that = makeElementsSelectable(target, fluid.selectable.defaults, options);
        fluid.setScopedData(target, CONTEXT_KEY, that);
        return that;
    };

    /**
     * Selects the specified element.
     */
    fluid.selectable.select = function (target, toSelect) {
        fluid.focus(toSelect);
    };

    /**
     * Selects the next matched element.
     */
    fluid.selectable.selectNext = function (target) {
        target = $(target);
        focusNextElement(fluid.getScopedData(target, CONTEXT_KEY));
    };

    /**
     * Selects the previous matched element.
     */
    fluid.selectable.selectPrevious = function (target) {
        target = $(target);
        focusPreviousElement(fluid.getScopedData(target, CONTEXT_KEY));
    };

    /**
     * Returns the currently selected item wrapped as a jQuery object.
     */
    fluid.selectable.currentSelection = function (target) {
        target = $(target);
        var that = fluid.getScopedData(target, CONTEXT_KEY);
        return $(that.selectedElement());
    };

    fluid.selectable.defaults = {
        direction: fluid.a11y.orientation.VERTICAL,
        selectablesTabindex: -1,
        autoSelectFirstItem: true,
        rememberSelectionState: true,
        selectableSelector: ".selectable",
        selectableElements: null,
        onSelect: null,
        onUnselect: null,
        onLeaveContainer: null,
        noWrap: false
    };

    /********************************************************************
     *  Activation functionality - declaratively associating actions with
     * a set of keyboard bindings.
     */

    var checkForModifier = function (binding, evt) {
        // If no modifier was specified, just return true.
        if (!binding.modifier) {
            return true;
        }

        var modifierKey = binding.modifier;
        var isCtrlKeyPresent = modifierKey && evt.ctrlKey;
        var isAltKeyPresent = modifierKey && evt.altKey;
        var isShiftKeyPresent = modifierKey && evt.shiftKey;

        return isCtrlKeyPresent || isAltKeyPresent || isShiftKeyPresent;
    };

    /** Constructs a raw "keydown"-facing handler, given a binding entry. This
     *  checks whether the key event genuinely triggers the event and forwards it
     *  to any "activateHandler" registered in the binding.
     */
    var makeActivationHandler = function (binding) {
        return function (evt) {
            var target = evt.target;
            if (!fluid.enabled(target)) {
                return;
            }
// The following 'if' clause works in the real world, but there's a bug in the jQuery simulation
// that causes keyboard simulation to fail in Safari, causing our tests to fail:
//     http://ui.jquery.com/bugs/ticket/3229
// The replacement 'if' clause works around this bug.
// When this issue is resolved, we should revert to the original clause.
//            if (evt.which === binding.key && binding.activateHandler && checkForModifier(binding, evt)) {
            var code = evt.which ? evt.which : evt.keyCode;
            if (code === binding.key && binding.activateHandler && checkForModifier(binding, evt)) {
                var event = $.Event("fluid-activate");
                $(target).trigger(event, [binding.activateHandler]);
                if (event.isDefaultPrevented()) {
                    evt.preventDefault();
                }
            }
        };
    };

    var makeElementsActivatable = function (elements, onActivateHandler, defaultKeys, options) {
        // Create bindings for each default key.
        var bindings = [];
        $(defaultKeys).each(function (index, key) {
            bindings.push({
                modifier: null,
                key: key,
                activateHandler: onActivateHandler
            });
        });

        // Merge with any additional key bindings.
        if (options && options.additionalBindings) {
            bindings = bindings.concat(options.additionalBindings);
        }

        fluid.initEnablement(elements);

        // Add listeners for each key binding.
        for (var i = 0; i < bindings.length; ++i) {
            var binding = bindings[i];
            elements.keydown(makeActivationHandler(binding));
        }
        elements.bind("fluid-activate", function (evt, handler) {
            handler = handler || onActivateHandler;
            return handler ? handler(evt) : null;
        });
    };

    /**
     * Makes all matched elements activatable with the Space and Enter keys.
     * Provide your own handler function for custom behaviour.
     * Options allow you to provide a list of additionalActivationKeys.
     */
    fluid.activatable = function (target, fn, options) {
        target = $(target);
        makeElementsActivatable(target, fn, fluid.activatable.defaults.keys, options);
    };

    /**
     * Activates the specified element.
     */
    fluid.activate = function (target) {
        $(target).trigger("fluid-activate");
    };

    // Public Defaults.
    fluid.activatable.defaults = {
        keys: [$.ui.keyCode.ENTER, $.ui.keyCode.SPACE]
    };


})(jQuery, fluid_2_0_0);
;
/*
Copyright 2010-2011 Lucendo Development Ltd.
Copyright 2010-2011 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

/** This file contains functions which depend on the presence of a DOM document
 *  and which depend on the contents of Fluid.js **/

var fluid_2_0_0 = fluid_2_0_0 || {};

(function ($, fluid) {
    "use strict";

    fluid.defaults("fluid.viewComponent", {
        gradeNames: ["fluid.modelComponent"],
        initFunction: "fluid.initView",
        argumentMap: {
            container: 0,
            options: 1
        },
        members: { // Used to allow early access to DOM binder via IoC, but to also avoid triggering evaluation of selectors
            dom: "@expand:fluid.initDomBinder({that}, {that}.options.selectors)"
        }
    });

    // unsupported, NON-API function
    fluid.dumpSelector = function (selectable) {
        return typeof (selectable) === "string" ? selectable :
            selectable.selector ? selectable.selector : "";
    };

    // unsupported, NON-API function
    // NOTE: this function represents a temporary strategy until we have more integrated IoC debugging.
    // It preserves the 1.3 and previous framework behaviour for the 1.x releases, but provides a more informative
    // diagnostic - in fact, it is perfectly acceptable for a component's creator to return no value and
    // the failure is really in assumptions in fluid.initLittleComponent. Revisit this issue for 2.0
    fluid.diagnoseFailedView = function (componentName, that, options, args) {
        if (!that && fluid.hasGrade(options, "fluid.viewComponent")) {
            var container = fluid.wrap(args[1]);
            var message1 = "Instantiation of view component with type " + componentName + " failed, since ";
            if (!container) {
                fluid.fail(message1 + " container argument is empty");
            }
            else if (container.length === 0) {
                fluid.fail(message1 + "selector \"", fluid.dumpSelector(args[1]), "\" did not match any markup in the document");
            } else {
                fluid.fail(message1 + " component creator function did not return a value");
            }
        }
    };

    fluid.checkTryCatchParameter = function () {
        var location = window.location || { search: "", protocol: "file:" };
        var GETparams = location.search.slice(1).split("&");
        return fluid.find(GETparams, function (param) {
            if (param.indexOf("notrycatch") === 0) {
                return true;
            }
        }) === true;
    };

    fluid.notrycatch = fluid.checkTryCatchParameter();


    /**
     * Wraps an object in a jQuery if it isn't already one. This function is useful since
     * it ensures to wrap a null or otherwise falsy argument to itself, rather than the
     * often unhelpful jQuery default of returning the overall document node.
     *
     * @param {Object} obj the object to wrap in a jQuery
     * @param {jQuery} userJQuery the jQuery object to use for the wrapping, optional - use the current jQuery if absent
     */
    fluid.wrap = function (obj, userJQuery) {
        userJQuery = userJQuery || $;
        return ((!obj || obj.jquery) ? obj : userJQuery(obj));
    };

    /**
     * If obj is a jQuery, this function will return the first DOM element within it. Otherwise, the object will be returned unchanged.
     *
     * @param {jQuery} obj the jQuery instance to unwrap into a pure DOM element
     */
    fluid.unwrap = function (obj) {
        return obj && obj.jquery ? obj[0] : obj;
    };

    /**
     * Fetches a single container element and returns it as a jQuery.
     *
     * @param {String||jQuery||element} containerSpec an id string, a single-element jQuery, or a DOM element specifying a unique container
     * @param {Boolean} fallible <code>true</code> if an empty container is to be reported as a valid condition
     * @return a single-element jQuery of container
     */
    fluid.container = function (containerSpec, fallible, userJQuery) {
        if (userJQuery) {
            containerSpec = fluid.unwrap(containerSpec);
        }
        var container = fluid.wrap(containerSpec, userJQuery);
        if (fallible && (!container || container.length === 0)) {
            return null;
        }

        if (!container || !container.jquery || container.length !== 1) {
            if (typeof (containerSpec) !== "string") {
                containerSpec = container.selector;
            }
            var count = container.length !== undefined ? container.length : 0;
            fluid.fail((count > 1 ? "More than one (" + count + ") container elements were"
                    : "No container element was") + " found for selector " + containerSpec);
        }
        if (!fluid.isDOMNode(container[0])) {
            fluid.fail("fluid.container was supplied a non-jQueryable element");
        }

        return container;
    };

    /**
     * Creates a new DOM Binder instance, used to locate elements in the DOM by name.
     *
     * @param {Object} container the root element in which to locate named elements
     * @param {Object} selectors a collection of named jQuery selectors
     */
    fluid.createDomBinder = function (container, selectors) {
        // don't put on a typename to avoid confusing primitive visitComponentChildren
        var that = {
            id: fluid.allocateGuid(),
            cache: {}
        };
        var userJQuery = container.constructor;

        function cacheKey(name, thisContainer) {
            return fluid.allocateSimpleId(thisContainer) + "-" + name;
        }

        function record(name, thisContainer, result) {
            that.cache[cacheKey(name, thisContainer)] = result;
        }

        that.locate = function (name, localContainer) {
            var selector, thisContainer, togo;

            selector = selectors[name];
            thisContainer = localContainer ? $(localContainer) : container;
            if (!thisContainer) {
                fluid.fail("DOM binder invoked for selector " + name + " without container");
            }
            if (selector === "") {
                togo = thisContainer;
            }
            else if (!selector) {
                togo = userJQuery();
            }
            else {
                if (typeof (selector) === "function") {
                    togo = userJQuery(selector.call(null, fluid.unwrap(thisContainer)));
                } else {
                    togo = userJQuery(selector, thisContainer);
                }
            }

            if (!togo.selector) {
                togo.selector = selector;
                togo.context = thisContainer;
            }
            togo.selectorName = name;
            record(name, thisContainer, togo);
            return togo;
        };
        that.fastLocate = function (name, localContainer) {
            var thisContainer = localContainer ? localContainer : container;
            var key = cacheKey(name, thisContainer);
            var togo = that.cache[key];
            return togo ? togo : that.locate(name, localContainer);
        };
        that.clear = function () {
            that.cache = {};
        };
        that.refresh = function (names, localContainer) {
            var thisContainer = localContainer ? localContainer : container;
            if (typeof names === "string") {
                names = [names];
            }
            if (thisContainer.length === undefined) {
                thisContainer = [thisContainer];
            }
            for (var i = 0; i < names.length; ++i) {
                for (var j = 0; j < thisContainer.length; ++j) {
                    that.locate(names[i], thisContainer[j]);
                }
            }
        };
        that.resolvePathSegment = that.locate;

        return that;
    };

    /** Expect that jQuery selector query has resulted in a non-empty set of
     * results. If none are found, this function will fail with a diagnostic message,
     * with the supplied message prepended.
     */
    fluid.expectFilledSelector = function (result, message) {
        if (result && result.length === 0 && result.jquery) {
            fluid.fail(message + ": selector \"" + result.selector + "\" with name " + result.selectorName +
                       " returned no results in context " + fluid.dumpEl(result.context));
        }
    };

    /**
     * The central initialiation method called as the first act of every Fluid
     * component. This function automatically merges user options with defaults,
     * attaches a DOM Binder to the instance, and configures events.
     *
     * @param {String} componentName The unique "name" of the component, which will be used
     * to fetch the default options from store. By recommendation, this should be the global
     * name of the component's creator function.
     * @param {jQueryable} container A specifier for the single root "container node" in the
     * DOM which will house all the markup for this component.
     * @param {Object} userOptions The configuration options for this component.
     */
     // 4th argument is NOT SUPPORTED, see comments for initLittleComponent
    fluid.initView = function (componentName, containerSpec, userOptions, localOptions) {
        var container = fluid.container(containerSpec, true);
        fluid.expectFilledSelector(container, "Error instantiating component with name \"" + componentName);
        if (!container) {
            return null;
        }
        // Need to ensure container is set early, without relying on an IoC mechanism - rethink this with asynchrony
        var receiver = function (that) {
            that.container = container;
        };
        var that = fluid.initLittleComponent(componentName, userOptions, localOptions || {gradeNames: ["fluid.viewComponent"]}, receiver);

        if (!that.dom) {
            fluid.initDomBinder(that);
        }
        // TODO: cannot afford a mutable container - put this into proper workflow
        var userJQuery = that.options.jQuery; // Do it a second time to correct for jQuery injection
        // if (userJQuery) {
        //    container = fluid.container(containerSpec, true, userJQuery);
        // }
        fluid.log("Constructing view component " + componentName + " with container " + container.constructor.expando +
            (userJQuery ? " user jQuery " + userJQuery.expando : "") + " env: " + $.expando);

        return that;
    };

    /**
     * Creates a new DOM Binder instance for the specified component and mixes it in.
     *
     * @param {Object} that the component instance to attach the new DOM Binder to
     */
    fluid.initDomBinder = function (that, selectors) {
        if (!that.container) {
            fluid.fail("fluid.initDomBinder called for component with typeName " + that.typeName +
                " without an initialised container - this has probably resulted from placing \"fluid.viewComponent\" in incorrect position in grade merging order. " +
                " Make sure to place it to the right of any non-view grades in the gradeNames list to ensure that it overrides properly: resolved gradeNames is ", that.options.gradeNames, " for component ", that);
        }
        that.dom = fluid.createDomBinder(that.container, selectors || that.options.selectors || {});
        that.locate = that.dom.locate;
        return that.dom;
    };

    // DOM Utilities.

    /**
     * Finds the nearest ancestor of the element that matches a predicate
     * @param {Element} element DOM element
     * @param {Function} test A function (predicate) accepting a DOM element, returning a truthy value representing a match
     * @return The first element parent for which the predicate returns truthy - or undefined if no parent matches
     */
    fluid.findAncestor = function (element, test) {
        element = fluid.unwrap(element);
        while (element) {
            if (test(element)) {
                return element;
            }
            element = element.parentNode;
        }
    };

    fluid.findForm = function (node) {
        return fluid.findAncestor(node, function (element) {
            return element.nodeName.toLowerCase() === "form";
        });
    };

    /** A utility with the same signature as jQuery.text and jQuery.html, but without the API irregularity
     * that treats a single argument of undefined as different to no arguments */
    // in jQuery 1.7.1, jQuery pulled the same dumb trick with $.text() that they did with $.val() previously,
    // see comment in fluid.value below
    fluid.each(["text", "html"], function (method) {
        fluid[method] = function (node, newValue) {
            node = $(node);
            return newValue === undefined ? node[method]() : node[method](newValue);
        };
    });

    /** A generalisation of jQuery.val to correctly handle the case of acquiring and
     * setting the value of clustered radio button/checkbox sets, potentially, given
     * a node corresponding to just one element.
     */
    fluid.value = function (nodeIn, newValue) {
        var node = fluid.unwrap(nodeIn);
        var multiple = false;
        if (node.nodeType === undefined && node.length > 1) {
            node = node[0];
            multiple = true;
        }
        if ("input" !== node.nodeName.toLowerCase() || !/radio|checkbox/.test(node.type)) {
            // resist changes to contract of jQuery.val() in jQuery 1.5.1 (see FLUID-4113)
            return newValue === undefined ? $(node).val() : $(node).val(newValue);
        }
        var name = node.name;
        if (name === undefined) {
            fluid.fail("Cannot acquire value from node " + fluid.dumpEl(node) + " which does not have name attribute set");
        }
        var elements;
        if (multiple) {
            elements = nodeIn;
        } else {
            elements = node.ownerDocument.getElementsByName(name);
            var scope = fluid.findForm(node);
            elements = $.grep(elements, function (element) {
                if (element.name !== name) {
                    return false;
                }
                return !scope || fluid.dom.isContainer(scope, element);
            });
        }
        if (newValue !== undefined) {
            if (typeof(newValue) === "boolean") {
                newValue = (newValue ? "true" : "false");
            }
            // jQuery gets this partially right, but when dealing with radio button array will
            // set all of their values to "newValue" rather than setting the checked property
            // of the corresponding control.
            $.each(elements, function () {
                this.checked = (newValue instanceof Array ?
                    newValue.indexOf(this.value) !== -1 : newValue === this.value);
            });
        } else { // this part jQuery will not do - extracting value from <input> array
            var checked = $.map(elements, function (element) {
                return element.checked ? element.value : null;
            });
            return node.type === "radio" ? checked[0] : checked;
        }
    };


    fluid.BINDING_ROOT_KEY = "fluid-binding-root";

    /** Recursively find any data stored under a given name from a node upwards
     * in its DOM hierarchy **/

    fluid.findData = function (elem, name) {
        while (elem) {
            var data = $.data(elem, name);
            if (data) {
                return data;
            }
            elem = elem.parentNode;
        }
    };

    fluid.bindFossils = function (node, data, fossils) {
        $.data(node, fluid.BINDING_ROOT_KEY, {data: data, fossils: fossils});
    };

    fluid.boundPathForNode = function (node, fossils) {
        node = fluid.unwrap(node);
        var key = node.name || node.id;
        var record = fossils[key];
        return record ? record.EL : null;
    };

   /** "Automatically" apply to whatever part of the data model is
     * relevant, the changed value received at the given DOM node*/
    fluid.applyBoundChange = function (node, newValue, applier) {
        node = fluid.unwrap(node);
        if (newValue === undefined) {
            newValue = fluid.value(node);
        }
        if (node.nodeType === undefined && node.length > 0) {
            node = node[0];
        } // assume here that they share name and parent
        var root = fluid.findData(node, fluid.BINDING_ROOT_KEY);
        if (!root) {
            fluid.fail("Bound data could not be discovered in any node above " + fluid.dumpEl(node));
        }
        var name = node.name;
        var fossil = root.fossils[name];
        if (!fossil) {
            fluid.fail("No fossil discovered for name " + name + " in fossil record above " + fluid.dumpEl(node));
        }
        if (typeof(fossil.oldvalue) === "boolean") { // deal with the case of an "isolated checkbox"
            newValue = newValue[0] ? true : false;
        }
        var EL = root.fossils[name].EL;
        if (applier) {
            applier.fireChangeRequest({path: EL, value: newValue, source: "DOM:" + node.id});
        } else {
            fluid.set(root.data, EL, newValue);
        }
    };


    /**
     * Returns a jQuery object given the id of a DOM node. In the case the element
     * is not found, will return an empty list.
     */
    fluid.jById = function (id, dokkument) {
        dokkument = dokkument && dokkument.nodeType === 9 ? dokkument : document;
        var element = fluid.byId(id, dokkument);
        var togo = element ? $(element) : [];
        togo.selector = "#" + id;
        togo.context = dokkument;
        return togo;
    };

    /**
     * Returns an DOM element quickly, given an id
     *
     * @param {Object} id the id of the DOM node to find
     * @param {Document} dokkument the document in which it is to be found (if left empty, use the current document)
     * @return The DOM element with this id, or null, if none exists in the document.
     */
    fluid.byId = function (id, dokkument) {
        dokkument = dokkument && dokkument.nodeType === 9 ? dokkument : document;
        var el = dokkument.getElementById(id);
        if (el) {
        // Use element id property here rather than attribute, to work around FLUID-3953
            if (el.id !== id) {
                fluid.fail("Problem in document structure - picked up element " +
                    fluid.dumpEl(el) + " for id " + id +
                    " without this id - most likely the element has a name which conflicts with this id");
            }
            return el;
        } else {
            return null;
        }
    };

    /**
     * Returns the id attribute from a jQuery or pure DOM element.
     *
     * @param {jQuery||Element} element the element to return the id attribute for
     */
    fluid.getId = function (element) {
        return fluid.unwrap(element).id;
    };

    /**
     * Allocate an id to the supplied element if it has none already, by a simple
     * scheme resulting in ids "fluid-id-nnnn" where nnnn is an increasing integer.
     */

    fluid.allocateSimpleId = function (element) {
        element = fluid.unwrap(element);
        if (!element || fluid.isPrimitive(element)) {
            return null;
        }

        if (!element.id) {
            var simpleId = "fluid-id-" + fluid.allocateGuid();
            element.id = simpleId;
        }
        return element.id;
    };

    /**
     * Returns the document to which an element belongs, or the element itself if it is already a document
     *
     * @param {jQuery||Element} element The element to return the document for
     * @return {Document} dokkument The document in which it is to be found
     */
    fluid.getDocument = function (element) {
        var node = fluid.unwrap(element);
        // DOCUMENT_NODE - guide to node types at https://developer.mozilla.org/en/docs/Web/API/Node/nodeType
        return node.nodeType === 9 ? node : node.ownerDocument;
    };

    fluid.defaults("fluid.ariaLabeller", {
        gradeNames: ["fluid.viewComponent"],
        labelAttribute: "aria-label",
        liveRegionMarkup: "<div class=\"liveRegion fl-hidden-accessible\" aria-live=\"polite\"></div>",
        liveRegionId: "fluid-ariaLabeller-liveRegion",
        invokers: {
            generateLiveElement: {
                funcName: "fluid.ariaLabeller.generateLiveElement",
                args: "{that}"
            },
            update: {
                funcName: "fluid.ariaLabeller.update",
                args: ["{that}", "{arguments}.0"]
            }
        },
        listeners: {
            onCreate: {
                func: "{that}.update",
                args: [null]
            }
        }
    });

    fluid.ariaLabeller.update = function (that, newOptions) {
        newOptions = newOptions || that.options;
        that.container.attr(that.options.labelAttribute, newOptions.text);
        if (newOptions.dynamicLabel) {
            var live = fluid.jById(that.options.liveRegionId);
            if (live.length === 0) {
                live = that.generateLiveElement();
            }
            live.text(newOptions.text);
        }
    };

    fluid.ariaLabeller.generateLiveElement = function (that) {
        var liveEl = $(that.options.liveRegionMarkup);
        liveEl.prop("id", that.options.liveRegionId);
        $("body").append(liveEl);
        return liveEl;
    };

    var LABEL_KEY = "aria-labelling";

    fluid.getAriaLabeller = function (element) {
        element = $(element);
        var that = fluid.getScopedData(element, LABEL_KEY);
        return that;
    };

    /** Manages an ARIA-mediated label attached to a given DOM element. An
     * aria-labelledby attribute and target node is fabricated in the document
     * if they do not exist already, and a "little component" is returned exposing a method
     * "update" that allows the text to be updated. */

    fluid.updateAriaLabel = function (element, text, options) {
        options = $.extend({}, options || {}, {text: text});
        var that = fluid.getAriaLabeller(element);
        if (!that) {
            that = fluid.ariaLabeller(element, options);
            fluid.setScopedData(element, LABEL_KEY, that);
        } else {
            that.update(options);
        }
        return that;
    };

    /** "Global Dismissal Handler" for the entire page. Attaches a click handler to the
     * document root that will cause dismissal of any elements (typically dialogs) which
     * have registered themselves. Dismissal through this route will automatically clean up
     * the record - however, the dismisser themselves must take care to deregister in the case
     * dismissal is triggered through the dialog interface itself. This component can also be
     * automatically configured by fluid.deadMansBlur by means of the "cancelByDefault" option */

    var dismissList = {};

    $(document).click(function (event) {
        var target = fluid.resolveEventTarget(event);
        while (target) {
            if (dismissList[target.id]) {
                return;
            }
            target = target.parentNode;
        }
        fluid.each(dismissList, function (dismissFunc, key) {
            dismissFunc(event);
            delete dismissList[key];
        });
    });
    // TODO: extend a configurable equivalent of the above dealing with "focusin" events

    /** Accepts a free hash of nodes and an optional "dismissal function".
     * If dismissFunc is set, this "arms" the dismissal system, such that when a click
     * is received OUTSIDE any of the hierarchy covered by "nodes", the dismissal function
     * will be executed.
     */
    fluid.globalDismissal = function (nodes, dismissFunc) {
        fluid.each(nodes, function (node) {
          // Don't bother to use the real id if it is from a foreign document - we will never receive events
          // from it directly in any case - and foreign documents may be under the control of malign fiends
          // such as tinyMCE who allocate the same id to everything
            var id = fluid.unwrap(node).ownerDocument === document ? fluid.allocateSimpleId(node) : fluid.allocateGuid();
            if (dismissFunc) {
                dismissList[id] = dismissFunc;
            }
            else {
                delete dismissList[id];
            }
        });
    };

    /** Provides an abstraction for determing the current time.
     * This is to provide a fix for FLUID-4762, where IE6 - IE8
     * do not support Date.now().
     */
    fluid.now = function () {
        return Date.now ? Date.now() : (new Date()).getTime();
    };


    /** Sets an interation on a target control, which morally manages a "blur" for
     * a possibly composite region.
     * A timed blur listener is set on the control, which waits for a short period of
     * time (options.delay, defaults to 150ms) to discover whether the reason for the
     * blur interaction is that either a focus or click is being serviced on a nominated
     * set of "exclusions" (options.exclusions, a free hash of elements or jQueries).
     * If no such event is received within the window, options.handler will be called
     * with the argument "control", to service whatever interaction is required of the
     * blur.
     */

    fluid.deadMansBlur = function (control, options) {
        // TODO: This should be rewritten as a proper component
        var that = {options: $.extend(true, {}, fluid.defaults("fluid.deadMansBlur"), options)};
        that.blurPending = false;
        that.lastCancel = 0;
        that.canceller = function (event) {
            fluid.log("Cancellation through " + event.type + " on " + fluid.dumpEl(event.target));
            that.lastCancel = fluid.now();
            that.blurPending = false;
        };
        that.noteProceeded = function () {
            fluid.globalDismissal(that.options.exclusions);
        };
        that.reArm = function () {
            fluid.globalDismissal(that.options.exclusions, that.proceed);
        };
        that.addExclusion = function (exclusions) {
            fluid.globalDismissal(exclusions, that.proceed);
        };
        that.proceed = function (event) {
            fluid.log("Direct proceed through " + event.type + " on " + fluid.dumpEl(event.target));
            that.blurPending = false;
            that.options.handler(control);
        };
        fluid.each(that.options.exclusions, function (exclusion) {
            exclusion = $(exclusion);
            fluid.each(exclusion, function (excludeEl) {
                $(excludeEl).bind("focusin", that.canceller).
                    bind("fluid-focus", that.canceller).
                    click(that.canceller).mousedown(that.canceller);
    // Mousedown is added for FLUID-4212, as a result of Chrome bug 6759, 14204
            });
        });
        if (!that.options.cancelByDefault) {
            $(control).bind("focusout", function (event) {
                fluid.log("Starting blur timer for element " + fluid.dumpEl(event.target));
                var now = fluid.now();
                fluid.log("back delay: " + (now - that.lastCancel));
                if (now - that.lastCancel > that.options.backDelay) {
                    that.blurPending = true;
                }
                setTimeout(function () {
                    if (that.blurPending) {
                        that.options.handler(control);
                    }
                }, that.options.delay);
            });
        }
        else {
            that.reArm();
        }
        return that;
    };

    fluid.defaults("fluid.deadMansBlur", {
        gradeNames: "fluid.function",
        delay: 150,
        backDelay: 100
    });

})(jQuery, fluid_2_0_0);
;
/*
Copyright 2010-2011 OCAD University
Copyright 2010-2011 Lucendo Development Ltd.

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

var fluid_2_0_0 = fluid_2_0_0 || {};

(function ($, fluid) {
    "use strict";

    /** NOTE: All contents of this file are DEPRECATED and no entry point should be considered a supported API **/

    fluid.explodeLocalisedName = function (fileName, locale, defaultLocale) {
        var lastDot = fileName.lastIndexOf(".");
        if (lastDot === -1 || lastDot === 0) {
            lastDot = fileName.length;
        }
        var baseName = fileName.substring(0, lastDot);
        var extension = fileName.substring(lastDot);

        var segs = locale.split("_");

        var exploded = fluid.transform(segs, function (seg, index) {
            var shortSegs = segs.slice(0, index + 1);
            return baseName + "_" + shortSegs.join("_") + extension;
        });
        if (defaultLocale) {
            exploded.unshift(baseName + "_" + defaultLocale + extension);
        }
        return exploded;
    };

    /** Framework-global caching state for fluid.fetchResources **/

    var resourceCache = {};

    var pendingClass = {};

    /** Accepts a hash of structures with free keys, where each entry has either
     * href/url or nodeId set - on completion, callback will be called with the populated
     * structure with fetched resource text in the field "resourceText" for each
     * entry. Each structure may contain "options" holding raw options to be forwarded
     * to jQuery.ajax().
     */

    fluid.fetchResources = function (resourceSpecs, callback, options) {
        var that = {
            options: fluid.copy(options || {})
        };
        that.resourceSpecs = resourceSpecs;
        that.callback = callback;
        that.operate = function () {
            fluid.fetchResources.fetchResourcesImpl(that);
        };
        fluid.each(resourceSpecs, function (resourceSpec, key) {
            resourceSpec.recurseFirer = fluid.makeEventFirer({name: "I/O completion for resource \"" + key + "\""});
            resourceSpec.recurseFirer.addListener(that.operate);
            if (resourceSpec.url && !resourceSpec.href) {
                resourceSpec.href = resourceSpec.url;
            }
            if (that.options.defaultLocale) {
                resourceSpec.defaultLocale = that.options.defaultLocale;
                if (resourceSpec.locale === undefined) {
                    resourceSpec.locale = that.options.defaultLocale;
                }
            }
        });
        if (that.options.amalgamateClasses) {
            fluid.fetchResources.amalgamateClasses(resourceSpecs, that.options.amalgamateClasses, that.operate);
        }
        fluid.fetchResources.explodeForLocales(resourceSpecs);
        that.operate();
        return that;
    };

    fluid.fetchResources.explodeForLocales = function (resourceSpecs) {
        fluid.each(resourceSpecs, function (resourceSpec, key) {
            if (resourceSpec.locale) {
                var exploded = fluid.explodeLocalisedName(resourceSpec.href, resourceSpec.locale, resourceSpec.defaultLocale);
                for (var i = 0; i < exploded.length; ++i) {
                    var newKey = key + "$localised-" + i;
                    var newRecord = $.extend(true, {}, resourceSpec, {
                        href: exploded[i],
                        localeExploded: true
                    });
                    resourceSpecs[newKey] = newRecord;
                }
                resourceSpec.localeExploded = exploded.length;
            }
        });
        return resourceSpecs;
    };

    fluid.fetchResources.condenseOneResource = function (resourceSpecs, resourceSpec, key, localeCount) {
        var localeSpecs = [resourceSpec];
        for (var i = 0; i < localeCount; ++i) {
            var localKey = key + "$localised-" + i;
            localeSpecs.unshift(resourceSpecs[localKey]);
            delete resourceSpecs[localKey];
        }
        var lastNonError = fluid.find_if(localeSpecs, function (spec) {
            return !spec.fetchError;
        });
        if (lastNonError) {
            resourceSpecs[key] = lastNonError;
        }
    };

    fluid.fetchResources.condenseForLocales = function (resourceSpecs) {
        fluid.each(resourceSpecs, function (resourceSpec, key) {
            if (typeof(resourceSpec.localeExploded) === "number") {
                fluid.fetchResources.condenseOneResource(resourceSpecs, resourceSpec, key, resourceSpec.localeExploded);
            }
        });
    };

    fluid.fetchResources.notifyResources = function (that, resourceSpecs, callback) {
        fluid.fetchResources.condenseForLocales(resourceSpecs);
        callback(resourceSpecs);
    };

    /*
     * This function is unsupported: It is not really intended for use by implementors.
     */
    // Add "synthetic" elements of *this* resourceSpec list corresponding to any
    // still pending elements matching the PROLEPTICK CLASS SPECIFICATION supplied
    fluid.fetchResources.amalgamateClasses = function (specs, classes, operator) {
        fluid.each(classes, function (clazz) {
            var pending = pendingClass[clazz];
            fluid.each(pending, function (pendingrec, canon) {
                specs[clazz + "!" + canon] = pendingrec;
                pendingrec.recurseFirer.addListener(operator);
            });
        });
    };

    /*
     * This function is unsupported: It is not really intended for use by implementors.
     */
    fluid.fetchResources.timeSuccessCallback = function (resourceSpec) {
        if (resourceSpec.timeSuccess && resourceSpec.options && resourceSpec.options.success) {
            var success = resourceSpec.options.success;
            resourceSpec.options.success = function () {
                var startTime = new Date();
                var ret = success.apply(null, arguments);
                fluid.log("External callback for URL " + resourceSpec.href + " completed - callback time: " +
                        (new Date().getTime() - startTime.getTime()) + "ms");
                return ret;
            };
        }
    };

    // TODO: Integrate punch-through from old Engage implementation
    function canonUrl(url) {
        return url;
    }

    fluid.fetchResources.clearResourceCache = function (url) {
        if (url) {
            delete resourceCache[canonUrl(url)];
        }
        else {
            fluid.clear(resourceCache);
        }
    };

    /*
     * This function is unsupported: It is not really intended for use by implementors.
     */
    fluid.fetchResources.handleCachedRequest = function (resourceSpec, response, fetchError) {
        var canon = canonUrl(resourceSpec.href);
        var cached = resourceCache[canon];
        if (cached.$$firer$$) {
            fluid.log("Handling request for " + canon + " from cache");
            var fetchClass = resourceSpec.fetchClass;
            if (fetchClass && pendingClass[fetchClass]) {
                fluid.log("Clearing pendingClass entry for class " + fetchClass);
                delete pendingClass[fetchClass][canon];
            }
            var result = {response: response, fetchError: fetchError};
            resourceCache[canon] = result;
            cached.fire(response, fetchError);
        }
    };

    /*
     * This function is unsupported: It is not really intended for use by implementors.
     */
    fluid.fetchResources.completeRequest = function (thisSpec) {
        thisSpec.queued = false;
        thisSpec.completeTime = new Date();
        fluid.log("Request to URL " + thisSpec.href + " completed - total elapsed time: " +
            (thisSpec.completeTime.getTime() - thisSpec.initTime.getTime()) + "ms");
        thisSpec.recurseFirer.fire();
    };

    /*
     * This function is unsupported: It is not really intended for use by implementors.
     */
    fluid.fetchResources.makeResourceCallback = function (thisSpec) {
        return {
            success: function (response) {
                thisSpec.resourceText = response;
                thisSpec.resourceKey = thisSpec.href;
                if (thisSpec.forceCache) {
                    fluid.fetchResources.handleCachedRequest(thisSpec, response);
                }
                fluid.fetchResources.completeRequest(thisSpec);
            },
            error: function (response, textStatus, errorThrown) {
                thisSpec.fetchError = {
                    status: response.status,
                    textStatus: response.textStatus,
                    errorThrown: errorThrown
                };
                if (thisSpec.forceCache) {
                    fluid.fetchResources.handleCachedRequest(thisSpec, null, thisSpec.fetchError);
                }
                fluid.fetchResources.completeRequest(thisSpec);
            }

        };
    };


    /*
     * This function is unsupported: It is not really intended for use by implementors.
     */
    fluid.fetchResources.issueCachedRequest = function (resourceSpec, options) {
        var canon = canonUrl(resourceSpec.href);
        var cached = resourceCache[canon];
        if (!cached) {
            fluid.log("First request for cached resource with url " + canon);
            cached = fluid.makeEventFirer({name: "cache notifier for resource URL " + canon});
            cached.$$firer$$ = true;
            resourceCache[canon] = cached;
            var fetchClass = resourceSpec.fetchClass;
            if (fetchClass) {
                if (!pendingClass[fetchClass]) {
                    pendingClass[fetchClass] = {};
                }
                pendingClass[fetchClass][canon] = resourceSpec;
            }
            options.cache = false; // TODO: Getting weird "not modified" issues on Firefox
            $.ajax(options);
        }
        else {
            if (!cached.$$firer$$) {
                if (cached.response) {
                    options.success(cached.response);
                } else {
                    options.error(cached.fetchError);
                }
            }
            else {
                fluid.log("Request for cached resource which is in flight: url " + canon);
                cached.addListener(function (response, fetchError) {
                    if (response) {
                        options.success(response);
                    } else {
                        options.error(fetchError);
                    }
                });
            }
        }
    };

    /*
     * This function is unsupported: It is not really intended for use by implementors.
     */
    // Compose callbacks in such a way that the 2nd, marked "external" will be applied
    // first if it exists, but in all cases, the first, marked internal, will be
    // CALLED WITHOUT FAIL
    fluid.fetchResources.composeCallbacks = function (internal, external) {
        return external ? (internal ?
        function () {
            try {
                external.apply(null, arguments);
            }
            catch (e) {
                fluid.log("Exception applying external fetchResources callback: " + e);
            }
            internal.apply(null, arguments); // call the internal callback without fail
        } : external ) : internal;
    };

    // unsupported, NON-API function
    fluid.fetchResources.composePolicy = function (target, source) {
        return fluid.fetchResources.composeCallbacks(target, source);
    };

    fluid.defaults("fluid.fetchResources.issueRequest", {
        mergePolicy: {
            success: fluid.fetchResources.composePolicy,
            error: fluid.fetchResources.composePolicy,
            url: "reverse"
        }
    });

    // unsupported, NON-API function
    fluid.fetchResources.issueRequest = function (resourceSpec, key) {
        var thisCallback = fluid.fetchResources.makeResourceCallback(resourceSpec);
        var options = {
            url:     resourceSpec.href,
            success: thisCallback.success,
            error:   thisCallback.error,
            dataType: resourceSpec.dataType || "text"
        };
        fluid.fetchResources.timeSuccessCallback(resourceSpec);
        options = fluid.merge(fluid.defaults("fluid.fetchResources.issueRequest").mergePolicy,
                      options, resourceSpec.options);
        resourceSpec.queued = true;
        resourceSpec.initTime = new Date();
        fluid.log("Request with key " + key + " queued for " + resourceSpec.href);

        if (resourceSpec.forceCache) {
            fluid.fetchResources.issueCachedRequest(resourceSpec, options);
        }
        else {
            $.ajax(options);
        }
    };


    fluid.fetchResources.fetchResourcesImpl = function (that) {
        var complete = true;
        var allSync = true;
        var resourceSpecs = that.resourceSpecs;
        for (var key in resourceSpecs) {
            var resourceSpec = resourceSpecs[key];
            if (!resourceSpec.options || resourceSpec.options.async) {
                allSync = false;
            }
            if (resourceSpec.href && !resourceSpec.completeTime) {
                if (!resourceSpec.queued) {
                    fluid.fetchResources.issueRequest(resourceSpec, key);
                }
                if (resourceSpec.queued) {
                    complete = false;
                }
            }
            else if (resourceSpec.nodeId && !resourceSpec.resourceText) {
                var node = document.getElementById(resourceSpec.nodeId);
                // upgrade this to somehow detect whether node is "armoured" somehow
                // with comment or CDATA wrapping
                resourceSpec.resourceText = fluid.dom.getElementText(node);
                resourceSpec.resourceKey = resourceSpec.nodeId;
            }
        }
        if (complete && that.callback && !that.callbackCalled) {
            that.callbackCalled = true;
            if ($.browser.mozilla && !allSync) {
                // Defer this callback to avoid debugging problems on Firefox
                setTimeout(function () {
                    fluid.fetchResources.notifyResources(that, resourceSpecs, that.callback);
                }, 1);
            }
            else {
                fluid.fetchResources.notifyResources(that, resourceSpecs, that.callback);
            }
        }
    };

    // TODO: This framework function is a stop-gap before the "ginger world" is capable of
    // asynchronous instantiation. It currently performs very poor fidelity expansion of a
    // component's options to discover "resources" only held in the static environment
    fluid.fetchResources.primeCacheFromResources = function (componentName) {
        var resources = fluid.defaults(componentName).resources;
        var expanded = (fluid.expandOptions ? fluid.expandOptions : fluid.identity)(fluid.copy(resources));
        fluid.fetchResources(expanded);
    };

    /** Utilities invoking requests for expansion **/
    fluid.registerNamespace("fluid.expander");

    /*
     * This function is unsupported: It is not really intended for use by implementors.
     */
    fluid.expander.makeDefaultFetchOptions = function (successdisposer, failid, options) {
        return $.extend(true, {dataType: "text"}, options, {
            success: function (response, environmentdisposer) {
                var json = JSON.parse(response);
                environmentdisposer(successdisposer(json));
            },
            error: function (response, textStatus) {
                fluid.log("Error fetching " + failid + ": " + textStatus);
            }
        });
    };

    /*
     * This function is unsupported: It is not really intended for use by implementors.
     */
    fluid.expander.makeFetchExpander = function (options) {
        return { expander: {
            type: "fluid.expander.deferredFetcher",
            href: options.url,
            options: fluid.expander.makeDefaultFetchOptions(options.disposer, options.url, options.options),
            resourceSpecCollector: "{resourceSpecCollector}",
            fetchKey: options.fetchKey
        }};
    };

    fluid.expander.deferredFetcher = function (deliverer, source, expandOptions) {
        var expander = source.expander;
        var spec = fluid.copy(expander);
        // fetch the "global" collector specified in the external environment to receive
        // this resourceSpec
        var collector = fluid.expand(expander.resourceSpecCollector, expandOptions);
        delete spec.type;
        delete spec.resourceSpecCollector;
        delete spec.fetchKey;
        var environmentdisposer = function (disposed) {
            deliverer(disposed);
        };
        // replace the callback which is there (taking 2 arguments) with one which
        // directly responds to the request, passing in the result and OUR "disposer" -
        // which once the user has processed the response (say, parsing JSON and repackaging)
        // finally deposits it in the place of the expander in the tree to which this reference
        // has been stored at the point this expander was evaluated.
        spec.options.success = function (response) {
            expander.options.success(response, environmentdisposer);
        };
        var key = expander.fetchKey || fluid.allocateGuid();
        collector[key] = spec;
        return fluid.NO_VALUE;
    };


})(jQuery, fluid_2_0_0);
;
/*
Copyright 2016 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

var fluid_2_0_0 = fluid_2_0_0 || {};

(function ($, fluid) {

    "use strict";

    /**
     * A configurable component to allow users to load multiple resources via AJAX requests.
     * The resources can be localised by means of options `locale`, `defaultLocale`. Once all
     * resources are loaded, the event `onResourceLoaded` will be fired, which can be used
     * to time the creation of components dependent on the resources.
     *
     * @param {Object} options
     */

    fluid.defaults("fluid.resourceLoader", {
        gradeNames: ["fluid.component"],
        listeners: {
            "onCreate.loadResources": {
                listener: "fluid.resourceLoader.loadResources",
                args: ["{that}", {expander: {func: "{that}.resolveResources"}}]
            }
        },
        defaultLocale: null,
        locale: null,
        terms: {},  // Must be supplied by integrators
        resources: {},  // Must be supplied by integrators
        resourceOptions: {},
        // Unsupported, non-API option
        invokers: {
            transformURL: {
                funcName: "fluid.stringTemplate",
                args: ["{arguments}.0", "{that}.options.terms"]
            },
            resolveResources: {
                funcName: "fluid.resourceLoader.resolveResources",
                args: "{that}"
            }
        },
        events: {
            onResourcesLoaded: null
        }
    });

    fluid.resourceLoader.resolveResources = function (that) {
        var mapped = fluid.transform(that.options.resources, that.transformURL);

        return fluid.transform(mapped, function (url) {
            var resourceSpec = {url: url, forceCache: true, options: that.options.resourceOptions};
            return $.extend(resourceSpec, fluid.filterKeys(that.options, ["defaultLocale", "locale"]));
        });
    };

    fluid.resourceLoader.loadResources = function (that, resources) {
        fluid.fetchResources(resources, function () {
            that.resources = resources;
            that.events.onResourcesLoaded.fire(resources);
        });
    };

})(jQuery, fluid_2_0_0);
;
/*
Copyright 2008-2009 University of Toronto
Copyright 2010-2011 OCAD University
Copyright 2015 Raising the Floor (International)

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

var fluid_2_0_0 = fluid_2_0_0 || {};

(function ($, fluid) {
    "use strict";

    fluid.registerNamespace("fluid.contextAware");

    fluid.defaults("fluid.contextAware.marker", {
        gradeNames: ["fluid.component"]
    });


    // unsupported, NON-API function
    fluid.contextAware.makeCheckMarkers = function (checks, path, instantiator) {
        fluid.each(checks, function (value, markerTypeName) {
            fluid.constructSingle(path, {
                type: markerTypeName,
                gradeNames: "fluid.contextAware.marker",
                value: value
            }, instantiator);
        });

    };
    /** Peforms the computation for `fluid.contextAware.makeChecks` and returns a structure suitable for being sent to `fluid.contextAware.makeCheckMarkers` -
     *
     * @return A hash of marker type names to grade names - this can be sent to fluid.contextAware.makeCheckMarkers
     */
    // unsupported, NON-API function
    fluid.contextAware.performChecks = function (checkHash) {
        return fluid.transform(checkHash, function (checkRecord) {
            if (typeof(checkRecord) === "function") {
                checkRecord = {func: checkRecord};
            } else if (typeof(checkRecord) === "string") {
                checkRecord = {funcName: checkRecord};
            }
            if (fluid.isPrimitive(checkRecord)) {
                return checkRecord;
            } else if ("value" in checkRecord) {
                return checkRecord.value;
            } else if ("func" in checkRecord) {
                return checkRecord.func();
            } else if ("funcName" in checkRecord) {
                return fluid.invokeGlobalFunction(checkRecord.funcName);
            } else {
                fluid.fail("Error in contextAwareness check record ", checkRecord, " - must contain an entry with name value, func, or funcName");
            }
        });
    };

    /**
     * Takes an object whose keys are check context names and whose values are check records, designating a collection of context markers which might be registered at a location
     * in the component tree.

     * @param checkHash {Object} The keys in this structure are the context names to be supplied if the check passes, and the values are check records.
     * A check record contains:
     *    ONE OF:
     *    value {Any} [optional] A literal value name to be attached to the context
     *    func {Function} [optional] A zero-arg function to be called to compute the value
     *    funcName {String} [optional] The name of a zero-arg global function which will compute the value
     * If the check record consists of a Number or Boolean, it is assumed to be the value given to "value".
     * @param path {String|Array} [optional] The path in the component tree at which the check markers are to be registered. If omitted, "" is assumed
     * @param instantiator {Instantiator} [optional] The instantiator holding the component tree which will receive the markers. If omitted, use `fluid.globalInstantiator`.
     */
    fluid.contextAware.makeChecks = function (checkHash, path, instantiator) {
        var checkOptions = fluid.contextAware.performChecks(checkHash);
        fluid.contextAware.makeCheckMarkers(checkOptions, path, instantiator);
    };

    /**
     * Forgets a check made at a particular level of the component tree.
     * @param markerNames {Array of String} The marker typeNames whose check values are to be forgotten
     * @param path {String|Array} [optional] The path in the component tree at which the check markers are to be removed. If omitted, "" is assumed
     * @param instantiator {Instantiator} [optional] The instantiator holding the component tree the markers are to be removed from. If omitted, use `fluid.globalInstantiator`.
     */
    fluid.contextAware.forgetChecks = function (markerNames, path, instantiator) {
        instantiator = instantiator || fluid.globalInstantiator;
        path = path || [];
        var markerArray = fluid.makeArray(markerNames);
        fluid.each(markerArray, function (markerName) {
            var memberName = fluid.typeNameToMemberName(markerName);
            var segs = fluid.model.parseToSegments(path, instantiator.parseEL, true);
            segs.push(memberName);
            fluid.destroy(segs, instantiator);
        });
    };

    /** A grade to be given to a component which requires context-aware adaptation.
     * This grade consumes configuration held in the block named "contextAwareness", which is an object whose keys are check namespaces and whose values hold
     * sequences of "checks" to be made in the component tree above the component. The value searched by
     * each check is encoded as the element named `contextValue` - this either represents an IoC reference to a component
     * or a particular value held at the component. If this reference has no path component, the path ".options.value" will be assumed.
     * These checks seek contexts which
     * have been previously registered using fluid.contextAware.makeChecks. The first context which matches
     * with a value of `true` terminates the search, and returns by applying the grade names held in `gradeNames` to the current component.
     * If no check matches, the grades held in `defaultGradeNames` will be applied.
     */
    fluid.defaults("fluid.contextAware", {
        gradeNames: ["{that}.check"],
        mergePolicy: {
            contextAwareness: "noexpand"
        },
        contextAwareness: {
            // Hash of names (check namespaces) to records: {
            //     checks: {}, // Hash of check namespace to: {
            //         contextValue: IoCExpression testing value in environment,
            //         gradeNames: gradeNames which will be output,
            //         priority: String/Number for priority of check [optional]
            //         equals: Value to be compared to contextValue [optional - default is `true`]
            //     defaultGradeNames: // String or Array of String holding default gradeNames which will be output if no check matches [optional]
            //     priority: // Number or String encoding priority relative to other records (same format as with event listeners) [optional]
            // }
        },
        invokers: {
            check: {
                funcName: "fluid.contextAware.check",
                args: ["{that}", "{that}.options.contextAwareness"]
            }
        }
    });

    fluid.contextAware.getCheckValue = function (that, reference) {
        // cf. core of distributeOptions!
        var targetRef = fluid.parseContextReference(reference);
        var targetComponent = fluid.resolveContext(targetRef.context, that);
        var path = targetRef.path || ["options", "value"];
        var value = fluid.getForComponent(targetComponent, path);
        return value;
    };

    // unsupported, NON-API function
    fluid.contextAware.checkOne = function (that, contextAwareRecord) {
        if (contextAwareRecord.checks && contextAwareRecord.checks.contextValue) {
            fluid.fail("Nesting error in contextAwareness record ", contextAwareRecord, " - the \"checks\" entry must contain a hash and not a contextValue/gradeNames record at top level");
        }
        var checkList = fluid.parsePriorityRecords(contextAwareRecord.checks, "contextAwareness checkRecord");
        return fluid.find(checkList, function (check) {
            if (!check.contextValue) {
                fluid.fail("Cannot perform check for contextAwareness record ", check, " without a valid field named \"contextValue\"");
            }
            var value = fluid.contextAware.getCheckValue(that, check.contextValue);
            if (check.equals === undefined ? value : value === check.equals) {
                return check.gradeNames;
            }
        }, contextAwareRecord.defaultGradeNames);
    };

    // unsupported, NON-API function
    fluid.contextAware.check = function (that, contextAwarenessOptions) {
        var gradeNames = [];
        var contextAwareList = fluid.parsePriorityRecords(contextAwarenessOptions, "contextAwareness adaptationRecord");
        fluid.each(contextAwareList, function (record) {
            var matched = fluid.contextAware.checkOne(that, record);
            gradeNames = gradeNames.concat(fluid.makeArray(matched));
        });
        return gradeNames;
    };

    /** Given a set of options, broadcast an adaptation to all instances of a particular component in a particular context. ("new demands blocks").
     * This has the effect of fabricating a grade with a particular name with an options distribution to `{/ typeName}` for the required component,
     * and then constructing a single well-known instance of it.
     * Options layout:
     *  distributionName {String} A grade name - the name to be given to the fabricated grade
     *  targetName {String} A grade name - the name of the grade to receive the adaptation
     *  adaptationName {String} the name of the contextAwareness record to receive the record - this will be a simple string
     *  checkName {String} the name of the check within the contextAwareness record to receive the record - this will be a simple string
     *  record {Object} the record to be broadcast into contextAwareness - should contain entries
     *      contextValue {IoC expression} the context value to be checked to activate the adaptation
     *      gradeNames {String/Array of String} the grade names to be supplied to the adapting target (matching advisedName)
     */
    fluid.contextAware.makeAdaptation = function (options) {
        fluid.expect("fluid.contextAware.makeAdaptation", options, ["distributionName", "targetName", "adaptationName", "checkName", "record"]);
        fluid.defaults(options.distributionName, {
            gradeNames: ["fluid.component"],
            distributeOptions: {
                target: "{/ " + options.targetName + "}.options.contextAwareness." + options.adaptationName + ".checks." + options.checkName,
                record: options.record
            }
        });
        fluid.constructSingle([], options.distributionName);
    };

    // Context awareness for the browser environment

    fluid.contextAware.isBrowser = function () {
        return typeof(window) !== "undefined" && window.document;
    };

    fluid.contextAware.makeChecks({
        "fluid.browser": {
            funcName: "fluid.contextAware.isBrowser"
        }
    });

})(jQuery, fluid_2_0_0);
;
/*
Copyright 2008-2009 University of Toronto
Copyright 2010-2011 OCAD University
Copyright 2015 Raising the Floor (International)

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

var fluid_2_0_0 = fluid_2_0_0 || {};

(function ($, fluid) {
    "use strict";

    fluid.registerNamespace("fluid.enhance");

    /**********************************************************
     * This code runs immediately upon inclusion of this file *
     **********************************************************/

    // Use JavaScript to hide any markup that is specifically in place for cases when JavaScript is off.
    // Note: the use of fl-ProgEnhance-basic is deprecated, and replaced by fl-progEnhance-basic.
    // It is included here for backward compatibility only.
    // Distinguish the standalone jQuery from the real one so that this can be included in IoC standalone tests
    if (fluid.contextAware.isBrowser() && $.fn) {
        $("head").append("<style type='text/css'>.fl-progEnhance-basic, .fl-ProgEnhance-basic { display: none; } .fl-progEnhance-enhanced, .fl-ProgEnhance-enhanced { display: block; }</style>");
    }

})(jQuery, fluid_2_0_0);
;
// =========================================================================
//
// tinyxmlsax.js - an XML SAX parser in JavaScript compressed for downloading
//
// version 3.1
//
// =========================================================================
//
// Copyright (C) 2000 - 2002, 2003 Michael Houghton (mike@idle.org), Raymond Irving and David Joham (djoham@yahoo.com)
//
// This library is free software; you can redistribute it and/or
// modify it under the terms of the GNU Lesser General Public
// License as published by the Free Software Foundation; either
// version 2.1 of the License, or (at your option) any later version.

// This library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
// Lesser General Public License for more details.

// You should have received a copy of the GNU Lesser General Public
// License along with this library; if not, write to the Free Software
// Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
//
// Visit the XML for <SCRIPT> home page at http://xmljs.sourceforge.net
//

/*
The zlib/libpng License

Copyright (c) 2000 - 2002, 2003 Michael Houghton (mike@idle.org), Raymond Irving and David Joham (djoham@yahoo.com)

This software is provided 'as-is', without any express or implied
warranty. In no event will the authors be held liable for any damages
arising from the use of this software.

Permission is granted to anyone to use this software for any purpose,
including commercial applications, and to alter it and redistribute it
freely, subject to the following restrictions:

    1. The origin of this software must not be misrepresented; you must not
    claim that you wrote the original software. If you use this software
    in a product, an acknowledgment in the product documentation would be
    appreciated but is not required.

    2. Altered source versions must be plainly marked as such, and must not be
    misrepresented as being the original software.

    3. This notice may not be removed or altered from any source
    distribution.
 */

var fluid_2_0_0 = fluid_2_0_0 || {};

(function ($, fluid) {
    "use strict";

    fluid.XMLP = function(strXML) {
        return fluid.XMLP.XMLPImpl(strXML);
    };


    // List of closed HTML tags, taken from JQuery 1.2.3
    fluid.XMLP.closedTags = {
        abbr: true,
        br: true,
        col: true,
        img: true,
        input: true,
        link: true,
        meta: true,
        param: true,
        hr: true,
        area: true,
        embed:true
    };

    fluid.XMLP._NONE = 0;
    fluid.XMLP._ELM_B = 1;
    fluid.XMLP._ELM_E = 2;
    fluid.XMLP._ELM_EMP = 3;
    fluid.XMLP._ATT = 4;
    fluid.XMLP._TEXT = 5;
    fluid.XMLP._ENTITY = 6;
    fluid.XMLP._PI = 7;
    fluid.XMLP._CDATA = 8;
    fluid.XMLP._COMMENT = 9;
    fluid.XMLP._DTD = 10;
    fluid.XMLP._ERROR = 11;

    fluid.XMLP._CONT_XML = 0;
    fluid.XMLP._CONT_ALT = 1;
    fluid.XMLP._ATT_NAME = 0;
    fluid.XMLP._ATT_VAL = 1;

    fluid.XMLP._STATE_PROLOG = 1;
    fluid.XMLP._STATE_DOCUMENT = 2;
    fluid.XMLP._STATE_MISC = 3;

    fluid.XMLP._errs = [];
    fluid.XMLP._errs[fluid.XMLP.ERR_CLOSE_PI = 0 ] = "PI: missing closing sequence";
    fluid.XMLP._errs[fluid.XMLP.ERR_CLOSE_DTD = 1 ] = "DTD: missing closing sequence";
    fluid.XMLP._errs[fluid.XMLP.ERR_CLOSE_COMMENT = 2 ] = "Comment: missing closing sequence";
    fluid.XMLP._errs[fluid.XMLP.ERR_CLOSE_CDATA = 3 ] = "CDATA: missing closing sequence";
    fluid.XMLP._errs[fluid.XMLP.ERR_CLOSE_ELM = 4 ] = "Element: missing closing sequence";
    fluid.XMLP._errs[fluid.XMLP.ERR_CLOSE_ENTITY = 5 ] = "Entity: missing closing sequence";
    fluid.XMLP._errs[fluid.XMLP.ERR_PI_TARGET = 6 ] = "PI: target is required";
    fluid.XMLP._errs[fluid.XMLP.ERR_ELM_EMPTY = 7 ] = "Element: cannot be both empty and closing";
    fluid.XMLP._errs[fluid.XMLP.ERR_ELM_NAME = 8 ] = "Element: name must immediately follow \"<\"";
    fluid.XMLP._errs[fluid.XMLP.ERR_ELM_LT_NAME = 9 ] = "Element: \"<\" not allowed in element names";
    fluid.XMLP._errs[fluid.XMLP.ERR_ATT_VALUES = 10] = "Attribute: values are required and must be in quotes";
    fluid.XMLP._errs[fluid.XMLP.ERR_ATT_LT_NAME = 11] = "Element: \"<\" not allowed in attribute names";
    fluid.XMLP._errs[fluid.XMLP.ERR_ATT_LT_VALUE = 12] = "Attribute: \"<\" not allowed in attribute values";
    fluid.XMLP._errs[fluid.XMLP.ERR_ATT_DUP = 13] = "Attribute: duplicate attributes not allowed";
    fluid.XMLP._errs[fluid.XMLP.ERR_ENTITY_UNKNOWN = 14] = "Entity: unknown entity";
    fluid.XMLP._errs[fluid.XMLP.ERR_INFINITELOOP = 15] = "Infinite loop";
    fluid.XMLP._errs[fluid.XMLP.ERR_DOC_STRUCTURE = 16] = "Document: only comments, processing instructions, or whitespace allowed outside of document element";
    fluid.XMLP._errs[fluid.XMLP.ERR_ELM_NESTING = 17] = "Element: must be nested correctly";


    fluid.XMLP._checkStructure = function(that, iEvent) {
        var stack = that.m_stack;
        if (fluid.XMLP._STATE_PROLOG == that.m_iState) {
            // disabled original check for text node in prologue
            that.m_iState = fluid.XMLP._STATE_DOCUMENT;
        }

        if (fluid.XMLP._STATE_DOCUMENT === that.m_iState) {
            if ((fluid.XMLP._ELM_B == iEvent) || (fluid.XMLP._ELM_EMP == iEvent)) {
                that.m_stack[stack.length] = that.getName();
            }
            if ((fluid.XMLP._ELM_E == iEvent) || (fluid.XMLP._ELM_EMP == iEvent)) {
                if (stack.length === 0) {
                    //return fluid.XMLP._setErr(XMLP.ERR_DOC_STRUCTURE);
                    return fluid.XMLP._NONE;
                }
                var strTop = stack[stack.length - 1];
                that.m_stack.length--;
                if (strTop === null || strTop !== that.getName()) {
                    return fluid.XMLP._setErr(that, fluid.XMLP.ERR_ELM_NESTING);
                }
            }

            // disabled original check for text node in epilogue - "MISC" state is disused
        }
        return iEvent;
    };


    fluid.XMLP._parseCDATA = function(that, iB) {
        var iE = that.m_xml.indexOf("]]>", iB);
        if (iE == -1) { return fluid.XMLP._setErr(that, fluid.XMLP.ERR_CLOSE_CDATA);}
        fluid.XMLP._setContent(that, fluid.XMLP._CONT_XML, iB, iE);
        that.m_iP = iE + 3;
        return fluid.XMLP._CDATA;
    };


    fluid.XMLP._parseComment = function(that, iB) {
        var iE = that.m_xml.indexOf("-" + "->", iB);
        if (iE == -1) {
            return fluid.XMLP._setErr(that, fluid.XMLP.ERR_CLOSE_COMMENT);
            }
        fluid.XMLP._setContent(that, fluid.XMLP._CONT_XML, iB - 4, iE + 3);
        that.m_iP = iE + 3;
        return fluid.XMLP._COMMENT;
    };

    fluid.XMLP._parseDTD = function(that, iB) {
        var iE, strClose, iInt, iLast;
        iE = that.m_xml.indexOf(">", iB);
        if (iE == -1) {
            return fluid.XMLP._setErr(that, fluid.XMLP.ERR_CLOSE_DTD);
        }
        iInt = that.m_xml.indexOf("[", iB);
        strClose = ((iInt != -1) && (iInt < iE)) ? "]>" : ">";
        while (true) {
            if (iE == iLast) {
                return fluid.XMLP._setErr(that, fluid.XMLP.ERR_INFINITELOOP);
            }
            iLast = iE;
            iE = that.m_xml.indexOf(strClose, iB);
            if(iE == -1) {
                return fluid.XMLP._setErr(that, fluid.XMLP.ERR_CLOSE_DTD);
            }
            if (that.m_xml.substring(iE - 1, iE + 2) != "]]>") { break;}
        }
        that.m_iP = iE + strClose.length;
        return fluid.XMLP._DTD;
    };

    fluid.XMLP._parsePI = function(that, iB) {
        var iE, iTB, iTE, iCB, iCE;
        iE = that.m_xml.indexOf("?>", iB);
        if (iE == -1) { return fluid.XMLP._setErr(that, fluid.XMLP.ERR_CLOSE_PI);}
        iTB = fluid.SAXStrings.indexOfNonWhitespace(that.m_xml, iB, iE);
        if (iTB == -1) { return fluid.XMLP._setErr(that, fluid.XMLP.ERR_PI_TARGET);}
        iTE = fluid.SAXStrings.indexOfWhitespace(that.m_xml, iTB, iE);
        if (iTE == -1) { iTE = iE;}
        iCB = fluid.SAXStrings.indexOfNonWhitespace(that.m_xml, iTE, iE);
        if (iCB == -1) { iCB = iE;}
        iCE = fluid.SAXStrings.lastIndexOfNonWhitespace(that.m_xml, iCB, iE);
        if (iCE == -1) { iCE = iE - 1;}
        that.m_name = that.m_xml.substring(iTB, iTE);
        fluid.XMLP._setContent(that, fluid.XMLP._CONT_XML, iCB, iCE + 1);
        that.m_iP = iE + 2;
        return fluid.XMLP._PI;
    };

    fluid.XMLP._parseText = function(that, iB) {
        var iE = that.m_xml.indexOf("<", iB);
        if (iE == -1) { iE = that.m_xml.length;}
        fluid.XMLP._setContent(that, fluid.XMLP._CONT_XML, iB, iE);
        that.m_iP = iE;
        return fluid.XMLP._TEXT;
    };

    fluid.XMLP._setContent = function(that, iSrc) {
        var args = arguments;
        if (fluid.XMLP._CONT_XML == iSrc) {
            that.m_cAlt = null;
            that.m_cB = args[2];
            that.m_cE = args[3];
        }
        else {
            that.m_cAlt = args[2];
            that.m_cB = 0;
            that.m_cE = args[2].length;
        }

        that.m_cSrc = iSrc;
    };

    fluid.XMLP._setErr = function(that, iErr) {
        var strErr = fluid.XMLP._errs[iErr];
        that.m_cAlt = strErr;
        that.m_cB = 0;
        that.m_cE = strErr.length;
        that.m_cSrc = fluid.XMLP._CONT_ALT;
        return fluid.XMLP._ERROR;
    };


    fluid.XMLP._parseElement = function(that, iB) {
        var iE, iDE, iRet;
        var iType, strN, iLast;
        iDE = iE = that.m_xml.indexOf(">", iB);
        if (iE == -1) {
            return fluid.XMLP._setErr(that, fluid.XMLP.ERR_CLOSE_ELM);
        }
        if (that.m_xml.charAt(iB) == "/") {
            iType = fluid.XMLP._ELM_E;
            iB++;
        }
        else {
            iType = fluid.XMLP._ELM_B;
        }
        if (that.m_xml.charAt(iE - 1) == "/") {
            if (iType == fluid.XMLP._ELM_E) {
                return fluid.XMLP._setErr(that, fluid.XMLP.ERR_ELM_EMPTY);
                }
            iType = fluid.XMLP._ELM_EMP; iDE--;
        }

        that.nameRegex.lastIndex = iB;
        var nameMatch = that.nameRegex.exec(that.m_xml);
        if (!nameMatch) {
            return fluid.XMLP._setErr(that, fluid.XMLP.ERR_ELM_NAME);
        }
        strN = nameMatch[1].toLowerCase();
        // This branch is specially necessary for broken markup in IE. If we see an li
        // tag apparently directly nested in another, first emit a synthetic close tag
        // for the earlier one without advancing the pointer, and set a flag to ensure
        // doing this just once.
        if ("li" === strN && iType !== fluid.XMLP._ELM_E && that.m_stack.length > 0 &&
            that.m_stack[that.m_stack.length - 1] === "li" && !that.m_emitSynthetic) {
            that.m_name = "li";
            that.m_emitSynthetic = true;
            return fluid.XMLP._ELM_E;
        }
        // We have acquired the tag name, now set about parsing any attribute list
        that.m_attributes = {};
        that.m_cAlt = "";

        if (that.nameRegex.lastIndex < iDE) {
            that.m_iP = that.nameRegex.lastIndex;
            while (that.m_iP < iDE) {
                that.attrStartRegex.lastIndex = that.m_iP;
                var attrMatch = that.attrStartRegex.exec(that.m_xml);
                if (!attrMatch) {
                    return fluid.XMLP._setErr(that, fluid.XMLP.ERR_ATT_VALUES);
                }
                var attrname = attrMatch[1].toLowerCase();
                var attrval;
                if (that.m_xml.charCodeAt(that.attrStartRegex.lastIndex) === 61) { // =
                    var valRegex = that.m_xml.charCodeAt(that.attrStartRegex.lastIndex + 1) === 34? that.attrValRegex : that.attrValIERegex; // "
                    valRegex.lastIndex = that.attrStartRegex.lastIndex + 1;
                    attrMatch = valRegex.exec(that.m_xml);
                    if (!attrMatch) {
                        return fluid.XMLP._setErr(that, fluid.XMLP.ERR_ATT_VALUES);
                    }
                    attrval = attrMatch[1];
                }
                else { // accommodate insanity on unvalued IE attributes
                    attrval = attrname;
                    valRegex = that.attrStartRegex;
                }
                if (!that.m_attributes[attrname] || that.m_attributes[attrname] === attrval) {
                    // last branch required because of fresh duplicate attribute bug introduced in IE10 and above - FLUID-5204
                    that.m_attributes[attrname] = attrval;
                }
                else {
                    return fluid.XMLP._setErr(that, fluid.XMLP.ERR_ATT_DUP);
                }
                that.m_iP = valRegex.lastIndex;

            }
        }
        if (strN.indexOf("<") != -1) {
            return fluid.XMLP._setErr(that, fluid.XMLP.ERR_ELM_LT_NAME);
        }

        that.m_name = strN;
        that.m_iP = iE + 1;
        // Check for corrupted "closed tags" from innerHTML
        if (fluid.XMLP.closedTags[strN]) {
            that.closeRegex.lastIndex = iE + 1;
            var closeMatch = that.closeRegex.exec;
            if (closeMatch) {
                var matchclose = that.m_xml.indexOf(strN, closeMatch.lastIndex);
                if (matchclose === closeMatch.lastIndex) {
                    return iType; // bail out, a valid close tag is separated only by whitespace
                }
                else {
                    return fluid.XMLP._ELM_EMP;
                }
            }
        }
        that.m_emitSynthetic = false;
        return iType;
    };

    fluid.XMLP._parse = function(that) {
        var iP = that.m_iP;
        var xml = that.m_xml;
        if (iP === xml.length) { return fluid.XMLP._NONE;}
        var c = xml.charAt(iP);
        if (c === '<') {
            var c2 = xml.charAt(iP + 1);
            if (c2 === '?') {
                return fluid.XMLP._parsePI(that, iP + 2);
            }
            else if (c2 === '!') {
                if (iP === xml.indexOf("<!DOCTYPE", iP)) {
                    return fluid.XMLP._parseDTD(that, iP + 9);
                }
                else if (iP === xml.indexOf("<!--", iP)) {
                    return fluid.XMLP._parseComment(that, iP + 4);
                }
                else if (iP === xml.indexOf("<![CDATA[", iP)) {
                    return fluid.XMLP._parseCDATA(that, iP + 9);
                }
            }
            else {
                return fluid.XMLP._parseElement(that, iP + 1);
            }
        }
        else {
            return fluid.XMLP._parseText(that, iP);
        }
    };


    fluid.XMLP.XMLPImpl = function(strXML) {
        var that = {};
        that.m_xml = strXML;
        that.m_iP = 0;
        that.m_iState = fluid.XMLP._STATE_PROLOG;
        that.m_stack = [];
        that.m_attributes = {};
        that.m_emitSynthetic = false; // state used for emitting synthetic tags used to correct broken markup (IE)

        that.getColumnNumber = function() {
            return fluid.SAXStrings.getColumnNumber(that.m_xml, that.m_iP);
        };

        that.getContent = function() {
            return (that.m_cSrc == fluid.XMLP._CONT_XML) ? that.m_xml : that.m_cAlt;
        };

        that.getContentBegin = function() { return that.m_cB;};
        that.getContentEnd = function() { return that.m_cE;};

        that.getLineNumber = function() {
            return fluid.SAXStrings.getLineNumber(that.m_xml, that.m_iP);
        };

        that.getName = function() {
            return that.m_name;
        };

        that.next = function() {
            return fluid.XMLP._checkStructure(that, fluid.XMLP._parse(that));
        };

        that.nameRegex = /([^\s\/>]+)/g;
        that.attrStartRegex = /\s*([\w:_][\w:_\-\.]*)/gm;
        that.attrValRegex = /\"([^\"]*)\"\s*/gm; // "normal" XHTML attribute values
        that.attrValIERegex = /([^\>\s]+)\s*/gm; // "stupid" unquoted IE attribute values (sometimes)
        that.closeRegex = /\s*<\//g;

        return that;
    };


    fluid.SAXStrings = {};

    fluid.SAXStrings.WHITESPACE = " \t\n\r";
    fluid.SAXStrings.QUOTES = "\"'";
    fluid.SAXStrings.getColumnNumber = function (strD, iP) {
        if (!strD) { return -1;}
        iP = iP || strD.length;
        var arrD = strD.substring(0, iP).split("\n");
        arrD.length--;
        var iLinePos = arrD.join("\n").length;
        return iP - iLinePos;
    };

    fluid.SAXStrings.getLineNumber = function (strD, iP) {
        if (!strD) { return -1;}
        iP = iP || strD.length;
        return strD.substring(0, iP).split("\n").length;
    };

    fluid.SAXStrings.indexOfNonWhitespace = function (strD, iB, iE) {
        if (!strD) return -1;
        iB = iB || 0;
        iE = iE || strD.length;

        for (var i = iB; i < iE; ++ i) {
            var c = strD.charAt(i);
            if (c !== ' ' && c !== '\t' && c !== '\n' && c !== '\r') return i;
        }
        return -1;
    };


    fluid.SAXStrings.indexOfWhitespace = function (strD, iB, iE) {
        if (!strD) { return -1;}
        iB = iB || 0;
        iE = iE || strD.length;
        for (var i = iB; i < iE; i++) {
            if (fluid.SAXStrings.WHITESPACE.indexOf(strD.charAt(i)) != -1) { return i;}
        }
        return -1;
    };


    fluid.SAXStrings.lastIndexOfNonWhitespace = function (strD, iB, iE) {
        if (!strD) { return -1;}
        iB = iB || 0; iE = iE || strD.length;
        for (var i = iE - 1; i >= iB; i--) {
        if (fluid.SAXStrings.WHITESPACE.indexOf(strD.charAt(i)) == -1) {
            return i;
            }
        }
        return -1;
    };

    fluid.SAXStrings.replace = function(strD, iB, iE, strF, strR) {
        if (!strD) { return "";}
        iB = iB || 0;
        iE = iE || strD.length;
        return strD.substring(iB, iE).split(strF).join(strR);
    };

})(jQuery, fluid_2_0_0);
;
/*
Copyright 2008-2010 University of Cambridge
Copyright 2008-2009 University of Toronto
Copyright 2010-2011 Lucendo Development Ltd.

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

fluid_2_0_0 = fluid_2_0_0 || {};

(function ($, fluid) {
    "use strict";

    // unsupported, non-API function
    fluid.parseTemplate = function (template, baseURL, scanStart, cutpoints_in, opts) {
        opts = opts || {};

        if (!template) {
            fluid.fail("empty template supplied to fluid.parseTemplate");
        }

        var t;
        var parser;
        var tagstack;
        var lumpindex = 0;
        var nestingdepth = 0;
        var justended = false;

        var defstart = -1;
        var defend = -1;

        var debugMode = false;

        var cutpoints = []; // list of selector, tree, id
        var simpleClassCutpoints = {};

        var cutstatus = [];

        var XMLLump = function (lumpindex, nestingdepth) {
            return {
                //rsfID: "",
                //text: "",
                //downmap: {},
                //attributemap: {},
                //finallump: {},
                nestingdepth: nestingdepth,
                lumpindex: lumpindex,
                parent: t
            };
        };

        function isSimpleClassCutpoint(tree) {
            return tree.length === 1 && tree[0].predList.length === 1 && tree[0].predList[0].clazz;
        }

        function init(baseURLin, debugModeIn, cutpointsIn) {
            t.rootlump = XMLLump(0, -1); // eslint-disable-line new-cap
            tagstack = [t.rootlump];
            lumpindex = 0;
            nestingdepth = 0;
            justended = false;
            defstart = -1;
            defend = -1;
            baseURL = baseURLin;
            debugMode = debugModeIn;
            if (cutpointsIn) {
                for (var i = 0; i < cutpointsIn.length; ++i) {
                    var tree = fluid.parseSelector(cutpointsIn[i].selector, fluid.simpleCSSMatcher);
                    var clazz = isSimpleClassCutpoint(tree);
                    if (clazz) {
                        simpleClassCutpoints[clazz] = cutpointsIn[i].id;
                    }
                    else {
                        cutstatus.push([]);
                        cutpoints.push($.extend({}, cutpointsIn[i], {tree: tree}));
                    }
                }
            }
        }

        function findTopContainer() {
            for (var i = tagstack.length - 1; i >= 0; --i) {
                var lump = tagstack[i];
                if (lump.rsfID !== undefined) {
                    return lump;
                }
            }
            return t.rootlump;
        }

        function newLump() {
            var togo = XMLLump(lumpindex, nestingdepth); // eslint-disable-line new-cap
            if (debugMode) {
                togo.line = parser.getLineNumber();
                togo.column = parser.getColumnNumber();
            }
            //togo.parent = t;
            t.lumps[lumpindex] = togo;
            ++lumpindex;
            return togo;
        }

        function addLump(mmap, ID, lump) {
            var list = mmap[ID];
            if (!list) {
                list = [];
                mmap[ID] = list;
            }
            list[list.length] = lump;
        }

        function checkContribute(ID, lump) {
            if (ID.indexOf("scr=contribute-") !== -1) {
                var scr = ID.substring("scr=contribute-".length);
                addLump(t.collectmap, scr, lump);
            }
        }

        function debugLump(lump) {
          // TODO expand this to agree with the Firebug "self-selector" idiom
            return "<" + lump.tagname + ">";
        }

        function hasCssClass(clazz, totest) {
            if (!totest) {
                return false;
            }
            // algorithm from jQuery
            return (" " + totest + " ").indexOf(" " + clazz + " ") !== -1;
        }

        function matchNode(term, headlump, headclazz) {
            if (term.predList) {
                for (var i = 0; i < term.predList.length; ++i) {
                    var pred = term.predList[i];
                    if (pred.id && headlump.attributemap.id !== pred.id) {return false;}
                    if (pred.clazz && !hasCssClass(pred.clazz, headclazz)) {return false;}
                    if (pred.tag && headlump.tagname !== pred.tag) {return false;}
                }
                return true;
            }
        }

        function tagStartCut(headlump) {
            var togo;
            var headclazz = headlump.attributemap["class"];
            var i;
            if (headclazz) {
                var split = headclazz.split(" ");
                for (i = 0; i < split.length; ++i) {
                    var simpleCut = simpleClassCutpoints[$.trim(split[i])];
                    if (simpleCut) {
                        return simpleCut;
                    }
                }
            }
            for (i = 0; i < cutpoints.length; ++i) {
                var cut = cutpoints[i];
                var cutstat = cutstatus[i];
                var nextterm = cutstat.length; // the next term for this node
                if (nextterm < cut.tree.length) {
                    var term = cut.tree[nextterm];
                    if (nextterm > 0) {
                        if (cut.tree[nextterm - 1].child &&
                                cutstat[nextterm - 1] !== headlump.nestingdepth - 1) {
                            continue; // it is a failure to match if not at correct nesting depth
                        }
                    }
                    var isMatch = matchNode(term, headlump, headclazz);
                    if (isMatch) {
                        cutstat[cutstat.length] = headlump.nestingdepth;
                        if (cutstat.length === cut.tree.length) {
                            if (togo !== undefined) {
                                fluid.fail("Cutpoint specification error - node " +
                                    debugLump(headlump) +
                                    " has already matched with rsf:id of " + togo);
                            }
                            if (cut.id === undefined || cut.id === null) {
                                fluid.fail("Error in cutpoints list - entry at position " + i + " does not have an id set");
                            }
                            togo = cut.id;
                        }
                    }
                }
            }
            return togo;
        }

        function tagEndCut() {
            if (cutpoints) {
                for (var i = 0; i < cutpoints.length; ++i) {
                    var cutstat = cutstatus[i];
                    if (cutstat.length > 0 && cutstat[cutstat.length - 1] === nestingdepth) {
                        cutstat.length--;
                    }
                }
            }
        }

        function processTagEnd() {
            tagEndCut();
            var endlump = newLump();
            --nestingdepth;
            endlump.text = "</" + parser.getName() + ">";
            var oldtop = tagstack[tagstack.length - 1];
            oldtop.close_tag = t.lumps[lumpindex - 1];
            tagstack.length--;
            justended = true;
        }

        function processTagStart(isempty) {
            ++nestingdepth;
            if (justended) {
                justended = false;
                var backlump = newLump();
                backlump.nestingdepth--;
            }
            if (t.firstdocumentindex === -1) {
                t.firstdocumentindex = lumpindex;
            }
            var headlump = newLump();
            var stacktop = tagstack[tagstack.length - 1];
            headlump.uplump = stacktop;
            var tagname = parser.getName();
            headlump.tagname = tagname;
            // NB - attribute names and values are now NOT DECODED!!
            var attrs = headlump.attributemap = parser.m_attributes;
            var ID = attrs[fluid.ID_ATTRIBUTE];
            if (ID === undefined) {
                ID = tagStartCut(headlump);
            }
            for (var attrname in attrs) {
                if (ID === undefined) {
                    if (/href|src|codebase|action/.test(attrname)) {
                        ID = "scr=rewrite-url";
                    }
                    // port of TPI effect of IDRelationRewriter
                    else if (ID === undefined && /for|headers/.test(attrname)) {
                        ID = "scr=null";
                    }
                }
            }

            if (ID) {
                // TODO: ensure this logic is correct on RSF Server
                if (ID.charCodeAt(0) === 126) { // "~"
                    ID = ID.substring(1);
                    headlump.elide = true;
                }
                checkContribute(ID, headlump);
                headlump.rsfID = ID;
                var downreg = findTopContainer();
                if (!downreg.downmap) {
                    downreg.downmap = {};
                }
                while (downreg) { // TODO: unusual fix for locating branches in parent contexts (applies to repetitive leaves)
                    if (downreg.downmap) {
                        addLump(downreg.downmap, ID, headlump);
                    }
                    downreg = downreg.uplump;
                }
                addLump(t.globalmap, ID, headlump);
                var colpos = ID.indexOf(":");
                if (colpos !== -1) {
                    var prefix = ID.substring(0, colpos);
                    if (!stacktop.finallump) {
                        stacktop.finallump = {};
                    }
                    stacktop.finallump[prefix] = headlump;
                }
            }

            // TODO: accelerate this by grabbing original template text (requires parser
            // adjustment) as well as dealing with empty tags
            headlump.text = "<" + tagname + fluid.dumpAttributes(attrs) + (isempty && !ID ? "/>" : ">");
            tagstack[tagstack.length] = headlump;
            if (isempty) {
                if (ID) {
                    processTagEnd();
                }
                else {
                    --nestingdepth;
                    tagstack.length--;
                }
            }
        }



        function processDefaultTag() {
            if (defstart !== -1) {
                if (t.firstdocumentindex === -1) {
                    t.firstdocumentindex = lumpindex;
                }
                var text = parser.getContent().substr(defstart, defend - defstart);
                justended = false;
                var newlump = newLump();
                newlump.text = text;
                defstart = -1;
            }
        }

       /** ACTUAL BODY of fluid.parseTemplate begins here **/

        t = fluid.XMLViewTemplate();

        init(baseURL, opts.debugMode, cutpoints_in);

        var idpos = template.indexOf(fluid.ID_ATTRIBUTE);
        if (scanStart) {
            var brackpos = template.indexOf(">", idpos);
            parser = fluid.XMLP(template.substring(brackpos + 1));
        }
        else {
            parser = fluid.XMLP(template);
        }

parseloop: // eslint-disable-line indent
        while (true) {
            var iEvent = parser.next();
            switch (iEvent) {
            case fluid.XMLP._ELM_B:
                processDefaultTag();
                //var text = parser.getContent().substr(parser.getContentBegin(), parser.getContentEnd() - parser.getContentBegin());
                processTagStart(false, "");
                break;
            case fluid.XMLP._ELM_E:
                processDefaultTag();
                processTagEnd();
                break;
            case fluid.XMLP._ELM_EMP:
                processDefaultTag();
                //var text = parser.getContent().substr(parser.getContentBegin(), parser.getContentEnd() - parser.getContentBegin());
                processTagStart(true, "");
                break;
            case fluid.XMLP._PI:
            case fluid.XMLP._DTD:
                defstart = -1;
                continue; // not interested in reproducing these
            case fluid.XMLP._TEXT:
            case fluid.XMLP._ENTITY:
            case fluid.XMLP._CDATA:
            case fluid.XMLP._COMMENT:
                if (defstart === -1) {
                    defstart = parser.m_cB;
                }
                defend = parser.m_cE;
                break;
            case fluid.XMLP._ERROR:
                fluid.setLogging(true);
                var message = "Error parsing template: " + parser.m_cAlt + " at line " + parser.getLineNumber();
                fluid.log(message);
                fluid.log("Just read: " + parser.m_xml.substring(parser.m_iP - 30, parser.m_iP));
                fluid.log("Still to read: " + parser.m_xml.substring(parser.m_iP, parser.m_iP + 30));
                fluid.fail(message);
                break parseloop;
            case fluid.XMLP._NONE:
                break parseloop;
            }
        }
        processDefaultTag();
        var excess = tagstack.length - 1;
        if (excess) {
            fluid.fail("Error parsing template - unclosed tag(s) of depth " + (excess) +
                ": " + fluid.transform(tagstack.splice(1, excess), function (lump) {return debugLump(lump);}).join(", "));
        }
        return t;
    };

    // unsupported, non-API function
    fluid.debugLump = function (lump) {
        var togo = lump.text;
        togo += " at ";
        togo += "lump line " + lump.line + " column " + lump.column + " index " + lump.lumpindex;
        togo += lump.parent.href === null ? "" : " in file " + lump.parent.href;
        return togo;
    };

    // Public definitions begin here

    fluid.ID_ATTRIBUTE = "rsf:id";

    // unsupported, non-API function
    fluid.getPrefix = function (id) {
        var colpos = id.indexOf(":");
        return colpos === -1 ? id : id.substring(0, colpos);
    };

    // unsupported, non-API function
    fluid.SplitID = function (id) {
        var that = {};
        var colpos = id.indexOf(":");
        if (colpos === -1) {
            that.prefix = id;
        }
        else {
            that.prefix = id.substring(0, colpos);
            that.suffix = id.substring(colpos + 1);
        }
        return that;
    };

    // unsupported, non-API function
    fluid.XMLViewTemplate = function () {
        return {
            globalmap: {},
            collectmap: {},
            lumps: [],
            firstdocumentindex: -1
        };
    };

    // TODO: find faster encoder
    fluid.XMLEncode = function (text) {
        return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;");
    };

    // unsupported, non-API function
    fluid.dumpAttributes = function (attrcopy) {
        var togo = "";
        for (var attrname in attrcopy) {
            var attrvalue = attrcopy[attrname];
            if (attrvalue !== null && attrvalue !== undefined) {
                togo += " " + attrname + "=\"" + attrvalue + "\"";
            }
        }
        return togo;
    };

    // unsupported, non-API function
    fluid.aggregateMMap = function (target, source) {
        for (var key in source) {
            var targhas = target[key];
            if (!targhas) {
                target[key] = [];
            }
            target[key] = target[key].concat(source[key]);
        }
    };

    /** Returns a "template structure", with globalmap in the root, and a list
     * of entries {href, template, cutpoints} for each parsed template.
     */
    fluid.parseTemplates = function (resourceSpec, templateList, opts) {
        var togo = [];
        opts = opts || {};
        togo.globalmap = {};
        for (var i = 0; i < templateList.length; ++i) {
            var resource = resourceSpec[templateList[i]];
            var lastslash = resource.href.lastIndexOf("/");
            var baseURL = lastslash === -1 ? "" : resource.href.substring(0, lastslash + 1);

            var template = fluid.parseTemplate(resource.resourceText, baseURL,
                opts.scanStart && i === 0, resource.cutpoints, opts);
            if (i === 0) {
                fluid.aggregateMMap(togo.globalmap, template.globalmap);
            }
            template.href = resource.href;
            template.baseURL = baseURL;
            template.resourceKey = resource.resourceKey;

            togo[i] = template;
            fluid.aggregateMMap(togo.globalmap, template.rootlump.downmap);
        }
        return togo;
    };

})(jQuery, fluid_2_0_0);
;
/*
Copyright 2008-2010 University of Cambridge
Copyright 2008-2009 University of Toronto
Copyright 2010-2011 Lucendo Development Ltd.

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

fluid_2_0_0 = fluid_2_0_0 || {};

(function ($, fluid) {
    "use strict";


    fluid.defaults("fluid.messageResolver", {
        gradeNames: ["fluid.component"],
        mergePolicy: {
            messageBase: "nomerge",
            parents: "nomerge"
        },
        resolveFunc: fluid.stringTemplate,
        parseFunc: fluid.identity,
        messageBase: {},
        members: {
            messageBase: "@expand:{that}.options.parseFunc({that}.options.messageBase)"
        },
        invokers: {
            lookup: "fluid.messageResolver.lookup({that}, {arguments}.0)", // messagecodes
            resolve: "fluid.messageResolver.resolve({that}, {arguments}.0, {arguments}.1)" // messagecodes, args
        },
        parents: []
    });

    fluid.messageResolver.lookup = function (that, messagecodes) {
        var resolved = fluid.messageResolver.resolveOne(that.messageBase, messagecodes);
        if (resolved === undefined) {
            return fluid.find(that.options.parents, function (parent) {
                return parent ? parent.lookup(messagecodes) : undefined;
            });
        } else {
            return {template: resolved, resolveFunc: that.options.resolveFunc};
        }
    };

    fluid.messageResolver.resolve = function (that, messagecodes, args) {
        if (!messagecodes) {
            return "[No messagecodes provided]";
        }
        messagecodes = fluid.makeArray(messagecodes);
        var looked = that.lookup(messagecodes);
        return looked ? looked.resolveFunc(looked.template, args) :
            "[Message string for key " + messagecodes[0] + " not found]";
    };


    // unsupported, NON-API function
    fluid.messageResolver.resolveOne = function (messageBase, messagecodes) {
        for (var i = 0; i < messagecodes.length; ++i) {
            var code = messagecodes[i];
            var message = messageBase[code];
            if (message !== undefined) {
                return message;
            }
        }
    };

    /** Converts a data structure consisting of a mapping of keys to message strings,
     * into a "messageLocator" function which maps an array of message codes, to be
     * tried in sequence until a key is found, and an array of substitution arguments,
     * into a substituted message string.
     */
    fluid.messageLocator = function (messageBase, resolveFunc) {
        var resolver = fluid.messageResolver({messageBase: messageBase, resolveFunc: resolveFunc});
        return function (messagecodes, args) {
            return resolver.resolve(messagecodes, args);
        };
    };

    function debugPosition(component) {
        return "as child of " + (component.parent.fullID ? "component with full ID " + component.parent.fullID : "root");
    }

    function computeFullID(component) {
        var togo = "";
        var move = component;
        if (component.children === undefined) { // not a container
            // unusual case on the client-side, since a repetitive leaf may have localID blasted onto it.
            togo = component.ID + (component.localID !== undefined ? component.localID : "");
            move = component.parent;
        }

        while (move.parent) {
            var parent = move.parent;
            if (move.fullID !== undefined) {
                togo = move.fullID + togo;
                return togo;
            }
            if (move.noID === undefined) {
                var ID = move.ID;
                if (ID === undefined) {
                    fluid.fail("Error in component tree - component found with no ID " +
                        debugPosition(parent) + ": please check structure");
                }
                var colpos = ID.indexOf(":");
                var prefix = colpos === -1 ? ID : ID.substring(0, colpos);
                togo = prefix + ":" + (move.localID === undefined ? "" : move.localID) + ":" + togo;
            }
            move = parent;
        }

        return togo;
    }

    var renderer = {};

    renderer.isBoundPrimitive = function (value) {
        return fluid.isPrimitive(value) || fluid.isArrayable(value) &&
            (value.length === 0 || typeof (value[0]) === "string");
    };

    var unzipComponent;

    function processChild(value, key) {
        if (renderer.isBoundPrimitive(value)) {
            return {componentType: "UIBound", value: value, ID: key};
        }
        else {
            var unzip = unzipComponent(value);
            if (unzip.ID) {
                return {ID: key, componentType: "UIContainer", children: [unzip]};
            } else {
                unzip.ID = key;
                return unzip;
            }
        }
    }

    function fixChildren(children) {
        if (!fluid.isArrayable(children)) {
            var togo = [];
            for (var key in children) {
                var value = children[key];
                if (fluid.isArrayable(value)) {
                    for (var i = 0; i < value.length; ++i) {
                        var processed = processChild(value[i], key);
          //            if (processed.componentType === "UIContainer" &&
          //              processed.localID === undefined) {
          //              processed.localID = i;
          //            }
                        togo[togo.length] = processed;
                    }
                } else {
                    togo[togo.length] = processChild(value, key);
                }
            }
            return togo;
        } else {return children; }
    }

    function fixupValue(uibound, model, resolverGetConfig) {
        if (uibound.value === undefined && uibound.valuebinding !== undefined) {
            uibound.value = fluid.get(model, uibound.valuebinding, resolverGetConfig);
        }
    }

    function upgradeBound(holder, property, model, resolverGetConfig) {
        if (holder[property] !== undefined) {
            if (renderer.isBoundPrimitive(holder[property])) {
                holder[property] = {value: holder[property]};
            }
            else if (holder[property].messagekey) {
                holder[property].componentType = "UIMessage";
            }
        }
        else {
            holder[property] = {value: null};
        }
        fixupValue(holder[property], model, resolverGetConfig);
    }

    renderer.duckMap = {children: "UIContainer",
            value: "UIBound", valuebinding: "UIBound", messagekey: "UIMessage",
            markup: "UIVerbatim", selection: "UISelect", target: "UILink",
            choiceindex: "UISelectChoice", functionname: "UIInitBlock"};

    var boundMap = {
        UISelect:   ["selection", "optionlist", "optionnames"],
        UILink:     ["target", "linktext"],
        UIVerbatim: ["markup"],
        UIMessage:  ["messagekey"]
    };

    renderer.boundMap = fluid.transform(boundMap, fluid.arrayToHash);

    renderer.inferComponentType = function (component) {
        for (var key in renderer.duckMap) {
            if (component[key] !== undefined) {
                return renderer.duckMap[key];
            }
        }
    };

    renderer.applyComponentType = function (component) {
        component.componentType = renderer.inferComponentType(component);
        if (component.componentType === undefined && component.ID !== undefined) {
            component.componentType = "UIBound";
        }
    };

    unzipComponent = function (component, model, resolverGetConfig) {
        if (component) {
            renderer.applyComponentType(component);
        }
        if (!component || component.componentType === undefined) {
            var decorators = component.decorators;
            if (decorators) {delete component.decorators;}
            component = {componentType: "UIContainer", children: component};
            component.decorators = decorators;
        }
        var cType = component.componentType;
        if (cType === "UIContainer") {
            component.children = fixChildren(component.children);
        }
        else {
            var map = renderer.boundMap[cType];
            if (map) {
                fluid.each(map, function (value, key) {
                    upgradeBound(component, key, model, resolverGetConfig);
                });
            }
        }

        return component;
    };

    function fixupTree(tree, model, resolverGetConfig) {
        if (tree.componentType === undefined) {
            tree = unzipComponent(tree, model, resolverGetConfig);
        }
        if (tree.componentType !== "UIContainer" && !tree.parent) {
            tree = {children: [tree]};
        }

        if (tree.children) {
            tree.childmap = {};
            for (var i = 0; i < tree.children.length; ++i) {
                var child = tree.children[i];
                if (child.componentType === undefined) {
                    child = unzipComponent(child, model, resolverGetConfig);
                    tree.children[i] = child;
                }
                child.parent = tree;
                if (child.ID === undefined) {
                    fluid.fail("Error in component tree: component found with no ID " + debugPosition(child));
                }
                tree.childmap[child.ID] = child;
                var colpos = child.ID.indexOf(":");
                if (colpos === -1) {
                //  tree.childmap[child.ID] = child; // moved out of branch to allow
                // "relative id expressions" to be easily parsed
                }
                else {
                    var prefix = child.ID.substring(0, colpos);
                    var childlist = tree.childmap[prefix];
                    if (!childlist) {
                        childlist = [];
                        tree.childmap[prefix] = childlist;
                    }
                    if (child.localID === undefined && childlist.length !== 0) {
                        child.localID = childlist.length;
                    }
                    childlist[childlist.length] = child;
                }
                child.fullID = computeFullID(child);

                var componentType = child.componentType;
                if (componentType === "UISelect") {
                    child.selection.fullID = child.fullID;
                }
                else if (componentType === "UIInitBlock") {
                    var call = child.functionname + "(";
                    var childArgs = child.arguments;
                    for (var j = 0; j < childArgs.length; ++j) {
                        if (childArgs[j] instanceof fluid.ComponentReference) {
                            // TODO: support more forms of id reference
                            childArgs[j] = child.parent.fullID + childArgs[j].reference;
                        }
                        call += JSON.stringify(childArgs[j]);
                        if (j < childArgs.length - 1) {
                            call += ", ";
                        }
                    }
                    child.markup = {value: call + ")\n"};
                    child.componentType = "UIVerbatim";
                }
                else if (componentType === "UIBound") {
                    fixupValue(child, model, resolverGetConfig);
                }
                fixupTree(child, model, resolverGetConfig);
            }
        }
        return tree;
    }

    fluid.NULL_STRING = "\u25a9null\u25a9";

    var LINK_ATTRIBUTES = {
        a: "href",
        link: "href",
        img: "src",
        frame: "src",
        script: "src",
        style: "src",
        input: "src",
        embed: "src",
        form: "action",
        applet: "codebase",
        object: "codebase"
    };

    renderer.decoratorComponentPrefix = "**-renderer-";

    renderer.IDtoComponentName = function (ID, num) {
        return renderer.decoratorComponentPrefix + ID.replace(/\./g, "") + "-" + num;
    };

    renderer.invokeFluidDecorator = function (func, args, ID, num, options) {
        var that;
        if (options.parentComponent) {
            var parent = options.parentComponent;
            var name = renderer.IDtoComponentName(ID, num);
            fluid.set(parent, ["options", "components", name], {
                type: func,
                container: args[0],
                options: args[1]
            });
            that = fluid.initDependent(options.parentComponent, name);
        }
        else {
            that = fluid.invokeGlobalFunction(func, args);
        }
        return that;
    };

    fluid.renderer = function (templates, tree, options, fossilsIn) {

        options = options || {};
        tree = tree || {};
        var debugMode = options.debugMode;
        if (!options.messageLocator && options.messageSource) {
            options.messageLocator = fluid.resolveMessageSource(options.messageSource);
        }
        options.document = options.document || document;
        options.jQuery = options.jQuery || $;
        options.fossils = options.fossils || fossilsIn || {}; // map of submittingname to {EL, submittingname, oldvalue}

        var globalmap = {};
        var branchmap = {};
        var rewritemap = {}; // map of rewritekey (for original id in template) to full ID
        var seenset = {};
        var collected = {};
        var out = "";
        var renderOptions = options;
        var decoratorQueue = [];

        var renderedbindings = {}; // map of fullID to true for UISelects which have already had bindings written
        var usedIDs = {};

        var that = {options: options};

        function getRewriteKey(template, parent, id) {
            return template.resourceKey + parent.fullID + id;
        }
        // returns: lump
        function resolveInScope(searchID, defprefix, scope) {
            var deflump;
            var scopelook = scope ? scope[searchID] : null;
            if (scopelook) {
                for (var i = 0; i < scopelook.length; ++i) {
                    var scopelump = scopelook[i];
                    if (!deflump && scopelump.rsfID === defprefix) {
                        deflump = scopelump;
                    }
                    if (scopelump.rsfID === searchID) {
                        return scopelump;
                    }
                }
            }
            return deflump;
        }
        // returns: lump
        function resolveCall(sourcescope, child) {
            var searchID = child.jointID ? child.jointID : child.ID;
            var split = fluid.SplitID(searchID);
            var defprefix = split.prefix + ":";
            var match = resolveInScope(searchID, defprefix, sourcescope.downmap, child);
            if (match) {return match;}
            if (child.children) {
                match = resolveInScope(searchID, defprefix, globalmap, child);
                if (match) {return match;}
            }
            return null;
        }

        function noteCollected(template) {
            if (!seenset[template.href]) {
                fluid.aggregateMMap(collected, template.collectmap);
                seenset[template.href] = true;
            }
        }

        var fetchComponent;

        function resolveRecurse(basecontainer, parentlump) {
            var i;
            var id;
            var resolved;
            for (i = 0; i < basecontainer.children.length; ++i) {
                var branch = basecontainer.children[i];
                if (branch.children) { // it is a branch
                    resolved = resolveCall(parentlump, branch);
                    if (resolved) {
                        branchmap[branch.fullID] = resolved;
                        id = resolved.attributemap.id;
                        if (id !== undefined) {
                            rewritemap[getRewriteKey(parentlump.parent, basecontainer, id)] = branch.fullID;
                        }
                        // on server-side this is done separately
                        noteCollected(resolved.parent);
                        resolveRecurse(branch, resolved);
                    }
                }
            }
            // collect any rewritten ids for the purpose of later rewriting
            if (parentlump.downmap) {
                for (id in parentlump.downmap) {
                  //if (id.indexOf(":") === -1) {
                    var lumps = parentlump.downmap[id];
                    for (i = 0; i < lumps.length; ++i) {
                        var lump = lumps[i];
                        var lumpid = lump.attributemap.id;
                        if (lumpid !== undefined && lump.rsfID !== undefined) {
                            resolved = fetchComponent(basecontainer, lump.rsfID);
                            if (resolved !== null) {
                                var resolveID = resolved.fullID;
                                rewritemap[getRewriteKey(parentlump.parent, basecontainer,
                                    lumpid)] = resolveID;
                            }
                        }
                    }
                //  }
                }
            }

        }

        function resolveBranches(globalmapp, basecontainer, parentlump) {
            branchmap = {};
            rewritemap = {};
            seenset = {};
            collected = {};
            globalmap = globalmapp;
            branchmap[basecontainer.fullID] = parentlump;
            resolveRecurse(basecontainer, parentlump);
        }

        function dumpTillLump(lumps, start, limit) {
            for (; start < limit; ++start) {
                var text = lumps[start].text;
                if (text) { // guard against "undefined" lumps from "justended"
                    out += lumps[start].text;
                }
            }
        }

        function dumpScan(lumps, renderindex, basedepth, closeparent, insideleaf) {
            var start = renderindex;
            while (true) {
                if (renderindex === lumps.length) {
                    break;
                }
                var lump = lumps[renderindex];
                if (lump.nestingdepth < basedepth) {
                    break;
                }
                if (lump.rsfID !== undefined) {
                    if (!insideleaf) {break;}
                    if (insideleaf && lump.nestingdepth > basedepth + (closeparent ? 0 : 1)) {
                        fluid.log("Error in component tree - leaf component found to contain further components - at " +
                            lump.toString());
                    }
                    else {break;}
                }
                // target.print(lump.text);
                ++renderindex;
            }
            // ASSUMPTIONS: close tags are ONE LUMP
            if (!closeparent && (renderindex === lumps.length || !lumps[renderindex].rsfID)) {
                --renderindex;
            }

            dumpTillLump(lumps, start, renderindex);
            //target.write(buffer, start, limit - start);
            return renderindex;
        }


        function isPlaceholder() {
            // TODO: equivalent of server-side "placeholder" system
            return false;
        }

        function isValue(value) {
            return value !== null && value !== undefined && !isPlaceholder(value);
        }

        // In RSF Client, this is a "flyweight" "global" object that is reused for every tag,
        // to avoid generating garbage. In RSF Server, it is an argument to the following rendering
        // methods of type "TagRenderContext".

        var trc = {};

        /*** TRC METHODS ***/

        function openTag() {
            if (!trc.iselide) {
                out += "<" + trc.uselump.tagname;
            }
        }

        function closeTag() {
            if (!trc.iselide) {
                out += "</" + trc.uselump.tagname + ">";
            }
        }

        function renderUnchanged() {
            // TODO needs work since we don't keep attributes in text
            dumpTillLump(trc.uselump.parent.lumps, trc.uselump.lumpindex + 1,
                trc.close.lumpindex + (trc.iselide ? 0 : 1));
        }

        function isSelfClose() {
            return trc.endopen.lumpindex === trc.close.lumpindex && fluid.XMLP.closedTags[trc.uselump.tagname];
        }

        function dumpTemplateBody() {
            if (isSelfClose()) {
                if (!trc.iselide) {
                    out += "/>";
                }
            }
            else {
                if (!trc.iselide) {
                    out += ">";
                }
                dumpTillLump(trc.uselump.parent.lumps, trc.endopen.lumpindex,
                    trc.close.lumpindex + (trc.iselide ? 0 : 1));
            }
        }

        function replaceAttributes() {
            if (!trc.iselide) {
                out += fluid.dumpAttributes(trc.attrcopy);
            }
            dumpTemplateBody();
        }

        function replaceAttributesOpen() {
            if (trc.iselide) {
                replaceAttributes();
            }
            else {
                out += fluid.dumpAttributes(trc.attrcopy);
                var selfClose = isSelfClose();
                // TODO: the parser does not ever produce empty tags
                out += selfClose ? "/>" : ">";

                trc.nextpos = selfClose ? trc.close.lumpindex + 1 : trc.endopen.lumpindex;
            }
        }

        function replaceBody(value) {
            out += fluid.dumpAttributes(trc.attrcopy);
            if (!trc.iselide) {
                out += ">";
            }
            out += fluid.XMLEncode(value.toString());
            closeTag();
        }

        function rewriteLeaf(value) {
            if (isValue(value)) {
                replaceBody(value);
            }
            else {
                replaceAttributes();
            }
        }

        function rewriteLeafOpen(value) {
            if (trc.iselide) {
                rewriteLeaf(trc.value);
            }
            else {
                if (isValue(value)) {
                    replaceBody(value);
                }
                else {
                    replaceAttributesOpen();
                }
            }
        }


        /*** END TRC METHODS**/

        function rewriteUrl(template, url) {
            if (renderOptions.urlRewriter) {
                var rewritten = renderOptions.urlRewriter(url);
                if (rewritten) {
                    return rewritten;
                }
            }
            if (!renderOptions.rebaseURLs) {
                return url;
            }
            var protpos = url.indexOf(":/");
            if (url.charAt(0) === "/" || protpos !== -1 && protpos < 7) {
                return url;
            }
            else {
                return renderOptions.baseURL + url;
            }
        }

        function dumpHiddenField(/** UIParameter **/ todump) {
            out += "<input type=\"hidden\" ";
            var isvirtual = todump.virtual;
            var outattrs = {};
            outattrs[isvirtual ? "id" : "name"] = todump.name;
            outattrs.value = todump.value;
            out += fluid.dumpAttributes(outattrs);
            out += " />\n";
        }

        var outDecoratorsImpl;

        function applyAutoBind(torender, finalID) {
            if (!finalID) {
              // if no id is assigned so far, this is a signal that this is a "virtual" component such as
              // a non-HTML UISelect which will not have physical markup.
                return;
            }
            var tagname = trc.uselump.tagname;
            var applier = renderOptions.applier;
            function applyFunc() {
                fluid.applyBoundChange(fluid.byId(finalID, renderOptions.document), undefined, applier);
            }
            if (renderOptions.autoBind && /input|select|textarea/.test(tagname) && !renderedbindings[finalID]) {
                var decorators = [{jQuery: ["change", applyFunc]}];
                // Work around bug 193: http://webbugtrack.blogspot.com/2007/11/bug-193-onchange-does-not-fire-properly.html
                if ($.browser.msie && tagname === "input" && /radio|checkbox/.test(trc.attrcopy.type)) {
                    decorators.push({jQuery: ["click", applyFunc]});
                }
                if ($.browser.safari && tagname === "input" && trc.attrcopy.type === "radio") {
                    decorators.push({jQuery: ["keyup", applyFunc]});
                }
                outDecoratorsImpl(torender, decorators, trc.attrcopy, finalID);
            }
        }

        function dumpBoundFields(/** UIBound**/ torender, parent) {
            if (torender) {
                var holder = parent ? parent : torender;
                if (renderOptions.fossils && holder.valuebinding !== undefined) {
                    var fossilKey = holder.submittingname || torender.finalID;
                  // TODO: this will store multiple times for each member of a UISelect
                    renderOptions.fossils[fossilKey] = {
                        name: fossilKey,
                        EL: holder.valuebinding,
                        oldvalue: holder.value
                    };
                  // But this has to happen multiple times
                    applyAutoBind(torender, torender.finalID);
                }
                if (torender.fossilizedbinding) {
                    dumpHiddenField(torender.fossilizedbinding);
                }
                if (torender.fossilizedshaper) {
                    dumpHiddenField(torender.fossilizedshaper);
                }
            }
        }

        function dumpSelectionBindings(uiselect) {
            if (!renderedbindings[uiselect.selection.fullID]) {
                renderedbindings[uiselect.selection.fullID] = true; // set this true early so that selection does not autobind twice
                dumpBoundFields(uiselect.selection);
                dumpBoundFields(uiselect.optionlist);
                dumpBoundFields(uiselect.optionnames);
            }
        }

        function isSelectedValue(torender, value) {
            var selection = torender.selection;
            return fluid.isArrayable(selection.value) ? selection.value.indexOf(value) !== -1 : selection.value === value;
        }

        function getRelativeComponent(component, relativeID) {
            component = component.parent;
            while (relativeID.indexOf("..::") === 0) {
                relativeID = relativeID.substring(4);
                component = component.parent;
            }
            return component.childmap[relativeID];
        }

        // TODO: This mechanism inefficiently handles the rare case of a target document
        // id collision requiring a rewrite for FLUID-5048. In case it needs improving, we
        // could hold an inverted index - however, these cases will become even rarer with FLUID-5047
        function rewriteRewriteMap(from, to) {
            fluid.each(rewritemap, function (value, key) {
                if (value === from) {
                    rewritemap[key] = to;
                }
            });
        }

        function adjustForID(attrcopy, component, late, forceID) {
            if (!late) {
                delete attrcopy["rsf:id"];
            }
            if (component.finalID !== undefined) {
                attrcopy.id = component.finalID;
            }
            else if (forceID !== undefined) {
                attrcopy.id = forceID;
            }
            else {
                if (attrcopy.id || late) {
                    attrcopy.id = component.fullID;
                }
            }

            var count = 1;
            var baseid = attrcopy.id;
            while (renderOptions.document.getElementById(attrcopy.id) || usedIDs[attrcopy.id]) {
                attrcopy.id = baseid + "-" + (count++);
            }
            if (count !== 1) {
                rewriteRewriteMap(baseid, attrcopy.id);
            }
            component.finalID = attrcopy.id;
            return attrcopy.id;
        }

        function assignSubmittingName(attrcopy, component, parent) {
            var submitting = parent || component;
          // if a submittingName is required, we must already go out to the document to
          // uniquify the id that it will be derived from
            adjustForID(attrcopy, component, true, component.fullID);
            if (submitting.submittingname === undefined && submitting.willinput !== false) {
                submitting.submittingname = submitting.finalID || submitting.fullID;
            }
            return submitting.submittingname;
        }

        function explodeDecorators(decorators) {
            var togo = [];
            if (decorators.type) {
                togo[0] = decorators;
            }
            else {
                for (var key in decorators) {
                    if (key === "$") {key = "jQuery";}
                    var value = decorators[key];
                    var decorator = {
                        type: key
                    };
                    if (key === "jQuery") {
                        decorator.func = value[0];
                        decorator.args = value.slice(1);
                    }
                    else if (key === "addClass" || key === "removeClass") {
                        decorator.classes = value;
                    }
                    else if (key === "attrs") {
                        decorator.attributes = value;
                    }
                    else if (key === "identify") {
                        decorator.key = value;
                    }
                    togo[togo.length] = decorator;
                }
            }
            return togo;
        }

        outDecoratorsImpl = function (torender, decorators, attrcopy, finalID) {
            var id;
            var sanitizeAttrs = function (value, key) {
                if (value === null || value === undefined) {
                    delete attrcopy[key];
                }
                else {
                    attrcopy[key] = fluid.XMLEncode(value);
                }
            };
            renderOptions.idMap = renderOptions.idMap || {};
            for (var i = 0; i < decorators.length; ++i) {
                var decorator = decorators[i];
                var type = decorator.type;
                if (!type) {
                    var explodedDecorators = explodeDecorators(decorator);
                    outDecoratorsImpl(torender, explodedDecorators, attrcopy, finalID);
                    continue;
                }
                if (type === "$") {type = decorator.type = "jQuery";}
                if (type === "jQuery" || type === "event" || type === "fluid") {
                    id = adjustForID(attrcopy, torender, true, finalID);
                    if (decorator.ids === undefined) {
                        decorator.ids = [];
                        decoratorQueue[decoratorQueue.length] = decorator;
                    }
                    decorator.ids.push(id);
                }
                // honour these remaining types immediately
                else if (type === "attrs") {
                    fluid.each(decorator.attributes, sanitizeAttrs);
                }
                else if (type === "addClass" || type === "removeClass") {
                    var fakeNode = {
                        nodeType: 1,
                        className: attrcopy["class"] || ""
                    };
                    renderOptions.jQuery(fakeNode)[type](decorator.classes);
                    attrcopy["class"] = fakeNode.className;
                }
                else if (type === "identify") {
                    id = adjustForID(attrcopy, torender, true, finalID);
                    renderOptions.idMap[decorator.key] = id;
                }
                else if (type !== "null") {
                    fluid.log("Unrecognised decorator of type " + type + " found at component of ID " + finalID);
                }
            }
        };

        function outDecorators(torender, attrcopy) {
            if (!torender.decorators) {return;}
            if (torender.decorators.length === undefined) {
                torender.decorators = explodeDecorators(torender.decorators);
            }
            outDecoratorsImpl(torender, torender.decorators, attrcopy);
        }

        function dumpBranchHead(branch, targetlump) {
            if (targetlump.elide) {
                return;
            }
            var attrcopy = {};
            $.extend(true, attrcopy, targetlump.attributemap);
            adjustForID(attrcopy, branch);
            outDecorators(branch, attrcopy);
            out += "<" + targetlump.tagname + " ";
            out += fluid.dumpAttributes(attrcopy);
            out += ">";
        }

        function resolveArgs(args) {
            if (!args) {return args;}
            args = fluid.copy(args); // FLUID-4737: Avoid corrupting material which may have been fetched from the model
            return fluid.transform(args, function (arg, index) {
                upgradeBound(args, index, renderOptions.model, renderOptions.resolverGetConfig);
                return args[index].value;
            });
        }

        function degradeMessage(torender) {
            if (torender.componentType === "UIMessage") {
                // degrade UIMessage to UIBound by resolving the message
                torender.componentType = "UIBound";
                if (!renderOptions.messageLocator) {
                    torender.value = "[No messageLocator is configured in options - please consult documentation on options.messageSource]";
                }
                else {
                    upgradeBound(torender, "messagekey", renderOptions.model, renderOptions.resolverGetConfig);
                    var resArgs = resolveArgs(torender.args);
                    torender.value = renderOptions.messageLocator(torender.messagekey.value, resArgs);
                }
            }
        }


        function renderComponent(torender) {
            var value;
            var attrcopy = trc.attrcopy;

            degradeMessage(torender);
            var componentType = torender.componentType;
            var tagname = trc.uselump.tagname;

            outDecorators(torender, attrcopy);

            function makeFail(torender, end) {
                fluid.fail("Error in component tree - UISelectChoice with id " + torender.fullID + end);
            }

            if (componentType === "UIBound" || componentType === "UISelectChoice") {
                var parent;
                if (torender.choiceindex !== undefined) {
                    if (torender.parentRelativeID !== undefined) {
                        parent = getRelativeComponent(torender, torender.parentRelativeID);
                        if (!parent) {
                            makeFail(torender, " has parentRelativeID of " + torender.parentRelativeID + " which cannot be resolved");
                        }
                    }
                    else {
                        makeFail(torender, " does not have parentRelativeID set");
                    }
                    assignSubmittingName(attrcopy, torender, parent.selection);
                    dumpSelectionBindings(parent);
                }

                var submittingname = parent ? parent.selection.submittingname : torender.submittingname;
                if (!parent && torender.valuebinding) {
                    // Do this for all bound fields even if non submitting so that finalID is set in order to track fossils (FLUID-3387)
                    submittingname = assignSubmittingName(attrcopy, torender);
                }
                if (tagname === "input" || tagname === "textarea") {
                    if (submittingname !== undefined) {
                        attrcopy.name = submittingname;
                    }
                }
                // this needs to happen early on the client, since it may cause the allocation of the
                // id in the case of a "deferred decorator". However, for server-side bindings, this
                // will be an inappropriate time, unless we shift the timing of emitting the opening tag.
                dumpBoundFields(torender, parent ? parent.selection : null);

                if (typeof(torender.value) === "boolean" || attrcopy.type === "radio" || attrcopy.type === "checkbox") {
                    var underlyingValue;
                    var directValue = torender.value;

                    if (torender.choiceindex !== undefined) {
                        if (!parent.optionlist.value) {
                            fluid.fail("Error in component tree - selection control with full ID " + parent.fullID + " has no values");
                        }
                        underlyingValue = parent.optionlist.value[torender.choiceindex];
                        directValue = isSelectedValue(parent, underlyingValue);
                    }
                    if (isValue(directValue)) {
                        if (directValue) {
                            attrcopy.checked = "checked";
                        }
                        else {
                            delete attrcopy.checked;
                        }
                    }
                    attrcopy.value = fluid.XMLEncode(underlyingValue ? underlyingValue : "true");
                    rewriteLeaf(null);
                }
                else if (fluid.isArrayable(torender.value)) {
                    // Cannot be rendered directly, must be fake
                    renderUnchanged();
                }
                else { // String value
                    value = parent ?
                        parent[tagname === "textarea" || tagname === "input" ? "optionlist" : "optionnames"].value[torender.choiceindex] :
                            torender.value;
                    if (tagname === "textarea") {
                        if (isPlaceholder(value) && torender.willinput) {
                            // FORCE a blank value for input components if nothing from
                            // model, if input was intended.
                            value = "";
                        }
                        rewriteLeaf(value);
                    }
                    else if (tagname === "input") {
                        if (torender.willinput || isValue(value)) {
                            attrcopy.value = fluid.XMLEncode(String(value));
                        }
                        rewriteLeaf(null);
                    }
                    else {
                        delete attrcopy.name;
                        rewriteLeafOpen(value);
                    }
                }
            }
            else if (componentType === "UISelect") {

                var ishtmlselect = tagname === "select";
                var ismultiple = false; // eslint-disable-line no-unused-vars

                if (fluid.isArrayable(torender.selection.value)) {
                    ismultiple = true;
                    if (ishtmlselect) {
                        attrcopy.multiple = "multiple";
                    }
                }
                // assignSubmittingName is now the definitive trigger point for uniquifying output IDs
                // However, if id is already assigned it is probably through attempt to decorate root select.
                // in this case restore it.
                assignSubmittingName(attrcopy, torender.selection);

                if (ishtmlselect) {
                    // The HTML submitted value from a <select> actually corresponds
                    // with the selection member, not the top-level component.
                    if (torender.selection.willinput !== false) {
                        attrcopy.name = torender.selection.submittingname;
                    }
                    applyAutoBind(torender, attrcopy.id);
                }

                out += fluid.dumpAttributes(attrcopy);
                if (ishtmlselect) {
                    out += ">";
                    var values = torender.optionlist.value;
                    var names = torender.optionnames === null || torender.optionnames === undefined || !torender.optionnames.value ? values : torender.optionnames.value;
                    if (!names || !names.length) {
                        fluid.fail("Error in component tree - UISelect component with fullID " +
                            torender.fullID + " does not have optionnames set");
                    }
                    for (var i = 0; i < names.length; ++i) {
                        out += "<option value=\"";
                        value = values[i];
                        if (value === null) {
                            value = fluid.NULL_STRING;
                        }
                        out += fluid.XMLEncode(value);
                        if (isSelectedValue(torender, value)) {
                            out += "\" selected=\"selected";
                        }
                        out += "\">";
                        out += fluid.XMLEncode(names[i]);
                        out += "</option>\n";
                    }
                    closeTag();
                }
                else {
                    dumpTemplateBody();
                }
                dumpSelectionBindings(torender);
            }
            else if (componentType === "UILink") {
                var attrname = LINK_ATTRIBUTES[tagname];
                if (attrname) {
                    degradeMessage(torender.target);
                    var target = torender.target.value;
                    if (!isValue(target)) {
                        target = attrcopy[attrname];
                    }
                    target = rewriteUrl(trc.uselump.parent, target);
                    // Note that all real browsers succeed in recovering the URL here even if it is presented in violation of XML
                    // seemingly due to the purest accident, the text &amp; cannot occur in a properly encoded URL :P
                    attrcopy[attrname] = fluid.XMLEncode(target);
                }
                value = undefined;
                if (torender.linktext) {
                    degradeMessage(torender.linktext);
                    value = torender.linktext.value;
                }
                if (!isValue(value)) {
                    replaceAttributesOpen();
                }
                else {
                    rewriteLeaf(value);
                }
            }

            else if (torender.markup !== undefined) { // detect UIVerbatim
                degradeMessage(torender.markup);
                var rendered = torender.markup.value;
                if (rendered === null) {
                  // TODO, doesn't quite work due to attr folding cf Java code
                    out += fluid.dumpAttributes(attrcopy);
                    out += ">";
                    renderUnchanged();
                }
                else {
                    if (!trc.iselide) {
                        out += fluid.dumpAttributes(attrcopy);
                        out += ">";
                    }
                    out += rendered;
                    closeTag();
                }
            }
            if (attrcopy.id !== undefined) {
                usedIDs[attrcopy.id] = true;
            }
        }

        function rewriteIDRelation(context) {
            var attrname;
            var attrval = trc.attrcopy["for"];
            if (attrval !== undefined) {
                attrname = "for";
            }
            else {
                attrval = trc.attrcopy.headers;
                if (attrval !== undefined) {
                    attrname = "headers";
                }
            }
            if (!attrname) {return;}
            var tagname = trc.uselump.tagname;
            if (attrname === "for" && tagname !== "label") {return;}
            if (attrname === "headers" && tagname !== "td" && tagname !== "th") {return;}
            var rewritten = rewritemap[getRewriteKey(trc.uselump.parent, context, attrval)];
            if (rewritten !== undefined) {
                trc.attrcopy[attrname] = rewritten;
            }
        }

        function renderComment(message) {
            out += ("<!-- " + fluid.XMLEncode(message) + "-->");
        }

        function renderDebugMessage(message) {
            out += "<span style=\"background-color:#FF466B;color:white;padding:1px;\">";
            out += message;
            out += "</span><br/>";
        }

        function reportPath(/*UIComponent*/ branch) {
            var path = branch.fullID;
            return !path ? "component tree root" : "full path " + path;
        }

        function renderComponentSystem(context, torendero, lump) {
            var lumpindex = lump.lumpindex;
            var lumps = lump.parent.lumps;
            var nextpos = -1;
            var outerendopen = lumps[lumpindex + 1];
            var outerclose = lump.close_tag;

            nextpos = outerclose.lumpindex + 1;

            var payloadlist = lump.downmap ? lump.downmap["payload-component"] : null;
            var payload = payloadlist ? payloadlist[0] : null;

            var iselide = lump.rsfID.charCodeAt(0) === 126; // "~"

            var endopen = outerendopen;
            var close = outerclose;
            var uselump = lump;
            var attrcopy = {};
            $.extend(true, attrcopy, (payload === null ? lump : payload).attributemap);

            trc.attrcopy = attrcopy;
            trc.uselump = uselump;
            trc.endopen = endopen;
            trc.close = close;
            trc.nextpos = nextpos;
            trc.iselide = iselide;

            rewriteIDRelation(context);

            if (torendero === null) {
                if (lump.rsfID.indexOf("scr=") === (iselide ? 1 : 0)) {
                    var scrname = lump.rsfID.substring(4 + (iselide ? 1 : 0));
                    if (scrname === "ignore") {
                        nextpos = trc.close.lumpindex + 1;
                    }
                    else if (scrname === "rewrite-url") {
                        torendero = {componentType: "UILink", target: {}};
                    }
                    else {
                        openTag();
                        replaceAttributesOpen();
                        nextpos = trc.endopen.lumpindex;
                    }
                }
            }
            if (torendero !== null) {
                // else there IS a component and we are going to render it. First make
                // sure we render any preamble.

                if (payload) {
                    trc.endopen = lumps[payload.lumpindex + 1];
                    trc.close = payload.close_tag;
                    trc.uselump = payload;
                    dumpTillLump(lumps, lumpindex, payload.lumpindex);
                    lumpindex = payload.lumpindex;
                }

                adjustForID(attrcopy, torendero);
                //decoratormanager.decorate(torendero.decorators, uselump.getTag(), attrcopy);

                // ALWAYS dump the tag name, this can never be rewritten. (probably?!)
                openTag();

                renderComponent(torendero);
                // if there is a payload, dump the postamble.
                if (payload !== null) {
                    // the default case is initialised to tag close
                    if (trc.nextpos === nextpos) {
                        dumpTillLump(lumps, trc.close.lumpindex + 1, outerclose.lumpindex + 1);
                    }
                }
                nextpos = trc.nextpos;
            }
            return nextpos;
        }
        var renderRecurse;

        function renderContainer(child, targetlump) {
            var t2 = targetlump.parent;
            var firstchild = t2.lumps[targetlump.lumpindex + 1];
            if (child.children !== undefined) {
                dumpBranchHead(child, targetlump);
            }
            else {
                renderComponentSystem(child.parent, child, targetlump);
            }
            renderRecurse(child, targetlump, firstchild);
        }

        fetchComponent = function (basecontainer, id) {
            if (id.indexOf("msg=") === 0) {
                var key = id.substring(4);
                return {componentType: "UIMessage", messagekey: key};
            }
            while (basecontainer) {
                var togo = basecontainer.childmap[id];
                if (togo) {
                    return togo;
                }
                basecontainer = basecontainer.parent;
            }
            return null;
        };

        function fetchComponents(basecontainer, id) {
            var togo;
            while (basecontainer) {
                togo = basecontainer.childmap[id];
                if (togo) {
                    break;
                }
                basecontainer = basecontainer.parent;
            }
            return togo;
        }

        function findChild(sourcescope, child) {
            var split = fluid.SplitID(child.ID);
            var headlumps = sourcescope.downmap[child.ID];
            if (!headlumps) {
                headlumps = sourcescope.downmap[split.prefix + ":"];
            }
            return headlumps ? headlumps[0] : null;
        }

        renderRecurse = function (basecontainer, parentlump, baselump) {
            var children;
            var targetlump;
            var child;
            var renderindex = baselump.lumpindex;
            var basedepth = parentlump.nestingdepth;
            var t1 = parentlump.parent;
            var rendered;
            if (debugMode) {
                rendered = {};
            }
            while (true) {
                renderindex = dumpScan(t1.lumps, renderindex, basedepth, !parentlump.elide, false);
                if (renderindex === t1.lumps.length) {
                    break;
                }
                var lump = t1.lumps[renderindex];
                var id = lump.rsfID;
                // new stopping rule - we may have been inside an elided tag
                if (lump.nestingdepth < basedepth || id === undefined) {
                    break;
                }

                if (id.charCodeAt(0) === 126) { // "~"
                    id = id.substring(1);
                }

                //var ismessagefor = id.indexOf("message-for:") === 0;

                if (id.indexOf(":") !== -1) {
                    var prefix = fluid.getPrefix(id);
                    children = fetchComponents(basecontainer, prefix);

                    var finallump = lump.uplump.finallump[prefix];
                    var closefinal = finallump.close_tag;

                    if (children) {
                        for (var i = 0; i < children.length; ++i) {
                            child = children[i];
                            if (child.children) { // it is a branch
                                if (debugMode) {
                                    rendered[child.fullID] = true;
                                }
                                targetlump = branchmap[child.fullID];
                                if (targetlump) {
                                    if (debugMode) {
                                        renderComment("Branching for " + child.fullID + " from " +
                                            fluid.debugLump(lump) + " to " + fluid.debugLump(targetlump));
                                    }

                                    renderContainer(child, targetlump);

                                    if (debugMode) {
                                        renderComment("Branch returned for " + child.fullID +
                                            fluid.debugLump(lump) + " to " + fluid.debugLump(targetlump));
                                    }
                                }
                                else if (debugMode) {
                                    renderDebugMessage(
                                        "No matching template branch found for branch container with full ID " +
                                            child.fullID +
                                            " rendering from parent template branch " +
                                            fluid.debugLump(baselump));
                                }
                            }
                            else { // repetitive leaf
                                targetlump = findChild(parentlump, child);
                                if (!targetlump) {
                                    if (debugMode) {
                                        renderDebugMessage("Repetitive leaf with full ID " +
                                            child.fullID +
                                            " could not be rendered from parent template branch " +
                                            fluid.debugLump(baselump));
                                    }
                                    continue;
                                }
                                var renderend = renderComponentSystem(basecontainer, child, targetlump);
                                var wasopentag = renderend < t1.lumps.lengtn && t1.lumps[renderend].nestingdepth >= targetlump.nestingdepth;
                                var newbase = child.children ? child : basecontainer;
                                if (wasopentag) {
                                    renderRecurse(newbase, targetlump, t1.lumps[renderend]);
                                    renderend = targetlump.close_tag.lumpindex + 1;
                                }
                                if (i !== children.length - 1) {
                                    // TODO - fix this bug in RSF Server!
                                    if (renderend < closefinal.lumpindex) {
                                        dumpScan(t1.lumps, renderend, targetlump.nestingdepth - 1, false, false);
                                    }
                                }
                                else {
                                    dumpScan(t1.lumps, renderend, targetlump.nestingdepth, true, false);
                                }
                            }
                        } // end for each repetitive child
                    }
                    else {
                        if (debugMode) {
                            renderDebugMessage("No branch container with prefix " +
                                prefix + ": found in container " +
                                reportPath(basecontainer) +
                                " rendering at template position " +
                                fluid.debugLump(baselump) +
                                ", skipping");
                        }
                    }

                    renderindex = closefinal.lumpindex + 1;
                    if (debugMode) {
                        renderComment("Stack returned from branch for ID " + id + " to " +
                            fluid.debugLump(baselump) + ": skipping from " + fluid.debugLump(lump) +
                            " to " + fluid.debugLump(closefinal));
                    }
                }
                else {
                    var component;
                    if (id) {
                        component = fetchComponent(basecontainer, id, lump);
                        if (debugMode && component) {
                            rendered[component.fullID] = true;
                        }
                    }
                    if (component && component.children !== undefined) {
                        renderContainer(component);
                        renderindex = lump.close_tag.lumpindex + 1;
                    }
                    else {
                        renderindex = renderComponentSystem(basecontainer, component, lump);
                    }
                }
                if (renderindex === t1.lumps.length) {
                    break;
                }
            }
            if (debugMode) {
                children = basecontainer.children;
                for (var key = 0; key < children.length; ++key) {
                    child = children[key];
                    if (!rendered[child.fullID]) {
                        renderDebugMessage("Component " +
                            child.componentType + " with full ID " +
                            child.fullID + " could not be found within template " +
                            fluid.debugLump(baselump));
                    }
                }
            }

        };

        function renderCollect(collump) {
            dumpTillLump(collump.parent.lumps, collump.lumpindex, collump.close_tag.lumpindex + 1);
        }

        // Let us pray
        function renderCollects() {
            for (var key in collected) {
                var collist = collected[key];
                for (var i = 0; i < collist.length; ++i) {
                    renderCollect(collist[i]);
                }
            }
        }

        function processDecoratorQueue() {
            for (var i = 0; i < decoratorQueue.length; ++i) {
                var decorator = decoratorQueue[i];
                for (var j = 0; j < decorator.ids.length; ++j) {
                    var id = decorator.ids[j];
                    var node = fluid.byId(id, renderOptions.document);
                    if (!node) {
                        fluid.fail("Error during rendering - component with id " + id +
                            " which has a queued decorator was not found in the output markup");
                    }
                    if (decorator.type === "jQuery") {
                        var jnode = renderOptions.jQuery(node);
                        jnode[decorator.func].apply(jnode, fluid.makeArray(decorator.args));
                    }
                    else if (decorator.type === "fluid") {
                        var args = decorator.args;
                        if (!args) {
                            var thisContainer = renderOptions.jQuery(node);
                            if (!decorator.container) {
                                decorator.container = thisContainer;
                            }
                            else {
                                decorator.container.push(node);
                            }
                            args = [thisContainer, decorator.options];
                        }
                        var that = renderer.invokeFluidDecorator(decorator.func, args, id, i, options);
                        decorator.that = that;
                    }
                    else if (decorator.type === "event") {
                        node[decorator.event] = decorator.handler;
                    }
                }
            }
        }

        that.renderTemplates = function () {
            tree = fixupTree(tree, options.model, options.resolverGetConfig);
            var template = templates[0];
            resolveBranches(templates.globalmap, tree, template.rootlump);
            renderedbindings = {};
            renderCollects();
            renderRecurse(tree, template.rootlump, template.lumps[template.firstdocumentindex]);
            return out;
        };

        that.processDecoratorQueue = function () {
            processDecoratorQueue();
        };
        return that;

    };

    jQuery.extend(true, fluid.renderer, renderer);

    /*
     * This function is unsupported: It is not really intended for use by implementors.
     */
    fluid.ComponentReference = function (reference) {
        this.reference = reference;
    };

    // Explodes a raw "hash" into a list of UIOutput/UIBound entries
    fluid.explode = function (hash, basepath) {
        var togo = [];
        for (var key in hash) {
            var binding = basepath === undefined ? key : basepath + "." + key;
            togo[togo.length] = {ID: key, value: hash[key], valuebinding: binding};
        }
        return togo;
    };


   /**
    * A common utility function to make a simple view of rows, where each row has a selection control and a label
    * @param {Object} optionlist An array of the values of the options in the select
    * @param {Object} opts An object with this structure: {
            selectID: "",
            rowID: "",
            inputID: "",
            labelID: ""
        }
    */
    fluid.explodeSelectionToInputs = function (optionlist, opts) {
        return fluid.transform(optionlist, function (option, index) {
            return {
                ID: opts.rowID,
                children: [
                    {ID: opts.inputID, parentRelativeID: "..::" + opts.selectID, choiceindex: index},
                    {ID: opts.labelID, parentRelativeID: "..::" + opts.selectID, choiceindex: index}
                ]
            };
        });
    };

    fluid.resolveMessageSource = function (messageSource) {
        if (messageSource.type === "data") {
            if (messageSource.url === undefined) {
                return fluid.messageLocator(messageSource.messages, messageSource.resolveFunc);
            }
            else {
              // TODO: fetch via AJAX, and convert format if necessary
            }
        }
        else if (messageSource.type === "resolver") {
            return messageSource.resolver.resolve;
        }
    };

    fluid.renderTemplates = function (templates, tree, options, fossilsIn) {
        var renderer = fluid.renderer(templates, tree, options, fossilsIn);
        var rendered = renderer.renderTemplates();
        return rendered;
    };
    /** A driver to render and bind an already parsed set of templates onto
     * a node. See documentation for fluid.selfRender.
     * @param templates A parsed template set, as returned from fluid.selfRender or
     * fluid.parseTemplates.
     */

    fluid.reRender = function (templates, node, tree, options) {
        options = options || {};
        var renderer = fluid.renderer(templates, tree, options, options.fossils);
        options = renderer.options;
              // Empty the node first, to head off any potential id collisions when rendering
        node = fluid.unwrap(node);
        var lastFocusedElement = fluid.getLastFocusedElement ? fluid.getLastFocusedElement() : null;
        var lastId;
        if (lastFocusedElement && fluid.dom.isContainer(node, lastFocusedElement)) {
            lastId = lastFocusedElement.id;
        }
        if ($.browser.msie) {
            options.jQuery(node).empty(); //- this operation is very slow.
        }
        else {
            node.innerHTML = "";
        }

        var rendered = renderer.renderTemplates();
        if (options.renderRaw) {
            rendered = fluid.XMLEncode(rendered);
            rendered = rendered.replace(/\n/g, "<br/>");
        }
        if (options.model) {
            fluid.bindFossils(node, options.model, options.fossils);
        }
        if ($.browser.msie) {
            options.jQuery(node).html(rendered);
        }
        else {
            node.innerHTML = rendered;
        }
        renderer.processDecoratorQueue();
        if (lastId) {
            var element = fluid.byId(lastId, options.document);
            if (element) {
                options.jQuery(element).focus();
            }
        }

        return templates;
    };

    function findNodeValue(rootNode) {
        var node = fluid.dom.iterateDom(rootNode, function (node) {
          // NB, in Firefox at least, comment and cdata nodes cannot be distinguished!
            return node.nodeType === 8 || node.nodeType === 4 ? "stop" : null;
        }, true);
        var value = node.nodeValue;
        if (value.indexOf("[CDATA[") === 0) {
            return value.substring(6, value.length - 2);
        }
        else {
            return value;
        }
    }

    fluid.extractTemplate = function (node, armouring) {
        if (!armouring) {
            return node.innerHTML;
        }
        else {
            return findNodeValue(node);
        }
    };
    /** A slightly generalised version of fluid.selfRender that does not assume that the
     * markup used to source the template is within the target node.
     * @param source Either a structure {node: node, armouring: armourstyle} or a string
     * holding a literal template
     * @param target The node to receive the rendered markup
     * @param tree, options, return as for fluid.selfRender
     */
    fluid.render = function (source, target, tree, options) {
        options = options || {};
        var template = source;
        if (typeof(source) === "object") {
            template = fluid.extractTemplate(fluid.unwrap(source.node), source.armouring);
        }
        target = fluid.unwrap(target);
        var resourceSpec = {base: {resourceText: template,
                            href: ".", resourceKey: ".", cutpoints: options.cutpoints}
                            };
        var templates = fluid.parseTemplates(resourceSpec, ["base"], options);
        return fluid.reRender(templates, target, tree, options);
    };

    /** A simple driver for single node self-templating. Treats the markup for a
     * node as a template, parses it into a template structure, renders it using
     * the supplied component tree and options, then replaces the markup in the
     * node with the rendered markup, and finally performs any required data
     * binding. The parsed template is returned for use with a further call to
     * reRender.
     * @param node The node both holding the template, and whose markup is to be
     * replaced with the rendered result.
     * @param tree The component tree to be rendered.
     * @param options An options structure to configure the rendering and binding process.
     * @return A templates structure, suitable for a further call to fluid.reRender or
     * fluid.renderTemplates.
     */
    fluid.selfRender = function (node, tree, options) {
        options = options || {};
        return fluid.render({node: node, armouring: options.armouring}, node, tree, options);
    };

})(jQuery, fluid_2_0_0);
;
/*
Copyright 2008-2010 University of Cambridge
Copyright 2008-2009 University of Toronto
Copyright 2010-2011 Lucendo Development Ltd.

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

fluid_2_0_0 = fluid_2_0_0 || {};

(function ($, fluid) {
    "use strict";

    if (!fluid.renderer) {
        fluid.fail("fluidRenderer.js is a necessary dependency of RendererUtilities");
    }

    // TODO: API status of these 3 functions is uncertain. So far, they have never
    // appeared in documentation.
    fluid.renderer.visitDecorators = function (that, visitor) {
        fluid.visitComponentChildren(that, function (component, name) {
            if (name.indexOf(fluid.renderer.decoratorComponentPrefix) === 0) {
                visitor(component, name);
            }
        }, {flat: true}, []);
    };

    fluid.renderer.clearDecorators = function (that) {
        var instantiator = fluid.getInstantiator(that);
        fluid.renderer.visitDecorators(that, function (component, name) {
            instantiator.clearComponent(that, name);
        });
    };

    fluid.renderer.getDecoratorComponents = function (that) {
        var togo = {};
        fluid.renderer.visitDecorators(that, function (component, name) {
            togo[name] = component;
        });
        return togo;
    };

    // Utilities for coordinating options in renderer components - this code is all pretty
    // dreadful and needs to be organised as a suitable set of defaults and policies
    fluid.renderer.modeliseOptions = function (options, defaults, baseOptions) {
        return $.extend({}, defaults, fluid.filterKeys(baseOptions, ["model", "applier"]), options);
    };
    fluid.renderer.reverseMerge = function (target, source, names) {
        names = fluid.makeArray(names);
        fluid.each(names, function (name) {
            if (target[name] === undefined && source[name] !== undefined) {
                target[name] = source[name];
            }
        });
    };

    /** "Renderer component" infrastructure **/
  // TODO: fix this up with IoC and improved handling of templateSource as well as better
  // options layout (model appears in both rOpts and eOpts)
  // "options" here is the original "rendererFnOptions"
    fluid.renderer.createRendererSubcomponent = function (container, selectors, options, parentThat, fossils) {
        options = options || {};
        var source = options.templateSource ? options.templateSource : {node: $(container)};
        var nativeModel = options.rendererOptions.model === undefined;
        var rendererOptions = fluid.renderer.modeliseOptions(options.rendererOptions, null, parentThat);
        rendererOptions.fossils = fossils || {};
        rendererOptions.parentComponent = parentThat;
        if (container.jquery) {
            var cascadeOptions = {
                document: container[0].ownerDocument,
                jQuery: container.constructor
            };
            fluid.renderer.reverseMerge(rendererOptions, cascadeOptions, fluid.keys(cascadeOptions));
        }

        var that = {};

        var templates = null;
        that.render = function (tree) {
            var cutpointFn = options.cutpointGenerator || "fluid.renderer.selectorsToCutpoints";
            rendererOptions.cutpoints = rendererOptions.cutpoints || fluid.invokeGlobalFunction(cutpointFn, [selectors, options]);
            if (nativeModel) { // check necessary since the component insanely supports the possibility the model is not the component's model!
                               // and the pagedTable uses this.
                rendererOptions.model = parentThat.model; // fix FLUID-5664
            }
            var renderTarget = $(options.renderTarget ? options.renderTarget : container);

            if (templates) {
                fluid.clear(rendererOptions.fossils);
                fluid.reRender(templates, renderTarget, tree, rendererOptions);
            }
            else {
                if (typeof(source) === "function") { // TODO: make a better attempt than this at asynchrony
                    source = source();
                }
                templates = fluid.render(source, renderTarget, tree, rendererOptions);
            }
        };
        return that;
    };

    fluid.defaults("fluid.rendererComponent", {
        gradeNames: ["fluid.viewComponent"],
        initFunction: "fluid.initRendererComponent",
        mergePolicy: {
            "rendererOptions.idMap": "nomerge",
            protoTree: "noexpand, replace",
            parentBundle: "nomerge",
            "changeApplierOptions.resolverSetConfig": "resolverSetConfig"
        },
        invokers: {
            refreshView: {
                funcName: "fluid.rendererComponent.refreshView",
                args: "{that}"
            },
            produceTree: {
                funcName: "fluid.rendererComponent.produceTree",
                args: "{that}"
            }
        },
        rendererOptions: {
            autoBind: true
        },
        events: {
            onResourcesFetched: null,
            prepareModelForRender: null,
            onRenderTree: null,
            afterRender: null
        },
        listeners: {
            onCreate: {
                funcName: "fluid.rendererComponent.renderOnInit",
                args: ["{that}.options.renderOnInit", "{that}"],
                priority: "last"
            }
        }
    });

    fluid.rendererComponent.renderOnInit = function (renderOnInit, that) {
        if (renderOnInit || that.renderOnInit) {
            that.refreshView();
        }
    };

    fluid.protoExpanderForComponent = function (parentThat, options) {
        var expanderOptions = fluid.renderer.modeliseOptions(options.expanderOptions, {ELstyle: "${}"}, parentThat);
        fluid.renderer.reverseMerge(expanderOptions, options, ["resolverGetConfig", "resolverSetConfig"]);
        var expander = fluid.renderer.makeProtoExpander(expanderOptions, parentThat);
        return expander;
    };

    fluid.rendererComponent.refreshView = function (that) {
        if (!that.renderer) {
            // Terrible stopgap fix for FLUID-5279 - all of this implementation will be swept away
            // model relay may cause this to be called during init, and we have no proper definition for "that.renderer" since it is
            // constructed in a terrible way
            that.renderOnInit = true;
            return;
        } else {
            fluid.renderer.clearDecorators(that);
            that.events.prepareModelForRender.fire(that.model, that.applier, that);
            var tree = that.produceTree(that);
            var rendererFnOptions = that.renderer.rendererFnOptions;
            // Terrible stopgap fix for FLUID-5821 - given that model reference may be rebound, generate the expander from scratch on every render
            if (!rendererFnOptions.noexpand) {
                var expander = fluid.protoExpanderForComponent(that, rendererFnOptions);
                tree = expander(tree);
            }
            that.events.onRenderTree.fire(that, tree);
            that.renderer.render(tree);
            that.events.afterRender.fire(that);
        }
    };

    fluid.rendererComponent.produceTree = function (that) {
        var produceTreeOption = that.options.produceTree;
        return produceTreeOption ?
            (typeof(produceTreeOption) === "string" ? fluid.getGlobalValue(produceTreeOption) : produceTreeOption) (that) :
            that.options.protoTree;
    };

    fluid.initRendererComponent = function (componentName, container, options) {
        var that = fluid.initView(componentName, container, options, {gradeNames: ["fluid.rendererComponent"]});
        fluid.getForComponent(that, "model"); // Force resolution of these due to our terrible workflow
        fluid.getForComponent(that, "applier");
        fluid.diagnoseFailedView(componentName, that, fluid.defaults(componentName), arguments);

        fluid.fetchResources(that.options.resources, that.events.onResourcesFetched.fire); // TODO: deal with asynchrony

        var rendererOptions = fluid.renderer.modeliseOptions(that.options.rendererOptions, null, that);

        var messageResolver;
        if (!rendererOptions.messageSource && that.options.strings) {
            messageResolver = fluid.messageResolver({
                messageBase: that.options.strings,
                resolveFunc: that.options.messageResolverFunction,
                parents: fluid.makeArray(that.options.parentBundle)
            });
            rendererOptions.messageSource = {type: "resolver", resolver: messageResolver};
        }
        fluid.renderer.reverseMerge(rendererOptions, that.options, ["resolverGetConfig", "resolverSetConfig"]);
        that.rendererOptions = rendererOptions;

        var rendererFnOptions = $.extend({}, that.options.rendererFnOptions, {
            rendererOptions: rendererOptions,
            repeatingSelectors: that.options.repeatingSelectors,
            selectorsToIgnore: that.options.selectorsToIgnore,
            expanderOptions: {
                envAdd: {styles: that.options.styles}
            }
        });

        if (that.options.resources && that.options.resources.template) {
            rendererFnOptions.templateSource = function () { // TODO: don't obliterate, multitemplates, etc.
                return that.options.resources.template.resourceText;
            };
        }

        fluid.renderer.reverseMerge(rendererFnOptions, that.options, ["resolverGetConfig", "resolverSetConfig"]);
        if (rendererFnOptions.rendererTargetSelector) {
            container = function () {return that.dom.locate(rendererFnOptions.rendererTargetSelector); };
        }
        var renderer = {
            fossils: {},
            rendererFnOptions: rendererFnOptions,
            boundPathForNode: function (node) {
                return fluid.boundPathForNode(node, renderer.fossils);
            }
        };

        var rendererSub = fluid.renderer.createRendererSubcomponent(container, that.options.selectors, rendererFnOptions, that, renderer.fossils);
        that.renderer = $.extend(renderer, rendererSub);

        if (messageResolver) {
            that.messageResolver = messageResolver;
        }
        renderer.refreshView = fluid.getForComponent(that, "refreshView"); // Stopgap implementation for FLUID-4334

        return that;
    };

    var removeSelectors = function (selectors, selectorsToIgnore) {
        fluid.each(fluid.makeArray(selectorsToIgnore), function (selectorToIgnore) {
            delete selectors[selectorToIgnore];
        });
        return selectors;
    };

    var markRepeated = function (selectorKey, repeatingSelectors) {
        if (repeatingSelectors) {
            fluid.each(repeatingSelectors, function (repeatingSelector) {
                if (selectorKey === repeatingSelector) {
                    selectorKey = selectorKey + ":";
                }
            });
        }
        return selectorKey;
    };

    fluid.renderer.selectorsToCutpoints = function (selectors, options) {
        var togo = [];
        options = options || {};
        selectors = fluid.copy(selectors); // Make a copy before potentially destructively changing someone's selectors.

        if (options.selectorsToIgnore) {
            selectors = removeSelectors(selectors, options.selectorsToIgnore);
        }

        for (var selectorKey in selectors) {
            togo.push({
                id: markRepeated(selectorKey, options.repeatingSelectors),
                selector: selectors[selectorKey]
            });
        }

        return togo;
    };

    /** END of "Renderer Components" infrastructure **/

    fluid.renderer.NO_COMPONENT = {};

    /** A special "shallow copy" operation suitable for nondestructively
     * merging trees of components. jQuery.extend in shallow mode will
     * neglect null valued properties.
     * This function is unsupported: It is not really intended for use by implementors.
     */
    fluid.renderer.mergeComponents = function (target, source) {
        for (var key in source) {
            target[key] = source[key];
        }
        return target;
    };

    fluid.registerNamespace("fluid.renderer.selection");

    /** Definition of expanders - firstly, "heavy" expanders **/

    fluid.renderer.selection.inputs = function (options, container, key, config) {
        fluid.expect("Selection to inputs expander", options, ["selectID", "inputID", "labelID", "rowID"]);
        var selection = config.expander(options.tree);
        var rows = fluid.transform(selection.optionlist.value, function (option, index) {
            var togo = {};
            var element =  {parentRelativeID: "..::" + options.selectID, choiceindex: index};
            togo[options.inputID] = element;
            togo[options.labelID] = fluid.copy(element);
            return togo;
        });
        var togo = {}; // TODO: JICO needs to support "quoted literal key initialisers" :P
        togo[options.selectID] = selection;
        togo[options.rowID] = {children: rows};
        togo = config.expander(togo);
        return togo;
    };

    fluid.renderer.repeat = function (options, container, key, config) {
        fluid.expect("Repetition expander", options, ["controlledBy", "tree"]);
        var env = config.threadLocal();
        var path = fluid.extractContextualPath(options.controlledBy, {ELstyle: "ALL"}, env);
        var list = fluid.get(config.model, path, config.resolverGetConfig);

        var togo = {};
        if (!list || list.length === 0) {
            return options.ifEmpty ? config.expander(options.ifEmpty) : togo;
        }
        var expanded = [];
        fluid.each(list, function (element, i) {
            var EL = fluid.model.composePath(path, i);
            var envAdd = {};
            if (options.pathAs) {
                envAdd[options.pathAs] = "${" + EL + "}";
            }
            if (options.valueAs) {
                envAdd[options.valueAs] = fluid.get(config.model, EL, config.resolverGetConfig);
            }
            var expandrow = fluid.withEnvironment(envAdd, function () {
                return config.expander(options.tree);
            }, env);
            if (fluid.isArrayable(expandrow)) {
                if (expandrow.length > 0) {
                    expanded.push({children: expandrow});
                }
            }
            else if (expandrow !== fluid.renderer.NO_COMPONENT) {
                expanded.push(expandrow);
            }
        });
        var repeatID = options.repeatID;
        if (repeatID.indexOf(":") === -1) {
            repeatID = repeatID + ":";
        }
        fluid.each(expanded, function (entry) {entry.ID = repeatID; });
        return expanded;
    };

    fluid.renderer.condition = function (options, container, key, config) {
        fluid.expect("Selection to condition expander", options, ["condition"]);
        var condition;
        if (options.condition.funcName) {
            var args = config.expandLight(options.condition.args);
            condition = fluid.invokeGlobalFunction(options.condition.funcName, args);
        } else if (options.condition.expander) {
            condition = config.expander(options.condition);
        } else {
            condition = config.expandLight(options.condition);
        }
        var tree = (condition ? options.trueTree : options.falseTree);
        if (!tree) {
            tree = fluid.renderer.NO_COMPONENT;
        }
        return config.expander(tree);
    };


    /* An EL extraction utility suitable for context expressions which occur in
     * expanding component trees. It dispatches context expressions to fluid.transformContextPath
     * in order to resolve them against EL references stored in the direct environment, and hence
     * to the "true (direct) model" - however, if there is no entry in the direct environment, it will resort to the "externalFetcher".
     * It satisfies a similar contract as fluid.extractEL, in that it will either return
     * an EL path, or undefined if the string value supplied cannot be interpreted
     * as an EL path with respect to the supplied options - it may also return {value: value}
     * in the case the context can be resolved by the supplied "externalFetcher" (required for FLUID-4986)
     */
    // unsupported, non-API function
    fluid.extractContextualPath = function (string, options, env, externalFetcher) {
        var parsed = fluid.extractELWithContext(string, options);
        if (parsed) {
            if (parsed.context) {
                return env[parsed.context] ? fluid.transformContextPath(parsed, env).path : {value: externalFetcher(parsed)};
            }
            else {
                return parsed.path;
            }
        }
    };

    // unsupported, non-API function
    fluid.transformContextPath = function (parsed, env) {
        if (parsed.context) {
            var fetched = env[parsed.context];
            var EL;
            if (typeof(fetched) === "string") {
                EL = fluid.extractEL(fetched, {ELstyle: "${}"});
            }
            if (EL) {
                return {
                    noDereference: parsed.path === "",
                    path: fluid.model.composePath(EL, parsed.path)
                };
            }
        }
        return parsed;
    };

    // A forgiving variation of "makeStackFetcher" that returns nothing on failing to resolve an IoC reference,
    // in keeping with current protoComponent semantics. Note to self: abolish protoComponents
    fluid.renderer.makeExternalFetcher = function (contextThat) {
        return function (parsed) {
            var foundComponent = fluid.resolveContext(parsed.context, contextThat);
            return foundComponent ? fluid.getForComponent(foundComponent, parsed.path) : undefined;
        };
    };

    /** Create a "protoComponent expander" with the supplied set of options.
     * The returned value will be a function which accepts a "protoComponent tree"
     * as argument, and returns a "fully expanded" tree suitable for supplying
     * directly to the renderer.
     * A "protoComponent tree" is similar to the "dehydrated form" accepted by
     * the historical renderer - only
     * i) The input format is unambiguous - this expander will NOT accept hydrated
     * components in the {ID: "myId, myfield: "myvalue"} form - but ONLY in
     * the dehydrated {myID: {myfield: myvalue}} form.
     * ii) This expander has considerably greater power to expand condensed trees.
     * In particular, an "EL style" option can be supplied which will expand bare
     * strings found as values in the tree into UIBound components by a configurable
     * strategy. Supported values for "ELstyle" are a) "ALL" - every string will be
     * interpreted as an EL reference and assigned to the "valuebinding" member of
     * the UIBound, or b) any single character, which if it appears as the first
     * character of the string, will mark it out as an EL reference - otherwise it
     * will be considered a literal value, or c) the value "${}" which will be
     * recognised bracketing any other EL expression.
     */

    fluid.renderer.makeProtoExpander = function (expandOptions, parentThat) {
      // shallow copy of options - cheaply avoid destroying model, and all others are primitive
        var options = $.extend({
            ELstyle: "${}"
        }, expandOptions); // shallow copy of options
        if (parentThat) {
            options.externalFetcher = fluid.renderer.makeExternalFetcher(parentThat);
        }
        var threadLocal; // rebound on every expansion at entry point

        function fetchEL(string) {
            var env = threadLocal();
            return fluid.extractContextualPath(string, options, env, options.externalFetcher);
        }

        var IDescape = options.IDescape || "\\";

        var expandLight = function (source) {
            return fluid.expand(source, options);
        };

        var expandBound = function (value, concrete) {
            if (value.messagekey !== undefined) {
                return {
                    componentType: "UIMessage",
                    messagekey: expandBound(value.messagekey),
                    args: expandLight(value.args)
                };
            }
            var proto;
            if (!fluid.isPrimitive(value) && !fluid.isArrayable(value)) {
                proto = $.extend({}, value);
                if (proto.decorators) {
                    proto.decorators = expandLight(proto.decorators);
                }
                value = proto.value;
                delete proto.value;
            } else {
                proto = {};
            }
            var EL;
            if (typeof (value) === "string") {
                var fetched = fetchEL(value);
                EL = typeof (fetched) === "string" ? fetched : null;
                value = fluid.get(fetched, "value") || value;
            }
            if (EL) {
                proto.valuebinding = EL;
            } else if (value !== undefined) {
                proto.value = value;
            }
            if (options.model && proto.valuebinding && proto.value === undefined) {
                proto.value = fluid.get(options.model, proto.valuebinding, options.resolverGetConfig);
            }
            if (concrete) {
                proto.componentType = "UIBound";
            }
            return proto;
        };

        options.filter = fluid.expander.lightFilter;

        var expandCond;
        var expandLeafOrCond;

        var expandEntry = function (entry) {
            var comp = [];
            expandCond(entry, comp);
            return {children: comp};
        };

        var expandExternal = function (entry) {
            if (entry === fluid.renderer.NO_COMPONENT) {
                return entry;
            }
            var singleTarget;
            var target = [];
            var pusher = function (comp) {
                singleTarget = comp;
            };
            expandLeafOrCond(entry, target, pusher);
            return singleTarget || target;
        };

        var expandConfig = {
            model: options.model,
            resolverGetConfig: options.resolverGetConfig,
            resolverSetConfig: options.resolverSetConfig,
            expander: expandExternal,
            expandLight: expandLight
            //threadLocal: threadLocal
        };

        var expandLeaf = function (leaf, componentType) {
            var togo = {componentType: componentType};
            var map = fluid.renderer.boundMap[componentType] || {};
            for (var key in leaf) {
                if (/decorators|args/.test(key)) {
                    togo[key] = expandLight(leaf[key]);
                    continue;
                } else if (map[key]) {
                    togo[key] = expandBound(leaf[key]);
                } else {
                    togo[key] = leaf[key];
                }
            }
            return togo;
        };

        // A child entry may be a cond, a leaf, or another "thing with children".
        // Unlike the case with a cond's contents, these must be homogeneous - at least
        // they may either be ALL leaves, or else ALL cond/childed etc.
        // In all of these cases, the key will be THE PARENT'S KEY
        var expandChildren = function (entry, pusher) {
            var children = entry.children;
            for (var i = 0; i < children.length; ++i) {
                // each child in this list will lead to a WHOLE FORKED set of children.
                var target = [];
                var comp = { children: target};

                var child = children[i];
                // This use of function creation within a loop is acceptable since
                // the function does not attempt to close directly over the loop counter
                var childPusher = function (comp) { // eslint-disable-line no-loop-func
                    target[target.length] = comp;
                };

                expandLeafOrCond(child, target, childPusher);
                // Rescue the case of an expanded leaf into single component - TODO: check what sense this makes of the grammar
                if (comp.children.length === 1 && !comp.children[0].ID) {
                    comp = comp.children[0];
                }
                pusher(comp);
            }
        };

        function detectBareBound(entry) {
            return fluid.find(entry, function (value, key) {
                return key === "decorators";
            }) !== false;
        }

        // We have reached something which is either a leaf or Cond - either inside
        // a Cond or as an entry in children.
        expandLeafOrCond = function (entry, target, pusher) {
            var componentType = fluid.renderer.inferComponentType(entry);
            if (!componentType && (fluid.isPrimitive(entry) || detectBareBound(entry))) {
                componentType = "UIBound";
            }
            if (componentType) {
                pusher(componentType === "UIBound" ? expandBound(entry, true) : expandLeaf(entry, componentType));
            } else {
              // we couldn't recognise it as a leaf, so it must be a cond
              // this may be illegal if we are already in a cond.
                if (!target) {
                    fluid.fail("Illegal cond->cond transition");
                }
                expandCond(entry, target);
            }
        };

        // cond entry may be a leaf, "thing with children" or a "direct bound".
        // a Cond can ONLY occur as a direct member of "children". Each "cond" entry may
        // give rise to one or many elements with the SAME key - if "expandSingle" discovers
        // "thing with children" they will all share the same key found in proto.
        expandCond = function (proto, target) {
            var key;
            var expandToTarget = function (expander) {
                var expanded = fluid.invokeGlobalFunction(expander.type, [expander, proto, key, expandConfig]);
                if (expanded !== fluid.renderer.NO_COMPONENT) {
                    fluid.each(expanded, function (el) {target[target.length] = el; });
                }
            };
            var condPusher = function (comp) {
                comp.ID = key;
                target[target.length] = comp;
            };
            for (key in proto) {
                var entry = proto[key];
                if (key.charAt(0) === IDescape) {
                    key = key.substring(1);
                }
                if (key === "expander") {
                    var expanders = fluid.makeArray(entry);
                    fluid.each(expanders, expandToTarget);
                } else if (entry) {
                    if (entry.children) {
                        if (key.indexOf(":") === -1) {
                            key = key + ":";
                        }
                        expandChildren(entry, condPusher);
                    } else if (fluid.renderer.isBoundPrimitive(entry)) {
                        condPusher(expandBound(entry, true));
                    } else {
                        expandLeafOrCond(entry, null, condPusher);
                    }
                }
            }

        };

        return function (entry) {
            threadLocal = fluid.threadLocal(function () {
                return $.extend({}, options.envAdd);
            });
            options.fetcher = fluid.makeEnvironmentFetcher(options.model, fluid.transformContextPath, threadLocal, options.externalFetcher);
            expandConfig.threadLocal = threadLocal;
            return expandEntry(entry);
        };
    };

})(jQuery, fluid_2_0_0);

//# sourceMappingURL=infusion-custom.js.map
