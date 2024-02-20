import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { StackScreenProps } from '@react-navigation/stack'

import { Button } from '@department-of-veterans-affairs/mobile-component-library'

import { AlertBox, BasicError, Box, FeatureLandingTemplate, LoadingComponent, TextArea, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { BenefitsStackParamList } from 'screens/BenefitsScreen/BenefitsStackScreens'
import { RootState } from 'store'
import { LetterTypeConstants } from 'store/api/types'
import { LettersState, downloadLetter } from 'store/slices'
import { testIdProps } from 'utils/accessibility'
import { generateTestID } from 'utils/common'
import { useAppDispatch, useTheme } from 'utils/hooks'

type GenericLetterProps = StackScreenProps<BenefitsStackParamList, 'GenericLetter'>

function GenericLetter({ navigation, route }: GenericLetterProps) {
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
      <FeatureLandingTemplate
        backLabel={t('letters.overview.viewLetters')}
        backLabelOnPress={navigation.goBack}
        title={t('letters.details.title')}>
        <BasicError
          onTryAgain={onViewLetter}
          messageText={t('letters.download.error')}
          buttonA11yHint={t('letters.download.tryAgain.a11y')}
        />
      </FeatureLandingTemplate>
    )
  }

  if (downloading) {
    return (
      <FeatureLandingTemplate
        backLabel={t('letters.overview.viewLetters')}
        backLabelOnPress={navigation.goBack}
        title={t('letters.details.title')}>
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
    </FeatureLandingTemplate>
  )
}

export default GenericLetter
