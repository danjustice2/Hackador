<?php
$questionid = $_POST['id'];
$bodytext = $_POST['bodytext'];
$response1text = $_POST['response1-text'];
$response1correct = $_POST['response1-correct'];
$response1reply = $_POST['response1-reply'];
$response2text = $_POST['response2-text'];
$response2correct = $_POST['response2-correct'];
$response2reply = $_POST['response2-reply'];
$response3text = $_POST['response3-text'];
$response3correct = $_POST['response3-correct'];
$response3reply = $_POST['response3-reply'];
$response4text = $_POST['response4-text'];
$response4correct = $_POST['response4-correct'];
$response4reply = $_POST['response4-reply'];

$file = 'questions.json';

$jsonString = '{
  "@id": "' . $questionid . '",
  "bodytext": "' . $bodytext . '",
  "responses": {
    "response1": {
      "correct": "' . $response1correct . '",
      "text": "' . $response1text . '",
      "reply": "' . $response1reply . '"
    }';

if(!empty($response2text)) {
  $jsonString .= ',
    "response2": {
      "correct": "' . $response2correct . '",
      "text": "' . $response2text . '",
      "reply": "' . $response2reply . '"
    }';
}

if(!empty($response3text)) {
  $jsonString .= ',
    "response3": {
      "correct": "' . $response3correct . '",
      "text": "' . $response3text . '",
      "reply": "' . $response3reply . '"
    }';
}

if(!empty($response4text)) {
  $jsonString .= ',
    "response4": {
      "correct": "' . $response4correct . '",
      "text": "' . $response4text . '",
      "reply": "' . $response4reply . '"
    }';
}

$jsonString .= '
  }
},
';

file_put_contents($file, $jsonString, FILE_APPEND);

?>