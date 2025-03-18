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
  const props = mockNavProps(undefined, { navigate: mockNavigationSpy, goBack: mockBack })
  const initializeTestInstance = (initialIndex: number = 2, contactInformation?: Partial<UserContactInformation>) => {
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
    expect(screen.getByTestId('MileageScreen')).toBeTruthy()
  })

  describe('Screens', () => {
    describe('Not Eligible Screen', () => {
      it('should show Not Eligible Screen when index is 0', () => {
        initializeTestInstance(0)
        expect(screen.getByTestId('NotEligibleTypeScreen')).toBeTruthy()
        expect(screen.getByTestId(t('cancel'))).toBeTruthy()
        expect(screen.getByTestId(t('close'))).toBeTruthy()
      })
      describe('when the user presses the Cancel button', () => {
        it('should navigate back', () => {
          initializeTestInstance(0)
          const button = screen.getByTestId(t('cancel'))
          fireEvent.press(button)
          expect(mockBack).toHaveBeenCalled()
        })
      })
      describe('when the user presses the Close button', () => {
        it('should navigate back to previous screen', () => {
          initializeTestInstance(0)
          const closeButton = screen.getByTestId(t('close'))

          fireEvent.press(closeButton)
          expect(mockNavigationSpy).toBeCalledWith('MileageScreen')
        })
      })
    })
    describe('ErrorScreen', () => {
      it('should show Error Screen when index is 1', () => {
        initializeTestInstance(1)
        expect(screen.getByTestId('ErrorScreen')).toBeTruthy()
        expect(screen.queryAllByTestId(t('close'))).toHaveLength(2)
      })
      describe('when the user presses the Close buttons', () => {
        it('should navigate back', () => {
          initializeTestInstance(1)
          const buttons = screen.getAllByTestId(t('close'))
          buttons.forEach((button) => {
            fireEvent.press(button)
          })
          expect(mockBack).toHaveBeenCalledTimes(2)
        })
      })
    })
    describe('Milage Screen', () => {
      it('should show Mileage Screen when index is 2', () => {
        initializeTestInstance(2)
        expect(screen.getByTestId('MileageScreen')).toBeTruthy()
        expect(screen.getByTestId(t('cancel'))).toBeTruthy()
        expect(screen.getByTestId(t('yes'))).toBeTruthy()
        expect(screen.getByTestId(t('no'))).toBeTruthy()
      })
      describe('when the user presses the Yes button', () => {
        it('should navigate to the next screen', () => {
          initializeTestInstance(2)
          const button = screen.getByTestId(t('yes'))
          fireEvent.press(button)
          expect(mockNavigationSpy).toHaveBeenCalledWith('VehicleScreen', {})
        })
      })

      describe('when the user presses the No button', () => {
        it('should navigate to Not Eligible Screen', () => {
          initializeTestInstance(2)
          const button = screen.getByTestId(t('No'))
          fireEvent.press(button)
          expect(mockNavigationSpy).toHaveBeenCalledWith('NotEligibleTypeScreen')
        })
      })

      describe('when the user presses on the Cancel button', () => {
        it('should navigate back', () => {
          initializeTestInstance(2)
          const button = screen.getByTestId(t('cancel'))
          fireEvent.press(button)
          expect(mockBack).toHaveBeenCalled()
        })
      })
    })
    describe('VehicleScreen', () => {
      it('should show VehicleScreen when index is 3', () => {
        initializeTestInstance(3)
        expect(screen.getByTestId('VehicleScreen')).toBeTruthy()
        expect(screen.getByTestId(t('cancel'))).toBeTruthy()
        expect(screen.getByTestId(t('yes'))).toBeTruthy()
        expect(screen.getByTestId(t('no'))).toBeTruthy()
      })
      describe('when the user presses the Yes button', () => {
        it('should navigate to the next screen', () => {
          initializeTestInstance(3)
          const button = screen.getByTestId(t('yes'))
          fireEvent.press(button)
          expect(mockNavigationSpy).toHaveBeenCalledWith('AddressScreen', {})
        })
      })
      describe('when user presses the No button', () => {
        it('should navigate to Not Eligible Screen', () => {
          initializeTestInstance(3)
          const button = screen.getByTestId(t('No'))
          fireEvent.press(button)
          expect(mockNavigationSpy).toHaveBeenCalledWith('NotEligibleTypeScreen')
        })
      })
    })
    describe('AddressScreen', () => {
      describe('when the user has an address', () => {
        it('should show AddressScreen when index is 4', () => {
          initializeTestInstance(4, {
            residentialAddress,
          })
          expect(screen.getByTestId('AddressScreen')).toBeTruthy()
          expect(screen.getByTestId(t('cancel'))).toBeTruthy()
          expect(screen.getByTestId(t('yes'))).toBeTruthy()
          expect(screen.getByTestId(t('no'))).toBeTruthy()
        })

        describe('when the user presses the Yes button', () => {
          it('should navigate to the next screen', () => {
            initializeTestInstance(4, { residentialAddress })
            const button = screen.getByTestId(t('yes'))
            fireEvent.press(button)
            expect(mockNavigationSpy).toHaveBeenCalledWith('ReviewClaimScreen', {})
          })
        })

        describe('when user presses the No button', () => {
          it('should navigate to Not Eligible Screen', () => {
            initializeTestInstance(4, { residentialAddress })
            const button = screen.getByTestId(t('No'))
            fireEvent.press(button)
            expect(mockNavigationSpy).toHaveBeenCalledWith('NotEligibleTypeScreen')
          })
        })
      })
      describe('when the user does NOT have an address', () => {
        it('should show AddressScreen when index is 4', () => {
          initializeTestInstance(4)
          expect(screen.getByTestId('AddressScreen')).toBeTruthy()
          const cancelButtons = screen.getAllByTestId(t('cancel'))
          expect(cancelButtons).toHaveLength(2)
          expect(screen.queryByTestId(t('no'))).toBeFalsy()
        })

        describe('when the user presses the Cancel button', () => {
          it('should navigate back', () => {
            initializeTestInstance(4)
            const cancelButtons = screen.getAllByTestId(t('cancel'))
            cancelButtons.forEach((button) => {
              fireEvent.press(button)
            })
            expect(mockBack).toHaveBeenCalledTimes(2)
          })
        })
      })
    })
    describe('ReviewClaimScreen', () => {
      it('should show ReviewClaimScreen when index is 5', () => {
        initializeTestInstance(5)
        expect(screen.getByTestId('ReviewClaimScreen')).toBeTruthy()
        expect(screen.getByTestId(t('cancel'))).toBeTruthy()
        expect(screen.getByTestId(t('submit'))).toBeTruthy()
      })
      describe('when the user presses the Submit button', () => {
        it('should navigate to success screen', () => {
          initializeTestInstance(5)
          const button = screen.getByTestId(t('submit'))
          fireEvent.press(button)
          expect(mockNavigationSpy).toHaveBeenCalledWith('SubmitSuccessScreen', {})
        })
      })
      describe('when the user presses the Cancel button', () => {
        it('should navigate back', () => {
          initializeTestInstance(5)
          const button = screen.getByTestId(t('cancel'))
          fireEvent.press(button)
          expect(mockBack).toHaveBeenCalled()
        })
      })
    })
    describe('SubmitSuccessScreen', () => {
      it('should show SubmitSuccessScreen when index is 6', () => {
        initializeTestInstance(6)
        expect(screen.getByTestId('SubmitSuccessScreen')).toBeTruthy()
      })
      describe('when the user presses the Close button', () => {
        it('should exit the flow', () => {
          initializeTestInstance(6)
          const buttons = screen.getAllByTestId(t('close'))
          buttons.forEach((button) => {
            fireEvent.press(button)
          })
          expect(mockBack).toHaveBeenCalledTimes(2)
        })
      })
    })
  })
})
