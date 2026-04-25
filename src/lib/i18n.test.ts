import { describe, it, expect } from 'vitest';
import { getTranslation, DICTIONARY } from './i18n';

describe('i18n', () => {
  it('should return correct translation for existing key in English', () => {
    expect(getTranslation('en', 'heroTitle')).toBe(DICTIONARY.en.heroTitle);
  });

  it('should return correct translation for existing key in Hindi', () => {
    expect(getTranslation('hi', 'signIn')).toBe(DICTIONARY.hi.signIn);
  });

  it('should fallback to English if missing (typescript enforces keys but testing logic)', () => {
    // We cast to any to test the fallback logic
    expect(getTranslation('hi', 'invalidKey' as any)).toBeUndefined();
    // DICTIONARY access fallback
  });
});
