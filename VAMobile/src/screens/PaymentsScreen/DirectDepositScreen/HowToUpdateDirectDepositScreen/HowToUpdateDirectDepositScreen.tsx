import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { AlertBox, Box, ClickToCallPhoneNumber, FeatureLandingTemplate, TextArea, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { PaymentsStackParamList } from 'screens/PaymentsScreen/PaymentsStackScreens'
import { StackScreenProps } from '@react-navigation/stack'
import { useTheme } from 'utils/hooks'

type HowToUpdateDirectDepositScreenProps = StackScreenProps<PaymentsStackParamList, 'HowToUpdateDirectDeposit'>

/**
 * Screen for displaying information on updating direct deposit information for MHV/DS logon users
 */
const HowToUpdateDirectDepositScreen: FC<HowToUpdateDirectDepositScreenProps> = ({ navigation }) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  return (
    <>
      <FeatureLandingTemplate backLabel={t('payments.title')} backLabelOnPress={navigation.goBack} title={t('directDeposit.title')}>
        <Box mt={theme?.dimensions?.standardMarginBetween}>
          <AlertBox title={t('howToUpdateDirectDeposit.alert.title')} border="warning" text={t('howToUpdateDirectDeposit.alert.body')} />
        </Box>
        <Box mt={theme?.dimensions?.standardMarginBetween} mb={theme?.dimensions?.contentMarginBottom}>
          <TextArea>
            <TextView variant="MobileBodyBold" accessibilityRole="header" accessibilityLabel={t('veteransCrisisLine.weAreHereForYou.a11yLabel')}>
              {t('howToUpdateDirectDeposit.card.title')}
            </TextView>
            <Box mt={theme?.dimensions?.standardMarginBetween}>
              <TextView variant="MobileBody">{t('howToUpdateDirectDeposit.card.callUs')}</TextView>
            </Box>
            <ClickToCallPhoneNumber phone={t('8008271000')} displayedText={t('8008271000.displayText')} />
          </TextArea>
        </Box>
      </FeatureLandingTemplate>
    </>
  )
}

export default HowToUpdateDirectDepositScreen
