var vows = require("vows"),
	assert = require("assert"),
	Deferred = require("../index"),
	Q = require('q');

vows.describe('Deferred Object').addBatch({
	"when calling deferred as a function": {
		topic : Deferred(),
		'we get a deferred object': function(topic){
			assert.ok(typeof topic === "object"
				&& typeof topic.resolve === "function");
		},
		'the deferred object has all the appropriate methods' : function(topic){
			assert.ok(typeof topic.reject === "function");
			assert.ok(typeof topic.resolveWith === "function");
			assert.ok(typeof topic.rejectWith === "function");
			assert.ok(typeof topic.promise === "function");
			assert.ok(typeof topic.isResolved === "function");
		},
		'the deferred object can take call backs' : function( topic ){
			assert.ok(topic.done(function(){
				assert.ok(true);
			}));
			assert.ok(topic.resolve());
		},
		'the deferred object will execute callbacks even after being resolved' : function( topic ){
			assert.ok(topic.isResolved());
			topic.done(function(){
				assert.ok(true);
			});
		}
	},
	"when deferred is in rejection state": {
		topic : Deferred(),
		'the deferred object takes failure callbacks': function(topic){
			assert.ok(topic.fail(function(){
				assert.ok(true);
			}));
			assert.ok(topic.reject());
		},
		'the deferred object will execute failure callbacks even after being rejected' : function( topic ){
			assert.ok(topic.isRejected);
			topic.fail(function(){
				assert.ok(true);
			});
		}
	},
	"when calling deferred as a constructor": {
		topic : new Deferred(),
		'we get a deferred object': function(topic){
			assert.ok(typeof topic === "object"
				&& typeof topic.resolve === "function");
		},
		'the deferred object has all the appropriate methods' : function(topic){
			assert.ok(typeof topic.reject === "function");
			assert.ok(typeof topic.resolveWith === "function");
			assert.ok(typeof topic.rejectWith === "function");
			assert.ok(typeof topic.promise === "function");
			assert.ok(typeof topic.isResolved === "function");
		},
		'the deferred object can take call backs' : function( topic ){
			assert.ok(topic.done(function(){
				assert.ok(true);
			}));
			assert.ok(topic.resolve());
		},
		'the deferred object will execute callbacks even after being resolved' : function( topic ){
			assert.ok(topic.isResolved());
			topic.done(function(){
				assert.ok(true);
			});
		}
	},
	"when using the when method to group deferreds" : {
		topic : function(){
			var x = [
				Deferred(),
				Deferred(),
				Deferred(),
				new Deferred()
			];
			var y = Deferred.when.apply(Deferred(), x);
			y.x = x;
			return y;
		},
		'the promise of when cannot be resolved or rejected directly' : function ( topic ) {
			assert.ok(!topic.resolve);
			assert.ok(!topic.reject);
		},
		'the promise can have callbacks added to it' : function ( topic ) {
			assert.ok(topic.done(function( val ){
				assert.ok(val);
			}));
		},
		'the resolution of the deferred objects triggers the resolution of the when' : function ( topic ) {
			topic.x.forEach(function(d){
				d.resolve(true);
			});
		},
		'the promise can still make callbacks even after being resolved' : function( topic ){
			topic.done(function(val){
				assert.ok(val);
			});
		}
	},
    "when using with another Promises/A+ compliant library" : {
        topic: function() {
            var objs = [
                Q.defer(),
                Deferred(),
                new Deferred()
            ];
            var topic = [
                objs[0].promise,
                objs[1].promise(),
                objs[2].promise()
            ];
            objs[0].resolve(1);
            objs[1].resolve(2);
            objs[2].resolve(3);
            return topic;
        },
        'Chaining Deferred through the other library should work': function(topic) {
            assert.ok(topic[0].then(function(a) {
                assert.ok(a == 1);
                return topic[1].then(function(b) {
                    assert.ok(b == 2);
                    return topic[2];
                });
            }).then(function(c) {
                assert.ok(c == 3);
            }));
        },
        'Chaining the other library through Deferred should work': function(topic) {
            assert.ok(topic[2].then(function(c) {
                assert.ok(c == 3);
                return topic[1].then(function(b) {
                    assert.ok(b == 2);
                    return topic[0];
                });
            }).then(function(c) {
                assert.ok(c == 1);
            }));
        }
    }
 }).export(module);
