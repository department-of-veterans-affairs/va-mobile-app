import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { Box, ClickToCallPhoneNumber, CrisisLineButton, FeatureLandingTemplate, TextArea, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { a11yLabelID, a11yLabelMyVA411, a11yLabelVA } from 'utils/a11yLabel'
import { displayedTextPhoneNumber } from 'utils/formattingUtils'
import { useTheme } from 'utils/hooks'

type ContactVAScreenProps = StackScreenProps<HomeStackParamList, 'ContactVA'>

/**
 * View for Contact VA screen
 *
 * Returns ContactVAScreen component
 */
function ContactVAScreen({ navigation }: ContactVAScreenProps) {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)

  const standardMarginBetween = theme.dimensions.standardMarginBetween / 2

  return (
    <FeatureLandingTemplate
      backLabelOnPress={navigation.goBack}
      title={t('contactVA.title')}
      titleA11y={a11yLabelVA(t('contactVA.title'))}>
      <Box flex={1} mb={theme.dimensions.contentMarginBottom}>
        <CrisisLineButton />
        <TextArea>
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            {t('contactVA.va411.callUs')}
          </TextView>
          <TextView variant="MobileBody" mt={standardMarginBetween} paragraphSpacing={true}>
            {t('contactVA.va411.body')}
          </TextView>
          {/*eslint-disable-next-line react-native-a11y/has-accessibility-hint*/}
          <TextView
            variant="MobileBodyBold"
            color="primary"
            accessibilityLabel={a11yLabelMyVA411(t('contactVA.va411.mainInfo'))}
            accessibilityRole="header">
            {t('contactVA.va411.mainInfo')}
          </TextView>
          <ClickToCallPhoneNumber
            displayedText={displayedTextPhoneNumber(t('8006982411'))}
            phone={t('8006982411')}
            a11yLabel={a11yLabelID(t('8006982411'))}
          />
          <TextView
            variant="MobileBodyBold"
            color="primary"
            accessibilityRole="header"
            mt={theme.dimensions.contentMarginTop}>
            {t('contactVA.va411.techSupport')}
          </TextView>
          <ClickToCallPhoneNumber
            displayedText={displayedTextPhoneNumber(t('8662793677'))}
            phone={t('8662793677')}
            a11yLabel={a11yLabelID(t('8662793677'))}
            ttyBypass={true}
          />
        </TextArea>
      </Box>
    </FeatureLandingTemplate>
  )
}

export default ContactVAScreen
