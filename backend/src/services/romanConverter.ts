/**
 * Service for converting numbers to Roman numerals.
 * Implements the standard Roman numeral conversion rules including subtractive notation.
 * 
 * @module romanConverter
 * @category Services
 */

/**
 * Type definition for Roman numeral mapping
 * @typedef {[number, string]} RomanMapEntry
 * @property {number} 0 - Decimal value
 * @property {string} 1 - Roman numeral symbol
 */
type RomanMapEntry = [number, string];

/**
 * Mapping of decimal numbers to Roman numeral symbols.
 * Ordered from largest to smallest to ensure proper conversion.
 * Includes subtractive notation pairs (e.g., IV for 4, IX for 9).
 * 
 * @type {RomanMapEntry[]}
 * @private
 * @constant
 */
const ROMAN_MAP: readonly RomanMapEntry[] = [
  [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
  [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
  [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
] as const;

/**
 * Converts a number to its Roman numeral representation.
 * Uses subtractive notation for numbers like 4 (IV), 9 (IX), etc.
 * 
 * @param {number} num - The number to convert (must be between 1 and 3999)
 * @returns {string} The Roman numeral representation of the input number
 * @throws {RangeError} If the input number is not between 1 and 3999
 * 
 * @example
 * // returns 'IV'
 * toRoman(4);
 * 
 * @example
 * // returns 'MCMLXXXIV'
 * toRoman(1984);
 * 
 * @example
 * // returns 'MMMCMXCIX'
 * toRoman(3999);
 * 
 * @example
 * // throws RangeError
 * toRoman(0);
 * 
 * @example
 * // throws RangeError
 * toRoman(4000);
 */
export function toRoman(num: number): string {
  if (num < 1 || num > 3999) {
    throw new RangeError('Number must be between 1 and 3999');
  }

  let result = '';
  let remaining = num;

  for (const [val, sym] of ROMAN_MAP) {
    const count = Math.floor(remaining / val);
    if (count > 0) {
      result += sym.repeat(count);
      remaining %= val;
    }
  }

  return result;
}

/**
 * Time Complexity: O(n) where n is the number of Roman numeral symbols
 * Space Complexity: O(1) constant space
 */
