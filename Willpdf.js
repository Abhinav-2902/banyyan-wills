import { jsPDF } from 'jspdf';

// Minimal PDF generator to unblock imports and downloads.
// You can enhance this to include full formatting and content later.
export async function saveWillPdf(data, options = {}) {
  // Use `data`, normalize arrays, and prefer willExecutors for executor fields
  const {
    personalDetails = {},
    willDetails = {},
    beneficiaries = [],
    assets = [],
    genericAssetDistribution = {},
    charities = [],
    loanRepaymentAccounts = [],
    organDonation = {},
    specialWishes = {},
    disputeResolver = {},
    witnessDetails = {},
    willExecutors = {},
  } = data || {};

  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.getWidth
    ? doc.internal.pageSize.getWidth()
    : doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.getHeight
    ? doc.internal.pageSize.getHeight()
    : doc.internal.pageSize.height;

  const margin = 20;
  let y = margin + 10;

  // Helpers
  const addPara = (text, indent = 0, font = { size: 12, bold: false }) => {
    if (!text && text !== 0) return;
    const x = margin + indent;
    const maxWidth = pageWidth - margin * 2 - indent;
    doc.setFontSize(font.size || 12);
    doc.setFont(undefined, font.bold ? 'bold' : 'normal');
    const lines = doc.splitTextToSize(String(text), maxWidth);
    lines.forEach((line) => {
      if (y > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, x, y);
      y += 16; // line height
    });
  };

  const addSectionTitle = (title) => {
    y += 6;
    addPara(title, 0, { size: 14, bold: true });
  };

  const ensureSpace = (space = 40) => {
    if (y + space > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  };

  const drawSignatureLine = (label) => {
    ensureSpace(24);
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text(label, margin, y);
    const lineY = y;
    const lineStartX = margin + 70;
    const lineEndX = pageWidth - margin;
    doc.line(lineStartX, lineY, lineEndX, lineY);
    y += 24;
  };

  // Frame + Footer (Name | Initials: ________ | Page X of Y)
  const drawPageFrameAndFooter = (pageNumber, totalPages, nameForFooter) => {
    doc.setLineWidth(0.5);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
  
    const footerY = pageHeight - 16;
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
  
    // moved slightly right by the same delta used to move the page number left
    if (nameForFooter) doc.text(nameForFooter, 24, footerY);
  
    doc.text('Initials: ________', pageWidth / 2, footerY, { align: 'center' });
    const pageLabel = `Page ${pageNumber} of ${totalPages}`;
    doc.text(pageLabel, pageWidth - 24, footerY, { align: 'right' });
  };

  // Load logo from public/ (served at /B%20Logo.png in browser)
  async function loadLogoDataUrl() {
    const src = options.logoPath || '/B%20Logo.png';
    try {
      const res = await fetch(src);
      const blob = await res.blob();
      return await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    } catch {
      return null;
    }
  }

  const drawCoverPage = () => {
    // Top “B”
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('B', pageWidth / 2, 20, { align: 'center' });

    // Main title
    let cy = pageHeight * 0.28;
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text('Last Will and Testament', pageWidth / 2, cy, { align: 'center' });
    cy += 18;

    // Name line
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    const coverName = displayName ? `of ${displayName}` : 'of [Name not provided]';
    doc.text(coverName, pageWidth / 2, cy, { align: 'center' });

    // Disclaimers at bottom
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    const disclaimers = [
      'This Will has been executed in one continuous sequence, and any addition, removal, or',
      'modification of any part shall render it void unless executed with fresh signatures and witness',
      'attestation.',
      '',
      'This Will is comprised of {{pages}} ({{pages_words}}) pages including this cover page and the last page.'
    ];
    // Temporarily write without page count; we will replace later when total pages are known
    const bottomBlockY = pageHeight - 60;
    disclaimers.forEach((line, idx) => {
      doc.text(line, pageWidth / 2, bottomBlockY + idx * 5, { align: 'center' });
    });
  };

  // Compute display name and honorific for headers/footers
  const displayName =
    personalDetails.fullName ||
    personalDetails.name || // NEW: fall back to `name` if present
    [personalDetails.firstName, personalDetails.middleName, personalDetails.lastName]
      .filter(Boolean)
      .join(' ')
      .trim();

  const honorific =
    personalDetails?.gender?.toLowerCase() === 'male'
      ? 'Mr'
      : personalDetails?.gender?.toLowerCase() === 'female'
      ? 'Ms'
      : '';

  const todayStr =
    options.executionDate ||
    new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

  // COVER PAGE (use logo, then title and name centered)
  const logoDataUrl = await loadLogoDataUrl();
  if (logoDataUrl) {
    // small logo at top-center; adjust size/position to taste
    const logoW = 10;
    const logoH = 10;
    const logoX = pageWidth / 2 - logoW / 2;
    const logoY = 16;
    try {
      doc.addImage(logoDataUrl, 'PNG', logoX, logoY, logoW, logoH);
    } catch {
      // Ignore if addImage fails; continue without logo
    }
  }

  // Centered cover text (no page header yet)
  y = pageHeight * 0.28;
  doc.setFontSize(20);
  doc.setFont(undefined, 'bold');
  doc.text('Last Will and Testament', pageWidth / 2, y, { align: 'center' });
  y += 18;

  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  const coverName = displayName ? `of ${displayName}` : 'of [Name not provided]';
  doc.text(coverName, pageWidth / 2, y, { align: 'center' });

  // Move to next page and add "Will of Mr/Ms ..." header
  doc.addPage();
  y = margin;

  const willOfHeader = displayName
    ? `Will of ${honorific ? `${honorific} ` : ''}${displayName}`
    : 'Will of [Name not provided]';
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text(willOfHeader, pageWidth / 2, y, { align: 'center' });
  y += 24;

  // Declaration and Personal Details
  addSectionTitle('Declaration and Personal Details');
  addPara(displayName ? `Testator: ${displayName}` : 'Testator: [Not provided]');
  if (personalDetails.gender) addPara(`Gender: ${personalDetails.gender}`);
  if (personalDetails.dateOfBirth) addPara(`Date of Birth: ${personalDetails.dateOfBirth}`);
  const address = [
    personalDetails.addressLine1,
    personalDetails.addressLine2,
    personalDetails.city,
    personalDetails.state,
    personalDetails.country,
    personalDetails.zipCode,
  ]
    .filter(Boolean)
    .join(', ');
  if (address) addPara(`Address: ${address}`);

  y += 10;
  addPara('Summary', 0, { size: 14, bold: true });
  addPara(`Beneficiaries: ${Array.isArray(beneficiaries) ? beneficiaries.length : 0}`);
  addPara(`Assets: ${Array.isArray(assets) ? assets.length : 0}`);
  if (charities?.length) addPara(`Charity Donations: ${charities.length}`);
  if (loanRepaymentAccounts?.length) addPara(`Loan Repayment Accounts: ${loanRepaymentAccounts.length}`);

  y += 10;
  // Use `options` here
  if (options.includeBanyyanReference) {
    addPara('Generated via Banyyan Legacies', 0, { size: 10, bold: false });
  }

  // Section A: Personal Details (with Aadhaar and PAN)
  y += 10;
  addPara('Section A: Personal Details', 0, { size: 14, bold: true });

  const personalAadhaarText = personalDetails?.aadhaar ? `, having Aadhaar no. ${personalDetails.aadhaar}` : '';
  const personalPanText = personalDetails?.pan ? `, PAN ${personalDetails.pan}` : '';
  const dobText = personalDetails?.dateOfBirth ? `, born on ${personalDetails.dateOfBirth}` : '';
  const nationalityText = personalDetails?.nationality ? `, a citizen of ${personalDetails.nationality}` : '';
  const religionText = personalDetails?.religion ? `, religion ${personalDetails.religion}` : '';

  const fatherText = personalDetails?.fatherName ? `son/daughter of Shri. ${personalDetails.fatherName}` : '';
  const motherText = personalDetails?.motherName ? (fatherText ? ` and Smt. ${personalDetails.motherName}` : `child of Smt. ${personalDetails.motherName}`) : '';
  const childOf = fatherText || motherText ? `, ${fatherText}${motherText}` : '';

  const fullPersonalLine =
    displayName
      ? `I, ${displayName}${childOf}${personalAadhaarText}${personalPanText}${dobText}${nationalityText}${religionText}${
          address ? `, a resident of ${address}` : ''
        }, do hereby make this Will.`
      : 'I, [Name not provided], do hereby make this Will.';

  addPara(fullPersonalLine);

  // Optional sub-lines
  if (personalDetails?.fatherName || personalDetails?.fatherAadhaar || personalDetails?.fatherPan) {
    const faParts = [
      personalDetails?.fatherName ? `Name: ${personalDetails.fatherName}` : '',
      personalDetails?.fatherAadhaar ? `Aadhaar: ${personalDetails.fatherAadhaar}` : '',
      personalDetails?.fatherPan ? `PAN: ${personalDetails.fatherPan}` : '',
    ].filter(Boolean);
    if (faParts.length) addPara(`Father Details - ${faParts.join(', ')}`, 10);
  }
  if (personalDetails?.motherName || personalDetails?.motherAadhaar || personalDetails?.motherPan) {
    const moParts = [
      personalDetails?.motherName ? `Name: ${personalDetails.motherName}` : '',
      personalDetails?.motherAadhaar ? `Aadhaar: ${personalDetails.motherAadhaar}` : '',
      personalDetails?.motherPan ? `PAN: ${personalDetails.motherPan}` : '',
    ].filter(Boolean);
    if (moParts.length) addPara(`Mother Details - ${moParts.join(', ')}`, 10);
  }
  if (personalDetails?.spouseName || personalDetails?.spouseAadhaar || personalDetails?.spousePan) {
    const spParts = [
      personalDetails?.spouseName ? `Name: ${personalDetails.spouseName}` : '',
      personalDetails?.spouseAadhaar ? `Aadhaar: ${personalDetails.spouseAadhaar}` : '',
      personalDetails?.spousePan ? `PAN: ${personalDetails.spousePan}` : '',
    ].filter(Boolean);
    if (spParts.length) addPara(`Spouse Details - ${spParts.join(', ')}`, 10);
  }

  // Prefer executor fields from willExecutors, fallback to willDetails
  const wd = willDetails || {};
  const we = willExecutors || {};
  const mergedExec = {
    // Primary executor
    executor: we.executor ?? wd.executor,
    executorFather: we.executorFatherName ?? wd.executorFather,
    executorAadhaar: we.executorAadhaar ?? wd.executorAadhaar,
    executorPan: we.executorPan ?? wd.executorPan,
    executorAddress: we.executorAddress ?? wd.executorAddress,
    executorCity: we.executorCity ?? wd.executorCity,
    executorState: we.executorState ?? wd.executorState,
    executorCountry: we.executorCountry ?? wd.executorCountry,
    executorZipCode: we.executorZipCode ?? wd.executorZipCode,

    // Backup executor
    backupExecutor: we.backupExecutor ?? wd.backupExecutor,
    backupExecutorFather: we.backupExecutorFatherName ?? wd.backupExecutorFather,
    backupExecutorAadhaar: we.backupExecutorAadhaar ?? wd.backupExecutorAadhaar,
    backupExecutorPan: we.backupExecutorPan ?? wd.backupExecutorPan,
    backupExecutorAddress: we.backupExecutorAddress ?? wd.backupExecutorAddress,
    backupExecutorCity: we.backupExecutorCity ?? wd.backupExecutorCity,
    backupExecutorState: we.backupExecutorState ?? wd.backupExecutorState,
    backupExecutorCountry: we.backupExecutorCountry ?? wd.backupExecutorCountry,
    backupExecutorZipCode: we.backupExecutorZipCode ?? wd.backupExecutorZipCode,

    useProfessionalExecutor: we.useProfessionalExecutor ?? wd.useProfessionalExecutor,
  };

  // Executor Appointment (Primary & Backup)
  y += 10;
  addPara('Executor Appointment', 0, { size: 14, bold: true });

  const exName = mergedExec.executor || '[Executor name not provided]';
  const exFather = mergedExec.executorFather || '[Executor father name not provided]';
  const exAddr = [mergedExec.executorAddress, mergedExec.executorCity, mergedExec.executorState, mergedExec.executorCountry, mergedExec.executorZipCode]
    .filter(Boolean)
    .join(', ');
  const exAadhaar = mergedExec.executorAadhaar ? `, having Aadhaar no. ${mergedExec.executorAadhaar}` : '';
  const exPan = mergedExec.executorPan ? `, PAN ${mergedExec.executorPan}` : '';
  addPara(`I appoint ${exName}${exAadhaar}${exPan}, son/daughter of Shri. ${exFather}, resident of ${exAddr || '[Address not provided]'} to be the Executor of this Will.`);

  if (mergedExec.backupExecutor) {
    const bExName = mergedExec.backupExecutor;
    const bExFather = mergedExec.backupExecutorFather || '[Backup executor father name not provided]';
    const bExAddr = [mergedExec.backupExecutorAddress, mergedExec.backupExecutorCity, mergedExec.backupExecutorState, mergedExec.backupExecutorCountry, mergedExec.backupExecutorZipCode]
      .filter(Boolean)
      .join(', ');
    const bExAadhaar = mergedExec.backupExecutorAadhaar ? `, having Aadhaar no. ${mergedExec.backupExecutorAadhaar}` : '';
    const bExPan = mergedExec.backupExecutorPan ? `, PAN ${mergedExec.backupExecutorPan}` : '';
    addPara(
      `In case the above Executor is unwilling or unable to act, then ${bExName}${bExAadhaar}${bExPan}, son/daughter of Shri. ${bExFather}, resident of ${bExAddr || '[Address not provided]'} shall act as the Backup Executor of this Will.`,
      10
    );
  }

  // Banyyan fallback clause if opted in (either via options or form flag)
  if (options.includeBanyyanReference || willExecutors?.banyyanFallbackExecutorOptIn) {
    addPara(
      'If both the primary and backup executors are unable or unwilling to execute this Will for any reason, I authorize Banyyan Legacies to step in and execute this Will.',
      10
    );
  }

  // Beneficiaries section (include Aadhaar and PAN)
  if (Array.isArray(beneficiaries) && beneficiaries.length) {
    y += 10;
    addPara('Beneficiaries', 0, { size: 14, bold: true });
    beneficiaries.forEach((b, idx) => {
      const parts = [
        b?.name ? `${b.name}` : '[Name not provided]',
        b?.relation ? `(${b.relation})` : '',
        b?.dob ? `DOB: ${b.dob}` : '',
        b?.aadhaar ? `Aadhaar: ${b.aadhaar}` : '',
        b?.pan ? `PAN: ${b.pan}` : '',
      ].filter(Boolean);
      addPara(`${idx + 1}. ${parts.join(', ')}`, 10);
      if (b?.guardianName || b?.guardianRelation) {
        const gParts = [
          b?.guardianName ? `Name: ${b.guardianName}` : '',
          b?.guardianRelation ? `Relation: ${b.guardianRelation}` : '',
        ].filter(Boolean);
        if (gParts.length) addPara(`Guardian - ${gParts.join(', ')}`, 20);
      }
    });
  }

  // Dispute Resolution (include Aadhaar and PAN)
  if (disputeResolver?.disputeResolver) {
    y += 10;
    addPara('Dispute Resolution', 0, { size: 14, bold: true });
    const drRelPrefix = disputeResolver?.disputeResolverRelation ? `my ${disputeResolver.disputeResolverRelation}, ` : '';
    const drAadhaar = disputeResolver?.disputeResolverAadhaar ? `, Aadhaar: ${disputeResolver.disputeResolverAadhaar}` : '';
    const drPan = disputeResolver?.disputeResolverPan ? `, PAN: ${disputeResolver.disputeResolverPan}` : '';
    const drLine = `In case of any dispute, the final decision will rest with ${drRelPrefix}${disputeResolver.disputeResolver}${drAadhaar}${drPan}.`;
    addPara(drLine);
  }

  // Define a safe filename and save
  // After content is added, add frames + footers and write the cover disclaimers with correct total pages
  const totalPages = doc.getNumberOfPages();
  const nameForFooter = displayName || '';
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    drawPageFrameAndFooter(p, totalPages, nameForFooter);

    if (p === 1) {
      // Cover-page disclaimers with proper page count
      const words = (n) => {
        const map = {
          0: 'zero', 1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five',
          6: 'six', 7: 'seven', 8: 'eight', 9: 'nine', 10: 'ten',
          11: 'eleven', 12: 'twelve', 13: 'thirteen', 14: 'fourteen',
          15: 'fifteen', 16: 'sixteen', 17: 'seventeen', 18: 'eighteen', 19: 'nineteen',
          20: 'twenty'
        };
        return map[n] || String(n);
      };
      doc.setFontSize(9);
      doc.setFont(undefined, 'normal');
      const baseY = pageHeight - 60;
      const lines = [
        'This Will has been executed in one continuous sequence, and any addition, removal, or',
        'modification of any part shall render it void unless executed with fresh signatures and witness',
        'attestation.',
        '',
        `This Will is comprised of ${totalPages} (${words(totalPages)}) pages including this cover page and the last page.`
      ];
      lines.forEach((line, idx) => {
        doc.text(line, pageWidth / 2, baseY + idx * 5, { align: 'center' });
      });
    }
  }

  const safeFileName = options.filename || (displayName ? `Will - ${displayName}.pdf` : 'will.pdf');
  doc.save(safeFileName);
}

// Build a best-effort display name and salutation
const displayName =
  personalDetails.fullName ||
  personalDetails.name ||
  [personalDetails.firstName, personalDetails.middleName, personalDetails.lastName]
    .filter(Boolean)
    .join(' ')
    .trim();

const salutation =
  personalDetails.salutation ||
  personalDetails.title ||
  (String(personalDetails.gender || '').toLowerCase().startsWith('f') ? 'Ms' : 'Mr');

// Helper to draw the standard header on page 2
const drawStandardSecondPageHeader = () => {
  let y = 28;

  // Line 1: Last Will and Testament
  doc.setFontSize(18);
  doc.setFont(undefined, 'bold');
  doc.text('Last Will and Testament', pageWidth / 2, y, { align: 'center' });

  // Line 2: WILL OF Mr <Name>
  y += 22;
  doc.setFontSize(26);
  doc.setFont(undefined, 'bold');
  const mainTitle = `WILL OF ${salutation} ${displayName}`;
  doc.text(mainTitle, pageWidth / 2, y, { align: 'center' });

  // restore base font for body that follows
  doc.setFontSize(12);
  doc.setFont(undefined, 'normal');
  // leave some breathing room before Section A
  return y + 18;
};

// After finishing the cover page:
// doc.addPage();  // (this already exists in your file right before page 2 content)
// Insert the standard header on page 2 before sections begin
const startYAfterHeader = drawStandardSecondPageHeader();
let cursorY = Math.max(cursorY || 60, startYAfterHeader); // ensure following content starts below header

// ... existing code ...