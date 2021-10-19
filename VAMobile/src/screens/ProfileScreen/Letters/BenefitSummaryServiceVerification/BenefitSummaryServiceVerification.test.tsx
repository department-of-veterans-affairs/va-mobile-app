import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { act, ReactTestInstance } from 'react-test-renderer'
import { Linking, Pressable, Switch as RNSwitch } from 'react-native'

import { BasicError, ErrorComponent, LoadingComponent, Switch, TextView } from 'components'
import { context, findByTestID, mockNavProps, mockStore, renderWithProviders } from 'testUtils'
import BenefitSummaryServiceVerification from './BenefitSummaryServiceVerification'
import { ErrorsState, initialErrorsState, InitialState } from 'store/reducers'
import { CharacterOfServiceConstants, LetterTypeConstants } from 'store/api/types'
import { downloadLetter } from 'store/actions'

const mockExternalLinkSpy = jest.fn()

jest.mock('../../../../utils/hooks', () => {
  let original = jest.requireActual('../../../../utils/hooks')
  let theme = jest.requireActual('../../../../styles/themes/standardTheme').default
  return {
    ...original,
    useTheme: jest.fn(() => {
      return { ...theme }
    }),
    useRouteNavigation: () => jest.fn(),
    useExternalLink: () => mockExternalLinkSpy,
  }
})

jest.mock('../../../../store/actions', () => {
  let actual = jest.requireActual('../../../../store/actions')
  return {
    ...actual,
    downloadLetter: jest.fn(() => {
      return {
        type: '',
        payload: '',
      }
    }),
  }
})

context('BenefitSummaryServiceVerification', () => {
  let store: any
  let component: any
  let testInstance: ReactTestInstance

  let date = '2013-06-06T15:00:00.000+00:00'

  const initializeTestInstance = (monthlyAwardAmount?: number, awardEffectiveDate?: string, serviceConnectedPercentage?: number, downloading = false, hasDownloadError = false) => {
    const props = mockNavProps()

    store = mockStore({
      ...InitialState,
      letters: {
        loading: false,
        letters: [],
        downloading: downloading,
        letterDownloadError: hasDownloadError ? new Error('error') : undefined,
        mostRecentServices: [
          {
            branch: 'Army',
            characterOfService: CharacterOfServiceConstants.HONORABLE,
            enteredDate: '1990-01-01T15:00:00.000+00:00',
            releasedDate: '1993-10-01T15:00:00.000+00:00',
          },
        ],
        letterBeneficiaryData: {
          militaryService: [
            {
              branch: 'Army',
              characterOfService: CharacterOfServiceConstants.HONORABLE,
              enteredDate: '1990-01-01T15:00:00.000+00:00',
              releasedDate: '1993-10-01T15:00:00.000+00:00',
            },
          ],
          benefitInformation: {
            awardEffectiveDate: awardEffectiveDate || null,
            hasChapter35Eligibility: false,
            monthlyAwardAmount: monthlyAwardAmount || null,
            serviceConnectedPercentage: serviceConnectedPercentage || null,
            hasDeathResultOfDisability: false,
            hasSurvivorsIndemnityCompensationAward: true,
            hasSurvivorsPensionAward: false,
            hasAdaptedHousing: true,
            hasIndividualUnemployabilityGranted: false,
            hasNonServiceConnectedPension: true,
            hasServiceConnectedDisabilities: false,
            hasSpecialMonthlyCompensation: true,
          },
        },
      },
    })

    act(() => {
      component = renderWithProviders(<BenefitSummaryServiceVerification {...props} />, store)
    })

    testInstance = component.root
  }

  beforeEach(() => {
    initializeTestInstance(123, date, 88)
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  it('should display the dynamic data', async () => {
    const branchOfService = testInstance.findAllByType(TextView)[5]
    expect(branchOfService.props.children).toEqual('Army')

    const dischargeType = testInstance.findAllByType(TextView)[7]
    expect(dischargeType.props.children).toEqual('Honorable')

    const activeDutyStart = testInstance.findAllByType(TextView)[9]
    expect(activeDutyStart.props.children).toEqual('January 01, 1990')

    const activeDutyEnd = testInstance.findAllByType(TextView)[11]
    expect(activeDutyEnd.props.children).toEqual('October 01, 1993')

    const monthlyAward = testInstance.findAllByType(TextView)[15]
    expect(monthlyAward.props.children).toEqual('Your current monthly payment is $123.00. The effective date of the last change to your current payment was June 06, 2013.')

    const combinedRating = testInstance.findAllByType(TextView)[16]
    expect(combinedRating.props.children).toEqual('Your combined service-connected rating is 88%.')

    const totallyAndPermanent = testInstance.findAllByType(TextView)[17]
    expect(totallyAndPermanent.props.children).toEqual("You aren't considered to be totally and permanently disabled solely due to your service-connected disabilities.")

    const haveOneOrMoreDisabilities = testInstance.findAllByType(TextView)[18]
    expect(haveOneOrMoreDisabilities.props.children).toEqual("You don't have one or more service-connected disabilities.")
  })

  describe('on include military service info switch click', () => {
    it('should update that switches on value', async () => {
      const switchIcon = testInstance.findAllByType(Switch)[0]
      const rnSwitch = testInstance.findAllByType(RNSwitch)[0]

      switchIcon.props.onPress()
      expect(rnSwitch.props.value).toEqual(false)

      switchIcon.props.onPress()
      expect(rnSwitch.props.value).toEqual(true)
    })
  })

  describe('on monthly award switch click', () => {
    it('should update that switches on value', async () => {
      const switchIcon = testInstance.findAllByType(Switch)[1]
      const rnSwitch = testInstance.findAllByType(RNSwitch)[1]

      switchIcon.props.onPress()
      expect(rnSwitch.props.value).toEqual(false)

      switchIcon.props.onPress()
      expect(rnSwitch.props.value).toEqual(true)
    })
  })

  describe('on combined service connected rating switch click', () => {
    it('should update that switches on value', async () => {
      const switchIcon = testInstance.findAllByType(Switch)[2]
      const rnSwitch = testInstance.findAllByType(RNSwitch)[2]

      switchIcon.props.onPress()
      expect(rnSwitch.props.value).toEqual(false)

      switchIcon.props.onPress()
      expect(rnSwitch.props.value).toEqual(true)
    })
  })

  describe('on permanently disabled switch click', () => {
    it('should update that switches on value', async () => {
      const switchIcon = testInstance.findAllByType(Switch)[3]
      const rnSwitch = testInstance.findAllByType(RNSwitch)[3]

      switchIcon.props.onPress()
      expect(rnSwitch.props.value).toEqual(false)

      switchIcon.props.onPress()
      expect(rnSwitch.props.value).toEqual(true)
    })
  })

  describe('on one or more disability switch click', () => {
    it('should update that switches on value', async () => {
      const switchIcon = testInstance.findAllByType(Switch)[4]
      const rnSwitch = testInstance.findAllByType(RNSwitch)[4]

      switchIcon.props.onPress()
      expect(rnSwitch.props.value).toEqual(false)

      switchIcon.props.onPress()
      expect(rnSwitch.props.value).toEqual(true)
    })
  })

  describe('on click of send a message', () => {
    it('should launch external link', async () => {
      findByTestID(testInstance, 'send-us-a-message').props.onPress()
      expect(mockExternalLinkSpy).toHaveBeenCalledWith('https://iris.custhelp.va.gov/app/ask')
    })
  })

  describe('when downloading is set to true', () => {
    it('should show loading screen', async () => {
      initializeTestInstance(123, date, 88, true)
      expect(testInstance.findByType(LoadingComponent)).toBeTruthy()
    })
  })

  describe('when view letter is pressed', () => {
    it('should call downloadLetter', async () => {
      testInstance.findAllByType(Pressable)[5].props.onPress()
      const letterOptions = {
        chapter35Eligibility: true,
        militaryService: true,
        monthlyAward: true,
        serviceConnectedDisabilities: true,
        serviceConnectedEvaluation: true,
      }
      expect(downloadLetter).toBeCalledWith(LetterTypeConstants.benefitSummary, letterOptions)
    })
  })

  describe('when both the awardEffectiveDate and the monthly payment amount exist', () => {
    it('should display "Your current monthly award is ${{monthlyAwardAmount}}. The effective date of the last change to your current payment was {{date}}." for that switch', async () => {
      initializeTestInstance(123, date, 88)
      expect(testInstance.findAllByType(TextView)[15].props.children).toEqual(
        'Your current monthly payment is $123.00. The effective date of the last change to your current payment was June 06, 2013.',
      )
    })
  })

  describe('when the monthly award amount does not exist but the awardEffectiveDate does', () => {
    it('should display "The effective date of the last change to your current award was {{date}}." for that switch', async () => {
      initializeTestInstance(undefined, date, 88)
      expect(testInstance.findAllByType(TextView)[15].props.children).toEqual('The effective date of the last change to your current award was June 06, 2013.')
    })
  })

  describe('when the awardEffectiveDate does not exist but the monthly payment amount does', () => {
    it('should display "Your current monthly award is ${{monthlyAwardAmount}}." for that switch', async () => {
      initializeTestInstance(123, undefined, 88)
      expect(testInstance.findAllByType(TextView)[15].props.children).toEqual('Your current monthly payment is $123.00.')
    })
  })

  describe('when the awardEffectiveDate does not exist and the monthly award amount does not exist', () => {
    it('should not display that switch on the screen', async () => {
      initializeTestInstance(undefined, undefined, 88)
      expect(testInstance.findAllByType(Pressable).length).toEqual(5)
    })
  })

  describe('when the service connected percentage does not exist', () => {
    it('should not display that switch', async () => {
      initializeTestInstance(123, date)
      expect(testInstance.findAllByType(Pressable).length).toEqual(5)
    })
  })

  describe('when an error occurs', () => {
    it('should render error component when there is a letter download error', async () => {
      initializeTestInstance(123, date, undefined, undefined, true)
      expect(testInstance.findAllByType(BasicError)).toHaveLength(1)
    })

    it('should not render error component when there is no letter download error', async () => {
      initializeTestInstance(123, date, undefined, undefined, false)
      expect(testInstance.findAllByType(BasicError)).toHaveLength(0)
    })
  })
})
