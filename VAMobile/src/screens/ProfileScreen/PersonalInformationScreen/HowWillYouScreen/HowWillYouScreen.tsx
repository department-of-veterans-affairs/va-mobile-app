import { ScrollView } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import React, { FC, useEffect } from 'react'

import { Box, TextArea, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { ProfileStackParamList } from '../../ProfileScreen'
import { generateTestID } from 'utils/common'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'

type HowWillYouScreenProps = StackScreenProps<ProfileStackParamList, 'HowDoIUpdate'>

const HowWillYouScreen: FC<HowWillYouScreenProps> = ({ navigation }) => {
  const t = useTranslation(NAMESPACE.PROFILE)
  const theme = useTheme()

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => <TextView accessibilityLabel={t('howWillYou.title')} accessibilityRole="header" />,
    })
  })

  return (
    <ScrollView {...testIdProps(generateTestID(t('howWillYou.title'), ''))}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom}>
        <TextArea>
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            {t('personalInformation.howWillYouUseContactInfo')}
          </TextView>
          <TextView variant="MobileBody" mt={theme.dimensions.marginBetween}>
            {t('howWillYou.useInfo')}
          </TextView>
        </TextArea>
      </Box>
    </ScrollView>
  )
}

export default HowWillYouScreen
