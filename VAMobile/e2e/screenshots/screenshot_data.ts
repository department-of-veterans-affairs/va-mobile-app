export interface ScreenshotData {
  testId: string
  imageName: string
  description: string
  deviceType: ('ios' | 'android')[]
  setupFunction: string // The name of the function to call in screenshot.utils.ts
}

export const screenshotData: ScreenshotData[] = [
  {
    testId: 'HomeScreen',
    imageName: 'HomeScreen',
    description: 'Complete health care and benefits transactions',
    deviceType: ['ios', 'android'],
    setupFunction: 'goHome',
  },
  {
    testId: 'HealthScreen',
    imageName: 'HealthScreen',
    description: 'Access health care tools',
    deviceType: ['ios', 'android'],
    setupFunction: 'healthScreen',
  },
  {
    testId: 'BenefitsScreen',
    imageName: 'BenefitsScreen',
    description: 'Your Benefits',
    deviceType: ['ios', 'android'],
    setupFunction: 'benefitsScreen',
  },
  {
    testId: 'AppointmentDetails',
    imageName: 'AppointmentDetails',
    description: 'Review and cancel your VA medical appointments',
    deviceType: ['ios', 'android'],
    setupFunction: 'appointmentDetails',
  },
  {
    testId: 'MessagesInbox',
    imageName: 'MessagesInbox',
    description: 'Send and receive messages with your VA health care team',
    deviceType: ['ios', 'android'],
    setupFunction: 'messagesInbox',
  },
  {
    testId: 'PaymentsHistory',
    imageName: 'PaymentsHistory',
    description: 'Review your payments history',
    deviceType: ['ios', 'android'],
    setupFunction: 'paymentsHistory',
  },
  {
    testId: 'ProfileScreen',
    imageName: 'ProfileScreen',
    description: 'Manage your VA.gov profile',
    deviceType: ['ios', 'android'],
    setupFunction: 'profileScreen',
  },
  // BUG: Test not working
  // {
  //   testId: 'LettersDownload',
  //   imageName: 'LettersDownload',
  //   description: 'Download common VA letters and documents',
  //   deviceType: ['ios', 'android'],
  //   setupFunction: 'lettersDownload',
  // },
  {
    testId: 'Prescriptions',
    imageName: 'Prescriptions',
    description: 'Manage your VA prescriptions',
    deviceType: ['ios', 'android'],
    setupFunction: 'prescriptions',
  },
  {
    testId: 'ClaimDetails',
    imageName: 'ClaimDetails',
    description: 'Check claim status and upload new evidence',
    deviceType: ['ios', 'android'],
    setupFunction: 'claimDetails',
  },
]
