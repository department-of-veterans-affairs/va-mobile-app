import { useDispatch, useSelector } from 'react-redux'
import React, { FC, useEffect, useState } from 'react'

import { Alert } from 'react-native'
import {
  BasicError,
  Box,
  ButtonDecoratorType,
  ButtonTypesConstants,
  ClickForActionLink,
  DefaultList,
  DefaultListItemObj,
  LinkTypeOptionsConstants,
  LinkUrlIconType,
  LoadingComponent,
  SimpleList,
  SimpleListItemObj,
  TextArea,
  TextView,
  VAButton,
  VAScrollView,
} from 'components'
import { BenefitSummaryAndServiceVerificationLetterOptions, LetterBenefitInformation, LetterTypeConstants } from 'store/api/types'
import { DemoState, LettersState, StoreState } from 'store/reducers'
import { NAMESPACE } from 'constants/namespaces'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { a11yHintProp, testIdProps } from 'utils/accessibility'
import { capitalizeWord, formatDateMMMMDDYYYY, roundToHundredthsPlace } from 'utils/formattingUtils'
import { downloadLetter, getLetterBeneficiaryData } from 'store/actions'
import { map } from 'underscore'
import { useTheme, useTranslation } from 'utils/hooks'
import getEnv from 'utils/env'

const { LINK_URL_IRIS_CUSTOMER_HELP } = getEnv()

type BenefitSummaryServiceVerificationProps = Record<string, unknown>

const BenefitSummaryServiceVerification: FC<BenefitSummaryServiceVerificationProps> = () => {
  const t = useTranslation(NAMESPACE.PROFILE)
  const theme = useTheme()
  const dispatch = useDispatch()
  const { downloading, letterBeneficiaryData, mostRecentServices, letterDownloadError } = useSelector<StoreState, LettersState>((state) => state.letters)

  const [includeMilitaryServiceInfoToggle, setIncludeMilitaryServiceInfoToggle] = useState(true)
  const [monthlyAwardToggle, setMonthlyAwardToggle] = useState(true)
  const [combinedServiceRatingToggle, setCombinedServiceRatingToggle] = useState(true)
  const [disabledDueToServiceToggle, setDisabledDueToServiceToggle] = useState(true)
  const [atLeastOneServiceDisabilityToggle, setAtLeastOneServiceDisabilityToggle] = useState(true)

  useEffect(() => {
    dispatch(getLetterBeneficiaryData(ScreenIDTypesConstants.BENEFIT_SUMMARY_SERVICE_VERIFICATION_SCREEN_ID))
  }, [dispatch])

  const getListOfMilitaryService = (): React.ReactNode => {
    return map(mostRecentServices, (periodOfService, index) => {
      const militaryServiceInfoList: Array<DefaultListItemObj> = [
        {
          textLines: [
            { text: t('letters.benefitService.branchOfService'), variant: 'MobileBodyBold', color: 'primaryTitle' },
            {
              text: t('common:text.raw', { text: capitalizeWord(periodOfService.branch || '') }),
            },
          ],
          a11yValue: t('common:listPosition', { position: 1, total: 4 }),
        },
        {
          textLines: [
            { text: t('letters.benefitService.dischargeType'), variant: 'MobileBodyBold', color: 'primaryTitle' },
            {
              text: t('common:text.raw', { text: capitalizeWord(periodOfService.characterOfService || '') }),
            },
          ],
          a11yValue: t('common:listPosition', { position: 2, total: 4 }),
        },
        {
          textLines: [
            { text: t('letters.benefitService.activeDutyStart'), variant: 'MobileBodyBold', color: 'primaryTitle' },
            {
              text: t('common:text.raw', { text: formatDateMMMMDDYYYY(periodOfService.enteredDate || '') }),
            },
          ],
          testId: `${t('letters.benefitService.activeDutyStart')} ${formatDateMMMMDDYYYY(periodOfService.enteredDate || '')}`,
          a11yValue: t('common:listPosition', { position: 3, total: 4 }),
        },
        {
          textLines: [
            { text: t('letters.benefitService.separationDate'), variant: 'MobileBodyBold', color: 'primaryTitle' },
            {
              text: t('common:text.raw', { text: formatDateMMMMDDYYYY(periodOfService.releasedDate || '') }),
            },
          ],
          testId: `${t('letters.benefitService.separationDate')} ${formatDateMMMMDDYYYY(periodOfService.releasedDate || '')}`,
          a11yValue: t('common:listPosition', { position: 4, total: 4 }),
        },
      ]
      return (
        <Box key={index} mb={mostRecentServices.length - 1 === index ? 0 : theme.dimensions.standardMarginBetween}>
          <DefaultList items={militaryServiceInfoList} title={t('letters.benefitService.militaryServiceInformation')} />
        </Box>
      )
    })
  }

  const includeMilitaryServiceInfoList: Array<SimpleListItemObj> = [
    {
      text: t('letters.benefitService.includeMilitaryServiceInfo'),
      onPress: (): void => setIncludeMilitaryServiceInfoToggle(!includeMilitaryServiceInfoToggle),
      decorator: ButtonDecoratorType.Switch,
      decoratorProps: {
        on: includeMilitaryServiceInfoToggle,
        a11yHint: t('letters.benefitService.includeMilitaryServiceInfoA11yHint'),
        testID: 'include-military-service-information',
      },
    },
  ]

  const getBenefitAndDisabilityToggleList = (): Array<SimpleListItemObj> => {
    const toggleListItems: Array<SimpleListItemObj> = []
    const { monthlyAwardAmount, awardEffectiveDate, serviceConnectedPercentage, hasChapter35Eligibility, hasServiceConnectedDisabilities } =
      letterBeneficiaryData?.benefitInformation || ({} as LetterBenefitInformation)

    if (!!monthlyAwardAmount || !!awardEffectiveDate) {
      let text = ''
      if (!!monthlyAwardAmount && !!awardEffectiveDate) {
        text = t('letters.benefitService.monthlyAwardAndEffectiveDate', {
          monthlyAwardAmount: roundToHundredthsPlace(monthlyAwardAmount),
          date: formatDateMMMMDDYYYY(awardEffectiveDate),
        })
      } else if (monthlyAwardAmount) {
        text = t('letters.benefitService.monthlyAward', {
          monthlyAwardAmount: roundToHundredthsPlace(monthlyAwardAmount),
        })
      } else if (awardEffectiveDate) {
        text = t('letters.benefitService.effectiveDate', {
          date: formatDateMMMMDDYYYY(awardEffectiveDate),
        })
      }

      toggleListItems.push({
        text: text,
        testId: text.replace(',', ''),
        onPress: (): void => setMonthlyAwardToggle(!monthlyAwardToggle),
        decorator: ButtonDecoratorType.Switch,
        decoratorProps: {
          on: monthlyAwardToggle,
          a11yHint: t('letters.benefitService.monthlyAwardA11yHint'),
          testID: 'monthly-award',
        },
      })
    }

    if (serviceConnectedPercentage) {
      toggleListItems.push({
        text: t('letters.benefitService.combinedServiceConnectingRating', {
          rating: serviceConnectedPercentage,
        }),
        onPress: (): void => setCombinedServiceRatingToggle(!combinedServiceRatingToggle),
        decorator: ButtonDecoratorType.Switch,
        decoratorProps: {
          on: combinedServiceRatingToggle,
          a11yHint: t('letters.benefitService.combinedServiceConnectingRatingA11yHint'),
          testID: 'combined-service-connected-rating',
        },
      })
    }

    const nonDataDrivenData: Array<SimpleListItemObj> = [
      {
        text: t('letters.benefitService.disabledDueToService', { areOrNot: hasChapter35Eligibility ? 'are' : "aren't" }),
        onPress: (): void => setDisabledDueToServiceToggle(!disabledDueToServiceToggle),
        decorator: ButtonDecoratorType.Switch,
        decoratorProps: {
          on: disabledDueToServiceToggle,
          a11yHint: t('letters.benefitService.disabledDueToServiceA11yHint'),
          testID: 'permanently-disabled-due-to-service',
        },
      },
      {
        text: t('letters.benefitService.oneOrMoreServiceDisabilities', { haveOrNot: hasServiceConnectedDisabilities ? 'have' : "don't have" }),
        onPress: (): void => setAtLeastOneServiceDisabilityToggle(!atLeastOneServiceDisabilityToggle),
        decorator: ButtonDecoratorType.Switch,
        decoratorProps: {
          on: atLeastOneServiceDisabilityToggle,
          a11yHint: t('letters.benefitService.oneOrMoreServiceDisabilitiesA11yHint'),
          testID: 'number-of-service-connected-disabilities',
        },
      },
    ]

    return [...toggleListItems, ...nonDataDrivenData]
  }

  const { demoMode } = useSelector<StoreState, DemoState>((state) => state.demo)
  const onViewLetter = (): void => {
    if (demoMode) {
      Alert.alert('Demo Mode', 'Letters are not available to download for demo user')
    } else {
      const letterOptions: BenefitSummaryAndServiceVerificationLetterOptions = {
        militaryService: includeMilitaryServiceInfoToggle,
        monthlyAward: monthlyAwardToggle,
        serviceConnectedEvaluation: combinedServiceRatingToggle,
        chapter35Eligibility: disabledDueToServiceToggle,
        serviceConnectedDisabilities: atLeastOneServiceDisabilityToggle,
      }

      dispatch(downloadLetter(LetterTypeConstants.benefitSummary, letterOptions))
    }
  }

  if (letterDownloadError) {
    return <BasicError onTryAgain={onViewLetter} messageText={t('letters.download.error')} buttonA11yHint={t('Try again to download your letter')} />
  }

  if (downloading || !letterBeneficiaryData) {
    return <LoadingComponent text={t(downloading ? 'letters.loading' : 'letters.benefitService.loading')} />
  }

  return (
    <VAScrollView {...testIdProps('Letters: Benefit-Summary-Service-Verification-Letter-Page')}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom}>
        <TextArea>
          <TextView variant="MobileBodyBold" color={'primaryTitle'} accessibilityRole="header">
            {t('letters.benefitService.title')}
          </TextView>
          <TextView variant="MobileBody" mt={theme.dimensions.standardMarginBetween}>
            {t('letters.benefitService.summary')}
          </TextView>
        </TextArea>

        <TextView variant="MobileBodyBold" color={'primaryTitle'} mt={theme.dimensions.standardMarginBetween} mx={theme.dimensions.gutter} accessibilityRole="header">
          {t('letters.benefitService.chooseIncludedInformation')}
        </TextView>
        {getListOfMilitaryService()}
        <TextView variant="TableFooterLabel" mx={theme.dimensions.gutter} my={theme.dimensions.standardMarginBetween}>
          {t('letters.benefitService.ourRecordsShow')}
        </TextView>
        <SimpleList items={includeMilitaryServiceInfoList} />

        <SimpleList
          items={getBenefitAndDisabilityToggleList()}
          title={t('letters.benefitService.benefitAndDisabilityInfo')}
          titleA11yLabel={t('letters.benefitService.benefitAndDisabilityInfoA11yLabel')}
        />

        <TextView {...testIdProps(t('letters.benefitService.sendMessageIfIncorrectInfoA11yLabel'))} variant="MobileBody" m={theme.dimensions.standardMarginBetween}>
          {t('letters.benefitService.sendMessageIfIncorrectInfo')}
        </TextView>

        <Box ml={theme.dimensions.gutter} mb={theme.dimensions.standardMarginBetween}>
          <ClickForActionLink
            displayedText={t('letters.benefitService.sendMessage')}
            linkType={LinkTypeOptionsConstants.url}
            numberOrUrlLink={LINK_URL_IRIS_CUSTOMER_HELP}
            linkUrlIconType={LinkUrlIconType.Arrow}
            {...a11yHintProp(t('letters.benefitService.sendMessageA11yHint'))}
          />
        </Box>

        <Box mx={theme.dimensions.gutter}>
          <VAButton
            onPress={onViewLetter}
            label={t('letters.benefitService.viewLetter')}
            testID={t('letters.benefitService.viewLetter')}
            buttonType={ButtonTypesConstants.buttonPrimary}
            a11yHint={t('letters.benefitService.viewLetterA11yHint')}
          />
        </Box>
      </Box>
    </VAScrollView>
  )
}

export default BenefitSummaryServiceVerification
