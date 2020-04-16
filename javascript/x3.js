// X3 Javascript framework
// Author Mark Dijkstra

// Available API's
//
// .each()
// .hasClass()
// .addClass()
// .removeClass()

// How to use: X3('body').addClass('hello');

var X3 = (function () {

    'use strict';

    var docElm = document.documentElement;

    /**
     * Create the constructor
     * @param {String} selector The selector to use
     */
    var Constructor = function (selector) {
        if (!selector) return;
        if (selector === 'document') {
            this.elems = [document];
        } else if (selector === 'window') {
            this.elems = [window];
        } else {
            this.elems = document.querySelectorAll(selector);
        }
    };

    /**
     * Run a callback on each item
     * @param  {Function} callback The callback function to run
     */
    Constructor.prototype.each = function (callback) {
        if (!callback || typeof callback !== 'function') return;
        for (var i = 0; i < this.elems.length; i++) {
            callback(this.elems[i], i);
        }
        return this;
    };

    /**
     * Check if element has class
     * @param {String} className The class name
     */
    Constructor.prototype.hasClass = function (className) {
        return (' ' + this.className + ' ').indexOf(' ' + className + ' ') > -1;
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
                var list = className.split(' ').join('|');
                var regexp = new RegExp('\\b(' + list + ')\\b', 'gi');
                item.className = item.className.replace(regexp, " ").replace(/\s{2,}/g, '');
            }
        });
        return this;
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
