import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { ClaimData } from 'api/types'
import ClaimFiles from 'screens/BenefitsScreen/ClaimsScreen/ClaimDetailsScreen/ClaimFiles/ClaimFiles'
import { claim as claimData } from 'screens/BenefitsScreen/ClaimsScreen/claimData'
import { context, render } from 'testUtils'

jest.mock('utils/remoteConfig')

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

      // Verify timezone message is displayed
      // Using regex pattern to match message regardless of developer's timezone (PDT, EDT, etc.)
      expect(
        screen.getByText(
          /Files uploaded (before|after) .+ will show as received on the (previous|next) day, but we record your submissions when you upload them/,
        ),
      ).toBeTruthy()
    })
  })

  describe('When there are no files to display', () => {
    it('should show no files message without timezone message', () => {
      const claimWithNoFiles = {
        ...claimData,
        attributes: {
          ...claimData.attributes,
          eventsTimeline: [],
        },
      }

      renderWithData(claimWithNoFiles)

      // Verify no files message
      expect(screen.getByText(t('claimDetails.noFiles'))).toBeTruthy()

      // Verify timezone message is NOT shown
      expect(
        screen.queryByText(
          /Files uploaded (before|after) .+ will show as received on the (previous|next) day, but we record your submissions when you upload them/,
        ),
      ).toBeFalsy()
    })
  })
})
