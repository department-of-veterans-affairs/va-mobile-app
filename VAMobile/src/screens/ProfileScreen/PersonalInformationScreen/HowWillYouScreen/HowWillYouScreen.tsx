import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useTranslation } from 'react-i18next'
import React, { FC, useEffect } from 'react'

import { Box, TextArea, TextView, VAScrollView } from 'components'
import { HiddenTitle } from 'styles/common'
import { NAMESPACE } from 'constants/namespaces'
import { ProfileStackParamList } from '../../ProfileStackScreens'
import { generateTestID } from 'utils/common'
import { testIdProps } from 'utils/accessibility'
import { useTheme } from 'utils/hooks'

type HowWillYouScreenProps = StackScreenProps<ProfileStackParamList, 'HowDoIUpdate'>

const HowWillYouScreen: FC<HowWillYouScreenProps> = ({ navigation }) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <HiddenTitle accessibilityLabel={t('howWillYou.title')} accessibilityRole="header">
          {t('howWillYou.title')}
        </HiddenTitle>
      ),
    })
  })

  return (
    <VAScrollView {...testIdProps(generateTestID(t('howWillYou.title'), ''))}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom}>
        <TextArea>
          <TextView variant="MobileBodyBold" accessibilityRole="header" accessibilityLabel={t('personalInformation.howWillYouUseContactInfo.a11yLabel')}>
            {t('personalInformation.howWillYouUseContactInfo')}
          </TextView>
          <TextView variant="MobileBody" mt={theme.dimensions.standardMarginBetween}>
            {t('howWillYou.useInfo')}
          </TextView>
        </TextArea>
      </Box>
    </VAScrollView>
  )
}

export default HowWillYouScreen
