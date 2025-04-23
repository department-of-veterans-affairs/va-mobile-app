import React from 'react'

import { t } from 'i18next'

import { context, fireEvent, mockNavProps, render, screen, waitFor } from 'testUtils'

import SubmitEvidence from './SubmitEvidence'

const mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

context('SubmitEvidence', () => {
  const renderWithData = (): void => {
    const props = mockNavProps(undefined, undefined, { params: { claimID: '600156928' } })

    render(<SubmitEvidence {...props} />)
  }

  describe('initializes', () => {
    it('displays correctly', async () => {
      renderWithData()
      await waitFor(() => expect(screen.getByRole('header', { name: t('claimDetails.submitEvidence') })).toBeTruthy())
      await waitFor(() =>
        expect(screen.getByRole('header', { name: t('claimDetails.submitEvidence.whatToKnow.title') })).toBeTruthy(),
      )
      await waitFor(() => expect(screen.getByText(t('claimDetails.submitEvidence.whatToKnow.body'))).toBeTruthy())
      await waitFor(() => expect(screen.getByRole('button', { name: t('fileUpload.selectAFile') })).toBeTruthy())
      await waitFor(() => expect(screen.getByRole('button', { name: t('fileUpload.takeOrSelectPhotos') })).toBeTruthy())
    })
    it('on select file press', async () => {
      renderWithData()
      await waitFor(() => fireEvent.press(screen.getByRole('button', { name: t('fileUpload.selectAFile') })))
      await waitFor(() =>
        expect(mockNavigationSpy).toHaveBeenCalledWith('SelectFile', {
          claimID: '600156928',
        }),
      )
    })
    it('on take or select pphotos press', async () => {
      renderWithData()
      await waitFor(() => fireEvent.press(screen.getByRole('button', { name: t('fileUpload.takeOrSelectPhotos') })))
      await waitFor(() =>
        expect(mockNavigationSpy).toHaveBeenCalledWith('TakePhotos', {
          claimID: '600156928',
        }),
      )
    })
  })
})
