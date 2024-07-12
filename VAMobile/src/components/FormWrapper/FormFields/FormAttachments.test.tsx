import React from 'react'

import { context, fireEvent, render, screen } from 'testUtils'

import FormAttachments from './FormAttachments'

const mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => {
      return mockNavigationSpy
    },
  }
})

context('FormAttachments', () => {
  let removeOnPressSpy: jest.Mock
  let largeButtonSpy: jest.Mock
  let mockNavigateToSpy: jest.Mock

  const attachmentsList = [
    {
      uri: '',
      fileCopyUri: '',
      type: '',
      name: 'file.txt',
      size: 10,
    },
    {
      assets: [
        {
          uri: '',
          fileName: 'image.jpeg',
        },
      ],
    },
  ]

  const initializeTestInstance = (attachments = attachmentsList) => {
    removeOnPressSpy = jest.fn()
    largeButtonSpy = jest.fn()
    mockNavigateToSpy = jest.fn()
    mockNavigationSpy.mockReturnValue(mockNavigateToSpy)

    render(
      <FormAttachments
        removeOnPress={removeOnPressSpy}
        buttonLabel="add files"
        buttonPress={largeButtonSpy}
        attachmentsList={attachments}
      />,
    )
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  describe('when there are attachments', () => {
    it('should display a remove button', () => {
      expect(screen.getAllByText('Remove').length).toBeGreaterThan(0)
      expect(screen.getAllByRole('button', { name: 'Remove' }).length).toBeGreaterThan(0)
    })

    describe('when the remove button is clicked for an attachment', () => {
      it('should call the removeOnPress', () => {
        fireEvent.press(screen.getAllByRole('button', { name: 'Remove' })[0])
        expect(removeOnPressSpy).toHaveBeenCalled()
      })
    })
  })

  describe('when there are no attachments', () => {
    it('should not display a remove button', () => {
      initializeTestInstance([])
      expect(screen.queryByRole('button', { name: 'Remove' })).toBeFalsy()
      expect(screen.getByRole('button', { name: 'add files' })).toBeTruthy()
      expect(screen.getByText('Attachments')).toBeTruthy()
    })
  })

  describe('when the large button is clicked', () => {
    it('should call the largeButtonOnClick', () => {
      fireEvent.press(screen.getByRole('button', { name: 'add files' }))
      expect(largeButtonSpy).toHaveBeenCalled()
    })
  })
})
