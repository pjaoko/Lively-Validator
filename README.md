-   Over 30 validation rules for different types of data including numbers, files, dates and strings. You can easily extend the plugin with their own custom rules.

-   Both client-side (the jQuery plugin) and server-side (a PHP class) validation supported.

-   Stylish tooltips for instant feedback. The look is fully customizable using CSS.

-   HTML5 aware - recognizes and supports all the new HTML5 form input types and attributes.

-   Two types of feedback messages: Guides for helpful instructions before filling, and Alerts for errors messages. Each validation rule has its own Guide and Alert message, which you can change and customize for all fields at once, or just one form field.

-   Allows multiple validation rules to be specified on the same element.

VALIDATION TYPES
----------------

#### GENERIC

required, confirm, min, max

#### STRINGS

-   alphabetic
-   alphanumeric
-   color
-   creditcard number
-   email address
-   maximum length
-   minimum length
-   numeric text
-   telephone numbers
-   URLs

#### DATES

-   date
-   datetime
-   datetimeLocal
-   maximum
-   minimum
-   month
-   time
-   week

#### FILES

-   document
-   extension
-   mime subtype
-   mime type
-   image
-   maximum size
-   minimum size

#### NUMBERS

-   age
-   maximum
-   minimum
-   valid number

Quick Start
===========

Step 1 - Create the form
------------------------

Start by creating the form. There are no restrictions on the markup or styling of the form, so feel free to use any format or styling that suits you. Give the form a unique id, to make it easier to select using jQuery for the plugin's initialization (step 5).

Step 2 - Set validation rules
-----------------------------

Consider all the data being collected, and any rules or restrictions on what can be entered into each form field. The [Validation Rules](#page2-3) section gives a detailed list of all the validation rules available. Then use the `data-validate` attribute to set rules for each field. You could also customize the Guide and Alert messages for each field (see [HTML Configuration](#page2-2-1)) or change the Alert and Guide messages produced by any validation rule (see [JavaScript Setup Options](#page2-2-2)).

Step 3 - Add a link to Lively Validator's CSS file
--------------------------------------------------

You will find this CSS file in "Lively-Validator/lively-validator.css", and its to style the Guide and Alert tooltips, and validated form fields. Link to it in your form's HTML document as shown below.

``` html
<html>
<head>
  <title>Lively Validator Example</title>
  <link rel="cssheet" href="css.css" />
  <link rel="cssheet" href="Lively-Validator/lively-validator.css" />
</head>
<body>
<form method="post" name="example" id="example"> 
..
```

Step 4 - Add a link to jQuery
-----------------------------

Next, add a link to the jQuery JavaScript file. In the example below, it is placed within the `<head>` section of the HTML document.

``` html
<html>
<head>
  <title>Lively Validator Example</title>
  <link rel="cssheet" href="css.css" />
  <link rel="cssheet" href="Lively-Validator/lively-validator.css" />
  < script type="text/javascript" src="Lively-Validator/jquery-1.12.0_min.js"></script>
</head>
<body>
<form method="post" name="example" id="example"> 
..
```

Step 5 - Add a link to Lively Validator
---------------------------------------

Below the link to jQuery, add a link to Lively Validator. Both this and the previous two links above assume that the JavaScript and CSS files are in a folder named "Lively-Validator", and that both this folder and the HTML document share the same parent folder. If you are using a different file structure, make sure you change all the links to reflect that.

``` html
<html>
<head>
  <title>Lively Validator Example</title>
  <link rel="cssheet" href="css.css" />
  <link rel="cssheet" href="Lively-Validator/lively-validator.css" />
  <script type="text/javascript" src="Lively-Validator/jquery-1.12.0_min.js"></script>
  <script type="text/javascript" src="Lively-Validator/livelyValidator.js"></script>
</head>
<body>
<form method="post" name="example" id="example"> 
..
```

Step 6 - Initialize the plugin
------------------------------

Add the JavaScript code below, just after the link to Lively Validator. Here, the code is embedded within the HTML document, though it could also be placed in an external JavaScript file. It initializes the plugin once the whole page has loaded by adding an event-handler function to jQuery's `document.ready()` event. The event-handler function is itself a simple one-liner that selects the target form by id, then calls the plugin's `livelyValidator()` function.

``` html
<html>
<head>
  <title>Lively Validator Example</title>
  <link rel="cssheet" href="css.css" />
  <link rel="cssheet" href="Lively-Validator/lively-validator.css" />
  <script type="text/javascript" src="Lively-Validator/jquery-1.12.0_min.js"></script>
  <script type="text/javascript" src="Lively-Validator/livelyValidator.js"></script>
  <script type="text/javascript" >
     $(document).ready( function(){ $('#example').livelyValidator(); });
  </script>
</head>
<body>
<form method="post" name="example" id="example"> 
..
```

In the example above, the `livelyValidator()` function is called without any parameters though it does accept an optional object. The object is used to customize the plugin's validation Guides and Alert messages, extend it with your own validation rules or alter its default behavior on form submission. See the [JavaScript](#page2-2-2) section under "Setup & Configuration Options" for more info on this.

Step 7 - Implement server-side validation (optional)
----------------------------------------------------

Lively Validator comes with a server-side PHP validation class, built to work together with its client-side jQuery plugin. This last step is optional but highly recommended, just in-case a sneaky user turns off JavaScript in their browsers so as to bypass the client-side validation. The PHP class adds an extra layer of security on the server. How you implement the server-side validation will depend mainly on the purpose of the form and its processing logic, but a well documented, practical example on how to do this is provided in the [Examples](#page3) section. You can also read more about the Lively Validator PHP class [here](#page2-5).

Setup & Configuration Options
=============================

This section covers how to get Lively validator up and running by specifying validations rules and customizing its behavior. All the validation rules and feedback messages are set in [HTML](#page2-2-1), while the plugin's initialization and customization is a [JavaScript](#page2-2-2) affair.

HTML Configuration
==================

Lively Validator works with all types of interactive form controls: buttons, checkboxes, radio buttons, file select, text input and drop-down menus. It checks the validity of a form control's value just after a user edits it, and before the form is submitted. It also provides helpful Guides (instructions) before a field is edited, and Alerts (error messages) whenever invalid data is inserted in a field. All the rules, guides and alerts are configured as attributes of the targeted form control, namely: `data-validate`, `data-alert` and `data-guide`. The plugin also recognizes new HTML5 input types and attributes, and these could also be used to set validation rules.

-   [Setting Validation Rules](#page2-2-1-1)
-   [Customizing Guides](#page2-2-1-2)
-   [Customizing Alerts](#page2-2-1-3)

Setting Validation Rules
========================

There are 4 different ways of setting validation rules:

### 1. Using the `data-validate` attribute

This is the default method, which takes precedence over the other 3. The main advantage of using this rule is that you can declare many validation rules at once.

``` html
Days in a Month: 
<input name="days" data-validate="required; number; minNumber::28; maxNumber::31" />
```

In the example above, 4 separate validation rules have been set for the input field: required, number, minNumber and maxNumber. Each of the rules must be separated by a **';'** character. Some rules like `minNumber` and `maxNumber` will require an additional parameter to perform the check, which is specified by adding **"::"** after the rule's name. So to restrict input to a number greater than 50, we'll use `data-validate="minNumber::50"`. The only restriction to setting many rules on the same form field is that all the rules must validate the same basic data type. For example, you cannot require a field's value to be both an image file and a number.

All the validation rules provided by the plugin are grouped into six categories: all, set, string, number, date and file. The only rule in the **"all"** category is **required**, and this is the only validation rule that can be mixed with rules from other categories. If you happen to accidentally mix rules from different categories, the plugin will only check the rules from the first category specified, and ignore all the rest. If `debug` is set to true, this will also throw an Exception after calling JavaScript's `alert()` method with more details on the error. For more information about the categories and all the available validation rules, please see the [Validation Rules](#page2-3) section.

### 2. Using the `required` attribute

Setting this new HTML5 attribute will automatically stop any form being submitted if its the target field is empty. All modern browsers support this behavior, but differ on error message content and styling. Using Lively Validator, your forms behave and look uniformly across all browsers, including older ones that do not support HTML5. The plugin does this by turning off the browser's default behavior by setting the forms `novalidate` attribute in modern browsers, then taking over the validation process.

To set a field as required, simply add the "required" attribute as shown below.

``` html
Days in a Month: 
<input name="days" required="required" />
```

### 3. Using new HTML5 input types

If you use any of the new HTML5 input types, the plugin automatically validates the field's value whenever a user changes it. Lively Validator supports the following new input types: `email`, `tel`, `url`, `date`, `datetime`, `datetime-local`, `month`, `week`, `time`, `range` and `number`.

You can also use the `min` and `max` attributes together with the new input types, and Lively validator will also check these constraints for you. The `min` and `max` attributes can be used together with the following: date, datetime, datetime-local, month, week, time range and number.

The example below shows how to set validation rules using the new HTML5 input attributes. Its worth noting that the rules specified here have the same effect as those declared using the custom `data-validate` attribute in 1 above.

``` html
Days in a Month: 
<input name="days" type="number" required="required" min="28" max="31" />
```

### 4. Using The `pattern` Attribute

The new `pattern` attribute lets you specify a regular expression which the browser uses to validate input data. The HTML5 specification states that the `pattern` attribute should only be used with the following form input types: text, search, url, tel, email and password.

By using the pattern attribute with any of the allowed input types, Lively Validator will copy the regular expression specified as the patterns value, and then use it to generate a new validation rule for that input field. Using the same "Days in a month" example, the HTML for this will be:

``` html
Days in a Month: 
<input name="days" type="text" pattern="28|29|30|31" required="required" />
```

Customizing Guides
==================

Lively Validator has over thirty validation rules, and each has its own Guide. Guides give the user some helpful tips or instructions before they fill a form field. You can use the default Guide, or set your own for each field using the `data-guide` attribute as shown in the example below.

``` html
Phone: <input name="phone" 
data-validate="tel; required" 
data-guide="Please provide a valid telephone number, including the country and area code." 
/>
```

You can disable Guide's on a form field by setting the data-guide attribute a blank string
(`data-guide=""`). To turn off Guides for all form fields, see the `showGuides` configuration option in the [JavaScript](#page2-2-2) section.

Examples
--------

Hover over each of the two fields below to see the results of using the `data-guide` attribute.

Customizing Alerts
==================

Alert tooltips are displayed whenever the user hovers over a field containing invalid data, and each validation rule has it's own unique Alert message. Unlike Guides, these messages are not optional and must always display whenever a validation error occurs. You can set your own custom Alert messages on a form field using the `data-alert` attribute as shown below.

``` html
Email: <input name="email"  
 data-validate="email" 
 data-alert="A valid email address is required for example.com registration." 
/>
```

Examples
--------

Click on the send button, then hover over each of the two fields below to see the results of using the `data-alert` attribute.

JavaScript Setup Options
========================

Lively Validator has just one public function: `livelyValidator()`. It is used to both initialize and customize an instance of the plugin. The customization is done using the optional object parameter passed to the `livelyValidator()` function. This object can have any one of the properties below. All these properties are optional, as the plugin falls back to use the default values if none are set. This sections looks at each of the properties in turn.

-   [showGuides](#page2-2-2-1)
-   [guides](#page2-2-2-2)
-   [alerts](#page2-2-2-3)
-   [onsubmitAlert](#page2-2-2-4)
-   [rules](#page2-2-2-5)
-   [onValidate](#page2-2-2-6)
-   [debug](#page2-2-2-7)

showGuides
==========

This option lets you set whether to show the Guide tooltips when a user hovers over an empty form field.

**Default Value:** true

**Allowed Values:** true or false

### Examples

Hover over the input fields in the two forms below to see the effect of setting `showGuides`

guides
======

This configuration option changes a validation rule's Guide. All fields that use this rule will then show your new message instead of the default one when the Guide tooltip appears. However, this only applies when `showGuides` is not set to `false`, and a `data-guide` attribute has not been set on the current form field.

**Default Value:** null

**Allowed Values:** A JavaScript object of key-value pairs, where each key must match one of Lively Validator's [Validation Rules](#page2-3). The value is the new message.

Examples
--------

Hover over the input fields in the two forms below to see the effect of setting `guides`.

alerts
======

Alert tooltips appear when a form field contains invalid data and the mouse pointer hovers over it. There are over 30 data validation rules in Lively Validator, and each rule has its own unique Alert message. You change a rule's Alert message during plugin initialization by passing an object with an `alert` property to the `livelyValidator()` function. The value of `alert` must be an object of key-value pairs, with the key being the name of the validation rule you want to customize, and the value being the new Alert message.

**Default Value:** null

**Allowed Values:** A JavaScript object of key-value pairs, where each key must match one of Lively Validator's [Validation Rules](#page2-3). The value contains the new alert message.

Examples
--------

Click the submit button on each form, then mouse-over the input fields to see the effect of setting `alerts`

onsubmitAlert
=============

Lively Validator always checks all the form fields containing validation rules whenever a user attempts to submit a form. If any invalid data is found, form submission is stopped, and the submit button that was clicked on will briefly display a general error message (Alert). Use the `onsubmitAlert` configuration option to change the default message. To change the Alert for a specific submit button, use the `data-alert` attribute as outlined in the [HTML Configuration](#page2-2-1) Configuration section.

**Default Value:** 'Please make sure that all fields are correctly filled before sending this form.'

**Allowed Values:** A JavaScript string.

Examples
--------

Click the submit button on each form to see the effect of setting `onsubmitAlert`.

rules
=====

Validation rules are at the core of what this plugin is all about, and there are over 30 validation rules for different types of data including strings, numbers, dates and files. If you find that none of this rules test a unique data validation requirement, the plugin offers a simple way to extend it with your own rules using the `rules` configuration option. The `rules` configuration property must be a JavaScript object of key-value pairs, where each pair defines a new validation rule. The key is the new rule's name, which must not clash with any of the plugin's [in-built validation rules](#page2-3). The value is a Javascript object containing the new rule's definition.

A rules definition object contains the following properties:

-   **type**: The basic data-type the rule checks. this must be one of the following: all, string, number, set, date or file.
-   **guide**: A string containing the rule's Guide message. This one is optional.
-   **alert**: A string containing the rule's alert message.
-   **test**: This is the JavaScript function that performs the validation. It must always return a boolean value ( true or false ), and accepts two arguments. The first argument is for the data to validate, while the second is an optional parameter for functions that require it.

Example
-------

In this example, we want to verify the user's age, and also make sure that they're over 18. The form presents two related fields, the first one asking for their age, and the second requesting the year of birth. Our custom validation rule will take both fields and check whether the year of birth given corresponds to the age value.

``` html
<form id="example" method="post" >
<fieldset>
  <legend>Custom Rule Example</legend>
  <p>Age: <input name="age_field" data-validate="age" /></p>
  <p>Birth Year: <input name="year_field" data-validate="required; confirmAge::age_field;" /></p>
<p><input type="submit" name="send" value="Submit" /></p>
</fieldset>
</form>
```

The HTML used to create the form is shown above. The important part here is the value of the `data-validate` attribute, which lists 3 validation rules: `required`, `number` and `confirmAge`. The custom rule here is confirmAge, which take one parameter - the name of another field in the same form. The `confirmAge()` function below takes this value as its second parameter, which it uses to obtain the value entered in the "Age" field using jQuery. This value is then compared to the value of the functions first parameter, which is the value entered in the "birth Year" field. The `confirmAge()` function is then added to Lively Validator, when now has a new validation rule called "confirmAge".

``` javascript
var customRules, newRule;
newRule = {};
  newRule.test = function ( input, targetField ){
  // input contains the value entered in the "Age" field
  var $targetField, currentYear, givenAge, calculatedAge, birthYear;
  // select the "Age" field with JQuery
  $targetField = $("input[name='" + targetField + "']");
  // get its value & convert it into a number
  givenAge = parseInt( $targetField.val(), 10 );
  birthYear = parseInt( input, 10 );
  currentYear = new Date().getFullYear();

  calculatedAge = currentYear - birthYear;
  if( givenAge === calculatedAge || calculatedAge - 1 === givenAge ){
    return true;
  }
  return false;
}
//use this data type whenever the validation spans more that one form field.
newRule.type = 'set'; 
newRule.guide = 'Which year were you born?';
newRule.alert = 'Please enter the correct year of birth for your age.';

customRules = { confirmAge: newRule };

$(document).ready( function(){
$('#example').livelyValidator({ debug:true, rules: customRules }); 
});
```

onValidate
==========

By default, Lively Validator will stop a form containing validation errors from being submitted, while forms with no errors will be submitted as expected. To alter this behavior, use the `onValidate` configuration option. The value of this property must be a JavaScript function. When set, Lively Validator will always stop the form from being submitted, regardless of whether it contains valid data or not. It stops form submission, then passes the validation results (true or false) to the function specified by `onValidate`. This can be useful in situations where you want to run other functions on the form's submit event, or you want to submit the form using AJAX as shown in the example below.

**Default Value:** null

**Allowed Values:** A JavaScript function.

``` html
<form id="example">
<fieldset><legend>onValidate Example</legend>
<p>Days in a Month: <input name="days" data-validate="required; number; minNumber::28; maxNumber::31" /> </p>
<fieldset>
</form>

<script type="text/javascript" >
$(document).ready( function(){
   $('#example').livelyValidator( {onValidate:sendForm} );

   function sendForm( isValid ){
       if( isValid === TRUE ){
           // submit the from using AJAX/jQuery
           $('#example').submit(); 
       }
   }
});
</script>
```

debug
=====

This is more of a development aid than a configuration option, and should be set to false in live sites. Its purpose is to alert you of any configuration errors found in either your HTML attributes or JavaScript initialization. For example, setting a form field's validation rules to both a string and a number geneartes a HTML configuration error. If `debug` is set to false, all errors are ignored and the plugin attempts to continue running the script if possible. If `debug` is set to true, the plugin will display an error message using JavaScript's `alert()` function, then throw an Exception containing the same error message. By default, the `debug` is set to false if the HTML document is accessed from the server (by checking the value of location.protocol ), and true if the HTML document as a local file.

Validation Rules
================

Validation rules specify what type of data is allowed in a form field. Lively Validator currently has over 30 different validation rules, grouped into 6 categories: all, string, number, set, date and file. A form field can only use rules within the same category, as mixing rules from different categories may not only be illogical, but also end up in a situation where the form cannot be submitted because validation always fails. The only exception is the "all" category, whose rules can be mixed with those in any other category. All available are listed below, grouped by category.

Global
------

A general category, for rules that can fit into any of the other categories.

**required** The field cannot remain empty when the form is submitted.

**min** The minimum allowed quantity. May map to either minChars, minNumber, minFileSize or minDate depending on the form inputs type.

**max** The minimum allowed quantity. May map to either maxChars, maxNumber, maxFileSize or maxDate depending on the form inputs type.

SET
---

For rules that require checking the values of more than one form field e.g. checkboxes and radio inputs.

**confirm** The field's value must match the value of the other field specified by the parameter. Both fields must belong to the same form. <span class="specs">Parameter: The HTML id of the other form field whose value is to be matched against.</span>

**requiredSet** For input fields that are either radio buttons or checkboxes. At-least one of the fields in a group must be checked.

STRING
------

For any data that represents strings and/or will be stored in a database as a string value e.g usernames & cities.

**alphabetic** All characters must either be lowercase or uppercase alphabetic letters (a-z and A-Z).

**alphanumeric** The field can only contain alphabetic characters or digits (a-z, A-Z and 0-9).

**color** The field can only have valid HTML hexadecimal color value e.g. \#ff0000.

**creditCard** The field requires a valid credit card number, in terms of length and characters. It must contain between 13 - 16 digits only. It does not test whether the credit card has expired, has enough credit or has been canceled.

**email** The field requires a valid email address, e.g. john.doe@example.com

**maxChars** The field's input character count must be equal to, or less than the size specified by the parameter. <span class="specs">Parameter: A number e.g 3, 15, 20</span> <span class="specs">Example: `maxChars::45`</span>

**minChars** The field's input character count must be equal to, or greater than the size specified by the parameter. <span class="specs">Parameter: A number e.g 300, 2</span> <span class="specs">Example: `minChars::10`</span>

**numeric** The field can only contain digits 0-9.

**tel** The field must be a valid telephone number, containing only digits, spaces and the characters + - () /

**url** The field must be a valid, absolute URL e.g. http://www.example.com

NUMBER
------

For any data that represents numbers or/and will be stored in a database a a number value e.g. money & items purchased.

**age** The field should only contain a number between 0 and 120.

**maxNumber** The field can only contain a number equal to or less than the one specified by the parameter. <span class="specs">Parameter: Any number e.g. 3000</span> <span class="specs">Example: `maxNumber::2500`</span>

**minNumber** The field can only contain a number equal to, or greater than the one specified by the parameter. <span class="specs">Parameter: Any number e.g 750</span> <span class="specs">Example: `minNumber::44`</span>

**number** The field can only contain a valid numeric value e.g 0, -20, 4.5

FILE
----

For all files, selected & uploaded using the HTML file input type.

**document** The selected file must be either a PDF or MS Word file.

**fileExtension** The selected file's extension must match any one of the values specified by the parameter. <span class="specs">Parameter: A coma separated list of allowed file extensions e.g doc, docx, pdf</span> <span class="specs">Example: `fileExtension::doc,pdf,docx`</span>

**fileMimeSubtype** The selected file's mime subtype must match any one of the subtypes specified by the parameter. When using this rule together with the plugin's optional PHP server-side validation class, please make sure that the server is correctly configured to recognize all the specified mime subtypes. This rule can only be checked on the client-side by HTML5 compatible browsers (uses the FileSystem API). <span class="specs">Parameter: A coma separated list of allowed mime subtypes e.g jpeg</span> <span class="specs">Example: `fileMimeSubtype::jpeg`</span>

**fileMimeType** The selected file's mime type must match any one of the types specified by the parameter. When using this rule together with the plugin's optional PHP server-side validation class, please make sure that the server is correctly configured to recognize all the specified mime types. This rule can only be checked on the client-side by HTML5 compatible browsers (uses the FileSystem API). <span class="specs">Parameter: A coma separated list of allowed mime types e.g image</span> <span class="specs">Example: `fileMimeType::image,text`</span>

**image** The selected file must be an image e.g jpeg, png, gif

**maxFileSize** The selected file's size must equal or be less than the value specified by the parameter. This rule can only be checked on the client-side by HTML5 compatible browsers (uses the FileSystem API). <span class="specs">Parameter: A number, representing the maximum allowed file size in kilobytes (kb) e.g. 120.</span> <span class="specs">Example: `maxFileSize::90`</span>

**minFileSize** The selected file's size must equal or be greater than the value specified by the parameter. This rule can only be checked on the client-side by HTML5 compatible browsers (uses the FileSystem API). <span class="specs">Parameter: A number, representing the maximum allowed file size in kilobytes (kb) e.g. 30.</span> <span class="specs">Example: `minFileSize::15`</span>

DATE
----

For any data meant to represent a point in time e.g years and dates.

**date** The field can only contain a valid HTML5 date value e.g. 2013-01-19

**datetime** The field can only contain a valid HTML5 datetime value e.g. e.g. 1990-12-31T23:59:60Z

**datetimeLocal** The field can only contain a valid HTML5 datetime-local value e.g. 1996-12-19T16:39:57.

**maxDate** The field can only contain a valid HTML5 date, datetime, datetime-local, month, week or time value, less than or equal to the value specified by the parameter. <span class="specs">Parameter: A valid HTML5 date, datetime, datetime-local, month, week or time string e.g. 2013-10.</span> <span class="specs">Example: `maxDate::2013-12`</span>

**minDate** The field can only contain a valid HTML5 date, datetime, datetime-local, month, week or time value, greater than or equal to the value specified by the parameter. <span class="specs">Parameter: A valid HTML5 date, datetime, datetime-local, month, week or time string e.g. 1996-12-19T16:39:57Z.</span> <span class="specs">Example: `maxDate::1996-12-19T16:39:57Z`</span>

**month** The field should only contain a valid HTML5 month value e.g. 2012-12

**time** The field can only contain a valid HTML5 time value e.g. 17:39:57

**week** The field can only contain a valid HTML5 week value e.g. 2013-W03

CSS (Styling)
=============

Lively Validator adds tooltips to form input elements and slightly changes the appearance of validated fields to indicate whether their data is valid or invalid. All this is styled using the CSS file located in **Lively-Validator/lively-validator.css**. This is the file to edit if you want to change the default appearance of Lively-Validator's tooltips, or how it css valid and invalid fields. There are just four main CSS classes that you need to pay attention to in this file:

**lv-tooltip** - The class given to all tooltips created by Lively Validator.

**lv-alert** - For tooltips displaying Alert error messages

**lv-guide** - For tooltips displaying Guide instructions

**lv-valid** - For validated form fields containing valid data

**lv-invalid** - for validated form fields containing invalid data

PHP
===

The Lively Validator jQuery plugin has a PHP twin that performs almost all the same data validation routines in the server. This optional PHP script provides an extra layer of security on the server, so you don't have to worry about sneaky users tampering with the browser and form's source code to bypass validation. The script consists of just one easy to integrate and flexible PHP class, also named LivelyValidator, located in **Lively-Validator/LivelyValidator.php**.

The class gets any posted data (from the `$_POST` and `$_FILE` arrays) and tests it against the validation rules you give it. An instance of this class will basically contain the results of the validation, grouped into 5 public objects as shown below. If any validation errors are found, the `$invalid` property will contain all the details of which form fields failed, and the rules involved. A complete, well commented example showing how to integrate this with the rest of your server-side form processing code can be found [here](#page3-3).

``` php
<?php

// contains all invalid data items, sorted by item keys then tested 
// rules: array( 'itemKey'=>array( 'ruleName 1', 'ruleName 2' .. ))
public $invalid = array();

// contains all valid data items, sorted by item keys then tested 
// rules:array( 'itemKey'=>array( 'ruleName 1', 'ruleName 2' .. ))
public $valid = array();

// contains all empty/unset data items that were not required, 
// sorted by item keys: array( 'itemKey'=>'ruleName')
public $empty = array();

// The data to be validated, as key-value pairs
public $data = array();

// The rules to validate the data against, as key-value pairs.
public $rules = array();
```
