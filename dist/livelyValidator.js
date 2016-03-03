/*
* Lively Validator 1.0.0
* Copyright 2016, Patrick Jaoko
* Free to use under the MIT license.
* http://www.opensource.org/licenses/mit-license.php
*/

;(function( $ ){
"use strict";
var rules, debug, methods;

debug = false;

// in-built validation rules
rules = {
	required: { type: 'all',
				guide: 'This field is required.',
				alert: 'Please fill out this required field.',
				test: function( input ){
						return ( String(input).length > 0 );
				}},
	 confirm: { type: 'set',
				guide: 'This should have the exact value as the field before it.',
				alert: 'Please make sure that the values in both confirmation fields match.',
				test: function( group ){
						methods.validate(group.targetControl);
						if( group.targetControl.hasClass('lv-invalid') ){ 
							return false;
						}
						return group.targetControl.val() === group.control.val();
				}},
 requiredSet: { type: 'set',
				guide: 'Select atleast one item within this group.',
				alert: 'Atleast one item within this group must be selected.',
				test: function( group ){						
						var $checked =  $().add(group.controls).filter(':checked');
						return $checked.length > 0;
				}},
  alphabetic: { type: 'string',
				guide: 'Alphabetic letters only (a-z).',
				alert: 'Please type in only alphabetic letters (a-z).',
				test: function( input ){	
						var regex = /^[ÀÈÌÒÙàèìòùÁÉÍÓÚÝáéíóúýÂÊÎÔÛâêîôûÃÑÕãñõÄËÏÖÜŸäëïöüŸ¡¿çÇŒœßØøÅåÆæÞþÐða-zA-Z]+$/;
						return regex.test(input);
				}},
     numeric: { type: 'string',
				guide: 'Accepts only digits (0-9).',
				alert: 'Please type in only digits (0,1,2,3,4,5,6,7,8 and 9).',
				test: function( input ){	
						var regex = /^\d+$/;
						return regex.test(input);
				}},
alphanumeric: { type: 'string',
				guide: 'Alphabetic letters and digits only (a-z and 0-9).',
				alert: 'Please type in only alphabetic letters and digits (a-z and 0-9).',
				test: function( input ){	
						var regex = /^[ÀÈÌÒÙàèìòùÁÉÍÓÚÝáéíóúýÂÊÎÔÛâêîôûÃÑÕãñõÄËÏÖÜŸäëïöüŸ¡¿çÇŒœßØøÅåÆæÞþÐða-zA-Z0-9]+$/;
						return regex.test(input);
				}},
	minChars: { type: 'string',
				guide: 'Requires at-least {minChars} characters.',
				alert: 'Please type in a minimum of {minChars} characters.',
				test: function( input, filter ){
						return ( input.length >= filter );
				}},
	maxChars: { type: 'string',
				guide: 'Requires not more than {maxChars} characters.',
				alert: 'Please type in not more than {maxChars} characters.',
				test: function( input, filter ){
						return ( input.length <= filter );
				}},
	   email: { type: 'string',
				guide: 'Requires a valid email address.',
				alert: 'Please type in a valid email address.',
				test: function( input ){ 
						var regex = /^(([^<>()\[\]\\.,;:\s@\"]+(\.[^<>()\[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
						return regex.test(input);
				}},
	     tel: { type: 'string',
				guide: 'Requires a valid telephone number.',
				alert: 'Please type in a valid telephone number.',
				test: function( input ){
						var regex = /^([\d+][0-9\(\)\/\+ \-]{2,20})$/;
						return regex.test(input);
				}},
		 url: { type: 'string',
				guide: 'This field requires a valid, absolute URL e.g. "http://www.example.com/"',
				alert: 'A valid absolute URL is required, e.g. "http://www.example.com/".',
				test: function( input ){
						var regex;
						if( input === '' ){
							return true;
						}
						regex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i;
						return regex.test(input);
				}},
	   color: { type: 'string',
				guide: 'This field requires a valid hex color value e.g. #ffffff',
				alert: 'A valid hex color value is required e.g. #ffffff.',
				test: function( input ){
						var regex = /^#[A-Fa-f0-9]{6,}$/;
						return regex.test(input);
				}},
  creditCard: { type: 'string',
				guide: 'Requires a valid credit card number.',
				alert: 'Please type in a valid credit card number.',
				test: function( input ){			
						var regex = /^\d{13,16}$/; 
						return regex.test( input );
				}},
      number: { type: 'number',
				guide: 'Requires a number.',
				alert: 'Please type in a valid number.',
				test: function( input ){
						if( input === '' ){ return false; }
						return !isNaN(input);
				}},
   minNumber: { type: 'number',
				guide: 'Requires a number equal to or greater than {minNumber}.',
				alert: 'Please type in a number equal to or greater than {minNumber}.',
				test: function( input, filter ){
						return ( input >= filter );
				}},
   maxNumber: { type: 'number',
				guide: 'Requires a number less than or equal to {maxNumber}.',
				alert: 'Please type in a number equal to or less than {maxNumber}.',
				test: function( input, filter ){
						return ( input <= filter );
				}},
	     age: { type: 'number',
				guide: 'Please type in your age e.g. 21.',
				alert: 'Please type in your age.',
				test: function( input ){
						return !isNaN(input) && input > -1 && input < 120;
				}},
fileExtension:{ type: 'file',
				guide: 'File extensions: {fileExtension}.',
				alert: 'Selected files must have a valid extension ({fileExtension}).',
				test: function( files, filter ){
						var allowed, file, valid, i; 
						valid = true;
						allowed = filter.split(/\s?,\s?/);
						i = 0;
						file = files[i];
						while( file ){
							if( $.inArray( file.ext, allowed ) === -1 ){
								valid = false;
							}
							i += 1;
							file = files[i];
						}						
						return valid;
				}},
 fileMimeType: { type: 'file',
				guide: 'Allowed file types: {fileMimeType}.',
				alert: 'Selected files must be the right type ({fileExtension}).',
				test: function( files, filter ){
						var allowed, file, valid, i; 
						valid = true;
						allowed = filter.split(/\s?,\s?/);						
						i = 0;
						file = files[i];
						while( file ){
							if( $.inArray( file.type, allowed ) === -1 ){
								valid = false;
							}
							i += 1;
							file = files[i];
						}							
						return valid;
				}},	
fileMimeSubtype: { type: 'file',
				guide: 'Allowed file types: {fileMimeSubtype}.',
				alert: 'Selected files must be the right type ({fileMimeSubtype}).',
				test: function( files, filter ){
						var allowed, file, valid, i; 
						valid = true;
						allowed = filter.split(/\s?,\s?/);						
						i = 0;
						file = files[i];
						while( file ){
							if( $.inArray( file.subtype, allowed ) === -1 ){
								valid = false;
							}
							i += 1;
							file = files[i];
						}							
						return valid;
				}},						
 minFileSize: { type: 'file',
				guide: 'Minimum file size: {minFileSize}kb.',
				alert: 'Selected files must be more than {minFileSize}kb.',
				test: function( files, filter ){
						var file, valid, i;
						valid = true;						
						i = 0;
						file = files[i];
						while( file ){
							if( file.size < filter ){
								valid = false;
							}
							i += 1;
							file = files[i];
						}						
						return valid;
				}},	   
 maxFileSize: { type: 'file',
				guide: 'Maximum file size: {maxFileSize}kb.',
				alert: 'Selected files must be less than {maxFileSize}kb.',
				test: function( files, filter ){
						var file, valid, i;
						valid = true;						
						i = 0;
						file = files[i];
						while( file ){
							if( file.size > filter ){
								valid = false;
							}
							i += 1;
							file = files[i];
						}
						return valid;
					}},
	   image: {type: 'file',
				guide: 'Select an image file ( bmp, gif, png, jpg, tif ) to upload.',
				alert: 'Selected files must images ( bmp, gif, png, jpg or tif).',
				test: function( files ){
						var file, valid, i;
						valid = true;						
						i = 0;
						file = files[i];
						while( file ){
							if( file.type !== 'image' ){
								valid = false;
							}
							i += 1;
							file = files[i];
						}						
						return valid;
				}},
	document: { type: 'file',
				guide: 'Select a document file ms word or PDF.',
				alert: 'Please select a valid document, which must be a ms word or PDF.',
				test: function( files ){
						var file, valid, i;
						valid = true;						
						i = 0;
						file = files[i]; 
						while( file ){
							if( file.type !== 'application' || $.inArray( file.ext, ['doc','docx','pdf'] ) === -1 ){
								valid = false;
							}
							i += 1;
							file = files[i];
						}						
						return valid;
				}},
		date: { type: 'date',
				guide: 'This field requires a date e.g. 2012-12-25.',
				alert: 'A valid date e.g. 2012-12-25 is required.',
				test: function( input ){
						var regex = /^\d\d\d\d-\d\d-\d\d$/;
						return regex.test(input);
				}},
     minDate: { type: 'date',
				guide: 'Requires a time value equal to or after {minDate}.',
				alert: 'Please type in a time value equal to or after {minDate}.',
				test: function( input, filter ){
						input = methods.getDate(methods.getDate(input));
						filter = methods.getDate(methods.getDate(filter)); 
						if( !filter ){
							methods.showErrors( filter + "is not a valid HTML5 date/datetime for minDate in Lively Validator" );
						}
						if( !input ){
							return false;
						}
						return input >= filter;
				}},
     maxDate: { type: 'date',
				guide: 'Requires a time value greater than or equal to {maxDate}.',
				alert: 'Please type in a time value greater than or equal to {maxDate}.',
				test: function( input, filter ){
						input = methods.getDate(methods.getDate(input));
						filter = methods.getDate(methods.getDate(filter)); 
						if( !filter ){
							methods.showErrors( filter + "is not a valid HTML5 date/datetime for maxDate in Lively Validator" );
						}
						if( !input ){
							return false;
						}
						return input <= filter;
				}},
    datetime: { type: 'date',
				guide: 'This field requires a valid HTML5 datetime e.g. 1990-12-31T23:59:60Z',
				alert: 'A valid HTML5 datetime value in the format YYYY-MM-DDTHH:MM:SSZ is required (eg 1996-12-19T16:39:57Z).',
				test: function( input ){						
						var regex = /^\d\d\d\d\-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d*)?(Z|([+\-]\d\d:\d\d))$/;
						return regex.test(input);
				}},
datetimeLocal:{ type: 'date',
				guide: 'This field requires a valid HTML5 datetime-local value e.g. 1996-12-19T16:39:57.',
				alert: 'A valid HTML5 datetime-local in the format YYYY-MM-DDTHH:MM:SS is required (eg 1996-12-19T16:39:57).',
				test: function( input ){						
						var regex = /^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d*)?$/;
						return regex.test(input);
				}},
	   month: { type: 'date',
				guide: 'This field requires a valid HTML5 month value e.g. 2012-12.',
				alert: 'A valid month in the format YYYY-MM is required e.g. 2012-12.',
				test: function( input ){
						var regex = /^\d\d\d\d-((0[1-9])|(1[0-2]))+$/;
						return regex.test(input);
				}},
		week: { type: 'date',
				guide: 'This field requires a valid HTML5 week value e.g. 2012-W08.',
				alert: 'A valid month in the format YYYY-W(01-52) is required (e.g. 2012-W08).',
				test: function( input ){
						var matches = /^\d\d\d\d-W(\d\d)$/.exec(input); 
						if( matches && matches[1] > 0 && matches[1] <= 53 ){
							return true;
						}
						return false;
				}},
		time: { type: 'date',
				guide: 'This field requires a valid HTML5 time value e.g. 17:39:57.',
				alert: 'A valid month in the format HH:MM:SS is required (e.g. 17:39:57).',
				test: function( input ){
						var matches = /^(\d\d):(\d\d):(\d\d)(\.\d*)?$/.exec(input);
						if( matches && matches[1] <= 23 && matches[2] <= 59 && matches[3] <= 60 ){
							return true;
						}
						return false;
				}}
	};
	
methods = {
	
/**
 * The focus event handler for form controls, and hides the tooltip whenever the target element is clicked on.
 */		
	onFocus: function(){
		methods.tooltip( $(this), 'hide' );		
	},

    
/**
 * This method is called whenever a form control's value is changed by the user, and is triggered by a blur, change or click event, depending on the type of control.
 */	
	onEdit: function(){
		methods.validate( $(this) );
	},

    
/**
 * The forms submit event handler. Perfoms validation on all form controls before submitting the form, or sending the form's validation status to the onValidate function.
 * @return Boolean Returns TRUE if all form control's are valid, and FALSE otherwise. 
 */	
	onSubmit: function(){
		var $form, data, $invalid, $submitBtn, isValid, test;
		$form = $(this);
		isValid = true;
		data = $form.data('livelyValidator');
		$submitBtn = $( 'input[data-clicked="clicked"]', $form );
		$( 'input[data-clicked]', $form ).attr( 'data-clicked', '' );
		
		$( ':input', $form ).each( function(){ test = methods.validate($(this));  } );
		
		$invalid = $( '.lv-invalid', $form );
		if( $invalid.length > 0 ){
			methods.tooltip( $submitBtn, 'alert', true );
			isValid = false;
		}
		
		if( data.settings.onValidate ){
			data.settings.onValidate( isValid, $form.get(0) ); 
			return false;
		}
		return isValid;
	},

    
/**
 * Validate a form input control's value, and returns TRUE or FALSE depending on the results.
 * @param  jQuery $formControl The target form control, wrapped in a jQuery object
 * @return Boolean return TRUE if the form field contains valid data, or is empty and not a required field; otherwise, returns FALSE.
 */	
	validate: function( $formControl ){
		var data, value, errorMsg, $tooltip, activeRules, group, extendedRules; 
		data = $formControl.data('livelyValidator');
		group = data.group;
		value = $formControl.val(); 
		errorMsg = '';
		$tooltip = data.tooltip;		
		
		if( ( !value && !data.isRequired ) || data.type === 'submit' ){
			return true;
		}
		
		if( data.dataType === 'string' ){
			value = String(value);
		}else if( data.dataType === 'number' ){
			value = parseInt( value, 10 );
		}else if( data.dataType === 'file' ){
			value = methods.getFiles( $formControl.get(0) );
		}
		
		if( group.set ){
			extendedRules = data.form.data('livelyValidator').settings.rules;			
			if( group.ruleName === 'requiredSet' ){
				$formControl = group.controls;				
				$tooltip = group.tooltips;				
				if( !extendedRules.requiredSet.test( group ) ){
					errorMsg += '<li>' + extendedRules.requiredSet.alert + '</li>';
				}
			}else if( group.ruleName === 'confirm' ){
				if( !extendedRules.confirm.test( group ) ){
					errorMsg += '<li>' + extendedRules.confirm.alert + '</li>';
				}
			}
		}else {
			activeRules = methods.getRules( $formControl, data.form );
			if( !activeRules ){
				return true;
			}			
			
			$.each( activeRules, function(){
				var alert;
				if( !this.rule.test( value, this.filter ) ){
					alert = this.rule.alert;
					alert = alert.replace( '{' + this.ruleName + '}', this.filter );
					errorMsg += '<li>' + alert + '</li>'; 
				}
			});
		}
		
		if( errorMsg !== '' ){
			if( data.alert ){
				$tooltip.html('<li>' + data.alert + '</li>');
			}else {
				$tooltip.html(errorMsg);
			}
			$tooltip.removeClass('lv-guide').addClass('lv-alert');
			$formControl.removeClass('lv-valid').addClass('lv-invalid');
			return false;
		} 
		
		$formControl.removeClass('lv-invalid').addClass('lv-valid');
		return true;
	},	

    
/**
 * Display or hide a form control's tooltip, based on user interaction.
 * @param jQuery  $formControl The target form control
 * @param String  type         The interaction/tooltip type. It could either be hide, alert or guide
 * @param Boolean fadeOut      If set to true, the tooltip will gradually fade out after a few seconds
 */	
	tooltip: function( $formControl, type, fadeOut ){
		var $tooltip, msg, msgLength, $li, data, left, $form;
        if( $formControl.length === 0 ){
            return;
        }
		data = $formControl.data('livelyValidator');
		$form = data.form;
		
		$( '.lv-tooltip', $form ).hide();
		if( type === 'hide' ){
			return;
		} 
		
		$tooltip = data.tooltip; 
		left = $formControl.width() / 2 + $formControl.position().left - data.tooltip.width() / 2;
		data.tooltip.css({left:left});
		
		if( type === 'alert' || $formControl.hasClass('lv-invalid') ){
			$tooltip.fadeIn();			
		}else if( type === 'guide' && $form.data('livelyValidator').settings.showGuides ){
			if( $formControl.hasClass('lv-valid') ){
				return;
			}
			if( !$tooltip.hasClass('lv-guide') ){
				if( data.group && data.group.guide ){
					msg = '<li>' + data.group.guide + '</li>';					
				}else if( data.guide ){
					msg = '<li>' + data.guide + '</li>';
				}else {
					if( data.guide === '' ){
						return true;
					}
					msg = '';
					msgLength = 0;
					$.each( methods.getRules( $formControl, data.form ), function(){
						var guide;
						guide = this.rule.guide; 
						guide = guide.replace( '{' + this.ruleName + '}', this.filter );
						msgLength += guide.length;						
						msg += '<li>' + guide + '</li>';
					});
					if( msgLength === 0 ){ return; }
				}				
				$tooltip.html(msg).removeClass('lv-alert').addClass('lv-guide');
			}
			$tooltip.fadeIn();
		}
			
		if( fadeOut ){
			setTimeout( function(){ $tooltip.fadeOut(); }, 3000 );
		}
		
		$li = $( 'li', $tooltip );
		if( $li.length > 1 ){
			$li.addClass('bullets');
		}	
		
	},

    
/**
 * Parses a form controls data-validate attribute, and compiles aset of validation rules based on the attributes value.
 * @param  jQuery $formControl The target form control, wrapped as a jQuery object
 * @return Array  An array of objects, each object specifying a validation rule.
 */	
	getRules: function( $formControl, $form ){
		var attrValue, output;
		output = false;
		attrValue =  $formControl.attr('data-validate'); 
		
		
		if( typeof attrValue !== 'undefined' ){			
			$.each( attrValue.split(';'), function(){
				var ruleName, rule, filter;
											
				ruleName = String(this);
				if( !ruleName ){
					return true;
				}
				
				if( ruleName.indexOf('::') > -1 ){
					ruleName = ruleName.split('::');
					filter = ruleName[1];
					ruleName = ruleName[0];					
				}else {
					filter = null;					
				}	
				
				rule = $form.data('livelyValidator').settings.rules[ruleName];
				if( !rule ){
					methods.showErrors( 'An unknown validation rule ( ' + ruleName + ' ) was set for the "' + $formControl.attr('name') + '" form control.' );
					return true;
				}
				if( !output ){
					output = [];
				}
				output.push({ rule:rule, ruleName:ruleName, filter:filter });				
			});
		}
		
		return output;		
	},

    
/**
 * Loop through each form control, and add event handlers & tooltips based on the controls types, and the presence & values of specific attributes
 * @param  jQuery $formControl The target form control element, wrapped in JQuery
 * @param type  $form The form controls parent form
 */	
	setControl: function( $formControl, $form ){
		var name, inputDataType, rulesDataType, activeRules, data, settings, attrValue, newRule, pattern, dataValidate, extendedRules;
		
		name = $formControl.attr('name');			
		if( !name ){
			return true;
		}
		
		data = $formControl.data('livelyValidator') || { group:{set:false} };
		data.guide = ( $formControl.attr('data-guide') !== 'undefined' )? $formControl.attr('data-guide') : null;
		data.alert = $formControl.attr('data-alert') || null;
		data.title = $formControl.attr('title') || null;
		data.tooltip = $('<ul class="lv-tooltip"></ul>');
		data.isRequired = false;
		data.form = $form;
		settings = $form.data('livelyValidator').settings;
		extendedRules =  $form.data('livelyValidator').settings.rules;
		$formControl.data( 'livelyValidator', data );
		
		$formControl.removeAttr('title');
		
		data.type = $formControl.get(0).nodeName.toLowerCase();
		if( data.type === 'input' ){ 
			data.type = $formControl.attr('type') || 'text';
		}
		
		// available data types: string, number, date, file, set
		inputDataType = ({radio:'set', checkbox:'set', select: 'set', file: 'file',
						  textarea: 'string', text:'string', password:'string', hidden: 'string', submit: 'string',
						  date: 'date', datetime: 'date', 'datetime-local': 'date', month: 'date', week: 'date', time: 'date', 
						  email: 'string', search: 'string', tel: 'string', url: 'string',
						  number: 'number', range: 'number' }[data.type]) || 'string';		
				
		attrValue = $formControl.attr('data-validate');
		if( attrValue ){
			attrValue = attrValue.replace( /\s/g, '' );
			if( inputDataType === 'string' ){
				attrValue = attrValue.replace( 'min::', 'minChars::' );
				attrValue = attrValue.replace( 'max::', 'maxChars::' );
			}else if( inputDataType === 'number' ){
				attrValue = attrValue.replace( 'min::', 'minNumber::' );
				attrValue = attrValue.replace( 'max::', 'maxNumber::' );
			}else if( inputDataType === 'file' ){
				attrValue = attrValue.replace( 'min::', 'minFileSize::' );
				attrValue = attrValue.replace( 'max::', 'maxFileSize::' );
			}else if( inputDataType === 'date' ){
				attrValue = attrValue.replace( 'min::', 'minDate::' );
				attrValue = attrValue.replace( 'max::', 'maxDate::' );
			}
			$formControl.attr( 'data-validate', attrValue );
		}						  
						  
		activeRules = methods.getRules( $formControl, $form );
		if( activeRules ){
			$.each( activeRules, function(){
				var firstRuleName, ruleName;
				ruleName = this.ruleName;			
				
				if( this.rule.type !== 'all' && this.rule.type !== inputDataType ){
					if( !rulesDataType ){
						rulesDataType = this.rule.type;
						firstRuleName = ruleName;
			
						if( ( rulesDataType === 'number' && $.inArray( data.type, ['file','password','date','datetime','datetime-local','month','week','time','email','url'] ) > -1) ||
							( rulesDataType === 'date' && $.inArray( data.type, ['file','password','email','tel','url'] ) > -1 ) || 
							( rulesDataType === 'file' && data.type !== 'file' ) ){
							methods.showErrors( 'Incompatible validation rules: Setting data-validate="' + ruleName + '" for a "' + data.type + '" form control.');								
						}
					}else if( firstRuleName ){
						methods.showErrors( 'Incompatible validation rules (' + firstRuleName + ', ' + ruleName + ') were set for the "' + name + '" form control.');
					}
				}
				
				if( ruleName === 'confirm' ){
					data.group = { set:true, ruleName: 'confirm', control: $formControl };
					data.group.targetControl = $( "#" + this.filter, data.form );
					if( data.group.targetControl.length !== 1 ){
						methods.showErrors( 'The value set in confirm for the "' + name + '" form control "(' + this.filter + ')" must be an id matching exactly 1 other form input element.');
					}					
				}
				
				if( ruleName === 'required' ){
					data.isRequired = true;
				}
				
			});
			
		}else { 
		//check for html5 setup: pattern + valid input type || required || html5-type
			dataValidate = []; 
			
			if( $.inArray( data.type, ['email','tel','url'] ) > -1 ){
				dataValidate.push(data.type); 
			}else if( $.inArray( data.type, ['date','datetime','datetime-local','month','week','time'] ) > -1 ){
				dataValidate.push(data.type);
				if( $formControl.attr('min') ){
					dataValidate.push( 'minDate::' + $formControl.attr('min') );
				}
				if( $formControl.attr('max') ){
					dataValidate.push( 'maxDate::' + $formControl.attr('max') );
				}	
			}else if( $.inArray( data.type, ['range','number'] ) > -1 ){
				dataValidate.push('number');
				if( $formControl.attr('min') ){
					dataValidate.push( 'minNumber::' + $formControl.attr('min') );
				}
				if( $formControl.attr('max') ){
					dataValidate.push( 'maxNumber::' + $formControl.attr('max') );
				}				
			}
			
			if( $formControl.attr('required') ){
				dataValidate.push( 'required' );
				data.isRequired = true;
			}
			
			pattern = $formControl.attr('pattern') || null;
			if( pattern && $.inArray( data.type, ['text','search','url','tel','email','password'] ) > -1 ){
				newRule = name + Math.floor( Math.random()*99999 );
				dataValidate.push(newRule);
				
				pattern  = new RegExp(pattern);				
				extendedRules[newRule] = {
					type: 'string',
					guide: data.guide || 'Requires a valid ' + data.type + ' value.',
					alert: data.alert || 'Requires a valid ' + data.type + ' value.',
					test: function( input ){
							return pattern .test(input);
					}						
				};
			} 
			
			if( dataValidate ){
				$formControl.attr( 'data-validate', dataValidate.join(';') );
			}		
		}				
		data.dataType = rulesDataType || inputDataType;
		
		if( data.type === 'radio' || data.type === 'checkbox' ){
			if( data.hasOwnProperty('group') && data.group.tooltips ){
				data.group.tooltips = data.group.tooltips.add(data.tooltip);
			}else {
				data.group = { set: true, ruleName: null };
				data.group.controls = $( "input[name='" + name + "']", data.form ); 
				data.group.tooltips = $().add(data.tooltip);
				data.group.controls.each( function(){ 
					if( this === $formControl.get(0) ){
						return true;
					}
					$(this).data( 'livelyValidator', { group: data.group } );
				});
			}
			
			$.each(  methods.getRules( $formControl, $form ), function(){ 
				if( this.ruleName === 'requiredSet' || this.ruleName === 'required' ){
					data.group.ruleName = 'requiredSet';
					data.group.guide = data.guide || this.rule.guide;
				}
			});
			$formControl.click( methods.onEdit );
		}else if( data.type === 'select' ){
			$formControl.change( methods.onEdit );				
		}else if( $.inArray( data.type, [ 'submit', 'reset', 'button' ] ) === -1 ){
			$formControl.blur( methods.onEdit );
			if( $formControl.val() !== '' ){
				methods.validate( $formControl );
			}
		}
		
		if( data.type === 'submit' ){
			data.tooltip.html( '<li>' + ( data.alert || settings.onsumbitAlert ) + '</li>' ).addClass('lv-alert');
			$formControl.after(data.tooltip);
			$formControl.attr( 'data-clicked', '' );
			$formControl.click( function(){ $(this).attr( 'data-clicked', 'clicked' ); } );
		}else {
			$formControl.after(data.tooltip);
			$formControl.hover( function(){ methods.tooltip( $formControl, 'guide' ); }, function(){ methods.tooltip( $formControl, 'hide' ); } );
		}
		
		$formControl.focus( methods.onFocus );
		
	},

    
/**
 * Gets the properties of one or more files selected by a file input form control.
 * @param  Node  formControl The target form control, which is an input control of type 'file'
 * @return Array An array of objects, each object containing the properties of a selected file
 */
	getFiles: function( formControl ){
		var kb, type, subtype, fileName, files, file, ext, i;
		files = [];
		
		if( window.File && window.FileReader && window.FileList && window.Blob ){
			i = 0;
			file = formControl.files[i];
			while( file ){
				kb = Math.round( parseInt( file.size, 10 ) / 1024 );
				fileName = file.name;
				ext = fileName.substr( fileName.lastIndexOf('.') + 1 );
				type = file.type || '';
				if( type ){
					type = type.split('/');
					subtype = type[1];	
					type = type[0];			
				}else{
					type = '';
					subtype = '';				
				}				
				
				files.push({ name: fileName, size: kb, type: type, subtype: subtype, ext: ext });
				
				i += 1;
				file = formControl.files[i];
			} 
		}else {  console.log(2);
			fileName = $(formControl).val();
			ext = fileName.substr( fileName.lastIndexOf('.') + 1 );
			
			if( $.inArray( ext, [ 'jpeg', 'jpg', 'gif', 'giff', 'png', 'bmp', 'tiff', 'tif', 'svg', 'webp' ] ) > -1 ){
				type = 'image';
				subtype = ( ext === 'svg+xml' )? 'svg' : ext;			
			}else if( $.inArray( ext, [ 'txt', 'html', 'xml', 'rtf' ] ) > -1 ){
				type = 'text';
				subtype = ext;
			}else if( ext === 'pdf' ){
				type = 'application';
				subtype = 'pdf';			
			}else if( $.inArray( ext, [ 'doc', 'dot' ] ) > -1 ){
				type = 'application';
				subtype = 'msword';			
			}else if( ext === 'docx' ){
				type = 'application';
				subtype = 'msword';	
			} else{
				type = null;
				subtype = null;			
			}
			
			files.push({ name: fileName, size: null, type: type, subtype: subtype, ext: ext });		 
		}	
	
		return files;	
	},

    
/**
 * Parses a JavaScript string and converts it into a Date object.
 * @param  String input The input string, derived from a form's input control
 * @return Mixed Returns a Date object if successful, otherwise returns false.
 */	
	getDate: function( input ){
		var date, year, month, day, hours, minutes, seconds, secFraction, offset, time, reverseFormat, monthFormat, weekFormat, timeFormat, match;
		
		reverseFormat = /^(\d\d)-(\d\d)-(\d\d\d\d)$/.exec(input); //date, reverse order	
		monthFormat = /^(\d\d\d\d)-((0[1-9])|(1[0-2]))+$/.exec(input); //month, YYYY-MM
		weekFormat = /^(\d\d\d\d)-W(\d\d)$/.exec(input);  //week, 2012-W08
		timeFormat = /^(\d\d):(\d\d):(\d\d)(\.\d*)?$/.exec(input); //time, HH:MM:SS
		match =  /^(\d\d\d\d)\D?(\d\d)\D?(\d\d)(?:T(\d\d)\D?(?:(\d\d)\D?(?:(\d\d)(\.\d*)?)?)((Z|[+\-])(\d\d)?\D?(\d\d)?)?)?$/.exec(input); 
		
		if( reverseFormat ){
			date = new Date( reverseFormat[3], reverseFormat[2] - 1, reverseFormat[1] );
			
		}else if( monthFormat ){
			date = new Date( monthFormat[1], monthFormat[2]-1 );
			
		}else if( weekFormat ){
			date = new Date(0);
			date.setYear( parseInt(weekFormat[1],10) );
			date.setSeconds( parseInt(weekFormat[2],10) * 604800 );
			
		}else if( timeFormat ){ 
			date = new Date(0);
			date.setHours( timeFormat[1] );
			date.setMinutes( parseInt(timeFormat[2],10) );
			date.setSeconds( parseInt(timeFormat[3],10) );
			
		}else if( match ){
		
			// 0:all, 1:year, 2:month, 3:day, 4:hour, 5:minutes, 6:seconds, 7:secFraction, 8:timezone offset, 9: offsetID(Z+-), 10: offset hrs, 11: offset minutes
			year = ( match[1] > 0 && match[1] < 9999 )? match[1] : false;
			month = ( /0?[1-9]|1[012]/.test( match[2] ) )? match[2] : false;
			day = {'01':31,'02':29,'03':31,'04':30,'05':31,'06':30,'07':31,'08':31,'09':30,'10':31,'11':30,'12':31};
			day = ( day[month] && day[month] >= match[3] )? match[3] : false;
			if( day === '29' && month === '02' && year % 4 !== 0 ){ 
				day = false; 
			}
			hours = ( /[0-2][0-9]/.test( match[4] ) )? match[4] : false;
			minutes = ( /[0-5][0-9]/.test( match[5] ) )? match[5] : false;
			seconds = ( /[0-6][0-9]/.test( match[6] ) )? match[6] : false;
			secFraction = ( match[7] )? match[7] * 1000 : 0;
			
			if( input.length > 8 && (!year || !month || !day) ){
				return false;
			}
			
			time = Date.UTC( year, month - 1, day, hours, minutes, seconds, secFraction );
			if(  match[9] === '+' || match[9] === '-' ){
				offset = ( ( match[10] * 60) + parseInt(match[11],10) ) * 60 * 1000;
				offset *= ( match[9] === '+' )? 1 : -1;
				time -= offset;
			}
			
			if( isNaN(time) ){
				return false;
			}
			
			date = new Date(time);
			
		}else {
			date = new Date(input);
			if( isNaN(date.getTime()) ){
				return false;							
			}						
		}
		
		return date;
	},
	
    
/**
 * Displays an error message to help debugging invalid plugin configuration settings 
 * @param Mixed errors A string, or array with strings of error messages
 */
	showErrors: function( errors ){
		var msg;
		if( debug ){
			msg = ( $.isArray(errors) )? errors.join("\n") : errors;
			window.alert(msg);
			$.error(msg);
		}
	}

};
	
/**
 * The main plugin function.
 * @param Object customOptions Custom configuration settings to extend default setting
 * @return Object this The jQuery selection object
 */
$.fn.livelyValidator = function( customOptions, test ){
	var errors = [], defaultSettings, settings, extendedRules;
	
	defaultSettings = { 
        showGuides: true,
        rules: null,
        guides: null,
        alerts: null,  
        debug: (( window.location.protocol === 'http' || window.location.protocol === 'https' )?false:true), 
        onsumbitAlert: 'Please make sure that all fields are correctly filled before sending this form.',
        onValidate: null
    };
						
	errors = [];
	if( !customOptions ){
		customOptions = { rules:$.extend( true, {}, rules ) };	
	}else {
		extendedRules = $.extend( true, {}, rules );		
		
		if( customOptions.hasOwnProperty('debug')  ){
			if( typeof customOptions.debug !== 'boolean' ){
				errors.push('The value set for debug in Lively Validator must be a either TRUE or FALSE.');
				debug = true;
			}else{
				debug = customOptions.debug;
			}			
		}		
		
		if( customOptions.hasOwnProperty('showGuides') && typeof customOptions.showGuides !== 'boolean' ){
			errors.push('The value set for showGuides in Lively Validator must be a either TRUE or FALSE.');
		}		
		
		if( customOptions.hasOwnProperty('onValidate') && typeof customOptions.onValidate !== 'function' ){
			errors.push('The value set for onValidate in Lively Validator must be a JavaScript function.');
		}
		
		if( customOptions.hasOwnProperty('rules') ){
			$.each( customOptions.rules, function( ruleName, rule ){
				if( extendedRules[ruleName] ){
					errors.push('There is already a rule called ' + ruleName + ' set in Lively Validator. Please pick a different name for this rule.');
				}else if( !rule.alert ){
					errors.push('An alert message is missing for the ' + ruleName + ' custom Lively Validator rule.');
				}else if( !rule.test || typeof rule.test !== 'function' ){
					errors.push('The custom Lively Validator rule ' + ruleName + ' is missing a test property, or its test property is not a valid JavaScript function.');
				}else if( !rule.type || $.inArray( rule.type, ['all','string','number','set','date','file'] ) === -1 ){
					errors.push('The custom Lively Validator rule ' + ruleName + ' must have a "type" property with only one of the following allowed values: all, string, number, set, date or file.');
				}else {
					extendedRules[ruleName] = {
						type: rule.type,
						guide: rule.guide || '',
						alert: rule.alert,	
						test: rule.test			
					};
				}
			});
		}
		
		if( customOptions.hasOwnProperty('guides') ){
			$.each( customOptions.guides, function( ruleName, guide ){
				if( !extendedRules[ruleName] ){
					errors.push('Unable to set guide. There is no rule with the name ' + ruleName + ' set in Lively Validator.');
				}else {
					extendedRules[ruleName].guide = guide;
				}
			});
		}
		
		if( customOptions.hasOwnProperty('alerts') ){
			$.each( customOptions.alerts, function( ruleName, alert ){
				if( !extendedRules[ruleName] ){
					errors.push('Unable to set alert. There is no rule with the name ' + ruleName + ' set in Lively Validator.');
				}else {
					extendedRules[ruleName].alert = alert;
				}
			});
		}
		
		customOptions.rules = extendedRules;
		if( errors.length > 0 ){ 
			methods.showErrors(errors);
		}		
	}
	settings = $.extend( true, defaultSettings, customOptions );
    if( settings.debug ){
        this.settings = settings;
    }
    
    if( test ){
        return methods[test.method].apply( this, test.args );    
    }
	
	return this.each( function(){
		var data, $form;		
		if( this.nodeName.toLowerCase() !== 'form' ){
			 methods.showErrors('Lively Validator can only be used on <form> elements.');
			 return true;
		} 
		
		data = { errors:[], settings: settings, groups:{}, radios:{}, checkboxes:{} };
		$form = $(this).data( 'livelyValidator', data );
		$( ':input', $form ).each( function(){ methods.setControl( $(this), $form ); });
		
		$form.attr( 'novalidate', 'novalidate' );
		$form.submit(methods.onSubmit);
	});
};

}(jQuery));