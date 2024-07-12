import React from 'react'

import { screen, waitFor } from '@testing-library/react-native'

import { personalInformationKeys } from 'api/personalInformation/queryKeys'
import { DemographicsPayload, GenderIdentityOptionsPayload, UserDemographics } from 'api/types'
import { get } from 'store/api'
import { QueriesData, context, mockNavProps, render, when } from 'testUtils'
import { featureEnabled } from 'utils/remoteConfig'

import PersonalInformationScreen from './index'

jest.mock('utils/remoteConfig')
when(featureEnabled as jest.Mock)
  .calledWith('preferredNameGenderWaygate')
  .mockReturnValue(true)

when(get as jest.Mock)
  .calledWith('/v0/user/gender_identity/edit')
  .mockResolvedValue({
    data: {
      id: '23fe358d-6e82-4541-804c-ce7562ba28f4',
      type: 'GenderIdentityOptions',
      attributes: {
        options: {
          m: 'Man',
          b: 'Non-Binary',
          tm: 'Transgender Man',
          tf: 'Transgender Woman',
          f: 'Woman',
          n: 'Prefer not to answer',
          o: 'A gender not listed here',
        },
      },
    },
  } as GenderIdentityOptionsPayload)

context('PersonalInformationScreen', () => {
  const renderWithData = (queriesData?: QueriesData, demographics?: UserDemographics) => {
    when(get as jest.Mock)
      .calledWith('/v0/user/demographics')
      .mockResolvedValue({
        data: {
          id: 'ae19ab8a-7165-57d1-a8e2-200f5031f66c',
          type: 'demographics',
          attributes: {
            genderIdentity: demographics?.genderIdentity || '',
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
    expect(screen.getByText('Loading your personal information...')).toBeTruthy()
    await waitFor(() => expect(screen.getByLabelText('Personal information')).toBeTruthy())
    await waitFor(() =>
      expect(screen.getByText('Any updates you make here will also update in your VA.gov profile.')).toBeTruthy(),
    )
    await waitFor(() =>
      expect(screen.getByRole('link', { name: 'How to update or fix an error in your legal name' })).toBeTruthy(),
    )
    await waitFor(() => expect(screen.getByText('Date of birth')).toBeTruthy())
    await waitFor(() =>
      expect(screen.getByRole('link', { name: 'How to fix an error in your date of birth' })).toBeTruthy(),
    )
    await waitFor(() => expect(screen.getByText('Preferred name')).toBeTruthy())
    await waitFor(() => expect(screen.getByText('Gender identity')).toBeTruthy())
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
      await waitFor(() => expect(screen.getByText('This information is not available right now')).toBeTruthy())
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
    it('displays message on sharing gender identity and preferred name', async () => {
      renderWithData()
      await waitFor(() => expect(screen.getByText('Sharing your gender identity is optional.')).toBeTruthy())
      await waitFor(() => expect(screen.getByText('Sharing your preferred name is optional.')).toBeTruthy())
    })
  })

  describe('when the gender identity is set', () => {
    it("displays the user's gender identity", async () => {
      const demographics = { genderIdentity: 'M', preferredName: '' }

      renderWithData(undefined, demographics)
      await waitFor(() => expect(screen.getByText('Man')).toBeTruthy())
    })
  })

  describe('when the preferred name is set', () => {
    it("displays the user's preferred name", async () => {
      const demographics = { genderIdentity: '', preferredName: 'Gar' }

      renderWithData(undefined, demographics)
      await waitFor(() => expect(screen.getByText('Gar')).toBeTruthy())
    })
  })

  describe('when fetching gender identity options fails', () => {
    it('displays error component', async () => {
      when(get as jest.Mock)
        .calledWith('/v0/user/gender_identity/edit')
        .mockRejectedValue({ networkError: 500 })

      renderWithData()
      await waitFor(() => expect(screen.getByText("The app can't be loaded.")).toBeTruthy())
    })
  })
})
