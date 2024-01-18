import { by, device, element, expect } from 'detox'
import { setTimeout } from 'timers/promises'

import { loginToDemoMode, openVeteransCrisisLine } from './utils'

export const VCLConstants = {
  HEADING_TEXT: 'Veterans Crisis Line',
  SUBHEADING_TEXT: 'We’re here anytime, day or night – 24/7',
  MESSAGE_TEXT: "If you're a Veteran in crisis or concerned about one, connect with our caring, qualified responders for confidential help. Many of them are Veterans themselves.",
  PHONE_LINK_TEXT: 'Call 988 and select 1',
  TEXT_MESSAGE_LINK_TEXT: 'Text 838255',
  CHAT_LINK_TEXT: 'Start a confidential chat',
  TTY_LINK_TEXT: 'TTY: 800-799-4889',
  MORE_RESOURCES_TEXT: 'Get more resources',
  VCL_SITE_LINK_TEXT: 'VeteransCrisisLine.net',
}

const tapAndTakeScreenshot = async (text: string, screenshotName: string) => {
  await element(by.text(text)).tap()
  await setTimeout(5000)
  await device.takeScreenshot(screenshotName)
  await device.launchApp({ newInstance: false })
}

beforeAll(async () => {
  await loginToDemoMode()
  await openVeteransCrisisLine()
})

describe('Veterans Crisis Line', () => {
  it('should match design', async () => {
    await expect(element(by.text(VCLConstants.HEADING_TEXT))).toExist()
    await expect(element(by.text(VCLConstants.SUBHEADING_TEXT))).toExist()
    await expect(element(by.text(VCLConstants.MESSAGE_TEXT))).toExist()
    await expect(element(by.text(VCLConstants.MORE_RESOURCES_TEXT))).toExist()
  })

  if (device.getPlatform() === 'android') {
    it('should open phone link', async () => {
      await tapAndTakeScreenshot(VCLConstants.PHONE_LINK_TEXT, 'CrisisLinePhone')
    })
    it('should open TTY link', async () => {
      await tapAndTakeScreenshot(VCLConstants.TTY_LINK_TEXT, 'CrisisLineTTY')
    })
  }

  it('should open text message link', async () => {
    await tapAndTakeScreenshot(VCLConstants.TEXT_MESSAGE_LINK_TEXT, 'CrisisLineTextMessage')
  })

  it('should open chat link', async () => {
    await element(by.text(VCLConstants.CHAT_LINK_TEXT)).tap()
    await element(by.text('Ok')).tap()
    await setTimeout(5000)
    await device.takeScreenshot('CrisisLineChat')
    await device.launchApp({ newInstance: false })
  })

  it('should open website link', async () => {
    await element(by.text(VCLConstants.VCL_SITE_LINK_TEXT)).tap()
    await element(by.text('Ok')).tap()
    await setTimeout(5000)
    await device.takeScreenshot('VCLWebsite')
    await device.launchApp({ newInstance: false })
  })

  it('should close panel', async () => {
    await element(by.text('Done')).tap()
    await expect(element(by.text('About VA'))).toExist()
  })
})
