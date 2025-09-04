export interface ScreenshotData {
  testId: string
  imageName: string | { ios?: string; android?: string; ipad?: string }
  description: string | string[]
  deviceType: ('ios' | 'android' | 'ipad')[]
  setupFunction: string | string[] // The name of the function to call in screenshot.utils.ts
  skipScreenshot?: boolean
}

export const screenshotData: ScreenshotData[] = [
  {
    testId: 'HomeScreen',
    imageName: {
      ios: 'iphone67-screen-1',
      android: '1_en-US',
      ipad: 'ipadPro129-screen-1',
    },
    description: ['Complete health care and', 'benefits transactions'],
    deviceType: ['ios', 'android', 'ipad'],
    setupFunction: ['goHome', 'disableAF', 'skipUpdate', 'demoUser'],
  },
  {
    testId: 'HealthScreen',
    imageName: {
      ios: 'iphone67-screen-2',
      android: '2_en-US',
      ipad: 'ipadPro129-screen-2',
    },
    description: 'Access health care tools',
    deviceType: ['ios', 'android', 'ipad'],
    setupFunction: ['goHome', 'healthScreen'],
  },
  {
    testId: 'AppointmentDetails',
    imageName: {
      ios: 'iphone67-screen-3',
      android: '3_en-US',
      ipad: 'ipadPro129-screen-3',
    },
    description: ['Review and cancel your VA', 'medical appointments'],
    deviceType: ['ios', 'android', 'ipad'],
    setupFunction: 'appointmentDetails',
  },
  {
    testId: 'MessagesInbox',
    imageName: {
      ios: 'iphone67-screen-4',
      android: '4_en-US',
      ipad: 'ipadPro129-screen-4',
    },
    description: ['Send and receive messages', 'with your VA health care team'],
    deviceType: ['ios', 'android', 'ipad'],
    setupFunction: 'messagesInbox',
  },
  // {
  //   testId: 'PaymentsHistory',
  //   imageName: {
  //     ios: 'iphone67-screen-8',
  //     android: '8_en-US',
  //     ipad: 'ipadPro129-screen-8',
  //   },
  //   description: 'Review your payments history',
  //   deviceType: ['ios', 'android', 'ipad'],
  //   setupFunction: 'paymentsHistory',
  // },
  {
    testId: 'ProfileScreen',
    imageName: {
      ios: 'iphone67-screen-7',
      ipad: 'ipadPro129-screen-7',
    },
    description: 'Manage your VA.gov profile',
    deviceType: ['ios', 'ipad'],
    setupFunction: 'profileScreen',
  },
  {
    testId: 'LettersDownload',
    imageName: {
      ios: 'iphone67-screen-5',
      android: '5_en-US',
      ipad: 'ipadPro129-screen-5',
    },
    description: ['Download common VA letters', 'and documents'],
    deviceType: ['ios', 'android', 'ipad'],
    setupFunction: '',
    skipScreenshot: true,
  },
  {
    testId: 'Prescriptions',
    imageName: {
      ios: 'iphone67-screen-9',
      ipad: 'ipadPro129-screen-9',
      android: '7_en-US',
    },
    description: 'Manage your VA prescriptions',
    deviceType: ['ios', 'android', 'ipad'],
    setupFunction: 'prescriptions',
  },
  {
    testId: 'ClaimDetails',
    imageName: {
      ios: 'iphone67-screen-6',
      android: '6_en-US',
      ipad: 'ipadPro129-screen-6',
    },
    description: ['Check claim status and upload', 'new evidence'],
    deviceType: ['ios', 'android', 'ipad'],
    setupFunction: 'claimDetails',
  },
]
