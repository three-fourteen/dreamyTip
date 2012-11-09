/*
* @fileoverview DreamyTip v3.2 - jQuery tooltip widget
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


    ////////////////////
    // Private Methods//
    ////////////////////

    //get top position for the tooltip
    var getTop = function($this, optsPosition, offsetTop){
        var _theTop;
        if(optsPosition == 'bottom'){
            _theTop = offsetTop + $this.height();
        }else if(optsPosition == 'left' || optsPosition == 'right'){
            _theTop = offsetTop + $this.outerHeight()/2 - $this.dreamyTipElememt.outerHeight()/2;
        }else{
            _theTop = offsetTop - $this.dreamyTipElememt.outerHeight();
        }
        return _theTop;
    };

    //get left position for the tooltip
    var getLeft = function($this, optsPosition, offsetLeft){
        var newOffsetLeft;
        switch(optsPosition){
            case 'left':
                newOffsetLeft = Math.abs(offsetLeft - $this.dreamyTipElememt.outerWidth()) - 5;
                break;
            case 'right':
                newOffsetLeft = Math.abs(offsetLeft + $this.outerWidth()) + 5;
                break;
            default:
                newOffsetLeft = Math.abs(offsetLeft + $this.outerWidth()/2 - $this.dreamyTipElememt.outerWidth()/2);
                break;
        }
        return newOffsetLeft;
    };

    //show the tooltip
    var appear = function($this){
        var opts = $this.data(DREAMY_TIP).opts,
            _offset = $this.offset();
        $this._isOpen = true; 
        $this.dreamyTipElememt.children('.dreamyTipInner').text($this.data('dtMsg'));
        $this.dreamyTipElememt.css({
            top: getTop($this, opts.position, _offset.top + opts.offsetTopAdd),
            left: getLeft($this, opts.position, _offset.left + opts.offsetLeftAdd),
            zIndex: 10000,
            display:'block'
        }).stop().animate({
            opacity: opts.fade
        }, opts.duration, opts.easing);
        if(typeof opts.callbackOnShow == 'object'){
            opts.callbackOnShow['f'](opts.callbackOnShow['params']);
        }else{
            opts.callbackOnShow();
        }

        if(opts.autoCloseAfter){
            setTimeout(function(){
                disappear($this)
            },opts.autoCloseAfter);
        }
    };
    //hide the tooltip
    var disappear = function($this){
        // Check if we came from the event bind or unbinder
        if($this.data.that){
          $this = $this.data.that;
        }
        // Unbind the event from the HTML dom element
        $('html').unbind('.' + DREAMY_TIP + $this.data(DREAMY_TIP).id);

        var opts = $this.data(DREAMY_TIP).opts; 
        $this._isOpen = false;
        $this.dreamyTipElememt.animate({
            opacity:0
        }, opts.duration, opts.easing, function(){
            $(this).css({
                zIndex:0,
                display:'none'
            });
            if(typeof opts.callbackOnHide == 'object'){
                opts.callbackOnHide['f'](opts.callbackOnHide['params']);
            }else{
                opts.callbackOnHide();
            }
        });
    };

    // Tooltip toggle
    var toogleTooltip = function($this){
        if($this._isOpen){
            disappear($this);
        }else{
            if($this.data('dtMsg')!=''){appear($this)}
        }                    
    }

    /**
     * Create the tooltip and add it to the DOM
     * @param {object} $this actual jQuery object
     */
    var createTip = function($this){
        var id = $this.data(DREAMY_TIP).id,
            opts = $this.data(DREAMY_TIP).opts;
        if(opts.closeButton && opts.event != 'hover'){
            $('body').append('<div class="dreamyTip dt-' + opts.position + '" id="' + DREAMY_TIP + id + '"><div class="dreamyTipBtn">x</div><div class="dreamyTipInner"></div></div>');
            $('#dreamyTip' + id + ' .dreamyTipBtn').bind('click', function(){
                disappear($this);
            });
        }else{
            $('body').append('<div class="dreamyTip dt-' + opts.position + '" id="' + DREAMY_TIP + id + '"><div class="dreamyTipInner"></div></div>');
        }
        $this.dreamyTipElememt = $('#' + DREAMY_TIP + id);
        if(opts.closeWithClick){
            $this.dreamyTipElememt.bind('click', function(){
                disappear($this);
            });
        }
        if(opts.fontSize){
          $this.dreamyTipElememt.css('font-size',opts.fontSize);
        }
        if(opts.backgroundPosition){
          $this.dreamyTipElememt.css('background-position',opts.backgroundPosition);
        }
    };

    /**
     * Public methods
     */
    var publicMethods = {
        init: function(options){
            return this.each(function(){
                var opts = $.extend({}, $.fn[DREAMY_TIP].defaults, options),
                    $this = $(this);
                // Assign false to dreamyTip as the tooltip is not created yet
                $this.dreamyTipElememt = false;
                if(opts.addCursorPointer){
                    $this.css('cursor','pointer');
                }
                //delete title attribute to avoid the default behavior
                var title = $this.attr('title');
                if(title!=undefined){
                    $this.removeAttr('title')
                }else{
                    title='';
                }
                $this.data('dtMsg',title);

                var data = $this.data(DREAMY_TIP);
                if (!data) {
                    $this.data(DREAMY_TIP, {
                        opts: opts,
                        id: new Date().getTime() //get date and use it to set an unique id to the object
                    });
                }

                // Events
                function bindCloser($this){
                    var data = $this.data(DREAMY_TIP),
                        dataID = data.id,
                        triggerEventBlur = data.opts.event == 'blur';
                    if(triggerEventBlur){
                        var counter = 0;
                    }
                    function closeIt(){
                        $this.dreamyTipElememt = $('#' + DREAMY_TIP + dataID);
                        disappear($this);
                    }
                    $('html').bind('click.' + DREAMY_TIP + dataID ,function() {
                        // Don't close the tooltip on blur if the trigger event is onblur
                        if(triggerEventBlur){
                            if(counter>0){
                                closeIt();
                            }else{
                                counter++;
                            }
                        }else{
                            closeIt();
                        }
                    });
                }

                $this.bind(opts.event + '.' + DREAMY_TIP,
                  function(event){
                    if(!$this.dreamyTipElememt){createTip($this)}
                    toogleTooltip($this);
                    bindCloser($this);
                    event.stopPropagation();
                });

                if(opts.closeOnBlur){
                  $this.bind('blur.' + DREAMY_TIP,function () {
                    disappear($this);
                  });
                }
                
                // Avoid close the tooltip when you click the trigger
                $this.bind('click.' + DREAMY_TIP,
                  function(event){
                    event.stopPropagation();
                });
                
                // Avoid to close the tooltip when you click on it.
                $('html').on('click.' + DREAMY_TIP,'.dreamyTip',function(event){
                    event.stopPropagation();
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
                $('#' + DREAMY_TIP + data.id).remove();
                // Remove the data
                $this.removeData(DREAMY_TIP);
            });
        },
        show: function() {
          return this.each(function() {
            var $this = $(this),
                data = $this.data(DREAMY_TIP);               
            if($this.dreamyTipElememt != 'undefined'){createTip($this)}
            if($this.data('dtMsg')!=''){appear($this)}
          })
        },
        close: function() {
          return this.each(function() {
            var $this = $(this),
                data = $this.data(DREAMY_TIP);
            $this.dreamyTipElememt = $('#' + DREAMY_TIP + data.id);
            disappear($this);
          })
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
        event:'click', // click, focus, blur & hover are allowed or none in case you want to trigger manually
        closeButton: true, //True for the "x" button in the tooltip
        closeWithClick:false, //True to close when you click the tooltip
        closeOnBlur:false, //True to close when the trigger element lose focus
        autoCloseAfter: false, // milliseconds to wait to auto close
        position:'top', // top, right, left, bottom
        fontSize: false, // Set a different font-size than the default on CSS
        callbackOnShow: function(){}, // Callback for appear function. Could be the name of the function or if you need pass params an object like this: {f:writeSomething,params:'callbackOnShow: the tooltip appear'}}
        callbackOnHide: function(){} // Callback for disappear function. Could be the name of the function or if you need pass params an object like this: {f:writeSomething,params:'callbackOnShow: the tooltip appear'}}
    };
})(jQuery);