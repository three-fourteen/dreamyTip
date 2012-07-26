/*
* @fileoverview DreamyTip v2.0 - jQuery tooltip widget
* @author andres(at)dreamsiteweb.com (Andres Pi)
* 
* 2012 - dreamsiteweb.com
* 
* @license Dual licensed under the MIT and GPL licenses:
* http://www.opensource.org/licenses/mit-license.php
* http://www.gnu.org/licenses/gpl.html 
* 
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

    /**
     * Constants
     */
    var DREAMY_TIP = 'dreamyTip';

    /**
     * Public methods
     */
    var publicMethods = {
        init: function(options){
            return this.each(function(){
                var opts  = $.extend({}, $.fn[DREAMY_TIP].defaults, options);
                var $this = $(this);
                if(opts.addCursorPointer){
                    $this.css('cursor','pointer');
                }
                var data  = $this.data(DREAMY_TIP);
                if (!data) {
                    $this.data(DREAMY_TIP, {
                        opts: opts,
                        id: new Date().getTime() //get date and use it to set an unique id to the object
                    });
                }

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
                            newOffsetLeft = Math.abs(offsetLeft + $this.outerWidth()) + 5;
                            break;
                        default:
                            newOffsetLeft = Math.abs(offsetLeft + $this.outerWidth()/2 - dreamyTip.outerWidth()/2);
                            break;
                    }
                    return newOffsetLeft;
                };

                //Outside events
                var clickOutsideOn = function (element){
                    element.bind( "clickoutside", disappear);
                } 

                var clickOutsideOff = function (element){
                    element.unbind( "clickoutside", disappear);
                }

                //show the tooltip
                var appear = function(){
                    $this._isOpen = true; 
                    var _offset = $this.offset();
                    dreamyTip.children('.dreamyTipInner').text($this.attr('dtMsg'));
                    dreamyTip.css({
                        top: getTop(_offset.top + opts.offsetTopAdd),
                        left: getLeft(_offset.left + opts.offsetLeftAdd),
                        zIndex: 10000,
                        display:'block'
                    }).stop().animate({
                        opacity: opts.fade
                    }, opts.duration, opts.easing, function(){
                        opts.callbackOnShow();
                        clickOutsideOn(dreamyTip);

                    });
                };
                //hide the tooltip
                var disappear = function(){
                    $this._isOpen = false;
                    dreamyTip.animate({
                        opacity:0
                    }, opts.duration, opts.easing, function(){
                        $(this).css({
                            zIndex:0,
                            display:'none'
                        });
                        opts.callbackOnHide();
                        clickOutsideOff(dreamyTip);
                    });
                };
                /**
                 * Create the tooltip and add it to the DOM
                 * @param {number} id timestamp to use as element ID
                 */
                var createTip = function(id){
                    if(opts.closeButton){
                        $('body').append('<div class="dreamyTip dt-' + opts.position + '" id="dreamyTip' + id + '"><div class="dreamyTipBtn">x</div><div class="dreamyTipInner"></div></div>');
                        $('#dreamyTip' + _id + ' .dreamyTipBtn').bind('click', function(){
                            disappear();
                        });
                    }else{
                        $('body').append('<div class="dreamyTip dt-' + opts.position + '" id="dreamyTip' + id + '"><div class="dreamyTipInner"></div></div>');
                    }
                    dreamyTip = $('#dreamyTip' + id);
                    if(opts.closeWithClick){
                        dreamyTip.bind('click', function(){
                            disappear();
                        });
                    }
                    if(opts.fontSize){
                      dreamyTip.css('font-size',opts.fontSize);
                    }
                    if(opts.backgroundPosition){
                      dreamyTip.css('background-position',opts.backgroundPosition);
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
                $this.bind(opts.event + '.' + DREAMY_TIP,
                  function(){
                    if(!dreamyTip){createTip($(this).data(DREAMY_TIP).id)}
                    toogleTooltip();
                });
            });
        },
        destroy: function(){
            return this.each(function() {
                var $this = $(this);
                var data  = $this.data(DREAMY_TIP);
                // Unbind event from the target
                $(this).unbind('.' + DREAMY_TIP);
                // Remove the tooltip from the DOM
                $('#dreamyTip' + data.id).remove();
                // Remove the data
                $this.removeData(DREAMY_TIP);
            });
        }
    };


    /**
     *  Plugin Initialization
     */
    $.fn[DREAMY_TIP] = function(method){
        if(publicMethods[method]){
            return publicMethods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
        }else if( typeof method === 'object' || ! method ) {
            return publicMethods.init.apply( this, arguments );
        }else{
            $.error( 'Method ' +  method + ' does not exist on jQuery.dreamyTip' );
        }
    };

    /**
     * Options
     */
    $.fn[DREAMY_TIP].defaults = {
        addCursorPointer: true, // add style cursor pointer on the target
        offsetLeftAdd: 0, // add extra left offset
        offsetTopAdd: 0, // add extra top offset
        backgroundPosition: false, // String to set a different background position (ex. "30px", "5% 10px", "left top")
        fade:  0.9, // opacity of the tooltip
        duration: 'medium', // duration of the animation
        easing: 'swing', //effect
        event:'click', // click & hover are allowed
        closeButton: true, //True for the "x" button in the tooltip
        closeWithClick:false, //True to close when you click the tooltip
        position:'top', // top, right, left, bottom
        fontSize: false, // Set a different font-size than the default on CSS
        callbackOnShow: function(){}, // Callback for appear function
        callbackOnHide: function(){} // Callback for disappear function
    };
})(jQuery);