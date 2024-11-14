import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

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
    await waitFor(() => expect(screen.getByText(t('personalInformation.genderIdentity.title'))).toBeTruthy())
    await waitFor(() =>
      expect(
        screen.getByText(
          `${t('personalInformation.genderIdentity.changeSelection')}${t('personalInformation.genderIdentity.preferNotToAnswer')}.`,
        ),
      ).toBeTruthy(),
    )
    await waitFor(() => expect(screen.getByRole('radio', { name: 'Man' })).toBeTruthy())
    await waitFor(() => expect(screen.getByRole('radio', { name: 'Non-binary' })).toBeTruthy())
    await waitFor(() => expect(screen.getByRole('radio', { name: 'Transgender man' })).toBeTruthy())
    await waitFor(() => expect(screen.getByRole('radio', { name: 'Transgender woman' })).toBeTruthy())
    await waitFor(() => expect(screen.getByRole('radio', { name: 'Woman' })).toBeTruthy())
    await waitFor(() =>
      expect(
        screen.getByRole('radio', { name: t('personalInformation.genderIdentity.preferNotToAnswer') }),
      ).toBeTruthy(),
    )
    await waitFor(() => expect(screen.getByRole('radio', { name: 'A gender not listed here' })).toBeTruthy())
    await waitFor(() =>
      expect(screen.getByRole('link', { name: t('personalInformation.genderIdentity.whatToKnow.title') })).toBeTruthy(),
    )
  })

  it('shows an error message on save when a gender identity type has not been selected', async () => {
    when(api.get as jest.Mock)
      .calledWith('/v0/user/demographics')
      .mockResolvedValue(demographicsPayload)
      .calledWith('/v0/user/gender_identity/edit')
      .mockResolvedValue(genderIdentityOptionsPayload)
    initializeTestInstance()

    await waitFor(() => fireEvent.press(screen.getByRole('button', { name: t('save') })))
    await waitFor(() => expect(screen.queryByText(t('selectOption'))).toBeTruthy())
  })

  it('renders the ErrorComponent when an error occurs', async () => {
    when(api.get as jest.Mock)
      .calledWith('/v0/user/demographics')
      .mockRejectedValue({ networkError: true } as api.APIError)
      .calledWith('/v0/user/gender_identity/edit')
      .mockRejectedValue({ networkError: true } as api.APIError)

    initializeTestInstance()
    await waitFor(() => {
      expect(screen.getByRole('header', { name: t('errors.networkConnection.header') })).toBeTruthy()
    })
  })
})
