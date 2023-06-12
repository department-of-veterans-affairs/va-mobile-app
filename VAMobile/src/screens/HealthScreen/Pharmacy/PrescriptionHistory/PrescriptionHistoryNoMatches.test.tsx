import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance } from 'react-test-renderer'

import { context, findByTypeWithText, render, RenderAPI } from 'testUtils'
import PrescriptionHistoryNoMatches from './PrescriptionHistoryNoMatches'
import { PrescriptionHistoryTabConstants } from 'store/api/types'
import { TextView } from 'components'

context('PrescriptionHistoryNoMatches', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance

  beforeEach(() => {
    component = render(<PrescriptionHistoryNoMatches currentTab={PrescriptionHistoryTabConstants.ALL} isFiltered={false} />)

    testInstance = component.UNSAFE_root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  it('should show tab based content with no filter', async () => {
    component = render(<PrescriptionHistoryNoMatches currentTab={PrescriptionHistoryTabConstants.PENDING} isFiltered={false} />)
    testInstance = component.UNSAFE_root

    expect(findByTypeWithText(testInstance, TextView, 'This list will only show refills requests you’ve submitted or refills that the VA pharmacy is processing.')).toBeTruthy()
  })

  it('should show tab based content for filtered lists', async () => {
    component = render(<PrescriptionHistoryNoMatches currentTab={PrescriptionHistoryTabConstants.TRACKING} isFiltered={true} />)
    testInstance = component.UNSAFE_root

    expect(
      findByTypeWithText(testInstance, TextView, 'We can’t find any refills with tracking information that match your filter selection. Try changing or resetting the filter.'),
    ).toBeTruthy()
  })
})
