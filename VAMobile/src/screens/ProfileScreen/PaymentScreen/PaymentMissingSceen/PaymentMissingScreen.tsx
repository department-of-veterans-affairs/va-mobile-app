import { StackScreenProps } from '@react-navigation/stack'
import { useTranslation } from 'react-i18next'
import React, { FC, useEffect } from 'react'

import { Box, ClickToCallPhoneNumber, TextArea, TextView, VAScrollView } from 'components'
import { HiddenTitle } from 'styles/common'
import { NAMESPACE } from 'constants/namespaces'
import { ProfileStackParamList } from 'screens/ProfileScreen/ProfileStackScreens'
import { testIdProps } from 'utils/accessibility'
import { useTheme } from 'utils/hooks'

type PaymentMissingScreenProps = StackScreenProps<ProfileStackParamList, 'PaymentMissing'>

const PaymentMissing: FC<PaymentMissingScreenProps> = ({ navigation }) => {
  const { t } = useTranslation(NAMESPACE.PROFILE)
  const { t: tc } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const { contentMarginTop, noLettersPaddingY } = theme.dimensions

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <HiddenTitle accessibilityLabel={t('payments.missingPayments.pageTitle')} accessibilityRole="header">
          {t('payments.missingPayments.pageTitle')}
        </HiddenTitle>
      ),
    })
  })

  return (
    <VAScrollView {...testIdProps('payment-missing-page')}>
      <Box mt={contentMarginTop}>
        <TextArea>
          <TextView variant="MobileBodyBold" color={'primaryTitle'} accessibilityRole="header">
            {t('payments.ifIAmMissingPayemt')}
          </TextView>
          <TextView variant="MobileBody" py={noLettersPaddingY}>
            {t('payments.missingPayments.body')}
          </TextView>
          <ClickToCallPhoneNumber phone={tc('8008271000')} displayedText={tc('8008271000.displayText')} />
        </TextArea>
      </Box>
    </VAScrollView>
  )
}

export default PaymentMissing
