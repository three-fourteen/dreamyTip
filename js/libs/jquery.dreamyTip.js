/**
 * jQuery DreamyLiteBox Plugin
 * Version: 3.5.1
 * URL: https://github.com/andres314/dreamyTip
 * Descripton: a simple and lovely jQuery tooltip
 * Requires: jQuery
 * Author: Andres (dreamsiteweb.com)
 *   gplus.to/andres_314
 *   bit.ly/apiLinkedin
 *   twitter.com/andres_314
 *   github.com/andres314
 *
 * Copyright: Copyright (c) 2012 Andres Pi
 * License: MIT
 *
 * Usage:
 *
 *   // Init element with dreamyTip, using the default options.
 *   $(selector).dreamyTip();
 *
 *   // Init element with dreamyTip, overriding some default options.
 *   $(selector).dreamyTip({option1:true, option2:'foo'});
 *
 *   // Un-init a previous init of dreamyLiteBox on an element.
 *   $(selector).dreamyTip('destroy');
 *
 *   // Call a public method .
 *   $(selector).dreamyTip('close');
 *
 * For documentation on the supported options, see the bottom of this file.
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
    var appear = function($this, isShowAction, event){
        var opts = $this.data(DREAMY_TIP).opts,
            _offset = $this.offset();
        $this._isOpen = true;
        $this.dreamyTipElememt.children('.dreamyTipInner').html($this.data('dtMsg'));


        if($this.data("timedelay")){
          opts.startDelay = $this.data("timedelay");
          opts.removeQueuedAnimation = true;
        }

        setTimeout(function(){
            var isBlurOrLoad = ['load','blur'].indexOf(opts.event) > -1;
            if($this.is(':hover') || isBlurOrLoad || isShowAction || event.type == 'click'){
                $this.dreamyTipElememt.css({
                    top: getTop($this, opts.position, _offset.top + opts.offsetTopAdd),
                    left: getLeft($this, opts.position, _offset.left + opts.offsetLeftAdd),
                    zIndex: 10000,
                    display:'block'
                }).stop(opts.removeQueuedAnimation).animate({
                    opacity: opts.fade
                }, opts.duration, opts.easing);
                if(typeof opts.callbackOnShow == 'object'){
                    opts.callbackOnShow['f'](opts.callbackOnShow['params']);
                }else{
                    opts.callbackOnShow();
                }

                if(opts.autoCloseAfter){
                    setTimeout(function(){
                        if($this._isOpen){
                            disappear($this);
                        }
                    }, opts.autoCloseAfter);
                }
            }
        },  opts.startDelay);
    };
    //hide the tooltip
    var disappear = function($this){
        // Check if we came from the event bind or unbinder
        if($this.data.that){
          $this = $this.data.that;
        }
        if(typeof $this.data(DREAMY_TIP) == 'undefined'){
            return;
        }
        // Unbind the event from the HTML dom element
        $('html').off('.' + DREAMY_TIP + $this.data(DREAMY_TIP).id);

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
    var toogleTooltip = function($this, event){
        var opts = $this.data(DREAMY_TIP).opts;
        if($this._isOpen){
            if(!opts.persistHover){
                disappear($this);
            }
        }else{
            if($this.data('dtMsg')!=''){appear($this, 0, event)}
        }
    }

    /**
     * Create the tooltip and add it to the DOM
     * @param {object} $this actual jQuery object
     */
    var createTip = function($this){
        var id = $this.data(DREAMY_TIP).id,
            opts = $this.data(DREAMY_TIP).opts;
        if(opts.closeButton && (opts.event != 'hover' || opts.closeButtonOnHover)){
            $('body').append('<div class="dreamyTip dt-' + opts.position + ' dt-' + opts.size + ' dt-'+ opts.color + '" id="' + DREAMY_TIP + id + '"><div class="dreamyTipBtn">x</div><div class="dreamyTipInner" style="text-align:' + opts.textAlign + '"></div><div class="dreamyTipArrow"></div></div>');
            $('#dreamyTip' + id + ' .dreamyTipBtn').on('click', function(){
                disappear($this);
            });
        }else{
            $('body').append('<div class="dreamyTip dt-' + opts.position + ' dt-' + opts.size + '" id="' + DREAMY_TIP + id + '"><div class="dreamyTipInner" style="text-align:' + opts.textAlign + '"></div><div class="dreamyTipArrow"></div></div>');
        }
        $this.dreamyTipElememt = $('#' + DREAMY_TIP + id);
        if(opts.closeWithClick){
            $this.dreamyTipElememt.on('click', function(){
                disappear($this);
            });
        }
        if(opts.fontSize){
          $this.dreamyTipElememt.css('font-size', opts.fontSize);
        }
        if(opts.backgroundPosition){
          $this.dreamyTipElememt.css('background-position', opts.backgroundPosition);
        }
    };

    /**
     * Public methods
     */
    var publicMethods = {
        init: function(options){
            return this.each(function(e){
                var opts = $.extend({}, $.fn[DREAMY_TIP].defaults, options),
                    $this = $(this);
                // Assign false to dreamyTip as the tooltip is not created yet
                $this.dreamyTipElememt = false;
                $this.css('cursor', opts.cursor);

                //delete title attribute to avoid the default behavior
                var title = $this.attr('title');
                if(title!=undefined){
                    $this.removeAttr('title')
                }else{
                    title = '';
                }
                if(opts.msg){
                    title = opts.msg;
                }
                $this.data('dtMsg',title);

                var data = $this.data(DREAMY_TIP);
                if (!data) {
                    $this.data(DREAMY_TIP, {
                        opts: opts,
                        id: new Date().getTime() + e //get date and use it to set an unique id to the object and sum iteration loop just in case run to fast
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
                    var closeIt = function(){
                        $this.dreamyTipElememt = $('#' + DREAMY_TIP + dataID);
                        disappear($this);
                    }
                    $('html').on('click.' + DREAMY_TIP + dataID , function(event) {
                        // Don't close the tooltip on blur if the trigger event is onblur
                        if(triggerEventBlur){
                            if(counter>0){
                                closeIt();
                            }else{
                                counter++;
                            }
                        }else{
                            if(!$(event.target).is($this)){
                                closeIt();
                            }
                        }
                    });
                }
                if(opts.event == 'load'){
                    if(!$this.dreamyTipElememt){createTip($this)}
                    toogleTooltip($this);
                    bindCloser($this);
                }else{
                    $this.on(opts.event + '.' + DREAMY_TIP,
                      function(event){
                        if(!$this.dreamyTipElememt){createTip($this)}
                        toogleTooltip($this, event);
                        bindCloser($this);
                    });
                }

                if(opts.closeOnBlur){
                  $this.on('blur.' + DREAMY_TIP,function () {
                    disappear($this);
                  });
                }

                // Avoid close the tooltip when you click the trigger
                $this.on('click.' + DREAMY_TIP,
                  function(event){
                    if(opts.event == 'click'){
                        event.stopPropagation();
                    }
                });

                // Avoid to close the tooltip when you click on it.
                $('html').on('click.' + DREAMY_TIP,'.dreamyTip',function(event){
                    event.stopPropagation();
                });

            });
        },
        destroy: function(){
            return this.each(function() {
                var $this = $(this),
                    data  = $this.data(DREAMY_TIP);
                if(typeof data != 'undefined'){
                    // Unbind event from the target
                    $(this).off('.' + DREAMY_TIP);
                    // Remove the tooltip from the DOM
                    $('#' + DREAMY_TIP + data.id).remove();
                    // Remove the data
                    $this.removeData(DREAMY_TIP);
                }
            });
        },
        show: function() {
          return this.each(function() {
            var $this = $(this),
                data = $this.data(DREAMY_TIP);
            if($this.dreamyTipElememt != 'undefined'){createTip($this)}
            if($this.data('dtMsg')!=''){appear($this, 1)}
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
        cursor: 'pointer', // pointer, help, default, etc. Add style cursor on the target
        textAlign: 'center', // center, left, right, justify
        offsetLeftAdd: 0, // add extra left offset
        offsetTopAdd: 0, // add extra top offset
        backgroundPosition: false, // String to set a different background position (ex. "30px", "5% 10px", "left top")
        fade:  0.9, // opacity of the tooltip
        startDelay: 0, // Add a delay time before the tooltip appear
        removeQueuedAnimation: false, //A Boolean indicating whether to remove queued animation as well on the show event.
        duration: 'medium', // duration of the animation
        easing: 'swing', //effect
        event:'click', // click, focus, load, blur & hover are allowed or none in case you want to trigger manually
        persistHover: false, // enable a tooltip to persist until the user clicks somewhere else on the page
        closeButton: true, //True for the "x" button in the tooltip
        closeButtonOnHover: false, //Force close button on hover
        closeWithClick:false, //True to close when you click the tooltip
        closeOnBlur:false, //True to close when the trigger element lose focus
        autoCloseAfter: false, // milliseconds to wait to auto close
        position:'top', // top, right, left, bottom
        fontSize: false, // Set a different font-size than the default on CSS
        msg:false, // String with the message
        size: 'default', // Set the size of the tooltip: 'default' or 'large'.
        color: 'default',
        callbackOnShow: function(){}, // Callback for appear function. Could be the name of the function or if you need pass params an object like this: {f:writeSomething,params:'callbackOnShow: the tooltip appear'}}
        callbackOnHide: function(){} // Callback for disappear function. Could be the name of the function or if you need pass params an object like this: {f:writeSomething,params:'callbackOnShow: the tooltip appear'}}
    };
})(jQuery);