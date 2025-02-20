import React from 'react'

import { screen, waitFor } from '@testing-library/react-native'
import { t } from 'i18next'

import { personalInformationKeys } from 'api/personalInformation/queryKeys'
import { DemographicsPayload, UserDemographics } from 'api/types'
import { get } from 'store/api'
import { QueriesData, context, mockNavProps, render, when } from 'testUtils'
import { featureEnabled } from 'utils/remoteConfig'

import PersonalInformationScreen from './index'

jest.mock('utils/remoteConfig')
when(featureEnabled as jest.Mock)
  .calledWith('preferredNameGenderWaygate')
  .mockReturnValue(true)

context('PersonalInformationScreen', () => {
  const renderWithData = (queriesData?: QueriesData, demographics?: UserDemographics) => {
    when(get as jest.Mock)
      .calledWith('/v0/user/demographics')
      .mockResolvedValue({
        data: {
          id: 'ae19ab8a-7165-57d1-a8e2-200f5031f66c',
          type: 'demographics',
          attributes: {
            preferredName: demographics?.preferredName || '',
          },
        },
      } as DemographicsPayload)

    const props = mockNavProps(
      {},
      {
        navigate: jest.fn(),
        goBack: jest.fn(),
      },
    )

    render(<PersonalInformationScreen {...props} />, { queriesData })
  }

  it('renders correctly', async () => {
    renderWithData()
    expect(screen.getByText(t('personalInformation.loading'))).toBeTruthy()
    await waitFor(() => expect(screen.getByLabelText(t('personalInformation.title'))).toBeTruthy())
    await waitFor(() => expect(screen.getByText(t('contactInformation.editNote'))).toBeTruthy())
    await waitFor(() =>
      expect(screen.getByRole('link', { name: t('personalInformation.howToFixLegalName') })).toBeTruthy(),
    )
    await waitFor(() => expect(screen.getByText(t('personalInformation.dateOfBirth'))).toBeTruthy())
    await waitFor(() =>
      expect(screen.getByRole('link', { name: t('personalInformation.howToFixDateOfBirth') })).toBeTruthy(),
    )
    await waitFor(() => expect(screen.getByText(t('personalInformation.preferredName.title'))).toBeTruthy())
  })

  describe('when there is no birth date', () => {
    it('should display the message This information is not available right now', async () => {
      renderWithData([
        {
          queryKey: personalInformationKeys.personalInformation,
          data: {
            firstName: 'Gary',
            middleName: null,
            lastName: 'Washington',
            signinEmail: 'Gary.Washington@idme.com',
            signinService: 'IDME',
            fullName: 'Gary Washington',
            birthDate: null,
          },
        },
      ])
      await waitFor(() => expect(screen.getByText(t('personalInformation.informationNotAvailable'))).toBeTruthy())
    })
  })

  describe('when there is a birth date', () => {
    it('should display the birth date in the format Month day, year', async () => {
      renderWithData([
        {
          queryKey: personalInformationKeys.personalInformation,
          data: {
            firstName: 'Gary',
            middleName: null,
            lastName: 'Washington',
            signinEmail: 'Gary.Washington@idme.com',
            signinService: 'IDME',
            fullName: 'Gary Washington',
            birthDate: 'May 08, 1990',
          },
        },
      ])
      await waitFor(() => expect(screen.getByText('May 08, 1990')).toBeTruthy())
    })
  })

  describe("when demographics information isn't set", () => {
    it('displays message on sharing preferred name', async () => {
      renderWithData()
      await waitFor(() =>
        expect(
          screen.getByText(
            t('personalInformation.genericBody', {
              informationType: t('personalInformation.preferredName.title').toLowerCase(),
            }),
          ),
        ).toBeTruthy(),
      )
    })
  })

  describe('when the preferred name is set', () => {
    it("displays the user's preferred name", async () => {
      const demographics = { preferredName: 'Gar' }

      renderWithData(undefined, demographics)
      await waitFor(() => expect(screen.getByText('Gar')).toBeTruthy())
    })
  })
})
