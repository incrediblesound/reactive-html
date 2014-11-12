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
    var callback = fn, previousFn;
    forEach(this.filterFn, function(filter, index){
      if(index === 0){
        fn = function(context, data){
          if (filter(context, data)){ callback(context, data); }
        };
      } 
      else {
        fn = function(context, data){
          if(filter(context, data)){
            previousFn(context, data);
          }
        }
      }
      if(index < _this.filterFn.length-1){
        previousFn = fn;
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
          fn(context, data);
        }
      });
    }
  });
};

Emitter.prototype.emit = function(e, data){
  this.add(function(_this, data){
    _this.emit(e, data);
  })
}

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