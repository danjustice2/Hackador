const minimumQuestionNumber = 1;
let isStarted = false;
let id;
let selected = false;
const defaultButton = "#212227";
const wrongColor = "#B70002";
const rightColor = "#07ADE3";
let json = null;
const url = "questions.json"
let buttonTextChanged = false;
let drawnQuestion;
const replyDebug = false;
    


$(document).ready(function() {
    Question();
    $('#close').hide();
    $('#response1').click(() => Respond(1));
    $('#response2').click(() => Respond(2));
    $('#response3').click(() => Respond(3));
    $('#response4').click(() => Respond(4));
  });

function Question(){
      
    if (json == null) {
        console.log("running ajax request");

        $.getJSON(url, function(data) {
            UseReturnData(data);
            if (json == null) {
              console.error("json is null");
            }
            else {
              console.log("running json parser");
              console.log(data);
              JsonParser(json);
            }
          });

        maximumQuestionNumber = ($(json).find("question").length);
    }
    else {
        JsonParser(json);
    } 
}

const CloseElements = () => {
  $('#reply').hide();
  $('#close').hide();
  $('#question').hide();
  $('#pick').hide();
  buttonTextChanged = true;
  $('#pick-new').show();
}

const UseReturnData = data => {
    json = data;
}

function Rand() {
    var randnum = Math.floor(Math.random()*(maximumQuestionNumber-minimumQuestionNumber))+minimumQuestionNumber;
    console.log("Getting random number " + randnum + " between " +minimumQuestionNumber+ " and " +(maximumQuestionNumber-1));
    return randnum;
}

const JsonParser = json => {
  maximumQuestionNumber = json.length + 1;

  // If they haven't picked yet, choose a random question
  if(!isStarted) {
    $(isStarted = true);
    id = Rand();
  }

  // If they have, keep choosing new questions until you get one that isn't the same as the last one.
  else {
    do {
      newID = Rand();
    }
    while (newID == id);
    id = newID;

    // Allow the user to select a new answer
    selected = false;

    ResetButtons();

    $("#reply-text").text("");
    $("#correct-header").text("");
    $("#reply").hide();
  }

  // Find the chosen question
  drawnQuestion = json[id];

  if (!replyDebug) {
    $('#question').show();
    $('#reply').hide();
  }
  else{
    Respond(1);
    $('#question').hide();
    $('#reply').show();
  }

  if (buttonTextChanged) {
    $('#pick').text("Jeg har allerede besvaret spørgsmålet");
    buttonTextChanged = false;
  }

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

function ResetButtons(){
    for(let i = 1; i<5; i++){
        $("#response" +i).text("");
    }
}



function Respond(id){
    if (!selected){ // Only execute if the user hasn't already selected an answer to this question.

        selected = true; // Indicate that the user has selected so they can't select again

        $("#reply-text").text(FetchReply(id));

        if (CheckCorrect(id) == "false"){ 
            $('#correct-header').css('color', wrongColor);
            $('#correct-header').text("Forkert");
            $('#correct-img').attr("src", "assets/RedLock.svg");
            $('#action-queue').text("Fjern en sikkerhedsbrik.");
        }
        else if (correct == "true") {
            $('#correct-header').css('color', rightColor);
            $('#correct-header').text("Korrekt");
            $('#correct-img').attr("src", "assets/BlueLock.svg");
            $('#action-queue').text("Du må give turen videre til den næste spiller.");
        }
        else {console.error("Invalid value for " +responsevalue+ ": " +correct);}

        $('#reply').show();
        $('#close').show();

        $('#question').hide();
        $('#pick').hide();
        $('#pick-new').hide();
    }
}

function CheckCorrect(id){

    var corrects = [
        drawnQuestion.responses.response1.correct,
        drawnQuestion.responses.response2.correct,
    ];

    if ("response3" in drawnQuestion.responses) {
        corrects.push(drawnQuestion.responses.response3.correct);
    }

    if ("response4" in drawnQuestion.responses) {
        corrects.push(drawnQuestion.responses.response4.correct);
    }

    correct = corrects[id - 1];
    if (correct){
        return correct;
    }
    else {
        console.log("Error: Value 'correct' is false.")
    }
    
}

function FetchReply(id){
    // create an array of response data
    var replies = [
        drawnQuestion.responses.response1.reply,
        drawnQuestion.responses.response2.reply
    ];

    if ("response3" in drawnQuestion.responses) {
        replies.push(drawnQuestion.responses.response3.reply);
    }

    if ("response4" in drawnQuestion.responses) {
        replies.push(drawnQuestion.responses.response4.reply);
    }
    
      // return the response data for the specified id, or null if it is undefined
      return replies[id - 1] || null;
}

function FetchResponse(id) {
    // create an array of response data
    var responses = [
      drawnQuestion.responses.response1.text,
      drawnQuestion.responses.response2.text
    ];

    if ("response3" in drawnQuestion.responses) {
        responses.push(drawnQuestion.responses.response3.text);
    }

    if ("response4" in drawnQuestion.responses) {
        responses.push(drawnQuestion.responses.response4.text);
    }
  
    // return the response data for the specified id, or null if it is undefined
    return responses[id - 1] || null;
  }

function Response1() {
    Respond(1);
}

function Response2() {
    Respond(2);
}

function Response3(){
    Respond(3);
}

function Response4(){
    Respond(4);
}

function JsonToString(jsonData) { 

    var jsonString;
    //IE
    if (window.ActiveXObject){
        jsonString = jsonData.json;
    }
    // code for Mozilla, Firefox, Opera, etc.
    else{
        jsonString = (new jsonSerializer()).serializeToString(jsonData);
    }
    return jsonString;
}   