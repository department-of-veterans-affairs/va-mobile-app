import { ScrollView } from 'react-native'
import React, { FC, useState } from 'react'

import { Box, ButtonDecoratorType, ButtonList, ButtonListItemObj, ClickForActionLink, TextArea, TextView, VAButton } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useTheme, useTranslation } from 'utils/hooks'

type BenefitSummaryServiceVerificationProps = {}

const BenefitSummaryServiceVerification: FC<BenefitSummaryServiceVerificationProps> = () => {
  const t = useTranslation(NAMESPACE.PROFILE)
  const theme = useTheme()

  const [includeMilitaryServiceInfoToggle, setIncludeMilitaryServiceInfoToggle] = useState(false)
  const [monthlyAwardToggle, setMonthlyAwardToggle] = useState(false)
  const [combinedServiceRatingToggle, setCombinedServiceRatingToggle] = useState(false)
  const [disabledDueToServiceToggle, setDisabledDueToServiceToggle] = useState(false)
  const [atLeastOneServiceDisabilityToggle, setAtLeastOneServiceDisabilityToggle] = useState(false)

  const militaryServiceInfoList: Array<ButtonListItemObj> = [
    { textIDs: [{ textID: 'letters.benefitService.dischargeType' }, { textID: 'letters.benefitService.dischargeType' }] },
    { textIDs: [{ textID: 'letters.benefitService.activeDutyStart' }, { textID: 'letters.benefitService.activeDutyStart' }] },
    { textIDs: [{ textID: 'letters.benefitService.separationDate' }, { textID: 'letters.benefitService.separationDate' }] },
  ]

  const includeMilitaryServiceInfoList: Array<ButtonListItemObj> = [
    {
      textIDs: 'letters.benefitService.includeMilitaryServiceInfo',
      onPress: () => setIncludeMilitaryServiceInfoToggle(!includeMilitaryServiceInfoToggle),
      decorator: ButtonDecoratorType.Switch,
      decoratorProps: { on: includeMilitaryServiceInfoToggle },
    },
  ]

  const benefitAndDisabilityToggleList: Array<ButtonListItemObj> = [
    {
      textIDs: [{ textID: 'letters.benefitService.monthlyAward', fieldObj: { awardAmount: '323.23', month: 'January', day: '15', year: '2015' } }],
      onPress: () => setMonthlyAwardToggle(!monthlyAwardToggle),
      decorator: ButtonDecoratorType.Switch,
      decoratorProps: { on: monthlyAwardToggle },
    },
    {
      textIDs: [{ textID: 'letters.benefitService.combinedServiceConnectingRating', fieldObj: { rating: '89' } }],
      onPress: () => setCombinedServiceRatingToggle(!combinedServiceRatingToggle),
      decorator: ButtonDecoratorType.Switch,
      decoratorProps: { on: combinedServiceRatingToggle },
    },
    {
      textIDs: [{ textID: 'letters.benefitService.disabledDueToService' }],
      onPress: () => setDisabledDueToServiceToggle(!disabledDueToServiceToggle),
      decorator: ButtonDecoratorType.Switch,
      decoratorProps: { on: disabledDueToServiceToggle },
    },
    {
      textIDs: [{ textID: 'letters.benefitService.oneOrMoreServiceDisabilities' }],
      onPress: () => setAtLeastOneServiceDisabilityToggle(!atLeastOneServiceDisabilityToggle),
      decorator: ButtonDecoratorType.Switch,
      decoratorProps: { on: atLeastOneServiceDisabilityToggle },
    },
  ]

  const onViewLetter = (): void => {}

  return (
    <ScrollView>
      <Box mt={theme.dimensions.gutter}>
        <TextArea>
          <TextView variant="MobileBodyBold">{t('letters.benefitService.title')}</TextView>
          <TextView variant="MobileBody" mt={17} mb={3}>
            {t('letters.benefitService.summary')}
          </TextView>
        </TextArea>

        <TextView variant="MobileBodyBold" m={theme.dimensions.gutter}>
          {t('letters.benefitService.pleaseChooseIncludedInformation')}
        </TextView>

        <TextView variant="TableHeaderBold" mx={theme.dimensions.gutter} mb={10}>
          {t('letters.benefitService.militaryServiceInformation')}
        </TextView>
        <ButtonList items={militaryServiceInfoList} translationNameSpace={NAMESPACE.PROFILE} />
        <TextView variant="TableFooterLabel" mx={20} my={9}>
          {t('letters.benefitService.ourRecordsShow')}
        </TextView>
        <ButtonList items={includeMilitaryServiceInfoList} translationNameSpace={NAMESPACE.PROFILE} />

        <TextView variant="TableHeaderBold" mt={23} mx={theme.dimensions.gutter} mb={10}>
          {t('letters.benefitService.benefitAndDisabilityInfo')}
        </TextView>
        <ButtonList items={benefitAndDisabilityToggleList} translationNameSpace={NAMESPACE.PROFILE} />

        <TextView variant="MobileBody" m={theme.dimensions.gutter}>
          {t('letters.benefitService.sendMessageIfIncorrectInfo')}
        </TextView>

        <Box ml={theme.dimensions.gutter} mb={theme.dimensions.gutter}>
          <ClickForActionLink displayedText={t('letters.benefitService.sendMessage')} linkType="url" numberOrUrlLink={'https://iris.custhelp.va.gov/app/ask'} />
        </Box>

        <VAButton onPress={onViewLetter} label={t('letters.benefitService.viewLetter')} testID={'view-letter'} textColor="primaryContrast" backgroundColor="button" />
      </Box>
    </ScrollView>
  )
}

export default BenefitSummaryServiceVerification
