import { ScrollView } from 'react-native'
import React, { FC } from 'react'

import { AlertBox, Box, ErrorComponent, LoadingComponent, TextArea, TextView, VAButton } from 'components'
import { LetterTypeConstants } from 'store/api/types'
import { LettersState, StoreState } from 'store/reducers'
import { NAMESPACE } from 'constants/namespaces'
import { ScreenIDTypesConstants } from 'constants/screens'
import { downloadLetter } from 'store/actions'
import { testIdProps } from 'utils/accessibility'
import { useDispatch, useSelector } from 'react-redux'
import { useError, useTheme, useTranslation } from 'utils/hooks'

type LettersListScreenProps = {}

const ServiceVerificationLetter: FC<LettersListScreenProps> = ({}) => {
  const theme = useTheme()
  const t = useTranslation(NAMESPACE.PROFILE)
  const dispatch = useDispatch()
  const { downloading } = useSelector<StoreState, LettersState>((state) => state.letters)

  const onViewLetter = (): void => {
    dispatch(downloadLetter(LetterTypeConstants.serviceVerification, undefined, ScreenIDTypesConstants.SERVICE_VERIFICATION_LETTER_SCREEN_ID))
  }

  if (useError(ScreenIDTypesConstants.SERVICE_VERIFICATION_LETTER_SCREEN_ID)) {
    return <ErrorComponent />
  }

  if (downloading) {
    return <LoadingComponent text={t('letters.loading')} />
  }

  return (
    <ScrollView {...testIdProps('Service-Verification-Letter-Screen')}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom}>
        <TextArea>
          <TextView variant={'MobileBodyBold'} accessibilityRole="header">
            {t('letters.serviceVerificationLetter.header')}
          </TextView>
          <TextView variant={'MobileBody'} my={theme.dimensions.marginBetween}>
            {t('letters.serviceVerificationLetter.body')}
          </TextView>
          <AlertBox border="informational" background="cardBackground" text={t('letters.serviceVerificationLetter.informational')} />
          <Box mt={theme.dimensions.marginBetween}>
            <VAButton
              onPress={onViewLetter}
              label={t('letters.benefitService.viewLetter')}
              testID="view-letter"
              textColor="primaryContrast"
              backgroundColor="button"
              a11yHint={t('letters.serviceVerificationLetter.viewLetterA11yHint')}
            />
          </Box>
        </TextArea>
      </Box>
    </ScrollView>
  )
}

export default ServiceVerificationLetter
