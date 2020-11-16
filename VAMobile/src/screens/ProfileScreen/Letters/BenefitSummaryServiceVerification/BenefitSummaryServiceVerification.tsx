import { ScrollView } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, useEffect, useState } from 'react'

import { Box, ButtonDecoratorType, ButtonList, ButtonListItemObj, ClickForActionLink, LinkTypeOptionsConstants, LinkUrlIconType, TextArea, TextView, VAButton } from 'components'
import { LettersState, StoreState } from 'store/reducers'
import { NAMESPACE } from 'constants/namespaces'
import { a11yHintProp, testIdProps } from 'utils/accessibility'
import { capitalizeWord, formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { getLetterBeneficiaryData } from 'store/actions'
import { useTheme, useTranslation } from 'utils/hooks'
import getEnv from 'utils/env'

const { LINK_URL_IRIS_CUSTOMER_HELP } = getEnv()

type BenefitSummaryServiceVerificationProps = {}

const BenefitSummaryServiceVerification: FC<BenefitSummaryServiceVerificationProps> = () => {
  const t = useTranslation(NAMESPACE.PROFILE)
  const theme = useTheme()
  const dispatch = useDispatch()
  const { letterBeneficiaryData } = useSelector<StoreState, LettersState>((state) => state.letters)

  const [includeMilitaryServiceInfoToggle, setIncludeMilitaryServiceInfoToggle] = useState(false)
  const [monthlyAwardToggle, setMonthlyAwardToggle] = useState(false)
  const [combinedServiceRatingToggle, setCombinedServiceRatingToggle] = useState(false)
  const [disabledDueToServiceToggle, setDisabledDueToServiceToggle] = useState(false)
  const [atLeastOneServiceDisabilityToggle, setAtLeastOneServiceDisabilityToggle] = useState(false)

  useEffect(() => {
    dispatch(getLetterBeneficiaryData())
  }, [dispatch])

  const militaryServiceInfoList: Array<ButtonListItemObj> = [
    {
      textIDs: [
        { textID: 'letters.benefitService.dischargeType' },
        {
          textID: 'letters.benefitService.rawText',
          fieldObj: { text: capitalizeWord(letterBeneficiaryData?.militaryService.characterOfService || '') },
        },
      ],
    },
    {
      textIDs: [
        { textID: 'letters.benefitService.activeDutyStart' },
        {
          textID: 'letters.benefitService.rawText',
          fieldObj: { text: formatDateMMMMDDYYYY(letterBeneficiaryData?.militaryService.enteredDate || '') },
        },
      ],
    },
    {
      textIDs: [
        { textID: 'letters.benefitService.separationDate' },
        {
          textID: 'letters.benefitService.rawText',
          fieldObj: { text: formatDateMMMMDDYYYY(letterBeneficiaryData?.militaryService.releasedDate || '') },
        },
      ],
    },
  ]

  const includeMilitaryServiceInfoList: Array<ButtonListItemObj> = [
    {
      textIDs: 'letters.benefitService.includeMilitaryServiceInfo',
      onPress: (): void => setIncludeMilitaryServiceInfoToggle(!includeMilitaryServiceInfoToggle),
      decorator: ButtonDecoratorType.Switch,
      decoratorProps: {
        on: includeMilitaryServiceInfoToggle,
        a11yHint: t('letters.benefitService.includeMilitaryServiceInfoA11yHint'),
        testID: 'include-military-service-information',
      },
    },
  ]

  const benefitAndDisabilityToggleList: Array<ButtonListItemObj> = [
    {
      textIDs: [
        {
          textID: 'letters.benefitService.monthlyAward',
          fieldObj: {
            awardAmount: letterBeneficiaryData?.benefitInformation.monthlyAwardAmount.toString() || '',
            date: formatDateMMMMDDYYYY(letterBeneficiaryData?.benefitInformation.awardEffectiveDate || ''),
          },
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
      textIDs: [
        {
          textID: 'letters.benefitService.combinedServiceConnectingRating',
          fieldObj: {
            rating: letterBeneficiaryData?.benefitInformation.serviceConnectedPercentage.toString() || '',
          },
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
      textIDs: [{ textID: 'letters.benefitService.disabledDueToService' }],
      onPress: (): void => setDisabledDueToServiceToggle(!disabledDueToServiceToggle),
      decorator: ButtonDecoratorType.Switch,
      decoratorProps: {
        on: disabledDueToServiceToggle,
        a11yHint: t('letters.benefitService.disabledDueToServiceA11yHint'),
        testID: 'permanently-disabled-due-to-service',
      },
    },
    {
      textIDs: [{ textID: 'letters.benefitService.oneOrMoreServiceDisabilities' }],
      onPress: (): void => setAtLeastOneServiceDisabilityToggle(!atLeastOneServiceDisabilityToggle),
      decorator: ButtonDecoratorType.Switch,
      decoratorProps: {
        on: atLeastOneServiceDisabilityToggle,
        a11yHint: t('letters.benefitService.oneOrMoreServiceDisabilitiesA11yHint'),
        testID: 'number-of-service-connected-disabilities',
      },
    },
  ]

  const onViewLetter = (): void => {}

  return (
    <ScrollView {...testIdProps('Benefit-Summary-Service-Verification-Screen')}>
      <Box mt={theme.dimensions.gutter}>
        <TextArea>
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            {t('letters.benefitService.title')}
          </TextView>
          <TextView variant="MobileBody" mt={theme.dimensions.bSummarySVerificationMarginTop} mb={theme.dimensions.bSummarySVerificationSmallMarginBottom}>
            {t('letters.benefitService.summary')}
          </TextView>
        </TextArea>

        <TextView variant="MobileBodyBold" m={theme.dimensions.gutter} accessibilityRole="header">
          {t('letters.benefitService.pleaseChooseIncludedInformation')}
        </TextView>

        <TextView variant="TableHeaderBold" mx={theme.dimensions.gutter} mb={theme.dimensions.bSummarySVerificationMarginBottom} accessibilityRole="header">
          {t('letters.benefitService.militaryServiceInformation')}
        </TextView>
        <ButtonList items={militaryServiceInfoList} translationNameSpace={NAMESPACE.PROFILE} />
        <TextView variant="TableFooterLabel" mx={theme.dimensions.gutter} my={theme.dimensions.bSummarySVerificationMarginTopAndBottom}>
          {t('letters.benefitService.ourRecordsShow')}
        </TextView>
        <ButtonList items={includeMilitaryServiceInfoList} translationNameSpace={NAMESPACE.PROFILE} />

        <TextView
          variant="TableHeaderBold"
          mt={theme.dimensions.bSummarySVerificationLargeMarginTop}
          mx={theme.dimensions.gutter}
          mb={theme.dimensions.bSummarySVerificationMarginBottom}
          accessibilityRole="header">
          {t('letters.benefitService.benefitAndDisabilityInfo')}
        </TextView>
        <ButtonList items={benefitAndDisabilityToggleList} translationNameSpace={NAMESPACE.PROFILE} />

        <TextView variant="MobileBody" m={theme.dimensions.gutter}>
          {t('letters.benefitService.sendMessageIfIncorrectInfo')}
        </TextView>

        <Box ml={theme.dimensions.gutter} mb={theme.dimensions.gutter}>
          <ClickForActionLink
            displayedText={t('letters.benefitService.sendMessage')}
            linkType={LinkTypeOptionsConstants.url}
            numberOrUrlLink={LINK_URL_IRIS_CUSTOMER_HELP}
            linkUrlIconType={LinkUrlIconType.Arrow}
            {...a11yHintProp(t('letters.benefitService.sendMessageA11yHint'))}
          />
        </Box>

        <VAButton
          onPress={onViewLetter}
          label={t('letters.benefitService.viewLetter')}
          testID="view-letter"
          textColor="primaryContrast"
          backgroundColor="button"
          a11yHint={t('letters.benefitService.viewLetterA11yHint')}
        />
      </Box>
    </ScrollView>
  )
}

export default BenefitSummaryServiceVerification
