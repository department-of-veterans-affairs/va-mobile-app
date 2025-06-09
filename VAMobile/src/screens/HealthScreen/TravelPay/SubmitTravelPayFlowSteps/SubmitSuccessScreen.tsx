import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { DateTime } from 'luxon'

import { Box, LinkWithAnalytics, TextView, VAScrollView } from 'components'
import { useSubtaskProps } from 'components/Templates/MultiStepSubtask'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelVA } from 'utils/a11yLabel'
import getEnv from 'utils/env'
import { useOrientation, useTheme } from 'utils/hooks'

import { SubmitTravelPayFlowModalStackParamList } from '../SubmitMileageTravelPayScreen'

type SubmitSuccessScreenProps = StackScreenProps<SubmitTravelPayFlowModalStackParamList, 'SubmitSuccessScreen'>

const { LINK_URL_TRAVEL_PAY_SET_UP_DIRECT_DEPOSIT } = getEnv()

function SubmitSuccessScreen({ route, navigation }: SubmitSuccessScreenProps) {
  const { appointmentDateTime, facilityName } = route.params
  const { t } = useTranslation(NAMESPACE.COMMON)

  useSubtaskProps({
    rightButtonText: t('close'),
    onRightButtonPress: () => {
      navigation.getParent()?.goBack()
    },
    rightButtonTestID: 'rightCloseTestID',
  })

  const theme = useTheme()
  const isPortrait = useOrientation()

  return (
    <VAScrollView>
      <Box
        mb={theme.dimensions.contentMarginBottom}
        mx={isPortrait ? theme.dimensions.gutter : theme.dimensions.headerHeight}>
        <TextView testID="successTitleID" variant="BitterHeading" accessibilityRole="header">
          {t('travelPay.success.title')}
        </TextView>
        <TextView testID="successTextID" variant="MobileBody" mt={theme.dimensions.standardMarginBetween}>
          {t('travelPay.success.text', {
            facilityName,
            date: DateTime.fromISO(appointmentDateTime).toFormat('LLLL dd, yyyy'),
            time: DateTime.fromISO(appointmentDateTime).toFormat('h:mm a'),
          })}
        </TextView>
        <TextView testID="successNextTitleID" variant="MobileBodyBold" mt={theme.dimensions.standardMarginBetween}>
          {t('travelPay.success.nextTitle')}
        </TextView>
        <TextView testID="successNextTextID" variant="MobileBody">
          {t('travelPay.success.nextText')}
        </TextView>
        <Box mt={theme.dimensions.condensedMarginBetween}>
          <LinkWithAnalytics
            type="custom"
            text={t('travelPay.success.goToAppointment')}
            onPress={() => {
              navigation.getParent()?.goBack()
            }}
            testID="goToAppointmentLinkID"
          />
        </Box>
        <TextView testID="successNextText2ID" variant="MobileBody" mt={theme.dimensions.condensedMarginBetween}>
          {t('travelPay.success.nextText2')}
        </TextView>
        <Box mt={theme.dimensions.condensedMarginBetween}>
          <LinkWithAnalytics
            type="url"
            url={LINK_URL_TRAVEL_PAY_SET_UP_DIRECT_DEPOSIT}
            text={t('travelPay.setUpDirectDeposit.link')}
            a11yLabel={a11yLabelVA(t('travelPay.setUpDirectDeposit.link'))}
            testID="setUpDirectDepositLinkID"
          />
        </Box>
      </Box>
    </VAScrollView>
  )
}

export default SubmitSuccessScreen
