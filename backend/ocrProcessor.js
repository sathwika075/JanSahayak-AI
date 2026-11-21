// C:\Nxtwave-Sathwika\jansahayak-ai\backend\ocrProcessor.js
// Document Intelligence & Heuristic Field Extractor
// Extracts critical data from uploaded Income, Caste, Marksheets and Bonafide certificates

function processDocumentText(rawText, docType = "INCOME_CERTIFICATE") {
  const text = rawText || "";
  const upper = text.toUpperCase();
  const warnings = [];
  const extractedFields = {};

  // Extract Applicant Name
  const nameMatch = text.match(/(?:Name(?:\s+of\s+Candidate|\s+of\s+Student)?|Sri|Kumari|Smt)[:\.\s]+([A-Za-z\s]{3,30})/i);
  if (nameMatch) {
    extractedFields["applicant_name"] = nameMatch[1].trim();
  }

  // Extract Income
  const incomeMatch = text.match(/(?:Annual\s+Income|Total\s+Income|Rs\.?|INR)[:\.\s]*([0-9,]{4,9})/i);
  if (incomeMatch) {
    const rawVal = incomeMatch[1].replace(/,/g, '');
    const numVal = parseInt(rawVal, 10);
    if (!isNaN(numVal)) {
      extractedFields["annual_income"] = numVal;
      extractedFields["annual_income_formatted"] = `₹${numVal.toLocaleString('en-IN')}`;
    }
  }

  // Extract Application / Certificate Number
  const certMatch = text.match(/(?:Certificate\s+No|Application\s+No|Reference\s+No|MeeSeva\s+No)[:\.\s]*([A-Z0-9\/-]{6,25})/i);
  if (certMatch) {
    extractedFields["certificate_number"] = certMatch[1].trim();
  }

  // Extract Issuing Authority & Date
  const dateMatch = text.match(/(?:Date\s+of\s+Issue|Issued\s+on|Date)[:\.\s]*([0-9]{2}[-\/][0-9]{2}[-\/][0-9]{4})/i);
  if (dateMatch) {
    extractedFields["issue_date"] = dateMatch[1].trim();
  }

  // Extract Caste / Category
  const casteMatch = text.match(/(?:Caste|Community|Category)[:\.\s]*([A-Za-z0-9\s\(\)-]{2,20})/i);
  if (casteMatch) {
    extractedFields["category"] = casteMatch[1].trim();
  }

  // Extract Marks / Percentage
  const marksMatch = text.match(/(?:Percentage|CGPA|Marks\s+Obtained|Total\s+Marks)[:\.\s]*([0-9]{1,3}(?:\.[0-9]{1,2})?%?)/i);
  if (marksMatch) {
    extractedFields["academic_score"] = marksMatch[1].trim();
  }

  // Quality and Verification checks
  if (!text.includes("MeeSeva") && !text.includes("GOVERNMENT") && !text.includes("TAHSILDAR") && !text.includes("REVENUE")) {
    warnings.push("Document header does not appear to bear standard government seals (e.g. MeeSeva / Revenue Department).");
  }
  if (!extractedFields["certificate_number"]) {
    warnings.push("Certificate application/verification reference number could not be reliably determined.");
  }
  if (docType === "INCOME_CERTIFICATE" && !extractedFields["annual_income"]) {
    warnings.push("Could not unambiguously extract numeric annual income. Please review and input manually.");
  }

  return {
    raw_text: text,
    extracted_fields: extractedFields,
    missing_fields: [
      !extractedFields["applicant_name"] ? "Applicant Name" : null,
      !extractedFields["certificate_number"] ? "Certificate Number" : null,
      !extractedFields["issue_date"] ? "Issue Date" : null
    ].filter(Boolean),
    warnings,
    is_authenticated: false,
    disclaimer: "Document intelligence performs optical text extraction for student assistance. It does NOT constitute official legal or government authentication."
  };
}

module.exports = { processDocumentText };
