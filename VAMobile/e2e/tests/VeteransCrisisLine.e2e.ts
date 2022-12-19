import { expect, device, by, element, waitFor } from 'detox'
import { CommonE2eIdConstants, loginToDemoMode, openVeteransCrisisLine } from './utils'

export const VCLE2eIdConstants = {
    VETERANS_CRISIS_LINE_PAGE_ID: 'Veterans-Crisis-Line-page',
    VCL_HERE_FOR_YOU_LABEL: 'We’re here anytime, day or night – 24 7'
  }

beforeAll(async () => {
  await loginToDemoMode()
  await openVeteransCrisisLine()
})

describe('Veterans Crisis Line', () => {
  it('should show some VCL content', async () => {
    await waitFor(element(by.id(VCLE2eIdConstants.VETERANS_CRISIS_LINE_PAGE_ID)))
      .toExist()
      .withTimeout(2000)

    await expect(element(by.label(VCLE2eIdConstants.VCL_HERE_FOR_YOU_LABEL))).toExist()
  })
})