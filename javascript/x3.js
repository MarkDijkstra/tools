/**
 * X3 Javascript framework
 * Author Mark Dijkstra
 * Version 1.0.0
 *
 * Available API's
 *
 * *** EVENTS ***
 *
 * .on()
 *
 * *** MANIPULATION ***
 *
 * .hasClass()
 * .addClass()
 * .removeClass()
 *
 * *** MISCELLANEOUS ***
 *
 * .each()
 *
 * *** TRAVERSING ***
 *
 * .parents()
 * .parent()
 *
 * How to use:
 * X3('body').addClass('hello');
*/
var X3 = (function () {

    'use strict';

    /**
     * Create the constructor
     * @param {String} selector The selector to use
     */
    var Constructor = function (selector) {
        if (!selector) return;
        if (selector === 'document') {
            this.nodes = [document];
        } else if (selector === 'window') {
            this.nodes = [window];
        } else if(typeof selector === 'string') {
            this.nodes = document.querySelectorAll(selector);
        } else {
            this.nodes = Array.isArray(selector) ? selector : [selector];
        }
        //this.length = this.nodes.length;//moved to a getter
    };

    /**
     * Matches() polyfill for older browsers (we want to target IE11)
     */
    if (!Element.prototype.matches) {
        Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
    };

    /**
     * Check if classList is present(for older browsers).
     */
    if (document.querySelector('body').classList) {
        var cList = true;
    }else{
        var cList = false
    }

    /**
     *
     * @param item
     * @param className
     * @returns {boolean}
     * @private
     */
    function _removeClass(item, className){
        if (cList) {
            var list = className.split(' ');
            item.classList.remove(...list);
        } else {
            if (!item || !item.className) {
                return false;
            }
            // var list = className.split(' ').join('|');
            // var regexp = new RegExp('\\b(' + list + ')\\b', 'gi');
            // item.className = item.className.replace(regexp, " ").replace(/\s{2,}/g, '');
            item.className = item.className.replace( new RegExp('\\b(' + className.split(' ').join('|') + ')\\b', 'gi') , " ").replace(/\s{2,}/g, '');
        }
    }

    /**
     *
     * @param item
     * @param className
     * @private
     */
    function _addClass(item, className){
        if (cList) {
            var list = className.split(' ');
            item.classList.add(...list);
        } else {
            item.className += className;
        }
    }

    /**
     *
     * @param item
     * @param className
     * @returns {boolean}
     * @private
     */
    function _hasClass(item, className){
        if (cList) {
            if (item.classList.contains(className)) {
                return true;
            }
        } else {
            if ((' ' + item.className + ' ').indexOf(' ' + className + ' ') > -1) {
                return true
            }
        }
        return false;
    }

    /**
     * Getters & setters
     */
    Constructor.prototype = {
        get length(){
            return this.nodes.length;
        }
    };

    /**
     * Run document ready
     * @param {Function} callback The callback function to run
     */
    Constructor.prototype.ready = function(callback) {
        if (callback && typeof callback === 'function') {
            document.addEventListener("DOMContentLoaded", function() {
                if (document.readyState === "interactive" || document.readyState === "complete") {
                    return callback();
                }
            });
        }
    };

    /**
     * Run a callback on each item
     * @param {Function} callback The callback function to run
     */
    Constructor.prototype.each = function (callback) {
        if (!callback || typeof callback !== 'function') return;
        for (var i = 0; i < this.nodes.length; i++) {
            callback(this.nodes[i], i);
        }
        return this;
    };

    /**
     * Removes elements from the nodes.
     * @param selector
     * @returns {Constructor}
     */
    Constructor.prototype.not = function (selector) {
        var elements = [];
        this.each(function (item) {
            if (item !== selector.nodes[0]) {
                elements.push(item);
            }
        });
        return new Constructor(elements);
    };

    /**
     * Check if element has class
     * @param {String} className The class name
     */
    Constructor.prototype.hasClass = function (className) {
        var present = false;
        this.each(function (item) {
             if (_hasClass(item, className)) {
                 present = true;
                 return false;
             };
        });
        return present;
    };

    /**
     * Add class(es) to elements
     * @param {String} className The class name
     */
    Constructor.prototype.addClass = function (className) {
        this.each(function (item) {
            _addClass(item, className);
        });
        return this;
    };

    /**
     * Remove class(es) from elements
     * @param {String} className The class name
     */
    Constructor.prototype.removeClass = function (className) {
        this.each(function (item) {
            _removeClass(item, className);
        });
        return this;
    };

    /**
     * Remove/add class(es) from/to elements
     * @param {String} className The class name
     */
    Constructor.prototype.toggleClass = function (className) {
        this.each(function (item) {
            if (_hasClass(item, className)) {
                _removeClass(item, className);
            }else{
                _addClass(item, className);
            }
        });
        return this;
    };

    /**
     * Find the parent selector
     *
     * @param {String} selector The selector
     */
     Constructor.prototype.parent = function(selector) {
         var element = '';
         this.each(function (item) {
             item = item.parentElement;
             if (item.nodeType !== Node.ELEMENT_NODE &&
                 selector === undefined ||
                 selector !== undefined && item.matches(selector)) {
                 element = item;
             }
             element = item;
         });
         return new Constructor(element);
     };

    /**
     * Find the parents selector
     *
     * @param {String} selector The selector
     */
    Constructor.prototype.parents = function(selector) {
        var elements = [];
        this.each(function (item) {
           // var isSelector = selector !== undefined;
            while ((item = item.parentElement) !== null) {
                if (item.nodeType !== Node.ELEMENT_NODE) {
                    continue;
                }
                if (selector === undefined || selector !== undefined && item.matches(selector)) {
                    elements.push(item);
                }
            }
        });
        // this.nodes = elements;
        // return this;
        return new Constructor(elements);
    };

    /**
     * Event delegation
     * @param {String} eventName The event name (like click)
     * @param {String} selector The selector
     * @param {Function} callback The callback function to run
     */
    Constructor.prototype.on = function (eventName , selector, callback) {
        document.addEventListener(eventName, function(e) {
            for (var target = e.target; target && target !== this; target = target.parentNode) {
                if (target.matches(selector)) {
                    callback.call(target, e);
                    break;
                }
            }
        }, false);
    };

    /**
     * Ajax stuff
     * @param  {String} url The URL to get
     */
    Constructor.prototype.ajax = function (url) {
        // WIP
        console.log(url);
    };

    /**
     * Instantiate a new constructor
     */
    var init = function (selector) {
        return new Constructor(selector);
    };

    /**
     * Return the constructor instantiation
     */
    return init;

})();
