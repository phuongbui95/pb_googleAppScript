// Tutorial: https://developers.google.com/apps-script/reference/forms/form-response
function onFormSubmit() {
  //Copy ID of Google Form in 'edit' version
  var editformID = '<Your form id>';
  // Find @BotFather => Create and add bot token to target Telegram group
  var YOUR_BOT_TOKEN = 'your token';
  // Find @RawDataBot and add it to your target group
  var YOUR_CHAT_ID = 'your chat id';
  
  // Get the form data 
  var form = FormApp.openById(editformID);
  var formResponses = form.getResponses(); // all responses are submitted
  var latestResponse = formResponses[formResponses.length - 1]; //only the latest one
  var responseTimestamp = latestResponse.getTimestamp();
  var response = latestResponse.getItemResponses();
  var message = '# Sent time: ' + responseTimestamp + '\n\n'; // Add timestap at the beginning
  for (var i = 0; i < response.length; i++) {
    var question = response[i].getItem().getTitle();
    var answer = response[i].getResponse();

    if(question === 'Employee ID' || question === 'Team name') {
      message += '# ' + question + ': ' + answer + '\n\n';
    } else {
      message += '# ' + question + '\n' + answer + '\n\n';
    }
  }
  
  // var telegramUrl = 'https://api.telegram.org/bot<YOUR_BOT_TOKEN>/sendMessage?chat_id=<YOUR_CHAT_ID>&text=' + encodeURIComponent(message);
  var telegramUrl = 'https://api.telegram.org/bot'+ YOUR_BOT_TOKEN 
                    + '/sendMessage?chat_id=' + YOUR_CHAT_ID
                    + '&text=' + encodeURIComponent(message);
  
  UrlFetchApp.fetch(telegramUrl);

  /**
   * Important step: Go to Triggers ('clock icon' on the left), click on Add Trigger, select "OnForm Submit"
   */
}
