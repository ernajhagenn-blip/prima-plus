function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var payload = JSON.parse(e.postData.contents);
  var sheetName = payload.sheet || "Sheet1";
  var data = payload.data || [];
  
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }
  
  // Auto-create header row if sheet is empty
  if (sheet.getLastRow() === 0) {
    var headers = generateHeaders(sheetName);
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length)
      .setBackground("#4a86c8")
      .setFontColor("#ffffff")
      .setFontWeight("bold")
      .setHorizontalAlignment("center");
    sheet.setFrozenRows(1);
  }
  
  sheet.appendRow(data);
  
  // Auto-resize columns
  for (var i = 1; i <= sheet.getLastColumn(); i++) {
    sheet.autoResizeColumn(i);
  }
  
  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok", sheet: sheetName }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok", message: "PRIMA+ Sheets API is running" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function generateHeaders(sheetName) {
  switch (sheetName) {
    case "Registrasi":
      return ["Timestamp", "Kode", "Nama", "Kelas"];
    case "Pretest":
      return ["Timestamp", "Kode", "Nama", "Kelas", "Total Skor"];
    case "Game PRIMA":
      return ["Timestamp", "Kode", "Nama", "Kelas", "Skor", "Max Skor"];
    case "Posttest":
      return ["Timestamp", "Kode", "Nama", "Kelas", "Total Skor"];
    case "Angket Respons":
      return ["Timestamp", "Kode", "Nama", "Kelas"];
    default:
      return ["Timestamp", "Data"];
  }
}
