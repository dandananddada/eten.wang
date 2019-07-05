---
layout: post
category: frontend
date:   2019-06-20
path: proxy-and-reflect
title: Proxy & Reflect
summary: 'A proxy wraps another object and intercepts operations, handling them on its own, or transparently allowing the object to handle them.'
---
### Proxy

```javascript
let target = {}
let proxy = new Proxy(target, {})

proxy.test = 5
// 5

console.log(proxy)
// { test: 5 }

console.log(target)
// { test: 5 }

for (let k in proxy) console.log(k)
// test
```

There are no traps, all operations on proxy are forwarded to target.
1. A writing operation `proxy.test = sets the value on target`.
2. A reading operation `proxy.test` returns the value from target.
3. Iteration over proxy returns values from target.

As we can see, without any traps, proxy is a transparent wrapper around target.

The proxy is a special “exotic object”. **It doesn’t have “own” properties. With an empty handler it transparently forwards operations to target.**

There’s a list of internal object operations in the Proxy specification. A proxy can intercept any of these, we just need to add a handler method.

### Default value with “get” trap

The most common traps are for reading/writing properties.

To intercept the reading, the handler should have a method get(target, property, receiver).


```javascript
let numbers = [0,1,2]
numbers = new Proxy(numbers, {
    get (target, prop) {
        if (prop in target) {
            return target[prop]
        } else {
            return 0
        }
    }
})
// [ 0, 1, 2 ]

console.log(numbers[1])
// 1

console.log(numbers[3])
// 0
```


    The proxy should totally replace the target object everywhere. No one should ever reference the target object after it got proxied. Otherwise it’s easy to mess up.
    
```javascript
dictionary = new Proxy(dictionary, ...);
numbers = new Proxy(numbers, ...);
```

### Validation with “set” trap

Now let’s intercept writing as well.

The set trap triggers when a property is written: set(target, property, value, receiver).

**The set trap should return true if setting is successful, and false otherwise.**


```javascript
let numbers = []
numbers = new Proxy(numbers, {
    set (target, prop, val) {
        if (typeof val === 'number') {
            target[prop] = val
            return true
        } else {
            return false
        }
    }
})
// []

numbers.push(1)
// 1

numbers.push('2')
/* 
    evalmachine.<anonymous>:1
    numbers.push('2')
    TypeError: 'set' on proxy: trap returned falsish for property '1'
        at Proxy.push (<anonymous>)
        ...
*/

numbers.push(3)
// 2

numbers
// [ 1, 3 ]
```


The built-in functionality of arrays is still working.
    
    There are invariants to be held. For `set`, it must return `true` for a successful write.

### Protected properties with “deleteProperty” and “ownKeys”

There’s a widespread convention that properties and methods prefixed by an underscore _ are internal. They shouldn’t be accessible from outside the object.

Let’s use proxies to prevent any access to properties starting with _.


```javascript
let user = {
  name: "John",
  _password: "***"
};

user = new Proxy(user, {
    get (target, prop) {
        if (prop.startsWith('_')) {
            throw new Error('Access denied')
        }
        let value = target[prop]
        return typeof value === 'function' ? value.bind(target) : value
    },
    set (target, prop, val) {
        if (prop.startsWith('_')) {
            throw new Error('Access denied')
        } else {
            target[prop] = val
        }
    },
    deleteProperty (target, prop) {
        if (prop.startsWith('_')) {
            throw new Error("Access denied");
        } else {
            delete target[prop];
            return true;
        }
    },
    ownKeys (target) {
        return Object.keys(target).filter(k => !k.startsWith('_'))
    }
})
/*
    Error: Access denied
        at Object.get (evalmachine.<anonymous>:4:19)
        ...
*/

try {
  console.log(user._password); // Error: Access denied
} catch(e) { console.log(e.message); }
// Access denied

try {
  user._password = "test"; // Error: Access denied
} catch(e) { console.log(e.message); }
// Access denied
```

If an object method is called, such as user.checkPassword(), it must be able to access _password:

```javascript
user = {
  checkPassword(value) {
    return value === this._password;
  }
}
```

### “In range” with “has” trap

We’d like to use “in” operator to check that a number is in range.

The “has” trap intercepts “in” calls: has(target, property)


```javascript
let range = {
  start: 1,
  end: 10
};

range = new Proxy(range, {
  has(target, prop) {
    return prop >= target.start && prop <= target.end
  }
});
// { start: 1, end: 10 }

5 in range
// true

100 in range
// false
```
### Wrapping functions: “apply”

We can wrap a proxy around a function as well.

The apply(target, thisArg, args) trap handles calling a proxy as function.


```javascript
function delay (f, ms) {
    return new Proxy(f, {
        apply (target, thisArgs, args) {
            setTimeout(() => target.apply(thisArgs, args), ms)
        }
    })
}

function sayHi (user) {
    console.log(`hello ${user}`)
}

sayHi = delay(sayHi, 1500)
// [Function: sayHi]

sayHi('eten')
// hello eten
```

**If we have a property on the original function,  it forwards everything to the target object**：


```javascript
sayHi.length
// 1
```

But implement by function-based not works as above.

```javascript
function delay(f, ms) {
  return function() {
    setTimeout(() => f.apply(this, arguments), ms);
  };
}

function sayHi(user) {
  console.log(`Hello, ${user}!`);
}

sayHi.length
// 1

sayHi = delay(sayHi, 1500)
// [Function]

sayHi('eten')
// Hello, eten!

sayHi.length
// 0
```


More traps here: [proxy-object-internal-methods](https://tc39.es/ecma262/#sec-proxy-object-internal-methods-and-internal-slots)

### Refect

The Reflect API was designed to work in tandem with Proxy.


```javascript
let user = {
  _name: "Guest",
  get name() {
    return this._name;
  }
};

user = new Proxy(user, {
  get(target, prop, receiver) {
    return target[prop]; // (*)
  }
});
// { _name: 'Guest', name: [Getter] }

let admin = {
  __proto__: user,
  _name: "Admin"
};

admin.name
// 'Guest'
```


1. There’s no name property in admin, so admin.name call goes to admin prototype.
2. The prototype is the proxy, so its get trap intercepts the attempt to read name.
3. The target, the first argument of get, is always the object passed to new Proxy, the original user. So, `target[prop]` invokes the getter name with this=target=user.

The third argument of get, `receiver` holds the correct `this`. We just need to call Reflect.get to pass it on.


```javascript
user = new Proxy(user, {
    get (target, prop, receiver) {
        return Reflect.get(...arguments)
    }
})
// { _name: 'Guest', name: [Getter] }

let admin = {
  __proto__: user,
  _name: "Admin"
};

admin.name
// 'Admin'
```


### Proxy limitations
#### Built-in objects: Internal slots

Many built-in objects, for example Map, Set, Date, Promise and others make use of so-called “internal slots”.

These are like properties, but reserved for internal purposes. Built-in methods access them directly, not via `[[Get]]/[[Set]]` internal methods. So Proxy can’t intercept that.


```javascript
let map = new Map()

let proxy = new Proxy(map, {})

proxy.set('test', 1)
/*  evalmachine.<anonymous>:1
    proxy.set('test', 1)
    TypeError: Method Map.prototype.set called on incompatible receiver [object Object]
    ...
*/
```

Internally, a Map stores all data in its [[MapData]] internal slot. The proxy doesn’t have such slot. The set method can’t find it in proxy and just fails.

There's a way to fix it.


```javascript
let proxy = new Proxy(map, {
    get (target, prop, receiver) {
        let value = Reflect.get(...arguments)
        return typeof value === 'function' ? value.bind(target) : value
    }
})

proxy.set('test', 1)
// Map { 'test' => 1 }

proxy.get('test')
// 1
```

    Array has no internal slots, built-in Array doesn’t use internal slots.
    So there’s no such problem when proxying an array.

### Private fields
The similar thing happens with private class fields.

```javascript
class User {
  #name = "Guest";

  getName() {
    return this.#name;
  }
}
```

The reason is that private fields are implemented using internal slots. JavaScript does not use `[[Get]]/[[Set]]` when accessing them.

Once again, the solution with binding the method makes it work:

```javascript
user = new Proxy(user, {
  get(target, prop, receiver) {
    let value = Reflect.get(...arguments);
    return typeof value == 'function' ? value.bind(target) : value;
  }
});
```

### Proxy != target

Proxy and the original object are different objects.


```javascript
let allUsers = new Set()

class User {
    constructor (name) {
        this.name = name
        allUsers.add(this)
    }
}

let user = new User('John')

allUsers.has(user)
// true

user = new Proxy(user, {})
// User { name: 'John' }

allUsers.has(user)
// false
```


As we can see, after proxying we can’t find user in the set allUsers, because the proxy is a different object.

    Proxies can intercept many operators, such as new (with construct), in (with has), delete (with deleteProperty) and so on.
    But there’s no way to intercept a strict equality test for objects. An object is strictly equal to itself only, and no other value.

### Revocable proxies
A revocable proxy is a proxy that can be disabled.


```javascript
let object = {
    data: 'Valuable data'
}

let revokes = new WeakMap()

let { proxy, revoke } = Proxy.revocable(object, {})

proxy.data
// 'Valuable data'

revokes.set(proxy, revoke)
// WeakMap {}

revokes.get(proxy)()
proxy.data
/*  evalmachine.<anonymous>:1
    proxy.data
    TypeError: Cannot perform 'get' on a proxy that has been revoked
*/
```

A call to `revoke()` removes all internal references to the target object from the proxy, so they are no more connected. The target object can be garbage-collected after that.

Using WeakMap instead of Map here, because if a proxy object becomes “unreachable”, WeakMap allows it to be wiped from memory.

### Summary

Proxy is a wrapper around an object, that forwards operations to the object, optionally trapping some of them. Then we should use proxy everywhere instead of target.

A proxy doesn’t have its own properties or methods. It traps an operation if the trap is provided or forwards it to target object.

The Reflect API is designed to complement Proxy. For any Proxy trap, there’s a Reflect call with same arguments. We should use those to forward calls to target objects.



### Questions:

In some languages, we can access array elements using negative indexes, counted from the end. Create a proxy to implement that behavior:


```javascript
let array = [1,2,3]

array = new Proxy(array, {
    get (target, prop, receiver) {
        if (prop < 0) {
            prop = +prop + target.length
        }
        return Reflect.get(target, prop, receiver)
    }
})

array[-1]
// 3

array[-3]
// 1
```
