import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'
import { DateTime, Settings } from 'luxon'

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

  const expectFilesToBeRendered = () => {
    expect(screen.getAllByText('filter-sketch.pdf')).toBeTruthy()
    expect(screen.getAllByText('Request type: other_documents_list')).toBeTruthy()
    expect(screen.getAllByText('Received: July 16, 2020')).toBeTruthy()
    expect(screen.getByText('Mark_Webb_600156928_526.pdf')).toBeTruthy()
    expect(screen.getByText('Document type: L533')).toBeTruthy()
    expect(screen.getByText('Received: June 06, 2019')).toBeTruthy()
  }

  describe('When there are files to display', () => {
    it('should render correctly', async () => {
      renderWithData(claimData)
      expectFilesToBeRendered()
    })
  })

  describe('Timezone message feature (temporary)', () => {
    const originalDefaultZone = Settings.defaultZone
    const originalNow = Settings.now

    beforeEach(() => {
      // Set fixed date in winter (January) for consistent timezone behavior
      const fixedDate = DateTime.utc(2025, 1, 15, 12)
      Settings.now = () => fixedDate.toMillis()
    })

    afterEach(() => {
      Settings.defaultZone = originalDefaultZone
      Settings.now = originalNow
    })

    describe('when feature flag is enabled', () => {
      beforeEach(() => {
        when(featureEnabled as jest.Mock)
          .calledWith('showTimezoneMessage')
          .mockReturnValue(true)
      })

      it('should show timezone message in non-UTC+0 timezone', () => {
        Settings.defaultZone = 'America/New_York'

        renderWithData(claimData)

        expect(screen.getByText(TIMEZONE_MESSAGE_PATTERN)).toBeTruthy()
        expectFilesToBeRendered()
      })

      it('should not show timezone message in UTC+0 timezone', () => {
        Settings.defaultZone = 'Europe/London'

        renderWithData(claimData)

        // Feature flag is ON, but message should NOT appear (UTC+0 returns empty string)
        expect(screen.queryByText(TIMEZONE_MESSAGE_PATTERN)).toBeFalsy()
        expectFilesToBeRendered()
      })

      it('should not show timezone message when there are no files', () => {
        Settings.defaultZone = 'America/New_York'

        const claimWithNoFiles = {
          ...claimData,
          attributes: {
            ...claimData.attributes,
            eventsTimeline: [],
          },
        }

        renderWithData(claimWithNoFiles)

        expect(screen.queryByText(TIMEZONE_MESSAGE_PATTERN)).toBeFalsy()
        expect(screen.getByText(t('claimDetails.noFiles'))).toBeTruthy()
      })
    })

    describe('when feature flag is disabled', () => {
      beforeEach(() => {
        when(featureEnabled as jest.Mock)
          .calledWith('showTimezoneMessage')
          .mockReturnValue(false)
      })

      it('should not show timezone message', () => {
        Settings.defaultZone = 'America/New_York'

        renderWithData(claimData)

        expect(screen.queryByText(TIMEZONE_MESSAGE_PATTERN)).toBeFalsy()
        expectFilesToBeRendered()
      })
    })
  })
})
