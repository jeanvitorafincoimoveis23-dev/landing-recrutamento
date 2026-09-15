const SHEET_NAME = "Candidaturas";
const HEADERS = [
  "Data",
  "Nome completo",
  "WhatsApp",
  "E-mail",
  "Cidade",
  "Idade",
  "Experiência comercial",
  "Disponibilidade",
  "Motivação",
  "Consentimento",
  "Origem"
];

function doPost(event) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
    const payload = JSON.parse(event.postData.contents || "{}");

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
    }

    sheet.appendRow([
      payload.received_at ? new Date(payload.received_at) : new Date(),
      payload.full_name || "",
      payload.whatsapp || "",
      payload.email || "",
      payload.city || "",
      payload.age || "",
      payload.experience_status || "",
      payload.start_availability || "",
      payload.motivation || "",
      payload.consent ? "Sim" : "Não",
      payload.source || "landing-page"
    ]);

    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(
      ContentService.MimeType.JSON
    );
  } finally {
    lock.releaseLock();
  }
}
