var bus = {
  events: [],
  eventMap: {},
  run: function(){
    var _this = this;
    var data, _event;
    setInterval(function(){
      if(_this.events.length){
        _event = _this.events.shift();
        if(Array.isArray(_event)){
          data = _event.pop();
          _event = _event.pop();
        } else {
          data = undefined;
        }
        forEach(_this.eventMap[_event], function(response){
          var cb = response[0];
          var context = response[1];
          cb(context, data);
        });
      }
    }, 5);
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
        //
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
    if(data === undefined){
      this.events.push(e);
    } else {
      this.events.push([e, data]);
    }
  }
};

bus.run();

// helper functions

function forEach(arr, fn){
  for(var i = 0, l = arr.length; i < l; i++){
    fn(arr[i], i);
  }
}