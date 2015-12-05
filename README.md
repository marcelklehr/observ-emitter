# observ-emitter
Similar to Raynos' [geval](https://github.com/Raynos/geval), with the following changes:

 * proxies all arguments of the emit method to listeners
 * allows you to register listeners for change events of the emitter (e.g. when a listener is added/removed)

## Example
You get an atomic value that you can pass around to add listeners and emit events. Render functions only get the emitter function, clearly cementing the unidirectional data flow -- you can't add listeners in your render functions.

The following example demonstrates the main purpose of observ-emitter: The Counter component is extensible and allows the CounterIncrement plugin to add a button that increments the counter value.
```js
var ObservStruct = require('observ-struct')
  , ObservValue = require('observ')
  , ObservEmitter = require('observ-emitter')
var vdom = require('virtual-dom')
  , h = vdom.h

function Counter() {
  return ObservStruct({
    count: ObservValue(0)
  , hooks: ObservStruct({
      increase: ObservEmitter()
    , render: ObservEmitter()
    })
  })
}

Counter.setup = function setup(app) {
  app.hooks.increase.listen(function() {
    app.count.set(app.count()+1)
  })
}

Counter.render = function render(state) {
  return h('div.Counter', extend(state.hooks.render, state, [ // <-- This is where the magin happens!
    h('span.Counter__count', String(state.count))
  ]))
}

function extend(hook, state, children) {
  hook(state, children)
  return children
}

// This is a plugin that extends the Counter component with a button for the user to increase
// the counter value.
function CounterIncrement(state) {
  state.hooks.render.listen(function(state, children) {
    children.push(
      CounterIncrement.render(state)
    )
  })
}

CounterIncrement.render = function(state) {
  return h('button.Counter__btn', {
    'ev-click': state.hooks.increase
  }, '+')
}

main(Counter
  // extensions:
, [ CounterIncrement ]
, vdom)

// Main loop
function main(component, hooks, vdom) {
  var state = component()
  component.setup(state)
  hooks.forEach(function(hook) {
    hook(state)
  })
  var tree = component.render(state())
    , node = vdom.create(tree)
  state(function(s) {
    var newtree = component.render(s)
    vdom.patch(vdom.diff(tree, newtree), node)
    tree = newtree
  })
  return node
}
```


## API
### Emitter(): Emitter
Create an event emitter.

### emitter(onchange:Function)
Listen to changes in listeners (i.e. `onchange` gets called when a listener is added or removed).

### emitter.listen(listener:Function)
Add an event listener.

### emitter.emit(args...)
Emit the event.

## Meta
This is raw meat! It's a first implementation of an idea. If this doesn't work for you, or you would like to report a problem (be it philosophical or technical) please file an issue!

## Legal
(c) 2015 by Marcel Klehr  
MIT License