import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { ReactTestInstance } from 'react-test-renderer'

import { context, mockNavProps, render, RenderAPI, screen, waitFor } from 'testUtils'
import { ErrorComponent, RadioGroup, VAButton } from 'components'
import GenderIdentityScreen from './GenderIdentityScreen'
import { GenderIdentityOptions } from 'api/types/DemographicsData'

const genderIdentityOptions: GenderIdentityOptions = {
  M: 'Man',
  B: 'Non-binary',
  TM: 'Transgender man',
  TF: 'Transgender woman',
  F: 'Woman',
  N: 'Prefer not to answer',
  O: 'A gender not listed here',
}

jest.mock('../../../../../api/demographics/getGenderIdentityOptions', () => {
  let original = jest.requireActual('../../../../../api/demographics/getGenderIdentityOptions')
  return {
    ...original,
    useGenderIdentityOptions: () => ({
      status: "success",
      data: genderIdentityOptions
    }),
  }
})

context('GenderIdentityScreen', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance
  let props: any

  afterEach(() => {
    jest.clearAllMocks()
  })
  
  const initializeTestInstance = () => {
    props = mockNavProps(
      {},
      {
        navigate: jest.fn(),
        goBack: jest.fn(),
        addListener: jest.fn(),
      },
      {})

    component = render(<GenderIdentityScreen {...props} />)
    testInstance = component.UNSAFE_root
  }

  it('initializes correctly', async () => {
    initializeTestInstance()
    expect(component).toBeTruthy()
  })

  it('sets up radio group correctly', async () => {
    initializeTestInstance()

    const radioGroup = testInstance.findAllByType(RadioGroup)[0]
    expect(radioGroup.props.value).toEqual(undefined)
  })

  it('shows an error message on save when a gender identity type has not been selected', async () => {
    initializeTestInstance()

    testInstance.findAllByType(VAButton)[0].props.onPress()
    expect(screen.queryByText('Select an option')).toBeTruthy()
  })

  it('renders the ErrorComponent when an error occurs', async () => {
    jest.mock('../../../../../api/demographics/getGenderIdentityOptions', () => {
      let original = jest.requireActual('../../../../../api/demographics/getGenderIdentityOptions')
      return {
        ...original,
        useGenderIdentityOptions: () => ({
          status: "error",
        }),
      }
    })

    initializeTestInstance()
    await waitFor(async () => {
      expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(1)
    })
  })
})
