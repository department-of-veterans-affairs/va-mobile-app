import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { ReactTestInstance } from 'react-test-renderer'
import { context, mockNavProps, render, RenderAPI } from 'testUtils'
import { Pressable } from 'react-native'
import { LettersOverviewScreen } from './index'
import { profileAddressOptions } from 'screens/HomeScreen/ProfileScreen/ContactInformationScreen/AddressSummary'

let mockNavigationSpy = jest.fn()

context('LettersOverviewScreen', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance

  const initializeTestInstance = () => {

    const props = mockNavProps(undefined,
      {
        navigate: mockNavigationSpy,
      },
    )

    component = render(<LettersOverviewScreen {...props} />)

    testInstance = component.UNSAFE_root
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  it('should go to edit address when the address is pressed', async () => {
    testInstance.findAllByType(Pressable)[0].props.onPress()
    expect(mockNavigationSpy).toHaveBeenCalledWith('EditAddress', { displayTitle: 'Mailing address', addressType: profileAddressOptions.MAILING_ADDRESS })
  })
})
