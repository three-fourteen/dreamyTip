/*
* DreamyTip v2.0 - jQuery tooltip widget
* 2012 Andres Pi
*
* andres(at)dreamsiteweb.com
* http://labs.dreamsiteweb.com
* 
* Dual licensed under the MIT and GPL licenses:
* http://www.opensource.org/licenses/mit-license.php
* http://www.gnu.org/licenses/gpl.html 
*
* The usage is similar to any Pluing jQuery.
* The only settings in the HTML is the title attribute
* in the tag that will have the tooltip, which will
* contain the text to display. 
* You should include this file, dreamytip.css, dreamytip.png and the 
* jquery.ba-outside-events.min.js plugin by Ben Alman for the events
* outside the tooltip(for more info 
* about this plugin check this site http://bit.ly/gCHiHT). 
*
*/
(function($) {
    $.fn.dreamyTip = function(options) {
        var opts = $.extend({}, $.fn.dreamyTip.defaults, options);
        if(opts.insertCSS){
          $('head').append('<link rel="stylesheet" href="css/dreamytip.css" type="text/css" />');
        }
        return this.each(function(){
            var $this = $(this).css('cursor','pointer');
            var dreamyTip;
            
            //delete title attribute to avoid the default behavior
            $this.attr('dtMsg',$this.attr('title'));
            $this.removeAttr('title');
            

            //get top position for the tooltip
            var getTop = function(offsetTop){
              var _theTop;
              if(_theTop<0 || opts.position == 'bottom'){
                  _theTop = offsetTop + $this.height();
              }else if(opts.position == 'left' || opts.position == 'right'){
                  _theTop = offsetTop + $this.outerHeight()/2 - dreamyTip.outerHeight()/2;
              }else{
                  _theTop = offsetTop - dreamyTip.outerHeight();
              }
              return _theTop;
            };
            
            //get left position for the tooltip
            var getLeft = function(offsetLeft){
              var newOffsetLeft;
              switch(opts.position){
                  case 'left':
                      newOffsetLeft = Math.abs(offsetLeft - dreamyTip.outerWidth()) - 5;
                      break;
                  case 'right':
                      newOffsetLeft = Math.abs(offsetLeft + Math.abs($this.outerWidth() - dreamyTip.outerWidth())) + 5;
                      break;
                  default:
                      newOffsetLeft = Math.abs(offsetLeft + $this.outerWidth()/2 - dreamyTip.outerWidth()/2);
                      break;
              }
              return newOffsetLeft;
            };
            
            //Outside events
            var clickOutsideOn = function (element){
                $('*:not(#' + element.selector + ')').bind( "click", disappear);
            } 

            var clickOutsideOff = function (element){
                $('*:not(#' + element.selector + ')').unbind( "click", disappear);
            }
            
            //show the tooltip
            var appear = function(){
                var _offset = $this.offset();
                dreamyTip.children('.dreamyTipInner').text($this.attr('dtMsg'));
                dreamyTip.css({
                      top: getTop(_offset.top),
                      left: getLeft(_offset.left),
                      zIndex: 10000,
                      display:'block'
                  }).animate({
                      opacity: opts.fade
                  }, opts.duration, opts.easing, function(){
                      eval(opts.callbackOnShow);
                      clickOutsideOn(dreamyTip);
                      $this._isOpen = true;
                  });
            };
            //hide the tooltip
            var disappear = function(){
                dreamyTip.animate({
                    opacity:0
                }, opts.duration, opts.easing, function(){
                    $(this).css({
                        zIndex:0,
                        display:'none'
                    });
                    eval(opts.callbackOnHide);
                    clickOutsideOff(dreamyTip);
                    $this._isOpen = false;
                });
            };
            //create the tooltip and add it to the DOM
            var createTip = function(){
                //get date and use it to set an unique id to the object
                var _id = new Date().getTime();
                if(opts.closeButton){
                    $('body').append('<div class="dreamyTip dt-' + opts.position + '" id="dreamyTip' + _id + '"><div class="dreamyTipBtn">x</div><div class="dreamyTipInner"></div></div>');
                    $('#dreamyTip' + _id + ' .dreamyTipBtn').bind('click', function(){
                        disappear();
                    });
                }else{
                    $('body').append('<div class="dreamyTip" id="dreamyTip' + _id + '"><div class="dreamyTipInner"></div></div>');
                }
                dreamyTip = $('#dreamyTip' + _id);
                if(opts.closeWithClick){
                    dreamyTip.bind('click', function(){
                        disappear();
                    });
                }
            };

            //event
            var toogleTooltip = function(){
                if($this._isOpen){
                    disappear();
                }else{
                    appear();
                }                    
            }
            if(opts.event=='hover'){
                $this.hover(
                  function () {
                    if(!dreamyTip){createTip()}
                    toogleTooltip();
                  }, 
                  function () {
                    toogleTooltip();
                  }
                );
            }else{
                $this.click(function(){
                  if(!dreamyTip){createTip()}
                  toogleTooltip();
                });
            }
        });
    };
    $.fn.dreamyTip.defaults = {
        fade:  0.9, // opacity of the tooltip
        duration: 'medium', // duration of the animation
        easing: 'swing', //effect
        event:'click', // click & hover are allowed
        closeButton: true, //True for the "x" button in the tooltip
        closeWithClick:false, //True to close when you click the tooltip
        position:'top', // top, right, left, bottom
        insertCSS: false, //true to insert the dreamyTip.css dynamically
        callbackOnShow: false, // Callback for appear function
        callbackOnHide: false // Callback for disappear function
    };
})(jQuery);