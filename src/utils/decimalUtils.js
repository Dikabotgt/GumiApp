/**
 * GumiGenk Journal — Decimal Utilities
 * Helper functions for dynamic precision detection
 */

/**
 * Mendeteksi jumlah angka di belakang koma dari sebuah input.
 * @param {number|string} value - Nilai yang ingin dicek
 * @returns {number} Jumlah desimal
 */
export const getDecimalCount = (value) => {
  if (value === undefined || value === null || value === '') return 0;
  
  const str = value.toString();
  if (str.includes('.')) {
    return str.split('.')[1].length;
  }
  return 0;
};

/**
 * Membulatkan angka berdasarkan presisi desimal tertentu.
 * Menanggulangi issue float precision (misal 1.0000000000001)
 * @param {number} num - Angka yang ingin dibulatkan
 * @param {number} decimals - Jumlah desimal
 * @returns {number} Hasil pembulatan
 */
export const roundTo = (num, decimals) => {
  if (isNaN(num)) return 0;
  const factor = 10 ** decimals;
  return Math.round(num * factor) / factor;
};
