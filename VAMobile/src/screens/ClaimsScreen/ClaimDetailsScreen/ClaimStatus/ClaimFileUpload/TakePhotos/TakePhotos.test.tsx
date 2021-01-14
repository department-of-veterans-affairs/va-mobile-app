import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import {context, mockNavProps, renderWithProviders} from 'testUtils'
import { act } from 'react-test-renderer'

import TakePhotos from './TakePhotos'

context('TakePhotos', () => {
  let component: any
  let testInstance: any
  let props: any

  let request = {
    type: 'still_need_from_you_list',
    date: '2020-07-16',
    status: 'NEEDED',
    uploaded: false,
    uploadsAllowed: true
  }


  const initializeTestInstance = () => {
    props = mockNavProps(undefined, { setOptions: jest.fn() }, { params: { request } })

    act(() => {
      component = renderWithProviders(<TakePhotos {...props}/>)
    })

    testInstance = component.root
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })
})
