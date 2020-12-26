/**
 * Calculates `dividend` mod `divisor`, maintaining the divisors's sign. If
 * `divisor` is positive, the result will be in the half-open interval
 * [0, divisor). If `divisor` is negative, the result will be in (-divisor, 0].
 *
 * @param dividend
 * @param divisor
 */
export function mod(dividend: number, divisor: number): number {
  return ((dividend % divisor) + divisor) % divisor;
}
