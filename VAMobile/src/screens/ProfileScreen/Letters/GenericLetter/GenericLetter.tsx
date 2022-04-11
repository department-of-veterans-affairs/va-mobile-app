import { StackScreenProps } from '@react-navigation/stack'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { AlertBox, BasicError, Box, ButtonTypesConstants, LoadingComponent, TextArea, TextView, VAButton, VAScrollView } from 'components'
import { LetterTypeConstants } from 'store/api/types'
import { LettersState, downloadLetter } from 'store/slices'
import { NAMESPACE } from 'constants/namespaces'
import { ProfileStackParamList } from '../../ProfileStackScreens'
import { RootState } from 'store'
import { generateTestID } from 'utils/common'
import { testIdProps } from 'utils/accessibility'
import { useAppDispatch, useTheme } from 'utils/hooks'
import { useSelector } from 'react-redux'

type GenericLetterProps = StackScreenProps<ProfileStackParamList, 'GenericLetter'>

const GenericLetter: FC<GenericLetterProps> = ({ route }) => {
  const { t } = useTranslation(NAMESPACE.PROFILE)
  const theme = useTheme()
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
    return <LoadingComponent text={t('letters.loading')} />
  }

  return (
    <VAScrollView {...testIdProps(`Letters: ${generateTestID(header, 'page')}`)}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom}>
        {letterType === LetterTypeConstants.serviceVerification && (
          <Box mb={theme.dimensions.standardMarginBetween} mx={theme.dimensions.gutter}>
            <AlertBox border="informational" text={t('letters.serviceVerificationLetter.informational')} />
          </Box>
        )}
        <TextArea>
          <TextView variant="MobileBodyBold" color={'primaryTitle'} accessibilityRole="header">
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
    </VAScrollView>
  )
}

export default GenericLetter
