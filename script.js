var lower = 1;
var isStarted = false;
var id;
var selected = false;
var defaultButton = "#212227";
var wrongColor = "#B70002";
var rightColor = "#07ADE3";

var replyDebug = false;
    
$( document ).ready(function() {

    
    
    
    //console.log("Hid question element");
    question();
    resetButtons();
});

function question(){
    
    path = "questions.xml"
    
    $.ajax({
        type: "GET",
        url: path,
        dataType: "xml",
        success: xmlParser});
    
};

var rand = (function rand() {
    var randnum = Math.floor(Math.random()*(upper-lower))+lower
    return randnum;
    console.log("Getting random number " + randnum)
});


function xmlParser(xml) {
    
    xmlDoc = $.parseXML( xmlToString(xml) );
    $xml = $(xmlDoc),

    upper = ($(xml).find("question").length +1);

    // If they haven't picked yet, choose a random question
    if(isStarted == false) {
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
    $question = $xml.find('question[id="' + id + '"]')

    if (!replyDebug) {
        $('#question').show();
        $('#reply').hide();
    }
    else{
        respond(1);
        $('#question').hide();
        $('#reply').show();
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
        $('#reply').show();
        $('#question').hide();

        if (checkCorrect(id) == "false"){ 
            $('#correct-header').css('color', wrongColor);
            $('#correct-header').text("Forkert");
            $('#correct-img').attr("src", "assets/RedLock.svg");
        }
        else if (correct == "true") {
            $('#correct-header').css('color', rightColor);
            $('#correct-header').text("Korrekt");
            $('#correct-img').attr("src", "assets/BlueLock.svg");
        }
        else {console.error("Invalid value for " +responsevalue+ ": " +correct);}
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