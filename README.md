# DreamyTip: a simple and lovely jQuery tooltip v3.5.1 #

The usage is similar to any Pluing jQuery.
The only settings in the HTML is the title attribute
in the tag that will have the tooltip, which will
contain the text to display.
You should include the plugin file and dreamytip.css.

The avaliable **options** are:

*      cursor: 'pointer', // pointer, help, default, etc. Add style cursor on the target
*      textAlign: 'center', // center, left, right, justify
*      offsetLeftAdd: 0, // add extra left offset
*      offsetTopAdd: 0, // add extra top offset
*      backgroundPosition: false, // String to set a different background position (ex. "30px", "5% 10px", "left top")
*      fade:  0.9, // opacity of the tooltip
*      startDelay: 0, // Add a delay time before the tooltip appear
*      removeQueuedAnimation: false, //A Boolean indicating whether to remove queued animation as well on the show event.
*      duration: 'medium', // duration of the animation
*      easing: 'swing', //effect
*      event:'click', // click, focus, load, blur & hover are allowed or none in case you want to trigger manually
*      persistHover: false, // enable a tooltip to persist until the user clicks somewhere else on the page
*      closeButton: true, //True for the "x" button in the tooltip
*      closeButtonOnHover: false, //Force close button on hover
*      closeWithClick:false, //True to close when you click the tooltip
*      closeOnBlur:false, //True to close when the trigger element lose focus
*      autoCloseAfter: false, // milliseconds to wait to auto close
*      position:'top', // top, right, left, bottom
*      fontSize: false, // Set a different font-size than the default on CSS
*      msg:false, // String with the message
*      size: 'default', // Set the size of the tooltip: 'default' or 'large'.
*      color: 'default',
*      callbackOnShow: function(){}, // Callback for appear function. Could be the name of the function or if you need pass params an object like this: {f:writeSomething,params:'callbackOnShow: the tooltip appear'}}
*      callbackOnHide: function(){} // Callback for disappear function. Could be the name of the function or if you need pass params an object like this: {f:writeSomething,params:'callbackOnShow: the tooltip appear'}}

You can find some demos [here](http://andres314.github.io/dreamyTip/ "DreamyTip demo page")