import React from 'react'

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

context('FileRequest', () => {
  const renderWithData = (): void => {
    const props = mockNavProps(undefined, undefined, { params: { claimID: '600156928' } })

    render(<SubmitEvidence {...props} />)
  }

  describe('initializes', () => {
    it('displays correctly', async () => {
      renderWithData()
      await waitFor(() => expect(screen.getByRole('header', { name: 'Submit evidence' })).toBeTruthy())
      await waitFor(() =>
        expect(screen.getByRole('header', { name: 'What to know before you submit evidence' })).toBeTruthy(),
      )
      await waitFor(() =>
        expect(
          screen.getByText(
            'You can submit evidence for this claim at any time. But if you submit evidence after Step 3, your claim will go back to that step for review.',
          ),
        ).toBeTruthy(),
      )
      await waitFor(() => expect(screen.getByRole('button', { name: 'Select a file' })).toBeTruthy())
      await waitFor(() => expect(screen.getByRole('button', { name: 'Take or select photos' })).toBeTruthy())
    })
    it('on select file press', async () => {
      renderWithData()
      await waitFor(() => fireEvent.press(screen.getByRole('button', { name: 'Select a file' })))
      await waitFor(() =>
        expect(mockNavigationSpy).toHaveBeenCalledWith('SelectFile', {
          claimID: '600156928',
        }),
      )
    })
    it('on take or select pphotos press', async () => {
      renderWithData()
      await waitFor(() => fireEvent.press(screen.getByRole('button', { name: 'Take or select photos' })))
      await waitFor(() =>
        expect(mockNavigationSpy).toHaveBeenCalledWith('TakePhotos', {
          claimID: '600156928',
        }),
      )
    })
  })
})
