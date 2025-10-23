// import * as pdfjsLib from 'pdfjs-dist';

// // Configure PDF.js worker for Vite
// pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

// export interface ParsedData {
//   statementDate: string | null;
//   paymentDueDate: string | null;
//   totalAmountDue: string | null;
//   creditLimit: string | null;
//   cardType: string | null;
//   customerName: string | null;
//   cardNumber: string | null;
//   minimumDue: string | null;
//   availableCredit: string | null;
//   provider: string;
// }

// const detectProvider = (text: string): string => {
//   const providers = [
//     { name: 'ICICI Bank', keywords: ['ICICI', 'iMobile'] },
//     { name: 'HDFC Bank', keywords: ['HDFC', 'Regalia'] },
//     { name: 'SBI Card', keywords: ['SBI CARD', 'State Bank'] },
//     { name: 'Axis Bank', keywords: ['AXIS BANK', 'Burgundy'] },
//     { name: 'Kotak Mahindra', keywords: ['KOTAK', 'Mahindra'] },
//   ];

//   for (const provider of providers) {
//     if (provider.keywords.some(keyword => text.includes(keyword))) {
//       return provider.name;
//     }
//   }

//   return 'Unknown Provider';
// };

// const extractData = (text: string): ParsedData => {
//   const provider = detectProvider(text);
  
//   // Extract Statement Date
//   const statementDatePatterns = [
//     /STATEMENT\s+DATE[:\s]*([A-Za-z]+\s+\d{1,2},?\s+\d{4})/i,
//     /Statement\s+Date[:\s]*([A-Za-z]+\s+\d{1,2},?\s+\d{4})/i,
//     /Statement\s+as\s+on[:\s]*([A-Za-z]+\s+\d{1,2},?\s+\d{4})/i,
//   ];
//   let statementDate = null;
//   for (const pattern of statementDatePatterns) {
//     const match = text.match(pattern);
//     if (match) {
//       statementDate = match[1].trim();
//       break;
//     }
//   }

//   // Extract Payment Due Date
//   const dueDatePatterns = [
//     /PAYMENT\s+DUE\s+DATE[:\s]*([A-Za-z]+\s+\d{1,2},?\s+\d{4})/i,
//     /Payment\s+Due\s+Date[:\s]*([A-Za-z]+\s+\d{1,2},?\s+\d{4})/i,
//     /Due\s+Date[:\s]*([A-Za-z]+\s+\d{1,2},?\s+\d{4})/i,
//   ];
//   let paymentDueDate = null;
//   for (const pattern of dueDatePatterns) {
//     const match = text.match(pattern);
//     if (match) {
//       paymentDueDate = match[1].trim();
//       break;
//     }
//   }

//   // Extract Total Amount Due (handle both ₹ and ` symbols)
//   const amountPatterns = [
//     /Total\s+Amount\s+due[:\s]*[₹`]\s*([\d,]+\.?\d*)/i,
//     /TOTAL\s+AMOUNT\s+DUE[:\s]*[₹`]\s*([\d,]+\.?\d*)/i,
//     /Amount\s+Due[:\s]*[₹`]\s*([\d,]+\.?\d*)/i,
//   ];
//   let totalAmountDue = null;
//   for (const pattern of amountPatterns) {
//     const match = text.match(pattern);
//     if (match) {
//       totalAmountDue = `₹${match[1].trim()}`;
//       break;
//     }
//   }

//   // Extract Credit Limit
//   const creditLimitPatterns = [
//     /Credit\s+Limit[:\s]*\(Including\s+cash\)[:\s]*[₹`]\s*([\d,]+\.?\d*)/i,
//     /CREDIT\s+LIMIT[:\s]*[₹`]\s*([\d,]+\.?\d*)/i,
//     /Total\s+Credit\s+Limit[:\s]*[₹`]\s*([\d,]+\.?\d*)/i,
//   ];
//   let creditLimit = null;
//   for (const pattern of creditLimitPatterns) {
//     const match = text.match(pattern);
//     if (match) {
//       creditLimit = `₹${match[1].trim()}`;
//       break;
//     }
//   }

//   // Extract Card Type
//   const cardTypePatterns = [
//     /CREDIT\s+CARD\s+STATEMENT[\s\S]{0,100}?(Platinum|Gold|Silver|Titanium|Signature|Regalia|Elite)/i,
//     /(Platinum|Gold|Silver|Titanium|Signature|Regalia|Elite)\s+Card/i,
//   ];
//   let cardType = null;
//   for (const pattern of cardTypePatterns) {
//     const match = text.match(pattern);
//     if (match) {
//       cardType = match[1].trim();
//       break;
//     }
//   }

//   // Extract Customer Name
//   const namePatterns = [
//     /MR\s+([A-Z\s]+)[\n\r]/,
//     /MS\s+([A-Z\s]+)[\n\r]/,
//     /MRS\s+([A-Z\s]+)[\n\r]/,
//     /Dear\s+([A-Z\s]+)[\n\r]/i,
//   ];
//   let customerName = null;
//   for (const pattern of namePatterns) {
//     const match = text.match(pattern);
//     if (match) {
//       customerName = match[0].trim();
//       break;
//     }
//   }

//   // Extract Card Number (last 4 digits)
//   const cardNumberPatterns = [
//     /\*+(\d{4})/,
//     /XXXX\s*(\d{4})/,
//     /ending\s+(\d{4})/i,
//   ];
//   let cardNumber = null;
//   for (const pattern of cardNumberPatterns) {
//     const match = text.match(pattern);
//     if (match) {
//       cardNumber = `****${match[1]}`;
//       break;
//     }
//   }

//   // Extract Minimum Due
//   const minimumDuePatterns = [
//     /Minimum\s+Amount\s+due[:\s]*[₹`]\s*([\d,]+\.?\d*)/i,
//     /MINIMUM\s+DUE[:\s]*[₹`]\s*([\d,]+\.?\d*)/i,
//     /MINIMUM\s+AMOUNT\s+DUE[:\s]*[₹`]\s*([\d,]+\.?\d*)/i,
//   ];
//   let minimumDue = null;
//   for (const pattern of minimumDuePatterns) {
//     const match = text.match(pattern);
//     if (match) {
//       minimumDue = `₹${match[1].trim()}`;
//       break;
//     }
//   }

//   // Extract Available Credit
//   const availableCreditPatterns = [
//     /Available\s+Credit[:\s]*\(Including\s+cash\)[:\s]*[₹`]\s*([\d,]+\.?\d*)/i,
//     /AVAILABLE\s+CREDIT[:\s]*[₹`]\s*([\d,]+\.?\d*)/i,
//     /Available\s+Credit[:\s]*[₹`]\s*([\d,]+\.?\d*)/i,
//   ];
//   let availableCredit = null;
//   for (const pattern of availableCreditPatterns) {
//     const match = text.match(pattern);
//     if (match) {
//       availableCredit = `₹${match[1].trim()}`;
//       break;
//     }
//   }

//   return {
//     statementDate,
//     paymentDueDate,
//     totalAmountDue,
//     creditLimit,
//     cardType,
//     customerName,
//     cardNumber,
//     minimumDue,
//     availableCredit,
//     provider,
//   };
// };

// export const parsePDF = async (file: File): Promise<ParsedData> => {
//   try {
//     const arrayBuffer = await file.arrayBuffer();
//     const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
//     let fullText = '';
    
//     // Extract text from all pages
//     for (let i = 1; i <= Math.min(pdf.numPages, 3); i++) {
//       const page = await pdf.getPage(i);
//       const textContent = await page.getTextContent();
//       const pageText = textContent.items
//         .map((item: any) => item.str)
//         .join(' ');
//       fullText += pageText + '\n';
//     }

//     console.log('=== EXTRACTED TEXT ===');
//     console.log(fullText.substring(0, 2000)); // Log first 2000 chars
//     console.log('=== END EXTRACTED TEXT ===');
    
//     const result = extractData(fullText);
//     console.log('=== PARSED RESULT ===', result);
    
//     return result;
//   } catch (error) {
//     console.error('Error parsing PDF:', error);
//     throw new Error('Failed to parse PDF. Please ensure it\'s a valid credit card statement.');
//   }
// };



// import * as pdfjsLib from 'pdfjs-dist';

// pdfjsLib.GlobalWorkerOptions.workerSrc =
//   `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

// export interface ParsedData {
//   statementDate: string | null;
//   paymentDueDate: string | null;
//   totalAmountDue: string | null;
//   creditLimit: string | null;
//   cardType: string | null;
//   customerName: string | null;
//   cardNumber: string | null;
//   minimumDue: string | null;
//   availableCredit: string | null;
//   provider: string;
// }

// /** ---------- Helpers ---------- */

// const normalizeText = (raw: string): string => {
//   return raw
//     .replace(/\r/g, '\n')
//     .replace(/[ \t]+/g, ' ')
//     .replace(/\n{2,}/g, '\n')
//     .replace(/`/g, '₹') // rupee sometimes becomes backtick
//     // collapse split headings
//     .replace(/\b(PAYMENT)\s+(DUE)\s+(DATE)\b/gi, 'PAYMENT DUE DATE')
//     .replace(/\b(STATEMENT)\s+(DATE)\b/gi, 'STATEMENT DATE')
//     .replace(/\b(TOTAL)\s+(AMOUNT)\s+(DUE)\b/gi, 'TOTAL AMOUNT DUE')
//     .replace(/\b(MINIMUM)\s+(AMOUNT)\s+(DUE)\b/gi, 'MINIMUM AMOUNT DUE')
//     .trim();
// };

// const detectProvider = (text: string): string => {
//   const providers = [
//     { name: 'ICICI Bank', keywords: ['ICICI BANK', 'iMobile', 'GST Number', 'Vadodara'] },
//     { name: 'HDFC Bank', keywords: ['HDFC', 'Regalia'] },
//     { name: 'SBI Card', keywords: ['SBI CARD', 'State Bank'] },
//     { name: 'Axis Bank', keywords: ['AXIS BANK', 'Burgundy'] },
//     { name: 'Kotak Mahindra', keywords: ['KOTAK', 'Mahindra'] },
//   ];
//   const U = text.toUpperCase();
//   for (const p of providers) if (p.keywords.some(k => U.includes(k))) return p.name;
//   return 'Unknown Provider';
// };

// // format "₹12,345.67"
// const formatINR = (n: string | null) => (n ? `₹${n.replace(/[^\d.,-]/g, '').trim()}` : null);

// // For debugging misses: show ±20 chars around the first match of a label
// const peek = (text: string, label: RegExp, width = 20) => {
//   const m = text.search(label);
//   if (m < 0) return '(label not found)';
//   const start = Math.max(0, m - width);
//   const end = Math.min(text.length, m + width);
//   return text.slice(start, end).replace(/\n/g, '⏎');
// };

// // PDF.js order-aware text assembly
// const getSortedPageText = async (page: pdfjsLib.PDFPageProxy): Promise<string> => {
//   const textContent = await page.getTextContent();
//   const items = (textContent.items as any[]).map((it: any) => {
//     // transform = [a,b,c,d,e,f]; e=x, f=y
//     const t = it.transform || it.fontMatrix || [0, 0, 0, 0, 0, 0];
//     return { str: it.str, x: t[4] ?? 0, y: t[5] ?? 0 };
//   });
//   // sort by y desc (top to bottom), then x asc (left to right)
//   items.sort((a, b) => (b.y - a.y) || (a.x - b.x));
//   return items.map(i => i.str).join(' ');
// };

// /** ---------- Core extraction ---------- */

// const extractData = (rawText: string): ParsedData => {
//   const text = normalizeText(rawText);
//   const provider = detectProvider(text);

//   // Dates like "October 20, 2025" or "Oct 20, 2025"
//   const dateRe = /([A-Za-z]{3,9}\s+\d{1,2},?\s+\d{4})/;
//   // Money like 1,20,000.00 (₹ optional in normalization step)
//   const money = '([0-9][\\d,]*\\.?\\d{0,2})';

//   // Statement Date (supports "Statement as on")
//   const statementDate =
//     text.match(new RegExp(`(?:STATEMENT\\s+DATE|Statement\\s+as\\s+on)[:\\s]*${dateRe.source}`, 'i'))?.[1] ?? null;

//   // Payment Due Date
//   const paymentDueDate =
//     text.match(new RegExp(`(?:PAYMENT\\s+DUE\\s+DATE|Due\\s+Date)[:\\s]*${dateRe.source}`, 'i'))?.[1] ?? null;

//   // Total Amount Due (also handles "Total Due")
//   const totalAmountDue =
//     formatINR(
//       text.match(new RegExp(`(?:TOTAL\\s+AMOUNT\\s+DUE|Amount\\s+Due|Total\\s+Due)[:\\s]*₹?\\s*${money}`, 'i'))?.[1] ?? null
//     );

//   // Minimum Amount Due
//   const minimumDue =
//     formatINR(
//       text.match(new RegExp(`(?:MINIMUM\\s+(?:AMOUNT\\s+)?DUE)[:\\s]*₹?\\s*${money}`, 'i'))?.[1] ?? null
//     );

//   // Credit Limit (ICICI: "Credit Limit (Including cash)")
//   const creditLimit =
//     formatINR(
//       text.match(new RegExp(`(?:CREDIT\\s+LIMIT(?:\\s*\\(Including\\s+cash\\))?|Total\\s+Credit\\s+Limit)[:\\s]*₹?\\s*${money}`, 'i'))?.[1] ?? null
//     );

//   // Available Credit
//   const availableCredit =
//     formatINR(
//       text.match(new RegExp(`(?:AVAILABLE\\s+CREDIT(?:\\s*\\(Including\\s+cash\\))?)[:\\s]*₹?\\s*${money}`, 'i'))?.[1] ?? null
//     );

//   // Card Type
//   const cardType =
//     text.match(/(?:CREDIT\s+CARD\s+STATEMENT[\s\S]{0,120}?|Retail\s+)?(Platinum|Signature|Regalia|Elite|Titanium|Gold|Silver)\b/i)?.[1] ??
//     null;

//   // Customer Name (group only; avoids including MR/MS)
//   const customerName =
//     (text.match(/\bMR\s+([A-Z][A-Z\s]+)\b/)?.[1] ??
//      text.match(/\bMS\s+([A-Z][A-Z\s]+)\b/)?.[1] ??
//      text.match(/\bMRS\s+([A-Z][A-Z\s]+)\b/)?.[1] ??
//      text.match(/Dear\s+([A-Za-z ]+)\b/)?.[1] ??
//      null)?.replace(/\s+/g, ' ').trim() ?? null;

//   // Card number last 4: ****1234 | XXXX1234 | 4035XXXXXXXX1007 | "ending 1007"
//   const last4 =
//     text.match(/\*+(\d{4})/)?.[1] ??
//     text.match(/X{2,}\s*(\d{4})/)?.[1] ??
//     text.match(/(?:\d{4})X{6,}(\d{4})/)?.[1] ??
//     text.match(/ending\s+(\d{4})/i)?.[1] ??
//     null;

//   const cardNumber = last4 ? `****${last4}` : null;

//   // Optional: quick diagnostics if something is null (comment out in prod)
//   if (!statementDate) console.debug('peek STATEMENT DATE =>', peek(text, /STATEMENT\s+DATE/i));
//   if (!paymentDueDate) console.debug('peek PAYMENT DUE DATE =>', peek(text, /PAYMENT\s+DUE\s+DATE/i));
//   if (!totalAmountDue) console.debug('peek TOTAL AMOUNT DUE =>', peek(text, /TOTAL\s+AMOUNT\s+DUE|Total\s+Due/i));
//   if (!minimumDue) console.debug('peek MINIMUM AMOUNT DUE =>', peek(text, /MINIMUM\s+(?:AMOUNT\s+)?DUE/i));
//   if (!creditLimit) console.debug('peek CREDIT LIMIT =>', peek(text, /CREDIT\s+LIMIT/i));
//   if (!availableCredit) console.debug('peek AVAILABLE CREDIT =>', peek(text, /AVAILABLE\s+CREDIT/i));

//   return {
//     statementDate,
//     paymentDueDate,
//     totalAmountDue,
//     creditLimit,
//     cardType,
//     customerName,
//     cardNumber,
//     minimumDue,
//     availableCredit,
//     provider,
//   };
// };

// /** ---------- Public API ---------- */

// export const parsePDF = async (file: File): Promise<ParsedData> => {
//   try {
//     const arrayBuffer = await file.arrayBuffer();
//     const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

//     let fullText = '';
//     // first 3 pages usually contain all summary data
//     for (let i = 1; i <= Math.min(pdf.numPages, 3); i++) {
//       const page = await pdf.getPage(i);
//       const pageText = await getSortedPageText(page);
//       fullText += pageText + '\n';
//     }

//     // Debug preview
//     console.log('=== EXTRACTED TEXT (first 1500 chars) ===');
//     console.log(fullText.slice(0, 1500));
//     console.log('=== END EXTRACTED TEXT ===');

//     const result = extractData(fullText);
//     console.log('=== PARSED RESULT ===', result);
//     return result;
//   } catch (err) {
//     console.error('Error parsing PDF:', err);
//     throw new Error("Failed to parse PDF. Please ensure it's a valid credit card statement.");
//   }
// };



// import * as pdfjsLib from 'pdfjs-dist';

// pdfjsLib.GlobalWorkerOptions.workerSrc =
//   `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

// export interface ParsedData {
//   statementDate: string | null;
//   paymentDueDate: string | null;
//   totalAmountDue: string | null;
//   creditLimit: string | null;
//   cardType: string | null;
//   customerName: string | null;
//   cardNumber: string | null;
//   minimumDue: string | null;
//   availableCredit: string | null;
//   provider: string;
// }

// /* ============== Normalization ============== */
// const normalizeText = (raw: string): string => {
//   return raw
//     // normalize unicode & spacing
//     .replace(/\r/g, '\n')
//     .replace(/\u00A0/g, ' ')           // NBSP -> space
//     .replace(/[ \t]+/g, ' ')
//     .replace(/\n{2,}/g, '\n')
//     .replace(/[：﹕︓]/g, ':')          // full-width colons -> :
//     .replace(/[–—‒]/g, '-')            // dashes -> hyphen
//     .replace(/`/g, '₹')                // backtick sometimes used for ₹
//     .replace(/\bRs\.?\s*/gi, '₹')      // Rs. -> ₹
//     .replace(/\bINR\s*/gi, '₹')

//     // collapse split headings
//     .replace(/\b(PAYMENT)\s+(DUE)\s+(DATE)\b/gi, 'PAYMENT DUE DATE')
//     .replace(/\b(STATEMENT)\s+(DATE)\b/gi, 'STATEMENT DATE')
//     .replace(/\b(TOTAL)\s+(AMOUNT)\s+(DUE)\b/gi, 'TOTAL AMOUNT DUE')
//     .replace(/\b(MINIMUM)\s+(AMOUNT)\s+(DUE)\b/gi, 'MINIMUM AMOUNT DUE')
//     .trim();
// };

// /* ============== Provider ============== */
// const detectProvider = (text: string): string => {
//   const providers = [
//     { name: 'ICICI Bank', keywords: ['ICICI BANK', 'iMobile', 'GST Number', 'Vadodara'] },
//     { name: 'HDFC Bank', keywords: ['HDFC', 'Regalia'] },
//     { name: 'SBI Card', keywords: ['SBI CARD', 'State Bank'] },
//     { name: 'Axis Bank', keywords: ['AXIS BANK', 'Burgundy'] },
//     { name: 'Kotak Mahindra', keywords: ['KOTAK', 'Mahindra'] },
//   ];
//   const U = text.toUpperCase();
//   for (const p of providers) if (p.keywords.some(k => U.includes(k))) return p.name;
//   return 'Unknown Provider';
// };

// const formatINR = (n: string | null) => (n ? `₹${n.replace(/[^\d.,-]/g, '').trim()}` : null);

// /* ============== Windowed Extraction Helpers ============== */
// // find the next token after a label within a window of characters
// const getAfter = (
//   text: string,
//   label: RegExp,
//   value: RegExp,
//   windowChars = 120
// ): string | null => {
//   const m = text.match(label);
//   if (!m) return null;
//   const idx = m.index! + m[0].length;
//   const slice = text.slice(idx, idx + windowChars);
//   const v = slice.match(value);
//   return v?.[1]?.trim() ?? null;
// };

// // try multiple labels until one hits
// const firstOf = (...vals: Array<string | null | undefined>) => vals.find(Boolean) ?? null;

// /* ============== Patterns ============== */
// // Dates: Oct 20, 2025 | 20 Oct 2025 | 20/10/2025 | 20-10-2025 | 20-Oct-2025
// const MONTH = '(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*';
// const DMY1 = `\\d{1,2}[\\/-]\\d{1,2}[\\/-]\\d{2,4}`;                    // 20/10/2025
// const DMY2 = `\\d{1,2}[-\\s]${MONTH}[-\\s]\\d{2,4}`;                    // 20-Oct-2025
// const MDY1 = `${MONTH}\\s+\\d{1,2},?\\s+\\d{4}`;                        // October 20, 2025
// const DMY3 = `\\d{1,2}\\s+${MONTH}\\s+\\d{4}`;                          // 20 Oct 2025
// const ANY_DATE = `(${MDY1}|${DMY2}|${DMY3}|${DMY1})`;

// const MONEY = '([0-9][\\d,]*\\.?\\d{0,2})';
// const MONEY_OPT_SYM = new RegExp(`[:\\s]*₹?\\s*${MONEY}`, 'i');

// // labels (accept minor variants)
// const L_STATEMENT_DATE = /STATEMENT\s+DATE\b/i;
// const L_STATEMENT_AS_ON = /Statement\s+as\s+on\b/i;
// const L_STATEMENT_PERIOD = /STATEMENT\s+PERIOD\b|Billing\s+Period\b/i;
// const L_DUE_DATE = /PAYMENT\s+DUE\s+DATE\b|Due\s+Date\b|Payment\s+Due\s+by\b/i;
// const L_TOTAL_DUE = /TOTAL\s+AMOUNT\s+DUE\b|Amount\s+Due\b|Total\s+Due\b/i;
// const L_MIN_DUE = /MINIMUM\s+(?:AMOUNT\s+)?DUE\b/i;
// const L_CREDIT_LIMIT = /CREDIT\s+LIMIT\b|Total\s+Credit\s+Limit\b/i;
// const L_AVAIL_CREDIT = /AVAILABLE\s+CREDIT\b/i;

// /* ============== Core extraction ============== */
// const extractDataFromText = (rawText: string): ParsedData => {
//   const text = normalizeText(rawText);
//   const provider = detectProvider(text);

//   // statement date: direct or from "Statement as on"
//   const statementDate =
//     firstOf(
//       getAfter(text, new RegExp(`${L_STATEMENT_DATE.source}\\s*:?\\s*`, 'i'), new RegExp(ANY_DATE, 'i')),
//       getAfter(text, new RegExp(`${L_STATEMENT_AS_ON.source}\\s*:?\\s*`, 'i'), new RegExp(ANY_DATE, 'i'))
//     );

//   // payment due date
//   const paymentDueDate = getAfter(text, new RegExp(`${L_DUE_DATE.source}\\s*:?\\s*`, 'i'), new RegExp(ANY_DATE, 'i'));

//   // total amount due
//   const totalAmountDue = formatINR(
//     firstOf(
//       getAfter(text, new RegExp(`${L_TOTAL_DUE.source}`, 'i'), MONEY_OPT_SYM),
//       text.match(new RegExp(`${L_TOTAL_DUE.source}\\s*:?\\s*₹?\\s*${MONEY}`, 'i'))?.[1] ?? null
//     )
//   );

//   // minimum amount due
//   const minimumDue = formatINR(
//     firstOf(
//       getAfter(text, L_MIN_DUE, MONEY_OPT_SYM),
//       text.match(new RegExp(`${L_MIN_DUE.source}\\s*:?\\s*₹?\\s*${MONEY}`, 'i'))?.[1] ?? null
//     )
//   );

//   // credit limit
//   const creditLimit = formatINR(
//     firstOf(
//       getAfter(text, L_CREDIT_LIMIT, MONEY_OPT_SYM),
//       text.match(new RegExp(`${L_CREDIT_LIMIT.source}[^₹\\d]{0,40}₹?\\s*${MONEY}`, 'i'))?.[1] ?? null
//     )
//   );

//   // available credit
//   const availableCredit = formatINR(
//     firstOf(
//       getAfter(text, L_AVAIL_CREDIT, MONEY_OPT_SYM),
//       text.match(new RegExp(`${L_AVAIL_CREDIT.source}[^₹\\d]{0,40}₹?\\s*${MONEY}`, 'i'))?.[1] ?? null
//     )
//   );

//   // card type
//   const cardType =
//     text.match(/(?:CREDIT\s+CARD\s+STATEMENT[\s\S]{0,160}?|Retail\s+)?(Platinum|Signature|Regalia|Elite|Titanium|Gold|Silver)\b/i)?.[1] ??
//     null;

//   // customer name
//   const customerName =
//     (text.match(/\bMR\s+([A-Z][A-Z\s]+)\b/)?.[1] ??
//      text.match(/\bMS\s+([A-Z][A-Z\s]+)\b/)?.[1] ??
//      text.match(/\bMRS\s+([A-Z][A-Z\s]+)\b/)?.[1] ??
//      text.match(/Dear\s+([A-Za-z ]+)\b/)?.[1] ??
//      null)?.replace(/\s+/g, ' ').trim() ?? null;

//   // card last-4
//   const last4 =
//     text.match(/\*+(\d{4})/)?.[1] ??
//     text.match(/X{2,}\s*(\d{4})/)?.[1] ??
//     text.match(/(?:\d{4})X{6,}(\d{4})/)?.[1] ??
//     text.match(/ending\s+(\d{4})/i)?.[1] ??
//     null;

//   const cardNumber = last4 ? `****${last4}` : null;

//   // Fallback: if no Statement Date but we have a Statement Period like "21 Sep 2025 to 20 Oct 2025"
//   if (!statementDate) {
//     const period = text.match(new RegExp(`${L_STATEMENT_PERIOD.source}[^\\n\\r:]*:?\\s*([A-Za-z0-9\\s\\/-]+?)\\s*(?:to|-|–)\\s*(${ANY_DATE})`, 'i'));
//     if (period?.[2]) {
//       // prefer the end date of the period
//       const end = period[2].trim();
//       // simple normalization: if it’s dd/mm/yyyy-like, keep as-is; otherwise return the matched string
//       // (You can add a proper date formatter if needed.)
//       return {
//         statementDate: end,
//         paymentDueDate,
//         totalAmountDue,
//         creditLimit,
//         cardType,
//         customerName,
//         cardNumber,
//         minimumDue,
//         availableCredit,
//         provider,
//       };
//     }
//   }

//   return {
//     statementDate,
//     paymentDueDate,
//     totalAmountDue,
//     creditLimit,
//     cardType,
//     customerName,
//     cardNumber,
//     minimumDue,
//     availableCredit,
//     provider,
//   };
// };

// /* ============== PDF text assembly (dual-pass) ============== */
// const joinInItemOrder = (items: any[]) => (items as any[]).map(it => it.str).join(' ');

// const getSortedPageText = async (page: pdfjsLib.PDFPageProxy): Promise<string> => {
//   const textContent = await page.getTextContent();
//   const items = (textContent.items as any[]).map((it: any) => {
//     const t = it.transform || it.fontMatrix || [0, 0, 0, 0, 0, 0];
//     return { str: it.str, x: t[4] ?? 0, y: t[5] ?? 0 };
//   });
//   items.sort((a, b) => (b.y - a.y) || (a.x - b.x)); // top->bottom, left->right
//   return items.map(i => i.str).join(' ');
// };

// const getUnsortedPageText = async (page: pdfjsLib.PDFPageProxy): Promise<string> => {
//   const textContent = await page.getTextContent();
//   return joinInItemOrder(textContent.items as any[]);
// };

// /* ============== Public API ============== */
// export const parsePDF = async (file: File): Promise<ParsedData> => {
//   try {
//     const arrayBuffer = await file.arrayBuffer();
//     const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

//     // Pass A: sorted; Pass B: unsorted
//     let sortedText = '';
//     let rawText = '';

//     const pagesToRead = Math.min(pdf.numPages, 3);
//     for (let i = 1; i <= pagesToRead; i++) {
//       const page = await pdf.getPage(i);
//       sortedText += (await getSortedPageText(page)) + '\n';
//       rawText += (await getUnsortedPageText(page)) + '\n';
//     }

//     const sortedResult = extractDataFromText(sortedText);
//     const rawResult = extractDataFromText(rawText);

//     // pick the result with more non-null fields
//     const score = (r: ParsedData) =>
//       Object.values(r).reduce((acc, v) => acc + (v ? 1 : 0), 0);

//     const finalResult = score(sortedResult) >= score(rawResult) ? sortedResult : rawResult;

//     // Debug preview
//     console.log('=== EXTRACTED TEXT (sorted, first 1200) ===');
//     console.log(sortedText.slice(0, 1200));
//     console.log('=== EXTRACTED TEXT (unsorted, first 1200) ===');
//     console.log(rawText.slice(0, 1200));
//     console.log('=== PARSED RESULT ===', finalResult);

//     return finalResult;
//   } catch (err) {
//     console.error('Error parsing PDF:', err);
//     throw new Error("Failed to parse PDF. Please ensure it's a valid credit card statement.");
//   }
// };


import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc =
  `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

export interface ParsedData {
  statementDate: string | null;
  paymentDueDate: string | null;
  totalAmountDue: string | null;
  creditLimit: string | null;
  cardType: string | null;
  customerName: string | null;
  cardNumber: string | null;
  minimumDue: string | null;
  availableCredit: string | null;
  provider: string;
}

/* ============== Normalization ============== */
const normalizeText = (raw: string): string => {
  return raw
    // normalize unicode & spacing
    .replace(/\r/g, '\n')
    .replace(/\u00A0/g, ' ')           // NBSP -> space
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{2,}/g, '\n')
    .replace(/[：﹕︓]/g, ':')          // full-width colons -> :
    .replace(/[–—‒]/g, '-')            // dashes -> hyphen
    .replace(/`/g, '₹')                // backtick sometimes used for ₹
    .replace(/\bRs\.?\s*/gi, '₹')      // Rs. -> ₹
    .replace(/\bINR\s*/gi, '₹')

    // collapse split headings
    .replace(/\b(PAYMENT)\s+(DUE)\s+(DATE)\b/gi, 'PAYMENT DUE DATE')
    .replace(/\b(STATEMENT)\s+(DATE)\b/gi, 'STATEMENT DATE')
    .replace(/\b(TOTAL)\s+(AMOUNT)\s+(DUE)\b/gi, 'TOTAL AMOUNT DUE')
    .replace(/\b(MINIMUM)\s+(AMOUNT)\s+(DUE)\b/gi, 'MINIMUM AMOUNT DUE')

    // 🔧 RE-ADDED: normalize “Payment due by/on” & “Pay by” to the canonical label
    .replace(/\b(Payment)\s+(Due)\s+(by|on)\b/gi, 'PAYMENT DUE DATE')  // 🔧
    .replace(/\b(Pay)\s+by\b/gi, 'PAYMENT DUE DATE')                   // 🔧

    .trim();
};

/* ============== Provider ============== */
const detectProvider = (text: string): string => {
  const providers = [
    { name: 'ICICI Bank', keywords: ['ICICI BANK', 'iMobile', 'GST Number', 'Vadodara'] },
    { name: 'HDFC Bank', keywords: ['HDFC', 'Regalia'] },
    { name: 'SBI Card', keywords: ['SBI CARD', 'State Bank'] },
    { name: 'Axis Bank', keywords: ['AXIS BANK', 'Burgundy'] },
    { name: 'Kotak Mahindra', keywords: ['KOTAK', 'Mahindra'] },
  ];
  const U = text.toUpperCase();
  for (const p of providers) if (p.keywords.some(k => U.includes(k))) return p.name;
  return 'Unknown Provider';
};

const formatINR = (n: string | null) => (n ? `₹${n.replace(/[^\d.,-]/g, '').trim()}` : null);

/* ============== Windowed Extraction Helpers ============== */
// find the next token after a label within a window of characters
const getAfter = (
  text: string,
  label: RegExp,
  value: RegExp,
  windowChars = 120
): string | null => {
  const m = text.match(label);
  if (!m) return null;
  const idx = m.index! + m[0].length;
  const slice = text.slice(idx, idx + windowChars);
  const v = slice.match(value);
  return v?.[1]?.trim() ?? null;
};

// try multiple labels until one hits
const firstOf = (...vals: Array<string | null | undefined>) => vals.find(Boolean) ?? null;

/* ============== Patterns ============== */
// Dates: Oct 20, 2025 | 20 Oct 2025 | 20/10/2025 | 20-10-2025 | 20-Oct-2025
const MONTH = '(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*';
const DMY1 = `\\d{1,2}[\\/-]\\d{1,2}[\\/-]\\d{2,4}`;                    // 20/10/2025
const DMY2 = `\\d{1,2}[-\\s]${MONTH}[-\\s]\\d{2,4}`;                    // 20-Oct-2025
const MDY1 = `${MONTH}\\s+\\d{1,2},?\\s+\\d{4}`;                        // October 20, 2025
const DMY3 = `\\d{1,2}\\s+${MONTH}\\s+\\d{4}`;                          // 20 Oct 2025
const ANY_DATE = `(${MDY1}|${DMY2}|${DMY3}|${DMY1})`;

const MONEY = '([0-9][\\d,]*\\.?\\d{0,2})';
const MONEY_OPT_SYM = new RegExp(`[:\\s]*₹?\\s*${MONEY}`, 'i');

// labels (accept minor variants)
const L_STATEMENT_DATE = /STATEMENT\s+DATE\b/i;
const L_STATEMENT_AS_ON = /Statement\s+as\s+on\b/i;
const L_STATEMENT_PERIOD = /STATEMENT\s+PERIOD\b|Billing\s+Period\b/i;

// already broad from previous step; keeping as-is
const L_DUE_DATE = /PAYMENT\s+DUE\s+DATE\b|Payment\s+Due\s+Date\b|Payment\s+due\s+(?:by|on)\b|Pay\s+by\b|Due\s+Date\b/i;

const L_TOTAL_DUE = /TOTAL\s+AMOUNT\s+DUE\b|Amount\s+Due\b|Total\s+Due\b/i;
const L_MIN_DUE = /MINIMUM\s+(?:AMOUNT\s+)?DUE\b/i;
const L_CREDIT_LIMIT = /CREDIT\s+LIMIT\b|Total\s+Credit\s+Limit\b|Overall\s+Limit\b/i;
const L_AVAIL_CREDIT = /AVAILABLE\s+CREDIT\b/i;

/* ============== Core extraction ============== */
const extractDataFromText = (rawText: string): ParsedData => {
  const text = normalizeText(rawText);
  const provider = detectProvider(text);

  // statement date: direct or from "Statement as on"
  const statementDate =
    firstOf(
      getAfter(text, new RegExp(`${L_STATEMENT_DATE.source}\\s*:?\\s*`, 'i'), new RegExp(ANY_DATE, 'i')),
      getAfter(text, new RegExp(`${L_STATEMENT_AS_ON.source}\\s*:?\\s*`, 'i'), new RegExp(ANY_DATE, 'i'))
    );

  // 🔧 CHANGED: widen window + add regex fallback in case the date is farther away
  const paymentDueDate =
    firstOf(
      getAfter(text, new RegExp(`${L_DUE_DATE.source}\\s*:?\\s*`, 'i'), new RegExp(ANY_DATE, 'i'), 300), // 🔧 window 300
      text.match(new RegExp(`${L_DUE_DATE.source}[^A-Za-z0-9]{0,300}${ANY_DATE}`, 'i'))?.[1] ?? null    // 🔧 fallback
    );

  // total amount due
  const totalAmountDue = formatINR(
    firstOf(
      getAfter(text, new RegExp(`${L_TOTAL_DUE.source}`, 'i'), MONEY_OPT_SYM),
      text.match(new RegExp(`${L_TOTAL_DUE.source}\\s*:?\\s*₹?\\s*${MONEY}`, 'i'))?.[1] ?? null
    )
  );

  // minimum amount due
  const minimumDue = formatINR(
    firstOf(
      getAfter(text, L_MIN_DUE, MONEY_OPT_SYM),
      text.match(new RegExp(`${L_MIN_DUE.source}\\s*:?\\s*₹?\\s*${MONEY}`, 'i'))?.[1] ?? null
    )
  );

  // credit limit (kept from your last step)
  const creditLimit = formatINR(
    firstOf(
      getAfter(text, L_CREDIT_LIMIT, MONEY_OPT_SYM, 260),
      text.match(new RegExp(`${L_CREDIT_LIMIT.source}[^₹\\d]{0,240}₹?\\s*${MONEY}`, 'i'))?.[1] ??
      text.match(new RegExp(`${MONEY}\\s*(?:₹)?[^\\n\\r]{0,40}(?:${L_CREDIT_LIMIT.source})`, 'i'))?.[1] ??
      null
    )
  );

  // available credit
  const availableCredit = formatINR(
    firstOf(
      getAfter(text, L_AVAIL_CREDIT, MONEY_OPT_SYM),
      text.match(new RegExp(`${L_AVAIL_CREDIT.source}[^₹\\d]{0,40}₹?\\s*${MONEY}`, 'i'))?.[1] ?? null
    )
  );

  // card type (kept from your last step)
  const cardType =
    text.match(/Card\s*Type\s*:\s*([A-Za-z ]+?)(?:\s{2,}|$|,|;)/i)?.[1]?.trim() ??
    text.match(/(?:CREDIT\s+CARD\s+STATEMENT[\s\S]{0,160}?|Retail[\s_\/]+)?(Platinum|Signature|Regalia|Elite|Titanium|Gold|Silver)\b/i)?.[1] ??
    null;

  // customer name
  const customerName =
    (text.match(/\bMR\s+([A-Z][A-Z\s]+)\b/)?.[1] ??
     text.match(/\bMS\s+([A-Z][A-Z\s]+)\b/)?.[1] ??
     text.match(/\bMRS\s+([A-Z][A-Z\s]+)\b/)?.[1] ??
     text.match(/Dear\s+([A-Za-z ]+)\b/)?.[1] ??
     null)?.replace(/\s+/g, ' ').trim() ?? null;

  // card last-4
  const last4 =
    text.match(/\*+(\d{4})/)?.[1] ??
    text.match(/X{2,}\s*(\d{4})/)?.[1] ??
    text.match(/(?:\d{4})X{6,}(\d{4})/)?.[1] ??
    text.match(/ending\s+(\d{4})/i)?.[1] ??
    null;

  const cardNumber = last4 ? `****${last4}` : null;

  // Fallback: if no Statement Date but we have a Statement Period like "21 Sep 2025 to 20 Oct 2025"
  if (!statementDate) {
    const period = text.match(new RegExp(`${L_STATEMENT_PERIOD.source}[^\\n\\r:]*:?\\s*([A-Za-z0-9\\s\\/-]+?)\\s*(?:to|-|–)\\s*(${ANY_DATE})`, 'i'));
    if (period?.[2]) {
      const end = period[2].trim();
      return {
        statementDate: end,
        paymentDueDate,
        totalAmountDue,
        creditLimit,
        cardType,
        customerName,
        cardNumber,
        minimumDue,
        availableCredit,
        provider,
      };
    }
  }

  return {
    statementDate,
    paymentDueDate,
    totalAmountDue,
    creditLimit,
    cardType,
    customerName,
    cardNumber,
    minimumDue,
    availableCredit,
    provider,
  };
};

/* ============== PDF text assembly (dual-pass) ============== */
const joinInItemOrder = (items: any[]) => (items as any[]).map(it => it.str).join(' ');

const getSortedPageText = async (page: pdfjsLib.PDFPageProxy): Promise<string> => {
  const textContent = await page.getTextContent();
  const items = (textContent.items as any[]).map((it: any) => {
    const t = it.transform || it.fontMatrix || [0, 0, 0, 0, 0, 0];
    return { str: it.str, x: t[4] ?? 0, y: t[5] ?? 0 };
  });
  items.sort((a, b) => (b.y - a.y) || (a.x - b.x)); // top->bottom, left->right
  return items.map(i => i.str).join(' ');
};

const getUnsortedPageText = async (page: pdfjsLib.PDFPageProxy): Promise<string> => {
  const textContent = await page.getTextContent();
  return joinInItemOrder(textContent.items as any[]);
};

/* ============== Public API ============== */
export const parsePDF = async (file: File): Promise<ParsedData> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    // Pass A: sorted; Pass B: unsorted
    let sortedText = '';
    let rawText = '';

    const pagesToRead = Math.min(pdf.numPages, 3);
    for (let i = 1; i <= pagesToRead; i++) {
      const page = await pdf.getPage(i);
      sortedText += (await getSortedPageText(page)) + '\n';
      rawText += (await getUnsortedPageText(page)) + '\n';
    }

    const sortedResult = extractDataFromText(sortedText);
    const rawResult = extractDataFromText(rawText);

    // pick the result with more non-null fields
    const score = (r: ParsedData) =>
      Object.values(r).reduce((acc, v) => acc + (v ? 1 : 0), 0);

    const finalResult = score(sortedResult) >= score(rawResult) ? sortedResult : rawResult;

    // filename fallback for Card Type (kept from prior step)
    if (!finalResult.cardType && (file as any)?.name) {
      const m = ((file as any).name as string).match(/(Platinum|Signature|Regalia|Elite|Titanium|Gold|Silver)/i);
      if (m) finalResult.cardType = m[1];
    }

    // Debug preview
    console.log('=== EXTRACTED TEXT (sorted, first 1200) ===');
    console.log(sortedText.slice(0, 1200));
    console.log('=== EXTRACTED TEXT (unsorted, first 1200) ===');
    console.log(rawText.slice(0, 1200));
    console.log('=== PARSED RESULT ===', finalResult);

    return finalResult;
  } catch (err) {
    console.error('Error parsing PDF:', err);
    throw new Error("Failed to parse PDF. Please ensure it's a valid credit card statement.");
  }
};
