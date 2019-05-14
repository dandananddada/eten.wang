---
layout: post
category: frontend
date:   2019-03-01
path:  garbage-collection
title: Garbage Collection
summary: 'Trash talk: the Orinoco garbage collector'
---

### Reachability
Simply put, “reachable” values are those that are accessible or usable somehow. They are guaranteed to be stored in memory.

- Local variables and parameters of the current function
- Variables and parameters for other functions on the current chain of nested calls
- Global variables
- Any other value is considered reachable if it’s reachable from a root by a reference or by a chain of references

There’s a background process in the JavaScript engine that is called garbage collector. It monitors all objects and removes those that have become unreachable.

```javascript
// user has a reference to the object
let user = {
  name: "John"
};
```

Here the arrow depicts an object reference. The global variable "user" references the object `{name: "John"}` (we’ll call it John for brevity). The "name" property of John stores a primitive, so it’s painted inside the object.

![image.png](https://javascript.info/article/garbage-collection/memory-user-john.png)

If the value of user is overwritten, the reference is lost:

```javascript
user = null;
```

Now John becomes unreachable. There’s no way to access it, no references to it. Garbage collector will junk the data and free the memory.

![image.png](https://javascript.info/article/garbage-collection/memory-user-john-lost.png)

#### Two references
Now let’s imagine we copied the reference from user to admin
```javascript
// user has a reference to the object
let user = {
  name: "John"
};

let admin = user;
```
![image.png](https://javascript.info/article/garbage-collection/memory-user-john-admin.png)

Now if we do the same:
```javascript
user = null;
```
Then the object is still reachable via admin global variable, so it’s in memory. If we overwrite admin too, then it can be removed.

#### Interlinked objects
```javascript
function marry(man, woman) {
  woman.husband = man;
  man.wife = woman;

  return {
    father: man,
    mother: woman
  }
}

let family = marry({
  name: "John"
}, {
  name: "Ann"
});

```
The resulting memory structure:

![image.png](https://javascript.info/article/garbage-collection/family.png)

Now let’s remove two references:
```javascript
delete family.father;
delete family.mother.husband;
```
![image.png](https://javascript.info/article/garbage-collection/family-delete-refs.png)

We can see that John has no incoming reference any more, John is now unreachable and will be removed from the memory with all its data that also became unaccessible.
After garbage collection:

![image.png](https://javascript.info/article/garbage-collection/family-no-father-2.png)

#### Unreachable island
It is possible that the whole island of interlinked objects becomes unreachable and is removed from the memory.
```javascript
family = null;
```
The former "family" object has been unlinked from the root, there’s no reference to it any more, so the whole island becomes unreachable and will be removed.
The in-memory picture becomes:

![image.png](https://javascript.info/article/garbage-collection/family-no-family.png)

### Algorithms
The basic garbage collection algorithm is called “mark-and-sweep”.
1. The garbage collector takes roots and “marks” (remembers) them.
2. Then it visits and “marks” all references from them.
3. Then it visits marked objects and marks their references. All visited objects are remembered, so as not to visit the same object twice in the future.
4. And so on until there are unvisited references.
5. All objects except marked ones are removed.

For instance, let our object structure look like this:

![image.png](https://javascript.info/article/garbage-collection/garbage-collection-1.png)

We can clearly see an “unreachable island” to the right side

#### mark-and-sweep
The first step marks the roots:

![image.png](https://javascript.info/article/garbage-collection/garbage-collection-2.png)

Then their references are marked:

![image.png](https://javascript.info/article/garbage-collection/garbage-collection-3.png)

…And their references, while possible:

![image.png](https://javascript.info/article/garbage-collection/garbage-collection-4.png)

Now the objects that could not be visited in the process are considered unreachable and will be removed:

![image.png](https://javascript.info/article/garbage-collection/garbage-collection-5.png)

### Optimizations
JavaScript engines apply many optimizations to make it run faster and not affect the execution.

#### Generational collection
objects are split into two sets: “new ones” and “old ones”. Many objects appear, do their job and die fast, they can be cleaned up aggressively. Those that survive for long enough, become “old” and are examined less often.

#### Incremental collection
if there are many objects, and we try to walk and mark the whole object set at once, it may take some time and introduce visible delays in the execution. So the engine tries to split the garbage collection into pieces. Then the pieces are executed one by one

#### Idle-time collection
the garbage collector tries to run only while the CPU is idle, to reduce the possible effect on the execution

### Summary

- Garbage collection is performed automatically. We cannot force or prevent it.
- Objects are retained in memory while they are reachable.
- Being referenced is not the same as being reachable (from a root): a pack of interlinked objects can become unreachable as a whole.
 

## Trash talk: the Orinoco garbage collector

### Major GC (Full Mark-Compact) 

![image.png](https://v8.dev/_img/trash-talk/01.svg)

#### Marking

Figuring out which objects can be collected is an essential part of garbage collection. Garbage collectors do this by using reachability as a proxy for ‘liveness’. This means that any object currently reachable within the runtime must be kept, and any unreachable objects may be collected.

#### Sweeping

Sweeping is a process where gaps in memory left by dead objects are added to a data structure called a **free-list**. Once marking has completed, the GC finds contiguous gaps left by unreachable objects and adds them to the appropriate free-list. Free-lists are separated by the size of the memory chunk for quick lookup. In the future when we want to allocate memory, we just look at the free-list and find an appropriately sized chunk of memory.

#### Compaction 

The major GC also chooses to evacuate/compact some pages, based on a fragmentation heuristic. You can think of compaction sort of like hard-disk defragmentation on an old PC.
磁盘压缩

### Generational

The heap in V8 is split into different regions called generations. There is a young generation (split further into ‘nursery’ and ‘intermediate’ sub-generations), and an old generation. Objects are first allocated into the nursery. If they survive the next GC, they remain in the young generation but are considered ‘intermediate’. If they survive yet another GC, they are moved into the old generation.

![image.png](https://v8.dev/_img/trash-talk/02.svg)

In garbage collection there is an important term: “The Generational Hypothesis”. This basically states that most objects die young. In other words, most objects are allocated and then almost immediately become unreachable, from the perspective of the GC. This holds not only for V8 or JavaScript, but for most dynamic languages.

This means that we only pay a cost (for copying) proportional to the number of surviving objects, not the number of allocations.

### Minor GC
There are two garbage collectors in V8. The Major GC (Mark-Compact) collects garbage from the whole heap. The Minor GC (Scavenger) collects garbage in the young generation.

In the Scavenger, which only collects within the young generation, surviving objects are always evacuated to a new page.V8 uses a ‘semi-space’ design for the young generation. This means that half of the total space is always empty, to allow for this evacuation step.

During a scavenge, this initially-empty area is called ‘To-Space’. The area we copy from is called ‘From-Space’.

The evacuation step moves all surviving objects to a contiguous chunk of memory (within a page). This has the advantage of completing removing fragmentation - gaps left by dead objects. We then switch around the two spaces i.e. To-Space becomes From-Space and vice-versa. Once GC is completed, new allocations happen at the next free address in the From-Space.

![image.png](https://v8.dev/_img/trash-talk/03.svg)

We quickly run out of space in the young generation with this strategy alone. Objects that survive a second GC are evacuated into the old generation, rather than To-Space.

The final step of scavenging is to update the pointers that reference the original objects, which have been moved. Every copied object leaves a forwarding-address which is used to update the original pointer to point to the new location.

![image.png](https://v8.dev/_img/trash-talk/04.svg)

In scavenging we actually do these three steps — **marking, evacuating, and pointer-updating**.

### Orinoco

Orinoco is the codename of the GC project to make use of the latest and greatest parallel, incremental and concurrent techniques for garbage collection.

#### Parallel
This is still a ‘stop-the-world’ approach, but the total pause time is now divided by the number of threads participating

![image.png](https://v8.dev/_img/trash-talk/05.svg)

#### Incremental
Incremental is where the main thread does a small amount of work intermittently. We don’t do an entire GC in an incremental pause, just a small slice of the total work required for the GC.
This does not reduce the amount of time spent on the main thread (in fact, it usually increases it slightly), it just spreads it out over time.

![image.png](https://v8.dev/_img/trash-talk/06.svg)

#### Concurrent
Concurrent is when the main thread executes JavaScript constantly, and helper threads do GC work totally in the background. This is the most difficult of the three techniques: anything on the JavaScript heap can change at any time
The advantage here is that the main thread is totally free to execute JavaScript

![image.png](https://v8.dev/_img/trash-talk/07.svg)

### State of GC in V8

#### Scavenging
V8 uses parallel scavenging to distribute work across helper threads during the young generation GC.

![image.png](https://v8.dev/_img/trash-talk/08.svg)

#### Major GC
Major GC in V8 starts with concurrent marking.
Concurrent marking happens entirely in the background while JavaScript is executing on the main thread

When the concurrent marking is finished, The main thread pause begins during this phase. This represents the total pause time of the major GC. The main thread scans the roots once again, to ensure that all live objects are marked,
and then along with a number of helpers, starts parallel compaction and pointer updating.

![image.png](https://v8.dev/_img/trash-talk/09.svg)

#### Idle-time GC
The GC can post ‘Idle Tasks’ which are optional work that would eventually be triggered anyway. Embedders like Chrome might have some notion of free or idle time. For example in Chrome, at 60 frames per second, the browser has approximately 16.6 ms to render each frame of an animation

![image.png](https://v8.dev/_img/trash-talk/10.svg)

The parallel Scavenger has reduced the main thread young generation garbage collection total time by about 20%–50%, depending on the workload. Idle-time GC can reduce Gmail’s JavaScript heap memory by 45% when it is idle. Concurrent marking and sweeping has reduced pause times in heavy WebGL games by up to 50%.

- https://queue.acm.org/detail.cfm?id=2977741
- https://v8.dev/blog/free-garbage-collection
- https://v8.dev/blog/jank-busters
- https://v8.dev/blog/orinoco
