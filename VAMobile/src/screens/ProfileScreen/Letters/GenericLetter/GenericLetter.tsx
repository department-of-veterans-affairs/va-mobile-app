import { ScrollView } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'
import { useSelector } from 'react-redux'
import React, { FC } from 'react'

import { Box, ErrorComponent, LoadingComponent, TextArea, TextView, VAButton } from 'components'
import { LettersState, StoreState } from 'store/reducers'
import { NAMESPACE } from 'constants/namespaces'
import { ProfileStackParamList } from '../../ProfileScreen'
import { testIdProps } from 'utils/accessibility'
import { useError, useTheme, useTranslation } from 'utils/hooks'

type GenericLetterProps = StackScreenProps<ProfileStackParamList, 'GenericLetter'>

const GenericLetter: FC<GenericLetterProps> = ({ route }) => {
  const t = useTranslation(NAMESPACE.PROFILE)
  const theme = useTheme()
  const { header, description, screenID, descriptionA11yLabel } = route.params
  const { downloading } = useSelector<StoreState, LettersState>((state) => state.letters)

  if (useError(screenID)) {
    return <ErrorComponent />
  }

  if (downloading) {
    return <LoadingComponent text={t('letters.loading')} />
  }

  const onViewLetter = (): void => {}

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
