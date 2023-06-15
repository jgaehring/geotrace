(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.geotrace = {}));
})(this, (function (exports) { 'use strict';

    /**
     * @module ol/util
     */
    /**
     * @return {?} Any return.
     */
    function abstract() {
        return /** @type {?} */ ((function () {
            throw new Error('Unimplemented abstract method.');
        })());
    }
    /**
     * Counter for getUid.
     * @type {number}
     * @private
     */
    var uidCounter_ = 0;
    /**
     * Gets a unique ID for an object. This mutates the object so that further calls
     * with the same object as a parameter returns the same value. Unique IDs are generated
     * as a strictly increasing sequence. Adapted from goog.getUid.
     *
     * @param {Object} obj The object to get the unique ID for.
     * @return {string} The unique ID for the object.
     * @api
     */
    function getUid(obj) {
        return obj.ol_uid || (obj.ol_uid = String(++uidCounter_));
    }
    /**
     * OpenLayers version.
     * @type {string}
     */
    var VERSION = '6.15.1';

    var __extends$y = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            if (typeof b !== "function" && b !== null)
                throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * Error object thrown when an assertion failed. This is an ECMA-262 Error,
     * extended with a `code` property.
     * See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error.
     */
    var AssertionError = /** @class */ (function (_super) {
        __extends$y(AssertionError, _super);
        /**
         * @param {number} code Error code.
         */
        function AssertionError(code) {
            var _this = this;
            var path = 'v' + VERSION.split('-')[0];
            var message = 'Assertion failed. See https://openlayers.org/en/' +
                path +
                '/doc/errors/#' +
                code +
                ' for details.';
            _this = _super.call(this, message) || this;
            /**
             * Error code. The meaning of the code can be found on
             * https://openlayers.org/en/latest/doc/errors/ (replace `latest` with
             * the version found in the OpenLayers script's header comment if a version
             * other than the latest is used).
             * @type {number}
             * @api
             */
            _this.code = code;
            /**
             * @type {string}
             */
            _this.name = 'AssertionError';
            // Re-assign message, see https://github.com/Rich-Harris/buble/issues/40
            _this.message = message;
            return _this;
        }
        return AssertionError;
    }(Error));
    var AssertionError$1 = AssertionError;

    /**
     * @module ol/events/Event
     */
    /**
     * @classdesc
     * Stripped down implementation of the W3C DOM Level 2 Event interface.
     * See https://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-interface.
     *
     * This implementation only provides `type` and `target` properties, and
     * `stopPropagation` and `preventDefault` methods. It is meant as base class
     * for higher level events defined in the library, and works with
     * {@link module:ol/events/Target~Target}.
     */
    var BaseEvent = /** @class */ (function () {
        /**
         * @param {string} type Type.
         */
        function BaseEvent(type) {
            /**
             * @type {boolean}
             */
            this.propagationStopped;
            /**
             * @type {boolean}
             */
            this.defaultPrevented;
            /**
             * The event type.
             * @type {string}
             * @api
             */
            this.type = type;
            /**
             * The event target.
             * @type {Object}
             * @api
             */
            this.target = null;
        }
        /**
         * Prevent default. This means that no emulated `click`, `singleclick` or `doubleclick` events
         * will be fired.
         * @api
         */
        BaseEvent.prototype.preventDefault = function () {
            this.defaultPrevented = true;
        };
        /**
         * Stop event propagation.
         * @api
         */
        BaseEvent.prototype.stopPropagation = function () {
            this.propagationStopped = true;
        };
        return BaseEvent;
    }());
    var Event = BaseEvent;

    /**
     * @module ol/ObjectEventType
     */
    /**
     * @enum {string}
     */
    var ObjectEventType = {
        /**
         * Triggered when a property is changed.
         * @event module:ol/Object.ObjectEvent#propertychange
         * @api
         */
        PROPERTYCHANGE: 'propertychange',
    };
    /**
     * @typedef {'propertychange'} Types
     */

    /**
     * @module ol/Disposable
     */
    /**
     * @classdesc
     * Objects that need to clean up after themselves.
     */
    var Disposable = /** @class */ (function () {
        function Disposable() {
            /**
             * The object has already been disposed.
             * @type {boolean}
             * @protected
             */
            this.disposed = false;
        }
        /**
         * Clean up.
         */
        Disposable.prototype.dispose = function () {
            if (!this.disposed) {
                this.disposed = true;
                this.disposeInternal();
            }
        };
        /**
         * Extension point for disposable objects.
         * @protected
         */
        Disposable.prototype.disposeInternal = function () { };
        return Disposable;
    }());
    var Disposable$1 = Disposable;

    /**
     * @module ol/array
     */
    /**
     * Performs a binary search on the provided sorted list and returns the index of the item if found. If it can't be found it'll return -1.
     * https://github.com/darkskyapp/binary-search
     *
     * @param {Array<*>} haystack Items to search through.
     * @param {*} needle The item to look for.
     * @param {Function} [opt_comparator] Comparator function.
     * @return {number} The index of the item if found, -1 if not.
     */
    function binarySearch(haystack, needle, opt_comparator) {
        var mid, cmp;
        var comparator = opt_comparator || numberSafeCompareFunction;
        var low = 0;
        var high = haystack.length;
        var found = false;
        while (low < high) {
            /* Note that "(low + high) >>> 1" may overflow, and results in a typecast
             * to double (which gives the wrong results). */
            mid = low + ((high - low) >> 1);
            cmp = +comparator(haystack[mid], needle);
            if (cmp < 0.0) {
                /* Too low. */
                low = mid + 1;
            }
            else {
                /* Key found or too high */
                high = mid;
                found = !cmp;
            }
        }
        /* Key not found. */
        return found ? low : ~low;
    }
    /**
     * Compare function for array sort that is safe for numbers.
     * @param {*} a The first object to be compared.
     * @param {*} b The second object to be compared.
     * @return {number} A negative number, zero, or a positive number as the first
     *     argument is less than, equal to, or greater than the second.
     */
    function numberSafeCompareFunction(a, b) {
        return a > b ? 1 : a < b ? -1 : 0;
    }
    /**
     * @param {Array<*>} arr Array.
     * @param {number} begin Begin index.
     * @param {number} end End index.
     */
    function reverseSubArray(arr, begin, end) {
        while (begin < end) {
            var tmp = arr[begin];
            arr[begin] = arr[end];
            arr[end] = tmp;
            ++begin;
            --end;
        }
    }
    /**
     * @param {Array<VALUE>} arr The array to modify.
     * @param {!Array<VALUE>|VALUE} data The elements or arrays of elements to add to arr.
     * @template VALUE
     */
    function extend$1(arr, data) {
        var extension = Array.isArray(data) ? data : [data];
        var length = extension.length;
        for (var i = 0; i < length; i++) {
            arr[arr.length] = extension[i];
        }
    }
    /**
     * @param {Array|Uint8ClampedArray} arr1 The first array to compare.
     * @param {Array|Uint8ClampedArray} arr2 The second array to compare.
     * @return {boolean} Whether the two arrays are equal.
     */
    function equals$1(arr1, arr2) {
        var len1 = arr1.length;
        if (len1 !== arr2.length) {
            return false;
        }
        for (var i = 0; i < len1; i++) {
            if (arr1[i] !== arr2[i]) {
                return false;
            }
        }
        return true;
    }

    /**
     * @module ol/functions
     */
    /**
     * Always returns true.
     * @return {boolean} true.
     */
    function TRUE() {
        return true;
    }
    /**
     * A reusable function, used e.g. as a default for callbacks.
     *
     * @return {void} Nothing.
     */
    function VOID() { }
    /**
     * Wrap a function in another function that remembers the last return.  If the
     * returned function is called twice in a row with the same arguments and the same
     * this object, it will return the value from the first call in the second call.
     *
     * @param {function(...any): ReturnType} fn The function to memoize.
     * @return {function(...any): ReturnType} The memoized function.
     * @template ReturnType
     */
    function memoizeOne(fn) {
        var called = false;
        /** @type {ReturnType} */
        var lastResult;
        /** @type {Array<any>} */
        var lastArgs;
        var lastThis;
        return function () {
            var nextArgs = Array.prototype.slice.call(arguments);
            if (!called || this !== lastThis || !equals$1(nextArgs, lastArgs)) {
                called = true;
                lastThis = this;
                lastArgs = nextArgs;
                lastResult = fn.apply(this, arguments);
            }
            return lastResult;
        };
    }

    /**
     * @module ol/obj
     */
    /**
     * Polyfill for Object.assign().  Assigns enumerable and own properties from
     * one or more source objects to a target object.
     * See https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign.
     *
     * @param {!Object} target The target object.
     * @param {...Object} var_sources The source object(s).
     * @return {!Object} The modified target object.
     */
    var assign = typeof Object.assign === 'function'
        ? Object.assign
        : function (target, var_sources) {
            if (target === undefined || target === null) {
                throw new TypeError('Cannot convert undefined or null to object');
            }
            var output = Object(target);
            for (var i = 1, ii = arguments.length; i < ii; ++i) {
                var source = arguments[i];
                if (source !== undefined && source !== null) {
                    for (var key in source) {
                        if (source.hasOwnProperty(key)) {
                            output[key] = source[key];
                        }
                    }
                }
            }
            return output;
        };
    /**
     * Removes all properties from an object.
     * @param {Object} object The object to clear.
     */
    function clear(object) {
        for (var property in object) {
            delete object[property];
        }
    }
    /**
     * Polyfill for Object.values().  Get an array of property values from an object.
     * See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/values
     *
     * @param {!Object<K,V>} object The object from which to get the values.
     * @return {!Array<V>} The property values.
     * @template K,V
     */
    var getValues = typeof Object.values === 'function'
        ? Object.values
        : function (object) {
            var values = [];
            for (var property in object) {
                values.push(object[property]);
            }
            return values;
        };
    /**
     * Determine if an object has any properties.
     * @param {Object} object The object to check.
     * @return {boolean} The object is empty.
     */
    function isEmpty(object) {
        var property;
        for (property in object) {
            return false;
        }
        return !property;
    }

    var __extends$x = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            if (typeof b !== "function" && b !== null)
                throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * @typedef {EventTarget|Target} EventTargetLike
     */
    /**
     * @classdesc
     * A simplified implementation of the W3C DOM Level 2 EventTarget interface.
     * See https://www.w3.org/TR/2000/REC-DOM-Level-2-Events-20001113/events.html#Events-EventTarget.
     *
     * There are two important simplifications compared to the specification:
     *
     * 1. The handling of `useCapture` in `addEventListener` and
     *    `removeEventListener`. There is no real capture model.
     * 2. The handling of `stopPropagation` and `preventDefault` on `dispatchEvent`.
     *    There is no event target hierarchy. When a listener calls
     *    `stopPropagation` or `preventDefault` on an event object, it means that no
     *    more listeners after this one will be called. Same as when the listener
     *    returns false.
     */
    var Target = /** @class */ (function (_super) {
        __extends$x(Target, _super);
        /**
         * @param {*} [opt_target] Default event target for dispatched events.
         */
        function Target(opt_target) {
            var _this = _super.call(this) || this;
            /**
             * @private
             * @type {*}
             */
            _this.eventTarget_ = opt_target;
            /**
             * @private
             * @type {Object<string, number>}
             */
            _this.pendingRemovals_ = null;
            /**
             * @private
             * @type {Object<string, number>}
             */
            _this.dispatching_ = null;
            /**
             * @private
             * @type {Object<string, Array<import("../events.js").Listener>>}
             */
            _this.listeners_ = null;
            return _this;
        }
        /**
         * @param {string} type Type.
         * @param {import("../events.js").Listener} listener Listener.
         */
        Target.prototype.addEventListener = function (type, listener) {
            if (!type || !listener) {
                return;
            }
            var listeners = this.listeners_ || (this.listeners_ = {});
            var listenersForType = listeners[type] || (listeners[type] = []);
            if (listenersForType.indexOf(listener) === -1) {
                listenersForType.push(listener);
            }
        };
        /**
         * Dispatches an event and calls all listeners listening for events
         * of this type. The event parameter can either be a string or an
         * Object with a `type` property.
         *
         * @param {import("./Event.js").default|string} event Event object.
         * @return {boolean|undefined} `false` if anyone called preventDefault on the
         *     event object or if any of the listeners returned false.
         * @api
         */
        Target.prototype.dispatchEvent = function (event) {
            var isString = typeof event === 'string';
            var type = isString ? event : event.type;
            var listeners = this.listeners_ && this.listeners_[type];
            if (!listeners) {
                return;
            }
            var evt = isString ? new Event(event) : /** @type {Event} */ (event);
            if (!evt.target) {
                evt.target = this.eventTarget_ || this;
            }
            var dispatching = this.dispatching_ || (this.dispatching_ = {});
            var pendingRemovals = this.pendingRemovals_ || (this.pendingRemovals_ = {});
            if (!(type in dispatching)) {
                dispatching[type] = 0;
                pendingRemovals[type] = 0;
            }
            ++dispatching[type];
            var propagate;
            for (var i = 0, ii = listeners.length; i < ii; ++i) {
                if ('handleEvent' in listeners[i]) {
                    propagate = /** @type {import("../events.js").ListenerObject} */ (listeners[i]).handleEvent(evt);
                }
                else {
                    propagate = /** @type {import("../events.js").ListenerFunction} */ (listeners[i]).call(this, evt);
                }
                if (propagate === false || evt.propagationStopped) {
                    propagate = false;
                    break;
                }
            }
            if (--dispatching[type] === 0) {
                var pr = pendingRemovals[type];
                delete pendingRemovals[type];
                while (pr--) {
                    this.removeEventListener(type, VOID);
                }
                delete dispatching[type];
            }
            return propagate;
        };
        /**
         * Clean up.
         */
        Target.prototype.disposeInternal = function () {
            this.listeners_ && clear(this.listeners_);
        };
        /**
         * Get the listeners for a specified event type. Listeners are returned in the
         * order that they will be called in.
         *
         * @param {string} type Type.
         * @return {Array<import("../events.js").Listener>|undefined} Listeners.
         */
        Target.prototype.getListeners = function (type) {
            return (this.listeners_ && this.listeners_[type]) || undefined;
        };
        /**
         * @param {string} [opt_type] Type. If not provided,
         *     `true` will be returned if this event target has any listeners.
         * @return {boolean} Has listeners.
         */
        Target.prototype.hasListener = function (opt_type) {
            if (!this.listeners_) {
                return false;
            }
            return opt_type
                ? opt_type in this.listeners_
                : Object.keys(this.listeners_).length > 0;
        };
        /**
         * @param {string} type Type.
         * @param {import("../events.js").Listener} listener Listener.
         */
        Target.prototype.removeEventListener = function (type, listener) {
            var listeners = this.listeners_ && this.listeners_[type];
            if (listeners) {
                var index = listeners.indexOf(listener);
                if (index !== -1) {
                    if (this.pendingRemovals_ && type in this.pendingRemovals_) {
                        // make listener a no-op, and remove later in #dispatchEvent()
                        listeners[index] = VOID;
                        ++this.pendingRemovals_[type];
                    }
                    else {
                        listeners.splice(index, 1);
                        if (listeners.length === 0) {
                            delete this.listeners_[type];
                        }
                    }
                }
            }
        };
        return Target;
    }(Disposable$1));
    var Target$1 = Target;

    /**
     * @module ol/events/EventType
     */
    /**
     * @enum {string}
     * @const
     */
    var EventType = {
        /**
         * Generic change event. Triggered when the revision counter is increased.
         * @event module:ol/events/Event~BaseEvent#change
         * @api
         */
        CHANGE: 'change',
        /**
         * Generic error event. Triggered when an error occurs.
         * @event module:ol/events/Event~BaseEvent#error
         * @api
         */
        ERROR: 'error',
        BLUR: 'blur',
        CLEAR: 'clear',
        CONTEXTMENU: 'contextmenu',
        CLICK: 'click',
        DBLCLICK: 'dblclick',
        DRAGENTER: 'dragenter',
        DRAGOVER: 'dragover',
        DROP: 'drop',
        FOCUS: 'focus',
        KEYDOWN: 'keydown',
        KEYPRESS: 'keypress',
        LOAD: 'load',
        RESIZE: 'resize',
        TOUCHMOVE: 'touchmove',
        WHEEL: 'wheel',
    };

    /**
     * @module ol/events
     */
    /**
     * Key to use with {@link module:ol/Observable.unByKey}.
     * @typedef {Object} EventsKey
     * @property {ListenerFunction} listener Listener.
     * @property {import("./events/Target.js").EventTargetLike} target Target.
     * @property {string} type Type.
     * @api
     */
    /**
     * Listener function. This function is called with an event object as argument.
     * When the function returns `false`, event propagation will stop.
     *
     * @typedef {function((Event|import("./events/Event.js").default)): (void|boolean)} ListenerFunction
     * @api
     */
    /**
     * @typedef {Object} ListenerObject
     * @property {ListenerFunction} handleEvent HandleEvent listener function.
     */
    /**
     * @typedef {ListenerFunction|ListenerObject} Listener
     */
    /**
     * Registers an event listener on an event target. Inspired by
     * https://google.github.io/closure-library/api/source/closure/goog/events/events.js.src.html
     *
     * This function efficiently binds a `listener` to a `this` object, and returns
     * a key for use with {@link module:ol/events.unlistenByKey}.
     *
     * @param {import("./events/Target.js").EventTargetLike} target Event target.
     * @param {string} type Event type.
     * @param {ListenerFunction} listener Listener.
     * @param {Object} [opt_this] Object referenced by the `this` keyword in the
     *     listener. Default is the `target`.
     * @param {boolean} [opt_once] If true, add the listener as one-off listener.
     * @return {EventsKey} Unique key for the listener.
     */
    function listen(target, type, listener, opt_this, opt_once) {
        if (opt_this && opt_this !== target) {
            listener = listener.bind(opt_this);
        }
        if (opt_once) {
            var originalListener_1 = listener;
            listener = function () {
                target.removeEventListener(type, listener);
                originalListener_1.apply(this, arguments);
            };
        }
        var eventsKey = {
            target: target,
            type: type,
            listener: listener,
        };
        target.addEventListener(type, listener);
        return eventsKey;
    }
    /**
     * Registers a one-off event listener on an event target. Inspired by
     * https://google.github.io/closure-library/api/source/closure/goog/events/events.js.src.html
     *
     * This function efficiently binds a `listener` as self-unregistering listener
     * to a `this` object, and returns a key for use with
     * {@link module:ol/events.unlistenByKey} in case the listener needs to be
     * unregistered before it is called.
     *
     * When {@link module:ol/events.listen} is called with the same arguments after this
     * function, the self-unregistering listener will be turned into a permanent
     * listener.
     *
     * @param {import("./events/Target.js").EventTargetLike} target Event target.
     * @param {string} type Event type.
     * @param {ListenerFunction} listener Listener.
     * @param {Object} [opt_this] Object referenced by the `this` keyword in the
     *     listener. Default is the `target`.
     * @return {EventsKey} Key for unlistenByKey.
     */
    function listenOnce(target, type, listener, opt_this) {
        return listen(target, type, listener, opt_this, true);
    }
    /**
     * Unregisters event listeners on an event target. Inspired by
     * https://google.github.io/closure-library/api/source/closure/goog/events/events.js.src.html
     *
     * The argument passed to this function is the key returned from
     * {@link module:ol/events.listen} or {@link module:ol/events.listenOnce}.
     *
     * @param {EventsKey} key The key.
     */
    function unlistenByKey(key) {
        if (key && key.target) {
            key.target.removeEventListener(key.type, key.listener);
            clear(key);
        }
    }

    var __extends$w = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            if (typeof b !== "function" && b !== null)
                throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /***
     * @template {string} Type
     * @template {Event|import("./events/Event.js").default} EventClass
     * @template Return
     * @typedef {(type: Type, listener: (event: EventClass) => ?) => Return} OnSignature
     */
    /***
     * @template {string} Type
     * @template Return
     * @typedef {(type: Type[], listener: (event: Event|import("./events/Event").default) => ?) => Return extends void ? void : Return[]} CombinedOnSignature
     */
    /**
     * @typedef {'change'|'error'} EventTypes
     */
    /***
     * @template Return
     * @typedef {OnSignature<EventTypes, import("./events/Event.js").default, Return> & CombinedOnSignature<EventTypes, Return>} ObservableOnSignature
     */
    /**
     * @classdesc
     * Abstract base class; normally only used for creating subclasses and not
     * instantiated in apps.
     * An event target providing convenient methods for listener registration
     * and unregistration. A generic `change` event is always available through
     * {@link module:ol/Observable~Observable#changed}.
     *
     * @fires import("./events/Event.js").default
     * @api
     */
    var Observable = /** @class */ (function (_super) {
        __extends$w(Observable, _super);
        function Observable() {
            var _this = _super.call(this) || this;
            _this.on =
                /** @type {ObservableOnSignature<import("./events").EventsKey>} */ (_this.onInternal);
            _this.once =
                /** @type {ObservableOnSignature<import("./events").EventsKey>} */ (_this.onceInternal);
            _this.un = /** @type {ObservableOnSignature<void>} */ (_this.unInternal);
            /**
             * @private
             * @type {number}
             */
            _this.revision_ = 0;
            return _this;
        }
        /**
         * Increases the revision counter and dispatches a 'change' event.
         * @api
         */
        Observable.prototype.changed = function () {
            ++this.revision_;
            this.dispatchEvent(EventType.CHANGE);
        };
        /**
         * Get the version number for this object.  Each time the object is modified,
         * its version number will be incremented.
         * @return {number} Revision.
         * @api
         */
        Observable.prototype.getRevision = function () {
            return this.revision_;
        };
        /**
         * @param {string|Array<string>} type Type.
         * @param {function((Event|import("./events/Event").default)): ?} listener Listener.
         * @return {import("./events.js").EventsKey|Array<import("./events.js").EventsKey>} Event key.
         * @protected
         */
        Observable.prototype.onInternal = function (type, listener) {
            if (Array.isArray(type)) {
                var len = type.length;
                var keys = new Array(len);
                for (var i = 0; i < len; ++i) {
                    keys[i] = listen(this, type[i], listener);
                }
                return keys;
            }
            else {
                return listen(this, /** @type {string} */ (type), listener);
            }
        };
        /**
         * @param {string|Array<string>} type Type.
         * @param {function((Event|import("./events/Event").default)): ?} listener Listener.
         * @return {import("./events.js").EventsKey|Array<import("./events.js").EventsKey>} Event key.
         * @protected
         */
        Observable.prototype.onceInternal = function (type, listener) {
            var key;
            if (Array.isArray(type)) {
                var len = type.length;
                key = new Array(len);
                for (var i = 0; i < len; ++i) {
                    key[i] = listenOnce(this, type[i], listener);
                }
            }
            else {
                key = listenOnce(this, /** @type {string} */ (type), listener);
            }
            /** @type {Object} */ (listener).ol_key = key;
            return key;
        };
        /**
         * Unlisten for a certain type of event.
         * @param {string|Array<string>} type Type.
         * @param {function((Event|import("./events/Event").default)): ?} listener Listener.
         * @protected
         */
        Observable.prototype.unInternal = function (type, listener) {
            var key = /** @type {Object} */ (listener).ol_key;
            if (key) {
                unByKey(key);
            }
            else if (Array.isArray(type)) {
                for (var i = 0, ii = type.length; i < ii; ++i) {
                    this.removeEventListener(type[i], listener);
                }
            }
            else {
                this.removeEventListener(type, listener);
            }
        };
        return Observable;
    }(Target$1));
    /**
     * Listen for a certain type of event.
     * @function
     * @param {string|Array<string>} type The event type or array of event types.
     * @param {function((Event|import("./events/Event").default)): ?} listener The listener function.
     * @return {import("./events.js").EventsKey|Array<import("./events.js").EventsKey>} Unique key for the listener. If
     *     called with an array of event types as the first argument, the return
     *     will be an array of keys.
     * @api
     */
    Observable.prototype.on;
    /**
     * Listen once for a certain type of event.
     * @function
     * @param {string|Array<string>} type The event type or array of event types.
     * @param {function((Event|import("./events/Event").default)): ?} listener The listener function.
     * @return {import("./events.js").EventsKey|Array<import("./events.js").EventsKey>} Unique key for the listener. If
     *     called with an array of event types as the first argument, the return
     *     will be an array of keys.
     * @api
     */
    Observable.prototype.once;
    /**
     * Unlisten for a certain type of event.
     * @function
     * @param {string|Array<string>} type The event type or array of event types.
     * @param {function((Event|import("./events/Event").default)): ?} listener The listener function.
     * @api
     */
    Observable.prototype.un;
    /**
     * Removes an event listener using the key returned by `on()` or `once()`.
     * @param {import("./events.js").EventsKey|Array<import("./events.js").EventsKey>} key The key returned by `on()`
     *     or `once()` (or an array of keys).
     * @api
     */
    function unByKey(key) {
        if (Array.isArray(key)) {
            for (var i = 0, ii = key.length; i < ii; ++i) {
                unlistenByKey(key[i]);
            }
        }
        else {
            unlistenByKey(/** @type {import("./events.js").EventsKey} */ (key));
        }
    }

    var __extends$v = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            if (typeof b !== "function" && b !== null)
                throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * @classdesc
     * Events emitted by {@link module:ol/Object~BaseObject} instances are instances of this type.
     */
    var ObjectEvent = /** @class */ (function (_super) {
        __extends$v(ObjectEvent, _super);
        /**
         * @param {string} type The event type.
         * @param {string} key The property name.
         * @param {*} oldValue The old value for `key`.
         */
        function ObjectEvent(type, key, oldValue) {
            var _this = _super.call(this, type) || this;
            /**
             * The name of the property whose value is changing.
             * @type {string}
             * @api
             */
            _this.key = key;
            /**
             * The old value. To get the new value use `e.target.get(e.key)` where
             * `e` is the event object.
             * @type {*}
             * @api
             */
            _this.oldValue = oldValue;
            return _this;
        }
        return ObjectEvent;
    }(Event));
    /***
     * @template Return
     * @typedef {import("./Observable").OnSignature<import("./Observable").EventTypes, import("./events/Event.js").default, Return> &
     *    import("./Observable").OnSignature<import("./ObjectEventType").Types, ObjectEvent, Return> &
     *    import("./Observable").CombinedOnSignature<import("./Observable").EventTypes|import("./ObjectEventType").Types, Return>} ObjectOnSignature
     */
    /**
     * @classdesc
     * Abstract base class; normally only used for creating subclasses and not
     * instantiated in apps.
     * Most non-trivial classes inherit from this.
     *
     * This extends {@link module:ol/Observable~Observable} with observable
     * properties, where each property is observable as well as the object as a
     * whole.
     *
     * Classes that inherit from this have pre-defined properties, to which you can
     * add your owns. The pre-defined properties are listed in this documentation as
     * 'Observable Properties', and have their own accessors; for example,
     * {@link module:ol/Map~Map} has a `target` property, accessed with
     * `getTarget()` and changed with `setTarget()`. Not all properties are however
     * settable. There are also general-purpose accessors `get()` and `set()`. For
     * example, `get('target')` is equivalent to `getTarget()`.
     *
     * The `set` accessors trigger a change event, and you can monitor this by
     * registering a listener. For example, {@link module:ol/View~View} has a
     * `center` property, so `view.on('change:center', function(evt) {...});` would
     * call the function whenever the value of the center property changes. Within
     * the function, `evt.target` would be the view, so `evt.target.getCenter()`
     * would return the new center.
     *
     * You can add your own observable properties with
     * `object.set('prop', 'value')`, and retrieve that with `object.get('prop')`.
     * You can listen for changes on that property value with
     * `object.on('change:prop', listener)`. You can get a list of all
     * properties with {@link module:ol/Object~BaseObject#getProperties}.
     *
     * Note that the observable properties are separate from standard JS properties.
     * You can, for example, give your map object a title with
     * `map.title='New title'` and with `map.set('title', 'Another title')`. The
     * first will be a `hasOwnProperty`; the second will appear in
     * `getProperties()`. Only the second is observable.
     *
     * Properties can be deleted by using the unset method. E.g.
     * object.unset('foo').
     *
     * @fires ObjectEvent
     * @api
     */
    var BaseObject = /** @class */ (function (_super) {
        __extends$v(BaseObject, _super);
        /**
         * @param {Object<string, *>} [opt_values] An object with key-value pairs.
         */
        function BaseObject(opt_values) {
            var _this = _super.call(this) || this;
            /***
             * @type {ObjectOnSignature<import("./events").EventsKey>}
             */
            _this.on;
            /***
             * @type {ObjectOnSignature<import("./events").EventsKey>}
             */
            _this.once;
            /***
             * @type {ObjectOnSignature<void>}
             */
            _this.un;
            // Call {@link module:ol/util.getUid} to ensure that the order of objects' ids is
            // the same as the order in which they were created.  This also helps to
            // ensure that object properties are always added in the same order, which
            // helps many JavaScript engines generate faster code.
            getUid(_this);
            /**
             * @private
             * @type {Object<string, *>}
             */
            _this.values_ = null;
            if (opt_values !== undefined) {
                _this.setProperties(opt_values);
            }
            return _this;
        }
        /**
         * Gets a value.
         * @param {string} key Key name.
         * @return {*} Value.
         * @api
         */
        BaseObject.prototype.get = function (key) {
            var value;
            if (this.values_ && this.values_.hasOwnProperty(key)) {
                value = this.values_[key];
            }
            return value;
        };
        /**
         * Get a list of object property names.
         * @return {Array<string>} List of property names.
         * @api
         */
        BaseObject.prototype.getKeys = function () {
            return (this.values_ && Object.keys(this.values_)) || [];
        };
        /**
         * Get an object of all property names and values.
         * @return {Object<string, *>} Object.
         * @api
         */
        BaseObject.prototype.getProperties = function () {
            return (this.values_ && assign({}, this.values_)) || {};
        };
        /**
         * @return {boolean} The object has properties.
         */
        BaseObject.prototype.hasProperties = function () {
            return !!this.values_;
        };
        /**
         * @param {string} key Key name.
         * @param {*} oldValue Old value.
         */
        BaseObject.prototype.notify = function (key, oldValue) {
            var eventType;
            eventType = "change:".concat(key);
            if (this.hasListener(eventType)) {
                this.dispatchEvent(new ObjectEvent(eventType, key, oldValue));
            }
            eventType = ObjectEventType.PROPERTYCHANGE;
            if (this.hasListener(eventType)) {
                this.dispatchEvent(new ObjectEvent(eventType, key, oldValue));
            }
        };
        /**
         * @param {string} key Key name.
         * @param {import("./events.js").Listener} listener Listener.
         */
        BaseObject.prototype.addChangeListener = function (key, listener) {
            this.addEventListener("change:".concat(key), listener);
        };
        /**
         * @param {string} key Key name.
         * @param {import("./events.js").Listener} listener Listener.
         */
        BaseObject.prototype.removeChangeListener = function (key, listener) {
            this.removeEventListener("change:".concat(key), listener);
        };
        /**
         * Sets a value.
         * @param {string} key Key name.
         * @param {*} value Value.
         * @param {boolean} [opt_silent] Update without triggering an event.
         * @api
         */
        BaseObject.prototype.set = function (key, value, opt_silent) {
            var values = this.values_ || (this.values_ = {});
            if (opt_silent) {
                values[key] = value;
            }
            else {
                var oldValue = values[key];
                values[key] = value;
                if (oldValue !== value) {
                    this.notify(key, oldValue);
                }
            }
        };
        /**
         * Sets a collection of key-value pairs.  Note that this changes any existing
         * properties and adds new ones (it does not remove any existing properties).
         * @param {Object<string, *>} values Values.
         * @param {boolean} [opt_silent] Update without triggering an event.
         * @api
         */
        BaseObject.prototype.setProperties = function (values, opt_silent) {
            for (var key in values) {
                this.set(key, values[key], opt_silent);
            }
        };
        /**
         * Apply any properties from another object without triggering events.
         * @param {BaseObject} source The source object.
         * @protected
         */
        BaseObject.prototype.applyProperties = function (source) {
            if (!source.values_) {
                return;
            }
            assign(this.values_ || (this.values_ = {}), source.values_);
        };
        /**
         * Unsets a property.
         * @param {string} key Key name.
         * @param {boolean} [opt_silent] Unset without triggering an event.
         * @api
         */
        BaseObject.prototype.unset = function (key, opt_silent) {
            if (this.values_ && key in this.values_) {
                var oldValue = this.values_[key];
                delete this.values_[key];
                if (isEmpty(this.values_)) {
                    this.values_ = null;
                }
                if (!opt_silent) {
                    this.notify(key, oldValue);
                }
            }
        };
        return BaseObject;
    }(Observable));
    var BaseObject$1 = BaseObject;

    /**
     * @module ol/CollectionEventType
     */
    /**
     * @enum {string}
     */
    var CollectionEventType = {
        /**
         * Triggered when an item is added to the collection.
         * @event module:ol/Collection.CollectionEvent#add
         * @api
         */
        ADD: 'add',
        /**
         * Triggered when an item is removed from the collection.
         * @event module:ol/Collection.CollectionEvent#remove
         * @api
         */
        REMOVE: 'remove',
    };

    var __extends$u = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            if (typeof b !== "function" && b !== null)
                throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * @enum {string}
     * @private
     */
    var Property$2 = {
        LENGTH: 'length',
    };
    /**
     * @classdesc
     * Events emitted by {@link module:ol/Collection~Collection} instances are instances of this
     * type.
     */
    var CollectionEvent = /** @class */ (function (_super) {
        __extends$u(CollectionEvent, _super);
        /**
         * @param {import("./CollectionEventType.js").default} type Type.
         * @param {*} [opt_element] Element.
         * @param {number} [opt_index] The index of the added or removed element.
         */
        function CollectionEvent(type, opt_element, opt_index) {
            var _this = _super.call(this, type) || this;
            /**
             * The element that is added to or removed from the collection.
             * @type {*}
             * @api
             */
            _this.element = opt_element;
            /**
             * The index of the added or removed element.
             * @type {number}
             * @api
             */
            _this.index = opt_index;
            return _this;
        }
        return CollectionEvent;
    }(Event));
    /***
     * @template Return
     * @typedef {import("./Observable").OnSignature<import("./Observable").EventTypes, import("./events/Event.js").default, Return> &
     *   import("./Observable").OnSignature<import("./ObjectEventType").Types|'change:length', import("./Object").ObjectEvent, Return> &
     *   import("./Observable").OnSignature<'add'|'remove', CollectionEvent, Return> &
     *   import("./Observable").CombinedOnSignature<import("./Observable").EventTypes|import("./ObjectEventType").Types|
     *     'change:length'|'add'|'remove',Return>} CollectionOnSignature
     */
    /**
     * @typedef {Object} Options
     * @property {boolean} [unique=false] Disallow the same item from being added to
     * the collection twice.
     */
    /**
     * @classdesc
     * An expanded version of standard JS Array, adding convenience methods for
     * manipulation. Add and remove changes to the Collection trigger a Collection
     * event. Note that this does not cover changes to the objects _within_ the
     * Collection; they trigger events on the appropriate object, not on the
     * Collection as a whole.
     *
     * @fires CollectionEvent
     *
     * @template T
     * @api
     */
    var Collection = /** @class */ (function (_super) {
        __extends$u(Collection, _super);
        /**
         * @param {Array<T>} [opt_array] Array.
         * @param {Options} [opt_options] Collection options.
         */
        function Collection(opt_array, opt_options) {
            var _this = _super.call(this) || this;
            /***
             * @type {CollectionOnSignature<import("./events").EventsKey>}
             */
            _this.on;
            /***
             * @type {CollectionOnSignature<import("./events").EventsKey>}
             */
            _this.once;
            /***
             * @type {CollectionOnSignature<void>}
             */
            _this.un;
            var options = opt_options || {};
            /**
             * @private
             * @type {boolean}
             */
            _this.unique_ = !!options.unique;
            /**
             * @private
             * @type {!Array<T>}
             */
            _this.array_ = opt_array ? opt_array : [];
            if (_this.unique_) {
                for (var i = 0, ii = _this.array_.length; i < ii; ++i) {
                    _this.assertUnique_(_this.array_[i], i);
                }
            }
            _this.updateLength_();
            return _this;
        }
        /**
         * Remove all elements from the collection.
         * @api
         */
        Collection.prototype.clear = function () {
            while (this.getLength() > 0) {
                this.pop();
            }
        };
        /**
         * Add elements to the collection.  This pushes each item in the provided array
         * to the end of the collection.
         * @param {!Array<T>} arr Array.
         * @return {Collection<T>} This collection.
         * @api
         */
        Collection.prototype.extend = function (arr) {
            for (var i = 0, ii = arr.length; i < ii; ++i) {
                this.push(arr[i]);
            }
            return this;
        };
        /**
         * Iterate over each element, calling the provided callback.
         * @param {function(T, number, Array<T>): *} f The function to call
         *     for every element. This function takes 3 arguments (the element, the
         *     index and the array). The return value is ignored.
         * @api
         */
        Collection.prototype.forEach = function (f) {
            var array = this.array_;
            for (var i = 0, ii = array.length; i < ii; ++i) {
                f(array[i], i, array);
            }
        };
        /**
         * Get a reference to the underlying Array object. Warning: if the array
         * is mutated, no events will be dispatched by the collection, and the
         * collection's "length" property won't be in sync with the actual length
         * of the array.
         * @return {!Array<T>} Array.
         * @api
         */
        Collection.prototype.getArray = function () {
            return this.array_;
        };
        /**
         * Get the element at the provided index.
         * @param {number} index Index.
         * @return {T} Element.
         * @api
         */
        Collection.prototype.item = function (index) {
            return this.array_[index];
        };
        /**
         * Get the length of this collection.
         * @return {number} The length of the array.
         * @observable
         * @api
         */
        Collection.prototype.getLength = function () {
            return this.get(Property$2.LENGTH);
        };
        /**
         * Insert an element at the provided index.
         * @param {number} index Index.
         * @param {T} elem Element.
         * @api
         */
        Collection.prototype.insertAt = function (index, elem) {
            if (this.unique_) {
                this.assertUnique_(elem);
            }
            this.array_.splice(index, 0, elem);
            this.updateLength_();
            this.dispatchEvent(new CollectionEvent(CollectionEventType.ADD, elem, index));
        };
        /**
         * Remove the last element of the collection and return it.
         * Return `undefined` if the collection is empty.
         * @return {T|undefined} Element.
         * @api
         */
        Collection.prototype.pop = function () {
            return this.removeAt(this.getLength() - 1);
        };
        /**
         * Insert the provided element at the end of the collection.
         * @param {T} elem Element.
         * @return {number} New length of the collection.
         * @api
         */
        Collection.prototype.push = function (elem) {
            if (this.unique_) {
                this.assertUnique_(elem);
            }
            var n = this.getLength();
            this.insertAt(n, elem);
            return this.getLength();
        };
        /**
         * Remove the first occurrence of an element from the collection.
         * @param {T} elem Element.
         * @return {T|undefined} The removed element or undefined if none found.
         * @api
         */
        Collection.prototype.remove = function (elem) {
            var arr = this.array_;
            for (var i = 0, ii = arr.length; i < ii; ++i) {
                if (arr[i] === elem) {
                    return this.removeAt(i);
                }
            }
            return undefined;
        };
        /**
         * Remove the element at the provided index and return it.
         * Return `undefined` if the collection does not contain this index.
         * @param {number} index Index.
         * @return {T|undefined} Value.
         * @api
         */
        Collection.prototype.removeAt = function (index) {
            var prev = this.array_[index];
            this.array_.splice(index, 1);
            this.updateLength_();
            this.dispatchEvent(new CollectionEvent(CollectionEventType.REMOVE, prev, index));
            return prev;
        };
        /**
         * Set the element at the provided index.
         * @param {number} index Index.
         * @param {T} elem Element.
         * @api
         */
        Collection.prototype.setAt = function (index, elem) {
            var n = this.getLength();
            if (index < n) {
                if (this.unique_) {
                    this.assertUnique_(elem, index);
                }
                var prev = this.array_[index];
                this.array_[index] = elem;
                this.dispatchEvent(new CollectionEvent(CollectionEventType.REMOVE, prev, index));
                this.dispatchEvent(new CollectionEvent(CollectionEventType.ADD, elem, index));
            }
            else {
                for (var j = n; j < index; ++j) {
                    this.insertAt(j, undefined);
                }
                this.insertAt(index, elem);
            }
        };
        /**
         * @private
         */
        Collection.prototype.updateLength_ = function () {
            this.set(Property$2.LENGTH, this.array_.length);
        };
        /**
         * @private
         * @param {T} elem Element.
         * @param {number} [opt_except] Optional index to ignore.
         */
        Collection.prototype.assertUnique_ = function (elem, opt_except) {
            for (var i = 0, ii = this.array_.length; i < ii; ++i) {
                if (this.array_[i] === elem && i !== opt_except) {
                    throw new AssertionError$1(58);
                }
            }
        };
        return Collection;
    }(BaseObject$1));
    var Collection$1 = Collection;

    /**
     * @module ol/asserts
     */
    /**
     * @param {*} assertion Assertion we expected to be truthy.
     * @param {number} errorCode Error code.
     */
    function assert(assertion, errorCode) {
        if (!assertion) {
            throw new AssertionError$1(errorCode);
        }
    }

    var __extends$t = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            if (typeof b !== "function" && b !== null)
                throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * @typedef {typeof Feature|typeof import("./render/Feature.js").default} FeatureClass
     */
    /**
     * @typedef {Feature|import("./render/Feature.js").default} FeatureLike
     */
    /***
     * @template Return
     * @typedef {import("./Observable").OnSignature<import("./Observable").EventTypes, import("./events/Event.js").default, Return> &
     *   import("./Observable").OnSignature<import("./ObjectEventType").Types|'change:geometry', import("./Object").ObjectEvent, Return> &
     *   import("./Observable").CombinedOnSignature<import("./Observable").EventTypes|import("./ObjectEventType").Types
     *     |'change:geometry', Return>} FeatureOnSignature
     */
    /***
     * @template Geometry
     * @typedef {Object<string, *> & { geometry?: Geometry }} ObjectWithGeometry
     */
    /**
     * @classdesc
     * A vector object for geographic features with a geometry and other
     * attribute properties, similar to the features in vector file formats like
     * GeoJSON.
     *
     * Features can be styled individually with `setStyle`; otherwise they use the
     * style of their vector layer.
     *
     * Note that attribute properties are set as {@link module:ol/Object~BaseObject} properties on
     * the feature object, so they are observable, and have get/set accessors.
     *
     * Typically, a feature has a single geometry property. You can set the
     * geometry using the `setGeometry` method and get it with `getGeometry`.
     * It is possible to store more than one geometry on a feature using attribute
     * properties. By default, the geometry used for rendering is identified by
     * the property name `geometry`. If you want to use another geometry property
     * for rendering, use the `setGeometryName` method to change the attribute
     * property associated with the geometry for the feature.  For example:
     *
     * ```js
     *
     * import Feature from 'ol/Feature';
     * import Polygon from 'ol/geom/Polygon';
     * import Point from 'ol/geom/Point';
     *
     * var feature = new Feature({
     *   geometry: new Polygon(polyCoords),
     *   labelPoint: new Point(labelCoords),
     *   name: 'My Polygon'
     * });
     *
     * // get the polygon geometry
     * var poly = feature.getGeometry();
     *
     * // Render the feature as a point using the coordinates from labelPoint
     * feature.setGeometryName('labelPoint');
     *
     * // get the point geometry
     * var point = feature.getGeometry();
     * ```
     *
     * @api
     * @template {import("./geom/Geometry.js").default} [Geometry=import("./geom/Geometry.js").default]
     */
    var Feature = /** @class */ (function (_super) {
        __extends$t(Feature, _super);
        /**
         * @param {Geometry|ObjectWithGeometry<Geometry>} [opt_geometryOrProperties]
         *     You may pass a Geometry object directly, or an object literal containing
         *     properties. If you pass an object literal, you may include a Geometry
         *     associated with a `geometry` key.
         */
        function Feature(opt_geometryOrProperties) {
            var _this = _super.call(this) || this;
            /***
             * @type {FeatureOnSignature<import("./events").EventsKey>}
             */
            _this.on;
            /***
             * @type {FeatureOnSignature<import("./events").EventsKey>}
             */
            _this.once;
            /***
             * @type {FeatureOnSignature<void>}
             */
            _this.un;
            /**
             * @private
             * @type {number|string|undefined}
             */
            _this.id_ = undefined;
            /**
             * @type {string}
             * @private
             */
            _this.geometryName_ = 'geometry';
            /**
             * User provided style.
             * @private
             * @type {import("./style/Style.js").StyleLike}
             */
            _this.style_ = null;
            /**
             * @private
             * @type {import("./style/Style.js").StyleFunction|undefined}
             */
            _this.styleFunction_ = undefined;
            /**
             * @private
             * @type {?import("./events.js").EventsKey}
             */
            _this.geometryChangeKey_ = null;
            _this.addChangeListener(_this.geometryName_, _this.handleGeometryChanged_);
            if (opt_geometryOrProperties) {
                if (typeof (
                /** @type {?} */ (opt_geometryOrProperties).getSimplifiedGeometry) === 'function') {
                    var geometry = /** @type {Geometry} */ (opt_geometryOrProperties);
                    _this.setGeometry(geometry);
                }
                else {
                    /** @type {Object<string, *>} */
                    var properties = opt_geometryOrProperties;
                    _this.setProperties(properties);
                }
            }
            return _this;
        }
        /**
         * Clone this feature. If the original feature has a geometry it
         * is also cloned. The feature id is not set in the clone.
         * @return {Feature<Geometry>} The clone.
         * @api
         */
        Feature.prototype.clone = function () {
            var clone = /** @type {Feature<Geometry>} */ (new Feature(this.hasProperties() ? this.getProperties() : null));
            clone.setGeometryName(this.getGeometryName());
            var geometry = this.getGeometry();
            if (geometry) {
                clone.setGeometry(/** @type {Geometry} */ (geometry.clone()));
            }
            var style = this.getStyle();
            if (style) {
                clone.setStyle(style);
            }
            return clone;
        };
        /**
         * Get the feature's default geometry.  A feature may have any number of named
         * geometries.  The "default" geometry (the one that is rendered by default) is
         * set when calling {@link module:ol/Feature~Feature#setGeometry}.
         * @return {Geometry|undefined} The default geometry for the feature.
         * @api
         * @observable
         */
        Feature.prototype.getGeometry = function () {
            return /** @type {Geometry|undefined} */ (this.get(this.geometryName_));
        };
        /**
         * Get the feature identifier.  This is a stable identifier for the feature and
         * is either set when reading data from a remote source or set explicitly by
         * calling {@link module:ol/Feature~Feature#setId}.
         * @return {number|string|undefined} Id.
         * @api
         */
        Feature.prototype.getId = function () {
            return this.id_;
        };
        /**
         * Get the name of the feature's default geometry.  By default, the default
         * geometry is named `geometry`.
         * @return {string} Get the property name associated with the default geometry
         *     for this feature.
         * @api
         */
        Feature.prototype.getGeometryName = function () {
            return this.geometryName_;
        };
        /**
         * Get the feature's style. Will return what was provided to the
         * {@link module:ol/Feature~Feature#setStyle} method.
         * @return {import("./style/Style.js").StyleLike|undefined} The feature style.
         * @api
         */
        Feature.prototype.getStyle = function () {
            return this.style_;
        };
        /**
         * Get the feature's style function.
         * @return {import("./style/Style.js").StyleFunction|undefined} Return a function
         * representing the current style of this feature.
         * @api
         */
        Feature.prototype.getStyleFunction = function () {
            return this.styleFunction_;
        };
        /**
         * @private
         */
        Feature.prototype.handleGeometryChange_ = function () {
            this.changed();
        };
        /**
         * @private
         */
        Feature.prototype.handleGeometryChanged_ = function () {
            if (this.geometryChangeKey_) {
                unlistenByKey(this.geometryChangeKey_);
                this.geometryChangeKey_ = null;
            }
            var geometry = this.getGeometry();
            if (geometry) {
                this.geometryChangeKey_ = listen(geometry, EventType.CHANGE, this.handleGeometryChange_, this);
            }
            this.changed();
        };
        /**
         * Set the default geometry for the feature.  This will update the property
         * with the name returned by {@link module:ol/Feature~Feature#getGeometryName}.
         * @param {Geometry|undefined} geometry The new geometry.
         * @api
         * @observable
         */
        Feature.prototype.setGeometry = function (geometry) {
            this.set(this.geometryName_, geometry);
        };
        /**
         * Set the style for the feature to override the layer style.  This can be a
         * single style object, an array of styles, or a function that takes a
         * resolution and returns an array of styles. To unset the feature style, call
         * `setStyle()` without arguments or a falsey value.
         * @param {import("./style/Style.js").StyleLike} [opt_style] Style for this feature.
         * @api
         * @fires module:ol/events/Event~BaseEvent#event:change
         */
        Feature.prototype.setStyle = function (opt_style) {
            this.style_ = opt_style;
            this.styleFunction_ = !opt_style
                ? undefined
                : createStyleFunction(opt_style);
            this.changed();
        };
        /**
         * Set the feature id.  The feature id is considered stable and may be used when
         * requesting features or comparing identifiers returned from a remote source.
         * The feature id can be used with the
         * {@link module:ol/source/Vector~VectorSource#getFeatureById} method.
         * @param {number|string|undefined} id The feature id.
         * @api
         * @fires module:ol/events/Event~BaseEvent#event:change
         */
        Feature.prototype.setId = function (id) {
            this.id_ = id;
            this.changed();
        };
        /**
         * Set the property name to be used when getting the feature's default geometry.
         * When calling {@link module:ol/Feature~Feature#getGeometry}, the value of the property with
         * this name will be returned.
         * @param {string} name The property name of the default geometry.
         * @api
         */
        Feature.prototype.setGeometryName = function (name) {
            this.removeChangeListener(this.geometryName_, this.handleGeometryChanged_);
            this.geometryName_ = name;
            this.addChangeListener(this.geometryName_, this.handleGeometryChanged_);
            this.handleGeometryChanged_();
        };
        return Feature;
    }(BaseObject$1));
    /**
     * Convert the provided object into a feature style function.  Functions passed
     * through unchanged.  Arrays of Style or single style objects wrapped
     * in a new feature style function.
     * @param {!import("./style/Style.js").StyleFunction|!Array<import("./style/Style.js").default>|!import("./style/Style.js").default} obj
     *     A feature style function, a single style, or an array of styles.
     * @return {import("./style/Style.js").StyleFunction} A style function.
     */
    function createStyleFunction(obj) {
        if (typeof obj === 'function') {
            return obj;
        }
        else {
            /**
             * @type {Array<import("./style/Style.js").default>}
             */
            var styles_1;
            if (Array.isArray(obj)) {
                styles_1 = obj;
            }
            else {
                assert(typeof ( /** @type {?} */(obj).getZIndex) === 'function', 41); // Expected an `import("./style/Style.js").Style` or an array of `import("./style/Style.js").Style`
                var style = /** @type {import("./style/Style.js").default} */ (obj);
                styles_1 = [style];
            }
            return function () {
                return styles_1;
            };
        }
    }
    var Feature$1 = Feature;

    /**
     * @module ol/geom/GeometryLayout
     */
    /**
     * The coordinate layout for geometries, indicating whether a 3rd or 4th z ('Z')
     * or measure ('M') coordinate is available. Supported values are `'XY'`,
     * `'XYZ'`, `'XYM'`, `'XYZM'`.
     * @enum {string}
     */
    var GeometryLayout = {
        XY: 'XY',
        XYZ: 'XYZ',
        XYM: 'XYM',
        XYZM: 'XYZM',
    };

    /**
     * @module ol/proj/Units
     */
    /**
     * Projection units: `'degrees'`, `'ft'`, `'m'`, `'pixels'`, `'tile-pixels'` or
     * `'us-ft'`.
     * @enum {string}
     */
    var Units = {
        /**
         * Radians
         * @api
         */
        RADIANS: 'radians',
        /**
         * Degrees
         * @api
         */
        DEGREES: 'degrees',
        /**
         * Feet
         * @api
         */
        FEET: 'ft',
        /**
         * Meters
         * @api
         */
        METERS: 'm',
        /**
         * Pixels
         * @api
         */
        PIXELS: 'pixels',
        /**
         * Tile Pixels
         * @api
         */
        TILE_PIXELS: 'tile-pixels',
        /**
         * US Feet
         * @api
         */
        USFEET: 'us-ft',
    };
    /**
     * Meters per unit lookup table.
     * @const
     * @type {Object<Units, number>}
     * @api
     */
    var METERS_PER_UNIT$1 = {};
    // use the radius of the Normal sphere
    METERS_PER_UNIT$1[Units.RADIANS] = 6370997 / (2 * Math.PI);
    METERS_PER_UNIT$1[Units.DEGREES] = (2 * Math.PI * 6370997) / 360;
    METERS_PER_UNIT$1[Units.FEET] = 0.3048;
    METERS_PER_UNIT$1[Units.METERS] = 1;
    METERS_PER_UNIT$1[Units.USFEET] = 1200 / 3937;
    var ProjUnits = Units;

    /**
     * @module ol/has
     */
    var ua = typeof navigator !== 'undefined' && typeof navigator.userAgent !== 'undefined'
        ? navigator.userAgent.toLowerCase()
        : '';
    /**
     * User agent string says we are dealing with Firefox as browser.
     * @type {boolean}
     */
    ua.indexOf('firefox') !== -1;
    /**
     * User agent string says we are dealing with Safari as browser.
     * @type {boolean}
     */
    var SAFARI = ua.indexOf('safari') !== -1 && ua.indexOf('chrom') == -1;
    /**
     * https://bugs.webkit.org/show_bug.cgi?id=237906
     * @type {boolean}
     */
    SAFARI &&
        !!(ua.indexOf('version/15.4') >= 0 ||
            ua.match(/cpu (os|iphone os) 15_4 like mac os x/));
    /**
     * User agent string says we are dealing with a WebKit engine.
     * @type {boolean}
     */
    ua.indexOf('webkit') !== -1 && ua.indexOf('edge') == -1;
    /**
     * User agent string says we are dealing with a Mac as platform.
     * @type {boolean}
     */
    ua.indexOf('macintosh') !== -1;
    /**
     * The execution context is a worker with OffscreenCanvas available.
     * @const
     * @type {boolean}
     */
    var WORKER_OFFSCREEN_CANVAS = typeof WorkerGlobalScope !== 'undefined' &&
        typeof OffscreenCanvas !== 'undefined' &&
        self instanceof WorkerGlobalScope; //eslint-disable-line
    /**
     * Image.prototype.decode() is supported.
     * @type {boolean}
     */
    var IMAGE_DECODE = typeof Image !== 'undefined' && Image.prototype.decode;
    /**
     * @type {boolean}
     */
    ((function () {
        var passive = false;
        try {
            var options = Object.defineProperty({}, 'passive', {
                get: function () {
                    passive = true;
                },
            });
            window.addEventListener('_', null, options);
            window.removeEventListener('_', null, options);
        }
        catch (error) {
            // passive not supported
        }
        return passive;
    }))();

    /**
     * @module ol/transform
     */
    /**
     * An array representing an affine 2d transformation for use with
     * {@link module:ol/transform} functions. The array has 6 elements.
     * @typedef {!Array<number>} Transform
     * @api
     */
    /**
     * Collection of affine 2d transformation functions. The functions work on an
     * array of 6 elements. The element order is compatible with the [SVGMatrix
     * interface](https://developer.mozilla.org/en-US/docs/Web/API/SVGMatrix) and is
     * a subset (elements a to f) of a 3×3 matrix:
     * ```
     * [ a c e ]
     * [ b d f ]
     * [ 0 0 1 ]
     * ```
     */
    /**
     * @private
     * @type {Transform}
     */
    new Array(6);
    /**
     * Create an identity transform.
     * @return {!Transform} Identity transform.
     */
    function create() {
        return [1, 0, 0, 1, 0, 0];
    }
    /**
     * Set the transform components a-f on a given transform.
     * @param {!Transform} transform Transform.
     * @param {number} a The a component of the transform.
     * @param {number} b The b component of the transform.
     * @param {number} c The c component of the transform.
     * @param {number} d The d component of the transform.
     * @param {number} e The e component of the transform.
     * @param {number} f The f component of the transform.
     * @return {!Transform} Matrix with transform applied.
     */
    function set(transform, a, b, c, d, e, f) {
        transform[0] = a;
        transform[1] = b;
        transform[2] = c;
        transform[3] = d;
        transform[4] = e;
        transform[5] = f;
        return transform;
    }
    /**
     * Set transform on one matrix from another matrix.
     * @param {!Transform} transform1 Matrix to set transform to.
     * @param {!Transform} transform2 Matrix to set transform from.
     * @return {!Transform} transform1 with transform from transform2 applied.
     */
    function setFromArray(transform1, transform2) {
        transform1[0] = transform2[0];
        transform1[1] = transform2[1];
        transform1[2] = transform2[2];
        transform1[3] = transform2[3];
        transform1[4] = transform2[4];
        transform1[5] = transform2[5];
        return transform1;
    }
    /**
     * Transforms the given coordinate with the given transform returning the
     * resulting, transformed coordinate. The coordinate will be modified in-place.
     *
     * @param {Transform} transform The transformation.
     * @param {import("./coordinate.js").Coordinate|import("./pixel.js").Pixel} coordinate The coordinate to transform.
     * @return {import("./coordinate.js").Coordinate|import("./pixel.js").Pixel} return coordinate so that operations can be
     *     chained together.
     */
    function apply(transform, coordinate) {
        var x = coordinate[0];
        var y = coordinate[1];
        coordinate[0] = transform[0] * x + transform[2] * y + transform[4];
        coordinate[1] = transform[1] * x + transform[3] * y + transform[5];
        return coordinate;
    }
    /**
     * Creates a scale transform.
     * @param {!Transform} target Transform to overwrite.
     * @param {number} x Scale factor x.
     * @param {number} y Scale factor y.
     * @return {!Transform} The scale transform.
     */
    function makeScale(target, x, y) {
        return set(target, x, 0, 0, y, 0, 0);
    }
    /**
     * Creates a composite transform given an initial translation, scale, rotation, and
     * final translation (in that order only, not commutative).
     * @param {!Transform} transform The transform (will be modified in place).
     * @param {number} dx1 Initial translation x.
     * @param {number} dy1 Initial translation y.
     * @param {number} sx Scale factor x.
     * @param {number} sy Scale factor y.
     * @param {number} angle Rotation (in counter-clockwise radians).
     * @param {number} dx2 Final translation x.
     * @param {number} dy2 Final translation y.
     * @return {!Transform} The composite transform.
     */
    function compose(transform, dx1, dy1, sx, sy, angle, dx2, dy2) {
        var sin = Math.sin(angle);
        var cos = Math.cos(angle);
        transform[0] = sx * cos;
        transform[1] = sy * sin;
        transform[2] = -sx * sin;
        transform[3] = sy * cos;
        transform[4] = dx2 * sx * cos - dy2 * sx * sin + dx1;
        transform[5] = dx2 * sy * sin + dy2 * sy * cos + dy1;
        return transform;
    }
    /**
     * Invert the given transform.
     * @param {!Transform} target Transform to be set as the inverse of
     *     the source transform.
     * @param {!Transform} source The source transform to invert.
     * @return {!Transform} The inverted (target) transform.
     */
    function makeInverse(target, source) {
        var det = determinant(source);
        assert(det !== 0, 32); // Transformation matrix cannot be inverted
        var a = source[0];
        var b = source[1];
        var c = source[2];
        var d = source[3];
        var e = source[4];
        var f = source[5];
        target[0] = d / det;
        target[1] = -b / det;
        target[2] = -c / det;
        target[3] = a / det;
        target[4] = (c * f - d * e) / det;
        target[5] = -(a * f - b * e) / det;
        return target;
    }
    /**
     * Returns the determinant of the given matrix.
     * @param {!Transform} mat Matrix.
     * @return {number} Determinant.
     */
    function determinant(mat) {
        return mat[0] * mat[3] - mat[1] * mat[2];
    }
    /**
     * @type {HTMLElement}
     * @private
     */
    var transformStringDiv;
    /**
     * A rounded string version of the transform.  This can be used
     * for CSS transforms.
     * @param {!Transform} mat Matrix.
     * @return {string} The transform as a string.
     */
    function toString$1(mat) {
        var transformString = 'matrix(' + mat.join(', ') + ')';
        if (WORKER_OFFSCREEN_CANVAS) {
            return transformString;
        }
        var node = transformStringDiv || (transformStringDiv = document.createElement('div'));
        node.style.transform = transformString;
        return node.style.transform;
    }

    /**
     * @module ol/extent/Relationship
     */
    /**
     * Relationship to an extent.
     * @enum {number}
     */
    var Relationship = {
        UNKNOWN: 0,
        INTERSECTING: 1,
        ABOVE: 2,
        RIGHT: 4,
        BELOW: 8,
        LEFT: 16,
    };

    /**
     * @module ol/extent
     */
    /**
     * Return extent increased by the provided value.
     * @param {Extent} extent Extent.
     * @param {number} value The amount by which the extent should be buffered.
     * @param {Extent} [opt_extent] Extent.
     * @return {Extent} Extent.
     * @api
     */
    function buffer(extent, value, opt_extent) {
        if (opt_extent) {
            opt_extent[0] = extent[0] - value;
            opt_extent[1] = extent[1] - value;
            opt_extent[2] = extent[2] + value;
            opt_extent[3] = extent[3] + value;
            return opt_extent;
        }
        else {
            return [
                extent[0] - value,
                extent[1] - value,
                extent[2] + value,
                extent[3] + value,
            ];
        }
    }
    /**
     * Creates a clone of an extent.
     *
     * @param {Extent} extent Extent to clone.
     * @param {Extent} [opt_extent] Extent.
     * @return {Extent} The clone.
     */
    function clone(extent, opt_extent) {
        if (opt_extent) {
            opt_extent[0] = extent[0];
            opt_extent[1] = extent[1];
            opt_extent[2] = extent[2];
            opt_extent[3] = extent[3];
            return opt_extent;
        }
        else {
            return extent.slice();
        }
    }
    /**
     * @param {Extent} extent Extent.
     * @param {number} x X.
     * @param {number} y Y.
     * @return {number} Closest squared distance.
     */
    function closestSquaredDistanceXY(extent, x, y) {
        var dx, dy;
        if (x < extent[0]) {
            dx = extent[0] - x;
        }
        else if (extent[2] < x) {
            dx = x - extent[2];
        }
        else {
            dx = 0;
        }
        if (y < extent[1]) {
            dy = extent[1] - y;
        }
        else if (extent[3] < y) {
            dy = y - extent[3];
        }
        else {
            dy = 0;
        }
        return dx * dx + dy * dy;
    }
    /**
     * Check if the passed coordinate is contained or on the edge of the extent.
     *
     * @param {Extent} extent Extent.
     * @param {import("./coordinate.js").Coordinate} coordinate Coordinate.
     * @return {boolean} The coordinate is contained in the extent.
     * @api
     */
    function containsCoordinate(extent, coordinate) {
        return containsXY(extent, coordinate[0], coordinate[1]);
    }
    /**
     * Check if one extent contains another.
     *
     * An extent is deemed contained if it lies completely within the other extent,
     * including if they share one or more edges.
     *
     * @param {Extent} extent1 Extent 1.
     * @param {Extent} extent2 Extent 2.
     * @return {boolean} The second extent is contained by or on the edge of the
     *     first.
     * @api
     */
    function containsExtent(extent1, extent2) {
        return (extent1[0] <= extent2[0] &&
            extent2[2] <= extent1[2] &&
            extent1[1] <= extent2[1] &&
            extent2[3] <= extent1[3]);
    }
    /**
     * Check if the passed coordinate is contained or on the edge of the extent.
     *
     * @param {Extent} extent Extent.
     * @param {number} x X coordinate.
     * @param {number} y Y coordinate.
     * @return {boolean} The x, y values are contained in the extent.
     * @api
     */
    function containsXY(extent, x, y) {
        return extent[0] <= x && x <= extent[2] && extent[1] <= y && y <= extent[3];
    }
    /**
     * Get the relationship between a coordinate and extent.
     * @param {Extent} extent The extent.
     * @param {import("./coordinate.js").Coordinate} coordinate The coordinate.
     * @return {import("./extent/Relationship.js").default} The relationship (bitwise compare with
     *     import("./extent/Relationship.js").Relationship).
     */
    function coordinateRelationship(extent, coordinate) {
        var minX = extent[0];
        var minY = extent[1];
        var maxX = extent[2];
        var maxY = extent[3];
        var x = coordinate[0];
        var y = coordinate[1];
        var relationship = Relationship.UNKNOWN;
        if (x < minX) {
            relationship = relationship | Relationship.LEFT;
        }
        else if (x > maxX) {
            relationship = relationship | Relationship.RIGHT;
        }
        if (y < minY) {
            relationship = relationship | Relationship.BELOW;
        }
        else if (y > maxY) {
            relationship = relationship | Relationship.ABOVE;
        }
        if (relationship === Relationship.UNKNOWN) {
            relationship = Relationship.INTERSECTING;
        }
        return relationship;
    }
    /**
     * Create an empty extent.
     * @return {Extent} Empty extent.
     * @api
     */
    function createEmpty() {
        return [Infinity, Infinity, -Infinity, -Infinity];
    }
    /**
     * Create a new extent or update the provided extent.
     * @param {number} minX Minimum X.
     * @param {number} minY Minimum Y.
     * @param {number} maxX Maximum X.
     * @param {number} maxY Maximum Y.
     * @param {Extent} [opt_extent] Destination extent.
     * @return {Extent} Extent.
     */
    function createOrUpdate(minX, minY, maxX, maxY, opt_extent) {
        if (opt_extent) {
            opt_extent[0] = minX;
            opt_extent[1] = minY;
            opt_extent[2] = maxX;
            opt_extent[3] = maxY;
            return opt_extent;
        }
        else {
            return [minX, minY, maxX, maxY];
        }
    }
    /**
     * Create a new empty extent or make the provided one empty.
     * @param {Extent} [opt_extent] Extent.
     * @return {Extent} Extent.
     */
    function createOrUpdateEmpty(opt_extent) {
        return createOrUpdate(Infinity, Infinity, -Infinity, -Infinity, opt_extent);
    }
    /**
     * @param {Array<number>} flatCoordinates Flat coordinates.
     * @param {number} offset Offset.
     * @param {number} end End.
     * @param {number} stride Stride.
     * @param {Extent} [opt_extent] Extent.
     * @return {Extent} Extent.
     */
    function createOrUpdateFromFlatCoordinates(flatCoordinates, offset, end, stride, opt_extent) {
        var extent = createOrUpdateEmpty(opt_extent);
        return extendFlatCoordinates(extent, flatCoordinates, offset, end, stride);
    }
    /**
     * Determine if two extents are equivalent.
     * @param {Extent} extent1 Extent 1.
     * @param {Extent} extent2 Extent 2.
     * @return {boolean} The two extents are equivalent.
     * @api
     */
    function equals(extent1, extent2) {
        return (extent1[0] == extent2[0] &&
            extent1[2] == extent2[2] &&
            extent1[1] == extent2[1] &&
            extent1[3] == extent2[3]);
    }
    /**
     * @param {Extent} extent Extent.
     * @param {import("./coordinate.js").Coordinate} coordinate Coordinate.
     */
    function extendCoordinate(extent, coordinate) {
        if (coordinate[0] < extent[0]) {
            extent[0] = coordinate[0];
        }
        if (coordinate[0] > extent[2]) {
            extent[2] = coordinate[0];
        }
        if (coordinate[1] < extent[1]) {
            extent[1] = coordinate[1];
        }
        if (coordinate[1] > extent[3]) {
            extent[3] = coordinate[1];
        }
    }
    /**
     * @param {Extent} extent Extent.
     * @param {Array<number>} flatCoordinates Flat coordinates.
     * @param {number} offset Offset.
     * @param {number} end End.
     * @param {number} stride Stride.
     * @return {Extent} Extent.
     */
    function extendFlatCoordinates(extent, flatCoordinates, offset, end, stride) {
        for (; offset < end; offset += stride) {
            extendXY(extent, flatCoordinates[offset], flatCoordinates[offset + 1]);
        }
        return extent;
    }
    /**
     * @param {Extent} extent Extent.
     * @param {number} x X.
     * @param {number} y Y.
     */
    function extendXY(extent, x, y) {
        extent[0] = Math.min(extent[0], x);
        extent[1] = Math.min(extent[1], y);
        extent[2] = Math.max(extent[2], x);
        extent[3] = Math.max(extent[3], y);
    }
    /**
     * Get the bottom left coordinate of an extent.
     * @param {Extent} extent Extent.
     * @return {import("./coordinate.js").Coordinate} Bottom left coordinate.
     * @api
     */
    function getBottomLeft(extent) {
        return [extent[0], extent[1]];
    }
    /**
     * Get the bottom right coordinate of an extent.
     * @param {Extent} extent Extent.
     * @return {import("./coordinate.js").Coordinate} Bottom right coordinate.
     * @api
     */
    function getBottomRight(extent) {
        return [extent[2], extent[1]];
    }
    /**
     * Get the center coordinate of an extent.
     * @param {Extent} extent Extent.
     * @return {import("./coordinate.js").Coordinate} Center.
     * @api
     */
    function getCenter(extent) {
        return [(extent[0] + extent[2]) / 2, (extent[1] + extent[3]) / 2];
    }
    /**
     * Get the height of an extent.
     * @param {Extent} extent Extent.
     * @return {number} Height.
     * @api
     */
    function getHeight(extent) {
        return extent[3] - extent[1];
    }
    /**
     * Get the top left coordinate of an extent.
     * @param {Extent} extent Extent.
     * @return {import("./coordinate.js").Coordinate} Top left coordinate.
     * @api
     */
    function getTopLeft(extent) {
        return [extent[0], extent[3]];
    }
    /**
     * Get the top right coordinate of an extent.
     * @param {Extent} extent Extent.
     * @return {import("./coordinate.js").Coordinate} Top right coordinate.
     * @api
     */
    function getTopRight(extent) {
        return [extent[2], extent[3]];
    }
    /**
     * Get the width of an extent.
     * @param {Extent} extent Extent.
     * @return {number} Width.
     * @api
     */
    function getWidth(extent) {
        return extent[2] - extent[0];
    }
    /**
     * Determine if one extent intersects another.
     * @param {Extent} extent1 Extent 1.
     * @param {Extent} extent2 Extent.
     * @return {boolean} The two extents intersect.
     * @api
     */
    function intersects$1(extent1, extent2) {
        return (extent1[0] <= extent2[2] &&
            extent1[2] >= extent2[0] &&
            extent1[1] <= extent2[3] &&
            extent1[3] >= extent2[1]);
    }
    /**
     * @param {Extent} extent Extent.
     * @param {Extent} [opt_extent] Extent.
     * @return {Extent} Extent.
     */
    function returnOrUpdate(extent, opt_extent) {
        if (opt_extent) {
            opt_extent[0] = extent[0];
            opt_extent[1] = extent[1];
            opt_extent[2] = extent[2];
            opt_extent[3] = extent[3];
            return opt_extent;
        }
        else {
            return extent;
        }
    }
    /**
     * Determine if the segment between two coordinates intersects (crosses,
     * touches, or is contained by) the provided extent.
     * @param {Extent} extent The extent.
     * @param {import("./coordinate.js").Coordinate} start Segment start coordinate.
     * @param {import("./coordinate.js").Coordinate} end Segment end coordinate.
     * @return {boolean} The segment intersects the extent.
     */
    function intersectsSegment(extent, start, end) {
        var intersects = false;
        var startRel = coordinateRelationship(extent, start);
        var endRel = coordinateRelationship(extent, end);
        if (startRel === Relationship.INTERSECTING ||
            endRel === Relationship.INTERSECTING) {
            intersects = true;
        }
        else {
            var minX = extent[0];
            var minY = extent[1];
            var maxX = extent[2];
            var maxY = extent[3];
            var startX = start[0];
            var startY = start[1];
            var endX = end[0];
            var endY = end[1];
            var slope = (endY - startY) / (endX - startX);
            var x = void 0, y = void 0;
            if (!!(endRel & Relationship.ABOVE) && !(startRel & Relationship.ABOVE)) {
                // potentially intersects top
                x = endX - (endY - maxY) / slope;
                intersects = x >= minX && x <= maxX;
            }
            if (!intersects &&
                !!(endRel & Relationship.RIGHT) &&
                !(startRel & Relationship.RIGHT)) {
                // potentially intersects right
                y = endY - (endX - maxX) * slope;
                intersects = y >= minY && y <= maxY;
            }
            if (!intersects &&
                !!(endRel & Relationship.BELOW) &&
                !(startRel & Relationship.BELOW)) {
                // potentially intersects bottom
                x = endX - (endY - minY) / slope;
                intersects = x >= minX && x <= maxX;
            }
            if (!intersects &&
                !!(endRel & Relationship.LEFT) &&
                !(startRel & Relationship.LEFT)) {
                // potentially intersects left
                y = endY - (endX - minX) * slope;
                intersects = y >= minY && y <= maxY;
            }
        }
        return intersects;
    }
    /**
     * Modifies the provided extent in-place to be within the real world
     * extent.
     *
     * @param {Extent} extent Extent.
     * @param {import("./proj/Projection.js").default} projection Projection
     * @return {Extent} The extent within the real world extent.
     */
    function wrapX$1(extent, projection) {
        var projectionExtent = projection.getExtent();
        var center = getCenter(extent);
        if (projection.canWrapX() &&
            (center[0] < projectionExtent[0] || center[0] >= projectionExtent[2])) {
            var worldWidth = getWidth(projectionExtent);
            var worldsAway = Math.floor((center[0] - projectionExtent[0]) / worldWidth);
            var offset = worldsAway * worldWidth;
            extent[0] -= offset;
            extent[2] -= offset;
        }
        return extent;
    }
    /**
     * Fits the extent to the real world
     *
     * If the extent does not cross the anti meridian, this will return the extent in an array
     * If the extent crosses the anti meridian, the extent will be sliced, so each part fits within the
     * real world
     *
     *
     * @param {Extent} extent Extent.
     * @param {import("./proj/Projection.js").default} projection Projection
     * @return {Array<Extent>} The extent within the real world extent.
     */
    function wrapAndSliceX(extent, projection) {
        if (projection.canWrapX()) {
            var projectionExtent = projection.getExtent();
            if (!isFinite(extent[0]) || !isFinite(extent[2])) {
                return [[projectionExtent[0], extent[1], projectionExtent[2], extent[3]]];
            }
            wrapX$1(extent, projection);
            var worldWidth = getWidth(projectionExtent);
            if (getWidth(extent) > worldWidth) {
                // the extent wraps around on itself
                return [[projectionExtent[0], extent[1], projectionExtent[2], extent[3]]];
            }
            else if (extent[0] < projectionExtent[0]) {
                // the extent crosses the anti meridian, so it needs to be sliced
                return [
                    [extent[0] + worldWidth, extent[1], projectionExtent[2], extent[3]],
                    [projectionExtent[0], extent[1], extent[2], extent[3]],
                ];
            }
            else if (extent[2] > projectionExtent[2]) {
                // the extent crosses the anti meridian, so it needs to be sliced
                return [
                    [extent[0], extent[1], projectionExtent[2], extent[3]],
                    [projectionExtent[0], extent[1], extent[2] - worldWidth, extent[3]],
                ];
            }
        }
        return [extent];
    }

    /**
     * @module ol/proj/Projection
     */
    /**
     * @typedef {Object} Options
     * @property {string} code The SRS identifier code, e.g. `EPSG:4326`.
     * @property {import("./Units.js").default|string} [units] Units. Required unless a
     * proj4 projection is defined for `code`.
     * @property {import("../extent.js").Extent} [extent] The validity extent for the SRS.
     * @property {string} [axisOrientation='enu'] The axis orientation as specified in Proj4.
     * @property {boolean} [global=false] Whether the projection is valid for the whole globe.
     * @property {number} [metersPerUnit] The meters per unit for the SRS.
     * If not provided, the `units` are used to get the meters per unit from the {@link module:ol/proj/Units~METERS_PER_UNIT}
     * lookup table.
     * @property {import("../extent.js").Extent} [worldExtent] The world extent for the SRS.
     * @property {function(number, import("../coordinate.js").Coordinate):number} [getPointResolution]
     * Function to determine resolution at a point. The function is called with a
     * `number` view resolution and a {@link module:ol/coordinate~Coordinate Coordinate} as arguments, and returns
     * the `number` resolution in projection units at the passed coordinate. If this is `undefined`,
     * the default {@link module:ol/proj.getPointResolution getPointResolution()} function will be used.
     */
    /**
     * @classdesc
     * Projection definition class. One of these is created for each projection
     * supported in the application and stored in the {@link module:ol/proj} namespace.
     * You can use these in applications, but this is not required, as API params
     * and options use {@link module:ol/proj~ProjectionLike} which means the simple string
     * code will suffice.
     *
     * You can use {@link module:ol/proj.get} to retrieve the object for a particular
     * projection.
     *
     * The library includes definitions for `EPSG:4326` and `EPSG:3857`, together
     * with the following aliases:
     * * `EPSG:4326`: CRS:84, urn:ogc:def:crs:EPSG:6.6:4326,
     *     urn:ogc:def:crs:OGC:1.3:CRS84, urn:ogc:def:crs:OGC:2:84,
     *     http://www.opengis.net/gml/srs/epsg.xml#4326,
     *     urn:x-ogc:def:crs:EPSG:4326
     * * `EPSG:3857`: EPSG:102100, EPSG:102113, EPSG:900913,
     *     urn:ogc:def:crs:EPSG:6.18:3:3857,
     *     http://www.opengis.net/gml/srs/epsg.xml#3857
     *
     * If you use [proj4js](https://github.com/proj4js/proj4js), aliases can
     * be added using `proj4.defs()`. After all required projection definitions are
     * added, call the {@link module:ol/proj/proj4.register} function.
     *
     * @api
     */
    var Projection = /** @class */ (function () {
        /**
         * @param {Options} options Projection options.
         */
        function Projection(options) {
            /**
             * @private
             * @type {string}
             */
            this.code_ = options.code;
            /**
             * Units of projected coordinates. When set to `TILE_PIXELS`, a
             * `this.extent_` and `this.worldExtent_` must be configured properly for each
             * tile.
             * @private
             * @type {import("./Units.js").default}
             */
            this.units_ = /** @type {import("./Units.js").default} */ (options.units);
            /**
             * Validity extent of the projection in projected coordinates. For projections
             * with `TILE_PIXELS` units, this is the extent of the tile in
             * tile pixel space.
             * @private
             * @type {import("../extent.js").Extent}
             */
            this.extent_ = options.extent !== undefined ? options.extent : null;
            /**
             * Extent of the world in EPSG:4326. For projections with
             * `TILE_PIXELS` units, this is the extent of the tile in
             * projected coordinate space.
             * @private
             * @type {import("../extent.js").Extent}
             */
            this.worldExtent_ =
                options.worldExtent !== undefined ? options.worldExtent : null;
            /**
             * @private
             * @type {string}
             */
            this.axisOrientation_ =
                options.axisOrientation !== undefined ? options.axisOrientation : 'enu';
            /**
             * @private
             * @type {boolean}
             */
            this.global_ = options.global !== undefined ? options.global : false;
            /**
             * @private
             * @type {boolean}
             */
            this.canWrapX_ = !!(this.global_ && this.extent_);
            /**
             * @private
             * @type {function(number, import("../coordinate.js").Coordinate):number|undefined}
             */
            this.getPointResolutionFunc_ = options.getPointResolution;
            /**
             * @private
             * @type {import("../tilegrid/TileGrid.js").default}
             */
            this.defaultTileGrid_ = null;
            /**
             * @private
             * @type {number|undefined}
             */
            this.metersPerUnit_ = options.metersPerUnit;
        }
        /**
         * @return {boolean} The projection is suitable for wrapping the x-axis
         */
        Projection.prototype.canWrapX = function () {
            return this.canWrapX_;
        };
        /**
         * Get the code for this projection, e.g. 'EPSG:4326'.
         * @return {string} Code.
         * @api
         */
        Projection.prototype.getCode = function () {
            return this.code_;
        };
        /**
         * Get the validity extent for this projection.
         * @return {import("../extent.js").Extent} Extent.
         * @api
         */
        Projection.prototype.getExtent = function () {
            return this.extent_;
        };
        /**
         * Get the units of this projection.
         * @return {import("./Units.js").default} Units.
         * @api
         */
        Projection.prototype.getUnits = function () {
            return this.units_;
        };
        /**
         * Get the amount of meters per unit of this projection.  If the projection is
         * not configured with `metersPerUnit` or a units identifier, the return is
         * `undefined`.
         * @return {number|undefined} Meters.
         * @api
         */
        Projection.prototype.getMetersPerUnit = function () {
            return this.metersPerUnit_ || METERS_PER_UNIT$1[this.units_];
        };
        /**
         * Get the world extent for this projection.
         * @return {import("../extent.js").Extent} Extent.
         * @api
         */
        Projection.prototype.getWorldExtent = function () {
            return this.worldExtent_;
        };
        /**
         * Get the axis orientation of this projection.
         * Example values are:
         * enu - the default easting, northing, elevation.
         * neu - northing, easting, up - useful for "lat/long" geographic coordinates,
         *     or south orientated transverse mercator.
         * wnu - westing, northing, up - some planetary coordinate systems have
         *     "west positive" coordinate systems
         * @return {string} Axis orientation.
         * @api
         */
        Projection.prototype.getAxisOrientation = function () {
            return this.axisOrientation_;
        };
        /**
         * Is this projection a global projection which spans the whole world?
         * @return {boolean} Whether the projection is global.
         * @api
         */
        Projection.prototype.isGlobal = function () {
            return this.global_;
        };
        /**
         * Set if the projection is a global projection which spans the whole world
         * @param {boolean} global Whether the projection is global.
         * @api
         */
        Projection.prototype.setGlobal = function (global) {
            this.global_ = global;
            this.canWrapX_ = !!(global && this.extent_);
        };
        /**
         * @return {import("../tilegrid/TileGrid.js").default} The default tile grid.
         */
        Projection.prototype.getDefaultTileGrid = function () {
            return this.defaultTileGrid_;
        };
        /**
         * @param {import("../tilegrid/TileGrid.js").default} tileGrid The default tile grid.
         */
        Projection.prototype.setDefaultTileGrid = function (tileGrid) {
            this.defaultTileGrid_ = tileGrid;
        };
        /**
         * Set the validity extent for this projection.
         * @param {import("../extent.js").Extent} extent Extent.
         * @api
         */
        Projection.prototype.setExtent = function (extent) {
            this.extent_ = extent;
            this.canWrapX_ = !!(this.global_ && extent);
        };
        /**
         * Set the world extent for this projection.
         * @param {import("../extent.js").Extent} worldExtent World extent
         *     [minlon, minlat, maxlon, maxlat].
         * @api
         */
        Projection.prototype.setWorldExtent = function (worldExtent) {
            this.worldExtent_ = worldExtent;
        };
        /**
         * Set the getPointResolution function (see {@link module:ol/proj.getPointResolution}
         * for this projection.
         * @param {function(number, import("../coordinate.js").Coordinate):number} func Function
         * @api
         */
        Projection.prototype.setGetPointResolution = function (func) {
            this.getPointResolutionFunc_ = func;
        };
        /**
         * Get the custom point resolution function for this projection (if set).
         * @return {function(number, import("../coordinate.js").Coordinate):number|undefined} The custom point
         * resolution function (if set).
         */
        Projection.prototype.getPointResolutionFunc = function () {
            return this.getPointResolutionFunc_;
        };
        return Projection;
    }());
    var Projection$1 = Projection;

    /**
     * @module ol/math
     */
    /**
     * Takes a number and clamps it to within the provided bounds.
     * @param {number} value The input number.
     * @param {number} min The minimum value to return.
     * @param {number} max The maximum value to return.
     * @return {number} The input number if it is within bounds, or the nearest
     *     number within the bounds.
     */
    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }
    /**
     * Return the hyperbolic cosine of a given number. The method will use the
     * native `Math.cosh` function if it is available, otherwise the hyperbolic
     * cosine will be calculated via the reference implementation of the Mozilla
     * developer network.
     *
     * @param {number} x X.
     * @return {number} Hyperbolic cosine of x.
     */
    var cosh = (function () {
        // Wrapped in a iife, to save the overhead of checking for the native
        // implementation on every invocation.
        var cosh;
        if ('cosh' in Math) {
            // The environment supports the native Math.cosh function, use it…
            cosh = Math.cosh;
        }
        else {
            // … else, use the reference implementation of MDN:
            cosh = function (x) {
                var y = /** @type {Math} */ (Math).exp(x);
                return (y + 1 / y) / 2;
            };
        }
        return cosh;
    })();
    /**
     * Returns the square of the closest distance between the point (x, y) and the
     * line segment (x1, y1) to (x2, y2).
     * @param {number} x X.
     * @param {number} y Y.
     * @param {number} x1 X1.
     * @param {number} y1 Y1.
     * @param {number} x2 X2.
     * @param {number} y2 Y2.
     * @return {number} Squared distance.
     */
    function squaredSegmentDistance(x, y, x1, y1, x2, y2) {
        var dx = x2 - x1;
        var dy = y2 - y1;
        if (dx !== 0 || dy !== 0) {
            var t = ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy);
            if (t > 1) {
                x1 = x2;
                y1 = y2;
            }
            else if (t > 0) {
                x1 += dx * t;
                y1 += dy * t;
            }
        }
        return squaredDistance(x, y, x1, y1);
    }
    /**
     * Returns the square of the distance between the points (x1, y1) and (x2, y2).
     * @param {number} x1 X1.
     * @param {number} y1 Y1.
     * @param {number} x2 X2.
     * @param {number} y2 Y2.
     * @return {number} Squared distance.
     */
    function squaredDistance(x1, y1, x2, y2) {
        var dx = x2 - x1;
        var dy = y2 - y1;
        return dx * dx + dy * dy;
    }
    /**
     * Calculates the linearly interpolated value of x between a and b.
     *
     * @param {number} a Number
     * @param {number} b Number
     * @param {number} x Value to be interpolated.
     * @return {number} Interpolated value.
     */
    function lerp(a, b, x) {
        return a + x * (b - a);
    }

    var __extends$s = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            if (typeof b !== "function" && b !== null)
                throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * Radius of WGS84 sphere
     *
     * @const
     * @type {number}
     */
    var RADIUS$1 = 6378137;
    /**
     * @const
     * @type {number}
     */
    var HALF_SIZE = Math.PI * RADIUS$1;
    /**
     * @const
     * @type {import("../extent.js").Extent}
     */
    var EXTENT$1 = [-HALF_SIZE, -HALF_SIZE, HALF_SIZE, HALF_SIZE];
    /**
     * @const
     * @type {import("../extent.js").Extent}
     */
    var WORLD_EXTENT = [-180, -85, 180, 85];
    /**
     * Maximum safe value in y direction
     * @const
     * @type {number}
     */
    var MAX_SAFE_Y = RADIUS$1 * Math.log(Math.tan(Math.PI / 2));
    /**
     * @classdesc
     * Projection object for web/spherical Mercator (EPSG:3857).
     */
    var EPSG3857Projection = /** @class */ (function (_super) {
        __extends$s(EPSG3857Projection, _super);
        /**
         * @param {string} code Code.
         */
        function EPSG3857Projection(code) {
            return _super.call(this, {
                code: code,
                units: ProjUnits.METERS,
                extent: EXTENT$1,
                global: true,
                worldExtent: WORLD_EXTENT,
                getPointResolution: function (resolution, point) {
                    return resolution / cosh(point[1] / RADIUS$1);
                },
            }) || this;
        }
        return EPSG3857Projection;
    }(Projection$1));
    /**
     * Projections equal to EPSG:3857.
     *
     * @const
     * @type {Array<import("./Projection.js").default>}
     */
    var PROJECTIONS$1 = [
        new EPSG3857Projection('EPSG:3857'),
        new EPSG3857Projection('EPSG:102100'),
        new EPSG3857Projection('EPSG:102113'),
        new EPSG3857Projection('EPSG:900913'),
        new EPSG3857Projection('http://www.opengis.net/def/crs/EPSG/0/3857'),
        new EPSG3857Projection('http://www.opengis.net/gml/srs/epsg.xml#3857'),
    ];
    /**
     * Transformation from EPSG:4326 to EPSG:3857.
     *
     * @param {Array<number>} input Input array of coordinate values.
     * @param {Array<number>} [opt_output] Output array of coordinate values.
     * @param {number} [opt_dimension] Dimension (default is `2`).
     * @return {Array<number>} Output array of coordinate values.
     */
    function fromEPSG4326(input, opt_output, opt_dimension) {
        var length = input.length;
        var dimension = opt_dimension > 1 ? opt_dimension : 2;
        var output = opt_output;
        if (output === undefined) {
            if (dimension > 2) {
                // preserve values beyond second dimension
                output = input.slice();
            }
            else {
                output = new Array(length);
            }
        }
        for (var i = 0; i < length; i += dimension) {
            output[i] = (HALF_SIZE * input[i]) / 180;
            var y = RADIUS$1 * Math.log(Math.tan((Math.PI * (+input[i + 1] + 90)) / 360));
            if (y > MAX_SAFE_Y) {
                y = MAX_SAFE_Y;
            }
            else if (y < -MAX_SAFE_Y) {
                y = -MAX_SAFE_Y;
            }
            output[i + 1] = y;
        }
        return output;
    }
    /**
     * Transformation from EPSG:3857 to EPSG:4326.
     *
     * @param {Array<number>} input Input array of coordinate values.
     * @param {Array<number>} [opt_output] Output array of coordinate values.
     * @param {number} [opt_dimension] Dimension (default is `2`).
     * @return {Array<number>} Output array of coordinate values.
     */
    function toEPSG4326(input, opt_output, opt_dimension) {
        var length = input.length;
        var dimension = opt_dimension > 1 ? opt_dimension : 2;
        var output = opt_output;
        if (output === undefined) {
            if (dimension > 2) {
                // preserve values beyond second dimension
                output = input.slice();
            }
            else {
                output = new Array(length);
            }
        }
        for (var i = 0; i < length; i += dimension) {
            output[i] = (180 * input[i]) / HALF_SIZE;
            output[i + 1] =
                (360 * Math.atan(Math.exp(input[i + 1] / RADIUS$1))) / Math.PI - 90;
        }
        return output;
    }

    var __extends$r = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            if (typeof b !== "function" && b !== null)
                throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * Semi-major radius of the WGS84 ellipsoid.
     *
     * @const
     * @type {number}
     */
    var RADIUS = 6378137;
    /**
     * Extent of the EPSG:4326 projection which is the whole world.
     *
     * @const
     * @type {import("../extent.js").Extent}
     */
    var EXTENT = [-180, -90, 180, 90];
    /**
     * @const
     * @type {number}
     */
    var METERS_PER_UNIT = (Math.PI * RADIUS) / 180;
    /**
     * @classdesc
     * Projection object for WGS84 geographic coordinates (EPSG:4326).
     *
     * Note that OpenLayers does not strictly comply with the EPSG definition.
     * The EPSG registry defines 4326 as a CRS for Latitude,Longitude (y,x).
     * OpenLayers treats EPSG:4326 as a pseudo-projection, with x,y coordinates.
     */
    var EPSG4326Projection = /** @class */ (function (_super) {
        __extends$r(EPSG4326Projection, _super);
        /**
         * @param {string} code Code.
         * @param {string} [opt_axisOrientation] Axis orientation.
         */
        function EPSG4326Projection(code, opt_axisOrientation) {
            return _super.call(this, {
                code: code,
                units: ProjUnits.DEGREES,
                extent: EXTENT,
                axisOrientation: opt_axisOrientation,
                global: true,
                metersPerUnit: METERS_PER_UNIT,
                worldExtent: EXTENT,
            }) || this;
        }
        return EPSG4326Projection;
    }(Projection$1));
    /**
     * Projections equal to EPSG:4326.
     *
     * @const
     * @type {Array<import("./Projection.js").default>}
     */
    var PROJECTIONS = [
        new EPSG4326Projection('CRS:84'),
        new EPSG4326Projection('EPSG:4326', 'neu'),
        new EPSG4326Projection('urn:ogc:def:crs:OGC:1.3:CRS84'),
        new EPSG4326Projection('urn:ogc:def:crs:OGC:2:84'),
        new EPSG4326Projection('http://www.opengis.net/def/crs/OGC/1.3/CRS84'),
        new EPSG4326Projection('http://www.opengis.net/gml/srs/epsg.xml#4326', 'neu'),
        new EPSG4326Projection('http://www.opengis.net/def/crs/EPSG/0/4326', 'neu'),
    ];

    /**
     * @module ol/proj/projections
     */
    /**
     * @type {Object<string, import("./Projection.js").default>}
     */
    var cache = {};
    /**
     * Get a cached projection by code.
     * @param {string} code The code for the projection.
     * @return {import("./Projection.js").default} The projection (if cached).
     */
    function get$3(code) {
        return (cache[code] ||
            cache[code.replace(/urn:(x-)?ogc:def:crs:EPSG:(.*:)?(\w+)$/, 'EPSG:$3')] ||
            null);
    }
    /**
     * Add a projection to the cache.
     * @param {string} code The projection code.
     * @param {import("./Projection.js").default} projection The projection to cache.
     */
    function add$1(code, projection) {
        cache[code] = projection;
    }

    /**
     * @module ol/proj/transforms
     */
    /**
     * @private
     * @type {!Object<string, Object<string, import("../proj.js").TransformFunction>>}
     */
    var transforms = {};
    /**
     * Registers a conversion function to convert coordinates from the source
     * projection to the destination projection.
     *
     * @param {import("./Projection.js").default} source Source.
     * @param {import("./Projection.js").default} destination Destination.
     * @param {import("../proj.js").TransformFunction} transformFn Transform.
     */
    function add(source, destination, transformFn) {
        var sourceCode = source.getCode();
        var destinationCode = destination.getCode();
        if (!(sourceCode in transforms)) {
            transforms[sourceCode] = {};
        }
        transforms[sourceCode][destinationCode] = transformFn;
    }
    /**
     * Get a transform given a source code and a destination code.
     * @param {string} sourceCode The code for the source projection.
     * @param {string} destinationCode The code for the destination projection.
     * @return {import("../proj.js").TransformFunction|undefined} The transform function (if found).
     */
    function get$2(sourceCode, destinationCode) {
        var transform;
        if (sourceCode in transforms && destinationCode in transforms[sourceCode]) {
            transform = transforms[sourceCode][destinationCode];
        }
        return transform;
    }

    /**
     * @module ol/coordinate
     */
    /**
     * Modifies the provided coordinate in-place to be within the real world
     * extent. The lower projection extent boundary is inclusive, the upper one
     * exclusive.
     *
     * @param {Coordinate} coordinate Coordinate.
     * @param {import("./proj/Projection.js").default} projection Projection.
     * @return {Coordinate} The coordinate within the real world extent.
     */
    function wrapX(coordinate, projection) {
        if (projection.canWrapX()) {
            var worldWidth = getWidth(projection.getExtent());
            var worldsAway = getWorldsAway(coordinate, projection, worldWidth);
            if (worldsAway) {
                coordinate[0] -= worldsAway * worldWidth;
            }
        }
        return coordinate;
    }
    /**
     * @param {Coordinate} coordinate Coordinate.
     * @param {import("./proj/Projection.js").default} projection Projection.
     * @param {number} [opt_sourceExtentWidth] Width of the source extent.
     * @return {number} Offset in world widths.
     */
    function getWorldsAway(coordinate, projection, opt_sourceExtentWidth) {
        var projectionExtent = projection.getExtent();
        var worldsAway = 0;
        if (projection.canWrapX() &&
            (coordinate[0] < projectionExtent[0] || coordinate[0] > projectionExtent[2])) {
            var sourceExtentWidth = opt_sourceExtentWidth || getWidth(projectionExtent);
            worldsAway = Math.floor((coordinate[0] - projectionExtent[0]) / sourceExtentWidth);
        }
        return worldsAway;
    }

    /**
     * @module ol/proj
     */
    /**
     * The ol/proj module stores:
     * * a list of {@link module:ol/proj/Projection~Projection}
     * objects, one for each projection supported by the application
     * * a list of transform functions needed to convert coordinates in one projection
     * into another.
     *
     * The static functions are the methods used to maintain these.
     * Each transform function can handle not only simple coordinate pairs, but also
     * large arrays of coordinates such as vector geometries.
     *
     * When loaded, the library adds projection objects for EPSG:4326 (WGS84
     * geographic coordinates) and EPSG:3857 (Web or Spherical Mercator, as used
     * for example by Bing Maps or OpenStreetMap), together with the relevant
     * transform functions.
     *
     * Additional transforms may be added by using the http://proj4js.org/
     * library (version 2.2 or later). You can use the full build supplied by
     * Proj4js, or create a custom build to support those projections you need; see
     * the Proj4js website for how to do this. You also need the Proj4js definitions
     * for the required projections. These definitions can be obtained from
     * https://epsg.io/, and are a JS function, so can be loaded in a script
     * tag (as in the examples) or pasted into your application.
     *
     * After all required projection definitions are added to proj4's registry (by
     * using `proj4.defs()`), simply call `register(proj4)` from the `ol/proj/proj4`
     * package. Existing transforms are not changed by this function. See
     * examples/wms-image-custom-proj for an example of this.
     *
     * Additional projection definitions can be registered with `proj4.defs()` any
     * time. Just make sure to call `register(proj4)` again; for example, with user-supplied data where you don't
     * know in advance what projections are needed, you can initially load minimal
     * support and then load whichever are requested.
     *
     * Note that Proj4js does not support projection extents. If you want to add
     * one for creating default tile grids, you can add it after the Projection
     * object has been created with `setExtent`, for example,
     * `get('EPSG:1234').setExtent(extent)`.
     *
     * In addition to Proj4js support, any transform functions can be added with
     * {@link module:ol/proj.addCoordinateTransforms}. To use this, you must first create
     * a {@link module:ol/proj/Projection~Projection} object for the new projection and add it with
     * {@link module:ol/proj.addProjection}. You can then add the forward and inverse
     * functions with {@link module:ol/proj.addCoordinateTransforms}. See
     * examples/wms-custom-proj for an example of this.
     *
     * Note that if no transforms are needed and you only need to define the
     * projection, just add a {@link module:ol/proj/Projection~Projection} with
     * {@link module:ol/proj.addProjection}. See examples/wms-no-proj for an example of
     * this.
     */
    /**
     * @param {Array<number>} input Input coordinate array.
     * @param {Array<number>} [opt_output] Output array of coordinate values.
     * @param {number} [opt_dimension] Dimension.
     * @return {Array<number>} Output coordinate array (new array, same coordinate
     *     values).
     */
    function cloneTransform(input, opt_output, opt_dimension) {
        var output;
        if (opt_output !== undefined) {
            for (var i = 0, ii = input.length; i < ii; ++i) {
                opt_output[i] = input[i];
            }
            output = opt_output;
        }
        else {
            output = input.slice();
        }
        return output;
    }
    /**
     * @param {Array<number>} input Input coordinate array.
     * @param {Array<number>} [opt_output] Output array of coordinate values.
     * @param {number} [opt_dimension] Dimension.
     * @return {Array<number>} Input coordinate array (same array as input).
     */
    function identityTransform(input, opt_output, opt_dimension) {
        if (opt_output !== undefined && input !== opt_output) {
            for (var i = 0, ii = input.length; i < ii; ++i) {
                opt_output[i] = input[i];
            }
            input = opt_output;
        }
        return input;
    }
    /**
     * Add a Projection object to the list of supported projections that can be
     * looked up by their code.
     *
     * @param {Projection} projection Projection instance.
     * @api
     */
    function addProjection(projection) {
        add$1(projection.getCode(), projection);
        add(projection, projection, cloneTransform);
    }
    /**
     * @param {Array<Projection>} projections Projections.
     */
    function addProjections(projections) {
        projections.forEach(addProjection);
    }
    /**
     * Fetches a Projection object for the code specified.
     *
     * @param {ProjectionLike} projectionLike Either a code string which is
     *     a combination of authority and identifier such as "EPSG:4326", or an
     *     existing projection object, or undefined.
     * @return {Projection|null} Projection object, or null if not in list.
     * @api
     */
    function get$1(projectionLike) {
        return typeof projectionLike === 'string'
            ? get$3(/** @type {string} */ (projectionLike))
            : /** @type {Projection} */ (projectionLike) || null;
    }
    /**
     * Registers transformation functions that don't alter coordinates. Those allow
     * to transform between projections with equal meaning.
     *
     * @param {Array<Projection>} projections Projections.
     * @api
     */
    function addEquivalentProjections(projections) {
        addProjections(projections);
        projections.forEach(function (source) {
            projections.forEach(function (destination) {
                if (source !== destination) {
                    add(source, destination, cloneTransform);
                }
            });
        });
    }
    /**
     * Registers transformation functions to convert coordinates in any projection
     * in projection1 to any projection in projection2.
     *
     * @param {Array<Projection>} projections1 Projections with equal
     *     meaning.
     * @param {Array<Projection>} projections2 Projections with equal
     *     meaning.
     * @param {TransformFunction} forwardTransform Transformation from any
     *   projection in projection1 to any projection in projection2.
     * @param {TransformFunction} inverseTransform Transform from any projection
     *   in projection2 to any projection in projection1..
     */
    function addEquivalentTransforms(projections1, projections2, forwardTransform, inverseTransform) {
        projections1.forEach(function (projection1) {
            projections2.forEach(function (projection2) {
                add(projection1, projection2, forwardTransform);
                add(projection2, projection1, inverseTransform);
            });
        });
    }
    /**
     * Transforms a coordinate from longitude/latitude to a different projection.
     * @param {import("./coordinate.js").Coordinate} coordinate Coordinate as longitude and latitude, i.e.
     *     an array with longitude as 1st and latitude as 2nd element.
     * @param {ProjectionLike} [opt_projection] Target projection. The
     *     default is Web Mercator, i.e. 'EPSG:3857'.
     * @return {import("./coordinate.js").Coordinate} Coordinate projected to the target projection.
     * @api
     */
    function fromLonLat(coordinate, opt_projection) {
        return transform(coordinate, 'EPSG:4326', opt_projection !== undefined ? opt_projection : 'EPSG:3857');
    }
    /**
     * Searches in the list of transform functions for the function for converting
     * coordinates from the source projection to the destination projection.
     *
     * @param {Projection} sourceProjection Source Projection object.
     * @param {Projection} destinationProjection Destination Projection
     *     object.
     * @return {TransformFunction} Transform function.
     */
    function getTransformFromProjections(sourceProjection, destinationProjection) {
        var sourceCode = sourceProjection.getCode();
        var destinationCode = destinationProjection.getCode();
        var transformFunc = get$2(sourceCode, destinationCode);
        if (!transformFunc) {
            transformFunc = identityTransform;
        }
        return transformFunc;
    }
    /**
     * Given the projection-like objects, searches for a transformation
     * function to convert a coordinates array from the source projection to the
     * destination projection.
     *
     * @param {ProjectionLike} source Source.
     * @param {ProjectionLike} destination Destination.
     * @return {TransformFunction} Transform function.
     * @api
     */
    function getTransform(source, destination) {
        var sourceProjection = get$1(source);
        var destinationProjection = get$1(destination);
        return getTransformFromProjections(sourceProjection, destinationProjection);
    }
    /**
     * Transforms a coordinate from source projection to destination projection.
     * This returns a new coordinate (and does not modify the original).
     *
     * See {@link module:ol/proj.transformExtent} for extent transformation.
     * See the transform method of {@link module:ol/geom/Geometry~Geometry} and its
     * subclasses for geometry transforms.
     *
     * @param {import("./coordinate.js").Coordinate} coordinate Coordinate.
     * @param {ProjectionLike} source Source projection-like.
     * @param {ProjectionLike} destination Destination projection-like.
     * @return {import("./coordinate.js").Coordinate} Coordinate.
     * @api
     */
    function transform(coordinate, source, destination) {
        var transformFunc = getTransform(source, destination);
        return transformFunc(coordinate, undefined, coordinate.length);
    }
    /**
     * Return an extent transformed into the user projection.  If no user projection
     * is set, the original extent is returned.
     * @param {import("./extent.js").Extent} extent Input extent.
     * @param {ProjectionLike} sourceProjection The input extent projection.
     * @return {import("./extent.js").Extent} The input extent in the user projection.
     */
    function toUserExtent(extent, sourceProjection) {
        {
            return extent;
        }
    }
    /**
     * Return an extent transformed from the user projection.  If no user projection
     * is set, the original extent is returned.
     * @param {import("./extent.js").Extent} extent Input extent.
     * @param {ProjectionLike} destProjection The destination projection.
     * @return {import("./extent.js").Extent} The input extent transformed.
     */
    function fromUserExtent(extent, destProjection) {
        {
            return extent;
        }
    }
    /**
     * Add transforms to and from EPSG:4326 and EPSG:3857.  This function is called
     * by when this module is executed and should only need to be called again after
     * `clearAllProjections()` is called (e.g. in tests).
     */
    function addCommon() {
        // Add transformations that don't alter coordinates to convert within set of
        // projections with equal meaning.
        addEquivalentProjections(PROJECTIONS$1);
        addEquivalentProjections(PROJECTIONS);
        // Add transformations to convert EPSG:4326 like coordinates to EPSG:3857 like
        // coordinates and back.
        addEquivalentTransforms(PROJECTIONS, PROJECTIONS$1, fromEPSG4326, toEPSG4326);
    }
    addCommon();

    /**
     * @module ol/geom/flat/transform
     */
    /**
     * @param {Array<number>} flatCoordinates Flat coordinates.
     * @param {number} offset Offset.
     * @param {number} end End.
     * @param {number} stride Stride.
     * @param {import("../../transform.js").Transform} transform Transform.
     * @param {Array<number>} [opt_dest] Destination.
     * @return {Array<number>} Transformed coordinates.
     */
    function transform2D(flatCoordinates, offset, end, stride, transform, opt_dest) {
        var dest = opt_dest ? opt_dest : [];
        var i = 0;
        for (var j = offset; j < end; j += stride) {
            var x = flatCoordinates[j];
            var y = flatCoordinates[j + 1];
            dest[i++] = transform[0] * x + transform[2] * y + transform[4];
            dest[i++] = transform[1] * x + transform[3] * y + transform[5];
        }
        if (opt_dest && dest.length != i) {
            dest.length = i;
        }
        return dest;
    }
    /**
     * @param {Array<number>} flatCoordinates Flat coordinates.
     * @param {number} offset Offset.
     * @param {number} end End.
     * @param {number} stride Stride.
     * @param {number} angle Angle.
     * @param {Array<number>} anchor Rotation anchor point.
     * @param {Array<number>} [opt_dest] Destination.
     * @return {Array<number>} Transformed coordinates.
     */
    function rotate(flatCoordinates, offset, end, stride, angle, anchor, opt_dest) {
        var dest = opt_dest ? opt_dest : [];
        var cos = Math.cos(angle);
        var sin = Math.sin(angle);
        var anchorX = anchor[0];
        var anchorY = anchor[1];
        var i = 0;
        for (var j = offset; j < end; j += stride) {
            var deltaX = flatCoordinates[j] - anchorX;
            var deltaY = flatCoordinates[j + 1] - anchorY;
            dest[i++] = anchorX + deltaX * cos - deltaY * sin;
            dest[i++] = anchorY + deltaX * sin + deltaY * cos;
            for (var k = j + 2; k < j + stride; ++k) {
                dest[i++] = flatCoordinates[k];
            }
        }
        if (opt_dest && dest.length != i) {
            dest.length = i;
        }
        return dest;
    }
    /**
     * Scale the coordinates.
     * @param {Array<number>} flatCoordinates Flat coordinates.
     * @param {number} offset Offset.
     * @param {number} end End.
     * @param {number} stride Stride.
     * @param {number} sx Scale factor in the x-direction.
     * @param {number} sy Scale factor in the y-direction.
     * @param {Array<number>} anchor Scale anchor point.
     * @param {Array<number>} [opt_dest] Destination.
     * @return {Array<number>} Transformed coordinates.
     */
    function scale(flatCoordinates, offset, end, stride, sx, sy, anchor, opt_dest) {
        var dest = opt_dest ? opt_dest : [];
        var anchorX = anchor[0];
        var anchorY = anchor[1];
        var i = 0;
        for (var j = offset; j < end; j += stride) {
            var deltaX = flatCoordinates[j] - anchorX;
            var deltaY = flatCoordinates[j + 1] - anchorY;
            dest[i++] = anchorX + sx * deltaX;
            dest[i++] = anchorY + sy * deltaY;
            for (var k = j + 2; k < j + stride; ++k) {
                dest[i++] = flatCoordinates[k];
            }
        }
        if (opt_dest && dest.length != i) {
            dest.length = i;
        }
        return dest;
    }
    /**
     * @param {Array<number>} flatCoordinates Flat coordinates.
     * @param {number} offset Offset.
     * @param {number} end End.
     * @param {number} stride Stride.
     * @param {number} deltaX Delta X.
     * @param {number} deltaY Delta Y.
     * @param {Array<number>} [opt_dest] Destination.
     * @return {Array<number>} Transformed coordinates.
     */
    function translate(flatCoordinates, offset, end, stride, deltaX, deltaY, opt_dest) {
        var dest = opt_dest ? opt_dest : [];
        var i = 0;
        for (var j = offset; j < end; j += stride) {
            dest[i++] = flatCoordinates[j] + deltaX;
            dest[i++] = flatCoordinates[j + 1] + deltaY;
            for (var k = j + 2; k < j + stride; ++k) {
                dest[i++] = flatCoordinates[k];
            }
        }
        if (opt_dest && dest.length != i) {
            dest.length = i;
        }
        return dest;
    }

    var __extends$q = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            if (typeof b !== "function" && b !== null)
                throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * @typedef {'Point' | 'LineString' | 'LinearRing' | 'Polygon' | 'MultiPoint' | 'MultiLineString' | 'MultiPolygon' | 'GeometryCollection' | 'Circle'} Type
     * The geometry type.  One of `'Point'`, `'LineString'`, `'LinearRing'`,
     * `'Polygon'`, `'MultiPoint'`, `'MultiLineString'`, `'MultiPolygon'`,
     * `'GeometryCollection'`, or `'Circle'`.
     */
    /**
     * @type {import("../transform.js").Transform}
     */
    var tmpTransform = create();
    /**
     * @classdesc
     * Abstract base class; normally only used for creating subclasses and not
     * instantiated in apps.
     * Base class for vector geometries.
     *
     * To get notified of changes to the geometry, register a listener for the
     * generic `change` event on your geometry instance.
     *
     * @abstract
     * @api
     */
    var Geometry = /** @class */ (function (_super) {
        __extends$q(Geometry, _super);
        function Geometry() {
            var _this = _super.call(this) || this;
            /**
             * @private
             * @type {import("../extent.js").Extent}
             */
            _this.extent_ = createEmpty();
            /**
             * @private
             * @type {number}
             */
            _this.extentRevision_ = -1;
            /**
             * @protected
             * @type {number}
             */
            _this.simplifiedGeometryMaxMinSquaredTolerance = 0;
            /**
             * @protected
             * @type {number}
             */
            _this.simplifiedGeometryRevision = 0;
            /**
             * Get a transformed and simplified version of the geometry.
             * @abstract
             * @param {number} revision The geometry revision.
             * @param {number} squaredTolerance Squared tolerance.
             * @param {import("../proj.js").TransformFunction} [opt_transform] Optional transform function.
             * @return {Geometry} Simplified geometry.
             */
            _this.simplifyTransformedInternal = memoizeOne(function (revision, squaredTolerance, opt_transform) {
                if (!opt_transform) {
                    return this.getSimplifiedGeometry(squaredTolerance);
                }
                var clone = this.clone();
                clone.applyTransform(opt_transform);
                return clone.getSimplifiedGeometry(squaredTolerance);
            });
            return _this;
        }
        /**
         * Get a transformed and simplified version of the geometry.
         * @abstract
         * @param {number} squaredTolerance Squared tolerance.
         * @param {import("../proj.js").TransformFunction} [opt_transform] Optional transform function.
         * @return {Geometry} Simplified geometry.
         */
        Geometry.prototype.simplifyTransformed = function (squaredTolerance, opt_transform) {
            return this.simplifyTransformedInternal(this.getRevision(), squaredTolerance, opt_transform);
        };
        /**
         * Make a complete copy of the geometry.
         * @abstract
         * @return {!Geometry} Clone.
         */
        Geometry.prototype.clone = function () {
            return abstract();
        };
        /**
         * @abstract
         * @param {number} x X.
         * @param {number} y Y.
         * @param {import("../coordinate.js").Coordinate} closestPoint Closest point.
         * @param {number} minSquaredDistance Minimum squared distance.
         * @return {number} Minimum squared distance.
         */
        Geometry.prototype.closestPointXY = function (x, y, closestPoint, minSquaredDistance) {
            return abstract();
        };
        /**
         * @param {number} x X.
         * @param {number} y Y.
         * @return {boolean} Contains (x, y).
         */
        Geometry.prototype.containsXY = function (x, y) {
            var coord = this.getClosestPoint([x, y]);
            return coord[0] === x && coord[1] === y;
        };
        /**
         * Return the closest point of the geometry to the passed point as
         * {@link module:ol/coordinate~Coordinate coordinate}.
         * @param {import("../coordinate.js").Coordinate} point Point.
         * @param {import("../coordinate.js").Coordinate} [opt_closestPoint] Closest point.
         * @return {import("../coordinate.js").Coordinate} Closest point.
         * @api
         */
        Geometry.prototype.getClosestPoint = function (point, opt_closestPoint) {
            var closestPoint = opt_closestPoint ? opt_closestPoint : [NaN, NaN];
            this.closestPointXY(point[0], point[1], closestPoint, Infinity);
            return closestPoint;
        };
        /**
         * Returns true if this geometry includes the specified coordinate. If the
         * coordinate is on the boundary of the geometry, returns false.
         * @param {import("../coordinate.js").Coordinate} coordinate Coordinate.
         * @return {boolean} Contains coordinate.
         * @api
         */
        Geometry.prototype.intersectsCoordinate = function (coordinate) {
            return this.containsXY(coordinate[0], coordinate[1]);
        };
        /**
         * @abstract
         * @param {import("../extent.js").Extent} extent Extent.
         * @protected
         * @return {import("../extent.js").Extent} extent Extent.
         */
        Geometry.prototype.computeExtent = function (extent) {
            return abstract();
        };
        /**
         * Get the extent of the geometry.
         * @param {import("../extent.js").Extent} [opt_extent] Extent.
         * @return {import("../extent.js").Extent} extent Extent.
         * @api
         */
        Geometry.prototype.getExtent = function (opt_extent) {
            if (this.extentRevision_ != this.getRevision()) {
                var extent = this.computeExtent(this.extent_);
                if (isNaN(extent[0]) || isNaN(extent[1])) {
                    createOrUpdateEmpty(extent);
                }
                this.extentRevision_ = this.getRevision();
            }
            return returnOrUpdate(this.extent_, opt_extent);
        };
        /**
         * Rotate the geometry around a given coordinate. This modifies the geometry
         * coordinates in place.
         * @abstract
         * @param {number} angle Rotation angle in radians.
         * @param {import("../coordinate.js").Coordinate} anchor The rotation center.
         * @api
         */
        Geometry.prototype.rotate = function (angle, anchor) {
            abstract();
        };
        /**
         * Scale the geometry (with an optional origin).  This modifies the geometry
         * coordinates in place.
         * @abstract
         * @param {number} sx The scaling factor in the x-direction.
         * @param {number} [opt_sy] The scaling factor in the y-direction (defaults to sx).
         * @param {import("../coordinate.js").Coordinate} [opt_anchor] The scale origin (defaults to the center
         *     of the geometry extent).
         * @api
         */
        Geometry.prototype.scale = function (sx, opt_sy, opt_anchor) {
            abstract();
        };
        /**
         * Create a simplified version of this geometry.  For linestrings, this uses
         * the [Douglas Peucker](https://en.wikipedia.org/wiki/Ramer-Douglas-Peucker_algorithm)
         * algorithm.  For polygons, a quantization-based
         * simplification is used to preserve topology.
         * @param {number} tolerance The tolerance distance for simplification.
         * @return {Geometry} A new, simplified version of the original geometry.
         * @api
         */
        Geometry.prototype.simplify = function (tolerance) {
            return this.getSimplifiedGeometry(tolerance * tolerance);
        };
        /**
         * Create a simplified version of this geometry using the Douglas Peucker
         * algorithm.
         * See https://en.wikipedia.org/wiki/Ramer-Douglas-Peucker_algorithm.
         * @abstract
         * @param {number} squaredTolerance Squared tolerance.
         * @return {Geometry} Simplified geometry.
         */
        Geometry.prototype.getSimplifiedGeometry = function (squaredTolerance) {
            return abstract();
        };
        /**
         * Get the type of this geometry.
         * @abstract
         * @return {Type} Geometry type.
         */
        Geometry.prototype.getType = function () {
            return abstract();
        };
        /**
         * Apply a transform function to the coordinates of the geometry.
         * The geometry is modified in place.
         * If you do not want the geometry modified in place, first `clone()` it and
         * then use this function on the clone.
         * @abstract
         * @param {import("../proj.js").TransformFunction} transformFn Transform function.
         * Called with a flat array of geometry coordinates.
         */
        Geometry.prototype.applyTransform = function (transformFn) {
            abstract();
        };
        /**
         * Test if the geometry and the passed extent intersect.
         * @abstract
         * @param {import("../extent.js").Extent} extent Extent.
         * @return {boolean} `true` if the geometry and the extent intersect.
         */
        Geometry.prototype.intersectsExtent = function (extent) {
            return abstract();
        };
        /**
         * Translate the geometry.  This modifies the geometry coordinates in place.  If
         * instead you want a new geometry, first `clone()` this geometry.
         * @abstract
         * @param {number} deltaX Delta X.
         * @param {number} deltaY Delta Y.
         * @api
         */
        Geometry.prototype.translate = function (deltaX, deltaY) {
            abstract();
        };
        /**
         * Transform each coordinate of the geometry from one coordinate reference
         * system to another. The geometry is modified in place.
         * For example, a line will be transformed to a line and a circle to a circle.
         * If you do not want the geometry modified in place, first `clone()` it and
         * then use this function on the clone.
         *
         * @param {import("../proj.js").ProjectionLike} source The current projection.  Can be a
         *     string identifier or a {@link module:ol/proj/Projection~Projection} object.
         * @param {import("../proj.js").ProjectionLike} destination The desired projection.  Can be a
         *     string identifier or a {@link module:ol/proj/Projection~Projection} object.
         * @return {Geometry} This geometry.  Note that original geometry is
         *     modified in place.
         * @api
         */
        Geometry.prototype.transform = function (source, destination) {
            /** @type {import("../proj/Projection.js").default} */
            var sourceProj = get$1(source);
            var transformFn = sourceProj.getUnits() == ProjUnits.TILE_PIXELS
                ? function (inCoordinates, outCoordinates, stride) {
                    var pixelExtent = sourceProj.getExtent();
                    var projectedExtent = sourceProj.getWorldExtent();
                    var scale = getHeight(projectedExtent) / getHeight(pixelExtent);
                    compose(tmpTransform, projectedExtent[0], projectedExtent[3], scale, -scale, 0, 0, 0);
                    transform2D(inCoordinates, 0, inCoordinates.length, stride, tmpTransform, outCoordinates);
                    return getTransform(sourceProj, destination)(inCoordinates, outCoordinates, stride);
                }
                : getTransform(sourceProj, destination);
            this.applyTransform(transformFn);
            return this;
        };
        return Geometry;
    }(BaseObject$1));
    var Geometry$1 = Geometry;

    var __extends$p = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            if (typeof b !== "function" && b !== null)
                throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * @classdesc
     * Abstract base class; only used for creating subclasses; do not instantiate
     * in apps, as cannot be rendered.
     *
     * @abstract
     * @api
     */
    var SimpleGeometry = /** @class */ (function (_super) {
        __extends$p(SimpleGeometry, _super);
        function SimpleGeometry() {
            var _this = _super.call(this) || this;
            /**
             * @protected
             * @type {import("./GeometryLayout.js").default}
             */
            _this.layout = GeometryLayout.XY;
            /**
             * @protected
             * @type {number}
             */
            _this.stride = 2;
            /**
             * @protected
             * @type {Array<number>}
             */
            _this.flatCoordinates = null;
            return _this;
        }
        /**
         * @param {import("../extent.js").Extent} extent Extent.
         * @protected
         * @return {import("../extent.js").Extent} extent Extent.
         */
        SimpleGeometry.prototype.computeExtent = function (extent) {
            return createOrUpdateFromFlatCoordinates(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, extent);
        };
        /**
         * @abstract
         * @return {Array<*> | null} Coordinates.
         */
        SimpleGeometry.prototype.getCoordinates = function () {
            return abstract();
        };
        /**
         * Return the first coordinate of the geometry.
         * @return {import("../coordinate.js").Coordinate} First coordinate.
         * @api
         */
        SimpleGeometry.prototype.getFirstCoordinate = function () {
            return this.flatCoordinates.slice(0, this.stride);
        };
        /**
         * @return {Array<number>} Flat coordinates.
         */
        SimpleGeometry.prototype.getFlatCoordinates = function () {
            return this.flatCoordinates;
        };
        /**
         * Return the last coordinate of the geometry.
         * @return {import("../coordinate.js").Coordinate} Last point.
         * @api
         */
        SimpleGeometry.prototype.getLastCoordinate = function () {
            return this.flatCoordinates.slice(this.flatCoordinates.length - this.stride);
        };
        /**
         * Return the {@link module:ol/geom/GeometryLayout layout} of the geometry.
         * @return {import("./GeometryLayout.js").default} Layout.
         * @api
         */
        SimpleGeometry.prototype.getLayout = function () {
            return this.layout;
        };
        /**
         * Create a simplified version of this geometry using the Douglas Peucker algorithm.
         * @param {number} squaredTolerance Squared tolerance.
         * @return {SimpleGeometry} Simplified geometry.
         */
        SimpleGeometry.prototype.getSimplifiedGeometry = function (squaredTolerance) {
            if (this.simplifiedGeometryRevision !== this.getRevision()) {
                this.simplifiedGeometryMaxMinSquaredTolerance = 0;
                this.simplifiedGeometryRevision = this.getRevision();
            }
            // If squaredTolerance is negative or if we know that simplification will not
            // have any effect then just return this.
            if (squaredTolerance < 0 ||
                (this.simplifiedGeometryMaxMinSquaredTolerance !== 0 &&
                    squaredTolerance <= this.simplifiedGeometryMaxMinSquaredTolerance)) {
                return this;
            }
            var simplifiedGeometry = this.getSimplifiedGeometryInternal(squaredTolerance);
            var simplifiedFlatCoordinates = simplifiedGeometry.getFlatCoordinates();
            if (simplifiedFlatCoordinates.length < this.flatCoordinates.length) {
                return simplifiedGeometry;
            }
            else {
                // Simplification did not actually remove any coordinates.  We now know
                // that any calls to getSimplifiedGeometry with a squaredTolerance less
                // than or equal to the current squaredTolerance will also not have any
                // effect.  This allows us to short circuit simplification (saving CPU
                // cycles) and prevents the cache of simplified geometries from filling
                // up with useless identical copies of this geometry (saving memory).
                this.simplifiedGeometryMaxMinSquaredTolerance = squaredTolerance;
                return this;
            }
        };
        /**
         * @param {number} squaredTolerance Squared tolerance.
         * @return {SimpleGeometry} Simplified geometry.
         * @protected
         */
        SimpleGeometry.prototype.getSimplifiedGeometryInternal = function (squaredTolerance) {
            return this;
        };
        /**
         * @return {number} Stride.
         */
        SimpleGeometry.prototype.getStride = function () {
            return this.stride;
        };
        /**
         * @param {import("./GeometryLayout.js").default} layout Layout.
         * @param {Array<number>} flatCoordinates Flat coordinates.
         */
        SimpleGeometry.prototype.setFlatCoordinates = function (layout, flatCoordinates) {
            this.stride = getStrideForLayout(layout);
            this.layout = layout;
            this.flatCoordinates = flatCoordinates;
        };
        /**
         * @abstract
         * @param {!Array<*>} coordinates Coordinates.
         * @param {import("./GeometryLayout.js").default} [opt_layout] Layout.
         */
        SimpleGeometry.prototype.setCoordinates = function (coordinates, opt_layout) {
            abstract();
        };
        /**
         * @param {import("./GeometryLayout.js").default|undefined} layout Layout.
         * @param {Array<*>} coordinates Coordinates.
         * @param {number} nesting Nesting.
         * @protected
         */
        SimpleGeometry.prototype.setLayout = function (layout, coordinates, nesting) {
            /** @type {number} */
            var stride;
            if (layout) {
                stride = getStrideForLayout(layout);
            }
            else {
                for (var i = 0; i < nesting; ++i) {
                    if (coordinates.length === 0) {
                        this.layout = GeometryLayout.XY;
                        this.stride = 2;
                        return;
                    }
                    else {
                        coordinates = /** @type {Array} */ (coordinates[0]);
                    }
                }
                stride = coordinates.length;
                layout = getLayoutForStride(stride);
            }
            this.layout = layout;
            this.stride = stride;
        };
        /**
         * Apply a transform function to the coordinates of the geometry.
         * The geometry is modified in place.
         * If you do not want the geometry modified in place, first `clone()` it and
         * then use this function on the clone.
         * @param {import("../proj.js").TransformFunction} transformFn Transform function.
         * Called with a flat array of geometry coordinates.
         * @api
         */
        SimpleGeometry.prototype.applyTransform = function (transformFn) {
            if (this.flatCoordinates) {
                transformFn(this.flatCoordinates, this.flatCoordinates, this.stride);
                this.changed();
            }
        };
        /**
         * Rotate the geometry around a given coordinate. This modifies the geometry
         * coordinates in place.
         * @param {number} angle Rotation angle in counter-clockwise radians.
         * @param {import("../coordinate.js").Coordinate} anchor The rotation center.
         * @api
         */
        SimpleGeometry.prototype.rotate = function (angle, anchor) {
            var flatCoordinates = this.getFlatCoordinates();
            if (flatCoordinates) {
                var stride = this.getStride();
                rotate(flatCoordinates, 0, flatCoordinates.length, stride, angle, anchor, flatCoordinates);
                this.changed();
            }
        };
        /**
         * Scale the geometry (with an optional origin).  This modifies the geometry
         * coordinates in place.
         * @param {number} sx The scaling factor in the x-direction.
         * @param {number} [opt_sy] The scaling factor in the y-direction (defaults to sx).
         * @param {import("../coordinate.js").Coordinate} [opt_anchor] The scale origin (defaults to the center
         *     of the geometry extent).
         * @api
         */
        SimpleGeometry.prototype.scale = function (sx, opt_sy, opt_anchor) {
            var sy = opt_sy;
            if (sy === undefined) {
                sy = sx;
            }
            var anchor = opt_anchor;
            if (!anchor) {
                anchor = getCenter(this.getExtent());
            }
            var flatCoordinates = this.getFlatCoordinates();
            if (flatCoordinates) {
                var stride = this.getStride();
                scale(flatCoordinates, 0, flatCoordinates.length, stride, sx, sy, anchor, flatCoordinates);
                this.changed();
            }
        };
        /**
         * Translate the geometry.  This modifies the geometry coordinates in place.  If
         * instead you want a new geometry, first `clone()` this geometry.
         * @param {number} deltaX Delta X.
         * @param {number} deltaY Delta Y.
         * @api
         */
        SimpleGeometry.prototype.translate = function (deltaX, deltaY) {
            var flatCoordinates = this.getFlatCoordinates();
            if (flatCoordinates) {
                var stride = this.getStride();
                translate(flatCoordinates, 0, flatCoordinates.length, stride, deltaX, deltaY, flatCoordinates);
                this.changed();
            }
        };
        return SimpleGeometry;
    }(Geometry$1));
    /**
     * @param {number} stride Stride.
     * @return {import("./GeometryLayout.js").default} layout Layout.
     */
    function getLayoutForStride(stride) {
        var layout;
        if (stride == 2) {
            layout = GeometryLayout.XY;
        }
        else if (stride == 3) {
            layout = GeometryLayout.XYZ;
        }
        else if (stride == 4) {
            layout = GeometryLayout.XYZM;
        }
        return /** @type {import("./GeometryLayout.js").default} */ (layout);
    }
    /**
     * @param {import("./GeometryLayout.js").default} layout Layout.
     * @return {number} Stride.
     */
    function getStrideForLayout(layout) {
        var stride;
        if (layout == GeometryLayout.XY) {
            stride = 2;
        }
        else if (layout == GeometryLayout.XYZ || layout == GeometryLayout.XYM) {
            stride = 3;
        }
        else if (layout == GeometryLayout.XYZM) {
            stride = 4;
        }
        return /** @type {number} */ (stride);
    }
    /**
     * @param {SimpleGeometry} simpleGeometry Simple geometry.
     * @param {import("../transform.js").Transform} transform Transform.
     * @param {Array<number>} [opt_dest] Destination.
     * @return {Array<number>} Transformed flat coordinates.
     */
    function transformGeom2D(simpleGeometry, transform, opt_dest) {
        var flatCoordinates = simpleGeometry.getFlatCoordinates();
        if (!flatCoordinates) {
            return null;
        }
        else {
            var stride = simpleGeometry.getStride();
            return transform2D(flatCoordinates, 0, flatCoordinates.length, stride, transform, opt_dest);
        }
    }
    var SimpleGeometry$1 = SimpleGeometry;

    /**
     * @module ol/geom/flat/closest
     */
    /**
     * Returns the point on the 2D line segment flatCoordinates[offset1] to
     * flatCoordinates[offset2] that is closest to the point (x, y).  Extra
     * dimensions are linearly interpolated.
     * @param {Array<number>} flatCoordinates Flat coordinates.
     * @param {number} offset1 Offset 1.
     * @param {number} offset2 Offset 2.
     * @param {number} stride Stride.
     * @param {number} x X.
     * @param {number} y Y.
     * @param {Array<number>} closestPoint Closest point.
     */
    function assignClosest(flatCoordinates, offset1, offset2, stride, x, y, closestPoint) {
        var x1 = flatCoordinates[offset1];
        var y1 = flatCoordinates[offset1 + 1];
        var dx = flatCoordinates[offset2] - x1;
        var dy = flatCoordinates[offset2 + 1] - y1;
        var offset;
        if (dx === 0 && dy === 0) {
            offset = offset1;
        }
        else {
            var t = ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy);
            if (t > 1) {
                offset = offset2;
            }
            else if (t > 0) {
                for (var i = 0; i < stride; ++i) {
                    closestPoint[i] = lerp(flatCoordinates[offset1 + i], flatCoordinates[offset2 + i], t);
                }
                closestPoint.length = stride;
                return;
            }
            else {
                offset = offset1;
            }
        }
        for (var i = 0; i < stride; ++i) {
            closestPoint[i] = flatCoordinates[offset + i];
        }
        closestPoint.length = stride;
    }
    /**
     * Return the squared of the largest distance between any pair of consecutive
     * coordinates.
     * @param {Array<number>} flatCoordinates Flat coordinates.
     * @param {number} offset Offset.
     * @param {number} end End.
     * @param {number} stride Stride.
     * @param {number} max Max squared delta.
     * @return {number} Max squared delta.
     */
    function maxSquaredDelta(flatCoordinates, offset, end, stride, max) {
        var x1 = flatCoordinates[offset];
        var y1 = flatCoordinates[offset + 1];
        for (offset += stride; offset < end; offset += stride) {
            var x2 = flatCoordinates[offset];
            var y2 = flatCoordinates[offset + 1];
            var squaredDelta = squaredDistance(x1, y1, x2, y2);
            if (squaredDelta > max) {
                max = squaredDelta;
            }
            x1 = x2;
            y1 = y2;
        }
        return max;
    }
    /**
     * @param {Array<number>} flatCoordinates Flat coordinates.
     * @param {number} offset Offset.
     * @param {number} end End.
     * @param {number} stride Stride.
     * @param {number} maxDelta Max delta.
     * @param {boolean} isRing Is ring.
     * @param {number} x X.
     * @param {number} y Y.
     * @param {Array<number>} closestPoint Closest point.
     * @param {number} minSquaredDistance Minimum squared distance.
     * @param {Array<number>} [opt_tmpPoint] Temporary point object.
     * @return {number} Minimum squared distance.
     */
    function assignClosestPoint(flatCoordinates, offset, end, stride, maxDelta, isRing, x, y, closestPoint, minSquaredDistance, opt_tmpPoint) {
        if (offset == end) {
            return minSquaredDistance;
        }
        var i, squaredDistance$1;
        if (maxDelta === 0) {
            // All points are identical, so just test the first point.
            squaredDistance$1 = squaredDistance(x, y, flatCoordinates[offset], flatCoordinates[offset + 1]);
            if (squaredDistance$1 < minSquaredDistance) {
                for (i = 0; i < stride; ++i) {
                    closestPoint[i] = flatCoordinates[offset + i];
                }
                closestPoint.length = stride;
                return squaredDistance$1;
            }
            else {
                return minSquaredDistance;
            }
        }
        var tmpPoint = opt_tmpPoint ? opt_tmpPoint : [NaN, NaN];
        var index = offset + stride;
        while (index < end) {
            assignClosest(flatCoordinates, index - stride, index, stride, x, y, tmpPoint);
            squaredDistance$1 = squaredDistance(x, y, tmpPoint[0], tmpPoint[1]);
            if (squaredDistance$1 < minSquaredDistance) {
                minSquaredDistance = squaredDistance$1;
                for (i = 0; i < stride; ++i) {
                    closestPoint[i] = tmpPoint[i];
                }
                closestPoint.length = stride;
                index += stride;
            }
            else {
                // Skip ahead multiple points, because we know that all the skipped
                // points cannot be any closer than the closest point we have found so
                // far.  We know this because we know how close the current point is, how
                // close the closest point we have found so far is, and the maximum
                // distance between consecutive points.  For example, if we're currently
                // at distance 10, the best we've found so far is 3, and that the maximum
                // distance between consecutive points is 2, then we'll need to skip at
                // least (10 - 3) / 2 == 3 (rounded down) points to have any chance of
                // finding a closer point.  We use Math.max(..., 1) to ensure that we
                // always advance at least one point, to avoid an infinite loop.
                index +=
                    stride *
                        Math.max(((Math.sqrt(squaredDistance$1) - Math.sqrt(minSquaredDistance)) /
                            maxDelta) |
                            0, 1);
            }
        }
        if (isRing) {
            // Check the closing segment.
            assignClosest(flatCoordinates, end - stride, offset, stride, x, y, tmpPoint);
            squaredDistance$1 = squaredDistance(x, y, tmpPoint[0], tmpPoint[1]);
            if (squaredDistance$1 < minSquaredDistance) {
                minSquaredDistance = squaredDistance$1;
                for (i = 0; i < stride; ++i) {
                    closestPoint[i] = tmpPoint[i];
                }
                closestPoint.length = stride;
            }
        }
        return minSquaredDistance;
    }

    /**
     * @module ol/geom/flat/deflate
     */
    /**
     * @param {Array<number>} flatCoordinates Flat coordinates.
     * @param {number} offset Offset.
     * @param {import("../../coordinate.js").Coordinate} coordinate Coordinate.
     * @param {number} stride Stride.
     * @return {number} offset Offset.
     */
    /**
     * @param {Array<number>} flatCoordinates Flat coordinates.
     * @param {number} offset Offset.
     * @param {Array<import("../../coordinate.js").Coordinate>} coordinates Coordinates.
     * @param {number} stride Stride.
     * @return {number} offset Offset.
     */
    function deflateCoordinates(flatCoordinates, offset, coordinates, stride) {
        for (var i = 0, ii = coordinates.length; i < ii; ++i) {
            var coordinate = coordinates[i];
            for (var j = 0; j < stride; ++j) {
                flatCoordinates[offset++] = coordinate[j];
            }
        }
        return offset;
    }

    /**
     * @module ol/geom/flat/simplify
     */
    // Based on simplify-js https://github.com/mourner/simplify-js
    // Copyright (c) 2012, Vladimir Agafonkin
    // All rights reserved.
    //
    // Redistribution and use in source and binary forms, with or without
    // modification, are permitted provided that the following conditions are met:
    //
    //    1. Redistributions of source code must retain the above copyright notice,
    //       this list of conditions and the following disclaimer.
    //
    //    2. Redistributions in binary form must reproduce the above copyright
    //       notice, this list of conditions and the following disclaimer in the
    //       documentation and/or other materials provided with the distribution.
    //
    // THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
    // AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
    // IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
    // ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
    // LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
    // CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
    // SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
    // INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
    // CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
    // ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
    // POSSIBILITY OF SUCH DAMAGE.
    /**
     * @param {Array<number>} flatCoordinates Flat coordinates.
     * @param {number} offset Offset.
     * @param {number} end End.
     * @param {number} stride Stride.
     * @param {number} squaredTolerance Squared tolerance.
     * @param {Array<number>} simplifiedFlatCoordinates Simplified flat
     *     coordinates.
     * @param {number} simplifiedOffset Simplified offset.
     * @return {number} Simplified offset.
     */
    function douglasPeucker(flatCoordinates, offset, end, stride, squaredTolerance, simplifiedFlatCoordinates, simplifiedOffset) {
        var n = (end - offset) / stride;
        if (n < 3) {
            for (; offset < end; offset += stride) {
                simplifiedFlatCoordinates[simplifiedOffset++] = flatCoordinates[offset];
                simplifiedFlatCoordinates[simplifiedOffset++] =
                    flatCoordinates[offset + 1];
            }
            return simplifiedOffset;
        }
        /** @type {Array<number>} */
        var markers = new Array(n);
        markers[0] = 1;
        markers[n - 1] = 1;
        /** @type {Array<number>} */
        var stack = [offset, end - stride];
        var index = 0;
        while (stack.length > 0) {
            var last = stack.pop();
            var first = stack.pop();
            var maxSquaredDistance = 0;
            var x1 = flatCoordinates[first];
            var y1 = flatCoordinates[first + 1];
            var x2 = flatCoordinates[last];
            var y2 = flatCoordinates[last + 1];
            for (var i = first + stride; i < last; i += stride) {
                var x = flatCoordinates[i];
                var y = flatCoordinates[i + 1];
                var squaredDistance_1 = squaredSegmentDistance(x, y, x1, y1, x2, y2);
                if (squaredDistance_1 > maxSquaredDistance) {
                    index = i;
                    maxSquaredDistance = squaredDistance_1;
                }
            }
            if (maxSquaredDistance > squaredTolerance) {
                markers[(index - offset) / stride] = 1;
                if (first + stride < index) {
                    stack.push(first, index);
                }
                if (index + stride < last) {
                    stack.push(index, last);
                }
            }
        }
        for (var i = 0; i < n; ++i) {
            if (markers[i]) {
                simplifiedFlatCoordinates[simplifiedOffset++] =
                    flatCoordinates[offset + i * stride];
                simplifiedFlatCoordinates[simplifiedOffset++] =
                    flatCoordinates[offset + i * stride + 1];
            }
        }
        return simplifiedOffset;
    }
    /**
     * @param {number} value Value.
     * @param {number} tolerance Tolerance.
     * @return {number} Rounded value.
     */
    function snap(value, tolerance) {
        return tolerance * Math.round(value / tolerance);
    }

    /**
     * @module ol/geom/flat/inflate
     */
    /**
     * @param {Array<number>} flatCoordinates Flat coordinates.
     * @param {number} offset Offset.
     * @param {number} end End.
     * @param {number} stride Stride.
     * @param {Array<import("../../coordinate.js").Coordinate>} [opt_coordinates] Coordinates.
     * @return {Array<import("../../coordinate.js").Coordinate>} Coordinates.
     */
    function inflateCoordinates(flatCoordinates, offset, end, stride, opt_coordinates) {
        var coordinates = opt_coordinates !== undefined ? opt_coordinates : [];
        var i = 0;
        for (var j = offset; j < end; j += stride) {
            coordinates[i++] = flatCoordinates.slice(j, j + stride);
        }
        coordinates.length = i;
        return coordinates;
    }
    /**
     * @param {Array<number>} flatCoordinates Flat coordinates.
     * @param {number} offset Offset.
     * @param {Array<number>} ends Ends.
     * @param {number} stride Stride.
     * @param {Array<Array<import("../../coordinate.js").Coordinate>>} [opt_coordinatess] Coordinatess.
     * @return {Array<Array<import("../../coordinate.js").Coordinate>>} Coordinatess.
     */
    function inflateCoordinatesArray(flatCoordinates, offset, ends, stride, opt_coordinatess) {
        var coordinatess = opt_coordinatess !== undefined ? opt_coordinatess : [];
        var i = 0;
        for (var j = 0, jj = ends.length; j < jj; ++j) {
            var end = ends[j];
            coordinatess[i++] = inflateCoordinates(flatCoordinates, offset, end, stride, coordinatess[i]);
            offset = end;
        }
        coordinatess.length = i;
        return coordinatess;
    }
    /**
     * @param {Array<number>} flatCoordinates Flat coordinates.
     * @param {number} offset Offset.
     * @param {Array<Array<number>>} endss Endss.
     * @param {number} stride Stride.
     * @param {Array<Array<Array<import("../../coordinate.js").Coordinate>>>} [opt_coordinatesss]
     *     Coordinatesss.
     * @return {Array<Array<Array<import("../../coordinate.js").Coordinate>>>} Coordinatesss.
     */
    function inflateMultiCoordinatesArray(flatCoordinates, offset, endss, stride, opt_coordinatesss) {
        var coordinatesss = opt_coordinatesss !== undefined ? opt_coordinatesss : [];
        var i = 0;
        for (var j = 0, jj = endss.length; j < jj; ++j) {
            var ends = endss[j];
            coordinatesss[i++] = inflateCoordinatesArray(flatCoordinates, offset, ends, stride, coordinatesss[i]);
            offset = ends[ends.length - 1];
        }
        coordinatesss.length = i;
        return coordinatesss;
    }

    /**
     * @module ol/geom/flat/segments
     */
    /**
     * This function calls `callback` for each segment of the flat coordinates
     * array. If the callback returns a truthy value the function returns that
     * value immediately. Otherwise the function returns `false`.
     * @param {Array<number>} flatCoordinates Flat coordinates.
     * @param {number} offset Offset.
     * @param {number} end End.
     * @param {number} stride Stride.
     * @param {function(import("../../coordinate.js").Coordinate, import("../../coordinate.js").Coordinate): T} callback Function
     *     called for each segment.
     * @return {T|boolean} Value.
     * @template T
     */
    function forEach(flatCoordinates, offset, end, stride, callback) {
        var ret;
        offset += stride;
        for (; offset < end; offset += stride) {
            ret = callback(flatCoordinates.slice(offset - stride, offset), flatCoordinates.slice(offset, offset + stride));
            if (ret) {
                return ret;
            }
        }
        return false;
    }

    /**
     * @module ol/geom/flat/intersectsextent
     */
    /**
     * @param {Array<number>} flatCoordinates Flat coordinates.
     * @param {number} offset Offset.
     * @param {number} end End.
     * @param {number} stride Stride.
     * @param {import("../../extent.js").Extent} extent Extent.
     * @return {boolean} True if the geometry and the extent intersect.
     */
    function intersectsLineString(flatCoordinates, offset, end, stride, extent) {
        var coordinatesExtent = extendFlatCoordinates(createEmpty(), flatCoordinates, offset, end, stride);
        if (!intersects$1(extent, coordinatesExtent)) {
            return false;
        }
        if (containsExtent(extent, coordinatesExtent)) {
            return true;
        }
        if (coordinatesExtent[0] >= extent[0] && coordinatesExtent[2] <= extent[2]) {
            return true;
        }
        if (coordinatesExtent[1] >= extent[1] && coordinatesExtent[3] <= extent[3]) {
            return true;
        }
        return forEach(flatCoordinates, offset, end, stride, 
        /**
         * @param {import("../../coordinate.js").Coordinate} point1 Start point.
         * @param {import("../../coordinate.js").Coordinate} point2 End point.
         * @return {boolean} `true` if the segment and the extent intersect,
         *     `false` otherwise.
         */
        function (point1, point2) {
            return intersectsSegment(extent, point1, point2);
        });
    }

    /**
     * @module ol/render/EventType
     */
    /**
     * @enum {string}
     */
    var RenderEventType = {
        /**
         * Triggered before a layer is rendered.
         * @event module:ol/render/Event~RenderEvent#prerender
         * @api
         */
        PRERENDER: 'prerender',
        /**
         * Triggered after a layer is rendered.
         * @event module:ol/render/Event~RenderEvent#postrender
         * @api
         */
        POSTRENDER: 'postrender',
        /**
         * Triggered before layers are composed.  When dispatched by the map, the event object will not have
         * a `context` set.  When dispatched by a layer, the event object will have a `context` set.  Only
         * WebGL layers currently dispatch this event.
         * @event module:ol/render/Event~RenderEvent#precompose
         * @api
         */
        PRECOMPOSE: 'precompose',
        /**
         * Triggered after layers are composed.  When dispatched by the map, the event object will not have
         * a `context` set.  When dispatched by a layer, the event object will have a `context` set.  Only
         * WebGL layers currently dispatch this event.
         * @event module:ol/render/Event~RenderEvent#postcompose
         * @api
         */
        POSTCOMPOSE: 'postcompose',
        /**
         * Triggered when rendering is complete, i.e. all sources and tiles have
         * finished loading for the current viewport, and all tiles are faded in.
         * The event object will not have a `context` set.
         * @event module:ol/render/Event~RenderEvent#rendercomplete
         * @api
         */
        RENDERCOMPLETE: 'rendercomplete',
    };
    /**
     * @typedef {'postrender'|'precompose'|'postcompose'|'rendercomplete'} MapRenderEventTypes
     */
    /**
     * @typedef {'postrender'|'prerender'} LayerRenderEventTypes
     */

    /**
     * @module ol/style/Fill
     */
    /**
     * @typedef {Object} Options
     * @property {import("../color.js").Color|import("../colorlike.js").ColorLike|null} [color=null] A color, gradient or pattern.
     * See {@link module:ol/color~Color} and {@link module:ol/colorlike~ColorLike} for possible formats.
     * Default null; if null, the Canvas/renderer default black will be used.
     */
    /**
     * @classdesc
     * Set fill style for vector features.
     * @api
     */
    var Fill = /** @class */ (function () {
        /**
         * @param {Options} [opt_options] Options.
         */
        function Fill(opt_options) {
            var options = opt_options || {};
            /**
             * @private
             * @type {import("../color.js").Color|import("../colorlike.js").ColorLike|null}
             */
            this.color_ = options.color !== undefined ? options.color : null;
        }
        /**
         * Clones the style. The color is not cloned if it is an {@link module:ol/colorlike~ColorLike}.
         * @return {Fill} The cloned style.
         * @api
         */
        Fill.prototype.clone = function () {
            var color = this.getColor();
            return new Fill({
                color: Array.isArray(color) ? color.slice() : color || undefined,
            });
        };
        /**
         * Get the fill color.
         * @return {import("../color.js").Color|import("../colorlike.js").ColorLike|null} Color.
         * @api
         */
        Fill.prototype.getColor = function () {
            return this.color_;
        };
        /**
         * Set the color.
         *
         * @param {import("../color.js").Color|import("../colorlike.js").ColorLike|null} color Color.
         * @api
         */
        Fill.prototype.setColor = function (color) {
            this.color_ = color;
        };
        return Fill;
    }());
    var Fill$1 = Fill;

    /**
     * @module ol/geom/flat/interpolate
     */
    /**
     * @param {Array<number>} flatCoordinates Flat coordinates.
     * @param {number} offset Offset.
     * @param {number} end End.
     * @param {number} stride Stride.
     * @param {number} fraction Fraction.
     * @param {Array<number>} [opt_dest] Destination.
     * @param {number} [opt_dimension] Destination dimension (default is `2`)
     * @return {Array<number>} Destination.
     */
    function interpolatePoint(flatCoordinates, offset, end, stride, fraction, opt_dest, opt_dimension) {
        var o, t;
        var n = (end - offset) / stride;
        if (n === 1) {
            o = offset;
        }
        else if (n === 2) {
            o = offset;
            t = fraction;
        }
        else if (n !== 0) {
            var x1 = flatCoordinates[offset];
            var y1 = flatCoordinates[offset + 1];
            var length_1 = 0;
            var cumulativeLengths = [0];
            for (var i = offset + stride; i < end; i += stride) {
                var x2 = flatCoordinates[i];
                var y2 = flatCoordinates[i + 1];
                length_1 += Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
                cumulativeLengths.push(length_1);
                x1 = x2;
                y1 = y2;
            }
            var target = fraction * length_1;
            var index = binarySearch(cumulativeLengths, target);
            if (index < 0) {
                t =
                    (target - cumulativeLengths[-index - 2]) /
                        (cumulativeLengths[-index - 1] - cumulativeLengths[-index - 2]);
                o = offset + (-index - 2) * stride;
            }
            else {
                o = offset + index * stride;
            }
        }
        var dimension = opt_dimension > 1 ? opt_dimension : 2;
        var dest = opt_dest ? opt_dest : new Array(dimension);
        for (var i = 0; i < dimension; ++i) {
            dest[i] =
                o === undefined
                    ? NaN
                    : t === undefined
                        ? flatCoordinates[o + i]
                        : lerp(flatCoordinates[o + i], flatCoordinates[o + stride + i], t);
        }
        return dest;
    }
    /**
     * @param {Array<number>} flatCoordinates Flat coordinates.
     * @param {number} offset Offset.
     * @param {number} end End.
     * @param {number} stride Stride.
     * @param {number} m M.
     * @param {boolean} extrapolate Extrapolate.
     * @return {import("../../coordinate.js").Coordinate|null} Coordinate.
     */
    function lineStringCoordinateAtM(flatCoordinates, offset, end, stride, m, extrapolate) {
        if (end == offset) {
            return null;
        }
        var coordinate;
        if (m < flatCoordinates[offset + stride - 1]) {
            if (extrapolate) {
                coordinate = flatCoordinates.slice(offset, offset + stride);
                coordinate[stride - 1] = m;
                return coordinate;
            }
            else {
                return null;
            }
        }
        else if (flatCoordinates[end - 1] < m) {
            if (extrapolate) {
                coordinate = flatCoordinates.slice(end - stride, end);
                coordinate[stride - 1] = m;
                return coordinate;
            }
            else {
                return null;
            }
        }
        // FIXME use O(1) search
        if (m == flatCoordinates[offset + stride - 1]) {
            return flatCoordinates.slice(offset, offset + stride);
        }
        var lo = offset / stride;
        var hi = end / stride;
        while (lo < hi) {
            var mid = (lo + hi) >> 1;
            if (m < flatCoordinates[(mid + 1) * stride - 1]) {
                hi = mid;
            }
            else {
                lo = mid + 1;
            }
        }
        var m0 = flatCoordinates[lo * stride - 1];
        if (m == m0) {
            return flatCoordinates.slice((lo - 1) * stride, (lo - 1) * stride + stride);
        }
        var m1 = flatCoordinates[(lo + 1) * stride - 1];
        var t = (m - m0) / (m1 - m0);
        coordinate = [];
        for (var i = 0; i < stride - 1; ++i) {
            coordinate.push(lerp(flatCoordinates[(lo - 1) * stride + i], flatCoordinates[lo * stride + i], t));
        }
        coordinate.push(m);
        return coordinate;
    }

    /**
     * @module ol/geom/flat/length
     */
    /**
     * @param {Array<number>} flatCoordinates Flat coordinates.
     * @param {number} offset Offset.
     * @param {number} end End.
     * @param {number} stride Stride.
     * @return {number} Length.
     */
    function lineStringLength(flatCoordinates, offset, end, stride) {
        var x1 = flatCoordinates[offset];
        var y1 = flatCoordinates[offset + 1];
        var length = 0;
        for (var i = offset + stride; i < end; i += stride) {
            var x2 = flatCoordinates[i];
            var y2 = flatCoordinates[i + 1];
            length += Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
            x1 = x2;
            y1 = y2;
        }
        return length;
    }

    var __extends$o = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            if (typeof b !== "function" && b !== null)
                throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * @classdesc
     * Linestring geometry.
     *
     * @api
     */
    var LineString = /** @class */ (function (_super) {
        __extends$o(LineString, _super);
        /**
         * @param {Array<import("../coordinate.js").Coordinate>|Array<number>} coordinates Coordinates.
         *     For internal use, flat coordinates in combination with `opt_layout` are also accepted.
         * @param {import("./GeometryLayout.js").default} [opt_layout] Layout.
         */
        function LineString(coordinates, opt_layout) {
            var _this = _super.call(this) || this;
            /**
             * @private
             * @type {import("../coordinate.js").Coordinate}
             */
            _this.flatMidpoint_ = null;
            /**
             * @private
             * @type {number}
             */
            _this.flatMidpointRevision_ = -1;
            /**
             * @private
             * @type {number}
             */
            _this.maxDelta_ = -1;
            /**
             * @private
             * @type {number}
             */
            _this.maxDeltaRevision_ = -1;
            if (opt_layout !== undefined && !Array.isArray(coordinates[0])) {
                _this.setFlatCoordinates(opt_layout, 
                /** @type {Array<number>} */ (coordinates));
            }
            else {
                _this.setCoordinates(
                /** @type {Array<import("../coordinate.js").Coordinate>} */ (coordinates), opt_layout);
            }
            return _this;
        }
        /**
         * Append the passed coordinate to the coordinates of the linestring.
         * @param {import("../coordinate.js").Coordinate} coordinate Coordinate.
         * @api
         */
        LineString.prototype.appendCoordinate = function (coordinate) {
            if (!this.flatCoordinates) {
                this.flatCoordinates = coordinate.slice();
            }
            else {
                extend$1(this.flatCoordinates, coordinate);
            }
            this.changed();
        };
        /**
         * Make a complete copy of the geometry.
         * @return {!LineString} Clone.
         * @api
         */
        LineString.prototype.clone = function () {
            var lineString = new LineString(this.flatCoordinates.slice(), this.layout);
            lineString.applyProperties(this);
            return lineString;
        };
        /**
         * @param {number} x X.
         * @param {number} y Y.
         * @param {import("../coordinate.js").Coordinate} closestPoint Closest point.
         * @param {number} minSquaredDistance Minimum squared distance.
         * @return {number} Minimum squared distance.
         */
        LineString.prototype.closestPointXY = function (x, y, closestPoint, minSquaredDistance) {
            if (minSquaredDistance < closestSquaredDistanceXY(this.getExtent(), x, y)) {
                return minSquaredDistance;
            }
            if (this.maxDeltaRevision_ != this.getRevision()) {
                this.maxDelta_ = Math.sqrt(maxSquaredDelta(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, 0));
                this.maxDeltaRevision_ = this.getRevision();
            }
            return assignClosestPoint(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, this.maxDelta_, false, x, y, closestPoint, minSquaredDistance);
        };
        /**
         * Iterate over each segment, calling the provided callback.
         * If the callback returns a truthy value the function returns that
         * value immediately. Otherwise the function returns `false`.
         *
         * @param {function(this: S, import("../coordinate.js").Coordinate, import("../coordinate.js").Coordinate): T} callback Function
         *     called for each segment. The function will receive two arguments, the start and end coordinates of the segment.
         * @return {T|boolean} Value.
         * @template T,S
         * @api
         */
        LineString.prototype.forEachSegment = function (callback) {
            return forEach(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, callback);
        };
        /**
         * Returns the coordinate at `m` using linear interpolation, or `null` if no
         * such coordinate exists.
         *
         * `opt_extrapolate` controls extrapolation beyond the range of Ms in the
         * MultiLineString. If `opt_extrapolate` is `true` then Ms less than the first
         * M will return the first coordinate and Ms greater than the last M will
         * return the last coordinate.
         *
         * @param {number} m M.
         * @param {boolean} [opt_extrapolate] Extrapolate. Default is `false`.
         * @return {import("../coordinate.js").Coordinate|null} Coordinate.
         * @api
         */
        LineString.prototype.getCoordinateAtM = function (m, opt_extrapolate) {
            if (this.layout != GeometryLayout.XYM &&
                this.layout != GeometryLayout.XYZM) {
                return null;
            }
            var extrapolate = opt_extrapolate !== undefined ? opt_extrapolate : false;
            return lineStringCoordinateAtM(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, m, extrapolate);
        };
        /**
         * Return the coordinates of the linestring.
         * @return {Array<import("../coordinate.js").Coordinate>} Coordinates.
         * @api
         */
        LineString.prototype.getCoordinates = function () {
            return inflateCoordinates(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride);
        };
        /**
         * Return the coordinate at the provided fraction along the linestring.
         * The `fraction` is a number between 0 and 1, where 0 is the start of the
         * linestring and 1 is the end.
         * @param {number} fraction Fraction.
         * @param {import("../coordinate.js").Coordinate} [opt_dest] Optional coordinate whose values will
         *     be modified. If not provided, a new coordinate will be returned.
         * @return {import("../coordinate.js").Coordinate} Coordinate of the interpolated point.
         * @api
         */
        LineString.prototype.getCoordinateAt = function (fraction, opt_dest) {
            return interpolatePoint(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, fraction, opt_dest, this.stride);
        };
        /**
         * Return the length of the linestring on projected plane.
         * @return {number} Length (on projected plane).
         * @api
         */
        LineString.prototype.getLength = function () {
            return lineStringLength(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride);
        };
        /**
         * @return {Array<number>} Flat midpoint.
         */
        LineString.prototype.getFlatMidpoint = function () {
            if (this.flatMidpointRevision_ != this.getRevision()) {
                this.flatMidpoint_ = this.getCoordinateAt(0.5, this.flatMidpoint_);
                this.flatMidpointRevision_ = this.getRevision();
            }
            return this.flatMidpoint_;
        };
        /**
         * @param {number} squaredTolerance Squared tolerance.
         * @return {LineString} Simplified LineString.
         * @protected
         */
        LineString.prototype.getSimplifiedGeometryInternal = function (squaredTolerance) {
            var simplifiedFlatCoordinates = [];
            simplifiedFlatCoordinates.length = douglasPeucker(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, squaredTolerance, simplifiedFlatCoordinates, 0);
            return new LineString(simplifiedFlatCoordinates, GeometryLayout.XY);
        };
        /**
         * Get the type of this geometry.
         * @return {import("./Geometry.js").Type} Geometry type.
         * @api
         */
        LineString.prototype.getType = function () {
            return 'LineString';
        };
        /**
         * Test if the geometry and the passed extent intersect.
         * @param {import("../extent.js").Extent} extent Extent.
         * @return {boolean} `true` if the geometry and the extent intersect.
         * @api
         */
        LineString.prototype.intersectsExtent = function (extent) {
            return intersectsLineString(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, extent);
        };
        /**
         * Set the coordinates of the linestring.
         * @param {!Array<import("../coordinate.js").Coordinate>} coordinates Coordinates.
         * @param {import("./GeometryLayout.js").default} [opt_layout] Layout.
         * @api
         */
        LineString.prototype.setCoordinates = function (coordinates, opt_layout) {
            this.setLayout(opt_layout, coordinates, 1);
            if (!this.flatCoordinates) {
                this.flatCoordinates = [];
            }
            this.flatCoordinates.length = deflateCoordinates(this.flatCoordinates, 0, coordinates, this.stride);
            this.changed();
        };
        return LineString;
    }(SimpleGeometry$1));
    var LineString$1 = LineString;

    /**
     * @module ol/style/Stroke
     */
    /**
     * @typedef {Object} Options
     * @property {import("../color.js").Color|import("../colorlike.js").ColorLike} [color] A color, gradient or pattern.
     * See {@link module:ol/color~Color} and {@link module:ol/colorlike~ColorLike} for possible formats.
     * Default null; if null, the Canvas/renderer default black will be used.
     * @property {CanvasLineCap} [lineCap='round'] Line cap style: `butt`, `round`, or `square`.
     * @property {CanvasLineJoin} [lineJoin='round'] Line join style: `bevel`, `round`, or `miter`.
     * @property {Array<number>} [lineDash] Line dash pattern. Default is `null` (no dash).
     * Please note that Internet Explorer 10 and lower do not support the `setLineDash` method on
     * the `CanvasRenderingContext2D` and therefore this option will have no visual effect in these browsers.
     * @property {number} [lineDashOffset=0] Line dash offset.
     * @property {number} [miterLimit=10] Miter limit.
     * @property {number} [width] Width.
     */
    /**
     * @classdesc
     * Set stroke style for vector features.
     * Note that the defaults given are the Canvas defaults, which will be used if
     * option is not defined. The `get` functions return whatever was entered in
     * the options; they will not return the default.
     * @api
     */
    var Stroke = /** @class */ (function () {
        /**
         * @param {Options} [opt_options] Options.
         */
        function Stroke(opt_options) {
            var options = opt_options || {};
            /**
             * @private
             * @type {import("../color.js").Color|import("../colorlike.js").ColorLike}
             */
            this.color_ = options.color !== undefined ? options.color : null;
            /**
             * @private
             * @type {CanvasLineCap|undefined}
             */
            this.lineCap_ = options.lineCap;
            /**
             * @private
             * @type {Array<number>}
             */
            this.lineDash_ = options.lineDash !== undefined ? options.lineDash : null;
            /**
             * @private
             * @type {number|undefined}
             */
            this.lineDashOffset_ = options.lineDashOffset;
            /**
             * @private
             * @type {CanvasLineJoin|undefined}
             */
            this.lineJoin_ = options.lineJoin;
            /**
             * @private
             * @type {number|undefined}
             */
            this.miterLimit_ = options.miterLimit;
            /**
             * @private
             * @type {number|undefined}
             */
            this.width_ = options.width;
        }
        /**
         * Clones the style.
         * @return {Stroke} The cloned style.
         * @api
         */
        Stroke.prototype.clone = function () {
            var color = this.getColor();
            return new Stroke({
                color: Array.isArray(color) ? color.slice() : color || undefined,
                lineCap: this.getLineCap(),
                lineDash: this.getLineDash() ? this.getLineDash().slice() : undefined,
                lineDashOffset: this.getLineDashOffset(),
                lineJoin: this.getLineJoin(),
                miterLimit: this.getMiterLimit(),
                width: this.getWidth(),
            });
        };
        /**
         * Get the stroke color.
         * @return {import("../color.js").Color|import("../colorlike.js").ColorLike} Color.
         * @api
         */
        Stroke.prototype.getColor = function () {
            return this.color_;
        };
        /**
         * Get the line cap type for the stroke.
         * @return {CanvasLineCap|undefined} Line cap.
         * @api
         */
        Stroke.prototype.getLineCap = function () {
            return this.lineCap_;
        };
        /**
         * Get the line dash style for the stroke.
         * @return {Array<number>} Line dash.
         * @api
         */
        Stroke.prototype.getLineDash = function () {
            return this.lineDash_;
        };
        /**
         * Get the line dash offset for the stroke.
         * @return {number|undefined} Line dash offset.
         * @api
         */
        Stroke.prototype.getLineDashOffset = function () {
            return this.lineDashOffset_;
        };
        /**
         * Get the line join type for the stroke.
         * @return {CanvasLineJoin|undefined} Line join.
         * @api
         */
        Stroke.prototype.getLineJoin = function () {
            return this.lineJoin_;
        };
        /**
         * Get the miter limit for the stroke.
         * @return {number|undefined} Miter limit.
         * @api
         */
        Stroke.prototype.getMiterLimit = function () {
            return this.miterLimit_;
        };
        /**
         * Get the stroke width.
         * @return {number|undefined} Width.
         * @api
         */
        Stroke.prototype.getWidth = function () {
            return this.width_;
        };
        /**
         * Set the color.
         *
         * @param {import("../color.js").Color|import("../colorlike.js").ColorLike} color Color.
         * @api
         */
        Stroke.prototype.setColor = function (color) {
            this.color_ = color;
        };
        /**
         * Set the line cap.
         *
         * @param {CanvasLineCap|undefined} lineCap Line cap.
         * @api
         */
        Stroke.prototype.setLineCap = function (lineCap) {
            this.lineCap_ = lineCap;
        };
        /**
         * Set the line dash.
         *
         * Please note that Internet Explorer 10 and lower [do not support][mdn] the
         * `setLineDash` method on the `CanvasRenderingContext2D` and therefore this
         * property will have no visual effect in these browsers.
         *
         * [mdn]: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setLineDash#Browser_compatibility
         *
         * @param {Array<number>} lineDash Line dash.
         * @api
         */
        Stroke.prototype.setLineDash = function (lineDash) {
            this.lineDash_ = lineDash;
        };
        /**
         * Set the line dash offset.
         *
         * @param {number|undefined} lineDashOffset Line dash offset.
         * @api
         */
        Stroke.prototype.setLineDashOffset = function (lineDashOffset) {
            this.lineDashOffset_ = lineDashOffset;
        };
        /**
         * Set the line join.
         *
         * @param {CanvasLineJoin|undefined} lineJoin Line join.
         * @api
         */
        Stroke.prototype.setLineJoin = function (lineJoin) {
            this.lineJoin_ = lineJoin;
        };
        /**
         * Set the miter limit.
         *
         * @param {number|undefined} miterLimit Miter limit.
         * @api
         */
        Stroke.prototype.setMiterLimit = function (miterLimit) {
            this.miterLimit_ = miterLimit;
        };
        /**
         * Set the width.
         *
         * @param {number|undefined} width Width.
         * @api
         */
        Stroke.prototype.setWidth = function (width) {
            this.width_ = width;
        };
        return Stroke;
    }());
    var Stroke$1 = Stroke;

    /**
     * @module ol/ImageState
     */
    /**
     * @enum {number}
     */
    var ImageState = {
        IDLE: 0,
        LOADING: 1,
        LOADED: 2,
        ERROR: 3,
        EMPTY: 4,
    };

    /**
     * @module ol/size
     */
    /**
     * An array of numbers representing a size: `[width, height]`.
     * @typedef {Array<number>} Size
     * @api
     */
    /**
     * Returns a buffered size.
     * @param {Size} size Size.
     * @param {number} num The amount by which to buffer.
     * @param {Size} [opt_size] Optional reusable size array.
     * @return {Size} The buffered size.
     */
    /**
     * Returns an `Size` array for the passed in number (meaning: square) or
     * `Size` array.
     * (meaning: non-square),
     * @param {number|Size} size Width and height.
     * @param {Size} [opt_size] Optional reusable size array.
     * @return {Size} Size.
     * @api
     */
    function toSize(size, opt_size) {
        if (Array.isArray(size)) {
            return size;
        }
        else {
            if (opt_size === undefined) {
                opt_size = [size, size];
            }
            else {
                opt_size[0] = size;
                opt_size[1] = size;
            }
            return opt_size;
        }
    }

    /**
     * @module ol/style/Image
     */
    /**
     * @typedef {Object} Options
     * @property {number} opacity Opacity.
     * @property {boolean} rotateWithView If the image should get rotated with the view.
     * @property {number} rotation Rotation.
     * @property {number|import("../size.js").Size} scale Scale.
     * @property {Array<number>} displacement Displacement.
     * @property {"declutter"|"obstacle"|"none"|undefined} declutterMode Declutter mode: `declutter`, `obstacle`, 'none */
    /**
     * @classdesc
     * A base class used for creating subclasses and not instantiated in
     * apps. Base class for {@link module:ol/style/Icon~Icon}, {@link module:ol/style/Circle~CircleStyle} and
     * {@link module:ol/style/RegularShape~RegularShape}.
     * @abstract
     * @api
     */
    var ImageStyle = /** @class */ (function () {
        /**
         * @param {Options} options Options.
         */
        function ImageStyle(options) {
            /**
             * @private
             * @type {number}
             */
            this.opacity_ = options.opacity;
            /**
             * @private
             * @type {boolean}
             */
            this.rotateWithView_ = options.rotateWithView;
            /**
             * @private
             * @type {number}
             */
            this.rotation_ = options.rotation;
            /**
             * @private
             * @type {number|import("../size.js").Size}
             */
            this.scale_ = options.scale;
            /**
             * @private
             * @type {import("../size.js").Size}
             */
            this.scaleArray_ = toSize(options.scale);
            /**
             * @private
             * @type {Array<number>}
             */
            this.displacement_ = options.displacement;
            /**
             * @private
             * @type {"declutter"|"obstacle"|"none"|undefined}
             */
            this.declutterMode_ = options.declutterMode;
        }
        /**
         * Clones the style.
         * @return {ImageStyle} The cloned style.
         * @api
         */
        ImageStyle.prototype.clone = function () {
            var scale = this.getScale();
            return new ImageStyle({
                opacity: this.getOpacity(),
                scale: Array.isArray(scale) ? scale.slice() : scale,
                rotation: this.getRotation(),
                rotateWithView: this.getRotateWithView(),
                displacement: this.getDisplacement().slice(),
                declutterMode: this.getDeclutterMode(),
            });
        };
        /**
         * Get the symbolizer opacity.
         * @return {number} Opacity.
         * @api
         */
        ImageStyle.prototype.getOpacity = function () {
            return this.opacity_;
        };
        /**
         * Determine whether the symbolizer rotates with the map.
         * @return {boolean} Rotate with map.
         * @api
         */
        ImageStyle.prototype.getRotateWithView = function () {
            return this.rotateWithView_;
        };
        /**
         * Get the symoblizer rotation.
         * @return {number} Rotation.
         * @api
         */
        ImageStyle.prototype.getRotation = function () {
            return this.rotation_;
        };
        /**
         * Get the symbolizer scale.
         * @return {number|import("../size.js").Size} Scale.
         * @api
         */
        ImageStyle.prototype.getScale = function () {
            return this.scale_;
        };
        /**
         * Get the symbolizer scale array.
         * @return {import("../size.js").Size} Scale array.
         */
        ImageStyle.prototype.getScaleArray = function () {
            return this.scaleArray_;
        };
        /**
         * Get the displacement of the shape
         * @return {Array<number>} Shape's center displacement
         * @api
         */
        ImageStyle.prototype.getDisplacement = function () {
            return this.displacement_;
        };
        /**
         * Get the declutter mode of the shape
         * @return {"declutter"|"obstacle"|"none"|undefined} Shape's declutter mode
         * @api
         */
        ImageStyle.prototype.getDeclutterMode = function () {
            return this.declutterMode_;
        };
        /**
         * Get the anchor point in pixels. The anchor determines the center point for the
         * symbolizer.
         * @abstract
         * @return {Array<number>} Anchor.
         */
        ImageStyle.prototype.getAnchor = function () {
            return abstract();
        };
        /**
         * Get the image element for the symbolizer.
         * @abstract
         * @param {number} pixelRatio Pixel ratio.
         * @return {HTMLCanvasElement|HTMLVideoElement|HTMLImageElement} Image element.
         */
        ImageStyle.prototype.getImage = function (pixelRatio) {
            return abstract();
        };
        /**
         * @abstract
         * @return {HTMLCanvasElement|HTMLVideoElement|HTMLImageElement} Image element.
         */
        ImageStyle.prototype.getHitDetectionImage = function () {
            return abstract();
        };
        /**
         * Get the image pixel ratio.
         * @param {number} pixelRatio Pixel ratio.
         * @return {number} Pixel ratio.
         */
        ImageStyle.prototype.getPixelRatio = function (pixelRatio) {
            return 1;
        };
        /**
         * @abstract
         * @return {import("../ImageState.js").default} Image state.
         */
        ImageStyle.prototype.getImageState = function () {
            return abstract();
        };
        /**
         * @abstract
         * @return {import("../size.js").Size} Image size.
         */
        ImageStyle.prototype.getImageSize = function () {
            return abstract();
        };
        /**
         * Get the origin of the symbolizer.
         * @abstract
         * @return {Array<number>} Origin.
         */
        ImageStyle.prototype.getOrigin = function () {
            return abstract();
        };
        /**
         * Get the size of the symbolizer (in pixels).
         * @abstract
         * @return {import("../size.js").Size} Size.
         */
        ImageStyle.prototype.getSize = function () {
            return abstract();
        };
        /**
         * Set the displacement.
         *
         * @param {Array<number>} displacement Displacement.
         * @api
         */
        ImageStyle.prototype.setDisplacement = function (displacement) {
            this.displacement_ = displacement;
        };
        /**
         * Set the opacity.
         *
         * @param {number} opacity Opacity.
         * @api
         */
        ImageStyle.prototype.setOpacity = function (opacity) {
            this.opacity_ = opacity;
        };
        /**
         * Set whether to rotate the style with the view.
         *
         * @param {boolean} rotateWithView Rotate with map.
         * @api
         */
        ImageStyle.prototype.setRotateWithView = function (rotateWithView) {
            this.rotateWithView_ = rotateWithView;
        };
        /**
         * Set the rotation.
         *
         * @param {number} rotation Rotation.
         * @api
         */
        ImageStyle.prototype.setRotation = function (rotation) {
            this.rotation_ = rotation;
        };
        /**
         * Set the scale.
         *
         * @param {number|import("../size.js").Size} scale Scale.
         * @api
         */
        ImageStyle.prototype.setScale = function (scale) {
            this.scale_ = scale;
            this.scaleArray_ = toSize(scale);
        };
        /**
         * @abstract
         * @param {function(import("../events/Event.js").default): void} listener Listener function.
         */
        ImageStyle.prototype.listenImageChange = function (listener) {
            abstract();
        };
        /**
         * Load not yet loaded URI.
         * @abstract
         */
        ImageStyle.prototype.load = function () {
            abstract();
        };
        /**
         * @abstract
         * @param {function(import("../events/Event.js").default): void} listener Listener function.
         */
        ImageStyle.prototype.unlistenImageChange = function (listener) {
            abstract();
        };
        return ImageStyle;
    }());
    var ImageStyle$1 = ImageStyle;

    /**
     * @module ol/color
     */
    /**
     * A color represented as a short array [red, green, blue, alpha].
     * red, green, and blue should be integers in the range 0..255 inclusive.
     * alpha should be a float in the range 0..1 inclusive. If no alpha value is
     * given then `1` will be used.
     * @typedef {Array<number>} Color
     * @api
     */
    /**
     * This RegExp matches # followed by 3, 4, 6, or 8 hex digits.
     * @const
     * @type {RegExp}
     * @private
     */
    var HEX_COLOR_RE_ = /^#([a-f0-9]{3}|[a-f0-9]{4}(?:[a-f0-9]{2}){0,2})$/i;
    /**
     * Regular expression for matching potential named color style strings.
     * @const
     * @type {RegExp}
     * @private
     */
    var NAMED_COLOR_RE_ = /^([a-z]*)$|^hsla?\(.*\)$/i;
    /**
     * Return the color as an rgba string.
     * @param {Color|string} color Color.
     * @return {string} Rgba string.
     * @api
     */
    function asString(color) {
        if (typeof color === 'string') {
            return color;
        }
        else {
            return toString(color);
        }
    }
    /**
     * Return named color as an rgba string.
     * @param {string} color Named color.
     * @return {string} Rgb string.
     */
    function fromNamed(color) {
        var el = document.createElement('div');
        el.style.color = color;
        if (el.style.color !== '') {
            document.body.appendChild(el);
            var rgb = getComputedStyle(el).color;
            document.body.removeChild(el);
            return rgb;
        }
        else {
            return '';
        }
    }
    /**
     * @param {string} s String.
     * @return {Color} Color.
     */
    var fromString = (function () {
        // We maintain a small cache of parsed strings.  To provide cheap LRU-like
        // semantics, whenever the cache grows too large we simply delete an
        // arbitrary 25% of the entries.
        /**
         * @const
         * @type {number}
         */
        var MAX_CACHE_SIZE = 1024;
        /**
         * @type {Object<string, Color>}
         */
        var cache = {};
        /**
         * @type {number}
         */
        var cacheSize = 0;
        return (
        /**
         * @param {string} s String.
         * @return {Color} Color.
         */
        function (s) {
            var color;
            if (cache.hasOwnProperty(s)) {
                color = cache[s];
            }
            else {
                if (cacheSize >= MAX_CACHE_SIZE) {
                    var i = 0;
                    for (var key in cache) {
                        if ((i++ & 3) === 0) {
                            delete cache[key];
                            --cacheSize;
                        }
                    }
                }
                color = fromStringInternal_(s);
                cache[s] = color;
                ++cacheSize;
            }
            return color;
        });
    })();
    /**
     * Return the color as an array. This function maintains a cache of calculated
     * arrays which means the result should not be modified.
     * @param {Color|string} color Color.
     * @return {Color} Color.
     * @api
     */
    function asArray(color) {
        if (Array.isArray(color)) {
            return color;
        }
        else {
            return fromString(color);
        }
    }
    /**
     * @param {string} s String.
     * @private
     * @return {Color} Color.
     */
    function fromStringInternal_(s) {
        var r, g, b, a, color;
        if (NAMED_COLOR_RE_.exec(s)) {
            s = fromNamed(s);
        }
        if (HEX_COLOR_RE_.exec(s)) {
            // hex
            var n = s.length - 1; // number of hex digits
            var d = // number of digits per channel
             void 0; // number of digits per channel
            if (n <= 4) {
                d = 1;
            }
            else {
                d = 2;
            }
            var hasAlpha = n === 4 || n === 8;
            r = parseInt(s.substr(1 + 0 * d, d), 16);
            g = parseInt(s.substr(1 + 1 * d, d), 16);
            b = parseInt(s.substr(1 + 2 * d, d), 16);
            if (hasAlpha) {
                a = parseInt(s.substr(1 + 3 * d, d), 16);
            }
            else {
                a = 255;
            }
            if (d == 1) {
                r = (r << 4) + r;
                g = (g << 4) + g;
                b = (b << 4) + b;
                if (hasAlpha) {
                    a = (a << 4) + a;
                }
            }
            color = [r, g, b, a / 255];
        }
        else if (s.indexOf('rgba(') == 0) {
            // rgba()
            color = s.slice(5, -1).split(',').map(Number);
            normalize(color);
        }
        else if (s.indexOf('rgb(') == 0) {
            // rgb()
            color = s.slice(4, -1).split(',').map(Number);
            color.push(1);
            normalize(color);
        }
        else {
            assert(false, 14); // Invalid color
        }
        return color;
    }
    /**
     * TODO this function is only used in the test, we probably shouldn't export it
     * @param {Color} color Color.
     * @return {Color} Clamped color.
     */
    function normalize(color) {
        color[0] = clamp((color[0] + 0.5) | 0, 0, 255);
        color[1] = clamp((color[1] + 0.5) | 0, 0, 255);
        color[2] = clamp((color[2] + 0.5) | 0, 0, 255);
        color[3] = clamp(color[3], 0, 1);
        return color;
    }
    /**
     * @param {Color} color Color.
     * @return {string} String.
     */
    function toString(color) {
        var r = color[0];
        if (r != (r | 0)) {
            r = (r + 0.5) | 0;
        }
        var g = color[1];
        if (g != (g | 0)) {
            g = (g + 0.5) | 0;
        }
        var b = color[2];
        if (b != (b | 0)) {
            b = (b + 0.5) | 0;
        }
        var a = color[3] === undefined ? 1 : Math.round(color[3] * 100) / 100;
        return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
    }

    /**
     * @module ol/colorlike
     */
    /**
     * A type accepted by CanvasRenderingContext2D.fillStyle
     * or CanvasRenderingContext2D.strokeStyle.
     * Represents a color, pattern, or gradient. The origin for patterns and
     * gradients as fill style is an increment of 512 css pixels from map coordinate
     * `[0, 0]`. For seamless repeat patterns, width and height of the pattern image
     * must be a factor of two (2, 4, 8, ..., 512).
     *
     * @typedef {string|CanvasPattern|CanvasGradient} ColorLike
     * @api
     */
    /**
     * @param {import("./color.js").Color|ColorLike} color Color.
     * @return {ColorLike} The color as an {@link ol/colorlike~ColorLike}.
     * @api
     */
    function asColorLike(color) {
        if (Array.isArray(color)) {
            return toString(color);
        }
        else {
            return color;
        }
    }

    /**
     * @module ol/dom
     */
    //FIXME Move this function to the canvas module
    /**
     * Create an html canvas element and returns its 2d context.
     * @param {number} [opt_width] Canvas width.
     * @param {number} [opt_height] Canvas height.
     * @param {Array<HTMLCanvasElement>} [opt_canvasPool] Canvas pool to take existing canvas from.
     * @param {CanvasRenderingContext2DSettings} [opt_Context2DSettings] CanvasRenderingContext2DSettings
     * @return {CanvasRenderingContext2D} The context.
     */
    function createCanvasContext2D(opt_width, opt_height, opt_canvasPool, opt_Context2DSettings) {
        /** @type {HTMLCanvasElement|OffscreenCanvas} */
        var canvas;
        if (opt_canvasPool && opt_canvasPool.length) {
            canvas = opt_canvasPool.shift();
        }
        else if (WORKER_OFFSCREEN_CANVAS) {
            canvas = new OffscreenCanvas(opt_width || 300, opt_height || 300);
        }
        else {
            canvas = document.createElement('canvas');
        }
        if (opt_width) {
            canvas.width = opt_width;
        }
        if (opt_height) {
            canvas.height = opt_height;
        }
        //FIXME Allow OffscreenCanvasRenderingContext2D as return type
        return /** @type {CanvasRenderingContext2D} */ (canvas.getContext('2d', opt_Context2DSettings));
    }
    /**
     * Releases canvas memory to avoid exceeding memory limits in Safari.
     * See https://pqina.nl/blog/total-canvas-memory-use-exceeds-the-maximum-limit/
     * @param {CanvasRenderingContext2D} context Context.
     */
    function releaseCanvas(context) {
        var canvas = context.canvas;
        canvas.width = 1;
        canvas.height = 1;
        context.clearRect(0, 0, 1, 1);
    }
    /**
     * Get the current computed width for the given element including margin,
     * padding and border.
     * Equivalent to jQuery's `$(el).outerWidth(true)`.
     * @param {!HTMLElement} element Element.
     * @return {number} The width.
     */
    function outerWidth(element) {
        var width = element.offsetWidth;
        var style = getComputedStyle(element);
        width += parseInt(style.marginLeft, 10) + parseInt(style.marginRight, 10);
        return width;
    }
    /**
     * Get the current computed height for the given element including margin,
     * padding and border.
     * Equivalent to jQuery's `$(el).outerHeight(true)`.
     * @param {!HTMLElement} element Element.
     * @return {number} The height.
     */
    function outerHeight(element) {
        var height = element.offsetHeight;
        var style = getComputedStyle(element);
        height += parseInt(style.marginTop, 10) + parseInt(style.marginBottom, 10);
        return height;
    }
    /**
     * @param {Node} node The node to remove.
     * @return {Node|null} The node that was removed or null.
     */
    function removeNode(node) {
        return node && node.parentNode ? node.parentNode.removeChild(node) : null;
    }
    /**
     * @param {Node} node The node to remove the children from.
     */
    function removeChildren(node) {
        while (node.lastChild) {
            node.removeChild(node.lastChild);
        }
    }

    /**
     * @module ol/css
     */
    /**
     * @typedef {Object} FontParameters
     * @property {string} style Style.
     * @property {string} variant Variant.
     * @property {string} weight Weight.
     * @property {string} size Size.
     * @property {string} lineHeight LineHeight.
     * @property {string} family Family.
     * @property {Array<string>} families Families.
     */
    /**
     * The CSS class for hidden feature.
     *
     * @const
     * @type {string}
     */
    /**
     * The CSS class that we'll give the DOM elements to have them selectable.
     *
     * @const
     * @type {string}
     */
    var CLASS_SELECTABLE = 'ol-selectable';
    /**
     * The CSS class that we'll give the DOM elements to have them unselectable.
     *
     * @const
     * @type {string}
     */
    var CLASS_UNSELECTABLE = 'ol-unselectable';
    /**
     * The CSS class for controls.
     *
     * @const
     * @type {string}
     */
    var CLASS_CONTROL = 'ol-control';
    /**
     * From https://stackoverflow.com/questions/10135697/regex-to-parse-any-css-font
     * @type {RegExp}
     */
    var fontRegEx = new RegExp([
        '^\\s*(?=(?:(?:[-a-z]+\\s*){0,2}(italic|oblique))?)',
        '(?=(?:(?:[-a-z]+\\s*){0,2}(small-caps))?)',
        '(?=(?:(?:[-a-z]+\\s*){0,2}(bold(?:er)?|lighter|[1-9]00 ))?)',
        '(?:(?:normal|\\1|\\2|\\3)\\s*){0,3}((?:xx?-)?',
        '(?:small|large)|medium|smaller|larger|[\\.\\d]+(?:\\%|in|[cem]m|ex|p[ctx]))',
        '(?:\\s*\\/\\s*(normal|[\\.\\d]+(?:\\%|in|[cem]m|ex|p[ctx])?))',
        '?\\s*([-,\\"\\\'\\sa-z]+?)\\s*$',
    ].join(''), 'i');
    var fontRegExMatchIndex = [
        'style',
        'variant',
        'weight',
        'size',
        'lineHeight',
        'family',
    ];
    /**
     * Get the list of font families from a font spec.  Note that this doesn't work
     * for font families that have commas in them.
     * @param {string} fontSpec The CSS font property.
     * @return {FontParameters|null} The font parameters (or null if the input spec is invalid).
     */
    var getFontParameters = function (fontSpec) {
        var match = fontSpec.match(fontRegEx);
        if (!match) {
            return null;
        }
        var style = /** @type {FontParameters} */ ({
            lineHeight: 'normal',
            size: '1.2em',
            style: 'normal',
            weight: 'normal',
            variant: 'normal',
        });
        for (var i = 0, ii = fontRegExMatchIndex.length; i < ii; ++i) {
            var value = match[i + 1];
            if (value !== undefined) {
                style[fontRegExMatchIndex[i]] = value;
            }
        }
        style.families = style.family.split(/,\s?/);
        return style;
    };

    /**
     * @module ol/render/canvas
     */
    /**
     * @typedef {'Circle' | 'Image' | 'LineString' | 'Polygon' | 'Text' | 'Default'} BuilderType
     */
    /**
     * @typedef {Object} FillState
     * @property {import("../colorlike.js").ColorLike} fillStyle FillStyle.
     */
    /**
     * @typedef Label
     * @property {number} width Width.
     * @property {number} height Height.
     * @property {Array<string|number>} contextInstructions ContextInstructions.
     */
    /**
     * @typedef {Object} FillStrokeState
     * @property {import("../colorlike.js").ColorLike} [currentFillStyle] Current FillStyle.
     * @property {import("../colorlike.js").ColorLike} [currentStrokeStyle] Current StrokeStyle.
     * @property {CanvasLineCap} [currentLineCap] Current LineCap.
     * @property {Array<number>} currentLineDash Current LineDash.
     * @property {number} [currentLineDashOffset] Current LineDashOffset.
     * @property {CanvasLineJoin} [currentLineJoin] Current LineJoin.
     * @property {number} [currentLineWidth] Current LineWidth.
     * @property {number} [currentMiterLimit] Current MiterLimit.
     * @property {number} [lastStroke] Last stroke.
     * @property {import("../colorlike.js").ColorLike} [fillStyle] FillStyle.
     * @property {import("../colorlike.js").ColorLike} [strokeStyle] StrokeStyle.
     * @property {CanvasLineCap} [lineCap] LineCap.
     * @property {Array<number>} lineDash LineDash.
     * @property {number} [lineDashOffset] LineDashOffset.
     * @property {CanvasLineJoin} [lineJoin] LineJoin.
     * @property {number} [lineWidth] LineWidth.
     * @property {number} [miterLimit] MiterLimit.
     */
    /**
     * @typedef {Object} StrokeState
     * @property {CanvasLineCap} lineCap LineCap.
     * @property {Array<number>} lineDash LineDash.
     * @property {number} lineDashOffset LineDashOffset.
     * @property {CanvasLineJoin} lineJoin LineJoin.
     * @property {number} lineWidth LineWidth.
     * @property {number} miterLimit MiterLimit.
     * @property {import("../colorlike.js").ColorLike} strokeStyle StrokeStyle.
     */
    /**
     * @typedef {Object} TextState
     * @property {string} font Font.
     * @property {string} [textAlign] TextAlign.
     * @property {string} [justify] Justify.
     * @property {string} textBaseline TextBaseline.
     * @property {string} [placement] Placement.
     * @property {number} [maxAngle] MaxAngle.
     * @property {boolean} [overflow] Overflow.
     * @property {import("../style/Fill.js").default} [backgroundFill] BackgroundFill.
     * @property {import("../style/Stroke.js").default} [backgroundStroke] BackgroundStroke.
     * @property {import("../size.js").Size} [scale] Scale.
     * @property {Array<number>} [padding] Padding.
     */
    /**
     * @typedef {Object} SerializableInstructions
     * @property {Array<*>} instructions The rendering instructions.
     * @property {Array<*>} hitDetectionInstructions The rendering hit detection instructions.
     * @property {Array<number>} coordinates The array of all coordinates.
     * @property {!Object<string, TextState>} [textStates] The text states (decluttering).
     * @property {!Object<string, FillState>} [fillStates] The fill states (decluttering).
     * @property {!Object<string, StrokeState>} [strokeStates] The stroke states (decluttering).
     */
    /**
     * @typedef {Object<number, import("./canvas/Executor.js").ReplayImageOrLabelArgs>} DeclutterImageWithText
     */
    /**
     * @const
     * @type {string}
     */
    var defaultFont = '10px sans-serif';
    /**
     * @const
     * @type {import("../colorlike.js").ColorLike}
     */
    var defaultFillStyle = '#000';
    /**
     * @const
     * @type {CanvasLineCap}
     */
    var defaultLineCap = 'round';
    /**
     * @const
     * @type {Array<number>}
     */
    var defaultLineDash = [];
    /**
     * @const
     * @type {number}
     */
    var defaultLineDashOffset = 0;
    /**
     * @const
     * @type {CanvasLineJoin}
     */
    var defaultLineJoin = 'round';
    /**
     * @const
     * @type {number}
     */
    var defaultMiterLimit = 10;
    /**
     * @const
     * @type {import("../colorlike.js").ColorLike}
     */
    var defaultStrokeStyle = '#000';
    /**
     * @const
     * @type {string}
     */
    var defaultTextAlign = 'center';
    /**
     * @const
     * @type {string}
     */
    var defaultTextBaseline = 'middle';
    /**
     * @const
     * @type {Array<number>}
     */
    var defaultPadding = [0, 0, 0, 0];
    /**
     * @const
     * @type {number}
     */
    var defaultLineWidth = 1;
    /**
     * @type {BaseObject}
     */
    var checkedFonts = new BaseObject$1();
    /**
     * The label cache for text rendering. To change the default cache size of 2048
     * entries, use {@link module:ol/structs/LRUCache~LRUCache#setSize cache.setSize()}.
     * Deprecated - there is no label cache any more.
     * @type {?}
     * @api
     * @deprecated
     */
    var labelCache = new Target$1();
    labelCache.setSize = function () {
        console.warn('labelCache is deprecated.'); //eslint-disable-line
    };
    /**
     * @type {CanvasRenderingContext2D}
     */
    var measureContext = null;
    /**
     * @type {string}
     */
    var measureFont;
    /**
     * @type {!Object<string, number>}
     */
    var textHeights = {};
    /**
     * Clears the label cache when a font becomes available.
     * @param {string} fontSpec CSS font spec.
     */
    var registerFont = (function () {
        var retries = 100;
        var size = '32px ';
        var referenceFonts = ['monospace', 'serif'];
        var len = referenceFonts.length;
        var text = 'wmytzilWMYTZIL@#/&?$%10\uF013';
        var interval, referenceWidth;
        /**
         * @param {string} fontStyle Css font-style
         * @param {string} fontWeight Css font-weight
         * @param {*} fontFamily Css font-family
         * @return {boolean} Font with style and weight is available
         */
        function isAvailable(fontStyle, fontWeight, fontFamily) {
            var available = true;
            for (var i = 0; i < len; ++i) {
                var referenceFont = referenceFonts[i];
                referenceWidth = measureTextWidth(fontStyle + ' ' + fontWeight + ' ' + size + referenceFont, text);
                if (fontFamily != referenceFont) {
                    var width = measureTextWidth(fontStyle +
                        ' ' +
                        fontWeight +
                        ' ' +
                        size +
                        fontFamily +
                        ',' +
                        referenceFont, text);
                    // If width and referenceWidth are the same, then the fallback was used
                    // instead of the font we wanted, so the font is not available.
                    available = available && width != referenceWidth;
                }
            }
            if (available) {
                return true;
            }
            return false;
        }
        function check() {
            var done = true;
            var fonts = checkedFonts.getKeys();
            for (var i = 0, ii = fonts.length; i < ii; ++i) {
                var font = fonts[i];
                if (checkedFonts.get(font) < retries) {
                    if (isAvailable.apply(this, font.split('\n'))) {
                        clear(textHeights);
                        // Make sure that loaded fonts are picked up by Safari
                        measureContext = null;
                        measureFont = undefined;
                        checkedFonts.set(font, retries);
                    }
                    else {
                        checkedFonts.set(font, checkedFonts.get(font) + 1, true);
                        done = false;
                    }
                }
            }
            if (done) {
                clearInterval(interval);
                interval = undefined;
            }
        }
        return function (fontSpec) {
            var font = getFontParameters(fontSpec);
            if (!font) {
                return;
            }
            var families = font.families;
            for (var i = 0, ii = families.length; i < ii; ++i) {
                var family = families[i];
                var key = font.style + '\n' + font.weight + '\n' + family;
                if (checkedFonts.get(key) === undefined) {
                    checkedFonts.set(key, retries, true);
                    if (!isAvailable(font.style, font.weight, family)) {
                        checkedFonts.set(key, 0, true);
                        if (interval === undefined) {
                            interval = setInterval(check, 32);
                        }
                    }
                }
            }
        };
    })();
    /**
     * @param {string} font Font to use for measuring.
     * @return {import("../size.js").Size} Measurement.
     */
    var measureTextHeight = (function () {
        /**
         * @type {HTMLDivElement}
         */
        var measureElement;
        return function (fontSpec) {
            var height = textHeights[fontSpec];
            if (height == undefined) {
                if (WORKER_OFFSCREEN_CANVAS) {
                    var font = getFontParameters(fontSpec);
                    var metrics = measureText(fontSpec, 'Žg');
                    var lineHeight = isNaN(Number(font.lineHeight))
                        ? 1.2
                        : Number(font.lineHeight);
                    height =
                        lineHeight *
                            (metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent);
                }
                else {
                    if (!measureElement) {
                        measureElement = document.createElement('div');
                        measureElement.innerHTML = 'M';
                        measureElement.style.minHeight = '0';
                        measureElement.style.maxHeight = 'none';
                        measureElement.style.height = 'auto';
                        measureElement.style.padding = '0';
                        measureElement.style.border = 'none';
                        measureElement.style.position = 'absolute';
                        measureElement.style.display = 'block';
                        measureElement.style.left = '-99999px';
                    }
                    measureElement.style.font = fontSpec;
                    document.body.appendChild(measureElement);
                    height = measureElement.offsetHeight;
                    document.body.removeChild(measureElement);
                }
                textHeights[fontSpec] = height;
            }
            return height;
        };
    })();
    /**
     * @param {string} font Font.
     * @param {string} text Text.
     * @return {TextMetrics} Text metrics.
     */
    function measureText(font, text) {
        if (!measureContext) {
            measureContext = createCanvasContext2D(1, 1);
        }
        if (font != measureFont) {
            measureContext.font = font;
            measureFont = measureContext.font;
        }
        return measureContext.measureText(text);
    }
    /**
     * @param {string} font Font.
     * @param {string} text Text.
     * @return {number} Width.
     */
    function measureTextWidth(font, text) {
        return measureText(font, text).width;
    }
    /**
     * Measure text width using a cache.
     * @param {string} font The font.
     * @param {string} text The text to measure.
     * @param {Object<string, number>} cache A lookup of cached widths by text.
     * @return {number} The text width.
     */
    function measureAndCacheTextWidth(font, text, cache) {
        if (text in cache) {
            return cache[text];
        }
        var width = text
            .split('\n')
            .reduce(function (prev, curr) { return Math.max(prev, measureTextWidth(font, curr)); }, 0);
        cache[text] = width;
        return width;
    }
    /**
     * @param {TextState} baseStyle Base style.
     * @param {Array<string>} chunks Text chunks to measure.
     * @return {{width: number, height: number, widths: Array<number>, heights: Array<number>, lineWidths: Array<number>}}} Text metrics.
     */
    function getTextDimensions(baseStyle, chunks) {
        var widths = [];
        var heights = [];
        var lineWidths = [];
        var width = 0;
        var lineWidth = 0;
        var height = 0;
        var lineHeight = 0;
        for (var i = 0, ii = chunks.length; i <= ii; i += 2) {
            var text = chunks[i];
            if (text === '\n' || i === ii) {
                width = Math.max(width, lineWidth);
                lineWidths.push(lineWidth);
                lineWidth = 0;
                height += lineHeight;
                continue;
            }
            var font = chunks[i + 1] || baseStyle.font;
            var currentWidth = measureTextWidth(font, text);
            widths.push(currentWidth);
            lineWidth += currentWidth;
            var currentHeight = measureTextHeight(font);
            heights.push(currentHeight);
            lineHeight = Math.max(lineHeight, currentHeight);
        }
        return { width: width, height: height, widths: widths, heights: heights, lineWidths: lineWidths };
    }
    /**
     * @param {CanvasRenderingContext2D} context Context.
     * @param {import("../transform.js").Transform|null} transform Transform.
     * @param {number} opacity Opacity.
     * @param {Label|HTMLCanvasElement|HTMLImageElement|HTMLVideoElement} labelOrImage Label.
     * @param {number} originX Origin X.
     * @param {number} originY Origin Y.
     * @param {number} w Width.
     * @param {number} h Height.
     * @param {number} x X.
     * @param {number} y Y.
     * @param {import("../size.js").Size} scale Scale.
     */
    function drawImageOrLabel(context, transform, opacity, labelOrImage, originX, originY, w, h, x, y, scale) {
        context.save();
        if (opacity !== 1) {
            context.globalAlpha *= opacity;
        }
        if (transform) {
            context.setTransform.apply(context, transform);
        }
        if ( /** @type {*} */(labelOrImage).contextInstructions) {
            // label
            context.translate(x, y);
            context.scale(scale[0], scale[1]);
            executeLabelInstructions(/** @type {Label} */ (labelOrImage), context);
        }
        else if (scale[0] < 0 || scale[1] < 0) {
            // flipped image
            context.translate(x, y);
            context.scale(scale[0], scale[1]);
            context.drawImage(
            /** @type {HTMLCanvasElement|HTMLImageElement|HTMLVideoElement} */ (labelOrImage), originX, originY, w, h, 0, 0, w, h);
        }
        else {
            // if image not flipped translate and scale can be avoided
            context.drawImage(
            /** @type {HTMLCanvasElement|HTMLImageElement|HTMLVideoElement} */ (labelOrImage), originX, originY, w, h, x, y, w * scale[0], h * scale[1]);
        }
        context.restore();
    }
    /**
     * @param {Label} label Label.
     * @param {CanvasRenderingContext2D} context Context.
     */
    function executeLabelInstructions(label, context) {
        var contextInstructions = label.contextInstructions;
        for (var i = 0, ii = contextInstructions.length; i < ii; i += 2) {
            if (Array.isArray(contextInstructions[i + 1])) {
                context[contextInstructions[i]].apply(context, contextInstructions[i + 1]);
            }
            else {
                context[contextInstructions[i]] = contextInstructions[i + 1];
            }
        }
    }

    /**
     * @module ol/style/RegularShape
     */
    var __extends$n = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            if (typeof b !== "function" && b !== null)
                throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * Specify radius for regular polygons, or radius1 and radius2 for stars.
     * @typedef {Object} Options
     * @property {import("./Fill.js").default} [fill] Fill style.
     * @property {number} points Number of points for stars and regular polygons. In case of a polygon, the number of points
     * is the number of sides.
     * @property {number} [radius] Radius of a regular polygon.
     * @property {number} [radius1] First radius of a star. Ignored if radius is set.
     * @property {number} [radius2] Second radius of a star.
     * @property {number} [angle=0] Shape's angle in radians. A value of 0 will have one of the shape's point facing up.
     * @property {Array<number>} [displacement=[0,0]] Displacement of the shape
     * @property {import("./Stroke.js").default} [stroke] Stroke style.
     * @property {number} [rotation=0] Rotation in radians (positive rotation clockwise).
     * @property {boolean} [rotateWithView=false] Whether to rotate the shape with the view.
     * @property {number|import("../size.js").Size} [scale=1] Scale. Unless two dimensional scaling is required a better
     * result may be obtained with appropriate settings for `radius`, `radius1` and `radius2`.
     * @property {"declutter"|"obstacle"|"none"|undefined} [declutterMode] Declutter mode
     */
    /**
     * @typedef {Object} RenderOptions
     * @property {import("../colorlike.js").ColorLike} [strokeStyle] StrokeStyle.
     * @property {number} strokeWidth StrokeWidth.
     * @property {number} size Size.
     * @property {Array<number>} lineDash LineDash.
     * @property {number} lineDashOffset LineDashOffset.
     * @property {CanvasLineJoin} lineJoin LineJoin.
     * @property {number} miterLimit MiterLimit.
     */
    /**
     * @classdesc
     * Set regular shape style for vector features. The resulting shape will be
     * a regular polygon when `radius` is provided, or a star when `radius1` and
     * `radius2` are provided.
     * @api
     */
    var RegularShape = /** @class */ (function (_super) {
        __extends$n(RegularShape, _super);
        /**
         * @param {Options} options Options.
         */
        function RegularShape(options) {
            var _this = this;
            /**
             * @type {boolean}
             */
            var rotateWithView = options.rotateWithView !== undefined ? options.rotateWithView : false;
            _this = _super.call(this, {
                opacity: 1,
                rotateWithView: rotateWithView,
                rotation: options.rotation !== undefined ? options.rotation : 0,
                scale: options.scale !== undefined ? options.scale : 1,
                displacement: options.displacement !== undefined ? options.displacement : [0, 0],
                declutterMode: options.declutterMode,
            }) || this;
            /**
             * @private
             * @type {Object<number, HTMLCanvasElement>}
             */
            _this.canvas_ = undefined;
            /**
             * @private
             * @type {HTMLCanvasElement}
             */
            _this.hitDetectionCanvas_ = null;
            /**
             * @private
             * @type {import("./Fill.js").default}
             */
            _this.fill_ = options.fill !== undefined ? options.fill : null;
            /**
             * @private
             * @type {Array<number>}
             */
            _this.origin_ = [0, 0];
            /**
             * @private
             * @type {number}
             */
            _this.points_ = options.points;
            /**
             * @protected
             * @type {number}
             */
            _this.radius_ =
                options.radius !== undefined ? options.radius : options.radius1;
            /**
             * @private
             * @type {number|undefined}
             */
            _this.radius2_ = options.radius2;
            /**
             * @private
             * @type {number}
             */
            _this.angle_ = options.angle !== undefined ? options.angle : 0;
            /**
             * @private
             * @type {import("./Stroke.js").default}
             */
            _this.stroke_ = options.stroke !== undefined ? options.stroke : null;
            /**
             * @private
             * @type {import("../size.js").Size}
             */
            _this.size_ = null;
            /**
             * @private
             * @type {RenderOptions}
             */
            _this.renderOptions_ = null;
            _this.render();
            return _this;
        }
        /**
         * Clones the style.
         * @return {RegularShape} The cloned style.
         * @api
         */
        RegularShape.prototype.clone = function () {
            var scale = this.getScale();
            var style = new RegularShape({
                fill: this.getFill() ? this.getFill().clone() : undefined,
                points: this.getPoints(),
                radius: this.getRadius(),
                radius2: this.getRadius2(),
                angle: this.getAngle(),
                stroke: this.getStroke() ? this.getStroke().clone() : undefined,
                rotation: this.getRotation(),
                rotateWithView: this.getRotateWithView(),
                scale: Array.isArray(scale) ? scale.slice() : scale,
                displacement: this.getDisplacement().slice(),
                declutterMode: this.getDeclutterMode(),
            });
            style.setOpacity(this.getOpacity());
            return style;
        };
        /**
         * Get the anchor point in pixels. The anchor determines the center point for the
         * symbolizer.
         * @return {Array<number>} Anchor.
         * @api
         */
        RegularShape.prototype.getAnchor = function () {
            var size = this.size_;
            if (!size) {
                return null;
            }
            var displacement = this.getDisplacement();
            return [size[0] / 2 - displacement[0], size[1] / 2 + displacement[1]];
        };
        /**
         * Get the angle used in generating the shape.
         * @return {number} Shape's rotation in radians.
         * @api
         */
        RegularShape.prototype.getAngle = function () {
            return this.angle_;
        };
        /**
         * Get the fill style for the shape.
         * @return {import("./Fill.js").default} Fill style.
         * @api
         */
        RegularShape.prototype.getFill = function () {
            return this.fill_;
        };
        /**
         * Set the fill style.
         * @param {import("./Fill.js").default} fill Fill style.
         * @api
         */
        RegularShape.prototype.setFill = function (fill) {
            this.fill_ = fill;
            this.render();
        };
        /**
         * @return {HTMLCanvasElement} Image element.
         */
        RegularShape.prototype.getHitDetectionImage = function () {
            if (!this.hitDetectionCanvas_) {
                this.createHitDetectionCanvas_(this.renderOptions_);
            }
            return this.hitDetectionCanvas_;
        };
        /**
         * Get the image icon.
         * @param {number} pixelRatio Pixel ratio.
         * @return {HTMLCanvasElement} Image or Canvas element.
         * @api
         */
        RegularShape.prototype.getImage = function (pixelRatio) {
            var image = this.canvas_[pixelRatio];
            if (!image) {
                var renderOptions = this.renderOptions_;
                var context = createCanvasContext2D(renderOptions.size * pixelRatio, renderOptions.size * pixelRatio);
                this.draw_(renderOptions, context, pixelRatio);
                image = context.canvas;
                this.canvas_[pixelRatio] = image;
            }
            return image;
        };
        /**
         * Get the image pixel ratio.
         * @param {number} pixelRatio Pixel ratio.
         * @return {number} Pixel ratio.
         */
        RegularShape.prototype.getPixelRatio = function (pixelRatio) {
            return pixelRatio;
        };
        /**
         * @return {import("../size.js").Size} Image size.
         */
        RegularShape.prototype.getImageSize = function () {
            return this.size_;
        };
        /**
         * @return {import("../ImageState.js").default} Image state.
         */
        RegularShape.prototype.getImageState = function () {
            return ImageState.LOADED;
        };
        /**
         * Get the origin of the symbolizer.
         * @return {Array<number>} Origin.
         * @api
         */
        RegularShape.prototype.getOrigin = function () {
            return this.origin_;
        };
        /**
         * Get the number of points for generating the shape.
         * @return {number} Number of points for stars and regular polygons.
         * @api
         */
        RegularShape.prototype.getPoints = function () {
            return this.points_;
        };
        /**
         * Get the (primary) radius for the shape.
         * @return {number} Radius.
         * @api
         */
        RegularShape.prototype.getRadius = function () {
            return this.radius_;
        };
        /**
         * Get the secondary radius for the shape.
         * @return {number|undefined} Radius2.
         * @api
         */
        RegularShape.prototype.getRadius2 = function () {
            return this.radius2_;
        };
        /**
         * Get the size of the symbolizer (in pixels).
         * @return {import("../size.js").Size} Size.
         * @api
         */
        RegularShape.prototype.getSize = function () {
            return this.size_;
        };
        /**
         * Get the stroke style for the shape.
         * @return {import("./Stroke.js").default} Stroke style.
         * @api
         */
        RegularShape.prototype.getStroke = function () {
            return this.stroke_;
        };
        /**
         * Set the stroke style.
         * @param {import("./Stroke.js").default} stroke Stroke style.
         * @api
         */
        RegularShape.prototype.setStroke = function (stroke) {
            this.stroke_ = stroke;
            this.render();
        };
        /**
         * @param {function(import("../events/Event.js").default): void} listener Listener function.
         */
        RegularShape.prototype.listenImageChange = function (listener) { };
        /**
         * Load not yet loaded URI.
         */
        RegularShape.prototype.load = function () { };
        /**
         * @param {function(import("../events/Event.js").default): void} listener Listener function.
         */
        RegularShape.prototype.unlistenImageChange = function (listener) { };
        /**
         * Calculate additional canvas size needed for the miter.
         * @param {string} lineJoin Line join
         * @param {number} strokeWidth Stroke width
         * @param {number} miterLimit Miter limit
         * @return {number} Additional canvas size needed
         * @private
         */
        RegularShape.prototype.calculateLineJoinSize_ = function (lineJoin, strokeWidth, miterLimit) {
            if (strokeWidth === 0 ||
                this.points_ === Infinity ||
                (lineJoin !== 'bevel' && lineJoin !== 'miter')) {
                return strokeWidth;
            }
            // m  | ^
            // i  | |\                  .
            // t >|  #\
            // e  | |\ \              .
            // r      \s\
            //      |  \t\          .                 .
            //          \r\                      .   .
            //      |    \o\      .          .  . . .
            //          e \k\            .  .    . .
            //      |      \e\  .    .  .       . .
            //       d      \ \  .  .          . .
            //      | _ _a_ _\#  .            . .
            //   r1          / `             . .
            //      |                       . .
            //       b     /               . .
            //      |                     . .
            //           / r2            . .
            //      |                        .   .
            //         /                           .   .
            //      |α                                   .   .
            //       /                                         .   .
            //      ° center
            var r1 = this.radius_;
            var r2 = this.radius2_ === undefined ? r1 : this.radius2_;
            if (r1 < r2) {
                var tmp = r1;
                r1 = r2;
                r2 = tmp;
            }
            var points = this.radius2_ === undefined ? this.points_ : this.points_ * 2;
            var alpha = (2 * Math.PI) / points;
            var a = r2 * Math.sin(alpha);
            var b = Math.sqrt(r2 * r2 - a * a);
            var d = r1 - b;
            var e = Math.sqrt(a * a + d * d);
            var miterRatio = e / a;
            if (lineJoin === 'miter' && miterRatio <= miterLimit) {
                return miterRatio * strokeWidth;
            }
            // Calculate the distnce from center to the stroke corner where
            // it was cut short because of the miter limit.
            //              l
            //        ----+---- <= distance from center to here is maxr
            //       /####|k ##\
            //      /#####^#####\
            //     /#### /+\# s #\
            //    /### h/+++\# t #\
            //   /### t/+++++\# r #\
            //  /### a/+++++++\# o #\
            // /### p/++ fill +\# k #\
            ///#### /+++++^+++++\# e #\
            //#####/+++++/+\+++++\#####\
            var k = strokeWidth / 2 / miterRatio;
            var l = (strokeWidth / 2) * (d / e);
            var maxr = Math.sqrt((r1 + k) * (r1 + k) + l * l);
            var bevelAdd = maxr - r1;
            if (this.radius2_ === undefined || lineJoin === 'bevel') {
                return bevelAdd * 2;
            }
            // If outer miter is over the miter limit the inner miter may reach through the
            // center and be longer than the bevel, same calculation as above but swap r1 / r2.
            var aa = r1 * Math.sin(alpha);
            var bb = Math.sqrt(r1 * r1 - aa * aa);
            var dd = r2 - bb;
            var ee = Math.sqrt(aa * aa + dd * dd);
            var innerMiterRatio = ee / aa;
            if (innerMiterRatio <= miterLimit) {
                var innerLength = (innerMiterRatio * strokeWidth) / 2 - r2 - r1;
                return 2 * Math.max(bevelAdd, innerLength);
            }
            return bevelAdd * 2;
        };
        /**
         * @return {RenderOptions}  The render options
         * @protected
         */
        RegularShape.prototype.createRenderOptions = function () {
            var lineJoin = defaultLineJoin;
            var miterLimit = 0;
            var lineDash = null;
            var lineDashOffset = 0;
            var strokeStyle;
            var strokeWidth = 0;
            if (this.stroke_) {
                strokeStyle = this.stroke_.getColor();
                if (strokeStyle === null) {
                    strokeStyle = defaultStrokeStyle;
                }
                strokeStyle = asColorLike(strokeStyle);
                strokeWidth = this.stroke_.getWidth();
                if (strokeWidth === undefined) {
                    strokeWidth = defaultLineWidth;
                }
                lineDash = this.stroke_.getLineDash();
                lineDashOffset = this.stroke_.getLineDashOffset();
                lineJoin = this.stroke_.getLineJoin();
                if (lineJoin === undefined) {
                    lineJoin = defaultLineJoin;
                }
                miterLimit = this.stroke_.getMiterLimit();
                if (miterLimit === undefined) {
                    miterLimit = defaultMiterLimit;
                }
            }
            var add = this.calculateLineJoinSize_(lineJoin, strokeWidth, miterLimit);
            var maxRadius = Math.max(this.radius_, this.radius2_ || 0);
            var size = Math.ceil(2 * maxRadius + add);
            return {
                strokeStyle: strokeStyle,
                strokeWidth: strokeWidth,
                size: size,
                lineDash: lineDash,
                lineDashOffset: lineDashOffset,
                lineJoin: lineJoin,
                miterLimit: miterLimit,
            };
        };
        /**
         * @protected
         */
        RegularShape.prototype.render = function () {
            this.renderOptions_ = this.createRenderOptions();
            var size = this.renderOptions_.size;
            this.canvas_ = {};
            this.size_ = [size, size];
        };
        /**
         * @private
         * @param {RenderOptions} renderOptions Render options.
         * @param {CanvasRenderingContext2D} context The rendering context.
         * @param {number} pixelRatio The pixel ratio.
         */
        RegularShape.prototype.draw_ = function (renderOptions, context, pixelRatio) {
            context.scale(pixelRatio, pixelRatio);
            // set origin to canvas center
            context.translate(renderOptions.size / 2, renderOptions.size / 2);
            this.createPath_(context);
            if (this.fill_) {
                var color = this.fill_.getColor();
                if (color === null) {
                    color = defaultFillStyle;
                }
                context.fillStyle = asColorLike(color);
                context.fill();
            }
            if (this.stroke_) {
                context.strokeStyle = renderOptions.strokeStyle;
                context.lineWidth = renderOptions.strokeWidth;
                if (context.setLineDash && renderOptions.lineDash) {
                    context.setLineDash(renderOptions.lineDash);
                    context.lineDashOffset = renderOptions.lineDashOffset;
                }
                context.lineJoin = renderOptions.lineJoin;
                context.miterLimit = renderOptions.miterLimit;
                context.stroke();
            }
        };
        /**
         * @private
         * @param {RenderOptions} renderOptions Render options.
         */
        RegularShape.prototype.createHitDetectionCanvas_ = function (renderOptions) {
            if (this.fill_) {
                var color = this.fill_.getColor();
                // determine if fill is transparent (or pattern or gradient)
                var opacity = 0;
                if (typeof color === 'string') {
                    color = asArray(color);
                }
                if (color === null) {
                    opacity = 1;
                }
                else if (Array.isArray(color)) {
                    opacity = color.length === 4 ? color[3] : 1;
                }
                if (opacity === 0) {
                    // if a transparent fill style is set, create an extra hit-detection image
                    // with a default fill style
                    var context = createCanvasContext2D(renderOptions.size, renderOptions.size);
                    this.hitDetectionCanvas_ = context.canvas;
                    this.drawHitDetectionCanvas_(renderOptions, context);
                }
            }
            if (!this.hitDetectionCanvas_) {
                this.hitDetectionCanvas_ = this.getImage(1);
            }
        };
        /**
         * @private
         * @param {CanvasRenderingContext2D} context The context to draw in.
         */
        RegularShape.prototype.createPath_ = function (context) {
            var points = this.points_;
            var radius = this.radius_;
            if (points === Infinity) {
                context.arc(0, 0, radius, 0, 2 * Math.PI);
            }
            else {
                var radius2 = this.radius2_ === undefined ? radius : this.radius2_;
                if (this.radius2_ !== undefined) {
                    points *= 2;
                }
                var startAngle = this.angle_ - Math.PI / 2;
                var step = (2 * Math.PI) / points;
                for (var i = 0; i < points; i++) {
                    var angle0 = startAngle + i * step;
                    var radiusC = i % 2 === 0 ? radius : radius2;
                    context.lineTo(radiusC * Math.cos(angle0), radiusC * Math.sin(angle0));
                }
                context.closePath();
            }
        };
        /**
         * @private
         * @param {RenderOptions} renderOptions Render options.
         * @param {CanvasRenderingContext2D} context The context.
         */
        RegularShape.prototype.drawHitDetectionCanvas_ = function (renderOptions, context) {
            // set origin to canvas center
            context.translate(renderOptions.size / 2, renderOptions.size / 2);
            this.createPath_(context);
            context.fillStyle = defaultFillStyle;
            context.fill();
            if (this.stroke_) {
                context.strokeStyle = renderOptions.strokeStyle;
                context.lineWidth = renderOptions.strokeWidth;
                if (renderOptions.lineDash) {
                    context.setLineDash(renderOptions.lineDash);
                    context.lineDashOffset = renderOptions.lineDashOffset;
                }
                context.lineJoin = renderOptions.lineJoin;
                context.miterLimit = renderOptions.miterLimit;
                context.stroke();
            }
        };
        return RegularShape;
    }(ImageStyle$1));
    var RegularShape$1 = RegularShape;

    /**
     * @module ol/style/Circle
     */
    var __extends$m = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            if (typeof b !== "function" && b !== null)
                throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * @typedef {Object} Options
     * @property {import("./Fill.js").default} [fill] Fill style.
     * @property {number} radius Circle radius.
     * @property {import("./Stroke.js").default} [stroke] Stroke style.
     * @property {Array<number>} [displacement=[0,0]] displacement
     * @property {number|import("../size.js").Size} [scale=1] Scale. A two dimensional scale will produce an ellipse.
     * Unless two dimensional scaling is required a better result may be obtained with an appropriate setting for `radius`.
     * @property {number} [rotation=0] Rotation in radians
     * (positive rotation clockwise, meaningful only when used in conjunction with a two dimensional scale).
     * @property {boolean} [rotateWithView=false] Whether to rotate the shape with the view
     * (meaningful only when used in conjunction with a two dimensional scale).
     * @property {"declutter"|"obstacle"|"none"|undefined} [declutterMode] Declutter mode
     */
    /**
     * @classdesc
     * Set circle style for vector features.
     * @api
     */
    var CircleStyle = /** @class */ (function (_super) {
        __extends$m(CircleStyle, _super);
        /**
         * @param {Options} [opt_options] Options.
         */
        function CircleStyle(opt_options) {
            var options = opt_options ? opt_options : {};
            return _super.call(this, {
                points: Infinity,
                fill: options.fill,
                radius: options.radius,
                stroke: options.stroke,
                scale: options.scale !== undefined ? options.scale : 1,
                rotation: options.rotation !== undefined ? options.rotation : 0,
                rotateWithView: options.rotateWithView !== undefined ? options.rotateWithView : false,
                displacement: options.displacement !== undefined ? options.displacement : [0, 0],
                declutterMode: options.declutterMode,
            }) || this;
        }
        /**
         * Clones the style.
         * @return {CircleStyle} The cloned style.
         * @api
         */
        CircleStyle.prototype.clone = function () {
            var scale = this.getScale();
            var style = new CircleStyle({
                fill: this.getFill() ? this.getFill().clone() : undefined,
                stroke: this.getStroke() ? this.getStroke().clone() : undefined,
                radius: this.getRadius(),
                scale: Array.isArray(scale) ? scale.slice() : scale,
                rotation: this.getRotation(),
                rotateWithView: this.getRotateWithView(),
                displacement: this.getDisplacement().slice(),
                declutterMode: this.getDeclutterMode(),
            });
            style.setOpacity(this.getOpacity());
            return style;
        };
        /**
         * Set the circle radius.
         *
         * @param {number} radius Circle radius.
         * @api
         */
        CircleStyle.prototype.setRadius = function (radius) {
            this.radius_ = radius;
            this.render();
        };
        return CircleStyle;
    }(RegularShape$1));
    var CircleStyle$1 = CircleStyle;

    /**
     * @module ol/style/Style
     */
    /**
     * A function that takes an {@link module:ol/Feature~Feature} and a `{number}`
     * representing the view's resolution. The function should return a
     * {@link module:ol/style/Style~Style} or an array of them. This way e.g. a
     * vector layer can be styled. If the function returns `undefined`, the
     * feature will not be rendered.
     *
     * @typedef {function(import("../Feature.js").FeatureLike, number):(Style|Array<Style>|void)} StyleFunction
     */
    /**
     * A {@link Style}, an array of {@link Style}, or a {@link StyleFunction}.
     * @typedef {Style|Array<Style>|StyleFunction} StyleLike
     */
    /**
     * A function that takes an {@link module:ol/Feature~Feature} as argument and returns an
     * {@link module:ol/geom/Geometry~Geometry} that will be rendered and styled for the feature.
     *
     * @typedef {function(import("../Feature.js").FeatureLike):
     *     (import("../geom/Geometry.js").default|import("../render/Feature.js").default|undefined)} GeometryFunction
     */
    /**
     * Custom renderer function. Takes two arguments:
     *
     * 1. The pixel coordinates of the geometry in GeoJSON notation.
     * 2. The {@link module:ol/render~State} of the layer renderer.
     *
     * @typedef {function((import("../coordinate.js").Coordinate|Array<import("../coordinate.js").Coordinate>|Array<Array<import("../coordinate.js").Coordinate>>),import("../render.js").State): void} RenderFunction
     */
    /**
     * @typedef {Object} Options
     * @property {string|import("../geom/Geometry.js").default|GeometryFunction} [geometry] Feature property or geometry
     * or function returning a geometry to render for this style.
     * @property {import("./Fill.js").default} [fill] Fill style.
     * @property {import("./Image.js").default} [image] Image style.
     * @property {RenderFunction} [renderer] Custom renderer. When configured, `fill`, `stroke` and `image` will be
     * ignored, and the provided function will be called with each render frame for each geometry.
     * @property {RenderFunction} [hitDetectionRenderer] Custom renderer for hit detection. If provided will be used
     * in hit detection rendering.
     * @property {import("./Stroke.js").default} [stroke] Stroke style.
     * @property {import("./Text.js").default} [text] Text style.
     * @property {number} [zIndex] Z index.
     */
    /**
     * @classdesc
     * Container for vector feature rendering styles. Any changes made to the style
     * or its children through `set*()` methods will not take effect until the
     * feature or layer that uses the style is re-rendered.
     *
     * ## Feature styles
     *
     * If no style is defined, the following default style is used:
     * ```js
     *  import {Circle, Fill, Stroke, Style} from 'ol/style';
     *
     *  const fill = new Fill({
     *    color: 'rgba(255,255,255,0.4)',
     *  });
     *  const stroke = new Stroke({
     *    color: '#3399CC',
     *    width: 1.25,
     *  });
     *  const styles = [
     *    new Style({
     *      image: new Circle({
     *        fill: fill,
     *        stroke: stroke,
     *        radius: 5,
     *      }),
     *      fill: fill,
     *      stroke: stroke,
     *    }),
     *  ];
     * ```
     *
     * A separate editing style has the following defaults:
     * ```js
     *  import {Circle, Fill, Stroke, Style} from 'ol/style';
     *
     *  const styles = {};
     *  const white = [255, 255, 255, 1];
     *  const blue = [0, 153, 255, 1];
     *  const width = 3;
     *  styles['Polygon'] = [
     *    new Style({
     *      fill: new Fill({
     *        color: [255, 255, 255, 0.5],
     *      }),
     *    }),
     *  ];
     *  styles['MultiPolygon'] =
     *      styles['Polygon'];
     *  styles['LineString'] = [
     *    new Style({
     *      stroke: new Stroke({
     *        color: white,
     *        width: width + 2,
     *      }),
     *    }),
     *    new Style({
     *      stroke: new Stroke({
     *        color: blue,
     *        width: width,
     *      }),
     *    }),
     *  ];
     *  styles['MultiLineString'] = styles['LineString'];
     *
     *  styles['Circle'] = styles['Polygon'].concat(
     *    styles['LineString']
     *  );
     *
     *  styles['Point'] = [
     *    new Style({
     *      image: new Circle({
     *        radius: width * 2,
     *        fill: new Fill({
     *          color: blue,
     *        }),
     *        stroke: new Stroke({
     *          color: white,
     *          width: width / 2,
     *        }),
     *      }),
     *      zIndex: Infinity,
     *    }),
     *  ];
     *  styles['MultiPoint'] =
     *      styles['Point'];
     *  styles['GeometryCollection'] =
     *      styles['Polygon'].concat(
     *          styles['LineString'],
     *          styles['Point']
     *      );
     * ```
     *
     * @api
     */
    var Style = /** @class */ (function () {
        /**
         * @param {Options} [opt_options] Style options.
         */
        function Style(opt_options) {
            var options = opt_options || {};
            /**
             * @private
             * @type {string|import("../geom/Geometry.js").default|GeometryFunction}
             */
            this.geometry_ = null;
            /**
             * @private
             * @type {!GeometryFunction}
             */
            this.geometryFunction_ = defaultGeometryFunction;
            if (options.geometry !== undefined) {
                this.setGeometry(options.geometry);
            }
            /**
             * @private
             * @type {import("./Fill.js").default}
             */
            this.fill_ = options.fill !== undefined ? options.fill : null;
            /**
             * @private
             * @type {import("./Image.js").default}
             */
            this.image_ = options.image !== undefined ? options.image : null;
            /**
             * @private
             * @type {RenderFunction|null}
             */
            this.renderer_ = options.renderer !== undefined ? options.renderer : null;
            /**
             * @private
             * @type {RenderFunction|null}
             */
            this.hitDetectionRenderer_ =
                options.hitDetectionRenderer !== undefined
                    ? options.hitDetectionRenderer
                    : null;
            /**
             * @private
             * @type {import("./Stroke.js").default}
             */
            this.stroke_ = options.stroke !== undefined ? options.stroke : null;
            /**
             * @private
             * @type {import("./Text.js").default}
             */
            this.text_ = options.text !== undefined ? options.text : null;
            /**
             * @private
             * @type {number|undefined}
             */
            this.zIndex_ = options.zIndex;
        }
        /**
         * Clones the style.
         * @return {Style} The cloned style.
         * @api
         */
        Style.prototype.clone = function () {
            var geometry = this.getGeometry();
            if (geometry && typeof geometry === 'object') {
                geometry = /** @type {import("../geom/Geometry.js").default} */ (geometry).clone();
            }
            return new Style({
                geometry: geometry,
                fill: this.getFill() ? this.getFill().clone() : undefined,
                image: this.getImage() ? this.getImage().clone() : undefined,
                renderer: this.getRenderer(),
                stroke: this.getStroke() ? this.getStroke().clone() : undefined,
                text: this.getText() ? this.getText().clone() : undefined,
                zIndex: this.getZIndex(),
            });
        };
        /**
         * Get the custom renderer function that was configured with
         * {@link #setRenderer} or the `renderer` constructor option.
         * @return {RenderFunction|null} Custom renderer function.
         * @api
         */
        Style.prototype.getRenderer = function () {
            return this.renderer_;
        };
        /**
         * Sets a custom renderer function for this style. When set, `fill`, `stroke`
         * and `image` options of the style will be ignored.
         * @param {RenderFunction|null} renderer Custom renderer function.
         * @api
         */
        Style.prototype.setRenderer = function (renderer) {
            this.renderer_ = renderer;
        };
        /**
         * Sets a custom renderer function for this style used
         * in hit detection.
         * @param {RenderFunction|null} renderer Custom renderer function.
         * @api
         */
        Style.prototype.setHitDetectionRenderer = function (renderer) {
            this.hitDetectionRenderer_ = renderer;
        };
        /**
         * Get the custom renderer function that was configured with
         * {@link #setHitDetectionRenderer} or the `hitDetectionRenderer` constructor option.
         * @return {RenderFunction|null} Custom renderer function.
         * @api
         */
        Style.prototype.getHitDetectionRenderer = function () {
            return this.hitDetectionRenderer_;
        };
        /**
         * Get the geometry to be rendered.
         * @return {string|import("../geom/Geometry.js").default|GeometryFunction}
         * Feature property or geometry or function that returns the geometry that will
         * be rendered with this style.
         * @api
         */
        Style.prototype.getGeometry = function () {
            return this.geometry_;
        };
        /**
         * Get the function used to generate a geometry for rendering.
         * @return {!GeometryFunction} Function that is called with a feature
         * and returns the geometry to render instead of the feature's geometry.
         * @api
         */
        Style.prototype.getGeometryFunction = function () {
            return this.geometryFunction_;
        };
        /**
         * Get the fill style.
         * @return {import("./Fill.js").default} Fill style.
         * @api
         */
        Style.prototype.getFill = function () {
            return this.fill_;
        };
        /**
         * Set the fill style.
         * @param {import("./Fill.js").default} fill Fill style.
         * @api
         */
        Style.prototype.setFill = function (fill) {
            this.fill_ = fill;
        };
        /**
         * Get the image style.
         * @return {import("./Image.js").default} Image style.
         * @api
         */
        Style.prototype.getImage = function () {
            return this.image_;
        };
        /**
         * Set the image style.
         * @param {import("./Image.js").default} image Image style.
         * @api
         */
        Style.prototype.setImage = function (image) {
            this.image_ = image;
        };
        /**
         * Get the stroke style.
         * @return {import("./Stroke.js").default} Stroke style.
         * @api
         */
        Style.prototype.getStroke = function () {
            return this.stroke_;
        };
        /**
         * Set the stroke style.
         * @param {import("./Stroke.js").default} stroke Stroke style.
         * @api
         */
        Style.prototype.setStroke = function (stroke) {
            this.stroke_ = stroke;
        };
        /**
         * Get the text style.
         * @return {import("./Text.js").default} Text style.
         * @api
         */
        Style.prototype.getText = function () {
            return this.text_;
        };
        /**
         * Set the text style.
         * @param {import("./Text.js").default} text Text style.
         * @api
         */
        Style.prototype.setText = function (text) {
            this.text_ = text;
        };
        /**
         * Get the z-index for the style.
         * @return {number|undefined} ZIndex.
         * @api
         */
        Style.prototype.getZIndex = function () {
            return this.zIndex_;
        };
        /**
         * Set a geometry that is rendered instead of the feature's geometry.
         *
         * @param {string|import("../geom/Geometry.js").default|GeometryFunction} geometry
         *     Feature property or geometry or function returning a geometry to render
         *     for this style.
         * @api
         */
        Style.prototype.setGeometry = function (geometry) {
            if (typeof geometry === 'function') {
                this.geometryFunction_ = geometry;
            }
            else if (typeof geometry === 'string') {
                this.geometryFunction_ = function (feature) {
                    return /** @type {import("../geom/Geometry.js").default} */ (feature.get(geometry));
                };
            }
            else if (!geometry) {
                this.geometryFunction_ = defaultGeometryFunction;
            }
            else if (geometry !== undefined) {
                this.geometryFunction_ = function () {
                    return /** @type {import("../geom/Geometry.js").default} */ (geometry);
                };
            }
            this.geometry_ = geometry;
        };
        /**
         * Set the z-index.
         *
         * @param {number|undefined} zIndex ZIndex.
         * @api
         */
        Style.prototype.setZIndex = function (zIndex) {
            this.zIndex_ = zIndex;
        };
        return Style;
    }());
    /**
     * Convert the provided object into a style function.  Functions passed through
     * unchanged.  Arrays of Style or single style objects wrapped in a
     * new style function.
     * @param {StyleFunction|Array<Style>|Style} obj
     *     A style function, a single style, or an array of styles.
     * @return {StyleFunction} A style function.
     */
    function toFunction(obj) {
        var styleFunction;
        if (typeof obj === 'function') {
            styleFunction = obj;
        }
        else {
            /**
             * @type {Array<Style>}
             */
            var styles_1;
            if (Array.isArray(obj)) {
                styles_1 = obj;
            }
            else {
                assert(typeof ( /** @type {?} */(obj).getZIndex) === 'function', 41); // Expected an `Style` or an array of `Style`
                var style = /** @type {Style} */ (obj);
                styles_1 = [style];
            }
            styleFunction = function () {
                return styles_1;
            };
        }
        return styleFunction;
    }
    /**
     * @type {Array<Style>|null}
     */
    var defaultStyles = null;
    /**
     * @param {import("../Feature.js").FeatureLike} feature Feature.
     * @param {number} resolution Resolution.
     * @return {Array<Style>} Style.
     */
    function createDefaultStyle(feature, resolution) {
        // We don't use an immediately-invoked function
        // and a closure so we don't get an error at script evaluation time in
        // browsers that do not support Canvas. (import("./Circle.js").CircleStyle does
        // canvas.getContext('2d') at construction time, which will cause an.error
        // in such browsers.)
        if (!defaultStyles) {
            var fill = new Fill$1({
                color: 'rgba(255,255,255,0.4)',
            });
            var stroke = new Stroke$1({
                color: '#3399CC',
                width: 1.25,
            });
            defaultStyles = [
                new Style({
                    image: new CircleStyle$1({
                        fill: fill,
                        stroke: stroke,
                        radius: 5,
                    }),
                    fill: fill,
                    stroke: stroke,
                }),
            ];
        }
        return defaultStyles;
    }
    /**
     * Function that is called with a feature and returns its default geometry.
     * @param {import("../Feature.js").FeatureLike} feature Feature to get the geometry for.
     * @return {import("../geom/Geometry.js").default|import("../render/Feature.js").default|undefined} Geometry to render.
     */
    function defaultGeometryFunction(feature) {
        return feature.getGeometry();
    }
    var Style$1 = Style;

    /**
     * @module ol/style/TextPlacement
     */
    /**
     * Text placement. One of `'point'`, `'line'`. Default is `'point'`. Note that
     * `'line'` requires the underlying geometry to be a {@link module:ol/geom/LineString~LineString},
     * {@link module:ol/geom/Polygon~Polygon}, {@link module:ol/geom/MultiLineString~MultiLineString} or
     * {@link module:ol/geom/MultiPolygon~MultiPolygon}.
     * @enum {string}
     */
    var TextPlacement = {
        POINT: 'point',
        LINE: 'line',
    };

    /**
     * @module ol/layer/Property
     */
    /**
     * @enum {string}
     */
    var LayerProperty = {
        OPACITY: 'opacity',
        VISIBLE: 'visible',
        EXTENT: 'extent',
        Z_INDEX: 'zIndex',
        MAX_RESOLUTION: 'maxResolution',
        MIN_RESOLUTION: 'minResolution',
        MAX_ZOOM: 'maxZoom',
        MIN_ZOOM: 'minZoom',
        SOURCE: 'source',
        MAP: 'map',
    };

    var __extends$l = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            if (typeof b !== "function" && b !== null)
                throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * A css color, or a function called with a view resolution returning a css color.
     *
     * @typedef {string|function(number):string} BackgroundColor
     * @api
     */
    /**
     * @typedef {import("../ObjectEventType").Types|'change:extent'|'change:maxResolution'|'change:maxZoom'|
     *    'change:minResolution'|'change:minZoom'|'change:opacity'|'change:visible'|'change:zIndex'} BaseLayerObjectEventTypes
     */
    /***
     * @template Return
     * @typedef {import("../Observable").OnSignature<import("../Observable").EventTypes, import("../events/Event.js").default, Return> &
     *   import("../Observable").OnSignature<BaseLayerObjectEventTypes, import("../Object").ObjectEvent, Return> &
     *   import("../Observable").CombinedOnSignature<import("../Observable").EventTypes|BaseLayerObjectEventTypes, Return>} BaseLayerOnSignature
     */
    /**
     * @typedef {Object} Options
     * @property {string} [className='ol-layer'] A CSS class name to set to the layer element.
     * @property {number} [opacity=1] Opacity (0, 1).
     * @property {boolean} [visible=true] Visibility.
     * @property {import("../extent.js").Extent} [extent] The bounding extent for layer rendering.  The layer will not be
     * rendered outside of this extent.
     * @property {number} [zIndex] The z-index for layer rendering.  At rendering time, the layers
     * will be ordered, first by Z-index and then by position. When `undefined`, a `zIndex` of 0 is assumed
     * for layers that are added to the map's `layers` collection, or `Infinity` when the layer's `setMap()`
     * method was used.
     * @property {number} [minResolution] The minimum resolution (inclusive) at which this layer will be
     * visible.
     * @property {number} [maxResolution] The maximum resolution (exclusive) below which this layer will
     * be visible.
     * @property {number} [minZoom] The minimum view zoom level (exclusive) above which this layer will be
     * visible.
     * @property {number} [maxZoom] The maximum view zoom level (inclusive) at which this layer will
     * be visible.
     * @property {BackgroundColor} [background] Background color for the layer. If not specified, no background
     * will be rendered.
     * @property {Object<string, *>} [properties] Arbitrary observable properties. Can be accessed with `#get()` and `#set()`.
     */
    /**
     * @classdesc
     * Abstract base class; normally only used for creating subclasses and not
     * instantiated in apps.
     * Note that with {@link module:ol/layer/Base~BaseLayer} and all its subclasses, any property set in
     * the options is set as a {@link module:ol/Object~BaseObject} property on the layer object, so
     * is observable, and has get/set accessors.
     *
     * @api
     */
    var BaseLayer = /** @class */ (function (_super) {
        __extends$l(BaseLayer, _super);
        /**
         * @param {Options} options Layer options.
         */
        function BaseLayer(options) {
            var _this = _super.call(this) || this;
            /***
             * @type {BaseLayerOnSignature<import("../events").EventsKey>}
             */
            _this.on;
            /***
             * @type {BaseLayerOnSignature<import("../events").EventsKey>}
             */
            _this.once;
            /***
             * @type {BaseLayerOnSignature<void>}
             */
            _this.un;
            /**
             * @type {BackgroundColor|false}
             * @private
             */
            _this.background_ = options.background;
            /**
             * @type {Object<string, *>}
             */
            var properties = assign({}, options);
            if (typeof options.properties === 'object') {
                delete properties.properties;
                assign(properties, options.properties);
            }
            properties[LayerProperty.OPACITY] =
                options.opacity !== undefined ? options.opacity : 1;
            assert(typeof properties[LayerProperty.OPACITY] === 'number', 64); // Layer opacity must be a number
            properties[LayerProperty.VISIBLE] =
                options.visible !== undefined ? options.visible : true;
            properties[LayerProperty.Z_INDEX] = options.zIndex;
            properties[LayerProperty.MAX_RESOLUTION] =
                options.maxResolution !== undefined ? options.maxResolution : Infinity;
            properties[LayerProperty.MIN_RESOLUTION] =
                options.minResolution !== undefined ? options.minResolution : 0;
            properties[LayerProperty.MIN_ZOOM] =
                options.minZoom !== undefined ? options.minZoom : -Infinity;
            properties[LayerProperty.MAX_ZOOM] =
                options.maxZoom !== undefined ? options.maxZoom : Infinity;
            /**
             * @type {string}
             * @private
             */
            _this.className_ =
                properties.className !== undefined ? properties.className : 'ol-layer';
            delete properties.className;
            _this.setProperties(properties);
            /**
             * @type {import("./Layer.js").State}
             * @private
             */
            _this.state_ = null;
            return _this;
        }
        /**
         * Get the background for this layer.
         * @return {BackgroundColor|false} Layer background.
         */
        BaseLayer.prototype.getBackground = function () {
            return this.background_;
        };
        /**
         * @return {string} CSS class name.
         */
        BaseLayer.prototype.getClassName = function () {
            return this.className_;
        };
        /**
         * This method is not meant to be called by layers or layer renderers because the state
         * is incorrect if the layer is included in a layer group.
         *
         * @param {boolean} [opt_managed] Layer is managed.
         * @return {import("./Layer.js").State} Layer state.
         */
        BaseLayer.prototype.getLayerState = function (opt_managed) {
            /** @type {import("./Layer.js").State} */
            var state = this.state_ ||
                /** @type {?} */ ({
                    layer: this,
                    managed: opt_managed === undefined ? true : opt_managed,
                });
            var zIndex = this.getZIndex();
            state.opacity = clamp(Math.round(this.getOpacity() * 100) / 100, 0, 1);
            state.visible = this.getVisible();
            state.extent = this.getExtent();
            state.zIndex = zIndex === undefined && !state.managed ? Infinity : zIndex;
            state.maxResolution = this.getMaxResolution();
            state.minResolution = Math.max(this.getMinResolution(), 0);
            state.minZoom = this.getMinZoom();
            state.maxZoom = this.getMaxZoom();
            this.state_ = state;
            return state;
        };
        /**
         * @abstract
         * @param {Array<import("./Layer.js").default>} [opt_array] Array of layers (to be
         *     modified in place).
         * @return {Array<import("./Layer.js").default>} Array of layers.
         */
        BaseLayer.prototype.getLayersArray = function (opt_array) {
            return abstract();
        };
        /**
         * @abstract
         * @param {Array<import("./Layer.js").State>} [opt_states] Optional list of layer
         *     states (to be modified in place).
         * @return {Array<import("./Layer.js").State>} List of layer states.
         */
        BaseLayer.prototype.getLayerStatesArray = function (opt_states) {
            return abstract();
        };
        /**
         * Return the {@link module:ol/extent~Extent extent} of the layer or `undefined` if it
         * will be visible regardless of extent.
         * @return {import("../extent.js").Extent|undefined} The layer extent.
         * @observable
         * @api
         */
        BaseLayer.prototype.getExtent = function () {
            return /** @type {import("../extent.js").Extent|undefined} */ (this.get(LayerProperty.EXTENT));
        };
        /**
         * Return the maximum resolution of the layer.
         * @return {number} The maximum resolution of the layer.
         * @observable
         * @api
         */
        BaseLayer.prototype.getMaxResolution = function () {
            return /** @type {number} */ (this.get(LayerProperty.MAX_RESOLUTION));
        };
        /**
         * Return the minimum resolution of the layer.
         * @return {number} The minimum resolution of the layer.
         * @observable
         * @api
         */
        BaseLayer.prototype.getMinResolution = function () {
            return /** @type {number} */ (this.get(LayerProperty.MIN_RESOLUTION));
        };
        /**
         * Return the minimum zoom level of the layer.
         * @return {number} The minimum zoom level of the layer.
         * @observable
         * @api
         */
        BaseLayer.prototype.getMinZoom = function () {
            return /** @type {number} */ (this.get(LayerProperty.MIN_ZOOM));
        };
        /**
         * Return the maximum zoom level of the layer.
         * @return {number} The maximum zoom level of the layer.
         * @observable
         * @api
         */
        BaseLayer.prototype.getMaxZoom = function () {
            return /** @type {number} */ (this.get(LayerProperty.MAX_ZOOM));
        };
        /**
         * Return the opacity of the layer (between 0 and 1).
         * @return {number} The opacity of the layer.
         * @observable
         * @api
         */
        BaseLayer.prototype.getOpacity = function () {
            return /** @type {number} */ (this.get(LayerProperty.OPACITY));
        };
        /**
         * @abstract
         * @return {import("../source/Source.js").State} Source state.
         */
        BaseLayer.prototype.getSourceState = function () {
            return abstract();
        };
        /**
         * Return the visibility of the layer (`true` or `false`).
         * @return {boolean} The visibility of the layer.
         * @observable
         * @api
         */
        BaseLayer.prototype.getVisible = function () {
            return /** @type {boolean} */ (this.get(LayerProperty.VISIBLE));
        };
        /**
         * Return the Z-index of the layer, which is used to order layers before
         * rendering. The default Z-index is 0.
         * @return {number} The Z-index of the layer.
         * @observable
         * @api
         */
        BaseLayer.prototype.getZIndex = function () {
            return /** @type {number} */ (this.get(LayerProperty.Z_INDEX));
        };
        /**
         * Sets the background color.
         * @param {BackgroundColor} [opt_background] Background color.
         */
        BaseLayer.prototype.setBackground = function (opt_background) {
            this.background_ = opt_background;
            this.changed();
        };
        /**
         * Set the extent at which the layer is visible.  If `undefined`, the layer
         * will be visible at all extents.
         * @param {import("../extent.js").Extent|undefined} extent The extent of the layer.
         * @observable
         * @api
         */
        BaseLayer.prototype.setExtent = function (extent) {
            this.set(LayerProperty.EXTENT, extent);
        };
        /**
         * Set the maximum resolution at which the layer is visible.
         * @param {number} maxResolution The maximum resolution of the layer.
         * @observable
         * @api
         */
        BaseLayer.prototype.setMaxResolution = function (maxResolution) {
            this.set(LayerProperty.MAX_RESOLUTION, maxResolution);
        };
        /**
         * Set the minimum resolution at which the layer is visible.
         * @param {number} minResolution The minimum resolution of the layer.
         * @observable
         * @api
         */
        BaseLayer.prototype.setMinResolution = function (minResolution) {
            this.set(LayerProperty.MIN_RESOLUTION, minResolution);
        };
        /**
         * Set the maximum zoom (exclusive) at which the layer is visible.
         * Note that the zoom levels for layer visibility are based on the
         * view zoom level, which may be different from a tile source zoom level.
         * @param {number} maxZoom The maximum zoom of the layer.
         * @observable
         * @api
         */
        BaseLayer.prototype.setMaxZoom = function (maxZoom) {
            this.set(LayerProperty.MAX_ZOOM, maxZoom);
        };
        /**
         * Set the minimum zoom (inclusive) at which the layer is visible.
         * Note that the zoom levels for layer visibility are based on the
         * view zoom level, which may be different from a tile source zoom level.
         * @param {number} minZoom The minimum zoom of the layer.
         * @observable
         * @api
         */
        BaseLayer.prototype.setMinZoom = function (minZoom) {
            this.set(LayerProperty.MIN_ZOOM, minZoom);
        };
        /**
         * Set the opacity of the layer, allowed values range from 0 to 1.
         * @param {number} opacity The opacity of the layer.
         * @observable
         * @api
         */
        BaseLayer.prototype.setOpacity = function (opacity) {
            assert(typeof opacity === 'number', 64); // Layer opacity must be a number
            this.set(LayerProperty.OPACITY, opacity);
        };
        /**
         * Set the visibility of the layer (`true` or `false`).
         * @param {boolean} visible The visibility of the layer.
         * @observable
         * @api
         */
        BaseLayer.prototype.setVisible = function (visible) {
            this.set(LayerProperty.VISIBLE, visible);
        };
        /**
         * Set Z-index of the layer, which is used to order layers before rendering.
         * The default Z-index is 0.
         * @param {number} zindex The z-index of the layer.
         * @observable
         * @api
         */
        BaseLayer.prototype.setZIndex = function (zindex) {
            this.set(LayerProperty.Z_INDEX, zindex);
        };
        /**
         * Clean up.
         */
        BaseLayer.prototype.disposeInternal = function () {
            if (this.state_) {
                this.state_.layer = null;
                this.state_ = null;
            }
            _super.prototype.disposeInternal.call(this);
        };
        return BaseLayer;
    }(BaseObject$1));
    var BaseLayer$1 = BaseLayer;

    var __extends$k = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            if (typeof b !== "function" && b !== null)
                throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * @typedef {function(import("../PluggableMap.js").FrameState):HTMLElement} RenderFunction
     */
    /***
     * @template Return
     * @typedef {import("../Observable").OnSignature<import("../Observable").EventTypes, import("../events/Event.js").default, Return> &
     *   import("../Observable").OnSignature<import("./Base").BaseLayerObjectEventTypes|
     *     'change:source', import("../Object").ObjectEvent, Return> &
     *   import("../Observable").OnSignature<import("../render/EventType").LayerRenderEventTypes, import("../render/Event").default, Return> &
     *   import("../Observable").CombinedOnSignature<import("../Observable").EventTypes|import("./Base").BaseLayerObjectEventTypes|'change:source'|
     *     import("../render/EventType").LayerRenderEventTypes, Return>} LayerOnSignature
     */
    /**
     * @template {import("../source/Source.js").default} [SourceType=import("../source/Source.js").default]
     * @typedef {Object} Options
     * @property {string} [className='ol-layer'] A CSS class name to set to the layer element.
     * @property {number} [opacity=1] Opacity (0, 1).
     * @property {boolean} [visible=true] Visibility.
     * @property {import("../extent.js").Extent} [extent] The bounding extent for layer rendering.  The layer will not be
     * rendered outside of this extent.
     * @property {number} [zIndex] The z-index for layer rendering.  At rendering time, the layers
     * will be ordered, first by Z-index and then by position. When `undefined`, a `zIndex` of 0 is assumed
     * for layers that are added to the map's `layers` collection, or `Infinity` when the layer's `setMap()`
     * method was used.
     * @property {number} [minResolution] The minimum resolution (inclusive) at which this layer will be
     * visible.
     * @property {number} [maxResolution] The maximum resolution (exclusive) below which this layer will
     * be visible.
     * @property {number} [minZoom] The minimum view zoom level (exclusive) above which this layer will be
     * visible.
     * @property {number} [maxZoom] The maximum view zoom level (inclusive) at which this layer will
     * be visible.
     * @property {SourceType} [source] Source for this layer.  If not provided to the constructor,
     * the source can be set by calling {@link module:ol/layer/Layer~Layer#setSource layer.setSource(source)} after
     * construction.
     * @property {import("../PluggableMap.js").default|null} [map] Map.
     * @property {RenderFunction} [render] Render function. Takes the frame state as input and is expected to return an
     * HTML element. Will overwrite the default rendering for the layer.
     * @property {Object<string, *>} [properties] Arbitrary observable properties. Can be accessed with `#get()` and `#set()`.
     */
    /**
     * @typedef {Object} State
     * @property {import("./Layer.js").default} layer Layer.
     * @property {number} opacity Opacity, the value is rounded to two digits to appear after the decimal point.
     * @property {boolean} visible Visible.
     * @property {boolean} managed Managed.
     * @property {import("../extent.js").Extent} [extent] Extent.
     * @property {number} zIndex ZIndex.
     * @property {number} maxResolution Maximum resolution.
     * @property {number} minResolution Minimum resolution.
     * @property {number} minZoom Minimum zoom.
     * @property {number} maxZoom Maximum zoom.
     */
    /**
     * @classdesc
     * Base class from which all layer types are derived. This should only be instantiated
     * in the case where a custom layer is added to the map with a custom `render` function.
     * Such a function can be specified in the `options` object, and is expected to return an HTML element.
     *
     * A visual representation of raster or vector map data.
     * Layers group together those properties that pertain to how the data is to be
     * displayed, irrespective of the source of that data.
     *
     * Layers are usually added to a map with {@link import("../PluggableMap.js").default#addLayer map.addLayer()}. Components
     * like {@link module:ol/interaction/Draw~Draw} use unmanaged layers
     * internally. These unmanaged layers are associated with the map using
     * {@link module:ol/layer/Layer~Layer#setMap} instead.
     *
     * A generic `change` event is fired when the state of the source changes.
     *
     * Please note that for performance reasons several layers might get rendered to
     * the same HTML element, which will cause {@link import("../PluggableMap.js").default#forEachLayerAtPixel map.forEachLayerAtPixel()} to
     * give false positives. To avoid this, apply different `className` properties to the
     * layers at creation time.
     *
     * @fires import("../render/Event.js").RenderEvent#prerender
     * @fires import("../render/Event.js").RenderEvent#postrender
     *
     * @template {import("../source/Source.js").default} [SourceType=import("../source/Source.js").default]
     * @template {import("../renderer/Layer.js").default} [RendererType=import("../renderer/Layer.js").default]
     * @api
     */
    var Layer = /** @class */ (function (_super) {
        __extends$k(Layer, _super);
        /**
         * @param {Options<SourceType>} options Layer options.
         */
        function Layer(options) {
            var _this = this;
            var baseOptions = assign({}, options);
            delete baseOptions.source;
            _this = _super.call(this, baseOptions) || this;
            /***
             * @type {LayerOnSignature<import("../events").EventsKey>}
             */
            _this.on;
            /***
             * @type {LayerOnSignature<import("../events").EventsKey>}
             */
            _this.once;
            /***
             * @type {LayerOnSignature<void>}
             */
            _this.un;
            /**
             * @private
             * @type {?import("../events.js").EventsKey}
             */
            _this.mapPrecomposeKey_ = null;
            /**
             * @private
             * @type {?import("../events.js").EventsKey}
             */
            _this.mapRenderKey_ = null;
            /**
             * @private
             * @type {?import("../events.js").EventsKey}
             */
            _this.sourceChangeKey_ = null;
            /**
             * @private
             * @type {RendererType}
             */
            _this.renderer_ = null;
            /**
             * @protected
             * @type {boolean}
             */
            _this.rendered = false;
            // Overwrite default render method with a custom one
            if (options.render) {
                _this.render = options.render;
            }
            if (options.map) {
                _this.setMap(options.map);
            }
            _this.addChangeListener(LayerProperty.SOURCE, _this.handleSourcePropertyChange_);
            var source = options.source
                ? /** @type {SourceType} */ (options.source)
                : null;
            _this.setSource(source);
            return _this;
        }
        /**
         * @param {Array<import("./Layer.js").default>} [opt_array] Array of layers (to be modified in place).
         * @return {Array<import("./Layer.js").default>} Array of layers.
         */
        Layer.prototype.getLayersArray = function (opt_array) {
            var array = opt_array ? opt_array : [];
            array.push(this);
            return array;
        };
        /**
         * @param {Array<import("./Layer.js").State>} [opt_states] Optional list of layer states (to be modified in place).
         * @return {Array<import("./Layer.js").State>} List of layer states.
         */
        Layer.prototype.getLayerStatesArray = function (opt_states) {
            var states = opt_states ? opt_states : [];
            states.push(this.getLayerState());
            return states;
        };
        /**
         * Get the layer source.
         * @return {SourceType|null} The layer source (or `null` if not yet set).
         * @observable
         * @api
         */
        Layer.prototype.getSource = function () {
            return /** @type {SourceType} */ (this.get(LayerProperty.SOURCE)) || null;
        };
        /**
         * @return {SourceType|null} The source being rendered.
         */
        Layer.prototype.getRenderSource = function () {
            return this.getSource();
        };
        /**
         * @return {import("../source/Source.js").State} Source state.
         */
        Layer.prototype.getSourceState = function () {
            var source = this.getSource();
            return !source ? 'undefined' : source.getState();
        };
        /**
         * @private
         */
        Layer.prototype.handleSourceChange_ = function () {
            this.changed();
        };
        /**
         * @private
         */
        Layer.prototype.handleSourcePropertyChange_ = function () {
            if (this.sourceChangeKey_) {
                unlistenByKey(this.sourceChangeKey_);
                this.sourceChangeKey_ = null;
            }
            var source = this.getSource();
            if (source) {
                this.sourceChangeKey_ = listen(source, EventType.CHANGE, this.handleSourceChange_, this);
            }
            this.changed();
        };
        /**
         * @param {import("../pixel").Pixel} pixel Pixel.
         * @return {Promise<Array<import("../Feature").default>>} Promise that resolves with
         * an array of features.
         */
        Layer.prototype.getFeatures = function (pixel) {
            if (!this.renderer_) {
                return new Promise(function (resolve) { return resolve([]); });
            }
            return this.renderer_.getFeatures(pixel);
        };
        /**
         * @param {import("../pixel").Pixel} pixel Pixel.
         * @return {Uint8ClampedArray|Uint8Array|Float32Array|DataView|null} Pixel data.
         */
        Layer.prototype.getData = function (pixel) {
            if (!this.renderer_ || !this.rendered) {
                return null;
            }
            return this.renderer_.getData(pixel);
        };
        /**
         * In charge to manage the rendering of the layer. One layer type is
         * bounded with one layer renderer.
         * @param {?import("../PluggableMap.js").FrameState} frameState Frame state.
         * @param {HTMLElement} target Target which the renderer may (but need not) use
         * for rendering its content.
         * @return {HTMLElement} The rendered element.
         */
        Layer.prototype.render = function (frameState, target) {
            var layerRenderer = this.getRenderer();
            if (layerRenderer.prepareFrame(frameState)) {
                this.rendered = true;
                return layerRenderer.renderFrame(frameState, target);
            }
        };
        /**
         * Called when a layer is not visible during a map render.
         */
        Layer.prototype.unrender = function () {
            this.rendered = false;
        };
        /**
         * For use inside the library only.
         * @param {import("../PluggableMap.js").default|null} map Map.
         */
        Layer.prototype.setMapInternal = function (map) {
            if (!map) {
                this.unrender();
            }
            this.set(LayerProperty.MAP, map);
        };
        /**
         * For use inside the library only.
         * @return {import("../PluggableMap.js").default|null} Map.
         */
        Layer.prototype.getMapInternal = function () {
            return this.get(LayerProperty.MAP);
        };
        /**
         * Sets the layer to be rendered on top of other layers on a map. The map will
         * not manage this layer in its layers collection, and the callback in
         * {@link module:ol/Map~Map#forEachLayerAtPixel} will receive `null` as layer. This
         * is useful for temporary layers. To remove an unmanaged layer from the map,
         * use `#setMap(null)`.
         *
         * To add the layer to a map and have it managed by the map, use
         * {@link module:ol/Map~Map#addLayer} instead.
         * @param {import("../PluggableMap.js").default|null} map Map.
         * @api
         */
        Layer.prototype.setMap = function (map) {
            if (this.mapPrecomposeKey_) {
                unlistenByKey(this.mapPrecomposeKey_);
                this.mapPrecomposeKey_ = null;
            }
            if (!map) {
                this.changed();
            }
            if (this.mapRenderKey_) {
                unlistenByKey(this.mapRenderKey_);
                this.mapRenderKey_ = null;
            }
            if (map) {
                this.mapPrecomposeKey_ = listen(map, RenderEventType.PRECOMPOSE, function (evt) {
                    var renderEvent = 
                    /** @type {import("../render/Event.js").default} */ (evt);
                    var layerStatesArray = renderEvent.frameState.layerStatesArray;
                    var layerState = this.getLayerState(false);
                    // A layer can only be added to the map once. Use either `layer.setMap()` or `map.addLayer()`, not both.
                    assert(!layerStatesArray.some(function (arrayLayerState) {
                        return arrayLayerState.layer === layerState.layer;
                    }), 67);
                    layerStatesArray.push(layerState);
                }, this);
                this.mapRenderKey_ = listen(this, EventType.CHANGE, map.render, map);
                this.changed();
            }
        };
        /**
         * Set the layer source.
         * @param {SourceType|null} source The layer source.
         * @observable
         * @api
         */
        Layer.prototype.setSource = function (source) {
            this.set(LayerProperty.SOURCE, source);
        };
        /**
         * Get the renderer for this layer.
         * @return {RendererType|null} The layer renderer.
         */
        Layer.prototype.getRenderer = function () {
            if (!this.renderer_) {
                this.renderer_ = this.createRenderer();
            }
            return this.renderer_;
        };
        /**
         * @return {boolean} The layer has a renderer.
         */
        Layer.prototype.hasRenderer = function () {
            return !!this.renderer_;
        };
        /**
         * Create a renderer for this layer.
         * @return {RendererType} A layer renderer.
         * @protected
         */
        Layer.prototype.createRenderer = function () {
            return null;
        };
        /**
         * Clean up.
         */
        Layer.prototype.disposeInternal = function () {
            if (this.renderer_) {
                this.renderer_.dispose();
                delete this.renderer_;
            }
            this.setSource(null);
            _super.prototype.disposeInternal.call(this);
        };
        return Layer;
    }(BaseLayer$1));
    var Layer$1 = Layer;

    function quickselect(arr, k, left, right, compare) {
        quickselectStep(arr, k, left || 0, right || (arr.length - 1), compare || defaultCompare);
    }

    function quickselectStep(arr, k, left, right, compare) {

        while (right > left) {
            if (right - left > 600) {
                var n = right - left + 1;
                var m = k - left + 1;
                var z = Math.log(n);
                var s = 0.5 * Math.exp(2 * z / 3);
                var sd = 0.5 * Math.sqrt(z * s * (n - s) / n) * (m - n / 2 < 0 ? -1 : 1);
                var newLeft = Math.max(left, Math.floor(k - m * s / n + sd));
                var newRight = Math.min(right, Math.floor(k + (n - m) * s / n + sd));
                quickselectStep(arr, k, newLeft, newRight, compare);
            }

            var t = arr[k];
            var i = left;
            var j = right;

            swap(arr, left, k);
            if (compare(arr[right], t) > 0) swap(arr, left, right);

            while (i < j) {
                swap(arr, i, j);
                i++;
                j--;
                while (compare(arr[i], t) < 0) i++;
                while (compare(arr[j], t) > 0) j--;
            }

            if (compare(arr[left], t) === 0) swap(arr, left, j);
            else {
                j++;
                swap(arr, j, right);
            }

            if (j <= k) left = j + 1;
            if (k <= j) right = j - 1;
        }
    }

    function swap(arr, i, j) {
        var tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
    }

    function defaultCompare(a, b) {
        return a < b ? -1 : a > b ? 1 : 0;
    }

    let RBush$2 = class RBush {
        constructor(maxEntries = 9) {
            // max entries in a node is 9 by default; min node fill is 40% for best performance
            this._maxEntries = Math.max(4, maxEntries);
            this._minEntries = Math.max(2, Math.ceil(this._maxEntries * 0.4));
            this.clear();
        }

        all() {
            return this._all(this.data, []);
        }

        search(bbox) {
            let node = this.data;
            const result = [];

            if (!intersects(bbox, node)) return result;

            const toBBox = this.toBBox;
            const nodesToSearch = [];

            while (node) {
                for (let i = 0; i < node.children.length; i++) {
                    const child = node.children[i];
                    const childBBox = node.leaf ? toBBox(child) : child;

                    if (intersects(bbox, childBBox)) {
                        if (node.leaf) result.push(child);
                        else if (contains(bbox, childBBox)) this._all(child, result);
                        else nodesToSearch.push(child);
                    }
                }
                node = nodesToSearch.pop();
            }

            return result;
        }

        collides(bbox) {
            let node = this.data;

            if (!intersects(bbox, node)) return false;

            const nodesToSearch = [];
            while (node) {
                for (let i = 0; i < node.children.length; i++) {
                    const child = node.children[i];
                    const childBBox = node.leaf ? this.toBBox(child) : child;

                    if (intersects(bbox, childBBox)) {
                        if (node.leaf || contains(bbox, childBBox)) return true;
                        nodesToSearch.push(child);
                    }
                }
                node = nodesToSearch.pop();
            }

            return false;
        }

        load(data) {
            if (!(data && data.length)) return this;

            if (data.length < this._minEntries) {
                for (let i = 0; i < data.length; i++) {
                    this.insert(data[i]);
                }
                return this;
            }

            // recursively build the tree with the given data from scratch using OMT algorithm
            let node = this._build(data.slice(), 0, data.length - 1, 0);

            if (!this.data.children.length) {
                // save as is if tree is empty
                this.data = node;

            } else if (this.data.height === node.height) {
                // split root if trees have the same height
                this._splitRoot(this.data, node);

            } else {
                if (this.data.height < node.height) {
                    // swap trees if inserted one is bigger
                    const tmpNode = this.data;
                    this.data = node;
                    node = tmpNode;
                }

                // insert the small tree into the large tree at appropriate level
                this._insert(node, this.data.height - node.height - 1, true);
            }

            return this;
        }

        insert(item) {
            if (item) this._insert(item, this.data.height - 1);
            return this;
        }

        clear() {
            this.data = createNode([]);
            return this;
        }

        remove(item, equalsFn) {
            if (!item) return this;

            let node = this.data;
            const bbox = this.toBBox(item);
            const path = [];
            const indexes = [];
            let i, parent, goingUp;

            // depth-first iterative tree traversal
            while (node || path.length) {

                if (!node) { // go up
                    node = path.pop();
                    parent = path[path.length - 1];
                    i = indexes.pop();
                    goingUp = true;
                }

                if (node.leaf) { // check current node
                    const index = findItem(item, node.children, equalsFn);

                    if (index !== -1) {
                        // item found, remove the item and condense tree upwards
                        node.children.splice(index, 1);
                        path.push(node);
                        this._condense(path);
                        return this;
                    }
                }

                if (!goingUp && !node.leaf && contains(node, bbox)) { // go down
                    path.push(node);
                    indexes.push(i);
                    i = 0;
                    parent = node;
                    node = node.children[0];

                } else if (parent) { // go right
                    i++;
                    node = parent.children[i];
                    goingUp = false;

                } else node = null; // nothing found
            }

            return this;
        }

        toBBox(item) { return item; }

        compareMinX(a, b) { return a.minX - b.minX; }
        compareMinY(a, b) { return a.minY - b.minY; }

        toJSON() { return this.data; }

        fromJSON(data) {
            this.data = data;
            return this;
        }

        _all(node, result) {
            const nodesToSearch = [];
            while (node) {
                if (node.leaf) result.push(...node.children);
                else nodesToSearch.push(...node.children);

                node = nodesToSearch.pop();
            }
            return result;
        }

        _build(items, left, right, height) {

            const N = right - left + 1;
            let M = this._maxEntries;
            let node;

            if (N <= M) {
                // reached leaf level; return leaf
                node = createNode(items.slice(left, right + 1));
                calcBBox(node, this.toBBox);
                return node;
            }

            if (!height) {
                // target height of the bulk-loaded tree
                height = Math.ceil(Math.log(N) / Math.log(M));

                // target number of root entries to maximize storage utilization
                M = Math.ceil(N / Math.pow(M, height - 1));
            }

            node = createNode([]);
            node.leaf = false;
            node.height = height;

            // split the items into M mostly square tiles

            const N2 = Math.ceil(N / M);
            const N1 = N2 * Math.ceil(Math.sqrt(M));

            multiSelect(items, left, right, N1, this.compareMinX);

            for (let i = left; i <= right; i += N1) {

                const right2 = Math.min(i + N1 - 1, right);

                multiSelect(items, i, right2, N2, this.compareMinY);

                for (let j = i; j <= right2; j += N2) {

                    const right3 = Math.min(j + N2 - 1, right2);

                    // pack each entry recursively
                    node.children.push(this._build(items, j, right3, height - 1));
                }
            }

            calcBBox(node, this.toBBox);

            return node;
        }

        _chooseSubtree(bbox, node, level, path) {
            while (true) {
                path.push(node);

                if (node.leaf || path.length - 1 === level) break;

                let minArea = Infinity;
                let minEnlargement = Infinity;
                let targetNode;

                for (let i = 0; i < node.children.length; i++) {
                    const child = node.children[i];
                    const area = bboxArea(child);
                    const enlargement = enlargedArea(bbox, child) - area;

                    // choose entry with the least area enlargement
                    if (enlargement < minEnlargement) {
                        minEnlargement = enlargement;
                        minArea = area < minArea ? area : minArea;
                        targetNode = child;

                    } else if (enlargement === minEnlargement) {
                        // otherwise choose one with the smallest area
                        if (area < minArea) {
                            minArea = area;
                            targetNode = child;
                        }
                    }
                }

                node = targetNode || node.children[0];
            }

            return node;
        }

        _insert(item, level, isNode) {
            const bbox = isNode ? item : this.toBBox(item);
            const insertPath = [];

            // find the best node for accommodating the item, saving all nodes along the path too
            const node = this._chooseSubtree(bbox, this.data, level, insertPath);

            // put the item into the node
            node.children.push(item);
            extend(node, bbox);

            // split on node overflow; propagate upwards if necessary
            while (level >= 0) {
                if (insertPath[level].children.length > this._maxEntries) {
                    this._split(insertPath, level);
                    level--;
                } else break;
            }

            // adjust bboxes along the insertion path
            this._adjustParentBBoxes(bbox, insertPath, level);
        }

        // split overflowed node into two
        _split(insertPath, level) {
            const node = insertPath[level];
            const M = node.children.length;
            const m = this._minEntries;

            this._chooseSplitAxis(node, m, M);

            const splitIndex = this._chooseSplitIndex(node, m, M);

            const newNode = createNode(node.children.splice(splitIndex, node.children.length - splitIndex));
            newNode.height = node.height;
            newNode.leaf = node.leaf;

            calcBBox(node, this.toBBox);
            calcBBox(newNode, this.toBBox);

            if (level) insertPath[level - 1].children.push(newNode);
            else this._splitRoot(node, newNode);
        }

        _splitRoot(node, newNode) {
            // split root node
            this.data = createNode([node, newNode]);
            this.data.height = node.height + 1;
            this.data.leaf = false;
            calcBBox(this.data, this.toBBox);
        }

        _chooseSplitIndex(node, m, M) {
            let index;
            let minOverlap = Infinity;
            let minArea = Infinity;

            for (let i = m; i <= M - m; i++) {
                const bbox1 = distBBox(node, 0, i, this.toBBox);
                const bbox2 = distBBox(node, i, M, this.toBBox);

                const overlap = intersectionArea(bbox1, bbox2);
                const area = bboxArea(bbox1) + bboxArea(bbox2);

                // choose distribution with minimum overlap
                if (overlap < minOverlap) {
                    minOverlap = overlap;
                    index = i;

                    minArea = area < minArea ? area : minArea;

                } else if (overlap === minOverlap) {
                    // otherwise choose distribution with minimum area
                    if (area < minArea) {
                        minArea = area;
                        index = i;
                    }
                }
            }

            return index || M - m;
        }

        // sorts node children by the best axis for split
        _chooseSplitAxis(node, m, M) {
            const compareMinX = node.leaf ? this.compareMinX : compareNodeMinX;
            const compareMinY = node.leaf ? this.compareMinY : compareNodeMinY;
            const xMargin = this._allDistMargin(node, m, M, compareMinX);
            const yMargin = this._allDistMargin(node, m, M, compareMinY);

            // if total distributions margin value is minimal for x, sort by minX,
            // otherwise it's already sorted by minY
            if (xMargin < yMargin) node.children.sort(compareMinX);
        }

        // total margin of all possible split distributions where each node is at least m full
        _allDistMargin(node, m, M, compare) {
            node.children.sort(compare);

            const toBBox = this.toBBox;
            const leftBBox = distBBox(node, 0, m, toBBox);
            const rightBBox = distBBox(node, M - m, M, toBBox);
            let margin = bboxMargin(leftBBox) + bboxMargin(rightBBox);

            for (let i = m; i < M - m; i++) {
                const child = node.children[i];
                extend(leftBBox, node.leaf ? toBBox(child) : child);
                margin += bboxMargin(leftBBox);
            }

            for (let i = M - m - 1; i >= m; i--) {
                const child = node.children[i];
                extend(rightBBox, node.leaf ? toBBox(child) : child);
                margin += bboxMargin(rightBBox);
            }

            return margin;
        }

        _adjustParentBBoxes(bbox, path, level) {
            // adjust bboxes along the given tree path
            for (let i = level; i >= 0; i--) {
                extend(path[i], bbox);
            }
        }

        _condense(path) {
            // go through the path, removing empty nodes and updating bboxes
            for (let i = path.length - 1, siblings; i >= 0; i--) {
                if (path[i].children.length === 0) {
                    if (i > 0) {
                        siblings = path[i - 1].children;
                        siblings.splice(siblings.indexOf(path[i]), 1);

                    } else this.clear();

                } else calcBBox(path[i], this.toBBox);
            }
        }
    };

    function findItem(item, items, equalsFn) {
        if (!equalsFn) return items.indexOf(item);

        for (let i = 0; i < items.length; i++) {
            if (equalsFn(item, items[i])) return i;
        }
        return -1;
    }

    // calculate node's bbox from bboxes of its children
    function calcBBox(node, toBBox) {
        distBBox(node, 0, node.children.length, toBBox, node);
    }

    // min bounding rectangle of node children from k to p-1
    function distBBox(node, k, p, toBBox, destNode) {
        if (!destNode) destNode = createNode(null);
        destNode.minX = Infinity;
        destNode.minY = Infinity;
        destNode.maxX = -Infinity;
        destNode.maxY = -Infinity;

        for (let i = k; i < p; i++) {
            const child = node.children[i];
            extend(destNode, node.leaf ? toBBox(child) : child);
        }

        return destNode;
    }

    function extend(a, b) {
        a.minX = Math.min(a.minX, b.minX);
        a.minY = Math.min(a.minY, b.minY);
        a.maxX = Math.max(a.maxX, b.maxX);
        a.maxY = Math.max(a.maxY, b.maxY);
        return a;
    }

    function compareNodeMinX(a, b) { return a.minX - b.minX; }
    function compareNodeMinY(a, b) { return a.minY - b.minY; }

    function bboxArea(a)   { return (a.maxX - a.minX) * (a.maxY - a.minY); }
    function bboxMargin(a) { return (a.maxX - a.minX) + (a.maxY - a.minY); }

    function enlargedArea(a, b) {
        return (Math.max(b.maxX, a.maxX) - Math.min(b.minX, a.minX)) *
               (Math.max(b.maxY, a.maxY) - Math.min(b.minY, a.minY));
    }

    function intersectionArea(a, b) {
        const minX = Math.max(a.minX, b.minX);
        const minY = Math.max(a.minY, b.minY);
        const maxX = Math.min(a.maxX, b.maxX);
        const maxY = Math.min(a.maxY, b.maxY);

        return Math.max(0, maxX - minX) *
               Math.max(0, maxY - minY);
    }

    function contains(a, b) {
        return a.minX <= b.minX &&
               a.minY <= b.minY &&
               b.maxX <= a.maxX &&
               b.maxY <= a.maxY;
    }

    function intersects(a, b) {
        return b.minX <= a.maxX &&
               b.minY <= a.maxY &&
               b.maxX >= a.minX &&
               b.maxY >= a.minY;
    }

    function createNode(children) {
        return {
            children,
            height: 1,
            leaf: true,
            minX: Infinity,
            minY: Infinity,
            maxX: -Infinity,
            maxY: -Infinity
        };
    }

    // sort an array so that items come in groups of n unsorted items, with groups sorted between each other;
    // combines selection algorithm with binary divide & conquer approach

    function multiSelect(arr, left, right, n, compare) {
        const stack = [left, right];

        while (stack.length) {
            right = stack.pop();
            left = stack.pop();

            if (right - left <= n) continue;

            const mid = left + Math.ceil((right - left) / n / 2) * n;
            quickselect(arr, mid, left, right, compare);

            stack.push(left, mid, mid, right);
        }
    }

    var __extends$j = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            if (typeof b !== "function" && b !== null)
                throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * @template {import("../source/Vector.js").default|import("../source/VectorTile.js").default} VectorSourceType
     * @typedef {Object} Options
     * @property {string} [className='ol-layer'] A CSS class name to set to the layer element.
     * @property {number} [opacity=1] Opacity (0, 1).
     * @property {boolean} [visible=true] Visibility.
     * @property {import("../extent.js").Extent} [extent] The bounding extent for layer rendering.  The layer will not be
     * rendered outside of this extent.
     * @property {number} [zIndex] The z-index for layer rendering.  At rendering time, the layers
     * will be ordered, first by Z-index and then by position. When `undefined`, a `zIndex` of 0 is assumed
     * for layers that are added to the map's `layers` collection, or `Infinity` when the layer's `setMap()`
     * method was used.
     * @property {number} [minResolution] The minimum resolution (inclusive) at which this layer will be
     * visible.
     * @property {number} [maxResolution] The maximum resolution (exclusive) below which this layer will
     * be visible.
     * @property {number} [minZoom] The minimum view zoom level (exclusive) above which this layer will be
     * visible.
     * @property {number} [maxZoom] The maximum view zoom level (inclusive) at which this layer will
     * be visible.
     * @property {import("../render.js").OrderFunction} [renderOrder] Render order. Function to be used when sorting
     * features before rendering. By default features are drawn in the order that they are created. Use
     * `null` to avoid the sort, but get an undefined draw order.
     * @property {number} [renderBuffer=100] The buffer in pixels around the viewport extent used by the
     * renderer when getting features from the vector source for the rendering or hit-detection.
     * Recommended value: the size of the largest symbol, line width or label.
     * @property {VectorSourceType} [source] Source.
     * @property {import("../PluggableMap.js").default} [map] Sets the layer as overlay on a map. The map will not manage
     * this layer in its layers collection, and the layer will be rendered on top. This is useful for
     * temporary layers. The standard way to add a layer to a map and have it managed by the map is to
     * use {@link import("../PluggableMap.js").default#addLayer map.addLayer()}.
     * @property {boolean} [declutter=false] Declutter images and text. Decluttering is applied to all
     * image and text styles of all Vector and VectorTile layers that have set this to `true`. The priority
     * is defined by the z-index of the layer, the `zIndex` of the style and the render order of features.
     * Higher z-index means higher priority. Within the same z-index, a feature rendered before another has
     * higher priority.
     *
     * As an optimization decluttered features from layers with the same `className` are rendered above
     * the fill and stroke styles of all of those layers regardless of z-index.  To opt out of this
     * behavior and place declutterd features with their own layer configure the layer with a `className`
     * other than `ol-layer`.
     * @property {import("../style/Style.js").StyleLike|null} [style] Layer style. When set to `null`, only
     * features that have their own style will be rendered. See {@link module:ol/style/Style~Style} for the default style
     * which will be used if this is not set.
     * @property {import("./Base.js").BackgroundColor} [background] Background color for the layer. If not specified, no background
     * will be rendered.
     * @property {boolean} [updateWhileAnimating=false] When set to `true`, feature batches will
     * be recreated during animations. This means that no vectors will be shown clipped, but the
     * setting will have a performance impact for large amounts of vector data. When set to `false`,
     * batches will be recreated when no animation is active.
     * @property {boolean} [updateWhileInteracting=false] When set to `true`, feature batches will
     * be recreated during interactions. See also `updateWhileAnimating`.
     * @property {Object<string, *>} [properties] Arbitrary observable properties. Can be accessed with `#get()` and `#set()`.
     */
    /**
     * @enum {string}
     * @private
     */
    var Property$1 = {
        RENDER_ORDER: 'renderOrder',
    };
    /**
     * @classdesc
     * Vector data that is rendered client-side.
     * Note that any property set in the options is set as a {@link module:ol/Object~BaseObject}
     * property on the layer object; for example, setting `title: 'My Title'` in the
     * options means that `title` is observable, and has get/set accessors.
     *
     * @template {import("../source/Vector.js").default|import("../source/VectorTile.js").default} VectorSourceType
     * @template {import("../renderer/canvas/VectorLayer.js").default|import("../renderer/canvas/VectorTileLayer.js").default|import("../renderer/canvas/VectorImageLayer.js").default|import("../renderer/webgl/PointsLayer.js").default} RendererType
     * @extends {Layer<VectorSourceType, RendererType>}
     * @api
     */
    var BaseVectorLayer = /** @class */ (function (_super) {
        __extends$j(BaseVectorLayer, _super);
        /**
         * @param {Options<VectorSourceType>} [opt_options] Options.
         */
        function BaseVectorLayer(opt_options) {
            var _this = this;
            var options = opt_options ? opt_options : {};
            var baseOptions = assign({}, options);
            delete baseOptions.style;
            delete baseOptions.renderBuffer;
            delete baseOptions.updateWhileAnimating;
            delete baseOptions.updateWhileInteracting;
            _this = _super.call(this, baseOptions) || this;
            /**
             * @private
             * @type {boolean}
             */
            _this.declutter_ =
                options.declutter !== undefined ? options.declutter : false;
            /**
             * @type {number}
             * @private
             */
            _this.renderBuffer_ =
                options.renderBuffer !== undefined ? options.renderBuffer : 100;
            /**
             * User provided style.
             * @type {import("../style/Style.js").StyleLike}
             * @private
             */
            _this.style_ = null;
            /**
             * Style function for use within the library.
             * @type {import("../style/Style.js").StyleFunction|undefined}
             * @private
             */
            _this.styleFunction_ = undefined;
            _this.setStyle(options.style);
            /**
             * @type {boolean}
             * @private
             */
            _this.updateWhileAnimating_ =
                options.updateWhileAnimating !== undefined
                    ? options.updateWhileAnimating
                    : false;
            /**
             * @type {boolean}
             * @private
             */
            _this.updateWhileInteracting_ =
                options.updateWhileInteracting !== undefined
                    ? options.updateWhileInteracting
                    : false;
            return _this;
        }
        /**
         * @return {boolean} Declutter.
         */
        BaseVectorLayer.prototype.getDeclutter = function () {
            return this.declutter_;
        };
        /**
         * Get the topmost feature that intersects the given pixel on the viewport. Returns a promise
         * that resolves with an array of features. The array will either contain the topmost feature
         * when a hit was detected, or it will be empty.
         *
         * The hit detection algorithm used for this method is optimized for performance, but is less
         * accurate than the one used in {@link import("../PluggableMap.js").default#getFeaturesAtPixel}: Text
         * is not considered, and icons are only represented by their bounding box instead of the exact
         * image.
         *
         * @param {import("../pixel.js").Pixel} pixel Pixel.
         * @return {Promise<Array<import("../Feature").default>>} Promise that resolves with an array of features.
         * @api
         */
        BaseVectorLayer.prototype.getFeatures = function (pixel) {
            return _super.prototype.getFeatures.call(this, pixel);
        };
        /**
         * @return {number|undefined} Render buffer.
         */
        BaseVectorLayer.prototype.getRenderBuffer = function () {
            return this.renderBuffer_;
        };
        /**
         * @return {function(import("../Feature.js").default, import("../Feature.js").default): number|null|undefined} Render
         *     order.
         */
        BaseVectorLayer.prototype.getRenderOrder = function () {
            return /** @type {import("../render.js").OrderFunction|null|undefined} */ (this.get(Property$1.RENDER_ORDER));
        };
        /**
         * Get the style for features.  This returns whatever was passed to the `style`
         * option at construction or to the `setStyle` method.
         * @return {import("../style/Style.js").StyleLike|null|undefined} Layer style.
         * @api
         */
        BaseVectorLayer.prototype.getStyle = function () {
            return this.style_;
        };
        /**
         * Get the style function.
         * @return {import("../style/Style.js").StyleFunction|undefined} Layer style function.
         * @api
         */
        BaseVectorLayer.prototype.getStyleFunction = function () {
            return this.styleFunction_;
        };
        /**
         * @return {boolean} Whether the rendered layer should be updated while
         *     animating.
         */
        BaseVectorLayer.prototype.getUpdateWhileAnimating = function () {
            return this.updateWhileAnimating_;
        };
        /**
         * @return {boolean} Whether the rendered layer should be updated while
         *     interacting.
         */
        BaseVectorLayer.prototype.getUpdateWhileInteracting = function () {
            return this.updateWhileInteracting_;
        };
        /**
         * Render declutter items for this layer
         * @param {import("../PluggableMap.js").FrameState} frameState Frame state.
         */
        BaseVectorLayer.prototype.renderDeclutter = function (frameState) {
            if (!frameState.declutterTree) {
                frameState.declutterTree = new RBush$2(9);
            }
            /** @type {*} */ (this.getRenderer()).renderDeclutter(frameState);
        };
        /**
         * @param {import("../render.js").OrderFunction|null|undefined} renderOrder
         *     Render order.
         */
        BaseVectorLayer.prototype.setRenderOrder = function (renderOrder) {
            this.set(Property$1.RENDER_ORDER, renderOrder);
        };
        /**
         * Set the style for features.  This can be a single style object, an array
         * of styles, or a function that takes a feature and resolution and returns
         * an array of styles. If set to `null`, the layer has no style (a `null` style),
         * so only features that have their own styles will be rendered in the layer. Call
         * `setStyle()` without arguments to reset to the default style. See
         * {@link module:ol/style/Style~Style} for information on the default style.
         * @param {import("../style/Style.js").StyleLike|null} [opt_style] Layer style.
         * @api
         */
        BaseVectorLayer.prototype.setStyle = function (opt_style) {
            this.style_ = opt_style !== undefined ? opt_style : createDefaultStyle;
            this.styleFunction_ =
                opt_style === null ? undefined : toFunction(this.style_);
            this.changed();
        };
        return BaseVectorLayer;
    }(Layer$1));
    var BaseVectorLayer$1 = BaseVectorLayer;

    /**
     * @module ol/render/canvas/Instruction
     */
    /**
     * @enum {number}
     */
    var Instruction = {
        BEGIN_GEOMETRY: 0,
        BEGIN_PATH: 1,
        CIRCLE: 2,
        CLOSE_PATH: 3,
        CUSTOM: 4,
        DRAW_CHARS: 5,
        DRAW_IMAGE: 6,
        END_GEOMETRY: 7,
        FILL: 8,
        MOVE_TO_LINE_TO: 9,
        SET_FILL_STYLE: 10,
        SET_STROKE_STYLE: 11,
        STROKE: 12,
    };
    /**
     * @type {Array<Instruction>}
     */
    var fillInstruction = [Instruction.FILL];
    /**
     * @type {Array<Instruction>}
     */
    var strokeInstruction = [Instruction.STROKE];
    /**
     * @type {Array<Instruction>}
     */
    var beginPathInstruction = [Instruction.BEGIN_PATH];
    /**
     * @type {Array<Instruction>}
     */
    var closePathInstruction = [Instruction.CLOSE_PATH];
    var CanvasInstruction = Instruction;

    /**
     * @module ol/render/VectorContext
     */
    /**
     * @classdesc
     * Context for drawing geometries.  A vector context is available on render
     * events and does not need to be constructed directly.
     * @api
     */
    var VectorContext = /** @class */ (function () {
        function VectorContext() {
        }
        /**
         * Render a geometry with a custom renderer.
         *
         * @param {import("../geom/SimpleGeometry.js").default} geometry Geometry.
         * @param {import("../Feature.js").FeatureLike} feature Feature.
         * @param {Function} renderer Renderer.
         * @param {Function} hitDetectionRenderer Renderer.
         */
        VectorContext.prototype.drawCustom = function (geometry, feature, renderer, hitDetectionRenderer) { };
        /**
         * Render a geometry.
         *
         * @param {import("../geom/Geometry.js").default} geometry The geometry to render.
         */
        VectorContext.prototype.drawGeometry = function (geometry) { };
        /**
         * Set the rendering style.
         *
         * @param {import("../style/Style.js").default} style The rendering style.
         */
        VectorContext.prototype.setStyle = function (style) { };
        /**
         * @param {import("../geom/Circle.js").default} circleGeometry Circle geometry.
         * @param {import("../Feature.js").default} feature Feature.
         */
        VectorContext.prototype.drawCircle = function (circleGeometry, feature) { };
        /**
         * @param {import("../Feature.js").default} feature Feature.
         * @param {import("../style/Style.js").default} style Style.
         */
        VectorContext.prototype.drawFeature = function (feature, style) { };
        /**
         * @param {import("../geom/GeometryCollection.js").default} geometryCollectionGeometry Geometry collection.
         * @param {import("../Feature.js").default} feature Feature.
         */
        VectorContext.prototype.drawGeometryCollection = function (geometryCollectionGeometry, feature) { };
        /**
         * @param {import("../geom/LineString.js").default|import("./Feature.js").default} lineStringGeometry Line string geometry.
         * @param {import("../Feature.js").FeatureLike} feature Feature.
         */
        VectorContext.prototype.drawLineString = function (lineStringGeometry, feature) { };
        /**
         * @param {import("../geom/MultiLineString.js").default|import("./Feature.js").default} multiLineStringGeometry MultiLineString geometry.
         * @param {import("../Feature.js").FeatureLike} feature Feature.
         */
        VectorContext.prototype.drawMultiLineString = function (multiLineStringGeometry, feature) { };
        /**
         * @param {import("../geom/MultiPoint.js").default|import("./Feature.js").default} multiPointGeometry MultiPoint geometry.
         * @param {import("../Feature.js").FeatureLike} feature Feature.
         */
        VectorContext.prototype.drawMultiPoint = function (multiPointGeometry, feature) { };
        /**
         * @param {import("../geom/MultiPolygon.js").default} multiPolygonGeometry MultiPolygon geometry.
         * @param {import("../Feature.js").FeatureLike} feature Feature.
         */
        VectorContext.prototype.drawMultiPolygon = function (multiPolygonGeometry, feature) { };
        /**
         * @param {import("../geom/Point.js").default|import("./Feature.js").default} pointGeometry Point geometry.
         * @param {import("../Feature.js").FeatureLike} feature Feature.
         */
        VectorContext.prototype.drawPoint = function (pointGeometry, feature) { };
        /**
         * @param {import("../geom/Polygon.js").default|import("./Feature.js").default} polygonGeometry Polygon geometry.
         * @param {import("../Feature.js").FeatureLike} feature Feature.
         */
        VectorContext.prototype.drawPolygon = function (polygonGeometry, feature) { };
        /**
         * @param {import("../geom/SimpleGeometry.js").default|import("./Feature.js").default} geometry Geometry.
         * @param {import("../Feature.js").FeatureLike} feature Feature.
         */
        VectorContext.prototype.drawText = function (geometry, feature) { };
        /**
         * @param {import("../style/Fill.js").default} fillStyle Fill style.
         * @param {import("../style/Stroke.js").default} strokeStyle Stroke style.
         */
        VectorContext.prototype.setFillStrokeStyle = function (fillStyle, strokeStyle) { };
        /**
         * @param {import("../style/Image.js").default} imageStyle Image style.
         * @param {import("../render/canvas.js").DeclutterImageWithText} [opt_declutterImageWithText] Shared data for combined decluttering with a text style.
         */
        VectorContext.prototype.setImageStyle = function (imageStyle, opt_declutterImageWithText) { };
        /**
         * @param {import("../style/Text.js").default} textStyle Text style.
         * @param {import("../render/canvas.js").DeclutterImageWithText} [opt_declutterImageWithText] Shared data for combined decluttering with an image style.
         */
        VectorContext.prototype.setTextStyle = function (textStyle, opt_declutterImageWithText) { };
        return VectorContext;
    }());
    var VectorContext$1 = VectorContext;

    var __extends$i = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            if (typeof b !== "function" && b !== null)
                throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var CanvasBuilder = /** @class */ (function (_super) {
        __extends$i(CanvasBuilder, _super);
        /**
         * @param {number} tolerance Tolerance.
         * @param {import("../../extent.js").Extent} maxExtent Maximum extent.
         * @param {number} resolution Resolution.
         * @param {number} pixelRatio Pixel ratio.
         */
        function CanvasBuilder(tolerance, maxExtent, resolution, pixelRatio) {
            var _this = _super.call(this) || this;
            /**
             * @protected
             * @type {number}
             */
            _this.tolerance = tolerance;
            /**
             * @protected
             * @const
             * @type {import("../../extent.js").Extent}
             */
            _this.maxExtent = maxExtent;
            /**
             * @protected
             * @type {number}
             */
            _this.pixelRatio = pixelRatio;
            /**
             * @protected
             * @type {number}
             */
            _this.maxLineWidth = 0;
            /**
             * @protected
             * @const
             * @type {number}
             */
            _this.resolution = resolution;
            /**
             * @private
             * @type {Array<*>}
             */
            _this.beginGeometryInstruction1_ = null;
            /**
             * @private
             * @type {Array<*>}
             */
            _this.beginGeometryInstruction2_ = null;
            /**
             * @private
             * @type {import("../../extent.js").Extent}
             */
            _this.bufferedMaxExtent_ = null;
            /**
             * @protected
             * @type {Array<*>}
             */
            _this.instructions = [];
            /**
             * @protected
             * @type {Array<number>}
             */
            _this.coordinates = [];
            /**
             * @private
             * @type {import("../../coordinate.js").Coordinate}
             */
            _this.tmpCoordinate_ = [];
            /**
             * @protected
             * @type {Array<*>}
             */
            _this.hitDetectionInstructions = [];
            /**
             * @protected
             * @type {import("../canvas.js").FillStrokeState}
             */
            _this.state = /** @type {import("../canvas.js").FillStrokeState} */ ({});
            return _this;
        }
        /**
         * @protected
         * @param {Array<number>} dashArray Dash array.
         * @return {Array<number>} Dash array with pixel ratio applied
         */
        CanvasBuilder.prototype.applyPixelRatio = function (dashArray) {
            var pixelRatio = this.pixelRatio;
            return pixelRatio == 1
                ? dashArray
                : dashArray.map(function (dash) {
                    return dash * pixelRatio;
                });
        };
        /**
         * @param {Array<number>} flatCoordinates Flat coordinates.
         * @param {number} stride Stride.
         * @protected
         * @return {number} My end
         */
        CanvasBuilder.prototype.appendFlatPointCoordinates = function (flatCoordinates, stride) {
            var extent = this.getBufferedMaxExtent();
            var tmpCoord = this.tmpCoordinate_;
            var coordinates = this.coordinates;
            var myEnd = coordinates.length;
            for (var i = 0, ii = flatCoordinates.length; i < ii; i += stride) {
                tmpCoord[0] = flatCoordinates[i];
                tmpCoord[1] = flatCoordinates[i + 1];
                if (containsCoordinate(extent, tmpCoord)) {
                    coordinates[myEnd++] = tmpCoord[0];
                    coordinates[myEnd++] = tmpCoord[1];
                }
            }
            return myEnd;
        };
        /**
         * @param {Array<number>} flatCoordinates Flat coordinates.
         * @param {number} offset Offset.
         * @param {number} end End.
         * @param {number} stride Stride.
         * @param {boolean} closed Last input coordinate equals first.
         * @param {boolean} skipFirst Skip first coordinate.
         * @protected
         * @return {number} My end.
         */
        CanvasBuilder.prototype.appendFlatLineCoordinates = function (flatCoordinates, offset, end, stride, closed, skipFirst) {
            var coordinates = this.coordinates;
            var myEnd = coordinates.length;
            var extent = this.getBufferedMaxExtent();
            if (skipFirst) {
                offset += stride;
            }
            var lastXCoord = flatCoordinates[offset];
            var lastYCoord = flatCoordinates[offset + 1];
            var nextCoord = this.tmpCoordinate_;
            var skipped = true;
            var i, lastRel, nextRel;
            for (i = offset + stride; i < end; i += stride) {
                nextCoord[0] = flatCoordinates[i];
                nextCoord[1] = flatCoordinates[i + 1];
                nextRel = coordinateRelationship(extent, nextCoord);
                if (nextRel !== lastRel) {
                    if (skipped) {
                        coordinates[myEnd++] = lastXCoord;
                        coordinates[myEnd++] = lastYCoord;
                        skipped = false;
                    }
                    coordinates[myEnd++] = nextCoord[0];
                    coordinates[myEnd++] = nextCoord[1];
                }
                else if (nextRel === Relationship.INTERSECTING) {
                    coordinates[myEnd++] = nextCoord[0];
                    coordinates[myEnd++] = nextCoord[1];
                    skipped = false;
                }
                else {
                    skipped = true;
                }
                lastXCoord = nextCoord[0];
                lastYCoord = nextCoord[1];
                lastRel = nextRel;
            }
            // Last coordinate equals first or only one point to append:
            if ((closed && skipped) || i === offset + stride) {
                coordinates[myEnd++] = lastXCoord;
                coordinates[myEnd++] = lastYCoord;
            }
            return myEnd;
        };
        /**
         * @param {Array<number>} flatCoordinates Flat coordinates.
         * @param {number} offset Offset.
         * @param {Array<number>} ends Ends.
         * @param {number} stride Stride.
         * @param {Array<number>} builderEnds Builder ends.
         * @return {number} Offset.
         */
        CanvasBuilder.prototype.drawCustomCoordinates_ = function (flatCoordinates, offset, ends, stride, builderEnds) {
            for (var i = 0, ii = ends.length; i < ii; ++i) {
                var end = ends[i];
                var builderEnd = this.appendFlatLineCoordinates(flatCoordinates, offset, end, stride, false, false);
                builderEnds.push(builderEnd);
                offset = end;
            }
            return offset;
        };
        /**
         * @param {import("../../geom/SimpleGeometry.js").default} geometry Geometry.
         * @param {import("../../Feature.js").FeatureLike} feature Feature.
         * @param {Function} renderer Renderer.
         * @param {Function} hitDetectionRenderer Renderer.
         */
        CanvasBuilder.prototype.drawCustom = function (geometry, feature, renderer, hitDetectionRenderer) {
            this.beginGeometry(geometry, feature);
            var type = geometry.getType();
            var stride = geometry.getStride();
            var builderBegin = this.coordinates.length;
            var flatCoordinates, builderEnd, builderEnds, builderEndss;
            var offset;
            switch (type) {
                case 'MultiPolygon':
                    flatCoordinates =
                        /** @type {import("../../geom/MultiPolygon.js").default} */ (geometry).getOrientedFlatCoordinates();
                    builderEndss = [];
                    var endss = 
                    /** @type {import("../../geom/MultiPolygon.js").default} */ (geometry).getEndss();
                    offset = 0;
                    for (var i = 0, ii = endss.length; i < ii; ++i) {
                        var myEnds = [];
                        offset = this.drawCustomCoordinates_(flatCoordinates, offset, endss[i], stride, myEnds);
                        builderEndss.push(myEnds);
                    }
                    this.instructions.push([
                        CanvasInstruction.CUSTOM,
                        builderBegin,
                        builderEndss,
                        geometry,
                        renderer,
                        inflateMultiCoordinatesArray,
                    ]);
                    this.hitDetectionInstructions.push([
                        CanvasInstruction.CUSTOM,
                        builderBegin,
                        builderEndss,
                        geometry,
                        hitDetectionRenderer || renderer,
                        inflateMultiCoordinatesArray,
                    ]);
                    break;
                case 'Polygon':
                case 'MultiLineString':
                    builderEnds = [];
                    flatCoordinates =
                        type == 'Polygon'
                            ? /** @type {import("../../geom/Polygon.js").default} */ (geometry).getOrientedFlatCoordinates()
                            : geometry.getFlatCoordinates();
                    offset = this.drawCustomCoordinates_(flatCoordinates, 0, 
                    /** @type {import("../../geom/Polygon.js").default|import("../../geom/MultiLineString.js").default} */ (geometry).getEnds(), stride, builderEnds);
                    this.instructions.push([
                        CanvasInstruction.CUSTOM,
                        builderBegin,
                        builderEnds,
                        geometry,
                        renderer,
                        inflateCoordinatesArray,
                    ]);
                    this.hitDetectionInstructions.push([
                        CanvasInstruction.CUSTOM,
                        builderBegin,
                        builderEnds,
                        geometry,
                        hitDetectionRenderer || renderer,
                        inflateCoordinatesArray,
                    ]);
                    break;
                case 'LineString':
                case 'Circle':
                    flatCoordinates = geometry.getFlatCoordinates();
                    builderEnd = this.appendFlatLineCoordinates(flatCoordinates, 0, flatCoordinates.length, stride, false, false);
                    this.instructions.push([
                        CanvasInstruction.CUSTOM,
                        builderBegin,
                        builderEnd,
                        geometry,
                        renderer,
                        inflateCoordinates,
                    ]);
                    this.hitDetectionInstructions.push([
                        CanvasInstruction.CUSTOM,
                        builderBegin,
                        builderEnd,
                        geometry,
                        hitDetectionRenderer || renderer,
                        inflateCoordinates,
                    ]);
                    break;
                case 'MultiPoint':
                    flatCoordinates = geometry.getFlatCoordinates();
                    builderEnd = this.appendFlatPointCoordinates(flatCoordinates, stride);
                    if (builderEnd > builderBegin) {
                        this.instructions.push([
                            CanvasInstruction.CUSTOM,
                            builderBegin,
                            builderEnd,
                            geometry,
                            renderer,
                            inflateCoordinates,
                        ]);
                        this.hitDetectionInstructions.push([
                            CanvasInstruction.CUSTOM,
                            builderBegin,
                            builderEnd,
                            geometry,
                            hitDetectionRenderer || renderer,
                            inflateCoordinates,
                        ]);
                    }
                    break;
                case 'Point':
                    flatCoordinates = geometry.getFlatCoordinates();
                    this.coordinates.push(flatCoordinates[0], flatCoordinates[1]);
                    builderEnd = this.coordinates.length;
                    this.instructions.push([
                        CanvasInstruction.CUSTOM,
                        builderBegin,
                        builderEnd,
                        geometry,
                        renderer,
                    ]);
                    this.hitDetectionInstructions.push([
                        CanvasInstruction.CUSTOM,
                        builderBegin,
                        builderEnd,
                        geometry,
                        hitDetectionRenderer || renderer,
                    ]);
                    break;
            }
            this.endGeometry(feature);
        };
        /**
         * @protected
         * @param {import("../../geom/Geometry").default|import("../Feature.js").default} geometry The geometry.
         * @param {import("../../Feature.js").FeatureLike} feature Feature.
         */
        CanvasBuilder.prototype.beginGeometry = function (geometry, feature) {
            this.beginGeometryInstruction1_ = [
                CanvasInstruction.BEGIN_GEOMETRY,
                feature,
                0,
                geometry,
            ];
            this.instructions.push(this.beginGeometryInstruction1_);
            this.beginGeometryInstruction2_ = [
                CanvasInstruction.BEGIN_GEOMETRY,
                feature,
                0,
                geometry,
            ];
            this.hitDetectionInstructions.push(this.beginGeometryInstruction2_);
        };
        /**
         * @return {import("../canvas.js").SerializableInstructions} the serializable instructions.
         */
        CanvasBuilder.prototype.finish = function () {
            return {
                instructions: this.instructions,
                hitDetectionInstructions: this.hitDetectionInstructions,
                coordinates: this.coordinates,
            };
        };
        /**
         * Reverse the hit detection instructions.
         */
        CanvasBuilder.prototype.reverseHitDetectionInstructions = function () {
            var hitDetectionInstructions = this.hitDetectionInstructions;
            // step 1 - reverse array
            hitDetectionInstructions.reverse();
            // step 2 - reverse instructions within geometry blocks
            var i;
            var n = hitDetectionInstructions.length;
            var instruction;
            var type;
            var begin = -1;
            for (i = 0; i < n; ++i) {
                instruction = hitDetectionInstructions[i];
                type = /** @type {import("./Instruction.js").default} */ (instruction[0]);
                if (type == CanvasInstruction.END_GEOMETRY) {
                    begin = i;
                }
                else if (type == CanvasInstruction.BEGIN_GEOMETRY) {
                    instruction[2] = i;
                    reverseSubArray(this.hitDetectionInstructions, begin, i);
                    begin = -1;
                }
            }
        };
        /**
         * @param {import("../../style/Fill.js").default} fillStyle Fill style.
         * @param {import("../../style/Stroke.js").default} strokeStyle Stroke style.
         */
        CanvasBuilder.prototype.setFillStrokeStyle = function (fillStyle, strokeStyle) {
            var state = this.state;
            if (fillStyle) {
                var fillStyleColor = fillStyle.getColor();
                state.fillStyle = asColorLike(fillStyleColor ? fillStyleColor : defaultFillStyle);
            }
            else {
                state.fillStyle = undefined;
            }
            if (strokeStyle) {
                var strokeStyleColor = strokeStyle.getColor();
                state.strokeStyle = asColorLike(strokeStyleColor ? strokeStyleColor : defaultStrokeStyle);
                var strokeStyleLineCap = strokeStyle.getLineCap();
                state.lineCap =
                    strokeStyleLineCap !== undefined ? strokeStyleLineCap : defaultLineCap;
                var strokeStyleLineDash = strokeStyle.getLineDash();
                state.lineDash = strokeStyleLineDash
                    ? strokeStyleLineDash.slice()
                    : defaultLineDash;
                var strokeStyleLineDashOffset = strokeStyle.getLineDashOffset();
                state.lineDashOffset = strokeStyleLineDashOffset
                    ? strokeStyleLineDashOffset
                    : defaultLineDashOffset;
                var strokeStyleLineJoin = strokeStyle.getLineJoin();
                state.lineJoin =
                    strokeStyleLineJoin !== undefined
                        ? strokeStyleLineJoin
                        : defaultLineJoin;
                var strokeStyleWidth = strokeStyle.getWidth();
                state.lineWidth =
                    strokeStyleWidth !== undefined ? strokeStyleWidth : defaultLineWidth;
                var strokeStyleMiterLimit = strokeStyle.getMiterLimit();
                state.miterLimit =
                    strokeStyleMiterLimit !== undefined
                        ? strokeStyleMiterLimit
                        : defaultMiterLimit;
                if (state.lineWidth > this.maxLineWidth) {
                    this.maxLineWidth = state.lineWidth;
                    // invalidate the buffered max extent cache
                    this.bufferedMaxExtent_ = null;
                }
            }
            else {
                state.strokeStyle = undefined;
                state.lineCap = undefined;
                state.lineDash = null;
                state.lineDashOffset = undefined;
                state.lineJoin = undefined;
                state.lineWidth = undefined;
                state.miterLimit = undefined;
            }
        };
        /**
         * @param {import("../canvas.js").FillStrokeState} state State.
         * @return {Array<*>} Fill instruction.
         */
        CanvasBuilder.prototype.createFill = function (state) {
            var fillStyle = state.fillStyle;
            /** @type {Array<*>} */
            var fillInstruction = [CanvasInstruction.SET_FILL_STYLE, fillStyle];
            if (typeof fillStyle !== 'string') {
                // Fill is a pattern or gradient - align it!
                fillInstruction.push(true);
            }
            return fillInstruction;
        };
        /**
         * @param {import("../canvas.js").FillStrokeState} state State.
         */
        CanvasBuilder.prototype.applyStroke = function (state) {
            this.instructions.push(this.createStroke(state));
        };
        /**
         * @param {import("../canvas.js").FillStrokeState} state State.
         * @return {Array<*>} Stroke instruction.
         */
        CanvasBuilder.prototype.createStroke = function (state) {
            return [
                CanvasInstruction.SET_STROKE_STYLE,
                state.strokeStyle,
                state.lineWidth * this.pixelRatio,
                state.lineCap,
                state.lineJoin,
                state.miterLimit,
                this.applyPixelRatio(state.lineDash),
                state.lineDashOffset * this.pixelRatio,
            ];
        };
        /**
         * @param {import("../canvas.js").FillStrokeState} state State.
         * @param {function(this:CanvasBuilder, import("../canvas.js").FillStrokeState):Array<*>} createFill Create fill.
         */
        CanvasBuilder.prototype.updateFillStyle = function (state, createFill) {
            var fillStyle = state.fillStyle;
            if (typeof fillStyle !== 'string' || state.currentFillStyle != fillStyle) {
                if (fillStyle !== undefined) {
                    this.instructions.push(createFill.call(this, state));
                }
                state.currentFillStyle = fillStyle;
            }
        };
        /**
         * @param {import("../canvas.js").FillStrokeState} state State.
         * @param {function(this:CanvasBuilder, import("../canvas.js").FillStrokeState): void} applyStroke Apply stroke.
         */
        CanvasBuilder.prototype.updateStrokeStyle = function (state, applyStroke) {
            var strokeStyle = state.strokeStyle;
            var lineCap = state.lineCap;
            var lineDash = state.lineDash;
            var lineDashOffset = state.lineDashOffset;
            var lineJoin = state.lineJoin;
            var lineWidth = state.lineWidth;
            var miterLimit = state.miterLimit;
            if (state.currentStrokeStyle != strokeStyle ||
                state.currentLineCap != lineCap ||
                (lineDash != state.currentLineDash &&
                    !equals$1(state.currentLineDash, lineDash)) ||
                state.currentLineDashOffset != lineDashOffset ||
                state.currentLineJoin != lineJoin ||
                state.currentLineWidth != lineWidth ||
                state.currentMiterLimit != miterLimit) {
                if (strokeStyle !== undefined) {
                    applyStroke.call(this, state);
                }
                state.currentStrokeStyle = strokeStyle;
                state.currentLineCap = lineCap;
                state.currentLineDash = lineDash;
                state.currentLineDashOffset = lineDashOffset;
                state.currentLineJoin = lineJoin;
                state.currentLineWidth = lineWidth;
                state.currentMiterLimit = miterLimit;
            }
        };
        /**
         * @param {import("../../Feature.js").FeatureLike} feature Feature.
         */
        CanvasBuilder.prototype.endGeometry = function (feature) {
            this.beginGeometryInstruction1_[2] = this.instructions.length;
            this.beginGeometryInstruction1_ = null;
            this.beginGeometryInstruction2_[2] = this.hitDetectionInstructions.length;
            this.beginGeometryInstruction2_ = null;
            var endGeometryInstruction = [CanvasInstruction.END_GEOMETRY, feature];
            this.instructions.push(endGeometryInstruction);
            this.hitDetectionInstructions.push(endGeometryInstruction);
        };
        /**
         * Get the buffered rendering extent.  Rendering will be clipped to the extent
         * provided to the constructor.  To account for symbolizers that may intersect
         * this extent, we calculate a buffered extent (e.g. based on stroke width).
         * @return {import("../../extent.js").Extent} The buffered rendering extent.
         * @protected
         */
        CanvasBuilder.prototype.getBufferedMaxExtent = function () {
            if (!this.bufferedMaxExtent_) {
                this.bufferedMaxExtent_ = clone(this.maxExtent);
                if (this.maxLineWidth > 0) {
                    var width = (this.resolution * (this.maxLineWidth + 1)) / 2;
                    buffer(this.bufferedMaxExtent_, width, this.bufferedMaxExtent_);
                }
            }
            return this.bufferedMaxExtent_;
        };
        return CanvasBuilder;
    }(VectorContext$1));
    var Builder = CanvasBuilder;

    var __extends$h = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            if (typeof b !== "function" && b !== null)
                throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var CanvasImageBuilder = /** @class */ (function (_super) {
        __extends$h(CanvasImageBuilder, _super);
        /**
         * @param {number} tolerance Tolerance.
         * @param {import("../../extent.js").Extent} maxExtent Maximum extent.
         * @param {number} resolution Resolution.
         * @param {number} pixelRatio Pixel ratio.
         */
        function CanvasImageBuilder(tolerance, maxExtent, resolution, pixelRatio) {
            var _this = _super.call(this, tolerance, maxExtent, resolution, pixelRatio) || this;
            /**
             * @private
             * @type {HTMLCanvasElement|HTMLVideoElement|HTMLImageElement}
             */
            _this.hitDetectionImage_ = null;
            /**
             * @private
             * @type {HTMLCanvasElement|HTMLVideoElement|HTMLImageElement}
             */
            _this.image_ = null;
            /**
             * @private
             * @type {number|undefined}
             */
            _this.imagePixelRatio_ = undefined;
            /**
             * @private
             * @type {number|undefined}
             */
            _this.anchorX_ = undefined;
            /**
             * @private
             * @type {number|undefined}
             */
            _this.anchorY_ = undefined;
            /**
             * @private
             * @type {number|undefined}
             */
            _this.height_ = undefined;
            /**
             * @private
             * @type {number|undefined}
             */
            _this.opacity_ = undefined;
            /**
             * @private
             * @type {number|undefined}
             */
            _this.originX_ = undefined;
            /**
             * @private
             * @type {number|undefined}
             */
            _this.originY_ = undefined;
            /**
             * @private
             * @type {boolean|undefined}
             */
            _this.rotateWithView_ = undefined;
            /**
             * @private
             * @type {number|undefined}
             */
            _this.rotation_ = undefined;
            /**
             * @private
             * @type {import("../../size.js").Size|undefined}
             */
            _this.scale_ = undefined;
            /**
             * @private
             * @type {number|undefined}
             */
            _this.width_ = undefined;
            /**
             * @private
             * @type {"declutter"|"obstacle"|"none"|undefined}
             */
            _this.declutterMode_ = undefined;
            /**
             * Data shared with a text builder for combined decluttering.
             * @private
             * @type {import("../canvas.js").DeclutterImageWithText}
             */
            _this.declutterImageWithText_ = undefined;
            return _this;
        }
        /**
         * @param {import("../../geom/Point.js").default|import("../Feature.js").default} pointGeometry Point geometry.
         * @param {import("../../Feature.js").FeatureLike} feature Feature.
         */
        CanvasImageBuilder.prototype.drawPoint = function (pointGeometry, feature) {
            if (!this.image_) {
                return;
            }
            this.beginGeometry(pointGeometry, feature);
            var flatCoordinates = pointGeometry.getFlatCoordinates();
            var stride = pointGeometry.getStride();
            var myBegin = this.coordinates.length;
            var myEnd = this.appendFlatPointCoordinates(flatCoordinates, stride);
            this.instructions.push([
                CanvasInstruction.DRAW_IMAGE,
                myBegin,
                myEnd,
                this.image_,
                // Remaining arguments to DRAW_IMAGE are in alphabetical order
                this.anchorX_ * this.imagePixelRatio_,
                this.anchorY_ * this.imagePixelRatio_,
                Math.ceil(this.height_ * this.imagePixelRatio_),
                this.opacity_,
                this.originX_ * this.imagePixelRatio_,
                this.originY_ * this.imagePixelRatio_,
                this.rotateWithView_,
                this.rotation_,
                [
                    (this.scale_[0] * this.pixelRatio) / this.imagePixelRatio_,
                    (this.scale_[1] * this.pixelRatio) / this.imagePixelRatio_,
                ],
                Math.ceil(this.width_ * this.imagePixelRatio_),
                this.declutterMode_,
                this.declutterImageWithText_,
            ]);
            this.hitDetectionInstructions.push([
                CanvasInstruction.DRAW_IMAGE,
                myBegin,
                myEnd,
                this.hitDetectionImage_,
                // Remaining arguments to DRAW_IMAGE are in alphabetical order
                this.anchorX_,
                this.anchorY_,
                this.height_,
                this.opacity_,
                this.originX_,
                this.originY_,
                this.rotateWithView_,
                this.rotation_,
                this.scale_,
                this.width_,
                this.declutterMode_,
                this.declutterImageWithText_,
            ]);
            this.endGeometry(feature);
        };
        /**
         * @param {import("../../geom/MultiPoint.js").default|import("../Feature.js").default} multiPointGeometry MultiPoint geometry.
         * @param {import("../../Feature.js").FeatureLike} feature Feature.
         */
        CanvasImageBuilder.prototype.drawMultiPoint = function (multiPointGeometry, feature) {
            if (!this.image_) {
                return;
            }
            this.beginGeometry(multiPointGeometry, feature);
            var flatCoordinates = multiPointGeometry.getFlatCoordinates();
            var stride = multiPointGeometry.getStride();
            var myBegin = this.coordinates.length;
            var myEnd = this.appendFlatPointCoordinates(flatCoordinates, stride);
            this.instructions.push([
                CanvasInstruction.DRAW_IMAGE,
                myBegin,
                myEnd,
                this.image_,
                // Remaining arguments to DRAW_IMAGE are in alphabetical order
                this.anchorX_ * this.imagePixelRatio_,
                this.anchorY_ * this.imagePixelRatio_,
                Math.ceil(this.height_ * this.imagePixelRatio_),
                this.opacity_,
                this.originX_ * this.imagePixelRatio_,
                this.originY_ * this.imagePixelRatio_,
                this.rotateWithView_,
                this.rotation_,
                [
                    (this.scale_[0] * this.pixelRatio) / this.imagePixelRatio_,
                    (this.scale_[1] * this.pixelRatio) / this.imagePixelRatio_,
                ],
                Math.ceil(this.width_ * this.imagePixelRatio_),
                this.declutterMode_,
                this.declutterImageWithText_,
            ]);
            this.hitDetectionInstructions.push([
                CanvasInstruction.DRAW_IMAGE,
                myBegin,
                myEnd,
                this.hitDetectionImage_,
                // Remaining arguments to DRAW_IMAGE are in alphabetical order
                this.anchorX_,
                this.anchorY_,
                this.height_,
                this.opacity_,
                this.originX_,
                this.originY_,
                this.rotateWithView_,
                this.rotation_,
                this.scale_,
                this.width_,
                this.declutterMode_,
                this.declutterImageWithText_,
            ]);
            this.endGeometry(feature);
        };
        /**
         * @return {import("../canvas.js").SerializableInstructions} the serializable instructions.
         */
        CanvasImageBuilder.prototype.finish = function () {
            this.reverseHitDetectionInstructions();
            // FIXME this doesn't really protect us against further calls to draw*Geometry
            this.anchorX_ = undefined;
            this.anchorY_ = undefined;
            this.hitDetectionImage_ = null;
            this.image_ = null;
            this.imagePixelRatio_ = undefined;
            this.height_ = undefined;
            this.scale_ = undefined;
            this.opacity_ = undefined;
            this.originX_ = undefined;
            this.originY_ = undefined;
            this.rotateWithView_ = undefined;
            this.rotation_ = undefined;
            this.width_ = undefined;
            return _super.prototype.finish.call(this);
        };
        /**
         * @param {import("../../style/Image.js").default} imageStyle Image style.
         * @param {Object} [opt_sharedData] Shared data.
         */
        CanvasImageBuilder.prototype.setImageStyle = function (imageStyle, opt_sharedData) {
            var anchor = imageStyle.getAnchor();
            var size = imageStyle.getSize();
            var origin = imageStyle.getOrigin();
            this.imagePixelRatio_ = imageStyle.getPixelRatio(this.pixelRatio);
            this.anchorX_ = anchor[0];
            this.anchorY_ = anchor[1];
            this.hitDetectionImage_ = imageStyle.getHitDetectionImage();
            this.image_ = imageStyle.getImage(this.pixelRatio);
            this.height_ = size[1];
            this.opacity_ = imageStyle.getOpacity();
            this.originX_ = origin[0];
            this.originY_ = origin[1];
            this.rotateWithView_ = imageStyle.getRotateWithView();
            this.rotation_ = imageStyle.getRotation();
            this.scale_ = imageStyle.getScaleArray();
            this.width_ = size[0];
            this.declutterMode_ = imageStyle.getDeclutterMode();
            this.declutterImageWithText_ = opt_sharedData;
        };
        return CanvasImageBuilder;
    }(Builder));
    var ImageBuilder = CanvasImageBuilder;

    var __extends$g = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            if (typeof b !== "function" && b !== null)
                throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var CanvasLineStringBuilder = /** @class */ (function (_super) {
        __extends$g(CanvasLineStringBuilder, _super);
        /**
         * @param {number} tolerance Tolerance.
         * @param {import("../../extent.js").Extent} maxExtent Maximum extent.
         * @param {number} resolution Resolution.
         * @param {number} pixelRatio Pixel ratio.
         */
        function CanvasLineStringBuilder(tolerance, maxExtent, resolution, pixelRatio) {
            return _super.call(this, tolerance, maxExtent, resolution, pixelRatio) || this;
        }
        /**
         * @param {Array<number>} flatCoordinates Flat coordinates.
         * @param {number} offset Offset.
         * @param {number} end End.
         * @param {number} stride Stride.
         * @private
         * @return {number} end.
         */
        CanvasLineStringBuilder.prototype.drawFlatCoordinates_ = function (flatCoordinates, offset, end, stride) {
            var myBegin = this.coordinates.length;
            var myEnd = this.appendFlatLineCoordinates(flatCoordinates, offset, end, stride, false, false);
            var moveToLineToInstruction = [
                CanvasInstruction.MOVE_TO_LINE_TO,
                myBegin,
                myEnd,
            ];
            this.instructions.push(moveToLineToInstruction);
            this.hitDetectionInstructions.push(moveToLineToInstruction);
            return end;
        };
        /**
         * @param {import("../../geom/LineString.js").default|import("../Feature.js").default} lineStringGeometry Line string geometry.
         * @param {import("../../Feature.js").FeatureLike} feature Feature.
         */
        CanvasLineStringBuilder.prototype.drawLineString = function (lineStringGeometry, feature) {
            var state = this.state;
            var strokeStyle = state.strokeStyle;
            var lineWidth = state.lineWidth;
            if (strokeStyle === undefined || lineWidth === undefined) {
                return;
            }
            this.updateStrokeStyle(state, this.applyStroke);
            this.beginGeometry(lineStringGeometry, feature);
            this.hitDetectionInstructions.push([
                CanvasInstruction.SET_STROKE_STYLE,
                state.strokeStyle,
                state.lineWidth,
                state.lineCap,
                state.lineJoin,
                state.miterLimit,
                defaultLineDash,
                defaultLineDashOffset,
            ], beginPathInstruction);
            var flatCoordinates = lineStringGeometry.getFlatCoordinates();
            var stride = lineStringGeometry.getStride();
            this.drawFlatCoordinates_(flatCoordinates, 0, flatCoordinates.length, stride);
            this.hitDetectionInstructions.push(strokeInstruction);
            this.endGeometry(feature);
        };
        /**
         * @param {import("../../geom/MultiLineString.js").default|import("../Feature.js").default} multiLineStringGeometry MultiLineString geometry.
         * @param {import("../../Feature.js").FeatureLike} feature Feature.
         */
        CanvasLineStringBuilder.prototype.drawMultiLineString = function (multiLineStringGeometry, feature) {
            var state = this.state;
            var strokeStyle = state.strokeStyle;
            var lineWidth = state.lineWidth;
            if (strokeStyle === undefined || lineWidth === undefined) {
                return;
            }
            this.updateStrokeStyle(state, this.applyStroke);
            this.beginGeometry(multiLineStringGeometry, feature);
            this.hitDetectionInstructions.push([
                CanvasInstruction.SET_STROKE_STYLE,
                state.strokeStyle,
                state.lineWidth,
                state.lineCap,
                state.lineJoin,
                state.miterLimit,
                state.lineDash,
                state.lineDashOffset,
            ], beginPathInstruction);
            var ends = multiLineStringGeometry.getEnds();
            var flatCoordinates = multiLineStringGeometry.getFlatCoordinates();
            var stride = multiLineStringGeometry.getStride();
            var offset = 0;
            for (var i = 0, ii = ends.length; i < ii; ++i) {
                offset = this.drawFlatCoordinates_(flatCoordinates, offset, 
                /** @type {number} */ (ends[i]), stride);
            }
            this.hitDetectionInstructions.push(strokeInstruction);
            this.endGeometry(feature);
        };
        /**
         * @return {import("../canvas.js").SerializableInstructions} the serializable instructions.
         */
        CanvasLineStringBuilder.prototype.finish = function () {
            var state = this.state;
            if (state.lastStroke != undefined &&
                state.lastStroke != this.coordinates.length) {
                this.instructions.push(strokeInstruction);
            }
            this.reverseHitDetectionInstructions();
            this.state = null;
            return _super.prototype.finish.call(this);
        };
        /**
         * @param {import("../canvas.js").FillStrokeState} state State.
         */
        CanvasLineStringBuilder.prototype.applyStroke = function (state) {
            if (state.lastStroke != undefined &&
                state.lastStroke != this.coordinates.length) {
                this.instructions.push(strokeInstruction);
                state.lastStroke = this.coordinates.length;
            }
            state.lastStroke = 0;
            _super.prototype.applyStroke.call(this, state);
            this.instructions.push(beginPathInstruction);
        };
        return CanvasLineStringBuilder;
    }(Builder));
    var LineStringBuilder = CanvasLineStringBuilder;

    var __extends$f = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            if (typeof b !== "function" && b !== null)
                throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var CanvasPolygonBuilder = /** @class */ (function (_super) {
        __extends$f(CanvasPolygonBuilder, _super);
        /**
         * @param {number} tolerance Tolerance.
         * @param {import("../../extent.js").Extent} maxExtent Maximum extent.
         * @param {number} resolution Resolution.
         * @param {number} pixelRatio Pixel ratio.
         */
        function CanvasPolygonBuilder(tolerance, maxExtent, resolution, pixelRatio) {
            return _super.call(this, tolerance, maxExtent, resolution, pixelRatio) || this;
        }
        /**
         * @param {Array<number>} flatCoordinates Flat coordinates.
         * @param {number} offset Offset.
         * @param {Array<number>} ends Ends.
         * @param {number} stride Stride.
         * @private
         * @return {number} End.
         */
        CanvasPolygonBuilder.prototype.drawFlatCoordinatess_ = function (flatCoordinates, offset, ends, stride) {
            var state = this.state;
            var fill = state.fillStyle !== undefined;
            var stroke = state.strokeStyle !== undefined;
            var numEnds = ends.length;
            this.instructions.push(beginPathInstruction);
            this.hitDetectionInstructions.push(beginPathInstruction);
            for (var i = 0; i < numEnds; ++i) {
                var end = ends[i];
                var myBegin = this.coordinates.length;
                var myEnd = this.appendFlatLineCoordinates(flatCoordinates, offset, end, stride, true, !stroke);
                var moveToLineToInstruction = [
                    CanvasInstruction.MOVE_TO_LINE_TO,
                    myBegin,
                    myEnd,
                ];
                this.instructions.push(moveToLineToInstruction);
                this.hitDetectionInstructions.push(moveToLineToInstruction);
                if (stroke) {
                    // Performance optimization: only call closePath() when we have a stroke.
                    // Otherwise the ring is closed already (see appendFlatLineCoordinates above).
                    this.instructions.push(closePathInstruction);
                    this.hitDetectionInstructions.push(closePathInstruction);
                }
                offset = end;
            }
            if (fill) {
                this.instructions.push(fillInstruction);
                this.hitDetectionInstructions.push(fillInstruction);
            }
            if (stroke) {
                this.instructions.push(strokeInstruction);
                this.hitDetectionInstructions.push(strokeInstruction);
            }
            return offset;
        };
        /**
         * @param {import("../../geom/Circle.js").default} circleGeometry Circle geometry.
         * @param {import("../../Feature.js").default} feature Feature.
         */
        CanvasPolygonBuilder.prototype.drawCircle = function (circleGeometry, feature) {
            var state = this.state;
            var fillStyle = state.fillStyle;
            var strokeStyle = state.strokeStyle;
            if (fillStyle === undefined && strokeStyle === undefined) {
                return;
            }
            this.setFillStrokeStyles_();
            this.beginGeometry(circleGeometry, feature);
            if (state.fillStyle !== undefined) {
                this.hitDetectionInstructions.push([
                    CanvasInstruction.SET_FILL_STYLE,
                    defaultFillStyle,
                ]);
            }
            if (state.strokeStyle !== undefined) {
                this.hitDetectionInstructions.push([
                    CanvasInstruction.SET_STROKE_STYLE,
                    state.strokeStyle,
                    state.lineWidth,
                    state.lineCap,
                    state.lineJoin,
                    state.miterLimit,
                    state.lineDash,
                    state.lineDashOffset,
                ]);
            }
            var flatCoordinates = circleGeometry.getFlatCoordinates();
            var stride = circleGeometry.getStride();
            var myBegin = this.coordinates.length;
            this.appendFlatLineCoordinates(flatCoordinates, 0, flatCoordinates.length, stride, false, false);
            var circleInstruction = [CanvasInstruction.CIRCLE, myBegin];
            this.instructions.push(beginPathInstruction, circleInstruction);
            this.hitDetectionInstructions.push(beginPathInstruction, circleInstruction);
            if (state.fillStyle !== undefined) {
                this.instructions.push(fillInstruction);
                this.hitDetectionInstructions.push(fillInstruction);
            }
            if (state.strokeStyle !== undefined) {
                this.instructions.push(strokeInstruction);
                this.hitDetectionInstructions.push(strokeInstruction);
            }
            this.endGeometry(feature);
        };
        /**
         * @param {import("../../geom/Polygon.js").default|import("../Feature.js").default} polygonGeometry Polygon geometry.
         * @param {import("../../Feature.js").FeatureLike} feature Feature.
         */
        CanvasPolygonBuilder.prototype.drawPolygon = function (polygonGeometry, feature) {
            var state = this.state;
            var fillStyle = state.fillStyle;
            var strokeStyle = state.strokeStyle;
            if (fillStyle === undefined && strokeStyle === undefined) {
                return;
            }
            this.setFillStrokeStyles_();
            this.beginGeometry(polygonGeometry, feature);
            if (state.fillStyle !== undefined) {
                this.hitDetectionInstructions.push([
                    CanvasInstruction.SET_FILL_STYLE,
                    defaultFillStyle,
                ]);
            }
            if (state.strokeStyle !== undefined) {
                this.hitDetectionInstructions.push([
                    CanvasInstruction.SET_STROKE_STYLE,
                    state.strokeStyle,
                    state.lineWidth,
                    state.lineCap,
                    state.lineJoin,
                    state.miterLimit,
                    state.lineDash,
                    state.lineDashOffset,
                ]);
            }
            var ends = polygonGeometry.getEnds();
            var flatCoordinates = polygonGeometry.getOrientedFlatCoordinates();
            var stride = polygonGeometry.getStride();
            this.drawFlatCoordinatess_(flatCoordinates, 0, 
            /** @type {Array<number>} */ (ends), stride);
            this.endGeometry(feature);
        };
        /**
         * @param {import("../../geom/MultiPolygon.js").default} multiPolygonGeometry MultiPolygon geometry.
         * @param {import("../../Feature.js").FeatureLike} feature Feature.
         */
        CanvasPolygonBuilder.prototype.drawMultiPolygon = function (multiPolygonGeometry, feature) {
            var state = this.state;
            var fillStyle = state.fillStyle;
            var strokeStyle = state.strokeStyle;
            if (fillStyle === undefined && strokeStyle === undefined) {
                return;
            }
            this.setFillStrokeStyles_();
            this.beginGeometry(multiPolygonGeometry, feature);
            if (state.fillStyle !== undefined) {
                this.hitDetectionInstructions.push([
                    CanvasInstruction.SET_FILL_STYLE,
                    defaultFillStyle,
                ]);
            }
            if (state.strokeStyle !== undefined) {
                this.hitDetectionInstructions.push([
                    CanvasInstruction.SET_STROKE_STYLE,
                    state.strokeStyle,
                    state.lineWidth,
                    state.lineCap,
                    state.lineJoin,
                    state.miterLimit,
                    state.lineDash,
                    state.lineDashOffset,
                ]);
            }
            var endss = multiPolygonGeometry.getEndss();
            var flatCoordinates = multiPolygonGeometry.getOrientedFlatCoordinates();
            var stride = multiPolygonGeometry.getStride();
            var offset = 0;
            for (var i = 0, ii = endss.length; i < ii; ++i) {
                offset = this.drawFlatCoordinatess_(flatCoordinates, offset, endss[i], stride);
            }
            this.endGeometry(feature);
        };
        /**
         * @return {import("../canvas.js").SerializableInstructions} the serializable instructions.
         */
        CanvasPolygonBuilder.prototype.finish = function () {
            this.reverseHitDetectionInstructions();
            this.state = null;
            // We want to preserve topology when drawing polygons.  Polygons are
            // simplified using quantization and point elimination. However, we might
            // have received a mix of quantized and non-quantized geometries, so ensure
            // that all are quantized by quantizing all coordinates in the batch.
            var tolerance = this.tolerance;
            if (tolerance !== 0) {
                var coordinates = this.coordinates;
                for (var i = 0, ii = coordinates.length; i < ii; ++i) {
                    coordinates[i] = snap(coordinates[i], tolerance);
                }
            }
            return _super.prototype.finish.call(this);
        };
        /**
         * @private
         */
        CanvasPolygonBuilder.prototype.setFillStrokeStyles_ = function () {
            var state = this.state;
            var fillStyle = state.fillStyle;
            if (fillStyle !== undefined) {
                this.updateFillStyle(state, this.createFill);
            }
            if (state.strokeStyle !== undefined) {
                this.updateStrokeStyle(state, this.applyStroke);
            }
        };
        return CanvasPolygonBuilder;
    }(Builder));
    var PolygonBuilder = CanvasPolygonBuilder;

    /**
     * @module ol/geom/flat/straightchunk
     */
    /**
     * @param {number} maxAngle Maximum acceptable angle delta between segments.
     * @param {Array<number>} flatCoordinates Flat coordinates.
     * @param {number} offset Offset.
     * @param {number} end End.
     * @param {number} stride Stride.
     * @return {Array<number>} Start and end of the first suitable chunk of the
     * given `flatCoordinates`.
     */
    function matchingChunk(maxAngle, flatCoordinates, offset, end, stride) {
        var chunkStart = offset;
        var chunkEnd = offset;
        var chunkM = 0;
        var m = 0;
        var start = offset;
        var acos, i, m12, m23, x1, y1, x12, y12, x23, y23;
        for (i = offset; i < end; i += stride) {
            var x2 = flatCoordinates[i];
            var y2 = flatCoordinates[i + 1];
            if (x1 !== undefined) {
                x23 = x2 - x1;
                y23 = y2 - y1;
                m23 = Math.sqrt(x23 * x23 + y23 * y23);
                if (x12 !== undefined) {
                    m += m12;
                    acos = Math.acos((x12 * x23 + y12 * y23) / (m12 * m23));
                    if (acos > maxAngle) {
                        if (m > chunkM) {
                            chunkM = m;
                            chunkStart = start;
                            chunkEnd = i;
                        }
                        m = 0;
                        start = i - stride;
                    }
                }
                m12 = m23;
                x12 = x23;
                y12 = y23;
            }
            x1 = x2;
            y1 = y2;
        }
        m += m23;
        return m > chunkM ? [start, i] : [chunkStart, chunkEnd];
    }

    var __extends$e = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            if (typeof b !== "function" && b !== null)
                throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * @const
     * @enum {number}
     */
    var TEXT_ALIGN = {
        'left': 0,
        'end': 0,
        'center': 0.5,
        'right': 1,
        'start': 1,
        'top': 0,
        'middle': 0.5,
        'hanging': 0.2,
        'alphabetic': 0.8,
        'ideographic': 0.8,
        'bottom': 1,
    };
    var CanvasTextBuilder = /** @class */ (function (_super) {
        __extends$e(CanvasTextBuilder, _super);
        /**
         * @param {number} tolerance Tolerance.
         * @param {import("../../extent.js").Extent} maxExtent Maximum extent.
         * @param {number} resolution Resolution.
         * @param {number} pixelRatio Pixel ratio.
         */
        function CanvasTextBuilder(tolerance, maxExtent, resolution, pixelRatio) {
            var _this = _super.call(this, tolerance, maxExtent, resolution, pixelRatio) || this;
            /**
             * @private
             * @type {Array<HTMLCanvasElement>}
             */
            _this.labels_ = null;
            /**
             * @private
             * @type {string|Array<string>}
             */
            _this.text_ = '';
            /**
             * @private
             * @type {number}
             */
            _this.textOffsetX_ = 0;
            /**
             * @private
             * @type {number}
             */
            _this.textOffsetY_ = 0;
            /**
             * @private
             * @type {boolean|undefined}
             */
            _this.textRotateWithView_ = undefined;
            /**
             * @private
             * @type {number}
             */
            _this.textRotation_ = 0;
            /**
             * @private
             * @type {?import("../canvas.js").FillState}
             */
            _this.textFillState_ = null;
            /**
             * @type {!Object<string, import("../canvas.js").FillState>}
             */
            _this.fillStates = {};
            /**
             * @private
             * @type {?import("../canvas.js").StrokeState}
             */
            _this.textStrokeState_ = null;
            /**
             * @type {!Object<string, import("../canvas.js").StrokeState>}
             */
            _this.strokeStates = {};
            /**
             * @private
             * @type {import("../canvas.js").TextState}
             */
            _this.textState_ = /** @type {import("../canvas.js").TextState} */ ({});
            /**
             * @type {!Object<string, import("../canvas.js").TextState>}
             */
            _this.textStates = {};
            /**
             * @private
             * @type {string}
             */
            _this.textKey_ = '';
            /**
             * @private
             * @type {string}
             */
            _this.fillKey_ = '';
            /**
             * @private
             * @type {string}
             */
            _this.strokeKey_ = '';
            /**
             * Data shared with an image builder for combined decluttering.
             * @private
             * @type {import("../canvas.js").DeclutterImageWithText}
             */
            _this.declutterImageWithText_ = undefined;
            return _this;
        }
        /**
         * @return {import("../canvas.js").SerializableInstructions} the serializable instructions.
         */
        CanvasTextBuilder.prototype.finish = function () {
            var instructions = _super.prototype.finish.call(this);
            instructions.textStates = this.textStates;
            instructions.fillStates = this.fillStates;
            instructions.strokeStates = this.strokeStates;
            return instructions;
        };
        /**
         * @param {import("../../geom/SimpleGeometry.js").default|import("../Feature.js").default} geometry Geometry.
         * @param {import("../../Feature.js").FeatureLike} feature Feature.
         */
        CanvasTextBuilder.prototype.drawText = function (geometry, feature) {
            var fillState = this.textFillState_;
            var strokeState = this.textStrokeState_;
            var textState = this.textState_;
            if (this.text_ === '' || !textState || (!fillState && !strokeState)) {
                return;
            }
            var coordinates = this.coordinates;
            var begin = coordinates.length;
            var geometryType = geometry.getType();
            var flatCoordinates = null;
            var stride = geometry.getStride();
            if (textState.placement === TextPlacement.LINE &&
                (geometryType == 'LineString' ||
                    geometryType == 'MultiLineString' ||
                    geometryType == 'Polygon' ||
                    geometryType == 'MultiPolygon')) {
                if (!intersects$1(this.getBufferedMaxExtent(), geometry.getExtent())) {
                    return;
                }
                var ends = void 0;
                flatCoordinates = geometry.getFlatCoordinates();
                if (geometryType == 'LineString') {
                    ends = [flatCoordinates.length];
                }
                else if (geometryType == 'MultiLineString') {
                    ends = /** @type {import("../../geom/MultiLineString.js").default} */ (geometry).getEnds();
                }
                else if (geometryType == 'Polygon') {
                    ends = /** @type {import("../../geom/Polygon.js").default} */ (geometry)
                        .getEnds()
                        .slice(0, 1);
                }
                else if (geometryType == 'MultiPolygon') {
                    var endss = 
                    /** @type {import("../../geom/MultiPolygon.js").default} */ (geometry).getEndss();
                    ends = [];
                    for (var i = 0, ii = endss.length; i < ii; ++i) {
                        ends.push(endss[i][0]);
                    }
                }
                this.beginGeometry(geometry, feature);
                var textAlign = textState.textAlign;
                // No `justify` support for line placement.
                var flatOffset = 0;
                var flatEnd = void 0;
                for (var o = 0, oo = ends.length; o < oo; ++o) {
                    if (textAlign == undefined) {
                        var range = matchingChunk(textState.maxAngle, flatCoordinates, flatOffset, ends[o], stride);
                        flatOffset = range[0];
                        flatEnd = range[1];
                    }
                    else {
                        flatEnd = ends[o];
                    }
                    for (var i = flatOffset; i < flatEnd; i += stride) {
                        coordinates.push(flatCoordinates[i], flatCoordinates[i + 1]);
                    }
                    var end = coordinates.length;
                    flatOffset = ends[o];
                    this.drawChars_(begin, end);
                    begin = end;
                }
                this.endGeometry(feature);
            }
            else {
                var geometryWidths = textState.overflow ? null : [];
                switch (geometryType) {
                    case 'Point':
                    case 'MultiPoint':
                        flatCoordinates =
                            /** @type {import("../../geom/MultiPoint.js").default} */ (geometry).getFlatCoordinates();
                        break;
                    case 'LineString':
                        flatCoordinates =
                            /** @type {import("../../geom/LineString.js").default} */ (geometry).getFlatMidpoint();
                        break;
                    case 'Circle':
                        flatCoordinates =
                            /** @type {import("../../geom/Circle.js").default} */ (geometry).getCenter();
                        break;
                    case 'MultiLineString':
                        flatCoordinates =
                            /** @type {import("../../geom/MultiLineString.js").default} */ (geometry).getFlatMidpoints();
                        stride = 2;
                        break;
                    case 'Polygon':
                        flatCoordinates =
                            /** @type {import("../../geom/Polygon.js").default} */ (geometry).getFlatInteriorPoint();
                        if (!textState.overflow) {
                            geometryWidths.push(flatCoordinates[2] / this.resolution);
                        }
                        stride = 3;
                        break;
                    case 'MultiPolygon':
                        var interiorPoints = 
                        /** @type {import("../../geom/MultiPolygon.js").default} */ (geometry).getFlatInteriorPoints();
                        flatCoordinates = [];
                        for (var i = 0, ii = interiorPoints.length; i < ii; i += 3) {
                            if (!textState.overflow) {
                                geometryWidths.push(interiorPoints[i + 2] / this.resolution);
                            }
                            flatCoordinates.push(interiorPoints[i], interiorPoints[i + 1]);
                        }
                        if (flatCoordinates.length === 0) {
                            return;
                        }
                        stride = 2;
                        break;
                }
                var end = this.appendFlatPointCoordinates(flatCoordinates, stride);
                if (end === begin) {
                    return;
                }
                if (geometryWidths &&
                    (end - begin) / 2 !== flatCoordinates.length / stride) {
                    var beg_1 = begin / 2;
                    geometryWidths = geometryWidths.filter(function (w, i) {
                        var keep = coordinates[(beg_1 + i) * 2] === flatCoordinates[i * stride] &&
                            coordinates[(beg_1 + i) * 2 + 1] === flatCoordinates[i * stride + 1];
                        if (!keep) {
                            --beg_1;
                        }
                        return keep;
                    });
                }
                this.saveTextStates_();
                if (textState.backgroundFill || textState.backgroundStroke) {
                    this.setFillStrokeStyle(textState.backgroundFill, textState.backgroundStroke);
                    if (textState.backgroundFill) {
                        this.updateFillStyle(this.state, this.createFill);
                        this.hitDetectionInstructions.push(this.createFill(this.state));
                    }
                    if (textState.backgroundStroke) {
                        this.updateStrokeStyle(this.state, this.applyStroke);
                        this.hitDetectionInstructions.push(this.createStroke(this.state));
                    }
                }
                this.beginGeometry(geometry, feature);
                // adjust padding for negative scale
                var padding = textState.padding;
                if (padding != defaultPadding &&
                    (textState.scale[0] < 0 || textState.scale[1] < 0)) {
                    var p0 = textState.padding[0];
                    var p1 = textState.padding[1];
                    var p2 = textState.padding[2];
                    var p3 = textState.padding[3];
                    if (textState.scale[0] < 0) {
                        p1 = -p1;
                        p3 = -p3;
                    }
                    if (textState.scale[1] < 0) {
                        p0 = -p0;
                        p2 = -p2;
                    }
                    padding = [p0, p1, p2, p3];
                }
                // The image is unknown at this stage so we pass null; it will be computed at render time.
                // For clarity, we pass NaN for offsetX, offsetY, width and height, which will be computed at
                // render time.
                var pixelRatio_1 = this.pixelRatio;
                this.instructions.push([
                    CanvasInstruction.DRAW_IMAGE,
                    begin,
                    end,
                    null,
                    NaN,
                    NaN,
                    NaN,
                    1,
                    0,
                    0,
                    this.textRotateWithView_,
                    this.textRotation_,
                    [1, 1],
                    NaN,
                    undefined,
                    this.declutterImageWithText_,
                    padding == defaultPadding
                        ? defaultPadding
                        : padding.map(function (p) {
                            return p * pixelRatio_1;
                        }),
                    !!textState.backgroundFill,
                    !!textState.backgroundStroke,
                    this.text_,
                    this.textKey_,
                    this.strokeKey_,
                    this.fillKey_,
                    this.textOffsetX_,
                    this.textOffsetY_,
                    geometryWidths,
                ]);
                var scale = 1 / pixelRatio_1;
                this.hitDetectionInstructions.push([
                    CanvasInstruction.DRAW_IMAGE,
                    begin,
                    end,
                    null,
                    NaN,
                    NaN,
                    NaN,
                    1,
                    0,
                    0,
                    this.textRotateWithView_,
                    this.textRotation_,
                    [scale, scale],
                    NaN,
                    undefined,
                    this.declutterImageWithText_,
                    padding,
                    !!textState.backgroundFill,
                    !!textState.backgroundStroke,
                    this.text_,
                    this.textKey_,
                    this.strokeKey_,
                    this.fillKey_,
                    this.textOffsetX_,
                    this.textOffsetY_,
                    geometryWidths,
                ]);
                this.endGeometry(feature);
            }
        };
        /**
         * @private
         */
        CanvasTextBuilder.prototype.saveTextStates_ = function () {
            var strokeState = this.textStrokeState_;
            var textState = this.textState_;
            var fillState = this.textFillState_;
            var strokeKey = this.strokeKey_;
            if (strokeState) {
                if (!(strokeKey in this.strokeStates)) {
                    this.strokeStates[strokeKey] = {
                        strokeStyle: strokeState.strokeStyle,
                        lineCap: strokeState.lineCap,
                        lineDashOffset: strokeState.lineDashOffset,
                        lineWidth: strokeState.lineWidth,
                        lineJoin: strokeState.lineJoin,
                        miterLimit: strokeState.miterLimit,
                        lineDash: strokeState.lineDash,
                    };
                }
            }
            var textKey = this.textKey_;
            if (!(textKey in this.textStates)) {
                this.textStates[textKey] = {
                    font: textState.font,
                    textAlign: textState.textAlign || defaultTextAlign,
                    justify: textState.justify,
                    textBaseline: textState.textBaseline || defaultTextBaseline,
                    scale: textState.scale,
                };
            }
            var fillKey = this.fillKey_;
            if (fillState) {
                if (!(fillKey in this.fillStates)) {
                    this.fillStates[fillKey] = {
                        fillStyle: fillState.fillStyle,
                    };
                }
            }
        };
        /**
         * @private
         * @param {number} begin Begin.
         * @param {number} end End.
         */
        CanvasTextBuilder.prototype.drawChars_ = function (begin, end) {
            var strokeState = this.textStrokeState_;
            var textState = this.textState_;
            var strokeKey = this.strokeKey_;
            var textKey = this.textKey_;
            var fillKey = this.fillKey_;
            this.saveTextStates_();
            var pixelRatio = this.pixelRatio;
            var baseline = TEXT_ALIGN[textState.textBaseline];
            var offsetY = this.textOffsetY_ * pixelRatio;
            var text = this.text_;
            var strokeWidth = strokeState
                ? (strokeState.lineWidth * Math.abs(textState.scale[0])) / 2
                : 0;
            this.instructions.push([
                CanvasInstruction.DRAW_CHARS,
                begin,
                end,
                baseline,
                textState.overflow,
                fillKey,
                textState.maxAngle,
                pixelRatio,
                offsetY,
                strokeKey,
                strokeWidth * pixelRatio,
                text,
                textKey,
                1,
            ]);
            this.hitDetectionInstructions.push([
                CanvasInstruction.DRAW_CHARS,
                begin,
                end,
                baseline,
                textState.overflow,
                fillKey,
                textState.maxAngle,
                1,
                offsetY,
                strokeKey,
                strokeWidth,
                text,
                textKey,
                1 / pixelRatio,
            ]);
        };
        /**
         * @param {import("../../style/Text.js").default} textStyle Text style.
         * @param {Object} [opt_sharedData] Shared data.
         */
        CanvasTextBuilder.prototype.setTextStyle = function (textStyle, opt_sharedData) {
            var textState, fillState, strokeState;
            if (!textStyle) {
                this.text_ = '';
            }
            else {
                var textFillStyle = textStyle.getFill();
                if (!textFillStyle) {
                    fillState = null;
                    this.textFillState_ = fillState;
                }
                else {
                    fillState = this.textFillState_;
                    if (!fillState) {
                        fillState = /** @type {import("../canvas.js").FillState} */ ({});
                        this.textFillState_ = fillState;
                    }
                    fillState.fillStyle = asColorLike(textFillStyle.getColor() || defaultFillStyle);
                }
                var textStrokeStyle = textStyle.getStroke();
                if (!textStrokeStyle) {
                    strokeState = null;
                    this.textStrokeState_ = strokeState;
                }
                else {
                    strokeState = this.textStrokeState_;
                    if (!strokeState) {
                        strokeState = /** @type {import("../canvas.js").StrokeState} */ ({});
                        this.textStrokeState_ = strokeState;
                    }
                    var lineDash = textStrokeStyle.getLineDash();
                    var lineDashOffset = textStrokeStyle.getLineDashOffset();
                    var lineWidth = textStrokeStyle.getWidth();
                    var miterLimit = textStrokeStyle.getMiterLimit();
                    strokeState.lineCap = textStrokeStyle.getLineCap() || defaultLineCap;
                    strokeState.lineDash = lineDash ? lineDash.slice() : defaultLineDash;
                    strokeState.lineDashOffset =
                        lineDashOffset === undefined ? defaultLineDashOffset : lineDashOffset;
                    strokeState.lineJoin = textStrokeStyle.getLineJoin() || defaultLineJoin;
                    strokeState.lineWidth =
                        lineWidth === undefined ? defaultLineWidth : lineWidth;
                    strokeState.miterLimit =
                        miterLimit === undefined ? defaultMiterLimit : miterLimit;
                    strokeState.strokeStyle = asColorLike(textStrokeStyle.getColor() || defaultStrokeStyle);
                }
                textState = this.textState_;
                var font = textStyle.getFont() || defaultFont;
                registerFont(font);
                var textScale = textStyle.getScaleArray();
                textState.overflow = textStyle.getOverflow();
                textState.font = font;
                textState.maxAngle = textStyle.getMaxAngle();
                textState.placement = textStyle.getPlacement();
                textState.textAlign = textStyle.getTextAlign();
                textState.justify = textStyle.getJustify();
                textState.textBaseline =
                    textStyle.getTextBaseline() || defaultTextBaseline;
                textState.backgroundFill = textStyle.getBackgroundFill();
                textState.backgroundStroke = textStyle.getBackgroundStroke();
                textState.padding = textStyle.getPadding() || defaultPadding;
                textState.scale = textScale === undefined ? [1, 1] : textScale;
                var textOffsetX = textStyle.getOffsetX();
                var textOffsetY = textStyle.getOffsetY();
                var textRotateWithView = textStyle.getRotateWithView();
                var textRotation = textStyle.getRotation();
                this.text_ = textStyle.getText() || '';
                this.textOffsetX_ = textOffsetX === undefined ? 0 : textOffsetX;
                this.textOffsetY_ = textOffsetY === undefined ? 0 : textOffsetY;
                this.textRotateWithView_ =
                    textRotateWithView === undefined ? false : textRotateWithView;
                this.textRotation_ = textRotation === undefined ? 0 : textRotation;
                this.strokeKey_ = strokeState
                    ? (typeof strokeState.strokeStyle == 'string'
                        ? strokeState.strokeStyle
                        : getUid(strokeState.strokeStyle)) +
                        strokeState.lineCap +
                        strokeState.lineDashOffset +
                        '|' +
                        strokeState.lineWidth +
                        strokeState.lineJoin +
                        strokeState.miterLimit +
                        '[' +
                        strokeState.lineDash.join() +
                        ']'
                    : '';
                this.textKey_ =
                    textState.font +
                        textState.scale +
                        (textState.textAlign || '?') +
                        (textState.justify || '?') +
                        (textState.textBaseline || '?');
                this.fillKey_ = fillState
                    ? typeof fillState.fillStyle == 'string'
                        ? fillState.fillStyle
                        : '|' + getUid(fillState.fillStyle)
                    : '';
            }
            this.declutterImageWithText_ = opt_sharedData;
        };
        return CanvasTextBuilder;
    }(Builder));
    var TextBuilder = CanvasTextBuilder;

    /**
     * @module ol/render/canvas/BuilderGroup
     */
    /**
     * @type {Object<import("../canvas.js").BuilderType, typeof Builder>}
     */
    var BATCH_CONSTRUCTORS = {
        'Circle': PolygonBuilder,
        'Default': Builder,
        'Image': ImageBuilder,
        'LineString': LineStringBuilder,
        'Polygon': PolygonBuilder,
        'Text': TextBuilder,
    };
    var BuilderGroup = /** @class */ (function () {
        /**
         * @param {number} tolerance Tolerance.
         * @param {import("../../extent.js").Extent} maxExtent Max extent.
         * @param {number} resolution Resolution.
         * @param {number} pixelRatio Pixel ratio.
         */
        function BuilderGroup(tolerance, maxExtent, resolution, pixelRatio) {
            /**
             * @private
             * @type {number}
             */
            this.tolerance_ = tolerance;
            /**
             * @private
             * @type {import("../../extent.js").Extent}
             */
            this.maxExtent_ = maxExtent;
            /**
             * @private
             * @type {number}
             */
            this.pixelRatio_ = pixelRatio;
            /**
             * @private
             * @type {number}
             */
            this.resolution_ = resolution;
            /**
             * @private
             * @type {!Object<string, !Object<import("../canvas.js").BuilderType, Builder>>}
             */
            this.buildersByZIndex_ = {};
        }
        /**
         * @return {!Object<string, !Object<import("../canvas.js").BuilderType, import("./Builder.js").SerializableInstructions>>} The serializable instructions
         */
        BuilderGroup.prototype.finish = function () {
            var builderInstructions = {};
            for (var zKey in this.buildersByZIndex_) {
                builderInstructions[zKey] = builderInstructions[zKey] || {};
                var builders = this.buildersByZIndex_[zKey];
                for (var builderKey in builders) {
                    var builderInstruction = builders[builderKey].finish();
                    builderInstructions[zKey][builderKey] = builderInstruction;
                }
            }
            return builderInstructions;
        };
        /**
         * @param {number|undefined} zIndex Z index.
         * @param {import("../canvas.js").BuilderType} builderType Replay type.
         * @return {import("../VectorContext.js").default} Replay.
         */
        BuilderGroup.prototype.getBuilder = function (zIndex, builderType) {
            var zIndexKey = zIndex !== undefined ? zIndex.toString() : '0';
            var replays = this.buildersByZIndex_[zIndexKey];
            if (replays === undefined) {
                replays = {};
                this.buildersByZIndex_[zIndexKey] = replays;
            }
            var replay = replays[builderType];
            if (replay === undefined) {
                var Constructor = BATCH_CONSTRUCTORS[builderType];
                replay = new Constructor(this.tolerance_, this.maxExtent_, this.resolution_, this.pixelRatio_);
                replays[builderType] = replay;
            }
            return replay;
        };
        return BuilderGroup;
    }());
    var CanvasBuilderGroup = BuilderGroup;

    var __extends$d = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            if (typeof b !== "function" && b !== null)
                throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * @template {import("../layer/Layer.js").default} LayerType
     */
    var LayerRenderer = /** @class */ (function (_super) {
        __extends$d(LayerRenderer, _super);
        /**
         * @param {LayerType} layer Layer.
         */
        function LayerRenderer(layer) {
            var _this = _super.call(this) || this;
            /**
             * The renderer is initialized and ready to render.
             * @type {boolean}
             */
            _this.ready = true;
            /** @private */
            _this.boundHandleImageChange_ = _this.handleImageChange_.bind(_this);
            /**
             * @protected
             * @type {LayerType}
             */
            _this.layer_ = layer;
            /**
             * @type {import("../render/canvas/ExecutorGroup").default}
             */
            _this.declutterExecutorGroup = null;
            return _this;
        }
        /**
         * Asynchronous layer level hit detection.
         * @param {import("../pixel.js").Pixel} pixel Pixel.
         * @return {Promise<Array<import("../Feature").default>>} Promise that resolves with
         * an array of features.
         */
        LayerRenderer.prototype.getFeatures = function (pixel) {
            return abstract();
        };
        /**
         * @param {import("../pixel.js").Pixel} pixel Pixel.
         * @return {Uint8ClampedArray|Uint8Array|Float32Array|DataView|null} Pixel data.
         */
        LayerRenderer.prototype.getData = function (pixel) {
            return null;
        };
        /**
         * Determine whether render should be called.
         * @abstract
         * @param {import("../PluggableMap.js").FrameState} frameState Frame state.
         * @return {boolean} Layer is ready to be rendered.
         */
        LayerRenderer.prototype.prepareFrame = function (frameState) {
            return abstract();
        };
        /**
         * Render the layer.
         * @abstract
         * @param {import("../PluggableMap.js").FrameState} frameState Frame state.
         * @param {HTMLElement} target Target that may be used to render content to.
         * @return {HTMLElement} The rendered element.
         */
        LayerRenderer.prototype.renderFrame = function (frameState, target) {
            return abstract();
        };
        /**
         * @param {Object<number, Object<string, import("../Tile.js").default>>} tiles Lookup of loaded tiles by zoom level.
         * @param {number} zoom Zoom level.
         * @param {import("../Tile.js").default} tile Tile.
         * @return {boolean|void} If `false`, the tile will not be considered loaded.
         */
        LayerRenderer.prototype.loadedTileCallback = function (tiles, zoom, tile) {
            if (!tiles[zoom]) {
                tiles[zoom] = {};
            }
            tiles[zoom][tile.tileCoord.toString()] = tile;
            return undefined;
        };
        /**
         * Create a function that adds loaded tiles to the tile lookup.
         * @param {import("../source/Tile.js").default} source Tile source.
         * @param {import("../proj/Projection.js").default} projection Projection of the tiles.
         * @param {Object<number, Object<string, import("../Tile.js").default>>} tiles Lookup of loaded tiles by zoom level.
         * @return {function(number, import("../TileRange.js").default):boolean} A function that can be
         *     called with a zoom level and a tile range to add loaded tiles to the lookup.
         * @protected
         */
        LayerRenderer.prototype.createLoadedTileFinder = function (source, projection, tiles) {
            return (
            /**
             * @param {number} zoom Zoom level.
             * @param {import("../TileRange.js").default} tileRange Tile range.
             * @return {boolean} The tile range is fully loaded.
             * @this {LayerRenderer}
             */
            function (zoom, tileRange) {
                var callback = this.loadedTileCallback.bind(this, tiles, zoom);
                return source.forEachLoadedTile(projection, zoom, tileRange, callback);
            }.bind(this));
        };
        /**
         * @abstract
         * @param {import("../coordinate.js").Coordinate} coordinate Coordinate.
         * @param {import("../PluggableMap.js").FrameState} frameState Frame state.
         * @param {number} hitTolerance Hit tolerance in pixels.
         * @param {import("./vector.js").FeatureCallback<T>} callback Feature callback.
         * @param {Array<import("./Map.js").HitMatch<T>>} matches The hit detected matches with tolerance.
         * @return {T|undefined} Callback result.
         * @template T
         */
        LayerRenderer.prototype.forEachFeatureAtCoordinate = function (coordinate, frameState, hitTolerance, callback, matches) {
            return undefined;
        };
        /**
         * @abstract
         * @param {import("../pixel.js").Pixel} pixel Pixel.
         * @param {import("../PluggableMap.js").FrameState} frameState FrameState.
         * @param {number} hitTolerance Hit tolerance in pixels.
         * @return {Uint8ClampedArray|Uint8Array} The result.  If there is no data at the pixel
         *    location, null will be returned.  If there is data, but pixel values cannot be
         *    returned, and empty array will be returned.
         */
        LayerRenderer.prototype.getDataAtPixel = function (pixel, frameState, hitTolerance) {
            return null;
        };
        /**
         * @return {LayerType} Layer.
         */
        LayerRenderer.prototype.getLayer = function () {
            return this.layer_;
        };
        /**
         * Perform action necessary to get the layer rendered after new fonts have loaded
         * @abstract
         */
        LayerRenderer.prototype.handleFontsChanged = function () { };
        /**
         * Handle changes in image state.
         * @param {import("../events/Event.js").default} event Image change event.
         * @private
         */
        LayerRenderer.prototype.handleImageChange_ = function (event) {
            var image = /** @type {import("../Image.js").default} */ (event.target);
            if (image.getState() === ImageState.LOADED) {
                this.renderIfReadyAndVisible();
            }
        };
        /**
         * Load the image if not already loaded, and register the image change
         * listener if needed.
         * @param {import("../ImageBase.js").default} image Image.
         * @return {boolean} `true` if the image is already loaded, `false` otherwise.
         * @protected
         */
        LayerRenderer.prototype.loadImage = function (image) {
            var imageState = image.getState();
            if (imageState != ImageState.LOADED && imageState != ImageState.ERROR) {
                image.addEventListener(EventType.CHANGE, this.boundHandleImageChange_);
            }
            if (imageState == ImageState.IDLE) {
                image.load();
                imageState = image.getState();
            }
            return imageState == ImageState.LOADED;
        };
        /**
         * @protected
         */
        LayerRenderer.prototype.renderIfReadyAndVisible = function () {
            var layer = this.getLayer();
            if (layer && layer.getVisible() && layer.getSourceState() === 'ready') {
                layer.changed();
            }
        };
        /**
         * Clean up.
         */
        LayerRenderer.prototype.disposeInternal = function () {
            delete this.layer_;
            _super.prototype.disposeInternal.call(this);
        };
        return LayerRenderer;
    }(Observable));
    var LayerRenderer$1 = LayerRenderer;

    /**
     * @module ol/render/Event
     */
    var __extends$c = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            if (typeof b !== "function" && b !== null)
                throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var RenderEvent = /** @class */ (function (_super) {
        __extends$c(RenderEvent, _super);
        /**
         * @param {import("./EventType.js").default} type Type.
         * @param {import("../transform.js").Transform} [opt_inversePixelTransform] Transform for
         *     CSS pixels to rendered pixels.
         * @param {import("../PluggableMap.js").FrameState} [opt_frameState] Frame state.
         * @param {?(CanvasRenderingContext2D|WebGLRenderingContext)} [opt_context] Context.
         */
        function RenderEvent(type, opt_inversePixelTransform, opt_frameState, opt_context) {
            var _this = _super.call(this, type) || this;
            /**
             * Transform from CSS pixels (relative to the top-left corner of the map viewport)
             * to rendered pixels on this event's `context`. Only available when a Canvas renderer is used, null otherwise.
             * @type {import("../transform.js").Transform|undefined}
             * @api
             */
            _this.inversePixelTransform = opt_inversePixelTransform;
            /**
             * An object representing the current render frame state.
             * @type {import("../PluggableMap.js").FrameState|undefined}
             * @api
             */
            _this.frameState = opt_frameState;
            /**
             * Canvas context. Not available when the event is dispatched by the map. For Canvas 2D layers,
             * the context will be the 2D rendering context.  For WebGL layers, the context will be the WebGL
             * context.
             * @type {CanvasRenderingContext2D|WebGLRenderingContext|undefined}
             * @api
             */
            _this.context = opt_context;
            return _this;
        }
        return RenderEvent;
    }(Event));
    var RenderEvent$1 = RenderEvent;

    var __extends$b = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            if (typeof b !== "function" && b !== null)
                throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * @type {Array<HTMLCanvasElement>}
     */
    var canvasPool = [];
    /**
     * @type {CanvasRenderingContext2D}
     */
    var pixelContext = null;
    function createPixelContext() {
        var canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        pixelContext = canvas.getContext('2d');
    }
    /**
     * @abstract
     * @template {import("../../layer/Layer.js").default} LayerType
     * @extends {LayerRenderer<LayerType>}
     */
    var CanvasLayerRenderer = /** @class */ (function (_super) {
        __extends$b(CanvasLayerRenderer, _super);
        /**
         * @param {LayerType} layer Layer.
         */
        function CanvasLayerRenderer(layer) {
            var _this = _super.call(this, layer) || this;
            /**
             * @protected
             * @type {HTMLElement}
             */
            _this.container = null;
            /**
             * @protected
             * @type {number}
             */
            _this.renderedResolution;
            /**
             * A temporary transform.  The values in this transform should only be used in a
             * function that sets the values.
             * @protected
             * @type {import("../../transform.js").Transform}
             */
            _this.tempTransform = create();
            /**
             * The transform for rendered pixels to viewport CSS pixels.  This transform must
             * be set when rendering a frame and may be used by other functions after rendering.
             * @protected
             * @type {import("../../transform.js").Transform}
             */
            _this.pixelTransform = create();
            /**
             * The transform for viewport CSS pixels to rendered pixels.  This transform must
             * be set when rendering a frame and may be used by other functions after rendering.
             * @protected
             * @type {import("../../transform.js").Transform}
             */
            _this.inversePixelTransform = create();
            /**
             * @type {CanvasRenderingContext2D}
             */
            _this.context = null;
            /**
             * @type {boolean}
             */
            _this.containerReused = false;
            /**
             * @private
             * @type {CanvasRenderingContext2D}
             */
            _this.pixelContext_ = null;
            /**
             * @protected
             * @type {import("../../PluggableMap.js").FrameState|null}
             */
            _this.frameState = null;
            return _this;
        }
        /**
         * @param {HTMLCanvasElement|HTMLImageElement|HTMLVideoElement} image Image.
         * @param {number} col The column index.
         * @param {number} row The row index.
         * @return {Uint8ClampedArray|null} The image data.
         */
        CanvasLayerRenderer.prototype.getImageData = function (image, col, row) {
            if (!pixelContext) {
                createPixelContext();
            }
            pixelContext.clearRect(0, 0, 1, 1);
            var data;
            try {
                pixelContext.drawImage(image, col, row, 1, 1, 0, 0, 1, 1);
                data = pixelContext.getImageData(0, 0, 1, 1).data;
            }
            catch (err) {
                pixelContext = null;
                return null;
            }
            return data;
        };
        /**
         * @param {import('../../PluggableMap.js').FrameState} frameState Frame state.
         * @return {string} Background color.
         */
        CanvasLayerRenderer.prototype.getBackground = function (frameState) {
            var layer = this.getLayer();
            var background = layer.getBackground();
            if (typeof background === 'function') {
                background = background(frameState.viewState.resolution);
            }
            return background || undefined;
        };
        /**
         * Get a rendering container from an existing target, if compatible.
         * @param {HTMLElement} target Potential render target.
         * @param {string} transform CSS Transform.
         * @param {string} [opt_backgroundColor] Background color.
         */
        CanvasLayerRenderer.prototype.useContainer = function (target, transform, opt_backgroundColor) {
            var layerClassName = this.getLayer().getClassName();
            var container, context;
            if (target &&
                target.className === layerClassName &&
                (!opt_backgroundColor ||
                    (target &&
                        target.style.backgroundColor &&
                        equals$1(asArray(target.style.backgroundColor), asArray(opt_backgroundColor))))) {
                var canvas = target.firstElementChild;
                if (canvas instanceof HTMLCanvasElement) {
                    context = canvas.getContext('2d');
                }
            }
            if (context && context.canvas.style.transform === transform) {
                // Container of the previous layer renderer can be used.
                this.container = target;
                this.context = context;
                this.containerReused = true;
            }
            else if (this.containerReused) {
                // Previously reused container cannot be used any more.
                this.container = null;
                this.context = null;
                this.containerReused = false;
            }
            if (!this.container) {
                container = document.createElement('div');
                container.className = layerClassName;
                var style = container.style;
                style.position = 'absolute';
                style.width = '100%';
                style.height = '100%';
                context = createCanvasContext2D();
                var canvas = context.canvas;
                container.appendChild(canvas);
                style = canvas.style;
                style.position = 'absolute';
                style.left = '0';
                style.transformOrigin = 'top left';
                this.container = container;
                this.context = context;
            }
            if (!this.containerReused &&
                opt_backgroundColor &&
                !this.container.style.backgroundColor) {
                this.container.style.backgroundColor = opt_backgroundColor;
            }
        };
        /**
         * @param {CanvasRenderingContext2D} context Context.
         * @param {import("../../PluggableMap.js").FrameState} frameState Frame state.
         * @param {import("../../extent.js").Extent} extent Clip extent.
         * @protected
         */
        CanvasLayerRenderer.prototype.clipUnrotated = function (context, frameState, extent) {
            var topLeft = getTopLeft(extent);
            var topRight = getTopRight(extent);
            var bottomRight = getBottomRight(extent);
            var bottomLeft = getBottomLeft(extent);
            apply(frameState.coordinateToPixelTransform, topLeft);
            apply(frameState.coordinateToPixelTransform, topRight);
            apply(frameState.coordinateToPixelTransform, bottomRight);
            apply(frameState.coordinateToPixelTransform, bottomLeft);
            var inverted = this.inversePixelTransform;
            apply(inverted, topLeft);
            apply(inverted, topRight);
            apply(inverted, bottomRight);
            apply(inverted, bottomLeft);
            context.save();
            context.beginPath();
            context.moveTo(Math.round(topLeft[0]), Math.round(topLeft[1]));
            context.lineTo(Math.round(topRight[0]), Math.round(topRight[1]));
            context.lineTo(Math.round(bottomRight[0]), Math.round(bottomRight[1]));
            context.lineTo(Math.round(bottomLeft[0]), Math.round(bottomLeft[1]));
            context.clip();
        };
        /**
         * @param {import("../../render/EventType.js").default} type Event type.
         * @param {CanvasRenderingContext2D} context Context.
         * @param {import("../../PluggableMap.js").FrameState} frameState Frame state.
         * @private
         */
        CanvasLayerRenderer.prototype.dispatchRenderEvent_ = function (type, context, frameState) {
            var layer = this.getLayer();
            if (layer.hasListener(type)) {
                var event_1 = new RenderEvent$1(type, this.inversePixelTransform, frameState, context);
                layer.dispatchEvent(event_1);
            }
        };
        /**
         * @param {CanvasRenderingContext2D} context Context.
         * @param {import("../../PluggableMap.js").FrameState} frameState Frame state.
         * @protected
         */
        CanvasLayerRenderer.prototype.preRender = function (context, frameState) {
            this.frameState = frameState;
            this.dispatchRenderEvent_(RenderEventType.PRERENDER, context, frameState);
        };
        /**
         * @param {CanvasRenderingContext2D} context Context.
         * @param {import("../../PluggableMap.js").FrameState} frameState Frame state.
         * @protected
         */
        CanvasLayerRenderer.prototype.postRender = function (context, frameState) {
            this.dispatchRenderEvent_(RenderEventType.POSTRENDER, context, frameState);
        };
        /**
         * Creates a transform for rendering to an element that will be rotated after rendering.
         * @param {import("../../coordinate.js").Coordinate} center Center.
         * @param {number} resolution Resolution.
         * @param {number} rotation Rotation.
         * @param {number} pixelRatio Pixel ratio.
         * @param {number} width Width of the rendered element (in pixels).
         * @param {number} height Height of the rendered element (in pixels).
         * @param {number} offsetX Offset on the x-axis in view coordinates.
         * @protected
         * @return {!import("../../transform.js").Transform} Transform.
         */
        CanvasLayerRenderer.prototype.getRenderTransform = function (center, resolution, rotation, pixelRatio, width, height, offsetX) {
            var dx1 = width / 2;
            var dy1 = height / 2;
            var sx = pixelRatio / resolution;
            var sy = -sx;
            var dx2 = -center[0] + offsetX;
            var dy2 = -center[1];
            return compose(this.tempTransform, dx1, dy1, sx, sy, -rotation, dx2, dy2);
        };
        /**
         * @param {import("../../pixel.js").Pixel} pixel Pixel.
         * @param {import("../../PluggableMap.js").FrameState} frameState FrameState.
         * @param {number} hitTolerance Hit tolerance in pixels.
         * @return {Uint8ClampedArray|Uint8Array} The result.  If there is no data at the pixel
         *    location, null will be returned.  If there is data, but pixel values cannot be
         *    returned, and empty array will be returned.
         */
        CanvasLayerRenderer.prototype.getDataAtPixel = function (pixel, frameState, hitTolerance) {
            var renderPixel = apply(this.inversePixelTransform, pixel.slice());
            var context = this.context;
            var layer = this.getLayer();
            var layerExtent = layer.getExtent();
            if (layerExtent) {
                var renderCoordinate = apply(frameState.pixelToCoordinateTransform, pixel.slice());
                /** get only data inside of the layer extent */
                if (!containsCoordinate(layerExtent, renderCoordinate)) {
                    return null;
                }
            }
            var x = Math.round(renderPixel[0]);
            var y = Math.round(renderPixel[1]);
            var pixelContext = this.pixelContext_;
            if (!pixelContext) {
                var pixelCanvas = document.createElement('canvas');
                pixelCanvas.width = 1;
                pixelCanvas.height = 1;
                pixelContext = pixelCanvas.getContext('2d');
                this.pixelContext_ = pixelContext;
            }
            pixelContext.clearRect(0, 0, 1, 1);
            var data;
            try {
                pixelContext.drawImage(context.canvas, x, y, 1, 1, 0, 0, 1, 1);
                data = pixelContext.getImageData(0, 0, 1, 1).data;
            }
            catch (err) {
                if (err.name === 'SecurityError') {
                    // tainted canvas, we assume there is data at the given pixel (although there might not be)
                    this.pixelContext_ = null;
                    return new Uint8Array();
                }
                return data;
            }
            if (data[3] === 0) {
                return null;
            }
            return data;
        };
        /**
         * Clean up.
         */
        CanvasLayerRenderer.prototype.disposeInternal = function () {
            delete this.frameState;
            _super.prototype.disposeInternal.call(this);
        };
        return CanvasLayerRenderer;
    }(LayerRenderer$1));
    var CanvasLayerRenderer$1 = CanvasLayerRenderer;

    /**
     * @module ol/geom/flat/textpath
     */
    /**
     * @param {Array<number>} flatCoordinates Path to put text on.
     * @param {number} offset Start offset of the `flatCoordinates`.
     * @param {number} end End offset of the `flatCoordinates`.
     * @param {number} stride Stride.
     * @param {string} text Text to place on the path.
     * @param {number} startM m along the path where the text starts.
     * @param {number} maxAngle Max angle between adjacent chars in radians.
     * @param {number} scale The product of the text scale and the device pixel ratio.
     * @param {function(string, string, Object<string, number>):number} measureAndCacheTextWidth Measure and cache text width.
     * @param {string} font The font.
     * @param {Object<string, number>} cache A cache of measured widths.
     * @param {number} rotation Rotation to apply to the flatCoordinates to determine whether text needs to be reversed.
     * @return {Array<Array<*>>|null} The result array (or null if `maxAngle` was
     * exceeded). Entries of the array are x, y, anchorX, angle, chunk.
     */
    function drawTextOnPath(flatCoordinates, offset, end, stride, text, startM, maxAngle, scale, measureAndCacheTextWidth, font, cache, rotation) {
        var x2 = flatCoordinates[offset];
        var y2 = flatCoordinates[offset + 1];
        var x1 = 0;
        var y1 = 0;
        var segmentLength = 0;
        var segmentM = 0;
        function advance() {
            x1 = x2;
            y1 = y2;
            offset += stride;
            x2 = flatCoordinates[offset];
            y2 = flatCoordinates[offset + 1];
            segmentM += segmentLength;
            segmentLength = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
        }
        do {
            advance();
        } while (offset < end - stride && segmentM + segmentLength < startM);
        var interpolate = segmentLength === 0 ? 0 : (startM - segmentM) / segmentLength;
        var beginX = lerp(x1, x2, interpolate);
        var beginY = lerp(y1, y2, interpolate);
        var startOffset = offset - stride;
        var startLength = segmentM;
        var endM = startM + scale * measureAndCacheTextWidth(font, text, cache);
        while (offset < end - stride && segmentM + segmentLength < endM) {
            advance();
        }
        interpolate = segmentLength === 0 ? 0 : (endM - segmentM) / segmentLength;
        var endX = lerp(x1, x2, interpolate);
        var endY = lerp(y1, y2, interpolate);
        // Keep text upright
        var reverse;
        if (rotation) {
            var flat = [beginX, beginY, endX, endY];
            rotate(flat, 0, 4, 2, rotation, flat, flat);
            reverse = flat[0] > flat[2];
        }
        else {
            reverse = beginX > endX;
        }
        var PI = Math.PI;
        var result = [];
        var singleSegment = startOffset + stride === offset;
        offset = startOffset;
        segmentLength = 0;
        segmentM = startLength;
        x2 = flatCoordinates[offset];
        y2 = flatCoordinates[offset + 1];
        var previousAngle;
        // All on the same segment
        if (singleSegment) {
            advance();
            previousAngle = Math.atan2(y2 - y1, x2 - x1);
            if (reverse) {
                previousAngle += previousAngle > 0 ? -PI : PI;
            }
            var x = (endX + beginX) / 2;
            var y = (endY + beginY) / 2;
            result[0] = [x, y, (endM - startM) / 2, previousAngle, text];
            return result;
        }
        // rendering across line segments
        text = text.replace(/\n/g, ' '); // ensure rendering in single-line as all calculations below don't handle multi-lines
        for (var i = 0, ii = text.length; i < ii;) {
            advance();
            var angle = Math.atan2(y2 - y1, x2 - x1);
            if (reverse) {
                angle += angle > 0 ? -PI : PI;
            }
            if (previousAngle !== undefined) {
                var delta = angle - previousAngle;
                delta += delta > PI ? -2 * PI : delta < -PI ? 2 * PI : 0;
                if (Math.abs(delta) > maxAngle) {
                    return null;
                }
            }
            previousAngle = angle;
            var iStart = i;
            var charLength = 0;
            for (; i < ii; ++i) {
                var index = reverse ? ii - i - 1 : i;
                var len = scale * measureAndCacheTextWidth(font, text[index], cache);
                if (offset + stride < end &&
                    segmentM + segmentLength < startM + charLength + len / 2) {
                    break;
                }
                charLength += len;
            }
            if (i === iStart) {
                continue;
            }
            var chars = reverse
                ? text.substring(ii - iStart, ii - i)
                : text.substring(iStart, i);
            interpolate =
                segmentLength === 0
                    ? 0
                    : (startM + charLength / 2 - segmentM) / segmentLength;
            var x = lerp(x1, x2, interpolate);
            var y = lerp(y1, y2, interpolate);
            result.push([x, y, charLength / 2, angle, chars]);
            startM += charLength;
        }
        return result;
    }

    /**
     * @module ol/render/canvas/Executor
     */
    /**
     * @typedef {Object} BBox
     * @property {number} minX Minimal x.
     * @property {number} minY Minimal y.
     * @property {number} maxX Maximal x.
     * @property {number} maxY Maximal y
     * @property {*} value Value.
     */
    /**
     * @typedef {Object} ImageOrLabelDimensions
     * @property {number} drawImageX DrawImageX.
     * @property {number} drawImageY DrawImageY.
     * @property {number} drawImageW DrawImageW.
     * @property {number} drawImageH DrawImageH.
     * @property {number} originX OriginX.
     * @property {number} originY OriginY.
     * @property {Array<number>} scale Scale.
     * @property {BBox} declutterBox DeclutterBox.
     * @property {import("../../transform.js").Transform} canvasTransform CanvasTransform.
     */
    /**
     * @typedef {{0: CanvasRenderingContext2D, 1: number, 2: import("../canvas.js").Label|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement, 3: ImageOrLabelDimensions, 4: number, 5: Array<*>, 6: Array<*>}} ReplayImageOrLabelArgs
     */
    /**
     * @template T
     * @typedef {function(import("../../Feature.js").FeatureLike, import("../../geom/SimpleGeometry.js").default): T} FeatureCallback
     */
    /**
     * @type {import("../../extent.js").Extent}
     */
    var tmpExtent = createEmpty();
    /** @type {import("../../coordinate.js").Coordinate} */
    var p1 = [];
    /** @type {import("../../coordinate.js").Coordinate} */
    var p2 = [];
    /** @type {import("../../coordinate.js").Coordinate} */
    var p3 = [];
    /** @type {import("../../coordinate.js").Coordinate} */
    var p4 = [];
    /**
     * @param {ReplayImageOrLabelArgs} replayImageOrLabelArgs Arguments to replayImageOrLabel
     * @return {BBox} Declutter bbox.
     */
    function getDeclutterBox(replayImageOrLabelArgs) {
        return replayImageOrLabelArgs[3].declutterBox;
    }
    var rtlRegEx = new RegExp(
    /* eslint-disable prettier/prettier */
    '[' +
        String.fromCharCode(0x00591) + '-' + String.fromCharCode(0x008ff) +
        String.fromCharCode(0x0fb1d) + '-' + String.fromCharCode(0x0fdff) +
        String.fromCharCode(0x0fe70) + '-' + String.fromCharCode(0x0fefc) +
        String.fromCharCode(0x10800) + '-' + String.fromCharCode(0x10fff) +
        String.fromCharCode(0x1e800) + '-' + String.fromCharCode(0x1efff) +
        ']'
    /* eslint-enable prettier/prettier */
    );
    /**
     * @param {string} text Text.
     * @param {string} align Alignment.
     * @return {number} Text alignment.
     */
    function horizontalTextAlign(text, align) {
        if ((align === 'start' || align === 'end') && !rtlRegEx.test(text)) {
            align = align === 'start' ? 'left' : 'right';
        }
        return TEXT_ALIGN[align];
    }
    /**
     * @param {Array<string>} acc Accumulator.
     * @param {string} line Line of text.
     * @param {number} i Index
     * @return {Array<string>} Accumulator.
     */
    function createTextChunks(acc, line, i) {
        if (i > 0) {
            acc.push('\n', '');
        }
        acc.push(line, '');
        return acc;
    }
    var Executor = /** @class */ (function () {
        /**
         * @param {number} resolution Resolution.
         * @param {number} pixelRatio Pixel ratio.
         * @param {boolean} overlaps The replay can have overlapping geometries.
         * @param {import("../canvas.js").SerializableInstructions} instructions The serializable instructions
         */
        function Executor(resolution, pixelRatio, overlaps, instructions) {
            /**
             * @protected
             * @type {boolean}
             */
            this.overlaps = overlaps;
            /**
             * @protected
             * @type {number}
             */
            this.pixelRatio = pixelRatio;
            /**
             * @protected
             * @const
             * @type {number}
             */
            this.resolution = resolution;
            /**
             * @private
             * @type {boolean}
             */
            this.alignFill_;
            /**
             * @protected
             * @type {Array<*>}
             */
            this.instructions = instructions.instructions;
            /**
             * @protected
             * @type {Array<number>}
             */
            this.coordinates = instructions.coordinates;
            /**
             * @private
             * @type {!Object<number,import("../../coordinate.js").Coordinate|Array<import("../../coordinate.js").Coordinate>|Array<Array<import("../../coordinate.js").Coordinate>>>}
             */
            this.coordinateCache_ = {};
            /**
             * @private
             * @type {!import("../../transform.js").Transform}
             */
            this.renderedTransform_ = create();
            /**
             * @protected
             * @type {Array<*>}
             */
            this.hitDetectionInstructions = instructions.hitDetectionInstructions;
            /**
             * @private
             * @type {Array<number>}
             */
            this.pixelCoordinates_ = null;
            /**
             * @private
             * @type {number}
             */
            this.viewRotation_ = 0;
            /**
             * @type {!Object<string, import("../canvas.js").FillState>}
             */
            this.fillStates = instructions.fillStates || {};
            /**
             * @type {!Object<string, import("../canvas.js").StrokeState>}
             */
            this.strokeStates = instructions.strokeStates || {};
            /**
             * @type {!Object<string, import("../canvas.js").TextState>}
             */
            this.textStates = instructions.textStates || {};
            /**
             * @private
             * @type {Object<string, Object<string, number>>}
             */
            this.widths_ = {};
            /**
             * @private
             * @type {Object<string, import("../canvas.js").Label>}
             */
            this.labels_ = {};
        }
        /**
         * @param {string|Array<string>} text Text.
         * @param {string} textKey Text style key.
         * @param {string} fillKey Fill style key.
         * @param {string} strokeKey Stroke style key.
         * @return {import("../canvas.js").Label} Label.
         */
        Executor.prototype.createLabel = function (text, textKey, fillKey, strokeKey) {
            var key = text + textKey + fillKey + strokeKey;
            if (this.labels_[key]) {
                return this.labels_[key];
            }
            var strokeState = strokeKey ? this.strokeStates[strokeKey] : null;
            var fillState = fillKey ? this.fillStates[fillKey] : null;
            var textState = this.textStates[textKey];
            var pixelRatio = this.pixelRatio;
            var scale = [
                textState.scale[0] * pixelRatio,
                textState.scale[1] * pixelRatio,
            ];
            var textIsArray = Array.isArray(text);
            var align = textState.justify
                ? TEXT_ALIGN[textState.justify]
                : horizontalTextAlign(Array.isArray(text) ? text[0] : text, textState.textAlign || defaultTextAlign);
            var strokeWidth = strokeKey && strokeState.lineWidth ? strokeState.lineWidth : 0;
            var chunks = textIsArray
                ? text
                : text.split('\n').reduce(createTextChunks, []);
            var _a = getTextDimensions(textState, chunks), width = _a.width, height = _a.height, widths = _a.widths, heights = _a.heights, lineWidths = _a.lineWidths;
            var renderWidth = width + strokeWidth;
            var contextInstructions = [];
            // make canvas 2 pixels wider to account for italic text width measurement errors
            var w = (renderWidth + 2) * scale[0];
            var h = (height + strokeWidth) * scale[1];
            /** @type {import("../canvas.js").Label} */
            var label = {
                width: w < 0 ? Math.floor(w) : Math.ceil(w),
                height: h < 0 ? Math.floor(h) : Math.ceil(h),
                contextInstructions: contextInstructions,
            };
            if (scale[0] != 1 || scale[1] != 1) {
                contextInstructions.push('scale', scale);
            }
            if (strokeKey) {
                contextInstructions.push('strokeStyle', strokeState.strokeStyle);
                contextInstructions.push('lineWidth', strokeWidth);
                contextInstructions.push('lineCap', strokeState.lineCap);
                contextInstructions.push('lineJoin', strokeState.lineJoin);
                contextInstructions.push('miterLimit', strokeState.miterLimit);
                // eslint-disable-next-line
                var Context = WORKER_OFFSCREEN_CANVAS ? OffscreenCanvasRenderingContext2D : CanvasRenderingContext2D;
                if (Context.prototype.setLineDash) {
                    contextInstructions.push('setLineDash', [strokeState.lineDash]);
                    contextInstructions.push('lineDashOffset', strokeState.lineDashOffset);
                }
            }
            if (fillKey) {
                contextInstructions.push('fillStyle', fillState.fillStyle);
            }
            contextInstructions.push('textBaseline', 'middle');
            contextInstructions.push('textAlign', 'center');
            var leftRight = 0.5 - align;
            var x = align * renderWidth + leftRight * strokeWidth;
            var strokeInstructions = [];
            var fillInstructions = [];
            var lineHeight = 0;
            var lineOffset = 0;
            var widthHeightIndex = 0;
            var lineWidthIndex = 0;
            var previousFont;
            for (var i = 0, ii = chunks.length; i < ii; i += 2) {
                var text_1 = chunks[i];
                if (text_1 === '\n') {
                    lineOffset += lineHeight;
                    lineHeight = 0;
                    x = align * renderWidth + leftRight * strokeWidth;
                    ++lineWidthIndex;
                    continue;
                }
                var font = chunks[i + 1] || textState.font;
                if (font !== previousFont) {
                    if (strokeKey) {
                        strokeInstructions.push('font', font);
                    }
                    if (fillKey) {
                        fillInstructions.push('font', font);
                    }
                    previousFont = font;
                }
                lineHeight = Math.max(lineHeight, heights[widthHeightIndex]);
                var fillStrokeArgs = [
                    text_1,
                    x +
                        leftRight * widths[widthHeightIndex] +
                        align * (widths[widthHeightIndex] - lineWidths[lineWidthIndex]),
                    0.5 * (strokeWidth + lineHeight) + lineOffset,
                ];
                x += widths[widthHeightIndex];
                if (strokeKey) {
                    strokeInstructions.push('strokeText', fillStrokeArgs);
                }
                if (fillKey) {
                    fillInstructions.push('fillText', fillStrokeArgs);
                }
                ++widthHeightIndex;
            }
            Array.prototype.push.apply(contextInstructions, strokeInstructions);
            Array.prototype.push.apply(contextInstructions, fillInstructions);
            this.labels_[key] = label;
            return label;
        };
        /**
         * @param {CanvasRenderingContext2D} context Context.
         * @param {import("../../coordinate.js").Coordinate} p1 1st point of the background box.
         * @param {import("../../coordinate.js").Coordinate} p2 2nd point of the background box.
         * @param {import("../../coordinate.js").Coordinate} p3 3rd point of the background box.
         * @param {import("../../coordinate.js").Coordinate} p4 4th point of the background box.
         * @param {Array<*>} fillInstruction Fill instruction.
         * @param {Array<*>} strokeInstruction Stroke instruction.
         */
        Executor.prototype.replayTextBackground_ = function (context, p1, p2, p3, p4, fillInstruction, strokeInstruction) {
            context.beginPath();
            context.moveTo.apply(context, p1);
            context.lineTo.apply(context, p2);
            context.lineTo.apply(context, p3);
            context.lineTo.apply(context, p4);
            context.lineTo.apply(context, p1);
            if (fillInstruction) {
                this.alignFill_ = /** @type {boolean} */ (fillInstruction[2]);
                this.fill_(context);
            }
            if (strokeInstruction) {
                this.setStrokeStyle_(context, 
                /** @type {Array<*>} */ (strokeInstruction));
                context.stroke();
            }
        };
        /**
         * @private
         * @param {number} sheetWidth Width of the sprite sheet.
         * @param {number} sheetHeight Height of the sprite sheet.
         * @param {number} centerX X.
         * @param {number} centerY Y.
         * @param {number} width Width.
         * @param {number} height Height.
         * @param {number} anchorX Anchor X.
         * @param {number} anchorY Anchor Y.
         * @param {number} originX Origin X.
         * @param {number} originY Origin Y.
         * @param {number} rotation Rotation.
         * @param {import("../../size.js").Size} scale Scale.
         * @param {boolean} snapToPixel Snap to pixel.
         * @param {Array<number>} padding Padding.
         * @param {boolean} fillStroke Background fill or stroke.
         * @param {import("../../Feature.js").FeatureLike} feature Feature.
         * @return {ImageOrLabelDimensions} Dimensions for positioning and decluttering the image or label.
         */
        Executor.prototype.calculateImageOrLabelDimensions_ = function (sheetWidth, sheetHeight, centerX, centerY, width, height, anchorX, anchorY, originX, originY, rotation, scale, snapToPixel, padding, fillStroke, feature) {
            anchorX *= scale[0];
            anchorY *= scale[1];
            var x = centerX - anchorX;
            var y = centerY - anchorY;
            var w = width + originX > sheetWidth ? sheetWidth - originX : width;
            var h = height + originY > sheetHeight ? sheetHeight - originY : height;
            var boxW = padding[3] + w * scale[0] + padding[1];
            var boxH = padding[0] + h * scale[1] + padding[2];
            var boxX = x - padding[3];
            var boxY = y - padding[0];
            if (fillStroke || rotation !== 0) {
                p1[0] = boxX;
                p4[0] = boxX;
                p1[1] = boxY;
                p2[1] = boxY;
                p2[0] = boxX + boxW;
                p3[0] = p2[0];
                p3[1] = boxY + boxH;
                p4[1] = p3[1];
            }
            var transform;
            if (rotation !== 0) {
                transform = compose(create(), centerX, centerY, 1, 1, rotation, -centerX, -centerY);
                apply(transform, p1);
                apply(transform, p2);
                apply(transform, p3);
                apply(transform, p4);
                createOrUpdate(Math.min(p1[0], p2[0], p3[0], p4[0]), Math.min(p1[1], p2[1], p3[1], p4[1]), Math.max(p1[0], p2[0], p3[0], p4[0]), Math.max(p1[1], p2[1], p3[1], p4[1]), tmpExtent);
            }
            else {
                createOrUpdate(Math.min(boxX, boxX + boxW), Math.min(boxY, boxY + boxH), Math.max(boxX, boxX + boxW), Math.max(boxY, boxY + boxH), tmpExtent);
            }
            if (snapToPixel) {
                x = Math.round(x);
                y = Math.round(y);
            }
            return {
                drawImageX: x,
                drawImageY: y,
                drawImageW: w,
                drawImageH: h,
                originX: originX,
                originY: originY,
                declutterBox: {
                    minX: tmpExtent[0],
                    minY: tmpExtent[1],
                    maxX: tmpExtent[2],
                    maxY: tmpExtent[3],
                    value: feature,
                },
                canvasTransform: transform,
                scale: scale,
            };
        };
        /**
         * @private
         * @param {CanvasRenderingContext2D} context Context.
         * @param {number} contextScale Scale of the context.
         * @param {import("../canvas.js").Label|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement} imageOrLabel Image.
         * @param {ImageOrLabelDimensions} dimensions Dimensions.
         * @param {number} opacity Opacity.
         * @param {Array<*>} fillInstruction Fill instruction.
         * @param {Array<*>} strokeInstruction Stroke instruction.
         * @return {boolean} The image or label was rendered.
         */
        Executor.prototype.replayImageOrLabel_ = function (context, contextScale, imageOrLabel, dimensions, opacity, fillInstruction, strokeInstruction) {
            var fillStroke = !!(fillInstruction || strokeInstruction);
            var box = dimensions.declutterBox;
            var canvas = context.canvas;
            var strokePadding = strokeInstruction
                ? (strokeInstruction[2] * dimensions.scale[0]) / 2
                : 0;
            var intersects = box.minX - strokePadding <= canvas.width / contextScale &&
                box.maxX + strokePadding >= 0 &&
                box.minY - strokePadding <= canvas.height / contextScale &&
                box.maxY + strokePadding >= 0;
            if (intersects) {
                if (fillStroke) {
                    this.replayTextBackground_(context, p1, p2, p3, p4, 
                    /** @type {Array<*>} */ (fillInstruction), 
                    /** @type {Array<*>} */ (strokeInstruction));
                }
                drawImageOrLabel(context, dimensions.canvasTransform, opacity, imageOrLabel, dimensions.originX, dimensions.originY, dimensions.drawImageW, dimensions.drawImageH, dimensions.drawImageX, dimensions.drawImageY, dimensions.scale);
            }
            return true;
        };
        /**
         * @private
         * @param {CanvasRenderingContext2D} context Context.
         */
        Executor.prototype.fill_ = function (context) {
            if (this.alignFill_) {
                var origin_1 = apply(this.renderedTransform_, [0, 0]);
                var repeatSize = 512 * this.pixelRatio;
                context.save();
                context.translate(origin_1[0] % repeatSize, origin_1[1] % repeatSize);
                context.rotate(this.viewRotation_);
            }
            context.fill();
            if (this.alignFill_) {
                context.restore();
            }
        };
        /**
         * @private
         * @param {CanvasRenderingContext2D} context Context.
         * @param {Array<*>} instruction Instruction.
         */
        Executor.prototype.setStrokeStyle_ = function (context, instruction) {
            context['strokeStyle'] =
                /** @type {import("../../colorlike.js").ColorLike} */ (instruction[1]);
            context.lineWidth = /** @type {number} */ (instruction[2]);
            context.lineCap = /** @type {CanvasLineCap} */ (instruction[3]);
            context.lineJoin = /** @type {CanvasLineJoin} */ (instruction[4]);
            context.miterLimit = /** @type {number} */ (instruction[5]);
            if (context.setLineDash) {
                context.lineDashOffset = /** @type {number} */ (instruction[7]);
                context.setLineDash(/** @type {Array<number>} */ (instruction[6]));
            }
        };
        /**
         * @private
         * @param {string|Array<string>} text The text to draw.
         * @param {string} textKey The key of the text state.
         * @param {string} strokeKey The key for the stroke state.
         * @param {string} fillKey The key for the fill state.
         * @return {{label: import("../canvas.js").Label, anchorX: number, anchorY: number}} The text image and its anchor.
         */
        Executor.prototype.drawLabelWithPointPlacement_ = function (text, textKey, strokeKey, fillKey) {
            var textState = this.textStates[textKey];
            var label = this.createLabel(text, textKey, fillKey, strokeKey);
            var strokeState = this.strokeStates[strokeKey];
            var pixelRatio = this.pixelRatio;
            var align = horizontalTextAlign(Array.isArray(text) ? text[0] : text, textState.textAlign || defaultTextAlign);
            var baseline = TEXT_ALIGN[textState.textBaseline || defaultTextBaseline];
            var strokeWidth = strokeState && strokeState.lineWidth ? strokeState.lineWidth : 0;
            // Remove the 2 pixels we added in createLabel() for the anchor
            var width = label.width / pixelRatio - 2 * textState.scale[0];
            var anchorX = align * width + 2 * (0.5 - align) * strokeWidth;
            var anchorY = (baseline * label.height) / pixelRatio +
                2 * (0.5 - baseline) * strokeWidth;
            return {
                label: label,
                anchorX: anchorX,
                anchorY: anchorY,
            };
        };
        /**
         * @private
         * @param {CanvasRenderingContext2D} context Context.
         * @param {number} contextScale Scale of the context.
         * @param {import("../../transform.js").Transform} transform Transform.
         * @param {Array<*>} instructions Instructions array.
         * @param {boolean} snapToPixel Snap point symbols and text to integer pixels.
         * @param {FeatureCallback<T>} [opt_featureCallback] Feature callback.
         * @param {import("../../extent.js").Extent} [opt_hitExtent] Only check
         *     features that intersect this extent.
         * @param {import("rbush").default} [opt_declutterTree] Declutter tree.
         * @return {T|undefined} Callback result.
         * @template T
         */
        Executor.prototype.execute_ = function (context, contextScale, transform, instructions, snapToPixel, opt_featureCallback, opt_hitExtent, opt_declutterTree) {
            /** @type {Array<number>} */
            var pixelCoordinates;
            if (this.pixelCoordinates_ && equals$1(transform, this.renderedTransform_)) {
                pixelCoordinates = this.pixelCoordinates_;
            }
            else {
                if (!this.pixelCoordinates_) {
                    this.pixelCoordinates_ = [];
                }
                pixelCoordinates = transform2D(this.coordinates, 0, this.coordinates.length, 2, transform, this.pixelCoordinates_);
                setFromArray(this.renderedTransform_, transform);
            }
            var i = 0; // instruction index
            var ii = instructions.length; // end of instructions
            var d = 0; // data index
            var dd; // end of per-instruction data
            var anchorX, anchorY, prevX, prevY, roundX, roundY, image, text, textKey, strokeKey, fillKey;
            var pendingFill = 0;
            var pendingStroke = 0;
            var lastFillInstruction = null;
            var lastStrokeInstruction = null;
            var coordinateCache = this.coordinateCache_;
            var viewRotation = this.viewRotation_;
            var viewRotationFromTransform = Math.round(Math.atan2(-transform[1], transform[0]) * 1e12) / 1e12;
            var state = /** @type {import("../../render.js").State} */ ({
                context: context,
                pixelRatio: this.pixelRatio,
                resolution: this.resolution,
                rotation: viewRotation,
            });
            // When the batch size gets too big, performance decreases. 200 is a good
            // balance between batch size and number of fill/stroke instructions.
            var batchSize = this.instructions != instructions || this.overlaps ? 0 : 200;
            var /** @type {import("../../Feature.js").FeatureLike} */ feature;
            var x, y, currentGeometry;
            while (i < ii) {
                var instruction = instructions[i];
                var type = /** @type {import("./Instruction.js").default} */ (instruction[0]);
                switch (type) {
                    case CanvasInstruction.BEGIN_GEOMETRY:
                        feature = /** @type {import("../../Feature.js").FeatureLike} */ (instruction[1]);
                        currentGeometry = instruction[3];
                        if (!feature.getGeometry()) {
                            i = /** @type {number} */ (instruction[2]);
                        }
                        else if (opt_hitExtent !== undefined &&
                            !intersects$1(opt_hitExtent, currentGeometry.getExtent())) {
                            i = /** @type {number} */ (instruction[2]) + 1;
                        }
                        else {
                            ++i;
                        }
                        break;
                    case CanvasInstruction.BEGIN_PATH:
                        if (pendingFill > batchSize) {
                            this.fill_(context);
                            pendingFill = 0;
                        }
                        if (pendingStroke > batchSize) {
                            context.stroke();
                            pendingStroke = 0;
                        }
                        if (!pendingFill && !pendingStroke) {
                            context.beginPath();
                            prevX = NaN;
                            prevY = NaN;
                        }
                        ++i;
                        break;
                    case CanvasInstruction.CIRCLE:
                        d = /** @type {number} */ (instruction[1]);
                        var x1 = pixelCoordinates[d];
                        var y1 = pixelCoordinates[d + 1];
                        var x2 = pixelCoordinates[d + 2];
                        var y2 = pixelCoordinates[d + 3];
                        var dx = x2 - x1;
                        var dy = y2 - y1;
                        var r = Math.sqrt(dx * dx + dy * dy);
                        context.moveTo(x1 + r, y1);
                        context.arc(x1, y1, r, 0, 2 * Math.PI, true);
                        ++i;
                        break;
                    case CanvasInstruction.CLOSE_PATH:
                        context.closePath();
                        ++i;
                        break;
                    case CanvasInstruction.CUSTOM:
                        d = /** @type {number} */ (instruction[1]);
                        dd = instruction[2];
                        var geometry = 
                        /** @type {import("../../geom/SimpleGeometry.js").default} */ (instruction[3]);
                        var renderer = instruction[4];
                        var fn = instruction.length == 6 ? instruction[5] : undefined;
                        state.geometry = geometry;
                        state.feature = feature;
                        if (!(i in coordinateCache)) {
                            coordinateCache[i] = [];
                        }
                        var coords = coordinateCache[i];
                        if (fn) {
                            fn(pixelCoordinates, d, dd, 2, coords);
                        }
                        else {
                            coords[0] = pixelCoordinates[d];
                            coords[1] = pixelCoordinates[d + 1];
                            coords.length = 2;
                        }
                        renderer(coords, state);
                        ++i;
                        break;
                    case CanvasInstruction.DRAW_IMAGE:
                        d = /** @type {number} */ (instruction[1]);
                        dd = /** @type {number} */ (instruction[2]);
                        image =
                            /** @type {HTMLCanvasElement|HTMLVideoElement|HTMLImageElement} */ (instruction[3]);
                        // Remaining arguments in DRAW_IMAGE are in alphabetical order
                        anchorX = /** @type {number} */ (instruction[4]);
                        anchorY = /** @type {number} */ (instruction[5]);
                        var height = /** @type {number} */ (instruction[6]);
                        var opacity = /** @type {number} */ (instruction[7]);
                        var originX = /** @type {number} */ (instruction[8]);
                        var originY = /** @type {number} */ (instruction[9]);
                        var rotateWithView = /** @type {boolean} */ (instruction[10]);
                        var rotation = /** @type {number} */ (instruction[11]);
                        var scale = /** @type {import("../../size.js").Size} */ (instruction[12]);
                        var width = /** @type {number} */ (instruction[13]);
                        var declutterMode = 
                        /** @type {"declutter"|"obstacle"|"none"|undefined} */ (instruction[14]);
                        var declutterImageWithText = 
                        /** @type {import("../canvas.js").DeclutterImageWithText} */ (instruction[15]);
                        if (!image && instruction.length >= 20) {
                            // create label images
                            text = /** @type {string} */ (instruction[19]);
                            textKey = /** @type {string} */ (instruction[20]);
                            strokeKey = /** @type {string} */ (instruction[21]);
                            fillKey = /** @type {string} */ (instruction[22]);
                            var labelWithAnchor = this.drawLabelWithPointPlacement_(text, textKey, strokeKey, fillKey);
                            image = labelWithAnchor.label;
                            instruction[3] = image;
                            var textOffsetX = /** @type {number} */ (instruction[23]);
                            anchorX = (labelWithAnchor.anchorX - textOffsetX) * this.pixelRatio;
                            instruction[4] = anchorX;
                            var textOffsetY = /** @type {number} */ (instruction[24]);
                            anchorY = (labelWithAnchor.anchorY - textOffsetY) * this.pixelRatio;
                            instruction[5] = anchorY;
                            height = image.height;
                            instruction[6] = height;
                            width = image.width;
                            instruction[13] = width;
                        }
                        var geometryWidths = void 0;
                        if (instruction.length > 25) {
                            geometryWidths = /** @type {number} */ (instruction[25]);
                        }
                        var padding = void 0, backgroundFill = void 0, backgroundStroke = void 0;
                        if (instruction.length > 17) {
                            padding = /** @type {Array<number>} */ (instruction[16]);
                            backgroundFill = /** @type {boolean} */ (instruction[17]);
                            backgroundStroke = /** @type {boolean} */ (instruction[18]);
                        }
                        else {
                            padding = defaultPadding;
                            backgroundFill = false;
                            backgroundStroke = false;
                        }
                        if (rotateWithView && viewRotationFromTransform) {
                            // Canvas is expected to be rotated to reverse view rotation.
                            rotation += viewRotation;
                        }
                        else if (!rotateWithView && !viewRotationFromTransform) {
                            // Canvas is not rotated, images need to be rotated back to be north-up.
                            rotation -= viewRotation;
                        }
                        var widthIndex = 0;
                        for (; d < dd; d += 2) {
                            if (geometryWidths &&
                                geometryWidths[widthIndex++] < width / this.pixelRatio) {
                                continue;
                            }
                            var dimensions = this.calculateImageOrLabelDimensions_(image.width, image.height, pixelCoordinates[d], pixelCoordinates[d + 1], width, height, anchorX, anchorY, originX, originY, rotation, scale, snapToPixel, padding, backgroundFill || backgroundStroke, feature);
                            /** @type {ReplayImageOrLabelArgs} */
                            var args = [
                                context,
                                contextScale,
                                image,
                                dimensions,
                                opacity,
                                backgroundFill
                                    ? /** @type {Array<*>} */ (lastFillInstruction)
                                    : null,
                                backgroundStroke
                                    ? /** @type {Array<*>} */ (lastStrokeInstruction)
                                    : null,
                            ];
                            if (opt_declutterTree) {
                                if (declutterMode === 'none') {
                                    // not rendered in declutter group
                                    continue;
                                }
                                else if (declutterMode === 'obstacle') {
                                    // will always be drawn, thus no collision detection, but insert as obstacle
                                    opt_declutterTree.insert(dimensions.declutterBox);
                                    continue;
                                }
                                else {
                                    var imageArgs = void 0;
                                    var imageDeclutterBox = void 0;
                                    if (declutterImageWithText) {
                                        var index = dd - d;
                                        if (!declutterImageWithText[index]) {
                                            // We now have the image for an image+text combination.
                                            declutterImageWithText[index] = args;
                                            // Don't render anything for now, wait for the text.
                                            continue;
                                        }
                                        imageArgs = declutterImageWithText[index];
                                        delete declutterImageWithText[index];
                                        imageDeclutterBox = getDeclutterBox(imageArgs);
                                        if (opt_declutterTree.collides(imageDeclutterBox)) {
                                            continue;
                                        }
                                    }
                                    if (opt_declutterTree.collides(dimensions.declutterBox)) {
                                        continue;
                                    }
                                    if (imageArgs) {
                                        // We now have image and text for an image+text combination.
                                        opt_declutterTree.insert(imageDeclutterBox);
                                        // Render the image before we render the text.
                                        this.replayImageOrLabel_.apply(this, imageArgs);
                                    }
                                    opt_declutterTree.insert(dimensions.declutterBox);
                                }
                            }
                            this.replayImageOrLabel_.apply(this, args);
                        }
                        ++i;
                        break;
                    case CanvasInstruction.DRAW_CHARS:
                        var begin = /** @type {number} */ (instruction[1]);
                        var end = /** @type {number} */ (instruction[2]);
                        var baseline = /** @type {number} */ (instruction[3]);
                        var overflow = /** @type {number} */ (instruction[4]);
                        fillKey = /** @type {string} */ (instruction[5]);
                        var maxAngle = /** @type {number} */ (instruction[6]);
                        var measurePixelRatio = /** @type {number} */ (instruction[7]);
                        var offsetY = /** @type {number} */ (instruction[8]);
                        strokeKey = /** @type {string} */ (instruction[9]);
                        var strokeWidth = /** @type {number} */ (instruction[10]);
                        text = /** @type {string} */ (instruction[11]);
                        textKey = /** @type {string} */ (instruction[12]);
                        var pixelRatioScale = [
                            /** @type {number} */ (instruction[13]),
                            /** @type {number} */ (instruction[13]),
                        ];
                        var textState = this.textStates[textKey];
                        var font = textState.font;
                        var textScale = [
                            textState.scale[0] * measurePixelRatio,
                            textState.scale[1] * measurePixelRatio,
                        ];
                        var cachedWidths = void 0;
                        if (font in this.widths_) {
                            cachedWidths = this.widths_[font];
                        }
                        else {
                            cachedWidths = {};
                            this.widths_[font] = cachedWidths;
                        }
                        var pathLength = lineStringLength(pixelCoordinates, begin, end, 2);
                        var textLength = Math.abs(textScale[0]) *
                            measureAndCacheTextWidth(font, text, cachedWidths);
                        if (overflow || textLength <= pathLength) {
                            var textAlign = this.textStates[textKey].textAlign;
                            var startM = (pathLength - textLength) * TEXT_ALIGN[textAlign];
                            var parts = drawTextOnPath(pixelCoordinates, begin, end, 2, text, startM, maxAngle, Math.abs(textScale[0]), measureAndCacheTextWidth, font, cachedWidths, viewRotationFromTransform ? 0 : this.viewRotation_);
                            drawChars: if (parts) {
                                /** @type {Array<ReplayImageOrLabelArgs>} */
                                var replayImageOrLabelArgs = [];
                                var c = void 0, cc = void 0, chars = void 0, label = void 0, part = void 0;
                                if (strokeKey) {
                                    for (c = 0, cc = parts.length; c < cc; ++c) {
                                        part = parts[c]; // x, y, anchorX, rotation, chunk
                                        chars = /** @type {string} */ (part[4]);
                                        label = this.createLabel(chars, textKey, '', strokeKey);
                                        anchorX =
                                            /** @type {number} */ (part[2]) +
                                                (textScale[0] < 0 ? -strokeWidth : strokeWidth);
                                        anchorY =
                                            baseline * label.height +
                                                ((0.5 - baseline) * 2 * strokeWidth * textScale[1]) /
                                                    textScale[0] -
                                                offsetY;
                                        var dimensions = this.calculateImageOrLabelDimensions_(label.width, label.height, part[0], part[1], label.width, label.height, anchorX, anchorY, 0, 0, part[3], pixelRatioScale, false, defaultPadding, false, feature);
                                        if (opt_declutterTree &&
                                            opt_declutterTree.collides(dimensions.declutterBox)) {
                                            break drawChars;
                                        }
                                        replayImageOrLabelArgs.push([
                                            context,
                                            contextScale,
                                            label,
                                            dimensions,
                                            1,
                                            null,
                                            null,
                                        ]);
                                    }
                                }
                                if (fillKey) {
                                    for (c = 0, cc = parts.length; c < cc; ++c) {
                                        part = parts[c]; // x, y, anchorX, rotation, chunk
                                        chars = /** @type {string} */ (part[4]);
                                        label = this.createLabel(chars, textKey, fillKey, '');
                                        anchorX = /** @type {number} */ (part[2]);
                                        anchorY = baseline * label.height - offsetY;
                                        var dimensions = this.calculateImageOrLabelDimensions_(label.width, label.height, part[0], part[1], label.width, label.height, anchorX, anchorY, 0, 0, part[3], pixelRatioScale, false, defaultPadding, false, feature);
                                        if (opt_declutterTree &&
                                            opt_declutterTree.collides(dimensions.declutterBox)) {
                                            break drawChars;
                                        }
                                        replayImageOrLabelArgs.push([
                                            context,
                                            contextScale,
                                            label,
                                            dimensions,
                                            1,
                                            null,
                                            null,
                                        ]);
                                    }
                                }
                                if (opt_declutterTree) {
                                    opt_declutterTree.load(replayImageOrLabelArgs.map(getDeclutterBox));
                                }
                                for (var i_1 = 0, ii_1 = replayImageOrLabelArgs.length; i_1 < ii_1; ++i_1) {
                                    this.replayImageOrLabel_.apply(this, replayImageOrLabelArgs[i_1]);
                                }
                            }
                        }
                        ++i;
                        break;
                    case CanvasInstruction.END_GEOMETRY:
                        if (opt_featureCallback !== undefined) {
                            feature = /** @type {import("../../Feature.js").FeatureLike} */ (instruction[1]);
                            var result = opt_featureCallback(feature, currentGeometry);
                            if (result) {
                                return result;
                            }
                        }
                        ++i;
                        break;
                    case CanvasInstruction.FILL:
                        if (batchSize) {
                            pendingFill++;
                        }
                        else {
                            this.fill_(context);
                        }
                        ++i;
                        break;
                    case CanvasInstruction.MOVE_TO_LINE_TO:
                        d = /** @type {number} */ (instruction[1]);
                        dd = /** @type {number} */ (instruction[2]);
                        x = pixelCoordinates[d];
                        y = pixelCoordinates[d + 1];
                        roundX = (x + 0.5) | 0;
                        roundY = (y + 0.5) | 0;
                        if (roundX !== prevX || roundY !== prevY) {
                            context.moveTo(x, y);
                            prevX = roundX;
                            prevY = roundY;
                        }
                        for (d += 2; d < dd; d += 2) {
                            x = pixelCoordinates[d];
                            y = pixelCoordinates[d + 1];
                            roundX = (x + 0.5) | 0;
                            roundY = (y + 0.5) | 0;
                            if (d == dd - 2 || roundX !== prevX || roundY !== prevY) {
                                context.lineTo(x, y);
                                prevX = roundX;
                                prevY = roundY;
                            }
                        }
                        ++i;
                        break;
                    case CanvasInstruction.SET_FILL_STYLE:
                        lastFillInstruction = instruction;
                        this.alignFill_ = instruction[2];
                        if (pendingFill) {
                            this.fill_(context);
                            pendingFill = 0;
                            if (pendingStroke) {
                                context.stroke();
                                pendingStroke = 0;
                            }
                        }
                        context.fillStyle =
                            /** @type {import("../../colorlike.js").ColorLike} */ (instruction[1]);
                        ++i;
                        break;
                    case CanvasInstruction.SET_STROKE_STYLE:
                        lastStrokeInstruction = instruction;
                        if (pendingStroke) {
                            context.stroke();
                            pendingStroke = 0;
                        }
                        this.setStrokeStyle_(context, /** @type {Array<*>} */ (instruction));
                        ++i;
                        break;
                    case CanvasInstruction.STROKE:
                        if (batchSize) {
                            pendingStroke++;
                        }
                        else {
                            context.stroke();
                        }
                        ++i;
                        break;
                    default: // consume the instruction anyway, to avoid an infinite loop
                        ++i;
                        break;
                }
            }
            if (pendingFill) {
                this.fill_(context);
            }
            if (pendingStroke) {
                context.stroke();
            }
            return undefined;
        };
        /**
         * @param {CanvasRenderingContext2D} context Context.
         * @param {number} contextScale Scale of the context.
         * @param {import("../../transform.js").Transform} transform Transform.
         * @param {number} viewRotation View rotation.
         * @param {boolean} snapToPixel Snap point symbols and text to integer pixels.
         * @param {import("rbush").default} [opt_declutterTree] Declutter tree.
         */
        Executor.prototype.execute = function (context, contextScale, transform, viewRotation, snapToPixel, opt_declutterTree) {
            this.viewRotation_ = viewRotation;
            this.execute_(context, contextScale, transform, this.instructions, snapToPixel, undefined, undefined, opt_declutterTree);
        };
        /**
         * @param {CanvasRenderingContext2D} context Context.
         * @param {import("../../transform.js").Transform} transform Transform.
         * @param {number} viewRotation View rotation.
         * @param {FeatureCallback<T>} [opt_featureCallback] Feature callback.
         * @param {import("../../extent.js").Extent} [opt_hitExtent] Only check
         *     features that intersect this extent.
         * @return {T|undefined} Callback result.
         * @template T
         */
        Executor.prototype.executeHitDetection = function (context, transform, viewRotation, opt_featureCallback, opt_hitExtent) {
            this.viewRotation_ = viewRotation;
            return this.execute_(context, 1, transform, this.hitDetectionInstructions, true, opt_featureCallback, opt_hitExtent);
        };
        return Executor;
    }());
    var Executor$1 = Executor;

    /**
     * @module ol/render/canvas/ExecutorGroup
     */
    /**
     * @const
     * @type {Array<import("../canvas.js").BuilderType>}
     */
    var ORDER = ['Polygon', 'Circle', 'LineString', 'Image', 'Text', 'Default'];
    var ExecutorGroup = /** @class */ (function () {
        /**
         * @param {import("../../extent.js").Extent} maxExtent Max extent for clipping. When a
         * `maxExtent` was set on the Builder for this executor group, the same `maxExtent`
         * should be set here, unless the target context does not exceed that extent (which
         * can be the case when rendering to tiles).
         * @param {number} resolution Resolution.
         * @param {number} pixelRatio Pixel ratio.
         * @param {boolean} overlaps The executor group can have overlapping geometries.
         * @param {!Object<string, !Object<import("../canvas.js").BuilderType, import("../canvas.js").SerializableInstructions>>} allInstructions
         * The serializable instructions.
         * @param {number} [opt_renderBuffer] Optional rendering buffer.
         */
        function ExecutorGroup(maxExtent, resolution, pixelRatio, overlaps, allInstructions, opt_renderBuffer) {
            /**
             * @private
             * @type {import("../../extent.js").Extent}
             */
            this.maxExtent_ = maxExtent;
            /**
             * @private
             * @type {boolean}
             */
            this.overlaps_ = overlaps;
            /**
             * @private
             * @type {number}
             */
            this.pixelRatio_ = pixelRatio;
            /**
             * @private
             * @type {number}
             */
            this.resolution_ = resolution;
            /**
             * @private
             * @type {number|undefined}
             */
            this.renderBuffer_ = opt_renderBuffer;
            /**
             * @private
             * @type {!Object<string, !Object<import("../canvas.js").BuilderType, import("./Executor").default>>}
             */
            this.executorsByZIndex_ = {};
            /**
             * @private
             * @type {CanvasRenderingContext2D}
             */
            this.hitDetectionContext_ = null;
            /**
             * @private
             * @type {import("../../transform.js").Transform}
             */
            this.hitDetectionTransform_ = create();
            this.createExecutors_(allInstructions);
        }
        /**
         * @param {CanvasRenderingContext2D} context Context.
         * @param {import("../../transform.js").Transform} transform Transform.
         */
        ExecutorGroup.prototype.clip = function (context, transform) {
            var flatClipCoords = this.getClipCoords(transform);
            context.beginPath();
            context.moveTo(flatClipCoords[0], flatClipCoords[1]);
            context.lineTo(flatClipCoords[2], flatClipCoords[3]);
            context.lineTo(flatClipCoords[4], flatClipCoords[5]);
            context.lineTo(flatClipCoords[6], flatClipCoords[7]);
            context.clip();
        };
        /**
         * Create executors and populate them using the provided instructions.
         * @private
         * @param {!Object<string, !Object<import("../canvas.js").BuilderType, import("../canvas.js").SerializableInstructions>>} allInstructions The serializable instructions
         */
        ExecutorGroup.prototype.createExecutors_ = function (allInstructions) {
            for (var zIndex in allInstructions) {
                var executors = this.executorsByZIndex_[zIndex];
                if (executors === undefined) {
                    executors = {};
                    this.executorsByZIndex_[zIndex] = executors;
                }
                var instructionByZindex = allInstructions[zIndex];
                for (var builderType in instructionByZindex) {
                    var instructions = instructionByZindex[builderType];
                    executors[builderType] = new Executor$1(this.resolution_, this.pixelRatio_, this.overlaps_, instructions);
                }
            }
        };
        /**
         * @param {Array<import("../canvas.js").BuilderType>} executors Executors.
         * @return {boolean} Has executors of the provided types.
         */
        ExecutorGroup.prototype.hasExecutors = function (executors) {
            for (var zIndex in this.executorsByZIndex_) {
                var candidates = this.executorsByZIndex_[zIndex];
                for (var i = 0, ii = executors.length; i < ii; ++i) {
                    if (executors[i] in candidates) {
                        return true;
                    }
                }
            }
            return false;
        };
        /**
         * @param {import("../../coordinate.js").Coordinate} coordinate Coordinate.
         * @param {number} resolution Resolution.
         * @param {number} rotation Rotation.
         * @param {number} hitTolerance Hit tolerance in pixels.
         * @param {function(import("../../Feature.js").FeatureLike, import("../../geom/SimpleGeometry.js").default, number): T} callback Feature callback.
         * @param {Array<import("../../Feature.js").FeatureLike>} declutteredFeatures Decluttered features.
         * @return {T|undefined} Callback result.
         * @template T
         */
        ExecutorGroup.prototype.forEachFeatureAtCoordinate = function (coordinate, resolution, rotation, hitTolerance, callback, declutteredFeatures) {
            hitTolerance = Math.round(hitTolerance);
            var contextSize = hitTolerance * 2 + 1;
            var transform = compose(this.hitDetectionTransform_, hitTolerance + 0.5, hitTolerance + 0.5, 1 / resolution, -1 / resolution, -rotation, -coordinate[0], -coordinate[1]);
            var newContext = !this.hitDetectionContext_;
            if (newContext) {
                this.hitDetectionContext_ = createCanvasContext2D(contextSize, contextSize);
            }
            var context = this.hitDetectionContext_;
            if (context.canvas.width !== contextSize ||
                context.canvas.height !== contextSize) {
                context.canvas.width = contextSize;
                context.canvas.height = contextSize;
            }
            else if (!newContext) {
                context.clearRect(0, 0, contextSize, contextSize);
            }
            /**
             * @type {import("../../extent.js").Extent}
             */
            var hitExtent;
            if (this.renderBuffer_ !== undefined) {
                hitExtent = createEmpty();
                extendCoordinate(hitExtent, coordinate);
                buffer(hitExtent, resolution * (this.renderBuffer_ + hitTolerance), hitExtent);
            }
            var indexes = getPixelIndexArray(hitTolerance);
            var builderType;
            /**
             * @param {import("../../Feature.js").FeatureLike} feature Feature.
             * @param {import("../../geom/SimpleGeometry.js").default} geometry Geometry.
             * @return {T|undefined} Callback result.
             */
            function featureCallback(feature, geometry) {
                var imageData = context.getImageData(0, 0, contextSize, contextSize).data;
                for (var i_1 = 0, ii = indexes.length; i_1 < ii; i_1++) {
                    if (imageData[indexes[i_1]] > 0) {
                        if (!declutteredFeatures ||
                            (builderType !== 'Image' && builderType !== 'Text') ||
                            declutteredFeatures.indexOf(feature) !== -1) {
                            var idx = (indexes[i_1] - 3) / 4;
                            var x = hitTolerance - (idx % contextSize);
                            var y = hitTolerance - ((idx / contextSize) | 0);
                            var result_1 = callback(feature, geometry, x * x + y * y);
                            if (result_1) {
                                return result_1;
                            }
                        }
                        context.clearRect(0, 0, contextSize, contextSize);
                        break;
                    }
                }
                return undefined;
            }
            /** @type {Array<number>} */
            var zs = Object.keys(this.executorsByZIndex_).map(Number);
            zs.sort(numberSafeCompareFunction);
            var i, j, executors, executor, result;
            for (i = zs.length - 1; i >= 0; --i) {
                var zIndexKey = zs[i].toString();
                executors = this.executorsByZIndex_[zIndexKey];
                for (j = ORDER.length - 1; j >= 0; --j) {
                    builderType = ORDER[j];
                    executor = executors[builderType];
                    if (executor !== undefined) {
                        result = executor.executeHitDetection(context, transform, rotation, featureCallback, hitExtent);
                        if (result) {
                            return result;
                        }
                    }
                }
            }
            return undefined;
        };
        /**
         * @param {import("../../transform.js").Transform} transform Transform.
         * @return {Array<number>|null} Clip coordinates.
         */
        ExecutorGroup.prototype.getClipCoords = function (transform) {
            var maxExtent = this.maxExtent_;
            if (!maxExtent) {
                return null;
            }
            var minX = maxExtent[0];
            var minY = maxExtent[1];
            var maxX = maxExtent[2];
            var maxY = maxExtent[3];
            var flatClipCoords = [minX, minY, minX, maxY, maxX, maxY, maxX, minY];
            transform2D(flatClipCoords, 0, 8, 2, transform, flatClipCoords);
            return flatClipCoords;
        };
        /**
         * @return {boolean} Is empty.
         */
        ExecutorGroup.prototype.isEmpty = function () {
            return isEmpty(this.executorsByZIndex_);
        };
        /**
         * @param {CanvasRenderingContext2D} context Context.
         * @param {number} contextScale Scale of the context.
         * @param {import("../../transform.js").Transform} transform Transform.
         * @param {number} viewRotation View rotation.
         * @param {boolean} snapToPixel Snap point symbols and test to integer pixel.
         * @param {Array<import("../canvas.js").BuilderType>} [opt_builderTypes] Ordered replay types to replay.
         *     Default is {@link module:ol/render/replay~ORDER}
         * @param {import("rbush").default} [opt_declutterTree] Declutter tree.
         */
        ExecutorGroup.prototype.execute = function (context, contextScale, transform, viewRotation, snapToPixel, opt_builderTypes, opt_declutterTree) {
            /** @type {Array<number>} */
            var zs = Object.keys(this.executorsByZIndex_).map(Number);
            zs.sort(numberSafeCompareFunction);
            // setup clipping so that the parts of over-simplified geometries are not
            // visible outside the current extent when panning
            if (this.maxExtent_) {
                context.save();
                this.clip(context, transform);
            }
            var builderTypes = opt_builderTypes ? opt_builderTypes : ORDER;
            var i, ii, j, jj, replays, replay;
            if (opt_declutterTree) {
                zs.reverse();
            }
            for (i = 0, ii = zs.length; i < ii; ++i) {
                var zIndexKey = zs[i].toString();
                replays = this.executorsByZIndex_[zIndexKey];
                for (j = 0, jj = builderTypes.length; j < jj; ++j) {
                    var builderType = builderTypes[j];
                    replay = replays[builderType];
                    if (replay !== undefined) {
                        replay.execute(context, contextScale, transform, viewRotation, snapToPixel, opt_declutterTree);
                    }
                }
            }
            if (this.maxExtent_) {
                context.restore();
            }
        };
        return ExecutorGroup;
    }());
    /**
     * This cache is used to store arrays of indexes for calculated pixel circles
     * to increase performance.
     * It is a static property to allow each Replaygroup to access it.
     * @type {Object<number, Array<number>>}
     */
    var circlePixelIndexArrayCache = {};
    /**
     * This methods creates an array with indexes of all pixels within a circle,
     * ordered by how close they are to the center.
     * A cache is used to increase performance.
     * @param {number} radius Radius.
     * @return {Array<number>} An array with indexes within a circle.
     */
    function getPixelIndexArray(radius) {
        if (circlePixelIndexArrayCache[radius] !== undefined) {
            return circlePixelIndexArrayCache[radius];
        }
        var size = radius * 2 + 1;
        var maxDistanceSq = radius * radius;
        var distances = new Array(maxDistanceSq + 1);
        for (var i = 0; i <= radius; ++i) {
            for (var j = 0; j <= radius; ++j) {
                var distanceSq = i * i + j * j;
                if (distanceSq > maxDistanceSq) {
                    break;
                }
                var distance = distances[distanceSq];
                if (!distance) {
                    distance = [];
                    distances[distanceSq] = distance;
                }
                distance.push(((radius + i) * size + (radius + j)) * 4 + 3);
                if (i > 0) {
                    distance.push(((radius - i) * size + (radius + j)) * 4 + 3);
                }
                if (j > 0) {
                    distance.push(((radius + i) * size + (radius - j)) * 4 + 3);
                    if (i > 0) {
                        distance.push(((radius - i) * size + (radius - j)) * 4 + 3);
                    }
                }
            }
        }
        var pixelIndex = [];
        for (var i = 0, ii = distances.length; i < ii; ++i) {
            if (distances[i]) {
                pixelIndex.push.apply(pixelIndex, distances[i]);
            }
        }
        circlePixelIndexArrayCache[radius] = pixelIndex;
        return pixelIndex;
    }
    var ExecutorGroup$1 = ExecutorGroup;

    /**
     * @module ol/ViewHint
     */
    /**
     * @enum {number}
     */
    var ViewHint = {
        ANIMATING: 0,
        INTERACTING: 1,
    };

    /**
     * @module ol/render/canvas/Immediate
     */
    // FIXME test, especially polygons with holes and multipolygons
    // FIXME need to handle large thick features (where pixel size matters)
    // FIXME add offset and end to ol/geom/flat/transform~transform2D?
    var __extends$a = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            if (typeof b !== "function" && b !== null)
                throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * @classdesc
     * A concrete subclass of {@link module:ol/render/VectorContext~VectorContext VectorContext} that implements
     * direct rendering of features and geometries to an HTML5 Canvas context.
     * Instances of this class are created internally by the library and
     * provided to application code as vectorContext member of the
     * {@link module:ol/render/Event~RenderEvent RenderEvent} object associated with postcompose, precompose and
     * render events emitted by layers and maps.
     */
    var CanvasImmediateRenderer = /** @class */ (function (_super) {
        __extends$a(CanvasImmediateRenderer, _super);
        /**
         * @param {CanvasRenderingContext2D} context Context.
         * @param {number} pixelRatio Pixel ratio.
         * @param {import("../../extent.js").Extent} extent Extent.
         * @param {import("../../transform.js").Transform} transform Transform.
         * @param {number} viewRotation View rotation.
         * @param {number} [opt_squaredTolerance] Optional squared tolerance for simplification.
         * @param {import("../../proj.js").TransformFunction} [opt_userTransform] Transform from user to view projection.
         */
        function CanvasImmediateRenderer(context, pixelRatio, extent, transform, viewRotation, opt_squaredTolerance, opt_userTransform) {
            var _this = _super.call(this) || this;
            /**
             * @private
             * @type {CanvasRenderingContext2D}
             */
            _this.context_ = context;
            /**
             * @private
             * @type {number}
             */
            _this.pixelRatio_ = pixelRatio;
            /**
             * @private
             * @type {import("../../extent.js").Extent}
             */
            _this.extent_ = extent;
            /**
             * @private
             * @type {import("../../transform.js").Transform}
             */
            _this.transform_ = transform;
            /**
             * @private
             * @type {number}
             */
            _this.viewRotation_ = viewRotation;
            /**
             * @private
             * @type {number}
             */
            _this.squaredTolerance_ = opt_squaredTolerance;
            /**
             * @private
             * @type {import("../../proj.js").TransformFunction}
             */
            _this.userTransform_ = opt_userTransform;
            /**
             * @private
             * @type {?import("../canvas.js").FillState}
             */
            _this.contextFillState_ = null;
            /**
             * @private
             * @type {?import("../canvas.js").StrokeState}
             */
            _this.contextStrokeState_ = null;
            /**
             * @private
             * @type {?import("../canvas.js").TextState}
             */
            _this.contextTextState_ = null;
            /**
             * @private
             * @type {?import("../canvas.js").FillState}
             */
            _this.fillState_ = null;
            /**
             * @private
             * @type {?import("../canvas.js").StrokeState}
             */
            _this.strokeState_ = null;
            /**
             * @private
             * @type {HTMLCanvasElement|HTMLVideoElement|HTMLImageElement}
             */
            _this.image_ = null;
            /**
             * @private
             * @type {number}
             */
            _this.imageAnchorX_ = 0;
            /**
             * @private
             * @type {number}
             */
            _this.imageAnchorY_ = 0;
            /**
             * @private
             * @type {number}
             */
            _this.imageHeight_ = 0;
            /**
             * @private
             * @type {number}
             */
            _this.imageOpacity_ = 0;
            /**
             * @private
             * @type {number}
             */
            _this.imageOriginX_ = 0;
            /**
             * @private
             * @type {number}
             */
            _this.imageOriginY_ = 0;
            /**
             * @private
             * @type {boolean}
             */
            _this.imageRotateWithView_ = false;
            /**
             * @private
             * @type {number}
             */
            _this.imageRotation_ = 0;
            /**
             * @private
             * @type {import("../../size.js").Size}
             */
            _this.imageScale_ = [0, 0];
            /**
             * @private
             * @type {number}
             */
            _this.imageWidth_ = 0;
            /**
             * @private
             * @type {string}
             */
            _this.text_ = '';
            /**
             * @private
             * @type {number}
             */
            _this.textOffsetX_ = 0;
            /**
             * @private
             * @type {number}
             */
            _this.textOffsetY_ = 0;
            /**
             * @private
             * @type {boolean}
             */
            _this.textRotateWithView_ = false;
            /**
             * @private
             * @type {number}
             */
            _this.textRotation_ = 0;
            /**
             * @private
             * @type {import("../../size.js").Size}
             */
            _this.textScale_ = [0, 0];
            /**
             * @private
             * @type {?import("../canvas.js").FillState}
             */
            _this.textFillState_ = null;
            /**
             * @private
             * @type {?import("../canvas.js").StrokeState}
             */
            _this.textStrokeState_ = null;
            /**
             * @private
             * @type {?import("../canvas.js").TextState}
             */
            _this.textState_ = null;
            /**
             * @private
             * @type {Array<number>}
             */
            _this.pixelCoordinates_ = [];
            /**
             * @private
             * @type {import("../../transform.js").Transform}
             */
            _this.tmpLocalTransform_ = create();
            return _this;
        }
        /**
         * @param {Array<number>} flatCoordinates Flat coordinates.
         * @param {number} offset Offset.
         * @param {number} end End.
         * @param {number} stride Stride.
         * @private
         */
        CanvasImmediateRenderer.prototype.drawImages_ = function (flatCoordinates, offset, end, stride) {
            if (!this.image_) {
                return;
            }
            var pixelCoordinates = transform2D(flatCoordinates, offset, end, stride, this.transform_, this.pixelCoordinates_);
            var context = this.context_;
            var localTransform = this.tmpLocalTransform_;
            var alpha = context.globalAlpha;
            if (this.imageOpacity_ != 1) {
                context.globalAlpha = alpha * this.imageOpacity_;
            }
            var rotation = this.imageRotation_;
            if (this.imageRotateWithView_) {
                rotation += this.viewRotation_;
            }
            for (var i = 0, ii = pixelCoordinates.length; i < ii; i += 2) {
                var x = pixelCoordinates[i] - this.imageAnchorX_;
                var y = pixelCoordinates[i + 1] - this.imageAnchorY_;
                if (rotation !== 0 ||
                    this.imageScale_[0] != 1 ||
                    this.imageScale_[1] != 1) {
                    var centerX = x + this.imageAnchorX_;
                    var centerY = y + this.imageAnchorY_;
                    compose(localTransform, centerX, centerY, 1, 1, rotation, -centerX, -centerY);
                    context.setTransform.apply(context, localTransform);
                    context.translate(centerX, centerY);
                    context.scale(this.imageScale_[0], this.imageScale_[1]);
                    context.drawImage(this.image_, this.imageOriginX_, this.imageOriginY_, this.imageWidth_, this.imageHeight_, -this.imageAnchorX_, -this.imageAnchorY_, this.imageWidth_, this.imageHeight_);
                    context.setTransform(1, 0, 0, 1, 0, 0);
                }
                else {
                    context.drawImage(this.image_, this.imageOriginX_, this.imageOriginY_, this.imageWidth_, this.imageHeight_, x, y, this.imageWidth_, this.imageHeight_);
                }
            }
            if (this.imageOpacity_ != 1) {
                context.globalAlpha = alpha;
            }
        };
        /**
         * @param {Array<number>} flatCoordinates Flat coordinates.
         * @param {number} offset Offset.
         * @param {number} end End.
         * @param {number} stride Stride.
         * @private
         */
        CanvasImmediateRenderer.prototype.drawText_ = function (flatCoordinates, offset, end, stride) {
            if (!this.textState_ || this.text_ === '') {
                return;
            }
            if (this.textFillState_) {
                this.setContextFillState_(this.textFillState_);
            }
            if (this.textStrokeState_) {
                this.setContextStrokeState_(this.textStrokeState_);
            }
            this.setContextTextState_(this.textState_);
            var pixelCoordinates = transform2D(flatCoordinates, offset, end, stride, this.transform_, this.pixelCoordinates_);
            var context = this.context_;
            var rotation = this.textRotation_;
            if (this.textRotateWithView_) {
                rotation += this.viewRotation_;
            }
            for (; offset < end; offset += stride) {
                var x = pixelCoordinates[offset] + this.textOffsetX_;
                var y = pixelCoordinates[offset + 1] + this.textOffsetY_;
                if (rotation !== 0 ||
                    this.textScale_[0] != 1 ||
                    this.textScale_[1] != 1) {
                    var localTransform = compose(this.tmpLocalTransform_, x, y, 1, 1, rotation, -x, -y);
                    context.setTransform.apply(context, localTransform);
                    context.translate(x, y);
                    context.scale(this.textScale_[0], this.textScale_[1]);
                    if (this.textStrokeState_) {
                        context.strokeText(this.text_, 0, 0);
                    }
                    if (this.textFillState_) {
                        context.fillText(this.text_, 0, 0);
                    }
                    context.setTransform(1, 0, 0, 1, 0, 0);
                }
                else {
                    if (this.textStrokeState_) {
                        context.strokeText(this.text_, x, y);
                    }
                    if (this.textFillState_) {
                        context.fillText(this.text_, x, y);
                    }
                }
            }
        };
        /**
         * @param {Array<number>} flatCoordinates Flat coordinates.
         * @param {number} offset Offset.
         * @param {number} end End.
         * @param {number} stride Stride.
         * @param {boolean} close Close.
         * @private
         * @return {number} end End.
         */
        CanvasImmediateRenderer.prototype.moveToLineTo_ = function (flatCoordinates, offset, end, stride, close) {
            var context = this.context_;
            var pixelCoordinates = transform2D(flatCoordinates, offset, end, stride, this.transform_, this.pixelCoordinates_);
            context.moveTo(pixelCoordinates[0], pixelCoordinates[1]);
            var length = pixelCoordinates.length;
            if (close) {
                length -= 2;
            }
            for (var i = 2; i < length; i += 2) {
                context.lineTo(pixelCoordinates[i], pixelCoordinates[i + 1]);
            }
            if (close) {
                context.closePath();
            }
            return end;
        };
        /**
         * @param {Array<number>} flatCoordinates Flat coordinates.
         * @param {number} offset Offset.
         * @param {Array<number>} ends Ends.
         * @param {number} stride Stride.
         * @private
         * @return {number} End.
         */
        CanvasImmediateRenderer.prototype.drawRings_ = function (flatCoordinates, offset, ends, stride) {
            for (var i = 0, ii = ends.length; i < ii; ++i) {
                offset = this.moveToLineTo_(flatCoordinates, offset, ends[i], stride, true);
            }
            return offset;
        };
        /**
         * Render a circle geometry into the canvas.  Rendering is immediate and uses
         * the current fill and stroke styles.
         *
         * @param {import("../../geom/Circle.js").default} geometry Circle geometry.
         * @api
         */
        CanvasImmediateRenderer.prototype.drawCircle = function (geometry) {
            if (!intersects$1(this.extent_, geometry.getExtent())) {
                return;
            }
            if (this.fillState_ || this.strokeState_) {
                if (this.fillState_) {
                    this.setContextFillState_(this.fillState_);
                }
                if (this.strokeState_) {
                    this.setContextStrokeState_(this.strokeState_);
                }
                var pixelCoordinates = transformGeom2D(geometry, this.transform_, this.pixelCoordinates_);
                var dx = pixelCoordinates[2] - pixelCoordinates[0];
                var dy = pixelCoordinates[3] - pixelCoordinates[1];
                var radius = Math.sqrt(dx * dx + dy * dy);
                var context = this.context_;
                context.beginPath();
                context.arc(pixelCoordinates[0], pixelCoordinates[1], radius, 0, 2 * Math.PI);
                if (this.fillState_) {
                    context.fill();
                }
                if (this.strokeState_) {
                    context.stroke();
                }
            }
            if (this.text_ !== '') {
                this.drawText_(geometry.getCenter(), 0, 2, 2);
            }
        };
        /**
         * Set the rendering style.  Note that since this is an immediate rendering API,
         * any `zIndex` on the provided style will be ignored.
         *
         * @param {import("../../style/Style.js").default} style The rendering style.
         * @api
         */
        CanvasImmediateRenderer.prototype.setStyle = function (style) {
            this.setFillStrokeStyle(style.getFill(), style.getStroke());
            this.setImageStyle(style.getImage());
            this.setTextStyle(style.getText());
        };
        /**
         * @param {import("../../transform.js").Transform} transform Transform.
         */
        CanvasImmediateRenderer.prototype.setTransform = function (transform) {
            this.transform_ = transform;
        };
        /**
         * Render a geometry into the canvas.  Call
         * {@link module:ol/render/canvas/Immediate~CanvasImmediateRenderer#setStyle renderer.setStyle()} first to set the rendering style.
         *
         * @param {import("../../geom/Geometry.js").default|import("../Feature.js").default} geometry The geometry to render.
         * @api
         */
        CanvasImmediateRenderer.prototype.drawGeometry = function (geometry) {
            var type = geometry.getType();
            switch (type) {
                case 'Point':
                    this.drawPoint(
                    /** @type {import("../../geom/Point.js").default} */ (geometry));
                    break;
                case 'LineString':
                    this.drawLineString(
                    /** @type {import("../../geom/LineString.js").default} */ (geometry));
                    break;
                case 'Polygon':
                    this.drawPolygon(
                    /** @type {import("../../geom/Polygon.js").default} */ (geometry));
                    break;
                case 'MultiPoint':
                    this.drawMultiPoint(
                    /** @type {import("../../geom/MultiPoint.js").default} */ (geometry));
                    break;
                case 'MultiLineString':
                    this.drawMultiLineString(
                    /** @type {import("../../geom/MultiLineString.js").default} */ (geometry));
                    break;
                case 'MultiPolygon':
                    this.drawMultiPolygon(
                    /** @type {import("../../geom/MultiPolygon.js").default} */ (geometry));
                    break;
                case 'GeometryCollection':
                    this.drawGeometryCollection(
                    /** @type {import("../../geom/GeometryCollection.js").default} */ (geometry));
                    break;
                case 'Circle':
                    this.drawCircle(
                    /** @type {import("../../geom/Circle.js").default} */ (geometry));
                    break;
            }
        };
        /**
         * Render a feature into the canvas.  Note that any `zIndex` on the provided
         * style will be ignored - features are rendered immediately in the order that
         * this method is called.  If you need `zIndex` support, you should be using an
         * {@link module:ol/layer/Vector~VectorLayer VectorLayer} instead.
         *
         * @param {import("../../Feature.js").default} feature Feature.
         * @param {import("../../style/Style.js").default} style Style.
         * @api
         */
        CanvasImmediateRenderer.prototype.drawFeature = function (feature, style) {
            var geometry = style.getGeometryFunction()(feature);
            if (!geometry || !intersects$1(this.extent_, geometry.getExtent())) {
                return;
            }
            this.setStyle(style);
            this.drawGeometry(geometry);
        };
        /**
         * Render a GeometryCollection to the canvas.  Rendering is immediate and
         * uses the current styles appropriate for each geometry in the collection.
         *
         * @param {import("../../geom/GeometryCollection.js").default} geometry Geometry collection.
         */
        CanvasImmediateRenderer.prototype.drawGeometryCollection = function (geometry) {
            var geometries = geometry.getGeometriesArray();
            for (var i = 0, ii = geometries.length; i < ii; ++i) {
                this.drawGeometry(geometries[i]);
            }
        };
        /**
         * Render a Point geometry into the canvas.  Rendering is immediate and uses
         * the current style.
         *
         * @param {import("../../geom/Point.js").default|import("../Feature.js").default} geometry Point geometry.
         */
        CanvasImmediateRenderer.prototype.drawPoint = function (geometry) {
            if (this.squaredTolerance_) {
                geometry = /** @type {import("../../geom/Point.js").default} */ (geometry.simplifyTransformed(this.squaredTolerance_, this.userTransform_));
            }
            var flatCoordinates = geometry.getFlatCoordinates();
            var stride = geometry.getStride();
            if (this.image_) {
                this.drawImages_(flatCoordinates, 0, flatCoordinates.length, stride);
            }
            if (this.text_ !== '') {
                this.drawText_(flatCoordinates, 0, flatCoordinates.length, stride);
            }
        };
        /**
         * Render a MultiPoint geometry  into the canvas.  Rendering is immediate and
         * uses the current style.
         *
         * @param {import("../../geom/MultiPoint.js").default|import("../Feature.js").default} geometry MultiPoint geometry.
         */
        CanvasImmediateRenderer.prototype.drawMultiPoint = function (geometry) {
            if (this.squaredTolerance_) {
                geometry = /** @type {import("../../geom/MultiPoint.js").default} */ (geometry.simplifyTransformed(this.squaredTolerance_, this.userTransform_));
            }
            var flatCoordinates = geometry.getFlatCoordinates();
            var stride = geometry.getStride();
            if (this.image_) {
                this.drawImages_(flatCoordinates, 0, flatCoordinates.length, stride);
            }
            if (this.text_ !== '') {
                this.drawText_(flatCoordinates, 0, flatCoordinates.length, stride);
            }
        };
        /**
         * Render a LineString into the canvas.  Rendering is immediate and uses
         * the current style.
         *
         * @param {import("../../geom/LineString.js").default|import("../Feature.js").default} geometry LineString geometry.
         */
        CanvasImmediateRenderer.prototype.drawLineString = function (geometry) {
            if (this.squaredTolerance_) {
                geometry = /** @type {import("../../geom/LineString.js").default} */ (geometry.simplifyTransformed(this.squaredTolerance_, this.userTransform_));
            }
            if (!intersects$1(this.extent_, geometry.getExtent())) {
                return;
            }
            if (this.strokeState_) {
                this.setContextStrokeState_(this.strokeState_);
                var context = this.context_;
                var flatCoordinates = geometry.getFlatCoordinates();
                context.beginPath();
                this.moveToLineTo_(flatCoordinates, 0, flatCoordinates.length, geometry.getStride(), false);
                context.stroke();
            }
            if (this.text_ !== '') {
                var flatMidpoint = geometry.getFlatMidpoint();
                this.drawText_(flatMidpoint, 0, 2, 2);
            }
        };
        /**
         * Render a MultiLineString geometry into the canvas.  Rendering is immediate
         * and uses the current style.
         *
         * @param {import("../../geom/MultiLineString.js").default|import("../Feature.js").default} geometry MultiLineString geometry.
         */
        CanvasImmediateRenderer.prototype.drawMultiLineString = function (geometry) {
            if (this.squaredTolerance_) {
                geometry =
                    /** @type {import("../../geom/MultiLineString.js").default} */ (geometry.simplifyTransformed(this.squaredTolerance_, this.userTransform_));
            }
            var geometryExtent = geometry.getExtent();
            if (!intersects$1(this.extent_, geometryExtent)) {
                return;
            }
            if (this.strokeState_) {
                this.setContextStrokeState_(this.strokeState_);
                var context = this.context_;
                var flatCoordinates = geometry.getFlatCoordinates();
                var offset = 0;
                var ends = /** @type {Array<number>} */ (geometry.getEnds());
                var stride = geometry.getStride();
                context.beginPath();
                for (var i = 0, ii = ends.length; i < ii; ++i) {
                    offset = this.moveToLineTo_(flatCoordinates, offset, ends[i], stride, false);
                }
                context.stroke();
            }
            if (this.text_ !== '') {
                var flatMidpoints = geometry.getFlatMidpoints();
                this.drawText_(flatMidpoints, 0, flatMidpoints.length, 2);
            }
        };
        /**
         * Render a Polygon geometry into the canvas.  Rendering is immediate and uses
         * the current style.
         *
         * @param {import("../../geom/Polygon.js").default|import("../Feature.js").default} geometry Polygon geometry.
         */
        CanvasImmediateRenderer.prototype.drawPolygon = function (geometry) {
            if (this.squaredTolerance_) {
                geometry = /** @type {import("../../geom/Polygon.js").default} */ (geometry.simplifyTransformed(this.squaredTolerance_, this.userTransform_));
            }
            if (!intersects$1(this.extent_, geometry.getExtent())) {
                return;
            }
            if (this.strokeState_ || this.fillState_) {
                if (this.fillState_) {
                    this.setContextFillState_(this.fillState_);
                }
                if (this.strokeState_) {
                    this.setContextStrokeState_(this.strokeState_);
                }
                var context = this.context_;
                context.beginPath();
                this.drawRings_(geometry.getOrientedFlatCoordinates(), 0, 
                /** @type {Array<number>} */ (geometry.getEnds()), geometry.getStride());
                if (this.fillState_) {
                    context.fill();
                }
                if (this.strokeState_) {
                    context.stroke();
                }
            }
            if (this.text_ !== '') {
                var flatInteriorPoint = geometry.getFlatInteriorPoint();
                this.drawText_(flatInteriorPoint, 0, 2, 2);
            }
        };
        /**
         * Render MultiPolygon geometry into the canvas.  Rendering is immediate and
         * uses the current style.
         * @param {import("../../geom/MultiPolygon.js").default} geometry MultiPolygon geometry.
         */
        CanvasImmediateRenderer.prototype.drawMultiPolygon = function (geometry) {
            if (this.squaredTolerance_) {
                geometry = /** @type {import("../../geom/MultiPolygon.js").default} */ (geometry.simplifyTransformed(this.squaredTolerance_, this.userTransform_));
            }
            if (!intersects$1(this.extent_, geometry.getExtent())) {
                return;
            }
            if (this.strokeState_ || this.fillState_) {
                if (this.fillState_) {
                    this.setContextFillState_(this.fillState_);
                }
                if (this.strokeState_) {
                    this.setContextStrokeState_(this.strokeState_);
                }
                var context = this.context_;
                var flatCoordinates = geometry.getOrientedFlatCoordinates();
                var offset = 0;
                var endss = geometry.getEndss();
                var stride = geometry.getStride();
                context.beginPath();
                for (var i = 0, ii = endss.length; i < ii; ++i) {
                    var ends = endss[i];
                    offset = this.drawRings_(flatCoordinates, offset, ends, stride);
                }
                if (this.fillState_) {
                    context.fill();
                }
                if (this.strokeState_) {
                    context.stroke();
                }
            }
            if (this.text_ !== '') {
                var flatInteriorPoints = geometry.getFlatInteriorPoints();
                this.drawText_(flatInteriorPoints, 0, flatInteriorPoints.length, 2);
            }
        };
        /**
         * @param {import("../canvas.js").FillState} fillState Fill state.
         * @private
         */
        CanvasImmediateRenderer.prototype.setContextFillState_ = function (fillState) {
            var context = this.context_;
            var contextFillState = this.contextFillState_;
            if (!contextFillState) {
                context.fillStyle = fillState.fillStyle;
                this.contextFillState_ = {
                    fillStyle: fillState.fillStyle,
                };
            }
            else {
                if (contextFillState.fillStyle != fillState.fillStyle) {
                    contextFillState.fillStyle = fillState.fillStyle;
                    context.fillStyle = fillState.fillStyle;
                }
            }
        };
        /**
         * @param {import("../canvas.js").StrokeState} strokeState Stroke state.
         * @private
         */
        CanvasImmediateRenderer.prototype.setContextStrokeState_ = function (strokeState) {
            var context = this.context_;
            var contextStrokeState = this.contextStrokeState_;
            if (!contextStrokeState) {
                context.lineCap = strokeState.lineCap;
                if (context.setLineDash) {
                    context.setLineDash(strokeState.lineDash);
                    context.lineDashOffset = strokeState.lineDashOffset;
                }
                context.lineJoin = strokeState.lineJoin;
                context.lineWidth = strokeState.lineWidth;
                context.miterLimit = strokeState.miterLimit;
                context.strokeStyle = strokeState.strokeStyle;
                this.contextStrokeState_ = {
                    lineCap: strokeState.lineCap,
                    lineDash: strokeState.lineDash,
                    lineDashOffset: strokeState.lineDashOffset,
                    lineJoin: strokeState.lineJoin,
                    lineWidth: strokeState.lineWidth,
                    miterLimit: strokeState.miterLimit,
                    strokeStyle: strokeState.strokeStyle,
                };
            }
            else {
                if (contextStrokeState.lineCap != strokeState.lineCap) {
                    contextStrokeState.lineCap = strokeState.lineCap;
                    context.lineCap = strokeState.lineCap;
                }
                if (context.setLineDash) {
                    if (!equals$1(contextStrokeState.lineDash, strokeState.lineDash)) {
                        context.setLineDash((contextStrokeState.lineDash = strokeState.lineDash));
                    }
                    if (contextStrokeState.lineDashOffset != strokeState.lineDashOffset) {
                        contextStrokeState.lineDashOffset = strokeState.lineDashOffset;
                        context.lineDashOffset = strokeState.lineDashOffset;
                    }
                }
                if (contextStrokeState.lineJoin != strokeState.lineJoin) {
                    contextStrokeState.lineJoin = strokeState.lineJoin;
                    context.lineJoin = strokeState.lineJoin;
                }
                if (contextStrokeState.lineWidth != strokeState.lineWidth) {
                    contextStrokeState.lineWidth = strokeState.lineWidth;
                    context.lineWidth = strokeState.lineWidth;
                }
                if (contextStrokeState.miterLimit != strokeState.miterLimit) {
                    contextStrokeState.miterLimit = strokeState.miterLimit;
                    context.miterLimit = strokeState.miterLimit;
                }
                if (contextStrokeState.strokeStyle != strokeState.strokeStyle) {
                    contextStrokeState.strokeStyle = strokeState.strokeStyle;
                    context.strokeStyle = strokeState.strokeStyle;
                }
            }
        };
        /**
         * @param {import("../canvas.js").TextState} textState Text state.
         * @private
         */
        CanvasImmediateRenderer.prototype.setContextTextState_ = function (textState) {
            var context = this.context_;
            var contextTextState = this.contextTextState_;
            var textAlign = textState.textAlign
                ? textState.textAlign
                : defaultTextAlign;
            if (!contextTextState) {
                context.font = textState.font;
                context.textAlign = /** @type {CanvasTextAlign} */ (textAlign);
                context.textBaseline = /** @type {CanvasTextBaseline} */ (textState.textBaseline);
                this.contextTextState_ = {
                    font: textState.font,
                    textAlign: textAlign,
                    textBaseline: textState.textBaseline,
                };
            }
            else {
                if (contextTextState.font != textState.font) {
                    contextTextState.font = textState.font;
                    context.font = textState.font;
                }
                if (contextTextState.textAlign != textAlign) {
                    contextTextState.textAlign = /** @type {CanvasTextAlign} */ (textAlign);
                    context.textAlign = /** @type {CanvasTextAlign} */ (textAlign);
                }
                if (contextTextState.textBaseline != textState.textBaseline) {
                    contextTextState.textBaseline = /** @type {CanvasTextBaseline} */ (textState.textBaseline);
                    context.textBaseline = /** @type {CanvasTextBaseline} */ (textState.textBaseline);
                }
            }
        };
        /**
         * Set the fill and stroke style for subsequent draw operations.  To clear
         * either fill or stroke styles, pass null for the appropriate parameter.
         *
         * @param {import("../../style/Fill.js").default} fillStyle Fill style.
         * @param {import("../../style/Stroke.js").default} strokeStyle Stroke style.
         */
        CanvasImmediateRenderer.prototype.setFillStrokeStyle = function (fillStyle, strokeStyle) {
            var _this = this;
            if (!fillStyle) {
                this.fillState_ = null;
            }
            else {
                var fillStyleColor = fillStyle.getColor();
                this.fillState_ = {
                    fillStyle: asColorLike(fillStyleColor ? fillStyleColor : defaultFillStyle),
                };
            }
            if (!strokeStyle) {
                this.strokeState_ = null;
            }
            else {
                var strokeStyleColor = strokeStyle.getColor();
                var strokeStyleLineCap = strokeStyle.getLineCap();
                var strokeStyleLineDash = strokeStyle.getLineDash();
                var strokeStyleLineDashOffset = strokeStyle.getLineDashOffset();
                var strokeStyleLineJoin = strokeStyle.getLineJoin();
                var strokeStyleWidth = strokeStyle.getWidth();
                var strokeStyleMiterLimit = strokeStyle.getMiterLimit();
                var lineDash = strokeStyleLineDash
                    ? strokeStyleLineDash
                    : defaultLineDash;
                this.strokeState_ = {
                    lineCap: strokeStyleLineCap !== undefined
                        ? strokeStyleLineCap
                        : defaultLineCap,
                    lineDash: this.pixelRatio_ === 1
                        ? lineDash
                        : lineDash.map(function (n) { return n * _this.pixelRatio_; }),
                    lineDashOffset: (strokeStyleLineDashOffset
                        ? strokeStyleLineDashOffset
                        : defaultLineDashOffset) * this.pixelRatio_,
                    lineJoin: strokeStyleLineJoin !== undefined
                        ? strokeStyleLineJoin
                        : defaultLineJoin,
                    lineWidth: (strokeStyleWidth !== undefined
                        ? strokeStyleWidth
                        : defaultLineWidth) * this.pixelRatio_,
                    miterLimit: strokeStyleMiterLimit !== undefined
                        ? strokeStyleMiterLimit
                        : defaultMiterLimit,
                    strokeStyle: asColorLike(strokeStyleColor ? strokeStyleColor : defaultStrokeStyle),
                };
            }
        };
        /**
         * Set the image style for subsequent draw operations.  Pass null to remove
         * the image style.
         *
         * @param {import("../../style/Image.js").default} imageStyle Image style.
         */
        CanvasImmediateRenderer.prototype.setImageStyle = function (imageStyle) {
            var imageSize;
            if (!imageStyle || !(imageSize = imageStyle.getSize())) {
                this.image_ = null;
                return;
            }
            var imageAnchor = imageStyle.getAnchor();
            var imageOrigin = imageStyle.getOrigin();
            this.image_ = imageStyle.getImage(this.pixelRatio_);
            this.imageAnchorX_ = imageAnchor[0] * this.pixelRatio_;
            this.imageAnchorY_ = imageAnchor[1] * this.pixelRatio_;
            this.imageHeight_ = imageSize[1] * this.pixelRatio_;
            this.imageOpacity_ = imageStyle.getOpacity();
            this.imageOriginX_ = imageOrigin[0];
            this.imageOriginY_ = imageOrigin[1];
            this.imageRotateWithView_ = imageStyle.getRotateWithView();
            this.imageRotation_ = imageStyle.getRotation();
            this.imageScale_ = imageStyle.getScaleArray();
            this.imageWidth_ = imageSize[0] * this.pixelRatio_;
        };
        /**
         * Set the text style for subsequent draw operations.  Pass null to
         * remove the text style.
         *
         * @param {import("../../style/Text.js").default} textStyle Text style.
         */
        CanvasImmediateRenderer.prototype.setTextStyle = function (textStyle) {
            if (!textStyle) {
                this.text_ = '';
            }
            else {
                var textFillStyle = textStyle.getFill();
                if (!textFillStyle) {
                    this.textFillState_ = null;
                }
                else {
                    var textFillStyleColor = textFillStyle.getColor();
                    this.textFillState_ = {
                        fillStyle: asColorLike(textFillStyleColor ? textFillStyleColor : defaultFillStyle),
                    };
                }
                var textStrokeStyle = textStyle.getStroke();
                if (!textStrokeStyle) {
                    this.textStrokeState_ = null;
                }
                else {
                    var textStrokeStyleColor = textStrokeStyle.getColor();
                    var textStrokeStyleLineCap = textStrokeStyle.getLineCap();
                    var textStrokeStyleLineDash = textStrokeStyle.getLineDash();
                    var textStrokeStyleLineDashOffset = textStrokeStyle.getLineDashOffset();
                    var textStrokeStyleLineJoin = textStrokeStyle.getLineJoin();
                    var textStrokeStyleWidth = textStrokeStyle.getWidth();
                    var textStrokeStyleMiterLimit = textStrokeStyle.getMiterLimit();
                    this.textStrokeState_ = {
                        lineCap: textStrokeStyleLineCap !== undefined
                            ? textStrokeStyleLineCap
                            : defaultLineCap,
                        lineDash: textStrokeStyleLineDash
                            ? textStrokeStyleLineDash
                            : defaultLineDash,
                        lineDashOffset: textStrokeStyleLineDashOffset
                            ? textStrokeStyleLineDashOffset
                            : defaultLineDashOffset,
                        lineJoin: textStrokeStyleLineJoin !== undefined
                            ? textStrokeStyleLineJoin
                            : defaultLineJoin,
                        lineWidth: textStrokeStyleWidth !== undefined
                            ? textStrokeStyleWidth
                            : defaultLineWidth,
                        miterLimit: textStrokeStyleMiterLimit !== undefined
                            ? textStrokeStyleMiterLimit
                            : defaultMiterLimit,
                        strokeStyle: asColorLike(textStrokeStyleColor ? textStrokeStyleColor : defaultStrokeStyle),
                    };
                }
                var textFont = textStyle.getFont();
                var textOffsetX = textStyle.getOffsetX();
                var textOffsetY = textStyle.getOffsetY();
                var textRotateWithView = textStyle.getRotateWithView();
                var textRotation = textStyle.getRotation();
                var textScale = textStyle.getScaleArray();
                var textText = textStyle.getText();
                var textTextAlign = textStyle.getTextAlign();
                var textTextBaseline = textStyle.getTextBaseline();
                this.textState_ = {
                    font: textFont !== undefined ? textFont : defaultFont,
                    textAlign: textTextAlign !== undefined ? textTextAlign : defaultTextAlign,
                    textBaseline: textTextBaseline !== undefined
                        ? textTextBaseline
                        : defaultTextBaseline,
                };
                this.text_ =
                    textText !== undefined
                        ? Array.isArray(textText)
                            ? textText.reduce(function (acc, t, i) { return (acc += i % 2 ? ' ' : t); }, '')
                            : textText
                        : '';
                this.textOffsetX_ =
                    textOffsetX !== undefined ? this.pixelRatio_ * textOffsetX : 0;
                this.textOffsetY_ =
                    textOffsetY !== undefined ? this.pixelRatio_ * textOffsetY : 0;
                this.textRotateWithView_ =
                    textRotateWithView !== undefined ? textRotateWithView : false;
                this.textRotation_ = textRotation !== undefined ? textRotation : 0;
                this.textScale_ = [
                    this.pixelRatio_ * textScale[0],
                    this.pixelRatio_ * textScale[1],
                ];
            }
        };
        return CanvasImmediateRenderer;
    }(VectorContext$1));
    var CanvasImmediateRenderer$1 = CanvasImmediateRenderer;

    /**
     * @module ol/style/IconAnchorUnits
     */
    /**
     * Icon anchor units. One of 'fraction', 'pixels'.
     * @enum {string}
     */
    var IconAnchorUnits = {
        /**
         * Anchor is a fraction
         * @api
         */
        FRACTION: 'fraction',
        /**
         * Anchor is in pixels
         * @api
         */
        PIXELS: 'pixels',
    };

    /**
     * @module ol/style/IconOrigin
     */
    /**
     * Icon origin. One of 'bottom-left', 'bottom-right', 'top-left', 'top-right'.
     * @enum {string}
     */
    var IconOrigin = {
        /**
         * Origin is at bottom left
         * @api
         */
        BOTTOM_LEFT: 'bottom-left',
        /**
         * Origin is at bottom right
         * @api
         */
        BOTTOM_RIGHT: 'bottom-right',
        /**
         * Origin is at top left
         * @api
         */
        TOP_LEFT: 'top-left',
        /**
         * Origin is at top right
         * @api
         */
        TOP_RIGHT: 'top-right',
    };

    /**
     * @module ol/style/IconImageCache
     */
    /**
     * @classdesc
     * Singleton class. Available through {@link module:ol/style/IconImageCache.shared}.
     */
    var IconImageCache = /** @class */ (function () {
        function IconImageCache() {
            /**
             * @type {!Object<string, import("./IconImage.js").default>}
             * @private
             */
            this.cache_ = {};
            /**
             * @type {number}
             * @private
             */
            this.cacheSize_ = 0;
            /**
             * @type {number}
             * @private
             */
            this.maxCacheSize_ = 32;
        }
        /**
         * FIXME empty description for jsdoc
         */
        IconImageCache.prototype.clear = function () {
            this.cache_ = {};
            this.cacheSize_ = 0;
        };
        /**
         * @return {boolean} Can expire cache.
         */
        IconImageCache.prototype.canExpireCache = function () {
            return this.cacheSize_ > this.maxCacheSize_;
        };
        /**
         * FIXME empty description for jsdoc
         */
        IconImageCache.prototype.expire = function () {
            if (this.canExpireCache()) {
                var i = 0;
                for (var key in this.cache_) {
                    var iconImage = this.cache_[key];
                    if ((i++ & 3) === 0 && !iconImage.hasListener()) {
                        delete this.cache_[key];
                        --this.cacheSize_;
                    }
                }
            }
        };
        /**
         * @param {string} src Src.
         * @param {?string} crossOrigin Cross origin.
         * @param {import("../color.js").Color} color Color.
         * @return {import("./IconImage.js").default} Icon image.
         */
        IconImageCache.prototype.get = function (src, crossOrigin, color) {
            var key = getKey(src, crossOrigin, color);
            return key in this.cache_ ? this.cache_[key] : null;
        };
        /**
         * @param {string} src Src.
         * @param {?string} crossOrigin Cross origin.
         * @param {import("../color.js").Color} color Color.
         * @param {import("./IconImage.js").default} iconImage Icon image.
         */
        IconImageCache.prototype.set = function (src, crossOrigin, color, iconImage) {
            var key = getKey(src, crossOrigin, color);
            this.cache_[key] = iconImage;
            ++this.cacheSize_;
        };
        /**
         * Set the cache size of the icon cache. Default is `32`. Change this value when
         * your map uses more than 32 different icon images and you are not caching icon
         * styles on the application level.
         * @param {number} maxCacheSize Cache max size.
         * @api
         */
        IconImageCache.prototype.setSize = function (maxCacheSize) {
            this.maxCacheSize_ = maxCacheSize;
            this.expire();
        };
        return IconImageCache;
    }());
    /**
     * @param {string} src Src.
     * @param {?string} crossOrigin Cross origin.
     * @param {import("../color.js").Color} color Color.
     * @return {string} Cache key.
     */
    function getKey(src, crossOrigin, color) {
        var colorString = color ? asString(color) : 'null';
        return crossOrigin + ':' + src + ':' + colorString;
    }
    /**
     * The {@link module:ol/style/IconImageCache~IconImageCache} for
     * {@link module:ol/style/Icon~Icon} images.
     * @api
     */
    var shared = new IconImageCache();

    var __extends$9 = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            if (typeof b !== "function" && b !== null)
                throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * @abstract
     */
    var ImageBase = /** @class */ (function (_super) {
        __extends$9(ImageBase, _super);
        /**
         * @param {import("./extent.js").Extent} extent Extent.
         * @param {number|undefined} resolution Resolution.
         * @param {number} pixelRatio Pixel ratio.
         * @param {import("./ImageState.js").default} state State.
         */
        function ImageBase(extent, resolution, pixelRatio, state) {
            var _this = _super.call(this) || this;
            /**
             * @protected
             * @type {import("./extent.js").Extent}
             */
            _this.extent = extent;
            /**
             * @private
             * @type {number}
             */
            _this.pixelRatio_ = pixelRatio;
            /**
             * @protected
             * @type {number|undefined}
             */
            _this.resolution = resolution;
            /**
             * @protected
             * @type {import("./ImageState.js").default}
             */
            _this.state = state;
            return _this;
        }
        /**
         * @protected
         */
        ImageBase.prototype.changed = function () {
            this.dispatchEvent(EventType.CHANGE);
        };
        /**
         * @return {import("./extent.js").Extent} Extent.
         */
        ImageBase.prototype.getExtent = function () {
            return this.extent;
        };
        /**
         * @abstract
         * @return {HTMLCanvasElement|HTMLImageElement|HTMLVideoElement} Image.
         */
        ImageBase.prototype.getImage = function () {
            return abstract();
        };
        /**
         * @return {number} PixelRatio.
         */
        ImageBase.prototype.getPixelRatio = function () {
            return this.pixelRatio_;
        };
        /**
         * @return {number} Resolution.
         */
        ImageBase.prototype.getResolution = function () {
            return /** @type {number} */ (this.resolution);
        };
        /**
         * @return {import("./ImageState.js").default} State.
         */
        ImageBase.prototype.getState = function () {
            return this.state;
        };
        /**
         * Load not yet loaded URI.
         * @abstract
         */
        ImageBase.prototype.load = function () {
            abstract();
        };
        return ImageBase;
    }(Target$1));
    var ImageBase$1 = ImageBase;

    var __extends$8 = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            if (typeof b !== "function" && b !== null)
                throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * A function that takes an {@link module:ol/Image~ImageWrapper} for the image and a
     * `{string}` for the src as arguments. It is supposed to make it so the
     * underlying image {@link module:ol/Image~ImageWrapper#getImage} is assigned the
     * content specified by the src. If not specified, the default is
     *
     *     function(image, src) {
     *       image.getImage().src = src;
     *     }
     *
     * Providing a custom `imageLoadFunction` can be useful to load images with
     * post requests or - in general - through XHR requests, where the src of the
     * image element would be set to a data URI when the content is loaded.
     *
     * @typedef {function(ImageWrapper, string): void} LoadFunction
     * @api
     */
    /** @class */ ((function (_super) {
        __extends$8(ImageWrapper, _super);
        /**
         * @param {import("./extent.js").Extent} extent Extent.
         * @param {number|undefined} resolution Resolution.
         * @param {number} pixelRatio Pixel ratio.
         * @param {string} src Image source URI.
         * @param {?string} crossOrigin Cross origin.
         * @param {LoadFunction} imageLoadFunction Image load function.
         */
        function ImageWrapper(extent, resolution, pixelRatio, src, crossOrigin, imageLoadFunction) {
            var _this = _super.call(this, extent, resolution, pixelRatio, ImageState.IDLE) || this;
            /**
             * @private
             * @type {string}
             */
            _this.src_ = src;
            /**
             * @private
             * @type {HTMLCanvasElement|HTMLImageElement|HTMLVideoElement}
             */
            _this.image_ = new Image();
            if (crossOrigin !== null) {
                _this.image_.crossOrigin = crossOrigin;
            }
            /**
             * @private
             * @type {?function():void}
             */
            _this.unlisten_ = null;
            /**
             * @protected
             * @type {import("./ImageState.js").default}
             */
            _this.state = ImageState.IDLE;
            /**
             * @private
             * @type {LoadFunction}
             */
            _this.imageLoadFunction_ = imageLoadFunction;
            return _this;
        }
        /**
         * @return {HTMLCanvasElement|HTMLImageElement|HTMLVideoElement} Image.
         * @api
         */
        ImageWrapper.prototype.getImage = function () {
            return this.image_;
        };
        /**
         * Tracks loading or read errors.
         *
         * @private
         */
        ImageWrapper.prototype.handleImageError_ = function () {
            this.state = ImageState.ERROR;
            this.unlistenImage_();
            this.changed();
        };
        /**
         * Tracks successful image load.
         *
         * @private
         */
        ImageWrapper.prototype.handleImageLoad_ = function () {
            if (this.resolution === undefined) {
                this.resolution = getHeight(this.extent) / this.image_.height;
            }
            this.state = ImageState.LOADED;
            this.unlistenImage_();
            this.changed();
        };
        /**
         * Load the image or retry if loading previously failed.
         * Loading is taken care of by the tile queue, and calling this method is
         * only needed for preloading or for reloading in case of an error.
         * @api
         */
        ImageWrapper.prototype.load = function () {
            if (this.state == ImageState.IDLE || this.state == ImageState.ERROR) {
                this.state = ImageState.LOADING;
                this.changed();
                this.imageLoadFunction_(this, this.src_);
                this.unlisten_ = listenImage(this.image_, this.handleImageLoad_.bind(this), this.handleImageError_.bind(this));
            }
        };
        /**
         * @param {HTMLCanvasElement|HTMLImageElement|HTMLVideoElement} image Image.
         */
        ImageWrapper.prototype.setImage = function (image) {
            this.image_ = image;
            this.resolution = getHeight(this.extent) / this.image_.height;
        };
        /**
         * Discards event handlers which listen for load completion or errors.
         *
         * @private
         */
        ImageWrapper.prototype.unlistenImage_ = function () {
            if (this.unlisten_) {
                this.unlisten_();
                this.unlisten_ = null;
            }
        };
        return ImageWrapper;
    })(ImageBase$1));
    /**
     * @param {HTMLCanvasElement|HTMLImageElement|HTMLVideoElement} image Image element.
     * @param {function():any} loadHandler Load callback function.
     * @param {function():any} errorHandler Error callback function.
     * @return {function():void} Callback to stop listening.
     */
    function listenImage(image, loadHandler, errorHandler) {
        var img = /** @type {HTMLImageElement} */ (image);
        var listening = true;
        var decoding = false;
        var loaded = false;
        var listenerKeys = [
            listenOnce(img, EventType.LOAD, function () {
                loaded = true;
                if (!decoding) {
                    loadHandler();
                }
            }),
        ];
        if (img.src && IMAGE_DECODE) {
            decoding = true;
            img
                .decode()
                .then(function () {
                if (listening) {
                    loadHandler();
                }
            })
                .catch(function (error) {
                if (listening) {
                    if (loaded) {
                        loadHandler();
                    }
                    else {
                        errorHandler();
                    }
                }
            });
        }
        else {
            listenerKeys.push(listenOnce(img, EventType.ERROR, errorHandler));
        }
        return function unlisten() {
            listening = false;
            listenerKeys.forEach(unlistenByKey);
        };
    }

    /**
     * @module ol/style/IconImage
     */
    var __extends$7 = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            if (typeof b !== "function" && b !== null)
                throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * @type {CanvasRenderingContext2D}
     */
    var taintedTestContext = null;
    var IconImage = /** @class */ (function (_super) {
        __extends$7(IconImage, _super);
        /**
         * @param {HTMLImageElement|HTMLCanvasElement} image Image.
         * @param {string|undefined} src Src.
         * @param {import("../size.js").Size} size Size.
         * @param {?string} crossOrigin Cross origin.
         * @param {import("../ImageState.js").default} imageState Image state.
         * @param {import("../color.js").Color} color Color.
         */
        function IconImage(image, src, size, crossOrigin, imageState, color) {
            var _this = _super.call(this) || this;
            /**
             * @private
             * @type {HTMLImageElement|HTMLCanvasElement}
             */
            _this.hitDetectionImage_ = null;
            /**
             * @private
             * @type {HTMLImageElement|HTMLCanvasElement}
             */
            _this.image_ = !image ? new Image() : image;
            if (crossOrigin !== null) {
                /** @type {HTMLImageElement} */ (_this.image_).crossOrigin = crossOrigin;
            }
            /**
             * @private
             * @type {Object<number, HTMLCanvasElement>}
             */
            _this.canvas_ = {};
            /**
             * @private
             * @type {import("../color.js").Color}
             */
            _this.color_ = color;
            /**
             * @private
             * @type {?function():void}
             */
            _this.unlisten_ = null;
            /**
             * @private
             * @type {import("../ImageState.js").default}
             */
            _this.imageState_ = imageState;
            /**
             * @private
             * @type {import("../size.js").Size}
             */
            _this.size_ = size;
            /**
             * @private
             * @type {string|undefined}
             */
            _this.src_ = src;
            /**
             * @private
             */
            _this.tainted_;
            return _this;
        }
        /**
         * @private
         * @return {boolean} The image canvas is tainted.
         */
        IconImage.prototype.isTainted_ = function () {
            if (this.tainted_ === undefined && this.imageState_ === ImageState.LOADED) {
                if (!taintedTestContext) {
                    taintedTestContext = createCanvasContext2D(1, 1);
                }
                taintedTestContext.drawImage(this.image_, 0, 0);
                try {
                    taintedTestContext.getImageData(0, 0, 1, 1);
                    this.tainted_ = false;
                }
                catch (e) {
                    taintedTestContext = null;
                    this.tainted_ = true;
                }
            }
            return this.tainted_ === true;
        };
        /**
         * @private
         */
        IconImage.prototype.dispatchChangeEvent_ = function () {
            this.dispatchEvent(EventType.CHANGE);
        };
        /**
         * @private
         */
        IconImage.prototype.handleImageError_ = function () {
            this.imageState_ = ImageState.ERROR;
            this.unlistenImage_();
            this.dispatchChangeEvent_();
        };
        /**
         * @private
         */
        IconImage.prototype.handleImageLoad_ = function () {
            this.imageState_ = ImageState.LOADED;
            if (this.size_) {
                this.image_.width = this.size_[0];
                this.image_.height = this.size_[1];
            }
            else {
                this.size_ = [this.image_.width, this.image_.height];
            }
            this.unlistenImage_();
            this.dispatchChangeEvent_();
        };
        /**
         * @param {number} pixelRatio Pixel ratio.
         * @return {HTMLImageElement|HTMLCanvasElement} Image or Canvas element.
         */
        IconImage.prototype.getImage = function (pixelRatio) {
            this.replaceColor_(pixelRatio);
            return this.canvas_[pixelRatio] ? this.canvas_[pixelRatio] : this.image_;
        };
        /**
         * @param {number} pixelRatio Pixel ratio.
         * @return {number} Image or Canvas element.
         */
        IconImage.prototype.getPixelRatio = function (pixelRatio) {
            this.replaceColor_(pixelRatio);
            return this.canvas_[pixelRatio] ? pixelRatio : 1;
        };
        /**
         * @return {import("../ImageState.js").default} Image state.
         */
        IconImage.prototype.getImageState = function () {
            return this.imageState_;
        };
        /**
         * @return {HTMLImageElement|HTMLCanvasElement} Image element.
         */
        IconImage.prototype.getHitDetectionImage = function () {
            if (!this.hitDetectionImage_) {
                if (this.isTainted_()) {
                    var width = this.size_[0];
                    var height = this.size_[1];
                    var context = createCanvasContext2D(width, height);
                    context.fillRect(0, 0, width, height);
                    this.hitDetectionImage_ = context.canvas;
                }
                else {
                    this.hitDetectionImage_ = this.image_;
                }
            }
            return this.hitDetectionImage_;
        };
        /**
         * Get the size of the icon (in pixels).
         * @return {import("../size.js").Size} Image size.
         */
        IconImage.prototype.getSize = function () {
            return this.size_;
        };
        /**
         * @return {string|undefined} Image src.
         */
        IconImage.prototype.getSrc = function () {
            return this.src_;
        };
        /**
         * Load not yet loaded URI.
         */
        IconImage.prototype.load = function () {
            if (this.imageState_ == ImageState.IDLE) {
                this.imageState_ = ImageState.LOADING;
                try {
                    /** @type {HTMLImageElement} */ (this.image_).src = this.src_;
                }
                catch (e) {
                    this.handleImageError_();
                }
                this.unlisten_ = listenImage(this.image_, this.handleImageLoad_.bind(this), this.handleImageError_.bind(this));
            }
        };
        /**
         * @param {number} pixelRatio Pixel ratio.
         * @private
         */
        IconImage.prototype.replaceColor_ = function (pixelRatio) {
            if (!this.color_ ||
                this.canvas_[pixelRatio] ||
                this.imageState_ !== ImageState.LOADED) {
                return;
            }
            var canvas = document.createElement('canvas');
            this.canvas_[pixelRatio] = canvas;
            canvas.width = Math.ceil(this.image_.width * pixelRatio);
            canvas.height = Math.ceil(this.image_.height * pixelRatio);
            var ctx = canvas.getContext('2d');
            ctx.scale(pixelRatio, pixelRatio);
            ctx.drawImage(this.image_, 0, 0);
            ctx.globalCompositeOperation = 'multiply';
            // Internet Explorer 11 does not support the multiply operation.
            // If the canvas is tainted in Internet Explorer this still produces
            // a solid color image with the shape of the icon.
            if (ctx.globalCompositeOperation === 'multiply' || this.isTainted_()) {
                ctx.fillStyle = asString(this.color_);
                ctx.fillRect(0, 0, canvas.width / pixelRatio, canvas.height / pixelRatio);
                ctx.globalCompositeOperation = 'destination-in';
                ctx.drawImage(this.image_, 0, 0);
            }
            else {
                var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                var data = imgData.data;
                var r = this.color_[0] / 255.0;
                var g = this.color_[1] / 255.0;
                var b = this.color_[2] / 255.0;
                var a = this.color_[3];
                for (var i = 0, ii = data.length; i < ii; i += 4) {
                    data[i] *= r;
                    data[i + 1] *= g;
                    data[i + 2] *= b;
                    data[i + 3] *= a;
                }
                ctx.putImageData(imgData, 0, 0);
            }
        };
        /**
         * Discards event handlers which listen for load completion or errors.
         *
         * @private
         */
        IconImage.prototype.unlistenImage_ = function () {
            if (this.unlisten_) {
                this.unlisten_();
                this.unlisten_ = null;
            }
        };
        return IconImage;
    }(Target$1));
    /**
     * @param {HTMLImageElement|HTMLCanvasElement} image Image.
     * @param {string} src Src.
     * @param {import("../size.js").Size} size Size.
     * @param {?string} crossOrigin Cross origin.
     * @param {import("../ImageState.js").default} imageState Image state.
     * @param {import("../color.js").Color} color Color.
     * @return {IconImage} Icon image.
     */
    function get(image, src, size, crossOrigin, imageState, color) {
        var iconImage = shared.get(src, crossOrigin, color);
        if (!iconImage) {
            iconImage = new IconImage(image, src, size, crossOrigin, imageState, color);
            shared.set(src, crossOrigin, color, iconImage);
        }
        return iconImage;
    }

    var __extends$6 = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            if (typeof b !== "function" && b !== null)
                throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * @typedef {Object} Options
     * @property {Array<number>} [anchor=[0.5, 0.5]] Anchor. Default value is the icon center.
     * @property {import("./IconOrigin.js").default} [anchorOrigin='top-left'] Origin of the anchor: `bottom-left`, `bottom-right`,
     * `top-left` or `top-right`.
     * @property {import("./IconAnchorUnits.js").default} [anchorXUnits='fraction'] Units in which the anchor x value is
     * specified. A value of `'fraction'` indicates the x value is a fraction of the icon. A value of `'pixels'` indicates
     * the x value in pixels.
     * @property {import("./IconAnchorUnits.js").default} [anchorYUnits='fraction'] Units in which the anchor y value is
     * specified. A value of `'fraction'` indicates the y value is a fraction of the icon. A value of `'pixels'` indicates
     * the y value in pixels.
     * @property {import("../color.js").Color|string} [color] Color to tint the icon. If not specified,
     * the icon will be left as is.
     * @property {null|string} [crossOrigin] The `crossOrigin` attribute for loaded images. Note that you must provide a
     * `crossOrigin` value if you want to access pixel data with the Canvas renderer.
     * See https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image for more detail.
     * @property {HTMLImageElement|HTMLCanvasElement} [img] Image object for the icon. If the `src` option is not provided then the
     * provided image must already be loaded. And in that case, it is required
     * to provide the size of the image, with the `imgSize` option.
     * @property {Array<number>} [offset=[0, 0]] Offset, which, together with the size and the offset origin, define the
     * sub-rectangle to use from the original icon image.
     * @property {Array<number>} [displacement=[0,0]] Displacement of the icon.
     * @property {import("./IconOrigin.js").default} [offsetOrigin='top-left'] Origin of the offset: `bottom-left`, `bottom-right`,
     * `top-left` or `top-right`.
     * @property {number} [opacity=1] Opacity of the icon.
     * @property {number|import("../size.js").Size} [scale=1] Scale.
     * @property {boolean} [rotateWithView=false] Whether to rotate the icon with the view.
     * @property {number} [rotation=0] Rotation in radians (positive rotation clockwise).
     * @property {import("../size.js").Size} [size] Icon size in pixel. Can be used together with `offset` to define the
     * sub-rectangle to use from the origin (sprite) icon image.
     * @property {import("../size.js").Size} [imgSize] Image size in pixels. Only required if `img` is set and `src` is not, and
     * for SVG images in Internet Explorer 11. The provided `imgSize` needs to match the actual size of the image.
     * @property {string} [src] Image source URI.
     * @property {"declutter"|"obstacle"|"none"|undefined} [declutterMode] Declutter mode
     */
    /**
     * @classdesc
     * Set icon style for vector features.
     * @api
     */
    var Icon = /** @class */ (function (_super) {
        __extends$6(Icon, _super);
        /**
         * @param {Options} [opt_options] Options.
         */
        function Icon(opt_options) {
            var _this = this;
            var options = opt_options || {};
            /**
             * @type {number}
             */
            var opacity = options.opacity !== undefined ? options.opacity : 1;
            /**
             * @type {number}
             */
            var rotation = options.rotation !== undefined ? options.rotation : 0;
            /**
             * @type {number|import("../size.js").Size}
             */
            var scale = options.scale !== undefined ? options.scale : 1;
            /**
             * @type {boolean}
             */
            var rotateWithView = options.rotateWithView !== undefined ? options.rotateWithView : false;
            _this = _super.call(this, {
                opacity: opacity,
                rotation: rotation,
                scale: scale,
                displacement: options.displacement !== undefined ? options.displacement : [0, 0],
                rotateWithView: rotateWithView,
                declutterMode: options.declutterMode,
            }) || this;
            /**
             * @private
             * @type {Array<number>}
             */
            _this.anchor_ = options.anchor !== undefined ? options.anchor : [0.5, 0.5];
            /**
             * @private
             * @type {Array<number>}
             */
            _this.normalizedAnchor_ = null;
            /**
             * @private
             * @type {import("./IconOrigin.js").default}
             */
            _this.anchorOrigin_ =
                options.anchorOrigin !== undefined
                    ? options.anchorOrigin
                    : IconOrigin.TOP_LEFT;
            /**
             * @private
             * @type {import("./IconAnchorUnits.js").default}
             */
            _this.anchorXUnits_ =
                options.anchorXUnits !== undefined
                    ? options.anchorXUnits
                    : IconAnchorUnits.FRACTION;
            /**
             * @private
             * @type {import("./IconAnchorUnits.js").default}
             */
            _this.anchorYUnits_ =
                options.anchorYUnits !== undefined
                    ? options.anchorYUnits
                    : IconAnchorUnits.FRACTION;
            /**
             * @private
             * @type {?string}
             */
            _this.crossOrigin_ =
                options.crossOrigin !== undefined ? options.crossOrigin : null;
            /**
             * @type {HTMLImageElement|HTMLCanvasElement}
             */
            var image = options.img !== undefined ? options.img : null;
            /**
             * @private
             * @type {import("../size.js").Size|undefined}
             */
            _this.imgSize_ = options.imgSize;
            /**
             * @type {string|undefined}
             */
            var src = options.src;
            assert(!(src !== undefined && image), 4); // `image` and `src` cannot be provided at the same time
            assert(!image || (image && _this.imgSize_), 5); // `imgSize` must be set when `image` is provided
            if ((src === undefined || src.length === 0) && image) {
                src = /** @type {HTMLImageElement} */ (image).src || getUid(image);
            }
            assert(src !== undefined && src.length > 0, 6); // A defined and non-empty `src` or `image` must be provided
            /**
             * @type {import("../ImageState.js").default}
             */
            var imageState = options.src !== undefined ? ImageState.IDLE : ImageState.LOADED;
            /**
             * @private
             * @type {import("../color.js").Color}
             */
            _this.color_ = options.color !== undefined ? asArray(options.color) : null;
            /**
             * @private
             * @type {import("./IconImage.js").default}
             */
            _this.iconImage_ = get(image, 
            /** @type {string} */ (src), _this.imgSize_ !== undefined ? _this.imgSize_ : null, _this.crossOrigin_, imageState, _this.color_);
            /**
             * @private
             * @type {Array<number>}
             */
            _this.offset_ = options.offset !== undefined ? options.offset : [0, 0];
            /**
             * @private
             * @type {import("./IconOrigin.js").default}
             */
            _this.offsetOrigin_ =
                options.offsetOrigin !== undefined
                    ? options.offsetOrigin
                    : IconOrigin.TOP_LEFT;
            /**
             * @private
             * @type {Array<number>}
             */
            _this.origin_ = null;
            /**
             * @private
             * @type {import("../size.js").Size}
             */
            _this.size_ = options.size !== undefined ? options.size : null;
            return _this;
        }
        /**
         * Clones the style. The underlying Image/HTMLCanvasElement is not cloned.
         * @return {Icon} The cloned style.
         * @api
         */
        Icon.prototype.clone = function () {
            var scale = this.getScale();
            return new Icon({
                anchor: this.anchor_.slice(),
                anchorOrigin: this.anchorOrigin_,
                anchorXUnits: this.anchorXUnits_,
                anchorYUnits: this.anchorYUnits_,
                color: this.color_ && this.color_.slice
                    ? this.color_.slice()
                    : this.color_ || undefined,
                crossOrigin: this.crossOrigin_,
                imgSize: this.imgSize_,
                offset: this.offset_.slice(),
                offsetOrigin: this.offsetOrigin_,
                opacity: this.getOpacity(),
                rotateWithView: this.getRotateWithView(),
                rotation: this.getRotation(),
                scale: Array.isArray(scale) ? scale.slice() : scale,
                size: this.size_ !== null ? this.size_.slice() : undefined,
                src: this.getSrc(),
                displacement: this.getDisplacement().slice(),
                declutterMode: this.getDeclutterMode(),
            });
        };
        /**
         * Get the anchor point in pixels. The anchor determines the center point for the
         * symbolizer.
         * @return {Array<number>} Anchor.
         * @api
         */
        Icon.prototype.getAnchor = function () {
            var anchor = this.normalizedAnchor_;
            if (!anchor) {
                anchor = this.anchor_;
                var size = this.getSize();
                if (this.anchorXUnits_ == IconAnchorUnits.FRACTION ||
                    this.anchorYUnits_ == IconAnchorUnits.FRACTION) {
                    if (!size) {
                        return null;
                    }
                    anchor = this.anchor_.slice();
                    if (this.anchorXUnits_ == IconAnchorUnits.FRACTION) {
                        anchor[0] *= size[0];
                    }
                    if (this.anchorYUnits_ == IconAnchorUnits.FRACTION) {
                        anchor[1] *= size[1];
                    }
                }
                if (this.anchorOrigin_ != IconOrigin.TOP_LEFT) {
                    if (!size) {
                        return null;
                    }
                    if (anchor === this.anchor_) {
                        anchor = this.anchor_.slice();
                    }
                    if (this.anchorOrigin_ == IconOrigin.TOP_RIGHT ||
                        this.anchorOrigin_ == IconOrigin.BOTTOM_RIGHT) {
                        anchor[0] = -anchor[0] + size[0];
                    }
                    if (this.anchorOrigin_ == IconOrigin.BOTTOM_LEFT ||
                        this.anchorOrigin_ == IconOrigin.BOTTOM_RIGHT) {
                        anchor[1] = -anchor[1] + size[1];
                    }
                }
                this.normalizedAnchor_ = anchor;
            }
            var displacement = this.getDisplacement();
            return [anchor[0] - displacement[0], anchor[1] + displacement[1]];
        };
        /**
         * Set the anchor point. The anchor determines the center point for the
         * symbolizer.
         *
         * @param {Array<number>} anchor Anchor.
         * @api
         */
        Icon.prototype.setAnchor = function (anchor) {
            this.anchor_ = anchor;
            this.normalizedAnchor_ = null;
        };
        /**
         * Get the icon color.
         * @return {import("../color.js").Color} Color.
         * @api
         */
        Icon.prototype.getColor = function () {
            return this.color_;
        };
        /**
         * Get the image icon.
         * @param {number} pixelRatio Pixel ratio.
         * @return {HTMLImageElement|HTMLCanvasElement} Image or Canvas element.
         * @api
         */
        Icon.prototype.getImage = function (pixelRatio) {
            return this.iconImage_.getImage(pixelRatio);
        };
        /**
         * Get the pixel ratio.
         * @param {number} pixelRatio Pixel ratio.
         * @return {number} The pixel ratio of the image.
         * @api
         */
        Icon.prototype.getPixelRatio = function (pixelRatio) {
            return this.iconImage_.getPixelRatio(pixelRatio);
        };
        /**
         * @return {import("../size.js").Size} Image size.
         */
        Icon.prototype.getImageSize = function () {
            return this.iconImage_.getSize();
        };
        /**
         * @return {import("../ImageState.js").default} Image state.
         */
        Icon.prototype.getImageState = function () {
            return this.iconImage_.getImageState();
        };
        /**
         * @return {HTMLImageElement|HTMLCanvasElement} Image element.
         */
        Icon.prototype.getHitDetectionImage = function () {
            return this.iconImage_.getHitDetectionImage();
        };
        /**
         * Get the origin of the symbolizer.
         * @return {Array<number>} Origin.
         * @api
         */
        Icon.prototype.getOrigin = function () {
            if (this.origin_) {
                return this.origin_;
            }
            var offset = this.offset_;
            if (this.offsetOrigin_ != IconOrigin.TOP_LEFT) {
                var size = this.getSize();
                var iconImageSize = this.iconImage_.getSize();
                if (!size || !iconImageSize) {
                    return null;
                }
                offset = offset.slice();
                if (this.offsetOrigin_ == IconOrigin.TOP_RIGHT ||
                    this.offsetOrigin_ == IconOrigin.BOTTOM_RIGHT) {
                    offset[0] = iconImageSize[0] - size[0] - offset[0];
                }
                if (this.offsetOrigin_ == IconOrigin.BOTTOM_LEFT ||
                    this.offsetOrigin_ == IconOrigin.BOTTOM_RIGHT) {
                    offset[1] = iconImageSize[1] - size[1] - offset[1];
                }
            }
            this.origin_ = offset;
            return this.origin_;
        };
        /**
         * Get the image URL.
         * @return {string|undefined} Image src.
         * @api
         */
        Icon.prototype.getSrc = function () {
            return this.iconImage_.getSrc();
        };
        /**
         * Get the size of the icon (in pixels).
         * @return {import("../size.js").Size} Image size.
         * @api
         */
        Icon.prototype.getSize = function () {
            return !this.size_ ? this.iconImage_.getSize() : this.size_;
        };
        /**
         * @param {function(import("../events/Event.js").default): void} listener Listener function.
         */
        Icon.prototype.listenImageChange = function (listener) {
            this.iconImage_.addEventListener(EventType.CHANGE, listener);
        };
        /**
         * Load not yet loaded URI.
         * When rendering a feature with an icon style, the vector renderer will
         * automatically call this method. However, you might want to call this
         * method yourself for preloading or other purposes.
         * @api
         */
        Icon.prototype.load = function () {
            this.iconImage_.load();
        };
        /**
         * @param {function(import("../events/Event.js").default): void} listener Listener function.
         */
        Icon.prototype.unlistenImageChange = function (listener) {
            this.iconImage_.removeEventListener(EventType.CHANGE, listener);
        };
        return Icon;
    }(ImageStyle$1));
    var Icon$1 = Icon;

    /**
     * @module ol/render/canvas/hitdetect
     */
    var HIT_DETECT_RESOLUTION = 0.5;
    /**
     * @param {import("../../size.js").Size} size Canvas size in css pixels.
     * @param {Array<import("../../transform.js").Transform>} transforms Transforms
     * for rendering features to all worlds of the viewport, from coordinates to css
     * pixels.
     * @param {Array<import("../../Feature.js").FeatureLike>} features
     * Features to consider for hit detection.
     * @param {import("../../style/Style.js").StyleFunction|undefined} styleFunction
     * Layer style function.
     * @param {import("../../extent.js").Extent} extent Extent.
     * @param {number} resolution Resolution.
     * @param {number} rotation Rotation.
     * @return {ImageData} Hit detection image data.
     */
    function createHitDetectionImageData(size, transforms, features, styleFunction, extent, resolution, rotation) {
        var width = size[0] * HIT_DETECT_RESOLUTION;
        var height = size[1] * HIT_DETECT_RESOLUTION;
        var context = createCanvasContext2D(width, height);
        context.imageSmoothingEnabled = false;
        var canvas = context.canvas;
        var renderer = new CanvasImmediateRenderer$1(context, HIT_DETECT_RESOLUTION, extent, null, rotation);
        var featureCount = features.length;
        // Stretch hit detection index to use the whole available color range
        var indexFactor = Math.floor((256 * 256 * 256 - 1) / featureCount);
        var featuresByZIndex = {};
        for (var i = 1; i <= featureCount; ++i) {
            var feature = features[i - 1];
            var featureStyleFunction = feature.getStyleFunction() || styleFunction;
            if (!styleFunction) {
                continue;
            }
            var styles = featureStyleFunction(feature, resolution);
            if (!styles) {
                continue;
            }
            if (!Array.isArray(styles)) {
                styles = [styles];
            }
            var index = i * indexFactor;
            var color = '#' + ('000000' + index.toString(16)).slice(-6);
            for (var j = 0, jj = styles.length; j < jj; ++j) {
                var originalStyle = styles[j];
                var geometry = originalStyle.getGeometryFunction()(feature);
                if (!geometry || !intersects$1(extent, geometry.getExtent())) {
                    continue;
                }
                var style = originalStyle.clone();
                var fill = style.getFill();
                if (fill) {
                    fill.setColor(color);
                }
                var stroke = style.getStroke();
                if (stroke) {
                    stroke.setColor(color);
                    stroke.setLineDash(null);
                }
                style.setText(undefined);
                var image = originalStyle.getImage();
                if (image && image.getOpacity() !== 0) {
                    var imgSize = image.getImageSize();
                    if (!imgSize) {
                        continue;
                    }
                    var imgContext = createCanvasContext2D(imgSize[0], imgSize[1], undefined, { alpha: false });
                    var img = imgContext.canvas;
                    imgContext.fillStyle = color;
                    imgContext.fillRect(0, 0, img.width, img.height);
                    style.setImage(new Icon$1({
                        img: img,
                        imgSize: imgSize,
                        anchor: image.getAnchor(),
                        anchorXUnits: IconAnchorUnits.PIXELS,
                        anchorYUnits: IconAnchorUnits.PIXELS,
                        offset: image.getOrigin(),
                        opacity: 1,
                        size: image.getSize(),
                        scale: image.getScale(),
                        rotation: image.getRotation(),
                        rotateWithView: image.getRotateWithView(),
                    }));
                }
                var zIndex = style.getZIndex() || 0;
                var byGeometryType = featuresByZIndex[zIndex];
                if (!byGeometryType) {
                    byGeometryType = {};
                    featuresByZIndex[zIndex] = byGeometryType;
                    byGeometryType['Polygon'] = [];
                    byGeometryType['Circle'] = [];
                    byGeometryType['LineString'] = [];
                    byGeometryType['Point'] = [];
                }
                byGeometryType[geometry.getType().replace('Multi', '')].push(geometry, style);
            }
        }
        var zIndexKeys = Object.keys(featuresByZIndex)
            .map(Number)
            .sort(numberSafeCompareFunction);
        for (var i = 0, ii = zIndexKeys.length; i < ii; ++i) {
            var byGeometryType = featuresByZIndex[zIndexKeys[i]];
            for (var type in byGeometryType) {
                var geomAndStyle = byGeometryType[type];
                for (var j = 0, jj = geomAndStyle.length; j < jj; j += 2) {
                    renderer.setStyle(geomAndStyle[j + 1]);
                    for (var k = 0, kk = transforms.length; k < kk; ++k) {
                        renderer.setTransform(transforms[k]);
                        renderer.drawGeometry(geomAndStyle[j]);
                    }
                }
            }
        }
        return context.getImageData(0, 0, canvas.width, canvas.height);
    }
    /**
     * @param {import("../../pixel").Pixel} pixel Pixel coordinate on the hit
     * detection canvas in css pixels.
     * @param {Array<import("../../Feature").FeatureLike>} features Features. Has to
     * match the `features` array that was passed to `createHitDetectionImageData()`.
     * @param {ImageData} imageData Hit detection image data generated by
     * `createHitDetectionImageData()`.
     * @return {Array<import("../../Feature").FeatureLike>} features Features.
     */
    function hitDetect(pixel, features, imageData) {
        var resultFeatures = [];
        if (imageData) {
            var x = Math.floor(Math.round(pixel[0]) * HIT_DETECT_RESOLUTION);
            var y = Math.floor(Math.round(pixel[1]) * HIT_DETECT_RESOLUTION);
            // The pixel coordinate is clamped down to the hit-detect canvas' size to account
            // for browsers returning coordinates slightly larger than the actual canvas size
            // due to a non-integer pixel ratio.
            var index = (clamp(x, 0, imageData.width - 1) +
                clamp(y, 0, imageData.height - 1) * imageData.width) *
                4;
            var r = imageData.data[index];
            var g = imageData.data[index + 1];
            var b = imageData.data[index + 2];
            var i = b + 256 * (g + 256 * r);
            var indexFactor = Math.floor((256 * 256 * 256 - 1) / features.length);
            if (i && i % indexFactor === 0) {
                resultFeatures.push(features[i / indexFactor - 1]);
            }
        }
        return resultFeatures;
    }

    /**
     * @module ol/renderer/vector
     */
    /**
     * Feature callback. The callback will be called with three arguments. The first
     * argument is one {@link module:ol/Feature~Feature feature} or {@link module:ol/render/Feature~RenderFeature render feature}
     * at the pixel, the second is the {@link module:ol/layer/Layer~Layer layer} of the feature and will be null for
     * unmanaged layers. The third is the {@link module:ol/geom/SimpleGeometry~SimpleGeometry} of the feature. For features
     * with a GeometryCollection geometry, it will be the first detected geometry from the collection.
     * @template T
     * @typedef {function(import("../Feature.js").FeatureLike, import("../layer/Layer.js").default<import("../source/Source").default>, import("../geom/SimpleGeometry.js").default): T} FeatureCallback
     */
    /**
     * Tolerance for geometry simplification in device pixels.
     * @type {number}
     */
    var SIMPLIFY_TOLERANCE = 0.5;
    /**
     * @const
     * @type {Object<import("../geom/Geometry.js").Type,
     *                function(import("../render/canvas/BuilderGroup.js").default, import("../geom/Geometry.js").default,
     *                         import("../style/Style.js").default, Object): void>}
     */
    var GEOMETRY_RENDERERS = {
        'Point': renderPointGeometry,
        'LineString': renderLineStringGeometry,
        'Polygon': renderPolygonGeometry,
        'MultiPoint': renderMultiPointGeometry,
        'MultiLineString': renderMultiLineStringGeometry,
        'MultiPolygon': renderMultiPolygonGeometry,
        'GeometryCollection': renderGeometryCollectionGeometry,
        'Circle': renderCircleGeometry,
    };
    /**
     * @param {import("../Feature.js").FeatureLike} feature1 Feature 1.
     * @param {import("../Feature.js").FeatureLike} feature2 Feature 2.
     * @return {number} Order.
     */
    function defaultOrder(feature1, feature2) {
        return parseInt(getUid(feature1), 10) - parseInt(getUid(feature2), 10);
    }
    /**
     * @param {number} resolution Resolution.
     * @param {number} pixelRatio Pixel ratio.
     * @return {number} Squared pixel tolerance.
     */
    function getSquaredTolerance(resolution, pixelRatio) {
        var tolerance = getTolerance(resolution, pixelRatio);
        return tolerance * tolerance;
    }
    /**
     * @param {number} resolution Resolution.
     * @param {number} pixelRatio Pixel ratio.
     * @return {number} Pixel tolerance.
     */
    function getTolerance(resolution, pixelRatio) {
        return (SIMPLIFY_TOLERANCE * resolution) / pixelRatio;
    }
    /**
     * @param {import("../render/canvas/BuilderGroup.js").default} builderGroup Builder group.
     * @param {import("../geom/Circle.js").default} geometry Geometry.
     * @param {import("../style/Style.js").default} style Style.
     * @param {import("../Feature.js").default} feature Feature.
     * @param {import("../render/canvas/BuilderGroup.js").default} [opt_declutterBuilderGroup] Builder for decluttering.
     */
    function renderCircleGeometry(builderGroup, geometry, style, feature, opt_declutterBuilderGroup) {
        var fillStyle = style.getFill();
        var strokeStyle = style.getStroke();
        if (fillStyle || strokeStyle) {
            var circleReplay = builderGroup.getBuilder(style.getZIndex(), 'Circle');
            circleReplay.setFillStrokeStyle(fillStyle, strokeStyle);
            circleReplay.drawCircle(geometry, feature);
        }
        var textStyle = style.getText();
        if (textStyle && textStyle.getText()) {
            var textReplay = (opt_declutterBuilderGroup || builderGroup).getBuilder(style.getZIndex(), 'Text');
            textReplay.setTextStyle(textStyle);
            textReplay.drawText(geometry, feature);
        }
    }
    /**
     * @param {import("../render/canvas/BuilderGroup.js").default} replayGroup Replay group.
     * @param {import("../Feature.js").FeatureLike} feature Feature.
     * @param {import("../style/Style.js").default} style Style.
     * @param {number} squaredTolerance Squared tolerance.
     * @param {function(import("../events/Event.js").default): void} listener Listener function.
     * @param {import("../proj.js").TransformFunction} [opt_transform] Transform from user to view projection.
     * @param {import("../render/canvas/BuilderGroup.js").default} [opt_declutterBuilderGroup] Builder for decluttering.
     * @return {boolean} `true` if style is loading.
     */
    function renderFeature(replayGroup, feature, style, squaredTolerance, listener, opt_transform, opt_declutterBuilderGroup) {
        var loading = false;
        var imageStyle = style.getImage();
        if (imageStyle) {
            var imageState = imageStyle.getImageState();
            if (imageState == ImageState.LOADED || imageState == ImageState.ERROR) {
                imageStyle.unlistenImageChange(listener);
            }
            else {
                if (imageState == ImageState.IDLE) {
                    imageStyle.load();
                }
                imageStyle.listenImageChange(listener);
                loading = true;
            }
        }
        renderFeatureInternal(replayGroup, feature, style, squaredTolerance, opt_transform, opt_declutterBuilderGroup);
        return loading;
    }
    /**
     * @param {import("../render/canvas/BuilderGroup.js").default} replayGroup Replay group.
     * @param {import("../Feature.js").FeatureLike} feature Feature.
     * @param {import("../style/Style.js").default} style Style.
     * @param {number} squaredTolerance Squared tolerance.
     * @param {import("../proj.js").TransformFunction} [opt_transform] Optional transform function.
     * @param {import("../render/canvas/BuilderGroup.js").default} [opt_declutterBuilderGroup] Builder for decluttering.
     */
    function renderFeatureInternal(replayGroup, feature, style, squaredTolerance, opt_transform, opt_declutterBuilderGroup) {
        var geometry = style.getGeometryFunction()(feature);
        if (!geometry) {
            return;
        }
        var simplifiedGeometry = geometry.simplifyTransformed(squaredTolerance, opt_transform);
        var renderer = style.getRenderer();
        if (renderer) {
            renderGeometry(replayGroup, simplifiedGeometry, style, feature);
        }
        else {
            var geometryRenderer = GEOMETRY_RENDERERS[simplifiedGeometry.getType()];
            geometryRenderer(replayGroup, simplifiedGeometry, style, feature, opt_declutterBuilderGroup);
        }
    }
    /**
     * @param {import("../render/canvas/BuilderGroup.js").default} replayGroup Replay group.
     * @param {import("../geom/Geometry.js").default|import("../render/Feature.js").default} geometry Geometry.
     * @param {import("../style/Style.js").default} style Style.
     * @param {import("../Feature.js").FeatureLike} feature Feature.
     */
    function renderGeometry(replayGroup, geometry, style, feature) {
        if (geometry.getType() == 'GeometryCollection') {
            var geometries = 
            /** @type {import("../geom/GeometryCollection.js").default} */ (geometry).getGeometries();
            for (var i = 0, ii = geometries.length; i < ii; ++i) {
                renderGeometry(replayGroup, geometries[i], style, feature);
            }
            return;
        }
        var replay = replayGroup.getBuilder(style.getZIndex(), 'Default');
        replay.drawCustom(
        /** @type {import("../geom/SimpleGeometry.js").default} */ (geometry), feature, style.getRenderer(), style.getHitDetectionRenderer());
    }
    /**
     * @param {import("../render/canvas/BuilderGroup.js").default} replayGroup Replay group.
     * @param {import("../geom/GeometryCollection.js").default} geometry Geometry.
     * @param {import("../style/Style.js").default} style Style.
     * @param {import("../Feature.js").default} feature Feature.
     * @param {import("../render/canvas/BuilderGroup.js").default} [opt_declutterBuilderGroup] Builder for decluttering.
     */
    function renderGeometryCollectionGeometry(replayGroup, geometry, style, feature, opt_declutterBuilderGroup) {
        var geometries = geometry.getGeometriesArray();
        var i, ii;
        for (i = 0, ii = geometries.length; i < ii; ++i) {
            var geometryRenderer = GEOMETRY_RENDERERS[geometries[i].getType()];
            geometryRenderer(replayGroup, geometries[i], style, feature, opt_declutterBuilderGroup);
        }
    }
    /**
     * @param {import("../render/canvas/BuilderGroup.js").default} builderGroup Replay group.
     * @param {import("../geom/LineString.js").default|import("../render/Feature.js").default} geometry Geometry.
     * @param {import("../style/Style.js").default} style Style.
     * @param {import("../Feature.js").FeatureLike} feature Feature.
     * @param {import("../render/canvas/BuilderGroup.js").default} [opt_declutterBuilderGroup] Builder for decluttering.
     */
    function renderLineStringGeometry(builderGroup, geometry, style, feature, opt_declutterBuilderGroup) {
        var strokeStyle = style.getStroke();
        if (strokeStyle) {
            var lineStringReplay = builderGroup.getBuilder(style.getZIndex(), 'LineString');
            lineStringReplay.setFillStrokeStyle(null, strokeStyle);
            lineStringReplay.drawLineString(geometry, feature);
        }
        var textStyle = style.getText();
        if (textStyle && textStyle.getText()) {
            var textReplay = (opt_declutterBuilderGroup || builderGroup).getBuilder(style.getZIndex(), 'Text');
            textReplay.setTextStyle(textStyle);
            textReplay.drawText(geometry, feature);
        }
    }
    /**
     * @param {import("../render/canvas/BuilderGroup.js").default} builderGroup Replay group.
     * @param {import("../geom/MultiLineString.js").default|import("../render/Feature.js").default} geometry Geometry.
     * @param {import("../style/Style.js").default} style Style.
     * @param {import("../Feature.js").FeatureLike} feature Feature.
     * @param {import("../render/canvas/BuilderGroup.js").default} [opt_declutterBuilderGroup] Builder for decluttering.
     */
    function renderMultiLineStringGeometry(builderGroup, geometry, style, feature, opt_declutterBuilderGroup) {
        var strokeStyle = style.getStroke();
        if (strokeStyle) {
            var lineStringReplay = builderGroup.getBuilder(style.getZIndex(), 'LineString');
            lineStringReplay.setFillStrokeStyle(null, strokeStyle);
            lineStringReplay.drawMultiLineString(geometry, feature);
        }
        var textStyle = style.getText();
        if (textStyle && textStyle.getText()) {
            var textReplay = (opt_declutterBuilderGroup || builderGroup).getBuilder(style.getZIndex(), 'Text');
            textReplay.setTextStyle(textStyle);
            textReplay.drawText(geometry, feature);
        }
    }
    /**
     * @param {import("../render/canvas/BuilderGroup.js").default} builderGroup Replay group.
     * @param {import("../geom/MultiPolygon.js").default} geometry Geometry.
     * @param {import("../style/Style.js").default} style Style.
     * @param {import("../Feature.js").default} feature Feature.
     * @param {import("../render/canvas/BuilderGroup.js").default} [opt_declutterBuilderGroup] Builder for decluttering.
     */
    function renderMultiPolygonGeometry(builderGroup, geometry, style, feature, opt_declutterBuilderGroup) {
        var fillStyle = style.getFill();
        var strokeStyle = style.getStroke();
        if (strokeStyle || fillStyle) {
            var polygonReplay = builderGroup.getBuilder(style.getZIndex(), 'Polygon');
            polygonReplay.setFillStrokeStyle(fillStyle, strokeStyle);
            polygonReplay.drawMultiPolygon(geometry, feature);
        }
        var textStyle = style.getText();
        if (textStyle && textStyle.getText()) {
            var textReplay = (opt_declutterBuilderGroup || builderGroup).getBuilder(style.getZIndex(), 'Text');
            textReplay.setTextStyle(textStyle);
            textReplay.drawText(geometry, feature);
        }
    }
    /**
     * @param {import("../render/canvas/BuilderGroup.js").default} builderGroup Replay group.
     * @param {import("../geom/Point.js").default|import("../render/Feature.js").default} geometry Geometry.
     * @param {import("../style/Style.js").default} style Style.
     * @param {import("../Feature.js").FeatureLike} feature Feature.
     * @param {import("../render/canvas/BuilderGroup.js").default} [opt_declutterBuilderGroup] Builder for decluttering.
     */
    function renderPointGeometry(builderGroup, geometry, style, feature, opt_declutterBuilderGroup) {
        var imageStyle = style.getImage();
        var textStyle = style.getText();
        /** @type {import("../render/canvas.js").DeclutterImageWithText} */
        var declutterImageWithText;
        if (imageStyle) {
            if (imageStyle.getImageState() != ImageState.LOADED) {
                return;
            }
            var imageBuilderGroup = builderGroup;
            if (opt_declutterBuilderGroup) {
                var declutterMode = imageStyle.getDeclutterMode();
                if (declutterMode !== 'none') {
                    imageBuilderGroup = opt_declutterBuilderGroup;
                    if (declutterMode === 'obstacle') {
                        // draw in non-declutter group:
                        var imageReplay_1 = builderGroup.getBuilder(style.getZIndex(), 'Image');
                        imageReplay_1.setImageStyle(imageStyle, declutterImageWithText);
                        imageReplay_1.drawPoint(geometry, feature);
                    }
                    else if (textStyle && textStyle.getText()) {
                        declutterImageWithText = {};
                    }
                }
            }
            var imageReplay = imageBuilderGroup.getBuilder(style.getZIndex(), 'Image');
            imageReplay.setImageStyle(imageStyle, declutterImageWithText);
            imageReplay.drawPoint(geometry, feature);
        }
        if (textStyle && textStyle.getText()) {
            var textBuilderGroup = builderGroup;
            if (opt_declutterBuilderGroup) {
                textBuilderGroup = opt_declutterBuilderGroup;
            }
            var textReplay = textBuilderGroup.getBuilder(style.getZIndex(), 'Text');
            textReplay.setTextStyle(textStyle, declutterImageWithText);
            textReplay.drawText(geometry, feature);
        }
    }
    /**
     * @param {import("../render/canvas/BuilderGroup.js").default} builderGroup Replay group.
     * @param {import("../geom/MultiPoint.js").default|import("../render/Feature.js").default} geometry Geometry.
     * @param {import("../style/Style.js").default} style Style.
     * @param {import("../Feature.js").FeatureLike} feature Feature.
     * @param {import("../render/canvas/BuilderGroup.js").default} [opt_declutterBuilderGroup] Builder for decluttering.
     */
    function renderMultiPointGeometry(builderGroup, geometry, style, feature, opt_declutterBuilderGroup) {
        var imageStyle = style.getImage();
        var textStyle = style.getText();
        /** @type {import("../render/canvas.js").DeclutterImageWithText} */
        var declutterImageWithText;
        if (imageStyle) {
            if (imageStyle.getImageState() != ImageState.LOADED) {
                return;
            }
            var imageBuilderGroup = builderGroup;
            if (opt_declutterBuilderGroup) {
                var declutterMode = imageStyle.getDeclutterMode();
                if (declutterMode !== 'none') {
                    imageBuilderGroup = opt_declutterBuilderGroup;
                    if (declutterMode === 'obstacle') {
                        // draw in non-declutter group:
                        var imageReplay_2 = builderGroup.getBuilder(style.getZIndex(), 'Image');
                        imageReplay_2.setImageStyle(imageStyle, declutterImageWithText);
                        imageReplay_2.drawMultiPoint(geometry, feature);
                    }
                    else if (textStyle && textStyle.getText()) {
                        declutterImageWithText = {};
                    }
                }
            }
            var imageReplay = imageBuilderGroup.getBuilder(style.getZIndex(), 'Image');
            imageReplay.setImageStyle(imageStyle, declutterImageWithText);
            imageReplay.drawMultiPoint(geometry, feature);
        }
        if (textStyle && textStyle.getText()) {
            var textBuilderGroup = builderGroup;
            if (opt_declutterBuilderGroup) {
                textBuilderGroup = opt_declutterBuilderGroup;
            }
            var textReplay = textBuilderGroup.getBuilder(style.getZIndex(), 'Text');
            textReplay.setTextStyle(textStyle, declutterImageWithText);
            textReplay.drawText(geometry, feature);
        }
    }
    /**
     * @param {import("../render/canvas/BuilderGroup.js").default} builderGroup Replay group.
     * @param {import("../geom/Polygon.js").default|import("../render/Feature.js").default} geometry Geometry.
     * @param {import("../style/Style.js").default} style Style.
     * @param {import("../Feature.js").FeatureLike} feature Feature.
     * @param {import("../render/canvas/BuilderGroup.js").default} [opt_declutterBuilderGroup] Builder for decluttering.
     */
    function renderPolygonGeometry(builderGroup, geometry, style, feature, opt_declutterBuilderGroup) {
        var fillStyle = style.getFill();
        var strokeStyle = style.getStroke();
        if (fillStyle || strokeStyle) {
            var polygonReplay = builderGroup.getBuilder(style.getZIndex(), 'Polygon');
            polygonReplay.setFillStrokeStyle(fillStyle, strokeStyle);
            polygonReplay.drawPolygon(geometry, feature);
        }
        var textStyle = style.getText();
        if (textStyle && textStyle.getText()) {
            var textReplay = (opt_declutterBuilderGroup || builderGroup).getBuilder(style.getZIndex(), 'Text');
            textReplay.setTextStyle(textStyle);
            textReplay.drawText(geometry, feature);
        }
    }

    var __extends$5 = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            if (typeof b !== "function" && b !== null)
                throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * @classdesc
     * Canvas renderer for vector layers.
     * @api
     */
    var CanvasVectorLayerRenderer = /** @class */ (function (_super) {
        __extends$5(CanvasVectorLayerRenderer, _super);
        /**
         * @param {import("../../layer/BaseVector.js").default} vectorLayer Vector layer.
         */
        function CanvasVectorLayerRenderer(vectorLayer) {
            var _this = _super.call(this, vectorLayer) || this;
            /** @private */
            _this.boundHandleStyleImageChange_ = _this.handleStyleImageChange_.bind(_this);
            /**
             * @type {boolean}
             */
            _this.animatingOrInteracting_;
            /**
             * @type {ImageData}
             */
            _this.hitDetectionImageData_ = null;
            /**
             * @type {Array<import("../../Feature.js").default>}
             */
            _this.renderedFeatures_ = null;
            /**
             * @private
             * @type {number}
             */
            _this.renderedRevision_ = -1;
            /**
             * @private
             * @type {number}
             */
            _this.renderedResolution_ = NaN;
            /**
             * @private
             * @type {import("../../extent.js").Extent}
             */
            _this.renderedExtent_ = createEmpty();
            /**
             * @private
             * @type {import("../../extent.js").Extent}
             */
            _this.wrappedRenderedExtent_ = createEmpty();
            /**
             * @private
             * @type {number}
             */
            _this.renderedRotation_;
            /**
             * @private
             * @type {import("../../coordinate").Coordinate}
             */
            _this.renderedCenter_ = null;
            /**
             * @private
             * @type {import("../../proj/Projection").default}
             */
            _this.renderedProjection_ = null;
            /**
             * @private
             * @type {function(import("../../Feature.js").default, import("../../Feature.js").default): number|null}
             */
            _this.renderedRenderOrder_ = null;
            /**
             * @private
             * @type {import("../../render/canvas/ExecutorGroup").default}
             */
            _this.replayGroup_ = null;
            /**
             * A new replay group had to be created by `prepareFrame()`
             * @type {boolean}
             */
            _this.replayGroupChanged = true;
            /**
             * @type {import("../../render/canvas/ExecutorGroup").default}
             */
            _this.declutterExecutorGroup = null;
            /**
             * Clipping to be performed by `renderFrame()`
             * @type {boolean}
             */
            _this.clipping = true;
            /**
             * @private
             * @type {CanvasRenderingContext2D}
             */
            _this.compositionContext_ = null;
            /**
             * @private
             * @type {number}
             */
            _this.opacity_ = 1;
            return _this;
        }
        /**
         * @param {ExecutorGroup} executorGroup Executor group.
         * @param {import("../../PluggableMap.js").FrameState} frameState Frame state.
         * @param {import("rbush").default} [opt_declutterTree] Declutter tree.
         */
        CanvasVectorLayerRenderer.prototype.renderWorlds = function (executorGroup, frameState, opt_declutterTree) {
            var extent = frameState.extent;
            var viewState = frameState.viewState;
            var center = viewState.center;
            var resolution = viewState.resolution;
            var projection = viewState.projection;
            var rotation = viewState.rotation;
            var projectionExtent = projection.getExtent();
            var vectorSource = this.getLayer().getSource();
            var pixelRatio = frameState.pixelRatio;
            var viewHints = frameState.viewHints;
            var snapToPixel = !(viewHints[ViewHint.ANIMATING] || viewHints[ViewHint.INTERACTING]);
            var context = this.compositionContext_;
            var width = Math.round(frameState.size[0] * pixelRatio);
            var height = Math.round(frameState.size[1] * pixelRatio);
            var multiWorld = vectorSource.getWrapX() && projection.canWrapX();
            var worldWidth = multiWorld ? getWidth(projectionExtent) : null;
            var endWorld = multiWorld
                ? Math.ceil((extent[2] - projectionExtent[2]) / worldWidth) + 1
                : 1;
            var world = multiWorld
                ? Math.floor((extent[0] - projectionExtent[0]) / worldWidth)
                : 0;
            do {
                var transform = this.getRenderTransform(center, resolution, rotation, pixelRatio, width, height, world * worldWidth);
                executorGroup.execute(context, 1, transform, rotation, snapToPixel, undefined, opt_declutterTree);
            } while (++world < endWorld);
        };
        CanvasVectorLayerRenderer.prototype.setupCompositionContext_ = function () {
            if (this.opacity_ !== 1) {
                var compositionContext = createCanvasContext2D(this.context.canvas.width, this.context.canvas.height, canvasPool);
                this.compositionContext_ = compositionContext;
            }
            else {
                this.compositionContext_ = this.context;
            }
        };
        CanvasVectorLayerRenderer.prototype.releaseCompositionContext_ = function () {
            if (this.opacity_ !== 1) {
                var alpha = this.context.globalAlpha;
                this.context.globalAlpha = this.opacity_;
                this.context.drawImage(this.compositionContext_.canvas, 0, 0);
                this.context.globalAlpha = alpha;
                releaseCanvas(this.compositionContext_);
                canvasPool.push(this.compositionContext_.canvas);
                this.compositionContext_ = null;
            }
        };
        /**
         * Render declutter items for this layer
         * @param {import("../../PluggableMap.js").FrameState} frameState Frame state.
         */
        CanvasVectorLayerRenderer.prototype.renderDeclutter = function (frameState) {
            if (this.declutterExecutorGroup) {
                this.setupCompositionContext_();
                this.renderWorlds(this.declutterExecutorGroup, frameState, frameState.declutterTree);
                this.releaseCompositionContext_();
            }
        };
        /**
         * Render the layer.
         * @param {import("../../PluggableMap.js").FrameState} frameState Frame state.
         * @param {HTMLElement} target Target that may be used to render content to.
         * @return {HTMLElement} The rendered element.
         */
        CanvasVectorLayerRenderer.prototype.renderFrame = function (frameState, target) {
            var pixelRatio = frameState.pixelRatio;
            var layerState = frameState.layerStatesArray[frameState.layerIndex];
            // set forward and inverse pixel transforms
            makeScale(this.pixelTransform, 1 / pixelRatio, 1 / pixelRatio);
            makeInverse(this.inversePixelTransform, this.pixelTransform);
            var canvasTransform = toString$1(this.pixelTransform);
            this.useContainer(target, canvasTransform, this.getBackground(frameState));
            var context = this.context;
            var canvas = context.canvas;
            var replayGroup = this.replayGroup_;
            var declutterExecutorGroup = this.declutterExecutorGroup;
            if ((!replayGroup || replayGroup.isEmpty()) &&
                (!declutterExecutorGroup || declutterExecutorGroup.isEmpty())) {
                return null;
            }
            // resize and clear
            var width = Math.round(frameState.size[0] * pixelRatio);
            var height = Math.round(frameState.size[1] * pixelRatio);
            if (canvas.width != width || canvas.height != height) {
                canvas.width = width;
                canvas.height = height;
                if (canvas.style.transform !== canvasTransform) {
                    canvas.style.transform = canvasTransform;
                }
            }
            else if (!this.containerReused) {
                context.clearRect(0, 0, width, height);
            }
            this.preRender(context, frameState);
            var viewState = frameState.viewState;
            viewState.projection;
            this.opacity_ = layerState.opacity;
            this.setupCompositionContext_();
            // clipped rendering if layer extent is set
            var clipped = false;
            var render = true;
            if (layerState.extent && this.clipping) {
                var layerExtent = fromUserExtent(layerState.extent);
                render = intersects$1(layerExtent, frameState.extent);
                clipped = render && !containsExtent(layerExtent, frameState.extent);
                if (clipped) {
                    this.clipUnrotated(this.compositionContext_, frameState, layerExtent);
                }
            }
            if (render) {
                this.renderWorlds(replayGroup, frameState);
            }
            if (clipped) {
                this.compositionContext_.restore();
            }
            this.releaseCompositionContext_();
            this.postRender(context, frameState);
            if (this.renderedRotation_ !== viewState.rotation) {
                this.renderedRotation_ = viewState.rotation;
                this.hitDetectionImageData_ = null;
            }
            return this.container;
        };
        /**
         * Asynchronous layer level hit detection.
         * @param {import("../../pixel.js").Pixel} pixel Pixel.
         * @return {Promise<Array<import("../../Feature").default>>} Promise that resolves with an array of features.
         */
        CanvasVectorLayerRenderer.prototype.getFeatures = function (pixel) {
            return new Promise(
            /**
             * @param {function(Array<import("../../Feature").default|import("../../render/Feature").default>): void} resolve Resolver function.
             * @this {CanvasVectorLayerRenderer}
             */
            function (resolve) {
                if (!this.hitDetectionImageData_ && !this.animatingOrInteracting_) {
                    var size = [this.context.canvas.width, this.context.canvas.height];
                    apply(this.pixelTransform, size);
                    var center = this.renderedCenter_;
                    var resolution = this.renderedResolution_;
                    var rotation = this.renderedRotation_;
                    var projection = this.renderedProjection_;
                    var extent = this.wrappedRenderedExtent_;
                    var layer = this.getLayer();
                    var transforms = [];
                    var width = size[0] * HIT_DETECT_RESOLUTION;
                    var height = size[1] * HIT_DETECT_RESOLUTION;
                    transforms.push(this.getRenderTransform(center, resolution, rotation, HIT_DETECT_RESOLUTION, width, height, 0).slice());
                    var source = layer.getSource();
                    var projectionExtent = projection.getExtent();
                    if (source.getWrapX() &&
                        projection.canWrapX() &&
                        !containsExtent(projectionExtent, extent)) {
                        var startX = extent[0];
                        var worldWidth = getWidth(projectionExtent);
                        var world = 0;
                        var offsetX = void 0;
                        while (startX < projectionExtent[0]) {
                            --world;
                            offsetX = worldWidth * world;
                            transforms.push(this.getRenderTransform(center, resolution, rotation, HIT_DETECT_RESOLUTION, width, height, offsetX).slice());
                            startX += worldWidth;
                        }
                        world = 0;
                        startX = extent[2];
                        while (startX > projectionExtent[2]) {
                            ++world;
                            offsetX = worldWidth * world;
                            transforms.push(this.getRenderTransform(center, resolution, rotation, HIT_DETECT_RESOLUTION, width, height, offsetX).slice());
                            startX -= worldWidth;
                        }
                    }
                    this.hitDetectionImageData_ = createHitDetectionImageData(size, transforms, this.renderedFeatures_, layer.getStyleFunction(), extent, resolution, rotation);
                }
                resolve(hitDetect(pixel, this.renderedFeatures_, this.hitDetectionImageData_));
            }.bind(this));
        };
        /**
         * @param {import("../../coordinate.js").Coordinate} coordinate Coordinate.
         * @param {import("../../PluggableMap.js").FrameState} frameState Frame state.
         * @param {number} hitTolerance Hit tolerance in pixels.
         * @param {import("../vector.js").FeatureCallback<T>} callback Feature callback.
         * @param {Array<import("../Map.js").HitMatch<T>>} matches The hit detected matches with tolerance.
         * @return {T|undefined} Callback result.
         * @template T
         */
        CanvasVectorLayerRenderer.prototype.forEachFeatureAtCoordinate = function (coordinate, frameState, hitTolerance, callback, matches) {
            var _this = this;
            if (!this.replayGroup_) {
                return undefined;
            }
            var resolution = frameState.viewState.resolution;
            var rotation = frameState.viewState.rotation;
            var layer = this.getLayer();
            /** @type {!Object<string, import("../Map.js").HitMatch<T>|true>} */
            var features = {};
            /**
             * @param {import("../../Feature.js").FeatureLike} feature Feature.
             * @param {import("../../geom/SimpleGeometry.js").default} geometry Geometry.
             * @param {number} distanceSq The squared distance to the click position
             * @return {T|undefined} Callback result.
             */
            var featureCallback = function (feature, geometry, distanceSq) {
                var key = getUid(feature);
                var match = features[key];
                if (!match) {
                    if (distanceSq === 0) {
                        features[key] = true;
                        return callback(feature, layer, geometry);
                    }
                    matches.push((features[key] = {
                        feature: feature,
                        layer: layer,
                        geometry: geometry,
                        distanceSq: distanceSq,
                        callback: callback,
                    }));
                }
                else if (match !== true && distanceSq < match.distanceSq) {
                    if (distanceSq === 0) {
                        features[key] = true;
                        matches.splice(matches.lastIndexOf(match), 1);
                        return callback(feature, layer, geometry);
                    }
                    match.geometry = geometry;
                    match.distanceSq = distanceSq;
                }
                return undefined;
            };
            var result;
            var executorGroups = [this.replayGroup_];
            if (this.declutterExecutorGroup) {
                executorGroups.push(this.declutterExecutorGroup);
            }
            executorGroups.some(function (executorGroup) {
                return (result = executorGroup.forEachFeatureAtCoordinate(coordinate, resolution, rotation, hitTolerance, featureCallback, executorGroup === _this.declutterExecutorGroup &&
                    frameState.declutterTree
                    ? frameState.declutterTree.all().map(function (item) { return item.value; })
                    : null));
            });
            return result;
        };
        /**
         * Perform action necessary to get the layer rendered after new fonts have loaded
         */
        CanvasVectorLayerRenderer.prototype.handleFontsChanged = function () {
            var layer = this.getLayer();
            if (layer.getVisible() && this.replayGroup_) {
                layer.changed();
            }
        };
        /**
         * Handle changes in image style state.
         * @param {import("../../events/Event.js").default} event Image style change event.
         * @private
         */
        CanvasVectorLayerRenderer.prototype.handleStyleImageChange_ = function (event) {
            this.renderIfReadyAndVisible();
        };
        /**
         * Determine whether render should be called.
         * @param {import("../../PluggableMap.js").FrameState} frameState Frame state.
         * @return {boolean} Layer is ready to be rendered.
         */
        CanvasVectorLayerRenderer.prototype.prepareFrame = function (frameState) {
            var vectorLayer = this.getLayer();
            var vectorSource = vectorLayer.getSource();
            if (!vectorSource) {
                return false;
            }
            var animating = frameState.viewHints[ViewHint.ANIMATING];
            var interacting = frameState.viewHints[ViewHint.INTERACTING];
            var updateWhileAnimating = vectorLayer.getUpdateWhileAnimating();
            var updateWhileInteracting = vectorLayer.getUpdateWhileInteracting();
            if ((this.ready && !updateWhileAnimating && animating) ||
                (!updateWhileInteracting && interacting)) {
                this.animatingOrInteracting_ = true;
                return true;
            }
            this.animatingOrInteracting_ = false;
            var frameStateExtent = frameState.extent;
            var viewState = frameState.viewState;
            var projection = viewState.projection;
            var resolution = viewState.resolution;
            var pixelRatio = frameState.pixelRatio;
            var vectorLayerRevision = vectorLayer.getRevision();
            var vectorLayerRenderBuffer = vectorLayer.getRenderBuffer();
            var vectorLayerRenderOrder = vectorLayer.getRenderOrder();
            if (vectorLayerRenderOrder === undefined) {
                vectorLayerRenderOrder = defaultOrder;
            }
            var center = viewState.center.slice();
            var extent = buffer(frameStateExtent, vectorLayerRenderBuffer * resolution);
            var renderedExtent = extent.slice();
            var loadExtents = [extent.slice()];
            var projectionExtent = projection.getExtent();
            if (vectorSource.getWrapX() &&
                projection.canWrapX() &&
                !containsExtent(projectionExtent, frameState.extent)) {
                // For the replay group, we need an extent that intersects the real world
                // (-180° to +180°). To support geometries in a coordinate range from -540°
                // to +540°, we add at least 1 world width on each side of the projection
                // extent. If the viewport is wider than the world, we need to add half of
                // the viewport width to make sure we cover the whole viewport.
                var worldWidth = getWidth(projectionExtent);
                var gutter = Math.max(getWidth(extent) / 2, worldWidth);
                extent[0] = projectionExtent[0] - gutter;
                extent[2] = projectionExtent[2] + gutter;
                wrapX(center, projection);
                var loadExtent = wrapX$1(loadExtents[0], projection);
                // If the extent crosses the date line, we load data for both edges of the worlds
                if (loadExtent[0] < projectionExtent[0] &&
                    loadExtent[2] < projectionExtent[2]) {
                    loadExtents.push([
                        loadExtent[0] + worldWidth,
                        loadExtent[1],
                        loadExtent[2] + worldWidth,
                        loadExtent[3],
                    ]);
                }
                else if (loadExtent[0] > projectionExtent[0] &&
                    loadExtent[2] > projectionExtent[2]) {
                    loadExtents.push([
                        loadExtent[0] - worldWidth,
                        loadExtent[1],
                        loadExtent[2] - worldWidth,
                        loadExtent[3],
                    ]);
                }
            }
            if (this.ready &&
                this.renderedResolution_ == resolution &&
                this.renderedRevision_ == vectorLayerRevision &&
                this.renderedRenderOrder_ == vectorLayerRenderOrder &&
                containsExtent(this.wrappedRenderedExtent_, extent)) {
                if (!equals$1(this.renderedExtent_, renderedExtent)) {
                    this.hitDetectionImageData_ = null;
                    this.renderedExtent_ = renderedExtent;
                }
                this.renderedCenter_ = center;
                this.replayGroupChanged = false;
                return true;
            }
            this.replayGroup_ = null;
            var replayGroup = new CanvasBuilderGroup(getTolerance(resolution, pixelRatio), extent, resolution, pixelRatio);
            var declutterBuilderGroup;
            if (this.getLayer().getDeclutter()) {
                declutterBuilderGroup = new CanvasBuilderGroup(getTolerance(resolution, pixelRatio), extent, resolution, pixelRatio);
            }
            var userTransform;
            var i, ii; {
                for (var i = 0, ii = loadExtents.length; i < ii; ++i) {
                    vectorSource.loadFeatures(loadExtents[i], resolution, projection);
                }
            }
            var squaredTolerance = getSquaredTolerance(resolution, pixelRatio);
            var ready = true;
            var render = 
            /**
             * @param {import("../../Feature.js").default} feature Feature.
             * @this {CanvasVectorLayerRenderer}
             */
            function (feature) {
                var styles;
                var styleFunction = feature.getStyleFunction() || vectorLayer.getStyleFunction();
                if (styleFunction) {
                    styles = styleFunction(feature, resolution);
                }
                if (styles) {
                    var dirty = this.renderFeature(feature, squaredTolerance, styles, replayGroup, userTransform, declutterBuilderGroup);
                    ready = ready && !dirty;
                }
            }.bind(this);
            var userExtent = toUserExtent(extent);
            /** @type {Array<import("../../Feature.js").default>} */
            var features = vectorSource.getFeaturesInExtent(userExtent);
            if (vectorLayerRenderOrder) {
                features.sort(vectorLayerRenderOrder);
            }
            for (var i = 0, ii = features.length; i < ii; ++i) {
                render(features[i]);
            }
            this.renderedFeatures_ = features;
            this.ready = ready;
            var replayGroupInstructions = replayGroup.finish();
            var executorGroup = new ExecutorGroup$1(extent, resolution, pixelRatio, vectorSource.getOverlaps(), replayGroupInstructions, vectorLayer.getRenderBuffer());
            if (declutterBuilderGroup) {
                this.declutterExecutorGroup = new ExecutorGroup$1(extent, resolution, pixelRatio, vectorSource.getOverlaps(), declutterBuilderGroup.finish(), vectorLayer.getRenderBuffer());
            }
            this.renderedResolution_ = resolution;
            this.renderedRevision_ = vectorLayerRevision;
            this.renderedRenderOrder_ = vectorLayerRenderOrder;
            this.renderedExtent_ = renderedExtent;
            this.wrappedRenderedExtent_ = extent;
            this.renderedCenter_ = center;
            this.renderedProjection_ = projection;
            this.replayGroup_ = executorGroup;
            this.hitDetectionImageData_ = null;
            this.replayGroupChanged = true;
            return true;
        };
        /**
         * @param {import("../../Feature.js").default} feature Feature.
         * @param {number} squaredTolerance Squared render tolerance.
         * @param {import("../../style/Style.js").default|Array<import("../../style/Style.js").default>} styles The style or array of styles.
         * @param {import("../../render/canvas/BuilderGroup.js").default} builderGroup Builder group.
         * @param {import("../../proj.js").TransformFunction} [opt_transform] Transform from user to view projection.
         * @param {import("../../render/canvas/BuilderGroup.js").default} [opt_declutterBuilderGroup] Builder for decluttering.
         * @return {boolean} `true` if an image is loading.
         */
        CanvasVectorLayerRenderer.prototype.renderFeature = function (feature, squaredTolerance, styles, builderGroup, opt_transform, opt_declutterBuilderGroup) {
            if (!styles) {
                return false;
            }
            var loading = false;
            if (Array.isArray(styles)) {
                for (var i = 0, ii = styles.length; i < ii; ++i) {
                    loading =
                        renderFeature(builderGroup, feature, styles[i], squaredTolerance, this.boundHandleStyleImageChange_, opt_transform, opt_declutterBuilderGroup) || loading;
                }
            }
            else {
                loading = renderFeature(builderGroup, feature, styles, squaredTolerance, this.boundHandleStyleImageChange_, opt_transform, opt_declutterBuilderGroup);
            }
            return loading;
        };
        return CanvasVectorLayerRenderer;
    }(CanvasLayerRenderer$1));
    var CanvasVectorLayerRenderer$1 = CanvasVectorLayerRenderer;

    var __extends$4 = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            if (typeof b !== "function" && b !== null)
                throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * @classdesc
     * Vector data is rendered client-side, as vectors. This layer type provides most accurate rendering
     * even during animations. Points and labels stay upright on rotated views. For very large
     * amounts of vector data, performance may suffer during pan and zoom animations. In this case,
     * try {@link module:ol/layer/VectorImage~VectorImageLayer}.
     *
     * Note that any property set in the options is set as a {@link module:ol/Object~BaseObject}
     * property on the layer object; for example, setting `title: 'My Title'` in the
     * options means that `title` is observable, and has get/set accessors.
     *
     * @template {import("../source/Vector.js").default} VectorSourceType
     * @extends {BaseVectorLayer<VectorSourceType, CanvasVectorLayerRenderer>}
     * @api
     */
    var VectorLayer = /** @class */ (function (_super) {
        __extends$4(VectorLayer, _super);
        /**
         * @param {import("./BaseVector.js").Options<VectorSourceType>} [opt_options] Options.
         */
        function VectorLayer(opt_options) {
            return _super.call(this, opt_options) || this;
        }
        VectorLayer.prototype.createRenderer = function () {
            return new CanvasVectorLayerRenderer$1(this);
        };
        return VectorLayer;
    }(BaseVectorLayer$1));
    var VectorLayer$1 = VectorLayer;

    /**
     * @module ol/structs/RBush
     */
    /**
     * @typedef {Object} Entry
     * @property {number} minX MinX.
     * @property {number} minY MinY.
     * @property {number} maxX MaxX.
     * @property {number} maxY MaxY.
     * @property {Object} [value] Value.
     */
    /**
     * @classdesc
     * Wrapper around the RBush by Vladimir Agafonkin.
     * See https://github.com/mourner/rbush.
     *
     * @template T
     */
    var RBush = /** @class */ (function () {
        /**
         * @param {number} [opt_maxEntries] Max entries.
         */
        function RBush(opt_maxEntries) {
            /**
             * @private
             */
            this.rbush_ = new RBush$2(opt_maxEntries);
            /**
             * A mapping between the objects added to this rbush wrapper
             * and the objects that are actually added to the internal rbush.
             * @private
             * @type {Object<string, Entry>}
             */
            this.items_ = {};
        }
        /**
         * Insert a value into the RBush.
         * @param {import("../extent.js").Extent} extent Extent.
         * @param {T} value Value.
         */
        RBush.prototype.insert = function (extent, value) {
            /** @type {Entry} */
            var item = {
                minX: extent[0],
                minY: extent[1],
                maxX: extent[2],
                maxY: extent[3],
                value: value,
            };
            this.rbush_.insert(item);
            this.items_[getUid(value)] = item;
        };
        /**
         * Bulk-insert values into the RBush.
         * @param {Array<import("../extent.js").Extent>} extents Extents.
         * @param {Array<T>} values Values.
         */
        RBush.prototype.load = function (extents, values) {
            var items = new Array(values.length);
            for (var i = 0, l = values.length; i < l; i++) {
                var extent = extents[i];
                var value = values[i];
                /** @type {Entry} */
                var item = {
                    minX: extent[0],
                    minY: extent[1],
                    maxX: extent[2],
                    maxY: extent[3],
                    value: value,
                };
                items[i] = item;
                this.items_[getUid(value)] = item;
            }
            this.rbush_.load(items);
        };
        /**
         * Remove a value from the RBush.
         * @param {T} value Value.
         * @return {boolean} Removed.
         */
        RBush.prototype.remove = function (value) {
            var uid = getUid(value);
            // get the object in which the value was wrapped when adding to the
            // internal rbush. then use that object to do the removal.
            var item = this.items_[uid];
            delete this.items_[uid];
            return this.rbush_.remove(item) !== null;
        };
        /**
         * Update the extent of a value in the RBush.
         * @param {import("../extent.js").Extent} extent Extent.
         * @param {T} value Value.
         */
        RBush.prototype.update = function (extent, value) {
            var item = this.items_[getUid(value)];
            var bbox = [item.minX, item.minY, item.maxX, item.maxY];
            if (!equals(bbox, extent)) {
                this.remove(value);
                this.insert(extent, value);
            }
        };
        /**
         * Return all values in the RBush.
         * @return {Array<T>} All.
         */
        RBush.prototype.getAll = function () {
            var items = this.rbush_.all();
            return items.map(function (item) {
                return item.value;
            });
        };
        /**
         * Return all values in the given extent.
         * @param {import("../extent.js").Extent} extent Extent.
         * @return {Array<T>} All in extent.
         */
        RBush.prototype.getInExtent = function (extent) {
            /** @type {Entry} */
            var bbox = {
                minX: extent[0],
                minY: extent[1],
                maxX: extent[2],
                maxY: extent[3],
            };
            var items = this.rbush_.search(bbox);
            return items.map(function (item) {
                return item.value;
            });
        };
        /**
         * Calls a callback function with each value in the tree.
         * If the callback returns a truthy value, this value is returned without
         * checking the rest of the tree.
         * @param {function(T): *} callback Callback.
         * @return {*} Callback return value.
         */
        RBush.prototype.forEach = function (callback) {
            return this.forEach_(this.getAll(), callback);
        };
        /**
         * Calls a callback function with each value in the provided extent.
         * @param {import("../extent.js").Extent} extent Extent.
         * @param {function(T): *} callback Callback.
         * @return {*} Callback return value.
         */
        RBush.prototype.forEachInExtent = function (extent, callback) {
            return this.forEach_(this.getInExtent(extent), callback);
        };
        /**
         * @param {Array<T>} values Values.
         * @param {function(T): *} callback Callback.
         * @private
         * @return {*} Callback return value.
         */
        RBush.prototype.forEach_ = function (values, callback) {
            var result;
            for (var i = 0, l = values.length; i < l; i++) {
                result = callback(values[i]);
                if (result) {
                    return result;
                }
            }
            return result;
        };
        /**
         * @return {boolean} Is empty.
         */
        RBush.prototype.isEmpty = function () {
            return isEmpty(this.items_);
        };
        /**
         * Remove all values from the RBush.
         */
        RBush.prototype.clear = function () {
            this.rbush_.clear();
            this.items_ = {};
        };
        /**
         * @param {import("../extent.js").Extent} [opt_extent] Extent.
         * @return {import("../extent.js").Extent} Extent.
         */
        RBush.prototype.getExtent = function (opt_extent) {
            var data = this.rbush_.toJSON();
            return createOrUpdate(data.minX, data.minY, data.maxX, data.maxY, opt_extent);
        };
        /**
         * @param {RBush} rbush R-Tree.
         */
        RBush.prototype.concat = function (rbush) {
            this.rbush_.load(rbush.rbush_.all());
            for (var i in rbush.items_) {
                this.items_[i] = rbush.items_[i];
            }
        };
        return RBush;
    }());
    var RBush$1 = RBush;

    var __extends$3 = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            if (typeof b !== "function" && b !== null)
                throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * @typedef {'undefined' | 'loading' | 'ready' | 'error'} State
     * State of the source, one of 'undefined', 'loading', 'ready' or 'error'.
     */
    /**
     * A function that takes a {@link module:ol/PluggableMap~FrameState} and returns a string or
     * an array of strings representing source attributions.
     *
     * @typedef {function(import("../PluggableMap.js").FrameState): (string|Array<string>)} Attribution
     */
    /**
     * A type that can be used to provide attribution information for data sources.
     *
     * It represents either
     * * a simple string (e.g. `'© Acme Inc.'`)
     * * an array of simple strings (e.g. `['© Acme Inc.', '© Bacme Inc.']`)
     * * a function that returns a string or array of strings ({@link module:ol/source/Source~Attribution})
     *
     * @typedef {string|Array<string>|Attribution} AttributionLike
     */
    /**
     * @typedef {Object} Options
     * @property {AttributionLike} [attributions] Attributions.
     * @property {boolean} [attributionsCollapsible=true] Attributions are collapsible.
     * @property {import("../proj.js").ProjectionLike} [projection] Projection. Default is the view projection.
     * @property {import("./Source.js").State} [state='ready'] State.
     * @property {boolean} [wrapX=false] WrapX.
     * @property {boolean} [interpolate=false] Use interpolated values when resampling.  By default,
     * the nearest neighbor is used when resampling.
     */
    /**
     * @classdesc
     * Abstract base class; normally only used for creating subclasses and not
     * instantiated in apps.
     * Base class for {@link module:ol/layer/Layer~Layer} sources.
     *
     * A generic `change` event is triggered when the state of the source changes.
     * @abstract
     * @api
     */
    var Source = /** @class */ (function (_super) {
        __extends$3(Source, _super);
        /**
         * @param {Options} options Source options.
         */
        function Source(options) {
            var _this = _super.call(this) || this;
            /**
             * @protected
             * @type {import("../proj/Projection.js").default|null}
             */
            _this.projection = get$1(options.projection);
            /**
             * @private
             * @type {?Attribution}
             */
            _this.attributions_ = adaptAttributions(options.attributions);
            /**
             * @private
             * @type {boolean}
             */
            _this.attributionsCollapsible_ =
                options.attributionsCollapsible !== undefined
                    ? options.attributionsCollapsible
                    : true;
            /**
             * This source is currently loading data. Sources that defer loading to the
             * map's tile queue never set this to `true`.
             * @type {boolean}
             */
            _this.loading = false;
            /**
             * @private
             * @type {import("./Source.js").State}
             */
            _this.state_ = options.state !== undefined ? options.state : 'ready';
            /**
             * @private
             * @type {boolean}
             */
            _this.wrapX_ = options.wrapX !== undefined ? options.wrapX : false;
            /**
             * @private
             * @type {boolean}
             */
            _this.interpolate_ = !!options.interpolate;
            /**
             * @protected
             * @type {function(import("../View.js").ViewOptions):void}
             */
            _this.viewResolver = null;
            /**
             * @protected
             * @type {function(Error):void}
             */
            _this.viewRejector = null;
            var self = _this;
            /**
             * @private
             * @type {Promise<import("../View.js").ViewOptions>}
             */
            _this.viewPromise_ = new Promise(function (resolve, reject) {
                self.viewResolver = resolve;
                self.viewRejector = reject;
            });
            return _this;
        }
        /**
         * Get the attribution function for the source.
         * @return {?Attribution} Attribution function.
         * @api
         */
        Source.prototype.getAttributions = function () {
            return this.attributions_;
        };
        /**
         * @return {boolean} Attributions are collapsible.
         * @api
         */
        Source.prototype.getAttributionsCollapsible = function () {
            return this.attributionsCollapsible_;
        };
        /**
         * Get the projection of the source.
         * @return {import("../proj/Projection.js").default|null} Projection.
         * @api
         */
        Source.prototype.getProjection = function () {
            return this.projection;
        };
        /**
         * @abstract
         * @return {Array<number>|null} Resolutions.
         */
        Source.prototype.getResolutions = function () {
            return abstract();
        };
        /**
         * @return {Promise<import("../View.js").ViewOptions>} A promise for view-related properties.
         */
        Source.prototype.getView = function () {
            return this.viewPromise_;
        };
        /**
         * Get the state of the source, see {@link import("./Source.js").State} for possible states.
         * @return {import("./Source.js").State} State.
         * @api
         */
        Source.prototype.getState = function () {
            return this.state_;
        };
        /**
         * @return {boolean|undefined} Wrap X.
         */
        Source.prototype.getWrapX = function () {
            return this.wrapX_;
        };
        /**
         * @return {boolean} Use linear interpolation when resampling.
         */
        Source.prototype.getInterpolate = function () {
            return this.interpolate_;
        };
        /**
         * Refreshes the source. The source will be cleared, and data from the server will be reloaded.
         * @api
         */
        Source.prototype.refresh = function () {
            this.changed();
        };
        /**
         * Set the attributions of the source.
         * @param {AttributionLike|undefined} attributions Attributions.
         *     Can be passed as `string`, `Array<string>`, {@link module:ol/source/Source~Attribution},
         *     or `undefined`.
         * @api
         */
        Source.prototype.setAttributions = function (attributions) {
            this.attributions_ = adaptAttributions(attributions);
            this.changed();
        };
        /**
         * Set the state of the source.
         * @param {import("./Source.js").State} state State.
         */
        Source.prototype.setState = function (state) {
            this.state_ = state;
            this.changed();
        };
        return Source;
    }(BaseObject$1));
    /**
     * Turns the attributions option into an attributions function.
     * @param {AttributionLike|undefined} attributionLike The attribution option.
     * @return {Attribution|null} An attribution function (or null).
     */
    function adaptAttributions(attributionLike) {
        if (!attributionLike) {
            return null;
        }
        if (Array.isArray(attributionLike)) {
            return function (frameState) {
                return attributionLike;
            };
        }
        if (typeof attributionLike === 'function') {
            return attributionLike;
        }
        return function (frameState) {
            return [attributionLike];
        };
    }
    var Source$1 = Source;

    /**
     * @module ol/source/VectorEventType
     */
    /**
     * @enum {string}
     */
    var VectorEventType = {
        /**
         * Triggered when a feature is added to the source.
         * @event module:ol/source/Vector.VectorSourceEvent#addfeature
         * @api
         */
        ADDFEATURE: 'addfeature',
        /**
         * Triggered when a feature is updated.
         * @event module:ol/source/Vector.VectorSourceEvent#changefeature
         * @api
         */
        CHANGEFEATURE: 'changefeature',
        /**
         * Triggered when the clear method is called on the source.
         * @event module:ol/source/Vector.VectorSourceEvent#clear
         * @api
         */
        CLEAR: 'clear',
        /**
         * Triggered when a feature is removed from the source.
         * See {@link module:ol/source/Vector~VectorSource#clear source.clear()} for exceptions.
         * @event module:ol/source/Vector.VectorSourceEvent#removefeature
         * @api
         */
        REMOVEFEATURE: 'removefeature',
        /**
         * Triggered when features starts loading.
         * @event module:ol/source/Vector.VectorSourceEvent#featuresloadstart
         * @api
         */
        FEATURESLOADSTART: 'featuresloadstart',
        /**
         * Triggered when features finishes loading.
         * @event module:ol/source/Vector.VectorSourceEvent#featuresloadend
         * @api
         */
        FEATURESLOADEND: 'featuresloadend',
        /**
         * Triggered if feature loading results in an error.
         * @event module:ol/source/Vector.VectorSourceEvent#featuresloaderror
         * @api
         */
        FEATURESLOADERROR: 'featuresloaderror',
    };
    /**
     * @typedef {'addfeature'|'changefeature'|'clear'|'removefeature'|'featuresloadstart'|'featuresloadend'|'featuresloaderror'} VectorSourceEventTypes
     */

    /**
     * @module ol/loadingstrategy
     */
    /**
     * Strategy function for loading all features with a single request.
     * @param {import("./extent.js").Extent} extent Extent.
     * @param {number} resolution Resolution.
     * @return {Array<import("./extent.js").Extent>} Extents.
     * @api
     */
    function all(extent, resolution) {
        return [[-Infinity, -Infinity, Infinity, Infinity]];
    }

    /**
     * @module ol/featureloader
     */
    /**
     *
     * @type {boolean}
     * @private
     */
    var withCredentials = false;
    /**
     * {@link module:ol/source/Vector~VectorSource} sources use a function of this type to
     * load features.
     *
     * This function takes up to 5 arguments. These are an {@link module:ol/extent~Extent} representing
     * the area to be loaded, a `{number}` representing the resolution (map units per pixel), an
     * {@link module:ol/proj/Projection~Projection} for the projection, an optional success callback that should get
     * the loaded features passed as an argument and an optional failure callback with no arguments. If
     * the callbacks are not used, the corresponding vector source will not fire `'featuresloadend'` and
     * `'featuresloaderror'` events. `this` within the function is bound to the
     * {@link module:ol/source/Vector~VectorSource} it's called from.
     *
     * The function is responsible for loading the features and adding them to the
     * source.
     * @typedef {function(this:(import("./source/Vector").default|import("./VectorTile.js").default),
     *           import("./extent.js").Extent,
     *           number,
     *           import("./proj/Projection.js").default,
     *           function(Array<import("./Feature.js").default>): void=,
     *           function(): void=): void} FeatureLoader
     * @api
     */
    /**
     * {@link module:ol/source/Vector~VectorSource} sources use a function of this type to
     * get the url to load features from.
     *
     * This function takes an {@link module:ol/extent~Extent} representing the area
     * to be loaded, a `{number}` representing the resolution (map units per pixel)
     * and an {@link module:ol/proj/Projection~Projection} for the projection  as
     * arguments and returns a `{string}` representing the URL.
     * @typedef {function(import("./extent.js").Extent, number, import("./proj/Projection.js").default): string} FeatureUrlFunction
     * @api
     */
    /**
     * @param {string|FeatureUrlFunction} url Feature URL service.
     * @param {import("./format/Feature.js").default} format Feature format.
     * @param {import("./extent.js").Extent} extent Extent.
     * @param {number} resolution Resolution.
     * @param {import("./proj/Projection.js").default} projection Projection.
     * @param {function(Array<import("./Feature.js").default>, import("./proj/Projection.js").default): void} success Success
     *      Function called with the loaded features and optionally with the data projection.
     * @param {function(): void} failure Failure
     *      Function called when loading failed.
     */
    function loadFeaturesXhr(url, format, extent, resolution, projection, success, failure) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', typeof url === 'function' ? url(extent, resolution, projection) : url, true);
        if (format.getType() == 'arraybuffer') {
            xhr.responseType = 'arraybuffer';
        }
        xhr.withCredentials = withCredentials;
        /**
         * @param {Event} event Event.
         * @private
         */
        xhr.onload = function (event) {
            // status will be 0 for file:// urls
            if (!xhr.status || (xhr.status >= 200 && xhr.status < 300)) {
                var type = format.getType();
                /** @type {Document|Node|Object|string|undefined} */
                var source = void 0;
                if (type == 'json' || type == 'text') {
                    source = xhr.responseText;
                }
                else if (type == 'xml') {
                    source = xhr.responseXML;
                    if (!source) {
                        source = new DOMParser().parseFromString(xhr.responseText, 'application/xml');
                    }
                }
                else if (type == 'arraybuffer') {
                    source = /** @type {ArrayBuffer} */ (xhr.response);
                }
                if (source) {
                    success(
                    /** @type {Array<import("./Feature.js").default>} */
                    (format.readFeatures(source, {
                        extent: extent,
                        featureProjection: projection,
                    })), format.readProjection(source));
                }
                else {
                    failure();
                }
            }
            else {
                failure();
            }
        };
        /**
         * @private
         */
        xhr.onerror = failure;
        xhr.send();
    }
    /**
     * Create an XHR feature loader for a `url` and `format`. The feature loader
     * loads features (with XHR), parses the features, and adds them to the
     * vector source.
     * @param {string|FeatureUrlFunction} url Feature URL service.
     * @param {import("./format/Feature.js").default} format Feature format.
     * @return {FeatureLoader} The feature loader.
     * @api
     */
    function xhr(url, format) {
        /**
         * @param {import("./extent.js").Extent} extent Extent.
         * @param {number} resolution Resolution.
         * @param {import("./proj/Projection.js").default} projection Projection.
         * @param {function(Array<import("./Feature.js").default>): void} [success] Success
         *      Function called when loading succeeded.
         * @param {function(): void} [failure] Failure
         *      Function called when loading failed.
         * @this {import("./source/Vector").default}
         */
        return function (extent, resolution, projection, success, failure) {
            var source = /** @type {import("./source/Vector").default} */ (this);
            loadFeaturesXhr(url, format, extent, resolution, projection, 
            /**
             * @param {Array<import("./Feature.js").default>} features The loaded features.
             * @param {import("./proj/Projection.js").default} dataProjection Data
             * projection.
             */
            function (features, dataProjection) {
                source.addFeatures(features);
                if (success !== undefined) {
                    success(features);
                }
            }, 
            /* FIXME handle error */ failure ? failure : VOID);
        };
    }

    /**
     * @module ol/source/Vector
     */
    var __extends$2 = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            if (typeof b !== "function" && b !== null)
                throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * A function that takes an {@link module:ol/extent~Extent} and a resolution as arguments, and
     * returns an array of {@link module:ol/extent~Extent} with the extents to load. Usually this
     * is one of the standard {@link module:ol/loadingstrategy} strategies.
     *
     * @typedef {function(import("../extent.js").Extent, number, import("../proj/Projection.js").default): Array<import("../extent.js").Extent>} LoadingStrategy
     * @api
     */
    /**
     * @classdesc
     * Events emitted by {@link module:ol/source/Vector~VectorSource} instances are instances of this
     * type.
     * @template {import("../geom/Geometry.js").default} [Geometry=import("../geom/Geometry.js").default]
     */
    var VectorSourceEvent = /** @class */ (function (_super) {
        __extends$2(VectorSourceEvent, _super);
        /**
         * @param {string} type Type.
         * @param {import("../Feature.js").default<Geometry>} [opt_feature] Feature.
         * @param {Array<import("../Feature.js").default<Geometry>>} [opt_features] Features.
         */
        function VectorSourceEvent(type, opt_feature, opt_features) {
            var _this = _super.call(this, type) || this;
            /**
             * The added or removed feature for the `ADDFEATURE` and `REMOVEFEATURE` events, `undefined` otherwise.
             * @type {import("../Feature.js").default<Geometry>|undefined}
             * @api
             */
            _this.feature = opt_feature;
            /**
             * The loaded features for the `FEATURESLOADED` event, `undefined` otherwise.
             * @type {Array<import("../Feature.js").default<Geometry>>|undefined}
             * @api
             */
            _this.features = opt_features;
            return _this;
        }
        return VectorSourceEvent;
    }(Event));
    /***
     * @template Return
     * @typedef {import("../Observable").OnSignature<import("../Observable").EventTypes, import("../events/Event.js").default, Return> &
     *   import("../Observable").OnSignature<import("../ObjectEventType").Types, import("../Object").ObjectEvent, Return> &
     *   import("../Observable").OnSignature<import("./VectorEventType").VectorSourceEventTypes, VectorSourceEvent, Return> &
     *   import("../Observable").CombinedOnSignature<import("../Observable").EventTypes|import("../ObjectEventType").Types|
     *     import("./VectorEventType").VectorSourceEventTypes, Return>} VectorSourceOnSignature
     */
    /**
     * @typedef {Object} Options
     * @property {import("./Source.js").AttributionLike} [attributions] Attributions.
     * @property {Array<import("../Feature.js").default>|Collection<import("../Feature.js").default>} [features]
     * Features. If provided as {@link module:ol/Collection~Collection}, the features in the source
     * and the collection will stay in sync.
     * @property {import("../format/Feature.js").default} [format] The feature format used by the XHR
     * feature loader when `url` is set. Required if `url` is set, otherwise ignored.
     * @property {import("../featureloader.js").FeatureLoader} [loader]
     * The loader function used to load features, from a remote source for example.
     * If this is not set and `url` is set, the source will create and use an XHR
     * feature loader. The `'featuresloadend'` and `'featuresloaderror'` events
     * will only fire if the `success` and `failure` callbacks are used.
     *
     * Example:
     *
     * ```js
     * import {Vector} from 'ol/source';
     * import {GeoJSON} from 'ol/format';
     * import {bbox} from 'ol/loadingstrategy';
     *
     * var vectorSource = new Vector({
     *   format: new GeoJSON(),
     *   loader: function(extent, resolution, projection, success, failure) {
     *      var proj = projection.getCode();
     *      var url = 'https://ahocevar.com/geoserver/wfs?service=WFS&' +
     *          'version=1.1.0&request=GetFeature&typename=osm:water_areas&' +
     *          'outputFormat=application/json&srsname=' + proj + '&' +
     *          'bbox=' + extent.join(',') + ',' + proj;
     *      var xhr = new XMLHttpRequest();
     *      xhr.open('GET', url);
     *      var onError = function() {
     *        vectorSource.removeLoadedExtent(extent);
     *        failure();
     *      }
     *      xhr.onerror = onError;
     *      xhr.onload = function() {
     *        if (xhr.status == 200) {
     *          var features = vectorSource.getFormat().readFeatures(xhr.responseText);
     *          vectorSource.addFeatures(features);
     *          success(features);
     *        } else {
     *          onError();
     *        }
     *      }
     *      xhr.send();
     *    },
     *    strategy: bbox
     *  });
     * ```
     * @property {boolean} [overlaps=true] This source may have overlapping geometries.
     * Setting this to `false` (e.g. for sources with polygons that represent administrative
     * boundaries or TopoJSON sources) allows the renderer to optimise fill and
     * stroke operations.
     * @property {LoadingStrategy} [strategy] The loading strategy to use.
     * By default an {@link module:ol/loadingstrategy.all}
     * strategy is used, a one-off strategy which loads all features at once.
     * @property {string|import("../featureloader.js").FeatureUrlFunction} [url]
     * Setting this option instructs the source to load features using an XHR loader
     * (see {@link module:ol/featureloader.xhr}). Use a `string` and an
     * {@link module:ol/loadingstrategy.all} for a one-off download of all features from
     * the given URL. Use a {@link module:ol/featureloader~FeatureUrlFunction} to generate the url with
     * other loading strategies.
     * Requires `format` to be set as well.
     * When default XHR feature loader is provided, the features will
     * be transformed from the data projection to the view projection
     * during parsing. If your remote data source does not advertise its projection
     * properly, this transformation will be incorrect. For some formats, the
     * default projection (usually EPSG:4326) can be overridden by setting the
     * dataProjection constructor option on the format.
     * Note that if a source contains non-feature data, such as a GeoJSON geometry
     * or a KML NetworkLink, these will be ignored. Use a custom loader to load these.
     * @property {boolean} [useSpatialIndex=true]
     * By default, an RTree is used as spatial index. When features are removed and
     * added frequently, and the total number of features is low, setting this to
     * `false` may improve performance.
     *
     * Note that
     * {@link module:ol/source/Vector~VectorSource#getFeaturesInExtent},
     * {@link module:ol/source/Vector~VectorSource#getClosestFeatureToCoordinate} and
     * {@link module:ol/source/Vector~VectorSource#getExtent} cannot be used when `useSpatialIndex` is
     * set to `false`, and {@link module:ol/source/Vector~VectorSource#forEachFeatureInExtent} will loop
     * through all features.
     *
     * When set to `false`, the features will be maintained in an
     * {@link module:ol/Collection~Collection}, which can be retrieved through
     * {@link module:ol/source/Vector~VectorSource#getFeaturesCollection}.
     * @property {boolean} [wrapX=true] Wrap the world horizontally. For vector editing across the
     * -180° and 180° meridians to work properly, this should be set to `false`. The
     * resulting geometry coordinates will then exceed the world bounds.
     */
    /**
     * @classdesc
     * Provides a source of features for vector layers. Vector features provided
     * by this source are suitable for editing. See {@link module:ol/source/VectorTile~VectorTile} for
     * vector data that is optimized for rendering.
     *
     * @fires VectorSourceEvent
     * @api
     * @template {import("../geom/Geometry.js").default} [Geometry=import("../geom/Geometry.js").default]
     */
    var VectorSource = /** @class */ (function (_super) {
        __extends$2(VectorSource, _super);
        /**
         * @param {Options} [opt_options] Vector source options.
         */
        function VectorSource(opt_options) {
            var _this = this;
            var options = opt_options || {};
            _this = _super.call(this, {
                attributions: options.attributions,
                interpolate: true,
                projection: undefined,
                state: 'ready',
                wrapX: options.wrapX !== undefined ? options.wrapX : true,
            }) || this;
            /***
             * @type {VectorSourceOnSignature<import("../events").EventsKey>}
             */
            _this.on;
            /***
             * @type {VectorSourceOnSignature<import("../events").EventsKey>}
             */
            _this.once;
            /***
             * @type {VectorSourceOnSignature<void>}
             */
            _this.un;
            /**
             * @private
             * @type {import("../featureloader.js").FeatureLoader}
             */
            _this.loader_ = VOID;
            /**
             * @private
             * @type {import("../format/Feature.js").default|undefined}
             */
            _this.format_ = options.format;
            /**
             * @private
             * @type {boolean}
             */
            _this.overlaps_ = options.overlaps === undefined ? true : options.overlaps;
            /**
             * @private
             * @type {string|import("../featureloader.js").FeatureUrlFunction|undefined}
             */
            _this.url_ = options.url;
            if (options.loader !== undefined) {
                _this.loader_ = options.loader;
            }
            else if (_this.url_ !== undefined) {
                assert(_this.format_, 7); // `format` must be set when `url` is set
                // create a XHR feature loader for "url" and "format"
                _this.loader_ = xhr(_this.url_, 
                /** @type {import("../format/Feature.js").default} */ (_this.format_));
            }
            /**
             * @private
             * @type {LoadingStrategy}
             */
            _this.strategy_ =
                options.strategy !== undefined ? options.strategy : all;
            var useSpatialIndex = options.useSpatialIndex !== undefined ? options.useSpatialIndex : true;
            /**
             * @private
             * @type {RBush<import("../Feature.js").default<Geometry>>}
             */
            _this.featuresRtree_ = useSpatialIndex ? new RBush$1() : null;
            /**
             * @private
             * @type {RBush<{extent: import("../extent.js").Extent}>}
             */
            _this.loadedExtentsRtree_ = new RBush$1();
            /**
             * @type {number}
             * @private
             */
            _this.loadingExtentsCount_ = 0;
            /**
             * @private
             * @type {!Object<string, import("../Feature.js").default<Geometry>>}
             */
            _this.nullGeometryFeatures_ = {};
            /**
             * A lookup of features by id (the return from feature.getId()).
             * @private
             * @type {!Object<string, import("../Feature.js").default<Geometry>>}
             */
            _this.idIndex_ = {};
            /**
             * A lookup of features by uid (using getUid(feature)).
             * @private
             * @type {!Object<string, import("../Feature.js").default<Geometry>>}
             */
            _this.uidIndex_ = {};
            /**
             * @private
             * @type {Object<string, Array<import("../events.js").EventsKey>>}
             */
            _this.featureChangeKeys_ = {};
            /**
             * @private
             * @type {Collection<import("../Feature.js").default<Geometry>>|null}
             */
            _this.featuresCollection_ = null;
            var collection, features;
            if (Array.isArray(options.features)) {
                features =
                    /** @type {Array<import("../Feature.js").default<Geometry>>} */ (options.features);
            }
            else if (options.features) {
                collection =
                    /** @type {Collection<import("../Feature.js").default<Geometry>>} */ (options.features);
                features = collection.getArray();
            }
            if (!useSpatialIndex && collection === undefined) {
                collection = new Collection$1(features);
            }
            if (features !== undefined) {
                _this.addFeaturesInternal(features);
            }
            if (collection !== undefined) {
                _this.bindFeaturesCollection_(collection);
            }
            return _this;
        }
        /**
         * Add a single feature to the source.  If you want to add a batch of features
         * at once, call {@link module:ol/source/Vector~VectorSource#addFeatures #addFeatures()}
         * instead. A feature will not be added to the source if feature with
         * the same id is already there. The reason for this behavior is to avoid
         * feature duplication when using bbox or tile loading strategies.
         * Note: this also applies if an {@link module:ol/Collection~Collection} is used for features,
         * meaning that if a feature with a duplicate id is added in the collection, it will
         * be removed from it right away.
         * @param {import("../Feature.js").default<Geometry>} feature Feature to add.
         * @api
         */
        VectorSource.prototype.addFeature = function (feature) {
            this.addFeatureInternal(feature);
            this.changed();
        };
        /**
         * Add a feature without firing a `change` event.
         * @param {import("../Feature.js").default<Geometry>} feature Feature.
         * @protected
         */
        VectorSource.prototype.addFeatureInternal = function (feature) {
            var featureKey = getUid(feature);
            if (!this.addToIndex_(featureKey, feature)) {
                if (this.featuresCollection_) {
                    this.featuresCollection_.remove(feature);
                }
                return;
            }
            this.setupChangeEvents_(featureKey, feature);
            var geometry = feature.getGeometry();
            if (geometry) {
                var extent = geometry.getExtent();
                if (this.featuresRtree_) {
                    this.featuresRtree_.insert(extent, feature);
                }
            }
            else {
                this.nullGeometryFeatures_[featureKey] = feature;
            }
            this.dispatchEvent(new VectorSourceEvent(VectorEventType.ADDFEATURE, feature));
        };
        /**
         * @param {string} featureKey Unique identifier for the feature.
         * @param {import("../Feature.js").default<Geometry>} feature The feature.
         * @private
         */
        VectorSource.prototype.setupChangeEvents_ = function (featureKey, feature) {
            this.featureChangeKeys_[featureKey] = [
                listen(feature, EventType.CHANGE, this.handleFeatureChange_, this),
                listen(feature, ObjectEventType.PROPERTYCHANGE, this.handleFeatureChange_, this),
            ];
        };
        /**
         * @param {string} featureKey Unique identifier for the feature.
         * @param {import("../Feature.js").default<Geometry>} feature The feature.
         * @return {boolean} The feature is "valid", in the sense that it is also a
         *     candidate for insertion into the Rtree.
         * @private
         */
        VectorSource.prototype.addToIndex_ = function (featureKey, feature) {
            var valid = true;
            var id = feature.getId();
            if (id !== undefined) {
                if (!(id.toString() in this.idIndex_)) {
                    this.idIndex_[id.toString()] = feature;
                }
                else {
                    valid = false;
                }
            }
            if (valid) {
                assert(!(featureKey in this.uidIndex_), 30); // The passed `feature` was already added to the source
                this.uidIndex_[featureKey] = feature;
            }
            return valid;
        };
        /**
         * Add a batch of features to the source.
         * @param {Array<import("../Feature.js").default<Geometry>>} features Features to add.
         * @api
         */
        VectorSource.prototype.addFeatures = function (features) {
            this.addFeaturesInternal(features);
            this.changed();
        };
        /**
         * Add features without firing a `change` event.
         * @param {Array<import("../Feature.js").default<Geometry>>} features Features.
         * @protected
         */
        VectorSource.prototype.addFeaturesInternal = function (features) {
            var extents = [];
            var newFeatures = [];
            var geometryFeatures = [];
            for (var i = 0, length_1 = features.length; i < length_1; i++) {
                var feature = features[i];
                var featureKey = getUid(feature);
                if (this.addToIndex_(featureKey, feature)) {
                    newFeatures.push(feature);
                }
            }
            for (var i = 0, length_2 = newFeatures.length; i < length_2; i++) {
                var feature = newFeatures[i];
                var featureKey = getUid(feature);
                this.setupChangeEvents_(featureKey, feature);
                var geometry = feature.getGeometry();
                if (geometry) {
                    var extent = geometry.getExtent();
                    extents.push(extent);
                    geometryFeatures.push(feature);
                }
                else {
                    this.nullGeometryFeatures_[featureKey] = feature;
                }
            }
            if (this.featuresRtree_) {
                this.featuresRtree_.load(extents, geometryFeatures);
            }
            if (this.hasListener(VectorEventType.ADDFEATURE)) {
                for (var i = 0, length_3 = newFeatures.length; i < length_3; i++) {
                    this.dispatchEvent(new VectorSourceEvent(VectorEventType.ADDFEATURE, newFeatures[i]));
                }
            }
        };
        /**
         * @param {!Collection<import("../Feature.js").default<Geometry>>} collection Collection.
         * @private
         */
        VectorSource.prototype.bindFeaturesCollection_ = function (collection) {
            var modifyingCollection = false;
            this.addEventListener(VectorEventType.ADDFEATURE, 
            /**
             * @param {VectorSourceEvent<Geometry>} evt The vector source event
             */
            function (evt) {
                if (!modifyingCollection) {
                    modifyingCollection = true;
                    collection.push(evt.feature);
                    modifyingCollection = false;
                }
            });
            this.addEventListener(VectorEventType.REMOVEFEATURE, 
            /**
             * @param {VectorSourceEvent<Geometry>} evt The vector source event
             */
            function (evt) {
                if (!modifyingCollection) {
                    modifyingCollection = true;
                    collection.remove(evt.feature);
                    modifyingCollection = false;
                }
            });
            collection.addEventListener(CollectionEventType.ADD, 
            /**
             * @param {import("../Collection.js").CollectionEvent} evt The collection event
             */
            function (evt) {
                if (!modifyingCollection) {
                    modifyingCollection = true;
                    this.addFeature(
                    /** @type {import("../Feature.js").default<Geometry>} */ (evt.element));
                    modifyingCollection = false;
                }
            }.bind(this));
            collection.addEventListener(CollectionEventType.REMOVE, 
            /**
             * @param {import("../Collection.js").CollectionEvent} evt The collection event
             */
            function (evt) {
                if (!modifyingCollection) {
                    modifyingCollection = true;
                    this.removeFeature(
                    /** @type {import("../Feature.js").default<Geometry>} */ (evt.element));
                    modifyingCollection = false;
                }
            }.bind(this));
            this.featuresCollection_ = collection;
        };
        /**
         * Remove all features from the source.
         * @param {boolean} [opt_fast] Skip dispatching of {@link module:ol/source/Vector.VectorSourceEvent#event:removefeature removefeature} events.
         * @api
         */
        VectorSource.prototype.clear = function (opt_fast) {
            if (opt_fast) {
                for (var featureId in this.featureChangeKeys_) {
                    var keys = this.featureChangeKeys_[featureId];
                    keys.forEach(unlistenByKey);
                }
                if (!this.featuresCollection_) {
                    this.featureChangeKeys_ = {};
                    this.idIndex_ = {};
                    this.uidIndex_ = {};
                }
            }
            else {
                if (this.featuresRtree_) {
                    var removeAndIgnoreReturn = function (feature) {
                        this.removeFeatureInternal(feature);
                    }.bind(this);
                    this.featuresRtree_.forEach(removeAndIgnoreReturn);
                    for (var id in this.nullGeometryFeatures_) {
                        this.removeFeatureInternal(this.nullGeometryFeatures_[id]);
                    }
                }
            }
            if (this.featuresCollection_) {
                this.featuresCollection_.clear();
            }
            if (this.featuresRtree_) {
                this.featuresRtree_.clear();
            }
            this.nullGeometryFeatures_ = {};
            var clearEvent = new VectorSourceEvent(VectorEventType.CLEAR);
            this.dispatchEvent(clearEvent);
            this.changed();
        };
        /**
         * Iterate through all features on the source, calling the provided callback
         * with each one.  If the callback returns any "truthy" value, iteration will
         * stop and the function will return the same value.
         * Note: this function only iterate through the feature that have a defined geometry.
         *
         * @param {function(import("../Feature.js").default<Geometry>): T} callback Called with each feature
         *     on the source.  Return a truthy value to stop iteration.
         * @return {T|undefined} The return value from the last call to the callback.
         * @template T
         * @api
         */
        VectorSource.prototype.forEachFeature = function (callback) {
            if (this.featuresRtree_) {
                return this.featuresRtree_.forEach(callback);
            }
            else if (this.featuresCollection_) {
                this.featuresCollection_.forEach(callback);
            }
        };
        /**
         * Iterate through all features whose geometries contain the provided
         * coordinate, calling the callback with each feature.  If the callback returns
         * a "truthy" value, iteration will stop and the function will return the same
         * value.
         *
         * @param {import("../coordinate.js").Coordinate} coordinate Coordinate.
         * @param {function(import("../Feature.js").default<Geometry>): T} callback Called with each feature
         *     whose goemetry contains the provided coordinate.
         * @return {T|undefined} The return value from the last call to the callback.
         * @template T
         */
        VectorSource.prototype.forEachFeatureAtCoordinateDirect = function (coordinate, callback) {
            var extent = [coordinate[0], coordinate[1], coordinate[0], coordinate[1]];
            return this.forEachFeatureInExtent(extent, function (feature) {
                var geometry = feature.getGeometry();
                if (geometry.intersectsCoordinate(coordinate)) {
                    return callback(feature);
                }
                else {
                    return undefined;
                }
            });
        };
        /**
         * Iterate through all features whose bounding box intersects the provided
         * extent (note that the feature's geometry may not intersect the extent),
         * calling the callback with each feature.  If the callback returns a "truthy"
         * value, iteration will stop and the function will return the same value.
         *
         * If you are interested in features whose geometry intersects an extent, call
         * the {@link module:ol/source/Vector~VectorSource#forEachFeatureIntersectingExtent #forEachFeatureIntersectingExtent()} method instead.
         *
         * When `useSpatialIndex` is set to false, this method will loop through all
         * features, equivalent to {@link module:ol/source/Vector~VectorSource#forEachFeature #forEachFeature()}.
         *
         * @param {import("../extent.js").Extent} extent Extent.
         * @param {function(import("../Feature.js").default<Geometry>): T} callback Called with each feature
         *     whose bounding box intersects the provided extent.
         * @return {T|undefined} The return value from the last call to the callback.
         * @template T
         * @api
         */
        VectorSource.prototype.forEachFeatureInExtent = function (extent, callback) {
            if (this.featuresRtree_) {
                return this.featuresRtree_.forEachInExtent(extent, callback);
            }
            else if (this.featuresCollection_) {
                this.featuresCollection_.forEach(callback);
            }
        };
        /**
         * Iterate through all features whose geometry intersects the provided extent,
         * calling the callback with each feature.  If the callback returns a "truthy"
         * value, iteration will stop and the function will return the same value.
         *
         * If you only want to test for bounding box intersection, call the
         * {@link module:ol/source/Vector~VectorSource#forEachFeatureInExtent #forEachFeatureInExtent()} method instead.
         *
         * @param {import("../extent.js").Extent} extent Extent.
         * @param {function(import("../Feature.js").default<Geometry>): T} callback Called with each feature
         *     whose geometry intersects the provided extent.
         * @return {T|undefined} The return value from the last call to the callback.
         * @template T
         * @api
         */
        VectorSource.prototype.forEachFeatureIntersectingExtent = function (extent, callback) {
            return this.forEachFeatureInExtent(extent, 
            /**
             * @param {import("../Feature.js").default<Geometry>} feature Feature.
             * @return {T|undefined} The return value from the last call to the callback.
             */
            function (feature) {
                var geometry = feature.getGeometry();
                if (geometry.intersectsExtent(extent)) {
                    var result = callback(feature);
                    if (result) {
                        return result;
                    }
                }
            });
        };
        /**
         * Get the features collection associated with this source. Will be `null`
         * unless the source was configured with `useSpatialIndex` set to `false`, or
         * with an {@link module:ol/Collection~Collection} as `features`.
         * @return {Collection<import("../Feature.js").default<Geometry>>|null} The collection of features.
         * @api
         */
        VectorSource.prototype.getFeaturesCollection = function () {
            return this.featuresCollection_;
        };
        /**
         * Get a snapshot of the features currently on the source in random order. The returned array
         * is a copy, the features are references to the features in the source.
         * @return {Array<import("../Feature.js").default<Geometry>>} Features.
         * @api
         */
        VectorSource.prototype.getFeatures = function () {
            var features;
            if (this.featuresCollection_) {
                features = this.featuresCollection_.getArray().slice(0);
            }
            else if (this.featuresRtree_) {
                features = this.featuresRtree_.getAll();
                if (!isEmpty(this.nullGeometryFeatures_)) {
                    extend$1(features, getValues(this.nullGeometryFeatures_));
                }
            }
            return /** @type {Array<import("../Feature.js").default<Geometry>>} */ (features);
        };
        /**
         * Get all features whose geometry intersects the provided coordinate.
         * @param {import("../coordinate.js").Coordinate} coordinate Coordinate.
         * @return {Array<import("../Feature.js").default<Geometry>>} Features.
         * @api
         */
        VectorSource.prototype.getFeaturesAtCoordinate = function (coordinate) {
            var features = [];
            this.forEachFeatureAtCoordinateDirect(coordinate, function (feature) {
                features.push(feature);
            });
            return features;
        };
        /**
         * Get all features whose bounding box intersects the provided extent.  Note that this returns an array of
         * all features intersecting the given extent in random order (so it may include
         * features whose geometries do not intersect the extent).
         *
         * When `useSpatialIndex` is set to false, this method will return all
         * features.
         *
         * @param {import("../extent.js").Extent} extent Extent.
         * @param {import("../proj/Projection.js").default} [opt_projection] Include features
         * where `extent` exceeds the x-axis bounds of `projection` and wraps around the world.
         * @return {Array<import("../Feature.js").default<Geometry>>} Features.
         * @api
         */
        VectorSource.prototype.getFeaturesInExtent = function (extent, opt_projection) {
            var _this = this;
            if (this.featuresRtree_) {
                var multiWorld = opt_projection && opt_projection.canWrapX() && this.getWrapX();
                if (!multiWorld) {
                    return this.featuresRtree_.getInExtent(extent);
                }
                var extents = wrapAndSliceX(extent, opt_projection);
                return [].concat.apply([], extents.map(function (anExtent) { return _this.featuresRtree_.getInExtent(anExtent); }));
            }
            else if (this.featuresCollection_) {
                return this.featuresCollection_.getArray().slice(0);
            }
            else {
                return [];
            }
        };
        /**
         * Get the closest feature to the provided coordinate.
         *
         * This method is not available when the source is configured with
         * `useSpatialIndex` set to `false`.
         * @param {import("../coordinate.js").Coordinate} coordinate Coordinate.
         * @param {function(import("../Feature.js").default<Geometry>):boolean} [opt_filter] Feature filter function.
         *     The filter function will receive one argument, the {@link module:ol/Feature~Feature feature}
         *     and it should return a boolean value. By default, no filtering is made.
         * @return {import("../Feature.js").default<Geometry>} Closest feature.
         * @api
         */
        VectorSource.prototype.getClosestFeatureToCoordinate = function (coordinate, opt_filter) {
            // Find the closest feature using branch and bound.  We start searching an
            // infinite extent, and find the distance from the first feature found.  This
            // becomes the closest feature.  We then compute a smaller extent which any
            // closer feature must intersect.  We continue searching with this smaller
            // extent, trying to find a closer feature.  Every time we find a closer
            // feature, we update the extent being searched so that any even closer
            // feature must intersect it.  We continue until we run out of features.
            var x = coordinate[0];
            var y = coordinate[1];
            var closestFeature = null;
            var closestPoint = [NaN, NaN];
            var minSquaredDistance = Infinity;
            var extent = [-Infinity, -Infinity, Infinity, Infinity];
            var filter = opt_filter ? opt_filter : TRUE;
            this.featuresRtree_.forEachInExtent(extent, 
            /**
             * @param {import("../Feature.js").default<Geometry>} feature Feature.
             */
            function (feature) {
                if (filter(feature)) {
                    var geometry = feature.getGeometry();
                    var previousMinSquaredDistance = minSquaredDistance;
                    minSquaredDistance = geometry.closestPointXY(x, y, closestPoint, minSquaredDistance);
                    if (minSquaredDistance < previousMinSquaredDistance) {
                        closestFeature = feature;
                        // This is sneaky.  Reduce the extent that it is currently being
                        // searched while the R-Tree traversal using this same extent object
                        // is still in progress.  This is safe because the new extent is
                        // strictly contained by the old extent.
                        var minDistance = Math.sqrt(minSquaredDistance);
                        extent[0] = x - minDistance;
                        extent[1] = y - minDistance;
                        extent[2] = x + minDistance;
                        extent[3] = y + minDistance;
                    }
                }
            });
            return closestFeature;
        };
        /**
         * Get the extent of the features currently in the source.
         *
         * This method is not available when the source is configured with
         * `useSpatialIndex` set to `false`.
         * @param {import("../extent.js").Extent} [opt_extent] Destination extent. If provided, no new extent
         *     will be created. Instead, that extent's coordinates will be overwritten.
         * @return {import("../extent.js").Extent} Extent.
         * @api
         */
        VectorSource.prototype.getExtent = function (opt_extent) {
            return this.featuresRtree_.getExtent(opt_extent);
        };
        /**
         * Get a feature by its identifier (the value returned by feature.getId()).
         * Note that the index treats string and numeric identifiers as the same.  So
         * `source.getFeatureById(2)` will return a feature with id `'2'` or `2`.
         *
         * @param {string|number} id Feature identifier.
         * @return {import("../Feature.js").default<Geometry>|null} The feature (or `null` if not found).
         * @api
         */
        VectorSource.prototype.getFeatureById = function (id) {
            var feature = this.idIndex_[id.toString()];
            return feature !== undefined ? feature : null;
        };
        /**
         * Get a feature by its internal unique identifier (using `getUid`).
         *
         * @param {string} uid Feature identifier.
         * @return {import("../Feature.js").default<Geometry>|null} The feature (or `null` if not found).
         */
        VectorSource.prototype.getFeatureByUid = function (uid) {
            var feature = this.uidIndex_[uid];
            return feature !== undefined ? feature : null;
        };
        /**
         * Get the format associated with this source.
         *
         * @return {import("../format/Feature.js").default|undefined} The feature format.
         * @api
         */
        VectorSource.prototype.getFormat = function () {
            return this.format_;
        };
        /**
         * @return {boolean} The source can have overlapping geometries.
         */
        VectorSource.prototype.getOverlaps = function () {
            return this.overlaps_;
        };
        /**
         * Get the url associated with this source.
         *
         * @return {string|import("../featureloader.js").FeatureUrlFunction|undefined} The url.
         * @api
         */
        VectorSource.prototype.getUrl = function () {
            return this.url_;
        };
        /**
         * @param {Event} event Event.
         * @private
         */
        VectorSource.prototype.handleFeatureChange_ = function (event) {
            var feature = /** @type {import("../Feature.js").default<Geometry>} */ (event.target);
            var featureKey = getUid(feature);
            var geometry = feature.getGeometry();
            if (!geometry) {
                if (!(featureKey in this.nullGeometryFeatures_)) {
                    if (this.featuresRtree_) {
                        this.featuresRtree_.remove(feature);
                    }
                    this.nullGeometryFeatures_[featureKey] = feature;
                }
            }
            else {
                var extent = geometry.getExtent();
                if (featureKey in this.nullGeometryFeatures_) {
                    delete this.nullGeometryFeatures_[featureKey];
                    if (this.featuresRtree_) {
                        this.featuresRtree_.insert(extent, feature);
                    }
                }
                else {
                    if (this.featuresRtree_) {
                        this.featuresRtree_.update(extent, feature);
                    }
                }
            }
            var id = feature.getId();
            if (id !== undefined) {
                var sid = id.toString();
                if (this.idIndex_[sid] !== feature) {
                    this.removeFromIdIndex_(feature);
                    this.idIndex_[sid] = feature;
                }
            }
            else {
                this.removeFromIdIndex_(feature);
                this.uidIndex_[featureKey] = feature;
            }
            this.changed();
            this.dispatchEvent(new VectorSourceEvent(VectorEventType.CHANGEFEATURE, feature));
        };
        /**
         * Returns true if the feature is contained within the source.
         * @param {import("../Feature.js").default<Geometry>} feature Feature.
         * @return {boolean} Has feature.
         * @api
         */
        VectorSource.prototype.hasFeature = function (feature) {
            var id = feature.getId();
            if (id !== undefined) {
                return id in this.idIndex_;
            }
            else {
                return getUid(feature) in this.uidIndex_;
            }
        };
        /**
         * @return {boolean} Is empty.
         */
        VectorSource.prototype.isEmpty = function () {
            if (this.featuresRtree_) {
                return (this.featuresRtree_.isEmpty() && isEmpty(this.nullGeometryFeatures_));
            }
            if (this.featuresCollection_) {
                return this.featuresCollection_.getLength() === 0;
            }
            return true;
        };
        /**
         * @param {import("../extent.js").Extent} extent Extent.
         * @param {number} resolution Resolution.
         * @param {import("../proj/Projection.js").default} projection Projection.
         */
        VectorSource.prototype.loadFeatures = function (extent, resolution, projection) {
            var loadedExtentsRtree = this.loadedExtentsRtree_;
            var extentsToLoad = this.strategy_(extent, resolution, projection);
            var _loop_1 = function (i, ii) {
                var extentToLoad = extentsToLoad[i];
                var alreadyLoaded = loadedExtentsRtree.forEachInExtent(extentToLoad, 
                /**
                 * @param {{extent: import("../extent.js").Extent}} object Object.
                 * @return {boolean} Contains.
                 */
                function (object) {
                    return containsExtent(object.extent, extentToLoad);
                });
                if (!alreadyLoaded) {
                    ++this_1.loadingExtentsCount_;
                    this_1.dispatchEvent(new VectorSourceEvent(VectorEventType.FEATURESLOADSTART));
                    this_1.loader_.call(this_1, extentToLoad, resolution, projection, function (features) {
                        --this.loadingExtentsCount_;
                        this.dispatchEvent(new VectorSourceEvent(VectorEventType.FEATURESLOADEND, undefined, features));
                    }.bind(this_1), function () {
                        --this.loadingExtentsCount_;
                        this.dispatchEvent(new VectorSourceEvent(VectorEventType.FEATURESLOADERROR));
                    }.bind(this_1));
                    loadedExtentsRtree.insert(extentToLoad, { extent: extentToLoad.slice() });
                }
            };
            var this_1 = this;
            for (var i = 0, ii = extentsToLoad.length; i < ii; ++i) {
                _loop_1(i);
            }
            this.loading =
                this.loader_.length < 4 ? false : this.loadingExtentsCount_ > 0;
        };
        VectorSource.prototype.refresh = function () {
            this.clear(true);
            this.loadedExtentsRtree_.clear();
            _super.prototype.refresh.call(this);
        };
        /**
         * Remove an extent from the list of loaded extents.
         * @param {import("../extent.js").Extent} extent Extent.
         * @api
         */
        VectorSource.prototype.removeLoadedExtent = function (extent) {
            var loadedExtentsRtree = this.loadedExtentsRtree_;
            var obj;
            loadedExtentsRtree.forEachInExtent(extent, function (object) {
                if (equals(object.extent, extent)) {
                    obj = object;
                    return true;
                }
            });
            if (obj) {
                loadedExtentsRtree.remove(obj);
            }
        };
        /**
         * Remove a single feature from the source.  If you want to remove all features
         * at once, use the {@link module:ol/source/Vector~VectorSource#clear #clear()} method
         * instead.
         * @param {import("../Feature.js").default<Geometry>} feature Feature to remove.
         * @api
         */
        VectorSource.prototype.removeFeature = function (feature) {
            if (!feature) {
                return;
            }
            var featureKey = getUid(feature);
            if (featureKey in this.nullGeometryFeatures_) {
                delete this.nullGeometryFeatures_[featureKey];
            }
            else {
                if (this.featuresRtree_) {
                    this.featuresRtree_.remove(feature);
                }
            }
            var result = this.removeFeatureInternal(feature);
            if (result) {
                this.changed();
            }
        };
        /**
         * Remove feature without firing a `change` event.
         * @param {import("../Feature.js").default<Geometry>} feature Feature.
         * @return {import("../Feature.js").default<Geometry>|undefined} The removed feature
         *     (or undefined if the feature was not found).
         * @protected
         */
        VectorSource.prototype.removeFeatureInternal = function (feature) {
            var featureKey = getUid(feature);
            var featureChangeKeys = this.featureChangeKeys_[featureKey];
            if (!featureChangeKeys) {
                return;
            }
            featureChangeKeys.forEach(unlistenByKey);
            delete this.featureChangeKeys_[featureKey];
            var id = feature.getId();
            if (id !== undefined) {
                delete this.idIndex_[id.toString()];
            }
            delete this.uidIndex_[featureKey];
            this.dispatchEvent(new VectorSourceEvent(VectorEventType.REMOVEFEATURE, feature));
            return feature;
        };
        /**
         * Remove a feature from the id index.  Called internally when the feature id
         * may have changed.
         * @param {import("../Feature.js").default<Geometry>} feature The feature.
         * @return {boolean} Removed the feature from the index.
         * @private
         */
        VectorSource.prototype.removeFromIdIndex_ = function (feature) {
            var removed = false;
            for (var id in this.idIndex_) {
                if (this.idIndex_[id] === feature) {
                    delete this.idIndex_[id];
                    removed = true;
                    break;
                }
            }
            return removed;
        };
        /**
         * Set the new loader of the source. The next render cycle will use the
         * new loader.
         * @param {import("../featureloader.js").FeatureLoader} loader The loader to set.
         * @api
         */
        VectorSource.prototype.setLoader = function (loader) {
            this.loader_ = loader;
        };
        /**
         * Points the source to a new url. The next render cycle will use the new url.
         * @param {string|import("../featureloader.js").FeatureUrlFunction} url Url.
         * @api
         */
        VectorSource.prototype.setUrl = function (url) {
            assert(this.format_, 7); // `format` must be set when `url` is set
            this.url_ = url;
            this.setLoader(xhr(url, this.format_));
        };
        return VectorSource;
    }(Source$1));
    var VectorSource$1 = VectorSource;

    /**
     * @module ol/easing
     */
    /**
     * Start slow and speed up.
     * @param {number} t Input between 0 and 1.
     * @return {number} Output between 0 and 1.
     * @api
     */
    /**
     * Start slow, speed up, and then slow down again.
     * @param {number} t Input between 0 and 1.
     * @return {number} Output between 0 and 1.
     * @api
     */
    function inAndOut(t) {
        return 3 * t * t - 2 * t * t * t;
    }

    /**
     * @module ol/MapEventType
     */
    /**
     * @enum {string}
     */
    var MapEventType = {
        /**
         * Triggered after a map frame is rendered.
         * @event module:ol/MapEvent~MapEvent#postrender
         * @api
         */
        POSTRENDER: 'postrender',
        /**
         * Triggered when the map starts moving.
         * @event module:ol/MapEvent~MapEvent#movestart
         * @api
         */
        MOVESTART: 'movestart',
        /**
         * Triggered after the map is moved.
         * @event module:ol/MapEvent~MapEvent#moveend
         * @api
         */
        MOVEEND: 'moveend',
        /**
         * Triggered when loading of additional map data (tiles, images, features) starts.
         * @event module:ol/MapEvent~MapEvent#loadstart
         * @api
         */
        LOADSTART: 'loadstart',
        /**
         * Triggered when loading of additional map data has completed.
         * @event module:ol/MapEvent~MapEvent#loadend
         * @api
         */
        LOADEND: 'loadend',
    };
    /***
     * @typedef {'postrender'|'movestart'|'moveend'|'loadstart'|'loadend'} Types
     */

    var __extends$1 = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            if (typeof b !== "function" && b !== null)
                throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * @typedef {Object} Options
     * @property {HTMLElement} [element] The element is the control's
     * container element. This only needs to be specified if you're developing
     * a custom control.
     * @property {function(import("../MapEvent.js").default):void} [render] Function called when
     * the control should be re-rendered. This is called in a `requestAnimationFrame`
     * callback.
     * @property {HTMLElement|string} [target] Specify a target if you want
     * the control to be rendered outside of the map's viewport.
     */
    /**
     * @classdesc
     * A control is a visible widget with a DOM element in a fixed position on the
     * screen. They can involve user input (buttons), or be informational only;
     * the position is determined using CSS. By default these are placed in the
     * container with CSS class name `ol-overlaycontainer-stopevent`, but can use
     * any outside DOM element.
     *
     * This is the base class for controls. You can use it for simple custom
     * controls by creating the element with listeners, creating an instance:
     * ```js
     * var myControl = new Control({element: myElement});
     * ```
     * and then adding this to the map.
     *
     * The main advantage of having this as a control rather than a simple separate
     * DOM element is that preventing propagation is handled for you. Controls
     * will also be objects in a {@link module:ol/Collection~Collection}, so you can use their methods.
     *
     * You can also extend this base for your own control class. See
     * examples/custom-controls for an example of how to do this.
     *
     * @api
     */
    var Control = /** @class */ (function (_super) {
        __extends$1(Control, _super);
        /**
         * @param {Options} options Control options.
         */
        function Control(options) {
            var _this = _super.call(this) || this;
            var element = options.element;
            if (element && !options.target && !element.style.pointerEvents) {
                element.style.pointerEvents = 'auto';
            }
            /**
             * @protected
             * @type {HTMLElement}
             */
            _this.element = element ? element : null;
            /**
             * @private
             * @type {HTMLElement}
             */
            _this.target_ = null;
            /**
             * @private
             * @type {import("../PluggableMap.js").default|null}
             */
            _this.map_ = null;
            /**
             * @protected
             * @type {!Array<import("../events.js").EventsKey>}
             */
            _this.listenerKeys = [];
            if (options.render) {
                _this.render = options.render;
            }
            if (options.target) {
                _this.setTarget(options.target);
            }
            return _this;
        }
        /**
         * Clean up.
         */
        Control.prototype.disposeInternal = function () {
            removeNode(this.element);
            _super.prototype.disposeInternal.call(this);
        };
        /**
         * Get the map associated with this control.
         * @return {import("../PluggableMap.js").default|null} Map.
         * @api
         */
        Control.prototype.getMap = function () {
            return this.map_;
        };
        /**
         * Remove the control from its current map and attach it to the new map.
         * Pass `null` to just remove the control from the current map.
         * Subclasses may set up event handlers to get notified about changes to
         * the map here.
         * @param {import("../PluggableMap.js").default|null} map Map.
         * @api
         */
        Control.prototype.setMap = function (map) {
            if (this.map_) {
                removeNode(this.element);
            }
            for (var i = 0, ii = this.listenerKeys.length; i < ii; ++i) {
                unlistenByKey(this.listenerKeys[i]);
            }
            this.listenerKeys.length = 0;
            this.map_ = map;
            if (map) {
                var target = this.target_
                    ? this.target_
                    : map.getOverlayContainerStopEvent();
                target.appendChild(this.element);
                if (this.render !== VOID) {
                    this.listenerKeys.push(listen(map, MapEventType.POSTRENDER, this.render, this));
                }
                map.render();
            }
        };
        /**
         * Renders the control.
         * @param {import("../MapEvent.js").default} mapEvent Map event.
         * @api
         */
        Control.prototype.render = function (mapEvent) { };
        /**
         * This function is used to set a target element for the control. It has no
         * effect if it is called after the control has been added to the map (i.e.
         * after `setMap` is called on the control). If no `target` is set in the
         * options passed to the control constructor and if `setTarget` is not called
         * then the control is added to the map's overlay container.
         * @param {HTMLElement|string} target Target.
         * @api
         */
        Control.prototype.setTarget = function (target) {
            this.target_ =
                typeof target === 'string' ? document.getElementById(target) : target;
        };
        return Control;
    }(BaseObject$1));
    var Control$1 = Control;

    var __extends = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            if (typeof b !== "function" && b !== null)
                throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /**
     * @typedef {'bottom-left' | 'bottom-center' | 'bottom-right' | 'center-left' | 'center-center' | 'center-right' | 'top-left' | 'top-center' | 'top-right'} Positioning
     * The overlay position: `'bottom-left'`, `'bottom-center'`,  `'bottom-right'`,
     * `'center-left'`, `'center-center'`, `'center-right'`, `'top-left'`,
     * `'top-center'`, or `'top-right'`.
     */
    /**
     * @typedef {Object} Options
     * @property {number|string} [id] Set the overlay id. The overlay id can be used
     * with the {@link module:ol/Map~Map#getOverlayById} method.
     * @property {HTMLElement} [element] The overlay element.
     * @property {Array<number>} [offset=[0, 0]] Offsets in pixels used when positioning
     * the overlay. The first element in the
     * array is the horizontal offset. A positive value shifts the overlay right.
     * The second element in the array is the vertical offset. A positive value
     * shifts the overlay down.
     * @property {import("./coordinate.js").Coordinate} [position] The overlay position
     * in map projection.
     * @property {Positioning} [positioning='top-left'] Defines how
     * the overlay is actually positioned with respect to its `position` property.
     * Possible values are `'bottom-left'`, `'bottom-center'`, `'bottom-right'`,
     * `'center-left'`, `'center-center'`, `'center-right'`, `'top-left'`,
     * `'top-center'`, and `'top-right'`.
     * @property {boolean} [stopEvent=true] Whether event propagation to the map
     * viewport should be stopped. If `true` the overlay is placed in the same
     * container as that of the controls (CSS class name
     * `ol-overlaycontainer-stopevent`); if `false` it is placed in the container
     * with CSS class name specified by the `className` property.
     * @property {boolean} [insertFirst=true] Whether the overlay is inserted first
     * in the overlay container, or appended. If the overlay is placed in the same
     * container as that of the controls (see the `stopEvent` option) you will
     * probably set `insertFirst` to `true` so the overlay is displayed below the
     * controls.
     * @property {PanIntoViewOptions|boolean} [autoPan=false] Pan the map when calling
     * `setPosition`, so that the overlay is entirely visible in the current viewport?
     * If `true` (deprecated), then `autoPanAnimation` and `autoPanMargin` will be
     * used to determine the panning parameters; if an object is supplied then other
     * parameters are ignored.
     * @property {PanOptions} [autoPanAnimation] The animation options used to pan
     * the overlay into view. This animation is only used when `autoPan` is enabled.
     * A `duration` and `easing` may be provided to customize the animation.
     * Deprecated and ignored if `autoPan` is supplied as an object.
     * @property {number} [autoPanMargin=20] The margin (in pixels) between the
     * overlay and the borders of the map when autopanning. Deprecated and ignored
     * if `autoPan` is supplied as an object.
     * @property {PanIntoViewOptions} [autoPanOptions] The options to use for the
     * autoPan. This is only used when `autoPan` is enabled and has preference over
     * the individual `autoPanMargin` and `autoPanOptions`.
     * @property {string} [className='ol-overlay-container ol-selectable'] CSS class
     * name.
     */
    /**
     * @typedef {Object} PanOptions
     * @property {number} [duration=1000] The duration of the animation in
     * milliseconds.
     * @property {function(number):number} [easing] The easing function to use. Can
     * be one from {@link module:ol/easing} or a custom function.
     * Default is {@link module:ol/easing.inAndOut}.
     */
    /**
     * @typedef {Object} PanIntoViewOptions
     * @property {PanOptions} [animation={}] The animation parameters for the pan
     * @property {number} [margin=20] The margin (in pixels) between the
     * overlay and the borders of the map when panning into view.
     */
    /**
     * @enum {string}
     * @protected
     */
    var Property = {
        ELEMENT: 'element',
        MAP: 'map',
        OFFSET: 'offset',
        POSITION: 'position',
        POSITIONING: 'positioning',
    };
    /**
     * @typedef {import("./ObjectEventType").Types|'change:element'|'change:map'|'change:offset'|'change:position'|
     *   'change:positioning'} OverlayObjectEventTypes
     */
    /***
     * @template Return
     * @typedef {import("./Observable").OnSignature<import("./Observable").EventTypes, import("./events/Event.js").default, Return> &
     *   import("./Observable").OnSignature<OverlayObjectEventTypes, import("./Object").ObjectEvent, Return> &
     *   import("./Observable").CombinedOnSignature<import("./Observable").EventTypes|OverlayObjectEventTypes, Return>} OverlayOnSignature
     */
    /**
     * @classdesc
     * An element to be displayed over the map and attached to a single map
     * location.  Like {@link module:ol/control/Control~Control}, Overlays are
     * visible widgets. Unlike Controls, they are not in a fixed position on the
     * screen, but are tied to a geographical coordinate, so panning the map will
     * move an Overlay but not a Control.
     *
     * Example:
     *
     *     import Overlay from 'ol/Overlay';
     *
     *     var popup = new Overlay({
     *       element: document.getElementById('popup')
     *     });
     *     popup.setPosition(coordinate);
     *     map.addOverlay(popup);
     *
     * @api
     */
    var Overlay = /** @class */ (function (_super) {
        __extends(Overlay, _super);
        /**
         * @param {Options} options Overlay options.
         */
        function Overlay(options) {
            var _this = _super.call(this) || this;
            /***
             * @type {OverlayOnSignature<import("./events").EventsKey>}
             */
            _this.on;
            /***
             * @type {OverlayOnSignature<import("./events").EventsKey>}
             */
            _this.once;
            /***
             * @type {OverlayOnSignature<void>}
             */
            _this.un;
            /**
             * @protected
             * @type {Options}
             */
            _this.options = options;
            /**
             * @protected
             * @type {number|string|undefined}
             */
            _this.id = options.id;
            /**
             * @protected
             * @type {boolean}
             */
            _this.insertFirst =
                options.insertFirst !== undefined ? options.insertFirst : true;
            /**
             * @protected
             * @type {boolean}
             */
            _this.stopEvent = options.stopEvent !== undefined ? options.stopEvent : true;
            /**
             * @protected
             * @type {HTMLElement}
             */
            _this.element = document.createElement('div');
            _this.element.className =
                options.className !== undefined
                    ? options.className
                    : 'ol-overlay-container ' + CLASS_SELECTABLE;
            _this.element.style.position = 'absolute';
            _this.element.style.pointerEvents = 'auto';
            var autoPan = options.autoPan;
            if (autoPan && 'object' !== typeof autoPan) {
                autoPan = {
                    animation: options.autoPanAnimation,
                    margin: options.autoPanMargin,
                };
            }
            /**
             * @protected
             * @type {PanIntoViewOptions|false}
             */
            _this.autoPan = /** @type {PanIntoViewOptions} */ (autoPan) || false;
            /**
             * @protected
             * @type {{transform_: string,
             *         visible: boolean}}
             */
            _this.rendered = {
                transform_: '',
                visible: true,
            };
            /**
             * @protected
             * @type {?import("./events.js").EventsKey}
             */
            _this.mapPostrenderListenerKey = null;
            _this.addChangeListener(Property.ELEMENT, _this.handleElementChanged);
            _this.addChangeListener(Property.MAP, _this.handleMapChanged);
            _this.addChangeListener(Property.OFFSET, _this.handleOffsetChanged);
            _this.addChangeListener(Property.POSITION, _this.handlePositionChanged);
            _this.addChangeListener(Property.POSITIONING, _this.handlePositioningChanged);
            if (options.element !== undefined) {
                _this.setElement(options.element);
            }
            _this.setOffset(options.offset !== undefined ? options.offset : [0, 0]);
            _this.setPositioning(options.positioning || 'top-left');
            if (options.position !== undefined) {
                _this.setPosition(options.position);
            }
            return _this;
        }
        /**
         * Get the DOM element of this overlay.
         * @return {HTMLElement|undefined} The Element containing the overlay.
         * @observable
         * @api
         */
        Overlay.prototype.getElement = function () {
            return /** @type {HTMLElement|undefined} */ (this.get(Property.ELEMENT));
        };
        /**
         * Get the overlay identifier which is set on constructor.
         * @return {number|string|undefined} Id.
         * @api
         */
        Overlay.prototype.getId = function () {
            return this.id;
        };
        /**
         * Get the map associated with this overlay.
         * @return {import("./PluggableMap.js").default|null} The map that the
         * overlay is part of.
         * @observable
         * @api
         */
        Overlay.prototype.getMap = function () {
            return /** @type {import("./PluggableMap.js").default|null} */ (this.get(Property.MAP) || null);
        };
        /**
         * Get the offset of this overlay.
         * @return {Array<number>} The offset.
         * @observable
         * @api
         */
        Overlay.prototype.getOffset = function () {
            return /** @type {Array<number>} */ (this.get(Property.OFFSET));
        };
        /**
         * Get the current position of this overlay.
         * @return {import("./coordinate.js").Coordinate|undefined} The spatial point that the overlay is
         *     anchored at.
         * @observable
         * @api
         */
        Overlay.prototype.getPosition = function () {
            return /** @type {import("./coordinate.js").Coordinate|undefined} */ (this.get(Property.POSITION));
        };
        /**
         * Get the current positioning of this overlay.
         * @return {Positioning} How the overlay is positioned
         *     relative to its point on the map.
         * @observable
         * @api
         */
        Overlay.prototype.getPositioning = function () {
            return /** @type {Positioning} */ (this.get(Property.POSITIONING));
        };
        /**
         * @protected
         */
        Overlay.prototype.handleElementChanged = function () {
            removeChildren(this.element);
            var element = this.getElement();
            if (element) {
                this.element.appendChild(element);
            }
        };
        /**
         * @protected
         */
        Overlay.prototype.handleMapChanged = function () {
            if (this.mapPostrenderListenerKey) {
                removeNode(this.element);
                unlistenByKey(this.mapPostrenderListenerKey);
                this.mapPostrenderListenerKey = null;
            }
            var map = this.getMap();
            if (map) {
                this.mapPostrenderListenerKey = listen(map, MapEventType.POSTRENDER, this.render, this);
                this.updatePixelPosition();
                var container = this.stopEvent
                    ? map.getOverlayContainerStopEvent()
                    : map.getOverlayContainer();
                if (this.insertFirst) {
                    container.insertBefore(this.element, container.childNodes[0] || null);
                }
                else {
                    container.appendChild(this.element);
                }
                this.performAutoPan();
            }
        };
        /**
         * @protected
         */
        Overlay.prototype.render = function () {
            this.updatePixelPosition();
        };
        /**
         * @protected
         */
        Overlay.prototype.handleOffsetChanged = function () {
            this.updatePixelPosition();
        };
        /**
         * @protected
         */
        Overlay.prototype.handlePositionChanged = function () {
            this.updatePixelPosition();
            this.performAutoPan();
        };
        /**
         * @protected
         */
        Overlay.prototype.handlePositioningChanged = function () {
            this.updatePixelPosition();
        };
        /**
         * Set the DOM element to be associated with this overlay.
         * @param {HTMLElement|undefined} element The Element containing the overlay.
         * @observable
         * @api
         */
        Overlay.prototype.setElement = function (element) {
            this.set(Property.ELEMENT, element);
        };
        /**
         * Set the map to be associated with this overlay.
         * @param {import("./PluggableMap.js").default|null} map The map that the
         * overlay is part of. Pass `null` to just remove the overlay from the current map.
         * @observable
         * @api
         */
        Overlay.prototype.setMap = function (map) {
            this.set(Property.MAP, map);
        };
        /**
         * Set the offset for this overlay.
         * @param {Array<number>} offset Offset.
         * @observable
         * @api
         */
        Overlay.prototype.setOffset = function (offset) {
            this.set(Property.OFFSET, offset);
        };
        /**
         * Set the position for this overlay. If the position is `undefined` the
         * overlay is hidden.
         * @param {import("./coordinate.js").Coordinate|undefined} position The spatial point that the overlay
         *     is anchored at.
         * @observable
         * @api
         */
        Overlay.prototype.setPosition = function (position) {
            this.set(Property.POSITION, position);
        };
        /**
         * Pan the map so that the overlay is entirely visible in the current viewport
         * (if necessary) using the configured autoPan parameters
         * @protected
         */
        Overlay.prototype.performAutoPan = function () {
            if (this.autoPan) {
                this.panIntoView(this.autoPan);
            }
        };
        /**
         * Pan the map so that the overlay is entirely visible in the current viewport
         * (if necessary).
         * @param {PanIntoViewOptions} [opt_panIntoViewOptions] Options for the pan action
         * @api
         */
        Overlay.prototype.panIntoView = function (opt_panIntoViewOptions) {
            var map = this.getMap();
            if (!map || !map.getTargetElement() || !this.get(Property.POSITION)) {
                return;
            }
            var mapRect = this.getRect(map.getTargetElement(), map.getSize());
            var element = this.getElement();
            var overlayRect = this.getRect(element, [
                outerWidth(element),
                outerHeight(element),
            ]);
            var panIntoViewOptions = opt_panIntoViewOptions || {};
            var myMargin = panIntoViewOptions.margin === undefined ? 20 : panIntoViewOptions.margin;
            if (!containsExtent(mapRect, overlayRect)) {
                // the overlay is not completely inside the viewport, so pan the map
                var offsetLeft = overlayRect[0] - mapRect[0];
                var offsetRight = mapRect[2] - overlayRect[2];
                var offsetTop = overlayRect[1] - mapRect[1];
                var offsetBottom = mapRect[3] - overlayRect[3];
                var delta = [0, 0];
                if (offsetLeft < 0) {
                    // move map to the left
                    delta[0] = offsetLeft - myMargin;
                }
                else if (offsetRight < 0) {
                    // move map to the right
                    delta[0] = Math.abs(offsetRight) + myMargin;
                }
                if (offsetTop < 0) {
                    // move map up
                    delta[1] = offsetTop - myMargin;
                }
                else if (offsetBottom < 0) {
                    // move map down
                    delta[1] = Math.abs(offsetBottom) + myMargin;
                }
                if (delta[0] !== 0 || delta[1] !== 0) {
                    var center = /** @type {import("./coordinate.js").Coordinate} */ (map.getView().getCenterInternal());
                    var centerPx = map.getPixelFromCoordinateInternal(center);
                    if (!centerPx) {
                        return;
                    }
                    var newCenterPx = [centerPx[0] + delta[0], centerPx[1] + delta[1]];
                    var panOptions = panIntoViewOptions.animation || {};
                    map.getView().animateInternal({
                        center: map.getCoordinateFromPixelInternal(newCenterPx),
                        duration: panOptions.duration,
                        easing: panOptions.easing,
                    });
                }
            }
        };
        /**
         * Get the extent of an element relative to the document
         * @param {HTMLElement} element The element.
         * @param {import("./size.js").Size} size The size of the element.
         * @return {import("./extent.js").Extent} The extent.
         * @protected
         */
        Overlay.prototype.getRect = function (element, size) {
            var box = element.getBoundingClientRect();
            var offsetX = box.left + window.pageXOffset;
            var offsetY = box.top + window.pageYOffset;
            return [offsetX, offsetY, offsetX + size[0], offsetY + size[1]];
        };
        /**
         * Set the positioning for this overlay.
         * @param {Positioning} positioning how the overlay is
         *     positioned relative to its point on the map.
         * @observable
         * @api
         */
        Overlay.prototype.setPositioning = function (positioning) {
            this.set(Property.POSITIONING, positioning);
        };
        /**
         * Modify the visibility of the element.
         * @param {boolean} visible Element visibility.
         * @protected
         */
        Overlay.prototype.setVisible = function (visible) {
            if (this.rendered.visible !== visible) {
                this.element.style.display = visible ? '' : 'none';
                this.rendered.visible = visible;
            }
        };
        /**
         * Update pixel position.
         * @protected
         */
        Overlay.prototype.updatePixelPosition = function () {
            var map = this.getMap();
            var position = this.getPosition();
            if (!map || !map.isRendered() || !position) {
                this.setVisible(false);
                return;
            }
            var pixel = map.getPixelFromCoordinate(position);
            var mapSize = map.getSize();
            this.updateRenderedPosition(pixel, mapSize);
        };
        /**
         * @param {import("./pixel.js").Pixel} pixel The pixel location.
         * @param {import("./size.js").Size|undefined} mapSize The map size.
         * @protected
         */
        Overlay.prototype.updateRenderedPosition = function (pixel, mapSize) {
            var style = this.element.style;
            var offset = this.getOffset();
            var positioning = this.getPositioning();
            this.setVisible(true);
            var x = Math.round(pixel[0] + offset[0]) + 'px';
            var y = Math.round(pixel[1] + offset[1]) + 'px';
            var posX = '0%';
            var posY = '0%';
            if (positioning == 'bottom-right' ||
                positioning == 'center-right' ||
                positioning == 'top-right') {
                posX = '-100%';
            }
            else if (positioning == 'bottom-center' ||
                positioning == 'center-center' ||
                positioning == 'top-center') {
                posX = '-50%';
            }
            if (positioning == 'bottom-left' ||
                positioning == 'bottom-center' ||
                positioning == 'bottom-right') {
                posY = '-100%';
            }
            else if (positioning == 'center-left' ||
                positioning == 'center-center' ||
                positioning == 'center-right') {
                posY = '-50%';
            }
            var transform = "translate(".concat(posX, ", ").concat(posY, ") translate(").concat(x, ", ").concat(y, ")");
            if (this.rendered.transform_ != transform) {
                this.rendered.transform_ = transform;
                style.transform = transform;
                // @ts-ignore IE9
                style.msTransform = transform;
            }
        };
        /**
         * returns the options this Overlay has been created with
         * @return {Options} overlay options
         */
        Overlay.prototype.getOptions = function () {
            return this.options;
        };
        return Overlay;
    }(BaseObject$1));
    var Overlay$1 = Overlay;

    // For converting the map rotation (in radians) to degrees.

    // For converting the heading (in degrees) to radians.
    function degToRad(deg) {
      return (deg * Math.PI * 2) / 360;
    }

    // Modulo for negative values
    function negMod(n) {
      return ((n % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    }

    // Takes an ol LinestString as the trail, plus a heading in degrees, to calculate
    // the rotation value in the format ol prefers.
    function calcRotation(previous, heading) {
      const rotation = degToRad(heading);
      const prevRotation = previous && previous[2];

      if (typeof prevRotation !== 'number') return rotation;

      // Force the rotation change to be less than 180°.
      let rotationDelta = rotation - negMod(prevRotation);
      if (Math.abs(rotationDelta) > Math.PI) {
        const sign = rotationDelta >= 0 ? 1 : -1;
        rotationDelta = -sign * (2 * Math.PI - Math.abs(rotationDelta));
      }
      return prevRotation + rotationDelta;
    }

    var cancelIconSVG = "<svg viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\">\n  <mask id=\"ring\">\n    <rect x=\"0\" y=\"0\" width=\"24\" height=\"24\" fill=\"white\"/>\n    <circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"black\" stroke=\"none\"/>\n  </mask>\n  <circle cx=\"12\" cy=\"12\" r=\"12\" fill=\"white\" stroke=\"none\" mask=\"url(#ring)\"/>\n  <circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"rgba(0,0,0,.2)\" stroke=\"none\"/>\n  <path\n    fill=\"white\"\n    d=\"M8,4 l0,16 l2,0 l0,-16 z\"\n    transform=\"translate(3,0) rotate(-45,9,12)\"/>\n  <path\n    fill=\"white\"\n    d=\"M16,4 l0,16 l-2,0 l0,-16 z\"\n    transform=\"translate(-3,0) rotate(45,15,12)\"/>\n</svg>";

    var pauseIconAnimatedSVG = "<svg viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\">\n  <mask id=\"ring\">\n    <rect x=\"0\" y=\"0\" width=\"24\" height=\"24\" fill=\"white\"/>\n    <circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"black\" stroke=\"none\"/>\n  </mask>\n  <circle cx=\"12\" cy=\"12\" r=\"12\" fill=\"white\" stroke=\"none\" mask=\"url(#ring)\"/>\n  <circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"rgba(0,0,0,.2)\" stroke=\"none\"/>\n  <path fill=\"white\" d=\"M7,5 l0,14 l3,0 l0,-14 z\">\n    <animate\n      attributeName=\"d\"\n      from=\"M12,3 l-7,15 l.71,.71 l6.29,-2.71 z\"\n      to=\"M7,5 l0,14 l3,0 l0,-14 z\"\n      dur=\"100ms\"\n      calcMode=\"linear\"\n      repeatCount=\"1\"/>\n  </path>\n  <path fill=\"white\" d=\"M17,5 l0,14 l-3,0 l0,-14 z\">\n    <animate\n      attributeName=\"d\"\n      from=\"M12,3 l-7,15 l.71,.71 l6.29,-2.71 z\"\n      to=\"M17,5 l0,14 l-3,0 l0,-14 z\"\n      dur=\"100ms\"\n      calcMode=\"linear\"\n      repeatCount=\"1\"/>\n  </path>\n</svg>";

    var saveIconSVG = "<svg viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"white\">\n  <mask id=\"ring\">\n    <rect x=\"0\" y=\"0\" width=\"24\" height=\"24\" fill=\"white\"/>\n    <circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"black\" stroke=\"none\"/>\n  </mask>\n  <circle cx=\"12\" cy=\"12\" r=\"12\" fill=\"white\" stroke=\"none\" mask=\"url(#ring)\"/>\n  <circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"rgba(0,0,0,.2)\" stroke=\"none\"/>\n\n  <!--\n      The path of the disk image is drawn in 3 stages via d-attr commands:\n      1. Disk outline\n      2. Circular cutout\n      3. Rectangular cutout\n  -->\n  <path\n    d=\"\n      M 15,5\n      H 7\n      c -1.11,0 -2,.9 -2,2\n      v 10\n      c 0,1.1 .89,2 2,2\n      h 10\n      c 1.11,0 2,-.9 2,-2\n      V 8\n      l -3,-3\n      z\n\n      m -3,12\n      c -1.11,0 -2,-0.89 -2,-2\n      s 0.89,-2 2,-2 2,0.89 2,2 -0.89,2 -2,2\n      z\n\n      m 3,-7\n      H 7\n      V 7\n      h 7\n      v 4\n      z\"/>\n</svg>";

    var startIconSVG = "<svg viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\">\n  <mask id=\"ring\">\n    <rect x=\"0\" y=\"0\" width=\"24\" height=\"24\" fill=\"white\"/>\n    <circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"black\" stroke=\"none\"/>\n  </mask>\n  <circle cx=\"12\" cy=\"12\" r=\"12\" fill=\"white\" stroke=\"none\" mask=\"url(#ring)\"/>\n  <circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"rgba(0,0,0,.2)\" stroke=\"none\"/>\n  <path\n    fill=\"white\"\n    class=\"left\"\n    d=\"M12,3 l-7,15 l.71,.71 l6.29,-2.71 z\"/>\n  <path\n    fill=\"white\"\n    class=\"right\"\n    d=\"M12,3 l7,15 l-.71,.71 l-6.29,-2.71 z\"/>\n</svg>";

    var startIconAnimatedSVG = "<svg viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\">\n  <mask id=\"ring\">\n    <rect x=\"0\" y=\"0\" width=\"24\" height=\"24\" fill=\"white\"/>\n    <circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"black\" stroke=\"none\"/>\n  </mask>\n  <circle cx=\"12\" cy=\"12\" r=\"12\" fill=\"white\" stroke=\"none\" mask=\"url(#ring)\"/>\n  <circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"rgba(0,0,0,.2)\" stroke=\"none\"/>\n  <path fill=\"white\" d=\"M12,3 l-7,15 l.71,.71 l6.29,-2.71 z\">\n    <animate\n      attributeName=\"d\"\n      from=\"M7,5 l0,14 l3,0 l0,-14 z\"\n      to=\"M12,3 l-7,15 l.71,.71 l6.29,-2.71 z\"\n      dur=\"100ms\"\n      calcMode=\"linear\"\n      repeatCount=\"1\"/>\n  </path>\n  <path fill=\"white\" d=\"M12,3 l7,15 l-.71,.71 l-6.29,-2.71 z\">\n    <animate\n      attributeName=\"d\"\n      from=\"M17,5 l0,14 l-3,0 l0,-14 z\"\n      to=\"M12,3 l-7,15 l.71,.71 l6.29,-2.71 z\"\n      dur=\"100ms\"\n      calcMode=\"linear\"\n      repeatCount=\"1\"/>\n  </path>\n</svg>";

    var markerSVG = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"24\" viewBox=\"0 0 24 24\" width=\"24\">\n  <circle cx=\"12\" cy=\"16\" r=\"6\" fill=\"green\" stroke=\"none\"/>\n</svg>";

    var markerHeadingSVG = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"24\" viewBox=\"0 0 24 24\" width=\"24\">\n  <mask id=\"arc\">\n    <rect x=\"0\" y=\"0\" width=\"24\" height=\"24\" fill=\"white\"/>\n    <circle cx=\"12\" cy=\"16\" r=\"8\" fill=\"black\" stroke=\"none\"/>\n  </mask>\n  <polygon fill=\"green\" points=\"12 2, 18 12, 6 12\" mask=\"url(#arc)\"/>\n  <circle cx=\"12\" cy=\"16\" r=\"6\" fill=\"green\" stroke=\"none\"/>\n</svg>";

    /**
     * Based on https://github.com/openlayers/openlayers/blob/main/examples/geolocation-orientation.js
     */


    function* geotrace(map, options = {}) {
      const view = map.getView();
      const baseLayer = options.layer || map.getAllLayers()
        .find(layer => layer.getProperties().type === 'base');

      // An unaltered history of all observed positions, even if they are excluded
      // from the trail b/c the tracing operation was paused.
      const positionHistory = [];

      // A temporary geometry showing the path of travel during the geotracing
      // operation itself. A separate geometry will be reconstructed from the
      // position history when geotracing concludes, but this preview will be
      // updated in the postrender callback (updateView) as positions are recorded.
      const preview = new LineString$1([], 'XY');
      const previewLayer = new VectorLayer$1({
        title: 'Geotracing Preview',
        visible: true,
        source: new VectorSource$1({
          features: [new Feature$1({
            type: 'preview',
            geometry: preview,
          })],
        }),
        style: new Style$1({
          stroke: new Stroke$1({
            width: 6,
            color: [51, 153, 255, 1],
          }),
        }),
      });
      map.addLayer(previewLayer);

      // Geolocation marker
      const markerEl = document.createElement('div');
      markerEl.id = 'trace-marker';
      markerEl.innerHTML = markerSVG;
      const marker = new Overlay$1({
        positioning: 'center-center',
        element: markerEl,
        stopEvent: false,
        autoPan: {
          margin: 20,
          animation: {
            duration: 1000,
            easing: inAndOut,
          },
        },
      });
      map.addOverlay(marker);

      let showHeadingPrev = false;
      function updateMarkerIcon(rotation) {
        const showHeadingNext = typeof rotation === 'number';
        if (showHeadingPrev !== showHeadingNext) {
          markerEl.innerHTML = showHeadingNext ? markerHeadingSVG : markerSVG;
          showHeadingPrev = showHeadingNext;
        }
      }

      // This sample geometry is never displayed and only contains the range of
      // positions between the last one recoreded in the position history, and the
      // previous position added to the sample geometry. This trail is used to
      // interpolate sample coordinates within that range during the postrender
      // callback (ie, updateView), providing a smoother animation for the preview
      // preview trail and marker element. Therefore, the range of coordinates are
      // overwritten periodically, whenever a new position is recorded. The geometry
      // itself is an OL LineString, where X = longitude, Y = latitude, Z = rotation
      // (in radians, as opposed to the heading, which is in degrees), and M =
      // timestamp (in milliseconds). M does not correspond to the geolocation's
      // positional timestamp, but rather the time of rendering, so as to render the
      // easing effect on the geometry's transition.
      const sampleTrail = new LineString$1([], 'XYZM');

      // This sample history maps the rendering timestamps to their corresponding
      // positional timestamps from geolocation events, since they're not directly
      // correlated.
      const sampleHistory = new Map();

      // The average interval (in milliseconds) between geolocation updates, half a
      // second to start, but recalculated each time based on the past 20 updates.
      let meanSamplingRate = 500;
      const sampleSize = 20;

      // Because the sampled coordinates correspond neither to the position history,
      // nor the set coordinates of the sample trail (b/c they can be interpolated),
      // nor to the coordinates of the preview trail when the tracer is paused, the
      // last sampling timstamp must be stored in a separate piece of state.
      let lastSampleTimestamp = 0;

      // Callback for the base layer's postrender event.
      function updateView() {
        // Get the last positional timestamp from history; bail if there is none.
        const [{ timestamp: latestTS } = {}] = positionHistory.slice(-1);
        if (!latestTS) return;

        // Store the current timestamp in local state, then determine where to
        // sample coordinates from the trail, by calculating a point roughly halfway
        // between now and previous sample, based on the mean sampling rate. Then
        // store the sample's timestamp for the next call.
        const now = Date.now();
        const sampleTS = lastSampleTimestamp === 0 ? now
          : Math.max(now - meanSamplingRate * 1.5, lastSampleTimestamp);
        lastSampleTimestamp = sampleTS;

        // Before sampling coordinates from the trail, detect whether there have
        // been any new positions added to the history, and if so, adjust the
        // geometry accordingly. Ideally there should only be one new position added
        // at a time, but to be safe, make sure to include all new positions, and
        // adjust their timestamps by a proportion of the difference between the
        // last timestamp and now (ie, the "strid").
        if (!sampleHistory.has(latestTS)) {
          const lastUpdatedPosition = positionHistory
            .findLast(p => sampleHistory.has(p.timestamp));
          const { timestamp: lastUpdatedTS = 0 } = lastUpdatedPosition || {};
          const samplePositions = positionHistory.filter(p => p.timestamp > lastUpdatedTS);
          const lastCoord = sampleTrail.getLastCoordinate();
          const [,,, lastCoordTS = now - meanSamplingRate] = lastCoord;
          const stride = (now - lastCoordTS) / samplePositions.length;
          const initCoords = lastCoord.length > 0 ? [lastCoord] : [];
          const trailCoords = samplePositions.reduce((coords, position, i) => {
            const {
              coords: { heading, latitude, longitude } = {},
            } = position;
            const previous = coords[coords.length - 1];
            const rotation = calcRotation(previous, heading);
            const ts = lastCoordTS + (i + 1) * stride;
            sampleHistory.set(position.timestamp, ts);
            return [
              ...coords,
              [longitude, latitude, rotation, ts],
            ];
          }, initCoords);

          // Overwrite the trail coordinates.
          sampleTrail.setCoordinates(trailCoords);

          // Reset the mean samplng rate as well.
          if (positionHistory.length >= 2) {
            const [{ timestamp: earliestTS }] = positionHistory.slice(-sampleSize);
            const actualSampleSize = Math.min(positionHistory.length, sampleSize);
            meanSamplingRate = (latestTS - earliestTS) / actualSampleSize;
          }
        }

        // Now that the geometry is ensured to have the latest position history,
        // take the sample coordinates.
        const sample = sampleTrail.getCoordinateAtM(sampleTS, true);
        if (!Array.isArray(sample)) return;

        // Format the sample coordinates the way OpenLayers likes.
        const [lon, lat, rotation] = sample;
        const coords = fromLonLat([lon, lat]);

        // Update the marker's position and icon.
        marker.setPosition(coords);
        updateMarkerIcon(rotation);

        // Determine if the sampled coords should be added to the preview trail
        // based on whether the nearest previous position set the omit flag or not.
        // Setting the omit flag is equivalent to "pausing" the geotracer.
        const nearestPosition = positionHistory.reduce((nearest, position) => {
          const sampleTimestamp = sampleHistory.get(position.timestamp);
          if (!sampleTimestamp || sampleTimestamp > sampleTS) return nearest;
          const nearestSTS = sampleHistory.get(nearest.timestamp);
          if (!nearestSTS || sampleTimestamp > nearestSTS) return position;
          return nearest;
        });
        if (!nearestPosition.omit) preview.appendCoordinate(coords);

        // Recenter and rotate the map view if that option is set to true. Otherwise
        // just rotate the marker overlay itself; the overlay will autopan if it
        // starts to go out of the viewbox.
        if (options.recenter) {
          view.setCenter(coords);
          view.setRotation(-rotation);
        } else {
          markerEl.style.rotate = `${rotation}rad`;
        }

        map.render();
      }

      let done = false;
      function updateGeolocation(position) {
        if (position) positionHistory.push(position);
        if (position && position.done) done = true;
        map.render();
      }

      /**
       * Using the postrender hook (postcompose in OL v. 5 or earlier) produces
       * a smoother animation, for whatever reason. Specific documentation on this
       * seems to be lacking, but it is illustrated in the example linked below.
       * @see https://openlayers.org/en/latest/examples/feature-move-animation.html
       */
      const renderKey = baseLayer.on(['postcompose', 'postrender'], updateView);
      map.render();

      while (!done) updateGeolocation(yield);

      unByKey(renderKey);
      map.removeOverlay(marker);
      map.removeLayer(previewLayer);
      map.render();

      return positionHistory;
    }

    /**
     * Safari doesn't support using the SVG drawing attribute (d) as a CSS property
     * in combination with the path() function, but CSS provides a much smoother
     * transition than the SVG <animate> element, so detect first if the browser
     * supports path() and use <animate> only as a fallback.
     * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d#using_d_as_a_css_property
     * @see https://caniuse.com/mdn-svg_elements_path_d_path
     */
    const cssDPathSupported = window.CSS.supports('(d: path("M0 0h24v24H0z"))');

    /**
     * Use this instead of spread syntax with GeolocationPosition instances, b/c it
     * inherits it's properties from up the prototype chain and has no enumerable
     * properties of its own. The same is true with GeolocationCoordinates.
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#description
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Enumerability_and_ownership_of_properties
     */
    function cloneGeolocation(position) {
      const { coords: rawCoords, timestamp } = position;
      const {
        accuracy, altitude, altitudeAccuracy, heading, latitude, longitude, speed,
      } = rawCoords;
      const coords = {
        accuracy, altitude, altitudeAccuracy, heading, latitude, longitude, speed,
      };
      return { coords, timestamp };
    }

    function geotraceCtrl(map, options = {}) {
      const tracer = geotrace(map, options);
      let paused = !options.immediateStart;

      const mainCtrl = document.createElement('button');
      mainCtrl.type = 'button';
      mainCtrl.name = 'trace';
      mainCtrl.className = 'ol-trace ol-trace-buttons';
      mainCtrl.title = 'Trace a Path';
      mainCtrl.innerHTML = markerHeadingSVG;

      const ctrlContainer = options.element || document.createElement('div');
      ctrlContainer.className = `ol-trace ${CLASS_UNSELECTABLE} ${CLASS_CONTROL}`;
      ctrlContainer.appendChild(mainCtrl);

      mainCtrl.addEventListener('click', () => {
        const viewPort = map.getViewport();
        const liveCtrlClassname = 'geotrace-live-ctrl';
        const liveCtrlsContainer = document.createElement('div');
        liveCtrlsContainer.className = `${liveCtrlClassname}s-container`;
        viewPort.appendChild(liveCtrlsContainer);

        const liveCtrls = document.createElement('div');
        liveCtrls.className = `${liveCtrlClassname}s`;
        liveCtrlsContainer.appendChild(liveCtrls);

        // These classes will be added or removed to the center control to animate
        // the icon state transition.
        const pauseBtnClassName = 'pause-btn';
        const resumeBtnClassName = 'resume-btn';

        // Transition states (as string constants) for the state machine below.
        const STANDBY = 'STANDBY';
        const START = 'START';
        const PAUSE = 'PAUSE';
        const RESUME = 'RESUME';
        const SAVE = 'SAVE';
        const CANCEL = 'CANCEL';

        // Set the initial state as a separate constant to avoid confusion.
        const INIT_STATE = STANDBY;

        // Live control button positions, also for the state machine.
        const LEFT = 'LEFT';
        const CENTER = 'CENTER';
        const RIGHT = 'RIGHT';

        // This is the single store of MUTABLE state for the entire lifespan of the
        // geotracing operation, reflecting one of the legal transition states
        // listed above. It also determines the selection and arrangement of the
        // live control buttons at any given time.
        let CURRENT_STATE = INIT_STATE;

        /**
         * A finite state machine for transitioning between various "live" tracing
         * states. A library like XState might be preferrable for a more rigorous
         * implementation, but this should suffice for now. It's also probably worth
         * evaluating if the geotrace generator function could be refactored as a
         * state machine like this, perhaps reusing major portions of this one.
         * @see https://xstate.js.org/docs/about/concepts.html#finite-state-machines
         * @see https://kentcdodds.com/blog/implementing-a-simple-state-machine-library-in-javascript
        */
        const controlStates = {
          [STANDBY]: {
            buttons: {
              [CENTER]: START,
              [RIGHT]: CANCEL,
            },
            action() {
              let zoomOnceComplete = false;
              function zoomOnce(position) {
                if (zoomOnceComplete || !position) return;
                const view = map.getView();
                const { coords: { latitude, longitude } = {} } = position;
                const coords = fromLonLat([longitude, latitude]);
                view.setCenter(coords);
                view.setZoom(19);
                zoomOnceComplete = true;
              }

              function simulatePositionChange(simTrail) {
                const [{ coords, timestamp } = {}, ...remaining] = simTrail;
                const position = { coords, timestamp, omit: paused };
                zoomOnce(position);
                const { value, done } = tracer.next(position) || {};
                if (done || remaining.length <= 0) return tracer.return(value);
                const [nextPosition] = remaining;
                const delay = nextPosition.timestamp - timestamp;
                const speed = options.simSpeed || 1;
                window.setTimeout(() => {
                  simulatePositionChange(remaining);
                }, delay * speed);
                return value;
              }

              if (Array.isArray(options.simulate)) {
                simulatePositionChange(options.simulate);
              } else {
                const {
                  maximumAge = 0, enableHighAccuracy = true, timeout = Infinity,
                } = options;
                const geolocOpts = { maximumAge, enableHighAccuracy, timeout };
                const watchId = navigator.geolocation.watchPosition((geoloc = {}) => {
                  const position = cloneGeolocation(geoloc);
                  const { done } = tracer.next({ ...position, omit: paused });
                  if (done) navigator.geolocation.clearWatch(watchId);
                  zoomOnce(position);
                }, null, geolocOpts);
              }
            },
          },
          [START]: {
            action() {
              paused = false;
            },
            buttons: {
              [LEFT]: SAVE,
              [CENTER]: PAUSE,
              [RIGHT]: CANCEL,
            },
            icon: cssDPathSupported ? startIconSVG : startIconAnimatedSVG,
            title: 'Start',
          },
          [PAUSE]: {
            action() {
              paused = true;
            },
            buttons: {
              [LEFT]: SAVE,
              [CENTER]: RESUME,
              [RIGHT]: CANCEL,
            },
            render(ctx) {
              if (!cssDPathSupported) ctx.element.innerHTML = pauseIconAnimatedSVG;
              ctx.element.title = 'Pause';
              ctx.element.classList.remove(resumeBtnClassName);
              ctx.element.classList.add(pauseBtnClassName);
            },
          },
          [RESUME]: {
            action() {
              paused = false;
            },
            buttons: {
              [LEFT]: SAVE,
              [CENTER]: PAUSE,
              [RIGHT]: CANCEL,
            },
            render(ctx) {
              if (!cssDPathSupported) ctx.element.innerHTML = startIconAnimatedSVG;
              ctx.element.title = 'Resume';
              ctx.element.classList.remove(pauseBtnClassName);
              ctx.element.classList.add(resumeBtnClassName);
            },
          },
          [SAVE]: {
            icon: saveIconSVG,
            title: 'Save',
            action() {
              tracer.next({ done: true });
              tracer.return();
            },
          },
          [CANCEL]: {
            icon: cancelIconSVG,
            title: 'Cancel',
            action() {
              tracer.next({ done: true });
              tracer.return();
            },
          },
        };

        // Store the control buttons DOM nodes and current listeners in a separate
        // state tree object.
        const controlButtons = [LEFT, CENTER, RIGHT].reduce((crtls, position) => {
          const element = document.createElement('div');
          element.type = 'button';
          const name = `${liveCtrlClassname}-${position.toLowerCase()}`;
          element.name = name;
          element.className = `${liveCtrlClassname} ${name}`;
          liveCtrls.appendChild(element);
          return {
            ...crtls,
            [position]: { element, listener: null },
          };
        }, {});

        // Helpers for adding and removing listeners whenever a state change occurs.
        function addButtonListener(position, listener) {
          const { [position]: btn } = controlButtons;
          btn.element.addEventListener('click', listener);
          btn.listener = listener;
        }
        function removeButtonListeners(state) {
          if (!controlStates[state] || !controlStates[state].buttons) return;
          Object.keys(controlStates[state].buttons).forEach((position) => {
            const { [position]: btn } = controlButtons;
            btn.element.removeEventListener('click', btn.listener);
            btn.listener = null;
          });
        }

        // The main function used to step through each state transition in the
        // finite state machine.
        function stepState(target, event) {
          if (!controlStates[target]) return;
          const state = CURRENT_STATE;
          const { [target]: { action, buttons = {} } } = controlStates;
          if (typeof action === 'function') action({ state, event });
          removeButtonListeners(state);
          Object.entries(buttons).forEach(([position, btnTarget]) => {
            if (!controlStates[btnTarget] || !controlButtons[position]) return;
            const { [btnTarget]: { icon, title, render } } = controlStates;
            const { [position]: { element } } = controlButtons;
            if (typeof icon === 'string') element.innerHTML = icon;
            if (typeof title === 'string') element.title = title;
            if (typeof render === 'function') render({ state, element, event });
            const listener = e => stepState(btnTarget, e);
            addButtonListener(position, listener);
          });
          CURRENT_STATE = target;
        }

        stepState(INIT_STATE);
        if (options.immediateStart) stepState(START);
      }, false);

      return new Control$1({ element: ctrlContainer });
    }

    exports.default = geotraceCtrl;
    exports.geotrace = geotrace;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
