import { StackScreenProps } from '@react-navigation/stack'
import React, { FC, useEffect } from 'react'

import { Box, ClickToCallPhoneNumber, TextArea, TextView, VAScrollView } from 'components'
import { HiddenTitle } from 'styles/common'
import { NAMESPACE } from 'constants/namespaces'
import { ProfileStackParamList } from 'screens/ProfileScreen/ProfileStackScreens'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'

type PaymentIssueScreenProps = StackScreenProps<ProfileStackParamList, 'PaymentIssue'>

const PaymentIssue: FC<PaymentIssueScreenProps> = ({ navigation }) => {
  const t = useTranslation(NAMESPACE.PROFILE)
  const theme = useTheme()
  const { contentMarginTop, noLettersPaddingY } = theme.dimensions

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <HiddenTitle accessibilityLabel={t('paymentIssues.title')} accessibilityRole="header">
          {t('paymentIssues.title')}
        </HiddenTitle>
      ),
    })
  })

  return (
    <VAScrollView {...testIdProps('payment-issue-page')}>
      <Box mt={contentMarginTop}>
        <TextArea>
          <TextView variant="MobileBodyBold" color={'primaryTitle'} accessibilityRole="header">
            {t('payments.ifMyPaymentDoesNotLookRight')}
          </TextView>
          <TextView variant="MobileBody" py={noLettersPaddingY}>
            {t('paymentIssues.body')}
          </TextView>
          <ClickToCallPhoneNumber phone={t('common:8008271000')} displayedText={t('common:8008271000.displayText')} />
        </TextArea>
      </Box>
    </VAScrollView>
  )
}

export default PaymentIssue
