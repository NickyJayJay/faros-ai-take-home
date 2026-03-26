/**
 * PII (Personally Identifiable Information) filter for AI-generated text.
 *
 * Scans for and redacts common PII patterns before rendering.
 * Each redaction type is tracked (but the actual PII value is NEVER logged).
 */

export type PIIType = 'ssn' | 'phone' | 'email' | 'address' | 'dob';

export interface PIIFilterResult {
  /** Sanitized text with PII replaced by [REDACTED] */
  text: string;
  /** Whether any PII was detected and redacted */
  piiDetected: boolean;
  /** Types of PII that were redacted */
  redactedTypes: PIIType[];
}

// --- Patterns ---

// SSN: 3-2-4 digit format (e.g. 123-45-6789)
const SSN_PATTERN = /\b\d{3}-\d{2}-\d{4}\b/g;

// Phone: (xxx) xxx-xxxx with optional space, OR xxx-xxx-xxxx hyphen-only format
const PHONE_PATTERN = /\(\d{3}\)\s?\d{3}-\d{4}|\b\d{3}-\d{3}-\d{4}\b/g;

// Personal email: patterns like "name.personal42@gmail.com" or broader personal-ish emails
// Also catches any email mentioned near "personal email" context
const PERSONAL_EMAIL_PATTERN = /\b[a-zA-Z0-9._%+-]+\.personal\d*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/gi;

// Home address: number + street name + street type, city, state abbreviation + zip
const ADDRESS_PATTERN =
  /\d+\s+\w+\s+(?:Street|Avenue|Lane|Drive|Court|Blvd|Boulevard|Road|Way|Place|Circle),\s*\w+,\s*[A-Z]{2}\s*\d{5}/g;

// Date of birth: "Date of birth: M/D/YYYY" or "DOB: M/D/YYYY" (slashes or hyphens)
const DOB_CONTEXT_PATTERN = /(?:Date of birth|DOB)[:\s]*\d{1,2}[/-]\d{1,2}[/-]\d{4}/gi;

const PATTERNS: { type: PIIType; regex: RegExp }[] = [
  { type: 'ssn', regex: SSN_PATTERN },
  { type: 'phone', regex: PHONE_PATTERN },
  { type: 'email', regex: PERSONAL_EMAIL_PATTERN },
  { type: 'address', regex: ADDRESS_PATTERN },
  { type: 'dob', regex: DOB_CONTEXT_PATTERN },
];

const REDACTED = '[REDACTED]';

/**
 * Scans text for PII patterns and replaces them with [REDACTED].
 * Returns the sanitized text along with metadata about what was found.
 */
export function filterPII(text: string): PIIFilterResult {
  const redactedTypes = new Set<PIIType>();
  let sanitized = text;

  for (const { type, regex } of PATTERNS) {
    // Reset regex lastIndex since we're reusing global regexes
    regex.lastIndex = 0;
    if (regex.test(sanitized)) {
      redactedTypes.add(type);
      regex.lastIndex = 0;
      sanitized = sanitized.replace(regex, REDACTED);
    }
  }

  return {
    text: sanitized,
    piiDetected: redactedTypes.size > 0,
    redactedTypes: [...redactedTypes],
  };
}
