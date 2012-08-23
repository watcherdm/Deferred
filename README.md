[![build status](https://secure.travis-ci.org/webspinner/Deferred.png)](http://travis-ci.org/webspinner/Deferred)
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
	console.log("Deferred resolved!");
} ).fail( function () {
	console.log("Deferred rejected!");
} );

setTimeout( function(){
	dfd.resolve();
}, 1500 );
```

Slightly more meaningful Usage Case :

```javascript
var fs = require('fs');

function readFile(fileName){
	var hasReadFile = new Deferred();
	fs.readFile(fileName, 'utf8',function(err, contents){
		if ( err !== null ) {
			return hasReadFile.reject(err);
		}
		return hasReadFile.resolve(contents);
	});
	return hasReadFile.promise();
}

function parseFile(fileName, parser){
	// parser implemented elsewhere
	readFile(fileName)
		.done(parser.parse)
		.fail(function(err){
			console.error('readFile :: ', err);
		});
}
```

**What are Deferreds?**

I am putting together a small list of articles worth reading about the concept of deferreds, futures and promises. In it's simplest form a deferred object is a way to introduce a callback stack to a function.

[ColonelPanic](http://colonelpanic.net/2011/11/jquery-deferred-objects/)
