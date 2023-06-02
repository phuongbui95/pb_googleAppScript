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

  return checkedRange;
};

//------- step 2 ------//
//Minor
function columnNumToColumnIndex(columnNum) {  
  var letter = "";
  if(columnNum<=25) {
    letter = String.fromCharCode(columnNum + 65);
  } else {
    var remainder = columnNum % 25;
    letter = String.fromCharCode(columnNum - remainder + 65) + String.fromCharCode(remainder + 65);
  }
  
  return letter;
}
//Major
function highlight_errors(checkedRange) {
  var checkedDataSheet = SpreadsheetApp.getActive().getSheetByName('checked_data');
  var cells = checkedRange.getValues(); 
  var numRowValue = cells.length;
  var numColumnValue = cells[0].length;

  var emptyCells = [];
  var errorCells = [];
  var errorTypes = [
    //'#NULL!',
    '#DIV/0!',
    '#VALUE!',
    '#REF!',
    '#NAME?',
    '#NUM!',
    '#N/A'
  ];

  // Loop through the range's values
  for (var i = 0; i < cells.length; i++) {
    for (var j = 0; j < cells[i].length; j++) {
      var currentCell = cells[i][j];
      if (currentCell === '#NULL!' || currentCell === '') {
        var columnIndex = columnNumToColumnIndex(j);
        var rowIndex = String(i+1);
        checkedDataSheet.getRange(columnIndex+rowIndex).setBackground('yellow');
        
        emptyCells.push(columnIndex+rowIndex);
      } else if (currentCell instanceof Error) { //Use this line if data is not string
        var columnIndex = columnNumToColumnIndex(j);
        var rowIndex = String(i+1);
        checkedDataSheet.getRange(columnIndex+rowIndex).setBackground('pink');
        
        errorCells.push(columnIndex+rowIndex);
      } else if (errorTypes.indexOf(currentCell) !== -1) { //Use this line if data is string
        var columnIndex = columnNumToColumnIndex(j);
        var rowIndex = String(i+1);
        checkedDataSheet.getRange(columnIndex+rowIndex).setBackground('pink');
        errorCells.push(columnIndex+rowIndex);
      } else {
        continue;
      }
    }
  }
  
  // Logger.log('Number of empty cells: ' + emptyCells.length);
  // Logger.log('Number of error cells: ' + errorCells.length);
  
  var summary = [numRowValue, numColumnValue, emptyCells, errorCells, checkedDataSheet];
  return summary;
};


//------- step 3 ------//
//Minor 1
function countValuesInColumns(array) {
  // Create a key-value object to store the number of values in each column.
  var columnCounts = {};

  // Iterate through the array.
  for (var i = 0; i < array.length; i++) {
    // Get the column name
    var columnName = "";
    if(/^[a-zA-Z]$/.test(array[i].substring(1,2))) { //check whether second letter of array[i] is alphabetical
      columnName = array[i].substring(0,2);
    } else {
      columnName = array[i].substring(0,1);
    }
    
    // If the column name is not already in the object, add it with a count of 1.
    if (columnCounts[columnName] === undefined) {
      columnCounts[columnName] = 1;
    } else {
      // Otherwise, increment the count.
      columnCounts[columnName]++;
    }
  }

  return columnCounts;
}
// Minor 2
function columnNameErrorCounts(array, inputColumnName, inputColumnCount, startingRow, fromDataSheet, toDataSheet) {
  var columnCounts = countValuesInColumns(array);
  var columnCountsLength =  Object.keys(columnCounts).length;
  for (var i=0; i<columnCountsLength; i++) {
    var key = Object.keys(columnCounts)[i]; //string
    var value = Object.values(columnCounts)[i]; //number
    var columnName = fromDataSheet.getRange(key+"1").getValue();
    // set value to report
    toDataSheet.getRange(inputColumnName+String(startingRow+i)).setValue(columnName);
    toDataSheet.getRange(inputColumnCount+String(startingRow+i)).setValue(value);
  };
  return;
}
// Major
function create_report(summary) {
  // Create a new sheet => set name: report
  var spreadsheet = SpreadsheetApp.getActive();
  if(!spreadsheet.getSheetByName("report")) {
    spreadsheet.insertSheet().setName("report");
  };
  var reportSheet = spreadsheet.getSheetByName("report");

  //--- report sheet ---//
  // #Rows
  reportSheet.getRange("B2").setValue("Num of Rows");
  reportSheet.getRange("C2").setValue(summary[0]);
  // #Columns
  reportSheet.getRange("B3").setValue("Num of Columns");
  reportSheet.getRange("C3").setValue(summary[1]);
  // #Missing data
  var missingDataArray = summary[2];
  reportSheet.getRange("B4").setValue("Missing data");
  reportSheet.getRange("C4").setValue(missingDataArray.length);
  // #Error data
  var errorDataArray = summary[3];
  reportSheet.getRange("B5").setValue("Error data");
  reportSheet.getRange("C5").setValue(errorDataArray.length);

  // Error summary: ColumnName: x missing data, y error data
  /// Set column names for error summay
  reportSheet.getRange("E2").setValue("Column Name");
  reportSheet.getRange("F2").setValue("Missing data");

  reportSheet.getRange("H2").setValue("Column Name");
  reportSheet.getRange("I2").setValue("Error data");

  var checkedDataSheet = summary[4];  
  /// Iterate through missingDataArray
  columnNameErrorCounts(missingDataArray, "E", "F", 3, checkedDataSheet, reportSheet);

  /// Iterate through errorDataArray
  columnNameErrorCounts(errorDataArray, "H", "I", 3, checkedDataSheet, reportSheet);

  
};

//------- step 4: Custom Menu ------//
function main() {
  var data = create_checked_data();
  var summary = highlight_errors(data);
  create_report(summary);
  
  return;
};
