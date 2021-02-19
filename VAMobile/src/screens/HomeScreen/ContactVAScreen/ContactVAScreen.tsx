import { Animated, ScrollView, StyleProp, TextStyle } from 'react-native'
import { HeaderTitle, StackScreenProps } from '@react-navigation/stack'
import React, { FC, useEffect } from 'react'

import { Box, ClickForActionLink, LinkTypeOptionsConstants, TextArea, TextView } from 'components'
import { CrisisLineCta } from 'components'
import { HomeStackParamList } from '../HomeStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { a11yHintProp, testIdProps } from 'utils/accessibility'
import { useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'

type ContactVAScreenProps = StackScreenProps<HomeStackParamList, 'ContactVA'>

type HeaderTitleType = {
  children?: string
  tintColor?: string
  style?: Animated.WithAnimatedValue<StyleProp<TextStyle>>
}

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
      headerTitle: (header: HeaderTitleType) => <HeaderTitle {...header} accessibilityLabel={t('contactVA.title.a11yLabel')} />,
    })
  })

  const onCrisisLine = navigateTo('VeteransCrisisLine')

  const marginBetween = theme.dimensions.marginBetween / 2

  return (
    <ScrollView {...testIdProps('Contact-V-A-page')}>
      <Box flex={1} mb={theme.dimensions.contentMarginBottom}>
        <CrisisLineCta onPress={onCrisisLine} />
        <TextArea>
          <TextView color="primary" variant="MobileBodyBold" accessibilityLabel={t('contactVA.va311.a11yLabel')}>
            {t('contactVA.va311')}
          </TextView>
          <TextView color="primary" variant="MobileBody" my={marginBetween} accessibilityLabel={t('contactVA.va311.body.a11yLabel')}>
            {t('contactVA.va311.body')}
          </TextView>
          <ClickForActionLink
            displayedText={t('contactVA.va311.numberDisplayed')}
            numberOrUrlLink={t('contactVA.va311.number')}
            linkType={LinkTypeOptionsConstants.call}
            {...a11yHintProp(t('contactVA.number.a11yHint'))}
            accessibilityLabel={t('contactVA.va311.number.a11yLabel')}
          />
          <TextView color="primary" variant="MobileBody" my={marginBetween}>
            {t('contactVA.tty.body')}
          </TextView>
          <ClickForActionLink
            displayedText={t('contactVA.tty.number')}
            numberOrUrlLink={t('contactVA.tty.number')}
            linkType={LinkTypeOptionsConstants.call}
            {...a11yHintProp(t('contactVA.number.a11yHint'))}
          />
        </TextArea>
      </Box>
    </ScrollView>
  )
}

export default ContactVAScreen
