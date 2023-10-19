import React from 'react'
import { screen, waitFor } from '@testing-library/react-native'

import PersonalInformationScreen from './index'
import { context, mockNavProps, QueriesData, render, when } from 'testUtils'
import { personalInformationKeys } from 'api/personalInformation/queryKeys'
import { get } from 'store/api'
import { DemographicsPayload, GenderIdentityOptionsPayload, UserDemographics } from 'api/types'
import { featureEnabled } from 'utils/remoteConfig'

jest.mock('utils/remoteConfig')
when(featureEnabled as jest.Mock).calledWith('preferredNameGenderWaygate').mockReturnValue(true)

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
          o: 'A gender not listed here'
        },
      },
    }
  } as GenderIdentityOptionsPayload)

context('PersonalInformationScreen', () => {
  let props: any

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
        }
      } as DemographicsPayload)

    props = mockNavProps(
      {},
      {
        navigate: jest.fn(),
        goBack: jest.fn(),
      },
    )

    render(<PersonalInformationScreen {...props} />, { queriesData })
  }

  describe('when there is no birth date', () => {
    it('should display the message This information is not available right now', async () => {
      renderWithData([{
        queryKey: personalInformationKeys.personalInformation,
        data: {
          firstName: 'Gary',
          middleName: null,
          lastName: 'Washington',
          signinEmail: 'Gary.Washington@idme.com',
          signinService: 'IDME',
          fullName: 'Gary Washington',
          birthDate: null
        }
      }])
      await waitFor(() => expect(screen.getByText('This information is not available right now')).toBeTruthy())
    })
  })

  describe('when there is a birth date', () => {
    it('should display the birth date in the format Month day, year', async () => {
      renderWithData([{
        queryKey: personalInformationKeys.personalInformation,
        data: {
          firstName: 'Gary',
          middleName: null,
          lastName: 'Washington',
          signinEmail: 'Gary.Washington@idme.com',
          signinService: 'IDME',
          fullName: 'Gary Washington',
          birthDate: 'May 08, 1990'
        }
      }])
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
      const demographics = { genderIdentity: 'M', preferredName: ''}

      renderWithData(undefined, demographics)
      await waitFor(() => expect(screen.getByText('Man')).toBeTruthy())
    })
  })

  describe('when the preferred name is set', () => {
    it("displays the user's preferred name", async () => {
      const demographics = { genderIdentity: '', preferredName: 'Gar'}

      renderWithData(undefined, demographics)
      await waitFor(() => expect(screen.getByText('Gar')).toBeTruthy())
    })
  })

  describe('when fetching gender identity options fails', () => {
    it('displays error component', async () => {
      when(get as jest.Mock)
        .calledWith('/v0/user/gender_identity/edit')
        .mockRejectedValue('Error')

      renderWithData()
      await waitFor(() => expect(screen.getByText("The VA mobile app isn't working right now")).toBeTruthy())
    })
  })
})
