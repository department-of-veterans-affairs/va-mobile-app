import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { contactInformationKeys } from 'api/contactInformation'
import { AddressData, UserContactInformation } from 'api/types'
import { QueriesData, context, fireEvent, mockNavProps, render } from 'testUtils'

import SubmitMileageTravelPayScreen from './SubmitMileageTravelPayScreen'

const mockNavigationSpy = jest.fn()
const mockBack = jest.fn()

const residentialAddress: AddressData = {
  id: 0,
  addressLine1: '10 Laurel Way',
  addressPou: 'RESIDENCE/CHOICE',
  addressType: 'DOMESTIC',
  city: 'Novato',
  countryCodeIso3: '1',
  internationalPostalCode: '1',
  province: 'province',
  stateCode: 'CA',
  zipCode: '94920',
  zipCodeSuffix: '1234',
}

const params = {
  appointmentDateTime: '2021-01-01T00:00:00Z',
  facilityName: 'Test Facility',
}

const mockActionSheetSpy = jest.fn()

jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')

  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
    useBeforeNavBackListener: jest.fn(),
    useDestructiveActionSheet: () => mockActionSheetSpy,
  }
})

context('SubmitMileageTravelPayScreen', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  const props = mockNavProps(
    undefined,
    { navigate: mockNavigationSpy, goBack: mockBack },
    {
      params,
    },
  )
  const initializeTestInstance = (initialIndex: number = 1, contactInformation?: Partial<UserContactInformation>) => {
    let queriesData: QueriesData | undefined
    if (contactInformation) {
      queriesData = [
        {
          queryKey: contactInformationKeys.contactInformation,
          data: {
            ...contactInformation,
          },
        },
      ]
    }
    render(<SubmitMileageTravelPayScreen {...props} initialRouteIndex={initialIndex} />, { queriesData })
  }

  it('should initialize correctly', () => {
    initializeTestInstance()
    expect(screen.getByTestId('InterstitialScreen')).toBeTruthy()
  })

  describe('Screens', () => {
    describe('Error Screen', () => {
      it('should show Error Screen when index is 0', () => {
        initializeTestInstance(0)
        expect(screen.getByTestId('ErrorScreen')).toBeTruthy()
        expect(screen.getByText(t('close'))).toBeTruthy()
      })
      describe('when the user presses the Close button', () => {
        it('should navigate back', () => {
          initializeTestInstance(0)
          const button = screen.getByTestId('rightCloseTestID')
          fireEvent.press(button)
          expect(mockBack).toHaveBeenCalled()
        })
      })
    })
    describe('Milage Screen', () => {
      it('should show Mileage Screen when index is 2', () => {
        initializeTestInstance(2)
        expect(screen.getByTestId('MileageScreen')).toBeTruthy()
        expect(screen.getByText(t('back'))).toBeTruthy()
        expect(screen.getByText(t('help'))).toBeTruthy()
        expect(screen.getByText(t('yes'))).toBeTruthy()
        expect(screen.getByText(t('no'))).toBeTruthy()
      })

      describe('when the user presses the Yes button', () => {
        it('should navigate to the next screen', () => {
          initializeTestInstance(2)
          const button = screen.getByTestId('yesTestID')
          fireEvent.press(button)
          expect(mockNavigationSpy).toHaveBeenCalledWith('VehicleScreen', undefined)
        })
      })

      describe('when the user presses the No button', () => {
        it('should navigate to Error Screen with unsupportedType error', () => {
          initializeTestInstance(2)
          const button = screen.getByTestId(t('No'))
          fireEvent.press(button)
          expect(mockNavigationSpy).toHaveBeenCalledWith('ErrorScreen', { error: 'unsupportedType' })
        })
      })

      describe('when the user presses on the Back button', () => {
        it('should navigate back to the Interstitial Screen', () => {
          initializeTestInstance(2)
          const button = screen.getByTestId('leftBackTestID')
          fireEvent.press(button)
          expect(mockNavigationSpy).toHaveBeenCalledWith('InterstitialScreen', undefined)
        })
      })

      describe('when the user presses on the Help button', () => {
        it('should navigate to the Travel Claim Help Screen', () => {
          initializeTestInstance(2)
          const button = screen.getByTestId('rightHelpTestID')
          fireEvent.press(button)
          expect(mockNavigationSpy).toHaveBeenCalledWith('TravelClaimHelpScreen')
        })
      })
    })

    describe('VehicleScreen', () => {
      it('should show VehicleScreen when index is 3', () => {
        initializeTestInstance(3)
        expect(screen.getByTestId('VehicleScreen')).toBeTruthy()
        expect(screen.getByText(t('back'))).toBeTruthy()
        expect(screen.getByText(t('help'))).toBeTruthy()
        expect(screen.getByText(t('yes'))).toBeTruthy()
        expect(screen.getByText(t('no'))).toBeTruthy()
      })
      describe('when the user presses the Back button', () => {
        it('should navigate back', () => {
          initializeTestInstance(3)
          const button = screen.getByTestId('leftBackTestID')
          fireEvent.press(button)
          expect(mockNavigationSpy).toHaveBeenCalledWith('MileageScreen', undefined)
        })
      })

      describe('when the user presses the Yes button', () => {
        describe('when the user has an address', () => {
          it('should navigate to the next screen', () => {
            initializeTestInstance(3, { residentialAddress })
            const button = screen.getByTestId('yesTestID')
            fireEvent.press(button)
            expect(mockNavigationSpy).toHaveBeenCalledWith('AddressScreen', undefined)
          })
        })
        describe('when the user does not have an address', () => {
          it('should navigate to the Error Screen with noAddress error', () => {
            initializeTestInstance(3)
            const button = screen.getByTestId('yesTestID')
            fireEvent.press(button)
            expect(mockNavigationSpy).toHaveBeenCalledWith('ErrorScreen', { error: 'noAddress' })
          })
        })
      })

      describe('when user presses the No button', () => {
        it('should navigate to the Error Screen with unsupportedType error', () => {
          initializeTestInstance(3)
          const button = screen.getByTestId(t('No'))
          fireEvent.press(button)
          expect(mockNavigationSpy).toHaveBeenCalledWith('ErrorScreen', { error: 'unsupportedType' })
        })
      })

      describe('when the user presses on the Help button', () => {
        it('should navigate to the Travel Claim Help Screen', () => {
          initializeTestInstance(3)
          const button = screen.getByTestId('rightHelpTestID')
          fireEvent.press(button)
          expect(mockNavigationSpy).toHaveBeenCalledWith('TravelClaimHelpScreen')
        })
      })
    })

    describe('AddressScreen', () => {
      it('should show AddressScreen when index is 4', () => {
        initializeTestInstance(4, {
          residentialAddress,
        })
        expect(screen.getByTestId('AddressScreen')).toBeTruthy()
        expect(screen.getByText(t('back'))).toBeTruthy()
        expect(screen.getByText(t('help'))).toBeTruthy()
        expect(screen.getByText(t('yes'))).toBeTruthy()
        expect(screen.getByText(t('no'))).toBeTruthy()
      })
      describe('when the user presses the Back button', () => {
        it('should navigate back', () => {
          initializeTestInstance(4)
          const button = screen.getByTestId('leftBackTestID')
          fireEvent.press(button)
          expect(mockNavigationSpy).toHaveBeenCalledWith('VehicleScreen', undefined)
        })
      })

      describe('when the user presses the Yes button', () => {
        it('should navigate to the next screen with the appointment date time', () => {
          initializeTestInstance(4, { residentialAddress })
          const button = screen.getByTestId('yesTestID')
          fireEvent.press(button)
          expect(mockNavigationSpy).toHaveBeenCalledWith('ReviewClaimScreen', {
            appointmentDateTime: params.appointmentDateTime,
            facilityName: params.facilityName,
          })
        })
      })
      describe('when user presses the No button', () => {
        it('should navigate to the Error Screen with unsupportedType error', () => {
          initializeTestInstance(4, { residentialAddress })
          const button = screen.getByTestId(t('No'))
          fireEvent.press(button)
          expect(mockNavigationSpy).toHaveBeenCalledWith('ErrorScreen', { error: 'unsupportedType' })
        })
      })

      describe('when the user presses on the Help button', () => {
        it('should navigate to the Travel Claim Help Screen', () => {
          initializeTestInstance(4, { residentialAddress })
          const button = screen.getByTestId('rightHelpTestID')
          fireEvent.press(button)
          expect(mockNavigationSpy).toHaveBeenCalledWith('TravelClaimHelpScreen')
        })
      })
    })
    describe('ReviewClaimScreen', () => {
      it('should show ReviewClaimScreen when index is 5', () => {
        initializeTestInstance(5)
        expect(screen.getByTestId('ReviewClaimScreen')).toBeTruthy()
        expect(screen.getByText(t('back'))).toBeTruthy()
        expect(screen.getByText(t('help'))).toBeTruthy()
      })

      describe('when the user presses the Back button', () => {
        it('should navigate back', () => {
          initializeTestInstance(5)
          const button = screen.getByTestId('leftBackTestID')
          fireEvent.press(button)
          expect(mockNavigationSpy).toHaveBeenCalledWith('AddressScreen', undefined)
        })
      })

      describe('when the user presses the Help button', () => {
        it('should navigate to the Travel Claim Help Screen', () => {
          initializeTestInstance(5)
          const button = screen.getByTestId('rightHelpTestID')
          fireEvent.press(button)
          expect(mockNavigationSpy).toHaveBeenCalledWith('TravelClaimHelpScreen')
        })
      })
    })
    describe('SubmitSuccessScreen', () => {
      it('should show SubmitSuccessScreen when index is 6', () => {
        initializeTestInstance(6)
        expect(screen.getByTestId('SubmitSuccessScreen')).toBeTruthy()
        expect(screen.getByText(t('close'))).toBeTruthy()
        expect(screen.getByText(t('travelPay.continueToClaim'))).toBeTruthy()
      })
      describe('when the user presses the Close button', () => {
        it('should exit the flow', () => {
          initializeTestInstance(6)
          const button = screen.getByTestId('rightCloseTestID')
          fireEvent.press(button)
          expect(mockBack).toHaveBeenCalled()
        })
      })
      describe('when the user presses the Continue to Claim button', () => {
        it('should navigate back', () => {
          initializeTestInstance(6)
          const button = screen.getByTestId('continueToClaimTestID')
          fireEvent.press(button)
          expect(mockBack).toHaveBeenCalled()
        })
      })
    })
  })
})
