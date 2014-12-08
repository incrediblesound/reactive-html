/*! reactive-event-bus - v0.0.0 */
var bus = {
  events: [],
  eventMap: {},
  run: function(){
    var _this = this;
    var data, _event, _eventData;
    if(_this.events.length){
      _eventData = _this.events.shift();
      _event = _eventData[0];
      data = _eventData[1];
      // for every callback registered to that event, invoke the callback
      // and pass in the event data
      forEach(_this.eventMap[_event], function(response){
        var cb = response[0];
        var context = response[1];
        cb(context, data);
      });
    }
  },
  listen: function(options){
    if(!Array.isArray(options.items)){
      options.items = [options.items];
    }
    forEach(options.items, function(obj){
      if(options.type === 'html'){
        var eventName = 'on' + options.name;
        obj[eventName] = function(data){
          if(data !== undefined && ('stopPropagation' in data)){
            data.stopPropagation();
            obj.emit(options.name, data);    
          } 
          else {
            obj.emit(options.name);
          }
        };
      }
      else if(options.type === 'object'){
        // TODO
      }
    });
  },
  add: function(e, context, fn){
    if(this.eventMap[e] === undefined){
      this.eventMap[e] = [];
    }
    this.eventMap[e].push([fn, context]);
  },
  addEvent: function(e, data){
    this.events.push([e, data]);
    this.run();
  }
};

// helper functions

function forEach(arr, fn){
  for(var i = 0, l = arr.length; i < l; i++){
    fn(arr[i], i);
  }
}
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
  return this;
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