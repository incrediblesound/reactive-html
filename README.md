Reactive HTML
=============

This is a framework for writing reactive websites. It uses a central event bus and a decatorator that adds chainable methods to any object.

To use, require bus.js and emitter.js at the top of your HTML. Then, after the body tag and before the closing html tag, require the script that makes the page reactive.

Methods
-------
For convenience I made a bus.listen method that converts the on{action} methods of an array of objects into central bus events. So, for example, if you want all your buttons to be reactive <strong>and</strong> to emit a 'click' event when clicked, you would write the following code:

```javascript
var buttons = document.getElementsByTagName('button');
// iterate over the buttons and pass each one into the reactive decorator
forEach(buttons, function(button){
  button = reactive(button);
});
// make the onclick event listener emit a 'click' event from the event bus.
bus.listen(buttons, 'click');
```
Call listen on a reactive element to make it react to an event. The listen method will return an Emitter object which has the following methods:
<strong>RUN</strong>
Run will invoke the function passed into it when the listen event is emitted.
```javascript
div.listen('click').run(function(_this){ _this.innerText = "clicked" })
// run returns the emitter for method chaining
div.listen('click').run(function(_this){ _this.innerText = "clicked" }).run(etc...)
```
<strong>FILTER</strong>
Filter takes a number and modifies the emitter to trigger functions only at intervals equal to the number.
```javascript
div    
.listen('click')    
.filter(3)   
.run(function(_this){ _this.innerText = "thrice clicked" });
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




