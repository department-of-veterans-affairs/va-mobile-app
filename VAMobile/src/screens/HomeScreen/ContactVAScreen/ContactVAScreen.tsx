import { ScrollView } from 'react-native'
import { StackHeaderLeftButtonProps, StackScreenProps } from '@react-navigation/stack'
import React, { FC, ReactNode, useEffect } from 'react'

import { BackButton, Box, ClickForActionLink, LinkTypeOptionsConstants, TextArea, TextView } from 'components'
import { HomeStackParamList } from '../HomeScreen'
import { NAMESPACE } from 'constants/namespaces'
import { a11yHintProp, testIdProps } from 'utils/accessibility'
import { useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'
import CrisisLineCta from '../CrisisLineCta'

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

  const onCrisisLine = navigateTo('VeteransCrisisLine')

  const marginBetween = theme.dimensions.marginBetween

  useEffect(() => {
    navigation.setOptions({
      headerLeft: (props: StackHeaderLeftButtonProps): ReactNode => (
        <BackButton onPress={props.onPress} canGoBack={props.canGoBack} i18nId={'back'} showCarat={true} a11yHint={t('contactVA.back.a11yHint')} />
      ),
    })
  })

  return (
    <ScrollView>
      <Box {...testIdProps('Contact-VA-screen')} flex={1} mb={theme.dimensions.contentMarginBottom}>
        <CrisisLineCta onPress={onCrisisLine} />
        <TextArea>
          <TextView color="primary" variant="MobileBodyBold">
            {t('contactVA.va311')}
          </TextView>
          <TextView color="primary" variant="MobileBody" my={marginBetween}>
            {t('contactVA.va311.body')}
          </TextView>
          <ClickForActionLink
            displayedText={t('contactVA.va311.numberDisplayed')}
            numberOrUrlLink={t('contactVA.va311.number')}
            linkType={LinkTypeOptionsConstants.call}
            {...a11yHintProp(t('contactVA.number.a11yHint'))}
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
