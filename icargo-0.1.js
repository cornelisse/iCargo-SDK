/* icargo.js - v0.1 - 2014-03-13
 * Copyright (c) 2014 CGI Erik Cornelisse
 * Licensed under the MIT license */
var ICARGO = {

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
	createUUID: function(prefix){

		var date = new Date();

		return prefix + date.getTime();
	},  // Creates an universal unique ID based on ...

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

	HttpHeader: {
		'User'        : "developer",
		'Application' : "demo",
		'API-Key'     : "b3f0229e8446d09d9addf3af0f4188d9",
		'Content-Type': "application/json"
	},	// Keys are case sensitive !

	HttpRequest: function(method, path, message){

		var response = [0];
		var url = ICARGO.HttpDomain + path;

		var xhr = new XMLHttpRequest();
        
        xhr.open(method, url, false);    // Synchronous call
        
		// Access-Control-Allow-Headers required for Cross Object Sharing Resources (CORS)
		for (var key in ICARGO.HttpHeader){
			if (ICARGO.HttpHeader.hasOwnProperty(key)) {
				xhr.setRequestHeader(key, ICARGO.HttpHeader[key]);
			}	// HttpHeader is not expected too have inherited poperties but just in case
		}
        
        if (method === 'GET' || typeof message === 'undefined') {
            xhr.send();
        } else {
            xhr.send(JSON.stringify(message));
        }
        
        //log('xhr', xhr);
        if (method === 'GET'){
            response = JSON.parse(xhr.responseText);
        } else {
            response = xhr.response;
        }
        return response;
    },
    
	get: function(path){
		return ICARGO.HttpRequest('GET', path); },

	post: function(path, message){
		return ICARGO.HttpRequest('POST', path, message); },

	put: function(path, message){
		return ICARGO.HttpRequest('PUT', path, message); },
    
	del: function(path, message){
		return ICARGO.HttpRequest('DELETE', path, message); },

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
    
    addFacts: function(facts){
        var message = ICARGO.createSet(facts),
            id      = facts[0][0];
        
        return ICARGO.post(id, message);
    },  // According to specification, only group only facts with same entity !
        
    getFacts: function(id){
        return ICARGO.get(id); },
    
    getLastKnown: function(id, content){
        var results = ICARGO.get(id),
            length  = results[0],
            facts   = results[1],
            fact, time, last = -1, value = 'unknown';

        for (var i=0; i < length; i++) {
            fact = facts[i];
            if (fact[ICARGO.RESULT.CONTENT] === content) {
                time  = fact[ICARGO.RESULT.TIMESTAMP];
                if (time > last) {
                    last = time;
                    value = fact[ICARGO.RESULT.VALUE];
                }
            }
        }
        
        return { time: last, content: content, value: value };
    }
};