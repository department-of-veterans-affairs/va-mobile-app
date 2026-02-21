/*
Description:
Shared data and navigation logic for the Navigation accessibility test suite.
When to update:
Update navigationDic whenever a new feature/page with the bottom nav bar is added to the app.
See https://department-of-veterans-affairs.github.io/va-mobile-app/docs/QA/QualityAssuranceProcess/Automation/AddingNewFeatures for more information.
*/
import { exec } from 'child_process'
import { by, device, element, expect, waitFor } from 'detox'

import { CommonE2eIdConstants } from './utils'

const ACCOUNT_SECURITY_LONG_TEXT =
  'To access or update your sign-in information, go to the website where you manage your account information. Any updates you make there will automatically update on the mobile app.'

export const navigationValue: string | undefined = process.argv[7] ?? process.argv[6]

export const getTestName = (nameArray: any[]): string => {
  const name = nameArray[2] as string
  return name === ACCOUNT_SECURITY_LONG_TEXT ? 'Account security' : name
}

export const shouldRunTest = (nameArray: any[], value: any[]): boolean => {
  if (navigationValue === undefined) return true
  if (nameArray[0] instanceof Array) {
    for (let z = 0; z < value.length; z++) {
      if (navigationValue === nameArray[0][z]) return true
    }
    return false
  }
  return navigationValue === nameArray[0]
}

export const execCommand = (command: string) => {
  exec(command, (error: Error | null) => {
    if (error) {
      console.error(`exec error: ${error}`)
    }
  })
}

export const navigationDic = {
  Home: [
    ['HomeScreen.e2e', 'Contact us', 'Contact VA'],
    [
      ['ProfileScreen.e2e', 'PersonalInformationScreen.e2e'],
      ['Profile', 'Personal information'],
      'Personal information',
    ],
    [['ProfileScreen.e2e', 'ContactInformation.e2e'], ['Profile', 'Contact information'], 'Contact information'],
    [['ProfileScreen.e2e', 'MilitaryInformation.e2e'], ['Profile', 'Military information'], 'Military information'],
    [['ProfileScreen.e2e', 'SettingsScreen.e2e'], ['Profile', 'Settings'], 'Settings'],
    [
      ['ProfileScreen.e2e', 'SettingsScreen.e2e'],
      ['Profile', 'Settings', 'Account security'],
      'To access or update your sign-in information, go to the website where you manage your account information. Any updates you make there will automatically update on the mobile app.',
    ],
    [['ProfileScreen.e2e', 'SettingsScreen.e2e'], ['Profile', 'Settings', 'Notifications'], 'Notifications'],
  ],
  Benefits: [
    ['DisabilityRatings.e2e', 'Disability rating', 'Disability rating'],
    ['Claims.e2e', 'Claims', 'Claims'],
    ['Claims.e2e', ['Claims', 'Claims history'], 'Claims history'],
    ['Claims.e2e', ['Claims', 'Claims history', 'Closed'], 'Your closed claims, decision reviews, and appeals'],
    ['Claims.e2e', ['Claims', 'Claims history', 'Active'], 'Your active claims, decision reviews, and appeals'],
    ['Claims.e2e', ['Claims', 'Claims history', 'Received July 20, 2021'], 'Claim details'],
    //['Claims.e2e', ['Claims', 'Claims history', 'Received July 20, 2021', 'Submit evidence'], 'Submit evidence'],
    ['Claims.e2e', ['Claims', 'Claims history', 'Received July 20, 2021', 'Files'], 'JESSE_GRAY_600246732_526.pdf'],
    [['Appeals.e2e', 'AppealsExpanded.e2e'], ['Claims', 'Claims history', 'Received July 17, 2008'], 'Appeal details'],
    [
      ['Appeals.e2e', 'AppealsExpanded.e2e'],
      ['Claims', 'Claims history', 'Received July 17, 2008', 'Issues'],
      'Currently on appeal',
    ],
    ['DecisionLetters.e2e', ['Claims', 'Claim letters'], 'Claim letters'],
    ['VALetters.e2e', 'VA letters and documents', 'Letters'],
    ['VALetters.e2e', ['VA letters and documents', 'Review letters'], 'Review letters'],
    [
      'VALetters.e2e',
      ['VA letters and documents', 'Review letters', 'Benefit summary and service verification letter'],
      'Letter details',
    ],
  ],
  Health: [
    [['Appointments.e2e', 'AppointmentsExpanded.e2e'], 'Appointments', 'Appointments'],
    [['Appointments.e2e', 'AppointmentsExpanded.e2e'], ['Appointments', 'Vilanisi Reddy'], 'Details'],
    ['Messages.e2e', 'Messages', 'Messages'],
    ['Messages.e2e', ['Messages', 'Medication: Naproxen side effects'], 'Review message'],
    ['Prescriptions.e2e', 'Prescriptions', 'Prescriptions'],
    ['Prescriptions.e2e', ['Prescriptions', 'Get prescription details'], 'AMLODIPINE BESYLATE 10MG TAB'],
    ['VaccineRecords.e2e', ['Medical records', 'Vaccines'], 'Vaccines'],
    ['VaccineRecords.e2e', ['Medical records', 'Vaccines', 'January 14, 2021'], 'COVID-19 vaccine'],
    [['Allergies.e2e', 'AllergiesAccelerated.e2e'], ['Medical records', 'Allergies'], 'Allergies'],
    [
      ['Allergies.e2e', 'AllergiesAccelerated.e2e'],
      ['Medical records', 'Allergies', 'January 10, 2023'],
      'Penicillins allergy',
    ],
  ],
  Payments: [
    ['Payments.e2e', 'VA payment history', 'History'],
    ['Payments.e2e', ['VA payment history', 'Regular Chapter 31'], 'Regular Chapter 31'],
    ['DirectDeposit.e2e', 'Direct deposit information', 'Direct deposit'],
  ],
}

export const featureID = {
  Home: 'homeScreenID',
  'Contact VA': 'homeScreenID',
  'Personal information': 'profileID',
  'Contact information': 'profileID',
  'Military information': 'profileID',
  Settings: 'profileID',
  'Account security': 'settingsID',
  Notifications: 'settingsID',
  Benefits: 'benefitsTestID',
  'Received July 20, 2021': 'claimsHistoryID',
  'Received January 01, 2021': 'claimsHistoryID',
  'Received July 17, 2008': 'claimsHistoryID',
  'Review letters': 'lettersPageID',
  Health: 'healthCategoryTestID',
  Appointments: 'appointmentsTestID',
  'Vilanisi Reddy': 'appointmentsTestID',
  'Claim exam': 'appointmentsTestID',
  'Medication: Naproxen side effects': 'messagesTestID',
  'Drafts (3)': 'messagesTestID',
}

let scrollID

export const navigateToPage = async (key, navigationDicValue) => {
  try {
    await element(by.id(key)).tap()
  } catch (ex) {
    await element(by.text(key)).atIndex(0).tap()
  }
  const navigationArray = navigationDicValue
  if (typeof navigationArray[1] === 'string') {
    if (key in featureID) {
      scrollID = featureID[key]
      await waitFor(element(by.id(scrollID)))
        .toExist()
        .withTimeout(5000)
      await waitFor(element(by.text(navigationArray[1])))
        .toBeVisible()
        .whileElement(by.id(scrollID))
        .scroll(50, 'down')
    } else if (navigationArray[1] in featureID) {
      scrollID = featureID[navigationArray[1]]
      await waitFor(element(by.id(scrollID)))
        .toExist()
        .withTimeout(5000)
      await waitFor(element(by.text(navigationArray[1])))
        .toBeVisible()
        .whileElement(by.id(scrollID))
        .scroll(50, 'down')
    }
    await element(by.text(navigationArray[1])).atIndex(0).tap()
  } else {
    const subNavigationArray = navigationArray[1]
    for (let k = 0; k < subNavigationArray.length - 1; k++) {
      if (subNavigationArray[k] === 'Received July 17, 2008') {
        await waitFor(element(by.text('Received July 17, 2008')))
          .toBeVisible()
          .whileElement(by.id(CommonE2eIdConstants.CLAIMS_HISTORY_SCROLL_ID))
          .scroll(100, 'down')
      } else if (subNavigationArray[k] === 'Files') {
        await element(by.id(CommonE2eIdConstants.CLAIMS_DETAILS_SCREEN_ID)).scrollTo('top')
      }

      if (k === 0 && key in featureID) {
        scrollID = featureID[key]
        await waitFor(element(by.id(scrollID)))
          .toExist()
          .withTimeout(5000)
        await waitFor(element(by.text(subNavigationArray[k])))
          .toBeVisible()
          .whileElement(by.id(scrollID))
          .scroll(50, 'down')
      } else if (subNavigationArray[k] in featureID) {
        scrollID = featureID[subNavigationArray[k]]
        await waitFor(element(by.id(scrollID)))
          .toExist()
          .withTimeout(5000)
        await waitFor(element(by.text(subNavigationArray[k])))
          .toBeVisible()
          .whileElement(by.id(scrollID))
          .scroll(50, 'down')
      } else if (k > 0 && subNavigationArray[k - 1] in featureID) {
        // Fallback: use previous step's scroll ID if current doesn't have one
        scrollID = featureID[subNavigationArray[k - 1]]
        await waitFor(element(by.text(subNavigationArray[k])))
          .toBeVisible()
          .whileElement(by.id(scrollID))
          .scroll(50, 'down')
      }
      await element(by.text(subNavigationArray[k])).tap()
    }

    if (subNavigationArray.slice(-1)[0] === 'Get prescription details') {
      await element(by.id(CommonE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_ID)).scrollTo('top')
      await waitFor(element(by.text('AMLODIPINE BESYLATE 10MG TAB')))
        .toBeVisible()
        .withTimeout(10000)
      try {
        await expect(element(by.text('Get prescription details')).atIndex(0)).toBeVisible()
      } catch (e) {
        await waitFor(element(by.text('Get prescription details')).atIndex(0))
          .toBeVisible()
          .whileElement(by.id(CommonE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_ID))
          .scroll(100, 'down')
      }
      await element(by.text('Get prescription details')).atIndex(0).tap()
      return
    } else if (subNavigationArray.slice(-1)[0] === 'Received June 12, 2008') {
      await waitFor(element(by.text('Received June 12, 2008')))
        .toBeVisible()
        .whileElement(by.id(CommonE2eIdConstants.CLAIMS_HISTORY_SCROLL_ID))
        .scroll(100, 'down')
    } else if (subNavigationArray.slice(-1)[0] === 'Files' || subNavigationArray.slice(-1)[0] === 'Submit evidence') {
      await element(by.id(CommonE2eIdConstants.CLAIMS_DETAILS_SCREEN_ID)).scrollTo('top')
    }

    if (subNavigationArray.slice(-1)[0] in featureID) {
      scrollID = featureID[subNavigationArray.slice(-1)[0]]
      await waitFor(element(by.id(scrollID)))
        .toExist()
        .withTimeout(5000)
      await waitFor(element(by.text(subNavigationArray.slice(-1)[0])))
        .toBeVisible()
        .whileElement(by.id(scrollID))
        .scroll(50, 'down')
    }
    await element(by.text(subNavigationArray.slice(-1)[0]))
      .atIndex(0)
      .tap()
  }
}
