# How to handle Facts ?

## Information elements
A Fact is a collection of information elements stored in the envelope and the payload. Information elements are the smallest for the business significant pieces of information, defined in the semantic model of an Access Point. An information element can be stored as an attribute of an entity. Two types of entity attributes can be distinguished: primary and secondary attributes.

#### Primary attributes
The following attributes are considered standard for each entity:  
- id
- alias
- class
- owner
- rule
- relations
- state
- facts 

The first seven values are the concept-attributes and their values are inherited and copied from the class concept. During the life-time of an entity, it is expect that these seven attributes will not be changed. However the specified REST API supports a PUT request to change them. 

The eighth attribute: "facts" is also an primary attribute and required to store facts belonging that entity. (A fact belongs to an entity if the subject value of the envelope refers to that entity).
 
#### Secondary attributes
The secondary attributes of an entity are optional and their values are derived from received facts. During creation of an instance, the secondary attributes can be automatically created from the list of related attribute-concepts as listed in the primary attribute "relations". (References to non-attributes in this list are ignored)

Example of a data structure of an entity:
```Javascript
{
	// Primary attributes
	id:
	alias:
	class:
	owner:
	rule:
	relations:
	state:
	facts:
	// Secondary attributes
	modality: 
	region: {
		from:
		to:
	}
	
}
```
In this case, the attribute "relations" contains references to the concepts "modality" and "region". Both concepts are of the type "attribute" but only "region" has relations to other attributes which indicates a hierarchy. See [jsFiddle](http://jsfiddle.net/ErikCornelisse/5VDSc/) for a working example in JavaScript.

#### Information elements formats
It is an implementation choice how to represent information elements within a Fact. A straight forward option is to implement information elements as key-value pairs. A more performance and space optimised solution is to use a fixed sequence of values. A combination is also possible, using a fixed sequence for the envelope and key-value pairs in the payload. If required, a dedicated message format such as XML or binary can be used.

Here is an example of a "Fact" with fixed envelope attributes and keyword value pairs as payload:

```javascript
[	
	// envelope attributes
	<subject>, <source>, <content>, <timestamp>, <place>, <state>,
	// payload
	{
		modality: <reference to type of modality>,
		region: {
			from: <reference to a location>,
			to: <reference to a location>
		}
	}
]
```
The seventh parameter contains the payload which is in this case is a hash table.

## Processing Facts
In general there are three fact-related activities to perform:
* determine and invoke the proper workflow to process received facts;
* to decompose and store information elements within a fact. How to decompose a fact depends on how the information elements are stored;
* to compose a new fact to share information with others.

## Determine and invoke a workflow
The API specification defines how to invoke the proper workflow based on the HTTP method and the path structure. Basically there are two ways to invoke a workflow by firing a rule:
* a rule associated with the subject (=entity)
* a rule associated with a from-to-content relation. 

Rules are defined in the knowledge base of an Access Point and can execute  conditionally a sequence of build-in software activities. For the construction of rules in a semantic model, these software activities need to be known concepts in that semantic model. Operations for handling incoming facts need to be implemented as build-in software activities (methods) of an Access Point. See section about rules. (<- work in progress)

Incoming facts are processed because a rule is fired. If no rule is assigned, than the incoming fact will be ignored and forgotten.

## Decompose and store information elements
How information elements are stored per entity is an implementation design decision. There are two ways foreseen to store information elements:
* as part of a fact added to list in the entity-attribute "facts";
* as attribute of an entity.

#### *Append fact to entity attribute "facts"* 
Before a fact is being appended, the redundant "subject" information element can be skipped from the envelope. The internal format for the entity-attribute "facts" might look like:
```javascript
	entity.facts = Array of records
	record = [timestamp, content, place, state, source, payload]
```
#### *Process secondary attributes*
There are three ways to deal with secondary attributes:
* add all keywords found as payload of a fact or update the secondary attributes with the same name if they already exist. This requires only invoking the proper workflow which is a lazy way of configuration and recommended for cases where the attributes are unknown in advance or conditional. The disadvantage of this approach is less control over the entity data structure;
* update only predefined/known secondary attributes found as keyword in the payload. This is the preferred way because the owner has control over which information is important and which information is relevant but doesn't have to be accessible directly; 
* or a combination of the first two and depending on the received fact, the invoked workflow uses one of them or ignore an update.

The second one is the preferred way by scanning the payload of the fact for known secondary attributes and if present, update the value of the entity-attribute with the same name. The updated entity-attribute than contains the last known value. See [jsFiddle](http://jsfiddle.net/ErikCornelisse/2ULyM/) for a working example in JavaScript.

In addition, a reference to the fact that caused the update, can be attached to that attribute. In this way, the timestamp and source are also easy to determine. Otherwise a search is required to determine the source and timestamp from the stored "facts". 

Note:
Strongly related to storing information elements are query and composition actions which should take in account too, when making a final decision about the implementation design. The choice for selecting the secondary attributes will most likely depend on the demand for query and composition functionality. 

## Compose a new fact
The composition of facts can be implemented as a hard-coded solution or dynamically constructed based on a configuration defined in a semantic model. In both cases, the construction is also triggered as part of the invoked internal workflow.

As hard-coded solution, a dedicated software activity need to be  implemented as software code and as concept in the semantic model of that Access Point. This is a  very easy and quick to implement approach but requires additional development and testing effort every time a new type of payload need to be supported. Therefore, this is not the preferred way and certainly not practical for cases with a large diversity of message types. However, hard-coded solutions can be optimised for performance which can be an important requirement when high volume of messages are involved.
 
A more flexible and elegant solution is to construct the payload or a message in general, based on a configuration such the "proto" description file used by Google's [ProtocolBuffer](https://code.google.com/p/protobuf/). Using Google's Protocol Buffer is however a mix between configuration and generating once the hardcoded solution. This approach will reduce the development and test effort but still requires a software update of the Access Point.

Information at an Access Point is clustered per entity according to the entity-centric approach with use of facts. As consequence of this approach, the construction of a fact is also limited to the information that is available per entity. Therefore the following approach is suggested for composing facts and messages in general:

* a hard-code implementation of common facts to be used as response on a query or notification;
* a flexible implementation with limited configuration capabilities to construct a payload as part of an fact. This in addition to the hard-coded common facts;
* an external software service to use entity-centric facts as input to construct more complex messages in the desired format. An additional software service is also required to translate information to a terminology that the recipients understands and to combine information from multiple/different entities into one message. See also Semantic Gateways (<- work in progress)

#### Common response facts
Common response facts are composed based on information stored at an Access Point. They are not dictated by the iCargo REST interface and require a design decision for the implementation of an Access Point. Based on the proposed approach for storing information elements per entity, the following three types of response facts are identified as common:
1. a **log-fact** as a (subset) of stored facts. The query attributes of the REST API can be used to filter the result. This can be useful to share a particular type of information such as a temperature history;
2. a **attribute-fact** containing all secondary attributes of an entity representing its last known values. The payload is JSON compliant based on key-value pairs;
3. a **status-fact** to inform the receiver about the last known status of an entity.

*Log-fact:*
The following data-structure can be used as inspiration for implementing the first option:
```javascript
[	
	// envelope attributes
	<subject>, <source>, <content>, <timestamp>, <place>, <state>,
	// payload
	[ <amount of records>,
		[	// array of records
			<source>, <content>, <timestamp>, <place>, <state>,<value>
		]
	]
]
```
Envelope attributes:
* subject = the reference of the entity
* source = the reference of the Access Point
* content = a reference to a concept for "log-fact"
* timestamp = the time of creating the (response) fact
* place = a reference to the current location of the entity or unknown in case the location is classified
* state = a reference which indicates the status of the entity

The payload is a "Set" of records with the same format as facts stored in the entity-attributes called "facts". Where a "Set" is  being defined as a set of items with the number of items stated in advance. See iCargo API specification.

Note:
All references are local unique references which became automatically globally unique in combination with the universal unique reference of the Access Point.

*Attribute-fact:*
For this type of response facts, the envelope attributes are defined in the same way as above with one exception, the envelope-attribute "content" needs to refer to a concept in the semantic-model that represents "attribute-fact". 

The payload is a hash table containing the secondary attributes as key-value pairs. For example:
```javascript
{	// Secondary attributes
	modality: 
	region: {
		from:
		to:
	}
}
```

*Status-fact:*
A status fact just contains an envelope and has no payload. An important difference with the previous two common facts is the timestamp, which is equal to the timestamp of the state change.
```javascript
[	
	// envelope attributes
	<subject>, <source>, <content>, <timestamp>, <place>, <state>
]
```
Envelope attributes:
* subject = the reference of the entity
* source = the reference of the Access Point
* content = a reference to a concept for "status-fact"
* timestamp = the time of state change
* place = a reference to the current location of the entity or unknown in case the location is classified
* state = a reference which indicates the status of the entity

#### Configurable response facts
In contrast to the three common response facts, a limited fact composition method is foreseen to support simple payload data-structures by configuration. For complex data-structures, a dedicated software service should be invoked to keep the required processing time per fact to a minimum at an Access Point.

Again there is no specification which dictates if and how to implement configurable response facts. Therefore it is an implementation design decision which can differ per Access Point. The following approach is included as inspiration and similar to the creation of secondary attributes for entities described earlier in this document. In fact, the following example is a configurable variation of the "attribute-fact" in case only a specific number of attributes needs to be shared.
 
In general the "content" envelope-attribute of the response fact , need to refer to a specific concept known in the semantic model of an Access Point. To make it less abstract, lets give this specific concept a name, for example "ETA-fact" which contains the last known estimated time of arrival at a given destination. The payload of this example consists of a timestamp representing the ETA and a reference to a destination. (See Location references) 

The payload as a hash table:
```javascript
{
	ETA: 1397468895827,
	destination: 4213
}
```
The attribute "relations" of the concept "ETA-fact", contains a reference to the concepts "ETA" and "destination", each of the class "attribute".

In a similar way, a keyword-less variation can be implemented too. In that case, the payload is an array where each position has a predefined meaning.

```javascript
[ 1397468895827, 4213 ]
```

Note:
The construction of the envelope of a fact shall be uniform for all facts.
  
