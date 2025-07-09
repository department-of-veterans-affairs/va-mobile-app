import React from 'react'
import { Alert } from 'react-native'

import { t } from 'i18next'
import { DateTime } from 'luxon'

import { TravelPayPartialSuccessStatusConstants } from 'constants/travelPay'

import { SubmitSuccessScreen } from 'screens/HealthScreen/TravelPay/SubmitTravelPayFlowSteps'
import { context, fireEvent, mockNavProps, render, screen } from 'testUtils'
import getEnv from 'utils/env'

jest.spyOn(Alert, 'alert')
const { LINK_URL_TRAVEL_PAY_FILE_CLAIM_BTSSS } = getEnv()

const params = {
  facilityName: 'Test Facility',
  appointmentDateTime: '2021-01-01T00:00:00Z',
  status: 'In Progress',
}

const mockNavigationSpy = jest.fn()
const mockGoBackSpy = jest.fn()
const mockParentSpy = jest.fn().mockReturnValue({ goBack: mockGoBackSpy })
jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

context('SubmitSuccessScreen', () => {
  const initializeTestInstance = (status: string = 'In Progress') => {
    const props = mockNavProps(undefined, { getParent: mockParentSpy }, { params: { ...params, status } })
    render(<SubmitSuccessScreen {...props} />)
  }

  describe('when status is In Progress', () => {
    it('initializes correctly', () => {
      initializeTestInstance('In Progress')
      expect(screen.getByText(t('travelPay.success.title'))).toBeTruthy()
      expect(
        screen.getByText(
          t('travelPay.success.text', {
            facilityName: params.facilityName,
            date: DateTime.fromISO(params.appointmentDateTime).toFormat('LLLL dd, yyyy'),
            time: DateTime.fromISO(params.appointmentDateTime).toFormat('h:mm a'),
          }),
        ),
      ).toBeTruthy()
      expect(screen.getByText(t('travelPay.success.nextTitle'))).toBeTruthy()
      expect(screen.getByText(t('travelPay.success.nextText'))).toBeTruthy()
      expect(screen.getByText(t('travelPay.setUpDirectDeposit.eligible'))).toBeTruthy()
      expect(screen.getByTestId('goToAppointmentLinkID')).toBeTruthy()
      expect(screen.getByTestId('setUpDirectDepositLinkID')).toBeTruthy()
    })

    describe('when the user clicks the go to appointment link', () => {
      it('navigates back and closes the subtask', () => {
        initializeTestInstance('In Progress')
        fireEvent.press(screen.getByTestId('goToAppointmentLinkID'))
        expect(mockGoBackSpy).toHaveBeenCalled()
      })
    })
  })

  describe('when status is Incomplete', () => {
    it('initializes correctly', () => {
      initializeTestInstance(TravelPayPartialSuccessStatusConstants.INCOMPLETE)
      expect(screen.getByText(t('travelPay.partialSuccess.title'))).toBeTruthy()
      expect(screen.getByText(t('travelPay.partialSuccess.text'))).toBeTruthy()
      expect(screen.getByText(t('travelPay.partialSuccess.nextText'))).toBeTruthy()
      expect(screen.getByText(t('travelPay.success.nextTitle'))).toBeTruthy()
      expect(screen.getByText(t('travelPay.partialSuccess.nextText'))).toBeTruthy()
      expect(screen.getByText(t('travelPay.setUpDirectDeposit.eligible'))).toBeTruthy()
      expect(screen.getByTestId('finishTravelClaimLinkID')).toBeTruthy()
      expect(screen.getByTestId('setUpDirectDepositLinkID')).toBeTruthy()
    })

    describe('when the user clicks the BTSSS link', () => {
      it('navigates to the BTSSS website on an authenticated webview', () => {
        initializeTestInstance(TravelPayPartialSuccessStatusConstants.INCOMPLETE)
        fireEvent.press(screen.getByTestId('finishTravelClaimLinkID'))
        expect(mockNavigationSpy).toHaveBeenCalledWith('Webview', {
          url: LINK_URL_TRAVEL_PAY_FILE_CLAIM_BTSSS,
          displayTitle: t('travelPay.webview.fileForTravelPay.title'),
          loadingMessage: t('loading.vaWebsite'),
          useSSO: true,
        })
      })
    })
  })

  describe('when status is Saved', () => {
    it('initializes correctly', () => {
      initializeTestInstance(TravelPayPartialSuccessStatusConstants.SAVED)
      expect(screen.getByText(t('travelPay.partialSuccess.title'))).toBeTruthy()
      expect(screen.getByText(t('travelPay.partialSuccess.text'))).toBeTruthy()
      expect(screen.getByText(t('travelPay.partialSuccess.nextText'))).toBeTruthy()
      expect(screen.getByText(t('travelPay.success.nextTitle'))).toBeTruthy()
      expect(screen.getByText(t('travelPay.partialSuccess.nextText'))).toBeTruthy()
      expect(screen.getByText(t('travelPay.setUpDirectDeposit.eligible'))).toBeTruthy()
      expect(screen.getByTestId('finishTravelClaimLinkID')).toBeTruthy()
      expect(screen.getByTestId('setUpDirectDepositLinkID')).toBeTruthy()
    })

    describe('when the user clicks the BTSSS link', () => {
      it('navigates to the BTSSS website on an authenticated webview', () => {
        initializeTestInstance(TravelPayPartialSuccessStatusConstants.SAVED)
        fireEvent.press(screen.getByTestId('finishTravelClaimLinkID'))
        expect(mockNavigationSpy).toHaveBeenCalledWith('Webview', {
          url: LINK_URL_TRAVEL_PAY_FILE_CLAIM_BTSSS,
          displayTitle: t('travelPay.webview.fileForTravelPay.title'),
          loadingMessage: t('loading.vaWebsite'),
          useSSO: true,
        })
      })
    })
  })

  describe('when status is unknown', () => {
    it('defaults to success content', () => {
      initializeTestInstance('Unknown Status')
      expect(screen.getByText(t('travelPay.success.title'))).toBeTruthy()
      expect(screen.getByTestId('goToAppointmentLinkID')).toBeTruthy()
    })
  })

  it('should show alert when direct deposit link is clicked', () => {
    initializeTestInstance()
    const link = screen.getByTestId('setUpDirectDepositLinkID')
    fireEvent.press(link)
    expect(Alert.alert).toHaveBeenCalled()
  })
})
