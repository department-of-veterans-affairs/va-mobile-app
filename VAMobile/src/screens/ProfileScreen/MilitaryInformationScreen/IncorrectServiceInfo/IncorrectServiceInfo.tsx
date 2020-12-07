import { ScrollView } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import React, { FC, useEffect } from 'react'

import { Box, ClickForActionLink, LinkTypeOptionsConstants, TextArea, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { ProfileStackParamList } from '../../ProfileScreen'
import { a11yHintProp, testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'

type IncorrectServiceInfoScreenProps = StackScreenProps<ProfileStackParamList, 'IncorrectServiceInfo'>

/**
 * View for What If screen
 *
 * Returns incorrectServiceInfoScreen component
 */
const IncorrectServiceInfo: FC<IncorrectServiceInfoScreenProps> = ({ navigation }) => {
  const t = useTranslation(NAMESPACE.PROFILE)
  const theme = useTheme()
  const marginBetween = theme.dimensions.marginBetween

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => <TextView accessibilityLabel={t('militaryInformation.incorrectServiceInfo.header')} accessibilityRole="header" />,
    })
  })

  return (
    <ScrollView {...testIdProps('Incorrect-Service-Info-screen')}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom}>
        <TextArea>
          <TextView color="primary" variant="MobileBodyBold" accessibilityRole="header">
            {t('militaryInformation.incorrectServiceInfo')}
          </TextView>
          <TextView color="primary" variant="MobileBody" my={marginBetween}>
            {t('militaryInformation.incorrectServiceInfo.body')}
          </TextView>
          <ClickForActionLink
            displayedText={t('militaryInformation.incorrectServiceInfo.DMDCNumberDisplayed')}
            numberOrUrlLink={t('militaryInformation.incorrectServiceInfo.DMDCNumber')}
            linkType={LinkTypeOptionsConstants.call}
            {...a11yHintProp(t('militaryInformation.incorrectServiceInfo.DMDCNumber.a11yHint'))}
          />
        </TextArea>
      </Box>
    </ScrollView>
  )
}

export default IncorrectServiceInfo
