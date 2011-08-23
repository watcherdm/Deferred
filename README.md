jQuery Deferred Library for Node js.
===========
["website"](git://github.com/webspinner/Deferred.git)
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