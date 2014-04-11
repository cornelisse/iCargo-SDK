# How to handle Facts ?
---

## Information elements
A Fact is a collection of information elements stored in the envelope and the payload. Information elements are the smallest for the business significant pieces of information, defined in the semantic model of an Access Point. An information element can be stored as an attribute of an entity. Two types of entity attributes can be distinguished: primary and secondary attributes.

#### Primary attributes
The following attributes are considered mandatory for each entity:  
- id
- alias
- class
- owner
- rule
- relations
- state
- facts 

The first seven values are the concept-attributes and their values are inherited and copied from the class concept. During the life-time of an entity, it is expect that these seven attributes will not be changed. However the specified REST API supports a PUT request to change them. 

The eightth attribute: "facts" is also an primary attribute and required to store facts belonging that entity. (A fact belongs to an entity if the subject value of the envelope refers to that entity).
 
#### Secondary attributes
The secondary attributes of an entity are optional and their values are derived from received facts. During creation of an instance, the secondary attributes can be automatically created from the list of related attribute-concepts as listed in the primary attribute "relations". (References to non-attributes in the list can be ignored)

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
It is an Access Point specific implementation choice how to represent information elements within a Fact. A straight forward choice is to implement information elements as key-value pairs. A more performance optimised solution is to use a fixed sequence of values. A combination is also possible, using a fixed sequence for the envelope and key-value pairs in the payload.

An example of a "Fact" in mixed format with fixed envelope attributes and keyword value pairs as payload:

```javascript
[	
	// envelope attributes
	<subject>, <source>, <content>, <timestamp>, <place>, <state>,
	// payload
	[
		modality: <reference to type of modality>,
		region: {
			from: <reference to a location>,
			to: <reference to a location>
		}
	]
]
```

## Processing Facts
In general there are three activities to perform:
* determine and invoke the proper workflow to process received facts;
* to decompose and store information elements within a fact. How to decompose a fact depends on how the information elements are stored. Therefore, the storing activity will be explained first;
* to compose a new fact to share information with others.

## Fact workflow
The API specification defines how to invoke the proper workflow based on the HTTP method and the path structure. Basically there are two ways to invoke a workflow by firing a rule:
* a rule associated with the subject (=entity)
* a rule associated with a from-to-content relation. 

Rules are defined in the knowledge base of an Access Point and can execute  conditionally a sequence of internal methods. See section about rules. (<- work in progress)

Incoming facts are processed because a (complex) rule is fired. If no rule is assigned, than the incoming fact will be ignored and forgotten.

Operations for handling incoming facts need to be implemented as build-in software activities (methods) of an Access Point. The following three types of software activities are required: *decompose a fact*, *store a fact* and *compose a act*. For the construction of rules in a semantic model, these software activities need to be known concepts in that semantic model.

## Decompose and store information elements
How information elements are stored per entity is not prescribed and is an implementation design decision. There are two ways foreseen to store information elements:
* as attribute of an entity;
* as part of a fact added to list in the entity-attribute "facts".

The following  design pattern can be used with easy/lazy decomposition of facts in mind.

1. *Append fact to entity attribute "facts"* 
Reduce facts by skipping the "subject" attribute and than append the fact to the list stored in the entity-attribute called "facts". The list is een array and the index can be used to refer to stored facts for that entity.
The internal format for the entity-attribute "facts" might look like:
```javascript
	entity.facts = Array of records
	record = [timestamp, content, place, state, source, payload]
```
2. *Process secondary attributes*
Scan the payload of the fact for secondary attributes and if present, update the value of the entity-attribute with the same name. The update entity-attribute than contains the last known value. In addition, a reference to the fact that caused the update, can be attached to that attribute. In this way, the timestamp and source are also easy to determine.

Note:
Strongly related to storing information elements are query and composition actions which should take in account too when making a final decision about the implementation design.


## Compose a new fact
(work in progress)
