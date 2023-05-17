// Tutorial: https://developers.google.com/apps-script/reference/forms/form-response
function onFormSubmit() {
  // Get the form data
  var editformID = '1jLXafBM_Ku464dm13FpLCSZXT4XpipNvbP9r_VMNfCs'; //formID in 'edit' version
  var form = FormApp.openById(editformID);
  var formResponses = form.getResponses();
  var latestResponse = formResponses[formResponses.length - 1];
  var response = latestResponse.getItemResponses();
  var message = '';
  for (var i = 0; i < response.length; i++) {
    var question = response[i].getItem().getTitle();
    var answer = response[i].getResponse();
    if(question === 'Employee ID' || question === 'Team name') {
      message += '# ' + question + ': ' + answer + '\n\n';
    } else {
      message += '# ' + question + '\n' + answer + '\n\n';
    }
      
    

  }
  
  // Find @BotFather => Create and add bot token to target Telegram group
  var YOUR_BOT_TOKEN = "6221154703:AAHX9uNe1MZkDVPWUn1tusm-o6aUPUDhJ2c"; 
  // Find @RawDataBot and add it to your target group
  var YOUR_CHAT_ID = "-815607985";
  // var telegramUrl = 'https://api.telegram.org/bot<YOUR_BOT_TOKEN>/sendMessage?chat_id=<YOUR_CHAT_ID>&text=' + encodeURIComponent(message);
  var telegramUrl = 'https://api.telegram.org/bot'+ YOUR_BOT_TOKEN 
                    + '/sendMessage?chat_id=' + YOUR_CHAT_ID
                    + '&text=' + encodeURIComponent(message);
  
  // Go to Trigger feature, click on Add Trigger, select "OnForm Submit"
  UrlFetchApp.fetch(telegramUrl);
}
