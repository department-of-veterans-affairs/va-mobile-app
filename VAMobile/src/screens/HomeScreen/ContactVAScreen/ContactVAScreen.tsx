import { StackScreenProps } from '@react-navigation/stack'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { Box, ClickToCallPhoneNumber, FeatureLandingTemplate, TextArea, TextView } from 'components'
import { CrisisLineCta } from 'components'
import { HomeStackParamList } from '../HomeStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { useRouteNavigation, useTheme } from 'utils/hooks'

type ContactVAScreenProps = StackScreenProps<HomeStackParamList, 'ContactVA'>

/**
 * View for Contact VA screen
 *
 * Returns ContactVAScreen component
 */
const ContactVAScreen: FC<ContactVAScreenProps> = ({ navigation }) => {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.HOME)
  const { t: tc } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()

  const onCrisisLine = navigateTo('VeteransCrisisLine')

  const standardMarginBetween = theme.dimensions.standardMarginBetween / 2

  return (
    <FeatureLandingTemplate backLabel={tc('home')} backLabelOnPress={navigation.goBack} title={tc('contactVA')} titleA11y={tc('contactVA.a11y')}>
      <Box flex={1} mb={theme.dimensions.contentMarginBottom}>
        <CrisisLineCta onPress={onCrisisLine} />
        <TextArea>
          <TextView variant="MobileBodyBold" accessibilityLabel={t('contactVA.va411.callMy.a11yLabel')} accessibilityRole="header">
            {t('contactVA.va411.callMy')}
          </TextView>
          <TextView variant="MobileBody" my={standardMarginBetween} accessibilityLabel={t('contactVA.va411.body.a11yLabel')}>
            {t('contactVA.va411.body')}
          </TextView>
          <ClickToCallPhoneNumber phone={t('contactVA.va411.numberDisplayed')} />
        </TextArea>
      </Box>
    </FeatureLandingTemplate>
  )
}

export default ContactVAScreen
