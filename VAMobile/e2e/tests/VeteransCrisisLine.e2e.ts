import { expect, device, by, element, waitFor } from 'detox'
import { CommonE2eIdConstants, loginToDemoMode, openVeteransCrisisLine } from './utils'

export const VCLE2eIdConstants = {
    VETERANS_CRISIS_LINE_PAGE_TEXT: 'Veterans Crisis Line',
    VCL_URL_LABEL: 'Veterans Crisis Line .net',
    VCL_HERE_FOR_YOU_LABEL: 'We’re here anytime, day or night – 24 7'
  }

beforeAll(async () => {
  await loginToDemoMode()
  await openVeteransCrisisLine()
})

describe('Veterans Crisis Line', () => {
  it('should show some VCL content', async () => {
    await waitFor(element(by.text(VCLE2eIdConstants.VETERANS_CRISIS_LINE_PAGE_TEXT)))
      .toExist()
      .withTimeout(2000)

    await expect(element(by.label(VCLE2eIdConstants.VCL_HERE_FOR_YOU_LABEL))).toExist()
    //await expect(element(by.label(VCLE2eIdConstants.VCL_URL_LABEL))).toExist()
  })
})