import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { AlertWithHaptics, Box, ClickToCallPhoneNumber, FeatureLandingTemplate, TextArea, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { PaymentsStackParamList } from 'screens/PaymentsScreen/PaymentsStackScreens'
import { displayedTextPhoneNumber } from 'utils/formattingUtils'
import { useTheme } from 'utils/hooks'

type HowToUpdateDirectDepositScreenProps = StackScreenProps<PaymentsStackParamList, 'HowToUpdateDirectDeposit'>

/**
 * Screen for displaying information on updating direct deposit information for MHV/DS logon users
 */
function HowToUpdateDirectDepositScreen({ navigation }: HowToUpdateDirectDepositScreenProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const standardMarginBetween = theme.dimensions.standardMarginBetween

  return (
    <>
      <FeatureLandingTemplate
        backLabel={t('payments.title')}
        backLabelOnPress={navigation.goBack}
        title={t('directDeposit.title')}>
        <AlertWithHaptics
          variant="warning"
          header={t('howToUpdateDirectDeposit.alert.title')}
          description={t('howToUpdateDirectDeposit.alert.body.1')}>
          <TextView variant="MobileBody" mt={theme.dimensions.contentMarginTop}>
            {t('howToUpdateDirectDeposit.alert.body.2')}
          </TextView>
        </AlertWithHaptics>
        <Box mt={standardMarginBetween} mb={theme.dimensions.contentMarginBottom}>
          <TextArea>
            <TextView
              variant="MobileBodyBold"
              accessibilityRole="header"
              accessibilityLabel={t('veteransCrisisLine.weAreHereForYou.a11yLabel')}>
              {t('howToUpdateDirectDeposit.card.title')}
            </TextView>
            <TextView mt={standardMarginBetween} variant="MobileBody" paragraphSpacing={true}>
              {t('howToUpdateDirectDeposit.card.callUs')}
            </TextView>
            <ClickToCallPhoneNumber phone={t('8008271000')} displayedText={displayedTextPhoneNumber(t('8008271000'))} />
          </TextArea>
        </Box>
      </FeatureLandingTemplate>
    </>
  )
}

export default HowToUpdateDirectDepositScreen
