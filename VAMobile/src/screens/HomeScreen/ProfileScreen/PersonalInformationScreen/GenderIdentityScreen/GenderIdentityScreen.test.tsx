import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'

import * as api from 'store/api'
import { context, mockNavProps, render, waitFor, when } from 'testUtils'

import GenderIdentityScreen from './GenderIdentityScreen'

context('GenderIdentityScreen', () => {
  const genderIdentityOptionsPayload = {
    data: {
      id: '1',
      type: 'string',
      attributes: {
        options: {
          M: 'Man',
          B: 'Non-binary',
          TM: 'Transgender man',
          TF: 'Transgender woman',
          F: 'Woman',
          N: 'Prefer not to answer',
          O: 'A gender not listed here',
        },
      },
    },
  }

  const demographicsPayload = {
    data: {
      id: '1',
      type: 'string',
      attributes: {
        genderIdentity: 'M',
        preferredName: 'Jim',
      },
    },
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  const initializeTestInstance = () => {
    const props = mockNavProps(
      {},
      {
        navigate: jest.fn(),
        goBack: jest.fn(),
        addListener: jest.fn(),
      },
      {},
    )

    render(<GenderIdentityScreen {...props} />)
  }

  it('initializes correctly', async () => {
    when(api.get as jest.Mock)
      .calledWith('/v0/user/demographics')
      .mockResolvedValue(demographicsPayload)
      .calledWith('/v0/user/gender_identity/edit')
      .mockResolvedValue(genderIdentityOptionsPayload)
    initializeTestInstance()
    await waitFor(() => expect(screen.getByText('Gender identity')).toBeTruthy())
    await waitFor(() =>
      expect(
        screen.getByText(
          'You can change your selection at any time. If you decide you no longer want to share your gender identity, select Prefer not to answer.',
        ),
      ).toBeTruthy(),
    )
    await waitFor(() => expect(screen.getByRole('link', { name: 'Man' })).toBeTruthy())
    await waitFor(() => expect(screen.getByRole('link', { name: 'Non-binary' })).toBeTruthy())
    await waitFor(() => expect(screen.getByRole('link', { name: 'Transgender man' })).toBeTruthy())
    await waitFor(() => expect(screen.getByRole('link', { name: 'Transgender woman' })).toBeTruthy())
    await waitFor(() => expect(screen.getByRole('link', { name: 'Woman' })).toBeTruthy())
    await waitFor(() => expect(screen.getByRole('link', { name: 'Prefer not to answer' })).toBeTruthy())
    await waitFor(() => expect(screen.getByRole('link', { name: 'A gender not listed here' })).toBeTruthy())
    await waitFor(() =>
      expect(
        screen.getByRole('link', { name: 'What to know before you decide to share your gender identity' }),
      ).toBeTruthy(),
    )
  })

  it('shows an error message on save when a gender identity type has not been selected', async () => {
    when(api.get as jest.Mock)
      .calledWith('/v0/user/demographics')
      .mockResolvedValue(demographicsPayload)
      .calledWith('/v0/user/gender_identity/edit')
      .mockResolvedValue(genderIdentityOptionsPayload)
    initializeTestInstance()

    await waitFor(() => fireEvent.press(screen.getByRole('button', { name: 'Save' })))
    await waitFor(() => expect(screen.queryByText('Select an option')).toBeTruthy())
  })

  it('renders the ErrorComponent when an error occurs', async () => {
    when(api.get as jest.Mock)
      .calledWith('/v0/user/demographics')
      .mockRejectedValue({ networkError: true } as api.APIError)
      .calledWith('/v0/user/gender_identity/edit')
      .mockRejectedValue({ networkError: true } as api.APIError)

    initializeTestInstance()
    await waitFor(() => {
      expect(screen.getByRole('header', { name: "The app can't be loaded." })).toBeTruthy()
    })
  })
})
