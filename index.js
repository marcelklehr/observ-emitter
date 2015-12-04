var AtomicEmitter = require('atomic-emitter')

module.exports = ObservEmitter

// Emitter([constructor:Function(emit:Function(args...))]) -> emitter:Function
function ObservEmitter(constructor) {
  var atomicEmitter = AtomicEmitter()
  var changeListeners = []

  // emitter(changeListener:Function)
  var emitter = function(changeListener) {
    if(!changeListener) {
      return atomicEmitter.emit
    }

    changeListeners.push(changeListener)
    onchange()
  }
  
  // emitter.emit(args...)
  if(!constructor) {
    emitter.emit = atomicEmitter.emit
  }
  
  // emitter.listen(listener:Function) : Function
  emitter.listen = function(listener) {
    var removeListener = atomicEmitter(listener)
    return function() {
      removeListener()
      onchange()
    }
  }
  
  function onchange() {
    for(var i=0; i<changeListeners.length; i++) {
      changeListeners[i]()
    }
  }
  
  return emitter
}