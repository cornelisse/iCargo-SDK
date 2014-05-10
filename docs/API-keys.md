# How to choose a useful an API-key

An API-key is a secret token for identification purposes of applications and users. The API-key can be used to associate a unique combination of an organisation(user) and an application such as an AccessPoint, external web-service or client-side application. The API-key is used for monitoring, routing and dispatching purposes and NOT intended as a security measure.

## API-key generation

The API-key can be used to identify a specific peer-to-peer link and refer to a [Cooperation Agreement](link.md). A Cooperation Agreement is a contract between two companies which contains information about: the involved organisations, the information to be shared and which semantic model(s) to be used.

The API-key can be implemented as the [UUID](identifiers.md) of a link-specific Cooperation Agreement.

## Using API-key at the front door

Every incoming HTTP-request shall be checked for a known API-key, which means being present in the local API-table. An API-table can be implemented as an in-memory array to speed up performance in contrast to a database lookup. Since API-keys are expected to be static and the number of API-keys is limited, an in-memory array seems to be a practical solution.

The information related to a known API-key can be used to enrich the context of the HTTP-request to invoke a specific workflow.

#### API-table

The API-table is derived from a Cooperation Agreement and contains at least the following information:
* API-key (UUID of cooperation agreement) ->
** local ID of requesting organisation,
** local ID of requesting application,
** local ID of semantic model used by the requesting organisation,
** local ID of cooperation agreement in case different than UUID.

Notes:
Depending on the implementation the local ID can be a UUID but that is not a requirement (See [identifiers](identifiers.md)).
Depending on the individual business needs, more static information can be included in the API-table.