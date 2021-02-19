import { ScrollView } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, useEffect, useState } from 'react'

import {
  BasicError,
  Box,
  ButtonDecoratorType,
  ClickForActionLink,
  LinkTypeOptionsConstants,
  LinkUrlIconType,
  List,
  ListItemObj,
  LoadingComponent,
  TextArea,
  TextView,
  VAButton,
} from 'components'
import { BenefitSummaryAndServiceVerificationLetterOptions, LetterBenefitInformation, LetterTypeConstants } from 'store/api/types'
import { LettersState, StoreState } from 'store/reducers'
import { NAMESPACE } from 'constants/namespaces'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { a11yHintProp, testIdProps } from 'utils/accessibility'
import { capitalizeWord, formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { downloadLetter, getLetterBeneficiaryData } from 'store/actions'
import { map } from 'underscore'
import { useTheme, useTranslation } from 'utils/hooks'
import getEnv from 'utils/env'

const { LINK_URL_IRIS_CUSTOMER_HELP } = getEnv()

type BenefitSummaryServiceVerificationProps = {}

const BenefitSummaryServiceVerification: FC<BenefitSummaryServiceVerificationProps> = () => {
  const t = useTranslation(NAMESPACE.PROFILE)
  const theme = useTheme()
  const dispatch = useDispatch()
  const { downloading, letterBeneficiaryData, mostRecentServices, letterDownloadError } = useSelector<StoreState, LettersState>((state) => state.letters)

  const [includeMilitaryServiceInfoToggle, setIncludeMilitaryServiceInfoToggle] = useState(false)
  const [monthlyAwardToggle, setMonthlyAwardToggle] = useState(false)
  const [combinedServiceRatingToggle, setCombinedServiceRatingToggle] = useState(false)
  const [disabledDueToServiceToggle, setDisabledDueToServiceToggle] = useState(false)
  const [atLeastOneServiceDisabilityToggle, setAtLeastOneServiceDisabilityToggle] = useState(false)

  useEffect(() => {
    dispatch(getLetterBeneficiaryData(ScreenIDTypesConstants.BENEFIT_SUMMARY_SERVICE_VERIFICATION_SCREEN_ID))
  }, [dispatch])

  const getListOfMilitaryService = (): React.ReactNode => {
    return map(mostRecentServices, (periodOfService, index) => {
      const militaryServiceInfoList: Array<ListItemObj> = [
        {
          textLines: [
            { text: t('letters.benefitService.branchOfService'), variant: 'MobileBodyBold' },
            {
              text: t('common:text.raw', { text: capitalizeWord(periodOfService.branch || '') }),
            },
          ],
          a11yValue: t('common:listPosition', { position: 1, total: 4 }),
        },
        {
          textLines: [
            { text: t('letters.benefitService.dischargeType'), variant: 'MobileBodyBold' },
            {
              text: t('common:text.raw', { text: capitalizeWord(periodOfService.characterOfService || '') }),
            },
          ],
          a11yValue: t('common:listPosition', { position: 2, total: 4 }),
        },
        {
          textLines: [
            { text: t('letters.benefitService.activeDutyStart'), variant: 'MobileBodyBold' },
            {
              text: t('common:text.raw', { text: formatDateMMMMDDYYYY(periodOfService.enteredDate || '') }),
            },
          ],
          testId: `${t('letters.benefitService.activeDutyStart')} ${formatDateMMMMDDYYYY(periodOfService.enteredDate || '')}`,
          a11yValue: t('common:listPosition', { position: 3, total: 4 }),
        },
        {
          textLines: [
            { text: t('letters.benefitService.separationDate'), variant: 'MobileBodyBold' },
            {
              text: t('common:text.raw', { text: formatDateMMMMDDYYYY(periodOfService.releasedDate || '') }),
            },
          ],
          testId: `${t('letters.benefitService.separationDate')} ${formatDateMMMMDDYYYY(periodOfService.releasedDate || '')}`,
          a11yValue: t('common:listPosition', { position: 4, total: 4 }),
        },
      ]
      return (
        <Box key={index} mb={mostRecentServices.length - 1 === index ? 0 : theme.dimensions.marginBetween}>
          <List items={militaryServiceInfoList} />
        </Box>
      )
    })
  }

  const includeMilitaryServiceInfoList: Array<ListItemObj> = [
    {
      textLines: t('letters.benefitService.includeMilitaryServiceInfo'),
      onPress: (): void => setIncludeMilitaryServiceInfoToggle(!includeMilitaryServiceInfoToggle),
      decorator: ButtonDecoratorType.Switch,
      decoratorProps: {
        on: includeMilitaryServiceInfoToggle,
        a11yHint: t('letters.benefitService.includeMilitaryServiceInfoA11yHint'),
        testID: 'include-military-service-information',
      },
    },
  ]

  const getBenefitAndDisabilityToggleList = (): Array<ListItemObj> => {
    const toggleListItems: Array<ListItemObj> = []
    const { monthlyAwardAmount, awardEffectiveDate, serviceConnectedPercentage } = letterBeneficiaryData?.benefitInformation || ({} as LetterBenefitInformation)

    if (!!monthlyAwardAmount || !!awardEffectiveDate) {
      let text = ''
      if (!!monthlyAwardAmount && !!awardEffectiveDate) {
        text = t('letters.benefitService.monthlyAwardAndEffectiveDate', {
          monthlyAwardAmount,
          date: formatDateMMMMDDYYYY(awardEffectiveDate),
        })
      } else if (monthlyAwardAmount) {
        text = t('letters.benefitService.monthlyAward', {
          monthlyAwardAmount,
        })
      } else if (awardEffectiveDate) {
        text = t('letters.benefitService.effectiveDate', {
          date: formatDateMMMMDDYYYY(awardEffectiveDate),
        })
      }

      toggleListItems.push({
        textLines: text,
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
        textLines: t('letters.benefitService.combinedServiceConnectingRating', {
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

    const nonDataDrivenData: Array<ListItemObj> = [
      {
        textLines: t('letters.benefitService.disabledDueToService'),
        onPress: (): void => setDisabledDueToServiceToggle(!disabledDueToServiceToggle),
        decorator: ButtonDecoratorType.Switch,
        decoratorProps: {
          on: disabledDueToServiceToggle,
          a11yHint: t('letters.benefitService.disabledDueToServiceA11yHint'),
          testID: 'permanently-disabled-due-to-service',
        },
      },
      {
        textLines: t('letters.benefitService.oneOrMoreServiceDisabilities'),
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

  const onViewLetter = (): void => {
    const letterOptions: BenefitSummaryAndServiceVerificationLetterOptions = {
      militaryService: includeMilitaryServiceInfoToggle,
      monthlyAward: monthlyAwardToggle,
      serviceConnectedEvaluation: combinedServiceRatingToggle,
      chapter35Eligibility: disabledDueToServiceToggle,
      serviceConnectedDisabilities: atLeastOneServiceDisabilityToggle,
    }

    dispatch(downloadLetter(LetterTypeConstants.benefitSummary, letterOptions))
  }

  if (letterDownloadError) {
    return <BasicError onTryAgain={onViewLetter} messageText={t('letters.download.error')} buttonA11yHint={t('Try again to download your letter')} />
  }

  if (downloading) {
    return <LoadingComponent text={t('letters.loading')} />
  }

  return (
    <ScrollView {...testIdProps('Letters: Benefit-Summary-Service-Verification-Letter-Page')}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom}>
        <TextArea>
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            {t('letters.benefitService.title')}
          </TextView>
          <TextView variant="MobileBody" mt={theme.dimensions.marginBetween}>
            {t('letters.benefitService.summary')}
          </TextView>
        </TextArea>

        <TextView variant="MobileBodyBold" m={theme.dimensions.marginBetween} accessibilityRole="header">
          {t('letters.benefitService.pleaseChooseIncludedInformation')}
        </TextView>

        <TextView variant="TableHeaderBold" mx={theme.dimensions.gutter} mb={theme.dimensions.titleHeaderAndElementMargin} accessibilityRole="header">
          {t('letters.benefitService.militaryServiceInformation')}
        </TextView>
        {getListOfMilitaryService()}
        <TextView variant="TableFooterLabel" mx={theme.dimensions.gutter} my={theme.dimensions.marginBetween}>
          {t('letters.benefitService.ourRecordsShow')}
        </TextView>
        <List items={includeMilitaryServiceInfoList} />

        <TextView
          {...testIdProps(t('letters.benefitService.benefitAndDisabilityInfoA11yLabel'))}
          variant="TableHeaderBold"
          mx={theme.dimensions.gutter}
          mt={theme.dimensions.marginBetween}
          mb={theme.dimensions.titleHeaderAndElementMargin}
          accessibilityRole="header">
          {t('letters.benefitService.benefitAndDisabilityInfo')}
        </TextView>
        <List items={getBenefitAndDisabilityToggleList()} />

        <TextView {...testIdProps(t('letters.benefitService.sendMessageIfIncorrectInfoA11yLabel'))} variant="MobileBody" m={theme.dimensions.marginBetween}>
          {t('letters.benefitService.sendMessageIfIncorrectInfo')}
        </TextView>

        <Box ml={theme.dimensions.gutter} mb={theme.dimensions.marginBetween}>
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
            testID="view-letter"
            textColor="primaryContrast"
            backgroundColor="button"
            a11yHint={t('letters.benefitService.viewLetterA11yHint')}
          />
        </Box>
      </Box>
    </ScrollView>
  )
}

export default BenefitSummaryServiceVerification
