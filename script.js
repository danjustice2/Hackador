var minimumQuestionNumber = 1;
var isStarted = false;
var id;
var selected = false;
var defaultButton = "#212227";
var wrongColor = "#B70002";
var rightColor = "#07ADE3";
var json = null;
var url = "questions.json"
var buttonTextChanged = false;
var drawnQuestion;

var replyDebug = false;
    

question();



$(document).ready(function() {
    $('#close').hide();
    $('#response1').click(function() {
      respond(1);
    });
  
    $('#response2').click(function() {
      respond(2);
    });
  
    $('#response3').click(function() {
      respond(3);
    });
  
    $('#response4').click(function() {
      respond(4);
    });
  });

function question(){
      
    if (json == null) {
        console.log("running ajax request");

        $.getJSON(url, function(data) {
            useReturnData(data);
            if (json == null) {
              console.error("json is null");
            }
            else {
              console.log("running json parser");
              console.log(data);
              jsonParser(json);
            }
          });

        maximumQuestionNumber = ($(json).find("question").length);
    }
    else {
        jsonParser(json);
    } 
}

function closeElements(){

    $('#reply').hide();
    $('#close').hide();
    $('#question').hide();
    $('#pick').text("Træk nyt spørgsmål");
    buttonTextChanged = true;
    $('#pick').show();
}

function useReturnData(data){
    json = data;
}

function rand() {
    var randnum = Math.floor(Math.random()*(maximumQuestionNumber-minimumQuestionNumber))+minimumQuestionNumber;
    console.log("Getting random number " + randnum + " between " +minimumQuestionNumber+ " and " +(maximumQuestionNumber-1));
    return randnum;
}

function jsonParser(json) {
  maximumQuestionNumber = json.length + 1;

  // If they haven't picked yet, choose a random question
  if(!isStarted) {
    $(isStarted = true);
    id = rand();
  }

  // If they have, keep choosing new questions until you get one that isn't the same as the last one.
  else {
    do {
      newID = rand();
    }
    while (newID == id);
    id = newID;

    // Allow the user to select a new answer
    selected = false;

    resetButtons();

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
    respond(1);
    $('#question').hide();
    $('#reply').show();
  }

  if (buttonTextChanged) {
    $('#pick').text("Jeg har allerede besvaret spørgsmålet");
    buttonTextChanged = false;
  }

  $("#body-text").text(drawnQuestion.bodytext);
  for(let i = 1; i<5; i++){
    r = fetchResponse(i);

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

function resetButtons(){
    for(let i = 1; i<5; i++){
        $("#response" +i).text("");
    }
}



function respond(id){
    if (!selected){ // Only execute if the user hasn't already selected an answer to this question.

        selected = true; // Indicate that the user has selected so they can't select again

        $("#reply-text").text(fetchReply(id));

        if (checkCorrect(id) == "false"){ 
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
    }
}

function checkCorrect(id){

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

function fetchReply(id){
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

function fetchResponse(id) {
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

function response1() {
    respond(1);
}

function response2() {
    respond(2);
}

function response3(){
    respond(3);
}

function response4(){
    respond(4);
}

function jsonToString(jsonData) { 

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