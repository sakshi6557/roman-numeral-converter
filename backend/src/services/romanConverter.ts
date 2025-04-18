/**
 * Service for converting numbers to Roman numerals.
 * Implements the standard Roman numeral conversion rules including subtractive notation.
 * 
 * @module romanConverter
 * @category Services
 */

/**
 * Mapping of  to Roman numeral symbols.
 * Ordered from largest to smallest to ensure proper conversion.
 * Includes subtractive notation pairs (e.g., IV for 4, IX for 9).
 * 
 * @type {Array<[number, string]>}
 * @private
 */
const ROMAN_MAP: [number, string][] = [
  [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
  [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
  [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
];

/**
 * Converts a number to its Roman numeral representation.
 * Uses subtractive notation for numbers like 4 (IV), 9 (IX), etc.
 * 
 * @param {number} num - The number to convert (must be between 1 and 3999)
 * @returns {string} The Roman numeral representation of the input number
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
 */
export function toRoman(num: number): string {
  
  let result = '';
  // Iterate through the mapping, subtracting values and building the result
  for (const [val, sym] of ROMAN_MAP) {
    while (num >= val) {
      result += sym;
      num -= val;
    }
  }
  return result;
} 