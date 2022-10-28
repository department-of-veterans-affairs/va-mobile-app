/**
 * Finds VA in a phrase and converts VA into V-A
 * @param phrase - string that includes 'VA' in its content
 *
 * ex. 'also update on VA.gov.' into 'also update on  V-A .gov.'
 * ex. 'About VA disability ratings' into 'About  V-A  disability ratings'
 */
// TODO added in as part of ticket(#3803) AC but not used yet
export const a11yLabelVA = (phrase: string): string => {
  return phrase.replace(/VA/g, ' V-A ')
}
