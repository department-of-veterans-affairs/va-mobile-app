import { StackScreenProps } from '@react-navigation/stack'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { AlertBox, BasicError, Box, ButtonTypesConstants, FeatureLandingTemplate, LoadingComponent, TextArea, TextView, VAButton } from 'components'
import { BenefitsStackParamList } from 'screens/BenefitsScreen/BenefitsStackScreens'
import { LetterTypeConstants } from 'store/api/types'
import { LettersState, downloadLetter } from 'store/slices'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { VATheme } from 'styles/theme'
import { generateTestID } from 'utils/common'
import { testIdProps } from 'utils/accessibility'
import { useAppDispatch } from 'utils/hooks'
import { useSelector } from 'react-redux'
import { useTheme } from 'styled-components'

type GenericLetterProps = StackScreenProps<BenefitsStackParamList, 'GenericLetter'>

const GenericLetter: FC<GenericLetterProps> = ({ navigation, route }) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme() as VATheme
  const dispatch = useAppDispatch()
  const { header, description, letterType, descriptionA11yLabel } = route.params
  const { downloading, letterDownloadError } = useSelector<RootState, LettersState>((state) => state.letters)

  const onViewLetter = (): void => {
    dispatch(downloadLetter(letterType))
  }

  if (letterDownloadError) {
    return <BasicError onTryAgain={onViewLetter} messageText={t('letters.download.error')} buttonA11yHint={t('letters.download.tryAgain.a11y')} />
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
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom}>
        {letterType === LetterTypeConstants.serviceVerification && (
          <Box mb={theme.dimensions.standardMarginBetween}>
            <AlertBox border="informational" text={t('letters.serviceVerificationLetter.informational')} />
          </Box>
        )}
        <TextArea>
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            {header}
          </TextView>
          <TextView {...testIdProps(descriptionA11yLabel || description)} variant="MobileBody" my={theme.dimensions.standardMarginBetween}>
            {description}
          </TextView>
          <VAButton
            onPress={onViewLetter}
            label={t('letters.benefitService.viewLetter')}
            testID={t('letters.benefitService.viewLetter')}
            buttonType={ButtonTypesConstants.buttonPrimary}
            a11yHint={t('letters.serviceVerificationLetter.viewLetterA11yHint')}
          />
        </TextArea>
      </Box>
    </FeatureLandingTemplate>
  )
}

export default GenericLetter
