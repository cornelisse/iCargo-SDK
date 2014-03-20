/* icargo-node.js - v0.2 - 2014-03-13
 * Copyright (c) 2014 CGI Erik Cornelisse
 * Licensed under the MIT license */
var crypto  = require('crypto'),
    request = require('request');
 
module.exports = ICARGO = {

	// Constants --------------------------------------------------------------
	CONCEPT: {
		ID        : 0,
		ALIAS     : 1,
		OWNER     : 2,
		CLASS     : 3,
		RULE      : 4,
		RELATIONS : 5,
		STATE     : 6
	},
    FACT: {
        SUBJECT   : 0,
        SOURCE    : 1,
        CONTENT   : 2,
        TIME      : 3,
        PLACE     : 4,
        STATE     : 5,
        VALUE     : 6
    },
    RESULT: {
        TIMESTAMP: 0,
        CONTENT  : 1,
        PLACE    : 2,
        STATE    : 3,
        SOURCE   : 4,
        VALUE    : 5
    },

	// Core functions ---------------------------------------------------------
	
    createHashName: function(parts){
        var rollup = new Buffer(0);
        Object.keys(parts).sort().forEach(function(id){
            rollup = crypto.createHash("sha256").update(Buffer.concat([rollup,new Buffer(id)])).digest();
            rollup = crypto.createHash("sha256").update(Buffer.concat([rollup,new Buffer(parts[id])])).digest();
        });

        return rollup.toString("hex");
	},  // Creates a 64 length lower case hex string

	// See JSFiddle: http://jsfiddle.net/ErikCornelisse/VY8pZ/
	createEnvelope: function(subject, source, content, time, place, state){
		// subject, source and content (from-to-content) are mandatory
        if (time === -1) { time = Math.round(new Date().getTime() /1000); }
        if (typeof place === 'undefined') place = 0;	// 0 - refers to unknown
        if (typeof state === 'undefined') state = 0;

		return [subject, source, content, time, place, state];
	},  // Creates a header for facts as references to "known" concepts

	createFact: function(envelope, payload){
        var value = payload,
			fact = [];

		for (var i = 0, length = envelope.length; i < length; i++) {
			fact[i] = envelope[i];
		}

        fact.push(value);
		return fact;
	},  // Returns a copy of envelope and extends it with the payload 

	createSet: function(value){
        if (value instanceof Array) {
            var length = value.length, items = [length];
            for (var i = 0; i < length; i++) {
                items.push(value[i]);
            }
            return items;
        }
        
        return [1, [value]];
    },
     
	// HTTP functions ---------------------------------------------------------

	HttpDomain: 'http://api.cypro2.org/ecnode/ap/',

    HttpOptions: {
        headers: {
            'User'        : "developer",
            'Application' : "demo",
            'API-Key'     : "b3f0229e8446d09d9addf3af0f4188d9",
            'Content-Type': "application/json"
        }  // Keys are case sensitive !
	},  // Mandatory header keywords but might include proxy info too
    
	get: function(path, callback){
		return request.get(ICARGO.HttpDomain + path, callback);
    },

	post: function(path, message, callback){
        var options    = ICARGO.HttpOptions;
        options.method = 'POST';
        options.url    = ICARGO.HttpDomain + path;
        options.body   = JSON.stringify(message);

		return request.post(options, callback);
    },

	put: function(path, message, callback){
        var options    = ICARGO.HttpOptions;
        options.method = 'PUT';
        options.url    = ICARGO.HttpDomain + path;
        options.body   = JSON.stringify(message);

        return request(options, callback);
    },
    
	del: function(path, message, callback){
        var options    = ICARGO.HttpOptions;
        options.method = 'DELETE';
        options.url    = ICARGO.HttpDomain + path;
        options.body   = JSON.stringify(message);

        return request(options, callback);
    },

	// Higher functions and shortcuts ---------------------------------------------
    
    createEntity: function(collection, group, alias, owner, links, state){
        var path     = collection + '/' + group + '/' + alias,
            payload  = [alias, links],
            envelope = ICARGO.createEnvelope(group, source, content, -1, 0, state),
            fact     = ICARGO.createFact(envelope, payload),
            message  = ICARGO.createSet([fact]);
  
        log('createEntity - POST ' + path, message);
        return ICARGO.post(path, message);
    },
    
    addFacts: function(facts, callback){
        var message = ICARGO.createSet(facts),
            id      = facts[0][0];
        
        return ICARGO.post(id, message, callback);
    },  // According to specification, only group only facts with same entity !
        
    getFacts: function(id, callback){
        return ICARGO.get(id, callback); },
    
    getLastKnown: function(id, content, callback){

        return ICARGO.getFacts(id, function(error, response, body){

            var results = JSON.parse(body),
                length  = results[0],
                facts   = results[1],
                fact, time, last = -1, value = 'unknown';

            for (var i=0; i < length; i++) {
                fact = facts[i];
                if (fact[ICARGO.RESULT.CONTENT] === content) {
                    time  = fact[ICARGO.RESULT.TIMESTAMP];
                    if (time >= last) {
                        last  = time;
                        value = fact[ICARGO.RESULT.VALUE];
                    }
                }
            }
            
            callback(error, response, { time: last, content: content, value: value });
        });
    }
};

// Set default values only once
request = request.defaults(ICARGO.HttpOptions);

// EOF