/**
 * Adds a dash between payment type and amount
 * Fixes issue where VoiceOver misreads amount when payment type ends with a number
 * @param paymentType - string that represents the payment type
 * @param amount - string that represents the amount
 *
 * ex. 'Regular Chapter 31 $603.33'
 */
export const a11yLabelPaymentTypeAmount = (paymentType: string, amount: string): string => {
  return `${paymentType}/${amount}`
}
