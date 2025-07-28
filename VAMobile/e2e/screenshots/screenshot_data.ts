export interface ScreenshotData {
  testId: string
  imageName: string
  description: string | string[]
  deviceType: ('ios' | 'android' | 'ipad')[]
  setupFunction: string | string[] // The name of the function to call in screenshot.utils.ts
  skipScreenshot?: boolean
}

export const screenshotData: ScreenshotData[] = [
  {
    testId: 'HomeScreen',
    imageName: 'HomeScreen',
    description: ['Complete health care and', 'benefits transactions'],
    deviceType: ['ios', 'android', 'ipad'],
    setupFunction: ['goHome', 'skipUpdate'],
  },
  {
    testId: 'HealthScreen',
    imageName: 'HealthScreen',
    description: 'Access health care tools',
    deviceType: ['ios', 'android', 'ipad'],
    setupFunction: 'healthScreen',
  },
  {
    testId: 'BenefitsScreen',
    imageName: 'BenefitsScreen',
    description: 'Your Benefits',
    deviceType: ['ios', 'android', 'ipad'],
    setupFunction: 'benefitsScreen',
  },
  {
    testId: 'AppointmentDetails',
    imageName: 'AppointmentDetails',
    description: ['Review and cancel your VA', 'medical appointments'],
    deviceType: ['ios', 'android', 'ipad'],
    setupFunction: 'appointmentDetails',
  },
  {
    testId: 'MessagesInbox',
    imageName: 'MessagesInbox',
    description: ['Send and receive messages', 'with your VA health care team'],
    deviceType: ['ios', 'android', 'ipad'],
    setupFunction: 'messagesInbox',
  },
  {
    testId: 'PaymentsHistory',
    imageName: 'PaymentsHistory',
    description: 'Review your payments history',
    deviceType: ['ios', 'android', 'ipad'],
    setupFunction: 'paymentsHistory',
  },
  {
    testId: 'ProfileScreen',
    imageName: 'ProfileScreen',
    description: 'Manage your VA.gov profile',
    deviceType: ['ios', 'android', 'ipad'],
    setupFunction: 'profileScreen',
  },
  {
    testId: 'LettersDownload',
    imageName: 'LettersDownload',
    description: ['Download common VA letters', 'and documents'],
    deviceType: ['ios', 'android', 'ipad'],
    setupFunction: '',
    skipScreenshot: true,
  },
  {
    testId: 'Prescriptions',
    imageName: 'Prescriptions',
    description: 'Manage your VA prescriptions',
    deviceType: ['ios', 'android', 'ipad'],
    setupFunction: 'prescriptions',
  },
  {
    testId: 'ClaimDetails',
    imageName: 'ClaimDetails',
    description: ['Check claim status and upload', 'new evidence'],
    deviceType: ['ios', 'android', 'ipad'],
    setupFunction: 'claimDetails',
  },
]
