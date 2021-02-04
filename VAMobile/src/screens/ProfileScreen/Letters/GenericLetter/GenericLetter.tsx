import { ScrollView } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC } from 'react'

import { AlertBox, Box, ErrorComponent, LoadingComponent, TextArea, TextView, VAButton } from 'components'
import { LetterTypeConstants } from 'store/api/types'
import { LettersState, StoreState } from 'store/reducers'
import { NAMESPACE } from 'constants/namespaces'
import { ProfileStackParamList } from '../../ProfileStackScreens'
import { downloadLetter } from 'store/actions'
import { testIdProps } from 'utils/accessibility'
import { useError, useTheme, useTranslation } from 'utils/hooks'

type GenericLetterProps = StackScreenProps<ProfileStackParamList, 'GenericLetter'>

const GenericLetter: FC<GenericLetterProps> = ({ route }) => {
  const t = useTranslation(NAMESPACE.PROFILE)
  const theme = useTheme()
  const dispatch = useDispatch()
  const { header, description, letterType, screenID, descriptionA11yLabel } = route.params
  const { downloading } = useSelector<StoreState, LettersState>((state) => state.letters)

  if (useError(screenID)) {
    return <ErrorComponent />
  }

  if (downloading) {
    return <LoadingComponent text={t('letters.loading')} />
  }

  const onViewLetter = (): void => {
    dispatch(downloadLetter(letterType, undefined, screenID))
  }

  return (
    <ScrollView {...testIdProps(header)}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom}>
        <TextArea>
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            {header}
          </TextView>
          <TextView {...testIdProps(descriptionA11yLabel || description)} variant="MobileBody" my={theme.dimensions.marginBetween}>
            {description}
          </TextView>
          {letterType === LetterTypeConstants.serviceVerification && (
            <Box mb={theme.dimensions.marginBetween}>
              <AlertBox border="informational" background="cardBackground" text={t('letters.serviceVerificationLetter.informational')} />
            </Box>
          )}
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

export default GenericLetter
