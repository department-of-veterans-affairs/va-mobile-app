/** AF tests for Health tab: Appointments, Messages, Prescriptions, VaccineRecords */
import { describeAF } from './AFShared'

const AFNavigationHealth = [
  [['Appointments.e2e', 'AppointmentsExpanded.e2e'], 'WG_Appointments', 'Health', 'Appointments'],
  ['Appointments.e2e', 'WG_UpcomingAppointmentDetails', 'Health', 'Appointments', 'Podiatry'],
  ['Appointments.e2e', 'WG_PastAppointmentDetails', 'Health', 'Appointments', 'Past', 'Podiatry'],
  ['Messages.e2e', 'WG_SecureMessaging', 'Health', 'Messages'],
  ['Messages.e2e', 'WG_FolderMessages', 'Health', 'Messages', 'Folders', 'Sent'],
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
  ['Prescriptions.e2e', 'WG_PrescriptionHistory', 'Health', 'Prescriptions'],
  ['Prescriptions.e2e', 'WG_PrescriptionDetails', 'Health', 'Prescriptions', 'Get prescription details'],
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
  ['VaccineRecords.e2e', 'WG_VaccineList', 'Health', 'V\ufeffA vaccine records'],
  ['VaccineRecords.e2e', 'WG_VaccineDetails', 'Health', 'V\ufeffA vaccine records', 'January 14, 2021'],
]

describeAF('AF Health', AFNavigationHealth)
