# Semantic tooling

The term tooling is used here as a synonym for applications or web-services to be used offline for the creation and maintenance of descriptions. These descriptions can vary from semantic models to system configurations. The term semantic tooling implies the involvement of a semantic model and the use of ontologies to describe concepts. The following activities require support of semantic tooling:

* Constructing a semantic model
* Configuration of an Access Point
* Configuration of a peer-to-peer connection
* ...

## Constructing a semantic model

Semantic models are stored and exchanged as OWL files based on the [Web Ontology Language](http://en.wikipedia.org/wiki/Web_Ontology_Language).

The following open and freely available tools can be used:

* [Protégeé](http://protege.stanford.edu)
* [NeOn](http://neon-toolkit.org/wiki/Main_Page)

#### Protégeé

Protégé is a free, open-source platform that provides a growing user community with a suite of tools to construct domain models and knowledge-based applications with ontologies. Protégé is available as web-service running in a browser and as desktop application as Java application.

WebProtégé can be used at [Stanford](http://webprotege.stanford.edu) or just like Protégé Desktop downloaded and installed on your own machine. 

Protégé provides support for: editing OWL 2 ontologies, full change tracking and revision history, collaboration such as, sharing and permissions, threaded notes and discussions, watches and email notifications, customizable user interface and forms for application/domain specific editing. Multiple formats are supported for upload and download of ontologies such as: RDF/XML, Turtle and OWL/XML. (Source: [Protégé wiki](http://protegewiki.stanford.edu/wiki/Main_Page))

#### NeOn

The NeOn Toolkit is an ontology engineering environment originally developed as part of the [NeOn project](http://www.neon-project.org). 

The toolkit is based on the Eclipse platform and provides an extensive set of plug-ins (currently 45 plug-ins are available) covering a variety of ontology engineering activities, including Annotation and Documentation, Development, Human-Ontology Interaction, Knowledge Acquisition, Management, Modularization and Customization, Ontology Dynamics, Ontology Evaluation, Ontology Matching, Reasoning and Inference, Reuse. (Source: [NeOn-toolkit wiki](http://neon-toolkit.org/wiki/Main_Page))


## Configuration of an Access Point

(Work in progress)

## Configuration of a peer-to-peer connection

The configuration of a specific P2P connection is stored as a [Cooperation Agreement](link.md) and requires an invitation process as described [here](link.md). 

To support the invitation process and the construction of a Cooperation Agreement, means that two users both have a tool which is able to exchange information with each other. This requires a dedicated but open interface specification. Fortunately, such an open specification is available as a subset of the iCargo REST interface.

A generic but limited implementation of a configuration tool for setting up connections between Access Point can be found [here](tools/connect.html). This implementation uses a fixed semantic model and predefined options based on commonly used concepts.  





