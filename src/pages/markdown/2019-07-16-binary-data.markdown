---
layout: post
category: frontend
date:   2019-07-16
path: binary-data 
title: Binary Data 
summary: 'Binary data in JavaScript is implemented in a non-standard way, compared to other languages. But when we sort things out, everything becomes fairly simple.'
---

## ArrayBuffer, binary arrays

### ArrayBuffer

Binary data in JavaScript is implemented in a non-standard way, compared to other languages. But when we sort things out, everything becomes fairly simple.

The basic binary object is ArrayBuffer – a reference to a fixed-length contiguous memory area.

```javascript
let buffer = new ArrayBuffer(16)
console.log(buffer.byteLength)
```

ArrayBuffer is not an array of something

- It has a fixed length, we can’t increase or decrease it.
- It takes exactly that much space in the memory.
- To access individual bytes, another "view" object is needed, not `buffer[index]`.

To manipulate an ArrayBuffer, we need to use a "view" object.

A view object does not store anything on it’s own. It’s the "eyeglasses" that give an interpretation of the bytes stored in the ArrayBuffer.

- **Uint8Array** – treats each byte in ArrayBuffer as a separate number, with possible values are from 0 to 255 (a byte is 8-bit, so it can hold only that much).
- **Uint16Array** – treats every 2 bytes as an integer, with possible values from 0 to 65535.
- **Uint32Array** – treats every 4 bytes as an integer, with possible values from 0 to 4294967295.
- **Float64Array** – treats every 8 bytes as a floating point number with possible values from 5.0x10<sup>-324</sup> to 1.8x10<sup>308</sup>.

So, the binary data in an ArrayBuffer of 16 bytes can be interpreted as 16 "tiny numbers", or 8 bigger numbers (2 bytes each), or 4 even bigger (4 bytes each), or 2 floating-point values with high precision (8 bytes each).

![](https://javascript.info/article/arraybuffer-binary-arrays/arraybuffer-views@2x.png)

But if we’re going to write into it, or iterate over it, basically for almost any operation – we must use a view.


```javascript
let buffer = new ArrayBuffer(16)
let view = new Uint32Array(buffer)

console.log(view.length)  // 4
console.log(view.byteLength)  // 16


view[0] = 1234
for (let num of view) console.log(num)
/*
 * 1234
 * 0
 * 0
 * 0
*/
```

### TypedArray

The common term for all these views (Uint8Array, Uint32Array, etc) is TypedArray. They share the same set of methods and properities.

They are much more like regular arrays: have indexes and iterable.


```javascript
let arr16 = new Uint16Array([1, 1000])
let arr8 = new Uint8Array(arr16)

console.log(arr16[0])
console.log(arr16[1])
console.log(arr8[0])
console.log(arr8[1])
// 232, tried to copy 1000, but can't fit 1000 into 8 bits (explanations below)
```

To access the ArrayBuffer, there are properties:
- `arr.buffer` – references the ArrayBuffer.
- `arr.byteLength` – the length of the ArrayBuffer.

#### Out-of-bounds behavior

What if we attempt to write an out-of-bounds value into a typed array? There will be no error. But extra bits are cut-off.

For bigger numbers, only the rightmost (less significant) 8 bits are stored, and the rest is cut off:

<img src="https://javascript.info/article/arraybuffer-binary-arrays/8bit-integer-256@2x.png" width="160px">


```javascript
let num = 256
num.toString(2) // 100000000

let uint8array = new Uint8Array(16)
uint8array[0] = 256
uint8array[1] = 257

uint8array[0]  // 0
uint8array[1]  // 1
```

#### TypedArray methods
TypedArray has regular Array methods, with notable exceptions.

We can `iterate`, `map`, `slice`, `find`, `reduce` etc.

- No `splice` – we can’t delete a value, because typed arrays are views on a buffer, and these are fixed.
- No `concat` method.

There are two additional methods:

- `arr.set(fromArr, [offset])` copies all elements from fromArr to the arr, starting at position offset (0 by default).
- `arr.subarray([begin, end])` creates a new view of the same type from begin to end. That’s similar to slice. 

### DataView

DataView is a special super-flexible "untyped" view over ArrayBuffer. It allows to access the data on any offset in any format.

- For typed arrays, the constructor dictates what the format is. The whole array is supposed to be uniform.
- With DataView we access the data with methods like `getUint8(i)` or `getUint16(i)`. We choose the format at method call time instead of the construction time.


```javascript
let buffer = new Uint8Array([255, 256]).buffer;
let dataView = new DataView(buffer);

dataView.getUint8(0)
dataView.getUint8(1) // out of bound
dataView.getUint16(0) // now get 16-bit number at offset 0, it consists of 2 bytes, together iterpreted as 65535
```

<br>

## TextDecoder and TextEncoder

### TextDecoder
The build-in TextDecoder object allows to read the value into an actual JavaScript string, given the buffer and the encoding.

```javascript
let uint8Array = new Uint8Array([72, 101, 108, 108, 111])
new TextDecoder().decode(uint8Array) // Hello

let uint8Array = new Uint8Array([228, 189, 160, 229, 165, 189])
new TextDecoder().decode(uint8Array) // 你好
```

### TextEncoder
TextEncoder does the reverse thing – converts a string into bytes.

```javascript
let encoder = new TextEncoder()
let uint8Array = encoder.encode("Hello")
console.log(uint8Array); // 72,101,108,108,111
```

<br>

## Blob
ArrayBuffer and views are a part of ECMA standard, a part of JavaScript.
In the browser, there are additional higher-level objects, described in File API, in particular `Blob`.

```javascript
// create Blob from a string
let blob = new Blob(["<html>…</html>"], {type: 'text/html'})

// create Blob from a typed array and strings
let hello = new Uint8Array([72, 101, 108, 108, 111])
let blob = new Blob([hello, ' ', 'world'], {type: 'text/plain'})
```

**Blobs are immutable**
We can’t change data directly in a blob, but we can slice parts of blobs, create new blobs from them, mix them into a new blob and so on.
    
### Blob as URL

A Blob can be easily used as an URL for `<a>`, `<img>` or other tags, to show its contents.

Thanks to type, we can allso download/upload blobs, and it naturally becomes `Content-Type` in network requests.

```javascript
let link = document.createElement('a');
link.download = 'hello.txt';

let blob = new Blob(['Hello, world!'], {type: 'text/plain'});

link.href = URL.createObjectURL(blob);

link.click();

URL.revokeObjectURL(link.href);
```
That’s what the value of link.href looks like:

    blob:https://javascript.info/1e67e00e-860d-40a5-89ae-6ab0cbee6273

If we create an URL, that blob will hang in memory, even if not needed any more. So `URL.revokeObjectURL(url)` removes the reference from the internal mapping, thus allowing the blob to be deleted (if there are no other references), and the memory to be freed.

### Blob to base64

An alternative to` URL.createObjectURL` is to convert a blob into a base64-encoded string.

Here’s the demo of downloading a blob, now via base-64:

```javascript
let link = document.createElement('a');
link.download = 'hello.txt';

let blob = new Blob(['Hello, world!'], {type: 'text/plain'});

let reader = new FileReader();
reader.readAsDataURL(blob); // converts the blob to base64 and calls onload

reader.onload = function() {
  link.href = reader.result; // data url
  link.click();
};
```

Both ways of making an URL of a blob are usable. But usually `URL.createObjectURL(blob)` is simpler and faster.

**URL.createObjectURL(blob)**
- We need to revoke them if care about memory.
- Direct access to blob, no “encoding/decoding”

**Blob to data url**
- No need to revoke anything.
- Performance and memory losses on big blobs for encoding.

### Image to blob

We can create a blob of an image. Image operations are done via `<canvas>` element:

1. Draw an image (or its part) on canvas using canvas.drawImage.
2. Call canvas method `toBlob(callback, format, quality)` that creates a blob and runs callback with it when done.

```javascript
canvas.toBlob(function(blob) {
  // blob ready, download it
  let link = document.createElement('a');
  link.download = 'example.png';

  link.href = URL.createObjectURL(blob);
  link.click();

  // delete the internal blob reference, to let the browser clear memory from it
  URL.revokeObjectURL(link.href);
}, 'image/png');
```

If we prefer async/await instead of callbacks:

```javascript
let blob = await new Promise(resolve => canvasElem.toBlob(resolve, 'image/png'));
```

### Summary of Blob

While `ArrayBuffer`, `Uint8Array` and other `BufferSource` are "binary data", a Blob represents "binary data with type".

That makes Blobs convenient for upload/download operations, that are so common in the browser.

We can easily convert betweeen Blob and low-level binary data types:
- We can make a Blob from a typed array using `new Blob(...)` constructor.
- We can get back ArrayBuffer from a Blob using `FileReader`, and then create a view over it for low-level binary processing.

<br>

## File and FileReader

A File object inherits from Blob and is extended with filesystem-related capabilities.

There are two ways to obtain it.
- First, there’s a constructor, similar to Blob.
- Second, more often we get a file from `<input type="file">`.

### FileReader

FileReader is an object with the sole purpose of reading data from Blob (and hence File too) objects. It delivers the data using events, as reading from disk may take time.

```javascript
let reader = new FileReader()
```

#### The main methods

|name|descripition|
|:--:|:--:|
|`readAsArrayBuffer(blob)`|read the data in binary format ArrayBuffer.|
|`readAsText(blob, [encoding])`|read the data as a text string with the given encoding|
|`readAsDataURL(blob)`|read the binary data and encode it as base64 data url|
|`abort()`|cancel the operation|

As the reading proceeds, there are events:

- `loadstart` – loading started.
- `progress` – occurs during reading.
- `load` – no errors, reading complete.
- `abort` – abort called.
- `error` – error has occurred.
- `loadend` – reading finished with either success or failure.

When the reading is finished, we can access the result as:

- `reader.result` is the result (if successful).
- `reader.error` is the error (if failed).

Here’s an example of reading a file:

```html
<input type="file" onchange="readFile(this)">

<script>
function readFile(input) {
  let file = input.files[0];

  let reader = new FileReader();

  reader.readAsText(file);

  reader.onload = function() {
    console.log(reader.result);
  };

  reader.onerror = function() {
    console.log(reader.error);
  };

}
</script>
```

#### FileReader for blobs
FileReader can read not just files, but any blobs. We can use it to convert a blob to another format:

- `readAsArrayBuffer(blob)` – to ArrayBuffer.
- `readAsText(blob, [encoding])` – to string (an alternative to TextDecoder).
- `readAsDataURL(blob)` – to base64 data url.


#### FileReaderSync is available inside Web Workers
For Web Workers, there also exists a synchronous variant of FileReader, called FileReaderSync.

**In many cases though, we don’t have to read the file contents**. Just as we did with blobs, we can create a short url with `URL.createObjectURL(file)` and assign it to `<a>` or `<img>`.

This way the file can be downloaded or shown up as an image, as a part of canvas etc. And if we’re going to send a File over a network, that’s also easy: network API like `XMLHttpRequest` or `fetch` natively accepts File objects.

## Resources

[https://javascript.info/binary](Binary data, files) - javascript.info