import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('utils.ts', () => {
  it('cn should merge classnames correctly', () => {
    expect(cn('w-full', 'h-full')).toBe('w-full h-full');
    expect(cn('p-4', undefined, null, 'm-4')).toBe('p-4 m-4');
    
    // Tailwind merge feature
    expect(cn('p-4 p-8')).toBe('p-8');
    expect(cn('bg-red-500 bg-blue-500')).toBe('bg-blue-500');
  });
});
