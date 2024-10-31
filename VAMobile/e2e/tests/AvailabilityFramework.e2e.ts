import { enableAF, verifyAF } from './utils'

var AFValue = process.argv[7]

const AFNavigationNoIndividual = [
  ['ChildTemplate', 'WG_DisabilityRatings', 'Benefits', 'Disability rating'],
  ['FeatureLandingTemplate', 'WG_PersonalInformation', 'Profile', 'Personal information'],
  [
    'LargePanel',
    'WG_HowDoIUpdate',
    'Profile',
    'Personal information',
    'How to update or fix an error in your legal name',
  ],
  ['FullScreenSubtask', 'WG_PreferredName', 'Profile', 'Personal information', 'Preferred name'],
]

const AFNavigationForIndividual = [
  ['PersonalInformationScreen.e2e', 'WG_PersonalInformation', 'Profile', 'Personal information'],
  [
    'PersonalInformationScreen.e2e',
    'WG_HowDoIUpdate',
    'Profile',
    'Personal information',
    'How to update or fix an error in your legal name',
  ],
  ['PersonalInformationScreen.e2e', 'WG_PreferredName', 'Profile', 'Personal information', 'Preferred name'],
  ['PersonalInformationScreen.e2e', 'WG_GenderIdentity', 'Profile', 'Personal information', 'Gender identity'],
  [
    'PersonalInformationScreen.e2e',
    'WG_WhatToKnow',
    'Profile',
    'Personal information',
    'Gender identity',
    'What to know before you decide to share your gender identity',
  ],
  ['ContactInformation.e2e', 'WG_ContactInformation', 'Profile', 'Contact information'],
  ['ContactInformation.e2e', 'WG_HowWillYou', 'Profile', 'Contact information', 'How we use your contact information'],
  ['ContactInformation.e2e', 'WG_EditAddress', 'Profile', 'Contact information', 'Mailing address'],
  ['ContactInformation.e2e', 'WG_EditPhoneNumber', 'Profile', 'Contact information', 'Mobile'],
  ['ContactInformation.e2e', 'WG_EditEmail', 'Profile', 'Contact information', 'Email address'],
  ['MilitaryInformation.e2e', 'WG_MilitaryInformation', 'Profile', 'Military information'],
  [
    'MilitaryInformation.e2e',
    'WG_IncorrectServiceInfo',
    'Profile',
    'Military information',
    "What if my military service information doesn't look right?",
  ],
  ['SettingsScreen.e2e', 'WG_AccountSecurity', 'Profile', 'Settings', 'Account security'],
  ['SettingsScreen.e2e', 'WG_NotificationsSettings', 'Profile', 'Settings', 'Notifications'],
  ['SettingsScreen.e2e', 'WG_InAppRecruitment', 'Profile', 'Settings', 'Give feedback'],
  ['HomeScreen.e2e', 'WG_ContactVA', 'Home', 'Contact us'],
  ['HomeScreen.e2e', 'WG_SecureMessaging', 'Messages'],
  ['HomeScreen.e2e', 'WG_PrescriptionHistory', 'Prescriptions'],
  ['HomeScreen.e2e', 'WG_ClaimsHistoryScreen', 'Claims'],
  ['HomeScreen.e2e', 'WG_Appointments', 'Appointments'],
  ['VeteransCrisisLine.e2e', 'WG_VeteransCrisisLine', 'Talk to the Veterans Crisis Line now'],
  ['VeteranStatusCard.e2e', 'WG_VeteranStatus', 'Proof of Veteran status'],
  [['Appointments.e2e', 'AppointmentsExpanded.e2e'], 'WG_Appointments', 'Health', 'Appointments'],
  ['Messages.e2e', 'WG_FolderMessages', 'Health', 'Messages', 'Folders', 'Sent'],
  ['Prescriptions.e2e', 'WG_PrescriptionDetails', 'Health', 'Prescriptions', 'Get prescription details'],
  ['Prescriptions.e2e', 'WG_PrescriptionHistory', 'Health', 'Prescriptions'],
  ['Messages.e2e', 'WG_SecureMessaging', 'Health', 'Messages'],
  ['Appointments.e2e', 'WG_UpcomingAppointmentDetails', 'Health', 'Appointments', 'Podiatry'],
  ['Appointments.e2e', 'WG_PastAppointmentDetails', 'Health', 'Appointments', 'Past', 'Podiatry'],
  ['VaccineRecords.e2e', 'WG_VaccineDetails', 'Health', 'V\ufeffA vaccine records', 'January 14, 2021'],
  ['VaccineRecords.e2e', 'WG_VaccineList', 'Health', 'V\ufeffA vaccine records'],
  ['Messages.e2e', 'WG_StartNewMessage', 'Health', 'Messages', 'Start new message'],
  ['Messages.e2e', 'WG_ReplyMessage', 'Health', 'Messages', 'Medication: Naproxen side effects', 'Reply'],
  [
    'Messages.e2e',
    'WG_ReplyHelp',
    'Health',
    'Messages',
    'Medication: Naproxen side effects',
    'Only use messages for non-urgent needs',
  ],
  ['Messages.e2e', 'WG_ViewMessage', 'Health', 'Messages', 'Folders', 'Sent', 'Medication: Naproxen side effects'],
  ['Messages.e2e', 'WG_EditDraft', 'Health', 'Messages', 'Folders', 'Drafts (3)', 'Test: Test Inquiry'],
  [
    'Prescriptions.e2e',
    'WG_RefillRequestSummary',
    'Health',
    'Prescriptions',
    'Get prescription details',
    'Request refill',
    'Request Refill',
  ],
  ['Prescriptions.e2e', 'WG_PrescriptionHelp', 'Health', 'Prescriptions', 'Help'],
  ['Prescriptions.e2e', 'WG_RefillScreenModal', 'Health', 'Prescriptions', 'Start refill request'],
  ['Prescriptions.e2e', 'WG_StatusDefinition', 'Health', 'Prescriptions', 'Active'],
  ['Prescriptions.e2e', 'WG_RefillTrackingModal', 'Health', 'Prescriptions', 'Get prescription tracking'],
  ['Payments.e2e', 'WG_PaymentDetails', 'Payments', 'VA payment history', 'Regular Chapter 31'],
  ['DirectDeposit.e2e', 'WG_DirectDeposit', 'Payments', 'Direct deposit information'],
  ['Payments.e2e', 'WG_PaymentHistory', 'Payments', 'VA payment history'],
  [
    'Payments.e2e',
    'WG_PaymentIssue',
    'Payments',
    'VA payment history',
    'Regular Chapter 31',
    "What if my payment information doesn't look right?",
  ],
  ['Payments.e2e', 'WG_PaymentMissing', 'Payments', 'VA payment history', "What if I'm missing a payment?"],
  [
    'DirectDeposit.e2e',
    'WG_EditDirectDeposit',
    'Payments',
    'Direct deposit information',
    'Add your bank account information',
  ],
  ['DisabilityRatings.e2e', 'WG_DisabilityRatings', 'Benefits', 'Disability rating'],
  [
    ['Claims.e2e', 'Appeals.e2e', 'AppealsExpanded.e2e'],
    'WG_ClaimsHistoryScreen',
    'Benefits',
    'Claims',
    'Claims history',
  ],
  ['Letters.e2e', 'WG_LettersOverview', 'Benefits', 'VA letters and documents'],
  ['Letters.e2e', 'WG_LettersList', 'Benefits', 'VA letters and documents', 'Review letters'],
  [
    'Letters.e2e',
    'WG_BenefitSummaryServiceVerificationLetter',
    'Benefits',
    'VA letters and documents',
    'Review letters',
    'Benefit summary and service verification letter',
  ],
  ['BenefitLetters.e2e', 'WG_ClaimLettersScreen', 'Benefits', 'Claims', 'Claim letters'],
  ['Claims.e2e', 'WG_ClaimDetailsScreen', 'Benefits', 'Claims', 'Claims history', 'Received December 05, 2021'],
  // [
  // 'Claims.e2e',
  // 'WG_SubmitEvidence',
  // 'Benefits',
  // 'Claims',
  // 'Claims history',
  // 'Received December 05, 2021',
  // 'Submit evidence',
  // ],
  ['Appeals.e2e', 'WG_AppealDetailsScreen', 'Benefits', 'Claims', 'Claims history', 'Received July 17, 2008'],
  [
    'Claims.e2e',
    'WG_ConsolidatedClaimsNote',
    'Benefits',
    'Claims',
    'Claims history',
    'Received December 05, 2021',
    'Find out why we sometimes combine claims',
  ],
  [
    'Claims.e2e',
    'WG_WhatDoIDoIfDisagreement',
    'Benefits',
    'Claims',
    'Claims history',
    'Closed',
    'Received January 01, 2021',
    'Learn what to do if you disagree with our decision',
  ],
]

export async function runTests(testRun, AFNavigationArray, x) {
  it('should verify AF use case 1 for: ' + testRun, async () => {
    await enableAF(AFNavigationArray[x][1], 'DenyAccess')
    await verifyAF(AFNavigationArray[x], 'DenyAccess')
  })

  it('should verify AF use case 2 for: ' + testRun, async () => {
    await enableAF(AFNavigationArray[x][1], 'DenyContent')
    await verifyAF(AFNavigationArray[x], 'DenyContent')
  })

  it('should verify AF use case 2 Update available for: ' + testRun, async () => {
    await enableAF(AFNavigationArray[x][1], 'DenyContent', true)
    await verifyAF(AFNavigationArray[x], 'DenyContent', true)
  })
}

describe('AvailabilityFramework', () => {
  if (AFValue !== undefined) {
    let AFNeeded = false
    for (let x = 0; x < AFNavigationForIndividual.length; x++) {
      let firstValue = AFNavigationForIndividual[x][1]
      if (AFNavigationForIndividual[x][0] instanceof Array) {
        for (let z = 0; z < AFNavigationForIndividual[x][0].length; z++) {
          if (AFNavigationForIndividual[x][0][z] === AFValue) {
            AFNeeded = true
            runTests(firstValue, AFNavigationForIndividual, x)
          }
        }
      } else {
        if (AFNavigationForIndividual[x][0] === AFValue) {
          AFNeeded = true
          runTests(firstValue, AFNavigationForIndividual, x)
        }
      }
    }

    if (AFNeeded === false) {
      it('no AF changes', async () => {})
    }
  } else {
    for (let x = 0; x < AFNavigationNoIndividual.length; x++) {
      runTests(AFNavigationNoIndividual[x][0], AFNavigationNoIndividual, x)
    }
  }
})
