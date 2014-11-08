var Emitter = function(event, context){
  this.event = event;
  this.context = context;
}

Emitter.prototype.emit = function(event2){
  bus.events.push(event2);
  return this;
}

Emitter.prototype.listen = function(e){
  return new Emitter(e, this.context);
}

Emitter.prototype.merge = function(e){
  // TODO: merge event streams
}

Emitter.prototype.run = function(fn){
  var _this = this;
  bus.add(_this.event, _this.context, fn);
  return this;
}

Emitter.prototype.filter = function(num, fn, name){
  var count = 0;
  var _this = this;
  bus.add(_this.event, _this.context, function (context){
    count++;
    if(count % num === 0){
      fn(context);
      if(name !== undefined){ 
        bus.events.push(name); 
      }
    }
  })
  return this;
}

Emitter.prototype.map = function(fn){
  var _this = this;
  var output = {
    then: function(fn2){
      bus.add(_this.event, _this.context, function (_this){
        var result = fn();
        fn2(result)
      });
    }
  };
  return output;
}

// decorator used to make an object reactive //

var reactive = function(obj){
  obj.listen = function(e){
    return new Emitter(e, obj);
  }
  obj.emit = function(e){
    bus.events.push(e);
  }
  return obj;
}