import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { Button } from '@department-of-veterans-affairs/mobile-component-library'

import { useDownloadLetter, useLetterBeneficiaryData } from 'api/letters'
import { LetterTypeConstants, LettersDownloadParams } from 'api/types'
import { AlertBox, BasicError, Box, FeatureLandingTemplate, LoadingComponent, TextArea, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { BenefitsStackParamList } from 'screens/BenefitsScreen/BenefitsStackScreens'
import { testIdProps } from 'utils/accessibility'
import { generateTestID } from 'utils/common'
import { useTheme } from 'utils/hooks'

type GenericLetterProps = StackScreenProps<BenefitsStackParamList, 'GenericLetter'>

function GenericLetter({ navigation, route }: GenericLetterProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const { header, description, letterType, descriptionA11yLabel } = route.params
  const { data: letterBeneficiaryData } = useLetterBeneficiaryData()
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
    isLoading: downloading,
    isError: letterDownloadError,
    refetch: refetchLetter,
  } = useDownloadLetter(letterType, lettersOptions)

  const onViewLetter = () => {
    refetchLetter()
  }

  const letterDetails = (
    <Box mb={theme.dimensions.contentMarginBottom}>
      {letterType === LetterTypeConstants.serviceVerification && (
        <Box mb={theme.dimensions.standardMarginBetween}>
          <AlertBox border="informational">
            <TextView variant="MobileBody">{t('letters.serviceVerificationLetter.informational')}</TextView>
          </AlertBox>
        </Box>
      )}
      <TextArea>
        <TextView variant="MobileBodyBold" accessibilityRole="header">
          {header}
        </TextView>
        <TextView
          {...testIdProps(descriptionA11yLabel || description)}
          variant="MobileBody"
          mt={theme.dimensions.standardMarginBetween}
          paragraphSpacing={true}>
          {description}
        </TextView>
        <Button
          onPress={onViewLetter}
          label={t('letters.benefitService.viewLetter')}
          testID={t('letters.benefitService.viewLetter')}
        />
      </TextArea>
    </Box>
  )

  return (
    <FeatureLandingTemplate
      backLabel={t('letters.overview.viewLetters')}
      backLabelOnPress={navigation.goBack}
      title={t('letters.details.title')}
      {...testIdProps(`Letters: ${generateTestID(header, 'page')}`)}>
      {letterDownloadError ? (
        <BasicError
          onTryAgain={onViewLetter}
          messageText={t('letters.download.error')}
          buttonA11yHint={t('letters.download.tryAgain.a11y')}
        />
      ) : downloading ? (
        <LoadingComponent text={t('letters.loading')} />
      ) : (
        letterDetails
      )}
    </FeatureLandingTemplate>
  )
}

export default GenericLetter
