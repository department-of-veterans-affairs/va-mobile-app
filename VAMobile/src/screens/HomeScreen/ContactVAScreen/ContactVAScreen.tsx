import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { Box, ClickToCallPhoneNumber, CrisisLineButton, FeatureLandingTemplate, TextArea, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelID, a11yLabelVA } from 'utils/a11yLabel'
import { displayedTextPhoneNumber } from 'utils/formattingUtils'
import { useTheme } from 'utils/hooks'

import { HomeStackParamList } from '../HomeStackScreens'

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
      backLabel={t('home.title')}
      backLabelOnPress={navigation.goBack}
      title={t('contactVA.title')}
      titleA11y={a11yLabelVA(t('contactVA.title'))}>
      <Box flex={1} mb={theme.dimensions.contentMarginBottom}>
        <CrisisLineButton />
        <TextArea>
          <TextView
            variant="MobileBodyBold"
            accessibilityLabel={a11yLabelVA(t('contactVA.va411.callMy.a11yLabel'))}
            accessibilityRole="header">
            {t('contactVA.va411.callMy')}
          </TextView>
          <TextView
            variant="MobileBody"
            mt={standardMarginBetween}
            paragraphSpacing={true}
            accessibilityLabel={a11yLabelVA(t('contactVA.va411.body.a11yLabel'))}>
            {t('contactVA.va411.body')}
          </TextView>
          <ClickToCallPhoneNumber
            displayedText={displayedTextPhoneNumber(t('8006982411'))}
            phone={t('8006982411')}
            a11yLabel={a11yLabelID(t('8006982411'))}
          />
        </TextArea>
      </Box>
    </FeatureLandingTemplate>
  )
}

export default ContactVAScreen
