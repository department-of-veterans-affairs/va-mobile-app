import React, { ReactNode, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal, Pressable, PressableProps, View, ViewStyle, useWindowDimensions } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Icon } from '@department-of-veterans-affairs/mobile-component-library'

import { usePayments } from 'api/payments'
import { PaymentsData } from 'api/types'
import { Box, LinkWithAnalytics, TextView, VAScrollView } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { logAnalyticsEvent } from 'utils/analytics'
import { getFormattedDate } from 'utils/formattingUtils'
import { useRouteNavigation, useTheme } from 'utils/hooks'

export type PaymentBreakdownModalProps = {
  /** Boolean to show or hide the modal */
  visible: boolean
  /** Function to set modal visibility */
  setVisible: (value: boolean) => void
}
const MODAL_GUTTER = 16
const MAX_WIDTH = 400

/**
 * Payment Breakdown Modal that shows the breakdown of payments from the last recurring payment
 */
const PaymentBreakdownModal = ({ visible, setVisible }: PaymentBreakdownModalProps) => {
  const insets = useSafeAreaInsets()
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const paymentHistoryQuery = usePayments('', 1)
  const windowWidth = useWindowDimensions().width

  const lastPaymentAmount = useMemo(() => {
    if (paymentHistoryQuery.data?.meta.recurringPayment.amount) {
      return paymentHistoryQuery.data?.meta.recurringPayment.amount
    }
    return ''
  }, [paymentHistoryQuery.data])

  const lastPaymentDate = useMemo(() => {
    if (paymentHistoryQuery.data?.meta.recurringPayment.date) {
      return paymentHistoryQuery.data.meta.recurringPayment.date.substring(0, 10)
    }
    return ''
  }, [paymentHistoryQuery.data])

  const renderPaymentBreakdown = useCallback(() => {
    if (!paymentHistoryQuery.data?.meta.recurringPayment) {
      return null
    }

    // parse out the month
    const lastPaymentDateYYYYDDMM = getFormattedDate(lastPaymentDate, 'yyyy-MM-dd')
    const paymentsByLastDate: PaymentsData[] = paymentHistoryQuery.data?.paymentsByDate?.[lastPaymentDateYYYYDDMM] || []
    const payments: ReactNode[] = []
    paymentsByLastDate.forEach((payment, idx) => {
      payments.push(
        <Box flexDirection="row" justifyContent="space-between" key={idx}>
          <TextView flex={1} variant="MobileBody">
            {payment.attributes.paymentType}
          </TextView>
          <TextView variant="MobileBody">{payment.attributes.amount}</TextView>
        </Box>,
      )
    })

    return payments
  }, [paymentHistoryQuery.data, lastPaymentDate])

  const onCancel = () => {
    setVisible(false)
  }

  const pressableProps: PressableProps = {
    onPress: onCancel,
    accessibilityRole: 'button',
    accessibilityHint: t('paymentBreakdownModal.close.a11yHint'),
  }

  const scrollStyles: ViewStyle = {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: theme.colors.background.textBox,
  }

  return (
    <View>
      <Modal
        animationType="fade"
        transparent={true}
        statusBarTranslucent={true}
        visible={visible}
        supportedOrientations={['portrait', 'landscape']}
        onRequestClose={onCancel}>
        <Box
          flex={1}
          width={'100%'}
          flexDirection="column"
          accessibilityViewIsModal={true}
          justifyContent={'center'}
          alignItems={'center'}>
          <Box width={'100%'} height={'100%'} backgroundColor="modalOverlay" opacity={0.3} position={'absolute'} />
          <Box
            backgroundColor={'alertBox'}
            borderRadius={5}
            width={windowWidth >= MAX_WIDTH ? MAX_WIDTH : windowWidth}
            maxHeight={'50%'}
            ml={insets.left}
            mr={insets.right}
            mx={theme.dimensions.gutter}>
            <Box
              borderColor={'primary'}
              borderBottomWidth={1}
              flexDirection="row"
              justifyContent="space-between"
              py={12}
              px={MODAL_GUTTER}>
              <TextView variant="MobileBodyBold" textAlign={'center'} allowFontScaling={false}>
                {t('paymentBreakdownModal.title')}
              </TextView>
              <Box justifyContent={'center'}>
                <Pressable {...pressableProps}>
                  <Icon name={'Close'} fill={'base'} width={30} height={30} />
                </Pressable>
              </Box>
            </Box>
            <VAScrollView contentContainerStyle={scrollStyles} removeInsets={true}>
              <Box p={MODAL_GUTTER}>
                <TextView variant="MobileBodyBold" allowFontScaling={false}>
                  {getFormattedDate(lastPaymentDate, 'MMMM d, yyyy')}
                </TextView>
                {renderPaymentBreakdown()}
                <Box flexDirection="row" justifyContent="space-between">
                  <TextView variant="MobileBodyBold">{t('paymentBreakdownModal.total')}</TextView>
                  <TextView variant="MobileBodyBold">{lastPaymentAmount}</TextView>
                </Box>
              </Box>
            </VAScrollView>
            <Box
              borderColor={'primary'}
              borderTopWidth={1}
              p={5}
              flexDirection="row"
              justifyContent="center"
              alignItems={'center'}
              py={12}
              px={MODAL_GUTTER}>
              <LinkWithAnalytics
                type="custom"
                text={t('paymentBreakdownModal.goToPaymentHistory')}
                icon={{ name: 'Launch', fill: 'default' }}
                onPress={() => {
                  onCancel()
                  navigateTo('PaymentsTab', {
                    screen: 'PaymentHistory',
                    // make it so that the initial parent screen renders so `back` navigates back to payment screen instead of home screen.
                    initial: false,
                  })
                }}
                testID="GoToPaymentHistoryTestID"
                analyticsOnPress={() => logAnalyticsEvent(Events.vama_goto_payment_hist())}
              />
            </Box>
          </Box>
        </Box>
      </Modal>
    </View>
  )
}

export default PaymentBreakdownModal
