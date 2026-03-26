import { describe, it, expect } from 'vitest';
import { filterPII } from '../pii-filter';

describe('filterPII', () => {
  it('returns original text when no PII is present', () => {
    const input = 'Alice has been contributing across the frontend team.';
    const result = filterPII(input);
    expect(result.text).toBe(input);
    expect(result.piiDetected).toBe(false);
    expect(result.redactedTypes).toEqual([]);
  });

  // SSN patterns
  describe('SSN detection', () => {
    it('redacts SSN in xxx-xx-xxxx format', () => {
      const input = 'Note: SSN on file is 123-45-6789.';
      const result = filterPII(input);
      expect(result.text).toBe('Note: SSN on file is [REDACTED].');
      expect(result.piiDetected).toBe(true);
      expect(result.redactedTypes).toContain('ssn');
    });

    it('redacts multiple SSNs', () => {
      const input = 'SSN: 111-22-3333 and 444-55-6666';
      const result = filterPII(input);
      expect(result.text).not.toContain('111-22-3333');
      expect(result.text).not.toContain('444-55-6666');
    });
  });

  // Phone patterns
  describe('phone detection', () => {
    it('redacts phone in (xxx) xxx-xxxx format', () => {
      const input = 'Their personal phone is (415) 555-1234.';
      const result = filterPII(input);
      expect(result.text).toBe('Their personal phone is [REDACTED].');
      expect(result.redactedTypes).toContain('phone');
    });

    it('redacts phone without space after area code', () => {
      const input = 'Call (415)555-1234 for details.';
      const result = filterPII(input);
      expect(result.text).toBe('Call [REDACTED] for details.');
      expect(result.text).not.toContain('(415)555-1234');
    });

    it('redacts hyphen-only phone format (xxx-xxx-xxxx)', () => {
      const input = 'Reach them at 415-555-1234 for more info.';
      const result = filterPII(input);
      expect(result.text).toBe('Reach them at [REDACTED] for more info.');
      expect(result.redactedTypes).toContain('phone');
    });

    it('does not confuse SSN (3-2-4) with hyphen phone (3-3-4)', () => {
      const input = 'SSN 123-45-6789 and phone 123-456-7890';
      const result = filterPII(input);
      expect(result.text).not.toContain('123-45-6789');
      expect(result.text).not.toContain('123-456-7890');
      expect(result.redactedTypes).toContain('ssn');
      expect(result.redactedTypes).toContain('phone');
    });
  });

  // Personal email patterns
  describe('personal email detection', () => {
    it('redacts personal email pattern', () => {
      const input = 'Personal email: alice.personal42@gmail.com was found.';
      const result = filterPII(input);
      expect(result.text).toBe('Personal email: [REDACTED] was found.');
      expect(result.text).not.toContain('gmail.com');
      expect(result.redactedTypes).toContain('email');
    });
  });

  // Address patterns
  describe('address detection', () => {
    it('redacts home address', () => {
      const input = 'Home address: 1234 Oak Street, Springfield, IL 62701.';
      const result = filterPII(input);
      expect(result.text).toContain('[REDACTED]');
      expect(result.text).not.toContain('1234 Oak Street');
      expect(result.redactedTypes).toContain('address');
    });

    it('redacts various street types', () => {
      const inputs = [
        '42 Elm Avenue, Portland, OR 97201',
        '100 Cedar Lane, Madison, WI 53703',
        '7 Pine Drive, Fairview, CA 94000',
        '88 Birch Court, Clinton, NY 10001',
      ];
      for (const addr of inputs) {
        const result = filterPII(addr);
        expect(result.piiDetected).toBe(true);
        expect(result.redactedTypes).toContain('address');
      }
    });
  });

  // DOB patterns
  describe('DOB detection', () => {
    it('redacts date of birth with context', () => {
      const input = 'Date of birth: 3/15/1990.';
      const result = filterPII(input);
      expect(result.text).toContain('[REDACTED]');
      expect(result.text).not.toContain('3/15/1990');
      expect(result.redactedTypes).toContain('dob');
    });

    it('redacts DOB abbreviation', () => {
      const input = 'DOB: 12/1/1985 was listed.';
      const result = filterPII(input);
      expect(result.piiDetected).toBe(true);
      expect(result.redactedTypes).toContain('dob');
    });

    it('redacts DOB with hyphen-delimited date', () => {
      const input = 'Date of birth: 03-15-1990.';
      const result = filterPII(input);
      expect(result.text).toContain('[REDACTED]');
      expect(result.text).not.toContain('03-15-1990');
      expect(result.redactedTypes).toContain('dob');
    });

    it('redacts DOB abbreviation with hyphens', () => {
      const input = 'DOB: 12-01-1985 was listed.';
      const result = filterPII(input);
      expect(result.piiDetected).toBe(true);
      expect(result.redactedTypes).toContain('dob');
    });

    it('does not flag hyphen dates without DOB context', () => {
      const input = 'The deadline is 03-15-2025 and review is 04-01-2025.';
      const result = filterPII(input);
      expect(result.redactedTypes).not.toContain('dob');
    });
  });

  // Multiple PII types
  it('redacts multiple PII types in one text', () => {
    const input =
      'Alice has phone (555) 123-4567. Note: SSN on file is 123-45-6789. Home address: 42 Oak Street, Portland, OR 97201.';
    const result = filterPII(input);
    expect(result.text).not.toContain('(555)');
    expect(result.text).not.toContain('123-45-6789');
    expect(result.text).not.toContain('42 Oak Street');
    expect(result.piiDetected).toBe(true);
    expect(result.redactedTypes).toContain('ssn');
    expect(result.redactedTypes).toContain('phone');
    expect(result.redactedTypes).toContain('address');
  });

  // Edge cases
  it('does not produce false positives for normal dates', () => {
    const input = 'The sprint ends on 3/15/2024 and the review is 4/1/2024.';
    const result = filterPII(input);
    // These dates are NOT preceded by DOB/Date of birth context
    expect(result.redactedTypes).not.toContain('dob');
  });

  it('handles empty string', () => {
    const result = filterPII('');
    expect(result.text).toBe('');
    expect(result.piiDetected).toBe(false);
  });

  it('is idempotent — running filter twice yields same result', () => {
    const input = 'Phone: (555) 123-4567 and SSN: 123-45-6789';
    const first = filterPII(input);
    const second = filterPII(first.text);
    expect(second.text).toBe(first.text);
    expect(second.piiDetected).toBe(false);
  });
});
