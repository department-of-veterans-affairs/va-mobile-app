import { by, device, element, expect, waitFor } from 'detox'

import { disableAF, loginToDemoMode } from '../tests/utils'
import utils from './screenshot.utils'
import { ScreenshotData, screenshotData } from './screenshot_data'

describe('Screenshot Generation', () => {
  beforeAll(async () => {
    await disableAF(undefined, 'WG_Home', undefined, undefined)
    await loginToDemoMode()
  })

  for (const data of screenshotData) {
    it(`should capture ${data.testId}`, async () => {
      const platform = device.getPlatform()
      // @ts-ignore
      const isIpad = device.name.includes('iPad')

      if (data.skipScreenshot) {
        return
      }

      if (isIpad) {
        if (!data.deviceType.includes('ipad')) {
          return
        }
      } else {
        if (!data.deviceType.includes(platform)) {
          return
        }
      }

      if (data.setupFunction) {
        if (Array.isArray(data.setupFunction)) {
          for (const funcName of data.setupFunction) {
            const setupFunction = funcName as keyof typeof utils
            if (typeof utils[setupFunction] === 'function') {
              await utils[setupFunction]()
            } else {
              throw new Error(`Setup function '${funcName}' not found in screenshot.utils.ts`)
            }
          }
        } else {
          const setupFunction = data.setupFunction as keyof typeof utils
          if (typeof utils[setupFunction] === 'function') {
            await utils[setupFunction]()
          } else {
            throw new Error(`Setup function '${data.setupFunction}' not found in screenshot.utils.ts`)
          }
        }
      }

      const screenshotName = isIpad ? `${data.imageName}-ipad` : data.imageName
      await device.takeScreenshot(screenshotName)
    })
  }
})
