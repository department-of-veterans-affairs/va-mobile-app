import React from 'react'
import { useTranslation } from 'react-i18next'

import { NavigationProp, ParamListBase } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'

import { TFunction } from 'i18next'
import { DateTime } from 'luxon'

import { Box, LinkWithAnalytics, TextView, VAScrollView } from 'components'
import { useSubtaskProps } from 'components/Templates/MultiStepSubtask'
import { NAMESPACE } from 'constants/namespaces'
import { TravelPayPartialSuccessStatusConstants } from 'constants/travelPay'
import { SubmitTravelPayFlowModalStackParamList } from 'screens/HealthScreen/TravelPay/SubmitMileageTravelPayScreen'
import {
  FileOnBTSSSLink,
  SetUpDirectDepositWebLink,
} from 'screens/HealthScreen/TravelPay/SubmitTravelPayFlowSteps/components'
import { useOrientation, useTheme } from 'utils/hooks'

type SubmitSuccessScreenProps = StackScreenProps<SubmitTravelPayFlowModalStackParamList, 'SubmitSuccessScreen'>

interface SuccessScreenContent {
  title: string
  text: string
  nextText: string
  nextTitle: string
  nextText2: string
  linkText: string
  linkTestID: string
  linkComponent: React.ReactNode
}

const ContentSection = ({ title, text, nextText, nextTitle, nextText2, linkComponent }: SuccessScreenContent) => {
  const theme = useTheme()
  return (
    <>
      <TextView testID="successTitleID" variant="BitterHeading" accessibilityRole="header">
        {title}
      </TextView>
      <TextView testID="successTextID" variant="MobileBody" mt={theme.dimensions.standardMarginBetween}>
        {text}
      </TextView>
      <TextView testID="successNextTitleID" variant="MobileBodyBold" mt={theme.dimensions.standardMarginBetween}>
        {nextTitle}
      </TextView>
      <TextView testID="successNextTextID" variant="MobileBody">
        {nextText}
      </TextView>
      <Box mt={theme.dimensions.condensedMarginBetween}>{linkComponent}</Box>
      <TextView testID="successNextText2ID" variant="MobileBody" mt={theme.dimensions.condensedMarginBetween}>
        {nextText2}
      </TextView>
    </>
  )
}

const getContent = (
  t: TFunction,
  status: string,
  facilityName: string,
  appointmentDateTime: string,
  navigation: NavigationProp<ParamListBase, 'SubmitSuccessScreen'>,
): SuccessScreenContent => {
  const isPartialSuccess =
    status === TravelPayPartialSuccessStatusConstants.INCOMPLETE ||
    status === TravelPayPartialSuccessStatusConstants.SAVED
  if (isPartialSuccess) {
    return {
      title: t('travelPay.partialSuccess.title'),
      text: t('travelPay.partialSuccess.text'),
      nextText: t('travelPay.partialSuccess.nextText'),
      nextTitle: t('travelPay.success.nextTitle'),
      nextText2: t('travelPay.setUpDirectDeposit.eligible'),
      linkText: t('travelPay.partialSuccess.link'),
      linkTestID: 'finishTravelClaimLinkID',
      linkComponent: <FileOnBTSSSLink text={t('travelPay.partialSuccess.link')} testID="finishTravelClaimLinkID" />,
    }
  }

  return {
    title: t('travelPay.success.title'),
    text: t('travelPay.success.text', {
      facilityName,
      date: DateTime.fromISO(appointmentDateTime).toFormat('LLLL dd, yyyy'),
      time: DateTime.fromISO(appointmentDateTime).toFormat('h:mm a'),
    }),
    nextText: t('travelPay.success.nextText'),
    nextTitle: t('travelPay.success.nextTitle'),
    nextText2: t('travelPay.setUpDirectDeposit.eligible'),
    linkText: t('travelPay.success.goToAppointment'),
    linkTestID: 'goToAppointmentLinkID',
    linkComponent: (
      <LinkWithAnalytics
        type="custom"
        text={t('travelPay.success.goToAppointment')}
        onPress={() => {
          navigation.getParent()?.goBack()
        }}
        testID="goToAppointmentLinkID"
      />
    ),
  }
}

function SubmitSuccessScreen({ route, navigation }: SubmitSuccessScreenProps) {
  const { appointmentDateTime, facilityName, status } = route.params
  const { t } = useTranslation(NAMESPACE.COMMON)

  const handleClose = () => {
    // This screen lives in a MultiStepSubtask, so we need to get the parent to close the subtask
    navigation.getParent()?.goBack()
  }

  useSubtaskProps({
    rightButtonText: t('close'),
    onRightButtonPress: handleClose,
    rightButtonTestID: 'rightCloseTestID',
  })

  const theme = useTheme()
  const isPortrait = useOrientation()

  const content = getContent(t, status, facilityName, appointmentDateTime, navigation)

  return (
    <VAScrollView>
      <Box
        mb={theme.dimensions.contentMarginBottom}
        mx={isPortrait ? theme.dimensions.gutter : theme.dimensions.headerHeight}>
        <ContentSection {...content} />
        <Box mt={theme.dimensions.condensedMarginBetween}>
          <SetUpDirectDepositWebLink />
        </Box>
      </Box>
    </VAScrollView>
  )
}

export default SubmitSuccessScreen
