// X3 Javascript framework
// Author Mark Dijkstra
// Version 1.0.0

// Available API's
//
// .on()
// .each()
// .hasClass()
// .addClass()
// .removeClass()

// How to use: X3('body').addClass('hello');

var X3 = (function () {

    'use strict';

    var docElm = document.querySelector('body');

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
        }else{
            this.nodes = Array.isArray ? selector : [selector];
        }
        //this.length = this.nodes.length;//moved to a getter
    };

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
        if(callback && typeof callback === 'function') {
            document.addEventListener("DOMContentLoaded", function() {
                if(document.readyState === "interactive" || document.readyState === "complete") {
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
     * Check if element has class
     * @param {String} className The class name
     */
    Constructor.prototype.hasClass = function (className) {
        if (docElm.classList) {
            this.classList.contains(className);
        }else {
            return (' ' + this.className + ' ').indexOf(' ' + className + ' ') > -1;
        }
    };

    /**
     * Add class(es) to elements
     * @param {String} className The class name
     */
    Constructor.prototype.addClass = function (className) {
        this.each(function (item) {
            if (docElm.classList) {
                var list = className.split(' ');
                item.classList.add(...list);
            }else{
                item.className += className;
            }
        });
        return this;
    };

    /**
     * Remove class(es) from elements
     * @param {String} className The class name
     */
    Constructor.prototype.removeClass = function (className) {
        this.each(function (item) {
            if (docElm.classList) {
                var list = className.split(' ');
                item.classList.remove(...list);
            }else{
                if (!item || !item.className) {
                    return false;
                }
                // var list = className.split(' ').join('|');
                // var regexp = new RegExp('\\b(' + list + ')\\b', 'gi');
                // item.className = item.className.replace(regexp, " ").replace(/\s{2,}/g, '');
                item.className = item.className.replace( new RegExp('\\b(' + className.split(' ').join('|') + ')\\b', 'gi') , " ").replace(/\s{2,}/g, '');
            }
        });
        return this;
    };

    /**
     * Remove/add class(es) from/to elements
     * @param {String} className The class name
     */
    Constructor.prototype.toggleClass = function (className) {
        this.each(function (item) {
            if(item.hasClass(className)){
                item.removeClass(className);
            }else{
                item.addClass(className);
            }
        });
        return this;
    };

    /**
     * Find the parents selector
     *
     * @param {String} selector The selector
     */
    Constructor.prototype.parents = function(selector) {
        var elements = [];
        this.each(function (item) {
            var isSelector = selector !== undefined;
            while ((item = item.parentElement) !== null) {
                if (item.nodeType !== Node.ELEMENT_NODE) {
                    continue;
                }
                if (!isSelector || item.matches(selector)) {
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
            for (var target = e.target; target && target != this; target = target.parentNode) {
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
