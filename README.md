# DreamyTip: a simple and lovely jQuery tooltip v3.4 #

The usage is similar to any Pluing jQuery.
The only settings in the HTML is the title attribute
in the tag that will have the tooltip, which will
contain the text to display. 
You should include the plugin file, dreamytip.css and dreamytip.png. 
 
The avaliable **options** are:

*  addCursorPointer: true, // add style cursor pointer on the target
*  offsetLeftAdd: 0, // add extra left offset
*  offsetTopAdd: 0, // add extra top offset
*  backgroundPosition: false, // String to set a different background position (ex. "30px", "5% 10px", "left top")
*  fade:  0.9, // opacity of the tooltip
*  startDelay: 0, // Add a delay time before the tooltip appear
*  duration: 'medium', // duration of the animation
*  easing: 'swing', //effect
*  event:'click', // click, focus, blur & hover are allowed
*  persistHover: false, // enable a tooltip to persist until the user clicks somewhere else on the page
*  closeButton: true, //True for the "x" button in the tooltip
*  closeWithClick:false, //True to close when you click the tooltip
*  closeOnBlur:false, //True to close when the trigger element lose focus
*  autoCloseAfter: false, // milliseconds to wait to auto close
*  position:'top', // top, right, left, bottom
*  fontSize: false, // Set a different font-size than the default on CSS
*  callbackOnShow: function(){}, // Callback for appear function. Could be the name of the function or if you need pass params an object like this: {f:writeSomething,params:'callbackOnShow: the tooltip appear'}}
*  callbackOnHide: function(){} // Callback for disappear function. Could be the name of the function or if you need pass params an object like this: {f:writeSomething,params:'callbackOnShow: the tooltip appear'}}

You can find some demos [here](http://dreamsiteweb.com/jquery/plugins/dreamytip/ "DreamyTip demo page")