import { ScrollView } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC } from 'react'

import { AlertBox, BasicError, Box, ButtonTypesConstants, LoadingComponent, TextArea, TextView, VAButton } from 'components'
import { LetterTypeConstants } from 'store/api/types'
import { LettersState, StoreState } from 'store/reducers'
import { NAMESPACE } from 'constants/namespaces'
import { ProfileStackParamList } from '../../ProfileStackScreens'
import { downloadLetter } from 'store/actions'
import { generateTestID } from 'utils/common'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'

type GenericLetterProps = StackScreenProps<ProfileStackParamList, 'GenericLetter'>

const GenericLetter: FC<GenericLetterProps> = ({ route }) => {
  const t = useTranslation(NAMESPACE.PROFILE)
  const theme = useTheme()
  const dispatch = useDispatch()
  const { header, description, letterType, descriptionA11yLabel } = route.params
  const { downloading, letterDownloadError } = useSelector<StoreState, LettersState>((state) => state.letters)

  const onViewLetter = (): void => {
    dispatch(downloadLetter(letterType))
  }

  if (letterDownloadError) {
    return <BasicError onTryAgain={onViewLetter} messageText={t('letters.download.error')} buttonA11yHint={t('Try again to download your letter')} />
  }

  if (downloading) {
    return <LoadingComponent text={t('letters.loading')} />
  }

  return (
    <ScrollView {...testIdProps(`Letters: ${generateTestID(header, 'page')}`)}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom}>
        <TextArea>
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            {header}
          </TextView>
          <TextView {...testIdProps(descriptionA11yLabel || description)} variant="MobileBody" my={theme.dimensions.standardMarginBetween}>
            {description}
          </TextView>
          {letterType === LetterTypeConstants.serviceVerification && (
            <Box mb={theme.dimensions.standardMarginBetween}>
              <AlertBox border="informational" background="cardBackground" text={t('letters.serviceVerificationLetter.informational')} />
            </Box>
          )}
          <VAButton
            onPress={onViewLetter}
            label={t('letters.benefitService.viewLetter')}
            testID="view-letter"
            buttonType={ButtonTypesConstants.buttonPrimary}
            a11yHint={t('letters.serviceVerificationLetter.viewLetterA11yHint')}
          />
        </TextArea>
      </Box>
    </ScrollView>
  )
}

export default GenericLetter
