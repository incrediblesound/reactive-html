var bus = {
  events: [],
  eventMap: {},
  run: function(){
    var _this = this;
    setInterval(function(){
      if(_this.events.length){
        var _event = _this.events.shift();
        forEach(_this.eventMap[_event], function(response){
          var cb = response[0];
          var context = response[1];
          cb(context);
        })
      }
    }, 2)
  },
  listen: function(objs, e){
    forEach(objs, function(obj){
      var eventName = 'on'+e;
      obj[eventName] = function(){
        obj.emit(e);
      }
    })
  },
  add: function(e, context, fn){
    if(this.eventMap[e] === undefined){
      this.eventMap[e] = [];
    }
    this.eventMap[e].push([fn, context]);
  }
}

bus.run();

// helper functions

function forEach(arr, fn){
  for(var i = 0, l = arr.length; i < l; i++){
    fn(arr[i], i);
  }
}