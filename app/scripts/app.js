/**
 * Initializer for POPAYANJS
 * @type {Object}
 * @namespace POPAYANJS
 * @author Alejandro Nanez Ortiz <alejonanez@gmail.com>
 */

var POPAYANJS = POPAYANJS || {};

// New instance
POPAYANJS.App = new POPAYANJS.Counter({
    button: document.getElementsByTagName('button')[0],
    paragraph: document.getElementsByTagName('p')[0],
});

// Add listeners to the DOM elements
POPAYANJS.App.startListeners();
