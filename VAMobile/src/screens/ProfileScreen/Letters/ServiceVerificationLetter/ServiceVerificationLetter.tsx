import { ScrollView } from 'react-native'
import React, { FC } from 'react'

import { AlertBox, Box, TextArea, TextView, VAButton } from 'components'
import { LetterTypeConstants } from 'store/api/types'
import { LettersState, StoreState } from 'store/reducers'
import { NAMESPACE } from 'constants/namespaces'
import { downloadLetter } from 'store/actions'
import { testIdProps } from 'utils/accessibility'
import { useDispatch, useSelector } from 'react-redux'
import { useTheme, useTranslation } from 'utils/hooks'
import LettersLoadingScreen from '../LettersLoadingScreen'

type LettersListScreenProps = {}

const ServiceVerificationLetter: FC<LettersListScreenProps> = ({}) => {
  const theme = useTheme()
  const t = useTranslation(NAMESPACE.PROFILE)
  const dispatch = useDispatch()
  const { downloading } = useSelector<StoreState, LettersState>((state) => state.letters)

  // TODO download and viewing the letter
  const onViewLetter = (): void => {
    dispatch(downloadLetter(LetterTypeConstants.serviceVerification))
  }

  if (downloading) {
    return <LettersLoadingScreen />
  }

  return (
    <ScrollView {...testIdProps('Service-Verification-Letter-Screen')}>
      <Box mt={theme.dimensions.contentMarginTop}>
        <TextArea>
          <TextView variant={'MobileBodyBold'} accessibilityRole="header">
            {t('letters.serviceVerificationLetter.header')}
          </TextView>
          <TextView variant={'MobileBody'} my={theme.dimensions.marginBetween}>
            {t('letters.serviceVerificationLetter.body')}
          </TextView>
          <AlertBox border="informational" background="informational" text={t('letters.serviceVerificationLetter.informational')} />
          <VAButton
            onPress={onViewLetter}
            label={t('letters.benefitService.viewLetter')}
            testID="view-letter"
            textColor="primaryContrast"
            backgroundColor="button"
            a11yHint={t('letters.serviceVerificationLetter.viewLetterA11yHint')}
          />
        </TextArea>
      </Box>
    </ScrollView>
  )
}

export default ServiceVerificationLetter
