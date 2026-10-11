// Newsletter sign-ups -> Google Sheet.
// Paste this into the Apps Script editor of the Sheet that should receive the
// emails (Extensions > Apps Script), then deploy it as a Web app.
// Setup steps are in the README next to this file.

const SHEET_NAME = "Subscribers";
const HEADERS = ["Timestamp", "Name", "Email"];

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000); // two sign-ups at the same instant won't overwrite each other

    const p = e.parameter || {};
    const name = String(p.name || "").trim().slice(0, 200);
    const email = String(p.email || "").trim().toLowerCase().slice(0, 200);

    // Hidden "company" field: real visitors leave it empty, bots fill it in.
    if (p.company) return reply({ result: "success" });

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return reply({ result: "error", error: "invalid email" });
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);

    // Skip people who are already on the list.
    const emails = sheet.getLastRow() > 1
      ? sheet.getRange(2, 3, sheet.getLastRow() - 1, 1).getValues().flat()
      : [];
    if (!emails.includes(email)) sheet.appendRow([new Date(), name, email]);

    return reply({ result: "success" });
  } catch (err) {
    return reply({ result: "error", error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
