/**
 * Returns the formatted phone number
 *
 * @param phoneNumber: string signifying phone number w/ area code, i.e. 0001234567
 * @returns string formatted for phone number
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  return `(${phoneNumber.substring(0, 3)})-${phoneNumber.substring(3, 6)}-${phoneNumber.substring(6)}`
}
