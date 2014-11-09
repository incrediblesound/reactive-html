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
```javascript
// run will run the function when the event passed into listen is emitted
div.listen('click').run(function(_this){ _this.innerText = "clicked" })

// run returns the emitter for method chaining
div.listen('click').run(function(_this){ _this.innerText = "clicked" }).run(etc...)


// filter takes a number and modifies the emitter to trigger functions only at    
// intervals equal to the number
div.listen('click').filter(3).run(function(_this){ _this.innerText = "thrice clicked" });

// map takes a function that should return some value when the event is triggered. 
// it does not return an emitter, but returns a "then" method which takes a function that will be invoked 
// with the value return by the map function whenever the event is triggered.
// the original emitter will be returned by then for continued chaining
window.listen('click').map(function(){ return 1 }).then(function(val){ console.log(val)});
```




