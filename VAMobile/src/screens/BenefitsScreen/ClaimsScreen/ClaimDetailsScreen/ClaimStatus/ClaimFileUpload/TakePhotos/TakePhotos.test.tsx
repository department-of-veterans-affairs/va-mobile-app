import React from 'react'

import { screen } from '@testing-library/react-native'

import { context, mockNavProps, render } from 'testUtils'

import TakePhotos from './TakePhotos'

context('TakePhotos', () => {
  const request = {
    type: 'still_need_from_you_list',
    date: '2020-07-16',
    status: 'NEEDED',
    uploaded: false,
    uploadsAllowed: true,
  }

  const initializeTestInstance = () => {
    const props = mockNavProps(undefined, { addListener: jest.fn(), setOptions: jest.fn() }, { params: { request } })
    render(<TakePhotos {...props} />)
  }

  it('initializes correctly', () => {
    initializeTestInstance()
    expect(screen.getByRole('tab', { name: 'This feature is not yet accessible to screen readers' })).toBeTruthy()
    expect(screen.getByRole('header', { name: 'Select photos to upload for' })).toBeTruthy()
    expect(
      screen.getByText(
        'To submit evidence that supports this claim, take a picture of each page of your file. Then upload the photos to this app.',
      ),
    ).toBeTruthy()
    expect(
      screen.getByText(
        "You can submit up to 10 photos. If you need to submit a file that's more than 10 pages, you may want to upload your file on VA.gov.",
      ),
    ).toBeTruthy()
    expect(screen.getByText('Maximum file size:')).toBeTruthy()
    expect(screen.getByText('50 MB')).toBeTruthy()
    expect(screen.getByText('Accepted file types:')).toBeTruthy()
    expect(screen.getByText('PDF (unlocked), GIF, JPEG, JPG, BMP, TXT')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Take or select photos' })).toBeTruthy()
  })
})
