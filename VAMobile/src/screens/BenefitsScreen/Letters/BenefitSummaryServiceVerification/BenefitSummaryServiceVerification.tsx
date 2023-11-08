import { StackScreenProps } from '@react-navigation/stack'
import { map } from 'underscore'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import React, { FC, useEffect, useState } from 'react'

import {
  BasicError,
  Box,
  ButtonDecoratorType,
  ButtonTypesConstants,
  ClickForActionLink,
  DefaultList,
  DefaultListItemObj,
  FeatureLandingTemplate,
  LinkTypeOptionsConstants,
  LinkUrlIconType,
  LoadingComponent,
  SimpleList,
  SimpleListItemObj,
  TextArea,
  TextView,
  VAButton,
} from 'components'
import { BenefitSummaryAndServiceVerificationLetterOptions, LetterBenefitInformation, LetterTypeConstants } from 'store/api/types'
import { BenefitsStackParamList } from 'screens/BenefitsScreen/BenefitsStackScreens'
import { LettersState, downloadLetter, getLetterBeneficiaryData } from 'store/slices'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { a11yHintProp } from 'utils/accessibility'
import { a11yLabelVA } from 'utils/a11yLabel'
import { capitalizeWord, formatDateMMMMDDYYYY, roundToHundredthsPlace } from 'utils/formattingUtils'
import { useAppDispatch, useTheme } from 'utils/hooks'
import getEnv from 'utils/env'

const { LINK_URL_ASK_VA_GOV } = getEnv()

type BenefitSummaryServiceVerificationProps = StackScreenProps<BenefitsStackParamList, 'BenefitSummaryServiceVerificationLetter'>

const BenefitSummaryServiceVerification: FC<BenefitSummaryServiceVerificationProps> = ({ navigation }) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const { downloading, letterBeneficiaryData, mostRecentServices, letterDownloadError, loadingLetterBeneficiaryData } = useSelector<RootState, LettersState>(
    (state) => state.letters,
  )

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
            { text: t('letters.benefitService.branchOfService'), variant: 'MobileBodyBold' },
            {
              text: t('text.raw', { text: capitalizeWord(periodOfService.branch || '') }),
            },
          ],
          a11yValue: t('listPosition', { position: 1, total: 4 }),
        },
        {
          textLines: [
            { text: t('letters.benefitService.dischargeType'), variant: 'MobileBodyBold' },
            {
              text: t('text.raw', { text: capitalizeWord(periodOfService.characterOfService || '') }),
            },
          ],
          a11yValue: t('listPosition', { position: 2, total: 4 }),
        },
        {
          textLines: [
            { text: t('letters.benefitService.activeDutyStart'), variant: 'MobileBodyBold' },
            {
              text: t('text.raw', { text: formatDateMMMMDDYYYY(periodOfService.enteredDate || '') }),
            },
          ],
          testId: `${t('letters.benefitService.activeDutyStart')} ${formatDateMMMMDDYYYY(periodOfService.enteredDate || '')}`,
          a11yValue: t('listPosition', { position: 3, total: 4 }),
        },
        {
          textLines: [
            { text: t('letters.benefitService.separationDate'), variant: 'MobileBodyBold' },
            {
              text: t('text.raw', { text: formatDateMMMMDDYYYY(periodOfService.releasedDate || '') }),
            },
          ],
          testId: `${t('letters.benefitService.separationDate')} ${formatDateMMMMDDYYYY(periodOfService.releasedDate || '')}`,
          a11yValue: t('listPosition', { position: 4, total: 4 }),
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
      const percentText = t('letters.benefitService.combinedServiceConnectingRating', {
        rating: serviceConnectedPercentage,
      })
      toggleListItems.push({
        text: percentText,
        testId: percentText,
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
    return (
      <FeatureLandingTemplate backLabel={t('letters.overview.viewLetters')} backLabelOnPress={navigation.goBack} title={t('letters.details.title')}>
        <BasicError onTryAgain={onViewLetter} messageText={t('letters.download.error')} buttonA11yHint={t('letters.download.tryAgain.a11y')} />
      </FeatureLandingTemplate>
    )
  }

  if (loadingLetterBeneficiaryData || downloading || !letterBeneficiaryData) {
    return (
      <FeatureLandingTemplate backLabel={t('letters.overview.viewLetters')} backLabelOnPress={navigation.goBack} title={t('letters.details.title')}>
        <LoadingComponent text={t(downloading ? 'letters.loading' : 'letters.benefitService.loading')} />
      </FeatureLandingTemplate>
    )
  }

  return (
    <FeatureLandingTemplate
      backLabel={t('letters.overview.viewLetters')}
      backLabelOnPress={navigation.goBack}
      title={t('letters.details.title')}
      testID="BenefitSummaryServiceVerificationTestID">
      <Box mb={theme.dimensions.contentMarginBottom}>
        <TextArea>
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            {t('letters.benefitService.title')}
          </TextView>
          <TextView variant="MobileBody" mt={theme.dimensions.standardMarginBetween}>
            {t('letters.benefitService.summary')}
          </TextView>
        </TextArea>

        <TextView variant="MobileBodyBold" mt={theme.dimensions.standardMarginBetween} mx={theme.dimensions.gutter} accessibilityRole="header" paragraphSpacing={true}>
          {t('letters.benefitService.chooseIncludedInformation')}
        </TextView>
        {getListOfMilitaryService()}
        <TextView variant="TableFooterLabel" mx={theme.dimensions.gutter} mb={theme.dimensions.standardMarginBetween}>
          {t('letters.benefitService.ourRecordsShow')}
        </TextView>
        <SimpleList items={includeMilitaryServiceInfoList} />

        <SimpleList
          items={getBenefitAndDisabilityToggleList()}
          title={t('letters.benefitService.benefitAndDisabilityInfo')}
          titleA11yLabel={a11yLabelVA(t('letters.benefitService.benefitAndDisabilityInfo'))}
        />

        <TextView accessibilityLabel={a11yLabelVA(t('letters.benefitService.sendMessageIfIncorrectInfo'))} variant="MobileBody" m={theme.dimensions.standardMarginBetween}>
          {t('letters.benefitService.sendMessageIfIncorrectInfo')}
        </TextView>

        <Box ml={theme.dimensions.gutter} mb={theme.dimensions.standardMarginBetween}>
          <ClickForActionLink
            displayedText={t('letters.benefitService.sendMessage')}
            linkType={LinkTypeOptionsConstants.url}
            numberOrUrlLink={LINK_URL_ASK_VA_GOV}
            linkUrlIconType={LinkUrlIconType.Arrow}
            {...a11yHintProp(t('letters.benefitService.sendMessageA11yHint'))}
            a11yLabel={a11yLabelVA(t('letters.benefitService.sendMessage'))}
          />
        </Box>

        <Box mx={theme.dimensions.gutter}>
          <VAButton
            onPress={onViewLetter}
            label={t('letters.benefitService.viewLetter')}
            testID={t('letters.benefitService.viewLetter')}
            buttonType={ButtonTypesConstants.buttonPrimary}
          />
        </Box>
      </Box>
    </FeatureLandingTemplate>
  )
}

export default BenefitSummaryServiceVerification
