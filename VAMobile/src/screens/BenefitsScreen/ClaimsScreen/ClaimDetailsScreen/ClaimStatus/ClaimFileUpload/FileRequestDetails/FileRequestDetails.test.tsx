import React from 'react'
import { screen } from '@testing-library/react-native'

import { context, mockNavProps, render } from 'testUtils'
import FileRequestDetails from './FileRequestDetails'
import { ClaimEventData } from 'store/api'

context('FileRequestDetails', () => {
  let request = {
    type: 'still_need_from_you_list',
    date: '2020-07-16',
    status: 'NEEDED',
    uploaded: false,
    uploadsAllowed: true,
    displayName: 'Request 1',
    description: 'Need DD214',
  }

  const initializeTestInstance = (request: ClaimEventData) => {
    const props = mockNavProps(undefined, { setOptions: jest.fn() }, { params: { request } })

    render(<FileRequestDetails {...props} />)
  }

  beforeEach(() => {
    initializeTestInstance(request)
  })

  it('initializes correctly', () => {
    expect(screen.getByText('Requests')).toBeTruthy()
    expect(screen.getAllByText('Request 1')).toBeTruthy()
    expect(screen.getByText('Need DD214')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Select a file' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Take or select photos' })).toBeTruthy()
  })
})
