import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { ClaimData } from 'api/types'
import ClaimFiles from 'screens/BenefitsScreen/ClaimsScreen/ClaimDetailsScreen/ClaimFiles/ClaimFiles'
import { claim as claimData } from 'screens/BenefitsScreen/ClaimsScreen/claimData'
import { context, render, when } from 'testUtils'
import { featureEnabled } from 'utils/remoteConfig'

jest.mock('utils/remoteConfig')

// Regex pattern to match timezone message regardless of user's timezone
// Validates format: "If you uploaded files [before|after] [hour] [AM|PM] [timezone], we'll show them as received on the [previous|next] day"
const TIMEZONE_MESSAGE_PATTERN =
  /If you uploaded files (before|after) \d{1,2} (AM|PM) \w+, we'll show them as received on the (previous|next) day/

context('ClaimDetailsScreen', () => {
  const renderWithData = (claim: ClaimData): void => {
    render(
      <ClaimFiles
        claim={claim}
        eFolderDocuments={undefined}
        setDownloadFile={jest.fn()}
        setDocumentID={jest.fn()}
        setFileName={jest.fn()}
      />,
    )
  }

  describe('When there are files to display', () => {
    it('should render correctly', async () => {
      renderWithData(claimData)
      expect(screen.getAllByText('filter-sketch.pdf')).toBeTruthy()
      expect(screen.getAllByText('Request type: other_documents_list')).toBeTruthy()
      expect(screen.getAllByText('Received: July 16, 2020')).toBeTruthy()

      expect(screen.getByText('Mark_Webb_600156928_526.pdf')).toBeTruthy()
      expect(screen.getByText('Document type: L533')).toBeTruthy()
      expect(screen.getByText('Received: June 06, 2019')).toBeTruthy()
    })
  })

  describe('Timezone message feature (temporary)', () => {
    it('should show timezone message when feature flag is enabled', () => {
      when(featureEnabled as jest.Mock)
        .calledWith('showTimezoneMessage')
        .mockReturnValue(true)

      renderWithData(claimData)

      expect(screen.getByText(TIMEZONE_MESSAGE_PATTERN)).toBeTruthy()
      expect(screen.getAllByText('filter-sketch.pdf')).toBeTruthy()
      expect(screen.getByText('Mark_Webb_600156928_526.pdf')).toBeTruthy()
    })

    it('should not show timezone message when feature flag is disabled', () => {
      when(featureEnabled as jest.Mock)
        .calledWith('showTimezoneMessage')
        .mockReturnValue(false)

      renderWithData(claimData)

      expect(screen.queryByText(TIMEZONE_MESSAGE_PATTERN)).toBeFalsy()
      expect(screen.getAllByText('filter-sketch.pdf')).toBeTruthy()
      expect(screen.getByText('Mark_Webb_600156928_526.pdf')).toBeTruthy()
    })

    it('should not show timezone message when there are no files', () => {
      when(featureEnabled as jest.Mock)
        .calledWith('showTimezoneMessage')
        .mockReturnValue(true)

      const claimWithNoFiles = {
        ...claimData,
        attributes: {
          ...claimData.attributes,
          eventsTimeline: [],
        },
      }

      renderWithData(claimWithNoFiles)

      expect(screen.getByText(t('claimDetails.noFiles'))).toBeTruthy()
      expect(screen.queryByText(TIMEZONE_MESSAGE_PATTERN)).toBeFalsy()
    })
  })
})
