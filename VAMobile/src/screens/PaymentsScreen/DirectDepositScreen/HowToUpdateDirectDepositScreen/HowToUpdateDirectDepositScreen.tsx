import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { AlertBox, Box, ClickToCallPhoneNumber, FeatureLandingTemplate, TextArea, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { PaymentsStackParamList } from 'screens/PaymentsScreen/PaymentsStackScreens'
import { StackScreenProps } from '@react-navigation/stack'
import { displayedTextPhoneNumber } from 'utils/formattingUtils'
import { useTheme } from 'utils/hooks'

type HowToUpdateDirectDepositScreenProps = StackScreenProps<PaymentsStackParamList, 'HowToUpdateDirectDeposit'>

/**
 * Screen for displaying information on updating direct deposit information for MHV/DS logon users
 */
const HowToUpdateDirectDepositScreen: FC<HowToUpdateDirectDepositScreenProps> = ({ navigation }) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const standardMarginBetween = theme.dimensions.standardMarginBetween

  return (
    <>
      <FeatureLandingTemplate backLabel={t('payments.title')} backLabelOnPress={navigation.goBack} title={t('directDeposit.title')}>
        <AlertBox border="warning">
          <TextView variant="MobileBodyBold" accessibilityRole="header" paragraphSpacing={true}>
            {t('howToUpdateDirectDeposit.alert.title')}
          </TextView>
          <TextView variant="MobileBody" paragraphSpacing={true}>
            {t('howToUpdateDirectDeposit.alert.body.1')}
          </TextView>
          <TextView variant="MobileBody">{t('howToUpdateDirectDeposit.alert.body.2')}</TextView>
        </AlertBox>
        <Box mt={standardMarginBetween} mb={theme.dimensions.contentMarginBottom}>
          <TextArea>
            <TextView variant="MobileBodyBold" accessibilityRole="header" accessibilityLabel={t('veteransCrisisLine.weAreHereForYou.a11yLabel')}>
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
