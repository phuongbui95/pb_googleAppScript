//------- step 1 ------//
function create_checked_data() {
  // select Spreadsheet to work
  var spreadsheet = SpreadsheetApp.getActive();
  
  // pick sheet named "raw_data" in selected spreadsheet
  var sheetRaw = spreadsheet.getSheetByName('raw_data');
  
  // create new sheet with name and paste data to this sheet
  if(!spreadsheet.getSheetByName("checked_data")) {
    spreadsheet.insertSheet().setName("checked_data");
  };
  var sheetChecked = spreadsheet.getSheetByName("checked_data");
  var rawRange = sheetRaw.getDataRange().getValues();
  var checkedRange = sheetChecked.getRange(1, 1, rawRange.length, rawRange[0].length);
  checkedRange.setValues(rawRange);
  

  // hightlight the heading row of dataset
  var lastColumnOfA1Row = sheetChecked.getRange("A1").getLastColumn();
  sheetChecked.getRange("A1:"+lastColumnOfA1Row).setBackground('#b7b7b7');

  // Hide the gridlines in current sheet
  spreadsheet.getActiveSheet().setHiddenGridlines(true);

  return sheetChecked.getDataRange();
};

//------- step 2 ------//
function highlight_errors(checking_range) {
  // Loop through each cell and check if it is empty or an error.
  for (var i = 0; i < checking_range.getNumCells(); i++) {
    var cell = checking_range.getCell(i);
    var value = cell.getValue();

    // If the cell is empty, highlight it yellow.
    if (value == null || value == '') {
      // cell.setBackground('yellow');
      console.log(value);
    }

    // If the cell is an error, highlight it red.
    else if (value === undefined) {
      // cell.setBackground('red');
      console.log(value);
    }
  }
  return ;//checked_data
};

//------- step 3 ------//
function create_summary(checked_range) {
  
  return;
};

//------- step 4 ------//
function create_custom_menu() {
  var checking_range = create_checked_data();
  var checked_range = highlight_errors(checking_range);
  // create_summary(checked_range);
  return;
};




