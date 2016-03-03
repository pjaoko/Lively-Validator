"use strict";

function testrow( $row, showResults ){
    var $inputs = $row.find('input'),
        valid = 0,
        invalid = 0,
        $results
    ;
    
    $inputs.each( function( i, input ){
        var $input = $(input);
        if( $input.hasClass('lv-valid') ){
            valid += 1;
        }else if( $input.hasClass('lv-invalid') ){
            invalid += 1;
        }
    });
    
    if( showResults || $inputs.length === valid + invalid ){
        $results = $row.find('.testresult');
        if( valid === invalid ){
            $results.html('&#10004;').removeClass('invalid').addClass('valid');
        }else{
            $results.html('&#10060;').removeClass('valid').addClass('invalid');        
        }
    }
}

function testrows( $form ){
    $form.livelyValidator({ onValidate:function(){} });
    $form.find(':input[value=""]').change();
    $form.submit();
    $form.find('.row').each(function( i, node ){
        testrow( $(node), true );
    });

}

function testsuite( data ){
    var $form = $($('#testsuite').html()),
        $rows = $form.find('fieldset')
    ;
    
    data.forEach( function( $node ){
        $rows.append($node);
    });    
    $('main .container').append($form);
    
    return $form;
}

function textInput( tests ){
    var rows = [];

    tests.forEach( function( test, i ){
        var $row = $($('#testInput').html()),
            fixtures = test.pass.concat(test.fail)
        ;
        $row.find('div:nth-child(1)').html(test.rule);
        
        fixtures.forEach( function( fixture, i ){
            var tokens = ( typeof fixture === 'string' && fixture.indexOf('::') > 0 )? fixture.split('::') : false,
                constraint = ( tokens )? tokens[0] : false,
                value = ( tokens )? tokens[1] : fixture,
                type = ( tokens && tokens[2] )? tokens[2] : 'text',
                config = ( constraint )? test.rule + '::' + constraint : test.rule,
                $input = $('<input type="' + type + '" name="_' + test.rule + '" data-validate="' + config + '" value="' + value + '"  />'),
                selector = 'div:nth-child(' + ( i + 2 ) + ')'
            ;
            $row.find(selector).html($input);
        });
        rows[i] = $row;
    });

    return rows;
}

function fileInput( ruleName, fixtures ){
    var fixture = fixtures[ Math.floor( Math.random() * fixtures.length ) ].split('::'),
        file = fixture[0] + '_file.' + fixture[0],
        constraint = fixture[1],
        config = ( constraint )? ruleName + '::' + constraint : ruleName,
        label = '<label>required file: /tests/fixtures/' + file  + '</label>',
        input = '<input type="file" name="' + fixture[0] + '" data-file="' + file + '" data-validate="required; ' + config + '" />'
    ;
    return label + input;
}

function onFileSelect( event ){
    var $input = $(event.target),
        file = $(false).livelyValidator( null, {method:'getFiles',args:[event.target]})[0],
        fileName = $input.attr('data-file'),
        $label = $input.siblings('label'),
        $form,
        $row
    ; 
    
    if( file.name === fileName ){        
        $(false).livelyValidator( null, {method:'validate',args:[$input]});
        $label.removeClass('lv-alert').hide();
        $form = $input.parents('form');
        $row = $input.parent().parent();
        testrow($row);
    }else{
        $label.addClass('lv-alert').show();
        alert('Please select the specified file');    
    }
    
    return true;
}

function testStrings( tests ){
    var data = textInput(tests),
        $form = testsuite(data)
    ;
    $form.find('legend').html('String Validation'); 
    testrows($form);
}

function testFiles( tests ){
    var data = [],
        guide = '<p>Instructions: Select the specified files for each input file. The test files will be found within Lively Validators download package in the <em>/test/fixtures</em> folder.</p>',
        $form
    ;
    
    tests.forEach( function( test, i ){
        var $node = $($('#testFiles').html());
        $node.find('div:nth-child(1)').html(test.rule);
        $node.find('div:nth-child(2)').html(fileInput( test.rule, test.pass ));
        $node.find('div:nth-child(3)').html(fileInput( test.rule, test.fail )); 
        data.push($node);
    });

    $form = testsuite(data).livelyValidator();
    $form.find('input[type="file"]').change(onFileSelect);
    $form.find('legend').html('File Validation').after(guide);
    
}

function testSets( tests ){
    var data = [],
        $form
    ;
    
    tests.forEach( function( test, i ){
        var $row = $($('#testSet').html()),
            fixtures = test.pass.concat(test.fail)
        ;
        $row.find('div:nth-child(1)').html(test.rule);
        
        fixtures.forEach( function( fixture, i ){
            var tokens = fixture.split('::'),  
                config = ( tokens[0] )? 'data-validate="' + test.rule + '::' + tokens[0] + '"': '',
                configAttr = tokens[3] || '',
                type = ( tokens[2] )? tokens[2] : 'text',
                name = ( i > 1 )? '_fail' + test.rule : '_pass' + test.rule,
                $input = $('<input type="' + type + '" ' + configAttr + ' name="' + name + '" ' + config + ' value="' + tokens[1] + '"  />'),
                selector = 'div:nth-child(' + ( i + 2 ) + ')'
            ;  console.log($input.get(0).outerHTML);
            $row.find(selector).html($input);
        });
        testrow($row);
        data[i] = $row;
    });

    $form = testsuite(data).livelyValidator(); 
    $form.find('input[type="radio"],input[type="checkbox"]').click().click();
    testrows($form);
    $form.find('legend').html('Set Validation');
}

function testNumbers( tests ){
    var data = textInput(tests),
        $form = testsuite(data)
    ;
    $form.find('legend').html('Number Validation'); 
    testrows($form);
}

function testGlobal( tests ){
    var data = textInput(tests),
        $form = testsuite(data)
    ;
    $form.find('legend').html('Global'); 
    testrows($form);
}
	
function testDates( tests ){
    var date, input, year, month, day, hours, minutes, seconds, isValid, template, data, $form;
    
    data = textInput(tests);
    $form = testsuite(data);
    $form.find('legend').html('Date Validation'); 
    testrows($form);
    $form = $form.find('fieldset');
    
    template = function( input ){
        var className = (isValid)?'valid':'invalid',
            icon = (isValid)?'&#10004;':'&#10060;'
        ;    
        $form.append(
            ('<div class="row"><div class="col-10 testrule">"{INPUT}"</div><div class="col-1" /><div class="col-1 testresult {CLASS}">{ICON}</div></div>')
            .replace( '{INPUT}',  input )
            .replace( '{CLASS}', className )
            .replace( '{ICON}', icon )
        );
    }
    
    input = '1985-03-31T23:20:50.5Z';
    date = $(false).livelyValidator( null, {method:'getDate',args:[input]});
    if( date ){
        year = date.getUTCFullYear();
        month = date.getUTCMonth();
        day = date.getUTCDate();
        hours = date.getUTCHours();
        minutes = date.getUTCMinutes();
        seconds = date.getUTCSeconds();
        isValid = ( (year == 1985) && ( month == 2 ) && ( day == 31 ) && ( hours == 23 ) && ( minutes == 20 ) && ( seconds == 50 ) );
    }else{
        isValid = false;
    }
    template(input);
    
    input = '1970-01-01';
    date = $(false).livelyValidator( null, {method:'getDate',args:[input]});
    if( date ){
        year = date.getUTCFullYear();
        month = date.getUTCMonth();
        day = date.getUTCDate();
        isValid = ( (year == 1970) && ( month == 0 ) && ( day == 1 ) );
    }else{
        isValid = false;
    }
    template(input);

    input = '1997-07-16T04:10:10.45+03:00';
    date = $(false).livelyValidator( null, {method:'getDate',args:[input]});
    if( date ){
        isValid = ( (date.getUTCHours() == 1) && (date.getHours() == 11) );
    }else{
        isValid = false;
    }
    template(input);
    
    input = '08-10-1978';
    date = $(false).livelyValidator( null, {method:'getDate',args:[input]});
    if( date ){
        year = date.getFullYear();
        month = date.getMonth();
        day = date.getDate(); 
        isValid = ( (year == 1978) && ( month == 9 ) && ( day == 8 ) );	
    }else{
        isValid = false;
    }
    template(input);
    
    input = '1978-10';
    date = $(false).livelyValidator( null, {method:'getDate',args:[input]});
    if( date ){
        year = date.getFullYear();
        month = date.getMonth();
        isValid = ( (year == 1978) && ( month == 9 ) );
    }else{
        isValid = false;
    }
    template(input);
    
    input = '1980-W06';
    date = $(false).livelyValidator( null, {method:'getDate',args:[input]});
    if( date ){
        year = date.getFullYear();
        month = date.getMonth();
        isValid = ( (year == 1980) && ( month == 1 ) );
    }else{
        isValid = false;
    }
    template(input);
    
    input = '04:10:15';
    date = $(false).livelyValidator( null, {method:'getDate',args:[input]});
    if( date ){
        hours = date.getHours();
        minutes = date.getMinutes();
        seconds = date.getSeconds();
        isValid = ( (hours == 4) && (minutes == 10) && (seconds == 15) );
    }else{
        isValid = false;
    }
    template(input);



}
	
$(document).ready( function(){
    var fixtures = {
        "required": {
            "pass": [ "input",,,, ], 
            "fail": [ "" ], 
            "type": "global"
        }, 
        "min": {
            "pass": [ "2::forest", "2::2::number",   "1984-10-16::1984-10-16::date",, ], 
            "fail": [ "7::forest", "6::5.9::number", "1977-09-06::1970-10-07::date" ], 
            "type": "global",
            "rule": "min"
        },  
        "max": {
            "pass": [ "6::forest", "6::6::number", "2010-09-12::2010-08-10::date",, ], 
            "fail": [ "2::forest", "5::8::number", "1988-08-08::2088-07-07::date" ], 
            "type": "global",
            "rule": "max"
        }, 
        "confirm": {
            "pass": [ "::value::text::id='confirm1'", "confirm1::value::text" ], 
            "fail": [ "::value::text::id='confirm2'", "confirm2::different value::text" ], 
            "type": "set"
        }, 
        "requiredSet": {
            "pass": [ "::value::checkbox::checked", "requiredSet::value::checkbox" ], 
            "fail": [ "::value::checkbox", "requiredSet::value::checkbox" ], 
            "type": "set"
        },  
        "alphabetic": {
            "pass": [ "abcd", "ABCD", "cat", "" ], 
            "fail": [ "cat123", 40, "123", "" ], 
            "type": "string"
        }, 
        "numeric": {
            "pass": [ "123", 123, "48", "4" ], 
            "fail": [ "dog", "5.5", "wing", "67%" ], 
            "type": "string"
        }, 
        "alphanumeric": {
            "pass": [ "abc123", "abc", "123", 123 ], 
            "fail": [ "abc.123", "abc!", "1-2-3", 12.3 ], 
            "type": "string"
        }, 
        "minChars": {
            "pass": [ "2::forest", "3::cat", "4::boat", "0::three" ], 
            "fail": [ "7::forest", "4::cat", "5::boat", "10::two words" ], 
            "type": "string"
        }, 
        "maxChars": {
            "pass": [ "6::forest", "4::cat", "10::boat", "5::three" ], 
            "fail": [ "2::forest", "1::cat", "0::boat", "2::two words" ], 
            "type": "string"
        }, 
        "email": {
            "pass": [ "niceandsimple@example.com", "niceandsimple@example.com", "disposable.style.email.with+symbol@example.com", "very.common@example.com" ], 
            "fail": [ "Abc.example.com", "Abc.@example.com", "A@b@c@example.com", "Abc..123@example.com" ], 
            "type": "string"
        }, 
        "tel": {
            "pass": [ "+61 432 175 480", "61432175480", "000", "+44 (0) 555 555" ], 
            "fail": [ "+s61 432 175 482", "-78", "john", "-100000" ], 
            "type": "string"
        }, 
        "url": {
            "pass": [ "http://example.org/", "ftp://example.org/", "https://gist.github.com/729294", "http://www.example.com/" ], 
            "fail": [ "www.example.com", "/path/to/files", "#canvas", 566 ], 
            "type": "string"
        }, 
        "color": {
            "pass": [ "#ffffff", "#FFFFFF", "#C0c0c0", "#000000" ], 
            "fail": [ "rgb(20, 20, 20)", "#fff", "#ffhhff", "fff" ], 
            "type": "string"
        }, 
        "creditCard": {
            "pass": [ "4111111111111111", "5500000000000004", "340000000000009", "30000000000004" ], 
            "fail": [ "1534567", "19786789", "1234567890", 55000000000 ], 
            "type": "string"
        }, 
        "number": {
            "pass": [ 11259375, -52479, 202, "10.2" ], 
            "fail": [ "one", "cat", "-", "#ffffff" ],         
            "type": "number"
        }, 
        "minNumber": {
            "pass": [ "2::2", "4::30", "4::4", "10::10.2" ], 
            "fail": [ "6::5.9", "3::0", "1::-5", "-5::-6" ], 
            "type": "number"
        }, 
        "maxNumber": {
            "pass": [ "6::6", "4::4", "9::3", "0::-5" ], 
            "fail": [ "5::8", "10::11", "1::10", "-6::-2" ], 
            "type": "number"
        }, 
        "age": {
            "pass": [ 19, 5, 18, 99 ], 
            "fail": [ 120, -2, "one", "fifty" ], 
            "type": "number"
        }, 
        "fileExtension": {
            "pass": [ "png::png", "docx::docx", "zip::zip", "gif::jpg,gif" ], 
            "fail": [ "png::zip", "pdf::docx", "zip::jpg", "gif::docx, zip" ], 
            "type": "file"
        }, 
        "fileMimeType": {
            "pass": [ "docx::application", "png::image", "zip::application", "gif::image" ], 
            "fail": [  "docx::text", "png::audio", "zip::image", "gif::video" ], 
            "type": "file"
        }, 
        "fileMimeSubtype": {
            "pass": [  "png::png", "docx::vnd.openxmlformats-officedocument.wordprocessingml.document", "zip::zip", "gif::jpeg,gif" ], 
            "fail": [  "pdf::css", "png::audio", "zip::jpeg", "gif::jpeg" ], 
            "type": "file"
        }, 
        "minFileSize": {
            "pass": [ "png::3", "docx::10", "zip::8", "gif::500" ], 
            "fail": [ "png::30", "docx::20", "zip::20", "gif::5000" ], 
            "type": "file"
        },         
        "min(files)": {
            "pass": [ "png::3", "docx::10", "zip::8", "gif::500" ], 
            "fail": [ "png::30", "docx::20", "zip::20", "gif::5000" ], 
            "type": "file",
            "rule": "min"
        },
        "maxFileSize": {
            "pass": [  "zip::15", "png::5", "docx::20", "gif::2500" ], 
            "fail": [  "zip::10", "png::3", "docx::5", "gif::1000" ], 
            "type": "file"
        }, 
        "max(files)": {
            "pass": [  "zip::15", "png::5", "docx::20", "gif::2500" ], 
            "fail": [  "zip::10", "png::3", "docx::5", "gif::1000" ], 
            "type": "file",
            "rule": "max"
        }, 
        "image": {
            "pass": [ "png", "gif" ], 
            "fail": [ "docx", "pdf" ], 
            "type": "file"
        }, 
        "document": {
            "pass": [ "docx", "pdf" ], 
            "fail": [ "gif", "png", "zip" ],
            "type": "file"
        }, 
        "date": {
            "pass": [ "1984-10-16", "1756-11-05", "0001-01-01", "2012-11-30" ], 
            "fail": [ "15\/15\/14", "1984-13-8", "1984\/10\/38", "2009\/02\/29" ], 
            "type": "date"
        }, 
        "minDate": {
            "pass": [ "1984-10-16::1984-10-16", "1997-07-16T041010.45+0300::1997-07-16T041010.45+0300", "1980-10-10::1980-11-07", "2012-W01::2014-W01" ], 
            "fail": [ "1977-09-06::1970-10-07", "1997-07-16T041010.45+0300::1997-07-16T011010.45+0300", "2012-W05::2012-W02", "2016-02-14::2006-02-14" ], 
            "type": "date"
        }, 
        "maxDate": {
            "pass": [ "2010-09-12::2010-08-10",   "2010-10-10::2010-10-10", "1980::1970", "2016-12::2016-10" ], 
            "fail": [ "1988-08-08::2088-07-07", "2000-10-11::2010-10-10", "2000-W20::2200-W01", "2013-07::2016-W01" ], 
            "type": "date"
        }, 
        "datetime": {
            "pass": [ "1990-12-31T23:59:60Z", "1996-12-19T16:39:57-16:00", "1985-04-12T23:20:50.52Z", "1937-01-01T12:00:27.87+00:20" ], 
            "fail": [ "1984-13-8",            "1990-12-31T23:59:60",       "1996-12-19",              "1937-01-01T12:00:27.87" ], 
            "type": "date"
        }, 
        "datetimeLocal": {
            "pass": [ "1990-12-31T23:59:60",   "1996-12-19T16:39:57",  "1985-04-12T23:20:50.52",     "1937-01-01T12:00:27.87" ], 
            "fail": [ "15\/15\/15", "1984-13-8", "1990-12-31T23:59:60Z", "1996-12-19" ], 
            "type": "date"
        }, 
        "month": {
            "pass": [ "1996-12", "2012-11", "1818-03", "2030-01" ], 
            "fail": [ "1996-00", "1818-3",  "2012-13",  "1818-30" ], 
            "type": "date"
        }, 
        "week": {
            "pass": [ "1996-W16", "2012-W16", "2012-W01", "2016-W08" ], 
            "fail": [ "1996-W54", "2012-W00", "2012-W-0", "2012-W" ], 
            "type": "date"
        }, 
        "time": {
            "pass": [ "23:20:50.52", "17:39:57", "08:00:59", "08:00:00" ], 
            "fail": [ "23:20:500.52", "25:39:57", "17:39:61", "08:00:61" ], 
            "type": "date"
        }
    },    
    suites = {},
    lv = $(false).livelyValidator({ debug:true }),
    rules = lv.settings.rules
    ;    
        
    $.each( rules, function( ruleName, rule ){
        if( !fixtures[ruleName] ){
            alert('Missing test: ' + ruleName);
        } 
        fixtures[ruleName].rule = fixtures[ruleName].rule || ruleName;
    });    
  
    $.each( fixtures, function( testName, test ){
        if( !test.rule ){  
            alert('Fixture missing test rule: ' + testName );
        } 
        if( !suites[test.type] ){
            suites[test.type] = [];
        }
        suites[test.type].push(test); 
    });
    
    
    testGlobal(suites.global);     
    testSets(suites.set); 
    testNumbers(suites.number);
    testStrings(suites.string);
    testDates(suites.date);
    testFiles(suites.file);
    
});

C:\Users\pato\AppData\Local\GitHub\GitHub.appref-ms --open-shell -command "cd w:\ "