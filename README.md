jQuery Deferred Library for Node js.
===========
[website](http://webspinner.github.com/Deferred)

jQuery Deferred solves the following problems:

* support common deferred interface in node
* give some access to the deferred library underpinning in the browser

Usage :

```javascript
var Deferred = require('Deferred');
var when = Deferred.when;

var dfd = new Deferred() // || Deferred()
dfd.done( function () {
	alert("Deferred resolved!");
} ).fail( function () {
	alert("Deferred rejected!");
} );

setTimeout( function(){
	dfd.resolve();
}, 1500 );
```