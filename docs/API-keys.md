# How to choose a useful an API-key

An API-key is a secret token for identification purposes of applications and users. The API-key can be used to associate an unique combination of an organisation(user) and an application such as an AccessPoint, external web-service or application in general. The API-key is used for monitoring, routing and dispatching purposes and NOT intended as a security measure.

## API-key generation by provider

The API-key can be used to identify a specific peer-to-peer link and refer to a [Cooperation Agreement](link.md). A Cooperation Agreement is a contract between two companies which contains information about: how to establish a connection, which information shall be shared and which semantic model(s) to be used.

The API-key can be implemented as the [UUID](identifiers.md) of a link-specific Cooperation Agreement. 

## Using API-key at the front door

Every incoming HTTP-request shall be checked for a known API-key, which means being present in the local API-table. An API-table can be implemented as an in-memory array to speed up performance in contrast to a database lookup. Since API-keys are expected to be static and the number of API-keys is limited, an in-memory array seems to be a practical solution.

The information related to a known API-key can be used to enrich the context of the HTTP-request to invoke a specific workflow.

#### API-table

The API-table is derived from a Cooperation Agreement and contains at least the following information:
* API-key (UUID of cooperation agreement) ->
 * local ID of requesting organisation,
 * local ID of requesting application,
 * local ID of semantic model used by the requesting organisation,
 * local ID of cooperation agreement in case different than UUID.

Notes:

Depending on the implementation the local ID can be a UUID but that is not a requirement (See [identifiers](identifiers.md)).

Depending on the individual business needs, more static information can be included in the API-table.

## How to obtain an API-key

An API-key is provided by the organisation who allows access to their Access Point. In case the API-key represents a reference to a Cooperation Agreement, a bi-directional exchange of information is expected. This can be realised with a single UUID of the Cooperation proposal as API-key, created by the organisation who initiates an invitation for a connection. 

The organisation who receives the API-key can create and store the proposed Cooperation Agreement on its own system with the same UUID. Again this is not a requirement but merely a practical suggestion. Because it makes more sense to refer to the same Cooperation Agreement with the same identification code rather than introducing another UUID for an identical copy. 

Next, the proposed Cooperation Agreement needs to be completed and returned with the information of the invitee.

#### Connection configuration tools

The creation of Cooperation Agreements and API-keys is an offline task and requires supporting applications or web-services to configure a connection. See [tooling](tools.md) for more information.
 
