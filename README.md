Reactive HTML
=============

This is a framework for writing reactive websites. It uses a central event bus and a decatorator that adds chainable methods to any object.

To install use bower: `bower install reactive-event-bus` and require dist/main.min.js.

Here is a quick example to demonstrate basic use:
```javascript
// creates an object call timer and appends it to the dom
var timer = $('<h1>0</h1>');
$('.container').append(timer);

// here we use the decorator to make the timer reactive
timer = reactive(timer);

// every three seconds increment the timer text and emit a tick event
setInterval(function(){
  var text = clock.text();
  var number = parseInt(text);
  number++;
  clock.text(number);
  clock.emit('tick', number);
}, 3000);

// this helper function returns a reactive object that listens for the tick event
var temporal = function(){
  return reactive({}).listen('tick');
}
// create an object the emits a 'sunday' event every seven ticks and also runs a function
var everySunday = temporal()
.interval(7)
.emit('sunday')
.run(function(_this, data){ console.log('It\'s sunday!')});

// create an object that logs the day for only the first week
var firstWeek = temporal()
.filter(function(_this, data){ return data < 8 })
.run(function(_this, data){ console.log('Day '+data+' of week one.') });
```
From the above example you can see that emitters can both listen for and emit events, and that the reaction can be fine tuned using chainable methods like filter and interval. A more in-depth explanation of the library follows bellow:

Converting Native Events
------------------------
For convenience I made a bus.listen method that converts the on{action} methods of dom objects into central bus events. So, for example, if you want all your buttons to be reactive <strong>and</strong> to emit a 'click' event when clicked, you would write the following code:

```javascript
var buttons = document.getElementsByTagName('button');
// iterate over the buttons and pass each one into the reactive decorator
forEach(buttons, function(button){
  button = reactive(button);
});
// make the onclick event listener emit a 'click' event from the event bus.
bus.listen({
  items: buttons, 
  name: 'click',
  type: 'html'
  });
```
Call listen on a reactive element to make it react to an event. The listen method will return an Emitter object which has the following methods:    
<strong>RUN</strong>  
Run will invoke the function passed into it when the listen event is emitted.
```javascript
var div = $('<div></div>');
div = reactive(div);

div.listen('click').run(function(_this){ _this.innerText = "clicked" })
// run returns the emitter for method chaining
div.listen('click').run(function(_this){ _this.innerText = "clicked" }).run(etc...)
```
<strong>INTERVAL</strong>    
Interval takes a number and modifies the emitter to trigger functions only at intervals equal to the number. You cannot chain intervals, they will overwrite each other unless you call listen at the end of a chain to start a new reaction chain. 
```javascript
div    
.listen('click')    
.interval(3)   
.run(function(_this){ _this.innerText = "thrice clicked" });
```
<strong>FILTER</strong>    
Filter takes a function and modifies the emitter to trigger event responses only when the filter function returns true. Filter functions are chainable.
```javascript
div    
.listen('keypress')    
.filter(function(_this, data){
	return(data.keyCode === 102);
})   
.run(function(_this){ _this.innerText = "Pressed 'f' key" });

// a hypothetical form that automatically submits when the inputs are valid
form
.listen('form.change')
.filter(function(_this, data){ $('.phone').value.isValid() })
.filter(function(_this, data){ $('.email').value.isValid() })
.run(function(_this, data){ _this.submit() })
```
<strong>MERGE</strong>    
Merge returns an emitter that can trigger a function on multiple events.
```javascript
div     
.listen('click')   
.merge('keypress')    
.run(function(_this){ _this.innerText = "click or press" });
```
<strong>MAP</strong>    
Map takes a function that returns any value. The function passed into map will be invoked with the context and any data passed along with the event. Map does not return an emitter, but instead returns an object with a "then" method that takes a function. The function passed into "then" will be invoked with the value returned by the map function and the context whenever the event is triggered. The original emitter will be returned by then for continued chaining.
```javascript
window
.listen('click')
.map(function(_this, e){ return _this.users })
.then(function(val, _this){ _this.count = val })
.run(...)
```




