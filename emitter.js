var Emitter = function(event, context){
  this.events = [event];
  this.context = context;
  this.modulo = undefined;
}

Emitter.prototype.add = function(fn){
  var _this = this;
  forEach(this.events, function(e){
    if(_this.modulo === undefined){
      bus.add(e, _this.context, fn);
    } else {
      var count = 0;
      bus.add(e, _this.context, function (context){
        count++;
        if(count % _this.modulo === 0){
          fn(context);
        }
      });
    };
  })
};

Emitter.prototype.emit = function(event2){
  bus.events.push(event2);
  return this;
}

Emitter.prototype.listen = function(e){
  return new Emitter(e, this.context);
}

Emitter.prototype.merge = function(e){
  this.events.push(e);
}

Emitter.prototype.run = function(fn){
  this.add(fn);
  return this;
}

Emitter.prototype.filter = function(num){
  this.modulo = num;
  return this;
}

Emitter.prototype.map = function(fn){
  var _this = this;
  var output = {
    then: function(fn2){
      _this.add(function (_this){
        var result = fn();
        fn2(result);
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