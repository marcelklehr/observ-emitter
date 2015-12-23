/* global xdescribe, describe, it, xit */
var Emitter = require('../')
  , expect = require('expect.js')

var END = {}

describe('observ-emitter', function() {

  it('should emit events', function(done) {
    var emitter = Emitter()
      , values = [1,2,3]
      , result = []
    
    emitter.listen(function(value) {
      result.push(value)
    })

    values.forEach(emitter.emit)

    setTimeout(function() {
      expect(result).to.eql(values)
      done()
    }, 0)
  })
  
  it('should remove the listener', function(done) {
    var emitter = Emitter()
      , values = [1,2,3,END, 4]
      , result = []
    
    var removeListener = emitter.listen(function(value) {
      result.push(value)
      if(value === END) removeListener()
    })
    
    values.forEach(emitter.emit)

    setTimeout(function() {
      expect(result).to.eql([1,2,3,END])
      done()
    }, 0)
  })
  
  xit('should restrict emit access', function(done) {
    var emit
    var emitter = Emitter(function(e) {
      emit = e
    })
    var values = [1,2,3]
      , result = []
    
    emitter.listen(function(value) {
      result.push(value)
    })
    
    values.forEach(emit)
    
    expect(function () {
      emitter.emit(4)
    }).to.throwError()

    setTimeout(function() {
      expect(result).to.eql([1,2,3])
      done()
    }, 0)
  })
  
  it('should return emit fn if called without args', function() {
    var emitter = Emitter()
    
    expect(emitter()).to.be(emitter.emit)
  })

  it('should call change listeners when a listener is added', function(done) {
    var emit
    var emitter = Emitter()
    var values = [1,2,3]
      , result = []
    
    var arg
    emitter(function(newval) {
      called = true
      arg = newval
    })
    
    var called = false
    emitter.listen(function(value) {
      result.push(value)
    })
    
    setTimeout(function() {
      expect(called).to.equal(true)
      expect(arg).to.be(emitter.emit)
      done()
    }, 0)
  })
  
  it('should call change listeners when a listener is removed', function(done) {
    var emit
    var emitter = Emitter()
    var values = [1,2,3]
      , result = []
    
    var removeListener = emitter.listen(function(value) {
      result.push(value)
    })
    
    var called = false
    emitter(function() {
      called = true
    })
    
    removeListener()
    
    setTimeout(function() {
      expect(called).to.equal(true)
      done()
    }, 0)
  })
})