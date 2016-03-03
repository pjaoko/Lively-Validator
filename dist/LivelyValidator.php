<?php
/*
* Lively Validator 1.0.0
* Server-side helper Class for the JQuery Lively Validator plugin
* Copyright 2016, Patrick Jaoko
* Free to use under the MIT license.
* http://www.opensource.org/licenses/mit-license.php
*/

class LivelyValidator{
	
	public $invalid = array(); //contains all invalid data items, sorted by item keys then tested rules: array( 'itemKey'=>array( 'ruleName 1', 'ruleName 2' .. ))
	public $valid = array(); //contains all valid data items, sorted by item keys then tested rules:array( 'itemKey'=>array( 'ruleName 1', 'ruleName 2' .. ))
	public $empty = array(); //contains all empty/unset data items that were not required, sorted by item keys: array( 'itemKey'=>'ruleName') 
	public $data = array(); //The data to be validated, as key-value pairs
	public $rules = array(); //The rules to validate the data against, as key-value pairs.

/**
* The class constructor function. Creates a validation object.
* @param Array $rules An array containing key-value pairs of all the rules to test against. The keys must match items in the $data array described below.
* @param Array $data  An array containing key-value pairs of all the data to validate. If none is supplied, the $_POST and $_FILE arrays will be used instead.
*/	
	public function __construct( array $rules, array $data = null ){
		$this->rules = $rules;
		
		if( $data ){
			$this->data = $data;
		}else {
			$this->data = $_POST;			
			foreach( $_FILES as $key => $value ){
				$this->data[$key] = $this->getFile( $_FILES[$key] );
			}
		}
		
		foreach( $this->rules as $key => $value ){
			if( !isset($this->data[$key]) ){ $this->data[$key] = ''; }
			$this->validate( $rules[$key], $this->data[$key], $key );
		}		
	}

/**
* This function populates the $invalid, $valid and $empty arrays, by parsing and running all the set validation rules against matching data.
* @param  String    $rules The set rules for a particular item.
* @param  String    $value The data value for a particular items.
* @param  String    $key   The items name, which links the supplied data to a particular validation rule.
* @throws Exception When a rule that does not have a matching "validation method" is set.
*/	
	private function validate( $rules, $value, $key ){
		$rules = preg_split( "!\s?;\s!" , $rules, -1, PREG_SPLIT_NO_EMPTY );
		$required = in_array( 'required', $rules ) || in_array( 'requiredSet', $rules ); 
		
		if( !$required && empty($value) ){
			$this->empty[$key] = $rules;
			return;
		}
		
		foreach( $rules as $ruleName ){
			if( strpos( $ruleName, '::' ) > 0 ){
				$ruleName = explode( '::', $ruleName );
				$filter = trim($ruleName[1]);
				$ruleName = trim($ruleName[0]);				
			}else{
				$filter = null;
			}
			
			if( !method_exists( $this, $ruleName ) ){
				throw new Exception("An unknown validation rule ($ruleName) was set for $key.");
			}else if( !call_user_func_array( array( $this, $ruleName ), array( $key, $value, $filter ) ) ){
				if( !isset($this->invalid[$key]) ){
					$this->invalid[$key] = array();
				}
				$this->invalid[$key][] = $ruleName;
			}else{
				if( !isset($this->valid[$key]) ){
					$this->valid[$key] = array();
				}
				$this->valid[$key][] = $ruleName;				
			}			
		}
	}

/**
* Gets the properties of an uploaded item from the $_FILE array.
* @param  Array  $value The value of a particular item in the $_FILE array.
* @return Object An object containing all the relevant properties of an uploaded file.
*/
	private function getFile( $value ){
		if( $value['error'] ){
			return false;
		}	
		
		$file = new stdClass();
		$file->name = $value['name'];
		$file->size = round( (Int) $value['size'] / 1024 ); //kb
		$file->extension = pathinfo( $value['name'], PATHINFO_EXTENSION );
		
		$finfo = finfo_open(FILEINFO_MIME_TYPE);
		$info = explode( '/', finfo_file( $finfo, $value['name'] ) );
		finfo_close($finfo);
		$file->type = $info[0];
		if( isset($info[1]) ) { 
			$file->subtype = $info[1]; 
		}
		
		return $file;		
	}

/**
* Checks whether a required data item was supplied, and is not empty
* @param  String  $key    The key/name of the item.
* @param  String  $value  The data to test/validate.
* @param  String  $filter The constraint to test the data against. Not applicable to this method.
* @return Boolean returns TRUE if the data is valid, and FALSE if the data failed the test.
*/	
	private function required( $key, $value, $filter ){
		if( !isset( $this->data[$key] ) || strlen($value) == 0 ){
			return false;
		}
		return true;		
	}

/**
* Checks whether a data item's value matches (is equal to) another items value.
* @param  String  $key    The key/name of the item.
* @param  String  $value  The data to test/validate.
* @param  String  $filter The constraint to test the data against.
* @return Boolean returns TRUE if the data is valid, and FALSE if the data failed the test.
*/		
	private function confirm( $key, $value, $filter ){
		if( !isset( $this->data[$key] ) || !isset( $this->data[$filter] ) ){
			return false;
		}
		return $this->data[$key] == $this->data[$filter];		
	}

/**
* Checks whether a required data item was supplied, and is not empty. usually used to validate radio and checkbox input fields.
* @param  String  $key    The key/name of the item.
* @param  String  $value  The data to test/validate.
* @param  String  $filter The constraint to test the data against. Not applicable to this method.
* @return Boolean returns TRUE if the data is valid, and FALSE if the data failed the test.
*/		
	private function requiredSet( $key, $value, $filter ){		
		if( empty( $this->data[$key] ) ){
			return false;
		}
		return true;				
	}	

/**
* Checks whether the supplied data contains only alphabetic characters(a-z,A-Z).
* @param  String  $key    The key/name of the item.
* @param  String  $value  The data to test/validate.
* @param  String  $filter The constraint to test the data against. Not applicable to this method.
* @return Boolean returns TRUE if the data is valid, and FALSE if the data failed the test.
*/	
	private function alphabetic( $key, $value, $filter ){
		return preg_match( "!^[ÀÈÌÒÙàèìòùÁÉÍÓÚÝáéíóúýÂÊÎÔÛâêîôûÃÑÕãñõÄËÏÖÜŸäëïöüŸ¡¿çÇŒœßØøÅåÆæÞþÐða-zA-Z]+$!", $value );				
	}

/**
* Checks whether the supplied data contains only digits (0-9).
* @param  String  $key    The key/name of the item.
* @param  String  $value  The data to test/validate.
* @param  String  $filter The constraint to test the data against. Not applicable to this method.
* @return Boolean returns TRUE if the data is valid, and FALSE if the data failed the test
*/		
	private function numeric( $key, $value, $filter ){
		return preg_match( "!^\d+$!", $value );				
	}	

/**
* Checks whether the supplied data contains only digits and alphabetic characters (0-9,a-z,A-Z).
* @param  String  $key    The key/name of the item.
* @param  String  $value  The data to test/validate.
* @param  String  $filter The constraint to test the data against. Not applicable to this method.
* @return Boolean returns TRUE if the data is valid, and FALSE if the data failed the test
*/	
	private function alphanumeric( $key, $value, $filter ){
		return preg_match( "!^[ÀÈÌÒÙàèìòùÁÉÍÓÚÝáéíóúýÂÊÎÔÛâêîôûÃÑÕãñõÄËÏÖÜŸäëïöüŸ¡¿çÇŒœßØøÅåÆæÞþÐða-zA-Z0-9]+$!", $value );				
	}

/**
* Checks whether the supplied data does not contain less than the allowed minimum, in terms of character count.
* @param  String  $key    The key/name of the item.
* @param  String  $value  The data to test/validate.
* @param  String  $filter The constraint to test the data against.
* @return Boolean returns TRUE if the data is valid, and FALSE if the data failed the test.
*/	
	private function minChars( $key, $value, $filter ){
		return strlen($value) >= $filter;				
	}

	/**
* Checks whether the supplied data does not contain less than the allowed maximum, in terms of character count.
* @param  String  $key    The key/name of the item.
* @param  String  $value  The data to test/validate.
* @param  String  $filter The constraint to test the data against. Not applicable to this method.
* @return Boolean returns TRUE if the data is valid, and FALSE if the data failed the test
*/
	private function maxChars( $key, $value, $filter ){
		return strlen($value) <= $filter;				
	}

/**
* Checks whether the supplied data's format is that of a valid email address.
* @param  String  $key    The key/name of the item.
* @param  String  $value  The data to test/validate.
* @param  String  $filter The constraint to test the data against. Not applicable to this method.
* @return Boolean returns TRUE if the data is valid, and FALSE if the data failed the test.
*/
	private function email( $key, $value, $filter ){
		return filter_var( $value, FILTER_VALIDATE_EMAIL );				
	}

/**
* Checks whether the supplied data's format is that of a valid telephone number.
* @param  String  $key    The key/name of the item.
* @param  String  $value  The data to test/validate.
* @param  String  $filter The constraint to test the data against. Not applicable to this method.
* @return Boolean returns TRUE if the data is valid, and FALSE if the data failed the test.
*/
	private function tel( $key, $value, $filter ){
		return preg_match( "!^([\d+][0-9\(\)\/\+ \-]{2,20})$!", $value );				
	}

/**
* Checks whether the value is a valid, absolute URL.
* @param  String  $key    The key/name of the item.
* @param  String  $value  The data to test/validate.
* @param  String  $filter The constraint to test the data against. Not applicable to this method.
* @return Boolean returns TRUE if the data is valid, and FALSE if the data failed the test
*/
	private function url( $key, $value, $filter ){
		return preg_match( "~^(?:(?:https?|ftp)://)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\x{00a1}-\x{ffff}0-9]+-?)*[a-z\x{00a1}-\x{ffff}0-9]+)(?:\.(?:[a-z\x{00a1}-\x{ffff}0-9]+-?)*[a-z\x{00a1}-\x{ffff}0-9]+)*(?:\.(?:[a-z\x{00a1}-\x{ffff}]{2,})))(?::\d{2,5})?(?:/[^\s]*)?$~ui", $value );				
	}

/**
* Checks whether the supplied value is a valid HTML/CSS hex color.
* @param  String  $key    The key/name of the item.
* @param  String  $value  The data to test/validate.
* @param  String  $filter The constraint to test the data against. Not applicable to this method.
* @return Boolean returns TRUE if the data is valid, and FALSE if the data failed the test
*/
	private function color( $key, $value, $filter ){
		return preg_match( "!^#[A-Fa-f0-9]{6,}$!", $value );				
	}

/**
* Checks whether the supplied data's format matches that of a valid credit card number.
* @param  String  $key    The key/name of the item.
* @param  String  $value  The data to test/validate.
* @param  String  $filter The constraint to test the data against. Not applicable to this method.
* @return Boolean returns TRUE if the data is valid, and FALSE if the data failed the test.
*/
	private function creditCard( $key, $value, $filter ){
		return preg_match( "!^\d{13,16}$!", $value );				
	}

/**
* Checks whether the supplied value is a valid number.
* @param  String  $key    The key/name of the item.
* @param  String  $value  The data to test/validate.
* @param  String  $filter The constraint to test the data against. Not applicable to this method.
* @return Boolean returns TRUE if the data is valid, and FALSE if the data failed the test.
*/
	private function number( $key, $value, $filter ){
		return is_numeric( $value );				
	}

/**
* Checks whether the supplied value is equal to, or greater than a specified minimum value.
* @param  String  $key    The key/name of the item.
* @param  String  $value  The data to test/validate.
* @param  String  $filter The constraint to test the data against.
* @return Boolean returns TRUE if the data is valid, and FALSE if the data failed the test.
*/
	private function minNumber( $key, $value, $filter ){
		return $value >= $filter;				
	}

/**
* Checks whether the supplied value is equal to, or more than a specified maximum value.
* @param  String  $key    The key/name of the item.
* @param  String  $value  The data to test/validate.
* @param  String  $filter The constraint to test the data against.
* @return Boolean returns TRUE if the data is valid, and FALSE if the data failed the test.
*/
	private function maxNumber( $key, $value, $filter ){
		return $value <= $filter;				
	}

/**
* Checks whether the supplied value is a valid age ( for a living human being).
* @param  String  $key    The key/name of the item.
* @param  String  $value  The data to test/validate.
* @param  String  $filter The constraint to test the data against. Not applicable to this method.
* @return Boolean returns TRUE if the data is valid, and FALSE if the data failed the test.
*/
	private function age( $key, $value, $filter ){
		return is_numeric($value) && $value > -1 && $value < 120;				
	}

/**
* Checks whether the uploaded file's extension matches the allowed type.
* @param  String  $key    The key/name of the item.
* @param  String  $value  The data to test/validate.
* @param  String  $filter The constraint to test the data against.
* @return Boolean returns TRUE if the data is valid, and FALSE if the data failed the test.
*/
	private function fileExtension( $key, $value, $filter ){
		$file = $this->data[$key];
		if( !$file ){
			return true;
		}		
		return $file->extension == $filter;				
	}

/**
* Checks whether the uploaded file's mime type matches the allowed type.
* @param  String  $key    The key/name of the item.
* @param  String  $value  The data to test/validate.
* @param  String  $filter The constraint to test the data against.
* @return Boolean returns TRUE if the data is valid, and FALSE if the data failed the test.
*/	
	private function fileMimeType( $key, $value, $filter ){
		$file = $this->data[$key];
		if( !$file ){
			return true;
		}		
		return $file->type == $filter;				
	}

/**
* Checks whether the uploaded file's mime subtype matches the allowed type.
* @param  String $key    The key/name of the item.
* @param  String $value  The data to test/validate.
* @param  String $filter The constraint to test the data against.
* @return Boolean returns TRUE if the data is valid, and FALSE if the data failed the test.
*/
	private function fileMimeSubtype( $key, $value, $filter ){
		$file = $this->data[$key];
		if( !$file ){
			return true;
		}		
		return $file->subtype == $filter;				
	}	

/**
* Checks whether the uploaded file's size is equal to or greater than the minimum allowes size.
* @param  String $key    The key/name of the item.
* @param  String $value  The data to test/validate.
* @param  String $filter The constraint to test the data against.
* @return Boolean returns TRUE if the data is valid, and FALSE if the data failed the test.
*/
	private function minFileSize( $key, $value, $filter ){
		$file = $this->data[$key];
		if( !$file ){
			return true;
		}		
		return $file->size >= $filter;				
	}	

/**
* Checks whether the uploaded file's size is equal to or less than the maximum allowed size.
* @param  String $key    The key/name of the item.
* @param  String $value  The data to test/validate.
* @param  String $filter The constraint to test the data against.
* @return Boolean returns TRUE if the data is valid, and FALSE if the data failed the test.
*/
	private function maxFileSize( $key, $value, $filter ){
		$file = $this->data[$key];
		if( !$file ){
			return true;
		}		
		return $file->size <= $filter;				
	}	

/**
* Checks whether the uploaded file's mime type is "image".
* @param  String  $key    The key/name of the item.
* @param  String  $value  The data to test/validate.
* @param  String  $filter The constraint to test the data against.
* @return Boolean returns TRUE if the data is valid, and FALSE if the data failed the test.
*/
	private function image( $key, $value, $filter ){
		$file = $this->data[$key];
		if( !$file ){
			return true;
		}		
		return $file->type == 'image';				
	}	

/**
* Checks whether the uploaded file's is a PDF or MS Word document
* @param  String  $key    The key/name of the item.
* @param  String  $value  The data to test/validate.
* @param  String  $filter The constraint to test the data against. Not applicable to this method.
* @return Boolean returns TRUE if the data is valid, and FALSE if the data failed the test.
*/
	private function document( $key, $value, $filter ){
		$file = $this->data[$key];
		if( !$file ){
			return true;
		}		
		return  $file->type == 'application' && in_array( $file->extension, array('doc','docx','pdf') );		
	}

/**
* Checks whether the supplied value is a valid HTML5 date e.g 2012-12-25
* @param  String  $key    The key/name of the item.
* @param  String  $value  The data to test/validate.
* @param  String  $filter The constraint to test the data against. Not applicable to this method.
* @return Boolean returns TRUE if the data is valid, and FALSE if the data failed the test.
*/
	private function date( $key, $value, $filter ){
		return preg_match( "!^\d\d\d\d-\d\d-\d\d$!", $value );				
	}
	
/**
* Checks whether the supplied value is a date equal to or greater than the allowed minimum date.
* @param  String $key    The key/name of the item.
* @param  String $value  The data to test/validate.
* @param  String $filter The constraint to test the data against.
* @return Boolean returns TRUE if the data is valid, and FALSE if the data failed the test.
*/
	private function minDate( $key, $value, $filter ){
		$value = strtotime($value);
		$filter = strtotime($filter);		
		return $value >= $filter;				
	}

/**
* Checks whether the supplied value is a date equal to or less than the allowed minimum date.
* @param  String $key    The key/name of the item.
* @param  String $value  The data to test/validate.
* @param  String $filter The constraint to test the data against.
* @return Boolean returns TRUE if the data is valid, and FALSE if the data failed the test.
*/
	private function maxDate( $key, $value, $filter ){
		$value = strtotime($value);
		$filter = strtotime($filter);		
		return $value <= $filter;				
	}

/**
* Checks whether the supplied value is a valid HTML5 datetime e.g. 1990-12-31T23:59:60Z
* @param  String  $key    The key/name of the item.
* @param  String  $value  The data to test/validate.
* @param  String  $filter The constraint to test the data against. Not applicable to this method.
* @return Boolean returns TRUE if the data is valid, and FALSE if the data failed the test.
*/
	private function datetime( $key, $value, $filter ){
		return preg_match( "!^\d\d\d\d\-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d*)?(Z|([+\-]\d\d:\d\d))$!", $value );				
	}

/**
* Checks whether the supplied value is a valid HTML5 datetime-local value e.g. 1996-12-19T16:39:57
* @param  String  $key    The key/name of the item.
* @param  String  $value  The data to test/validate.
* @param  String  $filter The constraint to test the data against. Not applicable to this method.
* @return Boolean returns TRUE if the data is valid, and FALSE if the data failed the test.
*/
	private function datetimeLocal( $key, $value, $filter ){
		return preg_match( "!^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d*)?$!", $value );				
	}	

/**
* Checks whether the supplied value is a valid HTML5 month value e.g. 2012-12
* @param  String  $key    The key/name of the item.
* @param  String  $value  The data to test/validate.
* @param  String  $filter The constraint to test the data against. Not applicable to this method.
* @return Boolean returns TRUE if the data is valid, and FALSE if the data failed the test.
*/
	private function month( $key, $value, $filter ){
		return preg_match( "!^\d\d\d\d-((0[1-9])|(1[0-2]))+$!", $value );				
	}	

/**
* Checks whether the supplied value is a valid HTML5 week value e.g. 2012-W08
* @param  String  $key    The key/name of the item.
* @param  String  $value  The data to test/validate.
* @param  String  $filter The constraint to test the data against. Not applicable to this method.
* @return Boolean returns TRUE if the data is valid, and FALSE if the data failed the test.
*/
	private function week( $key, $value, $filter ){
		preg_match( "!^\d\d\d\d-W(\d\d)$!", $value, $match ); 
		if( $match && $match[1] > 0 && $match[1] <= 53 ){
			return true;
		}
		return false;				
	}	

/**
* Checks whether the supplied value is a valid HTML5 time value e.g. 17:39:57
* @param  String  $key    The key/name of the item.
* @param  String  $value  The data to test/validate.
* @param  String  $filter The constraint to test the data against. Not applicable to this method.
* @return Boolean returns TRUE if the data is valid, and FALSE if the data failed the test.
*/
	private function time( $key, $value, $filter ){
		preg_match( "!^(\d\d):(\d\d):(\d\d)(\.\d*)?$!", $value, $match );
		if( $match && $match[1] <= 23 && $match[2] <= 59 && $match[3] <= 60 ){
			return true;
		}
		return false;				
	}																		

}
