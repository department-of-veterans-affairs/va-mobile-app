/** AF tests for Home tab: HomeScreen shortcuts, VeteransCrisisLine, VeteranStatusCard */
import { describeAF } from './AFShared'

const AFNavigationHome = [
  ['HomeScreen.e2e', 'WG_ContactVA', 'Home', 'Contact us'],
  ['HomeScreen.e2e', 'WG_SecureMessaging', 'Messages'],
  ['HomeScreen.e2e', 'WG_PrescriptionHistory', 'Prescriptions'],
  ['HomeScreen.e2e', 'WG_ClaimsHistoryScreen', 'Claims'],
  ['HomeScreen.e2e', 'WG_Appointments', 'Appointments'],
  ['VeteransCrisisLine.e2e', 'WG_VeteransCrisisLine', 'Talk to the Veterans Crisis Line now'],
  ['VeteranStatusCard.e2e', 'WG_VeteranStatus', 'Proof of Veteran status'],
  ['VeteranStatusCard.e2e', 'WG_VeteranStatusCard', 'Veteran status card'],
]

describeAF('AF Home', AFNavigationHome)
