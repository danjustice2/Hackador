const minimumQuestionNumber = 1; // The lowest number of questions available
let isStarted = false; // Flag to check if the user has started
let id; // The id of the current question
let selected = false; // Flag to check if the user has already selected an answer
const defaultButton = "#212227"; // The default color of the buttons
const wrongColor = "#B70002"; // The color of the buttons when the user gives a wrong answer
const rightColor = "#07ADE3"; // The color of the buttons when the user gives a correct answer
let json = null; // The JSON file containing the questions
const url = "questions.json" // The URL of the JSON file
let buttonTextChanged = false; // Flag to check if the text of the button has been changed
let drawnQuestion; // The question currently being displayed
const replyDebug = false; // Flag to check if the reply debugging mode is on


// Run when the document is ready
$(document).ready(function() {
    Question(); // Run the Question function
    $('#close').hide(); // Hide the close button

    // Run the Respond function with the appropriate response id when the button is clicked
    $('#response1').click(() => Respond(1));
    $('#response2').click(() => Respond(2));
    $('#response3').click(() => Respond(3));
    $('#response4').click(() => Respond(4));
  });

// Main function to handle the question display
function Question(){
      
    // Get the JSON file if json is null
    if (json == null) {
        console.log("running ajax request");
        // Make an AJAX request to get the JSON file
        $.getJSON(url, function(data) {
            UseReturnData(data); // Run the UseReturnData function to use the data
            if (json == null) {
              console.error("json is null"); // Log an error if json is still null
            }
            else {
              console.log("running json parser");
              console.log(data);
              JsonParser(json); // Run the JsonParser function to parse the JSON file
            }
          });
        maximumQuestionNumber = ($(json).find("question").length); // Set the maximum question number
    }
    // If json is not null, run the JsonParser function
    else {
        JsonParser(json);
    } 
}

// Function to close the elements
const CloseElements = () => {
  $('#reply').hide(); // Hide the reply
  $('#close').hide(); // Hide the close button
  $('#question').hide(); // Hide the question
  $('#pick').hide(); // Hide the pick button
  buttonTextChanged = true; // Set the buttonTextChanged flag to true
  $('#pick-new').show(); // Show the pick-new button
}

// Function to use the return data
const UseReturnData = data => {
    json = data; // Set the json variable to the data
}

// Function to get a random number
function Rand() {
    var randnum = Math.floor(Math.random()*(maximumQuestionNumber-minimumQuestionNumber))+minimumQuestionNumber; // Get a random number
    console.log("Getting random number " + randnum + " between " +minimumQuestionNumber+ " and " +(maximumQuestionNumber-1)); // Log the random number
    return randnum; // Return the random number
}

// Function to parse the JSON file
const JsonParser = json => {
  maximumQuestionNumber = json.length + 1; // Set the maximum question number

  // If they haven't picked yet, choose a random question
  if(!isStarted) {
    $(isStarted = true); // Set the isStarted flag to true
    id = Rand(); // Get a random ID
  }

  // If they have, keep choosing new questions until you get one that isn't the same as the last one.
  else {
    do {
      newID = Rand(); // Get a random ID
    }
    while (newID == id); // Keep looping until you get a new ID
    id = newID; // Set the ID to the new ID

    // Allow the user to select a new answer
    selected = false;

    ResetButtons(); // Run the ResetButtons function

    $("#reply-text").text(""); // Set the reply text to an empty string
    $("#correct-header").text(""); // Set the correct header to an empty string
    $("#reply").hide(); // Hide the reply
  }

  // Find the chosen question
  drawnQuestion = json[id];

  // Show the question and hide the reply if the reply debugging mode is off
  if (!replyDebug) {
    $('#question').show();
    $('#reply').hide();
  }
  // Otherwise, show the reply and hide the question
  else{
    Respond(1);
    $('#question').hide();
    $('#reply').show();
  }

  // Change the text of the button if the buttonTextChanged flag is true
  if (buttonTextChanged) {
    $('#pick').text("Jeg har allerede besvaret spørgsmålet");
    buttonTextChanged = false; // Set the buttonTextChanged flag to false
  }

  // Set the text of the body and the responses
  $("#body-text").text(drawnQuestion.bodytext);
  for(let i = 1; i<5; i++){
    r = FetchResponse(i);

    if (r) {
      $('#response' +i).text(r);
      $('#response' +i).show();
    }
    else {
      $('#response' +i).hide();
      $("#response" +i).text == ""
    }
  }
}

// Function to reset the buttons
function ResetButtons(){
    for(let i = 1; i<5; i++){
        $("#response" +i).text("");
    }
}



// Function to respond
function Respond(id){
    // Only execute if the user hasn't already selected an answer to this question.
    if (!selected){ 

        selected = true; // Set the selected flag to true

        // Set the reply text
        $("#reply-text").text(FetchReply(id));

        // Check if the answer is correct
        if (CheckCorrect(id) == "false"){ 
            // Change the css and the text if the answer is wrong
            $('#correct-header').css('color', wrongColor);
            $('#correct-header').text("Forkert");
            $('#correct-img').attr("src", "assets/RedLock.svg");
            $('#action-queue').text("Fjern en sikkerhedsbrik.");
        }
        // Change the css and the text if the answer is right
        else if (correct == "true") {
            $('#correct-header').css('color', rightColor);
            $('#correct-header').text("Korrekt");
            $('#correct-img').attr("src", "assets/BlueLock.svg");
            $('#action-queue').text("Du må give turen videre til den næste spiller.");
        }
        // Log an error if the correct value is invalid
        else {console.error("Invalid value for " +responsevalue+ ": " +correct);}

        // Show the reply and the close button
        $('#reply').show();
        $('#close').show();

        // Hide the question and the pick button
        $('#question').hide();
        $('#pick').hide();
        $('#pick-new').hide();
    }
}

// Function to check if the answer is correct
function CheckCorrect(id){

    // Create an array of the correct values
    var corrects = [
        drawnQuestion.responses.response1.correct,
        drawnQuestion.responses.response2.correct,
    ];

    // Push the correct value for response 3 if it exists
    if ("response3" in drawnQuestion.responses) {
        corrects.push(drawnQuestion.responses.response3.correct);
    }

    // Push the correct value for response 4 if it exists
    if ("response4" in drawnQuestion.responses) {
        corrects.push(drawnQuestion.responses.response4.correct);
    }

    // Get the correct value for the specified id
    correct = corrects[id - 1];

    // Return the correct value, or log an error if it is false
    if (correct){
        return correct;
    }
    else {
        console.log("Error: Value 'correct' is false.")
    }
    
}

// Function to get the reply for the specified response
function FetchReply(id){
    // Create an array of the reply data
    var replies = [
        drawnQuestion.responses.response1.reply,
        drawnQuestion.responses.response2.reply
    ];

    // Push the reply data for response 3 if it exists
    if ("response3" in drawnQuestion.responses) {
        replies.push(drawnQuestion.responses.response3.reply);
    }

    // Push the reply data for response 4 if it exists
    if ("response4" in drawnQuestion.responses) {
        replies.push(drawnQuestion.responses.response4.reply);
    }
    
    // Return the reply data for the specified id, or null if it is undefined
    return replies[id - 1] || null;
}

// Function to get the response for the specified response
function FetchResponse(id) {
    // Create an array of the response data
    var responses = [
      drawnQuestion.responses.response1.text,
      drawnQuestion.responses.response2.text
    ];

    // Push the response data for response 3 if it exists
    if ("response3" in drawnQuestion.responses) {
        responses.push(drawnQuestion.responses.response3.text);
    }

    // Push the response data for response 4 if it exists
    if ("response4" in drawnQuestion.responses) {
        responses.push(drawnQuestion.responses.response4.text);
    }
  
    // Return the response data for the specified id, or null if it is undefined
    return responses[id - 1] || null;
  }

// Function to run when response 1 is clicked
function Response1() {
    Respond(1);
}

// Function to run when response 2 is clicked
function Response2() {
    Respond(2);
}

// Function to run when response 3 is clicked
function Response3(){
    Respond(3);
}

// Function to run when response 4 is clicked
function Response4(){
    Respond(4);
}

// Function to convert JSON to string
function JsonToString(jsonData) { 

    // Declare variable to store the string
    let jsonString;

    // IE
    if (window.ActiveXObject){
        jsonString = jsonData.json;
    }
    // code for Mozilla, Firefox, Opera, etc.
    else{
        jsonString = (new jsonSerializer()).serializeToString(jsonData);
    }

    // Return the JSON string
    return jsonString;
}