import { ScrollView } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, useEffect, useState } from 'react'

import { BenefitSummaryAndServiceVerificationLetterOptions, LetterTypeConstants } from 'store/api/types'
import { Box, ButtonDecoratorType, ClickForActionLink, LinkTypeOptionsConstants, LinkUrlIconType, List, ListItemObj, TextArea, TextView, VAButton } from 'components'
import { LettersState, StoreState } from 'store/reducers'
import { NAMESPACE } from 'constants/namespaces'
import { a11yHintProp, testIdProps } from 'utils/accessibility'
import { capitalizeWord, formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { downloadLetter, getLetterBeneficiaryData } from 'store/actions'
import { useTheme, useTranslation } from 'utils/hooks'
import LettersLoadingScreen from '../LettersLoadingScreen'
import getEnv from 'utils/env'

const { LINK_URL_IRIS_CUSTOMER_HELP } = getEnv()

type BenefitSummaryServiceVerificationProps = {}

const BenefitSummaryServiceVerification: FC<BenefitSummaryServiceVerificationProps> = () => {
  const t = useTranslation(NAMESPACE.PROFILE)
  const theme = useTheme()
  const dispatch = useDispatch()
  const { downloading, letterBeneficiaryData } = useSelector<StoreState, LettersState>((state) => state.letters)

  const [includeMilitaryServiceInfoToggle, setIncludeMilitaryServiceInfoToggle] = useState(false)
  const [monthlyAwardToggle, setMonthlyAwardToggle] = useState(false)
  const [combinedServiceRatingToggle, setCombinedServiceRatingToggle] = useState(false)
  const [disabledDueToServiceToggle, setDisabledDueToServiceToggle] = useState(false)
  const [atLeastOneServiceDisabilityToggle, setAtLeastOneServiceDisabilityToggle] = useState(false)

  useEffect(() => {
    dispatch(getLetterBeneficiaryData())
  }, [dispatch])

  const militaryServiceInfoList: Array<ListItemObj> = [
    {
      textLines: [
        { text: t('letters.benefitService.dischargeType'), variant: 'MobileBodyBold' },
        {
          text: t('common:text.raw', { text: capitalizeWord(letterBeneficiaryData?.militaryService.characterOfService || '') }),
        },
      ],
    },
    {
      textLines: [
        { text: t('letters.benefitService.activeDutyStart'), variant: 'MobileBodyBold' },
        {
          text: t('common:text.raw', { text: formatDateMMMMDDYYYY(letterBeneficiaryData?.militaryService.enteredDate || '') }),
        },
      ],
    },
    {
      textLines: [
        { text: t('letters.benefitService.separationDate'), variant: 'MobileBodyBold' },
        {
          text: t('common:text.raw', { text: formatDateMMMMDDYYYY(letterBeneficiaryData?.militaryService.releasedDate || '') }),
        },
      ],
    },
  ]

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

  const benefitAndDisabilityToggleList: Array<ListItemObj> = [
    {
      textLines: [
        {
          text: t('letters.benefitService.monthlyAward', {
            awardAmount: letterBeneficiaryData?.benefitInformation.monthlyAwardAmount.toString() || '',
            date: formatDateMMMMDDYYYY(letterBeneficiaryData?.benefitInformation.awardEffectiveDate || ''),
          }),
        },
      ],
      onPress: (): void => setMonthlyAwardToggle(!monthlyAwardToggle),
      decorator: ButtonDecoratorType.Switch,
      decoratorProps: {
        on: monthlyAwardToggle,
        a11yHint: t('letters.benefitService.monthlyAwardA11yHint'),
        testID: 'monthly-award',
      },
    },
    {
      textLines: [
        {
          text: t('letters.benefitService.combinedServiceConnectingRating', {
            rating: letterBeneficiaryData?.benefitInformation.serviceConnectedPercentage.toString() || '',
          }),
        },
      ],
      onPress: (): void => setCombinedServiceRatingToggle(!combinedServiceRatingToggle),
      decorator: ButtonDecoratorType.Switch,
      decoratorProps: {
        on: combinedServiceRatingToggle,
        a11yHint: t('letters.benefitService.combinedServiceConnectingRatingA11yHint'),
        testID: 'combined-service-connected-rating',
      },
    },
    {
      textLines: [{ text: t('letters.benefitService.disabledDueToService') }],
      onPress: (): void => setDisabledDueToServiceToggle(!disabledDueToServiceToggle),
      decorator: ButtonDecoratorType.Switch,
      decoratorProps: {
        on: disabledDueToServiceToggle,
        a11yHint: t('letters.benefitService.disabledDueToServiceA11yHint'),
        testID: 'permanently-disabled-due-to-service',
      },
    },
    {
      textLines: [{ text: t('letters.benefitService.oneOrMoreServiceDisabilities') }],
      onPress: (): void => setAtLeastOneServiceDisabilityToggle(!atLeastOneServiceDisabilityToggle),
      decorator: ButtonDecoratorType.Switch,
      decoratorProps: {
        on: atLeastOneServiceDisabilityToggle,
        a11yHint: t('letters.benefitService.oneOrMoreServiceDisabilitiesA11yHint'),
        testID: 'number-of-service-connected-disabilities',
      },
    },
  ]

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

  if (downloading) {
    return <LettersLoadingScreen />
  }

  return (
    <ScrollView {...testIdProps('Benefit-Summary-Service-Verification-Screen')}>
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
        <List items={militaryServiceInfoList} />
        <TextView variant="TableFooterLabel" mx={theme.dimensions.gutter} my={theme.dimensions.marginBetween}>
          {t('letters.benefitService.ourRecordsShow')}
        </TextView>
        <List items={includeMilitaryServiceInfoList} />

        <TextView
          variant="TableHeaderBold"
          mx={theme.dimensions.gutter}
          mt={theme.dimensions.marginBetween}
          mb={theme.dimensions.titleHeaderAndElementMargin}
          accessibilityRole="header">
          {t('letters.benefitService.benefitAndDisabilityInfo')}
        </TextView>
        <List items={benefitAndDisabilityToggleList} />

        <TextView variant="MobileBody" m={theme.dimensions.marginBetween}>
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
