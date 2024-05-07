import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { Button } from '@department-of-veterans-affairs/mobile-component-library'
import { map } from 'underscore'

import { useDownloadLetter, useLetterBeneficiaryData } from 'api/letters'
import { LetterBenefitInformation, LetterTypeConstants, LettersDownloadParams } from 'api/types'
import {
  BasicError,
  Box,
  ButtonDecoratorType,
  DefaultList,
  DefaultListItemObj,
  FeatureLandingTemplate,
  LinkWithAnalytics,
  LoadingComponent,
  SimpleList,
  SimpleListItemObj,
  TextArea,
  TextView,
} from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { BenefitsStackParamList } from 'screens/BenefitsScreen/BenefitsStackScreens'
import { a11yLabelVA } from 'utils/a11yLabel'
import getEnv from 'utils/env'
import { capitalizeWord, formatDateMMMMDDYYYY, roundToHundredthsPlace } from 'utils/formattingUtils'
import { useTheme } from 'utils/hooks'
import { screenContentAllowed } from 'utils/waygateConfig'

const { LINK_URL_ASK_VA_GOV } = getEnv()

type BenefitSummaryServiceVerificationProps = StackScreenProps<
  BenefitsStackParamList,
  'BenefitSummaryServiceVerificationLetter'
>

function BenefitSummaryServiceVerification({ navigation }: BenefitSummaryServiceVerificationProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const { data: letterBeneficiaryData, isLoading: loadingLetterBeneficiaryData } = useLetterBeneficiaryData({
    enabled: screenContentAllowed('WG_BenefitSummaryServiceVerificationLetter'),
  })
  const lettersOptions: LettersDownloadParams = {
    militaryService: false,
    serviceConnectedDisabilities: false,
    serviceConnectedEvaluation: false,
    nonServiceConnectedPension: letterBeneficiaryData?.benefitInformation.hasNonServiceConnectedPension || false,
    monthlyAward: false,
    unemployable: letterBeneficiaryData?.benefitInformation.hasIndividualUnemployabilityGranted || false,
    specialMonthlyCompensation: letterBeneficiaryData?.benefitInformation.hasSpecialMonthlyCompensation || false,
    adaptedHousing: letterBeneficiaryData?.benefitInformation.hasAdaptedHousing || false,
    chapter35Eligibility: false,
    deathResultOfDisability: letterBeneficiaryData?.benefitInformation.hasDeathResultOfDisability || false,
    survivorsAward:
      letterBeneficiaryData?.benefitInformation.hasSurvivorsIndemnityCompensationAward ||
      letterBeneficiaryData?.benefitInformation.hasSurvivorsPensionAward ||
      false,
  }
  const {
    isFetching: downloading,
    isError: letterDownloadError,
    refetch: refetchLetter,
  } = useDownloadLetter(LetterTypeConstants.benefitSummary, lettersOptions)

  const [includeMilitaryServiceInfoToggle, setIncludeMilitaryServiceInfoToggle] = useState(true)
  const [monthlyAwardToggle, setMonthlyAwardToggle] = useState(true)
  const [combinedServiceRatingToggle, setCombinedServiceRatingToggle] = useState(true)
  const [disabledDueToServiceToggle, setDisabledDueToServiceToggle] = useState(true)
  const [atLeastOneServiceDisabilityToggle, setAtLeastOneServiceDisabilityToggle] = useState(true)

  const getListOfMilitaryService = (): React.ReactNode => {
    return map(letterBeneficiaryData?.mostRecentServices || [], (periodOfService, index) => {
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
        <Box
          key={index}
          mb={
            (letterBeneficiaryData?.mostRecentServices?.length || 0) - 1 === index
              ? 0
              : theme.dimensions.standardMarginBetween
          }>
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
    const {
      monthlyAwardAmount,
      awardEffectiveDate,
      serviceConnectedPercentage,
      hasChapter35Eligibility,
      hasServiceConnectedDisabilities,
    } = letterBeneficiaryData?.benefitInformation || ({} as LetterBenefitInformation)

    const text = t('letters.benefitService.monthlyAwardAndEffectiveDate', {
      monthlyAwardAmount: roundToHundredthsPlace(monthlyAwardAmount || 0),
      date: awardEffectiveDate
        ? formatDateMMMMDDYYYY(awardEffectiveDate)
        : t('letters.benefitService.effectiveDateInvalid'),
    })

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
        text: t('letters.benefitService.disabledDueToService', {
          areOrNot: hasChapter35Eligibility ? 'are' : "aren't",
        }),
        onPress: (): void => setDisabledDueToServiceToggle(!disabledDueToServiceToggle),
        decorator: ButtonDecoratorType.Switch,
        decoratorProps: {
          on: disabledDueToServiceToggle,
          a11yHint: t('letters.benefitService.disabledDueToServiceA11yHint'),
          testID: 'permanently-disabled-due-to-service',
        },
      },
      {
        text: t('letters.benefitService.oneOrMoreServiceDisabilities', {
          haveOrNot: hasServiceConnectedDisabilities ? 'have' : "don't have",
        }),
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
    lettersOptions.militaryService = includeMilitaryServiceInfoToggle
    lettersOptions.monthlyAward = monthlyAwardToggle
    lettersOptions.serviceConnectedEvaluation = combinedServiceRatingToggle
    lettersOptions.chapter35Eligibility = disabledDueToServiceToggle
    lettersOptions.serviceConnectedDisabilities = atLeastOneServiceDisabilityToggle
    refetchLetter()
  }

  const loadingCheck = loadingLetterBeneficiaryData || downloading || !letterBeneficiaryData

  return (
    <FeatureLandingTemplate
      backLabel={t('letters.overview.viewLetters')}
      backLabelOnPress={navigation.goBack}
      title={t('letters.details.title')}
      testID="BenefitSummaryServiceVerificationTestID">
      {loadingCheck ? (
        <LoadingComponent text={t(downloading ? 'letters.loading' : 'letters.benefitService.loading')} />
      ) : letterDownloadError ? (
        <BasicError
          onTryAgain={onViewLetter}
          messageText={t('letters.download.error')}
          buttonA11yHint={t('letters.download.tryAgain.a11y')}
        />
      ) : (
        <Box mb={theme.dimensions.contentMarginBottom}>
          <TextArea>
            <TextView variant="MobileBodyBold" accessibilityRole="header">
              {t('letters.benefitService.title')}
            </TextView>
            <TextView variant="MobileBody" mt={theme.dimensions.standardMarginBetween}>
              {t('letters.benefitService.summary')}
            </TextView>
          </TextArea>

          <TextView
            variant="MobileBodyBold"
            mt={theme.dimensions.standardMarginBetween}
            mx={theme.dimensions.gutter}
            accessibilityRole="header"
            paragraphSpacing={true}>
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

          <TextView
            accessibilityLabel={a11yLabelVA(t('letters.benefitService.sendMessageIfIncorrectInfo'))}
            variant="MobileBody"
            m={theme.dimensions.standardMarginBetween}>
            {t('letters.benefitService.sendMessageIfIncorrectInfo')}
          </TextView>

          <Box ml={theme.dimensions.gutter} mb={theme.dimensions.standardMarginBetween}>
            <LinkWithAnalytics
              type="url"
              url={LINK_URL_ASK_VA_GOV}
              text={t('letters.benefitService.sendMessage')}
              a11yLabel={a11yLabelVA(t('letters.benefitService.sendMessage'))}
              a11yHint={t('letters.benefitService.sendMessageA11yHint')}
            />
          </Box>

          <Box mx={theme.dimensions.gutter}>
            <Button
              onPress={onViewLetter}
              label={t('letters.benefitService.viewLetter')}
              testID={t('letters.benefitService.viewLetter')}
            />
          </Box>
        </Box>
      )}
    </FeatureLandingTemplate>
  )
}

export default BenefitSummaryServiceVerification
