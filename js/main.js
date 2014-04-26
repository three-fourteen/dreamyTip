$('.ttload').dreamyTip({event:'load', cursor:'inherit'});
    $('.tt').dreamyTip();
    $('.ttHTML').dreamyTip();
    $('.ttMSG').dreamyTip({msg:'This is a nice tooltip.'});
    $('.ttH').dreamyTip({event:'hover',position:'left'});
    $('.ttHcb').dreamyTip({event:'hover',position:'left', closeButtonOnHover: true});
    $('.ttPH').dreamyTip({event:'hover', persistHover:true});
    $('.ttPHT').dreamyTip({event:'hover', persistHover:true,autoCloseAfter:2000});
    $('.ttF').dreamyTip({cursor:'inherit',event:'focus'});
    $('.ttBlur').dreamyTip({cursor:'inherit',event:'blur'});
    $('.ttWB').dreamyTip({closeButton: false});
    $('.ttOC').dreamyTip({closeButton: false,closeWithClick:true});
    $('.ttAC').dreamyTip({closeButton: false,autoCloseAfter:1500});
    $('.ttB').dreamyTip({position:'bottom'});
    $('.ttL').dreamyTip({position:'left'});
    $('.ttR').dreamyTip({position:'right'});
    $('.ttOS').dreamyTip({callbackOnShow:{f:writeSomething, params:'The tooltip appear'}});
    $('.ttOH').dreamyTip({callbackOnHide:writeSomething});
    $('.ttSD').dreamyTip({startDelay:1000});
    $('.ttAl').dreamyTip({textAlign:'left'});
    $('.ttCH').dreamyTip({cursor:'help'});

    // Used as example for the callbacks.
    function writeSomething(msg){
        if(msg){
            document.getElementById('writeHere').innerHTML = 'Callback log:<br>' + msg;
        }else{
            document.getElementById('writeHere').innerHTML = 'Callback log:<br>no message on the callback';
        }
    }