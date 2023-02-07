var id = 1;

question();

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

function jsonParser(json) {
    maximumQuestionNumber = json.length + 1;
    

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
