var Emitter = function(event, context){
  this.events = [event];
  this.context = context;
  this.modulo = undefined;
  this.filterFn = [];
  this.data = undefined;
};

Emitter.prototype.add = function(fn){
  var _this = this;
  if(this.filterFn.length){
    var cb = fn, prev;
    forEach(this.filterFn, function(filter, index){
      if(index === 0){
        fn = function(context, data){
          if(filter(context, data)){
            cb(context, data);
          }
        };
      } else {
        fn = function(context, data){
          if(filter(context, data)){
            prev(context, data);
          }
        }
      }
      if(index < _this.filterFn.length -1){
        prev = fn;
      }
    })
  }
  forEach(this.events, function(e){
    if(_this.modulo === undefined){
      bus.add(e, _this.context, fn);
    } else {
      var count = 0;
      bus.add(e, _this.context, function (context, data){
        count++;
        if(count % _this.modulo === 0){
          debugger;
          fn(context, data);
        }
      });
    }
  });
};

Emitter.prototype.emit = function(event2, data){
  bus.addEvent(event2, data);
  return this;
};

Emitter.prototype.listen = function(e){
  return new Emitter(e, this.context);
};

Emitter.prototype.merge = function(e){
  this.events.push(e);
  return this;
};

Emitter.prototype.run = function(fn){
  this.add(fn);
  return this;
};

Emitter.prototype.interval = function(num){
  this.modulo = num;
  return this;
};

Emitter.prototype.filter = function(filterFn){
  this.filterFn.push(filterFn);
  return this;
};

Emitter.prototype.map = function(fn){
  var _this = this;
  var output = {
    then: function(fn2){
      _this.add(function (_this, data){
        var result = fn(_this.context, data);
        _this.data = result;
        fn2(result, _this.context);
      });
      return _this;
    }
  };
  return output;
};

// decorator used to make an object reactive //

var reactive = function(obj){
  obj.listen = function(e){
    return new Emitter(e, obj);
  };
  obj.emit = function(e, data){
    bus.addEvent(e, data);
  };
  return obj;
};