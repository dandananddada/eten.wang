---
layout: post
category: frontend
date:   2019-07-05
path: web-caching
title: Web Caching
summary: 'Caching is the term for storing reusable responses in order to make subsequent requests faster. '
---

### What is Caching

Caching is the term for storing reusable responses in order to make subsequent requests faster. There are multiple types of caches out there such as CPU cache, GPU cache, disc cache, etc. 

When a requested resource is found in cache, it’s called a **cache hit**. Similarly, if a resource is not found in cache and had to be fully requested from its normal location, it’s called a **cache miss**.

For the purposes of browser caching, each browser has its own web cache, which is where resources like images and other web page assets are stored for quick access later on. The goal of browser caching is to save you time when requesting the same resource multiple times, and to save bandwidth by reducing the amount of data you request over a network.

#### Web caching

Web caching is a core design feature of the HTTP protocol meant to minimize network traffic while improving the perceived responsiveness of the system as a whole.

Web caching works by caching the HTTP responses for requests according to certain rules. Subsequent requests for cached content can then be fulfilled from a cache closer to the user instead of sending the request all the way back to the web server.

### What can be cached

Some very cache-friendly content for most sites are:

- Logos and brand images
- Non-rotating images in general (navigation icons, for example)
- Style sheets
- General Javascript files
- Downloadable Content
- Media Files

Some items that you have to be careful in caching are:

- HTML pages
- Rotating images
- Frequently modified Javascript and CSS
- Content requested with authentication cookies

Some items that should almost never be cached are:

- Assets related to sensitive data (banking info, etc.)
- Content that is user-specific and frequently changed

### Locations Where Web Content Is Cached

- **Browser cache**: Web browsers themselves maintain a small cache. Typically, the browser sets a policy that dictates the most important items to cache.
- **Intermediary caching proxies**: Any server in between the client and your infrastructure can cache certain content as desired. These caches may be maintained by ISPs or other independent parties.
- **Reverse Cache**: Your server infrastructure can implement its own cache for backend services. This way, content can be served from the point-of-contact instead of hitting backend servers on each request.

### How Does the Browser Know What to Cache?
There are two modern HTTP response headers that define how a resource should be cached: Cache-Control and ETag.

#### Cache-Control

When your browser requests resources from a server the first time, it stores the returning resources in its cache according to this header. when your browser needs to request that resource again, it will check its cache to see if the resource is there and that it still fits the Cache-Control specs.

The Cache-Control header has a couple different parameters that can be set from the server:

##### no-cache or no-store

`no-cache`: This resource should always be requested from the server instead of automatically loaded from cache. However, the protocol about ETags still applies, and if the ETags for the client version and the server version match up then the server will instruct the client to use its cached version.

`no-store`: is simpler in that it tells the browser to always request the resource from the server without checking ETags.

##### public or private

`public` means that a resource can be cached by anyone – but this usually isn’t necessary as by default, defining the max-age part of the header will also set it as public.

`private` means that only the user’s browser can cache the resource, and not any intermediaries such as a CDN. This is especially important when dealing with resources with personal information, such as when you log into your bank’s website.

##### max-age

Finally, `max-age` determines the length of time in seconds that this resource should be cached. max-age=120 means that this resource can be cached and reused for 2 minutes.

#### ETag

The **ETag** header (short for entity-tag) provides a revalidation token that is automatically sent by the browser to check if the resource has changed since the last time it was requested.

With ETags, we do have to make a request to the server, but instead of re-downloading the entire resource, our goal is to check with the server to see if there’s been any modifications to it. If there haven’t been, then the server responds back with a 304 response code – meaning “Not-Modified” – and then the browser loads the file from its own cache instead. 

![ETag](https://i2.wp.com/thecodeboss.dev/wp-content/uploads/2015/10/etag-example.png?w=441&ssl=1)

### Things we didn't cover

There are two HTTP headers that are also related to browser caching that we didn’t cover simply because they’re older and are on their way towards becoming deprecated.

- the **Expires** header – a pre-HTTP 1.1 header
    is a header which prevents the client from requesting the resource again from the server until it “expires” in freshness; it has been replaced by Cache-Control.
- the **Last-Modified** header – also a pre-HTTP 1.1 header
    is a header which also contains an HTTP date stating when the resource was last modified; it has been replaced by ETag

#### Vary

The Vary header provides you with the ability to store different versions of the same content at the expense of diluting the entries in the cache.

Items like User-Agent might at first glance seem to be a good way to differentiate between mobile and desktop browsers to serve different versions of your site. However the result will likely be many versions of the same content on intermediary caches, with a very low cache hit ratio.

The Vary header should be used sparingly, especially if you do not have the ability to normalize the requests in intermediate caches that you control.


### Developing a Caching Strategy

Google came up with a nice decision tree to help you figure out what to cache, and for how long.

![Google Cache-Control Strategy](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/images/http-cache-decision-tree.png)

#### General recommendations

There are certain steps that you can take to increase your cache hit ratio before worrying about the specific headers you use:

- **Establish specific directories for images, css, and shared content**: Placing content into dedicated directories will allow you to easily refer to them from any page on your site.
- **Use the same URL to refer to the same items**: Ensure that you refer to your content in the same way on all of your pages.
- **Use CSS image sprites where possible**: CSS image sprites for items like icons and navigation decrease the number of round trips needed to render your site and allow your site to cache that single sprite for a long time.
- **Host scripts and external resources locally where possible**: If you utilize javascript scripts and other external resources, consider hosting those resources on your own servers.
- **Fingerprint cache items**: For static content like CSS and Javascript files, adding a unique identifier to the filename, that if the resource is modified, the new resource name can be requested, causing the requests to correctly bypass the cache.

In terms of selecting the correct headers for different items, the following can serve as a general reference:

- Allow all caches to store generic assets
- Allow browsers to cache user-specific assets
- Make exceptions for essential time-sensitive content.
- Always provide validators.
- Set long freshness times for supporting content.
- Set short freshness times for parent content.


### Resources

[How Browser Caching Works](https://thecodeboss.dev/2016/05/how-browser-caching-works/)

[HTTP Caching](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching)

[Web Caching Basics: Terminology, HTTP Headers, and Caching Strategies](https://www.digitalocean.com/community/tutorials/web-caching-basics-terminology-http-headers-and-caching-strategies)

[Effective Cache Control](https://sookocheff.com/post/api/effective-caching/)