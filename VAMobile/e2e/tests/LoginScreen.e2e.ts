import { expect, device, by, element, waitFor } from 'detox'
import { isTypedArray } from 'util/types'
import { CommonE2eIdConstants, openVeteransCrisisLine } from './utils'
import { VCLConstants } from './VeteransCrisisLine.e2e'

export const LoginE2eIdConstants = {
  LOGIN_PAGE_ID: 'Login-page',
  LOGIN_FIND_VA_BUTTON_ID: 'Find a V-A Location'
}

describe('Login Screen', () => {
  it('should show login page content', async () => {
    await waitFor(element(by.id(LoginE2eIdConstants.LOGIN_PAGE_ID)))
      .toExist()
      .withTimeout(2000)

    await expect(element(by.id(CommonE2eIdConstants.VETERAN_CRISIS_LINE_BTN_ID))).toExist()
    await expect(element(by.id(CommonE2eIdConstants.SIGN_IN_BTN_ID))).toExist()
    await expect(element(by.id(LoginE2eIdConstants.LOGIN_FIND_VA_BUTTON_ID))).toExist() 
    
  })
})
