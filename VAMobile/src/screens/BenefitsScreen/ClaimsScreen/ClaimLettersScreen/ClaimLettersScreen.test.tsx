import React from 'react'

import { fireEvent, screen, waitFor } from '@testing-library/react-native'

import { DecisionLettersList } from 'api/types'
import ClaimLettersScreen from 'screens/BenefitsScreen/ClaimsScreen/ClaimLettersScreen/ClaimLettersScreen'
import * as api from 'store/api'
import { context, mockNavProps, render, when } from 'testUtils'
import getEnv from 'utils/env'
import { downloadFile } from 'utils/filesystem'

const { API_ROOT } = getEnv()

const mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')

  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

jest.mock('utils/filesystem', () => {
  const original = jest.requireActual('utils/filesystem')
  return {
    ...original,
    downloadFile: jest.fn(() => true),
  }
})

context('ClaimLettersScreen', () => {
  const initializeTestInstance = (decisionLetters: DecisionLettersList) => {
    when(api.get as jest.Mock)
      .calledWith(`/v0/claims/decision-letters`)
      .mockResolvedValue({
        data: decisionLetters,
      })
    const props = mockNavProps(undefined, { setOptions: jest.fn(), navigate: mockNavigationSpy })
    render(<ClaimLettersScreen {...props} />)
  }

  it('displays active claims count when veteran has active claims', async () => {
    const decisionLetterID = '{87B6DE5D-CD79-4D15-B6DC-A5F9A324DC3E}'
    initializeTestInstance([
      {
        id: decisionLetterID,
        type: 'decisionLetter',
        attributes: {
          seriesId: '{EC1B5F0C-E3FB-4A41-B93F-E1A88D549CDF}',
          version: '1',
          typeDescription: 'Decision Rating Letter',
          typeId: '184',
          docType: '184',
          receivedAt: '2022-09-21',
          source: 'VBMS',
          mimeType: 'application/pdf',
          altDocTypes: '',
          restricted: false,
          uploadDate: '2022-09-22',
        },
      },
    ])
    await waitFor(() => expect(screen.getByTestId('September 21, 2022 letter Decision Rating Letter')).toBeTruthy())
    fireEvent.press(screen.getByTestId('September 21, 2022 letter Decision Rating Letter'))
    await waitFor(() =>
      expect(downloadFile).toHaveBeenCalledWith(
        'GET',
        `${API_ROOT}/v0/claims/decision-letters/${encodeURI(decisionLetterID)}/download`,
        'ClaimLetter-2022-09-21.pdf',
        undefined,
        3,
      ),
    )
  })
})
