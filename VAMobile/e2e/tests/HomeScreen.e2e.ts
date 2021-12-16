import { expect, device, by, element, waitFor } from 'detox'
import { CommonE2eIdConstants, loginToDemoMode } from './utils'

export const HomeE2eIdConstants = {
  HOME_PAGE_ID: 'Home-page',
  CLAIMS_APPEAL_BTN_ID: 'Claims and appeals',
  LETTERS_BTN_ID: 'Letters',
  HEALTH_CARE_BTN_ID: 'Health care',
  HOME_HEADER_ID: 'Home-page-header',
  GREETING_ID: 'greeting-text',
}

beforeAll(async () => {
  await loginToDemoMode()
})

describe('Home Screen', () => {
  it('should show home page content', async () => {
    await waitFor(element(by.id(HomeE2eIdConstants.HOME_PAGE_ID)))
      .toExist()
      .withTimeout(2000)

    await expect(element(by.id(HomeE2eIdConstants.HOME_HEADER_ID))).toExist()
    await expect(element(by.id(HomeE2eIdConstants.GREETING_ID))).toBeVisible()
    await expect(element(by.id(HomeE2eIdConstants.CLAIMS_APPEAL_BTN_ID))).toExist()
    await expect(element(by.id(HomeE2eIdConstants.HEALTH_CARE_BTN_ID))).toExist()
    await expect(element(by.id(HomeE2eIdConstants.LETTERS_BTN_ID))).toExist()
    await expect(element(by.id(CommonE2eIdConstants.VETERAN_CRISIS_LINE_BTN_ID))).toExist()
  })
})
