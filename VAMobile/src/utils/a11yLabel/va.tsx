/**
 * Finds VA in a phrase and converts VA into V-A. Also adds space before period when
 * va.gov appears at end of sentence to avoid VoiceOver announcing as "VA dot governor"
 * @param phrase - string that includes 'VA' in its content
 *
 * ex. 'also update on VA.gov.' into 'also update on  V-A .gov .'
 * ex. 'About VA disability ratings' into 'About  V-A  disability ratings'
 */

export const a11yLabelVA = (phrase: string): string => {
  return phrase.replace(/VA\.gov\./gi, 'VA.gov .').replace(/VA/g, ' V-A ')
}
