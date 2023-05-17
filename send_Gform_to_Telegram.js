// Tutorial: https://developers.google.com/apps-script/reference/forms/form-response
function onFormSubmit() {
  /** This block to find the hidden texts */
  // Create a variable to store the sheetID.
  var sheetID = '1-mqQBsChLSapb5mF1WJWWuuTSA_dTC87_yAS8BAi6NE';
  // Use the Google Sheets API to open the spreadsheet with the sheetID.
  var spreadsheet = SpreadsheetApp.openById(sheetID);
  // Get the sheet with the sheetID from the spreadsheet.
  var sheet = spreadsheet.getSheetByName('texts');
  // Get the text from the cells in the sheet.
  var text = sheet.getRange('A1:B3').getValues();
  // Store the text in variables.
  var variable1 = text[0][1];
  console.log(variable1);
  var variable2 = text[1][1];
  var variable3 = text[2][1];

  //Copy ID of Google Form in 'edit' version
  var editFORM_ID = variable1;
  // Find @BotFather => Create and add bot token to target Telegram group
  var YOUR_BOT_TOKEN = variable2;
  // Find @RawDataBot and add it to your target group
  var YOUR_CHAT_ID = variable3;
  
  /** Work with Google FORM and Telegram API */
  // Get the form data 
  var form = FormApp.openById(editFORM_ID);
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
