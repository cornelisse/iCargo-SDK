# iCargo SDK
The iCargo SDK is a collection of software modules in different programming languages to support the use of the iCargo REST API as specified in the [iCargo project](www.http://i-cargo.eu/content/about-icargo-project).
The objective of this SDK is to provide iCargo specific software implementations to be used as part of an adapter, gateway or access point to communicate with the iCargo ecosystem.
The iCargo SDK on its own is not and will never be enough to create an iCargo compliant access point. Dependency on other frameworks for middleware and persistency are required too (E.g.  Express and MongoDB for an implementation based on Node.js.

## Implementations
So far only JavaScript is available but versions in Java and PHP are currently under development.
* icargo.js, see [jsFiddle](http://jsfiddle.net/ErikCornelisse/rD459/) for an example
* icargo-node.js, an [example](./example/try-icargo-node.js) to play with this module is available in the example directory

### Development notes:
* The message structure of the iCargo API makes use of "sets" and "facts". See [jsFiddle](http://jsfiddle.net/ErikCornelisse/VY8pZ/) for a simple example of these data structures. 
* icargo.js, uses currently synchronous XMLHttpRequest calls. The next update will most likely be asynchronous. 
* icargo-node.js, uses [request](https://github.com/mikeal/request/blob/master/README.md) based on callbacks(err, response, body).

## API
The iCargo REST API specification shall be included soon.

The following functions are currently supported:

#### createHashName(parts)
Creates a 64 length lower case hex string in the same way as Telehash does. Applications should treat hashnames as an instance or reachable network address, not as a permanent or portable user identity, they should always map to a single install or device and may change due to a reinstall or storage reset.
A hashname may be created from just one Cipher Set or up to 8 different ones, each contributing its CSID and a fingerprint. See [Telehash/Hashnames](https://github.com/telehash/telehash.org/blob/master/hashnames.md) for more information.

### Message structure
The following three functions support the creation of iCargo compliant message containers: "sets" and "facts". See also [JSFiddle](http://jsfiddle.net/ErikCornelisse/VY8pZ/) to get familiar with them.

#### createEnvelope(subject, source, content, time, place, state)
The attributes subject, source and content (from-to-content) are mandatory. This function creates a header for "facts" as references to "known" concepts.

#### createFact(envelope, payload)
Returns a copy of envelope and extends it with the payload 

#### createSet(value)
Returns a set containing one or more facts. A "set" is the analogy of a mailbag, where the facts are letters with an envelope to address and route the payload.
     
### HTTP functions 

#### HttpDomain
A value for the HTTP domain address.

#### HttpOptions
A hash value which contains the HTTP options such as the mandatory HTTP-headers: "User", "Application", "API-Key" and "Content-Type". 
Currently only icargo-node.js supports also the [Request](https://github.com/mikeal/request/blob/master/README.md) options to include proxy information as well.
    
#### get(path, callback)
#### post(path, message, callback)
#### put(path, message, callback)  
#### del(path, message, callback)

### Higher functions and shortcuts

#### createEntity(collection, group, alias, owner, links, state)      
#### addFacts(facts, callback)
According to specification, only group only facts with same entity !
        
#### getFacts: function(id, callback)

#### getLastKnown: function(id, content, callback)


 