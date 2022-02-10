import { DateTime } from 'luxon'
import { Language } from 'utils/i18nTest'
import { UserGreetingTimeConstants as UGTC } from 'store/api'
import { stringToTitleCase } from 'utils/formattingUtils'

type functions = {
  downtimeMessage: (featureName: string, endTime: Date) => string
  editing: (text: string) => string
  error: (error: string) => string
  filled: (value: string) => string
  greetingMessage: (name: string) => string
}

export const Functions: functions = {
  downtimeMessage: downtimeMessage,
  editing: editing,
  error: error,
  filled: filled,
  greetingMessage: greetingMessage,
}

function downtimeMessage(featureName: string, endTime: Date) {
  return featureName + ' on V\ufeffA mobile app is currently unavailable. We’re working to fix this. We intend to restore this by ' + endTime + '. Please check back soon.'
}

function editing(text: string) {
  return 'Editing: ' + text
}

function error(error: string) {
  return 'Error - ' + error
}

function filled(value: string) {
  return 'Filled - ' + value
}

/**
 *
 * @param name - is the name of the logged in User.
 * @returns Good Morning/afternoon/evening name
 */
function greetingMessage(name: string) {
  let greeting
  const currentHour = DateTime.now().toObject()?.hour
  if (currentHour === undefined) {
    greeting = null
  } else if (currentHour >= UGTC.EVENING && currentHour < UGTC.MORNING) {
    greeting = Language.strings['greetings.morning']
  } else if (currentHour >= UGTC.MORNING && currentHour < UGTC.AFTERNOON) {
    greeting = Language.strings['greetings.afternoon']
  } else {
    greeting = Language.strings['greetings.evening']
  }
  return `${greeting}${name ? `, ${stringToTitleCase(name)}` : ''}`
}
