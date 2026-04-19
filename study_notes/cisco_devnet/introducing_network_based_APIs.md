# Introducing Network Based APIs

## HTTP Overview

1. Client sends an HTTP request to web.
2. Server receives the request
3. Server processes the request
4. Server returned the HTTP response
5. Client receives the response

- Request Line
  - Request method
  - Universal Resource Identifier
  - Protocol Version
- Zero or more HTTP headers
  - information about request target
  - authentication
  - content negotiation
- Empty line. End of Headers
- Body
  - Optional
  - mostly used in POST

### HTTP Response

- Status-line
  - Protocol version
  - response code
  - human-readable reason for response code
- Zero or more HTTP headers
  - additional information
- Empty line. End of Headers
- Body
  - contains response data

### HTTP URL

1. Scheme: http, https, mailto, ftp, data, etc.
2. Host: FQDN, IPv4, IPv6
3. Port: optional parameter
4. Resource Path: sequence of heirarchical path segments
5. Query: optional parameter preceded by a ?
6. Fragment: optional parameter starts with a # and provides directions

- URI identifies a resource.
- URL also identifies a resource (includes host)
- URN identifies a resource using a made up scheme

## HTTP Applied to Web-Based APIs

Resource Manipulation - APIs commonly support CRUD create, read, update, or delete
Automation: automate remote systems via APIs
System Configuration: network equipment can be configured remotely
Service Management: monitoring and provisioning use APIs

### HTTP Methods

HTTP Method|Function
-|-
GET|Requests a representation of a specific resource
POST|Submit an entity to the remote resource. Should include a request BODY
DELETE|Deletes the specific resource
PUT|Replaces the requested resource
HEAD|Asks four the resource without the BODY. Good for validation.
PATCH|Applies partial modification of a resource

### HTTP Status Codes

CODE|Status|Description
1xx|Informational|Information
200|OK|Standard response for a successful HTTP request.
201|Created|Indicates the resouce has been created
204|No Content|Server fulfilled the request. BODY empty
3xx|Redirection|-
301|Moved Permanently|Redirect requests to new URI
302|Found|Requests resides temporarily under new URI
304|Not Modified|Indicates resouces has not been mofified since the version specified by request headers
400|Bad Requests|Malformed request
401|Unauthorized|Unauthorized. Requires valid user.
403|Forbidden|Unauthorized. Permission denied
404|Not Found|Not found
500|Internal Server Error|Generic server error
501|Not Implemented|Server does not support request
503|Service Unavailable|Service cannot handle the request
