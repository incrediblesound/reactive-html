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
Call listen on a reactive element to make it react to an event. Right now there are three methods that can be chained onto a listen call:
```javascript
// run will run the function when the even passed into listen is emitted
div.listen('click').run(function(_this){ _this.innerText = "clicked" })

// filter takes a number, a function, and an optional event. when the event passed into listen 
// has happened a number of times equal to the number, the function will be called and the event emitted.
div.listen('click').filter(3, function(_this){ _this.innerText = "thrice clicked" }, 'three');

// map takes a function that should return some value when the event is triggered. 
// it is chained upon with the "then" method which takes a function that will be invoked 
// with the value whenever the event is triggered.
window.listen('click').map(function(){ return 1 }).then(function(val){ console.log(val)});
```




