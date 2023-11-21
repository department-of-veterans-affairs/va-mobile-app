import React from 'react'
import { fireEvent, screen } from '@testing-library/react-native'

import { context, mockNavProps, render, waitFor } from 'testUtils'
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

    render(<GenderIdentityScreen {...props} />)
  }

  it('initializes correctly', () => {
    initializeTestInstance()
    expect(screen.getByText('Gender identity')).toBeTruthy()
    expect(screen.getByText('You can change your selection at any time. If you decide you no longer want to share your gender identity, select Prefer not to answer.')).toBeTruthy()
    expect(screen.getByRole('radio', { name: 'Man' })).toBeTruthy()
    expect(screen.getByRole('radio', { name: 'Non-binary' })).toBeTruthy()
    expect(screen.getByRole('radio', { name: 'Transgender man' })).toBeTruthy()
    expect(screen.getByRole('radio', { name: 'Transgender woman' })).toBeTruthy()
    expect(screen.getByRole('radio', { name: 'Woman' })).toBeTruthy()
    expect(screen.getByRole('radio', { name: 'Prefer not to answer' })).toBeTruthy()
    expect(screen.getByRole('radio', { name: 'A gender not listed here' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'What to know before you decide to share your gender identity' })).toBeTruthy()
  })

  it('shows an error message on save when a gender identity type has not been selected', () => {
    initializeTestInstance()

    fireEvent.press(screen.getByRole('button', { name: 'Save' }))
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
    await waitFor(() => {
      expect(screen.getByRole('header', { name: "The VA mobile app isn't working right now" })).toBeTruthy()
    })
  })
})
