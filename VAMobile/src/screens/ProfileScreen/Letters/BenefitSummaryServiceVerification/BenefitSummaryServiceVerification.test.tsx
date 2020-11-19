import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import {act, ReactTestInstance} from 'react-test-renderer'
import { Linking, Switch as RNSwitch, TouchableOpacity } from 'react-native'

import {Switch, TextView} from 'components'
import {context, findByTestID, mockNavProps, mockStore, renderWithProviders} from 'testUtils'
import BenefitSummaryServiceVerification from './BenefitSummaryServiceVerification'
import { InitialState } from 'store/reducers'
import { CharacterOfServiceConstants, LetterTypeConstants } from 'store/api/types'
import LettersLoadingScreen from '../LettersLoadingScreen'
import { downloadLetter } from 'store/actions'

jest.mock('../../../../utils/hooks', () => {
  let original = jest.requireActual("../../../../utils/hooks")
  let theme = jest.requireActual("../../../../styles/themes/standardTheme").default
  return {
    ...original,
    useTheme: jest.fn(()=> {
      return {...theme}
    }),
    useRouteNavigation: () => jest.fn(),
  }
})

jest.mock('../../../../store/actions', () => {
  let actual = jest.requireActual('../../../../store/actions')
  return {
    ...actual,
    downloadLetter: jest.fn(() => {
      return {
        type: '',
        payload: ''
      }
    })
  }
})


context('BenefitSummaryServiceVerification', () => {
  let store: any
  let component: any
  let testInstance: ReactTestInstance

  const initializeTestInstance = (downloading = false) => {
    const props = mockNavProps()

    store = mockStore({
      ...InitialState,
      letters: {
        loading: false,
        downloading: downloading,
        letterBeneficiaryData: {
          militaryService: {
            branch: 'Army',
            characterOfService: CharacterOfServiceConstants.HONORABLE,
            enteredDate: '1990-01-01T05:00:00.000+00:00',
            releasedDate: '1993-10-01T04:00:00.000+00:00',
          },
          benefitInformation: {
            awardEffectiveDate: '2013-06-06T04:00:00.000+00:00',
            hasChapter35Eligibility: true,
            monthlyAwardAmount: 123,
            serviceConnectedPercentage: 88,
            hasDeathResultOfDisability: false,
            hasSurvivorsIndemnityCompensationAward: true,
            hasSurvivorsPensionAward: false,
            hasAdaptedHousing: true,
            hasIndividualUnemployabilityGranted: false,
            hasNonServiceConnectedPension: true,
            hasServiceConnectedDisabilities: false,
            hasSpecialMonthlyCompensation: true,
          }
        }
      }
    })

    act(() => {
      component = renderWithProviders(<BenefitSummaryServiceVerification {...props} />, store)
    })

    testInstance = component.root
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  it('should display the dynamic data', async () => {
    const dischargeType = testInstance.findAllByType(TextView)[5]
    expect(dischargeType.props.children).toEqual('Honorable')

    const activeDutyStart = testInstance.findAllByType(TextView)[7]
    expect(activeDutyStart.props.children).toEqual('January 01, 1990')

    const activeDutyEnd = testInstance.findAllByType(TextView)[9]
    expect(activeDutyEnd.props.children).toEqual('October 01, 1993')

    const monthlyAward = testInstance.findAllByType(TextView)[13]
    expect(monthlyAward.props.children).toEqual('Your current monthly award is $123. The effective date of the last change to your current award was June 06, 2013.')

    const combinedRating = testInstance.findAllByType(TextView)[14]
    expect(combinedRating.props.children).toEqual('Your combined service-connected rating is 88%.')

  })

  describe('on include military service info switch click', () => {
    it('should update that switches on value', async () => {
      const switchIcon = testInstance.findAllByType(Switch)[0]
      const rnSwitch = testInstance.findAllByType(RNSwitch)[0]

      switchIcon.props.onPress()
      expect(rnSwitch.props.value).toEqual(true)

      switchIcon.props.onPress()
      expect(rnSwitch.props.value).toEqual(false)
    })
  })

  describe('on monthly award switch click', () => {
    it('should update that switches on value', async () => {
      const switchIcon = testInstance.findAllByType(Switch)[1]
      const rnSwitch = testInstance.findAllByType(RNSwitch)[1]

      switchIcon.props.onPress()
      expect(rnSwitch.props.value).toEqual(true)

      switchIcon.props.onPress()
      expect(rnSwitch.props.value).toEqual(false)
    })
  })

  describe('on combined service connected rating switch click', () => {
    it('should update that switches on value', async () => {
      const switchIcon = testInstance.findAllByType(Switch)[2]
      const rnSwitch = testInstance.findAllByType(RNSwitch)[2]

      switchIcon.props.onPress()
      expect(rnSwitch.props.value).toEqual(true)

      switchIcon.props.onPress()
      expect(rnSwitch.props.value).toEqual(false)
    })
  })

  describe('on permanently disabled switch click', () => {
    it('should update that switches on value', async () => {
      const switchIcon = testInstance.findAllByType(Switch)[3]
      const rnSwitch = testInstance.findAllByType(RNSwitch)[3]

      switchIcon.props.onPress()
      expect(rnSwitch.props.value).toEqual(true)

      switchIcon.props.onPress()
      expect(rnSwitch.props.value).toEqual(false)
    })
  })

  describe('on one or more disability switch click', () => {
    it('should update that switches on value', async () => {
      const switchIcon = testInstance.findAllByType(Switch)[4]
      const rnSwitch = testInstance.findAllByType(RNSwitch)[4]

      switchIcon.props.onPress()
      expect(rnSwitch.props.value).toEqual(true)

      switchIcon.props.onPress()
      expect(rnSwitch.props.value).toEqual(false)
    })
  })

  describe('on click of send a message', () => {
    it('should call linking openUrl', async () => {
      findByTestID(testInstance, 'send-a-message').props.onPress()
      expect(Linking.openURL).toHaveBeenCalledWith('https://iris.custhelp.va.gov/app/ask')
    })
  })

  describe('when downloading is set to true', () => {
    it('should show loading screen', async () => {
      initializeTestInstance(true)
      expect(testInstance.findByType(LettersLoadingScreen)).toBeTruthy()
    })
  })

  describe('when view letter is pressed', () => {
    it('should call downloadLetter', async () => {
      testInstance.findByType(TouchableOpacity).props.onPress()
      expect(downloadLetter).toBeCalledWith(LetterTypeConstants.benefitSummary)
    })
  })
})
