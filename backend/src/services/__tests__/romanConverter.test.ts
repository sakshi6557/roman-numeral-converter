import { toRoman } from '../romanConverter';

describe('toRoman', () => {
  test('converts basic numbers correctly', () => {
    expect(toRoman(1)).toBe('I');
    expect(toRoman(3)).toBe('III');
    expect(toRoman(7)).toBe('VII');
    expect(toRoman(56)).toBe('LVI');
    expect(toRoman(100)).toBe('C');
  });

  test('handles subtractive notation correctly', () => {
    expect(toRoman(4)).toBe('IV');
    expect(toRoman(49)).toBe('XLIX');
    expect(toRoman(99)).toBe('XCIX');
    expect(toRoman(400)).toBe('CD');
    expect(toRoman(949)).toBe('CMXLIX');
    expect(toRoman(999)).toBe('CMXCIX');
  });

  test('converts complex numbers correctly', () => {
    expect(toRoman(1984)).toBe('MCMLXXXIV');
    expect(toRoman(2023)).toBe('MMXXIII');
    expect(toRoman(1776)).toBe('MDCCLXXVI');
  });

  test('handles edge cases', () => {
    expect(toRoman(1)).toBe('I');
    expect(toRoman(3999)).toBe('MMMCMXCIX');
  });
}); 