import {enableAF, verifyAF, resetInAppReview } from './utils'

var AFNavigation = [
  ['WG_Home'],
  ['WG_Profile', 'Profile'],
  ['WG_PersonalInformation', 'Profile', 'Personal information'],
  ['WG_HowDoIUpdate', 'Profile', 'Personal information', 'How to update or fix an error in your legal name', 'Close'],
  ['WG_PreferredName', 'Profile', 'Personal information', 'Preferred name', 'Cancel'],
  ['WG_GenderIdentity', 'Profile', 'Personal information', 'Gender identity', 'Cancel'],
  ['WG_WhatToKnow', 'Profile', 'Personal information', 'Gender identity', 'What to know before you decide to share your gender identity', 'Close'],
  ['WG_ContactInformation', 'Profile', 'Contact information'],
  ['WG_HowWillYou', 'Profile', 'Contact information', 'How we use your contact information', 'Close'],
  ['WG_EditAddress', 'Profile', 'Contact information', 'Mailing address', 'Cancel'],
  ['WG_EditAddress', 'Profile', 'Contact information', 'Home address', 'Cancel'],
  ['WG_EditPhoneNumber', 'Profile', 'Contact information', '555-444-6666', 'Cancel'],
  ['WG_EditPhoneNumber', 'Profile', 'Contact information', 'Work', 'Cancel'],
  ['WG_EditPhoneNumber', 'Profile', 'Contact information', 'Mobile', 'Cancel'],
  ['WG_EditEmail', 'Profile', 'Contact information', 'Email address', 'Cancel'],
  ['WG_MilitaryInformation', 'Profile', 'Military information'],
  ['WG_IncorrectServiceInfo', 'Profile', 'Military information', 'What if my military service information doesn\'t look right?', 'Close'],
  ['WG_Settings', 'Profile', 'Settings'],
  ['WG_ManageYourAccount', 'Profile', 'Settings', 'Manage account'],
  ['WG_NotificationSettings', 'Profile', 'Settings', 'Notifications'],
  ['WG_ContactVA', 'Home', 'Contact VA'],
  //Not working in demo on home screen/message screen for UC1
  ['WG_VeteransCrisisLine', 'talk-to-the-veterans-crisis-line-now', 'Done'],
  ['WG_Login'],
  ['WG_Health', 'Health'],
  ['WG_Appointments', 'Health', 'Appointments'],
  ['WG_FolderMessages', 'Health', 'Messages', 'Folders', 'Sent'],
  ['WG_PastAppointmentDetails', 'Health', 'Appointments', 'Past', 'Claim exam'],
  ['WG_PrescriptionDetails', 'Health', 'Prescriptions', 'Get prescription details'],
  ['WG_PrescriptionHistory', 'Health', 'Prescriptions'],
  ['WG_SecureMessaging', 'Health', 'Messages'],
  ['WG_UpcomingAppointmentDetails', 'Health', 'Appointments', 'Confirmed'],
  ['WG_VaccineDetails', 'Health', 'V\ufeffA vaccine records', 'January 14, 2021'],
  ['WG_VaccineList', 'Health', 'V\ufeffA vaccine records'],
  ['WG_ViewMessage', 'Health', 'Messages', 'Folder', 'Custom Folder 2', 'Medication: Naproxen side effects'],
  //['WG_PrepareForVideoVisit'],
  ['WG_StartNewMessage', 'Health', 'Messages', 'Start new message'],
  ['WG_ReplyMessage', 'Health', 'Messages', 'Medication: Naproxen side effects', 'Reply'],
  ['WG_EditDraft', 'Health', 'Messages', 'Folders', 'Drafts (3)', 'Test: Test Inquiry'],
  ['WG_RefillRequestSummary', 'Health', 'Prescriptions', 'Start refill request', 'AMLODIPINE BESYLATE 10MG TAB', 'Request refill', 'Request Refill'],
  ['WG_RefillScreenModal', 'Health', 'Prescriptions', 'Start refill request'],
  ['WG_RefillTrackingModal', 'Health', 'Prescriptions', 'Tracking (3)', 'Get prescription tracking'],
  ['WG_PrescriptionHelp', 'Health', 'Prescriptions', 'Help'],
  ['WG_StatusDefinition', 'Health', 'Prescriptions', 'Active: Refill in process'],
  //['WG_SessionNotStarted'],
  ['WG_Payments', 'Payments'],
  ['WG_PaymentDetails', 'Payments', 'VA payment history', 'Regular Chapter 31'],
  ['WG_DirectDeposit', 'Payments', 'Direct deposit information'],
  ['WG_PaymentHistory', 'Payments', 'VA payment history'] ,
  ['WG_PaymentIssue', 'Payments', 'VA payment history', 'Regular Chapter 31', 'What if my payment information doesn\'t look right?'],
  ['WG_PaymentMissing', 'Payments', 'VA payment history', 'What if I\'m missing a payment?'],
  ['WG_EditDirectDeposit', 'Payments', 'Direct deposit information', 'Add your bank account information'],
  ['WG_Benefits', 'Benefits'],
  ['WG_DisabilityRatings', 'Benefits', 'Disability rating'],
  ['WG_ClaimsHistory', 'Benefits', 'Claims', 'Claims history'],
  ['WG_LettersOverview', 'Benefits', 'VA letters and documents'],
  ['WG_LettersList', 'Benefits', 'VA letters and documents', 'Review letters'],
  ['WG_BenefitSummaryServiceVerificationLetter', 'Benefits', 'VA letters and documents', 'Review letters', 'Benefit summary and service verification letter'],
  ['WG_ClaimLettersScreen', 'Benefits', 'Claims', 'Claim letters'],
  ['WG_ClaimDetailsScreen', 'Benefits', 'Claims', 'Claims history', 'Submitted December 05, 2021'],
  ['WG_AppealDetailsScreen', 'Benefits', 'Claims', 'Claims history', 'Submitted June 12, 2008'],
  ['WG_ConsolidatedClaimsNote', 'Benefits', 'Claims', 'Claims history', 'Submitted December 05, 2021', 'Why does VA sometimes combine claims?'],
  ['WG_WhatDoIDoIfDisagreement', 'Benefits', 'Claims', 'Claims history', 'Submitted December 05, 2021', 'What should I do if I disagree with VA\'s decision on my disability claim?'],
  ['WG_FileRequest', 'Benefits', 'Claims', 'Claims history', 'Submitted January 01, 2021', 'Review file requests'],
  ['WG_FileRequestDetails', 'Benefits', 'Claims', 'Claims history', 'Submitted January 01, 2021', 'Review file requests', 'Request 2'],
  ['WG_AskForClaimDecision', 'Benefits', 'Claims', 'Claims history', 'Submitted January 01, 2021', 'Review file requests', 'Review evaluation details'],
  ['WG_SelectFile', 'Benefits', 'Claims', 'Claims history', 'Submitted January 01, 2021', 'Review file requests', 'Request 2', 'Select a file'],
  ['WG_TakePhotos', 'Benefits', 'Claims', 'Claims history', 'Submitted January 01, 2021', 'Review file requests', 'Request 2', 'Take or select photos']
]

var featureID = {
	'Personal information': 'PersonalInformationTestID',
	'Benefits': 'benefitsTestID',
  'Prescriptions': 'PrescriptionHistory',
  'Get prescription details': 'PrescriptionHistory',
  'Get prescription tracking:': 'PrescriptionHistory',
  'Active: Refill in process': 'PrescriptionHistory',
	'Submitted June 12, 2008': 'claimsHistoryID',
  'Submitted May 05, 2021': 'claimsHistoryID',
  'Why does VA sometimes combine claims?': 'ClaimDetailsScreen',
  'What should I do if I disagree with VA\'s decision on my disability claim?': 'ClaimDetailsScreen',
	'Review file requests': 'ClaimDetailsScreen',
	'Review evaluation details': 'fileRequestPageTestID',
}
let index=0

describe('Availability Framework', () => {
  for (let x = 0; x < AFNavigation.length; x++) {
    it('should verify AF use case 1 for: ' + AFNavigation[x][0], async() => {
      if(AFNavigation[x][0] !== 'WG_Login' && AFNavigation[x][0] !== 'WG_Health' && AFNavigation[x][0] !== 'WG_Home' && AFNavigation[x][0] !== 'WG_Benefits'  && AFNavigation[x][0] !== 'WG_Payments') {
        await enableAF(AFNavigation[x][0], 'DenyAccess')
        await verifyAF(AFNavigation[x], 'DenyAccess', featureID)
      }
    })

    it('should verify AF use case 2 for: ' + AFNavigation[x][0], async() => {
      await enableAF(AFNavigation[x][0], 'DenyContent')
      await verifyAF(AFNavigation[x], 'DenyContent', featureID)
    })

    it('should verify AF use case 2 Update available for: ' + AFNavigation[x][0], async() => {
      index++
      await enableAF(AFNavigation[x][0], 'DenyContent', true)
      await verifyAF(AFNavigation[x], 'DenyContent', featureID, true)
      if (index % 3 == 0) {
        await resetInAppReview()
      }
    })
  }

})