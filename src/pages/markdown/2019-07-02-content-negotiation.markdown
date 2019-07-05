---
layout: post
category: frontend
date:   2019-07-02
path: content-negotiation
title: Content Negotiation
summary: 'Content Negotiation is a mechanism that makes it possible to serve different representations of a resource at the same URI.  HTTP 1.1 defines two main styles of Content Negotiation:  Server-driven and Agent-driven'
---

One of the central tenets of REST is that a given object can have multiple representations.  For human consumption, an object might be rendered as HTML, PDF, video, etc.  For machine consumption, an object might be rendered as XML or JSON.  Indeed, within those broad categories, an object might have many different representations.

There are two kinds of content negotiation which are possible in HTTP: **server-driven** and **agent-driven negotiation**. These two kinds of negotiation are orthogonal and thus may be used separately or in combination. 

### Server-driven Negotiation
If the selection of the best representation for a response is made by an algorithm located at the server, it is called server-driven negotiation.

When a client sends an HTTP request, it may specify the media types that it can accept via an Accept header like this:

```readme
Accept: text/xml, application/xml, application/json
```

A client may also include vendor-specific media types like

```readme
application/vnd.ims.lis.v1.person+json
application/vnd.sif.v2.studentpersonal+json
```

If no Accept header is present, the server is free to deliver whatever representation it thinks is best.

 When an Accept header is present, the server can 
 1. return one of the representations from the list directly in the HTTP response
 2. redirect to a different URL that contains one of the requested representations, or send a 415 error (Unsupported Media Type).

HTTP/1.1 includes the following request-header fields for enabling server-driven negotiation through description of user agent capabilities and user preferences: `Accept`, `Accept-Charset`, `Accept-Encoding`, `Accept-Language`, and `User-Agent`.

#### Server-Driven negotiation has a number of disadvantages

It is impossible for the server to determine accurately what might be the "best" representation for any given client, especially if it does not receive an Accept header. 

### Agent-driven Negotiation

With agent driven negotiation, the client does not provide an Accept header. Instead, the client simply issues an HTTP request to the URL for an object.  If the server supports only one representation for the object, that representation is returned immediately.  Otherwise, the server returns a list of available representations in the response where each representation is identified by its own URI.  The client selects an appropriate representation and then issues a second HTTP request to one of the alternative URIs given in the response.

The HTTP 1.1 specification does not prescribe a format for delivering the list of available representations. Fortunately, with RDF there is a widely accepted practice of identifying alternative representations of an object.

Thus, a server that wishes to provide a list of alternate representations of an object could return a JSON-LD payload like the one shown below.

```json-ld
{
  "@context" : {
    "sameAs" : "http://www.w3.org/2002/07/owl#sameAs",
    "format" : "http://purl.org/dc/elements/1.1/format"
  },
  "@id" : "http://server.example.com/resources/Person/1b16b1c3-a713-44cd-9bb2-0a59bb1117de"
  "sameAs" : [
    { "@id" : "http://server.example.com/resources/Person/1b16b1c3-a713-44cd-9bb2-0a59bb1117de/ims",
      "format" : "application/vnd.ims.lis.v1.person"
    },
    { "@id" : "http://server.example.com/resources/Person/1b16b1c3-a713-44cd-9bb2-0a59bb1117de/sif",
      "format" : "application/vnd.sif.v2.studentpersonal"
    }
  ]
}
```

### Combining Server-Driven and Agent-Driven Negotiation

It is possible to combine Server-driven and Agent-driven negotiation.  In this case the client does not supply an Accept header.  The response from the server contains a default representation of the object, and that representation also includes the sameAs properties as illustrated in the example above.  Now, the client can use the default representation if it wishes, or it can retrieve a different representation of the object by following one of the sameAs relationships.

### Server-driven Vs Agent-driven Content Negotiations

Practically, you will NOT find much usage of server side negotiations because in that way, you have to make lots of assumptions about client expectations. Few things like client context or how client will use the resource representation is almost impossible to determine. Apart from that this approach makes the server side code complex, unnecessarily.

So, most REST API implementations rely on agent driven content negotiations. Agent driven content negotiation rely on usage of HTTP request headers or resource URI patterns.

#### Content negotiation using HTTP headers

At server side, an incoming request may have an entity attached to it. To determine it’s type, server uses the HTTP request header `Content-Type`.

Some common examples of content types are “text/plain”, “application/xml”, “text/html”, “application/json”, “image/gif”, and “image/jpeg”.

```
Content-Type: application/json
```

Similarly, to determine what type of representation is desired at client side, HTTP header ACCEPT is used.

It will have one of the values as mentioned for Content-Type above.

```
Accept: application/json
```

Generally, if no Accept header is present in the request, the server can send pre-configured default representation type.

#### Content negotiation using URL patterns

Another way to pass content type information to server, client may use specific extension in resource URIs.

```
http://rest.api.com/v1/employees/20423.xml
http://rest.api.com/v1/employees/20423.json
```

#### Defining preferences

If is possible to have multiple values in Accept header. Client may want to give multiple values in accept header when client is not sure about if its desired representation is present or supported by server at that time.

```
Accept: application/json,application/xml;q=0.9,*/*;q=0.8
```

Above Accept header allows you to ask the server a JSON format. If it can’t, perhaps it could return XML format (the second level). If it’s still not possible, let it return what it can.

The preference order is defined through the q parameter with values from 0 to 1. When nothing is specified, the implicit value is 1.



### Resources

[Content Negotiation](https://sites.google.com/site/restframework/content-negotiation) - sites.google.com

[REST – Content Negotiation](https://restfulapi.net/content-negotiation/)

[Understanding HTTP content negotiation](http://restlet.com/company/blog/2015/12/10/understanding-http-content-negotiation/)

[Content Negotiation](https://apigility.org/documentation/api-primer/content-negotiation) - apigility.org