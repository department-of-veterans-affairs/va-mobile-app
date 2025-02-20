/*
Description:
Detox script that follows the Veterans Crisis Line test case found in testRail (VA Mobile App > RC Regression Test > Manual > Home Page Elements)
When to update:
This script should be updated whenever new things are added/changed in Veterans Crisis Line
*/
import { by, device, element, expect } from 'detox'
import { setTimeout } from 'timers/promises'

import { CommonE2eIdConstants, loginToDemoMode, openVeteransCrisisLine } from './utils'

export const VCLConstants = {
  SUBHEADING_TEXT: 'We’re here anytime, day or night – 24/7',
  MESSAGE_TEXT:
    "If you're a Veteran in crisis or concerned about one, connect with our caring, qualified responders for confidential help. Many of them are Veterans themselves.",
  MORE_RESOURCES_TEXT: 'Get more resources',
  VCL_SITE_LINK_ID: 'veteransCrisisLineGetMoreResourcesTestID',
}

const tapAndTakeScreenshot = async (text: string, screenshotName: string) => {
  await device.disableSynchronization()
  await element(by.id(text)).tap()
  await setTimeout(5000)
  await device.takeScreenshot(screenshotName)
  await device.launchApp({ newInstance: false })
  await device.enableSynchronization()
}

beforeAll(async () => {
  await loginToDemoMode()
  await openVeteransCrisisLine()
})

describe('Veterans Crisis Line', () => {
  it('should match design', async () => {
    await expect(element(by.text(CommonE2eIdConstants.VETERAN_CRISIS_LINE_HEADING_TEXT))).toExist()
    await expect(element(by.text(VCLConstants.SUBHEADING_TEXT))).toExist()
    await expect(element(by.text(VCLConstants.MESSAGE_TEXT))).toExist()
    await expect(element(by.text(VCLConstants.MORE_RESOURCES_TEXT))).toExist()
  })

  if (device.getPlatform() === 'android') {
    it('should open phone link', async () => {
      await tapAndTakeScreenshot(CommonE2eIdConstants.VETERANS_CRISIS_LINE_CALL_ID, 'CrisisLinePhone')
    })
    it('should open TTY link', async () => {
      await tapAndTakeScreenshot(CommonE2eIdConstants.VETERANS_CRISIS_LINE_TTY_ID, 'CrisisLineTTY')
    })
  }

  it('should open text message link', async () => {
    await tapAndTakeScreenshot(CommonE2eIdConstants.VETERANS_CRISIS_LINE_TEXT_ID, 'CrisisLineTextMessage')
  })

  it('should open chat link', async () => {
    await element(by.id(CommonE2eIdConstants.VETERANS_CRISIS_LINE_CHAT_ID)).tap()
    await element(by.text(CommonE2eIdConstants.LEAVING_APP_LEAVE_TEXT)).tap()
    await setTimeout(5000)
    await device.takeScreenshot('CrisisLineChat')
    await device.launchApp({ newInstance: false })
  })

  it('should open website link', async () => {
    await element(by.id(VCLConstants.VCL_SITE_LINK_ID)).tap()
    await element(by.text(CommonE2eIdConstants.LEAVING_APP_LEAVE_TEXT)).tap()
    await setTimeout(5000)
    await device.takeScreenshot('VCLWebsite')
    await device.launchApp({ newInstance: false })
  })

  it('should close panel', async () => {
    await element(by.id(CommonE2eIdConstants.VETERAN_CRISIS_LINE_BACK_ID)).tap()
    await expect(element(by.text(CommonE2eIdConstants.HOME_ACTIVITY_HEADER_TEXT))).toExist()
  })
})
