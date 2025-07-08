import { by, device, element, expect, waitFor } from 'detox'

import { loginToDemoMode } from '../tests/utils'
import utils from './screenshot.utils'
import { ScreenshotData, screenshotData } from './screenshot_data'

describe('Screenshot Generation', () => {
  beforeAll(async () => {
    await loginToDemoMode()
  })

  for (const data of screenshotData) {
    it(`should capture ${data.testId}`, async () => {
      if (!data.deviceType.includes(device.getPlatform())) {
        return
      }

      const setupFunction = data.setupFunction as keyof typeof utils
      if (typeof utils[setupFunction] === 'function') {
        await utils[setupFunction]()
      } else {
        throw new Error(`Setup function '${data.setupFunction}' not found in screenshot.utils.ts`)
      }

      await device.takeScreenshot(data.imageName)
    })
  }
})
