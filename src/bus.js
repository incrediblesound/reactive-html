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