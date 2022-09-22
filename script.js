var lower = 1;
var isStarted = false;
var id;
var response1correct;
var response2correct;
var response1reply;
var response2reply;
var selected = false;
var defaultButton = "#212227";
var wrongColor = "red";
var rightColor = "#36ff40";
    
$( document ).ready(function() {
    /*$('#question').hide();
    $('#reply').hide();*/
    //console.log("Hid question element");
    question();
    buttonColor("#response1", defaultButton);
    buttonColor("#response2", defaultButton);
    buttonColor("#response3", defaultButton);
    buttonColor("#response4", defaultButton);
    buttonColor("#pick", defaultButton);
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

function buttonColor(button, color) {
    $(button).css("background-color",color);
    
}


function xmlParser(xml) {
    
    //console.log("starting xmlParser")
    xmlDoc = $.parseXML( xmlToString(xml) );
    $xml = $(xmlDoc),

    upper = ($(xml).find("question").length +1);

    if(isStarted == false) {
        $(isStarted = true);
        id = rand();
    }
    else {
        do {
            newID = rand();
        }
        while (newID == id);
        id = newID;
        selected = false;
        buttonColor("#response1", defaultButton);
        buttonColor("#response2", defaultButton);
        $("#reply-text").text("");
        $("#correct-header").text("");
        $("#reply").hide();
    }
    $question = $xml.find('question[id="' + id + '"]')

    $bodytext = $question.find("body-text");

    $response1 = $question.find("response1").find("text");
    $response2 = $question.find("response2").find("text");
    if($question.find("response3")){
        $response3 = $question.find("response3").find("text");
    }
    if($question)
    
    /*response1correct = $question.find("response1").attr("correct");
    response2correct = $question.find("response2").attr("correct");
    response3correct = $question.find("response3").attr("correct");
    response4correct = $question.find("response4").attr("correct");
    response1reply = $question.find("response1").find("reply");
    response2reply = $question.find("response2").find("reply");*/


    $("#body-text").text($bodytext.text());
    $("#response1").text($response1.text());
    $("#response2").text($response2.text());
    $("#response3").text($response1.text());
    $("#response4").text($response2.text());

}


var response = (function response(id){
    var responsevalue
    if (!selected){ // Only execute if the user hasn't already selected an answer to this question.

    // Check the response id. This should either be 1 or 2.
        if (id == 1) {responsevalue = "response1"; correct = response1correct; reply = response1reply;}
        else if (id == 2) {responsevalue = "response2"; correct = response2correct; reply = response2reply;}
        else {console.error("Invalid value for id: " +id);}

        selected = true; // Indicate that the user has selected so they can't select again

        $('#reply').show();
        $("#reply-text").text(reply.text());

        // Set the button either to red or green depending on correctness
        if (correct == "false"){ 
            buttonColor('#' +responsevalue, wrongColor);
            $('#correct-header').text("Forkert");
        }
        else if (correct == "true") {
            buttonColor('#' +responsevalue, rightColor);
            $('#correct-header').text("Korrekt");
        }
        else {console.error("Invalid value for " +responsevalue+ ": " +correct);}
    }
})

function response1() {
    response(1);
}

function response2() {
    response(2);
}

function response3(){
    response(3);
}

function response4(){
    response(4);
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