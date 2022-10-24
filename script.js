var lower = 1;
var isStarted = false;
var id;
var selected = false;
var defaultButton = "#212227";
var wrongColor = "#B70002";
var rightColor = "#07ADE3";
var xml = null;
var path = "questions.xml"
var buttonTextChanged = false;

var replyDebug = false;
    
question();

function question(){
      
    if (xml == null) {
        console.log("running ajax request");
        $.ajax({
            'type': "GET",
            'url': path,
            'dataType': "xml",
            'success': function(data) { 
                useReturnData(data); 
                if (xml == null) {
                    console.error("xml is null");
                }
                else {
                    console.log("running xml parser");
                    xmlParser(xml);
                }
            }
        });

        upper = ($(xml).find("question").length);
    }
    else {
        xmlParser(xml);
    } 
}

function luk(){

    $('#reply').hide();
    $('#close').hide();
    $('#question').hide();
    $('#pick').text("Træk nyt spørgsmål");
    buttonTextChanged = true;
    $('#pick').show();
}

function useReturnData(data){
    xml = data;
    console.log(xml);
}

function rand() {
    var randnum = Math.floor(Math.random()*(upper-lower))+lower;
    console.log("Getting random number " + randnum + " between " +lower+ " and " +(upper-1));
    return randnum;
}


function xmlParser(xml) {

     
    upper = ($(xml).find("question").length +1);

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
    $question = $(xml).find('question[id="' + id + '"]')

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

    $("#body-text").text($question.find("body-text").text());
    for(let i = 1; i<5; i++){
        r = fetchResponse(i)

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
    correct = $question.find("response" +id).attr("correct");
    if (correct){
        return correct;
    }
    else {
        console.log("Error: Value 'correct' is false.")
    }
    
}

function fetchReply(id){
    reply = $question.find("response" +id).find("reply").text();
    if (reply){
        return reply;
    }
    else  {
        console.log("Error: Value 'reply' is false.")
    }
}

function fetchResponse(id){
    response = $question.find("response" +id).find("text").text();
    if (response){
        return response;
    }
    else  {
        return false;
    }
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

function xmlToString(xmlData) { 

    var xmlString;
    //IE
    if (window.ActiveXObject){
        xmlString = xmlData.xml;
    }
    // code for Mozilla, Firefox, Opera, etc.
    else{
        xmlString = (new XMLSerializer()).serializeToString(xmlData);
    }
    return xmlString;
}   