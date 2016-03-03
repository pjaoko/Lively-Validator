<?php

$formProcessed = false; // Will be set to true once the form is posted with valid data
$formMsg = ''; // Instructions to be shown at the top of the form. Different messages will be set for when the form is first sent, and when its resent because it contains invalid data

// All the validation rules are set here. Each item in the $rules array targets a form input field with the same name.
$rules = array(
   'name'=> 'required; alphanumeric',
   'email'=>'required; email',
   'phone'=>'tel',
   'age'=>  'required; number; minNumber::18',
   'tc'=>   'required'
   );
   
// Error messages. Each item in the $rules array targets a form input field with the same name.
$errorMessages = array(
   'name'=> 'Name: Please provide a valid name.',
   'email'=>'Email: Please provide a valid email address.',
   'phone'=>'Phone: Please provide a valid telephone/mobile number.',
   'age'=>  'Age: Please declare your age. You must be 18 and over to register.',
   'tc'=>   'Terms & Conditions: You must agree to our Terms of Service to register.'
   );

if( $_SERVER['REQUEST_METHOD'] === 'POST' ){ 
//the form has been posted, validate and process its contents
require('../Lively-Validator/LivelyValidator.php'); //load the Lively Validator file

   $validator = new LivelyValidator($rules); // Create a validation object, which validates all data and saves the results
    
   if( count($validator->invalid) > 0 ){ 
   // If the $validator's invalid property has one or more items, then some of the data submitted is invalid. 
   // Further form proccessing is stopped, and we now generate an error message based on errors that were reported.
      
      $errors = array_keys($validator->invalid);
      $formMsg .= 'The following errors were found while processing your form. Please correct them before resubmitting the form.';
      $formMsg .= '<ul class="error">';
      foreach( $errors as $name ){
         $formMsg .= '<li>'.$errorMessages[$name].'</li>';
         $_POST[$name] = '';
      }
      $formMsg .= '</ul>';   
   
      $formProcessed = false;
   } else{
   // If the $validator's invalid property is empty, then all submitted data is valid. Continue processing the form.
      $formProcessed = true;
      
      // The rest of your forms processing code goes here ...      
   }   
   
}else {
   $formMsg = '<p>Please complete & send this form to join us today!!</p>';   
}

?>

<!doctype html>
<html lang="en">
<head>
   <meta charset="utf-8" />
   <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
   <meta name="viewport" content="width=device-width, minimum-scale=1.0, maximum-scale=1.0" />
   <title>Lively Validator :: Example 1</title>
   <link rel="stylesheet" href="../help/styles/normalize.css" />
   <link rel="stylesheet" href="../Lively-Validator/lively-validator.css" />
   <link rel="stylesheet" href="examples.css" />
   <script type="text/javascript" src="../Lively-Validator/jquery-1.8.0.min.js"></script>
   <script type="text/javascript" src="../Lively-Validator/livelyValidator.js"></script>
   <script type="text/javascript" >
   $(document).ready( function(){
      $('#example1').livelyValidator({debug:true});
      $(':input').css( 'autocomplete', 'off' );   
   });
   </script>
</head>
<body>
<?php 
   if( !$formProcessed ){
      $name = (isset($_POST['name']))? $_POST['name'] : '';
      $email = (isset($_POST['email']))? $_POST['email'] : '';
      $phone = (isset($_POST['phone']))? $_POST['phone'] : '';
      $age = (isset($_POST['age']))? $_POST['age'] : '';
      $tc = (isset($_POST['tc']))? $_POST['tc'] : '';
?>
   <form method="post" id="example1">
      <fieldset>
         <legend>Registration Form</legend>
         <p class='guide'><?php echo $formMsg; ?></p>
         <p><b>Name:</b> <input type="text" name="name" value="<?php echo $name; ?>" data-validate="<?php echo $rules['name']; ?>" /><i /></p>
         <p><b>Email:</b> <input type="text" name="email" value="<?php echo $email; ?>" data-validate="<?php echo $rules['email']; ?>" /></p>
         <p><b>Phone:</b> <input type="text" name="phone" value="<?php echo $phone; ?>" data-validate="<?php echo $rules['phone']; ?>" /></p>
         <p><b>Age:</b> <input type="text" name="age"  value="<?php echo $age; ?>" data-validate="<?php echo $rules['age']; ?>" /></p>
         <p><b>Terms & Conditions:</b> 
            <input type="checkbox" value="accept" name="tc"  value="<?php echo $tc; ?>" data-validate="<?php echo $rules['tc']; ?>" data-alert="<?php echo $errorMessages['tc']; ?>" />
         </p>
         <p><input type="submit" name="send" value="Send" /></p>
      </fieldset>
   </form>
<?php
   }else {
?>
   <p>Congratulatons! You have been sucessfully registered!</p>
<?php
   }
?>
</body>
</html>