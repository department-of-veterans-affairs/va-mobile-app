import React from 'react'
import { Alert } from 'react-native'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { context, render } from 'testUtils'
import { a11yLabelVA } from 'utils/a11yLabel'

import CernerAlert from './CernerAlert'

jest.mock('../../../api/facilities/getFacilitiesInfo', () => {
  const original = jest.requireActual('../../../api/facilities/getFacilitiesInfo')
  return {
    ...original,
    useFacilitiesInfo: jest
      .fn()
      .mockReturnValueOnce({
        status: 'success',
        data: [
          {
            id: '358',
            name: 'FacilityOne',
            city: 'Cheyenne',
            state: 'WY',
            cerner: true,
            miles: '3.17',
          },
          {
            id: '359',
            name: 'FacilityTwo',
            city: 'Cheyenne',
            state: 'WY',
            cerner: true,
            miles: '3.17',
          },
        ],
      })
      .mockReturnValueOnce({
        status: 'success',
        data: [
          {
            id: '358',
            name: 'FacilityOne',
            city: 'Cheyenne',
            state: 'WY',
            cerner: true,
            miles: '3.17',
          },
          {
            id: '359',
            name: 'FacilityTwo',
            city: 'Cheyenne',
            state: 'WY',
            cerner: false,
            miles: '3.17',
          },
        ],
      }),
  }
})

context('CernerAlert', () => {
  const initializeTestInstance = (): void => {
    render(<CernerAlert />)
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('When only cerner facilities', () => {
    fireEvent.press(screen.getByLabelText(a11yLabelVA(t('cernerAlert.header.all'))))
    expect(screen.getByLabelText(`FacilityOne (${a11yLabelVA(t('cernerAlert.nowUsing'))})`)).toBeTruthy()
    expect(screen.getByLabelText(`FacilityTwo (${a11yLabelVA(t('cernerAlert.nowUsing'))})`)).toBeTruthy()
  })

  it('when some facilities are cerner and pressing the link', async () => {
    fireEvent.press(screen.getByLabelText(a11yLabelVA(t('cernerAlert.header.some'))))
    fireEvent.press(screen.getByLabelText(a11yLabelVA(t('goToMyVAHealth'))))
    expect(Alert.alert).toBeCalled()
  })
})
