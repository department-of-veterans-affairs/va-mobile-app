import { StackScreenProps } from '@react-navigation/stack'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { AlertBox, BasicError, Box, ButtonTypesConstants, FeatureLandingTemplate, LoadingComponent, TextArea, TextView, VAButton } from 'components'
import { BenefitsStackParamList } from 'screens/BenefitsScreen/BenefitsStackScreens'
import { LetterTypeConstants } from 'store/api/types'
import { LettersState, downloadLetter } from 'store/slices'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { generateTestID } from 'utils/common'
import { testIdProps } from 'utils/accessibility'
import { useAppDispatch, useTheme } from 'utils/hooks'
import { useSelector } from 'react-redux'

type GenericLetterProps = StackScreenProps<BenefitsStackParamList, 'GenericLetter'>

const GenericLetter: FC<GenericLetterProps> = ({ navigation, route }) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const { header, description, letterType, descriptionA11yLabel } = route.params
  const { downloading, letterDownloadError } = useSelector<RootState, LettersState>((state) => state.letters)

  const onViewLetter = (): void => {
    dispatch(downloadLetter(letterType))
  }

  if (letterDownloadError) {
    return (
      <FeatureLandingTemplate backLabel={t('letters.overview.viewLetters')} backLabelOnPress={navigation.goBack} title={t('letters.details.title')}>
        <BasicError onTryAgain={onViewLetter} messageText={t('letters.download.error')} buttonA11yHint={t('letters.download.tryAgain.a11y')} />
      </FeatureLandingTemplate>
    )
  }

  if (downloading) {
    return (
      <FeatureLandingTemplate backLabel={t('letters.overview.viewLetters')} backLabelOnPress={navigation.goBack} title={t('letters.details.title')}>
        <LoadingComponent text={t('letters.loading')} />
      </FeatureLandingTemplate>
    )
  }

  return (
    <FeatureLandingTemplate
      backLabel={t('letters.overview.viewLetters')}
      backLabelOnPress={navigation.goBack}
      title={t('letters.details.title')}
      {...testIdProps(`Letters: ${generateTestID(header, 'page')}`)}>
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
          <TextView {...testIdProps(descriptionA11yLabel || description)} variant="MobileBody" mt={theme.dimensions.standardMarginBetween} paragraphSpacing={true}>
            {description}
          </TextView>
          <VAButton
            onPress={onViewLetter}
            label={t('letters.benefitService.viewLetter')}
            testID={t('letters.benefitService.viewLetter')}
            buttonType={ButtonTypesConstants.buttonPrimary}
          />
        </TextArea>
      </Box>
    </FeatureLandingTemplate>
  )
}

export default GenericLetter
