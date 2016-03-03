var winHeight = $(window).height(),
    mainTop = $('header').height(),
    $body = $('body'),
    $menu = $('main nav'),
    currentPage
;

function switchTabs( event ){
    var $tab, $tabsContainer, $content, id;
    $tab = $(event.target).addClass('active');
    $tabsContainer = $tab.parents('.tabs');
    id = $tab.attr('data-tabid');
    $content = $( 'pre[data-tab="' + id + '"]', $tabsContainer );
    
    $tab.siblings().removeClass('active');
    $( '.tab-content', $tabsContainer ).hide();
    $content.fadeIn();	
}

function onScroll( event ){
    var docScroll, hash, top, bottom;
    currentPage.scrollCount += 1;
    
    if( currentPage.scrollCount === 15 ){
        currentPage.scrollCount = 0;
        docScroll = $(document).scrollTop();
        top = currentPage.$node.offset().top;
        bottom = top + currentPage.height;
        if( docScroll > bottom ){
            // hidden above
            hash = currentPage.$node.next('article').attr('id'); 
        }else if( top - docScroll > 0 ){
            // hidden below
            hash = currentPage.$node.prev('article').attr('id');
        }
        
        if( hash ){
            document.location.hash = '#' + hash;
            $(document).scrollTop(docScroll);
        }
    }
}

function onHashChange(){
    var hash = document.location.hash,
        $node
    ;
    $( '.active', $menu ).removeClass('active');
    if( !hash ){
        hash = '#page1';
    }
    
    if( !currentPage || currentPage.selector !== hash ){
        $('a[href="' + hash + '"]').addClass('active');
        $node = $(hash);
        currentPage = {
            selector: hash,
            $node: $node,
            height: $node.outerHeight(true),
            scrollCount: 0
        }
    }    
}

$(document).ready(function(){
    // document hash
    if( $('header nav .active').text() == 'DOCS' ){
        if( typeof(window.onhashchange) !== "undefined" && ( !document.documentMode || document.documentMode > 7 ) ){
            $(window).bind( 'hashchange.shufflingTiles', onHashChange );
        }else{
            $('body').prop( 'hash', document.location.hash );
            setInterval( function(){
                            if( $('body').prop('hash') !== document.location.hash ){ onHashChange(); }
                            $('body').prop( 'hash', document.location.hash );
                        }, 1200 );			
        }			
        onHashChange();
        $(window).scroll(onScroll);
    }

    // syntax highlighting
    $('pre').each(function( i, node ){ 
        var content = node.innerHTML,
            indent = /\s+/.exec(content),
            regex = new RegExp( '\n' + indent, 'gm' )
        ;
        content = $.trim(content.replace( regex, '\n' ));
        node.innerHTML = content;    
    });
    CodeMirror.colorize();    
    $('#previewForm').livelyValidator();

    // tabs
    $('.tabs li').click(switchTabs);
            
    //forms
    var t = $('.example').livelyValidator({ onValidate:function(){} });

    //page2-2-2-1
    $('#example-showGuidesTRUE').livelyValidator();   
    $('#example-showGuidesFALSE').livelyValidator({ showGuides: false });  

    //page2-2-2-2
    var customGuides = {
      required: "REQUIRED FIELD!",
      alphanumeric: "WORDS AND NUMBERS ONLY!",
      minChars: "MINIMUM 5 CHARACTERS!",
      maxChars: "MAXIMUM 15 CHARACTERS!"
      };
    $('#example-customGuides').livelyValidator({ guides: customGuides });
    $('#example-noCustomGuides').livelyValidator();

    //page2-2-2-3
    var customAlerts = {
      required: "REQUIRED FIELD!",
      alphanumeric: "WORDS AND NUMBERS ONLY!",
      minChars: "MINIMUM 5 CHARACTERS!",
      maxChars: "MAXIMUM 15 CHARACTERS!"
                  };
    $('#example-customAlerts').livelyValidator({ alerts: customAlerts });		   
    $('#example-noCustomAlerts').livelyValidator();

    //page2-2-2-4   
    var newMessage = "Wait!! There is no message...";   
    $('#example-submitAlerts').livelyValidator({ onsumbitAlert: newMessage });
    $('#example-nosubmitAlerts').livelyValidator();

    //page2-2-2-5
    var customRules, newRule;
    newRule = {};
    newRule.test = function ( input, targetField ){
        // input contains the value entered in the "Age" field
        var $targetField, currentYear, givenAge, calculatedAge, birthYear;
        $targetField = $("input[name='" + targetField + "']"); // select the "Age" field with JQuery
        givenAge = parseInt( $targetField.val(), 10 ); // get its value & convert it into a number
        birthYear = parseInt( input, 10 );
        currentYear = new Date().getFullYear();

        calculatedAge = currentYear - birthYear;
        if( givenAge === calculatedAge || calculatedAge - 1 === givenAge ){
          return true;
        }
        return false;
    }      
     newRule.type = 'set'; //use this data type whenever the validation spans more that one form field.
     newRule.guide = 'Which year were you born?';
     newRule.alert = 'Please enter the correct year of birth for your age.';
     customRules = { confirmAge: newRule };
     $('#example-customRule').livelyValidator({ debug:true, rules: customRules, onValidate:function(){} });
    
});