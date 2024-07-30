import React from 'react'

import { screen } from '@testing-library/react-native'

import { ClaimData } from 'api/types'
import { context, render } from 'testUtils'

import { claim as claimData } from '../../claimData'
import ClaimFiles from './ClaimFiles'

jest.mock('utils/remoteConfig')

context('ClaimDetailsScreen', () => {
  const renderWithData = (claim: ClaimData): void => {
    render(<ClaimFiles claim={claim} />)
  }

  describe('When there are files to display', () => {
    it('it should render correctly', async () => {
      renderWithData(claimData)
      expect(screen.getAllByText('filter-sketch.pdf')).toBeTruthy()
      expect(screen.getAllByText('Request type: other_documents_list')).toBeTruthy()
      expect(screen.getAllByText('Received: July 16, 2020')).toBeTruthy()

      expect(screen.getByText('Mark_Webb_600156928_526.pdf')).toBeTruthy()
      expect(screen.getByText('Document type: L533')).toBeTruthy()
      expect(screen.getByText('Received: June 06, 2019')).toBeTruthy()
    })
  })
})
