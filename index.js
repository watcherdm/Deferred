function _Deferred () {
	if ( !( this instanceof _Deferred ) ) return new _Deferred();
	var callbacks = [],
		fired,
		firing,
		cancelled,
		deferred = this;

	this.done = function done (){
		if ( !cancelled ) {
			var args = arguments,
				i = 0,
				elem,
				type,
				_fired;
			if ( fired ) {
				_fired = fired;
				fired = 0;
			}
			for ( ; elem = args[i++] ; ) {
				if ( typeof elem === "object" && elem instanceof Array ){
					deferred.done.apply( deferred, elem );
				} else if ( typeof elem === "function" ) {
					callbacks.push( elem );
				}
			}
			if ( _fired ){
				deferred.resolveWith( _fired[ 0 ], _fired[ 1 ] );
			}
		}
		return this;
	};
	this.resolveWith = function resolveWith ( context, args ){
		if ( !cancelled && !fired && !firing ) {
			args = args || [];
			firing = 1;
			try {
				while( callbacks[0] ) {
					callbacks.shift().apply( context, args );
				}
			} finally {
				fired = [ context, args ];
				firing = 0;
			}
		}
		return this;
	};
	this.resolve = function resolve () {
		deferred.resolveWith( this, arguments );
		return this;
	};
	this.isResolved = function isResolved () {
		return !!( firing || fired );
	};
	this.cancel = function cancel (){
		cancelled = 1;
		callbacks = [];
		return this;
	};
}

var promiseMethods = "done fail isResolved isRejected promise then always pipe".split( " " );

var Deferred = module.exports = function Deferred ( func ) {
	var deferred = _Deferred(),
		failDeferred = _Deferred(),
		promise;
	
	deferred.then = function then ( doneCallbacks, failCallbacks ) {
		deferred.done( doneCallbacks ).fail( failCallbacks );
		return this;
	};
	deferred.always = function always () {
		return deferred.done.apply( deferred, arguments ).fail.apply( this, arguments );
	};
	deferred.fail = failDeferred.done;
	deferred.rejectWith = failDeferred.resolveWith;
	deferred.reject = failDeferred.resolve;
	deferred.isRejected = failDeferred.isResolved;
	deferred.pipe = function pipe ( fnDone, fnFail ) {
		return Deferred(function( newDefer ){
			var handles = {
				done : [fnDone, "resolve"],
				fail : [fnFail, "reject"]
			};
			Object.keys( handles ).forEach( function( handler ){
				var data = handles[handler],
					fn = data[0],
					action = data[1],
					returned;
				if ( typeof fn === "function" ) {
					deferred[ handler ](function(){
						returned = fn.apply( this, arguments );
						if ( returned && typeof returned.promise === "function" ) {
							returned.promise().then( newDefer.resolve, newDefer.reject );
						} else {
							newDefer[ action ]( returned );
						}
					});
				} else {
					deferred[ handler ]( newDefer[ action ] );
				}
			}, handles)
		}).promise();
	};
	deferred.promise = function ( obj ) {
		if ( obj == null ) {
			if ( promise ) {
				return promise;
			}
			promise = obj = {};
		}
		promiseMethods.forEach(function(method){
			this[ method ] = deferred[ method ];
		}, obj);
		return obj;
	};
	deferred.done( failDeferred.cancel ).fail( deferred.cancel );
	delete deferred.cancel;
	if ( func ) {
		func.call( deferred, deferred );
	}
	return deferred;
}

module.exports.when = function when ( firstParam ) {
	var args = arguments,
		i = 0,
		length = args.length,
		count = length,
		deferred = length <= 1 && firstParam && typeof firstParam.promise === "function" ?
			firstParam :
			Deferred();
	function resolveFunc ( i ) {
		return function ( value ) {
			args[ i ] = arguments.length > 1 ? [].slice.call( arguments, 0 ) : value;
			if ( !( --count ) ) {
				deferred.resolveWith( deferred, [].slice.call( args, 0 ) );
			}
		};
	}
	if ( length > 1 ) {
		for ( ; i < length ; i++ ) {
			if ( args[ i ] && typeof args[ i ].promise === "function" ){
				args[ i ].promise().then( resolveFunc(i), deferred.reject );
			} else {
				--count;
			}
		}
		if ( !count ) {
			deferred.resolveWith( deferred, args );
		}
	} else if ( deferred !== firstParam ) {
		deferred.resolveWith( deferred, length ? [ firstParam ] : [] );
	}
	return deferred.promise();
}