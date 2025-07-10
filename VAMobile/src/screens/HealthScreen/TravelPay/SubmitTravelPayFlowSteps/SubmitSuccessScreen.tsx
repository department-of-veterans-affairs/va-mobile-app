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
  /** Main heading text displayed at the top of the screen */
  heading: string
  /** Primary descriptive text explaining the main message */
  description: string
  /** Bold title for the instructional section */
  sectionTitle: string
  /** Instructional text describing the next steps or actions */
  instructionText: string
  /** React component that renders the primary action (link, button, etc.) */
  actionComponent: React.ReactNode
  /** Additional descriptive text displayed after the action component */
  additionalText: string
  /** Test ID for the action component used in automated testing */
  actionTestID: string
}

const ContentSection = ({ heading, description, instructionText, sectionTitle, additionalText, actionComponent }: SuccessScreenContent) => {
  const theme = useTheme()
  return (
    <>
      <TextView testID="successTitleID" variant="BitterHeading" accessibilityRole="header">
        {heading}
      </TextView>
      <TextView testID="successTextID" variant="MobileBody" mt={theme.dimensions.standardMarginBetween}>
        {description}
      </TextView>
      <TextView testID="successNextTitleID" variant="MobileBodyBold" mt={theme.dimensions.standardMarginBetween}>
        {sectionTitle}
      </TextView>
      <TextView testID="successNextTextID" variant="MobileBody">
        {instructionText}
      </TextView>
      <Box mt={theme.dimensions.condensedMarginBetween}>{actionComponent}</Box>
      <TextView testID="successNextText2ID" variant="MobileBody" mt={theme.dimensions.condensedMarginBetween}>
        {additionalText}
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
      heading: t('travelPay.partialSuccess.title'),
      description: t('travelPay.partialSuccess.text'),
      instructionText: t('travelPay.partialSuccess.nextText'),
      sectionTitle: t('travelPay.success.nextTitle'),
      additionalText: t('travelPay.setUpDirectDeposit.eligible'),
      actionTestID: 'finishTravelClaimLinkID',
      actionComponent: <FileOnBTSSSLink text={t('travelPay.partialSuccess.link')} testID="finishTravelClaimLinkID" />,
    }
  }

  return {
    heading: t('travelPay.success.title'),
    description: t('travelPay.success.text', {
      facilityName,
      date: DateTime.fromISO(appointmentDateTime).toFormat('LLLL dd, yyyy'),
      time: DateTime.fromISO(appointmentDateTime).toFormat('h:mm a'),
    }),
    instructionText: t('travelPay.success.nextText'),
    sectionTitle: t('travelPay.success.nextTitle'),
    additionalText: t('travelPay.setUpDirectDeposit.eligible'),
    actionTestID: 'goToAppointmentLinkID',
    actionComponent: (
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
