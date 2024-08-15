import React from 'react'
import { Linking } from 'react-native'

import { fireEvent, screen, waitFor } from '@testing-library/react-native'
import { DateTime } from 'luxon'

import { DisabilityRatingData, FacilitiesPayload, LetterBeneficiaryDataPayload } from 'api/types'
import { DEFAULT_UPCOMING_DAYS_LIMIT } from 'constants/appointments'
import { get } from 'store/api'
import { ErrorsState } from 'store/slices'
import { RenderParams, context, mockNavProps, render, when } from 'testUtils'
import {
  getAppointmentsPayload,
  getClaimsAndAppealsPayload,
  getFoldersPayload,
  getPrescriptionsPayload,
} from 'utils/tests/personalization'

import { HomeScreen } from './HomeScreen'

const mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')

  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

const getFacilitiesPayload = (isCernerPatient: boolean): FacilitiesPayload => ({
  data: {
    attributes: {
      facilities: [
        {
          id: '0',
          name: 'Cary VA Medical Center',
          city: 'Cary',
          state: 'WY',
          cerner: isCernerPatient,
          miles: '3.63',
        },
      ],
    },
  },
})

const getDisabilityRatingPayload = (combinedDisabilityRating: number): DisabilityRatingData => ({
  data: {
    type: 'disabilityRating',
    id: '0',
    attributes: {
      combinedDisabilityRating,
      combinedEffectiveDate: '',
      legalEffectiveDate: '',
      individualRatings: [],
    },
  },
})

const getLetterBeneficiaryPayload = (monthlyAwardAmount: number): LetterBeneficiaryDataPayload => ({
  data: {
    id: '0',
    type: '',
    attributes: {
      benefitInformation: {
        awardEffectiveDate: '',
        hasChapter35Eligibility: null,
        monthlyAwardAmount,
        serviceConnectedPercentage: null,
      },
      militaryService: [],
    },
  },
})

context('HomeScreen', () => {
  const initializeTestInstance = (options?: RenderParams) => {
    const props = mockNavProps(undefined, { setOptions: jest.fn(), navigate: mockNavigationSpy })
    render(<HomeScreen {...props} />, { ...options })
  }

  describe('Activity section', () => {
    it('displays error message when one of the API calls fails', async () => {
      when(get as jest.Mock)
        .calledWith('/v0/appointments', expect.anything())
        .mockResolvedValue(getAppointmentsPayload(3))
        .calledWith('/v0/claims-and-appeals-overview', expect.anything())
        .mockResolvedValue(getClaimsAndAppealsPayload(3))
        .calledWith('/v0/messaging/health/folders')
        .mockResolvedValue(getFoldersPayload(3))
        .calledWith('/v0/health/rx/prescriptions', expect.anything())
        .mockRejectedValue('failure')

      initializeTestInstance()
      await waitFor(() =>
        expect(screen.queryByText('We can’t show all activity right now. Check back later.')).toBeTruthy(),
      )
    })

    it('displays error message when one of the features are in downtime', async () => {
      when(get as jest.Mock)
        .calledWith('/v0/appointments', expect.anything())
        .mockResolvedValue(getAppointmentsPayload(3))
        .calledWith('/v0/claims-and-appeals-overview', expect.anything())
        .mockResolvedValue(getClaimsAndAppealsPayload(3))
        .calledWith('/v0/messaging/health/folders')
        .mockResolvedValue(getFoldersPayload(3))
        .calledWith('/v0/health/rx/prescriptions', expect.anything())
        .mockResolvedValue(getPrescriptionsPayload(3))

      initializeTestInstance({
        preloadedState: {
          errors: {
            downtimeWindowsByFeature: {
              rx_refill: {
                startTime: DateTime.now(),
                endTime: DateTime.now().plus({ minutes: 1 }),
              },
            },
          } as ErrorsState,
        },
      })
      await waitFor(() => expect(screen.queryByText('Loading mobile app activity...')).toBeFalsy())
      await waitFor(() =>
        expect(screen.getByText('We can’t show all activity right now. Check back later.')).toBeTruthy(),
      )
    })

    it('displays error message when all the features are in downtime', async () => {
      const downtimeWindow = {
        startTime: DateTime.now(),
        endTime: DateTime.now().plus({ minutes: 1 }),
      }
      when(get as jest.Mock)
        .calledWith('/v0/appointments', expect.anything())
        .mockResolvedValue(getAppointmentsPayload(3))
        .calledWith('/v0/claims-and-appeals-overview', expect.anything())
        .mockResolvedValue(getClaimsAndAppealsPayload(3))
        .calledWith('/v0/messaging/health/folders')
        .mockResolvedValue(getFoldersPayload(3))
        .calledWith('/v0/health/rx/prescriptions', expect.anything())
        .mockResolvedValue(getPrescriptionsPayload(3))

      initializeTestInstance({
        preloadedState: {
          errors: {
            downtimeWindowsByFeature: {
              appointments: downtimeWindow,
              appeals: downtimeWindow,
              claims: downtimeWindow,
              secure_messaging: downtimeWindow,
              rx_refill: downtimeWindow,
            },
          } as ErrorsState,
        },
      })
      await waitFor(() => expect(screen.queryByText('Loading mobile app activity...')).toBeFalsy())
      await waitFor(() =>
        expect(screen.getByText('We can’t show all activity right now. Check back later.')).toBeTruthy(),
      )
    })

    it('does not display an error message when all API calls succeed', async () => {
      when(get as jest.Mock)
        .calledWith('/v0/appointments', expect.anything())
        .mockResolvedValue(getAppointmentsPayload(3))
        .calledWith('/v0/claims-and-appeals-overview', expect.anything())
        .mockResolvedValue(getClaimsAndAppealsPayload(3))
        .calledWith('/v0/messaging/health/folders')
        .mockResolvedValue(getFoldersPayload(3))
        .calledWith('/v0/health/rx/prescriptions', expect.anything())
        .mockResolvedValue(getPrescriptionsPayload(3))

      initializeTestInstance()
      await waitFor(() => expect(screen.queryByText('Loading mobile app activity...')).toBeFalsy())
      await waitFor(() =>
        expect(screen.queryByText('We can’t show all activity right now. Check back later.')).toBeFalsy(),
      )
    })

    it('displays cerner related message if veteran has a cerner facility', async () => {
      when(get as jest.Mock)
        .calledWith('/v0/facilities-info')
        .mockResolvedValue(getFacilitiesPayload(true))
      initializeTestInstance()
      await waitFor(() => expect(screen.getByText('Information from My VA Health portal not included.')).toBeTruthy())
    })

    it('does not display cerner related message if veteran does not have a cerner facility', async () => {
      when(get as jest.Mock)
        .calledWith('/v0/facilities-info')
        .mockResolvedValue(getFacilitiesPayload(false))
      initializeTestInstance()
      await waitFor(() => expect(get).toBeCalledWith('/v0/facilities-info'))
      await waitFor(() => expect(screen.queryByText('Information from My VA Health portal not included.')).toBeFalsy())
    })
  })

  describe('Appointments module', () => {
    it('displays upcoming appointment count when there are upcoming appointments', async () => {
      const upcomingAppointmentsCount = 3
      when(get as jest.Mock)
        .calledWith('/v0/appointments', expect.anything())
        .mockResolvedValue(getAppointmentsPayload(upcomingAppointmentsCount))
      initializeTestInstance()
      await waitFor(() => expect(screen.getByRole('link', { name: 'Appointments' })).toBeTruthy())
      await waitFor(() =>
        expect(
          screen.getByRole('link', {
            name: `${upcomingAppointmentsCount} in the next ${DEFAULT_UPCOMING_DAYS_LIMIT} days`,
          }),
        ).toBeTruthy(),
      )
    })

    it('navigates to Appointments screen when pressed', async () => {
      when(get as jest.Mock)
        .calledWith('/v0/appointments', expect.anything())
        .mockResolvedValue(getAppointmentsPayload(3))
      initializeTestInstance()
      await waitFor(() => fireEvent.press(screen.getByRole('link', { name: 'Appointments' })))
      await waitFor(() => expect(Linking.openURL).toBeCalledWith('vamobile://appointments'))
    })

    it('is not displayed when there are no upcoming appointments', async () => {
      when(get as jest.Mock)
        .calledWith('/v0/appointments', expect.anything())
        .mockResolvedValue(getAppointmentsPayload(0))
      initializeTestInstance()
      await waitFor(() => expect(screen.queryByText('Loading mobile app activity...')).toBeFalsy())
      await waitFor(() => expect(screen.queryByRole('link', { name: 'Appointments' })).toBeFalsy())
    })

    it('is not displayed when the API call throws an error', async () => {
      when(get as jest.Mock)
        .calledWith('/v0/appointments', expect.anything())
        .mockRejectedValue('fail')
      initializeTestInstance()
      await waitFor(() => expect(screen.queryByText('Loading mobile app activity...')).toBeFalsy())
      await waitFor(() => expect(screen.queryByRole('link', { name: 'Appointments' })).toBeFalsy())
    })

    it('is not displayed when appointments is in downtime', async () => {
      when(get as jest.Mock)
        .calledWith('/v0/appointments', expect.anything())
        .mockResolvedValue(getAppointmentsPayload(3))
      initializeTestInstance({
        preloadedState: {
          errors: {
            downtimeWindowsByFeature: {
              appointments: {
                startTime: DateTime.now(),
                endTime: DateTime.now().plus({ minutes: 1 }),
              },
            },
          } as ErrorsState,
        },
      })
      await waitFor(() => expect(screen.queryByText('Loading mobile app activity...')).toBeFalsy())
      await waitFor(() => expect(screen.queryByRole('link', { name: 'Appointments' })).toBeFalsy())
    })
  })

  describe('Claims module', () => {
    it('displays active claims count when there are active claims', async () => {
      const activeClaimsCount = 3
      when(get as jest.Mock)
        .calledWith('/v0/claims-and-appeals-overview', expect.anything())
        .mockResolvedValue(getClaimsAndAppealsPayload(activeClaimsCount))
      initializeTestInstance()
      await waitFor(() => expect(screen.getByRole('link', { name: 'Claims' })).toBeTruthy())
      await waitFor(() => expect(screen.getByRole('link', { name: `${activeClaimsCount} active` })).toBeTruthy())
    })

    it('navigates to Claims history screen when pressed', async () => {
      when(get as jest.Mock)
        .calledWith('/v0/claims-and-appeals-overview', expect.anything())
        .mockResolvedValue(getClaimsAndAppealsPayload(2))
      initializeTestInstance()
      await waitFor(() => fireEvent.press(screen.getByRole('link', { name: 'Claims' })))
      await waitFor(() => expect(Linking.openURL).toBeCalledWith('vamobile://claims'))
    })

    it('is not displayed when there are no active claims', async () => {
      when(get as jest.Mock)
        .calledWith('/v0/claims-and-appeals-overview', expect.anything())
        .mockResolvedValue(getClaimsAndAppealsPayload(0))
      initializeTestInstance()
      await waitFor(() => expect(screen.queryByText('Loading mobile app activity...')).toBeFalsy())
      await waitFor(() => expect(screen.queryByRole('link', { name: 'Claims' })).toBeFalsy())
    })

    it('is not displayed when the API call throws an error', async () => {
      when(get as jest.Mock)
        .calledWith('/v0/claims-and-appeals-overview', expect.anything())
        .mockRejectedValue('fail')
      initializeTestInstance()
      await waitFor(() => expect(screen.queryByText('Loading mobile app activity...')).toBeFalsy())
      await waitFor(() => expect(screen.queryByRole('link', { name: 'Claims' })).toBeFalsy())
    })

    it('is not displayed when there is a service error', async () => {
      const serviceErrors = [
        {
          service: 'claims',
          errorDetails: [{ title: 'Claims error' }],
        },
      ]

      when(get as jest.Mock)
        .calledWith('/v0/claims-and-appeals-overview', expect.anything())
        .mockResolvedValue(getClaimsAndAppealsPayload(2, serviceErrors))
      initializeTestInstance()
      await waitFor(() => expect(screen.queryByText('Loading mobile app activity...')).toBeFalsy())
      await waitFor(() => expect(screen.queryByRole('link', { name: 'Claims' })).toBeFalsy())
    })

    it('is not displayed when claims is in downtime', async () => {
      const downtimeWindow = {
        startTime: DateTime.now(),
        endTime: DateTime.now().plus({ minutes: 1 }),
      }

      when(get as jest.Mock)
        .calledWith('/v0/claims-and-appeals-overview', expect.anything())
        .mockResolvedValue(getClaimsAndAppealsPayload(2))
      initializeTestInstance({
        preloadedState: {
          errors: {
            downtimeWindowsByFeature: {
              appeals: downtimeWindow,
              claims: downtimeWindow,
            },
          } as ErrorsState,
        },
      })
      await waitFor(() => expect(screen.queryByText('Loading mobile app activity...')).toBeFalsy())
      await waitFor(() => expect(screen.queryByRole('link', { name: 'Claims' })).toBeFalsy())
    })
  })

  describe('Messages module', () => {
    it('displays unread count when there are unread messages', async () => {
      const unreadMessageCount = 3
      when(get as jest.Mock)
        .calledWith('/v0/messaging/health/folders')
        .mockResolvedValue(getFoldersPayload(unreadMessageCount))
      initializeTestInstance()
      await waitFor(() => expect(screen.getByRole('link', { name: 'Messages' })).toBeTruthy())
      await waitFor(() => expect(screen.getByRole('link', { name: `${unreadMessageCount} unread` })).toBeTruthy())
    })

    it('navigates to Messages screen when pressed', async () => {
      when(get as jest.Mock)
        .calledWith('/v0/messaging/health/folders')
        .mockResolvedValue(getFoldersPayload(3))
      initializeTestInstance()
      await waitFor(() => fireEvent.press(screen.getByRole('link', { name: 'Messages' })))
      await waitFor(() => expect(Linking.openURL).toBeCalledWith('vamobile://messages'))
    })

    it('is not displayed when there are no unread messages', async () => {
      when(get as jest.Mock)
        .calledWith('/v0/messaging/health/folders')
        .mockResolvedValue(getFoldersPayload(0))
      initializeTestInstance()
      await waitFor(() => expect(screen.queryByText('Loading mobile app activity...')).toBeFalsy())
      await waitFor(() => expect(screen.queryByRole('link', { name: 'Messages' })).toBeFalsy())
    })

    it('is not displayed when the API call throws an error', async () => {
      when(get as jest.Mock)
        .calledWith('/v0/messaging/health/folders')
        .mockRejectedValue('fail')
      initializeTestInstance()
      await waitFor(() => expect(screen.queryByText('Loading mobile app activity...')).toBeFalsy())
      await waitFor(() => expect(screen.queryByRole('link', { name: 'Messages' })).toBeFalsy())
    })

    it('is not displayed when secure messaging is in downtime', async () => {
      when(get as jest.Mock)
        .calledWith('/v0/messaging/health/folders')
        .mockResolvedValue(getFoldersPayload(3))
      initializeTestInstance({
        preloadedState: {
          errors: {
            downtimeWindowsByFeature: {
              secure_messaging: {
                startTime: DateTime.now(),
                endTime: DateTime.now().plus({ minutes: 1 }),
              },
            },
          } as ErrorsState,
        },
      })
      await waitFor(() => expect(screen.queryByText('Loading mobile app activity...')).toBeFalsy())
      await waitFor(() => expect(screen.queryByRole('link', { name: 'Messages' })).toBeFalsy())
    })
  })

  describe('Prescription module', () => {
    it('displays refill count when there are refillable prescriptions', async () => {
      const refillablePrescriptionsCount = 3
      when(get as jest.Mock)
        .calledWith('/v0/health/rx/prescriptions', expect.anything())
        .mockResolvedValue(getPrescriptionsPayload(refillablePrescriptionsCount))
      initializeTestInstance()
      await waitFor(() => expect(screen.getByRole('link', { name: 'Prescriptions' })).toBeTruthy())
      await waitFor(() =>
        expect(screen.getByRole('link', { name: `${refillablePrescriptionsCount} ready to refill` })).toBeTruthy(),
      )
    })

    it('navigates to Prescriptions screen when pressed', async () => {
      when(get as jest.Mock)
        .calledWith('/v0/health/rx/prescriptions', expect.anything())
        .mockResolvedValue(getPrescriptionsPayload(3))
      initializeTestInstance()
      await waitFor(() => fireEvent.press(screen.getByRole('link', { name: 'Prescriptions' })))
      await waitFor(() => expect(Linking.openURL).toBeCalledWith('vamobile://prescriptions'))
    })

    it('is not displayed when there are no active prescriptions', async () => {
      when(get as jest.Mock)
        .calledWith('/v0/health/rx/prescriptions', expect.anything())
        .mockResolvedValue(getPrescriptionsPayload(0))
      initializeTestInstance()
      await waitFor(() => expect(screen.queryByText('Loading mobile app activity...')).toBeFalsy())
      await waitFor(() => expect(screen.queryByRole('link', { name: 'Prescriptions' })).toBeFalsy())
    })

    it('is not displayed when the API call throws an error', async () => {
      when(get as jest.Mock)
        .calledWith('/v0/health/rx/prescriptions', expect.anything())
        .mockRejectedValue('fail')
      initializeTestInstance()
      await waitFor(() => expect(screen.queryByText('Loading mobile app activity...')).toBeFalsy())
      await waitFor(() => expect(screen.queryByRole('link', { name: 'Prescriptions' })).toBeFalsy())
    })

    it('is not displayed when prescriptions is in downtime', async () => {
      when(get as jest.Mock)
        .calledWith('/v0/health/rx/prescriptions', expect.anything())
        .mockResolvedValue(getPrescriptionsPayload(3))
      initializeTestInstance({
        preloadedState: {
          errors: {
            downtimeWindowsByFeature: {
              rx_refill: {
                startTime: DateTime.now(),
                endTime: DateTime.now().plus({ minutes: 1 }),
              },
            },
          } as ErrorsState,
        },
      })
      await waitFor(() => expect(screen.queryByText('Loading mobile app activity...')).toBeFalsy())
      await waitFor(() => expect(screen.queryByRole('link', { name: 'Prescriptions' })).toBeFalsy())
    })
  })

  describe('About you section', () => {
    it('displays disability rating percentage when veteran has disability rating', async () => {
      when(get as jest.Mock)
        .calledWith('/v0/disability-rating')
        .mockResolvedValue(getDisabilityRatingPayload(100))
      initializeTestInstance()
      await waitFor(() => expect(screen.getByLabelText('Disability rating 100% service connected')).toBeTruthy())
    })

    it('does not display disability rating percentage when veteran does not have disability rating', async () => {
      when(get as jest.Mock)
        .calledWith('/v0/disability-rating')
        .mockResolvedValue(getDisabilityRatingPayload(0))
      initializeTestInstance()
      await waitFor(() => expect(screen.queryByText('Loading your information...')).toBeFalsy())
      await waitFor(() => expect(screen.queryByText('Disability rating')).toBeFalsy())
    })

    it('does not display disability rating percentage and show error message when disability ratings API call fails', async () => {
      when(get as jest.Mock)
        .calledWith('/v0/disability-rating')
        .mockRejectedValue('fail')
      initializeTestInstance()
      await waitFor(() => expect(screen.queryByText('Loading your information...')).toBeFalsy())
      await waitFor(() => expect(screen.queryByText('Disability rating')).toBeFalsy())
      await waitFor(() =>
        expect(screen.queryByText('We can’t show all your information right now. Check back later.')).toBeTruthy(),
      )
    })

    it('displays monthly payment amount when veteran has monthly compensation payment', async () => {
      when(get as jest.Mock)
        .calledWith('/v0/letters/beneficiary')
        .mockResolvedValue(getLetterBeneficiaryPayload(3084.75))
      initializeTestInstance()
      await waitFor(() => expect(screen.getByLabelText('Monthly compensation payment $3,084.75')).toBeTruthy())
    })

    it('does not display monthly payment amount when veteran does not have monthly compensation payment', async () => {
      when(get as jest.Mock)
        .calledWith('/v0/letters/beneficiary')
        .mockResolvedValue(getLetterBeneficiaryPayload(0))
      initializeTestInstance()
      await waitFor(() => expect(screen.queryByText('Loading your information...')).toBeFalsy())
      await waitFor(() => expect(screen.queryByText('Monthly compensation payment')).toBeFalsy())
    })

    it('does not display monthly payment and show error message when the beneficiary API call fails', async () => {
      when(get as jest.Mock)
        .calledWith('/v0/letters/beneficiary')
        .mockRejectedValue('fail')
      initializeTestInstance()
      await waitFor(() => expect(screen.queryByText('Loading your information...')).toBeFalsy())
      await waitFor(() => expect(screen.queryByText('Monthly compensation payment')).toBeFalsy())
      await waitFor(() =>
        expect(screen.queryByText('We can’t show all your information right now. Check back later.')).toBeTruthy(),
      )
    })

    it("displays message when no 'About you' info exists", async () => {
      when(get as jest.Mock)
        .calledWith('/v0/disability-rating')
        .mockResolvedValue(getDisabilityRatingPayload(0))
        .calledWith('/v0/letters/beneficiary')
        .mockResolvedValue(getLetterBeneficiaryPayload(0))

      initializeTestInstance()
      await waitFor(() => expect(screen.queryByText('We can’t show your information right now.')).toBeTruthy())
    })

    it('displays error message when one of the features are in downtime', async () => {
      when(get as jest.Mock)
        .calledWith('/v0/letters/beneficiary')
        .mockResolvedValue(getLetterBeneficiaryPayload(3000))
      initializeTestInstance({
        preloadedState: {
          errors: {
            downtimeWindowsByFeature: {
              letters_and_documents: {
                startTime: DateTime.now(),
                endTime: DateTime.now().plus({ minutes: 1 }),
              },
            },
          } as ErrorsState,
        },
      })
      await waitFor(() => expect(screen.queryByText('Loading your information...')).toBeFalsy())
      await waitFor(() =>
        expect(screen.queryByText('We can’t show all your information right now. Check back later.')).toBeTruthy(),
      )
    })

    it("displays error message when some 'About you' info doesn't exist and rest of info has errors", async () => {
      when(get as jest.Mock)
        .calledWith('/v0/disability-rating')
        .mockResolvedValue(getDisabilityRatingPayload(0))
        .calledWith('/v0/letters/beneficiary')
        .mockRejectedValue('fail')

      initializeTestInstance()
      await waitFor(() => expect(screen.queryByText('We can’t show your information right now.')).toBeFalsy())
      await waitFor(() =>
        expect(screen.queryByText('We can’t show all your information right now. Check back later.')).toBeTruthy(),
      )
    })
  })

  describe('VA resources section', () => {
    it('navigates to the "Contact VA" screen when the "Contact us" link is pressed', () => {
      initializeTestInstance()
      fireEvent.press(screen.getByRole('link', { name: 'Contact us' }))
      expect(mockNavigationSpy).toBeCalledWith('ContactVA')
    })

    it('launches WebView when the "Find a VA location" link is pressed', () => {
      initializeTestInstance()
      fireEvent.press(screen.getByRole('link', { name: 'Find a VA location' }))
      expect(mockNavigationSpy).toBeCalledWith('Webview', {
        displayTitle: 'va.gov',
        url: 'https://www.va.gov/find-locations/',
        loadingMessage: 'Loading VA location finder...',
      })
    })
  })
})
