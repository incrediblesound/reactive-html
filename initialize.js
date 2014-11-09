var div = document.getElementById('messages');
var buttons = document.getElementsByTagName('button');

// make our elements reactive //
div = reactive(div);
document = reactive(document);
forEach(buttons, function(btn){
  btn = reactive(btn);
});

var btn = buttons[0];
var btn2 = buttons[1];
var btn3 = buttons[2];
// setup reactive behavior //

// emit a click event from the event bus on every onclick event on the buttons //
bus.listen([btn, btn2, btn3], 'click');
bus.listen(document, 'keypress');

//append a message for every three click events and for each keypress
div
.listen('click')
.filter(3)
.run(function (_this){
  var msg = document.createElement('p');
  msg.textContent = "three clicks";
  _this.appendChild(msg);
})
.listen('keypress')
.run(function (_this, e){
  var p = document.createElement('p');
  p.innerText = 'Pressed';
  _this.appendChild(p);
})
.listen('keypress')
.merge('click')
.run(function (_this){
  var p = document.createElement('p');
  p.innerText = 'Click or Press';
  _this.appendChild(p);
})

// increment button text on every click event and reset to zero on every five event
btn2
.listen('click')
.run(function (_this){
  var num = parseInt(_this.textContent);
  _this.textContent = (num+1).toString(); 
})
.listen('five')
.run(function (_this){
  _this.textContent = "0";
})
.map(function(){
  return 1;
})
.then(function(val){
  console.log(val);
});

// every five clicks run the callback and emit the 'five' event
btn3
.listen('click')
.filter(5)
.run(function (_this){
  var text = _this.textContent;
  var num = parseInt(text[text.length-1]);
  num += 1;
  _this.textContent = "five-clicks: "+num;
})
