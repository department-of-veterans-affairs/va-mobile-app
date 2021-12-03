import { StackScreenProps } from '@react-navigation/stack'
import React, { FC, useEffect } from 'react'

import { Box, ClickToCallPhoneNumber, TextArea, TextView, VAScrollView } from 'components'
import { CrisisLineCta } from 'components'
import { HomeStackParamList } from '../HomeStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { testIdProps } from 'utils/accessibility'
import { useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'
import HeaderTitle from 'components/HeaderTitle'

type ContactVAScreenProps = StackScreenProps<HomeStackParamList, 'ContactVA'>

/**
 * View for Contact VA screen
 *
 * Returns ContactVAScreen component
 */
const ContactVAScreen: FC<ContactVAScreenProps> = ({ navigation }) => {
  const theme = useTheme()
  const t = useTranslation(NAMESPACE.HOME)
  const navigateTo = useRouteNavigation()

  useEffect(() => {
    navigation.setOptions({
      // using react-navigation internal HeaderTitle component to easily maintain font and styling while being able to add an accessibilityLabel
      headerTitle: (header) => <HeaderTitle {...testIdProps(t('contactVA.title.a11yLabel'))} headerTitle={header.children} />,
    })
  })

  const onCrisisLine = navigateTo('VeteransCrisisLine')

  const standardMarginBetween = theme.dimensions.standardMarginBetween / 2

  return (
    <VAScrollView {...testIdProps('Contact-V-A-page')}>
      <Box flex={1} mb={theme.dimensions.contentMarginBottom}>
        <CrisisLineCta onPress={onCrisisLine} />
        <TextArea>
          <TextView color="primary" variant="MobileBodyBold" accessibilityLabel={t('contactVA.va411.callMy.a11yLabel')} accessibilityRole="header">
            {t('contactVA.va411.callMy')}
          </TextView>
          <TextView color="primary" variant="MobileBody" my={standardMarginBetween} accessibilityLabel={t('contactVA.va411.body.a11yLabel')}>
            {t('contactVA.va411.body')}
          </TextView>
          <ClickToCallPhoneNumber phone={t('contactVA.va411.numberDisplayed')} />
        </TextArea>
      </Box>
    </VAScrollView>
  )
}

export default ContactVAScreen
