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

    // Organization directory suggestions go to their own tab, to be reviewed by hand.
    if (p.form === "org-submission") return saveOrgSubmission(p);

    // Contact form messages go to their own tab.
    if (p.form === "contact") return saveContactMessage(p);

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

// Suggestions for the organizations directory. Each row starts as "Pending";
// review it, then change Status to "Approved" or "Rejected" and add approved ones
// to data/organizations.js on the site.
// (Called from doPost, which already holds the script lock.)
const ORG_SHEET_NAME = "Org submissions";
const ORG_HEADERS = ["Timestamp", "Status", "Organization", "Type", "Place", "Link", "About", "Contact name", "Contact email"];

function saveOrgSubmission(p) {
  const clean = (v, n) => String(v || "").trim().slice(0, n);
  const org = clean(p.org_name, 200);
  const email = clean(p.contact_email, 200).toLowerCase();
  if (!org) return reply({ result: "error", error: "missing name" });
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return reply({ result: "error", error: "invalid email" });

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(ORG_SHEET_NAME) || ss.insertSheet(ORG_SHEET_NAME);
  if (sheet.getLastRow() === 0) sheet.appendRow(ORG_HEADERS);
  sheet.appendRow([
    new Date(), "Pending", org, clean(p.org_type, 60), clean(p.org_place, 200), clean(p.org_link, 400),
    clean(p.org_about, 1000), clean(p.contact_name, 200), email
  ]);
  return reply({ result: "success" });
}

// Contact form messages. Called from doPost, which already holds the script lock.
const CONTACT_SHEET_NAME = "Messages";
const CONTACT_HEADERS = ["Timestamp", "First name", "Last name", "Email", "Organization", "Purpose", "Message"];

function saveContactMessage(p) {
  const clean = (v, n) => String(v || "").trim().slice(0, n);
  const email = clean(p.email, 200).toLowerCase();
  const first = clean(p.first_name, 100);
  const last = clean(p.last_name, 100);
  const message = clean(p.message, 3000);
  if (!first || !last || !message) return reply({ result: "error", error: "missing fields" });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return reply({ result: "error", error: "invalid email" });

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONTACT_SHEET_NAME) || ss.insertSheet(CONTACT_SHEET_NAME);
  if (sheet.getLastRow() === 0) sheet.appendRow(CONTACT_HEADERS);
  sheet.appendRow([new Date(), first, last, email, clean(p.organization, 200), clean(p.purpose, 80), message]);
  return reply({ result: "success" });
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
